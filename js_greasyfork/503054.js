// ==UserScript==
// @name        多维思考
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Analyze text using Six Thinking Hats method on any website
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @author       shisan
// @downloadURL https://update.greasyfork.org/scripts/503054/%E5%A4%9A%E7%BB%B4%E6%80%9D%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/503054/%E5%A4%9A%E7%BB%B4%E6%80%9D%E8%80%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .six-hats-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #FFFFFF;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: all 0.3s ease;
            padding: 0;
        }
        .six-hats-button:hover {
            transform: scale(1.1);
        }
        .six-hats-button svg {
            width: 50px;
            height: 50px;
        }
        .six-hats-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 380px;
            height: 100vh;
            background-color: white;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 10000;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
        }
        .six-hats-sidebar.open {
            right: 0;
        }
        .six-hats-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        .six-hats-content h2 {
            margin-top: 0;
            color: #333;
        }
        .six-hats-content pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
        }
    `);

    function addButton() {
        const button = document.createElement('button');
        button.className = 'six-hats-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
                <path d="M50,20 A30,30 0 0,1 80,50 L50,50 Z" fill="#FF0000"/>
                <path d="M80,50 A30,30 0 0,1 65,77 L50,50 Z" fill="#FFFF00"/>
                <path d="M65,77 A30,30 0 0,1 35,77 L50,50 Z" fill="#00FF00"/>
                <path d="M35,77 A30,30 0 0,1 20,50 L50,50 Z" fill="#000000"/>
                <path d="M20,50 A30,30 0 0,1 35,23 L50,50 Z" fill="#0000FF"/>
                <path d="M35,23 A30,30 0 0,1 65,23 L50,50 Z" fill="#FFFFFF"/>
                <path d="M45,30 L55,30 L55,50 L60,50 L50,60 L40,50 L45,50 Z" fill="#FFD700"/>
            </svg>
        `;
        button.title = '多维思考';
        document.body.appendChild(button);

        button.addEventListener('click', analyzeSelectedText);
    }

    function getSelectedText() {
        return window.getSelection().toString().trim();
    }

    function analyzeWithAPI(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.siliconflow.cn/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer sk-nqaptsdfttcfiitaobhppavdjzhuqljhpmbrkxnjzcmckqqr"
                },
                data: JSON.stringify({
                    model: "Qwen/Qwen2-7B-Instruct",
                    messages: [{
                        role: "system",
                        content: "You are an assistant that analyzes text using the Six Thinking Hats method. Provide analysis for each hat: White (facts), Red (emotions), Black (caution), Yellow (benefits), Green (creativity), and Blue (process)."
                    }, {
                        role: "user",
                        content: `Analyze this text using the Six Thinking Hats method: "${text}"`
                    }]
                }),
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.choices[0].message.content);
                    } else {
                        reject(new Error(`API request failed with status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function showAnalysis(analysis) {
        let sidebar = document.querySelector('.six-hats-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.className = 'six-hats-sidebar';
            document.body.appendChild(sidebar);
        }

        sidebar.innerHTML = `
            <button class="six-hats-close">&times;</button>
            <div class="six-hats-content">
                <h2>多维思考</h2>
                <pre>${analysis}</pre>
            </div>
        `;

        sidebar.querySelector('.six-hats-close').addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        setTimeout(() => sidebar.classList.add('open'), 10);
    }

    async function analyzeSelectedText() {
        const text = getSelectedText();
        if (!text) {
            alert('请先选中文本');
            return;
        }

        try {
            const analysis = await analyzeWithAPI(text);
            showAnalysis(analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('An error occurred during analysis. Please try again later.');
        }
    }

    addButton();
})();