// ==UserScript==
// @name        Folding@Home V8.3 show WU points
// @namespace   Violentmonkey Scripts
// @match       https://v8-3.foldingathome.org/machines*
// @grant       none
// @version     1.0
// @author      Ken_g6
// @license     MIT
// @description This script calculates and displays a F@H V8.3 WU's points beneath each WU's progress bar.
// @downloadURL https://update.greasyfork.org/scripts/522532/Folding%40Home%20V83%20show%20WU%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/522532/Folding%40Home%20V83%20show%20WU%20points.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var time_unit = { 'w': 3600*24*7, 'd': 3600*24, 'h': 3600, 'm': 60, 's': 1 };

    function add_pts() {
      let c = document.getElementsByClassName("progress-cell");
      for (let i = 0; i < c.length; i++) {
        if(c[i].childElementCount == 1 && c[i].childNodes[0].className == 'progress-bar') {
          let ptsdiv = document.createElement('div');
          ptsdiv.classList.add('pts-est');
          c[i].appendChild(ptsdiv);
        }
        if(c[i].childElementCount == 2 && c[i].childNodes[1].className == 'pts-est') {
          let ptsdiv = c[i].childNodes[1];
          // Now calculate points based on PPD, progress, and estimated completion time.
          var ppd=parseInt(c[i].nextSibling.innerText.replaceAll(',',''), 10);
          var eta_arr = c[i].title.split(' ');
          var eta=0;
          for(var j=1; j < eta_arr.length; j+=2) {
            eta += time_unit[eta_arr[j+1].substr(0,1)] * parseInt(eta_arr[j], 10);
          }
          var progress = parseFloat(c[i].children[0].innerText) / 100;
          
          var pts = 0;
          // if in 24 hours = 24*3600 seconds we'll get ppd points
          // then in eta/(1-progress) seconds we'll get (eta/(1-progress))/(24*3600)*ppd points.
          if(progress < .98) {
            var pts = ppd * (eta/(1-progress))/time_unit['d'];
            pts=Math.round(pts);
            pts = pts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            ptsdiv.innerHTML = pts + " points (est)";
          }
        }
      }
    }

    setInterval(add_pts, 10000);
})();