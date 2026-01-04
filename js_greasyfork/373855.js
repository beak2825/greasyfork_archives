// ==UserScript==
// @name         Kubernetes nice dates
// @namespace    Broentech
// @version      0.2
// @description  Nice date formatting for k8s logs that have timestamps enabled.
// @author       Anders Larsen
// @match        http://127.0.0.1:8001
// @match        https://127.0.0.1:8001
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373855/Kubernetes%20nice%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/373855/Kubernetes%20nice%20dates.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('K8s nice dates loaded.');

    let dateFormat = 'YYYY-MM-DD | HH:mm:ss.SSSS';
    async function importMoment() {
        let deferred = {};

        let promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });

        if (!window.moment) {
            let moment = document.createElement('script');
            moment.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
            document.head.appendChild(moment);

            moment.addEventListener('load', function() {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
            return promise;
        }

        return promise;
    }

    function getLogLineElements() {
        let logElements = []
        let logElementElements = document.querySelectorAll('.kd-logs-element');
        let logLineElements = document.querySelectorAll('.kd-log-line');

        for (let e of logElementElements) {
            logElements.push(e);
        }

        for (let e of logLineElements) {
            logElements.push(e);
        }

        return logElements;
    }

    let timestampsToggled = false;
    function enableTimestamps() {
        if (timestampsToggled) {
            return;
        }

        let timestampButton;

		for(let button of document.querySelectorAll('.kd-logs-toolbar-button')) {
			if (button.getAttribute('ng-click') === 'ctrl.onShowTimestamp()') {
                timestampsToggled = true;
                timestampButton = button;
                break;
			}
		}

        if (timestampButton) {
            timestampButton.click();
        }
	}

    async function fixDates() {
        console.time('fixDates time');
        await importMoment();
        enableTimestamps();

        let logElements = getLogLineElements();

        for (let e of logElements) {
            let logLineText = e.innerText;

            let split = logLineText.split('Z ');
            //console.log('Split:', split);

            if (split.length === 0) {
                continue;
            }
            //console.log(split[0] + 'Z');
            //console.log(new Date(split[0] + 'Z').toString());
            if (new Date(split[0] + 'Z').toString() === 'Invalid Date') {
                continue;
            }

            let lineDate = moment.utc(split[0] + 'Z');

            e.innerHTML = `<span style="color: limegreen;">[${lineDate.format(dateFormat)}] </span> ${split[1]}`;
        }

        console.timeEnd('fixDates time');
    }


    let dateFixInterval = setInterval(fixDates, 1000);
})();