// ==UserScript==
// @name         jut_su_download_button
// @namespace    https://jut.su
// @version      2024-03-17
// @description  adding button on jut.su for downloading
// @author       VakiKrin
// @match        https://jut.su/*
// @run-at document-end
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/495244/jut_su_download_button.user.js
// @updateURL https://update.greasyfork.org/scripts/495244/jut_su_download_button.meta.js
// ==/UserScript==
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
(function() {
    'use strict';

    waitForKeyElements('#my-player_html5_api > source[label="1080p"]', addButton);

    function addButton(node) {
        const videoSource = node[0].src;
        const videoName = extractVideoName(node[0].baseURI) + '.mp4';
        const videoContent = document.querySelector('.videoContent');

        if (!videoContent) {
            console.error('Video content container not found');
            return;
        }

        const newLink = createDownloadLink(videoSource, videoName);

        videoContent.appendChild(newLink);
    }

    function extractVideoName(uri) {
        const parts = uri.split('https://jut.su/')[1].split('/');
        return parts[1].split('.')[0];
    }

    function createDownloadLink(url, fileName) {
        const newLinkDiv = document.createElement('div');
        newLinkDiv.style.display = 'flex';
        newLinkDiv.style.alignItems = 'center';
        newLinkDiv.style.justifyContent = 'center';

        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = url;
        downloadAnchor.className = 'short-btn';
        downloadAnchor.textContent = 'DOWNLOAD';
        downloadAnchor.addEventListener('click', handleDownloadClick(url, fileName));

        newLinkDiv.appendChild(downloadAnchor);

        return newLinkDiv;
    }

    function handleDownloadClick(url, fileName) {
        return function(event) {
            event.preventDefault();
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        };
    }

})();