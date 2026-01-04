// ==UserScript==
// @name         Return Pikabu minus
// @version      0.14.1
// @namespace    pikabu-return-minus.pyxiion.ru
// @description  Возвращает минусы на Pikabu, а также фильтрацию по рейтингу.
// @author       PyXiion
// @match        *://pikabu.ru/*
// @connect      api.pikabu.ru
// @connect      pikabu.ru
// @connect      rpm.pyxiion.ru
// @connect      gollum.space
// @connect      isla-de-muerta.com
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472686/Return%20Pikabu%20minus.user.js
// @updateURL https://update.greasyfork.org/scripts/472686/Return%20Pikabu%20minus.meta.js
// ==/UserScript==
//#region Utils
function MD5(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            }
            else {
                return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
        }
        else {
            return lResult ^ lX8 ^ lY8;
        }
    }
    function F(x, y, z) {
        return (x & y) | (~x & z);
    }
    function G(x, y, z) {
        return (x & z) | (y & ~z);
    }
    function H(x, y, z) {
        return x ^ y ^ z;
    }
    function I(x, y, z) {
        return y ^ (x | ~z);
    }
    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] =
                lWordArray[lWordCount] |
                    (string.charCodeAt(lByteCount) << lBytePosition);
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue =
                WordToHexValue +
                    WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
        b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
        a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
        c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
        c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
        a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
        a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
        a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
        a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
        c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
        c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
        b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
        c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
        d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
        c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
        a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
        d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
        b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}
class AbstractHttpRequest {
    constructor(url, responseType, additionalParameters = null) {
        this.url = url;
        this.httpMethod = "POST";
        this.headers = new Map();
        this.timeout = 15000;
        this.responseType = responseType;
        this.additionalParameters = {
            anonymous: true,
            fetch: true,
            ...additionalParameters,
        };
    }
    addHeader(key, value) {
        this.headers.set(key, value);
        return this;
    }
    setHttpMethod(httpMethod) {
        this.httpMethod = httpMethod;
        return this;
    }
    execute(callback) {
        const data = this.getData();
        const details = {
            url: this.url,
            method: this.httpMethod,
            headers: Object.fromEntries(this.headers),
            data: data ? JSON.stringify(data) : null,
            timeout: this.timeout,
            responseType: this.responseType,
            onerror: callback.onError,
            onload: callback.onSuccess,
            // TODO: ontimeout
            onabort: callback.onError,
            ontimeout: callback.onError,
            ...this.additionalParameters,
        };
        GM.xmlHttpRequest(details);
    }
    executeAsync() {
        const promise = new Promise((resolve, reject) => {
            this.execute({
                onError: reject,
                onSuccess: resolve,
            });
        });
        promise.catch(error);
        return promise;
    }
}
class HttpRequest extends AbstractHttpRequest {
    constructor(url, method = "GET", responseType, additionalParameters = null) {
        super(url, responseType, additionalParameters);
        this.httpMethod = method;
    }
    setBody(body) {
        this.body = body;
    }
    getData() {
        return this.body;
    }
}
//#endregion
//#region API/Nodes
var RPM;
(function (RPM) {
    RPM.STYLE = `.rpm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.rpm-modal {
  background-color: var(--color-bright-800);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  width: 100%;
}
.rpm-modal-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
.rpm-modal-body {
  margin-bottom: 20px;
}
.rpm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.rpm-reason {
  margin-bottom: 10px;
}
.rpm-reason input {
  margin-right: 5px;
}
.rpm-reason-input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 2px solid var(--color-black-700);
  border-radius: 5px;
  background: var(--color-black-430);
}
.rpm-modal-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.rpm-vote-reason-container {
  display: block;
  margin: 7px 30px 7px;
  padding: 10px;
  padding-top: 13px;
  font-size: 14px;
  font-weight: 500;
  background-color: transparent;
  border: 1px solid var(--color-primary-700);
  line-height: 30px;
  position: relative;
}
.rpm-vote-reason-title {
  display: inline;
  position: absolute;
  left: 3px;
  top: 3px;
  font-size: 0.8em;
  line-height: 1em;
}
.rpm-vote-reason {
  display: inline;
  font-weight: 300;
}

.rpm-mini-profile-horizontal {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 450px;
  min-width: 700px;
  max-width: 700px;
}
.rpm-mini-profile-horizontal > * {
  width: 50%;
}

`;
    /**
     * Utility function to create an element and assign multiple classes.
     * @param {string} tag - The HTML tag name.
     * @param {...string} classes - The class names to assign.
     * @returns {HTMLElement} The created element.
     */
    function createElementWithClass(tagName, ...classes) {
        const elem = document.createElement(tagName);
        elem.classList.add(...classes);
        return elem;
    }
    RPM.createElementWithClass = createElementWithClass;
    let Service;
    (function (Service) {
        const DOMAIN = 'https://rpm.pyxiion.ru/';
        // const DOMAIN = "http://localhost:8000/";
        const USER_REQUEST_QUEUE_PERIOD = 300;
        let PERIOD_MULTIPLIER = 1;
        const USER_REQUEST_QUEUE_AT_ONCE = 50;
        function isAuthorized() {
            return GM_config.get("uuid") !== "";
        }
        Service.isAuthorized = isAuthorized;
        async function register() {
            const response = (await post(DOMAIN + "register", {}));
            return response.secret;
        }
        Service.register = register;
        async function getFeedbacks() {
            const response = (await get(DOMAIN + "meta/feedback"));
            return response;
        }
        Service.getFeedbacks = getFeedbacks;
        const userInfoRequestQueue = new Map();
        let isQueueRunning = false;
        function getUserInfo(id) {
            return new Promise((resolve) => {
                if (!userInfoRequestQueue.has(id)) {
                    userInfoRequestQueue.set(id, [
                        {
                            callback: resolve,
                        },
                    ]);
                }
                else {
                    userInfoRequestQueue.get(id).push({
                        callback: resolve,
                    });
                }
                workQueue(USER_REQUEST_QUEUE_PERIOD * PERIOD_MULTIPLIER);
            });
        }
        Service.getUserInfo = getUserInfo;
        async function getBunchOfUserRatings(ids) {
            const body = {
                ids,
            };
            const uuid = GM_config.get("uuid");
            if (uuid)
                body.user_uuid = uuid;
            const response = (await post(DOMAIN + "v2/users/ratings", body));
            const users = response.users;
            for (const id in users) {
                postprocessUserInfo(users[id]);
            }
            return users || {};
        }
        async function workQueue(sleepTime = 0) {
            if (userInfoRequestQueue.size === 0 || isQueueRunning)
                return;
            isQueueRunning = true;
            await sleep(sleepTime);
            // Извлекаем до N уникальных запросов из очереди
            const requestsToProcess = Array.from(userInfoRequestQueue.keys()).slice(0, USER_REQUEST_QUEUE_AT_ONCE);
            const ids = requestsToProcess;
            try {
                const usersInfo = await getBunchOfUserRatings(ids);
                // Вызываем все callback для каждого запроса
                requestsToProcess.forEach((id) => {
                    const userRequests = userInfoRequestQueue.get(id);
                    if (userRequests) {
                        const info = usersInfo[id] || null; // null если инфо не найдено
                        if (info)
                            userRequests.forEach((req) => req.callback(info));
                    }
                    userInfoRequestQueue.delete(id); // Удаляем обработанные запросы
                });
            }
            catch (e) {
                error("Error processing user info requests:", e);
                PERIOD_MULTIPLIER += 2;
            }
            finally {
                isQueueRunning = false;
            }
            // Повторный запуск, если есть еще запросы
            setTimeout(workQueue, USER_REQUEST_QUEUE_PERIOD * PERIOD_MULTIPLIER);
        }
        function postprocessUserInfo(info) {
            if (info.own_vote) {
                // Removes own vote from other votes
                info.pluses -= info.own_vote === 1 ? 1 : 0;
                info.minuses -= info.own_vote === -1 ? 1 : 0;
            }
        }
        function voteUser(id, vote, reasonId = null, reasonText = null, url = null) {
            if (!isAuthorized())
                return null;
            const data = {
                user_uuid: GM_config.get("uuid"),
                vote,
            };
            if (reasonId !== null) {
                data["reason_id"] = reasonId;
            }
            if (reasonText !== null) {
                data["reason_text"] = reasonText;
            }
            if (url !== null) {
                data["reason_url"] = url;
            }
            return post(DOMAIN + `user/${id}/vote`, data);
        }
        Service.voteUser = voteUser;
        async function post(url, json) {
            const request = new HttpRequest(url, "POST", "json");
            request.addHeader("Content-Type", "application/json");
            request.setBody(json);
            const response = await request.executeAsync();
            if (response.status / 100 !== 2) {
                sendNotification("Ошибка", response.statusText);
                throw Error(response.statusText);
            }
            if ('message' in response.response) {
                sendNotification("Сообщение", response.response.message);
            }
            if ('result' in response.response && response.response.result === 'error') {
                throw Error(response.response.message ?? 'Unknown error');
            }
            return response.response;
        }
        Service.post = post;
        async function get(url) {
            const request = new HttpRequest(url, "GET", "json");
            const response = await request.executeAsync();
            if ('message' in response.response) {
                sendNotification("Сообщение", response.response.message);
            }
            if ('result' in response.response && response.response.result === 'error') {
                throw Error(response.response.message ?? 'Unknown error');
            }
            return response.response;
        }
        Service.get = get;
        let reasonsCache = null;
        async function getReasons() {
            if (reasonsCache !== null)
                return reasonsCache;
            const body = (await get(DOMAIN + "meta/vote_reasons"));
            reasonsCache = body.reasons;
            return reasonsCache;
        }
        Service.getReasons = getReasons;
        async function getUserVotes(uid) {
            const body = (await post(DOMAIN + `v2/user/${uid}/votes`, {
                user_uuid: GM_config.get("uuid")
            }));
            return body.reasons;
        }
        Service.getUserVotes = getUserVotes;
    })(Service = RPM.Service || (RPM.Service = {}));
    let Nodes;
    (function (Nodes) {
        /**
         * Creates and returns a loading icon element with a specific class.
         * @returns {HTMLDivElement} The loading icon element.
         */
        function createLoadingIcon() {
            return createElementWithClass("div", "rpm-loading");
        }
        Nodes.createLoadingIcon = createLoadingIcon;
        /**
         * Creates a note element with the provided text and specific styling.
         * @param {string} text - The text to display inside the note.
         * @returns {HTMLSpanElement} The styled note element.
         */
        function createPoweredNote(text) {
            const elem = createElementWithClass("span", "rpm-powered");
            elem.innerHTML = text;
            return elem;
        }
        Nodes.createPoweredNote = createPoweredNote;
        /**
         * Creates a user rating node for a specific user.
         * @param {number} uid - The user ID.
         * @param {Function} infoConsumer - Optional callback to process user info.
         * @returns {HTMLDivElement} The user rating node element.
         */
        function createUserRatingNode(uid, url, infoConsumer = null) {
            const elem = createElementWithClass("div", "rpm-user-rating", "hint", `rpm-user-rating-${uid}`);
            elem.setAttribute("aria-label", "Рейтинг автора в RPM");
            elem.setAttribute("pikabu-user-id", uid.toString());
            const loadingIcon = createLoadingIcon();
            elem.appendChild(loadingIcon);
            const plusElem = addSpan(elem, "rpm-pluses");
            addSpan(elem, "rpm-rating");
            const minusElem = addSpan(elem, "rpm-minuses");
            const openReasonsElem = addSpan(elem, 'rpm-more-votes');
            openReasonsElem.innerHTML = UserRating.OPEN_REASONS_ICON;
            openReasonsElem.addEventListener('click', () => {
                UserRating.showReasonsDialog(uid);
            });
            attachVoteListeners(plusElem, minusElem, elem, uid, url);
            UserRating.updateUserRatingElemAsync(elem, infoConsumer);
            return elem;
        }
        Nodes.createUserRatingNode = createUserRatingNode;
        function createUserVoteReasonContainer(text) {
            const reasonElem = RPM.createElementWithClass("div", "rpm-vote-reason-container");
            const reasonTitleElem = RPM.createElementWithClass("h4", "rpm-vote-reason-title");
            reasonTitleElem.textContent = "Заметка RPM";
            const reasonTextElem = RPM.createElementWithClass("p", "rpm-vote-reason");
            reasonTextElem.textContent = text;
            reasonElem.append(reasonTitleElem, reasonTextElem);
            return reasonElem;
        }
        Nodes.createUserVoteReasonContainer = createUserVoteReasonContainer;
        /**
         * Adds a span element with a specific class to a parent element.
         * @param {HTMLElement} parent - The parent element to which the span is added.
         * @param {string} cls - The class name for the span element.
         * @returns {HTMLSpanElement} The created span element.
         */
        function addSpan(parent, cls) {
            const span = createElementWithClass("span", cls);
            span.innerText = "0";
            span.style.display = "none";
            parent.appendChild(span);
            return span;
        }
        /**
         * Attaches voting listeners to the plus and minus elements.
         * @param {HTMLElement} plusElem - The element for upvoting.
         * @param {HTMLElement} minusElem - The element for downvoting.
         * @param {HTMLDivElement} elem - The parent rating element.
         * @param {number} uid - The user ID.
         */
        function attachVoteListeners(plusElem, minusElem, elem, uid, url) {
            const handleVote = (vote) => UserRating.voteCallback(elem, uid, vote, url);
            if (Service.isAuthorized()) {
                plusElem.addEventListener("click", () => handleVote(1));
                minusElem.addEventListener("click", () => handleVote(-1));
            }
            else {
                const msgCallback = () => sendNotification("Ошибка", "Авторизируйтесь в системе RPM в настройках скрипта, чтобы голосовать за авторов.");
                plusElem.addEventListener("click", msgCallback);
                minusElem.addEventListener("click", msgCallback);
            }
        }
        let Dialog;
        (function (Dialog) {
            /**
             * Creates and appends a generic modal dialog to the document.
             * @param title - The title of the modal.
             * @param bodyContent - The body content of the modal.
             * @param buttons - The buttons to display in the footer.
             * @returns - The overlay element containing the modal.
             */
            function createModalDialog(title, bodyContent, buttons) {
                const overlay = createElementWithClass("div", "rpm-modal-overlay");
                const modal = createElementWithClass("div", "rpm-modal");
                const header = createElementWithClass("div", "rpm-modal-header");
                header.innerText = title;
                const body = createElementWithClass("div", "rpm-modal-body");
                body.appendChild(bodyContent);
                const footer = createElementWithClass("div", "rpm-modal-footer");
                buttons.forEach(({ label, className, onClick }) => {
                    const button = createElementWithClass("button", "rpm-modal-button", className);
                    button.innerText = label;
                    button.addEventListener("click", () => onClick(overlay));
                    footer.appendChild(button);
                });
                modal.appendChild(header);
                modal.appendChild(body);
                modal.appendChild(footer);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
                return overlay;
            }
            Dialog.createModalDialog = createModalDialog;
        })(Dialog = Nodes.Dialog || (Nodes.Dialog = {}));
        let UserRating;
        (function (UserRating) {
            UserRating.OPEN_REASONS_ICON = `<svg width="800px" height="800px" viewBox="0 0 48 48" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="cls-1" d="M10.35,4.5a2,2,0,0,0-1.95,2v35.1a2,2,0,0,0,1.95,2h27.3a2,2,0,0,0,2-2V14.49h-8a2,2,0,0,1-1.95-2v-8Z"/><line class="cls-1" x1="29.61" y1="4.5" x2="39.6" y2="14.49"/><line class="cls-1" x1="15.84" y1="22.97" x2="32.16" y2="22.97"/><line class="cls-1" x1="15.84" y1="35.07" x2="32.16" y2="35.07"/><line class="cls-1" x1="15.84" y1="29.02" x2="32.16" y2="29.02"/></svg>`;
            const userCache = new Map();
            /**
             * Updates the user rating element with the provided user info.
             * @param {HTMLDivElement} elem - The user rating element.
             * @param {RpmJson.UserInfo} info - The user info to update the element with.
             */
            function updateUserRatingElem(elem, info) {
                const { pluses, minuses, base_rating, own_vote } = info;
                const adjustedPluses = pluses + (own_vote === 1 ? 1 : 0);
                const adjustedMinuses = minuses + (own_vote === -1 ? 1 : 0);
                const rating = adjustedPluses - adjustedMinuses + base_rating;
                if (own_vote !== undefined && own_vote !== null) {
                    elem.setAttribute("rpm-own-vote", own_vote.toString());
                }
                updateSpan(elem, ".rpm-pluses", adjustedPluses);
                updateSpan(elem, ".rpm-rating", rating);
                updateSpan(elem, ".rpm-minuses", adjustedMinuses);
                elem.querySelector('.rpm-more-votes').style.display = '';
                elem.querySelector(".rpm-loading")?.remove();
            }
            /**
             * Updates a specific span within a parent element with a given value.
             * @param {HTMLElement} parent - The parent element.
             * @param {string} selector - The CSS selector for the span.
             * @param {number} value - The value to set in the span.
             */
            function updateSpan(parent, selector, value) {
                const elem = parent.querySelector(selector);
                elem.style.display = "";
                elem.innerText = value.toString();
            }
            /**
             * Asynchronously updates the user rating element with user info.
             * @param {HTMLDivElement} elem - The user rating element.
             * @param {Function} infoConsumer - Optional callback to process user info.
             */
            async function updateUserRatingElemAsync(elem, infoConsumer = null) {
                const uid = parseInt(elem.getAttribute("pikabu-user-id"));
                if (isNaN(uid))
                    return;
                let info = userCache.get(uid) ?? (await Service.getUserInfo(uid));
                userCache.set(uid, info);
                infoConsumer?.(info);
                updateUserRatingElem(elem, info);
            }
            UserRating.updateUserRatingElemAsync = updateUserRatingElemAsync;
            /**
             * Handles user vote actions.
             * @param {HTMLDivElement} elem - The user rating element.
             * @param {number} uid - The user ID.
             * @param {number} btn - The vote direction (1 for upvote, -1 for downvote).
             */
            async function voteCallback(elem, uid, btn, url) {
                if (!Service.isAuthorized()) {
                    sendNotification("Ошибка", "Чтобы проголосовать за автора, нужно зарегистрироваться в системе RPM. Вы можете сделать это в настройках.");
                    return;
                }
                const ownVote = parseInt(elem.getAttribute("rpm-own-vote") ?? "0");
                const vote = ownVote === btn ? 0 : ownVote + btn;
                if (vote === -1) {
                    await UserRating.showVoteDialog(uid, -1, url);
                }
                else {
                    await voteUser(uid, vote, null, null, url);
                }
            }
            UserRating.voteCallback = voteCallback;
            /**
             * Sends a vote for a user and updates the cache and UI.
             * @param {number} uid - The user ID.
             * @param {number} vote - The vote value.
             */
            async function voteUser(uid, vote, reasonId = null, reasonText = null, url = null) {
                await Service.voteUser(uid, vote, reasonId, reasonText, url);
                const info = userCache.get(uid) || (await Service.getUserInfo(uid));
                info.own_vote = vote;
                userCache.set(uid, info);
                updateAll(uid, info);
            }
            /**
             * Updates all elements associated with a specific user.
             * @param {number} uid - The user ID.
             * @param {RpmJson.UserInfo} info - The user info.
             */
            function updateAll(uid, info) {
                getAllElementsOfUser(uid).forEach((elem) => updateUserRatingElem(elem, info));
            }
            /**
             * Retrieves all rating elements associated with a specific user ID.
             * @param {number} uid - The user ID.
             * @returns {NodeListOf<HTMLDivElement>} A list of matching elements.
             */
            function getAllElementsOfUser(uid) {
                return document.querySelectorAll(`.rpm-user-rating-${uid}`);
            }
            /**
             * Creates and shows a reason selection dialog.
             * @param {number} uid - The user ID.
             * @param {number} vote - The vote value (-1).
             */
            async function showVoteDialog(uid, vote, url) {
                const reasons = await Service.getReasons();
                const bodyContent = createElementWithClass("div", "rpm-reason-list");
                const radioButtons = [];
                reasons.forEach((reason) => {
                    const reasonWrapper = createElementWithClass("div", "rpm-reason");
                    const radio = createElementWithClass("input");
                    radio.type = "radio";
                    radio.name = "reason";
                    radio.value = reason.id.toString();
                    radio.id = `reason-${reason.id}`;
                    const label = createElementWithClass("label");
                    label.htmlFor = `reason-${reason.id}`;
                    label.innerText = reason.text;
                    reasonWrapper.appendChild(radio);
                    reasonWrapper.appendChild(label);
                    bodyContent.appendChild(reasonWrapper);
                    radioButtons.push(radio);
                });
                const otherWrapper = createElementWithClass("div", "rpm-reason");
                const otherRadio = createElementWithClass("input");
                otherRadio.type = "radio";
                otherRadio.name = "reason";
                otherRadio.value = "other";
                otherRadio.id = "reason-other";
                radioButtons.push(otherRadio);
                const otherLabel = createElementWithClass("label");
                otherLabel.htmlFor = "reason-other";
                otherLabel.innerText = "Другое";
                const otherInput = createElementWithClass("input", "rpm-reason-input");
                otherInput.type = "text";
                otherInput.maxLength = 200;
                otherInput.placeholder = "Описание (обязательно при выборе \"Другое\")";
                otherWrapper.appendChild(otherRadio);
                otherWrapper.appendChild(otherLabel);
                otherWrapper.appendChild(otherInput);
                bodyContent.appendChild(otherWrapper);
                const overlay = Dialog.createModalDialog("Выберите причину минуса", bodyContent, [
                    {
                        label: "Отмена",
                        className: "rpm-modal-button-cancel",
                        onClick: () => overlay.remove(),
                    },
                    {
                        label: "Отправить",
                        className: "rpm-modal-button-submit",
                        onClick: async () => {
                            const selectedReason = document.querySelector('input[name="reason"]:checked');
                            if (!selectedReason) {
                                alert("Выберите причину или введите свою.");
                                return;
                            }
                            const reasonId = selectedReason.value === "other"
                                ? null
                                : parseInt(selectedReason.value);
                            const reasonText = otherInput.value.trim();
                            if (reasonId === null && (!reasonText || reasonText.length === 0)) {
                                alert("Напишите причину.");
                                return;
                            }
                            voteUser(uid, vote, reasonId, reasonText, url);
                            overlay.remove();
                        },
                    },
                ]);
            }
            UserRating.showVoteDialog = showVoteDialog;
            const PLUS_SPAN_HTML = `<span class='rpm-pluses'>Плюс</span>`;
            const MINUS_SPAN_HTML = `<span class='rpm-minuses'>Минус</span>`;
            /**
             * Shows a dialog listing reasons for votes.
             * @param {number} uid - The user ID.
             */
            async function showReasonsDialog(uid) {
                const votes = await Service.getUserVotes(uid);
                const content = createElementWithClass("div", "rpm-modal-body");
                if (votes.length === 0) {
                    const noVotesMessage = createElementWithClass("div", "rpm-votes-message");
                    noVotesMessage.innerText = "Голосов пока нет.";
                    content.appendChild(noVotesMessage);
                }
                else {
                    votes.forEach(vote => {
                        const voteEntry = createElementWithClass("div", "rpm-vote-entry");
                        let voteText = `${vote.vote > 0 ? PLUS_SPAN_HTML : MINUS_SPAN_HTML} от <span class="rpm-user">${vote.name}</span>`;
                        if (vote.text) {
                            voteText += `: <span class="rpm-reason">${vote.text}</span>`;
                        }
                        if (vote.url) {
                            voteText += ' ';
                        }
                        voteEntry.innerHTML = voteText;
                        content.appendChild(voteEntry);
                        if (vote.url) {
                            const link = document.createElement('a');
                            link.textContent = '(ссылка)';
                            link.href = vote.url;
                            link.target = '_blank';
                            voteEntry.append(link);
                        }
                    });
                }
                Dialog.createModalDialog("Причины голосов", content, [
                    {
                        label: "ОК",
                        className: "rpm-modal-button",
                        onClick: overlay => overlay.remove(),
                    },
                ]);
            }
            UserRating.showReasonsDialog = showReasonsDialog;
        })(UserRating || (UserRating = {}));
    })(Nodes = RPM.Nodes || (RPM.Nodes = {}));
})(RPM || (RPM = {}));
//#endregion
//#region Gollum
var Gollum;
(function (Gollum) {
    function createGollumTagsGetter(tagsType) {
        return async (userId) => {
            const request = new HttpRequest(`https://gollum.space/api/${userId}-${tagsType}`, "GET", "json");
            const response = await request.executeAsync();
            const data = response.response;
            return Object.values(data).map((x) => x.TagRU);
        };
    }
    Gollum.storyTagsGetter = createGollumTagsGetter("PostTags");
    Gollum.commentTagsGetter = createGollumTagsGetter("CommentTags");
    const idsCache = new Map();
    async function getUserId(userName) {
        if (idsCache.has(userName)) {
            return idsCache.get(userName);
        }
        const request = new HttpRequest(`https://gollum.space/user/${userName.replace(".", "_")}-summary`, "GET", "text");
        const response = await request.executeAsync();
        const doc = response.responseText;
        // we need $.get("/api/2036358-usertotalposts"
        //                     ^^^^^^^
        const id = parseInt(doc.match(/\/api\/(\d+)-/i)[1]);
        idsCache.set(userName, id);
        return id;
    }
    let LastComments;
    (function (LastComments) {
        const CHUNK_SIZE = 5;
        const COMMENT_UP_DEPTH = 2;
        const parser = new DOMParser();
        async function loadCommentFromPikabu(info, parent = false, disableMiniProfile = false) {
            const request = new HttpRequest(info.link, "GET", "arraybuffer", {
                anonymous: false,
            });
            request.addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59");
            const response = await request.executeAsync();
            // Ебал я этот ваш Пикабу, нахуя он использует CP1251
            const buffer = response.response;
            const dec = new TextDecoder("windows-1251");
            const body = dec.decode(new Uint8Array(buffer));
            const htmlDoc = parser.parseFromString(body, "text/html");
            const wantedElem = htmlDoc.querySelector(parent === false ? `#comment_${info.id}` : ".comments");
            const clone = wantedElem.cloneNode(true);
            return postprocessPikabuComment(clone, info.id, disableMiniProfile);
        }
        function postprocessPikabuComment(element, commentId, disableMiniProfile = false) {
            element.classList.add("rpm-comment-no-js");
            element.querySelectorAll(".comment").forEach((x) => {
                x.classList.add(x.getAttribute("id"));
                x.removeAttribute("id");
                // Fix comment toggling
                const children = x.querySelector(":scope > .comment__children");
                const toggle = x.querySelector(":scope > .comment-toggle-children");
                if (children && toggle) {
                    toggle.addEventListener("click", (e) => {
                        e.preventDefault();
                        children.toggleAttribute("hidden");
                        toggle.classList.toggle("comment-toggle-children_collapse");
                    });
                }
            });
            const commentElem = element.querySelector(`.comment_${commentId}`);
            commentElem.classList.add("rpm-highlight-comment");
            const children = commentElem.querySelector(":scope > .comment__children");
            const toggle = commentElem.querySelector(":scope > .comment-toggle-children");
            if (children && toggle) {
                children.toggleAttribute("hidden");
                toggle.classList.toggle("comment-toggle-children_collapse");
            }
            // Depth control
            // commentElem.querySelectorAll(':scope' + ' > .comment__children > .comment'.repeat(COMMENT_DOWN_DEPTH + 1) + ', :scope' + ' > .comment__children'.repeat(COMMENT_DOWN_DEPTH) + '> .comment-toggle-children').forEach(x => {
            //   x.remove();
            // });
            let parent = commentElem;
            for (let i = 0; i < COMMENT_UP_DEPTH; ++i) {
                const container = parent.parentElement;
                if (container !== null && container.matches(".comment__children")) {
                    for (const child of container.childNodes) {
                        if (child.nodeType === Node.ELEMENT_NODE &&
                            !parent.isSameNode(child)) {
                            child.remove();
                            // (child as HTMLElement).style.opacity = '50%';
                        }
                    }
                    const parentComment = container.parentElement;
                    parent = parentComment;
                }
            }
            if (disableMiniProfile) {
                element
                    .querySelectorAll(".comment__user")
                    .forEach((x) => {
                    x.removeAttribute("data-profile");
                });
            }
            element.querySelectorAll("img").forEach((x) => {
                if (x.hasAttribute("data-src")) {
                    x.src = x.getAttribute("data-src");
                    x.classList.add("image-loaded");
                }
            });
            return parent;
        }
        function createCommentContainer(info, autoload, disableMiniProfile) {
            const container = document.createElement("div");
            container.classList.add("rpm-comment-container");
            const title = document.createElement("a");
            title.href = info.link;
            title.target = "_blank";
            title.textContent = `${info.rating} | ${info.postTitle}`;
            const loadFull = async () => {
                const icon = RPM.Nodes.createLoadingIcon();
                preview.replaceWith(icon);
                try {
                    const pikabuComment = await loadCommentFromPikabu(info, true, disableMiniProfile);
                    icon.replaceWith(pikabuComment);
                }
                catch (e) {
                    error(e);
                    icon.replaceWith("Не удалось загрузить комментарий :(");
                }
            };
            const preview = createCommentPreview(info, loadFull);
            container.append(title, preview);
            if (autoload) {
                loadFull();
            }
            return container;
        }
        function createCommentPreview(info, loadCallback) {
            const container = document.createElement("div");
            container.classList.add("rpm-comment-preview");
            const buttonToLoad = document.createElement("button");
            buttonToLoad.textContent = "Загрузить";
            buttonToLoad.addEventListener("click", loadCallback);
            container.append(buttonToLoad);
            return container;
        }
        async function loadCommentsFromGollum(userName) {
            userName = userName.replace(".", "_");
            const request = new HttpRequest(`https://gollum.space/user/${userName}-last`, "GET", "document");
            const response = await request.executeAsync();
            const htmlDoc = response.response;
            const comments = Array.from(htmlDoc.querySelectorAll(".comment-block"));
            return comments.map((elem) => {
                const anchor = elem.querySelector(".comment-link");
                const [rating, postTitle] = elem
                    .getAttribute("title")
                    .split("|")
                    .map((x) => x.trim());
                return {
                    id: parseInt(anchor.textContent),
                    postId: parseInt(elem.getAttribute("post")),
                    postTitle,
                    rating,
                    link: anchor.href.replace("pikabu.ru", "gollum.space"),
                };
            });
        }
        function createLastCommentsSection(userName, autoloadGollum = false, autoloadCount = 0, disableMiniProfile = false) {
            const main = document.createElement("div");
            main.classList.add("rpm-last-comments");
            const title = document.createElement("h4");
            title.textContent = "Последние комментарии";
            const containerOfComments = document.createElement("div");
            containerOfComments.classList.add("rpm-last-comments-container");
            const loadMoreBtn = document.createElement("button");
            loadMoreBtn.textContent = "Загрузить";
            main.append(title, containerOfComments, loadMoreBtn);
            async function* loadComments() {
                loadMoreBtn.textContent = "Больше комментариев";
                const loadingIcon = RPM.Nodes.createLoadingIcon();
                containerOfComments.append(loadingIcon);
                loadMoreBtn.style.display = "none";
                const comments = await loadCommentsFromGollum(userName);
                loadMoreBtn.style.display = "";
                loadingIcon.remove();
                if (comments.length === 0) {
                    containerOfComments.append("Комментарии не найдены.");
                }
                else {
                    let count = 0;
                    for (const comment of comments) {
                        containerOfComments.append(createCommentContainer(comment, count < autoloadCount, disableMiniProfile));
                        if (++count % CHUNK_SIZE == 0) {
                            yield;
                        }
                    }
                }
                loadMoreBtn.remove();
            }
            const loader = loadComments();
            if (autoloadGollum)
                loader.next();
            loadMoreBtn.addEventListener("click", () => {
                loader.next();
            });
            return main;
        }
        LastComments.createLastCommentsSection = createLastCommentsSection;
    })(LastComments || (LastComments = {}));
    Gollum.createLastCommentsSection = LastComments.createLastCommentsSection;
    let TagsSection;
    (function (TagsSection) {
        function createTag(name) {
            const elem = document.createElement("span");
            elem.classList.add("rpm-tags-tag");
            elem.textContent = name;
            return elem;
        }
        function createTagsSection(userName, tagsGetter, autoload = false) {
            const elem = document.createElement("div");
            elem.classList.add("rpm-tags-list");
            elem.innerHTML =
                '<span class="rpm-clickable">Нажмите, чтобы загрузить.</span>';
            const loadTags = () => {
                const loadingIcon = RPM.Nodes.createLoadingIcon();
                elem.replaceChildren(loadingIcon);
                getUserId(userName).then((userId) => {
                    tagsGetter(userId).then((tags) => {
                        const tagElems = tags.map(createTag);
                        if (tagElems.length > 0) {
                            elem.append(...tagElems);
                        }
                        else {
                            elem.append("Теги не найдены.");
                        }
                        loadingIcon.remove();
                    }, (e) => {
                        elem.textContent = "Не удалось получить теги.";
                        error(e);
                    });
                }, (e) => {
                    elem.textContent =
                        "Не удалось достучаться до Голлума и получить ID пользователя.";
                    error(e);
                });
            };
            if (!autoload) {
                const onClick = () => {
                    loadTags();
                    elem.removeEventListener("click", onClick);
                };
                elem.addEventListener("click", onClick);
            }
            else {
                loadTags();
            }
            return elem;
        }
        TagsSection.createTagsSection = createTagsSection;
        function createTagsContainer(userName, name, getter, autoload = false) {
            const elem = document.createElement("div");
            elem.classList.add("rpm-tags");
            const nameElem = document.createElement("h4");
            nameElem.textContent = name;
            const tagsList = createTagsSection(userName, getter, autoload);
            elem.append(nameElem, tagsList);
            return elem;
        }
        TagsSection.createTagsContainer = createTagsContainer;
    })(TagsSection || (TagsSection = {}));
    Gollum.createTagsSection = TagsSection.createTagsSection;
    Gollum.createTagsContainer = TagsSection.createTagsContainer;
})(Gollum || (Gollum = {}));
//#endregion
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
function waitForElement(selector, timeout = 5000, parent = null) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        parent = parent ?? document;
        const checkExistence = () => {
            const element = parent.querySelector(selector);
            if (element) {
                resolve(element);
            }
            else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
            }
            else {
                setTimeout(checkExistence, 50);
            }
        };
        checkExistence();
    });
}
const STYLES = `.story__footer .story__rating-up {
  margin-right: 5px !important;
}
.prm-minuses {
  padding-left: 7px !important;
  margin: 0px !important;
}
.story__rating-count {
  margin: 7px 0 7px;
}
.rpm-story-summary {
  margin: 14px 0 4px;
}
.rpm-summary-comment {
  margin-right: 8px;
}
.comment__rating-down .comment__rating-count {
  margin-right: 8px;
}
.comment__rating-down {
  padding: 2px 8px;
}
.story__footer .story__rating-rpm-count {
  font-size: 13px;
  color: var(--color-black-700);
  margin: auto 7px auto 7px;
  line-height: 0;
  display: block;
}
.story__footer .rpm-summary,
.comment .rpm-summary {
  margin: auto 9px auto 0px;
  font-weight: 500;
}
.comment__rating-rpm-count {
  padding: 2px 8px;
  flex-shrink: 0;
  margin-left: auto;
}
.rpm-rating-bar {
  width: 5px;
  background: var(--color-danger-800);
  height: 90%;
  position: absolute;
  right: -9.5px;
  top: 5%;
  border-radius: 5px;
}
.rpm-rating-bar-inner {
  background: var(--color-primary-700);    /* width: 99%; */
  border-radius: 5px;
  transition: height ease-in-out 0.5s;
}
.comment__body {
  position: relative;
}
.comment .rpm-rating-bar {
  height: 70px;
  top: 15px;
  left: -10px;
}  /* old mobile interface */
.story__footer-rating .story__rating-minus {
  background-color:var(--color-black-300);
  border-radius:8px;
  overflow:hidden;
  padding:0;
  display:flex;
  align-items:center  ;
}
.story__footer-rating .story__rating-down {
  display:flex;
  align-items:center;
  justify-content:center;
  padding-left:2px  ;
}
.rpm-download-video-button {
  display: inline-block;
  margin-left: 15px;
}
.rpm-block-author {
  overflow:hidden;
  margin-right:24px;
  cursor:pointer;
  display:flex;
  align-items:center;
  padding:0;
  background:0 0
}
.rpm-block-author:hover * {
  fill: var(--color-danger-800);
}
.story__footer-tools-inner .rpm-block-author {
  overflow: visible;
  margin-right: auto;
  margin-left:8px;
  transform: scale(1.3);
}
.rpm-open-settings-button {
  margin-top: 10px;
  text-align: center;
  width: 100%;
  font-size: 0.9em;
}
.rpm-video-list {
  text-align: center;
}
.rpm-video-list a {
  margin: 0 5px;
}
.rpm-story-icon {
  width: 24px;
  height: 24px;
  padding: 0 4px;
  margin-right: 6px;
  vertical-align: text-top;
  border-radius: 3px;
}
.rpm-story-icon svg {
  margin-top: auto;
  padding: 2px 0px;
  width: 16px;
  height: 16px;
  margin: 0;
  transition: all ease 300ms;
}
.rpm-story-icon:hover svg {
  width: 18px;
  height: 18px;
}
@media only screen and (max-width: 768px)  {
  #prm {
    left: 2.5% !important;
    width: 100% !important;
  }
}  /* Notifications */
@keyframes rpm-notification-intro {
  from {
    translate: -100%;
  }
  to {
    translate: 0%;
  }
}
@keyframes rpm-notification-outro {
  from {
    translate: 0 0%;
    opacity: 1.0;
  }
  to {
    translate: 0 -200%;
    opacity: 0;
  }
}
.rpm-notification {
  position: fixed;
  bottom: 15px;
  left: 15px;
  z-index: 9999;
  overflow: hidden;
  max-width: 250px;
  background: var(--color-black-100);
  border-radius: 10px;
  border: 1px solid var(--color-black-440);
}
.rpm-notification * {
  padding: 5px 15px;
}
.rpm-notification-header {
  background: var(--color-primary-800);
  color: white;
  font-weight: bolder;
}
.rpm-user-rating {
  font-size: 1.05em;
  padding: 0.3em 0.6em;
  border-radius: 1rem;
  display: inline-block;
  background-color: var(--color-black-alpha-005);
  user-select: none;
  white-space: nowrap;
  line-height: 1em;
}
.story__main .rpm-user-rating,
.rpm-placeholder .rpm-user-rating {
  margin-right: 10px;
}
.comment__header .rpm-user-rating {
  margin-left:auto;
  right: 0;
}
.rpm-user-rating + .comment__right {
  margin-left: unset;
}
.rpm-user-rating span {
  display: inline-block;
  min-width: 1.5ch;
  text-align: center;
}
.rpm-user-rating .rpm-rating {
  margin: 0 1ch;
}
.rpm-pluses {
  color: var(--color-primary-700);
}
.rpm-minuses {
  color: var(--color-danger-900);
}
.rpm-user-rating .rpm-pluses,
.rpm-user-rating .rpm-minuses,
.rpm-user-rating .rpm-more-votes {
  cursor: pointer;
}
.rpm-user-rating .rpm-more-votes {
  display: inline-block;
  height: 100%;
  margin-left: 1ch;
  width: 2ch;
  height: 2ch;
}
.rpm-user-rating .rpm-more-votes svg {
  width: 100%;
  height: 100%;
  translate: 0 2px;
}
.rpm-user {
  font-weight: 500;
}
.rpm-reason {
  font-style: italic;
}
.rpm-user-rating[rpm-own-vote="1"] {
  background-color: var(--color-primary-200)
}
.rpm-user-rating[rpm-own-vote="-1"] {
  background-color: var(--color-danger-200)
}
.rpm-placeholder {
  background-color: var(--color-bright-800);
  border: 1px solid var(--color-black-430);
  border-radius: 15px;
  width: max-content;
  height: max-content;
  text-align: center;
  margin: 10px auto 0;
  padding: 5px 20px;
  position: relative;
  max-width: 95%;
}
.rpm-placeholder .rpm-user-info-container {
  width: max-content;
  padding: 0.5em;
  border-radius: 10px;
  margin: 0 auto;
}
.rpm-placeholder .collapse-button {
  position: absolute;
  top: 0;
  left: -70px;
  translate: 0 -70%;
}
.mv .rpm-placeholder {
  font-size: 0.825em;
}
.mv .rpm-placeholder .collapse-button {
  display: inline flow-root list-item;
  position: initial;
  margin: 0 auto;
  translate: 0 0;
  transform: scale(0.75);
}
.rpm-placeholder:has(.collapse-button_active) + article {
  display: none;
}
.rpm-loading {
  display: block;
  width: 4px;
  height: 4px;
  border: 7px solid var(--color-primary-400);
  border-top: 7px solid var(--color-primary-700);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin: auto;
}
.rpm-feedback-window {
  position: fixed;
  display: flex;
  left: 70px;
  top: 100px;
  width: 450px;
  height: 50%;
  border: 1px solid var(--color-black-430);
  border-radius: 8px;
  background-color: var(--color-bright-800);
  padding: 0;
  flex-direction: column;
}
.rpm-feedback-window iframe {
  width: 100%;
}
.comment__more:has(+.rpm-unroll-all),
.rpm-unroll-all {
  --gap: 10px;
  width: calc(50% - var(--gap) / 2);
  margin-right: var(--gap);
  text-align: center;
}
.rpm-unroll-all {
  display: none;
  margin: auto 0;
  background-color: var(--color-primary-700);
  color: var(--color-bright-900);
}
.comment__more + .rpm-unroll-all {
  display: inline-block;
}
#prm {
  background-color: var(--color-black-440);
  border-radius: 15px;
  border: none !important;
}
#prm .field_label {
  font-size: 14px;
  font-weight: bold;
}
#prm .radio_label {
  font-size: 14px;
}
#prm .config_var {
  margin: 0 0 4px;
}
#prm .section_header {
  color: #FFF;
  font-size: 4em;
  margin: 0;
}
#prm .section_desc {
  color: var(--color-black-700);
  font-size: 9pt;
  margin: 0 0 6px;
}
#prm_wrapper {
  --gap: 10px;
  box-sizing: border-box;
  padding: 15px;
  margin: 0;
  display: flex;
  flex-flow: row wrap;
  align-content: space-evenly;
  gap: var(--gap);
}
#prm_header {
  height: max-content;
  flex: 0 0 100%;
}
#prm_header p {
  font-size: x-large;
}
#prm_header a {
  font-size: large;
  text-decoration: underline;
  margin: 0 10px;
}
.section_header_holder {
  margin: 8px auto 0;
  display: block;
  padding: 10px;
  flex-basis: 100%;
  overflow: hidden;
  border-radius: 10px;
  background-color: var(--color-black-430);
}
#prm_section_1,
#prm_section_2,
#prm_section_5,
#prm_section_6 {
  flex: 1;
}
#prm_buttons_holder {
  flex-basis: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  flex-flow: row wrap;
}
#prm_buttons_holder .reset_holder {
  flex-basis: 100%;
  text-align: right;
}
#prm_wrapper .section_header.center {
  font-size: 17pt;
  display: block;
  width: calc(100% + 20px);
  text-align: center;
  margin: -10px -10px 0;
  background-color: var(--color-primary-700);
  padding: 4px 0;
}
#prm_wrapper .config_var {
  width: 100%;
  margin-top: 5px;
  font-size: medium;
}
#prm_wrapper .config_var input,
#prm_wrapper .config_var select {
  margin-right: 10px;
}
#prm_wrapper .config_var input[type=text] {
  background-color: var(--color-black-440);
  padding: 2px;
  border: solid 1px black;
  border-radius: 7px;
  padding: 4px;
  width: 30%;
}
#prm_wrapper input[type=button],
#prm_wrapper button {
  background-color: var(--color-black-440);
  color: var(--color-black-700);
  transition: background-color 200ms ease-out, filter 200ms, color 200ms;
  padding: 0px 20px;
  vertical-align: middle;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 32px;
  font-weight: 500;
  max-width: 100%;
  text-wrap: balance;
}
#prm_buttons_holder button {
  background-color: var(--color-black-300);
}
#prm_wrapper input[type=button]:hover {
  background-color: var(--color-black-500);
}
#prm_wrapper input[type=checkbox] {
  margin-right: 10px;
  width: 1.25em;
  height: 1.25em;
}
#prm_wrapper select {
  background-color: var(--color-black-440);
  color: var(--color-black-700);
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  outline: none;
}
#prm_section_3 .config_var {
  display: inline-block;
  width: calc(100%/7);
  min-width: max-content;
  padding: 0 5px;
  text-align: center;
}
#prm_section_5 .config_var input[type=text] {
  width: 30em;
  max-width: 100%;
}
@media only screen and (max-width: 768px)  {
  #prm {
    width: unset !important;
    height: unset !important;
    left: 10px !important;
    right: 10px !important;
    top: 10px !important;
    bottom: 10px !important;
  }
  #prm_section_1,
  #prm_section_2,
  #prm_section_5,
  #prm_section_6  {
    flex: unset;
  }
  #prm_section_5 {
    display: none;
  }
  #prm .config_var {
    margin-bottom: 20px;
  }
  #prm .config_var:last-child {
    margin-bottom: unset;
  }
}  /* Notifications */
@keyframes rpm-notification-intro {
  from {
    translate: -100%;
  }
  to {
    translate: 0%;
  }
}  /* Themes */
.rpm-theme-picker {
  flex: 1 0 0px;
}
.rpm-theme-picker:after {
  content: attr(data-name)
}
.theme-picker__buttons {
  flex-wrap: wrap;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
}
.theme-picker__button {
  min-width: fit-content;
  max-width: max-content;
}
.theme-picker__button[data-type="default"] {
  max-width: unset;
  width: 35px;
}  /* SUNSET GLOW */
.rpm-theme-picker[data-type="sunset-glow"] {
  background: linear-gradient(135deg, #6b1d52, #b02e78, #f77fba);
  border: 2px solid #8e2465;
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.rpm-theme-picker[data-type="sunset-glow"]:hover {
  transform: scale(1.1);
}
html[data-theme="sunset-glow"] {
  --color-primary-900: #6b1d52;
  --color-primary-800: #8e2465;
  --color-primary-700: #b02e78;
  --color-primary-500: #d14791;
  --color-primary-400: #f77fba;
  --color-primary-200: #fbc8e4;
  --color-primary-100: #fdeaf4;
}  /* OCEAN BREEZE */
.rpm-theme-picker[data-type="ocean-breeze"] {
  background: linear-gradient(135deg, #012a4a, #014f86, #61a5c2);
  border: 2px solid #013a63;
  border-radius: 50%;
  transition: transform 0.2s ease;
}
.rpm-theme-picker[data-type="ocean-breeze"]:hover {
  transform: scale(1.1);
}
html[data-theme="ocean-breeze"] {
  --color-primary-900: #012a4a;
  --color-primary-800: #013a63;
  --color-primary-700: #014f86;
  --color-primary-500: #2a6f97;
  --color-primary-400: #61a5c2;
  --color-primary-200: #a9d6e5;
  --color-primary-100: #d9f1f6;
}  /* FOREST */
.rpm-theme-picker[data-type="forest-whisper"] {
  background: linear-gradient(135deg, #143601, #275d03, #63b530);
  border: 2px solid #1c4a02;
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.rpm-theme-picker[data-type="forest-whisper"]:hover {
  transform: scale(1.1);
}
html[data-theme="forest-whisper"] {
  --color-primary-900:rgb(27, 68, 3);
  --color-primary-800:rgb(32, 80, 4);
  --color-primary-700:rgb(72, 170, 7);
  --color-primary-500: #398d05;
  --color-primary-400: #63b530;
  --color-primary-200: #a9e8a4;
  --color-primary-100:rgb(227, 248, 227);
}  /* LAVENDER DREAMS */
.rpm-theme-picker[data-type="lavender-dreams"] {
  background: linear-gradient(135deg, #4c1d6f, #70308e, #cfa5e0);
  border: 2px solid #5e267e;
  border-radius: 50%;
  transition: transform 0.2s ease;
}
.rpm-theme-picker[data-type="lavender-dreams"]:hover {
  transform: scale(1.1);
}
html[data-theme="lavender-dreams"] {
  --color-primary-900:rgb(141, 92, 179);
  --color-primary-800:rgb(117, 57, 151);
  --color-primary-700:rgb(132, 73, 160);
  --color-primary-500: #9b5cb2;
  --color-primary-400: #cfa5e0;
  --color-primary-200:rgb(236, 223, 245);
  --color-primary-100: #f7ecfc;
}  /* FIRE EMBER */
.rpm-theme-picker[data-type="fire-ember"] {
  background: linear-gradient(135deg, #7f1d1d, #b91c1c, #f87171);
  border: 2px solid #991b1b;
  border-radius: 8px;
  transition: transform 0.2s ease;
}
.rpm-theme-picker[data-type="fire-ember"]:hover {
  transform: scale(1.1);
}
html[data-theme="fire-ember"] {
  --color-primary-900:rgb(145, 42, 42);
  --color-primary-800:rgb(172, 42, 42);
  --color-primary-700:rgb(211, 32, 32);
  --color-primary-500:rgb(241, 62, 62);
  --color-primary-400:rgb(252, 138, 138);
  --color-primary-200:rgb(253, 185, 185);
  --color-primary-100: #fee2e2;
}  /* POLKA (mosaic before) */
html[data-theme="mosaic"] .app {
  background-image:  radial-gradient(rgba(68, 77, 247, 0.5) 1.3px, transparent 1.3px), radial-gradient(rgba(68, 77, 247, 0.5) 1.3px, transparent 1.3px);
  background-repeat: repeat;
  background-size: 66px 66px;
  background-position: 0 0, 33px 33px;
}
.rpm-theme-picker[data-type="mosaic"] {
  background-image:  radial-gradient(rgba(68, 77, 247, 0.5) 1.3px, transparent 1.3px), radial-gradient(rgba(68, 77, 247, 0.5) 1.3px, rgba(0, 0, 0, 0.1) 1.3px);
  background-repeat: repeat;
  background-size: 10px 10px;
  background-position: 0 0, 5px 5px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.rpm-theme-picker[data-type="mosaic"]:after {
  color: var(--color-black-800);
}
.rpm-theme-picker[data-type="mosaic"]:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}  /* WHITE TEXT */
html[data-theme="lavender-dreams"] .achievements-progress__bar,
html[data-theme="fire-ember"] .achievements-progress__bar,
html[data-theme="forest-whisper"] .achievements-progress__bar,
html[data-theme="ocean-breeze"] .achievements-progress__bar,
html[data-theme="sunset-glow"] .achievements-progress__bar {
  color: white;
}
/* MINI PROFILE */.rpm-mini-profile-note {
  resize: none;
}
.rpm-mini-profile-note-display {
  display: block;
  min-height: 10px;
}
.rpm-powered {
  text-align: right;
  display: inline-block;
  width: 100%;
  font-size: 0.8em;
  opacity: 80%;
}
.rpm-gollum-stats {
  width: 100%;
  padding: 15px;
}
.rpm-gollum-stats > * {
  margin-bottom: 10px;
}
.rpm-gollum-stats > *:last-child {
  margin-bottom: unset;
}
.rpm-tags p {
  width: 100%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
}
.rpm-tags-list {
  justify-content: space-evenly;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 0.8rem;
}
.rpm-clickable {
  cursor: pointer;
}
.rpm-tags-tag {
  background: var(--color-primary-200);
  padding: 0.05em 0.6em;
  border-radius: 10px;
}
.mini-profile[rpm-affected] {
  width: 400px;
}
.rpm-last-comments-container {
  max-height: 150px;
  overflow-y: scroll;
}
.rpm-comment-no-js .comment__tools,
.rpm-comment-no-js .comment__controls,
.rpm-comment-no-js .comment-hidden-group {
  display: none;
}
.rpm-last-comments > p {
  font-weight: bold;
  text-align: center;
}
.rpm-last-comments > button {
  width: 100%;
  text-align: center;
}
.rpm-last-comments-container {
  max-height: 400px;
  height: max-content;
  resize: vertical;
  border-radius: 15px;
  margin-bottom: 10px;
}
section .rpm-last-comments-container {
  max-height: unset;
}
.rpm-comment-container {
  border-radius: 15px;
  background: var(--color-black-430);
  margin-bottom: 7px;
  padding: 5px 1em;
  overflow: hidden;
}
.rpm-comment-container > a {
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
.rpm-comment-container .comment__tools > *:not([data-role="link"]) {
  display: none;
}
.rpm-comment-preview {
  text-align: center;
}
.rpm-highlight-comment > .comment__body  {
  border: 3px dotted var(--color-primary-400);
  border-radius: 10px;
  padding: 5px;
}
.rpm-comment-container > .comment,
.rpm-comment-container > .comments {
  background: var(--color-bright-800);
  border-radius: 15px;
  padding: 0 5px;
  padding-top: 5px;
}


.rpm-new-rating-counter {
  color: var(--rating-text);
  font-size: 1em;    
}
.story__rating-block .rpm-new-rating-counter {  
  font: var(--rating-textCounter);
}
.comment__rating .rpm-new-rating-counter {
  font: var(--s-text-label-main-typRegular-style) var(--s-text-label-main-typRegular-weight) var(--s-text-label-main-size)/var(--s-text-label-main-lh) var(--s-text-label-main-font);
  margin: 0 4px;
}
.comment__rating-down, .comment__rating-up {  
  padding: 4px;
}
` + RPM.STYLE;
let enableFilters = null;
const isStoryPage = window.location.href.includes("/story/");
const currentStoryId = parseInt(["0", ...window.location.href.split("_")].pop());
function makeEval(args, str, defaultFunc) {
    try {
        return new Function(args, "return " + str);
    }
    catch {
        return defaultFunc;
    }
}
class Formats {
}
var SettingEnums;
(function (SettingEnums) {
    let UnrollComments;
    (function (UnrollComments) {
        UnrollComments["NONE"] = "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0430\u044F \u043F\u0438\u043A\u0430\u0431\u0443\u0448\u043D\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430";
        UnrollComments["UNROLL_ALL_BUTTON"] = "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043A\u043D\u043E\u043F\u043A\u0430 \"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C \u0432\u0441\u0451\"";
        UnrollComments["AUTO_UNROLL"] = "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0440\u0430\u0441\u043A\u0440\u0443\u0442\u043A\u0430 \u0432\u0441\u0435\u0445 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0435\u0432";
    })(UnrollComments = SettingEnums.UnrollComments || (SettingEnums.UnrollComments = {}));
    let MiniProfileFeaturesOrientation;
    (function (MiniProfileFeaturesOrientation) {
        MiniProfileFeaturesOrientation["VERTICAL"] = "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u043E";
        MiniProfileFeaturesOrientation["HORIZONTAL"] = "\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u043E";
    })(MiniProfileFeaturesOrientation = SettingEnums.MiniProfileFeaturesOrientation || (SettingEnums.MiniProfileFeaturesOrientation = {}));
})(SettingEnums || (SettingEnums = {}));
const formats = new Formats();
let isConfigInit = false;
let frame = document.createElement("div");
document.body.appendChild(frame);
async function handleOldConfigFields() {
    const config = JSON.parse(await GM.getValue("prm", "{}"));
    let changed = false;
    if ("unrollCommentariesAutomatically" in config) {
        if (config.unrollCommentariesAutomatically) {
            config.unrollCommentaries = SettingEnums.UnrollComments.AUTO_UNROLL;
        }
        delete config.unrollCommentariesAutomatically;
    }
    if (changed)
        await GM.setValue("prm", JSON.stringify(config));
}
async function handleConfig() {
    await handleOldConfigFields();
    GM_config.init({
        id: "prm",
        title: (() => {
            const div = document.createElement("div");
            const p1 = document.createElement("p");
            p1.textContent = "Return Pikabu minus";
            const links = [];
            function addLink(text, url) {
                const link = document.createElement("a");
                link.href = url;
                link.textContent = text;
                links.push(link);
            }
            addLink("Телеграм", "https://t.me/return_pikabu");
            addLink("GitHub", "https://github.com/PyXiion/Pikabu-Return-Minus");
            addLink("Условия использования (НОВОЕ)", "https://rpm.pyxiion.ru/terms");
            div.append(p1, ...links);
            return div;
        })(),
        fields: {
            // ОБЩИЕ НАСТРОЙКИ
            summary: {
                section: ["Общие настройки"],
                type: "checkbox",
                default: true,
                label: "Отображение суммарного рейтинга у постов и комментариев.",
            },
            minRatesCountToShowRatingBar: {
                type: "int",
                default: 3,
                label: "Минимальное количество оценок у поста или комментария для отображения соотношения плюсов и минусов. " +
                    "Установите на 0, чтобы всегда показывать.",
            },
            noLinkTracking: {
                type: "checkbox",
                default: true,
                label: "Удалять трекеры с ссылок.",
            },
            // НАСТРОЙКИ ПОСТОВ
            minStoryRating: {
                section: ["Настройки постов"],
                type: "int",
                default: 100,
                label: "Посты с рейтингом ниже указанного будут удаляться из ленты. Вы сможете увидеть удалённые посты в списке просмотренных.",
            },
            ratingBar: {
                type: "checkbox",
                default: true,
                label: "Отображение соотношения плюсов и минусов у постов. При отсутствии оценок у поста будет показано соотношение 1:1.",
            },
            storyCounters: {
                type: "checkbox",
                default: true,
                label: "Отображение плюсов и минусов у поста."
            },
            showBlockAuthorForeverButton: {
                type: "checkbox",
                default: true,
                label: "Отображение кнопки, которая блокирует автора поста навсегда. То есть добавляет в игнор-лист. " +
                    "Вы должны быть авторизированы на сайте, иначе кнопка работать не будет.",
            },
            blockPaidAuthors: {
                type: "checkbox",
                default: true,
                label: "Удаляет из ленты посты от проплаченных авторов (которые с подпиской Пикабу+).",
            },
            videoDownloadButtons: {
                type: "checkbox",
                default: true,
                label: "Добавляет ко всем видео в постах ссылки на источники, если их возможно найти.",
            },
            socialLinks: {
                type: "checkbox",
                default: false,
                label: "Добавляет в начале заголовка поста значки Телеграма, ВК, Тиктока, если в посте есть соответствующие ссылки.",
            },
            // НАСТРОЙКИ КОММЕНТАРИЕВ
            ratingBarComments: {
                section: ["Настройки комментариев"],
                type: "checkbox",
                default: true,
                label: "Отображение соотношения плюсов и минусов у комментариев.",
            },
            commentVideoDownloadButtons: {
                type: "checkbox",
                default: true,
                label: "Добавляет ко всем видео в комментариях ссылки на источники, если их возможно найти.",
            },
            commentCounters: {
                type: "checkbox",
                default: true,
                label: "Отображение плюсов и минусов у комментария."
            },
            unrollCommentariesAutomatically: {
                // DEPRECATED
                type: "hidden",
                default: undefined,
            },
            unrollCommentaries: {
                type: "select",
                label: "Раскрутка комментариев.",
                options: [
                    SettingEnums.UnrollComments.NONE,
                    SettingEnums.UnrollComments.UNROLL_ALL_BUTTON,
                    SettingEnums.UnrollComments.AUTO_UNROLL,
                ],
                default: SettingEnums.UnrollComments.NONE,
            },
            // ВКЛАДКИ ПИКАБ
            hotTab: {
                section: [
                    "Вкладки Пикабу",
                    "Включает/выключает вкладки сверху. Работает только на ПК",
                ],
                type: "checkbox",
                default: true,
                label: "Горячее",
            },
            bestTab: {
                type: "checkbox",
                default: true,
                label: "Лучшее",
            },
            newTab: {
                type: "checkbox",
                default: true,
                label: "Свежее",
            },
            subsTab: {
                type: "checkbox",
                default: true,
                label: "Подписки",
            },
            communitiesTab: {
                type: "checkbox",
                default: true,
                label: "Сообщества",
            },
            blogsTab: {
                type: "checkbox",
                default: true,
                label: "Блоги",
            },
            expertsTab: {
                type: "checkbox",
                default: true,
                label: "Эксперты",
            },
            // НАСТРОЙКИ RPM
            rpmEnabled: {
                section: [
                    "Настройки RPM",
                    "Дополнительные функции скрипта. Используется сервер rpm.pyxiion.ru",
                ],
                type: "checkbox",
                default: true,
                label: "Включить для постов.",
            },
            rpmMinStoryRating: {
                type: "int",
                default: 0,
                label: "Минимальный рейтинг автора в системе RPM. Если рейтинг автора меньше его значения, то его посты будут удалены из ленты.",
            },
            rpmIgnoreDownvoted: {
                type: "checkbox",
                default: true,
                label: "Скрытие постов с вашим минусом в системе RPM. Типа игнор-листа.",
            },
            rpmComments: {
                type: "checkbox",
                default: true,
                label: "Включить для комментариев.",
            },
            rpmStoryVoteReason: {
                type: "checkbox",
                default: true,
                label: "Показывать причину оценки (если таковая имеется) в начале поста.",
            },
            registerRpm: {
                type: "button",
                label: "Зарегистрироваться в системе RPM. После нажатия страница перезагрузится.",
                async click() {
                    const uuid = GM_config.get("uuid");
                    if (uuid === null || uuid === undefined || uuid === "") {
                        GM_config.set("uuid", await RPM.Service.register());
                        GM_config.save();
                        sendNotification("Успешно", "Вы успешно зарегистрировались. Или нет. Проверки успешности не существует.");
                        await sleep(300);
                        window.location.reload();
                    }
                    else {
                        sendNotification("Вы уже зарегистрированы", "Вы не можете зарегистрироватся ещё раз.");
                    }
                },
            },
            // НАСТРОЙКИ МИНИ-ПРОФИЛЕЙ
            miniProfileEditableNote: {
                section: [
                    "Настройки мини-профилей",
                    "Дополнительные функции в мини-профилей пользователей, которые появляются при наведении на их ник.",
                ],
                type: "checkbox",
                default: true,
                label: "Редактирование заметки.",
            },
            miniProfileStoryTags: {
                type: "checkbox",
                default: true,
                label: "Основные теги постов пользователя.",
            },
            miniProfileСommentTags: {
                type: "checkbox",
                default: true,
                label: "Основные теги постов, где пользователь оставляет комментарии.",
            },
            miniProfileСomments: {
                type: "checkbox",
                default: false,
                label: "Последние комментарии пользователя.",
            },
            miniProfileAutoloadTags: {
                type: "checkbox",
                default: false,
                label: "Автозагрузка тегов.",
            },
            miniProfileAutoloadComments: {
                type: "checkbox",
                default: false,
                label: "Автозагрузка предпросмотра последних комментариев.",
            },
            miniProfileAutoloadPikabuCommentCount: {
                type: "number",
                default: 1,
                label: "Сколько комментариев загрузить без нажатия на кнопку Загрузить.",
            },
            miniProfileOrientation: {
                type: "select",
                default: SettingEnums.MiniProfileFeaturesOrientation.HORIZONTAL,
                options: [
                    SettingEnums.MiniProfileFeaturesOrientation.HORIZONTAL,
                    SettingEnums.MiniProfileFeaturesOrientation.VERTICAL,
                ]
            },
            // СТРАНИЦА ПОЛЬЗОВАТЕЛЯ
            profileStoryTags: {
                section: [
                    "Настройки профилей пользователей",
                    "То же самое, но только на странице профиля.",
                ],
                type: "checkbox",
                default: true,
                label: "Основные теги постов пользователя.",
            },
            profileСommentTags: {
                type: "checkbox",
                default: true,
                label: "Основные теги постов, где пользователь оставляет комментарии.",
            },
            profileСomments: {
                type: "checkbox",
                default: true,
                label: "Последние комментарии пользователя.",
            },
            profileAutoloadComments: {
                type: "checkbox",
                default: true,
                label: "Автозагрузка предпросмотра последних комментариев.",
            },
            profileAutoloadPikabuCommentCount: {
                type: "number",
                default: 3,
                label: "Сколько комментариев загрузить без нажатия на кнопку Загрузить.",
            },
            // БОЛЕЕ СЛОЖНЫЕ НАСТРОЙКИ
            filteringPageRegex: {
                section: ["Продвинутые настройки"],
                type: "text",
                label: "Страницы, на которых работает фильтрация по рейтингу (регулярное выражение).",
                default: "^https?:\\/\\/pikabu.ru\\/(|best|companies|browse|disputed|most-saved)$",
            },
            minusesPattern: {
                type: "text",
                default: "story.minuses",
                label: "Шаблон отображения минусов у постов (JS). Пример: `story.minuses * 5000`. story: {id, rating, pluses, minuses}. Внутри может выполняться любой код, поэтому используйте с осторожностью.\n" +
                    "Шаблоны гарантированно работают только на Tampermonkey.",
            },
            minusesCommentPattern: {
                type: "text",
                default: "comment.minuses",
                label: "Шаблон отображения минусов у комментариев (JS). Пример: `comment.minuses * 5000`. comment: {id, rating, pluses, minuses}.",
            },
            ownCommentPattern: {
                type: "text",
                default: "comment.pluses == 0 && comment.minuses == 0 ? 0 : comment.pluses == comment.minuses ? `+${comment.pluses} / -${comment.minuses}` : comment.pluses == 0 ? `-${comment.minuses}` : comment.minuses == 0 ? `+${comment.pluses}` : `+${comment.pluses} / ${comment.rating} / -${comment.minuses}`",
                label: "Шаблон отображения рейтинга у ВАШИХ комментариев (JS). Пример: `comment.minuses * 5000`. comment: {id, rating, pluses, minuses}.",
            },
            analytics: {
                type: "checkbox",
                label: "Аналитика.",
                default: true,
            },
            debug: {
                type: "checkbox",
                label: "Включить дополнительные логи в консоли. Для разработки и отладки.",
                default: false,
            },
            uuid: {
                type: "hidden",
                // label:
                //   "Ваш уникальный UUID в системе рейтинга RPM. Позволяет вам оценивать профили других пользователей.",
                default: "",
            },
        },
        events: {
            init() {
                isConfigInit = true;
                formats.formatStoryMinuses = makeEval("story", this.get("minusesPattern"), (x) => x.minuses);
                formats.formatCommentMinuses = makeEval("comment", this.get("minusesCommentPattern"), (x) => x.minuses);
                formats.formatOwnComment = makeEval("comment", this.get("ownCommentPattern"), (x) => x.pluses == 0 && x.minuses == 0 ? 0 : `${x.pluses}/${x.minuses}`);
                enableFilters = new RegExp(this.get("filteringPageRegex")).test(window.location.href);
                this.css.basic = [];
                if (this.get("unrollCommentariesAutomatically")) {
                    this.set("unrollCommentatries", SettingEnums.UnrollComments.AUTO_UNROLL);
                    this.set("unrollCommentariesAutomatically", null);
                    this.save();
                }
            },
        },
        frame: frame,
    });
}
handleConfig();
const logPrefix = "[RPM]";
function info(...args) {
    if (GM_config === undefined || GM_config.get === undefined)
        return;
    if (GM_config.get("debug")) {
        console.info(logPrefix, ...args);
    }
}
function warn(...args) {
    if (GM_config === undefined || GM_config.get === undefined)
        return;
    if (GM_config.get("debug")) {
        console.warn(logPrefix, ...args);
    }
}
function error(...args) {
    if (GM_config === undefined || GM_config.get === undefined)
        return;
    if (GM_config.get("debug")) {
        console.error(logPrefix, ...args);
    }
}
const waitConfig = () => new Promise((resolve) => {
    let isInit = () => setTimeout(() => (isConfigInit ? resolve() : isInit()), 1);
    isInit();
});
const supportMenuCommands = GM.registerMenuCommand !== undefined;
GM.registerMenuCommand("Открыть настройки", () => {
    info("Открыты настройки.");
    GM_config.open();
});
function addCss(css) {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    // is added to the end of the body because it must override some of the original styles
    document.body.appendChild(styleSheet);
    info("Добавлен CSS");
}
const blockIconTemplate = (function () {
    const div = document.createElement("div");
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon--ui__save"><use xlink:href="#icon--ui__ban"></use></svg>`;
    return div.firstChild;
})();
// UI functions
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sendNotification(title, description, timeout = 2000, html = false) {
    function construct() {
        const notification = document.createElement("div");
        notification.classList.add("rpm-notification");
        const header = document.createElement("div");
        header.classList.add("rpm-notification-header");
        header.textContent = title;
        const content = document.createElement("div");
        content.classList.add("rpm-notification-content");
        if (html) {
            content.innerHTML = description;
        }
        else {
            content.textContent = description;
        }
        notification.append(header, content);
        return notification;
    }
    const notification = construct();
    document.body.append(notification);
    const animationTime = 600.0;
    notification.style.animationDuration = `${animationTime / 1000.0}s`;
    notification.style.animationTimingFunction = "cubic-bezier(.18,.89,.32,1.28)";
    // Intro
    notification.style.animationName = "rpm-notification-intro";
    await sleep(animationTime);
    await sleep(timeout);
    // Outro
    notification.style.animationTimingFunction = "linear";
    notification.style.animationName = "rpm-notification-outro";
    notification.style.opacity = "0";
    await sleep(animationTime);
    // Remove
    notification.remove();
}
// Functions
async function blockAuthorForever(button, authorId) {
    button.disabled = true;
    // const fetch = unsafeWindow.fetch;
    try {
        await fetch(`https://pikabu.ru/ajax/ignore_actions.php?authors=${authorId}&story_id=0&period=forever&action=add_rule`, {
            method: "POST",
        });
        button.remove();
        info("Автор с ID", authorId, "заблокирован");
    }
    catch {
        button.disabled = false;
        error("Не получилось заблокировать автора с ID", authorId, ", возможно отсутствует Интернет-соединение");
    }
}
function addBlockButton(story) {
    const saveButton = story.querySelector(".story__save");
    if (saveButton === null) {
        warn("Failed to add a block button to", story);
        return;
    }
    const button = document.createElement("button");
    button.classList.add("rpm-block-author", "hint");
    button.setAttribute("aria-label", "Заблокировать автора навсегда");
    button.appendChild(blockIconTemplate.cloneNode(true));
    const authorId = parseInt(story.getAttribute("data-author-id"));
    button.addEventListener("click", () => {
        blockAuthorForever(button, authorId);
    });
    saveButton.parentElement.insertBefore(button, saveButton);
}
function addRatingBar(story, ratio) {
    const block = story.querySelector(".story__rating-block, .comment__body, .story__emotions");
    if (block !== null) {
        const bar = document.createElement("div");
        const inner = document.createElement("div");
        bar.append(inner);
        bar.classList.add("rpm-rating-bar");
        inner.classList.add("rpm-rating-bar-inner");
        inner.style.height = (ratio * 100).toFixed(1) + "%";
        block.prepend(bar);
        return inner;
    }
    else {
        // TODO mobile
    }
}
function updateRatingBar(innerRatingBarElem, pluses, minuses) {
    innerRatingBarElem.style.height = `${(pluses / (pluses + minuses) * 100).toFixed(1)}%`;
}
const linkTypes = [
    // Telegram
    {
        domains: ["t.me"],
        iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" class="rpm-story-icon icon icon--social__telegram"><use xlink:href="#icon--social__telegram"></use></svg>`,
        style: "fill: #24A1DE;",
    },
    // VK
    {
        domains: ["vk.com"],
        iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon--social__vk"><use xlink:href="#icon--social__vk"></use></svg>`,
        style: "fill: black;",
    },
    // TIKTOK
    {
        domains: ["tiktok.com"],
        iconHtml: `<svg class="icon" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>`,
    },
    // Boosty
    {
        domains: ["boosty.to"],
        iconHtml: `<svg class="icon" fill="#000000" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="50 50 217.4 197.4">
                <style type="text/css">
                  .st0{fill:#242B2C;}
                  .st1{fill:url(#SVGID_1_);}
                </style>
                <g id="sign">
                  <g id="b_1_">
                    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="188.3014" y1="75.5591" x2="123.8106" y2="295.4895">
                      <stop offset="0" style="stop-color:#EF7829"/>
                      <stop offset="5.189538e-02" style="stop-color:#F07529"/>
                      <stop offset="0.3551" style="stop-color:#F0672B"/>
                      <stop offset="0.6673" style="stop-color:#F15E2C"/>
                      <stop offset="1" style="stop-color:#F15A2C"/>
                    </linearGradient>
                    <path class="st1" d="M87.5,163.9L120.2,51h50.1l-10.1,35c-0.1,0.2-0.2,0.4-0.3,0.6L133.3,179h24.8c-10.4,25.9-18.5,46.2-24.3,60.9    c-45.8-0.5-58.6-33.3-47.4-72.1 M133.9,240l60.4-86.9h-25.6l22.3-55.7c38.2,4,56.2,34.1,45.6,70.5C225.3,207,179.4,240,134.8,240    C134.5,240,134.2,240,133.9,240z"/>
                  </g>
                </g>
              </svg>`,
    },
];
async function checkStoryLinks(story) {
    function addIcon(linkType, element) {
        const elem = element.cloneNode();
        elem.innerHTML = linkType.iconHtml.trim();
        if (linkType.style) {
            elem.setAttribute("style", linkType.style);
        }
        elem.classList.add("rpm-story-icon");
        // Add before the title
        const titleElem = story.querySelector(".story__title");
        titleElem.prepend(elem);
    }
    const linkElems = Array.from(story.querySelectorAll(".story__content a"));
    linkElems.reverse();
    // Iterate reversibly so that the last link is added to the icon list
    linkTypeFor: for (const linkType of linkTypes) {
        for (const domain of linkType.domains) {
            for (const linkElem of linkElems) {
                if (linkElem.href.includes(domain)) {
                    addIcon(linkType, linkElem);
                    continue linkTypeFor;
                }
            }
        }
    }
}
function removeStory(storyElem, reason, keepUser = false) {
    const titleElem = storyElem.querySelector(".story__title a.story__title-link");
    if (titleElem === null || storyElem.hasAttribute("rpm-deleted"))
        return;
    storyElem.setAttribute("rpm-deleted", "");
    const title = titleElem.textContent;
    const url = titleElem.href;
    const placeholder = document.createElement("div");
    placeholder.classList.add("rpm-placeholder");
    const urlElem = document.createElement("a");
    urlElem.textContent = title;
    urlElem.href = url;
    const userInfo = storyElem.querySelector(".story__user-info");
    if (keepUser && userInfo) {
        const userInfoContainer = document.createElement("div");
        userInfoContainer.append(userInfo.cloneNode(true));
        userInfoContainer.classList.add("rpm-user-info-container");
        // Update RPM ratings
        for (const ratingElem of userInfoContainer.querySelectorAll(".rpm-user-rating")) {
            const uid = parseInt(ratingElem.getAttribute("pikabu-user-id"));
            ratingElem.replaceWith(RPM.Nodes.createUserRatingNode(uid, url));
        }
        placeholder.append(urlElem, ` скрыт: ${reason}.`, userInfoContainer);
    }
    else {
        placeholder.append(urlElem, ` скрыт: ${reason}.`);
    }
    storyElem.parentElement.insertBefore(placeholder, storyElem);
    const collapseButton = document.createElement("div");
    collapseButton.classList.add("collapse-button", "collapse-button_active");
    collapseButton.append(document.createElement("div"), document.createElement("div"));
    collapseButton.addEventListener("click", () => {
        if (collapseButton.classList.contains("collapse-button_active"))
            collapseButton.classList.remove("collapse-button_active");
        else
            collapseButton.classList.add("collapse-button_active");
    });
    placeholder.prepend(collapseButton);
}
const trackedLinkPattern = /pikabu.ru.+\?[ut]=(.+?)&[ut]=.+/i;
function removeLinkTracker(link) {
    if (trackedLinkPattern.test(link.href)) {
        const realUrl = trackedLinkPattern.exec(link.href)[1];
        link.href = decodeURIComponent(realUrl);
    }
}
async function processStory(story) {
    // Block author button
    if (GM_config.get("showBlockAuthorForeverButton")) {
        addBlockButton(story);
    }
    // Links
    if (GM_config.get("socialLinks")) {
        checkStoryLinks(story);
    }
    // Remove pikabu trackers
    if (GM_config.get("noLinkTracking")) {
        const links = story.querySelectorAll("a");
        links.forEach(removeLinkTracker);
    }
    // Block paid stories
    if (enableFilters &&
        GM_config.get("blockPaidAuthors") &&
        story.querySelector('.user__label[data-type="pikabu-plus"]') !== null) {
        removeStory(story, "подписка Пикабу+", true);
        info("Удалил пост", story, "как проплаченный");
        // RPM.Analytics.sendEvent('blockPaidAuthor');
    }
    // RPM
    if (GM_config.get("rpmEnabled")) {
        try {
            processStoryRpm(story);
        }
        catch (e) {
            error(e);
        }
    }
    const rating = parseInt(story.getAttribute('data-rating'));
    // delete the story if its ratings < the min rating
    if (enableFilters &&
        rating < GM_config.get("minStoryRating")) {
        removeStory(story, `рейтинг поста (${rating})`);
        info("Удалил пост", story, "по фильтру рейтинга");
    }
    // videos
    if (GM_config.get("videoDownloadButtons"))
        processPostVideos(story);
    const ratingBlock = story.querySelector('.story__rating-block');
    const vid = story.getAttribute('data-vid');
    const authorId = parseInt(story.getAttribute('data-author-id'));
    const pluses = getRealRating(parseInt(ratingBlock.getAttribute('data-pluses')), vid, authorId);
    const minuses = getRealRating(parseInt(ratingBlock.getAttribute('data-minuses')), vid, authorId);
    const vote = parseInt(ratingBlock.getAttribute('data-vote') || '0');
    let onVoteCallback = null;
    if (GM_config.get("ratingBar") && (pluses + minuses !== 0) && (pluses + minuses) >= GM_config.get('minRatesCountToShowRatingBar')) {
        const bar = addRatingBar(story, (pluses) / (pluses + minuses));
        onVoteCallback = (x, y) => {
            updateRatingBar(bar, x, y);
        };
    }
    replaceRating(ratingBlock.querySelector('.story__rating-count'), vote, pluses, minuses, false, onVoteCallback);
}
async function processStoryRpm(story) {
    const storyId = parseInt(story.getAttribute('data-story-id'));
    const uid = parseInt(story.getAttribute("data-author-id"));
    const userInfoRowElem = story.querySelector(".story__community_after-author-panel, .story__user-info");
    const footerElem = story.querySelector(".story__footer-tools .story__comments-link.story__to-comments");
    function ratingCallback(userInfo) {
        if (!enableFilters)
            return;
        const rating = userInfo.base_rating +
            userInfo.pluses -
            userInfo.minuses +
            (userInfo.own_vote ?? 0);
        const ownVote = userInfo.own_vote ?? 0;
        if (ownVote === -1) {
            removeStory(story, userInfo.own_reason_text ?? `ваш минус пользователю в RPM`, true);
        }
        else if (rating < GM_config.get("rpmMinStoryRating") &&
            ownVote != 1) {
            removeStory(story, `RPM-рейтинг (${rating})`, true);
        }
    }
    const elem = RPM.Nodes.createUserRatingNode(uid, `https://pikabu.ru/story/_${storyId}`, ratingCallback);
    if (userInfoRowElem)
        userInfoRowElem.prepend(elem);
    else
        footerElem.parentElement.insertBefore(elem, footerElem);
    // Vote reason
    if (GM_config.get("rpmStoryVoteReason")) {
        const info = await RPM.Service.getUserInfo(uid);
        if (info.own_reason_text) {
            const storyMain = story.querySelector(".story__main");
            storyMain.insertBefore(RPM.Nodes.createUserVoteReasonContainer(info.own_reason_text), storyMain.querySelector(".story__content-wrapper"));
        }
    }
}
function getRealRating(value, vid, authorId) {
    // thanks to Pikabu fixes
    const OFFSET = 253537024;
    const MOD_O = 99;
    const MOD_R = 98;
    if (value >= 0) {
        return value;
    }
    vid = parseInt(String(vid).replace(/\D/g, ''), 10);
    const a = (vid % MOD_O) + 1;
    const l = authorId % MOD_R;
    return Math.floor((-value - l) / a - OFFSET);
}
function replaceRating(ratingElem, vote, pluses, minuses, isComment = false, onChange = null) {
    const summary = GM_config.get('summary');
    const shouldCreateOtherCounters = isComment ? GM_config.get('commentCounters') : GM_config.get('storyCounters');
    const ratingBlock = ratingElem.parentElement;
    const plusBtn = ratingBlock.querySelector('.story__rating-up, .comment__rating-up');
    const minusBtn = ratingBlock.querySelector('.story__rating-down, .comment__rating-down');
    let rating = pluses - minuses;
    if (summary) {
        ratingElem.textContent = (rating + vote).toString();
    }
    else {
        ratingElem.style.display = 'none';
    }
    let plusesElem, minusesElem;
    if (shouldCreateOtherCounters) {
        plusesElem = document.createElement('div');
        minusesElem = document.createElement('div');
        plusesElem.classList.add('rpm-new-rating-counter');
        minusesElem.classList.add('rpm-new-rating-counter');
        ratingBlock.insertBefore(plusesElem, ratingElem);
        ratingBlock.insertBefore(minusesElem, ratingElem.nextSibling);
        plusesElem.textContent = (pluses + (vote === 1 ? 1 : 0)).toString();
        minusesElem.textContent = (minuses + (vote === -1 ? 1 : 0)).toString();
    }
    const onClick = (btn) => {
        if (btn === vote) {
            vote -= btn;
        }
        else {
            vote += btn;
        }
        if (onChange)
            onChange(pluses + (vote === 1 ? 1 : 0), minuses + (vote === -1 ? 1 : 0));
        if (shouldCreateOtherCounters && plusesElem && minusesElem) {
            plusesElem.textContent = (pluses + (vote === 1 ? 1 : 0)).toString();
            minusesElem.textContent = (minuses + (vote === -1 ? 1 : 0)).toString();
        }
        if (summary)
            setTimeout(() => ratingElem.innerHTML = (rating + vote).toString(), 5);
    };
    plusBtn.addEventListener('click', () => onClick(1));
    minusBtn.addEventListener('click', () => onClick(-1));
}
function getCommentAuthorId(comment) {
    if (comment.hasAttribute("data-author-id")) {
        return parseInt(comment.getAttribute("data-author-id"));
    }
    if (comment.hasAttribute("data-meta")) {
        return parseInt(comment.getAttribute("data-meta").match(/(?:^|;)aid=(\d+)(?:;|$)/)[1]);
    }
    return null;
}
function getCommentMeta(comment, key) {
    if (comment.hasAttribute("data-meta")) {
        const matches = comment.getAttribute("data-meta").match(`(?:^|;)${key}=(.+?)(?:;|$)`);
        if (matches !== null && matches.length > 1)
            return matches[1];
    }
    return null;
}
async function processComment(commentElem) {
    const commentRatingBlock = commentElem.querySelector('.comment__rating');
    if (commentRatingBlock.childElementCount === 1)
        return;
    const vid = commentElem.getAttribute('data-id');
    const authorId = parseInt(commentElem.getAttribute('data-author-id'));
    const pluses = getRealRating(parseInt(commentRatingBlock.getAttribute('data-pluses')), vid, authorId);
    const minuses = getRealRating(parseInt(commentRatingBlock.getAttribute('data-minuses')), vid, authorId);
    const vote = parseInt(getCommentMeta(commentElem, 'v') || '0');
    let onVoteCallback = null;
    if (GM_config.get('ratingBarComments') && (pluses + minuses !== 0) && (pluses + minuses) >= GM_config.get('minRatesCountToShowRatingBar')) {
        const bar = addRatingBar(commentElem, (pluses) / (pluses + minuses));
        onVoteCallback = (pluses, minuses) => {
            updateRatingBar(bar, pluses, minuses);
        };
    }
    replaceRating(commentElem.querySelector('.comment__rating-count'), vote, pluses, minuses, true, onVoteCallback);
    if (GM_config.get('commentVideoDownloadButtons')) {
        processCommentVideos(commentElem);
    }
}
function processCommentRpm(comment) {
    const uid = getCommentAuthorId(comment);
    if (!uid)
        return;
    let url = comment.getAttribute('data-copy-url');
    if (!url)
        url = comment.querySelector(':scope > .comment__body > .comment__header a.comment__tool[data-role="link"]').href;
    const commentHeader = comment.querySelector(".comment__header");
    const elem = RPM.Nodes.createUserRatingNode(uid, url);
    commentHeader.insertBefore(elem, commentHeader.querySelector(".comment__right"));
}
function processCommentVideos(commentElem) {
    const videoElements = commentElem.querySelectorAll(":scope > .comment__body .comment-external-video");
    for (const videoElem of videoElements) {
        const content = videoElem.querySelector('.comment-external-video__content');
        if (!content)
            continue;
        const url = content.getAttribute('data-external-link');
        if (!url)
            continue;
        const linkElem = document.createElement("a");
        linkElem.classList.add("rpm-download-video-button");
        linkElem.href = url;
        linkElem.text = "Источник";
        linkElem.target = "_blank";
        videoElem.parentNode.insertBefore(linkElem, videoElem.nextSibling);
    }
}
async function processStories(stories) {
    for (const story of stories) {
        processStory(story);
    }
}
function processPostVideos(story) {
    function addButton(link, videoControls) {
        const a = document.createElement("a");
        a.classList.add("rpm-download-video-button");
        const name = link.split("/").pop(); // "https://example/com/some_cool_video.mp4" -> "some_cool_video.mp4"
        const extension = name.split(".").slice(1).join("."); // "some_cool_video.mp4" -> "mp4" (and "video.av1.mp4" -> "av1.mp4")
        if (extension) {
            a.setAttribute('download', '');
        }
        a.target = '_blank';
        a.href = link;
        a.textContent = extension || 'Источник';
        // add link to controls
        videoControls.parentElement.insertBefore(a, videoControls.nextSibling);
    }
    const possibleAttributes = [
        'data-webm', 'data-av1'
    ];
    const videos = story.querySelectorAll('.story-block_type_video');
    for (const videoElem of videos) {
        const player = videoElem.querySelector('.player');
        if (!player)
            continue;
        const type = player.getAttribute('data-type');
        if (type === 'video') {
            const url = player.getAttribute('data-source');
            addButton(url, videoElem);
        }
        else if (type === 'video-file') {
            const dataSource = player.getAttribute('data-source');
            if (dataSource) {
                addButton(dataSource + '.mp4', videoElem);
            }
            for (const attr of possibleAttributes) {
                if (player.hasAttribute(attr) && player.getAttribute(attr)) {
                    addButton(player.getAttribute(attr), videoElem);
                }
            }
        }
    }
}
let csrfToken = null;
async function requestCsrfToken() {
    if (csrfToken !== null)
        return csrfToken;
    const appConfig = JSON.parse(document.querySelector(".app__config").textContent);
    csrfToken = appConfig.csrfToken;
    return csrfToken;
}
const newNotes = new Map();
function handleMiniProfile(element) {
    if (element.hasAttribute("rpm-affected"))
        return;
    element.setAttribute("rpm-affected", "");
    const userId = parseInt(element.getAttribute("data-user-id"));
    const userName = element.querySelector(".pkb-profile-username h2").textContent;
    if (GM_config.get('miniProfileOrientation') === SettingEnums.MiniProfileFeaturesOrientation.HORIZONTAL) {
        element.classList.add('rpm-mini-profile-horizontal');
    }
    function updateNoteElement() {
        let note = newNotes.get(userId);
        let noteHtml;
        const pkbNoteElem = element.querySelector(".mini-profile__note");
        if (pkbNoteElem) {
            if (note === undefined || note === null) {
                note = pkbNoteElem.textContent;
                noteHtml = pkbNoteElem.innerHTML;
                for (const link of pkbNoteElem.querySelectorAll("a")) {
                    note = note.replace(link.textContent, link.href);
                }
            }
            pkbNoteElem.remove();
        }
        const noteElem = document.createElement("div");
        noteElem.classList.add("input__box", "mini-profile__note");
        const textareaElem = document.createElement("textarea");
        textareaElem.classList.add("input__input", "profile-note__textarea", "rpm-mini-profile-note");
        textareaElem.setAttribute("rows", "1");
        textareaElem.setAttribute("placeholder", "Заметка об этом пользователе будет видна только вам. Нажмите, чтобы ввести текст.");
        textareaElem.value = note ?? "";
        const noteDisplayElem = document.createElement("cite");
        noteDisplayElem.classList.add("rpm-mini-profile-note-display");
        noteDisplayElem.innerHTML =
            noteHtml ??
                note ??
                "Заметка об этом пользователе будет видна только вам. Нажмите, чтобы ввести текст.";
        noteElem.append(textareaElem, noteDisplayElem);
        const mainElem = element.querySelector(".mini-profile__main");
        mainElem.append(noteElem);
        const rpmPoweredElem = RPM.Nodes.createPoweredNote("Улучшено с помощью Return Pikabu minus");
        mainElem.append(rpmPoweredElem);
        function setTextareaActive(active) {
            if (active) {
                textareaElem.style.display = "";
                noteDisplayElem.style.display = "none";
            }
            else {
                textareaElem.style.display = "none";
                noteDisplayElem.style.display = "";
            }
        }
        setTextareaActive(note === "");
        let saved = true;
        async function save() {
            saved = true;
            newNotes.set(userId, note);
            const action = note !== "" ? "note+" : "note-";
            await fetch("/ajax/users_actions.php", {
                method: "POST",
                headers: {
                    "X-Csrf-Token": await requestCsrfToken(),
                    Accept: "application/json, text/javascript, */*; q=0.01",
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Priority: "u=0",
                },
                body: `id=${userId}&action=${encodeURIComponent(action)}&message=${encodeURIComponent(note)}`,
            });
            sendNotification("Успешно", "Заметка сохранена");
        }
        let timeout = null;
        textareaElem.addEventListener("input", () => {
            saved = false;
            note = textareaElem.value;
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(save, 1500);
        });
        const onUnfocus = () => {
            setTextareaActive(false);
            noteDisplayElem.textContent = textareaElem.value;
            if (timeout !== null && !saved) {
                clearTimeout(timeout);
                timeout = null;
                save();
            }
        };
        textareaElem.addEventListener("blur", onUnfocus);
        textareaElem.addEventListener("focusout", onUnfocus);
        noteDisplayElem.addEventListener("click", () => {
            setTextareaActive(true);
            textareaElem.focus();
        });
    }
    function gollumIntegration() {
        const main = document.createElement("div");
        main.classList.add("rpm-gollum-stats");
        let worked = false;
        if (GM_config.get("miniProfileStoryTags")) {
            const storyTagsElem = Gollum.createTagsContainer(userName, "Теги постов", Gollum.storyTagsGetter, GM_config.get("miniProfileAutoloadTags"));
            main.append(storyTagsElem);
            worked = true;
        }
        if (GM_config.get("miniProfileСommentTags")) {
            const commentsTagsElem = Gollum.createTagsContainer(userName, "Теги комментариев", Gollum.commentTagsGetter, GM_config.get("miniProfileAutoloadTags"));
            main.append(commentsTagsElem);
            worked = true;
        }
        if (GM_config.get("miniProfileСomments")) {
            const lastComments = Gollum.createLastCommentsSection(userName, GM_config.get("miniProfileAutoloadComments"), GM_config.get("miniProfileAutoloadPikabuCommentCount"), true);
            main.append(lastComments);
            worked = true;
        }
        if (worked) {
            const poweredElem = RPM.Nodes.createPoweredNote(`Данные получены с <a href="https://gollum.space/user/${userName.replace(".", "_")}-summary" target="_blank">gollum.space</a>`);
            main.append(poweredElem);
        }
        element.append(main);
    }
    if (GM_config.get("miniProfileEditableNote")) {
        updateNoteElement();
    }
    gollumIntegration();
}
function mutationsListener(mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement))
                    continue;
                if (node.hasAttribute("rpm-observer-ignore"))
                    continue;
                if (node.matches(".comment__header")) {
                    const commentElem = node.closest(".comment");
                    info("Поймал голову комментария!", commentElem);
                    processComment(commentElem);
                    // RPM
                    if (GM_config.get("rpmComments")) {
                        processCommentRpm(commentElem);
                    }
                }
                else if (node.matches("article.story")) {
                    const storyElem = node;
                    info("Поймал пост!", storyElem);
                    processStory(storyElem);
                }
                else if (node.matches(".comment__more:not(.rpm-unroll-all)")) {
                    commentMoreBtn();
                }
                else if (node.matches(".overlay")) {
                    info("Поймал .overlay!");
                    waitForElement(".theme-picker__popup, .mini-profile", 500, node).then((e) => {
                        if (e.matches(".mini-profile")) {
                            info("Поймал мини-профиль!", e);
                            handleMiniProfile(e);
                        }
                    }, () => { });
                }
                else if (node.matches(".mini-profile")) {
                    handleMiniProfile(node);
                }
            }
        }
    }
}
var observer = null;
function addSettingsOpenButton() {
    let block = 
    // mobile version
    document.querySelector(".footer__links .accordion") ??
        // else PC version
        document.querySelector(".sidebar .sidebar__inner");
    if (block === null) {
        error("Не удалось найти место для создания кнопки открытия настроек.");
        return;
    }
    const button = document.createElement("button");
    button.innerText = "Открыть настройки Return Pikabu minus";
    button.classList.add("rpm-open-settings-button");
    button.addEventListener("click", () => {
        button.disabled = true;
        GM_config.open();
        button.disabled = false;
    });
    block.appendChild(button);
}
var FeedbackManager;
(function (FeedbackManager) {
    async function init() {
        const settings = await getSettings();
        const isToday = settings.lastCheckDate.toDateString() === new Date().toDateString();
        if (!isToday) {
            const feedbacks = await RPM.Service.getFeedbacks();
            feedbacks.forEach((feedback) => {
                if (settings.completed.includes(feedback.id))
                    return;
                if (settings.saved.find(([, fb]) => fb.id == feedback.id) !== undefined)
                    return;
                settings.saved.push([new Date(), feedback]);
                showFeedback(feedback);
            });
            settings.lastCheckDate = new Date();
            await updateSettings(settings);
        }
        else {
            showSavedFeedback();
        }
    }
    FeedbackManager.init = init;
    async function showSavedFeedback() {
        const settings = await getSettings();
        const now = new Date();
        const saved = settings.saved
            .filter(([date]) => date <= now)
            .map(([, fb]) => fb);
        if (saved.length === 0)
            return;
        for (const fb of saved) {
            await showFeedback(fb);
        }
    }
    async function getSettings() {
        const settings = JSON.parse(await GM.getValue("rpm-feedback", JSON.stringify({
            lastCheckDate: (() => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                return date;
            })(),
            completed: [],
            saved: [],
        })));
        settings.lastCheckDate = new Date(settings.lastCheckDate);
        for (const entry of settings.saved) {
            entry[0] = new Date(entry[0]);
        }
        return settings;
    }
    function updateSettings(settings) {
        settings.saved = settings.saved.filter((fb) => !settings.completed.includes(fb[1].id));
        return GM.setValue("rpm-feedback", JSON.stringify(settings));
    }
    async function markCompleted(feedbackId) {
        const settings = await getSettings();
        settings.completed.push(feedbackId);
        await updateSettings(settings);
    }
    let isFeedbackActive = false;
    function showFeedback(feedback) {
        if (isFeedbackActive)
            return Promise.resolve();
        isFeedbackActive = true;
        const deffered = new Deferred();
        const feedbackElem = document.createElement("div");
        feedbackElem.classList.add("rpm-feedback-window");
        const iframe = document.createElement("iframe");
        iframe.src = feedback.iframe_url;
        const completedButton = document.createElement("button");
        completedButton.classList.add("rpm-completed");
        completedButton.textContent = "Закрыть";
        completedButton.addEventListener("click", () => {
            feedbackElem.remove();
            markCompleted(feedback.id);
            deffered.resolve();
        });
        feedbackElem.append(iframe, completedButton);
        document.body.append(feedbackElem);
        return deffered.promise;
    }
})(FeedbackManager || (FeedbackManager = {}));
async function processTabs() {
    const tabConfig = {
        hot: "hotTab",
        best: "bestTab",
        new: "newTab",
        my_lent: "subsTab",
        communities: "communitiesTab",
        companies: "blogsTab",
        experts: "expertsTab",
    };
    await waitForElement(".header-menu__item, .pkb-tab-list");
    Object.entries(tabConfig).forEach(([key, field]) => {
        const selector = `.header-menu__item[data-feed-key="${key}"], .pkb-tab[data-feed-key="${key}"]`;
        if (!GM_config.get(field)) {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
            }
        }
    });
}
function init() {
    addCss(STYLES);
    observer = new MutationObserver(mutationsListener);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    window.addEventListener("load", onLoad);
    waitConfig().then(onConfig);
    if (window.location.pathname.startsWith("/@")) {
        onUserProfilePage();
    }
}
async function onConfig() {
    processTabs();
    if (GM_config.get("uuid")) {
        delete GM_config.fields["registerRpm"];
    }
}
function unrollComments(button) {
    button.click();
    setTimeout(() => {
        if (document.body.contains(button)) {
            unrollComments(button);
        }
    }, 500);
}
function commentMoreBtn() {
    const value = GM_config.get("unrollCommentaries");
    if (value === SettingEnums.UnrollComments.NONE)
        return;
    const moreButton = document.querySelector(".comment__more");
    if (!moreButton)
        return;
    if (value === SettingEnums.UnrollComments.UNROLL_ALL_BUTTON) {
        const btn = document.createElement("button");
        btn.textContent = "Раскрыть все комментарии";
        btn.classList.add("rpm-unroll-all");
        btn.addEventListener("click", () => {
            btn.remove();
            unrollComments(moreButton);
        });
        moreButton.parentElement.append(btn);
    }
    else if (value === SettingEnums.UnrollComments.AUTO_UNROLL) {
        unrollComments(moreButton);
    }
}
const DISCLAIMER = `
Пользуясь данным скриптом и его функциями, вы соглашаетесь с <a href="https://rpm.pyxiion.ru/terms">пользовательским соглашением и политикой конфиденциальности</a>.
Данное сообщение появится всего три раза.
`.trim();
function usageDisclaimer() {
    let count = parseInt(localStorage.getItem("rpm-disclaimer") ?? '3');
    if (count-- > 0) {
        sendNotification('Условия пользования', DISCLAIMER, 10000, true);
    }
    localStorage.setItem('rpm-disclaimer', count.toString());
}
async function onLoad() {
    usageDisclaimer();
    processStories(document.querySelectorAll("article.story"));
    if (GM_config.get("rpmComments")) {
        document.querySelectorAll(".comment").forEach(processCommentRpm);
    }
    if (!supportMenuCommands)
        addSettingsOpenButton();
    for (const comment of document.querySelectorAll('.comment')) {
        processComment(comment);
    }
}
async function onUserProfilePage() {
    const userName = document.querySelector(".page-profile .profile__nick").textContent;
    const feedPanel = document.querySelector(".feed-panel, .user-filters");
    let lastSection = null;
    await waitConfig();
    if (GM_config.get("profileStoryTags")) {
        const section = document.createElement("section");
        section.append(Gollum.createTagsContainer(userName, "Теги постов", Gollum.storyTagsGetter, true));
        feedPanel.parentElement.insertBefore(section, feedPanel);
        lastSection = section;
    }
    if (GM_config.get("profileСommentTags")) {
        const section = document.createElement("section");
        section.append(Gollum.createTagsContainer(userName, "Теги комментариев", Gollum.commentTagsGetter, true));
        feedPanel.parentElement.insertBefore(section, feedPanel);
        lastSection = section;
    }
    if (GM_config.get("profileСomments")) {
        const section = document.createElement("section");
        section.append(Gollum.createLastCommentsSection(userName, GM_config.get("profileAutoloadComments"), GM_config.get("profileAutoloadPikabuCommentCount")));
        feedPanel.parentElement.insertBefore(section, feedPanel);
        lastSection = section;
    }
    // Powered
    if (lastSection !== null) {
        const poweredElem = RPM.Nodes.createPoweredNote(`Данные получены с <a href="https://gollum.space/user/${userName.replace(".", "_")}-summary" target="_blank">gollum.space</a>`);
        const rpmPoweredElem = RPM.Nodes.createPoweredNote("Работает с помощью Return Pikabu minus");
        lastSection.append(poweredElem, rpmPoweredElem);
    }
}
init();
