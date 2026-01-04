// ==UserScript==
// @license      MIT
// @name         AtCoder Show Result
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  check and show AC
// @author       twil3akine
// @match        https://atcoder.jp/contests/*/tasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523427/AtCoder%20Show%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/523427/AtCoder%20Show%20Result.meta.js
// ==/UserScript==

'use strict'

const GREEN = "rgba(92,184,92,0.75)";
const YELLOW = "rgba(240,173,78,0.75)";

const getResult = async (url) => {
    const formatInfo = (cells) => {
        const name = cells[1].querySelector("a").textContent.trim().split(" ")[0];
        const lang = cells[3].querySelector("a").textContent.trim();
        const result = cells[6].querySelector("span").textContent.trim();

        return {
            name: name,
            lang: lang,
            result: result,
        }
    }

    let count = 0
    let contents = [];

    while (true) {
        try {
            count++;

            const response = await fetch(`${url}?page=${count}`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            if (doc.querySelector(".panel-body")) {
                return contents;
            }

            const trs = doc.querySelectorAll("tr");

            trs.forEach((tr, idx) => {
                if (idx === 0) return ;

                let cells = tr.querySelectorAll("td");

                contents.push(formatInfo(cells));
            });
        } catch (e) {
            console.error(`Error fetching the page: ${e}`);
            return [];
        }
    }
}

const getQuestions = () => {
    const questions = [""];
    const trs = document.querySelectorAll("tr");
    trs.forEach((tr, idx) => {
        if (idx === 0) return;
        let questName = tr.querySelector("td").querySelector("a").textContent.trim();
        questions.push(questName);
    })
    return questions;
}

const adaptResult = (questions, results) => {
    const trs = document.querySelectorAll("tr");
    results.reverse().forEach(result => {
        const targetElement = trs[questions.indexOf(result.name)];
        targetElement.style.backgroundColor = (result.result === "AC") ? GREEN : YELLOW;
        targetElement.style.filter = "brightness(1.25)";
    })
}

const app = async () => {
    const currentURL = window.location.href;
    const fetchPage = currentURL.replace("tasks", "submissions/me");
    const results = await getResult(fetchPage);
    const questions = getQuestions(currentURL);

    adaptResult(questions, results);
}

app();