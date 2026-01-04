// ==UserScript==
// @name         Apipost接口文档辅助
// @namespace    阿茂一米六
// @version      1.0
// @description  解析接口文档生成需要的内容
// @author       阿茂一米六
// @license      MIT
// @match        https://console-docs.apipost.cn/preview/*
// @icon         https://console-docs.apipost.cn/favicon.ico
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498147/Apipost%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/498147/Apipost%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /** 上一个页面的URL */
    let prevUrl = "";

    setInterval(() => {
        // 防止重复处理
        if (location.href === prevUrl) return;
        prevUrl = location.href;

        handleGetApiParams();
    }, 1000);

    /**
     * 处理获取接口的参数内容，添加一键复制 JSDoc、JSON 对象
     */
    function handleGetApiParams() {
        // 获取接口文档dom
        const docsContent = document.querySelector(".docs-content");

        /** 最终拼接成 JSDoc 的数组 */
        const JSDoc = ["/**"];
        /** 参数对象 */
        const paramsObj = {};

        // 处理接口名称
        const apiName = docsContent.querySelector(".apipost-head-name").textContent;
        JSDoc.push(` * ${apiName}`);

        // 处理接口参数，默认都是对象
        JSDoc.push(" * @param {object} params 请求参数");

        // 处理具体参数
        docsContent
            .querySelector("table")
            .querySelectorAll("tr")
            .forEach((tr) => {
                const cellsContents = [...tr.querySelectorAll("td")].map((td) => td.textContent);

                // 获取不到单元格内容，则跳出（可以排除表头行）
                if (!cellsContents.length) return;

                const name = cellsContents[0];
                const type = cellsContents[3].toLowerCase();
                const description = cellsContents[4];

                // 处理某个参数的具体描述
                JSDoc.push(` * @param {${type}} params.${name} ${description}`);

                // 保存到参数对象中
                paramsObj[name] = "";
            });

        // 加一个注释收尾
        JSDoc.push(" */");

        // 输出结果
        const obj = {
            JSDoc: JSDoc.join("\n"),
            paramsObj,
        };
        console.log(`${apiName}接口：`, obj);

        // 添加复制按钮
        const wrap = document.querySelectorAll(".apipost-doc-wrap-para-title")[1];
        wrap.querySelectorAll(".copy-btn").forEach((btn) => btn.remove());
        wrap.appendChild(createCopyButton("复制 JSDoc", obj.JSDoc));
        wrap.appendChild(createCopyButton("复制 JSON", obj.paramsObj, "#27ae60"));

        // 初始化复制功能
        new ClipboardJS(".copy-btn");
    }

    /**
     * 创建一个复制按钮
     * @param {string} btnText 按钮文字
     * @param {string} copyData 复制的内容
     * @param {string} btnColor 按钮颜色，默认："#39f"
     */
    function createCopyButton(btnText, copyData, btnColor = "#39f") {
        const btn = document.createElement("button");

        btn.className = "copy-btn";

        btn.style.backgroundColor = btnColor;
        btn.style.color = "#fff";
        btn.style.borderRadius = "4px";
        btn.style.marginLeft = "12px";
        btn.style.border = "none";
        btn.style.fontSize = "12px";
        btn.style.padding = "2px 8px";
        btn.style.transition = "all 0.1s";

        btn.innerText = btnText;
        btn.setAttribute(
            "data-clipboard-text",
            typeof copyData === "object" ? JSON.stringify(copyData) : copyData
        );

        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.94)";
        });
        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });

        return btn;
    }
})();
