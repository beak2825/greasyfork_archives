// ==UserScript==
// @name         pixiv图片自动下载&快捷键换页
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  按右键下载cat上打开的图片，通过左右箭头、pageUp和pageDown、数字键来控制翻页
// @author       Pikaqian
// @match        https://pixiv.cat/*
// @icon         https://pixiv.cat/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427226/pixiv%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%8D%A2%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/427226/pixiv%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%8D%A2%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('keydown',function(event){
        var url=window.location.href
        if(url.match("-")!=null){
            var first=url.split("-")[0]
            var num=url.split("-")[1].match(/\d{1,3}/)[0]
            if(event.keyCode=="39"){
                window.open(first+"-"+((parseInt(num)+1)+".png"),"_self")
            }
            else if(event.keyCode=="37"){
                window.open(first+"-"+((parseInt(num)-1)+".png"),"_self")
            }
            else if(event.keyCode=="34"){
                window.open(first+"-"+((parseInt(num)+10)+".png"),"_self")
            }
            else if(event.keyCode=="33"){
                window.open(first+"-"+((parseInt(num)-10)+".png"),"_self")
            }
            else if(event.keyCode>="49"&&event.keyCode<="57"){
                var press=event.keyCode-48
                if(event.altKey!=true){
                    window.open(first+"-"+((parseInt(num)+press)+".png"),"_self")
                }
                else{
                    window.open(first+"-"+((parseInt(num)-press)+".png"),"_self")}
            }
        }
    })
    window.addEventListener('contextmenu',function (event){
        if(event.ctrlKey!=true){
            var a = document.createElement('a');
            var url=window.location.href
            a.href = url;
            a.download = url;
            a.click();
            window.URL.revokeObjectURL(url);
            event.preventDefault()
        }
    })
})();