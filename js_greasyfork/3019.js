// ==UserScript==
// @name        MTurk Dashboard Change Notifier (with 12-value mod)
// @namespace   clickhappier
// @author      clickhappier + ThirdClassInternationalMasterTurker
// @description Shows changes since last page load for 12 values in Earnings To Date, Your HIT Status for Today, and HITs You Have Submitted.
// @include     https://www.mturk.com/mturk/dashboard
// @version     2.1.1c
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3019/MTurk%20Dashboard%20Change%20Notifier%20%28with%2012-value%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3019/MTurk%20Dashboard%20Change%20Notifier%20%28with%2012-value%20mod%29.meta.js
// ==/UserScript==

// 2014-07-14 2.1c - Improved Today-change handling for negative value changes in Rejected/Pending, and fractional bonus handling, by clickhappier.
// 2014-07-04 2.0c - Modified extensively by clickhappier to add tracking a lot more values. Also cleaned up some oddly-written parts.
//                   Previously tracked 4 values:
//                      Total Earnings section: Approved dollars, Bonuses dollars, Total dollars. 
//                      Your HIT Status section: Today's Submitted.
//                   Now tracks 12 values: 
//                      Total Earnings section: Approved dollars, Bonuses dollars, Total dollars, Earnings Available for Transfer dollars.
//                      Your HIT Status section: Today's Submitted, Today's Approved, Today's Rejected, Today's Pending.
//                      HITs You Have Submitted section: HITs Submitted, ... Approved, ... Rejected, ... Pending.

// 2012-09-09 First public release by ThirdClassInternationalMasterTurker
// 2012-09-20 1.0 First vorking version
// 2012-12-02 1.1 Added @downloadURL and @updateURL


// replacement for inconsistently-rounding built-in toFixed function, from stackoverflow, for better fractional bonus handling

function toFixed ( number, precision ) {
    var multiplier = Math.pow( 10, precision + 1 ),
        wholeNumber = Math.floor( number * multiplier );
    return Math.round( wholeNumber / 10 ) * 10 / multiplier;
}

// TCIMT's calling of toFixed plus comma removal

function to_fixed(str) {
  str = str.slice(1).replace(',', '');
  return parseFloat(str).toFixed(2);
}


var rows = document.evaluate('//tr[@class]',
           document,
           null,
           XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); 


// initial definitions of variables from localStorage items

// Total Earnings section

if (localStorage['prev_approvedDollars'] === undefined)
  prev_approvedDollars = "$0";
else
  prev_approvedDollars = localStorage.getItem('prev_approvedDollars');

if (localStorage['prev_bonusesDollars'] === undefined)
  prev_bonusesDollars = "$0";
else
  prev_bonusesDollars = localStorage.getItem('prev_bonusesDollars');

if (localStorage['prev_totalDollars'] === undefined)
  prev_totalDollars = "$0";
else
  prev_totalDollars = localStorage.getItem('prev_totalDollars');

if (localStorage['prev_transferDollars'] === undefined)
  prev_transferDollars = "$0";
else
  prev_transferDollars = localStorage.getItem('prev_transferDollars');

// Your HIT Status section

if (localStorage['prev_submittedToday'] === undefined)
  prev_submittedToday = 0;
else
  prev_submittedToday = parseInt(localStorage.getItem('prev_submittedToday'));

if (localStorage['prev_approvedToday'] === undefined)
  prev_approvedToday = 0;
else
  prev_approvedToday = parseInt(localStorage.getItem('prev_approvedToday'));

if (localStorage['prev_rejectedToday'] === undefined)
  prev_rejectedToday = 0;
else
  prev_rejectedToday = parseInt(localStorage.getItem('prev_rejectedToday'));

if (localStorage['prev_pendingToday'] === undefined)
  prev_pendingToday = 0;
else
  prev_pendingToday = parseInt(localStorage.getItem('prev_pendingToday'));

// HITs You Have Submitted section

if (localStorage['prev_submittedHITs'] === undefined)
  prev_submittedHITs = 0;
else
  prev_submittedHITs = parseInt(localStorage.getItem('prev_submittedHITs'));

if (localStorage['prev_approvedHITs'] === undefined)
  prev_approvedHITs = 0;
else
  prev_approvedHITs = parseInt(localStorage.getItem('prev_approvedHITs'));

if (localStorage['prev_rejectedHITs'] === undefined)
  prev_rejectedHITs = 0;
else
  prev_rejectedHITs = parseInt(localStorage.getItem('prev_rejectedHITs'));

if (localStorage['prev_pendingHITs'] === undefined)
  prev_pendingHITs = 0;
else
  prev_pendingHITs = parseInt(localStorage.getItem('prev_pendingHITs'));
  

// perform comparisons and update localStorage items

for (var i=0; i<rows.snapshotLength; i++) {
  var row = rows.snapshotItem(i);
  
  // Total Earnings section

  if (row.cells.length == 2) {

    if (row.cells[0].textContent.match('Approved HITs')) 
    {
      var new_approvedDollars = row.cells[1].childNodes[0].textContent;
      if (new_approvedDollars != prev_approvedDollars) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+$" + (to_fixed(new_approvedDollars) - to_fixed(prev_approvedDollars)).toFixed(2) + "</span>";
      }
      localStorage.setItem('prev_approvedDollars', new_approvedDollars);
    }

    if (row.cells[0].textContent.match('Bonuses')) 
    {
      var new_bonusesDollars = row.cells[1].childNodes[0].textContent;
      if (new_bonusesDollars != prev_bonusesDollars) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+$" + (to_fixed(new_bonusesDollars) - to_fixed(prev_bonusesDollars)).toFixed(2) + "</span>";
      }
      localStorage.setItem('prev_bonusesDollars', new_bonusesDollars);
    }

    if (row.cells[0].textContent.match('Total Earnings')) 
    {
      var new_totalDollars = row.cells[1].childNodes[0].textContent;
      if (new_totalDollars != prev_totalDollars) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+$" + (to_fixed(new_totalDollars) - to_fixed(prev_totalDollars)).toFixed(2) + "</span>";
      }
      localStorage.setItem('prev_totalDollars', new_totalDollars);
    }

    if (row.cells[0].textContent.match('Earnings Available for Transfer')) 
    {
      var new_transferDollars = row.cells[1].childNodes[0].textContent;
      if (new_transferDollars > prev_transferDollars) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+$" + (to_fixed(new_transferDollars) - to_fixed(prev_transferDollars)).toFixed(2) + "</span>";
      }
      else if (new_transferDollars < prev_transferDollars) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">$" + (to_fixed(new_transferDollars) - to_fixed(prev_transferDollars)).toFixed(2) + "</span>";
      }
      localStorage.setItem('prev_transferDollars', new_transferDollars);
    }
  }
  
  // Your HIT Status section

  if (row.cells.length == 6) {

    if (row.cells[0].textContent.match('Today')) 
    {
      var new_submittedToday = parseInt(row.cells[1].textContent);
      if (new_submittedToday > prev_submittedToday) 
      {
        row.cells[1].innerHTML = "<span style=\"color:grey;float:left;\">+" + (new_submittedToday - prev_submittedToday) + "</span>" + row.cells[1].innerHTML;
      }
      localStorage.setItem('prev_submittedToday', new_submittedToday);
    }
      
    if (row.cells[0].textContent.match('Today')) 
    {
      var new_approvedToday = parseInt(row.cells[2].textContent);
      if (new_approvedToday > prev_approvedToday) 
      {
        row.cells[2].innerHTML = "<span style=\"color:grey;float:left;\">+" + (new_approvedToday - prev_approvedToday) + "</span>" + row.cells[2].innerHTML;
      }
      localStorage.setItem('prev_approvedToday', new_approvedToday);
    }
      
    if (row.cells[0].textContent.match('Today')) 
    {
      var new_rejectedToday = parseInt(row.cells[3].textContent);
      if (new_rejectedToday > prev_rejectedToday) 
      {
        row.cells[3].innerHTML = "<span style=\"color:grey;float:left;\">+" + (new_rejectedToday - prev_rejectedToday) + "</span>" + row.cells[4].innerHTML;
      }
      else if (new_submittedToday < prev_submittedToday)
      {
        // don't display negative value change if rejected amount went down only because the 'Today' date changed
      }
      else if (new_rejectedToday < prev_rejectedToday)
      {
        row.cells[3].innerHTML = "<span style=\"color:grey;float:left;\">" + (new_rejectedToday - prev_rejectedToday) + "</span>" + row.cells[4].innerHTML;
      }
      localStorage.setItem('prev_rejectedToday', new_rejectedToday);
    }

    if (row.cells[0].textContent.match('Today')) 
    {
      var new_pendingToday = parseInt(row.cells[4].textContent);
      if (new_pendingToday > prev_pendingToday) 
      {
        row.cells[4].innerHTML = "<span style=\"color:grey;float:left;\">+" + (new_pendingToday - prev_pendingToday) + "</span>" + row.cells[4].innerHTML;
      }
      else if (new_submittedToday < prev_submittedToday)
      {
        // don't display negative value change if pending amount went down only because the 'Today' date changed
      }
      else if (new_pendingToday < prev_pendingToday) 
      {
        row.cells[4].innerHTML = "<span style=\"color:grey;float:left;\">" + (new_pendingToday - prev_pendingToday) + "</span>" + row.cells[4].innerHTML;
      }
      localStorage.setItem('prev_pendingToday', new_pendingToday);
    }
  }
  
  // HITs You Have Submitted section

  if (row.cells.length == 3) {

    if (row.cells[0].textContent.match('HITs Submitted')) 
    {
      var new_submittedHITs = row.cells[1].childNodes[0].textContent;
      if (new_submittedHITs > prev_submittedHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+" + (new_submittedHITs - prev_submittedHITs) + "</span>";
      }
      localStorage.setItem('prev_submittedHITs', new_submittedHITs);
    }

    if (row.cells[0].textContent.match('... Approved')) 
    {
      var new_approvedHITs = row.cells[1].childNodes[0].textContent;
      if (new_approvedHITs > prev_approvedHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+" + (new_approvedHITs - prev_approvedHITs) + "</span>";
      }
      localStorage.setItem('prev_approvedHITs', new_approvedHITs);
    }

    if (row.cells[0].textContent.match('... Rejected')) 
    {
      var new_rejectedHITs = row.cells[1].childNodes[0].textContent;
      if (new_rejectedHITs > prev_rejectedHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+" + (new_rejectedHITs - prev_rejectedHITs) + "</span>";
      }
      else if (new_rejectedHITs < prev_rejectedHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">" + (new_rejectedHITs - prev_rejectedHITs) + "</span>";
      }
      localStorage.setItem('prev_rejectedHITs', new_rejectedHITs);
    }

    if (row.cells[0].textContent.match('... Pending')) 
    {
      var new_pendingHITs = row.cells[1].childNodes[0].textContent;
      if (new_pendingHITs > prev_pendingHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">+" + (new_pendingHITs - prev_pendingHITs) + "</span>";
      }
      else if (new_pendingHITs < prev_pendingHITs) 
      {
        row.cells[0].innerHTML += "<span style=\"color:grey;float:right;\">" + (new_pendingHITs - prev_pendingHITs) + "</span>";
      }
      localStorage.setItem('prev_pendingHITs', new_pendingHITs);
    }
  }
  
}
