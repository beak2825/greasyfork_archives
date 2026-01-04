// ==UserScript==
// @name         Steam 成就 BBCode 生成器（多样式+单成就复制）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键生成 Steam 成就列表的 BBCode，多种样式可选，支持自定义样式，支持全球成就和个人成就页面，还能复制单个成就的代码！
// @author       chrisevansbian
// @match        https://steamcommunity.com/stats/*/achievements*
// @match        https://steamcommunity.com/id/*/stats/*?tab=achievements*
// @match        https://steamcommunity.com/profiles/*/stats/*?tab=achievements*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547505/Steam%20%E6%88%90%E5%B0%B1%20BBCode%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E5%A4%9A%E6%A0%B7%E5%BC%8F%2B%E5%8D%95%E6%88%90%E5%B0%B1%E5%A4%8D%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547505/Steam%20%E6%88%90%E5%B0%B1%20BBCode%20%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E5%A4%9A%E6%A0%B7%E5%BC%8F%2B%E5%8D%95%E6%88%90%E5%B0%B1%E5%A4%8D%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式模板
    const styles = {
        1: (img, title, desc) => `[table=65%,#111923][tr][td][float=left][img=64,64]${img}[/img][/float][size=3][color=#C6D4DF]${title}[/color][/size]\n[color=#8F98A0]${desc}[/color][/td][/tr][/table]`,
        2: (img, title, desc) => `[table=65%][tr][td][float=left][img=64,64]${img}[/img][/float][size=3][b]${title}[/b][/size]\n${desc}[/td][/tr][/table]`,
        3: (img, title, desc) => `[table=60%,#FFFFF0][tr][td=64][img=64,64]${img}[/img][/td][td][b][size=3][color=#000000]${title}[/color][/size][/b]\n[color=#000000]${desc}[/color][/td][/tr][/table]`,
        4: (img, title, desc) => `[table=60%][tr][td=1,2,64][img=64,64]${img}[/img][/td][td][b][size=3]${title}[/size][/b][/td][/tr]\n[tr][td]${desc}[/td][/tr][/table]`,
        5: (img, title, desc) => `[img=64,64]${img}[/img]\n${title}\n${desc}\n`,
    };

    let customStyle = "{img} {title} - {desc}";
    let currentStyle = 1;

    // 添加全局按钮
    const btn = document.createElement("button");
    btn.textContent = "复制所有成就 BBCode";
    btn.style.cssText = "position:fixed;top:80px;right:20px;z-index:9999;padding:8px;background:#171a21;color:white;border:1px solid #ccc;cursor:pointer;";
    document.body.appendChild(btn);

    // 样式选择器
    const select = document.createElement("select");
    select.innerHTML = `
        <option value="1">样式1</option>
        <option value="2">样式2</option>
        <option value="3">样式3</option>
        <option value="4">样式4</option>
        <option value="5">样式5</option>
        <option value="custom">自定义</option>
    `;
    select.style.cssText = "position:fixed;top:120px;right:20px;z-index:9999;padding:4px;";
    document.body.appendChild(select);

    // 自定义输入框
    const input = document.createElement("textarea");
    input.value = customStyle;
    input.style.cssText = `
        position:fixed;
        top:160px;
        right:20px;
        z-index:9999;
        padding:4px;
        width:300px;
        height:120px;
        display:none;
        white-space:pre;       /* 保留换行和空格 */
        font-family:monospace; /* 更适合写模板 */
    `;
    document.body.appendChild(input);

    select.addEventListener("change", () => {
        if (select.value === "custom") {
            input.style.display = "block";
            currentStyle = "custom";
        } else {
            input.style.display = "none";
            currentStyle = parseInt(select.value);
        }
    });

    btn.addEventListener("click", () => {
        const images = document.querySelectorAll("div.achieveImgHolder img");
        const text = document.querySelectorAll("div.achieveTxt");
        let table = [];

        for (let i = 0; i < images.length; i++) {
            const img = images[i].src;
            const title = text[i].children[0].innerText;
            const desc = text[i].children[1].innerText;

            if (currentStyle === "custom") {
                table.push(input.value.replace("{img}", img).replace("{title}", title).replace("{desc}", desc));
            } else {
                table.push(styles[currentStyle](img, title, desc));
            }
        }
        GM_setClipboard(table.join("\n"));
        alert("所有成就 BBCode 已复制到剪贴板！");
    });

    // 给每个成就添加「单个复制按钮」
    const achievements = document.querySelectorAll(".achieveRow");
    achievements.forEach((achieve, i) => {
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "复制BBCode";
        copyBtn.style.cssText = "margin-left:10px;padding:2px 6px;font-size:12px;cursor:pointer;";
        achieve.querySelector(".achieveTxt").appendChild(copyBtn);

        copyBtn.addEventListener("click", () => {
            const img = achieve.querySelector(".achieveImgHolder img").src;
            const title = achieve.querySelector(".achieveTxt").children[0].innerText;
            const desc = achieve.querySelector(".achieveTxt").children[1].innerText;

            let code = "";
            if (currentStyle === "custom") {
                code = input.value.replace("{img}", img).replace("{title}", title).replace("{desc}", desc);
            } else {
                code = styles[currentStyle](img, title, desc);
            }

            GM_setClipboard(code);
            alert(`成就「${title}」的 BBCode 已复制！`);
        });
    });
})();
