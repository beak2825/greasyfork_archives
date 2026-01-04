// ==UserScript==
// @name         hjcINSzs
// @namespace    https://haojiacheng.cn/
// @version      0.2
// @description  66666666666666666
// @author       SuYi79
// @license      End-User License Agreement
// @match        *://*.Instagram.com/*
// @icon         https://www.haojiacheng.cn/pic/upload/2022/07/16/1f8a3670-ea48-48c2-a301-b2a7d18f0e46.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468038/hjcINSzs.user.js
// @updateURL https://update.greasyfork.org/scripts/468038/hjcINSzs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    



    window.onload=function(){

        // 获取按钮元素

        var num = 0;
        var srcArr = [];
        var btn2={};
        var mybtn=undefined;

        //setTimeout(function(){
        btn2= document.getElementsByClassName("_afxw _al46 _al47")[0];
        //添加悬浮按钮
        var cj=document.createTextNode("点我 下载 图片");
        var jiacheng=document.createElement("button");
        jiacheng.id="mybtn";
        jiacheng.style="font: 12px/1.5 微软雅黑, 黑体, Arial, Helvetica, sans-serif;-webkit-font-smoothing: antialiased;padding: 0;outline: none;width: 180px;height: 32px;line-height: 32px;margin: 20px;background: #FFFFFF;border: solid #3A8BFF 1px;font-size: 14px;float: left;border-radius: 5px;text-align: center;cursor: pointer;background-color: #71e871;border-color: #3A8BFF;color: rgb(224 20 20);";
        jiacheng.appendChild(cj);
        document.getElementsByClassName("x6s0dn4 xrvj5dj x1o61qjw")[0].appendChild(jiacheng);
        mybtn= document.getElementById("mybtn");
        //},2000);

        btn2.addEventListener('click', function(event) {
            if(num%2==0){
                // 获取所有包含图片的父元素
                var parentNodes = document.querySelectorAll('ul img');

                // 遍历父元素，获取包含图片的子元素img标签并输出
                for (var i = 0; i < parentNodes.length; i++) {
                    var parentNode = parentNodes[i].parentNode;
                    if (parentNode.tagName === 'DIV') {
                        var src = parentNodes[i].getAttribute('src');
                        if (!srcArr.includes(src)) {
                            srcArr.push(src);
                            console.log(src);
                        }
                    }
                }
            }
            num++;
        });


        mybtn.addEventListener('click',function(){
            if(srcArr.length!=0){
                srcArr.forEach((url, index) => {
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                        const urlObj = window.URL || window.webkitURL;
                        const imageUrl = urlObj.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = imageUrl;
                        link.download = `image_${index}`;
                        link.click();
                    });
                });
            }
        })
        };

    
 
})();

