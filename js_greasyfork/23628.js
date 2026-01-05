// ==UserScript==
// @name         GIS Jobs Favorite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add clickable favorite markers to jobs in the list
// @author       You
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        http://gisjobsmap.com
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23628/GIS%20Jobs%20Favorite.user.js
// @updateURL https://update.greasyfork.org/scripts/23628/GIS%20Jobs%20Favorite.meta.js
// ==/UserScript==

/*- The @grant directive is needed to work around a major design
    change introduced in GM 1.0.
    It restores the sandbox.
*/


(function init() {

    'use strict';
    var hasRun =  false;
    waitForKeyElements (".feature-row", run);

    function run() {
        var jobs = document.getElementsByClassName("feature-row");
        // print out the job id
        if (!jobs || jobs.length <= 0)
        {
            console.log(" no jobs, why am i here?");
            return;
        }
        console.log("found "+ jobs.length + " jobs");
        var i = 0;
        while (i < jobs.length) {
           // console.log("decorate ", i);
            decorateJob(jobs[i]);
            i++;
        }
    }

    function decorateJob(job){
         var jobStorageKey = "favorite-set-" + job.attributes.id.value;
        //console.log(job, job.attributes.id);
        // add a span as a following sibling
        if(!document.getElementById(jobStorageKey)){
            var favoriteInsert = document.createElement("span");
            favoriteInsert.appendChild(document.createTextNode("F"));
            favoriteInsert.setAttribute("id", jobStorageKey);
            applyStyle(favoriteInsert, jobStorageKey);
            job.appendChild(favoriteInsert);
            //console.log(job, favoriteInsert);
            // add an onclick handler that
            // checks if the localStorage value exists and toggles it if so
            // else creates it and sets it to true
            //--- Activate the newly added button.
            favoriteInsert.addEventListener (
                "click", toggleFavorite, false
            );
        }
    }

    function applyStyle(element, jobStorageKey){
        var favoritedStyle =  "position: absolute; text-align: center; border:1px solid blue; height:30px; width:30px; margin-left: -30px; background: yellow;";
        var hatedStyle =  "position: absolute; text-align: center; border:1px solid blue; height:30px; width:30px; margin-left: -30px; background: red;";
        var unknownStyle = "position: absolute; text-align: center; border:1px solid blue; height:30px; width:30px; margin-left: -30px;";
         if (getValue(jobStorageKey) == "faved") {
             element.style.cssText = favoritedStyle;}
        else if (getValue(jobStorageKey) == "nothing"){
            element.style.cssText = unknownStyle; }
        else {
             element.style.cssText = hatedStyle; }
    }

    function setDefaultValue(storageKey){
        localStorage.setItem(storageKey, "nothing");
    }

    function getValue(storageKey){
        var value = localStorage.getItem(storageKey);
        if (value == "faved") {
            return value; }
        else if (value == "hated") {
            return value; }
        else {
            return "nothing"; }
    }

    function setNextValue(storageKey){
        var value = getValue(storageKey);
        if (value == "faved"){
            localStorage.setItem(storageKey, "hated");}
        else if (value == "hated") {
            localStorage.setItem(storageKey, "nothing");}
        else {
            localStorage.setItem(storageKey, "faved"); }
    }

    function toggleFavorite(event){
        event.preventDefault();
        event.cancelBubble = true;
        event.returnValue = false;
        var jobStorageKey = event.target.id;
        //console.log(getValue(jobStorageKey));
        //console.log("toggle toggle: ", event);
        var oldValue = getValue(jobStorageKey);
        setNextValue(jobStorageKey);
        var newValue = getValue(jobStorageKey);
        applyStyle(event.target, jobStorageKey);
        console.log(oldValue, "for ", jobStorageKey, "changed to", newValue);
    }

})();



// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// greasyfork doesn't allow require of external scripts
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