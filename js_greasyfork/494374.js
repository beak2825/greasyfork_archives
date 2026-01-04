// ==UserScript==
// @name         武汉工程科技学院教务系统教学评价脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  半自动教学评价脚本，适用于武汉工程科技学院强智教务系统
// @author       isdengfuyu
// @license      https://spdx.org/licenses/MIT.html
// @match        *://*/whgckjxy_jsxsd/xspj/xspj_edit.do*
// @downloadURL https://update.greasyfork.org/scripts/494374/%E6%AD%A6%E6%B1%89%E5%B7%A5%E7%A8%8B%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494374/%E6%AD%A6%E6%B1%89%E5%B7%A5%E7%A8%8B%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    for (let e of document.querySelectorAll("td input")){
        if (e.id.slice(-1)==="1"){
            e.checked = true;
        }
    }
    //这里是你的意见或建议设置
    document.querySelector('#jynr').textContent = "很好，非常好";
    let submit = document.querySelector('#tj').click();
})();