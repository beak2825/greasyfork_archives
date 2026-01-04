// ==UserScript==
// @name            YoutubeAdblockMsgAutoDismiss
// @name:zh-tw      自動關閉Adblock提示
// @namespace       com.sherryyue.YoutubeAdblockMsgAutoDismiss
// @version         0.1
// @description     Youtube Adblock auto dismiss. For 2023/10 and further
// @description:zh-tw     自動關閉Adblock提示，應對2023/10版本
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.youtube.com/*
// @match           *://youtube.com/*

// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/477525/YoutubeAdblockMsgAutoDismiss.user.js
// @updateURL https://update.greasyfork.org/scripts/477525/YoutubeAdblockMsgAutoDismiss.meta.js
// ==/UserScript==

(function () {
  'use strict';
  waitForKeyElements('ytd-enforcement-message-view-model', () => {
    document.querySelector('ytd-enforcement-message-view-model').parentNode.parentNode.style.setProperty('display', 'none', 'important')
    document.querySelector('tp-yt-iron-overlay-backdrop').style.setProperty('display', 'none', 'important')
  })
})();