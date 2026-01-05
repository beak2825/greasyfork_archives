// ==UserScript==
// @name           Nemesis Spoilers V1.1
// @namespace      http://caigawalker.plus.com/
// @description    Pre-select items and auto-solve the password in the (first part of the) Nemesis Quest.
// @include        http://127.0.0.1:*/cave.php*
// @include        *.kingdomofloathing.com/cave.php*
// @version 0.0.1.20140812155236
// @downloadURL https://update.greasyfork.org/scripts/4102/Nemesis%20Spoilers%20V11.user.js
// @updateURL https://update.greasyfork.org/scripts/4102/Nemesis%20Spoilers%20V11.meta.js
// ==/UserScript==

// The latest version should be available from http://www.mobius-bandits.org/~jik/scripts/nemesis_spoilers.user.js

// Change history
// 1.0 - Original release
// 1.1 - Relaxed regex to cope with slightly different HTML presentation in item description.

// Copyright 2009-2010 Ian Walker
//
// Nemesis Spoilers is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as publised by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// Nemesis Spoilers is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
// more details.
//
// For the full text of the license, see <http://www.gnu.org/licenses/>.

var descriptions = [];
var parsed = [];
var howmany = 0;

function selectItem(items, unavailable_text) {
  var options = document.getElementsByTagName("select")[0].options;
  var success = false;
  items_lookup = [];
  for(var i in items) {
    items_lookup[items[i]] = 1;
  }
  for(var i in options) {
    if(success == false && items_lookup[options[i].value]) {
	options[i].selected = true;
	success = true;
    } else {
	options[i].selected = false;
    }
  }
  if(!success) {
    document.getElementsByTagName("select")[0].options[0].innerHTML = ' - requires ' + unavailable_text + ' - ';
  }
}

function processDescriptions()
{
  var lefts = [];
  var rights = [];
  for(var i in parsed) {
    lefts[parsed[i][0]] = i;
    rights[parsed[i][1]] = i;
  }
  for(var i in lefts) {
    if(!rights[i]) {
	var j;
	j = i;
	var password = "";
	do {
	  password += parsed[lefts[j]][2];
	  j = parsed[lefts[j]][1];
	} while(lefts[j]);
	var inputs = document.getElementsByTagName("input");
	for(j in inputs) {
	  if(inputs[j].name == "say") {
	    inputs[j].value = password;
	    break;
	  }
	}
	break;
    }
  }
}

function loadDesc(descid)
{
  GM_xmlhttpRequest({
  method: "GET",
  url: "http://" + document.location.hostname + ":" + document.location.port + "/desc_item.php?whichitem=" + descid,
//  headers: { "User-agent": "Mozilla/4.0 (compatible) Greasemonkey", "Accept": "text/html", },
  headers: { "Accept": "text/html", },
  onload: function(resp) {
    if(resp.status == "200") {
	var result = resp.responseText.match(/<img [^>]*src="[^>]*\/left_([^.]+)\.gif".*?<img [^>]*src="[^>]*\/right_([^.]+)\.gif".*?<b>([A-Z]+)<\/b>/);
	if(result) {
	  descriptions[descid] = result[0];
	  parsed[descid] = [result[1], result[2], result[3]];
	  document.getElementById('container' + descid).innerHTML = descriptions[descid];
	  howmany++;
	  if(howmany == 8) {
	    processDescriptions();
	  }
	}
    }
  }});
}

function createDescContainer()
{
  var tds = document.getElementsByTagName("td");
  for(var i in tds) {
    if(tds[i].innerHTML.indexOf("<p>This appears to be a large stone door") == 0) {
	tds[i].innerHTML += "<table id='descriptions' cellpadding=8 cellspacing=0 style='border-left: 1px solid blue; border-top: 1px solid blue;'><tr>" +
	  "<td id='container148513878' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(torn)</i></td>" +
	  "<td id='container153915446' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(rumpled)</i></td>" +
	  "<td id='container776620628' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(creased)</i></td>" +
	  "<td id='container411336587' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(folded)</i></td></tr><tr>" +
	  "<td id='container298163869' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(crinkled)</i></td>" +
	  "<td id='container564255755' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(crumpled)</i></td>" +
	  "<td id='container626990413' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(ragged)</i></td>" +
	  "<td id='container647825911' style='border-right: 1px solid blue; border-bottom: 1px solid blue;' height=117 width=200><i>(ripped)</i></td></tr></table>";
	loadDesc(148513878);
	loadDesc(153915446);
	loadDesc(776620628);
	loadDesc(411336587);
	loadDesc(298163869);
	loadDesc(564255755);
	loadDesc(626990413);
	loadDesc(647825911);
    }
  }
}

(function() {
  var imagepath = document.getElementsByTagName("img")[0].src;
  if(imagepath.indexOf("mus_door1.gif") != -1) {
    selectItem([37], "viking helmet");
  } else if(imagepath.indexOf("mys_door1.gif") != -1) {
    selectItem([560], "stalk of asparagus");
  } else if(imagepath.indexOf("mox_door1.gif") != -1) {
    selectItem([565], "dirty hobo gloves");
  } else if(imagepath.indexOf("mus_door2.gif") != -1) {
    selectItem([316], "insanely spicy bean burrito");
  } else if(imagepath.indexOf("mys_door2.gif") != -1) {
    selectItem([319], "insanely spicy enchanted bean burrito");
  } else if(imagepath.indexOf("mox_door2.gif") != -1) {
    selectItem([1256], "insanely spicy jumping bean burrito");
  } else if(imagepath.indexOf("sc_door3.gif") != -1) {
    selectItem([2478], "clown whip");
  } else if(imagepath.indexOf("tt_door3.gif") != -1) {
    selectItem([2477], "clownskin buckler");
  } else if(imagepath.indexOf("sa_door3.gif") != -1) {
    selectItem([420], "tomato juice of powerful power");
  } else if(imagepath.indexOf("pm_door3.gif") != -1) {
    selectItem([579], "boring spaghetti");
  } else if(imagepath.indexOf("db_door3.gif") != -1) {
    selectItem([684, 681, 799, 798, 1017, 683, 679, 682, 680, 797, 1016, 1018], "an advanced cocktail");
  } else if(imagepath.indexOf("at_door3.gif") != -1) {
    var tds = document.getElementsByTagName("td");
    for(var i in tds) {
	if(tds[i].innerHTML.indexOf("You step forward and touch the door. Nothing happens, so you knock on it, then kick it, and then attempt to find a hidden catch amongst the engravings. None of this seems to help.") != -1) {
	  tds[i].innerHTML += "<p><i>Requires Polka of Plenty to pass</i>";
	  break;
	}
    }
  }
  createDescContainer();
  return;
}) ();