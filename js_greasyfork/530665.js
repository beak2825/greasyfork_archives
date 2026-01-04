// ==UserScript==
// @name            取消超链接
// @name:EN         Link2Text
// @namespace       https://github.com/zxk2099/Link2Text
// @version         1.3
// @description     长按<a>元素超链接取消超链接，并提供一个额外的新的按钮以恢复原超链接。
// @description:EN  A long press on the <a> element hyperlink cancels the hyperlink, with an additional new button to scroll back.
// @author          zxk2099
// @icon            https://raw.githubusercontent.com/zxk2099/Link2Text/refs/heads/main/icon.png
// @supportURL      https://github.com/zxk2099/Link2Text/issues
// @match           *://*/*
// @downloadURL https://update.greasyfork.org/scripts/530665/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/530665/%E5%8F%96%E6%B6%88%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {

    // 长按时间（毫秒）
    const longPressTime = 500;

    let pressTimer = null;
    document.addEventListener('mousedown', (e) => {
        const linkElement = e.target.closest('a');
        if (linkElement) {
            pressTimer = setTimeout(() => {
                replaceLink(linkElement);
            }, longPressTime);
        }
    });

    document.addEventListener('mouseup', () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });

    function isHidden(element) {
        return element.offsetWidth === 0 && element.offsetHeight === 0;
    }
    const replaceLink = (linkElement) => {
        if(!linkElement.l2t_elementSwitcher){
            const container = document.createElement('span');
            container.innerHTML = linkElement.innerHTML;
            [...linkElement.attributes].forEach((a) => { container.setAttribute(a.nodeName,a.nodeValue); });
            container.style.cssText = linkElement.style.cssText;
            container.style.position = 'relative';
            container.l2t_elementSwitcher = linkElement;
            // fix DOMListener in Text To Link 2.8.7 at https://update.greasyfork.org/scripts/342/Text%20To%20link.user.js
            container.classList.add("textToLink");

            const restoreButton = document.createElement('div');
            restoreButton.className = 'restore-button';
            restoreButton.textContent = '↺';
            restoreButton.addEventListener('click', (event) => {
                const textSpan = event.target.parentElement;
                event.stopPropagation();
                textSpan.l2t_elementSwitcher.style.display = textSpan.style.display;
                textSpan.style.display = "none";
            });
            linkElement.l2t_elementSwitcher = container;
            container.appendChild(restoreButton);
            linkElement.parentNode.insertBefore(container, linkElement);
        }
        linkElement.l2t_elementSwitcher.style.display = linkElement.style.display;
        linkElement.style.display = "none";
        if(isHidden(linkElement.l2t_elementSwitcher)){
            linkElement.l2t_elementSwitcher.style.display = "block";
        }
    };
    const style = document.createElement('style');
    style.textContent = `
        .restore-button {
            position: absolute;
            left: -8px;
            top: -12px;
            width: 16px;
            height: 16px;
            background-color: #e31111;
            color: white;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            line-height: 16px;
            cursor: pointer;
            box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
})();
