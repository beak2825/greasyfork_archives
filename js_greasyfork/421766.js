// ==UserScript==
// @name         [yahoo.com] Авто-решатель капчи
// @namespace    tuxuuman:auto-captcha
// @version      1.1.0
// @description  Автоматическое решине капчи при регистрации
// @author       <tuxuuman@gmail.com, vk.com/tuxuuman>
// @include      https://login.yahoo.*/*
// @connect      rucaptcha.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421766/%5Byahoocom%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%80%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/421766/%5Byahoocom%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%80%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B8.meta.js
// ==/UserScript==

(function() {
    // это код для заполнения формы регистрации. мб вам пригодится

    // заполнение формы регистрации, и нажатие на кнопку отправки формы
    function reg(params) {
        $('#usernamereg-firstName').val(params.firstName);
        $('#usernamereg-lastName').val(params.lastName);
        $('#usernamereg-yid').val(params.yid);
        $('#usernamereg-password').val(params.password);
        $('#usernamereg-phone').val(params.phone);
        $('select[name="shortCountryCode"]').val(params.phoneShortCountryCode);
        $('#usernamereg-month').val(params.month);
        $('#usernamereg-day').val(params.day);
        $('#usernamereg-year').val(params.year);
        $('#usernamereg-freeformGender').val(params.freeformGender || "");
        $('#reg-submit-button').click(); // жмем на кнопку отправки формы
    }

    // генерация рандомной строки
    function randomStr() {
        return Math.random().toString(36).substring(2);
    }

    reg({
        firstName: "Ivan",
        lastName: "Ivanov",
        yid: "ivan_" + randomStr(),
        password: "!Pw12w!!22",
        phone: "9876543211",
        phoneShortCountryCode: "RU",
        month: "1",
        day: "1",
        year: "1991"
    });

    // обращение к апи рукапчи
    function rucaptcha(method, params) {
        return new Promise((resolve, reject) => {
            let queryParams = {
                json: true,
                key: "75e2268c7417e6eddcedc258d5b3e033", // сюда вставляем свой API токен от рукапчи
                ...params
            }

            console.log("Запрос на rucaptcha.com", {method, queryParams});

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://rucaptcha.com/${method}.php?` + new URLSearchParams(queryParams),
                onerror: reject,
                onload: ({responseText}) => {
                    console.log("Ответ от rucaptcha.com", responseText);
                    try { resolve(JSON.parse(responseText)); }
                    catch (err) { reject(err); }
                }
            });
        });
    }

    // поиска инпута с публичным ключем и сервисным url (он не сразу появляетяся, нужно ждать пока сайт отрисует его)
    function findCaptchaTokenInput() {
        return new Promise((resolve, reject) => {
            let timer = setInterval(() => {
                let input = $('#FunCaptcha-Token');
                if (input.length) {
                    clearInterval(timer);
                    resolve(input[0]);
                }
            }, 1000);
        });
    }

    // пауза на некоторое кол-во времени
    function pause(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    // ожидание решения капчи на rucaptcha
    async function waitCaptchaResult(captchaId) {
        let resp = await rucaptcha("res", {
            id: captchaId,
            action: "get"
        });
        if (resp.status == 1) {
            return resp.request;
        } else {
            if (resp.request == "CAPCHA_NOT_READY") {
                await pause(5000);
                return waitCaptchaResult(captchaId);
            } else {
                let error = new Error(`recaptcha.com API error. ${resp.request}`);
                error.name = resp.request;
                throw error;
            }
        }
    }
  
    // если на странице найдена основная форма
    if ($('#arkose-main-form').length) {
        console.log("#arkose-main-form detected", document.location.href);
        window.onmessage = function(e) {
            if (e.data.type == "arkose-session-token") {
                $('#arkose-session-token').val(e.data.value);
                $('#arkose-submit').click();
            }
        }
    } else {
        // ищем инпут с капчей
        findCaptchaTokenInput().then(async (input) => {
            console.log("### FunCaptcha-Token is found ###", input.value);
            let { surl, pk } = Object.fromEntries(input.value.split('|').map(s => s.split('=')));

            let resp = await rucaptcha("in", {
                method: "funcaptcha",
                publickey: pk,
                surl: surl,
                pageurl: document.location.href
            });

            if (resp.status == 1) {
                console.log("Капча отправлена на решение в rucaptcha.com", resp);
                console.log("Ждем решения капчи...");
                let token = await waitCaptchaResult(resp.request);
                console.log("Капча решена", token);
                parent.postMessage({type: "arkose-session-token", value: token}, "https://login.yahoo.com");
            } else {
                throw new Error("Не удалось отправить капчу на rucaptcha.com. " + resp.request);
            }
        }).catch(err => {
            console.error("Не удалось решить капчу", err);
            // перезагружаем страницу через 5 сек
            pause(5).then(() => document.location.reload());
        });
    }

})();