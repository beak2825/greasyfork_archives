// ==UserScript==
// @name            Camamba Users Watch
// @name:de         Camamba Users Watch
// @namespace       dannysaurus.camamba
// @match           https://www.camamba.com/profile.php
// @match           https://www.de.camamba.com/profile_de.php
// @connect         camamba.com
// @version         0.0.0.1
// @license         MIT License
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.listValues
// @grant           GM.deleteValue
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
//
// @require     https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js?version=1058339
//
// @description     Fetching of infos about online users from the the "/search.php" page and others
// @description:de  Fetching of infos about online users from the the "/search.php" page ans others
// @downloadURL https://update.greasyfork.org/scripts/446104/Camamba%20Users%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/446104/Camamba%20Users%20Watch.meta.js
// ==/UserScript==

/* jslint esversion: 9 */
/* global msngr:readonly, controlWS:readonly, postToSite:readonly */
GM_addStyle('.row-header { background-color: hsl(0, 0%, 86%); }');
GM_addStyle('.row-female { background-color: LavenderBlush; }');
GM_addStyle('.row-male { background-color: AliceBlue; }');
GM_addStyle('.col-name,.col-score { font-weight: bold; }');

let knownPrints;
let knownUserInfo;

const UID_CAMAMBA_ANGEL = '470555';
const UID_DANNY_NOT_A_SAURUS = '1268162';
const UID_MASKE = '1279092';

const isLoggedInAsAdmin = () => msngr && !!msngr.admin;
const isLoggedInAs = (...usersOrUids) => {
    if (!msngr && !msngr.id) {
        return false;
    }
    const uidsToCheck = usersOrUids.map(userOrUID => userOrUID.uid ? userOrUID.uid : userOrUID);
    return uidsToCheck.some(uid => msngr.id == uid);
};

const onInit = (async () => {

    const onInitKnownPrints = (async () => {
        let values = JSON.parse(await GM.getValue('knownPrints', '{}'));


        // ensure knownPrints is an object, if formerly stored wrong
        if (!values || typeof values != 'object' || Array.isArray(values)) {
            values = {};
        }

        // delete obsolete storage
        (async () => {
            const keysToKeep = ['knownPrints', 'knownUserInfo'];

            const storedKeys = await GM.listValues();
            for (const key of storedKeys) {
                if (!keysToKeep.includes(key)) {
                    GM.deleteValue(key);
                }
            }
        })();

        // transform printInfo to an array, when stored as single object fom older script versions
        for (const [print, uInfo] of Object.entries(values)) {
            if (!Array.isArray(uInfo)) {
                values[print] = [uInfo];
            }
        }

        const store = async () => {
            await GM.setValue('knownPrints', JSON.stringify(values));
        };

        const get = (print) => {
            return values[print] || [];
        };

        const addToValues = ({ prints, name, uid }) => {
            if (!prints || !prints.length) {
                return false;
            }

            let hasChanged = false;

            for (const print of prints) {
                const printInfo = get(print);
                if (!printInfo.length || printInfo.every(uInfo => uInfo.name != name || uInfo.uid != uid)) {
                    values[print] = [...printInfo, { uid, name }];
                    hasChanged = true;
                }
            }
            return hasChanged;
        };

        const add = async ({ prints, name, uid }) => {
            const hasChanged = addToValues({ prints, name, uid });
            if (hasChanged) {
                await store();
            }
            return hasChanged;
        };

        /**
     * Adds a list of printInfos
     * @param {printInfos} [ { prints, name, uid } ]
     * @return true if store as been altered, false otherwise
     */
        const addAll = async (printInfos) => {
            let hasChanged = false;
            for (const printInfo of printInfos) {
                if (addToValues(printInfo)) {
                    hasChanged = true;
                }
            }

            if (hasChanged) {
                await store();
            }
            return hasChanged;
        };

        await addAll([
            {
                prints: [
                    '2da8451fa8562d454eff4ef4a64defa64fb2e03c',
                    '9f4318e6cd41c90d38059110f4ebfbc065b87d19'
                ], name: "soulkitchen", uid: 1286295
            },

            {
                prints: [
                    '17ec68594ebed6b5b3f0eb534cada0a1ef04376b',
                    '030f9abfec83cfe8bf6718edc15eea1946bd8716',
                    '3e6caf98f36f9e3b3c737b9f211b3016eb82015c',
                    '0b58198b549d8a4de738ecf3bf1f75ee04483f1f',
                    '4980893879b80fca4315698d0c802254c1617384',
                    'e9beb44d7908e855832cd9ad455903e45bfa3cdf',
                    '7e412f5629066f915ff0ba45cb3bf9f23d4bd6d6',
                    'a06fac0b95f491e31710440f8a250a4c03a43049',

                ], name: "sturmmaske", uid: UID_MASKE
            },

            {
                prints: [
                    '84fb2cf430b5bc2eebef751f36d767ec3d431b72',
                    '7a9264a00ed7c5ea575e82a236233bc9d2988cc9',
                    '59478af6de1a95e3dbd71a9ea94a1e451b822f65',
                ], name: "kleine juliane", uid: 1281947
            },

            {
                prints: [
                    '25630ba9ef8f35c340ca63ab0cefd5175216ee6d',
                    '71f43eded872c2568ff3755c94da86bfb8f90cc8',
                    '5bef6bd24df92cbec7bb0b762daa49400e02e8f0',
                ], name: "lotta", uid: 1286278
            },

            {
                prints: [
                    'c271010d1262e2c18f1a9ab84b5057a3ee2c3b33',
                    '4980893879b80fca4315698d0c802254c1617384',
                    '321b3968deee0d0529057b8d316ae7c0432adffc',
                ], name: "jimjimjim123", uid: 1286180
            },

            {
                prints: [
                    'c271010d1262e2c18f1a9ab84b5057a3ee2c3b33',
                    '4980893879b80fca4315698d0c802254c1617384',
                    '7489a9a1eddd1a5c750f65e2b2b7abf535c8d0e8',
                ], name: "bbjim51123456", uid: 1286180
            },
        ]);

        /*
         *         // Vermutungen
                   { prints: [
                       'f99e48803bc225d32a3211292ce24cc9f6a8c3e5',
                       '1cdeb1fc6071911d40509e56aac231f60c034fcc',
                       '2f46b3a95c2fd1fe8e7be7ca833b30bc8f8d9607',
                   ], name: "Andrej / EnoX69", uid: 1286454 },
         */

        knownPrints = { get, add, addAll };
    })();

    const onInitKnownUserInfo = (async () => {
        const values = JSON.parse(await GM.getValue('knownUserInfo', '{}'));

        const store = async () => {
            await GM.setValue('knownUserInfo', JSON.stringify(values));
        };

        const get = (uid) => {
            return values[uid] || {};
        };

        const addToValues = (uid, userInfo) => {
            values[uid] = userInfo;
        };

        const add = async (uid, userInfo) => {
            addToValues(userInfo);
            userInfo.ts = new Date().getTime();
            await store();
        };

        /**
     * Adds a list of userInfos
     * @param {userInfos} [ { uid, userInfo } ]
     * @return true if store as been altered, false otherwise
     */
        const addAll = async (userInfos) => {
            const ts = new Date().getTime();
            for (const uInfo of userInfos) {
                addToValues(uInfo.uid, uInfo.userInfo);
                uInfo.userInfo.ts = ts;
            }
            await store();
        };

        knownUserInfo = { get, add, addAll };
    })();

    await Promise.all([onInitKnownPrints, onInitKnownUserInfo]);
})();


const GuessLogSearch = (() => {
    const url = 'https://www.camamba.com/guesslog.php';

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

    const matchList = (regex, textContent) => {
        const results = [...textContent.matchAll(regex)].reduce((a, b) => [...a, ...b], []);
        if (results.length) {
            const resultsDistinct = [...new Set(results)];
            return resultsDistinct;
        }
    };

    const fetchGuessLogData = (params, html) => {
        const textContent = html.body.textContent;
        const name = params.name;

        const IPs = matchList(/(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])/g, textContent);
        const prints = matchList(/(?<=Print\d{0,2}\schecked\sis\s)[0-9a-f]+/g, textContent);

        const scorePassword = matchScore("password check", textContent);
        const scoreFinal = matchScore("final score", textContent);

        return { name, IPs, prints, scorePassword, scoreFinal };
    };

    return class GuessLogSearch extends HttpRequestHtml {

        constructor({ name = '', keepInCacheTimoutMs } = {}) {
            super({ url, params: { name: name }, keepInCacheTimoutMs });
        }

        /**
     * Sends this request.
     * @returns {Promise<Array<Response>>} Response Object { scorePassword }
     */
        async send() {
            const resp = await super.send();
            return fetchGuessLogData(this.params, resp.html);
        }

        static send(...searchParams) {
            return new GuessLogSearch(...searchParams).send();
        }
    };
})();


const dateTimeToHumanReadable = date => {
    if (!date) {
        return '';
    }
    return date.toLocaleString('de-DE', { timeStyle: "medium", dateStyle: "short", timeZone: 'CET' });
};

const CamambaUserSeach = (() => {
    const url = 'https://www.camamba.com/search.php';

    const createBooleanParamsObj = (paramsObj) => Object.entries(paramsObj)
        .map(([k, v]) => !!v ? { [k]: 1 } : {})
        .reduce((a, b) => ({ ...a, ...b }));

    const hasMaybeMoreResults = responseHtml => responseHtml.querySelectorAll('.searchNormal, .searchSuper').length >= 50;

    const fetchFromHtml = async responseHtml => {
        const users = [];
        const userInfoUpdated = {};

        for (const tdNode of responseHtml.querySelectorAll('.searchSuper td:nth-child(2), .searchNormal td:nth-child(2)')) {
            const innerHTML = tdNode.innerHTML;
            const uidMatch = /<a\s+?href=["']javascript:sendMail\(["'](\d{1,8})["']\)/.exec(innerHTML);
            const nameMatch = /<a\s+?href=["']javascript:openProfile\(["'](.+?)["']\)/.exec(innerHTML);
            if (!uidMatch || !nameMatch) {
                break;
            }

            const user = {
                uid: parseInt(uidMatch[1]),
                name: nameMatch[1],
                isReal: /<img src="\/gfx\/real.png"/.test(innerHTML),
                hasPremium: /<a href="\/premium.php">/.test(innerHTML),
                hasSuper: /<img src="\/gfx\/super_premium.png"/.test(innerHTML),
                isOnline: /Online\snow(\s\in|,\snot in chat)/.test(innerHTML),
            };

            const userInfo = knownUserInfo.get(user.uid);
            const daysSinceStored = Math.round((new Date().getTime() - userInfo.ts) / (1000 * 60 * 60 * 24));

            // Level
            if (userInfo.level) {
                user.level = userInfo.level;

                if (daysSinceStored > 2) {
                    userInfo.level = null;
                }
            }

            if (!userInfo.level) {
                userInfo.level = await HttpRequestHtml.send({
                    url: 'https://www.camamba.com/user_level.php', params: { uid: user.uid }
                }).then(resp => {
                    const levelElement = resp.html.querySelector('font.xxltext');
                    if (levelElement) {
                        const levelMatch = /\d{1,3}/.exec(levelElement.textContent);
                        if (levelMatch) {
                            return parseInt(levelMatch);
                        }
                    }
                    return 0;
                });
            }

            if (userInfo.level > (user.level || 0)) {
                user.level = userInfo.level;
                userInfoUpdated[user.uid] = userInfo;
            }

            // Längengrad, Breitengrad, Ortsname
            const locationMatch = /<a\s+?href="javascript:openMap\((-?\d{1,3}\.\d{8}),(-?\d{1,3}\.\d{8})\);">(.+?)<\/a>/.exec(innerHTML);
            if (locationMatch) {
                user.longitude = parseFloat(locationMatch[1]);
                user.latitude = parseFloat(locationMatch[2]);
                user.location = locationMatch[3];
            }

            // Entfernung in km
            const distanceMatch = /(\d{1,5})\skm\sfrom\syou/.exec(innerHTML);
            if (distanceMatch) {
                user.distanceKM = parseInt(distanceMatch[1]);
            }

            // Geschlecht und Alter
            const genderAgeMatch = /(male|female|couple),\s(\d{1,3})(?:<br>){2}Online/.exec(innerHTML);
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

            if (user.lastSeen) {
                user.lastSeenHumanReadable = dateTimeToHumanReadable(user.lastSeen);
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
                user.regDateHumanReadable = dateTimeToHumanReadable(user.regDate);
            }

            if (isLoggedInAsAdmin()) {
                user.guessLog = userInfo.guessLog;
                if (!user.guessLog || user.level <= 5 || daysSinceStored > 14) {
                    user.guessLog = await GuessLogSearch.send({ name: user.name });

                    if (user.guessLog.prints && user.guessLog.prints.length || user.guessLog.scoreFinal) {
                        userInfo.guessLog = { prints: user.guessLog.prints, scoreFinal: user.guessLog.scoreFinal };
                    } else {
                        userInfo.guessLog = {};
                    }
                    userInfoUpdated[user.uid] = userInfo;
                }
            } else {
                user.guessLog = {};
            }


            users.push(user);
        }

        const allPrints = users.filter(u => u.guessLog && u.guessLog.prints && u.guessLog.prints.length).map(u => ({
            prints: u.guessLog.prints,
            name: u.name,
            uid: u.uid
        }));

        if (allPrints.length) {
            await knownPrints.addAll(allPrints);
        }

        knownUserInfo.addAll(Object.entries(userInfoUpdated).map(([uid, userInfo]) => ({ uid, userInfo })));

        return users;
    };

    return class CamambaUserSeach extends HttpRequestHtml {

        /**
         * @typedef {Object} CamambaUserSearchParams
         * @property {string} name
         * @property {('any'|'male'|'female'|'couple')} gender
         * @property {boolean} isOnline
         * @property {boolean} hasReal
         * @property {boolean} hasPremium
         * @property {boolean} hasSuper
         * @property {boolean} hasPicture
         * @property {boolean} sortByRegDate
         * @property {boolean} sortByDistance
         * @property {boolean} showAll
         * @property {number} pageNr
         * @property {number} maxPageNr - Inclusive
         */

        /**
         * Creates a request for the Users-Search.
         * @param {CamambaUserSearchParams} param0
         */
        constructor({
            name = '',
            gender = 'any',
            isOnline, hasReal, hasPremium, hasSuper, hasPicture,
            sortByRegDate, sortByDistance,
            showAll,
            pageNr = 1,
            maxPageNr = 10,
            keepInCacheTimoutMs
        } = {}) {
            super({
                url,
                params: {
                    nick: name,
                    gender: String(gender).toLowerCase(),
                    ...createBooleanParamsObj({
                        online: isOnline,
                        picture: hasPicture,
                        isprem: hasPremium,
                        isreal: hasReal,
                        issuper: hasSuper,
                        byDistance: sortByDistance,
                        showall: showAll,
                        sortreg: sortByRegDate,
                    }),
                    page: Math.max(pageNr - 1, 0),
                },
                keepInCacheTimoutMs
            });

            this.maxPageNr = maxPageNr;
        }

        /**
         * Sends this request.
         * @returns {Promise<Array<Response>>} list of responses for each page
         */
        async send() {
            const firstResp = await super.send();
            let isMoreToFetch = hasMaybeMoreResults(firstResp.html);

            let fetches = Promise.resolve(fetchFromHtml(firstResp.html));

            for (let nextPage = this.params.page + 1; isMoreToFetch && nextPage < this.maxPageNr; nextPage++) {

                fetches = await (async () => {
                    const formerUsers = await fetches;

                    const nextResp = await HttpRequestHtml.send({
                        method: this.method,
                        url: this.url,
                        params: { ...this.params, page: nextPage },
                        keepInCacheTimoutMs: this.keepInCacheTimoutMs,

                    });

                    isMoreToFetch = hasMaybeMoreResults(nextResp.html);
                    return [...formerUsers, ... await fetchFromHtml(nextResp.html)];
                })();
            }
            return await fetches;
        }

        /**
         * @param  {CamambaUserSearchParams} searchParams
         * @returns {Promise<Array<Response>>} list of responses for each page
         */
        static send(...searchParams) {
            return new CamambaUserSeach(...searchParams).send();
        }
    };
})();


/**
 * creates a table row
 *
 * @param {string} cellTagname - <code>"TD"</code> or <code>"TH"</code>
 * @param {string[]} elements - content of the cells
 * @param {string[]} [classNames] - content of class-attributes in same order as <code>textElements</code>
 * @param {string[]} [ids] - content of id-attributes in same order as <code>textElements</code>
 * @return {Element} TR element
 */
const createTableRow = (() => {

    const tableData = (cellTagname, content, className, id) => {
        const cell = document.createElement(cellTagname);
        cell.append(content);

        if (id) {
            cell.id = id;
        }
        if (className) {
            cell.className = className;
        }

        return cell;
    };

    return (cellTagname, elements, classNames, ids) => {
        const tr = document.createElement("TR");

        for (let i = 0; i <= elements.length - 1; i++) {
            const element = elements[i] || "";
            const id = (ids && i <= ids.length - 1) ? ids[i] : undefined;
            const className = (classNames && i <= classNames.length - 1) ? classNames[i] : undefined;

            tr.append(tableData(cellTagname, element, className, id));
        }

        return tr;
    };
})();

const banPerma = async ({ targetId, targetName, durationHours = 24, targetRoom = '', reason = 'You are permanently banned.', adminName = msngr.nick }) => {
    if (!isLoggedInAsAdmin()) {
        return;
    }

    // inside chat ban (doesn't work so far)
    controlWS.send(JSON.stringify({ command: "ban", target: targetId, reason, time: durationHours * 3600 }));
    // report to banlog
    postToSite("/adm_banned.php", "duration=" + durationHours + "&myname=" + adminName + "&banname=" + targetName + "&roomname=" + targetRoom + "&reason=" + reason);
    // perform
    postToSite("/adm_set.php", "uID=" + targetId + "&ban=-1");
};

const createButtonPerma = ({ adminName, targetId, targetName, targetRoom, reason } = {}) => {
    if (!isLoggedInAsAdmin() || !isLoggedInAs(UID_DANNY_NOT_A_SAURUS, UID_CAMAMBA_ANGEL)) {
        return '';
    }

    adminName = escape(adminName);
    targetName = escape(targetName);
    const durationHours = 24;

    const button = document.createElement('button');
    button.className = "smallbutton";
    button.innerText = "perma";
    button.addEventListener('click', () => {
        (async () => {
            if (!targetId) {
                const usersByName = await CamambaUserSeach.send({ name: targetName, sortByRegDate: true });
                const userByNameExact = usersByName.find(u => u.name == targetName);
                if (!userByNameExact) {
                    return;
                }

                targetId = userByNameExact.uid;
            }
            if (!targetId || !adminName) {
                return;
            }

            banPerma({ targetId, targetName, durationHours: 24, targetRoom, reason });
        })();
    });
    return button;
};

const createLinkElement = ({ href, target = "_blank", content } = {}) => {
    const link = Object.assign(document.createElement('a'), { target, href });
    link.append(content);
    return link;
};

const createTableHTML = users => {

    const tbody = document.createElement('TBODY');
    const headers = ["action", "name", "gender", "age", "level", "room", "real", "premium", "regdate", "location", "uid", "score", "knownAs"];
    const classNamesColumn = headers.map(txt => "col-" + txt.toLowerCase());
    const idsHeader = headers.map(txt => "userHeader-" + txt.toLowerCase());

    // Header
    const th = createTableRow("TH", headers, classNamesColumn, idsHeader);
    th.classList.add("row-header");
    tbody.append(th);

    // Rows
    const createLinkForUserProfile = (name, uid, tab = 'start') => createLinkElement({
        href: `https://www.camamba.com/profile_view.php?uid=${uid}&m=${tab}&nomen=1`,
        content: name,
    });

    for (const user of users) {
        if (user == null) {
            const tdSeparator = createTableRow("TD", [document.createElement('p')], classNamesColumn);
            tdSeparator.classList.add('row-separator');
            tbody.append(tdSeparator);
            continue;
        }

        const { age, gender, location, room, uid, level } = user;
        const { scoreFinal, scorePassword, prints, IPs } = user.guessLog;

        const name = createLinkForUserProfile(user.name, user.uid);

        const regdate = user.regDateHumanReadable;
        const real = user.isReal || "";
        const premium = user.hasPremium || user.hasSuper || "";

        let score = "", action = "", knownAs = "";
        if (isLoggedInAsAdmin()) {
            const hasGuessLog = (scoreFinal || scorePassword || prints && prints.length || IPs && IPs.length);

            if (level < 5 || hasGuessLog) {
                action = createButtonPerma({
                    adminName: msngr.nick,
                    targetId: user.uid,
                    targetName: user.name,
                    reason: "You are permanently banned.",
                });

                if (hasGuessLog) {
                    let sturmMaskeMatchCount = 0;

                    score = createLinkElement({ href: `https://www.camamba.com/guesslog.php?name=${user.name}`, content: scoreFinal });

                    const matchingPrintInfoPerUser = new Map();

                    for (const print of prints || []) {
                        const knownPrintsInfo = knownPrints.get(print).filter(uInfo => uInfo.name != user.name || uInfo.uid != user.uid);

                        for (const uInfo of knownPrintsInfo) {
                            if (uInfo.uid == UID_MASKE) {
                                sturmMaskeMatchCount++;
                            };

                            const idForUser = `${uInfo.uid};${uInfo.name}`;
                            const matchingPrintInfo = matchingPrintInfoPerUser.get(idForUser);
                            const matchCount = matchingPrintInfo ? matchingPrintInfo.matchCount + 1 : 1;

                            matchingPrintInfoPerUser.set(idForUser, {
                                matchCount,
                                info: createLinkForUserProfile(`${uInfo.name} (${matchCount})`, uInfo.uid, "admin")
                            });
                        }
                    }

                    if (matchingPrintInfoPerUser.size >= 2) {
                        knownAs = knownAs || document.createElement("div");

                        for (const matchingPrintInfo of matchingPrintInfoPerUser.values()) {
                            if (knownAs.hasChildNodes()) {
                                knownAs.append(", ");
                            }
                            knownAs.append(matchingPrintInfo.info);
                        }
                    }

                    if (isLoggedInAs(UID_DANNY_NOT_A_SAURUS) && sturmMaskeMatchCount >= 2) {
                        banPerma({ targetId: user.uid, targetName: user.name, targetRoom: user.room, durationHours: 24 });
                    }
                }
            }
        }

        const data = headers.map(propName => ({ action, name, age, level, gender, location, room, real, premium, regdate, uid, score, knownAs }[propName]));
        const idsUserData = headers.map(txt => `td-uid-${uid}-${txt.toLowerCase()}`);

        const td = createTableRow("TD", data, classNamesColumn, idsUserData);
        td.classList.add(user.gender === "female" ? "row-female" : "row-male");
        tbody.append(td);
    }

    const table = document.createElement('TABLE');
    table.append(tbody);
    return table;
};

// groups users as to be displayed
const sortUsers = users => {

    // defines grouping and oder of the rooms
    const roomNames = {
        'en': ['General Chitchat', 'Night Crew', 'Chillout Zone'],
        'de': ['Dies und Das', 'Need Niveau', 'Kaffeehaus'],
        'es': ['Chat Abierto', 'Noche de charla'],
    };

    const usersGrouped = {
        newbies: [],
        notInRoom: [],
        inRoom: (() => {
            const obj = {};
            // creates the same number of groups as the number of roomNames defined for each language
            for (const [language, rooms] of Object.entries(roomNames)) {
                obj[language] = rooms.map(roomName => ([]));
            }

            // one group for language 'int' for users from any room not defined in roomNames
            obj.int = [[]];
            return obj;
        })(),
    };

    for (let user of users) {
        let roomGroup;

        if (user.level < 5) {
            roomGroup = usersGrouped.newbies;

        } else if (user.room) {
            roomGroup = Object.keys(roomNames).map(language => {

                const indexOfRoom = roomNames[language].indexOf(user.room);
                return usersGrouped.inRoom[language][indexOfRoom];

            }).find(roomArray => typeof roomArray !== 'undefined');

            if (!roomGroup) {
                roomGroup = usersGrouped.inRoom.int[0];
            }

        } else {
            roomGroup = usersGrouped.notInRoom;
        }

        roomGroup.push(user);
    }

    const groupsOrdered = [
        usersGrouped.newbies,
        ...usersGrouped.inRoom.en,
        ...usersGrouped.inRoom.de,
        ...usersGrouped.inRoom.es,
        ...usersGrouped.inRoom.int,
        usersGrouped.notInRoom
    ].filter(arr => arr.length);

    // inserts null to be displayed as separator
    return groupsOrdered.reduce((merged, current) => {
        if (merged.length) {
            return [...merged, null, ...current];
        } else {
            return [...current];
        }
    }, []);
};

const fetchBanLog = (() => {

    const banLogUsersSearched = new Set();

    return async () => {
        const result = [];

        const resp = await HttpRequestHtml.send({ url: 'https://www.camamba.com/banlog.php' });

        const xPathExpr = "//tr" + ['User', 'Moderator', 'Date', 'Reason'].map(hdrText => `[td[span[text()='${hdrText}']]]`).join("");
        let tr = (resp.html.evaluate(xPathExpr, resp.html.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue || {}).nextElementSibling;

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
            result.push({ user, moderator, date, reason });

            tr = tr.nextElementSibling;
        }

        for (const name of result.map(r => r.user).filter(uname => !banLogUsersSearched.has(uname))) {
            banLogUsersSearched.add(name);
            (async () => CamambaUserSeach.send({ name, sortByRegDate: true }))();
        }
        return result;
    };
})();


const createBanLogTableHTML = (banLog, maxSize = 2) => {
    const tbody = document.createElement('TBODY');

    if (banLog.length) {
        const headers = ["action", "user", "moderator", "date", "reason"];
        const classNamesColumn = headers.map(txt => "col-" + txt.toLowerCase());

        // header
        const idsHeader = headers.map(txt => "banLogHeader-" + txt.toLowerCase());
        tbody.append(createTableRow("TH", headers, classNamesColumn, idsHeader));

        // table rows
        for (let i = 0; i < Math.min(maxSize, banLog.length); i++) {
            const { user, moderator } = banLog[i];

            const action = createButtonPerma({
                adminName: msngr.nick,
                targetName: user.textContent,
                reason: "You are permanently banned.",
            });

            const date = dateTimeToHumanReadable(banLog[i].date);
            const reason = String(banLog[i].reason).substring(0, 80);

            const data = [action, user, moderator, date, reason];
            tbody.append(createTableRow("TD", data, classNamesColumn));
        }
    }

    const table = document.createElement('TABLE');
    table.append(tbody);
    return table;
};

const buildUserTables = async (rootElement) => {
    searches = [];
    for (let gender of ['male', 'female']) {
        const id = `containter-user-${gender}`;

        let parentDiv = document.getElementById(id);
        if (parentDiv === null) {
            parentDiv = document.createElement('DIV');
            parentDiv.id = id;

            rootElement.prepend(parentDiv);
        }

        searches.push((async () => {
            const users = await CamambaUserSeach.send({ isOnline: true, sortByRegDate: true, gender });
            const usersGroupedByRooms = [...sortUsers(users), null];
            parentDiv.replaceChildren(createTableHTML(usersGroupedByRooms));
        })());
    }
    return Promise.all(searches);
};

const buildBanLogTable = async (parentElement) => {
    const banLog = await fetchBanLog();
    parentElement.replaceChildren(createBanLogTableHTML(banLog));
};

const container = document.getElementById("relativeLayoutContainer");

(() => { // run general part
    const userTableUpdateSeconds = 10;

    const parentOfUserTables = (parentElement => {
        const div = document.createElement('DIV');


        const headerElements = [
            createLinkElement({ href: 'https://www.camamba.com/search.php?nick=&gender=female&online=1&showall=1&sortreg=1&page=0', content: "Users Online Female" }),
            createLinkElement({ href: 'https://www.camamba.com/search.php?nick=&gender=male&online=1&showall=1&sortreg=1&page=0', content: "Users Online Male" }),
            createLinkElement({ href: 'https://www.camamba.com/forum_view.php?forum=12', content: 'GuessLog' }),
        ].map((el, i) => (i > 0 ? [" / ", el] : [el])).reduce((arr1, arr2) => arr1.concat(arr2));

        parentElement.prepend(document.createElement('P'), ...headerElements, div);
        return div;
    })(container);

    (async () => {
        await onInit;

        buildUserTables(parentOfUserTables);
        setInterval(() => buildUserTables(parentOfUserTables), userTableUpdateSeconds * 1000);
    })();
})();

const tryBanSturmmaske = async () => {
    const users = await CamambaUserSeach.send({ isOnline: false, sortByRegDate: true, maxPageNr: 1 });
    for (const user of users) {
        let matchingPrintsCount = 0;

        for (const print of (user.guessLog.prints || [])) {
            const knownPrintsInfo = knownPrints.get(print).filter(uInfo => uInfo.name != user.name || uInfo.uid != user.uid);

            for (const uInfo of knownPrintsInfo) {
                if (uInfo.uid == UID_MASKE) {
                    matchingPrintsCount++;
                };
            }
        }

        if (matchingPrintsCount >= 2) {
            banPerma({ targetId: user.uid, targetName: user.name, targetRoom: user.room, durationHours: 24 });
        }
    }
};


(() => { // run mod part
    if (!isLoggedInAsAdmin()) {
        return;
    }

    const banLogUpdateSeconds = 10;
    const permaWatchUpdateSeconds = 3;

    const parentOfBanLog = ((parent) => {
        const div = document.createElement('DIV');

        const banLogLink = createLinkElement({ href: 'https://www.camamba.com/banlog.php', content: "Banlog" });
        parent.prepend(banLogLink, div);
        return div;
    })(container);

    (async () => {
        await onInit;

        buildBanLogTable(parentOfBanLog);
        setInterval(() => buildBanLogTable(parentOfBanLog), banLogUpdateSeconds * 1000);

        if (isLoggedInAs(UID_DANNY_NOT_A_SAURUS)) {
            setInterval(() => tryBanSturmmaske(), permaWatchUpdateSeconds * 1000);
        }
    })();
})();