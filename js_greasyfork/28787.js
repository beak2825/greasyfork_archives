// ==UserScript==
// @name        Airdates.tv enhancer
// @namespace   V@no
// @author      V@no
// @description 2.5 tons of enhancements
// @include     http://www.airdates.tv/*
// @include     https://www.airdates.tv/*
// @include     /^https?:\/\/(www\.)?disqus(cdn)?\.com\/embed\/comments\/.*$/
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAADv0lEQVRYw+1Wv08jVxD+Zt7uWy92jOMjh6ULBUkHVbiU5A9If6LKSUdqUNLQsnIKlC7FgZQmoqFCgvQoQog0F0EXqNOQAsjZHBL22t43k8K7iw25S5OcpeRGGu3b3TfvzXzzE3hHIybKFlEU0dzc3Henp6flOI4BQI0xaozRTqfDzjl4nqciAlWlJEkAAKqKIAhgjFEAYGaoqhLlR7PneVQqlZiZsbS09GxQAe+OMp8BmEjfBYCmzOk3HdhLA7I68A931pyyeSMUURTx4uJisrOzo+041nYca6/3jTpH6hypOig5lzM7KDtWdqyLPyyqI5ezAOqI1BEpSJXhlOH0yZOfdX19/ep1CMA5B1UFp/AREZhvjdEciMxESeEgsPKQQaSaYyWpnO/be4bnUvV6XYwxYGa8TRq6LQ2w0SlQrVYRhuHoFEjTaXQKtFot9Hq9f+0yEfdmBay1o0Vg5EGYJAlE5L+LgHP3jXu7VefvEMhK8cgUYGYMtNF/nMQlr1cgiiLudDpYXVUEgUUQWJTfKyIMawjDGqgICN8yjQG1sIZaWMOPv1bBgpwL1QcoTE6iMDkJFUC1C9Uuvvr6Prp5N5ydnaWzs7MhFygI4+P999gA1BoQrPhQSXsiC3QAuPehQwNBt9t/Jsn9IMzFtre3w/39/Yubm5tis9mEiFAQBP1NRNA+IeuYxhhYazX9RwAQx3GWyuR5HlQ1iysNggDT09OYmpq6vry8fFCv190QAvPz89/u7u6WDg4OUCgU0Gw2USqVAACFQgHn5+dERDDG5LVCREhEEAQBrLVoNpuoVqsQEVhr0Wg0wMwolUqkqri6ukIQBOOVSqUI4DpH4OTkxK6urnaOjo4A3GZDt9uFqkJEUC6X+25RharC932ICJxzeQHzfR/WWlhr0Wq1QEQgIvi+D1VFkiRoNBpYXl52a2trHgDQ8fGxv7m5+dvFxcWjDLJMiawwZQd5ngdjDB4//gSe56NcLsMYg3a7jRcvfkGxWAQR5QiFYQjf9zN3YWxsDBMTEyiXy2DmYGFhoevNzMx82m63HxWLxSELkyTpj2fphJT5HwDirgMnirjzEsQMZsL0Rx/j+tVVNhUPp7MCKn3jer0ekiQBEXWiKDLe1tYW7e3t5RGZWZtxKp8e1I/uw8PDv8hyxcOuwv/8FX7/qZLLqQjCKUHhYQ9/fPAlkufPoalLv3j6tB8DKysrz+I4/rA/zlN2nzAzRCRH4U6jYmRTKcBEpESk2X4RGSpyaaZk3xJV/X5jY+Ml3tH/nv4E5KQFif7uYoAAAAAASUVORK5CYII=
// @license     MIT
// @version     1.73b5
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28787/Airdatestv%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/28787/Airdatestv%20enhancer.meta.js
// ==/UserScript==

//tab = 2 spaces

/*global DB, GM_info, DISQUS, device, Colors, assignColor, loadColor, engines, ymToday, ym2str, coalesce, markSearchResults, search, updateSelectedOnly, readCookieRaw, loadArchiveFromPathname, hashChanged, require, HTMLDocument*/
/*jshint supernew: true, globals: true, evil: true, loopfunc: true, jquery: true, boss: true, expr: true, devel: true, strict: global, scripturl: true, -W018, -W014*/

"use strict";

var changesLogText = multiline(function(){/*
<span class="warning info">if all your settings are lost after website upgrade to secure connection on Oct 13, 2019,</span>
<span class="warning info">go to <a href="http://www.airdates.tv/legacy_cookies#backupsettings" target="_blank">this</a> page and backup your settings, then you can restore them in <a href="#settings">options</a></span>

1.73b5 (2021-10-08)
	+ restrict maximum width of the content (helps for wide resolution monitors)
	! "collapse multiple" would collapse "premiere" or "returning" shows if there is an episode without season before it
	! clicking on search link at the header would show arrow pointing at the searchbar without animation until page refreshed.
	* clean up for jslint
//enableEpDateFixMenu

1.73b4 (2021-07-25)
	+ setting to activate date offset
	+ date offset of displays in tooltip which episode it's inherit current position
	+ filter in changes log by clicking at legend titles
	+ archive date to website title
	! disqus reload button didn't scroll down properly
	! disqus message count didn't work
	! disqus theme didn't change together with main site
	! opened details would get closed when "today" is changed
	! date offset + time offset = incorrect date offset position
	! errors on "_u" pages
	* changes log will not longer popup when script first installed or when localStorage data deleted
	* legend in changes log is always visible
	- ability enable/disable episode offset feature via #epdatefix0 and #epdatefix1 hashtags
	- disqus recommendations b.s.
	? date offset + collapsemulti = hidden/incorrect title

1.73b3 (2020-12-13)
	+ hide "Also on" section of disqus
1.73b2 (2020-10-15)
	+ ability set date offset for episodes
	! wrong svg icons color on light background
1.72.2 (2020-10-10)
	! watched filter didn't work properly when show highlighted by search or marked as new/returned
1.72.1 (2020-10-10)
	* tooltip on watched checkboxes now show additional info if SHIFT+click available
1.72 (2020-10-10)
	+ while "Show all episodes" list is opened, holding SHIFT key and clicking on "watched" checkbox will select/deselect all previous episodes
	+ filter to hide watched episodes
	! duplicate week days for custom shows were not removed and not in order
	! in some browsers (Tor Browser) after clicking left mouse button on a link that opens link in a new tab it would delete some of the user settings (that was some WTF bug)
1.71 (2020-06-26)
	+ new option "number of opisodes per day" for custom shows
	! menu popup did not change size with page zoom
1.70.1 (2020-05-13)
	! links incorrectly selected for middle click in some cases
	! watched incorrectly set on shows with changed "Episode # offset"
1.70 (2020-05-08)
	+ date of content's last update at the bottom of the page
	* table min width decreased to allow display without scrollbars on low resolution screens
	! old unused settings were not deleted
	! messages under search bar displayed in one line
	! custom links not properly sorted
1.69 (2020-03-18)
	* option "Sunday is first day of the week" changed to "First day of the week" with ability select Monday, Sunday or Saturday.
	! missing days in the past in some situations
1.68 (2020-03-13)
	+ option "Sunday is first day of the week"
	! some show's name incorrectly truncated in links in the search result
1.67 (2020-02-02)
	+ ability change some colors of the website
	+ ability enter RGB and HSB values in colorpicker
	! accounts with hundreds "my shows" could fail properly sort shows
	! colorpicker not shown in Custom Shows settings
1.66.1 (2020-01-14)
	! option's misalignment in default theme
	* color picker for today's color now shows the color value in option's field
1.66 (2020-01-14)
	+ option for today's color
1.65.2 (2020-01-12)
	! error when trying open an item when searched for info:myshows
	* today's color in dark theme to orange
1.65.1 (2020-01-12)
	! account popup would show up after closing secondary popup via X icon (options, custom shows, etc)
	! my shows on top shown in wrong ordered
	* improved my show on top sorting performance
1.65 (2020-01-1)
	+ option to show "My Shows" on top of the list
1.64.1 (2020-01-06)
	! middle click on a show would not open selected links
1.64 (2020-01-04)
	+ new tags for custom links: {YEAR}, {MONTH}, {DAY}
1.63.2 (2020-01-04)
	* it's possible now add custom show without specifying season
1.63.1 (2020-01-04)
	! custom shows with day of the week would not set correct date with time offset activated
	* horizontal scrollbar shown in Custom Shows popup
1.63 (2020-01-03)
	+ prompt's buttons now highlighted when cursor over
	+ option to make popups more stand out by bluring background around them
	+ ability specify day of the week of a custom show
	! horizontal scrollbar shown in Links Manager
	! account popup not dimmed when import/export colors prompt opened
	* when popups are opened, page scroll is disabled
1.62.2 (2019-10-24)
	! fixed missing weeks
1.62.1 (2019-10-24)
	+ tooltip for "go to the top" button
	! leave archive bottom link was not scroll to the top
1.62 (2019-10-24)
	+ jump to the top button
	+ option to show next/prev month buttons under calendar
	! some color issue in changes log with dark theme
	! prompt to enter a date to jump to (when clicked on archive's date) was not showing correct currently viewing date
1.61.2 (2019-10-20)
	+ information about server upgrade inside changes log and what to do
1.61.1 (2019-10-13)
	+ #backupsettings to the link under search bar
	! link in disqus comments to non-secure website with a hashtag command would execute command instead of opening webpage
1.61 (2019-10-13)
	+ added hashtag command #backupsettings
1.60.4 (2019-10-13)
	+ tooltip explaining how user's colors saved
	! links favicons used insecured connection
1.60.3 (2019-07-14)
	+ main menu icon instead of "Account" link
	! Sunday column would wrap under Saturday in small windows
	* cookies icon for guests
1.60.2 (2019-07-14)
	+ search icons
	! cookies that store guest's colors will no longer expire
	* search bar placeholder to "Find Show ..."
	* text "Account" to "Tools" on main menu link
1.60.1 (2019-03-31)
	! watched checkbox was removed from first custom show of the week when new day started
1.60 (2019-03-04)
	+ ADEU keyword in disqus
	! disqus troll script would not initialize on new comments which were loaded without page refresh
	* custom shows link no longer shown when viewing as another user
1.59 (2018-12-09)
	+ ability add custom icon for each link (can be an URL or "data:" type)
	+ option to change how custom colors displayed: use all available width or wrap in 7 per line
	! some changes links manager would not reflect in opened details of a show
	! improved drag'n drop in links manager
	! greatly improved performance during changing number of custom colors to display in settings
	* quick colors and link's icons are now scalable with page zoom in Waterfox
	* replaced color picker icon with a SVG, which allows to be scaled without compromising quality
1.58.1 (2018-12-02)
	! in some situations all days disappear
	! search bar not centered
1.58 (2018-12-02)
	+ ability change order in list of all episodes of a show
1.57 (2018-11-20)
	+ after an update changes log highlights changes between new and old versions
	! "My Shows" displayed duplicate entries when settings where restored from old backups
	! deleted custom show has "edit" link in "My Shows" list, producing error in console
	! newly added custom color wasn't pre-selected
1.56.1 (2018-11-18)
	* selected color in quick color picks now shows rounded
1.56 (2018-11-18)
	+ changes log shown after update (can be disabled via checkbox in top-right corner)
	+ quick color picks shows which one is the current color
	! after a link was changed, middle click on a show would use old data for the selected links
	! links manager missing cursor-over indicator on edit/delete buttons
	! custom show name field shown as "error" after "clear" button used
1.55.2 (2018-11-10)
	! settings restore could create duplicate custom shows
	! clicking on disqus notification icon would not open the notification panel
1.55.1 (2018-11-10)
	! search by name failed find custom shows
	* custom shows no longer displayed as duplicate if original show with exact same name + season + episode already exists in the same day
1.55 (2018-11-10)
	+ tooltips on quick color pick
	+ option to change displayed number of custom colors
	+ when editing a custom show, if name changed to an existing show, the submit button label changes to "Merge", the name in the list changes color to red and the show it will be merged with changes to green
	! color box of a last in the list custom show would display outside of the area, requiring user to scroll
	! clicking edit link on custom show from search results would not highlight line in episodes data
	! when colors box opened in custom shows popup, escape button closes the color box instead of whole custom shows popup
	! clicking outside of color box in "Custom shows" could activate other actions on clicked element
	* increased number of custom colors to remember from 7 to 100
	* when color box in "Custom shows" list is opened, popup around of it fades and hovering cursor over other elements on the page no longer trigger anything
1.54.2 (2018-11-07)
	! number of weeks ignored if number of past weeks changed immediately after number of weeks changed from "All" to any number
1.54.1 (2018-11-07)
	! incorrect number of weeks shown in search results
1.54 (2018-11-07)
	+ option to limit how many weeks to show (past weeks are included into the count)
	* increased number of past weeks to 5
1.53.2 (2018-11-06)
	! disqus trolls script didn't work
1.53.1 (2018-11-06)
	! custom show's color box was displayed on it's own line in older browsers
1.53 (2018-11-06)
	+ colors in custom shows list
	+ clicking "Edit" on custom show from details dropdown automatically highlights the episode data line
	! collapse multiple didn't work on added/updated shows without page refresh
	! some icons in details dropdown were black on dark background
	* if custom show name matches any existing custom shows, it automatically highlighted and currently selected one shows as crossed off (because it would be merged with the matched one)
	* season/episode number is no longer restricted to max 99
1.52 (2018-11-05)
	+ when editing a custom show and name changed to unique, it's now possible add it as a new show or update existing
	+ "More info" state in custom show editor is now remembered
	* any field that prevent custom show from submitting is now highlighted
1.51.1 (2018-11-05)
	! custom shows not shown in past weeks
1.51 (2018-11-04)
	+ new show episode data fields are now can be separated by any character(s) that is not 0-9, date also may be spited as separate year, month and day
	+ visual aid in the custom shows list highlighting affected item after submitting data
	+ more explanation about episode data format
	+ Custom shows form changes label on submit button to reflect if a show being edited or a new show will be created
	+ arrow keys in custom shows list would select for editing next/prev show
	! text-shadow on titles highlighted by search would affect new/returning tags, producing unreadable text
	! clicking "Show all episodes" from "My Shows" list would not properly display list of episodes
	! missing "Edit" link in for custom shows in "My shows" list
	! white icon in show's details in search results
	* new show episodes data fields are now showing evenly spaced
1.50 (2018-11-03)
	+ backup/restore custom shows
1.49 (2018-11-03)
	+ if custom show fields are empty, deleting a show would fill up the fields with information from deleted show
1.48.1 (2018-11-03)
	! myshow list would not update new name of custom shows
1.48 (2018-11-03)
	+ ability add custom shows
	+ text shadow on highlighted (rainbow) search results
	! in some cases script totally failed, due to work around for SVG images showing too large while page is still loading.
1.47 (2018-10-19)
	+ links regex now applied to the entire url, but only if MONKEY_REGEXP or MONKEY_N_REGEXP tags were not used
	! MagnetDL links included unnecessary / at the end search keyword
1.46.2 (2018-10-19)
	! horizontal scrollbar shown when links manager is overflowing
	! submit button not disabled after new link was submitted
1.46.1 (2018-10-19)
	! issues after a link was created and deleted without page refresh
1.46 (2018-10-18)
	+ ability add <a href="https://www.w3schools.com/jsref/jsref_obj_regexp.asp" target="_blank">regular expressions</a> filters to links (one regexp per line)
	! edit buttons not shown in links manager in some browsers
	! edited link would fail in opened show details
	! in older browsers show details would not open on first click and episode offset would fail
	! MagnetDL links
1.45.3 (2018-10-02)
	! track today not working when 1st of the month is Monday
1.45.2 (2018-09-29)
	! missing comments reload button in some browsers
	! black comments reload icon in dark theme
1.45.1 (2018-08-12)
	! filter checkboxes were too close to each other
1.45 (2018-08-12)
	+ clicking on logo changes theme
	! JS errors at login page
	* tweaked colors of day's date in dark theme
	* changed theme handling/selection in options, this will allow user add custom themes in the future
1.44.2 (2018-07-19)
	! loading icon when clicked at disqus notification badge would hide prematurely before notification window opened.
	! disqus badge routine start multiple timers
1.44.1 (2018-07-15)
	! dark theme looked bad in archive
	* tweaked the look of notification badge
1.44 (2018-07-15)
	+ disqus message notification badge on top of the page
	+ colorpicker set to last used color if current show has no assigned color
1.43.1 (2018-07-14)
	! colorpicker stops working if used at search results
	! on small screens sundays would move underneath of saturday when search is active
	! when myshows list is opened, adding/removing a show would not reflect at the list
1.43 (2018-07-14)
	+ remember and show last 7 custom colors as quick pick, they can be removed via middle click
	! main input hex color in colopicker would fail
	* updated logo with less outline on darker theme
1.42 (2018-07-14)
	+ updated logo, it now looks good with any background.
	! disqus would not show text after switching theme without page refresh
1.41 (2018-07-13)
	+ dark theme build-in
1.40.2 (2018-07-13)
	* better support for dark themes
1.40.1 (2018-07-10)
	! on small screens sundays would move underneath of saturday
	* opened show border now obeys color of the text
1.40 (2018-07-09)
	+ episode season number offset
1.39 (2018-07-09)
	+ episode number offset
	! script fails on some pages displaying huge characters (i.e. login page)
	! in some browsers it shows huge "something" while page still loading
1.38.3 (2018-05-26)
	! collapse multiple failed at midnight when enabled "Track today"
1.38.2 (2018-04-23)
	! Show details would not open
1.38.1 (2018-04-22)
	* clean up saved settings (remove any non-existing or with missmatched type settings)
1.38 (2018-04-16)
	+ option to track today (feature introduced in v 1.35)
1.37.4 (2018-04-15)
	! MS Edge compatibility
1.37.3 (2018-04-13)
	! if episode is in the past and hidden via "show past weeks" setting, clicking on "Show in calendar" from search result would not reveal the episode.
	* if getting name of same show failed, next attempt will be possible only after 1 hour
	* if getting name of a show failed during period of 4 weeks, the show will be removed from the account.
1.37.2 (2018-03-27)
	+ enter key now submits form in links manager
	! left click on links didn't work
	! links with empty URL field no longer accepted
	* undo message after clear colors/hidde or watched list now visible even when page scrolled down
	* when viewing as different user, links to clear colors/hidden and watched lists are no longer visible
	* Add and Reset buttons in links manager renamed to Submit and Clear
1.37.1 (2018-03-25)
	! broken my shows list in Firefox
	* renamed "Show hidden" checkbox to "Hidden shows"
1.37 (2018-03-23)
	+ reload disqus button
	! clicking on engine's checkboxes would open the engine link
1.36.3 (2018-03-18)
	! errors in console in MS Edge
1.36.2 (2018-03-18)
	! in certain situations changing time offset would break collapse multiple
	! auto scroll setting were inverted on page refresh
	* settings "Scroll on search" renamed to "Auto scroll to the top"
1.36.1 (2018-03-18)
	! in certain situations changing time offset would break collapse multiple
1.36 (2018-03-18)
	+ links to Wikipedia in search result
	+ information about shows stored in local storage, now included in settings backup
	! 1.35 broke disqus
	! links to airdates hashtags mistakenly opened in new tab if hashtag was was after domain name instead of /
	! invalid colors would display show with white text
	! searches that include info:A-Z no longer sent to server
	! info:myshows didn't list shows without name
1.35 (2018-03-17)
	+ today automatically changes at midnight without page refresh and updates listing of current month
	! possible open multiple popups via hashtags
	* back button now shows on popups opened via hashtag
1.34.1 (2018-03-15)
	! search result had too much empty space on top
	! link under search bar covers Sundays date when small logo enabled
	* different approach stopping page from scrolling on search
1.34 (2018-03-15)
	+ time offset option
	+ option to disable scroll when using search field
1.33.1 (2018-03-12)
	! color input field undo now records when color picked via palette
1.33 (2018-03-12)
	+ missing color input field in color picker
	* improved color input field in color picker: no need for # and it automatically filters out non-valid values, custom undo/redo that works between shows
1.32 (2018-03-04)
	+ add/reset buttons in Links Manager are now disabled when fields are empty
	+ clear colors/hidden/watched lists in options
	+ ability undo after clear colors/hidden/watched
	! reset button in Links Manager would not remove icon in result when clicked first time
	! broken restore settings
	! when a popup once opened via a hashtag (#options, #linksmanager, #changes), opening that popup via click would not show back button
	* alert popup after clear colors/hidden/watched replaced with a notification message with ability to undo
1.31 (2018-02-25)
	+ button in prompt popup to save/load file
	+ hashtags #options and #linksmanager
	+ tooltips on links in links manager
	! color validation during import colors didn't work properly
	! the end of text in url field in links manager was covered up by the dropdown menu button
	! color picker in search result displayed behind the search results and was inaccessible
	! asterisk on new links in links manager is now always visible even if link's title is truncated
	* export colors filters out invalid colors
	* links manager is now consistent width
	- save/load from file links, they are now integrated into prompt itself
1.30.2 (2018-02-18)
	! incorrect favicon for internal airdates.tv links
1.30.1 (2018-02-18)
	! error opening show from "My shows" list
1.30 (2018-02-18)
	+ animation speed setting
	+ links manager automatically scrolls to new (or edited) link after submit
	+ custom prompt popup for import/export colors/settings
	! exporting ~160 colors via text string would corrupt some colors due to Chrome limitations
	! errors in console when attempting restore settings or import colors with invalid data
	* importing colors now validates input before saving to the account
1.29 (2018-02-12)
	+ ESC key closes popups
	+ show/hide this show icon
	! when number of visible links different from default, opening a show would make the animation jump
	! long text wrapped in popup windows
	! clicking on edit link icon in Links Manager, would not display correct lin in the "Result" row
	! "reset sort" link in Links Manager would take whole row
	! MS Edge would not initialize properly
	* links with long names are longer "wrap"
	* significally improved performance of Links manager
	* faster opening/closing show animation
	* selectable links in show details are now separate from other links
	* links manager popup now has limited max size
1.28.4 (2018-02-07)
	+ random series as example in links manager
	! editing/adding a link while a show opened would produce incorrect links in the opened show until page refresh
1.28.3 (2018-02-07)
	! Firefox decided render shadow much bigger then supposed to
1.28.2 (2018-02-07)
	! in Firefox shadow would show on opened show when popup was opened
1.28.1 (2018-02-07)
	+ shadow on "popups", making them more pronounced
1.28 (2018-02-04)
	+ search by adding #s:keyword in the address
	+ changes log
	+ ability use hash tags as links in comments (<a href="#s:test">#s:<i>search-keyword</i></a>, <a href="#info:1234">#info:<i>NN</i></a>, <a href="#myshows">#myshows</a>, <a href="#hidden">#hidden</a>, <a href="#changes">#changes</a>). Without ADE it will open a blank page.
	+ option for small logo
	! disqus troll would not work at all in some browsers
	! disqus troll would not work on additionally loaded comments
	! "watched" checkboxes shown through search field
	! close button on popups would not work if cursor not in the middle of it
	* removed disq.us from links in comments
	* links in comments open in new tab
	* when searching via hash tag, clearing search field with X icon would also remove the hash tag from address bar
1.27.5 (2018-01-22)
	! broken fix for paste via right click in search bar
1.27.4 (2018-01-22)
	+ cloud icon next to member name
1.27.3 (2018-01-22)
	! fails initialize with some invalid colors in cookies
	* replaced some icons with SVG, should now be more browser independent and consistent
1.27.2 (2018-01-21)
	! sorting by color with fallback to sorting by name was in reverse
1.27 (2018-01-21)
	+ link to support website
	! middle click on title would attempt open 2 tabs for each selected link
	! significantly improved initialization speed for guests and members with no colors (very noticeable with #showhidden in the address)
*/}, true).trim();

let log = console.log.bind(console),
		self = this,
		timeOffset = 0,
		isFrame = window.top !== window.self,
		_Date = Date,
		today,
		blankFunc = function(){},
		SVG = {
			del: '<svg viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path></svg>',
			search: '<svg viewBox="0 0 6 6"><path d="M2.23 0a2.23 2.23 0 0 1 1.7 3.68l.08.1h.28L6 5.47 5.49 6 3.77 4.29V4l-.1-.09A2.23 2.23 0 1 1 2.24 0m0 .69a1.54 1.54 0 1 0 1.54 1.54A1.54 1.54 0 0 0 2.23.69z"/></svg>',
			show: '<svg viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"></path></svg>',
			hide: '<svg viewBox="0 0 24 24"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z"></path></svg>',
			backup: '<svg viewBox="0 0 24 24"><path d="M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z" /></svg>',
			restore: '<svg viewBox="0 0 24 24"><path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3M12,8V13L16.28,15.54L17,14.33L13.5,12.25V8H12Z" /></svg>',
			clear: '<svg viewBox="0 0 24 24"><path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"></path></svg>',
			edit: '<svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>',
			guest: '<svg xmlns="http://www.w3.org/2000/svg" class="cookieIcon" viewBox="0 0 18 18"><rect class="cookieIconHoles" width="10.27" height="14.58" x="3.04" y="2.49" rx="3.33" ry="3.33" transform="rotate(-41.95 8.18 9.78)"/><path d="M9 0a9 9 0 1 0 9 9 8.44 8.44 0 0 0-.13-1.5A1.05 1.05 0 0 0 17 7h-2V6a.98.98 0 0 0-1-1h-2V4a.98.98 0 0 0-1-1h-1V1a.98.98 0 0 0-1-1M6.5 3A1.5 1.5 0 1 1 5 4.5 1.5 1.5 0 0 1 6.5 3m-3 4A1.5 1.5 0 1 1 2 8.5 1.5 1.5 0 0 1 3.5 7m5 1A1.5 1.5 0 1 1 7 9.5 1.5 1.5 0 0 1 8.5 8m5 2a1.5 1.5 0 0 1 0 3 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5M8 13a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 8 13z"/></svg>',
			link: '<svg viewBox="0 0 24 24"><path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z"></path></svg>',
			customlinks: '<svg viewBox="0 0 24 24"><path d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z" /></svg>',
			customshows: '<svg viewBox="0 0 24 24"><path d="M2,6V8H14V6H2M2,10V12H14V10H2M20.04,10.13C19.9,10.13 19.76,10.19 19.65,10.3L18.65,11.3L20.7,13.35L21.7,12.35C21.92,12.14 21.92,11.79 21.7,11.58L20.42,10.3C20.31,10.19 20.18,10.13 20.04,10.13M18.07,11.88L12,17.94V20H14.06L20.12,13.93L18.07,11.88M2,14V16H10V14H2Z" /></svg>',
			settings: '<svg viewBox="0 0 24 24"><path d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z" /></svg>',
			menu: '<svg xmlns="http://www.w3.org/2000/svg" class="menuIcon" viewBox="0 0 18 12"><path d="M0 0h18v2H0V0m0 5h18v2H0V5m0 5h18v2H0z"/></svg>',
			user: '<svg viewBox="0 0 24 24"><path d="M12,4C15.64,4 18.67,6.59 19.35,10.04C21.95,10.22 24,12.36 24,15A5,5 0 0,1 19,20H6A6,6 0 0,1 0,14C0,10.91 2.34,8.36 5.35,8.04C6.6,5.64 9.11,4 12,4M7.5,9.69C6.06,11.5 6.2,14.06 7.82,15.68C8.66,16.5 9.81,17 11,17V18.86L13.83,16.04L11,13.21V15C10.34,15 9.7,14.74 9.23,14.27C8.39,13.43 8.26,12.11 8.92,11.12L7.5,9.69M9.17,8.97L10.62,10.42L12,11.79V10C12.66,10 13.3,10.26 13.77,10.73C14.61,11.57 14.74,12.89 14.08,13.88L15.5,15.31C16.94,13.5 16.8,10.94 15.18,9.32C14.34,8.5 13.19,8 12,8V6.14L9.17,8.97Z"></path></svg>',
			reload: '<svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg><span>Reload</span>',
			close: '<svg viewBox="0 0 24 24"><path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,8.4L13.4,12L17,15.6L15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4Z"></path></svg>',
			closehover: '<svg viewBox="0 0 24 24"><path d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z"></path></svg>',
			viewas: '<svg viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path></svg>',
			back: '<svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>',
		};


/*work around for some SVG pictures shown huge before page is fully loaded*/
(function loop()
{
	let head = document.head;
	if (!head)
	{
		return setTimeout(loop, 0);
	}

	let style = document.createElement("style");
	head.appendChild(style);
	style.innerHTML = "svg{max-width:1.2em;max-height:1.2em;}";
	if (!isFrame && window.location.href.match(/^http:/))
	{
		let s = document.createElement("script");
		s.src = "/public/javascripts/db.js";
		head.appendChild(s);
		s = document.createElement("script");
		s.src = "/public/javascripts/main.js";
		head.appendChild(s);
		s = document.createElement("script");
		s.src = "/public/javascripts/jqColorPicker.min.js";
		head.appendChild(s);
		window.engines = [];
	}
})();

receiveMessage.f = {};//list of functions
receiveMessage.f.reloadDisqus = function messageFunc_reloadDisqus(r)
{
	if (typeof(r) == "undefined")
	{
		this.r = true;
		DISQUS.reset({
			reload: true,
		});
	}
	else if (this.r)
	{
		$("html, body").animate({scrollTop: $("#disqus_thread").find("iframe")[0].offsetTop + r }, 300);
	}
};

window.self.addEventListener("message", receiveMessage, false);

if (!isFrame)
{
	try
	{
		timeOffset = ~~ls("settings").timeOffset;
		if (!(timeOffset instanceof Number))
			timeOffset = 0;
	}
	catch(er){}

	Date = function()
	{
		let args = Array.prototype.slice.call(arguments);
		args.splice(0, 0, this);
		let n = (new (Function.prototype.bind.apply(_Date, args))).getTime() + 3600000 * timeOffset;

		return new _Date(n);
	};

	Date._now = function()
	{
		return (new _Date()).getTime();
//		return Math.floor((Date.now() - 1523246400000) / 1000); //2018-04-09 00:00:00
	};
}

if (!Date.now)
{
	Date.now = function()
	{
		return (new Date()).getTime();
	};
}


Object.defineProperty(window, 'browser', { get: function()
{
	let browser = "";
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
	{
		browser = "opera";
	}
	else if(navigator.userAgent.indexOf("Edge") != -1)
	{
		browser = "edge";
	}
	else if(navigator.userAgent.indexOf("Chrome") != -1 )
	{
		browser = "chrome";
	}
	else if(navigator.userAgent.indexOf("Firefox") != -1 )
	{
		browser = "ff";
	}
	else if(navigator.userAgent.indexOf("Safari") != -1)
	{
		browser = "safari";
	}
	else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
	{
		browser = "ie";
	}
	return browser;
}});

let mainFunc = function mainFunc(event)
{
	/* jshint validthis: true */
	if (typeof($) == "undefined")
		return;

	//create a DIV container and move everything into that container
	const elContent = document.getElementById("content") || document.createElement("div"),
				elSearchbarContainer = document.createElement("div");
	elContent.id = "content";
	elSearchbarContainer.id = "searchbarContainer";
	elSearchbarContainer.appendChild(document.getElementById("searchbar"));
	elContent.appendChild(elSearchbarContainer);
	while(document.body.children.length)
		elContent.appendChild(document.body.firstChild);

	document.body.appendChild(elContent);

	let browser = window.browser;
	if (browser)
		document.body.classList.toggle(browser, true);

	let disqusMessageCount = function disqusMessageCount(count)
	{
		if (count)
		{
			disqusMessageCount.el.setAttribute("unread", "");
			disqusMessageNotifLoaded(false);
		}
		else
		{
			disqusMessageCount.el.removeAttribute("unread");
//			disqusMessageCount.el.classList.toggle("loading", false);
			disqusMessageNotifLoaded(false);
			count = "";
		}

		disqusMessageCount.el.textContent = count;
	};
	receiveMessage.f.disqusMessageCount = disqusMessageCount;
	let adeName = "Airdates.tv enhancer",
			adeVersion = "n/a",
			prevVersion = null,
			force = false,
			enginesDefault = [],
			_engines = [],
			_hidden = ls("hidden") || [],
			loopWait = 1000,
			_enginesList = [],
			pickerCallbacks = {};

	try
	{
		adeName = GM_info.script.name;
		adeVersion = GM_info.script.version;
	}catch(er){}
	cs.list = ["s","n"];
	cs.listLegacy = {
		sh: "showHidden",
		sn: "showNew",
		sr: "showReturn",
		cm: "collapseMulti",
		w: "weeksPast",
		wa: "enableWatched",
		middleClick: "middleClick"
	};

	let enginesHide = ls("enginesHide") || [];
	let Settings = {
		SORT_NAME: 0,
		SORT_COLOR: 1,
		inited: false,
		box: null,
/*
		colorsDef: {
			"807fff": {name: ""},
			"ff7fff": {name: ""},
			"80ff7f": {name: ""},
			"7fffff": {name: ""},
			"ff7f7f": {name: ""},
		},
*/

		prefs: {},
		prefsDef: {
			animSpeed: 2,
			archiveBottom: 1, //show next/prev month links below calendar
			collapseMulti: 0,
			cushowsHelp: 0,
			enableWatched: 0,
			enableEpDateFix: 0,
			lastColor: "",
			lastColors: [],
			lastColorsLine: 7, //number of last colors per line
			lastColorsShow: 7, //number of last colors to show
			middleClick: [],
			myShowsTop: 0, //move my shows on top of the list
			noChangesLog: 0,
			popupBlur: 1, //blur background when popups are shown
			searchOrder: 0,
			searchScroll: 1,
			shortTitle: 0,
			shortTitleExpand: 1,
			showHidden: 0,
			showNew: 0,
			showReturn: 0,
			showWatched: 1,
			smallLogo: 0,
			sortBy: 0,
			theme: "",
			themeColors: {
				text: "",
				bg: "",
				date: "",
				dateBg: "",
				today: "",
				todayBg: "",
				todayBorder: ""
			},
			timeOffset: 0,
			todayChange: 1,
			version: "",
			weeks: 0, //total number of weeks to show
			weeksPast: 0, //number of past weeks
			weekStart: 0, //0=Mon, 1=Sun, 2=Sat
		},

		prefsFilter: {
			animSpeed: function(p)
			{
				return Math.max(0, Math.min(9, p));
			},
		},

		filter: function Settings_filter(id, val)
		{
			if (id in this.prefsFilter)
				return this.prefsFilter[id](val);

			return val;
		},

		pref: function Settings_pref(id, val, prefs)
		{
			prefs = prefs || this.prefs;
			let ids = id.split(".");
			if (ids.length > 1)
			{
				return this.pref(ids[1], val, prefs[ids[0]]);
			}
			if (typeof(val) == "undefined")
				return typeof(prefs[id]) == "undefined" ? null : prefs[id];

			prefs[id] = this.filter(id, val);
			this.save();
		},

		init: function Settings_init()
		{
			if (this.inited)
				return;

			this.prefs = ls("settings");
			if (!this.prefs || typeof(this.prefs) != "object")
				this.prefs = cloneObj(this.prefsDef);

			if ("weeks" in this.prefs && !("weeksPast" in this.prefs))
			{
				this.prefs.weeksPast = this.prefs.weeks;
				this.prefs.weeks = this.prefsDef.weeks;
			}

			//add any missing settings and remove any non-existing
			function fixPref(pref, def)
			{
				for(let i in def)
				{
					if (!(i in pref))
						pref[i] = def[i];

					if (typeof(def[i]) == "object" && !Array.isArray(def[i]))
						fixPref(pref[i], def[i]);
				}
				for(let i in pref)
				{
					if (!(i in def))
						delete pref[i];
				}
			}
			fixPref(this.prefs, this.prefsDef);
			if (this.prefs.theme === 1)
				this.prefs.theme = "dark";

			//remove any non-existing settings
			for(let i in this.prefs)
			{
				if (!(i in this.prefsDef) || typeof(this.prefs[i]) !== typeof(this.prefsDef[i]))
					delete this.prefs[i];
			}
			let c,// = cs("wa"),
					s = false;
/*
//too old compatibility to care?

			if (c !== null)
			{
				this.prefs.enableWatched = c ? 1 : 0;
				eraseCookie("wa");
				s = true;
			}
			c = cs("showhidden");
			if (c !== null)
			{
				this.prefs.showHidden = c ? 1 : 0;
				eraseCookie("showhidden");
				s = true;
			}
			c = cs("sh");
			if (c !== null)
			{
				this.prefs.showHidden = c ? 1 : 0;
				eraseCookie("sh");
				s = true;
			}

			c = cs("cm");
			if (c !== null)
			{
				this.prefs.collapseMulti = c ? 1 : 0;
				eraseCookie("cm");
				s = true;
			}

			c = cs("middleClick");
			if (c !== null)
			{
				this.prefs.middleClick = c ? c : [];
				eraseCookie("middleClick");
				s = true;
			}

			c = cs("w");
			if (c !== null)
			{
				this.prefs.weeks = c;
				eraseCookie("w");
				s = true;
			}
*/
			/* splitting New/Returning into two separate filters */
			c = cs("sn");
			if (c === null && this.pref("showNew") === null)
			{
				let n = cs("n") ? 1 : 0;
				this.prefs.showNew = n;
				this.prefs.showReturn = n;
				s = true;
			}
			else if (c !== null)
			{
				this.prefs.showNew = c;
				eraseCookie("sn");
				s = true;
			}

			c = cs("sr");
			if (c !== null)
			{
				this.prefs.showReturn = c;
				eraseCookie("sr");
				s = true;
			}

			window.createCookie = createCookie;
//			window.eraseCookie = eraseCookie;
//			window.readCookie = readCookie;
			if (this.pref("version") != adeVersion)
			{
				if (!Settings.prefs.noChangesLog && Settings.prefs.version != adeVersion)
				{
					prevVersion = Settings.prefs.version;
					if (Settings.prefs.version !== "")
					{
						setTimeout(function()
						{
							changesLog.show(true);
						});
					}
					if (!DB.loggedInUsername)
					{
						setTimeout(function()
						{
							for(let id in DB.savedColors)
							{
								DB.setColor(id, DB.savedColors[id]);
							}
						});
					}
				}
				if ("weekSunday" in this.prefs)
				{
					this.prefs.weekStart = this.prefs.weekSunday;
					delete this.prefs.weekSunday;
					this.save();
				}
				if (versionsCompare(this.pref("version"), "1.71") < 0)
				{
					let l = ls("customShows") || {i:1,l:{}},
							changed = false;
					for (let obj in l.l)
					{
						for (let i = 0; i < l.l[obj][1].length; i++)
						{
							let data = l.l[obj][1][i];
							if (data.length == 6)
							{
								data[6] = data[5]; //custom show days of the week
								data[5] = 1;
								changed = true;
							}
						}
					}
					if (changed)
					{
						ls("customShows", l);
					}
				}
				if (versionsCompare(this.pref("version"), "1.72") < 0)
				{
					let w = watched._list;
					for (let i in w)
					{
						let l = w[i],
								n = [];

						for (let e = 0; e < l.length; e++)
						{
							n[n.length] = episodeTools.short(l[e]);
						}
						w[i] = n;
					}
					watched.save(1);
				}
				this.prefs.version = adeVersion;
				s = true;
			}


			if (s)
				this.save();

			this.themes.init();
			this.create();
			this.lastUpdateShow();
			this.inited = true;
		},//Settings.init()

		create: function Settings_create(callback)
		{
			if (Settings.box)
				return callback ? callback() : true;

			let html = multiline(function(){/*
<div id="settings-popup" class="popup">
	<div id="settings-popup-content">
		<div class="header">
			<div class="back" title="Back">
				{SVG-BACK}
			</div>
			<h4>Options</h4>
			<div class="close" title="Close" title="Close">
				{SVG-CLOSEHOVER}
				{SVG-CLOSE}
			</div>
		</div>
		<div class="content settings">
		</div>
	</div>
</div>
			*/});//html

			let popup = $(html).appendTo("#content"),
					content = popup.find(".content"),
					a = document.createElement("a"),
					i = document.createElement("span"),
					span = document.createElement("div"),
					that = self,
					opt;

			span.appendChild(i);
			span.appendChild(a);

			Settings.box = popup;
			content.append(createCheckbox("enableWatched", "Enable watched", this.prefs.enableWatched ? true : false, this.callback, null, ""));
//enableEpDateFixMenu
			content.append(createCheckbox("enableEpDateFix", "Enable Episode Date Offset", this.prefs.enableEpDateFix ? true : false, function(e, id, check)
			{
				epDateFix.init(check);
			}, ['Warning! This will increase page loading time.\n\nRequires page reload'], ""));
			content.append(createCheckbox("shortTitle", "Truncate long titles", this.prefs.shortTitle ? true : false, this.callback, ["Shorten titles to fit into single row."], ""));
			content.append(createCheckbox("shortTitleExpand", "Auto expand truncated titles", this.prefs.shortTitleExpand ? true : false, this.callback, ["Show full title when cursor over it. If disabled you still be able see full title in tooltip or when show is opened."], ""));
			content.append(createCheckbox("smallLogo", "Small logo", this.prefs.smallLogo ? true : false, this.callback, null, ""));
			content.append(createCheckbox("searchScroll", "Auto scroll to the top", this.prefs.searchScroll ? true : false, this.callback, ["Scroll to the top on search and page refresh"], ""));
			content.append(createCheckbox("todayChange", "Track today", this.prefs.todayChange ? true : false, this.callback, ['Automatically change "today" at midnight'], ""));
			content.append(createCheckbox("archiveBottom", "Show bottom archive links", this.prefs.archiveBottom ? true : false, this.callback, ['Show next/prev month links below calendar'], ""));
			content.append(createCheckbox("popupBlur", "Blur behind popups", this.prefs.popupBlur ? true : false, this.callback, ['Make popups standout more'], ""));
			content.append(createCheckbox("myShowsTop", "My Shows on top", this.prefs.myShowsTop ? true : false, function(e, id, check)
			{
				that.callback(e, id, check);
				sortMyShows();
			}, ['Move My Shows to the top of the list'], ""));

			opt = $(multiline(function(){/*
<span id="weekStartBox">First day of the week:
	<select>
		<option value="2">Saturday</option>
		<option value="1">Sunday</option>
		<option value="0">Monday</option>
	</select>
</span>
			*/}))
				.appendTo(content)
				.find("select")
				.val(Settings.pref("weekStart"))
				.on("input", function(evt)
				{
					Settings.pref("weekStart", ~~this.value);
					if (!evt.isTrigger)
						pastLoaded();
				})
				.trigger("input");


			opt = $(multiline(function(){/*
<span id="weeksBox">Show number of weeks:
	<select id="weeks">
		<option value="">Default</option>
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
		<option value="8">8</option>
		<option value="9">9</option>
		<option value="10">10</option>
		<option value="11">11</option>
		<option value="12">12</option>
		<option value="13">13</option>
		<option value="14">14</option>
		<option value="15">15</option>
		<option value="16">16</option>
		<option value="17">17</option>
	</select>
</span>
			*/}))
				.appendTo(content)
				.find("#weeks")
				.val(Settings.pref("weeks"))
				.on("input", function(evt)
				{
//					this.nextSibling.textContent = " week" + ((this.value == 1) ? "" : "s");
					Settings.pref("weeks", ~~this.value);
					if (!evt.isTrigger)
						pastLoaded();
				})
				.trigger("input");

			opt = $(multiline(function(){/*
<span id="lastColorsShowBox">
	Show <input id="lastColorsShow" type="number" min="0" max="100"> last custom colors
</span>
			*/}))
				.appendTo(content)
				.find("input")
				.val(Settings.pref("lastColorsShow"))
				.attr("max", Settings.colors.max)
				.on("input", function(evt)
				{
					this.nextSibling.textContent = " last custom color" + ((this.value == 1) ? "" : "s");

					let s = this.selectionStart,
							e = this.selectionEnd,
							val = Math.min(Settings.colors.max, Math.max(0, ~~this.value.replace(/[^0-9\-]/g, "")));
					this.value = val;

					if (e !== null)
						this.selectionEnd = e;
					if (s !== null)
						this.selectionStart = s;

					Settings.pref("lastColorsShow", val);

					if (!evt.isTrigger)
					{
						clearTimeout(opt.timer);
						opt.timer = setTimeout(Settings.colors.init, 100);
					}

				})
				.trigger("input");

			content.append(createCheckbox("lastColorsLine", "Custom colors fill width", this.prefs.lastColorsLine ? false : true, function(e, id, check)
			{
				let num = check ? 0 : 7;
				Settings.pref("lastColorsLine", num);
				if (!e.isTrigger)
					Settings.colors.init();

			}, ['Use all available width, or show 7 custOm colors per line'], ""));

			opt = $(multiline(function(){/*
<span id="timeOffsetBox">
	Time offset: <input id="timeOffset" type="number" min="-24" max="24"> hours
</span>
			*/}))
				.appendTo(content)
				.find("#timeOffset")
				.val(Settings.pref("timeOffset"))
				.on("input", function(evt)
				{
					this.nextSibling.textContent = " hour" + ((this.value == 1) ? "" : "s");
					let s = this.selectionStart,
							e = this.selectionEnd;
					timeOffset = Math.min(24, Math.max(-24, Number(this.value.replace(/[^0-9\-]/g, ""))));
					this.value = timeOffset;

					if (e !== null)
						this.selectionEnd = e;
					if (s !== null)
						this.selectionStart = s;

					Settings.pref("timeOffset", timeOffset);
					if (!evt.isTrigger)
						todayChange(timeOffset);
				})
				.trigger("input");

			if (!device.tablet() && !device.mobile())
			{
				opt = $(multiline(function(){/*
<div id="animSpeedBox" title="Speed for opening/closing a show">
	Animation speed
	<div>
		<input id="animSpeed" type="range" min="1" max="10" class="slider" list="animSpeedTicks" >
		<span class="ticks">
			<span>1</span>
			<span>2</span>
			<span>3</span>
			<span>4</span>
			<span>5</span>
			<span>6</span>
			<span>7</span>
			<span>8</span>
			<span>9</span>
			<span>10</span>
		</span>
	</div>
	<span id="animSpeedVal"></span>
</div>
				*/}))
					.appendTo(content)
					.find("#animSpeed")
					.val(10-Settings.pref("animSpeed"))
					.on("input", function(e)
					{
						Settings.pref("animSpeed", 10-Number(this.value));
						$("#animSpeedVal").text(this.value);
					})
					.trigger("input");
			}

			opt = $(multiline(function(){/*
<span>Theme: <select id="theme"></select></span>
			*/}))
				.appendTo(content)
				.find("select")
				.each(function(i, el)
				{
					let option = document.createElement("option");
					for(let id in Settings.themes.list)
					{
						option = option.cloneNode(false);
						option.value = id;
						let name = id;
						if ("name" in Settings.themes.list[name])
							name = Settings.themes.list[name].name;

						if (name === "")
							name = "Default";

						option.innerHTML = name;
						el.appendChild(option);
					}
					el.value = Settings.prefs.theme;
				})
				.on("change", function(evt)
				{
					Settings.themes.load(evt.target.value);
				})
				.trigger("change");

			let box = $('<div class="themeColorsSettings"><label>Theme colors:</label></div>'),
					info = Settings.themes.quickOverrideTempl,
					samples = {},
					sampleGroup = 0;

			let templ = multiline(function(){/*
<span id="themeColorBox_{ID}" class="themeColorBox">
	<label>{LABEL}</label>
	<div id="themeColor_{ID}" class="color picker picker-light self" callback="themeColor_{ID}" title="Set Color"></div>
	<div class="del" title="Clear">{SVG-DEL}</div>
</span>
			*/});
			for(let i in Settings.prefsDef.themeColors)
			{
				opt = $(templ
						.replace(/\{ID\}/g, i)
						.replace(/\{LABEL\}/g, info[i].label || "")
						.replace(/\{TITLE\}/g, info[i].title || ""))

					.appendTo(box)
					.find(".color")
					.each(function()
					{
						let that = this,
								name = i,
								data = {};

						data[name] = Settings.pref("themeColors." + name);
						Settings.themes.quickOverride(data);
						if (data[name])
							that.parentNode.setAttribute("color", data[name]);
						else
							that.parentNode.removeAttribute("color");

						pickerCallbacks["themeColor_" + name] = function(val, temp)
						{
							let c = (typeof(val) == "boolean") ? val : temp ? true :false;
							that.parentNode.classList.toggle("colorpicker", c);
							that.parentNode.parentNode.classList.toggle("colorpicker", c);
							let b = document.getElementById("themeColorBox_" + that.parentNode._example),
									s = b.getElementsByClassName("example")[0];
							if (c)
								b.setAttribute("down", that.parentNode._down);
							else
								b.removeAttribute("down");

							if (typeof(val) == "boolean")
								val = null;

							if (!temp)
							{
								if (val)
									that.parentNode.setAttribute("color", val);
								else
									that.parentNode.removeAttribute("color");

								Settings.pref("themeColors." + name, val);
							}
							if (val === null)
							{
								val = Settings.prefs.themeColors[name];
							}
							let data = {};
							data[name] = val;
							Settings.themes.quickOverride(data);
						};
					})
					.parent()
					.find(".del")
					.on("click", function()
					{
						pickerCallbacks["themeColor_" + i]("");
					});

				if (info[i].sample)
				{
					let p = opt.parent();
					let s = info[i].sample.split(",");
					for(let i = 0; i < s.length; i++)
					{
						if (typeof(samples[s[i]]) == "undefined")
							samples[s[i]] = [0, sampleGroup++];

						samples[s[i]][0]++;
						p[0]._down = samples[s[i]][0];
						p[0].classList.toggle("group" + (samples[s[i]][1] % 2), true);
					}
					p[0]._example = info[i].sample;
				}
			}
			box.appendTo(content);
			for (let s in samples)
			{
				let b = $("#themeColorBox_" + s);
				if (b.prev().hasClass("themeColorBox"))
				{
					b.before('<div/>');
				}
				b.append($('<span class="example example_' + s + ' example_down_' + samples[s][0] + '">Example</span>'));
				for(let i = 1; i < samples[s][0]; i++)
				{
					b = b.next();
					b[0]._down = samples[s][0] - (samples[s][0] - ~~b[0]._down);
				}
			}

			content.append('<div class="spacer"/>');

			a.href = "#";
			i.innerHTML = SVG.backup;
			a.textContent = "Backup settings";
			a.id = "settingsBackup";
			span.title = "Backup all settings, including links manager data, watched and hidden shows lists, middle click selection, last custom colors and custom shows.";
			a.addEventListener("click", function backupSettings_link_evtClick(e)
			{
				e.preventDefault();
				Settings.backup();
				return false;
			}, false);

			content.append(span);

			span = span.cloneNode(true);
			i = span.firstChild;
			a = i.nextSibling;
			a.id = "settingsRestore";
			span.title = "Note, your current watched and hidden shows list will stay intact, new shows will be added to it.\nCustom links will only overwrite existing with matched ID.\nAll other settings will be overwritten";
			i.innerHTML = SVG.restore;
			a.textContent = "Restore settings";
			function restore(str)
			{
				let reload = false,
						txt = "Error restoring settings";

				if(!str)
					return;

				let hiddenNum = 0,
						watchedNum = 0,
						settingsNum = 0,
						enginesNum = 0,
						engineHideNum = 0,
						customShowsNum = 0,
						themesNum = 0;

				let json = null;
				try
				{
					json = JSON.parse(str);
				}
				catch(er){log(er);}
				if (json && typeof(json) == "object")
				{
					if ("hidden" in json)
					{
						hiddenNum = json.hidden.length;
						for(let i = 0; i < hiddenNum; i++)
							showHide(parseInt(json.hidden[i]), 1);
					}
					if ("watched" in json)
					{
						for(let id in json.watched)
						{
							for(let i = 0; i < json.watched[id].length; i++)
							{
								let ep = json.watched[id][i];
								watched.add(id, ep);
								watchedNum++;
								$('div.entry[data-series-id="' + id + '"]').each(function(n, entry)
								{
									if (episodeTools.short(entry) == ep)
										watched.update(entry, true);
								});
							}
						}
						watched.save(true);
					}
					if (!json.cookies)
						json.cookies = {};

					if ("settings" in json)
					{
						let save = false;
						for(let i in json.settings)
						{
							let val = json.settings[i];
							if (i in cs.listLegacy && !(i in Settings.prefsDef))
							{
								val = json.settings[i];
								i = cs.listLegacy[i];
							}

							if (!(i in Settings.prefsDef))
							{
								if (!(i in json.cookies) && cs.list.indexOf(i) != -1)
									json.cookies[i] = val;

								continue;
							}

							if (!command(i, val))
							{
								settingsNum++;
								Settings.prefs[i] = val;
								reload = true;
								save = true;
							}
						}
						if (save)
							Settings.save();
					}

					if ("cookies" in json)
					{
						for(let i in json.cookies)
						{
							if (cs.list.indexOf(i) == -1)
								continue;

							if (!command(i, json.cookies[i]))
							{
								settingsNum++;
								cs(i, json.cookies[i]);
								reload = true;
							}
						}
					}
					let enginesNew = [];
					if ("customLinks" in json)
					{
						let changed = false;
						for (i in json.customLinks)
						{
							enginesNum++;
							changed = reload = true;
							customLinks._list[i] = json.customLinks[i];
							enginesNew.push(json.customLinks[i]);
						}
						if (changed)
							ls("customLinks", customLinks._list);

					}
					if ("enginesHide" in json)
					{
						let changed = false;
						let list = [];
						for(let i = 0; i < json.enginesHide.length; i++)
						{
							if (enginesFind(json.enginesHide[i]) != -1 || enginesFind(json.enginesHide[i], enginesNew) != -1)
							{
								list[list.length] = json.enginesHide[i];
								changed = reload = true;
								engineHideNum++;
							}
						}
						enginesHide = list;
						if (changed)
							ls("enginesHide", enginesHide);
					}
					if ("enginesSort" in json)
					{
						let changed = false;
						enginesSort._list = [];
						for(let i = 0; i < json.enginesSort.length; i++)
						{
							if (enginesFind(json.enginesSort[i]) != -1 || enginesFind(json.enginesSort[i], enginesNew) != -1)
							{
								changed = reload = true;
								enginesSort._list.push(json.enginesSort[i]);
							}
						}
						if (changed)
							ls("enginesSort", enginesSort._list);
					}
					if ("info" in json)
					{
						let changed = false;
						for(let i in json.info)
						{
							if (!(i in DB.info))
							{
								DB.info[i] = json.info[i];
								changed = true;
							}
						}
						if (changed)
							DB.infoSave();
					}
					if ("epNumFix" in json)
					{
						let changed = false;
						for(let i in json.epNumFix)
						{
							if (!(i in episodeNumberFix.list))
							{
								episodeNumberFix.list[i] = json.epNumFix[i];
								changed = true;
							}
						}
						if (changed)
							episodeNumberFix.save();
					}
					if ("themes" in json)
					{
						let changed = false;
						for(let i in json.themes)
						{
							if (!(i in Settings.themes._default))
							{
								Settings.themes.list[i] = json.themes[i];
								changed = true;
								themesNum++;
							}
						}
						if (changed)
							Settings.themes.save();
					}
					if ("customShows" in json)
					{
						let changed = false,
								upgrade = versionsCompare(json.version, "1.71") < 0;

						for(let i in json.customShows.l)
						{
							let data = json.customShows.l[i];
							if (upgrade)
							{
								for (let n = 0; n < data[1].length; n++)
								{
									if (data[1][n].length == 6)
									{
										data[1][n][6] = data[1][n][5]; //custom show days of the week
										data[1][n][5] = 1;
									}
								}
							}
							customShows._list.l[i] = data;
							changed = true;
							customShowsNum++;
						}

//remove duplicate
						let newData = {},
								names = {};

						for(let f in customShows._list.l)
						{
							let data = customShows._list.l[f],
									name = data[0],
									seen = {},
									id = f;

							if (name in names)
							{
								data[1] = [].concat(names[name].d[1], data[1]);
								id = names[name].i;
							}
							data[1] = data[1].sort().filter(function(item)
							{
								var k = JSON.stringify(item);
								return k in seen ? false : (seen[k] = true);
							});
							names[name] = {
								i: f,
								d: data
							};
							newData[id] = data;
						}
						customShows._list.l = newData;
						if (changed)
						{
							customShows._list.i = Math.max(json.customShows.i, customShows._list.i);
							customShows.save();
							customShows.init(customShows._list);
							customShows();
						}
					}
					txt = settingsNum + " setting" + (settingsNum > 1 ? "s" : "") + " imported" + ((hiddenNum || watchedNum) ? " and marked " : "");
					if (hiddenNum)
						txt += hiddenNum + " show" + (hiddenNum > 1 ? "s" : "") + " as hidden";
					if (watchedNum)
						txt += (hiddenNum ? ", " : " ") + watchedNum + " as watched";
					if (themesNum)
						txt += (themesNum ? ", " : " ") + themesNum + " theme" + (themesNum > 1 ? "s" : "");
					if (customShowsNum)
						txt += (customShowsNum ? ", " : " ") + customShowsNum + " custom show" + (customShowsNum > 1 ? "s" : "");
				}
				alert(txt);
				if (reload)
					window.location.reload();
			}
			a.addEventListener("click", function restoreSettings_link_evtClick(e)
			{
				e.preventDefault();

				_prompt({
					callback: function(data)
					{
						setTimeout(function()
						{
							restore(data);
						});
					},
					text: "Please enter the " + adeName + " settings text"
				});
			}, false);

			content.append(span);

			content.append('<div class="spacer"/><div class="moreOpt"><h4>More...</h4><div></div></div>');
			span = span.cloneNode(true);
			i = span.firstChild;
			a = $(".clearColors")[0];
			if (a)
			{
				a = a.cloneNode(true);
				i.parentNode.replaceChild(a, i.nextSibling);
				span.title = "Did you make a backup?";
				i.innerHTML = SVG.clear;
				let moreOpt = $("div.moreOpt");
				moreOpt.find("div").append(span);
				moreOpt.on("click", function()
				{
					moreOpt.attr("opened", true);
				});
			}
		},//Settings.create()

		_backup: function Settings__backup()
		{
			let cookies = {},
					str = "",
					obj = {
						version: adeVersion,
						settings: Settings.prefs
					},
					add = function(name, o)
					{
						for(let i in o)
						{
							obj[name] = o;
							break;
						}
					};

			for(let i = 0; i < cs.list.length; i++)
			{
				let v = cs(cs.list[i]);
				if (v !== null)
				{
					cookies[cs.list[i]] = v;
				}
			}
			add("cookies", cookies);
			add("hidden", _hidden);
			add("watched", watched._list);
			add("customLinks", customLinks._list);
			add("enginesHide", enginesHide);
			add("enginesSort", enginesSort._list);
			add("info", DB.info);
			add("epNumFix", episodeNumberFix.list);
			add("themes", Settings.themes.getCustomThemes());
			add("customShows", customShows._list);
			str = JSON.stringify(obj);

			return str;
		},

		backup: function Settings_backup()
		{
				let str = this._backup();

				if (str)
						_prompt({
							callback: function(){},
							text: adeName + " Settings \nYou can save it in a normal textfile and restore it to another computer/browser.",
							value: str
						});
				else
						alert("Nothing to backup");
		},

		callback: function Settings_callback(e, id, check)
		{
			Settings.prefs[id] = check ? 1 : 0;
			Settings.save();
		},

		save: function Settings_save(f)
		{
			ls("settings", this.prefs);
		},

		show: function Settings_show(noBack)
		{
/*
			if (noBack)
				Settings.box.attr("noback", "");
			else
				Settings.box.removeAttr("noback");
*/
			hidePopups();
			Settings.box.show();
			setPopup(true);
		},

		hide: function Settings_hide()
		{
			Settings.box.hide();
			setPopup(false);
			Settings.box.find("div.moreOpt").removeAttr("opened");
		},

		colors:
		{
			default: [], //list of predefined colors
			max: 100, //max num of colors to remember
			inited: false,
			add: function Settings_colors_add(color, save)
			{
				color = color.toUpperCase();
				if (color == "FFFFFF" || this.default.indexOf(color) != -1 || Settings.prefs.lastColors.indexOf(color) != -1)
					return;

				let colors = Settings.prefs.lastColors;
				colors[colors.length] = color;
				if (colors.length + 1 > this.max)
					colors.splice(0, colors.length - this.max);

				this.css();
				if (save)
					this.save();
			},

			save: function Settings_colors_save(color)
			{
				Settings.save();
			},

			css: function Settings_colors_css()
			{
				let css = "",
						colors = Settings.prefs.lastColors;

				for(let i = 0; i < colors.length; i++)
					css += ".soft_cust" + i + "{background-color:#" + colors[colors.length - i - 1] + ";display:inline-block}\n";

				$(".colors").toggleClass("nopre", (!Settings.prefs.lastColorsLine || Settings.prefs.lastColorsLine > 19) ? true : false);
				document.getElementById("customColorsCSS2").innerHTML = css;
				$('.colors [class^="color soft_"]').each(function(i)
				{
					this.title = "#" + new Colors().setColor($(this).css( "background-color" )).HEX.toUpperCase();
				});
			},

			init: function Settings_colors_init()
			{
				$("#detailsTemplate div.colors .color").each(function(i, e)
				{
					if (!this.classList.contains( "none" ))
						Settings.colors.default[Settings.colors.default.length] = new Colors().setColor($(this).css( "background-color" )).HEX.toUpperCase();
				});
				let css = "",
						style = document.createElement("style"),
						style2 = document.createElement("style"),
						span = document.createElement("span"),
						box = document.createElement("div"),
						last = $("#detailsTemplate .colors"),
						colors = Settings.prefs.lastColors,
						max = Math.min(Settings.prefs.lastColorsShow, Settings.prefs.lastColors.length);

				$('.colors .none').each(function(i)
				{
					this.title = "Remove color";
				});
				$('.colors .picker').each(function(i)
				{
					this.title = "Custom color";
//					this.classList.add("svg");
				});
				for(let i = 0; i < max; i++)
				{
					let cl = "soft_cust" + i;
					css += "." + cl + "{display:none;}\n";
					span = span.cloneNode(true);
					span.className = "color " + cl;
					span.setAttribute("i", i);
					box.appendChild(span);
					let br = (Settings.prefs.lastColorsLine && !((i+1) % Settings.prefs.lastColorsLine)) ? document.createTextNode("\n") : document.createTextNode(" ");
					box.appendChild(br);
				}
				$("#customColorsCSS, #customColorsCSS2").remove();
				let b = $(".customColors");
				if (b.length)
					b.html(box.innerHTML);
				else
					$("#detailsTemplate .colors").append(box);

				style.innerHTML = css;
				style.id = "customColorsCSS";
				style2.id = "customColorsCSS2";
				box.className = "customColors";
				$("head").append(style);
				$("head").append(style2);
				let c = [];
				for(let i = 0; i < colors.length; i++)
				{
					if (colors[i] && (""+colors[i]).match(/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/))
						c[c.length] = colors[i].toUpperCase();
				}
				Settings.prefs.lastColors = c;
				let that = Settings.colors;
				that.css();

				if (that.inited)
					return;

				$( document ).off( "mouseover", ".color");
				$( document ).off( "mouseout", ".color");
				let coltimer;
				$( document ).on( "mouseover", ".colors", function(e)
				{
						clearTimeout(coltimer);
						if (e.target.classList.contains("color"))
						{
							var $this = $( e.target );
							assignColor( $this.parents("div.entry").data( "series-id" ), $this.hasClass( "none" )? "" : $this.css( "background-color" ) );
						}
				});
				$( document ).on( "mouseout", ".colors", function(){
					clearTimeout(coltimer);
					let $this = $(this);
					coltimer = setTimeout(function(){loadColor( $this.parents("div.entry").data( "series-id" ) );}, 100);
				});

				$( document ).on( "mousedown", "div.colors .color", function(e)
				{
					if (e.which != 2)
						return;

					let col = new Colors().setColor($(this).css( "background-color" )).HEX.toUpperCase(),
							index = Settings.prefs.lastColors.indexOf(col);

					if (index != -1)
					{
						Settings.prefs.lastColors.splice(index, 1);
						Settings.colors.css();
						Settings.colors.save();
					}

					e.preventDefault();
				});
				that.inited = true;
			}//Settings.colors.init()
		},//Settings.colors

		themes:
		{
			_default: {
				"" : {
					name: "Default",
					isDark: false,
					css: null
				},
				dark: {
					name: "Dark",
					isDark: true,
					css: multiline(function(){/*
/*
Dark Theme
*//*

body
{
	background-color: #191919 !important;
}
body,
.header h4,
#account-popup-content,
#settings-popup .content,
#manage-cushows-popup-content,
#manage-links-popup-content,
#changesLogBox
{
	color: #E0DEDE;
}

body.archive
{
	background-color: #292929 !important;
}

a
{
	color: #737373;
}

.title:hover
{
	background: #D2D2D2 !important;
}

#searchbar
{
	background-color: rgb(76, 76, 76);
}

#account-popup-content,
#settings-popup .content,
#manage-cushows-popup-content,
#manage-links-popup-content,
#changesLogBox
{
	background: rgb(76, 76, 76) !important;
}

#searchResults a
{
	color: #D2D2D2;
	fill: #D2D2D2;
}

svg,
#account-popup-content .content a,
#settings-popup .content a,
#manage-cushows-popup-content a,
#manage-links-popup-content a,
#changesLogBox,
#noChangesLog > a
{
	color: #D2D2D2 !important;
	fill: #D2D2D2 !important;
}

.close:hover,
.back:hover,
.back:hover svg,
#cushows-list > li:hover,
#cushows-list > li:hover *:not(.color),
#cushows-list.opened > li.opened,
#cushows-list.opened > li.opened *:not(.color),
#cushows-list.opened > li.opened .color > .colors,
#manage-links-popup .content > div.dragging:not(.hide),
#manage-links-popup .content > div.dragging:not(.hide) *,
#manage-links-popup .content:not(.dragging) > div:hover,
#manage-links-popup .content:not(.dragging) > div:hover *
{
	color: rgb(76, 76, 76) !important;
	fill: rgb(76, 76, 76) !important;
}

#cushows-list > li:hover,
#cushows-list.opened > li.opened,
#cushows-list.opened > li.opened .color > .colors,
#manage-links-popup .content > div.dragging:not(.hide),
#manage-links-popup .content:not(.dragging) > div:hover
{
	background-color: #D2D2D2;
	border: 1px dotted grey;
}


div.entry:not([color]) svg
{
	fill: white !important;
}

div.entry[color="black"] svg,
.cl_added > span:first-child,
.cl_changed > span:first-child,
.cl_removed > span:first-child,
.cl_notfixed > span:first-child,
.cl_fixed > span:first-child
{
	color: black;
	fill: black !important;
}

span.button,
.header,
.header h4
{
	background: rgb(112, 112, 112) !important;
}

.details a,
.day a
{
	color: inherit !important;
}

.header a
{
	color: inherit;
}

body.collapseMulti div.day:not(.expand):not(.opened) div.entry.multif div.title:after
{
	background-color: white;
	border-left: 1px solid black;
}

.details:hover,
.engines:hover
{
	background:none !important;
}

div.date
{
	color: #8c8c8c;
	background-color: #4c4c4c;
}
div.today div.date
{
	background-color: rgb(190, 150, 0);
}
div.today div.date
{
	color: black;
}
div.day,
body.archive div.day
{
	border: 1px solid #595959;
}
body.archive div.day
{
	background-color: #191919;
}
.entry:not([color="white"]) div.details > span.engines > br + div.tools,
.entry:not([color="white"]) div.details,
.entry:not([color="white"]) div.colors,
div.entry
{
	border-top: 1px dashed #4c4c4c;
}

/* highlight opened entry *//*
.entry[opened]
{
	border: 1px solid white;
	border-top: 1px solid white;
}
/*
.entry[opened][color="black"]
{
	border: 1px solid black;
	border-top: 1px solid black;
}
*//*
#resultsBecauseNoOneChecks,
#searchResults .description
{
	color: #b9b2b2;
}

#cushows-list > li.updated,
#cushows-list > li.new
{
	border-width: 1px;
}
#cushows-list > li.edit
{
	border: 1px solid white;
}
#cushows-list > li.selected:not(.edit)
{
	border: 1px dotted white;
}

#cushows-list > li.selected:not(.edit)
{
	color: forestgreeen;
}

#cushows-list > li.edit.delete,
#cushows-list > li.edit.delete > *
{
	color: coral;
}
#searchResults div.entry
{
	border-color: #6c6c6c;
}

#searchResults div.entry.separating
{
	border-color: #aaa;
}
.desc > div.entry
{
	border-top: none;
	border-bottom: 1px dashed #ccc;
}
.desc > div.entry.separating
{
	border-bottom: 1px solid #555;
}
:not(.desc) > div.entry.separating
{
	border-top: 1px solid;
}

#searchIcon > svg
{
	fill: #737373 !important;
	vertical-align: middle;
}

.cookieIconHoles
{
	fill: #000;
}

.warning.info,
.warning.info > a
{
	color: #FFBFBF;
}

div.undoBar *
{
	color: black;
}
/*
END DARK THEME
*//*

*/}, true)
				}//dark theme

			},//themes.list._default

			list: {},

			init: function Settings_themes_nit()
			{
				for (let theme in this._default)
				{
					this.list[theme] = this._default[theme];
				}
				let themes = ls("themes") || {};
				for(let theme in themes)
				{
					this.list[theme] = themes[theme];
				}
				let head = document.getElementsByTagName("head")[0];
				for(let cssName in this.list)
				{
					if (!this.list[cssName].css)
						continue;

					let name = cssName.replace(/[^a-zA-Z0-9_-]/g, "_"),
							id = "theme_" + name,
							style = document.getElementById(id) || document.createElement("style"),
							reg = function(a)
							{
								let r = "body." + id;
								if (a.toLowerCase() != "body")
									r += " " + a;

								return r;
							};

					style.id = id;
					style.innerHTML = this.list[cssName].css.replace(/^(?!\*\/)(body|\w|[\.#\[\:\$@\*])/gm, reg).replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '').replace(/[\n\t]*/g, "");
					head.appendChild(style);
				}
				this.quickOverrideInit();
//				this.quickOverride();
			}, //Settings.themes.init()

			load: function Settings_themes_load(theme)
			{
				if (typeof(theme) == "undefined")
				{
					theme = Settings.prefs.theme;
				}
				else
				{
					Settings.prefs.theme = theme;
					Settings.save();
				}
				let data = Settings.themes.list[theme];
				if (!data)
					data = theme ? Settings.themes.list.dark : Settings.themes.list[""];

				let body = $("body"),
						className = "theme_" + theme;

				if (Settings.themes.prev)
					body.toggleClass(Settings.themes.prev, false);

				if (theme)
				{
					body.toggleClass(className, true);
					Settings.themes.prev = className;
				}
				let disqusFrameRemoved = false,
						disqusDiv = document.getElementById("disqus_thread");

				disqusDiv && disqusDiv.addEventListener('DOMNodeInserted', e =>
				{
					if (e.target.tagName != "IFRAME")
						return;

//          $("#disqus_recommendations").remove();
					e.target.addEventListener("load", e=>
					{
//						if (!disqusFrameRemoved && disqusDiv.querySelector("iframe") === e.target)
//							return e.target.parentNode.removeChild(e.target);
						if (!e.target.src)
							try{return e.target.parentNode.removeChild(e.target);}catch(er){return;} //remove ads

						try
						{
							e.target.contentWindow && e.target.contentWindow.postMessage({id: "ade", func: "disqusTheme", args: [data.isDark], return: null}, "https://disqus.com");
						}
						catch(er){console.log(er);}
					});
				}, false);
				$("#disqus_thread").find('iframe[src^="https://disqus.com"]').each(function(o)
				{
					try
					{
						this.contentWindow.postMessage({id: "ade", func: "disqusTheme", args: [data.isDark], return: null}, "https://disqus.com");
					}
					catch(er){console.log(er);}
				});
				$("select#theme").val(theme);
			},//Settings.themes.load()

			getCustomThemes: function Settings_themes_getCustomThemes()
			{
				let themes = Object.assign({}, this.list);
				for(let t in this._default)
				{
					if (t in themes && themes[t] == this._default[t])
					delete themes[t];
				}
				return themes;
			},

			quickOverrideStyle: [],
			quickOverrideInit: function Settings_themes_quickOverrideInit()
			{
				if (this.quickOverride.inited)
					return;

				for( let i in Settings.prefs.themeColors)
				{
					let id = "CSS_override_" + i;
					if (document.getElementById(id))
						continue;

					this.quickOverrideStyle[i] = document.createElement("style");
					this.quickOverrideStyle[i].id = id;
					document.getElementsByTagName("head")[0].appendChild(this.quickOverrideStyle[i]);
				}
				this.quickOverride.inited = true;
			},

			quickOverride: function Settings_themes_quickOverride(data, commonOnly)
			{

				if (typeof(data) != "object")
					data = Settings.prefs.themeColors;

				for(let i in data)
				{

					let val = "" + data[i],
							c1 = "",
							c2 = "",
							r = this.quickOverrideTempl._common.css,
							css = "";

					if (val.length == 3)
					{
						val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
					}
					c1 = val;
					if (val)
						c2 = new Colors().setColor(val).rgbaMixBlack.luminance > 0.22 ? "000" : "FFF";

					if (val && !commonOnly)
						r += this.quickOverrideTempl[i].css || "";

					r = r	.replace(/\{ID\}/g, i)
								.replace(/\{C1\}/g, c1)
								.replace(/\{C2\}/g, c2);

					if (val)
						css += r;

					this.quickOverrideStyle[i].innerHTML = css;
					if (this.quickOverrideStyle[i].nextSibling)
					{
						document.getElementsByTagName("head")[0].appendChild(this.quickOverrideStyle[i]);
					}
				}
			},//Settings.themes.quickOverride()

			quickOverrideTempl:
			{
				_common:
				{
					css: multiline(function(){/*
#themeColorBox_{ID} > .color
{
	background-color: #{C1} !important;
	color: #{C2} !important;
}
/*
#themeColorBox_{ID} > .color
{
	border-color: #{C2} !important;
}*//*
				*/})
				},

				today:
				{
					css: multiline(function(){/*
.example_today,
div.today > .date
{
	color: #{C1} !important;
	fill: #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Today text",
					sample: "today"
				},

				todayBg:
				{
					css: multiline(function(){/*
.example_today,
div.today > .date
{
	background-color: #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Today background",
					sample: "today"
				},

				todayBorder:
				{
					css: multiline(function(){/*
.example_today,
div.today
{
	border-color: #{C1} !important;
	-webkit-box-shadow: 0px 0px 10px 0px #{C1} !important;
	-moz-box-shadow:    0px 0px 10px 0px #{C1} !important;
	box-shadow:         0px 0px 10px 0px #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Today border",
					sample: "today"
				},

				bg:
				{
					css: multiline(function(){/*

.example_text,
.example_day,
body,
body[class*="theme_"]
{
	background-color: #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Background",
//					sample: "text,day"
					sample: "text"
				},

				text:
				{
					css: multiline(function(){/*
.example_text,
body #content > :not(.popup) #searchIcon > svg,
body[class*="theme_"] > :not(.popup) #searchIcon > svg,
body #content > :not(.popup),
body[class*="theme_"] > :not(.popup)  svg,
body #content > :not(.popup)  svg
body[class*="theme_"] > :not(.popup),
body #content > :not(.popup)  a
{
	color: #{C1} !important;
	fill: #{C1} !important;
}
				*/}),

/*					css: multiline(function(){/*
.example_text,
body #content > :not(.popup) > *:not(.days),
body #content > :not(.popup) > *:not(.days) *,
body[class*="theme_"] > :not(.popup) > *:not(.days) *,
body #content > :not(.popup) > :not(.days),
body #content > :not(.popup) > :not(.days) a,
body[class*="theme_"] > :not(.popup) > :not(.days) a
{
	color: #{C1} !important;
	fill: #{C1} !important;
}
*/
//					}),
					title: "Leave empty to use theme's color",
					label: "Text",
					sample: "text"
				},

/*				day:
				{
					css: multiline(function(){/*
.example_day,
div.entry:not([color]),
body[class*="theme_"] div.entry:not([color])
{
	color: #{C1} !important;
	fill: #{C1} !important;
}
*/
/*					}),
					title: "Leave empty to use theme's color",
					label: "Day text",
					sample: "day"

				},
*/
				date:
				{
					css: multiline(function(){/*

.example_date,
body div.day:not(.today) div.date,
body[class*="theme_"] div.day:not(.today) div.date
{
	color: #{C1} !important;
	fill: #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Date text",
					sample: "date"
				},

				dateBg:
				{
					css: multiline(function(){/*
.example_date,
body div.day:not(.today) div.date,
body[class*="theme_"] div.day:not(.today) div.date
{
	background-color: #{C1} !important;
}
.example_date,
body div.day:not(.today),
body[class*="theme_"] div.day:not(.today)
{
	border-color: #{C1} !important;
}
				*/}),
					title: "Leave empty to use theme's color",
					label: "Date background",
					sample: "date"
				}
			},//quickOverrideTempl

			save: function themesSave()
			{
				ls("themes", this.getCustomThemes());
			},
		},//themes

		lastUpdate: new Date(),
		lastUpdateDiv: null,
		lastUpdateShow: function Settings_lastUpdateShow()
		{
			if (!this.lastUpdateDiv)
			{
				this.lastUpdateDiv = document.createElement("span");
				this.lastUpdateDiv.className = "lastupdate";
				const footer = document.querySelector("div.footer");
				footer && footer.appendChild(this.lastUpdateDiv);
			}
			this.lastUpdateDiv.textContent = "Page updated " + this.lastUpdate;
		}
	};//Settings

	Object.seal(Settings);

	let episodeTools = (function()
	{
		const SEID = 1000000;
		function fromNode(node)
		{
			let r;
			if (node._episode)
				r = node._episode;
			else
			{
				r = node._title && node._title._titleDefault ? node._title._titleDefault : $(node).find("div.title").text();
				r = r.substring(r.lastIndexOf(" ") + 1).replace(/\s+$/g, "").trim();
				if (!r.match(/(^S[0-9]+)?E[0-9]+$/i))
					return "";
			}
			return r;
		}
		return {
			id: function episodeTools_id(s, e)
			{
				s = this.split(s, e);
				e = s[1];
				s = ~~s[0];
				return typeof(e) == "undefined" ? s : s * SEID + ~~e;
			},

			id2se: function episodeTools_id2se(se)
			{
				se = ~~se;
				return  [Math.floor(se / SEID), se % SEID];
			},

			full: function episodeTools_full(s, e)
			{
				if (s instanceof HTMLElement)
					s = fromNode(s);

				if (typeof(e) == "undefined" && typeof(s) == "number" && s >= SEID)
					s = this.id2se(s);

				if (s instanceof Array)
				{
					e = s[1];
					s = s[0];
				}

				if (typeof(e) == "undefined" && typeof(s) == "string")
					return s.replace(/^\s*(S?0*([0-9]+)?E)?0*([0-9]+)\s*$/i, function(a, b, c, d)
					{
						return (~~c ? "S" + pad(~~c) : "") + "E" + pad(~~d);
					});

				if (typeof(e) == "undefined")
				{
					e = s;
					s = 0;
				}

				s = ~~s;
				e = ~~e;
				return (s ? "S" + pad(s) : "") + "E" + pad(e);
			},

			short: function episodeTools_short(s, e)
			{
				if (s instanceof HTMLElement)
					s = fromNode(s);

				if (typeof(e) == "undefined" && typeof(s) == "number" && s >= SEID)
					s = this.id2se(s);

				if (s instanceof Array)
				{
					e = s[1];
					s = s[0];
				}

				if (typeof(e) == "undefined" && typeof(s) == "string")
					return s.replace(/^\s*(S?0*([0-9]+))?E0*([0-9]+)|0*([0-9]+)\.0*([0-9]+)\s*$/i, "$2$4E$3$5").replace(/^E/, "");

				return ("" + (typeof(e) == "undefined" ? ~~s : ~~s + "E" + ~~e)).replace(/^0*E*/, "");
			},

			split: function episodeTools_split(s, e)
			{
				if (s instanceof HTMLElement)
					s = fromNode(s);

				if (typeof(e) == "undefined" && typeof(s) == "number" && s >= SEID)
					s = this.id2se(s);

				if (s instanceof Array)
				{
					e = s[1];
					s = s[0];
				}

				let m = ("" + (typeof(e) == "undefined" ? s : s + "E" + e)).match(/^\s*(S?0*([0-9]+)?E+)?0*([0-9]+)\s*$/i);
				if (m)
					return [~~m[2], ~~m[3]];

				return typeof(e) == "undefined" ? [0, ~~s] : [~~s, ~~e];
			}
		};
	})();

	function fileLoad(callback, ext)
	{
		let f = document.createElement("input");
		f.type = "file";
		if (typeof(ext) == "undefined")
			ext = ".json";

		if (ext)
			f.setAttribute("accept", ext);

		function readFile(e)
		{
			f.removeEventListener("change", readFile, false);
			let files = f.files;
			if (!f.files.length)
			{
				alert('Please select a file!');
				return;
			}
			let reader = new FileReader();

			reader.onloadend = function(evt)
			{
				if (evt.target.readyState == FileReader.DONE)
				{
					callback(evt.target.result);
				}
			};

			let blob = f.files[0].slice(0, f.files[0].size);
			reader.readAsBinaryString(blob);
		}
		f.addEventListener("change", readFile, false);
		f.click();
	}

	function fileSave(name, data, type)
	{
		type = type ? type : 'text/json';
		let blob = new Blob([data], {type: type}),
				a = document.createElement("a");

		a.download = name;
		a.isTrigger = true;
		a.href = window.URL.createObjectURL(blob);
		a.dataset.downloadurl = [type, a.download, a.href].join(':');
		$("#account-popup").append(a);
		a.click();
		a.parentNode.removeChild(a);
	}

	function exportGetColors()
	{
		return Object.keys(DB.savedColors).map(function(i)
		{
			if (i.match(/[^0-9]/) || !DB.savedColors[i].match(/^#([0-9A-F]{6})|FFFFFF$/i))
				return;

			return i + "=" + DB.savedColors[i].trim();
		}).join(";");

	}

	function pad(t, s, n)
	{
		n = n || 2;
		n = Math.max(n, ~~(("" + t).length));
		s = String(s || "0").repeat(n);
		return (s + t).substr(-n);
	}

	function dateTimestamp()
	{
		let d = new Date();
		return d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
	}

	function enginesBackup()
	{
		if (!enginesBackup.backup)
			enginesBackup.backup = window.engines;
	}

	function enginesRestore()
	{
		if (enginesBackup.backup)
		{
			window.engines = enginesBackup.backup;
			enginesBackup.backup = null;
		}
	}

	function enginesAdd(id)
	{
		for(let i = 0; i < _engines.length; i++)
		{
			if (_engines[i].name == id || _engines[i].host == id)
				return;
		}
		for(let i = 0; i < engines.length; i++)
		{
			if (engines[i].name == id || engines[i].host == id)
			{
				_enginesList.push(engines[i].host);
				_engines.push(engines[i]);
				Settings.pref("middleClick", _enginesList);
				return;
			}
		}
	}

	function enginesRemove(id)
	{
		for(let i = 0; i < _engines.length; i++)
		{
			if (_engines[i].name == id || _engines[i].host == id)
			{
				let n = _enginesList.indexOf(_engines[i].host);
				if (n != -1)
					_enginesList.splice(n, 1);

				Settings.pref("middleClick", _enginesList);
				_engines.splice(i, 1);
				return;
			}
		}
	}

	function enginesCheck(id)
	{
		for(let i = 0; i < _engines.length; i++)
		{
//			if (_engines[i].name == id || _engines[i].host == id)
			if (_engines[i].host == id)
				return i;
		}
		return -1;
	}

	function enginesFind(id, obj, field)
	{
		obj = typeof(obj) == "undefined" ? window.engines : obj;
		for(let i = 0; i < obj.length; i++)
		{
			if ((field && obj[i][field] == id) || (!field && (obj[i].name == id || obj[i].host == id)))
				return i;
		}
		return -1;
	}

	function enginesSort(list, save)
	{
		if (typeof(list) == "undefined")
		{
			list = ls("enginesSort") || [];
			save = true;
		}

		let newList = [],
				newEnginesList = [],
				engs = [window.engines, customLinks._list];

		for(let i = 0; i < list.length; i++)
		{
			for(let n = 0; n < engs.length; n++)
			{
				let index = enginesFind(list[i], engs[n], "host");
				if (index == -1 || newList.indexOf(engs[n][index].host) != -1)
					continue;

				newEnginesList[newEnginesList.length] = engs[n][index];
				newList[newList.length] = engs[n][index].host;
				break;
			}
		}
		for(let i = 0; i < window.engines.length; i++)
		{
			if (newList.indexOf(window.engines[i].host) == -1)
			{
				newEnginesList[newEnginesList.length] = window.engines[i];
				newList[newList.length] = window.engines[i].host;
			}
		}
		for(let i in customLinks._list)
		{
			if (newList.indexOf(i) == -1)
			{
				newEnginesList[newEnginesList.length] = customLinks._list[i];
				newList[newList.length] = i;
			}
		}

		if (save)
			enginesSort._list = newList;

		window.engines = newEnginesList;
	}

	enginesSort.changed = function()
	{
		let list = [];
		for (let i = 0; i < enginesDefault.length; i++)
		{
			list[list.length] = enginesDefault[i].host;
		}
		for (let i in customLinks._list)
		{
			if (list.indexOf(i) == -1)
				list[list.length] = i;
		}
		return !isEqual(list, enginesSort._list);
	};

	function isEqual (a, b)
	{
		if (typeof(a) == "undefined" || typeof(b) == "undefined")
			return false;

		for(let i in a)
		{
			if (typeof(a[i]) == "object")
			{
				if (!isEqual(a[i], b[i]))
					return false;
			}
			else if (!(i in b) || a[i] != b[i])
				return false;
		}
		for(let i in b)
		{
			if (typeof(b[i]) == "object")
			{
				if (!isEqual(a[i], b[i]))
					return false;
			}
			else if (!(i in a) || a[i] != b[i])
				return false;
		}
		return true;
	}

	function cleanName(id)
	{
		return id !== null ? id.replace(/[^a-zA-Z0-9-_]/g, "_") : "";
	}

	function getHost(url)
	{
		let a = document.createElement('a');
		a.href = url;
		return a.hostname;
	}

	function engineFixHost(engine)
	{
		if (engine.host)
			return;

		engine.host = getHost(engine.href);
	}

	function showHide(id, t)
	{
		let hidden = _hidden.indexOf(id);
		if (typeof(t) == "undefined")
			return hidden != -1;

		if (t == 2)
			t = hidden == -1 ? 1 : 0;

		switch(t)
		{
			case 0:
				_hidden.splice(hidden, 1);
				if (!DB.savedColors[id])
					DB.infoRemove(id);

				hidden = false;
				break;
			case 1:
				if (hidden == -1)
				{
					_hidden.push(id);
					DB.infoAdd(id);
				}

				hidden = true;
				break;
		}
		let css = $("#css" + id);
		if (hidden)
		{
			if (!css.length)
			{
				let style = "<style id='css" + id + "'>"+
										"div.calendar:not(.showHidden).activeOnly .entry[data-series-id='" + id + "'][opened]:not(.multi){ display: block !important; }"+
										"div.calendar:not(.showHidden) .entry[data-series-id='" + id + "']:not([opened]):not(.searchResult){ display: none !important; }"+
										".entry[data-series-id='" + id + "'] .title{ font-style: italic; }"+
										"div:not(#searchResults) > .entry[data-series-id='" + id + "']:not([opened]):not(.searchResult){ opacity: 0.3;}"+
										".entry[data-series-id='" + id + "'] .showhide0{ display: inline; }"+
										".entry[data-series-id='" + id + "'] .showhide1{ display: none; }"+
										"</style>";
				$(style).appendTo("body");
			}
		}
		else
			css.remove();

		ls("hidden", _hidden);
		return hidden;
	}

	function command(id, val)
	{
		if (!command.list[id])
			return false;

		try
		{
			command.list[id].func({preventDefault:function(){},stopPropagation:function(){}}, val);
		}
		catch(er)
		{
			return false;
		}
		return true;
	}

	command.list = {};
	command.add = function(id, objId, func)
	{
		command.list[id] = {
			id: id,
			objId: objId,
			func: func
		};
	};

	/* watched checkbox */
	function watched(entry)
	{
		if (entry._input.checked)
			watched.add(entry.getAttribute("data-series-id"), entry);
		else
			watched.remove(entry.getAttribute("data-series-id"), entry);

		watched.update(entry, entry._input.checked);
	}

	watched._list = ls("watched") || {};
	watched._saving = false;
	watched.add = function(id, episode)
	{
		episode = episodeTools.short(episode);

		if (!watched._list[id])
			watched._list[id] = [];

		if (watched._list[id].indexOf(episode) == -1)
			watched._list[id].push(episode);

		watched.save();
	};

	watched.remove = function(id, episode)
	{
		if (!watched._list[id])
			return;

		episode = episodeTools.short(episode);

		let n = watched._list[id].indexOf(episode);
		if (n == -1)
			return;

		watched._list[id].splice(n, 1);
		if (!watched._list[id].length)
			delete watched._list[id];

		watched.save();
	};

	watched.save = function(f)
	{
		if (watched._saving && !f)
			return;

		function func()
		{
			watched._saving = false;
			ls("watched", watched._list);
		}
		clearTimeout(watched._saving);
		if (f)
			func();
		else
			watched._saving = setTimeout(func, 500);
	};

	watched.has = function(entry)
	{
		let id = entry.getAttribute("data-series-id");
		return watched._list[id] && watched._list[id].indexOf(episodeTools.short(entry)) != -1;
	};

	watched.update = function(entry, enable)
	{
		if (enable)
			entry.setAttribute("watched", "");
		else
			entry.removeAttribute("watched");

		let span = $(entry).find(".title > span")[0];
		entry.title = span.lastChild ? span.lastChild.textContent : span.textContent;// + " (" + text + ")";
		entry._input.checked = enable;
		watched.checkboxTooltip(entry);
	};

	watched.checkboxTooltip = function(entry)
	{
		let input = entry.querySelector('input[type="checkbox"]');
		input.title = input.checked ? "Watched" : "Not watched";
		if (entry.parentNode.id == "searchResults" || entry.classList.contains("searchResult"))
			input.title += "\n\nHold SHIFT key to check/uncheck all previous episides";
	};

	watched.attach = function(i,entry)
	{
		if (entry._input)
			return;

		let input = document.createElement("input"),
				id = entry.dataset.seriesId,
				episodeID = episodeTools.id(entry);

		setEpisodes([entry]);
		input.type = "checkbox";
		input.checked = watched.has(entry);
		entry._input = input;

		input.addEventListener("mouseover", function(e)
		{
			watched.checkboxTooltip(entry);
		}, false);
		input.addEventListener("click", function(ev)
		{
			let isBatch = ev.shiftKey && (entry.parentNode.id == "searchResults" || entry.classList.contains("searchResult") && document.getElementById("searchBecauseNoOneChecks").value.trim() == "info:" + id);

			$('div.entry[data-series-id="' + id + '"]').each(function(i, _entry)
			{
				let _episodeID = episodeTools.id(_entry);

				if (_episodeID == episodeID || (isBatch && _episodeID < episodeID))
				{
					_entry._input.checked = input.checked;
					watched(_entry);
				}

			});
		}, false);
		let title = $(entry).find(".title")[0],
				text = "",
				div = null;

		if (!title)
			return;

		for(let i = 0; i < title.childNodes.length; i++)
		{
			if (title.childNodes[i].nodeType == 3)
			{
				text += title.childNodes[i].textContent;
			}
			else
				div = title.childNodes[i].cloneNode(true);
		}
		title.innerHTML = "";
		title.appendChild(input);
//		if (div)
//			$(title).append(div)

		let span = document.createElement("span");
		title.appendChild(span);
		if (div)
			span.appendChild(div);
		let titleSpan = document.createElement("span");
		titleSpan.textContent = text.trim();
		span.appendChild(titleSpan);
		if (!entry._title)
		{
			entry._title = titleSpan;
			entry._title._titleDefault = titleSpan.textContent;
			entry.setAttribute("data-title", titleSpan.textContent);
		}
		entry._title.textContent = episodeNumberFix(id, entry._title.textContent);
		watched.update(entry, input.checked);
	}; //watched.attach()


	/* custom links */
	function customLinks(obj)
	{

	}
	customLinks._list = ls("customLinks") || {};
	customLinks.show = function(noBack)
	{
		let div = $(customLinks.div);

		hidePopups();
		div.show();
		setPopup(true);
	};
	customLinks.hide = function()
	{
		$(customLinks.div).hide();
		setPopup(false);
	};

	customLinks.manager = function customLinksManager(callback)
	{
		if (customLinks.div)
			return callback ? callback() : true;

		let html = multiline(function(){/*
	<div id="manage-links-popup" class="popup">
		<div id="manage-links-popup-content">
			<div class="header">
				<div class="back" title="Back">
					{SVG-BACK}
				</div>
				<h4>Links Manager</h4>
				<div class="close" title="Close">
					{SVG-CLOSEHOVER}
					{SVG-CLOSE}
				</div>
			</div>
			<div class="content"></div>
		</div>
	</div>
			*/});//html

		let popup = $(html).appendTo("#content");
		customLinks.div = popup[0];
		$(popup).find("[id^=account]").each(function()
		{
			this.id = this.id.replace("account", "manage-links");
		});

		let content = $(popup).find(".content").html("");
		html = multiline(function(){/*
	<div class="reset">
		<span>
			<a id="sort-reset" href="#">reset sort</a>
		</span>
	</div>
	<form id="engine-form">
		<div id="engine-edit">
			<div>
				<label>Name:</label>
				<div>
					<input id="engine-name">
				</div>
			</div>
			<div>
				<label>URL:</label>
				<div class="engine-url">
					<input id="engine-url">
					<select id="engine-tags" size="1">
						<option value=""></option>
						<option value="MONKEY_N">Name</option>
						<option value="MONKEY_N_REGEXP">Name (RegExp)</option>
						<option value="MONKEY">Name+Episode</option>
						<option value="MONKEY_REGEXP">Name+Episode (RegExp)</option>
						<option value="MONKEY_ID">ID</option>
						<option value="{WIKI_TITLE}">Wiki page</option>
						<option value="MONKEY_ARCHIVELINK">Archive link</option>
						<option value="{YEAR}">Year</option>
						<option value="{MONTH}">Month</option>
						<option value="{DAY}">Day</option>
					</select>
				</div>
			</div>
			<div>
				<label>ID:</label>
				<div>
					<input id="engine-id" placeholder="&lt;optional&gt;">
				</div>
			</div>
			<div>
				<label>Icon:</label>
				<div>
					<input id="engine-icon" placeholder="&lt;optional&gt;">
				</div>
			</div>
			<div title="You can add multiple regular expressions separated by new line">
				<label><a href="https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">RegExp</a>:</label>
				<div class="engine-regexp">
					<textarea id="engine-regexp" placeholder="&lt;regular expressions&gt;" title="Regular expression, one per line"></textarea>
					<textarea id="engine-regexp-replace" placeholder="&lt;replace&gt;" title="Replacement string, one per line" ></textarea>
				</div>
			</div>
			<div>
				<label></label>
				<div class="action">
					<input id="engine-submit" type="submit" value="Submit">
					<input id="engine-reset" type="reset" value="Clear">
				</div>
			</div>
			<div>
				<label>Result:</label>
				<div id="engine-res"></div>
			</div>
		</div>
	</form>
		*/});//html

		$(html).appendTo(content.parent());
		let engId = $("#engine-id"),
				engUrl = $("#engine-url"),
				engIcon = $("#engine-icon"),
				engName = $("#engine-name"),
				engForm = $("#engine-form"),
				engSubmit = $("#engine-submit"),
				engTags = $("#engine-tags"),
				engRes = $("#engine-res"),
				engReset = $("#engine-reset"),
				engSortReset = $("#sort-reset"),
				engResHidden = $('<div id="engine-hidden" class="entry" data-series-id="1234" data-series-source="List of Monsuno episodes" data-date="20120223"><div class="title">Monsuno S01E01</div></div>').appendTo(popup),
				engRegexp = $("#engine-regexp"),
				engRegexpReplace = $("#engine-regexp-replace"),
				entry = $("div.entry");

		if (entry.length)
		{
			entry = $(entry[rand(0, entry.length)]);
			engResHidden.attr("data-series-id", entry.attr("data-series-id"));
			engResHidden.attr("data-series-source", entry.attr("data-series-source"));
			engResHidden.attr("data-date", entry.attr("data-date"));
			engResHidden.find("div.title").text(entry.find("div.title").text());
		}

		setAttr(popup, "changed", enginesSort.changed());

		function change(e)
		{
			clearTimeout(change.timer);
			change.timer = setTimeout(function()
			{
				engResHidden.find(".details").remove();
				let txt = engRegexp.val().trim(),
						reg = getRegexp(txt, engRegexpReplace.val().trim()),
						ok = txt ? reg.length : true;

				regexpCheck(reg);

				let eng = [{
							name: engName.val(),
							host: engId.val().trim(),
							href: engUrl.val().trim(),
							icon: engIcon.val().trim(),
							regexp: reg
						}];

				if (!eng[0].href.match(/[a-z]+:\/\//i))
					eng[0].href = "http://" + eng[0].href;

				engineFixHost(eng[0]);
				entryOpen({target: $(engResHidden).find(".title")[0]}, eng);

				let list = engResHidden.find(".engines").children(),
						a = list.filter("a"),
						img = a.find("img")[0],
						children = engRes.children(),
						domain = getHost(eng[0].href) || null;
				img.setAttribute("src", eng[0].icon ? eng[0].icon : "https://www.google.com/s2/favicons?domain=" + domain);

				engRes.html("");
				if (domain || a.text())
					engRes.append(a);

				return;
			}, 300);
			buttonsUpdate();
		}//change()

		function buttonsUpdate()
		{
			engSubmit.prop("disabled", !engName.val().trim() || !engUrl.val().trim() || engRegexp.hasClass("error"));
			engReset.prop("disabled", !(engName.val().trim() + engId.val() + engUrl.val() + engIcon.val() +  engRegexp.val() + engRegexpReplace.val()));
		}


		engId.on("input change", change);
		engIcon.on("input change", change);
		engUrl.on("input change", change);
		engName.on("input change", change);
		engTags.on("change", function(e)
		{
			let start = engUrl[0].selectionStart,
					end = engUrl[0].selectionEnd,
					endNew = start + e.target.value.length,
					startNew = endNew,
					txt = engUrl.val();
			engUrl.val(txt.substring(0, start) + e.target.value + txt.substring(end));
			engUrl[0].selectionStart = startNew;
			engUrl[0].selectionEnd = endNew;
			engUrl.focus();
			engUrl.trigger("input");
			e.target.value = "";
		});

		function regexpCheck(reg)
		{
			let txt = engRegexp.val().trim();
			if (!reg)
				reg = getRegexp(txt, "");

			let ok = txt ? reg.length : true;
			engRegexp.toggleClass("error", !ok);
		}
		engRegexp.on("input change", change);
		engRegexpReplace.on("input change",change);
		engReset.click(function(e)
		{
			clearTimeout(change.timer);
			engRes.html("");
			setTimeout(buttonsUpdate);
		});
		buttonsUpdate();
		function flash(obj, color, scroll)
		{
			if (!obj[0].parentElement)
				return;

			let p = obj[0].parentElement.getBoundingClientRect(),
					el = obj[0].getBoundingClientRect();
			if (typeof(scroll) == "undefined")
				scroll = true;

			if (scroll)
			{
				if (p.bottom < el.bottom)
				{
					obj[0].parentElement.scrollTop = obj[0].parentElement.scrollTop + (el.top - p.bottom) + el.height + 3;
				}
				if (el.top < p.top)
				{
					obj[0].parentElement.scrollTop = obj[0].parentElement.scrollTop + (el.bottom - p.top) - el.height - 3;
				}
			}

			obj.toggleClass("update", false);
			obj.css("background-color", color ? color : "#90FF90");
			setTimeout(function()
			{
				obj.toggleClass("update", true);
				obj.removeAttr("style");
			}, 100);
		}
		engForm.on("submit", function(e)
		{
			e.preventDefault();
			let reg = getRegexp(engRegexp.val().trim(), engRegexpReplace.val());
			let engine = {
						name: engName.val().trim(),
						href: engUrl.val().trim(),
						host: engId.val().trim(),
						icon: engIcon.val().trim()
					};
			if (engine.icon === "")
				delete engine.icon;

			if (reg.length)
			{
				engine.regexp = reg;
			}
			if (!engine.href.match(/[a-z]+:\/\//i))
				engine.href = "http://" + engine.href;

//			engUrl.val(engine.href);
			engineFixHost(engine);
			let id = "engine_" + cleanName(engine.host),
					update = $("#" + id),
					exists = customLinks._list[engine.host];

			if (!engine.name || !engine.href || engine.href == "http://")
				return false;

			let equal = false,
					n = -1;

			for(let i = 0; i < window.engines.length; i++)
			{
				if (window.engines[i].host == engine.host)
				{
					equal = isEqual(window.engines[i], engine);
					n = i;
					break;
				}
			}
			if (equal)
			{
				flash(update);
				return false;
			}

			if (!exists || update.length)
			{
				customLinks._list[engine.host] = engine;
				if (update.length)
				{
					if (n > -1)
						window.engines[n] = engine;

				}
				else
					window.engines.push(engine);

				ls("customLinks", customLinks._list);
				customLinksAddCss(id);
			}
			function updater(update)
			{
				flash($(update));
				updateDetails();
			}
			if (update.length)
			{
				if (exists)
				{
					for (let i = 0; i < enginesDefault.length; i++)
					{
						if (isEqual(enginesDefault[i], engine))
						{
							update.find(".del").trigger("click");
							updateDetails();
							return;
						}
					}
				}
				update.replaceWith(create(engine, !exists ? updater : function(update)
				{
					flash($(update));
				}));
				let entry = $("div.entry").find(".engines");
					entry.each(function()
					{
						$(this).find("." + id).filter("a.link").attr("href", parseLink(this.parentNode.parentNode, engine).href).contents().filter(function()
						{
							if (this.nodeType === 3)
								this.textContent = engine.name;
						});
					});
			}
			else
			{
				let last = content.children(":last-child");
				content.append(create(engine, updater));
	//			updateDetails();
			}
			engName.val("");
			engId.val("");
			engIcon.val("");
			engUrl.val("");
			engRegexp.val("");
			engRegexpReplace.val("");
			buttonsUpdate();
			updateDetails();
		});//engForm.submit()

		function updateDetails()
		{
			let clone = engResHidden.clone();
			clone.find(".details").remove();
			$("body").append(clone);
			let opened = $('.details[style="display: block;"]').toggleClass("details", false);
			force = true;
			clone.find(".title").trigger("click");
			opened.toggleClass("details", true);
			setTimeout(function()
			{
				$('div:not([id]) > .details').find(".engines").replaceWith(clone.find(".engines"));
				$('div:not([id]) > .details').find(".engines").each(function()
				{
					for(let i = 0; i < window.engines.length; i++)
					{
						let eng = window.engines[i],
								id = "engine_" + cleanName(eng.host);

						$(this).find("." + id).filter("a.link").attr("href", parseLink(this.parentNode.parentNode, eng).href);
					}
				});
				clone.remove();
			}, 300);
		}
		engSortReset.click(function(e)
		{
	//		e.stopPropagation();
			e.preventDefault();
			let host = engId.val(),
					name = engName.val(),
					href = engUrl.val(),
					icon = engIcon.val(),
					list = [];

			for (let i = 0; i < enginesDefault.length; i++)
			{
				list[list.length] = enginesDefault[i].host;
			}
			for (let i in customLinks._list)
			{
				list[list.length] = customLinks._list[i].host;
			}
			enginesSort(list, true);
			ls("enginesSort", []);
			updateDetails();
			$(customLinks.div).remove();
			customLinks.div = null;
			popup.removeAttr("changed");
			customLinks.manager(function()
			{
				if (host || name || href)
				{
					$("#engine-id").val(host);
					$("#engine-name").val(name);
					$("#engine-icon").val(icon);
					let url = $("#engine-url");
					url.val(href);
					url.trigger("input");
				}
			});
			customLinks.show();
		});
		let dragged = null,
				draggedNext = null;

		document.body.addEventListener('dragover', dndEvent, false);
		content[0].addEventListener('drop', dndEvent, false);
		content[0].addEventListener('dragend', dndEvent, false);
		function dndEvent(e)
		{
			let r = null;
			switch(e.type)
			{
				case "mousedown":
	//				if (typeof(e.target.className) != "string" || e.target.className.indexOf("dndh") != -1)
					if (typeof(e.target.className) == "string" && e.target.className.indexOf("dndh") != -1)
						dragged = e.target.parentNode;
					break;
				case "dragstart":
					if (!dragged)
					{
						return;
					}

					e.dataTransfer.effectAllowed = 'move';
					dragged = this;
					draggedNext = this.nextElementSibling;
					dragged.classList.add("dragging");
					this.parentNode.classList.add("dragging");
					setTimeout(function()
					{
						dragged.classList.add("hide");
					});
//					e.dataTransfer.setData('application/x-moz-node', dragged);
					e.dataTransfer.setDragImage(dragged, 0, 0);
					e.dataTransfer.setData('text/plain', "");
					break;
				case "dragenter":
					if (!dragged)
					{
						if (e.stopPropagation)
							e.stopPropagation();

						if (e.preventDefault)
								e.preventDefault(); // Necessary. Allows us to drop.
						return;
					}

					let node = this,
							up = (node.nextSibling == dragged),
							moveold = up ? node : node.nextSibling,
							movenew = dragged;

					node.parentNode.insertBefore(movenew, moveold);
					break;
				case "dragover":
					if (!dragged)
					{
						if (e.stopPropagation)
							e.stopPropagation();

						if (e.preventDefault)
								e.preventDefault(); // Necessary. Allows us to drop.
						return;
					}
					let p = e.target;
					while(p && p != content[0])
						p = p.parentNode;

					e.dataTransfer.dropEffect = p ? 'move' : "none";

					if (!p)
					{
						if (draggedNext)
							dragged.parentNode.insertBefore(dragged, draggedNext);
						else
							dragged.parentNode.appendChild(dragged);
					}
					if (e.stopPropagation)
						e.stopPropagation();

					if (e.preventDefault)
							e.preventDefault(); // Necessary. Allows us to drop.

					r = false;
					break;
				case "dragleave":
					break;
				case "dragend":
					if (!dragged)
						return;

					dragged.classList.remove("dragging");
					dragged.classList.remove("hide");
					let div = document.querySelectorAll('#manage-links-popup-content .content [draggable]'),
							list = [];
					[].forEach.call(div, function (col)
					{
						list[list.length] = col._engine.host;
					});
					dragged.parentNode.classList.remove("dragging");
					enginesSort(list, true);
					ls("enginesSort", list);
					setAttr(popup, "changed", enginesSort.changed());

					updateDetails();
					dragged = false;
					break;
				case "drop":
					if (!dragged)
						return;

					if (e.stopPropagation)
						e.stopPropagation();
					if (e.preventDefault)
							e.preventDefault(); // Necessary. Allows us to drop.
					break;
			}
			if (r !== null)
				return r;
		}
		function create(engine, callback)
		{
			let div = document.createElement("div"),
					id = "engine_" + cleanName(engine.host),
					cb = createCheckbox(id, "", enginesHide.indexOf(engine.host) == -1, function(e, id, checked)
					{
						if (checked)
							enginesHide.splice(enginesHide.indexOf(engine.host), 1);
						else
							enginesHide.push(engine.host);

						ls("enginesHide", enginesHide);
				}, ["Visible", "Hidden"]),
					dndHandle = document.createElement("span");
			div._engine = engine;
			div.id = id;

			content[0].setAttribute("draggable", true);
			div.setAttribute("draggable", true);
			div.addEventListener('dragstart', dndEvent, false);
			div.addEventListener('dragenter', dndEvent, false);
			div.addEventListener("mousedown", dndEvent, false);

			dndHandle.innerText = "☰";
			dndHandle.className = "dndh";
			div.appendChild(dndHandle);
			div.appendChild(cb);
			let clone = engResHidden.clone();
			$("body").append(clone);
			clone.find(".details").remove();
			entryOpen({target: $(clone).find(".title")[0]}, [engine]);

			let n = 100;
			setTimeout(function loop()
			{
	//			let list = clone.find(".engines").children().filter(".engine_" + cleanName(engine.host)),
				let list = clone.find(".engines").children();
				if (!list.length && n--)
				{
					setTimeout(loop);
					return;
				}
				let	a = list.filter("a"),
						img = a.find("img")[0],
						def = false;

				for (let i = 0; i < enginesDefault.length; i++)
				{
					if (enginesDefault[i].host == engine.host)
					{
						def = true;
						break;
					}
				}

				$(div).append(img);
				$(div).append($("<div></div>").attr("title", a[0].textContent + "\n" + a[0].href).append(a).append('<span title="Custom">*</span>'));
				if (def)
					$(div).toggleClass("def", true);

				clone.remove();
				let editBox = $('<span class="editBox"></span>').appendTo(div);
				$('<span class="edit" title="Edit">' + SVG.edit + '</span>').appendTo(editBox).click(function(e)
				{
					engId.val((getHost(engine.href) == engine.host) ? "" : engine.host);
					engName.val(engine.name);
					engUrl.val(engine.href.replace(/http:\/\//i, ""));
					engIcon.val(engine.icon || "");
					let reg = engine.regexp || [],
							regexp = [],
							repl = [];
					for(let i = 0; i < reg.length; i++)
					{
						regexp[regexp.length] = reg[i][0];
						repl[repl.length] = reg[i][1];
					}
					engRegexp.val(regexp.join("\n"));
					engRegexpReplace.val(repl.join("\n"));
					engRegexp.trigger("input");
					engId.trigger("input");
				});
				if (customLinks._list[engine.host])
				{
					$('<span class="del" title="' + (def ? "Clear" : "Delete") + '">' + SVG.del + '</span>')
						.appendTo(editBox)
						.click(function(e)
					{
						e.stopPropagation();
						e.preventDefault();
						flash($("#" + id), e.isTrigger ? null : "#FF9090");
						let scroll = $(customLinks.div).find(".content")[0].scrollTop;
						let _engine = Object.assign(Array.isArray(engine) ? [] : {}, engine);
						setTimeout(function()
						{
							let host = engId.val(),
									name = engName.val(),
									href = engUrl.val(),
									icon = engIcon.val(),
									engine = _engine,
									update = false;

							delete customLinks._list[engine.host];

							for(let i = 0; i < window.engines.length; i++)
							{
								if (window.engines[i].host == engine.host)
								{
									for(let d = 0; d < enginesDefault.length; d++)
									{
										if (enginesDefault[d].host == engine.host)
										{
											update = d;
											break;
										}
									}
									if (update !== false)
										window.engines[i] = enginesDefault[update];
									else
									{
										let index = enginesSort._list.indexOf(engine.host);

										if (index != -1)
										{
											enginesSort._list.splice(i, 1);
											ls("enginesSort", enginesSort._list);
										}
										window.engines.splice(i, 1);
									}
									break;
								}
							}
							ls("customLinks", customLinks._list);
							if (update === false)
							{
								$("#" + id).remove();
								$(".engines").find("." + id).remove();
								$("." + id).toggleClass(id, false);
								$("#css_" + id).remove();
								let index = enginesHide.indexOf(engine.host);
								if (index != -1)
								{
									enginesHide.splice(index, 1);
									ls("enginesHide", enginesHide);
								}
							}
							$(customLinks.div).remove();
							customLinks.div = null;
							customLinks.manager(function()
							{
								if (update !== false)
								{
									for(let i = 0; i < window.engines.length; i++)
									{
										if (window.engines[i].host == engine.host)
										{
											engine = Object.assign(Array.isArray(window.engines[i]) ? [] : {}, window.engines[i]);
											break;
										}
									}
									let aNew = $("#manage-links-popup").find("#" + id).find("a.link");
									$('.details')
										.find(".engines")
										.find("a." + id)
										.each(function()
										{
											$(this).attr("href", parseLink(this.parentNode.parentNode.parentNode, engine).href);
										})
										.contents()
										.filter(function()
										{
											if (this.nodeType === 3)
												this.textContent = aNew.text();
										});

								}
								if (host || name || href)
								{
									$("#engine-id").val(host);
									$("#engine-name").val(name);
									$("#engine-icon").val(icon);
									let url = $("#engine-url");
									url.val(href);
									url.trigger("input");
								}
								if (scroll)
									$(customLinks.div).find(".content")[0].scrollTop = scroll;
							});
							customLinks.show();
							updateDetails();
						}, 300);
					});
				}
				if (callback)
					callback(div);
			});
			return div;
		}//create();
	//	enginesBackup();

		let eng = window.engines,
				n = eng.length;
		function finished()
		{
			if (!--n)
				callback();
		}
		for(let i = 0; i < eng.length; i++)
		{
			if (eng[i].host == "airdates.tv" && eng[i].name == "edit")
				continue;

			content.append(create(eng[i], callback ? finished : null));
		}
	//	setTimeout(enginesRestore,100);
	};//customLinks.manager()

	function customLinksAdd()
	{
		let listNew = [],
				remove = [],
				list = [];
		for(let l in customLinks._list)
		{
			listNew.push(customLinks._list[l]);
		}
		let hosts = [];
		for(let n = 0; n < window.engines.length; n++)
		{
			hosts[hosts.length] = window.engines[n].host;
			enginesDefault[enginesDefault.length] = window.engines[n];
		}
		for(let i = 0; i < listNew.length; i++)
		{
			let n = hosts.indexOf(listNew[i].host);
			if (n != -1)
				window.engines[n] = listNew[i];
			else
				list.push(listNew[i]);

			customLinks._list[listNew[i].host] = listNew[i];
		}
		ls("customLinks", customLinks._list);
		window.engines = window.engines.concat(list);

		enginesSort();
		let css = [],
				css2 = [];

		for (let i = 0; i < window.engines.length; i++)
		{
			let id = "engine_" + cleanName(window.engines[i].host);
			customLinksAddCss(id);
		}
		customLinks.manager();
		$(customLinks.div).remove();
		customLinks.div = null;


	/* middle click on day's title opens selected engines for user's shows */
		_enginesList = Settings.pref("middleClick") || [];
		if (!(_enginesList instanceof Array))
			_enginesList = [];

		let engines = enginesBackup.backup ? enginesBackup.backup : window.engines,
				del = [],
				add = [];

		for(let i = 0; i < _enginesList.length; i++)
		{
			let found = false;
			for (let n = 0; n < engines.length; n++)
			{
				if (engines[n].name == _enginesList[i])
					_enginesList[i] = engines[n].host;

				if (engines[n].host == _enginesList[i])
				{
					_engines.push(engines[n]);

	/*
					if (!i && engines[n].host == "thepiratebay.org")
					{
	// sort by date instead of seeds
						engines[n].href = engines[n].href.replace(/\.se\//, ".org").replace(/\/0\/7\/0$/, "/0/3/0");
					}
	*/
					found = true;
					break;
				}
			}
			if (!found)
				del.push(_enginesList[i]);
		}
		for(let i = 0; i < del.length; i++)
		{
			_enginesList.splice(_enginesList.indexOf(del[i]), 1);
		}
		let l = _enginesList.length;
		try
		{
			_enginesList = Array.from(new Set(_enginesList));
		}catch(er){}

		if (l != _enginesList.length)
			Settings.pref("middleClick", _enginesList);
	}//customLinksAdd()

	function customLinksAddCss(id)
	{
		let css = 'body:not(.' + id + ') .engines .' + id + "{display:none;}",
				css2 = 'body:not(.' + id + ') #' + id + " img";

		css2 += ',body:not(.' + id + ') #' + id + " a.link";
		css2 += "{font-style: italic; opacity: 0.5;}";
		$('<style id="css_' + id + '"></style>').html(css+css2).appendTo("head");
	}

	function setAttr(popup, attr, val)
	{
		if (val)
			popup.attr(attr, true);
		else
			popup.removeAttr(attr);
	}
	/* colors manager */
	function colorsManager()
	{
		let html = multiline(function(){/*
	<div id="colorsmanager" class="popup">
		<div id="colorsmanager-popup-content">
			<div class="header">
				<div class="back" title="Back">
					{SVG-BACK}
				</div>
				<h4>Colors Manager</h4>
				<div class="close" title="Close">
					{SVG-CLOSEHOVER}
					{SVG-CLOSE}
				</div>
			</div>
			<div class="content"></div>
		</div>
	</div>
			*/});//html

		let popup = $(html).appendTo("#content");
		colorsManager.div = popup[0];
	}//colorsManager()

	colorsManager.show = function(noBack)
	{
		let div = $(colorsManager.div);
/*
		if (noBack)
			div.attr("noback", "");
		else
			div.attr("noback");
*/
		hidePopups();
		div.show();
		setPopup(true);
	};

	colorsManager.hide = function()
	{
		$(colorsManager.div).hide();
		setPopup(false);
	};


	function createCheckbox(id, label, cookie, callback, title, className)
	{
		let span = document.createElement("span"),
//				checkon = document.createElement("span"),
//				checkoff = document.createElement("span"),
				a = document.createElement("a"),
				check = typeof(cookie) == "boolean" ? cookie : cs(cookie) ? true : false;
		if (title)
		{
//			checkon.title = title[0];
//			checkoff.title = title[1] || title[0];
			a.title = title[2] || title[0];
		}
		a.className = "checkbox " + id + " " + (typeof(className) == "undefined" ? "filter" : className);
		span.className = "checkbox";
/*
		checkon.className = "checkon nu";
		checkoff.className = "checkoff nu";
		checkon.innerHTML = "☑";
	//	checkon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" /></svg>';
		checkoff.innerHTML = "☐";
	//	checkoff.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" /></svg>';
	//	a.href = "#";
		span.appendChild(checkon);
		span.appendChild(checkoff);
*/
		span.appendChild(document.createTextNode(label));
		a.appendChild(span);
		$(a).insertBefore("#nu-showing");
		let func = function(e, val)
		{
			e.preventDefault();
	//		e.stopPropagation();
			let check = span.hasAttribute("checked");
			if (val !== undefined)
				check = !val;

			if (check)
				span.removeAttribute("checked");
			else
				span.setAttribute("checked", "checked");

			$(".calendar").toggleClass(id, !check);
			$("body").toggleClass(id, !check);
			if (typeof(cookie) != "boolean")
				cs(cookie, check ? 0 : 1);

			return (typeof(callback) == "function") ? callback(e, id, !check) : e;
		};
		command.add(cookie, id, func);
		a.addEventListener("click", func, false);
		if (check)
			span.setAttribute("checked", "checked");

	/*
	//real checkboxes
		let box = document.createElement("span"),
				labelNode = document.createElement("label"),
				checkbox = document.createElement("input"),
				checkboxId = "cb_" + id,
				suf = "",
				i = 1;
		checkbox.type = "checkbox";
		box.className = (typeof(className) == "undefined" ? "filter " : className + " ") + id;
		if (title)
			box.title = title[0];

		labelNode.textContent = label;
		box.appendChild(checkbox);
		box.appendChild(labelNode);

		while($("#" + checkboxId + suf).length)
		{
			suf = "_" + i++;
		}
		checkbox.addEventListener("change", func, false);
		checkbox.id = checkboxId + suf;
		checkbox.checked = check;
		labelNode.setAttribute("for", checkbox.id);
		$(box).insertBefore("#nu-showing");
	*/
		$(".calendar").toggleClass(id, check);
		$("body").toggleClass(id, check);

		return a;
	}

	function rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	(function loop()
	{
		if ((typeof(engines) == "undefined" || !engines.length) && --loopWait)
			return setTimeout(loop, 0);

		if (!loopWait)
			return;

		Settings.init();
		customLinksAdd();
	})();

	Settings.init();
	/*logo*/
	$("body #content > h1 > img").click(function()
	{
		let keys = Object.keys(Settings.themes.list),
				i = keys.indexOf(Settings.prefs.theme);

		if (++i >= keys.length)
			i = 0;

		Settings.themes.load(keys[i]);
	}).attr("src", "data:image/gif;base64,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");


//	$("body").toggleClass("dark", Settings.prefs["theme"] == 1);
	Settings.themes.load();
	// fix highlighting today would remove /u/user ..
	$( "#linkToday" ).click(function linkToday_click(e)
	{
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		_loadArchiveFromPathname("#today", "#today");
		return false;
	});

	let _today,
			showHidden = Settings.pref("showHidden") ? true : false,
			_assignColor = assignColor;

	/*
	work around for expand/collapse same series in one day
	*/
	window.assignColor = function assignColor ( seriesId, color, permanent )
	{
		let r = _assignColor(seriesId, color, permanent),
				css = $("#css_"+seriesId),
				html = css.html();

		if (html)
		{
			if (permanent)
			{
				Settings.prefs.lastColor = html.match(/background-color:#([0-9a-fA-F]{6})/)[1];
				Settings.save();
			}
			css.html(html.replace(/(\s+)(\.activeOnly)([^\{]+)\{/, "$1$2$3:not(.multi),body:not(.collapseMulti) $2$3,$2 .day.expand $3,$2 .day.opened $3{"));
			let col = "#" + new Colors().setColor(color||"#FFF").HEX;
			if (col == "#FFFFFF")
				col = "Remove color";

			css.html(css.html() + '.entry[data-series-id="' + seriesId + '"] .color[title="' + col + '"], li[data-series-id="' + seriesId + '"] .color[title="' + col + '"]{border:1px solid white;border-radius:10px;box-shadow:0px 0px 0px 1px black;}');
			try
			{
				let c = html.match(/ color\:([^;}]+)[;}]/i)[1];
				css.attr("color", c);
				setTimeout(function()
				{
					$('div.entry[data-series-id="' + seriesId + '"]').attr("color", c);
				}, 1000);
			}
			catch(er){log(er);}

		}
		else
		{
			delete css._color;
			setTimeout(function()
			{
				$('div.entry[data-series-id="' + seriesId + '"]').removeAttr("color");
			}, 1000);
		}

		if (permanent && Settings.prefs.myShowsTop)
		{
			sortMyShows();
		}
		return r;
	};
	/*
	fixing browser history inflating after each page refresh and prev/next history jump don't work
	*/
	var prevPath;
	//MS Edge get's /undefined in the address
	if (window.location.pathname.match(/\/undefined/))
	{
		history.go(-1);
		let path = window.location.href;
		history.go(1);
		history.replaceState({}, "", path);
		history.go(-1);
	}

	function _loadArchiveFromPathname(originalPath,highlightSelector)
	{
		let path = originalPath||document.location.pathname;
		var match = path.match(/^\/archive\/([0-9]+)-([0-9]+)$/);
		var ym = match ? (~~match[1]*12+~~match[2]-1) : ymToday;
		if (!document._title)
			document._title = document.title;

		document.title = document._title + (match ? " (" + ~~(ym/12) + "-" + ~~((ym%12)+1) + ")" : "");

	//start fix - browser history inflating after each page refresh
		if (originalPath && prevPath != originalPath)
		{
			prevPath = originalPath;
			history.pushState({originalPath:originalPath,highlightSelector:highlightSelector}, "", originalPath);
		}

	//end fix
		$("#archive-prev").attr("href", "/archive/" + ym2str(ym-1));
		$("#archive-next").attr("href", "/archive/" + ym2str(ym+1));
		$("body").toggleClass("archive", !!match&&match.length==3);
		$("#leaveArchive").text(ym>ymToday?"Leave future":"Leave archive");
		$("#archive-prev2").attr("href", "/archive/" + ym2str(ym-1));
		$("#archive-next2").attr("href", "/archive/" + ym2str(ym+1));
		$("#leaveArchive2").text(ym>ymToday?"Leave future":"Leave archive");
		let whenDone = function(){
			// insert custom shows
			// set title
			$("#archive-current").text((!!match&&match.length==3)?ym2str(ym):"Go waste your time");
			$("#archive-current2").text((!!match&&match.length==3)?ym2str(ym):"Go waste your time");
			// highlight today with a happy yellow background
			$( "div.day[data-date='" + today.getFullYear() + pad( today.getMonth() + 1 ) + pad( today.getDate() ) + "']" ).addClass( "today" ).attr( "id", "today" );
			markSearchResults();

			var $hl = $(highlightSelector||".does-not-exist-and-never-will");
			if($hl.get().length>0){
				// blink
				for( var i = 0; i < 8; i++ ) $hl.animate( {"opacity":i%2}, 1 ).delay( 100 );

				// scroll to
				if (Settings.pref("searchScroll"))
				{
					var val = function(){return $hl.offset().top-Math.max(document.documentElement.clientHeight, window.innerHeight || 0)/2;};
					$('html, body').animate({
								scrollTop: val()
						},{duration:500, step:function(top,info){
							info.end = val();
						}});
				}
			}
	//injecting userscript function execution
			showPast(function()
			{
				customShows();
	//adding watched checkboxes
//				$("div.day > div.entry").each(watched.attach);
	//collapse multiple entries of the same series in one day
				$("div.day").each(function(i, e, c)
				{
					let entries = $(e).find("div.entry");
					for(let n = 0; n < entries.length; n++)
					{
							//adding watched checkboxes
							entries[n]._iOrig = n;
							watched.attach(i, entries[n]);
					}
epDateFix(entries);
					collapseMulti(i, e, c);
//					sortMyShows();
					sortMyShows(Settings.prefs.enableEpDateFix ? undefined : entries);

				});
			});
			showHideLoad();
			Settings.lastUpdate = new Date();
			Settings.lastUpdateShow();
		};//whenDone()

		if(window.ymCurrent != ym)
		{
			$(".days").load("/_archive/" + ~~(ym/12) + "-" + ~~((ym%12)+1), function()
			{
				window.ymCurrent = ym;
				whenDone();
			});
		}
		else
		{
			whenDone();
		}
		_loadArchiveFromPathname.firstRun = true;
	}//_loadArchiveFromPathname(originalPath,highlightSelector)
	window.loadArchiveFromPathname = _loadArchiveFromPathname;
	/*
	end fixing browser history inflating after each page refresh and prev/next history jump don't work
	*/

function epDateFix(_entries)
{
	if (!Settings.prefs.enableEpDateFix)
		return false;

	if (typeof(_entries) == "undefined")
		_entries = $('div.calendar > div.days > div.day > div.entry');

	_entries = _entries.add(epDateFix.div.childNodes);
	if (typeof(epDateFix._list) == "undefined")
		epDateFix._list = ls("epDateFix") || {};

	let list = epDateFix._list,
			days = [];

	for(let id in list)
	{
		let entries = _entries.filter('[data-series-id="' + id + '"]');
//		setEpisodes(entries);
		for (let i = 0; i < entries.length; i++)
		{
			let data = epDateFix.check(id, entries[i]._episodeID);
			if (!data.offset && entries[i]._episode == entries[i].parentNode.dataset.date)
				continue;

			let day = epDateFix.move(entries[i], data.episode, data.offset);
			if (day && days.indexOf(day) == -1)
			{
				days[days.length] = day;
			}
		}
	}
	return days;
}

epDateFix.move = function epDateFix_move(entry, episodeID, offset)
{
	offset = ~~offset;
	let newDate = new _Date(entry._episodeDate.substr(0, 4), entry._episodeDate.substr(4,2) - 1, ~~entry._episodeDate.substr(6,2) + offset);
	newDate = newDate.getFullYear() * 10000 + (newDate.getMonth() + 1) * 100 + newDate.getDate();

	if (entry._episodeID < episodeID)
		return false;

	let day = $('div.calendar > div.days > div.day[data-date="' + newDate + '"]')[0] || epDateFix.div;
	day.appendChild(entry);
	return day;
};

epDateFix.check = function epDateFix_check(id, episodeID)
{
	let data = epDateFix._list ? epDateFix._list[id] || [] : [],
			parentList = [],
			offset = 0,
			offsetRelative = 0,
			index = -1,
			episode = -1;

	for(let i = 0; i < data.length; i++)
	{
		let epID = episodeTools.id(data[i][0], data[i][1]);
		if (episodeID >= epID)
		{
			let o = ~~data[i][2];
			parentList[parentList.length] = epID;
			if (episodeID == epID)
			{
				index = i;
				offsetRelative = ~~data[i][2];
				episode = epID;
			}
			else
				offset += o;

		}
	}
	return {
		index: index,
		parentList: parentList,
		offset: offset + offsetRelative,
		offsetPrev: offset,
		offsetRelative: offsetRelative,
		episode: episode
	};
};

epDateFix.update = function epDateFix_update(id, episode, offset)
{
	episode = episodeTools.id(episode);
	offset = ~~offset;

	let ep = episodeTools.split(episode),
			data = this.check(id, episode);

	if (data.index == -1 && !offset)
		return;

	if (!this._list[id])
		this._list[id] = [];

	if (data.index != -1)
	{
		if (!offset)
		{
			this._list[id].splice(data.index, 1);
		}
		else
			this._list[id][data.index][2] = offset;
	}
	else
		this._list[id][this._list[id].length] = [ep[0], ep[1], offset];

};

epDateFix.save = function epDateFix_save()
{
	for(let id in this._list)
		if (!this._list[id].length)
			delete this._list[id];

	ls("epDateFix", this._list);
};

epDateFix.init = function(enable)
{
	if (typeof(enable) == "undefined")
		enable = Settings.pref("enableEpDateFix");
	else
		Settings.pref("enableEpDateFix", enable ? 1 : 0);

	document.body.classList.toggle("enableEpDateFix", enable);
};
epDateFix._list = ls("epDateFix") || {};
epDateFix.div = document.createElement("div");
epDateFix.div.id = "epDateFix";
document.body.appendChild(epDateFix.div);
epDateFix.init();
	let sortMyShows = function(entries)
	{
		if (typeof(entries) == "undefined")
		{
			$("div.day").each(function(i, e)
			{
				sortMyShows($(e).find("div.entry"));
			});
			return;
		}

		let changed = false;
		entries.sort(function(a, b)
		{
			let r = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
			if (r)
				changed = true;

			return r;
		});
		if (Settings.prefs.myShowsTop && Object.keys(DB.savedColors).length)
		{
			entries.sort(function(a, b)
			{
				let r = (b.dataset.seriesId in DB.savedColors) - (a.dataset.seriesId in DB.savedColors);
				if (r)
					changed = true;

				return r;
			});
		}
		if (changed);
			$(entries.context).append(entries);
	};//sortMyShows()

	let episodeNumberFix = function(id, title)
	{
		let data = episodeNumberFix.Get(id, title, true, true);
		if (!data)
			return title;

		let episodeNew = data.episode + data.episodeOffset,
				seasonNew = data.season + data.seasonOffset;

		if (seasonNew < 0)
			seasonNew = 0;

		if (episodeNew < 0)
			episodeNew = 0;

//if (data.episodeOffset || data.seasonOffset)
//log(data);
		return data.name + " S" + pad(seasonNew) + "E" + pad(episodeNew);
	};

	episodeNumberFix.Get = function (id, title, inherit, all)
	{
		if (typeof(inherit) == "undefined")
			inherit = true;

		let match = title.match(/(.*) S([0-9]{2,})E([0-9]{2,})/);
		if (!match)
			return null;

		let data = episodeNumberFix.list[id],
				name = match[1],
				season = Number(match[2]),
				episode = Number(match[3]),
				r = {
					name: name,
					season: season,
					episode: episode,
					seasonOffset: 0,
					episodeOffset: 0,
					index: -1,
					data: data
				};

		if (!data)
			return r;

		for(let i = 0; i < data.length; i++)
		{
			if ((season == data[i][0] || (inherit && season > data[i][0]))
					&& (episode == data[i][1] || (inherit && episode > data[i][1])))
			{
				r.episodeOffset += data[i][3];
				r.seasonOffset += data[i][2];

				r.index = i;
				if (!all)
					break;
			}
		}
		return r;
	};

	episodeNumberFix.Set = function(id, title, seasonOffset, episodeOffset)
	{
		let data = episodeNumberFix.Get(id, title, false, false);
		if (!data)
			return title;

		if (seasonOffset || episodeOffset)
		{
			if (!data.data)
				episodeNumberFix.list[id] = data.data = [];

			if (data.index == -1)
				data.index = data.data.length;

			episodeNumberFix.list[id][data.index] = [data.season, data.episode, seasonOffset, episodeOffset];
		}
		else
		{
			if (!data.data)
				return title;

			if (data.index != -1)
				data.data.splice(data.index, 1);

			if (!data.data.length)
				delete episodeNumberFix.list[id];
		}
	};
	episodeNumberFix.save = function()
	{
		ls("epNumFix", episodeNumberFix.list);
	};
	episodeNumberFix.load = function()
	{
/*
id: [[season, episode, episodeOffset, seasonOffset]]
*/
		episodeNumberFix.list = ls("epNumFix") || {};
		for(let i in episodeNumberFix.list)
		{
			for(let n=0; n < episodeNumberFix.list[i].length; n++)
			{
			if (episodeNumberFix.list[i][n].length < 4)
			{
				episodeNumberFix.list[i][n][3] = episodeNumberFix.list[i][n][2];
				episodeNumberFix.list[i][n][2] = 0;
			}
			}
		}

	};
	episodeNumberFix.load();


	//collapse multiple entries of the same series in one day
	let collapseMulti = function collapseMulti(i, day, update)
	{
		let _day = $(day),
				entries = _day.find("div.entry");

		if (!update && !entries.find(".title > span").length)
			return;

		if (!update && day.list)
		{
			return collapseMulti.setTitle(day.list, Settings.prefs.collapseMulti && !_day.hasClass("opened") ? "_titleCollapsed" : "_titleOrig");
		}

		if (!day.list)
			day.list = {};

		let list = {};
		if (!day.inited)
		{
			day.addEventListener("mouseenter", function(e)
			{
				collapseMulti.mouseOver(e, day);
			}, true);
			day.addEventListener("mouseleave", function(e)
			{
				collapseMulti.mouseOut(e, day);
			}, true);
			day.inited = true;
		}
		entries.each(function(i, entry)
		{
			let id = entry.getAttribute("data-series-id");
//			entry._title = $(entry).find(".title > span")[0];
			if (!entry._title)
				return;

			if (!entry._title._titleOrig)
			{
				entry._title._titleOrig = entry._title.textContent || "";
				entry.setAttribute("title", entry._title.textContent);
			}
			if (list[id])
				$(entry).toggleClass("multi", true);
			else
				list[id] = [];

			if (entry.classList.contains("series-premiere") || entry.classList.contains("season-premiere"))
			{
				entry.classList.remove("multi");
				list[id].unshift(entry);
			}
			else
			{
				list[id].push(entry);
			}
		});
		for(let i in list)
		{
			if (list[i].length < 2)
				continue;

			list[i][0]._title._titleCollapsed = list[i][0]._title._titleOrig + "-" + list[i][list[i].length - 1]._title._titleOrig.replace(/.* ([^ ]+)$/, "$1");


			$(list[i][0]).toggleClass("multif", true);

			day.list[i] = list[i][0]._title;
			if (Settings.prefs.collapseMulti && !_day.hasClass("opened"))
				$(day.list[i]).html(day.list[i]._titleCollapsed);
		}
	}; //collapseMulti()


	collapseMulti.setTitle = function(list, title)
	{
		for (let i in list)
			$(list[i]).html(list[i][title]);
	};

	collapseMulti.mouseOver = function(e, day)
	{
		if (e.target != day)
			return;

		day._type = "over";
		clearTimeout(day._collapseMultiTimer);
		$(day).toggleClass("expand", true);
		if (!Settings.prefs.collapseMulti)
			return;

		collapseMulti.setTitle(day.list, "_titleOrig");
	};

	collapseMulti.mouseOut = function(e, day, id)
	{
		if (e.target != day)
			return;

		day._type = "out";
		day._collapseMultiTimer = setTimeout(function()
		{
			$(day).toggleClass("expand", false);
			if (!Settings.prefs.collapseMulti)
				return;

			if (!$(day).hasClass("opened"))
				collapseMulti.setTitle(day.list, "_titleCollapsed");
		}, 300);
	};

	collapseMulti.animateDone = function(e, n)
	{
		e.elem.style.overflow = "";
		e.elem.style.height = "";
		e.elem.style.display = "";
		e.elem.style.textOverflow = "";
		$(e.elem).find(".title").css("white-space", "");
	};
	collapseMulti.animate = function(day, cl, val, title)
	{
		if (!day._animatingQuie)
			day._animatingQuie = {};

		if (day._animating)
		{
			clearTimeout(day._animatingQuie[cl+val]);
			return day._animatingQuie[cl+val] = setTimeout(function()
			{
				collapseMulti.animate(day, cl, val, title);
			});
		}

		let type = day._type;
		if (Settings.prefs.collapseMulti)
			clearTimeout(day._collapseMultiTimer);

		let clone = day.cloneNode(true);
		$(clone).toggleClass(cl, val);
		if (title)
		{
			clone.list = {};
			for (let i in day.list)
			{
				clone.list[i] = $($(clone).find(".multif[data-series-id=" + i + "]")[0]);
				clone.list[i]._titleCollapsed = day.list[i]._titleCollapsed;
				clone.list[i]._titleOrig = day.list[i]._titleOrig;
			}
			collapseMulti.setTitle(clone.list, title);
		}
		clone.style.visibility = "hidden";
		clone.style.position = "absolute";
		clone.style.top = 0;
		clone.style.width = day.clientWidth + "px";
		$(clone).toggleClass("clone", true);
		day.parentNode.appendChild(clone);
		let n = 0;
		collapseMulti.setTitle(day.list, title);
		let stopped = false;
		day._animating = true;
		$(clone).find(".entry").each(function(i, c)
		{
			n++;
			let e = $(day).find(".entry")[i];
			e.style.height = (e.clientHeight ? e.clientHeight : 1) + "px";
			e.style.overflow = "hidden";
			e.style.textOverflow = "unset";
			e.style.display = "block !important";
			$(e).find(".title").css("white-space", "normal");
			$(e).show();
			$(e).css("display", "block !important");
			if (!$(e).is( ":visible" ))
			{
				e.style.setProperty("display", $(c).css("display"), "important");
			}
			$(e).stop(true);
			$(e).animate({
				height: c.clientHeight,
			},
			{
				duration: 200,
				progress: function(e)
				{
					if (day._type != type)
					{
						e.stop(true);
						stopped = true;
					}
				},
				always: function(e)
				{
					if (!--n)
					{
						if (!stopped)
							$(day).toggleClass(cl, val);

						day._animating = false;
					}
					collapseMulti.animateDone(e);
				}
			});
		});
	};//collapseMulti.animate()

	collapseMulti.onOff = function(e, id, checked)
	{
		Settings.prefs.collapseMulti = checked;
		$("div.day").each(collapseMulti);
		Settings.callback(e, id, checked);
	};

	//fixing prev/next history jump does nothing
	$(window).on("popstate", function(e)
	{
		let state = e.originalEvent.state;
		prevPath = (state ? state.originalPath : undefined) || e.target.location.pathname;

		_loadArchiveFromPathname(prevPath, state ? state.highlightSelector : undefined);
	});

	function showPast(callback)
	{
	// hide all past days
		let	d = new Date(),
				_todayDate = d.getFullYear() + pad((new Date()).getMonth() + 1) + pad((new Date()).getDate());

		_today = $("div.day[data-date='" + _todayDate + "']");

		if (!_today || $(".archive").length)
		{
			setEpisodes();
			if (callback)
				return callback();

			return;
		}

		let	firstDay = $(".days").children().first(),
				firstDate = firstDay.attr("data-date");

		if (!firstDay.length)
			return;

		let div = [document.createElement("div")],
				y = firstDate.slice(0, 4),
				m = firstDate.slice(4, 6);

		if (~~firstDate.slice(6, 8) - weekDay() < 15)
			div.push(document.createElement("div"));


		let c = div.length;
		for (let n = 0; n < c; n++)
		{
			let d = new Date(y, m - n - 1);
			$(div[n]).load("/_archive/" + d.getFullYear() + "-" + pad(d.getMonth() + 1), pastLoadDone);
		}
		function pastLoadDone()
		{
			if (--c > 0)
				return;

			let stop = false,
					prev = 0,
					dayDiv = $("div.days"),
					remove = [],
					_tD = ~~_todayDate;

			for (let n = 0; n < div.length; n++)
				dayDiv.prepend(div[n].children);


			//remove any duplicate dates;
			for(let i = 0; i < dayDiv[0].children.length; i++)
			{
				let day = dayDiv[0].children[i],
						date = ~~day.getAttribute("data-date");

				if (_today[0] == day)
					break;

				if (date <= prev || date >= _tD)
					remove[remove.length] = day;
				else
					prev = date;
			}
			for(let i = 0; i < remove.length; i++)
				remove[i].parentNode.removeChild(remove[i]);

			pastLoaded();

			if (callback)
				callback();
		}//pastLoadDone()
	}//showPast()

	function setEpisodes(entries)
	{
		if (typeof(entries) == "undefined")
			entries = document.querySelectorAll("div.entry");

		for (let e = 0; e < entries.length; e++)
		{
			let entry = entries[e],
					episode = episodeTools.split(entry);

			if (!entry._episode)
			{
				entry._episode = episodeTools.full(episode);
				if (entry._episode == "E00")
					entry._episode = "";

				entry.setAttribute("data-episode", entry._episode);
			}
			if (!entry._episodeID)
				entry._episodeID = episodeTools.id(episode);

			if (!entry._episodeDate)
				entry._episodeDate = entry.parentNode.dataset.date || entry.dataset.date || "";
		}
	}

	function weekDay()
	{
		let week =  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
				match = $(_today).find(".date").text().toLowerCase().match(/([^,]{3})/);

		week = week.concat(week.splice(0, 7 - Settings.prefs.weekStart));
		return match ? week.indexOf(match[1]) : -1;
	}

	function removeClass(node, c)
	{
		let n = node.prop("classList");
		for(let i = 0; i < n.length; i++)
			if (n[i].match(c))
				node.removeClass(n[i]);
	}

	function pastLoaded()
	{
		setEpisodes();
		let	hasLoaded = $("#pastWeeks").length,
				stop = false,
				days = $("div.days")[0],
				today = _today[0],
				that = self;

		for(let i = 0; i < days.children.length; i++)
		{
			let day = days.children[i];
			day.classList.toggle("today", day == today);
			if (day == today)
			{
				day.setAttribute("id", "today");
				day.setAttribute("today", true);
				stop = true;
			}
			if (stop)
			{
				removeClass($(day), /^past[0-9]?/);
			}
			else
			{
				day.classList.toggle("past", true);
			}

		}
		let daysNum = weekDay(),
				prev = _today.prev();

		//there is no identication of which week a day belong to, so we must make sure that previous days of current week don't count as previous week.
		if (daysNum > 0)
		{
			for(let i = 0; i < daysNum && prev; i++)
			{
				removeClass(prev, /^past[0-9]?/);
				prev = prev.prev();
			}
		}
		//remove more then 5 weeks worth of days.
		for(let i = 0; i < 34 && prev; i++)
		{
			prev = prev.prev();
		}

		if (!that.weekStart)
		{
			that.weekStart = [];
			that.weekStart[0] = Settings.prefs.weekStart ? Settings.prefs.weekStart == 1 ? prev : prev.next() : prev.prev(); //Sunday
			that.weekStart[1] = that.weekStart[0].prev(); // Saturday
		}

		if (prev.length)
		{
			let found = false,
					remove = [],
					_prev = prev[0];

			for(let i = 0; i < days.children.length; i++)
			{
				let day = days.children[i];

				if (_prev == day)
					break;

				if (day != that.weekStart[0] && day != that.weekStart[1])
					remove[remove.length] = day;
			}
			for(let i = 0; i < remove.length; i++)
				days.removeChild(remove[i]);

		}

		for(let i = 0; i < that.weekStart.length; i++)
		{
			if (Settings.prefs.weekStart && i + 1 <= Settings.prefs.weekStart)
				that.weekStart[i].prependTo(days);
			else
				that.weekStart[i] = that.weekStart[i].detach();
		}

		for(let i = 0; i < days.children.length; i++)
		{
			days.children[i].setAttribute("week", (Math.ceil((i+1) / 7)));
		}

		let	daysPast = $('div.past'),
				daysCount = Math.round((days.children.length) / 7) + 1,
				weeks = ~~Settings.prefs.weeksPast,
				weeksPastMax = Math.round((daysPast.length) / 7);//how many past weeks do we have available?

		if (weeks > weeksPastMax)
			weeks = weeksPastMax;

		//main function that shows/hides past days
		function showWeeks()
		{
			let weeksMax = ~~Settings.pref("weeks") || daysCount;

			//get week numbers from dropdown
			let weeks = ~~$("#pastWeeks").val();

			//just some sanity check
			if (weeks * 7 > daysPast.length)
				weeks = weeksPastMax;

			if (weeks < 1)
				weeks = 0;

			let startWeek = weeksPastMax-weeks;
			for(let i = weeksPastMax, shown = 1; i > 0; i--)
			{
				$( "div.calendar" ).toggleClass("showPast" + i, (weeks >= i && shown++ <= weeksMax));

			}
			for(let i = 1, shown = 1; i < daysCount; i++)
			{
				$( "div.calendar" ).toggleClass("showWeek" + i, i > startWeek && shown++ <= weeksMax);
			}
			Settings.pref("weeksPast", weeks);
		}
		//add new class pastNN to each past day, where NN is a week number.
		let func = function(i)
		{
			this.className = this.className.replace(/ ?past[0-9]+/, '');
			this.classList.toggle("past" + (Math.ceil((daysPast.length - i) / 7 % (weeksPastMax + 1))), true);
		};
		daysPast.each(func);

		if (!hasLoaded)
		{
			//create dropdown menu with number of available past weeks
			let dropdown = document.createElement("select");
			dropdown.id = "pastWeeks";

			for(let i = 0; i <= weeksPastMax; i++)
			{
				let option = document.createElement("option");
				option.value = i;
				option.text = i;
				option.selected = (weeks == i);
				dropdown.appendChild(option);
			}

			//add event listener to dropdown
			$(dropdown).change(showWeeks);

			let span = document.createElement("span");
			span.id = "past-weeks";
			span.appendChild(document.createTextNode("Show past weeks:"));
			span.appendChild(dropdown);
			//insert our dropdown and new text into document
			$(".calendar").prepend(span);

			//hide "Show/Hide past month" links
			$("#past-showing").toggle(true);
			//togglePast();//make sure we disable "Show past month"
			$("#past-showing").toggle(false);
			$("#past-hidden").toggle(false);
		}
		showWeeks();
	}//pastLoaded()


	//create stylesheet. A little trick to have multi-line text in javascript
	let	style = document.createElement("style"),
			css = multiline(function(){/*
body
{
}
#content
{
	max-width: 200em;
	_transform: translateZ(0); /* this will force any "fixed" positions be relative to this container, not viewport*//*
	position: relative;
	margin: auto;
}
#searchbar
{
	right: unset;
}
#searchbarContainer
{
	position: absolute;
	right: 6%;
	margin-right: 200px;
	padding: 0;
	height: 0;
	width: 0;
	overflow: hidden;
}
#searchResults
{
	margin-top: 0.5em;
	display: none;
}

#searchResults2
{
	position: fixed;
	width: 200px;
	margin-left: -11px;
	padding: 10px;
	max-height: 93vh;
	top: 3em;
	overflow: auto;
	border: 1px solid transparent;;
	border-top-color: transparent;
	border-top-width: 0;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
}
#searchbar.active #searchResults2
{
	border-color: black;
}
#account-overview > span.nu > svg
{
	width: 1.2em;
	height: 1.2em;
	vertical-align: top;
	margin-right: 0.3em;
	fill: #3e3e3e;
}
#account-overview > span.nu > svg.cookieIcon
{
	width: 1em;
	height: 1em;
	vertical-align: sub;
}
.cookieIcon
{
	width: 1em;
	height: 1em;
	vertical-align: sub;
}
.cookieIconHoles
{
	fill: #fff;
	opacity: .5;
}
svg
{
	max-width: 1.2em;
	max-height: 1.2em;
	vertical-align: top;
	width: 1.2em;
}
body.userViewer .settings > div.spacer,
body.userViewer .myHidden,
body.userViewer .moreOpt,
body.userViewer .clearHidden,
body.userViewer .clearHiddenIcon,
body.userViewer .clearWatched,
body.userViewer .clearWatchedIcon,
body.userViewer .importColors,
body.userViewer .importColorsIcon,
body.userViewer .clearColorsIcon,
body.userViewer .clearColors,
body.userViewer .colors,
body.userViewer .myCustomShows
{
	display: none !important;
}

/*
div.calendar.searching > #past-weeks
{
	text-decoration: line-through;
}
*//*
#past-weeks
{
	margin-left: 0.2%;
}

#pastWeeks
{
	margin-left: 0.5em;
}

.archive #past-weeks
{
	text-decoration: line-through;
}


/* today column border *//*
div.today
{
	border-color: #FFC800;
	-webkit-box-shadow: 0px 0px 10px 0px #FFC800D0;
	-moz-box-shadow:    0px 0px 10px 0px #FFC800D0;
	box-shadow:         0px 0px 10px 0px #FFC800D0;
}

/* higlighted title under cursor *//*
div.title > input[type="checkbox"]:hover + div.title,
div.title:hover
{
	background-color: #ffffd5;
	-webkit-transition: background 0s;
	color: black;
}

/* highlight opened entry *//*
.entry[opened]
{
	border: 1px solid black;
}
.entry[opened][color="white"]
{
	border: 1px solid white;
}

div[opened] + div
{
	border-top: 0;
}

.engines input[type="checkbox"]
{
	width: unset !important;
	vertical-align: top;
}
.engines img
{
	vertical-align: text-bottom !important;
}

.engines
{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: block;
}

div.entry
{
	float: left;
	width: 100%;
}

.pointer,
.checkbox,
.date
{
	cursor: pointer;
}

.filter
{
	margin-left: 1em;
	cursor: pointer;
}

.showhide0 > svg,
.showhide1 > svg
{
	margin: 0 0.1em 0 -1px;
	width: 1.2em;
	height: 1.2em;
	max-width: unset;
	max-height: unset;
}
div.entry[color="white"]
{
	fill: white;
}

div.details > span.engines > br + div.tools
{
	margin-top: 0.3em;
	border-top: 1px dashed #eee;
	padding-top: 0.3em;
	overflow: hidden;
	text-overflow: ellipsis;
}
div.colors
{
	margin-top: 0.3em;
}
div.details > span.engines > div.tools > *
{
	margin: 0.2em;
}
body:not(.archive) div.day[week],
body:not(.archive) div.day.past,
.showhide0,
span[checked] > .checkoff,
span:not([checked]) > .checkon,
/*separate showing searies and season premiere*//*
div.calendar.showNew div.entry:not(.series-premiere):not(.searchResult),
div.calendar.showReturn div.entry:not(.season-premiere):not(.searchResult)
{
	display: none;
}

body:not(.archive) div.showWeek1 div[week="1"],
body:not(.archive) div.showWeek2 div[week="2"],
body:not(.archive) div.showWeek3 div[week="3"],
body:not(.archive) div.showWeek4 div[week="4"],
body:not(.archive) div.showWeek5 div[week="5"],
body:not(.archive) div.showWeek6 div[week="6"],
body:not(.archive) div.showWeek7 div[week="7"],
body:not(.archive) div.showWeek8 div[week="8"],
body:not(.archive) div.showWeek9 div[week="9"],
body:not(.archive) div.showWeek10 div[week="10"],
body:not(.archive) div.showWeek11 div[week="11"],
body:not(.archive) div.showWeek12 div[week="12"],
body:not(.archive) div.showWeek13 div[week="13"],
body:not(.archive) div.showWeek14 div[week="14"],
body:not(.archive) div.showWeek15 div[week="15"],
body:not(.archive) div.showWeek16 div[week="16"],
body:not(.archive) div.showWeek17 div[week="17"],
body:not(.archive) div.showWeek18 div[week="18"],
body:not(.archive) div.showWeek19 div[week="19"],
body:not(.archive) div.showWeek19 div[week="20"],

body:not(.archive) div.showPast1 div.past1,
body:not(.archive) div.showPast2 div.past2,
body:not(.archive) div.showPast3 div.past3,
body:not(.archive) div.showPast4 div.past4,
body:not(.archive) div.showPast5 div.past5,
body:not(.archive) div.showPast6 div.past6,
body:not(.archive) div.showPast7 div.past7,
body:not(.archive) div.showPast8 div.past8,
body:not(.archive) div.showPast9 div.past9
{
	display: block;
}


/*separate showing searies and season premiere*//*
#nu-showing,
#nu-hidden,
#selected-only-hidden
{
	display: none !important;
}

div.calendar.showNew div.entry.series-premiere:not(.searchResult),
div.calendar.showReturn div.entry.season-premiere:not(.searchResult)
{
	display: block;
}


/*Search field overlaps text below in Firefox*//*
#searchFieldContainer
{
	background-color: unset;
}


/*Watched*//*
body.enableWatched:not(.showWatched) :not(#searchResults) > div.entry[watched]:not(.searchResult):not(:hover),
body:not(.enableWatched) div.calendar > a.showWatched,
body:not(.enableWatched) div.title > input[type="checkbox"]
{
	display: none !important;
}

body.enableWatched div.entry[watched] > div.title
{
	text-decoration: line-through;
}

div.title > input[type="checkbox"]
{
	vertical-align: middle;
	margin: 1px 3px 0 1px;
	height: 1em;
}

#searchResults div.title > input[type="checkbox"]
{
	width: unset;
	float: left;
	z-index: auto;
}

#searchResults > div.entry:last-child
{
	margin-bottom: 1em;
}
/*Past related*//*
body:not(.archive) .past
{
	opacity: 0.5;
}

body.collapseMulti div.day:not(.expand):not(.opened) div.entry.multi
{
	display: none !important;
}

body.collapseMulti div.day:not(.expand):not(.opened) div.entry.multif div.title:after
{
	content: "";
	background-color: black;
	border-left: 1px solid white;
}

body.collapseMulti div.day:not(.expand):not(.opened) div.entry.multif div.title:after
{
	position: absolute;
	height: 100%;
	right: -1px;
	top: 0;
	width: 3px;
}

div.entry.custom div.title:after
{
	content: "";
	background-color: lightgreen;
	border-left: 1px solid white;
}

div.entry.custom div.title:after
{
	position: absolute;
	height: 100%;
	right: -1px;
	top: 0;
	width: 3px;
}

/*Account popup*//*
#settings-popup .content h4,
#manage-cushows-popup .content h4,
#manage-links-popup .content h4,
#account-popup-content .content h4
{
	margin-top: 1em;
	margin-bottom: 1em;
	display: inline-block;
}
.header h4
{
	margin: 0.2em 0 0 0;
	color: black;
}
#settings-popup .content div.moreOpt:not([opened]) > h4
{
	cursor: pointer;
	margin-bottom: 0.2em;
}
#settings-popup .content div.moreOpt > h4
{
	cursor: default;
	margin: 0.2em 0 1em 0;
}
div.moreOpt:not([opened]) > div
{
	display: none;
}
#settings-popup .content,
#manage-cushows-popup .content,
#manage-links-popup .content,
#account-popup-content .content
{
	padding-top: 0;
	padding-bottom: 1em;
}
#settings-popup-content .content > div > *:first-child,
#account-popup-content .content > div > *:first-child
{
	width: 1.6em;
	display: inline-block;
	vertical-align: bottom;
}
#manage-links-popup-content .content > div > div
{
	min-width: 21em;
	max-width: 21em;
	overflow: hidden;
	vertical-align: bottom;
}
#manage-links-popup-content .content a.link
{
	display: inline-block;
	max-width: 14.5em;
	text-overflow: ellipsis;
	overflow: hidden;
}

#manage-links-popup .content > div.def > div > span
{
	display: none;
}
/*
#manage-links-popup .content > div.def > div > a
{
	font-weight: bold;
}
*//*
#manage-links-popup .content > div:not(.def) > div > span
{
	text-decoration: none;
	display: inline-block;
	color: red;
	padding: 0.2em;
	vertical-align: super;
	cursor: default;
}

#account-popup,
#settings-popup,
#manage-cushows-popup,
#manage-links-popup
{
	position: absolute;
	top: 50px;
	left: 4.7%;
	bottom: 10px;
	right: 4.7%;
	width: 1px;
	display: none;
}

body.prompt #account-popup
{
	z-index: 1;
}

body.popup .popup
{
	z-index: 1234;
}
body.popup .cp-color-picker
{
	z-index: 1235;
}
body.prompt .popup
{
	z-index: unset;
}
#account-popup-content,
#settings-popup-content,
#manage-cushows-popup-content,
#manage-links-popup-content
{
	position: absolute;
	top: 0px;
	left: 0px;
	background-color: whitesmoke !important;
	border: 1px dotted black;
	min-width: 30.4em;
	min-height: 10px;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
}
img.icon
{
	width: 1.333em;
}
div.back
{
	font-size: 1.2em;
	width: 1.3em;
	height: 1.3em;
	cursor: pointer;
	position: absolute;
	top: 0;
	left: 0;
	padding: 5px 3px 4px 5px;
}
.close > svg:first-child
{
	display: none;
}
div.close
{
	font-size: 1.2em;
	width: 1.3em;
	height: 1.3em;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	padding: 7px 3px 2px 5px;
}
div:not(#account-popup-content) > .header
{
	background-color: #7FFFFF;
	padding: 5px;
	text-align: center;
	height: 1.5em;
}
#settings-popup .content,
#manage-cushows-popup .content,
#manage-links-popup .content,
#engine-form,
#cushows-edit
{
	padding: 3px 10px;
	overflow-x: hidden;
	overflow-y: auto;
	max-height: 100em;
}
#settings-popup .content
{
	max-height: unset;
}
#cushows-edit,
#engine-edit
{
	overflow: inherit;
	border-top: 1px dotted;
	padding-top: 0.5em;
}
#cushows-edit > div,
#engine-edit > div,
#manage-links-popup .content > div
{
	display: table-row;
	white-space: nowrap;
	height: 100%;
}
#cushows-edit > div > *,
#engine-edit > div > *,
#manage-links-popup .content > div > *
{
	display: table-cell;
	vertical-align: middle;
	margin: 0 4px 0 1px;
	padding: 1px 0;
}
#manage-links-popup .content > div > img
{
	vertical-align: sub;
	display: inline-block;
	margin: 0 4px 1px 0;
}
body.edge #manage-links-popup .content > div > img
{
	margin-bottom: -2px !important;
}
.editBox > span
{
	padding: 3px;
	display: inline-block;
	height: 1em;
}
.editBox
{
}
.editBox > span:hover
{
	cursor: pointer;
	outline: 1px dotted #FF9090;
}
body.colorbox:not(.colorpicker) #manage-cushows-popup .content li:not(.opened),
body.colorpicker .colors,
body.colorbox #cushows-form,
#cushows-list.opened > li.opened > .editBox,
#cushows-list.opened > li:not(.opened)
{
	-webkit-filter: opacity(40%);
	-moz-filter: opacity(40%);
	-o-filter: opacity(40%);
	-ms-filter: opacity(40%);
	filter: opacity(40%);
	pointer-events: none;
}
body.colorpicker *,
body.colorbox *
{
	pointer-events: none;
}
body.colorbox:not(.colorpicker) #manage-cushows-popup .content,
body.colorpicker .cp-color-picker,
body.colorpicker .cp-color-picker *,
body.colorbox:not(.colorpicker) li.opened div.color,
body.colorbox:not(.colorpicker) li.opened div.color *
{
	pointer-events: auto;
}

#cushows-list > li:hover,
#cushows-list.opened > li.opened,
#manage-links-popup .content > div.dragging:not(.hide),
#manage-links-popup .content:not(.dragging) > div:hover
{
	background-color: #FFFFB7;
	outline: 1px dotted grey;
}
#cushows-list.opened>li.opened .colors
{
	width: 26em;
}
.close:hover,
.back:hover
{
	background-color: rgba(255,255,255,0.5);
}
.close:hover > svg
{
	background-color: #e81123;
}
.close:hover > svg:last-child
{
	display: none;
}
.close:hover > svg:first-child
{
	fill: #FFFFFF;
	display: inline-block;
}

#manage-links-popup .content > div.dragging.hide > *
{
	opacity: 0;
}
#manage-links-popup .content > div.dragging.hide
{
	outline: 1px dashed grey;
}
#cushows-edit > div > label,
#engine-edit > div > label
{
	text-align: right;
	min-width: 5.5em;
}
#cushows-edit > div.info > label
{
	vertical-align: top;
}

#engine-edit > div:last-child > label
{
	vertical-align: top;
	padding-top: 0.3em;
}
#engine-edit > div > div
{
	width: 100%;
	padding: 0.1em 0.5em;
	max-width: 20em;
}
#engine-edit > div > div.engine-url
{
	padding: 0.1em 2.2em 0.1em 0.5em;
}
body.ff #engine-edit > div > div.engine-url
{
	padding-right: 2.0em;
}
#cushows-edit > div > div > input,
#cushows-edit > div > div > textarea,
#engine-edit > div > div > input
{
	width: 100%;
}
input#engine-url
{
	padding-right: 1.5em;
}

#engine-edit > div > div > select
{
	width: 1.5em;
	position: relative;
	left: -1.5em;
	margin: 0;
	padding: 0;
	height: 1.58em;
}
body.ff #engine-edit > div > div > select
{
	height: 1.57em;
	left: -1.4em;
}
body.edge #engine-edit > div > div > select
{
	height: 1.6em;
}

#engine-res
{
	overflow: hidden;
	text-overflow: ellipsis;
	min-height: 2em;
	padding: 0.3em 0 0.3em 0.5em !important;
}

#engine-res > a > img.icon:not([src])
{
	display: none;
}

#engine-hidden
{
	display: none !important;
}
#engine-res > a > img
{
	vertical-align: middle;
	display: inline-block;
	margin: 0 4px 0 0;
}

body.ff #engine-reset
{
	margin-right: -0.6em;
}
#engine-reset
{
	float: right;
	margin-right: -0.4em;
}
div.reset
{
	display: none !important;
}
#manage-links-popup[changed] div.reset
{
	display: block !important;
}
div.reset > span
{
	display: block !important;
	text-align: right;
	margin-right: 0.5em;
	margin-bottom: 0.5em;
}
#engine-edit
{
}
#manage-links-popup .nu,
#manage-links-popup .nu
{
	vertical-align: bottom;
	font-size: 1.3em;
}
#cushows-list > li.update,
#manage-cushows-popup-content .content > div.update,
#manage-links-popup-content .content > div.update
{
	-webkit-transition:background-color 0.4s ease-in;
	-moz-transition:background-color 0.4s ease-in;
	-o-transition:background-color 0.4s ease-in;
	transition:background-color 0.4s ease-in;
}

.engine-regexp
{
	height: 100%;
}
#engine-edit #engine-regexp
{
	width: 70%;
}
body.ff #engine-edit #engine-regexp-replace
{
	left: 2px;
}
#engine-edit #engine-regexp-replace
{
	width: 30%;
}

input.error,
textarea.error
{
	box-shadow: 0 0 8px 1px #FF9090;
	-webkit-box-shadow: 0 0 8px 1px #FF9090;
	-moz-box-shadow: 0 0 8px 1px #FF9090;
}

#engine-edit textarea
{
	white-space: pre;
	overflow: auto;
	vertical-align: top;
	height: 100%;
	margin: 0;
	padding: 0;
	position: relative;
}
[draggable]
{
	-moz-user-select: none;
	-khtml-user-select: none;
	-webkit-user-select: none;
	user-select: none;
	/* Required to make elements draggable in old WebKit *//*
	-khtml-user-drag: element;
	-webkit-user-drag: element;
}
[draggable] .dndh
{
	cursor: move;
	font-size: 1.2em;
	vertical-align: bottom !important;
	display: inline-block !important;
	padding-left: 0.2em !important;
	padding-right: 0.2em !important;
}
body.ff [draggable] .dndh
{
	font-size: 1em;
	margin-top: 0.2em !important;
	vertical-align: super !important;
}
#settings-popup-content > .content > *
{
	margin: 0.3em 0;
	display: table;
}

/*
.user > svg
{
	margin-right: 0.3em;
}
*//*
/*fixing menu wrapping too soon*//*
@media screen and (max-width: 1000px)
{
	body #menu li,
	body:not(.userViewer) #menu li
	{ display: inline-block; }
	body #menu li .nu,
	body:not(.userViewer) #menu li .nu
	{ min-width: unset; }
	body #account-popup,
	body:not(.userViewer) #account-popup
	{ top: 50px; }
}


#menu .nu
{
	font-weight: bold;
}
#menu .close
{
	font-size: 0.9em;
	position: relative;
	top: -0.6em;
	cursor: pointer;
	padding: 0.3em;
}
#menu .close > svg
{
	width: 0.9em;
	height: 0.9em;
	position: unset;
}

.user > svg,
.back > svg,
.content > div > span > svg
{
	width: 1.3em;
	height: 1.3em;
	vertical-align: bottom;
}
.search > svg,
.content > div.search > span > svg
{
	width: 1em;
	height: 1em;
	vertical-align: middle;
}
#searchResults > div.entry > div.title,
body:not(.shortTitle) div > div.entry > div.title,
body.shortTitle.shortTitleExpand div.day.expand > div.entry > div.title,
body.shortTitle div.day.opened > div.entry > div.title
{
	display: flex;
}

/*
	logo new frame
*//*
#content > h1:first-of-type > img
{
	background-image: url('data:image/png;base64,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');
}

body.smallLogo h1 > img
{
	height: 1em;
	margin-bottom: -0.3em;
	background-size: 100%;
}
body.smallLogo h1,
body.smallLogo h1 + h2
{
	margin: 0;
}
/*
body.smallLogo h1:first-of-type > img
{
	margin-top: 0.67em;
	position: absolute;
	z-index: -10;
}
body.smallLogo h1
{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

body.smallLogo h1,
body.smallLogo h2
{
	background-color: rgba(255,255,255,0.6);
}
*//*
body.shortTitle:not(.shortTitleExpand) div.day.expand:not(.opened) > div.entry > div.title > input[type="checkbox"],
body.shortTitle div.day:not(.expand):not(.opened) div.title > input[type="checkbox"]
{
	float: left;
}
body.shortTitle:not(.shortTitleExpand) div.day.expand:not(.opened) > div.entry > div.title,
body.shortTitle div.day:not(.expand):not(.opened) > div.entry > div.title
{
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
div.spacer
{
	height: 0;
	border-bottom: 1px dotted silver;
	margin-top: 0.5em !important;
	margin-bottom: 0.5em !important;
	display: block !important;
}
.parentheses,
a.file
{
	margin-left: 0.5em;
}
.parentheses:before,
a.file:before
{
	text-decoration: none;
	display: inline-block;
	content: "(";
}
.parentheses:after,
a.file:after
{
	text-decoration: none;
	display: inline-block;
	content: ")";
}

#searchResults > .info
{
	margin-bottom: 0.7em;
}

#searchResults > .info > small
{
	vertical-align: text-bottom;
}
#searchResults > .info > small > span:not(.info)
{
	position: absolute;
	right: 1em;
}
span.button
{
	cursor: pointer;
	background-color: #DDDDDD;
	border-radius: 4px;
	padding: 3px;
}
/* fix search field box covers text on bottom *//*
#searchFieldContainer
{
	width: 100%;
	height: 0;
	display: grid;
	position: relative;
	padding-top: 0;
	padding-bottom: 0;
}
#searchFieldContainer > img
{
	padding-top: 10px;
}

#searchFieldPlaceholder
{
	height: 2em;
}

#searchbar input
{
	width: unset;
}

/* changes log *//*

body:not(.changesLog) #changesLog
{
	display: none;
}

body.changesLog #content > :not(#changesLog)
{
/*
	-webkit-filter: blur(5px);
	-moz-filter: blur(5px);
	-o-filter: blur(5px);
	-ms-filter: blur(5px);
	filter: blur(5px);
*//*
}

div[noback] .back
{
	display: none;
}
#changesLog
{
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
}
#changesLogBox
{
	position: relative;
	max-width: 1024px;
	margin: 1em;
	overflow: hidden;
	background-color: white;
	border: 1px solid black;
	font-family: Monaco,"DejaVu Sans Mono",'courier new', 'times new roman', fixed, monospace;
	background-color: whitesmoke;
	color: black;
}

div[id*="-popup"]
{
	white-space: nowrap;
}


#changesLogBox,
div[id*="-popup"],
/*body:not(.popup) .cp-color-picker*//*
.cp-color-picker
{
	-webkit-box-shadow: 0px 0px 40px 0px black;
	-moz-box-shadow:    0px 0px 40px 0px black;
	box-shadow:         0px 0px 40px 0px black;
}
#changesLogBox,
div[id*="-popup"]
{
	z-index: 1;
}
body:not(.popup) div.entry[opened]
{
	-webkit-box-shadow: 0px 0px 30px 0px black;
	-moz-box-shadow:    0px 0px 30px 0px black;
	box-shadow:         0px 0px 30px 0px black;
	z-index: 1;
}
/* firefox what the actual f.k? *//*
@-moz-document url-prefix() {
	#changesLogBox,
	div[id*="-popup"],
/*	body:not(.popup) .cp-color-picker*//*
	.cp-color-picker
	{
		box-shadow:         0px 0px 30px 0px black;
		-webkit-box-shadow: 0px 0px 30px 0px black;
		-moz-box-shadow:    0px 0px 30px 0px black;
	}
	body:not(.popup) div.entry[opened]
	{
		box-shadow:         0px 0px 20px 0px black;
		-webkit-box-shadow: 0px 0px 20px 0px black;
		-moz-box-shadow:    0px 0px 20px 0px black;
	}
}
#changesLogHead
{
	text-align: center;
}
#changesLogLegend
{
	padding: 4px;
	border-bottom: 1px solid #D4D4D4;
}
#changesLogLegend > span > span:first-child
{
	margin-left: inherit;
}
#changesLogLegend > span:not(:last-child) > span:last-child
{
	margin-right: 1em;
}
#changesLogLegend > span
{
	padding-left: inherit;
}
#changesLogContent
{
	padding: 4px;
}
.changesLogContentBox
{
	overflow: auto;
	height: calc(100% - 4.5em);
}
#changesLogContent > div > div:not(.cl_ver_head)
{
	margin-top: 1px;
	display: flex;
	white-space: pre-wrap;
}
#changesLogContent > div[class^="cl_ver_v"].prev:not(:hover)
{
	opacity: 0.3;
}
#changesLogContent > div[class^="cl_ver_"]:not(:last-child)
{
	padding-bottom: 1px;
	border-bottom: 1px solid #D4D4D4;
}
.cl_ver_head
{
	font-weight: bold;
	margin-top: 0.5em;
}

#changesLog.cl_added .cl_added:not(.cl_filter),
#changesLog.cl_changed .cl_changed:not(.cl_filter),
#changesLog.cl_fixed .cl_fixed:not(.cl_filter),
#changesLog.cl_removed .cl_removed:not(.cl_filter),
#changesLog.cl_notfixed .cl_notfixed:not(.cl_filter)
{
	max-height: 0;
	overflow: hidden;
	margin: 0;
}
#changesLog.cl_added .cl_filter.cl_added,
#changesLog.cl_changed .cl_filter.cl_changed,
#changesLog.cl_fixed .cl_filter.cl_fixed,
#changesLog.cl_removed .cl_filter.cl_removed,
#changesLog.cl_notfixed .cl_filter.cl_notfixed
{
	opacity: 0.3;
}
.cl_filter
{
	cursor: pointer;
}
.cl_filter:hover
{
	background-color: #858585;
}

.cl_added,
.cl_changed,
.cl_fixed,
.cl_removed,
.cl_notfixed,
.cl_comment
{
}

.cl_added > span:first-child,
.cl_changed > span:first-child,
.cl_fixed > span:first-child,
.cl_removed > span:first-child,
.cl_notfixed > span:first-child
{
	font-weight: bold;
	margin: 0 0.5em 0 1em;
	width: 0.7em;
	display: inline-block;
	text-align: center;
}
.cl_added > span:first-child
{
	background-color: #C9F5C9;
}
.cl_changed > span:first-child
{
	background-color: #BFEEFF;
}
.cl_fixed > span:first-child
{
	background-color: #FFFFBF;
}
.cl_removed > span:first-child
{
	background-color: #FFBFBF;
}
.cl_notfixed > span:first-child
{
	background-color: #E4DADB;
}
.cl_notfixed > span:last-child
{
	font-style: italic;
}
.cl_notfixed:not(.cl_filter) > span:last-child
{
	opacity: 0.8;
}
#changesLogContent > div[class^="cl_ver_v"] .cl_comment > span:last-child
{
	font-style: italic;
	opacity: 0.5;
}
.cl_added > span:last-child,
.cl_changed > span:last-child,
.cl_fixed > span:last-child,
.cl_removed > span:last-child,
.cl_notfixed > span:last-child,
.cl_comment > span:last-child
{
	width: 100%;
}
#animSpeedBox
{
	margin-top: 1em !important;
	margin-bottom: 0.5em !important;
}
#animSpeedBox > div
{
	position: relative;
	margin: 0 0.5em;
	width: 10em !important;
}
/* The slider itself *//*
.slider {
	-webkit-appearance: none;  /* Override default CSS styles *//*
	appearance: none;
	width: 100%; /* Full-width *//*
	height: 5px; /* Specified height *//*
	background: #d3d3d3; /* Grey background *//*
	-webkit-transition: .2s; /* 0.2 seconds transition on hover *//*
	transition: opacity .2s;
	margin: 0;
	vertical-align: middle !important;
}

/* Mouse-over effects *//*
.slider:focus {
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) *//*
.slider::-webkit-slider-thumb:after {
	background-color: red;
	width: 10px;
}
.slider::-webkit-slider-thumb {
	-webkit-appearance: none; /* Override default look *//*
	appearance: none;
	width: 1em; /* Set a specific slider handle width *//*
	height: 1em; /* Slider handle height *//*
	background: #66A2E3; /* Green background *//*
	cursor: pointer; /* Cursor on hover *//*
	border-radius: 50%;
	content: "wtf";
}

.slider::-moz-range-thumb {
	width: 1em; /* Set a specific slider handle width *//*
	height: 1em; /* Slider handle height *//*
	background: #66A2E3; /* Green background *//*
	cursor: pointer; /* Cursor on hover *//*
	border-radius: 50%;
	content: "wtf";
}

.ticks
{
	width: 10em;
}
.ticks > span
{
	position: absolute;
	top: -1.2em;
	font-size: 0.7em;
}
.ticks > span:after
{
	content: " ";
	width: 1px;
	height: 10px;
	background-color: black;
}
.ticks > span:nth-child(1)
{
	left: 4%;
}
.ticks > span:nth-child(2)
{
	left: 14%;
}
.ticks > span:nth-child(3)
{
	left: 24%;
}
.ticks > span:nth-child(4)
{
	left: 34%;
}
.ticks > span:nth-child(5)
{
	left: 43%;
}
.ticks > span:nth-child(6)
{
	left: 53.5%;
}
.ticks > span:nth-child(7)
{
	left: 63.5%;
}
.ticks > span:nth-child(8)
{
	left: 73%;
}
.ticks > span:nth-child(9)
{
	left: 83%;
}
.ticks > span:nth-child(10)
{
	left: 91%;
}


div.undoBar
{
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	text-align: center;
	display: none;
	z-index: 999999;
	height: 0;
	width: 100% !important;
}
div.undoBar > div
{
	background: #fde073;
	line-height: 2.5;
	overflow: hidden;
	-webkit-box-shadow: 0 0 5px black;
	-moz-box-shadow:    0 0 5px black;
	box-shadow:         0 0 5px black;
	display: inline-block;
	padding: 0 0 0 1em;
}
div.undoBar > div a
{
	cursor: pointer;
	text-decoration: underline;
}
div.undoBar > div > .close
{
	cursor: pointer;
	margin-left: 1em;
	padding: 0.5em;
}


.cp-color-picker
{
	box-sizing: content-box;
	width: 214px;
	border: 1px solid black;
}
.cp-color-picker .cp-panel
{
	line-height: 21px;
	float:right;
	padding: 0 1px 0 8px;
	margin-top: -1px;
	overflow: visible;
}
.cp-xy-slider:active
{
	cursor: none;
}
.cp-panel,
.cp-panel input
{
	color: #bbb;
	font-family: Monaco, "DejaVu Sans Mono", "Courier New", "Lucida Console", Courier, fixed, monospace;
	font-size: 1em;
}
.cp-panel input
{
	width: 28px;
	height: 12px;
	padding: 2px 3px 1px;
	text-align: right;
	line-height: 12px;
	background: transparent;
	border: 1px solid;
	border-color: #222 #666 #666 #222;
}
.cp-panel hr
{
	margin: 0 -2px 2px;
	height: 1px;
	border: 0;
	background: #666;
	border-top: 1px solid #222;
}
.cp-alpha
{
	width: 155px;
}
.cp-disp
{
	padding-bottom: 5px;
	clear: both;
	text-align: center;
	display: inline-block;
}
.cp-disp > input
{
	margin-right: 3px;
	line-height: 1.2em;

}
.cp-hex
{
	position: absolute;
	left: 0;
	bottom: -1.9em;
	text-align: start;
	display: inline-block;
	width: 5em;
}
#colorpicker-hex
{
	margin-right: 0;
	width: 3.6em;
	padding-left: 3px;
	padding-right: 3px;
	border-width: 1px;
	text-align: start;
}

#timeOffsetBox
{
	display: block;
}
input[type="number"]
{
	width: 2.8em;
}

#resultsBecauseNoOneChecks
{
	margin-top: 0;
}
/*
	https://kazzkiq.github.io/balloon.css/
*//*
[msg] {
	position: relative;
	cursor: pointer;
}
[msg]:after {
	filter: alpha(opacity=0);
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	-moz-opacity: 0;
	-khtml-opacity: 0;
	opacity: 0;
	pointer-events: none;
	-webkit-transition: all 0.05s ease-out 0.05s;
	-moz-transition: all 0.05s ease-out 0.05s;
	-ms-transition: all 0.05s ease-out 0.05s;
	-o-transition: all 0.05s ease-out 0.05s;
	transition: all 0.05s ease-out 0.05s;
	font-family: sans-serif !important;
	font-weight: normal !important;
	font-style: normal !important;
	text-shadow: none !important;
	font-size: 12px !important;
	background: rgba(17, 17, 17, 0.9);
	border-radius: 4px;
	color: #fff;
	content: attr(msg);
	padding: .5em 1em;
	position: absolute;
	white-space: nowrap;
	z-index: 10;
	bottom: 100%;
	left: 50%;
	margin-bottom: 11px;
	-webkit-transform: translate(-50%, 10px);
	-moz-transform: translate(-50%, 10px);
	-ms-transform: translate(-50%, 10px);
	transform: translate(-50%, 10px);
	-webkit-transform-origin: top;
	-moz-transform-origin: top;
	-ms-transform-origin: top;
	transform-origin: top;
}
[msg]:before {
	background: no-repeat url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba(17, 17, 17, 0.9)%22%20transform%3D%22rotate(0)%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E");
	background-size: 100% auto;
	width: 1.2em;
	height: 0.5em;
	filter: alpha(opacity=0);
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	-moz-opacity: 0;
	-khtml-opacity: 0;
	opacity: 0;
	pointer-events: none;
	-webkit-transition: all 0.05s ease-out 0.05s;
	-moz-transition: all 0.05s ease-out 0.05s;
	-ms-transition: all 0.05s ease-out 0.05s;
	-o-transition: all 0.05s ease-out 0.05s;
	transition: all 0.05s ease-out 0.05s;
	content: '';
	position: absolute;
	z-index: 10;
	bottom: 100%;
	left: 50%;
	margin-bottom: 5px;
	-webkit-transform: translate(-50%, 10px);
	-moz-transform: translate(-50%, 10px);
	-ms-transform: translate(-50%, 10px);
	transform: translate(-50%, 10px);
	-webkit-transform-origin: top;
	-moz-transform-origin: top;
	-ms-transform-origin: top;
	transform-origin: top;
}
[msg][msg-show]:before, [msg][msg-show]:after {
	filter: alpha(opacity=100);
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
	-moz-opacity: 1;
	-khtml-opacity: 1;
	opacity: 1;
	pointer-events: auto;
}
[msg][msg-show]:after {
	-webkit-transform: translate(-50%, 0);
	-moz-transform: translate(-50%, 0);
	-ms-transform: translate(-50%, 0);
	transform: translate(-50%, 0);
}
[msg][msg-show]:before {
	-webkit-transform: translate(-50%, 0);
	-moz-transform: translate(-50%, 0);
	-ms-transform: translate(-50%, 0);
	transform: translate(-50%, 0);
}
.epNumFix
{
	margin: 0.3em 0 !important;
	display: table;
	text-align: center;
}
.epNumFix input
{
	max-width: 3em;
	border: 0;
}
.epNumFix .input
{
	background-color: white;
	color: black;
	border: 1px solid black;
}
div.entry[color="white"] .epNumFix .input
{
	border: 1px solid white;
}

body:not(.enableEpDateFix) .epDateFix,
div.entry[data-episode=""] .epDateFix
{
	display: none;
}
.epDateFix
{
	margin: 0.3em 0 !important;
	display: table;
	text-align: center;
}
.epDateFix input
{
	width: 100%;
	max-width: 100%;
	border: 0;
}
.epDateFix .input
{
	width: 8em;
	background-color: white;
	color: black;
	border: 1px solid black;
}
div.entry[color="white"] .epDateFix .input
{
	border: 1px solid white;
}
.epDateFix:not([title]) > div > span
{
	display: none;
}
.epDateFix[title] input
{
	background-color: lightgreen;
}
#epDateFix
{
	display: none;
}

div.days
{
	min-width: 1001px;
}
div.day
{
	min-width: 137px;
}

/*
disqus notificaiton badge
*//*
.notifBadge.loading:before
{
	border-radius: 25px;
	border: 2px solid transparent;
	border-color: transparent #c2c6cc;
	animation: rotate-loading 1.5s linear 0s infinite normal;
	transform-origin: 50% 50%;
	position: absolute;
	content: "";
	width: 1.5em;
	height: 1.5em;
	left: 0.4em;
	top: -0.2em;
}

.notifBadge.loading
{
	color: transparent;
}
.notifBadge
{
	display: inline-block;
	width: 1.5em;
	height: 1.5em;
	position: relative;
	top: -0.8em;
}

.notifBadge:not(.loading)
{
	color: #fff;
	font-size: 1em;
	font-weight: bold;
	text-align: center;
	background-color: #f05f70;
	border-radius: 1.5em;
	vertical-align: top;
	line-height: 1.5em;
	padding-right: 0.1em;
	cursor: pointer;
	margin-left: 0.5em;
	z-index: 1;
}
.notifBadge:not(.loading):before
{
	content: "";
	position: absolute;
	top: 0.88em;
	left: 0.13em;
	width: 1em;
	height: 0.5em;
	background-color: #f05f70;
	transform: rotateZ(-5deg) skewX(-30deg);
	z-index: -1;
}
.notifBadge:not([unread]):not(.loading)
{
	display: none;
}

#manage-cushows-popup .content
{
	padding: 0 5px;
}

#cushows-edit > div > div
{
	padding: 0.1em 0 0.1em 0.5em;
}
#cushows-edit > div > span
{
	width: 22em;
	padding: 0.1em 0 0.1em 0.5em;
}

#cushows-list
{
	margin: 5px 0;
}

#cushows-edit > .data > label
{
	vertical-align: top
}

#cushows-edit textarea
{
	font-size: 0.9em;
}

#cushows-edit
{
 border-top: 1px dotted
}

#cushows-edit > div
{
	display: table-row;
}

#cushows-edit textarea
{
	white-space: pre;
	overflow: auto;
	vertical-align: top;
	height: 100%;
	min-height: 3em;
	height: 5em;
	min-width: 20em;
	margin: 0;
	padding: 0 2px 0 0;
}

body.ff #cushows-edit textarea
{
	padding: 2px;
}

#cushows-season,
#cushows-episode,
#cushows-num,
#cushows-days
{
	width: 3em;
}

#cushows-date
{
	width: 6em;
}

#cushows-edit:not(.help)  #cushows-help > .expand,
#cushows-edit.help  #cushows-help > .collapse,
#cushows-edit:not(.help) > div.info
{
	display: none;
}
#cushows-edit #cushows-help
{
	cursor: pointer;
}

#cushows-edit #cushows-help,
#cushows-edit > div.info
{
	font-size: 0.9em;
	color: grey;
}
#cushows-edit > div > span
{
	max-width: unset;
	margin-right: 3em;
	display: block;
}

#cushows-list > li
{
	padding-left: 5px;
	padding-right: 5px;
	cursor: default;
	border: 1px solid transparent;
	display: block;
	transition: margin 0.2s;
}

#cushows-list > li > span
{
}

#cushows-list > li > :nth-child(1)
{
	width: 1em;
	height: 1em;
	border: 1px solid black;
	float: unset;
	margin: 0;
	vertical-align: text-top;
	display: inline-block !important;
}

#cushows-list > li > :nth-child(2)
{
	width: 100%;
	max-width: 24.5em;
	overflow: hidden;
	text-overflow: ellipsis;
	display: inline-block;
	margin-left: 4px;
	vertical-align: text-top;
}

.entry:not(.custom) .edit
{
	display: none;
}

.searchResult .title span
{
	color: black;
	text-shadow: 0 1px 2px white, 0 -1px 2px white, 1px 0 2px white, -1px 0 2px white, 1px 1px 2px white, -1px -1px 2px white, -1px 1px 2px white, 1px -1px 2px white;
}

#cushows-edit .info.format
{
	vertical-align: top;
}
#cushows-edit .table
{
	display: table;
}
#cushows-edit .table > div
{
	display: table-row;
}
#cushows-edit .table > div > span
{
	display: table-cell;
	padding: 2px;
}
#cushows-edit .table > div > span:nth-child(1)
{
	text-align: right;
}
#cushows-list > li.updated
{
	border: 1px dotted #90FF90;
}
#cushows-list > li.new
{
	border: 1px dotted #FF9090;
}

#cushows-list > li.edit
{
	border: 1px solid black;
	font-weight: bold;
}

#cushows-list > li.selected:not(.edit)
{
	border: 1px dotted black;
	color: green;
	font-weight: bold
}

#cushows-list > li.edit.delete,
#cushows-list > li.edit.delete > *
{
	text-decoration: line-through;
	color: red;
	font-weight: normal;
	font-style: italic;
}

#engine-edit .action,
#cushows-edit .action
{
	margin: 0.5em 0 0.3em;
	display: inline-flex;
	width: 100%;
}

.break
{
	white-space: pre-line;
}

#engine-edit .action > input,
#cushows-edit .action > input
{
	font-size: 90%;
	float: left;
}

.customColors
{
	white-space: pre;
}
.colors.nopre .customColors
{
	white-space: normal;
}
.color
{
	color: white;
}
#cushows-list .color > .colors
{
	display: none;
	position: relative;
	padding: 5px;
	margin: 0;
	top: 1.3em;
	left: -0.6em;
	border: 1px solid black;
	z-index: 1;
	cursor: default;
	max-width: 27em;
	background-color: white;
}
#cushows-list li.opened > .color > .colors
{
	display: inline-block;
}
#noChangesLog
{
	float: right;
	line-height: 1em;
}
@keyframes rotate-loading {
 0% {
	transform:rotate(0)
 }
 100% {
	transform:rotate(360deg)
 }
}

#searchResults .colors > .picker,
#searchResults .colors .color
{
	width: 1em;
	height: 1em;
}

#searchResults span.picker,
#searchResUlts span.color
{
	width: 1.2em;
	height: 1.2em;
}
.picker
{
	background-image: none;
	width: 0.9em;
	height: 0.9em;
	vertical-align: top;
}

.entry.colorbox:hover:after,
.colorpicker > .picker-light.self:before,
.picker-light:hover:before,
.picker:before
{
	content: "";
	display: inline-block;
	background-repeat: no-repeat;
	vertical-align: top;
	display: block;
	width: 1.2em;
	height: 1.2em;
	position: absolute;
	background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE0IDE0IiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAxNCAxNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMy4xIDEzLjdjLTAuNiAwLjQtMS40IDAuMy0xLjktMC4ybC0wLjgtMC44Yy0wLjUtMC41LTAuNi0xLjMtMC4yLTEuOWwwLjgtMS4zYzAuMS0wLjggMC40LTEuNiAxLTIuMmwzLjMtMy4zYzAtMC42IDAuMi0xLjQgMC43LTEuOWwwLjItMC4yYzAuNS0wLjUgMS4yLTAuNyAxLjktMC41bDAuNC0wLjRjMS4yLTEuMiAzLjMtMS4yIDQuNSAwczEuMiAzLjMgMCA0LjVsLTAuNCAwLjRjMC4yIDAuNyAwIDEuNC0wLjUgMS45bC0wLjIgMC4yYy0wLjUgMC41LTEuMiAwLjctMS45IDAuNWwtMy4zIDMuM2MtMC42IDAuNi0xLjQgMS0yLjIgMWwtMS40IDAuOXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtNS45IDExLjJjLTAuNSAwLjUtMS4xIDAuNy0xLjcgMC44LTAuMSAwLTAuMiAwLTAuMyAwLjFsLTEuNyAxLjEtMS40LTEuNCAxLjItMS43YzAtMC4xIDAuMS0wLjIgMC4xLTAuMyAwLTAuNiAwLjMtMS4yIDAuOC0xLjdsMy44LTMuOGMtMC40LTAuNC0wLjQtMSAwLTEuNGwwLjItMC4yYzAuNC0wLjQgMS0wLjQgMS40IDBsMS0xYzAuOC0wLjggMi4yLTAuOCAzLjEgMCAwLjggMC44IDAuOCAyLjIgMCAzLjFsLTEgMWMwLjQgMC40IDAuNCAxIDAgMS40bC0wLjIgMC4yYy0wLjQgMC40LTEgMC40LTEuNCAwbC0zLjkgMy44eiIvPjxwYXRoIGQ9Im05IDYuNmwtMy44IDMuOGMtMC4zIDAuMy0wLjYgMC40LTEgMC41LTAuMyAwLTAuNiAwLjEtMC44IDAuM2wtMSAwLjctMC4yLTAuMiAwLjctMWMwLjItMC4yIDAuMi0wLjUgMC4zLTAuOCAwLTAuNCAwLjItMC44IDAuNS0xbDMuNy0zLjkiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtNS43IDguM2wtMS4yIDEuMmMtMC4xIDAuMS0wLjIgMC4zLTAuMyAwLjVzLTAuMyAwLjMtMC41IDAuMi0wLjMtMC4zLTAuMi0wLjRjMC4xLTAuNCAwLjMtMC42IDAuNS0wLjhsMS4yLTEuMmMwLjEtMC4xIDAuNC0wLjEgMC41IDBzMC4xIDAuNCAwIDAuNXoiLz48L3N2Zz4=");
	background-position: center;
}
.entry.colorbox:hover:after,
.color,
.svg:before
{
	width: 0.9em;
	height: 0.9em;
}
.picker-light:before,
.picker-light:hover
{
	background-image: none;
}
.colorpicker > .picker-light.self:before,
.picker-light:hover:before
{
	width: 90%;
	height: 90%;
	position: relative;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	-moz-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}

.desc > div.entry
{
	border-top: none;
	border-bottom: 1px dashed #ccc;
}
.desc > div.entry.separating
{
	border-bottom: 1px solid #555;
}
:not(.desc) > div.entry.separating
{
	border-top: 1px solid;
}

li .color
{
	vertical-align: 2px;
}
.colors,
.colors *:not(.color):not(.picker)
{
	cursor: default;
}

.none
{
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

span.checkbox
{
}
span.checkbox:before
{
	content: "☐";
	padding-right: 3px;
	font-size: 1.3em;
}
span.checkbox[checked]:before
{
	content: "☑";
}
.content span.checkbox:before
{
	font-size: 1.3em;
}

/*search bar icon*//*
#searchBecauseNoOneChecks:not(.x)
{
	background: #fff url('data:image/svg+xml;utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%206%206%22%3E%3Cpath%20fill%3D%22%23929292%22%20d%3D%22M2.23%200a2.23%202.23%200%200%201%201.7%203.68l.08.1h.28L6%205.47%205.49%206%203.77%204.29V4l-.1-.09A2.23%202.23%200%201%201%202.24%200m0%20.69a1.54%201.54%200%201%200%201.54%201.54A1.54%201.54%200%200%200%202.23.69z%22%2F%3E%3C%2Fsvg%3E') right 5px center/1em no-repeat;
}
#searchIcon > svg
{
	vertical-align: middle;
	margin-right: 0.3em;
	width: 1em;
	height: 1em;
}
.menuIcon
{
	margin: 0.2em 0.5em 0 0;
}
#menu li
{
	margin-right: 0.7em;
}
#arrow
{
	top: -20px;
	position: fixed;
}

.warning.info
{
	display: block;
	text-align: center;
	width: 100%;
}
.warning.info,
.warning.info > a
{
	color: red;
	font-style: normal;
}

#go2top
{
	position: sticky;
	bottom: 10px;
	margin-right: 10px;
	float: right;
	z-index: 1;
	outline: none;
	background-color: silver;
	color: white;
	cursor: pointer;
	padding: 0;
	width: 1.5em;
	height: 1.5em;
	text-align: center;
	vertical-align: middle;
	display: none;
	border: 1px solid grey;
	border-radius: 3px;
	opacity: 0.8;
}

#go2top > i
{
	border: solid black;
	border-width: 0 3px 3px 0;
	display: inline-block;
	transform: rotate(-135deg);
	-webkit-transform: rotate(-135deg);
	padding: 0.3em;
	vertical-align: bottom;
}

body.archiveBottom div.archiveBottom
{
	display: block;
}

div.archiveBottom
{
	clear: both;
	display: none;
}

#archive-current2
{
	text-align: center;
	display: inline-block;
}

#leaveArchive2
{
	display: none;
}

body.archive #leaveArchive2
{
	display: block;
}

#archive-next2,#archive-prev2,#archive-current2
{
	padding: 5px 10px;
	text-decoration: none;
}

#archive-current2
{
	min-width: 180px;
}

div.separator
{
	margin-top: 0;
}

#account-popup.promptbox,
.promptbox
{
	display: none;
	z-index: 999999 !important;
	width: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.prompt-content
{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	z-index: 999999;
	margin: 0 auto;
}
.prompt-form
{
	background: #FBFBFB;
	border: 1px solid silver;
	padding: 1em;
	border-radius: 3px;
	-webkit-box-shadow: 0 4px 4px -2px grey;
	-moz-box-shadow: 0 4px 4px -2px grey;
	box-shadow: 0 4px 4px -2px grey;
	color: black;
}

.prompt-form > .msg
{
	margin-bottom: 1em;
	white-space: pre-wrap;
}
.prompt-form > .control
{
	float: right;
	margin-top: 1em;
}

.prompt-form > .control > span
{
	display: inline-block;
}
.prompt-form > .control input[type="button"]
{
	height: 2.6em;
	width: 6.1em;
	font-size: 0.96em;
	border-radius: 2px;
	border-image: none;
	border: 1px solid rgba(0,0,0,0.3);
	margin-left: 1em;
}
.prompt-form > .control > input[type="button"]:hover
{
	background-color: initial;/*hover*//*
}
.prompt-form > .control > input[type="button"]:active
{
	background-color: initial;/*active*//*
}
.prompt-form > .control > input.ok
{
	background-color: #5A97FF;
	color: white;
}
.prompt-form > .control > input.ok:hover
{
	background-color: #64A5FF;
}
.prompt-form > .control > input.ok:active
{
	background-color: #2F7DFF;
}
.prompt-form .input
{
	width: 100%;
	min-width: 5em;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}
.prompt-form > textarea
{
	height: 4em;
}
body.popupBlur.popup:not(.prompt) #content > :not(.popup),
body.popupBlur.prompt #content > :not(.promptbox)
{
	-webkit-filter: blur(10px);
	-moz-filter: blur(10px);
	-o-filter: blur(10px);
	-ms-filter: blur(10px);
	filter: blur(10px);
}
body.popup,
body.prompt
{
	overflow: hidden;
	margin-right: 1.5em;
}
body.popupBlur.popup:after,
body.popupBlur.prompt:after
{
}
body.popup > #content:after,
body.promp > #contentt:after
{
	background-color: black;
	opacity: 0.7;
	content: "";
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 9;
}

body:not(.prompt) #content > .promptbox
{
	display: none !important;
}
body.prompt #content > .promptbox
{
	display: flex !important;
}
body.prompts #content > *:not(.promptbox)
{
	-webkit-filter: grayscale(100%);
	filter: grayscale(100%);
}
body.prompt.scrollbar
{
	position: absolute;
}
.themeColorsSettings
{
	display: table;
}
.themeColorBox > div.color
{
	width: 1em;
	height: 1em;
	border: 1px solid black;
	margin-left: 0.5em;
	display: inline-block !important;
	float: unset;
	vertical-align: middle;
	text-align: center;
	padding: 0.1em;
	position: relative;
}
.themeColorBox
{
	display: table-row !important;
	line-height: 2em;
	height: 2em;
}

.themeColorBox > *
{
	display: table-cell !important;
	vertical-align: middle;
}
.themeColorBox > label
{
	text-align: end;
}
.themeColorsSettings
{
	text-align: center;
	width: 100%;
}
.themeColorsSettings > label
{
	width: 100% !important;
}
.themeColorsSettings > *
{
	text-align: initial;
}

.themeColorsSettings.colorpicker > .colorpicker .color
{
	border: 1px solid black;
	-webkit-box-shadow: 0px 0px 10px 0px black;
	-moz-box-shadow:    0px 0px 10px 0px black;
	box-shadow:         0px 0px 10px 0px black;
}
.themeColorsSettings .example
{
	display: inline-block !important;
	margin-left: 1em;
	padding: 0.4em;
	line-height: 1em;
	vertical-align: middle;
	position: relative;
}
.themeColorsSettings .example.example_down_1
{
	bottom: 0;
}
.themeColorsSettings .example.example_down_2
{
	bottom: -1em;
}
.themeColorsSettings .example.example_down_3
{
	bottom: -2em;
}

.themeColorsSettings .themeColorBox[down="1"] .example
{
	bottom: 1em;
}
.themeColorsSettings .themeColorBox[down="2"] .example
{
	bottom: -1em;
}
.themeColorsSettings .themeColorBox[down="3"] .example
{
	bottom: -3em;
}
.themeColorsSettings .themeColorBox:not([color]) > .del
{
	opacity: 0.3;
}
.themeColorsSettings .themeColorBox[color] > .del
{
	cursor: pointer;
}
.themeColorsSettings .themeColorBox > .del
{
	display: inline-block !important;
	height: 0.5em;
	vertical-align: text-top;
}
.themeColorsSettings > div
{
	height: 1em;
}
.lastupdate
{
	font-size: 0.9em;
	opacity: 0.5;
}
#disqus_recommendations
{
	display: none;
}
*/});//css

	style.innerHTML = css;
	style.id = "mainCSS";
	let s = document.getElementsByTagName("head")[0].getElementsByTagName("style")[0];
	s.parentNode.insertBefore(style, s);

	//fix incorrect initial color in colorpicker
	//fix clicking outside of colorpicker saves selected color instead of discarding
	//fix close colorpicker by pressing escape button

	var editingSeriesId = -1,
			pickerCallback = "",
			pickerColor = "";

	var clone = $("#colorPickerHolder").clone();

	$("#colorPickerHolder").remove();
	var picker = clone.length && clone.colorPicker(
	{
		customBG: '#222',
		margin: '4px -2px 0',
		doRender: 'div div',
		animationSpeed: 0,
		opacity: false,

		buildCallback: function($elm) {
			$elm.toggleClass("popup", true);
			let cp = this;
/*			$elm
				.append('<div class="cp-disp"><input type="button" value="Save"> <input type="button" value="Cancel"><input type="text" spellcheck="false" id="colorpicker-hex"></div>')
				.on( "click", "input", function()
				{
					if (!this.value || this.id == 'colorpicker-hex')
						return;

					if (this.value == 'Save')
					{
						if (editingSeriesId != -2)
						{
							Settings.colors.add(cp.color.colors.HEX, cp.color.colors.HEX.toUpperCase() != "FFFFFF");
							assignColor( editingSeriesId, "#" + cp.color.colors.HEX, true );
						}
						if (pickerCallback && pickerCallback in pickerCallbacks && typeof(pickerCallbacks[pickerCallback]) == "function")
						{
							pickerCallbacks[pickerCallback](cp.color.colors.HEX);
						}
						Settings.colors.init();
						editingSeriesId = -1;
						pickerCallback = "";
						pickerColor = "";
					}
					cp.toggle();
				})
*/
			var colorInstance = this.color,
				colorPicker = this;

			$elm.prepend(multiline(function(){/*
<div class="cp-panel">
	R <input type="text" class="cp-r" /><br>
	G <input type="text" class="cp-g" /><br>
	B <input type="text" class="cp-b" /><hr>
	H <input type="text" class="cp-h" /><br>
	S <input type="text" class="cp-s" /><br>
	B <input type="text" class="cp-v" /><hr>
		<span class="cp-hex">#<input id="colorpicker-hex" type="text" spellcheck="false" class="cp-HEX" /></span>
</div>
<div class="cp-disp">
	<input id="colorpicker_save" type="button" value="Save">
	<input type="button" value="Cancel">
</div>
*/
			})).on( "input keydown keyup click", 'input', function(e)
				{
					if (this.type == 'button')
					{
						if (this.value == 'Save')
						{
							if (editingSeriesId != -2)
							{
								Settings.colors.add(cp.color.colors.HEX, cp.color.colors.HEX.toUpperCase() != "FFFFFF");
								assignColor( editingSeriesId, "#" + cp.color.colors.HEX, true );
							}
							if (pickerCallback && pickerCallback in pickerCallbacks && typeof(pickerCallbacks[pickerCallback]) == "function")
							{
								pickerCallbacks[pickerCallback](cp.color.colors.HEX);
							}
							Settings.colors.init();
							editingSeriesId = -1;
							pickerCallback = "";
							pickerColor = "";
						}
						cp.toggle();
						return;
					}
					if (e.key == "Enter" || e.which == 13) //ENTER(13)
					{
						$elm.find('input[value="Save"]').click();
						return;
					}
					if (this.id != "colorpicker-hex")
					{
						let value = this.value.replace(/[^0-9]/g, ""),
								className = this.className,
								type = className.split('-')[1],
								color = {};

						color[type] = value;
						colorInstance.setColor(type === 'HEX' ? value : color,
							type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
						colorPicker.render();
						return;
					}
					let start = this.selectionStart,
							end = this.selectionEnd;

					if (e.type == "keydown")
					{
						if (!e.shiftKey &&
								((start == 1 && end == 1 && (e.key == "ArrowLeft" || e.which == 37))
									|| (e.key == "ArrowUp" || e.which == 38)
									|| (e.key == "Home" || e.which == 36)))
						{
							e.preventDefault();
							start = end = 0;
						}
						if ((e.ctrlKey || e.metaKey))
						{
							let k = 0;
							if (e.key == "z" || e.which == 90)
								k = -1;
							else if (e.key == "y" || e.which == 89)
								k = 1;

							if (k)
							{
								let u = cp.undo(k);
								if (u)
								{
									this.value = u.v;
									this.selectionStart = u.s || start-1;
									this.selectionEnd = u.e || end-1;
								}
								e.preventDefault();
								$(this).trigger("input");
							}
						}
					}
					if (!start && !end)
					{
						this.selectionStart = ++start;
						this.selectionEnd = ++end;
					}
					if (e.type != "input")
						return;

					let rs = 0,
							re = 0,
							r = "",
							val = this.value.toUpperCase();

					for(let i = 0; i < val.length && r.length < 6; i++)
					{
						if (val.charAt(i).match(/[A-F0-9]/))
						{
							r += val[i];
						}
						else
						{
							if (i < start)
								rs++;

							if (i < end)
								re++;
						}
					}
					if (r != this.value)
					{
						this.value = r;
						this.selectionStart = start - rs;
						this.selectionEnd = end - re;
					}

					if (!e.isTrigger)
						cp.undo({v: this.value, s: this.selectionStart, e: this.selectionEnd});

					try
					{
						var col = "#" + new Colors().setColor(this.value).HEX;
log(col);
						if(col.length == 7)
						{
							if (editingSeriesId != -2)
								assignColor(editingSeriesId, col, false);

							if (pickerCallback && pickerCallback in pickerCallbacks && typeof(pickerCallbacks[pickerCallback]) == "function")
							{
								pickerCallbacks[pickerCallback](col, true);
							}
							cp.color.setColor(col);
							cp.render(undefined);
						}
					}
					catch(err)
					{
//log(err);
					}
				}).find(".cp-disp").appendTo($elm);//.on( "input keydown keyup click", '#colorpicker-hex'
/*
			this.keyhandle = function(obj, e)
			{
log(arguments);
				let start = obj.selectionStart,
						end = obj.selectionEnd;

				if (e.type == "keydown")
				{
					if (!e.shiftKey &&
							((start == 1 && end == 1 && (e.key == "ArrowLeft" || e.which == 37))
								|| (e.key == "ArrowUp" || e.which == 38)
								|| (e.key == "Home" || e.which == 36)))
					{
						e.preventDefault();
						start = end = 0;
					}
					if ((e.ctrlKey || e.metaKey))
					{
						let k = 0;
						if (e.key == "z" || e.which == 90)
							k = -1;
						else if (e.key == "y" || e.which == 89)
							k = 1;

						if (k)
						{
							let u = cp.undo(k);
							if (u)
							{
								obj.value = u.v;
								obj.selectionStart = u.s || start-1;
								obj.selectionEnd = u.e || end-1;
							}
							e.preventDefault();
							$(obj).trigger("input");
						}
					}
				}
				if (!start && !end)
				{
					obj.selectionStart = ++start;
					obj.selectionEnd = ++end;
				}
				if (e.type != "input")
					return;

				let rs = 0,
						re = 0,
						r = "",
						val = obj.value.toUpperCase();

				for(let i = 0; i < val.length && r.length < 6; i++)
				{
					if (val.charAt(i).match(/[A-F0-9]/))
					{
						r += val[i];
					}
					else
					{
						if (i < start)
							rs++

						if (i < end)
							re++
					}
				}
				if (r != obj.value)
				{
					obj.value = r;
					obj.selectionStart = start - rs;
					obj.selectionEnd = end - re;
				}

				if (!e.isTrigger)
					cp.undo({v: obj.value, s: obj.selectionStart, e: obj.selectionEnd});
			}
*/
			$("body").on("keydown", function(e)
			{

	//ESC(27) = cancel
				if ((e.key == "Esc" || e.which == 27) && $elm.is(":visible"))
					cp.toggle();
			});
//for some reason Chrome has issues with undo/redo after value was changed by the filter
			this.undo = function (val, init)
			{
				if (!this.store || init)
				{
					this.store = [];
					this.index = -1;
				}

				if (typeof(val) == "object")
				{
					let p = this.store[this.index];
					if (p)
					{
						if (val.v == p.v)
						{
							this.store[this.index] = val;
							return;
						}
					}
					this.store[++this.index] = val;
					if (this.store.length > this.index + 1)
						this.store.splice(this.index + 1);
				}
				else
				{
					let i = this.index + val;
					if (i > -1 && i < this.store.length)
						this.index = i;

					return this.store[i];
				}

				return this;
			};//undo()
		},

		renderCallback: function($elm, toggled) {
			let colors = this.color.colors,
					cpHex = $("#colorpicker-hex"),
					modes = {
						r: colors.RND.rgb.r, g: colors.RND.rgb.g, b: colors.RND.rgb.b,
						h: colors.RND.hsv.h, s: colors.RND.hsv.s, v: colors.RND.hsv.v,
	//					HEX: "#" + this.color.colors.HEX
					};

			$('input', '.cp-panel').each(function()
			{
				let val = modes[this.className.substr(3)];
				if (typeof(val) != "undefined")
					this.value = val;
			});
			if (pickerCallback && pickerCallback in pickerCallbacks && typeof(pickerCallbacks[pickerCallback]) == "function")
			{
				pickerCallbacks[pickerCallback](typeof(toggled) == "undefined" ? colors.HEX : toggled , true);
			}
			// on show
			if( toggled === true ){
				let col = editingSeriesId == -2 ? pickerColor : coalesce(DB.getColor(editingSeriesId), colors.HEX),
						val = colFix(col).replace(/[^0-9a-f]/gi, "");

				cpHex.val(val);
				this.undo({v: val, s: 0, e: 0});
				document.body.classList.toggle("colorpicker", true);
			}
			// on change
			else if( typeof(toggled) == "undefined" ){
	//preview new color
				if (editingSeriesId != -2)
					assignColor( editingSeriesId, "#" + colors.HEX, false );

				if (colors.HEX != new Colors().setColor(cpHex.val()).HEX)
				{
//					this.undo({v: "#" + colors.HEX, s: cpHex.selectionStart, e: cpHex.selectionEnd});
//					cpHex.val("#" + colors.HEX);
					this.undo({v: colors.HEX, s: cpHex.selectionStart, e: cpHex.selectionEnd});
					cpHex.val(colors.HEX);
				}
			}
			// on hide
			else if( toggled === false ){
				document.body.classList.toggle("colorpicker", false);
				document.body.classList.toggle("colorpickerclose", true); //work around click firing on other elements
				setTimeout(function()
				{
					document.body.classList.toggle("colorpickerclose", false);
				}, 500);
	//restore entry color
				if( editingSeriesId > 0 )
					loadColor( editingSeriesId );


				editingSeriesId = -1;
				pickerCallback = "";
				pickerColor = "";
				picker.detach().appendTo("body");
			}
		}//renderCallback()
	}).attr("id", "colorPickerHolderNew"); //replace ID so it won't initialize in main.js

//log(picker);
	function colFix(c)
	{
		return "#" + String(c).toUpperCase().replace(/[^A-F0-9]/g, "");
	}

	$("body").off("click", ".picker");

	// now hook up the picker to the picker icons
	$("body").on("click", ".picker", function(e)
	{
		if( !$(e.target).hasClass("picker") ) return;

		editingSeriesId = $(this).parents("[data-series-id]").data("series-id");
		let col = DB.savedColors[editingSeriesId];
		if (!editingSeriesId && this.classList.contains("self"))
		{
			editingSeriesId = -2;
			pickerCallback = this.getAttribute("callback");
			col = new Colors().setColor(coalesce($(this).css("background-color"), "#FFFFFF")).HEX;
			col = coalesce(col, "#FFFFFF");
		}
	//set initial color in colorpicker based on current entry or default to white
		col = coalesce(col, "#FFFFFF");
		if (col == "#FFFFFF" && Settings.prefs.lastColor)
			col = "#" + Settings.prefs.lastColor;

		picker.val(col);
		pickerColor = col;
		picker.detach().appendTo(this).click();
	});

	function middleClick(e)
	{
		if (e.button != 1 && !(!e.button && e.ctrlKey))
			return;

		e.stopPropagation();
		e.preventDefault();
		if (e.target.tagName == "INPUT")
			return;

		let parent,
				entry = true;

		if (e.target.closest("div.title"))
			parent = [e.target.closest("div.entry")];
		else
		{
			parent = e.target.parentNode.querySelectorAll("div.entry");
			entry = false;
		}
		const engines = [];

		for(let i = 0; i < _engines.length; i++)
		{
			let engine = _engines[i];
			if (engine.host in customLinks._list) //using up-to-date data
				engine = customLinks._list[engine.host];

			if (document.body.classList.contains("engine_" + cleanName(engine.host)))
				engines[engines.length] = engine;
		}
		for(let i = 0; i < parent.length; i++)
		{
			const div = parent[i],
						MONKEY_ID = encodeURIComponent( div.dataset.seriesId );

			if (!entry && !DB.getColor(MONKEY_ID))
				continue;

			for(let i = 0; i < engines.length; i++)
			{
				const link = parseLink(div, engines[i]);
				window.open(link.href, (link.MONKEY + engines[i].name).replace(/[^0-9a-zA-Z_-]/g, ""));
			}
		}
	}//middleClick()

	function parseLink(div, engine)
	{
//on middle click
		let el = $(div),
				title = (div._title && div._title._titleOrig ? div._title._titleOrig : el.children("div.title").text())
								.replace("?", "").replace(/[0-9]+-[0-9]+-[0-9]+/, ""),
				_MONKEY = title.replace(/ E[0-9]+/g, "") || "",
				_MONKEY_N = title.replace( /\s*S[0-9]+E[0-9]+$/g, '' ) || "",
				_WIKI_TITLE = el.data("series-source"),
				_MONKEY_ID = el.data("series-id"),
				regexp = getRegexp(engine.regexp, undefined, true),
				MONKEY_REGEXP = _MONKEY,
				MONKEY_N_REGEXP = _MONKEY_N;

		if (regexp.length)
		{

			for(let i = 0; i < regexp.length; i++)
			{
				MONKEY_REGEXP = MONKEY_REGEXP.replace(regexp[i][0], regexp[i][1]);
				MONKEY_N_REGEXP = MONKEY_N_REGEXP.replace(regexp[i][0], regexp[i][1]);
			}
		}
		MONKEY_REGEXP = encodeURIComponent(MONKEY_REGEXP);
		MONKEY_N_REGEXP = encodeURIComponent(MONKEY_N_REGEXP);
		let MONKEY = encodeURIComponent( _MONKEY ),
				MONKEY_N = encodeURIComponent( _MONKEY_N ),
				WIKI_TITLE = encodeURIComponent( _WIKI_TITLE ),
				MONKEY_ID = encodeURIComponent( _MONKEY_ID ),
				date = (""+(el.data("date")||el.parent().data("date"))).match(/([0-9]{4})([0-9]{2})([0-9]{1,2})/) || ["","","",""],
				href = engine.href
							.replace( "MONKEY_ID", MONKEY_ID )
							.replace( "MONKEY_N_REGEXP", MONKEY_N_REGEXP )
							.replace( "MONKEY_REGEXP", MONKEY_REGEXP )
							.replace( "MONKEY_N", MONKEY_N )
							.replace( "MONKEY", MONKEY )
							.replace( "{YEAR}", date[1] )
							.replace( "{MONTH}", date[2] )
							.replace( "{DAY}", date[3] )
							.replace( "{WIKI_TITLE}", WIKI_TITLE );

		if (regexp.length && engine.href.indexOf("MONKEY_N_REGEXP") == -1 && engine.href.indexOf("MONKEY_REGEXP") == -1)
		{

			for(let i = 0; i < regexp.length; i++)
			{
				href = href.replace(regexp[i][0], regexp[i][1]);
			}
		}

		return {
			href: fixLink(href, engine),
			title: title,
			MONKEY: MONKEY,
			MONKEY_N: MONKEY_N,
			MONKEY_ID: MONKEY_ID,
			MONKEY_REGEXP: MONKEY_REGEXP,
			MONKEY_N_REGEXP: MONKEY_N_REGEXP,
			WIKI_TITLE: WIKI_TITLE
		};
	}//parseLink()

	$("body").on("mousedown", "div.date,div.title", middleClick);

	let _markSearchResults = markSearchResults;
	window.markSearchResults = function markSearchResults()
	{
		if (showMyShows.box || showMyHidden.box)
			return;

		let searchResults = $("#searchResults"),
				entries = searchResults.find("div.entry");

		entries.each(watched.attach);
		setTimeout(function()
		{
			$("div.day").each(collapseMulti);
		});

		let li = searchResults.find("li[data-series-id]");
		function wikiTitle(node, wiki)
		{
			let text = node.text();

			node.html('<a href="https://www.wikipedia.org/wiki/' + encodeURIComponent(wiki) + '" target="_blank">' + text + '</a>');
		}
		li.each(function()
		{
			let id = this.getAttribute("data-series-id"),
					wiki = DB.info[id] ? DB.info[id][1] : $('div.entry[data-series-id="' + id + '"]').attr("data-series-source"),
					title = $(this).find(".description > b:first-child");

			if (wiki)
			{
				wikiTitle(title, wiki);
			}
			else
			{
				let obj = $("<div/>");
				DB.infoAdd(id);
				if (id > customShows.id)
				{
					DB.infoAdd(id);
					if (DB.info[id] && DB.info[id][1])
						wikiTitle(title, DB.info[id][1]);

					return;
				}

				obj.load("/s?"+$.param({q:"info:" + id}), function(e, t, r)
				{
					if (t == "error")
						return;

					wiki = obj.find(".entry").attr("data-series-source");
					if (wiki)
						wikiTitle(title, wiki);
				});
			}
		});
		if (entries.length)
		{
			let reverseOrder = function (entries, desc)
			{
				if (!entries.length)
					return;

				let before = entries[entries.length-1].nextSibling,
						order = reverseOrder.order(entries);

				if (typeof(desc) != "undefined" && ((desc && order == 1) || (!desc && order == -1)))
					return;

				for(let i = entries.length-1; i > -1; i--)
					entries[i].parentNode.insertBefore(entries[i], before);

				return;
			};
			reverseOrder.order = function(entries)
			{
				return entries[0].innerText.toLowerCase().localeCompare(entries[entries.length-1].innerText.toLowerCase());
			};

			searchResults.prepend('<div class="info"><small><span><span class="button"></span></span></small><div>').find("span.button").click(function(e)
			{
				if (!e.isTrigger)
				{
					Settings.prefs.searchOrder = Settings.prefs.searchOrder ? 0 : 1;
					Settings.save();
				}
				reverseOrder(searchResults.toggleClass("desc", Settings.prefs.searchOrder ? true : false).find("div.entry"), Settings.prefs.searchOrder);
				this.innerHTML = Settings.prefs.searchOrder ? "&#x25BC;" : "&#x25B2;";
			}).trigger("click");
		}
		return _markSearchResults();
	};//markSearchResults()

	$("body").on("click", 'div.entry div.title>input[type="checkbox"]', function(e)
	{
		e.stopPropagation();
		hidePopups();
	});
	//sanitizing engine links
	setTimeout(function()
	{
		var prevOpened = null,
				prevParentOpened = null,
				prevParentOpenTimer = null;

		$("body").off("click", "div.entry div.title");
		$("body").on("click", "div.entry div.title", entryOpen);//$("body").on("click", "div.entry div.title", function(e)
	});
	let aniSpeed = (device.tablet() || device.mobile())? 0 : 100;
	function getRegexp(reg, repl, type)
	{
		let regexp = [],
				lines = [],
				_repl = [];
		if (typeof(reg) == "string")
		{
			lines = reg.trim().replace(/\r/g, "\n").replace(/\n+/g, "\n").split("\n");
		}
		else if (reg)
		{
			for(let i = 0; i < reg.length; i++)
			{
				lines[i] = reg[i][0];
				_repl[i] = reg[i][1];
			}
		}

		repl = typeof(repl) == "string" ? repl.replace(/\r/g, "\n").replace(/\n+/g, "\n").split("\n") : _repl;

		for(let i = 0; i < lines.length; i++)
		{
			let txt = lines[i];
			try
			{
				let reg = /^\/(.*)\/([gimuy]*)$/i,
						parts = txt.match(reg) || (txt = "/" + txt + "/").match(reg);
				try
				{
					let r = new RegExp(parts[1], parts[2]);
					if (!type)
						r = r.toString();

					if (r.toString().match(reg)[1] == parts[1])
						regexp[regexp.length] = [r, repl[i] || ""];
				}
				catch(er){log(er);}
			}
			catch(er){}
		}
		if (regexp.length != lines.length)
			return [];
		return regexp;
	}

	function entryOpen(ev, _engs)
	{
		if (!ev.target)
			return;

		if (!$(ev.target).hasClass("title"))
		{
			return entryOpen({target: ev.target.parentNode});
		}
		force = false;
		let obj = ev.target,
				$entry = $(obj).parent(),
				details = $entry.find(".details");
//		$entry.attr("color", $entry.css("color") == "rgb(0, 0, 0)" ? "black" : "white");
		if (!details.length )
		{
			if( $entry.children( "div.details" ).length == 0 )
			{
				var engs = _engs || window.engines,
						inited = false;

				if (!_engs)
				{
					if($entry.attr("id") == "engine-hidden" || $entry.parents(".calendar").get().length>0)
						engs = engs.concat([{name: "Show all episodes", host: "airdates.tv", href: "javascript:search('info:MONKEY_ID');"}]);
					else
						engs = engs.concat([{name: "Show in calendar", host: "airdates.tv", href: "MONKEY_ARCHIVELINK", cls:"archive-link"}]);

				}
				var e = $( $.parseHTML($( "#detailsTemplate" ).html()) ).appendTo( $entry );

			let _MONKEY = $entry.children("div.title").text().trim().replace(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/, "").trim(),
						_MONKEY_N = _MONKEY.replace( /(S[0-9]+)?E[0-9]+$/g, '' ),
						_WIKI_TITLE = $entry.data("series-source"),
						_MONKEY_ID = $entry.data("series-id");

				var MONKEY = encodeURIComponent( _MONKEY ); //.replace( /[^A-Za-z0-9 -]/g, '' ) );
				var MONKEY_N = encodeURIComponent( _MONKEY_N );
				var MONKEY_ID = encodeURIComponent( _MONKEY_ID );
				var WIKI_TITLE = encodeURIComponent( _WIKI_TITLE );

				$.each( engs, function( i, engine ){
					let regexp = getRegexp(engine.regexp, undefined, true),
							MONKEY_REGEXP = _MONKEY,
							MONKEY_N_REGEXP = _MONKEY_N;

					if (regexp.length)
					{
						for(let i = 0; i < regexp.length; i++)
						{
							MONKEY_REGEXP = MONKEY_REGEXP.replace(regexp[i][0], regexp[i][1]);
							MONKEY_N_REGEXP = MONKEY_N_REGEXP.replace(regexp[i][0], regexp[i][1]);
						}
					}
					MONKEY_REGEXP = encodeURIComponent(MONKEY_REGEXP);
					MONKEY_N_REGEXP = encodeURIComponent(MONKEY_N_REGEXP);
					let eng = $( "#engineTemplate" ).children().clone().appendTo( e.find( ".engines" ) ),
							a = eng.filter("a.link"),
							img = eng.filter("img.icon"),
							br = eng.filter("br"),
							checkbox = document.createElement("input"),
							id = "engine_" + cleanName(engine.host),
							domain = getHost(engine.href),
							date = (""+$entry.closest("[data-date]").data("date")).match(/([0-9]{4})([0-9]{2})([0-9]{1,2})/) || ["","","",""],
							href = engine.href
										.replace("MONKEY_ARCHIVELINK", (""+$entry.closest("[data-date]").data("date")).replace(/([0-9]{4})([0-9]{2})([0-9]{1,2})/,"/archive/$1-$2#$3"))
										.replace( "MONKEY_ID", MONKEY_ID )
										.replace( "MONKEY_N_REGEXP", MONKEY_N_REGEXP )
										.replace( "MONKEY_REGEXP", MONKEY_REGEXP )
										.replace( "MONKEY_N", MONKEY_N )
										.replace( "MONKEY", MONKEY )
										.replace( "{YEAR}", date[1] )
										.replace( "{MONTH}", date[2] )
										.replace( "{DAY}", date[3] )
										.replace( "{WIKI_TITLE}", WIKI_TITLE );
					if (regexp.length && engine.href.indexOf("MONKEY_N_REGEXP") == -1 && engine.href.indexOf("MONKEY_REGEXP") == -1)
					{

						for(let i = 0; i < regexp.length; i++)
						{
							href = href.replace(regexp[i][0], regexp[i][1]);
						}
					}
					a.attr( "href", href )
						.addClass(engine.cls||"")
						.text( engine.name );
					a[0].insertBefore(img[0], a[0].firstChild);
					eng.css( "display", "" );
					if(engine.host == "airdates.tv")
					{
						a.attr("target","");
						domain = "airdates.tv";
					}
					img.attr("src", engine.icon ? engine.icon : "https://www.google.com/s2/favicons?domain=" + (domain || null));

					img.toggleClass(id, true);
					a.toggleClass(id, true);
					br.toggleClass(id, true);
					if (a.hasClass("archive-link") && (showMyShows.box || showMyHidden.box))
					{
						a.toggleClass("archive-link", false);
						a[0].textContent = "Show all episodes";
						a[0].href = "javascript:search('info:" + MONKEY_ID + "');";
					}
					a[0].href = fixLink(a[0].href, engine);
					if (_engs)
					{
						br.remove();
						return;
					}

					if (engine.host == "airdates.tv")
					{
						let div = document.createElement("div");
						div.className = "tools";
						a[0].parentNode.appendChild(div);
						div.appendChild(a[0]);
						br.remove();
						return;
					}
					$(checkbox).toggleClass(id, true);
					checkbox.engine = engine.host;
					checkbox.type = "checkbox";
					checkbox.title = "Open with middle click on title";
					checkbox.checked = enginesCheck(engine.host) != -1;
					img[0].parentNode.insertBefore(checkbox, img[0]);
					a.on("click", function(e)
					{
						if (e.target === this)
							return;

						let c = checkbox.checked;
						e.preventDefault();
						if (c)
							enginesAdd(checkbox.engine);
						else
							enginesRemove(checkbox.engine);

						$("input." + id).prop("checked", c);
						setTimeout(function()
						{
							checkbox.checked = c;
						});
					});
				} );
				inited = true;
			} //if( $entry.children( "div.details" ).length == 0 )
			if (_engs)
				return;

			let showHideBox = document.createElement("div"),
					showHideObj = document.createElement("a"),
					entry = obj.parentNode,
					showId = entry.getAttribute("data-series-id"),
					show = document.createElement("span"),
					hide = document.createElement("span");

			show.innerHTML = SVG.show + 'Show';
			show.className = "showhide0";
			hide.innerHTML = SVG.hide + 'Hide';
			hide.className = "showhide1";
			showHideObj.appendChild(show);
			showHideObj.appendChild(hide);
			showHideObj.appendChild(document.createTextNode(" this show"));

			showHideObj.className = "showhide";
			showHideObj.href = "#";
			showHideObj.addEventListener("click", function(e)
			{
				e.stopPropagation();
				e.preventDefault();
				showHide(parseInt(showId), 2);
			}, false);
			showHideBox.appendChild(showHideObj);
			$entry.find(".engines > .tools").last().append(showHideBox);

			let epNumFixBox = document.createElement("div"),
					epNumFixInputSeason = document.createElement("input"),
					epNumFixInputEpisode = document.createElement("input"),
					_title = obj.parentNode._title || {_titleDefault: $entry.children("div.title").text()},
					title = _title._titleDefault;

			let data = episodeNumberFix.Get(showId, title, false, false);

			if (data)
			{
				epNumFixBox.className = "epNumFix";
				epNumFixInputEpisode.value = data.episodeOffset;
				epNumFixInputEpisode.type = "number";
				epNumFixInputEpisode.min = -999;
				epNumFixInputEpisode.max = 999;
				epNumFixInputSeason.value = data.seasonOffset;
				epNumFixInputSeason.type = "number";
				epNumFixInputSeason.min = -999;
				epNumFixInputSeason.max = 999;
				let epNumFixEvt = function (evt)
				{
					try
					{
						let s = this.selectionStart,
								e = this.selectionEnd,
								num = Math.min(1000, Math.max(-1000, Number(this.value.replace(/[^0-9\-]/g, ""))));

						this.value = num;

						if (e !== null)
							this.selectionEnd = e;
						if (s !== null)
							this.selectionStart = s;

						if (!evt.isTrigger)
						{
							epNumFixSave();
						}
	//					Settings.pref("timeOffset", timeOffset);
	//					if (!evt.isTrigger)
	//						todayChange(timeOffset);
					}
					catch(er){console.error(er);}
				};
				let epNumFixSave = function ()
				{
					episodeNumberFix.Set(showId, title, Number(epNumFixInputSeason.value), Number(epNumFixInputEpisode.value));
					episodeNumberFix.save();
//	log(episodeNumberFix.list[showId]);

					let days = {};

					$('div.entry[data-series-id="' + showId + '"]:not(.colorbox)').each(function(i, entry)
					{
/*
						if (!entry._title)
						{
							entry._title = $(entry).find(".title").children("span").contents().filter(function() {return this.nodeType === 3})[0];
							entry._title._titleDefault = entry._title.textContent;
						}
*/
						let title = entry._title;
						title.textContent = episodeNumberFix(entry.getAttribute("data-series-id"), title._titleDefault);
						title._titleOrig = title.textContent || "";
						entry.setAttribute("title", title.textContent);
						if (!entry._title)
						{
//entry.lastChild.textContent = title.textContent;
						}
						if (entry.hasAttribute("opened"))
						{
							$.each( engs, function( i, engine )
							{
								let id = "engine_" + cleanName(engine.host);
								$(entry).find("." + id).filter("a.link").attr("href", parseLink(entry, engine).href).contents().filter(function()
								{
									if (this.nodeType === 3)
										this.href = engine.href;
								});
							});
						}
						else
						{
							$(entry).find("div.details").remove();
						}
						const day = entry.parentNode.getAttribute("data-date");
						if (day)
						days[day] = entry.parentNode;
					});

					for(let i in days)
					{
						collapseMulti(i, days[i], true);
					}
				};
				$(epNumFixInputSeason).on("input", epNumFixEvt);
				$(epNumFixInputEpisode).on("input", epNumFixEvt)
				.trigger("input");

				let txt = document.createElement("div");
				txt.textContent = "Episode # offset";
				epNumFixBox.appendChild(txt);
				let box = document.createElement("div");
				box.className = "input";
				box.appendChild(document.createTextNode("S"));
				box.appendChild(epNumFixInputSeason);
				box.appendChild(document.createTextNode("E"));
				box.appendChild(epNumFixInputEpisode);
				epNumFixBox.appendChild(box);
				showHideBox.parentNode.insertBefore(epNumFixBox, showHideBox.nextSibling);
			}


			let epDateFixBox = document.createElement("div"),
					epDateFixInput = document.createElement("input");

				epDateFixBox.className = "epDateFix";
				epDateFixInput.value = 999;
				epDateFixInput.type = "number";
				epDateFixInput.min = -999;
				epDateFixInput.max = 999;
				let epDateFixEvt = function (evt)
				{
					try
					{
						let s = this.selectionStart,
								e = this.selectionEnd,
								num = Math.min(1000, Math.max(-1000, Number(this.value.replace(/[^0-9\-]/g, ""))));

						this.value = num;

						if (e !== null)
							this.selectionEnd = e;
						if (s !== null)
							this.selectionStart = s;

						if (!evt.isTrigger)
						{
							epDateFixSave();
						}
	//					Settings.pref("timeOffset", timeOffset);
	//					if (!evt.isTrigger)
	//						todayChange(timeOffset);
					}
					catch(er){log(er);}
				};
				epDateFixInput._epDateFixTitle = function (id, list)
				{
					let last = list[list.length - 1];
					if (list.length)
					{
						list.sort().forEach(function(val, i)
						{
							list[i] = episodeTools.full(val);
						});
						return epDateFixBox.title = "Inherited from " + list.join(">");
					}
					return epDateFixBox.removeAttribute("title");
				};
				let epDateFixSave = function ()
				{
					let data = epDateFix.check(showId, entry._episodeID),
							offset = ~~epDateFixInput.value;

//					epDateFix.move(entry, entry._episodeID, offset);
					offset = offset - data.offsetPrev;
					epDateFix.update(showId, entry._episodeID, offset);
					epDateFixInput._epDateFixTitle(entry._episodeID, epDateFix.check(showId, entry._episodeID).parentList);
					let days = epDateFix();
					epDateFix.save();
					for (let i = 0; i < days.length; i++)
					{
						sortMyShows($(days[i]).find(".entry"));
					}
					epDateFixInput.focus();
				};
				$(epDateFixInput).on("input", epDateFixEvt)
				.trigger("input");

				let txt = document.createElement("div");
				txt.innerHTML = "Date offset (in days) <span>*</span>";
				epDateFixBox.appendChild(txt);
				let box = document.createElement("div");
				box.className = "input";
				box.appendChild(epDateFixInput);
				epDateFixBox.appendChild(box);
				showHideBox.parentNode.insertBefore(epDateFixBox, showHideBox.nextSibling);




			let editBox = document.createElement("div"),
					editObj = document.createElement("a"),
					editIcon = document.createElement("span");

			editIcon.innerHTML = SVG.edit + 'Edit';
			editObj.appendChild(editIcon);
			editBox.appendChild(editObj);
			editBox.className = "edit";
			editObj.href = "#";
			editObj.addEventListener("click", function(e)
			{
				e.stopPropagation();
				e.preventDefault();
				let data = entry._cushowId;
				if (!data)
				{
					try
					{
						data = JSON.parse(entry.getAttribute("data-data"));
					}catch(er){console.error(er);}
				}
				customShows.show(showId, data);
			}, false);
			showHideBox.parentNode.insertBefore(editBox, showHideBox.nextSibling);
		}//if (!details.length )

		if (_engs)
			return;

		details = $entry.find( ".details" );
		let parent = $entry.parent(),
				speed = Settings.pref("animSpeed") * aniSpeed,
				open = details.is( ":visible" );

		function callbackClose(obj)
		{
			let entry = $(obj).parent(),
					parent = entry.parent();

			if (!open && $(obj).is(details))
				return;

			entry.removeAttr("opened");
			parent.removeAttr("opened");
			parent.toggleClass("opened", false);
			if (parent[0])
				collapseMulti.setTitle(parent[0].list, Settings.prefs.collapseMulti && !parent.hasClass("expand")? "_titleCollapsed" : "_titleOrig");
		}
		$( "div.entry" ).filter("[opened]").find("div.details").slideUp(speed, function()
		{
			callbackClose(this);
		});
		if( !open )
		{
			let entry = obj.parentNode,
					epFixData = epDateFix.check(entry.dataset.seriesId, entry._episodeID),
					epFixParent = epFixData.parentList[epFixData.parentList.length - 1],
					input = entry.querySelector("div.epDateFix > .input > input");

			input.value = epFixData.offset || 0;
			input._epDateFixTitle(entry._episodeID, epFixData.parentList);

			let callbackOpen = function()
			{
				$entry.attr("opened", "");
				parent.attr("opened", "");
				parent.toggleClass("opened", true);
				if (parent[0])
					collapseMulti.setTitle(parent[0].list, "_titleOrig");
			};
			details.slideDown(speed, callbackOpen);
			$entry.attr("opened", "");
			parent.attr("opened", "");
			if (parent[0])
				collapseMulti.setTitle(parent[0].list, "_titleOrig");
		}
	}//entryOpen()
	function fixLink(link, engine)
	{
		link = link.replace("%3F", "").replace(/( |%20)E[0-9]+/, "");
		if (engine.name == "Piratebay")
			link = link.replace(/['"`!]/g, '');

		if (engine.host.indexOf("magnetdl.com") != -1)
		{
/*
			link = link.toLowerCase().replace(/%20/g, "-").replace(/%[a-z0-9]{2}/g, "").replace(/\/[a-z]\/\/?([^\/]*\/?)$/, function(a, b)
			{
				return "/" + b[0] + "/" + b;
			});
*/
			link = link.replace(/\/[a-z]\/\/?([^\/]*)\/?$/, "/search/?q=$1&m=1&x=0&y=0");
		}

		return link;
	}

	function showHideLoad()
	{
		if (showHideLoad.inited)
			return;

		$(".days").before(createCheckbox("showHidden", "Hidden shows", Settings.prefs.showHidden ? true : false, Settings.callback));
		$(".days").before(createCheckbox("collapseMulti", "Collapse multiple", Settings.prefs.collapseMulti ? true : false, collapseMulti.onOff));
		$(".days").before(createCheckbox("showWatched", "Watched shows", Settings.prefs.showWatched ? true : false, Settings.callback));
		for(let i = 0; i < _hidden.length; i++)
		{
			showHide(_hidden[i], 1);
		}
		showHideLoad.inited = true;


		let clearColors = $(".clearColors"),
				clearHidden = clearColors.first().clone(false),
				clearWatched = clearHidden.clone(false);

		clearHidden.removeClass();
		clearHidden.addClass("clearHidden");
		clearHidden.html("Clear hidden");
		clearWatched.removeClass();
		clearWatched.addClass("clearWatched");
		clearWatched.html("Clear watched");
		clearWatched.insertAfter(clearColors);
		clearHidden.insertAfter(clearColors);
		$(".clearColors").after(" | ");
		$(".clearHidden").after(" | ");
		$("body").off("click", ".exportColors");
		$("body").on( "click", ".exportColors", function(e)
		{
			e.stopImmediatePropagation();
			let str = exportGetColors();
			if (str)
					_prompt({
						callback: function(){},
						text: "This is the crazy text. \nYou can save it in a normal textfile and import it to another computer/browser.",
						value: str,
						file: "Airdates.tv_colors_" + (DB.username ? DB.username.replace(/[\/\\?%*:|"<>]/g, "_") + "_" : "") + dateTimestamp() + ".txt",
						ext: ".txt",
					});
			else
					alert("Nothing to export");
			return false;
		});
		$("body").off("click", ".importColors");
		$("body").on( "click", ".importColors", function(e)
		{
			e.stopImmediatePropagation();
			_prompt({
				callback: function(str)
				{
					if( str )
					{
						let num = 0;
						$.each( str.split( ";" ), function( i, e ){
							let arg = e.split("=").concat([true] );
							if (arg.length == 3 && String(Number(arg[0])) === arg[0] && arg[1].match(/^#[a-fA-F0-9]{6}/))
							{
								arg[1] = arg[1].trim();
								assignColor.apply( null, arg );
								num++;
							}
						} );
						setTimeout(function()
						{
							alert( "kk, imported " + num + " colors" );
						});
					}
				},
				text: "Please enter the crazy text!",
				ext: ".txt"
			});
			return false;
		});
	} //showHideLoad()







	//BEGIN custom shows
	function customShows()
	{
		if (!customShows.inited)
			customShows.init();

		let list = customShows.listDate,
				days = document.querySelector(".days"),
				entry = document.createElement("div"),
				title = document.createElement("div");

		entry.className = "entry custom";
		title.className = "title";
		entry.appendChild(title);

//adding title attribute so we can avoid duplicate entries with custom names
		let i = -1,
				_entries = document.querySelectorAll(".days > .day > .entry");

		while(++i < _entries.length)
		{
			if (!_entries[i]._title)
				_entries[i].setAttribute("data-title", _entries[i].textContent.trim());
		}

		for(let i in list)
		{
			let day = days ? days.querySelector('[data-date="' + i + '"]') : null;
//log(day);
			if (!day)
				continue;

			let added = false;
			loopData:
			for(let n = 0; n < list[i].length; n++)
			{
				let data = list[i][n],
						id = data.id - customShows.id,
						episode = (data.season ? "S" + pad(data.season) : "") + "E" + pad(data.episode);

				data.name = customShows._list.l[id][0];
				data.wiki = customShows._list.l[id][2];
				let name = data.name + " " + episode,
//						_entries = day.querySelectorAll('[data-series-id="' + data.id + '"]'),
						_entries = day.querySelectorAll('[data-title="' + name + '"], [data-series-id="' + data.id + '"]'),
						_entry = null,
						titleDiv = null;

				for(let e = 0; e < _entries.length; e++)
				{
//					if (_entries[e]._title && _entries[e]._title._titleDefault == name)
					if (_entries[e].getAttribute("data-series-id") != data.id || (_entries[e]._title && _entries[e]._title._titleDefault == name))
					{
						_entry = _entries[e];
						continue loopData;
					}

					titleDiv =  _entries[e].querySelector('div.title');
					if (titleDiv && titleDiv.innerText.trim() == name)
					{
						if (_entries[e].getAttribute("data-series-id") != data.id) //will never be true
							_entries[e].parentNode.removeChild(_entries[e]);
						else
							continue loopData;
					}
				}

				entry = entry.cloneNode(true);
				title = entry.firstChild;
				title.innerText = name;
				entry.setAttribute("data-series-id", data.id);
//				entry.setAttribute("color", $(entry).css("color") == "rgb(0, 0, 0)" ? "black" : "white");
				entry.setAttribute("data-series-source", data.wiki || "");
				entry.classList.toggle("season-premiere", data.episode == 1 && data.season > 1);
				entry.classList.toggle("series-premiere", data.season == 1 && data.episode == 1);
				entry._cushowId = data.d;
				entry._episode = episode;
				entry._episodeID = episodeTools.id(episode);
				entry._episodeDate = i;
				day.appendChild(entry);
				added = true;
			}
//no longer needed as it's going to be sorted later
/*
			if (added)
			{
				//sort by name;
				Array.prototype.slice
					.call(day.querySelectorAll(".entry"))
					.map(function (a)
					{
						return day.removeChild(a);
					})
					.sort(function (a, b)
					{
log([a, a.dataset.title, a.children[0].innerText])
						return a.children[0].innerText.toLowerCase().localeCompare(b.children[0].innerText.toLowerCase());
					})
					.forEach(function (a)
					{
						day.appendChild(a);
					});
			}
*/

		}
	}//customShows()
	customShows.d2y = function(date)
	{
		return "" + ~~(date/10000);
	};
	customShows.d2m = function(date)
	{
		return ("0" + ~~((date / 100) % 100)).slice(-2);
	};
	customShows.d2d = function(date)
	{
		return ("0" + ~~(date % 100)).slice(-2);
	};
/*
	customShows.__list = {
		i: 4, //next ID
		l: {
				1: [
						"a Test",	// name
						[
							[
								1,	// season
								1,  //episode
								20181101,	// start date
								2, 			// total number of episodes
								7,				// interval in days between episodes
							],
							[
								2,	// season
								1,  //episode
								20181101,	// start date
								2, 			// total number of episodes
								7,				// interval in days between episodes
							]
						],
						"" //wiki
				],
				2: [
						"Test2", // name
						[
							[
								1,	// season
								1,  //episode
								20181116,	// start date
								4, 			// total number of episodes
								0,				// interval in days between episodes
							]
						],
						"" //wiki
				],
				3: [
						"bBad Blood", // name
						[
							[
								2,	// season
								1,  //episode
								20181101,	// start date
								2, 			// total number of episodes
								0,				// interval in days between episodes
							],
							[
								2,	// season
								3,  //episode
								20181108,	// start date
								2, 			// total number of episodes
								7,				// interval in days between episodes
							]
						],
						"test blod" //wiki
				],
			}
	};
*/
	customShows.id = 1000000;//000000;
	customShows.init = function(_list)
	{
		customShows._list = _list || ls("customShows") || {i:1,l:{}};
		customShows.list = {};
		customShows.listDate = {};
		customShows.listNames = {};
		let list = customShows._list.l,
				upgraded = false;

		for(let i in list)
		{
			let name = list[i][0],
					id = ~~i,
					data = list[i][1],
					wiki = list[i][2];

			for(let n = 0; n < data.length; n++)
			{
				if (data[n].length < 5) //old version
				{
					let epArray = /(s([0-9]+))?e([0-9]+)/gi.exec(data[n][0]),
							season = ~~epArray[2],
							episode = ~~epArray[3];

					data[n].splice(0, 0, season);
					data[n][1] = episode;
					upgraded = true;
				}
				let season = data[n][0],
						episode = data[n][1],
						date = data[n][2],
						num = data[n][3],
						days = data[n][4],
						weekDays = "" + (data[n][6] || 1234567),
						perDay = data[n][5] || 1,
						_date = new _Date(0),
						newId = id + customShows.id;

				weekDays = weekDays.replace("7", "0");
				_date.setFullYear(this.d2y(date), this.d2m(date)-1, this.d2d(date));
				_date.setHours(0);
				for (let e = 0; e < num; e++)
				{
					let i = 7;
					while(weekDays.indexOf(_date.getDay()) == -1 && i--)
					{
						_date = new _Date(_date.getTime() + 86400000);
					}
					let newDate = "" + _date.getFullYear() + pad(_date.getMonth()+1) + pad(_date.getDate());

					for (let p = 0; p < perDay && p + e <= num ; p++)
					{
						if (!customShows.list[newId])
							customShows.list[newId] = [];

						customShows.list[newId][customShows.list[newId].length] = {
							date: newDate,
							season: season,
							episode: episode,
							d: data[n]
						};
						if (!customShows.listDate[newDate])
							customShows.listDate[newDate] = [];

						customShows.listDate[newDate][customShows.listDate[newDate].length] = {
							id: newId,
							season: season,
							episode: episode,
							d: data[n]
						};
						episode++;
						if (p)
							e++;
					}
					_date.setDate(_date.getDate() + days);
				}
			}
			customShows.listNames[name.toLowerCase()] = i;
		}
		customShows.inited = true;
		if (upgraded)
			customShows.save();

	};//customShows.init()

	customShows.save = function(list)
	{
		ls("customShows", list || customShows._list);
	};

	customShows.remove = function(id)
	{
		delete customShows._list.l[id];

		$('[data-series-id="' + (id + customShows.id) + '"]').each(function()
		{
			if (this.hasAttribute("opened"))
				this.parentNode.classList.toggle("opened", false);

		}).remove();
		let obj = $('#cush_' + id);
		if (obj.hasClass("opened"))
			obj.parent().toggleClass("opened", false);

		obj.remove();
		assignColor(id + customShows.id, "FFFFFF", true);
		showHide(id + customShows.id, 0);
		customShows.save();
		customShows.init(customShows._list);
		if ($("#searchbar").hasClass("active"))
		{
			let s = $("#searchBecauseNoOneChecks"),
					v = s.val();
			s.val("").trigger("change").val(v).trigger("change");
		}

	};//customShows.remove()

	customShows.search = function(_id, name)
	{
		let searchResults = $("#searchResults");
		if (name)
		{
			let html = "";
			name = ("" + name).toLowerCase();
			for(let i in customShows._list.l)
			{
				let data = customShows._list.l[i],
						id = ~~i + customShows.id;

				if (data[0].toLowerCase().indexOf(name) == -1)
					continue;

				let ep = {},
						today = new Date(),
						last = null,
						next = null;

				today = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
				for(let n = 0; n < customShows.list[id].length; n++)
				{
					ep = customShows.list[id][n];
					let date = ~~ep.date;
					if (date <= today)
					{
						last = date;
					}
					else if (date > today)
					{
						next = date;
						break;
					}

				}
				html += '<li data-series-id="' + id + '">' +
								'<span class="color picker picker-light"></span> ' +
								'<span class="description"><b>' + data[0] + '</b><br>' +
								(last ? "Last aired" : "Next show") +
								': <a class="archive-link" href="/archive/' +
								customShows.d2y(ep.date) + "-" + customShows.d2m(ep.date) + "#" + customShows.d2d(ep.date) +
								'">' + customShows.d2y(ep.date) + "-" + customShows.d2m(ep.date) + "-" + customShows.d2d(ep.date) + "</a><br>" +
								'Indexed: <a href="javascript:search(\'info:' + id + '\');">' + customShows.list[id].length + ' episode' + (customShows.list[id].length > 1 ? "s" : "") + '</a><br>' +
								'</span></li>';

			}
			if (html)
			{
				//sort by name;
				let p = document.getElementById("resultsBecauseNoOneChecks");
				if (p.innerText.indexOf("No results") != -1)
					p.innerHTML = "";

				p.innerHTML += html;

				let changed = false,
						parnt = $(p),
						entries = parnt.children();

				entries.sort(function(a, b)
				{
					let r = a.innerText.toLowerCase().localeCompare(b.innerText.toLowerCase());
					if (r)
						changed = true;

					return r;
				});
/*
				if (Settings.prefs.myShowsTop)
				{
					entries.sort(function(a, b)
					{
						let r = (b.dataset.seriesId in DB.savedColors) - (a.dataset.seriesId in DB.savedColors);
						if (r)
							changed = true;

						return r;
					});
				}
*/
				if (changed);
					parnt.append(entries);

/*
				Array.prototype.slice
					.call(p.children)
					.map(function (a)
					{
						return p.removeChild(a);
					})
					.sort(function (a, b)
					{
						return a.innerText.toLowerCase().trim().localeCompare(b.innerText.toLowerCase().trim());
					})
					.forEach(function (a)
					{
						p.appendChild(a);
					});
*/
			}
			return;
		}
		let id = ~~_id - customShows.id,
				data = customShows.list[_id];

		searchResults.html("");
		if (!data)
			return searchResults.html("Show doesn't exist");

		data.name = customShows._list.l[id][0];
		data.wiki = customShows._list.l[id][2];
		$('<b>' + data.name + ' (all episodes)</b><br>').appendTo(searchResults);
		for(let i = 0; i < data.length; i++)
		{
			$('<div class="entry custom' + (!i ? " separating" : "") + '" ' +
							'data-series-id="' + _id + '" ' +
							'data-series-source="' + data.wiki + '" ' +
							'data-date="' + data[i].date + '" ' +
							'><div class="title"><div class="tiny-date">' + customShows.d2y(data[i].date) + "-" + customShows.d2m(data[i].date) + "-" + customShows.d2d(data[i].date) + '</div>' +
							data.name + " " + (data[i].season ? "S" + pad(data[i].season) : "" ) + "E" + pad(data[i].episode) +
							'</div></div>')
			.appendTo(searchResults)[0]._cushowId = data[i].d;
		}
		$("<br>Your added custom show<br><br>").appendTo(searchResults);
		markSearchResults();
	};//customShow.search()



	customShows.show = function(id, dataId)
	{
		if (!customShows.div)
			customShows.manager();

		let div = $(customShows.div);
		hidePopups();
		div.show();
		setPopup(true);
		if (id)
		{
			let obj = $("#cush_" + (~~id - customShows.id));
			obj.trigger("click");
			scrollIntoView(obj[0], obj[0].parentElement.parentElement, 5, 5);
			customShows.div.scrollIntoView(false);
			let _data = $("#cushows-data"),
					data = _data[0]._data;

			if (dataId && data)
			{
				for (let i = 0; i < data.length; i++)
				{
					if (isEqual(data[i], dataId))
					{
						let t = _data[0],
								fullText = t.value,
								val = fullText.split("\n"),
								s = val.slice(0, i).join("\n").length + (i ? 1 : 0),
								e = val.slice(i, i+1).join("\n").length + 1;

						t.focus();
						t.scrollTop = 0;
						t.value = fullText.substring(0, s+e);
						t.scrollTop = t.scrollHeight;
						t.value = fullText;

						t.setSelectionRange(s, s+e);
						break;
					}
				}
			}
		}
	};//customShows.show()

	function scrollIntoView(el, p, offsetTop, offsetBot)
	{
		let pRect = p.getBoundingClientRect(),
				elRect = el.getBoundingClientRect();

		offsetTop = ~~offsetTop;
		offsetBot = ~~offsetBot;

		if (pRect.bottom < elRect.bottom)
		{
			p.scrollTop = p.scrollTop + (elRect.top - pRect.bottom) + elRect.height + offsetBot;
		}
		if (elRect.top < pRect.top)
		{
			p.scrollTop = p.scrollTop + (elRect.bottom - pRect.top) - elRect.height - offsetTop;
		}
	}
	customShows.hide = function()
	{
		$(customShows.div).hide();
		setPopup(false);
	};

	customShows.manager = function customShowsManager(callback)
	{
		if (customShows.div)
			return callback ? callback() : true;

		let html = multiline(function(){/*
	<div id="manage-cushows-popup" class="popup">
		<style id="manage-cushows-css"></style>
		<div id="manage-cushows-popup-content">
			<div class="header">
				<div class="back" title="Back">
					{SVG-BACK}
				</div>
				<h4>Custom shows</h4>
				<div class="close" title="Close">
					{SVG-CLOSEHOVER}
					{SVG-CLOSE}
				</div>
			</div>
			<div class="content"></div>
		</div>
	</div>
			*/});//html

		let popup = $(html).appendTo("#content");
		customShows.div = popup[0];
		$(popup).find("[id^=account]").each(function()
		{
			this.id = this.id.replace("account", "manage-cushows");
		});

		let content = $(popup).find(".content").html("");
		html = multiline(function(){/*
	<form id="cushows-form">
		<div id="cushows-edit">
			<div>
				<label>Name:</label>
				<div>
					<input id="cushows-name" placeholder="Name of the show">
				</div>
			</div>
			<div>
				<label>Wiki URL:</label>
				<div>
					<input id="cushows-wiki" placeholder="&lt;optional&gt;">
				</div>
			</div>
			<div class="data">
				<label>Episodes:</label>
				<div>
					<textarea id="cushows-data" title="One entry per line" placeholder="S0E0 | YYYYMMDD | n | i | p | 1234567"></textarea>
				</div>
			</div>
			<div>
				<label></label>
				<span id="cushows-help">Separate entries with a new line. <span class="collapse">&#x25B2; More info</span><span class="expand">&#x25BC; Less info</span></span>
			</div>
			<div class="info">
				<label>Format:</label>
				<span><i>S0E0</i> | <i>YYYYMMDD</i> | <i>n</i> | <i>i</i> | <i>p</i> | <i>1234567</i></span>
			</div>
			<div class="info">
				<label><i>S0E0</i></label>
				<span>= Season + Episode number</span>
			</div>
			<div class="info">
				<label><i>YYYYMMDD</i></label>
				<span>= Date the episode starts (can be YYYY-MM-DD)</span>
			</div>
			<div class="info">
				<label><i>n</i></label>
				<span>= Number of episodes (1+)</span>
			</div>
			<div class="info">
				<label><i>i</i></label>
				<span>= Interval between episodes (in days) (0+)</span>
			</div>
			<div class="info">
				<label><i>p</i></label>
				<span>= (optional) number of episodes per day</span>
			</div>
			<div class="info">
				<label><i>1234567</i></label>
				<span class="break">= (optional) day of the week,<br>&nbsp;&nbsp;&nbsp;where 1 = Monday and 7 = Sunday (this setting will superseed the interval between episodes)</span>
			</div>
			<div class="info">
				<label></label>
				<span class="break"><i>Any non-numerical characters (space, coma, slash, letters, etc) can be used as fields separator</i></span>
			</div>
			<div class="info">
				<label id="cushows-example" class="pointer">Example:</label>
				<div></div>
			</div>
			<div>
				<label></label>
				<div class="action">
					<input id="cushows-submitupdate" type="submit" name="update" value="Update">
					<input id="cushows-submit" type="submit" name="add" value="Add new">
					<input id="cushows-reset" type="reset" value="Clear">
				</div>
			</div>
		</div>
	</form>
		*/});//html

		$(html).appendTo(content.parent());
		let cushName = $("#cushows-name"),
				cushWiki = $("#cushows-wiki"),
				cushData = $("#cushows-data"),
				cushForm = $("#cushows-form"),
				cushSubmit = $("#cushows-submit"),
				cushSubmitUpdate = $("#cushows-submitupdate"),
				cushReset = $("#cushows-reset"),
				editId = null,
				_today = new Date(),
				cushBox = document.createElement("div"),
//				dataRegex = /^([^0-9]*([0-9]+)[^0-9]+([0-9]+))[^0-9]+((([0-9]{4})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{1,2}))|(([0-9]{4})[^0-9]*([0-9]{2})[^0-9]*([0-9]{2}))|(([0-9]{4})[^0-9]*([0-9]{1,2})[^0-9]+([0-9]{1,2})))[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]*([0-9]+)?[^0-9]*$/,
				dataRegex = /^([^0-9]*([0-9]+)|([^0-9]*([0-9]+)[^0-9]+([0-9]+)))[^0-9]+((([0-9]{4})[^0-9]+([0-9]{1,2})[^0-9]+([0-9]{1,2}))|(([0-9]{4})[^0-9]*([0-9]{2})[^0-9]*([0-9]{2}))|(([0-9]{4})[^0-9]*([0-9]{1,2})[^0-9]+([0-9]{1,2})))[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]*(([0-9]+)?[^0-9]*)?(([1-7]+)?[^0-9]*)?$/,
				dr = function(d)
				{
					let r = d.match(dataRegex);
					if (!r)
						return r;

					return {
						s: typeof(r[4]) != "undefined" ? ~~r[4] : null,
						e: typeof(r[5]) != "undefined" ? ~~r[5] : ~~r[2],
						y: ~~(r[8] || r[12] || r[16]),
						m: ~~(r[9] || r[13] || r[17]),
						d: ~~(r[10] || r[14] || r[18]),
						n: ~~r[19],
						i: ~~r[20],
						p: ~~r[22] || null,
						w: r[23] || null
					};
				};

		cushBox.id = "cushows-list";
		cushBox.setAttribute("tabindex", 0);
		cushBox.addEventListener("keypress", function(e)
		{
			let obj = null;
			if (e.code == "ArrowUp")
			{
				e.preventDefault();
				e.stopPropagation();
				obj = $(cushBox).find(".edit").prev();
			}
			else if (e.code == "ArrowDown")
			{
				e.preventDefault();
				e.stopPropagation();
				obj = $(cushBox).find(".edit").next();
			}
			else if (e.code == "ArrowLeft")
			{
				e.preventDefault();
				e.stopPropagation();
				obj = $(cushBox).find(".edit").parent().children().first();
			}
			else if (e.code == "ArrowRight")
			{
				e.preventDefault();
				e.stopPropagation();
				obj = $(cushBox).find(".edit").parent().children().last();
			}
			if (obj && obj[0])
			{
				obj.click();
				scrollIntoView(obj[0], obj[0].parentElement.parentElement, 5, 5);
			}
		}, true);
		today = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
		$("#cushows-edit").toggleClass("help", Settings.prefs.cushowsHelp);
		$("#cushows-help").click(function(e)
		{
			Settings.pref("cushowsHelp", !Settings.pref("cushowsHelp") ? 1 : 0);
			$("#cushows-edit").toggleClass("help", Settings.prefs.cushowsHelp);
		});
		$("#cushows-example").click(function(e)
		{
			let t = new Date(),
					sel, range,
					el = this.nextSibling,
					n = rand(1, 7),
					i = rand(0, 2) ? 7 : 1,
					p = rand(0, 5),
					remDup = function(a)
					{
						let b = {};
						for(let i = 0; i < a.length; i++)
						{
							b[a[i]] = "";
						}
						return Object.keys(b);
					},
					w = remDup((Array(n+1).join((Math.random().toString(7)+'0000000').slice(2, 18)).slice(0, n)).replace(/[0]/g, 7).split("")).sort(),
					tooltip = [],
					perDay = 1,
					days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

			for(let c = 0; c < w.length; c++)
			{
				tooltip[tooltip.length] = days[w[c]-1];
			}
			tooltip = tooltip.join("\n");
			w = w.join("");
			t = new Date(t.getTime() - (86400000 * rand(-2, 2)));
			if (!p && w && i == 1)
				p = 1;

			el.innerHTML =	'S<span title="Season">' + pad(rand(0, 15)) + "</span>" +
											'E<span title="Episode">' + pad(rand(0, 22)) + "</span> " +
											'|<span title="Start date"> ' + t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate()) + " </span>" +
											'|<span title="Total number of episodes"> ' + rand(1, 22) + " </span>" +
											'|<span title="Interval between episodes"> ' + i + " </span>" +
											(p ? '|<span title="number of episodes per day"> ' + p + " </span>" : "") +
											(w && i == 1 ?  '|<span title="' + tooltip + '"> ' + w + " </span>": "");

			if (e.isTrigger)
				return;

			try
			{
				sel = window.getSelection();
				if (sel.toString() == '')
				{
					window.setTimeout(function()
					{
						range = document.createRange(); //range object
						range.selectNodeContents(el); //sets Range
						sel.removeAllRanges(); //remove all ranges from selection
						sel.addRange(range);//add Range to a Selection.
					}, 1);
				}
			}
			catch(er){console.error(er);}
		}).trigger("click");
		function change(e)
		{
			clearTimeout(change.timer);
			change.timer = setTimeout(function()
			{
				let error = false,
						name = cushName.val().trim(),
						data = cushData.val().trim();

				if (data.length)
				{
					data = data.split("\n");
					for(let i = 0; i < data.length; i++)
					{
						data[i] = data[i].trim();
//						let d = data[i].match(dataRegex);
//						if (data[i].length && (!d || ~~d[17] < 1 || (d[19] && (d[19].match(/[^1-7]/) || d[19].length > 7))))
						let d = dr(data[i]);
						if (data[i].length && (!d || d.n < 1 || (d.w && d.w.length > 7)))
						{
							error = true;
							break;
						}
					}
				}
				cushName.toggleClass("error", !name.length && data.length ? true : false);
				cushData.toggleClass("error", error || (name.length && !data.length) ? true : false);
				buttonsUpdate();
			}, 0);
		}//change()

		function buttonsUpdate()
		{
			let name = cushName.val().trim().toLowerCase(),
					add = customShows.listNames[name] || !name || !cushData.val().trim() || cushData.hasClass("error"),
					update = (!editId && !customShows.listNames[name]) || !name || !cushData.val().trim() || cushData.hasClass("error"),
					merge = customShows.listNames[name] && customShows.listNames[name] != editId;

//if (editId && customShows.listNames[name])
			edit(customShows.listNames[name] || editId, true, "selected");
			edit(merge ? editId : -1, false, "delete");
			cushSubmitUpdate.val( merge ? "Merge" : "Update");
			cushSubmit.prop("disabled", add);
			cushSubmitUpdate.prop("disabled", update);
			cushReset.prop("disabled", !(name + cushData.val() + cushWiki.val()));

			if (add && !update)
				cushSubmit.hide();
			else
				cushSubmit.show();

			if (update)
				cushSubmitUpdate.hide();
			else
				cushSubmitUpdate.show();
		}

		function sortShows()
		{
			let changed = false,
					p = $(cushBox),
					entries = p.children();

			entries.sort(function(a, b)
			{
				let r = a.innerText.toLowerCase().localeCompare(b.innerText.toLowerCase());
				if (r)
					changed = true;

				return r;
			});
			if (changed);
				p.append(entries);
/*
			Array.prototype.slice
				.call(cushBox.children)
				.map(function (a)
				{
					return cushBox.removeChild(a);
				})
				.sort(function (a, b)
				{
					return a.innerText.toLowerCase().trim().localeCompare(b.innerText.toLowerCase().trim());
				})
				.forEach(function (a)
				{
					cushBox.appendChild(a);
				});
*/
		}
		cushName.on("input change", change);
		cushWiki.on("input change", change);
		cushData.on("input change", change);
		cushReset.click(function(e)
		{
			clearTimeout(change.timer);
			editId = null;
			cushName.toggleClass("error", false);
			cushData.toggleClass("error", false);
			edit();
			setTimeout(buttonsUpdate);
		});
		buttonsUpdate();
		function flash(obj, color, scroll)
		{
			if (!obj[0].parentElement)
				return;

			if (typeof(scroll) == "undefined")
				scroll = true;

			if (scroll)
			{
				scrollIntoView(obj[0], obj[0].parentElement.parentElement, 3, 6);
			}


			obj.toggleClass("update", false);
			obj.css("background-color", color ? color : "#90FF90");
			setTimeout(function()
			{
				obj.toggleClass("update", true);
				setTimeout(function()
				{
					obj.toggleClass("update", false);
				}, 1000);
				obj.removeAttr("style");
			}, 100);
		}

		cushForm.on("submit", function(e)
		{
			e.preventDefault();
			if (editId && document.activeElement == cushSubmit[0])
				editId = null;

			let data = cushData.val().trim().split("\n"),
					ep = [],
					wiki = cushWiki.val().trim();

			for(let i = 0; i < data.length; i++)
			{
/*
				let a = [],
						r = data[i].match(dataRegex);

				if (!r)
					return;

				a[0] = ~~r[2];
				a[1] = ~~r[3];
				let y = r[6] || r[10] || r[14],
						m = r[7] || r[11] || r[15],
						d = r[8] || r[12] || r[16];

				a[2] = y ? y + pad(m) + pad(d) : r[4];

				a[2] = ~~a[2];
				a[3] = ~~r[17];
				a[4] = ~~r[18];
				if (r[19])
					a[5] = ~~r[19];
*/
				let a = [],
						r = dr(data[i]);

				if (!r)
					return;

				a[0] = r.s === null ? "" : r.s;
				a[1] = r.e;

				a[2] = r.y + pad(r.m) + pad(r.d);

				a[2] = ~~a[2];
				a[3] = ~~r.n;
				a[4] = ~~r.i;
				if (r.p)
					a[5] = ~~r.p;

				if (r.w)
					a[6] = ~~Array.from(new Set(r.w.split("").sort())).join("");//remove duplicates


				if (a[3] < 1)
					return;

				ep[ep.length] = a;
			}
			wiki = wiki.replace(new RegExp("\/*?(#.*)?$", ""), "").split("/");
			wiki = wiki[wiki.length-1];
			data = [
				cushName.val().trim(),
				ep,
				wiki || "",
			];
			let oldEditId = editId,
					name = data[0].toLowerCase();

			if (name in customShows.listNames && editId != customShows.listNames[name])
			{
				editId = customShows.listNames[name];
				data[1] = [].concat(customShows._list.l[editId][1], data[1]);
				if (!data[2])
					data[2] = customShows._list.l[editId][2];

				if (oldEditId != editId)
					customShows.remove(oldEditId);
			}
			let isEdit = (editId),
					id = editId || customShows._list.i++,
					seen = {};

			//remove duplicates
			data[1] = data[1].sort().filter(function(item)
			{
				var k = JSON.stringify(item);
				return k in seen ? false : (seen[k] = true);
			});
			let cache = {},
					array = [];

			for(let i = 0; i < data[1].length; i++)
			{
				let str = JSON.stringify(data[1][i]);
				if (!cache[str])
					array[array.length] = data[1][i];

				cache[str] = true;
			}
			data[1] = array;
			if (DB.info[id + customShows.id])
			{
				DB.info[id + customShows.id][0] = data[0];
				DB.info[id + customShows.id][1] = data[2];
				DB.infoSave();
			}
			customShows._list.l[id] = data;
			let obj = null,
					type = "new";

			if (editId)
			{
				obj = $("#cush_" + id);
				obj.children(".name").text(data[0]);
				type = "updated";
			}
			else
			{
				obj = customShowsCreate(id, callback);
				cushBox.appendChild(obj);
				obj = $(obj);
			}
			$("#" + cushBox.id).children().toggleClass("new updated", false);
			obj.toggleClass(type, true);
			obj.attr("title", data[0]);

			sortShows();
			flash(obj, "yellow", true);
			if (isEdit)
			{
				$('[data-series-id="' + (id + customShows.id) + '"]:not(.colorbox)').each(function()
				{
					if (this.hasAttribute("opened"))
						this.parentNode.classList.toggle("opened", false);
				}).remove();
			}
			customShows.init(customShows._list);
			customShows.save();

			$('div[data-series-id="' + (id + customShows.id) + '"]').each(function()
			{
				delete this.parentNode.list;
			});
			showPast(function()
			{
				customShows();
				epDateFix();
				let obj = $('div[data-series-id="' + (id + customShows.id) + '"]');
				if (obj.parent().attr("id") == "searchResults")
					return;
	//adding watched checkboxes
				obj.each(watched.attach);
	//collapse multiple entries of the same series in one day
				obj.parent().each(function(i, e)
				{
					if (e.classList.contains("day"))
						sortMyShows($(e).find("div.entry"));

					collapseMulti(i, this, true);
				});
			});
			showHideLoad();
			if ($("#searchbar").hasClass("active"))
			{
				let s = $("#searchBecauseNoOneChecks"),
						v = s.val();
				s.val("").trigger("change").val(v).trigger("change");
			}
			obj.trigger("click");
//			cushReset.trigger("click");
		});//cushForm.submit()
		function edit(id, scroll, className)
		{
			id = id || editId;
			className = className || "edit";
			for(let i = 0; i < cushBox.children.length; i++)
				cushBox.children[i].classList.toggle(className, (cushBox.children[i].id == "cush_" + id));

			if (scroll)
			{
				let obj = document.getElementById("cush_" + id);
				if (obj)
					scrollIntoView(obj, obj.parentElement.parentElement, 3, 6);

			}
		}
		let colorBox = $( "#detailsTemplate" ).find(".colors").first().clone()[0];
		function customShowsCreate(id, callback)
		{
			let data = {
						get name()
						{
							return customShows._list.l[id][0];
						},
						get l()
						{
							return customShows._list.l[id][1];
						},
						get wiki()
						{
							return customShows._list.l[id][2];
						}
					},
					entry = document.createElement("li"),
					editBox = document.createElement("span"),
					colorPicker = document.createElement("div"),
					nameBox = document.createElement("span");

			nameBox.className = "name";
			nameBox.textContent = data.name;
			colorPicker.className = "color entry colorbox";
			colorPicker.setAttribute("data-series-id", id + customShows.id);
			colorPicker.title = "Set Color";
			entry.title = data.name;
			entry.appendChild(colorPicker);
			entry.appendChild(nameBox);
			entry.appendChild(editBox);
			editBox.className = "editBox";
//EDIT
//			$('<span class="edit" title="Edit"><svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg></span>').appendTo(editBox).click(function(e)
			$(entry).click(function(e)
			{
				if (e.target.classList.contains("colorbox") || (entry.classList.contains("opened") && !$(e.target).parents('.colorbox').get().length))
				{
					colorPicker.appendChild(colorBox);
					$(cushBox).find(':not([id="cush_' + id +'"]).opened').toggleClass("opened", false);
					e.target.parentNode.classList.toggle("opened");
					let opened = e.target.parentNode.classList.contains("opened");
					document.body.classList.toggle("colorbox", opened);
					e.target.parentNode.parentNode.classList.toggle("opened", opened);
					if (opened)
					{
						document.getElementById("manage-cushows-css").innerHTML = '#cushows-list.opened>li.opened{margin-bottom:'
																																			+ (~~window.getComputedStyle(e.target.firstChild).height.replace("px", "")
																																					/ ~~window.getComputedStyle(document.body).fontSize.replace("px", "")
																																					+ 1)
																																			+ 'em}';
						scrollIntoView(e.target.firstChild, e.target.parentElement.parentElement.parentElement, 0, 1);
					}

					e.stopPropagation();
					e.preventDefault();
					return;
				}

				if (document.body.classList.contains("colorbox"))
					return;

				e.stopPropagation();
				e.preventDefault();
				editId = id;
				edit(id);
				cushName.val(data.name);
				cushWiki.val(data.wiki);
				let d = [],
						len = [],
						_data = cloneObj(data.l).sort(function(a,b)
						{
							let r = 0;
							for(let i = 0; i < a.length; i++)
							{
								if (a[i] != b[i])
									return a[i] - b[i];
							}
							return r;
						});

				cushData[0]._data = cloneObj(_data);
				for(let i = 0; i < _data.length; i++)
				{
					_data[i] = cloneObj(_data[i]);
					_data[i][0] = _data[i][0] == "" ? "" : "S" + _data[i][0];
					_data[i][1] = "E" + _data[i][1];
					_data[i][2] = ("" + _data[i][2]).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, "$1-$2-$3");
					for(let n = 0; n < _data[i].length; n++)
					{
						len[n] = Math.max(~~len[n], ("" + _data[i][n]).length);
					}
				}
				for(let i = 0; i < _data.length; i++)
				{
					for(let n = 0; n < _data[i].length; n++)
					{
						if (("" + _data[i][n]).length < len[n])
						{
							if (n < 3)
							{
								_data[i][n] = _data[i][n] + pad(" ", " ", len[n] - _data[i][n].length);
							}
							else
								_data[i][n] = pad(_data[i][n], " ", len[n]);
						}
					}
					_data[i][0] += (_data[i][0] === "" ? "" : " ") + _data[i].splice(1,1);
					d[d.length] = _data[i].join(" ¦ ");
				}
				cushData.val(d.join("\n") + "\n");
				cushName.trigger("change");
			});
//SEARCH
			$('<span class="search" title="Search">' + SVG.search + '</span>').appendTo(editBox).click(function(e)
			{
				if (cushBox.classList.contains("opened"))
					return;

				e.stopPropagation();
				e.preventDefault();
				search("info:" + (id + customShows.id));
			});

//DELETE
			$('<span class="del" title="Delete">' + SVG.del + '</span>').appendTo(editBox).click(function(e)
			{
				if (cushBox.classList.contains("opened"))
					return;

				e.stopPropagation();
				e.preventDefault();
				if (cushReset.prop("disabled"))
					$("#cush_" + id).trigger("click");

				customShows.remove(id);
				if (editId == id)
					editId = null;

				edit();
			});
			entry.id = "cush_" + id;
			let d = [];
			for(let i = 0; i < data.l.length; i++)
			{
				d[d.length] = data.l[i].join("|");
			}
//			dataInput.value = d.join("\n");
			if (callback)
			{
				callback();
			}
			return entry;
		}//customShowsCreate();

		let list = customShows._list.l,
				n = Object.keys(list).length;
		function finished()
		{
			if (!--n)
				callback();

		}
		content.append(cushBox);
		for(let i in list)
		{
			cushBox.appendChild(customShowsCreate(~~i, callback ? finished : null));
		}
		if (!n)
			callback();

		sortShows();

	//	setTimeout(enginesRestore,100);
	};//customShows.manager()



	//END custom shows








	DB.viewing = DB.username != DB.loggedInUsername;
	disqusMessageCount.el = $("#account-overview").parent().append('<span class="notifBadge"></span>').find("span").last()[0];
	function disqusMessageNotifLoaded(loading)
	{
		if (typeof(loading) == "undefined")
			loading = false;

		if (loading)
			disqusMessageCount.el.classList.toggle("loading", true);

		clearTimeout(disqusMessageNotifLoaded.timer);
		disqusMessageNotifLoaded.loop(disqusMessageNotifLoaded.iframe, 1000);
	}

	disqusMessageNotifLoaded.loaded = function loaded()
	{
		disqusMessageCount.el.classList.toggle("loading", false);
	};

	disqusMessageNotifLoaded.loop = function loop(iframe, i)
	{
		if (!(i--))
			return setTimeout(disqusMessageNotifLoaded.loaded, 1000);

		if (iframe)
		{
			if (iframe.style.visibility != "hidden")
			{
				return disqusMessageNotifLoaded.loaded();
			}
		}
		else
		{
			let iframes = document.body.getElementsByTagName("iframe");
			for (let i = 0; i < iframes.length; i++)
			{
				if (iframes[i].src.match(/\/home\/(inbox|preload)\//) && document.body === iframes[i].parentNode)
				{
					disqusMessageNotifLoaded.iframe = iframes[i];
					return loop(iframes[i], 1000);
				}
			}
		}
		disqusMessageNotifLoaded.timer = setTimeout(function()
		{
			loop(iframe, i);
		}, 100);
	};

	if (disqusMessageCount.el)
	{
		disqusMessageCount.el.addEventListener("click", function(e)
		{
			disqusMessageNotifLoaded(true);
			disqusMessageCount.el.removeAttribute("unread");
			$("#disqus_thread").find("iframe").each(function()
			{
				try
				{
					this.contentWindow.postMessage({id: "ade", func: "disqusNotifClick", args: null, return: null}, "https://disqus.com");
				}
				catch(er){}
			});
		}, false);
	}

//fix when removing color it still saves it in database as #FFFFFF
	window.DB._setColor = window.DB.setColor;
	window.DB.setColor = function setColor(id, c)
	{
		if (c == "#FFFFFF")
			c = "";

		if (c)
			DB.infoAdd(id);
		else if (_hidden.indexOf(id) == -1)
			DB.infoRemove(id);

		this._setColor(id, c);
		if (!document.getElementById("searchResults").hasAttribute("opened"))
		{
			if (showMyShows.box)
				showMyShows();
			else if (showMyHidden.box)
				showMyHidden();
		}
	};

	//hiding old combined checkboxes
	$( "#nu-showing" ).toggle(false);
	$( "#nu-hidden" ).toggle(false);
	//add new separate checkboxes
	createCheckbox("showNew", "New shows", Settings.prefs.showNew ? true : false, Settings.callback);
	createCheckbox("showReturn", "Returning shows", Settings.prefs.showReturn ? true : false, Settings.callback);

	//replacing existing "my shows" checkboxes with ours
	let _toggleSelectedOnly = window.toggleSelectedOnly,
			_updateSelectedOnly = window.updateSelectedOnly;

	window.toggleSelectedOnly = function(){};
	window.updateSelectedOnly = function(){};
	$("#selected-only-showing").toggle(false);
	$("#selected-only-hidden").toggle(false);
	createCheckbox("activeOnly", (DB.viewing ? DB.username + " user's" : "My") + " shows", "s", function(e, id, checked){}, [$("#selected-only-hidden").prop("title")]);

	//fix auto clear search field on click
	setTimeout(function()
	{
		$(document).off("click", ".onX, .x").on('touchstart click', '.onX', function( ev )
		{
			ev.preventDefault();
			ev.stopPropagation();
			ev.stopImmediatePropagation();
			$(this).removeClass('x onX').val('').change();

			if (window.hashChanged.hashSearch && location.href.match("#"))
				removeHash();

		});
	//fix no X button after page refresh and browser auto fill search bar with previous text
		$('input.clearable').trigger("input");
	});


/*
	//injecting userscript function execution
		showPast(function()
		{
	//adding watched checkboxes
			$("div.day > div.entry").each(watched.attach);
	//collapse multiple entries of the same series in one day
			$("div.day").each(collapseMulti);
		});
*/
	customShows();
	showHideLoad();

	//list of user's shows
	DB.infoNameClean = function(entry)
	{
		let title = entry._title && entry._title._titleOrig ? entry._title._titleOrig : $(entry).find("div.title").text();
		return title.substring(0, title.lastIndexOf(" "));
	};

	DB.infoSave = function()
	{
		ls("info", DB.info);
		ls("infoChecked", DB.infoChecked);
	};

	DB.infoAdd = function(id, name, nosave)
	{
		if (typeof(name) == "undefined")
		{
			return DB.infoAdd(id, DB.infoGet(id), nosave);
		}
		else if (!name)
		{
			setTimeout(function()
			{
				DB.infoLoad(id);
			}, rand(100, 2000));
			return;
		}
		DB.info[id] = name;
		delete DB.infoChecked[id];
		if (!nosave)
			DB.infoSave();
	};

	DB.infoRemove = function(id)
	{
		delete DB.info[id];
		DB.infoSave();
	};

	DB.infoGet = function(id)
	{
		if (id > customShows.id)
		{
			id = id - customShows.id;
			if (!(id in customShows._list.l))
				return null;

			return [customShows._list.l[id][0], customShows._list.l[id][2]];
		}

		let entry = $('div.days div[data-series-id="' + id + '"]').first()[0];
		if (entry)
			return [DB.infoNameClean(entry), entry.getAttribute("data-series-source")];

		return null;
	};

	DB.infoLoad = function(id, deleteOnError, callback)
	{
		let obj = document.createElement("div");
		if (DB.infoChecked[id] && Date.now() - 3600000 < DB.infoChecked[id][0]) //1 hour
			return;

		if (id > customShows.id)
			return DB.infoAdd(id);

		$(obj).load("/s?"+$.param({q:"info:" + id}), function(e, t, r)
		{
			if (t == "error" || r.responseText === "")
			{
//log([e,t,r]);
log("Show with ID: " + id + " not found (" + r.status + " " + r.statusText + ")");
				let now = Date.now(),
						save = false;

				if (!DB.infoChecked[id])
					DB.infoChecked[id] = [now, now, 4]; //4 weeks

				if (now - 604800000 > DB.infoChecked[id][1]) //7 days
				{
					DB.infoChecked[id][2]--;
					DB.infoChecked[id][1] = now;
				}

				if (r.status == 500 || r.responseText === "")
				{
					DB.infoChecked[id][0] = now;
					save = true;
				}

				if (deleteOnError || DB.infoChecked[id][2] < 1) //delete if failed find name after 4 weeks
				{
log("Show with ID: " + id + " was removed after unseccessfull attempt retreive it's name in last 4 weeks");
//					DB.infoChecked[id][2] = 0;
					delete DB.infoChecked[id];
					delete DB.info[id];
					assignColor(id, "#FFFFFF", true);
					save = true;
				}

				if (save)
				{
					clearTimeout(DB.timer);
					DB.timer = setTimeout(DB.infoSave, 100);
				}
				return;
			}
			let title = $(obj).find("b").first().text();
			title = title.substring(0, title.lastIndexOf("(") - 1);
			if (title)
				DB.infoAdd(id, [title, $(obj).find(".entry").attr("data-series-source")]);
		});
	};//DB.infoLoad()

	function showMyShows(e)
	{
		if (!DB.infoLoaded)
			return setTimeout(showMyShows, 100);

		$(".entry").removeClass("searchResult");
		$("#searchStatus").css("visibility","hidden");
		let list = [],
				info = {};

		for (let i in DB.savedColors)
		{
/*
			if (!DB.info[i])
				continue;
*/
			info[i] = DB.info[i] || ["ZZZZZZZZZZZZZ",""];

//http://runtime-era.blogspot.com/2011/11/grouping-html-hex-colors-by-hue-in.html
			/* Get the hex value without hash symbol. */
			let hex = DB.savedColors[i].substring(1);
			/* Get the RGB values to calculate the Hue. */
			let r = parseInt(hex.substring(0,2),16)/255,
					g = parseInt(hex.substring(2,4),16)/255,
					b = parseInt(hex.substring(4,6),16)/255;

			/* Getting the Max and Min values for Chroma. */
			let max = Math.max.apply(Math, [r,g,b]),
					min = Math.min.apply(Math, [r,g,b]);

			/* Variables for HSV value of hex color. */
			let chr = max-min,
					hue = 0,
					val = max,
					sat = 0;

			if (val > 0)
			{
				/* Calculate Saturation only if Value isn't 0. */
				sat = chr/val;
				if (sat > 0)
				{
					if (r == max)
					{
						hue = 60 * (((g - min) - (b - min)) / chr);
						if (hue < 0)
							hue += 360;
					}
					else if (g == max)
					{
						hue = 120 + 60 * (((b - min) - (r - min)) / chr);
					} else if (b == max)
					{
						hue = 240 + 60 * (((r - min) - (g - min)) / chr);
					}
				}
			}

			/* Modifies existing objects by adding HSV values. */
			list[list.length] = {
				id: i,
				hex: hex,
				hue: hue,
				sat: sat,
				val: val,
				lum: (r * 299 + g * 587 + b * 114) / 1000
			};
		}
		(function display()
		{
			if (Settings.prefs.sortBy == Settings.SORT_COLOR)
			{
				list = list.sort(function(a,b)
				{
					let r = b.hue - a.hue;
					if (!r)
						r = b.val - a.val;
					if (!r)
						r = b.sat - a.sat;
					if (!r)
						r = info[a.id][0].toLowerCase().localeCompare(info[b.id][0].toLowerCase());
					return r;
				});
			}
			else
			{
				list = list.sort(function(a, b)
				{
					return info[a.id][0].toLowerCase().localeCompare(info[b.id][0].toLowerCase());
				});
			}
			$(showMyShows.box).find("span.button").off("click");
			showMyShows.box = document.createElement("div");
			let entry = document.createElement("div"),
					title = document.createElement("div"),
					count = 0;

			entry.appendChild(title);
			entry.className = "entry";
			title.className = "title";
			for(let i = 0; i < list.length; i++)
			{
				let id = list[i].id;

				count++;
				entry = entry.cloneNode(true);
				title = entry.firstChild;
				entry.setAttribute("data-series-id", id);
//				entry.setAttribute("color", $(entry).css("color") == "rgb(0, 0, 0)" ? "black" : "white");
				entry.setAttribute("data-series-source", info[id][1]);

				entry.classList.toggle("custom", (~~id > customShows.id && info[id][0] !== "ZZZZZZZZZZZZZ"));

				title.textContent = info[id][0];
				if (title.textContent === "ZZZZZZZZZZZZZ")
				{
					title.classList.toggle("unknown", true);
					title.textContent = "n/a";
				}
				showMyShows.box.appendChild(entry);
			}
			let text = "You don't have any shows";

			if (count)
			{
				let getSortName = function ()
				{
					let a = ["Name", "Color"];
					return  a[Settings.prefs.sortBy + 1] || a[0];
				};
				text = (DB.viewing ? DB.username + " has " : "You have ") + count + " show" + (count > 1 ? "s" : "") + '. <span>Sort by <span class="button">' + getSortName() + "</span></span>";
			}
			$(showMyShows.box).prepend('<div class="info"><small>' + text + '</small><div>');
			$("#searchResults").html(showMyShows.box.innerHTML).find("span.button").click(function(e)
			{
				if (++Settings.prefs.sortBy > 1)
					Settings.prefs.sortBy = 0;

				Settings.save();
				display();
			});
		})();
	}

	function showMyHidden(e)
	{
		if (!DB.infoLoaded)
		{
			setTimeout(showMyHidden, 100);
			return;
		}
		$(".entry").removeClass("searchResult");
		$("#searchStatus").css("visibility","hidden");
		showMyHidden.box = document.createElement("div");
		let entry = document.createElement("div"),
				title = document.createElement("div");

		entry.appendChild(title);
		entry.className = "entry";
		title.className = "title";
		let list = [],
				count = 0;

		for(let i = 0; i < _hidden.length; i++)
		{
			list[list.length] = _hidden[i];
		}
		list.sort(function(a, b)
		{
			return !DB.info[a] || !DB.info[b] ? -1 : DB.info[a][0].toLowerCase().localeCompare(DB.info[b][0].toLowerCase());
		});
		for(let i = 0; i < list.length; i++)
		{
			let id = list[i];
			if (!DB.info[id])
				continue;

			count++;
			entry = entry.cloneNode(true);
			title = entry.firstChild;
			entry.setAttribute("data-series-id", id);
//			entry.setAttribute("color", $(entry).css("color") == "rgb(0, 0, 0)" ? "black" : "white");
			entry.setAttribute("data-series-source", DB.info[id][1]);
			title.textContent = DB.info[id][0];
			showMyHidden.box.appendChild(entry);
		}
		let text = "There are no hidden shows";
		if (count)
		{
			text = "There are " + count + " hidden show" + (count > 1 ? "s" : "") + ":";
		}
		$(showMyHidden.box).prepend('<small>' + text + '</small><div style="height: 0.5em;"></div>');
		$("#searchResults").html(showMyHidden.box.innerHTML);
	}
	$(document).ready(function()
	{
		function hideNode(id)
		{
			$("." + id).each(function(i, e)
			{
				let prev = e.previousSibling;
				if (prev.nodeType == prev.TEXT_NODE)
				{
					let span = document.createElement("span");
					prev.parentNode.insertBefore(span, prev);
					span.appendChild(prev);
					prev = span;
				}
				$(prev).toggleClass(id + "Icon", true);
			});
		}
		let accountLoop = 50;
		$("#account-popup").attr("hidden", "");
		let accountOverview = $("#account-overview"),
				accountPopup = $("#account-popup");

		accountPopup.toggleClass("popup", true);
		accountOverview.click(function(e)
		{
			if (e.isTrigger)
				return;

			Settings.hide();
			customLinks.hide();
			customShows.hide();
			changesLog.hide();
			setPopup(accountPopup.is( ":visible" ), true);
		})
		.click(function loop(e)
		{
			accountPopup.removeAttr("hidden");
			let as = $("#account-popup-content .content a");
			if( !accountPopup.hasClass("loaded") || (!as.length && accountLoop--))
				return setTimeout(function()
				{
					loop(e);
				}, 100);

			if (!as.length)
				return;

			let header = $("#account-popup-content").find("div.header");
			//account reset password
			if (DB.loggedInUsername)
			{
				let div = $("<div/>").html(header.html().replace(/(\s)+/g, "$1")),
//						a = $('<a href="/_u/forgot-password#' + DB.username +'">Reset password</a>');
						a = $('<a href="/_u/forgot-password">Reset password</a>');
				header.html("").append(div);
				div.find("a").after(a).after(" | ");
			}
			else
			{
//some browsers don't have proper icon in the font
				let span = document.createElement("span");
				span.innerHTML = header[0].firstChild.textContent.replace("Temporary", "Guest").replace("🍪", '<span title="Cookies">' + SVG.guest + '</span>');
				header[0].replaceChild(span, header[0].firstChild);
			}
			let content = $("#account-popup-content").find("div.content");
			//account overview neat icons
			content.contents().filter(function()
			{
				if (this.tagName == "BR")
					this.parentNode.removeChild(this);

				if (this.nodeType != Node.TEXT_NODE || !this.textContent.trim())
					return;

				let span = document.createElement("span"),
						div = document.createElement("div");
				div.appendChild(span);
				div.appendChild(this.nextSibling);
				span.textContent = this.textContent.trim();
				this.parentNode.replaceChild(div, this);
			});

			accountOverview.unbind("click", loop);
			content.find("div:first-of-type > span").html(SVG.link);

			hideNode("importColors");
			let a = document.createElement("a"),
					i = document.createElement("span"),
					span = document.createElement("div"),
					h = document.createElement("h4"),
					item = span,
					parent = as[as.length-1].parentNode.parentNode;

			h.textContent = adeName + " v" + adeVersion;
			parent.appendChild(h);
			span.appendChild(i);
			span.appendChild(a);

			span = span.cloneNode(true);
			a = span.lastChild;
			i = span.firstChild;
			span.className = "search";
			a.className = "";
			a.id = "";
			delete a.className;
			delete a.id;
			i.innerHTML = SVG.search;
			a.href = '#myshows';
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				search("info:myshows");
				$("#account-popup").toggle(false);
				setPopup(false);
			}, false);
			a.textContent = (DB.viewing ? DB.username + " user's" : "My") + " shows";
			parent.appendChild(span);

			span = span.cloneNode(true);
			a = span.lastChild;
			i = span.firstChild;
			i.innerHTML = SVG.search;
			a.href = '#hidden';
			span.className = "search";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				search("info:hidden");
				$("#account-popup").toggle(false);
				setPopup(false);
			}, false);
			a.textContent = "Hidden shows";
			parent.appendChild(span);

			span = span.cloneNode(true);
			span.className = "";
			delete span.className;
			a = span.lastChild;
			i = span.firstChild;
			i.innerHTML = SVG.customlinks;
			a.href = '#';
			a.id = "manage-links-open";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				customLinks.manager(function()
				{
					customLinks.show();
					$("#account-popup").toggle(false);
				});

			}, false);
			a.textContent = "Links manager";
			parent.appendChild(span);

			span = span.cloneNode(true);
			span.className = "myCustomShows";
			delete span.className;
			a = span.lastChild;
			i = span.firstChild;
			i.innerHTML = SVG.customshows;
			a.href = '#';
			a.id = "manage-cushows-open";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				customShows.manager(function()
				{
					customShows.show();
					$("#account-popup").toggle(false);
				});

			}, false);
			a.textContent = "Custom shows";
			parent.appendChild(span);

			span = span.cloneNode(true);
			span.className = "";
			a = span.lastChild;
			i = span.firstChild;
			i.innerHTML = SVG.settings;
			a.href = '#';
			a.id = "settings-open";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				Settings.show();
				$("#account-popup").toggle(false);
			}, false);
			a.textContent = "Options";
			parent.appendChild(span);

			span = document.createElement("span");
			a = document.createElement("a");
			a.href = "https://github.com/vanowm/airdates.tv_enhancer/issues";
			a.target = "_blank";
			a.textContent = "Support";
			span.className = "parentheses support";
			span.appendChild(a);
			span.appendChild(document.createTextNode(" | "));
			a = document.createElement("a");
			a.href = "#changes";
			a.textContent = "Changes";
			a.id = "changesLog-open";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				changesLog.show();
				$("#account-popup").toggle(false);
				if (window.hashChanged.hashSearch && location.hash == "#changes")
					removeHash();

			}, false);
			span.appendChild(a);
			parent.insertBefore(span, h.nextSibling);

			$("#account-popup-content > .header").append($("div.close")[0].cloneNode(true));
		})
		.attr("title", "Main menu")
		.html((accountOverview.html() || "").replace(/Account/, ''))
		.prepend(SVG.menu);//account-overview
		accountOverview.parent().parent().prepend(accountOverview.parent());

		let ul = $("#menu").find("ul"),
				li = ul.find("li");

		accountOverview.parent().parent().append('<li><a id="searchIcon" href="#searchBecauseNoOneChecks" title="Search">' + SVG.search + 'Search</a></li>').find("li:last-child").click(function(e)
		{
			e.originalEvent.preventDefault();
			$("#searchBecauseNoOneChecks").focus();
			var dur = 250,
					arrow = $("#arrow"),
					searchbar = $("#searchbar"),
					left = searchbar.offset().left - 300;
/*
					right = this.____right || $("#searchbar").offset().left - arrow.show().offset().left + arrow.width();
			this.____right = right;
			let searchbar = $("#searchbar");
			searchbar.animate({left:$(this).offset().left}, 200).animate({left:searchbar.offset().left}, 300, function(e){this.style.left = ""; this.style.right = "";});
	*/
			arrow.css({left:left + 200, 'opacity':0}).show()
				.animate({left:left,opacity:1},dur).animate({left:left + 200},dur)
				.animate({left:left},dur).animate({left:left + 200},dur)
				.animate({left:left},dur).animate({left:left + 200},dur)
				.animate({left:left},dur).animate({left:left + 200,opacity:0},dur).hide(1);

		});
		li.contents().filter(function(){return this.nodeType == 3;}).each(function(i,e)
		{
			e.parentNode.removeChild(e); //remove white spaces
		});
		if (DB.viewing)
		{
	//		ul.children("li:last-child").css("margin-right", "1.5em");
			let li = $(multiline(function(){/*
	<li>Viewing as
		<span class="user">
			{SVG-VIEWAS}
		</span>
		<span class="nu"></span>
		<a class="close" title="Close" href="*/}) + window.location.href.replace(/\/u\/[^?#]+/, "") + multiline(function(){/*">
			{SVG-CLOSEHOVER}
			{SVG-CLOSE}
		</a>
	</li>
	*/})).appendTo(ul);

			li.find("span.nu").text(DB.username);
		//fix auto wrap on small screen

			setTimeout(function()
			{
				let width = (ul.width() + $("body #menu + h1 > img").width()/2 + ul.offset().left ) * 2;
				$("head").append('<style id="menuWidth">@media screen and (max-width: ' + width + multiline(function(){/*
px)
{
	body.userViewer #menu li:not(:nth-last-child(2)):not(:last-child){ display: block; }
	body.userViewer #menu li .nu{ min-width: 15px; }
	.calendar {margin-top: 0.5em}
	#searchIcon > svg{margin-right: 0.6em;}
}
				</style>*/}));
			});
		}
		else
		{
			setTimeout(function()
			{
				let width = (ul.width() + $("body #menu + h1 > img").width()/2 + ul.offset().left ) * 2;
				$("head").append('<style id="menuWidth">@media screen and (max-width: ' + multiline(function(){/*
px)
{
	body:not(.userViewer) #menu li{ display: block; }
	body:not(.userViewer) #menu li .nu{ min-width: 15px; }
	.calendar {margin-top: 0.5em}
	#searchIcon > svg{margin-right: 0.6em;}
}
	</style>*/}));
			});
		}

		if (!DB.loggedInUsername)
		{
		//monkey
			let monkey = accountOverview.find("span.nu")[0];
			if (monkey)
			{
				monkey.title = "Colors saved locally in browser's cookies";
//cookies svg
	//			monkey.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" style="vertical-align: middle;"><circle style="fill:#5d433f;" cx="66.06" cy="222.97" r="66.06"/><circle style="fill:#f7b189;" cx="66.06" cy="222.97" r="41.29"/><circle style="fill:#5d433f;" cx="445.94" cy="222.97" r="66.06"/><circle style="fill:#f7b189;" cx="445.94" cy="222.97" r="41.29"/><path style="fill:#543e3b;" d="M442.589,262.049c-8.366-14.436-13.169-30.655-13.169-47.34v-0.001c0-72.373-44.364-134.33-107.355-160.318V24.774l-41.29,16.516l-8.258-33.032c-21.781,7.261-40.361,22.498-54.356,37.298c-77.557,17.283-135.58,86.39-135.58,169.154c0,16.685-4.803,32.904-13.169,47.34c-12.72,21.948-19.863,46.482-19.863,72.402c0,93.496,92.431,169.29,206.452,169.29s206.452-75.794,206.452-169.29C462.452,308.532,455.308,283.997,442.589,262.049z"/><path style="fill:#543e3b;" d="M140.387,364.043c0-30.24,7.143-58.864,19.863-84.469c8.367-16.841,13.169-35.764,13.169-55.23c0-84.035,43.969-155.956,106.493-186.502l-7.396-29.584c-21.781,7.261-40.361,22.498-54.357,37.298C140.604,62.839,82.581,131.946,82.581,214.71c0,16.685-4.802,32.904-13.169,47.34c-12.72,21.948-19.863,46.482-19.863,72.402c0,75.465,60.232,139.37,143.415,161.223C160.282,460.734,140.387,414.619,140.387,364.043z"/><path style="fill:#f7b189;" d="M256,470.71c68.412,0,123.871-44.367,123.871-99.097c0-11.354-2.414-22.245-6.835-32.386c-6.41-14.707-4.228-31.587,6.07-43.889c13.134-15.691,19.908-36.877,16.333-59.635c-4.91-31.259-30.182-56.486-61.448-61.353c-23.892-3.719-46.037,3.968-61.903,18.439c-4.51,4.113-10.3,6.17-16.087,6.17c-5.79,0-11.581-2.056-16.091-6.17c-15.866-14.471-38.011-22.158-61.903-18.439c-31.266,4.866-56.537,30.094-61.448,61.353c-3.575,22.757,3.199,43.943,16.333,59.635c10.298,12.303,12.48,29.182,6.07,43.889c-4.42,10.142-6.835,21.033-6.835,32.386C132.129,426.342,187.588,470.71,256,470.71z"/><path style="fill:#f7b189;" d="M132.129,371.612c0,18.522,6.468,35.795,17.524,50.625c-5.938-18.411-9.266-37.916-9.266-58.195c0-30.24,7.143-58.864,19.863-84.469c8.367-16.841,13.169-35.764,13.169-55.23c0-17.307,1.96-34.056,5.468-50.08c-0.295,0.042-0.583,0.04-0.879,0.086c-31.266,4.866-56.536,30.094-61.448,61.352c-3.575,22.758,3.2,43.944,16.333,59.635c10.298,12.302,12.481,29.181,6.071,43.889C134.543,349.368,132.129,360.259,132.129,371.612z"/><g><path style="fill:#5D5360;" d="M239.476,330.323c-1.242,0-2.5-0.278-3.685-0.871l-16.516-8.258c-4.081-2.04-5.734-7-3.694-11.081c2.048-4.081,7-5.734,11.081-3.694l16.516,8.258c4.081,2.04,5.734,7,3.694,11.081C245.419,328.653,242.508,330.323,239.476,330.323z"/><path style="fill:#5D5360;" d="M272.524,330.323c-3.032,0-5.944-1.669-7.395-4.565c-2.04-4.081-0.387-9.04,3.694-11.081l16.516-8.258c4.073-2.04,9.032-0.387,11.081,3.694c2.04,4.081,0.387,9.04-3.694,11.081l-16.516,8.258C275.024,330.044,273.766,330.323,272.524,330.323z"/></g><path style="fill:#4B3F4E;" d="M182.319,363.355c-5.001,0-8.941,4.431-8.248,9.384c5.126,36.617,39.853,64.938,81.929,64.938c42.077,0,76.803-28.321,81.929-64.938c0.693-4.953-3.247-9.384-8.248-9.384H182.319z"/><path style="fill:#E6646E;" d="M208.417,424.038c13.457,8.563,29.849,13.639,47.583,13.639s34.126-5.076,47.583-13.639c-5.966-20.666-25.063-35.909-47.583-35.909S214.383,403.371,208.417,424.038z"/><path style="fill:#4B3F4E;" d="M181.677,272.516L181.677,272.516c-13.682,0-24.774-11.092-24.774-24.774v-8.258c0-13.682,11.092-24.774,24.774-24.774l0,0c13.682,0,24.774,11.092,24.774,24.774v8.258C206.452,261.424,195.36,272.516,181.677,272.516z"/><path style="fill:#5D5360;" d="M181.677,214.71v28.903c0,6.841,5.546,12.387,12.387,12.387s12.387-5.546,12.387-12.387v-4.129C206.452,225.801,195.36,214.71,181.677,214.71z"/><circle style="fill:#FFFFFF;" cx="181.68" cy="231.23" r="8.258"/><path style="fill:#4B3F4E;" d="M330.323,272.516L330.323,272.516c-13.682,0-24.774-11.092-24.774-24.774v-8.258c0-13.682,11.092-24.774,24.774-24.774l0,0c13.682,0,24.774,11.092,24.774,24.774v8.258C355.097,261.424,344.005,272.516,330.323,272.516z"/><path style="fill:#5D5360;" d="M330.323,214.71v28.903c0,6.841,5.546,12.387,12.387,12.387s12.387-5.546,12.387-12.387v-4.129C355.097,225.801,344.005,214.71,330.323,214.71z"/><circle style="fill:#FFFFFF;" cx="330.32" cy="231.23" r="8.258"/><path style="fill:#FF8087;" d="M256,437.677c2.792,0,5.538-0.169,8.258-0.415v-16.101c0-4.56-3.694-8.258-8.258-8.258s-8.258,3.698-8.258,8.258v16.101C250.462,437.508,253.208,437.677,256,437.677z"/></svg>';
				monkey.innerHTML = SVG.guest + '(Guest)';
			}
		}
		let list = ls("info") || {},
				userCookie = readCookieRaw("adsc_SESSION"),
				isUser = userCookie && userCookie.indexOf("username=") > 0,
				update = false;
		DB.info = {};
		DB.infoLoaded = false;
		DB.infoChecked = ls("infoChecked") || {};
		// load colors right away.

		DB.getColors().done( function(data){
			for (var i = 0; i < data.length; i++)
			{
				var series = data[i];
				assignColor(series.id, series.color, false );
			}
			updateSelectedOnly();
		}).fail(function(){
			alert("Not allowed? No internet? It's hard to tell, but what's important is that the colors were not loaded.");
		}).always(function()
		{
			//to avoid hit a ceiling of max data allowed store in local storage, we only save names of user's current shows, nothing else.
			let added = false;
			for(let id in DB.savedColors)
			{
				DB.loaded = true;
				let col = new Colors().setColor(DB.savedColors[id] || "FFFFFF");

				//there is a bug in original ADT that store show's color as "FFFFFF" (which is "delete" show color)
				if (col.HEX == "FFFFFF" || col.HEX.match(/[^0-9a-fA-F]/))
				{
log("Removed show with id " + id + " due to invalid color: " + DB.savedColors[id]);
					assignColor(id, DB.savedColors[id], true);
				}
				if (id in list)
				{
					DB.info[id] = list[id];
					continue;
				}
				DB.infoAdd(id);
				added = true;
			}

			for(let i = 0; i < _hidden.length; i++)
			{
				let id = _hidden[i];
				if (id in list)
				{
					DB.info[id] = list[id];
					continue;
				}
				added = true;
				DB.infoAdd(id);
			}

			DB.infoLoaded = true;
			if (added)
				DB.infoSave();

			sortMyShows();
		});//DB.getColors

		if (DB.loggedInUsername)
		{
			let span = accountOverview.find("span.nu")[0];
			if (span)
			{
				span.title = "Colors saved remotely on server";
//cloud svg
				span.innerHTML = SVG.user + span.innerHTML;
			}
		}
//fix paste via right click: adding input event
/*
		$( "#searchBecauseNoOneChecks" ).on( "input", function(e)
		{
		}).trigger("change");
*/
		let searchBecauseNoOneChecks = $( "#searchBecauseNoOneChecks" );
		if (searchBecauseNoOneChecks.length)
		{
			let lastQ = "",
					searchTimer = null,
					events = ["change", "search", "keyup", "input"],
					origFunc = jQuery._data(searchBecauseNoOneChecks[0]).events.change[0].handler,
					string = origFunc.toString(),
					line = "$('html, body').animate({ scrollTop: 0 }, 500);",
					index = string.indexOf(line),
					newFuncString,
					//will fallback to this original function, if modification failed
					newFunc = function(e)
					{
						var me = this;
						var q = this.value;
						if( q == lastQ ){}
						else if( q.length > 2 ){
							$(me).addClass("x");
							$(" #searchStatus").css("visibility","visible");
							if( searchTimer ) window.clearTimeout(searchTimer);
							searchTimer = window.setTimeout(function(){
								var q = me.value;

								if (isCustomSearch(e,q))
									return;
								$("#searchResults").load("/s?"+$.param({q:q}), function(){
									customShows.search("", q);
									lastQ = q;
									$(" #searchStatus").css("visibility","hidden");
									$(me).change();
									if(q.substr(0,5)!="info:") loadArchiveFromPathname(undefined, ".entry.searchResult:eq(0)");
									else
									{
										markSearchResults();
									}
									$(".calendar").addClass("searching");
								});
							},300);
							$("#searchResults").show();
							$( "#searchbar" ).addClass( "active" );

						}
						else{
							lastQ = "";
							$( "#searchbar").removeClass("active");
							$( "#searchResults").hide().html("");
							$( " #searchStatus").css("visibility","hidden");
							$( ".calendar").removeClass("searching");
							$( ".entry").removeClass("searchResult");
							if (Settings.pref("searchScroll"))
							{
								$('html, body').animate({ scrollTop: 0 }, 500);
							}
						}
					},
					isCustomSearch = function(e, val)
					{
						let q = val.trim(),
								r = false,
								id = q.match(/^info:([0-9]+)$/);

						id = id ? id[1] : 0;
						if (id > customShows.id || q == "info:myshows" || q.match(/^info:([a-zA-Z]+|$)/))
						{
							lastQ = q;
							e.preventDefault();
							e.stopPropagation();
							if (q == "info:hidden")
							{
								showMyHidden(e);
								lastQ = null;
							}
							else if (q == "info:myshows")
							{
								showMyShows(e);
								lastQ = null;
							}
							else if (id > customShows.id)
							{
								showMyShows.box = null;
								showMyHidden.box = null;
								customShows.search(id);
							}
							else
							{
								showMyShows.box = showMyHidden.box = document.createElement("div");
								$("#searchResults").html('<ul id="resultsBecauseNoOneChecks"><li>No results :(</li></ul><small>Search took 0.000 seconds</small>');
							}
							r = true;
							$(".calendar").addClass("searching");
						}
						else
						{
							showMyShows.box = null;
							showMyHidden.box = null;
						}
	//fix paste via right click
	/*
						if (e.type == "input")
						{
							if (!Settings.pref("searchScroll"))
							{
								//an ugly hack without recreating entire search handling function.
								let i = new Date(+new Date()+3000);
								(function loop()
								{
									if (new Date() > i)
										return;

									$('html, body').stop(true);
									setTimeout(loop);
								})();
							}
							$(this).trigger("change");
						}
	*/
						if (r)
						{
							$("#searchResults").show();
							$( "#searchbar" ).addClass( "active" );
							$(" #searchStatus").css("visibility","hidden");
						}
						return r;
					};//isCustomSearch()

			if (index != -1)
			{
				newFuncString = string.substr(0, index) + 'if (Settings.pref("searchScroll")){' + string.substr(index, line.length) + '}' + string.substr(index + line.length);
				string = newFuncString;
			}
			line = '$("#searchResults").load';
			index = string.indexOf(line);
			if (index != -1)
			{
				newFuncString = string.substr(0, index) + 'if (isCustomSearch(e,q)) return;\n' + string.substr(index);
				string = newFuncString;
			}
			line = "lastQ = q;";
			index = string.indexOf(line);
			if (index != -1)
			{
				newFuncString = string.substr(0, index) + 'customShows.search("", q);\n' + string.substr(index);
				string = newFuncString;
			}
			if (newFuncString)
			{
				eval("newFunc = " + newFuncString.replace(/^function\s?\(\)\{/, "function(e){"));
			}
	//			for (let i = 0; i < events.length; i++)
	//				jQuery._data($( "#searchBecauseNoOneChecks" )[0]).events[events[i]][0].handler = newFunc;
			searchBecauseNoOneChecks.off("keyup change search input");
			$( "#searchBecauseNoOneChecks" ).on("keyup change search input", newFunc);
		}//if (searchBecauseNoOneChecks.length)
//log(jQuery._data($( "#searchBecauseNoOneChecks" )[0]).events.input[0].handler.toString());

		let Backup = function Backup(id, val)
		{
			clearTimeout(this.timer[id]);
			if (typeof(this[id]) == "function")
				return this[id](val);
			else
				return this[id];

		}.bind(
		{
			data: {},
			last: [],
			timer: {},
			undoObj: {},
			clone: function(obj)
			{
				return Object.assign(Array.isArray(obj) ? [] : {}, obj);
			},
			colors: function(restore)
			{
				if (restore)
				{
					if (!this.data.colors)
						return;

					$.each(this.data.colors, function(i, c)
					{
						assignColor( i, c, true );
					});
					this.undoHide("colors");
				}
				else
				{
					if (!this.data.colors)
						this.data.colors = this.clone(DB.savedColors);

					this.undoShow("colors");
				}
			},
			hidden: function(restore)
			{
				if (restore)
				{
					if (!this.data.hidden)
						return;

					let data = this.data.hidden;
					for(let i = 0; i < data.length; i++)
						showHide(data[i], 1);

					this.undoHide("hidden");
				}
				else
				{
					if (!this.data.hidden)
						this.data.hidden = this.clone(_hidden);

					this.undoShow("hidden");
				}
			},
			watched: function(restore)
			{
				if (restore)
				{
					if (!this.data.watched)
						return;

					let data = this.data.watched;
					for(let id in data)
					{
						for(let i = 0; i < data[id].length; i++)
						{
							let ep = data[id][i];
							watched.add(id, ep);
							$('div.entry[data-series-id="' + id + '"]').each(function(n, entry)
							{
								if (episodeTools.short(entry) == ep)
									watched.update(entry, true);
							});
						}
					}
					watched.save(true);
					this.undoHide("watched");
				}
				else
				{
					if (!this.data.watched)
						this.data.watched = this.clone(watched._list);

					this.undoShow("watched");

				}
			},
			undoHide: function(id)
			{
				let obj = this.undoObj[id];
				obj.fadeOut(100);
				setTimeout(function()
				{
					obj.removeAttr("id");
				});
				delete this.data[id];
				let i = this.last.indexOf(id);
				if (i != -1)
					this.last.splice(i, 1);
			},
			undoShow: function(id)
			{
				let that = self;
				if (!this.undoObj[id])
				{
					this.undoObj[id] = $('<div class="undoBar popup"><div><span class="msg"></span> <a class="undoBar">Undo</a><span class="undo close">X</span><div></div>').appendTo("#content");
					this.undoObj[id].find("a").on("click", function()
					{
						let id = that.last.pop();
						if (typeof(that[id]) == "function")
							that[id](true);
					})
						.on("mousedown", function(e)
						{
							if (e.target === this)
							{
								e.stopPropagation();
								e.preventDefault();
							}
						});
					this.undoObj[id].find(".close").on("click", function()
					{
						that.undoHide(id);
					});
				}
				let i = this.last.indexOf(id);
				if (i != -1)
					this.last.splice(i, 1);

				let text = id.charAt(0).toUpperCase() + id.slice(1) + " list successfully cleared.";
				this.last.push(id);
				this.undoObj[id].find(".msg").text(text);
				this.undoObj[id].fadeIn(200);
				this.undoObj[id].attr("id", "account-popup");

				this.timer[id] = setTimeout(function()
				{
//					that.undoHide(id);
				}, 10000);
			},
			get hasBackup ()
			{
				for(let i in this.data)
					return true;

				return false;
			}
		});//backup
//log(jQuery._data($( "#searchBecauseNoOneChecks" )[0]));


		//fix clear colors for members
		$(document.body).off( "click", ".clearColors");
		$(document.body).on( "click", ".clearColors", function(e)
		{
			e.stopPropagation();
			e.preventDefault();
			if (!DB.viewing)
			{
				Backup("colors");
				$.each( DB.savedColors, function( i, c )
				{
					assignColor( i, null, true );
				} );
			}
			else
				alert( "You don't have permission!" );

			return false;
		});

		$(document.body).on( "click", ".clearHidden", function()
		{
			Backup("hidden");
			let array = [];
			for(let i = 0; i < _hidden.length; i++)
				array.push(_hidden[i]);

			for(let i = 0; i < array.length; i++)
				showHide(array[i], 0);

			return false;
		});
		$(document.body).on( "click", ".clearWatched", function()
		{
			Backup("watched");
			watched._list = {};
			watched.save();
			$("div.entry").each(function(i, entry)
			{
				if (entry._input)
					watched.update(entry, false);
			});

			return false;
		});

		if (DB.viewing)
		{
			$("body").toggleClass("userViewer", true);
			hideNode("clearColors");
			hideNode("importColors");
			hideNode("clearHidden");
			hideNode("clearWatched");
		}

		Settings.colors.init();
	});//document.ready()

//ESC(27) = close popups
	function hidePopups()
	{
		let $body = $("body");
		if ($body.hasClass("prompt"))
		{
			_prompt.hide();
		}
		if (document.body.classList.contains("colorpicker"))
		{
			return;
		}
		else if (document.body.classList.contains("colorbox"))
		{
			 $("li.opened").find("div.entry.color").click();
		}
		else if ($body.hasClass("popup"))
		{
			customLinks.hide();
			customShows.hide();
			Settings.hide();
			changesLog.hide();
			$("#account-popup").toggle(false);
		}
	}
	$(document.body).on("keydown", function(e)
	{
		if (e.key == "Esc" || e.which == 27)
			hidePopups();

	});
//close popups when clicked outside
	$(document.body).on( "click touchstart", function(e)
	{
		if (e.isTrigger || e.target.isTrigger)
			return;
		if (!$("body").hasClass("popup") || $("body").hasClass("prompt") || (e.target.className.indexOf && e.target.className.indexOf("undoBar") != -1))
			return;

		let target = $(e.target),
				close = target.hasClass("close") || target.parents(".close").get().length,
				p = target.parents(".cp-color-picker").get().length,
				hide = [];

		if (p)
			return;

		if (document.body.classList.contains("colorpicker") || document.body.classList.contains("colorpickerclose"))
		{
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}
		if (document.body.classList.contains("colorbox") && !target.parents("li.opened").get().length)
		{
			e.stopPropagation();
			e.preventDefault();
			return $("li.opened").find("div.entry.color").click();
		}

		p = target.parents("#account-popup").get().length;
		if (e.target.id != "account-overview" && (p == 0 || (p && close)))
		{
			hide[hide.length] = function()
			{
				$("#account-popup").toggle(false);
			};
		}
		else if (p)
			return;

		p = target.parents("#settings-popup").get().length;
		if (e.target.id != "settings-open" && (p == 0 || (p && close)))
		{
			hide[hide.length] = Settings.hide;
			if (window.hashChanged.hashSearch && ["#settings", "#options"].indexOf(location.hash) != -1)
				removeHash();
		}
		else if (p)
			return;

		p = target.parents("#manage-links-popup").get().length;
		if (e.target.id != "manage-links-open" && (p == 0 || (p && close)))
		{
			hide[hide.length] = customLinks.hide;
			if (window.hashChanged.hashSearch && location.hash == "#linksmanager")
				removeHash();
		}
		else if (p)
			return;

		p = target.parents("#manage-cushows-popup").get().length;
		if (e.target.id != "manage-cushows-open" && (p == 0 || (p && close)))
		{
			hide[hide.length] = customShows.hide;
			if (window.hashChanged.hashSearch && location.hash == "#customshows")
				removeHash();
		}
		else if (p)
			return;


		p = target.parents("#changesLog").get().length;
		if (e.target.id != "changesLog-open" && (p == 0 || (p && close)))
		{
			hide[hide.length] = changesLog.hide;
			if (window.hashChanged.hashSearch && location.hash == "#changes")
				removeHash();
		}
		else if (p)
			return;


		for(let i = 0; i < hide.length; i++)
			hide[i]();

	});
	//reset password auto fill username
	if (location.pathname == "/_u/forgot-password")
		$("#username").val(DB.loggedInUsername);

	function versionsCompare(a, b)
	{
		function prep(t)
		{
			return ("" + t)
				//treat non-numerical characters as lower version
				//replacing them with a negative number based on charcode of first character
				//and remove non alpha-numerical characters
				.replace(/[^0-9\.]+/g, function(c){return "." + ((c = c.replace(/[\W_]+/, "")) ? c.toLowerCase().charCodeAt(0) - 65536 : "") + ".";})
				//remove trailing ".", "0" and ".0"
				.replace(/^\.|0*\.$|(?:\.0+)+$/g, "")
				//replace double .
				.replace(/\.+/g, ".")
				//remove trailing "0" if followed by non-numerical characters (1.0.0b);
				.replace(/(?:\.0+)*(\.-[0-9]+)(\.[0-9]+)?$/g, function(a,b,c){return b + (c ?  c : "");})
				.split('.');
		}
		a = prep(a);
		b = prep(b);
		for (var i = 0, c = Math.max(a.length, b.length); i < c; i++)
		{
			//convert to integer the most efficient way
			a[i] = ~~a[i];
			b[i] = ~~b[i];
			if (a[i] > b[i])
				return 1;
			else if (a[i] < b[i])
				return -1;
		}
		return 0;
	}
/* changes log */
	let changesLog = {
		div: null,
		list: [],
		show: function changesLog_show(noBack)
		{
			this.getData();
			if (noBack)
				this.div.setAttribute("noback", "");
			else
				this.div.removeAttribute("noback");
			hidePopups();
			$("body").toggleClass("changesLog", true);
			setPopup(true);
		},

		hide: function changesLog_hide()
		{
			$("body").toggleClass("changesLog", false);
			setPopup(false);
		},

		getData: function changesLog_getData ()
		{
			if (this.div)
				return;

			let list = {},
					lines = changesLogText.replace(/\r\n/, "\n").split("\n"),
					ver = "",
					verFirst = "",
					stopVer = "v" + Settings.pref("version");

			for (let i = 0; i < lines.length; i++)
			{
				let line = lines[i],
						_ver = line.match(/^([0-9]+[^ ]*)( |$)/);
				if (_ver)
				{
					ver = 'v' + _ver[1];
	//				if (ver == stopVer)
	//					break;
					let date = line.match(/ (.*)/);
					list[ver] = [];
					list[ver].s = {0:0,"+":0,"-":0,"*":0,"!":0,"?":0};
					list[ver].d = date ? date[1] : "";
					if (!verFirst)
						verFirst = ver;
				}
				else
				{
					let type = line.match(/^[ \t]*([-+*!\?])/);
					type = type ? type[1] : "";
					line = line.trim();
					if (line === "")
						continue;

					if (type)
						line = line.substr(1).trim();

					if (!(ver in list))
					{
						list[ver] = [];
						list[ver].s = {0:0};
						list[ver].d = "";
					}

					list[ver].s[type]++;
					list[ver][list[ver].length] = [type, line];
				}
			}
			this.list = list;
			let legend = {
				"+": "added",
				"!": "fixed",
				"*": "changed",
				"-": "removed",
				"?": "notfixed",
				"": "comment"
			},
			html = $(multiline(function(){/*
	<div id="changesLog" class="popup">
		<div id="changesLogBox">
			<div id="changesLogHead" class="header">
				<div class="back" title="Back">
					{SVG-BACK}
				</div>
				<h4>Airdates.tv enhancer v# Changes Log</h4>
				<div class="close" title="Close">
					{SVG-CLOSEHOVER}
					{SVG-CLOSE}
				</div>
			</div>
			<div id="changesLogLegend">
				<span class="cl_added cl_filter"><span>+</span><span>Added</span></span>
				<span class="cl_fixed cl_filter"><span>!</span><span>Fixed</span></span>
				<span class="cl_changed cl_filter"><span>*</span><span>Changed</span></span>
				<span class="cl_removed cl_filter"><span>-</span><span>Removed</span></span>
				<span class="cl_notfixed cl_filter"><span>?</span><span>Not fixed</span></span>
				<span id="noChangesLog"></span>
			</div>
			<div class="changesLogContentBox">
				<div id="changesLogContent" class="content"></div>
			</div>
		</div>
	</div>
			*/}));
function  checkInView(elem,partial)
{
		var container = $(".scrollable");
		var contHeight = container.height();
		var contTop = container.scrollTop();
		var contBottom = contTop + contHeight ;

		var elemTop = $(elem).offset().top - container.offset().top;
		var elemBottom = elemTop + $(elem).height();

		var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
		var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

		return  isTotal  || isPart ;
}
			html.find("span.cl_filter").mousedown(function(e)
			{
				e.preventDefault();
				e.stopPropagation();
			}).click(function(e)
			{
				let div = document.getElementById("changesLogContent"),
						scroll = null,
						divTop = div.parentNode.offsetTop + div.parentNode.scrollTop;

				for (let i = 0; i < div.children.length; i++)
				{
					let el = div.children[i];
					if (el.offsetTop + el.offsetHeight - 4 >= divTop)
					{
						scroll = el;
						break;
					}
				}
				let c = "cl_" + legend[this.firstChild.innerText] || "comment";
				this.parentNode.parentNode.parentNode.classList.toggle(c, !this.parentNode.parentNode.parentNode.classList.contains(c));
				div.parentNode.scrollTop = scroll.offsetTop - div.parentNode.offsetTop - 4;

				setTimeout(function()
				{
					div.parentNode.scrollTop = scroll.offsetTop - div.parentNode.offsetTop - 4;
				}, 0);
			});
			this.div = html.appendTo("#content")[0];
			let head = $("#changesLogHead"),
					cont = $("#changesLogContent"),
					opt = createCheckbox("noChangesLog", "Don't show this again", Settings.prefs.noChangesLog ? true : false, Settings.callback);

			document.getElementById("noChangesLog").appendChild(opt);
			head.html(head.html().replace("#", adeVersion));
			if (prevVersion)
			{
				let h = head.find("h4");
				h.text(h.text() + " (updated from v" + prevVersion + ")");
			}
			for(let v in list)
			{
				let verType = prevVersion ? versionsCompare(v.substr(1), prevVersion) : 0,
						updated = prevVersion && verType < 1 ? " prev" : "",
						ver = $('<div class="cl_ver_' + v.replace(/\./g, "_") + updated + '"></div>').appendTo(cont);

				$('<div class="cl_ver_head">' + v + (list[v].d ? " " + list[v].d : "") + '</div>').appendTo(ver);
				for(let i = 0; i < list[v].length; i++)
				{
					let line = list[v][i];
					$('<span/>').appendTo($('<div class="cl_' + legend[line[0]] + '">' + (line[0] ? "\t" : "") + '<span>' + line[0] + '</span></div>').appendTo(ver))[0].innerHTML += line[1];
				}
			}
			let as = cont.find("a").each(function(i, o)
			{
				if (o.href.indexOf(location.origin) != -1)
				{
					$(this).click(function(e)
					{
						this.hide();
						hashChanged(null, o.hash);
					});
				}
			});
	//		Settings.pref("version", verFirst);
		}//getData()
	};//changesLog
/* changes log end */

	$("body").on("click", ".back", function()
	{
		customLinks.hide();
		customShows.hide();
		Settings.hide();
		changesLog.hide();
		setPopup(true);
		setTimeout(function()
		{
			$("#account-overview").click();
		});
	});

	function setPopup(opened)
	{
		let that = self;
		if (opened)
			that.opened = true;

		let func = function()
		{
			$("body").toggleClass("popup", opened || that.opened ? true : false);
			that.opened = false;
		};
		clearTimeout(that.timer);
		that.timer = setTimeout(func);
	}
	setTimeout(function()
	{
		if (!_loadArchiveFromPathname.firstRun)
			_loadArchiveFromPathname();
	});

	let _prompt = (function()
	{
		let html = $(multiline(function(){/*
<div class="promptbox">
	<div class="prompt-content">
		<form class="prompt-form">
			<div class="msg"></div>
			<span msg="Copied to clipboard!">
				<input class="input"></input>
			</span>
			<div class="control">
				<input type="button" value="OK" class="ok">
				<input type="button" value="Cancel" class="cancel">
				<input type="button" value="Copy" class="copy">
				<input type="button" value="File" class="file">
			</div>
		</form>
	</div>
</div>
				*/})).appendTo("#content"),
				msg = html.find(".msg"),
				input = html.find(".input"),
				ok = html.find(".ok"),
				copy = html.find(".copy"),
				cancel = html.find(".cancel"),
				form = html.find("form"),
				file = html.find(".file"),
				that = self,
				padding = 0,
				rightOld = $("body")[0].style.right,
				rgb2hsl = function(c)
				{
					let r = c[0]/255, g = c[1]/255, b = c[2]/255,
							a=Math.max(r,g,b), n=a-Math.min(r,g,b), f=(1-Math.abs(a+a-n-1)),
							h= n && ((a==r) ? (g-b)/n : ((a==g) ? 2+(b-r)/n : 4+(r-g)/n));
					return [60*(h<0?h+6:h), f ? n/f : 0, (a+a-n)/2];// h:[0,360], s:[0,1], l:[0,1]
				},
				hsl2rgb = function(c)
				{
					let h = c[0], s = c[1], l = c[2],
							a=s*Math.min(l,1-l),
							f= function(n)
							{
								let k=(n+h/30)%12;
								return l - a*Math.max(Math.min(k-3,9-k,1),-1);
							};

					return [Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)];
				},
				rgbLum = function(c, lum)
				{
					let hsl = rgb2hsl(c);
					hsl[2] += lum / 240;
					return hsl2rgb(hsl);
				},
				rgb = cancel.css('background-color').match(/([0-9]+)/g),
				hover = "rgb" + (rgb.length > 3 ? "a" : "") + "(" + rgbLum(rgb, -10).join(",") + (rgb.length > 3 ? "," + rgb[3] : "") + ");",
				active = "rgb" + (rgb.length > 3 ? "a" : "") + "(" + rgbLum(rgb, -30).join(",") + (rgb.length > 3 ? "," + rgb[3] : "") + ");",
				mainCSS = document.getElementById("mainCSS");

		mainCSS.innerHTML = mainCSS.innerHTML.replace(/initial;\/\*active\*\//, active).replace(/initial;\/\*hover\*\//, hover);
		that.callback = function(){};
//prevent from focus, act like chrome window
		form.on("mousedown", function(e)
		{
			if (e.target === this)
			{
				e.stopPropagation();
				e.preventDefault();
			}
		});
		function close(e)
		{
			if (e)
			{
				e.stopPropagation();
			}
			let body = $("body");
			body.toggleClass("scrollbar", false);
			body.toggleClass("prompt", false);
			body[0].style.right = rightOld;

			setTimeout(function()
			{
				html.removeAttr("id");
			});
		}
	/*
		form.on("click", function(e)
		{
			e.preventDefault();
			input.trigger( "focus" );
			let inp = input[0];
			if (inp.selectionStart == inp.selectionEnd)
				inp.select();
		});
	*/
		ok.on("click", function(e)
		{
			that.callback(input.val());
			close(e);
		});
		copy.on("click", function(evt)
		{
			let inp = input[0],
					s = inp.selectionStart,
					e = inp.selectionEnd;
			inp.focus();
			inp.select();

			let ok = false;
			try
			{
				ok = document.execCommand("copy");
			}
			catch(er) {}
	//		inp.selectionStart = s;
	//		inp.selectionEnd = e;
			let msg = ok ? "Copied to clipboard!" : "Error copying to clipboard!",
					span = input.parent()[0];
			span.setAttribute("msg", msg);
			span.setAttribute("msg-show", "");
			clearTimeout(this.timer);
			this.timer = setTimeout(function()
			{
				span.removeAttribute("msg-show");
			}, 2000);
		});

		cancel.on("click", close);

	/*
		html.find(".fade").on("click", close);
		html.find(".prompt-content").on("click", function(e)
		{
			if (e.currentTarget == e.target)
				close();
		});
	*/
		input.on("keydown", function(e)
		{
			if (e.keyCode == 13)
			{
				e.preventDefault();
				ok.click();
			}
		});
		input.on("input", function()
		{
			let s = this.selectionStart,
					e = this.selectionEnd,
					rs = 0,
					re = 0,
					r = "";
			for(let i = 0; i < this.value.length; i++)
			{
				if (this.value.charAt(i) != "\n" && this.value.charAt(i) != "\r")
				{
					r += this.value[i];
				}
				else
				{
					if (i < s)
						rs++;

					if (i < e)
						re++;
				}
			}
			if (r != this.value)
			{
				this.value = r;
				this.selectionStart = s-rs;
				this.selectionEnd = e-re;
			}
		});

		file.on("click", function()
		{
			if (input.attr("readonly"))
			{
				fileSave(that.file, input.val(), that.ext);
			}
			else
			{
				fileLoad(function(text)
				{
					input.val(text);
				}, that.ext);
			}
		});
		function _prompt(opt)
		{

			if (!opt.file)
				opt.file = "Airdates.tv_enhancer_v" + adeVersion + "_settings_" + dateTimestamp() + ".json";

			if (!opt.ext)
				opt.ext = ".json";

			that.ext = opt.ext;
			that.file = opt.file;
			that.callback = opt.callback;
			//faking this id so account popup in the background wouldn't close when clicked on our prompt
			html.attr("id", "account-popup");
			msg.text(opt.text);
			input.val(opt.value);
			if (typeof(opt.value) != "undefined")
			{
				input.attr("readonly", true);
				input.select();
				copy.show();
				file.val("Save as");
				cancel.hide();
			}
			else
			{
				input.removeAttr("readonly");
				copy.hide();
				file.val("Load file");
				cancel.show();
			}
			let body = document.body,
					w = body.scrollWidth;

			$(body).toggleClass("prompt", true);
/*
			let w2 = document.body.scrollWidth;
			if (w2 != w)
			{
				padding = w2 - w;
				$(body).css("right", padding + "px");
			}
			$(body).toggleClass("scrollbar", w2 != w)
*/
		}
		_prompt.hide = close;
		return _prompt;
	})();//_prompt


	function todayChange()
	{
		if (!Settings.prefs.todayChange)
			return;


		today = new Date();
		let t = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

		if (todayChange.day == t)
			return;

		todayChange.day = t;
		ymToday = (today.getYear()+1900)*12 + today.getMonth();
		let todayOld = $("#today"),
				dataDate = today.getFullYear() + pad( today.getMonth() + 1 ) + pad( today.getDate() );

		_today = todayOld.parent().find('.day[data-date="' + dataDate + '"]').find('div.day[data-date="' + dataDate + '"]');
		if (dataDate != todayOld.attr("data-date"))
		{
			todayOld.removeClass("today").removeAttr("id").removeAttr("today");
			_today.addClass("today").attr("id", "today").attr("today", true);
		}
		let div = $("<div/>");
		div.load("/_archive/" + ~~(ymToday/12) + "-" + ~~((ymToday%12)+1), function()
		{
			let days = $("div.days");
			_today = days.find('div.day[data-date="' + dataDate + '"]');
			div.find("div.day").each(function(i)
			{
				let day = days.find('div.day[data-date="' + this.getAttribute("data-date") + '"]');
				if (day.length)
				{
					let title = "",
							details = null;

					if (day.attr("opened") !== undefined)
					{
						let entry = day.find("div.entry[opened]");
						title = entry.find(".title > span").text();
						details = entry.find(".details");
					}
					day.html(this.innerHTML);
					if (details)
						day.find('div.entry > .title:contains("' + title + '")').parent().attr("opened", "").append(details);

//					day.find("div.entry").each(watched.attach);
				}
				else
				{
					days.append(this);
				}
			});
			todayOld.removeClass("today").removeAttr("id").removeAttr("today");
			_today.addClass("today").attr("id", "today").attr("today", true);
			showPast(function()
			{
				customShows();
				epDateFix();
				sortMyShows();
				$("div.day").each(function(i)
				{
	//adding watched checkboxes
					$(this).find("div.entry").each(watched.attach);
					collapseMulti(i, this, true);
				});
			});
		});
	}//todayChange()
	let today = new Date();
	todayChange.day = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
	todayChange.timer = setInterval(todayChange, 5000);

	window.hashChanged = function hashChanged(e, hash)
	{
		let match,
				remove = false,
				hashSearch = false;
		hash = typeof(hash) == "undefined" ? location.hash : hash;

		if (hash == "#myshows")
		{
			search("info:myshows");
			hashSearch = true;
		}
		else if (hash == "#hidden")
		{
			search("info:hidden");
			hashSearch = true;
		}
		else if ((match = hash.match(/^#([sfq]|search|find):(.*)/)))
		{
			search(match[2]);
	//		remove = true;
			hashSearch = true;
		}
		else if ((match = hash.match(/^#(info:.+)/)))
		{
			search(match[1]);
	//		remove = true;
			hashSearch = true;
		}
		else if (hash == "#changes")
		{
			hashSearch = true;
			changesLog.show(true);
		}
		else if (hash == "#settings" || hash == "#options")
		{
			hashSearch = true;
			Settings.show(true);
		}
		else if (hash == "#backupsettings")
		{
			remove = true;
//			Settings.show(true);
			Settings.backup();
		}
		else if (hash == "#linksmanager")
		{
			hashSearch = true;
			customLinks.manager(function()
			{
				customLinks.show(true);
			});
		}
		else if (hash == "#customshows")
		{
			hashSearch = true;
			customShows.manager(function()
			{
				customShows.show();
			});
		}
		if (remove && hash == location.hash)
		{
			removeHash();
			hashSearch = false;
		}
		hashChanged.hashSearch = hashSearch;
	};
	$(window).on("hashchange", hashChanged);
	setTimeout(function()
	{
		$(window).trigger("hashchange");
	});

	let sr = $("#searchResults").siblings();
//	sr.filter("br:not(:last-of-type)").remove();
	sr.filter("br").next("br").remove(); //#searchbar remove <br>
	sr.filter("a").filter(function(i, o)
	{
		if (o.href.match(/^http:/) && !o.hash)
		{
			o.setAttribute("target", "_blank");
			o.hash = "#backupsettings";
		}
	});
	let div = document.createElement("div");
	div.id = "go2top";
	div.setAttribute("title", "Go to top");
	div.innerHTML = "<i/>";
	elContent.appendChild(div);
	window.addEventListener("scroll", function(e)
	{
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			div.style.display = "block";
		} else {
			div.style.display = "none";
		}
	}, false);
	let scrollTop = function(y)
	{
		$("html, body").animate({scrollTop: y }, 100);
//		document.body.scrollTop = 0; // For Safari
//		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	};
	div.addEventListener("click", function(e)
	{
		e.preventDefault();
		e.stopPropagation();
		scrollTop(0);
	}, false);

	let a = $("#tv-text").clone();
	a.attr("id", "tv-text2").find("a").each(function(i, obj)
	{
		obj.addEventListener("click", function(e)
		{
			scrollTop(document.getElementById("mainTitle").offsetTop);
		}, false);
		obj.id += "2";
	});
	$("div.calendar").after($("<div></div>").addClass("archiveBottom").append(a));
};//mainFunc()

//disqus
var trollList;
receiveMessage.f.trollListCallback = function receiveMessage_f_trollListCallback(v)
{
	trollList = v;
};
//if (isFrame && window.location.href.indexOf("disqus.com") != -1)
if (isFrame && window.self.location.href.match(/https?:\/\/(?:www\.)?disqus\.com/))
{
	mainFunc = function(){};

//disqus troll filter
	let trollHide = true,
			trollTimer,
			comments = {},
			trollSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsSAAALEgHS3X78AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M1cbXjNgAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMi8yOC8xMZSAjI8AAAA/UExURf///wAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCw0NDQ8PDxAQEBISEhMTExYWFvr6+v////L9RbYAAAABdFJOUwBA5thmAAAAZklEQVQYGY3BWw6CMABFwXtQKLZafJz9r1WaaPgycSb5wwys8KT1DFcPZIeHlgQBZ5jcbUnTByq4oDXpopMDd88JWlCZEEtSKUsHRCUJr1W8iVqTIBeWAirZ4Rdk6A6cWPMBHfLbGzqjB8v8i7F/AAAAAElFTkSuQmCC";

	trollList = ls("trolls", undefined, "trollListCallback");

	let isTroll = function (name)
	{
		return trollList.indexOf(name);
	};

	let trollSave = function ()
	{
		clearTimeout(trollTimer);
		trollTimer = setTimeout(function()
		{
			ls("trolls", trollList);
		}, 1000);
	};

	let trollAdd = function (name)
	{
		if (isTroll(name) == -1)
			trollList.push(name);

		trollSave();
	};

	let trollRemove = function (name)
	{
		let n = isTroll(name);
		if (n != -1)
			trollList.splice(n, 1);

		trollSave();
	};

	let isMatch = function (needle, array)
	{
		let r = -1;
		for(let i = 0; i < array.length; i++)
		{
			r = needle.indexOf(array[i]);
			if (r != -1)
				break;
		}
		return r;
	};
	let findParent = function (obj, c)
	{
		if (typeof(c) != "object")
			c = [c];

		if (obj && obj.className && isMatch(obj.className, c) != -1)
			return obj;

		if (obj)
			return findParent(obj.parentNode, c);

		return null;
	};
	let censor = function (a, b, c, d, e)
	{
		let p = "blah",
				r = "",
				caps = true,
				t,
				i,
				isStr = isNaN(a.replace(/['`].*/, ''));

		if ((a.length - p.length) > 0)
			p = "bla" + "a".repeat(a.length - p.length) + "h";

		if ((a.length < 2 && isStr) || (a.length < 7 && a.match(/['`]/) && isStr) || a.match(/^\$?[0-9]+k?/i))
			return a;

		for(i = 0; i < a.length; i++)
		{
			if (a[i] == a[i].toLowerCase())
			{
				caps = false;
				break;
			}
		}
		for(i = 0; i < p.length; i++)
		{
			t = p[i];

			if (a.length < i + 1)
				continue;

			if (caps || (a.length > i && a[i] != a[i].toLowerCase()))
				t = t.toUpperCase();

			r += t;
		}
		return r;
	};

	let toggleTroll = function (comment, f, save)
	{
		//f = 0: orig
		//f = 1: troll
		//f = 2: toggle
		f = typeof(f) == "undefined" ? 2 : f;
		save = save === undefined ? true : save;
		let parent = comment._parent,
				t = true;
		if (f == 1 || (f == 2 && parent.getAttribute("troll") != "true"))
		{
console.log(trollHide, "wtf");
			if (trollHide)
			{
				if (!("innerHTMLOrig" in comment))
					comment.innerHTMLOrig = comment.innerHTML;

				comment.innerHTML = '<img src="' + trollSrc + '" class="trollComment">';
			}
			else
				censorText(comment);
		}
		else
		{
			if (trollHide)
				comment.innerHTML = comment.innerHTMLOrig;
			
			censorText(comment, true);
			t = false;
		}
		if (save)
			parent.setAttribute("troll", t);

		return t;
	};

	let censorText = function (obj, orig)
	{
		let c = obj.childNodes;
		for(let i = 0; i < c.length; i++)
		{
			if (c[i].nodeName == "#text")
			{
				if (!("nodeValueOrig" in c[i]))
					c[i].nodeValueOrig = c[i].nodeValue;

				let t;
				if (orig)
					t = c[i].nodeValueOrig;
				else
				{
					if (!("nodeValueTroll" in c[i]))
						c[i].nodeValueTroll = c[i].nodeValue.replace(/(\w+(['`]\w+)?)/g, censor);

					t = c[i].nodeValueTroll;
				}

				c[i].nodeValue = t;
			}
			else if (c[i].childNodes.length && c[i].className != "see-more")
				censorText(c[i], orig);
		}
		return obj.innerHTML;
	};

	let reloadLoop = function reloadLoop()
	{
		let nav = document.getElementById("main-nav");
		if (!nav && reloadLoop.i--)
			return setTimeout(reloadLoop);

		if (!nav)
			return;

		setTimeout(function()
		{
			window.top.postMessage({id: "ade", func: "reloadDisqus", args: [nav.offsetTop], return: null}, "https://www.airdates.tv");
		}, 1000);

		if (reloadLoop.inited)
			return;

		$("<li/>")
			.attr("class", "nav-tab nav-tab--secondary reload")
			.attr("title", "Reload comments")
			.append('<a>' + SVG.reload + '</a>')
			.insertAfter( $("#thread-share-menu, #thread-share-bar"))
			.click(function()
			{
				window.top.postMessage({id: "ade", func: "reloadDisqus", args: [], return: null}, "https://www.airdates.tv");
//				window.self.location.reload(true);
			});
		reloadLoop.inited = true;
	};
	let initPosts = function initPosts(names, li)
	{
		if (li.classList.contains("init"))
			return;

		for(let i = 0; i < names.length; i++)
		{
			let body = findParent(names[i], "post-content");
			if (!body)
			{
				continue;
			}

			let parent = findParent(names[i], "post-byline"),
					img = document.createElement("span"),
					name = names[i].innerText,
					troll = (isTroll(name) != -1),
					post = body.getElementsByClassName("post-message")[0];

			post._parent = parent;
			if (post.__inited)
				continue;

			if (post.innerHTML == "<div></div>")
				continue;

			img.className = "troll";
				names[i].parentNode.insertBefore(img, names[i].nextSibling);
/*
			if (names[i].parentNode.querySelectorAll('span:not([class])').length)
				names[i].parentNode.insertBefore(img, names[i].nextSibling);
			else
				names[i].parentNode.appendChild(img);
*/

			parent.setAttribute("troll", troll);

			names[i].innerHTML = names[i].innerHTML.replace("Tubasing", "Tubashit");

			if (typeof(comments[name]) == "undefined")
				comments[name] = [];

/* replace disqus links with actual links */
			let as = post.getElementsByTagName("a");
			for(let i = 0; i < as.length; i++)
			{
				let a = as[i],
						url = decodeURIComponent(a.href).match(/\/\/disq\.us\/url\?url=(.+)/);

				if (url)
				{
					url = url[1].substring(0, url[1].indexOf(a.title) + a.title.length);
				}
				if (!url)
					url = a.href;

				if (url.match(/^#/))
					url = "https://airdates.tv/" + url;

				a.href = url;
				if (!url.match(/https:\/\/(www\.)?airdates\.tv(\/.*|#|$)/i))
				{
					a.target = "_blank";
				}
				else
				{
					a.addEventListener("click", function(e)
					{
						e.preventDefault();
						window.top.postMessage({id: "ade", func: "hashChanged", args: [0, a.hash], return:null}, "https://www.airdates.tv");
					}, false);
				}
			}

			comments[name].push({
				parent: parent,
				post: post
			});

			img.addEventListener("click", function(e)
			{
				e.stopPropagation();
				e.preventDefault();

				let troll = toggleTroll(post);
				if (troll)
					trollAdd(name);
				else
					trollRemove(name);

				for(let i = 0; i < comments[name].length; i++)
				{
					if (post === comments[name][i].post)
						continue;

					toggleTroll(comments[name][i].post);
				}
			}, true);
			post.__inited = true;
			li.classList.toggle("init", true);

			if (!body.__inited)
			{
				let eventHandler = function(e)
						{
							if (parent.getAttribute("troll") != "true")
								return;

							if (this.prev == e.type)
								return;

							let type = e.type == "mouseenter";
							this.prev = e.type;
							clearTimeout(this.timer);
							this.timer = setTimeout(function()
							{
								toggleTroll(post, !type, false);
//								censorText(post, type);
							}, type ? 200 : 1000);
						};
				body.addEventListener("mouseenter", eventHandler, false);
				body.addEventListener("mouseleave", eventHandler, false);
				body.__inited = true;
			}
			if (!troll)
				continue;

			toggleTroll(post, true);
//			censorText(post);
		}
		if (!initPosts._loaded)
		{
//			window.top.postMessage({id: "ade", func: "scrollTo", args: [document.getElementById("main-nav").offsetTop], return: null}, "https://www.airdates.tv");
			initPosts._loaded = true;
		}
	};//initPosts()

	window.addEventListener("load", function(e)
	{
		let dis = 1000,
				wasBusy = false;

		function escapeHtml(txt)
		{
				return txt
							.replace(/&/g, "&amp;")
							.replace(/</g, "&lt;")
							.replace(/>/g, "&gt;")
							.replace(/"/g, "&quot;")
							.replace(/'/g, "&#039;");
		}
		function findParent(node, opt)
		{
			if (!node)
				return false;

			for(let i in opt)
			{
				if (node.getAttribute(i) != opt[i])
					return findParent(node.parentNode, opt);
			}
			return node;
		}

		(function loop()
		{
			if (typeof(trollList) == "undefined")
			{
				if (dis--)
					setTimeout(loop);

				return;
			}

			if (typeof($) != "undefined" && $ !== blankFunc &&  $(".btn.load-more__button.busy").length)
			{
				wasBusy = true;
				return setTimeout(loop);
			}
			else
			{
				if (wasBusy)
				{
					wasBusy = false;
					return setTimeout(loop, 1000);
				}
				else
				{
				}
			}

			if (!trollList || typeof(trollList) != "object")
				trollList = ["Tubasing"];




			let list = document.querySelectorAll("ul#post-list li.post:not(.init)");
			if (list.length)
			{
				for (let l = 0; l < list.length; l++)
				{
					let li = list[l],
							names = li.getElementsByClassName("author");

					if (!names.length)
						continue;

					initPosts(names, li);
				}//for
			}
			let textarea = document.querySelectorAll("div.textarea,textarea.textarea"),
					valSrc = '<a href="https://greasyfork.org/scripts/28787-airdates-tv-enhancer" target="_blank">Airdates.tv enhancer</a> <a href="https://greasyfork.org/help/installing-user-scripts" target="_blank"><i>userscript</i></a>',
					valEscaped = escapeHtml(valSrc),
					val = valSrc;

			for(let i = 0; i < textarea.length; i++)
			{
				let key = "value";
				if (textarea[i].tagName == "DIV")
				{
					key = "innerHTML";
					val = valEscaped;
				}
				if (textarea[i][key].match(/\bADEU\b/))
					textarea[i][key]= textarea[i][key].replace(/\bADEU\b/, val);
			}

//disqus button


/*
function getCaretPosition() {
		var x = 0;
		var y = 0;
		var sel = window.getSelection();
		if(sel.rangeCount) {
				var range = sel.getRangeAt(0).cloneRange();
				if(range.getClientRects()) {
				range.collapse(true);
				var rect = range.getClientRects()[0];
				if(rect) {
						y = rect.top;
						x = rect.left;
				}
				}
		}
		return {
				x: x,
				y: y
		};
}


			let buttons = document.querySelectorAll('div[data-action="text-editor-buttons"]');
			for(let i = 0; i < buttons.length; i++)
			{
				let div = buttons[i];
				if (div._ades)
					continue;

				div._ades = true;
				let clone = div.childNodes[div.childNodes.length-1].cloneNode(true);
clone = document.createElement("div");
clone.className = "wysiwyg__item";
clone.innerHTML = '<div class="wysiwyg_blockquote" title="Airdates enhancer" role="img" aria-label="ADEU"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAADv0lEQVRYw+1Wv08jVxD+Zt7uWy92jOMjh6ULBUkHVbiU5A9If6LKSUdqUNLQsnIKlC7FgZQmoqFCgvQoQog0F0EXqNOQAsjZHBL22t43k8K7iw25S5OcpeRGGu3b3TfvzXzzE3hHIybKFlEU0dzc3Henp6flOI4BQI0xaozRTqfDzjl4nqciAlWlJEkAAKqKIAhgjFEAYGaoqhLlR7PneVQqlZiZsbS09GxQAe+OMp8BmEjfBYCmzOk3HdhLA7I68A931pyyeSMUURTx4uJisrOzo+041nYca6/3jTpH6hypOig5lzM7KDtWdqyLPyyqI5ezAOqI1BEpSJXhlOH0yZOfdX19/ep1CMA5B1UFp/AREZhvjdEciMxESeEgsPKQQaSaYyWpnO/be4bnUvV6XYwxYGa8TRq6LQ2w0SlQrVYRhuHoFEjTaXQKtFot9Hq9f+0yEfdmBay1o0Vg5EGYJAlE5L+LgHP3jXu7VefvEMhK8cgUYGYMtNF/nMQlr1cgiiLudDpYXVUEgUUQWJTfKyIMawjDGqgICN8yjQG1sIZaWMOPv1bBgpwL1QcoTE6iMDkJFUC1C9Uuvvr6Prp5N5ydnaWzs7MhFygI4+P999gA1BoQrPhQSXsiC3QAuPehQwNBt9t/Jsn9IMzFtre3w/39/Yubm5tis9mEiFAQBP1NRNA+IeuYxhhYazX9RwAQx3GWyuR5HlQ1iysNggDT09OYmpq6vry8fFCv190QAvPz89/u7u6WDg4OUCgU0Gw2USqVAACFQgHn5+dERDDG5LVCREhEEAQBrLVoNpuoVqsQEVhr0Wg0wMwolUqkqri6ukIQBOOVSqUI4DpH4OTkxK6urnaOjo4A3GZDt9uFqkJEUC6X+25RharC932ICJxzeQHzfR/WWlhr0Wq1QEQgIvi+D1VFkiRoNBpYXl52a2trHgDQ8fGxv7m5+dvFxcWjDLJMiawwZQd5ngdjDB4//gSe56NcLsMYg3a7jRcvfkGxWAQR5QiFYQjf9zN3YWxsDBMTEyiXy2DmYGFhoevNzMx82m63HxWLxSELkyTpj2fphJT5HwDirgMnirjzEsQMZsL0Rx/j+tVVNhUPp7MCKn3jer0ekiQBEXWiKDLe1tYW7e3t5RGZWZtxKp8e1I/uw8PDv8hyxcOuwv/8FX7/qZLLqQjCKUHhYQ9/fPAlkufPoalLv3j6tB8DKysrz+I4/rA/zlN2nzAzRCRH4U6jYmRTKcBEpESk2X4RGSpyaaZk3xJV/X5jY+Ml3tH/nv4E5KQFif7uYoAAAAAASUVORK5CYII="></div>';
				clone.removeAttribute("data-tag");
				clone.removeAttribute("data-action");
//				clone.setAttribute("data-action", "test");
//				clone.setAttribute("data-url", "blah");
				let parent = findParent(div, {class: "textarea-wrapper", "data-role": "textarea"}),
						textarea = null;
				if (parent)
					textarea = parent.querySelectorAll("div.textarea,textarea.textarea")[0] || null;

				clone.addEventListener("click", function(e)
				{
					e.stopPropagation();
					e.preventDefault();
					e.stopImmediatePropagation();
log(e);
log(textarea);
log(window.getSelection().getRangeAt(0));
//log(getCaretCharacterOffsetWithin(textarea));
log(getCaretPosition());
				}, false);
//				clone.childNodes[0].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAADv0lEQVRYw+1Wv08jVxD+Zt7uWy92jOMjh6ULBUkHVbiU5A9If6LKSUdqUNLQsnIKlC7FgZQmoqFCgvQoQog0F0EXqNOQAsjZHBL22t43k8K7iw25S5OcpeRGGu3b3TfvzXzzE3hHIybKFlEU0dzc3Henp6flOI4BQI0xaozRTqfDzjl4nqciAlWlJEkAAKqKIAhgjFEAYGaoqhLlR7PneVQqlZiZsbS09GxQAe+OMp8BmEjfBYCmzOk3HdhLA7I68A931pyyeSMUURTx4uJisrOzo+041nYca6/3jTpH6hypOig5lzM7KDtWdqyLPyyqI5ezAOqI1BEpSJXhlOH0yZOfdX19/ep1CMA5B1UFp/AREZhvjdEciMxESeEgsPKQQaSaYyWpnO/be4bnUvV6XYwxYGa8TRq6LQ2w0SlQrVYRhuHoFEjTaXQKtFot9Hq9f+0yEfdmBay1o0Vg5EGYJAlE5L+LgHP3jXu7VefvEMhK8cgUYGYMtNF/nMQlr1cgiiLudDpYXVUEgUUQWJTfKyIMawjDGqgICN8yjQG1sIZaWMOPv1bBgpwL1QcoTE6iMDkJFUC1C9Uuvvr6Prp5N5ydnaWzs7MhFygI4+P999gA1BoQrPhQSXsiC3QAuPehQwNBt9t/Jsn9IMzFtre3w/39/Yubm5tis9mEiFAQBP1NRNA+IeuYxhhYazX9RwAQx3GWyuR5HlQ1iysNggDT09OYmpq6vry8fFCv190QAvPz89/u7u6WDg4OUCgU0Gw2USqVAACFQgHn5+dERDDG5LVCREhEEAQBrLVoNpuoVqsQEVhr0Wg0wMwolUqkqri6ukIQBOOVSqUI4DpH4OTkxK6urnaOjo4A3GZDt9uFqkJEUC6X+25RharC932ICJxzeQHzfR/WWlhr0Wq1QEQgIvi+D1VFkiRoNBpYXl52a2trHgDQ8fGxv7m5+dvFxcWjDLJMiawwZQd5ngdjDB4//gSe56NcLsMYg3a7jRcvfkGxWAQR5QiFYQjf9zN3YWxsDBMTEyiXy2DmYGFhoevNzMx82m63HxWLxSELkyTpj2fphJT5HwDirgMnirjzEsQMZsL0Rx/j+tVVNhUPp7MCKn3jer0ekiQBEXWiKDLe1tYW7e3t5RGZWZtxKp8e1I/uw8PDv8hyxcOuwv/8FX7/qZLLqQjCKUHhYQ9/fPAlkufPoalLv3j6tB8DKysrz+I4/rA/zlN2nzAzRCRH4U6jYmRTKcBEpESk2X4RGSpyaaZk3xJV/X5jY+Ml3tH/nv4E5KQFif7uYoAAAAAASUVORK5CYII=";
				setTimeout(function(){div.appendChild(clone);}, 1000);
			}

*/
			setTimeout(loop, 500);
		})();
		reloadLoop.i = 1000;
		reloadLoop();
		let style = document.createElement("style");
		style.innerHTML = multiline(function(){/*
.trollComment
{
cursor: pointer;
opacity: 0.4;
transform: scaleX(-1);
}
.post-byline:not([troll="true"]) span.troll
{
opacity: 0.1;
transform: scaleX(-1);
}
span.troll
{
background-image: url("TROLLSRC");
background-repeat: no-repeat;
background-position: center;
width: 1.1em;
height: 1.1em;
cursor: pointer;
vertical-align: top;
display: inline-block;
padding: 0.7em 1em;
margin: 0 -0.3em 0 2px;
}
.post-byline:not([troll="true"]) span.troll:hover
{
opacity: 1;
-webkit-animation: move2 0.5s ease-in-out infinite alternate;
animation: move2 1s ease-in-out infinite;
}
span.troll:hover
{
-webkit-animation: move 0.5s ease-in-out infinite alternate;
animation: move 1s ease-in-out infinite;
}
@keyframes move {
25%
{
	transform: rotate(-20deg);
}
75%
{
	transform: rotate(20deg);
}
}
@keyframes move2 {
25%
{
	transform: scaleX(-1) rotate(20deg);
}
75%
{
	transform: scaleX(-1) rotate(-20deg);
}
}
span.troll:nth-child(3)
{
margin-left: 0.4em;
}
span[class="author"] + span.troll
{
margin-left: 0.3em;
}
.trollMenuImg
{
vertical-align: top;
}
.trollBox
{
height: auto;
line-height: 1.3em;
}
/* comment links *//*
.post-message a:not(.mention)
{
text-decoration: underline !important;
}

li.reload:hover > a > svg
{
	fill: black;
}
body.dark li.reload:hover > a > svg
{
	fill: grey;
}

li.reload > a > svg
{
	width: 19px;
	fill: #656c7a;
	vertical-align: middle
}
li.reload > a > span
{
	vertical-align: middle
}
li.reload
{
	cursor: pointer;
	float: left;
	margin-left: 15px;
}

/* Also On section *//*
[data-tracking-area="discovery-north"]
{
	display: none;
}
*/
		}).replace(/TROLLSRC/g, trollSrc);//disqus css
		document.getElementsByTagName("head")[0].appendChild(style);

//disqus notification badge
		if (!document.getElementById("message"))
		{
			let disqus = {
				updateTime: 0,
				updateDelay: 300000, //msec
				modules: [],
				session: null
			};
			(function loop()
			{
				let now = (new Date()).getTime();
				if (!loop.timer)
				{
					loop.timer = setInterval(loop, 1000);
					loop.notificationCount = 0;
				}

				if (!disqus.session)
				{
					let modules = ["common/Session"];

					for(let i = 0; i < modules.length; i++)
					{
						let module = modules[i];
						if (!require.specified(module))
							return;
					}
					require(modules, function(session)
					{
						clearInterval(loop.timer);
						loop.timer = setInterval(loop, 10000);
						disqus.session = session.get();
						disqus.modules = arguments;
						disqus.session.fetchNotificationCount();
						setTimeout(loop, 1000);
					});
				}
				if (!disqus.session)
					return;

				if (disqus.updateTime < now - disqus.updateDelay)
				{
					disqus.session.fetchNotificationCount();
					disqus.updateTime = now;
				}
				if (loop.notificationCount != disqus.session.attributes.notificationCount)
				{
					loop.notificationCount = disqus.session.attributes.notificationCount;
/*
log(disqus.session);
log(loop.notificationCount);
					if (!loop.msg)
					{
						let nodes = document.getElementsByClassName("nav-tab nav-tab--primary notification-menu");
						loop.msg = nodes[0];
					}
					if (!loop.msg)
						return

					let count = loop.msg.getElementsByClassName("notification-count")[0].textContent;

log(count);
*/

					window.top.postMessage({id: "ade", func: "disqusMessageCount", args: [loop.notificationCount], return: null}, "https://www.airdates.tv");
				}
			})();

			receiveMessage.f.disqusNotifClick = function disqusNotifClick()
			{
				if ($("li.nav-tab.nav-tab--primary.notification-menu.unread>a").length)
					$("li.nav-tab.nav-tab--primary.notification-menu.unread>a")[0].click();
			};

			receiveMessage.f.disqusTheme = function disqusTheme(dark)
			{
//console.log("disqus dark", dark);
				document.body.classList.toggle("dark", dark);
			};

		} //if (!document.getElementById("message"))
	}, false); //window load()
}//disqus if (iframe)
else
{
}
let mainFuncDelay = function(e)
{
	if (!isFrame && window.location.href.match(/^http:/))
		setTimeout(function(){mainFunc(e);}, 1000);
	else
		mainFunc(e);

};
if (document.readyState != "loading")
	mainFuncDelay();
else
	document.addEventListener("DOMContentLoaded", mainFuncDelay ,true);





function receiveMessage(event)
{
	if (["https://disqus.com", "https://www.airdates.tv"].indexOf(event.origin) == -1 || typeof(event.data) != "object" || event.data.id != "ade")
	{
		return;
	}
//console.log("receiveMessage", event);
	let func = typeof(receiveMessage.f[event.data.func]) == "function" ? receiveMessage.f[event.data.func] : null;
	if (func)
	{
		let r;
		try
		{
			r = func.apply(receiveMessage.f, event.data.args);
		}
		catch(er){log(er);}

		try
		{
			event.source.postMessage({id: "ade", return: event.data.return, returnVal: r}, event.origin);
		}
		catch(er){}
	}
	if ("returnVal" in event.data && "return" in event.data && typeof(receiveMessage.f[event.data.return]) == "function")
	{
		receiveMessage.f[event.data.return](event.data.returnVal);
	}
}

function createCookie(name,value){ document.cookie = name+"="+encodeURIComponent(value)+"; path=/; expires="+new Date( (new Date()).getTime()+3153600000000).toGMTString()+";"; }
function readCookie(n,r){return(r=document.cookie.match('(^|;)\\s*'+encodeURIComponent(n)+'\\s*=\\s*([^;]+)'))?r[2]:null;}
function eraseCookie( name ){ document.cookie = name+"=; path=/; expires="+new Date((new Date()).getTime()+(-1)).toGMTString()+";"; }

function ls(id, data, callback)
{
	let r;
	if (typeof(data) == "undefined")
	{
		try
		{
			r = localStorage.getItem(id);
		}
		catch(er)
		{
			window.top.postMessage({id: "ade", func: "ls", args: [id], return: callback}, "https://www.airdates.tv");
			log(er);
			return r;
		}
		try
		{
			r = JSON.parse(r);
		}catch(er){}
	}
	else
	{
		try
		{
			r = localStorage.setItem(id, JSON.stringify(data));
		}
		catch(er)
		{
			window.top.postMessage({id: "ade", func: "ls", args: [id, data], return: callback}, "https://www.airdates.tv");
			log(er);
			return r;
		}
	}
	return r;
}

function cs(id, data)
{
	let r;
	if (typeof(data) == "undefined")
	{
		try
		{
			r = readCookie(id);
			r = JSON.parse(r);
		}catch(er){}
	}
	else
	{
		try
		{
			r = createCookie(id, JSON.stringify(data));
		}
		catch(er){}
	}
	return r;
}

function multiline(func, ws)
{
	func = func.toString();
	func = func.slice(func.indexOf("/*") + 2, func.lastIndexOf("*/")).split("*//*").join("*/");
	func = func.replace(/{SVG-([A-Z]+)}/g, function(a, b)
	{
		return SVG[b.toLowerCase()] || a;
	});
	return ws ? func : func.replace(/[\n\t]*/g, "");
}

function removeHash()
{
	history.replaceState({}, "", location.href.replace(/#.*/, ''));
}

function cloneObj(obj, exclude, _map)
{
	if(obj == null || (typeof obj != "object" && typeof obj != "function"))
		return obj;

	let map = _map ? _map : new WeakMap(),
			m = map.get(obj);

	if (m)
		return m;

	let objNew,
			type = Object.prototype.toString.call(obj).slice(8, -1);

	if (typeof(exclude) == "undefined")
		exclude = [];

	if (_map && exclude.indexOf(type) != -1)
	{
		return obj;
	}
	try
	{
		objNew = new obj.constructor();
	}
	catch(er)
	{
		objNew = obj;
	}
	if (type == "Date")
	{
		objNew.setTime(obj.getTime());
	}
	else if (type == "Set")
	{
		for (let i of obj)
		{
			objNew.add(cloneObj(i, exclude, map));
		}
	}
	else if (type == "Map")
	{
		for (let i of obj)
		{
			objNew.set(cloneObj(i[0], exclude, map), cloneObj(i[1], exclude, map));
		}
	}
	else if (type == "Symbol")
	{
		objNew = Object(Symbol(obj.description));
	}
	else if (type == "Function" || type == "WeakMap")
	{
		objNew = obj;
	}
	else if (type == "Error")
	{
		objNew = new obj.constructor(obj);
		objNew.stack = obj.stack;
	}
	else if (type == "Boolean"
				|| type == "Number"
				|| type == "String"
				|| type == "RegExp")
	{
		objNew = new obj.constructor(obj);
	}

	if (typeof obj == "object" //is HTML?
			&& ( obj instanceof Window
				|| obj instanceof Document
				|| obj.ownerDocument instanceof HTMLDocument))
	{
		let h = map.get(obj);
		if (h)
			return h;

		map.set(obj, obj);
		return obj;
	}
	map.set(obj, objNew);

	let k = Object.keys(obj),
			l = k.length;

	for (let i = -1; ++i < l;)
	{
		objNew[k[i]] = cloneObj(obj[k[i]], exclude, map);
	}
	return objNew;
}
