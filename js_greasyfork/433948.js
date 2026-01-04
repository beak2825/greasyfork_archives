// ==UserScript==
// @name         jex.im - regulex 中文字符替换
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  jex.im - regulex 的可视化工具不支持中文显示，使用该脚本后可以支持中文显示。
// @author       You
// @match        https://jex.im/regulex/
// @icon         https://www.google.com/s2/favicons?domain=jex.im
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433948/jexim%20-%20regulex%20%E4%B8%AD%E6%96%87%E5%AD%97%E7%AC%A6%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/433948/jexim%20-%20regulex%20%E4%B8%AD%E6%96%87%E5%AD%97%E7%AC%A6%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replace() {
        Array.from(document.querySelectorAll('tspan')).forEach($e => {
            var result = $e.innerHTML
            var newResult = result
            for(;;) {
                var re = /\\u[0-9A-Z]+/.exec(newResult)
                if(re) {
                    var i = re.index
                    var str = re[0]
                    var newStr = eval(`'${str}'`)
                    var tmpResult = newResult.split('')
                    tmpResult.splice(i, str.length, newStr)
                    newResult = tmpResult.join('')
                } else {
                    break
                }
            }
            if(newResult != result) {
                $e.innerHTML = newResult
            }
        })
        setTimeout(replace, 100)
    }
    replace()
})();