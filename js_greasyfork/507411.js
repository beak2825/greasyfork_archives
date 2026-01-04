// ==UserScript==
// @name         Twitch+
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @description  Twitch+ is a compiled version of a bunch of other scripts for twitch.
// @author       SL4F
// @version      0.0.2
// @match        https://www.twitch.tv/*
// @match        https://gaming.amazon.com/*
// @match        https://www.twitch.tv/drops/inventory*
// @run-at       document-start
// @grant        window.reload
// @license      MIT
// @namespace https://greasyfork.org/users/1364760
// @downloadURL https://update.greasyfork.org/scripts/507411/Twitch%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/507411/Twitch%2B.meta.js
// ==/UserScript==

/*
    ==== INFO ====
    Author: SL4F
    Github: https://github.com/SL4F
    Website: https://heartless.uno
    ==== CREDITS ====
    Twitch helper: https://greasyfork.org/en/scripts/445835-twitch-helper
    Twitch Prime Loot Claim All Button: https://greasyfork.org/en/scripts/412756-twitch-prime-loot-claim-all-button
    Twitch Error Fix: https://greasyfork.org/en/scripts/503974-twitch-error-fix
    Twitch Directory Auto Refresh: https://greasyfork.org/en/scripts/496422-twitch-directory-auto-refresh
    Twitch Un-raid: https://greasyfork.org/en/scripts/487575-twitch-un-raid
    Twitch, Auto reload when *k error: https://greasyfork.org/en/scripts/472868-twitch-auto-reload-when-k-error

*/

(function() {
    // Twitch, Auto reload when *k error
    setInterval(() => {
        var button = document.querySelector(".player-overlay-background button");
        if (button) {
            button.click();
        }
    }, 1000);
    // Twitch Un-raid
    function checkPage(){
        if(window.location.href.includes('?referrer=raid')){
            history.back()
        }
    }
    setTimeout(checkPage, 3*1000);
    // Twitch Error Fix
    function checkStatus() {
        const results = document.querySelector("#root > div > div.Layout-sc-1xcs6mc-0.lcpZLv > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.InjectLayout-sc-1i43xsx-0.persistent-player > div > div.Layout-sc-1xcs6mc-0.video-player > div > div.Layout-sc-1xcs6mc-0.video-ref > div > div > div.Layout-sc-1xcs6mc-0.dZwwnJ.player-overlay-background.player-overlay-background--darkness-0.content-overlay-gate > div > div.Layout-sc-1xcs6mc-0.jkApnw.content-overlay-gate__allow-pointers > button")
        const btn = document.querySelector("#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > div.Layout-sc-1xcs6mc-0.kILIqT.chat-input > div:nth-child(2) > div.Layout-sc-1xcs6mc-0.eWfUfi.chat-input__buttons-container > div.Layout-sc-1xcs6mc-0.cNKHwD > div > div > div > div.Layout-sc-1xcs6mc-0.kxrhnx > div > div > div > button")
        if (results) {
            results.click()
        }
        if(btn){
        btn.click()
        }
    }

    window.onload = function () {
        setInterval(checkStatus, 1000);
    }
    // Twitch Directory Auto Refresh
    // Wait for 5 minutes then refresh the page
    setInterval(function() {
        if (window.location.pathname.startsWith('/directory/')){
            location.reload();
        }
    }, 5*60*1000); //  = 5 minutes
    // Twitch helper
    const getReload = () => {
        try {
            const button = document.querySelector("[data-a-target='player-overlay-content-gate']").children[2].firstChild;
            if (button.firstChild.children.length === 2) return button;
        } catch(err) {}
    }

    const getBonus = () => {
        try {
            return document.querySelector("div[class*='claimable-bonus__icon']").parentElement.parentElement.parentElement;
        } catch(err) {}
    }

    setInterval(() => {
        const bonus = getBonus();
		const reloadPlayer = getReload();
		if (bonus) bonus.click();
		if (reloadPlayer) reloadPlayer.click();
    }, 500);
    // Twitch Prime Loot Claim All Button
    let o = new MutationObserver((m) => {
        let script = document.createElement("script");
        script.innerHTML = 'const claimAll=()=>{let aTags=document.getElementsByTagName("div"),searchText="Claim Offer";for(var i=0;i<aTags.length;i++)aTags[i].textContent==searchText&&aTags[i].parentElement.parentElement.click();};';
        document.getElementById("PrimeOfferPopover-header").innerHTML = "";
        document.getElementById("PrimeOfferPopover-header").appendChild(script);
        document.getElementById("PrimeOfferPopover-header").innerHTML += "<input type='button' style='border: none;' class='tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-full-width tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative' value='Claim All' onclick='claimAll();'>";
    });

    o.observe(document.body, {childList: true});
})();