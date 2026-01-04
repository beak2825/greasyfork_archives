// ==UserScript==
// @name         Subsplash Notes Dark Mode
// @namespace    https://greasyfork.org/en/users/119330-edward-sluder
// @version      0.3
// @description  Change SubSplash notes into Dark Mode
// @author       Edward Sluder
// @match        https://notes.subsplash.com/fill-in/view?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subsplash.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500447/Subsplash%20Notes%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/500447/Subsplash%20Notes%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("still working");


    // Create our own styleSheet
    var sheet = (function() {
        // Create the <style> tag
        var style = document.createElement("style");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();

    // Add our style rules.
    sheet.insertRule( 'body { background-color: black }' );
    sheet.insertRule( 'body { color: #aeaeae }' );
    sheet.insertRule( '.notes ng-scope {background-color:black }' );
    sheet.insertRule( 'div.info__title.ng-binding {color: white}' );


    

})();