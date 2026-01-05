// ==UserScript==
// @name        BTVA Casting Call [Blacklist & Whitelist]
// @namespace   https://rubyjcat.tumblr.com/
// @description Blacklist - hides projects on BTVA's Casting Call based on certain words the user wants to block. Whitelist - highlights projects based on words the user wants to see.
// @author      RubyJCat
// @include     *.behindthevoiceactors.com/casting-call
// @include     *.behindthevoiceactors.com/casting-call/*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29111/BTVA%20Casting%20Call%20%5BBlacklist%20%20Whitelist%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/29111/BTVA%20Casting%20Call%20%5BBlacklist%20%20Whitelist%5D.meta.js
// ==/UserScript==
//*******************************************************//
// UPDATES

//*******************************************************//

/**********************************************************
** Ver 1.02 (07/01/18): Changed URL regex due to BTVA's SSL update.
**
** Ver 1.01 (10/14/17): Now you can see the Owner of the blacklisted project.
**                      Modified blacklist phrases (by default) and added more information.

**********************************************************/

//*******************************************************//
// USER OPTIONS

//*******************************************************//

/**********************************************************
** What blacklisting does:
** When this script finds any one of the blacklisted phrases in the project listing,
** It hides all the info about that project and also disables clicking on it.
** CaSe-InSenSiTive! "Song" will filter out any case of Song, song, SONG, etc.
** Great for filtering out stuff you don't wanna see!
** It's simple - just add a phrase once to the list.
**
** Below is where you can add/change whatever words/phrases you want to blacklist.
** Make sure the phrases are in quotations and separated by commas.
** ex. ["FNAF", "Song", "Fandub", "18+", "Name of some douchebag I never want to work with ever again"]
**
** Blacklisting is useful for blocking certain users who spam fake projects that never see completion.
** As an example, it is highly recommended to block a user that originally went by "lunaknight" / "Noah Vermillion".
** In addition to fake projects, it was rumoured that this person has harassed female voice actors as well.
**
** As new accounts can always be created, feel free to add any additional usernames as you see fit.

**********************************************************/

var blacklist = ["Noah Vermillion", "Mark Waterflower", "Dan Tennyson", "Anne Takamaki fan", "Under Stress",
                 "Ooglyeye"];

/**********************************************************
** Whitelisting: The opposite, though it will simply highlight the project listing
** with a coloured background. Can change the colors if you don't like default BTVA gold.
** Great for filtering out stuff you DO wanna see!
**
** Disclaimer: Whitelisting does not automatically mean that project is "better" than
** other projects. It's just for you to see the projects you may like easier.
** Also has nothing to do with CCC gold ;)

**********************************************************/

var whitelist = ["Abridged", "Fanime"];

/**********************************************************
** [toggleHide] : Choose to show a 'This project is blacklisted' message
** or hide the listing completely from the page.

** Default      var toggleHide = false;

** set toggleHide = false to show a message.
** set toggleHide = true to hide the listing.

**********************************************************/

var toggleHide = false;

/**********************************************************
** [whitelistColor] : Change color of whitelisted listings. It is a gradient
** so there are two color choices that blend with each other.
** L for the color on the left, R for the color on the right.

** Default      var whitelistColorL = "gold";
                var whitelistColorR = "#C90";

** [whitelistLinkColor] : Change the whitelisted link color if the default is hard to read.

** Default      var whitelistLinkColor = "#2F9CC9";

** HTML Color Names : https://www.w3schools.com/colors/colors_names.asp

**********************************************************/

var whitelistColorL = "gold";
var whitelistColorR = "#C90";

var whitelistLinkColor = "#2F9CC9";

//*******************************************************//
// FUNCTIONS START BELOW

//*******************************************************//

$(document).ready(function() {

  $.each(blacklist, function (index, phrase) {

    var regex = new RegExp(phrase, 'i');

    $(".castingcall_listing").filter(function () {
       //If a listing contains one of the blacklisted phrases
       if (regex.test($(this).text())) {

        if (toggleHide) {

            $(this).hide();

        } //if
        else {

           // Turns off clicking on blacklisted projects
           $(this).off('click');

           // Adds a darker colour background to listing
           $(this).css({
		       background: '-webkit-gradient(linear,left top, right bottom, from(#666), to(#004))',
               color: '#666'
	       });

            // Adds a messaging saying this listing is blacklisted.
            // Also displays the Owner of the blacklisted project.

            var alltext = $(this).text();
            var n1 = alltext.indexOf("Owner:");
            var n2 = alltext.indexOf("Status:");
            var owner = alltext.substr(n1, n2 - n1);
    	    $(this).html("<span style=\"color:#AAF\">This project has been blacklisted. </span>" + owner);

        } //else

       } //regex.test()
    }); //filter

  }); //each

  $.each(whitelist, function (index, phrase) {

    var regex = new RegExp(phrase, 'i');

    $(".castingcall_listing").filter(function () {
       //If a listing contains one of the whitelisted phrases
       if (regex.test($(this).text())) {

         // Adds a coloured background to listing
        $(this).css({
		    background: `-webkit-gradient(linear,left top, right bottom, from(${whitelistColorL}), to(${whitelistColorR}))`
	    });

         // Change link color of whitelisted listings for better readability.
        $('a', this).css ({color: `${whitelistLinkColor}`});

       } //regex.test()
    }); //filter

  }); //each

}); //ready