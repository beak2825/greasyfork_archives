// ==UserScript==
// @name         Faction Collector
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Collect faction form HoF
// @author       Jox [1714547]
// @match        https://www.torn.com/halloffame.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430965/Faction%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/430965/Faction%20Collector.meta.js
// ==/UserScript==


(function() {
    'use strict';


    watchForUpdates();

    function apply(){

        var FactinList = [];

        let list = document.querySelector('.players-list');
        for(var i=0; i < list.childNodes.length; i++){
            if(list.childNodes[i].childNodes.length > 0){
                //console.log(list.childNodes[i]);
                let link = list.childNodes[i].childNodes[1].childNodes[1].childNodes[1].childNodes[3];

                let id = link.href.replace('https://www.torn.com/factions.php?step=profile&ID=','');
                let name = link.innerHTML;
                console.log(id, name);

                FactinList.push({id: id, name: name});
            }
        }

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/tornFactionUpdater.php',
            data:       JSON.stringify(FactinList),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                //console.log('GET Respnse', responseDetails.responseText);
                console.log(responseDetails.responseText);
            }
        });
    }

    function isList(node) {
        //console.log('Node',node);

        if(node.childNodes.length > 2){
        return node.childNodes[5].classList !== undefined &&
            node.childNodes[5].classList.contains('players-list');
        }
        else{
            return false;
        }
    }

    function watchForUpdates() {
        let target = document.querySelector('.hall-of-fame-wrap');
        let doApply = false;
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApply = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    //console.log(mutation.addedNodes.item(i));
                    if (isList(mutation.addedNodes.item(i))) {
                        doApply = true;
                        //console.log('Have List of players');
                        break;
                    }
                    else{
                        //console.log('Not a List of players');
                    }
                }

                if (doApply) {
                    apply();
                }
            });
        });
        // configuration of the observer:
        //let config = { childList: true, subtree: true };
        let config = { childList: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }

})();
