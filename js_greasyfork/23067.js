// ==UserScript==
// @name         ClickButton
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Click on every button (or disguised button) containing the text inserted
// @author       Leonard Okaz
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23067/ClickButton.user.js
// @updateURL https://update.greasyfork.org/scripts/23067/ClickButton.meta.js
// ==/UserScript==

(function() {
    var button = buildButton();
    button.onclick = function() {
        var matchingText = prompt("Please enter the text", null);
        if(matchingText !== null) {
            var buttons = document.querySelectorAll("button, input[type=submit], a");
            for (var iButton = 0; iButton < buttons.length; iButton++) {
                var button = buttons[iButton];
                alert(button.type);
                if (!securedButton(button)) { alert("Security"); continue; }
                else if (button.type === "button" || (button.type === "" && button.href !== "")) {
                    if (button.innerHTML === matchingText) {
                        buttons[iButton].click();
                    }
                }
                else if (button.type === "submit") { //input[type=submit]
                    if (button.value === matchingText) {
                        buttons[iButton].click();
                    }
                }
            }
        }
    };
    document.body.insertBefore(button, document.body.firstChild);
})();

function buildButton() {
    var button = document.createElement("BUTTON");
    var buttonText = document.createTextNode("ClickButton script Tampermonkey");
    button.appendChild(buttonText);
    button.style.background = "#8A2BE2";
    button.style.color = "white";
    button.style.position = "relative";
    button.style.zIndex = "1000";
    return button;
}

// Check if the button is not hidden and clickable, otherwise it can become a source of hack
function securedButton(button) {
    if (button.style.display !==  "none") {
        return true;
    }
    if (buttons[iteratorButton].style.opacity ===  "1" || (buttons[iteratorButton].style.opacity === "" && buttons[iteratorButton].style.opacity !== "0")) {
        return true;
    }
    return false;
}