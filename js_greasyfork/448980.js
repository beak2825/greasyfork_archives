// ==UserScript==
// @name         问卷星后台2—在问卷「设计向导页面」可以跳转到常用设置页面
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  问卷星后台管理功能增强，在问卷「设计向导页面」可以跳转到常用设置页面
// @author       任亚军
// @match        */wjx/design/designstart.aspx?activity=*
// @match        */wjx/design/questionnairesettings.aspx?activity=*
// @match        *.wjx.cn/customerservices/previewq.aspx?activity=*

// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448980/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B02%E2%80%94%E5%9C%A8%E9%97%AE%E5%8D%B7%E3%80%8C%E8%AE%BE%E8%AE%A1%E5%90%91%E5%AF%BC%E9%A1%B5%E9%9D%A2%E3%80%8D%E5%8F%AF%E4%BB%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%B8%B8%E7%94%A8%E8%AE%BE%E7%BD%AE%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448980/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B02%E2%80%94%E5%9C%A8%E9%97%AE%E5%8D%B7%E3%80%8C%E8%AE%BE%E8%AE%A1%E5%90%91%E5%AF%BC%E9%A1%B5%E9%9D%A2%E3%80%8D%E5%8F%AF%E4%BB%A5%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%B8%B8%E7%94%A8%E8%AE%BE%E7%BD%AE%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var peizhi = ["查询用户名|/customerservices/ManageAllQ2.aspx?activity=|","签到设置|/wjx/design/setcheckin.aspx?activity=|","配额设置|/wjx/rule/addrule.aspx?activity=|","KANO模型|/wjx/activitystat/kanoquestiondata.aspx?activity=|","知情同意书|/wjx/design/informed.aspx?activity=|","审核页面|/customerservices/previewq.aspx?activity=|","后台修改设置|/customerservices/changenamedesc.aspx?id=|","旧版外观设置|/newwjx/join/jqnew.aspx?q=|","问卷内容字段|/handler/IllustrateApi.ashx?activityID=|","一键审核通过|/customerservices/politics.aspx?activity=|&automa=1"]
    var oldurl = window.location.href;
    var id = oldurl.split("activity=")[1];
    var domin = oldurl.split("/")[0] + "/" + oldurl.split("/")[1] + "/" + oldurl.split("/")[2];
    var pos = document.querySelector("body");
    var rightslide = document.createElement("div");
    var slideul = document.createElement("ul");
    pos.appendChild(rightslide);
    rightslide.appendChild(slideul);
    rightslide.style = "position:fixed;right:120px;top:120px;z-index:20000;cursor: pointer;font-size:16px;color:blue;";
    var newurl = [];
    var name = [];
    var suffix = [];
    for (var i=0;i<peizhi.length;i++)
    {
        newurl[i] = peizhi[i].split("|")[1] + id + peizhi[i].split("|")[2];
        name[i] = peizhi[i].split("|")[0];
        var slideli = document.createElement("li");
        slideli.innerHTML = "<a target='_blank'; href = "+ domin +newurl[i]+">" + name[i] + "</a>";
        slideul.appendChild(slideli);
    }
})();