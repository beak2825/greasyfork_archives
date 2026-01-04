// ==UserScript==
// @name         NBA.com Time Zone Converter (ET to CET)
// @name:en      NBA.com Time Zone Converter (ET to CET)
// @name:fr      Convertisseur de fuseau horaire NBA.com (ET vers CET)
// @name:es      Conversor de zona horaria de NBA.com (ET a CET)
// @name:de      NBA.com Zeitzone Konverter (ET zu CET)
// @name:it      Convertitore di fusi orari di NBA.com (ET a CET)
// @name:pt      Conversor de fuso horário da NBA.com (ET para CET)
// @name:nl      NBA.com Tijdzone Converter (ET naar CET)
// @name:pl      Konwerter strefy czasowej NBA.com (ET do CET)
// @name:sk      Pretvornik časovnega pasu NBA.com (ET v CET)
// @name:sr      Konvertor vremenske zone NBA.com (ET u CET)

// @description  Automatically converts time from Eastern Time (ET) to Central European Time (CET) within the header.
// @description:en Automatically converts time from Eastern Time (ET) to Central European Time (CET) within the header.
// @description:fr Convertit automatiquement l'heure de l'heure de l'Est (ET) à l'heure d'Europe centrale (CET) dans l'en-tête.
// @description:es Convierte automáticamente la hora de Eastern Time (ET) a Central European Time (CET) dentro del encabezado.
// @description:de Konvertiert automatisch die Zeit von Eastern Time (ET) in Mitteleuropäische Zeit (CET) im Header.
// @description:it Converte automaticamente l'ora da Eastern Time (ET) a Central European Time (CET) nell'intestazione.
// @description:pt Converte automaticamente o horário do Eastern Time (ET) para o Central European Time (CET) dentro do cabeçalho.
// @description:nl Converteert automatisch tijd van Eastern Time (ET) naar Central European Time (CET) binnen de header.
// @description:pl Automatycznie konwertuje czas z Eastern Time (ET) na Central European Time (CET) w nagłówku.
// @description:sk Samodejno pretvori čas iz Eastern Time (ET) v Central European Time (CET) znotraj glave.
// @description:sr Automatski konvertuje vreme iz Eastern Time (ET) u Central European Time (CET) unutar zaglavlja.

// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @author       Beurreboule
// @match        https://www.nba.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494094/NBAcom%20Time%20Zone%20Converter%20%28ET%20to%20CET%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494094/NBAcom%20Time%20Zone%20Converter%20%28ET%20to%20CET%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertETtoUTCPlus1(timeString) {
        const isDaylightSaving = () => {
            const today = new Date();
            const jan = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
            const jul = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
            return Math.max(jan, jul) != today.getTimezoneOffset();
        };

        const offset = isDaylightSaving() ? 5 : 6;
        const match = timeString.match(/(\d{1,2}):(\d{2})\s*([AP]M)\s*ET/i);
        if (!match) return timeString;

        let [_, hours, minutes, meridiem] = match;
        hours = parseInt(hours);
        minutes = parseInt(minutes);

        if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;

        hours += offset;
        if (hours >= 24) hours -= 24;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (CET)`;
    }

    function getTimeElements() {
        return document.querySelectorAll(".ScoreStripGame_gameInfoText__tlx_V, .ScheduleStatusText_base__Jgvjb, .GameCardMatchupStatusText_gcsText__PcQUX");
    }

    function getBroadcasterElements() {
        return document.querySelectorAll(".ScoreStripGame_broadcasters__NU0f2");
    }

    function applyNewInfo() {
        let elementsTime = getTimeElements();
        elementsTime.forEach(element => {
            const originalTime = element.textContent;
            const newTime = convertETtoUTCPlus1(originalTime);
            element.textContent = newTime;
        });

        let elementsBroadcaster = getBroadcasterElements();
        elementsBroadcaster.forEach(element => {
            element.style.display = 'none';
        });
    }

    window.addEventListener("load", applyNewInfo);
})();
