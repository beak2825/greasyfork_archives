// ==UserScript==
// @name               golink：掘金去除手动跳转
// @name:zh-TW         golink：掘金去除手動跳轉
// @namespace          https://greasyfork.org/zh-CN/users/836376-codeniu
// @version      0.0.2
// @description      golink是用于无感跳转到掘金等无法直接跳转的外链，免去手动跳转的烦恼。
// @description:zh-tw golink是用於無感跳轉掘金等無法直接跳轉的外鏈，免去手動跳轉的煩惱。
// @author       codeniu
// @match        *://*.juejin.cn/*
// @grant              unsafeWindow
// @grant              GM_log
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_getResourceText
// @grant              GM_getResourceURL
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @grant              GM_notification
// @connect            127.0.0.1
// @connect            localhost
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/435283/golink%EF%BC%9A%E6%8E%98%E9%87%91%E5%8E%BB%E9%99%A4%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435283/golink%EF%BC%9A%E6%8E%98%E9%87%91%E5%8E%BB%E9%99%A4%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
'use strict'

    setTimeout(() => {

        let link = document.getElementsByClassName('link-content')[0].getElementsByTagName('p')[0].textContent
        if (link) {
            window.location.href = link
            return
        }

    },20)

})();