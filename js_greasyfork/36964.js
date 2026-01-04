// ==UserScript==
// @name            巴哈姆特簽到腳本（每日、公會、動畫瘋）
// @namespace       https://home.gamer.com.tw/moontai0724
// @match           https://*.gamer.com.tw/*
// @grant           GM_getResourceText
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @connect         api.gamer.com.tw
// @connect         guild.gamer.com.tw
// @connect         script.google.com
// @connect         script.googleusercontent.com
// @connect         ani.gamer.com.tw
// @connect         home.gamer.com.tw
// @noframes        
// @version         6.0.3
// @description     打開巴哈自動跑所有簽到，包含動畫瘋、公會簽到、每日簽到等功能。
// @author          moontai0724
// @homepage        https://github.com/moontai0724/bahamut-sign-helper-script
// @supportURL      https://github.com/moontai0724/bahamut-sign-helper-script/issues
// @resource        resource_w3gzwb https://github.com/moontai0724/bahamut-sign-helper-script/raw/release/pages/animad-manual-answer/index.html
// @downloadURL https://update.greasyfork.org/scripts/36964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%B0%BD%E5%88%B0%E8%85%B3%E6%9C%AC%EF%BC%88%E6%AF%8F%E6%97%A5%E3%80%81%E5%85%AC%E6%9C%83%E3%80%81%E5%8B%95%E7%95%AB%E7%98%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/36964/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%B0%BD%E5%88%B0%E8%85%B3%E6%9C%AC%EF%BC%88%E6%AF%8F%E6%97%A5%E3%80%81%E5%85%AC%E6%9C%83%E3%80%81%E5%8B%95%E7%95%AB%E7%98%8B%EF%BC%89.meta.js
// ==/UserScript==

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    const { info: originalInfo, error: originalError, ...remains } = console;
    const prefix = `[bahamut-sign-helper-script]`;
    function info(...params) {
        return originalInfo(prefix, ...params);
    }
    function error(...params) {
        return originalError(prefix, ...params);
    }
    var Logger = { error, info, ...remains };

    var ScriptEvent;
    (function (ScriptEvent) {
        ScriptEvent["SystemInit"] = "system-init";
        ScriptEvent["SystemRepliedResult"] = "system-replied-result";
        ScriptEvent["UserAnswered"] = "user-answered";
        ScriptEvent["UserClosed"] = "user-closed";
        ScriptEvent["ViewMounted"] = "view-mounted";
    })(ScriptEvent || (ScriptEvent = {}));
    function on(scriptEvent, callback, target = window) {
        const listener = (event) => {
            if (event.data.scriptEvent !== scriptEvent)
                return;
            callback(event);
        };
        target.addEventListener("message", listener);
        return listener;
    }
    function send(scriptEvent, content, target = window.parent) {
        const context = {
            content,
            scriptEvent,
        };
        return target.postMessage(context, "*");
    }

    const TODAY = (() => {
        const fullDate = new Date().toLocaleDateString("zh-TW", {
            day: "2-digit",
            month: "2-digit",
            timeZone: "Asia/Taipei",
            year: "numeric",
        });
        const [currentYear, currentMonth, currentDate] = fullDate.split("/");
        const startOfTodayTimeString = `${currentYear}-${currentMonth}-${currentDate}T00:00:00+0800`;
        return {
            /**
             * The day of today.
             * @example 9
             */
            day: parseInt(currentDate, 10),
            /**
             * The full date of today.
             * @example "2024/03/09"
             */
            full: fullDate,
            /**
             * The month of today.
             * @example 3
             */
            month: parseInt(currentMonth, 10),
            /**
             * The start time of today.
             * @example new Date("2024-03-09T00:00:00+0800")
             */
            start: new Date(startOfTodayTimeString),
            /**
             * The year of today.
             * @example 2024
             */
            year: parseInt(currentYear, 10),
        };
    })();
    const BAHAID = (() => {
        const account = /BAHAID=(?<BAHAID>.+?);/u.exec(document.cookie)?.[1];
        if (!account) {
            // directly break the script execution if the account is not found.
            throw new Error("BAHAID is not found in cookie.");
        }
        return account;
    })();

    function getFullScreenIframe(html) {
        const iframe = document.createElement("iframe");
        iframe.srcdoc = html;
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.zIndex = "9999";
        iframe.style.border = "none";
        return iframe;
    }
    function loadFullScreenIframe(html) {
        const iframe = getFullScreenIframe(html);
        document.body.appendChild(iframe);
        return iframe;
    }

    /* eslint-disable no-param-reassign, max-lines-per-function */
    /**
     * Get a recursive proxy option for the proxy object, which will auto trigger
     * parent setter when the child setter is triggered.
     * @param parentTarget parent of this item
     * @param parentKey key of this item in the parent
     * @returns a recursive proxy option for the proxy object
     */
    function getOptions(parentTarget, parentKey) {
        const handler = {
            get(itemTarget, itemKey) {
                const typedItemKey = itemKey;
                // get current item
                const itemValue = itemTarget[typedItemKey];
                // if the item is an object, return a proxy
                if (typeof itemValue === "object" && itemValue !== null) {
                    return new Proxy(itemValue, getOptions(new Proxy(itemTarget, handler), itemKey));
                }
                // return the item
                return itemValue;
            },
            set(itemTarget, itemKey, itemValue) {
                const typedItemKey = itemKey;
                const typedItemValue = itemValue;
                // update current item
                itemTarget[typedItemKey] = typedItemValue;
                // trigger parent setter
                parentTarget[parentKey] = itemTarget;
                // report success
                return true;
            },
        };
        return handler;
    }

    /**
     * Defines the environment variables here. The key of first level object will be
     * the identifier that stored into the script storage, and the value will be the
     * default value if the value is not set before.
     */
    const environmentVariables = {
        config: {
            animad: {
                quiz: {
                    /**
                     * Whether to answer the quiz automatically.
                     * @default true
                     */
                    autoAnswer: true,
                    /**
                     * The grace time of the quiz, calculated in milliseconds from the
                     * start of the day. The manual answer will not be triggered
                     * if the time is not reached.
                     */
                    graceTime: 0,
                    /**
                     * Whether to use the source of the quiz.
                     */
                    source: {
                        /**
                         * Fetch answer from daily post of user `blackxblue`.
                         * @see https://home.gamer.com.tw/blackxblue
                         *
                         * @default true
                         */
                        blackxblue: true,
                        /**
                         * Fetch answer from unofficial gamer quiz collection.
                         * Since this approach is not stable, and is slow, this is only
                         * be used as a fallback.
                         *
                         * @see https://home.gamer.com.tw/creationDetail.php?sn=3924920
                         *
                         * @default true
                         */
                        collection: true,
                    },
                },
            },
        },
        enable: {
            /**
             * Whether to enable the answer animad quiz feature.
             */
            animadQuiz: true,
            /**
             * Whether to enable the daily sign feature.
             * @default true
             */
            dailySign: true,
            /**
             * Whether to enable the guild sign feature.
             * @default true
             */
            guildSign: true,
        },
        record: {},
    };
    /**
     * A proxy object that will read and write the environment variables from the
     * script storage. The value will be the default value if the value is not set
     * in the script storage.
     */
    const values = new Proxy(environmentVariables, {
        get(target, key) {
            const value = GM_getValue(key.toString(), target[key]);
            if (typeof value === "object" && value !== null) {
                return new Proxy(value, getOptions(values, key));
            }
            return value;
        },
        set(_, name, value) {
            GM_setValue(name.toString(), value);
            return true;
        },
    });
    function getRecord() {
        const record = values.record[BAHAID];
        const defaultValue = {
            updatedAt: TODAY.full,
        };
        if (!record || record.updatedAt !== TODAY.full) {
            values.record[BAHAID] = defaultValue;
            return values.record[BAHAID];
        }
        return record;
    }

    /**
     * Generate a random hexadecimal string
     * ⚠️ WARNING: This function does not solve CSRF token issues.
     * @param length The length of the hexadecimal string
     */
    function generateRandomHex(length = 16) {
        // Initialize an empty string to store the hexadecimal value
        let hexString = "";
        // Loop through the length of the hexadecimal string
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < length; index++) {
            // Generate a random hexadecimal digit (0-9, A-F)
            const randomDigit = Math.floor(Math.random() * 16).toString(16);
            // Append the random digit to the hexadecimal string
            hexString += randomDigit;
        }
        // Return the generated hexadecimal string
        return hexString;
    }
    /**
     * Get the CSRF token from `ckBahamutCsrfToken` cookie or generate a random one.
     *
     * @returns The CSRF token from cookie or a random 16-digit hexadecimal string
     */
    function getCSRFToken() {
        const existing = document.cookie
            .split(";")
            .find(value => value.trim().startsWith("ckBahamutCsrfToken"));
        if (!existing)
            return generateRandomHex();
        const [, ...fragments] = existing.split("=");
        const value = fragments.join("=");
        return value;
    }

    var HeaderOption;
    (function (HeaderOption) {
        HeaderOption["ContentType"] = "Content-Type";
        HeaderOption["XBahamutCsrfToken"] = "x-bahamut-csrf-token";
    })(HeaderOption || (HeaderOption = {}));
    var ContentType;
    (function (ContentType) {
        ContentType["FormData"] = "multipart/form-data";
        ContentType["FormUrlEncoded"] = "application/x-www-form-urlencoded";
    })(ContentType || (ContentType = {}));
    /**
     * Send an HTTP request by using `GM_xmlhttpRequest`.
     *
     * @param method HTTP method, only GET, HEAD and POST are supported.
     * @param url Target URL.
     * @param options Options for `GM_xmlhttpRequest`.
     *
     * @returns A promise that wrap resolves to the response.
     */
    async function request(method, url, options) {
        return new Promise((resolve, reject) => {
            const basicOptions = {
                method,
                onerror: reject,
                onload: httpResponse => {
                    resolve(httpResponse.response);
                },
                ontimeout: reject,
                url,
            };
            Object.assign(basicOptions, options);
            GM_xmlhttpRequest(basicOptions);
        });
    }
    /**
     * Send an HTTP GET request by using `GM_xmlhttpRequest`.
     *
     * @param url Target URL.
     * @param options Options for `GM_xmlhttpRequest`.
     */
    async function get(url, options = {}) {
        return request("GET", url, options);
    }
    /**
     * Send an HTTP POST request by using `GM_xmlhttpRequest`.
     *
     * @param url Target URL.
     * @param options Options for `GM_xmlhttpRequest`.
     */
    async function post(url, options = {}) {
        return request("POST", url, options);
    }

    let quiz;
    /**
     * Get the quiz of the day.
     * @throws {ErrorResponse} If the quiz is answered today.
     */
    async function getQuiz() {
        if (quiz)
            return quiz;
        const uri = "https://ani.gamer.com.tw/ajax/animeGetQuestion.php";
        const response = await get(uri, {
            responseType: "json",
        });
        if ("error" in response)
            return Promise.reject(response);
        quiz = response;
        return response;
    }
    /**
     * Submit the answer of the quiz.
     * @param token By default, it will auto fetch from cached quiz. You can provide
     * the token manually instead.
     * @throws {ErrorResponse} When there are error message from api.
     */
    async function submitAnswer$1(answer) {
        const token = quiz?.token || (await getQuiz()).token;
        const uri = "https://ani.gamer.com.tw/ajax/animeAnsQuestion.php";
        const params = new URLSearchParams();
        params.append("ans", answer.toString());
        params.append("token", token);
        params.append("t", Date.now().toString());
        const response = await post(uri, {
            data: params,
            responseType: "json",
        });
        if ("error" in response)
            return Promise.reject(response);
        return response;
    }

    /**
     * This is the api that the current landing page uses.
     */
    async function check() {
        const token = getCSRFToken();
        const params = new FormData();
        params.append("action", "2");
        const response = await post("https://api.gamer.com.tw/user/v1/signin.php", {
            anonymous: false,
            cookie: `ckBahamutCsrfToken=${token}`,
            data: params,
            headers: {
                [HeaderOption.XBahamutCsrfToken]: token,
            },
            responseType: "json",
        });
        if ("error" in response)
            return Promise.reject(response.error);
        return response.data;
    }
    /**
     * This is the api that the current landing page uses.
     * @example {
        "days": 111,
        "dialog": "",
        "prjSigninDays": 0,
        "btnMessage": "<i class=\"material-icons\">check_box</i>每日簽到已達成",
        "totalWeeks": 4,
        "dialogInfo": []
      }
     */
    async function sign$3() {
        const token = getCSRFToken();
        const params = new FormData();
        params.append("action", "1");
        const response = await post("https://api.gamer.com.tw/user/v1/signin.php", {
            anonymous: false,
            cookie: `ckBahamutCsrfToken=${token}`,
            data: params,
            headers: {
                [HeaderOption.XBahamutCsrfToken]: token,
            },
            responseType: "json",
        });
        if ("error" in response)
            return Promise.reject(response.error);
        return response.data;
    }

    async function getMyGuilds() {
        const uri = "https://api.gamer.com.tw/guild/v2/guild_my.php";
        const response = await get(uri, {
            anonymous: false,
            // cookie: `ckBahamutCsrfToken=${token}`,
            // data: params as unknown as string,
            // headers: {
            //   [HeaderOption.XBahamutCsrfToken]: token,
            // },
            responseType: "json",
        });
        return response.data.list;
    }

    async function sign$2(id) {
        const uri = "https://guild.gamer.com.tw/ajax/guildSign.php";
        const data = new URLSearchParams();
        data.set("sn", id.toString());
        const response = await post(uri, {
            anonymous: false,
            data: data,
            responseType: "json",
        });
        if ("error" in response)
            return Promise.reject(response);
        return response;
    }

    async function list(user, options = {}) {
        const uri = "https://api.gamer.com.tw/home/v2/creation_list.php";
        const params = new URLSearchParams({
            owner: user,
            ...options,
        });
        const response = await get(`${uri}?${params.toString()}`, { responseType: "json" });
        return response.data.list;
    }
    async function getHTML(sn) {
        const uri = "https://home.gamer.com.tw/artwork.php";
        const params = new URLSearchParams({ sn });
        const response = await get(`${uri}?${params.toString()}`);
        return response;
    }

    async function find(question) {
        const uri = "https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec";
        const searchParams = new URLSearchParams({
            question,
            type: "quiz",
        });
        const response = await get(`${uri}?${searchParams.toString()}`, {
            responseType: "json",
        });
        if (!response.success || !response.data)
            throw new Error("Failed to find the quiz.");
        return response.data;
    }

    function isToday(title) {
        const regex = /(\d{1,2})[/-](\d{1,2})/;
        const match = title.match(regex);
        if (!match)
            return false;
        const [, month, day] = match;
        const isMonthEqual = parseInt(month, 10) === TODAY.month;
        const isDayEqual = parseInt(day, 10) === TODAY.day;
        return isMonthEqual && isDayEqual;
    }
    function findAnswer(html) {
        const element = new DOMParser().parseFromString(html, "text/html");
        const targets = ["#article_content", "#home_content", ".MSG-list8C"].join(",");
        const postContent = element.querySelector(targets)?.textContent;
        if (!postContent)
            throw new Error("No post content found.");
        const answer = postContent.match(/[aAＡ]\s*.\s*([1-4１-４])/)?.[1];
        if (!answer)
            throw new Error("No answer found.");
        return parseInt(answer, 10);
    }
    async function fromblackxblue() {
        const creations = await list("blackXblue");
        const todayCreation = creations.find(creation => isToday(creation.title));
        if (!todayCreation)
            throw new Error("No creation found.");
        const html = await getHTML(creations[0].csn);
        const answer = findAnswer(html);
        return answer;
    }

    async function fromCollection() {
        if (!values.config.animad.quiz.source.collection) {
            const message = "The quiz collection answer source is disabled.";
            Logger.info(message);
            throw new Error(message);
        }
        const quiz = await getQuiz();
        const result = await find(quiz.question);
        if (!result.answer)
            throw new Error("Failed to find the answer from the quiz collection.");
        return result.answer;
    }

    async function getAnswer() {
        if (!values.config.animad.quiz.autoAnswer) {
            Logger.info("Auto answer for animad quiz is disabled.");
            throw new Error("Auto answer for animad quiz is disabled.");
        }
        try {
            const answer = await fromblackxblue();
            Logger.info("Got the answer from blackxblue:", answer);
            return answer;
        }
        catch (error) {
            Logger.error("Failed to get the answer from blackxblue.", error);
        }
        try {
            const answer = await fromCollection();
            Logger.info("Got the answer from the quiz collection:", answer);
            return answer;
        }
        catch {
            Logger.error("Failed to get the answer from the quiz collection.");
        }
        throw new Error("Failed to get any answer.");
    }

    function setAnswerStatus(status) {
        const existing = getRecord();
        existing.animadQuizAnswered = status;
        return existing;
    }
    async function isTodayAnswered() {
        const record = getRecord();
        const answered = !!record.animadQuizAnswered;
        if (answered)
            return true;
        try {
            await getQuiz();
        }
        catch {
            setAnswerStatus(true);
            return true;
        }
        return false;
    }
    async function submitAnswer(answer) {
        const result = await submitAnswer$1(answer).catch(error => {
            if (error.msg === "答題錯誤")
                return error;
            if (error.msg === "今日已經答過題目了，一天僅限一次機會")
                return error;
            throw error;
        });
        setAnswerStatus(true);
        return result;
    }

    var html = GM_getResourceText("resource_w3gzwb");

    let iframe;
    function close() {
        iframe.remove();
        Logger.info("Manual answer animad quiz closed.");
    }
    async function onUserAnswered(event) {
        Logger.info("User answered manual answer animad quiz.", event);
        const answer = event.data.content;
        const result = await submitAnswer$1(answer).catch(error => ({
            gift: error.msg || error.message,
            ok: 0,
        }));
        send(ScriptEvent.SystemRepliedResult, result.gift, event.source);
    }
    async function init$3() {
        const quiz = await getQuiz();
        Logger.info("Initiating manual answer animad quiz...");
        on(ScriptEvent.ViewMounted, event => {
            Logger.info("Manual answer animad quiz view mounted.");
            send(ScriptEvent.SystemInit, { question: quiz }, event.source);
        });
        on(ScriptEvent.UserClosed, close);
        on(ScriptEvent.UserAnswered, onUserAnswered);
        iframe = loadFullScreenIframe(html);
    }

    async function performAutoAnswer() {
        const answer = await getAnswer();
        return submitAnswer(answer);
    }
    function graceTimePassed() {
        const { graceTime } = values.config.animad.quiz;
        if (graceTime <= 0)
            return true;
        const now = new Date();
        return now.getTime() - TODAY.start.getTime() >= graceTime;
    }
    async function performManualAnswer() {
        return init$3();
    }
    // 動畫瘋答題感謝 maple3142/動畫瘋工具箱 支援：https://greasyfork.org/zh-TW/scripts/39136
    async function init$2() {
        try {
            if (!values.enable.animadQuiz) {
                Logger.info("Animad quiz feature is disabled.");
                return;
            }
            if (await isTodayAnswered()) {
                Logger.info("Animad quiz is already answered.");
                return;
            }
            try {
                const result = await performAutoAnswer();
                Logger.info("Successfully auto answered the animad quiz.", result);
            }
            catch {
                Logger.info("Failed to auto answer the animad quiz, fallback to manual answer.");
                if (!graceTimePassed()) {
                    Logger.info("Grace time is not passed, aborting manual answer for animad quiz.");
                    return;
                }
                await performManualAnswer();
            }
        }
        catch (error) {
            Logger.error("Encountered an error while performing animad quiz:", error);
        }
    }

    function setSignStatus(status) {
        const existing = getRecord();
        existing.dailySigned = status;
        return existing;
    }
    async function isTodaySigned() {
        const record = getRecord();
        if (!record.dailySigned) {
            const status = await check();
            const signed = !!status.signin;
            setSignStatus(signed);
            return signed;
        }
        return !!record.dailySigned;
    }
    async function sign$1() {
        const signResult = await sign$3();
        setSignStatus(true);
        return signResult;
    }
    async function init$1() {
        try {
            if (!values.enable.dailySign) {
                Logger.info("Daily sign feature is disabled.");
                return;
            }
            if (await isTodaySigned()) {
                Logger.info("Daily sign is already performed.");
                return;
            }
            const signResult = await sign$1();
            Logger.info("Successfully performed daily sign!", signResult);
        }
        catch (error) {
            Logger.error("Encountered an error while performing daily sign:", error);
        }
    }

    async function getMyGuildIds() {
        const infos = await getMyGuilds();
        const ids = infos.map(info => info.sn);
        return ids;
    }
    function isNotSignedYet(id) {
        const record = getRecord();
        return !record.signedGuilds?.includes(id);
    }
    async function getUnsignedGuildIds() {
        const ids = await getMyGuildIds();
        const unsignedIds = ids.filter(isNotSignedYet);
        return unsignedIds;
    }
    async function setSigned(id) {
        const existing = getRecord();
        if (!existing.signedGuilds)
            existing.signedGuilds = [];
        if (existing.signedGuilds.includes(id))
            return existing;
        existing.signedGuilds.push(id);
        return existing;
    }
    async function sign(id) {
        if (!isNotSignedYet(id)) {
            throw new Error(`Guild ${id} is already signed today.`);
        }
        const signResult = await sign$2(id).catch(error => {
            if (error.msg === "您今天已經簽到過了！") {
                return Promise.resolve(error);
            }
            return Promise.reject(error);
        });
        setSigned(id);
        return signResult;
    }
    async function init() {
        try {
            const ids = await getUnsignedGuildIds();
            if (!ids.length) {
                Logger.info("All guild sign is already performed.");
                return;
            }
            const results = await Promise.allSettled(ids.map(sign));
            Logger.info("Successfully performed guild sign!", results);
        }
        catch (error) {
            Logger.error("Encountered an error while performing guild sign:", error);
        }
    }

    init$1();
    init();
    init$2();

}));
