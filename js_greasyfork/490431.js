// ==UserScript==
// @name        Meizi
// @namespace   tsui
// @version     1.2.3
// @description 一键采集到 𝑴𝒆𝒊𝒛𝒊
// @author      Tsuiqg
// @match       http*://*/*vod*
// @match       http*://*/api/json*
// @match        http*://*/apijson_*
// @connect     cuiqg.i234.me
// @license     Unlicense
// @iconURL     https://fastly.jsdelivr.net/gh/cuiqg/art@master/icon/icon.png
// @require     https://fastly.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @noframes
// @run-at      document-idle
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       GM_addElement
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_log
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/490431/Meizi.user.js
// @updateURL https://update.greasyfork.org/scripts/490431/Meizi.meta.js
// ==/UserScript==

/* eslint no-undef:off */

(function () {
    'use strict';
    const baseUrl = `https://cuiqg.i234.me:2053`
    const siteUrl = document.location
    const siteTitle = document.title
    const siteOrigin = (new URL(siteUrl)).origin

    GM_registerMenuCommand("📹 Site", function(event) {
        
        const urlSearchParams = (new URLSearchParams({
            title: siteTitle,
            api_url: siteUrl,
            site_url: siteOrigin,
            logo_url: ''
        })).toString()

        const url = (new URL(`/caiji/site?${urlSearchParams}`, baseUrl)).toString()
  
        GM_openInTab(url, {
            active: true
        })
    },{
        id: 'caiji-site',
        accessKey: "s",
        autoClose: true,
        title: 'Caiji Site.'
    })

    GM_registerMenuCommand("📹 Custom", function(event) {
        
        const urlSearchParams = (new URLSearchParams({
            title: siteTitle,
            poster: '',
            source: '',
            live: 0
        })).toString()

        const url = (new URL(`/caiji/custom?${urlSearchParams}`, baseUrl)).toString()
  
        GM_openInTab(url, {
            active: true
        })
    },{
        id: 'caiji-video',
        accessKey: "v",
        autoClose: true,
        title: 'Caiji Video.'
    })
})();