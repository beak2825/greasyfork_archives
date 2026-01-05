// ==UserScript==
// @name        F-Chat Fastificator
// @namespace   https://greasyfork.org/en/users/60633-xbl
// @version     0.1
// @description Make F-Chat fast.
// @author      XBL
// @match       https://www.f-list.net/chat/
// @match       https://www.f-list.net/chat/?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22371/F-Chat%20Fastificator.user.js
// @updateURL https://update.greasyfork.org/scripts/22371/F-Chat%20Fastificator.meta.js
// ==/UserScript==

(function() {
'use strict';

FList.Chat.rebuildChannelsTabFastpatchVersion = 1;
if (!FList.Chat.rebuildChannelsTabUnpatched)
  FList.Chat.rebuildChannelsTabUnpatched = FList.Chat.rebuildChannelsTab;

var firststring = '$.each(FList.Chat.privateChannels, function(i,pc){\n                $(".chatui-tab-channels .private").append';
var laststring = '$(".channels-tab-label span.sort:last").unbind';
var replacement = "_appendPCs();";

var oldsource = FList.Chat.rebuildChannelsTabUnpatched.toString();
var firstindex = oldsource.indexOf(firststring);
var lastindex = oldsource.indexOf(laststring);

if (firstindex === -1 || lastindex === -1) {
  throw Error("can't patch function, script must be updated.");
}

var patchingsource = 'FList.Chat.rebuildChannelsTab = ' + oldsource.slice(0,firstindex)+replacement+oldsource.slice(lastindex);

function _appendPCs() {
            var start = null;
            if (FList.Chat.rebuildChannelsTabDEBUG && performance && performance.now)
              start = performance.now();
            var toAppend = [];
            $.each(FList.Chat.privateChannels, function(i,pc){
                toAppend.push('<div class="list-item channel-item panel list-highlight" id="user5"><span class="count">' + pc.users + '</span><span class="name">' + pc.title + '</span></div>');
            });
            $(".chatui-tab-channels .private").append(toAppend.join(""));
            var appended = $(".chatui-tab-channels .private").children();
            for (var i = 0; i < FList.Chat.privateChannels.length; i++) {
              (function(){/* need enclosing function, or the let keyword */
                var pc = FList.Chat.privateChannels[i];
                var dom = appended[i];
                var tab=FList.Chat.TabBar.getTabFromId("channel", pc.id);
                if(tab!==false) {
                    if(!tab.closed) $(dom).addClass("list-item-important");
                }
                /* using 'let chanid' here instead of var would be ideal.
                   Without the closure, var here results in every single click() event just using whatever chanid is sorted last.
                   See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Cleaner_code_in_inner_functions */
                var chanid=pc.id;
                $(dom).click(function(){
                    var tab=FList.Chat.TabBar.getTabFromId("channel", chanid);
                    if(!$(this).hasClass("list-item-important")){
                        FList.Chat.openChannelChat(pc.id, false);
                        $(this).addClass("list-item-important");
                    }  else {
                        FList.Chat.TabBar.closeTab(tab.tab);
                        $(this).removeClass("list-item-important");
                    }
                });
              })();
            }
            if (start)
              console.log('rebuildChannelsTab("private") took: ' +
                          (performance.now()-start) + 'ms');
}

eval(patchingsource);

})();
