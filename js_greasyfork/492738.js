// ==UserScript==
// @name         LMVZ Digital Hack Ultimate
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  Lässt jedes Quiz gelöst aussehen.
// @author       Claimingnine
// @match        https://*.lmvz.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lmvz.ch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492738/LMVZ%20Digital%20Hack%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/492738/LMVZ%20Digital%20Hack%20Ultimate.meta.js
// ==/UserScript==

function start() {
    var buttons = document.querySelectorAll('.buttons.exercise');
    buttons.forEach(function(button) {
        var score = button.getAttribute('data-quiz-score');
        if (score === '' || score === '0' || score === '1' || score === '2' || !score) {
            button.setAttribute('data-quiz-score', '2');
        }
    });

    var element = document.querySelector('.col-auto img[src="https://004.lmvz.ch/disdonc/images/hand-bad.svg"]');
    if (element) {
        element.setAttribute('src', 'https://004.lmvz.ch/disdonc/images/hand-good.svg');
    }

    var elements = document.querySelectorAll('.point.-question.-answered.-wrong');
    elements.forEach(function(element) {
        element.classList.remove('-wrong');
        element.classList.add('-correct');
    });

    var feedbackContainer = document.querySelector('[js="feedback-container"]');
    if (feedbackContainer) {
        feedbackContainer.classList.remove('-v', '-wrong');
        feedbackContainer.classList.add('-correct');
        var feedbackText = feedbackContainer.querySelector('.padding-box p');
        if (feedbackText) {
            feedbackText.innerHTML = 'C’est juste.';
        }
    }

    var feedbackIcon = document.querySelector('[js="feedback-icon"]');
    if (feedbackIcon) {
    }

    var teleportView = document.querySelector('[view="TeleportView"]');
    if (teleportView) {
        teleportView.remove();
    }

    setTimeout(start, 0);
}

start();
