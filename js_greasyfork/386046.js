// ==UserScript==
// @name         Shanbay display
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://web.shanbay.com/wordsweb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386046/Shanbay%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/386046/Shanbay%20display.meta.js
// ==/UserScript==

// 在小结界面隐藏结果，按enter显示
(function () {
    'use strict';

    // 得到总结页的中文解释并切换显示
    var toggleTable = function () {
        var item = document.querySelectorAll('td.StudySummaryItem_content__3j9YG');

        for (let i = 0; i < item.length; i++) {
            if(item[i].style.display === "none"){
                item[i].style.display = "block";
            } else {
                item[i].style.display = "none";
            }

        }
    };




    // get the list of wrong item and repeatly pronounce it;
    var i = 0;
    var pronounce = function(){
        var wrongItems = document.querySelectorAll('.wrong');
        if (wrongItems.length != 0){
            if(i>=wrongItems.length ){
                i=0;
            }
            wrongItems[i].querySelector('img').click();
            i=i+1;
        }

        // 为了单手操作, 复写p快捷键，单词背诵页的朗读
        var voice = document.querySelectorAll('.index_audio__2-vMp')
        if (voice.length !=0){
            voice[1].querySelector('img').click()
        }
        // 单词详情页的朗读，且不影响table页
        var voice2= document.querySelectorAll('.VocabPronounce_mlr10__3TCZu')
        if (voice2.length !=0){
            voice2[1].querySelector('img').click()
        }

    }

    // 复写9快捷键
    var delete9 = function(){
        var deletei = document.querySelectorAll('.index_simpleOption__2_XNF')
        deletei[0].click()
    }

    // 得到例句， 并循环发音
    var j = 0 ;
    var pronounceExam = function(){
        var examItems = document.querySelectorAll('.BayTrans_example__1kVZI');
        if (examItems.length != 0){
            // 防止刚进入时j过大，导致越界
            if(j>=examItems.length){
                j = 0;
            }
            examItems[j].querySelector('img').click();
            j=j+1;
        }
    }

    //添加键盘事件
    document.body.addEventListener('keydown',event => {
        switch (event.key){
            case 'Enter':
                toggleTable();
                // toggiecndf();
                break;
            case 'p':
                // pronounce the word in summary table
                pronounce();
                break;
            case 'r':
                // pronounce the word in summary table.
                pronounce();
                break;
            case 'e':
                // pronunce the example.
                pronounceExam();
                break;
            case '5':
                //delete
                delete9();
                break;
        }
    }
    )
    //当DOM树改变时触发，适合处理异步网页
    // 隐藏中文总结
    document.body.addEventListener("DOMSubtreeModified",function(){
        // var cndf = document.querySelector('.cndf>span');
        // if(cndf){
        // cndf.style.display = "none";
        // }
        var item = document.querySelectorAll('td.StudySummaryItem_content__3j9YG');
        for (let i = 0; i < item.length; i++) {
            item[i].style.display = "none";
        }
    },false)

})();