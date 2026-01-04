// ==UserScript==
// @name         SRM Easy District Lookup
// @namespace    http://tampermonkey.net/
// @version      2023.07.24.1
// @description  Adds simple search for district by number
// @author       Vance M. Allen
// @match        https://srm.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srm2.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srmtest.sde.idaho.gov/srm/protected/gettingStarted.do*
// @match        https://srmtest2.sde.idaho.gov/srm/protected/gettingStarted.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475145/SRM%20Easy%20District%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/475145/SRM%20Easy%20District%20Lookup.meta.js
// ==/UserScript==

(function() {
    console.warn('SRM Easy District Lookup activated');
    let h3 = document.getElementsByTagName('h3');

    // Add input to the page
    h3.item(h3.length-1).innerHTML += `<input type="text" id="vmaEDL" size="3" maxlength="3" style="border:none;">`;

    let edl = document.getElementById('vmaEDL');
    edl.addEventListener('keypress',function() {
        setTimeout(function() {
            if(edl.value.length < 3) return;

            // Prevent non-numeric entry
            if(!/^\d+$/.test(edl.value)) {
                edl.value = '';
                return;
            }

            let pattern = new RegExp('\\(' + edl.value + '\\)$');
            let select = document.getElementsByName('childOrgId').item(0);
            let orgs = select.getElementsByTagName('option');
            let org;
            for(let i = 0; i < orgs.length; i++) {
                if(pattern.test(orgs.item(i).innerText)) {
                    select.value = orgs.item(i).value;
                    document.organizationForm.submit();
                    return;
                }
            }

            // If it makes it here, the value was invalid and should be cleared.
            edl.value = '';
        });
    });
})();
