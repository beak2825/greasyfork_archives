// ==UserScript==
// @name         メッセージ欄定型文入力補助
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  a
// @match        https://main.next-engine.com/Userjyuchu/jyuchuInp*
// @grant        GM_xmlhttpRequest
// @connect      tk2-217-18298.vs.sakura.ne.jp
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544049/%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E6%AC%84%E5%AE%9A%E5%9E%8B%E6%96%87%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/544049/%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E6%AC%84%E5%AE%9A%E5%9E%8B%E6%96%87%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    *, *::before, *::after {
    box-sizing: border-box;
}
.template2-list-popup {
    overflow-y: auto;
    overflow-x: hidden;
}
.template2-content {
    width: auto;
}
.template2-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 17px;
    width: auto;
    padding-bottom: 2px;
    margin-left: 3px;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 7px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.template2-btn:hover {
    background: #e5fbe6;
}
.template2-list-popup {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px 18px 10px 16px;
    z-index: 10099;
    position: fixed;
    top: 18px;
    right: 24px;
    width: 600px;
    max-width: 95vw;
    max-height: 420px;
    overflow: auto;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18);
    display: none;
    border-radius: 10px;
    font-size: 13px;
}
.template2-div {
    padding: 7px 0 2px 0;
    border-top: 1px solid #eee;
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
}
.template2-div:first-child { border-top: none; }
.template2-header-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.6em;
}

.title-text-div {flex-grow:1;cursor:pointer;}
.template2-content {
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition: height 0.3s, opacity 0.3s;
    font-size: 13px;
    padding-left: 8px;
    color: #333;
    margin-top: 2px;
}
.template2-content.show {
    height: auto;
    opacity: 1;
    padding: 8px 0 6px 8px;
}
.paste-button-template2 {
    background: #fff;
    color: #0d7b3e;
    border: 1px solid #7ed17e;
    cursor: pointer;
    border-radius: 5px;
    font-size: 15px;
    width: 25px;
    height: 25px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    margin-top: 0;
    margin-bottom: 0;
}
.paste-button-template2::before { content: '📝'; font-size: 16px; }
.paste-button-template2:hover { background: #c6f7cb; }
.editable-textarea {
    width: 98%;
    min-height: 125px;
    font-size: 14px;
    margin: 0 0 0 0;
    box-sizing: border-box;
    resize: vertical;
    border-radius: 5px;
    border: 1px solid #d1d6e0;
    padding: 7px;
}
.template2-title {
    font-weight: bold;
    font-size: 16px;
    color: #244c8b;
    margin-right: 6px;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
}
.no-content-label2 {
    color: #aaa;
    font-style: italic;
}
.editable-label2 {
    font-size: 12px;
    color: #24996e;
    margin: 0 0 0 4px;
    padding: 2px 7px;
    background: #e6f5ec;
    border-radius: 7px;
    display: inline-block;
    vertical-align: middle;
    font-weight: normal;
}
.template2-clickable-group:hover {
    transform: translateY(-1.5px);
}
.spinner2 {
  display: inline-block;
  width: 28px;
  height: 28px;
  vertical-align: middle;
}
.spinner2:after {
  content: " ";
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #74c97f;
  border-color: #74c97f transparent #74c97f transparent;
  animation: spinner-anim 1.2s linear infinite;
}
@keyframes spinner-anim2 {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
    `);

    const TEMPLATE_URL = 'http://tk2-217-18298.vs.sakura.ne.jp/issues/409075';

    let templates = [];
    let templatesLoaded = false;
    let loadingError = "";
    let currentPopupDiv = null;

    function parseTemplatesFromText(rawText) {
        const blocks = rawText.split(/-{3,}/).map(s => s.trim()).filter(Boolean);
        const result = [];

        for (const block of blocks) {
            const titleMatch = block.match(/^タイトル：([^\r\n]+)/m);
            const editMatch = block.match(/^編集：(可能|不可)/m);
            const bodyMatch = block.match(/^本文：([\s\S]*)$/m);

            const titleText = titleMatch ? titleMatch[1].trim() : '';
            const editable = editMatch ? (editMatch[1] === '可能') : false;

            let body = '';
            if (bodyMatch) {
                body = bodyMatch[1].trim();
            } else {
                body = '';
            }

            if (body === '無し') {
                body = '';
            } else {
                body = body.trim();
            }

            if (!titleText) continue;

            result.push({
                titleText: titleText,
                fullText: body,
                editable: editable,
                body: body
            });
        }
        return result;
    }

    function fetchTemplates(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: function(response) {
                try {
                    const finalUrl = response.finalUrl || response.responseURL || url;
                    if (finalUrl.includes('/login')) {
                        loadingError = "[認証エラー] Redmine未ログインのためテンプレート取得不可です。ログインしてください。";
                        return callback([]);
                    }
                    if (response.status !== 200) {
                        loadingError = `[エラー] ステータス: ${response.status} で取得失敗`;
                        return callback([]);
                    }
                    if (!response.responseText) {
                        loadingError = "[エラー] ページ内容が空です。";
                        return callback([]);
                    }
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    if (!doc) {
                        loadingError = "[エラー] DOMパース失敗。";
                        return callback([]);
                    }
                    const descriptionDiv = doc.querySelector('div.description');
                    if (!descriptionDiv) {
                        loadingError = "[エラー] class='description' が見つかりません";
                        return callback([]);
                    }
                    const wikiDiv = descriptionDiv.querySelector('.wiki');
                    if (!wikiDiv) {
                        loadingError = "[エラー] class='wiki' が見つかりません（description内）";
                        return callback([]);
                    }
                    let wikiText = wikiDiv.innerHTML
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>\s*<p>/gi, '\n\n')
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<\/p>/gi, '')
                    .replace(/<[^>]+>/g, '');

                    const list = parseTemplatesFromText(wikiText);
                    if(list.length === 0){
                        loadingError = "[注意] テンプレートが空です。";
                    }
                    callback(list);
                } catch (e) {
                    loadingError = "[例外エラー] " + e;
                    callback([]);
                }
            },
            onerror: function() {
                loadingError = "[通信エラー] 通信エラーでテンプレートを取得できません。";
                callback([]);
            },
            ontimeout: function() {
                loadingError = "[タイムアウト] タイムアウトでテンプレートを取得できません。";
                callback([]);
            }
        });
    }

    function createPopupTemplateList(getTargetInput, templates) {
        let popupDiv = document.getElementById('template2-popup');
        if (popupDiv) popupDiv.remove();

        popupDiv = document.createElement('div');
        popupDiv.className = 'template2-list-popup';
        popupDiv.id = 'template2-popup';

        if (!templatesLoaded && !loadingError) {
            const loadingDiv = document.createElement('div');
            loadingDiv.style.display = 'flex';
            loadingDiv.style.alignItems = 'center';
            loadingDiv.style.gap = '10px';

            const spinner = document.createElement('span');
            spinner.className = 'spinner';
            loadingDiv.appendChild(spinner);

            const loadingText = document.createElement('span');
            loadingText.textContent = 'テンプレート取得中...';
            loadingDiv.appendChild(loadingText);

            popupDiv.appendChild(loadingDiv);
        } else if (loadingError) {
            popupDiv.textContent = loadingError;
        } else if (templates.length === 0) {
            popupDiv.textContent = 'テンプレートが見つかりません';
        } else {
            templates.forEach((template, i) => {
                const templateDiv = document.createElement('div');
                templateDiv.className = 'template2-div';

                const headerRow = document.createElement('div');
                headerRow.className = 'template2-header-row';

                const clickableGroup = document.createElement('span');
                clickableGroup.style.display = 'inline-flex';
                clickableGroup.style.alignItems = 'center';
                if (template.fullText) {
                    clickableGroup.className = 'template2-clickable-group';
                    clickableGroup.style.cursor = 'pointer';
                }

                if (template.fullText) {
                    const icon = document.createElement('span');
                    icon.textContent = '🗒️';
                    icon.style.fontSize = '20px';
                    icon.style.marginRight = '3px';
                    icon.style.verticalAlign = 'middle';
                    clickableGroup.appendChild(icon);
                }

                const titleSpan = document.createElement('span');
                titleSpan.className = 'template2-title';
                titleSpan.textContent = template.titleText;
                clickableGroup.appendChild(titleSpan);

                if (template.fullText && template.editable) {
                    const editableLabel = document.createElement('span');
                    editableLabel.className = 'editable-label2';
                    editableLabel.style.marginLeft = '7px';
                    editableLabel.textContent = '編集可能';
                    clickableGroup.appendChild(editableLabel);
                }

                if (template.fullText) {
                    clickableGroup.addEventListener('click', function () {
                        templateContentDiv.classList.toggle('show');
                    });
                }

                const pasteButton = document.createElement('button');
                pasteButton.type = 'button';
                pasteButton.className = 'paste-button-template2';
                pasteButton.title = '貼り付け';
                pasteButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    const targetInput = getTargetInput();
                    let text = template.fullText ? template.fullText : template.titleText;
                    if (targetInput) {
                        if (targetInput.value) targetInput.value += '\n' + text;
                        else targetInput.value = text;
                        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        alert('id="bikou" の要素が見つかりません');
                    }
                    popupDiv.style.display = 'none';
                });

                headerRow.appendChild(clickableGroup);
                headerRow.appendChild(pasteButton);
                templateDiv.appendChild(headerRow);

                let templateContentDiv = document.createElement('div');
                templateContentDiv.className = 'template2-content';
                templateContentDiv.style.whiteSpace = 'pre-wrap';

                if (template.fullText && template.editable) {
                    const textarea = document.createElement('textarea');
                    textarea.className = 'editable-textarea';
                    textarea.value = template.body;
                    textarea.addEventListener('input', (e) => {
                        template.fullText = textarea.value;
                    });
                    templateContentDiv.appendChild(textarea);
                } else if (template.fullText) {
                    templateContentDiv.textContent = template.fullText;
                }

                popupDiv.appendChild(templateDiv);
                if (template.fullText) popupDiv.appendChild(templateContentDiv);
            });

        }

        document.body.appendChild(popupDiv);
        return popupDiv;
    }

    function insertTemplateButton() {
        const targetTd = Array.from(document.querySelectorAll('td.group_head'))
        .find(td => td.textContent.includes('備考'));
        if (!targetTd) return;
        if (targetTd.querySelector('.template2-btn')) return;

        targetTd.style.position = "relative";

        const getTargetInput = () => document.getElementById('message');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'template2-btn';
        btn.title = 'テンプレート挿入';
        btn.innerText = 'メッセージ定型文';

        btn.style.position = "absolute";
        btn.style.top = "1px";
        btn.style.left = "65px";
        btn.style.zIndex = "10";

        btn.onclick = e => {
            e.stopPropagation();

            if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
                currentPopupDiv.style.display = 'none';
                currentPopupDiv = null;
                return;
            }

            currentPopupDiv = createPopupTemplateList(getTargetInput, templates);
            currentPopupDiv.style.display = 'block';

            function closePopup(ev) {
                if (!currentPopupDiv.contains(ev.target) && ev.target !== btn) {
                    currentPopupDiv.style.display = 'none';
                    document.removeEventListener('mousedown', closePopup);
                    currentPopupDiv = null;
                }
            }
            setTimeout(() => {
                document.addEventListener('mousedown', closePopup);
            });

            function escClose(ev) {
                if (ev.key === 'Escape') {
                    currentPopupDiv.style.display = 'none';
                    document.removeEventListener('keydown', escClose);
                    document.removeEventListener('mousedown', closePopup);
                    currentPopupDiv = null;
                }
            }
            document.addEventListener('keydown', escClose);
        };

        const openLink = targetTd.querySelector('a#bikou_sw');
        if (openLink) {
            openLink.after(btn);
        } else {
            targetTd.appendChild(btn);
        }
    }

    const getTargetInput = () => document.getElementById('message');

    function updatePopupIfOpen() {
        if (currentPopupDiv && currentPopupDiv.style.display === 'block') {
            document.removeEventListener('keydown', escClose);
            const newPopupDiv = createPopupTemplateList(getTargetInput, templates);
            newPopupDiv.style.display = 'block';
            currentPopupDiv.replaceWith(newPopupDiv);
            currentPopupDiv = newPopupDiv;

            function closePopup(ev) {
                if (!currentPopupDiv.contains(ev.target)) {
                    currentPopupDiv.style.display = 'none';
                    document.removeEventListener('mousedown', closePopup);
                    document.removeEventListener('keydown', escClose);
                    currentPopupDiv = null;
                }
            }
            setTimeout(() => {
                document.addEventListener('mousedown', closePopup);
            });

            function escClose(ev) {
                if (ev.key === 'Escape') {
                    currentPopupDiv.style.display = 'none';
                    document.removeEventListener('keydown', escClose);
                    document.removeEventListener('mousedown', closePopup);
                    currentPopupDiv = null;
                }
            }
            document.addEventListener('keydown', escClose);
        }
    }

    insertTemplateButton();

    fetchTemplates(TEMPLATE_URL, function(list) {
        templates = list;
        templatesLoaded = true;
        updatePopupIfOpen();
    });

})();
