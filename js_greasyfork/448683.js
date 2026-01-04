// ==UserScript==
// @name         Simplebits Auto Miner
// @namespace    https://github.com/DwifteJB/simplebits-autom1ner
// @version      0.1
// @description  Auto mine a simplebits mine.
// @author       Dwifte
// @match        *://simplebits.io/mining/*
// @icon         https://github.com/DwifteJB.png
// @grant        none
// @license      GPL2
// @downloadURL https://update.greasyfork.org/scripts/448683/Simplebits%20Auto%20Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/448683/Simplebits%20Auto%20Miner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // we have to wait.
    var loopTimeStart = 1; // IN MINUTES
    var verbose = true; // debug logs
    var minimumAmount = 0; // how much energy/dominance you want before you click the buttons
    var cacheloopTimeStart;
    let endLoop = true;
    function start() {
        document.getElementsByClassName("flex items-center justify-center p-2")[0].id = "autom1ner-base"
        var autom1nerbase = document.getElementById("autom1ner-base")
        autom1nerbase.classList = "box flex items-center justify-center w-full h-full"
        autom1nerbase.innerHTML = `<div class="flex flex-col w-full h-full justify-around"><div class="flex items-center justify-between border-b pb-3"><div class="flex flex-col w-full"><div class="flex w-full items-center justify-center"><div class="flex items-center justify-center w-full"> <div class="text-2xl font-bold">Dwifte autom1ner</div></div></div> <div class="flex items-center justify-center m-3 w-full"><div id="activated" class="is-red-tag">Deactivated</div></div></div> </div> <div> <div class="flex items-center justify-center font-bold text-lg"><button id="activateBtn" class="
              focus:outline-none
              flex
              items-center
              font-bold
              justify-center
              py-1
              px-3
              text-gray-100
              hover:text-gray-1
              00
              dark:text-gray-200 dark:hover:text-gray-300
              bg-indigo-500
              hover:bg-indigo-600
              duration-200
            ">
            Activate Autom1ner
          </button></div> <div><div class="
                h-full
                text-center text-xs text-white
                bg-indigo-500
                rounded-full
              " style="width: 11%; max-width: 100%;"></div></div></div></div>`
        document.getElementById("activateBtn").onclick = function() {
            if (endLoop == false) {
                // disable
                document.getElementById("activated").classList = "is-red-tag"
                document.getElementById("activated").innerHTML = "Disabled"
                document.getElementById("activateBtn").innerHTML = "Enable Autom1ner"
                endLoop = true;
                cacheloopTimeStart = loopTimeStart;
                loopTimeStart = 0.05; // 3 seconds
            } else if (endLoop == true) {
                document.getElementById("activated").classList = "is-blue-tag"
                document.getElementById("activated").innerHTML = "Enabled"
                document.getElementById("activateBtn").innerHTML = "Disable Autom1ner"
                endLoop = false;
                console.log(`autom1ner has started :)\nCreated by Dwifte\nLooping every ${loopTimeStart} minute(s)\nVerbose: ${verbose}`);
                cacheloopTimeStart = loopTimeStart;
                loopTimeStart = 0.1;
                loop();
            }
        }
    }
    var intv = setInterval(function() {
        if(document.getElementsByClassName("flex items-center justify-center m-2 w-full").length <= 0){
            return false;
        }
        //when element is found, clear the interval.
        clearInterval(intv);
        start()
    }, 100);
    function minifie() {
            document.getElementsByClassName("mt-1 flex flex-col overflow-auto h-64 px-4 mb-10")[0].outerHTML = "";
            document.getElementsByClassName("container flex flex-col mx-auto w-full bg-white dark:bg-gray-700 rounded-lg shadow h-full")[0].outerHTML = "";
            document.getElementsByClassName("fixed bottom-0 right-0 mr-2 md:mr-4")[0].outerHTML = ""
    }
    function checkBotCheck() {
        // check if bot check exists
        return (document.getElementsByClassName("box max-w-sm")[0] || document.getElementsByClassName("flex justify-center flex-col space-y-2")[0]) ? true : false
    }
        function loop() {
        setTimeout(function() {
            loopTimeStart = cacheloopTimeStart;
            if (endLoop == true) return;
            var dominanceButton = document.getElementsByClassName("disabled:opacity-90 disabled:cursor-not-allowed focus:outline-none flex items-center font-bold justify-center py-1 px-3 text-gray-100 hover:text-gray-1 00 dark:text-gray-200 dark:hover:text-gray-300 bg-indigo-500 hover:bg-indigo-600 duration-200");
            var energyButton = document.getElementsByClassName("disabled:opacity-90 disabled:cursor-not-allowed focus:outline-none py-1 text-center font-bold uppercase tracking-wide text-gray-600 hover:text-green-500 dark:hover:text-green-400 bg-gray-200 dark:bg-gray-300 dark:hover:bg-green-200 dark:hover:bg-opacity-30 hover:bg-gray-100 duration-200");
            var dominanceCount = 0;
            var energyCount = 0;
            var dominanceFinish = false;
            console.log(`autom1ner:\n\nHash: ${document.getElementsByClassName("is-red2-tag")[0].firstChild.firstChild.innerHTML}\n`);
            // get amount of energy: document.getElementsByClassName("text-xs text-teal-500")[0].innerHTML.trim().split(" ")[0]
            // get amount of dominance: document.getElementsByClassName("text-xs text-indigo-400")[0].innerHTML.trim().split(" ")[0]
            //document.getElementsByClassName("disabled:opacity-90 disabled:cursor-not-allowed focus:outline-none py-1 text-center font-bold uppercase tracking-wide text-gray-600 hover:text-green-500 dark:hover:text-green-400 bg-gray-200 dark:bg-gray-300 dark:hover:bg-green-200 dark:hover:bg-opacity-30 hover:bg-gray-100 duration-200")[0].click();
            let energy = document.getElementsByClassName("text-xs text-teal-500")[0].innerHTML.trim().split(" ")[0];
            let dominance = document.getElementsByClassName("text-xs text-indigo-400")[0].innerHTML.trim().split(" ")[0];
            (verbose == true) ? console.log(`Dominance Loop started.`) : null;
            var dominanceLoop = setInterval(() => {
                if (dominance <= minimumAmount) {
                    dominanceFinish = true;
                    return clearInterval(dominanceLoop);
                }
                // switch case seems a bit complex for this system, might add in next update
                if (dominance-100 >= 0) {
                    dominanceButton[4].click();
                    dominanceCount += 100;
                    (verbose == true) ? console.log(`Dominance clicked 100 button.`) : null;
                } else if (dominance-20 >= 0) {
                    dominanceButton[3].click();
                    dominanceCount += 20;
                    (verbose == true) ? console.log(`Dominance clicked 20 button.`) : null;
                } else if (dominance-20 >= 0) {
                    dominanceButton[2].click();
                    dominanceCount += 10;
                    (verbose == true) ? console.log(`Dominance clicked 10 button.`) : null;
                } else if (dominance-5 >= 0) {
                    dominanceButton[1].click();
                    dominanceCount += 5;
                    (verbose == true) ? console.log(`Dominance clicked 5 button.`) : null;
                } else if (dominance-1 >= 0) {
                    dominanceButton[0].click();
                    dominanceCount += 1;
                    (verbose == true) ? console.log(`Dominance clicked 1 button.`) : null;
                }
                (verbose == true) ? console.log(`dominanceCount: ${dominanceCount}`) : null;
                if (dominanceCount >= dominance) {
                    (verbose == true) ? console.log("Clearing dominance Loop") : null;
                    dominanceFinish = true;
                    clearInterval(dominanceLoop);
                }
            }, 4000);
            var energyLoop = setInterval(() => {
                if (dominanceFinish == true) {
                    (verbose == true) ? console.log(`Energy loop started.`) : null;
                    if (energy <= minimumAmount) {
                        return clearInterval(energyLoop);
                    }
                    if (energy-100 >= 0) {
                        energyButton[4].click();
                        energyCount += 100;
                        (verbose == true) ? console.log(`Energy clicked 100 button.`) : null;
                    } else if (energy-20 >= 0) {
                        energyButton[3].click();
                        energyCount += 20;
                        (verbose == true) ? console.log(`Energy clicked 20 button.`) : null;
                    } else if (energy-20 >= 0) {
                        energyButton[2].click();
                        energyCount += 10;
                        (verbose == true) ? console.log(`Energy clicked 10 button.`) : null;
                    } else if (energy-5 >= 0) {
                        energyButton[1].click();
                        energyCount += 5;
                        (verbose == true) ? console.log(`Energy clicked 5 button.`) : null;
                    } else if (energy-1 >= 0) {
                        energyButton[0].click();
                        energyCount += 1;
                        (verbose == true) ? console.log(`Energy clicked 1 button.`) : null;
                    }
                    (verbose == true) ? console.log(`energyCount: ${energyCount}`) : null;
                    if (energyCount >= energy) {
                        (verbose == true) ? console.log(`Clearing energy Loop`) : null;
                        clearInterval(energyLoop);
                    }
                } else {
                    (verbose == true) ? console.log(`Waiting for dominance loop...`) : null;
                }
            }, 4000);
            console.log(`autom1ner: just used ${energy} energy and ${dominance} dominance`);
            if (endLoop == false) loop();
        }, loopTimeStart*60*1000);
    }
    // write

})();