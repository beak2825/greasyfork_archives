// ==UserScript==
// @name           WME URComments International List
// @description    This script is meant as a starting list for international purpose. To be used with the main script URComments.
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.1.2
// @match          https://beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor/*
// @match          https://www.waze.com/*/editor*
// @match          https://www.waze.com/*editor*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/13272/WME%20URComments%20International%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/13272/WME%20URComments%20International%20List.meta.js
// ==/UserScript==


var UrcommentsInternationalVersion = GM_info.script.version; 
//var UrcommentsInternationalVersion = "0.0.0"; //manually change this version number to match the script's version 
var UrcommentsInternationalUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsInternationalVersionUpdateNotes = "URC International List has been updated to " + UrcommentsInternationalVersion;
UrcommentsInternationalVersionUpdateNotes = UrcommentsInternationalVersionUpdateNotes + "\n" + "-code update for WME changes\n\n ! Editing should be fun for everybody ¡";

if (UrcommentsInternationalUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsInternationalVersion') !== UrcommentsInternationalVersion) {
        alert(UrcommentsInternationalVersionUpdateNotes);
        localStorage.setItem('UrcommentsInternationalVersion', UrcommentsInternationalVersion);
    }
}

/*
 * 0.1.2 - code update for WME changes
 * 0.1.1 - changed some responses to fit the new version; minor and major text improvements thanks to a lot of feedback
 * 0.1.0 - improved text of 'Missing Road' and 'Turn not allowed (unknown junction)'; added speed limit response
 * 0.0.9 - Pave road added as default "Missing Road", modified text to match new version; More options for older URs; link to status update with ref to Int Map tiles in 'Solved' - you can change it in the text if necessary; minor bug fixes; minor bug fixes
 * 0.0.8 - added back definition of reminder and closure days
 * 0.0.7 - added update URL
 * 0.0.6 - corrected coding to show full list
 * 0.0.5 - helptext improved, added disabled next button
 * 0.0.4 - Implemented update alerts showing version info; Changed "Close without reply" to "Close without response", with more generic text.
 * 0.0.3 - updated code; filter instructions
 * 0.0.2 - updated code
 * 0.0.1 - initial version
 */
//I will try not to update this file but please ALWAYS KEEP AN EXTERNAL BACKUP of your comments. The main script might force and update to this file and than you will loose your custom comments. By making this a separate script, we try to limit how often this would happen, but be warned, it will eventually happen!
//if you are using quotes in your titles or comments they must be properly escaped. example "This is \"quoted\" in your comment",
//if you wish to have text on the next line, use \r. example "Line1\rLine2",
//if you wish to have blank lines in your messages use \r\r. example "Paragraph1\r\rParagraph2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "Reminder"
window.UrcommentsInternationalReminderPosistion = 21;

//this is the note that is added to the the reminder link (option disabled, not necessary at this moment)
window.UrcommentsInternationalReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). In this list this is "Close without reply"
window.UrcommentsInternationalCloseNotIdentifiedPosistion = 24;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsInternationaldef_names = [];
window.UrcommentsInternationaldef_names[6] = "Incorrect turn (known turn)"; //"Incorrect turn";
window.UrcommentsInternationaldef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsInternationaldef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsInternationaldef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsInternationaldef_names[10] = "General error"; //"General error";
window.UrcommentsInternationaldef_names[11] = "Turn not allowed (known junction)"; //"Turn not allowed";
window.UrcommentsInternationaldef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsInternationaldef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsInternationaldef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsInternationaldef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsInternationaldef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsInternationaldef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsInternationaldef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsInternationaldef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsInternationaldef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsInternationaldef_names[23] = "Speed Limit";  //speed limit ur type is number 23;

//below is all of the text that is displayed to the user while using the script
window.UrcommentsInternationalURC_Text = [];
window.UrcommentsInternationalURC_Text_tooltip = [];
window.UrcommentsInternationalURC_USER_PROMPT = [];
window.UrcommentsInternationalURC_URL = [];

//zoom out links
window.UrcommentsInternationalURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsInternationalURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsInternationalURC_Text[1] = "Zoom Out 2 & Close UR";		
window.UrcommentsInternationalURC_Text_tooltip[1] = "Zooms out to level 2 closes the UR window";

window.UrcommentsInternationalURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsInternationalURC_Text_tooltip[2] = "Zooms out to level 3 where I found most of the toolbox highlighting works and closes the UR window";

window.UrcommentsInternationalURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsInternationalURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsInternationalURC_Text[5] = "Comments";
window.UrcommentsInternationalURC_Text[6] = "UR Filtering";
window.UrcommentsInternationalURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsInternationalURC_Text[8] = "Click here for Instructions";
window.UrcommentsInternationalURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsInternationalURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsInternationalURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsInternationalURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsInternationalURC_Text[10] = "Enable UR pill counts";
window.UrcommentsInternationalURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsInternationalURC_Text[12] = "Hide Waiting";
window.UrcommentsInternationalURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsInternationalURC_Text[13] = "Only show my UR";
window.UrcommentsInternationalURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsInternationalURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsInternationalURC_Text_tooltip[14] = "Show URs where others commented, that have gone past the reminder and close day settings added together";

window.UrcommentsInternationalURC_Text[15] = "Hide URs Reminders needed";
window.UrcommentsInternationalURC_Text_tooltip[15] = "Hide UR where reminders are needed";

window.UrcommentsInternationalURC_Text[16] = "Hide URs user replies";
window.UrcommentsInternationalURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsInternationalURC_Text[17] = "Hide URs close needed";
window.UrcommentsInternationalURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsInternationalURC_Text[18] = "Hide UR no comments";
window.UrcommentsInternationalURC_Text_tooltip[18] = "Hide UR that have zero comments";

window.UrcommentsInternationalURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsInternationalURC_Text_tooltip[19] = "Hide UR that do not have descriptions or comments";

window.UrcommentsInternationalURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsInternationalURC_Text_tooltip[20] = "Hide UR that have descriptions and zero comments";

window.UrcommentsInternationalURC_Text[21] = "Hide Closed UR";
window.UrcommentsInternationalURC_Text_tooltip[21] = "Hide closed UR";

window.UrcommentsInternationalURC_Text[22] = "Hide Tagged URs";
window.UrcommentsInternationalURC_Text[22] = "Hide URs that are tagged with URO+ style tags like [NOTE]";

window.UrcommentsInternationalURC_Text[23] = "Reminder days: ";
window.UrcommentsInternationalURC_Text_tooltip[23] = "Amount of days after last response";

window.UrcommentsInternationalURC_Text[24] = "Close days: ";
window.UrcommentsInternationalURC_Text_tooltip[23] = "Amount of days after last response";

//settings tab
window.UrcommentsInternationalURC_Text[25] = "Auto set new UR comment";
window.UrcommentsInternationalURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsInternationalURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsInternationalURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsInternationalURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsInternationalURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsInternationalURC_Text[28] = "Auto center on UR";
window.UrcommentsInternationalURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsInternationalURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsInternationalURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsInternationalURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsInternationalURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsInternationalURC_Text[31] = "Auto close comment window";
window.UrcommentsInternationalURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsInternationalURC_Text[32] = "Auto reload map after comment";
window.UrcommentsInternationalURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsInternationalURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsInternationalURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsInternationalURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsInternationalURC_Text_tooltip[34] = "Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsInternationalURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsInternationalURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsInternationalURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsInternationalURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsInternationalURC_Text[37] = "Comment List";
window.UrcommentsInternationalURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsInternationalURC_Text[38] = "Disable done / next buttons";
window.UrcommentsInternationalURC_Text_tooltip[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsInternationalURC_Text[39] = "Unfollow UR after send";
window.UrcommentsInternationalURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsInternationalURC_Text[40] = "Auto send reminders";
window.UrcommentsInternationalURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsInternationalURC_Text[41] = "Replace tag name with editor names";
window.UrcommentsInternationalURC_Text_tooltip[41] = "When a UR has the logged in editors name in it replace the tag type with the editors name";

window.UrcommentsInternationalURC_Text[42] = "(DblClick)";//double click to close links
window.UrcommentsInternationalURC_Text_tooltip[42] = "Double click here to auto send comment";

window.UrcommentsInternationalURC_Text[43] = "Don't show tag name on pill";
window.UrcommentsInternationalURC_Text_tooltip[43] = "Don't show tag name on pill where there is a URO tag";

window.UrcommentsInternationalURC_USER_PROMPT[0] = "URComments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsInternationalURC_USER_PROMPT[1] = "URComments - You are missing the following items from your custom comment list: ";

window.UrcommentsInternationalURC_USER_PROMPT[2] = "List can not be found-you can find the list and instructions at https://wiki.waze.com/wiki/Scripts/URComments";

window.UrcommentsInternationalURC_USER_PROMPT[3] = "URComments - you can not set close days to zero";

window.UrcommentsInternationalURC_USER_PROMPT[4] = "URComments - to use the double click links you must have the autoset UR status option enabled";

window.UrcommentsInternationalURC_USER_PROMPT[5] = "Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsInternationalURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsInternationalURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsInternationalURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsInternationalURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send.";

window.UrcommentsInternationalURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a user request open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsInternationalURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. "; //conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Clear Comments"
// "<br>",
// "",
// "",

//there is an example just after the "Clear comments" message

//if you are using quotes in your titles or comments, they must be properly escaped. Example "This is \"quoted\" in your comment",
//if you wish to have text in your comment starting on the next line, use \r (backslash r). For example: "Here is the first text\rThis text starts on a new line",
//if you wish to have blank lines in your message, use \r\r. For example: "This will be paragraph 1\r\rAnd here is paragraph 2",


//International list

window.UrcommentsInternationalArray2 = [			    
"Most used responses",//shows the text in red on top of the next row
"",
"",

"Older URs",
"Hi, sorry for the late response. Could you send us the details of the problem if you still remember? Thank you.",
"Open",

"Very old URs",//insert link to your countries forum and/or wiki
"Sorry for the late response. We are currently working hard to update the map in your neighbourhood. In case you want to help improve the map, please visit the forum (www.waze.com/forum/viewforum.php?f=19) and search your country or location. Thanks!",
"NotIdentified",
	
"Area in need of maintenance, inviting",
"Thank you for your report. The Waze map is maintained by voluntary editors and we need more editors to improve the map in your area.\rIn case you want to help improve the map, please visit the forum (www.waze.com/forum/viewforum.php?f=19), and join your community. We will leave this report open for a couple of days, in case you have questions. Thanks!",
"Open",

"Unclear URs",
"Thanks for your report! Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Thanks!",
"Open",

"Include Users Description",
"You reported \"$URD\", but we don't understand the problem. What can we improve?",
"Open",

"User followed Waze's route",
"Thanks for your report! It appears that you followed the route Waze suggested. Would you please tell us what went wrong? Thanks!",
"Open",

"Reminder message", //do not change title (rickzabel)
"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!",
"Open", 

"Close without reply",
"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
"NotIdentified", 

"Solved",//change description of the server if necessary, general status update at http://status.waze.com/
"Your report helped us solve a map problem. The changes should reach your device within a few days (check the “INTL map tiles” at status.waze.com). Thank you!",
"Solved",

"Solved adding Speed Limit",
"We added the speed limit according to your report. The update should reach your device within a few days (check the “INTL map tiles” @status.waze.com). Thank you for your help improving the map!", 
"Solved",

"Clear comments",
"",
"Open",

"<br>",
"",
"",

"other responses",//shows the text in red on top of the next row
"",
"",

"Turn not allowed (unknown junction)", 
"Thanks for your report! Waze didn't send us information on a turn in your drive. Would you let us know what turn you are having problems with? If possible, please specify the street names at the intersection and the direction of the turn, if possible. Thanks!",
"Open",

"SL Already Set",
"The speed you reported is already set in the map. If you would like to have the current speed limit displayed at all times, please go to Settings > Speedometer > Show speed limit. Thank you!",
"NotIdentified",

"Add Camera",
"Thanks for your report! You can add a camera from the app. Use Report > Camera, and choose Speed, Red Light or Fake. Editors will then approve it. Thank you!",
"NotIdentified",

"House Number",
"We have registered the house number in the Waze database and think that should resolve the issue. Please allow about 48 hours for changes to be reflected in your device. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Please let me know if you continue to experience this problem by submitting another error report. Thanks!",
"Solved",

"Missing place", 
"Thank you for your report. Anytime you find a place that is missing, you can add it from the app by tapping Report (the orange button) > Place. If you add a photo, make sure it won’t contain any personal information. You may also tell us the name, address, and any other detail you know, and we will add it to the map. Thanks in advance!",
"NotIdentified",

"Wrong place",
"Waze uses data from various search engines and we think the coordinates lead to the wrong location on the map. To manually add the correct location, go to Report (the orange button) > Place. If you add a photo, make sure it doesn’t contain any personal information. \r\rYou may also provide the name, address, and any other detail you know, and we will add it to the map. Thanks in advance!",
"Open",

"Address fishing",
"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Wrong search results",
"Thanks for your report! Search results in Waze are retrieved from numerous sources and may not be correct. You may add the right location to the Waze database by clicking on Report > Places. Keep in mind that pictures should not contain personal details.", 
"Open",

"Update search results",
"To get an updated result, remove the location from your navigation history and favorites. Tap the 'i' within the blue circle, and then 'remove from history'. Then search for the location again. Make sure to pick the result from the Waze search engine (Waze icon for address, or pin icon for Place). We will leave this UR open for a couple of days in case you need further help. Thank you!",
"Open",

"Clear TTS Cache",
"Possibly, there is a problem with your Text-to-Speech cache. In the navigate search box, type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. Try search the next route when you have Wifi, for the spoken street names to be downloaded quickly. Thanks!", 
"Open",

"Refresh ",
"Please try to refresh your app. Go to Settings > Display & Map > Data transfer > Refresh Map Of My Area. If that doesn't help, you can clear Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.",
"Open",

"App Bug", 
"Unfortunately, this seems to be a bug of the app and we editors cannot help. Please report this to https://support.google.com/waze/answer/6276841. We will leave this report open for a couple of days in case you have further questions. Thanks!",
"NotIdentified", 

"Max routing distance",
"The search and navigation capabilities of Waze are limited to about 1000-1500 km, depending on the road network and map quality. When the route to your destination yield an error, you can split up your travel, and choose one or more stops in between. More info: https://wiki.waze.com/wiki/Problems,_bugs_and_limitations.\\r\rHappy travels and keep on Wazing!",
"NotIdentified",

"Valid Route",
"Thanks for your report! We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the suggested route a few times, it may be faster. If not, Waze leanrs that this route is slower, and the faster route will become preferred.",
"NotIdentified",

"Detours / Odd-Routing",
"Thank you for your report! We can't find anything on the map to explain the route Waze gave you. Waze sometimes route complex detours to save a few seconds. We are very sorry to say that map editors can not be helpful in this situation.",
"NotIdentified",

"Bad GPS",
"Thanks for your report! Probably your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky. To be sure, you may test your device with a GPS app",
"NotIdentified",

"Road closure or traffic jam",
"If there is heavy traffic, please use Report > Traffic. If the road is completely blocked, please use Report > Closure. Waze will route you and others around it. \rIf this is a long-term closure, please tell us: Which road is closed? From where to where is this road closed? How long (estimate) will the road be closed? Thanks in advance!", 
"Open",

"<br>",
"",
"",

//Default URs 6 through 22 are the different types of UR that a user can submit from the app and the Live Map. Do not change them, thanks!
"default UR responses",//shows the text in red on top of the next row
"",
"",

"Incorrect turn (known turn)", //6
"Thanks for your report! Could you tell us what was wrong with the turn? Is this a temporary situation (e.g., due to road works) or a permanent (e.g., the connecting street is one-way)? Thanks!",
"Open",

"Incorrect address", //7
"Thanks for your report! Waze did not send us enough information to fix your request. Would you tell us the right address and what was the problem with it? Thanks!", 
"Open",

"Incorrect route", //8
"Thanks for your report! Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
"Open",

"Missing roundabout", //9
"Thanks for your report! We can't identify a possible roundabout at the location of your report. Can you describe where it is? Thanks!",
"Open",

"General error", //10
"Thanks for your report! Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Thanks!",
"Open",

"Turn not allowed (known junction)", //11
"Thanks for your report! Would you please let us know why the turn is not allowed? Is this a temporary situation (e.g., due to road works) or a permanent change (e.g., the connecting street is one-way)? Thanks!",
"Open",

"Incorrect junction", //12
"Thanks for your report! Waze did not send us enough information to fix your request. Can you explain what was wrong with the junction? Thanks!",
"Open",

"Missing bridge overpass", //13
"Thanks for your report! What overpass do you miss? Note that, when moving at high speed, Waze does not show all details to keep the display clear. Thanks!", 
"Open",

"Wrong driving direction", //14
"Thanks for your report! Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Thanks!",
"Open",

"Missing Exit", //15
"Thanks for your report! Waze did not send us enough information to fix your request. Can you tell us more about about the missing exit? Where does it lead to? Thanks!",
"Open",

"Missing Road", //16
"Thanks for your report! We couldn't identify the road from satellite imagery. Can you describe it?\r\rYou can also add new roads yourself while driving over them: Tap the orange button > Map Issue > Pave. Start driving. Once done, tap the Map Issue icon at the left of the screen > Stop. You can provide information about the new road -such as it's name- by reporting another Map Issue. Thanks!",
"Open",

"Missing Landmark", //18
"Thanks for your report. Anytime you find a place that is missing, you can add it from the app by tapping Report (the orange button) > Place. If you add a photo, make sure it won’t contain any personal information. You may also tell us the name, address, and any other detail you know, and we will add it to the map. Thanks in advance!",
"Open",

"Speed Limit", //23
"You reported a $URD. Would you let us know between which junctions it is valid? Also, is this speed limit temporary (e.g., due to road works)? Thanks in advance for your help!",
"Open"
    
//End of Default URs
    
];
//end of the International list
