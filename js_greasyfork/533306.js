// ==UserScript==
// @name         fake_wjx
// @namespace    http://tampermonkey.net/
// @version      2025-04-19
// @description  first version of beta
// @author       lmaonewhow with gtp4o
// @match        https://www.wjx.cn/report/*.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @license      CC-BY-NC-4.0
// @licenseURL   https://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/533306/fake_wjx.user.js
// @updateURL https://update.greasyfork.org/scripts/533306/fake_wjx.meta.js
// ==/UserScript==
(function () {
    //示例数据，自己修改
    const FAKE_CONFIG = {
        1: { type: "option", total: 100, data: [85, 15] },
        2: { type: "option", total: 100, data: [35, 40, 20, 5] },
        3: { type: "option", total: 100, data: [30, 25, 20, 15, 10] },
        4: { type: "option", total: 100, data: [30, 35, 20, 10, 5] },
        5: { type: "option", total: 100, data: [20, 40, 30, 8, 2] },
        6: { type: "option", total: 100, data: [5, 25, 60, 10] },
        7: { type: "option", total: 100, data: [70, 30] },
        8: { type: "option", total: 100, data: [60, 45, 30, 25, 35, 5] },
        9: { type: "option", total: 100, data: [25, 40, 30, 20, 35, 5] },
        10: { type: "option", total: 100, data: [40, 25, 30, 20, 15] },
        11: { type: "option", total: 100, data: [15, 45, 55, 20, 5] },
        12: {
            type: "sort",
            total: 100,
            data: [
                [50, 25, 15, 10, 0],
                [20, 35, 25, 20, 0],
                [10, 15, 30, 25, 20],
                [10, 15, 15, 30, 30],
                [0, 0, 0, 0, 100]
            ]
        },
        13: { type: "option", total: 100, data: [50, 60, 45, 35, 10] },
        14: { type: "option", total: 100, data: [30, 40, 45, 35, 20, 30, 5] },
        15: { type: "option", total: 100, data: [70, 60, 45, 50, 40, 55, 35, 5] }
    };

    function simulateChoiceData(topicId, answerArray, total = 100) {
        const question = document.querySelector(`.title-item[data-topic="${topicId}"]`);
        if (!question) return console.warn(`⚠️ 未找到第${topicId}题`);
        const table = question.querySelector('table.wjxui-table');
        if (!table) return console.warn(`❌ 第${topicId}题未找到表格`);

        const rows = table.querySelectorAll('tbody tr');
        for (let i = 1; i < rows.length - 1; i++) {
            const row = rows[i];
            const countCell = row.children[1];
            const percentCell = row.children[2];
            const count = answerArray[i - 1] ?? 0;
            const percent = ((count / total) * 100).toFixed(1).replace(/\.0$/, "");

            countCell.innerText = count;
            const bar = percentCell.querySelector(".barcont");
            if (bar) bar.style.width = percent + "%";
            const percentText = percentCell.querySelector("div[style*='margin-top']");
            if (percentText) percentText.innerText = percent + "%";
        }
        const lastRow = rows[rows.length - 1];
        lastRow.querySelector("td:nth-child(2) b").innerText = total;
    }

    function simulateRankingData(topicId, matrixData, total = 100) {
        const question = document.querySelector(`.title-item[data-topic="${topicId}"]`);
        if (!question) return console.warn(`❌ 排序题 topic=${topicId} 未找到`);
        const table = question.querySelector('table.sorttable');
        if (!table) return console.warn(`❌ 排序题 topic=${topicId} 表格未找到`);

        const rows = table.querySelectorAll("tbody tr");

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const data = matrixData[i - 1];
            let score = 0;

            for (let j = 0; j < data.length; j++) {
                const cell = row.children[j + 2];
                const count = data[j] ?? 0;
                const percent = ((count / total) * 100).toFixed(1).replace(/\.0$/, "");
                cell.innerText = `${count}(${percent}%)`;
                score += (data.length - j) * count;
            }

            row.children[1].innerText = (score / total).toFixed(2);
            row.children[row.children.length - 1].innerText = data.reduce((a, b) => a + b, 0);
        }
    }


    async function fetchFakeConfig(prompt) {
        const apiKey = 'your_api_key_here'; // 请替换为您的实际 API Key
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                input: {
                    messages: [
                        { role: 'system', content: '你是问卷数据生成器，返回格式为 JSON 的 FakeConfig。' },
                        { role: 'user', content: prompt }
                    ]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API 请求失败，状态码：${response.status}`);
        }

        const result = await response.json();
        return result.output.text;
    }


    function runFakeData(config) {
        for (const [qid, meta] of Object.entries(config)) {
            if (meta.type === 'option') {
                simulateChoiceData(qid, meta.data, meta.total);
            } else if (meta.type === 'sort') {
                simulateRankingData(qid, meta.data, meta.total);
            }
        }
        console.log("✅ 所有题目伪造数据生成完成！");
    }

    function injectUI() {
        const panel = document.createElement('div');
        panel.className = "fakesurvey-panel";
        panel.innerHTML = `
            <style>
                .fakesurvey-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                    width: 320px;
                    font-family: system-ui, sans-serif;
                    z-index: 99999;
                }
                .fakesurvey-panel h3 {
                    margin: 0 0 12px;
                    font-size: 16px;
                }
                .fakesurvey-panel textarea {
                    width: 100%;
                    padding: 10px;
                    resize: none;
                    box-sizing: border-box;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                .fakesurvey-panel button {
                    padding: 6px 14px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    background-color: #4caf50;
                    color: white;
                    margin-right: 8px;
                }
                .fakesurvey-panel button:hover {
                    background-color: #43a047;
                }
            </style>
            <h3>📊 FakeData 控制面板</h3>
            <textarea id="ai-fake-prompt" rows="4" placeholder="输入要求，如：大一新生，对AI写作感兴趣..."></textarea>
            <div style="text-align: right;">
                <button id="btn-run-fake">🧪 一键Fake</button>
                <button id="btn-ai-gen">🧠 AI生成</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btn-run-fake').onclick = () => runFakeData(FAKE_CONFIG);
        document.getElementById('btn-ai-gen').onclick = async () => {
            const prompt = document.getElementById('ai-fake-prompt').value.trim();
            if (!prompt) return alert('请输入需求描述');
            const extracted = extractCurrentQuestionMeta();
            const fullPrompt = `你是问卷伪造数据生成器，题目信息如下：\n${JSON.stringify(extracted)}\n需求：${prompt}\n请生成 FakeConfig 数据结构`;
            alert("🚧 示例环境不支持直接调用 AI，请在后端部署或用 API 方式接入。");
            console.log(fullPrompt);
        };
    }

    function extractCurrentQuestionMeta() {
        const all = {};
        document.querySelectorAll('.title-item').forEach(block => {
            const qid = parseInt(block.getAttribute('data-topic'));
            const titleText = block.querySelector('.title dd')?.innerText.trim();
            const options = Array.from(block.querySelectorAll('table td[val]')).map(td => td.innerText.trim());
            if (options.length > 0) {
                all[qid] = { title: titleText, options };
            }
        });
        return all;
    }

    injectUI();
})();

