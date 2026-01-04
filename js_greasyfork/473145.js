// ==UserScript==
// @name        Furrydelphia Add To Calendar
// @namespace   https://ashley.rogers.cafe/
// @match       https://events.furrydelphia.org/schedule/panel/*
// @grant       none
// @version     1.0
// @author      Ashley Rogers
// @license     MIT
// @description Adds a button to the Furrydelphia panel page allowing you to quickly add it to your Google Calendar.
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/473145/Furrydelphia%20Add%20To%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/473145/Furrydelphia%20Add%20To%20Calendar.meta.js
// ==/UserScript==

jQuery(document).ready(function() {
  let startTime = moment($(".card.bg-success h4")[0].innerText, "MMM. D, YYYY, hh:mm a");
  let duration = moment($(".card.bg-success h4")[1].innerText, "H [Hour,] m [Minutes]");

  let endTime = moment(startTime).add(duration.hours(), "hours").add(duration.minutes(), "minutes");
  let dates = startTime.format("YYYYMMDD[T]HHmmss") + "-04:00/" + endTime.format("YYYYMMDD[T]HHmmss") + "-04:00";
  let titleFields = $(".card-body .col-md-6:nth-child(1) .col-md-8");
  let title = titleFields.length > 0 ? titleFields[0].innerText : "Unknown";
  let desc = titleFields.length > 1 ? titleFields[1].innerText : "";
  let cat = $(".card.bg-success h4")[2].innerText;


let fields = {
	text: "Furrydelphia: " + title,
	dates: dates,
	location: cat,
	ctz: "America/New_York",
	details: window.location.href + "\n\n" + desc
};

  let parts = Object.keys(fields).map(f => {
    return encodeURIComponent(f) + "=" + encodeURIComponent(fields[f]).replace(/'/g, '%27');
  });

  let url = "https://calendar.google.com/calendar/r/eventedit?" + parts.join("&");
  jQuery(jQuery(".card-body")[0]).append("<div class='row'><div class='col-md-12'><a class='btn btn-sm btn-success' href='" + url + "'>Add to Calendar</a></div></div>");
});