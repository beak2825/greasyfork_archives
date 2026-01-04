// ==UserScript==
// @name        防紅眼腳本 - popcat.click
// @namespace   Violentmonkey Scripts
// @match       https://popcat.click/
// @grant       none
// @version     1.0
// @author      002
// @description 2021/8/20 下午3:12:49
// @downloadURL https://update.greasyfork.org/scripts/431099/%E9%98%B2%E7%B4%85%E7%9C%BC%E8%85%B3%E6%9C%AC%20-%20popcatclick.user.js
// @updateURL https://update.greasyfork.org/scripts/431099/%E9%98%B2%E7%B4%85%E7%9C%BC%E8%85%B3%E6%9C%AC%20-%20popcatclick.meta.js
// ==/UserScript==
(()=>{    
    console.clear()

    var event = new KeyboardEvent('keydown', {
        key: 'g',
        ctrlKey: true
    });

    // Start sendStats interval
    document.dispatchEvent(event);
    // Total pops
    var total = 0;

    var iv = setInterval(()=>{
        // Get VUE
        var vue = document.getElementById('app').__vue__;
        // Check if user is marked as bot (just for safety measures, very unlikely to happen)
        if(vue.bot){
            console.log("%c You've been barked as a bot. Please clear your cookies.", "background: #a00; color: #fff");
            clearInterval(iv);
            return;
        }
        // Prevent ban
        vue.sequential_max_pops = 0;
        // Detect sendStats function run
        if(vue.accumulator == 0){
            total += 800;
            console.log(`[${new Date().toLocaleTimeString()}] %c800 pops sent (Total: ${total})`, "color: #0f0");
            // Open and close cat's mouth
            vue.open = true;
            setTimeout(()=>{
                vue.open = false;
            }, 1000);
        }
        // Set 800 pops
        vue.accumulator = 800;
    }, 1000);

    console.log("%c Bot started. Waiting for the first request being sent. ", "background: #050; color: #0f0");
})();