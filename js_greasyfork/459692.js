// ==UserScript==
// @name         新东方词库单词字体放大
// @namespace    http://tampermonkey.net/
// @version      0.3.9
// @description  https://www.koolearn.com/单词字体放大
// @author       You
// @match        https://www.koolearn.com/dict/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=koolearn.com
// @grant        none
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/459692/%E6%96%B0%E4%B8%9C%E6%96%B9%E8%AF%8D%E5%BA%93%E5%8D%95%E8%AF%8D%E5%AD%97%E4%BD%93%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/459692/%E6%96%B0%E4%B8%9C%E6%96%B9%E8%AF%8D%E5%BA%93%E5%8D%95%E8%AF%8D%E5%AD%97%E4%BD%93%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    // 当前设备是移动设备
    //if (window.screen.width < 500) {
    if (typeof window.orientation !== 'undefined') {
        //alert(window.location.pathname.includes('wd'))
        if (window.location.pathname.includes('tag')){
            //单词页
            //侧边栏
            document.querySelector(".left-content").style.width = "90vw"
            //document.querySelector(".left-content").style.padding = "10px"

            document.querySelector(".right-content").style.display='none'

            //单词列表放大
            for (const element of document.querySelector(".word-box").querySelectorAll('.word')) {
                element.style.fontSize = "60px"
                element.style.padding = "10px"
                element.style.margin = "30px 15px"
            }
        }
        if (window.location.pathname.includes('wd')){
            //详情页
            //单词详情
            //广告
            document.querySelector(".content-box iframe").style.display='none'
            //音标
            for (const elementelement of document.querySelectorAll(".word-spell")) {
                elementelement.style.fontSize = "40px"
                elementelement.style.lineHeight = "60px"
                elementelement.style.margin = "20px  0"

            }
            //声音
            for (const elementelement of document.querySelectorAll(".word-spell-audio")) {
                elementelement.style.height = "70px"
                elementelement.style.width = "200px"
                elementelement.style.margin = "0 20px"
                elementelement.style.borderRadius = '5px'
                elementelement.style.backgroundColor = '#ffffff'
            }
            //翻译
            //document.querySelectorAll(".details-content-title-box p").style.fontSize = "50px"
            // document.querySelectorAll(".details-content-title-box p").style.lineHeight = "70px"
            for (const elementelement of document.querySelectorAll(".details-content-title-box p")) {
                elementelement.style.fontSize = "50px"
                elementelement.style.lineHeight = "70px"
            }
            //例句
            var boxdivol = document.querySelectorAll(".details-content-title-box div ol")
            for (const element of boxdivol) {
                for (const elementelement of element.querySelectorAll("li")) {
                    elementelement.style.fontSize = "50px"
                    elementelement.style.lineHeight = "70px"
                    elementelement.style.margin = "40px 0"
                }
            }
            //详情单词
            var wd = document.querySelector(".content-wrap").querySelector(".left-content").querySelector(".word-title").querySelector(".word-spell").style
            wd.fontSize = "100px"
            wd.lineHeight = "120px"
            wd.margin = "20px"

            //侧边同义词

            for (const element of document.querySelector(".retrieve").querySelectorAll(".word-box")) {
                for (const elementelement of element.querySelectorAll("a")) {
                    elementelement.style.fontSize = "20px"
                    elementelement.style.lineHeight = "30px"
                    elementelement.style.padding = "0px 20px"

                    elementelement.style.margin = "10px 0"
                }
            }
        }
        //侧边栏广告
        document.querySelector(".retrieve >  a").style.display='none'






    }

    //$("#left-content").$("*").css({ "cssText": "font-size:250px !important" });
    //打印
    //console.log($("#left-content"))

})();