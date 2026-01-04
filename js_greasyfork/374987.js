// ==UserScript==
// @namespace Violentmonkey Scripts
// @name         automatic praise machine
// @version      1.2
// @description  automatic praise
// @author       文不能测字
// @include      http*://ican.sf-express.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM.addStyle
// @grant       GM.getResourceText
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.info
// @grant       GM.registerMenuCommand
// @grant       GM_log
// @grant       GM_xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/374987/automatic%20praise%20machine.user.js
// @updateURL https://update.greasyfork.org/scripts/374987/automatic%20praise%20machine.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function () {
    'use strict';
    console.log("自动点赞项目开始1");
    const websiteList = [
        {
            "url": "工行卡寄递：http://ican.sf-express.com/#/comInnovateDetail/4232",
            "description": "工行卡寄递",
            "microInnoId": 4232
        },
        {
            "url": "http://ican.sf-express.com/#/comInnovateDetail/4239",
            "description": "舟汽寄递",
            "microInnoId": 4239
        },
        {
            "url": "http://ican.sf-express.com/#/comInnovateDetail/4217",
            "description": "货微打",
            "microInnoId": 4217
        },
    ];

    $(function () {
        console.log("自动点赞项目开始2");
        run(websiteList, changeLink);

    });

})();

function run(websiteList, callback) {
    // 循环
    for (var i = 0; i < websiteList.length; ++i) {
        console.log("自动点赞项目列表" + websiteList[i].description);
        // GM_log("自动点赞项目列表" + websiteList[i].description);
        callback(websiteList[i]);
    }

}

// 点赞
function changeLink(website) {

    // 注册一个定时器
    var task = setInterval(function (event) {

        // var myData = new FormData();
        // myData.append("microInnoId", website.microInnoId);
        // const data = '{"microInnoId=" + website.microInnoId}';
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://chap-manage.sf-express.com/yearInno/base/praise",
            // data: data,
            data: JSON.stringify({microInnoId: website.microInnoId}),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                console.log("恭喜 成功点赞" + website.description + website.url +" "+ response.responseText);
                // GM_log(response.responseText);
            },
            onerror: function (reponse) {
                //alert('error');
                console.log("error: ", reponse);
                // GM_log(reponse);
            }
        });
        // 关闭定时器
        clearInterval(task);
    }, 1000);


}


