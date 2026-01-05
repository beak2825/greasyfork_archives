// ==UserScript==
// @name         Commie Rainbows
// @namespace    http://twitter.com/SamuelEdwards
// @version      1.1.0
// @description  Makes Nyaa fruitier
// @author       @SamuelEdwards
// @match        https://nyaa.si/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29954/Commie%20Rainbows.user.js
// @updateURL https://update.greasyfork.org/scripts/29954/Commie%20Rainbows.meta.js
// ==/UserScript==

(function() {

    $( ".success:has(> td > a[title*='Commie'])" ).addClass( "commie" );
    $( ".commie" ).css({"background-image": "url('https://i.imgur.com/Yx7aMYq.jpg')"});
    $( ".commie > td" ).css({"background": "rgba(0,0,0,0)"});
    $( ".commie > td > a" ).css({"color": "#333"});
    $( ".commie > td > a:visited" ).css({"color": "#333"});

    $( "h3:contains('Commie')" ).addClass( "header-commie" );
    $( ".panel-success > .panel-heading:has(.header-commie)" ).css({"background-image": "url('https://i.imgur.com/Yx7aMYq.jpg')", "color": "#333"});

})();