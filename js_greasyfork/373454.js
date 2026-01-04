// ==UserScript==
// @name         faxuan_course 增加提示版
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  auto complete faxuan course
// @author       fangzister/yofx
// @match        http://xf.faxuan.net/sps/courseware/t/courseware_1_t.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373454/faxuan_course%20%E5%A2%9E%E5%8A%A0%E6%8F%90%E7%A4%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/373454/faxuan_course%20%E5%A2%9E%E5%8A%A0%E6%8F%90%E7%A4%BA%E7%89%88.meta.js
// ==/UserScript==
//给大佬的脚本加个说明,简单加了个引导提示
//必须是进到第二级的学习页面才可以，具体为，课件目录--具体章节（第几章节）--点击继续学习 新跳转的那个目录才可以运行脚本
//然后点击一次 退出学习，脚本开始运行~
//填加了一个开始运行的提示。。
(function() {
    'use strict';
    function message1(){
        alert("脚本已执行,但当前页面错误！请点击继续学习！课件详情页面刷新网页！");
    };

    function message2(){
        alert("已激活功能");
    };
    var Title
    Title= document.title;//网页标题

    switch(Title){
        case("课程"):
            message1();
            break;
        case("课件详情"):
            window.addEventListener('load',function(){
                //添加时间监听
                message2();
                var a = document.getElementById('exitCourse');
                console.log(a);
                a.href = 'javascript:;';

                a.onclick = function(){
                    clearTimeout(sps.onlineTimeTask);
                    message2();
                    let m = parseInt(Math.random() * 10) + 10;
                    let s = parseInt(Math.random() * 10) + 10;
                    let t = '00:' + m + ':' + s;
                    let u = document.getElementById('ware_time_num');
                    u.innerHTML = t;
                    this.onclick = function(){
                        sps.exitSt('ware_time_num');
                    };
                };
                var yy = setTimeout(function(){sps.prompthide('prompt2');clearTimeout(yy);},300);
            });
            break;


    };


})();