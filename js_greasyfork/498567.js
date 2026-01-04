// ==UserScript==
// @name         BTluckyHelper
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  come as you are
// @author       PeerLessSoul
// @match        http://127.0.0.1:16601/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498567/BTluckyHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/498567/BTluckyHelper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var $ = $ || window.$;
    // Your code here...
    if(location.href.includes("/#/stun",0))
    {
        var checkpk= setInterval(()=>{
            let localport=$("#pane-list>div.el-scrollbar>div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default>div>div>div>div>table>tbody>tr:nth-child(2)>td.el-descriptions__cell.el-descriptions__content.is-bordered-content>span:nth-child(1)>span").text();
            let outport=$("#pane-list>div.el-scrollbar>div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default>div>div>div>div>table>tbody>tr:nth-child(2)>td.el-descriptions__cell.el-descriptions__content.is-bordered-content>span.el-tag.el-tag--primary.el-tag--small.el-tag--dark.el-tooltip__trigger>span").text().split(":")
            let newDiv = document.createElement("span");
            newDiv.style="font-size: 20px;text-align: left;position: inherit; white-space: pre;"
            newDiv.href = "#";
            newDiv.innerText = "路由器映射外部端口:"+localport+
                " 路由器映射内部端口:"+outport[1] +"\n BT 下载器端口设置："+outport[1] ;
            $("#pane-list > div.el-scrollbar > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > div > div > div > div > table").after(newDiv);
            clearInterval(checkpk);
        },500);

    }


})();