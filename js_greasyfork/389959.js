// ==UserScript==
// @name        满洲里市专业技术人员继续教育在线学习平台
// @namespace    https://greasyfork.org
// @version      0.1
// @description  自动下一课
// @author       yiming
// @match        *://*.zgrsw.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389959/%E6%BB%A1%E6%B4%B2%E9%87%8C%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/389959/%E6%BB%A1%E6%B4%B2%E9%87%8C%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

function clickbutton() {
  var buttonone = document.getElementsByClassName("layui-layer-btn0")
  var i;
    for (i = 0; i < buttonone.length; i++) {
        buttonone[i].click();
    }
}
setInterval(clickbutton, 10000);