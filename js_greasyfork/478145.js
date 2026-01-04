// ==UserScript==
// @name         get first bonus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  just autotake first bonus from chanel points in twitch
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478145/get%20first%20bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/478145/get%20first%20bonus.meta.js
// ==/UserScript==
function clickElementByXPath(xpath) {
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      element.click();
      return true;
    }
    return false;
  }


// vovapain first
var buttonPoints ='//*[@id="live-page-chat"]/div/div/div[2]/div/div/section/div/seventv-container/div/div[2]/div[2]/div[1]/div/div/div/div[1]/div[2]/button'
var buttonTask = '//*[@id="channel-points-reward-center-body"]/div/div/div[5]/div/button/div'
var buttonAcccept ='//*[@id="channel-points-reward-center-body"]/div/div/div[3]/div/button'

function clElcl(){
    clickElementByXPath(buttonPoints)
    clickElementByXPath(buttonTask)
    clickElementByXPath(buttonAcccept)
}
(function() {
    'use strict';
        document.addEventListener("keydown", (event) => {
            if (event.key === "F9") {
                console.log("F9 key pressed");
                clElcl()
                // Действия, которые нужно выполнить при нажатии на кнопку F12
            }
    });

    // Your code here...
})();