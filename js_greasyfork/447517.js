// ==UserScript==
// @name         Format email
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  adds a button to format emails for trello card descriptions
// @author       You
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447517/Format%20email.user.js
// @updateURL https://update.greasyfork.org/scripts/447517/Format%20email.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var mainFunction = function() {
        console.log("mainFunction Format email");
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === "attributes") {

                        //var overlayDescription = document.querySelector('.window-module-title.window-module-title-no-divider.description-title h3');
                        var overlayDescription = document.querySelector('.description-edit');

                        if(overlayDescription != null && document.querySelector('.nch-button.bebold-format-mail') == null){

                            const style = document.createElement('style');
                            style.textContent = `.bebold-format-mail{
                                bottom: 10px;
                                right: 170px;
                                position:absolute;
                            }`;
                            document.head.append(style);
                            // ADD FORMAT BUTTON
                            var toggleTrigger = document.createElement('div');
                            toggleTrigger.innerHTML ='<span class="nch-button bebold-format-mail" title="format email">@</span>';
                            toggleTrigger.addEventListener('click', toggleAllOnClick);

                            //overlayDescription.parentNode.insertBefore(toggleTrigger, overlayDescription.nextSibling);
                            overlayDescription.append(toggleTrigger);


                        }



                    }
                });
            });

            observer.observe(document.querySelector('.window-overlay .window .window-wrapper.js-autofocus.js-tab-parent'), {
                attributes: true //configure it to listen to attribute changes
            });
    };

    // basically wait for DOM ready
    waitForElm('.board-header').then((elm) => {
        mainFunction();
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function toggleAllOnClick(e) {
        var overlayDescription = document.querySelector('textarea.field.field-autosave.js-description-draft.description.card-description');
        var description = overlayDescription.value
        console.log(description)
        description = description.replace(/^(De ?:.*)/g, "\n-----------------\n$1");
        description = description.replace(/(De ?:|Envoyé ?:|À ?:|Cc ?:|Objet ?:|Date ?:)/g, "**$1**");
        description = description.replace(/^(Bonjour.*|Hello.*|Salut.*|Bonsoir.*)/gm, "");
        description = description.replaceAll(/^([^\n\n|-].*)/gm, ">$1");
        console.log(description)
        overlayDescription.value = description
    }

})();