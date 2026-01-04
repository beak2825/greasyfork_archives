// ==UserScript==
// @name         billwurtz questions time format converted to Swatch Internet Time
// @author       fropplewjoel
// @version      1.0
// @description  converts billwurtz's time format to Swatch Internet Time
// @match        https://billwurtz.com/questions/questions.html
// @match        https://billwurtz.com/questions/questions-*.html
// @match        https://billwurtz.com/questions/random.php
// @match        https://billwurtz.com/questions/q.php
// @grant        none
// @namespace https://greasyfork.org/users/1177654
// @downloadURL https://update.greasyfork.org/scripts/475812/billwurtz%20questions%20time%20format%20converted%20to%20Swatch%20Internet%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/475812/billwurtz%20questions%20time%20format%20converted%20to%20Swatch%20Internet%20Time.meta.js
// ==/UserScript==

(function() {
    function convertToSwatchTime(element) {
        const dcoElement = element.querySelector('dco');
        if (dcoElement) {
            const dcoContent = dcoElement.textContent;
            const [date, time] = dcoContent.split('\u00A0');
            if (date && time) {
                const timeMatch = time.match(/(\d+):(\d+)\s+([apm]+)/);
                if (timeMatch) {
                    const [hours, minutes, period] = timeMatch.slice(1);
                    let swatchTime = ((parseInt(hours, 10) * 60 + parseInt(minutes, 10)) / 60).toFixed(2);
                    if (period === 'pm') {
                        swatchTime = (parseFloat(swatchTime) + 12).toFixed(2);}
                    const swatchTimeString = `@${swatchTime}`;
                    dcoElement.textContent = date + ' ' + swatchTimeString;
                }}}}

    const h3Elements = document.querySelectorAll('h3');
    h3Elements.forEach(element => {
    convertToSwatchTime(element);
    });
})();

