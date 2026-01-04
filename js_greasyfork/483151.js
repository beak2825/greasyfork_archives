// ==UserScript==
// @name         非特化妆品备案查询页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  take it easy
// @author       You
// @match        https://hzpba.nmpa.gov.cn/gccx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nmpa.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483151/%E9%9D%9E%E7%89%B9%E5%8C%96%E5%A6%86%E5%93%81%E5%A4%87%E6%A1%88%E6%9F%A5%E8%AF%A2%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/483151/%E9%9D%9E%E7%89%B9%E5%8C%96%E5%A6%86%E5%93%81%E5%A4%87%E6%A1%88%E6%9F%A5%E8%AF%A2%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    

    // Your code here...
    var d = document;
    var productName = d.querySelector('#prodName');
    var invCode = d.querySelector('#cont2');
    var queButton = d.querySelector('#searchInfo');
    var confButton = d.querySelector('#mb_btn_ok');
    var aView = d.querySelector('#planPreview');
    var bView = d.querySelector('#stgPreview');
    productName.tabIndex = 99;
    productName.focus();
    invCode.tabIndex = 100;

    document.onkeydown = function(e)
    {
        if(e.keyCode == '13')
        {
            queButton.click();
        }
    }

    if(document.location.href.indexOf('chakan')>0)
    {
        invCode.focus();
            document.onkeydown = function(e)
            {
                if(e.keyCode == '13')
                {
                    confButton.click();
                }
                else if(e.keyCode == '37')
                {
                    aView.click();
                }
                else if(e.keyCode == '39')
                {
                    bView.click();
                }

            }
    }

})();