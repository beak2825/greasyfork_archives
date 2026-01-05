// ==UserScript==
// @name         FellowshipOne Report Queue: Auto refresh
// @namespace    data@chapel.org
// @version      0.5
// @description  Refreshes Page every 5 seconds until the latest report in the queue is complete. Will beep when report is complete.
// @author       Tony Visconti
// @match        https://reportlibrary.fellowshipone.com/ReportLibrary/ReportsQueue/Index.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29227/FellowshipOne%20Report%20Queue%3A%20Auto%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/29227/FellowshipOne%20Report%20Queue%3A%20Auto%20refresh.meta.js
// ==/UserScript==

function reloadPage() {
    setTimeout(function()
      {
        window.location.href = 'https://reportlibrary.fellowshipone.com/ReportLibrary/ReportsQueue/Index.aspx?refresh=true';
      }, 5000);
}

var img = document.querySelector("#ctl00_MainContent_grdReports > tbody > tr:nth-child(2) > td:nth-child(1) > img");

if(img !== null &&(img.alt === "Pending" || img.alt === "Submitted"))
{
    console.log("Page Reloading");
    reloadPage();
}
else
{
    if(window.location.href.includes('refresh'))
    {
        console.log("Report Complete");
        document.querySelector("body").innerHTML += '<audio id="audio" src="https://www.soundjay.com/button/beep-07.wav" autoplay="true" ></audio>';
    }
}