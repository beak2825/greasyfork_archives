// ==UserScript==
// @name         洛谷提交记录显示优化
// @namespace    https://github.com/chenyuxuan2009/luogu_submission_better
// @version      2.19
// @description  修改提交记录背景
// @author       沉石鱼惊旋
// @match        *://www.luogu.com.cn/record/*
// @match        *://www.luogu.com.cn
// @match        *://www.luogu.com.cn/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530997/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530997/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let opacity = localStorage.getItem("opacity") || 0.3;
let replaceSidebarStatus = localStorage.getItem("replaceSidebarStatus") || "1";
const jsdelivrOptions = [
    'https://cdn.jsdelivr.net',
    'https://jsdelivrcn.netlify.app',
    'https://cdn.mengze.vip',
    'https://cdn.bili33.top',
    'https://www.jsdmirror.com',
];
const themeOptions = [
    'nailoong',
    'andy',
    'qqemoji',
    'qqsuperemoji',
    'mixed1',
    'theresa'
];
const themeLabels = {
    "nailoong": "奶龙",
    "andy": "安梦梦",
    "qqemoji": "QQ 大表情",
    "qqsuperemoji": "QQ 超级表情",
    "mixed1": "混搭 1",
    "theresa": "特蕾西娅"
};
const themeTypes = {
    "nailoong": "gif",
    "andy": "gif",
    "qqemoji": "gif",
    "qqsuperemoji": "gif",
    "mixed1": "gif",
    "theresa": "png"
};
let jsdelivr = localStorage.getItem("jsdelivr") || 'https://cdn.jsdelivr.net';
let theme = localStorage.getItem("theme") || 'nailoong';
function getImage(theme, x) {
    return themeOptions.includes(theme) ?
        `${jsdelivr}/gh/chenyuxuan2009/luogu_submission_better/theme/${theme}/${x}.${themeTypes[theme]}` :
        localStorage.getItem(`${x}`);
}
let statusKeys = [
    "AC", "WA", "TLE", "MLE", "RE",
    "OLE", "UKE", "Judging", "CE", "Waiting", "Unshown"
];

let statusLabels = {
    "AC": "AC 图片 URL",
    "WA": "WA 图片 URL",
    "TLE": "TLE 图片 URL",
    "MLE": "MLE 图片 URL",
    "RE": "RE 图片 URL",
    "OLE": "OLE 图片 URL",
    "UKE": "UKE 图片 URL",
    "Judging": "Judging 图片 URL",
    "CE": "CE 图片 URL",
    "Waiting": "Waiting 图片 URL",
    "Unshown": "Unshown 图片 URL"
};
let AC = getImage(theme, 'AC');
let WA = getImage(theme, 'WA');
let TLE = getImage(theme, 'TLE');
let MLE = getImage(theme, 'MLE');
let RE = getImage(theme, 'RE');
let OLE = getImage(theme, 'OLE');
let UKE = getImage(theme, 'UKE');
let Judging = getImage(theme, 'Judging');
let CE = getImage(theme, 'CE');
let Waiting = getImage(theme, 'Waiting');
let Unshown = getImage(theme, 'Unshown');
let ACcol = `rgba(82, 196, 26, ${opacity})`;
let WAcol = `rgba(231, 76, 60, ${opacity})`;
let TLEcol = `rgba(5, 34, 66, ${opacity})`;
let MLEcol = `rgba(5, 34, 66, ${opacity})`;
let REcol = `rgba(157, 61, 207, ${opacity})`;
let OLEcol = `rgba(5, 34, 66, ${opacity})`;
let UKEcol = `rgba(14, 29, 105, ${opacity})`;
let Judgingcol = `rgba(20, 85, 143, ${opacity})`;
let CEcol = `rgba(250, 219, 20, ${opacity})`;
let Waitingcol = `rgba(20, 85, 143, ${opacity})`;
let Unshowncol = `rgba(38, 38, 38, ${opacity})`;
let sta = [AC, WA, TLE, MLE, RE, OLE, UKE, Judging, CE, Waiting, Unshown];
let col = [ACcol, WAcol, TLEcol, MLEcol, REcol, OLEcol, UKEcol, Judgingcol, CEcol, Waitingcol, Unshowncol];
let txt = ["AC", "WA", "TLE", "MLE", "RE", "OLE", "UKE", "Judging", "CE", "WJ", "US"];
function getCol(x) {
    return `background: linear-gradient(${col[x]}, ${col[x]}), url('${sta[x]}'); background-size: cover;`;
}
function subBetter() {
    let tc = document.getElementsByClassName('test-case');
    let len = tc.length;
    let firstSTA = -1;
    let ac = 0;
    let judging = 0;
    for (let i = 0; i < len; i += 1) {
        if (tc[i].id === 'luogu_submission_better_right_row') continue;
        if (tc[i].innerHTML.includes('spinner')) {
            judging = 1;
            tc[i].style = getCol(7);
            continue;
        }
        if (!tc[i].getElementsByClassName('status')[0]) continue;
        let status = tc[i].getElementsByClassName('status')[0].innerHTML;
        if (status.length > 2) status = status.substring(0, 2);
        let tmpSTA = -1;
        if (status === "AC") {
            tmpSTA = 0;
        } else if (status === "WA") {
            tmpSTA = 1;
        } else if (status === "TL") {
            tmpSTA = 2;
        } else if (status === "ML") {
            tmpSTA = 3;
        } else if (status === "RE") {
            tmpSTA = 4;
        } else if (status === "OL") {
            tmpSTA = 5;
        } else if (status === "UK") {
            tmpSTA = 6;
        }
        tc[i].style = getCol(tmpSTA);
        if (tmpSTA === 0) {
            ac = 1;
        }
        if (tmpSTA != 0 && firstSTA === -1) {
            firstSTA = tmpSTA;
        }
    }
    if (judging) firstSTA = 7;
    if (firstSTA === -1 && ac) firstSTA = 0;
    if (replaceSidebarStatus === "1") {
        let doc = document.querySelector('div.info-rows');
        let id = -1;
        if (!doc) return;
        for (let i = 0; i < doc.children.length; i += 1) {
            if (doc.children[i].children[0].children[0].innerHTML.includes('评测状态')) {
                id = i;
                break;
            }
        }
        let info = document.getElementsByClassName('info-rows')[0].children[id].children[1];;
        if (info.innerText.includes('Judging')) firstSTA = 7;
        if (info.innerText.includes('Compile Error')) firstSTA = 8;
        if (info.innerText.includes('Unknown Error')) firstSTA = 6;
        if (info.innerText.includes('Waiting')) firstSTA = 9;
        if (info.innerText.includes('Unshown')) firstSTA = 10;
        if (firstSTA === -1) return;
        // info.innerHTML = `${firstSTA}`;
        // info.innerHTML = `${txt[firstSTA]}`;
        // return;
        if (firstSTA == 7) {
            if (!info.innerHTML.includes('spinner')) {
                info.innerHTML = `<div data-v-21e0a7cc="" class="test-case" style="${getCol(firstSTA)}" id="luogu_submission_better_right_row"><div data-v-21e0a7cc="" class="content"><div data-v-bbdab89a="" data-v-21e0a7cc="" class="spinner" style="width: 32px; height: 32px;"><div data-v-bbdab89a="" style="width: 32px; height: 32px; border-width: 2px;"></div></div></div></div>`
            }
        }
        else {
            if (!info.innerText.includes(txt[firstSTA])) {
                info.innerHTML = `<div data-v-21e0a7cc="" class="test-case" style="${getCol(firstSTA)}" id="luogu_submission_better_right_row"><div data-v-21e0a7cc="" class="content"><div data-v-21e0a7cc="" class="status">${txt[firstSTA]}</div></div> </div>`;
            }
        }
    }
}
function addButton() {
    function createSettingsPopup() {
        // 如果已经存在弹窗，避免重复创建
        if (document.getElementById('settingsPopup')) return;

        // 创建悬浮窗口
        let popup = document.createElement("div");
        popup.id = "settingsPopup";
        popup.innerHTML = `
            <div class="popup-header">
                <span>插件设置</span>
                <button id="closePopup">✖</button>
            </div>
            <p>调整纯色背景的透明度：</p>
            <input type="number" id="opacityInput" min="0" max="1" step="0.1" value="${localStorage.getItem("opacity") || 0.3}">
            <button id="saveOpacity">保存透明度设置</button>
            <p>选择 jsdelivr 源服务器：<br>（只适用官方主题）</p>
            <select id="jsdelivrSelect">
                ${jsdelivrOptions.map(option => `<option value="${option}" ${option === jsdelivr ? 'selected' : ''}>${option}</option>`).join('')}
                ${`<option value="custom" ${!jsdelivrOptions.includes(jsdelivr) ? 'selected' : ''}>自定义</option>`}            
            </select >
            <input type="text" id="customJsdelivr" placeholder="输入自定义地址" ${!jsdelivrOptions.includes(jsdelivr) ? `value='${jsdelivr}' style="display:block;" ` : `style="display:none;"`}>
            <button id="saveJsdelivr">保存 jsdelivr 设置</button>

            <p>选择主题：</p>
            <select id="themeSelect">
                ${themeOptions.map(option => `<option value="${option}" ${option === theme ? 'selected' : ''}>${option}（${themeLabels[option]}）（${themeTypes[option] == 'gif' ? '动图' : '静图'}）</option>`).join('')}
                ${`<option value="custom" ${!themeOptions.includes(theme) ? 'selected' : ''}>自定义</option>`}
            </select>

            <div id="customThemeInputs" style="display: ${!themeOptions.includes(theme) ? 'block' : 'none'};">
                ${statusKeys.map(key => `
                    <input type="text" id="${key}" placeholder="输入 ${statusLabels[key]}" value="${localStorage.getItem(key) || getImage(theme, key)}">
                `).join('')}
            </div>

            <button id="saveTheme">保存主题设置</button>

            <p>替换右侧栏评测状态：</p>
            <select id="replaceSidebarStatus">
                <option value="1" ${replaceSidebarStatus === "1" ? "selected" : ""}>是</option>
                <option value="0" ${replaceSidebarStatus === "0" ? "selected" : ""}>否</option>
            </select>
            <button id="saveReplaceSidebarStatus">保存状态设置</button>
            `;

        // 添加样式
        let style = document.createElement("style");
        style.innerHTML = `
#settingsPopup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 9999;
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
    max-height: 80vh;  /* 限制最大高度为 80% 视口高度 */
    overflow-y: auto;  /* 内容超出时可滚动 */
}

#settingsPopup .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    padding-bottom: 8px;
    margin-bottom: 10px;
}
#settingsPopup #closePopup {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
}

#settingsPopup input, select {
    width: 100%;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    text-align: center;
}

#settingsPopup button:not(.popup-header button) {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
}

#settingsPopup button:not(.popup-header button):hover {
    background: #0056b3;
}
`;

        document.body.appendChild(style);
        document.body.appendChild(popup);

        // 事件监听
        document.getElementById("saveOpacity").addEventListener("click", function () {
            let opacity = document.getElementById("opacityInput").value;
            if (opacity < 0 || opacity > 1 || opacity === "") {
                alert("请输入 0~1 之间的数");
                return;
            }
            localStorage.setItem("opacity", opacity);
            alert(`设置已保存：透明度 = ${opacity}`);
        });
        document.getElementById("jsdelivrSelect").addEventListener("change", function () {
            let customInput = document.getElementById("customJsdelivr");
            customInput.style.display = this.value === "custom" ? "block" : "none";
        });

        document.getElementById("saveJsdelivr").addEventListener("click", function () {
            let selected = document.getElementById("jsdelivrSelect").value;
            let newJsdelivr = selected === "custom" ? document.getElementById("customJsdelivr").value : selected;
            if (!newJsdelivr) {
                alert("请输入有效的 jsdelivr 地址");
                return;
            }
            localStorage.setItem("jsdelivr", newJsdelivr);
            alert(`设置已保存：jsdelivr 源 = ${newJsdelivr}`);
        });

        document.getElementById("themeSelect").addEventListener("change", function () {
            document.getElementById("customThemeInputs").style.display = this.value === "custom" ? "block" : "none";
        });

        document.getElementById("saveTheme").addEventListener("click", function () {
            let selected = document.getElementById("themeSelect").value;
            let newTheme = selected === "custom" ? "custom" : selected;

            if (newTheme === "custom") {
                let missingFields = statusKeys.filter(key => !document.getElementById(key).value.trim());
                if (missingFields.length > 0) {
                    alert("请填写所有图片的完整 URL！");
                    return;
                }

                statusKeys.forEach(key => localStorage.setItem(key, document.getElementById(key).value.trim()));
            }

            localStorage.setItem("theme", newTheme);
            alert(`设置已保存：主题 = ${newTheme === "custom" ? "自定义" : newTheme + '（' + themeLabels[newTheme] + '）'}`);
        });

        document.getElementById("saveReplaceSidebarStatus").addEventListener("click", function () {
            let value = document.getElementById("replaceSidebarStatus").value;
            localStorage.setItem("replaceSidebarStatus", value);
            alert(`设置已保存：${value === "1" ? "替换" : "不替换"} 右侧栏评测状态`);
        });

        document.getElementById("closePopup").addEventListener("click", function () {
            document.body.removeChild(popup);
        });
    }

    // 绑定点击事件，打开悬浮框
    let sidebar = document.querySelector(".nav-group.on-expand ul");
    if (!sidebar) return;
    sidebar.insertAdjacentHTML("beforeend", `
            <li data-v-40281d0d="" data-v-6c9e83f4="" title="插件设置">
                <a data-v-12b24cc3="" data-v-40281d0d="" href="#" class="" disabled="false" id="pluginSettingsBtn">
                    <span data-v-40281d0d="" class="title minor">插件设置</span>
                </a>
            </li>
            `);

    document.getElementById("pluginSettingsBtn").addEventListener("click", function (event) {
        event.preventDefault();
        createSettingsPopup();
    });
}
(function () {
    'use strict';
    if (/^https:\/\/www\.luogu\.com\.cn\/record\/\d+$/.test(window.location.href)) {
        setInterval(function () {
            subBetter();
        }, 10);
    }
    setTimeout(function () {
        addButton();
    }, 1000);
})();