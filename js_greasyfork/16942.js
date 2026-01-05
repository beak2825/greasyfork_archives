// ==UserScript==
// @name         FS Helper integrator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include     http://fs.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16942/FS%20Helper%20integrator.user.js
// @updateURL https://update.greasyfork.org/scripts/16942/FS%20Helper%20integrator.meta.js
// ==/UserScript==

var element = document.getElementById("page-item-file-list");
console.log(document.baseURI);

if (element) {
    var inter = element.innerHTML;
    var urlfs = document.baseURI;

    element.innerHTML = inter + "<a href='fsto:" + urlfs + "' style='margin: 10px 0' class='b-main__subsection m-main__subsection_theme_m-video m-main__subsection_type_tvshow m-main__subsection_type_additional' ><span class='b-main__subsection-title'>FS Helper</span></a>";
    
    


    
    
    
    console.log(element);
}
