// ==UserScript==
// @name         Beatport Tracklist
// @namespace    https://www.dieterholvoet.com/
// @version      1.0
// @description  Adds a button to quickly copy a tracklist of a release or chart.
// @author       Dieter Holvoet
// @match        https://www.beatport.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401349/Beatport%20Tracklist.user.js
// @updateURL https://update.greasyfork.org/scripts/401349/Beatport%20Tracklist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function copyToClipboard(text) {
        var aux = document.createElement('textarea');
        aux.innerHTML = text;
        document.body.appendChild(aux);
        aux.select();
        document.execCommand('copy');
        document.body.removeChild(aux);
    }

    function buildTrackString(element) {
        let title = `${element.querySelector('.buk-track-artists').innerText} - ${element.querySelector('.buk-track-primary-title').innerText}`;

        if (element.querySelector('.buk-track-remixed').length) {
            title += ` (${element.querySelector('.buk-track-remixed').innerText})`
        }

        return title;
    }

    function onMutation() {
        const container = document.querySelector('.interior-release-chart-content-list');
        const existingButton = document.getElementById('copy-tracklist');

        if (existingButton || !container) {
            return;
        }

        const button = htmlToElement('<button class="button button--option" id="copy-tracklist" style="">Copy tracklist</button>');

        button.addEventListener('click', function () {
            const tracklist = Array.from(document.querySelectorAll('.track'))
                .map(buildTrackString)
                .join('\n');

            copyToClipboard(tracklist);

            const oldText = 'Copy tracklist';
            const newText = 'Copied!';

            button.innerHTML = newText;
            button.classList.remove('button--option');

            window.setTimeout(function () {
                button.innerHTML = oldText;
                button.classList.add('button--option');
            }, 1000);
        });

        container.appendChild(button);
    };

    const observer = new MutationObserver(onMutation);

    observer.observe(
        document.querySelector('#pjax-target'),
         { childList: true, subtree: true },
    );

    onMutation();
})();
