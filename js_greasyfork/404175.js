// ==UserScript==
// @name         NUEIP Optimization
// @namespace    https://mmis1000.me/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://cloud.nueip.com/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404175/NUEIP%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/404175/NUEIP%20Optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BOOTSTRAP_DELAY = 2 * 1000;
    const TIME_ZONE = '+08:00';

    const TOTAL = 9 * 60 * 60 * 1000 + 60 * 1000;

    function timeToJSDate (time) {
        const a = new Date()
        const str = `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, '0')}-${String(a.getDate()).padStart(2, '0')}T${time}${TIME_ZONE}`
        return new Date(str)
    }

    function getCheckIn() {
        return [...document.querySelectorAll('#clockin')].map(i => i.textContent.replace('上班', '')).filter(i => i)[0]
    }


    function getClockTime() {
        const time = [...document.querySelectorAll('.clock_time')].map(i => i.textContent).filter(i => i)[0]

        return time
    }

    function setup () {
        console.log(timeToJSDate(getCheckIn()))
        console.log(timeToJSDate(getClockTime()))

        const tick = () => {
            const checkInStr = getCheckIn()
            if (!checkInStr) {
                return
            }

            const checkIn = timeToJSDate(getCheckIn())
            const current = timeToJSDate(getClockTime())

            const diff =current - checkIn

            // console.log(diff)

            if (diff < TOTAL) {
                [...document.querySelectorAll('#clockout')].forEach(i => {
                    i.style.backgroundColor = 'red'
                })
            } else {
                [...document.querySelectorAll('#clockout')].forEach(i => {
                    i.style.backgroundColor = 'green'
                })
            }
        }

        tick()

        setInterval(tick, 5 * 1000)
    }

    setTimeout(setup, BOOTSTRAP_DELAY)
    // Your code here...
})();