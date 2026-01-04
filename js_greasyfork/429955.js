
// ==UserScript==
// @name 双倍快乐
// @author xcl & Zilewang7（啥也没做）
// @description 双倍文字，双倍快乐; 单行变双行，原文档一行，翻译一行
// @version 0.0.3
// @match *://*/*
// @namespace https://greasyfork.org/users/513536
// @downloadURL https://update.greasyfork.org/scripts/429955/%E5%8F%8C%E5%80%8D%E5%BF%AB%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/429955/%E5%8F%8C%E5%80%8D%E5%BF%AB%E4%B9%90.meta.js
// ==/UserScript==
(function () {

    const textColor = '#239e23'; // 此行为译文颜色，可以自定义;

    "use strict";
    const duplicateBtn = document.createElement("div");
    const styles = {
        backgroundColor: "skyblue",
        zIndex: 10000,
        width: '88px',
        height: '30px',
        position: 'fixed',
        top: '50px',
        left: '-78px',
        transition: 'all 0.3s',
        border: '1px solid transparent',
        outline: 'none',
        borderRadius: '10px'
    };
    Object.entries(styles).forEach(([key, value]) => {
        duplicateBtn.style[key] = value;
    })

    duplicateBtn.onmouseover = () => {
        duplicateBtn.style.left = "-12px";
    };
    duplicateBtn.onmouseleave = () => {
        duplicateBtn.style.left = "-78px";
    };
    document.body.appendChild(duplicateBtn);
    const shouldDuplicateTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'li'];

    duplicateBtn.onclick = () => {
        for (const tag of shouldDuplicateTags) {
            document.querySelectorAll(tag).forEach(node => {
                const copy = document.createElement(node.nodeName);
                copy.textContent = node.textContent;
                copy.style.setProperty('color', textColor, 'important');
                node.parentElement.insertBefore(copy, node.nextElementSibling);
                node.setAttribute("translate", "no");
            })
        }
        duplicateBtn.style.display = "none";
    };
})();