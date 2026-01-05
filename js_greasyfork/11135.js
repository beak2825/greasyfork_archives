// ==UserScript==
// @author			mungushume
// @version			1.7.3.1
// @name			GoogleMonkeyR
// @namespace		http://www.monkeyr.com
// @description		This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @include			http://www.google.*/webhp?*
// @include			http://www.google.*/search?*
// @include			http://www.google.*/ig?*
// @include			http://www.google.*/
// @include			http://www.google.*/#*
// @include			https://www.google.*/webhp?*
// @include			https://www.google.*/search?*
// @include			https://www.google.*/ig?*
// @include			https://www.google.*/
// @include			https://www.google.*/#*
// @include			https://encrypted.google.*/webhp?*
// @include			https://encrypted.google.*/search?*
// @include			https://encrypted.google.*/ig?*
// @include			https://encrypted.google.*/
// @include			https://encrypted.google.*/#*
// @grant			GM_registerMenuCommand
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_xmlhttpRequest
// @uso:script		9310
// @scriptsource	http://userscripts.org/scripts/show/9310
// @scriptsource	http://google.monkeyr.com/script/1.7.0/googlemonkeyr.user.js
/* StartHistory

v.1.7.3 - 23 Jul 2015 - by Kilvoctu
  - Bug fix: Showing search results after Google changes
 
v.1.7.2 - 31 Aug 2014 - by Boltex 
  - Bug fix: Google Changes in wdith in some divs
  - Feature: Remove next page link and loading image. 
  *note* - If the results of the your search will go beyond the screen, 
  you must find and change resolution. Find 1240px and change to your value. 

v.1.7.1 - 26 Mar 2014 - by Boltex
 - Bug fix: Calculator results (single result) pages now work properly

v1.7.0 - 01 Nov 2013
 - Bug fix: Google changes in some tlds fix for display issues

v1.6.9 - 15 Aug 2013 beta
 - Bug fix: Google changes in some tlds (all at some point in the near future)
 made the results not fill the screen width. One little css tweak to fix!

v1.6.8 - 14 May 2013 beta
 - Bug fix: Calculator results (single result) pages now work properly
 - Feature: Results numbered in news searches (if enabled).
 - Feature: Added a next page link to the loading image when auto load is
 enabled. This allows you to carry on with your search even if the auto load
 fails. Suggested by Isuzu.
 - Bug fix: When changing search method (browser toolbar to google search box)
 results from the original search could leak through.

v1.6.7 - 29 Apr 2013 beta
 - Feature: Right hand panel is now handled as a flyout tab.
 - Bug fix: Changes to the result processing trigger. Hopefully it will
 catch more iterations
 - Feature: Loads more logging options (internal use for now)
 - Bug fix: On failure to process results properly (no results displayed)
 a result request run state won't occur i.e. No flood of requests to
 google, resulting in a capcha being displayed.

v1.6.6 - 26 Apr 2013
 - Checkout the changes from v1.6.4 unless you've been upgrading manually!
 - Bug fix: "Sponsored Links" ad removal on rhs
 - Bug fix: white-space:nowrap causing divs to overlap
 - Feature: back to top link now uses CSS transitions

v1.6.5 - 26 Apr 2013
 - Bug fix: Showing of favicons for https results and results with port
 numbers
 - Bug fix: A fix for google chrome's DOM event limitations
 - Bug fix: A fix for chrome's horrible way of dealing with the lack of
 GM_getValue and GM_setValue functions. What were they thinking?!

v1.6.4 - 25 Apr 2013
 - Bug fix: Showing results after google changes approx 24 Apr 2013
    Fixed trackless links
    Fixed favicons and GooglePreview
    Fixed "Sponsored Links" ad removal
 - Feature: Addition of back to top link when autoload results is selected and
 scrolled down the page a way

v1.6.3 - 21 Mar 2013
 - Bug fix: Only remove the left results margin if more than one column of
  results is selected.
 - Bug fix: Searches Related to only moved to the top if autoload more results
  is selected.

v1.6.2 - 18 Jan 2013
 - Bug fix: Missing GoogleMonkeyR options on /webhp? pages
 - Bug fix: Result positioning on all pages
 - Bug fix: Currency conversions were being hidden. Thanks cip
 - Bug fix: Searches related to moved to top
 - Bug fix: "Don't display the Google web search dialogues" corrected position
 of preferences link
 - Bug fix: loading animation not displaying on google instant further
 searches. Thanks smk
 - Bug fix: Sublink tracking bug. Cheers smk!
 - Bug fix: Rollover of images in general results now shows an enlarged version
 of the image. Thanks r600
 - Feature: Removal of remove "Search Tools" as its now obsolete
 - Feature: Addition of remove "Right Panel" setting

v1.6.1 - 14 Jan 2013
 - Bug fix: Missing Fav icons on first results
 - Bug fix: Missing preview images on first results
 - Bug fix: Missing open in new tab/window on first results

v1.6.0 - 17 Dec 2012
 - Bug fix: Page width with autoload more results enabled
 - Bug fix: Inline numbered results
 - Bug fix: No results on image searches
 - Bug fix: Settings link enabled eveywhere (hopefully)
 - Bug fix: GM_functions being overwritten. thanks derjanb

v1.5.4.5 beta - 13 Dec 2011 - USE THIS ONLY IF YOU HAVE THE NEW GOOGLE TOOLBAR!
 - Feature: Now works with google instant. Modded the google instant code to
 work with Chrome.

v1.5.4.4 beta - 13 Dec 2011 - USE THIS ONLY IF YOU HAVE THE NEW GOOGLE TOOLBAR!
 - Feature: Now works with google instant. Almost fried my head doing it and the
 code isn't pretty but it seems quite stable. Your feedback is welcomed!

v1.5.4.3 beta - 10 Dec 2011 - USE THIS ONLY IF YOU HAVE THE NEW GOOGLE TOOLBAR!
 - Security: Using favicons or imagepreview on a secure (https) google search
 page would expose those urls to the unencrypted version of google therefore
 breaking the security of the page. This occured due to an oversite on my part
 and i sincerely apologise. Special thanks to semur5 for idenitfying the issue!

v1.5.4.2 beta - 9 Dec 2011 - USE THIS ONLY IF YOU HAVE THE NEW GOOGLE TOOLBAR!
 - Feature: Sublink tracking now respects your choice in the preferences.
 Trackless links are also added when Disable Google Tracking is disabled. Thanks
 @smk for your input!

v1.5.4.1 beta - 8 Dec 2011
 - Feature: When "Don't display the Google web search dialogues" is checked with
 the new Google toolbar, elements are moved around to maximise your screen real
 estate. USE THIS ONLY IF YOU HAVE THE NEW GOOGLE TOOLBAR!

v1.5.4 - 6 Dec 2011
 - Bug fix: GoogleMonkeyR preferences link moved after googles update to the
 menu bar. Thanks for the info on how to get it digideth!

 Since this Google update i'm unsure what to do about removal of search boxes
 etc. I could start moving elements around on the page but through experience
 i'm sure this will end up breaking the script more often. Not good!
 beta versions (with elements moved around for new toolbar ONLY) can be found
 here http://google.monkeyr.com/ff/history.php

v1.5.3 - 21 Nov 2011
 - Bug fix: Addition of https includes. Thank you @J-Mac!
 - Bug fix: Multiple columns of results were sometimes spilling out of the width
 of the browser (giving horizontal scrollbars). Now Fixed!

v1.5.2 - 5 Oct 2011
 - Bug fix: Repaired top margin on image results. Thanks to trup for the screen
 shot, version info and link to a problem page! Easy to track down bugs when
 this sort of info is provided ;)

v1.5.1 - 5 Oct 2011
 - Bug fix: Repaired Cached and Similar links when Disable Google tracking my
 search results is checked.
 - Bug fix: Altered the position of the Advanced Search link when Don't display
 the Google web search dialogues is checked (works better on smaller screens).
 - Bug fix: Corrected the positioning of elements at the top of the page on
 image searches.
 - Bug fix: Shopping searches now show the your location / sort by top tool bar.
 - Bug fix: Video search now shows thumbnails for auto loaded content.

v1.5 - 25 Sep 2011
 - Bug fix: result container width has been limited in a recent update. Now
 fixed. Thanx @ck0743 and @Phil699 for your patience
 - Bug fix: Various other fixes after the most recent google updates. 4 hours
 coding in all just to get it back to how it was! Deep joy ;)

v1.4.7 - 21 Jul 2011
 - Bug fix: First results we partially hidden when "Don't display the Google
 web search dialogues" was selected
 - Bug fix: Update banner was hidden below the top black bar
 - Bug fix: Removed duplicate did you mean, again! Thanks andi-03!
 - Feature: Now using Google favicons as suggested by None Nosome. Cheers!

v1.4.6 - 9 Jul 2011
 - Bug fix: Missing thumbnail images on subsequent pages of results when auto
 load is enabled.
 - Bug fix: Trackless links fixed. Thanks @eatmorglue!

v1.4.5 - 27 Apr 2011
 - Bug fix: Rejiggle after Google altered some bits on there Australian home
 page. Thanks @daveo76 for reporting this!

v1.4.4 - 20 Feb 2011
 - Bug fix: Missing thumbnail images on subsequent pages of results when auto
 load is enabled

v1.4.3 - 18 Feb 2011
 - Bug fix: Changed the browser (GreaseMonkey) detection method to a more
 generic function. This should stop problems with FF beta v11+.
 Thanks to Babbalucio and Qudeid for identifying the line the error seen in
 FFb11 was occuring.
 - Layout: Hopefully corrected the removal of duplicate "Did you mean?",
 "Showing results for..." and "More results for..." without removing potential
 "No results found for...". One day i'll get it right!)
 - Layout: Corrected positioning of result stats/search dialogue with instant
 search on or off.
 - Bug fix: Updated https @includes for the encrypted subdomain as noted
 by SeeFood. Thanks!

v1.4.2.1 - 17 Feb 2011
 - Layout: Moved settings link under the	options (gear) icon

v1.4.2 - 17 Feb 2011
 - Bug fix: Now works with the new top toolbar

v1.4.1 - 24 Dec 2010
 - Bug fix: Allowed port numbers in the page preview code as per RobinRosengren's
 suggestion. Cheers.

v1.4 beta - 17 Dec 2010
 - Rebuild: Now one script for all browsers (including chrome!) with no
 dependencies on any other scripts (opera)
 - Bug fix: Corrected the positioning of result numbering
 - Bug fix: Removed duplicate did you mean
 - Feature: Now you can remove googles Site Preview feature

v1.3.8.1 beta - 26 May 2010
 - Feature: Changed/updated @includes to allow for https searching as requested
 by auscompgeek

v1.3.8 - 24 May 2010
 - Layout: Position adjustment of loading image and txt for auto load
 - Bug fix: Second "Showing results for" prompt is now removed when Google
 thinks you have misspelled your search term.
 - Bug fix: First "Did you mean" prompt is now removed when Google thinks you
 have misspelled your search term.

v1.3.7 beta - 10 May 2010
 - Bug fix: Certain links in the search tools panel caused a reload of results
 but removed the first chunk of them when auto load was turned on.
 - Bug fix: Display of end of results notification when auto load is enabled.
 - Bug fix: Trackless links were sometimes appearing to early in the results
 when translate this page links occur.
 - Bug fix: "Show more results from" links now open inline as expected.
 - Feature: Update of result stats with auto load enabled.

v1.3.6 - 09 May 2010
 - Bug fix: Duplicate entries when "Auto load more results" is selected. Looks
like i introduced a bug back in v1.3.0 (Oct 09) during a code clean up. I'd
managed to double quote two regex values that may have resulted in duplicates
appearing when your default "Number of Results" returned by Google was anything
other than 10.
 - Bug fix: "More search tools" link removed the first X amount of results from
your search results. Where X is the "Number of results" per page set in your
Google preferences. This has now been resolved.
 - Thank you gauravbaadshah! Your (continued) well presented bug reports are
helping to make GoogleMonkeyR as good as it should be!

v1.3.5 - 08 May 2010
 - Feature: Added the ability to show/remove the "Search Tools" (left panel)
that has appeared in the latest Google update.
 - Bug fix: Selectors updated for trackless links. Should now pick up more
results and create the assosiated trackless links.
 - Bug fix: Repositioning of key elements when preferences remove "Related
Searches", "Sponsored Links" or "Search Tools".

v1.3.4 - 07 May 2010
 - Bug fix: Recent Google changes have been addressed in this update. I hope to
have another update shortly that will address some display issues when auto-load
is used and you approach the bottom of the page.

v1.3.3 - Unreleased
 - Bug fix: All "Did you mean?" prompts were removed when Google thought you had
 misspelled your search term. This is now corrected.
 Thanks to MasterMind33 for the heads up! Appreciated!
 - Bug fix: Trackless links added when Cached/Simlar links don't exist

v1.3.2 - 02 Dec 2009
 - Bug fix: When you follow links with the .../#hl=... type of format the script
 fails to trigger. I've now added the include http://www.google.tld/#*
 Big thanks to Hiromacu for finding the bug!

v1.3.1 - 10 Oct 2009
 - Bug fix: Possible infinite loop bug with /webhp? pages.

v1.3.0 - 09 Oct 2009
 - Bug fix: When searching using the "on page" search dialogs, the script was
 not triggering properly. The fix implemented is only a band-aid and when google
 implement more changes, it will fail. I am working on the issue when i get time
 - Feature: Added an extra option in preferences to remove the "Related
 Search" links that sometimes appear at the top of your search results.
 - Feature: Added an extra option in the preferences to select the flow
 direction of your results when you use multiple columns. Either left to right
 or top to bottom newspaper style. If you use "Auto-load" the newspaper style
 is automatically paginated to try and keep some clarity in your results.
 - Bug fix: Added the include for "/ig?*" urls (iGoogle)
 - Cleanup: Reduced the amount of code for the creation and styling of elements
 using the function document.buildElement
 - Feature: Now works on "/webhp?*" search urls
  Thanks to gauravbaadshah for pointing this out!
 - Bug fix: Removed Googles results width limiting

v1.2.0 - 02 Jun 2009
 - Bug fix: The display of favicons for https links has been removed to stop
 invalid certificate warnings whilst searching.
 - Bug fix: Error removed when the main link of a result can't be found.
 - Feature: Site description text of each search result, when one column of
 results is selected, is increased to 95% of the containing cell width as this
 seems to be more readable. Two or more columns of results is unchanged as i
 found the data appeared to be more cluttered.
  As requested by The_Steph.
 - Bug fix(ish): Google personalised search (Promote, Remove) functionality
 will now work on the initially loaded page of results. All further results
 loaded dynamically using the "Auto load" option will NOT!
 - Bug fix: "End of search results" wasn't showing up when you'd reached the
 end of the results. Now fixed.
 - Bug fix: Removal of duplicate "Did you mean:" links at the top of search
 results when you've misspelled your search term(s).

v1.1.1.2 - 22 Nov 2008
 - Bug fix: Another fix for the latest Google changes. Hopefully across the
 board this time.

v1.1.1.1 - 21 Nov 2008
 - Bug fix: Quick (ish) fix for the latest Google changes. Sorry on my hols!)

v1.1.1.0 - 03 Nov 2008
 - Feature: Addition of favicons next to the main link. Configurable via a
 checkbox in the preferences.
  As requested by Pierre75007.

v1.1.0.0 - 03 Nov 2008
 - Feature: Addition of GooglePreview images in your search results. Open up the
 GoogleMonkeyR preferences to turn this feature on.
  As requested by Nasir Jones.
 - Bug fix: Open in new target now overpowers any settings specified in your
 Google preferences.

v1.0.9.1 - 30 Oct 2008
 - Bug fix: Ooops. I messed up the z-index of the preferences screen in the last
 version. It was appearing behind the blocker. All fixed in this update.

v1.0.9 - 30 Oct 2008
 - Feature: Moved the related searches and blog entries etc. to the top of the
 results.
 - Cleanup: Commented out a GM_log entry i left in in the last update.
 - Bug fix: Version comparison now compares numbers rather than strings. Ooops.
 - Bug fix: Base numbering of 2nd, 3rd, 4th... pages of results restored (when
 auto load more results is turned off).

v1.0.8.9 - 23 Oct 2008
 - Bug fix: Auto load more results is back up and running. Google has removed
 the id attribute from the Next link at the bottom of their results page. Had
 to find it a different way.
 - Cleanup: encodeURI of the history information. (to maybe help with the crash)
 - Cleanup: Removal of an extra preferences bind that seems to have crept in
 at the end of the script (to maybe help with the crash)

v1.0.8.8 - 14 Oct 2008
 - Bug fix: Results table and column widths should now be more stable. Less
 re-sizing as links are clicked and/or more results auto-load.
 - Bug fix: Refined the stylesheet code that gives the results the background
 hue. This was to stop other elements getting the same hue.
 - Bug fix: Added trackless link to each result regardless of whether your
 logged into a Google account or not.
 - Bug fix: With the google search dialogs removed sometimes a message reading
 "Personalized based on your web history." overlays the GoogleMonkeyR link.
 This has now been adjusted to sit below the links.
 - Cleanup: XPath functions added to the document object.

v1.0.8.7 - 05 Oct 2008
 - Cleanup: Change of the update url to point at the script meta file
 "http://userscripts.org/scripts/source/9310.meta.js"
 this will reduce the bandwidth to/from userscripts.org and speed up checks
 - Cleanup: Change of several method names to aid readability
 - Cleanup: "Update bar" code re-written more cleanly

v1.0.8.6 - 01 Oct 2008
 - Cleanup: Change of includes to use "Magic top-level domains" instead of *'s
 see http://wiki.greasespot.net/Magic_TLD for more info
 - Cleanup: Change of update script to pick up history text more cleanly

v1.0.8.5 bug fix - 25 Sep 2008
 - Bug fix: History update fix 2

v1.0.8.4 bug fix - 25 Sep 2008
 - Bug fix: History update fix

v1.0.8.3 bug fix - 23 Sep 2008
 - Bug fix: Final fix with the auto update script

v1.0.8.2 bug fix - 23 Sep 2008
 - Bug fix: Another small bug fix with the auto update script

v1.0.8.1 bug fix - 23 Sep 2008
 - Bug fix: Small bug fix with the auto update script

v1.0.8 - 23 Sep 2008
 - Feature: The update feature of the script has been completely re-written
 to notify the user when there are future updates. This update mechanism
 will also work if (and when) Google decide to change their DOM again! The
 basis for this update method comes from the "UserScript Update Notification"
 script from Seifer. This code has been heavily modified and expanded for
 the GoogleMonkeyR script.

v1.0.7 bug fix - 17 Sep 2008
 - Bug fix: Roll up pack of bug fixes. Should be ok for now!

v1.0.6.3 beta bug fix - 21 Aug 2008
 - Bug fix: Some localisations of Google changed again on the 19th Aug. The DOM structure has again
 	been modified. Oh when will they stop messing with it?

v1.0.6.2 beta bug fix - 13 Aug 2008
 - Bug fix: Some localisations of Google changed again on the 12th Aug. The DOM structure has again
 	been modified. More changes to follow? I hope not!
 	This is a beta update to fix these problems but may have its own bugs!!!
 - Feature: Added ability to change the background hue or the border color of the search results

v1.0.6.1 beta bug fix - 01 Aug 2008
 - Bug fix: Some localisations of Google changed on the 31st July.
 	The DOM structure was quite heavily modified and somehow they messed up the
 	scroll to bottom of page detection.
 	This is a beta update to fix these problems but may have its own bugs!!!
 - Bug fix: Autoload would flood requests to Google for the next page of results.
 	Now only one request is sent until a response is received
 - Bug fix: Background hue now defaults to transparent rather than white.
 	Thanks to Lil Junior for the suggestion!

v1.0.6 - 19 Apr 2008
 - Bug fix: Corrected the display of the preferences screen in Firefox 3
 - Bug fix: Corrected the removal of web search dialogs (after an update on google)
 - Bug fix: Natural numbering of 2nd, 3rd, 4th... pages of results.
 	Thanks to theMoJo for the natural numbering sample code!

v1.0.5 - 24 Oct 2007
 - Bug fix: Natural indentation of multiple results from the same site restored
 - Bug fix: Google news entries within results no longer breaks the layout and numbering
 - Feature: Added ability to change (or remove) the background hue of the search results
 	NB* Color picker code borrowed, then heavily modified, from Flooble.com

v1.0.4 - 25 May 2007
 - Bug fix: Removed the visually anoying bug where when you clicked on a "long" link it resized the whole
 	cell container before taking you to your link. Grrrr.

v1.0.3 - 20 May 2007
 - Bug fix: "Open results in a new target" would only work for the initially loaded results, not subsequent
 	additions by the auto loader
 - Bug fix: Limit the column width to always fit on screen without scroll. As requested by Edward Rapley
 	NB* This fix only works when your being reasonable! If you want 4 columns of results on an 800x600
 		screen you'll have trouble. Works best with the "Sponsored Links" removed
 - Feature: Added an entry to the Greasemonkey user script commands to allow opening of the GoogleMonkeyR
 	preferences. This is just in case Google decide to alter their site in a way that removes the
 	GoogleMonkeyR link from the top of the page.
 - Feature: Ability to disable Google tracking your search results
 	NB* Every time you click a link in your search results, the click gets reported back to Google for
 		their statisticians to ponder over. If you are signed in to a Google account this click will
 		be recorded in your search history. This allows you to remove this reporting to Google.
 - Feature: When the Disable Google tracking option is not active, an extra "Trackless" link is added
 	in the "Cached", "Similar pages" links of each of the search results, so you can decide whether
 	to be tracked at the time!

v1.0.2 - 18 May 2007
 - Now uses userscripts.org as the download location for future updates

v1.0.1 - 16 May 2007
 - clean up of the code to use more of the this keyword rather than working round the issue by using the
 	document as a patsy

EndHistory */
// @downloadURL https://update.greasyfork.org/scripts/11135/GoogleMonkeyR.user.js
// @updateURL https://update.greasyfork.org/scripts/11135/GoogleMonkeyR.meta.js
// ==/UserScript==
