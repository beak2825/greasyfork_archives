// ==UserScript==
// @name          HorseOpener
// @namespace     cryptal
// @description   For Howrse: An easy tool to open multiple horses in new tabs at once
// @author        CryptalEquine
// @include       */elevage/chevaux/?elevage=*
// @version       1.2.2
// @run-at        document-start
// @noframes      true
// @grant         unsafeWindow
// @grant         GM_log
// @grant         GM_openInTab
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13688/HorseOpener.user.js
// @updateURL https://update.greasyfork.org/scripts/13688/HorseOpener.meta.js
// ==/UserScript==

waitForKeyElements("#searchHorseInstance", Buttons, false);

var horsesOpened = [];
var baseUrl = '';

function Buttons()
{
	baseUrl = unsafeWindow.projectUrl || 'http://' + document.location.host || '';
	var spaces = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	var horseCount = $("a.horsename").length;
   var e = $("h1.spacer-large-bottom");
	
	if (baseUrl == '')
	{
		GM_log("Could not find the base URL for horse.");
		return;
	}
	
   e.html('');
	e.append('<input type="button" id="openAll" value=" Open All (' + horseCount + ') ">');
   
	if (horseCount > 4)
		e.append(' <input type="button" id="open4" value=" Open 4 ">');
	if (horseCount > 10)
		e.append(' <input type="button" id="open10" value=" Open 10 ">');
	if (horseCount > 50)
		e.append(' <input type="button" id="open50" value=" Open 50 ">');
	if (horseCount > 100)
		e.append(' <input type="button" id="open100" value=" Open 100 ">');
	
	$("#openAll").on("click", function() { OpenHorses(200); });
	$("#open4").on("click", function() { OpenHorses(4); });
	$("#open10").on("click", function() { OpenHorses(10); });
	$("#open50").on("click", function() { OpenHorses(50); });
	$("#open100").on("click", function() { OpenHorses(100); });
}

function OpenHorses(number)
{
	var horseLinkElements = $("a.horsename");
	var numberOpenedThisRound = 0;
    
	for (var i = 0; i < horseLinkElements.length && numberOpenedThisRound < number; i++)
	{
        if (horsesOpened.indexOf(horseLinkElements.eq(i).attr("href")) == -1)
        {
            GM_openInTab(baseUrl + horseLinkElements.eq(i).attr("href"), {active: false, insert: false});
            horsesOpened.push(horseLinkElements.eq(i).attr("href"));
				numberOpenedThisRound++;
        }
	}
}


/*--- waitForKeyElements():   A utility function, for Greasemonkey scripts
                              that detects and handles AJAXed content
*/
function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector)
{
   var targetNodes, btargetsFound;
   if (typeof iframeSelector == "undefined")   targetNodes = $(selectorTxt);
   else                                        targetNodes = $(iframeSelector).contents().find (selectorTxt);
   if (targetNodes  &&  targetNodes.length > 0)
   {
      btargetsFound = true;
      targetNodes.each ( function ()
      {
         var jThis        = $(this);
         var alreadyFound = jThis.data ('alreadyFound')  ||  false;
         if (!alreadyFound)
         {
            var cancelFound     = actionFunction (jThis);
            if (cancelFound)    btargetsFound   = false;
            else                jThis.data ('alreadyFound', true);
         }
      });
   }
   else btargetsFound   = false;

   var controlObj      = waitForKeyElements.controlObj  ||  {};
   var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
   var timeControl     = controlObj [controlKey];
   if (btargetsFound  &&  bWaitOnce  &&  timeControl)
   {
      clearInterval (timeControl);
      delete controlObj [controlKey]
   }
   else
   {
      if ( ! timeControl)
      {
         timeControl = setInterval ( function () { waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector); }, 300 );
         controlObj [controlKey] = timeControl;
      }
   }
   waitForKeyElements.controlObj   = controlObj;
}