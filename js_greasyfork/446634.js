// ==UserScript==
// @name         Camamba Users Search Library
// @namespace    hoehleg.userscripts.private
// @version      0.0.9
// @description  fetches Users
// @author       Gerrit Höhle
// @license MIT
//
// @require      https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js?version=1063408
//  
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// ==/UserScript==

// https://greasyfork.org/scripts/446634-camamba-users-search-library/

/* jslint esversion: 11 */

const cus_cache = (() => {

    /**
     * @param {{ uid: number, name: string }} keyAsObject 
     * @returns {string?}
     */
    const objectToKey = (keyAsObject) => {
        if (!keyAsObject?.uid && !keyAsObject?.name) {
            return null;
        }
        return `cus${keyAsObject.uid || ""}'${keyAsObject.name || ""}`;
    };

    /**
     * @param {string} key 
     * @returns {{ uid: number, name: string }}
     */
    const keyToObject = (keyAsString) => {
        const keyAsArray = keyAsString.slice(3).split("'");
        return {
            uid: Number.parseInt(keyAsArray[0]) || 0,
            name: keyAsArray[1] || "",
        };
    };

    /** @type {object.<{ uid: number, name: string }>} */
    const cache = {};
    /** @type {object.<{ uid: number, name: string }>} */
    const keysByName = {};
    /** @type {object.<{ uid: number, name: string }>} */
    const keysByUid = {};

    const addToCache = ({ uid, name, content }) => {
        const key = { uid, name };

        if (uid) {
            const storedByUid = keysByUid[uid];

            if (name) {
                if (storedByUid && storedByUid.name !== name) {

                    if (keysByName.hasOwnProperty(storedByUid.name)) {
                        delete keysByName[storedByUid.name];
                    }

                    GM.deleteKey(objectToKey(storedByUid));
                }
                keysByName[name] = key;
            }

            keysByUid[uid] = key;
        }
        if (name) {
            keysByName[name] = key;
        }
        cache[objectToKey(key)] = content || null;
    };

    (async () => {
        for (const keyAsString of (await GM.listValues()).filter(key => key.startsWith("cus"))) {
            addToCache(keyToObject(keyAsString));
        }
    })();

    return {

        /**
         * @param {{ uid: number?, name?: string, guessLog: GuessLog?, userLevel: UserLevel?}} param0 
         */
        store: async ({ uid, name, guessLog, userLevel }) => {
            if (!name && !uid || !guessLog && !userLevel) {
                return;
            }

            const content = {};
            if (userLevel?.level) {
                content.lvl = userLevel.level;
            }
            if (userLevel?.timeStamp) {
                content.lvlTS = userLevel.timeStamp;
            }
            if (guessLog?.ipList?.length) {
                content.ips = guessLog.ipList;
            }
            if (guessLog?.prints?.length) {
                content.prints = guessLog.prints;
            }
            if (guessLog?.scorePassword) {
                content.scrPW = guessLog.scorePassword;
            }
            if (guessLog?.scoreFinal) {
                content.scrFinal = guessLog.scoreFinal;
            }
            if (guessLog?.timeStamp) {
                content.scrTS = guessLog.timeStamp;
            }

            const key = objectToKey({ name, uid });
            await GM.setValue(key, JSON.stringify(content));
            addToCache({ name, uid, content });
        },

        /**
         * @param {{ uid: number, name: string }} param0
         * @return {Promise<{ guessLog : GuessLog, userLevel: UserLevel }}> 
         */
        read: async ({ uid = 0, name = "" }) => {
            let keyAsObject = null;
            if (uid && keysByUid[uid]) {
                keyAsObject = keysByUid[uid];
            } else if (name && keysByName[name]) {
                keyAsObject = keysByName[name];
            }
            const key = objectToKey(keyAsObject);
            if (!key) {
                return {};
            }

            let data = {};
            if (!cache[key]) {
                cache[key] = JSON.parse(await GM.getValue(key, "{}"));
            }
            data = cache[key];

            const guessLog = new GuessLog({
                userName: keyAsObject?.name || name,
                ipList: data.ips || [],
                prints: data.prints || [],
                scorePassword: data.scrPW || 0,
                scoreFinal: data.scrFinal || 0,
                timeStamp: data.scrTS || 0,
            });

            const userLevel = new UserLevel({
                name: keyAsObject?.name || name,
                uid: keyAsObject?.uid || uid,
                level: data.lvl || 0,
                timeStamp: data.lvlTS || 0,
            });

            return { guessLog, userLevel };
        },
    };
})();

class GuessLog {
    /** @param {{ userName: string, ipList: string[], prints: string[], scorePassword: number, scoreFinal: number, timeStamp: number }} param0 */
    constructor({ userName, ipList, prints, scorePassword, scoreFinal, timeStamp }) {
        /** @type {string} */
        this.userName = userName;
        /** @type {string[]} */
        this.ipList = ipList;
        /** @type {string[]} */
        this.prints = prints;
        /** @type {number} */
        this.scorePassword = scorePassword;
        /** @type {number} */
        this.scoreFinal = scoreFinal;
        /** @type {number} */
        this.timeStamp = timeStamp;
    }
}

/**
 * @typedef {object} UserParams
 * @property {string} name
 * @property {uid} [number]
 * @property {'male'|'female'|'couple'?} [gender]
 * @property {number} [age]
 * @property {number} [level]
 * @property {number} [longitude]
 * @property {number} [latitude]
 * @property {string} [location]
 * @property {number} [distanceKM]
 * @property {boolean} [isReal]
 * @property {boolean} [hasPremium]
 * @property {boolean} [hasSuper]
 * @property {boolean} [isPerma]
 * @property {boolean} [isOnline]
 * @property {string} [room]
 * @property {Date} [lastSeen]
 * @property {Date} [regDate]
 * @property {string[]} [ipList]
 * @property {Date} [scorePassword]
 * @property {Date} [scoreFinal]
 * @property {(date: Date) => string} [dateToHumanReadable]
 */

class GuessLogSearch extends HttpRequestHtml {

    constructor(name) {
        /**
         * @param {string} labelText 
         * @param {string} textContent 
         * @returns {number}
         */
        const matchScore = (labelText, textContent) => {
            const regexLookBehind = new RegExp("(?<=" + labelText + ":\\s)");
            const regexFloat = /\d{1,2}\.?\d{0,20}/;
            const regexLookAhead = /(?=\spoints)/;

            for (const regexesToJoin of [
                [regexLookBehind, regexFloat, regexLookAhead],
                [regexLookBehind, regexFloat]
            ]) {
                const regexAsString = regexesToJoin.map(re => re.source).join("");
                const matcher = new RegExp(regexAsString, "i").exec(textContent);
                if (matcher != null) {
                    return Number.parseFloat(matcher[0]);
                }
            }
        };

        /**
        * @param {RegExp} regex 
        * @param {string} textContent 
        * @returns {Array<String>}
        */
        const matchList = (regex, textContent) => {
            const results = [...textContent.matchAll(regex)].reduce((a, b) => [...a, ...b], []);
            if (results.length) {
                const resultsDistinct = [...new Set(results)];
                return resultsDistinct;
            }
        };

        super({
            url: 'https://www.camamba.com/guesslog.php',
            params: { name },

            /**
             * @param {{ html: Document}} resp 
             * @returns {GuessLog}
             */
            resultTransformer: (resp) => {
                const textContent = resp.html.body.textContent;

                const ipList = matchList(/(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])/g, textContent);
                const prints = matchList(/(?<=Print\d{0,2}\schecked\sis\s)[0-9a-f]+/g, textContent);

                const scorePassword = matchScore("password check", textContent);
                const scoreFinal = matchScore("final score", textContent);

                return { userName: name, ipList, prints, scorePassword, scoreFinal, timeStamp: new Date().getTime() };
            }
        });
    }

    /** @returns {Promise<GuessLog>} */
    async send() {
        const maxHoursInCache = 6;

        const name = this.params.name;
        const cache = await cus_cache.read({ name });

        let result = cache?.guessLog;
        const timeStamp = result?.timeStamp;

        if (!timeStamp || new Date().getTime() - timeStamp >= maxHoursInCache * 60 * 60 * 1000) {
            result = await super.send();
            cus_cache.store({ ...(cache || {}), name, guessLog: result });
        }

        return result;
    }

    /**
     * @param {string} name 
     * @returns {Promise<GuessLog>}
     */
    static async send(name) {
        return await new GuessLogSearch(name).send();
    }
}

/**
 * @typedef {Object} BanLog
 * @property {string} moderator - user or moderator who triggered the log
 * @property {string} user - user who is subject
 * @property {Date} date - date of this log
 * @property {string} reason - content
 */

class BannLogSearch extends HttpRequestHtml {
    /**
     * @param {number} uid 
     */
    constructor(uid = null) {
        super({
            url: 'https://www.camamba.com/banlog.php',
            params: uid ? { admin: uid } : {},
            resultTransformer: (response, _request) => {
                const results = [];
                const xPathExpr = "//tr" + ['User', 'Moderator', 'Date', 'Reason'].map(hdrText => `[td[span[text()='${hdrText}']]]`).join("");
                let tr = (response.html.evaluate(xPathExpr, response.html.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || {}).nextElementSibling;

                while (tr) {
                    const tds = tr.querySelectorAll('td');
                    const user = tds[0].querySelector("a") || tds[0].textContent;
                    const moderator = tds[1].textContent;

                    let date;
                    const dateMatch = /(\d{2}).(\d{2}).(\d{4})<br>(\d{1,2}):(\d{2}):(\d{2})/.exec(tds[2].innerHTML);
                    if (dateMatch) {
                        const day = dateMatch[1];
                        const month = dateMatch[2];
                        const year = dateMatch[3];
                        const hour = dateMatch[4];
                        const minute = dateMatch[5];
                        const second = dateMatch[6];
                        date = new Date(year, month - 1, day, hour, minute, second);
                    }

                    const reason = tds[3].textContent;
                    results.push({ user, moderator, date, reason });

                    tr = tr.nextElementSibling;
                }

                return results;
            }
        });
    }

    /**
     * @param {number} uid
     * @returns {Promise<BanLog[]>}
     */
    static async send(uid) {
        return await new BannLogSearch(uid).send();
    }
}

class GalleryImage {
    constructor({ dataURI, href }) {
        /** @type {string} */
        this.dataURI = dataURI;
        /** @type {string} */
        this.href = href;
    }
}


class UserLevel {
    /** @param {{ level: number, uid: number, name: string, timeStamp: number }} param0 */
    constructor({ level, uid = null, name = null, timeStamp = null }) {
        /** @type {number} */
        this.level = level !== null ? Number.parseInt(level) : null;
        /** @type {number} */
        this.uid = uid !== null ? Number.parseInt(uid) : null;
        /** @type {string} */
        this.name = name;
        /** @type {number} */
        this.timeStamp = timeStamp !== null ? Number.parseInt(timeStamp) : null;
    }
}

class UserLevelSearch extends HttpRequestHtml {
    constructor(uid) {
        super({
            url: 'https://www.camamba.com/user_level.php',
            params: { uid },

            /**
             * @param {{ html: Document }} response 
             * @param {{ params: { uid: number }}} request 
             * @returns {UserLevel} 
             */
            resultTransformer: (response, request) => {
                const html = response.html;

                let name = null, level = null;

                const nameElement = html.querySelector('b');
                if (nameElement) {
                    name = nameElement.textContent;
                }

                const levelElement = html.querySelector('font.xxltext');
                if (levelElement) {
                    const levelMatch = /\d{1,3}/.exec(levelElement.textContent);
                    if (levelMatch) {
                        level = Number.parseInt(levelMatch);
                    }
                }

                return new UserLevel({ uid: request.params.uid, name, level, timeStamp: new Date().getTime() });
            }
        });
    }

    /**
     * @returns {Promise<UserLevel>}
     */
    async send() {
        const maxHoursInCache = 24;

        const uid = this.params.uid;
        const cache = await cus_cache.read({ uid });

        let result = cache?.userLevel;
        const timeStamp = result?.timeStamp;

        if (!timeStamp || new Date().getTime() - timeStamp >= maxHoursInCache * 60 * 60 * 1000) {
            result = await super.send();
            cus_cache.store({ ...(cache || {}), uid, userLevel: result });
        }

        return result;
    }

    /**
     * @param {number} uid 
     * @returns {Promise<UserLevel>}
     */
    static async send(uid) {
        return await new UserLevelSearch(uid).send();
    }
}

class User {
    /** @param {UserParams} param0 */
    constructor({
        name, uid = 0, gender = null, age = null,
        longitude = null, latitude = null, location = null, distanceKM = null,
        isReal = null, hasPremium = null, hasSuper = null, isPerma = null,
        isOnline = null, room = null, lastSeen = null, regDate = null,
        dateToHumanReadable = (date) => date ?
            date.toLocaleString('de-DE', { timeStyle: "medium", dateStyle: "short", timeZone: 'CET' }) : '',
    }) {
        /** @type {string} */
        this.name = String(name);
        /** @type {number?} */
        this.uid = uid;
        /** @type {'male'|'female'|'couple'?} */
        this.gender = gender;
        /** @type {number?} */
        this.age = age;

        /** @type {number?} */
        this.longitude = longitude;
        /** @type {number?} */
        this.latitude = latitude;
        /** @type {string?} */
        this.location = location;
        /** @type {number?} */
        this.distanceKM = distanceKM;

        /** @type {boolean?} */
        this.isReal = isReal;
        /** @type {boolean?} */
        this.hasPremium = hasPremium;
        /** @type {boolean?} */
        this.hasSuper = hasSuper;
        /** @type {boolean?} */
        this.isPerma = isPerma;

        /** @type {boolean?} */
        this.isOnline = isOnline;
        /** @type {string?} */
        this.room = room;
        /** @type {Date?} */
        this.lastSeen = lastSeen;
        /** @type {Date?} */
        this.regDate = regDate;

        /** @type {string[]} */
        this.prints = [];
        /** @type {string[]} */
        this.ipList = [];
        /** @type {number?} */
        this.scorePassword = null;
        /** @type {number?} */
        this.scoreFinal = null;
        /** @type {number} */
        this.guessLogTS = null;

        /** @type {(date: Date) => string} */
        this.dateToHumanReadable = dateToHumanReadable;

        /** @type {number?} */
        this.level = null;
        /** @type {number} */
        this.levelTS = null;

        /** @type {string[]} */
        this.galleryData = [];
        /** @type {number} */
        this.galleryDataTS = null;
    }

    /** @type {string} @readonly */
    get lastSeenHumanReadable() {
        return this.dateToHumanReadable(this.lastSeen);
    }

    /** @type {string} @readonly */
    get regDateHumanReadable() {
        return this.dateToHumanReadable(this.regDate);
    }

    get galleryAsImgElements() {
        if (!this.galleryData) {
            return [];
        }

        return this.galleryData.map(data => Object.assign(document.createElement('img'), {
            src: data.dataURI
        }));
    }

    async updateGalleryHref() {
        const pictureLinks = (await HttpRequestHtml.send({
            url: "https://www.camamba.com/profile_view.php",
            params: Object.assign(
                { m: 'gallery' },
                this.uid ? { uid: this.uid } : { user: this.name }
            ),

            pageNr: 0,
            pagesMaxCount: 500,

            resultTransformer: (response) => {
                const hrefList = [...response.html.querySelectorAll("img.picborder")].map(img => img.src);
                return hrefList.map(href => href.slice(0, 0 - ".s.jpg".length) + ".l.jpg");
            },
            hasNextPage: (_resp, _httpRequestHtml, lastResult) => {
                return lastResult.length >= 15;
            },
            paramsConfiguratorForPageNr: (params, pageNr) => ({ ...params, page: pageNr }),
        })).flat();

        this.galleryData = pictureLinks.map(href => ({ href }));
        this.galleryDataTS = new Date().getTime();
    }

    async updateGalleryData(includeUpdateOfHref = true) {
        if (includeUpdateOfHref) {
            await this.updateGalleryHref();
        }

        const readGalleryData = this.galleryData.map(({ href }) => (async () => {
            const dataURI = await HttpRequestBlob.send({ url: href });
            return new GalleryImage({ dataURI, href });
        })());

        this.galleryData = await Promise.all(readGalleryData);
        this.galleryDataTS = new Date().getTime();
    }

    async updateLevel() {
        const { level, timeStamp, name } = await UserLevelSearch.send(this.uid);
        this.level = level;
        this.levelTS = timeStamp;
        this.name = name;
    }

    async updateGuessLog() {
        /** @type {GuessLog} */
        const guessLog = await GuessLogSearch.send(this.name);
        this.guessLogTS = new Date().getTime();

        this.ipList = guessLog.ipList;
        this.prints = guessLog.prints;
        this.scorePassword = guessLog.scorePassword;
        this.scoreFinal = guessLog.scoreFinal;
    }

    async addNote(text) {
        if (!this.uid) {
            return await Promise.reject({
                status: 500,
                statusText: "missing uid"
            });
        }

        return await new Promise((res, rej) => GM_xmlhttpRequest({
            url: 'https://www.camamba.com/profile_view.php',
            method: 'POST',
            data: `uid=${this.uid}&modnote=${encodeURIComponent(text)}&m=admin&nomen=1`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: (xhr) => {
                res(xhr.responseText);
            },
            onerror: (xhr) => rej({
                status: xhr.status,
                statusText: xhr.statusText
            }),
        }));
    }
}

class UserSearch extends HttpRequestHtml {
    /** @param {{ 
     * name: string?, 
     * uid: number?,
     * gender: ('any' | 'male' | 'female' |'couple')?, 
     * isOnline: boolean?, hasReal: boolean?, hasPremium: boolean?, hasSuper: boolean?, hasPicture: boolean?,
     * isSortByRegDate: boolean?,
     * isSortByDistance: boolean?,
     * isShowAll: boolean?,
     * pageNr: number?,
     * pagesMaxCount: number?,
     * keepInCacheTimoutMs: number?
     * }} param0 */
    constructor({
        name = null,
        uid = 0,
        gender = 'any',
        isOnline = null,
        hasReal = null,
        hasPremium = null,
        hasSuper = null,
        hasPicture = null,
        isSortByRegDate = null,
        isSortByDistance = null,
        isShowAll = null,
        pageNr = 1,
        pagesMaxCount = 1,
        keepInCacheTimoutMs
    } = {}) {
        let params = Object.assign(
            (name ? {
                nick: name
            } : {}),
            {
                gender: gender.toLowerCase(),
            },
            Object.fromEntries(Object.entries({
                online: isOnline,
                isreal: hasReal,
                isprem: hasPremium,
                issuper: hasSuper,
                picture: hasPicture,
                sortreg: isSortByRegDate,
                byDistance: isSortByDistance,
                showall: isShowAll,
            })
                .filter(([_k, v]) => typeof v !== 'undefined' && v !== null)
                .map(([k, v]) => ([[k], v ? 1 : 0])))
        );

        params = Object.entries(params).map(([key, value]) => key + '=' + value).join('&');

        if (params.length) {
            params += "&";
        }
        params += `page=${Math.max(pageNr - 1, 0)}`;

        super({
            url: 'https://www.camamba.com/search.php',
            params,
            pageNr: Math.max(pageNr, 1),
            pagesMaxCount: Math.max(pagesMaxCount, 1),
            keepInCacheTimoutMs,

            resultTransformer: (response) => {
                /** @type {Array<User>} */
                const users = [];

                for (const trNode of response.html.querySelectorAll('.searchSuper tr, .searchNormal tr')) {
                    const innerHTML = trNode.innerHTML;

                    const nameMatch = /<a\s+?href=["']javascript:openProfile\(["'](.+?)["']\)/.exec(innerHTML);

                    if (!nameMatch) {
                        break;
                    }

                    const user = new User({
                        name: nameMatch[1],
                        isReal: /<img src="\/gfx\/real.png"/.test(innerHTML),
                        hasPremium: /<a href="\/premium.php">/.test(innerHTML),
                        hasSuper: /<img src="\/gfx\/super_premium.png"/.test(innerHTML),
                        isOnline: /Online\snow(\s\in|,\snot in chat)/.test(innerHTML),
                    });

                    const uidMatch = /<a\s+?href=["']javascript:sendMail\(["'](\d{1,8})["']\)/.exec(innerHTML) || /<img\ssrc="\/userpics\/(\d{1,8})/.exec(innerHTML);
                    if (uidMatch) {
                        user.uid = Number.parseInt(uidMatch[1]);
                    }

                    // Längengrad, Breitengrad, Ortsname
                    const locationMatch = /<a\s+?href="javascript:openMap\((-?\d{1,3}\.\d{8}),(-?\d{1,3}\.\d{8})\);">(.+?)<\/a>/.exec(innerHTML);
                    if (locationMatch) {
                        user.longitude = Number.parseFloat(locationMatch[1]);
                        user.latitude = Number.parseFloat(locationMatch[2]);
                        user.location = locationMatch[3];
                    }

                    // Entfernung in km
                    const distanceMatch = /(\d{1,5})\skm\sfrom\syou/.exec(innerHTML);
                    if (distanceMatch) {
                        user.distanceKM = parseInt(distanceMatch[1]);
                    }

                    // Geschlecht und Alter
                    const genderAgeMatch = /(male|female|couple),\s(\d{1,4})(?:<br>){2}Online/.exec(innerHTML);
                    if (genderAgeMatch) {
                        user.gender = genderAgeMatch[1];
                        user.age = genderAgeMatch[2];
                    }

                    // zuletzt Online
                    if (user.isOnline) {
                        user.lastSeen = new Date();
                    } else {
                        const lastSeenMatch = /(\d{1,4})\s(minutes|hours|days)\sago/.exec(innerHTML);
                        if (lastSeenMatch) {
                            const value = parseInt(lastSeenMatch[1]);

                            const factorToMillis = {
                                'minutes': 1000 * 60,
                                'hours': 1000 * 60 * 60,
                                'days': 1000 * 60 * 60 * 24,
                            }[lastSeenMatch[2]];

                            user.lastSeen = new Date(Date.now() - value * factorToMillis);
                        }
                    }

                    // Raumname
                    const roomMatch = /(?:ago|now)\sin\s([\w\s]+?|p\d{1,8})<br>/.exec(innerHTML);
                    if (roomMatch) {
                        user.room = roomMatch[1];
                    }

                    // regDate
                    const regDateMatch = /(\d{2}).(\d{2}).(\d{4})\s(\d{1,2}):(\d{2}):(\d{2})/.exec(innerHTML);
                    if (regDateMatch) {
                        const regDateDay = regDateMatch[1];
                        const regDateMonth = regDateMatch[2];
                        const regDateYear = regDateMatch[3];
                        const regDateHour = regDateMatch[4];
                        const regDateMinute = regDateMatch[5];
                        const regDateSecond = regDateMatch[6];
                        user.regDate = new Date(regDateYear, regDateMonth - 1, regDateDay, regDateHour, regDateMinute, regDateSecond);
                    }

                    users.push(user);
                }

                return users;
            },

            hasNextPage: (_resp, _httpRequestHtml, lastResult) => {
                return lastResult.length >= 50;
            },

            paramsConfiguratorForPageNr: (params, pageNr) => {
                return params.replace(/page=\d+(?:$)/, `page=${pageNr - 1}`);
            },
        });
        this.uid = uid || null;
    }

    /** @returns {Promise<User[]>} */
    async send() {
        if (this.uid) {
            const user = new User({ uid: this.uid });
            await user.updateLevel();

            if (!user.name || user.level) {
                return [];
            }
            if (this.params.nick) {
                const unameURIencoded = encodeURIComponent(user.name.toLowerCase());
                const unameFromSearchParam = encodeURIComponent(this.params.nick.toLowerCase()).trim();
                if (unameURIencoded.includes(unameFromSearchParam)) {
                    return [];
                }
            }

            this.params.nick = user.name;
            const result = (await super.send()).flat().find(u => u.uid == this.uid);
            if (!result) {
                return [];
            }

            return [Object.assign(user, result)];
        }

        return (await super.send()).flat();
    }

    /**
     * @param {{ 
     * name: string, 
     * uid: number?,
     * gender: 'any' | 'male' | 'female' |'couple', 
     * isOnline: boolean,hasReal: boolean, hasPremium: boolean, hasSuper: boolean, hasPicture: boolean,
     * isSortByRegDate: boolean,
     * isSortByDistance: boolean,
     * isShowAll: boolean,
     * pageNr: number,
     * pagesMaxCount: number,
     * keepInCacheTimoutMs: number
     * }} param0 
     * @returns {Promise<User[]>} 
     */
    static async send(param0) {
        return await new UserSearch(param0).send();
    }
}