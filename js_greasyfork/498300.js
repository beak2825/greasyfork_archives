// ==UserScript==
// @name        anketa cvut easy explore
// @namespace   Violentmonkey Scripts
// @match       https://anketa.is.cvut.cz/html/anketa/results/semesters/*
// @grant       none
// @version     1.0
// @author      -
// @license     Unlicense
// @description Allows for easier navigation between different semesters of the same page using keyboard
// @downloadURL https://update.greasyfork.org/scripts/498300/anketa%20cvut%20easy%20explore.user.js
// @updateURL https://update.greasyfork.org/scripts/498300/anketa%20cvut%20easy%20explore.meta.js
// ==/UserScript==

const today = new Date();
const max_page_sem = (today.getFullYear() - 2000) * 10 + (today.getMonth() < 2 ? -10 + 1 : -10 + 2) + (today.getMonth() > 8 ? 9 : 0); // TODO: move this into kv storage so we dont have to compute every time?
const min_page_sem = 182;
console.log(max_page_sem)

function add_sem(sem, offset) {
  const which_sem = sem % 2 + Math.abs(offset % 2);
  const year = Math.floor(sem / 10) + Math.floor((offset + (1 - sem % 2)) / 2);


  return year * 10 + which_sem;
}

document.addEventListener("keydown", function(event) {

  let sem_offset;
  if        (event.keyCode == 37) { // left -- move by semester
    sem_offset = -1;
  } else if (event.keyCode == 39) { // right
    sem_offset = +1;
  } else if (event.keyCode == 38) { // up -- move by year
    sem_offset = +2;
  } else if (event.keyCode == 40) { // down
    sem_offset = -2;
  } else {
    return;
  }


  const semre = /\/results\/semesters\/B(\d{2}[1-2])\//;
  cur_page_sem = Number(window.location.toString().match(semre)[1]);

  let new_sem = add_sem(cur_page_sem, sem_offset);
  if (new_sem > max_page_sem) { new_sem = max_page_sem; }
  else if (new_sem < min_page_sem) { new_sem = min_page_sem; }

  window.location = window.location.toString().replace(semre, '/results/semesters/B' + new_sem + '/');
});