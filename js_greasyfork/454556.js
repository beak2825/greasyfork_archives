// ==UserScript==
// @name         Rate Your Music - % / Yes / Hold / No / Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improves the way RYM displays information on profile updates pending approval by a moderator.
// @author       You
// @match        https://rateyourmusic.com/artist/profile_history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454556/Rate%20Your%20Music%20-%20%25%20%20Yes%20%20Hold%20%20No%20%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/454556/Rate%20Your%20Music%20-%20%25%20%20Yes%20%20Hold%20%20No%20%20Comments.meta.js
// ==/UserScript==

// set interval that will be used to check if the page is loaded
// useQuerySelectorAll('tr') if length is 1, then the page is not fully loaded
// if length is 2 or more, then the page is fully loaded
// if the page is fully loaded, then get the data
//

var interval = setInterval(function() {
    if (document.querySelectorAll('tr').length > 1) {
        clearInterval(interval);
        getData();
    }
}, 100);

function getData() {
    const rows = document.querySelector('.mbgen').querySelectorAll('tr');

    rows.forEach((row) => {
        const voteCell = row.querySelectorAll('td')[7];
        const voteData = voteCell?.innerText;

        if (voteData) {
            const commentInfo = voteData.match(/\/\/.+/)?.[0];

            const percent = voteData.split('|')[0]?.match(/\d+/)?.[0];
            const values = voteData.split('|').slice(1).map((_) => _.match(/\d+/)[0].trim());
            const yes = values[0];
            const hold = values[1];
            const no = values[2];
            const comments = values[3];

            let color = 'purple';

            if (Number(yes) >= 1 && percent >= 75) {
                color = 'green';
            } else if (Number(no) >= 1 && percent <= 40) {
                color = 'red';
            }

            const newData = `${percent ?? 0}%; Yes: ${yes}; No: ${no}; Hold: ${hold}; Comments: ${comments}; ${commentInfo}`;
            console.log({ newData });

            voteCell.innerHTML = newData;
        }
    })
}