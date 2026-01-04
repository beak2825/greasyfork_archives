// ==UserScript==
// @license MIT
// @name         快速搜索
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  快速搜索企业信息

// @author       lemondqs
// @match        https://*.gsxt.gov.cn/corp-query-search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gsxt.gov.cn
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/460964/%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460964/%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
$(function(){
    var url = 'https://www.tianyancha.com/search?key=';
    var names = [];
    function getinfo() {
        names = []
        $('.search_list_item> .f20').each((idx, it)=>{names.push($.trim($(it).text()))})
        var info = names.join('\n')
        $("#x-names").html(info);
    }
    window.getinfo = getinfo;

    function opennames() {
        names.forEach((name)=>{
            window.open(`${url}${name}`, "_blank");
            console.info(name)
        })
    }
    window.opennames = opennames;

        var reload =
`<div id="x-reload"
style="position: fixed;
top: 420px;
left: 20px;
width:60px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="getinfo()">刷新</div>`;
        var dom =
`<div id="x-copy"
style="position: fixed;
top: 420px;
left: 100px;
width:120px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="opennames()">快速打开</div>`;

    var infodom =
`<textarea id="x-names"
style="position: fixed;
top: 300px;
left: 20px;
width: 200px;
height: 120px;
padding: 10px;
background-color: #CCCCCC77;"></textarea>`;

    $('body').append(dom);
    $('body').append(reload);
    $('body').append(infodom);
    getinfo();

});
    // Your code here...
})();