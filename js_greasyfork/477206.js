// ==UserScript==
// @name         Zombia.io Select Name
// @namespace    http://tampermonkey.net/
// @version      1
// @description  This script is customizable
// @author       Longxd#1621
// @match        http://zombia.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombia.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477206/Zombiaio%20Select%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/477206/Zombiaio%20Select%20Name.meta.js
// ==/UserScript==

var newSelect = document.createElement("select");
newSelect.classList.add("hud-intro-names");
newSelect.id = "hud-intro-names";
var optionGroup = document.createElement("optgroup");
optionGroup.label = "Select Names";
// vars for create a new option for add a new option just copy paste the var and change the number, example, option(n), "n" is a random number
var option1 = document.createElement("option");
var option2 = document.createElement("option");
option1.value = "opt1"; // value of the option
option1.text = "Longxd#1621"; // text that will be added to the name
option2.text = "wo"; // text that will be added to the name
option2.value = "opt2"; // value of the option
optionGroup.appendChild(option1);
optionGroup.appendChild(option2);
newSelect.appendChild(optionGroup);

var hudIntroFormElement = document.querySelector(".hud-intro-form");
hudIntroFormElement.appendChild(newSelect);

let css = `
select#hud-intro-names {
    display: block;
    width: 285px;
    height: 40px;
    margin-top: 5px;
    background-color: #8bdfb3; // find your favorite color
    padding: 8px 14px;
}
`
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";

        var select = document.getElementById("hud-intro-names");
        var hudIntroName = document.querySelector(".hud-intro-name");
newSelect.addEventListener("change", function () {
    var selectedOption = newSelect.options[newSelect.selectedIndex];
    if (selectedOption.value === "opt1") { // you can copy paste this to infinites options with values
        hudIntroName.value = "Longxd#1621";
    } else if (selectedOption.value === "opt2") {
        hudIntroName.value = "wo";
    }
});