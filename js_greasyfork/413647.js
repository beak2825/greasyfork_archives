// ==UserScript==
// @name         After Attack Option Hider
// @namespace    hardy.attackoptionhider
// @version      1.0
// @description  Hides options as per requirement after winning an attack.
// @author       Hardy[2131687]
// @match        https://www.torn.com/loader.php?sid=attack*
// @downloadURL https://update.greasyfork.org/scripts/413647/After%20Attack%20Option%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/413647/After%20Attack%20Option%20Hider.meta.js
// ==/UserScript==
/*
It hides options after winning an attack as per requirement.
To help people to not choose wrong option after winning an attack. 
Especially mobile players with fat fingers like me.
 *
 Use cases:
 1) Termed Wars where you can't hospitalise or mug the opponent.
 2) While doing missions when you are given specific instructions.
 3) If you are a mugger.
 4) Any other situation where you don't want to accidentally leave or hosp or mug.
 *
 *
 How to use:
 By default all options will be visible
 Before opening the attack page, set the options in lines 32 to 34 to:
 true, if you want that option to be visible
 false, if you want to make the option invisible.
 *
 Incase you forgot to change the settings before the attack there will be a "Show All" option to show all the options.
 */
(function() {
    'use strict';
    // true to show & false to hide
    let mug = true;// true or false
    let hosp = true;// true or false
    let leave = true;//true or false
    let storage = {};
    storage.button = 0;
    const config = {attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (document.querySelectorAll('div[class^="dialogButtons"]').length > 0) {
                changeCSS();
            }
        }
    })
    var cd = setInterval(checkForElement,
                         1000);
    function checkForElement() {
        if (document.querySelectorAll('div[class^="playerArea"]').length > 0) {
            clearInterval(cd);
            const wrapper = document.querySelector('div[class^="playerArea"]');
            observer.observe(wrapper, config);
        }
    }
    function disconnectObserver() {
        if (!storage.index) {
            observer.disconnect();
            storage.index = 69;
        }
    }
    //const wrapper = document.querySelector('div[class^="playerArea"]');
    //const wrapper = document.body;
    function changeCSS() {
        let optionsDialogBox = document.querySelector('div[class^="dialogButtons"]');
        let optionsBox = optionsDialogBox.children;
        for (const option of optionsBox) {
            let text = option.innerText.toLowerCase();
            if (!mug && text === "mug") {
                option.setAttribute("style", "display:none");
                disconnectObserver();
            } else if (!hosp && text === "hosp") {
                option.setAttribute("style", "display:none");
                disconnectObserver();
            } else if (!leave && text === "leave") {
                option.setAttribute("style", "display:none");
                disconnectObserver();
            }
            if (!mug || !hosp || !leave) {
                if (text == "leave" && storage.button == 0) {
                    let showOptionsButton = document.createElement("button");
                    showOptionsButton.className = option.className;
                    showOptionsButton.innerText = "Show All";
                    showOptionsButton.id = "hardy_termed_war_show_option";
                    optionsDialogBox.appendChild(showOptionsButton);
                    storage.button = 1;
                }
            }
        }
    }
    document.addEventListener("click", function(g) {
        if (g.target.id == "hardy_termed_war_show_option") {
            let optionsDialogBox = document.querySelector('div[class^="dialogButtons"]');
            let optionsBox = optionsDialogBox.children;
            for (const node of optionsBox) {
                node.removeAttribute("style");
            }
            optionsDialogBox.querySelector("#hardy_termed_war_show_option").remove();
        }
    });
})();
