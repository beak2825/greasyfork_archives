// ==UserScript==
// @name         Stonehub
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  small improvements for idlescape's marketplace
// @author       weld, gamergeo, chrOn0os, godi
// @include      *://*idlescape.com/game*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415684/Stonehub.user.js
// @updateURL https://update.greasyfork.org/scripts/415684/Stonehub.meta.js
// ==/UserScript==

class Stonehub {

    /**
     * Stonehub is a tampermonkey extension ; its purpose is to add some QoL on the marketplace.
     * This works by hooking the current running socket and make simple call to the server.
     */

    constructor() {

        /**
         * This dictionnary embed all the pair event-methods.
         * You can easily implement new corresponding methods by adding the event as the key, and a reference to the right method.
         */
        this.event_to_action = {
            "get player marketplace items":this.convenients_marketplace_items_action,
            "get player auctions":this.convenients_sell_item_action,
			"update inventory":this.update_inventory_action
        };

        // some macros
        this.extension_id = 'stonehub'
        this.stonehub_version = "V1.2.0";
        this.status_refresh_time = 5000;

        this.socket_latency     = 2000;
        this.auto_refresh_time  = 1000;
        this.auto_refresh_auction_time  = 5000;

        this.sockets = [];

		// Used for canceling order confirmation
        this.itemID = -1;
        this.inventory_item_id = -1;

        this.update_ui_rate = 500;

		// Used for minPrice Storage
        this.raw_item_id = -1;
        this.min_price = -1;

        this.latest_watched_itemID = -1;

        this.NUMBER_ATTEMPT = 1000;
        this.WAITING_TIMEOUT = 50;

        this.status_div;
        this.activated_extensions = {
            'stonehub':false,
            'updateui':false
        };

    }

    message_handler(that, e) {
        /**
         * Here is the message handler.
         * When a new websocket message is emitted from the server
         * the extension hooks it and call the desired methods.
         * Check out this.event_to_action.
         *
         * All the methods are called with a reference to this/that and the datas the game threw.
         * Please keep at least a reference to that when creating a new method.
         */
        let msg = e.data;
        msg = (msg.match(/^[0-9]+(\[.+)$/) || [])[1];
        if(msg != null){
            let msg_parsed = JSON.parse(msg);
            let [r, data] = msg_parsed;

            // if the event is stored in event_to_action, execute the function
            if(r in that.event_to_action) that.event_to_action[r](that, data);
        }
    }

    error_handler(that, e) {
        let alert_msg = "Something goes wrong with Stonehub ! \nError msg: " + e.message + "\nPlease reload the page or contact messenoire / Gamergeo";
        console.log(e);
        alert(alert_msg);
    }

    start() {
        /**
         * Main part of the extension
         */

        // keeping the track of this, since changing the scope of the function modify it.
        var that = this;

        /* src: https://stackoverflow.com/questions/59915987/get-active-websockets-of-a-website-possible */
        /* Handle the current running socket */
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = function(...args){
            const socket = new nativeWebSocket(...args);
            that.sockets.push(socket);
            return socket;
        };

        // wait for loading to complete, then check which ext is activated and call the main handler
        let page_ready = setInterval(() =>{
            if(document.readyState == 'complete'){
                clearInterval(page_ready);
                that.set_status(that);
                that.retrieve_status_div(that)
                try{
                    if(that.sockets.length != 0){
                        //if it triggers the socket, listen to message
                        that.sockets[0].addEventListener('message', (e) => this.message_handler(that, e));
    
                        // display a logo
                        setTimeout(() => {
                            var usersOnlineDiv = document.getElementById("usersOnline");
                            var spantext = document.createElement('span');
                            spantext.setAttribute("style","color:#54FF9F;text-shadow: 1px 1px 10px #39c70d;background-image:url(https://i.ibb.co/6m0vqhc/bg1.gif);");
                            spantext.appendChild(document.createTextNode(" | Stonehub " + that.stonehub_version));
                            usersOnlineDiv.appendChild(spantext);
                        },  that.socket_latency);
                    }
                    else
                        throw new Error('socket not initialized');
                } catch(e) {that.error_handler(that, e);}
            }
            ;
        }, 200);
    }
}

Stonehub.prototype.create_status_div = function(that) {
    /**
     * <div id='stonehub_status'></div>
     */
    const sdiv = document.createElement('div');
    sdiv.id = 'stonehub_status';
    sdiv.style.display = 'none';
    document.body.appendChild(sdiv);
    return document.getElementById('stonehub_status');
}

Stonehub.prototype.set_status = function(that) {
    if(!that.activated_extensions.stonehub){
        that.status_div = that.status_div ?? that.create_status_div(that);
        let ext_status = document.createElement('div');
        ext_status.id = that.extension_id;
        that.status_div.appendChild(ext_status);
    }
}

Stonehub.prototype.retrieve_status_div = function(that) {
    /**
     * Checks inside <div id='stonehub_status'></div> which script is activated
     * and update its state inside this.activated_extensions
     */
    setInterval(() => {    
        that.status_div = that.status_div ?? that.create_status_div(that);
        [...that.status_div.children].forEach(ext =>{
            that.activated_extensions[ext.id] = true;
        });
        //console.log(that.activated_extensions);
    }, that.status_refresh_time);
}


Stonehub.prototype.int_to_commas = function(x) {
    // src https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    // 10100 into 10,100
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

Stonehub.prototype.commas_to_int = function(s) {
    // 10,100 into 10100
    let result;
    if(typeof s == 'number')
  	    result = s
    else
   	    result = s.replace(/[^\d\.\-]/g, "");
    return parseInt(result);
}

Stonehub.prototype.convenients_marketplace_items_action = function(that, data){

	/**
	 * We need to store the items info for other features
	 */
	that.min_price = data[0].price;
	that.raw_item_id = data[0].itemID;

    /**
     * This method add some convenients and small adjustements to an item page.
     * Current features :
     *      Autorefresh
     */

    // === AUTOREFRESH ==== //
    setTimeout(() => {
        let crafting_table_exists = document.getElementsByClassName('crafting-table marketplace-table');
        if(crafting_table_exists.length != 0)
            that.sockets[0].send('42["get player marketplace items",'+data[0].itemID+']');
    },  that.auto_refresh_time);
}

Stonehub.prototype.show_popup_sell_item = function(that, order_data) {

    let id = order_data.id;
    let itemID = order_data.itemID;
    let inventory_item_id = order_data.inventory_item_id;
    let initial_price = order_data.price;
    let initial_amount =  order_data.stackSize;

    /**
     * This method implements a resell feature
     * Shows when you click on stone button
     */
    let modify_auction_popup_html = `<div role="presentation" class="MuiDialog-root sell-item-dialog" style="position: fixed; z-index: 1300; right: 0px; bottom: 0px; top: 0px; left: 0px;">
                                    <div class="MuiBackdrop-root" aria-hidden="true" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
                                    <div tabindex="0" data-test="sentinelStart"></div>
                                    <div class="MuiDialog-container MuiDialog-scrollPaper" role="none presentation" tabindex="-1" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;">
                                    <div class="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded" role="dialog">
                                        <div class="MuiDialogTitle-root">
                                            <h5 class="MuiTypography-root MuiTypography-h6">Modify Auction</h5>
                                        </div>
                                        <div class="MuiDialogContent-root">
                                            <p class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary">How many do you want to sell?</p>
                                            <input id="amount" type="text" value="`+initial_amount+`">
                                            <p class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary">Price per item you wish to sell<br><span id="lowest-price">Current lowest price on market: <span id="min_price` + itemID + `">0</span>
											<img src="/images/gold_coin.png" alt="Gold coins" class="icon10"></span></p>
                                            <p class="MuiTypography-root MuiDialogContentText-root textography-body1 MuiTypography-colorTextSecondary"></p>
                                            <input id="price" type="text" value="`+ initial_price + `">
                                            <div id='min_price_button_nok' variant="contained" color="secondary" class="item-dialogue-button idlescape-button idlescape-button-red">Adapt price</div>
                                            <div id='min_price_button_ok' style="display:none" variant="contained" color="secondary" class="item-dialogue-button idlescape-button idlescape-button-red">Adapt price</div>
                                            <p class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary">You will receive: <span id='benefits'>0</span> <img src="/images/gold_coin.png" alt="" class="icon16"> <br>After the fee of : <span id='fees'>0</span>  <img src="/images/gold_coin.png" alt="" class="icon16"></p>
                                        </div>
                                        <div class="MuiDialogActions-root MuiDialogActions-spacing">
                                            <div id='close_button' variant="contained" color="secondary" class="item-dialogue-button idlescape-button idlescape-button-red">Close </div>
                                            <div id='sell_button' variant="contained" color="secondary" class="item-dialogue-button idlescape-button idlescape-button-green">Sell </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div tabindex="0" data-test="sentinelEnd"></div>
                                </div>` ;

    let modify_auction_popup = document.createElement('div');
    modify_auction_popup.id = 'modify_auction_popup';
    modify_auction_popup.innerHTML = modify_auction_popup_html;

    // Some CSS styles are not imported. We need to reimplet it
    var style = document.createElement('style');
    style.innerHTML = `.MuiDialogActions-root {
                             flex: 0 0 auto;
                             display: flex;
                             padding: 8px;
                             align-items: center;
                             justify-content: flex-end;
                       }

                       .MuiDialogActions-spacing {
                             margin-left: 0!important;
                       }

                       .MuiDialogActions-spacing > :not(:first-child) {
                             margin-left: 8px;
                       }`;

    modify_auction_popup.appendChild(style)

    let body = document.getElementsByTagName('body')[0];
    body.appendChild(modify_auction_popup);

    let min_price = -1;

    /**
     * Retrieving the min price and setting correct fields
     */
	that.waiting_min_price(that, order_data.itemID)
        .then((min_price) => {
            if (document.getElementById('min_price' + itemID) != null) {
                document.getElementById('min_price' + itemID).innerHTML = that.int_to_commas(min_price)

                document.getElementById('min_price_button_nok').style.display = 'none';
                document.getElementById('min_price_button_ok').style.display = null;

                // Adding Adapt price function
                document.getElementById('min_price_button_ok').addEventListener('click', () => {document.getElementById('price').value = min_price - 1;});
            }
        }).catch((e) => {});

    // smoother ui, add commas to numbers
    let price_changed = false;
    let amount_changed = false;
    let update_ui = setInterval(() => {
        that.update_prices_popup(that, price_changed, amount_changed);
        price_changed = true;
		amount_changed = true;
    }, that.update_ui_rate);

    document.getElementById('sell_button').addEventListener('click', () => {

        // cancel auction
        that.sockets[0].send('42["cancel my auction",'+id+']');

        // make a new auction with the right id
        let price = that.commas_to_int(document.getElementById('price').value);
        let amount = that.commas_to_int(document.getElementById('amount').value);

        // wait to retrieve the inventory_item_id
        that.waiting_inventory_update(that, itemID)
            .then(tosell_id => {
            that.sockets[0].send('42["sell item marketplace",{"amount":'+amount+',"price":'+price+',"dbID":'+tosell_id+'}]');

        }).catch(e => that.error_handler(that, e)); // if we can't find the inventory_item_id);

        // close popup && remove ui updaters
        clearInterval(update_ui);
        that.clean_popup(that);
        price_changed = false;
        amount_changed = false;
    });

    // Waiting for boohi.... (NOK waiting message
    document.getElementById('min_price_button_nok').addEventListener('click', () => {alert("Waiting for Boohi...");});

    document.getElementById('close_button').addEventListener('click', () => {
        // close popup && remove ui updaters
        clearInterval(update_ui);
        that.clean_popup(that);
        price_changed = false;
        amount_changed = false;
    });
}

Stonehub.prototype.clean_popup = function(that) {
    document.getElementById('sell_button').removeEventListener('click');
    document.getElementById('close_button').removeEventListener('click');
    document.getElementById('min_price_button_ok').removeEventListener('click');
    document.getElementById('modify_auction_popup').outerHTML = '';

    that.sockets[0].send('42["get player auctions"]');
}

/**
 * Update price and fees in custom sell pop-up
 */
Stonehub.prototype.update_prices_popup = function(that, price_changed, amount_changed) {
	let popup_still_exists = document.getElementById('modify_auction_popup');
    if (popup_still_exists != null && popup_still_exists.length != 0) {
		let price = price_changed ? that.commas_to_int(document.getElementById('price').value) : parseInt(document.getElementById('price').value);
		let amount = amount_changed ? that.commas_to_int(document.getElementById('amount').value) : parseInt(document.getElementById('amount').value);
		let fees_percentage = 0.05;

		let to_bouilli = (price > 0 || typeof price == 'NaN') ? amount * price * fees_percentage : 1;
		let benefits = (price > 0 || typeof price == 'NaN') ? amount * price - to_bouilli : 0;

		document.getElementById('benefits').innerHTML = that.int_to_commas(Math.floor(benefits));
		document.getElementById('fees').innerHTML = that.int_to_commas(Math.floor(to_bouilli) < 1 ? 1 : Math.floor(to_bouilli));
		document.getElementById('price').value = that.int_to_commas(price);
		document.getElementById('amount').value = that.int_to_commas(amount);
	}
}

Stonehub.prototype.update_inventory_action = function(that, data) {
    /**
     * Update 2 memvars, see waiting_inventory_update for use
     */
    // /!\ there are 3 items ID
    // id, inventory_item_id and itemID

    that.itemID = data.item.itemID;
	that.inventory_item_id = data.item.id;
}

Stonehub.prototype.waiting_inventory_update = function(that, itemID) {
    /**
     * This method returns a promise when called
     * It is used in this.show_popup_sell_item() to get
     * the corresponding IDs of the item being resold.
     * It waits for the right "update inventory" event, checking
     * if the itemID of an updated item is the same as the one passed as argument
     * If so, it resolves by passing inventory_item_id
     * Repeat until you got it, or reject if the process takes too much iteration
     */
    return new Promise((resolve, reject) => {
        let c = 0;
        setTimeout(function check() {
            c = ++c;
            if(that.itemID == itemID)
                resolve(that.inventory_item_id);
            else {
                if(c >= that.NUMBER_ATTEMPT)
                    reject(new Error('timeout waiting to update inventory'));
                else
                    setTimeout(check, that.WAITING_TIMEOUT);
            }

        }, that.WAITING_TIMEOUT);
    });
}

Stonehub.prototype.waiting_min_price = function(that, raw_item_id) {
    /**
     * This method returns a promise when called
     * It is used in this.show_popup_sell_item() to get
     * the corresponding min price of the item shown in the popup
     * It will sends for "get market manifest itemID" and waits for response.
     */

    return new Promise((resolve, reject) => {

		that.sockets[0].send('42["get player marketplace items",' + raw_item_id + ']');

		let c = 0;
        setTimeout(function check() {
            c = ++c;
            if(that.raw_item_id == raw_item_id)
                resolve(that.min_price);
            else {
                if(c >= that.NUMBER_ATTEMPT)
                    reject(new Error('timeout waiting to retrieve min price'));
                else
                    setTimeout(check, that.WAITING_TIMEOUT);
            }

        }, that.WAITING_TIMEOUT);
    });
}

Stonehub.prototype.convenients_sell_item_action = function(that, data) {

    that.clean_auctions();

    /**
     * This method add some convenients and small adjustements to the sell page.
     * Current features :
     *      Button added for further features
     *      Autorefresh when someone bought the item
     */
    if(document.getElementsByClassName('crafting-table marketplace-table').length != 0) {
        // ==== AUTOREFRESH ==== //
        setTimeout(() => {
            let crafting_table_exists = document.getElementsByClassName('crafting-table marketplace-table');
            if(crafting_table_exists.length != 0)
                that.sockets[0].send('42["get player auctions",[]]');
        },  that.auto_refresh_auction_time);
    }

    // ==== STONE BUTTON ==== //
    let auction_table_tbody = document.getElementsByClassName('marketplace-my-auctions')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    let auction_table_tbody_ar= Array.prototype.slice.call(auction_table_tbody);

    // for each auction in the table
    auction_table_tbody_ar.forEach((element, index) => {

        // add button
        let modify_auction_button = document.createElement('td');
        modify_auction_button.className = 'modify_auction_button';
        modify_auction_button.id = data[index].itemID;

        // add the image
        let modify_auction_img    = document.createElement('img');
        modify_auction_img.src    = 'https://idlescape.com/images/mining/bronze_pickaxe.png';
        modify_auction_img.addEventListener('mouseenter', e => e.target.src = 'https://idlescape.com/images/mining/rune_pickaxe.png');
        modify_auction_img.addEventListener('mouseleave', e => e.target.src = 'https://idlescape.com/images/mining/bronze_pickaxe.png');

        modify_auction_button.appendChild(modify_auction_img);

        // listener, popup
        modify_auction_button.addEventListener('click', () => {
            that.show_popup_sell_item(that, data[index]);
        });
        element.appendChild(modify_auction_button);
    });


}

/**
 * Delete all preexisting modifying buttons?
 * Mandatory for update
 */
Stonehub.prototype.clean_auctions = function() {

    let auction_buttons = document.getElementsByClassName('modify_auction_button');
    let auction_id = [];

    for (let i = 0; i < auction_buttons.length; i++) {
        auction_id[i] = auction_buttons[i].id;
    };

    // WARNING : It's mandatory to act in 2 times for this
    auction_id.forEach((element, index) => {
        document.getElementById(auction_id[index]).remove();

    });
}

// ==== MAIN ==== //

try {
    let sh = new Stonehub(); sh.start();
} catch(e) {new Stonehub().error_handler(that, e);}



