// ==UserScript==
// @name         报废车填充外挂脚本
// @namespace    http://www.esclt.net/
// @version      1.2
// @description  实现对商务部业务系统统一平台报废车的申报自动填充
// @author       ehoole@qq.com
// @include      http*://*.mofcom.gov.cn/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390382/%E6%8A%A5%E5%BA%9F%E8%BD%A6%E5%A1%AB%E5%85%85%E5%A4%96%E6%8C%82%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/390382/%E6%8A%A5%E5%BA%9F%E8%BD%A6%E5%A1%AB%E5%85%85%E5%A4%96%E6%8C%82%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var iIntervalID = window.setInterval(myFunction,1000);
    var bfwgversion = "1.2";
    function myFunction(){
        if(document.getElementsByClassName('wel-ope').length!=0){
            document.getElementsByClassName('wel-ope')[0].innerHTML='<span style="font-size:20px;color:red;" onclick="$(this).fadeOut(\'slow\').fadeIn(\'slow\')">点我后按Ctrl+V</span>';
            document.getElementsByClassName('wel-ope')[0].addEventListener('paste',function(evt){
                    var tp = evt.clipboardData.getData('text');
                    var jsall = tp.replace(/[\r\n]/g,'');
                    window.eval(jsall);
                });
            window.clearInterval(iIntervalID);
        }
    }
})();