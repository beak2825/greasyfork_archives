// ==UserScript==
// @name         Afficher les IDs des cartes trello
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Afficher les IDs des cartes trello, sur le résumé et sur le détail des cartes
// @author       You
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458850/Afficher%20les%20IDs%20des%20cartes%20trello.user.js
// @updateURL https://update.greasyfork.org/scripts/458850/Afficher%20les%20IDs%20des%20cartes%20trello.meta.js
// ==/UserScript==


(function() {

    const style = document.createElement('style');
    style.setAttribute("id", "show-card-id");
    style.textContent = `.card-short-id.hide{
     						display: block !important;
     						opacity: 0.6;
     						font-style: italic;
    					}
                        .window-title {
    					    display: flex;
    					    flex-direction: row;
    					    flex-wrap: nowrap;
    					    gap: 10px;
    					}
                        input.nch-button.bebold-id-card {
     					    transform: translateY(-4px);
    					}
                        .window-cover.hide ~ .window-header input.nch-button.bebold-id-card {
    					    margin-right: 5px;
    					}
                        .window-cover:not(.hide) ~ .window-header {
     					    padding-right: 16px;
    					}
    					@media only screen and (max-width: 750px){
    					    input.nch-button.bebold-id-card {
        					    transform: translateY(0);
    					    }
    					    .window-title {
    					        padding-right: 20px;
    					    }
    					}`;
    document.head.append(style);

    var mainFunction = function() {
        var starBtn = document.querySelector('.board-header-btn.js-star-board.board-header-star-container');
        if(starBtn != null){
            console.log("trello ids");

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === "attributes") {

                        //var overlayDescription = document.querySelector('.window-module-title.window-module-title-no-divider.description-title h3');
                        var overlayDescription = document.querySelector('.window-title');

                        if(overlayDescription != null && document.querySelector('.nch-button.bebold-id-card') == null){

                            var id = window.location.toString().trim('/').split('/');
                            id = id[id.length-1].split('-')[0];
                            var toggleTrigger = document.createElement('div');
                            toggleTrigger.innerHTML ='<input style="width:calc('+(id.length+2)+'ch + 25px);" class="nch-button bebold-id-card" value="#'+id+'" />';
                            overlayDescription.append(toggleTrigger);
                        }
                    }
                });
            });

            observer.observe(document.querySelector('.window-overlay .window .window-wrapper.js-autofocus.js-tab-parent'), {
                attributes: true //configure it to listen to attribute changes
            });

        }
        else docReady(mainFunction);
    };
    docReady(mainFunction);
    function docReady(fn) {
        // see if DOM is already available
        if(document.querySelector('.board-header-btn.js-star-board.board-header-star-container') != null){

            if (document.readyState === "complete" || document.readyState === "interactive") {
                // call on next available tick
                setTimeout(fn, 1);
            } else {
                document.addEventListener("DOMContentLoaded", fn);
            }
        }else
            setTimeout(fn, 500);
    }

})();