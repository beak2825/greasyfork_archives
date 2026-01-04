// ==UserScript==
// @name        Chaturbate sort
// @namespace   Lurk4
// @author  itsmewantscaps
// @description sorts camwhores descending by viewers 
// @include     https://chaturbate.com/*
// @include     https://*.chaturbate.com/*
// @version     1.0.3
// @run-at     document-end
// @license MIT
// @OS *
// @downloadURL https://update.greasyfork.org/scripts/30911/Chaturbate%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/30911/Chaturbate%20sort.meta.js
// ==/UserScript==

(function(){
var cbisMobile = window.location.href.indexOf("//m.chaturbate.") > -1
function sortCamwhores() {
    var i
    var elems
    var camsinfo
    var res = null
    var mainList = null
    var contentHolder;
    var subClass
    if (cbisMobile) {
        var bc = document.getElementById("broadcasters");
        if (bc !== null)
            contentHolder = [bc]
        subClass = "time-viewers-inner"
    } else {

        contentHolder = document.getElementsByClassName("list");
        subClass = "cams"
    }


    if (contentHolder !== null && (contentHolder.length > 0)) {
        for (i = 0; i < contentHolder.length; i++) {
            res = [];
            mainList = contentHolder[i];
            elems = mainList.getElementsByClassName(subClass);
            for (j = elems.length - 1; j >= 0; j--) {
                camsinfo = elems[j].innerText.match(/(\d+) min.*, (\d+) viewer.*\b/);
                var pElement = cbisMobile ? elems[j].parentElement.parentElement : elems[j].parentElement.parentElement.parentElement;
                res.push({
                    "element": pElement,
                    "viewers": camsinfo !== null && camsinfo.length > 2 ? camsinfo[2] : 0
                });
                mainList.removeChild(pElement);

            }
            res.sort(function(a, b) {
                return b.viewers - a.viewers;
            });
            for (j = 0; j < res.length; j++) {
                mainList.appendChild(res[j].element);
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
        }
    };
})();

observeDOM(document.getElementById(cbisMobile ? 'broadcasters' : 'main'), function(observer) {
    observer.disconnect();
    sortCamwhores();
    observer.observe(document.getElementById(cbisMobile ? 'broadcasters' : 'main'), {
        childList: true,
        subtree: true
    });
});
})();