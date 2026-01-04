// ==UserScript==
// @name         CSDN复制优化(自用)
// @version      0.1
// @description  取消CSDN登录需要登录才能复制的功能
// @author       violent
// @match        *.csdn.*,*
// @icon         https://www.google.com/s2/favicons?domain=juejin.cn
// @grant        none
// @namespace https://greasyfork.org/users/882015
// @downloadURL https://update.greasyfork.org/scripts/440801/CSDN%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440801/CSDN%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let docParent=document.getElementsByTagName("pre");
    let docCode=document.getElementsByTagName("code");
    let loginWord=document.getElementsByClassName('passport-login-container');

    clearSelect(docParent)
    clearSelect(docCode);
    try{
        loginWord[0].style['display']='none'
    } catch(e){}
    function clearSelect(_domList){
        for(var i=0;i<_domList.length;i++){
            _domList[i].style['-webkit-touch-callout']='auto';
            _domList[i].style['-webkit-user-select']='auto';
            _domList[i].style['-khtml-user-select']='auto';
            _domList[i].style['-moz-user-select']='auto';
            _domList[i].style['-ms-user-select']='auto';
            _domList[i].style['user-select']='auto';
        }
    }
})();