// ==UserScript==
// @name         GGn Link Checker
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  Check and update existing web links, load age ratings (Windows only!).
// @author       tesnonwan
// @grant        GM_xmlhttpRequest
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @downloadURL https://update.greasyfork.org/scripts/523970/GGn%20Link%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/523970/GGn%20Link%20Checker.meta.js
// ==/UserScript==

const webLinks = Array.from(document.querySelectorAll('.weblinksTitle'));
const scoreLinks = webLinks.slice(0, 3);
const siteLinks = webLinks.slice(3);
const parser = new DOMParser();

const AGE_CHECK_ICON = 'https://ptpimg.me/68m391.jpg';
const RED_X_ICON = 'https://ptpimg.me/z3u690.png';
const BLACK_X_ICON = 'https://ptpimg.me/ti8z3w.png';
const LOADING_ICON = 'https://ptpimg.me/ya98m7.png';


const ESRB_E = 'https://www.esrb.org/wp-content/themes/esrb/assets/images/E.svg';
const ESRB_E10 = 'https://www.esrb.org/wp-content/themes/esrb/assets/images/E10plus.svg';
const ESRB_T = 'https://www.esrb.org/wp-content/themes/esrb/assets/images/T.svg';
const ESRB_M = 'https://www.esrb.org/wp-content/themes/esrb/assets/images/M.svg';
const ESRB_AO = 'https://www.esrb.org/wp-content/themes/esrb/assets/images/AO.svg';

function imgForUrl(url, title = '') {
    const img = document.createElement('img');
    img.src = url;
    img.style.marginLeft = img.style.marginRight = '3px';
    img.style.height = '35px';
    img.title = title;
    return img;
}

function allAges() {
    const div = document.createElement('div');
    div.textContent = 'All Ages';
    div.style.height = '20px';
    div.style.width = '55px';
    div.style.fontFamily = '"Motiva Sans", Sans-serif';
    div.style.backgroundColor = 'black';
    div.style.border = '2px solid #67C1F5';
    div.style.fontSize = '13px';
    div.style.fontWeight = 'bold';
    div.style.padding = '10px';
    div.style.textAlign = 'center';
    div.style.lineHeight = '20px';
    div.style.margin = 'auto';
    div.style.color = '#67C1F5';
    return div;
}

function getSteamRating(appId, countryCode) {
    return promiseXhr(`https://store.steampowered.com/app/${appId}/?cc=${countryCode}`, {
        method: 'GET',
        withCredentials: false,
        credentials: 'omit',
        mozAnon: true,
        anonymous: true,
        headers: {
            'Cookie': 'wants_mature_content=1; birthtime=-63140399; lastagecheckage=1-January-1968',
        },
    }).then((r) => {
        const steamDoc = (new DOMParser()).parseFromString(r.response, 'text/html');
        if (steamDoc.querySelector('.age_gate')) {
            return imgForUrl(AGE_CHECK_ICON, 'Age gate: needs to be loaded manually');
        }
        if (steamDoc.querySelector('.game_rating_icon .game_rating_allages')) {
            return allAges();
        }
        const ageRatingIcon = steamDoc.querySelector('.game_rating_icon img');
        if (!ageRatingIcon) {
            return imgForUrl(RED_X_ICON, 'Not found');
        }
        return imgForUrl(ageRatingIcon.src);
    }).catch((err) => {
        console.log(err);
        return imgForUrl(BLACK_X_ICON, 'Error loading page');
    });
}

function getGameFaqsRating(url) {
    return promiseXhr(url, {
        method: 'GET',
    }).then((r) => {
        const gameFaqsDoc = (new DOMParser()).parseFromString(r.response, 'text/html');
        const esrb = gameFaqsDoc.querySelector('.esrb span')?.title;
        if (esrb) {
            if (/adults ages 18 and up/.test(esrb)) {
                return imgForUrl(ESRB_AO);
            } else if (/ages 17 and up/.test(esrb)) {
                return imgForUrl(ESRB_M);
            } else if (/ages 13 and up/.test(esrb)) {
                return imgForUrl(ESRB_T);
            } else if (/ages 10 and up/.test(esrb)) {
                return imgForUrl(ESRB_E10);
            } else if (/suitable for all ages/.test(esrb)) {
                return imgForUrl(ESRB_E);
            }
        }
        return imgForUrl(RED_X_ICON, 'Not found');
    }).catch((err) => {
        console.log(err);
        return imgForUrl(BLACK_X_ICON, 'Error loading page');
    });
}

function findElementWithText(elements, text) {
    for (const element of elements) {
        if (element.childNodes[0].textContent.trim() === text) {
            return element;
        }
    }
    return null;
}

function getMobyGamesRatings(url) {
    return promiseXhr(url, {
        method: 'GET',
    }).then((r) => {
        const mobyGamesDoc = (new DOMParser()).parseFromString(r.response, 'text/html');
        const headings = mobyGamesDoc.querySelectorAll('div h2');
        const ratingsHeader = findElementWithText(headings, 'Ratings');
        if (!ratingsHeader) {
            return imgForUrl(RED_X_ICON, 'Not found');
        }
        const ratingsRows = ratingsHeader.parentElement.querySelectorAll('tr');
        let isWindows = false;
        const ratingsImgs = [];
        for (const ratingsRow of ratingsRows) {
            const rowTitle = ratingsRow.querySelector('h4')?.childNodes?.[0]?.textContent?.trim();
            if (rowTitle) {
                isWindows = rowTitle === 'Windows';
                continue;
            } else if (!isWindows) {
                continue;
            }
            const ratingImg = ratingsRow.querySelector('img');
            if (ratingImg) {
                const ratingText = ratingsRow.textContent;
                ratingsImgs.push(imgForUrl(ratingImg.src, ratingText.slice(0, ratingText.indexOf(':'))));
            }
        }
        if (ratingsImgs.length > 0) {
            const div = document.createElement('div');
            div.style.textAlign = 'center';
            ratingsImgs.forEach((img) => {
                div.appendChild(img);
            });
            return div;
        }
        return imgForUrl(RED_X_ICON, 'Not found');
    }).catch((err) => {
        console.log(err);
        return imgForUrl(BLACK_X_ICON, 'Error loading page');
    });
}

function getPegiRating(title) {
    return new Promise(async (resolve) => {
        let page = 0;
        while (page++ < 20) {
            const nextPage = `https://pegi.info/search-pegi?q=${encodeURIComponent(title)}&form_id=pegi_search_form&page=${page}`;
            const result = await promiseXhr(nextPage, {
                method: 'GET',
            }).then((r) => {
                if (r.finalUrl === 'https://pegi.info/system/404') {
                    return imgForUrl(RED_X_ICON, 'Not found');
                }
                const pegiDoc = (new DOMParser()).parseFromString(r.response, 'text/html');
                const games = pegiDoc.querySelector('.page-content').querySelectorAll('.game-content');
                if (games.length === 0) {
                    return imgForUrl(RED_X_ICON, 'Not found');
                }
                for (const game of games) {
                    const pcIcon = game.querySelector('.icon-pc');
                    const ratingImg = game.querySelector('.game-content__header-rating img');
                    const gameTitle = game.querySelector('.game-content__header-title h3').textContent;
                    if (titlesMatch(title, gameTitle) && pcIcon && ratingImg) {
                        return imgForUrl(ratingImg.src);
                    }
                }
                return null;
            }).catch((err) => {
                console.log(err);
                return imgForUrl(BLACK_X_ICON, 'Error loading page');
            });
            if (result) {
                resolve(result);
                break;
            }
        }
    });
}

function titlesMatch(title1, title2) {
    title1 = title1.replaceAll(/[^A-Za-z0-9]/g, '').toLowerCase();
    title2 = title2.replaceAll(/[^A-Za-z0-9]/g, '').toLowerCase();
    return title1 === title2;
}

function getEsrbRating(title) {
    return new Promise(async (resolve) => {
        let page = 0;
        while (page++ < 20) {
            const nextPage = `https://www.esrb.org/search/?searchKeyword=${encodeURIComponent(title)}&pg=${page}`;
            console.log(`Checking next page: ${nextPage}`);
            const result = await promiseXhr(nextPage, {
                method: 'GET',
            }).then((r) => {
                const esrbDoc = (new DOMParser()).parseFromString(r.response, 'text/html');
                if (esrbDoc.querySelector('#results h4')) {
                    return imgForUrl(RED_X_ICON, 'Not found');
                }
                const games = esrbDoc.querySelectorAll('#results .game');
                for (const game of games) {
                    const platforms = game.querySelector('.platforms').textContent;
                    if (platforms.indexOf('Windows') === -1) {
                        continue;
                    }
                    const gameTitle = game.querySelector('.heading h2').textContent;
                    if (titlesMatch(title, gameTitle)) {
                        return imgForUrl(game.querySelector('.content img').src);
                    }
                }
                return null;
            }).catch((err) => {
                console.log(err);
                return imgForUrl(BLACK_X_ICON, 'Error loading page');
            });
            if (result) {
                resolve(result);
                break;
            }
        }
    });
}

function replaceValue(textBox, newUrl) {
    const revertButton = document.createElement('button');
    revertButton.setAttribute('type', 'button');
    revertButton.appendChild(document.createTextNode('↺'));
    textBox.parentElement.setAttribute('style', '');
    textBox.parentElement.appendChild(revertButton);
    let isNew = true;
    const oldUrl = textBox.value;
    revertButton.onclick = () => {
        if (isNew) {
            isNew = false;
            textBox.value = oldUrl;
            textBox.style.color = 'white';
        } else {
            isNew = true;
            textBox.value = newUrl;
            textBox.style.color = 'limegreen';
        }
    };
    textBox.value = newUrl;
    textBox.style.color = 'limegreen';
}

function makeHttpsIfNeeded(urlText) {
    if (urlText.value.startsWith('http://')) {
        replaceValue(urlText, urlText.value.replace('http://', 'https://'));
    }
}

function addExistingScoreLinks() {
    for (const scoreLink of scoreLinks) {
        const urlSection = scoreLink.nextElementSibling;
        const urlText = urlSection.querySelector('input[type=url]');
        if (!urlText.value) {
            continue;
        }
        const urlLabelNode = urlText.nextSibling;
        const urlLabel = urlLabelNode.nodeValue.trim();
        const link = document.createElement('a');
        link.href = urlText.value;
        link.target = '_blank';
        link.appendChild(document.createTextNode(urlLabel));
        urlLabelNode.replaceWith(link);
        makeHttpsIfNeeded(urlText);
    }
}

function addExistingSiteLinks() {
    let first = true;
    for (const siteLink of siteLinks) {
        siteLink.appendChild(document.createTextNode(' '));
        const urlSection = siteLink.nextElementSibling;
        const urlText = urlSection.querySelector('input[type=url]');
        let link = siteLink;
        const currentUrl = urlText.value;
        if (currentUrl) {
            link = document.createElement('a');
            link.href = currentUrl;
            link.target = '_blank';
            siteLink.appendChild(link);
            if (first) {
                makeHttpsIfNeeded(urlText);
                first = false;
            } else {
                //console.log(`Checking url ${currentUrl}...`);
                processUrl(currentUrl, (resp) => {
                    if (resp.status === 404) {
                        console.log(`Not Found response from ${currentUrl}`);
                        urlText.style.color = 'crimson';
                        return;
                    }
                    //console.log(`Response from ${currentUrl}: ${resp.finalUrl}`);
                    let finalUrl = resp.finalUrl;
                    if (/https:\/\/store[.]steampowered[.]com\/agecheck\//.test(resp.finalUrl)) {
                        console.log(`Hit age check on ${currentUrl}`);
                        makeHttpsIfNeeded(urlText);
                        return;
                    }
                    if (/https:\/\/store[.]steampowered[.]com\/app\/[0-9]+\/$/.test(resp.finalUrl)) {
                        // Steam URL doesn't have game title included.
                        const doc = parser.parseFromString(resp.responseText, 'text/html');
                        const metaUrlElem = doc.querySelector('meta[property="og:url"]');
                        if (metaUrlElem) {
                            finalUrl = metaUrlElem.content;
                        }
                    }
                    if (finalUrl && finalUrl !== currentUrl) {
                        console.log(`Found updated URL (${finalUrl}) from (${currentUrl})`);
                        replaceValue(urlText, finalUrl);
                    }
                });
            }
        }
        link.appendChild(document.createTextNode('[L]'));
    }
}

function addExistingLinks() {
    addExistingScoreLinks();
    addExistingSiteLinks();
}

function addAgeRatingsHeader(table) {
    const tr = document.createElement('tr');
    for (const name of ['Steam EU', 'Steam DE', 'PEGI', 'ESRB', 'GameFAQs', 'MobyGames']) {
        const th = document.createElement('th');
        th.textContent = name;
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

function makePendingImg(row) {
    const td = document.createElement('td');
    row.appendChild(td);
    const pendingImg = imgForUrl(LOADING_ICON, 'Loading...');
    td.appendChild(pendingImg);
    return pendingImg;
}

function insertRatingsButton() {
    const ratingsButton = document.createElement('button');
    ratingsButton.type = 'button';
    ratingsButton.textContent = 'Load Ratings';
    ratingsButton.style.marginLeft = '8px';
    ratingsButton.style.marginRight = '3px';
    const ratingBlurb = document.querySelector('#Rating').nextSibling;
    ratingBlurb.parentElement.insertBefore(ratingsButton, ratingBlurb);
    ratingsButton.onclick = () => {
        ratingsButton.remove();
        addAgeRatings();
    };
}

function addAgeRatings() {
    const ratingsTable = document.createElement('table');
    ratingsTable.style.marginTop = '8px';
    ratingsTable.style.width = '700px';
    ratingsTable.style.textAlign = 'center';
    addAgeRatingsHeader(ratingsTable);
    const ratingsRow = document.createElement('tr');
    ratingsTable.appendChild(ratingsRow);
    const steamFranceImg = makePendingImg(ratingsRow);
    const steamGermanyImg = makePendingImg(ratingsRow);
    const steamUrlInput = document.querySelector('.weblinks[name="steamuri"]');
    if (steamUrlInput && steamUrlInput.value) {
        const appId = /\/app\/([0-9]+)/.exec(steamUrlInput.value)[1];
        getSteamRating(appId, 'fr').then((img) => {
            steamFranceImg.replaceWith(img);
        });
        getSteamRating(appId, 'de').then((img) => {
            steamGermanyImg.replaceWith(img);
        });
    } else {
        steamFranceImg.replaceWith(imgForUrl(RED_X_ICON, 'No Steam URL'));
        steamGermanyImg.replaceWith(imgForUrl(RED_X_ICON, 'No Steam URL'));
    }
    const gameTitle = document.querySelector('#content h2 a').textContent;
    const pegiRatingImg = makePendingImg(ratingsRow);
    getPegiRating(gameTitle).then((img) => {
       pegiRatingImg.replaceWith(img);
    });
    const esrbRatingImg = makePendingImg(ratingsRow);
    getEsrbRating(gameTitle).then((img) => {
        esrbRatingImg.replaceWith(img);
    });
    const gameFaqsImg = makePendingImg(ratingsRow);
    const gameFaqsUrlInput = document.querySelector('.weblinks[name="gamefaqsuri"]');
    if (gameFaqsUrlInput && gameFaqsUrlInput.value) {
        getGameFaqsRating(gameFaqsUrlInput.value).then((img) => {
           gameFaqsImg.replaceWith(img);
        });
    } else {
        gameFaqsImg.replaceWith(imgForUrl(RED_X_ICON, 'No GameFAQs URL'));
    }
    const mobyGamesImg = makePendingImg(ratingsRow);
    const mobyGamesUrlInput = document.querySelector('.weblinks[name="mobygamesuri"]');
    if (mobyGamesUrlInput && mobyGamesUrlInput.value) {
        getMobyGamesRatings(`${mobyGamesUrlInput.value}/specs/`).then((div) => {
           mobyGamesImg.replaceWith(div);
        });
    } else {
        mobyGamesImg.replaceWith(imgForUrl(RED_X_ICON, 'No MobyGames URL'));
    }
    document.querySelector('#Rating').parentElement.appendChild(ratingsTable);
}

function promiseXhr(url, options) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            ...options,
            onabort: (response) => {
                reject(response)
            },
            onerror: (response) => {
                reject(response)
            },
            ontimeout: (response) => {
                reject(response)
            },
            onload: (response) => {
                resolve(response)
            },
        })
    })
}

function processUrl(url, func, options = {}) {
    promiseXhr(url, options)
        .then(res => {
            func(res);
        })
        .catch(e => {
            console.error(`${url} error ${e}`);
       });
}

function run() {
    addExistingLinks();
    insertRatingsButton();
}

run();