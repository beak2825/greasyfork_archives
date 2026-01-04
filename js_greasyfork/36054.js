// ==UserScript==
// @name         Kiwiirc Annoyance Removal
// @description remove user has joined prompts.
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://kiwiirc.com/client/irc.sageru.org/*
// @downloadURL https://update.greasyfork.org/scripts/36054/Kiwiirc%20Annoyance%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/36054/Kiwiirc%20Annoyance%20Removal.meta.js
// ==/UserScript==

    console.log(document.body);

(function() {
    function alterPage(){
        var nodes = Array.from(document.body.getElementsByClassName('msg'));
        //console.log("rdfg");
        //console.log(nodes);
        if(document.body.classList.contains('msg')){
            nodes.unshift(document.body);
        }

        nodes.forEach(function(node){
            var nodeList = node.childNodes;
            if(nodeList[2].textContent.indexOf('_other_users is now known as') <= -1){
                //nodeList[1] = nodeList[0] + "::" +  nodeList[1];
                return;
            }
            else{
                node.remove();
            }
        });
    }

    //console.log(document.body);

    new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            mutation.addedNodes.forEach(alterPage);
        });
    }).observe(document.body, {childList: true, subtree: true});
})();