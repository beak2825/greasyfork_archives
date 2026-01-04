// ==UserScript==
// @name        Duolingo Switch Windows
// @namespace   http://tampermonkey.net/
// @match       https://*.duolingo.com/*
// @grant       none
// @license     MIT
// @require https://cdn.jsdelivr.net/npm/tailwindcss-cdn@3.4.10/tailwindcss.js
// @version     1.0
// @author      DuoSolverGrinder
// @description It switches automatically between learn and league windows with the goal to be online for other users, and they think
// you're watching for them to try to avoid those users who like to make points while you're offline.
// For other options you can visit the links https://github.com/DuoSolverGrinder/DuoSolverGrinder,  https://duosolver.is-great.net/
// @downloadURL https://update.greasyfork.org/scripts/518743/Duolingo%20Switch%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/518743/Duolingo%20Switch%20Windows.meta.js
// ==/UserScript==
let state = 0;
let activate = false;
let switchWindowInterval = null;
let switchBetweenTimesInSeconds = 60;

let bttnSwitch = 'switchWindow-switch-bttn';

let html = `
<div id="switchWindow-container" class="inline-flex flex-col gap-y-4 justify-end fixed left-5 bottom-4 z-[211] border border-1 p-4 bg-indigo-400 dark:bg-gray-900">
    <button id="switchWindow-switch-bttn" class="px-4 py-2 rounded-md border border-2 bg-blue-600 text-gray-200  dark:bg-gray-100 dark:text-gray-800">Activate</button>
  <p>To grind xp, use next links:</p>
  <div class="flex justify-center gap-x-2">
       <a  onclick="alert('It switches automatically between learn and league windows with the goal to be online for other users and they think you are watching for them, to try to avoid those users who like to make points while you are offline. It changes every minute.Click on button Activate to start.')" href="#">
          <img class="rounded-md w-7 h-7" src="https://duosolvergrinder.github.io/DuoSolverGrinder/help.png" >
      </a>
      <a target="_blank" href="https://github.com/DuoSolverGrinder/DuoSolverGrinder">
         <svg  class="text-red-500 w-8 h-8" fill="none" viewBox="0 0 120 120"
            stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>
      </a>
      <a target="_blank" href="https://duosolver.is-great.net">
          <img class="rounded-md w-7 h-7" src="https://duosolvergrinder.github.io/DuoSolverGrinder/dsg.png" >
      </a>
  </div>

</div>
`
function toggleMenu()
{
  let bttn = document.getElementById(bttnSwitch);
  if(activate) {
     activate = false;
     bttn.textContent = 'Activate';
     clearInterval(switchWindowInterval);
     switchWindowInterval = null;
    return;
  }
  activate = true;
  bttn.textContent = 'Deactivate';
  switchWindowInterval = setInterval(()=>{
                            state = state == 0 ? 2: 0;
                            document.getElementsByClassName("_2dvyl")[state].click()
                       }, switchBetweenTimesInSeconds * 1000)
}

function insertButtons()
{
  let container = document.getElementById('switchWindow-container');
  if(!container) {
     document.body.insertAdjacentHTML('beforeend',html);
     let bttn = document.getElementById(bttnSwitch);
     bttn.addEventListener('click', toggleMenu );
     activate ? bttn.textContent = "Deactivate" : "Activate";
  }

}

window.onload = (event) => {
  setInterval(insertButtons, 1000);
}