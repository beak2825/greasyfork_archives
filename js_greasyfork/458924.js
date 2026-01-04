// ==UserScript==
// @name        YouTube Color Subcription Tiles By Author
// @description Color tiles on the subscription fee by author name
// @include     https://www.youtube.com/*
// @grant       none
// @license     MIT
// @version 0.0.6
// @namespace https://greasyfork.org/users/8233
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/458924/YouTube%20Color%20Subcription%20Tiles%20By%20Author.user.js
// @updateURL https://update.greasyfork.org/scripts/458924/YouTube%20Color%20Subcription%20Tiles%20By%20Author.meta.js
// ==/UserScript==

// color list
const colors = [
  "Aqua", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "DarkCyan",
  "DarkGoldenRod", "DarkKhaki", "Darkorange", "DarkSalmon",
  "DodgerBlue", "Gold", "Grey", "IndianRed", "Khaki", "LimeGreen", "MediumSeaGreen", "MediumSpringGreen",
  "Olive", "Orchid", "PowderBlue", "Silver", "SteelBlue",
];

// color assigned to given names
colorAssignments = {};

function colorSubTiles(x)
{
  // at the top i include all YT urls to handle ajax transitions so make sure to only run on this subpage
  if(!window.location.href.endsWith('/feed/subscriptions'))
  {
    console.log('not subs url?');
    return;
  }
  
  var tile = x[0];
  var channelnamenode = tile.querySelector('.ytd-channel-name');
  
  // there is some sort of phantom tile with no channel name sometimes ? so skip in that case
  if(channelnamenode === null)
    return;
  
  
  // grab channel name and make sure it has color assigned from the list
  var channelname = channelnamenode.innerText;
  if(colorAssignments[channelname] === undefined) {
    colorAssignments[channelname] = colors[Object.keys(colorAssignments).length % colors.length];
  }
  
  // make all the text black to stand out from the background color
  for(el of tile.querySelectorAll('.yt-formatted-string'))
    el.style.color = 'black';

  // more texts to make black
  for(el of tile.querySelectorAll('.ytd-video-meta-block'))
    el.style.color = 'black';
  
  // and finally put the tile color on
  tile.style.backgroundColor = colorAssignments[channelname];
}

window.setTimeout(function(){Array.from(document.querySelectorAll('ytd-rich-item-renderer.ytd-rich-grid-row')).map(x => colorSubTiles([x]));}, 5000);

waitForKeyElements('ytd-rich-item-renderer.ytd-rich-grid-row', colorSubTiles); //as of November 2022
//waitForKeyElements('h1.title > yt-formatted-string.ytd-video-primary-info-renderer', addPicLinks);

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. From: https://git.io/vMmuf

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
function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  var targetNodes,
  btargetsFound;
  if (typeof iframeSelector == 'undefined')
  targetNodes = $(selectorTxt);
   else
  targetNodes = $(iframeSelector).contents().find(selectorTxt);
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
  }  //--- Get the timer-control variable for this selector.

  var controlObj = waitForKeyElements.controlObj || {
  };
  var controlKey = selectorTxt.replace(/[^\w]/g, '_');
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
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
        );
      }, 300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}
