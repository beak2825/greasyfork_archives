// ==UserScript==
// @name         Entity Manager - Quick Merge
// @namespace    http://tampermonkey.net/
// @version      2023.07.11.1
// @description  Gives quick access to merge two EDUIDs
// @author       Vance M. Allen
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/Find
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/View?eduId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475133/Entity%20Manager%20-%20Quick%20Merge.user.js
// @updateURL https://update.greasyfork.org/scripts/475133/Entity%20Manager%20-%20Quick%20Merge.meta.js
// ==/UserScript==

(function() {
    let h2 = document.getElementsByTagName('h2').item(0);
    h2.innerHTML = h2.innerHTML + `<span style="float: right;"><input type="text" id="vmaQuickMerge" name="vmaQuickMerge" value="" size="20" style="border: none;"></span>`;
    let qm = document.getElementById('vmaQuickMerge');

    let merge = function() {
        if(/^\d{9}\t\d{9}$/.test(qm.value.trim())) {
            let eduids = qm.value.trim().split('\t');

            // Reroute user to Merge page!
            console.warn('Received two EDUIDs, so forwarding to Merge page!');
            window.location.href = `https://apps2.sde.idaho.gov/EntityManager/PersonMerge?eduId1=${eduids[0]}&eduId2=${eduids[1]}`;
        }
    };

    qm.onpaste = function() {
        setTimeout(function() { qm.dispatchEvent(new Event('change')); });
    };
    qm.onchange = merge;
})();
