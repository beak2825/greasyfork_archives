// ==UserScript==
// @name         GC Job Coupon Helper
// @namespace    https://greasyfork.org/en/users/1175371
// @version      1.4
// @description  Tracks what job coupon you used and on job completion lists what job coupon you have now.
// @author       sanjix
// @match        https://www.grundos.cafe/faerieland/employ/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489681/GC%20Job%20Coupon%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489681/GC%20Job%20Coupon%20Helper.meta.js
// ==/UserScript==

var jobLevel = JSON.parse(localStorage.getItem('currentJobLevel')) || '';
//console.log(jobLevel);
var selectedJobLevel = JSON.parse(localStorage.getItem(selectedJobLevel)) || '';
const couponRanks = ['Green', 'Blue', 'Red', 'Silver', 'Gold', 'Purple', 'Pink', 'Green Brightvale', 'Bronze Brightvale', 'Silver Brightvale', 'Gold Brightvale'];

var jobPicker = document.createElement('select')
couponRanks.forEach(rank => {
    jobPicker.add(new Option(rank));
});

var menu = document.querySelector('a[href="/faerieland/employ/rankings/"]');
menu.parentElement.innerHTML += ` |  <b id="currentLevel">Current Coupon: </b>`;
var menuLevel = document.querySelector('#currentLevel')
menuLevel.after(jobPicker);

function updatePicker(newJobLevel) {
    jobPicker.selectedIndex = couponRanks.indexOf(jobLevel);
}

if (jobLevel) {
    updatePicker(jobLevel);
} else {
    jobPicker.selectedIndex = -1;
}

jobPicker.addEventListener('change', (event) => {
    jobLevel = event.target.value;
    localStorage.setItem('currentJobLevel', JSON.stringify(jobLevel));
});

function parseDate(dateString) {
    //returns date from Date String
    return dateString.match(/(\d+\/\d+\/\d+)/)[1];
}

function checkDate(current, stored) {
    var nstDate = current.toLocaleString("en-US", "America/Los_Angeles");

    if (stored === null) {
        localStorage.setItem('storedJobDate', JSON.stringify(nstDate));
    }
    //if stored date is not equal to current date, reset job level and date
    else if (parseDate(nstDate) > parseDate(JSON.parse(stored))) {
        console.log('resetting date and counter');
        jobLevel = '';
        updatePicker(jobLevel);
        localStorage.setItem('currentJobLevel', JSON.stringify(jobLevel));
        localStorage.setItem('storedJobDate',JSON.stringify(nstDate));
    }
}

checkDate(new Date(), localStorage.getItem('storedJobDate'));

function findJobLevel(gcClass) {
    const digits = /\d+/
    var num = gcClass.match(digits);
    return couponRanks[num - 1];
}

function getNewLevel(curJobLevel) {
    var output = ''
    if (curJobLevel == 'Green') {
        jobLevel = '';
        selectedJobLevel = '';
        localStorage.setItem('selectedJobLevel', JSON.stringify(selectedJobLevel));
        localStorage.setItem('currentJobLevel', JSON.stringify(jobLevel));
        output = '<b>all used up</b>';
    } else {
        var rank = couponRanks.indexOf(curJobLevel);
        jobLevel = couponRanks[rank - 1];
        localStorage.setItem('currentJobLevel', JSON.stringify(jobLevel));
        output = 'a <b>' + jobLevel + ' Job Coupon</b>';
    }
    return `<p>Your job coupon is now ${output}.</p>`;
    //updatePicker(jobLevel);
}

var takeJob = document.querySelectorAll('.fea_apply a');
takeJob.forEach((job) => {
    job.addEventListener('click', (event) => {
        selectedJobLevel = findJobLevel(job.parentElement.parentElement.parentElement.children[0].classList[1]);
        //console.log(job.parentElement.parentElement.parentElement.children[0].classList[1]);
        localStorage.setItem('selectedJobLevel',JSON.stringify(selectedJobLevel));
        //jobPicker.selectedIndex = couponRanks.indexOf(selectedJobLevel);
    });
});

if (document.evaluate(
    'count(//b[contains(.,"Good job! You got all the items we wanted.")])',
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
).booleanValue) {
    var buttons = document.querySelector('.button-group');
    var newJobCoupon = document.createElement('p');
    if (jobLevel != '') {
        if (jobLevel != JSON.parse(localStorage.getItem(selectedJobLevel))) {
            newJobCoupon.innerHTML = getNewLevel(JSON.parse(localStorage.getItem('currentJobLevel')));
        } else {
            newJobCoupon.innerHTML = getNewLevel(JSON.parse(localStorage.getItem(selectedJobLevel)));
        }
        buttons.prepend(newJobCoupon);
    }

//     updatePicker(jobLevel);
//     if (jobLevel) {
//         console.log(jobLevel)
//         newJobCoupon.innerHTML = `<p>Your job coupon is now ${jobLevel}.`;
//     }
}