// ==UserScript==
// @name         Geoguessr Hide Free Account Banner and Ads
// @version      0.2.5
// @description  Removes the "Buy pro" section at the top of the page and ads that free accounts have, moves the free games timer elsewhere
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/321914/broom.svg
// @grant        none
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452755/Geoguessr%20Hide%20Free%20Account%20Banner%20and%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/452755/Geoguessr%20Hide%20Free%20Account%20Banner%20and%20Ads.meta.js
// ==/UserScript==


function onMutation(mutation) {
    let ticket = document.querySelector("div[class^='ticket-bar-view_root__']")
    if (ticket) {
        document.querySelector("div[class^='ticket-bar-view_content__']").remove()
        document.querySelector("div[class^='ticket-bar-view_meta__']").children[1].remove()
        ticket.style = 'position: fixed; left: 10px; top: 15px; z-index: 1';
        for (let className of ticket.classList) {
            if (className.startsWith("ticket-bar-view_root__")) {
                ticket.classList.remove(className);
                break;
            }
        }
    }
    const adQueriesToBlock = ["[class^='ad_horizontalAd__']", "[class^='ad_verticalAd__']"]
    for (let adQuery of adQueriesToBlock) {
        let ad = document.querySelector(adQuery)
        if (ad) ad.remove()
    }
    const adQueriesToHide = [".game-layout__in-game-logos", "[class^='modal_backlight__']"]
    for (let adQuery of adQueriesToHide) {
        let ad = document.querySelector(adQuery);
        if (ad) console.log(adQuery)
        if (ad) ad.style.display = "none";
    }
}

let observer = new MutationObserver(onMutation);

observer.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});
