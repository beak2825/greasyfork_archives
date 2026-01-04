// ==UserScript==
// @name           Includes : Translate
// @description    Translate Function
// @version        1.0
// @language       en
// @include        nowhere
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1385333
// @downloadURL https://update.greasyfork.org/scripts/522385/Includes%20%3A%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/522385/Includes%20%3A%20Translate.meta.js
// ==/UserScript==

/**************************************************************************

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**************************************************************************/

const Translate = {
    version: 1,
    key: "",
    execute: function (text, from, to, cb) {
        const args = Array.from(arguments);

        if (!Translate.key) {
            // Google Translate API (deprecated)
            const v = (from, text2) => {
                switch (Translate.version) {
                    case 2: // v2
                        const text_arr = [];
                        if (Array.isArray(text2)) {
                            text2.forEach((item, index) => {
                                text_arr.push({
                                    "translatedText": (from === to ? text[index] : item)
                                });
                            });
                        } else {
                            text_arr.push({
                                "translatedText": (from === to ? text : text2)
                            });
                        }
                        return {
                            "data": { "translations": text_arr }
                        };
                    case 1: // v1
                        return {
                            "translation": (from === to ? text : text2),
                        };
                    default:
                        break;
                }
            };

            if (from === to) {
                cb(v(from, text), args);
            } else {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://translate.google.com.br/translate_a/t",
                    onload: function (xhr) {
                        let r = [[[""]], , from];
                        try {
                            r = xhr.response.json || JSON.parse(xhr.responseText.replace(/,(?=,)/g, ',null'));
                        } catch (e) {
                            r = eval(xhr.responseText);
                        }
                        cb(v(r[2], r[0][0][0]), args);
                    }
                }).send({
                    client: "t",
                    sl: from,
                    tl: to,
                    ie: "UTF-8",
                    oe: "UTF-8",
                    q: text,
                });
            }
        } else if (!from) {
            Translate.to(text, to, cb);
        } else {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.googleapis.com/language/translate/v2",
                headers: {
                    "X-HTTP-Method-Override": "GET"
                },
                onload: function (xhr) {
                    cb(xhr.response.json, args);
                }
            }).send({
                key: Translate.key,
                source: from,
                target: to,
                q: text
            });
        }
    },
    to: function (text, to, cb) {
        if (!Translate.key) {
            // Google Translate API (deprecated)
            Translate.execute(text, "-", to, cb);
        } else {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.googleapis.com/language/translate/v2/detect",
                headers: {
                    "X-HTTP-Method-Override": "GET"
                },
                onload: function (xhr) {
                    if (/^2/.test(xhr.status)) {
                        const data = xhr.response.json || JSON.parse(xhr.responseText);
                        data.detections.sort((a, b) => a.confidence - b.confidence);
                        Translate.execute(text, data.detections[0].language, to, cb);
                    }
                }
            }).send({
                key: Translate.key,
                q: text
            });
        }
    },
};
