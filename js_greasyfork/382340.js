// ==UserScript==
// @name         komica ID quick search
// @namespace    https://www.komica.org/
// @version      0.65
// @description  快速搜尋ID

// @author       ishigaki
// @include      https://sora.komica.org/00/*
// @icon         https://www.komica.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382340/komica%20ID%20quick%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/382340/komica%20ID%20quick%20search.meta.js
// ==/UserScript==

(function() {
'use strict';

    document.body.addEventListener("click" , function(event)
    {
        let kyaru = event.target;
        if(kyaru.getAttribute("data-id") && kyaru.tagName == "SPAN")
        {
            //window.open("https://www.homu-api.com/search?id=" + kyaru.getAttribute("data-id") , "_blank");
            window.open("https://komica-cache.appspot.com/?search=ID&q=" + kyaru.getAttribute("data-id") , "_blank");
        }
    });

})();