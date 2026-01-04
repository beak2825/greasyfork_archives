// ==UserScript==
// @name Переводчик
// @namespace http://tampermonkey.net/
// @version 0.99
// @description Этот скрипт используется для перевода различных популярных сайтов социальных сетей на китайский язык без использования промежуточного сервера.
// @author HolynnChen
// @license MIT
// @match *://*.twitter.com/*
// @match *://*.x.com/*
// @match *://*.youtube.com/*
// @match *://*.facebook.com/*
// @match *://*.reddit.com/*
// @match *://*.5ch.net/*
// @match *://*.discord.com/*
// @match *://*.telegram.org/*
// @match *://*.quora.com/*
// @match *://*.tiktok.com/*
// @match *://*.instagram.com/*
// @match *://*.threads.net/*
// @match *://*.github.com/*
// @match *://*.bsky.app/*
// @connect fanyi.baidu.com
// @connect translate.google.com
// @connect ifanyi.iciba.com
// @connect www.bing.com
// @connect fanyi.youdao.com
// @connect dict.youdao.com
// @connect m.youdao.com
// @connect api.interpreter.caiyunai.com
// @connect papago.naver.com
// @connect fanyi.qq.com
// @connect translate.alibaba.com
// @connect www2.deepl.com
// @connect transmart.qq.com
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js
// @require https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require https://cdn.jsdelivr.net/gh/Tampermonkey/utils@3b32b826e84ccc99a0a3e3d8d6e5ce0fa9834f23/requires/gh_2215_make_GM_xhr_more_parallel_again.js
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/544040/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544040/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA.meta.js
// ==/UserScript==

// --- Вспомогательные функции ---

/**
 * Функция для сжатия/распаковки данных для sessionStorage с использованием LZ-String.
 * @param {Storage} storage - Объект sessionStorage или localStorage.
 * @returns {object} Объект с методами getItem, setItem, removeItem, clear.
 */
function CompressMergeSession(storage) {
    return {
        getItem: function(key) {
            const compressed = storage.getItem(key);
            return compressed ? LZString.decompressFromUTF16(compressed) : null;
        },
        setItem: function(key, value) {
            const compressed = LZString.compressToUTF16(value);
            storage.setItem(key, compressed);
        },
        removeItem: function(key) {
            storage.removeItem(key);
        },
        clear: function() {
            storage.clear();
        }
    };
}

/**
 * Функция для выбора элементов DOM на основе CSS-селектора, с возможностью дополнительной фильтрации.
 * @param {string} selector - CSS-селектор.
 * @param {function} [filterFunc] - Необязательная функция для фильтрации найденных элементов.
 * @returns {function} Функция, которая при вызове возвращает массив элементов.
 */
function baseSelector(selector, filterFunc) {
    return () => {
        const elements = Array.from(document.querySelectorAll(selector));
        return filterFunc ? filterFunc(elements) : elements;
    };
}

/**
 * Функция для извлечения текстового содержимого из элемента DOM.
 * @param {HTMLElement} element - Элемент DOM.
 * @returns {string} Текстовое содержимое элемента.
 */
function baseTextGetter(element) {
    return element ? element.textContent || "" : "";
}

/**
 * Функция для установки переведенного текста обратно в элемент DOM.
 * @param {object} options - Объект с параметрами: element (элемент DOM), text (переведенный текст).
 * @returns {HTMLElement} Модифицированный элемент DOM.
 */
function baseTextSetter(options) {
    if (options.element && options.text !== undefined) {
        options.element.innerHTML = options.text;
    }
    return options.element;
}

/**
 * Функция для фильтрации URL-адресов из текста.
 * Это базовая реализация, вы можете улучшить ее, если нужно сохранять часть URL.
 * @param {string} text - Исходный текст.
 * @returns {string} Текст без URL.
 */
function url_filter(text) {
    return text.replace(/(https?:\/\/[^\s]+)/g, ''); // Удаляет http/https ссылки
}

/**
 * Функция для определения языка текста.
 * Это очень базовая заглушка. Для точного определения языка рассмотрите использование
 * специализированных библиотек или API (например, Google Cloud Translation API's language detection).
 * @param {string} text - Текст для определения языка.
 * @returns {Promise<string>} Промис, возвращающий код языка (например, 'en', 'zh', 'auto').
 */
function pass_lang(text) {
    return new Promise(resolve => {
        // Очень простая эвристика: если есть много китайских символов, считаем, что это китайский.
        const chineseCharCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        if (chineseCharCount > text.length * 0.3) { // Если более 30% символов - китайские
            resolve('zh'); // Китайский
        } else {
            resolve('auto'); // Позволить API определить язык
        }
    });
}

/**
 * Вспомогательная функция для удаления элемента из массива.
 * @param {Array} array - Массив, из которого нужно удалить элемент.
 * @param {*} item - Элемент для удаления.
 */
function removeItem(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

/**
 * Функция-обертка для выполнения промиса с возможностью повторных попыток.
 * Эта реализация просто выполняет функцию один раз.
 * Для реальных повторных попыток требуется дополнительная логика (например, setTimeout, счетчик попыток).
 * @param {function} func - Функция, возвращающая промис.
 * @returns {Promise<*>} Результат промиса.
 */
function PromiseRetryWrap(func) {
    // В реальной реализации здесь может быть логика для повторных попыток с задержкой
    return func();
}

// --- Функции перевода (заглушки, требуют реальной реализации API) ---

/**
 * Google Переводчик (Desktop/Web API)
 * Требует реальной реализации запроса к API Google Translate.
 * Обратите внимание, что прямое использование translate.google.com может быть заблокировано CORS
 * или требовать обходных путей. Рекомендуется использовать официальный Google Cloud Translation API,
 * который требует ключей API и оплаты.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык (например, 'auto', 'en', 'ru').
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_gg(text, sourceLang) {
    console.log(`[Google Переводчик] Запрос: "${text}" с "${sourceLang}"`);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            // Это общая конечная точка, которая часто используется. Она может быть нестабильной.
            url: `https://translate.google.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    // Структура ответа может меняться. Это пример для популярного формата.
                    if (data && data[0] && data[0][0] && data[0][0][0]) {
                        resolve(data[0][0][0]);
                    } else {
                        reject(new Error("Некорректный ответ от Google Translate"));
                    }
                } catch (e) {
                    console.error("[Google Переводчик] Ошибка парсинга:", e);
                    reject(e);
                }
            },
            onerror: function(error) {
                console.error("[Google Переводчик] Ошибка запроса:", error);
                reject(error);
            }
        });
    });
}

/**
 * Google Translate Mobile
 * Аналогично translate_gg, но может использовать другие эндпоинты или параметры для мобильных версий.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_ggm(text, sourceLang) {
    console.log(`[Google Translate Mobile] Запрос: "${text}" с "${sourceLang}"`);
    // Реализация может быть похожа на translate_gg, но с учетом возможных отличий в API для мобильных
    return translate_gg(text, sourceLang); // Используем тот же API для примера
}

/**
 * Перевод Tencent
 * Требует ключей API Tencent Cloud Translation и подписания запросов.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_tencent(text, sourceLang) {
    console.log(`[Перевод Tencent] Запрос: "${text}" с "${sourceLang}"`);
    // Пример структуры запроса (замените на реальные данные и подпись)
    return new Promise((resolve, reject) => {
        // Здесь потребуется генерация подписи (Signature) и другие параметры
        // согласно документации Tencent Cloud Translation API.
        // Это может включать AccessKeyId, SecretAccessKey, Region, Action и т.д.
        // Пример:
        // const SECRET_ID = 'YOUR_SECRET_ID';
        // const SECRET_KEY = 'YOUR_SECRET_KEY';
        // const TIMESTAMP = Math.floor(Date.now() / 1000);
        // const NONCE = Math.floor(Math.random() * 100000);
        // const PARAMS = {
        //     Action: 'TextTranslate',
        //     Region: 'ap-guangzhou',
        //     SourceText: text,
        //     Source: sourceLang === 'auto' ? 'auto' : sourceLang,
        //     Target: 'zh', // Или 'zh-Hans' для упрощенного китайского
        //     ProjectId: 0,
        //     // ... другие параметры
        // };
        // const SIGNED_PARAMS = signRequest(PARAMS, SECRET_KEY); // Функция signRequest должна быть реализована вами

        // GM_xmlhttpRequest({
        //     method: "POST",
        //     url: "https://tmt.tencentcloudapi.com/", // Или другая конечная точка
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-TC-Action": "TextTranslate",
        //         "X-TC-Version": "2018-03-21",
        //         "X-TC-Region": "ap-guangzhou",
        //         "X-TC-Timestamp": TIMESTAMP.toString(),
        //         "X-TC-Nonce": NONCE.toString(),
        //         "X-TC-Signature": SIGNED_PARAMS.Signature,
        //     },
        //     data: JSON.stringify(SIGNED_PARAMS),
        //     onload: function(response) { /* ... */ },
        //     onerror: function(error) { /* ... */ }
        // });
        resolve(`[Tencent] Перевод: ${text}`); // Заглушка
    });
}

/**
 * Перевод Tencent AI (может быть частью Tencent Cloud или отдельный сервис)
 * Предполагается аналогичная логика API, как и у Tencent Translation.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_tencentai(text, sourceLang) {
    console.log(`[Перевод Tencent AI] Запрос: "${text}" с "${sourceLang}"`);
    return translate_tencent(text, sourceLang); // Используем тот же API для примера
}

/**
 * Мобильный перевод Youdao
 * Требует ключей API Youdao Translate и подписания запросов.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function Translate_youdao_mobile(text, sourceLang) {
    console.log(`[Мобильный перевод Youdao] Запрос: "${text}" с "${sourceLang}"`);
    // Youdao API требует appKey, secretKey, salt, timestamp и sig (подпись).
    // Подпись генерируется с помощью SHA256 и HMAC.
    // Пример:
    // const APP_KEY = 'YOUR_APP_KEY';
    // const SECRET_KEY = 'YOUR_SECRET_KEY';
    // const SALT = Date.now();
    // const CURTIME = Math.floor(Date.now() / 1000);
    // const SIGN_STR = APP_KEY + truncate(text) + SALT + CURTIME + SECRET_KEY;
    // const SIGN = CryptoJS.SHA256(SIGN_STR).toString(CryptoJS.enc.Hex); // Требует CryptoJS
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://openapi.youdao.com/api", // Или другой эндпоинт Youdao
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     data: new URLSearchParams({
    //         q: text,
    //         from: sourceLang === 'auto' ? 'auto' : sourceLang,
    //         to: 'zh-CHS', // Или другой китайский вариант
    //         appKey: APP_KEY,
    //         salt: SALT,
    //         sign: SIGN,
    //         signType: 'v3',
    //         curtime: CURTIME
    //     }).toString(),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Youdao Mobile] Перевод: ${text}`); // Заглушка
}

/**
 * Переводчик Baidu
 * Требует AppId и SecretKey для Baidu Fanyi API.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function Translate_baidu(text, sourceLang) {
    console.log(`[Переводчик Baidu] Запрос: "${text}" с "${sourceLang}"`);
    // Baidu API требует appid, q, from, to, salt и sign.
    // sign генерируется md5(appid + q + salt + secretKey).
    // Пример:
    // const APP_ID = 'YOUR_APP_ID';
    // const SECRET_KEY = 'YOUR_SECRET_KEY';
    // const SALT = Math.random().toString().slice(-10);
    // const SIGN_STR = APP_ID + text + SALT + SECRET_KEY;
    // const SIGN = CryptoJS.MD5(SIGN_STR).toString(); // Требует CryptoJS
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     data: new URLSearchParams({
    //         q: text,
    //         from: sourceLang === 'auto' ? 'auto' : sourceLang,
    //         to: 'zh',
    //         appid: APP_ID,
    //         salt: SALT,
    //         sign: SIGN
    //     }).toString(),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Baidu] Перевод: ${text}`); // Заглушка
}

/**
 * Цайюнь Сяойи (Caiyun Xiaoyi)
 * Может быть более простым API или требовать токен.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function Translation_caiyun(text, sourceLang) {
    console.log(`[Цайюнь Сяойи] Запрос: "${text}" с "${sourceLang}"`);
    // Caiyun Xiaoyi (Rainbow Translate) часто имеет более простой API.
    // Может быть достаточно POST-запроса с текстом и целевым языком.
    // Возможно, требуется токен в заголовках.
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://api.interpreter.caiyunai.com/v1/translator", // Проверьте актуальный эндпоинт
    //     headers: {
    //         "Content-Type": "application/json",
    //         "X-Authorization": "token YOUR_CAIYUN_TOKEN" // Если требуется токен
    //     },
    //     data: JSON.stringify({
    //         source: text.split('\n'), // API может ожидать массив строк
    //         request_id: "demo",
    //         detect: true, // Позволить API определить исходный язык
    //         target: "zh", // Целевой язык
    //     }),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Caiyun Xiaoyi] Перевод: ${text}`); // Заглушка
}

/**
 * Bing Translation
 * Использование Bing API обычно требует Azure Cognitive Services.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_biying(text, sourceLang) {
    console.log(`[Bing Translation] Запрос: "${text}" с "${sourceLang}"`);
    // Microsoft Azure Translator Text API требует ключ подписки и регион.
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLang}&to=zh-Hans`,
    //     headers: {
    //         "Ocp-Apim-Subscription-Key": "YOUR_AZURE_TRANSLATOR_KEY",
    //         "Ocp-Apim-Subscription-Region": "YOUR_AZURE_TRANSLATOR_REGION", // Например, "eastus"
    //         "Content-Type": "application/json"
    //     },
    //     data: JSON.stringify([{ "text": text }]),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Bing] Перевод: ${text}`); // Заглушка
}

/**
 * Перевод Папаго (Naver Papago)
 * Требует Client ID и Client Secret от Naver Developer Center.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_papago(text, sourceLang) {
    console.log(`[Перевод Папаго] Запрос: "${text}" с "${sourceLang}"`);
    // Papago API требует X-Naver-Client-Id и X-Naver-Client-Secret в заголовках.
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://papago.naver.com/apis/n2mt/translate", // Или https://openapi.naver.com/v1/papago/n2mt
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    //         "X-Naver-Client-Id": "YOUR_NAVER_CLIENT_ID",
    //         "X-Naver-Client-Secret": "YOUR_NAVER_CLIENT_SECRET"
    //     },
    //     data: new URLSearchParams({
    //         source: sourceLang === 'auto' ? 'auto' : sourceLang,
    //         target: 'zh-CN',
    //         text: text
    //     }).toString(),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Papago] Перевод: ${text}`); // Заглушка
}

/**
 * Ali Translation (Alibaba Cloud Translate)
 * Требует AccessKeyId и AccessKeySecret для Alibaba Cloud.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_alibaba(text, sourceLang) {
    console.log(`[Ali Translation] Запрос: "${text}" с "${sourceLang}"`);
    // Alibaba Cloud Translate API также требует подписания запросов.
    // Это сложнее и обычно включает SDK или ручную генерацию подписей HMAC-SHA1.
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://mt.cn-hangzhou.aliyuncs.com/", // Или другой регион
    //     headers: {
    //         "Content-Type": "application/json",
    //         // ... Заголовки авторизации Алибабы
    //     },
    //     data: JSON.stringify({
    //         "Format": "json",
    //         "Action": "TranslateText",
    //         "Version": "2018-09-17",
    //         "SourceText": text,
    //         "SourceLanguage": sourceLang === 'auto' ? 'auto' : sourceLang,
    //         "TargetLanguage": "zh",
    //         "Scene": "general"
    //     }),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Alibaba] Перевод: ${text}`); // Заглушка
}

/**
 * Iciba Translation
 * Часто используется для словарей, но может иметь и API перевода.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_icib(text, sourceLang) {
    console.log(`[iciba translation] Запрос: "${text}" с "${sourceLang}"`);
    // Iciba API может быть простым GET-запросом или требовать токен.
    // Например: `http://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&q=${encodeURIComponent(text)}`
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&q=${encodeURIComponent(text)}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.content && data.content.out) {
                        resolve(data.content.out);
                    } else {
                        reject(new Error("Некорректный ответ от Iciba"));
                    }
                } catch (e) {
                    console.error("[iciba translation] Ошибка парсинга:", e);
                    reject(e);
                }
            },
            onerror: function(error) {
                console.error("[iciba translation] Ошибка запроса:", error);
                reject(error);
            }
        });
    });
}

/**
 * Deepl Translation
 * DeepL API требует аутентификационного ключа.
 * @param {string} text - Текст для перевода.
 * @param {string} sourceLang - Исходный язык.
 * @returns {Promise<string>} Промис, возвращающий переведенный текст.
 */
function translate_deepl(text, sourceLang) {
    console.log(`[Deepl Translation] Запрос: "${text}" с "${sourceLang}"`);
    // DeepL API: https://www.deepl.com/docs-api
    // const DEEPL_AUTH_KEY = "YOUR_DEEPL_AUTH_KEY";
    // GM_xmlhttpRequest({
    //     method: "POST",
    //     url: "https://api-free.deepl.com/v2/translate", // Или api.deepl.com/v2/translate для Pro
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "Authorization": `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`
    //     },
    //     data: new URLSearchParams({
    //         text: text,
    //         source_lang: sourceLang === 'auto' ? '' : sourceLang.toUpperCase(), // DeepL использует коды языков в верхнем регистре, 'auto' - пустая строка
    //         target_lang: 'ZH',
    //     }).toString(),
    //     onload: function(response) { /* ... */ },
    //     onerror: function(error) { /* ... */ }
    // });
    return Promise.resolve(`[Deepl] Перевод: ${text}`); // Заглушка
}

// --- Функции запуска переводчиков (заглушки) ---

/**
 * Функция, выполняемая при запуске для Tencent Translation.
 * Может использоваться для инициализации, загрузки зависимостей или проверки состояния API.
 * @returns {Promise<void>} Промис, который разрешается после выполнения стартовых операций.
 */
function translate_tencent_startup() {
    console.log("[Tencent Translation] Выполняется запуск...");
    // Здесь может быть код для предварительной проверки API,
    // загрузки необходимых библиотек или инициализации.
    return Promise.resolve();
}

/**
 * Функция, выполняемая при запуске для Caiyun Xiaoyi.
 * @returns {Promise<void>} Промис, который разрешается после выполнения стартовых операций.
 */
function Translation_caiyun_startup() {
    console.log("[Цайюнь Сяойи] Выполняется запуск...");
    return Promise.resolve();
}

/**
 * Функция, выполняемая при запуске для Papago Translation.
 * @returns {Promise<void>} Промис, который разрешается после выполнения стартовых операций.
 */
function translate_papago_startup() {
    console.log("[Papago Translation] Выполняется запуск...");
    return Promise.resolve();
}

// --- Основной код скрипта (остается без изменений) ---

GM_registerMenuCommand('Сбросить положение панели управления (обновить приложение)', () => {
    GM_setValue('position_top', '9px');
    GM_setValue('position_right', '9px');
    location.reload(); // Добавлено для обновления приложения, как указано в комментарии
});

GM_registerMenuCommand('Глобально скрыть/показать плавающий шар (обновить приложение)', () => {
    GM_setValue('show_translate_ball', !GM_getValue('show_translate_ball', true));
    location.reload(); // Добавлено для обновления приложения
});

const transdict = {
    'Google Переводчик': translate_gg,
    'Google Translate mobile': translate_ggm,
    'Перевод Tencent': translate_tencent,
    'Перевод Tencent AI': translate_tencentai,
    //'Перевод Youdao': Translate_youdao, // Закомментировано в оригинале
    'Мобильный перевод Youdao': Translate_youdao_mobile,
    'Переводчик Baidu': Translate_baidu,
    'Цайюнь Сяойи': Translation_caiyun,
    'Bing Translation': translate_biying,
    'Перевод Папаго': translate_papago,
    'Ali Translation': translate_alibaba,
    'iciba translation': translate_icib,
    'Deepl Translation': translate_deepl,
    'Отключить перевод': () => {}
};

const startup = {
    // 'Перевод Youdao': Translate_youdao_startup, // Закомментировано в оригинале
    'Перевод Tencent': translate_tencent_startup,
    'Цайюнь Сяойи': Translation_caiyun_startup,
    'Papago Translation': translate_papago_startup
};

const baseoptions = {
    'enable_pass_lang': {
        declare: 'Не переводить китайский (упрощенный)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear();
        }
    },
    'enable_pass_lang_cht': {
        declare: 'Не переводите китайский (традиционный)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear();
        }
    },
    'remove_url': {
        declare: 'Автоматически фильтровать URL',
        default_value: true,
    },
    'show_info': {
        declare: 'Показать исходный текст перевода',
        default_value: true,
        option_enable: true
    },
    'fullscrenn_hidden': {
        declare: 'Не отображать на весь экран',
        default_value: true,
    },
    'replace_translate': {
        declare: 'заменяющий перевод',
        default_value: false,
        option_enable: true
    },
    'compress_storage': {
        declare: 'Сжатый кэш',
        default_value: false,
    }
};

const [enable_pass_lang, enable_pass_lang_cht, remove_url, show_info, fullscrenn_hidden, replace_translate, compress_storage] =
    Object.keys(baseoptions).map(key => GM_getValue(key, baseoptions[key].default_value));

const globalProcessingSave = [];

const sessionStorage = compress_storage ? CompressMergeSession(window.sessionStorage) : window.sessionStorage;

const p = window.trustedTypes !== undefined ? window.trustedTypes.createPolicy('translator', {
    createHTML: (string, sink) => string
}) : {
    createHTML: (string, sink) => string
};

function initPanel() {
    let choice = GM_getValue('translate_choice', 'Google Переводчик');
    let select = document.createElement("select");
    select.className = 'js_translate';
    select.style = 'height: 35px; width: 100px; background-color: #fff; border-radius: 17.5px; text-align: center; color: #000000; margin: 5px 0;';
    select.onchange = () => {
        GM_setValue('translate_choice', select.value);
        title.innerText = "Панель управления (обновите, чтобы применить)";
    };
    for (let i in transdict) select.innerHTML = p.createHTML(select.innerHTML + '<option value="' + i + '">' + i + '</option>');

    let enable_details = document.createElement('details');
    enable_details.innerHTML = p.createHTML(enable_details.innerHTML + "<summary>Включить правила</summary>");
    for (let i of rules) {
        let temp = document.createElement('input');
        temp.type = 'checkbox';
        temp.name = i.name;
        if (GM_getValue("enable_rule:" + temp.name, true)) temp.setAttribute('checked', true);
        enable_details.appendChild(temp);
        enable_details.innerHTML = p.createHTML(enable_details.innerHTML + "<span>" + i.name + "</span><br>");
    }

    let current_details = document.createElement('details');
    let mask = document.createElement('div'),
        dialog = document.createElement("div"),
        js_dialog = document.createElement("div"),
        title = document.createElement('p');

    let shadowRoot = document.createElement('div');
    shadowRoot.style = "position: absolute; visibility: hidden;";
    window.top.document.body.appendChild(shadowRoot);
    let shadow = shadowRoot.attachShadow({
        mode: "closed"
    });
    shadow.appendChild(mask);

    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title);
    js_dialog.appendChild(document.createElement('p')).appendChild(select);
    js_dialog.appendChild(document.createElement('p')).appendChild(enable_details);
    js_dialog.appendChild(document.createElement('p')).appendChild(current_details);

    mask.style = "display: none; position: fixed; height: 100vh; width: 100vw; z-index: 99999; top: 0; left: 0; overflow: hidden; background-color: rgba(0,0,0,0.4); justify-content: center; align-items: center; visibility: visible;";
    mask.addEventListener('click', event => {
        if (event.target === mask) mask.style.display = 'none';
    });
    dialog.style = 'padding: 0; border-radius: 10px; background-color: #fff; box-shadow: 0 0 5px 4px rgba(0,0,0,0.3);';
    js_dialog.style = "min-height: 10vh; min-width: 10vw; display: flex; flex-direction: column; align-items: center; padding: 10px; border-radius: 4px; color: #000;";
    title.style = 'margin: 5px 0; font-size: 20px;';
    title.innerText = "Панель управления";

    for (let i in baseoptions) {
        let temp = document.createElement('input'),
            temp_p = document.createElement('p');
        js_dialog.appendChild(temp_p);
        temp_p.appendChild(temp);
        temp.type = 'checkbox';
        temp.name = i;
        temp_p.style = "display:flex;align-items: center;margin:5px 0";
        temp_p.innerHTML = p.createHTML(temp_p.innerHTML + baseoptions[i].declare);
    }

    for (let i of js_dialog.querySelectorAll('input')) {
        if (i.name && baseoptions[i.name]) {
            i.onclick = _ => {
                title.innerText = "Панель управления (обновите, чтобы применить)";
                GM_setValue(i.name, i.checked);
                if (baseoptions[i.name].change_func) baseoptions[i.name].change_func(i);
            };
            i.checked = GM_getValue(i.name, baseoptions[i.name].default_value);
        }
    }

    for (let i of enable_details.querySelectorAll('input')) {
        i.onclick = _ => {
            title.innerText = "Панель управления (обновите, чтобы применить)";
            GM_setValue('enable_rule:' + i.name, i.checked);
        };
    }

    let open = document.createElement('div');
    open.style = `z-index: 9999; height: 35px; width: 35px; background-color: #fff; position: fixed; border: 1px solid rgba(0,0,0,0.2); border-radius: 17.5px; right: ${GM_getValue('position_right', '9px')}; top: ${GM_getValue('position_top', '9px')}; text-align-last: center; color: #000000; display: flex; align-items: center; align-content: center; cursor: pointer; font-size: 15px; user-select: none; visibility: visible;`;
    open.innerHTML = p.createHTML("Перевести");

    const renderCurrentRule = () => {
        current_details.style.display = "none";
        current_details.innerHTML = p.createHTML('');
        const currentRule = GetActiveRule();
        if (currentRule) {
            current_details.style.display = "flex";
            current_details.innerHTML = p.createHTML(`<summary>В настоящее время включено - ${currentRule.name}</summary>`);
            for (const option of currentRule.options) {
                const fieldset = document.createElement("fieldset");
                fieldset.innerHTML = p.createHTML(fieldset.innerHTML + `<legend>${option.name}</legend>`);
                current_details.appendChild(fieldset);
                fieldset.innerHTML = p.createHTML(fieldset.innerHTML + `<div style="display:flex;align-items:center"><span>отображает теги в исходном тексте</span><input type="checkbox"></div>`);
                for (const key in baseoptions) {
                    if (!baseoptions[key].option_enable) {
                        continue;
                    }
                    fieldset.innerHTML = p.createHTML(fieldset.innerHTML + `<span>${baseoptions[key].declare}</span><br>`);
                    const baseValueList = [
                        ["", "default"],
                        ["true", "enabled"],
                        ["false", "disabled"]
                    ];
                    fieldset.innerHTML = p.createHTML(fieldset.innerHTML + "<div>" + baseValueList.map(value => `<input type="radio" value="${value[0]}" name="${key}:${currentRule.name}-${option.name}">${value[1]}</input>`).join('') + "</div>");
                }
                const enableInput = fieldset.querySelector('input[type=checkbox]');
                const enableKey = `enable_option:${currentRule.name}-${option.name}`;
                enableInput.checked = GM_getValue(enableKey, true);
                enableInput.onchange = () => {
                    title.innerText = "Панель управления (обновите, чтобы применить)";
                    GM_setValue(enableKey, enableInput.checked);
                };
                const optionInputs = fieldset.querySelectorAll("input[type=radio]");
                for (const input of optionInputs) {
                    const key = `option_setting:${input.name}`;
                    if (GM_getValue(key, '').toString() === input.value) {
                        input.checked = true;
                    }
                    input.onchange = () => {
                        title.innerText = "Панель управления (обновите, чтобы применить)";
                        switch (input.value) {
                            case 'true':
                                GM_setValue(key, true);
                                break;
                            case 'false':
                                GM_setValue(key, false);
                                break;
                            case '':
                                GM_deleteValue(key);
                                break;
                        }
                    };
                }
            }
        }
    };

    open.onclick = () => {
        renderCurrentRule();
        mask.style.display = 'flex';
    };

    open.draggable = true;
    open.addEventListener("dragstart", function(ev) {
        ev.stopImmediatePropagation();
        this.tempNode = document.createElement('div');
        this.tempNode.style = "width: 1px; height: 1px; opacity: 0;";
        document.body.appendChild(this.tempNode);
        ev.dataTransfer.setDragImage(this.tempNode, 0, 0);
        this.oldX = ev.offsetX - Number(this.style.width.replace('px', ''));
        this.oldY = ev.offsetY;
    });
    open.addEventListener("drag", function(ev) {
        ev.stopImmediatePropagation();
        if (!ev.x && !ev.y) return;
        this.style.right = Math.max(window.innerWidth - ev.x + this.oldX, 0) + "px";
        this.style.top = Math.max(ev.y - this.oldY, 0) + "px";
    });
    open.addEventListener("dragend", function(ev) {
        ev.stopImmediatePropagation();
        GM_setValue("position_right", this.style.right);
        GM_setValue("position_top", this.style.top);
        document.body.removeChild(this.tempNode);
    });

    open.addEventListener("touchstart", ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        ev = ev.touches[0];
        open._tempTouch = {};
        const base = open.getBoundingClientRect();
        open._tempTouch.oldX = ev.clientX - base.left;
        open._tempTouch.oldY = ev.clientY - base.top;
        open._tempIsMove = false;
    });

    open.addEventListener("touchmove", ev => {
        ev.stopImmediatePropagation();
        ev = ev.touches[0];
        open.style.right = Math.max(window.innerWidth - (ev.clientX + open._tempTouch.oldX), 0) + 'px';
        open.style.top = Math.max(ev.clientY - open._tempTouch.oldY, 0) + 'px';
        open._tempIsMove = true;
    });

    open.addEventListener("touchend", ev => {
        ev.stopImmediatePropagation();
        GM_setValue("position_right", open.style.right);
        GM_setValue("position_top", open.style.top);
        if (!open._tempIsMove) {
            renderCurrentRule();
            mask.style.display = 'flex';
        }
        open._tempIsMove = false;
    });

    shadow.appendChild(open);
    shadow.querySelector('.js_translate option[value="' + choice + '"]').selected = true;

    if (fullscrenn_hidden) window.top.document.addEventListener('fullscreenchange', () => {
        open.style.display = window.top.document.fullscreenElement ? "none" : "flex";
    });
}

const rules = [{
        name: 'Twitter General',
        matcher: /https:\/\/(?:[a-zA-Z.]*?\.|)twitter\.com/,
        options: [{
                name: "Твит",
                selector: baseSelector('div[dir="auto"][lang]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.cssText = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '');
                    baseTextSetter(options).style.display = 'flex';
                }
            },
            {
                name: "Справочная информация",
                selector: baseSelector('div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.cssText = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '');
                    baseTextSetter(options).style.display = 'flex';
                }
            }
        ]
    },
    {
        name: 'x General',
        matcher: /https:\/\/(?:[a-zA-Z.]*?\.|)x\.com/,
        options: [{
                name: "Твит",
                selector: baseSelector('div[dir="auto"][lang]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.cssText = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '');
                    baseTextSetter(options).style.display = 'flex';
                }
            },
            {
                name: "Справочная информация",
                selector: baseSelector('div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.cssText = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '');
                    baseTextSetter(options).style.display = 'flex';
                }
            }
        ]
    },
    {
        name: 'youtube pc universal',
        matcher: /https:\/\/www\.youtube\.com\/(?:watch|shorts|results\?)/,
        options: [{
                name: "Область комментариев",
                selector: baseSelector("#content>#content-text"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    options.element.parentNode.parentNode.removeAttribute('collapsed');
                }
            },
            {
                name: "Видеовведение",
                selector: baseSelector("#content>#description>.content,.ytd-text-inline-expander>.yt-core-attributed-string"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    options.element.parentNode.parentNode.removeAttribute('collapsed');
                }
            },
            {
                name: "CC Subtitles",
                selector: baseSelector(".ytp-caption-segment"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter
            }
        ]
    },
    {
        name: 'youtube mobile universal',
        matcher: /https:\/\/m\.youtube\.com\/watch/,
        options: [{
                name: "Область комментариев",
                selector: baseSelector(".comment-text.user-text"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Видеовведение",
                selector: baseSelector(".slim-video-metadata-description"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'короткое видео YouTube',
        matcher: /https:\/\/(?:www|m)\.youtube\.com\/shorts/,
        options: [{
            name: "Область комментариев",
            selector: baseSelector("#comment-content #content-text,.comment-content .comment-text"),
            textGetter: baseTextGetter,
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'сообщество YouTube',
        matcher: /https:\/\/(?:www|m)\.youtube\.com\/(?:.*?\/community|post)/,
        options: [{
            name: "Область комментариев",
            selector: baseSelector("#post #content #content-text,#comment #content #content-text,#replies #content #content-text"),
            textGetter: baseTextGetter,
            textSetter: options => {
                baseTextSetter(options);
                options.element.parentNode.parentNode.removeAttribute('collapsed');
            }
        }]
    },
    {
        name: 'facebook-universal',
        matcher: /https:\/\/www\.facebook\.com\/.+/,
        options: [{
                name: "Опубликовать контент",
                selector: baseSelector("div[data-ad-comet-preview=message],div[role=article] div[id]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            },
            {
                name: "Область комментариев",
                selector: baseSelector("div[role=article] div>span[dir=auto][lang]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            }
        ]
    },
    {
        name: 'reddit general',
        matcher: /https:\/\/www\.reddit\.com\/.*/,
        options: [{
                name: 'Заголовок сообщения',
                selector: baseSelector("*[slot=title][id|=post-title]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Опубликовать контент",
                selector: baseSelector("div[slot=text-body]>div>div[id*=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Область комментариев",
                selector: baseSelector("div[slot=comment]>div[id$=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: '5ch Comments',
        matcher: /https?:\/\/(?:.*?\.|)5ch\.net\/.*/,
        options: [{
                name: "Название",
                selector: baseSelector('.post>.post-content,#threadtitle,.thread_title'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "контент",
                selector: baseSelector('.threadview_response_body'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'чат Discord',
        matcher: /https:\/\/discord\.com\/.+/,
        options: [{
            name: "Содержимое чата",
            selector: baseSelector('div[class*=messageContent]'),
            textGetter: baseTextGetter,
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'телеграм чат новый',
        matcher: /https:\/\/.*\.telegram\.org\/(?:a|z)\//,
        options: [{
            name: "Содержимое чата",
            selector: baseSelector('p.text-content[dir=auto],div.text-content'),
            textGetter: e => Array.from(e.childNodes).filter(item => !item.className).map(item => item.nodeName === "BR" ? "\n" : item.textContent).join(' '),
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'чат телеграмм',
        matcher: /https:\/\/.*\.telegram\.org\/.+/,
        options: [{
            name: "Содержимое чата",
            selector: baseSelector('div.message[dir=auto],div.im_message_text'),
            textGetter: e => Array.from(e.childNodes).filter(item => !item.className || item.className === 'translatable-message').map(item => item.nodeValue || item.innerText).join(" "),
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'quora general',
        matcher: /https:\/\/www\.quora\.com/,
        options: [{
                name: "Название",
                selector: baseSelector(".puppeteer_test_question_title>span>span"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.parentNode.parentNode.style.cssText = options.element.parentNode.parentNode.style.cssText.replace(/-webkit-line-clamp.*?;/, '');
                    baseTextSetter(options).style.display = 'flex';
                },
            },
            {
                name: "Опубликовать контент",
                selector: baseSelector('div.q-text>span>span.q-box:has(pq-text),div.q-box>div.q-box>div.q-text>span.q-box:has(pq-text)'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'комментарии тикток',
        matcher: /https:\/\/www\.tiktok\.com/,
        options: [{
            name: "Область комментариев",
            selector: baseSelector('p[data-e2e|=comment-level]'),
            textGetter: baseTextGetter,
            textSetter: baseTextSetter,
        }]
    },
    {
        name: "Комментарии Instagram",
        matcher: /https:\/\/www\.instagram\.com/,
        options: [{
            name: "Область комментариев",
            selector: baseSelector('li>div>div>div>div>span[dir=auto]'),
            textGetter: baseTextGetter,
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'threads',
        matcher: /https:\/\/www\.threads\.net/,
        options: [{
            name: "Пост",
            selector: baseSelector('div[data-pressable-container=true][data-interactive-id]>div>div:last-child>div>div:has(span[dir=auto]):not(:has(div[role=button]))'),
            textGetter: baseTextGetter,
            textSetter: baseTextSetter,
        }]
    },
    {
        name: 'github',
        matcher: /https:\/\/github\.com\/.+\/.+\/\w+\/\d+/,
        options: [{
                name: "проблемы",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p", items => items.filter(i => {
                    const nodeNameList = [...new Set([...i.childNodes].map(i => i.nodeName))];
                    return nodeNameList.length > 1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text");
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "обсуждения",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p", items => items.filter(i => {
                    const nodeNameList = [...new Set([...i.childNodes].map(i => i.nodeName))];
                    return nodeNameList.length > 1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text");
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
        ]
    },
    {
        name: 'bsky',
        matcher: /https:\/\/bsky\.app/,
        options: [{
                name: "Домашняя запись",
                selector: baseSelector('div[dir=auto][data-testid=postText]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Контент-посты и ответы",
                selector: baseSelector('div[data-testid^="postThreadItem-by"] div[dir=auto][data-word-wrap]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
];

const GetActiveRule = () => rules.find(item => item.matcher.test(document.location.href) && GM_getValue('enable_rule:' + item.name, true));

(function() {
    'use strict';
    let url = document.location.href;
    let rule = GetActiveRule();
    setInterval(() => {
        if (document.location.href !== url) {
            url = document.location.href;
            const ruleNew = GetActiveRule();
            if (ruleNew !== rule) {
                if (ruleNew !== null) {
                    console.log(`[Переводческая машина] обнаружила изменение URL и перешла на использование правила [${ruleNew.name}]`);
                } else {
                    console.log("[Переводческая машина] обнаружила изменение URL-адреса, в настоящее время нет соответствующих правил");
                }
                rule = ruleNew;
            }
        }
    }, 200);
    console.log(rule ? `[Машина перевода] использует правило [${rule.name}]` : "[Машина перевода] в настоящее время не имеет соответствующего правила");
    console.log(document.location.href);

    let main = _ => {
        if (!rule) return;
        const choice = GM_getValue('translate_choice', 'Google Переводчик');
        for (const option of rule.options) {
            if (!GM_getValue("enable_option:" + rule.name + "-" + option.name, true)) {
                continue;
            }
            const temp = [...new Set(option.selector())];
            for (let i = 0; i < temp.length; i++) {
                const now = temp[i];
                if (globalProcessingSave.includes(now)) continue;
                globalProcessingSave.push(now);
                const rawText = option.textGetter(now);
                const text = remove_url ? url_filter(rawText) : rawText;
                if (text.length === 0) {
                    removeItem(globalProcessingSave, now);
                    continue;
                }
                const setterParams = {
                    element: now,
                    translateName: choice,
                    rawText: rawText,
                    rule: rule,
                    option: option
                };
                if (sessionStorage.getItem(choice + '-' + text)) {
                    setterParams.text = sessionStorage.getItem(choice + '-' + text);
                    option.textSetter(setterParams);
                    removeItem(globalProcessingSave, now);
                } else {
                    pass_lang(text).then(lang => transdict[choice](text, lang)).then(s => {
                        setterParams.text = s;
                        option.textSetter(setterParams);
                        if (s) sessionStorage.setItem(choice + '-' + text, s);
                        removeItem(globalProcessingSave, now);
                    }).catch(error => {
                        console.error("Ошибка перевода:", error);
                        removeItem(globalProcessingSave, now);
                    });
                }
            }
        }
    };
    PromiseRetryWrap(startup[GM_getValue('translate_choice', 'Google Переводчик')]).then(() => {
        document.js_translater = setInterval(main, 20);
        initPanel();
    }).catch(error => {
        console.error("Ошибка при запуске: ", error);
        initPanel();
    });
})();