// ==UserScript==
// @name         Rome Tools
// @namespace    http://tampermonkey.net/
// @description  set MT height
// @license      MIT
// @version      0.3
// @icon         https://p1.meituan.net/travelcube/ccc7cd82054f819aa1e13ec9ffad7ed5314182.png
// @match        https://horn.sankuai.com/files/edit/*
// @match        https://horn.sankuai.com/new/file/*
// @match        https://horn.sankuai.com/legacy/files/*
// @match        https://horn.sankuai.com/file/*
// @match        https://oceanus.mws.sankuai.com/site_detail?*
// @match        https://talos.sankuai.com/*
// @match        https://talos.hfe.st.sankuai.com/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460165/Rome%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/460165/Rome%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log("Rome+Tampermonkey");
    GM_addStyle('.code-editor{height: 800px !important}');
    GM_addStyle('.editor-container{height: 800px !important}');
    GM_addStyle('.component-content-card{height: 500px !important; width: 800px !important}');
    GM_addStyle('.CodeMirror{height: 900px !important}');

    function setHeight() {
      const list = document.querySelectorAll(".log-theme > div");
      GM_log('i')
      list.forEach(function(i){
        i.setAttribute("style", "height: 600px; overflow-y: auto;");
      })
      GM_log('j')
    }

    const loaded =
    document.readyState == "complete" ||
    document.readyState == "loaded" ||
    document.readyState == "interactive";
    // talos页面加载可能稍慢
    const mountAfterDelay = () => setTimeout(setHeight, 3000);
    if (loaded) {
        mountAfterDelay();
    } else {
        window.addEventListener("DOMContentLoaded", mountAfterDelay);
    }

})();