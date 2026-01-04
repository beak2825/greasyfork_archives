// ==UserScript==
// @name         Simple Learn PDF Fullscreener
// @version      1.02
// @description  Makes PDFs opened in Learn take up the entire browser window instead of the pitiful small screen it uses by default.
// @author       Mia Swart
// @match        https://learn.canterbury.ac.nz/mod/resource/view.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at document-end
// @license GNU GPL
// @namespace https://greasyfork.org/users/937617
// @downloadURL https://update.greasyfork.org/scripts/448187/Simple%20Learn%20PDF%20Fullscreener.user.js
// @updateURL https://update.greasyfork.org/scripts/448187/Simple%20Learn%20PDF%20Fullscreener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //delete unnecessary parts of the page
    $("nav.fixed-top.navbar.navbar-fhs.navbar-expand.moodle-has-zindex")[0].remove() //remove UC AKO | LEARN bar at top
    $("#nav-drawer")[0].remove() //remove course nav bar at left
    $("div.blockpanelbtn")[0].remove() //remove "Course Blocks" button
    $("#page-header")[0].remove() //remove course name header and Dashboard/My courses/... links
    $("h2")[0].remove() //remove PDF name header
    $("div.activity-navigation")[0].remove() //remove "Jump to..." section below pdf
    $("#page-footer")[0].remove() //remove "For support please contact..." section at bottom of page
    $("#back-to-top")[0].remove() //remove back to top button


    //sets CSS of PDF box to take up the entire window
    var css_override = "position: fixed; left: 0; top: 0; width: 100%; height: 100%;"
    $("#resourceobject")[0].style = css_override;


    //Learn has some weird code that manually sets the size of the pdf viewer on window resize. This disables that. From https://stackoverflow.com/questions/63624006/how-to-remove-a-window-resize-listener-in-js
    const addEventListener = window.addEventListener;

    window.addEventListener = (...args) => {
        if (args[0] === 'resize') {
            console.log('Resize event trying to attach, but it is being blocked');
            $("#resourceobject")[0].style = css_override;
            console.log('try 2');
        } else {
            addEventListener(...args);
        }
    }


})();