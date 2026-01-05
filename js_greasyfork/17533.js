// ==UserScript==
// @name        IgnoreKickStarterTrolls
// @version     1.2
// @author      Voak
// @namespace   https://github.com/voakarai
// @description Collapse KickStarter comments from trolls based on their profile ID.  Hovering over their name lets you read if necessary.
// @include     *.kickstarter.com/*
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17533/IgnoreKickStarterTrolls.user.js
// @updateURL https://update.greasyfork.org/scripts/17533/IgnoreKickStarterTrolls.meta.js
// ==/UserScript==

// Details:
// --------
// Given a list of user profile IDs ('Trolls'), this script will minimize their voice
// by performing the following actions to each of their comments:
// - Prefix their name with the string "Troll: " for quick identification
// - Fade out their name and date of their comment to be 80% transparent
// - Hide the body of their comment text
//
// Additionally, if you MUST read their comment, you still can.  Simply hover over
// their name and their comment text will be revealed.  Move the mouse off their
// name and the comment will disapear again.
//
// Finding a "trolls" profile ID:
// -------------------------------------------
// 1. Go to a projects comment page
// 2. Click on the "trolls" user name to see their profile.
//    The url of their profile page ends with a long number, for example:
//        https://www.kickstarter.com/profile/xxxxxxxx
// 3. Add this number to the "Trolls" array below
//    NOTE: you can add as many ID's to this list as you want, as long as the
//          result is a valid Javascript Array object.
// 4. Save this changes and enable/activate/install the script in your userscript
//     extentsion or plugin, such as Greasemonkey or tamplermonkey

// Trolls:
// -------
// The `Trolls` Array.  Presentation of comments from these profile IDs will be
// modified so they are easier to ignore.
// Each entry is a single quoted string that contains a KickStarter Profile ID 
Trolls = [
    '0000000000' // Replace this one with a valid profile ID
];

// WARNING:
// --------
//     Unless you know what you are doing, DO NOT mess with anything below here!
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://code.jquery.com/jquery-2.1.3.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// load jQuery and execute the main function
addJQuery(main);

function main() {
    $(Trolls).each(function(i,id) {
        $("li.NS_comments__comment").has('a[href="/profile/'+id+ '"]')
            .find('p').hide().end()
            .find('h3')
            .hover( function(){ $(this).siblings('p').fadeIn(250);},
                   function(){ $(this).siblings('p').fadeOut(250);})
            .find('.author, .date').wrap('i').fadeTo(0,0.2).end()
            .find('.author').before('<em>Troll:&nbsp;</em>');
    });
}