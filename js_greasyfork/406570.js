// ==UserScript==
// @name         AutoFill for Lanhu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用，自动填充蓝湖验证码
// @author       Amar0K
// @match        https://lanhuapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406570/AutoFill%20for%20Lanhu.user.js
// @updateURL https://update.greasyfork.org/scripts/406570/AutoFill%20for%20Lanhu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.addEventListener('load', function () {
        var params = getUrlPara()
        var paramsArr = params.split('&')

        const CODE_OBJ = {
            'pid=ed4a53de-7cf1-4ebc-84f0-305af21505d4': function () {
                return '4tD7'
            }
        }
        var code = CODE_OBJ[paramsArr[0]]()

        var inputBoxArr = document.getElementsByClassName('clearfix')
        var input = inputBoxArr[0].getElementsByTagName('input')
        input[0].value = code

        var btnArr = document.getElementsByClassName('ok btn')
        btnArr[0].click()
    }, false);

    function getUrlPara() {
        var url = document.location.toString();
        var arrUrl = url.split("?");

        var para = arrUrl[1];
        return para;
    }

})();