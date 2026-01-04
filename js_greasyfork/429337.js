// ==UserScript==
// @name         NTKO办公OA控件全屏编辑框
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.21
// @description  扩展编辑框大小
// @match        http://192.168.1.65/SubModule/News/News*
// @downloadURL https://update.greasyfork.org/scripts/429337/NTKO%E5%8A%9E%E5%85%ACOA%E6%8E%A7%E4%BB%B6%E5%85%A8%E5%B1%8F%E7%BC%96%E8%BE%91%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/429337/NTKO%E5%8A%9E%E5%85%ACOA%E6%8E%A7%E4%BB%B6%E5%85%A8%E5%B1%8F%E7%BC%96%E8%BE%91%E6%A1%86.meta.js
// ==/UserScript==

function URL_Request(strName) {
    var strHref = document.location.toString();
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1); //==========获取到右边的参数部分
    var arrTmp = strRight.split("&"); //=============以&分割成数组

    for (var i = 0; i < arrTmp.length; i++) //===========循环数组
    {
        var dIntPos = arrTmp[i].indexOf("=");
        var paraName = arrTmp[i].substr(0, dIntPos);
        var paraData = arrTmp[i].substr(dIntPos + 1);
        if (paraName.toUpperCase() == strName.toUpperCase()) {
            return paraData;
        }
    }
    return "";
    }

var btn = document.createElement("input");
btn.type = "button";
btn.className = "u-btn u-btn-c4 u-btn-sm";
btn.id = "preView";
btn.value = "预   览";
btn.addEventListener("click",function(){window.open('http://192.168.1.65/SubModule/News/NewsDetail.aspx?id='+URL_Request('id'))})

var EditTable=document.getElementById("Panel_save")||document.getElementById("Panel_send");
if (EditTable != undefined) {
    EditTable.nextSibling.style.width="100%";
}

var btnPoint=document.getElementById("btnback");
if (btnPoint != undefined) {
document.getElementById("btnback").parentNode.appendChild(btn);
}