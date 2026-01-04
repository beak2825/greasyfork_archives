// ==UserScript==
// @name         找到知网文章英文版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  找到知网文章英文版!
// @author       You
// @match        https://kns.cnki.net/kcms2/*
// @match        https://oversea.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456477/%E6%89%BE%E5%88%B0%E7%9F%A5%E7%BD%91%E6%96%87%E7%AB%A0%E8%8B%B1%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/456477/%E6%89%BE%E5%88%B0%E7%9F%A5%E7%BD%91%E6%96%87%E7%AB%A0%E8%8B%B1%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
var paramfilename=document.getElementById("paramfilename");
   // paramfilename.setAttribute('type',' ');
   var filenamevalue= paramfilename.getAttribute("value");
   var enurl= "https://oversea.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename="+filenamevalue;
    console.log(enurl);
var rt=document.getElementsByClassName("operate-btn");

    var lif = document.createElement("button"); //创建一个input对象（提示框按钮）
     lif.class="finden";
    lif.style = "color:#ffffff;padding: 2px 10px;";
    var a = document.createElement("a");
    a.textContent = "TO英文版";
    a.onclick=function (){
        window.location.href=enurl;
        return;
    };
    lif.append(a);
    rt[0].append(lif)
//题目 期刊英文
    var title=document.getElementsByClassName('wx-tit')[0].getElementsByTagName('h1')[0].firstChild.wholeText;
    var journalname=document.getElementsByClassName('top-tip')[0].getElementsByTagName("span")[0].getElementsByTagName("a")[0].innerText;

 var li2 = document.createElement('a');
            var a2 = document.createElement('a');
            li2.className = "btn-diy";
            li2.style = "width:auto;height:23px;line-height:22px;background-color:#3f8af0;border-radius:3px;list-style: none;";
            a2.innerHTML = "复制题目期刊名";
            a2.className = "a-diy";
            a2.style = "color:#ffffff;padding: 2px 10px;";
        a2.onclick=function (){
            navigator.clipboard.writeText(title+"[J]."+journalname);
    };
            li2.append(a2);
            document.getElementsByClassName("top-tip")[0].append(li2);

    // Your code here...
})();