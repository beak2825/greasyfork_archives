// ==UserScript==
// @name         Remove Glassdoor Paywall
// @description  Removes the paywall overlay at Glassdoor.com and re-enables scrolling
// @author       peckjon
// @version        1.0
// @include        http*://*glassdoor.*
// @namespace      http://www.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/434322/Remove%20Glassdoor%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/434322/Remove%20Glassdoor%20Paywall.meta.js
// ==/UserScript==

setInterval(function() {
    if(document.getElementById('ContentWallHardsell')) {
        document.getElementById('ContentWallHardsell').style.display='none'
    }
    document.body.style.overflow='auto'
    document.body['onscroll']=function(){}
}, 3000)