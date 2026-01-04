// ==UserScript==
// @name         一键 DDOC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397580/%E4%B8%80%E9%94%AE%20DDOC.user.js
// @updateURL https://update.greasyfork.org/scripts/397580/%E4%B8%80%E9%94%AE%20DDOC.meta.js
// ==/UserScript==

(function() {
    var storage = window.localStorage;
    var sfkq = '';

    if(storage.getItem('ddoc') == '1'){
        sfkq = '开启';
        console.error('mcbbs.net: 系统错误 - 检测到正在受到 DDOC 攻击！');
        console.error('mcbbs.net: 系统崩溃 - 检测到正在受到 DDOC 攻击！');
        console.log("%c欢迎使用一键 DDOC 系统。"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:3em;line-height:60px;");
        console.log("%c在个人菜单中找到按钮开始 DDOC MCBBS\nDDOC 处于 " + sfkq + " 状态"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:1em;line-height:60px;");
        jq('html').html('<h1>500 - HTTP-Internal Server Error.</h1><h2>内部错误无法显示</h2><p>可能由于以下原因导致网站无法访问：</p><li>语法出错</li><li>数据库连接语句出错</li><li>文件引用与包含路径出错(如未启用父路径)</li><p>我可以怎样做？</p><li>如果你是管理员，请检查是否有如上问题</li><li>如果你是用户，请联系管理员并稍后访问</li><br><br><br>DDOC 管理器：<a onclick="window.localStorage[\'ddoc\'] = \'222\';window.location.reload();" id="ddoc_stop" style="font-size:10px;background: red;color:#fff;">_结束_</a>');
    }else{
        sfkq = '关闭';
        console.log("%c欢迎使用一键 DDOC 系统。"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:3em;line-height:60px;");
        console.log("%c在个人菜单中找到按钮开始 DDOC MCBBS\nDDOC 处于 " + sfkq + " 状态"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:1em;line-height:60px;");

    }

    jq('.user_info_menu_btn').append('<li><a id="ddoc_start" style="background: red;color:#fff;">开始</a> DDOC <a id="ddoc_stop" style="background: red;color:#fff;">结束</a></li>');

    document.getElementById('ddoc_start').addEventListener('click',function(){
        console.log('DDOC Start');
        storage["ddoc"] = '1';
        window.location.reload();

    })

    document.getElementById('ddoc_stop').addEventListener('click',function(){
        console.log('DDOC Stop');
        storage["ddoc"] = '222';
        window.location.reload();
    })
})();