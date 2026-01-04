// ==UserScript==
// @name         Knolix Auto Coin Collector
// @namespace    http://tampermonkey.net/
// @description  Collect coins automatically, click home after harvest page, and check tree every minute.
// @version      2.5
// @author       Rubystance
// @license      MIT
// @match        https://knolix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543539/Knolix%20Auto%20Coin%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/543539/Knolix%20Auto%20Coin%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.Fingerprint2 === "undefined") {
        window.Fingerprint2 = { get: function(cb){ try{ cb([], []); } catch(e){} } };
        console.log("[Tampermonkey] Fake Fingerprint2 injected.");
    }

    if (typeof window.Recaptcha === "undefined") {
        window.Recaptcha = {
            execute: function(){ console.log("[Tampermonkey] Fake Recaptcha.execute called."); return Promise.resolve("fake-token"); },
            getResponse: function(){ return "fake-token"; },
            reset: function(){ console.log("[Tampermonkey] Fake Recaptcha.reset called."); },
            reload: function(){ console.log("[Tampermonkey] Fake Recaptcha.reload called."); }
        };
        console.log("[Tampermonkey] Fake Recaptcha injected.");
    }

    function triggerClick(element){
        if(!element) return;
        let event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }

    function autoCollect(){
        const MIN_COIN_SIZE = 30;
        let coins = document.querySelectorAll(".coin, img[src*='coin'], .coin-animation");
        coins.forEach(coin => {
            if(coin.offsetParent !== null){
                let rect = coin.getBoundingClientRect();
                if(rect.width >= MIN_COIN_SIZE && rect.height >= MIN_COIN_SIZE){
                    triggerClick(coin);
                    console.log(`[Tampermonkey] Big coin clicked! Size: ${rect.width}x${rect.height}`);
                }
            }
        });
    }

    function handleHarvestPage(){
        if(window.location.href.includes("/harvest.php?reward_token")){
            let homeBtn = document.querySelector("i.fas.fa-home");
            if(homeBtn){
                triggerClick(homeBtn);
                console.log("[Tampermonkey] Harvest page: Home button clicked!");
            }
        }
    }

    function checkTree(){

        let treeBtn = document.querySelector(".tree, #check-tree, .tree-button");
        if(treeBtn){
            triggerClick(treeBtn);
            console.log("[Tampermonkey] Tree checked!");
        } else {
            console.log("[Tampermonkey] Tree button not found, reloading page...");
            window.location.reload();
        }
    }

    setInterval(autoCollect, 3000);
    setInterval(handleHarvestPage, 2000);
    setInterval(checkTree, 60000);

})();
