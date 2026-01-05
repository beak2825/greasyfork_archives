// ==UserScript==
// @name        Wanikani Override
// @namespace   wkoverride
// @description Adds an "Ignore Answer" button during reviews that makes WaniKani ignore the current answer (useful if, for example, you made a stupid typo)
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @version     1.2
// @author      Mempo
// @grant       GM_addStyle
// @grant       unsafeWindow
// @require     http://code.jquery.com/jquery-1.11.2.min.js
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/23696/Wanikani%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/23696/Wanikani%20Override.meta.js
// ==/UserScript==

//Original author: Rui Pinheiro

// ESC shortcut


/*
 * Debug Settings
 */
var debugLogEnabled = true;
var scriptShortName = 'WKO';
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
 * "Ignore Answer" Button Click
 */
var ActionEnum = Object.freeze({
  ignore: 0,
  unignore: 1
});
function WKO_ignoreAnswer()
{
  try
  {
    /* Check if the current item was answered incorrectly */
    var elmnts = document.getElementsByClassName('incorrect');
    var elmnts2 = document.getElementsByClassName('WKO_ignored');
    
    var curAction;
    if (!isEmpty(elmnts[0])) // Current answer is wrong
    curAction = ActionEnum.ignore;
     else if (prefAllowUnignore && !isEmpty(elmnts2[0])) // Current answer is ignored
    curAction = ActionEnum.unignore;
     else
    // Either there is no current answer, or it's correct
    {
      alert('WKO: Current item wasn\'t answered incorrectly, nor ignored previously!');
      return false;
    }
 
    /* Grab information about current question */
 
    var curItem = $.jStorage.get('currentItem');
    var questionType = $.jStorage.get('questionType');
 
    /* Build item name */
    var itemName;
    if (curItem.rad)
    itemName = 'r';
     else if (curItem.kan)
    itemName = 'k';
     else
    itemName = 'v';
    itemName += curItem.id;
    scriptLog(itemName);
    /* Grab item from jStorage.
         * 
         * item.rc and item.mc => Reading/Meaning Completed (if answered the item correctly)
         * item.ri and item.mi => Reading/Meaning Invalid (number of mistakes before answering correctly)
         */
    var item = $.jStorage.get(itemName) || {
    };
    /* Update the item data */
    if (questionType === 'meaning')
    {
      if (!('mi' in item) || isEmpty(item.mi))
      {
        throw Error('item.mi undefined');
        return false;
      } 
      else if (item.mi < 0 || (item.mi == 0 && curAction == ActionEnum.ignore))
      {
        throw Error('item.mi too small');
        return false;
      }
      if (curAction == ActionEnum.ignore)
      item.mi -= 1;
       else
      item.mi += 1;
      delete item.mc;
    } 
    else
    {
      if (!('ri' in item) || isEmpty(item.ri))
      {
        throw Error('item.ri undefined');
        return false;
      } 
      else if (item.ri < 0 || (item.ri == 0 && curAction == ActionEnum.ignore))
      {
        throw Error('i.ri too small');
        return false;
      }
      if (curAction == ActionEnum.ignore)
      item.ri -= 1;
       else
      item.ri += 1;
      delete item.rc;
    }
    /* Save the new state back into jStorage */
 
    $.jStorage.set(itemName, item);
    /* Modify the questions counter and wrong counter and change the style of the answer field */
    var wrongCount = $.jStorage.get('wrongCount');
    var questionCount = $.jStorage.get('questionCount');
    if (curAction == ActionEnum.ignore)
    {
      $.jStorage.set('wrongCount', wrongCount - 1);
      $.jStorage.set('questionCount', questionCount - 1);
      $('#answer-form fieldset').removeClass('incorrect');
      $('#answer-form fieldset').addClass('WKO_ignored');
    } 
    else
    {
      $.jStorage.set('wrongCount', wrongCount + 1);
      $.jStorage.set('questionCount', questionCount + 1);
      $('#answer-form fieldset').removeClass('WKO_ignored');
      $('#answer-form fieldset').addClass('incorrect');
    }
    return true;
  } 
  catch (err) {
    logError(err);
  }
}
/*
 * Bind '~' as a hotkey 
 */
 
function bindHotkey()
{
  jQuery(document).on('keydown.reviewScreen', function (event)
  {
    if ($('#reviews').is(':visible') && !$('*:focus').is('textarea, input'))
    {
      //alert('keycode: ' + event.keyCode);
      switch (event.keyCode) {
        //case 176: //Firefox '~'
        //case 192: //Chrome '~'
        case 27: // ESC Button
          event.stopPropagation();
          event.preventDefault();
          if ($('#user-response').is(':disabled'))
           WKO_ignoreAnswer();
          return false;
          break;
      }
    }
  });
}
/*
 * Inject Ignore Button
 */
 
function addIgnoreAnswerBtn()
{
  var footer = document.getElementsByTagName('footer'),
      $btn = jQuery('<div id="WKO_button" title="Ignore Answer">Ignore Answer</div>').on('click', WKO_ignoreAnswer);
  jQuery(footer[0]).prepend($btn);
}
/*
 * Prepares the script
 */
 
function scriptInit()
{
  // Add global CSS styles
  GM_addStyle('#WKO_button {background-color: #CC0000; color: #FFFFFF; cursor: pointer; display: inline-block; font-size: 0.8125em; padding: 10px; vertical-align: bottom;}');
  GM_addStyle('#answer-form fieldset.WKO_ignored input[type="text"]:-moz-placeholder, #answer-form fieldset.WKO_ignored input[type="text"]:-moz-placeholder {color: #FFFFFF; font-family: "Source Sans Pro",sans-serif; font-weight: 300; text-shadow: none; transition: color 0.15s linear 0s; } #answer-form fieldset.WKO_ignored button, #answer-form fieldset.WKO_ignored input[type="text"], #answer-form fieldset.WKO_ignored input[type="text"]:disabled { background-color: #FFCC00 !important; }');
  scriptLog('loaded');
  // Set up hooks
  try
  {
    addIgnoreAnswerBtn();
    bindHotkey();
  } 
  catch (err) {
    logError(err);
  }
}
/*
 * Helper Functions/Variables
 */
 
//use 'jQuery' for greasemonkey's version, $ is WK's jQuery
 
$ = unsafeWindow.$;
function isEmpty(value) {
  return (typeof value === 'undefined' || value === null);
}
/*
 * Error handling
 * Can use 'error.stack', not cross-browser (though it should work on Firefox and Chrome)
 */
 
function logError(error)
{
  var stackMessage = '';
  if ('stack' in error)
  stackMessage = '\n\tStack: ' + error.stack;
  console.error(scriptShortName + ' Error: ' + error.name + '\n\tMessage: ' + error.message + stackMessage);
}
/*
 * Start the script
 */
 
scriptInit();

// Hook into App Store
try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}