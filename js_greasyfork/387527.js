// ==UserScript==
// @name         JLC下单页面隐藏头部广告,增加显示界面
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        https://*.sz-jlc.com*/consumer*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387527/JLC%E4%B8%8B%E5%8D%95%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A%2C%E5%A2%9E%E5%8A%A0%E6%98%BE%E7%A4%BA%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387527/JLC%E4%B8%8B%E5%8D%95%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A%2C%E5%A2%9E%E5%8A%A0%E6%98%BE%E7%A4%BA%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".erpHeader .headTab a{background:#5a9bff;color: #fff;line-height: 30px;display: block;text-decoration: none;font-size: 14px;padding-left:20px;padding-right:20px;white-space:nowrap;} .pt_ztnr_left_bt1 dd ul li a img{margin:1px 1px 0 10px;line-height:26px;*margin:0 1px 0 1px;*line-height:26px;};"
    document.head.appendChild(css);

    var tbody=document.getElementById("control_left_td");
    var zzptLi = document.getElementById("zzptLi");

    if(tbody)
    {
        //添加个按钮
        var Element = document.createElement("input");
        Element.type = "button";
        Element.value = zzptLi.innerText.match("您：.*") ;
        Element.style  = "color: rgb(191, 191, 19);";
        Element.addEventListener("click",HideErpHeader);
        Element.id = "Hide_erpHeader"


        tbody.insertBefore(Element,tbody.childNodes[0])
        Element= null;

        Element = document.createElement("br");
        tbody.insertBefore(Element,tbody.childNodes[1])
        Element= null;

        Element = document.createElement("input");
        Element.type = "button";
        Element.value = zzptLi.innerText.match("名：.*");
        Element.style  = "color: rgb(191, 191, 19);";
        Element.addEventListener("click",HideErpHeader);
        Element.id = "Hide_erpHeader"

        tbody.insertBefore(Element,tbody.childNodes[2])
        Element= null;
        HideErpHeader();

        tbody.style = " width: 14%";
    }
})();

function HideErpHeader()
{
    var erpHeader = document.getElementsByClassName("erpHeader");
    if(erpHeader)
    {
       //document.getElementById("EleId").style.display="none";
       //document.getElementById("EleId").style.display="inline";
        if( erpHeader[0].style.display =='none')
        {
            erpHeader[0].style.display ="inline";
        }else{
            erpHeader[0].style.display ="none";
        }
    }
}