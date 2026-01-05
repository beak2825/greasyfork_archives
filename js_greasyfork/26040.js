// ==UserScript==
// @name            Trade Cards batch buyer
// @author          kawa
// @description     based on enhanced steam community, simplified/optimized to only support buying cards for badge craft
// @copyright       kawa
// @version         2016.12.26
// @icon            http://store.steampowered.com/favicon.ico
// @license         GPL version 3 or any later version
// @include         http*://steamcommunity.com/*
// @include         http*://store.steampowered.com/*
// @run-at          document-end
// @grant           GM_xmlhttpRequest
// @namespace       https://greasyfork.org/en/users/89814-kailaiwang
// @downloadURL https://update.greasyfork.org/scripts/26040/Trade%20Cards%20batch%20buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/26040/Trade%20Cards%20batch%20buyer.meta.js
// ==/UserScript==

/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function escMain(){

// try to get lang using cookie
var escSteamLanguage = escGetCookie("Steam_Language");
if(!escSteamLanguage){
    var head = document.head.innerHTML;
    var match = head.match(/l=([a-z]+)/);
    if(match){
        escSteamLanguage = match[1];
    }
}

// default constants
var escT = {
    Market           : "View Cards in Market",
    MarketAll        : "All",
    MarketCard       : "Card",
    MarketBackground : "Background",
    MarketEmoticon   : "Emoticon",
    Inventory        : "View Cards in My Inventory",
    OneClickBuying   : "1-Click buying",
    ViewMarket       : "View in Market",
    SellItem         : "Sell",
	LibrarySearch 	 : "Advanced Search",
    BatchBuyCard     : "Batch buy cards",
    BatchBuyBtn      : "Batch Buy with ",
    BatchBuyConfirm  : "Batch Buy Confirmation",
    BatchBuyMessage  : "Your current buy orders will be canceled. Please keep this window open while placing orders. And you need to pay at most ",
    BatchBuyCheck    : "Fail to fetch market info. You may need to open the market page of any card and try again",
    Confirm          : "Confirm",
    Cancel           : "Cancel",
    Name             : "Name",
    Demand           : "Demand",
    Supply           : "Supply",
    Order            : "Order-Placed",
    Owned            : "Owned",
    Loading          : "Loading...",
    TargetLevel      : "Target Level",
    CurrentLevel     : "Current Level",
    BoosterPack      : "Booster Pack",
    ThreeCardAvg     : "Three Cards",
    Fail             : "Fail",
    BatchBuyModes    : ["Lowest-Sell", "Highest-Buy", "Quick-Buy"]
};

if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/[0-9]+/) ) {
    // badge craft page
    escEnhanceBadges();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/market\/listings\/.+/) ) {
	// market listing page
	// remove 1-click buying checkbox
	// remove custom background
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/market\/search\?.+/) ) {
	// remove enhanced search
    //escEnhanceMarketSearch();
}
else if ( location.href.match(/http[s]?:\/\/store.steampowered.com\/agecheck\/app\/[0-9]+\//) ) {
    // age check page -- skip it
    escSkipAgeCheck();
}
else if ( location.href.match(/http[s]?:\/\/steamcommunity.com\/(id|profiles)\/.+\/inventory/) ) {
    // inventory page
	// remove inventory filtering auto-activate
	// remove enhanced inventory
    // escEnhanceInventory();
}

// kawa TODO what is $J here?
/* function escLibrarySearch(){
    var match = location.href.match(/(id|profiles)\/(.+)\/games/);
    if (match) {
        var id = match[2];
        $J('.sectionTabs').append('<a class="sectionTab" target="_blank" href="http://steam.depar.me/LibrarySearch/#'+id+'"><span>'+escT.LibrarySearch+'</span></a>');
    }
} */


function escEnhanceBadges() {
    var cards = []; // 保存卡片信息
    var booster = null; // 补充包信息
    var appid = location.href.match(/gamecards\/(\d+)(?!\w)/)[1];

    var batch_state = 0;

    var target_level = 5;
    var current_level = 0;
    var cb = jQuery('.badge_current .badge_info_description>div:eq(1)');
    if(cb.length){
        current_level = parseInt(cb.text().match(/\d+/));
    }

    // foil = 1
    var foil = window.location.href.indexOf('?border=1') != -1;
    if(foil){
        foil = 1;
        target_level = 1;
    }else{
        foil = 0;
    }
    var GameName = document.getElementsByClassName("profile_small_header_location")[1].textContent;
    var MarketLink = "http://steamcommunity.com/market/search?q=" + GameName.replace(/ /g,"+") + "+Trading+Card";
    var InventoryLink = document.getElementsByClassName("popup_menu_item header_notification_items")[0].href +"#753_6"+ "?filter=tag_filter_753_6_Game_app_"+appid;
    document.getElementsByClassName("gamecards_inventorylink")[0].innerHTML = "<a class='btn_grey_grey  btn_small_thin' target='_blank' id='batch_buy_card' href=" + MarketLink + "><span>" + escT.BatchBuyCard + "</span></a>&nbsp;<a class='btn_grey_grey  btn_small_thin' target='_blank' href=" + MarketLink + "><span>" + escT.Market + "</span></a>&nbsp;<a class='btn_grey_grey  btn_small_thin' target='_blank' href=" + InventoryLink + "><span>" + escT.Inventory + "</span></a>&nbsp;";

    // convert undefined value to question mark
    function text_wrapper(value){
        if(value!==undefined)
            return value;
        else
            return '?';
    }

    // refresh market table
    function refresh_market_table(){
        
        var content = '<table cellpadding=10 style="margin:auto;font-size:100%;">' ;
        content += '<tr><th>'+escT.MarketCard+'</th><th>'+escT.Name+'</th><th>'+escT.Owned+'</th><th>'+escT.Demand+'</th>';
        for(var j=0;j<escT.BatchBuyModes.length;++j){
            content += '<th>'+escT.BatchBuyModes[j]+'</th>';
        }
        content += '<th>'+escT.Order+'</th></tr>';

        var total_cost = [];
        var is_complete = true; // if we retrieve all the infos
        for(var i=0; i < cards.length; i++){
            var c = cards[i];
            var d = target_level-current_level-c.count;
			// only show cards that are missing
            if(d <= 0) continue;
            if(is_complete && c.price !== undefined){
                for(var cnt = 0;cnt < c.price.length; ++cnt){
                    if(total_cost[cnt] === undefined)
                        total_cost[cnt] = 0;
                    total_cost[cnt] += d * c.price[cnt];
                }
            }else{
                is_complete = false;
            }
            
            content += '<tr><td><img src="'+c.img+'" style="height:32px;"></td><td><a target="_blank" href="http://steamcommunity.com/market/listings/753/'+encodeURIComponent(c.hash)+'">'+c.name+'</td><td>'+c.count+'</a></td><td>'+d+'</td>';
            for(var n=0;n < escT.BatchBuyModes.length;++n){
                if(c.price_text && c.price_text[n]){
                    content += '<td>'+c.price_text[n]+'</td>';
                }else{
                    content += '<td>?</td>';
                }
            }
            content += '<td>'+text_wrapper(c.order)+'</td></tr>';
        }
        content += "</table>" ;

        if(is_complete){
            for(var k=0 ; k < total_cost.length;++k){
                jQuery('.btn_batch_buy:eq('+k+') span.total_cost').text(format_price(total_cost[k]));
            }
            if(batch_state == 1){
                jQuery('.btn_batch_buy').fadeIn();
                batch_state = 2;
            }
        }
        jQuery('#market_data').html(content);
    }

    var g_sessionID = '';
    var g_walletCurrency = '';
    var g_strCountryCode = '';
    var g_strLanguage = '';

    // TODO
    function format_price(price) {
        return v_currencyformat(price*100, GetCurrencyCode(g_walletCurrency), g_strCountryCode);
    }

	// list the i-th card
    function load_card_listing(i){
        if(i >= cards.length)
            return;
        var c = cards[i];
		// skip unknown cards or unwanted ones (means you already have enough)
        if(c.hash === undefined || (target_level - current_level - c.count) <= 0){
            load_card_listing(i+1);
            return;
        }
        jQuery.get('http://steamcommunity.com/market/listings/753/'+encodeURIComponent(c.hash), function(data){
            g_sessionID = data.match(/g_sessionID = "([^"]+)"/)[1];
            g_walletCurrency = parseInt(data.match(/"wallet_currency":(\d+)/)[1]);
            g_strLanguage = data.match(/g_strLanguage = "([^"]+)"/)[1];
            g_strCountryCode = data.match(/g_strCountryCode = "([^"]+)"/)[1];
            var nameid = data.match(/Market_LoadOrderSpread\( (\d+)/)[1];
            // var order = data.match(/id="mybuyorder_(\d+)">[\s\S]*<span class="market_listing_price">\s*(.+?)\s*<\/span>[\s\S]*<span class="market_listing_price">\s*(\S*)/);
            // kawa, get the placed order price correctly
            var order = data.match(/id="mybuyorder_(\d+)">[\s\S]*<span class="market_listing_price">[\s\S]*<span class="market_listing_inline_buyorder_qty">.*<\/span>\s*(\S*)[\s\S]*<span class="market_listing_price">\s*(\S*)/);
            cards[i]['nameid'] = nameid;

            cards[i]['order'] = '0';
            if(order){
                cards[i]['order_id'] = order[1];
                cards[i]['order'] = order[2] + ' * '+ order[3];
            }

            jQuery.ajax({
                url: 'http://steamcommunity.com/market/itemordershistogram',
                type: 'GET',
                data: {
                    country: g_strCountryCode,
                    language: g_strLanguage,
                    currency: g_walletCurrency,
                    item_nameid: nameid
                }
            }).success(function(data){
                cards[i]['price'] = [];
                cards[i]['price_text'] = [];

                // loweest sell
                cards[i]['price'].push(data.sell_order_graph[0][0]);
                cards[i]['price_text'].push(format_price(data.sell_order_graph[0][0])+' * '+data.sell_order_graph[0][1]);

                 // highest buy
                cards[i]['price'].push(data.buy_order_graph[0][0]);
                cards[i]['price_text'].push(format_price(data.buy_order_graph[0][0])+' * '+data.buy_order_graph[0][1]);

				// Quick buy advice
				var th = 0.01 ; // threshold for comparison, todo use format_price
				var quick_buy_price = (data.sell_order_graph[0][0] > (data.buy_order_graph[0][0] + th)) ? (data.buy_order_graph[0][0] + th) : data.sell_order_graph[0][0] ;
				cards[i]['price'].push(quick_buy_price);
				cards[i]['price_text'].push(format_price(quick_buy_price));
                refresh_market_table();
            });

            refresh_market_table();
            setTimeout(function(){load_card_listing(i+1);}, 500);
        }).fail(function(xhr, status, error) {
            alert(escT.BatchBuyCheck);
        });
    }

	// batch buy according to 'mode'
    function batch_buy(mode){
        function cancel_buy(i) {
            if(i==cards.length){
                place_buy(0);
                return;
            }
            if(cards[i].order_id!==undefined){
                jQuery.post('/market/cancelbuyorder/', {sessionid: g_sessionID, buy_orderid: cards[i].order_id}, function(data) {
                    if(data.success==1){
                        cards[i]['order'] = '0';
                    }else{
                        cards[i]['order'] = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function(){cancel_buy(i+1);}, 500);
                });
            }else{
                cancel_buy(i+1);
            }
        }

        function place_buy(i) {
            if(i==cards.length){
                return;
            }
            var c = cards[i];
            var d = target_level-current_level-c.count;
            if(c.hash!==undefined && d>0){
                var p = c.price[mode];
                jQuery.ajax( {
                    url: 'https://steamcommunity.com/market/createbuyorder/',
                    type: 'POST',
                    data: {
                        sessionid: g_sessionID,
                        currency: g_walletCurrency,
                        appid: 753,
                        market_hash_name: c.hash,
                        price_total: Math.round(d*p*100),
                        quantity: d
                    },
                    crossDomain: true,
                    xhrFields: { withCredentials: true }
                }).done(function(data) {
                    if(data.success==1){
                        cards[i]['order'] = d+' * '+format_price(p);
                    }else{
                        cards[i]['order'] = escT.Fail;
                    }
                    refresh_market_table();
                    setTimeout(function(){place_buy(i+1);}, 500);
                });
            }else{
                place_buy(i+1);
            }
        }

        cancel_buy(0);
    }

    jQuery('#batch_buy_card').click(function(){
        if(batch_state === 0){
            batch_state = 1;
            var t = jQuery(this).closest('.badge_detail_tasks');
            t.before('<div class="badge_detail_tasks"><div class="gamecards_inventorylink">'+escT.CurrentLevel+' : <span style="background-color: rgba(0, 0, 0, 0.2); border: 1px solid #000; border-radius: 3px; box-shadow: 1px 1px 0 0 rgba(91, 132, 181, 0.2); color: #909090; width: 30px; display: inline-block;">'+current_level+'</span>&nbsp;'+escT.TargetLevel+' : <input type="text" value="5" id="target_level" style="width:30px;"></div><div class="gamecards_inventorylink" id="market_data">'+escT.Loading+'</div></div><div style="clear: both"></div>');

            var btn = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + escT.BatchBuyBtn + ':&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			var j = 0;
			// kawa, try another btn style, was: btn_grey_grey
            for(j=0; j < escT.BatchBuyModes.length;++j){
                btn += '<a class="btn_grey_grey btn_small_thin btn_batch_buy" style="display:none;" data-mode="'+j+'"><span>'+escT.BatchBuyModes[j]+' <span class="total_cost">?</span></span></a>&nbsp;';
            }

            jQuery('#target_level').after(btn);
            jQuery('.btn_batch_buy').click(function(){
                var b = jQuery(this);
                var tc = b.find('.total_cost').text();
                var m = b.data('mode');
                ShowConfirmDialog(
                    escT.BatchBuyConfirm,
                    escT.BatchBuyMessage+tc,
                    escT.Confirm + ' ('+tc+')',
                    escT.Cancel
                ).done(function(){
                    jQuery('.btn_batch_buy').fadeOut();
                    batch_buy(m);
                });
            });

            jQuery('#target_level').keyup(function(){
                var t = jQuery(this).val();
                if(!isNaN(t)){
                    t = parseInt(t);
                    target_level = t;
                    refresh_market_table();
                }
            });

            jQuery('.badge_detail_tasks>.badge_card_set_card').each(function(){
                var c = jQuery(this);
                var name = c.find('.badge_card_set_text:eq(0)').text().replace(/^\s+\(\d+\)/, '').trim();
                var count = c.find('.badge_card_set_text_qty').text();
                if(count)
                    count = parseInt(count.replace(/[()]/g, ''));
                else
                    count = 0;
                var img = c.find('img.gamecard').attr('src');
                cards.push({
                    'name': name,
                    'img': img,
                    'count': count,
                });
            });

            Array.prototype.findindex = function(callback){
                for(var i=0; i<this.length; ++i){
                    if(callback(this[i])){
                        return i;
                    }
                }
                return -1;
            };

			// kawa TODO
            if(foil===0){
                jQuery.getJSON('http://steamcommunity.com/market/search/render/?category_753_item_class[]=tag_item_class_5&appid=753&category_753_Game[]=tag_app_'+appid, function(data){
                    var list = jQuery('<div>'+data.results_html+'</div>');
                    var l = list.find('.market_listing_row_link');
                    if(l.length==1){
                        var quantity = l.find('.market_listing_num_listings_qty').text();
                        quantity = parseInt(quantity.replace(/[^\d]/, ''));
                        var link = l.attr('href');
                        var price = l.find('.market_listing_their_price .market_table_value>span').text().trim();
                    }
                });
            }

            jQuery.getJSON('http://steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_'+foil+'&appid=753&category_753_Game[]=tag_app_'+appid, function(data){
                var list = jQuery('<div>'+data.results_html+'</div>');
                list.find('.market_listing_row_link').each(function(){
                    var l = jQuery(this);
                    var name = l.find('.market_listing_item_name').text().trim();
                    var img = l.find('.market_listing_item_img').attr('src').replace('/62fx62f', '');
                    var quantity = l.find('.market_listing_num_listings_qty').text();
                    quantity = parseInt(quantity.replace(/[^\d]/, ''));
                    var link = l.attr('href');
                    var hash = link.match(/\/753\/([^?]+)/)[1];
                    hash = decodeURIComponent(hash);
                    var i = -1;
                    var match = null;
                    //i = cards.findindex(function(c){return c.img == img;});
                    var hashname;
                    if(i<0 && (match=hash.match(/\d+-(.*)/))){
                        hashname = match[1].trim();
                        i = cards.findindex(function(c){return c.name == hashname;});
                    }
                    if(i<0 && (match=hash.match(/\d+-(.*)\((Foil|Foil Trading Card|Trading Card)\)/))){
                        hashname = match[1].trim();
                        i = cards.findindex(function(c){return c.name == hashname;});
                    }
                    if(i>-1){
                        cards[i]['quantity'] = quantity;
                        cards[i]['hash'] = hash;
                    }
                    refresh_market_table();
                });
                load_card_listing(0);
            });
        }
        return false;
    });

    //highlight quantity
    var length = document.getElementsByClassName("badge_card_set_text_qty").length;
    for(var i = 0; i < length; ++i) {
        document.getElementsByClassName("badge_card_set_text_qty")[i].style.color = "#F00";
    }
}

function escListingClickPurchase(){
    $('market_buynow_dialog_purchase').click();
    $('market_buynow_dialog_cancel').click();
}

// cookies getter
function escGetCookie(c_name) {
	var r = "";
	if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";",c_start);
            if(c_end == -1) c_end = document.cookie.length;
			r = unescape( document.cookie.substring(c_start,c_end) );
        }
    }
    return r;
}

// Cookie setter
function escSetCookie(c_name,value,expiredays) {
    var exdate = new Date();
    exdate.setDate( exdate.getDate() + expiredays );
    document.cookie = c_name + "=" + escape(value) + ( (expiredays === null) ? "" : "; expires=" + exdate.toGMTString() ) + ";path=/";
}

// LS getter
function escGetLS(key){
    var val = null;
    if(typeof localStorage !== undefined && localStorage["esc_"+key] !== undefined){
        val = JSON.parse(localStorage["esc_"+key]);
    }
    return val;
}

// LS setter
function escSetLS(key, val){
    if(typeof localStorage !== undefined){
        localStorage["esc_"+key] = JSON.stringify(val);
    }
}

// skip age confirmation
function escSkipAgeCheck() {
    escSetCookie("birthtime",-473356799,365);
    window.location = window.location;
}
}

// insert escMain to webpage
var script = escMain.toString();
script = script.slice(script.indexOf('{')+1, -1);
var newElem = document.createElement('script');
newElem.type = 'text/javascript';
newElem.innerHTML = script;
document.body.appendChild(newElem);
