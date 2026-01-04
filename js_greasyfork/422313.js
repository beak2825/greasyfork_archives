// ==UserScript==
// @name         Mother Fucker Telegram Group Spammer
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  屏蔽 Telegram 群组成员，在下方 * 号处填入昵称然后保存即可。
// @author       莲华
// @match        *://web.telegram.org/*
// @homepage        https://t.me/EroSora
// @namespace        https://gist.github.com/isssuer
// @icon        https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @icon64        https://greasyfork.org/packs/media/images/blacklogo96-b2384000fca45aa17e45eb417cbcbb59.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422313/Mother%20Fucker%20Telegram%20Group%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/422313/Mother%20Fucker%20Telegram%20Group%20Spammer.meta.js
// ==/UserScript==

/*jshint esversion: 8 */

(function () {
  "use strict";
  //***********************************************************
  const SPAMMERS = [""];
  //**********Fill nick names in the brackets above***********
  //const SPAMMERS = ["Troll", "Phisher", "Bullshit", "Asshole "]

  const messageClass = "im_history_message_wrap";
  const grouped = "im_grouped";
  const shortGrouped = "im_grouped_short";
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(node => {
          if (node.className === messageClass) {
            let name, isSpammer;
            try {
              name = node.querySelector("span > a").innerText;
            } catch (e) {}
            if (name && SPAMMERS.indexOf(name) > -1) {
              console.log("Caught a fool！");
              node.style.display = "none";
              let nextNode = node.nextElementSibling;
              while (
                nextNode.classList.contains(grouped) ||
                nextNode.classList.contains(shortGrouped)
              ) {
                nextNode.style.display = "none";
                nextNode = nextNode.nextElementSibling;
              }
            }
          }
        });
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
