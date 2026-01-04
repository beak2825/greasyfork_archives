// ==UserScript==
// @name         N0ts 网页助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  已支持抖音视频获取，下载，随机小姐姐
// @author       N0ts
// @match        *://*/*
// @grant        none
// @require      https://unpkg.com/axios@1.7.7/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/512885/N0ts%20%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512885/N0ts%20%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let scriptConfig = null;

window.N0tsBaseURL = "https://monkey.n0ts.top";

let logsDom = null;

/**
 * 创建操作元素到页面
 */
function createDom(scriptName, btnsConfig) {
    // 防止反复加载
    if (document.querySelector(".n0ts-script")) {
        return;
    }

    // 样式
    const css = `
        .n0ts-script {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9998;
                padding: 10px;
                background: white;
                border-radius: 10px;
                transition: all 0.3s;
                max-width: 300px;
            }

            .n0ts-script-hide {
                bottom: 0;
                transform: translateY(100%);
            }

            .n0ts-hide-btn {
                position: absolute;
                left: 10px;
                top: 0;
                transform: translateY(-100%);
                color: white;
                background: rgb(90, 158, 248);
                border-radius: 5px 5px 0 0;
                padding: 5px 10px;
                font-size: 13px;
                cursor: pointer;
            }

            .n0ts-script h1 {
                font-size: 14px;
                margin-top: 0;
                margin-bottom: 5px;
            }

            .n0ts-btns {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }

            .n0ts-btn {
                display: inline-block;
                cursor: pointer;
                padding: 3px 5px;
                background: rgb(90, 158, 248);
                border-radius: 5px;
                color: white;
                font-size: 13px;
            }

            .n0ts-btn:hover {
                opacity: 0.8;
            }

            .n0ts-logs {
                font-size: 13px;
                color: gray;
                max-height: 80px;
                overflow-y: auto;
                margin-top: 5px;
            }

            .n0ts-logs p {
                margin: 0;
            }
    `;
    const cssDom = document.createElement("style");
    cssDom.innerText = css;
    document.head.append(cssDom);

    // 主体
    const mainDom = document.createElement("div");
    mainDom.setAttribute("class", "n0ts-script");

    // 收起展开
    const hideBtn = document.createElement("div");
    hideBtn.setAttribute("class", "n0ts-hide-btn");
    hideBtn.innerText = "收起";
    hideBtn.addEventListener("click", () => {
        if (mainDom.classList.contains("n0ts-script-hide")) {
            mainDom.classList.remove("n0ts-script-hide");
            hideBtn.innerText = "收起";
        } else {
            mainDom.classList.add("n0ts-script-hide");
            hideBtn.innerText = "展开";
        }
    });
    mainDom.appendChild(hideBtn);

    // 标题
    const titleDom = document.createElement("h1");
    titleDom.innerText = scriptName;
    mainDom.appendChild(titleDom);

    // 按钮插入
    const btnsDom = document.createElement("div");
    btnsDom.setAttribute("class", "n0ts-btns");
    btnsConfig.forEach((btn) => {
        const dom = document.createElement("div");
        dom.setAttribute("class", "n0ts-btn");
        dom.innerText = btn.name;
        dom.addEventListener("click", btn.click);
        btnsDom.appendChild(dom);
    });
    mainDom.appendChild(btnsDom);

    // 日志插入
    logsDom = document.createElement("div");
    logsDom.setAttribute("class", "n0ts-logs");
    mainDom.appendChild(logsDom);

    document.body.append(mainDom);
}

function log(msg) {
    console.log(msg);
    // logsDom.innerText = msg;
    const pDom = document.createElement("p");
    pDom.innerText = msg;
    logsDom.prepend(pDom);
}

async function evalScript() {
    const { data } = await axios(`${window.N0tsBaseURL}/api/script?host=${window.location.href}`, {
        method: "get"
    });
    eval(data);

    console.log("N0ts 网页助手加载成功");
}

(function () {
    evalScript();
})();
