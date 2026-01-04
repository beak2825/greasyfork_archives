// ==UserScript==
// @name         Faucet Bot and Solver Ablinks
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Solves AbLink images, automates Faucet claiming, now with local self-learning cache, error cleanup, and fast timer skip.
// @author       Groland

// @match        https://claimcoin.in/*
// @match        https://tpi.li/*
// @match        https://freeltc.fun/*
// @match        https://cheaplann.com/*
// @match        https://gamerlee.com/*
// @match        https://bitupdate.info/*
// @match        https://earnsolana.xyz/*
// @match        https://linksfly.link/*
// @match        https://redzonebit.com/*
// @match        https://fc-lc.xyz/*
// @match        https://cloudhostingz.com/*
// @match        https://claimcrypto.in/*
// @match        https://freesolana.top/*
// @match        https://mixfaucet.com/*
// @match        https://cuttlinks.com/*
// @match        https://oii.io/*
// @match        https://chillfaucet.in/*
// @match        https://sharedwebs.com/*
// @match        https://excoinbit.online/*
// @match        https://dogezone.xyz/*
// @match        https://exe-links.com/*
// @match        https://wheelofgold.com/*
// @match        https://aii.sh/*
// @match        https://oii.la/*
// @match        https://ensureguide.com/*
// @match        https://techbixby.com/*
// @match        https://www.maqal360.com/*
// @match        https://hotfaucet.in/*
// @match        https://claimcrypto.in/*
// @match        https://www.diudemy.com/*
// @match        https://fitnessplanss.com/*
// @match        https://serverguidez.com/*
// @match        https://mix-zero.xyz/*
// @match        https://blog.adlink.click/*
// @match        https://fc-lc.xyz/*
// @match        https://cryptofuture.co.in/*
// @match        https://onlyfaucet.com/*
// @match        https://aknewz.xyz/*
// @match        https://lnbz.la/*
// @match        https://jobzhub.store/*
// @match        https://ex-faucet.xyz/*
// @match        https://lnbz.la/*
// @match        https://healthmyst.com/*
// @match        https://excoinbit.online/*
// @match        https://monsterp2e.space/*
// @match        https://vpshostplans.com/*
// @match        https://claimfreecoins.io/*
// @match        https://coinymate.com/*
// @match        https://coinvaganza.xyz/*
// @match        https://freeltc.in/*
// @match        https://claimbox.xyz/*
// @match        https://claimcrypto.in/*
// @match        https://earncryptowrs.in/*
// @noframes
// @connect      https://unpkg.com
// @require      https://unpkg.com/opencv.js@1.2.1/opencv.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jimp/0.16.1/jimp.min.js
// @require      https://unpkg.com/jimp@0.5.2/browser/lib/jimp.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.13.0/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/483628/Faucet%20Bot%20and%20Solver%20Ablinks.user.js
// @updateURL https://update.greasyfork.org/scripts/483628/Faucet%20Bot%20and%20Solver%20Ablinks.meta.js
// ==/UserScript==

/* global cv, Jimp, Tesseract, grecaptcha, unsafeWindow, Buffer */

(function() {
    'use strict';

    // --- НАСТРОЙКИ УТИЛИТ (ВЗЯТЫ ИЗ ПЕРВОГО СКРИПТА) ---
    const CAPTCHA_INPUT_SELECTOR = '#captchaInput';
    const SKIP_BUTTON_SELECTOR   = '.skip-btn';
    const ALERT_SELECTOR         = '.alert-danger.alert';
    const ERROR_TEXT_PART        = 'The code is invalid, try again.';
    const TIMER_TEXT             = '1'; // 💡 Текст для обнаружения таймера и клика по .skip-btn
    const FAST_POLL_INTERVAL     = 1000; // 1 секунда
    const CAPTCHA_FORM_SELECTOR  = '#captchaForm';
    const SEARCH_TEXT            = 'satoshi was sent to your';
    const SEARCH_TEXT2           = 'You have to wait';
    // ----------------------------------------------------


    // === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ AB LINKS ===
    var questions = [];
    var questionImages = [];
    var questionImage = "";
    var questionImageSource = "";
    var numericWordArray = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    var worker = ""; // Tesseract worker
    // --- ГЛОБАЛЬНЫЙ СТАТУС ДЛЯ ПРОВЕРКИ ЗАВЕРШЕНИЯ AB LINKS ---
    window.ablinks_status = 'pending';
    // ----------------------------------------------------

    // ----------------------------------------------------
    // 👇👇👇 ФУНКЦИЯ ДЛЯ ЗАДЕРЖКИ (СНА) 👇👇👇
    // ----------------------------------------------------
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // ----------------------------------------------------
    // 👆👆👆 КОНЕЦ ФУНКЦИИ ЗАДЕРЖКИ 👆👆👆
    // ----------------------------------------------------

    // ----------------------------------------------------
    // 👇👇👇 СТИЛЬНАЯ КОНСОЛЬ (ВАША ЛОГИКА) 👇👇👇
    // ----------------------------------------------------
    var consoleBox = document.createElement('div');
    consoleBox.id = 'myConsole';

    // Стили консоли
    consoleBox.style.position = 'fixed';
    consoleBox.style.top = '0';
    consoleBox.style.right = '0';
    consoleBox.style.width = '300px';
    consoleBox.style.maxHeight = '100px';
    consoleBox.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    consoleBox.style.overflowY = 'auto';
    consoleBox.style.border = '2px solid #4CAF50';
    consoleBox.style.padding = '5px';
    consoleBox.style.borderRadius = '5px';
    consoleBox.style.textAlign = 'left';
    consoleBox.style.color = '#fff';
    consoleBox.style.zIndex = '99999';
    consoleBox.style.fontFamily = 'monospace, sans-serif';
    consoleBox.style.fontSize = '12px';

    document.body.appendChild(consoleBox);

    // КНОПКА ДЛЯ СКРЫТИЯ/ПОКАЗА КОНСОЛИ
    var toggleButton = document.createElement('button');
    toggleButton.textContent = '✖️';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '0';
    toggleButton.style.right = '300px';
    toggleButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '100000';
    toggleButton.style.borderRadius = '0 0 0 5px';
    toggleButton.title = 'Скрыть/Показать консоль скрипта';

    let isConsoleVisible = true;
    toggleButton.onclick = function() {
        if (isConsoleVisible) {
            consoleBox.style.display = 'none';
            toggleButton.textContent = '⚙️';
            toggleButton.style.right = '0';
        } else {
            consoleBox.style.display = 'block';
            toggleButton.textContent = '✖️';
            toggleButton.style.right = '300px';
        }
        isConsoleVisible = !isConsoleVisible;
    };
    document.body.appendChild(toggleButton);

    // Функция для вывода сообщений в консоль с автопрокруткой (myLog)
    let logCount = 0;
    function myLog(message) {
        // Выводим в обычную консоль для отладки
        console.log(`[FaucetBot/ABLinks] ${message}`);

        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';

        // Стильный вывод для кэша и ошибок
        let styledMessage = message
            .replace(/Cache HIT!/g, '<span style="color: yellow; font-weight: bold;">✨ Cache HIT!</span>')
            .replace(/Cache MISS/g, '<span style="color: orange; font-weight: bold;">Cache MISS</span>')
            .replace(/✅ Saved/g, '<span style="color: #39FF14; font-weight: bold;">✅ Saved</span>')
            .replace(/❌/g, '<span style="color: red; font-weight: bold;">❌</span>')
            .replace(/⚠️/g, '<span style="color: #ffc107; font-weight: bold;">⚠️</span>')
            .replace(/➡️/g, '<span style="color: #17a2b8; font-weight: bold;">➡️</span>');


        p.innerHTML = `[${new Date().toLocaleTimeString()}] ${styledMessage}`;

        if (logCount % 2 === 0) {
            p.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        }
        p.style.margin = '2px 0';
        p.style.padding = '1px 5px';

        // Добавляем в начало, чтобы видеть самые новые сверху
        consoleBox.prepend(p);

        // Удаление старых записей
        while (consoleBox.children.length > 50) {
            consoleBox.removeChild(consoleBox.lastChild);
        }

        logCount++;
    }

    // Инициализация консоли
    myLog('✔️ Комбинированный скрипт загружен. Ожидаем Cloudflare...');

    // ----------------------------------------------------
    // 👆👆👆 КОНЕЦ СТИЛЬНОЙ КОНСОЛИ 👆👆👆
    // ----------------------------------------------------


    // ----------------------------------------------------
    // 👇👇👇 ФУНКЦИИ КЭШИРОВАНИЯ (Добавлены) 👇👇👇
    // ----------------------------------------------------

    /** Создает простой хеш из Base64 данных изображения. */
    function createImageHash(dataURL) {
        if (!dataURL) return null;
        // Используем более длинный хеш для надежности AB Links
        return dataURL.substring(0, 150);
    }

    /** Получает ответ из локального кэша (GM_getValue). */
    function getCachedAnswer(imageHash) {
        const cacheKey = 'ablinks_solver_cache_v1';
        try {
            const cachedData = GM_getValue(cacheKey, '{}');
            const cache = JSON.parse(cachedData);
            return cache[imageHash] || null;
        } catch (e) {
            myLog(`Error reading cache: ${e.message}`);
            return null;
        }
    }

    /** Сохраняет пару "хеш -> ответ" в локальный кэш (GM_setValue). */
    function setCachedAnswer(imageHash, answerIndexes) {
        const cacheKey = 'ablinks_solver_cache_v1';
        try {
            const cachedData = GM_getValue(cacheKey, '{}');
            const cache = JSON.parse(cachedData);
            cache[imageHash] = answerIndexes;
            GM_setValue(cacheKey, JSON.stringify(cache));
            myLog(`✅ Saved to local cache: [${answerIndexes.join(',')}]`);
        } catch (e) {
            myLog(`Error saving to cache: ${e.message}`);
        }
    }

    /** Получает Base64-представление изображения. */
    function getImageBase64(img) {
        if (img.src.startsWith('data:')) {
            return img.src;
        }
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // Возвращаем Base64 для кэша
            return canvas.toDataURL('image/png');
        } catch (e) {
            myLog(`Error converting image to Base64: ${e.message}`);
            return null;
        }
    }
    // ----------------------------------------------------
    // 👆👆👆 КОНЕЦ ФУНКЦИЙ КЭШИРОВАНИЯ 👆👆👆
    // ----------------------------------------------------

    // ----------------------------------------------------
    // 👇👇👇 ФУНКЦИИ УТИЛИТ (ОЧИСТКА + ПРОПУСК ТАЙМЕРА) 👇👇👇
    // ----------------------------------------------------

    function ensureSkipButtonIsVisible() {
        const skipButton = document.querySelector(SKIP_BUTTON_SELECTOR);
        if (skipButton) {
            skipButton.style.display = 'block';
            skipButton.style.visibility = 'visible';
            skipButton.style.opacity = '1';
            // myLog(`✅ Кнопка "${SKIP_BUTTON_SELECTOR}" сделана принудительно видимой.`);
        }
    }
function trustvisible () {
  const blockcaptcha = document.querySelector(".cf-turnstile");
  if (blockcaptcha) {
     blockcaptcha.style.display = 'block';
     blockcaptcha.style.visibility = 'visible';
     blockcaptcha.style.opacity = '1';
  }
}
    /**
     * @function clearInputOnFastPoll
     * @description Быстрое обнаружение ошибки и очистка поля ввода.
     */
    function clearInputOnFastPoll() {
        const inputElement = document.querySelector(CAPTCHA_INPUT_SELECTOR);
        const errorAlert = document.querySelector(ALERT_SELECTOR);

        if (errorAlert && inputElement && inputElement.value !== '') {
            const alertTextNormalized = errorAlert.textContent
                                                .trim()
                                                .replace(/\s+/g, ' ')
                                                .toLowerCase();

            const errorTextNormalized = ERROR_TEXT_PART.toLowerCase();

            if (alertTextNormalized.includes(errorTextNormalized)) {
                inputElement.value = '';
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                myLog(`⚠️ Обнаружена ошибка по ключевому тексту (FAST POLL)! Поле ввода очищено.`);
            }
        }
    }

    /**
     * @function clickSkipButtonOnTimer
     * @description Быстрое обнаружение текста TIMER_TEXT и клик по SKIP_BUTTON_SELECTOR.
     */
    function clickSkipButtonOnTimer() {
        // Убедимся, что кнопка Skip видна, если она существует
        ensureSkipButtonIsVisible();

        const skipButton = document.querySelector(SKIP_BUTTON_SELECTOR);
        // Проверяем body.textContent, чтобы избежать поиска скрытых элементов
        const pageText = document.body.textContent.toLowerCase();

        // Проверяем, что кнопка пропуска существует И что на странице есть текст таймера
        if (skipButton && pageText.includes(TIMER_TEXT.toLowerCase())) {
            skipButton.click();
            myLog(`➡️ Обнаружен текст таймера "${TIMER_TEXT}". Нажата кнопка пропуска "${SKIP_BUTTON_SELECTOR}".`);
        }
      if (pageText.includes(SEARCH_TEXT.toLowerCase())){
        window.location.reload();
      }
      if (pageText.includes(SEARCH_TEXT2.toLowerCase())){
        setTimeout(() => {window.location.reload();}, 10000);
      }
    }


    // ----------------------------------------------------
    // 👆👆👆 КОНЕЦ ФУНКЦИЙ УТИЛИТ 👆👆👆
    // ----------------------------------------------------


    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ FAUCET BOT (Без изменений) ===
    const bp = query => document.querySelector(query);
    const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {
        let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector;
        myLog(`[Submit] Попытка отправить форму: ${elem ? 'найдена' : 'не найдена'}`);
        setTimeout(() => { if (elem) elem.submit(); }, time * 1000);
    }
    function elementReady(selector) {
        return new Promise(function(resolve, reject) {
            let element = bp(selector);
            if (element) { resolve(element); return; }
            new MutationObserver(function(_, observer) {
                element = bp(selector);
                if (element) { resolve(element); observer.disconnect(); }
            }).observe(document.documentElement, { childList: true, subtree: true });
        });
    }
    function ReadytoClick(selector, sleepTime = 0) {
        const events = ["mouseover", "mousedown", "mouseup", "click"];
        const selectors = selector.split(', ');
        if (selectors.length > 1) { return selectors.forEach(s => ReadytoClick(s, sleepTime)); }
        if (sleepTime > 0) {
            myLog(`[Click] Ожидание ${sleepTime} секунд перед кликом по ${selector}...`);
            return sleep(sleepTime * 1000).then(function() { ReadytoClick(selector, 0); });
        }
        elementReady(selector).then(function(element) {
            myLog(`[Click] ➡️ Кликаем по элементу: ${selector}`);
            element.removeAttribute('disabled');
            element.removeAttribute('target');
            events.forEach(eventName => {
                const eventObject = new MouseEvent(eventName, { bubbles: true });
                element.dispatchEvent(eventObject);
            });
        });
    }
    function isCaptchaChecked() {
        return typeof grecaptcha !== 'undefined' && grecaptcha.getResponse() && grecaptcha.getResponse().length !== 0;
    }
    // === КОНЕЦ ВСПОМОГАТЕЛЬНЫХ ФУНКЦИЙ FAUCET BOT ===


    // === ФУНКЦИИ OCR И AB LINKS (оставлены как есть) ===

    // Вспомогательные функции для OCR и AB Links:
    async function waitForImage(imgElement) { /* ... (ваш код) ... */
        return await new Promise(res => {
            if (imgElement.complete) {
                return res();
            }
            imgElement.onload = () => res();
            imgElement.onerror = () => res();
        });
    }

    async function toDataURL(c){ /* ... (ваш код) ... */
        return await new Promise(function(resolve){
            const dataURI = c.toDataURL('image/png');
            return resolve(dataURI);
        })
    }

    async function removeNoiseUsingImageData(imgdata,width,height,threshold){ /* ... (ваш код) ... */
        return await new Promise(function(resolve){
            var noiseCount =0;
            var noiseRowStart = 0;
            for (let column = 0; column < width; column++) {
                let count = 0;
                for (let row = 0; row < height; row++) {

                    let position = row * width + column;
                    let pixelAtPosition = imgdata[position];

                    //Remove noise from first row and last row
                    if(row == 0 || row == height-1){
                        imgdata[position] = 0xFFFFFFFF;
                    }

                    if (pixelAtPosition == 0xFF000000){
                        if(noiseCount == 0){
                            noiseRowStart = row;
                        }
                        noiseCount++;
                    }else{
                        //Define the number of consecutive pixels to be considered as noise
                        if(noiseCount > 0 && noiseCount <= threshold){
                            //Start from noiseRow till current row and remove noise
                            while(noiseRowStart < row){
                                let noisePosition = noiseRowStart * width + column;
                                imgdata[noisePosition] = 0xFFFFFFFF;
                                noiseRowStart++;
                            }
                        }
                        noiseCount =0;
                    }
                }
            }
            return resolve(imgdata);
        })
    }

    async function imageUsingOCRAntibotQuestion(image) { /* ... (ваш код) ... */
        if (!image || !image.src) { myLog("No images found"); return; }
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        await ctx.putImageData(imageData, 0, 0);
        let src = await cv.imread(c); let dst = new cv.Mat(); let ksize = new cv.Size(3, 3);
        await cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
        await cv.imshow(c, dst); src.delete(); dst.delete();
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotLowValues(image) { /* ... (ваш код) ... */
        if (!image || !image.src) { myLog("No images found"); return; }
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] < 100 || data[i + 1] < 100 || data[i + 2] < 100) && data[i+3]>0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }
        var imgdata = await new Uint32Array(data.buffer);
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        await ctx.putImageData(imageData, 0, 0);
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotHighValues(image) { /* ... (ваш код) ... */
        if (!image || !image.src) { myLog("No images found"); return; }
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] > 100 || data[i + 1] > 100 || data[i + 2] > 100) && data[i + 3] > 0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }
        var imgdata = await new Uint32Array(data.buffer);
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        await ctx.putImageData(imageData, 0, 0);
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function splitImageUsingOCRAntibotLowValues(questionImageSource, answerImagesLength) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = questionImageSource; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] < 100 || data[i + 1] < 100 || data[i + 2] < 100) && data[i+3]>0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }
        await ctx.putImageData(imageData, 0, 0); let imageDataURI = await toDataURL(c);
        if(answerImagesLength == 3){ return await splitImageByThree(imageDataURI); }
        return await (splitImage(imageDataURI));
    }

    async function splitImageUsingDefaultValues(questionImageSource, answerImagesLength) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = questionImageSource; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 0 && data[i + 1] > 0 && data[i + 2] > 100 && data[i+3]>0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }
        var imgdata = await new Uint32Array(data.buffer);
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        await ctx.putImageData(imageData, 0, 0); let imageDataURI = await toDataURL(c);
        if(answerImagesLength == 3){ return await splitImageByThree(imageDataURI); }
        return await splitImage(imageDataURI);
    }

    async function splitImageUsingOCRAntibotHighValues(questionImageSource, answerImagesLength) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = questionImageSource; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if ((data[i] > 100 || data[i + 1] > 100 || data[i + 2] > 100) && data[i + 3] > 0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
            data[i + 3] = 255;
        }
        var imgdata = await new Uint32Array(data.buffer);
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        await ctx.putImageData(imageData, 0, 0); let imageDataURI = await toDataURL(c);
        if(answerImagesLength == 3){ return await splitImageByThree(imageDataURI); }
        return await splitImage(imageDataURI);
    }

    async function splitImage(imgSource) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgSource; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        var imgdata = await new Uint32Array(data.buffer);
        var sequenceLength = 0; var prevColumn = 0; var hashMap = new Map(); var first = 0; var second = 0; var third = 0;
        var firstMaxColumn = 0; var secondMaxColumn = 0; var thirdMaxColumn = 0;
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        for (let column = Math.floor(0.1 * c.width); column < c.width; column++) {
            var count = 0;
            for (let row = 0; row < c.height; row++) {
                var position = row * c.width + column;
                var pixelAtPosition = imgdata[position];
                if (pixelAtPosition == 0xFFFFFFFF) { count++; }
            }
            if (count > Math.floor(0.88 * c.height) && column != 0) {
                if (column - prevColumn == 1) { sequenceLength = sequenceLength + 1; }
            } else {
                if ((column - sequenceLength != 1) && (column != 0 || sequenceLength != 0 || column != c.width - 1)) {
                    if (sequenceLength > first) {
                        third = second; thirdMaxColumn = secondMaxColumn; second = first; secondMaxColumn = firstMaxColumn;
                        first = sequenceLength; firstMaxColumn = column - 1;
                    } else if (sequenceLength > second) {
                        third = second; thirdMaxColumn = secondMaxColumn; second = sequenceLength; secondMaxColumn = column - 1;
                    } else if (sequenceLength > third) {
                        third = sequenceLength; thirdMaxColumn = column - 1;
                    }
                }
                sequenceLength = 0;
            }
            prevColumn = column;
        }
        firstMaxColumn = firstMaxColumn - Math.floor(first / 2); secondMaxColumn = secondMaxColumn - Math.floor(second / 2);
        thirdMaxColumn = thirdMaxColumn - Math.floor(third / 2);
        var columnArray = [firstMaxColumn, secondMaxColumn, thirdMaxColumn];
        columnArray = await columnArray.sort(function(a, b) { return a - b; });
        await ctx.putImageData(imageData, 0, 0);
        let url = await questionImage.src.replace(/^data:image\/\w+;base64,/, ""); let buffer = await new Buffer(url, 'base64');
        var len = []; len[0] = columnArray[0] - 0; len[1] = columnArray[1] - columnArray[0]; len[2] = columnArray[2] - columnArray[1];
        len[3] = c.width - columnArray[2];
        for (let i = 0; i < len.length; i++) {
            if (len[i] < Math.floor(0.1 * c.width)) { myLog("Overlap detected"); return; break; }
        }

        // Jimp image cropping and assignment to questionImages[0]...[3]
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(0, 0, columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    let img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[0] = img; resolve();
                })
            });
        });
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[0], 0, columnArray[1] - columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[1] = img; resolve();
                })
            });
        });
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[1], 0, columnArray[2] - columnArray[1], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[2] = img; resolve();
                })
            });
        });
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[2], 0, c.width - columnArray[2], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[3] = img; resolve();
                })
            });
        });
    }

    async function splitImageByThree(imgSource) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = imgSource; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img.width; c.height = img.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        var imgdata = await new Uint32Array(data.buffer);
        var sequenceLength = 0; var prevColumn = 0; var hashMap = new Map(); var first = 0; var second = 0; var firstMaxColumn = 0;
        var secondMaxColumn = 0;
        imgdata = await removeNoiseUsingImageData(imgdata,c.width,c.height,1);
        for (let column = Math.floor(0.1 * c.width); column < c.width; column++) {
            var count = 0;
            for (let row = 0; row < c.height; row++) {
                var position = row * c.width + column;
                var pixelAtPosition = imgdata[position];
                if (pixelAtPosition == 0xFFFFFFFF) { count++; }
            }
            if (count > Math.floor(0.88 * c.height) && column != 0) {
                if (column - prevColumn == 1) { sequenceLength = sequenceLength + 1; }
            } else {
                if ((column - sequenceLength != 1) && (column != 0 || sequenceLength != 0 || column != c.width - 1)) {
                    if (sequenceLength > first) {
                        second = first; secondMaxColumn = firstMaxColumn; first = sequenceLength; firstMaxColumn = column - 1;
                    } else if (sequenceLength > second) {
                        second = sequenceLength; secondMaxColumn = column - 1;
                    }
                }
                sequenceLength = 0;
            }
            prevColumn = column;
        }
        firstMaxColumn = firstMaxColumn - Math.floor(first / 2); secondMaxColumn = secondMaxColumn - Math.floor(second / 2);
        var columnArray = [firstMaxColumn, secondMaxColumn];
        columnArray = await columnArray.sort(function(a, b) { return a - b; });
        await ctx.putImageData(imageData, 0, 0);
        let url = await questionImage.src.replace(/^data:image\/\w+;base64,/, ""); let buffer = await new Buffer(url, 'base64');
        var len = []; len[0] = columnArray[0] - 0; len[1] = columnArray[1] - columnArray[0]; len[2] = c.width - columnArray[1];
        for (let i = 0; i < len.length; i++) {
            if (len[i] < Math.floor(0.1 * c.width)) { myLog("Overlap detected"); return; break; }
        }

        // Jimp image cropping and assignment to questionImages[0]...[2]
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(0, 0, columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    let img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[0] = img; resolve();
                })
            });
        });
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[0], 0, columnArray[1] - columnArray[0], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[1] = img; resolve();
                })
            });
        });
        await new Promise((resolve, reject) => {
            Jimp.read(buffer).then(async function(data) {
                await data.crop(columnArray[1], 0, c.width - columnArray[1], questionImage.height)
                    .getBase64(Jimp.AUTO, async function(err, src) {
                    var img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; await waitForImage(img);
                    questionImages[2] = img; resolve();
                })
            });
        });
    }

    async function imageUsingOCRAntibotQuestion1(image) { /* ... (ваш код) ... */
        if (!image || !image.src) { myLog("No images found"); return; }
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = image.width; c.height = image.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        await ctx.putImageData(imageData, 0, 0);
        let src = await cv.imread(c); let dst = new cv.Mat();
        await cv.medianBlur(src, dst, 3); await cv.imshow(c, dst); src.delete(); dst.delete();
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibot1(image) { /* ... (ваш код) ... */
        var img1 = image;
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = img1.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = img1.width; c.height = img1.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        var hashMap = new Map();
        for (let i = 0; i < data.length; i += 4) {
            var rgba = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
            if (hashMap.has(rgba)) { hashMap.set(rgba, hashMap.get(rgba) + 1) } else { hashMap.set(rgba, 1) }
        }
        var data_tmp = []; var data_tmp_edges = [];
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 130 && data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
                data_tmp_edges[i] = 1; data_tmp_edges[i + 1] = 1; data_tmp_edges[i + 2] = 1;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
            }
        }
        await ctx.putImageData(imageData, 0, 0); let imageDataURI = await toDataURL(c);
        return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotFiltered(image) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = image.width; c.height = image.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 130 && data[i] < 100) {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
            } else {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
            }
        }
        await ctx.putImageData(imageData, 0, 0);
        let src = await cv.imread(c); let dst = new cv.Mat(); let M = cv.Mat.ones(2, 1, cv.CV_8U); let anchor = new cv.Point(-1, -1);
        await cv.morphologyEx(src, dst, cv.MORPH_OPEN, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst); src = await cv.imread(c); M = cv.Mat.ones(2, 1, cv.CV_8U);
        await cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue()); await cv.imshow(c, dst);
        src.delete(); dst.delete(); M.delete();
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibotFiltered1(image) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = image.width; c.height = image.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 130 && data[i] > 70) {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
            } else {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
            }
        }
        await ctx.putImageData(imageData, 0, 0);
        let src = await cv.imread(c); let dst = new cv.Mat(); let M = cv.Mat.ones(2, 1, cv.CV_8U); let anchor = new cv.Point(-1, -1);
        await cv.morphologyEx(src, dst, cv.MORPH_OPEN, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        await cv.imshow(c, dst); src = await cv.imread(c); M = cv.Mat.ones(2, 1, cv.CV_8U);
        await cv.erode(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue()); await cv.imshow(c, dst);
        src.delete(); dst.delete(); M.delete();
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCRAntibot(image) { /* ... (ваш код) ... */
        var img = new Image(); img.crossOrigin = 'anonymous'; img.src = image.src; await waitForImage(img);
        var c = document.createElement("canvas"); c.width = image.width; c.height = image.height; var ctx = c.getContext("2d");
        await ctx.drawImage(img, 0, 0); var imageData = await ctx.getImageData(0, 0, c.width, c.height); var data = await imageData.data;
        var hashMap = new Map();
        for (let i = 0; i < data.length; i += 4) {
            var rgba = data[i] + ',' + data[i + 1] + ',' + data[i + 2] + ',' + data[i + 3];
            if (hashMap.has(rgba)) { hashMap.set(rgba, hashMap.get(rgba) + 1) } else { hashMap.set(rgba, 1) }
        }
        var maxCount = 0; var objectKey = "0,0,0,0";
        await hashMap.forEach((value, key) => {
            if (maxCount < value && key != "0,0,0,0") { objectKey = key; maxCount = value; }
        });
        var alphaValues = objectKey.split(","); var alpha = Number(alphaValues[alphaValues.length - 1]);
        var data_tmp = []; var data_tmp_edges = [];
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] == alpha) {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
                data_tmp[i] = 1; data_tmp[i + 1] = 1; data_tmp[i + 2] = 1;
            } else if (data[i + 3] > 0) {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
                data_tmp_edges[i] = 1; data_tmp_edges[i + 1] = 1; data_tmp_edges[i + 2] = 1;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
            }
        }
        for (let k = 0; k < 20; k++) {
            for (let i = 4; i < data.length; i += 4) {
                if (data[i] == 0 && data_tmp[i - 4] == 1) {
                    data[i - 4] = 0; data[i - 3] = 0; data[i - 2] = 0; data[i - 1] = 255;
                }
            }
        }
        await ctx.putImageData(imageData, 0, 0);
        let imageDataURI = await toDataURL(c); return await (imageUsingOCR(imageDataURI));
    }

    async function imageUsingOCR(img) { /* ... (ваш код) ... */
        var answer = "";
        if (!worker) { worker = await new Tesseract.createWorker(); }
        if(!img || img.width ==0 || img.height == 0){ myLog("OCR cannot be performed on this image"); return ""; }
        try {
            await worker.load(); await worker.loadLanguage('eng'); await worker.initialize('eng');
            await worker.setParameters({
                tessedit_pageseg_mode: '6', preserve_interword_spaces: '1',
                tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,@!*+',
            });
            await worker.recognize(img, "eng").then(async function(result) {
                answer = result.data.text.trim();
                myLog("Captcha Answer::" + answer);
            });
        } catch (err) {
            myLog(err.message); await worker.terminate();
        }
        return answer;
    }

    var LevenshteinDistance = function(a, b) { /* ... (ваш код) ... */
        if (a.length == 0) return b.length;
        if (b.length == 0) return a.length;
        var matrix = [];
        var i;
        for (i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        var j;
        for (j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                                            Math.min(matrix[i][j - 1] + 1,
                                                     matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    };

    function countPairs(s1, s2) { /* ... (ваш код) ... */
        var n1 = s1.length; var n2 = s2.length;
        let freq1 = new Array(26); let freq2 = new Array(26);
        freq1.fill(0); freq2.fill(0);
        let i, count = 0;
        for (i = 0; i < n1; i++) freq1[s1[i].charCodeAt() - 'a'.charCodeAt()]++;
        for (i = 0; i < n2; i++) freq2[s2[i].charCodeAt() - 'a'.charCodeAt()]++;
        for (i = 0; i < 26; i++) count += (Math.min(freq1[i], freq2[i]));
        return count;
    }

    async function getFinalOCRResultFromImage(image,leastLength){ /* ... (ваш код) ... */
        var ocrResult = ""; var tempResult = "";
        ocrResult = await imageUsingOCRAntibotLowValues(image);
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim(); } else {
            ocrResult = await imageUsingOCRAntibotHighValues(image);
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim(); } else {
            ocrResult = await imageUsingOCR(image);
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim(); } else {
            ocrResult = await imageUsingOCRAntibotQuestion(image);
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim(); } else {
            ocrResult = await imageUsingOCRAntibotQuestion1(image);
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim() } else {
            ocrResult = await imageUsingOCRAntibot(image)
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim() } else {
            ocrResult = await imageUsingOCRAntibot1(image);
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim() } else {
            ocrResult = await imageUsingOCRAntibotFiltered(image)
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim() } else {
            ocrResult = await imageUsingOCRAntibotFiltered1(image)
        }
        if (ocrResult.length > leastLength || ocrResult.length > tempResult.length) { tempResult = ocrResult.trim() }
        ocrResult = tempResult;
        return ocrResult;
    }


    // === КОНЕЦ ФУНКЦИЙ OCR И AB LINKS ===


    /**
     * @function ABLinksSolverLogic
     * @description Логика для решения ABLinks капчи.
     */
    async function ABLinksSolverLogic() {
        // Установка статуса 'in_progress'
        window.ablinks_status = 'in_progress';
        myLog('⏳ AB Links Solver: Начало работы...');

        // ... (Ваш код реферальных ссылок без изменений)
        if (window.location.href.includes("faucetpay.io/page/faucet-list") && document.querySelectorAll(".btn.btn-primary.btn-sm").length > 0) {
            myLog("[Referral] Обновление ссылок FaucetPay.");
            for (let i = 0; i < document.querySelectorAll(".btn.btn-primary.btn-sm").length; i++) {
                document.querySelectorAll(".btn.btn-primary.btn-sm")[i].href =
                    document.querySelectorAll(".btn.btn-primary.btn-sm")[i].href.replace(/\/$/, "") + "/?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
            }
        }


        if(window.location.href.includes("gr8.cc")){
            myLog("[Referral] Перехват window.open на gr8.cc.");
            var oldFunction = unsafeWindow.open;
            unsafeWindow.open= function(url){url = url.split("?r=")[0] + "?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5"; return oldFunction(url)}
            for(let i=0; i< document.querySelectorAll("a").length;i++){
                document.querySelectorAll("a")[i].removeAttribute("onmousedown");
                document.querySelectorAll("a")[i].href= document.querySelectorAll("a")[i].href.split("?r=")[0] + "?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
            }
        }

        // Основная логика ABLinks: Селекторы
        var answerSelector = "";
        var questionSelector = "";
        var addCount = 0;
        var leastLength = 0;
        var maxImages = 0;

        function reloadPageForNumericCaptcha() {
            myLog("🔥 Обнаружена числовая/римская капча. Перезагрузка страницы.");
            window.ablinks_status = 'failed_numeric';
            location.reload();
        }

        function waitForCloudflareAndRetry() {
            const cloudflareIndicator = document.querySelector('#hRmtl0');
            if (
                cloudflareIndicator &&
                (cloudflareIndicator.textContent.includes("Verifique que usted es un ser humano") ||
                 cloudflareIndicator.textContent.includes("Verifying you are human"))
            ) {
                myLog("⏳ Cloudflare validation in progress, waiting...");
                setTimeout(waitForCloudflareAndRetry, 1000);
            } else {
                myLog("❌ Ab links не найдены или страница не готова. Завершение работы AB Links Solver.");
                window.ablinks_status = 'not_found';
                if (typeof window.onAblinksComplete === 'function') {
                    window.onAblinksComplete();
                }
            }
        }


        if (document.querySelectorAll(".modal-content [href='/'] img").length == 4 && document.querySelectorAll(".modal-content img").length >= 5) {
            questionSelector = ".modal-content img";
            answerSelector = ".modal-content [href='/'] img";
        } else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 4) {
            questionSelector = ".modal-header img";
            answerSelector = ".modal-body [href='/'] img";
        } else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 4) {
            questionSelector = ".alert.alert-info img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
            questionSelector = ".alert.alert-warning img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='#'] img").length == 3) {
            questionSelector = ".alert.alert-warning img";
            answerSelector = ".antibotlinks [href='#'] img";
        } else if (document.querySelector(".sm\\:flex.items-center img") && document.querySelectorAll("[href='javascript:void(0)'] img").length == 3) {
            questionSelector = ".sm\\:flex.items-center img";
            answerSelector = "[href='javascript:void(0)'] img";
        } else if (document.querySelectorAll(".modal-content [href='/'] img").length == 3 && document.querySelectorAll(".modal-content img").length >= 4) {
            questionSelector = ".modal-content img";
            answerSelector = ".modal-content [href='/'] img";
        } else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 3) {
            questionSelector = ".modal-header img";
            answerSelector = ".modal-body [href='/'] img";
        } else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
            questionSelector = ".alert.alert-info img";
            answerSelector = ".antibotlinks [href='/'] img";
        } else {
            waitForCloudflareAndRetry();
            return;
        }

        var answerImagesLength = document.querySelectorAll(answerSelector).length;

        // Получаем изображение вопроса, конвертируем в Base64 для кэша
        const qImg = document.querySelector(questionSelector);
        if (!qImg || !qImg.src) {
             myLog("❌ Нет источника изображения для вопроса.");
             window.ablinks_status = 'failed_no_image';
             return;
        }
        questionImage = qImg;
        questionImageSource = qImg.src;
        await waitForImage(questionImage);

        // ----------------------------------------------------
        // 👇👇👇 ПРОВЕРКА КЭША (Новая логика) 👇👇👇
        // ----------------------------------------------------
        const imageBase64 = getImageBase64(questionImage);
        let imageHash = null;
        if (imageBase64) {
            imageHash = createImageHash(imageBase64);
            const cachedAnswerIndexes = getCachedAnswer(imageHash);

            if (cachedAnswerIndexes && Array.isArray(cachedAnswerIndexes) && cachedAnswerIndexes.length === answerImagesLength) {
                myLog(`✨ Cache HIT! Using cached sequence: [${cachedAnswerIndexes.join(', ')}]`);

                // Клик по сохраненным ответам
                for (let i = 0; i < answerImagesLength; i++) {
                    const answerIndex = cachedAnswerIndexes[i];
                    const targetElement = document.querySelectorAll(answerSelector)[answerIndex + addCount];
                    if (targetElement) {
                        myLog(`✔️ Кликаем по кэшированному ответу (индекс: ${answerIndex}).`);
                        // Используем click(), так как это стандартная логика в оригинальном коде
                        targetElement.click();
                        await sleep(2000);
                    } else {
                        myLog(`❌ Кэш-ответ ${answerIndex} не найден на странице.`);
                    }
                }

                // --- СИГНАЛ О ЗАВЕРШЕНИИ РАБОТЫ ЧЕРЕЗ КЭШ ---
                myLog("✅ AB Links Solver завершил работу (Cache HIT).");
                window.ablinks_status = 'completed';
                if (typeof window.onAblinksComplete === 'function') {
                    window.onAblinksComplete();
                }
                // ------------------------------------

                return; // Завершаем функцию, так как ответ найден в кэше
            }
            myLog("Cache MISS. Starting full OCR/Split process...");
        } else {
            myLog("⚠️ Не удалось получить Base64 для кэширования. Продолжаем полный OCR...");
        }
        // ----------------------------------------------------
        // 👆👆👆 КОНЕЦ ПРОВЕРКИ КЭША 👆👆👆
        // ----------------------------------------------------

        // Проверка 1: Изображения ответов слишком узкие/квадратные
        for (let i = 0; i < answerImagesLength; i++) {
            const img = document.querySelectorAll(answerSelector)[i];
            if (img.width <= img.height) {
                img.value = "####";
                myLog("⚠️ Обнаружена числовая/римская капча в ответах. Перезагрузка.");
                reloadPageForNumericCaptcha();
                return;
            }
        }

        // Проверка 2: Изображение вопроса слишком узкое
        if (qImg.width < (answerImagesLength + 1) * qImg.height) {
            qImg.value = "####";
            myLog("⚠️ Обнаружена числовая/римская капча в вопросе. Перезагрузка.");
            reloadPageForNumericCaptcha();
            return;
        }

        if (qImg.width < 10 * qImg.height) {
            leastLength = 2;
        } else {
            leastLength = 3;
        }

        myLog("🤖 Запуск AB Links Solver....");

        var optionImages = [];

        for (let i = 0; i < answerImagesLength; i++) {
            optionImages[i] = document.querySelectorAll(answerSelector)[i + addCount];
        }

        // ... (Ваша логика OCR и сопоставления - ОСТАВЛЕНА БЕЗ ИЗМЕНЕНИЙ) ...

        // Попытка решить изображение вопроса
        var questionSolution = await imageUsingOCRAntibotLowValues(questionImage);
        questionSolution = questionSolution.replace(/,$/, "");

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCRAntibotHighValues(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCR(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }

        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            questionSolution = await imageUsingOCRAntibotQuestion(questionImage);
            questionSolution = questionSolution.replace(/,$/, "");
        }


        if (!questionSolution || !questionSolution.includes(",") || questionSolution.split(",").length != answerImagesLength) {
            // Если OCR не сработал, пытаемся разделить изображение
            myLog("🔄 Не удалось распознать все слова в одном изображении. Пытаемся разделить.");

            await splitImageUsingDefaultValues(questionImageSource, answerImagesLength);

            if(questionImages.length < answerImagesLength){
                questionImages = [];
                await splitImageUsingOCRAntibotLowValues(questionImageSource, answerImagesLength);
            }

            if(questionImages.length < answerImagesLength){
                questionImages = [];
                await splitImageUsingOCRAntibotHighValues(questionImageSource, answerImagesLength);
            }

            if(questionImages.length < answerImagesLength){
                document.querySelector(answerSelector).value = "####";
                myLog("❌ Капча не может быть решена: не удалось разделить изображение.");
                window.ablinks_status = 'failed_split';
                return;
            }

            for (let i = 0; i < answerImagesLength; i++) {
                questions[i] = await getFinalOCRResultFromImage(questionImages[i],leastLength);
                questions[i] = questions[i].replaceAll("5", "s").replaceAll("3", "e").replaceAll(",", "")
                    .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("*", "").replaceAll("9", "g")
                    .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase().trim();
                myLog(`[Разделенное] Вопрос ${i+1}: ${questions[i]}`);
            }
        } else {
            // Если OCR сработал, используем его результат
            questionSolution = questionSolution.toLowerCase();
            questionSolution = questionSolution.replaceAll("5", "s").replaceAll("3", "e")
                .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("*", "").replaceAll("9", "g")
                .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase();
            questions = questionSolution.split(',').map(q => q.trim());
            myLog(`[OCR] Вопросы: ${questions.join(', ')}`);
        }

        // Поиск ответов
        leastLength = 1000;
        for (let i = 0; i < answerImagesLength; i++) {
            if (questions[i].length < leastLength) {
                leastLength = questions[i].length;
            }
        }

        leastLength = leastLength - 1;

        var answers = [];

        for (let i = 0; i < answerImagesLength; i++) {
            answers[i] = await getFinalOCRResultFromImage(optionImages[i],leastLength);
            answers[i] = answers[i].replaceAll("5", "s").replaceAll("3", "e")
                .replaceAll("8", "b").replaceAll("1", "l").replaceAll("@", "a").replaceAll("9", "g")
                .replaceAll("!", "i").replaceAll("0", "o").replaceAll("4", "a").replaceAll("2", "z").toLowerCase().trim();
            myLog(`[Ответ] Вариант ${i+1}: ${answers[i]}`);
        }

        await worker.terminate();
        worker = ""; // Сброс worker после использования

        // СЕКЦИЯ ЛОГИКИ СОПОСТАВЛЕНИЯ
        if (questions.length == answerImagesLength) {

            var map = new Map();
            for (let i = 0; i < answerImagesLength; i++) {
                questions[i] = questions[i].replaceAll(",", "").replaceAll(" ", "").trim();
                for (let j = 0; j < answerImagesLength; j++) {
                    let score = "";
                    answers[j] = answers[j].replaceAll(",", "").replaceAll(" ", "").trim();
                    score = await LevenshteinDistance(questions[i], answers[j]);
                    map.set(questions[i] + "::" + answers[j], score);
                }
            }

            // ... (Ваша логика сортировки и сопоставления) ...
            map[Symbol.iterator] = function*() {
                yield*[...this.entries()].sort((a, b) => a[1] - b[1]);
            }

            var tempMap = new Map();
            var finalMap = new Map();
            var preValue = "";
            var count = 0;
            for (let [key, value] of map) {
                count = count + 1;
                if (!preValue) {
                    preValue = value;
                    tempMap.set(key, value)
                    continue;
                }

                if (preValue == value) {
                    tempMap.set(key, value);
                } else {
                    tempMap[Symbol.iterator] = function*() {
                        yield*[...this.entries()].sort((a, b) => a[0] - b[0]);
                    }

                    finalMap = new Map([...finalMap, ...tempMap]);
                    tempMap = new Map();
                    tempMap.set(key, value)
                    preValue = value;
                }

                if (count == map.size) {
                    tempMap.set(key, value);
                    tempMap[Symbol.iterator] = function*() {
                        yield*[...this.entries()].sort((a, b) => a[0] - b[0]);
                    }

                    finalMap = new Map([...finalMap, ...tempMap]);
                }

            }

            var questionAnswerMap = new Map();
            var answerSet = new Set();
            var prevKey = "";
            map = finalMap;
            for (let [key, value] of map) {
                if (!prevKey) {
                    prevKey = key
                    continue;
                }

                if (map.get(prevKey) == map.get(key) && prevKey.split("::")[0] == key.split("::")[0] && !answerSet.has(prevKey.split("::")[1]) &&
                    !answerSet.has(key.split("::")[1]) && !questionAnswerMap.has(prevKey.split("::")[0]) && !questionAnswerMap.has(key.split("::")[0])) {
                    var prevCount = countPairs(prevKey.split("::")[1], prevKey.split("::")[0]);
                    var currCount = countPairs(key.split("::")[1], key.split("::")[0]);

                    if (prevCount > currCount) {
                        key = prevKey;
                    } else {
                        prevKey = key;
                    }
                } else {
                    if (!questionAnswerMap.has(prevKey.split("::")[0]) && !answerSet.has(prevKey.split("::")[1])) {
                        questionAnswerMap.set(prevKey.split("::")[0], prevKey.split("::")[1]);
                        answerSet.add(prevKey.split("::")[1]);
                    }
                    prevKey = key;
                }
            }

            if (questionAnswerMap.size == answerImagesLength-1 && !questionAnswerMap.has(prevKey.split("::")[0]) && !answerSet.has(prevKey.split("::")[1])) {
                questionAnswerMap.set(prevKey.split("::")[0], prevKey.split("::")[1]);
                answerSet.add(prevKey.split("::")[1]);
            }

            var answersMap = new Map();

            for (let i = 0; i < answerImagesLength; i++) {
                answersMap.set(answers[i], i);
            }
            // КОНЕЦ СЕКЦИИ ЛОГИКИ СОПОСТАВЛЕНИЯ


            // ----------------------------------------------------
            // 👇👇👇 КЛИК И СОХРАНЕНИЕ КЭША (Обновлено) 👇👇👇
            // ----------------------------------------------------
            const solvedIndexes = [];
            let allClicksSuccessful = true;

            for (let i = 0; i < answerImagesLength; i++) {
                var ans = questionAnswerMap.get(questions[i]);
                let j = answersMap.get(ans); // j - это индекс элемента ответа (0, 1, 2, 3)

                myLog("✔️ Ответ для " + questions[i] + "::" + answers[j]);

                if (document.querySelectorAll(answerSelector)[j + addCount]) {
                    // Используем click(), так как это стандартная логика в оригинальном коде
                    document.querySelectorAll(answerSelector)[j + addCount].click();
                    solvedIndexes.push(j); // Сохраняем индекс для кэша
                    await sleep(2000);
                } else {
                    myLog("❌ Селектор ответа не найден.");
                    allClicksSuccessful = false;
                }
            }

            // Если OCR успешно решил и кликнул, сохраняем последовательность в кэш
            if (allClicksSuccessful && imageBase64) {
                setCachedAnswer(imageHash, solvedIndexes);
            }
            // ----------------------------------------------------
            // 👆👆👆 КОНЕЦ КЛИКА И СОХРАНЕНИЯ КЭША 👆👆👆
            // ----------------------------------------------------

            // --- СИГНАЛ О ЗАВЕРШЕНИИ РАБОТЫ ---
            myLog("✅ AB Links Solver завершил работу.");
            window.ablinks_status = 'completed';
            if (typeof window.onAblinksComplete === 'function') {
                window.onAblinksComplete();
            }
            // ------------------------------------

        } else {
            myLog("❌ Не удалось сопоставить вопросы и ответы AB Links.");
            window.ablinks_status = 'failed_match';
        }
    }


    // --- НОВАЯ ЛОГИКА ДЛЯ КЛИКА ПОСЛЕ AB LINKS (Обновлено) ---

    function clickTargetButton() {
    const host = window.location.hostname.replace(/^www\./, '');
    let selector = null;

    if (host === 'claimcrypto.in') {
        selector = '.claim-button.btn-lg.btn-primary.btn';
    } else if (host === 'mixfaucet.com') {
        selector = '.waves-light.waves-float.claim-button.waves-effect.btn-primary.btn'; // Пример другого селектора
    } else {
        // Если хост не найден, выходим
        return;
    }

    // Общая логика клика
    const button = document.querySelector(selector);
    if (button) {
        myLog(`➡️ [${host}] Кликаем по: ${selector}`);
        ReadytoClick(selector, 1);
    }
}



    // ---------------------------------------------


    /**
     * @function startSiteLogic
     * @description Основная логика скрипта (Faucet Bot) + запуск ABLinks Solver.
     */
    function startSiteLogic() {
        myLog('✅ Cloudflare проверка завершена. Запускаем логику сайта...');

        // ------------------------------------------------------------------------------------------------
        // ЗАПУСК УТИЛИТ (Очистка ошибки и Пропуск таймера) - Каждую 1 секунду
        myLog(`[Utility] Активация быстрого опроса: Очистка ошибки и Пропуск таймера (${FAST_POLL_INTERVAL / 1000} сек).`);
        setInterval(clearInputOnFastPoll, FAST_POLL_INTERVAL);
        setInterval(clickSkipButtonOnTimer, FAST_POLL_INTERVAL);
        // ------------------------------------------------------------------------------------------------

        // ------------------------------------------------------------------------------------------------
        // ЗАПУСК AB LINKS SOLVER И НАЗНАЧЕНИЕ КОЛБЭКА
        setTimeout(ABLinksSolverLogic, 500);

        // --- УСТАНОВКА КОЛБЭКА ДЛЯ КЛИКА ПОСЛЕ AB LINKS ---
        // AB Links Solver вызовет onAblinksComplete, когда закончит кликать по картинкам.
        window.onAblinksComplete = clickTargetButton;
        myLog('Установлен колбэк для клика по .btn после завершения AB Links.');
        // ------------------------------------------------------------------------------------------------


        // === ОСНОВНАЯ ЛОГИКА FAUCET BOT (Без изменений) ===

        setInterval(() => {
            const verificationText = bp(".iconcaptcha-modal__body-title")?.textContent;
            if (verificationText === "Verification complete.") {
                myLog('🔑 IconCaptcha: Найден текст "Verification complete.". Готовимся к клику...');
                setTimeout(() => {
                    ReadytoClick(".text-center .btn");
                }, 8000);
            } else {
            }
        }, 5000);

        setInterval(() => {
            const successTitle = bp(".swal2-title")?.textContent;
            if (successTitle === "Success!") {
                myLog('🎉 Успех обнаружен. Перезагрузка страницы.');
                window.location.reload();
            }
        }, 9000);



        if (window.location.href.includes("https://cuttlinks.com/")){
            myLog('[Cuttlinks] Запуск логики для cuttlinks.com');
            setTimeout(() => {
                ReadytoClick("#submit-button");
                const formButton = bp(".click-form button");


            }, 15000);

        }
      if (window.location.href.includes("https://exe-links.com/")){
        setTimeout(() => {
          ReadytoClick(".link-button.button");

        }, 10000);
      }

        setInterval(() => {
            if (isCaptchaChecked()) {
                myLog('[reCAPTCHA] Капча проверена. Кликаем на кнопку.');
                ReadytoClick(".btn-captcha.btn-primary.btn");
                ReadytoClick("#hCaptchaShortlink");
                ReadytoClick(".h-captcha.m-4.btn-captcha.btn-primary.btn");
                ReadytoClick("#fauform > .btn-red.btn");
                ReadytoClick(".modal-body > div.form-group > .my-2.btn-primary.btn-block.btn");
                ReadytoClick('.modal-body > div.form-group > .my-2.btn-red.btn-block.btn');
                ReadytoClick(".mt-3.text-center >.btn-outline-warning.btn");
            }
        }, 5000);

        ReadytoClick(".getmylink");


        setInterval(() =>{ReadytoClick(".wp2continuelink");}, 11000);
        setInterval(() =>{ ReadytoClick(".btn-success.btn");}, 15000);

        if (window.location.href.includes("https://freeltc.fun/")){
            myLog('[FreeLTC.fun] Запуск логики для freeltc.fun');
            const freetimerCheck = setInterval(() =>{
                const freetimer = bp('.step-sub');
                const requiredText = 'Complete the required steps to unlock the claim.';
                if (freetimer && freetimer.innerText.trim() === requiredText) {
                    myLog(`[FreeLTC.fun] Найден текст ожидания. Ждем 8 сек и кликаем.`);
                    setTimeout(() => {
                        ReadytoClick("#next_step_button");
                        clearInterval(freetimerCheck);
                    }, 8000);
                }
            }, 1000);
        }

if(window.location.href.includes("https://jobzhub.store/")){

  setTimeout(() => {
    ReadytoClick("#next");
  }, 1000);
  setTimeout(() => {
    ReadytoClick("#scroll");
  }, 16000);
  setTimeout(() => {
    ReadytoClick(".btn-danger.btn");
  }, 20000);
  setTimeout(() => {
    ReadytoClick(".btn-primary.btn-sm.btn");
  }, 20000);
}


        var BOT_CHECK = setInterval(function() {
            const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
            const targetButton = document.querySelector(".btn-captcha.btn-primary.btn");
            if (tokenInput && tokenInput.value.length > 50 && targetButton) {
                myLog("✅ Turnstile токен (subbutt) обнаружен. Кликаем!");
                targetButton.click();
              ReadytoClick('.btn-captcha.btn-primary.btn');
                clearInterval(BOT_CHECK);
            }
        }, 10000);

        var BOT_CHECK2 = setInterval(function() {
            const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
            const targetButton = document.querySelector(".btn-lg.btn-primary.btn");
            if (tokenInput && tokenInput.value.length > 50 && targetButton) {
                myLog("✅ Turnstile токен (btn-lg) обнаружен. Кликаем!");
                targetButton.click();
                clearInterval(BOT_CHECK2);
            }
        }, 10000);


        var BOT_CHECK3 = setInterval(function() {
            const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
            const targetButton = document.querySelector("");
            if (tokenInput && tokenInput.value.length > 50 && targetButton) {
                myLog("✅ Turnstile токен (btn-primary) обнаружен. Кликаем!");
                targetButton.click();
                clearInterval(BOT_CHECK2);
            }
        }, 10000);

        const failTimerCheck = setInterval(() => {
            const timerElement = document.querySelector('.swal2-title');
            if (timerElement && timerElement.innerText.trim() === 'Failed!') {
                myLog('❌ Обнаружен "Failed!". Переход на случайный кран.');
                setTimeout(() => {
                    const links = document.querySelectorAll('li.dropdown:nth-of-type(2) > .dropdown-menu > li > .dropdown-item');
                    if (links.length > 0) {
                        const randomIndex = Math.floor(Math.random() * links.length);
                        const randomLink = links[randomIndex];
                        myLog(`[ClaimCrypto/Fail] 🔄 Переход на: ${randomLink.textContent.trim()}`);
                        window.location.href = randomLink.href;
                    } else {
                        myLog("[ClaimCrypto/Fail] ⚠️ Ссылки для выбора крана не найдены.");
                    }
                    clearInterval(failTimerCheck);
                }, 500);
            }
        }, 5000);

        setTimeout(() =>{
            if (!(/[?&]autoplay=1/).test(location.search) && document.querySelector("#youtube-player")) {
                myLog('▶️ Клик по YouTube-плееру.');
                document.querySelector("#youtube-player").click();
            }
        }, 5000);



       // === КОНФИГУРАЦИЯ ===
    // Текст, который указывает на наличие капчи.
    const CAPTCHA_TEXT = "Captcha - Select the Upside Down Image";
    // Селектор целевой кнопки, которую нужно кликнуть.
    const TARGET_BUTTON_SELECTOR = "#fauform > .btn-primary.btn";
    // Задержка перед выполнением проверки и клика (2000 мс = 2 секунды).
    const DELAY_MS = 2000;
    // ===================

    console.log(`[АвтоКлик] Скрипт запущен. Ожидание ${DELAY_MS / 1000} секунд...`);

    // Функция setTimeout выполнит код через заданную задержку.
    setTimeout(() => {
        // Шаг 1: Проверка наличия текста капчи на странице.
        // Используем document.body.textContent для поиска текста по всей видимой части страницы.
        const pageContent = document.body.textContent;

        if (pageContent.includes(CAPTCHA_TEXT)) {
            // Условие отмены выполнено.
            console.warn(`[АвтоКлик] Капча обнаружена: "${CAPTCHA_TEXT}". Клик отменен.`);
            return; // Прекращаем выполнение функции.
        }

        // Шаг 2: Если капча НЕ найдена, ищем и кликаем по кнопке.
        const targetButton = document.querySelector(TARGET_BUTTON_SELECTOR);

        if (targetButton) {
            // Кнопка найдена. Выполняем клик.
            targetButton.click();
            console.log(`[АвтоКлик] Капча не найдена. Успешный клик по кнопке с селектором: ${TARGET_BUTTON_SELECTOR}`);
        } else {
            // Кнопка не найдена (но и капчи нет).
            console.error(`[АвтоКлик] Капча не найдена, но и целевая кнопка с селектором "${TARGET_BUTTON_SELECTOR}" тоже не найдена на странице.`);
        }

    }, DELAY_MS);






    }



    /**
     * @description Основной цикл, который ждет завершения проверки Cloudflare.
     */
    const cloudflareCheckInterval = setInterval(function() {
        const isCloudflareBlocking = document.querySelector(
            '#cf-wrapper, .cf-browser-verification, .loading-verifying, .ray_id'
        ) !== null;

        if (!isCloudflareBlocking) {
            myLog('⚙️ Cloudflare/Anti-Bot защита, кажется, завершена или отсутствует. Запуск логики...');
            clearInterval(cloudflareCheckInterval);
            startSiteLogic();
        } else {
            myLog('⏳ Cloudflare/Anti-Bot проверка активна. Ждем прохождения...');
        }

    }, 2000);
})();
