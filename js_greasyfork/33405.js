// ==UserScript==
// @name        Live Advanced Style Settings on userstyles.org
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description Update "Show CSS Code" box when there are Advanced Style Settings (2017-11-11)
// @include     https://userstyles.org/styles/*
// @version     0.6
// @copyright   Copyright 2017 Jefferson Scher
// @license     BSD 3-clause
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33405/Live%20Advanced%20Style%20Settings%20on%20userstylesorg.user.js
// @updateURL https://update.greasyfork.org/scripts/33405/Live%20Advanced%20Style%20Settings%20on%20userstylesorg.meta.js
// ==/UserScript==

function updatestuff(e){
  if (e) console.log('Event target='+e.target.nodeName);
  var ctrls = document.querySelectorAll('#style-settings input[type="text"], #style-settings select');
  var namevalue = new Array();
  for(var i=0; i<ctrls.length; i++){
    switch (ctrls[i].nodeName) {
      case "INPUT":
        // Does not work for color choosers, maybe because the value of the text input is changed by a script
        if (ctrls[i].type == "text") {
          namevalue.push(ctrls[i].name + "=" + encodeURIComponent(ctrls[i].value));
        }
        break;
      case "SELECT":
        namevalue.push(ctrls[i].name + "=" + encodeURIComponent(ctrls[i].value));
        break;
    }
  }
  var request = new XMLHttpRequest();
  if (request){
    var sPage = document.querySelector("meta[property='og:url']").getAttribute("content");
    if (!sPage || sPage.length === 0) sPage = 'https://userstyles.org' + location.pathname;
    var styloc = sPage.substr(0, sPage.lastIndexOf("/")) + ".css?" + namevalue.join("&");
    request.open("GET", styloc, true);
    request.onreadystatechange = function() {
      if (request.readyState==4) {
        var tgtEl = document.getElementById("stylish-code");
        tgtEl.className = "cssVisible";
        if (request.status==200) {
          tgtEl.value = request.responseText;
        } else {
          tgtEl.value += "Unexpected Response Status: " + request.status + " " + request.statusText;
        }
        request = null;
      }
    }
    request.send(null);
  } else {
    console.log("Can't create XMLHttpRequest!");
  }
}
function prepIt(){
  if (document.getElementById('style-settings')){
    document.getElementById('advancedsettings_area').className = 'advancedsettings_shown';
    updatestuff();
    document.getElementById('advancedsettings_area').addEventListener('change', updatestuff, false);
  }
}
window.setTimeout(prepIt, 1000);
window.setTimeout(prepIt, 2000); // in case there is a very slow load...
