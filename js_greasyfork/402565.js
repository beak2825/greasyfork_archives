// ==UserScript==
// @name         Reddit Auto Night Mode
// @version      1.1.1
// @description  Automatic night mode for reddit
// @author       Crapy
// @match        https://www.reddit.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @namespace    https://greasyfork.org/en/users/22246-crapy
// @downloadURL https://update.greasyfork.org/scripts/402565/Reddit%20Auto%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/402565/Reddit%20Auto%20Night%20Mode.meta.js
// ==/UserScript==

$( window ).on( "load", function() {
    var dt = new Date();
    var hours = dt.getHours();
    var isDarkEnabled = getComputedStyle(document.getElementsByTagName("header")[0].firstElementChild).getPropertyValue('--newRedditTheme-body').trim() == "#1A1A1B"
    var shouldDark = (hours > 19 || hours < 6);
    var userMenu = $( "[id='USER_DROPDOWN_ID']" );
    if(shouldDark != isDarkEnabled) {
        userMenu.click();
        if ($( "[role='switch']" ).length > 2) {
             $( "[role='switch']" )[2].click();
         }else{
             $( "[role='switch']" )[1].click();
         }
        userMenu.dblclick();
    }
})