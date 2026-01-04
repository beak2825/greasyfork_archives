// ==UserScript==
// @name        Border Color and Completion Stats
// @namespace   https://github.com/luigiMinardi
// @match       https://www.boot.dev/dashboard*
// @grant       none
// @version     0.0.3
// @author      luigiMinardi
// @license     MIT
// @description Add green border to fully completed courses and show completion stats on Console
// @homepageURL https://greasyfork.org/en/scripts/513899-border-color-and-completion-stats
// @downloadURL https://update.greasyfork.org/scripts/513899/Border%20Color%20and%20Completion%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/513899/Border%20Color%20and%20Completion%20Stats.meta.js
// ==/UserScript==

let count = document.querySelector("#__nuxt > div > div.static-bgimage.bg-image-blue > div.h-full-minus-bar.flex > div > div.mx-auto.mb-8.mt-2.w-full.max-w-7xl.px-4.py-10 > div.mt-4.grid.grid-cols-1.gap-8.lg\\:grid-cols-6 > div.lg\\:col-span-3 > div:nth-child(1) > div.grid.grid-cols-1.gap-5").querySelectorAll("p.min-w-fit");

let toDo = 0;

let total = 0;

let completed = 0;

for (const i of count){
  let nArr = i.innerHTML.replaceAll(" ","").split("/");

  toDo += parseInt(nArr[1]);
  toDo -= parseInt(nArr[0]);
  total += parseInt(nArr[1]);
  completed += parseInt(nArr[0]);


  // If content is completed
  if (nArr[0] == nArr[1]) {

    let courseBox = i.parentElement.parentElement.parentElement.parentElement;

    // Apply green border on completed courses
    courseBox.style.borderColor = "rgba(92, 173, 106, 0.5)";

    courseBox.addEventListener('mouseover',function(){
      courseBox.style = "";
    })
    courseBox.addEventListener('mouseleave',function(){
      courseBox.style.borderColor = "rgba(92, 173, 106, 0.5)";
    });
  }
}


console.log("Data:","\nStill need to do: " + toDo,"\nCompleted:" + completed, "\nTotal: " + total);