// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        TUAMADRE.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415820/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/415820/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

  console.clear()
  var year = (new Date()).getFullYear();
  var month = (new Date()).getMonth();
  var day = (new Date()).getDate();
  var hours = (new Date()).getHours();
  var minutes = (new Date()).getMinutes();
  var seconds = (new Date()).getSeconds();
  var milliseconds = (new Date()).getMilliseconds();
  var now = new Date();
  var x = "Total Width: " + screen.width;
  var y = "Total Height: " + screen.height;

  window.name = "lal";
  var txt;

  console.error("You made a mistake");
  console.warn("no non è vero")
    var i = 0
console.time();
for (i = 0; i < 1; i++) {

  console.log(year ,"/", month, "/", day);
  console.log(hours, ":", minutes, ":", seconds, "/", milliseconds);


}
console.timeEnd();
console.log(x, y)
var person = prompt("che cazzo di link vuoi aprire?", "https://");

if (person == null || person == "") {
  console.log("la disabilità di quest uomo è op");
} else {
  console.log("aprendo la pagina", person);
  open(person)

}
  console.clear()




})();