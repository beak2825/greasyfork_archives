// ==UserScript==
// @name         Автоап + автозакреп объявлений на маркете
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Остальные полезные скрипты - https://zelenka.guru/threads/5310268/
// @author       Jack
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/512805/%D0%90%D0%B2%D1%82%D0%BE%D0%B0%D0%BF%20%2B%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D0%B5%D0%BF%20%D0%BE%D0%B1%D1%8A%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BD%D0%B0%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/512805/%D0%90%D0%B2%D1%82%D0%BE%D0%B0%D0%BF%20%2B%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D0%B5%D0%BF%20%D0%BE%D0%B1%D1%8A%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BD%D0%B0%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B5.meta.js
// ==/UserScript==

const time = 6; // Время в часах между поднятием объявлений, согласно вашим правам
const limit = 8; // Максимальное число объявлений, согласно вашим правам
const sticky = 3; // Максимальное число объявлений которые можно закрепить, согласно вашим правам
const method = 1; // Выберите метод, по которому будут подниматься товары. 1 - Дешевые, 2 - Дорогие, 3 - Старые (по заливу)
const methodS = 2; // Тоже самое, только для закрепа

const _xfToken = document.querySelector('input[name="_xfToken"]').value;

function getUrlByMethod(method) {
    switch(method) {
        case 1:
            return 'https://lzt.market/user/items?category_id=0&show=active&order_by=price_to_up';
        case 2:
            return 'https://lzt.market/user/items?category_id=0&show=active&order_by=price_to_down';
        case 3:
            return 'https://lzt.market/user/items?category_id=0&show=active&order_by=pdate_to_up_upload';
    }
}

async function getData(url = '') {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, image/avif, image/webp, image/apng, */*;q=0.8, application/signed-exchange;v=b3;q=0.7',
                'Accept-Charset': 'UTF-8',
            },
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response.responseText);
                } else {
                    reject(new Error(`HTTP error ${response.status}`));
                }
            },
            onerror: function (error) {
                reject(new Error(`Network error: ${error}`));
            },
        });
    });
}

async function bumpAd(id) {
    const url = `https://lzt.market/${id}/bump?&_xfRequestUri=%2F${id}%2F&_xfNoRedirect=1&_xfToken=${_xfToken}&_xfResponseType=json`;
    try {
        await getData(url);
        XenForo.alert('Объявление поднято', '', 5000);
    } catch (error) {
        console.error(`Ошибка при попытке поднять объявление ${id}: `, error);
    }
}

async function stickAd(id) {
    const url = `https://lzt.market/${id}/stick-unstick?&_xfRequestUri=%2F${id}%2F&_xfNoRedirect=1&_xfToken=${_xfToken}&_xfResponseType=json`;
    try {
        await getData(url);
        XenForo.alert('Объявление закреплено', '', 5000);
    } catch (error) {
        console.error(`Ошибка при попытке закрепить объявление ${id}: `, error);
    }
}

function shouldBump(id) {
    const bumpData = GM_getValue("bumpData", {});
    const lastUp = bumpData[id]?.lastUp || 0;
    if (lastUp === 0) {
        return true;
    }
    const elapsedTime = (Date.now() - lastUp) / 1000 / 60 / 60;
    return elapsedTime >= (6 + (1 / 60));
}

function shouldStick(id) {
    const stickyData = GM_getValue("stickyData", {});
    const currentStickedCount = Object.values(stickyData).filter(item => item.sticky === "yes").length;
    return stickyData[id]?.sticky !== "yes" && currentStickedCount < sticky;
}

async function BumpGoods(ids) {
    for (const id of ids) {
        if (shouldBump(id)) {
            await bumpAd(id);
            const bumpData = GM_getValue("bumpData", {});
            bumpData[id].lastUp = Date.now();
            GM_setValue("bumpData", bumpData);
        }
    }
}

async function StickGoods(ids) {
    for (const id of ids) {
        if (shouldStick(id)) {
            await stickAd(id);
            const stickyData = GM_getValue("stickyData", {});
            stickyData[id].sticky = "yes";
            GM_setValue("stickyData", stickyData);
        }
    }
}

function getTimeLeft(id) {
    const bumpData = GM_getValue("bumpData", {});
    const lastUpTime = bumpData[id] ? bumpData[id].lastUp : 0;
    const elapsedTime = (Date.now() - lastUpTime) / 1000 / 60 / 60;
    const timeLeft = (time + (1 / 60)) - elapsedTime;
    return timeLeft;
}

async function getInfoB(method, limit) {
    const parser = new DOMParser();
    let bumpData = GM_getValue("bumpData", {});
    let idsForBump = Object.keys(bumpData);

    for (let id of idsForBump) {
        const timeLeft = getTimeLeft(id);

        if (timeLeft <= 0) {
            const htmlAccountData = await getData(`https://lzt.market/${id}/`);
            const docAccount = parser.parseFromString(htmlAccountData, 'text/html');
            const statusElement = docAccount.querySelector('.marketIndexItem--helpfulIcons span');

            if (statusElement) {
                const accountStatus = statusElement.getAttribute('title');

                if (['Аккаунт продан', 'Объявление закрыто и не показывается в поиске другим пользователям.', 'Удалено'].includes(accountStatus)) {
                    delete bumpData[id];
                    console.log(`Аккаунт ${id} был продан, удален или закрыт. Он был удален из очереди.`);
                } else {
                    bumpData[id].lastUp = Date.now();
                    console.log(`Обновлено время последнего поднятия для аккаунта ${id}`);
                }
            }
        }
    }

    if (Object.keys(bumpData).length < limit) {
        const urlMethod = getUrlByMethod(method);
        const htmlDataMethod = await getData(urlMethod);
        const docMethod = parser.parseFromString(htmlDataMethod, 'text/html');
        const itemsMethod = Array.from(docMethod.querySelectorAll('.marketIndexItem'));

        for (let item of itemsMethod) {
            const id = item.id.replace('marketItem--', '');
            if (!bumpData[id]) {
                bumpData[id] = { lastUp: Date.now(), method: 'A' };
                console.log(`Добавлен новый аккаунт ${id}`);
                if (Object.keys(bumpData).length >= limit) break;
            }
        }
    }

    idsForBump = Object.keys(bumpData).sort((a, b) => bumpData[a].lastUp - bumpData[b].lastUp);

    for (let id of idsForBump) {
        const timeLeft = getTimeLeft(id);

        if (timeLeft <= 0) {
            console.log(`Следующее поднятие аккаунта ${id} через ${Math.abs(timeLeft).toFixed(2)} ч.`);
            BumpGoods([id]);
            bumpData[id].lastUp = Date.now();
            console.log(`Аккаунт ${id} поднят.`);
        } else {
            console.log(`Следующее поднятие аккаунта ${id} через ${timeLeft.toFixed(2)} ч.`);
        }
    }

    GM_setValue("bumpData", bumpData);
}

async function getInfoS(methodS, sticky) {
    const stickyData = GM_getValue("stickyData", {});
    const currentTime = new Date().getTime();
    const lastCheckTime = stickyData.lastCheckTime || 0;

    if (currentTime - lastCheckTime > 30 * 60 * 1000) {
        const htmlDataStickied = await getData("https://lzt.market/user/items?category_id=0&show=stickied");

        const parser = new DOMParser();
        const docStickied = parser.parseFromString(htmlDataStickied, 'text/html');
        const itemsStickied = Array.from(docStickied.querySelectorAll('.marketIndexItem'));

        stickyData.lastCheckTime = currentTime;

        const newStickyItems = {};

        itemsStickied.forEach(item => {
            const id = item.id.replace('marketItem--', '');
            newStickyItems[id] = { lastUp: 0, sticky: "yes" };
        });

        for (let id in stickyData) {
            if (id !== 'lastCheckTime' && !newStickyItems.hasOwnProperty(id)) {
                delete stickyData[id];
            }
        }

        Object.assign(stickyData, newStickyItems);

        GM_setValue("stickyData", stickyData);
    }

    const urlMethodS = getUrlByMethod(methodS);

    if (Object.values(stickyData).filter(item => item.sticky === "yes").length < sticky) {
        const htmlDataMethodS = await getData(urlMethodS);

        const parser = new DOMParser();
        const docMethodS = parser.parseFromString(htmlDataMethodS, 'text/html');
        const itemsMethodS = Array.from(docMethodS.querySelectorAll('.marketIndexItem'));

        let idsForStick = itemsMethodS.slice(0, sticky).map(item => item.id.replace('marketItem--', ''));

        await Promise.all(idsForStick.map(async id => {
            if (id !== 'lastCheckTime' && shouldStick(id)) {
                await stickAd(id, stickyData);
                stickyData[id] = { lastUp: 0, sticky: "yes" };
            }
        }));

        GM_setValue("stickyData", stickyData);
    }

    let idsForStick = Object.keys(stickyData).filter(id => id !== 'lastCheckTime' && stickyData[id].sticky !== "yes").slice(0, sticky);
    StickGoods(idsForStick);
}

function addButtonAfterTagButton() {
    setTimeout(function() {
        let tagButton = document.querySelector('.itemTags');
        if (!tagButton) return;

        let loginDataText = document.querySelector('.market--titleBar.market--spec--titleBar')?.innerText;
        if (!loginDataText || !loginDataText.includes('Показать арбитрам данные для входа')) return;

        let newButton = document.createElement('a');
        let icon = document.createElement('i');

        newButton.setAttribute('class', 'button buttonWithIcon');
        newButton.style.display = 'inline-flex';
        newButton.style.alignItems = 'center';
        newButton.style.justifyContent = 'center';
        newButton.style.width = '39px';
        newButton.style.marginLeft = '10px';

        icon.setAttribute('class', 'far fa-arrow-to-top');
        newButton.appendChild(icon);

        newButton.addEventListener('click', function () {
            const id = document.querySelector(".Editable").dataset.saveUrl.split('/')[0];
            addIdToBumpData(id);
        });

        tagButton.parentNode.insertBefore(newButton, tagButton.nextSibling);
    }, 200);
}

function addIdToBumpData(id) {
    const bumpData = GM_getValue("bumpData", {});
    const idsForBump = Object.keys(bumpData);
    if (idsForBump.includes(id)) {
        XenForo.alert('Объявление уже есть в списке.', '', 5000);
        return;
    }
    const manualIds = idsForBump.filter(id => bumpData[id].method === 'M');
    if (manualIds.length >= 8) {
        XenForo.alert('Нет свободных слотов. Максимальное число объявлений, добавляемых вручную - 8', '', 5000);
        return;
    }
    bumpData[id] = { lastUp: 0, method: 'M' };
    GM_setValue("bumpData", bumpData);
    XenForo.alert('Объявление было добавлено в список.', '', 5000);
}

window.addEventListener('load', addButtonAfterTagButton, false);

function init() {
    getInfoB(method, limit);
    setInterval(() => getInfoB(method, limit), time * 60 * 60 * 1000);

    getInfoS(methodS, sticky);
    setInterval(() => getInfoS(methodS, sticky), time * 60 * 60 * 1000);
}

init();