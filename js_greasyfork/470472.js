// ==UserScript==
// @name        Fox.Home Category
// @namespace   Fox.Home.OpenAI
// @match       https://chat.openai.com/*
// @grant       none
// @version     1.1
// @author      D0n9X1n
// @description 7/9/2023, 5:46:20 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470472/FoxHome%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/470472/FoxHome%20Category.meta.js
// ==/UserScript==

var styleElement = document.createElement("style");
styleElement.innerHTML =
  `.from-gray-900 {
    display: none !important;
  }

  .from-gray-800 {
    display: none !important;
  }

  li {
    margin: 5px 5px 0 0 !important;
  }

  .tab-mike {
    font-weight: bold !important;
    color: #b16286 !important;
  }

  .tab-youzi {
    font-weight: bold !important;
    color: #d79921 !important;
  }

  .tab-gpt3 {
    background-color: #504945 !important;
  }

  .tab-gpt4 {
    background-color: #427b58 !important;
  }
  `;
document.head.appendChild(styleElement);

var targetList = document.querySelector("body");
var previousContent = "";

function Render() {
  var navList = document.querySelector(".flex.flex-col.gap-2.pb-2.text-gray-100.text-sm");

  if (navList != null) {
    var tabList = navList.childNodes[0].childNodes[0];

    var tabListContent = tabList.innerHTML;
    if (tabListContent == previousContent) {
      return;
    }

    previousContent = tabListContent;
    tabList.querySelectorAll("div").forEach(function(div) {
      var content = div.textContent.trim();

      if (content.length < 100) {
        if (content.includes("[Mike]") && div.classList.contains("break-all")) {
          div.classList.add("tab-mike");
        }

        if (content.includes("[Youzi]") && div.classList.contains("break-all")) {
          div.classList.add("tab-youzi");
        }

        if (content.includes("[GPT3]") && div.classList.contains("break-all")) {
          div.parentElement.classList.add("tab-gpt3");
        }

        if (content.includes("[GPT4]") && div.classList.contains("break-all")) {
          div.parentElement.classList.add("tab-gpt4");
        }
      }
    });
  }
}

var config = {
  childList: true,
  subtree: true,
  characterData: true
};

var observer = new MutationObserver(function(mutations) {
  observer.disconnect();
  Render();
  observer.observe(targetList, config);
});

console.log('Window is fully loaded');
Render();
observer.observe(targetList, config);