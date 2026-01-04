// ==UserScript==
// @name         Simgrid ICS export
// @version      2025-01-28
// @license      MIT
// @namespace    ap-simgrid-ics-export
// @description  Provided as-is, no future support :>
// @author       Arsen Petrosian
// @match        https://www.thesimgrid.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thesimgrid.com
// @require      https://cdn.jsdelivr.net/npm/ics-browser-gen@0.1.3/ics.deps.min.js
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525150/Simgrid%20ICS%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/525150/Simgrid%20ICS%20export.meta.js
// ==/UserScript==

(function() {
    let createdButton = null;

    Date.prototype.addMinutes = function(m) {
        this.setTime(this.getTime() + (m*60*1000));
        return this;
    }

    function exportIcs() {
        const url = document.location.href
        const title = document.querySelector('h1').textContent.trim()

        const cal = ics();
        const races = document.querySelectorAll('.event-block')
        for(const race of races) {
            const dataItems = race.querySelectorAll('[aria-labelledby="information-tab"] .list-group-item')

            const track = [...dataItems].find(item => item.querySelector('dt').innerText.trim().toLowerCase() === 'track')
            const trackName = track ? track.querySelector('dd').innerText.trim() : ''

            const duration = [...dataItems].find(item => item.querySelector('dt').innerText.trim().toLowerCase() === 'duration')
            const durationMins = duration ? duration.querySelector('dd').innerText.trim().split(' ')[0] : ''

            const raceName = race.querySelector('h4').textContent.trim().toUpperCase()
            const time = race.querySelector('time').attributes.datetime.value
            const endTime = (new Date(time)).addMinutes(durationMins ? (+durationMins + 60) : 180)
            cal.addEvent(`${trackName || raceName} | ${title}`, `${raceName} ${url}`, '', time, endTime.toISOString());
        }
        cal.download();
        GM_openInTab ('https://calendar.google.com/calendar/r/settings/export', { active: true });
    }

    function triggerRecheck() {
        console.log(document.querySelector('meta[property="og:url"]').attributes.content.value, window.location.href)
        if (window.location.href.includes('/races')) {
            if (!createdButton) {
                createdButton = document.createElement('li');
                createdButton.className = 'nav-item';
                createdButton.innerHTML = `<a class="nav-link " href="#">Export .ics</a>`
                setTimeout(() => {
                    document.querySelector('.nav').appendChild(createdButton);
                }, 1000) // Yes, I don't care


                createdButton.addEventListener('click', async (e) => {
                    e.preventDefault()
                    exportIcs();
                });
            }
        } else {
            if (createdButton) {
                createdButton.removeEventListener
                createdButton.remove();
                createdButton = null;
            }
        }
    }

    new MutationObserver(triggerRecheck)
        .observe(
        document.querySelector('head'), {
            attributes: true, childList: true, subtree: true
        }
    );

    triggerRecheck();
})()
