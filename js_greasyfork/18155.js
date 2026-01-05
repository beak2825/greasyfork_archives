// ==UserScript==
// @name        Highlight Zombie Posts
// @namespace   SDMB_HighlightPosts
// @version     0.5.0
// @description Highlights old posts in SDMB vBulletin board (or other compatible boards).
// @author      TroutMan
// @include     http://boards.straightdope.com/sdmb/showthread.php*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/18155/Highlight%20Zombie%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/18155/Highlight%20Zombie%20Posts.meta.js
// ==/UserScript==

// Change colors/age if desired (age in months)
var age1 = 3;
var highlightColor1 = 'LemonChiffon';
var textColor1 = 'DarkSlateGray';
var age2 = 6;
var highlightColor2 = 'Gold';
var textColor2 = 'Black';
var age3 = 12;
var highlightColor3 = 'DarkOrange';
var textColor3 = 'Black';
var age4 = 36;
var highlightColor4 = 'Crimson';
var textColor4 = 'White';

HighlightPosts();

function HighlightPosts()
{
    var curDate = new Date();

    // get all <td> elements containing the date
    var allElements = document.evaluate(
        './/table[contains(@id,"post")]/tbody/tr/td[@class="thead"]/div[2]',
        document.body,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    for (var i = 0; i < allElements.snapshotLength; i++) {
        var thisElement = allElements.snapshotItem(i);
        var dateText = thisElement.textContent.trim();
        
        // date is mm-dd-yyyy, need to put in ISO order so works in all locales.
        // We're ignoring time and UTC conversion which might put us off by a day, but we don't care
        var dateParts = dateText.substr(0,10).split('-');
        var d1 = new Date(dateParts[2],dateParts[0]-1,dateParts[1]); 
        
        if (isNaN(d1)) {
            // do nothing - it's probably "today" or "yesterday"
        }
        else {
            // get difference in months
            var mDiff = (curDate.getFullYear() - d1.getFullYear()) * 12 + (curDate.getMonth() - d1.getMonth()) - (curDate.getDate() >= d1.getDate() ? 0 : 1);

            if (mDiff < age1) {
                // do nothing - most common scenario, so short-circuit here to avoid more checks
            }
            else if (mDiff < age2) {
                // format color 1
                thisElement.parentNode.style.backgroundColor = highlightColor1;
                thisElement.parentNode.style.color = textColor1;
            }
            else if (mDiff < age3) {
                // format color 2
                thisElement.parentNode.style.backgroundColor = highlightColor2;
                thisElement.parentNode.style.color = textColor2;
            }
            else if (mDiff < age4) {
                // format color 3
                thisElement.parentNode.style.backgroundColor = highlightColor3;
                thisElement.parentNode.style.color = textColor3;
            }
            else {
                // format color 4
                thisElement.parentNode.style.backgroundColor = highlightColor4;
                thisElement.parentNode.style.color = textColor4;
            }
        }
    }
}