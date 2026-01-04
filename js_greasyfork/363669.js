// ==UserScript==
// @name         Reddit auto-sort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-sorts Reddit links by upvotes
// @author       You
// @match        https://www.reddit.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/363669/Reddit%20auto-sort.user.js
// @updateURL https://update.greasyfork.org/scripts/363669/Reddit%20auto-sort.meta.js
// ==/UserScript==

function deabbreviate(s) {
	if (s.slice(-1) == "k")
		s = String(parseFloat(s.slice(0, -1)) * 1000);
	else if (s.slice(-1) == "m")
		s = String(parseFloat(s.slice(0, -1)) * 1000000);
    else if (isNaN(parseFloat(s)))
             s = "0";
	return s;
}

(function() {
    'use strict';


    var l = $(".linklisting");
    l.find(".link").sort(function(a,b) {
        return deabbreviate($(b).find(".score.unvoted").text()) - deabbreviate($(a).find(".score.unvoted").text());
    }).appendTo(l);

    // Your code here...
})();