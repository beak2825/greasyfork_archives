// ==UserScript==
// @name        Kana Rōmaji and English Converter
// @description Convert gairaigo (Japanese loan words) back to English and show Rōmaji for kana
// @icon        https://upload.wikimedia.org/wikipedia/commons/2/28/Ja-Ruby.png
// @match       *://*/*
// @exclude     *://*.bilibili.com/video/*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     translate.googleapis.com
// @version     2024.01.01
// @name:ja-JP  カナローマ字および英語変換
// @name:zh-CN  假名罗马字和英语转换器
// @description:zh-CN 将网页中的日语外来语和假名转换为罗马字和英文
// @license MIT
// @namespace https://greasyfork.org/users/1062446
// @downloadURL https://update.greasyfork.org/scripts/502753/Kana%20R%C5%8Dmaji%20and%20English%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/502753/Kana%20R%C5%8Dmaji%20and%20English%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define some shorthands
    var _ = document;

    var queue = {};  // {"カタカナ": [rtNodeA, rtNodeB]}
    var cachedTranslations = {};  // {"ターミネーター": "Terminator"}
    var newNodes = [_.body];

    // Rōmaji conversion function
    function kanaToRomaji(kana) {
        var map = {
            // Hiragana
            "きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
            "しゃ": "sha", "しゅ": "shu", "しょ": "sho",
            "ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
            "にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
            "ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
            "みゃ": "mya", "みゅ": "myu", "みょ": "myo",
            "りゃ": "rya", "りゅ": "ryu", "りょ": "ryo",
            "ぎゃ": "gya", "ぎゅ": "gyu", "ぎょ": "gyo",
            "じゃ": "ja", "じゅ": "ju", "じょ": "jo",
            "びゃ": "bya", "びゅ": "byu", "びょ": "byo",
            "ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo",
            "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
            "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
            "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
            "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
            "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
            "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
            "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
            "や": "ya", "ゆ": "yu", "よ": "yo",
            "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
            "わ": "wa", "を": "wo", "ん": "n",
            "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
            "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
            "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
            "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
            "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
            "ゔぁ": "va", "ゔぃ": "vi", "ゔ": "vu", "ゔぇ": "ve", "ゔぉ": "vo",
            "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
            "ゃ": "ya", "ゅ": "yu", "ょ": "yo",
            "ゎ": "wa",
            "ゐ": "wi", "ゑ": "we",
            "ゕ": "ka", "ゖ": "ke",
            // Katakana
            "キャ": "kya", "キュ": "kyu", "キョ": "kyo",
            "シャ": "sha", "シュ": "shu", "ショ": "sho",
            "チャ": "cha", "チュ": "chu", "チョ": "cho",
            "ニャ": "nya", "ニュ": "nyu", "ニョ": "nyo",
            "ヒャ": "hya", "ヒュ": "hyu", "ヒョ": "hyo",
            "ミャ": "mya", "ミュ": "myu", "ミョ": "myo",
            "リャ": "rya", "リュ": "ryu", "リョ": "ryo",
            "ギャ": "gya", "ギュ": "gyu", "ギョ": "gyo",
            "ジャ": "ja", "ジュ": "ju", "ジョ": "jo",
            "ビャ": "bya", "ビュ": "byu", "ビョ": "byo",
            "ピャ": "pya", "ピュ": "pyu", "ピョ": "pyo",
            "ア": "a", "イ": "i", "ウ": "u", "エ": "e", "オ": "o",
            "カ": "ka", "キ": "ki", "ク": "ku", "ケ": "ke", "コ": "ko",
            "サ": "sa", "シ": "shi", "ス": "su", "セ": "se", "ソ": "so",
            "タ": "ta", "チ": "chi", "ツ": "tsu", "テ": "te", "ト": "to",
            "ナ": "na", "ニ": "ni", "ヌ": "nu", "ネ": "ne", "ノ": "no",
            "ハ": "ha", "ヒ": "hi", "フ": "fu", "ヘ": "he", "ホ": "ho",
            "マ": "ma", "ミ": "mi", "ム": "mu", "メ": "me", "モ": "mo",
            "ヤ": "ya", "ユ": "yu", "ヨ": "yo",
            "ラ": "ra", "リ": "ri", "ル": "ru", "レ": "re", "ロ": "ro",
            "ワ": "wa", "ヲ": "wo", "ン": "n",
            "ガ": "ga", "ギ": "gi", "グ": "gu", "ゲ": "ge", "ゴ": "go",
            "ザ": "za", "ジ": "ji", "ズ": "zu", "ゼ": "ze", "ゾ": "zo",
            "ダ": "da", "ヂ": "ji", "ヅ": "zu", "デ": "de", "ド": "do",
            "バ": "ba", "ビ": "bi", "ブ": "bu", "ベ": "be", "ボ": "bo",
            "パ": "pa", "ピ": "pi", "プ": "pu", "ペ": "pe", "ポ": "po",
            "ヴァ": "va", "ヴィ": "vi", "ヴ": "vu", "ヴェ": "ve", "ヴォ": "vo",
            "ァ": "a", "ィ": "i", "ゥ": "u", "ェ": "e", "ォ": "o",
            "ャ": "ya", "ュ": "yu", "ョ": "yo",
            "ヮ": "wa",
            "ヰ": "wi", "ヱ": "we",
            "ヵ": "ka", "ヶ": "ke",
            "ㇰ": "ku", "ㇱ": "shi", "ㇲ": "su", "ㇳ": "to", "ㇴ": "nu",
            "ㇵ": "ha", "ㇶ": "hi", "ㇷ": "fu", "ㇸ": "he", "ㇹ": "ho",
            "ㇺ": "mu", "ㇻ": "ra", "ㇼ": "ri", "ㇽ": "ru", "ㇾ": "re", "ㇿ": "ro"
        };
        
        var result = '';
        for (var i = 0; i < kana.length; i++) {
            // Check for multi-character kana
            if (i < kana.length - 1 && map[kana.substring(i, i + 2)]) {
                result += map[kana.substring(i, i + 2)];
                i++; // Skip next character
            } else {
                result += map[kana[i]] || kana[i];
            }
        }
        return result;
    }

    // Function to create and insert ruby tags
    function createRubyElement(kanaText, romaji) {
        var ruby = _.createElement('ruby');
        ruby.appendChild(_.createTextNode(kanaText));
        var rt = _.createElement('rt');
        rt.classList.add('kana-terminator-rt');
        rt.dataset.rt = kanaText.match(/[\u3041-\u3096]/) ? romaji.toUpperCase() : romaji;
        ruby.appendChild(rt);
        return ruby;
    }

    // Process and convert text nodes
    function processTextNode(node) {
        var kanaRegex = /[\u30A1-\u30FA\u30FD-\u30FF\u3041-\u3096\u309B-\u309C\u31F0-\u31FF]+/g;
        var text = node.nodeValue;
        var match, lastIndex = 0, fragments = [];

        while ((match = kanaRegex.exec(text)) !== null) {
            // Add non-kana text
            if (match.index > lastIndex) {
                fragments.push(text.substring(lastIndex, match.index));
            }
            // Convert and add kana text
            var kanaText = match[0];
            var romaji = kanaToRomaji(kanaText);
            var ruby = createRubyElement(kanaText, romaji);
            fragments.push(ruby);
            lastIndex = kanaRegex.lastIndex;
        }

        // Add remaining non-kana text
        if (lastIndex < text.length) {
            fragments.push(text.substring(lastIndex));
        }

        // Replace the original text node with the fragments
        fragments.forEach(fragment => {
            if (typeof fragment === 'string') {
                node.parentNode.insertBefore(_.createTextNode(fragment), node);
            } else {
                node.parentNode.insertBefore(fragment, node);
            }
        });
        node.parentNode.removeChild(node);
    }

    // Recursively traverse the DOM and process text nodes
    function scanTextNodes(node) {
        if (!node.parentNode || !_.body.contains(node)) {
            return;
        }

        var excludeTags = {ruby: true, script: true, select: true, textarea: true};

        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) {
                    return;
                }
                Array.from(node.childNodes).forEach(scanTextNodes);
                break;

            case Node.TEXT_NODE:
                processTextNode(node);
                break;
        }
    }

    // Watch for newly added DOM nodes and process them
    function mutationHandler(mutationList) {
        mutationList.forEach(function(mutationRecord) {
            Array.from(mutationRecord.addedNodes).forEach(function(node) {
                newNodes.push(node);
            });
        });
    }

    // Split word list into chunks to limit the length of API requests
    function translateTextNodes() {
        var apiRequestCount = 0;
        var phraseCount = 0;
        var chunkSize = 200;
        var chunk = [];

        for (var phrase in queue) {
            phraseCount++;
            if (phrase in cachedTranslations) {
                updateRubyByCachedTranslations(phrase);
                continue;
            }

            chunk.push(phrase);
            if (chunk.length >= chunkSize) {
                apiRequestCount++;
                googleTranslate('ja', 'en', chunk);
                chunk = [];
            }
        }

        if (chunk.length) {
            apiRequestCount++;
            googleTranslate('ja', 'en', chunk);
        }

        if (phraseCount) {
            console.debug('Kana Rōmaji and English Converter:', phraseCount, 'phrases translated in', apiRequestCount, 'requests, frame', window.location.href);
        }
    }

    // {"keyA": 1, "keyB": 2} => "?keyA=1&keyB=2"
    function buildQueryString(params) {
        return '?' + Object.keys(params).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
    }

    // Google Dictionary API, https://github.com/ssut/py-googletrans/issues/268
    function googleTranslate(srcLang, destLang, phrases) {
        // Prevent duplicate HTTP requests before the request completes
        phrases.forEach(function(phrase) {
            cachedTranslations[phrase] = null;
        });

        var joinedText = phrases.join('\n').replace(/\s+$/, ''),
            api = 'https://translate.googleapis.com/translate_a/single',
            params = {
                client: 'gtx',
                dt: 't',
                sl: srcLang,
                tl: destLang,
                q: joinedText,
            };

        GM_xmlhttpRequest({
            method: "GET",
            url: api + buildQueryString(params),
            onload: function(dom) {
                try {
                    var resp = JSON.parse(dom.responseText.replace("'", '\u2019'));
                } catch (err) {
                    console.error('Kana Rōmaji and English Converter: invalid response', dom.responseText);
                    return;
                }
                resp[0].forEach(function(item) {
                    var translated = item[0].replace(/\s+$/, ''),
                        original   = item[1].replace(/\s+$/, '');
                    cachedTranslations[original] = translated;
                    updateRubyByCachedTranslations(original);
                });
            },
            onerror: function(dom) {
                console.error('Kana Rōmaji and English Converter: request error', dom.statusText);
            },
        });
    }

    // Clear the pending-translation queue
    function updateRubyByCachedTranslations(phrase) {
        if (!cachedTranslations[phrase]) {
            return;
        }
        (queue[phrase] || []).forEach(function(node) {
            node.dataset.rt = cachedTranslations[phrase]; // Override the Rōmaji with the English translation
        });
        delete queue[phrase];
    }

    function main() {
        GM_addStyle("rt.kana-terminator-rt::before { content: attr(data-rt); }");

        var observer = new MutationObserver(mutationHandler);
        observer.observe(_.body, {childList: true, subtree: true});

        function rescanTextNodes() {
            mutationHandler(observer.takeRecords());
            if (!newNodes.length) {
                return;
            }

            console.debug('Kana Rōmaji and English Converter:', newNodes.length, 'new nodes were added, frame', window.location.href);
            newNodes.forEach(scanTextNodes);
            newNodes.length = 0;
            translateTextNodes();
        }

        rescanTextNodes();
        setInterval(rescanTextNodes, 500);
    }

    // Polyfill for Greasemonkey 4
    if (typeof GM_xmlhttpRequest === 'undefined' &&
        typeof GM === 'object' && typeof GM.xmlHttpRequest === 'function') {
        GM_xmlhttpRequest = GM.xmlHttpRequest;
    }

    if (typeof GM_addStyle === 'undefined') {
        GM_addStyle = function(css) {
            var head = _.getElementsByTagName('head')[0];
            if (!head) {
                return null;
            }

            var style = _.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = css;
            head.appendChild(style);
            return style;
        };
    }

    // Polyfill for ES5
    if (typeof NodeList.prototype.forEach === 'undefined') {
        NodeList.prototype.forEach = function(callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    main();
})();

/*
 * Contributions:
 * - Original script by Arnie97: https://github.com/Arnie97/katakana-terminator
 */
