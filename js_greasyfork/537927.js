// ==UserScript==
// @name     GC - Faerieland Employment Agency Target Price Calculator
// @description Provides an amount of neopoints needed for the job to let you break even on the Grundo's Cafe version of the Faerieland Employment Agency.
// @namespace    https://www.grundos.cafe/
// @version  1.1
// @match https://www.grundos.cafe/faerieland/employ/jobs/?page=*
// @match https://grundos.cafe/faerieland/employ/jobs/?page=*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant    none
// @license 0BSD
// @author sinza
// @downloadURL https://update.greasyfork.org/scripts/537927/GC%20-%20Faerieland%20Employment%20Agency%20Target%20Price%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/537927/GC%20-%20Faerieland%20Employment%20Agency%20Target%20Price%20Calculator.meta.js
// ==/UserScript==

const jobListings = $(".fea_thejob");

const superJob = window.location.href.endsWith("&type=super")

if (superJob) {
  targetPrice(8)
} else {
  targetPrice(10)
}

function targetPrice(location) {
  jobListings.each((index, value) => {
    const job = $(value);
    // Gets the amount needed of an item.
    const itemAmount = Number(job.contents()[1].textContent.match(/\d+/));
    // Gets the amount of Neopoints to be rewarded
    const neopointAward = Number(job.contents()[location].textContent.replace(",", "").match(/\d+/));
    const targetPrice = neopointAward / itemAmount;
    job.append("<p><b>Target Price:</b> " + targetPrice + " NP</p>")
  })
}
