// ==UserScript==
// @name         自动复制选中文本和解除复制限制
// @name:zh-CN  自动复制选中文本和解除复制限制
// @name:zh-TW  自動複製選中文本和解除複製限制
// @name:en     Auto Copy Selected Text and Remove Copy Restrictions
// @name:ja     選択したテキストを自動コピーし、コピー制限を解除
// @name:ko     선택한 텍스트 자동 복사 및 복사 제한 해제
// @description  在任意网站选中任意文本时自动复制, 并提供设置选项以启用/禁用解除网站的复制限制和自动复制功能, 以及显示/隐藏按钮
// @description:zh-CN  在任意网站选中任意文本时自动复制, 并提供设置选项以启用/禁用解除网站的复制限制和自动复制功能, 以及显示/隐藏按钮
// @description:zh-TW  在任何網站選中任意文本時自動複製, 並提供設置選項以啟用/禁用解除網站的複製限制和自動複製功能, 以及顯示/隱藏按鈕
// @description:en     Automatically copy selected text on any website and provide options to enable/disable removal of copy restrictions and auto copy functionality, as well as show/hide button
// @description:ja     任意のウェブサイトで選択したテキストを自動的にコピーし、コピー制限の解除と自動コピー機能の有効/無効、表示/非表示ボタンの設定オプションを提供します
// @description:ko     모든 웹사이트에서 선택한 텍스트를 자동 복사하며, 웹사이트의 복사 제한 해제 및 자동 복사 기능 활성화/비활성화, 버튼 표시/숨기기 설정 옵션을 제공합니다
// @author       lbihhe
// @license      MIT
// @icon         https://img.icons8.com/nolan/64/password1.png
// @version      4.0.1
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/497808/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%92%8C%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/497808/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%92%8C%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(() => {
    'use strict';
/*!
MIT License

Copyright (c) [2024] [gura8390]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


    /*** 国际化部分 ***/
    const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const language = userLang.startsWith('zh')
      ? 'zh'
      : userLang.startsWith('ja')
      ? 'ja'
      : userLang.startsWith('es')
      ? 'es'
      : 'en';

    const messages = {
        zh: {
            enableCopy: '🔓解除复制限制并启用自动复制',
            disableCopy: '🔒禁用复制功能及复制限制',
            copyTextAlert: '选中文本已复制到剪贴板',
            copyHTMLAlert: '选中的 HTML 已复制到剪贴板',
            copyFailureAlert: '复制失败',
            copyExceptionAlert: '复制过程中出现异常: ',
            invalidCopyFormatAlert: '无效的复制格式，保留当前设置。',
            copyFormatPrompt: '请选择复制格式（text: 纯文本, html: HTML, link: 链接和文本）:',
            toggleShowButton: '设置显示/隐藏解除复制限制按钮',
            setCopyFormat: '设置复制格式'
        },
        en: {
            enableCopy: '🔓Enable Copy Restrictions and Auto Copy',
            disableCopy: '🔒Disable Copy Restrictions and Auto Copy',
            copyTextAlert: 'Selected text copied to clipboard',
            copyHTMLAlert: 'Selected HTML copied to clipboard',
            copyFailureAlert: 'Copy failed',
            copyExceptionAlert: 'Exception during copy: ',
            invalidCopyFormatAlert: 'Invalid copy format, retaining current settings.',
            copyFormatPrompt: 'Please select copy format (text: Plain text, html: HTML, link: Link and text):',
            toggleShowButton: 'Toggle Show/Hide Copy Restrictions Button',
            setCopyFormat: 'Set Copy Format'
        },
        ja: {
            enableCopy: '🔓コピー制限を解除し、自動コピーを有効化',
            disableCopy: '🔒コピー制限と自動コピーを無効にする',
            copyTextAlert: '選択したテキストがクリップボードにコピーされました',
            copyHTMLAlert: '選択したHTMLがクリップボードにコピーされました',
            copyFailureAlert: 'コピー失敗',
            copyExceptionAlert: 'コピー中に例外が発生しました: ',
            invalidCopyFormatAlert: '無効なコピー形式です。現在の設定を保持します。',
            copyFormatPrompt: 'コピー形式を選択してください（text: プレーンテキスト, html: HTML, link: リンクとテキスト）:',
            toggleShowButton: 'コピー制限ボタンの表示/非表示切替',
            setCopyFormat: 'コピー形式を設定'
        },
        es: {
            enableCopy: '🔓Habilitar restricciones de copia y auto-copia',
            disableCopy: '🔒Deshabilitar restricciones de copia y auto-copia',
            copyTextAlert: 'Texto seleccionado copiado al portapapeles',
            copyHTMLAlert: 'HTML seleccionado copiado al portapapeles',
            copyFailureAlert: 'Error al copiar',
            copyExceptionAlert: 'Excepción durante la copia: ',
            invalidCopyFormatAlert: 'Formato de copia no válido, se mantienen los ajustes actuales.',
            copyFormatPrompt: 'Seleccione el formato de copia (text: Texto plano, html: HTML, link: Enlace y texto):',
            toggleShowButton: 'Alternar mostrar/ocultar botón de restricciones de copia',
            setCopyFormat: 'Establecer formato de copia'
        }
    };

    const t = key => (messages[language] && messages[language][key]) || messages.en[key];
    console.log(`当前语言: ${language}, 显示文本:`, t('enableCopy'));

    /******** 针对特定网站（doc88.com）的处理 ********/
    let doc88Path = "";
    const websiteRuleDoc88 = {
        regexp: /.*doc88\.com\/.+/,
        init: () => {
            const style = document.createElement('style');
            style.id = "copy-element-hide";
            style.textContent = "#left-menu{display: none !important;}";
            document.head.appendChild(style);

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://res3.doc88.com/resources/js/modules/main-v2.min.js?v=2.56",
                onload: response => {
                    const result = /\("#cp_textarea"\).val\(([\S]*?)\);/.exec(response.responseText);
                    if (result) {
                        doc88Path = result[1];
                    }
                }
            });

            window.addEventListener("load", () => {
                const cpFn = unsafeWindow.copyText?.toString();
                const fnResult = cpFn && /<textarea[\s\S]*?>'\+([\S]*?)\+"<\/textarea>/.exec(cpFn);
                if (fnResult) {
                    doc88Path = fnResult[1];
                }
            });
        },
        getSelectedText: () => {
            let select = unsafeWindow;
            doc88Path.split(".").forEach(v => {
                select = select?.[v];
            });
            if (!select) {
                unsafeWindow.Config.vip = 1;
                unsafeWindow.Config.logined = 1;
                document.getElementById("copy-element-hide")?.remove();
            }
            return select;
        }
    };

    /******** 针对百度文库（wenku.baidu.com）的特殊优化 ********/
    const websiteRuleWenku = {
        regexp: /wenku\.baidu\.com\/(view|link|aggs).*/,
        canvasDataGroup: [],
        init: function() {
            // 添加打印相关样式（可选）
            const style = document.createElement("style");
            style.textContent = `@media print { body{ display:block; } }`;
            document.head.appendChild(style);

          // 获取 canvas 的原始 2D 上下文原型
            const originObject = {
                context2DPrototype: Object.getPrototypeOf(unsafeWindow.document.createElement("canvas").getContext("2d"))
            };


            // 劫持 document.createElement，当创建 canvas 时覆盖 fillText 方法，捕获绘制文字
            document.createElement = new Proxy(document.createElement, {
                apply: function(target, thisArg, argumentsList) {
                    const element = Reflect.apply(target, thisArg, argumentsList);
                    if (argumentsList[0] === "canvas") {
                        const tmpData = {
                            canvas: element,
                            data: []
                        };
                        const context = element.getContext("2d");
                        const originalFillText = originObject.context2DPrototype.fillText;
                        context.fillText = function(...args) {
                            tmpData.data.push(args);
                            return originalFillText.apply(this, args);
                        };
                        websiteRuleWenku.canvasDataGroup.push(tmpData);
                    }
                    return element;
                }
            });

            // 伪造 VIP 信息，劫持全局 pageData
            let pageData = {};
            Object.defineProperty(unsafeWindow, "pageData", {
                set: (v) => { pageData = v; },
                get: function() {
                    if (!pageData.vipInfo) pageData.vipInfo = {};
                    pageData.vipInfo.global_svip_status = 1;
                    pageData.vipInfo.global_vip_status = 1;
                    pageData.vipInfo.isVip = 1;
                    pageData.vipInfo.isWenkuVip = 1;
                    return pageData;
                }
            });

        },
        getSelectedText: function() {
            // 尝试从捕获的 canvas 数据中重构文本
            let text = "";
            if (this.canvasDataGroup.length > 0) {
                this.canvasDataGroup.forEach(item => {
                    item.data.forEach(args => {
                        text += args[0] + " ";
                    });
                });
                text = text.trim();
            }
            // 如果没有捕获到，则退化为正常的页面选中内容
            if (!text) {
                text = window.getSelection().toString().trim();
            }
            return text;
        }
    };

    // 如果当前页面为 doc88 或百度文库，则执行相应初始化
    if (websiteRuleDoc88.regexp.test(window.location.href)) {
        websiteRuleDoc88.init();
    }
    if (websiteRuleWenku.regexp.test(window.location.href)) {
        websiteRuleWenku.init();
        // 百度文库页面不需要右下角复制按钮（直接抛弃）
        // 后续 autoCopyHandler 会调用 websiteRuleWenku.getSelectedText() 来获取文本
    }

/******** 读取存储的设置 ********/
const copyState = {
    enabled: GM_getValue('enabled', false),
    showButton: GM_getValue('showButton', true),
    copyFormat: GM_getValue('copyFormat', 'text'),
    showAlert: GM_getValue('showAlert', true)
};

/******** 全局变量 ********/
let button = null; // 提前声明按钮变量

/******** 定义切换复制状态的函数 ********/
function toggleCopyState() {
    if (copyState.enabled) {
        disableCopy();
        if (button) button.innerHTML = t('enableCopy');
    } else {
        enableCopy();
        if (button) button.innerHTML = t('disableCopy');
    }
    copyState.enabled = !copyState.enabled;
    GM_setValue('enabled', copyState.enabled);
}

/******** 定义其他函数 ********/
const stopPropagation = e => e.stopPropagation();

// 自动复制处理：根据当前页面分别调用特殊处理的获取文本方法
const autoCopyHandler = () => {
    let selectedText = "";
    if (websiteRuleDoc88.regexp.test(window.location.href)) {
        selectedText = websiteRuleDoc88.getSelectedText();
    } else if (websiteRuleWenku.regexp.test(window.location.href)) {
        selectedText = websiteRuleWenku.getSelectedText();
    } else {
        selectedText = window.getSelection().toString().trim();
    }
    if (selectedText) {
        switch (copyState.copyFormat) {
            case 'text':
                copyTextToClipboard(selectedText);
                break;
            case 'html':
                copyHTMLToClipboard(selectedText);
                break;
            case 'link':
                copyTextToClipboard(`${selectedText}\n${window.location.href}`);
                break;
            default:
                copyTextToClipboard(selectedText);
                break;
        }
    }
};

const copyTextToClipboard = textContent => {
    const tempTextarea = document.createElement('textarea');
    Object.assign(tempTextarea.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '2em',
        height: '2em',
        padding: '0',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent'
    });
    tempTextarea.value = textContent;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    try {
        const successful = document.execCommand('copy');
        showAlert(successful ? t('copyTextAlert') : t('copyFailureAlert'));
    } catch (err) {
        showAlert(t('copyExceptionAlert') + err);
    }
    document.body.removeChild(tempTextarea);
};

const copyHTMLToClipboard = htmlContent => {
    const tempDiv = document.createElement('div');
    Object.assign(tempDiv.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '2em',
        height: '2em',
        padding: '0',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent'
    });
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
        const successful = document.execCommand('copy');
        showAlert(successful ? t('copyHTMLAlert') : t('copyFailureAlert'));
    } catch (err) {
        showAlert(t('copyExceptionAlert') + err);
    }
    document.body.removeChild(tempDiv);
};

const showAlert = message => {
    if (!copyState.showAlert) return;
    const alertBox = document.createElement('div');
    alertBox.innerText = message;
    Object.assign(alertBox.style, {
        position: 'fixed',
        bottom: '70px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: '微软雅黑, Arial, sans-serif',
        fontSize: '14px',
        zIndex: '9999'
    });
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
};

const enableCopy = () => {
    ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress', 'oncopy', 'oncut', 'onpaste']
        .forEach(event => document.addEventListener(event, stopPropagation, true));

    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        * {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
            pointer-events: auto !important;
            -webkit-touch-callout: default !important;
        }
    `;
    document.head.appendChild(style);

    if (document.body) {
        document.body.oncontextmenu = null;
    }

    const frames = [
        ...document.getElementsByTagName('iframe'),
        ...document.getElementsByTagName('object'),
        ...document.getElementsByTagName('embed')
    ];
    frames.forEach(frame => {
        try {
            const frameDoc = frame.contentWindow.document;
            ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress']
                .forEach(event => frameDoc.addEventListener(event, stopPropagation, true));
        } catch (e) {
            console.error('无法访问框架内容:', e);
        }
    });

    document.addEventListener('mouseup', autoCopyHandler, true);
};

const disableCopy = () => {
    ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress', 'oncopy', 'oncut', 'onpaste']
        .forEach(event => document.removeEventListener(event, stopPropagation, true));

    document.querySelectorAll('style').forEach(style => {
        if (style.textContent.includes('-webkit-user-select: auto !important')) {
            style.remove();
        }
    });
    document.removeEventListener('mouseup', autoCopyHandler, true);
};

function createButton() {
    // 如果是百度文库页面，则不创建按钮（直接抛弃）
    if (websiteRuleWenku.regexp.test(window.location.href)) {
        return null;
    }
    const btn = document.createElement('button');
    btn.innerHTML = t('enableCopy');
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        padding: '10px 15px',
        backgroundColor: 'rgba(173, 216, 230, 0.9)',
        color: '#000',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontFamily: '微软雅黑, Arial, sans-serif',
        fontSize: '14px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s'
    });
    btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = 'rgba(135, 206, 235, 0.9)';
        btn.style.transform = 'scale(1.05)';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.backgroundColor = 'rgba(173, 216, 230, 0.9)';
        btn.style.transform = 'scale(1)';
    });
    btn.addEventListener('click', toggleCopyState);
    return btn;
}

/******** 菜单命令注册 ********/
// 切换显示/隐藏按钮
GM_registerMenuCommand(t('toggleShowButton'), () => {
    copyState.showButton = !copyState.showButton;
    GM_setValue('showButton', copyState.showButton);
    if (copyState.showButton) {
        // 如果按钮不存在则创建，否则将按钮添加到 DOM 中
        if (!button) {
            button = createButton();
            copyState.button = button;
        } else if (button && !document.contains(button)) {
            document.body.appendChild(button);
        }
    } else {
        button && button.parentNode && button.parentNode.removeChild(button);
    }
});

// 设置复制格式
GM_registerMenuCommand(t('setCopyFormat'), () => {
    const options = ['text', 'html', 'link'];
    const copyFormat = prompt(t('copyFormatPrompt'), copyState.copyFormat);
    if (options.includes(copyFormat)) {
        copyState.copyFormat = copyFormat;
        GM_setValue('copyFormat', copyState.copyFormat);
    } else {
        alert(t('invalidCopyFormatAlert'));
    }
});

/******** 脚本初始化 ********/
// 延迟按钮创建，确保 DOM 已加载
if (copyState.showButton && !websiteRuleWenku.regexp.test(window.location.href)) {
    window.addEventListener('DOMContentLoaded', () => {
        // 创建并添加按钮到页面
        if (!button) {
            button = createButton();
            copyState.button = button;
        }
        if (button && !document.body.contains(button)) {
            document.body.appendChild(button);
        }
    });
}

// 初始状态：禁用自动复制功能
disableCopy();

})();
