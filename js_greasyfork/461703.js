// ==UserScript==
// @name         叔叔不约-匿名聊天-自动点击匹配-只能在电脑上正常跑
// @namespace    https://greasyfork.org/zh-CN/scripts/461703
// @version      0.4.5
// @description  叔叔不约-匿名聊天，自动点击匹配，一直匹配到目标性别停止，解放双手（只能在电脑上正常跑）
// @author       LehiWang
// @match        http*://*.shushubuyue.net*
// @match        http*://*.shushubuyue.com*
// @icon         https://www.shushubuyue.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461703/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6-%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8C%B9%E9%85%8D-%E5%8F%AA%E8%83%BD%E5%9C%A8%E7%94%B5%E8%84%91%E4%B8%8A%E6%AD%A3%E5%B8%B8%E8%B7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/461703/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6-%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8C%B9%E9%85%8D-%E5%8F%AA%E8%83%BD%E5%9C%A8%E7%94%B5%E8%84%91%E4%B8%8A%E6%AD%A3%E5%B8%B8%E8%B7%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('error', (err) => {}, true);
    // Your code here...
    let operateBox = document.createElement("div");
    operateBox.setAttribute("style", "position: absolute;z-index: 99999;right: 0;top: 0;margin: 10px 10px 0 0;width: 180px;height: 80px;border-radius: 5px;background-color:rgba(0,0,0,.3);box-shadow: 0 0 3px;display: flex;justify-content: space-evenly;align-items: center;flex-direction: column;");
    operateBox.innerHTML = `
    <div style="height: 20px;width: 100%;font-size: 15px;color: white;display: flex;justify-content: center;align-items: baseline;">
        <input style="visibility: inherit;display: block;" type="radio" name="sex" id="0" value="女生">
        <label for="0">男</label>
        <input style="visibility: inherit;display: block;margin-left: 10px;" type="radio" name="sex" id="1" value="男生" checked>
        <label for="1">女</label>
    </div>
    <div style="height: 25px;width: 100%;display: flex;justify-content: space-evenly;">
        <button id='operateBegin' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(254,83,81);'>开始</button>
        <button id='operatePause' style='height: 25px;line-height: 25px;width: 60px;font-size: 15px;color: white;border: none;border-radius: 5px;background-color: rgb(148,148,151);'>暂停</button>
    </div>
    <span id="operateTip" style="color: white;font-size: 15px;font-weight: 400;">等待中...</span>
    `;
    document.querySelector('body').append(operateBox);

    // 业务逻辑
    let sex = document.querySelector('input[name="sex"]:checked').value;
    const begin = document.querySelector("#operateBegin");
    const pause = document.querySelector("#operatePause");
    const tip = document.querySelector("#operateTip");

    let observer;
    let timer;
    let flag = 0;

    function perf_observer(list , observer) {
        let elem = document.querySelector("#partnerInfoText") || { textContent: sex };
        if(elem.textContent.includes(sex) || elem.textContent.includes("您断开了连线")) {
            clearTimeout(timer);
            timer = setTimeout(search, 500);
            flag++;
        }else{
            pauseMatch()
        }
    }

    //点击开始匹配
    begin.addEventListener('click', beginMatch);
    //点击暂停匹配
    pause.addEventListener('click', pauseMatch);

    // 开始匹配函数
    function beginMatch() {
        flag = 0;
        observer = new PerformanceObserver(perf_observer);
        observer.observe({entryTypes: ["resource"]});
        sex = document.querySelector('input[name="sex"]:checked').value;
        search();
        document.querySelectorAll('input[name="sex"]').forEach(input => {
           input.disabled = true;
        });
    }

    // 暂停匹配函数
    function pauseMatch() {
        observer && observer.disconnect();
        clearTimeout(timer);
        timer = null;
        flag = 0;
        updateTipContent();
        document.querySelectorAll('input[name="sex"]').forEach(item => {
           item.disabled = false;
        });
        console.log("暂停", timer);
    }
    function updateTipContent() {
        const textContent = document.querySelector("#partnerInfoText") ? document.querySelector("#partnerInfoText").textContent.split("：")[1] : "等待中...";;
        if (textContent) {
            tip.innerHTML = textContent;
        } else {
            setTimeout(updateTipContent, 500);
        }
    }

    function search() {
        if(!flag && document.querySelector(".msg-input") !== null) return false;
        tip.innerHTML = "等待中...";
        const chatBtn = document.querySelector(".chat-control");
        const operate = chatBtn.textContent;

        switch (operate) {
            case "重新开始":
                chatBtn.click();
                break;
            case "离开":
                if(document.querySelector(".msg-input")) {
                    chatBtn.click();
                    document.querySelector(".actions-modal-button-bold").click();
                    chatBtn.click();
                    document.querySelector(".actions-modal-button").click();
                }else {
                    chatBtn.click();
                    chatBtn.click();
                }
                break;
            default:
                break;
        }
    }
})();