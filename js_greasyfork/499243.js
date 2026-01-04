// ==UserScript==
// @name         Smart AD blocker for: Yandex, Mail.ru, Dzen.ru, VK, OK
// @name:ru         Умный блокировщик рекламы для: Yandex, Mail.ru, Dzen.ru, VK, OK
// @namespace    http://tampermonkey.net/
// @version      2025-05-21_20-47
// @description  Smart AD blocker with dynamic blocking protection, for: Yandex, Mail.ru, Dzen.ru, VK, OK
// @description:ru  Умный блокировщик рекламы при динамической защите от блокировки, для: Yandex, Mail.ru, Dzen.ru, VK, OK
// @author       Igor Lebedev
// @license        GPL-3.0-or-later
// @match        http://*.mail.ru/*
// @match        https://*.mail.ru/*
// @match        https://sportmail.ru/*
// @match        https://*.ya.ru/*
// @match        https://*.yandex.ru/*
// @match        https://*.dzen.ru/*
// @match        https://*.ok.ru/*
// @match        https://*.vk.com/*
// @match        https://vkvideo.ru/*
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/499243/Smart%20AD%20blocker%20for%3A%20Yandex%2C%20Mailru%2C%20Dzenru%2C%20VK%2C%20OK.user.js
// @updateURL https://update.greasyfork.org/scripts/499243/Smart%20AD%20blocker%20for%3A%20Yandex%2C%20Mailru%2C%20Dzenru%2C%20VK%2C%20OK.meta.js
// ==/UserScript==

/* global GM_config */

(() => {
    'use strict'

    GM_config.init({
        id: 'sc_config',
        title: GM_info.script.name + ' Настройки',
        fields: {
            DEBUG_MODE: {
                label: 'Debug mode',
                type: 'checkbox',
                default: false,
                title: 'Log debug messages to the console'
            },
            MAILRU_ON: {
                label: 'mail.ru: Главная страница',
                type: 'checkbox',
                default: true,
                title: 'Включить для mail.ru'
            },
            MAILRU_email_ON: {
                label: 'mail.ru: Почта (e.mail.ru): Изменено: 2025-02-18 05:04',
                type: 'checkbox',
                default: true,
                title: 'Включить для Облака cloud.mail.ru'
            },
            MAILRU_cloud_ON: {
                label: 'mail.ru: Облако (cloud.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Облака cloud.mail.ru'
            },
            MAILRU_doc_ON: {
                label: 'mail.ru: Документы (doc.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Документы doc.mail.ru'
            },
            MAILRU_news_ON: {
                label: 'mail.ru: Новости (news.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Новости news.mail.ru'
            },
            MAILRU_vfokuse_ON: {
                label: 'mail.ru: ВФокусе (vfokuse.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для ВФокусе vfokuse.mail.ru'
            },
            MAILRU_finance_ON: {
                label: 'mail.ru: Финансы (finance.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Финансы finance.mail.ru'
            },
            MAILRU_auto_ON: {
                label: 'mail.ru: Автомобили (auto.mail.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Автомобили auto.mail.ru'
            },
            SPORTMAILRU_ON: {
                label: 'sportmail.ru',
                type: 'checkbox',
                default: true,
                title: 'Включить для sportmail.ru'
            },
            YANDEX_ON: {
                label: 'Яндекс (ya.ru и yandex.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс (ya.ru и yandex.ru)'
            },
            YANDEX_email_ON: {
                label: 'Яндекс-почта (mail.yandex.ru): Изменено: 2025-04-12 12:57',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-почты (mail.yandex.ru)'
            },
            YANDEX_disk_ON: {
                label: 'Яндекс-диск (disk.yandex.ru): Изменено: 2025-01-29 22:01',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-диске (disk.yandex.ru)'
            },
            YANDEX_maps_ON: {
                label: 'Яндекс-карты (yandex.ru/maps)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-картинки (yandex.ru/maps)'
            },
            YANDEX_images_ON: {
                label: 'Яндекс-карты (yandex.ru/images)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-картинок (yandex.ru/images)'
            },
            YANDEX_video_ON: {
                label: 'Яндекс-видео (yandex.ru/video)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-видео (yandex.ru/video)'
            },
            YANDEX_games_collection_ON: {
                label: 'Яндекс-игры: коллекция (yandex.ru/games): Изменено: 2025-04-12 13:47',
                type: 'checkbox',
                default: true,
                title: 'Включить для коллекции Яндекс-игр (yandex.ru/games)'
            },
            YANDEX_games_app_ON: {
                label: 'Яндекс-игры: игра (yandex.ru/games/app): Изменено: 2025-05-21 20:47',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-игры (yandex.ru/games/app)'
            },
            YANDEX_игры_app_AD_правый_ВКЛ: {
                label: 'Яндекс-игры: игра (yandex.ru/games/app): Правый рекламный блок',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-игры: игра (yandex.ru/games/app): Правый рекламный блок'
            },
            YANDEX_игры_app_AD_центральный_ВКЛ: {
                label: 'Яндекс-игры: игра (yandex.ru/games/app): Центральный рекламный блок',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-игры: игра (yandex.ru/games/app): Центральный рекламный блок'
            },
            YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ: {
                label: 'Яндекс-игры: игра (yandex.ru/games/app): Нижний ряд других игр',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-игры: игра (yandex.ru/games/app): Нижний ряд других игр'
            },
            YANDEX_health_ON: {
                label: 'Яндекс-здоровье (yandex.ru/health)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-здоровье (yandex.ru/health)'
            },
            YANDEX_погода_ON: {
                label: 'Яндекс-погода (yandex.ru/pogoda): Изменено: 2025-02-24 05:49',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-погода (yandex.ru/pogoda)'
            },
            DZEN_ON: {
                label: 'Яндекс-Дзен (dzen.ru)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен (dzen.ru)'
            },
            DZEN_video_ON: {
                label: 'Яндекс-Дзен-Видео (dzen.ru/video)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен-Видео (dzen.ru/video)'
            },
            DZEN_shorts_ON: {
                label: 'Яндекс-Дзен: Коротие видео (dzen.ru/shorts)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Короткие видео (dzen.ru/shorts)'
            },
            DZEN_pogoda_ON: {
                label: 'Яндекс-Дзен: Погода (dzen.ru/pogoda)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Погода (dzen.ru/pogoda)'
            },
            DZEN_pogoda_maps_ON: {
                label: 'Яндекс-Дзен: Погода на карте (dzen.ru/pogoda/maps)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Погода на карте (dzen.ru/pogoda/maps)'
            },
            DZEN_pogoda_details_ON: {
                label: 'Яндекс-Дзен: Погода подробно (dzen.ru/pogoda/details)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Погода подробно (dzen.ru/pogoda/details)'
            },
            DZEN_pogoda_month_ON: {
                label: 'Яндекс-Дзен: Погода на месяц (dzen.ru/pogoda/month)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Погода на месяц (dzen.ru/pogoda/month)'
            },
            DZEN_articles_ON: {
                label: 'Яндекс-Дзен: Статьи (dzen.ru/articles)',
                type: 'checkbox',
                default: true,
                title: 'Включить для Яндекс-Дзен: Статьи (dzen.ru/articles)'
            },
            VK_ON: {
                label: 'Вконтакте',
                type: 'checkbox',
                default: true,
                title: 'Включить для Вконтакте (vk.com)'
            },
            VK_VIDEO_ON: {
                label: 'Вконтакте видео',
                type: 'checkbox',
                default: true,
                title: 'Включить для Вконтакте (vkvideo.ru)'
            },
            OK_ON: {
                label: 'Одноклассники',
                type: 'checkbox',
                default: true,
                title: 'Включить для Одноклассники (ok.ru)'
            },
        },
        events: {
            init: onInit
        }
    })

    GM_registerMenuCommand('Настройки', () => {
        GM_config.open()
    })

    class Debugger {
        constructor (name, enabled) {
            this.debug = {}
            if (!window.console) {
                return () => { }
            }
            Object.getOwnPropertyNames(window.console).forEach(key => {
                if (typeof window.console[key] === 'function') {
                    if (enabled) {
                        this.debug[key] = window.console[key].bind(window.console, name + ': ')
                    } else {
                        this.debug[key] = () => { }
                    }
                }
            })
            return this.debug
        }
    }

    var DEBUG

    let MAILRU_ON = true
    let MAILRU_email_ON = true
    let MAILRU_cloud_ON = true
    let MAILRU_doc_ON = true
    let MAILRU_news_ON = true
    let MAILRU_vfokuse_ON = true
    let MAILRU_finance_ON = true
    let MAILRU_auto_ON = true
    let SPORTMAILRU_ON = true
    let YANDEX_ON = true
    let YANDEX_email_ON = true
    let YANDEX_disk_ON = true
    let YANDEX_maps_ON = true
    let YANDEX_images_ON = true
    let YANDEX_video_ON = true
    let YANDEX_games_collection_ON = true
    let YANDEX_games_app_ON = true
    let YANDEX_игры_app_AD_правый_ВКЛ = true
    let YANDEX_игры_app_AD_центральный_ВКЛ = true
    let YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ = true
    let YANDEX_health_ON = true
    let YANDEX_погода_ON = true
    let DZEN_ON = true
    let DZEN_video_ON = true
    let DZEN_shorts_ON = true
    let DZEN_pogoda_ON = true
    let DZEN_pogoda_maps_ON = true
    let DZEN_pogoda_details_ON = true
    let DZEN_pogoda_month_ON = true
    let DZEN_articles_ON = true
    let VK_ON = true
    let VK_VIDEO_ON = true
    let OK_ON = true
    let FirstOpen = false

    function onInit() {
        DEBUG = new Debugger(GM_info.script.name, GM_config.get('DEBUG_MODE'))

        MAILRU_ON = GM_config.get('MAILRU_ON')
        MAILRU_email_ON = GM_config.get('MAILRU_email_ON')
        MAILRU_cloud_ON = GM_config.get('MAILRU_cloud_ON')
        MAILRU_doc_ON = GM_config.get('MAILRU_doc_ON')
        MAILRU_news_ON = GM_config.get('MAILRU_news_ON')
        MAILRU_vfokuse_ON = GM_config.get('MAILRU_vfokuse_ON')
        MAILRU_finance_ON = GM_config.get('MAILRU_finance_ON')
        MAILRU_auto_ON = GM_config.get('MAILRU_auto_ON')
        SPORTMAILRU_ON = GM_config.get('SPORTMAILRU_ON')
        YANDEX_ON = GM_config.get('YANDEX_ON')
        YANDEX_email_ON = GM_config.get('YANDEX_email_ON')
        YANDEX_disk_ON = GM_config.get('YANDEX_disk_ON')
        YANDEX_maps_ON = GM_config.get('YANDEX_maps_ON')
        YANDEX_images_ON = GM_config.get('YANDEX_images_ON')
        YANDEX_video_ON = GM_config.get('YANDEX_video_ON')
        YANDEX_games_collection_ON = GM_config.get('YANDEX_games_collection_ON')
        YANDEX_games_app_ON = GM_config.get('YANDEX_games_app_ON')
        YANDEX_игры_app_AD_правый_ВКЛ = GM_config.get('YANDEX_игры_app_AD_правый_ВКЛ')
        YANDEX_игры_app_AD_центральный_ВКЛ = GM_config.get('YANDEX_игры_app_AD_центральный_ВКЛ')
        YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ = GM_config.get('YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ')
        YANDEX_health_ON = GM_config.get('YANDEX_health_ON')
        YANDEX_погода_ON = GM_config.get('YANDEX_погода_ON')
        DZEN_ON = GM_config.get('DZEN_ON')
        DZEN_video_ON = GM_config.get('DZEN_video_ON')
        DZEN_shorts_ON = GM_config.get('DZEN_shorts_ON')
        DZEN_pogoda_ON = GM_config.get('DZEN_pogoda_ON')
        DZEN_pogoda_maps_ON = GM_config.get('DZEN_pogoda_maps_ON')
        DZEN_pogoda_details_ON = GM_config.get('DZEN_pogoda_details_ON')
        DZEN_pogoda_month_ON = GM_config.get('DZEN_pogoda_month_ON')
        DZEN_articles_ON = GM_config.get('DZEN_articles_ON')
        VK_ON = GM_config.get('VK_ON')
        VK_VIDEO_ON = GM_config.get('VK_VIDEO_ON')
        OK_ON = GM_config.get('OK_ON')

        // сюада надо бы поместить все функции, но пока под вопросом
        if (!FirstOpen) {
            FirstOpen = true
            handleUrlChange()
        }
    }

    // получаем текущий адрес страницы
    let currentURL = window.location.href
    const config = {
        SettingsOnOff: true,
        isRunningAsExtension: false,
        nodes: {
            mail_ru_email_GeneralBlock: 'div.application-mail__layout.application-mail__layout_main',
            mail_ru_suggestions: 'div.themes-widget.themes-widget_full',
            mail_ru_banner_top_parent: 'div[slot="main-column"]',
            mail_ru_banner_top_parent_bannerClassList: ['span', 'article', 'p', 'section'], // все возможные типы нод, используемые в качестве контекнера рекламного баннера
            ya_ru_banner_under_search: 'div.banner.i-mini-bem', // все возможные типы нод, используемые в качестве контекнера рекламного баннера
            // ya_ru_search_suggestions: 'div.Modal.Modal_visible.Modal_hasAnimation.Distribution-SplashScreenModal.Distribution-SplashScreenModal_outerCross.SplashscreenDefault', // все возможные типы нод, используемые в качестве контекнера рекламного баннера
            ya_ru_search_suggestions: 'div.Modal.Modal_visible.Modal_hasAnimation', // классы, используемые в качестве контекнера рекламного баннера


        }
    };
    let intervalId
    const observer_config = { childList: true, subtree: true } // общи конфиг обсервера
    // Массив для хранения ссылок на обсерверы
    const observers = []
    // счётчики
    let count_001 = 0, count_002 = 0

    const isDesktop = !isMobileDevice()

    // Функция для обработки изменений URL
    function handleUrlChange() {
        // console.log('URL changed to:', window.location.href);
        // Изменено: 2025-02-18 05:04, Автор:
        if (MAILRU_email_ON && currentURL.startsWith('https://e.mail.ru/')) {
            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    // удаление верхнего рекламного блока
                    document.querySelectorAll('div.react-async').forEach(node => {
                        // node?.remove()
                        node.style.display = 'none'
                    })
                    document.querySelectorAll('div[class$="-adv"]').forEach(node => {
                        // node?.remove()
                        node.style.display = 'none'
                    })

                    // удаление правых рекламных блоков
                    СкрытьПравыйБлок()
                    СкрытьЛевыйБлок()

                }
                // после включения обсервера
                else {
                    // удаление верхнего рекламного блока
                    if (node.nodeName === 'DIV') {
                        if (node.className === 'react-async') {
                            // node.forEach(node => {node?.remove()})
                        }
                        else if (hasClassEndingWithAdv(node)) {
                            // node?.remove()
                            node.style.display = 'none'
                        }
                        else if (node.className === 'noads-button') {
                            СкрытьПравыйБлок()
                        }
                        // else if (node.className === 'ReactVirtualized__Grid__innerScrollContainer' || node.parentNode?.className === 'ReactVirtualized__Grid__innerScrollContainer' ) {
                        // else if (node.parentNode?.className === 'ReactVirtualized__Grid__innerScrollContainer' ) {
                        else if (node.className === 'ReactVirtualized__Grid__innerScrollContainer' ) {
                            const observer_ReactVirtualized__Grid__innerScrollContainer = new MutationObserver((mutationsList, observer) => {
                                for (let mutation of mutationsList) {
                                    if (mutation.type === 'childList') {
                                        // mutation.addedNodes.forEach(node => {
                                        СкрытьЛевыйБлок(node)
                                        // })
                                    }
                                }
                            })
                            observer_ReactVirtualized__Grid__innerScrollContainer.observe(node, observer_config)
                            observers.push(observer_ReactVirtualized__Grid__innerScrollContainer)
                        }
                        // Проверяем вложенные элементы
                        else {
                            // node.querySelectorAll('div.react-async').forEach(node => {node?.remove()})
                            node.querySelectorAll('div[class$="-adv"]').forEach(node => {
                                // node?.remove()
                                node.style.display = 'none'
                            })
                            const КнопкаУбратьРекламу = node.querySelector('div.noads-button')
                            if (КнопкаУбратьРекламу) {
                                СкрытьПравыйБлок()
                            }

                        }
                    }
                    // Функция для проверки, принадлежит ли нода классу, название которого заканчивается на '-adv'
                    function hasClassEndingWithAdv(node) {
                        // Проверяем, что переданный объект является DOM-элементом
                        if (node && node.classList) {
                            // Ищем класс, который оканчивается на '-adv'
                            return [...node.classList].some(cls => cls.endsWith('-adv'));
                        }
                        return false;
                    }

                }
            }

            function СкрытьПравыйБлок() {
                // Функция для проверки наличия CSS-свойства --right-column-width
                function hasRightColumnWidth(element) {
                    const style = window.getComputedStyle(element);
                    return style.getPropertyValue('--right-column-width') !== '';
                }

                // Получаем все элементы на странице
                const allElements = document.querySelectorAll('*');

                // Фильтруем элементы, у которых есть свойство --right-column-width
                const elementsWithRightColumnWidth = Array.from(allElements).filter(hasRightColumnWidth);

                // Переопределяем свойство --right-column-width на 0px для найденных элементов
                elementsWithRightColumnWidth.forEach(element => {
                    element.style.setProperty('--right-column-width', '0px');
                })
            }

            function СкрытьЛевыйБлок(node) {

                // Находим контейнер с классом ReactVirtualized__Grid__innerScrollContainer
                // const container = node || document.querySelector('div.ReactVirtualized__Grid__innerScrollContainer');
                const container = document.querySelector('div.ReactVirtualized__Grid__innerScrollContainer');

                if (container) {
                    // Получаем все дочерние элементы контейнера
                    const children = Array.from(container.children);

                    // Перебираем элементы
                    // for (let i = 0; i < children.length; i++) {
                    // проверка первых 4-х
                    for (let i = 0; i < 3; i++) {

                        const currentElement = children[i];
                        const prevElement = children[i - 1];
                        const nextElement = children[i + 1];

                        // Получаем высоту текущего, предыдущего и следующего элементов
                        const currentHeight = currentElement.offsetHeight;
                        const prevHeight = prevElement ? prevElement.offsetHeight : null;
                        const nextHeight = nextElement ? nextElement.offsetHeight : null;

                        // Проверяем условия
                        if (
                            currentHeight > 20 &&
                            currentHeight < 100 &&
                            (!prevElement || prevHeight < 5) &&
                            (!nextElement || nextHeight < 5)
                        ) {
                            // currentElement.style.height = 0
                            currentElement.style.display = "none"
                            // break; // Прекращаем поиск после нахождения первого подходящего элемента
                        }
                    }

                }
            }

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            Удаление_рекламы(node)
                        })
                    }
                }
            })
            // observer.observe(document.querySelector('div.page__right'), observer_config)
            observer.observe(document.body, observer_config)
            observers.push(observer)
            Удаление_рекламы()




        }
        // почта на мобильном устройстве
        else if (MAILRU_email_ON && currentURL.startsWith('https://touch.mail.ru/messages/')) {
            // верхний узкий баннер
            document.querySelector('div.mailru-visibility-check')?.parentNode?.remove()
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                document.querySelector('div.mailru-visibility-check')?.parentNode?.remove()
                            }
                        })
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
        }
        else if (MAILRU_cloud_ON && currentURL.startsWith('https://cloud.mail.ru/attaches/')) {
            // нижний узкий баннер
            document.querySelector('div[class^="ReactViewer__attachesinfo"]')?.remove()
            // правая панель
            document.querySelector('div[class^="ReactViewer__attachesSidebar"]')?.remove()
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                // нижний узкий баннер
                                document.querySelector('div[class^="ReactViewer__attachesinfo"]')?.remove()
                                // правая панель
                                document.querySelector('div[class^="ReactViewer__attachesSidebar"]')?.remove()
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
        }
        else if (MAILRU_auto_ON && currentURL.startsWith('https://auto.mail.ru/') ) {
            // удаление всей рекламы, но не очень аккуратно

            // Функция для проверки, что элемент имеет только один класс
            function hasSingleClass(element, className) {
                return element.classList.length === 1 && element.classList.contains(className);
            }

            // Функция для поиска и удаления всех подходящих div элементов
            function removeDivsWithSingleClassAndId() {
                const divs = document.querySelectorAll('div');

                divs.forEach(div => {
                    if (hasSingleClass(div, 'mailru-visibility-check') && div.id.startsWith('mailru')) {
                        div.remove();
                    }
                });
            }
            // Вызов функции для удаления div элементов
            removeDivsWithSingleClassAndId();

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                removeDivsWithSingleClassAndId();
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)


        }

        else if ((MAILRU_cloud_ON && currentURL.startsWith('https://cloud.mail.ru/home/')) ||
                 (MAILRU_doc_ON && currentURL.startsWith('https://doc.mail.ru/'))
                )
        {
            // верхний узкий баннер
            document.querySelector('div[class^="Worm__root--"]')?.remove()
        }
        else if ((SPORTMAILRU_ON && currentURL.startsWith('https://sportmail.ru/')) ||
                 (MAILRU_news_ON && currentURL.startsWith('https://news.mail.ru/')) ||
                 (MAILRU_vfokuse_ON && currentURL.startsWith('https://vfokuse.mail.ru/')) ||
                 (MAILRU_finance_ON && currentURL.startsWith('https://finance.mail.ru/'))
                )
        {
            // нижний узкий баннер
            function AD_remove_node(node_test, mutation_test) {
                if (currentURL.startsWith('https://finance.mail.ru/')) {
                    // поиск блока с рекламой, занимающего верхнее пространство страницы
                    function findParentWithProperties(targetNode) {
                        function checkParent(node, level) {
                            if (level > 4) {
                                return null;
                            }

                            const parent = node.parentElement;
                            if (!parent) {
                                return null;
                            }

                            const style = parent.style.minHeight;
                            const dataHideOrder = parent.getAttribute('data-hideorder');
                            const dataSize = parent.getAttribute('data-size');

                            if (style && dataHideOrder !== null && dataSize !== null) {
                                return parent;
                            }

                            return checkParent(parent, level + 1);
                        }

                        return checkParent(targetNode, 1);
                    }

                    const targetNode = document.querySelector('div.mailru-visibility-check')
                    if (targetNode) {
                        const parentWithProperties = findParentWithProperties(targetNode);

                        if (parentWithProperties) {
                            parentWithProperties.remove()
                        } else {
                            targetNode.remove()
                        }
                    }
                }
                else {
                    document.querySelector('div.mailru-visibility-check')?.remove()
                }
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                AD_remove_node(node, mutation)
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()
        }
        else if (MAILRU_ON && currentURL.startsWith('https://mail.ru/')) {
            mail_ru_checkAndRemoveTopBlock()

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // console.log('Новые узлы добавлены:', mutation.addedNodes);
                        // для всех возможных типов нод-контейнеров баннера
                        config.nodes.mail_ru_banner_top_parent_bannerClassList.forEach(item => {
                            // mail_ru_checkAndRemoveTopBlock()
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeName === item.toUpperCase()) {
                                    // mail_ru_checkAndRemoveTopBlock_classList(node,mutation)
                                }
                                // признак добавления верхнего рекламного блока
                                if (node.nodeType === 1 && node.tagName === 'DIV' && parseInt(getComputedStyle(node).height) === 90) {
                                    mail_ru_checkAndRemoveTopBlock()
                                }

                            });
                        });
                        // document.querySelectorAll('article.zenad-card-rtb').forEach(node => {
                        //                         document.querySelectorAll('article.zenad-card-rtb[data-testid="card-rtb"]').forEach(node => {
                        document.querySelectorAll('article.zenad-card-rtb[aria-label="Карточка рекламы"]').forEach((node, index, array) => {
                            // if (index > 0 && index < array.length - 1 ) {
                            // node?.remove()
                            node.style.display = 'none'
                            // }
                            // Если удалить сразу все ноды - возникают глюки. Удаляем первые ноды, оставляя последующие невидимыми
                            if (array.length > 10 && index < 5) {
                                node?.remove()
                            }
                        })
                    }
                }
            });
            observer.observe(document.querySelector(config.nodes.mail_ru_banner_top_parent), observer_config)
            observers.push(observer)
            // }
            // }
            // const interval_AD_remove = setInterval(AD_remove, 500)

        }
        else if (YANDEX_ON && (currentURL.startsWith('https://ya.ru/search') || currentURL.startsWith('https://yandex.ru/search'))) {
            function AD_remove_node(node, mutation_test) {
                // баннер внизу справа "Сделать Яндекс основным поисковиком?"
                let targetNode
                targetNode = document.querySelector(config.nodes.ya_ru_search_suggestions) // 'div.Modal.Modal_visible.Modal_hasAnimation.Distribution-SplashScreenModal.Distribution-SplashScreenModal_outerCross.SplashscreenDefault'
                targetNode?.remove()
                targetNode = document.querySelector('div.Distribution-Popup')
                targetNode?.remove()

                // вверху слева кнопка "Установите Яндекс Браузер"
                targetNode = document.querySelector('div.DistrNav') || document.querySelector('div.HeaderDesktopActions-Distribution')
                targetNode?.remove()

                // баннер справа от поисковой строки
                // Находим все div с id, начинающимся на "adv"
                document.querySelectorAll('div[id^="adv"]').forEach(node => {
                    node.style.display = 'none';
                    // Ищем первого родителя с id="search-result-aside"
                    const parentAside = node.closest('#search-result-aside');
                    // Если такой родитель есть — скрываем и его
                    if (parentAside) {
                        parentAside.style.display = 'none';
                    }
                });


            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                AD_remove_node(node, mutation)
                            }
                        });

                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()


        }
        // настроить обсервер
        else if (YANDEX_images_ON && (currentURL.startsWith('https://ya.ru/images/') || currentURL.startsWith('https://yandex.ru/images/'))) {
            // Добавление кнопки "Реклама"
            // const EspeciallyForYou = CreateEspeciallyForYou()
            // let EspeciallyForYou_fact = false
            const AdvDetails = {
                Details: CreateEspeciallyForYou(),
                Details_fact: false,
                countBanners: 0,
            }
            let ADRight_fact = false // факт вывода рекоамного блока справа внутри "Реклама"

            // блок справа
            function AD_remove_node(node, mutation_test) {
                let targetNode
                let targetNodes

                // баннер "Сделать поиск Яндекса основным?"
                targetNode = document.querySelector(config.nodes.ya_ru_search_suggestions) || document.querySelector('div#distr-pcode-container') // 'div.Modal.Modal_visible.Modal_hasAnimation.Distribution-SplashScreenModal.Distribution-SplashScreenModal_outerCross.SplashscreenDefault'
                // Modal Modal_visible Modal_hasAnimation Distribution-SplashScreenModal SplashscreenTopButton SplashscreenTopButton_layout_system_top_dark_close-button
                if (targetNode) {
                    // if (EspeciallyForYou_fact === false) {
                    if (AdvDetails.Details_fact === false) {
                        targetNode.style.marginTop = '0.3rem'
                        // EspeciallyForYou?.appendChild(targetNode)
                        AdvDetails.Details.appendChild(targetNode)
                        AdvDetails.countBanners++
                    }
                    else {
                        targetNode?.remove()
                    }
                }
                // баннер справа
                targetNode = document.querySelector('div.ImagesViewer-SidebarAdv')
                targetNode?.parentNode.remove()
                targetNode = document.querySelector('div#ImagesViewer-SidebarAdv')
                targetNode?.parentNode.parentNode.parentNode.remove()
                // баннер вверху
                targetNode = document.querySelector('div.AdvMastHead')
                targetNode?.remove()
                // реклама среди картинок
                document.querySelectorAll('div.JustifierRowLayout-Incut').forEach(node => {node?.remove()})
                document.querySelectorAll('div.AdvRsyaCrossPage').forEach(node => {node?.remove()})
                document.querySelectorAll('div[aria-label="Рекламный баннер"]').forEach(node => {node?.remove()})
                // if (node) observer.disconnect()
                // при нажатии на какую-либо картинку открывается модальное окно
                const targetNodeModal = document.querySelector('div.Modal.Modal_visible.Modal_theme_normal.ImagesViewer-Modal.ImagesViewer')
                if (targetNodeModal) {
                    // в модальном окне удаление рекламы справа
                    targetNodes = targetNodeModal.querySelectorAll('div[id^="ImagesViewer-"]')
                    targetNodes.forEach(node => {
                        // Поиск главного родительского блока, содержащего рекламу
                        const node_parentNode = findParentWithClassEndingInCard(node)
                        if (!ADRight_fact) {
                            node.style.marginTop = '0.3rem'
                            // EspeciallyForYou?.appendChild(node)
                            AdvDetails.Details.appendChild(node)
                            AdvDetails.countBanners++
                            ADRight_fact = true
                        }
                        node_parentNode?.remove()

                    });

                    // добавление "Реклама" под блок-ссылку на источник изображения
                    if (AdvDetails.countBanners > 0) {
                        // if (EspeciallyForYou_fact === false) {
                        if (AdvDetails.Details_fact === false) {

                            const div_imageSource = targetNodeModal.querySelector('div.ImagesViewer-LayoutSideblock')
                            if (div_imageSource) {
                                // EspeciallyForYou.querySelector('summary').textContent += ' (' + AdvDetails.countBanners + ')'
                                // div_imageSource.appendChild(EspeciallyForYou)
                                // AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама') + ' (' + AdvDetails.countBanners + ')'
                                AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама') + ` (${AdvDetails.countBanners})`
                                div_imageSource.appendChild(AdvDetails.Details)
                                // EspeciallyForYou_fact = true
                                AdvDetails.Details_fact = true

                            }
                        }
                    }

                    // Поиск главного родительского блока, содержащего рекламу
                    function findParentWithClassEndingInCard(node) {
                        let currentNode = node

                        // Проверяем каждого родителя, пока не найдем нужный элемент или не дойдем до корня документа
                        while (currentNode && currentNode !== document.body) {
                            // Проверяем, есть ли у текущего элемента класс, оканчивающийся на "-Card"
                            if (currentNode.classList && Array.from(currentNode.classList).some(className => className.endsWith('-Card'))) {
                                return currentNode;
                            }
                            // Переходим к следующему родителю
                            currentNode = currentNode.parentNode
                        }

                        // Если нужный элемент не найден, возвращаем null
                        return null;
                    }
                }
                // else {
                //     // сброс флага вывода блока "Реклама" при закрытии модального окна
                //     EspeciallyForYou_fact = false
                // }
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            // if (node.nodeName === 'DIV') {
                            if (node.className !== 'details_EspeciallyForYou') {
                                AD_remove_node(node, mutation)
                            }

                        });
                        mutation.removedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                const targetNodeModal = document.querySelector('div.Modal.Modal_visible.Modal_theme_normal.ImagesViewer-Modal.ImagesViewer')
                                // модальное окно изображения было закрыто или ещё не открылось
                                if (!targetNodeModal) {
                                    // EspeciallyForYou_fact = false
                                    AdvDetails.Details_fact = false

                                    ADRight_fact = false
                                    // Очистка <details>
                                    // Выбираем все дочерние элементы <details>, кроме <summary>
                                    // const childNodes = EspeciallyForYou.querySelectorAll('details > *:not(summary)')
                                    const childNodes = AdvDetails.Details.querySelectorAll('details > *:not(summary)')

                                    // Удаляем каждый из выбранных элементов
                                    childNodes.forEach(node => {
                                        // EspeciallyForYou.removeChild(node)
                                        AdvDetails.Details.removeChild(node)
                                    });
                                    // AdvDetails.countBanners = 0
                                    AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама')
                                }
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()

        }
        // сделать пропуск видеозаставки
        else if (YANDEX_video_ON && (currentURL.startsWith('https://ya.ru/video/') || currentURL.startsWith('https://yandex.ru/video/'))) {
            // баннер сверху
            function AD_remove_node(node, mutation_test) {
                const targetNodes = document.querySelectorAll('div[role="button"]')
                targetNodes?.forEach(node => {
                    node.remove()
                });
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                const targetNodes = document.querySelectorAll('div[role="button"]')
                                targetNodes?.forEach(node => {
                                    node.remove()
                                });
                            }
                        });

                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()
            yandex_dzen_questionYandexGeneralSearch()

        }
        else if (YANDEX_ON && currentURL.startsWith('https://ya.ru/')) {
            // если это мбильное устройство
            if (isDesktop) {
                // Добавление кнопки "Реклама"
                // const EspeciallyForYou = CreateEspeciallyForYou()
                const AdvDetails = {
                    Details: CreateEspeciallyForYou(),
                    Details_fact: false,
                    countBanners: 0,
                }
                // const EspeciallyForYou_Content = EspeciallyForYou.querySelector('div.shimmer')
                // simple-popup dist-overlay__popup simple-popup_direction_center simple-popup_theme_modal simple-popup_autoclosable_yes simple-popup_overlay_yes simple-popup_has-close_yes simple-popup_delay-close_yes simple-popup_overlay-color_default simple-popup_shown_true simple-popup_delay-close-shown_yes
                // simple-popup__content

                // Удаление без наблюдения
                // перенос всей рекламы в специальный фрейм "Специально для Вас..."
                // const headline__personal = document.querySelector('div.headline__personal')
                let targetNode
                // курсы валют и нефти (сделать опциональным)
                targetNode = document.querySelector('section.informers3__stocks')
                // targetNode?.remove()
                if (targetNode) {
                    targetNode.style.marginTop = '0.3rem'
                    // EspeciallyForYou?.appendChild(targetNode)
                    AdvDetails.Details.appendChild(targetNode)
                    AdvDetails.countBanners++
                }

                targetNode = document.querySelector(config.nodes.ya_ru_banner_under_search)
                // targetNode?.remove()
                if (targetNode) {
                    AdvDetails.Details?.appendChild(targetNode)
                    AdvDetails.countBanners++
                }

                // модальное окно посредине в начале "Сделайте Яндекс главной страницей"
                targetNode = document.querySelector('div.simple-popup') ||
                    document.querySelector('div.dist-overlay__popup') ||
                    document.querySelector('div.simple-popup_direction_center') ||
                    document.querySelector('div.simple-popup_theme_modal') ||
                    document.querySelector('div.simple-popup_autoclosable_yes') ||
                    document.querySelector('div.simple-popup_overlay_yes') ||
                    document.querySelector('div.simple-popup_has-close_yes') ||
                    document.querySelector('div.simple-popup_delay-close_yes') ||
                    document.querySelector('div.simple-popup_overlay-color_default') ||
                    document.querySelector('div.simple-popup_shown_true') ||
                    document.querySelector('div.simple-popup_delay-close-shown_yes')
                if (targetNode) {
                    targetNode.style.marginTop = '0.3rem'
                    AdvDetails.Details.appendChild(targetNode)
                    AdvDetails.countBanners++
                    targetNode.remove()
                }


                const dist_stripe = document.querySelector("div.dist-stripe")
                // dist_stripe?.parentNode.remove()
                if (targetNode) {
                    AdvDetails.Details.appendChild(targetNode)
                    AdvDetails.countBanners++
                }

                const mainElement = document.querySelector('main.body__wrapper');
                if (mainElement) {
                    const targetNode = mainElement.querySelector('div[data-hydration-id] > div.dist-stripe');
                    if (targetNode) {
                        AdvDetails.Details.appendChild(targetNode.parentNode)
                        AdvDetails.countBanners++
                    }
                }

                // Добавление EspeciallyForYou под блок поля поиска
                if (AdvDetails.countBanners > 0) {
                    const ForEspeciallyForYou_Container = document.querySelector('div.body__content')
                    if (ForEspeciallyForYou_Container && AdvDetails.Details.parentNode !== ForEspeciallyForYou_Container) {
                        AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама') + ' (' + AdvDetails.countBanners + ')'
                        ForEspeciallyForYou_Container.appendChild(AdvDetails.Details)
                    }
                }
                // Удаление с наблюдением
                function AD_remove_node(node, mutation_test) {
                    // Кнопка "Установить Яндекс.браузер"
                    let targetNode = document.querySelector('div.link-bro')
                    if (targetNode && targetNode.parentNode !== AdvDetails.Details) {
                        if (AdvDetails.Details.querySelector('div.link-bro')) {
                            targetNode?.remove()
                            // AdvDetails.countBanners--
                        }
                        else {
                            targetNode.style.position = 'unset'
                            targetNode.style.marginTop = '0.3rem'
                            const targetNodeA = targetNode.querySelector('a')
                            if (targetNodeA) targetNodeA.style.marginBottom = 0
                            AdvDetails.Details.appendChild(targetNode)
                            AdvDetails.countBanners++
                            AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама') + ' (' + AdvDetails.countBanners + ')'
                        }
                    }

                    // модальное окно посредине в начале "Сделайте Яндекс главной страницей"
                    targetNode = document.querySelector('div.simple-popup') ||
                        document.querySelector('div.dist-overlay__popup') ||
                        document.querySelector('div.simple-popup_direction_center') ||
                        document.querySelector('div.simple-popup_theme_modal') ||
                        document.querySelector('div.simple-popup_autoclosable_yes') ||
                        document.querySelector('div.simple-popup_overlay_yes') ||
                        document.querySelector('div.simple-popup_has-close_yes') ||
                        document.querySelector('div.simple-popup_delay-close_yes') ||
                        document.querySelector('div.simple-popup_overlay-color_default') ||
                        document.querySelector('div.simple-popup_shown_true') ||
                        document.querySelector('div.simple-popup_delay-close-shown_yes')
                    if (targetNode) {
                        targetNode.style.marginTop = '0.3rem'
                        AdvDetails.Details.appendChild(targetNode)
                        AdvDetails.countBanners++
                        AdvDetails.Details.querySelector('summary').textContent = messageSpecialOffer('Реклама') + ' (' + AdvDetails.countBanners + ')'
                    }

                }
                function AD_remove() {
                    const targetNode = document.querySelector('div.search3__inner') // более точный блок для наблюдения изменений
                    if (targetNode) {
                        clearInterval(interval_AD_remove)
                        AD_remove_node()
                        const observer = new MutationObserver((mutationsList, observer) => {
                            for (let mutation of mutationsList) {
                                if (mutation.type === 'childList') {
                                    mutation.addedNodes.forEach(node => {
                                        if (node.nodeName === 'DIV') {
                                            AD_remove_node(node, mutation)
                                        }
                                    });
                                }
                            }
                        });
                        observer.observe(targetNode, observer_config)
                        observers.push(observer)
                    }
                }

                AD_remove()
                const interval_AD_remove = setInterval(AD_remove, 500)

                }
            else {
                document.querySelector('div.dialog__wrapper')?.remove()
            }


        }
        // каталог игр
        // Изменено: 2025-04-12 13:47, Автор:
        else if (YANDEX_games_collection_ON && currentURL.startsWith('https://yandex.ru/games/') && !currentURL.startsWith('https://yandex.ru/games/app/')) {
            // реклама в каталоге игр
            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    document.querySelectorAll('div.page__page.main-page > div#feeds > div.adaptive-width').forEach(node => {
                        const nodeDiv = node.querySelector('div')
                        // Проверяем, является ли элемент div и не содержит ли он указанные классы
                        if (nodeDiv &&
                            !nodeDiv.classList.contains('feed_block_suggested') &&
                            !nodeDiv.classList.contains('feed_block_categorized'))
                        {
                            node?.remove()
                        }
                    });
                    document.querySelectorAll('div[data-testid="feed-grid-banner"]').forEach(node => {node?.remove()})
                    // найти все li, принадлежащие классу, название которого начинается с grid-list__ и заканчивается на _adv
                    const listItems = Array.from(document.querySelectorAll('li[class]')).filter(li => {
                        return Array.from(li.classList).some(className =>
                                                             /^grid-list__.*_adv$/.test(className)
                                                            );
                    });
                    // Скрываем найденные элементы
                    listItems.forEach(li => {
                        li.style.display = 'none';
                        console.log('Скрыт элемент:', li);
                    });

                    // Мобильная версия
                    if (!isDesktop) {
                        // Приглашение установить приложение (на весь экран)
                        const iframes = document.querySelectorAll('iframe')
                        // Перебираем все iframe элементы
                        for (let iframe of iframes) {
                            // Проверяем, есть ли атрибут scrolling со значением "no"
                            if (iframe.getAttribute('scrolling') === 'no') {
                                iframe.remove()
                            }
                        }

                        document.querySelectorAll('div.feed_block_monetization').forEach(node => {node?.remove()})
                        document.querySelectorAll('div[class$="-group"]').forEach(node => {node?.remove()})
                    }
                }
                // после включения обсервера
                else {
                    // Десктопная версия
                    if (isDesktop) {
                        if (node.nodeName === 'DIV' && node.className === 'adaptive-width') {
                            const nodeDiv = node.querySelector('div')
                            // Проверяем, является ли элемент div и не содержит ли он указанные классы
                            if (nodeDiv &&
                                !nodeDiv.classList.contains('feed_block_suggested') &&
                                !nodeDiv.classList.contains('feed_block_categorized')) {
                                node?.remove()
                            }
                        }
                        else if (node.nodeName === 'LI') {
                            if (node.matches('li.grid-list__game-item_adv')) {
                                // document.querySelectorAll('div[data-testid="feed-grid-banner"]')?.forEach(node => {
                                //     node.remove()
                                // });
                                node?.remove()
                            }
                            // принадлежащие классу, название которого начинается с grid-list__ и заканчивается на _adv
                            else if (Array.from(node.classList).some(className =>
                                                                     /^grid-list__.*_adv$/.test(className)
                                                                    )) {
                                node?.remove()
                            }
                        }
                        // Проверяем вложенные элементы
                        else {


                        }
                    }
                    // Мобильная версия
                    else {
                        if (node.nodeName === 'DIV' && node.className === 'feed_block_monetization') {
                            node?.remove()
                        }
                        else if (node.nodeName === 'DIV' && node.className.endsWith('-group')) {
                            node?.remove()
                        }
                        // Проверяем вложенные элементы
                        else {
                            if (node.nodeName === 'DIV') {
                                node.querySelectorAll('div.feed_block_monetization').forEach(node => {node?.remove()})
                                node.querySelectorAll('div[class$="-group"]').forEach(node => {node?.remove()})
                            }
                        }
                    }
                }
            }

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            Удаление_рекламы(node)
                        })
                    }
                }
            })
            // observer.observe(document.querySelector('div.page__right'), observer_config)
            observer.observe(document.body, observer_config)
            observers.push(observer)
            Удаление_рекламы()

        }

        // на странице игры
        // Изменено: 2025-05-21 20:47, Автор:
        else if (YANDEX_games_app_ON && currentURL.startsWith('https://yandex.ru/games/app/')) {

            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    // центральный баннер: использвется в играх для наград - заменить на отключение только изображения внутри
                    if (YANDEX_игры_app_AD_центральный_ВКЛ) {
                        const Реклама_в_центральном_баннере = document.querySelector('div.prowo__inner')
                        if (Реклама_в_центральном_баннере)
                            Реклама_в_центральном_баннере.style.display = 'none'
                        // центральный баннер: кнопка закрытия
                        const Вложенная_нода = document.querySelector('span[data-testid="YandexFullscreenRender-Button"]')
                        if (Вложенная_нода) {
                            // stop
                            // Вложенная_нода.click() // вызывает глюк запуска игры
                            Центральный_баннер__Наблюдение_за_изменяемым_родителем(Вложенная_нода)

                        }

//                         document.querySelectorAll("div[id]").forEach(div => {
//                             // Проверяем, есть ли класс, начинающийся с 'play-yandex-'
//                             let hasClass = Array.from(div.classList).some(cls => cls.startsWith('play-yandex-'));
//                             if (hasClass) {
//                                 // Скрываем текущий div
//                                 div.style.display = 'none';

//                                 // Находим родителя с классом play-modal__inner
//                                 const parent = div.closest('.play-modal__inner');
//                                 if (parent) {
//                                     // Устанавливаем границу
//                                     parent.style.borderStyle = 'solid';
//                                     parent.style.borderWidth = '1px';
//                                 }
//                             }
//                         });

                    }
                    // правый блок рекламы
                    if (YANDEX_игры_app_AD_правый_ВКЛ) {
                        // устарело. Пока оставлено.
                        // const targetStackDivs = document.querySelectorAll('div.stack > div')
                        // targetStackDivs?.forEach(node => {
                        //     // Проверяем, заканчивается ли класс на __desktop-disable-ad-button-wrapper
                        //     node.classList.forEach(className => {
                        //         if (className.endsWith('__desktop-disable-ad-button-wrapper')) {
                        //             node.parentNode.remove();
                        //         }
                        //     });
                        // });
                        const Правый_блок = document.querySelector('div[class*="desktop-wrapper"]') || document.querySelector('div.sticky-banner-container' || document.querySelector('div[class*="desktop-wrapper_with-disable]'))
                        if (Правый_блок)
                            Правый_блок.style.display = 'none'
                        // кнопка "Отключить рекламу"
                        const кнопка_ОтключитьРекламу = document.querySelector('button[data-testid="DisableAd-Button"]')
                        if (кнопка_ОтключитьРекламу)
                            кнопка_ОтключитьРекламу.parentNode.parentNode.style.display = 'none'
                    }
                    // ротационный баннер
                    const targetNode_RotateBanner = document.querySelector('div.rotate-banner')
                    if (targetNode_RotateBanner)
                        targetNode_RotateBanner.style.display = 'none'

                    // нижний ряд других игр
                    if (YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ)
                        document.querySelector('div.play-similar-games > span.close-button')?.click()

                }
                // после включения обсервера
                else {
                    if (node.nodeName === 'DIV') {
                        // правый блок рекламы
                        if (YANDEX_игры_app_AD_правый_ВКЛ &&
                            (node.matches('div[class*="desktop-wrapper"]') || node.matches('div[class*="sticky-banner-container"]') || node.matches('div[class*="desktop-wrapper_with-disable]'))
                           ) {
                            node.style.display = 'none'
                            // кнопка "Отключить рекламу"
                            const кнопка_ОтключитьРекламу = document.querySelector('button[data-testid="DisableAd-Button"]')
                            if (кнопка_ОтключитьРекламу)
                                кнопка_ОтключитьРекламу.parentNode.parentNode.style.display = 'none'
                        }
                        // нижний ряд других игр
                        else if (YANDEX_игры_app_AD_нижний_ряд_других_игр_ВКЛ && node.matches('div.play-similar-games')) {
                            node.querySelector('div.play-similar-games__all-games-tile > span.close-button')?.click() // клик по кнопке закрытия
                            node?.remove()
                        }
                        // центральный баннер
                        // else if (node.matches('div.play-modal_with-blur')) {
                        //     node.parentNode.style.display = 'none'
                        //     // node?.remove()
                        // }
                        else if (YANDEX_игры_app_AD_центральный_ВКЛ && node.matches('div.prowo__inner')) {
                            node.style.display = 'none'
                        }
                        else if (YANDEX_игры_app_AD_центральный_ВКЛ && node.matches('span[data-testid="YandexFullscreenRender-Button"]')) {
                            Центральный_баннер__Наблюдение_за_изменяемым_родителем(node)
                        }
                        else if (YANDEX_игры_app_AD_центральный_ВКЛ && node.nodeName === 'DIV' && node.id) {
                            // Проверяем, есть ли id и класс, начинающийся с 'play-yandex-'
                            const hasClass = Array.from(node.classList).some(cls => cls.startsWith('play-yandex-'));
                            if (node.id && hasClass) {
                                // Скрываем элемент
                                node.style.display = 'none';

                                // Находим родителя с классом play-modal__inner
                                const parent = node.closest('.play-modal__inner');
                                if (parent) {
                                    // Устанавливаем границу
                                    parent.style.borderStyle = 'solid';
                                    parent.style.borderWidth = '1px';
                                }
                            }
                        }
                        // Проверяем вложенные элементы
                        else {
                            let Вложенная_нода
                            // центральный баннер
                            if (YANDEX_игры_app_AD_центральный_ВКЛ) {
                                Вложенная_нода = node.querySelector('div.prowo__inner')
                                if (Вложенная_нода) {
                                    Вложенная_нода.style.display = 'none'
                                }
                                // кнопка закрытия
                                Вложенная_нода = node.querySelector('span[data-testid="YandexFullscreenRender-Button"]')
                                if (Вложенная_нода) {
                                    // stop
                                    // Вложенная_нода.click() // вызывает глюк запуска игры
                                    Центральный_баннер__Наблюдение_за_изменяемым_родителем(Вложенная_нода)

                                }

                                node.querySelectorAll("div[id]").forEach(div => {
                                    // Проверяем, есть ли класс, начинающийся с 'play-yandex-'
                                    let hasClass = Array.from(div.classList).some(cls => cls.startsWith('play-yandex-'));
                                    if (hasClass) {
                                        // Скрываем текущий div
                                        div.style.display = 'none';

                                        // Находим родителя с классом play-modal__inner
                                        const parent = div.closest('.play-modal__inner') || div.closest('.prowo');
                                        if (parent) {
                                            // Устанавливаем границу
                                            parent.style.borderStyle = 'solid';
                                            parent.style.borderWidth = '1px';
                                        }
                                    }
                                });

                            }
                        }

                    }

                }

                function Центральный_баннер__Наблюдение_за_изменяемым_родителем(Вложенная_нода) {
                    const Наблюдаемый_родитель = Вложенная_нода.closest('.play-modal, .play-modal_yandex');
                    if (Наблюдаемый_родитель) {
                        if (Наблюдаемый_родитель.classList.contains('play-yandex-modal_visible') ||
                            Наблюдаемый_родитель.classList.contains('play-modal_visible')) {
                            Вложенная_нода.click()
                        }
                        // Создаем наблюдатель за изменениями
                        const observer = new MutationObserver((mutations) => {
                            // Проверяем наличие нужных классов после изменения
                            if (Наблюдаемый_родитель.classList.contains('play-yandex-modal_visible') ||
                                Наблюдаемый_родитель.classList.contains('play-modal_visible')) {
                                // Наблюдатель не отключаем так как рекламный блок вновь появляется на экране с теми же изменениями
                                // observer.disconnect()
                                Вложенная_нода.click() // клик по кнопке закрытия
                            }
                        });

                        // Настраиваем и запускаем наблюдение за изменениями класса
                        observer.observe(Наблюдаемый_родитель, {
                            attributes: true,
                            attributeFilter: ['class']
                        });

                    }

                }
            }

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            Удаление_рекламы(node)
                        });

                    }
                }
            });
            // observer.observe(document.getElementById('mount'), observer_config)
            observer.observe(document.body, observer_config)
            observers.push(observer)
            Удаление_рекламы()

        }

        // Яндекс: почтовый ящик
        // Изменено: 2025-014-12 12:57, Автор:
        else if (YANDEX_email_ON && currentURL.startsWith('https://mail.yandex.ru/')) {
            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    // реклама справа от списка писем
                    document.querySelector('.js-scroller-right')?.remove()
                    // реклама над списком писем
                    document.getElementById('js-messages-direct')?.remove()
                    Удаление_рекламы__Над_списком_писем()

                    if (currentURL.startsWith('https://mail.yandex.ru/lite/')) {
                        // реклама над списком писем
                        document.querySelector('div[class*="direct-stripe"]')?.remove()
                    }

                    Удаление_рекламы__Справа_от_списка_писем()

                    // баннер-стикер с предложением купить диск
                    document.querySelector('div[data-popper-placement="bottom"]')?.remove()
                    // модальное окно с предожением купить диск
                    document.querySelector('div.Modal-Content')?.remove()

                }
                // после включения обсервера
                else {
                    // Проверяем добавленный элемент
                    if (node.matches('div.js-scroller-right') || node.id === 'js-messages-direct') {
                        node.remove()
                    }
                    // модальное окно с предожением купить диск
                    else if (node.matches('div.Modal-Content')) {
                        node.remove()
                    }
                    // предложение что-то приобрести на весь экран
                    else if ((node instanceof HTMLDivElement) && (node.getAttribute('data-test-id') === 'promofullscreen')) {
                        node.remove()
                    }
                    else if ((node instanceof HTMLDivElement) && (node.getAttribute('data-popper-placement') === 'bottom')) {
                        node.remove()
                    }
                    else {
                        // Удаление_рекламы__Над_списком_писем (node)
                        // Проверяем вложенные элементы
                        let Вложенный_элемент
                        // реклама справа от списка писем
                        Вложенный_элемент = node.querySelector('div.js-scroller-right')
                        if (Вложенный_элемент) {
                            Вложенный_элемент.remove()
                        }
                        // реклама над списком писем
                        Вложенный_элемент = node.querySelector('#js-messages-direct')
                        if (Вложенный_элемент) {
                            Вложенный_элемент.remove()
                        }
                        // модальное окно с предожением купить диск
                        Вложенный_элемент = node.querySelector('div.Modal-Content')
                        if (Вложенный_элемент) {
                            // не диалоги - например, создания папок
                            if (!Вложенный_элемент.matches('[role="dialog"]')) {
                                Вложенный_элемент.remove()
                            }
                        }
                        Вложенный_элемент = node.querySelector('div[data-test-id="promofullscreen"]')
                        if (Вложенный_элемент) {
                            Вложенный_элемент.remove()
                        }
                        Вложенный_элемент = node.querySelector('div[data-popper-placement="bottom"]')
                        if (Вложенный_элемент) {
                            Вложенный_элемент.remove()
                        }
                        Удаление_рекламы__Над_списком_писем (Вложенный_элемент)
                        Удаление_рекламы__Справа_от_списка_писем(Вложенный_элемент)


                    }
                    if (currentURL.startsWith('https://mail.yandex.ru/lite/')) {
                        // реклама над списком писем
                        // Функция для проверки, принадлежит ли элемент классу, содержащему фрагмент 'direct-stripe'
                        function hasDirectStripeClass(node) {
                            if (node && node.classList) {
                                return Array.from(node.classList).some(className => className.includes('direct-stripe'));
                            }
                            return false;
                        }
                        if (hasDirectStripeClass(node)) {
                            node.remove()
                        }
                        else {
                            node.querySelector('div[class*="direct-stripe"]')?.remove()
                        }
                    }
                }

                function Удаление_рекламы__Над_списком_писем(node){
                    let startElement
                    if (!node) {
                        startElement = document.querySelector('div.message-list-banner-portal');
                    } else {
                        // проверка что node является интересующим элеентом
                        const isCorrectElement =
                              node.tagName === 'DIV' &&
                              node.classList.contains('message-list-banner-portal');

                        if (!isCorrectElement) {
                            startElement = node
                        }
                    }
                    if (startElement) {
                        // Находим следующий элемент после startElement
                        let nextElement = startElement.nextElementSibling;

                        // Проверяем, существует ли следующий элемент и соответствует ли он условию
                        if (nextElement && !nextElement.className.startsWith('styles__root--')) {
                            // Делаем элемент невидимым
                            nextElement.style.display = 'none';
                        }
                    }


                }
                function Удаление_рекламы__Справа_от_списка_писем(node){
                    let startElement
                    if (!node) {
                        startElement = document.querySelector('div[class^="PageLayout-m__main"]');
                    } else {
                        // проверка что node является интересующим элеентом
                        const isCorrectElement =
                              node.tagName === 'DIV' &&
                              Array.from(node.classList).some(className =>
                                                              className.startsWith('PageLayout-m__main-')
                                                             )

                        if (!isCorrectElement) {
                            startElement = node
                        }
                    }
                    if (startElement) {
                        // Находим следующий элемент после startElement
                        let nextElement = startElement.nextElementSibling;

                        // Проверяем, существует ли следующий элемент и соответствует ли он условию
                        if (nextElement && !nextElement.className.startsWith('styles__root--')) {
                            // Делаем элемент невидимым
                            nextElement.style.display = 'none';
                        }
                    }


                }
            }

            Удаление_рекламы()
            const интервал__Удаление_рекламы = setInterval(Удаление_рекламы, 500)

            const callback = function (mutationsList, observer) {
                clearInterval(интервал__Удаление_рекламы) // На смену приходит обсервер
                for (const mutation of mutationsList) {
                    // Проверяем, были ли добавлены новые узлы
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                Удаление_рекламы(node)
                            }
                        })
                    }
                }
            }

            const observer = new MutationObserver(callback)
            observers.push(observer)

            // Начинаем наблюдение за изменениями в DOM
            observer.observe(document.body, {
                childList: true, // Отслеживать добавление/удаление дочерних элементов
                subtree: true,   // Отслеживать изменения во всем поддереве
            })
        }
        // Яндекс: диск
        // Изменено: 2025-01-29 22:01, Автор:
        else if (YANDEX_disk_ON && currentURL.startsWith('https://disk.yandex.ru/')) {
            // реклама внизу слева

            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    // реклама вверху
                    document.querySelector('div.top-direct-line')?.remove()
                }
                // после включения обсервера
                else {
                    // Проверяем добавленный элемент
                    // реклама вверху
                    if (node.matches('div.top-direct-line')) {
                        node.remove()
                    }
                    // реклама диска бОьшего объёма
                    else if (node.matches('div.Modal-Content')) {
                        node.remove()
                    }
                    // Проверяем вложенные элементы
                    else {
                        let Вложенный_элемент
                        // реклама вверху
                        Вложенный_элемент = node.querySelector('div.top-direct-line')
                        if (Вложенный_элемент) {
                            Вложенный_элемент.remove()
                        }
                        Вложенный_элемент = node.querySelector('div.Modal-Content')
                        if (Вложенный_элемент) {
                            // Вложенный_элемент.remove()
                        }
                    }

                }
            }

            Удаление_рекламы()
            const интервал__Удаление_рекламы = setInterval(Удаление_рекламы, 500)

            const callback = function (mutationsList, observer) {
                clearInterval(интервал__Удаление_рекламы) // На смену приходит обсервер
                for (const mutation of mutationsList) {
                    // Проверяем, были ли добавлены новые узлы
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                Удаление_рекламы(node)
                            }
                        })
                    }
                }
            }

            const observer = new MutationObserver(callback)
            observers.push(observer)

            // Начинаем наблюдение за изменениями в DOM
            observer.observe(document.body, {
                childList: true, // Отслеживать добавление/удаление дочерних элементов
                subtree: true,   // Отслеживать изменения во всем поддереве
            })
        }
        // Яндекс: карты
        else if (YANDEX_maps_ON && currentURL.startsWith('https://yandex.ru/maps/')) {
            // реклама справа
            function AD_remove_first() {
                // реклама справа
                const RightBlockFromImages = document.querySelector('div[data-chunk="promo"]')
                if (RightBlockFromImages) RightBlockFromImages.parentNode.parentNode.parentNode.remove()
                // реклама слева
                const LeftBlock = document.querySelector('div.banner-view')
                if (LeftBlock) LeftBlock.parentNode.parentNode.parentNode.remove()
                // маленькая рекламная кнопка сверху
                const TopBlock = document.querySelector('div.map-controls__additional-button')
                if (TopBlock) TopBlock.parentNode.remove()
                const LeftBlockFromPlaces = document.querySelector('div.banner-view')
                if (LeftBlockFromPlaces) LeftBlockFromPlaces.parentNode.remove()
            }
            // требует донастройки
            function AD_remove() {
                // const targetNode = document.querySelector('div._has-banner') // более глобальный блок
                const targetNode = document.querySelector('div.banner-view') // более точный блок
                if (targetNode) {
                    clearInterval(interval_AD_remove)
                    AD_remove_first()
                    const observer = new MutationObserver((mutationsList, observer) => {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeName === 'DIV') {
                                        AD_remove_first()
                                    }
                                });
                            }
                        }
                    });
                    observer.observe(targetNode, observer_config)
                    observers.push(observer)
                }
            }
            const interval_AD_remove = setInterval(AD_remove, 500);
        }
        // https://yandex.ru/health
        else if (YANDEX_health_ON && currentURL.startsWith('https://yandex.ru/health')) {

            function AD_remove_node(node, mutation_test) {
                let targetNode
                let targetNodes

                // баннер сверху
                // реклама по всем направлениям
                targetNodes = document.querySelectorAll('div.advert_type_horizontal')
                targetNodes.forEach(node => {
                    node.remove()
                })
                targetNodes = document.querySelectorAll('span.advert_type_horizontal')
                targetNodes.forEach(node => {
                    node.remove()
                })

                // правый стобец
                targetNode = document.querySelector('div.row__col.layout__right')
                targetNode?.remove()

            }
            // Удаление с наблюдением
            function AD_remove() {
                AD_remove_node()
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeName === 'DIV') {
                                    AD_remove_node(node, mutation)
                                }
                            });
                        }
                    }
                });
                observer.observe(document.body, observer_config)
                observers.push(observer)
            }
            AD_remove()
        }
        // Яндекс.погода: карта
        // Изменено: 2025-02-24 06:16, Автор:
        else if (YANDEX_погода_ON && currentURL.startsWith('https://yandex.ru/pogoda/ru-RU/maps/')) {
            // внизу справа "Сделать поиск Яндекса основным?"
            // yandex_dzen_questionYandexGeneralSearch()

            // реклама слева
            const links = Array.from(document.querySelectorAll('a[href^="/pogoda/"]'));
            const targetLink = links.find(link => link.textContent.trim() === "Подробный прогноз");

            if (targetLink) {
                const nextDiv = targetLink.nextElementSibling;

                if (nextDiv && nextDiv.tagName === 'DIV') {
                    nextDiv.remove();
                }
            }


        }
        // Яндекс.погода: на месяц
        // Изменено: 2025-02-24 06:16, Автор:
        else if (YANDEX_погода_ON && currentURL.startsWith('https://yandex.ru/pogoda/month')) {
            // внизу справа "Сделать поиск Яндекса основным?"
            // yandex_dzen_questionYandexGeneralSearch()

            // реклама справа
            // Находим все элементы, у которых хотя бы один класс содержит 'adv'
            document.querySelectorAll('[class*="adv"]').forEach(element => {
                element.remove();
            });

        }
        // Яндекс.погода: на 10 дней
        // Изменено: 2025-02-24 18:16, Автор:
        else if (YANDEX_погода_ON && currentURL.startsWith('https://yandex.ru/pogoda?lat=')) {


            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {

                    // внизу справа "Сделать поиск Яндекса основным?"
                    // yandex_dzen_questionYandexGeneralSearch()

                    // реклама справа
                    document.querySelector('#content_right')?.remove();

                    // TODO

                    РекламаМеждуДнями()

                    document.querySelectorAll('article.card_without-card-decoration').forEach(node => {node?.remove()})

                }
                // после включения обсервера
                else {
                    // Десктопная версия
                    if (isDesktop) {
                        if (node.nodeName === 'article' && node.classList.contains('card_without-card-decoration') ) {
                            node?.remove()
                        }
                        else if (node.nodeName === 'div' && node.classList.contains('app-promo-button__content') ) {
                            node?.remove()
                        }
                        else if (node.nodeName === 'div' && node.classList.contains('app-promo-button') ) {
                            РекламаМеждуДнями()
                        }
                        // Проверяем вложенные элементы
                        else if (node.nodeType === 1) {
                            let Вложенный_элемент

                            // реклама между днями
                            node.querySelectorAll('article.card_without-card-decoration').forEach(node => {node?.remove()})
                            Вложенный_элемент = node.querySelector('div.app-promo-button')
                            if(Вложенный_элемент)
                                РекламаМеждуДнями()
                            Вложенный_элемент = node.querySelector('div.adbanner')
                            if(Вложенный_элемент)
                                РекламаМеждуДнями()
                        }
                        РекламаМеждуДнями()
                    }
                }
            }

            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            Удаление_рекламы(node)
                        })
                    }
                }
            })
            // observer.observe(document.querySelector('div.page__right'), observer_config)
            observer.observe(document.body, observer_config)
            observers.push(observer)
            Удаление_рекламы()

            // реклама между днями
            function РекламаМеждуДнями() {
                // Находим все элементы на странице
                const allElements = Array.from(document.querySelectorAll('*'));

                // Ищем индекс элемента с классом app-promo-button
                const startIndex = allElements.findIndex(el => el.classList && el.classList.contains('app-promo-button'));

                // Ищем индекс элемента, содержащего -segment_js_inited в названии класса
                const endIndex = allElements.findIndex(el => el.classList && [...el.classList].some(cls => cls.includes('-segment_js_inited')));

                // Если оба элемента найдены и startIndex < endIndex
                if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                    // Фильтруем элементы между startIndex и endIndex
                    const elementsBetween = allElements.slice(startIndex + 1, endIndex);

                    // Находим первый div среди элементов между ними
                    const targetDiv = elementsBetween.find(el => el.tagName === 'DIV');
                    targetDiv?.remove()

                }
            }


        }
        // Дзен.погода: карта
        else if (DZEN_pogoda_maps_ON && currentURL.startsWith('https://dzen.ru/pogoda/maps/')) {
            // внизу справа "Сделать поиск Яндекса основным?"
            yandex_dzen_questionYandexGeneralSearch()

            // реклама слева
            const targetNode_leftColumn = document.querySelector('div.weather-maps__ad.weather-maps__ad_visible_yes.map-left-pane__ad')
            if (targetNode_leftColumn) {
                targetNode_leftColumn.remove()
            }

        }
        // Яндекс.погода: сводка
        else if (DZEN_pogoda_details_ON && (currentURL.startsWith('https://dzen.ru/pogoda/?via=hl') || currentURL.startsWith('https://dzen.ru/pogoda/details') || currentURL.startsWith('https://dzen.ru/pogoda/?'))) {

            // реклама справа
            const targetNode_rightColumn = document.querySelector('div#content_right.content__right')
            if (targetNode_rightColumn) {
                targetNode_rightColumn.remove()
            }

            // реклама в теле страницы
            // первый блок
            const DivsTopAD = document.querySelector('div.adv_pos_index-details_top');
            if (DivsTopAD) {
                DivsTopAD.parentNode.remove()
            }
            // последующие блоки
            // Выбираем все div
            const allDivs = document.querySelectorAll('article.card.card_without-card-decoration');
            allDivs.forEach(div => {
                div.remove();
            });
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // console.log('Новые узлы добавлены:', mutation.addedNodes);
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'STYLE') {
                                const allDivs = document.querySelectorAll('article.card.card_without-card-decoration');
                                allDivs.forEach(div => {
                                    div.remove();
                                });
                            }
                        });

                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)

            yandex_dzen_questionYandexGeneralSearch()

        }
        // Яндекс.погода: на месяц
        else if (DZEN_pogoda_month_ON && currentURL.startsWith('https://dzen.ru/pogoda/month')) {

            // реклама справа страницы
            let targetNode_rightColumn
            targetNode_rightColumn = document.querySelector('section.content__section.content__section_type_adv')
            if (targetNode_rightColumn) {
                targetNode_rightColumn.remove()
            }
            targetNode_rightColumn = document.querySelector('div.climate-calendar-container__adv-wide')
            if (targetNode_rightColumn) {
                targetNode_rightColumn.remove()
            }
        }
        // Дзен.Статьи
        else if (DZEN_articles_ON && currentURL.startsWith('https://dzen.ru/a/')) {
            let targetNode_observer
            function AD_remove_node(node, mutation_test) {
                // верхний баннер
                targetNode_observer.querySelector('div#top-banner')?.remove()
                const targetNodes = targetNode_observer.querySelectorAll('aside:not(.navigation-sidebar__container-TO)') ||
                      targetNode_observer.querySelectorAll('ya-recommendation-widget')
                targetNodes.forEach(node => {
                    node?.remove()
                })
                // рекламные блоки справа
                // 'div.article-right-ad-block__sticky' 'div.article-right-ad-block__main' 'div.article-right-ad-block__ad-content-wrapper'
                targetNode_observer.querySelectorAll('div[class^="article-right-ad-block__"]').forEach(node => {
                    node?.remove()
                })
                // рекламные блоки снизу статьи
                if (node) {
                    targetNode_observer.querySelectorAll('div[class^="ad-split-embed"][id]').forEach(node => {
                        // ad-split-embed__container
                        node?.remove()
                    })
                }
            }
            function AD_remove() {
                document.querySelectorAll('div.content--article-item__sideColumn-3P').forEach(node => {node.remove()})
                targetNode_observer = document.querySelector('div#page-root') // более точный блок для наблюдения изменений
                if (targetNode_observer) {
                    clearInterval(interval_AD_remove)
                    AD_remove_node()
                    const observer = new MutationObserver((mutationsList, observer) => {
                        for (let mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeName === 'DIV') {
                                        AD_remove_node(node, mutation)
                                    }
                                });
                            }
                        }
                    });
                    observer.observe(targetNode_observer, observer_config)
                    observers.push(observer)
                }
            }
            const interval_AD_remove = setInterval(AD_remove, 500)

            }
        // Дзен.Видео
        else if (DZEN_video_ON && currentURL.startsWith('https://dzen.ru/video/')) {
            function AD_remove_node(node, mutation_test) {
                // document.querySelectorAll('div[class^="video-card-ad"]').forEach(node => {
                document.querySelectorAll('div.video-card-ads').forEach(node => {
                    node?.remove()
                })
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                AD_remove_node(node, mutation)
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()

            // Удаление видеорекламы
            if (currentURL.startsWith('https://dzen.ru/video/watch/')) {
                function ADvideo_remove() {
                    // Находим ноду <yaplayertag>
                    const yaplayertag = document.querySelector('yaplayertag')
                    if (yaplayertag) {
                        // Проверяем непосредственные потомки yaplayertag
                        const children = yaplayertag.children
                        if (children.length > 2) { // дочерние элементы заполняются на странице не сразу - ждём заполнения
                            clearInterval(interval_ADvideo_remove)
                            // Создаем массив для хранения div, которые нужно удалить
                            const divsToRemove = [];

                            for (let i = 0; i < children.length; i++) {
                                const child = children[i];
                                if (child.tagName === 'DIV' && !child.querySelector('video')) {
                                    divsToRemove.push(child);
                                }
                            }

                            // Удаляем все найденные div
                            divsToRemove.forEach(div => yaplayertag.removeChild(div))
                        }
                    }
                }
                const interval_ADvideo_remove = setInterval(ADvideo_remove, 500)
                }
        }
        // Дзен.Shorts
        else if (DZEN_shorts_ON && currentURL.startsWith('https://dzen.ru/shorts/')) {
            function AD_remove_node(node, mutation_test) {
                // банерок вверху справа
                // возможно, для более точноо поиска: auto-slide-ad__ ; более общий правый блок: short-viewer-layout__
                if (!node) { // первый вызов без обсервера
                    // document.querySelectorAll('div[class^="short-viewer-layout__rightSidebarWrapper"]').forEach(node => {
                    //     node?.remove()
                    // })
                    // возникает в единственном экземпляре
                    document.querySelector('div[class^="short-viewer-layout__rightSidebarWrapper"]')?.remove()
                }
                else { // вызов из обсервера
                    if (node.tagName === 'DIV') {
                        const classList = node.classList;
                        // for (let i = 0; i < classList.length; i++) {
                        //     if (classList[i].startsWith('short-viewer-layout__rightSidebarWrapper')) {
                        //         node?.remove()
                        //         break
                        //     }
                        // }
                        if (classList.contains('auto-slide-ad__container-1D')) {
                            node?.remove()
                            return true
                        }
                    }
                }
                // предложение скачат приложение по QR-коду
                document.querySelector('div.Modal')?.remove()

                return false
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                // при срабатывании удаления рекламы отключаетяс наблюдение, так как реклама бльше не появляется
                                // не отключаем наблюдение, так как появляются разные предлагалки. Красивые предлагалки по теме конкретного видео справа от видео не удаляю - такой и должна быть умная реклама
                                // if (AD_remove_node(node, mutation)) observer.disconnect()
                                AD_remove_node(node, mutation)
                            }
                        });
                    }
                }
            });
            observer.observe(document.body, observer_config)
            observers.push(observer)
            AD_remove_node()
        }

        // Дзен: общее
        else if (DZEN_ON && (currentURL.startsWith('https://dzen.ru/') || currentURL.startsWith('https://m.dzen.ru/'))) {
            if (isDesktop) {
                // Добавление кнопки "Реклама"
                const EspeciallyForYou = CreateEspeciallyForYou()
                let targetNode_observer


                function AD_remove_node(node, mutation_test) {
                    let targetNode
                    let targetNodes
                    // курсы валют и нефти (сделать опциональным)
                    targetNode = document.querySelector('div.header-widgets__rates-ii')
                    if (targetNode && targetNode.parentNode !== EspeciallyForYou) {
                        if (EspeciallyForYou.querySelector('div.header-widgets__rates-ii')) {
                            targetNode?.remove()
                        }
                        else {
                            targetNode.style.position = 'unset'
                            targetNode.style.marginTop = '0.3rem'
                            const targetNodeA = targetNode.querySelector('a')
                            if (targetNodeA) targetNodeA.style.marginBottom = 0
                            EspeciallyForYou?.appendChild(targetNode)
                        }
                    }

                    // Кнопка "Установить Яндекс.браузер" под поиском
                    // targetNode = document.querySelector('div#ya-dist-link_bro')
                    // if (targetNode && targetNode.parentNode !== EspeciallyForYou) {
                    //     if (EspeciallyForYou.querySelector('div#ya-dist-link_bro')) {
                    //         // targetNode?.remove()
                    //     }
                    //     else {
                    //         targetNode.style.position = 'unset'
                    //         targetNode.style.marginTop = '0.3rem'
                    //         const targetNodeA = targetNode.querySelector('a')
                    //         if (targetNodeA) targetNodeA.style.marginBottom = 0
                    //         EspeciallyForYou?.appendChild(targetNode)
                    //     }
                    // }

                    // Кнопка "Установить Яндекс.браузер" внизу справа
                    targetNode = document.querySelector('div#ya-dist-teaser')
                    if (targetNode) targetNode?.remove()
                    // баннер сверху
                    targetNodes = document.querySelectorAll('div[data-testid="ad-banner"]')
                    if (targetNodes.length > 0) {
                        const targetNodes_EspeciallyForYou = EspeciallyForYou.querySelectorAll('div[data-testid="ad-banner"]')
                        if (targetNodes_EspeciallyForYou.length > 0) {
                            targetNodes.forEach(node => {
                                if (node.parentNode !== EspeciallyForYou) {
                                    node.remove()
                                }
                            })
                        }
                        else {
                            targetNodes.forEach(node => {
                                node.style.marginTop = '0.3rem'
                                EspeciallyForYou?.appendChild(node)
                            })
                        }
                    }
                    // реклама в видеоблоках
                    document.querySelectorAll('div.zenad-card-rtb__ad').forEach(node => {node?.remove()})
                    // Модальное окно "Яндекс станет основным поиском"
                    document.querySelector('div#ya-dist-splashscreen')?.remove()
                    // Слева вверху "Сделать поиск Яндекса основным?"
                    document.querySelector('div#ya-dist-popup')?.remove()
                    // Добавление EspeciallyForYou под блок поля поиска
                    const ForEspeciallyForYou_Container = document.querySelector('div#banner-view') || document.querySelector('div#LayoutTopMicroRoot')
                    if (ForEspeciallyForYou_Container && EspeciallyForYou.parentNode !== ForEspeciallyForYou_Container) {
                        ForEspeciallyForYou_Container.appendChild(EspeciallyForYou)
                    }

                }

                //
                // Удаление с наблюдением
                function AD_remove() {
                    targetNode_observer = document.querySelector('div#banner-view') || document.querySelector('div#LayoutTopMicroRoot') // более точный блок для наблюдения изменений
                    document.querySelectorAll('div.content--article-item__sideColumn-3P').forEach(node => {node?.remove()})
                    if (targetNode_observer) {
                        clearInterval(interval_AD_remove)
                        AD_remove_node()
                        const observer = new MutationObserver((mutationsList, observer) => {
                            for (let mutation of mutationsList) {
                                if (mutation.type === 'childList') {
                                    mutation.addedNodes.forEach(node => {
                                        if (node.nodeName === 'DIV') {
                                            AD_remove_node(node, mutation)
                                        }
                                    });
                                }
                            }
                        });
                        observer.observe(targetNode_observer, observer_config)
                        observers.push(observer)
                    }
                }
                const interval_AD_remove = setInterval(AD_remove, 500)

                }
            // Мобильная версия
            else {
                // верхний баннер
                document.querySelectorAll('div[class*="dzen-mobile--dzen-mobile__hasBanner"]').forEach(node => {node?.remove()})
                // const observer = new MutationObserver((mutationsList, observer) => {
                //     for (let mutation of mutationsList) {
                //         if (mutation.type === 'childList') {
                //             mutation.addedNodes.forEach(node => {
                //                 if (node.nodeName === 'DIV') {
                //                     document.querySelectorAll('div[class*="dzen-mobile--dzen-mobile__hasBanner"]').forEach(node => {node?.remove()})
                //                 }
                //             })
                //         }
                //     }
                // })
                // observer.observe(document.body, observer_config)
                // observers.push(observer)
            }


            // Изменено: 2025-01-30 20:53, Автор:
            let Блок_коллекции_статей_и_видео = document.querySelector('#LayoutContentMicroRoot')
            if (Блок_коллекции_статей_и_видео)
                наблюдатель__Коллекция_видео__установка(Блок_коллекции_статей_и_видео)

            function Удаление_рекламы(node, mutation_test) {
                // до включения обсервера
                if (!node) {
                    // Реклама в видеоблоках
                    if (Блок_коллекции_статей_и_видео)
                        Блок_коллекции_статей_и_видео.querySelectorAll('div[class*="dzen-desktop--card-rtb__"]').forEach(node => {node?.remove()})
                    else // на всякий случай, но этого не будет
                        document.querySelectorAll('div[class*="dzen-desktop--card-rtb__"]').forEach(node => {node?.remove()})
                }
                // после включения обсервера
                else {
                    // Реклама в видеоблоках
                    // Проверяем добавленный элемент
                    if (node.matches('div[class*="dzen-desktop--card-rtb__"]')) {
                        node.remove()
                    }
                    // Проверяем вложенные элементы
                    else {
                        node.querySelectorAll('div[class*="dzen-desktop--card-rtb__"]').forEach(node => {node?.remove()})
                    }

                }
            }


            function наблюдатель__Коллекция_видео__установка(целевой_элемент) {
                const callback = function (mutationsList, observer) {
                    for (const mutation of mutationsList) {
                        // Проверяем, были ли добавлены новые узлы
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    Удаление_рекламы(node)
                                }
                            })
                        }
                    }
                }

                const наблюдатель__Коллекция_видео = new MutationObserver(callback)
                const config = {
                    childList: true, // Отслеживать добавление/удаление дочерних элементов
                    subtree: true,   // Отслеживать изменения во всем поддереве
                }
                наблюдатель__Коллекция_видео.observe(целевой_элемент, config)
                observers.push(наблюдатель__Коллекция_видео)
                Удаление_рекламы()

            }

            const наблюдатель__Появление_на_странице_нод_для_наблюдения = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Блок коллекции_видео
                                // Проверяем добавленный элемент
                                let целевой_элемент // переменная для всех наблюдаемых нод
                                if (!Блок_коллекции_статей_и_видео) {
                                    if (node.matches('#LayoutContentMicroRoot')) {
                                        Блок_коллекции_статей_и_видео = node
                                        наблюдатель__Коллекция_видео__установка(Блок_коллекции_статей_и_видео)
                                    }
                                    // Проверяем вложенные элементы
                                    else {
                                        целевой_элемент = node.querySelector('#LayoutContentMicroRoot')
                                        if (целевой_элемент) {
                                            Блок_коллекции_статей_и_видео = целевой_элемент
                                            наблюдатель__Коллекция_видео__установка(Блок_коллекции_статей_и_видео)
                                        }
                                    }
                                }
                                if (Блок_коллекции_статей_и_видео) {
                                    наблюдатель__Появление_на_странице_нод_для_наблюдения.disconnect() // сразу прекращаем наблюдение так как других целевых нод пока нет
                                }
                            }
                        })
                    }
                });
            });

            const config = {
                childList: true, // Отслеживать добавление/удаление дочерних элементов
                subtree: true,   // Отслеживать изменения во всем поддереве
            }
            наблюдатель__Появление_на_странице_нод_для_наблюдения.observe(document.body, config)
            observers.push(наблюдатель__Появление_на_странице_нод_для_наблюдения)



        }
        // vk.com
        else if (VK_ON && currentURL.startsWith('https://vk.com_/')) {
            // реклама слева

            function AD_remove() {
                const targetNode_leftColumn = document.querySelector('div#ads_left')
                if (targetNode_leftColumn) {
                    clearInterval(interval_AD_remove)
                    targetNode_leftColumn.remove()
                }

            }
            const interval_AD_remove = setInterval(AD_remove, 500);


            // реклама в теле страницы
            const spans = document.querySelectorAll('span.PostHeaderSubtitle__item');
            for (let span of spans) {
                if (span.textContent === 'Реклама в сообществе') {
                    span.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                }
            }
            document.querySelectorAll('div[class*="_ads_"]').forEach(node => {node?.remove()})
            document.querySelectorAll('div.closed_comments').forEach(node => {node?.remove()})


            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // console.log('Новые узлы добавлены:', mutation.addedNodes);
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {

                                if (node.classList.contains('page_block') &&
                                    node.classList.contains('no_posts')) {

                                    const spans = document.querySelectorAll('span.PostHeaderSubtitle__item');
                                    // if (spans.length > 0) { // на время тестирования
                                    spans.forEach(span => {
                                        if (span.textContent === 'Реклама в сообществе') {
                                            span.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                                        }
                                    });
                                    // }


                                }
                                else if (hasClassWithAds(node)) {
                                    node?.remove()
                                }
                                else if (node.classList.contains('closed_comments')) {
                                    node?.remove()
                                }

                            }
                        });

                    }
                }
            });
            observer.observe(document.querySelector('div#public'), observer_config)
            observers.push(observer)

            // Функция для проверки, принадлежит ли нода классу, название которого содержит '_ads_'
            function hasClassWithAds(node) {
                // Проверяем, что переданный объект является DOM-элементом и имеет classList
                if (node && node.classList) {
                    // Проверяем, содержит ли хотя бы один класс подстроку '_ads_'
                    return [...node.classList].some(cls => cls.includes('_ads_'));
                }
                return false;
            }
        }
        // vkvideo.ru
        else if (VK_VIDEO_ON && currentURL.startsWith('https://vkvideo.ru/video-')) {
            // реклама слева

            function Video_AD_remove() {
                const videoplayer_ads_actions = document.querySelector('div.videoplayer_ads_actions')
                if (videoplayer_ads_actions)
                    videoplayer_ads_actions.style.display = 'none'
                document.querySelector('div.rb-adman-ad-actions')?.remove()
                document.querySelector('div.videoplayer_ads_media_el')?.remove()
                document.querySelector('div.videoplayer_ads')?.remove()
            }
            const interval_AD_remove = setInterval(Video_AD_remove, 500);

            const observer = new MutationObserver((mutationsList, observer) => {
                clearInterval(interval_AD_remove)
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // console.log('Новые узлы добавлены:', mutation.addedNodes);
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV') {
                                if (node.classList.contains('videoplayer_ads_actions') ) {
                                    node.style.display = 'none'
                                    node.remove()
                                }
                                else if (node.classList.contains('rb-adman-ad-actions')  ||
                                         node.classList.contains('videoplayer_ads_media_el') ||
                                         node.classList.contains('videoplayer_ads')
                                        ) {
                                    node.remove()
                                }
                                else if (node.classList.contains('videoplayer_status_icon')
                                        ) {

                                    const videoplayer_ads_actions = document.querySelector('div.videoplayer_ads_actions')
                                    if (videoplayer_ads_actions)
                                        videoplayer_ads_actions.style.display = 'none'
                                    document.querySelector('div.rb-adman-ad-actions')?.remove()
                                    document.querySelector('div.videoplayer_ads_media_el')?.remove()
                                    document.querySelector('div.videoplayer_ads')?.remove()

                                }
                            }
                        });
                    }
                }
            });
            observer.observe(document.getElementById('react_rootVideo_page'), observer_config)
            observers.push(observer)
        }

        // ok.ru
        else if (currentURL.startsWith('https://ok.ru/') && OK_ON) {
            // реклама справа
            function AD_remove() {
                const targetNode_rightColumn = document.querySelector('div#rightColumn')
                if (targetNode_rightColumn) {
                    clearInterval(interval_AD_remove)
                    targetNode_rightColumn.remove()
                }
            }
            const interval_AD_remove = setInterval(AD_remove, 500);
            // реклама слева
            function AD_Left_remove() {
                const targetNode_LeftColumn = document.querySelector('div#hook_Block_StickyBannerContainer')
                if (targetNode_LeftColumn) {
                    clearInterval(interval_AD_Left_remove)
                    targetNode_LeftColumn.remove()
                }
            }
            const interval_AD_Left_remove = setInterval(AD_Left_remove, 500);
        }

    }

    // Добавлекние раскрывающегося блока "Реклама"
    function CreateEspeciallyForYou() {
        // Создание стилей с помощью JavaScript
        const style = document.createElement("style")
        style.textContent = `
                details {
                    // display: none;
                    font-family: Arial, sans-serif;
                    font-size: 18px;
                    color: #333;
                    position: relative;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #fff;
                    max-height: 50vh;
                    overflow-y: auto;
                }
                summary {
                    cursor: pointer;
                    outline: none;
                    position: relative;
                    z-index: 1;
                    color: #df4a0f; /* Изменение цвета текста на красный */
                }
                .shimmer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
                    animation: shimmer 60s linear infinite;
                    pointer-events: none;
                }
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `;
        document.head.appendChild(style);

        // Создание элемента details
        const details = document.createElement("details");
        // Добавляем класс my-details-class к элементу <details>
        details.classList.add('details_EspeciallyForYou');

        const summary = document.createElement("summary");
        summary.textContent = messageSpecialOffer('Реклама')

        const shimmer = document.createElement("div");
        shimmer.className = "shimmer";

        // const content = document.createElement("p");
        // content.textContent = "Содержимое деталей...";

        details.appendChild(summary);
        details.appendChild(shimmer);
        // details.appendChild(content);

        // document.body.appendChild(details);
        return details
    }

// Возврат строк в зависимости от языка
function messageSpecialOffer(idMsg) {
    // Определение языка браузера
    const browserLanguage = navigator.language || navigator.userLanguage
    let messageSpecialOffer

    switch (idMsg) {
        case "Реклама":
            messageSpecialOffer = 'Реклама'
            switch (browserLanguage) {
                case "uken":
                    messageSpecialOffer = 'Реклама'
                    break;
                default:
                    messageSpecialOffer = 'Реклама'
            }
            return messageSpecialOffer
    }
}
// https://mail.ru/
// Функция для проверки наличия и удаления верхнего рекламного блока
function mail_ru_checkAndRemoveTopBlock() {
    let targetNode
    targetNode = document.querySelector(config.nodes.mail_ru_banner_top_parent);
    if (targetNode) {
        // тип ноды меняется через каждые несколько секунд
        let targetNode_banner

        targetNode_banner = targetNode.querySelector('div.tgb-wrapper')

        if (targetNode_banner) {
            targetNode_banner.remove()
        }
    }
    const targetNodes = document.querySelectorAll('div.letter-list-item-adv')
    targetNodes.forEach(node => {
        node.remove();
    });


    // Поиск элемент с текстом "Реклама" внутри всех #shadow-root и определение блоков до #shadow-root

    // Функция для поиска элемента по текстовому содержимому внутри shadow DOM
    function findElementByTextInShadow(shadowRoot, tag, text) {
        const elements = shadowRoot.querySelectorAll(tag);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent === text) {
                return elements[i];
            }
        }
        return null;
    }

    // Новый способ
    // Получаем все элементы <div> на странице
    const divElements = document.querySelectorAll('div');

    // Проходимся по каждому элементу и проверяем его высоту и содержимое
    divElements.forEach((element) => {
        const height = parseInt(getComputedStyle(element).height);
        const content = element.innerText.trim();

        // Проверяем, является ли элемент <div> с высотой 0px и без содержимого
        if (height === 0 && content === '') {
            // Находим предшествующий элемент <div> с высотой 90px
            const previousDiv = element.previousElementSibling;
            if (previousDiv && previousDiv.tagName === 'DIV' && parseInt(getComputedStyle(previousDiv).height) === 90) {
                // Проверяем, содержит ли предшествующий элемент <div> с высотой 90px элемент <div> с текстом "0+", "6+", "12+" или "16+"
                const innerDivs = previousDiv.querySelectorAll('div');
                let hasText = false;
                innerDivs.forEach((innerDiv) => {
                    const innerDivText = innerDiv.innerText.trim();
                    if (innerDivText === '0+' || innerDivText === '6+' || innerDivText === '12+' || innerDivText === '16+') {
                        hasText = true;
                    }
                });
                if (hasText) {
                    previousDiv.style.display = 'none'
                }
            }
        }
    });

    // Трети способ: внутри div slot="main-column" найти на верхнем уровне все непустые ноды, расположенные между div со свойством data-bem и div, принадлежащим классу class="tabs__container"
    // Функция для поиска всех непустых нод на верхнем уровне между двумя элементами
    function findNodesBetweenElements(container, startSelector, endSelector) {
        const startElement = container.querySelector(startSelector);
        const endElement = container.querySelector(endSelector);

        if (!startElement || !endElement) {
            console.error('Start or end element not found.');
            return [];
        }

        const nodes = [];
        let currentNode = startElement.nextSibling;

        while (currentNode && currentNode !== endElement) {
            if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.textContent.trim() !== '') {
                nodes.push(currentNode);
            }
            currentNode = currentNode.nextSibling;
        }

        return nodes;
    }

    // Находим контейнер с атрибутом slot="main-column"
    const mainColumn = document.querySelector('div[slot="main-column"]');

    if (mainColumn) {
        // Находим все непустые ноды на верхнем уровне между div с data-bem и div с классом tabs__container
        const nodes = findNodesBetweenElements(mainColumn, 'div[data-bem]', 'div.tabs__container');

        // Выводим найденные ноды в консоль
        nodes.forEach(node => {
            console.log(node);
        });
    } else {
        console.error('Container with slot="main-column" not found.');
    }


}

function mail_ru_checkAndRemove_РекламаInSpan(node_test, mutation_test) {
    if (node_test && node_test.nodeName === 'DIV') {
        const DivBlockclassList = Array.from(node_test.classList);
        if (DivBlockclassList.some(className => className === 'mailru-dzen-themes') //||
            // DivBlockclassList.some(className => className === 'feed__row') &&
            // DivBlockclassList.some(className => className === '_is-mailru-morda')
           ) {
            // document.querySelectorAll('article.card-wrapper').forEach(node => {
            //     node?.remove()
            // })
            document.querySelectorAll('article.zenad-card-rtb').forEach(node => {
                node?.remove()
            })
            document.querySelectorAll('div.zenad-card-rtb__ad').forEach(node => {
                node?.remove()
            })
        }
    }
    // if (node_test && node_test.nodeName === 'IMG') {
    //     const DivBlockclassList = Array.from(node_test.classList);
    //     if (DivBlockclassList.some(className => className === 'zen-ui-zen-image-cover__image')
    //        ) {
    //         document.querySelectorAll('article.card-wrapper').forEach(node => {
    //             node?.remove()
    //         })
    //         document.querySelectorAll('div.zenad-card-rtb__ad').forEach(node => {
    //             node?.remove()
    //         })
    //     }
    // }


}
// Поиск элемент с текстом "Реклама" внутри всех #shadow-root и определение блоков до #shadow-root
function mail_ru_checkAndRemove_РекламаВShadow() {

    //         // Функция для поиска элемента по текстовому содержимому внутри shadow DOM
    //         function findElementByTextInShadow(shadowRoot, tag, text) {
    //             const elements = shadowRoot.querySelectorAll(tag);
    //             for (let i = 0; i < elements.length; i++) {
    //                 if (elements[i].textContent === text) {
    //                     return elements[i];
    //                 }
    //             }
    //             return null;
    //         }

    //         // Найти все shadow host'ы на странице
    //         const shadowHosts = document.querySelectorAll('*');

    //         shadowHosts.forEach(shadowHost => {
    //             const shadowRoot = shadowHost.shadowRoot;

    //             if (shadowRoot) {
    //                 // Найти элемент с текстом "Реклама" внутри shadow root
    //                 const рекламаElement = findElementByTextInShadow(shadowRoot, 'span', 'Реклама');

    //                 if (рекламаElement) {
    //                     // Подняться по родительским нодам вплоть до shadow-root
    //                     let currentNode = рекламаElement;
    //                     while (currentNode && currentNode.parentNode !== shadowRoot) {
    //                         currentNode = currentNode.parentNode;
    //                     }

    //                     // Теперь currentNode указывает на элемент, непосредственно следующий за shadow-root
    //                     console.log(currentNode);
    //                 } else {
    //                     console.log('Элемент с текстом "Реклама" не найден внутри shadow root');
    //                 }
    //             } else {
    //                 console.log('Shadow root не найден');
    //             }
    //         });





    //*************


    //         function findParentNodeAboveShadowRoot() {
    //             const adSpan = document.querySelector('span:contains("Реклама")');

    //             if (adSpan) {
    //                 let currentNode = adSpan.parentNode;
    //                 while (currentNode && currentNode.id !== 'shadow-root') {
    //                     currentNode = currentNode.parentNode;
    //                 }

    //                 if (currentNode && currentNode.parentNode) {
    //                     return currentNode.parentNode;
    //                 }
    //             }

    //             return null;
    //         }

    //         const parentNode = findParentNodeAboveShadowRoot();

    //         if (parentNode) {
    //             console.log('Parent node above shadow-root:', parentNode);
    //         } else {
    //             console.log('Could not find the specified node.');
    //         }

    //*****************


    function findParentNodeAboveShadowRoot() {

        // Find all elements with a closed shadow root
        const shadowRoots = Array.from(document.querySelectorAll('*')).filter(el => el.shadowRoot && el.shadowRoot.mode === 'closed');

        // Iterate through the shadow roots and change their mode to 'open'
        shadowRoots.forEach(el => {
            el.shadowRoot.mode = 'open';
        });

        // Find all span elements
        const spans = document.querySelectorAll('span');

        // Iterate through the spans and find the one with the text "Реклама"
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].textContent === 'Реклама') {
                let currentNode = spans[i].parentNode;

                // Traverse up the DOM until the shadow root is found
                while (currentNode && currentNode.id !== 'shadow-root') {
                    currentNode = currentNode.parentNode;
                }

                // Return the parent of the shadow root
                if (currentNode && currentNode.parentNode) {
                    return currentNode.parentNode;
                }
            }
        }

        return null; // Return null if the node is not found
    }

    const parentNode = findParentNodeAboveShadowRoot();

    if (parentNode) {
        console.log('Parent node above shadow-root:', parentNode);
    } else {
        console.log('Could not find the specified node.');
    }








}

function mail_ru_checkAndRemoveTopBlock_classList(Node,mutation_test) {
    const classList = Array.from(Node.classList);
    if (classList.length === 3 &&
        classList.some(className => className.length === 7) &&
        classList.some(className => className.length === 7) &&
        classList.some(className => className.length >= 7 )) { // замечены варианты 15 и 17 длиной
        Node.remove();
        // Node.style.display = 'none';

    }
}

// внизу справа "Сделать поиск Яндекса основным?"
function yandex_dzen_questionYandexGeneralSearch() {
    // <div class="nvBl_ nvBl_g9JqZb38zCZXEw nvBl_g9Z8ZofTxz9QBra_"><div id="dhbz" class="qb5a868df"><div class="ta805822e bacc75f5 fce2ef19d j2b3be76f o2301de0b"><div class="w6845527">
    // Выбираем все div
    const allDivs = document.querySelectorAll('div');

    // Фильтруем div, чтобы оставить только те, у которых ровно три класса
    const divsWithThreeClasses = Array.from(allDivs).filter(div => {
        const classes = div.classList;
        return classes.length === 3;
    });


    divsWithThreeClasses.forEach(div => {
        const DivChild = div.querySelector('div');
        function checkDivHasAnyId(div) {
            if (!div) {
                // console.log('Div not found.');
                return false;
            }

            if (!div.id) {
                // console.log('Div does not have an id.');
                return false;
            }

            // console.log('Div has an id.');
            // Проверяем, что div имеет ровно один класс
            if (div.classList.length !== 1) {
                // console.log('Div does not have exactly one class.');
                return false;
            }

            // есть вложенный div, принадлежащий пяти классам
            const DivChild2 = div.querySelector('div');
            if (!DivChild2) {
                return false;

            }
            // Проверяем, что div принадлежит ровно 5-ти классам
            if (DivChild2.classList.length !== 5) {
                // console.log('Div does not have exactly 5 classes.');
                return false;
            }

            return true;
        }

        const result = checkDivHasAnyId(DivChild);
        if (result) div.remove()

    });

    // Новый способ
    // Получаем все элементы <div> на странице
    const divElements = document.querySelectorAll('div');
    // Проходимся по каждому элементу и проверяем его содержимое
    divElements.forEach((element) => {
        if (element.innerText.includes('Сделать поиск Яндекса основным')) {
            // Используем closest() для поиска родителя с указанным z-index
            const parentElement = divElement.closest('[style*="z-index"]');
            // Проверяем, найден ли родитель и его z-index
            if (parentElement && parseInt(getComputedStyle(parentElement).zIndex) > 100) {
                parentElement.remove()
            }
        }
    });

}

// определение мобильное устройство или ПК
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// поиск вложенной ноды, содержащей shadowRoot (не работает на 'closed')
function findShadowRoot(node, shadowRoot_mode = 'closed') {
    // Проверяем, есть ли у текущей ноды shadowRoot
    if (node.shadowRoot && node.shadowRoot.mode === shadowRoot_mode) {
        console.log('Найдена нода с закрытым shadowRoot:', node);
        return node;
    }

    // Рекурсивно обходим дочерние элементы
    for (let child of node.children) {
        let result = findShadowRoot(child);
        if (result) {
            return result;
        }
    }

    return null;
}

// // Обработка события hashchange (не срабатывает)
// window.addEventListener('hashchange', handleUrlChange);

// // Обработка события popstate (не срабатывает)
// window.addEventListener('popstate', handleUrlChange);
// Function to handle URL changes
function handleUrlChange2(newUrl) {
    if (currentURL !== newUrl) {
        // console.log('URL changed from', currentUrl, 'to', newUrl);
        currentURL = newUrl;
        // You can add your custom logic here
        // handleUrlChange()
        onInit()
    }
}


// Override pushState and replaceState to track URL changes
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
    originalPushState.apply(history, arguments);
    handleUrlChange2(window.location.href);
};

history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    handleUrlChange2(window.location.href);
};


// Проверка изменений в URL при загрузке страницы
// handleUrlChange(); // перенесено в Init



})();
