// ==UserScript==
// @name         eBay Stop redirecting to similar item ++
// @namespace    eBay
// @version      2.0.2
// @description  Remove sponsors and Stop redirecting to similar item
// @author       denis hebert
// @license      GNU GPL-3.0-or-later
// @match        *://*/mye/*
// @match        *://*/itm/*
// @match        *://*/sch/i.html*
// @match        *://*/d/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.ca
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451970/eBay%20Stop%20redirecting%20to%20similar%20item%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/451970/eBay%20Stop%20redirecting%20to%20similar%20item%20%2B%2B.meta.js
// ==/UserScript==

'use strict';

(function(d, c, e) {
    // Remove sponsors and add missing tags to /itm/ before rendering
    e = new MutationObserver(function(list, n, i, e) {
        list = d.querySelectorAll("[id^='placement']"); // Sponsor elements
        n = list.length;
        for (i = 0; i < n; i++)
            list[i].remove();
        // Complete itm links with "nordt=true#CenterPanelInternal" precision if lacking of it
        list = d.getElementsByTagName("a");
        n = list.length;
        for (i = 0; i < n; i++) {
            e = list[i];
            if ( "href" in e  &&  e.href.includes("/itm/")  &&  ! e.href.includes(c) )
                e.href += (e.href.includes("?") ? "&" : "?") + c;
        }
    });
    e.observe(d, {childList: true, subtree:true});
})(document, "nordt=true#CenterPanelInternal");