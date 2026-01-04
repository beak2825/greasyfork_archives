// ==UserScript==
// @name         TorrentBD - SeedBonus to Upload Credit Converter
// @namespace    Violentmonkey Scripts
// @version      1.01
// @description  Take a quick look at how much Upload Credit you would have based on your SeedBonus amount
// @author       ac1d10.sk, ItsTHEAvro
// @include      https://*.torrentbd.*/*
// @run-at       document-end
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/452300/TorrentBD%20-%20SeedBonus%20to%20Upload%20Credit%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/452300/TorrentBD%20-%20SeedBonus%20to%20Upload%20Credit%20Converter.meta.js
// ==/UserScript==

/* jshint esversion:6 */

//CreateElement function
const CreateElement = (initObj) => {
    var element = document.createElement(initObj.Tag);
    for (var prop in initObj) {
        if (prop === "childNodes") {
            initObj.childNodes.forEach(node => {
                element.appendChild(node);
                return;
            });
        }
        if (prop === "attributes") {
            initObj.attributes.forEach(attr => {
                element.setAttribute(attr.key, attr.value);
                return;
            });
        }
        element[prop] = initObj[prop];
    }
    return element;
};

//SB calc
const sb = document.querySelector("#user-sb");
if (sb.typeOf == 'undefined') console.log('SB error state: ' + sb);

let sbAmt = parseFloat(sb.innerText);

let calc = parseInt(sbAmt / 100000) * 300;
sbAmt %= 100000;
calc += parseInt(sbAmt / 34500) * 100;
sbAmt %= 34500;
calc += parseInt(sbAmt / 18000) * 50;
sbAmt %= 18000;
calc += parseInt(sbAmt / 7600) * 20;
sbAmt %= 7600;
calc += parseInt(sbAmt / 4000) * 10;
sbAmt %= 4000;
calc += parseInt(sbAmt / 2100) * 5;
sbAmt %= 2100;
calc += parseInt(sbAmt / 1100) * 2.5;
sbAmt %= 1100;
calc += parseInt(sbAmt / 450) * 1;
sbAmt %= 450;

let metric = "GiB";

if (calc >= 1048576) {
    calc = (calc / 1048576).toFixed(2);
    metric = "PiB";
} else if (calc >= 1024) {
    calc = (calc / 1024).toFixed(2);
    metric = "TiB";
}
const infoTable = document.querySelector('.table.profile-info-table tbody');

const insertedRow = CreateElement({
    Tag: 'tr',
    childNodes: [(CreateElement({
            Tag: 'td',
            innerText: 'Converts to',
        })),
        (CreateElement({
            Tag: 'td',
            innerHTML: `:
				  <a href="seedbonus.php">${calc} ${metric}</a>
				  `,
        }))
    ],
});
infoTable.insertBefore(insertedRow, infoTable.childNodes[9]);
