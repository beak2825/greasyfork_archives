// ==UserScript==
// @name         AIMS Automatic response filler
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  It automatically selects default checkboxes in IIT Ropar AIMS Course feedback form
// @author       The Viking
// @match        https://www.iitrpr.ac.in/aims/index.html*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438367/AIMS%20Automatic%20response%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/438367/AIMS%20Automatic%20response%20filler.meta.js
// ==/UserScript==




// Default Options to check for the given questions
var default_options = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2];





let styleSheet = `
.autoFillBtn {
  background: #FF4742;
  border: 1px solid #FF4742;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 16px;
  min-height: 40px;
  outline: 0;
  padding: 12px 14px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
}
.autoFillBtn:hover,
.autoFillBtn:active {
  background-color: initial;
  background-position: 0 0;
  color: #FF4742;
}

.autoFillBtn:active {
  opacity: .5;
}
`

let s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

function waitForKeyElement(text, func) {
    if (document.body.textContent.includes(text)) {
        // console.log("found");
        func();
    }
    else {
        // console.log("not found");
        setTimeout(waitForKeyElement, 1000, text, func);
    }
}


function actionFunction() {

    let ele = document.getElementsByClassName("card-body")[0];
    let btn = document.createElement("Button");
    btn.innerHTML = "Auto Fill";
    btn.className = "autoFillBtn";
    btn.onclick = () => {
        for (var i=0; i<default_options.length; i++){
            var id = String(i) + "_" + String(default_options[i]-1);
            document.getElementById(id).click();
        }
    }
    ele.insertBefore(document.createElement('br'), ele.childNodes[0]);
    ele.insertBefore(btn, ele.childNodes[0]);
}

waitForKeyElement("Please note the follwing before submitting", actionFunction);