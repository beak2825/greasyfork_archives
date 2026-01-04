// ==UserScript==
// @name         q11e-wjw
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0.1
// @description  为问卷网量身打造的全新自动化程序
// @author       zemelee
// @license      CC-BY-NC-4.0
// @homepageURL  https://github.com/zemelee
// @homepageURL  http://sugarblack.top
// @match        https://www.wenjuan.com/*
// @downloadURL https://update.greasyfork.org/scripts/536949/q11e-wjw.user.js
// @updateURL https://update.greasyfork.org/scripts/536949/q11e-wjw.meta.js
// ==/UserScript==
function clearAll() {
    localStorage.clear()
    sessionStorage.clear()
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
}

async function sleep(delay) {
    return new Promise((resolve) => { setTimeout(resolve, delay * 1000) });
}

function showMessage(message, type = "error") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.padding = "10px 20px";
    toast.style.backgroundColor = {
        info: "#3498db",
        success: "#2ecc71",
        warning: "#f39c12",
        error: "#e74c3c"
    }[type] || "#3498db";
    toast.style.color = "white";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.5s";
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
}


function safeExecute(fn) {
    return async function (current, ...rest) {
        try {
            await fn.call(this, current, ...rest);
        } catch (error) {
            showMessage(`第${current}题有误!`);
        }
    };
}

function checkAgain() {
    return Array.from(document.querySelectorAll('div')).find(el => {
        return el.textContent.trim() === '再次参与';
    });
}

async function clickAgain() {
    const againDiv = checkAgain()
    if (againDiv) {
        againDiv.click();
        await sleep(2);
    }
}

async function clickRestart() {
    const restart = Array.from(document.querySelectorAll('span')).find(el => {
        return el.textContent.trim() === '重新开始';
    });
    if (restart) {
        restart.click();
        await sleep(2);
    }
}

async function clickContinue() {
    const elements = document.querySelectorAll('p');
    for (let el of elements) {
        if (el.textContent.trim() === '继续答题') {
            el.click()
        }
    }
    await sleep(1);
}

function singleRatio(range, ratio) {
    let weight = [];
    let sum = 0;
    for (let i = range[0]; i <= range[1]; i++) {
        sum += ratio[i - range[0]];
        weight.push(sum);
    }
    const rand = Math.random() * sum;
    for (let i = 0; i < weight.length; i++) {
        if (rand < weight[i]) {
            return i + range[0];
        }
    }
}

function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

const optCountable = {
    single: "div.q-single>div.option-group>div>div>div",
    multiple: "div.q-multiple>div.ws-checkbox-group>div>div>div",
    bank: "textarea",
    scoreDefault: "div.q-score-default>div>div.icon-topic>div>div>div",
    star: "div.q-score-default>div>div.icon-topic>div>div>div",
    matrixScale: {
        qs: "div.q-matrix-scale>div>div>div.option-row-content",
        opts: "div.icon-topic-content>div.row-style"
    },
    evaluation: "div.q-evaluation > div > div.evaluation-top"
};

async function _single(current, ratios) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let _selector = optCountable.single + " .ws-radio"
    let optList = Array.from(curq.querySelectorAll(_selector))
    if (optList.length != ratios.length) {
        showMessage(`第${current}题的选项与比例长度不一致`)
        ratios = Array.from({ length: opts.length }, () => randint(1, 9));
    }
    let optIdx = singleRatio([0, optList.length - 1], ratios)
    optList[optIdx].click()
}

async function _multiple(current, ratios) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let _selector = optCountable.multiple + " .ws-checkbox"
    let opts = Array.from(curq.querySelectorAll(_selector))
    if (opts.length != ratios.length) {
        showMessage(`第${current}题的选项与比例长度不一致`)
        ratios = Array.from({ length: opts.length }, () => randint(9, 99));
    }
    let mul_list = [];
    while (mul_list.reduce((acc, curr) => acc + curr, 0) <= 0) {
        mul_list = ratios.map((item) => Math.random() < item / 100 ? 1 : 0)
    }
    for (const [index, item] of mul_list.entries()) {
        if (item == 1) {
            opts[index].click()
        }
    }
}

async function _blank(current, texts) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let textarea = curq.querySelector(optCountable.bank)
    textarea.value = texts[randint(0, texts.length - 1)]
}

async function _scoreDefault(current, ratios) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let _selector = optCountable.scoreDefault + " .circle-icon"
    let optList = Array.from(curq.querySelectorAll(_selector))
    if (optList.length != ratios.length) {
        showMessage(`第${current}题的选项与比例长度不一致`)
        ratios = Array.from({ length: optList.length }, () => randint(1, 9));
    }
    let optIdx = singleRatio([0, optList.length - 1], ratios)
    optList[optIdx].click()
}

async function _matrixScale(current, ratios) {

    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let qs_selector = optCountable.matrixScale.qs
    let qs = Array.from(curq.querySelectorAll(qs_selector))
    qs.forEach((qItem, index) => {
        let optList = Array.from(qItem.querySelectorAll(optCountable.matrixScale.opts + ">div"))
        let optIdx = singleRatio([0, optList.length - 1], ratios[index])
        optList[optIdx].click()
    })


}

async function _star(current, ratios) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let _selector = "div.q-score-default>div>div.icon-topic>div>div div.symbol"
    let optList = Array.from(curq.querySelectorAll(_selector))
    if (optList.length != ratios.length) {
        showMessage(`第${current}题的选项与比例长度不一致`)
        ratios = Array.from({ length: optList.length }, () => randint(1, 9));
    }
    let optIdx = singleRatio([0, optList.length - 1], ratios)
    optList[optIdx].click()
}

async function _evaluation(current, ratios) {
    let curq = document.querySelector(`#question-warper > div:nth-child(${current})`)
    if (curq.style.display == "none") return
    let _selector = optCountable.evaluation + ">div"
    let optList = Array.from(curq.querySelectorAll(_selector))
    if (optList.length != ratios.length) {
        showMessage(`第${current}题的选项与比例长度不一致`)
        ratios = Array.from({ length: optList.length }, () => randint(1, 9));
    }
    let optIdx = singleRatio([0, optList.length - 1], ratios)
    optList[optIdx].click()
}



async function submit() {
    await new Promise((resolve) => { setTimeout(resolve, 1500); });
    document.querySelector("#answer-submit-btn").click()
}


async function initial() {
    let qList = document.querySelectorAll('#question-warper > div');
    qList.forEach((qItem, qIdx) => {
        const qClass = qItem.querySelector("div.question-content").getAttribute("class");
        const setTitle = (type) => {
            const titleBox = qItem.querySelector("div.q-title-box .theme-text-wrap");
            titleBox.textContent = `${qIdx + 1}. ${type}-----` + titleBox.textContent;
        };
        if (qClass.includes("single")) {
            setTitle("single");
        } else if (qClass.includes("multiple")) {
            setTitle("multiple");
        } else if (qClass.includes("bank")) {
            setTitle("blank");
        } else if (qClass.includes("evaluation")) {
            setTitle("evaluation");
        } else if (qClass.includes("q-score-default")) {
            if (qItem.querySelector(".symbol-item-wrap")) { setTitle("star"); }
            else { setTitle("scoreDefault"); }
        } else if (qClass.includes("matrix-scale")) {
            setTitle("matrixScale");
        } else {
            setTitle("unkown");
        }
    });
    await sleep(1)
}


(async function () {
    'use strict';
    clearAll();
    await sleep(2);
    while (!document.querySelector("#answer-submit-btn")) {
        await sleep(2)
        if (checkAgain()) {
            clickAgain();
        }
        await sleep(2)
        location.reload(true);
    }
    const single = safeExecute(_single);
    const multiple = safeExecute(_multiple);
    const blank = safeExecute(_blank);
    const scoreDefault = safeExecute(_scoreDefault);
    const matrixScale = safeExecute(_matrixScale);
    const star = safeExecute(_star);
    const evaluation = safeExecute(_evaluation);
    clickContinue()
    clickRestart()
    initial()
    // 仅需关注这里的配置即可
    const q11es = [
        // 以下代码针对示例问卷：https://www.wenjuan.com/s/UZBZJv1Y6b
        // 第一题（单选题，应该调用single）的脚本未写，留给用户自己编辑，以熟悉此脚本的用法
        () => multiple(2, [50, 50, 50, 50]), // 多选题
        () => blank(3, ["关注公众号", "做实验的研究牲"]),// 填空题
        () => scoreDefault(4, [1, 2, 3, 4, 3]), // 评分题
        () => scoreDefault(5, [1, 2, 4, 3]), // 评分题，此题比例故意写错（对示例问卷而言），以展示脚本的容错能力
        () => matrixScale(6, [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]), // 矩阵评分题
        () => scoreDefault(7, [1, 2, 3, 4, 3]),
        () => scoreDefault(8, [1, 2, 3, 4, 3]),
        () => scoreDefault(9, [1, 2, 3, 4, 3]),
        () => star(10, [1, 2, 3, 4, 3]), // 星级题
        () => evaluation(11, [1, 2, 3, 4, 3]), // 评价题
        () => scoreDefault(12, [1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5]),
        () => matrixScale(13, [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]),
    ];
    for (let q11e of q11es) {
        await q11e();
        await sleep(1) // 等待1s后继续下一题
    }
    await sleep(2) // 等待2s后提交
    await submit();
    clearAll();
    setTimeout(location.reload(true), 2.5 * 1000)
})();