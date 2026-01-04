// ==UserScript==
// @name         Woomy Translator
// @name:es      Traductor Woomy
// @name:zh-TW   嗚呦翻譯機
// @name:nl      Woomy Vertaler
// @name:ja      ウーミー翻訳機
// @name:ru      Вуми Переводчик
// @description        Translates woomy in real time
// @description:es     ¡Traduce woomy en tiempo real!
// @description:zh-TW  即時翻譯嗚呦！
// @description:nl     Vertaalt woomy in realtime!
// @description:ja     ウーミーをリアルタイムで翻訳！
// @description:ru     Переводит "Вуми" в режиме реального времени!
// @version      1.2
// @author       PowfuArras // Discord: @xskt
// @match        https://woomy.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @namespace https://greasyfork.org/users/951187
// @downloadURL https://update.greasyfork.org/scripts/471013/Woomy%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/471013/Woomy%20Translator.meta.js
// ==/UserScript==

// TODO:
// Fix specific translation issues. For example, "x42" in stats becomes "x 42 ". Probably some smart trimming will do.
// Make chat messages not translate, or atleast make it an option to disable. Not sure how I would do this. Maybe hook into color mixing and work my way backwards?

(function () {
    "use strict";

    // Allowed languages supported by Google
    const languages = [ { "language": "Afrikaans", "code": "af" }, { "language": "Albanian", "code": "sq" }, { "language": "Amharic", "code": "am" }, { "language": "Arabic", "code": "ar" }, { "language": "Armenian", "code": "hy" }, { "language": "Assamese", "code": "as" }, { "language": "Aymara", "code": "ay" }, { "language": "Azerbaijani", "code": "az" }, { "language": "Bambara", "code": "bm" }, { "language": "Basque", "code": "eu" }, { "language": "Belarusian", "code": "be" }, { "language": "Bengali", "code": "bn" }, { "language": "Bhojpuri", "code": "bho" }, { "language": "Bosnian", "code": "bs" }, { "language": "Bulgarian", "code": "bg" }, { "language": "Catalan", "code": "ca" }, { "language": "Cebuano", "code": "ceb" }, { "language": "Chinese (Simplified)", "code": "zh" }, { "language": "Chinese (Traditional)", "code": "zh-TW" }, { "language": "Corsican", "code": "co" }, { "language": "Croatian", "code": "hr" }, { "language": "Czech", "code": "cs" }, { "language": "Danish", "code": "da" }, { "language": "Dhivehi", "code": "dv" }, { "language": "Dogri", "code": "doi" }, { "language": "Dutch", "code": "nl" }, { "language": "English", "code": "en" }, { "language": "Esperanto", "code": "eo" }, { "language": "Estonian", "code": "et" }, { "language": "Ewe", "code": "ee" }, { "language": "Filipino (Tagalog)", "code": "fil" }, { "language": "Finnish", "code": "fi" }, { "language": "French", "code": "fr" }, { "language": "Frisian", "code": "fy" }, { "language": "Galician", "code": "gl" }, { "language": "Georgian", "code": "ka" }, { "language": "German", "code": "de" }, { "language": "Greek", "code": "el" }, { "language": "Guarani", "code": "gn" }, { "language": "Gujarati", "code": "gu" }, { "language": "Haitian Creole", "code": "ht" }, { "language": "Hausa", "code": "ha" }, { "language": "Hawaiian", "code": "haw" }, { "language": "Hebrew", "code": "he" }, { "language": "Hindi", "code": "hi" }, { "language": "Hmong", "code": "hmn" }, { "language": "Hungarian", "code": "hu" }, { "language": "Icelandic", "code": "is" }, { "language": "Igbo", "code": "ig" }, { "language": "Ilocano", "code": "ilo" }, { "language": "Indonesian", "code": "id" }, { "language": "Irish", "code": "ga" }, { "language": "Italian", "code": "it" }, { "language": "Japanese", "code": "ja" }, { "language": "Javanese", "code": "jv" }, { "language": "Kannada", "code": "kn" }, { "language": "Kazakh", "code": "kk" }, { "language": "Khmer", "code": "km" }, { "language": "Kinyarwanda", "code": "rw" }, { "language": "Konkani", "code": "gom" }, { "language": "Korean", "code": "ko" }, { "language": "Krio", "code": "kri" }, { "language": "Kurdish", "code": "ku" }, { "language": "Kurdish (Sorani)", "code": "ckb" }, { "language": "Kyrgyz", "code": "ky" }, { "language": "Lao", "code": "lo" }, { "language": "Latin", "code": "la" }, { "language": "Latvian", "code": "lv" }, { "language": "Lingala", "code": "ln" }, { "language": "Lithuanian", "code": "lt" }, { "language": "Luganda", "code": "lg" }, { "language": "Luxembourgish", "code": "lb" }, { "language": "Macedonian", "code": "mk" }, { "language": "Maithili", "code": "mai" }, { "language": "Malagasy", "code": "mg" }, { "language": "Malay", "code": "ms" }, { "language": "Malayalam", "code": "ml" }, { "language": "Maltese", "code": "mt" }, { "language": "Maori", "code": "mi" }, { "language": "Marathi", "code": "mr" }, { "language": "Meiteilon (Manipuri)", "code": "mni-Mtei" }, { "language": "Mizo", "code": "lus" }, { "language": "Mongolian", "code": "mn" }, { "language": "Myanmar (Burmese)", "code": "my" }, { "language": "Nepali", "code": "ne" }, { "language": "Norwegian", "code": "no" }, { "language": "Nyanja (Chichewa)", "code": "ny" }, { "language": "Odia (Oriya)", "code": "or" }, { "language": "Oromo", "code": "om" }, { "language": "Pashto", "code": "ps" }, { "language": "Persian", "code": "fa" }, { "language": "Polish", "code": "pl" }, { "language": "Portuguese (Portugal, Brazil)", "code": "pt" }, { "language": "Punjabi", "code": "pa" }, { "language": "Quechua", "code": "qu" }, { "language": "Romanian", "code": "ro" }, { "language": "Russian", "code": "ru" }, { "language": "Samoan", "code": "sm" }, { "language": "Sanskrit", "code": "sa" }, { "language": "Scots Gaelic", "code": "gd" }, { "language": "Sepedi", "code": "nso" }, { "language": "Serbian", "code": "sr" }, { "language": "Sesotho", "code": "st" }, { "language": "Shona", "code": "sn" }, { "language": "Sindhi", "code": "sd" }, { "language": "Sinhala (Sinhalese)", "code": "si" }, { "language": "Slovak", "code": "sk" }, { "language": "Slovenian", "code": "sl" }, { "language": "Somali", "code": "so" }, { "language": "Spanish", "code": "es" }, { "language": "Sundanese", "code": "su" }, { "language": "Swahili", "code": "sw" }, { "language": "Swedish", "code": "sv" }, { "language": "Tagalog (Filipino)", "code": "tl" }, { "language": "Tajik", "code": "tg" }, { "language": "Tamil", "code": "ta" }, { "language": "Tatar", "code": "tt" }, { "language": "Telugu", "code": "te" }, { "language": "Thai", "code": "th" }, { "language": "Tigrinya", "code": "ti" }, { "language": "Tsonga", "code": "ts" }, { "language": "Turkish", "code": "tr" }, { "language": "Turkmen", "code": "tk" }, { "language": "Twi (Akan)", "code": "ak" }, { "language": "Ukrainian", "code": "uk" }, { "language": "Urdu", "code": "ur" }, { "language": "Uyghur", "code": "ug" }, { "language": "Uzbek", "code": "uz" }, { "language": "Vietnamese", "code": "vi" }, { "language": "Welsh", "code": "cy" }, { "language": "Xhosa", "code": "xh" }, { "language": "Yiddish", "code": "yi" }, { "language": "Yoruba", "code": "yo" }, { "language": "Zulu", "code": "zu" } ];
    let currentLanguage = languages[languages.findIndex(language => language.code === "en")];

    // A map to store translations, so we dont need to retranslate every time we need to draw text
    const cache = new Map();

    // Native drawing functions, used to actually draw text later
    const natives = {
        fillText: CanvasRenderingContext2D.prototype.fillText,
        strokeText: CanvasRenderingContext2D.prototype.strokeText,
        measureText: CanvasRenderingContext2D.prototype.measureText,
        fillTextOffscreen: OffscreenCanvasRenderingContext2D.prototype.fillText,
        strokeTextOffscreen: OffscreenCanvasRenderingContext2D.prototype.strokeText,
        measureTextOffscreen: OffscreenCanvasRenderingContext2D.prototype.measureText
    };

    // Regex stuff that helps us with identifying numbers and sentences
    const regex = {
        isNumber: /^\d+(?:\.\d+)?(?:[a-zA-Z]{1,2})?$/,
        chunks: /(\d+(?:\.\d+)?(?:[a-zA-Z]{1,2})?)/g
    };
    const util = {
        isNumber: text => regex.isNumber.test(text),
        chunkify: text => text.split(regex.chunks).filter(Boolean)
    };

    // Hook into text drawing apply our own modifications
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
        natives.fillText.call(this, transmutateText(text), x, y, maxWidth);
    };
    CanvasRenderingContext2D.prototype.strokeText = function (text, x, y, maxWidth) {
        natives.strokeText.call(this, transmutateText(text), x, y, maxWidth);
    };
    CanvasRenderingContext2D.prototype.measureText = function (text) {
        return natives.measureText.call(this, transmutateText(text));
    };
    OffscreenCanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
        natives.fillTextOffscreen.call(this, transmutateText(text), x, y, maxWidth);
    };
    OffscreenCanvasRenderingContext2D.prototype.strokeText = function (text, x, y, maxWidth) {
        natives.strokeTextOffscreen.call(this, transmutateText(text), x, y, maxWidth);
    };
    OffscreenCanvasRenderingContext2D.prototype.measureText = function (text) {
        return natives.measureTextOffscreen.call(this, transmutateText(text));
    };

    // Translate a string into our desired language.
    // Stores it in cache after the fact
    function translate(text) {
        // If we have not came across this text yet...
        if (!cache.has(text)) {
            // Placeholder while we wait for Google.
            cache.set(text, "...");

            // Finally, actually translate the text.
            // Send a post request to google translate api and then parse it into something we can use.
            fetch(`https://translate.googleapis.com/translate_a/single?${new URLSearchParams({
                client: "gtx",
                sl: "en",
                tl: currentLanguage.code,
                dt: "t",
                dj: "1",
                source: "input",
                q: text,
            })}`).then(function (data) {
                return data.json();
            }).then(function (json) {
                // Score!
                cache.set(text, json.sentences.reduce((acc, value) => `${acc}${value.trans}`, ""));
            });
        }

        // Return text from cache
        return cache.get(text);
    }

    // Apply transmutations to text for translation
    function transmutateText(text) {
        // We dont need to do anything with this :D
        if (text.length === 0) return text;
        if (util.isNumber(text)) return text;

        // Split the text into multiple chunks of numbers and strings
        const chunks = util.chunkify(text);
        let output = "";

        // For each chunk...
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            // If it is a number, than dont do anything
            // else translate it and append it to our output
            if (util.isNumber(chunk)) output += ` ${chunks[i]} `;
            else output += translate(chunk);
        }
        return output;
    }

    // Constantly try to hook into the settings menu, and once it does clear the interval
    window.addEventListener("load", function () {
        const interval = setInterval(function () {
            // Try, try try try!
            try {
                // Create our own little element for the settings menu
                const element = document.getElementById("Woomy_backgroundAnimation").parentElement.cloneNode(true);

                // We got it now, clear that mf!
                clearInterval(interval);

                // Make it fancy
                const select = element.children[0];
                element.childNodes[0].textContent = "Language: ";
                select.style.maxWidth = "140px";
                select.id = "PowfuArras_language";

                // Apply the valid languages
                select.innerHTML = languages.map(language => `<option value=${language.code}>${language.language}</option>`);

                // Listen in for the user trying to change it
                // When they do, clear the cache and update the current language
                select.addEventListener("change", function (event) {
                    cache.clear();
                    currentLanguage = languages[languages.findIndex(language => language.code === event.target.value)];
                });

                // Set default
                element.children[0].selectedIndex = languages.findIndex(language => language.code === currentLanguage.code);
                element.dispatchEvent(new Event("change"));

                // Insert it into the settings menu
                document.querySelectorAll(".optionsFlexHolder")[0].appendChild(element);
            } catch (error) {}
        }, 100);
    });
})();