// ==UserScript==
// @name         设计向导增加常用入口
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仅供问卷内部使用
// @author       WJX问卷星
// @match        */wjx/design/designstart.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426810/%E8%AE%BE%E8%AE%A1%E5%90%91%E5%AF%BC%E5%A2%9E%E5%8A%A0%E5%B8%B8%E7%94%A8%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/426810/%E8%AE%BE%E8%AE%A1%E5%90%91%E5%AF%BC%E5%A2%9E%E5%8A%A0%E5%B8%B8%E7%94%A8%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    var oldurl = window.location.href;
    var id1 = oldurl.split("activity=")[1];
    var qiandao = "https://www.wjx.cn/wjx/design/setcheckin.aspx?activity="+id1;
    var peie = "https://www.wjx.cn/wjx/rule/addrule.aspx?activity="+id1;

    var pos = document.querySelector("body");
    var rightslide = document.createElement("div");
    var slideul = document.createElement("ul");
    var slideli1 = document.createElement("li");
    var slideli2 = document.createElement("li");

    pos.appendChild(rightslide);
    rightslide.appendChild(slideul);
    slideul.appendChild(slideli1);
    slideul.appendChild(slideli2);

    rightslide.className = "rightslide";
    rightslide.style = "position:fixed;right:120px;top:120px;width:100px;border:2px solid red;z-index:20000;";

    slideli1.innerHTML = "<a target='_blank' style=font-size:16px;color:red;>签到设置</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(1) > a").href = qiandao;

    slideli2.innerHTML = "<a target='_blank' style=font-size:16px;color:red;>配额设置</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(2) > a").href = peie;


})();