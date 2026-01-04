// ==UserScript==
// @name         F5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add F5 For MacOS
// @author       Yin
// @match        *://*/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/wAALCABAAGABAREA/8QAGwABAQEBAAMBAAAAAAAAAAAAAAgHAgEEBgP/xAAzEAABAwMCBAQEBAcAAAAAAAABAgMEAAURBgcIEiExE0FRcRQiUmIVYYGCIyQyQkNyof/aAAgBAQAAPwCy6UpSlKUpSlKUrlxaG0KWtQSlIySTgAetTlu1xdaG0pNftemIjuq57RKVusPBqIlXoHcEr/aCPurLhxfbqyEmZC29tKoPcK+GlL6f7hQH/K+0214z9N3OY3A1zYH7ApSuUzYzhkMJPqtOAtI9uaqhs1zt94tce6WqbHnQZKA4xIYcC23EnzSodCK9ulKUpSo641N0L7ftXR9ktCF9x+Sttq6fDq+eQ65jkjA+SQCFL9cgHACs6hsDw2aO2/tcaffIUTUGplJC3pUhsOMx1fSwhQwAPrI5j36A4G6JSlKQlIwAMADoBWZ7xbHaC3LtzybramYV1KT4N1htpRIbV5FRHRxP2qz+WD1qXtltXap4dN6nNsdayefTc6QkFZUfBb8Q4bltZ7JPZY/I56oq7s0pSlK4fcS0yt1ZwlCSo+w61DvA1DTrbf8A1Xr+6jx5UZt2U2VdeV+S6RzD2QHB+tXLSsd4rtw9cbb6Hh37RtljT0CXy3CRIaU6iM1j5SUpUCApXy8xOB27kVLnE3uRpHeLavT+rYSG7dqu0y/g7jblr/ieC6hSudB/yNhaBg90lZBAyCfci74br7mXvQ2h9t5U22zIcOO3NfSR/MyEJSHXnj1wykDPKe+TnJKQL3aCw2kLIKsDJAwCfauqUpXDzaXWVtLGUrSUn2PSod4Gpg0VxAar0BdT4EmS27FbCunM9GdJ5R7oLiv0q5aV+clhmTHcjyGm3mXUFDja0hSVpIwQQehBHlUYcRfCTN/EV3/aeKh5mQ5mRZVPJb8Ek/1MqWQOT1QTlPlkdBuHCzsrD2m0gVzUsydT3FKVXGUnqGx3DDZ+hPmf7ldewSBsdKUpSo6409r79YNXx97dCB9t+Mtt65/DpyuO63jkkgeaCAEr9MZOQVY1DYHiT0duDbI8C+TYmn9TJSEPRJDgbakK+phajgg/QTzDt1Ayd0SpKgCk5BGQR2NeaUpSlKUrlxCHEKQtIUlQwQRkEVOW7XCJobVcx+6aYlu6UnukqW0wyHYileoayCj9qgPtr43bjhc3R0nrmy3NrcaG1aoE1t5xMZ6QHFtpUCpAbI5PmAKSCcYJ79qsEUpSlKUpSlKUpSlK/9k=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434864/F5.user.js
// @updateURL https://update.greasyfork.org/scripts/434864/F5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keyup', (event) => {
        if (event.key === 'F5') {
            window.location.reload()
        }
    })
})();