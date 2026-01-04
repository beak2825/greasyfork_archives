// ==UserScript==
// @name        Chaturbate Sort Models
// @namespace   https://openuserjs.org/users/Notorious  https://greasyfork.org/en/users/668999-notorious
// @version     1.0.4
// @description Sorts Models in descending (High to Low) order of viewers
// @author      Notorious
// @include     https://chaturbate.com/*
// @include     https://*.chaturbate.com/*
// @grant       none
// @license     MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/414979/Chaturbate%20Sort%20Models.user.js
// @updateURL https://update.greasyfork.org/scripts/414979/Chaturbate%20Sort%20Models.meta.js
// ==/UserScript==


(function(){

    function sortCamwhores() {
    var i
    var elems
    var camsinfo
    var res = null
    var mainList = null
    var contentHolder= document.getElementsByClassName("list");;
    var subClass= "cams";

    if (contentHolder !== null && (contentHolder.length > 0)) {
        for (i = 0; i < contentHolder.length; i++) {
            res = [];
            mainList = contentHolder[i];
            elems = mainList.getElementsByClassName(subClass);
            for (var j = elems.length - 1; j >= 0; j--) {
                var info=elems[j].innerText.replace(/\,/g, ".");
                camsinfo = info.match(/(.*)(\. )(\d+)(.*)/);

                var pElement = elems[j].parentElement.parentElement.parentElement;
                res.push({
                    "element": pElement,
                    "viewers": camsinfo !== null && camsinfo.length > 2 ? camsinfo[3] : 0
                });

                mainList.removeChild(pElement);
            }
            res.sort(function(a, b) {
                return b.viewers - a.viewers;
            });
            for (var jj = 0; jj < res.length; jj++) {
                mainList.appendChild(res[jj].element);
            }
        }
    }
}
sortCamwhores();

//https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer) {
                if (mutations[0].addedNodes.length) {
                    callback(observer);
                }
            });
            // have the observer observe foo for changes in children
            obs.observe(obj, {
                childList: true,
                subtree: true
            });
        } else if (eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

observeDOM(document.getElementById('main'), function(observer) {
    observer.disconnect();
    sortCamwhores();
    observer.observe(document.getElementById('main'), {
        childList: true,
        subtree: true
    });
});
})();
