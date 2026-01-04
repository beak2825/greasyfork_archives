// ==UserScript==
// @name         Scryfall卡牌汉化
// @description  为Scryfall没有中文的卡牌添加汉化，所有汉化数据均来自中文卡查mtgch.com
// @author       lieyanqzu
// @license      GPL
// @namespace    http://github.com/lieyanqzu
// @icon         https://scryfall.com/favicon.ico
// @version      1.7.1
// @match        *://scryfall.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/508932/Scryfall%E5%8D%A1%E7%89%8C%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/508932/Scryfall%E5%8D%A1%E7%89%8C%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .print-langs-item.translate-toggle {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .ruling-source-badge {
            display: inline-block;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 0.8em;
            color: #fff;
            background-color: #666;
            vertical-align: middle;
            margin-left: 4px;
        }

        .ruling-source-badge.official {
            background-color: #2196F3;
        }

        .ruling-source-badge.gpt {
            background-color: #4CAF50;
        }

        @media screen and (max-width: 768px) {
            .toolbox {
                position: relative;
            }
            
            .toolbox .inner-flex {
                max-height: none !important;
                overflow: visible;
            }
            
            .toolbox-toggle {
                display: none;
            }
            
            .toolbox.collapsed .inner-flex {
                max-height: none;
            }
        }
        
        @media screen and (min-width: 769px) {
            .toolbox {
                position: relative;
            }

            .toolbox .inner-flex {
                max-height: 500px;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            }

            .toolbox.collapsed .inner-flex {
                max-height: 30px;
            }

            .toolbox h6 {
                display: flex;
                align-items: center;
                gap: 5px;
                margin: 0;
                padding: 8px 0;
            }

            .toolbox-toggle {
                cursor: pointer;
                padding: 0 5px;
                background: none;
                border: none;
                font-size: 12px;
                color: #666;
                transition: transform 0.3s ease;
            }

            .toolbox.collapsed .toolbox-toggle {
                transform: rotate(180deg);
            }
        }
    `);

    const API_BASE_URL = 'https://mtgch.com/api/v1/card';
    let cardLanguageStates = new Map();

    GM_registerMenuCommand('默认显示中文: ' + (GM_getValue('defaultToChinese', false) ? '开' : '关'), toggleDefaultLanguage);

    function getCardInfoFromDOM(cardProfile) {
        const printsCurrentSet = cardProfile.querySelector('.prints-current-set');
        if (!printsCurrentSet) return null;

        const setMatch = printsCurrentSet.href.match(/\/sets\/(\w+)/);
        if (!setMatch) return null;
        const setCode = setMatch[1];

        const detailsText = cardProfile.querySelector('.prints-current-set-details')?.textContent || '';
        const numberMatch = detailsText.match(/#([^\s]+)/);
        if (!numberMatch) return null;
        const collectorNumber = numberMatch[1];

        return { setCode, collectorNumber };
    }

    document.addEventListener('contextmenu', function(e) {
        if (e.target.classList.contains('translate-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            const parent = e.target.closest('[data-card-id]') || document;
            const cardInfo = getCardInfoFromDOM(parent);
            if (cardInfo) {
                setTimeout(() => {
                    const sbwszUrl = `https://mtgch.com/card/${cardInfo.setCode.toUpperCase()}/${cardInfo.collectorNumber}`;
                    GM_openInTab(sbwszUrl, false);
                }, 0);
            }
            return false;
        }
    }, {capture: true, passive: false});

    function toggleDefaultLanguage() {
        const newDefault = !GM_getValue('defaultToChinese', false);
        GM_setValue('defaultToChinese', newDefault);
        location.reload();
    }

    async function getChineseCardData(setCode, collectorNumber) {
        setCode = setCode.toUpperCase();
        const apiUrl = `${API_BASE_URL}/${setCode}/${collectorNumber}`;
        console.log("call apiUrl: ",apiUrl);
        try {
            const response = await makeRequest('GET', apiUrl);
            const data = JSON.parse(response.responseText);
            const scryfallFaceCount = document.querySelectorAll('.card-text-title').length || 1;

            const cardData = data;
            const cardName = cardData.atomic_official_name || cardData.atomic_translated_name || cardData.zhs_name || cardData.name;
            
            if (cardData.rulings) {
                await saveRulings(cardData.rulings, cardName, cardData);
            }

            if (scryfallFaceCount === 1) {
                return processSingleFacedCard(cardData);
            } else if (cardData.other_faces?.length > 0) {
                return processDoubleFacedCard([cardData, ...cardData.other_faces]);
            } else {
                return processSingleFacedCard(cardData);
            }
        } catch (error) {
            console.error('获取中文卡牌数据失败:', error);
            throw error;
        }
    }

    function processCardFace(cardData) {
        const name = cardData.atomic_official_name || cardData.atomic_translated_name || cardData.zhs_name || cardData.name;
        return {
            name,
            flavorName: cardData.atomic_translated_flavor_name || cardData.zhs_flavor_name || cardData.flavor_name,
            text: processText(cardData.atomic_translated_text || cardData.zhs_text || cardData.oracle_text, name),
            flavorText: processText(cardData.atomic_translated_flavor_text || cardData.zhs_flavor_text || cardData.flavor_text),
            cardData
        };
    }

    const processDoubleFacedCard = data => ({
        front: processCardFace(data[0]),
        back: processCardFace(data[1])
    });

    const processSingleFacedCard = cardData => processCardFace(cardData);

    function processText(text, cardName) {
        if (!text) return text;
        text = text.replace(/\\n/g, '\n');
        return cardName ? text.replace(/CARDNAME/g, cardName) : text;
    }

    async function main() {
        const cardProfiles = document.querySelectorAll('.card-profile');

        const containers = cardProfiles.length > 0 ? cardProfiles : [document];

        for (const container of containers) {
            const cardInfo = getCardInfoFromDOM(container);
            if (!cardInfo) continue;

            const cardId = `${cardInfo.setCode}_${cardInfo.collectorNumber}`;
            container.dataset.cardId = cardId;

            try {
                saveOriginalContent(container);
                addToggleButton(true, container);

                const chineseData = await getChineseCardData(cardInfo.setCode, cardInfo.collectorNumber);
                const scryfallFaceCount = container.querySelectorAll('.card-text-title').length || 1;

                if (scryfallFaceCount === 1 || !chineseData.front) {
                    await saveSingleFacedCard(chineseData, container);
                } else {
                    await saveDoubleFacedCard(chineseData, container);
                }

                updateToggleButton(false, container);

                const defaultToChinese = GM_getValue('defaultToChinese', false);
                cardLanguageStates.set(cardId, false);
                if (defaultToChinese) {
                    await toggleLanguage({ 
                        preventDefault: () => {}, 
                        target: container.querySelector('.print-langs-item') 
                    }, cardId);
                }
            } catch (error) {
                console.error('处理卡牌时出错:', error);
                updateToggleButton(true, container);
            }
        }

        const toolbox = document.querySelector('.toolbox');
        if (toolbox) {
            setupToolboxCollapse(toolbox);
        }
    }

    function setupToolboxCollapse(toolbox) {
        const toolboxTitle = toolbox.querySelector('h6');
        if (!toolboxTitle) return;

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toolbox-toggle';
        toggleButton.innerHTML = '▼';
        toggleButton.title = '折叠/展开工具箱';

        toolboxTitle.insertBefore(toggleButton, toolboxTitle.firstChild);

        if (document.querySelector('#rulings')) {
            toolbox.classList.add('collapsed');
        }

        toggleButton.addEventListener('click', () => {
            toolbox.classList.toggle('collapsed');
        });
    }

    function addToggleButton(loading = false, parent = document) {
        const printLangs = parent.querySelector('.print-langs');
        if (!printLangs) return;

        const cardId = parent.dataset.cardId || document.location.pathname;
        if (!parent.dataset.cardId) {
            parent.dataset.cardId = cardId;
        }

        const toggleLink = document.createElement('a');
        toggleLink.className = 'print-langs-item translate-toggle';
        toggleLink.href = 'javascript:void(0);';
        toggleLink.textContent = loading ? '加载中...' : (cardLanguageStates.get(cardId) ? '原文' : '汉化');
        toggleLink.style.cursor = loading ? 'wait' : 'pointer';

        if (!loading) {
            toggleLink.addEventListener('click', (e) => toggleLanguage(e, cardId));
        }

        printLangs.insertBefore(toggleLink, printLangs.firstChild);
    }

    function updateToggleButton(error = false, parent = document) {
        const toggleLink = parent.querySelector('.print-langs-item');
        if (toggleLink) {
            const cardId = parent.dataset.cardId || document.location.pathname;
            toggleLink.textContent = error ? '加载失败' : (cardLanguageStates.get(cardId) ? '原文' : '汉化');
            toggleLink.style.cursor = error ? 'not-allowed' : 'pointer';
            if (error) {
                toggleLink.removeEventListener('click', (e) => toggleLanguage(e, cardId));
            } else {
                toggleLink.addEventListener('click', (e) => toggleLanguage(e, cardId));
            }

        }
    }

    async function toggleLanguage(event, cardId) {
        event.preventDefault();

        const cardContainer = cardId === document.location.pathname 
        ? document 
        : document.querySelector(`[data-card-id="${cardId}"]`);

        if (!cardContainer) {
            console.error('找不到卡牌容器');
            return;
        }

        const elements = cardContainer.querySelectorAll(
            '.card-text-card-name, .card-text-flavor-name, .card-text-type-line, .card-text-oracle, .card-text-flavor, ' +
            '.card-legality-item dt, .card-legality-item dd'
        );

        const rulingsItems = document.querySelectorAll('.rulings-item');
        const allElements = [...elements, ...rulingsItems];

        const toggleLink = event.target;

        if (allElements.length === 0 || !allElements[0].dataset.chineseContent) {
            console.error('中文数据尚未加载完成');
            return;
        }

        const currentState = cardLanguageStates.get(cardId) || false;
        cardLanguageStates.set(cardId, !currentState);
        toggleLink.textContent = cardLanguageStates.get(cardId) ? '原文' : '汉化';

        allElements.forEach(el => {
            if (el.dataset.chineseContent) {
                [el.innerHTML, el.dataset.chineseContent] = [el.dataset.chineseContent, el.innerHTML];
            }
        });
    }

    function saveOriginalContent(parent = document) {
        parent.querySelectorAll(
            '.card-text-card-name, .card-text-flavor-name, .card-text-type-line, .card-text-oracle, .card-text-flavor'
        ).forEach(el => {
            el.dataset.originalContent = el.innerHTML;
        });
    }

    async function saveSingleFacedCard(chineseData, parent = document) {
        await saveCardFace(parent, parent, chineseData, 0);
        console.log('中文数据已保存');
    }

    async function saveDoubleFacedCard(chineseData, parent = document) {
        const cardTextDiv = parent.querySelector('.card-text');
        if (!cardTextDiv) {
            console.error('无法找到卡牌文本元素');
            return;
        }

        const cardFaces = cardTextDiv.querySelectorAll('.card-text-title');
        if (cardFaces.length !== 2) {
            console.error('无法找到双面卡牌的元素');
            return;
        }

        await Promise.all([
            saveCardFace(cardTextDiv, cardFaces[0], chineseData.front, 0),
            saveCardFace(cardTextDiv, cardFaces[1], chineseData.back, 1)
        ]);
    }

    async function saveCardFace(cardTextDiv, cardFace, faceData, faceIndex) {
        if (!faceData) return;

        await Promise.all([
            saveElementText('.card-text-card-name', faceData.name, cardFace),
            faceData.flavorName ? saveElementText('.card-text-flavor-name', faceData.flavorName, cardFace) : Promise.resolve(),
            saveType(cardTextDiv.querySelectorAll('.card-text-type-line')[faceIndex], faceData.cardData),
            saveCardText('.card-text-oracle', faceData.text, cardTextDiv, faceIndex),
            faceData.flavorText ? saveCardText('.card-text-flavor', faceData.flavorText, cardTextDiv, faceIndex) : Promise.resolve(),
            saveLegality(cardTextDiv)
        ]);
    }

    async function saveElementText(selector, text, parent = document) {
        const element = parent.querySelector(selector);
        if (element) {
            element.dataset.chineseContent = text;
        }
    }

    async function saveType(typeLineElement, cardData) {
        if (!typeLineElement) return;
        const typeText = cardData.atomic_translated_type || cardData.zhs_type_line;

        if (typeText) {
            const colorIndicator = typeLineElement.querySelector('.color-indicator');
            const cleanedType = cleanTypeText(typeText);
            typeLineElement.dataset.chineseContent = colorIndicator
                ? `${colorIndicator.outerHTML} ${cleanedType}`
                : cleanedType;
        }
    }

    function cleanTypeText(text) {
        return text ? text.replace(/<([^>]+)>/g, '$1') : text;
    }

    async function saveCardText(selector, text, parent = document, index = 0) {
        const elements = parent.querySelectorAll(selector);
        if (elements[index]) {
            const preservedHtml = await preserveManaSymbols(elements[index].innerHTML, text);
            elements[index].dataset.chineseContent = `<p>${preservedHtml.replace(/\n/g, '</p><p>')}</p>`;
        } else if (index === 1) {
            const frontElement = elements[0];
            if (frontElement) {
                const preservedHtml = await preserveManaSymbols(frontElement.innerHTML, text);
                frontElement.dataset.chineseContent = `<p>${preservedHtml.replace(/\n/g, '</p><p>')}</p>`;
            }
        }
    }

    async function preserveManaSymbols(originalHtml, chineseText) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHtml;

        const symbols = tempDiv.querySelectorAll('abbr.card-symbol');
        const symbolMap = new Map();

        symbols.forEach(symbol => {
            const symbolText = symbol.title.match(/\{(.+?)\}/)?.[0] || 
                  symbol.textContent.match(/\{(.+?)\}/)?.[0] || 
                  `{${symbol.textContent}}`;
            symbolMap.set(symbolText, (symbolMap.get(symbolText) || []).concat(symbol.outerHTML));
        });

        return Array.from(symbolMap).reduce((result, [symbolText, htmls]) => {
            let index = 0;
            return result.replace(new RegExp(escapeRegExp(symbolText), 'g'), () => {
                const html = htmls[index];
                index = (index + 1) % htmls.length;
                return html;
            });
        }, chineseText);
    }

    const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function makeRequest(method, url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                onload: resolve,
                onerror: reject
            });
        });
    }

    const FORMAT_TRANSLATIONS = {
        'Standard': '标准',
        'Alchemy': '炼金',
        'Pioneer': '先驱',
        'Explorer': '探险',
        'Modern': '摩登',
        'Historic': '史迹',
        'Legacy': '薪传',
        'Brawl': '争锋',
        'Vintage': '特选',
        'Timeless': '永恒',
        'Commander': '指挥官',
        'Pauper': '纯铁',
        'Oathbreaker': '破誓人',
        'Penny': '便士'
    };

    const LEGALITY_TRANSLATIONS = {
        'Legal': '合法',
        'Legal/GC': '合法/主宰牌',
        'Not Legal': '不合法',
        'Banned': '禁用',
        'Restrict.': '限制'
    };

    async function saveLegality(parent = document) {
        const legalityItems = parent.querySelectorAll('.card-legality-item');
        legalityItems.forEach(item => {
            const format = item.querySelector('dt');
            const legality = item.querySelector('dd');

            if (format && legality) {
                const formatText = format.textContent.trim();
                format.dataset.chineseContent = FORMAT_TRANSLATIONS[formatText] || formatText;

                const legalityText = legality.textContent.trim();
                legality.dataset.chineseContent = LEGALITY_TRANSLATIONS[legalityText] || legalityText;
            }
        });
    }

    async function saveRulings(rulings, cardName, cardData) {
        const rulingsContainer = document.querySelector('#rulings');
        if (!rulingsContainer) {
            return;
        }

        // 合并主面和其他面的规则，过滤掉没有翻译的规则
        const allRulings = rulings.filter(ruling => ruling.translation);
        if (cardData.other_faces) {
            for (const face of cardData.other_faces) {
                if (face.rulings) {
                    const faceRulings = face.rulings.filter(ruling => ruling.translation);
                    allRulings.push(...faceRulings);
                }
            }
        }

        const rulingsItems = rulingsContainer.querySelectorAll('.rulings-item');
        for (const item of rulingsItems) {
            const dateSpan = item.querySelector('.rulings-item-date');
            const date = dateSpan ? dateSpan.textContent.replace(/[()]/g, '') : '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.innerHTML;
            dateSpan && tempDiv.removeChild(tempDiv.querySelector('.rulings-item-date'));
            const englishText = tempDiv.textContent.trim();

            const abbrTags = [];
            item.querySelectorAll('abbr.card-symbol').forEach(abbr => {
                abbrTags.push(abbr.outerHTML);
            });

            const matchingRuling = allRulings.find(r => {
                const tempApiDiv = document.createElement('div');
                tempApiDiv.textContent = r.comment;
                const normalizedApiText = tempApiDiv.textContent.trim().replace(/[\u0021-\u002F\u003A-\u003F\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF]/g, '');
                const normalizedEnglishText = englishText.replace(/[\u0021-\u002F\u003A-\u003F\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF]/g, '');
                return normalizedApiText === normalizedEnglishText;
            });

            if (matchingRuling && matchingRuling.translation) {                
                item.dataset.originalContent = item.innerHTML;
                let translatedText = processText(matchingRuling.translation, cardName);
                const matches = translatedText.match(/\{[^}]+\}/g) || [];

                matches.forEach((match, index) => {
                    if (abbrTags[index]) {
                        translatedText = translatedText.replace(match, abbrTags[index]);
                    }
                });

                const sourceBadge = `<span class="ruling-source-badge ${matchingRuling.source}">${matchingRuling.source.toUpperCase()}</span>`;
                const newHtml = dateSpan 
                    ? `${translatedText}<span class="rulings-item-date">${dateSpan.textContent}${sourceBadge}</span>`
                    : `${translatedText}${sourceBadge}`;
                item.dataset.chineseContent = newHtml;
            }
        }
    }

    main();
})();