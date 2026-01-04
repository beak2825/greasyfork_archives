// ==UserScript==
// @name         HWM Work
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.heroeswm.ru/pl_info.php?id=*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403336/HWM%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/403336/HWM%20Work.meta.js
// ==/UserScript==

(function () {
    var myBot = (() => {
        var globalVars = {
            charParams: { id: null },
            serverUrl: 'http://localhost:3000',
            hwmUrl: 'https://www.heroeswm.ru',
            sellResUrl: 'sell_res.php',
            firstOpenProdUrl: '',
            workParams: {},
            statuses: {
                work: false,
                sellElements: false
            },
            resources: {
                'Золото':            { cost: 1,     minCount: 0, factoryTitle: null },
                'Древесина':         { cost: 180,   minCount: 5, factoryTitle: 'Лесопилка' },
                'Руда':              { cost: 180,   minCount: 5, factoryTitle: 'Рудник' },
                'Ртуть':             { cost: 360,   minCount: 3, factoryTitle: 'Лаборатория' },
                'Сера':              { cost: 360,   minCount: 3, factoryTitle: 'Залежи серы' },
                'Кристаллы':         { cost: 360,   minCount: 3, factoryTitle: 'Пещера кристаллов' },
                'Самоцветы':         { cost: 360,   minCount: 3, factoryTitle: 'Шахта самоцветов' },
                'Кожа':              { cost: 180,   minCount: 3, factoryTitle: 'Ферма' },
                'Мифриловая руда':   { cost: 460,   minCount: 3, factoryTitle: 'Мифриловая шахта' },
                'Обсидиан':          { cost: 2000,  minCount: 1, factoryTitle: 'Обсидиановая шахта' },
                'Волшебный порошок': { cost: 2074,  minCount: 1, factoryTitle: 'Фабрика магии' },
                'Мифрил':            { cost: 3325,  minCount: 1, factoryTitle: 'Литейный цех' },
                'Никель':            { cost: 1698,  minCount: 1, factoryTitle: 'Никелевый цех' },
                'Орихалк':           { cost: 11000, minCount: 1, factoryTitle: 'Плавильный цех' },
                'Сталь':             { cost: 759,   minCount: 2, factoryTitle: 'Сталелитейный цех' },
            },
            logDelimiter: '------------------------------',
            companies: {
                open: new Set(),
                unavailable: new Set()
            },
            intervalCounter: 0
        };

        var utils = {
            getDocFromString: function (response) {
                return new DOMParser().parseFromString(response, "text/html");
            },
            $ajax: function (method, url, params = {}) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.onerror = reject;
                    //console.log(`I'm opening ${url}`);
                    xhr.open(method, url, true);
                    if (method.toLowerCase() === 'post') {
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.onload = function () {
                            resolve(this.responseText);
                        };
                    } else if (method.toLowerCase() === 'get') {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function () {
                            resolve(reader.result);
                        });
                        xhr.responseType = "blob";
                        xhr.onload = function () {
                            reader.readAsText(xhr.response, "windows-1251");
                        };
                    }
                    xhr.send(params);
                });
            },
            log: function (data) {
                console.log(`${new Date().toLocaleString()}| ${data}`);
            },
            getCaptchaUrl: function (document) {
                return document.querySelector('img[name=imgcode]').getAttribute('src');
            },
            parseCaptcha: function (captchaUrl, serverUrl = globalVars.serverUrl) {
                var params = encodeURIComponent(captchaUrl);
                return this.$ajax('GET', `${serverUrl}/cap/${params}`);
            },
            sendCaptcha: function () {
                var workParams = globalVars.workParams;
                var params = this.stringifyParams(workParams);
                var url = `${globalVars.hwmUrl}/object_do.php`;
                utils.log(`Отправляю капчу по url: ${url}`, params);
                return this.$ajax('POST', url, params);
            },
            stringifyParams(params) {
                return Object
                  .keys(params)
                  .map((key) => `${key}=${params[key]}`)
                  .join('&')
                  ;
            },
            getWorkParams: function (doc, docStr) {
                var captchaInput = doc.querySelector('form[name="working"] input[type="text"]');
                utils.checkExistence(captchaInput, doc, 'Captcha input not found');

                var params = ['id', 'id2', 'idr', 'num', 'id3'].reduce((acc, curr) => {
                    const input = doc.querySelector(`input[name="${curr}"]`);
                    return {
                        ...acc,
                        [curr]: input && input.value,
                    }
                }, {});
                params.num = utils.getNumParamValue(docStr);

                return params;
            },
            getRandInt: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            getFirstOpenFactoryUrl: function (doc) {
                var allLinks = [].filter.call(
                    doc.getElementsByTagName('a'),
                    (e) => e.innerHTML === '»»»'
                );
                if (allLinks.length > 0) {
                    var firstLink = allLinks[0];
                }
                return firstLink && firstLink.getAttribute('href');
            },
            getFactoriesOnMap: function (factoriesType = 'sh') {
                return utils.$ajax('GET', `https://www.heroeswm.ru/map.php?st=${factoriesType}`
                ).then((mapPage) => {
                    var doc = utils.getDocFromString(mapPage);
                    return doc.querySelectorAll('a[href*=object-info]:not([id])');
                });
            },
            parseFactories: function () {
                return Promise.all([
                    //parseFactoriesOnMap('mn'), // добыча не нужна для продажи ресурсов
                    utils.parseFactoriesOnMap('fc'),
                    utils.parseFactoriesOnMap('sh')
                ]);
            },
            parseFactoriesOnMap: function (type = 'sh') {
                return utils.getFactoriesOnMap(type).then((linkElems) => {
                    linkElems.forEach((linkElem) => {
                        var parent = linkElem.parentElement;
                        var color = parent.className;

                        var companies = globalVars.companies;
                        if (color === 'wbwhite') {
                            companies = companies.open;
                        } else if (color === 'wblight') {
                            companies = companies.unavailable;
                        } else {
                            companies = new Set();
                            console.log('Smth strange with color...');
                        }
                        var href = linkElem.getAttribute('href');
                        var companyId = +href.slice(href.lastIndexOf('=') + 1);
                        companies.add(companyId);
                    });
                });
            },
            findBestWork: function () { // TODO: REFACTORING
                var skip = false;
                var resultUrl = '';
                return getFactoriesOnMap('sh').then((url) => {
                    if (url) {
                        utils.log(`Самое выгодное - производство: ${url}`);
                        skip = true;
                        resultUrl = url;
                    } else {
                        utils.log(`Нет выгодных производств`);
                        return getFactoriesOnMap('fc');
                    }
                }).then((url) => {
                    if (skip) {
                        return;
                    }
                    if (url) {
                        utils.log(`Самое выгодное - обработка: ${url}`);
                        skip = true;
                        resultUrl = url;
                    } else {
                        utils.log(`Нет выгодных обработок`);
                        return getFactoriesOnMap('mn');
                    }
                }).then((url) => {
                    if (skip) {
                        return;
                    }
                    if (url) {
                        utils.log(`Самое выгодное - добыча: ${url}`);
                        resultUrl = url;
                    } else {
                        utils.log(`Очень странно, но нет свободных предприятий :/`);
                    }
                }).then(() => {
                    if (resultUrl) {
                        return utils.getFactoryPage(resultUrl.slice(resultUrl.lastIndexOf('=') + 1));
                    } else {
                        utils.log(`Что-то не так...`);
                    }
                }).then((factoryPage) => {
                    if (factoryPage && factoryPage.search(/Устройство на работу/i) !== -1) {
                        var factoryDocument = utils.getDocFromString(factoryPage);
                        globalVars.workParams = utils.getWorkParams(factoryDocument, factoryPage);
                    } else {
                        throw new Error('На производстве нет формы "Устройство на работу"');
                    }
                });

                function getFactoriesOnMap(type = 'sh') {
                    return utils.$ajax('GET', `https://www.heroeswm.ru/map.php?st=${type}`
                    ).then((mapPageFactories) => {
                        return onMapGetCallback(mapPageFactories);
                    });
                }

                /**
                 * Returns a Promise resolved with [url] OR [undefined]
                 */
                function onMapGetCallback(mapPageFactories) {
                    var doc = utils.getDocFromString(mapPageFactories);
                    var firstOpenProdUrl = utils.getFirstOpenFactoryUrl(doc);
                    if (firstOpenProdUrl) {
                        globalVars.firstOpenProdUrl = firstOpenProdUrl;
                    }

                    return new Promise(function (resolve) {
                        resolve(firstOpenProdUrl);
                    });
                }
            },
            getFactoryPage: function (factoryId) {
                return utils.$ajax('GET', `https://www.heroeswm.ru/object-info.php?id=${factoryId}`);
            },
            getCompanyParams: function (companyPage) {
                var doc = utils.getDocFromString(companyPage);

                return {
                    balance: getBalance(doc),
                    salary: getSalary(doc),
                    freePlaces: getFreePlaces(doc)
                };

                function getBalance(doc) {
                    var keyword = 'Баланс';
                    var balanceTextElem = [].filter.call(
                        doc.getElementsByTagName('td'),
                        (e) => e.innerText.slice(0, keyword.length) === keyword
                    )[0];

                    var balanceElem = balanceTextElem.nextSibling.querySelector('img[title="Золото"]').parentElement.nextSibling.firstElementChild;
                    var balance = parseInt(balanceElem.innerText.replace(/,/g, ''), 10);

                    return balance || null;
                }

                function getSalary(doc) {
                    var keyword = 'Зарплата';
                    var salaryTextElem = [].filter.call(
                        doc.getElementsByTagName('td'),
                        (e) => e.innerText.slice(0, keyword.length) === keyword
                    )[0];

                    var salaryElem = salaryTextElem.nextSibling.querySelector('img[title="Золото"]').parentElement.nextSibling.firstElementChild;
                    var salary = parseInt(salaryElem.innerText.replace(/,/g, ''), 10);

                    return salary || null;
                }

                function getFreePlaces(doc) {
                    var keyword = 'Свободных мест';
                    var freePlaces = [].filter.call(
                        doc.getElementsByTagName('b'),
                        (e) => e.previousSibling && e.previousSibling.textContent.slice(0, keyword.length) === keyword
                    )[0];
                    freePlaces = parseInt(freePlaces.innerText);

                    return freePlaces || null;
                }
            },
            getCharParams: function (charId = globalVars.charParams.id) {
                return utils.$ajax('GET', `https://www.heroeswm.ru/pl_info.php?id=${charId}`
                ).then((charPage) => {
                    var doc = utils.getDocFromString(charPage);
                    var wbs = doc.querySelectorAll('td.wb');
                    var paramsElem = wbs[1].querySelector('tr').children;
                    var paramsResources = wbs[10].getElementsByTagName('b');

                    var params = {};
                    for (var i = 0; i < paramsElem.length; i += 2) {
                        var elem = paramsElem[i].querySelector('img').getAttribute('title');
                        params[elem] = +paramsElem[i + 1]
                            .querySelector('b')
                            .innerText
                            .replace(/,/g, '');
                    }
                    [].forEach.call(paramsResources, (res) => {
                        params[res.innerText] = +res.nextSibling.textContent.replace(/: /g, '');
                    });

                    return params;
                });
            },
            getResourcesCostSum: function (resourcesObj = globalVars.resources) {
                var resources = globalVars.resources;
                return Object.keys(resourcesObj).reduce((acc, curr) => {
                    return acc + resourcesObj[curr].minCount * resources[curr].cost;
                }, 0);
            },
            getFactoriesTitles: (resources) => {
                return Object.keys(resources).reduce((accum, curr) => {
                    if (curr === 'Золото') return accum;
                    return accum[curr] = globalVars.resources[curr].factoryTitle, accum;
                }, {});
            },
            checkExistence: (item, dataAttachToError, errorMessage) => {
                if (!item) {
                    var e = new Error(errorMessage);
                    e.dataAttachToError = dataAttachToError;
                    throw e;
                }
            },
            logMoney: (params) => {
                utils.log(`Суммарно денег: ${Object.keys(params).reduce((accum, curr) => {
                    if (globalVars.resources[curr]) {
                        var cost = globalVars.resources[curr].cost;
                    }
                    cost = cost || 0;
                    return accum + params[curr] * cost;
                }, 0)}`);
            },
            getNumParamValue: (docStr) => {
                const s1 = `document.getElementById("num").value = `;
                const s2 = `; var l = document.getElementById("code").value.length`;
                const numValueExpression = docStr.slice(
                  docStr.indexOf(s1) + s1.length,
                  docStr.indexOf(s2),
                );
                return eval(numValueExpression);
            },
        };

        var game = {
            startSellElements: function () {
                if (globalVars.sellElementsInterval) {
                    game.stopSellElements();
                }
                utils.log(`Начинаю продавать элементы`);
                globalVars.statuses.sellElements = true;
                utils.parseFactories().then(() => {
                    globalVars.sellElementsInterval = setInterval(() => {
                        var companiesOpen = globalVars.companies.open;
                        var companiesUnavailable = globalVars.companies.unavailable;

                        companiesOpen.forEach((companyId) => {
                            //utils.log('Open company, sell: ' + companyId);
                            game.checkCompanyForSell(true, companyId);
                        });

                        if (globalVars.intervalCounter++ % 10 === 0) {
                            companiesUnavailable.forEach((companyId) => {
                                //utils.log('Unavailable company, sell: ' + companyId);
                                game.checkCompanyForSell(false, companyId);
                            });
                        }
                    }, 750);
                }).catch((e) => {
                    utils.log(`sellElementsLoop crashed:`);
                    console.log(e);
                });
            },
            checkCompanyForSell: function (isOpen, companyId) {
                return utils.$ajax('GET', `https://www.heroeswm.ru/object-info.php?id=${companyId}`
                ).then((companyPage) => {
                    var isCompanyInsolvent = (() => {
                        var companyParams = utils.getCompanyParams(companyPage);
                        return companyParams.balance > companyParams.salary && companyParams.freePlaces > 0;
                    })();

                    if (!isCompanyInsolvent && isOpen) {
                        utils.log(`Компания ${companyId} не готова к покупкам`);
                        globalVars.companies.open.delete(companyId);
                        globalVars.companies.unavailable.add(companyId);
                        return;
                    } else if (isCompanyInsolvent && !isOpen) {
                        utils.log(`Компания ${companyId} теперь готова к покупкам`);
                        globalVars.companies.unavailable.delete(companyId);
                        globalVars.companies.open.add(companyId);
                        return;
                    }
                    var doc = utils.getDocFromString(companyPage);
                    var forms = doc.querySelectorAll(`form[action="${globalVars.sellResUrl}"]`);
                    if (forms.length > 0) {
                        utils.log(`Успех! Можно продать ресурсы для компании ${companyId}`);
                        return Promise.all(
                            [].map.call(forms, game.sellResCallback)
                        ).then(() => {
                            return utils.getCharParams();
                        }).then((charParams) => {
                            utils.logMoney(charParams);
                        });
                    }
                });
            },
            sellResCallback: function (form) { // TODO: CHECK
                form.count.value = 99;
                var names = ['obj_id', 'check_code', 'res_id', 'count'];
                var formData = names.reduce((accum, curr) => {
                    var inputVal = form.querySelector(`input[name=${curr}]`).value;
                    return accum.concat(`${curr}=${encodeURIComponent(inputVal)}`);
                }, []).join('&');

                return utils.$ajax('POST', `/${globalVars.sellResUrl}`, formData);
            },
            stopSellElements: function () {
                globalVars.statuses.sellElements = false;
                utils.log(`Прекращаю продавать элементы`);
                clearInterval(globalVars.sellElementsInterval);
                delete globalVars.sellElementsInterval;
            },
            checkWorkStatus: function () {
                utils.log(`Проверка, может, я уже устроен?`);
                return utils.$ajax('GET', 'https://www.heroeswm.ru/home.php'
                ).then((charPage) => charPage.includes('Вы нигде не работаете.'));
            },
            getWork: function () {
                //game.stopSellElements();
                return game.checkWorkStatus().then((workStatus) => {
                    if (workStatus) {
                        utils.log(`Устраиваюсь на работу`);
                        return utils.$ajax('GET', 'https://www.heroeswm.ru/map.php?st=mn');
                    } else {
                        throw new Error('Уже устроен');
                    }
                }).then((mapPage) => { // открыть карту "Обработка"

                    var doc = utils.getDocFromString(mapPage);
                    var firstOpenProdUrl = utils.getFirstOpenFactoryUrl(doc);
                    if (firstOpenProdUrl) {
                        globalVars.firstOpenProdUrl = firstOpenProdUrl;
                        utils.log(`Первое открытое предприятие: ${firstOpenProdUrl}`);

                        return utils.$ajax('GET', `/${firstOpenProdUrl}`); // открыть ссылку первого открытого предприятия
                    } else {
                        throw new Error('Среди обработок нет открытых предприятий, crashed.');
                    }

                }).then((firstProdPage) => { // обработка страницы первого открытого предприятия

                    var doc = utils.getDocFromString(firstProdPage);
                    var captchaUrl = utils.getCaptchaUrl(doc); // получить относительную ссылку капчи
                    if (!captchaUrl) {
                        throw new Error('Captcha not found on page');
                    }
                    captchaUrl = `${globalVars.hwmUrl}/${captchaUrl}`; // абсолютная ссылка капчи
                    utils.log(`Ссылка на капчу: ${captchaUrl}, отправляю на локалхост`);

                    return utils.parseCaptcha(captchaUrl); // отправить капчу парситься на локалхост

                }).then((captchaText) => {  // после того, как капчу распарсили, передаю ее дальше;
                    // ищу максимально выгодное предприятие
                    utils.log(`Текст капчи: ${captchaText}`);
                    utils.log(`Ищу самое выгодное предприятие для устройства`);
                    return new Promise(function (resolve) {
                        return utils.findBestWork().then(() => {
                            resolve(captchaText);
                        });
                    });

                }).then((captchaText) => { // проверяю текст капчи и отправляю на сервер

                    if (captchaText.length !== 6) { // проверяю
                        throw new Error('Wrong captcha');
                    }
                    globalVars.workParams.code = captchaText;
                    //utils.GM_addData('hwm_workers_guild_log', `Get captcha: ${captchaText}`); // логаю

                    utils.log(`Составляю запрос и отправляю капчу на сервер`);
                    return utils.sendCaptcha(captchaText); // отправляю

                }).catch((e) => {
                    if (e.message === 'Уже устроен') {
                        return new Promise(function (resolve) {
                            resolve(e.message);
                        });
                    }
                    utils.log(`Ошибка в функции getWork`);
                    console.log(e);
                });
            },
            startGetWorkLoop: function () {
                game.getWork().then((afterCaptchaPage) => {
                    utils.log(`Ответ с сервера пришел`);
                    if (!afterCaptchaPage) {
                        throw new Error('There is no page after captcha input');
                    }
                    if (afterCaptchaPage.includes('Вы устроены на работу.')) {
                        var workDelay = (60 + utils.getRandInt(1, 15)) * 60000;
                        var nextWorkTime = new Date(+new Date() + workDelay);
                        setTimeout(game.startGetWorkLoop, workDelay);

                        utils.log(`${nextWorkTime} - время следующего устройства`);
                        console.log(globalVars.logDelimiter);
                    } else if (afterCaptchaPage.includes('Введен неправильный код.')) {
                        utils.log(`Введен неправильный код. Капча: ${globalVars.workParams.code}`);
                    } else if (afterCaptchaPage === 'Уже устроен') {
                        utils.log(`Да, я уже устроен`);
                        workDelay = 10 * 60000;
                        setTimeout(game.startGetWorkLoop, workDelay);
                    }
                });
            },
            startBuyElements: function () {
                setInterval(() => {
                    utils.getCharParams().then((charParams) => {
                        var toBuy = {};
                        var resources = globalVars.resources;
                        Object.keys(resources).forEach((res) => {
                            var resDiff = (charParams[res] || 0) - resources[res].minCount;
                            if (resDiff < 0) {
                                toBuy[res] = -1 * resDiff;
                            }
                        });
                        var totalCost = utils.getResourcesCostSum();
                        if (charParams['Золото'] >= totalCost) {
                            return game.buyResources(toBuy);
                        } else {
                            utils.log(`На закупку не хватает ${totalCost - charParams['Золото']}`);
                        }
                    });
                }, 5 * 1000);
            },
            getCharId: function () {
                return utils.$ajax('GET', `https://www.heroeswm.ru/home.php`
                ).then((homePage) => {
                    var doc = utils.getDocFromString(homePage);
                    var charLink = doc.querySelector('center > a.pi[href*="pl_info.php?id="]');
                    if (charLink) {
                        var href = charLink.getAttribute('href');
                        globalVars.charParams.id = href.slice(href.lastIndexOf('=') + 1);
                    } else {
                        var e = new Error('No char ID on homepage');
                        e.doc = doc;
                        throw e;
                    }
                });
            },
            buyResFromDoc: (doc, amount) => {
                var buyResForm = doc.querySelector('form[name="buy_res"]');
                utils.checkExistence(buyResForm, doc, 'No "buy_res" form on page');

                var amountAllowed;
                var howMuchCanIBuyElem = [].find.call(
                    buyResForm.querySelectorAll('td.wb[align="center"]'),
                    (td) => td.innerText.trim().includes('Можете купить:')
                ).querySelector('b');
                if (!howMuchCanIBuyElem) { // Не могу купить
                    amountAllowed = 0;
                    return;
                } else {
                    amountAllowed = +howMuchCanIBuyElem.innerText.replace(/,/g, '');
                }

                var flashParamsElem = buyResForm.querySelector('object > param[name="FlashVars"]');
                utils.checkExistence(flashParamsElem, doc, 'No "FlashVars" <param> on page');

                var buyResParams = flashParamsElem.getAttribute('value');
                utils.checkExistence(buyResParams, flashParamsElem, 'Empty value attr in flash <param>');
                buyResParams = buyResParams.split('|');

                buyResParams = {
                    //rand1: NaN,
                    pl_id: buyResParams[7],
                    obj_id: buyResParams[5],
                    check_code: buyResParams[6],
                    count: amount
                };
                var POST_query = Object.keys(buyResParams).reduce((accum, curr) => {
                    return accum + `&${curr}=${buyResParams[curr]}`;
                }, `rand1=NaN`);

                if (amountAllowed >= amount) {
                    return utils.$ajax('POST', 'https://www.heroeswm.ru/buy_res.php', POST_query);
                }
            },
            buyResOnMap: function (factoryLink, amount) {
                return utils.$ajax('GET', factoryLink).then((factoryPage) => {
                    var doc = utils.getDocFromString(factoryPage);
                    return game.buyResFromDoc(doc, amount);
                });
            },
            buyResources: function (toBuy) {
                var factoriesThatINeed = utils.getFactoriesTitles(toBuy);
                var factoriesParsed = {};

                function updateFactories(linkElems) {
                    linkElems.forEach((a) => {
                        var resKey = Object.keys(factoriesThatINeed).filter((key) => {
                            return factoriesThatINeed[key] === a.innerText;
                        })[0];

                        if (resKey) {
                            factoriesParsed[resKey] = {
                                factoryTitle: a.innerText,
                                link: a.getAttribute('href')
                            };
                        }
                    });
                }

                return utils.getFactoriesOnMap('mn').then((linkElems) => { // ДОБЫЧА
                    updateFactories(linkElems);

                    return utils.getFactoriesOnMap('fc'); // ОБРАБОТКА
                }).then((linkElems) => {
                    updateFactories(linkElems);

                }).then(() => {
                    return Promise.all(Object.keys(factoriesParsed).map((res) => {
                        utils.log(`Покупаю ${toBuy[res]} шт. "${res}" на предприятии `);
                        return game.buyResOnMap(factoriesParsed[res].link, toBuy[res]);
                    }));
                });
            },
        };

        // var regexPattern = /Район:[\s\S]*?<a[\s\S]*?>[\s]{2}([\s\S]+?)<\/a>/i;
        // result = response.match(regexPattern)[1]; // <--- RETURN THIS

        var getOptionsElem = () => {
            var existentElem = document.querySelector('.bot-options');
            if (existentElem) {
                return existentElem;
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'bot-options';

            var sellButton = (() => {
                var sellButton = document.createElement('button');
                sellButton.id = 'sellButton';
                sellButton.addEventListener('click', function () {
                    var status = globalVars.statuses.sellElements;
                    if (status) {
                        game.stopSellElements();
                    } else {
                        game.startSellElements();
                    }
                    updateOptions();
                });
                return sellButton;
            })();

            var workButton = (() => {
                var workButton = document.createElement('button');
                workButton.id = 'workButton';
                workButton.disabled = true;
                return workButton;
            })();

            wrapper.appendChild(sellButton);
            wrapper.appendChild(workButton);

            var s = wrapper.style;
            s.position = 'fixed';
            s.left = '20px';
            s.top = '20px';

            return wrapper;
        };

        function updateOptions() {
            document.getElementById('sellButton').innerText = `Продавать элементы: ${globalVars.statuses.sellElements}`;
            document.getElementById('workButton').innerText = `Устроен на работу: ${globalVars.statuses.work}`;
        }

        function showOnlyOptions() {
            document.querySelector('table').hidden = true;
            document.querySelector('center').hidden = true;
            document.body.appendChild(getOptionsElem());
        }

        function init() {
            showOnlyOptions();
            myBot.getCharId().then(() => {
                myBot.work();
                myBot.buyStart();
                myBot.sellStart();
                updateOptions();
            });
        }

        return {
            work: game.startGetWorkLoop,
            sellStart: game.startSellElements,
            buyStart: game.startBuyElements,
            sellStop: game.stopSellElements,
            getCharId: game.getCharId,
            init
        };
    })();

    myBot.init();
    setTimeout(() => {
        location.reload();
    }, 5 * 60 * 1000);
})();
