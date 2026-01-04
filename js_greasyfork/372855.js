// ==UserScript==
// @name         Advanced search job filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all users with company
// @author       Jox [1714547]
// @match        https://www.torn.com/userlist.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372855/Advanced%20search%20job%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/372855/Advanced%20search%20job%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyFilter(){
        let list = document.querySelector('.user-info-list-wrap');
        for(var i=0; i < list.childNodes.length; i++){
            if(list.childNodes[i].childNodes.length > 0){
                //console.log(list.childNodes[i]);
                if(list.childNodes[i].querySelector('#icon27') || list.childNodes[i].querySelector('#icon73')){
                    list.childNodes[i].style.display = 'none';
                }
            }
        }
    }

    function isListOfPlayers(node) {
        if(node.childNodes.length == 5){
        return node.childNodes[3].classList !== undefined &&
            node.childNodes[3].classList.contains('level-icons-wrap');
        }
        else{
            return false;
        }
    }

    function watchForPlayerListUpdates() {
        let target = document.querySelector('.userlist-wrapper');
        let doApplyFilter = false;
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        break;
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