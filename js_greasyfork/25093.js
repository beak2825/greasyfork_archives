// ==UserScript==
// @name         SoundCloud Spam Blocker
// @namespace    http://incept.online/
// @version      1.4.3
// @description  Helps minimize SoundCloud spam
// @author       Incept
// @match        https://soundcloud.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/25093/SoundCloud%20Spam%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/25093/SoundCloud%20Spam%20Blocker.meta.js
// ==/UserScript==

// initial settings setup
var SetupRun = GM_getValue ("SetupRun");
if (!SetupRun) {GM_setValue ("matchOption", "1"); GM_setValue ("SetupRun", true); }
var matchOption = GM_getValue ("matchOption");
console.info('using option: ' + matchOption);


$(document).on('click', '.reportCopyright__full', function() {
    var inputdata;
    var inputwindow = prompt("1 = Hide Spam | 2 = Highlight Spam", matchOption);
    switch(inputwindow) {
        case "1":
            inputdata = "1";
            break;
        case "2":
            inputdata = "2";
            break;
        default:
            inputdata = "1";
    }
    GM_setValue ("matchOption", inputdata);
    alert('Refresh for changes to take effect (ignore report popup).');
});
//main keyword database

// Will first check for exit URLs or soundcloud.com - if found it will check for these keywords.
// If it matches URL & one of these keywords it will be deleted. Comments without links will be fine.
var doublelist = "photos|fun|sex|prize|income|new|playlist|cash";

// Will match these strings ONLY (Unsafe to use single words).
// Should only be things a normal person would never say.
var singlelist = "you will be kissed|www.adremus.com";

// workaround for weird latin text (F, S, Q & X missing?)
// Should be plenty of characters anyway, bots are bound to use one.
var latinalphabet = "ᴀ|ʙ|ᴄ|ᴅ|ᴇ|ɢ|ʜ|ɪ|ᴊ|ᴋ|ʟ|ᴍ|ɴ|ᴏ|ᴘ|ʀ|ᴛ|ᴜ|ᴠ|ᴡ|ʏ|ᴢ";

$( document ).ready(function() {
    // how many elements deleted
    var howmany = 0;
    //check comments section every 1/4th second
    setInterval(checkcomments,250);
    function checkcomments() {
        $('.commentItem__body').each(function(i, obj) {
            var child = obj.innerHTML;
            //regex check using variables above
            var re = new RegExp('((?=.*exit.sc|.*soundcloud.com)(?=' + doublelist + '|'+ latinalphabet + ').*)|(?=.*' + singlelist + ').*', "i");
            if (child.match(re)) {
                // deletes
                if (matchOption == "1"){
                    // writes what it's going to delete to console
                    console.log(child);
                    $(this).parent().parent().remove();
                    // add to deleted counter
                    howmany = howmany + 1;
                }
                // highlights
                if (matchOption == "2"){
                    $(this).attr('style', 'pointer-events: none;');
                    $(this).parent().parent().attr('style', 'background-color: #F50;');
                    $(this).parent().find('*').attr('style', 'color: white !important;');
                }
            }
        });
        //changes report text to amount deleted
        if (matchOption == "1"){
            $( ".reportCopyright__full" ).html('Click For Options:<br>Spam Deleted: ' + howmany);
        }else{
            $( ".reportCopyright__full" ).html('Click For Options:<br>Highlight Mode');
        }
    }
});