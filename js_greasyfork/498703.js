// ==UserScript==
// @name         Aroflo Search & Replace Part Numbers in a Quote
// @namespace    https://contactgroup.com.au
// @version      2024-06-24d
// @description  Click Ctrl-Shift-Q and follow the instructions to replace quote item values while in an Aroflo quote.
// @author       Guray Sunamak
// @match        https://office.aroflo.com/ims/Site/Service/Quotes/index.cfm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aroflo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498703/Aroflo%20Search%20%20Replace%20Part%20Numbers%20in%20a%20Quote.user.js
// @updateURL https://update.greasyfork.org/scripts/498703/Aroflo%20Search%20%20Replace%20Part%20Numbers%20in%20a%20Quote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runQuoteSearchReplace() {
        var searep = prompt("Takeoff Sheet Item Search", "Enter Part Number OR Item Description");
        if (searep) {
            var repval = prompt("Takeoff Sheet Item Replace", "Enter New Price");
            if (!isNaN(repval)) {
                var partno = null;
                var costexid = null;
                var costexinput = null;
                var replacecnt = 0;
                let plist = document.querySelectorAll("input[name='partNo']");
                let dlist = document.querySelectorAll("textarea[name='item']");
                for (let i=0; i<plist.length; ++i) {
                    if((plist[i].value).toLowerCase() == searep.toLowerCase()) {
                        costexid = plist[i].id.replace("PartNo", "costex");
                        let costexinput = document.querySelector("input[id='" + costexid + "']");
                        costexinput.value = repval;
                        costexinput.dispatchEvent(new Event('change', { 'bubbles': true }));
                        replacecnt++;
                    } else if((dlist[i].value).toLowerCase() == searep.toLowerCase()) {
                        costexid = dlist[i].id.replace("ItemText", "costex");
                        let costexinput = document.querySelector("input[id='" + costexid + "']");
                        costexinput.value = repval;
                        costexinput.dispatchEvent(new Event('change', { 'bubbles': true }));
                        replacecnt++;
                    }
                }
                var outmsg = "Replaced " + replacecnt + " occurences.";
                if (replacecnt>0) outmsg += " Don't forget to click Save";
                alert(outmsg);
            }
        }
    }

    // Add event listener for the keyboard shortcut
    document.addEventListener('keydown', function(event) {
        // Check if the key combination is Ctrl+Shift+Q
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyQ') {
            event.preventDefault();
            runQuoteSearchReplace();
        }
    });

})();