// ==UserScript==
// @name           Toot Translate Button
// @name:ja        トゥート翻訳ボタン
// @namespace      https://github.com/yzrsng
// @description    Add the button which open Google Translate with new tab and translate toots into Mastodon UI Language, to action bar
// @description:ja Google翻訳を新しいタブで開いてトゥートをマストドンのUI言語に翻訳するボタンをアクションバーに追加
// @version        0.2.20221226.3
// @license        CC0-1.0
// @match          *://fedibird.com/*
// @match          *://*/web/*
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/423556/Toot%20Translate%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/423556/Toot%20Translate%20Button.meta.js
// ==/UserScript==

/**
 * translate Example by google URL
 * https://translate.google.com/?sl=auto&tl=ja&text=Example&op=translate
 */

(function() {
  'use strict';

  const scriptName = "tootTranslateButton";

  const debug = false;
  const debugLog = (message) => {
    if (debug) {
      const logTitle = scriptName + " : ";
      if (typeof message === 'string') {
        console.debug(logTitle + message);
      }
      else {
        console.debug(logTitle);
        console.log(message);
      }
    }
  };

  let noMstdnCount = 0;

  const checkMstdnOption = {
    childList: true,
    subtree: true
  };

  const checkMastodon = (records, obs) => {
    debugLog("checkMastodon : ");
    const checkId = "mastodon";
    const mstdnWebElm = document.getElementById(checkId);
    if (mstdnWebElm) {
      debugLog("This web site is Mastodon server!")
      obs.disconnect();
      const addTranslatebutton = (records, obs) => {
        const classString = "google-translate-button-auto2jp";
        const baseButton = document.createElement('button');
        baseButton.classList.add(classString);
        baseButton.style = `
        background-color: transparent;
        border-radius: 5px;
        padding-right: 1px;
        padding-left: 1px;
        font-size: 18px;
        width: 23.1429px;
        height: 23.1429px;
        line-height: 18px;
        `;
        const baseImg = document.createElement('img');
        baseImg.src = "https://ssl.gstatic.com/translate/favicon.ico";
        baseImg.style = `
        width: 1em;
        height: 1em;
        pointer-events: none;
        `;
        baseButton.appendChild(baseImg);
        const returnFormatedTransText = (elm) => {
          // pleroma div>br, mastodo div>p>br, misskey div>p>span>br
          let t = "";
          const nName = elm.nodeName;
          if (nName === "BUTTON") {
            return "";
          }
          if (nName === "#text") {
            t += elm.textContent;
          }
          else if (nName === "BR") {
            return "\n";
          }
          else if (nName === "P" && elm.previousElementSibling) {
            t = "\n\n" + t;
          }
          // for fedibird
          else if (nName === "SPAN" && elm.classList.contains("reference-link-inline")) {
            return "";
          }
          else if (nName !== "SPAN" && elm.previousElementSibling) {
            t = "\n" + t;
          }
          else if (nName === "IMG") {
            return elm.alt;
          }
          const cNodes = elm.childNodes;
          for (const cNode of cNodes) {
            t += returnFormatedTransText(cNode);
          }
          return t;
        };
        const addFuncTrans = (e) => {
          const tContentElm = e.target.parentNode.parentNode.getElementsByClassName("status__content")[0];
          if (tContentElm) {
            const toLang = document.children[0].lang;
            debugLog(toLang);
            const hrefHead = `https://translate.google.com/?sl=auto&tl=${toLang}&text=`;
            const hrefFoot = `&op=translate`;
            const t = returnFormatedTransText(tContentElm);
            window.open(hrefHead + encodeURIComponent(t) + hrefFoot, "_blank");
          }
        };

        const sBars = mstdnWebElm.getElementsByClassName("status__action-bar");
        for (const sBar of sBars) {
          if (!sBar.classList.contains(classString)) {
            const transButton = baseButton.cloneNode(true);
            transButton.onclick = addFuncTrans;
            transButton.classList.add("status__action-bar-button");
            sBar.lastElementChild.before(transButton);
            sBar.classList.add(classString);
          }
        }
        if (/^\/web\/statuses\/[0-9]+$/.test(location.pathname)) {
          const dsBar = mstdnWebElm.getElementsByClassName("detailed-status__action-bar")[0];
          if (dsBar && !dsBar.classList.contains(classString)) {
            const transButton = baseButton.cloneNode(true);
            transButton.onclick = addFuncTrans;
            transButton.classList.add("detailed-status__button");
            dsBar.lastElementChild.before(transButton);
            dsBar.classList.add(classString);
          }
        }
        return;
      };
      const timelineObs = new MutationObserver(addTranslatebutton);
      timelineObs.observe(mstdnWebElm, checkMstdnOption);
    }
    else {
      debugLog("This web site is not Mastodon server...?")
      noMstdnCount++;
      if (noMstdnCount > 3) {
        debugLog("Maybe not Mastodon server")
        obs.disconnect();
        debugLog("Check observer stopped");
      }
    }
  };

  const checkMstdnObs = new MutationObserver(checkMastodon);
  checkMstdnObs.observe(document.body, checkMstdnOption);
})();

