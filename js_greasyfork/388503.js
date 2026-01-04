// ==UserScript==
// @name         HP OUTLET PRICE SORTER
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click "Outlet price" (not "Outlet sale price") to sort HP Business Outlet prices
// @author       xThomas/xTh
// @match        https://h41369.www4.hp.com/pps-offers.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388503/HP%20OUTLET%20PRICE%20SORTER.user.js
// @updateURL https://update.greasyfork.org/scripts/388503/HP%20OUTLET%20PRICE%20SORTER.meta.js
// ==/UserScript==




function loaded(){
  alert("CLICK OUTLET PRICE TO SORT FROM LEAST TO GREATEST");
  var elements = [...document.querySelectorAll(".pps-header td:nth-child(3)")];
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', function(){
      var n = 0; // number of times we ran appendChild
      let t = elements[i].parentElement.parentElement; //"TBODY"
      for (let i=1;i<t.rows.length;i++){
        let a = 1;
        let PRICES = [
          t.rows[1].children[3].innerHTML || t.rows[1].children[2].innerHTML,
          t.rows[2].children[3].innerHTML || t.rows[2].children[2].innerHTML,
          t.rows[3].children[3].innerHTML || t.rows[3].children[2].innerHTML,
          t.rows[4].children[3].innerHTML || t.rows[4].children[2].innerHTML,
          t.rows[5].children[3].innerHTML || t.rows[5].children[2].innerHTML,
          t.rows[6].children[3].innerHTML || t.rows[6].children[2].innerHTML];

        //console.log("PRICES:[," + PRICES + "]")
        for (let m=1; m<t.rows.length-n;m++){
          let x = Number
                        (t.rows[a].children[3].innerHTML.substring(1) ||
                         t.rows[a].children[2].innerHTML.substring(1));
          let y = Number
                        (t.rows[m].children[3].innerHTML.substring(1) ||
                         t.rows[m].children[2].innerHTML.substring(1));
          //console.log("m="+m+"\ta="+a+"\tx=" + x + "\ty="+y);

          if (x > y) {
            a=m;
          }
        }
        //console.log("appending " + (t.rows[a].children[3].innerHTML || t.rows[a].children[2].innerHTML));
        t.appendChild(t.rows[a]);
        n++;
      }
    });
  }
}

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        alert("Already Loaded");
        loaded();
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            alert("Just Loaded");
            loaded();
        });
    }
})();

