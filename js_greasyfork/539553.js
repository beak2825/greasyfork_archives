// ==UserScript==
// @name            Change edison's charts
// @description     Change edison's charts in every month
// @version         1.1.11
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           https://www.sce.com/save-money/rates-financing/sce-rate-advisory/*
// @run-at          document-end
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/539553/Change%20edison%27s%20charts.user.js
// @updateURL https://update.greasyfork.org/scripts/539553/Change%20edison%27s%20charts.meta.js
// ==/UserScript==

const chartDate = window.location.href.split("/").slice(-1)[0]

switch (chartDate) {
    case "20240101":
        updateJanuary();
        break;
    case "20240301":
        updateMarch();
        break;
    case "20240601":
        updateJune();
        break;
    case "20241001":
        updateOctober();
        break;
}

function updateJanuary() {
    const tableHead = document.querySelectorAll('thead tr')[0];
    console.log(tableHead);
    const ths = tableHead.querySelectorAll('th');
    ths[2].innerText = 'Proposed increase';
    ths[4].innerText = '%Increase';
    
    const firstRow = document.querySelectorAll('tbody tr')[0];
    const secondRow = document.querySelectorAll('tbody tr')[1];
    
    const firstTds = firstRow.querySelectorAll('td');
    firstTds[1].innerText = '$184.22';
    firstTds[2].innerText = '$3.69';
    firstTds[3].innerText = '$187.90';
    firstTds[4].innerText = '2%';
    
    const secondTds = secondRow.querySelectorAll('td');
    secondTds[1].innerText = '$121.07';
    secondTds[2].innerText = '$2.42';
    secondTds[3].innerText = '$123.49';
    secondTds[4].innerText = '2%';
}

function updateMarch() {
    const tableHead = document.querySelectorAll('thead tr')[0];
	const ths = tableHead.querySelectorAll('th');
	ths[2].innerText = 'Proposed increase';
	ths[4].innerText = '%Increase';

	const firstRow = document.querySelectorAll('tbody tr')[0];
	const secondRow = document.querySelectorAll('tbody tr')[1];

	const firstTds = firstRow.querySelectorAll('td');
	firstTds[1].innerText = '$187.22';
	firstTds[2].innerText = '$2.24';
	firstTds[3].innerText = '$189.46';
	firstTds[4].innerText = '1.2%';

	const secondTds = secondRow.querySelectorAll('td');
	secondTds[1].innerText = '$123.49';
	secondTds[2].innerText = '$1.48';
	secondTds[3].innerText = '$124.97';
	secondTds[4].innerText = '1.2%';
}

function updateJune() {
	const tableHead = document.querySelectorAll('thead tr')[0];
	const ths = tableHead.querySelectorAll('th');
	ths[2].innerText = 'Proposed increase';
	ths[4].innerText = '%Increase';

	const firstRow = document.querySelectorAll('tbody tr')[0];
	const secondRow = document.querySelectorAll('tbody tr')[1];

	const firstTds = firstRow.querySelectorAll('td');
	firstTds[1].innerText = '$189.46';
	firstTds[2].innerText = '$13.45';
	firstTds[3].innerText = '$202.91';
	firstTds[4].innerText = '7.10%';

	const secondTds = secondRow.querySelectorAll('td');
	secondTds[1].innerText = '$124.97';
	secondTds[2].innerText = '$8.77';
	secondTds[3].innerText = '$133.74';
	secondTds[4].innerText = '7.02%';
}

function updateOctober() {
    const sections = document.querySelectorAll('.copy-block-text.black-text');
	const sectionOne = sections[0].getElementsByTagName('h2')[0];
	sectionOne.innerText = 'Our Rates are Increasing on October 1, 2024';
	console.log(sectionOne);

	const tableHead = document.querySelectorAll('thead tr')[0];
	const ths = tableHead.querySelectorAll('th');
	ths[2].innerText = 'Proposed increase';
	ths[4].innerText = '%Increase';

	const firstRow = document.querySelectorAll('tbody tr')[0];
	const secondRow = document.querySelectorAll('tbody tr')[1];

	const firstTds = firstRow.querySelectorAll('td');
	firstTds[1].innerText = '$202.91';
	firstTds[2].innerText = '$9.13';
	firstTds[3].innerText = '$212.04';
	firstTds[4].innerText = '4.5%';

	const secondTds = secondRow.querySelectorAll('td');
	secondTds[1].innerText = '$133.74';
	secondTds[2].innerText = '$5.61';
	secondTds[3].innerText = '$139.35';
	secondTds[4].innerText = '4.2%';
}