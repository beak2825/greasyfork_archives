// ==UserScript==
// @name         Idealista Tracker
// @namespace    http://tampermonkey.net/
// @version      8.5
// @description  Rastreamento avançado com histórico completo e status de disponibilidade
// @author       Isidro Vila Verde
// @match        https://www.idealista.pt/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @grant        GM.deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535952/Idealista%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/535952/Idealista%20Tracker.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    const STORAGE_PREFIX = 'idealista_tracker_v7_';
    const DEBOUNCE_DELAY = 500;

    // Configuration
    const config = {
        isScriptUpdatingUI: false,
        refreshTimeout: null,
        priceFormatter: new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }),
        translations: {
            transaction: { rent: 'Arrendar', sale: 'Comprar' },
            property: {
                houses: 'Casas',
                apartments: 'Apartamentos',
                rooms: 'Quartos',
                offices: 'Escritórios',
                parking: 'Garagens',
                lands: 'Terrenos'
            },
            sorting: {
                'precos-desc': '↓ Preço',
                'precos-asc': '↑ Preço',
                'atualizado-desc': '↓ Atualizado',
                'area-desc': '↓ Área',
                'default': 'Padrão'
            }
        },
        names: {
            type: 'Tipo',
            price: 'Preço',
            area: 'Área',
            firstSeen: '1ª Detecção',
            lastUpdated: 'Últ. Atualização',
            variation: 'Variação',
            link: 'Link'
        }
    };

    // Helper functions
    const formatPrice = price => config.priceFormatter.format(price);

    const formatDate = isoDate => {
        if (!isoDate) return 'N/A';
        const date = new Date(isoDate);
        const pad = num => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    const getCurrentISODate = () => new Date().toISOString();

    const parsePrice = text => parseInt(text.replace(/[^\d]/g, '')) || 0;
    const parseArea = text => parseInt((text.match(/(\d+)\s*m²/) || [])[1]) || 0;

    // URL and context handling
    const isListingPage = () => {
        const path = window.location.pathname.toLowerCase();
        return /\/(comprar|arrendar)-.+/.test(path) &&
               !/(imovel|blog|ajuda|contato|mapa$|pagina-\d+$)/.test(path);
    };

    const getPageContext = () => {
        const url = new URL(window.location.href);
        const path = url.pathname;

        // Expressão regular para extrair transação, tipo, localização e sublocalização
        // const pathRegex = /(?:\/[^\/]+)*\/(?<trans>arrendar|comprar|venda)-(?<type>casas|apartamentos?|quartos?|escritorios?|garage(?:m|ns)|terrenos?|[\w-]+)(?:\/(?<loc>[^\/]+)(?:\/(?<subLoc>[^\/]+).*(?:\/(?<restri>com-[^\/]+))?)?)?\/?/i;
        const pathRegex = /^(?:\/[^\/]+)*\/(?<trans>arrendar|comprar)-(?<type>casas|apartamentos?|quartos?|escritorios?|garage(?:m|ns)|terrenos?|[\w-]+)(?:\/|$)(?:(?<loc>(?!com-)[^\/]+)(?:\/|$)(?:(?<subLoc>(?:(?!com-)[^\/]+))(?:\/|$))*)?(?<restri>(?<=\/)com-[^\/]*)?\/?$/i;
        const match = path.match(pathRegex) || {};
        const { trans, type, loc, subLoc, restri } = match.groups || {};

        // Extrair parâmetros de busca
        const searchParams = new URLSearchParams(url.search);

        return {
            isAreaSearch: searchParams.has('shape'),
            transactionType: { arrendar: 'rent', comprar: 'sale', venda: 'sale' }[trans?.toLowerCase()] || '',
            propertyType: {
                casas: 'houses',
                apartamentos: 'apartments',
                quarto: 'rooms',
                quartos: 'rooms',
                escritorios: 'offices',
                garagens: 'parking',
                terrenos: 'lands'
            }[type?.toLowerCase()] || type,
            location: loc || '',
            subLocation: subLoc || '',
            restri: restri || '',
            ordem: searchParams.get('ordem') || 'default'
        };
    };

    const getStorageKey = ctx =>
        `${STORAGE_PREFIX}${ctx.isAreaSearch ? 'area_' : ''}${ctx.transactionType}_${ctx.propertyType}_` +
        `${ctx.location}_${ctx.subLocation}_${ctx.ordem}_${ctx.restri}`.replace(/(?<=_)_+|_+$/g, '');

    // Data management
    // Add this at the beginning of the script, after config declaration
    const allDataCache = {};

    // Add this function to load all data at startup
    const loadAllData = async () => {
        const keys = (await GM.listValues()).filter(k => k.startsWith(STORAGE_PREFIX));
        const values = await Promise.all(keys.map(key => GM.getValue(key, '{}')));

        keys.forEach((key, index) => {
            allDataCache[key] = JSON.parse(values[index]);
        });
    };

    // Add this function to save all data when leaving the page
    const saveAllData = async () => {
        await Promise.all(Object.keys(allDataCache).map(key =>
            GM.setValue(key, JSON.stringify(allDataCache[key]))
        ));
    };

    const loadData = async (ctx) => {
        const key = getStorageKey(ctx);

        // If we don't have this key in cache yet, load it from storage
        if (!allDataCache[key]) {
            try {
                const data = await GM.getValue(key, '{}');
                allDataCache[key] = JSON.parse(data) || {};
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                allDataCache[key] = {};
            }
        }

        return allDataCache[key];
    };

    const saveData = async (ctx, data) => {
        const key = getStorageKey(ctx);
        allDataCache[key] = data; // Update our in-memory copy

        // We don't save to storage immediately - will save on page unload
        // This avoids duplicate writes during normal operation
    };

    const updatePropertyStatus = (id, isActive, status) => {
        // 1. Get all keys where `allDataCache[key][id]` exists
        const validKeys = Object.keys(allDataCache).filter(
            key => allDataCache[key]?.[id]
        );

        // 2. Find the most recent `lastSeen` (or use current time if none exists)
        const mostRecentLastSeen = validKeys.reduce((latest, key) => {
            const entryLastSeen = allDataCache[key][id].lastSeen;
            return (entryLastSeen && entryLastSeen > latest) ? entryLastSeen : latest;
        }, ""); // Default: empty string (falsy)

        // 3. Update all valid entries
        validKeys.forEach(key => {
            allDataCache[key][id].lastSeen = mostRecentLastSeen || getCurrentISODate();
            allDataCache[key][id].isActive = isActive;
            allDataCache[key][id].status = status;
        });
    };
    // Function to find the oldest record of a property across all contexts
    const findOldestPropertyRecord = (propertyId) =>
        Object.values(allDataCache)
            .flatMap(context => context[propertyId] || [])
            .reduce((oldest, record) => (
                (!oldest || new Date(record.firstSeen) < new Date(oldest.firstSeen))
                    ? record
                    : oldest
            ), null);

    // Property extraction
    const extractPropertyInfo = item => {
        const link = item.querySelector('a.item-link[href^="/imovel/"]');
        if (!link) return null;

        const url = 'https://www.idealista.pt' + link.getAttribute('href');
        const id = (url.match(/imovel\/(\d+)/) || [])[1];
        if (!id) return null;

        const priceText = item.querySelector('.price-row .item-price')?.textContent || '';
        const typologyText = item.querySelector('.item-detail-char .item-detail:first-child')?.textContent || '';
        const areaText = Array.from(item.querySelectorAll('.item-detail-char .item-detail'))
            .find(el => el.textContent.includes('m²'))?.textContent || '';

        return {
            id,
            url,
            price: parsePrice(priceText),
            typology: (typologyText.match(/(T\d+|Quarto|Estúdio)/i) || [])[0] || typologyText,
            area: parseArea(areaText) + ' m²',
            hasGarage: !!item.querySelector('.item-parking, [title*="garagem"]'),
            isActive: true
        };
    };

    // UI Components
    GM_addStyle(`
#idealistaPanel { position: fixed; top: 10px; right: 10px; width: 850px; max-height: 90vh; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 10000; font-family: 'Segoe UI', Arial, sans-serif; display: flex; flex-direction: column; overflow: hidden; resize: both; min-width: 400px; min-height: 300px; }
#idealistaHeader { padding: 12px 15px; background: #34495e; color: white; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; }
#idealistaContent { overflow-y: auto; flex-grow: 1; padding: 0 5px; }
#idealistaTable { width: 100%; border-collapse: collapse; font-size: 13px; }
#idealistaTable th { position: sticky; top: 0; background: #2c3e50; color: white; padding: 8px 10px; text-align: left; font-weight: 500; cursor: pointer; }
#idealistaTable td { padding: 8px 10px; border-bottom: 1px solid #ecf0f1; vertical-align: top; }
.price-cell { font-weight: bold; white-space: nowrap; }
.price-up { color: #e74c3c; }
.price-down { color: #27ae60; }
.price-same { color: #3498db; }
.status-active-row { background-color: #e8f5e9 !important; }
.status-inactive-row { background-color: #ffebee !important; }
.sort-arrow { margin-left: 5px; }
.idealista-button { background: #2c3e50; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 12px; margin-left: 5px; }
.idealista-button.danger { background: #e74c3c; }
.context-badge { background: #9b59b6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px; }
#idealistaFooter { padding: 10px; background: #f5f5f5; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
th[data-column].sorted-asc::after { content: " ↑"; margin-left: 5px; display: inline-block; }
th[data-column].sorted-desc::after { content: " ↓"; margin-left: 5px; display: inline-block; }
#idealistaPanel::after { content: ''; position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; background: linear-gradient(135deg, #ccc 0%, #ccc 50%, transparent 50%); cursor: nwse-resize; }
#idealistaContent::-webkit-scrollbar { width: 8px; height: 8px; }
#idealistaContent::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
#idealistaContent::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
#idealistaContent::-webkit-scrollbar-thumb:hover { background: #555; }
`);

    const setupTableSorting = () => {
        const table = document.getElementById('idealistaTable');
        if (!table) return;

        // Define our sort functions by data-column values
        const sortFunctions = {
            type: (a, b) => a.localeCompare(b),
            price: (a, b) => parsePrice(a) - parsePrice(b),
            area: (a, b) => parseArea(a) - parseArea(b),
            firstSeen: (a, b) => new Date(a) - new Date(b),
            lastUpdated: (a, b) => new Date(a) - new Date(b)
        };

        let currentSort = { column: null, direction: 1 };

        table.querySelectorAll('th[data-column]').forEach(header => {
            const columnName = header.dataset.column;
            if (!sortFunctions[columnName]) return;

            header.style.cursor = 'pointer';

            header.addEventListener('click', () => {
                // Remove sorting classes from all headers
                table.querySelectorAll('th[data-column]').forEach(h => {
                    h.classList.remove('sorted-asc', 'sorted-desc');
                });

                // Update sort direction
                if (currentSort.column === columnName) {
                    currentSort.direction *= -1;
                } else {
                    currentSort.column = columnName;
                    currentSort.direction = 1;
                }

                // Add appropriate sorting class
                header.classList.add(
                    currentSort.direction === 1 ? 'sorted-asc' : 'sorted-desc'
                );

                // Sort table
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.rows);
                const columnIndex = Array.from(header.parentNode.children).indexOf(header);

                rows.sort((a, b) => {
                    const aVal = a.cells[columnIndex].textContent.trim();
                    const bVal = b.cells[columnIndex].textContent.trim();
                    return sortFunctions[columnName](aVal, bVal) * currentSort.direction;
                });

                // Re-insert sorted rows
                rows.forEach(row => tbody.appendChild(row));
            });
        });
    };

    const translateContext = ctx => {
        const { transaction, property, sorting } = config.translations;
        const loc = ctx.location ?
            ` em ${ctx.location.replace(/-/g, ' ')}${ctx.subLocation ? ` > ${ctx.subLocation.replace(/-/g, ' ')}` : ''}` : '';

        return `${transaction[ctx.transactionType]} ${property[ctx.propertyType] || ctx.propertyType}${loc} | ${sorting[ctx.ordem] || ctx.ordem}`;
    };

    const renderPriceTrend = prop => {
        if (!prop.history?.length) return '<span class="price-same">→ Estável</span>';

        const last = prop.history[prop.history.length - 1];
        const diff = last.change;
        const absDiff = Math.abs(diff);
        const pct = Math.round((absDiff / last.oldPrice) * 100);

        if (diff > 0) return `<span class="price-up">↑ +${formatPrice(absDiff)} (+${pct}%)</span>`;
        if (diff < 0) return `<span class="price-down">↓ -${formatPrice(absDiff)} (-${pct}%)</span>`;
        return '<span class="price-same">→ Igual</span>';
    };

    const createPropertyRow = prop => `
        <tr class="${prop.isActive ? 'status-active-row' : 'status-inactive-row'}">
            <td>${prop.typology}</td>
            <td class="price-cell">${formatPrice(prop.price)}</td>
            <td>${renderPriceTrend(prop)}</td>
            <td>${prop.area}</td>
            <td>${formatDate(prop.firstSeen)}</td>
            <td>${formatDate(prop.lastSeen)}</td>
            <td><a href="${prop.url}" target="_blank">${prop.id}</a></td>
        </tr>
    `;

    const createUI = async () => {
        if (config.isScriptUpdatingUI) return;
        config.isScriptUpdatingUI = true;

        try {
            const ctx = getPageContext();
            if (!ctx.transactionType) return;

            const currentItems = Array.from(document.querySelectorAll('article.item'));
            const currentIds = currentItems
                .map(item => {
                    const href = item.querySelector('a.item-link[href^="/imovel/"]')?.getAttribute('href');
                    return href?.match(/imovel\/(\d+)/)?.[1];
                })
                .filter(Boolean);

            const data = await loadData(ctx);
            let newCount = 0;

            for (const item of currentItems) {
                const prop = extractPropertyInfo(item);
                if (!prop) continue;

                if (!data[prop.id]) {
                    console.log('Try to find old record for', prop.id);
                    // Check for existing records in other contexts
                    const oldestRecord = await findOldestPropertyRecord(prop.id);
                    if (oldestRecord) {
                        console.log('Found old record', oldestRecord);
                        data[prop.id] = oldestRecord
                    } else {
                        newCount++;
                        data[prop.id] = {
                            firstSeen: getCurrentISODate(),
                            initialPrice: prop.price
                        }
                        console.log('New record', data[prop.id]);
                    }

                    // Set location/subLocation if not area search
                    if (!ctx.isAreaSearch) {
                        prop.location = ctx.location;
                        prop.subLocation = ctx.subLocation;
                    }
                }

                // Always update with current data
                data[prop.id] = {
                    ...data[prop.id],
                    ...prop,
                    lastSeen: getCurrentISODate(),
                    isActive: true,
                    status: 'listed'
                };
            }

            if (!ctx.isAreaSearch) {
                await Promise.all(
                    Object.keys(data)
                        .filter(id => !currentIds.includes(id))
                        .map(async id => {
                            try {
                                const response = await fetch(data[id].url, {
                                    method: 'HEAD', // Only fetch headers for efficiency
                                    credentials: 'include'
                                });

                                if (response.status === 404) {
                                    console.log('Property completely removed');
                                    data[id].isActive = false;
                                    data[id].status = 'removed';
                                } else {
                                    console.log(`Property ${id} exists but not in current search`);
                                    data[id].isActive = true;
                                    data[id].status = 'notlisted';
                                }
                            } catch (error) {
                                console.error('Network error or other issue');
                                data[id].isActive = null;
                                data[id].status = 'error';
                            } finally {
                                const { isActive, status } = data[id];
                                await updatePropertyStatus(id, isActive, status);
                            }
                        })
                );
            }

            await saveData(ctx, data);

            const displayData = Object.values(data)
             .filter(prop => prop.status !== 'error' && prop.status !== 'notlisted')
             .sort((a, b) =>
                  new Date(b.lastSeen) - new Date(a.lastSeen)
             );

            const panel = document.createElement('div');
            panel.id = 'idealistaPanel';
            panel.innerHTML = `
                <div id="idealistaHeader">
                    <h3>📊 Idealista Tracker <span class="context-badge">${translateContext(ctx)}</span></h3>
                    <button id="idealistaClose">✕</button>
                </div>
                <div id="idealistaContent">
                    <table id="idealistaTable">
                        <thead>
                            <tr>
                                <th data-column="type">${config.names.type}</th>
                                <th data-column="price">${config.names.price}</th>
                                <th data-column="variation">${config.names.variation}</th>
                                <th data-column="area">${config.names.area}</th>
                                <th data-column="firstSeen">${config.names.firstSeen}</th>
                                <th data-column="lastUpdated">${config.names.lastUpdated}</th>
                                <th data-column="link">${config.names.link}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${displayData.map(createPropertyRow).join('')}
                        </tbody>
                    </table>
                </div>
                <div id="idealistaFooter">
                    <div>${currentItems.length} ativos | ${displayData.length} totais | ${newCount} novos</div>
                    <div>
                        <button id="idealistaExport" class="idealista-button">📁 Exportar</button>
                        <button id="idealistaClearContext" class="idealista-button danger">🗑️ Limpar Esta Pesquisa</button>
                    </div>
                </div>
            `;

            // Event listeners
            panel.querySelector('#idealistaClose').addEventListener('click', () => panel.remove());

            panel.querySelector('#idealistaExport').addEventListener('click', async () => {
                const headers = [
                    'ID', 'Tipologia', 'Preço Inicial', 'Preço Atual', 'Primeira Detecção',
                    'Última Atualização', 'Status', 'Área', 'Garagem', 'Localidade', 'Sub-localidade', 'URL'
                ];

                const rows = displayData.map(p => [
                    p.id,
                    p.typology,
                    p.initialPrice,
                    p.price,
                    p.firstSeen,
                    p.lastSeen,
                    p.isActive ? 'Ativo' : 'Inativo',
                    p.area,
                    p.hasGarage ? 'Sim' : 'Não',
                    p.location || '',
                    p.subLocation || '',
                    p.url
                ]);

                const csvContent = [headers, ...rows]
                    .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(';'))
                    .join('\n');

                await GM_setClipboard(csvContent, 'text');
                alert(`Dados exportados para ${displayData.length} imóveis! Copiado para o clipboard.`);
            });

            panel.querySelector('#idealistaClearContext').addEventListener('click', async () => {
                if (confirm(`⚠️ Apagar TODOS os dados para:\n"${translateContext(ctx)}"?\nEsta ação não pode ser desfeita.`)) {
                    await GM.deleteValue(getStorageKey(ctx));
                    panel.remove();
                }
            });

            document.body.appendChild(panel);
            setupTableSorting();
            // Add draggable
            (function enableDraggableIdealistaPanel() {
                    const panel = document.getElementById('idealistaPanel');
                    if (!panel) return;

                    const header = document.getElementById('idealistaHeader');
                    if (!header) return;

                    panel.style.position = 'fixed';
                    panel.style.top = '50px';
                    panel.style.right = '20px';

                    let isDragging = false;
                    let offsetX = 0;
                    let offsetY = 0;

                    header.style.cursor = 'move';

                    header.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        offsetX = e.clientX - panel.offsetLeft;
                        offsetY = e.clientY - panel.offsetTop;
                        e.preventDefault();
                    });

                    document.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            panel.style.left = `${e.clientX - offsetX}px`;
                            panel.style.top = `${e.clientY - offsetY}px`;
                        }
                    });

                    document.addEventListener('mouseup', () => {
                        isDragging = false;
                    });
            })();

        } catch (error) {
            console.error('Erro ao criar UI:', error);
        } finally {
            config.isScriptUpdatingUI = false;
        }
    };

    // Initialization and DOM observation
    const refreshUI = async () => {
        clearTimeout(config.refreshTimeout);
        document.getElementById('idealistaPanel')?.remove();
        await createUI();
    };

    const setupDOMObserver = () => {
        const observer = new MutationObserver(mutations => {
            if (config.isScriptUpdatingUI) return;

            const hasRelevantChanges = mutations.some(mutation => {
                // Ignore changes within our own panel
                if (mutation.target.id === 'idealistaPanel' ||
                    mutation.target.closest('#idealistaPanel')) {
                    return false;
                }

                // Check for added property items
                return Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 &&
                          (node.matches('article.item') || node.querySelector('article.item'));
                });
            });

            if (hasRelevantChanges) {
                clearTimeout(config.refreshTimeout);
                config.refreshTimeout = setTimeout(refreshUI, DEBOUNCE_DELAY);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    await loadAllData(); // Cache all data at once
    window.addEventListener('beforeunload', saveAllData);
    const init = async () => {
        if (!isListingPage()) {
            console.log('[Idealista] Não é página de listagem - script não será executado');
            return;
        }



        // If items are already loaded
        if (document.querySelector('article.item')) {
            await createUI();
            setupDOMObserver();
            return;
        }

        // Wait for items to load
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('article.item')) {
                obs.disconnect();
                createUI();
                setupDOMObserver();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cleanup after 15 seconds if nothing loads
        setTimeout(() => observer.disconnect(), 15000);
    };

    // Start the script
    if (document.readyState === 'complete') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1000));
    }
})();