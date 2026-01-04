// ==UserScript==
// @name        PlanPolslParity
// @description Reformat plan.polsl i dodanie diva z info nt parzystosci tygodnia
// @version     1.0.2
// @author      aerfio
// @namespace   https://greasyfork.org/pl/users/288091-aerfio
// @include     http://plan.polsl.pl/*
// @include     https://plan.polsl.pl/*
// @run-at      document-end
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/381251/PlanPolslParity.user.js
// @updateURL https://update.greasyfork.org/scripts/381251/PlanPolslParity.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const getWeek = function() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
        1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    );
};

const weekParityNode=document.createElement('p');
const parity = getWeek() % 2 === 0;
weekParityNode.appendChild(document.createTextNode(`Tydzień ${parity ? '' : 'nie'}parzysty`));
weekParityNode.style.margin='0px';
weekParityNode.style.fontSize='25px';
weekParityNode.style.fontFamily='verdana, helvetica';
document.body.appendChild(weekParityNode);

[...document.body.querySelectorAll('div')].slice(1,4).forEach(e=>e.remove());

document.body.querySelectorAll('div').forEach(e=>{
    const data=e.style.top;
    e.style.top=(Number.parseInt(data.slice(0,data.length-2),10)-27)+'px';
});

