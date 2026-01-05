// ==UserScript==
// @name           WME UR Comments RichardPyne List
// @description    This script is for Custom comments to be used with my other script URComments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.1.0
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/23209/WME%20UR%20Comments%20RichardPyne%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/23209/WME%20UR%20Comments%20RichardPyne%20List.meta.js
// ==/UserScript==
/*jshint multistr: true */
var URCommentRichardPyneVersion = GM_info.script.version; 
//var URCommentRichardPyneVersion = "0.1.2"; //manually change this version number to match the script's version 
var URCommentRichardPyneUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentRichardPyneVersionUpdateNotes = "URC RichardPyne List has been updated to v" + URCommentRichardPyneVersion;
//remove any lines >1 month old. dont leave \n on last line.
URCommentRichardPyneVersionUpdateNotes = URCommentRichardPyneVersionUpdateNotes + "\n" +
"irst branch from PesachZ and others with my own changes.\n\
Recent history:\n\
v0.1.0 - 2016-09-14 First branch from PesachZ and others with my own changes\n\
Full history is posted on Greasy Fork";

if (URCommentRichardPyneUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentRichardPyneVersion') !== URCommentRichardPyneVersion) {
		alert(URCommentRichardPyneVersionUpdateNotes);
		localStorage.setItem('URCommentRichardPyneVersion', URCommentRichardPyneVersion);
	}
}

/* Changelog
 * 5th update to the format
 * 0.0.1 - initial version
 */

//This file will be updated as I tweak and add to the comments.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \r\r. example "Line1\r\rLine2",
//if you wish to have text on the next line with no spaces in your message use \r. example "Line1\rLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsRichardPyneReminderPosistion = 3;

//this is the note that is added to the the reminder link  option
// This is deactivated as the reply link is no longer an option >> restoring it for backwards compatibility to v.0.9.4
window.UrcommentsRichardPyneReplyInstructions = 'To reply, please either use the Waze app inbox or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsRichardPyneCloseNotIdentifiedPosistion = 6;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsRichardPynedef_names = [];
window.UrcommentsRichardPynedef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsRichardPynedef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsRichardPynedef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsRichardPynedef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsRichardPynedef_names[10] = "General error"; //"General error";
window.UrcommentsRichardPynedef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsRichardPynedef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsRichardPynedef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsRichardPynedef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsRichardPynedef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsRichardPynedef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsRichardPynedef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsRichardPynedef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsRichardPynedef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsRichardPynedef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsRichardPynedef_names[23] = "Speed Limit";  //speed limit ur


//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsRichardPyneURC_Text = [];
window.UrcommentsRichardPyneURC_Text_tooltip = [];
window.UrcommentsRichardPyneURC_USER_PROMPT = [];
window.UrcommentsRichardPyneURC_URL = [];

//zoom out links
window.UrcommentsRichardPyneURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsRichardPyneURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsRichardPyneURC_Text[1] = "Zoom Out 2 & Close UR";		
window.UrcommentsRichardPyneURC_Text_tooltip[1] = "Zooms out to level 2 (this is where I found most of the toolbox highlighting works) and closes the UR window";

window.UrcommentsRichardPyneURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsRichardPyneURC_Text_tooltip[2] = "Zooms out to level 3 (this is where I found most of the toolbox highlighting works) and closes the UR window";

window.UrcommentsRichardPyneURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsRichardPyneURC_Text_tooltip[4] = "Number of URs Shown on screen";

//tab names
window.UrcommentsRichardPyneURC_Text[5] = "Comments";
window.UrcommentsRichardPyneURC_Text[6] = "UR Filters";
window.UrcommentsRichardPyneURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsRichardPyneURC_Text[8] = "Click here for Instructions";
window.UrcommentsRichardPyneURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsRichardPyneURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/";
		
window.UrcommentsRichardPyneURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsRichardPyneURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsRichardPyneURC_Text[10] = "Enable UR pill counts";
window.UrcommentsRichardPyneURC_Text_tooltip[10] = "Enable or disable the pill with UR comments & elapsed days counts";

window.UrcommentsRichardPyneURC_Text[12] = "Hide Waiting";
window.UrcommentsRichardPyneURC_Text_tooltip[12] = "Only show URs that need work (hide URs waiting for a response within time frame)";

window.UrcommentsRichardPyneURC_Text[13] = "Only show my URs";
window.UrcommentsRichardPyneURC_Text_tooltip[13] = "Hide URs where there are no comments from me";

window.UrcommentsRichardPyneURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsRichardPyneURC_Text_tooltip[14] = "Show URs others commented on that have elapsed past the reminder and close day settings added together";

window.UrcommentsRichardPyneURC_Text[15] = "Hide URs Reminder needed";
window.UrcommentsRichardPyneURC_Text_tooltip[15] = "Hide URs where reminders are needed";

window.UrcommentsRichardPyneURC_Text[16] = "Hide user replies";
window.UrcommentsRichardPyneURC_Text_tooltip[16] = "Hide URs with user replies";

window.UrcommentsRichardPyneURC_Text[17] = "Hide URs close needed";
window.UrcommentsRichardPyneURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsRichardPyneURC_Text[18] = "Hide URs no comments";
window.UrcommentsRichardPyneURC_Text_tooltip[18] = "Hide URs that have no comments";

window.UrcommentsRichardPyneURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsRichardPyneURC_Text_tooltip[19] = "Hide URs that do not have descriptions or comments";

window.UrcommentsRichardPyneURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsRichardPyneURC_Text_tooltip[20] = "Hide URs that have descriptions and zero comments";

window.UrcommentsRichardPyneURC_Text[21] = "Hide Closed URs";
window.UrcommentsRichardPyneURC_Text_tooltip[21] = "Hide closed URs";

window.UrcommentsRichardPyneURC_Text[22] = "Hide Tagged URs";
window.UrcommentsRichardPyneURC_Text_tooltip[22] = "Hide URs that are tagged with URO+ stle tags ex. [NOTE]";

window.UrcommentsRichardPyneURC_Text[23] = "Reminder days: ";

window.UrcommentsRichardPyneURC_Text[24] = "Close days: ";

//settings tab
window.UrcommentsRichardPyneURC_Text[25] = "Auto set new UR comment";
window.UrcommentsRichardPyneURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsRichardPyneURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsRichardPyneURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsRichardPyneURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsRichardPyneURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsRichardPyneURC_Text[28] = "Auto center on UR";
window.UrcommentsRichardPyneURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsRichardPyneURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsRichardPyneURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsRichardPyneURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsRichardPyneURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsRichardPyneURC_Text[31] = " Auto close comment window";
window.UrcommentsRichardPyneURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsRichardPyneURC_Text[32] = "Auto reload map after comment";
window.UrcommentsRichardPyneURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map.";

window.UrcommentsRichardPyneURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsRichardPyneURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsRichardPyneURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsRichardPyneURC_Text_tooltip[34] = "Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsRichardPyneURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsRichardPyneURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsRichardPyneURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsRichardPyneURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsRichardPyneURC_Text[37] = "Comment List";
window.UrcommentsRichardPyneURC_Text_tooltip[37] = "This is shows the selected comment list, there is support for a custom list or If you would like your comment list built into the this script or have suggestions on the Comments team’s list please contact me at rickzabel @waze or @gmail";

window.UrcommentsRichardPyneURC_Text[38] = "Disable done button";
window.UrcommentsRichardPyneURC_Text_tooltip[38] = "Disable the done button at the bottom of the new UR window";

window.UrcommentsRichardPyneURC_Text[39] = "Unfollow UR after send";
window.UrcommentsRichardPyneURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsRichardPyneURC_Text[40] = "Auto send reminders";
window.UrcommentsRichardPyneURC_Text_tooltip[40] = "Auto send reminders to my URs as they are on screen";

window.UrcommentsRichardPyneURC_Text[41] = "Replace tag name with my username";
window.UrcommentsRichardPyneURC_Text_tooltip[41] = "When a URO+ style [TAGGED] UR has my logged-in username in it, replace the tag type with the editors name";

window.UrcommentsRichardPyneURC_Text[42] = "(Double Click)"; //double click to close links
window.UrcommentsRichardPyneURC_Text_tooltip[42] = "Double click here to auto send - ";
window.UrcommentsRichardPyneURC_Text[43] = "Dont show tag name on pill";
window.UrcommentsRichardPyneURC_Text_tooltip[43] = "Dont show tag name on pill where there is a URO tag";

window.UrcommentsRichardPyneURC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error in your custom file. Either will keep the custom list from loading. Missing: ";

window.UrcommentsRichardPyneURC_USER_PROMPT[1] = "UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsRichardPyneURC_USER_PROMPT[2] = " List can not be found you can find the list and installation instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsRichardPyneURC_USER_PROMPT[3] = "URComments - You can not set close days to \"0\"";

window.UrcommentsRichardPyneURC_USER_PROMPT[4] = "URComments - To use the double click links you must have the \"Auto click open, solved, not identified\" option enabled";

window.UrcommentsRichardPyneURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 becasue both filtering, counts, and auto reminders are disabled";

window.UrcommentsRichardPyneURC_USER_PROMPT[6] = "URComments - Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsRichardPyneURC_USER_PROMPT[7] = "URComments - Adding reminder message to UR: "; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsRichardPyneURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsRichardPyneURC_USER_PROMPT[9] = "URComments has detected that you have unsaved edits!\r\rWith the Auto Save option enabled and unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsRichardPyneURC_USER_PROMPT[10] = "URComments - Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a oragne box, length must be kept short

window.UrcommentsRichardPyneURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are visible on your screen. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsRichardPyneArray2 = [
    "Errors with no descriptive text",
    "Hi there,\r\
I'm a volunteer map editor trying to help you fix your problem with the map. Can you please tell me exactly what was wrong, and what needs to fixed here.\r\r\
\
Try to be as detailed and specific as possible, it will assist us in trying to fix the problem.\r\r\
\
Thanks and Happy Wazing! \r\
(reply using the app)",
    "Open",
    
    "Reminder Follow-Up",
    "Just a reminder: We haven't received a response on your report. If we don't hear back from you we'll have to infer everything is okay and close the report. Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Close due to No Response",
    "Unfortunately we were unable to determine what the issue was that you reported, and volunteers didn't receive a response from you. We will be closing this report. Please feel welcome to send a new report if you still encounter this, or any other map issues.\r\
Thank you, and Happy Wazing!",
    "NotIdentified",
    
    "Fixed",
    "Thanks to your report we've found and fixed a problem with the map. The fix should reach handheld devices within two days, but on rare occasions it can take closer to two weeks.",
    "Solved",
    
    "Valid Route",
    "We reviewed the issue and did not find any map errors. It looks like Waze had a valid route. If you feel yours is correct keep driving that way. If it is indeed faster Waze will learn from your drives and route you and others the faster route. Thanks!",
    "NotIdentified",
    
    "Thanks for the reply",
    "Thank you for the reply this request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
    "Solved",
    
    "No further comm. received",
    "No further communication was received, this request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
    "Solved",
    
    "No further comm. received",
    "No further communication was received, this request will now be closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
    "NotIdentified",
    
    "Address fishing",
    "Volunteer Editor here. Waze does not tell us your starting or ending destinations. Would you tell us the address you are having problems with as you entered it into Waze? Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Problem appears corrected",
    "Just a reminder: The problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Duplicate",
    "This report is being closed because it is a duplicate. Thank you",
    "NotIdentified",

    "Speed Limit Added",
    "Thank you for your help, the speed limit has been added to the map. This request will now be closed. Please feel free to report any other Speed limit signs or map issues you encounter on your drives.\r\r\
Happy Wazing!\r\r\
\
PS Speed limits are for informational purposes only and do not affect routing or ETA calculations, those are based on average actual speeds of drivers on the roads.",
    "Solved",

    "Speed Limit Existing",
    "Thank you for your report, the speed limit here has already been added to the map before. Speed limits only display in the client when you are speeding, unless you set the speedometer settings to show them all the time. There is about a 2 second delay in the client app to show the correct speed limit after a speed limit change (after a ramp, limit change, or turning onto a new road), please wait a few second on a new road to see if the correct limit shows up before reporting. This request will now be closed. Please feel free to report any other Speed limit signs or map issues you encounter on your drives.\r\r\
Happy Wazing!\r\r\
\
PS Speed limits are for informational purposes only and do not affect routing or ETA calculations, those are based on average actual speeds of drivers on the roads.",
    "NotIdentified",

    "Incorrect turn", //6
    "Volunteer Editor here. Would you please let us know what turn you are having a problem with? Thanks! (reply using the app)",
    "Open",

    "Incorrect address", //7
    "Volunteer Editor here. Waze did not send us enough information to fix your request. In order for us to help you we need to know a couple of things, what is the address as you entered it into Waze and what was the problem you were having with this address? \r\ (reply using the app)",
    //"Waze did not send us enough information to fix your request. Would you tell us the address as you entered it into Waze? What is the problem you are having with this address? Thanks! (reply using the app)",
    "Open",

    "Incorrect route", //8
    "Volunteer Editor here. Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks! (reply using the app)",
    "Open",
    
    /*
    "Missing roundabout",						//9
    "",
    "Open",
    */

    "General error", //10
    "I'm a volunteer map editor trying to help you fix your problem with the map. You reported \"$URD\". Can you please tell me exactly what was wrong, and what needs to fixed here.\r\r\
\
Try to be as detailed and specific as possible, it will assist us in trying to fix the problem.\r\r\
\
Thanks and Happy Wazing! \r\
(reply using the app)",
"Open",

    "Turn not allowed", //11
    "I'm a volunteer editor trying to fix your problem with the map. Please tell us exactly which turn is not allowed, and why. (Which direction? From which street? To which street? Is there a sign?)\r\
Did Waze tell to make the turn which is not allowed? \r\
(reply using the app)",
    "Open",

    
    "Incorrect junction", //12
    "Volunteer Editor here. Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks! \r\
    (reply using the app)",
    "Open",

    
    "Missing bridge overpass", //13
    "Volunteer Editor here. Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks! \r\
    (reply using the app)",
    "Open",

   
    "Wrong driving direction", //14
    "Volunteer Editor here. Waze doesn’t give us enough information to fix your request. In order for us to try and fix the problem can you please tell us some more about it.\r\
1) What did Waze tell you to do that you feel is inappropriate?\r\
2) What is the better choice route?\r\
3) Where did you start navigation from (point of origin, if you want you can be approximate)?\r\
4) What was your destination exactly as you entered it into Waze?\r\
With this information we will try to replicate the problem and fix it in Waze, Thanks for your help. Happy Wazing. \r\
(reply using the app)",
    "Open",

    "Missing Exit", //15
    "Volunteer Editor here. Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks! \r\
    (reply using teh app)",
    "Open",

    "Missing Road", //16
    "Volunteer Editor here. Would you tell us as much as possible about the road you believe is missing? Thanks! \r\
    (reply using the app)",
    "Open",
    
    /*	
    "Missing Landmark",							//18
    "",
    "Open",

    "Blocked Road",								//19
    "",
    "Open",

    "Missing Street Name",						//21
    "",
    "Open",
	
    "Incorrect Street Prefix or Suffix",		//22
    "",
    "Open",
	*/
	
	"Speed Limit", //23
	"Volunteer Editor here. Thanks for reporting this roads' speed limit. You reported \"$URD\", however that does not match the information we were able to find. I'd love to add it to the map as accurately as possible, so I need a bit more information please. \r\
	Is this a recent change? \r\
	Is there a speed limit sign here? \r\
	Can you tell me where this speed limit starts and ends if possible? \r\
	Thanks for your help, Happy Wazing. \r\ Please note that we only enter permanent and regulatory speed limits (white signs). We don't enter advisory (yellow signs) or temporary limits (construction zones, school zones, etc.). \r\
    (reply using the app)",
	"open",

    "<br>",
    "",
    "",
    
    //End of Default URs  
                          
    "Speed Limit already correct",
    "The speed limit you reported has been verified as correct in the map. \r\
Please note that the app display often takes several seconds to update when a speed limit changes, and only shows the limit when you are speeding, unless you change your app speedometer settings to show limits all the time. As no map changes are needed, I will close this report. Thanks!",
    "NotIdentified",
    
    "Speed Limit non-permanent",
    "Volunteer Editor here: Thank you for your report! Please note that we only enter permanent and regulatory speed limits (white signs). We don't enter advisory (yellow signs) or temporary limits (construction zones, school zones, etc.). As no map changes are needed, I will close this report. Thanks!",
    "NotIdentified",
    
    "Speed Limit faster then existing",
    "Volunteer Editor here: Please note that the app display often takes several seconds to update when a speed limit changes, and only shows the limit when you are speeding, unless you change your app speedometer settings to show limits all the time. If you still believe a speed limit is incorrect in Waze in that area, can you tell us where the new speed limit starts and ends?\r\
    (reply using the app)",
    "Open",
    
    "Speed Limit slower than existing",
    "Volunteer Editor here: Are you reporting a temporary speed limit (construction/school zone), an advisory speed (yellow signs, not white), or a permanent change from the existing Waze speed? If it's permanent, can you tell us where the new speed limit starts and ends? Please note that we only enter permanent and regulatory speed limits; advisory or temporary limits are not used.\r\
    (reply using the app)",
    "Open",
    
    "No Speed Limit in report",
    "Volunteer Editor here: Are you reporting a temporary speed limit (construction/school zone), an advisory speed (yellow signs, not white), or a permanent change from the existing Waze speed? If it's permanent, can you tell us what the new limit is, and where the new speed limit starts and ends? Please note that we only enter permanent and regulatory speed limits; advisory or temporary limits are not used. \r\
    (reply using the app)",
    "open",
    
    "No existing Speed Limit",
    "Volunteer Editor here: Thank you for your report! Can you tell us where the reported speed limit starts and ends? Please note that we only enter permanent and regulatory speed limits (white signs). We don't enter advisory (yellow signs) or temporary limits (construction zones, school zones, etc.). \r\
    (reply using the app)",
    "open",
    
    "SLUR no response",
    "Hello, we did not receive any further clarification regarding your \"Missing or invalid speed limit\" report. We have heard that many of these reports were submitted inadvertently. Due to the large number of these reports which we've received since the release of speed limit reporting, we are closing this report at this time. Feel free to continue to report if the speed limit displayed on Waze does not reflect the limits posted on regulatory (black and white) signs.",
    "NotIdentified",
    
    "<br>",
    "",
    "",
    
    "House Number",
    "Hi I'm a volunteer editor and I fixed the address location in Waze, but Waze also uses address locations from Google. To stop this issue from happening, please also go to Google Maps and report the issue there.",
    "Solved",

    "Google Pin (long)",
    "Hi I'm a volunteer editor and I checked the Waze map and corrected the pin placement in Waze.\r\
However Waze retrieves address and POI locations from many third party sources as well (as you can tell by the little icons at the bottom of the search results screen in the client app). \
These primarily come from Google, Bing, Yelp, etc., and when it uses these 3rd party sources it only gets the actual GPS coordinates of the location and not the correct street to attach it to. Waze therefore guesses which street to navigate to based on which is closest to the pin location. \
This sometimes leads to routing around the corner or the block behind where you actually need to be. Unfortunately we can't correct the information in the other sources, but you can go to those respective sites and submit an error report to them asking them to fix it. \
(You can tell if a search result is coming from Waze or Google by checking which icon is highlighted at the bottom of the client app, also the Waze results will NOT include a zip code, the Google results WILL include a zip code.)\r\r\
\
For more information on this visit https://www.waze.com/wiki/index.php/FAQ#What_do_I_do_when_Waze_has_my_destination_or_address_at_the_wrong_location.3\rand www.waze.com/forum\r\
Thanks, and Happy Wazing",
    "Solved",
    
    "Road Closed",
    "Volunteer Editor here: Thank you for taking the time to report this closure, however in the future Please use Report>Road Closure from the app instead of Report>Map Issue, for current closures this provides instant notice to other drivers. This will also force the app to reroute you around the closure.\r\rIf the closure is going to last more than 24 hours from now, and you have the relevant details, and links to information about the closure, you can report the closure using the form at http://j.mp/WazeClosure . Alternatively you can reply to this report, or send a new Report>Map Issue from the area of the closure with all the details. Thanks \r\
    (reply using the app)",
    "Open",
    
    "GPS Snapping to Parallel Rd",
    "Volunteer Editor here: Unfortunately this is an issue contributed to by several factors including but not limited to poor GPS chip quality in our consumer electronics (phones), poor GPS accuracy due to interference and large buildings and structures, the way Waze 'snaps' you onto the nearest road and resists changing that unless you deviate significantly away from it (further than from the Service Rd to the Main Rd), and Waze assuming you are following the directions and your GPS is slightly off.\r\r\
\
To correct it you can try a few things.\r\
1) Tap the 'Navigate' menu > Routes and choose the best route. When it recalculates it may place you back on the right road.\r\
2) Stop navigation (Menu > Stop Navigation) and then restart Navigation to the same destination. When you are not in navigation mode Waze snaps back to your actual road easier.\r\
3) Exit the app (Menu > power button (|) ), and then just open it back up. When it opens it should see you on the correct road and then a popup should appear asking if you want to continue your last destination. Tap yes and it will resume navigation to your destination from the right road.\r\
4) If the GPS location on the device itself is the problem (if it happens in other apps as well) try turning your GPS antennas off and on again. Make sure as well that your device has a clear view of the sky.\r\r\
\
This is not a map issue, it is a client app issue. For more info please visit www.waze.com/forum and the FAQ at https://wiki.waze.com/wiki/FAQ#Waze_is_repeatedly_losing_GPS_signal.2C_What_can_I_do_about_this.3F\r\r\
\
Thanks and Happy Wazing",
    "NotIdentified",                     
   
    "Not Avoiding Tolls",
    "Waze won't take a \"long\" detour to avoid a toll. which could be what happened to you.\r\
For some more info see https://www.waze.com/forum/viewtopic.php?f=6&t=71405 \r\
If this is a route you take often, you could select a segment on the road you want to route over to avoid the toll and add it as a favorite ( http://wiki.waze.com/wiki/Manage_Favorites ), then add it as a stop when you are navigating ( http://wiki.waze.com/wiki/How_to_Navigate#Add_a_stop_point ). This will force a detour to your stop point and bypass the toll road.",
    "NotIdentified",
    
    "Not Avoiding Highways",
    "The setting in the app to avoid highways, ONLY avoids freeways. It will still route you over major and minor highways. This is not an error, or a problem with the map, this is how the client app was designed. If you feel there’s a road mapped as highway which should really be a freeway, you can describe why here, send another report, or even better yet post a message about it in your regions specific forum https://www.waze.com/forum/viewforum.php?f=19",
    "NotIdentified",

    "Not Using HOV",
    "HOV features are currently in development, and not yet working in the client app.\r\
    The map is setup correctly to support the HOV lane here. However the Waze Client App doesn't yet have the ability to know if you are in an HOV vehicle, it therefore assumes you do not meet the HOV criteria, and will only route you on roads open to all private vehicles.\r\
If you are a qualified HOV vehicle and want to use the HOV lane, driving into the HOV should force Waze to recalculate your route. Once Waze realizes you are in the HOV lane, it should calculate the best route to your destination allowing you to stay in the HOV lane. If you have other questions or issues, please reply here, or send a new report at the location of the issue.\r\
Thank you, and Happy Wazing",
    "NotIdentified",
    
    "Known Bug",
    "This issue has been escalated, and is being handled as part of a larger project by Waze staff.\r\
Thanks for the report, Happy Wazing.",
    "NotIdentified",
    
    "User Followed Waze's route",
    "Volunteer Editor here: It appears that you ended up going the route Waze suggested, what was the problem you were having? Would you tell us your destination as you entered it into Waze? Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Alley Interference",
    "Volunteer Editor here: Waze doesn't tell us where you were going, although it was probably adjacent to the alley. If you would, please supply your destination as you entered it into Waze it may be helpful in correcting the route. Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Area Entrances (Airport, amusement,  parks)",
    "We have had problems with Google pins being placed in the center of a large landmarks. Delete your previous search and do a new search for the location. Go to the bottom of the auto fill list to see more results and make sure you pick the Waze search engine. \r\
    (reply using the app)",
    "Open",
    
    "48 Hour Reply",
    "Please allow 48 hours for changes to be reflected in the live map.",
    "Open",

    "Clear Saved Locations",
    "You should remove the location from your favorites and recent searches and then re-search for the location to update the result.",
    "Open",
    
    "Clear TTS Cache",
    "If you continue to have this problem you will need to clear your Text to Speech cache. Go to navigation screen and type cc@tts in search field and hit search. You should get a pop up message that the TTS file has been cleared. It will take a few days for the file to build back up with all the spoken street names.",
    "Open",

    "Address - Incorrect Position",
    "Volunteer Editor here: Thank you for your report. Would you please let us know what address you're reporting the problem with? You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location your marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks! \r\
    (reply using the app)",
    "Open",
    
    "Address - Missing from Map",
    "Volunteer Editor here: Thank you for your report. Would you please let us know where the address you're reporting is? The live map doesn't have all the street numbers for that street and Waze is interpolating in error. You can also use the Report -> Places feature in Waze to mark the location. It is helpful that after taking a picture, if you move near the location you’re marking to save the place. Also, please do not submit pictures containing faces, license plates, or similar personal details. Thanks! \r\
    (reply using the app)",
    "Open",

    "Address - Search Results Bad",
    "Volunteer Editor here: Thank you for your report. The search feature retrieves results from a number of locations, including Google. Scrolling to the bottom the Navigate screen, you'll see more results for 'name.' Select that and Waze will list locations Around You. From there, you can also select results from other search engines.",
    "Open",
    
    "Detours / Odd-Routing",
    "Volunteer Editor here: We can't find anything in the map to explain route Waze gave you. Waze wants to save you time every way it can and sometimes it suggests complex detours just to shave a few seconds off your trip. Waze may recommend a detour even after the traffic has cleared up because: it doesn't know yet, other Wazers may have reported a temporary street closure, or daily traffic patterns. In any event, we are very sorry to say that the volunteer map editors can't be much help here. Thanks!",
    "NotIdentified",

    "Detours - No Traffic (Long)",
    "Volunteer Editor here: We checked the map, and there are no errors which would cause this detour. The detour could be due to one or more of a few reasons.\r\
1) Waze thinks there is traffic or an incident up ahead, and is trying to take you around it to save time. This traffic/incident may have already cleared up, but Waze will only know once people start driving through that segment at average speed.\r\
2) Based on historical traffic data for that time of day, Waze thinks that the other route will be faster. The only way to fix this is by people driving both routes and teaching Waze what the correct average speeds on those roads are. If this is always happening at the same place, try and take the suggested route a few times, to show Waze that it really is slower. (I know it's a detour, but it will help everyone in your area.)\r\
3) A Temporary Road Closure was reported along your route. Once enough wazers drive through the closure at highway speed, the closure will be cancelled.\r\
4) It may actually be a faster route. If you follow it once or twice (step 2) you can see for yourself.\r\
If you followed these steps and the detour is still happening, please send us another report. Thanks for your time, and Happy Wazing.",
    "NotIdentified",

    "House Number Adjustment",
    "Volunteer Editor here: I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow 48 hours for changes to be reflected in the live map. If the location is in your saved searches or favorites, please remove them and search for them again to pick up the change in the live map. Please let me know if you continue to experience the problem. Thanks! \r\
    (reply using the app)",
    "Open",

    "House Number Added",
    "Volunteer Editor here: The address was not in the Waze database. I've added the address to the Waze map. I believe this should correct your issue. Please allow 48 hours for changes to be reflected in the live map. If the location is in your saved searches or favorites, please remove them and search for them again to pick up the change in the live map. If you continue to experience the problem please open another issue report. Thanks!",
    "Solved",
    
    "Missing Bridges or Roads",
    "Volunteer Editor here: The roads here have been pretty thoroughly mapped and we volunteers can't see anything missing that should ordinarily be there. Waze probably simply chose not to show you the feature in question. When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks! \r\
    (reply using the app)",
    "Open",                                 

    "Traffic - Stale Information",
    "Volunteer map editors can't do anything about Waze's traffic reporting. Waze relies on data from people using Waze to assess traffic. In the case of a fresh accident or slowdown, Waze may not yet have any data on the situation. Once Waze has detected a traffic situation, it can remember it for awhile, sometimes long after the situation changes.",
    "NotIdentified",
    
    "Traffic - Jams ",
    "To report traffic jam conditions, please use the Report -> Traffic Jam options in the Waze app. This will tell Waze about the problem in real-time. Traffic Jam reports can help route you and other Wazers around traffic problems. \
Waze also records historical traffic data and uses that in selecting navigation routes.",
    "NotIdentified",
    
    "Signal Avoidance Bug",
    "Volunteer Editor here: I do not see any issues with the current turn restrictions in the area. This appears to be part of the known signal avoidance bug. Waze's developers are working on a fix for the issue but we do not have an ETA. Please feel free to take the turn until the issue is resolved. Thanks!",
    "NotIdentified",

    "Manual Refresh",
    "You can try a manual refresh by going to Settings > Advanced > Data transfer > refresh maps.",
    "Open"
];
//end Custom list