// ==UserScript==
// @name         Wallpaper Abyss Bulk Downloader script
// @namespace    wpabyssbulk
// @version      0.2
// @description  Adds "Bulk Download" button on Wallpaper Abyss
// @include      https://wall.alphacoders.com/by_collection.php?id=*
// @include      http://wall.alphacoders.com/by_collection.php?id=*
// @author       Rain
// @match        http://*/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-1.11.2.min.js
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/18466/Wallpaper%20Abyss%20Bulk%20Downloader%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/18466/Wallpaper%20Abyss%20Bulk%20Downloader%20script.meta.js
// ==/UserScript==
/*
 * Debug Settings
 */
var debugLogEnabled = true;
var scriptShortName = 'WAB';
scriptLog = debugLogEnabled ? function (msg) {
  if (typeof msg === 'string') {
    console.log(scriptShortName + ': ' + msg);
  } else {
    console.log(msg);
  }
}
 : function () {
};
/*
 * Other settings
 */
var prefAllowUnignore = true;
/*
 * "Bulk Download" Button Click
 */
var ActionEnum = Object.freeze({
  ignore: 0,
  unignore: 1
});
function WAB_bulkDownload(){
  try {
    var buttons = $(".download-button"), 
    interval = setInterval(function(){
        var btn = $(buttons.splice(0, 1));
        console.log("Clicking:", btn);
        btn.click();
        if (buttons.length === 0) {
            clearInterval(interval);
        }
    }, 1000);
  }
  catch (err) {
    logError(err);
  }
}
/*
 * Inject Download Button
 */
function addBulkBtn()
{
  var container = document.querySelectorAll(".container .row .col-xs-12"),
      $btn = jQuery('<div id="WAB_button" title="Download in Bulk" class="btn btn-danger" style="bottom;margin-top:3px">Download in Bulk</div>').on('click', WAB_bulkDownload);
  jQuery(container[0]).append($btn);
}

/*
 * Bind '~' as a hotkey 
 */
function bindHotkey()
{
  jQuery(document).on('keydown.reviewScreen', function (event)
  {
    if ($('.center').is(':visible'))
    {
      //alert('keycode: ' + event.keyCode);
      switch (event.keyCode) {
        case 176: //Firefox '~'
        case 192: //Chrome '~'
          event.stopPropagation();
          event.preventDefault();
          if ($('#user-response').is(':disabled'))
           WAB_bulkDownload();
          return false;
          break;
      }
    }
  });
}


/*
 * Prepares the script
 */
function scriptInit()
{
  // Add global CSS styles
  // GM_addStyle('#WAB_button {background-color: #CC0000; color: #FFFFFF; cursor: pointer; display: inline-block; font-size: 0.8125em; padding: 10px; vertical-align: bottom;}');
  scriptLog('loaded');
  // Set up hooks
  try
  {
    addBulkBtn();
    bindHotkey();
  } 
  catch (err) {
    logError(err);
  }
}

$ = unsafeWindow.$;
function isEmpty(value) {
  return (typeof value === 'undefined' || value === null);
}

function logError(error)
{
  var stackMessage = '';
  if ('stack' in error)
  stackMessage = '\n\tStack: ' + error.stack;
  console.error(scriptShortName + ' Error: ' + error.name + '\n\tMessage: ' + error.message + stackMessage);
}

scriptInit();

