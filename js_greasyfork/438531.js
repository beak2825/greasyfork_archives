// ==UserScript==
// @name         QT&QTC语义
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  3
// @author       You
// @match        http://discover.sm.cn/2/*
// @icon         https://www.google.com/s2/favicons?domain=sm.cn
// @grant window.onurlchange
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/438531/QTQTC%E8%AF%AD%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438531/QTQTC%E8%AF%AD%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
    let question = [];
    let index = [];
    let btn = document.createElement("button");
    btn.textContent = "填 充";
    btn.className = "ant-btn";
    btn.onclick = function() {
        let curQ = getQ();
        let idx = index.indexOf(curQ.url);
        console.log("idx:" +  idx)
        console.log(question);
        console.log(index);
        console.log(curQ.url);
        if (idx === -1) alert("未找到");
        else {
            let div = document.querySelectorAll(".ant-descriptions-item-content");
            div[3].querySelector('[value="' + question[idx].answer.f + '"]').click();
            if (question[idx].answer.s !== null) div[4].querySelector('[value="' + question[idx].answer.s + '"]').click();
            div[5].querySelector('[value="' + question[idx].answer.t + '"]').click();
        }
    }
    let btn1 = document.createElement("button");
    btn1.textContent = "导出数据";
    btn1.className = "ant-btn";
    btn1.onclick = function() {
        console.log("题目数据：" + JSON.stringify(question));
        console.log("网址数据：" + JSON.stringify(index));
        GM_setClipboard("题目数据：" + JSON.stringify(question) + "\n网址数据：" + JSON.stringify(index));
    }

    let btn2 = document.createElement("button");
    btn2.textContent = "导入数据";
    btn2.className = "ant-btn";
    btn2.onclick = function() {
        let data1 = prompt("请输入题目数据：");
        let data2 = prompt("请输入网址数据：");
        if (data1) {
            JSON.parse(data1).forEach(e => {
                question.push(e);
            })
        }
        if (data2) {
            JSON.parse(data2).forEach(e => {
                index.push(e);
            })
        }
    }

    document.querySelector(".ant-btn-group").appendChild(btn);
    document.querySelector(".ant-btn-group").appendChild(btn1);
    document.querySelector(".ant-btn-group").appendChild(btn2);
    window.onurlchange = function() {
        if (!window.location.hash.includes("task/qt_qtc")) return ;
        document.querySelector(".ant-radio-group").children[0].click();
    }

    document.querySelector(".ant-radio-group-outline").onmouseup = function(e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SPAN") {
            let curQ = getQ();
            let curA = getA();
            curQ.answer = curA;
            question.push(curQ);
            index.push(curQ.url);
            document.querySelector(".ant-btn-primary").click();
        }
    }


    }, 3000)

        function getQ() {
        let div = document.querySelectorAll(".ant-descriptions-item-content");
        return {
            title: div[0].textContent,
            query: div[1].textContent,
            url: div[2].textContent,
            answer: {}
        }
    }

    function getA() {
        let ans = document.querySelectorAll("input:checked");
        return {
            f: ans[0].value,
            s: ans.length === 3 ? ans[1] : null,
            t: ans[ans.length-1].value
        }

    }
    // Your code here...
})();