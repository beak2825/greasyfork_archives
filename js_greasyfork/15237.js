// ==UserScript==
// @name        CH OCMP Link Cleanup
// @author      clickhappier
// @namespace   clickhappier
// @description Strip bad links in OCMP embedded content HITs, and fix badly-coded search links.
// @version     1.1c
// @match       https://*.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/15237/CH%20OCMP%20Link%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/15237/CH%20OCMP%20Link%20Cleanup.meta.js
// ==/UserScript==


// remove 'escape from frames' javascript from some mi-div.crowdcomputingsystems.com captured pages - https://gist.github.com/BrockA/2620135
if ( document.location.href.indexOf("mi-div.crowdcomputingsystems.com/mturk-web/public/getRemoteContent") > -1 )
{
    checkForBadJavascripts ( [ [false, /else{top.location=self.location}/, function (eventFired) {addJS_Node (eventFired);} ] ] );
}

function checkForBadJavascripts (controlArray) {
    /*--- Note that this is a self-initializing function.  The controlArray
        parameter is only active for the FIRST call.  After that, it is an
        event listener.

        The control array row is  defines like so:
        [bSearchSrcAttr, identifyingRegex, callbackFunction]
        Where:
            bSearchSrcAttr      True to search the SRC attribute of a script tag
                                false to search the TEXT content of a script tag.
            identifyingRegex    A valid regular expression that should be unique
                                to that particular script tag.
            callbackFunction    An optional function to execute when the script is
                                found.  Use null if not needed.
    */
    if ( ! controlArray.length) return null;
    checkForBadJavascripts      = function (zEvent) {
        for (var J = controlArray.length - 1;  J >= 0;  --J) {
            var bSearchSrcAttr      = controlArray[J][0];
            var identifyingRegex    = controlArray[J][1];
            if (bSearchSrcAttr) {
                if (identifyingRegex.test (zEvent.target.src) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
            else {
                if (identifyingRegex.test (zEvent.target.textContent) ) {
                    stopBadJavascript (J);
                    return false;
                }
            }
        }
        function stopBadJavascript (controlIndex) {
            zEvent.stopPropagation ();
            zEvent.preventDefault ();
            var callbackFunction    = controlArray[J][2];
            if (typeof callbackFunction == "function")
                callbackFunction (zEvent.target.textContent);
            //--- Remove the node just to clear clutter from Firebug inspection.
            zEvent.target.parentNode.removeChild (zEvent.target);
            //--- Script is intercepted, remove it from the list.
            controlArray.splice (J, 1);
            if ( ! controlArray.length) {
                //--- All done, remove the listener.
                window.removeEventListener (
                    'beforescriptexecute', checkForBadJavascripts, true
                );
            }
        }
    }
    /*--- Use the "beforescriptexecute" event to monitor scipts as they are loaded.
        See https://developer.mozilla.org/en/DOM/element.onbeforescriptexecute
        Note that it does not work on acripts that are dynamically created.
    */
    window.addEventListener ('beforescriptexecute', checkForBadJavascripts, true);

    return checkForBadJavascripts;
}
function addJS_Node (eventFired) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    scriptNode.textContent  = eventFired.replace('true,', 'false,');
	//console.log("Textcontent: " + scriptNode.textContent);
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    //--- Don't error check here. if DOM not available, should throw error.
    targ.appendChild (scriptNode);
}




// make links in embedded content area not clickable, so their text will be easier to select/highlight, and prevent accidental clicks
waitForKeyElements(".ulr-loaded", linkStrip);
function linkStrip(jNode) 
{
    $('.extraction-content').find('a').removeAttr("href");
}

// fix resource links
waitForKeyElements("div.block.question", searchFix);
function searchFix(jNode) 
{

    // fix links broken by starting with a space
    $('a[href^=%20http]').each(function()
    {
        newLinkURL = newLinkURL.replace('%20http','http');
    });

    // unlink n/as
    $('a[href="n/a"]').each(function()
    {
        $(this).replaceWith( $(this).text() );
    });
    $('a[href="%20n/a"]').each(function()
    {
        $(this).replaceWith( $(this).text() );
    });

    // fix links broken by omission of http://www. (turning into erroneous relative links on ocmp domain)
    $('a[href]:not( [href^=http] , [href^=www] , [href=#] )').each(function()
    {
        $(this).attr('href', 'http://www.' + $(this).attr('href') );
    });
    $('a[href^=www]').each(function()
    {
        $(this).attr('href', 'http://' + $(this).attr('href') );
    });
    
    // fix poorly-planned search links
    $('a[href*="google.com"]').each(function()
    { 
        var oldLinkURL = $(this).attr('href');
        var newLinkURL = oldLinkURL.replace(/ /g,'+');
        newLinkURL = newLinkURL.replace(/%20/g,'+');
        newLinkURL = newLinkURL.replace(' & ',' ');
        newLinkURL = newLinkURL.replace('%26','');
        newLinkURL = newLinkURL.replace(/\+\+/g,'+');
        newLinkURL = newLinkURL.replace('?gws_rd=ssl#','#');
        newLinkURL = newLinkURL.replace('/#q=','/search?q=');
        newLinkURL = newLinkURL.replace('/?q=','/search?q=');
        newLinkURL = newLinkURL.replace('q=+','q=');
        newLinkURL = newLinkURL.replace('site:http://www.','site:');
        newLinkURL = newLinkURL.replace('site:https://www.','site:');
        // ocmp34 donor lists
        newLinkURL = newLinkURL.replace(/\+donors$/,'+donors%7C"donor list"%7C"honor+roll"%7Cdonations%7C"annual+report"%7C"our+friends"%7Csupporters%7Ccontributors%7Cnewsletters%7C"financial+statements"');
        // ocmp38 awards
        newLinkURL = newLinkURL.replace(/q=award\+site/,'q=awards%7Caward%7Cawarded%7Cnamed%7Cwon%7Cwinner%7Cwins%7Chonored%7Chonors+site');

        $(this).attr('href', newLinkURL);
    });
}



//--- waitForKeyElements(): http://stackoverflow.com/a/8283815
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
)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                actionFunction (jThis);
                jThis.data ('alreadyFound', true);
            }
        } );
        btargetsFound   = true;
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
                500
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}