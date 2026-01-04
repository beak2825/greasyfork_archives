// ==UserScript==
// @name         My Free MP3+ 批量下载歌曲自动全选功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  http://tool.liumingye.cn/music/
// @author       aidian
// @match        *://tool.liumingye.cn/music/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420675/My%20Free%20MP3%2B%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%AD%8C%E6%9B%B2%E8%87%AA%E5%8A%A8%E5%85%A8%E9%80%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/420675/My%20Free%20MP3%2B%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%AD%8C%E6%9B%B2%E8%87%AA%E5%8A%A8%E5%85%A8%E9%80%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addButton() {
        $('body').append('<div id="copyToCS">双击进行全选</div>')
        $('#copyToCS').css('width', '150px')
        $('#copyToCS').css('position', 'absolute')
        $('#copyToCS').css('top', '70px')
        $('#copyToCS').css('left', '100px')
        $('#copyToCS').css('background-color', 'purple')
        $('#copyToCS').css('color', 'white')
        $('#copyToCS').css('font-size', 'large')
        $('#copyToCS').css('z-index', 100)
        $('#copyToCS').css('border-radius', '25px')
        $('#copyToCS').css('text-align', 'center')
        $('#copyToCS').dblclick(function () {
            
            var optionBtn1 = document.getElementsByClassName("btn-green TLH_batch");
            for(var q=0;q<optionBtn1.length;q++)
            {
                optionBtn1[q].click();
            }
            var optionBtn = document.getElementsByClassName("form-check-input");
            for(var i=0;i<optionBtn.length;i++)
            {
                optionBtn[i].click();
            }

        })


    }

    $(document).ready(function () {
        addButton()
    }
                     )
    
})();

