// ==UserScript==
// @name         remove Baidu ads
// @namespace    http://sosonemo.me/
// @version      0.1
// @description  remove Baidu ads that Adblocker Plus cannot remove
// @author       NemoTyrant
// @include      *www.baidu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23561/remove%20Baidu%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/23561/remove%20Baidu%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove(){
        E.pl = null; // remove ad generation code

        var results = document.querySelector("div#content_left");
        var children = results.children;
        for(var i = 0; i < children.length;i++){
            if (children[i].className.indexOf('c-container') == -1){
                children[i].parentNode.removeChild(children[i]);
            }
        }
        // console.log("removed!");

    }

    remove();

    var target = document.querySelector('#wrapper_wrapper');

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "childList" && mutation.addedNodes.length > 0){
                // console.dir(mutation);
                remove();
            }
        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
})();