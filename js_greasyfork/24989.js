// ==UserScript==
// @name        Company Stock Helper
// @version		1.4.1
// @author      BloodyMind
// @namespace   https://greasyfork.org/en/users/5563-bloodymind
// @description Company Stock helper
// @match       *://torn.com/companies.php
// @match       *://www.torn.com/companies.php
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24989/Company%20Stock%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/24989/Company%20Stock%20Helper.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var config = 'total'; //daily or total

var stockItems = [], totalSale, dailySale, storageSize, currentlyAvailable, remainingSpace, itemsDue, toBuy;

$STOCK = $('#stock');
$CALCULATE = $('<span class="calculate btn-wrap silver"><span class="btn"><button class="torn-btn">AUTO</button></span></span>');

String.prototype.remove = function (search) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), '');
};

String.prototype.toInt = function (string) {
	return parseInt(this.remove(string).remove(' ').remove(','), 10);
};

String.prototype.seperateThousand = function () {
	return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function addTooltip() {
	$('ul.stock-list .quantity input[type="text"]').each(function (index) {
		$(this).prop('title', '<strong>Daily sale:</strong> ' + stockItems[index].dailySale.toString().seperateThousand() + '</br>' + '<strong>Total sale:</strong> ' + stockItems[index].totalSale.toString().seperateThousand() + '</br>' + '<strong>Due delivery:</strong> ' + stockItems[index].arriving.toString().seperateThousand());
	});
	$('li.total div.quantity').prop('title', '<strong>Due delivery:</strong> ' + itemsDue.toString().seperateThousand() + '</br>' + '<strong>Available space:</strong> ' + remainingSpace.toString().seperateThousand());

	$($('ul.stock-list li:not(.total) div.stock')).each(function (index) {
		$(this).prop('title', 'Available for <strong>' + Math.round(stockItems[index].inStock / stockItems[index].dailySale * 100) / 100 + '</strong> day(s)');
	});
}

function getArrivingItems() {
	itemsDue = 0;
	$ORDERLIST = $('ul.order-list li div.t-gray-9').parent();
	stockItems.forEach(function (element, index) {
		$ORDERLIST.each(function (i) {
			if (element.itemName === $(this).find('div.name').text().trim()) {
				stockItems[index].arriving += $(this).find('div.amount').text().toInt('');
			}
		});
		itemsDue += stockItems[index].arriving;
	});
}

function Calculate() {
	var base,
	base2;
	toBuy = 0;
	if (config === 'daily') {
		base = dailySale;
		base2 = 'dailySale';
	} else {
		base = totalSale;
		base2 = 'totalSale';
	}
    if(base===0){base=1;}
	stockItems.forEach(function (element, index) {
		if (stockItems.length !== (index + 1)) {
			stockItems[index].toBuy = Math.round(remainingSpace * element[base2] / base);
		} else {
			stockItems[index].toBuy = remainingSpace - toBuy;
		}
		toBuy += stockItems[index].toBuy;
	});
	console.info('Company stock helper:\r\nRemaining storage:' + remainingSpace.toString().seperateThousand() + '\r\n' + 'To buy: ' + toBuy.toString().seperateThousand());
}

function applyToPage() {
	$('ul.stock-list .quantity input[type="text"]').each(function (index) {
		if (stockItems[index].toBuy !== 0) {
			$(this).val(stockItems[index].toBuy);
			$(this).closest('.stock-list > li').addClass('new');
		}
	});
}

function getData() {
	$.ajax({
		type: 'post',
		url: addRFC('/companies.php?step=upgrades'),
		success: function (response) {
			if (response.toString().indexOf('You must be the director to make upgrades.') < 0) {
				init();
				response = $('<div>' + response + '</div>').find('div.upgrade-cont:nth-child(3) > p:nth-child(2)').text();
				storageSize = response.slice(response.search('which can hold ') + 'which can hold '.length, response.search('stock'));
				storageSize = parseInt(storageSize.replace(',', ''), 10);
				$.ajax({
					type: 'post',
					url: addRFC('/companies.php?step=pricing'),
					success: function (response) {
						currentlyAvailable = 0;
						dailySale = 0;
						totalSale = 0;
						stockItems = [];
						$(response).find('ul.pricing-list li').each(function (i) {
							stockItems.push({
								itemName: $(this).find('div.name.bold').text().trim(),
								totalSale: $(this).find('div.sold-total').text().toInt('Sold Each:'),
								dailySale: $(this).find('div.sold-daily').text().toInt('Sold Daily:'),
								inStock: $(this).find('div.stock').text().toInt('In Stock:'),
								arriving: 0,
								toBuy: 0
							});
							currentlyAvailable += stockItems[i].inStock;
							totalSale += stockItems[i].totalSale;
							dailySale += stockItems[i].dailySale;
						});
						getArrivingItems();
						remainingSpace = storageSize - currentlyAvailable - itemsDue;
						addTooltip();
					}
				});
			} else {
				console.info('Company stock helper: You are an employee.');
			}
		}
	});
}

function init() {
	$('span.order').before($CALCULATE);
	$('span.calculate').click(function () {
		Calculate();
		applyToPage();
	});
}

try {
	var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				getData();
			});
		});

	var observerTarget = $STOCK[0];
	var observerConfig = {
		attributes: false,
		childList: true,
		characterData: false
	};
	observer.observe(observerTarget, observerConfig);
} catch (err) {
	console.info(err);
}