// ==UserScript==
// @name         Tweeter Dumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetch tweet, author, and media urls and save to json file
// @author       krystianmoras@gmail.com
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant    GM_addStyle
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/474777/Tweeter%20Dumper.user.js
// @updateURL https://update.greasyfork.org/scripts/474777/Tweeter%20Dumper.meta.js
// ==/UserScript==

(function () {
    ////////////////////////////////////////////////////////////
    // taken from https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
    function waitForKeyElements(
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
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                    300
                );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
///////////////////////////////////////////////////////////////////
    waitForKeyElements("article", actionFunction);


    function actionFunction(jNode) {
        setTimeout(function () {

            var button = document.createElement("button");
            button.innerHTML = "Save";
            button.onclick = function () {

                // get author name
                // inside data-testid="User-Name"
                var author = jNode.find("div[data-testid='User-Name']").text();
                console.log(author);


                // get date
                var date = jNode.find("time").attr("datetime");
                console.log(date);

                // get text
                var text = jNode.find("div[lang='en']").text();
                console.log(text);

                // get all images
                var images = jNode.find("img");
                var image = "";
                for (var i = 1; i < images.length; i++) {
                    image += images[i].src + "\n";
                }
                console.log(image);

                // get video
                var video = jNode.find("video").attr("src");
                console.log(video);

                // create blob
                var json = {
                    "author": author,
                    "date": date,
                    "text": text,
                    "image": image,
                    "video": video
                };
                var blob = new Blob([JSON.stringify(json)], { type: "text/plain;charset=utf-8" });


                // create file name
                var file_name = author + "_" + date + ".tweeter_dumper.json";

                // download without popup
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = file_name;
                link.click();



            };
            var share_button = jNode.find("div[data-testid='caret']").parent();
            share_button.append(button);
        }, 1000);

    }


})();
