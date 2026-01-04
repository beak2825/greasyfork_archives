// ==UserScript==
// @name         DVSA change practical test
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  This script shows only free slots
// @author       You
// @match        *.dvsa.gov.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dvsa.gov.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461335/DVSA%20change%20practical%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/461335/DVSA%20change%20practical%20test.meta.js
// ==/UserScript==

const centers = ["Hither Green (London)", "Bromley (London)","Sidcup (London)"];
const postcode = "SE18 4NW"
const username = "aaaaaa";
const password = "555555";
const lazyLoadCount = 1;
const storage = sessionStorage;


function filterAvailbaleSlots(){
    'use strict';

    // available tests around 31/03/2023
    let elments = document.querySelectorAll("li.clear");
    const prefered = []

    elments.forEach(item => {
        const h5Element = item.querySelector("h5");

        if (h5Element && !h5Element.textContent.includes("available tests")) {
            item.remove();
            return;
        }

        const h4Element = item.querySelector("h4");

        if (h4Element && centers.includes(h4Element.textContent)){
            let availableDate = extractDate(h4Element.textContent);

            let startDate = new Date(); // Current date
            startDate.setDate(startDate.getDate() + 3); // 3 days later than the current day

            let endDate = new Date(2023, 6, 4); // Jul 4th, 2023

            if (availableDate && availableDate >= startDate && availableDate < endDate) {
                prefered.push(item);
            }
        }

      });

      return prefered;
}

(async function() {
    'use strict';

    const username_txt = document.getElementById("driving-licence-number");
    const password_txt = document.getElementById("application-reference-number");
    const submitButton = document.querySelector('input[type="submit"]');

    if (username_txt && password_txt) {
        username_txt.value = username;
        password_txt.value = password;

        await sleep(2000);
        submitButton.click();
    }
})();

(async function() {
    'use strict';

    const btn = document.getElementById("test-centre-change");

    if (btn) {
        await sleep(2000);
        btn.click();
    }
})();


(function() {
    'use strict';

    const center_txt = document.getElementById("test-centres-input");
    const submit_btn = document.querySelector('input[type="submit"]');

    if (!center_txt || center_txt.value == postcode) return;

    center_txt.value = postcode;
})();

(async function search(){

    const submit_btn = document.getElementById('test-centres-submit');
    const fetch_more_btn = document.getElementById('fetch-more-centres');

    if (!submit_btn) return;

    let prefered = filterAvailbaleSlots();

    if (prefered.length > 0){
        beep();
        console.log(`fount slots ${[...prefered]}`);
        return;
    }

    let fetch = prefered.length == 0 && !reachedFetchCount();

    if (fetch_more_btn){
        fetch_more_btn.innerHTML += ` | <b>Clicked ${storage.fetchCount} times</b>`
        if (fetch){
            await sleepRand(5000, 15000);
            incrementFetchCount();
            fetch_more_btn.click();
            return;
        }
    };


    resetFetchCount();

    await sleepRand(30000, 60000);
    submit_btn.click();

})();

/*
(async function retryOnAccessDenied(){

    const accessDeniedIFrame = document.getElementsByTagName('iframe');

    if (accessDeniedIFrame){
        await sleepRand(30000, 60000);
        window.location = 'https://driverpracticaltest.dvsa.gov.uk/login';
    }

})();

*/

function sleepRand(min, max) {
    let rnd = Math.random() * max;
    let ms = min = rnd > min ? rnd : min;
    console.log(`wait for ${ms}`);
    return sleep(ms);
}

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function beep() {
    var audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav');
    audio.play();
}

function reachedFetchCount() {
    return Number(storage.fetchCount) >= lazyLoadCount;
};

function incrementFetchCount() {
    storage.fetchCount = Number(storage.fetchCount) + 1;
}

function resetFetchCount() {
    storage.fetchCount = 0;
};

function extractDate(text) {
    const regex = /(\d{2}\/\d{2}\/\d{4})/g;
    const match = regex.exec(text);

    if (match) {
        // The matched string is in the format "DD/MM/YYYY"
        const [day, month, year] = match[0].split('/').map(Number);
        return new Date(year, month - 1, day);
    } else {
        return null;
    }
}
