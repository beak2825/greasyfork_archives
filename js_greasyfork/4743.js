// ==UserScript==
// @name		CS:GO Trader 
// @namespace	http://www.wykop.pl/ludzie/piokom123/
// @description	Trading helper for csgolounge.com and steamcommunity.com
// @author		Elon Than
// @version		0.2.4
// @grant		none
// @include		http://csgolounge.com/*
// @include		http://steamcommunity.com/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/4743/CS%3AGO%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/4743/CS%3AGO%20Trader.meta.js
// ==/UserScript==

function main() {
	var requestInProgress = false;
	var dynamicReloadInProgress = false;
	var itemsToFetch = [];
	var refreshDataCallback = null;
	var itemsCount = 0;
	var hiddenOffersCurrentCount = 0;

	var cacheLibrary = {
		TYPE_DATA: 1,
		TYPE_INVENTORY: 2,
		TYPE_HIDDEN_TRADES: 10,

		CACHE_NAMES: {
			1: 'csgoTraderData',
			2: 'csgoTraderInventory',
			10: 'csgoTraderHiddenTrades'
		},
		CACHE_VALUES: {
			1: null,
			2: null,
			10: null
		},
		CACHE_TIME: {
			1: 1000 * 60 * 60 * 3,
			2: 0,
			10: 0
		},

		getAll: function(cacheType) {
			if (cacheLibrary.CACHE_VALUES[cacheType] === null) {
				cacheLibrary.load(cacheType);
			}

			return cacheLibrary.CACHE_VALUES[cacheType];
		},

		get: function(cacheType, index) {
			if (cacheLibrary.CACHE_VALUES[cacheType] === null) {
				cacheLibrary.load(cacheType);
			}

			if (typeof cacheLibrary.CACHE_VALUES[cacheType][index] === 'undefined') {
				return null;
			}

			if (cacheLibrary.CACHE_TIME[cacheType] !== 0) {
				var date = new Date();

				if (typeof cacheLibrary.CACHE_VALUES[cacheType][index].ct !== 'undefined'
						&& (cacheLibrary.CACHE_VALUES[cacheType][index].ct + cacheLibrary.CACHE_TIME[cacheType]) < date.getTime()) {
					return null;
				}
			}

			return cacheLibrary.CACHE_VALUES[cacheType][index];
		},

		setAll: function(cacheType, values) {
			cacheLibrary.CACHE_VALUES[cacheType] = values;
		},

		set: function(cacheType, index, value) {
			if (cacheLibrary.CACHE_VALUES[cacheType] === null) {
				cacheLibrary.load(cacheType);
			}

			if (index === null) {
				index = cacheLibrary.CACHE_VALUES[cacheType].length;
			}

			cacheLibrary.CACHE_VALUES[cacheType][index] = value;
		},

		saveAll: function(cacheType) {
			localStorage.setItem(cacheLibrary.CACHE_NAMES[cacheType], JSON.stringify(cacheLibrary.CACHE_VALUES[cacheType]));
		},

		/**
		 * prv
		 */
		load: function(cacheType) {
			var cache = localStorage.getItem(cacheLibrary.CACHE_NAMES[cacheType]);
			if (cache === null) {
				return;
			}

			cacheLibrary.CACHE_VALUES[cacheType] = JSON.parse(cache);
		}
	};

	/**
	 * Fetches all items data from proxy
	 */
	function fetchAll() {
		if (itemsToFetch.length === 0) {
			return;
		}

		jQuery('#csgoTraderProgress').css('display', 'block');
		jQuery('#csgoTraderProgress').html('Loading items ' + (itemsCount - itemsToFetch.length + 1) + '/' + itemsCount);

		var callback = fetchAll;

		if (itemsToFetch.length === 1) {
			jQuery('#csgoTraderProgress').css('display', 'none');

			callback = refreshDataCallback;

			dynamicReloadInProgress = false;

			cacheLibrary.saveAll(cacheLibrary.TYPE_DATA);
		}

		if ((itemsCount - itemsToFetch.length + 1) % 10 == 0) {
			refreshDataCallback();
		}

		var name = itemsToFetch[0];

		itemsToFetch.splice(0, 1);

		var fromCache = cacheLibrary.get(cacheLibrary.TYPE_DATA, name);

		if (fromCache !== null) {
			callback();
		} else {
			fetchFromProxy(name, callback);
		}
	}

	/**
	 * Fetches item data from proxy
	 */
	function fetchFromProxy(name, callback) {
		if (requestInProgress) {
			return;
		}

		requestInProgress = true;

		jQuery.ajax({
			url: 'http://cs.piokom123.info/proxy.php?name=' + name,
			dataType: 'JSON',
			success: function(data) {
				if (data.volume != '') {
					data.ct = (new Date().getTime() + cacheLibrary.CACHE_TIME[cacheLibrary.TYPE_DATA]);
					cacheLibrary.set(cacheLibrary.TYPE_DATA, data.name, data);
				}

				requestInProgress = false;

				callback();
			},
			error: function() {
				requestInProgress = false;
			}
		});
	}

	var fetcherLibrary = {
		apiUrl: 'http://cs.piokom123.info/traderApi.php',
		queue: [],
		alreadyFetched: 0,
		itemsInPack: 10,
		requestInProgress: false,
		dynamicReloadInProgress: false,
		queueCompleteCallback: null,

		addToQueue: function(name) {
			if (fetcherLibrary.requestInProgress) {
				return;
			}

			if (cacheLibrary.get(cacheLibrary.TYPE_DATA, name) !== null) {
				return;
			}

			if (name.length > 2 && jQuery.inArray(name, fetcherLibrary.queue) === -1) {
				fetcherLibrary.queue[fetcherLibrary.queue.length] = name;
			}
		},

		start: function() {
			if (fetcherLibrary.requestInProgress || fetcherLibrary.queue.length === 0) {
				return;
			}

			fetcherLibrary.requestInProgress = true;

			console.log('Starting fetcherLibrary, items in queue: ' + fetcherLibrary.queue.length);

			messagesLibrary.setProgress(0, fetcherLibrary.queue.length);

			var names = fetcherLibrary.queue.splice(0, fetcherLibrary.itemsInPack);

			var data = {
				action: 'data',
				names: names
			};

			fetcherLibrary.sendRequest(data, fetcherLibrary.progress);
		},

		sendRequest: function(data, callback) {
			jQuery.ajax({
				url: fetcherLibrary.apiUrl,
				data: data,
				type: 'POST',
				dataType: 'JSON',
				success: function(data) {
					callback(data);
				},
				error: function() {
					fetcherLibrary.requestInProgress = false;
				}
			});
		},

		/**
		 * prv
		 */
		progress: function(data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].volume != '') {
					data[i].ct = (new Date().getTime() + cacheLibrary.CACHE_TIME[cacheLibrary.TYPE_DATA]);
					cacheLibrary.set(cacheLibrary.TYPE_DATA, data[i].name, data[i]);
				}
			}

			fetcherLibrary.alreadyFetched += data.length;

			messagesLibrary.setProgress(fetcherLibrary.alreadyFetched, (fetcherLibrary.queue.length + fetcherLibrary.alreadyFetched));

			var names = fetcherLibrary.queue.splice(0, fetcherLibrary.itemsInPack);

			if (names.length === 0) {
				messagesLibrary.endProgress();

				fetcherLibrary.requestInProgress = false;
				fetcherLibrary.dynamicReloadInProgress = false;

				cacheLibrary.saveAll(cacheLibrary.TYPE_DATA);

				fetcherLibrary.queueCompleteCallback();

				return;
			} else if ((fetcherLibrary.alreadyFetched % fetcherLibrary.itemsInPack) == 0) {
				fetcherLibrary.queueCompleteCallback();
			}

			var data = {
				action: 'data',
				names: names
			};

			fetcherLibrary.sendRequest(data, fetcherLibrary.progress);
		}
	}

	var messagesLibrary = {
		initialize: function() {
			jQuery('body').prepend('<div id="csgoTraderProgress" style="display: none"></div>');
		},

		setProgress: function(current, max) {
			jQuery('#csgoTraderProgress').html('Loading items ' + current + '/' + max).css('display', 'block');
		},

		endProgress: function() {
			jQuery('#csgoTraderProgress').html(' ').css('display', 'none');
		}
	}

	function csgotraderLounge() {
		console.log('Loading CS:GO Trader for csgolounge.com');

		fetcherLibrary.queueCompleteCallback = refreshDataCallbackLounge;

		injectCss(
			'.csgoTraderPrice {'
			+ 'position: absolute;'
			+ 'padding-left: 5px;'
			+ 'padding-right: 5px;'
			+ 'font-weight: bold;'
			+ 'font-size: 15px;'
			+ 'border-bottom-right-radius: 8px;'
			+ 'background: none repeat scroll 0% 0% lightblue;'
			+ 'color: darkgreen;'
			+ 'opacity: 0.8;'
			+ '}'

			+ '.csgoTraderPriceOwn {'
			+ 'background: none repeat scroll 0% 0% yellow !important;'
			+ '}'

			+ '.StatTrak .csgoTraderPrice {'
			+ 'padding-left: 15px;'
			+ '}'

			+ '#csgoTraderProgress {'
			+ 'position: fixed;'
			+ 'padding-right: 5px;'
			+ 'z-index: 99999;'
			+ 'top: 0;'
			+ 'left: 0;'
			+ 'font-weight: bold;'
			+ 'font-size: 17px;'
			+ 'border-bottom-right-radius: 8px;'
			+ 'background: none repeat scroll 0% 0% lightblue;'
			+ 'color: darkgreen;'
			+ 'opacity: 0.8;'
			+ '}'

			+ '.csgoTraderTradeDesc {'
			+ 'background: #BBB;'
			+ '-webkit-border-radius: 5px;'
			+ 'border-radius: 5px;'
			+ 'box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);'
			+ '-moz-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);'
			+ '-webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);'
			+ 'margin-top: 10px;'
			+ 'padding: 15px;'
			+ '}'

			+ '.item {'
			+ '}'
		);

		if (jQuery('section#matches').html() === null || jQuery('section#matches').html().trim() == '') {
			jQuery('section#matches').detach();
		}

		if (jQuery('section').length === 1) {
			injectCss(
				'.box {'
				+ 'width: 98% !important'
				+ '}'
			);
		}

		addHideTradeButtons();

		if (jQuery('.tradeheader').length > 0) {
			prepareOffersList();

			if (jQuery('.tradepoll:visible').length == 0) {
				redirectToNextPage();
			}
		}

		loadAllItemsLounge();

		fetcherLibrary.start();

		jQuery(document).on('DOMNodeInserted', function(e) {
			if (jQuery('.item', $(e.target)).length > 0 && !fetcherLibrary.dynamicReloadInProgress) {
				setTimeout(function() {
					fetcherLibrary.dynamicReloadInProgress = true;

					loadAllItemsLounge();

					loadInventoryLounge();

					fetcherLibrary.start();
				}, 500);
			}
		});
	}

	function csgotraderSteam() {
		console.log('Loading CS:GO Trader for steamcommunity.com');

		fetcherLibrary.queueCompleteCallback = refreshDataCallbackSteam;

		injectCss(
			'.csgoTraderPrice {'
			+ 'position: absolute;'
			+ 'padding-left: 5px;'
			+ 'padding-right: 5px;'
			+ 'font-weight: bold;'
			+ 'font-size: 15px;'
			+ 'border-bottom-right-radius: 8px;'
			+ 'background: none repeat scroll 0% 0% lightblue;'
			+ 'color: darkgreen;'
			+ 'opacity: 0.8;'
			+ 'z-index: 99;'
			+ 'top: 0;'
			+ '}'

			+ '#csgoTraderProgress {'
			+ 'position: fixed;'
			+ 'padding-right: 5px;'
			+ 'z-index: 99999;'
			+ 'top: 0;'
			+ 'left: 0;'
			+ 'font-weight: bold;'
			+ 'font-size: 17px;'
			+ 'border-bottom-right-radius: 8px;'
			+ 'background: none repeat scroll 0% 0% lightblue;'
			+ 'color: darkgreen;'
			+ 'opacity: 0.8;'
			+ '}'
		);

		var interval = null;
		if (jQuery('#inventory_box, #active_inventory_page').length > 0) {
			interval = setInterval(function() {
				if (jQuery('#inventory_box, #active_inventory_page').is(':visible')
					&& jQuery('.itemHolder .item').is(':visible')
					&& !dynamicReloadInProgress) {
						clearInterval(interval);

						dynamicReloadInProgress = true;

						loadAllItemsSteam();

						fetchAll();

						interval = null;
				}
			}, 200);
		};
	}

	/**
	 * === COMMON ===
	 */

	/**
	 * Add CSS to webpage
	 */
	function injectCss(css) {
		var head = document.getElementsByTagName('head')[0];

		var newCss = document.createElement('style');
		newCss.type = "text/css";
		newCss.innerHTML = css;
		head.appendChild(newCss); 
	}

	/**
	 * Checks if given name is valid and can be fetched
	 */
	function isNameValid(name) {
		if (name.indexOf('Items') !== -1
			|| name.indexOf('Money') !== -1
			|| name.indexOf('Prototype') !== -1
			|| name.indexOf('Coin') !== -1
			|| name.indexOf('Background') !== -1
			|| name.indexOf('GM_') !== -1
			|| name.indexOf('Trophy') !== -1
			|| name.indexOf('Any Offers') !== -1
			|| name == 'Mission'
			|| name.indexOf('Any Key') !== -1) {
				return false;
		}

		return true;
	}

	/**
	 * === STEAM ===
	 */

	/**
	 * Gets all items from current page
	 */
	function loadAllItemsSteam() {
		jQuery('.itemHolder .item').each(function() {
			var id = this.id.split('_');

			if (id[0] !== 'item730') {
				return;
			}

			id = id[2];

			var name = g_ActiveInventory.LocateAsset(id).market_hash_name;

			if (jQuery.inArray(name, itemsToFetch) === -1) {
				itemsToFetch[itemsToFetch.length] = name;
			}
		});
	}

	/**
	 * Refreshes data on current page
	 */
	function refreshDataCallbackSteam() {
		jQuery('.itemHolder .item').each(function() {
			var id = this.id.split('_');

			if (id[0] !== 'item730') {
				return;
			}

			id = id[2];

			var name = g_ActiveInventory.LocateAsset(id).market_hash_name;

			var data = cacheLibrary.get(cacheLibrary.TYPE_DATA, name);
			if (data !== null) {
				if (jQuery('.csgoTraderPrice', jQuery(this)).length > 0) {
					jQuery('.csgoTraderPrice', jQuery(this)).html(data.median + ' $');
				} else {
					jQuery(this).after('<div class="csgoTraderPrice">' + data.median + ' $</div>');
				}
			}
		});
	}

	/**
	 * === LOUNGE ===
	 */

	/**
	 * Prepares offers list
	 */
	function prepareOffersList() {
		jQuery('.tradepoll').each(function(index, item) {
			var tradeId = getTradeId(jQuery(item));

			if (isTradeHidden(tradeId)) {
				jQuery(item).hide();

				hiddenOffersCurrentCount++;

				return;
			}

			var title = jQuery('.tradeheader', item).attr('title');
			if (typeof title !== 'undefined' && title.length > 0) {
					jQuery(item).append('<div style="clear: both"></div><div class="csgoTraderTradeDesc"><pre>' + title + '</pre></div>');
			}
		});

		jQuery(jQuery('.title')[0]).after('<div style="float: right"><a class="button csgoTraderShowHiddenTrades" style="">show hidden trades (' + hiddenOffersCurrentCount + ')</a></div>');

		jQuery('.csgoTraderShowHiddenTrades').on('click', function() {
			showHiddenOffers();

			jQuery(this).fadeOut();
		});
	}

	/**
	 * Redirect to next page
	 */
	function redirectToNextPage() {
		document.location = jQuery('.currentPage').next('li').children('a')[0].href;
	}

	/**
	 * Loads user inventory
	 */
	function loadInventoryLounge() {
		if (jQuery('#backpack').length > 0) {
			var names = [];

			jQuery('#backpack .item .smallimg').each(function() {
				if (!isNameValid(this.alt)) {
					return;
				}

				names[names.length] = this.alt;
			});
		}

		cacheLibrary.setAll(cacheLibrary.TYPE_INVENTORY, names);
		cacheLibrary.saveAll(cacheLibrary.TYPE_INVENTORY);
	}

	/**
	 * Gets all items from current page
	 */
	function loadAllItemsLounge() {
		jQuery('.item .smallimg').each(function() {
			if (!isNameValid(this.alt) || jQuery('.rarity', jQuery(this.parentNode)).html() === 'Gift') {
				return;
			}

			if (jQuery('.csgoTraderPrice', jQuery(this)).length !== 0) {
				return;
			}

			fetcherLibrary.addToQueue(this.alt);
		});
	}

	/**
	 * Add "hide trade" buttons
	 */
	function addHideTradeButtons() {
		jQuery('.tradeheader').each(function() {
			jQuery(this).append('<a class="button csgoTraderHideTradeButton" style="float: right" href="">hide trade</a>');
		});

		jQuery('.csgoTraderHideTradeButton').unbind('click').on('click', function() {
			hideTrade(jQuery(this.parentNode.parentNode));
			return false;
		});
	}

	/**
	 * Checks if given trade is hidden
	 */
	function isTradeHidden(id) {
		if (jQuery.inArray(id, cacheLibrary.getAll(cacheLibrary.TYPE_HIDDEN_TRADES)) !== -1) {
			return true;
		}

		return false;
	}

	/**
	 * Gets trade ID from div
	 */
	function getTradeId(tradeDiv) {
		var onclick = jQuery('a:first', tradeDiv).attr('onclick');
		if (typeof onclick === 'undefined') {
			return null;
		}

		onclick = onclick.match(/addBookmark\('([0-9]+)'\)/);

		if (onclick == null) {
			console.log("Can't hide offer. ID not found!");
			return null;
		}

		return onclick[1];
	}

	/**
	 * Shows all hidden offers
	 */
	function showHiddenOffers() {
		if (jQuery('.tradepoll:hidden').length > 0) {
			jQuery('.tradepoll:hidden').each(function(index, item) {
				jQuery(item).fadeIn();
			});
		}
	}

	/**
	 * Hiden given trade
	 */
	function hideTrade(tradeDiv) {
		var onclick = jQuery('a:first', tradeDiv).attr('onclick');

		onclick = onclick.match(/addBookmark\('([0-9]+)'\)/);

		if (onclick == null) {
			console.log("Can't hide offer. ID not found!");
			return;
		}

		tradeDiv.fadeOut();

		addHiddenTradeId(onclick[1]);
	}

	/**
	 * Adds trade ID to hidden list
	 */
	function addHiddenTradeId(id) {
		if (jQuery.inArray(id, cacheLibrary.getAll(cacheLibrary.TYPE_HIDDEN_TRADES)) === -1) {
			cacheLibrary.set(cacheLibrary.TYPE_HIDDEN_TRADES, null, id);

			cacheLibrary.saveAll(cacheLibrary.TYPE_HIDDEN_TRADES);
		}
	}

	/**
	 * Refreshes data on current page
	 */
	function refreshDataCallbackLounge() {
		jQuery('.item .smallimg').each(function() {
			var data = cacheLibrary.get(cacheLibrary.TYPE_DATA, this.alt);

			if (data !== null) {
				var priceContent = data.median + ' $';
				var priceDetailsContent = '<br /><br />Lowest price: ' + data.lowest + ' $<br />'
					+ 'Median price: ' + data.median + ' $<br />'
					+ 'Volume: ' + data.volume + '<br />';

				if (jQuery('.csgoTraderPrice', jQuery(this.parentNode)).length > 0) {
					jQuery('.csgoTraderPrice', jQuery(this.parentNode)).html(priceContent);
				} else {
					var className = 'csgoTraderPrice';
					if (jQuery.inArray(data.name, cacheLibrary.getAll(cacheLibrary.TYPE_INVENTORY)) !== -1) {
						className += ' csgoTraderPriceOwn';
					}

					jQuery(this).before('<div class="' + className + '">' + priceContent + '</div>');
				}

				if (jQuery('.csgoTraderPriceDetails', jQuery(this.parentNode)).length > 0) {
					jQuery('.csgoTraderPriceDetails', jQuery(this.parentNode)).html(priceDetailsContent);
				} else {
					jQuery('.name', jQuery(this.parentNode)).append(
						'<div class="csgoTraderPriceDetails">'
						+ priceDetailsContent
						+ '</div>'
					);
				}
			}
		});
	}

	messagesLibrary.initialize();

	if (document.location.href.indexOf('csgolounge.com') !== -1) {
		csgotraderLounge();
	} else {
		csgotraderSteam();
	}
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera >.>
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}
