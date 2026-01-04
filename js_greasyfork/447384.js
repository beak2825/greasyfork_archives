// ==UserScript==
// @name         Steam Age Verification faker
// @description  Sets your birthday to a random date 25 years ago and submits the form.
// @version      1.1
// @namespace    flolm
// @license      Public Domain
// @match        https://store.steampowered.com/agecheck/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447384/Steam%20Age%20Verification%20faker.user.js
// @updateURL https://update.greasyfork.org/scripts/447384/Steam%20Age%20Verification%20faker.meta.js
// ==/UserScript==

(
    function(main) {
        const months = ["January", "February", "March", "April", "May", "June", "July"];
        var currentTime = new Date();
        var currentYear = currentTime.getFullYear();
        try {

        let bdaySelector = main.querySelector('.agegate_birthday_selector');

        let day = bdaySelector.querySelector("#ageDay");
        day.value = Math.floor(Math.random() * 30) + 1;

        let month = bdaySelector.querySelector("#ageMonth");
        month.value = months[Math.floor(Math.random() * months.length)];

        let year = bdaySelector.querySelector("#ageYear");
        year.value = currentYear - 25;

        } catch (error) {
            console.error(error);
        }

        let submitBtn = main.querySelector('#view_product_page_btn');
        submitBtn.click();
    }
    (document.querySelector('.main_content_ctn'))
);
