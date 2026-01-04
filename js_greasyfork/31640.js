// ==UserScript==
// @name         THAT?TWITTER?CLAP?THING
// @namespace    https://seans.site/
// @version      1.0
// @description  MAKE?YOUR?TIMELINE?LOSE?ALL?SENSE?OF?TONE?AND?CONTEXT
// @author       SEAN?S?LEBLANC
// @match        https://twitter.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31640/THATTWITTERCLAPTHING.user.js
// @updateURL https://update.greasyfork.org/scripts/31640/THATTWITTERCLAPTHING.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log(mutation);
            if (mutation.addedNodes) {
                // element added to DOM
                var hasClass = false;
                for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
                    var el = mutation.addedNodes[J];
                    clap(el);
                }
            }
        });
    }).observe(document, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: true
    });

    var stylesheet = document.createElement('style');
    stylesheet.innerHTML = ".tweet-text{text-transform: uppercase;}";
    document.head.appendChild(stylesheet);

    var clapStr = '<img class="Emoji Emoji--forText" src="https://abs.twimg.com/emoji/v2/72x72/1f44f.png" draggable="false" alt="?" title="Clapping hands sign" aria-label="Emoji: Clapping hands sign">';
    function clap (_node){
        var tweets = _node.querySelectorAll && _node.querySelectorAll('.tweet-text, #tweet-box-home-timeline') || [];
        for(var i = 0; i < tweets.length; ++i){
            var tweet = tweets[i];
            var nodes = tweet.childNodes;
            for(var j = 0; j < nodes.length; ++j){
                var node = nodes[j];
                if(node.constructor.name === "Text"){
                    var newNode = document.createElement('span');
                    newNode.innerHTML = node.nodeValue.replace(/[ ]/g, clapStr);
                    node.parentNode.replaceChild(newNode, node);
                }
            }
        }
    }
})();