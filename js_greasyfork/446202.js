// ==UserScript==
// @name         TSO_TWApp_Auto_Refresh&Sort
// @namespace    https://cip.corp.amazon.com/
// @version      0.02
// @description  Refresh TruckWasteApp data & Sort table
// @author       rzlotos
// @match        https://cip.corp.amazon.com/wasted-trucks-monitoring
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446202/TSO_TWApp_Auto_RefreshSort.user.js
// @updateURL https://update.greasyfork.org/scripts/446202/TSO_TWApp_Auto_RefreshSort.meta.js
// ==/UserScript==

const cfg = { fc_code: 'KTW3', update_interval: 180, filter_table: true, display_countdown: true };
var input = document.querySelector("#app > div:nth-child(3) > div.jss14.jss18.jss15 > div > div > table.jss122.jss118.jss119.jss120 > thead > tr:nth-child(3) > th:nth-child(3) > div > div > input");
var header = document.getElementsByTagName('h6')[0];
        var lastHeaderValue = header.innerText;
(function() {
    'use strict';

    window.refresh_countdown=cfg.update_interval;
    const apply_filter = ()=>{
        let lastValue = input.value;
        input.value = cfg.fc_code+"->";
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(cfg.fc_code);
        }
        input.dispatchEvent(event);
    }
    const clk_handler = setInterval( ()=>{ clk_func(window.refresh_countdown); apply_filter(); }, 1000);
    function clk_func(counter){
        if(cfg.filter_table == true){ if(input.value !== cfg.fc_code+"->" || input._valueTracker.getValue() !== cfg.fc_code+"->"){ apply_filter; }}
        window.refresh_countdown--;
        if(counter == 0){window.location.reload()}
        if(display_countdown){display_countdown(window.refresh_countdown)}
    }
    if(cfg.filter_table){ const apply_filter_action = setTimeout(apply_filter, 1500); }
    const display_countdown = (count)=>{ header.innerText = lastHeaderValue + ' - ' + count + ' to scripted refresh'; }
})();