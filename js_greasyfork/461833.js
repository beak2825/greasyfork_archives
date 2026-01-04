// ==UserScript==
// @name         Fallout Terminal Solver
// @namespace    rebelwithoutarootcause
// @version      0.1
// @description  solves the terminal game of fallout
// @author       optionsx
// @match        https://rebelwithoutarootcause.com/demos/terminal/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461833/Fallout%20Terminal%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/461833/Fallout%20Terminal%20Solver.meta.js
// ==/UserScript==
//window.TogglePower() // powers on the terminal
//document.getElementById("poweron").play(); // plays power on sound effect
setInterval(_ => {
     document.querySelector(`[data-word=${window.Correct.toUpperCase()}]`).click()
    //document.getElementById("passgood").play(); // plays passGood sound effect
}, 3000)
