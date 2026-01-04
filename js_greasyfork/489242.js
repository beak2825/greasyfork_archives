// ==UserScript==
// @name         Lesson helper
// @namespace    https://rachpt.cn/
// @version      2024-03-07
// @description  MDPI学习助手
// @author       rachpt
// @match        https://i.mdpi.cn/team/training/show_attachment/*
// @icon         https://i.mdpi.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489242/Lesson%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489242/Lesson%20helper.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const domain = location.origin;
    const button = document.createElement("span");
    button.innerText = "一键完成";
    button.style.backgroundColor = "#0000ffb0";
    button.style.color = "white";
    button.style.padding = "0 10px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.marginLeft = "10px";
    button.style.fontSize = "1rem";
    document
        .querySelector('nav[aria-label="breadcrumb"] ol.sm-left')
        .appendChild(button);

    button.addEventListener("click", async () => {
        queryPageInfo();
    });

    setTimeout(() => {
        const e = document.querySelector(".lessons-player-dimensions");
        if (e) e.style.height = "750px";
    }, 3000);

    async function setDuration(id) {
        const url = `${domain}/team/training/last_seen_duration`;
        const time = (
            20 * 1000 +
            Math.random() * 9000 +
            Math.random() * 10 * 1000
        ).toFixed(6);

        const payload = {
            id,
            time,
        };
        const resp = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(payload),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });
        const res = await resp.json();
        alert(`设置成功， 时长：${time}`);
        console.log("res", res);
    }

    async function queryPageInfo() {
        const v = document.querySelector("#lessons-player");
        const { attachment, lesson } = v.dataset;
        const url = `${domain}/team/training/lesson/${lesson}/video_record/${attachment}`;
        // post 请求
        const resp = await fetch(url, {
            method: "POST",
        });
        const recordInfo = await resp.json();
        console.log("recordInfo", recordInfo);

        const { id: lessonId, breakpoints } = recordInfo;
        const result = [];

        for (const breakpoint of breakpoints) {
            const breakpointInfo = await queryLessonBreakpointInfo(lessonId);
            const { question_id: questionId, answer } = breakpointInfo;

            const resp = await submitAnswer(lessonId, questionId, breakpoint, answer);
            if (resp.status === 0) result.push(breakpoint);
        }
        if (result.length && result.length === breakpoints.length) {
            location.reload();
        }
        setDuration(lessonId);
    }

    async function submitAnswer(lessonId, questionId, breakpoint, answer) {
        const url = `${domain}/team/training/confirm_breakpoint`;
        const payload = {
            id: lessonId,
            question_id: questionId,
            breakpoint,
            answer,
        };

        const resp = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(payload),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });
        const response = await resp.json();
        return response; // {status: 0}
    }

    async function queryLessonBreakpointInfo(lessonId) {
        const url = `${domain}/team/training/confirm_breakpoint?id=${lessonId}`;
        const resp = await fetch(url, { method: "GET" });

        const { question, question_id } = await resp.json();
        const questionWord = _getQuestionWord(question);
        const answer = _getQuestionAnswer(question, questionWord);
        return { questionWord, question_id, answer };
    }

    function _getQuestionWord(question) {
        const ptn = /Please select "([^"]+)" in the following/.exec(question);
        if (ptn) return ptn[1];

        console.error("Cannot find question word:", question);
        return "null";
    }

    function _getQuestionAnswer(question, questionWord) {
        const ptn = new RegExp(`data-answer="(\\w)">\n\\s+${questionWord}\n`);
        const m = ptn.exec(question);
        if (m) return m[1];

        console.error("Cannot find answer:", questionWord);
        console.log(question);

        return "null";
    }
})();