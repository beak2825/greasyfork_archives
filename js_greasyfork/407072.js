// ==UserScript==
// @name               去除金山文档提示绑定手机窗口
// @namespace          https://www.kdocs.cn/
// @version            0.0.2.20200804
// @description        每次打开金山文档的页面都提示你绑定手机，好烦啊
// @author             EAK8T6Z
// @match              *://*.kdocs.cn/*
// @icon               https://qn.cache.wpscdn.cn/kdocs/img/logo.9291cf46.svg
// @run-at             document-start
// @license            WTFPL
// @downloadURL https://update.greasyfork.org/scripts/407072/%E5%8E%BB%E9%99%A4%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%8F%90%E7%A4%BA%E7%BB%91%E5%AE%9A%E6%89%8B%E6%9C%BA%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/407072/%E5%8E%BB%E9%99%A4%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%8F%90%E7%A4%BA%E7%BB%91%E5%AE%9A%E6%89%8B%E6%9C%BA%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

document.addEventListener('load', function (event) {

    if(document.getElementsByClassName("el-dialog__wrapper yun__dialog").length>0){document.getElementsByClassName("el-dialog__wrapper yun__dialog")[0].remove()}
    if(document.getElementsByClassName("v-modal").length>0){document.getElementsByClassName("v-modal")[0].remove()}


},true);


