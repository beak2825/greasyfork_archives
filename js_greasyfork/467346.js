// ==UserScript==
// @name         正太教务系统自动选A
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  它可以自动选中A 
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467346/%E6%AD%A3%E5%A4%AA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E9%80%89A.user.js
// @updateURL https://update.greasyfork.org/scripts/467346/%E6%AD%A3%E5%A4%AA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E9%80%89A.meta.js
// ==/UserScript==

(function() {
    // 选中所有select 元素 值设置为A
    var selects = document.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++) {
        selects[i].value = 'A';
        // 延时0.15秒
    }
    // 等待4秒 点击保存
    setTimeout(function() {
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value == '保  存') {
                inputs[i].click();
            }
        }
    }, 4000);
})();