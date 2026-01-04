// ==UserScript==
// @name         lectortmo
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Cascada Automatica TUMANGAONLINE
// @author       You
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395365/lectortmo.user.js
// @updateURL https://update.greasyfork.org/scripts/395365/lectortmo.meta.js
// ==/UserScript==
(function() {
    var documenturl = document.URL;
    if(documenturl.includes('paginated')){
        window.open(documenturl.split('/').slice(0,5).join('/') +'/cascade','_self');
    }

    // Your code here...
})();

$(document).keydown(function(tm) {
    switch(tm.which) {
       case 39: // right
            document.getElementsByClassName("col-6 col-sm-2 order-2 order-sm-3 chapter-arrow chapter-next")[0].children[0].scrollIntoView();
            document.getElementsByClassName("col-6 col-sm-2 order-2 order-sm-3 chapter-arrow chapter-next")[0].children[0].click();
            break;
        case 37: // left
            document.getElementsByClassName("col-6 col-sm-2 order-1 order-sm-1 chapter-arrow chapter-prev")[0].children[0].scrollIntoView();
            document.getElementsByClassName("col-6 col-sm-2 order-1 order-sm-1 chapter-arrow chapter-prev")[0].children[0].click();
            break;
        default: return; // exit this handler for other keys
    }

    tm.preventDefault(); // prevent the default action (scroll / move caret)
});

