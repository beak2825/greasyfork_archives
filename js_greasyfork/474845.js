// ==UserScript==
// @name         Sensei Helper Importer
// @version      0.7
// @description  Sensei Helper素材需求导入
// @author       Tiny
// @match        https://sensei.help/zh*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sensei.help
// @namespace    https://github.com/TinyTitanPro/Sensei_Helper_Importer/blob/main/Sensei_Helper_Importer.user.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474845/Sensei%20Helper%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/474845/Sensei%20Helper%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //初始化命令相关字符串
    var front = "{\"equipmentsRequirementStore\":{\"requirementByPieces\":[";
    var end1 = "],\"requirementMode\":\"ByPiece\"},\"gameInfoStore\":{\"gameServer\":\"";
    var end2 = "\"}}";
    var server = "Global";

    //从url中获取相关参数
    var codecheck = getUrlParam('code');
    var servercheck = getUrlParam('server');

    //如果参数存在，则自动执行导入
    if (!!codecheck){
        if (!!servercheck){
            server = servercheck.trim();
        }
        var tempcode = codecheck.replace(/,/g,'","count":');
        var tempcode2 = tempcode.replace(/;/g,'}, {"pieceId":"21');
        var initialcode = front+'{"pieceId":"21'+tempcode2+'}'+end1+server+end2;
        window.localStorage.setItem("SenseiHelperStore",initialcode);
        alert('导入完成');
        window.location.href="https://sensei.help/zh";
    }


    //创建元素
    var importbox = document.createElement('input');
    var importbtn = document.createElement('button');
    var btntext = document.createElement('div');
    var btnclick = document.createElement('span');

    //设置元素样式
    importbox.placeholder = '在此粘贴导入代码';
    btntext.innerText = '导入素材需求';
    //importbtn.textContent = '导入素材需求';

    importbtn.className = 'css-a89121';
    importbox.style.position = 'relative';
    importbox.style.left = '340px';
    importbox.style.right = '340px';

    importbox.className = 'css-1v4ccyo';
    importbtn.style.position = 'relative';
    importbtn.style.left = '350px';
    importbtn.style.right = '350px';

    btntext.className = ' revert-wiz-transform';
    btnclick.className = 'MuiTouchRipple-root css-w0pj6f';

    //点击按钮时执行导入
    importbtn.addEventListener('click',() => {
        var jsoncode = importbox.value.split("&")[0];
        var servercode = importbox.value.split("&")[1];
        if (!!servercode){
            server = servercode.trim();
        }
        var importcode = front+jsoncode+end1+server+end2;
        window.localStorage.setItem("SenseiHelperStore",importcode);
        alert("导入完成，即将刷新页面");
        //alert(importcode);
        location.reload();
    });

    //在页面中插入元素
    document.querySelector("#__next > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-6mqsus > div > div > div > div > div:nth-child(1) > div.BuiLinedText_textRowContainer__gFUcJ").appendChild(importbox);
    document.querySelector("#__next > div.MuiGrid2-root.MuiGrid2-container.MuiGrid2-direction-xs-row.css-6mqsus > div > div > div > div > div:nth-child(1) > div.BuiLinedText_textRowContainer__gFUcJ").appendChild(importbtn);
    importbtn.appendChild(btntext);
    importbtn.appendChild(btnclick);


    //从url中获取参数的函数
    function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    //不存在时返回null
    return null;
    }


})();