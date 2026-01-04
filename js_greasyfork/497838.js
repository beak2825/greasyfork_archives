// ==UserScript==
// @name         PokeRogue-Pokedex-Translator
// @namespace    https://github.com/manhattanhouse/poke_kor
// @version      7.0
// @description  PokeRogue Pokedex 항목을 한국어로 번역합니다.
// @author       manhattanhouse
// @match        https://ydarissep.github.io/PokeRogue-Pokedex/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497838/PokeRogue-Pokedex-Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/497838/PokeRogue-Pokedex-Translator.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const json_url = "https://raw.githubusercontent.com/manhattanhouse/poke_kor/main/pokedex_trans.json";
    const translations = await fetchJsonData(json_url);

    // JSON 데이터 fetch
    async function fetchJsonData(url) {
        const response = await fetch(url);
        return response.json();
    }

    /*
    // 첫 글자를 제외하고 소문자로 변경
    function lowerText(text) {
        return text.charAt(0) + text.slice(1).toLowerCase();
    }

    // 메뉴 번역
    function addButtonsEventListener() {
        const buttons = document.getElementById('tableButton').getElementsByTagName('button');
        const buttonTexts = ["특성", "포켓몬", "기술", "바이옴", "트레이너", "아이템"];
        Array.from(buttons).forEach((button, index) => {
            button.innerText = buttonTexts[index];
        });
    }
    */
    // 셀 번역
    function translateCell(cell, translationDict, classPrefix = '') {
        const originalText = cell.textContent.trim();
        const translatedText = translationDict[originalText] /*|| translationDict[lowerText(cell.className.split(' ')[0].replace(classPrefix, ''))]*/;
        if (translatedText) {
            cell.textContent = translatedText;
        }
    } 
    /*
    // 행 번역
    function translateRow(row, translations) {
        translateCell(row.querySelector('.nameContainer .species'), translations.names);
        row.querySelectorAll('.types .background').forEach(cell => translateCell(cell, translations.types, 'TYPE_'));
        row.querySelectorAll('.abilities div').forEach(cell => translateCell(cell, translations.abilities));
        row.querySelectorAll('.italic').forEach(cell => translateCell(cell, translations.headers));
    }
    
    // 기술 행 번역
    function translateMovesRow(row, translations) {
        const moveCell = row.querySelector('.move');
        const originalText = moveCell.textContent.trim();
        const matchedText = originalText.match(/\((.)\)/);
        const originalMoveText = moveCell.textContent.replace(/\(.\)/, '').trim();
        const moveData = translations.moves[originalMoveText];

        if (moveData) {
            if (matchedText) {
                moveCell.textContent = `${moveData.name_kr} (${matchedText[1]})`;
            } else {
                moveCell.textContent = moveData.name_kr;
            }

            const effectCell = row.querySelector('.effect');
            if (effectCell) {
                const effectTranslation = translations.move_effect.find(effect => effect[0] === effectCell.textContent.trim());
                if (effectTranslation) effectCell.textContent = effectTranslation[1];
            }

            const descriptionCell = row.querySelector('.description div');
            if (descriptionCell) {
                if (effectCell.textContent.length > 0 && moveData.Effect_kr.length < 44) {
                    descriptionCell.textContent = moveData.Effect_kr;
                } else {
                    descriptionCell.outerHTML = moveData.Effect_kr.includes(". ") ? moveData.Effect_kr.replace(". ", ". \n").split("\n").map(part => `<div>${part}</div>`).join("") : splitMiddle(moveData.Effect_kr, 35).map(part => `<div>${part}</div>`).join("");
                }
            }

            translateCell(row.querySelector('td.type div:first-child'), translations.types, 'TYPE_');
        }
    }

    // 헤더 번역
    function translateHeader(headers, translations) {
        headers.forEach(cell => translateCell(cell, translations));
    }
    */
    // 필터 목록 번역
    function translateSpeciesFilterList(tableFilters) {
        tableFilters.forEach(item => {
            const spans = item.querySelectorAll('span');
            if (spans.length >= 2) {
                const firstSpan = spans[0];
                const secondSpan = spans[1];
                if (!secondSpan.hasAttribute('data-original-text')) {
                    const originalText = secondSpan.textContent.trim();
                    secondSpan.setAttribute('data-original-text', originalText);
                    const className = firstSpan.className.trim();

                    const translationOptions = {
                        "Form": {
                            "text": "폼: ",
                            "data": translations.form
                        },
                        "Type": {
                            "text": "타입: ",
                            "data": translations.types
                        },
                        "Ability": {
                            "text": "특성: ",
                            "data": translations.abilities
                        },
                        "Biome": {
                            "text": "바이옴: ",
                            "data": translations.biomes
                        },
                        "Split": {
                            "text": "분류: "
                        },
                        "Flag": {
                            "text": "플래그: "
                        },
                        "Target": {
                            "text": "타겟: "
                        }
                    }

                    const option = translationOptions[className]
                    let translatedText = '';

                    if (option && option['data']) {
                        translatedText = option.data[originalText];
                        firstSpan.innerText = option.text;
                    } else if (option) {
                        for (var filter of translations.move_filters) {
                            if (filter[0] == originalText) {
                                translatedText = filter[1];
                                break;
                            }
                        }
                        firstSpan.innerText = option.text;
                    } else if (className == 'Move') {
                        Object.values(translations.moves).forEach(({ name, name_kr }) => {
                            if (name.includes(originalText)) {
                                translatedText = name_kr;
                            }
                        });
                        firstSpan.innerText = '기술: ';
                    }

                    if (translatedText) {
                        secondSpan.textContent = translatedText;
                    }
                }
            }
        });
    }

    // 팝업 번역
    function translatePopup(translations) {
        const popup = document.getElementById('popup');
        if (popup) {
            /*
            const title = popup.querySelector('h2');
            const originalText = title.textContent.trim();
            const matchedText = originalText.match(/\((.)\)/);
            const originalMoveText = title.textContent.replace(/\(.\)/, '').trim();
            const moveData = translations.moves[originalMoveText];
            if (moveData) {
                if (matchedText) {
                    title.textContent = `${moveData.name_kr} (${matchedText[1]})`;
                } else {
                    title.textContent = moveData.name_kr;
                }
                const description = popup.querySelector('.popupTrainerMoveDescription');
                if (description) description.textContent = moveData.Effect_kr;

                popup.querySelectorAll('.popupTrainerMoveStat').forEach(stat => {
                    Object.keys(translations.moves_head).forEach(key => {
                        if (stat.innerText.includes(key)) {
                            stat.innerText = stat.innerText.replace(key, translations.moves_head[key]);
                        }
                    });
                });

                const effectElement = popup.querySelector('.popupTrainerMoveEffect');
                if (effectElement) {
                    const effectTranslation = translations.move_effect.find(effect => effect[0] === effectElement.textContent.trim());
                    if (effectTranslation) effectElement.textContent = effectTranslation[1];
                }
            }
            */
            popup.querySelectorAll('.hyperlink').forEach(link => {
                const filterTranslation = translations.move_filters.find(filter => filter[0] == link.innerText);
                if (filterTranslation) link.innerText = filterTranslation[1];
            });
            translateCell(popup.querySelector('.popupTrainerMoveType'), translations.types);
            popup.querySelector('.popupFilterButton').textContent = '필터';
        }
    }

    /*
    // 요소 관찰
    function observeElement(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const element = document.querySelector(selector);
                    if (element) {
                        callback();
                        break;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 노드 번역
    function translateNodes(nodes, jsonData) {
        nodes.forEach(node => {
            const translatedText = jsonData[node.innerText];
            if (translatedText) node.innerText = translatedText;
        });
    }

    // 선택자로 번역
    function transElement(selector, key, text = null) {
        const element = document.querySelector(selector);
        if (element) {
            if (text !== null) {
                element.innerText = text;
            } else {
                let name_key = element.innerText;
                if (key === 'types') name_key = lowerText(name_key);
                if (translations[key][name_key]) {
                    element.innerText = translations[key][name_key];
                }
            }
        }
    }
    */

    let previousUrl = window.location.href;
    //let previousHeight = 0;
    //let previousHeightAb = 0;

    function checkUrlChange() {
        const currentUrl = window.location.href;
        //const currentHeight = document.querySelector("#locationsTable").offsetHeight;
        //const currentHeightAb = document.querySelector("#abilitiesTable").offsetHeight;

        if (currentUrl !== previousUrl /*|| previousHeight !== currentHeight*/) {
            previousUrl = currentUrl;
            //previousHeight = currentHeight
            mainScript();
        } /*else if (previousHeightAb !== currentHeightAb) {
            transAbilities();
        }*/
    }

    const observer = new MutationObserver(checkUrlChange);
    observer.observe(document, { childList: true, subtree: true });

    /*

    observeElement('#speciesTable tbody', () => {
        document.querySelectorAll('#speciesTable tbody tr').forEach(row => translateRow(row, translations));
    });

    observeElement('#movesTableTbody', () => {
        document.querySelectorAll('#movesTableTbody tr').forEach(row => translateMovesRow(row, translations));
    });

    */

    const selectors = ['#speciesInput', '#movesInput', '#locationsInput', '#abilitiesInput'];
    const filterSelectors = ['#speciesFilterList .tableFilter', '#movesFilterList .tableFilter', '#locationsFilterList .tableFilter', false];

    setTimeout(() => {
        mainScript();

        /*
        const locationsBody = document.querySelector('#locationsTableTbody');
        observeElement('#locationsTableTbody', () => {
            const currentHeight = locationsBody.offsetHeight;
            if (previousHeight != currentHeight) {
                mainScript();
            }
        });
        */

        const searchInputs = selectors.map(selector => document.querySelector(selector));

        // 검색창 한국어 -> 영어 변환
        searchInputs.forEach((input, index) => {
            input.addEventListener('keyup', (event) => {
                const filterSelector = filterSelectors[index];
                /*
                if (event.key === 'Enter') {
                    const query = input.value.trim();
                    let value = '';
                    if (filterSelector) {
                        value = translations.reverse[query] || 
                            Object.keys(translations.biomes).find(key => translations.biomes[key] === query) ||
                                Object.keys(translations.rarityHead).find(key => translations.rarityHead[key] === query) || 
                                    reverseTranslatorMove(query);
                    } else {
                        value = Object.keys(translations.abilities).find(key => translations.abilities[key] === query);
                    }
                    if (value) {
                        setTimeout(() => {
                            input.value = value;
                        }, 0);
                    }
                    checkUrlChange();
                }
                */
                if (!filterSelector) return;
                setTimeout(() => { toggleFilter(input, filterSelector); }, 100);        
            });
        });

        const dropmenu_input = document.querySelector('input#speciesPanelInputSpecies');
        dropmenu_input.addEventListener('input', () => {
            const query = dropmenu_input.value.trim();
            if (query) {
                let value = translations.reverse[query];
                if (value) {
                    setTimeout(() => {
                        dropmenu_input.blur();
                        dropmenu_input.focus();
                        dropmenu_input.value = value;
                        const species = `SPECIES_${value.replaceAll(" ", "_").toUpperCase()}`
                        createSpeciesPanel(species)
                        speciesPanelInputSpecies.blur()
                        speciesPanelInputSpecies.value = ""
                    }, 0);
                }
            }
        });

        // IME 중복 입력 방지

        dropmenu_input.addEventListener('blur', function(event) {
            const value = this.value
            this.value = '';
            this.value = value;
        });

        const popupObserver = new MutationObserver(() => translatePopup(translations));
        popupObserver.observe(document.getElementById('popup'), { childList: true, subtree: true });

    }, 1000);

    // 일치하는 태그 토글
    function toggleFilter(input, selector) {
        const query = input.value.trim();
        const hasKr = /([\uAC00-\uD7A3]){2,}/.test(query);
        const filterListItems = document.querySelectorAll(selector);
        filterListItems.forEach(item => {
            if (query.length < 3 && !hasKr) {
                item.style.removeProperty('display');
                return
            }
            const span = Array.from(item.querySelectorAll('span')).find(span => 
                (span.getAttribute('data-original-text') && span.getAttribute('data-original-text').includes(query)) || 
                (span.innerText && span.innerText.includes(query))
            );
            if (span) {
                item.style = 'display: inline-block !important;';
            } else {
                item.style.removeProperty('display');
            }
        });
    }

    // 메인 스크립트
    function mainScript() {
        const currentUrl = window.location.href;

        //addButtonsEventListener();

        if (currentUrl.includes('?table=speciesTable')) {
            translateSpeciesFilterList(document.querySelectorAll('#speciesFilterList .tableFilter'));
            toggleFilter(document.querySelector(selectors[0]), filterSelectors[0]);
            /*
            const variantNode = document.querySelector('#onlyShowVariantPokemon');
            if (variantNode) {
                variantNode.innerText = '변종';
            }
            translateHeader(document.querySelectorAll('#speciesTableThead th'), translations.headers);
            document.querySelectorAll('#speciesTable tbody tr').forEach(row => translateRow(row, translations));
            */

        } else if (currentUrl.includes('?table=movesTable')) {
            translateSpeciesFilterList(document.querySelectorAll('#movesFilterList .tableFilter'));
            toggleFilter(document.querySelector(selectors[1]), filterSelectors[1]);
            /*
            translateHeader(document.querySelectorAll('#movesTableThead th'), translations.moves_head);
            document.querySelectorAll('#movesTableTbody tr').forEach(row => translateMovesRow(row, translations));
            */

        } else if (currentUrl.includes('?species')) {
            speciesPage(translations);
            //translateNodes(document.querySelectorAll('#speciesPanelBiomesContainer .speciesPanelText'), { "바이옴:": "바이옴:" });
            //translateNodes(document.querySelectorAll('#speciesPanelBiomesContainer .hyperlink'), translations.biomes);

        } else if (currentUrl.includes('?table=locationsTable')) {
            translateSpeciesFilterList(document.querySelectorAll('#locationsFilterList .tableFilter'));
            toggleFilter(document.querySelector(selectors[2]), filterSelectors[2]);
            /*
            const variantNode = document.querySelector('#onlyShowVariantPokemonLocations');
            if (variantNode) {
                variantNode.innerText = '변종';
            }

            const timeData = { "Dawn": "아침", "Day": "낮", "Dusk": "저녁", "Night": "밤" };
            const nodesToTranslate = {
                '.locationSpeciesName': translations.names,
                '.rarityTableThead': translations.rarityHead,
                '.locationName': translations.biomes,
                '.timeOfDay': timeData
            };

            Object.keys(nodesToTranslate).forEach(selector => {
                const jsonData = nodesToTranslate[selector];
                translateNodes(document.querySelectorAll(selector), jsonData);
            });

            document.querySelectorAll('.previousLinkInfo, .nextLinkInfo').forEach(info => {
                const textNode = info.childNodes[0];
                if (translations.biomes[textNode.textContent]) {
                    textNode.textContent = translations.biomes[textNode.textContent];
                }
            });
            */

        } else if (currentUrl.includes('?table=abilitiesTable')) {
            /*
            document.querySelectorAll('#abilitiesTableThead th').forEach(th => {
                if (th.className == 'ability') th.textContent = '이름';
                else if (th.className == 'description') th.textContent = '설명';
            });
            transAbilities();
            */
        }
    }
    /*
    // 특성 페이지 번역 함수
    function transAbilities() {
        const cells = document.querySelectorAll('#abilitiesTableTbody td.ability');
        cells.forEach(cell => {
            const childNodes = cell.childNodes;
            if (childNodes) {
                const textNode = childNodes[0];
                const parts = textNode.textContent.split(' (');
                const key = parts[0];
                if (translations.abilities[key]) {
                    const des_key = translations.abilities[key];
                    if (parts[1]) {
                        textNode.textContent = `${des_key} (${parts[1]}`;
                    } else {
                        textNode.textContent = des_key;
                    }
                    const des = cell.nextElementSibling;
                    if (des && translations.abilities_kr[des_key]) {
                        des.textContent = translations.abilities_kr[des_key];
                    }
                }
            }
        })
    }

    // 기술 페이지 역번역 함수
    function reverseTranslatorMove(query) {
        if (translations.move_reverse[query]) {
            return translations.move_reverse[query];
        }
        const filterTranslation = translations.move_filters.find(filter => filter[1] === query);
        if (filterTranslation) return filterTranslation[0];

        const move = Object.keys(translations.moves).find(key => translations.moves[key].name_kr === query);
        if (move) return move;

        const type = Object.keys(translations.types).find(key => translations.types[key] === query);
        if (type) return type;

        return false;
    }
    */

    // key to value replace 함수
    function translateText(text, dictionary, key) {
        if (dictionary[key]) {
            if (dictionary[key]["name_kr"]) {
                return text.replace(key, dictionary[key].name_kr);
            }
            return text.replace(key, dictionary[key]);
        }
        return text;
    }

    // 포켓몬 상세 페이지 번역
    function speciesPage(translations) {
        const dropmenu = document.querySelectorAll('datalist#speciesPanelInputSpeciesDataList option');
        dropmenu.forEach(option => {
            if (translations.names[option.textContent]) {
                option.textContent = translations.names[option.textContent];
            }
        })

        /*
        const translationMappings = [
            { selector: '#speciesName', key: 'names' },
            { selector: '#speciesType1', key: 'types' },
            { selector: '#speciesType2', key: 'types' },
            { selector: '#speciesType3', key: 'types' }
        ];
        
        translationMappings.forEach(mapping => {
            transElement(mapping.selector, mapping.key, mapping.text);
        });
        */

        const panelText = {
            //"Types:": "타입:",
            //"Starter Cost:": "코스트:",
            //"Abilities:": "특성:",
            //"Biomes:": "바이옴:",
            "Evolution:": "진화:",
            "Formes:": "폼:"
        }

        const panels = document.querySelectorAll('.speciesPanelText');
        panels.forEach(panel => {
            if (panelText[panel.innerText]) {
                panel.innerText = panelText[panel.innerText];
            }
        })

        /*
        const abilities = document.querySelector('#speciesAbilities');
        if (abilities) {
            abilities.querySelectorAll('span.hyperlink').forEach(link => {
                if (translations.abilities[link.innerText]) {
                    link.innerText = translations.abilities[link.innerText];
                    const des = link.nextElementSibling;
                    des.textContent = translations.abilities_kr[link.innerText.split(' ')[0]];
                }
            });
        }

        const stats = document.querySelector('#statsSection');
        if (stats) {
            let replaceNames = { "Atk": "공격", "Def": "방어", "SpA": "특공", "SpD": "특방", "Spe": "속도", "BST": "합계" };
            Object.entries(replaceNames).forEach(([key, value]) => {
                stats.innerHTML = stats.innerHTML.replace(new RegExp(key, 'g'), value);
            });
        }
        */

        const evoDiv = document.querySelector('#speciesEvoTable');
        const regex = /Item In Biome (.+) \((.+)\)/;
        const regex_move = /Level Move ([^\(]+) \((\d+)\)/;
        const regex_item = /\(([^)]+)\)/;
        function evoTrans(evoMethod) {
            Object.entries(translations.evol_long).forEach(([key, value]) => {
                evoMethod.innerText = evoMethod.innerText.replace(key, value);
            });
            let match = evoMethod.innerText.match(regex);
            if (match) {
                evoMethod.innerText = `[${match[1]}] \n바이옴에서 아이템 사용 (${match[2]})`;
                evoMethod.innerText = translateText(evoMethod.innerText, translations.items, match[2]);
                let entries = Object.entries(translations.biomes);
                entries.sort((a, b) => b[0].length - a[0].length);
                entries.forEach(([key, value]) => {
                    evoMethod.innerText = evoMethod.innerText.replace(key, value+', ');
                });
                evoMethod.innerText = evoMethod.innerText.replace(', ]', ']');
            } else {
                match = evoMethod.innerText.match(regex_move);
                if (match) {
                    evoMethod.innerText = `[${match[1].trim()}] 기술을 익히고 레벨 (${match[2]})`;
                    evoMethod.innerText = translateText(evoMethod.innerText, translations.moves, match[1]);
                } else {
                    match = evoMethod.innerText.match(regex_item);
                    if (match) {
                        evoMethod.innerText = translateText(evoMethod.innerText, translations.items, match[1]);
                    }
                }
            }
            Object.entries(translations.evol).forEach(([key, value]) => {
                evoMethod.innerText = evoMethod.innerText.replace(key, value);
            });
        }
        if (evoDiv) {
            const evoMethods = evoDiv.querySelectorAll('.evoMethod');
            evoMethods.forEach(evoMethod => {
                evoTrans(evoMethod);
            });
        }
        /*
        const formDiv = document.querySelector('#speciesFormes');
        if (formDiv) {
            formDiv.querySelectorAll('.underline').forEach(form => {
                if (translations.names[form.innerText]) {
                    form.innerText = translations.names[form.innerText];
                }
            });
        }
        */

        const defensive = document.querySelector('#speciesDefensiveTypeChartContainer');
        if (defensive) {
            defensive.querySelector('.bold').innerText = "공격받을 때";
            /*
            defensive.querySelectorAll('.backgroundSmall').forEach(type => {
                const key = lowerText(type.className.split(' ')[1].replace('TYPE_', ''));
                if (translations.types[key]) {
                    type.innerText = translations.types[key];
                }
            });
            */
        }

        const offensive = document.querySelector('#speciesOffensiveTypeChartContainer');
        if (offensive) {
            offensive.querySelector('.bold').innerText = "공격할 때";
            /*
            offensive.querySelectorAll('.backgroundSmall').forEach(type => {
                const key = lowerText(type.className.split(' ')[1].replace('TYPE_', ''));
                if (translations.types[key]) {
                    type.innerText = translations.types[key];
                }
            });
            */
        }

        const moveTables = document.querySelectorAll('.speciesPanelLearnsetsTableMargin');
        const transTexts = { "Egg Moves": "유전 기술", "Level-Up": "레벨업", "TM/HM": "기술머신/비전머신" };

        moveTables.forEach(table => {
            /*
            let shift = 0;
            const ths = table.querySelectorAll('thead th');
            ths.forEach(th => {
                if (translations.moves_head[th.innerText]) {
                    th.innerText = translations.moves_head[th.innerText];
                } else if (th.innerText === 'Level' || th.innerText === '레벨') {
                    th.innerText = '레벨';
                    shift = 1;
                }
            });
            */

            const caption = table.querySelector('caption.bold');
            const parts = caption.childNodes[0].textContent.split('\n');
            if (parts && transTexts[parts[0]]) {
                caption.childNodes[0].textContent = transTexts[parts[0]] + '\n' + parts[1];
            }
            /*
            table.querySelectorAll('tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                const nameCell = cells[0 + shift];
                if (nameCell) {
                    const effectCell = cells[6 + shift];
                    const move = translations.moves[Object.keys(translations.moves).find(key => translations.moves[key].name === nameCell.innerText)];
                    if (move) {
                        nameCell.innerText = move.name_kr;
                        if (move.Effect_kr) {
                            effectCell.innerHTML = move.Effect_kr.includes(". ") ? move.Effect_kr.replace(". ", ". \n").split("\n").map(part => `<div>${part}</div>`).join("") : splitMiddle(move.Effect_kr, 35).map(part => `<div>${part}</div>`).join("");
                        }
                    }

                    const typeDiv = cells[1 + shift].querySelector('div');
                    if (typeDiv) {
                        const key = lowerText(typeDiv.className.split(' ')[0].replace('TYPE_', ''));
                        if (translations.types[key]) {
                            typeDiv.innerText = translations.types[key];
                        }
                    }
                }
            });
            */
        });
    }
    /*
    function splitMiddle(text, maxLength) {
        if (text.length <= maxLength) return [text];
        const middle = Math.floor(text.length / 2);
        let left = middle, right = middle;
        while (left > 0 && text[left] !== ' ') left--;
        while (right < text.length && text[right] !== ' ') right++;
        const splitIndex = (middle - left <= right - middle) ? left : right;
        return [text.substring(0, splitIndex), text.substring(splitIndex + 1)];
    }
    */
})();