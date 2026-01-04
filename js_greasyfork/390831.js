// ==UserScript==
// @name         Value Rating for SteamDB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a column for Value - (Average Play Time per $)
// @author       enki1337
// @match        *://steamdb.info/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390831/Value%20Rating%20for%20SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/390831/Value%20Rating%20for%20SteamDB.meta.js
// ==/UserScript==

function showValue(row) {
  var value_td = row.children("td:nth-child(7)");
  var appid = row.attr("data-appid");
  var js_hover = $("#js-hover-app-" + appid);

  var time = js_hover.find(".hover_steamspy > div:nth-child(3) > strong").text();
  time = time.slice(0, time.indexOf(" "));
  var cost = parseFloat(row.children("td:nth-child(5)").text().slice(1));
  var value = time / cost;
  value_td.attr("data-sort", Math.round(value * 1000).toString());
  if (value != 0) {
	  value_td.text(value.toFixed(2).toString() + " hr/$");
  } else {
    value_td.text("-- hr/$");
  }
}

function failShowValue(row) {
  var value_td = row.children("td:nth-child(7)");
  value_td.text("-- hr/$");
}

function waitForElementToDisplay(selector, time, maxTries, func, failfunc, args) {
	if (maxTries == 0) {
    failfunc(args);
    return;
  }
  if(document.querySelector(selector)!=null) {
    func(args);
    return;
  }
  else {
    setTimeout(function() {
      waitForElementToDisplay(selector, time, maxTries - 1, func, failfunc, args);
    }, time);
  }
}


$(document).ready(function() {
  
  	//Add the value table header.
  
  	var rating_th = $("#DataTables_Table_0 > thead th:nth-child(6)");
  	var value_th = rating_th.clone();
  	var value_span = value_th.children("span");
  	value_th.attr("aria-label", " Value: activate to sort column ascending");
  	value_span.attr("aria-label", "SteamDB Value");
  	value_span.text("Value");
  	rating_th.after(value_th);
  
  	// For each row, add the value td
  	var rows = $("#DataTables_Table_0 > tbody > tr");

  	rows.each(function () {
      var rating_td = $(this).children("td:nth-child(6)");
      var value_td = rating_td.clone();
      value_td.html("<span style='font-size: small'>[hover to show]</span>");
      rating_td.after(value_td);
			var js_hover_selector = "#js-hover-app-" + $(this).attr("data-appid");
      $(this).mouseenter(function() {
        waitForElementToDisplay(js_hover_selector, 300, 7, showValue, failShowValue, $(this));
      });

    });

});