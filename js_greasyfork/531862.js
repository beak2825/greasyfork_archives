// ==UserScript==
// @name         WorldTime Whisperer
// @namespace    https://greasyfork.org/en/users/1451802
// @version      1.2
// @description  Turns foreign times into familiar ones, instantly.
// @description:de Wandelt fremde Zeiten sofort in deine lokale Zeit um.
// @description:es Convierte tiempos extranjeros en horas locales al instante.
// @description:fr Transforme instantanément les heures étrangères en heures locales.
// @description:it Converte istantaneamente gli orari stranieri in orari locali.
// @description:ru Мгновенно превращает чужое время в ваше местное.
// @description:zh-CN 即时将外国时间转换为本地时间。
// @description:zh-TW 即時將外國時間轉換為本地時間。
// @description:ja 外国の時間を瞬時にあなたの現地時間に変換します。
// @description:ko 해외 시간을 즉시 현지 시간으로 변환합니다.
// @description:hi विदेशी समय को तुरंत स्थानीय समय में बदलता है।
// @description:sv Förvandlar främmande tider till lokal tid direkt.
// @description:nl Zet buitenlandse tijden onmiddellijk om naar je lokale tijd.
// @description:pt Converte horários estrangeiros para o seu local instantaneamente.
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon https://www.svgrepo.com/show/476947/timezone.svg
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      brave
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531862/WorldTime%20Whisperer.user.js
// @updateURL https://update.greasyfork.org/scripts/531862/WorldTime%20Whisperer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timezoneOffsets = {
        "PST": -8, "PDT": -7, "MST": -7, "MDT": -6,
        "CDT": -5, "EST": -5, "EDT": -4,
        "UTC": 0, "GMT": 0, "BST": 1,
        "CET": 1, "CEST": 2, "EET": 2, "EEST": 3,
        "IST": 5.5, "JST": 9, "AEST": 10, "AEDT": 11,
        "ACST": 9.5, "ACDT": 10.5, "HKT": 8, "SGT": 8,
        "NZST": 12, "NZDT": 13
    };

    const lang = (navigator.language || "en").slice(0,2).toLowerCase();
    if (lang === "zh") {
        timezoneOffsets["CST"] = 8;
    } else {
        timezoneOffsets["CST"] = -6;
    }

    const localMsgs = {
        "en": "Local time:", "fr": "Heure locale:", "de": "Ortszeit:",
        "es": "Hora local:", "it": "Ora locale:", "pt": "Hora local:",
        "nl": "Lokale tijd:", "sv": "Lokal tid:", "ru": "Местное время:",
        "ja": "現地時間:", "zh": "本地时間:", "ko": "현지 시간:",
        "hi": "स्थानीय समय:"
    };
    const timeLabel = localMsgs[lang] || "Local time:";

    const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false
    });

    const timeRegex = /\b(\d{1,2})[\s]*[:.:：꞉·]?[\s]*(\d{1,2})?(?:[:.:：꞉·](\d{2}))?\s*(AM|PM|am|pm)?\s*([A-Za-z]{2,4})(?=\s|$|[.,!?;:"'(){}\[\]])/g;

    function convert(match, h, m, s, period, tz) {
        if (!tz) return match;
        tz = tz.toUpperCase();
        if (!(tz in timezoneOffsets)) return match;

        h = parseInt(h, 10);
        m = parseInt(m || "0", 10);
        s = parseInt(s || "0", 10);

        if (period) {
            period = period.toUpperCase();
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
        }

        const offset = timezoneOffsets[tz];
        const offsetHours = Math.trunc(offset);
        const offsetMinutes = Math.round((offset - offsetHours) * 60);

        const d = new Date();
        d.setUTCHours(h - offsetHours, m - offsetMinutes, s, 0);

        const formatted = formatter.format(d);

        return `${match} 🕒 [${timeLabel} ${formatted}]`;
    }

    const ignoreTags = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA']);
    function walk(node) {
        if (!node || node.nodeType === 9) return;

        if (node.nodeType === 3) {
            try {
                const before = node.nodeValue;
                const after = before.replace(timeRegex, convert);
                if (after !== before) node.nodeValue = after;
            } catch(e) { }
            return;
        }

        if (node.nodeType === 1) {
            if (ignoreTags.has(node.tagName)) return;
            if (node.tagName === 'IFRAME' || node.tagName === 'FRAME') return;

            for (let child = node.firstChild; child; child = child.nextSibling) {
                walk(child);
            }
        }
    }

    walk(document.body);

    new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(n => {
                if (!n || n.nodeType === 9) return;
                walk(n);
            });
        });
    }).observe(document.body, { childList: true, subtree: true });

})();