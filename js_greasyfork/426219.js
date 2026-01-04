// ==UserScript==
// @name         AtCoder Profile2Ranking Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  link the profile page to the ranking of country/region, birth year, and affiliation
// @author       sotanishy
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426219/AtCoder%20Profile2Ranking%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/426219/AtCoder%20Profile2Ranking%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let table = document.getElementsByClassName('dl-table')[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    let tr = tbody.getElementsByTagName('tr');
    const baseUrl = 'https://atcoder.jp/ranking';

    for (let i = 0; i < tr.length; i++) {
        let head = tr[i].getElementsByTagName('th')[0].textContent;
        let td = tr[i].getElementsByTagName('td')[0];
        if (head == '国と地域' || head == 'Country/Region') {
            let img = td.getElementsByTagName('img')[0];
            let country = img.src.split('/')[5].split('.')[0];
            let a = document.createElement('a');
            a.textContent = td.textContent;
            td.textContent = '';
            a.href = `${baseUrl}?f.Country=${country}`;
            td.appendChild(img);
            td.appendChild(a);
        }
        if (head == '誕生年' || head == 'Birth Year') {
            let birthyear = td.textContent;
            let a = document.createElement('a');
            a.textContent = birthyear;
            td.textContent = '';
            a.href = `${baseUrl}?f.BirthYearLowerBound=${birthyear}&f.BirthYearUpperBound=${birthyear}`;
            td.appendChild(a);
        }
        if (head == '所属' || head == 'Affiliation') {
            let affiliation = td.textContent;
            let a = document.createElement('a');
            a.textContent = affiliation;
            td.textContent = '';
            a.href = `${baseUrl}?f.Affiliation=${affiliation.replace(' ', '+')}`;
            td.appendChild(a);
        }
    }
})();