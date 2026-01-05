// ==UserScript==
// @name         FetishSort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @locale       English (en)
// @description  make FetLife's jaggiest feature a little bit less jaggy
// @author       WhyTrustTomHanks
// @match        https://*.fetlife.com
// @match        https://fetlife.com
// @match        http://*.fetlife.com
// @match        http://fetlife.com
// @match        https://*.fetlife.com/*
// @match        https://fetlife.com/*
// @match        http://*.fetlife.com/*
// @match        http://fetlife.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/28325/FetishSort.user.js
// @updateURL https://update.greasyfork.org/scripts/28325/FetishSort.meta.js
// ==/UserScript==


function isEmpty(str) {
  return (!str || 0 === str.length);
}




function makeBlock(interests) {
  var block = [];

  for (i = 0; i < interests.length; i++) {
    block[block.length] = " <a href=" + interests[i][0] + ">" + interests[i][1] + "</a>";
  }
  block[block.length-1] = block[block.length-1].slice(0,-2);

  var blockOpen = "<div style='margin-left: 20px; margin-top: 5px;'>";
  var blockClose = "</div>";

  var blockWrapped = blockOpen + block.toString() + blockClose;

  return blockWrapped;
}

$.fn.formatList = function(){
  var into = [];
  var giving = [];
  var receiving = [];
  var wearing = [];
  var watching = [];
  var everything = [];

  $(this).children('a').each(function(){
    if ($(this).next().is('span')) {
      var fetishType = $(this).next().text();
      if (fetishType == "(giving)") {
        giving[giving.length] = [$(this).attr('href') ,$(this).text()];
      }
      if (fetishType == "(receiving)") {
        receiving[receiving.length] = [$(this).attr('href') ,$(this).text()];
      }
      if (fetishType == "(wearing)") {
        wearing[wearing.length] = [$(this).attr('href') ,$(this).text()];
      }
      if (fetishType == "(watching others wear)") {
        watching[watching.length] = [$(this).attr('href') ,$(this).text()];
      }
      if (fetishType == "(everything to do with it)") {
        everything[everything.length] = [$(this).attr('href') ,$(this).text()];
      }
    }
    else {
      into[into.length] = [$(this).attr('href') ,$(this).text()];
    }
  });

  listInto = "";
  listGiving = "";
  listReceiving = "";
  listWearing = "";
  listWatching = "";
  listEverything = "";

  if (!isEmpty(into)) {
    into = makeBlock(into);
    listInto = "<div style='margin-bottom: 10px;'></div>"
                + into;
  }

  if (!isEmpty(giving)) {
    giving = makeBlock(giving);
    listGiving = "</a></div><br><span class='quiet'><em>Giving</em></span>"
                 + giving;
  }

  if (!isEmpty(receiving)) {
    receiving = makeBlock(receiving);
    listReceiving = "</a></div><br><span class='quiet'><em>Receiving</em></span>"
                    + receiving;
  }

  if (!isEmpty(wearing)) {
    wearing = makeBlock(wearing);
    listWearing = "</a></div><br><span class='quiet'><em>Wearing</em></span>"
                  + wearing;
  }

  if (!isEmpty(watching)) {
    watching = makeBlock(watching);
    listWatching = "</a></div><br><span class='quiet'><em>Watching others wear</em></span>"
                   + watching;
  }

  if (!isEmpty(everything)) {
    everything = makeBlock(everything);
    listEverything = "</a></div><br><span class='quiet'><em>Everything to do with</em></span>"
                     + everything;
  }

  completedList = listInto + listGiving + listReceiving + listWearing + listWatching + listEverything;

  $(this).html(completedList);

};



$('p > .quiet > em:contains("Into:")').each(function(){
  $(this).parent().parent().formatList();
});

$('p > .quiet > em:contains("Curious about:")').each(function(){
  $(this).parent().parent().before("<br><h3>Curious about</h3>");
  $(this).parent().parent().formatList();
});

/*$('p > .quiet > em:contains("Soft limits:")').each(function(){
  $(this).parent().parent().before("<br><h3>Soft limits</h3>");
  $(this).parent().parent().formatList();
});

$('p > .quiet > em:contains("Hard limits:")').each(function(){
  $(this).parent().parent().before("<br><h3>Hard limits</h3>");
  $(this).parent().parent().formatList();
});*/

$('p > .quiet > em:contains("Soft limits:")').each(function(){
  $(this).parent().parent().before("<br><h3>Soft limits</h3>");
  $(this).html('');
});

$('p > .quiet > em:contains("Hard limits:")').each(function(){
  $(this).parent().parent().before("<br><h3>Hard limits</h3>");
  $(this).html('');
});

