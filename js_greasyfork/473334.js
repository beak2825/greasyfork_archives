// ==UserScript==
// @name         测试发送请求到公司接口
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  这只是个demo 测试发送请求到公司接口
// @author       lanning
// @match        zentao.tangees.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tangees.com
// @downloadURL https://update.greasyfork.org/scripts/473334/%E6%B5%8B%E8%AF%95%E5%8F%91%E9%80%81%E8%AF%B7%E6%B1%82%E5%88%B0%E5%85%AC%E5%8F%B8%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/473334/%E6%B5%8B%E8%AF%95%E5%8F%91%E9%80%81%E8%AF%B7%E6%B1%82%E5%88%B0%E5%85%AC%E5%8F%B8%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function () {

    const btn = document.createElement('button');
    btn.innerHTML = '测试发送请求';
    btn.style.width = '100px';
    btn.style.height = '40px';
    btn.style.position = 'fixed';
    btn.style.bottom = '60px';
    btn.style.right = '20px';
    btn.style.zIndex = '999999';
    document.body.appendChild(btn);
   
    btn.onclick = () => {
        var formData = new FormData();
         formData.append('name', '测试列表' + Number(new Date()));
         formData.append('is_sharing', 0);
         formData.append('object_type', 'enterprise');
         GM_xmlhttpRequest({
             method: "POST",
             url: "https://export.tungee.com/cgi/foreign-trade/api/lead-list/add",
             data: formData,
             onload: function(response) {
                 console.log(JSON.parse(response?.response));
             }
         });
    };
    // Your code here...
}());
