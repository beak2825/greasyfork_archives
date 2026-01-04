// ==UserScript==
// @name         LogCN ——esologs中文全站翻译补丁
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @icon         https://images.uesp.net/1/15/ON-icon-Elsweyr.png
// @description  【ESOCN】为esologs全站提供中文翻译补丁 1.全站自动翻译装备名称 2.修复Unknown Item错误 3.翻译试炼、地下城、竞技场列表 4.翻译试炼BOSS列表 5.修复部分中文翻译错误
// @author       苏@RodMajors
// @match        https://www.esologs.com/*
// @match        https://cn.esologs.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.esocn.com.cn
// @downloadURL https://update.greasyfork.org/scripts/545716/LogCN%20%E2%80%94%E2%80%94esologs%E4%B8%AD%E6%96%87%E5%85%A8%E7%AB%99%E7%BF%BB%E8%AF%91%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/545716/LogCN%20%E2%80%94%E2%80%94esologs%E4%B8%AD%E6%96%87%E5%85%A8%E7%AB%99%E7%BF%BB%E8%AF%91%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DATA_URLS = {
        idToNameMap: 'http://api.esocn.com.cn/idToNameMap.json',
        enNameToNameMap: 'http://api.esocn.com.cn/enNameToNameMap.json',
        enZoneToCnMap: 'http://api.esocn.com.cn/enZoneToCnMap.json',
        enDungeonToCnMap: 'http://api.esocn.com.cn/enDungeonToCnMap.json',
        enBossToCnMap: 'http://api.esocn.com.cn/enBossToCnMap.json',
        enarenaToCnMap: 'http://api.esocn.com.cn/enarenaToCnMap.json',
        enEnchantmentToCnMap: 'http://api.esocn.com.cn/enEnchantmentToCnMap.json',
        cnEnchantmentToCnMap: 'http://api.esocn.com.cn/cnEnchantmentToCnMap.json',
        enTraitToCnMap: 'http://api.esocn.com.cn/enTraitToCnMap.json',
        cnTraitToCnMap: 'http://api.esocn.com.cn/cnTraitToCnMap.json',
        enUpdateToCnMap: 'http://api.esocn.com.cn/enUpdateToCnMap.json'
    };

    let idToNameMap = {};
    let enNameToNameMap = {};
    let enZoneToCnMap = {};
    let enDungeonToCnMap = {};
    let enBossToCnMap = {};
    let enarenaToCnMap = {};
    let enEnchantmentToCnMap = {};
    let cnEnchantmentToCnMap = {};
    let enTraitToCnMap = {};
    let cnTraitToCnMap = {};
    let enUpdateToCnMap = {};

    let isEquipmentDataReady = false;
    let isTrialsDataReady = false;
    let isDungeonsDataReady = false;
    let isArenaDataReady = false;
    let isEnchantmentReady = false;
    let isTraitReady = false;
    let isTranslating = false;
    let isUpdateDataReady = false;

    const observer = new MutationObserver(() => {
        // 关键改动：在处理前断开观察者，防止无限循环
        if (observer.isObserving) {
            observer.disconnect();
            observer.isObserving = false;
        }

        // 确保数据准备就绪
        if (!isEquipmentDataReady || !isTraitReady || !isEnchantmentReady) {
            // 如果数据未准备好，则在短暂延迟后重新连接并等待下一次
            setTimeout(() => {
                if (!observer.isObserving) {
                    observer.observe(document.body, { childList: true, subtree: true });
                    observer.isObserving = true;
                }
            }, 100);
            return;
        }

        const url = window.location.href;
        if (url.includes('/reports/')) {
            processReportsPage();
            processSummaryRoles();
        } else if (url.includes('/rankings/')) {
            processRankingsPage();
        } else if (url.includes('/statistics')) {
            processMenuBar();
        }

        // 关键改动：在所有操作完成后重新连接观察者
        // 使用 setTimeout 确保在当前事件循环结束后再重新观察，避免立即触发
        setTimeout(() => {
            if (!observer.isObserving) {
                observer.observe(document.body, { childList: true, subtree: true });
                observer.isObserving = true;
            }
        }, 100);
    });
    observer.isObserving = false;


    async function fetchAndCacheData(name, url) {
        const cacheKey = `${name}Cache`;
        const cacheTimeKey = `${name}CacheTime`;
        const cachedData = GM_getValue(cacheKey);
        const cacheTime = GM_getValue(cacheTimeKey);

        const CACHE_EXPIRE_TIME = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (cachedData && cacheTime && (now - cacheTime < CACHE_EXPIRE_TIME)) {
            return cachedData;
        }
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
            'Referer': 'http://api.esocn.com.cn/',
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: headers,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText.replace(/\r|\n/g, ''));
                            GM_setValue(cacheKey, data);
                            GM_setValue(cacheTimeKey, Date.now());
                            resolve(data);
                        } catch (error) {
                            console.error(`LogCN: Failed to parse data for ${name}:`, error);
                            reject(error);
                        }
                    } else {
                        reject(new Error(`LogCN: HTTP Error: ${response.status} for ${name}`));
                    }
                },
                onerror: (error) => {
                    console.error(`LogCN: Network error for ${name}:`, error);
                    reject(error);
                }
            });
        });
    }

    async function main() {
        if (!isEquipmentDataReady) await fetchEquipmentData();
        if (!isTrialsDataReady) await fetchTrialsData();
        if (!isDungeonsDataReady) await fetchDungeonsData();
        if (!isArenaDataReady) await fetchArenaData();
        if (!isEnchantmentReady) await fetchEnchantmentData();
        if (!isTraitReady) await fetchTraitData();
        if (!isUpdateDataReady) await fetchUpdateData();

        translateTrialButton();
        observeZoneMenu();

        const url = new URL(window.location.href);

        if (url.pathname.includes('/reports/')) {
            processReportsPage();
            processSummaryRoles();
            if (!observer.isObserving) {
                observer.observe(document.body, { childList: true, subtree: true });
                observer.isObserving = true;
            }
        } else if (url.pathname.includes('/rankings/')) {
            processMenuBar()
            processRankingsPage();
            addExpandCollapseAllButton();

            if (!observer.isObserving) {
                observer.observe(document.body, { childList: true, subtree: true });
                observer.isObserving = true;
            }

        } else if (url.pathname.includes('/statistics')) {
            processMenuBar()
        } else {
            if (observer.isObserving) {
                observer.disconnect();
                observer.isObserving = false;
            }
        }
    }

    function observeZoneMenu() {
        if (!isTrialsDataReady || !isDungeonsDataReady || !isArenaDataReady) {
            return;
        }

        const menuObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const menu = document.querySelector('div.header__menu-wrapper--content');
                    if (menu) {
                        const menuText = menu.innerText;
                        if (menuText.includes('Iron Atronach') || menuText.includes('Halls of Fabrication') || menuText.includes('试炼')) {
                            translateTrialMenu(menu);
                        } else if (menuText.includes('Bal Sunnar') || menuText.includes('Fungal Grotto I') || menuText.includes('地下城')) {
                            translateDungeonMenu(menu);
                        } else if (menuText.includes('Maelstrom Arena') || menuText.includes('Vale of the Surreal') || menuText.includes('竞技场')) {
                            translateArenaMenu(menu);
                        }
                    }
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('header-menu-sections-panel__section--expanded')) {
                         const bossList = target.querySelector('ul.header-menu-sections-panel__section-items');
                         if (bossList) {
                            translateBossesInMenu(bossList);
                         }
                    }
                }
            });
        });

        // 初始翻译
        const menu = document.querySelector('div.header__menu-wrapper--content');
        if (menu) {
            const menuText = menu.innerText;
            if (menuText.includes('Iron Atronach') || menuText.includes('Halls of Fabrication')) {
                translateTrialMenu(menu);
            } else if (menuText.includes('Bal Sunnar') || menuText.includes('Fungal Grotto I')) {
                translateDungeonMenu(menu);
            } else if (menuText.includes('Maelstrom Arena') || menuText.includes('Vale of the Surreal')) {
                translateArenaMenu(menu);
            }
        }

        menuObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    function translateTrialMenu(menuContainer) {
        const links = menuContainer.querySelectorAll('a');
        const bosses = menuContainer.querySelectorAll('.header-section-item__content-title');

        bosses.forEach(boss => {
            if (boss.dataset.translated) return;
            const enName = boss.innerText.toLowerCase().replace(/’/g, '\'');
            let translatedName = enBossToCnMap[enName];
            if (translatedName) {
                boss.innerText = translatedName;
                boss.dataset.translated = 'true';
            }
        });

        links.forEach(link => {
            if (link.dataset.translated) return;
            const enName = link.innerText.trim();
            let translatedName = '';
            if (enName === 'The Halls of Fabrication') {
                translatedName = enZoneToCnMap['Halls of Fabrication'];
            } else if (enName === 'Iron Atronach') {
                translatedName = "钢铁侍灵-打桩";
            } else if (enZoneToCnMap[enName]) {
                translatedName = enZoneToCnMap[enName];
            }

            if (translatedName) {
                link.innerText = translatedName;
                link.dataset.translated = 'true';
            }
        });
    }

    function translateDungeonMenu(menuContainer) {
        const dungeonTitleLink = menuContainer.querySelector('.header-section-header__content-title a')
        const dungeonLinks = menuContainer.querySelectorAll('.header-section-item__content-title');

        if (dungeonTitleLink && !dungeonTitleLink.dataset.translated) {
             const enName = dungeonTitleLink.innerText.trim();
             if (enName === 'Dungeons') {
                dungeonTitleLink.innerText = "地下城";
                dungeonTitleLink.dataset.translated = 'true';
             }
        }

        dungeonLinks.forEach(link => {
            if (link.dataset.translated) return;
            const enName = link.innerText.trim();
            const translatedName = enDungeonToCnMap[enName];
            if (translatedName) {
                link.innerText = translatedName;
                link.dataset.translated = 'true';
            }
        });
    }

    function translateArenaMenu(menuContainer) {
        const arenaTitleLinks = menuContainer.querySelectorAll('.header-section-header__content-title a');
        const arenaLinks = menuContainer.querySelectorAll('.header-section-item__content-title');

        arenaTitleLinks.forEach(link => {
            if (link.dataset.translated) return;
            const enName = link.innerText.trim();
            const translatedName = enarenaToCnMap[enName];
            if (translatedName) {
                link.innerText = translatedName;
                link.dataset.translated = 'true';
            }
        });

        arenaLinks.forEach(link => {
            if (link.dataset.translated) return;
            const enName = link.innerText.trim();
            const translatedName = enarenaToCnMap[enName];
            if (translatedName) {
                link.innerText = translatedName;
                link.dataset.translated = 'true';
            }
        });
    }

    function translateBossesInMenu(bossListElement) {
        const bosses = bossListElement.querySelectorAll('.header-section-item__content-title');
        bosses.forEach(boss => {
            if (boss.dataset.translated) return;
            const enName = boss.innerText.toLowerCase().replace(/’/g, '\'');
            let translatedName = enBossToCnMap[enName];
            if (translatedName) {
                boss.innerText = translatedName;
                boss.dataset.translated = 'true';
            }
        });
    }

    function translateTrialButton() {
        const trialButton = document.querySelector("#header-container > header > div.header__desktop > div.header-bottom-bar > div.header-bottom-bar__left > button.header-bottom-bar__item.header-bottom-bar__item--raid-content.eso");
        const dungeonButton = document.querySelector("#header-container > header > div.header__desktop > div.header-bottom-bar > div.header-bottom-bar__left > button.header-bottom-bar__item.header-bottom-bar__item--dungeon-content.eso");
        if (trialButton) {
            for (const node of trialButton.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '尝试') {
                    node.textContent = '试炼';
                    break;
                }
            }
        }
        if (dungeonButton) {
            for (const node of dungeonButton.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Dungeons') {
                    node.textContent = '地下城';
                    break;
                }
            }
        }

        const buttonObserver = new MutationObserver((mutations, observer) => {
            const button = document.querySelector("#header-container > header > div.header__desktop > div.header-bottom-bar > div.header-bottom-bar__left > button.header-bottom-bar__item.header-bottom-bar__item--raid-content.eso");
            const dungeonButton = document.querySelector("#header-container > header > div.header__desktop > div.header-bottom-bar > div.header-bottom-bar__left > button.header-bottom-bar__item.header-bottom-bar__item--dungeon-content.eso");
            if (button) {
                for (const node of button.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '尝试') {
                        node.textContent = '试炼';
                        break;
                    }
                }
            }
            if (dungeonButton) {
                 for (const node of dungeonButton.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Dungeons') {
                        node.textContent = '地下城';
                        break;
                    }
                }
            }
            if (button && dungeonButton) {
                observer.disconnect();
            }
        });
        buttonObserver.observe(document.body, { childList: true, subtree: true });
    }

    function listenForUrlChange() {
        let lastUrl = location.href;
        const bodyObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                main();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => {
            main();
        });

        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            main();
        };
    }

    async function fetchData() {
        try {
            await Promise.all([
                fetchEquipmentData(),
                fetchTrialsData(),
                fetchDungeonsData(),
                fetchArenaData(),
                fetchEnchantmentData(),
                fetchTraitData(),
                fetchUpdateData()
            ]);
        } catch (error) {
            console.error('LogCN: An error occurred during data fetching:', error);
        }
    }

    async function fetchEquipmentData() {
        if (isEquipmentDataReady) return;
        try {
            [idToNameMap, enNameToNameMap] = await Promise.all([
                fetchAndCacheData('idToNameMap', DATA_URLS.idToNameMap),
                fetchAndCacheData('enNameToNameMap', DATA_URLS.enNameToNameMap)
            ]);
            isEquipmentDataReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch equipment data:', error);
        }
    }

    async function fetchTrialsData() {
        if (isTrialsDataReady) return;
        try {
            [enZoneToCnMap, enBossToCnMap] = await Promise.all([
                fetchAndCacheData('enZoneToCnMap', DATA_URLS.enZoneToCnMap),
                fetchAndCacheData('enBossToCnMap', DATA_URLS.enBossToCnMap)
            ]);
            isTrialsDataReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch trials data:', error);
        }
    }

    async function fetchDungeonsData() {
        if (isDungeonsDataReady) return;
        try {
            enDungeonToCnMap = await fetchAndCacheData('enDungeonToCnMap', DATA_URLS.enDungeonToCnMap);
            isDungeonsDataReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch dungeons data:', error);
        }
    }

    async function fetchArenaData() {
        if (isArenaDataReady) return;
        try {
            enarenaToCnMap = await fetchAndCacheData('enarenaToCnMap', DATA_URLS.enarenaToCnMap);
            isArenaDataReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch arena data:', error);
        }
    }

    async function fetchEnchantmentData() {
        if (isEnchantmentReady) return;
        try {
            [enEnchantmentToCnMap, cnEnchantmentToCnMap] = await Promise.all([
                fetchAndCacheData('enEnchantmentToCnMap', DATA_URLS.enEnchantmentToCnMap),
                fetchAndCacheData('cnEnchantmentToCnMap', DATA_URLS.cnEnchantmentToCnMap)
            ]);
            isEnchantmentReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch enchantment data:', error);
        }
    }

    async function fetchTraitData() {
        if (isTraitReady) return;
        try {
            [enTraitToCnMap, cnTraitToCnMap] = await Promise.all([
                fetchAndCacheData('enTraitToCnMap', DATA_URLS.enTraitToCnMap),
                fetchAndCacheData('cnTraitToCnMap', DATA_URLS.cnTraitToCnMap)
            ]);
            isTraitReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch trait data:', error);
        }
    }

    async function fetchUpdateData() {
        if (isUpdateDataReady) return;
        try {
            enUpdateToCnMap = await fetchAndCacheData('enUpdateToCnMap', DATA_URLS.enUpdateToCnMap);
            isUpdateDataReady = true;
        } catch (error) {
            console.error('LogCN: Failed to fetch update data:', error);
        }
    }

    function processReportsPage() {
        if (!isEquipmentDataReady || ! isTraitReady || !isEnchantmentReady) return;

        const gearDivs = document.querySelectorAll('div.filter-bar.miniature');
        let gearTable;

        for (const div of gearDivs) {
            const divText = div.innerText.trim();
            if (divText.includes('Gear') || divText.includes('装备')) {
                gearTable = div.nextElementSibling;
                if (gearTable && gearTable.classList.contains('summary-table')) {
                    break;
                }
            }
        }

        if (!gearTable) return;

        const rows = gearTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const nameCell = row.querySelector('td:nth-child(4)');
            if (!nameCell || nameCell.dataset.translated) return;

            const anchor = nameCell.querySelector('a');
            const nameSpan = nameCell.querySelector('span');
            const setCell = row.querySelector('td:nth-child(5)');
            const traitCell = row.querySelector('td:nth-child(6)')
            const enchantmentCell = row.querySelector('td:nth-child(7)')

            if (anchor && nameSpan && setCell) {
                const href = anchor.getAttribute('href');
                let translatedName;

                const idMatch = href.match(/^(\d+)/);
                if (idMatch && idToNameMap[idMatch[1]]) {
                    translatedName = idToNameMap[idMatch[1]];
                } else {
                    const englishName = nameSpan.innerText.trim();
                    translatedName = enNameToNameMap[englishName];
                }

                if (translatedName) {
                    nameSpan.innerText = translatedName;
                    setCell.innerText = translatedName;
                    nameCell.dataset.translated = 'true';
                }
            }
            if (enTraitToCnMap[traitCell.innerText])
                traitCell.innerText = enTraitToCnMap[traitCell.innerText]
            else
                traitCell.innerText = cnTraitToCnMap[traitCell.innerText]

            if (enEnchantmentToCnMap[enchantmentCell.innerText])
                enchantmentCell.innerText = enEnchantmentToCnMap[enchantmentCell.innerText]
            else
                enchantmentCell.innerText = cnEnchantmentToCnMap[enchantmentCell.innerText]
        });
    }

    function processSummaryRoles() {
        if (!isEquipmentDataReady) return;

        const containers = document.querySelectorAll('div.summary-role-container');
        containers.forEach(container => {
            const secondCells = container.querySelectorAll('td:nth-child(2)');
            secondCells.forEach(cell => {
                 const links = cell.querySelectorAll('a:not([data-translated="true"])');
                 links.forEach(link => {
                    const href = link.getAttribute('href');
                    let translatedName;

                    const itemIdMatch = href.match(/(\d+)/);
                    if (itemIdMatch && idToNameMap[itemIdMatch[1]]) {
                        translatedName = idToNameMap[itemIdMatch[1]];
                    } else {
                        const englishName = link.title.trim();
                        translatedName = enNameToNameMap[englishName];
                    }

                    if (translatedName) {
                        link.title = translatedName;
                        const span = link.querySelector('span');
                        if (span) {
                            span.innerText = translatedName;
                        }
                        link.dataset.translated = 'true';
                    }
                });
            });
        });
    }

    function processMenuBar() {
        const zoneNameElement = document.querySelector('div.zone-block a.zone-name');
        if (zoneNameElement && !zoneNameElement.dataset.translated) {
            const originalText = zoneNameElement.innerText;
            if (originalText === 'The Halls of Fabrication') {
                zoneNameElement.innerText = enZoneToCnMap['Halls of Fabrication'];
                zoneNameElement.dataset.translated = 'true';
            } else if (originalText === 'Iron Atronach') {
                zoneNameElement.innerText = "钢铁侍灵-打桩";
                zoneNameElement.dataset.translated = 'true';
            } else if (enZoneToCnMap[originalText]) {
                zoneNameElement.innerText = enZoneToCnMap[originalText];
                zoneNameElement.dataset.translated = 'true';
            }
        }
        const BossNameElement = document.querySelector('li#filter-boss-selection-container span#filter-boss-text');
        if (BossNameElement && !BossNameElement.dataset.translated) {
            const enName = BossNameElement.innerText.toLowerCase().replace(/’/g, '\'');
            let translatedName = '';
            if (enBossToCnMap[enName]) {
                translatedName = enBossToCnMap[enName];
            }
            if (translatedName) {
                BossNameElement.innerText = translatedName;
                BossNameElement.dataset.translated = 'true';
            }
        }
        const bossRows = document.querySelectorAll('table a.Boss span');
        bossRows.forEach(boss => {
            const enName = boss.innerText.toLowerCase().replace(/’/g, '\'');
            let translatedName = '';
            if (enBossToCnMap[enName]) {
                translatedName = enBossToCnMap[enName];
            }
            if (translatedName) {
                boss.innerText = translatedName;
            }
        })
        const updateElement = document.querySelector('li#filter-partition-selection-container span#filter-partition-text');
        if (updateElement && !updateElement.dataset.translated) {
            const enName = updateElement.innerText.trim();
            let translatedName = '';
            if (enUpdateToCnMap[enName]) {
                translatedName = enUpdateToCnMap[enName];
            }
            if (translatedName) {
                updateElement.innerText = translatedName;
                updateElement.dataset.translated = 'true';
            }
        }
        const updateRows = document.querySelectorAll('li#filter-partition-selection-container li.partition-item a');
        updateRows.forEach(update => {
            const enName = update.innerText.trim();
            let translatedName = '';
            if (enUpdateToCnMap[enName]) {
                translatedName = enUpdateToCnMap[enName];
            }
            if (translatedName) {
                update.innerText = translatedName;
            }
        })
    }

    function processRankingsPage() {
        if (!isEquipmentDataReady) {
            return;
        }
        const playerRows = document.querySelectorAll('table.summary-table tbody tr.odd, table.summary-table tbody tr.even');
        playerRows.forEach((row, rowIndex) => {
            const disclosureSpan = row.querySelector('span.disclosure');

            if (disclosureSpan && !disclosureSpan.dataset.listenerAttached) {
                disclosureSpan.addEventListener('click', (event) => {
                    const clickedRow = event.currentTarget.closest('tr');

                    const parentBody = clickedRow.parentNode;
                    const tempObserver = new MutationObserver((mutationsList, observer) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach(node => {
                                    if (node.tagName === 'TR' && node.querySelector('div.talents-and-gear')) {
                                        const gearRow = node;

                                        if (gearRow.previousElementSibling !== clickedRow) {
                                            return;
                                        }
                                        if (gearRow.dataset.translated) {
                                            observer.disconnect();
                                            return;
                                        }

                                        const scripts = clickedRow.querySelectorAll('script');
                                        let gearScript = null;
                                        for (const script of scripts) {
                                            if (script.innerText.includes('talentsAndGear') && script.innerText.includes('gear.push')) {
                                                gearScript = script;
                                                break;
                                            }
                                        }
                                        if (!gearScript) {
                                            observer.disconnect();
                                            return;
                                        }

                                        const scriptContent = gearScript.innerText;
                                        const idRegex = /id:\s*(\d+)/g;
                                        let match;
                                        const ids = [];
                                        while ((match = idRegex.exec(scriptContent)) !== null) {
                                            ids.push(match[1]);
                                        }
                                        const gearItems = gearRow.querySelectorAll('td.rankings-gear-row');

                                        if (gearItems.length > 0) {
                                            ids.forEach((id, index) => {
                                                if (gearItems[index]) {
                                                    const translatedName = idToNameMap[id];
                                                    if (translatedName) {
                                                        const img = gearItems[index].querySelector('img');
                                                        gearItems[index].innerHTML = `<img class="rankings-gear-image" src="${img ? img.src : ''}" alt="${translatedName}" loading="lazy">${translatedName}`;
                                                    }
                                                }
                                            });
                                            gearRow.dataset.translated = 'true';
                                        }
                                        observer.disconnect();
                                    }
                                });
                            }
                        }
                    });
                    tempObserver.observe(parentBody, { childList: true });
                });
                disclosureSpan.dataset.listenerAttached = 'true';
            }
        });
    }

    function addExpandCollapseAllButton() {
        if (document.getElementById('display-all-or-none')) {
            return;
        }
        const menubar = document.getElementById('rankings-menubar');
        if (!menubar) return;

        const li = document.createElement('li');
        li.id = 'display-all-or-none';
        const button = document.createElement('a');
        button.href = '#';
        button.innerText = '展开/折叠全部装备';
        button.className = 'filter-item has-submenu';
        button.style='padding-right: 12px; color: rgb(241, 195, 60)!important'
        li.appendChild(button);

        menubar.appendChild(li);

        button.addEventListener('click', (event) => {
            event.preventDefault();

            const disclosureSpans = document.querySelectorAll('span.disclosure.zmdi.zmdi-caret-down');
            if (disclosureSpans.length === 0) return;

            const expandedCount = document.querySelectorAll('span.disclosure[data-expanded="true"]').length;
            const shouldCollapse = expandedCount > 0;

            disclosureSpans.forEach(span => {
                const isExpanded = span.getAttribute('data-expanded') === 'true';

                if (shouldCollapse) {
                    if (isExpanded) {
                        span.click();
                    }
                } else {
                    if (!isExpanded) {
                        span.click();
                    }
                }
            });
        });
    }

    fetchData().then(() => {
        main();
        listenForUrlChange();
    });
})();