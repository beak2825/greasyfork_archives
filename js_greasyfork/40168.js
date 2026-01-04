// ==UserScript==
// @name         代购助手
// @version      2018.04.02
// @description # 禁止代购电脑进入淘宝,京东支付页面
// @author       mao
// @match        *://buy.tmall.com/*
// @match        *://buy.taobao.com/*
// @match        *://trade.jd.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/40168/%E4%BB%A3%E8%B4%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40168/%E4%BB%A3%E8%B4%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$( function() {
    alert("请加入购物车后,到收银台结账")
    history.go(-1)
} )