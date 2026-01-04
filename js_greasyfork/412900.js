// ==UserScript==
// @name         Synergism Ascension Resource Rate Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copied from pins in discord
// @author       NotArcanus (but really AlienC4)
// @match        https://pseudonian.github.io/SynergismOfficial/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412900/Synergism%20Ascension%20Resource%20Rate%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/412900/Synergism%20Ascension%20Resource%20Rate%20Calculator.meta.js
// ==/UserScript==

(function() {
    let printPrevRun = true
    let calcCTHps = (function() {
        let cps = 0
        let tps = 0
        let hps = 0
        let sec = 0
        function log() {
            let corruptionStuff = CalcCorruptionStuff()
            let hypers = corruptionStuff[6]
            let tess = corruptionStuff[5]
            let cubes = corruptionStuff[4]
            let time = player.ascensionCounter
            if (sec >= time && printPrevRun) {
                console.log(`Cube Rate: ${format(cps, 4, true)}/s, Tess Rate: ${format(tps, 2, true)}/s, Hyper Rate: ${format(hps, 3, true)}/s, Cubes: ${format(cps*sec, 4, true)}, time: ${formatTimeShort(sec)}`)
            }
            cps = cubes / time, tps = tess / time, hps = hypers / time, sec = time
            document.getElementsByTagName("div")[2].textContent = `Cube Rate: ${format(cps, 4, true)}/s, Tess Rate: ${format(tps, 2, true)}/s, Hyper Rate: ${format(hps, 3, true)}/s, Cubes: ${format(cubes, 4, true)}, time: ${formatTimeShort(time)}`
        }
        return log;
    })();
    let handleAscensionResourceCalculator = setInterval(calcCTHps, 1000);
})();