// ==UserScript==
// @name        Steam Trade Offer Enhancer
// @namespace   http://steamcommunity.com/id/H_s_K/
// @description Browser script to enhance Steam trade offers.
// @include     /^https?:\/\/steamcommunity\.com\/(id|profiles)\/.*\/tradeoffers.*/
// @include     /^https?:\/\/steamcommunity\.com\/tradeoffer.*/
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @version     1.7.0
// @author      HusKy & gortik
// @downloadURL https://update.greasyfork.org/scripts/457017/Steam%20Trade%20Offer%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/457017/Steam%20Trade%20Offer%20Enhancer.meta.js
// ==/UserScript==

//https://github.com/scholtzm/steam-trade-offer-enhancer/blob/master/steam.trade.offer.enhancer.user.js

/*
  1.4.4: toast/notification added
  1.4.5: fix array.find
  1.5.0: changing scrap/rec for ref added
  1.6.0: added option for searching by default or by only by market_name (shows even renamed items)
  1.7.0: add strange parts to trade offer added
*/

var eventsFilter = {
    name: 'Clorthax',
    apply: 0
}

let steam_MatchItemTerms = null;

var tradeOfferAdd = (function() {
    //var salien = {name: "market_fee_app", value: "1195670"}
    let tf2_metal = [	{name: 'name', value: 'Refined Metal', skip: 0, limit: 58},
                     {name: 'name', value: 'Reclaimed Metal', limit: 0},
                     {name: 'name', value: 'Scrap Metal', limit: 0}],
        _tf2_currency, //currency in inventory
        _change_ref; //how many ref from changing scrap/rec; its added when buying from bot

    //addMetal(5,5.55)
    function addMetal(input) {	//metalCount
        let refC, recC, scrapC, keyC, skip = 0, metalFilters = [];
        input = input.trim();
        console.log(input);

        //5,5.55 ~ skips 5 last refined and adds 5.55 ref
        if (input.indexOf(';') != -1) {
            let reg = input.match(/(\d+)\s*;\s*([\d.]+)/)
            skip = reg[1];
            input = reg[2]
        //3k 55.11 | 3keys | 5 | 2 keys, 24.88
        } else {
            let reg = input.match(/(?:(\d+)\s*k(?:eys?)?)?[,\s]*(\d+\.?\d*)?/i);
            console.log(reg)
            keyC = reg[1] ? reg[1] : 0;
            input = reg[2] ? reg[2] : 0;
        }

        refC = Math.floor(input);
        input = roundTo2Dec(input - refC);
        recC = Math.floor(input / 0.33);
        input = roundTo2Dec(input - (recC*0.33));
        scrapC = Math.floor(input / 0.11);

        if ( _change_ref ) {
            mtoast.msg( `Adding ${_change_ref} ref from change.` );
            refC += _change_ref;
            //_change_ref = null;
        }
        metalFilters.push(createFilter('name', 'Scrap Metal', scrapC));
        metalFilters.push(createFilter('name', 'Reclaimed Metal', recC));
        metalFilters.push(createFilter('name', 'Refined Metal', refC, skip));
        metalFilters.push(createFilter('name', 'Mann Co. Supply Crate Key', keyC));

        console.log('Keys: ' + keyC);
        console.log('Skip: ' + skip);
        console.log('Refined: ' + refC);
        console.log('Reclaimed: ' + recC);
        console.log('Scrap: ' + scrapC);
        filterItems(metalFilters);
    }

    function createFilter(name, value, limit, skip = 0) {
        return {name: name, value: value, limit: limit, skip: skip};
    }

    function filterItems(filters) {
        var pages = document.querySelectorAll('.inventory_ctn:not([style*="display: none"]) .inventory_page');

        if (pages.length == 0) {
            setTimeout(function() {
                filterItems(filters);
            }, 500);
            return;
        }

        //going trough inventory backwards -- less chance it will be taken by others
        //todo
        for (var i = pages.length-1; i > -1; i--) {
            var items = pages[i].querySelectorAll('.item');
            for (var j = items.length-1; j > -1; j--) {
                if (applyFilters(items[j].rgItem, filters)) {
                    GTradeStateManager.SetItemInTrade(items[j].rgItem, 0);
                    console.log(items[j].rgItem.id);
                }
            }
        }
        printFiltersStatus(filters);
    }

    function roundTo2Dec(x) {
        return Math.round(x * 100) / 100;
    }

    function printFiltersStatus(filters) {
        filters.forEach(filter => {
            console.log(filter.name + '-' + filter.value + ': ' + filter.limit + ' remains');
            if (filter.limit)
                alert(filter.name + '-' + filter.value + ': ' + filter.limit + ' remains');
        });
    }

    function applyFilters(rgItem, filters) {
        for (var i = 0; i < filters.length; i++)
            if (applyFilter(rgItem, filters[i])) {
                return true;
            }
        return false;
    }

    function applyFilter(rgItem, filter) {
        //(filter.skip == undefined || filter.skip-- == 0)	//skips X items with desired name (returns false) and only after that start removing items from limit
        return (rgItem[filter.name] === filter.value) && filter.limit > 0 && (filter.skip == undefined || filter.skip-- < 1) ? filter.limit-- : false;
    }

    //adds all filtered items to trade offer
    function addAll(amount) {
        var arr = document.querySelector('.inventory_ctn:not([style*="display: none"])').querySelectorAll('.inventory_page');
        if (isNaN(amount)) amount = -1;

        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].querySelectorAll('.itemHolder:not([style*="display: none"]) .item');
            for (var j = 0; j < arr2.length; j++) {
                if (amount-- == 0)
                    return;
                GTradeStateManager.SetItemInTrade(arr2[j].rgItem, 0);
            }
        }
    }

    function _convertMetal( curr ) {
        let	rec = 0,
            ref = curr[ 'Refined Metal' ].val;

        //whole integer division ~~(5/2) => 2
        //scrap
        //how many rec from scrap
        rec = ~~( curr[ 'Scrap Metal' ].val / 3 );
        //rest of scrap add to ref (0.11 or 0.22)
        ref += ( curr[ 'Scrap Metal' ].val % 3 ) * 0.11;
        //rec
        //how many ref from rec + rec from scrap
        ref += ~~( ( rec + curr[ 'Reclaimed Metal' ].val ) / 3 );
        //rest of rec add to ref (0.33 or 0.66)
        ref += ( ( rec + curr[ 'Reclaimed Metal' ].val ) % 3 ) * 0.33;
        //round to last 2 digits
        ref = ref.toFixed(2) * 1;
        return ref;
    }

    //how many metals and keys are in inventory
    function getCurrency() {
        //only TF2
        if ( g_ActiveInventory.appid != 440 )
            return;

        const tf2_currency = {
            'Refined Metal': {
                name: 'ref',
                val: 0
            },
            'Reclaimed Metal': {
                name: 'rec',
                val: 0
            },
            'Scrap Metal': {
                name: 'scrap',
                val: 0
            },
            'Mann Co. Supply Crate Key': {
                name: 'key',
                val: 0
            },
            'ref': 0
        }
        let items = g_ActiveInventory.elInventory.querySelectorAll( '.item.app440' );
        //count metals and key
        items.forEach( item => {
            let currency = tf2_currency[ item.rgItem.market_name ];
            if ( currency )
                currency.val++;
        } );

        console.log( _convertMetal( tf2_currency ) );
        _tf2_currency = tf2_currency;
        return tf2_currency;
    }

    //changes scrap/rec to ref if amount of them is more than 3
    function changeMetal() {
        getCurrency();
        //assign method copies all enumerable own properties from one or more source objects to a target object.
        let curr = Object.assign( {}, _tf2_currency),
            min_amount = 3,
            metal_filters = [],
            scrap, rec, ref;

        ref = _convertMetal( curr );
        //changing only if sum ref is more than 1 ref
        if ( ref < 1 )
            return;
        //how many rec from scrap
        rec = ~~( curr[ 'Scrap Metal' ].val / 3 );
        //how many ref from rec + rec from scrap
        ref = ~~( ( rec + curr[ 'Reclaimed Metal' ].val ) / 3 );
        _change_ref = ref;
        //how many scrap or rec were converted
        scrap = rec * 3;
        rec = ref * 3 - rec;
        mtoast.msg( `Changing ${ref} ref for ${rec} rec and ${scrap} scrap.` );

        metal_filters.push( createFilter( 'name', 'Scrap Metal', scrap )) ;
        metal_filters.push( createFilter( 'name', 'Reclaimed Metal', rec ) );
        filterItems(metal_filters);
    }

    return {
        addMetal: addMetal,
        addAll: addAll,
        changeMetal: changeMetal,
        getCurrency: getCurrency
    }
})();

/*
 Adds items by assetids
*/
var tradeOfferAddItems = (function() {
    //either their or ours
    let	_actSteamID
    ,_is_their_item;

    //add items by one assetid or array of assetids
    function add(assetids) {
        let	count = 0;
        //if assetids == null show prompt for user input
        assetids = assetids ? [].concat(assetids) : _parseClassIDs(prompt('Add assetids:', ''));

        _actSteamID = _getSteamID();
        console.log(assetids);

        for (let id of assetids)
            count += _addItemByAssetID(id);

        mtoast.msg( `${count} of ${assetids.length} items added to trade offer.` );
    }

    function _addItemByAssetID(assetid) {
        let itemFound = _findItem(assetid);

        if (!itemFound)
            return 0;

        itemFound.is_their_item = _is_their_item;
        GTradeStateManager.SetItemInTrade(itemFound, 0);
        return 1;
    }

    function _findItem(assetid) {
        let	items = document.querySelectorAll('#inventory_' + _actSteamID + '_440_2 .itemHolder:not(.disabled)')
        ,itemFound;

        //id == assetid
        //itemFound = [...items].find(item => item.rgItem.id == assetid);
        items.forEach( e => { if ( e.rgItem.id == assetid ) itemFound = e } );

        if (!itemFound) {
            mtoast.msg( 'Item: ' + assetid + ' wasn\'t found.' );
            return null
        } else
            return itemFound.rgItem;
    }

    function _parseClassIDs(assetids) {
        let	re = /\d{9}/g,
            arr = [], match;

        arr =  assetids.split(/\s+/);
        console.log('AssetIDs added: ' + arr.length);
        return arr;
    }

    function _getSteamID() {
        //v1
        //let regex = document.documentElement.innerHTML.match(/g_steamID = "(\d+)"/);
        //v2
        //return g_steamID;
        //v3
        //inventory NOT with style: "display: none"
        let youTheirInv = document.querySelector('#inventories > div[id^="inventory_"]:not([style*="display: none"])');
        if (youTheirInv && youTheirInv.id) {
            let tradeID = youTheirInv.id.match(/_(\d+)_/)[1];
            if (tradeID == g_steamID) {
                console.log('Adding to our inventory.');
                _is_their_item = false;
            }
            else {
                console.log('Adding to their inventory.');
                _is_their_item = true;
            }
            return tradeID;
        }
        else {
            console.log('Steam ID not found.');
            return null;
        }
    }

    return {
        add: add
    }
})();

// returns value of atribute defined by path in object
function resolvePath ( object, path, defaultValue ) {
	return path
		//'part3[1].name' -> ["part3", "1", "", "name"]
		.split( /[\.\[\]\'\"]/ )
		//removes empty strings
		.filter( p => p )
		.reduce( ( obj, path ) => obj ? obj[path] : defaultValue, object );
}

// get items by filter
function getItems( path, value ) {
	//path = 'type' | 'descriptions[2]' | 'name'
	//only TF2
        if ( g_ActiveInventory.appid != 440 )
            return;

	let	items = g_ActiveInventory.elInventory.querySelectorAll( '.item.app440' );
	let	found_items = [];

	items.forEach( item => {
		//inventory or trade_offer api
		item = item.rgItem || item;
		let	item_value = resolvePath( item, path );

		if ( item_value == value )
			found_items.push( item );
        } );
	return found_items;
}

function getStrangeParts() {
	return getItems( 'type', 'Level 1 Strange Part' );
}

function addStrangePartsToTradeOffer() {
	//how many keep from each kind (demomen, soldiers, dominations, ...)
	const	KEEP_COUNT = prompt( 'How many items keep from each type?', 3 ) * 1;
	//stats about parts_stats
	let	parts_stats = {},
		items = getStrangeParts(),
		Part_Obj = function() {
			this.keep = KEEP_COUNT;
			this.assetids = [];
			this.count = 0;
		},
		total_count = 0;

	items.forEach( item => {
		let	name = item.market_name,
			//clones empty_object
			part = parts_stats[ name ] || new Part_Obj();

		parts_stats[ name ] = part;
		part.count++;
		total_count++;
		//keeping some of parts in inventory
		if ( part.keep-- > 0 )
			return;
		part.assetids.push( item.id );
	});
	//this way same items will be next to each in trade offer
	let	assetids = Object.values( parts_stats ).reduce( (acc, val) => acc.concat( val.assetids ), [] );
	mtoast.msg( `Add ${assetids.length} of ${total_count} strange parts.` );
	tradeOfferAddItems.add( assetids );
	console.log( parts_stats );
}



//match items only by their market_name
function hookMatchItems( match_items_by_market_name ) {
    console.log( 'hookMatchItems: ' + match_items_by_market_name );
    if ( steam_MatchItemTerms == null )
        steam_MatchItemTerms = Filter.MatchItemTerms;

    function my_MatchItemTerms( elItem, rgTerms )	{
        if ( !rgTerms )
            return true;

        var bMatch = false;
        var name = elItem.rgItem.market_name || elItem.rgItem.name;
        var type = elItem.rgItem.type;
        var descriptions = elItem.rgItem.descriptions;
        //from multiple regExps creates one with ' ' as separator
        let term = rgTerms.reduce( (acc, val) => { acc.push(val.source); return acc }, [] ).join(' ');
        //it was already escaped by valve script
        term = new RegExp(/*RegExp.escape*/(term), 'i');

        //for event cards
        if (eventsFilter.apply) {
            if (name.indexOf(eventsFilter.name) != -1)
                return true;
            else
                return false;
        }

        if (name.match(term))
            return true;
        else
            return false;
    }
    Filter.MatchItemTerms = match_items_by_market_name ? my_MatchItemTerms : steam_MatchItemTerms;
}

function setMatchItemsByMarketName( state ) {
	let checkbox = document.querySelector( '#tag_match_items_type' );
	checkbox.checked = state;
	checkbox.dispatchEvent( new Event( 'change' ) );
}


function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


function getUrlParam(paramName) {
    var params = window.location.search.split(/\?|\&/);
    for(let i = 0; i < params.length; i++) {
        var currentParam = params[i].split("=");
        if(currentParam[0] === paramName) {
            return currentParam[1];
        }
    }
}

// array of dangerous descriptions
var dangerous_descriptions = [
    {
        tag: "spelled",
        description: "spell only"
    },
    {
        tag: "uncraftable",
        description: "Not Usable in Crafting"
    },
    {
        tag: "gifted",
        description: "Gift from:"
    }
];

// array of rare TF2 keys (defindexes)
var rare_TF2_keys = [
    "5049", "5067", "5072", "5073",
    "5079", "5081", "5628", "5631",
    "5632", "5713", "5716", "5717",
    "5762"
];

var tradeOfferPage = {
    evaluate_items: function(items) {
        var result = {};

        result._total = items.find("div.trade_item").length;

        items.find("div.trade_item").each(function() {
            var img = jQuery(this).find("img").attr("src");
            var quality = jQuery(this).css("border-top-color");

            if(result[img] === undefined)
                result[img] = {};

            if(result[img][quality] === undefined) {
                result[img][quality] = 1;
            } else {
                result[img][quality]++;
            }
        });

        return result;
    },

    dump_summary: function(tradeoffer, type, items) {
        if(items._total <= 0) return;

        var htmlstring = "Summary (" + items._total + " " + (items._total === 1 ? "item" : "items") + "):<br>";

        for(var prop in items) {
            if(prop === "_total") continue;

            var item_type = items[prop];
            for(var quality in item_type) {
                htmlstring += "<span class=\"summary_item\" style=\"background-image: url('" + prop + "'); border-color: " + quality + ";\"><span class=\"summary_badge\">" + item_type[quality] + "</span></span>";
            }
        }

        htmlstring += "<br><br>Items:<br>";
        tradeoffer.find("div." + type + " > div.tradeoffer_items_header")
            .after("<div class=\"tradeoffer_items_summary\">" + htmlstring + "</div>");
    },

    attach_links: function(tradeoffer) {
        var avatar = tradeoffer.find("div.tradeoffer_items.primary").find("a.tradeoffer_avatar");

        if(avatar.length > 0) {
            var profileUrl = avatar.attr("href").match(/^https?:\/\/steamcommunity\.com\/(id|profiles)\/(.*)/);
            if(profileUrl) {
                tradeoffer.find("div.tradeoffer_footer_actions").append(" | <a class='whiteLink' target='_blank' href='http://rep.tf/" + profileUrl[2] + "'>rep.tf</a>");
            }
        }
    }
};

var tradeOfferWindow = {
    evaluate_items: function(items) {
        var result = {};
        result._total = 0;
        result._warnings = [];

        var slot_inner = items.find("div.slot_inner");

        slot_inner.each(function() {
            if(jQuery(this).html() !== "" && jQuery(this).html() !== null) {
                result._total++;
                var item = jQuery(this).find("div.item");

                var img = item.find("img").attr("src");
                var quality = item.css("border-top-color");

                if(result[img] === undefined)
                    result[img] = {};

                if(result[img][quality] === undefined) {
                    result[img][quality] = 1;
                } else {
                    result[img][quality]++;
                }

                // let's check item's info
                var appid = item[0].id.split("_")[0].replace("item", "");
                var contextid = item[0].id.split("_")[1];
                var assetid = item[0].id.split("_")[2];

                var inventory_item;
                if(items[0].id === "your_slots")
                    inventory_item = unsafeWindow.g_rgAppContextData[appid].rgContexts[contextid]
                        .inventory.rgInventory[assetid];
                else
                    inventory_item = unsafeWindow.g_rgPartnerAppContextData[appid].rgContexts[contextid]
                        .inventory.rgInventory[assetid];

                var descriptions = inventory_item.descriptions;
                var appdata = inventory_item.app_data;
                var fraudwarnings = inventory_item.fraudwarnings;

                var warning_text;

                if(typeof descriptions === "object") {
                    descriptions.forEach(function(d1) {
                        dangerous_descriptions.forEach(function(d2) {
                            if(d1.value.indexOf(d2.description) > -1) {
                                var warning_text = "Offer contains " + d2.tag + " item(s).";
                                if(result._warnings.indexOf(warning_text) === -1) {
                                    if (d2.tag == 'spelled') {
                                        //if color is differenr it's fake spelled item
                                        if ( d1.color !== '7ea9d1' )
                                            return;
                                        alert('Spelled Item');
                                    }
                                    result._warnings.push(warning_text);
                                }
                            }
                        });
                    });
                }

                if(typeof appdata === "object" && typeof appdata.def_index === "string") {
                    if(rare_TF2_keys.indexOf(appdata.def_index) > -1) {
                        warning_text = "Offer contains rare TF2 key(s).";
                        if(result._warnings.indexOf(warning_text) === -1)
                            result._warnings.push(warning_text);
                    }
                }

                if(typeof fraudwarnings === "object") {
                    fraudwarnings.forEach(function(text) {
                        if(text.indexOf("restricted gift") > -1) {
                            warning_text = "Offer contains restricted gift(s).";
                            if(result._warnings.indexOf(warning_text) === -1)
                                result._warnings.push(warning_text);
                        }
                    });
                }

            }
        });

        return result;
    },

    dump_summary: function(target, type, items) {
        if(items._total <= 0) return;

        var htmlstring = type + " summary (" + items._total + " " + (items._total === 1 ? "item" : "items") + "):<br>";

        // item counts
        for(var prop in items) {
            if(prop.indexOf("_") === 0) continue;

            var item_type = items[prop];
            for(var quality in item_type) {
                htmlstring += "<span class=\"summary_item\" style=\"background-image: url('" + prop + "'); border-color: " + quality + ";\"><span class=\"summary_badge\">" + item_type[quality] + "</span></span>";
            }
        }

        // warnings
        if(items._warnings.length > 0) {
            htmlstring += "<span class=\"warning\"><br>Warning:<br>";
            items._warnings.forEach(function(warning, index) {
                htmlstring += warning;

                if(index < items._warnings.length - 1) {
                    htmlstring += "<br>";
                }
            });
            htmlstring += "</span>";
        }

        target.append(htmlstring);
    },

    summarise: function() {
        var target = jQuery("div.tradeoffer_items_summary");
        target.html("");

        var mine = jQuery("div#your_slots");
        var other = jQuery("div#their_slots");

        var my_items = this.evaluate_items(mine);
        var other_items = this.evaluate_items(other);

        this.dump_summary(target, "My", my_items);
        if(other_items._total > 0) target.append("<br><br>");
        this.dump_summary(target, "Their", other_items);
    },

    init: function() {
        var self = this;

        // something is loading
        var isReady = jQuery("img[src$='throbber.gif']:visible").length <= 0;

        // our partner's inventory is also loading at this point
        var itemParamExists = getUrlParam("for_item") !== undefined;
        var hasBeenLoaded = true;

        if(itemParamExists) {
            // format: for_item=<appId>_<contextId>_<itemId>
            var item = getUrlParam("for_item").split("_");
            hasBeenLoaded = jQuery("div#inventory_" + UserThem.strSteamId + "_" + item[0] + "_" + item[1]).length > 0;
        }

        if(isReady && (!itemParamExists || hasBeenLoaded)) {
            setTimeout(function() {
                self.summarise();
            }, 500);

            return;
        }

        if(itemParamExists && hasBeenLoaded) {
            setTimeout(self.deadItem.bind(self), 5000);
            return;
        }

        setTimeout(function() {
            self.init();
        }, 250);
    },

    deadItem: function() {
        var deadItemExists = jQuery("a[href$='_undefined']").length > 0;
        var item = getUrlParam("for_item").split("_");

        if(deadItemExists) {
            unsafeWindow.g_rgCurrentTradeStatus.them.assets = [];
            RefreshTradeStatus(g_rgCurrentTradeStatus, true);
            alert("Seems like the item you are looking to buy (ID: " + item[2] + ") is no longer available. You should check other user's backpack and see if it's still there.");
        } else {
            // Something was loading very slowly, restart init...
            this.init();
        }
    },

    clear: function(slots) {
        var timeout = 100;

        var added_items = jQuery(slots);
        var items = added_items.find("div.itemHolder").find("div.item");

        for(i = 0; i < items.length; i++) {
            setTimeout(MoveItemToInventory, i * timeout, items[i]);
        }

        setTimeout(function() {
            tradeOfferWindow.summarise();
        }, items.length * timeout + 500);
    }
};

jQuery(function() {

    var location = window.location.pathname;

    // Append CSS style.
    var style = "<style type='text/css'>" +
        ".tradeoffer_items_summary { color: #fff; font-size: 10px; }" +
        ".warning { color: #ff4422; }" +
        ".info { padding: 1px 3px; border-radius: 4px; background-color: #1155FF; border: 1px solid #003399; font-size: 14px; }" +
        ".summary_item { padding: 3px; margin: 0 2px 2px 0; background-color: #3C352E;background-position: center; background-size: 48px 48px; background-repeat: no-repeat; border: 1px solid; font-size: 16px; width: 48px; height: 48px; display: inline-block; }" +
        ".summary_badge { padding: 1px 3px; border-radius: 4px; background-color: #0099CC; border: 1px solid #003399; font-size: 12px; }" +
        ".btn_custom { border-width: 0; background-color: black; border-radius: 2px; font-family: Arial; color: white; line-height: 20px; font-size: 12px; padding: 0 15px; vertical-align: middle; cursor: pointer; }" +
        ".btn_custom + .btn_custom { margin-left: 10px; }" +
        "</style>";
    jQuery(style).appendTo("head");

    // Trade offer page with multiple trade offers ...
    if(location.indexOf("tradeoffers") > -1) {

        // Retrieve all trade offers.
        var trade_offers = jQuery("div.tradeoffer");

        if(trade_offers.length > 0) {
            trade_offers.each(function() {
                var others = jQuery(this).find("div.primary > div.tradeoffer_item_list");
                var mine = jQuery(this).find("div.secondary > div.tradeoffer_item_list");

                // Evaluate both sides.
                var other_items = tradeOfferPage.evaluate_items(others);
                var my_items = tradeOfferPage.evaluate_items(mine);

                // Dump the summaries somewhere ...
                tradeOfferPage.dump_summary(jQuery(this), "primary", other_items);
                tradeOfferPage.dump_summary(jQuery(this), "secondary", my_items);

                // Check if trade offer is "unavailable"
                // Do this only for /tradeoffers page and nothing else
                var is_ok = location.indexOf("tradeoffers", location.length - "tradeoffers".length) !== -1;
                is_ok = is_ok || location.indexOf("tradeoffers/", location.length - "tradeoffers/".length) !== -1;

                if(is_ok) {
                    // Attach links
                    tradeOfferPage.attach_links(jQuery(this));

                    var is_unavailable = jQuery(this).find("div.tradeoffer_items_banner").text().indexOf("Items Now Unavailable For Trade") > -1;
                    if(is_unavailable) {
                        var trade_offer_id = jQuery(this).attr("id").split("_")[1];
                        var footer = jQuery(this).find("div.tradeoffer_footer");

                        var text = "<span class=\"info\">This trade offer is stuck and invalid, but you can still <strong>decline</strong> it.</span>";
                        footer.prepend("<div class=\"tradeoffer_footer_actions\"><a class=\"whiteLink\" href=\"javascript:DeclineTradeOffer('" + trade_offer_id + "');\">" + text + "</a></div>");
                    }
                }
            });
        }

        // Single trade offer window ...
    } else if(location.indexOf("tradeoffer") > -1) {

        // Append new divs ...
        jQuery("div.trade_left div.trade_box_contents").append("<div class=\"trade_rule selectableNone\"/><div class=\"item_adder\"/>");
        jQuery("div.item_adder").append("<div class=\"selectableNone\">Add multiple items (; for skip):</div>");
        jQuery("div.item_adder").append("<input id=\"amount_control\" class=\"filter_search_box\" type=\"text\" placeholder=\"0\"> ");
        jQuery("div.item_adder").append("<button id=\"btn_additems\" type=\"button\" class=\"btn_custom\">Add</button><br><br>");

        //adds all displayed items from all pages
        jQuery("div.item_adder").append("<button id=\"btn_addall\" type=\"button\" class=\"btn_custom\">Add all</button>");
        //adds items by classIDs from input
        jQuery("div.item_adder").append("<button id=\"btn_assetid\" type=\"button\" class=\"btn_custom\">AssetID</button>");
        //my scrap/reclaimed metal for theirs refined
        jQuery("div.item_adder").append("<button id=\"btn_metal_change\" type=\"button\" class=\"btn_custom\">Change</button>");
		//Add strange parts to trade offer.
		jQuery("div.item_adder").append("<button id=\"btn_strange_parts\" type=\"button\" class=\"btn_custom\">Parts</button>");

        jQuery("div.item_adder").append("<br><br> <div class=\"econ_tag_filter_container\"><input class=\"\" type=\"checkbox\" id=\"tag_match_items_type\"><label class=\"tag_match_items_type_label\" for=\"tag_match_items_type\">Match items by market_name</label></div>");

        jQuery("div.item_adder").append("<br> <button id=\"btn_clearmyitems\" type=\"button\" class=\"btn_custom\">Clear my items</button>");
        jQuery("div.item_adder").append("<button id=\"btn_cleartheiritems\" type=\"button\" class=\"btn_custom\">Clear their items</button>");

        jQuery("div.trade_left div.trade_box_contents").append("<div class=\"trade_rule selectableNone\"/><div class=\"tradeoffer_items_summary\"/>");


        // Refresh summaries whenever ...
        jQuery("body").click(function() {
            setTimeout(function() {
                tradeOfferWindow.summarise();
            }, 500);
        });

        // hack to fix empty space under inventory
        // TODO get rid of this if they ever fix it
        /*   setInterval(function() {
        if(jQuery("#inventory_displaycontrols").height() > 50) {
            if(jQuery("div#inventories").css("marginBottom") === "8px") {
                jQuery("div#inventories").css("marginBottom", "7px");
            } else {
                jQuery("div#inventories").css("marginBottom", "8px");
            }
        }
    }, 500);*/

        // Handle item auto adder
        jQuery("button#btn_additems").click(function() {
            // Do not add items if the offer cannot be modified
            if(jQuery("div.modify_trade_offer:visible").length > 0) return;

            let amount = jQuery("input#amount_control").val();
            copyToClipboard(amount);
            tradeOfferAdd.addMetal(amount);
            // Collect all items
            /*   var inventory = jQuery("div.inventory_ctn:visible");
        var items = inventory.find("div.itemHolder").filter(function() {
            return jQuery(this).css("display") !== "none";
        }).find("div.item").filter(function() {
            return jQuery(this).css("display") !== "none";
        });

        // Get amount value
        var amount = parseInt(jQuery("input#amount_control").val());
        if(isNaN(amount)) amount = 16;
        if(items.length < amount) amount = items.length;

        // Add all items
        for(i = 0; i < amount; i++) {
            setTimeout(MoveItemToTrade, i * 50, items[i]);
        }*/

            // Refresh summaries
            /* setTimeout(function() {
            tradeOfferWindow.summarise();
        }, amount * 50 + 500);*/
        });

        jQuery("button#btn_clearmyitems").click(function() {
            tradeOfferWindow.clear("div#your_slots");
        });

        jQuery("button#btn_cleartheiritems").click(function() {
            tradeOfferWindow.clear("div#their_slots");
        });

        jQuery("button#btn_addall").click(function() {
            let amount = jQuery("input#amount_control").val();
            tradeOfferAdd.addAll(amount);
        });

        jQuery("button#btn_assetid").click(function() {
            tradeOfferAddItems.add();
        });

        jQuery("button#btn_metal_change").click(function() {
            tradeOfferAdd.changeMetal();
        });

		jQuery("button#btn_strange_parts").click(function() {
            addStrangePartsToTradeOffer();
        });

		document.querySelector( '#tag_match_items_type' ).addEventListener( 'change', (e) => {
			let check_state = e.target.checked;
			// input element for search in tradeoffer
			let search_input = document.querySelector( '#filter_control' );
            hookMatchItems( check_state );
			//match items by market_name value
			if ( check_state == 1 )
				//awpx --> awp  ApplyFilter shows more items --> checks only hidden items
				Filter.strLastFilter = search_input.value ? search_input.value + 'x' : Filter.strLastFilter;
			//original match items by name and descriptions
			else
				//a --> awp  ApplyFilter hides items --> checks only visible items
				Filter.strLastFilter = search_input.value[0] || '';

			Filter.strLastFilter = search_input.value + 'x';
			search_input.dispatchEvent( new Event( 'keyup' ) );
			Filter.strLastFilter = search_input.value[0] || '';
			search_input.dispatchEvent( new Event( 'keyup' ) );
        });

        tradeOfferWindow.init();

        /*g_rgCurrentTradeStatus.me.assets.push({
            "appid":440,
            "contextid":2,
            "assetid":'9370685747',
            "amount":1
        });*/

        //hookMatchItems();
        //Auto adds price & desc from backpack.tf to editBox @gortik
        let urlValue = getUrlParam("price");
        if (urlValue) {
            jQuery("input#amount_control").val(decodeURI(urlValue));
        }
        urlValue = getUrlParam("desc");
        if (urlValue) {
            jQuery("input#filter_control").val(decodeURI(urlValue));
        }
        if (urlValue || eventsFilter.apply) {
            if (eventsFilter.apply) {
                console.log('Event filter is on.');
                jQuery("input#amount_control").val(16);
                //Filter.ApplyFilter('.');
            }
            setMatchItemsByMarketName( true );
        }
        ////////////////////

        var itemParam = getUrlParam("for_item");
        if(itemParam !== undefined) {
            var item = itemParam.split("_");

            unsafeWindow.g_rgCurrentTradeStatus.them.assets.push({
                "appid":item[0],
                "contextid":item[1],
                "assetid":item[2],
                "amount":1
            });

            RefreshTradeStatus(g_rgCurrentTradeStatus, true);
        }

        if(unsafeWindow.g_daysMyEscrow > 0) {
            var hours = unsafeWindow.g_daysMyEscrow * 24;
            jQuery("div.trade_partner_headline").append("<div class='warning'>(You do not have mobile confirmations enabled. Items will be held for <b>" + hours + "</b> hours.)</div>")
        }

        if(unsafeWindow.g_daysTheirEscrow > 0) {
            var hours = unsafeWindow.g_daysTheirEscrow * 24;
            jQuery("div.trade_partner_headline").append("<div class='warning'>(Other user does not have mobile confirmations enabled. Items will be held for <b>" + hours + "</b> hours.)</div>")
        }
    }

});

var mtoast = {
    css: `
		.mtoast {

			/* (B) DIMENSION */
			//width: 200px;
			padding: 10px;

			/* (C) COLORS */
			border: 1px solid #c52828;
			background: #ffebe1;
			border: 1px solid #000;

			border-radius: 5px;
			margin-bottom: 20px;
		}

		.mtoast.show {
			display:block
		}

		#mtoast-holder {
			position: fixed;
			z-index: 999;
			right: 20px;
			top: 50px;
			width: 200px;
			display: flex;
			flex-direction: column;
		}

		.fade-in {
			animation: fadeIn linear .8s;
		}

		.fade-out {
			animation: fadeOut linear .5s;
		}
		@keyframes fadeIn {
			0% {
				opacity: 0;
				max-height: 0px;
			}

			100% {
				opacity: 1;
				max-height: 100px;
			}
		}

		@keyframes fadeOut {
			0% {
				opacity: 1;
				max-height: 100px;
			}
			100% {
				opacity: 0;
				max-height: 0;
			}
		}
	`,
    container: null,

    addCSStyle: (styleText) => {
        let style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        style.appendChild(document.createTextNode(styleText));
    },

    init: ( ) => {
        mtoast.addCSStyle( mtoast.css );
        let container = document.createElement( 'div' );
        container.setAttribute( 'id', 'mtoast-holder' );
        document.body.insertAdjacentElement( 'afterbegin', container );
        mtoast.container = container;
    },


    removeMToast: ( e ) => {
        e.target.classList.add( 'fade-out' );
        setTimeout( () => e.target.remove( ), 500 );
    },

    createMToast: ( ) => {
        let toast = document.createElement( 'div' );
        toast.classList.add( 'mtoast' );
        toast.classList.add( 'fade-in' );
        mtoast.container.insertAdjacentElement( 'afterbegin', toast );
        return toast;
    },

    msg: ( msg ) => {
        if (!mtoast.container) {
            toast.init();
        }
        let toast = mtoast.createMToast();
        console.log( msg );
        toast.innerHTML = msg;
        toast.classList.add( 'show' );
        toast.addEventListener( 'click', mtoast.removeMToast );
    }
}

mtoast.init()


