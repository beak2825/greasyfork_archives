// ==UserScript==
// @name         FA Emotes-On-Beta
// @namespace    JaysonHusky
// @version      1.1
// @description  Bringing A "Classic" touch to the Beta!
// @author       JaysonHusky
// @match        https://*.furaffinity.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/32411/FA%20Emotes-On-Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/32411/FA%20Emotes-On-Beta.meta.js
// ==/UserScript==
(function() {
    'use strict';
var BBCodeEmoji = `
<i class="smilie tongue" style="cursor: pointer;" onclick="performInsert(this, '', ' :-p ');"></i>
<i class="smilie cool" style="cursor: pointer;" onclick="performInsert(this, '', ' :cool: ');"></i>
<i class="smilie wink" style="cursor: pointer;" onclick="performInsert(this, '', ' ;-) ');"></i>
<i class="smilie oooh" style="cursor: pointer;" onclick="performInsert(this, '', ' :-o ');"></i>
<i class="smilie smile" style="cursor: pointer;" onclick="performInsert(this, '', ' :-) ');"></i>
<i class="smilie evil" style="cursor: pointer;" onclick="performInsert(this, '', ' :evil: ');"></i>
<i class="smilie huh" style="cursor: pointer;" onclick="performInsert(this, '', ' :huh: ');"></i>
<i class="smilie whatever" style="cursor: pointer;" onclick="performInsert(this, '', ' :whatever: ');"></i>
<i class="smilie angel" style="cursor: pointer;" onclick="performInsert(this, '', ' :angel: ');"></i>
<i class="smilie badhairday" style="cursor: pointer;" onclick="performInsert(this, '', ' :badhair: ');"></i>
<i class="smilie lmao" style="cursor: pointer;" onclick="performInsert(this, '', ' :lmao: ');"></i>
<i class="smilie cd" style="cursor: pointer;" onclick="performInsert(this, '', ' :cd: ');"></i>
<i class="smilie crying" style="cursor: pointer;" onclick="performInsert(this, '', ' :cry: ');"></i>
<i class="smilie dunno" style="cursor: pointer;" onclick="performInsert(this, '', ' :idunno: ');"></i>
<i class="smilie embarrassed" style="cursor: pointer;" onclick="performInsert(this, '', ' :embarrassed: ');"></i>
<i class="smilie gift" style="cursor: pointer;" onclick="performInsert(this, '', ' :gift: ');"></i>
<i class="smilie coffee" style="cursor: pointer;" onclick="performInsert(this, '', ' :coffee: ');"></i>
<i class="smilie love" style="cursor: pointer;" onclick="performInsert(this, '', ' :love: ');"></i>
<i class="smilie nerd" style="cursor: pointer;" onclick="performInsert(this, '', ' :isanerd: ');"></i>
<i class="smilie note" style="cursor: pointer;" onclick="performInsert(this, '', ' :note: ');"></i>
<i class="smilie derp" style="cursor: pointer;" onclick="performInsert(this, '', ' :derp: ');"></i>
<i class="smilie sarcastic" style="cursor: pointer;" onclick="performInsert(this, '', ' :sarcastic: ');"></i>
<i class="smilie serious" style="cursor: pointer;" onclick="performInsert(this, '', ' :serious: ');"></i>
<i class="smilie sad" style="cursor: pointer;" onclick="performInsert(this, '', ' :-( ');"></i>
<i class="smilie sleepy" style="cursor: pointer;" onclick="performInsert(this, '', ' :sleepy: ');"></i>
<i class="smilie teeth" style="cursor: pointer;" onclick="performInsert(this, '', ' :teeth: ');"></i>
<i class="smilie veryhappy" style="cursor: pointer;" onclick="performInsert(this, '', ' :veryhappy: ');"></i>
<i class="smilie yelling" style="cursor: pointer;" onclick="performInsert(this, '', ' :yelling: ');"></i>
<i class="smilie zipped" style="cursor: pointer;" onclick="performInsert(this, '', ' :zipped: ');"></i>`;
var pathx=window.location.pathname;
    if(~pathx.indexOf("/controls/profile/")){
            $("textarea[name='profileinfo']").before(BBCodeEmoji);
    }
    else if(~pathx.indexOf("/msg/pms/")){
        $("textarea[name='message']").before("<br/><br/>"+BBCodeEmoji);
    }
    else if(~pathx.indexOf("/controls/journal/")) {
        $("textarea[name='message']").before("<br/><br/>"+BBCodeEmoji);
    }
    else {
        $("textarea[name='message']").before("<br/><br/>"+BBCodeEmoji);
        $("textarea[name='reply']").before("<br/><br/>"+BBCodeEmoji);
        $("textarea[name='shout']").after(BBCodeEmoji);
    }
})();