// ==UserScript==
// @name         quizii组卷查重工具——修改后的跳转页面
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       JinJunwei
// @match        http://121.42.229.71:8200/items/search?id=*
// @match        http://121.42.229.71:8200/item/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389570/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E4%BF%AE%E6%94%B9%E5%90%8E%E7%9A%84%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/389570/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E4%BF%AE%E6%94%B9%E5%90%8E%E7%9A%84%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (location.href.startsWith("http://121.42.229.71:8200/items/search?id=")){
        // 需要考虑习题被聚类的情况，
        // 点击搜索按钮
        const id = location.search.substring(4);
        document.querySelector("#search_by_id_form  input[name='id']").value=id;
        document.querySelector("#search_by_id_form button").click()

        // 保存id，用于自动点击“修改习题”
        localStorage.setItem("idAndTime",JSON.stringify({id:id,time:Date.now()}));

        // 自动关闭页面
        // 首次使用会被chrome浏览器拦截，提示“是否允许弹出窗口”
        setTimeout (()=>{
            const idAndTime = JSON.parse(localStorage.getItem("idAndTime"));
            if(idAndTime.id==id && idAndTime.time==-1){close();}
        }, 1000);
        return;
    }

    // 点击修改题目
    const idAndTime = JSON.parse(localStorage.getItem("idAndTime"));
    if(!idAndTime){return;}
    if(Date.now()-idAndTime.time>2000){return;}
    if (location.href.startsWith("http://121.42.229.71:8200/item/"+idAndTime.id)){
        document.querySelector("#lr-panel div.ctrl-panel td:nth-child(3) > a").click()
        // 打开成功，关闭上一个页面
        localStorage.setItem("idAndTime",JSON.stringify({id:idAndTime.id,time:-1}));
    }

})();