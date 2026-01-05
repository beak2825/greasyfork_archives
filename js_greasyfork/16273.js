// ==UserScript==
// @name        Bahn.de Reiseauskunft Suchergebnisse wiederherstellen
// @description Verhindert den Verfall der Sucherergebnisse bzw. den Fehler: Leider konnten Ihre Suchergebnisse zwischenzeitlich nicht mehr gespeichert werden. Wir bitten Sie daher, eine neue Anfrage zu starten. 
// @namespace   cuzi
// @oujs:author cuzi
// @version     4
// @license     GPL-3.0
// @include     /^https?\:\/\/reiseauskunft\.bahn\.de\/bin\/query2?\.exe\/.*/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16273/Bahnde%20Reiseauskunft%20Suchergebnisse%20wiederherstellen.user.js
// @updateURL https://update.greasyfork.org/scripts/16273/Bahnde%20Reiseauskunft%20Suchergebnisse%20wiederherstellen.meta.js
// ==/UserScript==

(function() {
"use strict";

  var data = JSON.parse(GM_getValue("data","{}"));
  var set = function(key, value) {
    var time = (new Date()).getTime();
    data[key] = {"url": value, "time": time};
    GM_setValue("data", JSON.stringify(data));
  };
  var get = function(key) {
    if(key in data) {
      var value = data[key];
      var del = [key];
      var time = (new Date()).getTime()  - 1000*60*60*24*30; // Keep last 30 days
      for(var k in data) {
        if(data[k].time < time) {
          del.push(k);
        }
      }
      del.forEach(function(k) { 
        delete data[k]; 
      });
      GM_setValue("data", JSON.stringify(data));
      return value.url;
    }
    return false;    
  };
  if(document.getElementById('searchNewCon')) {
    // Replace F5 press with the action of the "Aktualisieren" button (if the button exists)
    window.addEventListener('keydown', function(ev) {
      if((ev.which || ev.keyCode) == 116) {
        ev.preventDefault();
        document.getElementById('searchNewCon').click();
      }
    });
    if(document.getElementById('locS0') && document.getElementById('locZ0')) {
      document.title = document.getElementById('locS0').value + String.fromCharCode("8594") + document.getElementById('locZ0').value;
    }    
  }
  if(document.location.href.indexOf('revia=') != -1 && unsafeWindow.currentIdent) {
    // Page: First overview of connections after a new request
    var id = unsafeWindow.currentIdent;
    var url = document.location.href;
    set(id, url); // Save the current URI
  } else if(document.querySelector(".hafasContent.error") || document.querySelector("#content .errorMessage")) {
    // Page: Error: Leider konnten Ihre Suchergebnisse zwischenzeitlich nicht mehr gespeichert werden.
    var id = document.location.href.match(/ident=(.*?)&/)[1];
    if(id) {
      var url = get(id);
      if(url) {
        document.location.href = url; // Restore first request URI
      }
    }
  }

})();
