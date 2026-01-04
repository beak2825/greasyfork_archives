// ==UserScript==
// @license MIT
// @name         多条搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  多条搜索企业信息
// @author       lemondqs
// @match        https://www.tianyancha.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianyancha.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/461278/%E5%A4%9A%E6%9D%A1%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/461278/%E5%A4%9A%E6%9D%A1%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
$(function(){
    var url = 'https://www.tianyancha.com/search?key=';

    function search() {
        $('#x-list').val().split('\n').forEach((name)=> {
            if(name) {
                window.open(`${url}${name}`, "_blank");
            }
        })

        $("#x-search").css("background-color", "#00FF6677")
        setTimeout(()=>{
            $("#x-search").css("background-color", "#0066FF77")
        }, 1000)
    }
    // 挂载到窗体
    window.search = search

    var infodom =
`<textarea id="x-list"
style="position: fixed;
top: 300px;
left: 20px;
width: 200px;
height: 120px;
padding: 10px;
background-color: #CCCCCC77;"></textarea>`;

    var btn =
`<div id="x-search"
style="position: fixed;
top: 420px;
left: 100px;
width:120px;
height: 40px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="search()">批量搜索</div>`;

    $('body').append(infodom);
    $('body').append(btn);

});
    // Your code here...
})();