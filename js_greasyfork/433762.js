// ==UserScript==
// @name           Keyma.sh Average Tracker
// @description    Tracks your average score for keyma.sh competitions
// @author         Octahedron
// @version        1.0.0
// @icon           http://tampermonkey.net/favicon.ico
// @match          https://keyma.sh/*
// @grant          none
// @run-at         document-idle
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @namespace https://greasyfork.org/users/824280
// @downloadURL https://update.greasyfork.org/scripts/433762/Keymash%20Average%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/433762/Keymash%20Average%20Tracker.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, -W097 */

(function($) {
  'use strict'
  // pro tip: ignore my bad code
  let checked = false;
  let tests = [];
  load();

  let html = "<div style='display:flex;color:white;margin-right:auto;margin-left:auto;width:fit-content;text-align:center'> <div style='margin-right:30px'> <p>AVG WPM</p> <p id='wpmao5'>ao5: ...</p> <p id='wpmao10'>ao10: ...</p> <p id='wpmao15'>ao15: ...</p> </div> <div style='margin-right:30px'> <p>AVG ACC</p> <p id='accao5'>ao5: ...</p> <p id='accao10'>ao10: ...</p> <p id='accao15'>ao15: ...</p> </div> <div style='margin-right:30px'> <p>AVG TIME</p> <p id='timeao5'>ao5: ...</p> <p id='timeao10'>ao10: ...</p> <p id='timeao15'>ao15: ...</p> </div> <div style='margin-right:30px'> <p>AVG MISTAKES</p> <p id='mistakeao5'>ao5: ...</p> <p id='mistakeao10'>ao10: ...</p> <p id='mistakeao15'>ao15: ...</p> </div> <div style='margin-right:30px'> <p>Tests</p> <p id='testCount'>...</p> </div></div>"

  function getWPM() {
      let wpmHolder = document.querySelector("#matchEnd > div.bg-black.bg-opacity-20.h-auto.md\\:min-h-128.p-4.sm\\:p-6.md\\:p-8 > div.text-white > div > div.col-span-full.md\\:col-span-1 > div > div:nth-child(1) > div.text-4xl.text-orange-400.font-bold > span:nth-child(1)");
      let accHolder = document.querySelector("#matchEnd > div.bg-black.bg-opacity-20.h-auto.md\\:min-h-128.p-4.sm\\:p-6.md\\:p-8 > div.text-white > div > div.col-span-full.md\\:col-span-1 > div > div:nth-child(2) > div.text-4xl.text-orange-400.font-bold > span:nth-child(1)");
      let timeHolder = document.querySelector("#matchEnd > div.bg-black.bg-opacity-20.h-auto.md\\:min-h-128.p-4.sm\\:p-6.md\\:p-8 > div.text-white > div > div.col-span-full.md\\:col-span-1 > div > div:nth-child(3) > div.text-4xl.text-orange-400.font-bold > span:nth-child(1)");
      let mistakeHolder = document.querySelector("#matchEnd > div.bg-black.bg-opacity-20.h-auto.md\\:min-h-128.p-4.sm\\:p-6.md\\:p-8 > div.text-white > div > div.col-span-full.md\\:col-span-1 > div > div:nth-child(4) > div.text-4xl.text-orange-400.font-bold > span:nth-child(1)");

      if(wpmHolder) {
          if(!checked) {
              checked = true;
              $("#matchEnd").append(html);
              setTimeout(function() {
                  let test = {};
                  test.wpm = parseFloat(wpmHolder.innerText);
                  test.acc = parseFloat(accHolder.innerText);
                  test.time = parseFloat(timeHolder.innerText);
                  test.mistakes = parseFloat(mistakeHolder.innerText);
                  console.log(test);

                  tests.push(test);
                  save();
                  console.log(tests);

                  getData();

              }, 2000);
          }
      } else {
          checked = false;
      }
  }
  setInterval(getWPM, 100);

  function getData() {
      getAvg(5);
      getAvg(10);
      getAvg(15);
      $("#testCount").text(tests.length);
  }

  function getAvg(num) {
      let wpmSum = 0;
      let accSum = 0;
      let timeSum = 0;
      let mistakesSum = 0;
      for(let i = tests.length - 1; i > tests.length - (num + 1) && i >= 0; i--) {
          wpmSum += tests[i].wpm;
          accSum += tests[i].acc;
          timeSum += tests[i].time;
          mistakesSum += tests[i].mistakes;
      }
      $(`#wpmao${num}`).text(`ao${num}: ${(wpmSum / Math.min(num, tests.length)).toFixed(2)}`);
      $(`#accao${num}`).text(`ao${num}: ${(accSum / Math.min(num, tests.length)).toFixed(2)}`);
      $(`#timeao${num}`).text(`ao${num}: ${(timeSum / Math.min(num, tests.length)).toFixed(2)}`);
      $(`#mistakeao${num}`).text(`ao${num}: ${(mistakesSum / Math.min(num, tests.length)).toFixed(2)}`);
  }

  function save() {
      localStorage.setItem('data', JSON.stringify(tests));
  }

  function load() {
      tests = JSON.parse(localStorage.getItem('data')) || tests;
  }

}).bind(this)(jQuery)

jQuery.noConflict()