// ==UserScript==
// @name        ETI Sig Fader
// @namespace   pendevin
// @description fades sigs
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     http://archives.endoftheinter.net/showmessages.php*
// @include     http://endoftheinter.net/inboxthread.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @include     https://archives.endoftheinter.net/showmessages.php*
// @include     https://endoftheinter.net/inboxthread.php*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11096/ETI%20Sig%20Fader.user.js
// @updateURL https://update.greasyfork.org/scripts/11096/ETI%20Sig%20Fader.meta.js
// ==/UserScript==


//this is the opacity level you want in percentage. 100 is fully opaque (normal). 0 is fully transparent.
const SIG_OPACITY = 50;
//to change the color of the sig text, set USE_SIG_COLOR to true and change SIG_COLOR to your desired color (hex values like #000000 are fine)
const USE_SIG_COLOR = false;
const SIG_COLOR = 'black';
//if you want the sig to go to full opacity (like normal) when you mouse over it, set this to true
const SIG_FADE_IN = true;

//any other styles you want to apply to sigs can be added to elements with class sig


//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//adds a style to a document and returns the style object *JQUERY
//css is a string, id is an optional string that determines the object's id
function addStyle(css, id) {
    //create a style
    var style = $('<style type="text/css">');
    //add the css data to it
    style.html(css);
    if (id) {
        //remove any style that has our id
        $('#' + id).remove();
        //give our style the id after removing the other stuff. idk if it matters, but i'm too lazy to find out
        style.attr('id', id);
    }
    //add the style into the head
    $('head').append(style);
    //we're outta here
    return style;
}

//livelinks compatiblity *JQUERY
//calls the function on each message-container in a document, including ones added by livelinks
//place is an optional specialized location
function livelinks(func, extraParams, place) {
    if (extraParams == undefined) {
        extraParams = null;
    }
    if (place == undefined) {
        place = '.message-container';
    }
    //run the function on the message-containers currently on the page
    $('#u0_1 ' + place).each(function(i, container) {
        func(container, extraParams);
    });
    //run it on any message-containers added in the future
    $('#u0_1').on(
        'DOMNodeInserted',
        extraParams,
        function(e) {
            if ($(e.target).children(place).length) {
                $(e.target).children(place).each(function(i, container) {
                    func(container, e.data);
                });
            }
        }
    );
}

//puts sigs into their own element for easier styling
function processSigs(place) {
    place = $(place);
    var message = place.find('td.message');
    //make sure we haven't already done this
    if (!message.find('.sig').length) {
        //make sig container
        var sig = $('<span class="sig">');
        message.append(sig);
        //find the sig belt
        //this should be the last sig belt on the block
        var sigBelt = message.contents().filter(function(i) {
            if (this.textContent.search('^\n?---$') == 0) {
                return true;
            } else {
                return false;
            }
        }).last();
        //fallback for if there isn't a sig belt
        var sigIndex = message.contents().length;
        if (sigBelt.length) {
            var sigIndex = message.contents().index(sigBelt);
        }
        //stuff junk in sig container
        message.contents().slice(sigIndex).appendTo(sig);
    }

    //fuck with what happens when you hit the quote button because normal luelinks can't handle dese sigs
    var quote = place.find('.message-top > a[href*="&quote="]');
    //probably don't have to do this but you know just as a reminder that i ain't doin that shit or something
    quote.removeAttr('onclick');
    //the normal quote function
    var quoteFunc = function() {
        return window.QuickPost.publish('quote', quote[0]);
    };
    //move the sig belt out where it will be recognized, run the quote function, then move it back in
    quote.on('click', function(e) {
        e.preventDefault();
        sigBelt.insertBefore(sig);
        quoteFunc();
        sig.prepend(sigBelt);
    });
}

//fade the sigs
var css = '\
    .sig{\
        opacity:' + SIG_OPACITY / 100 + ';\
    }\
';
if (USE_SIG_COLOR) {
    css += '\
        .sig{\
            color:' + SIG_COLOR + ';\
        }\
    ';
}
if (SIG_FADE_IN) {
    css += '\
        .sig:hover{\
            opacity:1;\
        }\
    ';
}
addStyle(css, 'sigFader');

//activate the thing
livelinks(processSigs);
