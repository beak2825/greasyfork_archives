// ==UserScript==
// @name         亚马逊成本同步工具
// @namespace    
// @version      0.11
// @description  插入产品成本，计算利润
// @author       Monty
// @match        https://www.baidu.com/*
// @icon         
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475310/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%88%90%E6%9C%AC%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/475310/%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%88%90%E6%9C%AC%E5%90%8C%E6%AD%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.meiguodizhi.com/api/v1/dz",
        headers: {
            "content-type":"application/json"
         },
        data:{
            "city": "",
            "path": "/jp-address",
            "method": "refresh"
        },
        onload: function(response){
            console.log("请求成功");
            console.log(response.responseText);
            alert(response.response.data)
        },
         onerror: function(response){
          console.log("请求失败");
          alert("请求失败")
        }
    });
})();
