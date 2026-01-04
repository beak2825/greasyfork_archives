// ==UserScript==
// @name         SSP CTLM Compliance fix
// @namespace    Trans-logistics-eu.amazon.com
// @version      0.4
// @description  SSP CTLM Tool compliance fixer
// @author       rzlotos
// @license      MIT
// @match        https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/456584/SSP%20CTLM%20Compliance%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/456584/SSP%20CTLM%20Compliance%20fix.meta.js
// ==/UserScript==

var cfg = { fc_code: null, url: window.location.href, limit: 5 };

function getCTLM(params){
    console.info(typeof sessionStorage.getItem(params.planid), sessionStorage.getItem(params.planid));
    if(sessionStorage.getItem(params.planid) === null){ sessionStorage.setItem(params.planid, 1); }
    else if(sessionStorage.getItem(params.planid)*1 < cfg.limit){
        sessionStorage.setItem(params.planid, (sessionStorage.getItem(params.planid)*1)+1);
        GM.xmlHttpRequest({
                  method: "POST",
                  url: `${cfg.url}/fetchdata?`,
                  data: `entity=getEligibleContainersForLoad&nodeId=${document.getElementById('activeAccountName').innerText.substring(3)}&loadId=${params.planid}`,
                  headers: { "accept": "application/json, text/javascript, */*; q=0.01", "accept-language": "en-US,en;q=0.9", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                  onload: function(response){
                      console.info(`${params.vrid}: OK`);
                  }
              });
    }
}

( async function() {
    'use strict';
    document.body.addEventListener('click', function(e){
        if(e.target.nodeName == 'A' && e.target.className == 'containerHierarchy sweepLink colorBlue')
        {
            getCTLM({planid: e.target.dataset.planid, vrid: e.target.dataset.vrid});
        }else if(e.target.id == 'startLoading'){ getCTLM({planid: e.target.dataset.planid, vrid: e.target.dataset.vrid}); }});
})();