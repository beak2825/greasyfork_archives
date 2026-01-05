// ==UserScript==
// @name        RS07 Poll Rounding
// @namespace   rs07pr
// @description Fixes rounding errors (upwards), on RS07 polls
// @name        RS07 Poll Rounding
// @include     http://services.runescape.com/m=poll/oldschool/results.ws?id=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5204/RS07%20Poll%20Rounding.user.js
// @updateURL https://update.greasyfork.org/scripts/5204/RS07%20Poll%20Rounding.meta.js
// ==/UserScript==

$('fieldset').each(
  function() {
    
    table = $(this)[0].getElementsByTagName('table')[0];
    yes   = table.getElementsByTagName('tr')[0].getElementsByTagName('td')[2];
    no    = table.getElementsByTagName('tr')[1].getElementsByTagName('td')[2];
    
    votes_yes   = parseInt(yes.textContent.match(/^\d+% \((\d+) votes\)$/)[1]);
    votes_no    = parseInt(no.textContent.match(/^\d+% \((\d+) votes\)$/)[1]);
    votes_total = votes_yes + votes_no;
    
    votes_yes_pct = ((votes_yes / votes_total) * 100).toFixed(2);
    votes_no_pct  = (100 - votes_yes_pct).toFixed(2);
    
    pass_color = (votes_yes_pct >= 75) ? "green" : "red";
    pass_votes = Math.ceil(votes_total * .75);
    passing_by = Math.abs(pass_votes - votes_yes);
    
    yes.innerHTML = votes_yes_pct + "% (" + numberWithCommas(votes_yes) + " votes)\n[" + "<span style=color:" + pass_color + ";><b>" + numberWithCommas(passing_by) + "</b></span>" + "]";
    no.innerHTML  = votes_no_pct + "% (" + numberWithCommas(votes_no) + " votes)";
    
  }
);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
