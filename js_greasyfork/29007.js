// ==UserScript==
// @name           WME URComments Thai List
// @description    This script is meant to be used for Thailand UR responses. It contains both Thai and English. To be used with the main script URComments.
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.1
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/29007/WME%20URComments%20Thai%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/29007/WME%20URComments%20Thai%20List.meta.js
// ==/UserScript==


var UrcommentsThaiVersion = GM_info.script.version; 
//var UrcommentsThaiVersion = "0.0.0"; //manually change this version number to match the script's version 
var UrcommentsThaiUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsThaiVersionUpdateNotes = "URC International List has been updated to " + UrcommentsThaiVersion;
UrcommentsThaiVersionUpdateNotes = UrcommentsThaiVersionUpdateNotes + "\n" + "-changed some responses to fit the new version\n -minor and major text improvements thanks to a lot of feedback\n\n ! Editing should be fun for everybody ¡";

if (UrcommentsThaiUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsThaiVersion') !== UrcommentsThaiVersion) {
        alert(UrcommentsThaiVersionUpdateNotes);
        localStorage.setItem('UrcommentsThaiVersion', UrcommentsThaiVersion);
    }
}

/*
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
window.UrcommentsThaiReminderPosistion = 21;

//this is the note that is added to the the reminder link (option disabled, not necessary at this moment)
window.UrcommentsThaiReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). In this list this is "Close without reply"
window.UrcommentsThaiCloseNotIdentifiedPosistion = 24;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsThaidef_names = [];
window.UrcommentsThaidef_names[6] = "Incorrect turn (known turn)"; //"Incorrect turn";
window.UrcommentsThaidef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsThaidef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsThaidef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsThaidef_names[10] = "General error"; //"General error";
window.UrcommentsThaidef_names[11] = "Turn not allowed (known junction)"; //"Turn not allowed";
window.UrcommentsThaidef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsThaidef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsThaidef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsThaidef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsThaidef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsThaidef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsThaidef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsThaidef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsThaidef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsThaidef_names[23] = "Speed Limit";  //speed limit ur type is number 23;

//below is all of the text that is displayed to the user while using the script
window.UrcommentsThaiURC_Text = [];
window.UrcommentsThaiURC_Text_tooltip = [];
window.UrcommentsThaiURC_USER_PROMPT = [];
window.UrcommentsThaiURC_URL = [];

//zoom out links
window.UrcommentsThaiURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsThaiURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsThaiURC_Text[1] = "Zoom Out 2 & Close UR";		
window.UrcommentsThaiURC_Text_tooltip[1] = "Zooms out to level 2 closes the UR window";

window.UrcommentsThaiURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsThaiURC_Text_tooltip[2] = "Zooms out to level 3 where I found most of the toolbox highlighting works and closes the UR window";

window.UrcommentsThaiURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsThaiURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsThaiURC_Text[5] = "Comments";
window.UrcommentsThaiURC_Text[6] = "UR Filtering";
window.UrcommentsThaiURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsThaiURC_Text[8] = "Click here for Instructions";
window.UrcommentsThaiURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsThaiURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsThaiURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsThaiURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsThaiURC_Text[10] = "Enable UR pill counts";
window.UrcommentsThaiURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsThaiURC_Text[12] = "Hide Waiting";
window.UrcommentsThaiURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsThaiURC_Text[13] = "Only show my UR";
window.UrcommentsThaiURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsThaiURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsThaiURC_Text_tooltip[14] = "Show URs where others commented, that have gone past the reminder and close day settings added together";

window.UrcommentsThaiURC_Text[15] = "Hide URs Reminders needed";
window.UrcommentsThaiURC_Text_tooltip[15] = "Hide UR where reminders are needed";

window.UrcommentsThaiURC_Text[16] = "Hide URs user replies";
window.UrcommentsThaiURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsThaiURC_Text[17] = "Hide URs close needed";
window.UrcommentsThaiURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsThaiURC_Text[18] = "Hide UR no comments";
window.UrcommentsThaiURC_Text_tooltip[18] = "Hide UR that have zero comments";

window.UrcommentsThaiURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsThaiURC_Text_tooltip[19] = "Hide UR that do not have descriptions or comments";

window.UrcommentsThaiURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsThaiURC_Text_tooltip[20] = "Hide UR that have descriptions and zero comments";

window.UrcommentsThaiURC_Text[21] = "Hide Closed UR";
window.UrcommentsThaiURC_Text_tooltip[21] = "Hide closed UR";

window.UrcommentsThaiURC_Text[22] = "Hide Tagged URs";
window.UrcommentsThaiURC_Text[22] = "Hide URs that are tagged with URO+ style tags like [NOTE]";

window.UrcommentsThaiURC_Text[23] = "Reminder days: ";
window.UrcommentsThaiURC_Text_tooltip[23] = "Amount of days after last response";

window.UrcommentsThaiURC_Text[24] = "Close days: ";
window.UrcommentsThaiURC_Text_tooltip[23] = "Amount of days after last response";

//settings tab
window.UrcommentsThaiURC_Text[25] = "Auto set new UR comment";
window.UrcommentsThaiURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsThaiURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsThaiURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsThaiURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsThaiURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsThaiURC_Text[28] = "Auto center on UR";
window.UrcommentsThaiURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsThaiURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsThaiURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsThaiURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsThaiURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsThaiURC_Text[31] = "Auto close comment window";
window.UrcommentsThaiURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsThaiURC_Text[32] = "Auto reload map after comment";
window.UrcommentsThaiURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsThaiURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsThaiURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsThaiURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsThaiURC_Text_tooltip[34] = "Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsThaiURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsThaiURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsThaiURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsThaiURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsThaiURC_Text[37] = "Comment List";
window.UrcommentsThaiURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsThaiURC_Text[38] = "Disable done / next buttons";
window.UrcommentsThaiURC_Text_tooltip[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsThaiURC_Text[39] = "Unfollow UR after send";
window.UrcommentsThaiURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsThaiURC_Text[40] = "Auto send reminders";
window.UrcommentsThaiURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsThaiURC_Text[41] = "Replace tag name with editor names";
window.UrcommentsThaiURC_Text_tooltip[41] = "When a UR has the logged in editors name in it replace the tag type with the editors name";

window.UrcommentsThaiURC_Text[42] = "(DblClick)";//double click to close links
window.UrcommentsThaiURC_Text_tooltip[42] = "Double click here to auto send comment";

window.UrcommentsThaiURC_Text[43] = "Don't show tag name on pill";
window.UrcommentsThaiURC_Text_tooltip[43] = "Don't show tag name on pill where there is a URO tag";

window.UrcommentsThaiURC_USER_PROMPT[0] = "URComments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsThaiURC_USER_PROMPT[1] = "URComments - You are missing the following items from your custom comment list: ";

window.UrcommentsThaiURC_USER_PROMPT[2] = "List can not be found-you can find the list and instructions at https://wiki.waze.com/wiki/Scripts/URComments";

window.UrcommentsThaiURC_USER_PROMPT[3] = "URComments - you can not set close days to zero";

window.UrcommentsThaiURC_USER_PROMPT[4] = "URComments - to use the double click links you must have the autoset UR status option enabled";

window.UrcommentsThaiURC_USER_PROMPT[5] = "Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsThaiURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsThaiURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsThaiURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsThaiURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send.";

window.UrcommentsThaiURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a user request open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsThaiURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. "; //conformation message/ question



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

window.UrcommentsThaiArray2 = [			    
"FOLLOW UP RESPONSES",//shows the text in red on top of the next row
"",
"",

   "Reminder /  Follow up",
    "Hello Wazer, we need more information to solve the problem. Without this we will have to close this report in a few days.\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "No Response / closing",
    "Without response we are unable to understand and fix the problem. We will close this report at this time. Please feel welcome to report problems with the map in the future.",
    "NotIdentified", 

    "Fixed",
    "Your report helped us solve a map problem. The changes should reach your device within a few days (check the “INTL map tiles” at status.waze.com). Thank you!", //benandjerry 04/15/17
    "Solved",

    "Clear comments",
    "",
    "Open",

"<br>",
"",
"",

"OTHER RESPONSES",//shows the text in red on top of the next row
"",
"",


//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
    "DEFAULT UR RESPONSES",//shows the text in red on top of the next row
"",
"",

    "Incorrect turn", //6
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the turn? What was your destination? Thank you! [add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Incorrect address", //7
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Incorrect route", //8
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the route? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Missing roundabout", //9
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "General error", //10
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Turn not allowed", //11
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what turn was not allowed? What was your destination? Thank you!\n[add your waze name and role here]",//benandjerry 04/15/17
    "Open",

    "Incorrect junction", //12
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Missing bridge overpass", //13
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Wrong driving direction", //14
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the driving direction? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",


    "Missing Exit", //15
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what exit was missing? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Missing Road", //16
    //"Would you tell us as much as possible about the road you believe is missing? Thanks!",
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what road is missing? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "Missing Landmark", //18
    "ขอขอบคุณสำหรับการรายงานข้อผิดพลาด.! แต่น่าเสียดายที่ผมมีข้อมูลไม่เพียงพอที่จะซ่อมแซม มันอาจจะทำให้เรามีข้อมูลเพิ่มเติมเกี่ยวกับมันได้หรือไม่ ขอขอบคุณ!\n \nHello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what was wrong with the map? What was your destination? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    /*
"Blocked Road", //19
"Volunteer responding -",
"Open",

"Missing Street Name", //21
"Volunteer responding -",
"Open",

"Incorrect Street Prefix or Suffix", ///22
"Volunteer responding -",
"Open",


*/

    "Speed Limit", //23
    "Hello Wazer, Thank you for reporting this error. Waze gives us volunteer map editors very little information to repair the problem. Would you please provide any details about what the speed limit is here? Thank you!\n[add your waze name and role here]", //benandjerry 04/15/17
    "Open",

    "<br>",
    "",
    "",
    //End of Default URs
    
];
//end of the Thai list
