// ==UserScript==
// @name         AO3: [Wrangling] Count Wranglers on Subfandoms
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  On a fandom tag's Landing Page, writes out how many wranglers are currently assigned to the listed subfandoms
// @author       escctrl
// @version      1.1
// @match        *://*.archiveofourown.org/tags/*
// @exclude      *://*archiveofourown.org/tags/*/wrangle*
// @exclude      *://*archiveofourown.org/tags/*/edit
// @exclude      *://*archiveofourown.org/tags/*/comments*
// @exclude      *://*archiveofourown.org/tags/*/search*
// @exclude      *://*archiveofourown.org/tags/*/troubleshooting*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447241/AO3%3A%20%5BWrangling%5D%20Count%20Wranglers%20on%20Subfandoms.user.js
// @updateURL https://update.greasyfork.org/scripts/447241/AO3%3A%20%5BWrangling%5D%20Count%20Wranglers%20on%20Subfandoms.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const DEBUG = true;

    // wait duration between checking individual bins - set this number higher if you often run into Retry Later
    //   this applies especially to huge fandom trees like DCU!! 3sec is NOT enough for the full list! make this number huge and let it run in the background
    //   defined in milliseconds, e.g. 3000 = 3 seconds
    const interval = 5000;

    // reasons not to run this script: the tag isn't a fandom metatag, or tag doesn't have subtags to check
    const subfandoms = document.getElementsByClassName('sub')[0];
    if ($('div.parent.fandom').length == 0) { if (DEBUG) console.log('Count Wranglers on Subfandoms script says: this is not a fandom tag'); return true; }
    if (subfandoms == null) { if (DEBUG) console.log('Count Wranglers on Subfandoms script says: fandom doesn\'t have subfandoms'); return true; }

    // resetting from any previous page loads so the fun can start
    localStorage.removeItem("ao3jail");
    localStorage.setItem("ao3jail", "false");

    // some code to add *) span for progress bar/report global results, *) button to start the checking
    $(subfandoms).children('h3.heading').before(`<span id="countwranglers-unwrangled" style="display: none;">0</span>
                                                 <span id="countwranglers-results" style="float:right;"><button id="countwranglers">Count Wranglers</button></span>`);

    // assign the function to the click event (will trigger only once user clicked the link)
    $(subfandoms).find('button#countwranglers').click(countWranglers);

    // Checks if using a dark mode by calculating the 'brightness' of the page background color
    const darkmode = lightOrDark(window.getComputedStyle(document.body).backgroundColor) == "dark" ? true : false;

    // a function that gets run on button push
    function countWranglers() {

        // replace button with progress message
        var progress = document.getElementById('countwranglers-results');
        $(progress).css("padding", "0.3em 0.25em");
        $(progress).html('Counting wranglers... grab a drink, this may take a while!');

        // find all the subfandoms
        var fandoms = $(subfandoms).find('ul.tree a');

        // placeholder next to each fandom showing TBD until the fandom was checked
        $(fandoms).after('<span style="font-size: smaller;"> <em>... wranglers TBD</em></span>');

        // loop through the unwrangled bins
        $(fandoms).each(function(i, fandom) {

            // set a delay between bin checks to reduce chances of jail
            setTimeout(function() {

                // if previous loops hit Ao3 Jail, don't try looking for wranglers anymore
                if ( localStorage.getItem("ao3jail") == "true") {
                    console.log('previously received "Retry later" response, skipping');
                    return false;
                }

                var assignedCount = 0;
                var unwrangledTotal = document.getElementById('countwranglers-unwrangled');

                // retrieve the data from the fandom tag's edit page
                $.get(fandom.href + '/edit', function(response) {

                }).done(function(response) {
                    // find the field containing the assigned wranglers
                    var assignedWranglers = $(response).find('#edit_tag fieldset:first dd:nth-of-type(4)').text();
                    var unwrangledCount = parseInt(unwrangledTotal.innerText);

                    // unwrangled fandoms have a Sign Up link here
                    if (assignedWranglers == 'Sign Up') {
                        // count up the global total of unwrangled subfandoms
                        unwrangledCount++;
                        unwrangledTotal.innerText = unwrangledCount.toString();

                        // update the fandom tag with that information and put in an Edit & Wrangle child tags button for convenience
                        $(fandom).next().html(' ... unwrangled [<a href="'+ fandom.href + '/edit">Edit</a>] [<a href="'+ fandom.href + '/wrangle">Wrangle</a>]');

                        // highlight the fandom tag to make it easily findable in a long list
                        if (darkmode) { $(fandom).parent().css("background-color", "rgb(160, 82, 45)"); }
                        else { $(fandom).parent().css("background-color", "rgb(255, 255, 133)"); }
                    }
                    // assigned wranglers are plaintext
                    else {
                        // split the a comma-seperated list into an array and count its length (that's the number of wranglers)
                        assignedCount = assignedWranglers.split(', ').length;

                        // update the fandom tag with that information
                        $(fandom).next().html(' ... '+ assignedCount +' wrangler' + ((assignedCount > 1) ? "s" : ""));
                    }

                    // if last loop also succeeded, update global progress with "all wrangled" or "# unwrangled"
                    if (fandoms.length == i+1)
                        $(progress).html((unwrangledCount == 0) ? 'all subfandoms are wrangled \\o/' : unwrangledCount + ' subfandoms unwrangled');

                // thanks to Przemysław Sienkiewicz on Stackoverflow for the code to catch error responses https://stackoverflow.com/a/40256829
                // do other stuff on fail (set the ao3jail marker)
                }).fail(function(data, textStatus, xhr) {
                    localStorage.setItem("ao3jail", "true"); // store it so next AJAX can skip
                    $(progress).html('Wrangler Count has hit "Retry later", sorry!');
                    //This shows status code eg. 429
                    console.log("Wrangler Count has hit Retry later", data.status);
                    return false;
                });
            // the each() loops immediately and creates all timeout calls (async) at once, so we need to stagger them
            // by multiplying the 3s delay by the loop number (bin #0 = 3000*0, bin #1 = 3000*1, bin #2 = 3000*2, etc)
            }, interval*i);
        }); // end each
    } // end function
})(jQuery);


// helper function to determine whether a color (the background in use) is light or dark
// https://awik.io/determine-color-bright-dark-using-javascript/
function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    }
    else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) { return 'light'; }
    else { return 'dark'; }
}