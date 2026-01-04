// ==UserScript==
// @name         Grundos Cafe Pet Birthday Display
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  See the birthdates of neopets and their petpets on their pet lookup.
// @author       Dij
// @match        https://www.grundos.cafe/petlookup/*
// @match        http://www.grundos.cafe/petlookup/*
// @match        https://grundos.cafe/petlookup/*
// @match        http://grundos.cafe/petlookup/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/502532/Grundos%20Cafe%20Pet%20Birthday%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/502532/Grundos%20Cafe%20Pet%20Birthday%20Display.meta.js
// ==/UserScript==
let style = document.createElement("style");
style.innerHTML = `
.dijtooltip {
    text-decoration:underline;
    text-decoration-style:dotted;
    position:relative;
    display:inline-block;
}
.dijtooltip>span {
    color:white;
    position:absolute;
    opacity:0;
    background-color:rgba(0,0,0,0.8);
    padding:5px;
    transition:opacity 0.2s;
    width:10em;
    left:50%;
    margin-left:-5em;
    top:150%;
    text-align:center;
    visibility:hidden;
}
.dijtooltip:hover>span {
    opacity:1;
    transition:opacity 0.2s;
    visibility:visible;
}
.dijtooltip>span::before {
    content:"";
    width:0px;
    height:0px;
    position:absolute;
    border-style:solid;
    border-color:rgba(0,0,0,0.8) transparent;
    border-width: 0 10px 10px 10px;
    top:-10px;
    left:calc(5em - 5px);
}`;

function subtractHours(date, hours, minutes) {
    date.setHours(date.getHours() - hours);
    if (minutes != 0) {
        date.setMinutes(date.getMinutes()- minutes)
    }
    return date;
}
function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
        return new Date(new Date(date).toLocaleString('en-US', {timeZone}));
    }
    return new Date(date.toLocaleString('en-US', {timeZone}));
}
function format(a, b) {
    let adate = a.toDateString()
    let atime = `${a.getHours()}:${a.getMinutes().toString().padStart(2,0)}`;
    let bdate = b.toDateString();
    let btime = `${b.getHours()}:${b.getMinutes().toString().padStart(2,0)}`;
    let bhours = b.getHours()
    if (adate == bdate) {
        return `${bdate}, at about <span class="dijtooltip">${bhours}:00&nbsp;NST<span>${adate}, ${atime}-${btime} NST</span></span>`;
    }
    return `${bdate}, at about <span class="dijtooltip">${bhours}:00&nbsp;NST<span>${adate}, ${atime} - ${bdate}, ${btime} NST</span></span>`;
}
function calculateAge(age, element, prepend) {
    const nst = changeTimeZone(new Date(), 'America/Santa_Isabel');

    const a = subtractHours(new Date(nst), age, 59);
    const b = subtractHours(new Date(nst), age, 0);

    let NSTstring = format(a, b);
    const bday = document.createElement("div");
    bday.innerHTML = `${prepend}${NSTstring}`;
    element.parentNode.insertAdjacentElement("beforeend" ,bday);
}
function ageToNumber(text) {
    return Number(text.replace(",", ""));
}
function parsePPAge(element) {
    const re = /\((?:(\d+)\ days|).*?(\d+) hours/;
    let match = element.innerHTML.match(re);
    console.log(typeof match[2]);
    let age = ageToNumber(match[2]);
    if (match[1]) {
        age = age + (ageToNumber(match[1]) * 24);
    }
    return calculateAge(age, element, "Adopted: ");
}
(function() {
    'use strict';
    try {
        let petAgeHrs = document.querySelector("#petStats .pet--age strong:nth-child(3)");
        let ageNum = ageToNumber(petAgeHrs.innerText);
        document.head.appendChild(style);
        calculateAge(ageNum, petAgeHrs, '<strong>Born</strong> : ');

        let petpetages = document.querySelectorAll(".pet--petpetage");
        if(petpetages.length > 0){
            Array.from(petpetages).forEach(parsePPAge);
        }
    } catch (error) {
        window.onload = function() {
            alert(`Birthday Display error, please notify Dij: ${error}`);
        }
    }
})();