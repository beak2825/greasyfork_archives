// ==UserScript==
// @name        WaniKani Phonetic-Semantic Composition Rebirth
// @namespace   wk_phon_rebirth
// @include     http://www.wanikani.com/kanji/*
// @include     http://www.wanikani.com/review/session*
// @include     http://www.wanikani.com/lesson/session*
// @include     https://www.wanikani.com/kanji/*
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @author      acm
// @description Adds information to Wanikani about kanji that use Phonetic-Semantic Composition.
// @version     1.1.1
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant       GM_addStyle
// @grant       unsafeWindow
// @require     https://greasyfork.org/scripts/34328-wanikani-phonetic-semantic-composition-original-database/code/Wanikani%20Phonetic-Semantic%20Composition%20Original%20Database.js
// @downloadURL https://update.greasyfork.org/scripts/34330/WaniKani%20Phonetic-Semantic%20Composition%20Rebirth.user.js
// @updateURL https://update.greasyfork.org/scripts/34330/WaniKani%20Phonetic-Semantic%20Composition%20Rebirth.meta.js
// ==/UserScript==

/*
 *  ====  Wanikani  Phonetic-Semantic Composition  ====
 *    ==             by ruipgpinheiro              ==
 *     =           modifications by acm            =
 *
 *  It seems that many kanji were created using a process called phonetic-semantic
 *  composition. This process joins two (or more) kanji (radicals), one (or more of them)
 *  usually called the bushu or dictionary section header establishes the meaning of the
 *  kanji, and another one, the phonetic component that establishes the (on'yomi) sound.
 *
 *  This means that a lot of kanji have a built-in mnemonic that I haven't seen being
 *  referred to in Wanikani, and so it's quite useful to know some of them, especially
 *  when having trouble with a specific reading!
 *
 *
 *
 *  For example (using non-Wanikani kanji names):
 *
 *  反・はん "to rebel" ("anti" by Wanikani mnemonics)
 *
 *  飯・はん "rice"
 *  版・はん "print"
 *  板・はん "a board"
 *  坂・はん "slope"
 *  販・はん "sale"
 *  叛・はん "to betray"
 *
 *  As you can notice, these kanji all use the first one as a phonetic component, placing it
 *  to the right of the semantic component (mostly, phonetic components are drawn right-most).
 *  Due to the evolution of the language, many such kanji have since then slightly changed
 *  pronunciation (仮・か "temporary"), but knowing this information can be a major help.
 *
 *  This script imports a database of over 100 phonetic components with over 400 regular Kanji
 *  that use their on'yomi reading onto Wanikani. This means that over a fourth of Wanikani's
 *  Kanji should be included in here somewhere and have a "built-in mnemonic" of sorts.
 *  Depending on how you study, it could be a huge help (or no help at all - you decide what's
 *  best for your brain). The information will be shown on the Kanji info page, during reviews
 *  (if you check the details for a Kanji) and during lessons, provided the relevant Kanji is
 *  included in the database.
 *
 *  Note that the database used in this script was automatically generated from a PDF file,
 *  and even though I tried to check it for mistakes, it is possible that it contains an error or two.
 *  This userscript contains the whole Kanji table from Hiroko Townsend's Thesis about phonetic
 *  components, which means the script's database includes 143 different phonetic components
 *  encompassing 417 regular kanji (kanji that use the on'yomi reading from the phonetic component)
 *  and 210 irregular ones (kanji that use a different reading, though with - supposedly - similar
 *  roots). Some of these Kanji aren't available on Wanikani, though, even though they'll be shown
 *  by the userscript as they are part of its database.
 *
 */

/*
 *  ====  LICENSE INFORMATION  ====
 *
 *  This script contains a database of phonetic components adapted under Fair Use
 *  (for nonprofit educational purposes) from
 *    Phonetic Components in Japanese Characters
 *      by Hiroko Townsend
 *      Master of Arts in Linguistics, San Diego State University, 2011
 *  Obtain a complete copy of the Thesis at http://sdsu-dspace.calstate.edu/bitstream/handle/10211.10/1203/Townsend_Hiroko.pdf
 *  Thank you Hiroko for the very useful thesis!
 *
 *
 *
 *	This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/*
 *	=== Changelog ===
 *	1.1.1 (21 October 2017)
 *	- Snatched some code from WaniKani Stroke Order userscript:
 *	-- Use of built-in MutationObserver instead of custom code
 *	-- A single function to extract a kanji instead of 3
 *
 *	1.1.0 (19 October 2017)
 *	- Cleaned up code
 *	- Fixed an issue with GreaseMonkey and onClick events in Firefox
 *
 *  1.0.5 (11 March 2014)
 *  - Relicensed under the GPLv3.
 *
 *  1.0.4 (23 January 2014)
 *  - Now supports the HTTPS protocol.
 *
 *  1.0.3 (24 November 2013)
 *  - Corrected 症, which has the wrong reading in the thesis used for creating the DB.
 *    It's now listed as irregular with the reading しょう, even though its phonetic component can also (rarely) be read the same way.
 *
 *  1.0.2 (24 November 2013)
 *  - Fixed a bug in the code that automatically generated the DB, which would misread phonetic components with a single,
 *    irregular kanji, like 刃, and put them inside the DB entry of the previous phonetic component.
 *    Therefore, the DB was regenerated from scratch. Updated the DB count in the description accordingly.
 *
 *  1.0.1 (23 November 2013)
 *  - Kanji links now open in a new tab, to fix a bug where clicking them would just restart the current reviews/lessons session.
 *
 *  1.0.0 (22 November 2013)
 *  - First release.
 */

/*
 * Debug Settings
 */
var debugLogEnabled = false;
var debugAlwaysUseFirstDBEntry = false;
var scriptShortName = "WKPSC";

scriptLog = debugLogEnabled ?
    function(msg)
    {
        if (typeof msg === "string")
            console.log(scriptShortName + ": " + msg);
        else
            console.log(msg);
    } :
    function() {};

/*
 * Global Variables/Objects/Classes
 */
// Stores the current Wanikani page we're on
var PageEnum = Object.freeze({ unknown:0, kanji:1, reviews:2, lessons:3 });
var curPage = PageEnum.unknown;

// Use the jQuery of the page itself to access storage
$ = unsafeWindow.$;

/*
 * Database Functions
 *
 * Searches the DB for a Kanji
 * If found, returns an object of the form {entry, regular, irregular}, where:
 *   entry - reference to the DB entry containing the Kanji
 *   type - 'regular' or 'irregular', specifies in which DB sub-array the kanji was found
 *   kanji - Kanji found (same as the input kanji)
 * If not found, returns null
 */
function searchDBForKanji(kanji)
{
    for (var i = 0; i < database.length; i++)
    {
        var cur = database[i];

        if (kanji == cur.phonetic)
            return {entry:cur, type:"phonetic", kanji:cur.phonetic};

        if ("regular" in cur)
        {
            for(var j = 0; j < cur.regular.length; j++)
            {
                if (kanji == cur.regular[j])
                    return {entry:cur, type:"regular", kanji:cur.regular[j]};
            }
        }

        if ("irregular" in cur)
        {
            for (var k = 0; k < cur.irregular.length; k++)
            {
                if (kanji == cur.irregular[k][0])
                    return {entry:cur, type:"irregular", kanji:cur.irregular[k][0], irregular:cur.irregular[k]};
            }
        }
    }

    return null;
}

/*
 * Injected Elements and Related Functions
 */
// Toggles the "More Information" button
function WKPSC_moreInformation_onClick(e)
{
    var obj = e.target || e.srcElement;
    var elem = obj.nextSibling;

    if (elem.getAttribute('class') == "WKPSC-more-information-hidden")
    {
        obj.innerHTML = 'Less Information <i class="icon-chevron-up">';
        elem.setAttribute('class', "WKPSC-more-information-show");
    }
    else
    {
        obj.innerHTML = 'More Information <i class="icon-chevron-down">';
        elem.setAttribute('class', "WKPSC-more-information-hidden");
    }
}

// Generates HTML for the injected Element
function generateHTML(dbEntry)
{
    var html;
    var regularText;

    // Detect whether mostly regular or not
    var regularCount = 0;
    var irregularCount = 0;

    if ("regular" in dbEntry.entry)
        regularCount = dbEntry.entry.regular.length;
    if ("irregular" in dbEntry.entry)
        irregularCount = dbEntry.entry.irregular.length;

    if (regularCount >= irregularCount)
    {
        if (irregularCount === 0)
            regularText = "completely regular";
        else
            regularText = "mostly regular";
    }
    else
    {
        if (regularCount === 0)
            regularText = "completely irregular";
        else
            regularText = "mostly irregular";
    }

    var totalCount = regularCount + irregularCount;

    // Generate correct HTML from templates
    var htmlTemplateThisKanji = '<span rel="tooltip" class="kanji-highlight" data-original-title="This Kanji" lang="ja">{0}</span>';
    html = htmlTemplateThisKanji.format(dbEntry.kanji);

    var htmlTemplatePhonetic = '';

    if(dbEntry.type == "phonetic")
    {
        htmlTemplatePhonetic = ' is a <b>{1}</b> phonetic component used in {2} Kanji to represent the <i>on\'yomi</i> reading <text class="WKPSC-hiragana">{3}</text>.';
        html += htmlTemplatePhonetic.format(dbEntry.entry.phonetic, regularText, totalCount, dbEntry.entry.reading);
    }
    else
    {
        if(dbEntry.entry.phonetic == "obsolete")
        {
            htmlTemplateNonPhonetic = ' was formed using phonetic-semantic composition. However, with the passing of time, the phonetic component used became obsolete as a Kanji, so the radical cannot be shown here. Nevertheless, this kanji contains a <b>{1}</b> phonetic component, also used in {2} other Kanji to represent the <i>on\'yomi</i> reading <text class="WKPSC-hiragana">{3}</text>. You should be able to compare Kanji beloging to the same set to figure out what it looks like.';
        }
        else
        {
            htmlTemplateNonPhonetic = ' was formed using phonetic-semantic composition. Therefore it contains the <b>{1}</b> phonetic component <a href="http://www.wanikani.com/kanji/{0}" target="_blank"><span rel="tooltip" class="kanji-highlight" data-original-title="Phonetic Component" lang="ja">{0}</span></a>, also used in {2} other Kanji to represent the <i>on\'yomi</i> reading <text class="WKPSC-hiragana">{3}</text>.';
        }

        html += htmlTemplateNonPhonetic.format(dbEntry.entry.phonetic, regularText, totalCount-1, dbEntry.entry.reading);
    }

    if (dbEntry.type == "irregular")
        html += ' <u>Make sure to note that this Kanji is irregular!</u>';

    var htmlTemplateMoreInformation = '</p><span id="WKPSC_info_btn" class="WKPSC-more-information-button WKPSC-more-information-button-margin">More Information <i class="icon-chevron-down"></i></span><span class="WKPSC-more-information-hidden">This series of phonetic-semantically composed Kanji consists of the ';
    html += htmlTemplateMoreInformation;

    var entryLength = 0;
    var cur = "";
    var i = 0;

    // Generate the list of 'regular' Kanji from templates, if any exist
    if ("regular" in dbEntry.entry)
    {
        var regularKanjiTemplate = '<a href="http://www.wanikani.com/kanji/{0}" target="_blank"><span rel="tooltip" class="kanji-highlight" data-original-title="Kanji" lang="ja">{0}</span></a>';
        var regIrregKanjiJoiningTemplate = '<br> There are also the following ';
        var regularTemplate = '<span rel="tooltip" class="reading-highlight" data-original-title="Same On\'yomi Reading">regular</span> Kanji ';

        html += regularTemplate;

        entryLength = dbEntry.entry.regular.length;
        for (i = 0; i < entryLength; i++)
        {
            cur = dbEntry.entry.regular[i];

            if (i > 0 && i < entryLength-1)
                html += ", ";
            else if (i == entryLength-1 && i > 0)
                html += " and ";

            html += regularKanjiTemplate.format(cur);
        }
        html += '.';

        if ("irregular" in dbEntry.entry)
            html += regIrregKanjiJoiningTemplate;
    }

    // Generate the table of 'irregular' Kanji from templates, if any exist
    if ("irregular" in dbEntry.entry)
    {
        var irregularKanjiTemplate = '<span rel="tooltip" class="reading-highlight" data-original-title="Similar On\'yomi Reading (shared historical roots)">irregular</span> Kanji:<table style="text-align:center; line-height:1.7" align="center" width="200px"><td class="span6"><h3>Kanji</h3></td><td class="span6"><h3>Reading</h3></td></tr>{0}</table>';
        var rowTemplate = '<tr><td><a href="http://www.wanikani.com/kanji/{0}" target="_blank"><span class="kanji-highlight" lang="ja">{0}</span></a></td><td class="WKPSC-hiragana" lang="ja">{1}</td></tr>';

        var tableHTML = "";
        entryLength = dbEntry.entry.irregular.length;

        for (i = 0; i < entryLength; i++)
        {
            cur = dbEntry.entry.irregular[i];

            tableHTML += rowTemplate.format(cur[0], cur[1]);
        }

        html += irregularKanjiTemplate.format(tableHTML);
    }

    // Close the remaining tag and return
    html += '</span>';

    return html;
}

// Create the element to be injected, set its id, class and HTML content
function createHTMLElement(dbEntry)
{
    var elmnt;

    if (curPage == PageEnum.kanji)
        elmnt = document.createElement('aside');
    else
        elmnt = document.createElement('blockquote');

    elmnt.setAttribute('id', 'WKPSC-extra-information');
    elmnt.setAttribute('class', 'additional-info');
    elmnt.innerHTML = '<h3><i class="icon-info-sign"></i> Phonetic-Semantic Composition</h3><p>' + generateHTML(dbEntry) + '</p>';

    return elmnt;
}

// Stores the old element, since we might have to clean it up when in the lessons module
var oldElement = null;

// Detects current Kanji, searches DB, and if a match is found, creates and injects the corresponding HTML Element
function addElement(node)
{
    // If required (lessons module), clean up the previously created element
    if (!isEmpty(oldElement) && !isEmpty(oldElement.parentNode))
        oldElement.parentNode.removeChild(oldElement);
    oldElement = null;

    // Find the current kanji

    var kanji;

    if (debugAlwaysUseFirstDBEntry)
        kanji = database[0].phonetic;
    else
    {
        kanji = getKanji();

        if (kanji === null)
        {
            scriptLog("Unable to extract the current kanji!");
            return;
        }
    }

    scriptLog(kanji);

    // Check whether the current kanji is in the database
    var dbEntry = searchDBForKanji(kanji);

    if (isEmpty(dbEntry)) {
        scriptLog("Kanji not in DB. Ignoring.");
        return;
    }
    scriptLog(dbEntry);

    // Create custom element
    var newElmnt = createHTMLElement(dbEntry);

    // Insert element
    switch(curPage)
    {
        case PageEnum.kanji:
            $('section#note-reading').before(newElmnt);
            break;
        case PageEnum.reviews:
            $('section#item-info-reading-mnemonic').append(newElmnt);
            break;
        case PageEnum.lessons:
            $('div#supplement-kan-reading div:contains("Reading Mnemonic") blockquote:last').after(newElmnt);
            oldElement = newElmnt;
            break;
        default:
            throw Error("Unknown page type!");
    }

    document.getElementById("WKPSC_info_btn").addEventListener("click", WKPSC_moreInformation_onClick);
}

/*
 * Kanji Info Pages
 */
function kanjiInfo_init()
{
    GM_addStyle('.WKPSC-hiragana { font-weight: bold; }');
    GM_addStyle('.WKPSC-more-information-button-margin { margin-bottom: -10px !important; display:block; }');
    GM_addStyle('.WKPSC-more-information-show { margin-top: 40px; margin-bottom: -10px !important; display:block; }');
}

/*
 * Reviews page
 */
function reviews_init()
{
    GM_addStyle('.WKPSC-hiragana { font-weight: normal; }');
    GM_addStyle('.WKPSC-more-information-button-margin { margin-bottom: 0 !important; display:block; }');
    GM_addStyle('span.reading-highlight { background-color: #474747; } span.kanji-highlight { background-color: #FF00AA; };');
    GM_addStyle('span.reading-highlight, span.kanji-highlight {-moz-box-sizing: border-box; border-radius: 3px; box-shadow: 0 -3px 0 rgba(0, 0, 0, 0.2) inset, 0 0 10px rgba(255, 255, 255, 0.5); color: #FFFFFF; display: inline-block; height: 1.8em; line-height: 1.7em; text-align: center; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); padding-left: 3px; padding-right: 3px; }');

    GM_addStyle('.WKPSC-more-information-show { margin-top: 20px; margin-bottom: -10px !important; display:block; }');
}

lessons_init = reviews_init;

/* Snatched from the stroke order script ... */
/*
 * Returns the current kanji
 */
function getKanji()
{
    switch(curPage)
    {
        case PageEnum.kanji:
            return document.title[document.title.length - 1];

        case PageEnum.reviews:
            var curItem = $.jStorage.get("currentItem");

            if ("kan" in curItem)
                return curItem.kan.trim();
            else
                return null;

        case PageEnum.lessons:
            var kanjiNode = $("#character");

            if (kanjiNode === undefined || kanjiNode === null)
                return null;

            return kanjiNode.text().trim();
    }

    return null;
}

/*
 * Init Functions
 * Set up the hooks needed.
 */
function scriptEventFired(node)
{
    try
    {
        scriptLog("Event fired!");
        addElement(node);
    }
    catch(err)
    {
        logError(err);
    }
}

function scriptInit()
{
    // Add global CSS styles
    GM_addStyle('.WKPSC-more-information-button { color: #888888; cursor: pointer; text-align: center; background-image: url("/assets/default-v2/top-inset-shadow-290f5bd0a4f35ec34dd42c6c1f56a2f3.png"); background-position: center top; background-repeat: no-repeat; margin-top: 15px;} }');
    GM_addStyle('.WKPSC-more-information-hidden { display:block; visibility:hidden; height:0; }');

    scriptLog("loaded");

    // Set up hooks
    try
    {
        if (/\/kanji\/./.test(document.URL)) /* Kanji Pages */
        {
            scriptLog("Kanji Page");
            curPage = PageEnum.kanji;

            kanjiInfo_init();
            addElement();
        }
        else if (/\/review/.test(document.URL)) /* Reviews Pages */
        {
            scriptLog("Reviews page");
            curPage = PageEnum.reviews;

            reviews_init();

            var o = new MutationObserver( function(mutations) {
                // The last one always has 2 mutations, so let's use that
                if (mutations.length != 2)
                    return;

                scriptEventFired($("section[id=item-info-reading-mnemonic]"));
            });

            o.observe(document.getElementById('item-info'), {'attributes' : true});
        }
        else if (/\/lesson/.test(document.URL)) /* Lessons Pages */
        {
            scriptLog("Lessons page");
            curPage = PageEnum.lessons;

            lessons_init();

            var o2 = new MutationObserver( function(mutations) {
                scriptEventFired($("li.active"));
            });

            o2.observe(document.getElementById('supplement-kan'), {'attributes' : true});
        }
    }
    catch(err)
    {
        logError(err);
    }
}

/*
 * Helper Functions/Variables
 */


function isEmpty(value){
    return (typeof value === "undefined" || value === null);
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

/*
 * Error handling
 * Can use 'error.stack', not cross-browser (though it should work on Firefox and Chrome)
 */
function logError(error)
{
    var stackMessage = "";

    if ("stack" in error)
        stackMessage = "\n\tStack: " + error.stack;

    console.error(scriptShortName + " Error: " + error.name + "\n\tMessage: " + error.message + stackMessage);
}


/*
 * Start the script
 */
scriptInit();
