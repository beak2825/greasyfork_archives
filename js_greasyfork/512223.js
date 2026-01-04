// ==UserScript==
// @name         乐享增强
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  编辑界面悬浮大纲/阅读界面返回顶部按钮嘎~
// @author       阿裕Addyu
// @match        https://lexiangla.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512223/%E4%B9%90%E4%BA%AB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/512223/%E4%B9%90%E4%BA%AB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const isEditPage = window.location.href.includes("/edit");

    // 编辑页面功能：悬浮大纲
    if (isEditPage) {
        const createTocContainer = () => {
            const tocContainer = document.createElement("div");
            tocContainer.id = "tocContainer";
            tocContainer.style.cssText = `
                position: fixed; top: 100px; right: 8px; width: 200px; max-height: 500px;
                overflow-y: auto; background: white; border: 1px solid #ccc;
                padding: 10px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.1);
                cursor: grab;
            `;
            document.body.appendChild(tocContainer);
            return tocContainer;
        };

        const populateToc = (tocContainer, iframeDocument) => {
            const headings = iframeDocument.querySelectorAll("h1, h2, h3");
            if (headings.length === 0) {
                console.log("未找到标题，稍候重试嘎...");
                setTimeout(findIframeAndInjectToc, 3000);
                return;
            }

            tocContainer.innerHTML = `<h3>文档大纲</h3>`;
            const tocList = document.createElement("ul");
            tocList.style.cssText = "list-style: none; padding: 0;";
            tocContainer.appendChild(tocList);

            headings.forEach((heading, index) => {
                const tocItem = document.createElement("li");
                const headingTag = heading.tagName.toLowerCase();

                tocItem.innerHTML = `
                    <a href="javascript:void(0);" data-index="${index}" style="
                        font-size: ${headingTag === "h1" ? "18px" : headingTag === "h2" ? "16px" : "14px"};
                        font-weight: ${headingTag === "h1" ? "bold" : headingTag === "h2" ? "600" : "normal"};
                        color: ${headingTag === "h1" ? "#7A9E9F" : headingTag === "h2" ? "#ADB5D9" : "#C5AFA4"};
                        margin-left: ${headingTag === "h1" ? "0" : headingTag === "h2" ? "10px" : "20px"};
                        text-decoration: none;
                    ">
                        ${heading.innerText}
                    </a>
                `;
                tocItem.style.margin = "5px 0";
                tocList.appendChild(tocItem);

                tocItem.addEventListener("click", (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: "smooth" });
                });
            });
        };

        const enableDraggable = (element) => {
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            element.addEventListener("mousedown", (e) => {
                isDragging = true;
                element.style.cursor = "grabbing";
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    const newLeft = e.clientX - offsetX;
                    const newTop = e.clientY - offsetY;
                    element.style.left = `${newLeft}px`;
                    element.style.top = `${newTop}px`;
                    element.style.right = "auto";
                }
            });

            document.addEventListener("mouseup", () => {
                if (isDragging) {
                    isDragging = false;
                    element.style.cursor = "grab";
                }
            });

            element.ondragstart = () => false;
        };

        const findIframeAndInjectToc = () => {
            const iframe = document.querySelector(".tox-edit-area__iframe");
            if (!iframe) {
                console.log("iframe未找到，重试中嘎...");
                setTimeout(findIframeAndInjectToc, 1000);
                return;
            }

            console.log("iframe已找到，创建悬浮窗口嘎~");
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const tocContainer = createTocContainer();
            populateToc(tocContainer, iframeDocument);
            enableDraggable(tocContainer);
        };

        setTimeout(findIframeAndInjectToc, 3000);
    }

    // 阅读页面功能：返回顶部按钮
    if (!isEditPage) {
        const createBackToTopButton = () => {
            const button = document.createElement("div");
            button.innerHTML = "⬆️";
            button.style.cssText = `
                position: fixed; right: 20px; bottom: 20px; width: 50px; height: 50px;
                background-color: transparent; color: #007bff; font-size: 24px;
                text-align: center; line-height: 50px; border-radius: 50%;
                cursor: pointer; z-index: 1000; user-select: none;
                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
            `;
            document.body.appendChild(button);
            return button;
        };

        const createTooltip = () => {
            const tooltip = document.createElement("div");
            tooltip.innerHTML = "返回顶部（双击删除）";
            tooltip.style.cssText = `
                position: fixed; padding: 5px 10px; background-color: rgba(0, 0, 0, 0.7);
                color: #fff; border-radius: 5px; font-size: 12px; visibility: hidden;
                white-space: nowrap; z-index: 9999;
            `;
            document.body.appendChild(tooltip);
            return tooltip;
        };

        const button = createBackToTopButton();
        const tooltip = createTooltip();

        let clickTimeout;
        let isDoubleClick = false;

        button.addEventListener("click", () => {
            if (isDoubleClick) return;
            clickTimeout = setTimeout(() => {
                if (!isDoubleClick) window.scrollTo({ top: 0, behavior: "smooth" });
            }, 150);
        });

        button.addEventListener("dblclick", () => {
            clearTimeout(clickTimeout);
            isDoubleClick = true;
            button.remove();
            tooltip.remove();
            setTimeout(() => (isDoubleClick = false), 150);
        });

        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                button.style.left = e.clientX - offsetX + "px";
                button.style.top = e.clientY - offsetY + "px";
                button.style.right = "auto";
                button.style.bottom = "auto";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            button.style.transition = "";
        });

        button.addEventListener("mouseenter", (e) => {
            tooltip.style.visibility = "visible";
            tooltip.style.left = e.clientX - tooltip.offsetWidth - 10 + "px";
            tooltip.style.top = e.clientY - tooltip.offsetHeight - 10 + "px";
        });

        button.addEventListener("mouseleave", () => {
            tooltip.style.visibility = "hidden";
        });

        button.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.clientX - tooltip.offsetWidth - 10 + "px";
            tooltip.style.top = e.clientY - tooltip.offsetHeight - 10 + "px";
        });
    }
})();
