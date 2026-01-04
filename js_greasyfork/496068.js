// ==UserScript==
// @name         Scenexe2.io ads remover!
// @namespace    http://tampermonkey.net/
// @version      V1.46.2
// @description  by bon
// @author       Bon
// @license      MIT
// @match        https://scenexe2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe2.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496068/Scenexe2io%20ads%20remover%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496068/Scenexe2io%20ads%20remover%21.meta.js
// ==/UserScript==
setInterval(function () {
g1.innerHTML = ""
g0.innerHTML = ""
g2.innerHTML = ""
console.log("removed ads");
console.clear()}, 500);
setInterval(function () {
//document.querySelector(".google-revocation-link-placeholder").remove()
document.querySelector(".adsbygoogle").remove()
console.clear()
console.log("removed ads")}, 1000);
document.querySelector("#modals > div > a:nth-child(6)").remove()
document.querySelector("#modals > div > a:nth-child(5)").remove()
document.querySelector("#modals > div > a:nth-child(4)").remove()
document.querySelector("#modals > div > a:nth-child(3)").remove()
document.querySelector("#modals > div > a:nth-child(2)").remove()
document.querySelector("#modals > div > a:nth-child(1)").remove()
setTimeout(function () {document.querySelector("body > div.google-revocation-link-placeholder > div > ins > img:nth-child(4)").click()}, 2000)
// bottom right buttons
(function bean() {

  // Get all elements that have a style attribute
  var elms = document.querySelectorAll("*[style]");

  // Loop through them
  Array.prototype.forEach.call(elms, function(elm) {
    // Get the color value
    var clr = elm.style.fontWeight || "";

    // Remove all whitespace, make it all lower case
    clr = clr.replace(/\s/g, "").toLowerCase();

    // Switch on the possible values we know of
    switch (clr) {
      case "700":
        elm.remove();
        break;
    }
  });
})();
let varcounter = 1
        console.log("ad remover made by bon")
function Boom() {
       if (varcounter > 7) {
            varcounter = 0;
        } else (varcounter++)
        console.log(varcounter)
  let elementtochange = document.getElementById("serverSelectTitle")
 let textvar1 = "Bye bye ads!"
 let textvar2 = "Thx for playing!"
 let textvar3 = "Respawn then"
 let textvar4 = "Made by bon :3"
 let textvar5 = "Select a server"
 let textvar6 = "Welcome"
 let textvar7 = "Scenexe3 POV"
 let textvar8 = "Nut allergy"
  // the real counting now!
 if (varcounter == 0) {elementtochange.textContent = textvar1}
 if (varcounter == 2) {elementtochange.textContent = textvar2}
 if (varcounter == 3) {elementtochange.textContent = textvar3}
 if (varcounter == 4) {elementtochange.textContent = textvar4}
 if (varcounter == 5) {elementtochange.textContent = textvar5}
 if (varcounter == 6) {elementtochange.textContent = textvar6}
 if (varcounter == 7) {elementtochange.textContent = textvar7}
 if (varcounter == 1) {elementtochange.textContent = textvar8}

}

setInterval(Boom, 5000)
