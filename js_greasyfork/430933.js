// ==UserScript==
// @name         网页修改器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  页面上方将出现一个“改变状态”的按钮，点击之后可以修改网页！
// @author       oier-denominator
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430933/%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/430933/%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = "<p><button onclick=\"var x = document.body.contentEditable; if (x == \'false\') { document.body.contentEditable = \'true\' } else { document.body.contentEditable = \'false\'}\">改变状态</button></p>"
    var b = document.getElementsByTagName ("body")[0].innerHTML
    b = s + b
    document.getElementsByTagName ("body")[0].innerHTML = b
})();