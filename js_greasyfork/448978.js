// ==UserScript==
// @name         问卷星后台4—在问卷作答页面可以跳转到问卷设置等页面
// @namespace    https://www.wjx.cn/
// @version      0.2
// @description  问卷星后台功能增强，在问卷作答页面可以跳转到问卷设置等页面。
// @author       任亚军
// @match        */jq/*
// @match        */m/*
// @match        */vj/*
// @match        */vm/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448978/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B04%E2%80%94%E5%9C%A8%E9%97%AE%E5%8D%B7%E4%BD%9C%E7%AD%94%E9%A1%B5%E9%9D%A2%E5%8F%AF%E4%BB%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%97%AE%E5%8D%B7%E8%AE%BE%E7%BD%AE%E7%AD%89%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448978/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B04%E2%80%94%E5%9C%A8%E9%97%AE%E5%8D%B7%E4%BD%9C%E7%AD%94%E9%A1%B5%E9%9D%A2%E5%8F%AF%E4%BB%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%97%AE%E5%8D%B7%E8%AE%BE%E7%BD%AE%E7%AD%89%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var oldurl = window.location.href;
    var id1 = oldurl.split("/")[4];
    var id = id1.split(".")[0];
    var idset = "https://www.wjx.cn/wjx/design/questionnairesettings.aspx?activity="+id;
    var idmoblie = "/vm/"+id+".aspx";
    var houtaipeizhi = "https://www.wjx.cn/customerservices/changenamedesc.aspx?id="+id;

    var pos = document.querySelector("body");
    var rightslide = document.createElement("div");
    var slideul = document.createElement("ul");
    var slideli1 = document.createElement("li");
    var slideli2 = document.createElement("li");
    var slideli3 = document.createElement("li");

    pos.appendChild(rightslide);
    rightslide.appendChild(slideul);
    slideul.appendChild(slideli1);
    slideul.appendChild(slideli2);
    slideul.appendChild(slideli3);
    rightslide.className = "rightslide";

    rightslide.style = "position:fixed;right:120px;top:120px;width:100px;z-index:20000;cursor: pointer;font-size:16px;color:blue;";

    slideli1.innerHTML = "<a  target='_blank'>问卷设置</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(1) > a").href =idset;

    slideli2.innerHTML = "<a  target='_blank'>移动页面</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(2) > a").href =idmoblie;

    slideli3.innerHTML = "<a  target='_blank'>后台配置</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(3) > a").href =houtaipeizhi;

})();