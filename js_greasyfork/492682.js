// ==UserScript==
// @name         Coze 布局调整
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  Coze 聊天栏调整, 修改聊天栏默认位置和默认宽度, 添加收起头栏的控制按钮, 优化 Coze 部分细节.
// @author       太阳照常升起
// @match        https://www.coze.com/*
// @icon         https://sf-coze-web-cdn.coze.com/obj/coze-web-sg/obric/coze/favicon.1970.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492682/Coze%20%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/492682/Coze%20%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

let chatSwap = true;

function Camel2Kebab(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/* 通用 JSON 转 CSS 方法 */
function Json2Css(complexStyleObject) {
    let cssString = '';

    for (const selector in complexStyleObject) {
        if (selector.startsWith('@')) { /* 处理媒体查询和其他@规则 */
            cssString += `${selector} { `;
            for (const innerSelector in complexStyleObject[selector]) {
                cssString += `${innerSelector} { `;
                const styles = complexStyleObject[selector][innerSelector];
                for (const prop in styles) {
                    cssString += `${Camel2Kebab(prop)}: ${styles[prop]}; `;
                }
                cssString += '} ';
            }
            cssString += '} ';
        } else {
            cssString += `${selector} { `;
            const styles = complexStyleObject[selector];
            for (const prop in styles) {
                cssString += `${Camel2Kebab(prop)}: ${styles[prop]}; `;
            }
            cssString += '} ';
        }
    }

    return cssString;
}

const defaultStylesJSON = {
    '.hook-button': {
        fontSize: '0.85rem',
        color: '#567',
        backgroundColor: '#AABBCC20',
        border: '2px solid #ABC',
        padding: '0.35em 0.85em',
        transition: 'all 0.15s ease-out',
        zIndex: '0',
        outline: 'none'
    },
    '.hook-button:hover': {
        color: '#4D53E8',
        border: '2px solid #4D53E8',
        boxShadow: '0px 0px 4px #20304050',
        zIndex: '1024',
        cursor: 'pointer'
    },
    '.left-button': {
        borderRadius: '4px 0 0 4px',
        marginRight: '-2px'
    },
    '.right-button': {
        borderRadius: '0 4px 4px 0',
    },
    '.SpjOpcOJdSoQECybVksF': {
        backgroundColor: '#FFF',
        borderRadius: '8px',
        border: '2px solid #00000014',
        paddingTop: '20px',
        boxShadow: '0px 0px 8px #00000010',
        transition: 'all 0.15s ease-out',
    },
    '.R_WS6aCLs2gN7PUhpDB0 .hv5iKiECwMBS4Ig79KEg .CR2NV8AIey04fyMgZdCy': {
        gap: '16px'
    },
    '.nIVxVV6ZU7gCM5i4VQIL': {
        padding: '16px 32px 32px 32px'
    },
    '.CKOXiJzzJsU73hzE_M4r': {
        borderBottom: '1px solid #00000015'
    },
    '.nIP4BqLGD8csFme4CavI': {
        borderTop: '1px solid #00000015'
    },
    '.gqtYhfRVZuEPPIAbZVxm': {
        display: 'flex',
        flexDirection: 'row',
    }
}

const defaultStyleClass = document.createElement('style');
defaultStyleClass.innerHTML = `${Json2Css(defaultStylesJSON)}`;

/* 增加两秒延时, 确保覆盖原版 css 的代码能有效覆盖 */
setTimeout(() => {
    document.head.appendChild(defaultStyleClass);
}, 2000);

// 监听对话窗口布局
(() => {
    const previewStyles = {
        borderLeft: '1px solid rgba(28, 29, 35, .12)',
    }

    setInterval(() => {
        let mainGrid = document.querySelector('.sidesheet-container.UMf9npeM8cVkDi0CDqZ0');
        if (mainGrid) { mainGrid.style.gridTemplateColumns = '1fr'; }

        // 对话 div
        let previewBox = document.querySelector('.TH9DlQU1qwg_KGXdDYzk');
        setElementStyles(previewBox, previewStyles);

        // 技能 div
        let skillsBox = document.querySelector('.Tu_0qwgY5xgutNNqZdO5.coz-bg-plus');
        if (skillsBox) {
            skillsBox.parentElement.style.transition = 'grid-template-columns 0.15s ease-out';
        }

        let personaPromptBox = document.querySelector('.WOldSMY37_Moixx1AljK.coz-bg-plus.V7YfWLfkPCgVbNaXN15Y.vPzhZr_lrLIQ8pYaTon8.nwXp2fORjEjvPzaqxE8n')
        setElementStyles(personaPromptBox, {
            marginBottom: '0',
            borderBottom: '0',
            paddingBottom: '0',
        });

        if (previewBox && skillsBox) {
            if (skillsBox.previousElementSibling != previewBox) {
                skillsBox.insertAdjacentElement('beforebegin', previewBox);
            }

            skillsBox.parentElement.style.gridTemplateColumns = chatSwap ? '6fr 19fr 6fr' : '1fr 1fr 1fr';
        }
    }, 100);
})();

// 管理头栏
(() => {

    // 关闭头栏按钮
    let expandHeader = '展开标头',
        collapseHeader = '折叠标头',
        headerButton = document.createElement('button');
    headerButton.innerText = collapseHeader;

    // 宽度控制按钮
    let lengthen = '增加宽度',
        reduction = '还原宽度',
        widthButton = document.createElement('button');
    widthButton.innerText = reduction;

    headerButton.className += 'hook-button left-button';
    widthButton.className += 'hook-button right-button';

    widthButton.addEventListener('click', () => {
        chatSwap = !chatSwap;
        widthButton.innerText = chatSwap ? reduction : lengthen;
    });

    const chatInputStyles = {
        marginTop: '1rem',
        marginBottom: '1rem',
    }

    let initialized = false;

    setInterval(() => {
        // 头栏
        let header = document.querySelector('.autboP_xS3EJZt4GoTeY');
        setElementStyles(header, { transition: 'margin-top 0.15s ease-out' });

        let developHeader = document.querySelector('.LxUy6g0wgIgIWCGkQHkC.coz-bg-plus.coz-fg-secondary.Zo84sv5CjcC2ObBGEGDy.SKIazToEhtUg8ZweE2b6');
        setElementStyles(developHeader, { transition: 'margin-top 0.15s ease-out' });

        // Preview 的父元素
        let DevelopBox = document.querySelector('.LxUy6g0wgIgIWCGkQHkC.MWPtuVYYnlMYfpAdNbLa');

        /* .LxUy6g0wgIgIWCGkQHkC.coz-bg-plus.coz-fg-secondary.Zo84sv5CjcC2ObBGEGDy.SKIazToEhtUg8ZweE2b6 */
        // 模型选择栏
        let modelSelectionBar = document.querySelector('.semi-button.semi-button-primary.semi-button-size-small.semi-button-borderless.HTYZGLz47cQtNZFtW3e1.yJDwteqjbdkspQ0V7XOl.hPxLPb8zfs4SdYQh_64B.semi-button-with-icon');
        if (modelSelectionBar) modelSelectionBar.style.marginRight = '1rem';

        // 对话列表渐变遮挡
        let chatListGradient = document.querySelector('.qtV_UKcJKqgw6X0fPvI4');
        chatListGradient && chatListGradient.remove();

        // 对话输入框
        let editBarBox = document.querySelector('.WfXRc6x8M2gbaaX2HSxJ');
        if (editBarBox) {
            setElementStyles(editBarBox, chatInputStyles);
        }

        if (DevelopBox && header && !DevelopBox.contains(headerButton)) {
            DevelopBox.appendChild(modelSelectionBar);
            DevelopBox.appendChild(headerButton);
            DevelopBox.appendChild(widthButton);

            headerButton.addEventListener('click', () => {
                ToggleHeaderStatus(developHeader, header, headerButton, expandHeader, collapseHeader);
            })

            if (!initialized) {
                initialized = true;
                setTimeout(() => {
                    ToggleHeaderStatus(developHeader, header, headerButton, expandHeader, collapseHeader);
                }, 750);
            }
        }
    }, 100);
})();

function ToggleHeaderStatus(developHeader, header, headerButton, expandHeader, collapseHeader) {
    if (header.style.marginTop !== '-74px') {

        developHeader.style.marginTop = '-64px';
        header.style.marginTop = '-74px';
        headerButton.innerText = expandHeader;
    } else {

        developHeader.style.marginTop = '0px';
        header.style.marginTop = '0px';
        headerButton.innerText = collapseHeader;
    }
}

// 删除输入框下面的两个元素
(() => {

    let firstBelowTheEditBar = document.querySelector('.pStAbHgTdAlDVUlpMOGP');
    let secondBelowTheEditBar = document.querySelector('.RFqvgJWAYggvoBpHs2cU._dMuc1A3gGA7leIE6moV');

    setInterval(() => {
        /* 聊天框上面的间隔元素 */
        let xuVS0D35c4AvLVNVLt0t = document.querySelector('.xuVS0D35c4AvLVNVLt0t');
        if (xuVS0D35c4AvLVNVLt0t) {
            xuVS0D35c4AvLVNVLt0t.remove();
        }

        let ZkB2FCWzuVcemZD_RKWd = document.querySelector('.ZkB2FCWzuVcemZD_RKWd');
        if (ZkB2FCWzuVcemZD_RKWd) {
            ZkB2FCWzuVcemZD_RKWd.remove();
        }

        firstBelowTheEditBar = bodyNotContainThenQuery(firstBelowTheEditBar, '.pStAbHgTdAlDVUlpMOGP');
        if (firstBelowTheEditBar) { firstBelowTheEditBar.remove(); }

        secondBelowTheEditBar = bodyNotContainThenQuery(secondBelowTheEditBar, '.RFqvgJWAYggvoBpHs2cU._dMuc1A3gGA7leIE6moV');
        if (secondBelowTheEditBar) { secondBelowTheEditBar.remove(); }
    }, 100);
})();

// 优化编辑栏样式
(() => {
    // 编辑栏
    let editBar = document.querySelector('.k5ePpJvczIMzaNIaOwKS');

    // 额外样式
    const styles = {
        borderWidth: '2px',
        borderRadius: '16px',
        transition: 'border 0.15s ease-out'
    }

    setInterval(() => {

        // 如果页面 [更新] 就需要重新寻找
        editBar = bodyNotContainThenQuery(editBar, '.k5ePpJvczIMzaNIaOwKS');

        if (editBar) {
            setElementStyles(editBar, styles);

            let textarea = editBar.firstElementChild.firstElementChild;
            if (textarea) {
                textarea.placeholder = '请输入你的问题';
            }
        }
    }, 100);
})();


/**
 * @param {Element} element 
 * @param {String} action 
 * @returns {Element|null}
 */
function bodyNotContainThenQuery(element, selectors) {
    if (!document.body.contains(element)) {
        return document.body.querySelector(selectors);
    }
    return element;
}


/**
 * @param {Element} element 目标元素
 * @param {{}} styles 目标样式
 */
function setElementStyles(element, styles) {
    if (!element) return;
    Object.keys(styles).forEach(key => {
        element.style[key] = styles[key];
    });
}