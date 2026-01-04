// ==UserScript==
// @name         Svitla ID Tools
// @namespace    http://id.svitla.com
// @version      0.2
// @description  Adds a button to put 8 hours for all days not marked as holidays or days off
// @author       Artem Pylypchuk <a.pylypchuk@svitla.com>
// @match        https://id.svitla.com/users/*/calendar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_notification
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455359/Svitla%20ID%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/455359/Svitla%20ID%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        console.log("Adding extra button to UI")
        addButton('Fill entire month', selectDays)
    })

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', top: '7%', left:'90%', 'z-index': 3, class: 'btn-secondary'}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    async function loadProjectFromDate(date) {
        let iframe = document.createElement('iframe');
        iframe.src = `https://id.svitla.com/time_entries/new?date=${date}`;
        const promise = new Promise((resolve, reject) => {
            iframe.addEventListener('load', () => {
                try {
                    const {value: id, text: name} =  iframe.contentDocument.querySelector("#time_entry_project_id optgroup option");
                    const user = iframe.contentDocument.getElementById('time_entry_user_id').value;
                    const token = document.querySelector("input[name='authenticity_token']").value;
                    iframe.remove();

                    resolve({
                        id,
                        name,
                        user,
                        token
                    });
                } catch (err) {
                    console.log("error finding project", err);
                    reject(err);
                }
            });

            iframe.addEventListener('error', (err) => {
               reject(err);
            });
        });

        document.body.appendChild(iframe);

        return promise;
    }

    async function submitDate(date, options) {
        const {token, user, id} = options;
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: "https://id.svitla.com/time_entries",
                data: `utf8=%E2%9C%93&authenticity_token=${encodeURIComponent(token)}&time_entry%5Buser_id%5D=${user}&time_entry%5Bdate%5D=${date}&time_entry%5Bdescription%5D=&time_entry%5Bproject_id%5D=${id}&time_entry%5Bhuman_time%5D=8h&commit=Enter+time`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    if (response.status != 200) {
                        reject("Error saving time");
                    } else resolve();
                }
            });
        });
    }

    async function selectDays() {
        const days = [...document.getElementsByClassName('day')]
            .filter(isWeekend)
            .filter(isOtherMonth)
            .filter(isHoliday)
            .filter(isEntered);

        const dates = days.map(element => element.querySelector('div.cell-header').getAttribute('data-date'));
        const [first] = dates;
        const project = await loadProjectFromDate(first);
        console.log("Filling in for project", project);

        await Promise.all(dates.map(date => submitDate(date, project)));

        GM_notification(`${dates.length} days filled in`);
        window.location.reload();
    }

    function isWeekend(element) {
        return !element.classList.contains('weekend');
    }

    function isOtherMonth(element) {
        return !element.classList.contains('otherMonth');
    }

    function isHoliday(element) {
        return !element.classList.contains('holiday');
    }

    function isEntered(element) {
        return !element.querySelector("div.time-entries");
    }
})();