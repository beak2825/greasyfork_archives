// ==UserScript==
// @name         chrisguitars Image Viewer
// @namespace    http://www.chrisguitars.com/
// @version      0.1
// @description  if it ain't broke - don't fix it.......
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js
// @author       rickzabel
// @match        http://www.chrisguitars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20212/chrisguitars%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/20212/chrisguitars%20Image%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function chrisguitars_bootstrap() {
        var links = document.getElementsByTagName('a');
        for(var i = 0; i< links.length; i++){
            //alert(links[i].href);
            //var test = "trasg.jpg";
            var n = links[i].href.indexOf("jpg");
            if(n > 0 ){
                //console.log(links[i]);
                $(links[i]).append('<img style="max-width:100px;" src=' + links[i].href + '>');
            }
            //console.log(links[i].href);
        }
    }
    setTimeout(chrisguitars_bootstrap, 3000);
})();







