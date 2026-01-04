// ==UserScript==
// @name 		Garmin Connect Training Impulse (TRIMP)
// @namespace 	http://users.pandora.be/divvy/userscript/
// @description Calculates advanced TRIMP score when activity has time in zones
// @include     https://connect.garmin.com/modern/activity/*
// @version 0.0.1.20171202142633
// @downloadURL https://update.greasyfork.org/scripts/35916/Garmin%20Connect%20Training%20Impulse%20%28TRIMP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35916/Garmin%20Connect%20Training%20Impulse%20%28TRIMP%29.meta.js
// ==/UserScript==

function to_minutes(text)
{
  var s = 0; // seconds
  var a = text.split(':').reverse(); // reverse to start with seconds
  
  while (a.length)
  	s = ((s * 60) + parseInt(a.pop(), 10));
  
  return Math.trunc(s / 60); // convert to minutes
}

function add_trimp()
{
  var t = document.getElementsByClassName('table-heart-rate-zones')[0];
  
  if ((t != undefined) && (t.rows.length == 5)) // table is present and not modified
  {
    var i;
    var trimp;
    var row;
    var cell;
    var scores = []
    
    // collect scores per heart rate zone
    for (i = 0; i < 5; i++)
      scores.push(to_minutes(t.rows[i].children[1].innerText) * (5 - i));
    
    // add total row, this also prevents the script from re-calculating!
    row = t.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerText = 'TRIMP';
    cell = row.insertCell(-1);
    cell.innerText = scores.reduce(function(t, c){return t + c;});
    
    // add score to each zone
    for (i = 0; i < 5; i++)
      t.rows[i].children[1].innerText += ' TRIMP:' + scores[i];
  }
}

// try to add TRIMP each time the document changes
document.addEventListener('DOMNodeInserted', add_trimp, false);