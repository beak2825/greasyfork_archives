// ==UserScript==
// @name         Hof Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Filter hall of Fame
// @author       Jox [1714547]
// @match        https://www.torn.com/halloffame.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373782/Hof%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/373782/Hof%20Filter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //Globals
    var greenArrow = false;
    var noFactionTag = false;
    var haveFactionTag = false;
    var switchProfileInfo = false; //change this ti true to switch profile info


    //Start script
    if(window.location.href.startsWith('https://www.torn.com/profiles.php?XID=')){
        if( switchProfileInfo){
            setTimeout(function(){
                var profileInfo = document.querySelectorAll('.profile-left-wrapper');
                if(profileInfo.length == 2){
                    var element1 = profileInfo[0];
                    var element2 = profileInfo[1];
                    var parent1 = element1.parentNode;
                    var parent2 = element2.parentNode;

                    parent1.removeChild(element1);
                    parent2.removeChild(element2);

                    parent1.insertBefore(element2, parent1.firstChild);
                    parent2.insertBefore(element1, parent2.firstChild);
                }
                else {
                    console.log('have more then 2 elements', profileInfo);
                }
            }, 300);
        }
    }
    else{
       start();
    }

    function start(){
        //Create container div for widget
        var container = document.createElement('div');
        container.id = 'JoxDiv';

        //Create header
        var header = document.createElement('div');
        header.classList.add('title-black', 'm-top10', 'title-toggle', 'active', 'top-round');
        header.innerHTML = 'HoF filter'

        //Create body
        var body = document.createElement('div');
        body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle', 'unreset');
        body.style.display = 'flex';
        body.style.flexWrap = 'wrap';

        //Add header and body elements
        container.appendChild(header);
        container.appendChild(body);

        //Add items
        var cbGreenArrow = document.createElement('input');
        var lblGreenArrow = document.createElement('label');
        lblGreenArrow.innerHTML = 'Green Arrow';
        lblGreenArrow.setAttribute('for','cbGreenArrow');
        cbGreenArrow.type = 'checkbox';
        cbGreenArrow.id = 'cbGreenArrow';
        cbGreenArrow.name = 'cbGreenArrow';
        cbGreenArrow.style.margin = '0 5px';
        cbGreenArrow.onclick = function(e){
            if(e.target.checked){
                greenArrow = true;
            }
            else{
                greenArrow = false;
            }

            applyFilter();
        }

        body.appendChild(cbGreenArrow);
        body.appendChild(lblGreenArrow);

        var cbNoFactionTag = document.createElement('input');
        var lblNoFactionTag = document.createElement('label');
        lblNoFactionTag.innerHTML = 'No faction tag';
        lblNoFactionTag.setAttribute('for','cbNoFactionTag');
        cbNoFactionTag.type = 'checkbox';
        cbNoFactionTag.id = 'cbNoFactionTag';
        cbNoFactionTag.style.margin = '0 5px';
        cbNoFactionTag.onclick = function(e){
            if(e.target.checked){
                noFactionTag = true;
            }
            else{
                noFactionTag = false;
            }

            applyFilter();
        }

        body.appendChild(cbNoFactionTag);
        body.appendChild(lblNoFactionTag);


        var cbHaveFactionTag = document.createElement('input');
        var lblHaveFactionTag = document.createElement('label');
        lblHaveFactionTag.innerHTML = 'Have faction tag';
        lblHaveFactionTag.setAttribute('for','cbHaveFactionTag');
        cbHaveFactionTag.type = 'checkbox';
        cbHaveFactionTag.id = 'cbHaveFactionTag';
        cbHaveFactionTag.style.margin = '0 5px';
        cbHaveFactionTag.onclick = function(e){
            if(e.target.checked){
                haveFactionTag = true;
            }
            else{
                haveFactionTag = false;
            }

            applyFilter();
        }

        body.appendChild(cbHaveFactionTag);
        body.appendChild(lblHaveFactionTag);


        //Add message container
        var msgContainer = document.createElement('div');
        msgContainer.id = "JoxMsgContainer";
        msgContainer.classList.add('cont-gray10', 'bottom-round');
        msgContainer.style.backgroundColor = '#e6e6e6';
        msgContainer.style.borderTop = '1px solid #cdcdcd';
        msgContainer.style.marginTop = '-5px';
        msgContainer.style.display = 'none';
        container.appendChild(msgContainer);

        //Add div to page
        insertAfter(container, document.querySelector('.stats-list'));

        watchForPlayerListUpdates();
    }

    function applyFilter(){

        //console.log('Apply filter');
        /*
        if(!window.location.href.includes('type=revives')){
            return;
        }
        */
        let list = document.querySelector('.players-list');
        for(var i=0; i < list.childNodes.length; i++){
            if(list.childNodes[i].childNodes.length > 0){
                //console.log(list.childNodes[i]);

                list.childNodes[i].style.display = null;

                if(!list.childNodes[i].querySelector('.arrow-change-icon').title.startsWith("Up") && greenArrow){
                    list.childNodes[i].style.display = 'none';
                }

                if(list.childNodes[i].querySelector('.faction').tagName.toLowerCase() == 'a' && noFactionTag){
                    list.childNodes[i].style.display = 'none';
                }

                if(list.childNodes[i].querySelector('.faction').tagName.toLowerCase() != 'a' && haveFactionTag){
                    list.childNodes[i].style.display = 'none';
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

    //Helper function for more readability
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
})();
