// ==UserScript==
// @name         Boomer Text
// @version      0.1
// @license      MIT
// @author       @roescoe
// @grant        GM_openInTab
// @match        *://*/*
// @description  Background boomer music
// @namespace https://greasyfork.org/users/985766
// @downloadURL https://update.greasyfork.org/scripts/455164/Boomer%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/455164/Boomer%20Text.meta.js
// ==/UserScript==

(function() {
    let phrases =[
        "boomer",
        "boomers",
        "back in my day",
        "kids these days",
        "spending the kid's inheritance",
        "spending the kids' inheritance",
        "spending the kids' inheritance",
        "bootstraps",
        "values of responsibility",
        "value of responsibility",
        "respect our elders",
        "respect our elder",
        "respect your elders",
        "respect your elder",
        "pay off your student loans",
        "get the job",
    ];
    document.addEventListener('mouseup', function(){
    var thetext = getSelectionText()
        if (thetext.length > 0){ // check there's some text selected
            for (let i in phrases) {
                if (thetext.toUpperCase().includes(phrases[i].toUpperCase())) {
                    window.getSelection().removeAllRanges();
                    playMusic();
                    break;
                    }
            }
        }
    }, false)
    function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
    }


 function playMusic() {
        var boomerMusic = GM_openInTab ("https://on.soundcloud.com/GDeUT");
        console.log("boomer Music plays...");
    };

})();