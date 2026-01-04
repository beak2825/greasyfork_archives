// ==UserScript==
// @name         Richup.io Türkiye
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  richup io türkiye şehirleri
// @author       malidev
// @license MIT
// @match        *://richup.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525516/Richupio%20T%C3%BCrkiye.user.js
// @updateURL https://update.greasyfork.org/scripts/525516/Richupio%20T%C3%BCrkiye.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cityMap = {
        'Salvador': ['Ağrı', 1],
        'Rio': ['Kars', 1],
        'TLV Airport': ['ASR Havalimanı', 0],
        'Tel Aviv': ['Diyarbakır', 2],
        'Haifa': ['Elazığ', 2],
        'Jerusalem': ['Bingöl', 2],
        'Venice': ['Kahramanmaraş', 3],
        'Electric Company': ['TEDAŞ', 0],
        'Milan': ['Gaziantep', 3],
        'Rome': ['Adana', 3],
        'MUC Airport': ['BJV Havalimanı', 0],
        'Frankfurt': ['Kayseri', 4],
        'Munich': ['Nevşehir', 4],
        'Berlin': ['Niğde', 4],
        'Shenzhen': ['Samsun', 5],
        'Beijing': ['Amasya', 5],
        'Shanghai': ['Çorum', 5],
        'CDG Airport': ['AYT Havalimanı', 0],
        'Lyon': ['Afyonkarahisar', 6],
        'Toulouse': ['Isparta', 6],
        'Water Company': ['Devlet Su İşleri', 0],
        'Paris': ['Burdur', 6],
        'Liverpool': ['Eskişehir', 7],
        'Manchester': ['Ankara', 7],
        'London': ['Kocaeli', 7],
        'JFK Airport': ['SAW Havalimanı', 0],
        'San Francisco': ['Muğla', 8],
        'New York': ['İstanbul', 8]
    };

    const groupStyles = {
        1: { color: '#FF9999' },
        2: { color: '#99FF99' },
        3: { color: '#9999FF' },
        4: { color: '#FFCC99' },
        5: { color: '#99FFFF' },
        6: { color: '#FF99FF' },
        7: { color: '#FFFF99' },
        8: { color: '#CC99FF' }
    };

    let cssText = `
        .VvYIypXy svg,
        .SJ0cNrdg svg,
        .fAEZE2VJ svg path,
        .ssQyjhNI svg path {
            opacity: 0;
        }

        .VvYIypXy,
        .SJ0cNrdg {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png') !important;
            background-size: cover !important;
            background-position: center !important;
            border-radius: 0% !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
        }

        .hinI6XnG {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png') !important;
            background-size: cover !important;
            background-position: center !important;
            border-radius: 50% !important;
        }

        .iayERveg svg {
            opacity: 1 !important;
        }

        .OyShmday {
            display: flex !important;
            align-items: center !important;
            padding: 8px !important;
            position: relative !important;
        }

        .OyShmday .hCYJTD3D {
            width: 24px !important;
            height: 24px !important;
            margin-right: 8px !important;
            flex-shrink: 0 !important;
        }

        .OyShmday .pUgYYRjT {
            flex-grow: 1 !important;
            margin-left: 8px !important;
            text-align: left !important;
            font-size: 0.9rem !important;
        }

        .OyShmday .u1aCIIm0 {
            margin-left: auto !important;
            flex-shrink: 0 !important;
        }

        .ssQyjhNI, .TIBONHMP {
            width: 24px !important;
            height: 24px !important;
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .pUgYYRjT:contains('Kahramanmaraş'),
        .pUgYYRjT:contains('Afyonkarahisar') {
            font-size: 0.8rem !important;
        }

        .fAEZE2VJ svg circle {
            display: none !important;
        }

        .iDUg2R4x, .b1l2Evlb {
            font-size: 0.7rem !important;
            color: white !important;
            text-align: center !important;
        }

        .QVzoR1lQ.richup-block-bottom:has(.iDUg2R4x) div:nth-child(2) div:nth-child(2)::before {
            content: "" !important;
        }

        .fAEZE2VJ svg {
            background: none !important;
        }

        .QVzoR1lQ.richup-block-bottom:has(.iDUg2R4x),
        .QVzoR1lQ.richup-block-bottom:has(.bUkR0mHy) {
            border: none !important;
            background: none !important;
            box-shadow: none !important;
        }

        .NaF9Aau7 {
            color: white !important;
            font-size: 1.5rem !important;
            text-align: center !important;
            width: 100% !important;
            font-weight: bold !important;
            margin: 10px 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        .KE1F4u9I {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin-bottom: 10px !important;
        }

        .fAEZE2VJ, .ssQyjhNI {
            background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png') !important;
            background-size: cover !important;
            background-position: center !important;
            border-radius: 50% !important;
            width: 2em !important;
            height: 2em !important;
        }

        .fAEZE2VJ svg,
        .ssQyjhNI svg {
            display: none !important;
        }

        .SlKw7ZuL .fAEZE2VJ,
        .SlKw7ZuL .ssQyjhNI {
            width: 1.2em !important;
            height: 1.2em !important;
        }

        .fAEZE2VJ, .ssQyjhNI, .hinI6XnG {
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
        }

        .fAEZE2VJ img, .ssQyjhNI img, .hinI6XnG img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 50% !important;
        }

        .SlKw7ZuL .hinI6XnG {
            width: 16px !important;
            height: 16px !important;
        }
    `;

    Object.entries(cityMap).forEach(([originalName, [translatedName, groupId]]) => {
        const style = groupStyles[groupId];
        const isKmaras = translatedName === 'Kahramanmaraş';
        const isAfyon = translatedName === 'Afyonkarahisar';

        cssText += `
        div[data-original-city="${originalName}"] {
            border: ${groupId ? '3px solid ' + style?.color : 'none'} !important;
            border-radius: 8px !important;
            position: relative !important;
        }
        div[data-original-city="${originalName}"] div:nth-child(2) div:nth-child(2)::before {
            content: "${translatedName}" !important;
            font-size: ${isKmaras || isAfyon ? '0.7rem' : '1rem'} !important;
            color: white !important;
        }`;
    });

    GM_addStyle(cssText + `
        [class*="richup-block"] {
            box-sizing: border-box !important;
            margin: 2px !important;
        }
    `);

    function replaceTooltipCityNames() {
        document.querySelectorAll('[class*="richup-block"]').forEach(element => {
            const nameElement = element.querySelector('.bUDiQWoS, .wm46CW8f div');
            if (nameElement) {
                const originalName = nameElement.textContent.trim();
                if (cityMap[originalName]) {
                    nameElement.textContent = cityMap[originalName][0];
                }
            }
        });
    }

    function updateSidebarCities() {
        document.querySelectorAll('.ZIHG1zdl, .Ithf7RKe').forEach(cityItem => {
            if (cityItem.hasAttribute('data-processed')) return;

            const cityNameElement = cityItem.querySelector('.s3qTtFaS, .UbiQKX3n');
            if (!cityNameElement) return;

            const originalCityName = cityNameElement.textContent.trim();

            for (const [originalName, [newName]] of Object.entries(cityMap)) {
                if (originalCityName === originalName) {
                    cityNameElement.textContent = newName;

                    const flagContainer = cityItem.querySelector('.hinI6XnG');
                    if (flagContainer) {
                        flagContainer.innerHTML = `
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png"
                                 style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                        `;
                        flagContainer.style.overflow = 'hidden';
                        flagContainer.style.borderRadius = '50%';
                    }
                    break;
                }
            }

            cityItem.setAttribute('data-processed', 'true');
        });
    }

    function updateTooltipMessages() {
        document.querySelectorAll('[data-tippy-root], .QVzoR1lQ').forEach(element => {
            const titleElement = element.querySelector('.NaF9Aau7, .wm46CW8f div');
            if (titleElement) {
                const originalName = titleElement.textContent.trim();
                if (cityMap[originalName]) {
                    titleElement.textContent = cityMap[originalName][0];
                }
            }

            element.querySelectorAll('.fAEZE2VJ, .ssQyjhNI, .VvYIypXy, .SJ0cNrdg').forEach(flagContainer => {
                if (!flagContainer.hasAttribute('data-flag-processed')) {
                    flagContainer.style.background = `url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png') center/cover !important`;
                    flagContainer.innerHTML = '';
                    flagContainer.setAttribute('data-flag-processed', 'true');
                }
            });
        });
    }

    function replaceCityFlagInLogs() {
        document.querySelectorAll('.SlKw7ZuL .UAp_LTxZ').forEach(container => {
            if (container.hasAttribute('data-flag-processed')) return;

            if (container.innerHTML.includes('character_svg__a') ||
                container.querySelector('.iayERveg') ||
                container.classList.contains('rVwGU6l7')) {
                container.setAttribute('data-flag-processed', 'true');
                return;
            }

            const flagSpan = container.querySelector('.hinI6XnG');
            if (flagSpan && !flagSpan.hasAttribute('data-flag-processed')) {
                flagSpan.innerHTML = `
                    <div style="width: 16px; height: 16px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png"
                             style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `;
                flagSpan.setAttribute('data-flag-processed', 'true');
            }

            container.setAttribute('data-flag-processed', 'true');
        });

        const logContainer = document.querySelector('.SlKw7ZuL');
        if (logContainer && !logContainer.hasAttribute('data-observer-attached')) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const newContainer = node.querySelector('.UAp_LTxZ');
                            if (newContainer && !newContainer.hasAttribute('data-flag-processed')) {
                                const flagSpan = newContainer.querySelector('.hinI6XnG');
                                if (flagSpan && !flagSpan.hasAttribute('data-flag-processed')) {
                                    flagSpan.innerHTML = `
                                        <div style="width: 16px; height: 16px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png"
                                                 style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    `;
                                    flagSpan.setAttribute('data-flag-processed', 'true');
                                }
                                newContainer.setAttribute('data-flag-processed', 'true');
                            }
                        }
                    });
                });
            });

            observer.observe(logContainer, { childList: true, subtree: true });
            logContainer.setAttribute('data-observer-attached', 'true');
        }
    }

    function updateTradeScreenCities() {
        document.querySelectorAll('.OyShmday').forEach(cityButton => {
            const cityNameElement = cityButton.querySelector('.pUgYYRjT');
            if (!cityNameElement || cityButton.hasAttribute('data-processed')) return;

            const originalName = cityNameElement.textContent.trim();
            if (cityMap[originalName]) {
                cityNameElement.textContent = cityMap[originalName][0];

                const flagContainer = cityButton.querySelector('.ssQyjhNI');
                if (flagContainer) {
                    flagContainer.innerHTML = `
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png"
                             style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                    `;
                }
            }

            cityButton.setAttribute('data-processed', 'true');
        });
    }

    function updateAuctionCities() {
        document.querySelectorAll('.H8gQYnXc').forEach(auctionItem => {
            if (auctionItem.hasAttribute('data-processed')) return;

            const cityNameElement = auctionItem.querySelector('.UbiQKX3n');
            if (cityNameElement) {
                const originalName = cityNameElement.textContent.trim();
                if (cityMap[originalName]) {
                    cityNameElement.textContent = cityMap[originalName][0];
                }
            }

            const tooltipTitle = auctionItem.querySelector('.NaF9Aau7');
            if (tooltipTitle) {
                const originalName = tooltipTitle.textContent.trim();
                if (cityMap[originalName]) {
                    tooltipTitle.textContent = cityMap[originalName][0];
                }
            }

            auctionItem.querySelectorAll('.TIBONHMP').forEach(flagContainer => {
                if (!flagContainer.hasAttribute('data-flag-processed')) {
                    flagContainer.innerHTML = `
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1280px-Flag_of_Turkey.svg.png"
                             style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                    `;
                    flagContainer.setAttribute('data-flag-processed', 'true');
                }
            });

            auctionItem.setAttribute('data-processed', 'true');
        });
    }

    function initializeGame() {
        replaceTooltipCityNames();
        updateSidebarCities();
        updateTooltipMessages();
        replaceCityFlagInLogs();
        updateTradeScreenCities();
        updateAuctionCities();

        setInterval(() => {
            replaceTooltipCityNames();
            updateSidebarCities();
            updateTooltipMessages();
            updateTradeScreenCities();
            updateAuctionCities();
        }, 100);
    }

    window.addEventListener('load', () => {
        initializeGame();

        const gameLoadCheck = setInterval(() => {
            if (document.querySelector('.MPNOHR76')) {
                initializeGame();
                clearInterval(gameLoadCheck);
            }
        }, 500);
    });
})();
