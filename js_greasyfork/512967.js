// ==UserScript==
// @name         微信公众号图集一键展示
// @namespace    http://tampermonkey.net/
// @version      20251203
// @description  让世界更美好！
// @author       sbdx
// @license      GPLv3
// @match        https://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/s?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weixin.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512967/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E9%9B%86%E4%B8%80%E9%94%AE%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/512967/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E9%9B%86%E4%B8%80%E9%94%AE%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //图集页面的修改
    function showAlbum()
    {
        console.log("开始打开图集事件......");
        var html="";
        window.picture_page_info_list.forEach((i)=>{
            let url=i.cdn_url.replace("/640?","/0?");
            html+=`<img src="${url}" /><br>`;
        });
        document.getElementById('js_article').innerHTML=(html);
    }
    //普通页面图片替换为高清图片
    function replaceHighQualityImage()
    {
        let img=document.querySelector(".rich_media_content").getElementsByTagName("img");
        img.forEach((i)=>{
            let url=i.src.replaceAll("/640?","/0?").replaceAll("tp=webp","tp=jpeg");
            console.log(url);
            i.dataset.src=url;
            i.src=url;
            window.scrollTo(0, document.body.scrollHeight);
            window.scrollTo(0, 0);
        });
    }
    //优化图片布局显示
    function formatDisplayImage()
    {
        let html='';
        let svg_imgs=document.querySelectorAll("[data-lazy-bgimg]");
        svg_imgs.forEach((i)=>html+=`<img src="`+i.getAttribute('data-lazy-bgimg')+`" /><br></br>`);
        let imgs=document.getElementById('js_content').getElementsByTagName("img");
        imgs.forEach((i)=>console.log(html+=`<img src="${i.dataset.src}" /><br></br>`));
        html=html.replaceAll("/640?","/0?").replaceAll("tp=webp","tp=jpeg");
        document.getElementById("js_content").innerHTML=html;
    }
    if(document.getElementById('img_swiper_placeholder'))
    {
        let btn=document.createElement("button");
        btn.style.fontSize="12px";
        btn.style.widht="80px";
        btn.style.height="20px";
        btn.innerText="打开图集";
        btn.addEventListener('click',function(){
            showAlbum();
            document.getElementById("js_article").style.display='block';
            document.getElementById("js_article").style.height='inherit';
            document.getElementById("js_article").style.maxHeight='none';
            document.getElementById("js_article").style.overflow='scroll';
            this.disabled=true;
        });
        if(document.querySelector(".rich_media_title"))
        {
            document.querySelector(".rich_media_title").append(btn);
        }
        else if(document.getElementById("js_article_content"))
        {
            document.getElementById("js_article_content").append(btn);
        }
        else
        {
            console.log('没找到能挂载btn的对象');
        }
        console.log("确认过眼神，是对的人！");
    }
    else if(document.getElementById('js_content'))
    {
        let btn=document.createElement("button");
        btn.innerText="切换高清图";
        btn.style.fontSize="12px";
        btn.style.widht="80px";
        btn.style.height="20px";
        btn.addEventListener('click',function(){
            replaceHighQualityImage();
            document.getElementById("js_article").style.display='block';
            document.getElementById("js_article").style.height='inherit';
            document.getElementById("js_article").style.maxHeight='none';
            document.getElementById("js_article").style.overflow='scroll';
            this.disabled=true;
        });
        let btn2=document.createElement("button");
        btn2.innerText="优化布局显示";
        btn2.style.fontSize="12px";
        btn2.style.widht="80px";
        btn2.style.height="20px";
        btn2.addEventListener('click',function(){
            formatDisplayImage();
            this.disabled=true;
        });
        document.querySelector(".rich_media_meta_list").append(btn);
        document.querySelector(".rich_media_meta_list").append("&nbsp;");
        document.querySelector(".rich_media_meta_list").append(btn2);
    }
    console.log("还想咋地？");
})();