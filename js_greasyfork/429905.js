// ==UserScript==
// @name         Drive2 Auto Helper
// @namespace    drive2.com
// @version      0.93
// @description  работает на стренице подписок на сашины. проврка на бывшие авто и взаимные подписки, автоматически отписывается от бывших авто и от машин чьи владельцы не во взаимной подписке.
// @author       drive2 lover
// @match        https://www.drive2.com/*
// @match        https://www.drive2.ru/*
// @license MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/429905/Drive2%20Auto%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/429905/Drive2%20Auto%20Helper.meta.js
// ==/UserScript==
let tail = '';
let fctx = '';

const MY_CARS_KEY = '__my_cached_cars__';

function getCarsKeyWithDate() {
    return MY_CARS_KEY + fctx;
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key); // чистим мусор
            return null;
        }
        return item.value;
    } catch {
        localStorage.removeItem(key); // вдруг поломалось
        return null;
    }
}

let myCars = getWithExpiry(getCarsKeyWithDate()) || [];

const localStorageKey = 'saveLastPage';

let stats = {
    pages: 0,
    totalBlocks: 0,
    processedBlocks: 0,
    removedBlocks: 0,
    unsubscribedBlocks: 0,
    oldSubscribedBlocks: 0
};

// Создаем блок статистики
const statsDiv = document.createElement('div');
statsDiv.style.position = 'fixed';
statsDiv.style.top = '0';
statsDiv.style.left = '0';
statsDiv.style.backgroundColor = '#333';
statsDiv.style.color = '#fff';
statsDiv.style.padding = '15px';
statsDiv.style.margin = '10px';
statsDiv.style.zIndex = '1000';

// Блок "Отписываться от авто"
const unsubscribeCheckboxDiv = document.createElement('div');
const unsubscribeCheckbox = document.createElement('input');
unsubscribeCheckbox.type = 'checkbox';
unsubscribeCheckbox.checked = true;
unsubscribeCheckbox.id = 'unsubscribe-checkbox';
const unsubscribeLabel = document.createElement('label');
unsubscribeLabel.textContent = ' Отписываться от авто';
unsubscribeLabel.style.marginRight = '10px';
unsubscribeLabel.setAttribute('for', 'unsubscribe-checkbox');
unsubscribeCheckboxDiv.appendChild(unsubscribeCheckbox);
unsubscribeCheckboxDiv.appendChild(unsubscribeLabel);
// statsDiv.appendChild(unsubscribeCheckboxDiv);

// Блок "Скрывать старые авто"
const hideOldCarsCheckboxDiv = document.createElement('div');
const hideOldCarsCheckbox = document.createElement('input');
hideOldCarsCheckbox.type = 'checkbox';
hideOldCarsCheckbox.checked = true;
hideOldCarsCheckbox.id = 'hide-old-cars-checkbox';
const hideOldCarsLabel = document.createElement('label');
hideOldCarsLabel.textContent = ' Скрывать старые авто';
hideOldCarsLabel.style.marginRight = '10px';
hideOldCarsLabel.setAttribute('for', 'hide-old-cars-checkbox');
hideOldCarsCheckboxDiv.appendChild(hideOldCarsCheckbox);
hideOldCarsCheckboxDiv.appendChild(hideOldCarsLabel);
// statsDiv.appendChild(hideOldCarsCheckboxDiv);

// Кнопка "Проверить"
const checkButton = document.createElement('button');
checkButton.innerText = 'Проверить';
checkButton.style.marginTop = '10px';
checkButton.style.padding = '5px 10px';
checkButton.style.backgroundColor = '#007bff';
checkButton.style.color = '#fff';
checkButton.style.border = 'none';
checkButton.style.borderRadius = '5px';
checkButton.style.cursor = 'pointer';
// statsDiv.appendChild(checkButton);

// Блок для ввода страниц и кнопки "Пропустить страниц"
const skipPagesDiv = document.createElement('div');
skipPagesDiv.style.marginTop = '10px';

// Поле ввода количества страниц
const pagesInput = document.createElement('input');
pagesInput.type = 'number';
pagesInput.min = '1';
pagesInput.value = localStorage.getItem(localStorageKey) ?? 1;
pagesInput.style.width = '50px';
pagesInput.style.marginRight = '10px';

// Кнопка "Пропустить страниц"
const skipButton = document.createElement('button');
skipButton.innerText = 'Пропустить страниц';
skipButton.style.padding = '5px 10px';
skipButton.style.backgroundColor = '#dc3545';
skipButton.style.color = '#fff';
skipButton.style.border = 'none';
skipButton.style.borderRadius = '5px';
skipButton.style.cursor = 'pointer';

// Добавляем инпут и кнопку в блок
skipPagesDiv.appendChild(pagesInput);
skipPagesDiv.appendChild(skipButton);
//statsDiv.appendChild(skipPagesDiv);

const unsubscribeLimitDiv = document.createElement('div');
const limitInput = document.createElement('input');
limitInput.type = 'number';
limitInput.min = '0';
limitInput.value = 25;
limitInput.id = 'limitInput';
limitInput.style.width = '50px';
limitInput.style.marginRight = '10px';
unsubscribeLimitDiv.appendChild(limitInput);
const limitLabel = document.createElement('label');
limitLabel.textContent = ' Лимит отписок от авто';
limitLabel.style.marginRight = '10px';
limitLabel.setAttribute('for', 'limitInput');
unsubscribeLimitDiv.appendChild(limitLabel);

const carBlock = document.querySelector('.l-container .u-link-area');
const carBlockClass = carBlock?.parentElement?.classList?.[0] ?? null;
const carsBlockClass = carBlock?.parentElement?.parentElement?.className ?? null;
const carsBlockClassFormatted = carsBlockClass?.split(' ').map(className => '.' + className).join('') ?? '';

console.log('carBlockClass ' + carBlockClass);
console.log('carsBlockClassFormatted ' + carsBlockClassFormatted);

async function init_me() {
    if (window.d2Env) {
        tail = window.d2Env.userId;
        fctx = window.d2Env.formContext['.FCTX'];
    } else {
        alert('обновите версию скрипта!');
        return;
    }
}

// Функция для нажатия кнопки загрузки страниц и очистки элементов
async function skipPages() {
    let pagesToSkip = parseInt(pagesInput.value, 10);
    if (isNaN(pagesToSkip) || pagesToSkip <= 0) {
        alert('Введите корректное число страниц');
        return;
    }

    for (let i = 0; i < pagesToSkip; i++) {
        const loadMoreButton = document.querySelector('button.x-box-more');
        if (loadMoreButton) {
            await clearGrid();
            loadMoreButton.click();
            console.log(`Нажатие ${i + 1} на кнопку "Показать ещё"`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 секунды
            stats.pages++;
            updateStats();
            await clearEmptyBlocks();
        } else {
            alert('Кнопка "Показать ещё" не найдена, остановка.');
            break;
        }
    }
}

// Функция очистки блока .o-grid.o-grid--2.o-grid--equal
async function clearGrid() {
    const grids = document.querySelectorAll(carsBlockClassFormatted);
    if (grids.length > 0) {
        let blocks;
        for (const grid of grids) {
            blocks = grid.querySelectorAll('.' + carBlockClass);
            if (blocks.length) {
                stats.processedBlocks += blocks.length;
                blocks.forEach(car => car.remove());
            }
        }
        console.log('Удалены авто из пропущенных страниц.');
    } else {
        console.log('Не найдено блоков для очистки.');
    }
}

skipButton.addEventListener('click', skipPages);

const updateStats = () => {
    statsDiv.innerHTML = `<div>
        Страниц пройдено: ${stats.pages}<br>
        Иконок авто в очереди: ${stats.totalBlocks}<br>
        Обработано: ${stats.processedBlocks}<br>
        Отписались автоматом: ${stats.unsubscribedBlocks}<br>
        Подписан на старые авто: ${stats.oldSubscribedBlocks}
    </div>`;
    statsDiv.appendChild(unsubscribeCheckboxDiv);
    statsDiv.appendChild(hideOldCarsCheckboxDiv);
    statsDiv.appendChild(unsubscribeLimitDiv);
    statsDiv.appendChild(checkButton);
    statsDiv.appendChild(skipPagesDiv);
    localStorage.setItem(localStorageKey, stats.pages);
};

// Функция для поиска и клика по кнопке "Загрузить еще"
const clickMoreButton = async () => {
    const button = document.querySelector('button.x-box-more');

    if (document.querySelector('#limitInput').value < 1) {
        alert('Лимит отписок закончился. Во избежание блокировки аккаунта продолжайте завтра.');
        return true;
    }

    if (button) {
        console.error('Нашли кнопку дальнейшей загрузки');

        stats.pages++;
        console.log('Загружаем страницу ' + stats.pages);
        button.click();

        updateStats();
        await clearEmptyBlocks();
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Загрузили блоки с авто, приступаем к их обработке');
        processBlocks();
    } else {
        alert('Кнопка не найдена, остановка процесса');
    }
};

async function clearEmptyBlocks()
{
    document.querySelectorAll(carsBlockClassFormatted).forEach(grid => {if (!grid.querySelector('div')) { grid.remove(); }});
}

function setWithExpiry(key, value, ttlMs) {
    const item = {
        value,
        expiry: Date.now() + ttlMs,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

async function loadMyCars() {
    if (!myCars || myCars.length === 0) {
        const response = await fetch('/my/r/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const cars = [];
        doc.querySelectorAll('.c-car-draglist__item .c-car-card__caption a').forEach(car => {
            if (!car.classList.contains('x-secondary-color')) {
                const id = car.href.match(/\/(\d+)\//)[1];
                cars.push({
                    id,
                    name: car.textContent.trim()
                });
            }
        });

        setWithExpiry(getCarsKeyWithDate(), cars, 24 * 60 * 60 * 1000);
        myCars = cars;

        console.log('обновил кеш моих авто');
    }
    console.log('кеш моих авто', myCars?.map(car => car.name)?.join(', ') ?? '');
}

function addCloseButton(element) {
    if (!element) return;
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // Символ "×" (крестик)
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.style.borderRadius = '50%';
    closeButton.addEventListener('click', function () {
        this.parentNode.remove(); // Удаляет родительский элемент кнопки
    });
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    element.appendChild(closeButton);

    element.classList.remove(carBlockClass);
    element.querySelector('a.u-link-area').remove();
    element.style.position = 'sticky';
}

const unsubscribeCar = async (id) => {
    const url = '/ajax/subscription';
    const data = {
        _: 'unsubscribe',
        type: 'car',
        id: id,
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Ответ unsubscribeCar:', result);
            return result;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

const followUser = async (id) => {
    const url = '/ajax/subscription';
    const data = {
        _: 'subscribe',
        type: 'user',
        id: id.replace('p/',''),
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Ответ subscribeCar:', result);
            return result;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

const unfollowUser = async (id) => {
    const url = '/ajax/subscription';
    const data = {
        _: 'unsubscribe',
        type: 'user',
        id: id,
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            return result?.success;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};


const shareCar = async (token, comment) => {
    const url = '/_api/share';
    const data = {
        token: token,
        comment: comment,
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            return result?.success;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

const likesSend = async (token) => {
    const url = '/_api/likes';
    const data = {
        token: token,
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            console.log('like');
            return result;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

const subscribeCar = async (id) => {
    const url = '/ajax/subscription';
    const data = {
        _: 'subscribe',
        type: 'car',
        id: id,
        '.FCTX': fctx
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data).toString()
        });

        if (response.ok) {
            const result = await response.json();
            console.log('subscribeCar');
            return result;
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    } catch (error) {
        console.error('Ошибка выполнения POST-запроса:', error);
    }
};

async function loadUser(userId) {
    const response = await fetch(`/_api/hovercards/${userId}?tail=${tail}`);
    return await response.json();
}

function isUserSubscribedOnMyCars(data) {
    const followedCarIds = data?.subscriptions?.followedCars?.map(car => {
        const match = car.url.match(/\/(\d+)\//);
        return match ? match[1] : null;
    }).filter(Boolean);
    const myCarIds = myCars ? myCars.map(car => car.id) : [];
    if (myCarIds.length == 0) {
        console.error('У текущего юзера не найдены авто');
        return false;
    }
    if (followedCarIds ? followedCarIds.some(carId => myCarIds.includes(carId)) : false) {
        return myCars
            .filter(car => followedCarIds.includes(car.id))
            .map(car => car.name)
            .join(', ');
    }
    return false;
}

const processBlocks = async () => {
    const blocks = document.querySelectorAll('.' + carBlockClass);
    console.error('На странице найдено ' + blocks.length + ' авто');
    updateStats();
    let myCarNames = '';

    for (const block of blocks) {

        if (document.querySelector('#limitInput').value < 1) {
            alert('Лимит отписок закончился. Во избежание блокировки аккаунта продолжайте завтра.');
            return true;
        }

        const titleElement = block.querySelector('.c-car-title');
        stats.totalBlocks = document.querySelectorAll('.' + carBlockClass).length;

        // Если чекбокс скрытия старых авто включен и блок старый – пропускаем или удаляем
        if (titleElement.classList.contains('x-secondary-color')) {
            stats.oldSubscribedBlocks++;
            stats.processedBlocks++;
            if (hideOldCarsCheckbox.checked) {
                block.remove();
                stats.removedBlocks++;
                console.error('Старое авто, удаляем');
            } else {
                console.error('Старое авто, оставляем на странице');
                addCloseButton(block);
            }
            updateStats();
            continue;
        }

        const subscribeButton = block.querySelector('subscribe-button');
        const userId = block.querySelector('a.c-username')?.getAttribute('data-ihc-token');

        if (!userId) {
            console.error('Не найден userId, пропускаем');
            continue
        };

        const data = await loadUser(userId);
        const myCarNames = isUserSubscribedOnMyCars(data);
        if (myCarNames) {
            console.log(`Юзер номер ${userId} подписан на (${myCarNames}), пропускаем.`);
        } else {
            let uid = subscribeButton.getAttribute('uid');
            console.log('Юзер номер ' + userId + ' не подписан на мои авто.');
            if (unsubscribeCheckbox.checked) {
                unsubscribeCar(uid);
                stats.unsubscribedBlocks++;
                document.querySelector('#limitInput').value = document.querySelector('#limitInput').value - 1;
                console.error('Отписываемся от авто с номером ' + uid);
            }
        }

        // Удаляем блок, если он не содержит мою машину
        block.remove();
        stats.removedBlocks++;
        stats.processedBlocks++;
        updateStats();

        // Ждём 1 секунду перед обработкой следующего блока
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.error('Обработали все авто');

    clickMoreButton();
};

function isCarsFollowingPage()
{
    return (/^\/users\/(.*)\/carsfollowing/).test(window.location.pathname);
}

function isSomeCarFollowingPage()
{
    return (/^\/r\/(.*)\/followers/).test(window.location.pathname);
}

function addSubscribeButton() {
    const counterElement = document.querySelector('.x-title-header .x-title .c-counter');
    if (counterElement) {
        const button = document.createElement('button');
        button.textContent = 'Подписаться на эти авто';
        button.classList.add('c-button');
        button.classList.add('c-button--primary');
        button.style.marginLeft = '10px';
        button.addEventListener('click', function () {
            scrapeUsers();
        });
        counterElement.after(button);
    }
}

async function scrapeUsers() {
    let users = new Set();
    let usersDone = 0;
    let pagesProcessed = 0;
    let subscribeToCar = 0;
    let lostUsers = 0;
    let lostSubscribe = 0;
    let repostCar = 0;

    let infoBox = document.createElement('div');
    infoBox.style.position = 'fixed';
    infoBox.style.top = '10px';
    infoBox.style.right = '10px';
    infoBox.style.background = 'rgb(51, 51, 51)';
    infoBox.style.color = 'white';
    infoBox.style.padding = '10px';
    infoBox.style.borderRadius = '5px';
    infoBox.style.zIndex = '1000';
    document.body.appendChild(infoBox);

    function updateInfoBox() {
        let progress = users.size > 0 ? Math.round((usersDone / users.size) * 100) : 0;
        infoBox.innerHTML = `Страниц обработано: ${pagesProcessed}
        <br> Пользователей собрано: ${users.size}
        <br> Пользователей обработано: ${usersDone}
        <br> Пользователей пропущено: ${lostUsers}<br> (посещали сайт > чем месяц назад или нет актуальных авто)
        <br> Подписано на авто: ${subscribeToCar}<br> (даже если уже был на авто подписан)
        <br> Не удалось подписаться: ${lostSubscribe}
        <br> Репост: ${repostCar}
        <br>
        <div style='width: 100%; background: #555; height: 10px; border-radius: 5px; margin-top: 5px;'>
            <div style='width: ${progress}%; background: #4caf50; height: 10px; border-radius: 5px;'></div>
        </div>`;
    }

    async function likeCar(carUrl, fullCaption, myCarNames) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            let response = await fetch(carUrl);
            let html = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let likeButton = doc.querySelector('like-button');
            let likeButtonActive = likeButton?.hasAttribute('active') ?? false;
            let likeButtonDisabled = likeButton?.hasAttribute('disabled') ?? false;
            if (likeButton) {
                let key = likeButton.getAttribute('key');
                if (key && !likeButtonActive && !likeButtonDisabled) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    likesSend(key);
                }
            }

            let repostButton = doc.querySelector('repost-button');
            let repostButtonDisabled = repostButton?.hasAttribute('disabled');
            if (myCarNames && repostButton && !repostButtonDisabled && repostButton.hasAttribute('token')) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                let result = await shareCar(repostButton.getAttribute('token'), 'Подписывайтесь на ' + fixString(fullCaption));
                if (result) {
                    repostCar++;
                }
            }

            let subscribeButton = doc.querySelector('subscribe-button');
            let subscribeButtonSubscribed = subscribeButton?.hasAttribute('subscribed') ?? false;

            // если авто уже было когда-то подписано
            // был сделан лайк и репост
            // но по какой-то причине отписались
            // то подписываться повторно наверное и не нужно
            if (subscribeButton && !subscribeButtonSubscribed && repostButtonDisabled && likeButtonActive) {
                console.error(`Авто уже имеет лайк и репост но мы не подписаны, видимо есть причина, пропускам его`);
                lostSubscribe++;
                return;
            }

            if (subscribeButton && !subscribeButtonSubscribed && subscribeButton.hasAttribute('uid')) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                let result = await subscribeCar(subscribeButton.getAttribute('uid'));
                if (result?.types.length) {
                    subscribeToCar++;
                } else {
                    lostSubscribe++;
                }
            }


        } catch (error) {
            console.error(`Ошибка загрузки страницы авто ${carUrl}:`, error);
        }
        return null;
    }

    function fixString(str) {
        let symbolsToReplace = ['🇷🇺', '☭'];
        return symbolsToReplace.reduce((acc, symbol) => acc.replaceAll(symbol, '🇺🇦'), str);
    }

    async function processUsers(userList) {
        for (let userId of userList) {
            try {
                usersDone++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                const data = await loadUser(userId);
                if (data?.lastVisit && shouldSkipUser(data.lastVisit)) {
                    console.log(`Пропускаем пользователя ${data.nickname} (${userId}) из-за даты последнего визита: ${data.lastVisit}`);
                    lostUsers++;
                    continue;
                }
                const myCarNames = isUserSubscribedOnMyCars(data);
                if (data?.cars) {
                    let i = 0;
                    for (let car of data.cars) {
                        i++;
                        if (car.belongState === "My" && i <= myCars.length) {
                            let carId = parseCarId(car.url);
                            if (carId) {
                                console.log(`Проверяем авто: ${car.fullCaption} ${car.url}`);
                                updateInfoBox();
                            }
                            await likeCar(car.url, car.fullCaption, myCarNames);
                        }
                    }
                } else {
                    lostUsers++;
                    console.log('Не найдено авто у ' + userId);
                }
                if (data?.isFollowable) {
                    if (data?.isFollowed === false && data?.subscriptions?.followsMe === true) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        followUser(userId);
                    }
                    if (data?.isFollowed === true && data?.subscriptions?.followsMe === false) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        unfollowUser(userId);
                    }
                }
            } catch (error) {
                console.error(`Ошибка загрузки данных пользователя ${userId}:`, error);
            }
        }
        console.log('Обработка всех пользователей завершена.');
        alert('Обработка всех пользователей завершена.');
    }

    function shouldSkipUser(lastVisit) {
        if (!lastVisit) return true;
        if (lastVisit.includes("Сейчас онлайн")) return false;
        if (lastVisit.includes("Был больше года назад")) return true;
        let monthMatch = lastVisit.match(/Был (\d+) (month|месяц)/);
        if (monthMatch) {
            let months = parseInt(monthMatch[1], 10);
            return months > 1;
        }
        return false;
    }

    function parseCarId(carUrl) {
        let match = carUrl.match(/\/(\d+)\/?$/);
        return match ? match[1] : null;
    }

    async function processPage() {
        let mainContainer = document.querySelector('.l-container div.g-column-mid');
        if (!mainContainer) {
            console.log('Основной контейнер не найден');
            return;
        }

        let boxes = mainContainer.querySelectorAll('.x-box.o-f');
        boxes.forEach(box => {
            let userDivs = box.querySelectorAll('div > div');
            userDivs.forEach(div => {
                let userLink = div.querySelector('a.c-username');
                if (userLink) {
                    let token = userLink.getAttribute('data-ihc-token');
                    if (token) {
                        users.add(token);
                    }
                }
                div.remove();
            });

            if (box.children.length === 0) {
                console.log('Удаляем пустой контейнер');
                box.remove();
            }
        });

        updateInfoBox();

        let loadMoreButton = document.querySelector('.x-box-more');
        if (loadMoreButton) {
            loadMoreButton.click();
            pagesProcessed++;
            updateInfoBox();
            await new Promise(resolve => setTimeout(resolve, 2000));
            processPage();
        } else {
            console.log(`Сбор завершен. Всего пользователей собрано: ${users.size}`);
            processUsers(Array.from(users));
        }
    }

    processPage();
}

checkButton.addEventListener('click', processBlocks);

loadMyCars();
init_me();

if (isCarsFollowingPage()) {
    document.body.appendChild(statsDiv);
    updateStats();
}

if (isSomeCarFollowingPage()) {
    addSubscribeButton();
}

document.querySelector('.l-dv__i')?.remove();
document.querySelector('.c-dv-side.o-row.o-sticky.o-f')?.remove();

async function autoLike() {
    const buttons = document.querySelectorAll('like-button'); // или '.like-button', если это класс
    for (const button of buttons) {
        let kind = button?.getAttribute('kind') ?? '';
        if (!button.hasAttribute('active') && button.hasAttribute('kind') && (kind === 'c' || kind === 'ubr' || kind === 'cjr')) {
            button.setAttribute('active', '');
            await new Promise(resolve => setTimeout(resolve, 500));
            likesSend(button.getAttribute('key'));
        }
    }
}
setInterval(autoLike, 3000);
