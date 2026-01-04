// ==UserScript==
// @name         图片采集下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  当前页面的图片一键下载（必须等网页加载完成之后）
// @author       You
// @match        http://*/*
// @match        https://*/*
// @User-Agent   Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428082/%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428082/%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement('button')
    button.innerText= '采集'
    button.style.backgroundColor= 'red'
    button.style.color = '#ffffff'
    button.style.fontWeight = 'bold'
    button.style.position = 'fixed'
    button.style.padding = '10px 16px'
    button.style.top = '0'
    button.style.right = '0'
    button.style.zIndex = '99999999'
    button.style.borderRadius = '4px'
    button.style.border = "2px solid red"
    
    button.style.opacity = "1"
    document.body.appendChild(button)
    button.onclick =  function(){
        
           imgdown(downFile)
           

        }

           

function downFile(imgsrc, name) { //下载图片地址和图片名
   
    let image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        
        a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
}

function imgdown(callback) {
    Array.from(document.images).forEach((element, i) => {
        callback("https://images.weserv.nl/?url="+element.currentSrc, i)
    });

}


   
})();