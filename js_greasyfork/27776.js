// ==UserScript==
// @name         Helper for data.medicare.gov
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Ctrl+click copy and more
// @author       Jake Bathman
// @include      https://data.medicare.gov/Home-Health-Compare*
// @include      https://data.medicare.gov/Hospital-Compare*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/27776/Helper%20for%20datamedicaregov.user.js
// @updateURL https://update.greasyfork.org/scripts/27776/Helper%20for%20datamedicaregov.meta.js
// ==/UserScript==

$("#searchForm").on('click',function(){
    $("input.searchField").focus().select();
});

$(document).keydown(function(event){
    if(event.which=="17")
        cntrlIsPressed = true;
});

$(document).keyup(function(){
    cntrlIsPressed = false;
});

var cntrlIsPressed = false;
$("#description").html('');
$("#infoBox").append('<div style="padding:5px;font-size:13px;color:grey;margin:5px;" id="copiedText"></div>');

(function() {
    $('.outerContainer').on('click',function (event) {
        el = $('.blist-hot')[0];
        console.debug($(el).html());
        $(el).css('background-color','#c9f5c9');

        $("#description").html('');
        $("#copiedText").css('color','grey').css('background-color','inherit').html($(el).html());

        if(cntrlIsPressed)
        {
            GM_setClipboard($(el).html()); // Copy to clipboard
            $("#copiedText").css('color','black').css('background-color','#c9f5c9').html("COPIED: <strong>" + $(el).html() + "</strong");
            timeoutEl = setTimeout(function(){
                $("#copiedText").html('').css('color','grey').css('background-color','inherit');
            }, 2000);
            console.log("Copied to clipboard: ");
            console.debug($(el).html());
        }
    });
})();