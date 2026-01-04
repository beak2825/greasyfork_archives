// ==UserScript==
// @name         HBO Max Assistant
// @description  It allows you to make the video full screen with double click and it also hides the cursor if it's not moved
// @icon         https://play.hbomax.com/assets/images/branding/desktop/hbomax/favicon.ico
// @namespace    Carje
// @version      0.1
// @license      MIT
// @author       Carje
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @include      https://play.hbomax.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/442663/HBO%20Max%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/442663/HBO%20Max%20Assistant.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
/*
Please be aware that the script may not work if you change from movies to shows or vice versa unless you refresh the page!
If you want to support me, you can treat me with a coffee: https://www.buymeacoffee.com/Carje
*/
function url() {
    if (!document.location.href.match( /(\/episode\/|\/feature\/)/ ) ) {
        return setTimeout(url, 1000);
    }


var justHidden = false;
var j;
$(document).mousemove(function() {
    if (!justHidden) {
        justHidden = false;
        clearTimeout(j);
        $('html').css({cursor: 'default'});
        j = setTimeout(hide, 5000);
    }
});
function hide() {
$('html').css({cursor: 'none'});
justHidden = true;
setTimeout(function() {
justHidden = false;
}, 500);
}

function check() {
    if (!$(".default.mtz-vlc-odecb").attr('src')) {
        return setTimeout(check, 1000);
    }

var elem = document.getElementsByClassName("default mtz-vlc-odecb")[0];
console.log("elem set");
$(".default.class1.class4").dblclick(function() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen))
    {
        if (document.documentElement.requestFullScreen){
            document.documentElement.requestFullScreen();
        }
        else if (document.documentElement.mozRequestFullScreen){ /* Firefox */
            document.documentElement.mozRequestFullScreen();
        }
        else if (document.documentElement.webkitRequestFullScreen){ /* Chrome, Safari & Opera */
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        else if (document.msRequestFullscreen){ /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    }
    else
    {
        if (document.cancelFullScreen){
            document.cancelFullScreen();
        }
        else if (document.mozCancelFullScreen){ /* Firefox */
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen){ /* Chrome, Safari and Opera */
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen){ /* IE/Edge */
            document.msExitFullscreen();
        }
    }

});

}

check();
}
url();