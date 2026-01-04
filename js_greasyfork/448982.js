// ==UserScript==
// @name         问卷星后台5-提交答卷后可快速重复作答及跳转设置页面
// @namespace    https://www.wjx.cn/
// @version      0.2
// @description  问卷星后台管理增强，提交答卷后可快速重复作答及跳转设置页面。
// @author       任亚军
// @include      */completemobile2.aspx*
// @match        */completemobile2.aspx*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448982/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B05-%E6%8F%90%E4%BA%A4%E7%AD%94%E5%8D%B7%E5%90%8E%E5%8F%AF%E5%BF%AB%E9%80%9F%E9%87%8D%E5%A4%8D%E4%BD%9C%E7%AD%94%E5%8F%8A%E8%B7%B3%E8%BD%AC%E8%AE%BE%E7%BD%AE%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448982/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B05-%E6%8F%90%E4%BA%A4%E7%AD%94%E5%8D%B7%E5%90%8E%E5%8F%AF%E5%BF%AB%E9%80%9F%E9%87%8D%E5%A4%8D%E4%BD%9C%E7%AD%94%E5%8F%8A%E8%B7%B3%E8%BD%AC%E8%AE%BE%E7%BD%AE%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var oldurl = window.location.href;
    var id1 = oldurl.split("activityid=")[1];
    //alert(id1);
    var id = id1.split("&")[0];
    //alert(id);
    var wjurl = "/vm/"+id+".aspx";
    var wjset = "https://www.wjx.cn/wjx/design/questionnairesettings.aspx?activity="+id;
    var mywj ="https://www.wjx.cn/newwjx/manage/myquestionnaires.aspx";

    var pos = document.querySelector("body");
    var rightslide = document.createElement("div");
    var slideul = document.createElement("ul");
    var slideli1 = document.createElement("li");
    var slideli2 = document.createElement("li");
    var slideli3 = document.createElement("li");
    var slideli4 = document.createElement("li");

    pos.appendChild(rightslide);
    rightslide.appendChild(slideul);
    slideul.appendChild(slideli1);
    slideul.appendChild(slideli2);
    slideul.appendChild(slideli3);
    slideul.appendChild(slideli4);
    rightslide.className = "rightslide";

    rightslide.style = "position:fixed;right:120px;top:120px;width:100px;z-index:20000;cursor: pointer;font-size:16px;color:blue;";

    slideli1.innerHTML = "<a  target='_self' >重新作答</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(1) > a").href =wjurl;

    slideli2.innerHTML = "<a  target='_self' >问卷设置</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(2) > a").href =wjset;

    slideli3.innerHTML = "<a  target='_self' >我的问卷</a>";
    document.querySelector("body > div.rightslide > ul > li:nth-child(3) > a").href =mywj;

//    slideli4.innerHTML = "<a  target='_self' ></a>";
//    document.querySelector("body > div.rightslide > ul > li:nth-child(4) > a").href =;

})();