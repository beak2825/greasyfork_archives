// ==UserScript==
// @name         yggDownButton
// @namespace    https://greasyfork.org/scripts/452039
// @version      1.1
// @description  Ajoute un bouton Download dans les recherches
// @author       MASTERD
// @include      /^https?\:\/\/.*.yggtorrent\..*\/.*$/
// @include      /^https?\:\/\/.*.ygg\..*\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452039/yggDownButton.user.js
// @updateURL https://update.greasyfork.org/scripts/452039/yggDownButton.meta.js
// ==/UserScript==

var checkIDexist = document.getElementById("register");
if(!checkIDexist){ //Start IF

(function() { //Start Function1 (Chect Website and Start Function2)
    'use strict';
    waitForKeyElements( "#\\#torrents", ST => DownButton(ST), false );
})(); //End Function1

function DownButton(ST) { //Star Function2
    let tbodys = ST.querySelector('tbody').rows; //Get all rows for torr
    let theads = ST.querySelector('thead').rows; //Get the Header of rows

    for (let thead of theads) { //Start For1 (Set the name of new columb Download)
        let torrCell = thead.insertCell(3); //Insert colum Download after NFO
        torrCell.innerHTML = "Download";
    } //End For1

    for (let tbody of tbodys) { //Start For2 (add Download button in each rows)
        let torrCell = tbody.insertCell(3), //Insert colum Download after NFO
            torrUrl = tbody.cells[1].childNodes[0], //Get torrent link from second columb
            torrId = torrUrl.href.split("/").pop().split("-")[0],
            Htt = torrUrl.href.split("://")[0], //Get http or https
            UrlBeg = torrUrl.href.split("//").pop().split(".")[0], //Get the subdomain (Ygg change www, ex: www5, ww1)
            MurlEnd = torrUrl.href.split("//").pop().split(".")[2], //Get domain extension (Ygg change .***, ex: .net, .se, .fi)
            Url = Htt + "://" + UrlBeg + ".yggtorrent." + MurlEnd, //Complet the url link for Download
            style = "padding: 1px; margin: 0px; width: 100%!important;max-width: 100%;"; //Set the style of button, Ygg have style for button, but is to big
        torrCell.innerHTML = '<button type="button" onclick="location.href=\'/engine/download_torrent?id=' + torrId + '\'" style="'+ style +'">Download</button>'; //Create button
    } //End For2

} //End Function2

// waitForKeyElements from github (edited)
function waitForKeyElements(
    selectorTxt, /* Required: The selector string that specifies the desired element(s). */
    actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
    bWaitOnce /* Optional: If false, will continue to scan for new elements even after the first match is found. */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they are new.*/
        targetNodes.forEach(function (element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(element);
                if (cancelFound) btargetsFound = false;
                else element.dataset.found = 'alreadyFound';
            }
        });
    } else {
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
        delete controlObj[controlKey];
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

}//end IF