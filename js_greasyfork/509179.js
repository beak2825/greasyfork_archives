// ==UserScript==
// @name         Ghost Trade Input Calc
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  Ghosttrade
// @author       DonWasTaken
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/trade.php*
// @grant        window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509179/Ghost%20Trade%20Input%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/509179/Ghost%20Trade%20Input%20Calc.meta.js
// ==/UserScript==

console.log('Starting money evaluation script')
function addListener() {

    const problem = document.querySelector(".user-id.input-money");
    console.log('Found addmoneypage, adding listerner')

    problem.addEventListener('keypress', (key) => {
        if(key.key === 'Enter') {
            if (problem.value.includes('-')) {
                console.log('Deduction detected.')
                const problemSplit = problem.value.split('-')
                problem.value = problemSplit[0] - problemSplit[1]
                problem.dispatchEvent(new Event("input", { bubbles: true }));
            }
            if (problem.value.includes('+')) {
                console.log('Add detected.')
                const problemSplit = problem.value.split('+')
                problem.value = problemSplit[0] + problemSplit[1]
                problem.dispatchEvent(new Event("input", { bubbles: true }));
            }
        }
    })

}

if (window.onurlchange === null) {
    window.addEventListener('urlchange', () => {
        inputCheck();
    });
}

if (window.location.href.includes("trade.php#step=addmoney")) {
    inputCheck();
}

function inputCheck() {
    console.log('input check.')
    setTimeout(function() {
        if ($('.user-id.input-money').length > 0) {
            addListener();
        } else {
            setTimeout(checkInput, 300);
        }
    }, 300);
}