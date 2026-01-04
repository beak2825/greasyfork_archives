// ==UserScript==
// @name         Oryx lists expand/collapse buttons
// @namespace    https://oryxspioenkop.com/
// @version      0.1
// @description  Add collapse/expand buttons to lists of vehicles
// @author       lifeAnime / Yhria
// @match        https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html
// @match        https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-ukrainian.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oryxspioenkop.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445246/Oryx%20lists%20expandcollapse%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/445246/Oryx%20lists%20expandcollapse%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles =
        /* Style the button that is used to open and close the collapsible content */
        `
.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
} `
    +
        /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
        `
.active, .collapsible:hover {
  background-color: #ccc;
} `
    +
        /* Style the collapsible content. Note: hidden by default */
        `
.ccontent {
  padding: 0 18px;
  display: none;
  overflow: hidden;
  background-color: #f1f1f1;
}
`
    let button = `<button type="button" class="collapsible">Click here to expand list</button>`
    let list = document.getElementsByTagName("article")[0].getElementsByTagName("ul")
    let coll, i;
    var styleSheet = document.createElement("style")

    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    for (let element in list){
        if (Number.isInteger(parseInt(element))){
            list[element].className = "ccontent"
            list[element].outerHTML = button + list[element].outerHTML
        }
    }
    coll = document.getElementsByClassName("collapsible");
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            console.log(this)
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
})();