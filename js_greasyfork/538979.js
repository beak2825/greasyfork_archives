// ==UserScript==
// @name         GC - Shop Numpad Relu EDIT
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      1.1
// @description  Adds an on screen number pad to click on to fill in a haggle price at stores.
// @author       Twiggies
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538979/GC%20-%20Shop%20Numpad%20Relu%20EDIT.user.js
// @updateURL https://update.greasyfork.org/scripts/538979/GC%20-%20Shop%20Numpad%20Relu%20EDIT.meta.js
// ==/UserScript==

let buyID = location.pathname;
const formArea = document.querySelector(`form[action="${buyID}"]`);
if (formArea != null) {
    let inputArea = formArea.querySelector('div.flex-column')
    let offerInput = inputArea.querySelector('div.center-items:not([style*="display:none"]) div input')

    const numpadStyles = `#twigsNumPad11 {
    width:300px;
    height:200px;
    display: grid;
    gap: 1px;
    margin:auto;
}
.twigsNumpadBtn {
	padding:5px;
    outline: 1px solid black;
    user-select: none;
}
.twigsNumpadBtn:hover {
    background-color:#bbb;}`
    let numpadStylesheet = document.createElement("style");

    numpadStylesheet.innerText = numpadStyles;
    document.head.appendChild(numpadStylesheet);
    formArea.querySelector('input[value="Submit Offer!"]').insertAdjacentHTML('afterend',`<div id="twigsNumPad1" >
    <div class="twigsNumpadBtn">
        8585
    </div>
    <div class="twigsNumpadBtn">
        manual
    </div>
</div>`)
    //Get the newly added buttons.
    const numpadButtons = document.getElementsByClassName('twigsNumpadBtn');

    numpadButtons[0].onclick = function() {
        offerInput.value = 8585;
        formArea.querySelector('input[value="Submit Offer!"]').click();
    }
    numpadButtons[1].onclick = function() {

        const priceHaggle = document.getElementById('twigsNumPad').innerText;
        console.log(priceHaggle)
        offerInput.value = priceHaggle;
        formArea.querySelector('input[value="Submit Offer!"]').click();
    }

    const spinning = document.getElementById('got_em');
    if (spinning != undefined){
        console.log(spinning)

        const priceHaggle = document.getElementById('twigsNumPad').innerText;
        console.log(priceHaggle)
        offerInput.value = priceHaggle;
        formArea.querySelector('input[value="Submit Offer!"]').click();
    } else {

        console.log(spinning)
    }

}