// ==UserScript==
// @name           Feedly Colorful Listview Mod
// @id             FeedlyColorfulListviewMod
// @version        0.0.9.20161116
// @description    Feedly Colorful Listview Mod working with Chrome
// @namespace      https://greasyfork.org/pl/users/66016-marcindabrowski
// @match          *://*.feedly.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require        https://greasyfork.org/scripts/23268-waitforkeyelements/code/waitForKeyElements.js?version=147835
// @grant          GM_addStyle
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/23185/Feedly%20Colorful%20Listview%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/23185/Feedly%20Colorful%20Listview%20Mod.meta.js
// ==/UserScript==
var ColorfulListView = function () {
	this.initialize.apply(this, arguments);
};

ColorfulListView.prototype = {
	initialize:function () {
		this.colors = {};
	},
    makeColor:function (str) {
		var h = 0;
        for (var i = 0; i < str.length; i++) {
            h += str.charCodeAt(i);
        }
		return {"h":(h%36+1)*10, "s":30 + (h%5+1)*10};
	},
	color:function (item) {
		var itemid = item.id.replace(/^([^=]+).*$/, "$1");
		item.setAttribute("data-color", itemid);
		if (this.colors[itemid]!==undefined) return null;
		this.colors[itemid] = this.makeColor(itemid);
		GM_addStyle(
			"div[data-color='" + itemid + "'] {background:hsl(" + this.colors[itemid].h + "," + this.colors[itemid].s + "%,80%) !important;}"	+
            "div[data-color='" + itemid + "']:hover {background:hsl(" + this.colors[itemid].h + "," + this.colors[itemid].s + "%,70%) !important;}"
		);
	}
};
var colorfulListViewObj = new ColorfulListView();

waitForKeyElements (".entry", colorEntry);

function colorEntry (jNode) {
    colorfulListViewObj.color(jNode[0]);
}