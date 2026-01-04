// ==UserScript==
// @name            Russian Cyrillic to Latvian transliterator
// @description     Web site conversion of Russian Cyrillic to Latvian
// @version         0.1
// @date            2020-01-13
// @author          Henrijs Kons
// @namespace       http://henrijskons.eu/translit
// @include         *
// @downloadURL https://update.greasyfork.org/scripts/395092/Russian%20Cyrillic%20to%20Latvian%20transliterator.user.js
// @updateURL https://update.greasyfork.org/scripts/395092/Russian%20Cyrillic%20to%20Latvian%20transliterator.meta.js
// ==/UserScript==


/*
Based on Pridelands.ru - Polsko Rosyjska transliteracja (transkrypcja) + Tłumaczenie menu 0.7 BETA by Nitrol (https://userscripts-mirror.org./scripts/show/80413)
*/

/*
Latinify
*/
var words = {};

String.prototype.prepareRegex = function() {
    return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
    var ok = true;
    var badTags = new Array('pre', 'blockquote', 'code', 'input', 'button', 'textarea');

    for (var badTag in badTags) {
        if (tag === badTags[badTag]) {
            ok = false;
        }
        return ok;
    }
}

var regexs = [],
    replacements = [];
for (var word in words) {
    regexs.push(new RegExp(word.prepareRegex().replace(/\*/g, '[^ ]*'), 'gi'));
    replacements.push(words[word]);
}

var texts = document.evaluate("//text()[normalize-space(.)!='']", document, null, 6, null);
var text = "";
var this_text = "";
for (var i = 0, l = texts.snapshotLength;
    (this_text = texts.snapshotItem(i)); i++) {
    if (isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text = this_text.textContent)) {
        for (var x = 0; x < regexs.length; x++) text = text.replace(regexs[x], replacements[x]);
        this_text.textContent = text;
    }
}


var transliterations = {
    'A': 'A',
    'a': 'a',
    'Б': 'B',
    'б': 'b',
    'В': 'V',
    'в': 'v',
    'Г': 'G',
    'г': 'g',
    'Д': 'D',
    'д': 'd',
    'Е': 'E',
    'е': 'e',
    'Ё': 'Ē',
    'ё': 'ē',
    'Ж': 'Ž',
    'ж': 'ž',
    'З': 'Z',
    'з': 'z',
    'И': 'I',
    'и': 'i',
    'Й': 'J',
    'й': 'j',
    'К': 'K',
    'к': 'k',
    'Л': 'L',
    'л': 'l',
    'М': 'M',
    'м': 'm',
    'Н': 'N',
    'н': 'n',
    'О': 'O',
    'о': 'o',
    'П': 'P',
    'п': 'p',
    'Р': 'R',
    'р': 'r',
    'С': 'S',
    'с': 's',
    'Т': 'T',
    'т': 't',
    'У': 'u',
    'у': 'u',
    'Ф': 'F',
    'ф': 'f',
    'Х': 'Kh',
    'х': 'kh',
    'Ц': 'C',
    'ц': 'c',
    'Ч': 'Č',
    'ч': 'č',
    'Ш': 'Š',
    'ш': 'š',
    'Щ': 'Šč',
    'щ': 'šč',
    'Ъ': '--',
    'ъ': '--',
    'Ы': 'Ji',
    'ы': 'ji',
    'ь': '-',
    'Я':'Ja',
    'я':'ja',
    'Э':'E',
    'э':'e',
    'Ю':'Iu',
    'ю':'iu'
};

function defined(v) {
    return v !== undefined;
}

function translate(text) {
    if (!defined(text) || !text.match) {
        return undefined;
    }

    text = text.replace(/^\s*/, "").replace(/\s*$/, "");

    if (text === "") {
        return undefined;
    }

    var translation = "";

    for (var i = 0; i < text.length; i++) {
        var rus1 = text.charAt(i);

        var transliteration = transliterations[rus1];

        if (defined(transliteration)) {
            translation += transliteration;
        } else {
            translation += rus1;
        }
    }

    return translation;
}

function translateTree(a) {
    var items = document.evaluate("descendant::*", a, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < items.snapshotLength; i++) {
        var e = items.snapshotItem(i);

        for (var j = 0; j < e.childNodes.length; j++) {
            var elem = e.childNodes[j];

            if (elem.nodeType == 3) {
                var text = translate(elem.wholeText);
                if (defined(text)) {
                    elem.nodeValue = text;
                }
            } else {
                var text2 = translate(elem.value);
                if (defined(text2)) {
                    elem.value = text2;
                }
            }
        }
    }
}

translateTree(document.body);