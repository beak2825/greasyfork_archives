// ==UserScript==
// @name         免费下载🆓🆓作文📃📃
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  你可以免费下载作文
// @author       You
// @match        https://www.yuwenmi.com/dldoc/*
// @match        https://www.cnfla.com/dldoc/*
// @match        https://www.baihuawen.cn/down/*
// @match        https://www.zuowenwang.net/down/*
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484419/%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%F0%9F%86%93%F0%9F%86%93%E4%BD%9C%E6%96%87%F0%9F%93%83%F0%9F%93%83.user.js
// @updateURL https://update.greasyfork.org/scripts/484419/%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%F0%9F%86%93%F0%9F%86%93%E4%BD%9C%E6%96%87%F0%9F%93%83%F0%9F%93%83.meta.js
// ==/UserScript==

(function() {
    function a(){
        let d=document.evaluate("//a[@class='down_btn']", document).iterateNext();
        return d.href;
    }
    if(window.location.href.indexOf("https://www.baihuawen.cn") == 0){
        let h = document.createElement("button");
        document.body.append(h);
        h.textContent = "免费下载全文";
        h.style.backgroundColor = "#44b549";
        h.style.height = "100px";
        h.style.width = "300px";
        h.style.border = "0px";
        h.style.fontSize = "20pt";
        h.style.color = "white";
        h.style.borderRadius = "7px";
        h.style.fontWeight = "bold";
        h.addEventListener("click",function(){var classid = getQueryString('classid');var newsid = getQueryString('newsid');var title = getQueryString('title');location.href = 'https://www.' + domain + '/docx/' + classid + '_' + newsid + '/' + title + '.doc';alert("下载成功！")});
    }else if(window.location.href.indexOf("https://www.zuowenwang.net") == 0){
        let y = document.createElement("button");
        document.body.insertBefore(y,document.body.firstChild);
        y.textContent = "免费下载全文";
        y.style.backgroundColor = "#44b549";
        y.style.height = "100px";
        y.style.width = "300px";
        y.style.border = "0px";
        y.style.fontSize = "20pt";
        y.style.color = "white";
        y.style.fontWeight = "bold";
        y.style.verticalAlign = "middle";
        y.addEventListener("click",function(){window.location.replace(a());alert("重定向成功！")});
    }else{
        let b = document.createElement("button");
        document.body.append(b);
        b.textContent = "免费下载全文";
        b.style.backgroundColor = "#44b549";
        b.style.height = "100px";
        b.style.width = "300px";
        b.style.border = "0px";
        b.style.fontSize = "25pt";
        b.style.color = "white";
        b.style.borderRadius = "7px";
        b.style.fontWeight = "bold";
        b.addEventListener("click",function(){window.location.replace("//" + location.host + "/pic/dldoc/page" + pageSize + pathname + '.doc');alert("下载成功！")});
    }
})();