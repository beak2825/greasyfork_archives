// ==UserScript==
// @name           BvS Shop Manager
// @namespace      TheSpy
// @description    Fill the item count just by clicking on an item at the store. Show the total sell price and treasure value.
// @version        1.10
// @history        1.10 New domain - animecubedgaming.com - Channel28
// @history        1.09 Now https compatible (Updated by Channel28)
// @history        1.08 Fixed a bug (North)
// @history        1.07 The script now adds a wiki link to every item
// @history        1.06 Fixed a bug with Ryo summing (found by: Itachi000)
// @history        1.05 Optimised the code, fixed a bug with 'Power Over 9000' and 'Over 11000'
// @history        1.04 Changed rolls from d1000 to d400 (duh)
// @history        1.03 Fixed a little bug with treasure prices, changed the rolls from d400 do d1000
// @history        1.02 Changed the way the treasure percent is calculated
// @history        1.01 Initial release
// @include        http*://*animecubed.com/billy/bvs/shop.html
// @include        http*://*animecubedgaming.com/billy/bvs/shop.html
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/4057/BvS%20Shop%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/4057/BvS%20Shop%20Manager.meta.js
// ==/UserScript==

function ShopManager() {
	var itemsCount = 0;
	var itemsPrice = 0;
	var tLower = 0;
	var tUpper = 1;
	var ryo = 0;
	var text = null;
	var treasures = [
		[/Copper Ring/i, 100],
		[/Gold Ring/i, 3000],
		[/Platinum Ring/i, 5000],
		[/Cobalt Ring/i, 10000],
		[/Small Pearl/i, 1000],
		[/Small Emerald/i, 2000],
		[/Small Ruby/i, 5000],
		[/Small Diamond/i, 10000],
		[/Copper Coin/i, 100],
		[/Silver Coin/i, 200],
		[/Gold Coin/i, 5000],
		[/Copper Shaft/i, 100],
		[/Silver Shaft/i, 1000],
		[/Cobalt Shaft/i, 5000],
		[/Threadbare Robes/i, 500],
		[/Sham Rock/i, 1000],
		[/Crystal Lens/i, 5000]
	];

	this.AppendClickHandler = function() {
		var snap = document.evaluate("//input[@type='radio' and @name='selling']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(var i = 0; i < snap.snapshotLength; i++) {
			var input = snap.snapshotItem(i);
			try {
				var match = input.parentNode.parentNode.innerHTML.match(/(\d+) \(.{0,20}sells for (\d+) ryo\)/i);
				if(match != null && match[1] != null)
					input.setAttribute("onclick", "javascript:document.getElementsByName('numbertosell')[0].value=" + match[1]);
			}
			catch(e) {
				input.setAttribute("onclick", "javascript:document.getElementsByName('numbertosell')[0].value=0");
			}
		}
	}

	this.TreasureRange = function() {
		this.lower = 0;
		this.upper = 1;

		this.intersect = function(price, maxprice) {
			var max = Math.floor((400 * (price + 1)) / maxprice) / 400;
			var min = Math.ceil((400 * price) / maxprice) / 400;
			this.upper = Math.min(this.upper, max);
			this.lower = Math.max(this.lower, min);
		}
	}

	this.Round = function(number, decimals) {
		try {
			return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
		}
		catch(e) {
			return number;
		}
	}

	this.CalculateStuff = function() {
		var snap = document.evaluate("//form[@name='sellitem']/table/tbody/tr/td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < snap.snapshotLength; i++) {
			try {
				var cell = snap.snapshotItem(i);
				var cellText = cell.innerHTML;
				var match = cellText.match(/([\d,]+) \(.{0,20}sells for ([\d,]+) ryo\)/i);
				var itemCount = parseInt(match[1].replace(',', ''));
				var itemPrice = parseInt(match[2].replace(',', ''));
				var itemTotal = itemCount * itemPrice;
				var treasurePrice = 0;

				for(var j in treasures) {
					if(treasures[j][0].test(cellText)) {
						treasurePrice = treasures[j][1];
					}
				}

				if(treasurePrice > 0) {
					cell.innerHTML = cellText.replace(/Treasure Item/i, "Treasure");
					var treasureRange = new this.TreasureRange();
					treasureRange.intersect(itemPrice, treasurePrice);
					tLower = Math.max(tLower, treasureRange.lower);
					tUpper = Math.min(tUpper, treasureRange.upper);
				}

				cell.innerHTML += [" - <b><font color=\"#9D6F03\">", itemTotal, "</font></b>"].join("");
				itemsCount += itemCount;
				itemsPrice += itemTotal;
			}
			catch(e) {
			}
		}
	}

	this.AppendNodes = function() {
		try {
			var snap = document.evaluate("//b[contains(text(), 'Current Ryo')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if(snap.snapshotLength == 1) {
				text = snap.snapshotItem(0);
				ryo = parseInt(snap.snapshotItem(0).textContent.match(/(\d+)/)[1]);
			}
			else {
				return;
			}

			
			var b = document.createElement("b");
			var b2 = document.createElement("b");
			text.parentNode.insertBefore(b, text);
			text.parentNode.insertBefore(b2, text.nextSibling);
			tLower *= 100;
			tUpper *= 100;
			b.innerHTML = ["Treasure value: <font color=\"#5b4c05\">", tLower == tUpper ? this.Round(tLower, 2) : [this.Round(tLower, 2), this.Round(tUpper, 2)].join("% ~ "), "%</font><br/>Item Ryo: <font color=\"#9d6f03\">", itemsPrice, "</font><br/>"].join("");
			b2.innerHTML = ["<br/>Total Ryo: <font color=\"#9d6f03\">", ryo + itemsPrice, "</font>"].join("");
		}
		catch(e) {
		}
	}

	this.AppendWikiNodes = function() {
		var snap = document.evaluate("//form[@name='sellitem']/table/tbody/tr/td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < snap.snapshotLength; i++) {
			try {
				var cell = snap.snapshotItem(i);
				var match = cell.innerHTML.match(/<span[^>]*>(<span[^>]*><font[^>]*><b>)?([^<]+)(<\/b><\/font><\/span>)?<\/span>/i);
				if(match.length == 4) {
					cell.innerHTML = "<a href=\"http://bvs.wikidot.com/items:" + match[2] + "\" target=\"_blank\"><font color=\"#a10000\"><b>[W]</b></font></a> " + cell.innerHTML;
				}
			}
			catch(e) {
			}
		}
	}

	this.CalculateStuff();
	this.AppendNodes();
	this.AppendClickHandler();
	this.AppendWikiNodes();
}

var shopManager = new ShopManager();