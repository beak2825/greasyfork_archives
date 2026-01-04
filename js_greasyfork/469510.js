// ==UserScript==
// @name             TransFilter
// @version          1.3
// @license          MIT
// @description      Filtro che permette di scegliere, in una ricerca sul popolare sito di escort Bakeca Incontri, se escludere i trans o se visualizzare solo quelli.
// @match            https://*.bakecaincontrii.com/donna-cerca-uomo/
// @match            https://*.bakecaincontrii.com/donna-cerca-uomo/?*
// @grant            none
// @namespace http://your-namespace.example.com
// @downloadURL https://update.greasyfork.org/scripts/469510/TransFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/469510/TransFilter.meta.js
// ==/UserScript==

(function() {
    var targetSubstrings = ["trans"];
    var breadcrumbElement = document.querySelector(".breadcrumb");
    let elementsToHide;
    let elementsYonicam;
    var selectedFilter = localStorage.getItem('transFilter') || 'all';

    function getCards(){
        elementsToHide= document.getElementsByClassName("item-card");
    }

    setTimeout(getCards, 1500)

    var buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    buttonContainer.style.width = "100%";
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "column";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.alignItems = "end";
    buttonContainer.style.position = "fixed";
    buttonContainer.style.zIndex = "10";
    breadcrumbElement.appendChild(buttonContainer);

    var hideButton = createButton("🍑 Niente trans", "hide");
    var allButton = createButton("Mostra tutto", "all");
    var showButton = createButton("Solo trans 🍌", "show");

    function setInitalValues() {
        elementsToHide= document.getElementsByClassName("item-card");
        if(selectedFilter === 'show'){
            showCardsWithSubstring(targetSubstrings);
        } else if (selectedFilter === 'hide') {
            hideCardsWithSubstring(targetSubstrings);
        } else {
            showAllCards()
        }
    }

    document.addEventListener("DOMContentLoaded", setInitalValues(), 200)

    hideButton.addEventListener("click", function() {
        hideCardsWithSubstring(targetSubstrings);
        setActiveButton(hideButton);
        localStorage.setItem('transFilter', 'hide')
    });

    showButton.addEventListener("click", function() {
        showCardsWithSubstring(targetSubstrings);
        setActiveButton(showButton);
        localStorage.setItem('transFilter', 'show')
    });

    allButton.addEventListener("click", function() {
        showAllCards();
        setActiveButton(allButton);
        localStorage.setItem('transFilter', 'all')
    });

    function createButton(label, value) {
        var button = document.createElement("button");
        button.textContent = label;
        button.style.minWidth = "110px";
        button.style.margin = "10px";
        button.style.padding = "5px 10px";
        button.style.borderRadius = "5px";
        button.style.border = "none";
        button.style.background = "pink"

        buttonContainer.appendChild(button);

        if(selectedFilter === value) {
            setActiveButton(button)
        }

        return button;
    }

    // function hideAds(){
    //     var shouldHide = "false";
    //     for (var i = 0; i < elementsToHide.length; i++) {
    //         var element = elementsToHide[i];
    //         var textFields = element.querySelectorAll(".item-title, .item-description");
    //         for (var j = 0; j < textFields.length; j++) {
    //             var textField = textFields[j];
    //             var text = textField.textContent.toLowerCase();
    //             if (text.includes([".com"])) {
    //                 console.log("La stringa", text, "include .com")
    //                 shouldHide = true;
    //                 break;
    //             }            
    //         }
    //         if (shouldHide) {
    //         element.style.display = "none";
    //         } 
    //    }
    // }

    function hideCardsWithSubstring(substrings) {
        for (var i = 0; i < elementsToHide.length; i++) {
            var element = elementsToHide[i];
            var textFields = element.querySelectorAll(".item-title, .item-description");

            var shouldHide = false;
            for (var j = 0; j < textFields.length; j++) {
                var textField = textFields[j];
                var text = textField.textContent.toLowerCase();
                for (var k = 0; k < substrings.length; k++) {
                    var substring = substrings[k].toLowerCase();
                    if (text.includes(substring)) {
                        shouldHide = true;
                        break;
                    }
                }
                if (shouldHide) {
                    break;
                }
            }

            if (shouldHide) {
                element.style.display = "none";
            } else {
                if(element.classList.contains('borderyonicam')){
                    element.style.display= "none";
                } else {
                    element.style.display= "flex";
                }
            }
        }
    }

    function showCardsWithSubstring(substrings) {
        for (var i = 0; i < elementsToHide.length; i++) {
            var element = elementsToHide[i];
            var textFields = element.querySelectorAll(".item-title, .item-description");

            var shouldShow = false;
            for (var j = 0; j < textFields.length; j++) {
                var textField = textFields[j];
                var text = textField.textContent.toLowerCase();
                for (var k = 0; k < substrings.length; k++) {
                    var substring = substrings[k].toLowerCase();
                    if (text.includes(substring)) {
                        shouldShow = true;
                        break;
                    }
                }
                if (shouldShow) {
                    break;
                }
            }

            if (shouldShow) {
                if(element.classList.contains('borderyonicam')){
                    element.style.display = "none";
                } else {
                    element.style.display= "flex";
                }
            } else {
                element.style.display = "none";
            }
        }
    }

    function showAllCards() {
        for (var i = 0; i < elementsToHide.length; i++) {
            var element = elementsToHide[i];
            if(element.classList.contains('borderyonicam')){
                element.style.display = "none";
            } else {
                element.style.display= "flex";
            }
        }
    }

    function setActiveButton(activeButton) {
        var buttons = buttonContainer.querySelectorAll("button");
        buttons.forEach(function(button) {
            if (button === activeButton) {
                button.style.backgroundColor = "red";
            } else {
                button.style.backgroundColor = "pink";
            }
        });
    }
})();
