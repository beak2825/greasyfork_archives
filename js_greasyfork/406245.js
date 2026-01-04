// ==UserScript==
// @name         帮你下批量导入
// @namespace    https://bangnixia.com/
// @version      1.0
// @description  try to take over the world!
// @author       Lancerfoo
// @match        https://bangnixia.com/fetch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406245/%E5%B8%AE%E4%BD%A0%E4%B8%8B%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406245/%E5%B8%AE%E4%BD%A0%E4%B8%8B%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 批量导入下载任务
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    
    function AddTask(link, token){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', '/fetch', true);
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
        httpRequest.setRequestHeader("X-CSRF-TOKEN",token);
        httpRequest.send('url='+encodeURIComponent(link)+'&host=auto');
    }
    // 插入一个input，一个按钮
    var oTest = document.getElementsByClassName("row")[1];
    var textBox = document.createElement("textarea");
    textBox.setAttribute("id", "down_list")
    
    var btn = document.createElement("input");
    btn.setAttribute("type", "submit");
    oTest.insertBefore(textBox,null);
    oTest.insertBefore(btn,null);
    
    var token = document.getElementsByName("csrf-token")[0].getAttribute("content");
    
    btn.onclick = async function () {
        var addresses = textBox.value.split("\n");
        for (var address of addresses){
            // console.log(address);
            AddTask(address,token);
            await sleep(5500);
        }
    };
    
})();