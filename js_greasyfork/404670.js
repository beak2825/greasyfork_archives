// ==UserScript==
// @name         MyTec Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://mytec.executivecentre.com/umbraco
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404670/MyTec%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404670/MyTec%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function closest(el, cl) {
        while (el) {
            if (el.classList && el.classList.contains(cl)) break
            el = el.parentElement
        }
        return el
    }
    document.addEventListener('mouseover', function(evt) {
        const el = closest(evt.target, 'umb-table-body__link')
        if (!el) return
        const row = closest(el.parentElement, 'ng-scope')
        if (!row) return
        const items = Object.keys(row)
        .filter(k => /^jQuery\d+$/.test(k) && row[k] && row[k].$scope && row[k].$scope.item && row[k].$scope.item)
        .map(k => row[k].$scope.item)
        console.log(items)
        if (!items) return
        const editPath = items.filter(itm => itm.editPath).map(itm => itm.editPath)[0]
        if (!editPath) return
        jQuery('#tec-hover-link').remove()
        jQuery('<a href="/umbraco/#' + editPath + '" id="tec-hover-link" target="_blank" style="margin-top: -1.5rem; line-height: 2rem; position: absolute; margin-left: 3.5rem; background: #fff; border: 1px solid #000; border-radius: 3px">open in new tab</a>').prependTo(row)
    }, true)
})();