// ==UserScript==
// @name         KrackMigo
// @namespace    https://greasyfork.org/pt-BR/users/1346771-kinjinho
// @version      5.0
// @description  ModMenu para Khan Academy inspirado no design do Khanmigo
// @author       KIN
// @match        https://pt.khanacademy.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503460/KrackMigo.user.js
// @updateURL https://update.greasyfork.org/scripts/503460/KrackMigo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const svgLogo = `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Abrir Khanmigo</title><circle cx="28" cy="28" r="28" fill="#5f1e5c"></circle><path d="M17.61 12.88H38.45C41.22 12.88 43.47 15.13 43.47 17.89V40.57C43.47 42.76 40.86 43.90 39.25 42.41L37.57 40.85C37.10 40.42 36.49 40.18 35.86 40.18H15.11C13.72 40.18 12.60 39.05 12.60 37.67V17.89C12.60 15.13 14.85 12.88 17.61 12.88Z" fill="#DEAE93"></path><circle cx="21.4178" cy="27.8582" r="6.01791" fill="white"></circle><mask id="mask0" maskUnits="userSpaceOnUse" x="15" y="21" width="13" height="13" style="mask-type: alpha;"><circle cx="21.4178" cy="27.8582" r="6.01791" fill="white"></circle></mask><g mask="url(#mask0)"><circle cx="17.22" cy="23.673" r="5.46" fill="black"></circle></g><circle cx="34.578" cy="27.8579" r="6.01791" fill="white"></circle><mask id="mask1" maskUnits="userSpaceOnUse" x="28" y="21" width="13" height="13" style="mask-type: alpha;"><circle cx="34.578" cy="27.8579" r="6.01791" fill="white"></circle></mask><g mask="url(#mask1)"><circle cx="30.3802" cy="23.6728" r="5.46" fill="black"></circle></g></svg>`;

    const html = `
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <div id="krakdemy-container">
            <div id="krakdemy-toggle">${svgLogo}</div>
            <div id="krakdemy-sidebar">
                <div id="krakdemy-header">
                    <span id="krakdemy-title">KrackMigo</span><span id="krakdemy-beta">BETA</span>
                </div>
                <div id="krakdemy-body">
                    <p class="info">📖 Respostas Detectadas:</p>
                    <div id="ansBreak"></div>
                    <button id="clearList">Limpar Lista</button>
                </div>
            </div>
        </div>

        <style>
            #krakdemy-container {
                font-family: 'Inter', sans-serif;
            }
            #krakdemy-toggle {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 56px;
                height: 56px;
                cursor: pointer;
                z-index: 99999;
            }
            #krakdemy-sidebar {
                position: fixed;
                left: 0;
                bottom: 0;
                top: 0;
                width: 320px;
                background-color: #fff;
                box-shadow: 2px 0 12px rgba(0,0,0,0.1);
                display: none;
                flex-direction: column;
                border-right: 3px solid #5f1e5c;
                z-index: 99998;
            }
            #krakdemy-header {
                padding: 20px;
                background: #f4eef5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ddd;
            }
            #krakdemy-title {
                font-size: 20px;
                font-weight: 600;
                color: #5f1e5c;
            }
            #krakdemy-beta {
                font-size: 12px;
                background: #5f1e5c;
                color: white;
                border-radius: 4px;
                padding: 2px 6px;
                margin-left: 5px;
            }
            #krakdemy-body {
                padding: 20px;
                overflow-y: auto;
                height: calc(100% - 80px);
            }
            #clearList {
                background: #5f1e5c;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 6px;
                margin-top: 15px;
                cursor: pointer;
            }
            .info {
                font-weight: bold;
                margin-bottom: 10px;
                border: 2px solid black;
                padding: 10px;
                border-radius: 8px;
            }
        </style>
    `;

    const el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el);

    const sidebar = document.getElementById('krakdemy-sidebar');
    document.getElementById('krakdemy-toggle').onclick = () => {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    };

    document.getElementById('clearList').onclick = () => {
        document.getElementById('ansBreak').innerHTML = '';
    };

    // Logic do script Krakdemy
    let curAns = 1;
    const originalFetch = window.fetch;
    window.fetch = function () {
        return originalFetch.apply(this, arguments).then(async (res) => {
            if (res.url.includes("/getAssessmentItem")) {
                const clone = res.clone();
                const json = await clone.json();
                const item = json.data.assessmentItem.item.itemData;
                const question = JSON.parse(item).question;

                Object.keys(question.widgets).map(widgetName => {
                    switch (widgetName.split(" ")[0]) {
                        case "numeric-input":
                            return freeResponseAnswerFrom(question);
                        case "radio":
                            return multipleChoiceAnswerFrom(question);
                        case "expression":
                            return expressionAnswerFrom(question);
                        case "dropdown":
                            return dropdownAnswerFrom(question);
                    }
                });
            }
            return res;
        });
    };

    function addAnswer(answer) {
        const el = document.createElement('p');
        el.textContent = answer;
        document.getElementById('ansBreak').appendChild(el);
    }

    function freeResponseAnswerFrom(question) {
        Object.values(question.widgets).forEach((widget) => {
            widget.options?.answers?.forEach(answer => {
                if (answer.status == "correct") addAnswer(answer.value);
            });
        });
    }

    function multipleChoiceAnswerFrom(question) {
        Object.values(question.widgets).forEach((widget) => {
            widget.options?.choices?.forEach(choice => {
                if (choice.correct) addAnswer(choice.content);
            });
        });
    }

    function expressionAnswerFrom(question) {
        Object.values(question.widgets).forEach((widget) => {
            widget.options?.answerForms?.forEach(answer => {
                if (Object.values(answer).includes("correct")) addAnswer(answer.value);
            });
        });
    }

    function dropdownAnswerFrom(question) {
        Object.values(question.widgets).forEach((widget) => {
            widget.options?.choices?.forEach(choice => {
                if (choice.correct) addAnswer(choice.content);
            });
        });
    }
})();
