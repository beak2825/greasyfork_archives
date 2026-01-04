// ==UserScript==
// @name         下载图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调用函数下载图片 自定义文件名前缀
// @author       You
// @match        *://*/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462201/%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/462201/%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
      // 下载图片
  /*
   * imgsrc  图片地址
   * name 图片下载后的名字【包含图片后缀】 如"a.jpg"
   */
  function  downloadIamge(imgsrc, name) {
    //下载图片地址和图片名
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);
      var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

      var a = document.createElement("a"); // 生成一个a元素
      var event = new MouseEvent("click"); // 创建一个单击事件
      a.download = name || "photo"; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
  }
  function urlGetFileName (url) {
    return url.substring(url.lastIndexOf("/")+1,url.length)
}

   function dimg (dimg){
    let imgs = Array.from(document.querySelectorAll('img')).filter((node) => { return node.src.includes('imgur') })
      imgs.forEach((node)=>downloadIamge(node.src,dimg+'_'+urlGetFileName(node.src)))
    return '图片数'+imgs.length
}

window.dimg=dimg
    // Your code here...
})();

