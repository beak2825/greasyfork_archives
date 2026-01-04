// ==UserScript==
// @name         Improvements to FetLife's UI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Button to add an event to Google Calendar, visited profile links shown in red, mutual kinks shown brighter, homepage feed enlarged, show pagination at the top of people lists, profile pages show date of last activity plus emoji if user's inactive
// @author       SomeFunGuy
// @license MIT
// @match        https://fetlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fetlife.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452259/Improvements%20to%20FetLife%27s%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/452259/Improvements%20to%20FetLife%27s%20UI.meta.js
// ==/UserScript==
/* global $ */

(function() {
  'use strict';
  console.log("Improve Fetlife: Start");

  var s = document.createElement("style");
  s.innerHTML="/* Added by Tampermonkey script: Improvements to FetLife's UI */ ";

  //visited profile links shown in red
  s.innerHTML+="#main-content .flex.flex-wrap a:visited {color: rgb(125,0,0) }";

  //mutual kinks shown brighter
  s.innerHTML+=".bg-gray-600 { background-color: #777; }";

  //homepage feed enlargement
  s.innerHTML+="#stories-list div { font-size: 18px; } #stories-list a.dib img { width: 150px !important; height: 150px !important; }";

  document.head.appendChild(s);

  //Improve group members e.g. page https://fetlife.com/groups/17165/members
  //or attendee list e.g. https://fetlife.com/events/1064773/rsvps
  if (pathMatch(/\/groups\/\d+\/members/) || pathMatch(/\/events\/\d+\/rsvps/) || pathMatch(/\/p\/.*\/kinksters/)) {
    copyPrevNextPageLinksToTop();
  } else if (pathMatch(/\/events\/\d+\/?/)) {
    setTimeout(addButtonCalendar, 750);
  } else if (pathMatch(/\/users\/\d+\/?/)) {
    addIdleLine();
  }

  console.log("Improve Fetlife: Complete");
})();

function pathMatch(regexp) {
  var result = window.location.pathname.match(regexp);
  //console.log(window.location.pathname, regexp, result);
  return result;
}

function addIdleLine() {
  console.log("idle?");

  const lastActive = $(".dn.db-s.mb4.visibility-block div[data-story-timestamp]");
  if(!lastActive || lastActive.length <= 0) {
    console.log("No activity found");
    setTimeout(addIdleLine, 250);
    return;
  }

  const lastActiveWrapper = lastActive.first().find(".f6.gray-500.nowrap time");
  if(!lastActiveWrapper || lastActiveWrapper.length <= 0) {
    console.log("No activity found");
    setTimeout(addIdleLine, 250);
    return;
  }

  const prettyDate = lastActiveWrapper.last().text();
  const actualDate = lastActiveWrapper.last().attr("datetime");
  console.log(prettyDate);

  const wrapper = $("body header main .flex.flex-column.items-start-ns");
  var newRow = '<div class="pt3-ns w-100 mw100-s mw30">'
  +'<div class="flex flex-row items-start f5 pv0-ns pv1">'
  +'<div class="flex-auto flex flex-row-ns flex-column">'
  +'<div class="flex-none w140-ns gray-400 f5">Last Active</div>'
  +'<div class="flex-auto mv0 gray-150 flex-auto"><div>'
  + prettyDate;

  const isOld = ((new Date() - new Date(actualDate)) / 1000 / 60 / 60 / 24 >= 60);
  if(isOld) { newRow += ' 💤'; }

  newRow += '</div></div>'
  +'</div></div><!----></div>';
  console.log(newRow);

  $("body header main .flex.flex-column.items-start-ns").prepend(newRow);
}

function copyPrevNextPageLinksToTop() {
  $("header.justify-start, header.relative, header.items-end").after( $("footer div.pagination").clone().addClass("tc").css("margin-bottom", "10px") ); //tc = text center
}

function addButtonCalendar() {
  var destination = $(".w275-l > div:first-child");

  var sidebar = $(".w275-l > div:first-child > div > div");
  if (sidebar.length == 0) {
    destination.after("<div style='color:red; border:3px solid gray'>Cannot find sidebar</div>");
    return;
  }

  //dates
  var dates;
  var i=0;
  do {
    dates = $(sidebar[i]).find("p span");
    console.log("try i="+i);
    i += 1;
  } while (i < sidebar.length && dates.length == 0);

  var start = null;
  var end = null;
  if (dates.length > 2) {
    //start and end are on different days
    dates = dates.map(function(i,node) { return node.innerHTML; });
    start = dates[2] +" "+ dates[3];
    end = dates[5] +" "+ dates[6];
  } else if (dates.length==1 || dates.length==2) {
    //start and end are on the same day
    var parts = dates[dates.length-1].innerHTML.split("<br>");
    var times = parts[1].split(" - ");
    start = parts[0] +" "+ times[0];
    end = parts[0] +" "+ times[1];
  } else {
    destination.after("<div style='color:red; border:3px solid gray'>Date field has too few elements: " + dates.length +"</div>");
    return;
  }

  //description += start +" to " + end; //debugging
  start = new Date(start).toISOString().replace(/-|:|\.\d\d\d/g,"");
  end = new Date(end).toISOString().replace(/-|:|\.\d\d\d/g,"");

  //location
  var location = $(sidebar[1]).find("p").html();
  //replace parts of HTML with needed info, and then clear out the map link and closing span tag
  location = location.replace(/\s*<br>/,": ").replace(/<br>/,", ").replace(/<span [^>]*>/,"").replace(/(, United States )?<a.*/,"");

  var url = "http://www.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent($("header h1").text())
    + "&dates=" + encodeURIComponent(start) + "/" + encodeURIComponent(end)
    + "&location=" + encodeURIComponent(location)
    + "&trp=false&sprop=&sprop=name:";

  //description can be long, so add it last
  var description = "URL: "+ window.location +"<br><br>" + $(".story__copy").html();
  url += "&details=" + encodeURIComponent(description);

  //add button!
  var btn = "<a target='_blank' data-color='lined' "
  + "class='relative no-underline items-center br1 us-none ba b-gray-750 hover-b-gray-600 b-animate bg-transparent hover-bg-transparent gray-300 hover-gray-300 fill-gray-300 fw4  tc justify-center inline-flex lh-copy f7 pv1 ph2' "
  + "href=\""+ url +"\">Add to Google Calendar</a>";
  destination.after(btn);
}
