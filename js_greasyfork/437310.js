// ==UserScript==
// @name         Bangumi自定义伪春菜·改
// @namespace    dottorrent.custom-chuncai-for-bangumi
// @version      1.0.4
// @description  自定义伪春菜，比站内已有的版本加载快一点
// @author       .torrent
// @match        http*://bgm.tv/*
// @match        http*://bangumi.tv/*
// @match        http*://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437310/Bangumi%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BC%AA%E6%98%A5%E8%8F%9C%C2%B7%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/437310/Bangumi%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BC%AA%E6%98%A5%E8%8F%9C%C2%B7%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const set_chuncai_img = function() {
        let CustomChuncaiURL = prompt("请输入替换春菜的图片网址", "https://");
        if (CustomChuncaiURL != null && CustomChuncaiURL != "") {
            let Img = new Image(),
                dataURL='';
            Img.crossOrigin = "anonymous";
            Img.src=CustomChuncaiURL;
            document.querySelector("#setCustomChuncai").innerText="下载中..."
            Img.onload=function(){
                const canvas = document.createElement('canvas'),
                    width=Img.width,
                    height=Img.height;
                canvas.width=width;
                canvas.height=height;
                canvas.getContext('2d').drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                dataURL=canvas.toDataURL(); //转换图片为dataURL
                localStorage.setItem("CustomChuncaiURL", CustomChuncaiURL);
                localStorage.setItem("CustomChuncaiDataURL", dataURL);
                document.querySelector("#setCustomChuncai").innerText="替换成功！"
                setTimeout(()=>{
                    document.querySelector("#setCustomChuncai").innerText="替换春菜"
                },2000)
                change_chuncai_img();
            };
        }
    }
    const change_chuncai_img = function(){
        let CustomChuncaiURL = localStorage.getItem("CustomChuncaiURL");
        let CustomChuncaiDataURL = localStorage.getItem("CustomChuncaiDataURL");
        let Shell = document.querySelectorAll("#ukagaka_shell div")[0];
        if(CustomChuncaiDataURL){
            Shell.style.setProperty('background', `url("${CustomChuncaiDataURL}") no-repeat top right`, 'important');
        }
        else if (CustomChuncaiURL) {
            Shell.style.setProperty('background', `url("${CustomChuncaiURL}") no-repeat top right`, 'important');
        }
    }
    document.querySelector("#ukagaka_menu").addEventListener("click", function(event) {
        let li = document.createElement("li");
        let a_nav = document.createElement("a");
        a_nav.id='setCustomChuncai'
        a_nav.classname='nav'
        a_nav.href='javascript:void(0);'
        a_nav.innerText='替换春菜'
        li.innerText='◆ '
        li.appendChild(a_nav)
        document.querySelector(".speech ul li:nth-child(4)").before(li);
        a_nav.addEventListener("click", set_chuncai_img)
    });
    change_chuncai_img();
})();