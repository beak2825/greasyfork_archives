// ==UserScript==
// @name         GC - Shop Numpad
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  Adds an on screen number pad to click on to fill in a haggle price at stores.
// @author       Twiggies
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482777/GC%20-%20Shop%20Numpad.user.js
// @updateURL https://update.greasyfork.org/scripts/482777/GC%20-%20Shop%20Numpad.meta.js
// ==/UserScript==

let buyID = location.pathname;
const formArea = document.querySelector(`form[action="${buyID}"]`);
if (formArea != null) {
    let inputArea = formArea.querySelector('div.flex-column')
    let offerInput = inputArea.querySelector('div.center-items:not([style*="display:none"]) div input')

    const numpadStyles = `#twigsNumPad {
    width:300px;
    height:200px;
    display: grid;
    gap: 1px;
    grid-template-columns: 30% 30% 30% 10%;
    margin:auto;
}
.twigsNumpadBtn {
	padding:5px;
    outline: 1px solid black;
    user-select: none;
}
.twigsNumpadBtn:hover {
    background-color:#bbb;
}
#twigsNum0 {
    grid-column:1/3;

}
#twigsNumEnter {
grid-row:1/5;
grid-column-start:4;
}`
    let numpadStylesheet = document.createElement("style");

    numpadStylesheet.innerText = numpadStyles;
    document.head.appendChild(numpadStylesheet);
    formArea.querySelector('input[value="Submit Offer!"]').insertAdjacentHTML('afterend',`<div id="twigsNumPad" >
    <div class="twigsNumpadBtn" id="twigsNumEnter">
        E
    </div>
    <div class="twigsNumpadBtn">
        7
    </div>
    <div class="twigsNumpadBtn">
        8
    </div>
    <div class="twigsNumpadBtn">
        9
    </div>
    <div class="twigsNumpadBtn">
        4
    </div>
    <div class="twigsNumpadBtn">
        5
    </div>
    <div class="twigsNumpadBtn">
        6
    </div>
    <div class="twigsNumpadBtn">
        1
    </div>
    <div class="twigsNumpadBtn">
        2
    </div>
    <div class="twigsNumpadBtn">
        3
    </div>
    <div class="twigsNumpadBtn" id="twigsNum0">
        0
    </div>
    <div class="twigsNumpadBtn">
        Clear
    </div>
</div>`)
    //Get the newly added buttons.
    const numpadButtons = document.getElementsByClassName('twigsNumpadBtn');
    //Loop through the buttons to add the appropriate events to it, based on what the button is.
    for (let i = 0; i < numpadButtons.length; i++) {
        const currentBtn = numpadButtons[i];
        //If button is E, then click the Submit Offer! button.
        if (currentBtn.innerText == "E") {
            currentBtn.onclick = function() {
                formArea.querySelector('input[value="Submit Offer!"]').click();
            }
        }
        //If button is Clear, then empty the haggle input.
        else if (currentBtn.innerText == "Clear") {
            currentBtn.onclick = function() {
                offerInput.value = '';
            }
        }
        //Otherwise the button should be a number, so append that value onto the end of the haggle input.
        else {
            currentBtn.onclick = function() {
                console.log(this);
                offerInput.value = offerInput.value + this.innerText;
            }
        }
    }
}