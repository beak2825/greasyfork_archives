// ==UserScript==
// @name         Dashboard auto-refresh
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  Automatically refresh your Multi-Player dashboard by re-applying your currently selected games filter.
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer/
// @icon         https://icons.duckduckgo.com/ip2/warzone.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535055/Dashboard%20auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/535055/Dashboard%20auto-refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const secondsBetweenRefreshes = 30;

    function ScheduleRefresh() {
         setTimeout(RefreshFilter, secondsBetweenRefreshes * 1000);
    }

    function GetFilterPrompt() {
        return document.getElementById("AlertVMPrompt_Inner");
    }

    function RefreshFilter()
    {
        function SelectFilterOption(filterText) {
            let prompt = GetFilterPrompt();
            if (prompt) {
                let btn = Array.from(prompt.querySelectorAll("input")).filter(i => i.value.startsWith(filterText)).at(0);
                setTimeout(() => btn.click(), 300); // WZ is slow when adding event handlers, so we need to wait with clicking
                ScheduleRefresh();
            } else {
                setTimeout(() => SelectFilterOption(filterText), 25);
            }
        }

        let filterBtn = document.getElementById("MyGamesFilterBtn");
        if (filterBtn) {
            if (!GetFilterPrompt()) {
                filterBtn.click();
            }

            SelectFilterOption(filterBtn.innerText.slice(8, -3));
        }
    }

    ScheduleRefresh();
})();