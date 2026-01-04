// ==UserScript==
// @name         Gota.io Chat Translator
// @namespace    http://tampermonkey.net/
// @version      1
// @description  click on a message in chat to translate it (uses google translate and auto detects language, so it may be incorrect)
// @author       yl3
// @match        https://gota.io/web/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535640/Gotaio%20Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/535640/Gotaio%20Chat%20Translator.meta.js
// ==/UserScript==

var languageMap = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'ca': 'Catalan',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian',
    'ha': 'Hausa',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'id': 'Indonesian',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'km': 'Khmer',
    'ko': 'Korean',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'mk': 'Macedonian',
    'ml': 'Malayalam',
    'mn': 'Mongolian',
    'my': 'Burmese',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sr': 'Serbian',
    'si': 'Sinhalese',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tl': 'Tagalog',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'zu': 'Zulu'
};

setTimeout(function() {

    if(typeof(top.translate) == 'undefined') {
        top.translate = function(text, fromL, toL) {
            var fL = fromL || 'en';
            var tL = toL || 'de';
            var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + fL + "&tl=" + tL + "&dt=t&q=" + encodeURI(text);
            var parseJSON = txt => JSON.parse(txt.split(',').map(x => x || 'null').join(','));
            var joinSnippets = json => json[0].map(x => x[0]).join('');

            return fetch(url).then(function(res) {
                return res.text();
            }).then(function(text) {
                var json = parseJSON(text);
                var translatedText = joinSnippets(json);
                var detectedLanguage = json[2];
                var detectedLanguageName = languageMap[detectedLanguage] || detectedLanguage;

                return [translatedText, detectedLanguageName];
            });
        };
    }

    document.getElementById('chat-body-0').addEventListener('click', function(e) {
        if(e.target.tagName === 'TD') {
            const span = e.target.querySelector('span[data-msgid]');
            if(span) {
                if(!span.hasAttribute('data-executed')) {
                    span.setAttribute('data-executed', 'true');
                    dostuff(span, e.target);
                }
            }
        }
        if(e.target.tagName === 'SPAN' && e.target.hasAttribute('data-msgid')) {
            if(!e.target.hasAttribute('data-executed')) {
                const parentElement = e.target.parentElement;
                e.target.setAttribute('data-executed', 'true');
                dostuff(e.target, parentElement);
            }
        }
    });

    function dostuff(target, parent) {
        target.style.filter = 'brightness(0.6)';
        translate(target.innerHTML, 'auto', 'en').then(function(r) {
            if(r[0] == target.innerHTML) {
                return;
            }
            parent.innerHTML = parent.innerHTML + '<span style="color: rgb(255, 255, 255);"> [' + r[1] + ' detected - ' + r[0] + ']</span>'
        })
    }

}, 5000);