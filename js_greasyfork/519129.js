// ==UserScript==
// @name         Ticket Tools
// @namespace    https://sd-frt.com/
// @version      4.3.1
// @description  Упрощение работы с SD (date-picker + перевод в статус 11)
// @author       loli
// @license      MIT
// @match        https://sd-frt.com/ru/ticket/list/filter/id/*
// @match        https://sd-frt.com/ru/ticket/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/519129/Ticket%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/519129/Ticket%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OWNER_IDS = {
        35: '1091 Алекс',
        659: '3268 Дима',
        900: '3693 Денис',
        964: '3736 Таня',
        913: '3738 Миша',
        919: '3738 Максим',
        952: '3813 Женя',
        1023: '3853 Сергей'
    };
    let TICKET_OWNER_ID = GM_getValue('Kurome_ownerId', null);

    function ensureOwnerId(cb) {
        if (TICKET_OWNER_ID && OWNER_IDS[TICKET_OWNER_ID]) {
            cb();
            return;
        }
        const overlay = document.createElement('div');
        overlay.style = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif';
        const box = document.createElement('div');
        box.style = 'background:#fff;padding:22px 28px;border-radius:8px;min-width:240px;text-align:center';
        box.innerHTML = '<h3 style="margin:0 0 8px">Кто вы?</h3>';
        Object.entries(OWNER_IDS).forEach(([id, name]) => {
            const b = document.createElement('button');
            b.textContent = `${name} (${id})`;
            b.style = 'margin:5px;padding:8px 14px;border:none;border-radius:6px;background:#3498db;color:#fff;cursor:pointer';
            b.onclick = () => {
                GM_setValue('Kurome_ownerId', id);
                TICKET_OWNER_ID = id;
                overlay.remove();
                cb();
            };
            box.appendChild(b);
        });
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    const CUSTOM_FIELD_ID = 3; // «Дата в работу»
    const WORKDATE_ICON = '⏳';

    let observer = null;
    let toolbar = null;

    function getDateColor(iso) {
        if (!iso) return '';
        const d = iso.slice(0, 10);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tgt = new Date(d + 'T00:00:00');
        return (tgt - today) > 0 ? '#2ecc71' : '#e74c3c';
    }

    function toISO(raw) {
        if (!raw) return '';

        const m1 = raw.match(/\d{4}-\d{2}-\d{2}/);
        if (m1) return m1[0];

        const m2 = raw.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (m2) return `${m2[3]}-${m2[2]}-${m2[1]}`;

        const ts = String(raw).match(/^\d{10}(?:\d{3})?$/);
        if (ts) return new Date(+ts[0]).toISOString().slice(0, 10);

        return '';
    }

    function findCustomFieldValue(node) {
        if (!node) return null;

        if (Array.isArray(node)) {
            for (const item of node) {
                const v = findCustomFieldValue(item);
                if (v) return v;
            }
        } else if (typeof node === 'object') {
            if (Number(node.id) === CUSTOM_FIELD_ID && node.value) {
                return node.value;
            }
            for (const k in node) {
                const v = findCustomFieldValue(node[k]);
                if (v) return v;
            }
        }
        return null;
    }

    function extractFieldValue(payload) {
        if (!payload) return null;
        if (typeof payload === 'string') return payload;
        if (payload.value) return payload.value;
        return findCustomFieldValue(payload);
    }

    // Переименовываем лейбл в форме тикета
    renameFormLabel();
    function renameFormLabel() {
        const label = [...document.querySelectorAll('.form-group label, td')]
            .find(el => /Ссылка\s*на\s*задачу\s*в\s*JIRA/i.test(el.textContent));
        if (label) label.textContent = 'Дата в работу';
    }

    if (location.pathname.includes('/ticket/list/')) {
        window.addEventListener('load', () => ensureOwnerId(initListPage));
    }

    function initListPage() {
        observer = new MutationObserver(buildAllRows);
        buildAllRows();
    }

    async function buildAllRows() {
        if (observer) observer.disconnect();
        const rows = [...document.querySelectorAll('.ticket-list-column-title__container')];
        if (!rows.length) {
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        renameHeaderColumn();

        const sameMerchMap = new Map();
        const palette = ['#F39C12', '#8E44AD', '#3498DB', '#E74C3C', '#1ABC9C'];
        let cIdx = 0;

        // Увеличиваем высоту каждой строки
        rows.forEach(r => {
            const tr = r.closest('tr');
            if (tr) tr.style.height = '48px';
        });

        for (const t of rows) {
            t.querySelector('.ticket-list-column-title__right')?.remove();
            if (t.querySelector('.copy-merchant-id')) continue;

            const center = t.querySelector('.ticket-list-column-title__center');
            const a = center?.querySelector('a');
            const span = a?.querySelector('span');
            if (!center || !a || !span) continue;
            center.style.cssText = 'display:flex;justify-content:space-between;align-items:center';

            const raw = span.textContent || '';
            if (!raw.includes('/C2C_Direct')) continue;
            const p = raw.split('|');
            if (p.length < 6) continue;

            const provId = p[2]?.trim() || '';
            const merchId = p[3]?.trim() || '';

            let guidId = '';
            let provName = '';
            let merchName = '';

            if (p.length >= 7) {
                guidId = p[4]?.trim() || '';
                provName = p[5]?.trim() || '';
                merchName = p[6]?.trim() || '';
            } else {
                guidId = '';
                provName = p[4]?.trim() || '';
                merchName = p[5]?.trim() || '';
            }

            const cleanseProv = s => s
                .replace(/\s*\/\s*C2C_Direct(\s*[\d.,]+[кк]?%?)?/gi, '')
                .replace(/\bNEW\b/gi, '')
                .replace(/(\s|^)[\d.,]+[кк]?%?/gi, '')
                .replace(/^\/+|\/+$/g, '')
                .trim();

            const cleanseMerch = s => s
                .replace(/\s*C2C_Direct(\s*[\d.,]+[кк]?%?)?/gi, '')
                .replace(/\bNEW\b/gi, '')
                .replace(/(\s|^)[\d.,]+[кк]?%?/gi, '')
                .replace(/^\/+|\/+$/g, '')
                .trim();

            provName = cleanseProv(provName);
            merchName = cleanseMerch(merchName);
            const merchShort = merchName.split('/').pop().trim();

            span.innerHTML = `<b style="color:#FFD700">${merchShort}</b> | <b style="color:#1ABC9C">${provName}</b>`;

            const cont = el('div', 'display:inline-flex;align-items:center;gap:8px');
            const copy = el('div', 'display:inline-flex;gap:8px');

            addCopyBtn(copy, 'ID мерча', merchId, '#3498DB');
            if (guidId) {
                addCopyBtn(copy, 'GUID', guidId, '#16a085');
            }
            addCopyBtn(copy, 'ID прова', provId, '#E74C3C');
            addCopyBtn(copy, 'ID пров + мерч', `${provId}\n\n${merchId}`, '#9B59B6');
            addCopyBtn(copy, 'Причина', `Уточните причину отмены:\n${provId}\n\n${merchId}`, '#8E44AD');

            const ticketId = a.href.split('/').pop();
            const push = el('div', 'display:inline-flex;gap:8px');
            addPushBtn(push, ticketId, '#FF4500');

            const status = el('div', 'display:inline-flex;gap:8px');
            addStatusBtn(status, 'Ожидание прова', ticketId, 13, '#FFA500');
            addStatusBtn(status, 'Ожидание мерча', ticketId, 14, '#FFD700');
            addCloseBtn(status, ticketId, '#FF6347');

            cont.append(copy, sep(), push, sep(), status);
            center.appendChild(cont);

            (sameMerchMap.get(merchId) || sameMerchMap.set(merchId, []).get(merchId)).push(t);

            attachWorkDateCell(t.closest('tr'), ticketId);

            if (guidId) Object.assign(t.dataset, {
                providerId: provId,
                merchantId: merchId,
                guidId,
                ticketId
            });
            else Object.assign(t.dataset, {
                providerId: provId,
                merchantId: merchId,
                ticketId
            });
        }

        sameMerchMap.forEach(arr => {
            if (arr.length > 1) {
                const c = palette[cIdx++ % palette.length];
                arr.forEach(el => el.style.backgroundColor = c);
            }
        });

        buildToolbar();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    const el = (tag, style = '') => {
        const x = document.createElement(tag);
        x.style.cssText = style;
        return x;
    };
    const sep = () => el('span', 'margin:0 4px;border-left:2px dashed #999;padding-left:4px');

    function makeBtn(text, color) {
        const b = document.createElement('button');
        b.textContent = text;
        b.style = `background:${color};color:#fff;padding:5px 8px;border:none;border-radius:5px;cursor:pointer;transition:.2s;font-size:13px`;
        b.onmouseenter = () => b.style.transform = 'scale(1.05)';
        b.onmouseleave = () => b.style.transform = 'scale(1)';
        return b;
    }
    const flash = (btn, from, to = '#67C23A') => {
        btn.style.background = to;
        setTimeout(() => btn.style.background = from, 250);
    };
    const highlightRow = btn => {
        document.querySelectorAll('.el-table__row,tr').forEach(r => {
            r.style.outline = '';
        });
        const tr = btn.closest('tr');
        if (tr) {
            tr.style.outline = '3px solid #ff9900';
            tr.style.outlineOffset = '-3px';
        }
    };

    function addCopyBtn(parent, label, text, color) {
        const b = makeBtn(label, color);
        parent.appendChild(b);
        b.onclick = () => {
            GM_setClipboard(text);
            flash(b, color);
            highlightRow(b);
        };
    }

    function addPushBtn(parent, ticketId, color) {
        const b = makeBtn('Пуш', color);
        parent.appendChild(b);
        b.onclick = () => {
            highlightRow(b);
            fetch(`/ru/ticket/form/comment/id/${ticketId}`, {
                method: 'POST',
                headers: xhrHeaders(),
                body: 'editorCommentContent=%3Cp%3E%D0%BF%D1%83%D1%88%3C%2Fp%3E'
            }).then(r => showTip(r.ok ? 'Комментарий добавлен' : 'Ошибка пуша'));
        };
    }

    function addStatusBtn(parent, label, ticketId, statusId, color) {
        const b = makeBtn(label, color);
        parent.appendChild(b);
        b.onclick = async () => {
            highlightRow(b);
            try {
                await fetch(`/ru/ticket/data/owner/id/${ticketId}`, {
                    method: 'PUT',
                    headers: xhrHeaders(),
                    body: `ownerId=${TICKET_OWNER_ID}`,
                    credentials: 'include'
                });
                await fetch(`/ru/ticket/data/status/id/${ticketId}`, {
                    method: 'PUT',
                    headers: xhrHeaders(),
                    body: `statusId=${statusId}`,
                    credentials: 'include'
                });
                showTip(`Статус: ${label}`);
                refreshList();
            } catch (e) {
                console.error(e);
            }
        };
    }

    function addCloseBtn(parent, ticketId, color) {
        const b = makeBtn('Закрыть', color);
        parent.appendChild(b);
        b.onclick = async () => {
            highlightRow(b);
            try {
                await fetch(`/ru/ticket/data/owner/id/${ticketId}`, {
                    method: 'PUT',
                    headers: xhrHeaders(),
                    body: `ownerId=${TICKET_OWNER_ID}`,
                    credentials: 'include'
                });
                await fetch(`/ru/ticket/data/status/id/${ticketId}`, {
                    method: 'PUT',
                    headers: xhrHeaders(),
                    body: 'statusId=closed',
                    credentials: 'include'
                });
                showTip('Тикет закрыт');
                refreshList();
            } catch (e) {
                console.error(e);
            }
        };
    }

    const xhrHeaders = () => ({
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest'
    });

    const setWorkDate = (ticketId, date) => fetch(`/ru/ticket/data/custom_field/id/${ticketId}`, {
        method: 'PUT',
        headers: xhrHeaders(),
        credentials: 'include',
        body: `id=${CUSTOM_FIELD_ID}&value=${encodeURIComponent(date)}`
    });

    async function getWorkDate(ticketId) {
        return null; // отключено, чтобы не делать лишних fetch-запросов
    }

    // ======= Исправленный attachWorkDateCell, показывающий встроенный <input type="date"> =======
    function attachWorkDateCell(row, ticketId) {
        // Ищем колонку «Дата в работу»
        const idx = [...document.querySelectorAll('.el-table__header thead th')]
            .findIndex(th => /Дата\s*в\s*работу/i.test(th.textContent));
        let cell = idx !== -1 ? row.children[idx] : null;
        if (!cell) cell = row.insertCell(-1);

        cell.classList.add('kurome-workdate');
        cell.style.cssText += 'cursor:pointer;user-select:none;min-width:110px;text-align:center';

        const apply = iso => {
            iso = toISO(iso);
            if (!iso) {
                cell.textContent = WORKDATE_ICON;
                cell.style.background = '';
                cell.style.fontWeight = '';
                cell.style.color = '';
                cell.dataset.date = '';
            } else {
                cell.textContent = iso;
                cell.style.background = getDateColor(iso);
                cell.style.fontWeight = 'bold';
                cell.style.color = '#fff';
                cell.dataset.date = iso;
            }
        };

        const preload = toISO(cell.textContent);
        if (preload) {
            apply(preload);
        } else {
            apply('');
        }

        cell.onclick = () => {
            // Вставляем <input type="date"> внутрь ячейки
            const currentISO = cell.dataset.date || '';
            cell.textContent = '';
            const input = document.createElement('input');
            input.type = 'date';
            input.value = currentISO;
            // Стили, чтобы заполнить всю ячейку
            input.style = 'width:100%;height:100%;border:none;font-weight:bold;font-size:14px;';
            cell.appendChild(input);
            input.focus();

            // Попытка сразу открыть календарь (если поддерживается)
            if (typeof input.showPicker === 'function') {
                input.showPicker();
            }

            input.onchange = async () => {
                const selectedDate = input.value;
                if (!selectedDate) {
                    // если не выбрали, просто вернуть иконку
                    input.remove();
                    apply('');
                    return;
                }

                // Сохраняем дату в custom_field
                await setWorkDate(ticketId, selectedDate);

                // Переводим тикет в статус 11
                await fetch(`/ru/ticket/data/status/id/${ticketId}`, {
                    method: 'PUT',
                    headers: xhrHeaders(),
                    body: `statusId=11`,
                    credentials: 'include'
                });

                showTip('Тикет переведен в статус "Ожидание выписки провайдера"');

                // После этого удаляем <input> и показываем дату как текст
                input.remove();
                apply(selectedDate);

                // Обновляем список тикетов
                refreshList();
            };

            // Если пользователь кликает в другое место без выбора — вернём прежний вид
            input.onblur = () => {
                if (!input.value) {
                    input.remove();
                    apply(cell.dataset.date || '');
                }
            };
        };
    }

    function buildToolbar() {
        if (toolbar) return;
        toolbar = el('div', 'position:fixed;bottom:10px;left:10px;z-index:9999;background:#222;color:#fff;padding:8px;border-radius:6px;font-family:sans-serif;display:flex;gap:8px');

        const copyProv = makeBtn('Коп. ID пров', '#e67e22');
        copyProv.onclick = () => {
            const ids = [...document.querySelectorAll('.ticket-list-column-title__container')]
                .map(r => r.dataset.providerId).filter(Boolean);
            GM_setClipboard([...new Set(ids)].join('\n'));
            flash(copyProv, '#e67e22');
            showTip('Скопированы ID провайдеров');
        };

        const copyExpiredProv = makeBtn('Коп. ID пров (просроч.)', '#d35400');
        copyExpiredProv.onclick = () => {
            const rows = [...document.querySelectorAll('.ticket-list-column-title__container')];
            const expiredIds = new Set();

            rows.forEach(r => {
                const tr = r.closest('tr');
                if (!tr) return;
                const dateCell = [...tr.children].find(td => td.classList.contains('kurome-workdate'));
                if (!dateCell) return;
                const dateIso = toISO(dateCell.dataset.date);
                if (!dateIso) return;
                const color = getDateColor(dateIso);
                if (color === '#e74c3c' && r.dataset.providerId) {
                    expiredIds.add(r.dataset.providerId);
                }
            });

            if (expiredIds.size === 0) {
                showTip('Просроченных тикетов не найдено');
                return;
            }

            GM_setClipboard([...expiredIds].join('\n'));
            flash(copyExpiredProv, '#d35400');
            showTip(`Скопированы ID провайдеров ${expiredIds.size} просроченных тикетов`);
        };

        const copyMerch = makeBtn('Коп. ID мерч', '#9b59b6');
        copyMerch.onclick = () => {
            const ids = [...document.querySelectorAll('.ticket-list-column-title__container')]
                .map(r => r.dataset.merchantId).filter(Boolean);
            GM_setClipboard([...new Set(ids)].join('\n'));
            flash(copyMerch, '#9b59b6');
            showTip('Скопированы ID мерчей');
        };

        const pushAll = makeBtn('Push всем', '#c0392b');
        pushAll.onclick = () => {
            const list = [...document.querySelectorAll('.ticket-list-column-title__container')]
                .map(r => r.dataset.ticketId);
            if (!list.length) return;
            list.forEach(id => fetch(`/ru/ticket/form/comment/id/${id}`, {
                method: 'POST',
                headers: xhrHeaders(),
                body: 'editorCommentContent=%3Cp%3E%D0%BF%D1%83%D1%88%3C%2Fp%3E'
            }));
            showTip(`Пуш отправлен в ${list.length} тикетов`);
        };

        toolbar.append(copyProv, copyExpiredProv, copyMerch, pushAll);
        document.body.appendChild(toolbar);
    }

    function renameHeaderColumn() {
        const th = [...document.querySelectorAll('.el-table__header thead th')]
            .find(t => /Ссылка\s*на\s*задачу\s*в\s*JIRA/i.test(t.textContent));
        if (th) th.textContent = 'Дата в работу';
    }

    const showTip = txt => {
        const d = el('div', 'position:fixed;top:20px;right:20px;background:#67C23A;color:#fff;padding:8px 12px;border-radius:5px;z-index:9999;font-size:14px');
        d.textContent = txt;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 2000);
    };

    const refreshList = () => {
        document.querySelector('button.el-button.el-button--default.el-button--mini i.el-icon-refresh')
            ?.parentElement?.click();
    };

})();
