// ==UserScript==
// @name         问卷星后台3—用户问卷列表页面更多针对用户操作
// @namespace    https://www.wjx.cn/
// @version      0.2
// @description  问卷星后台功能增强，用户问卷列表页面更多针对用户操作。
// @author       任亚军
// @match        https://www.wjx.cn/customerservices/manageallq2.aspx?username=*
// @match        https://www.wjx.cn/customerservices/ManageAllQ2.aspx?username=*
// @match        ?username=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448981/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B03%E2%80%94%E7%94%A8%E6%88%B7%E9%97%AE%E5%8D%B7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E6%9B%B4%E5%A4%9A%E9%92%88%E5%AF%B9%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/448981/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%90%8E%E5%8F%B03%E2%80%94%E7%94%A8%E6%88%B7%E9%97%AE%E5%8D%B7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E6%9B%B4%E5%A4%9A%E9%92%88%E5%AF%B9%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    var peizhi = ["用户中心|https://www.wjx.cn/customerservices/centermanage.aspx?username=","用户体系|https://www.wjx.cn/wjx/design/usersystem/wjxsystemset.aspx?username=","用户咨询|https://www.wjx.cn/customerservices/viewsupport.aspx?username=","用户发票|https://www.wjx.cn/customerservices/fapiaonew.aspx?username=","用户日志|https://www.wjx.cn/customerservices/operationlog.aspx?user=","发送消息|https://www.wjx.cn/customerservices/sendmessage.aspx?username="]
    var oldurl = window.location.href;
    var userid = oldurl.split("=")[1];
    var pos = document.querySelector("body");
    var rightslide = document.createElement("div");
    var slideul = document.createElement("ul");
    pos.appendChild(rightslide);
    rightslide.appendChild(slideul);
    rightslide.className = "rightslide";
    rightslide.style = "position:fixed;right:120px;top:400px;width:100px;z-index:20000;cursor: pointer;font-size:16px;color:blue;";
    var newurl = [];
    var name = [];
    for (var i=0;i<peizhi.length;i++)
    {
        newurl[i] = peizhi[i].split("|")[1]+userid;
        name[i] = peizhi[i].split("|")[0];
        var slideli = document.createElement("li");
        slideli.innerHTML = "<a target='_blank'; href = "+newurl[i]+">" + name[i] + "</a>";
        slideul.appendChild(slideli);
    }
})();