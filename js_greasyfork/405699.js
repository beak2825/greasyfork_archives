// ==UserScript==
// @name         Camamba User
// @namespace    dannysaurus.camamba
//
// @include      http://www.camamba.com/*
// @include      https://www.camamba.com/*
// @include      http://www.de.camamba.com/*
// @include      https://www.de.camamba.com/*
//
// @connect      camamba.com
// @grant        GM_xmlhttpRequest
//
// @require      https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js
// @require      https://greasyfork.org/scripts/391854-enum/code/Enum.js
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
//
// @version      0.1
// @license      MIT License
// @description  User represents a camamba User, UserSearch represents a search-request for one or many users
// @author       Gerrit Höhle
// ==/UserScript==

/* jslint esnext: true */
/* globals HttpRequest, HttpRequestHtml, Enum, $, jQuery */
const User = (() => {
    'use strict';
    const GENDERS = class GENDER extends Enum {}.init({ ANY: 'any' , FEMALE: 'female' , MALE: 'male', COUPLE: 'couple' });

    return class User {
        constructor({ uid, nick, age, gender, location, distanceKm, latitudeDec, longitudeDec, isOnline, lastSeen, room, roomId, isReal, isPremium, isSuper, userLevel, timeStamp = new Date() } = {}) {
            Object.assign(this, { uid, nick, age, _gender: gender, location, distanceKm, latitudeDec, longitudeDec, isOnline, lastSeen, room, roomId, isReal, isPremium, isSuper, userLevel, timeStamp });
        }

        get gender() {
            return this._gender instanceof GENDERS ? this._gender : GENDERS.ANY;
        }

        set gender(value) {
            if (value instanceof GENDERS) {
                this._gender = value;
            } else {
                this._gender = [ ...GENDERS ].find(gender => gender.toString() === String(value)) || GENDERS.ANY;
            }
        }

        static get GENDERS() {
            return GENDERS;
        }
    };
})();

const UserSearch = (() => {
    const CONST = {
        URL_SEARCH: 'https://www.camamba.com/search.php',
        URL_USER_LEVEL: 'https://www.camamba.com/user_level.php'
    };

    const UserControllerInternal = (() => {
        const GENDERS = User.GENDERS;

        const getTextNodeValues = node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const nodeValue = node.nodeValue.replace(/"/,'');
                return (/\S/.test(nodeValue)) ? [ nodeValue ] : [];
            }
            return Array.from(node.childNodes).flatMap(node => getTextNodeValues(node));
        };

        const fetchJsLinks = (html, user) => {
            const jsLinks = Object.assign( {}, ...[ 'openProfile', 'sendMail', 'openChat', 'openMap' ].map(fncName => {
                const linkElement = $(html).find(`a[href*="javascript:${fncName}("]`);
                if (linkElement.length > 0) {
                    const href = linkElement.attr('href') || '';
                    const fncParam = ((href.match(/\((.+)\)/) || [])[1] || '').replace(/['"]/g,'');
                    const innerHtml = (linkElement.html() || '').trim();

                    return { [fncName]: { href, fncParam, html: innerHtml } };
                }
            }));

            if (typeof jsLinks.sendMail !== 'undefined') {
                user.uid = Number.parseInt(jsLinks.sendMail.fncParam);
            }

            if (typeof jsLinks.openProfile !== 'undefined') {
                user.nick = jsLinks.openProfile.fncParam;
            }

            if (typeof jsLinks.openChat !== 'undefined') {
                user.roomId = jsLinks.openChat.fncParam;
                user.room = jsLinks.openChat.html;
            }

            if (typeof jsLinks.openMap !== 'undefined') {
                const matchCoords = jsLinks.openMap.fncParam.match(/(-?\d{1,3}\.\d{8}),(-?\d{1,2}\.\d{8})/);
                if (matchCoords !== null) {
                    user.longitudeDec = Number.parseFloat(matchCoords[1]);
                    user.latitudeDec = Number.parseFloat(matchCoords[2]);
                }
                user.location = jsLinks.openMap.html;
            }
        };

        const fetchTextNodes = (html, user) => {
            const textNodes = getTextNodeValues(html);

            for (let gender of [ GENDERS.FEMALE, GENDERS.MALE, GENDERS.COUPLE ].map(enm => enm.text)) {
                const match = textNodes[1].match(new RegExp(`^\\W*\(${gender}\),\\s\(\\d{1,3}\)`));
                if (match !== null) {

                    user.age = Number.parseInt(match[2]);
                    user.gender = match[1];
                    break;
                }
            }

            const matches = textNodes[2].match(/Online\s((\d{1,4})\s(minutes|hours|days)\s)?(ago|now|never)/);
            if (matches !== null) {
                const term = matches[4];
                if (term === 'never') {
                    user.lastSeen = new Date(0);
                    user.isOnline = false;
                } else {
                    const timeStampShort = new Date(user.timeStamp.getFullYear(), user.timeStamp.getMonth(), user.timeStamp.getDate(), user.timeStamp.getHours(), user.timeStamp.getMinutes());

                    if (term === 'ago') {
                        user.lastSeen = timeStampShort;
                        user.isOnline = false;

                        const value = Number.parseInt(matches[2]);
                        const unit = matches[3];
                        switch (unit) {
                            case 'minutes':
                                user.lastSeen.setMinutes(user.lastSeen.getMinutes() - value);
                                break;
                            case 'hours':
                                user.lastSeen.setMinutes(0);
                                user.lastSeen.setHours(user.lastSeen.getHours() - value);
                                break;
                            case 'days':
                                user.lastSeen.setMinutes(0);
                                user.lastSeen.setHours(0);
                                user.lastSeen.setDate(user.lastSeen.getDate() - value);
                                break;
                        }
                    } else if (term === 'now') {
                        user.lastSeen = timeStampShort;
                        user.isOnline = true;
                    }
                }
            }

            for (let txt of textNodes.slice(2)) {
                const distanceMatch = txt.match(/(\d{0,2},?\d{1,3})\skm\sfrom\syou/);
                if (distanceMatch !== null) {

                    const distanceKm = Number.parseInt(distanceMatch[1].replace(/\D/g, ''));
                    if (Number.isInteger(distanceKm)) {

                        user.distanceKm = distanceKm;
                    }
                }
            }
        };

        const fetchImages = (html, user) => {
            for (let [property, imageName] of Object.entries({ isPremium: 'premium.png', isSuper: 'super_premium.png', isReal: 'real.png' })) {
                user[property] = $(html).find(`img[src$='/gfx/${imageName}']`).length > 0;
            }
        };

        const fetchCustom = (html, user) => {
            const embedRankSrc = $(html).find("embed[src^='/levelRank.swf?displayRank']").attr('src') || '';
            const match = embedRankSrc.match(/displayRank=(\d{1,3})/);
            if (match !== null) {
                user.userLevel = Number.parseInt(match[1]);
            }
        };

        return class UserControllerInternal {
            constructor(user = new User()) {
                this.user = user;
            }

            parseHtml({ html = '', url = '' } = {}) {
                if (url.includes(CONST.URL_SEARCH)) {
                    fetchJsLinks(html, this.user);
                    fetchTextNodes(html, this.user);
                    fetchImages(html, this.user);

                } else if (url.includes(CONST.URL_USER_LEVEL)) {
                    const matchUid = url.match(/uid=(\d{1,7})/);
                    if (matchUid !== null) {
                        this.user.uid = Number.parseInt(matchUid[1]);
                    }

                    const nick = $(html).find('div.popupcontent').find('div.bbottom').text();
                    if (nick) {
                        this.user.nick = nick;
                    }

                    fetchCustom(html, this.user);
                }

                return this;
            }

            static parseHtml({ html, url, user = new User() } = {}) {
                return new UserControllerInternal(user).parseHtml({ html, url });
            }
        };
    })();

    const createUrlParamsFromUserSearch = userSearch => Object.fromEntries(
        Object.entries({
            nick: 'nick',
            gender: 'gender',
            page: 'page',
            isOnline: 'online',
            hasPicture: 'picture',
            isPremium: 'isprem',
            isReal: 'isreal',
            isSuper: 'issuper'
        })
        .filter(([ propName, paramName ]) => userSearch[propName])
        .map(([ propName, paramName ]) => {
            let paramValue = userSearch[propName];
            paramValue = (typeof paramValue === 'boolean') ? (paramValue ? 1 : 0) : String(paramValue).replace(/\s/g, '+');
            return [ paramName, paramValue ];
        })
    );

    const executeUserSearch = (userSearch) => {
        return HttpRequestHtml.send({
            url: CONST.URL_SEARCH, params: createUrlParamsFromUserSearch(userSearch)
        }).then((response) => {
            const userNodes = $(response.html).find('.searchNormal, .searchSuper').get();
            const users = userNodes.map(node => UserControllerInternal.parseHtml({ html: node, url: response.finalUrl }).user);
            return users;
        });
    };

    return class UserSearch {
        constructor({ nick = '', gender = User.GENDERS.ANY, isOnline = false, hasPicture = false, isPremium = false, isReal = false, isSuper = false, page = 0 } = {}) {
            Object.assign(this, { nick, gender, isOnline, hasPicture, isPremium, isReal, isSuper, page });
        }

        execute() {
            return executeUserSearch(this).then(users => Promise.all(
                users.map(user => HttpRequestHtml.send({
                    url: CONST.URL_USER_LEVEL, params: { uid: user.uid }
                }).then(response => UserControllerInternal.parseHtml({ html: response.html, user: user, url: response.finalUrl }).user))
            ));
        }

        static execute(...args) {
            return new UserSearch(...args).execute();
        }

        static byUid(uid) {
            return HttpRequestHtml.send({
                url: CONST.URL_USER_LEVEL, params: { uid: uid }
            }).then(response => UserControllerInternal.parseHtml({ html: response.html, url: response.finalUrl }).user).then(user => {
                if (!(user && user.nick)) {
                    return Promise.reject(new Error(`No result for User with uid '${uid}'.`));
                }
                return executeUserSearch(new UserSearch({ nick: user.nick }));
            }).then(users => users.find(user => user.uid === uid ));
        }

        static get GENDERS() {
            return User.GENDERS;
        }
    };
})();