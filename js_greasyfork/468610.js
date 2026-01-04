// ==UserScript==
// @name         AO3: [Wrangling] Show Fandom Touch Date!
// @description  Show last date you entered the wrangle page for a fandom!
// @version      1.2.0

// @author       daydreamorama & Nexidava
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tag_wranglers/*
// @match        *://*.archiveofourown.org/tags/*/wrangle*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/468610/AO3%3A%20%5BWrangling%5D%20Show%20Fandom%20Touch%20Date%21.user.js
// @updateURL https://update.greasyfork.org/scripts/468610/AO3%3A%20%5BWrangling%5D%20Show%20Fandom%20Touch%20Date%21.meta.js
// ==/UserScript==


// copied from https://stackoverflow.com/a/15208141
(function($) {
  // Get this browser's take on no fill
  // Must be appended else Chrome etc return 'initial'
  var $temp = $('<div style="background:none;display:none;"/>').appendTo('body');
  var transparent = $temp.css('backgroundColor');
  $temp.remove();

jQuery.fn.bkgcolor = function( fallback ) {
    function test( $elem ) {
        if ( $elem.css('backgroundColor') == transparent ) {
          return !$elem.is('body') ? test( $elem.parent() ) : fallback || transparent ;
        } else {
          return $elem.css('backgroundColor');
        }
    }
    return test( $(this) );
};

// implementing https://24ways.org/2010/calculating-color-contrast/
jQuery.fn.isDarkMode = function() {
    //console.log($(this).bkgcolor())
    rgba = $(this).bkgcolor().match(/rgba?\((\d+), (\d+), (\d+)(, \d+)?\)/);
    if (!rgba) {
        console.log("error: failed to parse bkcolor, defaulting to false")
        return false;
    }
    yiq = ((rgba[1]*299)+(rgba[2]*587)+(rgba[3]*114))/1000;
    return yiq < 128;
}

})(jQuery);



(function($) {
    // CONFIG START

    // set this to true if you want in first column, note if you are using other scripts
    // and you set this to true you'll probably have to modify them to call: split("\n")[0]
    // when they try to get the fandom name from the table
    const USE_IN_FIRST_COLUMN = false

    // report days since last access instead of last access datetime
    const USE_DAYS_SINCE_ACCESS = true

    // only show fandom touch dates for fandoms with unwrangled tags
    const SHOW_ONLY_UNWRANGLED = true

    // clear the fandom touch date on any fandom with no unwrangled tags (implies SHOW_ONLY_UNWRANGLED=true)
    const CLEAR_ON_EMPTY = true

    // set fandom touch date to today when unwrangled tags are detected in a previously clear fandom
    const AUTO_TOUCH_UNWRANGLED = true

    // highlight fandom touch dates in a color depending on days since last wrangled
    // recommended to use this only with CLEAR_ON_EMPTY=true to avoid red warnings on quiet fandoms with long gaps between tags
    // disable by setting values to 0
    const HIGHLIGHT_OLDER_AFTER = 7;
    const HIGHLIGHT_OLDEST_AFTER = 14;

    // thanks to kaerstyne for the color codes and highlighting concept
    const COLOR_LIGHT_NEW     = "";
    const COLOR_LIGHT_OLDER   = "#FDF2A3"; // default: #FDF2A3
    const COLOR_LIGHT_OLDEST  = "#FFB7B7"; // default: #FFB7B7
    const COLOR_DARK_NEW      = "";
    const COLOR_DARK_OLDER    = "#999900"; // default: #999900
    const COLOR_DARK_OLDEST   = "#8B0000"; // default: #8B0000

    // list of fandoms to never highlight
    // useful for shared fandoms with lower priority, and fandom metatags
    const NEVER_HIGHLIGHT_FANDOMS = [
    ]

    // CONFIG END

    'use strict';

    // function to save the fandom touch date, or alternatively clear it
    function setAccessDate(fandomName, clear=false) {
        const key = fandomName + "_clickedDate";
        const new_value = clear ? 0 : new Date().getTime();
        console.log("Saving new date: " + new_value + " on " + key);
        GM_setValue(key, new_value);
        return new_value;
    }

    // which page is this?
    var page_url = window.location.pathname;

    // wrangle page!
    if (page_url.includes("/wrangle")) {
        setAccessDate($("h2.heading a").text());
    }
    else { // its the page of all the fandoms!
        const array = f => Array.prototype.slice.call(f, 0)

        // add the header of the new column with matching formatting
        if (!USE_IN_FIRST_COLUMN) {
            const hRows = $("thead > tr")
            hRows[0].innerHTML += '<th colspan="1" scope="col">Last Opened</th>';
            hRows[1].innerHTML += '<th scope="col"></th>';
        }

        //gets all the fandoms
        var rows = array($("tbody > tr"));

        for (const row of rows) {
            const fandomheader = row.getElementsByTagName("th")[0];
            const fandomName = fandomheader.innerText
            const key = fandomName + "_clickedDate";
            //console.log("KEY: " + key + "fandom: " + fandomName)

            // check for unwrangled tags in this row
            const hasUnwrangled = array(row.getElementsByTagName('td')).some(col => {return col.title.includes("unwrangled") && col.getElementsByTagName("a").length});

            //If the fandomheader's info hasn't been saved by the user before, we will set the old value as 0
            var savedDate = GM_getValue(key) || 0;

            // if enabled, clear last touched date on fandoms with no unwrangled tags
            if (CLEAR_ON_EMPTY && !hasUnwrangled && savedDate) {
                setAccessDate(fandomName, clear=true);
                continue;
            }
            // if enabled, mark last wrangled date when unwrangled tags found again
            else if (AUTO_TOUCH_UNWRANGLED && hasUnwrangled && !savedDate) {
                savedDate = setAccessDate(fandomName);
            }

            // if enabled, only show date for fandoms with unwrangled tags
            if (SHOW_ONLY_UNWRANGLED && !hasUnwrangled) continue;

            if (savedDate != 0) {
                //console.log("date: " + savedDate.toLocaleString())

                // convert timestamp to Date
                savedDate = new Date(savedDate);

                // calculate days since access
                const daysSinceAccess = Math.round((new Date() - savedDate) / (1000*60*60*24));

                // if enabled, format date as days since access instead of date accessed
                if (USE_DAYS_SINCE_ACCESS) {
                    savedDate = daysSinceAccess + (daysSinceAccess == 1 ? " day ago" : " days ago");
                } else {
                    savedDate = savedDate.toLocaleString();
                }

                // enable old timestamp highlighting
                var style = "";

                if (NEVER_HIGHLIGHT_FANDOMS.includes(fandomName)) {
                } else if (HIGHLIGHT_OLDEST_AFTER && daysSinceAccess >= HIGHLIGHT_OLDEST_AFTER) {
                    style = ' style="background-color: ' + ($(row).isDarkMode() ? COLOR_DARK_OLDEST : COLOR_LIGHT_OLDEST) + '"'
                } else if (HIGHLIGHT_OLDER_AFTER && daysSinceAccess >= HIGHLIGHT_OLDER_AFTER) {
                    style = ' style="background-color: ' + ($(row).isDarkMode() ? COLOR_DARK_OLDER : COLOR_LIGHT_OLDER) + '"'
                } else if (COLOR_DARK_NEW || COLOR_LIGHT_NEW) {
                    style = ' style="background-color: ' + ($(row).isDarkMode() ? COLOR_DARK_NEW : COLOR_LIGHT_NEW) + '"'
                }

                savedDate = '<span'+ style +'>' + savedDate + '</span>'

                // originally I wanted as part of the header cell but then other scripts that used
                // that to figure out fandom got broken.
                if (USE_IN_FIRST_COLUMN) {
                    const theDate = "<br>(" + savedDate + ")";
                    fandomheader.parentElement.firstElementChild.innerHTML += theDate;
                } else {
                    // so now I'm just putting at the end of the row
                    row.innerHTML += '<td>' + savedDate + '</td>';
                    //console.log("should be unmod: " + fandomheader.innerText);
                }
            }
        }
    }
})(jQuery);
