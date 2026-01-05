// ==UserScript==
// @name        F-Chat Unicodifier
// @namespace   https://greasyfork.org/en/users/60633-xbl
// @version     0.1
// @description Make F-Chat html logs UTF-8 compliant.
// @author      XBL
// @match       https://www.f-list.net/chat/
// @match       https://www.f-list.net/chat/?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22374/F-Chat%20Unicodifier.user.js
// @updateURL https://update.greasyfork.org/scripts/22374/F-Chat%20Unicodifier.meta.js
// ==/UserScript==

(function() {
'use strict';
/* See bugreport 3024 and 3025 */

(function patch3024(){

var start = '$("#chatui-tabs").tabs({\r\n            show:';
var end = '});\r\n        $("#status-panel-update, #channel-panel-create, #chat-login-go, #search-panel-go, #search-panel-kinkadd, #settings-panel-save, #settings-panel-reset").button();';

var oldsource = FList.Chat.UI.buildBase.toString();
var startindex = oldsource.indexOf(start);
var endindex = oldsource.indexOf(end);
if (startindex === -1 || endindex === -1) {
  console.error("can't patch tabsshow event, script must be updated.");
  return;
}

oldsource = oldsource.slice(startindex+start.length,endindex);

var bad = /escape\(/g;
var good = 'encodeURIComponent(';
eval('jQuery("#chatui-tabs").tabs({show:'+oldsource.replace(bad,good)+
     '});');
})();

(function patch3025(){
var metatag = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
var head = '<head>';

var oldsource = FList.Chat.Logs.getLogDocument.toString();
var metaindex = oldsource.indexOf(metatag);
var headindex = oldsource.indexOf(head);

if (metaindex === -1 && headindex === -1) {
  console.error("can't patch getLogDocument function, script must be updated.");
  return;
}

if (metaindex !== -1) // already patched, and therefore fine?
  return;

var sliceindex = headindex+head.length;
eval('FList.Chat.Logs.getLogDocument = '+
     oldsource.slice(0,sliceindex)+metatag+oldsource.slice(sliceindex));
})();

})();

