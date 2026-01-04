// ==UserScript==
// @name         DFM Auto Refresh
// @namespace    https://greasyfork.org/en/scripts/427141-dfm-auto-refresh
// @version      1.7
// @description  DFM Auto Refresh Script
// @author       Franklin Chen
// @icon         https://www.google.com/s2/favicons?domain=dynamics.com
// @include      http*://onesupport.crm.dynamics.com/main.aspx*
// @grant        none
// @run-at       document-idle
// @copyright	 2021, Franklin Chen
// @downloadURL https://update.greasyfork.org/scripts/427141/DFM%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/427141/DFM%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var autoRefreshTimer = null;
    localStorage.setItem("dfm_auto_fresh", 'false');//Init
    var clicker = function () {
        var isStarted = localStorage.getItem("dfm_auto_fresh");
        if(isStarted !== undefined && isStarted === 'true'){
            localStorage.setItem("dfm_auto_fresh", 'false');
            if(autoRefreshTimer!=null){
                clearInterval(autoRefreshTimer);
                console.log('Stopped auto-refresh'); document.querySelector('button[id="btnAutoRefresh"]').style.backgroundColor="FireBrick";
                alert('Stopped auto-refresh');
            }
            return;
        }
        var btn = document.querySelector('button[id*="Mscrm.Modern.refreshCommand"][id$="button"]');
        if (btn) {
            localStorage.setItem("dfm_auto_fresh", 'true');
            console.log('Started auto-refresh'); document.querySelector('button[id="btnAutoRefresh"]').style.backgroundColor="greenyellow";
            alert('Started auto-refresh');
            autoRefreshTimer = setInterval (
                function () {
                    btn.click();
                    console.log('Auto Refresh - '+new Date());
                }
                , 60 * 1000 //1 min
            );
        } else {
            alert("No Button found");
        }
	};

    var pageMenuBarCheckTimer = setInterval (
        function () {
            var matches = document.querySelectorAll("ul[role='menubar']");
            if(matches.length > 0) {
                clearInterval(pageMenuBarCheckTimer);
                var liElement = document.createElement('li');
                liElement.innerHTML='<button id="btnAutoRefresh" type="button" style="background-color: FireBrick;" class="pa-ao pa-ap pa-gh pa-bq pa-he pa-i pa-ax pa-o pa-hf pa-hg pa-hh flexbox"><span aria-hidden="true" class="pa-am pa-a pa-cm "><span class="pa-k pa-am "><img src="/uclient/resources/images/Refresh.svg?v=1.4.2625-2104.3" alt="Auto Refresh" style="width: 16px;margin-left: 10px;"></span></button>';
                var firstChild = matches[0].querySelectorAll('li')[0];
                matches[0].insertBefore(liElement, firstChild);

                var aRButton = document.getElementById('btnAutoRefresh');

                aRButton.addEventListener("click", function () {
                    clicker();
                }, false);
            }
        }
        , 1000
    );
})();