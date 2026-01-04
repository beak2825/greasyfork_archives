
// ==UserScript==
// @name         湖南开放大学学习助手
// @namespace    http://sydwperson.hnsydwpx.cn/
// @version      0.1
// @description  无
// @author       囧哥
// @match        http://sydwperson.hnsydwpx.cn/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/436292/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436292/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function main() {
        try {
            //培训课程
            var menu = "/pageclasscourse/getClassCourse?MENU=bjyd&secondMENU=bjkc";
            var done,list,i;
            if (window.location.href.includes(menu)) {
                done = true;
                list = document.querySelectorAll('.ck_btn');
                for (i = 0; i < list.length; i++) {
                    if (list[i].innerText != '已学完') {
                        done = false;
                        window.location.href = list[i+1].href;
                        break;
                    }
                    i++;
                }
                //点击下一页
                if (done) document.querySelectorAll('div.page a')[2].click();
            }
    
            //课程详情
            var url1 = "/mycourse/kcxx";
            if (window.location.href.includes(url1)) {
                done = true;
                list = document.querySelectorAll('a.tovideo');
                for (i = 0; i < list.length; i++) {
                    if (!list[i].innerText.includes('100%')) {
                        done = false;
                        list[i].click();
                        break;
                    }
                }
                //返回
                if (done) window.location.href = menu;
            }
    
            //播放页
            var url2 = "/mycourse/ckPlayer";
            if (window.location.href.includes(url2)) {
                //list = document.querySelectorAll('#list li a');
                var active = document.querySelectorAll('#list li a.active')[0];
                //if (list[list.length-1] == active && active.innerText.includes('100%')) window.location.href = menu;
                if (active.innerText.includes('100%')) window.location.href = menu;
            }
            
        }catch(err) {console.log(err);}
        
    } ,5000);

})();