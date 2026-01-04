// ==UserScript==
// @name         Gimmme HealerZ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Where are all those healz
// @author       Jox [1714547]
// @match        https://www.torn.com/halloffame.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374800/Gimmme%20HealerZ.user.js
// @updateURL https://update.greasyfork.org/scripts/374800/Gimmme%20HealerZ.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function applyFilter(){

        //console.log('Apply filter');

        let list = document.querySelector('.players-list');
        for(var i=0; i < list.childNodes.length; i++){
            if(list.childNodes[i].childNodes.length > 0){
                //console.log(list.childNodes[i]);

                if(list.childNodes[i].querySelector('.arrow-change-icon').title.startsWith("Down")){
                    list.childNodes[i].style.display = 'none';
                }
                else {
                    if(list.childNodes[i].querySelector('.faction').tagName.toLowerCase() == 'a'){
                        list.childNodes[i].style.display = 'none';
                    }
                }

                /*
                console.log('arrow', list.childNodes[i].querySelector('.arrow-change-icon').title);
                console.log('faction', list.childNodes[i].querySelector('.faction').tagName);
                console.log('------------------------------------------');
                */
            }
        }
    }

    function isListOfPlayers(node) {
        //console.log('Node',node);

        if(node.childNodes.length > 2){
        return node.childNodes[5].classList !== undefined &&
            node.childNodes[5].classList.contains('players-list');
        }
        else{
            return false;
        }
    }

    function watchForPlayerListUpdates() {
        let target = document.querySelector('.hall-of-fame-wrap');
        let doApplyFilter = false;
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    //console.log(mutation.addedNodes.item(i));
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        //console.log('Have List of players');
                        break;
                    }
                    else{
                        //console.log('Not a List of players');
                    }
                }

                if (doApplyFilter) {
                    applyFilter();
                }
            });
        });
        // configuration of the observer:
        //let config = { childList: true, subtree: true };
        let config = { childList: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
    watchForPlayerListUpdates();
})();





