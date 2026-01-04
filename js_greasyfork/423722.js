// ==UserScript==
// @name         Camamba Chat Helpers Library
// @namespace    dannysaurus.camamba
// @version      0.2.2
// @description  decorates "knownUsers" and "rooms" objects with functions useful for console and other scripts
// @license      MIT License
// @include      https://www.camamba.com/chat/
// @include      https://www.de.camamba.com/chat/
// @include      https://www.camamba.com/chat/
// @include      https://www.de.camamba.com/chat/
// @grant        none
// ==/UserScript==

/* jslint esversion: 9 */
/* global me, camData, rooms, blockList, friendList, friendRequests, adminMessages, jsLang, byId, myRooms, knownUsers, activeRoom, selectedUser, settings, onMessageHandlers, postMessageHandlers, janusSend, wsSend, activeMainRoom, postToSite */
/* globals SimpleCache, HttpRequest, HttpRequestHtml, Enum, User, UserSearch, $, jQuery */

(function() {
    function decorateUsers(users = {}) {

        const isUser = (user) => {
            return user.hasOwnProperty("id") && !Object.getOwnPropertyDescriptor(user, "id").get;
        };

        const toArray = () => {
            if (Array.isArray(users)) {
                return [...users];
            }
            
            // single user object
            if (isUser(users)) {
                return [ users ];
            }

            return Object.values(users);
        };

        const toString = () => {
            return toArray().map(u => {

                return Object.entries(u)
                    .map(([prop, val]) => prop + ':' + val)
                    .join('\t');

            }).join('\n');
        };

        const by = (userPredicateFnc) => {
            const result = [], excluded = [];

            Object.values(users).filter(u => isUser(u)).forEach(u => {
                if(userPredicateFnc(u)) {
                    result.push(u);
                } else {
                    excluded.push(u);
                }
            });

            if (excluded.length) {
                result.excluded = decorateUsers(excluded);
                result.excludedAll = decorateUsers([ ...excluded, ...users.excludedAll ]);
            }

            return decorateUsers(result);
        };

        const byId = (id) => {
            return by(user => user.id == id);
        };

        const byName = (name) => {
            const nameLower = String(name).toLowerCase();
            return by(user => {
                return user.name.toLowerCase().includes(nameLower);
            });
        };

        const byGender = (gender) => {
            const genderLower = String(gender).toLowerCase();
            return by(user => {
                return user.gender.toLowerCase().startsWith(genderLower);
            });
        };

        const bySelected = () => {
            const selectedUserId = selectedUser ? selectedUser.dataset.id : 0;

            if (!selectedUserId) {
                return by(user => false);
            }

            return byId(selectedUserId);
        };

        const byIsCammed = () => {
            if (!camData) return false;

            const camDataUserIds = new Set(
                Object.values(camData)
                .filter(cd => cd.user)
                .map(cd => String(cd.user))
            );

            return by(user => {
                return camDataUserIds.has(String(user.id));
            });
        };

        const byViewing = () => {
            return users.by(user => {
                return user.viewing;
            });
        };

        const byPos = (pos) => {
            return toArray()[pos];
        };

        const stopViewing = () => {
            return byViewing().forEach(user => {
                janusSend('remove', user.id);
            });
        };

        const save = () => toArray().forEach(user => {
            user.original = {...user};
        });

        const restore = () => by(user => user.original).forEach(user => {
            Object.assign(user, user.original);
            delete user.original;
        });

        const ban = (text, time, config = { isPublic: false, isPerma: false, suppressBanLog: false }) => {
            const { isPublic, isPerma, suppressBanLog } = config;

            if (me.admin && toArray(users).length === 1) {
                const currentAdminTarget = users[0].id;
                // ban
                wsSend( { command: "ban", target: currentAdminTarget, reason: text, time: time * 3600 } );
                // notify user
                wsSend( { command: "admin", type: "admin", msg: { text: knownUsers[me.id].name + " banned " + knownUsers[currentAdminTarget].name+" for "+time+" hours.", room: activeMainRoom, notify: true }} );
                // to banlog
                if (!suppressBanLog) {
                    postToSite("/adm_banned.php", "duration="+time+"&myname="+escape(knownUsers[me.id].name)+"&banname="+escape(knownUsers[currentAdminTarget].name)+"&roomname="+escape(activeMainRoom)+"&reason="+escape(text));
                }
                // to chat
                if (isPublic) {
                    wsSend( { command: "admin", type: "room", msg: { text: knownUsers[currentAdminTarget].name+" has been banned.", room: activeMainRoom }} );
                }
                // do perma
                if (isPerma) {
                    postToSite("/adm_set.php", "uID="+currentAdminTarget+"&ban=-1");
                }
            }
        };

        const banPerma = (text) => ban(text, 24, { isPublic: false, isPerma: true, suppressBanLog: false });

        // { nick = '', gender = User.GENDERS.ANY, isOnline = false, hasPicture = false, isPremium = false, isReal = false, isSuper = false, page = 0 } = {}
        const add = (name, byNameExact = false) => {
            return UserSearch.execute({ nick: name }).then(searchResult => {
                if (byNameExact) {
                    searchResult = searchResult.filter(u => u.nick === name);
                }

                searchResult.forEach(u => {
                    users[u.uid] = {
                        id: u.uid,
                        name: u.nick,
                        age: u.age,
                        level: u.userLevel,
                        real: u.isReal ? 1 : 0,
                        premium: (() => {
                            if (u.isSuper) {
                                return 3;
                            }
                            if (u.isPremium){
                                return 1;
                            }
                            return 0;
                        })(),
                        gender: (() => {
                            if (u.gender === User.GENDERS.MALE) {
                                return "male";
                            }
                            if (u.gender === User.GENDERS.FEMALE) {
                                return "female";
                            }
                            if (u.gender === User.GENDERS.COUPLE) {
                                return "couple";
                            }
                            return "";
                        })(),
                    };
                    console.log(`found user with uid ${u.uid}, username ${u.nick}, level ${u.userLevel}`);
                });

                return searchResult;
            });
        };

        const banPermaByName = (name, text) => {
            // fast ban
            byName(name).banPermaFast(text);

            // via user search
            add(name, true).then(searchResult => {
                // only permaban new users and with an exact unique search result
                const uid = (searchResult.length === 1) ? searchResult[0].uid : -1;
                if (uid > 1279501) {
                    byId(uid).banPermaFast(text);
                }
            });
        };

        const userPropertiesDescriptor = Object.fromEntries([
            "age",
            "audio",
            "blocked",
            "cam",
            "camWantPending",
            "camWantProcessed",
            "friend",
            "gender",
            "id",
            "initPriv",
            "level",
            "moderator",
            "name",
            "premium",
            "real",
            "requestDeAnnoy",
            "video",
            "viewing",
        ].map(propName => ([ propName, {
            get() {
                return Object.values(users)
                                .filter(u => isUser(u))
                                .map(u => u[propName]);
            },
            configurable: true,
        }])));

        const metaPropertiesDescriptor = Object.fromEntries(Object.entries({
            excluded: users.excluded || [],
            excludedAll: users.excludedAll || [],
            toArray,
            toString,

            by,

            byId,
            bySelected,
            byName,
            byGender,
            byPos,
            byIsCammed,
            byIsNotCammed: () => byIsCammed().excluded,
            byViewing,

            add,
            addExact: (name) => add(name, true),

            stopViewing,

            ban,
            ban24: (text, config = { isPublic: false, isPerma: false, suppressBanLog: false }) => ban(text, 24, config),
            banPerma: (name) => {
                const text = "Du bist dauerhaft gebannt. Bitte erstelle keine weiteren Konten!";
                if (typeof name === "undefined" || !name.length) {
                    banPerma(text);
                } else {
                    banPermaByName(name, text);
                }
            },
            banPermaEn: (name) => {
                const text = "You are permanently banned from Camamba. Please do not create any additional accounts!";
                if (typeof name === "undefined" || !name.length) {
                    banPerma(text);
                } else {
                    banPermaByName(name, text);
                }
            },
            banPermaFast: (text) => banPerma(text),

            banSilent: (text, time) => ban(text, time, { isPublic: false, isPerma: false, suppressBanLog: true }),
            banSilentPerma: (text, time) => ban(text, time, { isPublic: false, isPerma: true, suppressBanLog: true }),

            save,
            restore,
        }).map(([propName, value]) => {
            return [propName, { value, configurable: true }];
        }));

        return Object.defineProperties(users, { ...userPropertiesDescriptor, ...metaPropertiesDescriptor });
    }

    function decorateRooms(rooms = {}) {
        const roomsByName = (name) => {
            const nameLower = String(name).toLowerCase();

            const result = {};

            Object.entries(rooms).forEach(([roomId, roomName]) => {

                if (roomName.toLowerCase().includes(nameLower)) {
                    result[roomId] = roomName;
                }
            });

            return result;
        };

        return Object.defineProperties(rooms, {
            byName: { value: roomsByName, configurable: true },
        });
    }

    const patchObject = ({ getExpected, doPatch, confirmAvailable = null, timeOutRetryMillis = 200, maxPeriodTryMillis = 5000 }) => {
        const expected = getExpected();
        const isAvailable = confirmAvailable ? confirmAvailable(expected) : !!expected;

        if (!isAvailable) {
            if (timeOutRetryMillis <= maxPeriodTryMillis) {

                setTimeout(() => {
                    maxPeriodTryMillis -= timeOutRetryMillis;
                    patchObject({ getExpected, doPatch, confirmAvailable, timeOutRetryMillis, maxPeriodTryMillis });

                }, timeOutRetryMillis);
            }

            return;
        }

        doPatch(expected);
    };

    patchObject({
        getExpected: () => {
            return knownUsers;
        },
        doPatch: (users) => {
            decorateUsers(users);
        }
    });

    patchObject({
        getExpected: () => {
            return rooms;
        },
        doPatch: (rooms) => {
            decorateRooms(rooms);
        }
    });
})();