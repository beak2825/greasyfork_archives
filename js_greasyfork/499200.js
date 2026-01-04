// ==UserScript==
// @name        AO3: Remove from List
// @version     1.1.1
// @description On 'Marked For Later' pages, add a button to remove from list without deleting
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/Userscripts
// @match       *://archiveofourown.org/users/*/readings?*show=to-read
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499200/AO3%3A%20Remove%20from%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/499200/AO3%3A%20Remove%20from%20List.meta.js
// ==/UserScript==

// Start User Settings
var hideDeleteButton = false; // set to 'true' if you want to hide the 'Delete from History' button from marked for later pages
// End User Settings

var workID = 0;
var removeURL = "/works/" + workID + "/mark_as_read";

$( ".reading .work" ).each( function( index, element ){ // for each work
    workID = $( this ).attr('id').replace(/work_/g, ""); // get work id
    removeURL = "/works/" + workID + "/mark_as_read"; // put into replace url
    $(this).find('ul.actions').append("<li><a href='" + removeURL + "'>Remove from List</a></li>"); // add button

    if (hideDeleteButton) { // if true
        $(this).find(".actions li").eq(0).remove();
    };
});
