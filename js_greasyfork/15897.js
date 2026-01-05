// ==UserScript==
// @id             SDA now playing color
// @name           SDA now playing color
// @version        2016.01.04
// @author         DikUln
// @description    AGDQ/SGDQ schedule color mode
// @include        http://marathon.speeddemosarchive.com/schedule
// @include        https://www.gamesdonequick.com/schedule
// @include        http://www.gamesdonequick.com/schedule
// @include        https://gamesdonequick.com/schedule
// @include        http://gamesdonequick.com/schedule
// @match          http://marathon.speeddemosarchive.com/schedule
// @match          https://www.gamesdonequick.com/schedule
// @match          http://www.gamesdonequick.com/schedule
// @match          https://gamesdonequick.com/schedule
// @match          http://gamesdonequick.com/schedule
// @require  	   http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @run-at         document-start
// @namespace https://greasyfork.org/users/6793
// @downloadURL https://update.greasyfork.org/scripts/15897/SDA%20now%20playing%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/15897/SDA%20now%20playing%20color.meta.js
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

waitForKeyElements (
            "tr.day-split"
            , createStyles
        );

var i = setInterval(createHighlight,60000);

function createStyles() {
    createHighlight();
    
    var greenrows = document.createElement('style');
    greenrows.innerHTML = "#runTable .greenrow, #runTable .greenrow td:nth-child(even), #runTable .greenrow td:nth-child(odd) { background-color: inherit; background-image: linear-gradient(#FFD93F,#FFD93F); background-blend-mode: soft-light; }";
    document.body.appendChild(greenrows);
    var pinkrows = document.createElement('style');
    pinkrows.innerHTML = "#runTable .pinkrow, #runTable .pinkrow td:nth-child(even), #runTable .pinkrow td:nth-child(odd) { background-color: inherit; background-image: linear-gradient(#7FD9FF,#7FD9FF); background-blend-mode: soft-light; }";
    document.body.appendChild(pinkrows);
    var greyrows = document.createElement('style');
    greyrows.innerHTML = "#runTable .greyrow, #runTable .greyrow td:nth-child(even), #runTable .greyrow td:nth-child(odd) { background-color: inherit; background-image: linear-gradient(#c0c0c0,#F0F0F0); background-blend-mode: soft-light; }";
    document.body.appendChild(greyrows);
}

function removeClassFromElem (elem) {
	elem.className = elem.className.replace( /(?:^|\s)greenrow(?!\S)/g , '');
	elem.className = elem.className.replace( /(?:^|\s)pinkrow(?!\S)/g , '');
	elem.className = elem.className.replace( /(?:^|\s)greyrow(?!\S)/g , '');
}

function createHighlight() {
    var list = document.querySelectorAll( "#runTable tr td:first-child" );
    var nowTime = new Date();
    var year = nowTime.getFullYear();

    var month = null;
    var day = null;

    var prev = null;
    var curr = null;

    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
    }

    for (i=0;i<list.length;i++) {

        var elem = list[i].textContent;
        //console.log(elem);

        if (elem.indexOf(" AM") < 0 && elem.indexOf(" PM") < 0) {
            var current = elem.split(",")[1].trim().split(" ");
            month = getMonthFromString(current[0]);
            day = current[1].replace("th","");
        } else {
            var runTime = new Date(Date.parse(year + "-" + month + "-" + day + " " + elem));
            prev = curr;
            curr = list[i];
            // console.log(runTime);
            if (nowTime <= runTime) {
                // console.log(runTime);
                removeClassFromElem(prev.parentElement);
                removeClassFromElem(curr.parentElement);
                prev.parentElement.className += " greenrow";
                curr.parentElement.className += " pinkrow";
                break;
            } else {
                if (prev !== null) {
                    removeClassFromElem(prev.parentElement);
                    prev.parentElement.className += " greyrow";
                }
            }
        }

    }

}