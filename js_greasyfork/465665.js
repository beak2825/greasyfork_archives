// ==UserScript==
// @name         MAL Inspector Useful Buttons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows Copy Title, Hof and Web Archive buttons below Anime title
// @author       Aatiho Nora
// @match        https://*.myanimelist.net/anime/*
// @icon         https://encrypted-tbn2.gstatic.com/faviconV2?url=https://myanimelist.net&client=VFE&size=32&type=FAVICON&fallback_opts=TYPE,SIZE,URL&nfrp=2
// @exclude      https://myanimelist.net/manga/*
// @exclude      https://myanimelist.net/anime/season*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/465665/MAL%20Inspector%20Useful%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/465665/MAL%20Inspector%20Useful%20Buttons.meta.js
// ==/UserScript==

// Web Archive

(function() {
    'use strict';



    var $ = window.jQuery;
    //--- Create Web Archive button.
    $('div[itemprop="name"]:first').after('<button id="inspectorWANode" type="button">Web Archive</button>');
    $("#inspectorWACopyNode").css({"font-size":"4px"});

    //--- Activate Web Archive button.
    document.getElementById ("inspectorWANode").addEventListener (
    "click", web, false
    );

    //--- Web Archive Function.
    function web(eli) {
       var getURL = document.URL
       var webURL = "https://web.archive.org/web/*/" + getURL;
       window.open(webURL, '_blank').focus();
}




})();

// HoF

(function() {
    'use strict';

    var $ = window.jQuery;
         //--- Create HoF button.
    $('div[itemprop="name"]:first').after('<button id="inspectorHOFNode" type="button">Hall of Fame</button>');
    $("#inspectorHOFCopyNode").css({"font-size":"4px"});

        //--- Activate HoF button.
document.getElementById ("inspectorHOFNode").addEventListener (
    "click", hof, false
    );

    //--- HoF Function.
    function hof(eli) {
       var getURL = document.URL
       var animeID = getURL.split("/")[4]
       var hofURL = "https://anime.jhiday.net/hof/anime/" + animeID;
       window.open(hofURL, '_blank').focus();
}


})();

// Copy MAL ID Title

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;
    $('div[itemprop="name"]:first').after('<button id="inspectorTitleCopyIDNode" type="button">Copy MAL ID</button>');
    $("#inspectorTitleCopyIDNode").css({"font-size":"13px"});
    //--- Activate the newly added button.
document.getElementById ("inspectorTitleCopyIDNode").addEventListener (
    "click", copyid, false
);
    function copyid(ele) {
        var getURL = document.URL
        var copyID = getURL.split("/")[4]
        let temp = document.createElement('textarea');
        document.body.appendChild(temp);
        temp.value = copyID;
        temp.select();
        document.execCommand('copy');
        temp.remove();

}
})();

// Copy Title

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;
    $('div[itemprop="name"]:first').after('<button id="inspectorTitleCopyNode" type="button">Copy title</button>');
    $("#inspectorTitleCopyNode").css({"font-size":"13px"});
    //--- Activate the newly added button.
document.getElementById ("inspectorTitleCopyNode").addEventListener (
    "click", copy, false
);
    function copy(ele) {
        var copyText = document.getElementsByTagName("h1");
        var text = copyText[0]
        let temp = document.createElement('textarea');
        document.body.appendChild(temp);
        temp.value = text.textContent;
        temp.select();
        document.execCommand('copy');
        temp.remove();

}
})();