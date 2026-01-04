// ==UserScript==
// @name         Remove Facebook ads
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Uses mutation observer to take action when elements added to page. Looks for ads based on Spon appearing in non hidden elements!
// @author       Skarn
// @match        https://www.facebook.com*
// @downloadURL https://update.greasyfork.org/scripts/395894/Remove%20Facebook%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/395894/Remove%20Facebook%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //set up an observer object
    var observerOptions = {
        childList: true,
        subtree: true
    }

    var observer = new MutationObserver(callback);
    var processedNodes = new Set();
    var targetNode;

    //init
    trytryagain(init);

    function trytryagain(fnToTry){
        var tries = 10;
        var tryNumber = 0;
        var tryTimer;

        if(fnToTry.timer){
            window.clearTimeout(fnToTry.timer);
            fnToTry.timer = null;
        }

        var fnToTryWrapper = function(){
            tryNumber++;

            try{
                fnToTry();
            }catch(e){
                if(tryNumber > tries){
                    //give up.
                    return;
                }

                //try again
                fnToTry.timer = window.setTimeout(function(){
                    fnToTryWrapper();
                }, 2000);
            }
        };

        fnToTryWrapper();
    }

    function init(){
        //GM_addStyle(".userContentWrapper {opacity: 0; transition: opacity 0.1s;}");
        targetNode = document.getElementById("mainContainer");
        removeAds(targetNode);

        //observe
        trytryagain(restartObserver);

        //right column removal - more fiddly than worthwhile - might remove later or make optional
        document.querySelector('#rightCol').style.display = 'none';
        var content = document.querySelector('#contentArea') || document.querySelector('#timeline_story_column');
        if(content){
            content.style.left = '0px';
            content.style.setProperty("width", "calc(100% - 50px)", "important");
            content.style.setProperty("left", "0px", "important");
        }
    }

    function restartObserver(){
        targetNode = document.getElementById("mainContainer");
        observer.disconnect();
        observer.observe(targetNode, observerOptions);
    }

    function removeAds(addedNode){
        try{
            if(processedNodes.has(addedNode)){
                return;
            }

            processedNodes.add(addedNode);

            observer.disconnect();

            var interestingNodes = addedNode.querySelectorAll('.c_1kvvzw3p2b.v_1kvvzw3p30.o_1kvvzw3p2o')
            interestingNodes.forEach(function(item){
                var interestingCharacters = item.querySelectorAll('.c_1kvvzw3p2b');
                var visibleChars = '';
                if(interestingCharacters.length > 1){
                    interestingCharacters.forEach(function(char){
                        if(char.children.length === 0){
                            var stylePosition = window.getComputedStyle(char).position;
                            if(stylePosition !== 'absolute' && stylePosition !=='fixed'){
                                visibleChars = visibleChars + char.textContent;
                            }
                        }
                    });

                    var rx = /.*S.*p.*o.*n.*s.*o.*r.*e.*d.*/;
                    var match = visibleChars.match(rx);
                    if(match && match.length > 0){
                        var section = item.closest('.userContentWrapper');
                        if(section){
                            section.style.display = 'none';
                        }
                    }
                }


            });

            observer.observe(targetNode, observerOptions);
        }catch(e){
            //error during ad removal - skip it, but re-enable observer still
            observer.observe(targetNode, observerOptions);
        }
    }

    function callback(mutationList, observer) {
        //wipe ads out of whatever was added to the page
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    var addedNodes = mutation.addedNodes;
                    if(addedNodes && addedNodes.length > 0){
                        var addedNode = addedNodes[0];
                        if(addedNode.nodeType === 1){
                            removeAds(addedNode);
                        }
                    }
                    break;
            }
        });

        //every time the page dom is modified, restart the observer
        //this is because clicking on linked pages etc. for some reason killed observer
        //doesn't hurt to reinitialise it every time.
        trytryagain(restartObserver);
    }
})();