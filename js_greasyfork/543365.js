// ==UserScript==
// @author       Evgeniy Lykhov
// @name         Integration Config - Delete connection
// @description  Пользовательский скрипт, добавляющий в список подключений на странице online.sbis.ru/integration_config/?Page=7 удобный интерфейс для выбора и удаления подключений напрямую, без необходимости удаления их вручную через сайт.
// @version      32.0
// @match        https://online.sbis.ru/integration_config/?Page=7*
// @match        https://online.sbis.ru/integration_config/?service=extExch&Page=7*
// @match        https://fix-online.sbis.ru/integration_config/?Page=7*
// @icon         https://cdn2.sbis.ru/cdn/SabyLogo/1.0.7/favicon/favicon.ico?v=1
// @run-at       document-end
// @namespace https://greasyfork.org/users/1497438
// @downloadURL https://update.greasyfork.org/scripts/543365/Integration%20Config%20-%20Delete%20connection.user.js
// @updateURL https://update.greasyfork.org/scripts/543365/Integration%20Config%20-%20Delete%20connection.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // ===========================
    // ========== Стили ==========
    // ===========================
    const style = document.createElement('style');
    style.textContent = `
	.controls-DataGridView__th.DataGridView__td__checkBox,
	.controls-DataGridView__td.DataGridView__td__checkBox { width: 24px !important; text-align: center !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important;}
	.controls-DataGridView__td.DataGridView__td__checkBox input { width: 16px; height: 16px; cursor: pointer;}
	.controls-button {
	    display: inline-block;
	    outline: 0;
	    line-height: normal;
	    box-sizing: border-box;
	    font-family: Inter;
	    font-size: 14px;
	    font-weight: 400;
	    position: relative;
	    box-shadow: none;
	    border: 1px solid #587ab0;
	    min-width: 48px;
	    text-shadow: none;
	    -webkit-user-select: none;
	    user-select: none;
	    color: #000;
	    background: #fff;
	    height: 24px;
	    padding: 0 11px;
	    border-radius: 16px;
		white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	}
	.controls-button:hover { background: #e1ecf6; }
    #sbis-panel { display: flex; justify-content: space-between; align-items: center; margin: 0px 25px; gap: 10px; }
    #sbis-panel-left, #sbis-panel-right { display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; gap: 10px; }
    #sbis-header-counter { font-size: 16px; min-width: 110px; }
	`;
    document.head.appendChild(style);

    // ===========================
    // ======== Утилиты ==========
    // ===========================
	// waitFor — ждет появления селектора в DOM (promise)
    function waitFor(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    resolve(found);
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                obs.disconnect();
                reject(new Error(`Не найдена нода ${selector} за ${timeout}ms`));
            }, timeout);
        });
    }

    try {
        const connectionLimitForDeletion = 50;
        const MIN_COLUMNS = 6;

        const mainTable = await waitFor('.controls-DataGridView__table.ws-sticky-header__table');
        const mainTbody = mainTable.querySelector('tbody');

        /**
         * - Универсально вставляет <col> colgroup
         * - возвращает:
         *     true  — если colgroup есть (вставили или уже присутствовал).
         *     false — если в таблице пока нет colgroup (нужно ждать)
         */
        function ensureColForTable(tbl) {
            if (!tbl) return false;
            const cg = tbl.querySelector('colgroup');
            if (!cg) return false; // ещё нет colgroup — нужно подождать

            // Если маркер уже есть — считаем, что колонка вставлена
            if (cg.querySelector('col[data-inserted]')) return true;

            // Вставляем новую колонку слева
            const newCol = document.createElement('col');
            newCol.width = '24px';
            newCol.setAttribute('data-inserted', 'true');
            cg.insertBefore(newCol, cg.firstElementChild);

            // Корректируем второй col (делаем его шириной 45%), как в основной таблице
            const secondCol = cg.querySelectorAll('col')[1];
            if (secondCol) {
                secondCol.setAttribute('data-inserted', 'true');
                secondCol.setAttribute('width', '45%');
            }

            // убираем width у остальных колонок, чтобы избежать конфликтов
            cg.querySelectorAll('col:not([data-inserted])').forEach(c => c.removeAttribute('width'));

            return true;
        }

        /**
         * - универсально вставляет <th> как первый <th> в thead.
         * - возвращает:
         *     true  — если th вставлен (или уже присутствовал).
         *     false — если в таблице пока нет строки thead tr (нужно ждать)
         */
        function ensureThForTable(tbl) {
            if (!tbl) return false;
            // если уже есть наш th — возвращаем true
            const existing = tbl.querySelector('thead tr th.DataGridView__td__checkBox');
            if (existing) return true;

            const theadRow = tbl.querySelector('thead tr');
            if (!theadRow) return false; // ещё нет thead/row — нужно подождать

            // вставляем th слева
            const th = document.createElement('th');
            th.className = 'controls-DataGridView__th DataGridView__td__checkBox';
            th.style.textAlign = 'center';
            th.style.width = '24px';
            theadRow.insertBefore(th, theadRow.firstElementChild);

            return true;
        }

        // ===========================
        // === Применяем к основной таблице ===
        // ===========================
        if (mainTable) {
            ensureColForTable(mainTable);
            ensureThForTable(mainTable);

            // Следим за перерисовкой colgroup
            new MutationObserver(() => ensureColForTable(mainTable))
                .observe(mainTable.querySelector('colgroup').parentNode, { childList: true });
            // Следим за перерисовкой tableheader
            new MutationObserver(() => ensureThForTable(mainTable))
                .observe(mainTable, { childList: true, subtree: true });
        }

        // ====== Добавление чекбокса в каждую строку ======
        function addRowCheckbox(tr) {
            if (tr.querySelector('.DataGridView__td__checkBox input')) return;

            const id = tr.getAttribute('data-id');
            if (!id) return;

            const td = document.createElement('td');
            td.className = 'controls-DataGridView__td DataGridView__td__checkBox';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.dataset.id = id;

            cb.addEventListener('click', e => e.stopPropagation());
            td.append(cb);
            // делегируем клик на всю ячейку
            td.addEventListener('click', () => {
                cb.checked = !cb.checked;
                updateHeaderCounter();
            });

            tr.insertBefore(td, tr.firstElementChild);
        }
        if (mainTbody) {
            mainTbody.querySelectorAll('tr[data-id]').forEach(addRowCheckbox);

            new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n =>
                n.nodeType === 1 && n.matches('tr[data-id]') && addRowCheckbox(n))))
                    .observe(mainTbody, { childList: true });
        }

        // ====== Обновление счетчика ======
        function updateHeaderCounter() {
            const count = (mainTbody ? mainTbody.querySelectorAll('td.DataGridView__td__checkBox input:checked').length : 0);
            const counter = document.getElementById('sbis-header-counter');
            if (counter) counter.textContent = `Выбрано: ${count}`;
        }
        if (mainTbody) {
            mainTbody.addEventListener('change', e => {
                if (e.target.matches('td.DataGridView__td__checkBox input')) {
                    updateHeaderCounter();
                }
            });
        }

        // ====== Панель кнопок над списком, справа от поиска ======
        function insertPanel() {
            if (document.getElementById('sbis-panel')) return;
            const searchCell = document.querySelector('.controls-Browser__tableCell-search');
            if (!searchCell || !searchCell.parentNode) return;
            const container = searchCell.parentNode;

            const panel = document.createElement('div');
            panel.id = 'sbis-panel';

            const panelLeft = document.createElement('div');
            panelLeft.id = 'sbis-panel-left';
            const panelRight = document.createElement('div');
            panelRight.id = 'sbis-panel-right';

            const btnAll = document.createElement('button');
            btnAll.textContent = 'Выбрать все';
            btnAll.className = 'controls-button';
            btnAll.onclick = () => {
                if (!mainTbody) return;
                mainTbody.querySelectorAll('td.DataGridView__td__checkBox input').forEach(cb => cb.checked = true);
                updateHeaderCounter();
            };

            const btnNone = document.createElement('button');
            btnNone.textContent = 'Снять все';
            btnNone.className = 'controls-button';
            btnNone.onclick = () => {
                if (!mainTbody) return;
                mainTbody.querySelectorAll('td.DataGridView__td__checkBox input').forEach(cb => cb.checked = false);
                updateHeaderCounter();
            };

            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Удалить выбранные';
            btnDelete.className = 'controls-button';
            btnDelete.onclick = () => {
                if (!mainTbody) return;
                const checked = Array.from(mainTbody.querySelectorAll('td.DataGridView__td__checkBox input:checked'));
                const total = checked.length;
                if (!total) {
                    alert('Не выбрано ни одного подключения для удаления.');
                    return;
                } else if (total <= connectionLimitForDeletion) {
                    if (!confirm(`Вы удаляете ${total} подключений. Продолжить?`)) return;
                } else if (total > connectionLimitForDeletion) {
                    if (!confirm(`Будут удалены первые ${connectionLimitForDeletion} из ${total} подключений - остальные останутся.\n` +
                                 `Необходимо будет обновить список и повторить удаление оставщихся.\n` +
                                 `Продолжить?`)) return;
                }

                const toDelete = checked.slice(0, connectionLimitForDeletion);
                require(['Types/source'], src => {
                    const service = new src.SbisService({
                        endpoint: {
                            address: '/integration_config/service/',
                            contract: 'IntegrationConnection'
                        }
                    });

                    toDelete.forEach(cb => {
                        service.call('DeleteConnection', { id: cb.dataset.id });
                        console.log(`Удалено подключение: ${cb.dataset.id}`);
                    });

                    mainTbody.querySelectorAll('td.DataGridView__td__checkBox input').forEach(cb => cb.checked = false);
                    updateHeaderCounter();
                });
            };

            const counter = document.createElement('span');
            counter.id = 'sbis-header-counter';
            counter.textContent = 'Выбрано: 0';

            panelLeft.append(counter, btnAll, btnNone);
            panelRight.append(btnDelete);
            panel.append(panelLeft, panelRight);
            container.insertBefore(panel, searchCell.nextSibling);
        }
        insertPanel();
        new MutationObserver(insertPanel).observe(document.body, { childList: true, subtree: true });

        // ===========================
        // === Обработка виртуальных sticky-таблиц ===
        // ===========================

        // WeakSet чтобы не навешивать наблюдатели много раз на одну и ту же таблицу
        const processedStickyTables = new WeakSet();

        /*
         * Проверяет, находится ли таблица внутри контейнера sticky header'а.
         * Возвращает true если tbl вложена в .ws-sticky-header__header-container.
         */
        function isInStickyContainer(tbl) {
            return tbl && tbl.closest && !!tbl.closest('.ws-sticky-header__header-container');
        }

        /*
        * Гарантирует, что в заданной таблице внутри sticky-контейнера появятся col + th:
        * 1) Если colgroup и thead уже есть — вставляем сразу и помечаем таблицу как обработанную.
        * 2) Если table создана частично (пока нет colgroup или thead) — ставим MutationObserver на саму table,
        *    который подождёт появления нужных узлов и затем выполнит вставку.
        * Также есть safety timeout, чтобы не наблюдать бесконечно.
        */
        function processTable(tbl) {
            if (!tbl || !isInStickyContainer(tbl)) return;

            // Проверяем число <col> в colgroup; если меньше MIN_COLUMNS — пропускаем
            const cg = tbl.querySelector('colgroup');
            if (cg) {
                const colCount = cg.querySelectorAll('col').length;
                if (colCount < MIN_COLUMNS) {
                    console.debug(`[Userscript] пропускаем таблицу с ${colCount} колонками (< ${MIN_COLUMNS})`);
                    return;
                }
            } else {
                // если colgroup пока нет — не обрабатываем (наблюдатель ниже подхватит)
            }

            // если уже обработана и th на месте — ничего не делаем
            if (processedStickyTables.has(tbl) && tbl.querySelector('thead tr th.DataGridView__td__checkBox')) return;

            // сначала попытаемся вставить сразу (если thead/colgroup уже есть)
            const colOk = ensureColForTable(tbl);
            const thOk = ensureThForTable(tbl);

            if (colOk && thOk) {
                processedStickyTables.add(tbl);
                return;
            }

            // иначе — таблица добавлена, но thead/colgroup появятся позже. Наблюдаем за таблицей.
            const obs = new MutationObserver((muts, observer) => {
                try {
                    injectColIfNeeded(tbl);
                    if (injectThIfPossible(tbl)) {
                        processedStickyTables.add(tbl);
                        observer.disconnect();
                    }
                } catch (e) {
                    console.warn('[Userscript] processTable error', e);
                }
            });

            // Наблюдаем за дочерними узлами и вложенными изменениями — когда появятся thead/colgroup, мы подхватим.
            obs.observe(tbl, { childList: true, subtree: true, attributes: false });

            // Safety timeout: если через 7 секунд нужные узлы не появились — отключаем наблюдатель.
            setTimeout(() => {
                try { obs.disconnect(); } catch (e) {}
            }, 7000);
        }

        // ----------------- Инициализация для уже существующих контейнеров -----------------

        // Проходим по всем текущим sticky-контейнерам и проверяем таблицы внутри.
        // Даже если таблица пока отсутствует — processTable ничего не сделает до появления элементов.
        document.querySelectorAll('.ws-sticky-header__header-container').forEach(container => {
            container.querySelectorAll('table.controls-DataGridView__table, .controls-DataGridView__table')
                .forEach(tbl => ensureHeaderForStickyTable(tbl));
        });

        // Глобальный наблюдатель: ловим появление новых контейнеров или таблиц
        const stickyGlobalObserver = new MutationObserver((muts) => {
            for (const m of muts) {
                // если добавлены узлы — проверяем их
                if (m.addedNodes && m.addedNodes.length) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;

                        // 1) Если добавленный узел сам является контейнером — обрабатываем его содержимое
                        if (node.matches && node.matches('.ws-sticky-header__header-container')) {
                            node.querySelectorAll('table.controls-DataGridView__table, .controls-DataGridView__table')
                                .forEach(tbl => processTable(tbl));
                            return;
                        }

                        // 2) Если добавленный узел содержит внутри контейнеры — обработаем их
                        const innerContainers = node.querySelectorAll && node.querySelectorAll('.ws-sticky-header__header-container');
                        if (innerContainers && innerContainers.length) {
                            innerContainers.forEach(cont => cont.querySelectorAll('table.controls-DataGridView__table, .controls-DataGridView__table')
                                .forEach(tbl => processTable(tbl)));
                        }

                        // 3) Если сам добавленный узел — таблица (возможно без контейнера) — проверим, находится ли она внутри sticky-контейнера и обработаем
                        if (node.matches && (node.matches('table.controls-DataGridView__table') || node.matches('.controls-DataGridView__table'))) {
                            if (isInStickyContainer(node)) processTable(node);
                        }

                        // 4) Если внутри добавленного узла появились таблицы — обработаем их
                        const innerTables = node.querySelectorAll && node.querySelectorAll('table.controls-DataGridView__table, .controls-DataGridView__table');
                        if (innerTables && innerTables.length) {
                            innerTables.forEach(tbl => {
                                if (isInStickyContainer(tbl)) processTable(tbl);
                            });
                        }
                    });
                }

                // Дополнительно: при каждой мутации прогоняем текущие контейнеры для надёжности.
                // Это дешёвая операция и покрывает редкие случаи, когда мутация не имеет добавленных узлов,
                // но состояние контейнеров изменилось косвенно.
                document.querySelectorAll('.ws-sticky-header__header-container').forEach(container => {
                    container.querySelectorAll('table.controls-DataGridView__table, .controls-DataGridView__table')
                        .forEach(tbl => processTable(tbl));
                });
            }
        });

        // Запускаем глобальный наблюдатель за всем телом документа
        stickyGlobalObserver.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
        console.error('[Userscript] Ошибка:', error);
    }
})();
