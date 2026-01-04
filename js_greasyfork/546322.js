// ==UserScript==
// @name         Rodina RP - Быстрые ответы + Автозакрытие
// @namespace    https://forum.rodina-rp.com/
// @version      2.5
// @description  Быстрые шаблоны ответов + автозакрытие тем и обновление префикса/пина на форуме Rodina RP. Автор: Teo Owczarczyk (GreasyFork Edition)
// @author       Jonny_Wilson
// @match        https://forum.rodina-rp.com/threads/*
// @grant        none
// @license      Owczarczyk
// @downloadURL https://update.greasyfork.org/scripts/546322/Rodina%20RP%20-%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%2B%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/546322/Rodina%20RP%20-%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%2B%20%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLOSE_PREFIX_ID = 7;

    const templates = [
        {
            label: "✔️ Опровержение принято",
            content: `Доброго времени суток,\n\nРассмотрел ваше опровержение. Вердикт: [B]Принято[/B].`,
            autoClose: true,
            prefixId: CLOSE_PREFIX_ID
        },
        {
            label: "❌ Опровержение не принято",
            content: `Доброго времени суток,\n\nРассмотрел ваше опровержение. [B]Не принято[/B], имущество будет изъято.`,
            autoClose: true,
            prefixId: CLOSE_PREFIX_ID
        },
        {
            label: "✅ Жалоба одобрена",
            content: `Доброго времени суток,\n\nЯ администратор 3 уровня - Teo Owczarczyk.\nРассмотрел вашу жалобу. Игрок будет наказан за нарушение правил проекта.\nПункт из правил: [B]указать[/B].\n\nБлагодарим за обратную связь.`,
            autoClose: true,
            prefixId: CLOSE_PREFIX_ID
        },
        {
            label: "📝 Свой ответ + Закрыть",
            content: `Доброго времени суток,\n\n`, // пользователь допишет сам
            autoClose: true,
            prefixId: 0 // Без префикса
        }
    ];

    function insertButtonsIntoReplyBox() {
        // Ищем форму с textarea (редактор ответа)
        const replyForm = document.querySelector('form.message-reply');
        if (!replyForm || document.querySelector('#rodina-reply-buttons')) return;

        const container = document.createElement('div');
        container.id = 'rodina-reply-buttons';
        container.style.margin = '10px 0';

        templates.forEach(tpl => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = tpl.label;
            btn.style.marginRight = '8px';
            btn.style.padding = '6px 12px';
            btn.style.cursor = 'pointer';
            btn.style.borderRadius = '4px';
            btn.style.border = '1px solid #ccc';
            btn.style.backgroundColor = tpl.prefixId === CLOSE_PREFIX_ID ? '#d9534f' : '#5bc0de';
            btn.style.color = 'white';
            btn.style.fontWeight = '600';

            btn.addEventListener('click', () => {
                const textarea = replyForm.querySelector('textarea');
                if (textarea) {
                    textarea.value = tpl.content;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }

                if (tpl.autoClose) {
                    const checkbox = replyForm.querySelector('input[name="discussion_open"]');
                    if (checkbox && checkbox.checked) {
                        checkbox.click(); // закрываем тему
                    }
                }

                if (tpl.prefixId !== 0) {
                    updateThreadPrefixAndPin(tpl.prefixId, false);
                }
            });

            container.appendChild(btn);
        });

        // Вставляем кнопки после textarea
        const textarea = replyForm.querySelector('textarea');
        if (textarea) {
            textarea.parentNode.insertBefore(container, textarea.nextSibling);
        }
    }

    function updateThreadPrefixAndPin(prefix, pin = false) {
        const threadTitleInput = document.querySelector('input[name="title"]');
        if (!threadTitleInput) return;

        const threadTitle = threadTitleInput.value;
        const threadUrl = window.location.href;

        const formData = getFormData({
            prefix_id: prefix,
            title: threadTitle,
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: threadUrl.replace(XF.config.url.fullBase, '').replace(location.origin, ''),
            _xfWithData: 1,
            _xfResponseType: 'json'
        });

        fetch(`${threadUrl}edit`, {
            method: 'POST',
            body: formData
        }).then(() => location.reload());
    }

    function getFormData(data) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    }

    const observer = new MutationObserver(() => {
        insertButtonsIntoReplyBox();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
