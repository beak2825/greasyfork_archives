// ==UserScript==
// @name         TMPR_YH_CORS_HANDLER
// @namespace    localhost :-)
// @version      0.1
// @description  "Load yard data & display information"
// @author       rzlotos
// @match        file:///C:/Users/rzlotos/Desktop/Final_Dashboard/testfield/index.html
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427143/TMPR_YH_CORS_HANDLER.user.js
// @updateURL https://update.greasyfork.org/scripts/427143/TMPR_YH_CORS_HANDLER.meta.js
// ==/UserScript==

const src_url = 'https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard'; //data source
(function() {
    if(document.getElementById("control_panel") != undefined)
    {
        document.getElementById("status").innerHTML = '<span style="color: palegreen;">Script is loaded & running!</span><button id="btn1">TMPR_YMS</button>';
    }
})();

document.getElementById("btn1").addEventListener("click",YHL_fetch, false);

function YHL_fetch (zEvent)
{
    GM_xmlhttpRequest(
        {method: "GET",
        url: src_url,
        onload: function(response) {
            var strResponse = response.responseText;
            unsafeWindow.getWeb(strResponse);
        }
    });
};

