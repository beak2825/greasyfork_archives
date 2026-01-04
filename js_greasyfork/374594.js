// ==UserScript==
// @name         Twitter Google Translation
// @namespace    http://taiho.moe/
// @version      0.2
// @description  Translate tweet using google translator
// @author       swordfeng
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/374594/Twitter%20Google%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/374594/Twitter%20Google%20Translation.meta.js
// ==/UserScript==

const style = `
.btn-link.translate-google {
    color: #657786;
    font-size: 12px;
    margin: 6px 6px -2px 0px;
    text-align: left;
}
.google-translation {
    border-top: 1px solid #e6ecf0;
    margin-top: 5px;
    padding: 5px 0 5px 0;
}
.google-translation-attribution {
    color: #657786;
    font-size: 12px;
}
`;
let translate;
let targetLang;
let oldhref = '';


(function() {
    'use strict';

    insertStyle(style);
    hookElement(document.body);
    hookPage();
})();

function insertStyle(style) {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    document.head.appendChild(styleElement);
}

function hookPage() {
    let el = document.getElementById('page-container');
    if (!el) {
        setTimeout(hookPage, 1000);
        return;
    }
    pageEntry();
    let observer = new MutationObserver(() => {
        if (window.location.href !== oldhref) {
            oldhref = window.location.href;
            pageEntry();
        }
    });
    observer.observe(el, { childList: true });
};

function pageEntry() {
    if (window.location.href === 'https://twitter.com/settings/account') {
        setLanguage();
    }
    targetLang = window.localStorage.getItem('google_trans_lang') || 'en';
}

function hookElement(elem) {
    for (let tweet of elem.getElementsByClassName('js-tweet-text-container')) {
        addTranslateBtn(tweet);
    }
    let observer = new MutationObserver(changes => {
        for (let change of changes) {
            for (let node of change.addedNodes) {
                if (node.nodeName.startsWith('#')) continue;
                for (let tweet of node.getElementsByClassName('js-tweet-text-container')) {
                    addTranslateBtn(tweet);
                }
            }
        }
    });
    observer.observe(elem, { subtree: true, childList: true });
}

function addTranslateBtn(tweet) {
    let translateBtn = tweet.parentElement.getElementsByClassName('translate-google')[0];
    if (!translateBtn) {
        translateBtn = document.createElement('button');
        translateBtn.className = 'btn-link u-textUserColorHover translate-google';
        translateBtn.appendChild(document.createTextNode('Translate with Google'));
        tweet.parentElement.insertBefore(translateBtn, tweet.nextSibling);
    }
    translateBtn.removeEventListener('click', clickTranslateBtn); // reset event
    translateBtn.addEventListener('click', clickTranslateBtn);
}

function clickTranslateBtn(ev) {
    let translateBtn = ev.target;
    let tweet = translateBtn.parentElement.getElementsByClassName('js-tweet-text-container')[0];
    let tweetText = tweet.textContent;
    translate(tweetText, {to: targetLang}).then(result => {
        translateBtn.style.display = 'none';
        let attr = document.createElement('div');
        attr.appendChild(document.createTextNode('Translated by Google'));
        attr.className = 'google-translation-attribution';
        let translateText = document.createElement('div');
        translateText.appendChild(attr);
        translateText.appendChild(document.createTextNode(result.text));
        translateText.className = 'google-translation';
        tweet.parentElement.insertBefore(translateText, translateBtn);
    }, err => {
        console.error(err);
    });
}

function setLanguage() {
    let lang = document.getElementById('user_lang');
    window.localStorage.setItem('google_trans_lang', lang.value);
    let save = document.getElementById('settings_save');
    save.addEventListener('click', () => window.localStorage.setItem('google_trans_lang', lang.value));
}

let getTk;
let languages;

// https://github.com/ken107/google-translate-token
/*****************************************************************************
The MIT License (MIT)

Copyright (c) 2016 Matheus Fernandes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************************************/
getTk = (function () {

    function got(url) {
        return new Promise(function(fulfill, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onreadystatechange: function(xhr) {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status == 200) fulfill({body: xhr.responseText});
                        else reject(new Error(xhr.responseText));
                    }
                }
            });
        })
    }

    function Configstore() {
        this.get = function(name) {
            return localStorage.getItem(name);
        }
        this.set = function(name, value) {
            localStorage.setItem(name, value);
        }
    }

    /* eslint-disable */
    // BEGIN

    function sM(a) {
        var b;
        if (null !== yr)
            b = yr;
        else {
            b = wr(String.fromCharCode(84));
            var c = wr(String.fromCharCode(75));
            b = [b(), b()];
            b[1] = c();
            b = (yr = window[b.join(c())] || "") || ""
        }
        var d = wr(String.fromCharCode(116))
            , c = wr(String.fromCharCode(107))
            , d = [d(), d()];
        d[1] = c();
        c = "&" + d.join("") + "=";
        d = b.split(".");
        b = Number(d[0]) || 0;
        for (var e = [], f = 0, g = 0; g < a.length; g++) {
            var l = a.charCodeAt(g);
            128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                e[f++] = l >> 18 | 240,
                e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
                e[f++] = l >> 6 & 63 | 128),
                e[f++] = l & 63 | 128)
        }
        a = b;
        for (f = 0; f < e.length; f++)
            a += e[f],
                a = xr(a, "+-a^+6");
        a = xr(a, "+-3^+b+-f");
        a ^= Number(d[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return c + (a.toString() + "." + (a ^ b))
    }

    var yr = null;
    var wr = function(a) {
        return function() {
            return a
        }
    }
        , xr = function(a, b) {
            for (var c = 0; c < b.length - 2; c += 3) {
                var d = b.charAt(c + 2)
                    , d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
                    , d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
                a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
            }
            return a
        };

    // END
    /* eslint-enable */

    var config = new Configstore('google-translate-api');

    window.TKK = config.get('TKK') || '0';

    function updateTKK() {
        return new Promise(function (resolve, reject) {
            var now = Math.floor(Date.now() / 3600000);

            if (Number(window.TKK.split('.')[0]) === now) {
                resolve();
            } else {
                got('https://translate.google.com').then(function (res) {
                    var code = res.body.match(/TKK='(.*?)';/) || res.body.match(/tkk:'(.*?)'/);

                    if (code) {
                        let TKK = code[1];
                        /* eslint-disable no-undef */
                        if (typeof TKK !== 'undefined') {
                            window.TKK = TKK;
                            config.set('TKK', TKK);
                        }
                        /* eslint-enable no-undef */
                    }
                    else throw new Error("Google has changed the algorithm");

                    /**
                     * Note: If the regex or the eval fail, there is no need to worry. The server will accept
                     * relatively old seeds.
                     */

                    resolve();
                }).catch(function (err) {
                    var e = new Error();
                    e.code = 'BAD_NETWORK';
                    e.message = err.message;
                    reject(e);
                });
            }
        });
    }

    function get(text) {
        return updateTKK().then(function () {
            var tk = sM(text);
            tk = tk.replace('&tk=', '');
            return {name: 'tk', value: tk};
        }).catch(function (err) {
            throw err;
        });
    }

    return get;
})();

// https://github.com/matheuss/google-translate-api
/*****************************************************************************
The MIT License (MIT)

Copyright (c) 2016 Matheus Fernandes – http://matheus.top – hi@matheus.top

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************************************/
translate = (function() {
    // https://github.com/jgallen23/querystring/blob/master/lib/querystring.js
    /*****************************************************************************
    (The MIT License)

    Copyright (c) 2013 Greg Allen

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    'Software'), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    *****************************************************************************/
    var querystring = {
        stringify : function(obj){
            var string = [];

            if (!!obj && obj.constructor === Object){
                for (var prop in obj){
                    if (obj[prop] instanceof Array){
                        for (var i = 0, length = obj[prop].length; i < length; i++){
                            string.push([encodeURIComponent(prop),encodeURIComponent(obj[prop][i])].join('='));
                        }
                    }
                    else {
                        string.push([encodeURIComponent(prop),encodeURIComponent(obj[prop])].join('='));
                    }
                }
            }

            return string.join('&');
        }
    };

    function got(url) {
        return new Promise(function(fulfill, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onreadystatechange: function(xhr) {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status == 200) fulfill({body: xhr.responseText});
                        else reject(new Error(xhr.responseText));
                    }
                }
            });
        })
    }

    function translate(text, opts) {
        opts = opts || {};

        var e;
        [opts.from, opts.to].forEach(function (lang) {
            if (lang && !languages.isSupported(lang)) {
                e = new Error();
                e.code = 400;
                e.message = 'The language \'' + lang + '\' is not supported';
            }
        });
        if (e) {
            return new Promise(function (resolve, reject) {
                reject(e);
            });
        }

        opts.from = opts.from || 'auto';
        opts.to = opts.to || 'en';

        opts.from = languages.getCode(opts.from);
        opts.to = languages.getCode(opts.to);

        return getTk(text).then(function (token) {
            var url = 'https://translate.google.com/translate_a/single';
            var data = {
                client: 't',
                sl: opts.from,
                tl: opts.to,
                hl: opts.to,
                dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
                ie: 'UTF-8',
                oe: 'UTF-8',
                otf: 1,
                ssel: 0,
                tsel: 0,
                kc: 7,
                q: text
            };
            data[token.name] = token.value;

            return url + '?' + querystring.stringify(data);
        }).then(function (url) {
            return got(url).then(function (res) {
                var result = {
                    text: '',
                    from: {
                        language: {
                            didYouMean: false,
                            iso: ''
                        },
                        text: {
                            autoCorrected: false,
                            value: '',
                            didYouMean: false
                        }
                    },
                    raw: ''
                };

                if (opts.raw) {
                    result.raw = res.body;
                }

                var body = JSON.parse(res.body);
                body[0].forEach(function (obj) {
                    if (obj[0]) {
                        result.text += obj[0];
                    }
                });

                if (body[2] === body[8][0][0]) {
                    result.from.language.iso = body[2];
                } else {
                    result.from.language.didYouMean = true;
                    result.from.language.iso = body[8][0][0];
                }

                if (body[7] && body[7][0]) {
                    var str = body[7][0];

                    str = str.replace(/<b><i>/g, '[');
                    str = str.replace(/<\/i><\/b>/g, ']');

                    result.from.text.value = str;

                    if (body[7][5] === true) {
                        result.from.text.autoCorrected = true;
                    } else {
                        result.from.text.didYouMean = true;
                    }
                }

                return result;
            }).catch(function (err) {
                var e;
                e = new Error();
                if (err.statusCode !== undefined && err.statusCode !== 200) {
                    e.code = 'BAD_REQUEST';
                } else {
                    e.code = 'BAD_NETWORK';
                }
                throw e;
            });
        });
    }
    return translate;
})();

languages = (function () {
    let module = {exports: {}};
    var langs = {
        'auto': 'Automatic',
        'af': 'Afrikaans',
        'sq': 'Albanian',
        'am': 'Amharic',
        'ar': 'Arabic',
        'hy': 'Armenian',
        'az': 'Azerbaijani',
        'eu': 'Basque',
        'be': 'Belarusian',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'bg': 'Bulgarian',
        'ca': 'Catalan',
        'ceb': 'Cebuano',
        'ny': 'Chichewa',
        'zh-cn': 'Chinese Simplified',
        'zh-tw': 'Chinese Traditional',
        'co': 'Corsican',
        'hr': 'Croatian',
        'cs': 'Czech',
        'da': 'Danish',
        'nl': 'Dutch',
        'en': 'English',
        'eo': 'Esperanto',
        'et': 'Estonian',
        'tl': 'Filipino',
        'fi': 'Finnish',
        'fr': 'French',
        'fy': 'Frisian',
        'gl': 'Galician',
        'ka': 'Georgian',
        'de': 'German',
        'el': 'Greek',
        'gu': 'Gujarati',
        'ht': 'Haitian Creole',
        'ha': 'Hausa',
        'haw': 'Hawaiian',
        'iw': 'Hebrew',
        'hi': 'Hindi',
        'hmn': 'Hmong',
        'hu': 'Hungarian',
        'is': 'Icelandic',
        'ig': 'Igbo',
        'id': 'Indonesian',
        'ga': 'Irish',
        'it': 'Italian',
        'ja': 'Japanese',
        'jw': 'Javanese',
        'kn': 'Kannada',
        'kk': 'Kazakh',
        'km': 'Khmer',
        'ko': 'Korean',
        'ku': 'Kurdish (Kurmanji)',
        'ky': 'Kyrgyz',
        'lo': 'Lao',
        'la': 'Latin',
        'lv': 'Latvian',
        'lt': 'Lithuanian',
        'lb': 'Luxembourgish',
        'mk': 'Macedonian',
        'mg': 'Malagasy',
        'ms': 'Malay',
        'ml': 'Malayalam',
        'mt': 'Maltese',
        'mi': 'Maori',
        'mr': 'Marathi',
        'mn': 'Mongolian',
        'my': 'Myanmar (Burmese)',
        'ne': 'Nepali',
        'no': 'Norwegian',
        'ps': 'Pashto',
        'fa': 'Persian',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'ma': 'Punjabi',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sm': 'Samoan',
        'gd': 'Scots Gaelic',
        'sr': 'Serbian',
        'st': 'Sesotho',
        'sn': 'Shona',
        'sd': 'Sindhi',
        'si': 'Sinhala',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'so': 'Somali',
        'es': 'Spanish',
        'su': 'Sundanese',
        'sw': 'Swahili',
        'sv': 'Swedish',
        'tg': 'Tajik',
        'ta': 'Tamil',
        'te': 'Telugu',
        'th': 'Thai',
        'tr': 'Turkish',
        'uk': 'Ukrainian',
        'ur': 'Urdu',
        'uz': 'Uzbek',
        'vi': 'Vietnamese',
        'cy': 'Welsh',
        'xh': 'Xhosa',
        'yi': 'Yiddish',
        'yo': 'Yoruba',
        'zu': 'Zulu'
    };
    /**
     * Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
     * @param {string} desiredLang – the name or the code of the desired language
     * @returns {string|boolean} The ISO 639-1 code of the language or false if the language is not supported
     */
    function getCode(desiredLang) {
        if (!desiredLang) {
            return false;
        }
        desiredLang = desiredLang.toLowerCase();

        if (langs[desiredLang]) {
            return desiredLang;
        }

        var keys = Object.keys(langs).filter(function (key) {
            if (typeof langs[key] !== 'string') {
                return false;
            }

            return langs[key].toLowerCase() === desiredLang;
        });

        return keys[0] || false;
    }

    /**
     * Returns true if the desiredLang is supported by Google Translate and false otherwise
     * @param desiredLang – the ISO 639-1 code or the name of the desired language
     * @returns {boolean}
     */
    function isSupported(desiredLang) {
        return Boolean(getCode(desiredLang));
    }

    module.exports = langs;
    module.exports.isSupported = isSupported;
    module.exports.getCode = getCode;

    return module.exports;
})();
