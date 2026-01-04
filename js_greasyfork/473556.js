// ==UserScript==
// @name        Katakana To Pronunciation
// @description Convert gairaigo (Japanese loan words) back to Pronunciation
// @author      一生的等待
// @license     MIT
// @copyright   2023, Katakana Terminator Contributors (https://github.com/mrdhr/katakana-terminator/graphs/contributors)
// @namespace   https://github.com/mrdhr
// @homepageURL https://github.com/mrdhr/katakana-terminator
// @supportURL  https://greasyfork.org/zh-CN/scripts/473556/feedback
// @icon        https://upload.wikimedia.org/wikipedia/commons/2/28/Ja-Ruby.png
// @match       *://*/*
// @exclude     *://*.bilibili.com/video/*
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require     https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     translate.google.cn
// @connect     translate.google.com
// @connect     translate.googleapis.com
// @connect     trans.mrdvh.com
// @version     2023.11.15
// @name:ja-JP  カタカナターミネーター
// @name:zh-CN  片假名终结者
// @description:zh-CN 在网页中的日语外来语上方标注读音,修改自"https://github.com/Arnie97/katakana-terminator"
// @downloadURL https://update.greasyfork.org/scripts/473556/Katakana%20To%20Pronunciation.user.js
// @updateURL https://update.greasyfork.org/scripts/473556/Katakana%20To%20Pronunciation.meta.js
// ==/UserScript==
// define some shorthands
const _ = document;

let queue = {};  // {"カタカナ": [rtNodeA, rtNodeB]}
let cachedTranslations = {};  // {"ターミネーター": "Terminator"}
let newNodes = [_.body];

// Recursively traverse the given node and its descendants (Depth-first search)
const scanTextNodes = (node) => {
    // The node could have been detached from the DOM tree
    if (!node.parentNode || !_.body.contains(node)) {
        return;
    }

    // Ignore text boxes and echoes
    const excludeTags = {ruby: true, script: true, select: true, textarea: true};

    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) {
                return;
            }
            return node.childNodes.forEach(scanTextNodes);

        case Node.TEXT_NODE:
            while ((node = addRuby(node))) ;
    }
};

// Recursively add ruby tags to text nodes
const addRuby = (node) => {
    const katakana = /[\u30A1-\u30FA\u30FD-\u30FF][\u3099\u309A\u30A1-\u30FF]*[\u3099\u309A\u30A1-\u30FA\u30FC-\u30FF]|[\uFF66-\uFF6F\uFF71-\uFF9D][\uFF65-\uFF9F]*[\uFF66-\uFF9F]/;
    let match;
    if (!node.textContent || !(match = katakana.exec(node.textContent))) {
        return false;
    }
    const ruby = _.createElement('ruby');

    // 添加背景色和透明度
    const backgroundColor = GM_getValue('backgroundColor') || '#ffff00';
    const transparentBackground = GM_getValue('transparentBackground') || false;
    ruby.style.backgroundColor = backgroundColor;

    if (transparentBackground) {
        ruby.style.background = `rgba(255, 255, 0, 0)`;
    }

    ruby.appendChild(_.createTextNode(match[0]));
    const rt = _.createElement('rt');
    rt.classList.add('katakana-terminator-rt');
    ruby.appendChild(rt);

    // Append the ruby title node to the pending-translation queue
    queue[match[0]] = queue[match[0]] || [];
    queue[match[0]].push(rt);

    // <span>[startカナmiddleテストend]</span> =>カナmiddleテストend]</span> =
    // <span>start<ruby>カナ<rt data-rt="Kana"></rt></ruby>[middleテストend]</span>
    const after = node.splitText(match.index);
    node.parentNode.insertBefore(ruby, after);
    after.textContent = after.textContent.substring(match[0].length);
    return after;
};

// Split word list into chunks to limit the length of API requests
const translateTextNodes = () => {
    let apiRequestCount = 0;
    let phraseCount = 0;
    const chunkSize = 200;
    let chunk = [];

    for (const phrase in queue) {
        phraseCount++;
        if (phrase in cachedTranslations) {
            updateRubyByCachedTranslations(phrase);
            continue;
        }

        chunk.push(phrase);
        if (chunk.length >= chunkSize) {
            apiRequestCount++;
            googleTranslate('ja', 'en', chunk);
            chunk = [];
        }
    }

    if (chunk.length) {
        apiRequestCount++;
        googleTranslate('ja', 'en', chunk);
    }

    if (phraseCount) {
        console.debug('Katakana Terminator:', phraseCount, 'phrases translated in', apiRequestCount, 'requests, frame', window.location.href);
    }
};

// {"keyA": 1, "keyB": 2} => "?keyA=1&keyB=2"
const buildQueryString = (params) => {
    return '?' + Object.keys(params).map((k) => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
};

// Google Dictionary API, https://github.com/ssut/py-googletrans/issues/268
const googleTranslate = (srcLang, destLang, phrases) => {
    // Prevent duplicate HTTP requests before the request completes
    phrases.forEach((phrase) => {
        cachedTranslations[phrase] = null;
    });

    const joinedText = phrases.join('\n').replace(/\s+$/, '');
    const api = 'https://trans.mrdvh.com/convert';
    const params = {
        text: joinedText
    };

    GM_xmlhttpRequest({
        method: "POST",
        url: api + buildQueryString(params),
        onload: (dom) => {
            try {
                const resp = JSON.parse(dom.responseText.replace("'", '\u2019'));
                resp[0].forEach((item) => {
                    const translated = item[0].replace(/\s+$/, '');
                    const original = item[1].replace(/\s+$/, '');
                    cachedTranslations[original] = translated;
                    updateRubyByCachedTranslations(original);
                });
            } catch (err) {
                console.error('Katakana Terminator: invalid response', dom.responseText, err);
                return;
            }
        },
        onerror: (dom) => {
            console.error('Katakana Terminator: request error', dom.statusText);
        },
    });
};

// Clear the pending-translation queue
const updateRubyByCachedTranslations = (phrase) => {
    if (!cachedTranslations[phrase]) {
        return;
    }
    (queue[phrase] || []).forEach((node) => {
        node.dataset.rt = cachedTranslations[phrase];
    });
    delete queue[phrase];
};

// Watch newly added DOM nodes, and save them for later use
const mutationHandler = (mutationList) => {
    mutationList.forEach((mutationRecord) => {
        mutationRecord.addedNodes.forEach((node) => {
            newNodes.push(node);
        });
    });
};

// 主函数
const main = () => {
    GM_addStyle("rt.katakana-terminator-rt::before { content: attr(data-rt); }");

    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(mutationHandler);
        observer.observe(_.body, {childList: true, subtree: true});
    }

    const rescanTextNodes = () => {
        // Deplete buffered mutations
        mutationHandler(observer.takeRecords());
        if (!newNodes.length) {
            return;
        }

        console.debug('Katakana Terminator:', newNodes.length, 'new nodes were added, frame', window.location.href);
        newNodes.forEach(scanTextNodes);
        newNodes.length = 0;
        translateTextNodes();
    };

    // Limit the frequency of API requests
    rescanTextNodes();
    setInterval(rescanTextNodes, 500);
    GM_registerMenuCommand('打开设置对话框', showSettingsDialog);
};

// 显示设置对话框
const showSettingsDialog = () => {
    const backgroundColor = GM_getValue('backgroundColor') || '#ffff00';
    const transparentBackground = GM_getValue('transparentBackground') || false;

    // 添加变暗效果
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlayDiv.style.zIndex = '9998';
    document.body.appendChild(overlayDiv);

    const dialogHTML = `
        <div id="katakana-terminator-settings-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0); width: 250px; height: 150px; padding: 20px; background-color: white; border: 1px solid #ccc; z-index: 9999; text-align: center; border-radius: 10px; animation: fadeIn 0.3s ease-out forwards;">
            <h3 style="margin-bottom: 20px; font-size: 1.5em;">设置</h3>
            <div style="display: flex; align-items: center; justify-content: center;">
                <label for="backgroundColor" style="margin-right: 10px; font-size: 1em;">背景色：</label>
                <input type="color" id="backgroundColor" name="backgroundColor" value="${backgroundColor}" style="margin-right: 10px;">
                <label for="transparentBackground" style="font-size: 1em;">背景透明：</label>
                <input type="checkbox" id="transparentBackground" name="transparentBackground" ${transparentBackground ? 'checked' : ''} style="margin-top: 2px;">
            </div>
            <button id="saveSettings" style="margin-top: 20px; margin-right: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;">保存设置</button>
            <button id="closeSettingsDialog" style="margin-top: 20px; margin-left: 10px; padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;">关闭</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // 监听保存设置按钮的点击事件
    document.getElementById('saveSettings').addEventListener('click', () => {
        saveSettingsAndRefresh();
    });

    // 监听关闭设置对话框按钮的点击事件
    document.getElementById('closeSettingsDialog').addEventListener('click', () => {
        hideSettingsDialog();
        document.body.removeChild(overlayDiv); // 移除变暗效果
    });

    // 添加缩放动画的CSS样式
    GM_addStyle(`
        @keyframes fadeIn {
            from {
                transform: translate(-50%, -50%) scale(0);
            }
            to {
                transform: translate(-50%, -50%) scale(1);
            }
        }

        @keyframes fadeOut {
            from {
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                transform: translate(-50%, -50%) scale(0);
            }
        }
    `);
};

// 关闭设置对话框
const hideSettingsDialog = () => {
    const dialog = document.getElementById('katakana-terminator-settings-dialog');
    if (dialog) {
        dialog.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            dialog.remove();
        }, 300); // 等待动画结束后移除对话框
    }
};

// Polyfill for Greasemonkey 4
if (typeof GM_xmlhttpRequest === 'undefined' &&
    typeof GM === 'object' && typeof GM.xmlHttpRequest === 'function') {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

if (typeof GM_addStyle === 'undefined') {
    GM_addStyle = function (css) {
        const head = _.getElementsByTagName('head')[0];
        if (!head) {
            return null;
        }

        const style = _.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    };
}

// Polyfill for ES5
if (typeof NodeList.prototype.forEach === 'undefined') {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

main();
