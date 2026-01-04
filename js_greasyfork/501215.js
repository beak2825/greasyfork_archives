// ==UserScript==
// @name         Unspoil matches in Cagematch
// @description  Unspoils matches in cards and wrestler pages
// @version      1.8
// @match        *://*.cagematch.net/*
// @icon         https://www.google.com/s2/favicons?domain=www.cagematch.net
// @license      GPL-3
// @namespace https://greasyfork.org/users/1336798
// @downloadURL https://update.greasyfork.org/scripts/501215/Unspoil%20matches%20in%20Cagematch.user.js
// @updateURL https://update.greasyfork.org/scripts/501215/Unspoil%20matches%20in%20Cagematch.meta.js
// ==/UserScript==

function displayNone(el) {
  el.style.display = 'none'
}

function unspoil(html) {
  return html.replace(/ defeats? | besieg(?:en|t) /gmi, ' vs. ').replace(/ [au]nd /gm, ' vs. ').split(' vs. ').sort().join(' vs. ');
}

function clean(el) {
  var newHtml = el.innerHTML;
  newHtml = newHtml.replace(/ \[.*?\]/g, "");
  newHtml = newHtml.replace(/( ?:- )?(?:No Contest|Time Limit Draw|by referee's decision|by Count Out|by Referee Stoppage|Double Count Out|Draw|Double Count Out|Draw|Double Knock Out|Double Knockout|Double KO|Double Pinfall|by DQ|by TKO|Double Pin|by KO|Double DQ|by forfeit|Curfew Time Limit Draw|by points|by Ringrichterenstcheid|Double Give Up| - )/gi, "");

  var timeMatch = newHtml.match(/ (?<time>\(\d+):\d{2}\)/);
  if (timeMatch !== null)
  {
    var time =	timeMatch.groups["time"];
    newHtml = unspoil(newHtml.replace(/ (?<time>\(\d+:\d{2}\)).*/, '').trimEnd()).concat(' ').concat(time).concat('m)');
  }
  else
  {
    newHtml = unspoil(newHtml);
  }
  el.innerHTML = newHtml;
}

document.querySelectorAll('.MatchTitleChange').forEach(displayNone);
document.querySelectorAll('.MatchNotes').forEach((el) => !el.innerText.includes("Info:") ? displayNone(el) : null );
document.querySelectorAll('.MatchResults').forEach(clean);
document.querySelectorAll('.MatchCard').forEach(clean);
