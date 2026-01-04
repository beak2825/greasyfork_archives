// ==UserScript==
// @name         Subeta:  Divine Discs Helper
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  This script requires the use of a third party website, `dcode.fr`, which is a Mastermind solver (the real world version of Divine Discs). To use the solver, you must input the current moves in a certain syntax. This script generates that syntax from Divine Discs. It also allows you to quickly paste in your next move. After every guess, click 'Generate Syntax' for the updated code and repeat the process. This script should allow you to finish within 5 moves.
// @author       AyBeCee
// @match        https://subeta.net/games/divine_discs.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414591/Subeta%3A%20%20Divine%20Discs%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/414591/Subeta%3A%20%20Divine%20Discs%20Helper.meta.js
// ==/UserScript==

var scriptInfo = document.createElement("div");
scriptInfo.setAttribute("id", "scriptDiv");
document.querySelector(`[width="90%"][colspan="2"]`).getElementsByTagName("td")[0].appendChild(scriptInfo);


scriptInfo.innerHTML = `

<button id="guess3">Make first 2 moves</button><br>
After you make 2 guesses, click the 'Generate Syntax' button and input the generated text into the <b><a href="https://www.dcode.fr/mastermind-solver">Mastermind Puzzle Solver</a></b>. Click 'Generate Syntax' after every guess to get the updated code.
<br>
<button id="helper">Generate Syntax</button><br>
<textarea readonly id="tocopy" style="width:200px;height:100px"></textarea>
<br>Put your next guess here:
  <input type="text" id="combination"><button id="addCombination">Submit</button>
<br><br>

<style>#scriptDiv{text-align:left;
    border: 1px solid #c9dcd0;
    background-color: #e1efda;
    padding: 20px;
}</style>`;

document.getElementById("helper").onclick = function() {myFunction()};

function myFunction() {
    var rawBoard = document.getElementById(`board`).innerHTML.replaceAll(`<div class="guess_icon guess_icon_1"></div>`, `A`).replaceAll(`<div class="guess_icon guess_icon_2"></div>`, `B`).replaceAll(`<div class="guess_icon guess_icon_3"></div>`, `C`).replaceAll(`<div class="guess_icon guess_icon_4"></div>`, `D`).replaceAll(`<div class="guess_icon guess_icon_5"></div>`, `E`).replaceAll(`<div class="guess_icon guess_icon_6"></div>`, `F`).replaceAll(`<div class="guess_row">`, `\n`).replaceAll(`<div class="results">`, ` `).replaceAll(`<div class="results_icon results_icon_1"></div>`, `R`).replaceAll(`<div class="results_icon results_icon_2"></div>`, `W`).replaceAll(`<div class="results_icon results_icon_3"></div>`, ``).replaceAll(`</div>`, ``)

    var cleanBoard = [];
    cleanBoard = rawBoard.split("\n");
    console.log(cleanBoard);

    var fixedBoard = [];

    for (var row of cleanBoard) {
        var ABCD = row.substring(0, 4);
        var rightAmount;
        var wrongAmount;

        if ( row.includes("RRR") ) {
            rightAmount = 3;
        }
        else if ( row.includes("RR") ) {
            rightAmount = 2;
        }
        else if ( row.includes("R") ) {
            rightAmount = 1;
        }
        else if ( ! row.includes("R") ) {
            rightAmount = 0;
        }
        if ( row.includes("WWWW") ) {
            wrongAmount = 4;
        }
        else if ( row.includes("WWW") ) {
            wrongAmount = 3;
        }
        else if ( row.includes("WW") ) {
            wrongAmount = 2;
        }
        else if ( row.includes("W") ) {
            wrongAmount = 1;
        }
        else if ( ! row.includes("W") ) {
            wrongAmount = 0;
        }
        fixedBoard.push(`${ABCD} ${rightAmount}${wrongAmount}`)
    }
    console.log(fixedBoard);

    document.getElementById("tocopy").innerHTML = fixedBoard.join('\r\n').substring(5);
};



// putFirst3Comobo()
// setTimeout(function(){
//     document.getElementById('reset').click();
// }, 5000)

document.getElementById("addCombination").onclick = function() { putCombo()};
document.getElementById("guess3").onclick = function() { putFirst3Comobo()};




// https://stackoverflow.com/questions/2694640/find-an-element-in-dom-based-on-an-attribute-value#16775485

function putCombo() {
    var theirCombo = document.getElementById("combination").value;
    var arrayCombo = theirCombo.split('');
    console.log(arrayCombo)

    // https://www.w3schools.com/jsref/jsref_foreach.asp
    arrayCombo.forEach(getIndex);

    function getIndex(item, index) {
        console.log( index );
        setTimeout(function(){
            if ( item == "A" ) {
                document.querySelector(`[piece="1"]`).click();
            }
            else if ( item == "B" ) {
                document.querySelector(`[piece="2"]`).click();
            }
            else if ( item == "C" ) {
                document.querySelector(`[piece="3"]`).click();
            }
            else if ( item == "D" ) {
                document.querySelector(`[piece="4"]`).click();
            }
            else if ( item == "E" ) {
                document.querySelector(`[piece="5"]`).click();
            }
            else if ( item == "F" ) {
                document.querySelector(`[piece="6"]`).click();
            }
        }, index * 500);
    }

}


function putFirst3Comobo() {
    setTimeout(function(){
        document.querySelector(`[piece="1"]`).click();
    }, 750);
    setTimeout(function(){
        document.querySelector(`[piece="2"]`).click();
    }, 1500);
    setTimeout(function(){
        document.querySelector(`[piece="3"]`).click();
    }, 1250);
    setTimeout(function(){
        document.querySelector(`[piece="4"]`).click();
    }, 2000);

    setTimeout(function(){
        document.querySelector(`[piece="3"]`).click();
    }, 3000);
    setTimeout(function(){
        document.querySelector(`[piece="4"]`).click();
    }, 3750);
    setTimeout(function(){
        document.querySelector(`[piece="5"]`).click();
    }, 4500);
    setTimeout(function(){
        document.querySelector(`[piece="6"]`).click();
    }, 5250);
}
