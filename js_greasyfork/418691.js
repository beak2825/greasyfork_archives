// ==UserScript==
// @name               nonstop：去除手动跳转
// @name:zh-TW         nonstop：去除手動跳轉
// @namespace    https://greasyfork.org/en/users/716928-grepreia
// @version      0.1.41
// @description       Nonstop是用于无感跳转到知乎，微博，简书，QQ 邮箱等无法直接跳转的外链，免去手动跳转的烦恼。
// @description:zh-tw Nonstop是用於無感跳轉到知乎，微博，簡書，QQ 郵箱等無法直接跳轉的外鏈，免去手動跳轉的煩惱。
// @author       grepreia
// @match        *://*.zhihu.com/*
// @match        *://*.jianshu.com/*
// @match        *://mail.qq.com/*
// @require            https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/418691/nonstop%EF%BC%9A%E5%8E%BB%E9%99%A4%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418691/nonstop%EF%BC%9A%E5%8E%BB%E9%99%A4%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
'use strict'
    let href = window.location.href
    if (href.indexOf('www.zhihu.com/question/') != -1) {
        // close zhihu login page when not logged
        window.onload = () => {
            let btn = document.querySelector('.Button.Modal-closeButton.Button--plain')
            if (btn) btn.click()
            return
        }
    }
    // redirect for zhihu, weibo, qqmail sites
    let link = document.querySelector('.link') || document.querySelector('.safety-url')
    let url = link ? link.textContent : ''
    if (url) {
        window.location.href = url
        return
    }
    // redirect for jianshu site
    let getParams = field => {
        let urlObject = new URL(href)
        let res = urlObject.searchParams.get(field)
        return res
    }
    url = getParams('url')
    if (url) window.location.href = url
})();