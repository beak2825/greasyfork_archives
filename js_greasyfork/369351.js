// ==UserScript==
// @name         Twitter Video Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to twitter to access videos and gifs easily
// @author       damakuno
// @match        https://twitter.com/
// @include      https://twitter.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369351/Twitter%20Video%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/369351/Twitter%20Video%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const addLinkButton = () => {
        let tweets = document.querySelectorAll('.tweet');
        tweets.forEach((t) => {
            let actionList = t.querySelector('.ProfileTweet-actionList');
            if (actionList){
                if (!actionList.querySelector('.ProfileTweet-action--linkVideo')){
                    let VideoUrl = '';
                    let Video = t.querySelector('video');
                    if (Video) {
                        VideoUrl = Video.src;
                        console.log(Video);

                        let divLinkVideo = document.createElement('DIV');
                        divLinkVideo.className = 'ProfileTweet-action ProfileTweet-action--linkVideo';

                        let btnLinkVideo = document.createElement('A');
                        btnLinkVideo.className = 'ProfileTweet-actionButton u-textUserColorHover js-actionButton';

                        let btnText = document.createTextNode('Video/Gif');
                        btnLinkVideo.appendChild(btnText);

                        btnLinkVideo.href = VideoUrl;
                        //btnLinkVideo.download = VideoUrl.substring(VideoUrl.lastIndexOf('/')+1);

                        divLinkVideo.appendChild(btnLinkVideo);
                        actionList.appendChild(divLinkVideo);
                    }
                }
            }
        });
    }

    window.onload = function(){
        addLinkButton();
    }

     waitForKeyElements (
        '.AdaptiveMedia-container video',
        addLinkButton
        );


    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
})();