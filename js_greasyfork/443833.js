// ==UserScript==
// @name         哔哩哔哩视频封面获取
// @namespace    哔哩哔哩视频封面获取
// @version      0.3
// @license MIT License
// @description 点击下载哔哩哔哩投稿视频的封面 个人用的 只能全屏用 窗口模式有样式bug 有空再改 应该没人会用吧
// @author       Namishibuki
// @match        https://www.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/443833/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443833/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(document.getElementsByTagName("meta")[12].content)
    var div = document.createElement("DIV");
      div.id = "addDiv";
      div.style.cssText =
        "color: #1989fa;font-size: 21px;font-family: cursive;z-index: 1000;width: 50px;font-weight: 700;height: 50px;background: #f2f5f6;position: fixed;left: 50px;top: 820px;display: flex;align-items: center;justify-content: space-around;border-radius: 10px;box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);";
      document.body.insertBefore(div, document.body.childNodes[0]);
      let a = document.createElement("a"); //a标签
      a.innerHTML = "点击";
      a.onclick = function () {
        console.log(canvas.toDataURL());
        let link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "download";
        link.click();
      };
      document.getElementById("addDiv").appendChild(a);//a标签插入到div中
      let canvas = document.createElement("canvas"); //创建画板
      let img = document.createElement("img"); //创建图片
      img.src = document.getElementsByTagName("meta")[14].content; //设置图片属性
      img.setAttribute("crossOrigin", "Anonymous"); //跨域
      let ctx = canvas.getContext("2d"); //创建画板对象
      img.onload = () => {
        //图片加载完成触发
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    // Your code here...
})();