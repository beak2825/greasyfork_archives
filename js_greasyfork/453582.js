// ==UserScript==
// @name        Pagenote_通过文件夹交换数据_自动点击“开始同步”按钮
// @namespace   Pagenote
// @version     1
// @description Pagenote_通过文件夹交换数据_自动点击“开始同步”按钮，从而同步Pagenote文件夹
// @author      Li Yimin
// @include     https://dev.pagenote.cn/data/files
// @grant       none
// @license Li Yimin
// @downloadURL https://update.greasyfork.org/scripts/453582/Pagenote_%E9%80%9A%E8%BF%87%E6%96%87%E4%BB%B6%E5%A4%B9%E4%BA%A4%E6%8D%A2%E6%95%B0%E6%8D%AE_%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BC%80%E5%A7%8B%E5%90%8C%E6%AD%A5%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/453582/Pagenote_%E9%80%9A%E8%BF%87%E6%96%87%E4%BB%B6%E5%A4%B9%E4%BA%A4%E6%8D%A2%E6%95%B0%E6%8D%AE_%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BC%80%E5%A7%8B%E5%90%8C%E6%AD%A5%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

function clickbutton() {
  var buttonone = document.getElementsByClassName("v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default")
  var i;
    for (i = 0; i < buttonone.length; i++) {
        buttonone[i].click();
    }
}
setInterval(clickbutton, 60000);