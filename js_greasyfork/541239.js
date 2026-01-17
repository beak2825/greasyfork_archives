// ==UserScript==
// @name         一键打分超星作业-改
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  添加几个按钮，点击一键批改作业
// @author       丸子
// @run-at       document-end
// @match        https://mooc1-1.chaoxing.com/*
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/work/library/review-work*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/541239/%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/541239/%E4%B8%80%E9%94%AE%E6%89%93%E5%88%86%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A-%E6%94%B9.meta.js
// ==/UserScript==




/* ================== 全局变量 ================== */
var scores = [100,90,80,70,60,50,40,30,0];
var str = '';

/* ================== 打分函数 ================== */
function fillscore(i) {
    var divB = document.getElementsByClassName("inputBranch")[0];
    var divA = document.getElementById("tmpscore");
    if (!divA || !divB) return;

    divA.value = scores[i];
    divB.value = scores[i];

    var btn = document.getElementsByClassName("jb_btn_160")[0];
    if (btn) btn.click();

    // ⭐ 每次打分，允许下一份作业的 AI 按钮再次点击
    autoAi.clickedButtons = new WeakSet();
}

/* ================== 打回函数 ================== */
function dahui(str){
    var btndh = document.querySelector("body > div.fanyaMarkingBootm > div > a.btnBlue.btn_92.fr.fs14.marginLeft30");
    var btndhText = document.getElementById("textCon");
    if (!btndh || !btndhText) return;

    btndh.click();
    btndhText.value = str;

    var dhsubmit = document.querySelector("#back_maskDiv > div > div.popBottom > a.jb_btn.jb_btn_92.fr.fs14");
    if (dhsubmit) dhsubmit.click();
}

/* ================== 自动AI逻辑（多按钮 + 开关 + 持久化） ================== */
var autoAi = (function() {
    var clickedButtons = new WeakSet(); // 防止重复点击按钮
    var enabled = localStorage.getItem('autoAiEnabled') !== 'false'; // 默认开启

    // 自动点击AI按钮
    setInterval(() => {
        if (!enabled) return;
        const buttons = document.querySelectorAll('.usingBtn.useAiMark');
        buttons.forEach(btn => {
            if (btn.offsetParent !== null && !clickedButtons.has(btn)) {
                btn.click();
                clickedButtons.add(btn);
                console.log('[油猴] 自动AI已点击一个按钮');
            }
        });
    }, 500);

    return {
        get enabled() { return enabled; },
        set enabled(val) {
            enabled = val;
            localStorage.setItem('autoAiEnabled', enabled);
            if (!enabled) clickedButtons = new WeakSet();
        },
        clickedButtons: clickedButtons
    };
})();

/* ================== 创建自动AI开关按钮 ================== */
(function createAutoAiToggle() {
    const btn = document.createElement('div');
    btn.innerText = autoAi.enabled ? '自动AI：开' : '自动AI：关';
    btn.style.cssText = `
        position: fixed;
        right: 10px;
        top: 80px;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        z-index: 1000;
        background: ${autoAi.enabled ? '#4CAF50' : '#999'};
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    `;

    btn.onclick = () => {
        autoAi.enabled = !autoAi.enabled;
        btn.innerText = autoAi.enabled ? '自动AI：开' : '自动AI：关';
        btn.style.background = autoAi.enabled ? '#4CAF50' : '#999';
    };

    document.body.appendChild(btn);
})();

/* ================== 创建打分按钮 ================== */
(function() {
    var body = document.body;

    for (let i = 0; i < scores.length; i++) {
        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = String(scores[i]);
        btn.onclick = function () {
            fillscore(i);
        };
        btn.style.cssText = "height:60px;width:100px;z-index:1000;position:fixed;right:120px;";
        btn.style.bottom = (80 + 60 * (scores.length - i)) + "px";
        btn.style.border = "1px solid black";
        body.appendChild(btn);
    }

    // 作业不匹配
    let btn1 = document.createElement("input");
    btn1.type = "button";
    btn1.value = "作业不匹配";
    btn1.onclick = function () {
        str = "作业不匹配";
        dahui(str);
    };
    btn1.style.cssText = "height:60px;width:100px;z-index:1000;position:fixed;right:10px;top:140px;";
    btn1.style.border = "1px solid black";
    body.appendChild(btn1);

    // 没有成功截图
    let btn2 = document.createElement("input");
    btn2.type = "button";
    btn2.value = "没有成功截图";
    btn2.onclick = function () {
        str = "没有运行成功截图";
        dahui(str);
    };
    btn2.style.cssText = "height:60px;width:100px;z-index:1000;position:fixed;right:10px;top:200px;";
    btn2.style.border = "1px solid black";
    body.appendChild(btn2);
})();
