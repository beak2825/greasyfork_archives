// ==UserScript==
// @name            Google Translate static toolbar
// @name:pl         Statyczny przybornik Google Translate
// @name:dk         Statisk værktøjslinje til Google Translate
// @include         https://translate.google.*/*
// @grant           none
// @description     This script moves Google Translate output's toolbar (with the buttons to Copy, Listen, Share etc.) to the top. Thanks to that, the toolbar position is static regardless of translation output. Useful for some things, like mouse-pos macros.
// @description:pl  Skrypt przenosi pasek narzędziowy (Kopiuj, Odsłuchaj, Udostępnij, etc.) tłumaczenia wyjściowego Google Translate na górę panelu. Dzięki temu przybornik jest statyczny, niezależnie od długości tłumaczenia. Przydatne w niektórych sytuacjach, np. tworzeniu makro używających pozycji kursora.
// @description:dk  Flytes værktøjslinjen til toppen af oversættelsesudskrivningsboksen.
// @version 0.0.1.20181204211407
// @namespace https://greasyfork.org/users/153635
// @downloadURL https://update.greasyfork.org/scripts/33425/Google%20Translate%20static%20toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/33425/Google%20Translate%20static%20toolbar.meta.js
// ==/UserScript==
// @author          Nullmaruzero, Kamaz91

// Run event listener in order to run the script only after the page is loaded completely.
window.addEventListener('load', function() {

    // Define elements
    const target = "tlid-results-container results-container";
    const toolboxDiv = '.result-footer.source-or-target-footer.tlid-copy-target';
    var container = document.querySelector('.tlid-results-container.results-container')
    var outputDiv = document.querySelector('.tlid-result-error.error-placeholder.placeholder');

    // Change toolbox position
    let toolbox = document.querySelector(toolboxDiv)
    toolbox.style.position = "absolute";
    toolbox.style.top = "-10px";


    /* ADD MUTATION OBSERVER BELOW
    This is required since the new Material Design version of Google Translate destroys the existing (old) result toolbar and creates a new one with each translation. */

    // Define observer config for tracked changes/mutations.
    var observerConfig = {
        childList: true
    };

    // Callback function to execute when mutations are observed
    var callback = function(mutationsList, observer) {
        mutationsList.forEach(function(mutation){
            if(mutation.type === "childList" && mutation.target.className === target){
                let container = document.querySelector(toolboxDiv);
                container.style.position = "absolute";
                container.style.top = "-10px";
            }
        });
    };

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations.
    observer.observe(container, observerConfig);

}, false);