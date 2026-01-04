// ==UserScript==
// @name         JD预定抢购2
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  隐藏温馨提示和去除无货提示
// @author       Hack Lee
// @match        https://wqs.jd.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450013/JD%E9%A2%84%E5%AE%9A%E6%8A%A2%E8%B4%AD2.user.js
// @updateURL https://update.greasyfork.org/scripts/450013/JD%E9%A2%84%E5%AE%9A%E6%8A%A2%E8%B4%AD2.meta.js
// ==/UserScript==

let weburl=unsafeWindow.location.href

if(weburl.indexOf('wqs.jd.com')!=-1)
{
    GM_addStyle('#id-pcprompt-mask{display:none !important}')
    setTimeout(( ) => document.querySelector("#\\/index\\?stamp\\=1 > taro-view-core.with-navigation_index__container__q55g9.hydrated > taro-view-core.with-navigation_index__body__1Xzah.hydrated > taro-view-core > taro-custom-wrapper-core:nth-child(3) > taro-view-core").remove(),1300 )
}