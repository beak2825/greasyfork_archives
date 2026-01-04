// ==UserScript==
// @name         WPlace Go To via Google Map Link
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a button to teleport to a place via a Google Maps URL
// @author       vladbarcelo
// @match        https://wplace.live/*
// @license      GPL3
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546309/WPlace%20Go%20To%20via%20Google%20Map%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/546309/WPlace%20Go%20To%20via%20Google%20Map%20Link.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(() => {
        if (!document.querySelector('#goToMapPlaceBtn')) {
            document.querySelector('.flex.flex-col.gap-4.items-center').insertAdjacentHTML('beforeend', `<button id="goToMapPlaceBtn" class="btn btn-square relative shadow-md" title="Go to map place"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-5" fill="currentColor"><path d="M640-560v-126 126ZM174-132q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v337q-15-23-35.5-42T760-528v-204l-120 46v126q-21 0-41 3.5T560-546v-140l-160-56v523l-226 87Zm26-96 120-46v-468l-120 40v474Zm440-12q34 0 56.5-20t23.5-60q1-34-22.5-57T640-400q-34 0-57 23t-23 57q0 34 23 57t57 23Zm0 80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43.5T778-238l102 102-56 56-102-102q-18 11-38.5 16.5T640-160ZM320-742v468-468Z"/></svg></button>`)
            const button = document.getElementById('goToMapPlaceBtn');
            if (!button) return
            button.addEventListener('click', function() {
                const googleUrl = prompt('Enter Google Map URL')

                if (!googleUrl) return

                const [lat, lng] = googleUrl.split('?')[0].split('@')[1].split(',').map((v) => Number(v))

                if (Number.isNaN(lat) || Number.isNaN(lng)) {
                    alert('Bad URL entered, unable to parse')
                    return
                }

                const wplaceData = {
                    lat,
                    lng,
                    zoom: 13
                }

                localStorage.setItem('location', JSON.stringify(wplaceData))
                location.reload()
            });
        } else {
            clearInterval(interval)
        }
    }, 1000)

})();