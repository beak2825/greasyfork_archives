// ==UserScript==
// @name         Facebook Unsponsored
// @version      3.3
// @namespace    AAAAAAAA.com
// @description  A supplement for an adblocker
// @author       ducktrshessami
// @match        *://www.facebook.com/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371822/Facebook%20Unsponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/371822/Facebook%20Unsponsored.meta.js
// ==/UserScript==

(function () {
    var language = document.documentElement.lang; // Borrowing some stuff from solskido's Facebook unsponsored
    var sponsorText = {
        'af': ['Geborg'],
        'am': ['የተከፈለበት ማስታወቂያ'],
        'ar': ['إعلان مُموَّل'],
        'as': ['পৃষ্ঠপোষকতা কৰা'],
        'ay': ['Yatiyanaka'],
        'az': ['Sponsor dəstəkli'],
        'be': ['Рэклама'],
        'bg': ['Спонсорирано'],
        'br': ['Paeroniet'],
        'bs': ['Sponzorirano'],
        'bn': ['সৌজন্যে'],
        'ca': ['Patrocinat'],
        'cb': ['پاڵپشتیکراو'],
        'co': ['Spunsurizatu'],
        'cs': ['Sponzorováno'],
        'cx': ['Giisponsoran'],
        'cy': ['Noddwyd'],
        'da': ['Sponsoreret'],
        'de': ['Gesponsert'],
        'el': ['Χορηγούμενη'],
        'en': ['Sponsored', 'Chartered'],
        'eo': ['Reklamo'],
        'es': ['Publicidad', 'Patrocinado'],
        'et': ['Sponsitud'],
        'eu': ['Babestua'],
        'fa': ['دارای پشتیبانی مالی'],
        'fi': ['Sponsoroitu'],
        'fo': ['Stuðlað'],
        'fr': ['Commandité', 'Sponsorisé'],
        'fy': ['Sponsore'],
        'ga': ['Urraithe'],
        'gl': ['Patrocinado'],
        'gn': ['Oñepatrosinapyre'],
        'gx': ['Χορηγούμενον'],
        'hi': ['प्रायोजित'],
        'hu': ['Hirdetés'],
        'id': ['Bersponsor'],
        'it': ['Sponsorizzata'],
        'ja': ['広告'],
        'jv': ['Disponsori'],
        'kk': ['Демеушілік көрсеткен'],
        'km': ['បានឧបត្ថម្ភ'],
        'lo': ['ໄດ້ຮັບການສະໜັບສະໜູນ'],
        'mk': ['Спонзорирано'],
        'ml': ['സ്പോൺസർ ചെയ്തത്'],
        'mn': ['Ивээн тэтгэсэн'],
        'mr': ['प्रायोजित'],
        'ms': ['Ditaja'],
        'ne': ['प्रायोजित'],
        'nl': ['Gesponsord'],
        'or': ['ପ୍ରଯୋଜିତ'],
        'pa': ['ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ'],
        'pl': ['Sponsorowane'],
        'ps': ['تمويل شوي'],
        'pt': ['Patrocinado'],
        'ru': ['Реклама'],
        'sa': ['प्रायोजितः |'],
        'si': ['අනුග්‍රහය දක්වන ලද'],
        'so': ['La maalgeliyey'],
        'sv': ['Sponsrad'],
        'te': ['స్పాన్సర్ చేసినవి'],
        'th': ['ได้รับการสนับสนุน'],
        'tl': ['May Sponsor'],
        'tr': ['Sponsorlu'],
        'tz': ['ⵉⴷⵍ'],
        'uk': ['Реклама'],
        'ur': ['تعاون کردہ'],
        'vi': ['Được tài trợ'],
        'zh-Hans': ['赞助内容'],
        'zh-Hant': ['贊助']
    };
    var headerText = [ // Sorry this doesn't have localization. Feel free to edit this array as you see fit.
        "Coronavirus (COVID-19) Information",
        "Happening Now",
        "Paid for by",
        "Similar to Posts You've Interacted With",
        "Suggested Live",
        "Suggested Page to Follow",
        "Suggested for You",
        "Suggested Events"
    ];

    function textAssemble(elem) {
        return $(elem)
            .contents()
            .filter(function () {
            return this.nodeType == 3;
        })
            .add($("*", elem)
                 .filter(function () {
            let jq = $(this);
            return jq.is(":visible") && this.childNodes.length === 1 && this.childNodes[0].nodeType == 3 && jq.css("position") == "relative";
        })
                )
            .text();
    }

    async function hitlist() {
        list = $("span:parent:visible,div:parent:visible").filter(function () {
            if (this.getBoundingClientRect().bottom > 0) {
                let text = textAssemble(this).trim();
                return sponsorText[language].includes(text) || sponsorText[language].some(sponsor => text.includes(sponsor));
            }
        });
    }

    function side() { // Things to hide once at the start
        let foo = $(single_selector).has(list);
        if (foo.length) {
            foo.hide();
        }
    }

    function helpthething() { // Help filter posts
        if (this.getBoundingClientRect().bottom > 0) {
            let subtitle, header;
            subtitle = Boolean($(this).has(list).length);
            header = Boolean($(header_selector, this).length);
            return subtitle || header;
        }
    }

    function dothething() { // Get and hide posts
        let targets = $("[role='feed'] > div[data-pagelet]:visible").filter(helpthething);
        side();
        if (targets.length) {
            targets.remove();
            console.log("Target(s) destroyed");
        }
    }

    function withCooldown(callback, ms) {
        let ready = true;
        return function (...params) {
            if (ready) {
                ready = false;
                setTimeout(() => {
                    ready = true;
                }, ms);
                return callback(...params);
            }
        };
    }

    function main() {
        if ($("[role='feed']").length) {
            getHitlist();
            doThing();
        }
    }

    var list = $();
    var getHitlist = withCooldown(hitlist, 1000);
    var doThing = withCooldown(dothething, 500);
    var observer = new MutationObserver(main);
    var single_selector = "[data-pagelet='RightRail'] > div:visible";
    // var label_selector = sponsorText[language].map(text => "a[aria-label='" + text + "']:visible").join(", ") + ", a > span[aria-labelledby]:visible"; // Store parsed selectors for continuous use
    var header_selector = headerText.map(text => "div:first-child:not(:only-child):contains('" + text + "'):visible").join(", ");

    observer.observe(document.body, { // Wait for page change
        childList: true,
        subtree: true
    });
})();
