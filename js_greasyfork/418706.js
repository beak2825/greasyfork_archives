// ==UserScript==
// @name         FE Chat Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight FE chat
// @author       Natty_Boh
// @include      https://www.finalearth.com/*
// @include      https://finalearth.com/*
// @downloadURL https://update.greasyfork.org/scripts/418706/FE%20Chat%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/418706/FE%20Chat%20Highlighter.meta.js
// ==/UserScript==

highlight()
listen()

/*
********
USER EDITABLE SECTION STARTS HERE

keywordsToHighlight -- highlight username by default.
Add additional keywords by adding them inside double quotes and comma separated (case insensitive), examples [userName, "natty", "nat"]

userNameColor - color of your name in message you sent

keywordHighlightColor - highlight color of messages containing your selected keywords

https://www.w3schools.com/colors/colors_names.asp see options here for different colors you can replace with to customize your color scheme

********
*/

let keywordsToHighlight = [userName]
let userNameColor = "crimson"
let keywordHighlightColor = "lightPink"

/*
********
USER EDITABLE SECTION ENDS HERE
********
*/

function listen() {
   var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(m) {
				if (m.addedNodes[1] && m.addedNodes[1].classList && m.addedNodes[1].classList.contains("message")) {
                    highlight()
				}
			}
		)});

    var target = document.querySelector(".chat-box-wrap");
    var config = {
        childList: true,
        subtree: true
    }

    observer.observe(target, config);

}

function highlight(){
    document.querySelectorAll('a').forEach( e => {
        if (e.textContent.includes(userName)) {
            e.style.color = 'crimson'
        }
    });
     document.querySelectorAll('.message > span').forEach( e => {
         var text = e.textContent.toLowerCase();
        if (keywordsToHighlight.some(element => text.includes(element.toLowerCase()))) {
            e.style.backgroundColor = 'lightPink'
        }
    });



}