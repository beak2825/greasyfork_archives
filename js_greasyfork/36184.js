// ==UserScript==
// @name 				Garmin Connect Basic Training Impulse (TRIMP)
// @namespace 	http://users.pandora.be/divvy/userscript/
// @description Calculates basic TRIMP score
// @include     https://connect.garmin.com/modern/activity/*
// @version 0.0.1.20171209095325
// @downloadURL https://update.greasyfork.org/scripts/36184/Garmin%20Connect%20Basic%20Training%20Impulse%20%28TRIMP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36184/Garmin%20Connect%20Basic%20Training%20Impulse%20%28TRIMP%29.meta.js
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
  var hr_elem = document.getElementById('heartRateStatsPlaceholder');
  var time_elem = document.getElementById('timingStatsPlaceholder');
  var small_stats_elem = document.getElementById('activitySmallStatsViewPlaceholder');
  
  if (document.getElementById('basic-trimp') != undefined)
    return;
  
  if ((hr_elem != undefined) && (time_elem != undefined) && (small_stats_elem != undefined))
  {
    var avg_hr = parseInt(hr_elem.getElementsByClassName('data-bit')[0].innerText.split(' ')[0], 10);
    var minutes = to_minutes(time_elem.getElementsByClassName('data-bit')[0].innerText);
    var basic_trimp = avg_hr * minutes;
    var div;
    var e;
    
    div = document.createElement('div');
    div.id = 'basic-trimp';
    div.className = 'data-block large';
    small_stats_elem.getElementsByClassName('data-block large')[0].parentElement.appendChild(div);
    
    e = document.createElement('div');
    e.className = 'data-bit';
    e.innerText = basic_trimp;
    div.appendChild(e);
    
    e = document.createElement('span');
    e.className = 'data-label';
    e.innerText = 'Basic TRIMP';
    div.appendChild(e);
  }
}

// try to add TRIMP each time the document changes
document.addEventListener('DOMNodeInserted', add_trimp, false);