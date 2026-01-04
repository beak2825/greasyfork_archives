// ==UserScript==
// @name         Better g-teacher
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  Adds some helpful features to the website.
// @author       Msix29
// @match        https://g-teacher.com/courses/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=g-teacher.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510315/Better%20g-teacher.user.js
// @updateURL https://update.greasyfork.org/scripts/510315/Better%20g-teacher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.querySelector("#tutor-page-wrap .tutor-course-topic > .is-active")?.click();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
    const yyyy = today.getFullYear();
    const currentDate = `${dd}-${mm}-${yyyy}`;

    function parseDate(dateString) {
        const [day, month, year] = dateString.split("-").map(Number);

        return new Date(year, month - 1, day);
    }

    const titles = document.querySelectorAll(".tutor-course-single-sidebar-wrapper .tutor-accordion-item-header .tutor-course-topic-title");

    let closestBefore = null;
    let closestBeforeDate = null;
    let foundExact = false;

    for (let i = 0; i < titles.length; i++) {
        const title = titles[i];
        const text = title.textContent.trim();
        const match = text.match(/(\d{2})-(\d{2})-(\d{4})/);

        if (match) {
            const dateText = match[0];
            const date = parseDate(dateText);

            if (dateText === currentDate) {
                title.scrollIntoView({ behavior: "smooth", block: "center" });
                title.click();

                break;
            } else if (date < today) {
                closestBeforeDate = date;
                closestBefore = title;
            } else {
                closestBefore.scrollIntoView({ behavior: "smooth", block: "center" });
                closestBefore.click();

                break;
            }
        }
    }
})();