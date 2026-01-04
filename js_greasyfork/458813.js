// ==UserScript==
// @name         Packagist total downloads and stars
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show your total downloads and stars on your Packagist profile page
// @author       Mark Townsend
// @match        https://packagist.org/profile/
// @match        https://packagist.org/users/mtownsend/packages/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=packagist.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458813/Packagist%20total%20downloads%20and%20stars.user.js
// @updateURL https://update.greasyfork.org/scripts/458813/Packagist%20total%20downloads%20and%20stars.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    // Main container to push html stats into
    const mainContainer = document.querySelector('section.container > section.row > section.col-md-9');

    // All stat data
    const numbers = Array.from(document.querySelectorAll('.metadata-block'));

    const downloads = numbers
    .filter(element => element.innerHTML.includes('glyphicon-download'))
    .map(element => Number(element.textContent.replace(/\s/g, '')))
    .reduce((carry, current) => carry + current, 0)
    .toLocaleString();

    const stars = numbers
    .filter(element => element.innerHTML.includes('glyphicon-star'))
    .map(element => Number(element.textContent.replace(/\s/g, '')))
    .reduce((carry, current) => carry + current, 0)
    .toLocaleString();

    // Create the div to show the stats
    const row = document.createElement('div');
    row.classList.add('row');
    row.style.marginBottom = '25px';

    const downloadsCol = document.createElement('div');
    downloadsCol.classList.add('col-sm-6');
    const downloadsHeader = document.createElement('h3');
    downloadsCol.prepend(downloadsHeader);
    downloadsHeader.innerText = 'Downloads';
    downloadsHeader.classList.add('text-center');
    const downloadsNumber = document.createElement('h4');
    downloadsCol.appendChild(downloadsNumber);
    downloadsNumber.innerText = downloads;
    downloadsNumber.classList.add('text-center');

    const starsCol = document.createElement('div');
    starsCol.classList.add('col-sm-6');
    const starsHeader = document.createElement('h3');
    starsCol.prepend(starsHeader);
    starsHeader.innerText = 'Stars';
    starsHeader.classList.add('text-center');
    const starsNumber = document.createElement('h4');
    starsCol.appendChild(starsNumber);
    starsNumber.innerText = stars;
    starsNumber.classList.add('text-center');

    row.prepend(downloadsCol);
    row.prepend(starsCol);

    mainContainer.prepend(row);
});
