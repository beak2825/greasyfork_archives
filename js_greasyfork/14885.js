// ==UserScript==
// @name         Enable right click and Highlighting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
// @author       You
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14885/Enable%20right%20click%20and%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/14885/Enable%20right%20click%20and%20Highlighting.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
// ==UserScript==
//
// ==/UserScript==
//*Functions*
function allowTextSelection(){
  var styles='*,p,div{user-select:text !important;-moz-user-select:text !important;-webkit-user-select:text !important;}';
  jQuery('head').append(jQuery('<style />').html(styles));
  
  window.console&&console.log('allowTextSelection');
  var allowNormal = function(){
    return true;
  };
  window.console&&console.log('Elements unbound: '+
    jQuery('*[onselectstart], *[ondragstart], *[oncontextmenu], #songLyricsDiv'
    ).unbind('contextmenu').unbind('selectstart').unbind('dragstart'
    ).unbind('mousedown').unbind('mouseup').unbind('click'
    ).attr('onselectstart',allowNormal).attr('oncontextmenu',allowNormal
    ).attr('ondragstart',allowNormal).size());
}

//Main.Code*
allowTextSelection();

void(document.oncontextmenu=null);