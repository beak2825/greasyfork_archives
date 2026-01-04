// ==UserScript==
// @name         camdial script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *camdial*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39603/camdial%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39603/camdial%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var auto = true; //enable this for auto click
    var times = 20; //this is how many times for click
    var hotkey = false; //enable this for ` hotkey
    if(auto){
        for (i=0;i<times;i++){
            $('button.button.submit').click();
        }
    }
    if(hotkey){
        $(document).keyup(function(event){
            if(event.which == 192){
                $('button.button.submit').click();
            }
        });
    }
    $('textarea#token').select();
});