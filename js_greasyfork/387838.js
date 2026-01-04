// ==UserScript==
// @name         OLX 1-click report
// @namespace    https://olx.pl/
// @version      1.0
// @description  Zgłaszanie przygłupów za manipulację tytułem oferty na OLX
// @author       ( ͡° ͜ʖ ͡°)
// @match        https://www.olx.pl/oferta/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387838/OLX%201-click%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/387838/OLX%201-click%20report.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const reportReasonText = 'Manipulacja słowami kluczowymi w tytule oferty';

    const buttonContainer = document.querySelector('#offeractions');
    const reportOfferBtn = document.querySelector('#reportMe');
    const reportReasonRadio = document.querySelector('#reason-badCategory');
    const reportReasonTextarea = document.querySelector('#report-textarea');
    const reportSubmit = document.querySelector('#report-submit');

    const reportNowBtn = document.createElement("a");
    const reportNowBtnText = document.createTextNode("Zgłoś pajaca");
    reportNowBtn.appendChild(reportNowBtnText);

    reportNowBtn.style.display = 'block';
    reportNowBtn.style.backgroundColor = 'red';
    reportNowBtn.style.padding = '10px';
    reportNowBtn.style.marginBottom = '10px';

    reportNowBtn.style.fontSize = '1rem';
    reportNowBtn.style.fontWeight = 'bolder';
    reportNowBtn.style.textAlign = 'center';
    reportNowBtn.style.color = 'white';
    reportNowBtn.style.textTransform = 'uppercase';
    reportNowBtn.style.textDecoration = 'none';
    reportNowBtn.style.border = 'none';

    reportNowBtn.addEventListener("click", () => {
        reportOfferBtn.click();
        reportReasonRadio.click();
        reportReasonTextarea.value = reportReasonText;
        reportSubmit.click();
    }, false);

    buttonContainer.insertBefore(reportNowBtn, buttonContainer.firstChild);
})();