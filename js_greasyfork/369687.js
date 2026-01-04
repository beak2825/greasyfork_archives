// ==UserScript==
// @name         Hybrid Search Categorize
// @author       Eisenpower
// @namespace    Uchiha Clan
// @version      1.1
// @icon         https://i.imgur.com/M0jWVYS.png
// @description  Unleashes Your Sharingan
// @match        https://www.gethybrid.io/workers/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369687/Hybrid%20Search%20Categorize.user.js
// @updateURL https://update.greasyfork.org/scripts/369687/Hybrid%20Search%20Categorize.meta.js
// ==/UserScript==

var taskName = document.querySelector('[class="active"]').textContent;

if (taskName.includes('Categorize search query (1-20K)')) {

    document.addEventListener('keydown', function (event) {
        var press = event.key;
        console.log(press);

        if (press == 1) {
            ROUTE('ae149b62-cbb2-4768-a50f-cbf199980169'); // Business/Interest
            ROUTE('326f38d2-769c-4689-b52a-9c8c31735348'); // Specific
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }

        if (press == 2) {
            ROUTE('ae149b62-cbb2-4768-a50f-cbf199980169'); // Business/Interest
            ROUTE('d706060d-7e71-42a0-8523-e61b5795d848'); // Category
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
        if (press == 3) {
            ROUTE('ae149b62-cbb2-4768-a50f-cbf199980169'); // Business/Interest
            ROUTE('35e8272d-4afc-42c9-8567-555be0cb44f3'); // Both
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
        if (press == 4) {
            window.open(document.querySelector('[class="fields-text"]').querySelectorAll('a')[1].href, '_blank');
        }
        if (press == 5) {
            ROUTE('496483d8-1a10-4afd-862d-5faf6a669524'); // No
            ROUTE('a103b6df-8319-48f3-925e-b0fc9c8d8525'); // N/A
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
    });
}

if (taskName.includes('Categorize search query (20-40K)')) {

    document.addEventListener('keydown', function (event) {
        var press = event.key;
        console.log(press);

        if (press == 1) {
            ROUTE('3f1f1496-0ccc-4508-92fc-29749772d0bd'); // Business/Interest
            ROUTE('40979084-957b-4381-b742-1a3897d083bf'); // Specific
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }

        if (press == 2) {
            ROUTE('3f1f1496-0ccc-4508-92fc-29749772d0bd'); // Business/Interest
            ROUTE('7a732c3b-fea7-4168-9f3c-1b8c530e6275'); // Category
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
        if (press == 3) {
            ROUTE('3f1f1496-0ccc-4508-92fc-29749772d0bd'); // Business/Interest
            ROUTE('6992c588-acb2-43a5-b698-69b5a842a7cd'); // Both
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
        if (press == 4) {
            window.open(document.querySelector('[class="fields-text"]').querySelectorAll('a')[1].href, '_blank');
        }
        if (press == 5) {
            ROUTE('2b600950-a152-4215-803b-2793cb241646'); // No
            ROUTE('6cd98860-333f-4fe7-99ab-19ebf0f58953'); // N/A
            document.querySelector('[type="submit"][ name="commit"][value="Submit"]').click() // Submit
        }
    });
}

function ROUTE(route) {
    document.querySelector(`[value="${route}"]`).click();
}
