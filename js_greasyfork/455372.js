// ==UserScript==
// @name         微博图片链接获取
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  获取微博的原图链接，并生成 Hexo 博客 markdown 格式链接，粘贴即可直接使用。
// @author       wwwwxxxg
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @match        *://weibo.com/*
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/455372/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/455372/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //等待元素加载完成在执行
    window.onload = function(){
        //通过 id 获取图片对象
        let picture1 = document.querySelectorAll('img.picture_focusImg_1z5In');
        let picture2 = document.querySelectorAll('img.woo-picture-img');

        //全部图片对象
        let allmg = document.querySelectorAll('img');

        //计数器
        let item = 0

        //获取时间
        let nowtiome = getNowTimeFull()

        //前缀内容
        let index = `
---
title:
date:`+nowtiome+`
typora-root-url: ..
tag:
categories: 艺术赏析

# 文章在首页的封面图
index_img:

# 文章页顶部大图
banner_img:
---



`;


        let pa = '';
        let pb = '';

        console.log("本页面全部图—— :  ");
        console.log(allmg);


        pa = pp(picture1);
        console.log("ID 为 picture_focusImg_1z5In ：\n" + pa);

        pb = pp(picture2)
        console.log("ID 为 woo-picture-img ：\n" + pb);



        console.log(index+pa+pb);


        function pp(p) {
            // console.log(p[1].match(/class=".*"/g))
            let p1 ="";

            if(p != null){
                for(var i=0;i<p.length;i++) {

                    p1 +='!['+item+']('+ p[i].currentSrc.replace('/orj360/','/mw2000/')+')\n';

                    item++
                };
               return p1;
            }
        }


        // 获取当前日期时间
        function getNowTimeFull(){
            var myDate=new Date;
            var year=myDate.getFullYear(); //获取当前年
            var mon=myDate.getMonth()+1<10?"0"+(myDate.getMonth()+1):myDate.getMonth()+1; //获取当前月
            var date=myDate.getDate()<10?"0"+myDate.getDate():myDate.getDate(); //获取当前日
            var hour=myDate.getHours()<10?"0"+myDate.getHours():myDate.getHours();//获取当前时
            var minute=myDate.getMinutes()<10?"0"+myDate.getMinutes():myDate.getMinutes();//获取当前分
            return year+"-"+mon+"-"+date+" "+hour+":"+minute;
        }
    };

})();