// ==UserScript==
// @name         FFXU ASCII Art Captcha Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A script to automatically solve ASCII art captchas on Fairfax Underground
// @author       Chuck Hoffmann
// @match        http://www.*
// @match        https*
// @match        http*
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36630/FFXU%20ASCII%20Art%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/36630/FFXU%20ASCII%20Art%20Captcha%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let letters = {
        D34D107D73D73D73D73D73D127D54:"3",
        D124D124D4D4D4D4D63D63D4:"4",
        D62D127D73D73D73D73D73D111D38:"6",
        D96D96D71D79D88D80D96D96:"7",
        D50D123D73D73D73D73D73D127D62:"9",
        D127D127D73D73D73D73D73D127D54:"B",
        D62D127D65D65D65D65D99D34:"C",
        D127D127D65D65D65D65D65D127D62:"D",
        D127D127D73D73D73D73D65D65:"E",
        D127D127D72D72D72D72D64D64:"F",
        D62D127D65D65D65D73D111D46D8:"G",
        D127D127D8D8D8D8D8D127D127:"H",
        D6D7D1D1D1D1D127D126:"J",
        D127D127D8D8D28D54D99D65:"K",
        D127D127D1D1D1D1D1D1:"L",
        D127D127D48D24D8D24D48D127D127:"M",
        D127D127D48D24D12D6D127D127:"N",
        D127D127D72D72D72D72D72D120D48:"P",
        D64D64D64D127D127D64D64D64:"T",
        D126D127D1D1D1D1D1D127D126:"U",
        D120D124D6D3D1D3D6D124D120:"V",
        D126D127D1D1D62D62D1D1D127D126:"W",
        D65D99D54D28D8D28D54D99D65:"X",
        D64D96D48D31D31D48D96D64:"Y"
    };
    let captcha = document.getElementById("spamhurdles_captcha_asciiart");
    let captchaString = captcha.textContent;
    //console.log("\"" + captchaString + "\"");
    let captchaArray = captchaString.split("\n");
    let max = captchaArray[0].length;
    let key = "";
    let solution = "";
    for(let ctr=0; ctr< max; ctr++){
        let columnVal = 0;
        for(let x in captchaArray){
            columnVal = columnVal << 1;
            if(captchaArray[x][ctr] !== " "){
                columnVal = columnVal + 1;
            }
        }
        //console.log("Column " + ctr + " value is : " + columnVal);
        if(columnVal === 0){
            //console.log(key);
            if (letters.hasOwnProperty(key)){
                //console.log(letters[key]);
                solution = solution + letters[key];
            }
            key = "";
        } else {
            key = key + "D" + columnVal;
        }
    } 
    let qz = document.getElementById("spamhurdles_captcha_answer_input");
    qz.value = solution;
    //console.log(solution);
})();