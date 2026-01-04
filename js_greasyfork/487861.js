// ==UserScript==
// @name         NekoDownloader
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  OMG NEKO PORN
// @author       BloodyShy
// @match        https://yande.re/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yande.re
// @grant	GM_addElement
// @grant	GM_addStyle
// @grant	GM_download
// @grant	GM_getResourceText
// @grant	GM_getResourceURL
// @grant	GM_info
// @grant	GM_log
// @grant	GM_notification
// @grant	GM_openInTab
// @grant	GM_registerMenuCommand
// @grant	GM_unregisterMenuCommand
// @grant	GM_setClipboard
// @grant	GM_getTab
// @grant	GM_saveTab
// @grant	GM_getTabs
// @grant	GM_setValue
// @grant	GM_getValue
// @grant	GM_deleteValue
// @grant	GM_listValues
// @grant	GM_addValueChangeListener
// @grant	GM_removeValueChangeListener
// @grant	GM_xmlhttpRequest
// @grant	GM_cookie
// @grant	window.onurlchange
// @grant    unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487861/NekoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487861/NekoDownloader.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
var $ = window.jQuery;

  window.onload = function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    var code = 'function dwnlAll() {var newbie = document.querySelectorAll(".directlink.largeimg").forEach(function openInNewTab(url){window.open(url, "_blank").focus();});};';
    try {
      s.appendChild(document.createTextNode(code));
      document.body.appendChild(s);
    } catch (e) {
      s.text = code;
      document.body.appendChild(s);
    }
  };

const boxWrapper = document.getElementById("site-title");

const dwnld = document.createElement("button");
dwnld.innerHTML = 'DOWNLOAD ALL';
dwnld.style.backgroundColor = "transparent";
dwnld.style.display = "inline-block";
dwnld.style.position = "relative";
dwnld.style.left = "160px";
dwnld.style.top = "-30px";
dwnld.style.color = "#e94543";
dwnld.style.border = "4px solid";
dwnld.style.borderRadius = "30px";
dwnld.style.fontFamily = "fantasy";
dwnld.style.fontSize = "20px";
dwnld.style.cursor = "pointer";
dwnld.classList.add("dwnld");
dwnld.setAttribute("id", "dwnlall");
dwnld.setAttribute("onclick", "dwnlAll()");
boxWrapper.appendChild(dwnld);


})();