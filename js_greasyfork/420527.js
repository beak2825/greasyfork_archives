// ==UserScript==
// @name         软通考试
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  软通自动考试脚本，一秒考满分
// @author       wing
// @match        https://www.issedu365.com/application/appexaminedetail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420527/%E8%BD%AF%E9%80%9A%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420527/%E8%BD%AF%E9%80%9A%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let typeid = location.search.substr(1).split('&').find(item => item.startsWith('typeid=')).split('=')[1];
    fetch("/miexamine/v1/examine/examinedatatyperesult/"+typeid+"/")
    .then((res) => {
         return res.json();
    })
    .then(data => {
        let answers = JSON.parse(sessionStorage.getItem(typeid));
        answers.paperanswerlist.forEach(item => {
            item.answer = data.answers.find(item2 => item2.id == item.id).answer;
        })
        sessionStorage.setItem(typeid, JSON.stringify(answers));
        document.querySelector(".confirm-btn").click()
    })
    // Your code here...
})();