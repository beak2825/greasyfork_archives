// ==UserScript==
// @name         PHIMG
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  在未名树洞中使用 SM.MS 图床
// @author       Guyutongxue
// @license      GPLv3
// @match        https://web.pkuhollow.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sm.ms
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      smms.app
// @downloadURL https://update.greasyfork.org/scripts/457912/PHIMG.user.js
// @updateURL https://update.greasyfork.org/scripts/457912/PHIMG.meta.js
// ==/UserScript==

const MODAL_STYLE = `
.modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
}
.modal.open {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
}
.modal-bg {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
}
.modal-container {
    border-radius: 10px;
    background: #fff;
    position: relative;
    padding: 30px;
}
.modal-close {
    position: absolute;
    right: 15px;
    top: 15px;
    outline: none;
    appearance: none;
    color: red;
    background: none;
    border: 0px;
    font-weight: bold;
    cursor: pointer;
}
#uploadFile {
    display: unset;
    margin-top: 12px;
    height: 30px;
}
`

function loadDialog() {
    GM_addStyle(MODAL_STYLE);
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "uploadImageModal";
    const background = document.createElement("div");
    background.classList.add("modal-bg");
    background.addEventListener("click", hideDialog);
    const container = document.createElement("div");
    container.classList.add("modal-container");
    container.innerHTML = `
    <h3>上传图片</h3>
    <div style="display: flex; flex-direction: column; align-items: stretch">
        <div>
            <input type="text" id="uploadToken" placeholder="请输入 Token"></td>
            <span>
                <a href="https://smms.app/home/apitoken" target="_blank" rel="noopenner">
                    生成 Token
                </a>
            </span>
        </div>
        <div>
            <input type="file" id="uploadFile" accept="image/*">
        </div>
        <button type="button" id="phimgSubmit" disabled style="margin-top: 12px">
            确定
        </button>
    </div>
    `;
    container.querySelector("#uploadFile")?.addEventListener("change", checkValid);
    container.querySelector("#uploadToken")?.addEventListener("change", checkValid);
    container.querySelector("#phimgSubmit")?.addEventListener("click", submitImage);
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("modal-close");
    closeBtn.innerHTML = "X";
    closeBtn.addEventListener("click", hideDialog);
    container.append(closeBtn);
    modal.append(background, container);
    document.body.append(modal);
}

function checkValid() {
    if (document.querySelector("#uploadFile")?.files.length
        && document.querySelector("#uploadToken")?.value) {
        document.querySelector("#phimgSubmit").removeAttribute("disabled");
    } else {
        document.querySelector("#phimgSubmit").setAttribute("disabled", "");
    }
}

async function submitImage() {
    const file = document.querySelector("#uploadFile").files[0];
    const token = document.querySelector("#uploadToken").value;
    const submit = document.querySelector("#phimgSubmit");
    const data = new FormData();
    data.append("smfile", file);
    try {
        submit.setAttribute("disabled", "");
        submit.textContent = "上传中，请稍候";
        const response = await new Promise(resolve => GM_xmlhttpRequest({
            url: "https://smms.app/api/v2/upload",
            method: "POST",
            data,
            headers: { Authorization: `basic ${token}` },
            onload: (res) => resolve(JSON.parse(res.responseText))
        }));
        console.log(response);
        if (response?.code !== "success") {
            throw new Error(response?.message);
        }
        localStorage.setItem("SMMS_TOKEN", token);
        setText(response);
    } catch (e) {
        if (e instanceof Error) {
            alert(e.message);
        } else {
            alert(`${e}`);
        }
    } finally {
        submit.removeAttribute("disabled");
        submit.textContent = "确定";
    }
}

/**
 * See [Modify React Component's State using jQuery/Plain Javascript from Chrome Extension](https://stackoverflow.com/q/41166005)
 * See https://github.com/facebook/react/issues/11488#issuecomment-347775628
 * See [How to programmatically fill input elements built with React?](https://stackoverflow.com/q/40894637)
 * See https://github.com/facebook/react/issues/10135#issuecomment-401496776
 *
 * @param {HTMLInputElement} input
 * @param {string} value
 */
function setReactInputValue(input, value) {
  const previousValue = input.value;
  input.value = value;
  const tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(previousValue);
  }
  // 'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function setText(response) {
    hideDialog();
    const textarea = document.querySelector(".sidebar textarea");
    if (textarea === null) {
        alert("未找到文本区域，请在 F12 控制台中查看提交结果。");
        return;
    }
    // console.log(textarea);
    setReactInputValue(textarea, textarea.value + `
> 请安装 [PHIMG](https://greasyfork.org/zh-CN/scripts/457912-phimg) 插件以查看图片
> 或点击 [此链接](${response.data.url})
`);
}

function replacePlaceholder() {
    const eles = [...document.querySelectorAll("blockquote")]
        .filter(e => e.textContent.includes("PHIMG"));
    for (const e of eles) {
        const url = e.querySelectorAll("a")[1]?.href;
        if (!url) continue;
        e.insertAdjacentHTML("afterend", `<p class="img">
    <img src="${url}" alt="${url}">
</p>`);
        e.remove();
    }
}

function showDialog() {
    const token = localStorage.getItem("SMMS_TOKEN");
    if (token) {
        document.querySelector("#uploadToken").value = token;
    }
    document.querySelector("#uploadImageModal")?.classList.add("open");
}

function hideDialog() {
    document.querySelector("#uploadImageModal")?.classList.remove("open");
}

(function() {
    'use strict';

    loadDialog();

    const sidebar = document.querySelector(".sidebar");
    function handler() {
        try {
            sidebar.removeEventListener("DOMNodeInserted", handler);
            const container = document.querySelector(".post-form-bar label");
            if (container === null) return;
            container.querySelector("input")?.remove();
            const button = container.querySelector(".post-upload");
            button?.addEventListener("click", showDialog);
            const text = container.querySelector(".post-upload")?.childNodes[1];
            if (text !== null) {
                text.textContent = "\u00a0上传图片\u00a0(SM.MS)";
            }
        } finally {
            sidebar.addEventListener("DOMNodeInserted", handler);
        }
    }
    sidebar.addEventListener("DOMNodeInserted", handler);
    replacePlaceholder();
    setInterval(replacePlaceholder, 1000);
})();