// ==UserScript==
// @name         自动选中并提交对应的issueCode, autoSubmitError
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       zhanghao
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421422/%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%AF%B9%E5%BA%94%E7%9A%84issueCode%2C%20autoSubmitError.user.js
// @updateURL https://update.greasyfork.org/scripts/421422/%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%AF%B9%E5%BA%94%E7%9A%84issueCode%2C%20autoSubmitError.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.autoSubmitError = function(code) {
        var tbody = document.getElementsByTagName('tbody')[0]
        var trs = tbody.getElementsByTagName('tr')

        for (var i = 1; i < trs.length; i++) {
          
                if (trs[i].children[7].innerText.indexOf(code) !== -1) {
                    trs[i].children[0].children[0].checked = true
                } else {
trs[i].style.display = 'none'
                }

        }
        var d =[];
        [].find.call(trs,function(i){if (i.style.display !== 'none') {d.push(i)}});
        d.map(function(i) {i.children[0].children[0].checked = true});
        if(window.batch){
            window.batch()

        }
        console.log('使用autoSubmitError(关键字)')

    }

    // Your code here...
})();