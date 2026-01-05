// ==UserScript==
// @name         fix edx
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fixing UX problems of Edx
// @author       Yaroslav Shepilov
// @match        https://courses.edx.org/*
// @match        https://inginious-lti.info.ucl.ac.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23784/fix%20edx.user.js
// @updateURL https://update.greasyfork.org/scripts/23784/fix%20edx.meta.js
// ==/UserScript==

if (window.top === window.self) {

    window.onmessage = function(e){
        if (e.data.includes('"height"') && e.data.includes('"index"')) {
            var message = JSON.parse(e.data);
            var height = message.height;
            var index = message.index;

            //console.log("READ " + e.data);

            if (height > 0) {
                var iframe = document.getElementsByTagName('iframe')[index];

                var currentHeight = iframe.offsetHeight;

                var heightDiff = height - currentHeight;

                if ((heightDiff > 0) || (currentHeight == 800) || (heightDiff < -50)) {
                    iframe.style.height = height + "px";
                }
            }
        }
    };


} else {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var currentFrame = window;

    var observer = new MutationObserver(function(mutations, observer) {
        var height = document.body.offsetHeight;

        var index = 0;
        for (var i = 0; i < parent.frames.length; i++) {
            if (parent.frames[i] === currentFrame) {
                index = i;
                break;
            }
        }

        var message = {"index": index, "height": height};
        var jsonMessage = JSON.stringify(message);
        //console.log("WRITE " + jsonMessage);
        window.parent.postMessage(jsonMessage, "https://courses.edx.org/");
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
}