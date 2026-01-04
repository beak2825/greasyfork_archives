// ==UserScript==
// @author         Magno
// @copyright      2017, Magno
// @name           EscapeGames24 Filter
// @description    Filter EscapeGames24 Games to your liking, add multiple filters comma separated
// @version        2.2.1
// @namespace      MagnoScripts
// @include        http://*.escapegames24.com/*
// @grant          GM.getValue
// @grant          GM.setValue
// @run-at         document-end
// @license        MIT 
// @downloadURL https://update.greasyfork.org/scripts/38922/EscapeGames24%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/38922/EscapeGames24%20Filter.meta.js
// ==/UserScript==

(async ()=>{
var FilterDiv = document.getElementById('sidebar1');
var DefaultFilter = "carmel,inka,monkey go happy,esklavos,adventure";

var FilterActive = (await GM.getValue("EG24FILTER_active",true));
var FilterValue = (await GM.getValue("EG24FILTER_value",DefaultFilter));

var CheckValue = "";
if (FilterActive) CheckValue = "CHECKED";

// Inject Filter options in EG24 site
FilterDiv.innerHTML = '<div class="widget HTML" data-version="1" id="EG24Filter"><h2 class="title">EG24 Filter</h2><div class="widget-content">Active: <input type=checkbox id=EG24FILTER_active ' + CheckValue + '><br/><input type=text id=EG24FILTER_value value="' + FilterValue + '" PlaceHolder="Insert Filter Here"><br/><input type=button id=EG24FILTER_apply value="Apply Changes"><input type=button id=EG24FILTER_reset value="Reset Settings"></div></div>' + FilterDiv.innerHTML;

var ApplyButton = document.getElementById('EG24FILTER_apply');
if (ApplyButton.addEventListener) {
  ApplyButton.addEventListener('click',ApplyNewSettings,false);
} else {
  ApplyButton.attachEvent('onclick',ApplyNewSettings);
}

var ResetButton = document.getElementById('EG24FILTER_reset');
if (ResetButton.addEventListener) {
  ResetButton.addEventListener('click',ResetSettings,false);
} else {
  ResetButton.attachEvent('onclick',ResetSettings);
}

function ApplyNewSettings() {
  var ActiveCheck = document.getElementById('EG24FILTER_active');
  if (ActiveCheck.checked) {
    GM.setValue("EG24FILTER_active",true);  
  } else {
    GM.setValue("EG24FILTER_active",false);
  }
  GM.setValue("EG24FILTER_value",document.getElementById('EG24FILTER_value').value);  
  location.reload();
}

function ResetSettings() {
  GM.setValue("EG24FILTER_active",true);
  GM.setValue("EG24FILTER_value",DefaultFilter); 
  location.reload();
}

if (!FilterActive) return;

var ToFilter = FilterValue.split(',');

var foundElements = document.getElementsByClassName('post');
for (index = 0; index < foundElements.length; ++index) {
  toSearch = foundElements[index].innerHTML.toLowerCase();
  ContainsFilter = false;

  for (FilterIndex = 0; FilterIndex < ToFilter.length; ++FilterIndex) {
      ContainsFilter = ContainsFilter || toSearch.indexOf(ToFilter[FilterIndex].toLowerCase()) != -1;
  }

  foundElements[index].hidden = !ContainsFilter;
}
})();