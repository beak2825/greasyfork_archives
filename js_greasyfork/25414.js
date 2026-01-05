// ==UserScript==
// @name         39thX Warbase Helper
// @namespace    namespace
// @version      0.1
// @description  Highlights potential war targets in green on HOF page
// @author       tos
// @match        *.torn.com/halloffame.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25414/39thX%20Warbase%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25414/39thX%20Warbase%20Helper.meta.js
// ==/UserScript==

APIkey = 'APIKEY'; //API key here leave the quotes it's a string
minFacSize = 50;     //Set minimum faction size here

badTargets = ["16312", "19"];

$.ajax({
    type: "GET",
    url: 'https://api.torn.com/faction/16312?selections=basic&key='+ APIkey,
    success: function (response) {
        var wars = Object.keys(response.wars);
        var naps = Object.keys(response.naps);
        var peace = Object.keys(response.peace);
        for(i=0; i < wars.length; i++){
            badTargets.push(wars[i]);
        }
        for(i=0; i < naps.length; i++){
            badTargets.push(naps[i]);
        }
        for(i=0; i < peace.length; i++){
            badTargets.push(peace[i]);
        }
    }
});

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            try{
                if(node.className === 'hall-of-fame-wrap respect m-bottom10'){
                    var factionList = node.querySelector('.players-list').children;
                    for(i=0; i < factionList.length; i++){
                        var facSize = parseInt(factionList[i].querySelector('.acc-wrap .player-info').children[0].innerText);
                        var facID = factionList[i].querySelector('.acc-header .player-info .player').children[1].href.split('ID=')[1];
                        if(facSize > minFacSize && !badTargets.includes(facID)){
                            factionList[i].style.backgroundColor = '#d7e1cc';
                        }
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        }
    }
});
const wrapper = document.querySelector('#mainContainer .hall-of-fame-list-wrap');
observer.observe(wrapper, { subtree: true, childList: true });

