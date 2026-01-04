// ==UserScript==
// @name         喵子小屋发帖助手
// @description  发帖时自动填充表格，可自行配置填充内容
// @author       西洋葱
// @version      0.1
// @date         2020.05.22
// @modified     2020.05.23
// @namespace    http://tampermonkey.net/
// @match        https://forum.h3dhub.com/forum.php?mod=post&action=newthread&fid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403945/%E5%96%B5%E5%AD%90%E5%B0%8F%E5%B1%8B%E5%8F%91%E5%B8%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403945/%E5%96%B5%E5%AD%90%E5%B0%8F%E5%B1%8B%E5%8F%91%E5%B8%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //*******************自动填充配置*********************//
    var theme = ''; //主题
    var types = ['巨乳','御姐']; //作品类型，数组
    var style = '黑白'; //作品风格
    var mosaic = '黑白条'; //是否有码
    var cloud_disk = '百度云'; //下载方式
    var watermark = '无水印'; //是否有水印
    var size = ''; //大小
    var language = '中文'; //作品语言
    var author = ''; //作者名称
    var website = ''; //作者官网
    var link = ''; //分享链接
    var code = ''; //提取码
    var password = 'www.catcottage.us'; //解压密码，请自行修改为自己的密码
    var text = ''; //正文
    //***************************************************//

    //******************自动选择主题配置****************************//
    switch (Number(getQueryVariable('fid'))){
        case 81: //2D 图片档案
            theme = '本子';
            //theme = '图片'
            break;
        case 50: //2D 视频档案
            theme = '视频';
            break;
        case 51: //2D 游戏档案
            theme = '游戏本体';
            //theme = 'mod'
            break;
    }
    //***************************************************//
    document.evaluate("//li[text()[contains(.,('" + theme +"'))]]", document).iterateNext().click();
    for (var i=0;i<types.length;i++)
    {
        document.evaluate("//label[text()[contains(.,('" + types[i] +"'))]]/input", document).iterateNext().click();
    }
    document.evaluate("//label[text()[contains(.,('" + style +"'))]]/input", document).iterateNext().click();
    document.evaluate("//label[text()[contains(.,('" + mosaic +"'))]]/input", document).iterateNext().click();
    document.evaluate("//label[text()[contains(.,('" + cloud_disk +"'))]]/input", document).iterateNext().click();
    document.evaluate("//label[text()[contains(.,('" + watermark +"'))]]/input", document).iterateNext().click();
    document.getElementById("typeoption_dx").value = size;
    document.evaluate("//label[text()[contains(.,('" + language +"'))]]/input", document).iterateNext().click();
    document.getElementById("typeoption_zzmc").value = author;
    document.getElementById("typeoption_zzgw").value = website;
    document.getElementById("typeoption_xxlj").value = link;
    document.getElementById("typeoption_tqm").value = code;
    document.getElementById("typeoption_jymm").value = password
    document.getElementById("e_iframe").contentWindow.document.getElementsByTagName('body')[0].innerHTML = text

    //获取url中的指定参数值
    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

    
})();