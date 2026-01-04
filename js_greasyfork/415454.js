// ==UserScript==
// @name         净化页面
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  try to take over the world!
// @author       You
// @include    *://www.zhihu.com/*
// @include    *://bbs.hupu.com/*
// @include    *://mo.fish/*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415454/%E5%87%80%E5%8C%96%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/415454/%E5%87%80%E5%8C%96%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    try{
        var imgLink=document.querySelector('.ZhihuLogoLink');
        imgLink.style="display:none"
        var PageHeader=document.querySelector('.Sticky');
        PageHeader.style="display:none"
        var TopstoryPageHeader=document.querySelector('.GlobalSideBar.GlobalSideBar--old');
        TopstoryPageHeader.style="display:none"

        var sideColumn=document.querySelector('.Question-sideColumn.Question-sideColumn--sticky');
        sideColumn.style="display:none"
    }
    catch(err){
        console.log('hupu')
    }


    try{
        var mainc=document.querySelector('.main-c');
        mainc.style="display:none"}
    catch(err){
    console.log(err)
    }
    //删除原图标
    var list=document.querySelector('link[rel="shortcut icon"]');
    document.querySelector('head').removeChild(list)
    //插入到首位 方法
    Node.prototype.prependChild = function (newNode){
                 this.insertBefore(newNode,this.firstChild);
             }





    try{
        let timer = null;
        timer = setInterval(() => {
            var imgs = document.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                i
                imgs[i].src = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1690794885,369117853&fm=26&gp=0.jpg";
                imgs[i].srcset = "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1690794885,369117853&fm=26&gp=0.jpg";

            }



                const changeFavicon = link => {
                    let $favicon = document.querySelector('link[rel="icon"]');

                    // If a <link rel="icon"> element already exists,
                    // change its href to the given link.
                    if ($favicon !== null) {
                        $favicon.href = link;
                        // Otherwise, create a new element and append it to <head>.
                    } else {
                        $favicon = document.createElement("link");
                        $favicon.rel = "icon";
                        $favicon.href = link;
                        document.head.prependChild($favicon);
                    }
                };
                 let icon = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2919939864,1397061528&fm=11&gp=0.jpg'; // 图片地址
                 changeFavicon(icon); // 动态修改网站图标
                 let title = 'github/xuexi'; // 网站标题
                 document.title = title; // 动态修改网站标题




            if (imgs[imgs.length - 1].src.length < 1) {
                console.log('end')
                clearInterval(timer);
            }
        }, 2000);

    }

    catch(err){
        console.log("zhihu")
    }
})();

