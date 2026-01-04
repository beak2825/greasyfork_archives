// ==UserScript==
// @name         GC Neggsweeper Tracker
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.7
// @description  Tracks the number of neggs you have received each day. Does not work across multiple devices.
// @author       sanjix
// @match        https://www.grundos.cafe/games/neggsweeper/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476093/GC%20Neggsweeper%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/476093/GC%20Neggsweeper%20Tracker.meta.js
// ==/UserScript==

var today = new Date();
var nstDate = today.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
//var nstDate = today.toLocaleString("en-US", "America/Los_Angeles");
var neggCount = JSON.parse(localStorage.getItem('neggCounter')) || 0;

if (localStorage.getItem('storedDate') === null) {
    localStorage.setItem('storedDate', JSON.stringify(nstDate));
}

function parseDate(dateString) {
    //returns date from Date String
    return dateString.match(/(\d+\/\d+\/\d+)/)[1];
}

console.log('today ', parseDate(nstDate));
console.log('stored date ', parseDate(JSON.parse(localStorage.getItem('storedDate'))));

//if stored date is not equal to current date, reset counter and date
if (parseDate(nstDate) != parseDate(JSON.parse(localStorage.getItem('storedDate')))) {
    console.log('resetting date and counter');
    neggCount = 0;
    localStorage.setItem('neggCounter', JSON.stringify(neggCount));
    localStorage.setItem('storedDate',JSON.stringify(nstDate));
} else {
    neggCount = JSON.parse(localStorage.getItem('neggCounter'));
}

if (document.evaluate(
        'count(//p[contains(.,"So far today")])',
        document,
        null,
        XPathResult.BOOLEAN_TYPE,
        null
    ).booleanValue) {
    var startForm = document.querySelector('.ns_start');
    startForm.style.background = "none";
    var neggP = document.createElement('p');
    neggP.textContent = "You have won " + JSON.parse(localStorage.getItem('neggCounter')) + " neggs today."
    document.querySelector('p + p + p').after(neggP);
} else {
    var gridHeader = document.querySelector('#neggsweeper_status');
    var headers = document.querySelectorAll('.bg-gold')[2]
    headers.id = 'trackerHeader';
    var values = document.querySelector('.bg-gold:nth-child(3) + div + div + div');
    values.id = 'trackerValue';

    var counterHeader = document.createElement('div');
    counterHeader.className = 'bg-gold';
    counterHeader.textContent = 'Neggs Won';

    var counterValue = document.createElement('div');
    headers.after(counterHeader);
    values.after(counterValue);

    gridHeader.style.gridTemplateColumns = '30% 20% 30% 20%';

    counterValue.textContent = neggCount;
    if (document.evaluate(
        "count(//main//p[contains(.,'You also win a ')]) > 0",
        document,
        null,
        XPathResult.BOOLEAN_TYPE,
        null
    ).booleanValue) {
        neggCount += 1;
        counterValue.textContent = neggCount;
        localStorage.setItem('neggCounter', JSON.stringify(neggCount));
    }
}

