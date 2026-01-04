// ==UserScript==
// @name         WeLearn一键完成
// @namespace    https://github.com/Zonakkis
// @version      0.1.6
// @description  一键完成WeLearn的油猴脚本
// @author       Zonakkis
// @match        *://welearn.sflep.com/student/StudyCourse.aspx*
// @match        *://welearn.sflep.com/student/studyccourse.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520688/WeLearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/520688/WeLearn%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90.meta.js
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
    }
    function FillingLong() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="fillinglong"]');
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
    }
    function Choice() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="choice"]');
        for (let i = 0; i < divs.length; i++) {
            const ul = divs[i].querySelector('ul[data-itemtype="options"]');
            const li = ul.querySelector('li[data-solution]');
            li.dataset.choiced = "";
        }
    }
    function MultiChoice() {
        const divs = innerdocument.querySelectorAll('div[data-controltype="multichoice"]');
        for (let i = 0; i < divs.length; i++) {
            const ul = divs[i].querySelector('ul[data-itemtype="options"]');
            const lis = ul.querySelectorAll('li[data-solution]');
            for (let j = 0; j < lis.length; j++) {
                const li = lis[j];
                li.dataset.choiced = "";
            }
        }
    }
    async function Record() {
        let record = innerdocument.querySelector('[data-xbindclick="record"]');
        if (!record) {
            record = innerdocument.querySelector('[data-controltype="record"]');
        }
        if (record) {
            while (!record.hasAttribute("data-recording") && recordTry < recordMaxTry) {
                recordTry++;
                record.click();
                await Wait(2000);
            }
            if (record.hasAttribute("data-recording")) {
                record.click();
            }
        }
    }
    async function Finish() {
        innerdocument = GetInnerDocument();
        FillingShort();
        FillingLong();
        Choice();
        MultiChoice();
        await Submit();
        await Record();
        await Wait(300);
        NextPage();
    }
    async function Submit() {
        const submit = innerdocument.getElementsByClassName("cmd cmd_submit")[0];
        if (typeof submit !== "undefined") {
            submit.click();
            await Wait(300);
            Confirm();
        }
    }
    function Confirm() {
        const yes = innerdocument.getElementsByClassName("layui-layer-btn0")[0];
        yes.click();
    }
    function NextPage() {
        recordTry = 0;
        nextPage.click();
    }
    async function AddButton() {
        nextPage = document.getElementsByClassName("c_s_3_2")[0].childNodes[0];
        while (!finish) {
            finish = document.getElementsByClassName("c_s_2_5")[0];
            await Wait(100);
        }
        finish.removeAttribute("id");
        finish.style.display = "block";
        const button = finish.childNodes[0];
        button.href = "javascript:void(0)";
        button.style.fontSize = "12px";
        button.innerText = "一键完成";
        button.onclick = Finish;
    }
    let innerdocument;
    let nextPage;
    let finish;
    const recordMaxTry = 5;
    let recordTry = 0;
    window.onload = AddButton;
})();

