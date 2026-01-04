// ==UserScript==
// @name         TBD: Seedbonus Expansion for TorrentBD
// @namespace    https://naeembolchhi.github.io/
// @version      0.19
// @description  Calculates and adds more information in the Profile Card and Seedbonus Redeem Table.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCQTRDRjEwODJEQzExRURCNEYyRjU3QzY4QkFDNTJFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCQTRDRjExODJEQzExRURCNEYyRjU3QzY4QkFDNTJFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUJBNENGMEU4MkRDMTFFREI0RjJGNTdDNjhCQUM1MkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUJBNENGMEY4MkRDMTFFREI0RjJGNTdDNjhCQUM1MkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6/NCTZAABTeUlEQVR42ux9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
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @exclude      https://*.torrentbd.*/terminal
// @exclude      https://*.torrentbd.*/theme
// @exclude      https://*.torrentbd.*/guidelines/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456944/TBD%3A%20Seedbonus%20Expansion%20for%20TorrentBD.user.js
// @updateURL https://update.greasyfork.org/scripts/456944/TBD%3A%20Seedbonus%20Expansion%20for%20TorrentBD.meta.js
// ==/UserScript==

// Crucial information
function sbonus() {return parseFloat(localStorage.fullSB) || 0;}
function broke() {return sbonus() < 450;}
let pinfo = document.querySelectorAll("#left-block-container .profile-info-table tbody td:nth-child(even)"),
    sratio = parseFloat(pinfo[2].innerHTML),
    supload = pinfo[0].innerHTML,
    sdownload = pinfo[1].innerHTML,
    stable, shead, sbody;

try {
    stable = document.getElementById("redeem-upload").parentNode.getElementsByTagName("table")[0];
    shead = stable.querySelector("thead tr");
    sbody = stable.querySelectorAll("tbody tr");
} catch(e) {}

// Units and conversion values
const unitCalc = [
    {"unit": "YiB", "math": "8"},
    {"unit": "ZiB", "math": "7"},
    {"unit": "EiB", "math": "6"},
    {"unit": "PiB", "math": "5"},
    {"unit": "TiB", "math": "4"},
    {"unit": "GiB", "math": "3"},
    {"unit": "MiB", "math": "2"},
    {"unit": "KiB", "math": "1"},
    {"unit": "B", "math": "0"}
];

// Calculate credit in bytes
function byteGet(value) {
    value = value.replace(/\,/g,'');
    for (let x = 0; x < unitCalc.length; x++) {
        if (value.match(unitCalc[x].unit)) {
            let multiplicand = parseFloat(value.replace(unitCalc[x].unit,"")),
                multiplier = Math.pow(2,parseInt(unitCalc[x].math)*10),
                product = multiplicand*multiplier;
            return product;
        }
    }
}

// Calculate bytes in credit
function creditGet(value, digits) {
    for (let x = 0; x < unitCalc.length; x++) {
        let dividend = parseFloat(value),
            divisor = Math.pow(1024,parseInt(unitCalc[x].math)),
            quotient = dividend/divisor;

        if (quotient >= 1) {
            if (quotient.toString().match(/\..../)) {
                quotient = parseFloat(quotient).toFixed(2);
            }
            return quotient.toString() + " " + unitCalc[x].unit;
        }
    }
}

// Seedbonus table (may change and need manual updates)
const seedCalc = [
    {"cost": "1000000", "cred": "3 TiB"},
    {"cost": "100000", "cred": "300 GiB"},
    {"cost": "34500", "cred": "100 GiB"},
    {"cost": "18000", "cred": "50 GiB"},
    {"cost": "7600", "cred": "20 GiB"},
    {"cost": "4000", "cred": "10 GiB"},
    {"cost": "2100", "cred": "5.0 GiB"},
    {"cost": "1100", "cred": "2.5 GiB"},
    {"cost": "450", "cred": "1.0 GiB"}
];

// Calculate seedbonus in credits across all tiers
function creditSeed(value) {
    value = parseInt(value);
    if (value < 450) {return "0 B";}

    let recycle = value,
        accumulate = 0;

    for (let x = 0; x < seedCalc.length; x++) {
        console.log(recycle);
        let seedly = creditSeedest(recycle);

        if (seedly[0] && seedly[1]) {
            accumulate += seedly[0];
            recycle = seedly[1];
        }
    }

    return creditGet(accumulate);
}

// Calculate seedbonus in credits in largest tier
function creditSeedest(value) {
    value = parseInt(value);
    if (value < 450) {return [0, value];}

    for (let x = 0; x < seedCalc.length; x++) {
        let dividend = parseFloat(value),
            divisor = parseFloat(seedCalc[x].cost),
            quotient = dividend / divisor;

        if (quotient >= 1) {
            let multiplicand = byteGet(seedCalc[x].cred),
                multiplier = parseInt(quotient),
                product = multiplicand * multiplier,
                remainder = value - (multiplier * divisor);

            return [product, remainder];
        }
    }
}

// Adding new table cells
function addCell(element, content, container, before, classes) {
    let cell = document.createElement(element);
    if (element === "tr") {
        cell.setAttribute("style","opacity: .65");
    }
    if (classes) {
        cell.setAttribute("class", classes);
    }
    cell.innerHTML = content;
    container.insertBefore(cell, before);
}

// Updating the seedbonus table
function seed() {
	// Update Headings
	shead.children[1].innerHTML = "Upload Raise";
	shead.children[2].innerHTML = "Future Ratio";

	// Update Cells
	for (let x = 0; x < sbody.length; x++) {
		let num = sbody[x].children[1].innerHTML.replace(" Upload Raise", ""),
			count = parseInt(sbonus() / parseFloat(sbody[x].children[0].innerHTML)),
			byte = byteGet(num) * count,
			credit = creditGet(byte),
            option = '<span style="margin: 0 1em;">&lt;</span>' + credit;

        if (broke() || credit == undefined || num == credit.replace(".00","")) {option = "";}

		sbody[x].children[1].innerHTML = num + option;
        sbody[x].children[1].setAttribute('data-temp', credit);
	}

	for (let x = 0; x < sbody.length; x++) {
		if (isNaN(parseInt(sratio))) {
			break;
		}

		let count = parseInt(sbonus() / parseFloat(sbody[x].children[0].innerHTML)),
			ratio = parseFloat(sbody[x].children[2].innerHTML),
            credit = sbody[x].children[1].getAttribute('data-temp'),
            mratio = (byteGet(supload) + byteGet(credit)) / byteGet(sdownload);

        // console.log(count, ratio, mratio, mratio);

        let option = '<span style="margin: 0 1em;">&lt;</span>' + parseFloat(mratio).toFixed(2);

        if (broke() || parseFloat(mratio).toFixed(2) == undefined || parseFloat(mratio).toFixed(2) == parseFloat(sratio).toFixed(2) || parseFloat(ratio).toFixed(2) == parseFloat(mratio).toFixed(2)) {option = "";}

		sbody[x].children[2].innerHTML = parseFloat(ratio).toFixed(2) + option;

        sbody[x].children[1].removeAttribute('data-temp');
	}

	// New Headings
	addCell("th", "Maximum", shead, shead.children[1]);
	addCell("th", "Future Upload", shead, shead.children[3]);

	// New Cells
	for (let x = 0; x < sbody.length; x++) {
		let count = parseInt(sbonus() / parseFloat(sbody[x].children[0].innerHTML)),
			ctext = count.toString() + " Times";

		addCell("td", ctext, sbody[x], sbody[x].children[1]);
	}
	for (let x = 0; x < sbody.length; x++) {
		let rateOne = sbody[x].children[2].innerHTML.replace(/\<span.*/, ""),
			rateAll = sbody[x].children[2].innerHTML.replace(/.*\<\/span\>/, ""),
			uploadOne = creditGet(byteGet(supload) + byteGet(rateOne)),
			uploadAll = creditGet(byteGet(supload) + byteGet(rateAll)),
            option = "<span style='margin: 0 1em;'>&lt;</span>" + uploadAll;

        if (broke() || uploadAll == undefined || uploadOne == uploadAll) {option = "";}

	    let ctext = uploadOne + option;

		addCell("td", ctext, sbody[x], sbody[x].children[3]);
	}
}

// Updating the profile table
function profile() {
    // Calculations
    let newup = creditSeed(sbonus()),
        maxup = creditGet(byteGet(supload) + byteGet(newup)),
        ra = parseFloat(byteGet(creditSeed(sbonus())) / byteGet(sdownload)),
        newra = ra.toFixed(2),
        maxra = parseFloat(parseFloat(sratio) + ra).toFixed(4);

    if (document.querySelector('#left-block-container .profile-info-table .customProfileCell')) {
        // Update Cells
        let newCells = document.querySelectorAll('#left-block-container .profile-info-table .customProfileCell');
        newCells[0].parentNode.children[1].innerHTML = `${maxup} <span class="devilmayhide">(+${newup})</span>`;
        newCells[1].parentNode.children[1].innerHTML = `${parseFloat(maxra).toFixed(2)} <span class="devilmayhide"> (+${newra})</span>`;

        let growthCells = document.querySelectorAll('#left-block-container .profile-info-table .customGrowthCell');
        growthCells[0].parentNode.children[1].innerHTML = `${newup}`;
        growthCells[1].parentNode.children[1].innerHTML = `${newra}`;
    } else {
        // New Cells
        addCell("tr", `<td class="customProfileCell">P. Uploaded</td><td>${maxup}<span class="devilmayhide"> (+${newup})</span></td>`, pinfo[0].parentNode.parentNode, pinfo[1].parentNode);
        addCell("tr", `<td class="customProfileCell">P. Ratio</td><td>${parseFloat(maxra).toFixed(2)}<span class="devilmayhide"> (+${newra})</span></td>`, pinfo[0].parentNode.parentNode, pinfo[3].parentNode);

        addCell("tr", `<td class="customGrowthCell">Growth</td><td>${newup}</td>`, pinfo[0].parentNode.parentNode, pinfo[1].parentNode, "devilmayshow");
        addCell("tr", `<td class="customGrowthCell">Growth</td><td>${newra}</td>`, pinfo[0].parentNode.parentNode, pinfo[3].parentNode, "devilmayshow");

        // Show a Growth Row depending on available width in the table
        addCell("style", `
          #left-block-container .card-content {
            container: profilecard / inline-size;
          }
          tr.devilmayshow {
            display: none;
          }
          @container (width < 320px) {
            tr.devilmayshow {
              display: table-row;
            }
            span.devilmayhide {
              display: none;
            }
          }
        `, pinfo[0].parentNode.parentNode.parentNode, null);
    }
}

// Updating under account details
function seedverse() {
    // Grabbing nodes
    let accWRAP = document.querySelectorAll('.crc-wrapper'),
        proTibCon = document.querySelector('#middle-block .profile-tib-container'),
        wrapperOG = document.createElement('div');

    // Putting the four values inside the same parent
    wrapperOG.classList.add('wrapper-og');
    proTibCon.insertBefore(wrapperOG, proTibCon.children[1]);
    wrapperOG = document.querySelector('.wrapper-og');
    wrapperOG.appendChild(accWRAP[0]);
    wrapperOG.appendChild(accWRAP[1]);
    wrapperOG.appendChild(accWRAP[2]);
    wrapperOG.appendChild(accWRAP[3]);
    wrapperOG.appendChild(accWRAP[0].cloneNode(true));
    wrapperOG.appendChild(accWRAP[2].cloneNode(true));

    // Grabbing data values only
    let accUP = accWRAP[0].querySelector('.cr-value').innerText,
        accDOWN = accWRAP[1].querySelector('.cr-value').innerText,
        accRATIO = accWRAP[2].title.replace(/.*\s([0-9].*)/,'$1'),
        accSEED = accWRAP[3].title.replace(/.*\s([0-9].*)/,'$1');

    // Grabbing target nodes for new values
    let gearBox = document.querySelectorAll('.wrapper-og .crc-wrapper');

    if (parseFloat(accSEED) > 450) {
        // Calculations
        let newup = creditSeed(accSEED),
            maxup = creditGet(byteGet(accUP) + byteGet(newup)),
            potup = creditGet(byteGet(newup)),
            ra = parseFloat(byteGet(newup)/byteGet(accDOWN)),
            newra = ra.toFixed(2),
            maxra = parseFloat(parseFloat(accRATIO)+ra).toFixed(4);

        // Set ratio to 2 digits
        gearBox[2].querySelector('.cr-value').innerText = parseFloat(gearBox[2].querySelector('.cr-value').innerText).toFixed(2);

        // Updating text for new slots
        gearBox[4].querySelector('.cr-value').innerText = `${maxup} (+${potup})`;
        gearBox[5].querySelector('.cr-value').innerText = `${parseFloat(maxra).toFixed(2)} (+${newra})`;

        // Updating the text that appears on hover
        gearBox[4].setAttribute('title', `Potential Upload: ${maxup} | Growth: ${potup}`);
        gearBox[5].setAttribute('title', `Potential Ratio: ${maxra} | Growth: ${ra.toFixed(4)}`);

        if (isNaN(accRATIO)) {
            gearBox[5].querySelector('.cr-value').innerText = `Inf. (+Beyond)`;
            gearBox[5].setAttribute('title', `Potential Ratio: Infinity | Growth: Beyond`);
        }
    } else {
        // Updating the text that appears on hover with not enough seedbonus
        gearBox[4].setAttribute('title', `Potential Upload: Unchanged | Growth: None`);
        gearBox[5].setAttribute('title', `Potential Ratio: Unchanged | Growth: None`);
    }

    // Adding new CSS to make everything look nice
    let midBlock = document.getElementById('middle-block'),
        midStyle = document.createElement('style');
    midStyle.type = 'text/css';
    midStyle.innerHTML = `
    #middle-block .card-panel .flex.top-dir {
      padding: 10px 20px;
      gap: 30px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: 1fr;
    }
    #middle-block .card-panel .flex.top-dir .avatar-container {
      width: 200px;
      height: 200px;
      min-width: unset;
      min-height: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 1/2;
      grid-row: 1/2;
    }
    #middle-block .card-panel .flex.top-dir .avatar-container .up-avatar {
      margin: 0 !important;
    }
    #middle-block .card-panel .flex.top-dir .pr-action-container {
      grid-column: 3/4;
      grid-row: 1/2;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 5px 0;
      width: 100%;
      gap: 10px 0;
      grid-column: 2/3;
      grid-row: 1/2;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container h5 {
      height: fit-content;
      line-height: 1;
      margin: 0 !important;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .crc-wrapper {
      display: flex;
      margin: 0;
      gap: 4px;
      height: fit-content;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .crc-wrapper .cr-value {
      height: fit-content;
      display: block;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container > div:last-child {
      margin: 0 !important;
      display: flex;
      flex-wrap: wrap;
      gap: 10px 10px;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container > div:last-child > div[style] {
      width: 100%;
      display: flex;
      gap: 5px;
      line-height: 1;
      align-items: center;
      margin: 6px 0 0 0 !important;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .short-links {
      display: flex;
      padding: 0 0 0 10px;
      margin: 0;
      gap: 10px;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .short-links .short-link-counter {
      display: flex;
      margin: 0;
      padding: 0 8px;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og {
      display: grid;
      grid-template-columns: auto auto auto auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        "upload download ratio seedbonus"
        "pupload pupload pratio pratio";
      width: fit-content;
      gap: 10px 20px;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(1) {
      grid-area: upload;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(2) {
      grid-area: download;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(3) {
      grid-area: ratio;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(4) {
      grid-area: seedbonus;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(5) {
      grid-area: pupload;
      opacity: .65;
    }
    #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og .crc-wrapper:nth-child(6) {
      grid-area: pratio;
      opacity: .65;
    }

    /* Responsive */
    @media only screen and (min-width: 992px) and (max-width: 1145px), (max-width: 700px) {
      #middle-block .card-panel .flex.top-dir {
        grid-template-columns: auto 1fr;
        grid-template-rows: 1fr auto;
      }
      #middle-block .card-panel .flex.top-dir .avatar-container {
        grid-column: 1/2;
        grid-row: 1/2;
        height: auto;
        width: auto;
        max-height: 200px;
        max-width: 200px;
      }
      #middle-block .card-panel .flex.top-dir .pr-action-container {
        grid-column: 1/2;
        grid-row: 2/3;
        flex-direction: row;
        width: 100%;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container {
        grid-column: 2/3;
        grid-row: 1/3;
        justify-content: space-between;
      }
    }
    @media only screen and (min-width: 651px) and (max-width: 740px), (min-width: 401px) and (max-width: 520px) {
      #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og {
        grid-template-columns: auto auto auto !important;
        grid-template-rows: auto auto auto auto !important;
        grid-template-areas:
          "upload download seedbonus"
          "pupload pupload pupload"
          "ratio ratio ratio"
          "pratio pratio pratio" !important;
      }
    }
    @media only screen and (max-width: 650px) {
      #middle-block .card-panel .flex.top-dir {
        grid-template-rows: auto auto auto;
        grid-template-columns: 1fr;
        gap: 20px;
      }
      #middle-block .card-panel .flex.top-dir .avatar-container {
        grid-column: 1/2;
        grid-row: 1/2;
        height: fit-content;
        margin: 0 auto;
      }
      #middle-block .card-panel .flex.top-dir .pr-action-container {
        grid-column: 1/2;
        grid-row: 3/4;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container {
        grid-column: 1/2;
        grid-row: 2/3;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container h5 {
        width: fit-content;
        margin: 0 auto !important;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og {
        width: fit-content;
        margin: 0 auto;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container > .crc-wrapper {
        width: fit-content;
        margin: 0 auto;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container > div:last-child {
        justify-content: center;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container > div:last-child > div[style] {
        width: fit-content;
        margin: 0 auto;
        padding: 0 18px;
      }
      #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og {
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto;
        grid-template-areas:
          "upload download ratio seedbonus"
          "pupload pupload pratio pratio";
      }
    }
    @media only screen and (max-width: 400px) {
      #middle-block .card-panel .flex.top-dir .profile-tib-container .wrapper-og {
        grid-template-columns: auto auto;
        grid-template-rows: auto auto auto auto;
        grid-template-areas:
          "upload download"
          "pupload pupload"
          "ratio seedbonus"
          "pratio pratio";
      }
    }
    `;

    midBlock.appendChild(midStyle);
}

// Seedbonus amount is shortened by default, but we need the longer version.
// So, we load the account-details page in the background if you're not already in the account-details page.
// Add ?background to the url so the script knows when it is in background mode.
// We don't want to do this too often, so maybe once every 30 mins.
function getFullSB() {
    function whenReady() {
        if (document.readyState !== 'complete' && document.readyState !== 'interactive') {return;}
        // Don't update on other people's account details page
        if (!window.location.search.match(/background/i) && window.location.href.replace(/.*id=/,'') !== document.querySelector('a.accc-btn[href*="account-details"]').href.replace(/.*id=/,'')) {return;}

        let getSeedItem = document.querySelector('#middle-block .crc-wrapper[title*="bonus"]'),
            getSeedBonus = getSeedItem.getAttribute('title').replace('Seedbonus: ','');

        localStorage.fullSB = getSeedBonus;
        localStorage.seedTM = (new Date()).getTime();

        if (window.location.search.match(/background/i)) {
            window.parent.postMessage('recheckSB', window.location.origin);
        } else {
            profile();
        }
    }
    whenReady();

    document.addEventListener('readystatechange', function() {
        whenReady();
    });
}

// A second copy of the function for the seedbonus page, which also has the full seedbonus amount.
function getFullSB2() {
    let getSeedItem = document.querySelector('#middle-block > div > div > h5 > span'),
        getSeedBonus = getSeedItem.innerText;

    localStorage.fullSB = getSeedBonus;
    localStorage.seedTM = (new Date()).getTime();

    profile();
}

// Create an iframe and listen for a message.
function iframinator() {
    if (window.location.search.match(/background/i)) {return;}

    let seedInterval = 30 * 60 * 1000, // 30 mins in ms
        nowTime = parseInt((new Date()).getTime()),
        targetTime = parseInt(localStorage.seedTM) + seedInterval;
    if (nowTime < targetTime) {return;}

    window.addEventListener('message', function(e) {
        if (e.data !== 'recheckSB') {return;}

        profile();
        try {document.querySelector('#seedFrame').remove();} catch {}
    });

    let framed = document.createElement('iframe');
    framed.setAttribute('src', window.location.origin + '/account-details.php?background');
    framed.setAttribute('id', 'seedFrame');
    framed.setAttribute('style', 'height: 1px; width: 1px; position: fixed; left: -200%; top: -200%; z-index: -9001; overflow: hidden;'.replace(/\;/g,' !important;'));
    document.body.appendChild(framed);
}

// Execute functions when appropriate
profile();
if (window.location.pathname.match(/seedbonus\.php/)) {
    getFullSB2();
    seed();
} else if (window.location.pathname.match(/account\-details\.php/)) {
    getFullSB();
    seedverse();
} else {
    iframinator();
}