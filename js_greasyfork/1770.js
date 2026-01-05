// ==UserScript==
// @name        Wanikani Icons and Readings
// @namespace   wk_showlevel
// @description Show icon for reading/meaning and reading
// @author      mnh
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @version     .01
// @grant       GM_addStyle
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     http://code.jquery.com/jquery-2.0.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/1770/Wanikani%20Icons%20and%20Readings.user.js
// @updateURL https://update.greasyfork.org/scripts/1770/Wanikani%20Icons%20and%20Readings.meta.js
// ==/UserScript==

/*
 *  ====  Wanikani Icons and Readings  ====
 *    ==    by mnh based on Rui Pinheiro's script     ==
 *	  
 *    Adds uft-8 icons. Music note for reading and Hand writing for meaning.
 *	  Display Kunyomi or Onyomi reading as required.	
 *
 */
 
/*
 *	This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 

var debugLogEnabled = false;
var scriptShortName = "WKSL";

scriptLog = debugLogEnabled ? function(msg) { if(typeof msg === 'string'){ console.log(scriptShortName + ": " + msg); }else{ console.log(msg); } } : function() {};


function updateHTMLElement() {
    var curItem = $.jStorage.get("currentItem");
    var curQuestion = $.jStorage.get("questionType");
    var kanjiReading;
    
    if ($(".kanjiReading")){
        $(".kanjiReading").remove();
    }
    
    if ($(".quesType")){
        $(".quesType").remove();
    }
    
    if(curQuestion != "meaning"){
    		$("#character > span").before("<span class=\"quesType\">&#9836;</span>");
        
        	if(curItem.emph){
				kanjiReading = curItem.emph;
    		}
            else if (curItem.voc.length == 1){
            	kanjiReading = "kunyomi";
            }
            else{
            	kanjiReading = "vocab";
            }
                
    		if(kanjiReading != "vocab"){
                
                var readingSpan = $(document.createElement('span')).css({
                    "display": "block",
                    "margin-top": "-0.4em",
                    "height": "1em",
                    "font-size": ".3em",
                    "line-height": "1em",
                    "padding-bottom": ".4em",
                }).addClass("kanjiReading").text(kanjiReading);
        		                
                $("#character > span[lang='ja']").after(readingSpan);
    		}
    }
    else{
    	$("#character > span").before("<span class=\"quesType\">&#9997;</span>");	
    }
    
    $(".quesType").css({"margin-left":"-1em","color":"rgba(255, 255, 255, 0.8)","text-shadow":"none","font-size":".9em"});
    
};

 /*
 * Init Functions
 * Set up the hooks needed.
 */
/* Detect when the current item changes */
unsafeWindow.jQuery.fn.WKSL_oldJStorageSet = unsafeWindow.jQuery.jStorage.set;
unsafeWindow.jQuery.jStorage.set = function()
{	
	var result = unsafeWindow.jQuery.fn.WKSL_oldJStorageSet.apply(this, arguments);

	//scriptLog(arguments[0]);
	if(arguments[0] == "currentItem")
	{
		scriptLog("Changed item!");
		updateHTMLElement();
	}
	
	return result;
}


function scriptInit()
{	

	scriptLog("Loaded");
	
	// Set up hooks
	try
	{
		waitForKeyElements("#stats", updateHTMLElement, true);
	}
	catch(err) { logError(err); }
}

/*
 * Helper Functions/Variables
 */
$ = unsafeWindow.$;
 
function isEmpty(value){
    return (typeof value === "undefined" || value === null);
}

/*
 * Error handling
 * Can use 'error.stack', not cross-browser (though it should work on Firefox and Chrome)
 */
function logError(error)
{
	var stackMessage = "";
	if("stack" in error)
		stackMessage = "\n\tStack: " + error.stack;
		
	console.error(scriptShortName + " Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
}

/*
 * Code by BrockA, thanks!
 * Taken from https://gist.github.com/BrockA/2625891
 */
 
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
/* End of Code by BrockA */

/*
 * Start the script
 */
scriptInit();