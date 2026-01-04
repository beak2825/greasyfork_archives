// ==UserScript==
// @name         sex169论坛广告去除 （sex 169 ads remove function）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  used for http://bbs.sex169.org/
// @author       You
// @match        http://*/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463897/sex169%E8%AE%BA%E5%9D%9B%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%20%EF%BC%88sex%20169%20ads%20remove%20function%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463897/sex169%E8%AE%BA%E5%9D%9B%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%20%EF%BC%88sex%20169%20ads%20remove%20function%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let rmList = ['fastlg cl','wp a2_h','a_2mu','a_pb'];
    let rmIDList = ['hd', 'toptb'];

    rmIDList.forEach(rmFunction2);
    rmList.forEach(rmFunction);

    if(document.getElementsByClassName('plc').length > 0){
        let plcNode = document.getElementsByClassName('plc')[1];
    plcNode.parentNode.removeChild(plcNode);
    }
    let stickthreadIds = [];
    if(document.querySelectorAll('[id^=stickthread]').length > 0){
        document.querySelectorAll('[id^=stickthread]').forEach(rmFunction3)
    }
    if(stickthreadIds.length > 0){
        //console.log(stickthreadIds);
        stickthreadIds.forEach(rmFunction2);
    }

    function rmFunction(item, index) {
        if(document.getElementsByClassName(item).length > 0){
            document.getElementsByClassName(item)[0].parentNode.removeChild(document.getElementsByClassName(item)[0]);
        }
    }

    function rmFunction2(item, index) {
        if(document.getElementById(item)!=null){
            document.getElementById(item).parentNode.removeChild(document.getElementById(item));
        }
    }

    function rmFunction3(item, index) {
        stickthreadIds.push(document.querySelectorAll('[id^=stickthread]')[index].id);
    }
    // Your code here...
})();