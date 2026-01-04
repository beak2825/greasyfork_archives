// ==UserScript==
// @name        Discord Right Click Context Menu
// @description Replace Discord Emoji Bar With Right Click Popup Menu
// @namespace   Discord Right Click Context Menu
// @version     12.17.2019.1
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @updateurl   http://cdn.jsdelivr.net/gh/pie6k/jquery.initialize/master/jquery.initialize.min.js
// @updateurl   http://cdn.jsdelivr.net/gh/MichaelZelensky/jsLibraries/master/macKeys.js
// @match       *://discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/427728/Discord%20Right%20Click%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/427728/Discord%20Right%20Click%20Context%20Menu.meta.js
// ==/UserScript==

var mouseX;
var mouseY;
$(document).mousemove( function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

$('body').on('contextmenu','div[class*="cozyMessage-"]', function(e) {
    if (!e.ctrlKey && !macKeys.ctrlKey) {
        var dropdown_button = $(this).find("div[aria-label^='More']");
        var dropdown_id = makeid();
        $(this).find('div[class="buttonContainer-DHceWr"]').addClass(dropdown_id);
        dropdown_button.trigger( "click" );

        var context_menu = $("div[class='layer-v9HyYc']");
        $(context_menu).find("div[role^='menuitem']").eq(0).parent().prepend(`<div class="item-1tOPte labelContainer-1BLJti colorDefault-2K3EoJ button-addEmoji" role="menuitem" id="message-actions-addemoji" tabindex="-1"><div class="label-22pbtT">Add Reaction</div><div class="iconContainer-2-XQPY"><svg class="icon-LYJorE" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path d="M12.2512 2.00309C12.1677 2.00104 12.084 2 12 2C6.477 2 2 6.477 2 12C2 17.522 6.477 22 12 22C17.523 22 22 17.522 22 12C22 11.916 21.999 11.8323 21.9969 11.7488C21.3586 11.9128 20.6895 12 20 12C15.5817 12 12 8.41828 12 4C12 3.31052 12.0872 2.6414 12.2512 2.00309ZM10 8C10 6.896 9.104 6 8 6C6.896 6 6 6.896 6 8C6 9.105 6.896 10 8 10C9.104 10 10 9.105 10 8ZM12 19C15.14 19 18 16.617 18 14V13H6V14C6 16.617 8.86 19 12 19Z" clip-rule="evenodd" fill-rule="evenodd" fill="#b9bbbe"></path><path d="M21 3V0H19V3H16V5H19V8H21V5H24V3H21Z" fill="#b9bbbe"></path></svg></div></div>`);
        $(context_menu).css({'top':mouseY + 2,'left':mouseX + 2, 'width': '188px'});
        $('body').on('click' , "div[class*='button-addEmoji']" , function(e){ TriggerReactionBox(dropdown_id);} );
    }
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function TriggerReactionBox(id) {
    console.log(id);
    var react_button = $('div[class*="' + id + '"]').find("div[aria-label='Add Reaction']");
    console.log(react_button);
    react_button.trigger( "click" );
    var emoji_picker = $("div[class^='emojiPicker-'").parent().parent();
    $(emoji_picker).css({'top':mouseY - ($(emoji_picker).height() / 2),'left':mouseX + 2});
}