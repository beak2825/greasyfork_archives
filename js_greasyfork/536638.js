// ==UserScript==
// @name         Zelenka Assist
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  BBCode-меню для редактора Zelenka
// @author       OxD5F
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536638/Zelenka%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/536638/Zelenka%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const buttonSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3" /><path d="M7 12h10" /></svg>`;
    const apiSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;
    const censorSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.36 1.81-2.85 3.06-4.01"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.09 0 2.08-.48 2.74-1.24"/><path d="M14.47 14.47A3.5 3.5 0 0 0 12 8.5"/><path d="M23 12c-1.73 3.11-6 7-11 7-1.4 0-2.72-.2-3.97-.56"/></svg>`;
    const codeSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
    const userSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M2 20c0-3.5 4.03-6 10-6s10 2.5 10 6"/></svg>`;
    const templateSVG = `<svg width="20" height="20" fill="none" stroke="#41b883" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>`;


    const srciLanguages = [
      {value: '', label: 'Авто'},
      {value: 'python', label: 'Python'},
      {value: 'ruby', label: 'Ruby'},
      {value: 'perl', label: 'Perl'},
      {value: 'php', label: 'PHP'},
      {value: 'xml', label: 'XML'},
      {value: 'html', label: 'HTML'},
      {value: 'css', label: 'CSS'},
      {value: 'javascript', label: 'JavaScript'},
      {value: 'java', label: 'Java'},
      {value: 'cpp', label: 'C++'},
      {value: 'sql', label: 'SQL'},
      {value: 'smalltalk', label: 'Smalltalk'},
      {value: 'ini', label: 'INI'},
      {value: 'dos', label: 'DOS'},
      {value: 'bash', label: 'Bash'},
      {value: 'diff', label: 'DIFF'}
    ];

    const TEMPLATES = [
      {
        name: 'Продажа товара',
        value: `[B]Заголовок:[/B]
[B]Цена:[/B]
[B]Описание:[/B]
[B]Гарантия:[/B]
[B]Связь:[/B]
[B]Способы оплаты:[/B]`
      },
      {
        name: 'Оказание услуги',
        value: `[B]Вид услуги:[/B]
[B]Опыт работы:[/B]
[B]Портфолио:[/B]
[B]Стоимость:[/B]
[B]Связь:[/B]`
      },
      {
        name: 'Отчет/Жалоба',
        value: `[B]ID пользователя:[/B]
[B]Причина жалобы:[/B]
[B]Описание ситуации:[/B]
[B]Доказательства (скриншоты, переписка):[/B]`
      },
      {
        name: 'Гарант/Проверка',
        value: `[B]Суть сделки:[/B]
[B]Стороны:[/B]
[B]Детали (цена, условия):[/B]
[B]Доказательства:[/B]`
      },
      {
        name: 'AI-сгенерировать шаблон',
        value: '',
        isAi: true
      }
    ];

    const menuTriggers = ['!menu', '!m', '!м', '!меню'];
    let activePopup = null;

    function removePopup() {
        if (activePopup) activePopup.remove();
        activePopup = null;
    }

    function getMenuTriggerPosition(editor, explicit) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        const range = selection.getRangeAt(0).cloneRange();
        let node = range.startContainer;
        let offset = range.startOffset;

        if (explicit && node.nodeType === 3) {
            const tmpRange = document.createRange();
            tmpRange.setStart(node, offset);
            tmpRange.setEnd(node, offset);
            const rects = tmpRange.getClientRects();
            let rect = rects.length ? rects[0] : null;
            return { node, idx: offset, rect, explicitRange: tmpRange };
        }

        if (node.nodeType === 3) {
            const text = node.textContent;
            for (let t of menuTriggers) {
                const idx = text.toLowerCase().lastIndexOf(t, offset);
                if (idx !== -1 && offset >= idx + t.length) {
                    const menuRange = document.createRange();
                    menuRange.setStart(node, idx);
                    menuRange.setEnd(node, idx + t.length);
                    const rects = menuRange.getClientRects();
                    let rect = rects.length ? rects[0] : null;
                    return { node, idx, rect, triggerLength: t.length, trigger: t, range: menuRange };
                }
            }
        }
        return null;
    }

    function positionPopup(popup, rect) {
        let top = 100, left = 300;
        if (rect) {
            top = rect.bottom + window.scrollY + 4;
            left = rect.left + window.scrollX - 8;
        }
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    function showMenuPopup(rect, onSelectButton, onSelectAPI, onSelectCensor, onSelectSRCI, onSelectVisitor, onSelectTemplate) {
        removePopup();
        const popup = document.createElement('div');
        popup.className = 'fr-popup fr-desktop fr-ltr fe-acPopup fr-above fr-active';
        popup.style.zIndex = 9999;
        popup.style.position = 'absolute';
        popup.style.maxWidth = '400px';
        positionPopup(popup, rect);

        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'scroll-wrapper fe-ac fe-ac-user';
        scrollWrapper.style.position = 'relative';

        const scrollContent = document.createElement('div');
        scrollContent.className = 'fe-ac fe-ac-user scroll-content';
        scrollContent.style.maxHeight = '520px';

        function makeMenuItem(svg, label, callback) {
            const div = document.createElement('div');
            div.className = 'fe-ac-user-result fe-ac-result';
            div.style.fontWeight = '600';
            div.style.color = '#41b883';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.gap = '10px';
            div.style.cursor = 'pointer';
            div.style.fontSize = '16px';
            div.style.padding = '10px 18px';
            div.innerHTML = svg + label;
            div.onmouseenter = () => div.style.background = 'rgba(65,184,131,0.08)';
            div.onmouseleave = () => div.style.background = '';
            div.onclick = () => {
                popup.remove();
                callback(rect);
            };
            return div;
        }

        scrollContent.appendChild(makeMenuItem(buttonSVG, 'Вставить кнопку', () => showButtonFormPopup(rect, onSelectButton)));
        scrollContent.appendChild(makeMenuItem(apiSVG, 'Вставить API-блок', () => showApiFormPopup(rect, onSelectAPI)));
        scrollContent.appendChild(makeMenuItem(censorSVG, 'Вставить скрытый контент', () => showCensorFormPopup(rect, onSelectCensor)));
        scrollContent.appendChild(makeMenuItem(codeSVG, 'Вставить код (SRCI)', () => showSRCIFormPopup(rect, onSelectSRCI)));
        scrollContent.appendChild(makeMenuItem(userSVG, 'Вставить имя пользователя', () => { removePopup(); onSelectVisitor(); }));
        scrollContent.appendChild(makeMenuItem(templateSVG, 'Вставить шаблон', () => showTemplateFormPopup(rect, onSelectTemplate)));

        scrollWrapper.appendChild(scrollContent);
        popup.appendChild(scrollWrapper);
        document.body.appendChild(popup);

        activePopup = popup;

        setTimeout(() => {
            document.addEventListener('mousedown', function esc(e){
                if (activePopup && !activePopup.contains(e.target)) {
                    removePopup();
                    document.removeEventListener('mousedown', esc, true);
                }
            }, true);
        }, 30);
    }

function replaceMenuWithBBCode(pos, newText, editor, explicit) {
    const selection = window.getSelection();
    selection.removeAllRanges();

    let node = pos.node;
    let triggerLength = pos.triggerLength || 5;
    let idx = pos.idx;

    let range = document.createRange();
    range.setStart(node, idx);
    range.setEnd(node, idx + triggerLength);
    selection.addRange(range);

    document.execCommand('delete', false, null);

    document.execCommand('insertHTML', false, newText.replace(/\n/g, '<br>'));

    if (editor && typeof editor.focus === 'function') {
        editor.focus();
    }
}

    function showButtonFormPopup(rect, onInsert) {
        removePopup();
        const popup = createForumPopup(rect, 350);

        const formWrap = createFormWrap();
        formWrap.appendChild(makeLabel('Ссылка (URL):'));
        const inputUrl = makeInput('https://...');
        formWrap.appendChild(inputUrl);

        formWrap.appendChild(makeLabel('Текст кнопки:'));
        const inputText = makeInput('Текст');
        formWrap.appendChild(inputText);

        const insertBtn = makeInsertBtn(() => {
            const url = inputUrl.value.trim();
            const text = inputText.value.trim();
            if (!url || !text) {
                if(!url) inputUrl.style.border = '1.5px solid #f00';
                if(!text) inputText.style.border = '1.5px solid #f00';
                return;
            }
            removePopup();
            onInsert(url, text);
        });
        formWrap.appendChild(insertBtn);

        formWrap.addEventListener('keydown', makeFormKeys(insertBtn));
        popup.appendChild(formWrap);
        document.body.appendChild(popup);
        activePopup = popup;
        inputUrl.focus();
        focusCloseOnClickOutside();
    }

    function showApiFormPopup(rect, onInsert) {
        removePopup();
        const popup = createForumPopup(rect, 350);
        const formWrap = createFormWrap();

        formWrap.appendChild(makeLabel('API URL:'));
        const inputUrl = makeInput('https://api.example.com/...');
        formWrap.appendChild(inputUrl);

        const insertBtn = makeInsertBtn(() => {
            const url = inputUrl.value.trim();
            if (!url) {
                inputUrl.style.border = '1.5px solid #f00';
                return;
            }
            removePopup();
            onInsert(url);
        });
        formWrap.appendChild(insertBtn);

        formWrap.addEventListener('keydown', makeFormKeys(insertBtn));
        popup.appendChild(formWrap);
        document.body.appendChild(popup);
        activePopup = popup;
        inputUrl.focus();
        focusCloseOnClickOutside();
    }

    function showCensorFormPopup(rect, onInsert) {
        removePopup();
        const popup = createForumPopup(rect, 350);
        const formWrap = createFormWrap();

        formWrap.appendChild(makeLabel('Скрытый текст:'));
        const inputText = makeInput('Текст, который будет скрыт...');
        formWrap.appendChild(inputText);

        const insertBtn = makeInsertBtn(() => {
            const val = inputText.value.trim();
            if (!val) {
                inputText.style.border = '1.5px solid #f00';
                return;
            }
            removePopup();
            onInsert(val);
        });
        formWrap.appendChild(insertBtn);

        formWrap.addEventListener('keydown', makeFormKeys(insertBtn));
        popup.appendChild(formWrap);
        document.body.appendChild(popup);
        activePopup = popup;
        inputText.focus();
        focusCloseOnClickOutside();
    }

    function showSRCIFormPopup(rect, onInsert) {
        removePopup();
        const popup = createForumPopup(rect, 410);
        const formWrap = createFormWrap();

        formWrap.appendChild(makeLabel('Язык (подсветка):'));
        const selectLang = document.createElement('select');
        selectLang.style.background = '#181a1b';
        selectLang.style.border = '1px solid #36393b';
        selectLang.style.color = '#d1d5da';
        selectLang.style.borderRadius = '6px';
        selectLang.style.padding = '7px 10px';
        selectLang.style.fontSize = '15px';
        selectLang.style.marginBottom = '10px';
        srciLanguages.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang.value;
            opt.textContent = lang.label;
            selectLang.appendChild(opt);
        });
        formWrap.appendChild(selectLang);

        formWrap.appendChild(makeLabel('Код:'));
        const inputCode = makeInput('Введите код...');
        formWrap.appendChild(inputCode);

        const insertBtn = makeInsertBtn(() => {
            const lang = selectLang.value;
            const code = inputCode.value.trim();
            if (!code) {
                inputCode.style.border = '1.5px solid #f00';
                return;
            }
            removePopup();
            onInsert(lang, code);
        });
        formWrap.appendChild(insertBtn);

        formWrap.addEventListener('keydown', makeFormKeys(insertBtn));
        popup.appendChild(formWrap);
        document.body.appendChild(popup);
        activePopup = popup;
        selectLang.focus();
        focusCloseOnClickOutside();
    }

    function showTemplateFormPopup(rect, onInsert) {
        removePopup();
        const popup = createForumPopup(rect, 430);
        const formWrap = createFormWrap();

        const label = makeLabel('Выберите шаблон:');
        formWrap.appendChild(label);

        const select = document.createElement('select');
        select.style.background = '#181a1b';
        select.style.border = '1px solid #36393b';
        select.style.color = '#d1d5da';
        select.style.borderRadius = '6px';
        select.style.padding = '7px 10px';
        select.style.fontSize = '15px';
        select.style.marginBottom = '10px';

        TEMPLATES.forEach((tpl, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = tpl.name;
            select.appendChild(opt);
        });

        formWrap.appendChild(select);

        const input = document.createElement('textarea');
        input.rows = 8;
        input.style.background = '#181a1b';
        input.style.border = '1px solid #36393b';
        input.style.color = '#d1d5da';
        input.style.borderRadius = '6px';
        input.style.padding = '8px 10px';
        input.style.fontSize = '15px';
        input.style.marginBottom = '10px';
        input.value = TEMPLATES[0].value;
        formWrap.appendChild(input);

        select.onchange = async function() {
            const selected = TEMPLATES[select.value];
            if (selected.isAi) {
                input.value = "Введите тему или кратко опишите, что нужно (например: шаблон продажи аккаунта Steam, отчет о гарант-сделке и т.п.)";
                input.readOnly = false;
                input.focus();
                // Можно прикрутить AI через API
            } else {
                input.value = selected.value;
                input.readOnly = false;
            }
        };

        const insertBtn = makeInsertBtn(() => {
            if (!input.value.trim()) {
                input.style.border = '1.5px solid #f00';
                return;
            }
            removePopup();
            onInsert(input.value);
        });
        formWrap.appendChild(insertBtn);

        formWrap.addEventListener('keydown', makeFormKeys(insertBtn));
        popup.appendChild(formWrap);
        document.body.appendChild(popup);
        activePopup = popup;
        select.focus();
        focusCloseOnClickOutside();
    }

    function createForumPopup(rect, maxWidth) {
        const popup = document.createElement('div');
        popup.className = 'fr-popup fr-desktop fr-ltr fe-acPopup fr-above fr-active';
        popup.style.zIndex = 9999;
        popup.style.position = 'absolute';
        popup.style.maxWidth = (maxWidth || 370) + 'px';
        positionPopup(popup, rect);
        return popup;
    }
    function createFormWrap() {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '5px';
        div.style.padding = '16px 20px 15px 20px';
        return div;
    }
    function makeLabel(text) {
        const label = document.createElement('label');
        label.textContent = text;
        label.style.color = '#bbb';
        label.style.fontSize = '13px';
        label.style.marginBottom = '2px';
        return label;
    }
    function makeInput(placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.style.background = '#181a1b';
        input.style.border = '1px solid #36393b';
        input.style.color = '#d1d5da';
        input.style.borderRadius = '6px';
        input.style.padding = '7px 10px';
        input.style.fontSize = '15px';
        input.style.marginBottom = '10px';
        return input;
    }
    function makeInsertBtn(onClick) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Вставить';
        btn.style.background = '#41b883';
        btn.style.color = '#fff';
        btn.style.fontWeight = '600';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.fontSize = '15px';
        btn.style.padding = '8px 22px';
        btn.style.cursor = 'pointer';
        btn.style.marginTop = '4px';
        btn.onmouseenter = () => btn.style.background = '#28c76f';
        btn.onmouseleave = () => btn.style.background = '#41b883';
        btn.onclick = onClick;
        return btn;
    }
    function makeFormKeys(btn) {
        return function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                btn.click();
            }
            if (e.key === 'Escape') removePopup();
        }
    }
    function focusCloseOnClickOutside() {
        setTimeout(() => {
            document.addEventListener('mousedown', function esc(e){
                if (activePopup && !activePopup.contains(e.target)) {
                    removePopup();
                    document.removeEventListener('mousedown', esc, true);
                }
            }, true);
        }, 30);
    }



    function attachEditorMenu(editor) {
        if (editor._bbmenu_attached) return;
        editor._bbmenu_attached = true;

        editor.addEventListener('keyup', function(e){
            const pos = getMenuTriggerPosition(editor, false);
            if (pos && pos.rect) {
                showMenuPopup(
                    pos.rect,
                    (url, text) => replaceMenuWithBBCode(pos, `[BUTTON=${url}]${text}[/BUTTON]`, editor, false),
                    (apiUrl)   => replaceMenuWithBBCode(pos, `[api]${apiUrl}[/api]`, editor, false),
                    (censor)   => replaceMenuWithBBCode(pos, `[censor]${censor}[/censor]`, editor, false),
                    (lang, code) => {
                        if (lang) replaceMenuWithBBCode(pos, `[SRCI=${lang}]${code}[/SRCI]`, editor, false);
                        else      replaceMenuWithBBCode(pos, `[SRCI]${code}[/SRCI]`, editor, false);
                    },
                    () => replaceMenuWithBBCode(pos, `[visitor][/visitor]`, editor, false),
                    (tpl) => replaceMenuWithBBCode(pos, tpl, editor, false)
                );
            }
        });

        editor.addEventListener('keydown', function(e){
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                const pos = getMenuTriggerPosition(editor, true);
                if (pos && pos.rect) {
                    showMenuPopup(
                        pos.rect,
                        (url, text) => replaceMenuWithBBCode(pos, `[BUTTON=${url}]${text}[/BUTTON]`, editor, true),
                        (apiUrl)   => replaceMenuWithBBCode(pos, `[api]${apiUrl}[/api]`, editor, true),
                        (censor)   => replaceMenuWithBBCode(pos, `[censor]${censor}[/censor]`, editor, true),
                        (lang, code) => {
                            if (lang) replaceMenuWithBBCode(pos, `[SRCI=${lang}]${code}[/SRCI]`, editor, true);
                            else      replaceMenuWithBBCode(pos, `[SRCI]${code}[/SRCI]`, editor, true);
                        },
                        () => replaceMenuWithBBCode(pos, `[visitor][/visitor]`, editor, true),
                        (tpl) => replaceMenuWithBBCode(pos, tpl, editor, true)
                    );
                }
            }
        });
    }

    function observeEditors() {
        function applyToAllEditors() {
            document.querySelectorAll('.fr-element[contenteditable="true"]').forEach(attachEditorMenu);
        }
        applyToAllEditors();
        const obs = new MutationObserver(() => {
            applyToAllEditors();
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('DOMContentLoaded', observeEditors);
    setTimeout(observeEditors, 1500);
})();
