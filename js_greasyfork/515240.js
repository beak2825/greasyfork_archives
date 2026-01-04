// ==UserScript==
// @name         Prognocis Printable Ledger v3
// @namespace    prognocis.com
// @version      2025.01.24.0905
// @description  adds css code to correct page layout, adds letterhead and patient name and chart number, adds print button at bottom of page to print correctly
// @author       mrkrag
// @match        *.prognocis.com/prognocis/scrPrint.jsp?mode=pataccactivity*
// @icon         https://prognocis.com/wp-content/uploads/2020/07/cropped-Fav-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515240/Prognocis%20Printable%20Ledger%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/515240/Prognocis%20Printable%20Ledger%20v3.meta.js
// ==/UserScript==
// THIS SECTION INSERTS CSS CODE TO GET THE PAGE TO PRINT CORRECTLY INSTEAD OF 150% WIDE
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('tr.CLAIM {background-color: lightgray;} table.MAIN {width: 100%;} #Total > td {border-style: solid; border-width: 1px 0px 0px 0px; font-weight: bold;} #printClean{border: 2px solid #1ab26b; color: #1ab26b; font-weight: bold; width: 200px; height: 30px; margin: 20px auto; text-align: center; vertical-align: middle;} #printClean:hover{cursor: pointer; background-color: #1ab26b; color: #ffffff;}');
addGlobalStyle('@media print {#printClean{display: none;}}');
// END INSERT CSS


// THIS SECTION ADDS OUR OWN PRINT BUTTON ON THE RESULTING SCREEN VIEW OF THE LEDGER
var bigdiv = document.createElement("div");
bigdiv.innerHTML = '<div id="printClean" role="button" onclick="window.print()">PRINT CLEANLY</div>';
document.body.appendChild (bigdiv);
// END CUSTOM PRINT BUTTON

// THIS SECTION ADDS LETTERHEAD
// prognocis stores the letterhead image used on progress notes in the "testdiagrams" directory
// if the clinic login page is mydrclinic.prognocis.com, the file would be mydrclinic_letterhead.gif
// if the letterhead is updated, a number is added, so the next revision would be mydrclinic_letterhead1.gif, _letterhead2.gif, etc.
// edit the img scr= below to match your clinic or point to any other image url you want as letterhead
let today = new Date().toLocaleDateString()
var ltrhead = document.createElement("table");
ltrhead.setAttribute('width', '100%');
ltrhead.innerHTML = '<tr><td colspan=2 align=center><img src="testdiagrams/handsonortho_letterhead1.gif"></td></tr><tr><td colspan=2 align=center><span style="font-size:14pt; font-weight:bold;">Patient Account Activity as of ' +
today +
'</span></td></tr><tr><td width=50%><b>Patient:</b>&nbsp;<u>' +
    localStorage.getItem('patientName') +
    '</u></td><td width=50% align=right><b>Chart #</b><u>' +
    localStorage.getItem('patientAcct') +
    '</u></td></tr>';
document.body.prepend(ltrhead);
// 10-30-2024 the second field named ptinfo is still null
// END LETTERHEAD