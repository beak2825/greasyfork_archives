// ==UserScript==
// @name         ChatGPT 渲染HTML代码
// @namespace    https://github.com/21888/chatgpt-render-html
// @version      1.0.3
// @description  chatgpt渲染html代码块,像Claude一样实时预览html ( chatgpt renders HTML code blocks, previewing HTML in real-time like Claude )
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/511723/ChatGPT%20%E6%B8%B2%E6%9F%93HTML%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/511723/ChatGPT%20%E6%B8%B2%E6%9F%93HTML%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(debounce(xuanranHTML, 500));
    const createIframeObserver = new MutationObserver(
        debounce(createIframe, 500)
    );

    // 观察目标节点的变化
    observer.observe(document.body, { childList: true, subtree: true });
    createIframeObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 首次调用渲染
    window.addEventListener("load", () => {
        setTimeout(xuanranHTML, 1000);
        // 创建一个iframe
        setTimeout(createIframe, 1000);
    });
})();

function createIframe() {
    // 判断是否已经创建 dynamicContentIframe
    if (document.getElementById("dynamicContentIframe")) {
        console.log("已经创建 dynamicContentIframe");
        return;
    }

    // 创建一个基于main标签的兄弟iframe元素
    const mainElement = document.querySelector("main");
    // mainElement.style.display = "flex";
    mainElement.style.overflow = "hidden";
    if (mainElement) {
        const iframe = document.createElement("iframe");
        iframe.id = "dynamicContentIframe"; // 添加id以便动态修改内容
        iframe.style.display = "relative";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.backgroundColor = "#FFFDF6"; // 添加奶白色背景
        // sandbox="allow-scripts"
        iframe.sandbox = "allow-scripts";
        iframe.srcdoc = "<html><body></body></html>";
        // 创建切换显示代码块的div
        const toggleCodeButton = document.createElement("div");
        toggleCodeButton.id = "toggleCodeButton";
        toggleCodeButton.style.position = "absolute";
        toggleCodeButton.style.top = "10px";
        toggleCodeButton.style.right = "40px";
        toggleCodeButton.style.cursor = "pointer";
        toggleCodeButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H16M4 10H16M4 14H16" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        toggleCodeButton.onclick = () => {
            // document.getElementById("dynamicContentIframe").contentWindow.document.body.innerHTML = "123";
            document.getElementById("codeContainer").style.display =
                document.getElementById("codeContainer").style.display ===
                "none"
                    ? "block"
                    : "none";
        };

        // 创建缩小按钮
        const minimizeButton = document.createElement("div");
        minimizeButton.id = "minimizeButton";
        minimizeButton.style.position = "absolute";
        minimizeButton.style.top = "10px";
        minimizeButton.style.right = "10px";
        minimizeButton.style.cursor = "pointer";
        minimizeButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 10H16" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        minimizeButton.onclick = () => {
            iframe.style.display =
                iframe.style.display === "none" ? "block" : "none";
            document.querySelector("main").style.display =
                document.querySelector("main").style.display === "block"
                    ? "flex"
                    : "block";
            document
                .querySelector(
                    "body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0 > div > div > div > nav > div.flex.justify-between.flex.h-\\[60px\\].items-center.md\\:h-header-height > span > button"
                )
                .click();
        };
        //  toggleCodeButton 和 minimizeButton 添加到一个div下
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        buttonContainer.style.position = "relative";
        buttonContainer.style.top = "10px";
        buttonContainer.style.right = "10px";
        buttonContainer.appendChild(minimizeButton);
        buttonContainer.appendChild(toggleCodeButton);

        // 直接将 iframe 和按钮添加到 main 元素下
        mainElement.appendChild(iframe);
        mainElement.appendChild(buttonContainer);

        // 设置 main 元素为相对定位，以便正确定位最小化按钮
        mainElement.style.position = "relative";

        // mainElement.insertBefore(container, mainElement.nextSibling);
        // 创建一个用户存放显示代码的div
        const codeContainer = document.createElement("div");
        codeContainer.id = "codeContainer";
        codeContainer.style.width = "100%";
        codeContainer.style.height = "100%";
        codeContainer.style.zIndex = "1000";
        // codeContainer.style.backgroundColor = "#FFFDF6"; // 添加奶白色背景
        codeContainer.style.display = "block";
        codeContainer.style.overflow = "hidden";
        codeContainer.style.overflowY = "scroll";
        codeContainer.style.display = "none";
        mainElement.appendChild(codeContainer);
    } else {
        console.error("Main element not found");
    }
    // 显示
    document.getElementById("dynamicContentIframe").style.display = "block";
}
function xuanranHTML() {
    // 获取所有的 code 元素
    const codes = document.querySelectorAll(".overflow-y-auto.p-4 code");

    // 遍历所有的 code 元素
    codes.forEach((codeElement) => {
        // 检查是否已经处理过，避免重复插入
        if (codeElement.classList.contains("processed")) {
            return;
        }

        // 标记该元素已经处理过
        codeElement.classList.add("processed");

        // 判断 codeElement.textContent 是否是 HTML 内容
        if (codeElement.parentNode.parentNode.children[0].innerText != "html") {
            console.log(
                "不渲染: " +
                    codeElement.parentNode.parentNode.children[0].innerText
            );
            return;
        }
        // 隐藏codeElement
        codeElement.parentNode.parentNode.style.display = "none";
        let componentContainer = renderSmallWindow(codeElement);
    });
}

function renderSmallWindow(codeElement) {
    // 创建组件容器
    const componentContainer = document.createElement("div");
    componentContainer.style.display = "flex";
    componentContainer.style.alignItems = "center";
    componentContainer.style.border = "1px solid #e5e7eb";
    componentContainer.style.borderRadius = "8px";
    componentContainer.style.padding = "10px";
    componentContainer.style.backgroundColor = "#f9fafb";
    componentContainer.style.marginBottom = "20px";
    componentContainer.style.cursor = "pointer";

    // 创建图标容器
    const iconContainer = document.createElement("div");
    iconContainer.style.borderRight = "1px solid #e5e7eb";
    iconContainer.style.paddingRight = "10px";

    // 创建 SVG 图标
    const svgIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIcon.setAttribute("style", "height: 24px; width: 24px; color: #6b7280;");
    svgIcon.setAttribute("fill", "none");
    svgIcon.setAttribute("viewBox", "0 0 24 24");
    svgIcon.setAttribute("stroke", "currentColor");
    svgIcon.setAttribute("stroke-width", "2");

    const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    pathElement.setAttribute("stroke-linecap", "round");
    pathElement.setAttribute("stroke-linejoin", "round");
    pathElement.setAttribute(
        "d",
        "M16 8c0-1.104-.9-2-2-2H6c-1.1 0-2 .896-2 2v8c0 1.104.9 2 2 2h8c1.1 0 2-.896 2-2V8zm-4 4h.01m-3 0h.01M7 12h.01m0 0h.01M12 7v.01M8 7v.01M7 7v.01M12 8v.01m-5 0v.01m-1 0v.01"
    );

    svgIcon.appendChild(pathElement);
    iconContainer.appendChild(svgIcon);

    // 创建文本容器
    const textContainer = document.createElement("div");
    textContainer.style.marginLeft = "10px";

    // 创建标题
    const title = document.createElement("h3");
    title.textContent = codeElement.parentNode.parentNode.children[0].innerText;
    title.style.margin = "0";
    title.style.fontSize = "16px";
    title.style.fontWeight = "600";
    title.style.color = "#374151";

    // 创建描述
    const description = document.createElement("p");
    description.textContent = "预览页面 / 刷新渲染";
    description.style.margin = "0";
    description.style.fontSize = "14px";
    description.style.color = "#6b7280";

    textContainer.appendChild(title);
    textContainer.appendChild(description);

    // 组装组件
    componentContainer.appendChild(iconContainer);
    componentContainer.appendChild(textContainer);

    // 添加点击事件，切换代码显示状态
    componentContainer.addEventListener("click", function () {
        const codeParent = codeElement.parentNode.parentNode;
        const mainElement = document.querySelector("main");
        // codeParent.style.display = codeParent.style.display === 'none' ? 'block' : 'none';
        // 隐藏展开左侧历史记录
        if (mainElement.style.display != "flex") {
            mainElement.style.display = "flex";
        }
        if (
            document.querySelector(
                "body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0"
            ).style.width != "0px"
        ) {
            document
                .querySelector(
                    "body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.flex-shrink-0.overflow-x-hidden.bg-token-sidebar-surface-primary.max-md\\:\\!w-0 > div > div > div > nav > div.flex.justify-between.flex.h-\\[60px\\].items-center.md\\:h-header-height > span > button"
                )
                .click();
            // dynamicContentIframe
            document.getElementById("dynamicContentIframe").style.display =
                "block";
        }

        // iframe 赋值
        renderIframeContent(
            document.getElementById("dynamicContentIframe"),
            codeElement.textContent
        );
        // 拦截script标签

        // 设置代码容器代码
        // document.getElementById("codeContainer").innerHTML = codeElement.parentNode.parentNode.innerHTML;
        const codeContainer = document.getElementById("codeContainer");
        codeContainer.innerHTML = "";
        const clonedContent = codeElement.parentNode.parentNode.cloneNode(true);

        codeContainer.appendChild(clonedContent);
        codeContainer.childNodes[0].style.display = "contents";

        // 查找并处理按钮
        const buttons = clonedContent.querySelectorAll("button");
        buttons.forEach((button, index) => {
            console.log(button);
            if (button.className == "flex gap-1 items-center py-1") {
                button.addEventListener("click", function (event) {
                    button.innerText = " success √ ";
                    setTimeout(() => {
                        button.innerText = "Copy code";
                    }, 1000);
                });
            }
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // 阻止事件冒泡到父元素
                // 找到原始按钮并模拟点击
                const originalButtons =
                    codeElement.parentNode.parentNode.querySelectorAll(
                        "button"
                    );
                if (originalButtons[index]) {
                    originalButtons[index].click();
                }
            });
        });

        // 添加事件委托到 codeContainer（用于处理代码元素的点击）
        codeContainer.addEventListener("click", function (event) {
            const clickedElement = event.target.closest("code");
            if (clickedElement) {
                // 模拟原始代码元素的点击行为
                const originalCodeElement = codeElement.closest("code");
                if (originalCodeElement) {
                    originalCodeElement.click();
                }
            }
        });
    });

    // 将组件插入到代码元素之前
    codeElement.parentNode.parentNode.insertAdjacentElement(
        "beforebegin",
        componentContainer
    );
    return componentContainer;
}
function renderIframeContent(iframe, content) {
    // console.log(__remixContext.state.loaderData.root.cspScriptNonce);
    // Add nonce to script tags in content
    const nonce = __remixContext.state.loaderData.root.cspScriptNonce;
    content = content.replace(/<script/g, `<script nonce="${nonce}"`);
    iframe.srcdoc = content;
    return;
    // 获取 iframe 内部的 document 对象
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // 将 code 元素的内容设置为 iframe 的内容
    iframeDoc.open();

    if (true) {
        // 刷新特效,true为有感刷新,!true为无痕刷新
        // iframeDoc.write(`loading`);
        // 生成一个随机的nonce值
        const nonce = generateNonce();

        // 在content中添加nonce
        // content = content.replace(/<script/g, `<script nonce="${nonce}"`);
        // 设置meta头替换
        // content = content.replace(/<meta/g, `<meta nonce="${nonce}"`);
        // let doms = new DOMParser().parseFromString(content, "text/html");

        // Remove script tags from content
        // content = content.replace(
        //     /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        //     ""
        // );
        // 插入
        iframeDoc.write(content);
        doms.querySelectorAll("script").forEach((script) => {
            return;
            console.log("script");
            const newScript = iframeDoc.createElement("script");
            newScript.textContent = script.textContent;
            newScript.nonce = nonce;
            // iframeDoc.documentElement.appendChild(newScript);
            // 创建一个blob URL来加载脚本
            const blob = new Blob([script.textContent], {
                type: "application/javascript",
            });
            const scriptUrl = URL.createObjectURL(blob);
            newScript.src = scriptUrl;
            script.onload = () => {
                console.log("加载完成");
                URL.revokeObjectURL(scriptUrl);
            };
            iframeDoc.documentElement.appendChild(newScript);
        });

        // setTimeout(() => iframeDoc.write(content), 100);
    } else {
        iframeDoc.write(content);
    }
    iframeDoc.close();
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
function generateNonce() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}
