// ==UserScript==
// @name         哔哩哔哩图片下载，也可以下载其他网址图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  图片下载
// @author       明
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446181/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%B9%9F%E5%8F%AF%E4%BB%A5%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E7%BD%91%E5%9D%80%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/446181/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%B9%9F%E5%8F%AF%E4%BB%A5%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E7%BD%91%E5%9D%80%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append('<link rel="stylesheet" href="http://code.jquery.com/jquery-latest.js">');
    $("body").append('<button style="position: fixed; top: 300px; width: 200px;height: 100px;background-color: pink;font-size: 22px;font-family: 楷体;" id="imgBtn">点击查看所有图片</button>');
    $("body").append('<div id="node" style="display: none;"></div>');
    $("#imgBtn").click(
        function(){
            var img=$("body img");
            for(var i=0;i<img.length;i++){
                var n=img.get(i).src;
                var tupian= document.createElement('img');
                tupian.src=n;
                $("#node").append(tupian);
                var br1=document.createElement('br');
                var br2=document.createElement('br');
                var br3=document.createElement('br');
                var br4=document.createElement('br');
                $("#node").append(br1);
                $("#node").append(br2);
                $("#node").append(br3);
                $("#node").append(br4);
            }
            var oDoc = document.getElementById("node");
            var sDefTxt = oDoc.innerHTML;
            var oPrntWin = window.open("","_blank","width=1000,height=600,left=10,top=10,menubar=yes,toolbar=no,location=no,scrollbars=yes");
            oPrntWin.document.open();
            oPrntWin.document.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><button style="width: 200px;height: 100px;background-color: pink;font-size: 22px;font-family: 楷体;" id="imgBtn">点击图片就可以下载图片</button><br><br><br>'+sDefTxt+'</body><script>var img=document.querySelectorAll("img");for(var i=0;i<img.length;i++){var src=img[i].src;attach(src,img[i]);}function attach(src,img){img.onclick=function(){var num=Math.floor(Math.random() * 1000);downloadIamge(src,num+".png");}}const downloadIamge = (imgsrc, name) => {let image = new Image();image.setAttribute("crossOrigin", "anonymous");image.src = imgsrc;image.onload = function () {let canvas = document.createElement("canvas");canvas.width = image.width;canvas.height = image.height;let context = canvas.getContext("2d");context.drawImage(image, 0, 0, image.width, image.height);let url = canvas.toDataURL("image/png"); let a = document.createElement("a"); let event = new MouseEvent("click");a.download = name || "photo"; a.href = url; a.dispatchEvent(event);}}</script></html>');
            oPrntWin.document.close();
        }
    )
})();