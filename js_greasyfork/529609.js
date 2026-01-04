// ==UserScript==
// @name         WeLearn一键完成
// @version      0.1.4
// @namespace    https://yghr3a.cn
// @description  全自动完成WeLearn的油猴脚本
// @author       Zonakkis / yghr3a
// @match        *://welearn.sflep.com/student/StudyCourse.aspx*
// @match        *://welearn.sflep.com/student/studyccourse.aspx*
// @match        *://welearn.sflep.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529609/WeLearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/529609/WeLearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function Wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function GetInnerDocument() {
        return document.getElementById("contentFrame").contentDocument;
    }
    function FillingShort() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="filling"]');

        if(divs.length == 0) return false;

        for (let i = 0; i < divs.length; i++) {
            const input = divs[i].querySelector('input');
            ///const result = divs[i].querySelector('div[data-itemtype="result"]');
            const myresult = divs[i].querySelector('div[data-itemtype="myresult"]');
            let answer = input.dataset.solution;
            input.value = answer;
            if (myresult != null) {
                myresult.innerText = answer;
            }
        }

        return true;
    }
    function FillingLong() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="fillinglong"]');

        if(divs.length == 0) return false;
        for (let i = 0; i < divs.length; i++) {
            const textarea = divs[i].querySelector('textarea');
            const result = divs[i].querySelector('div[data-itemtype="result"]');
            let answer = result.innerText
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/\([^)]*\)/g, '')
                .replace(/(?<=\s|^)(\w+)(?:\s*\/\s*\w+)+(?=\s|$)/, '$1');
            textarea.value = answer;
        }

        return true;
    }
    function Choice() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="choice"]');

        if(divs.length == 0) return false;

        for (let i = 0; i < divs.length; i++) {
            const ul = divs[i].querySelector('ul[data-itemtype="options"]');
            const li = ul.querySelector('li[data-solution]');
            li.dataset.choiced = "";
        }

        return true;
    }
    async function Finish() {
        console.log("EDIT!");
        innerdocument = GetInnerDocument();
        let b1 = FillingShort();
        let b2 = FillingLong();
        let b3 = Choice();

        if( (b1 || b2 || b3) == true)
        {
            console.log("该页面有题目");
            await Submit();
            await Wait(300);
        }
        Next();
    }
    async function Submit() {
        const submit = innerdocument.getElementsByClassName("cmd cmd_submit")[0];
        submit.click();

        await Wait(300);
        Confirm();
    }
    function Confirm() {
        const yes = innerdocument.getElementsByClassName("layui-layer-btn0")[0];

        try
        {
            yes.click();
        }
        catch
        {
            console.log("确认提交失败, 将自动进入下一页");
        }
    }
    function Next() {
        next.click();
    }
    function AddButton() {
        next = document.getElementsByClassName("c_s_3_2")[0].childNodes[0];
        const aiSpan = document.getElementsByClassName("c_s_2_5")[0];
        aiSpan.style.display = "block";
        const button = aiSpan.childNodes[0];
        button.href = "javascript:void(0)";
        button.style.fontSize = "12px";
        button.innerText = "一键完成";
        button.onclick = Finish;
    }
    let innerdocument;
    let next;
    window.onload = AddButton;

    setInterval(Finish, 5000);
})();

