// ==UserScript==
// @name         洛谷 - 梦回考场
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  洛谷题目页面改为NOI/NOIP/CSP经典PDF风格，享受沉浸（致郁）式刷题。
// @author       Jerrycyx (Luogu UID 545986)
// @match        https://www.luogu.com.cn/problem/*
// @license      MPL-2.0
// @grant        GM_addStyle
// @require      https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @downloadURL https://update.greasyfork.org/scripts/543195/%E6%B4%9B%E8%B0%B7%20-%20%E6%A2%A6%E5%9B%9E%E8%80%83%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543195/%E6%B4%9B%E8%B0%B7%20-%20%E6%A2%A6%E5%9B%9E%E8%80%83%E5%9C%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (CheckUrl()) {
        console.log("[Luogu-RER] URL passed");
        MainScript();
    }

    function CheckUrl() {
        const path = window.location.pathname;
        const validPrefixes = ["P", "B", "CF", "SP", "AT", "UVA", "T", "U"];
        const regex = /^\/problem\/([^/]+)$/;
        const match = path.match(regex);
        if (!match) return false;
        if (!validPrefixes.some(prefix => match[1].startsWith(prefix))) return false;
        return true;
    }

    async function MainScript() {
        console.log("[Luogu-RER] MainScript Running.");
        const mainElement = await elmGetter.get("#app > .main-container");
        mainElement.classList.add("main-element");
        mainElement.id = "Main-element";
        const [oringinalProblemHeader, oringinalSidebar, problemElement] = await elmGetter.get([
            ".theme-bg:nth-child(1) > .theme-fg > .columba-content-wrap.header-layout",
            "main > .columba-content-wrap > .sidebar-container > .side",
            "main > .columba-content-wrap > .sidebar-container > .main > .problem"
        ], mainElement);
        problemElement.classList.add("problem-element");
        problemElement.id = "Problem-element";

        (async function () {
            removeSome(1, "#app > nav");
            removeSome(1, "#app > .top-bar");
            removeSome(1, "#app > .page-loading");
            removeSome(1, "#app > .nav-scrollbar");

            GlobalStyles();
            ProcessStrong();
            ProcessA();
            ProcessTable();

            ProcessSampleBlocks()
                .then(() => removeAll(".io-sample > .io-sample-block button.lform-size-small", problemElement));

            ProcessCodeBlocks()
                .then(() => {
                    removeAll(".code-container > button.copy-button", problemElement);
                    removeAll(".line-numbers-rows", problemElement);
                });

            ProcessTitles()
                .then(ProcessImages);

            BuildToolbar()
                .then(() => {
                    removeSome(1, ".problem-block-actions", problemElement);
                    oringinalSidebar.remove();
                });

            BuildStat()
                .then(BuildHeader)
                .then(() => removeSome(2, ".theme-bg", mainElement));
        })();

        async function GlobalStyles() {
            console.log("[Luogu-RER] GlobalStyles Running.");

            elmGetter.each("#Problem-element p, #Problem-element ul, #Problem-element ol, #Problem-element .attachments", problemElement, e => {
                e.classList.add("custom-common-text");
            });
            GM_addStyle(`
                #Problem-element {
                    --common-font-family: KaTeX_Main, SimSun, serif;
                    --strong-font-family: KaTeX_Main, SimHei, sans-serif;
                }
                .custom-common-text {
                    font-family: var(--common-font-family);
                    font-weight: normal;
                }
                .custom-strong-text {
                    font-family: var(--strong-font-family);
                    font-weight: normal;
                }
            `);

            GM_addStyle(`
                #Main-element {
                    margin: 12px 0;
                    width: auto;
                }
                #Main-element > main {
                    background-color: unset;
                }
                @media (prefers-color-scheme: light) {
                    body {
                        background-color: #e6e6e6;
                    }
                }
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #333333;
                    }
                }
                #Main-element > main > .columba-content-wrap {
                    padding: 0px;
                }
                #Main-element > main > .columba-content-wrap > .sidebar-container {
                    margin: unset;
                }
                #Problem-element {
                    color: black;
                    width: 100%
                    max-width: 1191px;
                    margin: 0 auto;
                    padding: 77px 141px 156px 141px;
                    border-radius: 0px;
                    box-shadow: 0 1px 10px 0px #1a1a1a1a;
                }

                #Problem-element p:not(li > p) {
                    text-indent: 2em;
                }
                #Problem-element p, #Problem-element ul, #Problem-element ol, #Problem-element .attachments {
                    font-size: 24px;
                    line-height: 1.6;
                    margin: unset;
                }
                #Problem-element ul, #Problem-element ol {
                    margin-left: 1em;
                }
                #Problem-element :is(ul, ol) :is(ul, ol) {
                    margin-left: unset;
                }
                #Problem-element :is(ul, ol) :is(ul, ol) li::marker {
                    content: "–  ";
                }

                .katex:not(.katex-display .katex) {
                    font-size: 1em;
                }

                #Problem-element ::selection{
                    background-color: #99c1da; //TODO
                    mix-blend-mode: multiply;
                    color: inherit;
                }

                #Problem-element :focus-visible {
                    outline: 3px dashed black;
                }
            `);
        }

        async function ProcessSampleBlocks() {
            console.log("[Luogu-RER] ProcessSampleBlocks Running.");

            elmGetter.each("h2.lfe-h2", problemElement, h2 => {
                if (h2.textContent.trim() === "输入输出样例") { h2.remove(); }
            });

            elmGetter.each(".io-sample > .io-sample-block b", problemElement, b => {
                const content = b.textContent.trim();
                const regex = /^(输入|输出)\s*#(\d+)$/;
                const match = content.match(regex);
                if (match) {
                    const type = match[1];
                    const num = match[2];
                    const h2 = document.createElement("h2");
                    h2.classList.add("lfe-h2");
                    h2.textContent = `样例 ${num} ${type}`;
                    b.parentNode.parentNode.replaceChild(h2, b.parentNode);

                }
            });
        }

        async function ProcessCodeBlocks() {
            console.log("[Luogu-RER] ProcessCodeBlocks Running.");

            async function ProcessSingleCodeBlocks(e) {
                e.classList.add("code-block");
                var lines = e.textContent.split("\n");
                const fragment = document.createDocumentFragment();
                lines.forEach((lineText, idx) => {
                    const lineContainer = document.createElement("div");
                    lineContainer.classList.add("custom-code-line");
                    const lineNumber = document.createElement("span");
                    lineNumber.classList.add("custom-line-number");
                    lineNumber.textContent = idx + 1;
                    const contentSpan = document.createElement("span");
                    contentSpan.classList.add("custom-code-content");
                    contentSpan.textContent = lineText === "" ? "\u200B" : lineText;
                    lineContainer.appendChild(lineNumber);
                    lineContainer.appendChild(contentSpan);
                    fragment.appendChild(lineContainer);
                });
                e.innerHTML = "";
                e.appendChild(fragment);
            }

            elmGetter.each(".io-sample-block pre", problemElement, ProcessSingleCodeBlocks);
            //elmGetter.each("pre > code[class^='language-'], pre > code[class*=' language-']", problemElement, ProcessSingleCodeBlocks);

            GM_addStyle(`
                #Problem-element > .lfe-marked-wrap {
                    overflow: visible;
                }

                #Problem-element > .io-sample {
                    margin: 0px;
                    display: block;
                }
                #Problem-element > .io-sample > .io-sample-block {
                    margin: 0px;
                }

                #Problem-element pre, #Problem-element code, .custom-pre-line-number {
                    font-family: Consolas !important; /* SB Luogu don't use that f**king "!important" */
                    background-color: unset;
                }
                #Problem-element pre, #Problem-element code {
                    font-size: 24px;
                    line-height: 1.5;
                }
                #Problem-element pre {
                    margin: 27px -5px 62px 17px;
                }
                .code-block {
                    position: relative;
                    overflow: visible;
                }

                #Problem-element .custom-line-number {
                    position: absolute;
                    text-align: right;
                    right: 100%;
                    font-size: 20px;
                    color: #949494;
                    padding-right: 14px;
                    padding-top: 4px;
                }

                #Problem-element code {
                    border: none;
                }
                #Problem-element pre {
                    border: solid 1px blue;
                    border-radius: 0;
                    padding: 5px;
                }
            `);
        }

        async function ProcessTitles() {
            console.log("[Luogu-RER] ProcessTitles Running.");

            elmGetter.each("h1, h2, h3, h4, h5, h6", problemElement, h => {
                h.classList.add("H123456", "custom-strong-text");
                if (!h.classList.contains("custom-title")) {
                    const text = h.textContent;
                    if (text.length > 0) {
                        if (text[0] !== "【") {
                            h.insertBefore(document.createTextNode("【"), h.firstChild);
                        }
                        if (text[text.length - 1] !== "】") {
                            h.appendChild(document.createTextNode("】"));
                        }
                    }
                }
            });

            GM_addStyle(`
                .custom-title {
                    text-align: center;
                }
                .H123456 {
                    font-weight: normal;
                }
                #Problem-element .H123456:not(.custom-title) {
                    text-indent: 1em;
                }
                #Problem-element h1 {
                    font-size: 36px;
                    margin: 37px 0px;
                    border-bottom: unset;
                    padding-bottom: unset;
                }
                #Problem-element h2 {
                    margin-top: 43px;
                    margin-bottom: 18px;
                    font-size: 26px;
                    border-bottom: unset;
                    padding-bottom: unset;
                }
                #Problem-element > p.problem-block-actions:not(#problem-element :first-child) {
                    margin-top: 43px;
                    margin-bottom: 18px;
                }
                #Problem-element h3 {
                    margin-top: 24px;
                    margin-bottom: 7px;
                    font-size: 25px;
                }
                #Problem-element h4, #Problem-element h5, #Problem-element h6 {
                    margin-top: 10px;
                    margin-bottom: 7px;
                    font-size: 24px;
                }
            `);
        }

        async function ProcessImages() {
            console.log("[Luogu-RER] ProcessImages Running.");

            elmGetter.each("p, .H123456", problemElement, e => {
                function isValidChainImage(e) {
                    if (e.tagName === 'IMG') return true;
                    let current = e;
                    while (current) {
                        const childNodes = current.childNodes;
                        if (childNodes.length !== 1 || childNodes[0].nodeType !== 1) {
                            return false;
                        }
                        current = current.firstElementChild;
                        if (current && current.tagName === 'IMG') {
                            return true;
                        }
                    }
                }
                if (isValidChainImage(e)) e.classList.add("single-line-image");
            });

            GM_addStyle(`
                .single-line-image {
                    text-indent: 0 !important;
                    text-align: center;
                }
            `)
        }

        async function ProcessStrong() {
            console.log("[Luogu-RER] ProcessStrong Running.");

            elmGetter.each("strong", problemElement, strong => {
                strong.classList.add("custom-strong-text");
                const fragment = document.createDocumentFragment();
                const processNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent;
                        const segments = text.split(/([\u4e00-\u9fa5])/);
                        segments.forEach(segment => {
                            if (!segment) return;

                            if (/^[\u4e00-\u9fa5]$/.test(segment)) {
                                const span = document.createElement("span");
                                span.classList.add("custom-hanzi-dot");
                                span.textContent = segment;

                                const svgNS = "http://www.w3.org/2000/svg";
                                const svg = document.createElementNS(svgNS, "svg");
                                svg.setAttribute("class", "custom-dot");
                                svg.setAttribute("viewBox", "0 0 10 10");

                                const circle = document.createElementNS(svgNS, "circle");
                                circle.setAttribute("cx", "5");
                                circle.setAttribute("cy", "5");
                                circle.setAttribute("r", "3");
                                circle.setAttribute("fill", "black");

                                svg.appendChild(circle);
                                span.appendChild(svg);
                                fragment.appendChild(span);
                            } else {
                                fragment.appendChild(document.createTextNode(segment));
                            }
                        });
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        fragment.appendChild(node.cloneNode(true));
                    }
                };
                strong.childNodes.forEach(node => processNode(node));
                strong.innerHTML = "";
                strong.appendChild(fragment);
            });

            GM_addStyle(`
                .custom-hanzi-dot {
                    position: relative;
                }
                .custom-hanzi-dot svg.custom-dot {
                    height: 0.16em;
                    position: absolute;
                    left: 0.5em;
                    bottom: -0.05em;
                    transform: translateX(-50%);
                    pointer-events: none;
                }
            `);
        }

        async function ProcessA() {
            console.log("[Luogu-RER] ProcessA Running.");

            elmGetter.each("a", problemElement, e => {
                e.classList.add("custom-strong-text");
            });

            GM_addStyle(`
                #Problem-element a {
                    color: black;
                    font-style: italic;
                    transition: unset;
                }
                #Problem-element a:hover {
                    filter: none;
                }
            `)
        }

        async function ProcessTable() {
            console.log("[Luogu-RER] ProcessTable Running.");

            elmGetter.each("table > thead > tr > th, table > tbody > tr > td", problemElement, e => {
                e.classList.add("custom-common-text");
            });

            GM_addStyle(`
                #Problem-element table {
                    display: table;
                    margin: 25px auto;
                    width: fit-content;
                }

                #Problem-element table > thead > tr {
                    border-bottom: 3px solid black;
                }
                #Problem-element table > thead > tr > th, #Problem-element table > tbody > tr > td {
                    font-size: 24px;
                    border: 1px solid black;
                }
                #Problem-element table {
                    border-top: 4px solid black;
                    border-bottom: 4px solid black;
                    border-left: 2px solid white;
                    border-right: 2px solid white;
                }
            `)
        }

        async function BuildToolbar() {
            GM_addStyle(`
                @media (prefers-color-scheme: light) {
                    #Custom-toolbar {
                        --toolbar-bg: #f7f7f7;
                        --toolbar-border: #bebebe;
                        --toolbar-text: #262626;
                        --toolbar-button-on: #e5e5e5;
                        --toolbar-button-on-bottom: #0072c9;
                        --toolbar-button-hover: #eaeaea;
                        --toolbar-button-active: #efefef;
                        --toolbar-separator-color: #b6b6b6;
                        --toolbar-shadow: 0px 4.8px 10.8px rgba(0,0,0,0.13), 0px 0px 4.7px rgba(0,0,0,0.11);
                    }
                    #Custom-toolbar-setting {
                        --setting-menu-bg: #ffffff;
                        --setting-item-hover: #ebebeb;
                        --setting-menu-hr: #e0e0e0
                    }
                }
                @media (prefers-color-scheme: dark) {
                    #Custom-toolbar {
                        --toolbar-bg: #3b3b3b;
                        --toolbar-border: #4f4f4f;
                        --toolbar-text: #ffffff;
                        --toolbar-button-on: #4d4d4d;
                        --toolbar-button-on-bottom: #63ade5;
                        --toolbar-button-hover: #484848;
                        --toolbar-button-active: #424242;
                        --toolbar-separator-color: #737373;
                        --toolbar-shadow: rgba(0, 0, 0, 0.26) 0px 4.8px 10.8px, rgba(0, 0, 0, 0.22) 0px 0px 4.7px;
                    }
                    #Custom-toolbar-setting {
                        --setting-menu-bg: #292929;
                        --setting-item-hover: #313131;
                        --setting-menu-hr: #545454;
                    }
                }
            `)

            console.log("[Luogu-RER] BuildToolbar Running.");

            const toolbar = document.createElement("div");
            toolbar.id = "Custom-toolbar";
            toolbar.classList.add("custom-toolbar");

            const toolbarLeft = document.createElement("div");
            toolbarLeft.id = "Custom-toolbar-left";
            toolbarLeft.classList.add("custom-toolbar-left");

            const toolbarCenter = document.createElement("div");
            toolbarCenter.id = "Custom-toolbar-center";
            toolbarCenter.classList.add("custom-toolbar-center");

            const toolbarRight = document.createElement("div");
            toolbarRight.id = "Custom-toolbar-right";
            toolbarRight.classList.add("custom-toolbar-right");

            toolbar.append(toolbarLeft, toolbarCenter, toolbarRight);
            const documentApp = document.querySelector("#app");
            documentApp.insertBefore(toolbar, documentApp.firstChild);


            function RemoveAllVueDataAttributes(e) {
                Array.from(e.attributes).forEach(attr => {
                    if (attr.name.startsWith('data-v-')) {
                        e.removeAttribute(attr.name);
                    }
                });
            }
            function removeAllAttributes(e) {
                [...e.attributes].forEach(attr => e.removeAttribute(attr.name));
            }

            async function InitToolbarLeftLargeButton(selector, parent, id, stateUpdater) {
                const button = parent.querySelector(selector);
                removeAllAttributes(button);
                button.classList.add("custom-toolbar-button", "custom-toolbar-button-large");
                button.id = id;
                toolbarLeft.appendChild(button);
                if (stateUpdater) stateUpdater(button);
                return button;
            }

            const submitButton = await InitToolbarLeftLargeButton(
                "div > div > button[type='button']",
                oringinalProblemHeader,
                "Custom-toolbar-submit",
                btn => btn.classList.toggle(
                    "custom-toolbar-button-on",
                    window.location.hash === "#submit"
                )
            );
            new MutationObserver(() => submitButton.classList.toggle(
                "custom-toolbar-button-on",
                window.location.hash === "#submit"
            )).observe(document, { subtree: true, childList: true });

            const leftSeparator1 = document.createElement("div");
            leftSeparator1.classList.add("custom-toolbar-separator");
            toolbarLeft.appendChild(leftSeparator1);

            async function BuildModalButton(id, modalIndex) {
                const button = await InitToolbarLeftLargeButton(
                    "div > div > button[type='button']",
                    oringinalProblemHeader,
                    id
                );
                const modal = document.querySelectorAll("#app > div.modal")[modalIndex];
                const updateState = () => button.classList.toggle(
                    "custom-toolbar-button-on",
                    !modal.classList.contains("hide")
                );
                updateState();
                new MutationObserver(updateState).observe(modal, {
                    attributes: true,
                    attributeFilter: ["class"]
                });
                return button;
            }
            await BuildModalButton("Custom-toolbar-add-list", 0);
            await BuildModalButton("Custom-toolbar-copy-problem", 1);

            const leftSeparator2 = document.createElement("div");
            leftSeparator2.classList.add("custom-toolbar-separator");
            toolbarLeft.appendChild(leftSeparator2);

            problemElement.querySelectorAll(".problem-block-actions > *").forEach(actionButton => {
                const text = actionButton.textContent.trim();
                if (text != "展开" && text != "进入 IDE 模式" && text != "显示翻译" && text != "隐藏翻译") {
                    removeAllAttributes(actionButton);
                    actionButton.className = "custom-toolbar-a";
                    toolbarLeft.appendChild(actionButton);
                }
                if (text == "显示翻译" || text == "隐藏翻译") {

                }
            });


            const rightActionMap = {
                "退出比赛模式": { id: "Custom-toolbar-a-exit" },
                " 提交记录": { id: "Custom-toolbar-a-record" },
                " 查看题解": { id: "Custom-toolbar-a-solution" },
                " 题目反馈": { id: "Custom-toolbar-a-feedback" }
            };
            oringinalSidebar.querySelectorAll("div a").forEach(e => {
                RemoveAllVueDataAttributes(e);
                e.classList.add("custom-toolbar-a");
                const config = rightActionMap[e.textContent];
                if (config) {
                    e.id = config.id;
                    toolbarRight.appendChild(e);
                }
            });


            const rightSeparator1 = document.createElement("div");
            rightSeparator1.classList.add("custom-toolbar-separator");
            toolbarRight.appendChild(rightSeparator1);

            const setting = document.createElement("div");
            setting.id = "Custom-toolbar-setting";
            setting.classList.add("custom-toolbar-setting");
            toolbarRight.appendChild(setting);

            const settingButton = document.createElement("button");
            settingButton.id = "Custom-toolbar-setting-button";
            settingButton.classList.add("custom-toolbar-setting-button", "custom-toolbar-button");
            function CreateSettingSVG() {
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "20");
                svg.setAttribute("height", "20");
                svg.setAttribute("viewBox", "0 0 20 20");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M 1.91 7.38 A 8.5 8.5 0 0 1 3.7 4.3 a 0.5 0.5 0 0 1 0.54 -0.13 l 1.92 0.68 a 1 1 0 0 0 1.32 -0.76 l 0.36 -2 a 0.5 0.5 0 0 1 0.4 -0.4 a 8.53 8.53 0 0 1 3.55 0 c 0.2 0.04 0.35 0.2 0.38 0.4 l 0.37 2 a 1 1 0 0 0 1.32 0.76 l 1.92 -0.68 a 0.5 0.5 0 0 1 0.54 0.13 a 8.5 8.5 0 0 1 1.78 3.08 c 0.06 0.2 0 0.4 -0.15 0.54 l -1.56 1.32 a 1 1 0 0 0 0 1.52 l 1.56 1.32 a 0.5 0.5 0 0 1 0.15 0.54 a 8.5 8.5 0 0 1 -1.78 3.08 a 0.5 0.5 0 0 1 -0.54 0.13 l -1.92 -0.68 a 1 1 0 0 0 -1.32 0.76 l -0.37 2 a 0.5 0.5 0 0 1 -0.38 0.4 a 8.53 8.53 0 0 1 -3.56 0 a 0.5 0.5 0 0 1 -0.39 -0.4 l -0.36 -2 a 1 1 0 0 0 -1.32 -0.76 l -1.92 0.68 a 0.5 0.5 0 0 1 -0.54 -0.13 a 8.5 8.5 0 0 1 -1.78 -3.08 a 0.5 0.5 0 0 1 0.15 -0.54 l 1.56 -1.32 a 1 1 0 0 0 0 -1.52 L 2.06 7.92 a 0.5 0.5 0 0 1 -0.15 -0.54 Z m 1.06 0 l 1.3 1.1 a 2 2 0 0 1 0 3.04 l -1.3 1.1 c 0.3 0.79 0.71 1.51 1.25 2.16 l 1.6 -0.58 a 2 2 0 0 1 2.63 1.53 l 0.3 1.67 a 7.55 7.55 0 0 0 2.5 0 l 0.3 -1.67 a 2 2 0 0 1 2.64 -1.53 l 1.6 0.58 a 7.5 7.5 0 0 0 1.24 -2.16 l -1.3 -1.1 a 2 2 0 0 1 0 -3.04 l 1.3 -1.1 a 7.5 7.5 0 0 0 -1.25 -2.16 l -1.6 0.58 a 2 2 0 0 1 -2.63 -1.53 l -0.3 -1.67 a 7.55 7.55 0 0 0 -2.5 0 l -0.3 1.67 A 2 2 0 0 1 5.81 5.8 l -1.6 -0.58 a 7.5 7.5 0 0 0 -1.24 2.16 Z M 7.5 10 a 2.5 2.5 0 1 1 5 0 a 2.5 2.5 0 0 1 -5 0 Z m 1 0 a 1.5 1.5 0 1 0 3 0 a 1.5 1.5 0 0 0 -3 0 Z");
                path.setAttribute("fill", getComputedStyle(toolbar).getPropertyValue("--toolbar-text"));
                svg.appendChild(path);
                return svg;
            }
            settingButton.appendChild(CreateSettingSVG());
            setting.appendChild(settingButton);

            const settingMenu = document.createElement("div");
            settingMenu.id = "Custom-toolbar-setting-menu";
            settingMenu.classList.add("custom-toolbar-setting-menu", "custom-toolbar-setting-menu-hidden");
            setting.appendChild(settingMenu);

            let globalClickListener = null;
            settingButton.addEventListener("click", function (e) {
                e.stopPropagation();
                settingMenu.classList.remove("custom-toolbar-setting-menu-hidden");
                if (globalClickListener) {
                    document.removeEventListener("click", globalClickListener);
                }
                globalClickListener = function (event) {
                    const isClickInsideMenu = settingMenu.contains(event.target);
                    const isClickOnButton = settingButton.contains(event.target);

                    if (!isClickInsideMenu || isClickOnButton) {
                        settingMenu.classList.add("custom-toolbar-setting-menu-hidden");
                        document.removeEventListener("click", globalClickListener);
                        globalClickListener = null;
                    }
                };
                setTimeout(() => {
                    document.addEventListener("click", globalClickListener);
                }, 0);
            });

            function BuildSettingItemSwitch(text, onToggle, initialState = false) {
                const settingItem = document.createElement("button");
                settingItem.classList.add("custom-toolbar-setting-item");

                const checkbox = document.createElement("span");
                checkbox.classList.add("custom-toolbar-setting-checkbox");
                checkbox.innerHTML = '<svg style="width: 1.25em; height: 1.25em; vertical-align: middle; fill: currentColor; overflow: hidden;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M365.624235 692.484607 165.695786 492.556159 99.05297 559.198975 365.624235 825.77024 936.850128 254.54537 870.207311 187.902554Z" fill="#b3b3b3"></path></svg>';

                const textSpan = document.createElement("span");
                textSpan.classList.add("custom-toolbar-setting-text");
                textSpan.textContent = text;

                const content = document.createElement("div");
                content.classList.add("custom-toolbar-setting-content");
                content.appendChild(checkbox);
                content.appendChild(textSpan);
                settingItem.appendChild(content);

                let enabled = initialState;
                checkbox.style.visibility = enabled ? "visible" : "hidden";

                onToggle(enabled, text);
                settingItem.addEventListener("click", () => {
                    enabled = !enabled;
                    checkbox.style.visibility = enabled ? "visible" : "hidden";
                    onToggle(enabled, text);
                });

                settingMenu.appendChild(settingItem);

                return {
                    getState: () => enabled,
                    setState: (newState) => {
                        enabled = newState;
                        checkbox.style.visibility = enabled ? "visible" : "hidden";
                        onToggle(enabled, text);
                    },
                    toggle: () => settingItem.click(),
                    element: settingItem
                };
            }

            function SwitchStyle(enabled, styleId, enabledStyle, disabledStyle) {
                let styleElement = document.getElementById(styleId);
                if (!styleElement) {
                    styleElement = document.createElement("style");
                    styleElement.id = styleId;
                    document.head.appendChild(styleElement);
                }
                const cssRule = enabled ? enabledStyle : disabledStyle;
                styleElement.textContent = cssRule;
            }

            BuildSettingItemSwitch("锁定工具栏", (enabled) => {
                SwitchStyle(enabled, "fix-toolbar-style",
                    "#Custom-toolbar {\
                        position: sticky;\
                        top: 0;\
                    }",
                    "#Custom-toolbar {\
                        position: fixed;\
                        top: 0;\
                        box-shadow: var(--toolbar-shadow)\
                    }");

                let isNearTop = true, hideTimer = null;

                if (enabled) {
                    showToolbar();
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = null;
                    }
                }

                function showToolbar() {
                    toolbar.style.top = "0";
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = null;
                    }
                }
                function hideToolbar() {
                    toolbar.style.top = "-41px";
                }

                function optimizedThrottle(func, limit) {
                    let lastRan = 0;
                    let ticking = false;

                    return function () {
                        const context = this;
                        const args = arguments;
                        const now = Date.now();

                        if (now - lastRan >= limit) {
                            if (!ticking) {
                                requestAnimationFrame(function () {
                                    func.apply(context, args);
                                    lastRan = now;
                                    ticking = false;
                                });
                                ticking = true;
                            }
                        }
                    };
                }

                const handleMouseMove = optimizedThrottle(function (e) {
                    if (enabled) return;
                    const mouseY = e.clientY;
                    const newState = mouseY <= 41;

                    if (newState !== isNearTop) {
                        isNearTop = newState;
                        if (isNearTop) {
                            showToolbar();
                        } else {
                            if (hideTimer) {
                                clearTimeout(hideTimer);
                                hideTimer = null;
                            }
                            hideTimer = setTimeout(hideToolbar, 2000);
                        }
                    }
                }, 100);

                window.addEventListener('mousemove', handleMouseMove);
            }, true);

            BuildSettingItemSwitch("样例复制时带行号", (enabled) => {
                SwitchStyle(enabled, "line-number-selection-style",
                    "#Problem-element .custom-line-number { user-select: all; }",
                    "#Problem-element .custom-line-number { user-select: none; }"
                );
            }, false);

            BuildSettingItemSwitch("显示时空限制", (enabled) => {
                SwitchStyle(enabled, "limit-show-style",
                    "",
                    ".custom-stat { display: none; }"
                );
            }, true);

            const settingHr1 = document.createElement("hr");
            settingHr1.classList.add("custom-setting-hr");
            settingMenu.appendChild(settingHr1);

            const settingItemInfo = document.createElement("button");
            settingItemInfo.classList.add("custom-toolbar-setting-item");
            settingItemInfo.id = "Custom-setting-item-info";
            settingItemInfo.textContent = "查看题目详细信息（暂不可用）";
            settingMenu.appendChild(settingItemInfo);

            GM_addStyle(`
                #Custom-toolbar {
                    background-color: var(--toolbar-bg);
                    border-bottom: 1px solid var(--toolbar-border);

                    z-index: 10;
                    width: 100%;
                    height: 41px;
                    padding: 0px 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;

                    transition: top 0.5s;

                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI';
                }
                #Custom-toolbar-left, #Custom-toolbar-center, #Custom-toolbar-right {
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                #Custom-toolbar-left {
                    justify-content: flex-start;
                    margin-right: auto;
                }
                #Custom-toolbar-center {
                    justify-content: center;
                    margin-left: auto;
                    margin-right: auto;
                }
                #Custom-toolbar-right {
                    justify-content: flex-end;
                    margin-left: auto;
                }
                #Custom-toolbar-setting-menu {
                    position: absolute;
                    right: 2px;
                    width: max-content;
                }

                .custom-toolbar-button:not(.custom-toolbar-button-large), .custom-toolbar-a {
                    font-size: 15px;
                }
                .custom-toolbar-button-large {
                    font-size: 16px;
                }

                .custom-toolbar-button, .custom-toolbar-a {
                    cursor: default;
                    border: 2px solid transparent;
                    border-radius: 2px;

                    padding: 0 8px;
                    margin: 2px 0px;
                    max-height: 100%;

                    display: flex;
                    white-space: pre-wrap;
                    justify-content: center;
                    align-items: center;

                    color: var(--toolbar-text);
                    background-color: var(--toolbar-bg);
                    outline: none;
                    transition: background-color 0.1s ease-in-out;
                }
                .custom-toolbar-button {
                    height: 32px;
                }
                .custom-toolbar-a {
                    height: 28px;
                }
                .custom-toolbar-a a {
                    color: var(--toolbar-text);
                    outline: none;
                }

                .custom-toolbar-button-on {
                    background-color: var(--toolbar-button-on);
                    border-bottom-color: var(--toolbar-button-on-bottom);
                }

                .custom-toolbar-button:hover, .custom-toolbar-a:hover {
                    background-color: var(--toolbar-button-hover);
                    filter: unset;
                }
                .custom-toolbar-button:active, .custom-toolbar-a:active {
                    background-color: var(--toolbar-button-active);
                }

                .custom-toolbar-separator {
                    margin: 0 4px;
                    width: 1px;
                    height: 16px;
                    background-color: var(--toolbar-separator-color);
                }

                #app > .dropdown.shown {
                    z-index: 12;
                }

                #Custom-toolbar-setting-button {
                    cursor: pointer;
                }
                #Custom-toolbar-setting-menu {
                    display: flex;
                    flex-direction: column;

                    background-color: var(--setting-menu-bg);
                    padding: 5px 2px;
                    border-radius: 10px;
                    box-shadow: var(--toolbar-shadow);
                    font-size: 15px;

                    transition: opacity 0.1s ease, visibility 0.1s ease;
                }
                .custom-toolbar-setting-menu-hidden {
                    opacity: 0;
                    visibility: hidden;
                }
                .custom-toolbar-setting-checkbox {
                    margin-right: 0.5em;
                }
                .custom-toolbar-setting-item {
                    width: auto;
                    text-align: left;

                    padding: 5px 10px;
                    margin: 0 4px;
                    background-color: transparent;
                    color: var(--toolbar-text);
                    border: unset;
                    border-radius: 4px;
                }
                .custom-toolbar-setting-item:hover {
                    background-color: var(--setting-item-hover);
                }
                .custom-setting-hr {
                    border: 1px var(--setting-menu-hr) solid;
                    width: 100%;
                    margin: 5px 0;
                }
            `);
        }

        async function BuildStat() {
            const [timeLimit, memoryLimit] = (await elmGetter.get([
                ".stat > .field:nth-child(3) > .stat-text.value",
                ".stat > .field:nth-child(4) > .stat-text.value"
            ], oringinalProblemHeader)).map(e => e.textContent.trim());

            console.log("[Luogu-RER] BuildStat Running.");

            const stat = document.createElement("div");
            stat.classList.add("custom-stat", "custom-common-text");

            const timeStat = document.createElement("div");
            timeStat.classList.add("custom-time-stat");
            timeStat.textContent = "时间限制：" + timeLimit;

            const memoryStat = document.createElement("div");
            memoryStat.classList.add("custom-memory-stat");
            memoryStat.textContent = "空间限制：" + memoryLimit;

            stat.append(timeStat, memoryStat);
            problemElement.insertBefore(stat, problemElement.firstChild);

            GM_addStyle(`
                .custom-stat {
                    font-size: 24px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .custom-time-stat, .custom-memory-stat {
                    margin-left: 1em;
                    margin-right: 1em;
                }
            `);

            return stat;
        }

        async function BuildHeader(stat) {
            console.log("[Luogu-RER] BuildHeader Running.");

            const titleContent = (await elmGetter.get("h1.lfe-h1", oringinalProblemHeader)).textContent;

            const title = document.createElement("h1");
            title.classList.add("lfe-h1", "custom-title");
            title.textContent = titleContent.substring(titleContent.indexOf(" ") + 1);
            problemElement.insertBefore(title, stat);

            const customHeaderElement = document.createElement("header");
            customHeaderElement.classList.add("custom-header", "custom-common-text");
            problemElement.insertBefore(customHeaderElement, title);

            const leftText = document.createElement("div");
            leftText.classList.add("custom-header-left-text");
            leftText.textContent = "洛谷 Luogu";
            customHeaderElement.appendChild(leftText);

            const rightText = document.createElement("div");
            rightText.classList.add("custom-header-right-text");
            rightText.textContent = titleContent;
            customHeaderElement.appendChild(rightText);

            const hrElement = document.createElement("hr");
            hrElement.classList.add("custom-header-hr");
            customHeaderElement.appendChild(hrElement);

            GM_addStyle(`
                .custom-header {
                    font-size: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0px 0px 48px 0px;
                }
                .custom-header-left-text, .custom-header-right-text {
                    margin: 0px;
                }
                .custom-header-left-text {
                    margin-right: auto;
                }
                .custom-header-hr {
                    flex-basis: 100%;
                    border: 1px solid #bfbfbf;
                    margin: 0px;
                }
            `);
        }
    }

    async function removeAll(selector, container = document) {
        elmGetter.each(selector, container, e => { e.remove(); });
    }
    async function removeSome(number, selector, container = document) {
        for (let i = 1; i <= number; i++) {
            const e = await elmGetter.get(selector, container);
            e.remove();
        }
    }
})();