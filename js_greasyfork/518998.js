// ==UserScript==
// @name        DuoSolver
// @name:es     DuoSolver
// @name:es-419 DuoSolver
// @name:fr     DuoSolver
// @name:vi     DuoSolver
// @name:fr-CA  DuoSolver
// @namespace   Violentmonkey Scripts
// @match       https://*.duolingo.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @require     https://cdn.tailwindcss.com
// @version     1.1.2
// @author      DuoSolverGrinder, has as base DuoPower modified totally.
// @description It solves practice lessons automatically or manually, to increase xp at different speed use DuoSolverGrinder tool (https://duosolver.is-great.net).
// @description:es Soluciona lecciones de práctica automáticamente o manualmente, para incrementar xp a velocidades diferentes usa la herramienta DuoSolverGrinder (https://duosolver.is-great.net).
// @description:es-419 Soluciona lecciones de práctica automáticamente o manualmente, para incrementar xp a velocidades diferentes usa la herramienta DuoSolverGrinder (https://duosolver.is-great.net).
// @description:fr Résolvez les leçons pratiques automatiquement ou manuellement, pour augmenter l'XP à différentes vitesses, utilisez l'outil DuoSolverGrinder (https://duosolver.is-great.net).
// @description:fr-CA Résolvez les leçons pratiques automatiquement ou manuellement, pour augmenter l'XP à différentes vitesses, utilisez l'outil DuoSolverGrinder (https://duosolver.is-great.net).
// @description:vi Giải bài thực hành tự động hoặc thủ công, để tăng xp ở các tốc độ khác nhau hãy sử dụng công cụ DuoSolverGrinder (https://duosolver.is-great.net).
// @downloadURL https://update.greasyfork.org/scripts/518998/DuoSolver.user.js
// @updateURL https://update.greasyfork.org/scripts/518998/DuoSolver.meta.js
// ==/UserScript==

let solveTimerId;
let isAutoMode  = GM_getValue('isAutoMode', false);
let isPanelShow = GM_getValue('isPanelShow', true);
let solveSpeedList = {'speedSlow': 2000, 'speedMedium': 1000, 'speedFast': 500, 'speedFastest': 0 }
let solveSpeed  = GM_getValue('solveSpeed', 'speedMedium');
let tokens_clicked = [];
const duoSolverGrinderUrl = "https://duosolver.is-great.net";

const version = '1.1.2';
const mainLessonFormClass = "[id='root'] > div > div > div > div > div:first-child._3v4ux";

let panelHtml = `
<div id="panelShowBttns" class="flex flex-col gap-y-2 z-[111] fixed xl:bottom-4 right-5 bottom-48 hidden">
  <button id="panelShowBttn" class="font-bold text-gray-800 shadow-lg rounded-full px-2 bg-indigo-200 border border-2" >+</button>
  <a target="_blank"class="px-1" href=${duoSolverGrinderUrl}/>
       <img class="rounded-md w-7 h-7" src="https://duosolvergrinder.github.io/DuoSolverGrinder/dsg.png" >
  </a>
</div>
<div id="panelDuoSolver" class="inline-flex flex-col gap-y-4 justify-center rounded-xl fixed xl:bottom-4 right-5 bottom-28 z-[111] border border-1 p-4 bg-indigo-400 dark:bg-gray-900">
  <button id="panelHideBttn" title="hide" class="w-6 self-center rounded-lg  bg-gray-600 text-gray-200">-</button>
  <button id="startBttn" class="px-4 py-2 rounded-md border border-2 bg-blue-600 text-gray-200  dark:bg-gray-300 dark:text-gray-800">Start</button>
  <section class="inline-flex rounded-md shadow-sm" role="group">
      <button id="speedSlow"  type="button"  class="speedSelector px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg   dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:focus:ring-blue-500 dark:focus:text-white">
          Slow
      </button>
      <button id="speedMedium" type="button"   class="speedSelector px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200   dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:focus:ring-blue-500 dark:focus:text-white">
          Medium
      </button>
      <button id="speedFast" type="button"  class="speedSelector px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200   dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:focus:ring-blue-500 dark:focus:text-white">
          Fast
      </button>
      <button id="speedFastest" type="button"  class="speedSelector px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg   dark:bg-gray-800 dark:border-gray-700 dark:text-white  dark:focus:ring-blue-500 dark:focus:text-white">
          Fastest
      </button>
  </section>
  <p class="dark:text-gray-200 text-center">More than 100 Xp and faster on:</p>
  <div class="flex justify-center gap-x-2">
      <a target="_blank" href="https://github.com/DuoSolverGrinder/DuoSolverGrinder/">
         <svg  class="dark:hidden text-red-500 w-8 h-8" fill="none" viewBox="0 0 120 120"
            stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/>
        </svg>
        <svg class="hidden dark:block w-8 h-8" fill="none" viewBox="0 0 120 120" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff"/>
        </svg>
      </a>
      <a target="_blank" href=${duoSolverGrinderUrl}/>
          <img class="rounded-md w-7 h-7" src="https://duosolvergrinder.github.io/DuoSolverGrinder/dsg.png" >
      </a>
  </div>
  <p class="dark:text-gray-200 text-center">Sign in with token:</p>
  <div class="flex justify-center gap-x-2">
      <button id="bttnInfo">
         <svg class=" w-8 h-8" fill="#8000ff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 416.979 416.979" xml:space="preserve" stroke="#8080ff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path> </g> </g></svg>
      </button>
      <button id="bttnLoginWithToken" target="_blank" href=${duoSolverGrinderUrl}/>
          <img class="rounded-md w-7 h-7" src="https://duosolvergrinder.github.io/DuoSolverGrinder/dsg.png" >
      </button>
  </div>
  <div class="flex justify-center">
        <span class="dark:text-gray-200">v${version}</span>
  </div>
</div>
`;


let solvesBttnHtml = `
    <button id="solveBttn" style="--web-ui_button-background-color: rgb(var(--color-gold)); --web-ui_button-border-color: rgb(var(--color-gold))"  class="_1rcV8 _1VYyp _1ursp _7jW2t _3DbUj _38g3s lg:block hidden">Solve</button>
    <button id="solveAllBttn" class="_1rcV8 _1VYyp _1ursp _7jW2t _3DbUj _38g3s _2oGJR">Solve All</button>
`;

let infoMssg = `Accounts created using google or facebook services are not succesfully logged in DuoSolverGrinder. For these types of accounts  signing with
 duolingo's token is possible now!
 Just click on the icon "DSG" and a new tab will be opened to confirm the logged in DuoSolverGrinder tool.
 For those who Need For Speed, DuoSolverGrinder is offering different amount to increase xp, packages with more than 100 xp, from the slowest to the fastest as possible!`;

function insertPanelAndBttns()
{
  let panel = document.getElementById('panelDuoSolver');
  if(!panel) {
     document.body.insertAdjacentHTML('beforeend', panelHtml);
     document.getElementById('startBttn').addEventListener('click', startStopMain );
     document.getElementById('panelShowBttn').addEventListener('click', toggleShowHidePanel );
     document.getElementById('panelHideBttn').addEventListener('click', toggleShowHidePanel );
     document.getElementById('bttnInfo').addEventListener('click', ()=> alert(infoMssg));
     document.getElementById('bttnLoginWithToken').addEventListener('click', signInWithToken);
     document.querySelectorAll('.speedSelector').forEach((element)=> element.addEventListener('click', speedSolveChange));
     updatePanelDisplay();
     updateSpeedBttnsActive();
  }
  if (window.location.pathname === '/lesson' || window.location.pathname === '/practice') {
    addButtons();
    panel ? panel.children[1].style.display = 'none' : null;
    return;
  }
  panel ? panel.children[1].style.display = '': null;
}

window.onload = (event) => {
  GM_addStyle('img { max-width: none}');
}

setInterval(insertPanelAndBttns, 1000);

function signInWithToken()
{
   let jwtToken = document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1];
   window.open(`${duoSolverGrinderUrl}/loginToken?signIn=${jwtToken}`, '_blank').focus()
}


function speedSolveChange()
{
  solveSpeed = this.id;
  GM_setValue('solveSpeed', solveSpeed);
  updateSpeedBttnsActive();
}

function updateSpeedBttnsActive()
{
  const speedBttns = document.querySelectorAll('.speedSelector');
  speedBttns.forEach((element)=> {
         if(element.id == solveSpeed) {
            element.classList.remove('bg-white', 'text-gray-900', 'font-semibold', 'dark:bg-gray-800');
            element.classList.add('bg-gray-900', 'text-white', 'font-bold', 'dark:bg-black');
           return;
         }
          element.classList.add('bg-white', 'text-gray-900', 'font-semibold', 'dark:bg-gray-800');
          element.classList.remove('bg-gray-900', 'text-white', 'font-bold', 'dark:bg-black');
  });

}

function updatePanelDisplay(display)
{
     const panelShowBttns = document.getElementById('panelShowBttns');
     const panel = document.getElementById('panelDuoSolver');
     if(isPanelShow) {
       panel.classList.remove('collapse');
       panelShowBttns.classList.add('hidden');
       return;
     }
      GM_setValue('isPanelShow', false);
      panel.classList.add('collapse');
      panelShowBttns.classList.remove('hidden');
      return;

}

function toggleShowHidePanel()
{
     isPanelShow = !GM_getValue('isPanelShow');
     GM_setValue('isPanelShow', isPanelShow )
     updatePanelDisplay();
}

function setAutoMode(state)
{
  isAutoMode = state;
  GM_setValue('isAutoMode', state);
}

function startStopMain()
{
  setAutoMode(!isAutoMode);
  updateBttnsCaptions();
  if(isAutoMode) {
    window.location.assign('/practice');
  }

}


function addButtons()
{
    const checkBttn = document.querySelectorAll('[data-test="player-next"]')[0];
    if(!checkBttn) {
      return;
    }
    let solveAllBttn = document.getElementById("solveAllBttn");
    if (solveAllBttn !== null) {
        return;
    }
    checkBttn.parentElement.classList.add('flex', 'gap-x-8');
    checkBttn.parentElement.insertAdjacentHTML('beforeend',solvesBttnHtml);

    const solveBttn = document.getElementById("solveBttn");
    solveAllBttn = document.getElementById("solveAllBttn");
    solveBttn.addEventListener('click', solveOne);
    solveAllBttn.addEventListener('click', solvingAll);

    updateBttnsCaptions();
    resetTimerAutoMode();
}



function updateBttnsCaptions()
{
  const solveAllBttn = document.getElementById("solveAllBttn");
  const startBttn = document.getElementById("startBttn");
  if (isAutoMode) {
        solveAllBttn ? solveAllBttn.innerText = "PAUSE ALL" : null;
        startBttn    ? startBttn.innerText = "Stop" : null;
    } else {
        solveAllBttn ? solveAllBttn.innerText = "SOLVE ALL" : null;
        startBttn    ? startBttn.innerText = "Start" : null;
    }
}


function solvingAll()
{
    setAutoMode(!isAutoMode);
    updateBttnsCaptions();
    resetTimerAutoMode();
}

function solveOne()
{
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
    if (practiceAgain !== null && isAutoMode) {
        practiceAgain.click();
        return;
    }

     if(document.querySelector('[data-test="session-complete-slide"]') && isAutoMode && !practiceAgain && window.innerWidth <= 768 && window.location.pathname === '/practice') {
       window.location.assign('/practice');
      return;
    }

   let subType = "";
   try {
        window.sol = findReact(document.querySelectorAll(mainLessonFormClass)[0]).props.currentChallenge;
        subType = window.sol.challengeGeneratorIdentifier.specificType;
    } catch {
        let next = document.querySelector('[data-test="player-next"]');
        if (next) {
            next.click();
        }
        resetTimerAutoMode();
        return;
    }
    if (!window.sol) {
        resetTimerAutoMode();
        return;
    }

    let nextButton = document.querySelector('[data-test="player-next"]');
    if (!nextButton) {
        resetTimerAutoMode();
        return;
    }


     switch(window.sol.type) {
       case "listenMatch":
       case "listenIsolation":
       case "listenTap":
       case "speak":
            const buttonSkip = document.querySelector('button[data-test="player-skip"]');
            if (buttonSkip) {
                buttonSkip.click();
            }
       break;
       case "translate":
         switch(subType)
         {
           case "reverse_translate":
              const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
              if(elm) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);
                let inputEvent = new Event('input', {
                    bubbles: true
                });
                elm.dispatchEvent(inputEvent);
              }
              break;
           case "tap":
           case "reverse_tap":
              let tokens_to_click = translateTapReverseTapSolve();
              if(solveSpeed == 'speedFastest') {
                  if(document.getElementsByClassName('_2-F7v')[0]?.children.length == tokens_to_click.length ) {
                       nextButton.click();
                       tokens_clicked = [];
                       resetTimerAutoMode();
                       return;
                  }
                  if(tokens_clicked.length > 0) {
                     resetTimerAutoMode();
                     return;
                  }
                  let lastIndex = tokens_to_click.length - 1;
                  tokens_to_click.forEach((clicked_token, index) => {
                      if(!tokens_clicked.includes(index)) {
                          clicked_token.click();
                          tokens_clicked.push(index)
                      }
    
                      if(index == lastIndex ) {
                        resetTimerAutoMode();
                      }
                  })
                  return;
                } else {
                  tokens_to_click.forEach((clicked_token) => {
                     clicked_token.click();
                  })
                }
              break;
           default:
              null;
         }
         break;
       case "assist":
       case "gapFill":
           document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex]?.click();
           break;
       case "name":
          let textInput = document.querySelector('[data-test="challenge-text-input"]');
          if(textInput) {
            if(window.sol.correctSolutions) {
               let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
               nativeInputValueSetter.call(textInput, window.sol.correctSolutions[0]);
               let inputEvent = new Event('input', {
                  bubbles: true
               });
               textInput.dispatchEvent(inputEvent);
            }
          }
         break;
       case "partialReverseTranslate":
          let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
          if(elm) {
            let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set;
            nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', '') );
            let inputEvent = new Event('input', {
                bubbles: true
            });
            elm.dispatchEvent(inputEvent);
          }
         break;
       default:
         null;
     }

    nextButton.click();
    resetTimerAutoMode();
}

function translateTapReverseTapSolve() {
    const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
    const correct_tokens = window.sol.correctTokens;
    const tokens_to_click = [];
    correct_tokens.forEach(correct_token => {
        const matching_elements = Array.from(all_tokens).filter(element => element.textContent.trim() === correct_token.trim());
        if (matching_elements.length > 0) {
            const match_index = tokens_to_click.filter(token => token.textContent.trim() === correct_token.trim()).length;
            if (match_index < matching_elements.length) {
                // matching_elements[match_index].click();
                tokens_to_click.push(matching_elements[match_index]);
            } else {
                tokens_to_click.push(matching_elements[0]);
            }
        }
    });

    return tokens_to_click;
}

 function resetTimerAutoMode()
 {
    if(isAutoMode) {
        clearTimeout(solveTimerId);
        solveTimerId = setTimeout(solveOne, solveSpeedList[solveSpeed]);
    }
 }

function findReact(dom) {
    let reactProps = Object.keys(dom.parentElement).find((key) => key.startsWith("__reactProps$"));
    let child = dom?.parentElement?.[reactProps]?.children;
    return child?.props?.children?._owner?.stateNode ?? child?._owner?.stateNode;
}