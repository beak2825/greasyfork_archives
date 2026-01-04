// ==UserScript==
// @name         📚雅宝电大国开支持全平台学习通智慧树青书学堂学起Puls网课继续教育学习脚本
// @namespace    ybaotk_netcourse_helper
// @version      1.1.3
// @description  支持超星学习通、智慧树、青书学堂等平台自动刷课、答题，题库每日更新，支持导入导出，含客服联系功能
// @author       ybaotk.com
// @author       微信1144766066
// @match        *://*.chaoxing.com/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.xuexi365.com/*
// @match        *://*.qingshuxuetang.com/*
// @match        *://*.ouchn.cn/*
// @match        *://*.*.*/*
// @icon         https://www.ybaotk.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @connect      ybaotk.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542434/%F0%9F%93%9A%E9%9B%85%E5%AE%9D%E7%94%B5%E5%A4%A7%E5%9B%BD%E5%BC%80%E6%94%AF%E6%8C%81%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%99%BA%E6%85%A7%E6%A0%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E5%AD%A6%E8%B5%B7Puls%E7%BD%91%E8%AF%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542434/%F0%9F%93%9A%E9%9B%85%E5%AE%9D%E7%94%B5%E5%A4%A7%E5%9B%BD%E5%BC%80%E6%94%AF%E6%8C%81%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%99%BA%E6%85%A7%E6%A0%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E5%AD%A6%E8%B5%B7Puls%E7%BD%91%E8%AF%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...msg) => console.log('[雅宝助手]', ...msg);
    const getDB = () => JSON.parse(GM_getValue("questionDB", "{}"));
    const setDB = (data) => GM_setValue("questionDB", JSON.stringify(data));

    let state = { paused: false };

    function autoPlayVideo() {
        const video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.playbackRate = 2.0;
            if (video.paused) {
                video.play().then(() => log("视频播放")).catch(() => log("播放失败，需用户手动点击"));
            }
        }
    }

    function fetchAnswer(questionText) {
        const db = getDB();
        for (let key in db) {
            if (questionText.includes(key)) return db[key];
        }
        return null;
    }

    function autoAnswerQuestions() {
        const questions = document.querySelectorAll('.questionLi, .TiMu, .exam-question');
        if (!questions.length) return;

        questions.forEach(q => {
            if (q.dataset.answered) return;
            const text = q.innerText.trim().slice(0, 50);
            const answer = fetchAnswer(text);

            const options = q.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            if (options.length) {
                if (answer) {
                    options.forEach(opt => {
                        const label = opt.closest("label");
                        if (label && label.innerText.includes(answer)) opt.checked = true;
                    });
                    log("匹配题库成功：", text);
                } else {
                    options[0].checked = true;
                    log("默认选择第一个：", text);
                }
                q.dataset.answered = "true";
            }
        });

        const submitBtn = document.querySelector('input[type="submit"], button[type="submit"], .submitButton');
        if (submitBtn) {
            submitBtn.click();
            log('提交答题');
        }
    }

    function monitorProgress() {
        const next = document.querySelector('.nextBtn, .next-button, .ui-btn-next');
        if (next && !document.querySelector('video')) {
            next.click();
            log('跳转下一节');
        }
    }

    function insertControlPanel() {
        const panel = document.createElement("div");
        panel.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;z-index:99999;background:#fff;border:1px solid #ccc;padding:10px;border-radius:5px;font-size:14px;">
            <b>📚 雅宝助手控制台</b><br/>
            <button id="toggle-script">⏸ 暂停</button>
            <button id="reload-page">🔄 重启</button>
            <button id="load-db">⬇️ 远程题库</button>
            <button id="export-db">📤 导出题库</button>
            <input id="import-db" type="file" style="margin-top:5px;"/>
            <button id="contact-service">📞 联系客服</button>
        </div>`;
        document.body.appendChild(panel);

        document.getElementById("toggle-script").onclick = () => {
            state.paused = !state.paused;
            document.getElementById("toggle-script").innerText = state.paused ? "▶️ 继续" : "⏸ 暂停";
        };
        document.getElementById("reload-page").onclick = () => location.reload();
        document.getElementById("load-db").onclick = () => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ybaotk.com/api/questions.json",
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        setDB(data);
                        alert(`远程题库载入成功：${Object.keys(data).length}题`);
                    } catch (e) {
                        alert("远程题库加载失败");
                    }
                }
            });
        };
        document.getElementById("export-db").onclick = () => {
            const db = GM_getValue("questionDB", "{}");
            const blob = new Blob([db], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "ybao_questionDB.json";
            a.click();
            URL.revokeObjectURL(url);
        };
        document.getElementById("import-db").onchange = function () {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const newDB = JSON.parse(e.target.result);
                    setDB(newDB);
                    alert(`题库导入成功，共 ${Object.keys(newDB).length} 条`);
                } catch {
                    alert("导入失败，格式错误");
                }
            };
            reader.readAsText(file);
        };
        document.getElementById("contact-service").onclick = () => {
            alert("📞 客服微信：1144766066\n请添加微信咨询相关问题！");
        };
    }

    function runMainLoop() {
        log("📚 雅宝助手已启动");
        setInterval(() => {
            if (state.paused) return;
            autoPlayVideo();
            autoAnswerQuestions();
            monitorProgress();
        }, 3000);
    }

    insertControlPanel();
    runMainLoop();
})();
