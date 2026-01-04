// ==UserScript==
// @name          Cyberpunk 2077 Anti-Spoiler
// @namespace     artos0131
// @description   Wake the fuck up Samurai, we've got spoilers to hide!
// @match         *://*reddit.com/*
// @grant         none
// @author        artos0131
// @version       1.0
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/418314/Cyberpunk%202077%20Anti-Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/418314/Cyberpunk%202077%20Anti-Spoiler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // You can add your own words here, just follow the pattern, it's simple!
    // Replace special variable contents with '' if it's too strict for you, like so: 
    // const special = '';
    const special = 'corpse,death,dead,dead body,body of,dies,died,dying,killing,murder,murdered,kills,killed,suicide,betrays,betrayal,life path,lifepath';
    const wordlist = special + ' v ,judy,alvarez,jackie,welles,meredith,stout,dexter,deshawn,tbug,t-bug,lizzy,lizzie,wizzy,victor,vector,johnny,silverhand,braindance,cyberpunk,cyber punk,2077,cp2077,cdpr,cd projekt,cdprojekt,night city,keanu,reeves,nomad,nomads,corpo,corpos,street kid,street cred,streetkid,techie,netrunner,net runner,fixer,rockerboys,rocker boys';

    // RegEx
    const quant = /[-\/\\^$*+?.'!:()|[\]{}]/g;
    const keywords = wordlist.replace(quant, '\\$&').split(',').join('|')
    const pattern = new RegExp(keywords, 'gi');
  
    // Mutation Observer
    const target = document.body
    const config = { childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            for (var i=0; i<mutation.addedNodes.length; i++) {
                // Search for added text nodes
                if (mutation.addedNodes[i].nodeType == 3){
                    filter(mutation.addedNodes[i]);
                }
            }
        });
    };
  
    const observer = new MutationObserver(callback);
    observer.observe(target, config);
  
    // Initialize after page load
    init();
  
    function init() {
        const nodes = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      
        if (!nodes.snapshotItem(0)) {
            return;
        }
      
        for (var i=0, len=nodes.snapshotLength; i < len; i++) {
            filter(nodes.snapshotItem(i));
        }
    }
  
    function filter(node) {
        if (pattern.test(node.nodeValue)) {
            const span = document.createElement('span');

            span.innerHTML = '<span style="color: black !important;background-color: black !important;">' + node.nodeValue + '</span>';
            node.parentNode.replaceChild(span, node);
        }
    }

})();

