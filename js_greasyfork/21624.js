// ==UserScript==
// @name           WME URComments USA_Southeast
// @description    This script is for USA Southeast comments, to be used with the main script WME URComments (Stable)
// @namespace      t0cableguy@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.2.2
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/21624/WME%20URComments%20USA_Southeast.user.js
// @updateURL https://update.greasyfork.org/scripts/21624/WME%20URComments%20USA_Southeast.meta.js
// ==/UserScript==

var URCommentVersion = GM_info.script.version;
var URCommentUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentVersionUpdateNotes = "UR Comments USA_Southeast has been updated to " + URCommentVersion;
URCommentVersionUpdateNotes = URCommentVersionUpdateNotes + "\n" + "This list will no longer function from the dropdown as \"custom\". You will need to select the USA_Southeast list from the dropdown.";


/* Changelog
 * 5th update to the format
 * 0.0.1 - initial version
 */
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsUSA_SoutheastReminderPosistion = 204;

//this is the note that is added to the the reminder link  option
window.UrcommentsUSA_SoutheastReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"

window.UrcommentsUSA_SoutheastCloseNotIdentifiedPosistion = 0;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area!
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsUSA_Southeastdef_names = [];
window.UrcommentsUSA_Southeastdef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsUSA_Southeastdef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsUSA_Southeastdef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsUSA_Southeastdef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsUSA_Southeastdef_names[10] = "General error"; //"General error";
window.UrcommentsUSA_Southeastdef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsUSA_Southeastdef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsUSA_Southeastdef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsUSA_Southeastdef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsUSA_Southeastdef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsUSA_Southeastdef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsUSA_Southeastdef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsUSA_Southeastdef_names[19] = "Blocked Road";
//"Blocked Road";//"Blocked Road";
window.UrcommentsUSA_Southeastdef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsUSA_Southeastdef_names[22] = "Incorrect Street Prefix or Suffix";
//"Incorrect Street Prefix or Suffix";
window.UrcommentsUSA_Southeastdef_names[23] = "Speed Limit";
//"Missing or invalid speed limit";



//below is all of the text that is displayed to the user while using the script
window.UrcommentsUSA_SoutheastURC_Text = [];
window.UrcommentsUSA_SoutheastURC_Text_tooltip = [];
window.UrcommentsUSA_SoutheastURC_USER_PROMPT = [];
window.UrcommentsUSA_SoutheastURC_URL = [];

//zoom out links
window.UrcommentsUSA_SoutheastURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsUSA_SoutheastURC_Text[1] = "Zoom Out 2 & Close UR";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[1] = "Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsUSA_SoutheastURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[2] = "Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsUSA_SoutheastURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsUSA_SoutheastURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsUSA_SoutheastURC_Text[5] = "Comments";
window.UrcommentsUSA_SoutheastURC_Text[6] = "UR Filtering";
window.UrcommentsUSA_SoutheastURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsUSA_SoutheastURC_Text[8] = "Click here for Instructions";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsUSA_SoutheastURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide=id.p";

window.UrcommentsUSA_SoutheastURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsUSA_SoutheastURC_Text[10] = "Enable UR pill counts";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsUSA_SoutheastURC_Text[12] = "Hide Waiting";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsUSA_SoutheastURC_Text[13] = "Only show my URs";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsUSA_SoutheastURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[14] = "Show URs that other commented on that have gone past the reminder and close day settings added together";

window.UrcommentsUSA_SoutheastURC_Text[15] = "Hide Other's AM's URs able to close";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[15] = "Hide URs that are Other's uncommented UR's, that THEY can close.";

window.UrcommentsUSA_SoutheastURC_Text[16] = "Hide URs user replies";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsUSA_SoutheastURC_Text[17] = "Hide URs close needed";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsUSA_SoutheastURC_Text[18] = "Hide URs no comments";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[18] = "Hide URs that have zero comments";

window.UrcommentsUSA_SoutheastURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[19] = "Hide URs that do not have descriptions or comments";

window.UrcommentsUSA_SoutheastURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[20] = "Hide URs that have descriptions and zero comments";

window.UrcommentsUSA_SoutheastURC_Text[21] = "Hide Closed URs";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[21] = "Hide closed URs";

window.UrcommentsUSA_SoutheastURC_Text[22] = "Hide Tagged URs";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[22] = "Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsUSA_SoutheastURC_Text[23] = "AM Close Days (set to 4): ";

window.UrcommentsUSA_SoutheastURC_Text[24] = "All UR Close Days (set to 3): ";

//settings tab
window.UrcommentsUSA_SoutheastURC_Text[25] = "Auto set new UR comment";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsUSA_SoutheastURC_Text[26] = "(DISABLE IN SOUTHEAST) Auto set reminder UR comment";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[26] = "Do not enable this in the southeast region. Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsUSA_SoutheastURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsUSA_SoutheastURC_Text[28] = "Auto center on UR";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsUSA_SoutheastURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsUSA_SoutheastURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsUSA_SoutheastURC_Text[31] = "Auto close comment window";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsUSA_SoutheastURC_Text[32] = "Auto reload map after comment";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsUSA_SoutheastURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsUSA_SoutheastURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[34] = "Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsUSA_SoutheastURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsUSA_SoutheastURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsUSA_SoutheastURC_Text[37] = "Comment List";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team's list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsUSA_SoutheastURC_Text[38] = "Disable done / next buttons";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsUSA_SoutheastURC_Text[39] = "Unfollow UR after send";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsUSA_SoutheastURC_Text[40] = "(DISABLE IN SOUTHEAST) Auto send reminders";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[40] = "Do not sure this setting in the southeast. Auto send reminders to my UR as they are on screen";

window.UrcommentsUSA_SoutheastURC_Text[41] = "Replace tag name with editor name";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[41] = "When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name";

window.UrcommentsUSA_SoutheastURC_Text[42] = "(Double Click)"; //double click to close links
window.UrcommentsUSA_SoutheastURC_Text_tooltip[42] = "Double click here to auto send - ";

window.UrcommentsUSA_SoutheastURC_Text[43] = "Dont show tag name on pill";
window.UrcommentsUSA_SoutheastURC_Text_tooltip[43] = "Dont show tag name on pill where there is a URO tag";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[1] = "UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[2] = "List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[3] = "URComments - You can not set close days to zero";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[4] = "URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsUSA_SoutheastURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question




//Custom list

//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thank You for the reply"
// "<br>",
// "",
// "",

//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \r\r. example "Line1\r\rLine2",
//if you wish to have text on the next line with no spaces in your message use \r. example "Line1\rLine2",

//Custom list
window.UrcommentsUSA_SoutheastArray2 = [

"No reply close message",
"The problem was unclear and volunteers didn't receive a response. Therefore we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thank You!",//GizmoGuy, t0cableguy, rickzabel 7/24/16
"NotIdentified",

"No further communication",
"No further information was received and the request is being closed. As you travel, please report any map issues you encounter. Thank You!",
"NotIdentified", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14

"No further communication w/fixes",
"No further information was received and the request is being closed. We have made edits in the vicinity of this report that may fix your issue. As you travel, please report any map issues you encounter. Thank You!", 
"Solved",//t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14

"Fixed",
"Due to your report we have found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.", //GizmoGuy 4/13/15 t0cableguy 7/24/16
"Solved",

"SL - Correct",
"Volunteer Responding. The speed limit is set as you indicate in this report. Please allow for GPS error and Waze best mapping practices by waiting up to 200 feet after passing the sign for the correct speed to show in the app. If you would like to see speed limits at all times while using the app, please go to Settings > Speedometer > Show speed limit. Thank You!",//t0cableguy 7/30/16
"Solved",

"SL - Variable Limits",
"Volunteer Responding. Currently Waze does not support Variable Speed Limits (VSLs). Since we cannot enter in speed limits real time, the highest possible speed limit is displayed in Waze. If you would like to see speed limits at all times while using the app, please go to Settings > Speedometer > Show speed limit. Thank You.",
"Solved",

"SL - no supporting signage",
"Volunteer Responding. We have not been able to match your Speed Limit report with existing signage. If Waze does not provide the valid speed limit option to input, please tap other, and input the speed. If you would like to see speed limits at all times while using the app, please go to Settings > Speedometer > Show speed limit. Thank You!",
"NotIdentified",

"SL - Temporary",
"volunteer Responding. Temporary speed limits are only set in waze for long term changes. Please estimate how long will this zone will have a reduced speed limit.",
"Open",


"Problem appears corrected",
"The problem appears to be corrected. Please let us know if the issue continues. We will close this report soon without a response. Thank You!",
"Open", //t0cableguy 7/25/16

"Clear comment & set UR status to Open",
"",
"Open",

 "The road has been closed",
"Thank you for your report, the road has been closed.",
"Solved",//T0cableguy 7/24/16

"Unlock & research",
"Volunteer Responding. I am investigating this issue with my fellow editors. Thank You for your report!",
"Open",

"Address Adjustments",
"The address has been adjusted. This should reach new search results within a few days. On rare occasions it can take closer to a week. Please remove any instance of this address from your history and favorites and search again. Waze will not update your existing history of places unless you remove and search for them again. Please submit another report if this does not resolve your issue. Thank You!",
"Solved", //t0cableguy 7/24/16

"Address in correct spot",
"Waze is currently routing properly to your address. Please remove any instance of this address from your history and favorites and search again. Waze will not update your existing history of places unless you remove and search for them again. Please submit another report if this does not resolve your issue. Thank You!",
"Solved", //t0cableguy 7/24/16

"Address fishing",
"Volunteer Responding. Waze does not tell us your starting or ending destinations. Please provide us your destination as you entered it into Waze. Thank You!",
"Open",

"Thank You for the reply",
"Thank you for the reply! This request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
"NotIdentified", //rickzabel 12/27/14

"Errors with no text",
"Waze did not send us enough information to fix your request. Please let us know what went wrong, and tell us your destination as you entered it into Waze. Thank You!", //rickzabel 12/8/14
"Open",

"App Bug",
"Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to https://support.google.com/waze/answer/6276841",
"NotIdentified", //twintiggrz, t0cableguy, rickzabel 7/24/16

"Bad GPS",
"It appears that your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky.",
"NotIdentified",//rickzabel 12/18/2014

"Valid Route",
"We reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, as it may turn out to actually be faster. If not you'll be teaching Waze that that route is slower, and the faster route will become preferred.",
"NotIdentified",  //GizmoGuy, t0cableguy, rickzabel 1/14/2015

"Gated Community",
"Waze is unable to differentiate from a visitor or a resident. Waze is mapped for commuters and we must consider all routes for a community's residents. Please consider posting a message in the appropriate state forum to get options to help with this issue",
"NotIdentified",//t0cableguy 1/12/17
 
"Signal Avoidance",
"Currently this intersection is mapped properly. Waze has calculated that it may take less time to take the complicated route instead of the direct route. You can choose to take the direct route, or attempt the suggested Waze route and possibly save some time. Thank You!",
"NotIdentified", //t0cableguy 7/25/16

"Time Zone",
"Thank you for your report, but at this time Waze does not track time zones. Your arrival time will change when your phone time changes, Thank You",
"Solved",//N4DOG 8/8/16

"Valid Turn",
"This turn may be faster than the alternative. If it's not faster, your wait time will contribute to Waze's database, helping to discourage it from being routed. If you do not feel comfortable making this turn, you can always go another route. Waze will recalculate your route once it sees you have not made the turn.", 
"NotIdentified",//t0cableguy 7/24/16

"Valid Difficult Turn",
"We cannot disable a legal turn because it is difficult. This turn may be faster than the alternative. If it's not faster, your wait time will contribute to Waze's database, helping to discourage it from being routed. If you do not feel comfortable making this turn, you can always go another route. Waze will recalculate your route once it sees you have not made the turn.",
"NotIdentified", //t0cableguy 7/24/16

"Valid but Difficult Route",
"We cannot disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it's not faster, your wait time will contribute to Waze's database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate.",
"NotIdentified", //karlcr9911 4/4/15 //rickzabel 4/5/15

"Missing place",
"Thank you for reporting a missing place.  Anytime you find a a place that is missing from the waze app you can add it from the app by tapping the Pin icon > Place. After taking a picture of the place please add as many details as you can. Thank You!",
"NotIdentified",


"Double yellow turns",
"Volunteer responding, It is legal to make a left turn across one double yellow line. Turning across three or more yellow lines, is considered a barrier, and is illegal to cross. Thank You!", 
"NotIdentified",//t0cableguy 7/25/16

"Detours / Odd-Routing",
"We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors cannot be helpful in this situation. Thank You!",
"NotIdentified", //rickzabel 4/18/20115

"Overall Waze complaint",
"You can help make Waze better by reporting problems as you find them. Please include as many details as possible. Thank You!",
"NotIdentified", //rickzabel Pesach 12/22/14

"Report to local municipality",
"We are only able to help with map issues. This should be reported to the local municipality. Please feel welcome to report any map issues you encounter. Thank You!",
"NotIdentified", //GizmoGuy, t0cableguy, rickzabel 1/14/2015

"No user transponder (avoid tolls)",
" While Waze attempts to route you to your destination efficiently, it does not know if you have a toll transponder. We cannot remove the path, or set it so only transponder users will be routed through it. To avoid tolls, there is an option under Search > Settings > Navigation or after clicking GO tap Routes and select one without gold coins (iphone) or toll (android). Thank You!",
"NotIdentified", //rickzabel 4/17/2015

"Not Using HOV",
"Waze does not have the ability to know you meet the HOV criteria. Driving into the HOV lane should force Waze to recalculate your route. Afterwards you should be allowed to stay in the HOV lane. Thank You!",
"NotIdentified", //rickzabel 12/14/14

"U-turns",
"Volunteer Responding. Currently Waze will only navigate \"U-turn\" in select situations. The app will prompt several left/right turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors. We understand that Waze is working on a fix. Thank You!",
"NotIdentified", //t0cableguy 6/25/16

"Traffic - Stale Information",
"Volunteer Responding. Map editors are unable to remove traffic jams. You can help clear traffic reports by tapping \"not there\" when prompted or by traveling through the intersection at normal speed.",
"NotIdentified", // rickzabel 7/22/2015 t0cableguy 7/22/2015

"Traffic - Jams",
"Volunteer Responding. To report a traffic jams please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. Thank You!",
"NotIdentified", // reworded - rickzabel 12/7/2014, karlcr9911 12/8/14

"Already included restrictions",
"Volunteer Responding. This restriction is already included in the map, Waze should not route through this illegal turn. If Waze ever gives you a route through a restricted turn, please send another Map Issue report at that time. Thank You!",
"NotIdentified",  //rickzabel Pesach 12/27/14

"1000 mile limit",
"Volunteer Responding. The search and navigation capabilities of Waze are limited to 1000 miles. When driving further than that distance you will need to select a destination less than 1000 miles as your temporary destination.",
"NotIdentified", //karlcr9911 4/5/15 //rickzabel 4/5/15

"Road Closed",
"Volunteer Responding. Please let us know the following; What road is closed?; between which intersections is this road closed; How long is this road scheduled to be closed? Thank You!",
"Open", //t0cableguy 7/25/16

"Temporary road blockage",
"Volunteer Responding. If the road is completely blocked, use the Report > Closure feature for you and others to be rerouted around it. Otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.",
"NotIdentified", //GizmoGuy, t0cableguy, rickzabel 1/14/2015

"Temporary Road Closure",
"Volunteer Responding. Is local traffic allowed to use the road or is it entirely blocked? How long will the road be closed? We currently cannot close a road that is open to local residents. If you can let us know where the road is fully blocked we can close that section of road. Thank You!",
"Open", //t0cableguy 7/25/16

"Water non-editable",
"Volunteer Responding. Water features are not editable by the volunteer editors North America, feel free to report this incorrect water polygon to support at https://support.google.com/waze/",
"NotIdentified",

"Clear TTS Cache",
"Volunteer Responding. Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. Your TTS cache we be re-populated as you use routing.. Thank You!", 
"NotIdentified", //GizmoGuy411  t0cableguy rickzabel 2015-04-04 t0cableguy This should be a last chance option for fixing the issue.04-04-2015  rickzabel 04-04-2015

"Camera report",
"Volunteer Responding. Red light cameras are supported separate of the signal. on a post before of the intersection, so they can photograph the signal and your plate simultaneously. Surveillance cameras mounted on the signal masts are not red light infraction cameras. Is this a red light infraction camera or is this a surveillance camera?", 
"Open",//t0cableguy 7/25/16

"<br>",
"",
"",


"Include Users Description",
"Volunteer Responding. You reported \"$URD\" but Waze did not send us enough information to fix your request. Please let us know what went wrong, and tell us your destination as you entered it into Waze. Thank You!",
"Open", //t0cableguy 7/25/16

//selected segments requires the use of (can someone test if this works?) https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Include selected segments names",
"Volunteer Responding. You reported a problem near $SELSEGS, Waze did not send us enough information to fix your request. Please let us know what went wrong and tell us your destination as you entered it into Waze. Thank You!",
"Open", //t0cableguy 7/25/16

"Wrong Street Name",
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know which street name you think is wrong and what it should be. Thank You",
"Open", //rickzabel Pesach 12/22/14

"User Followed Waze's route",
"Volunteer Responding. It appears that you followed the route Waze suggested. Please let us know what went wrong, and tell us your destination as you entered it into Waze. Thank You!", //reworded rickzabel 12/7/2014
"Open",

"Alley Interference",
"Volunteer Responding. Waze does not let the us know where you were going, although it was probably adjacent to the alley. Please tell us your destination as you entered it into Waze. Thank You!", //rickzabel 12/9/14
"Open",

"Area Entrances",
"Volunteer Responding. We have had problems with Google pins being placed in the center of large landmarks. Remove your previous search and do a new search for the location.", //t0cableguy 7/25/16
"Open",

"48 Hour Reply",
"Volunteer Responding. We made some changes to the map, please allow up to 48 hours for the changes to be reflected in the app.", //t0cableguy 7/25/16
"Open",

"Manual Refresh",
"Volunteer Responding. Please tap the search button > Settings > Display and map > Data transfer > Refresh Map Of My Area.",
//The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.
//GizmoGuy rickzabel 2/26/15
"Open",

"Pave Road",
"Volunteer Responding. You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road, tap Start paving. Once done, tap the Steamroller > Stop paving. You can provide information about the new road such as its name by tapping on the Pin icon > Map Issue > Missing Road. Thank You!",
"Open",




"<br>",
"",
"",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them Thank You
//50
"Incorrect turn", //6
"Volunteer Responding. Please let us know what turn you are having a problem with, and tell us your destination as you entered it into Waze. Thank You!", //rickzabel 12/9/14
"Open",

//51
"Incorrect address", //7
"Volunteer Responding. Waze did not send us enough information to fix your request. Please tell us your destination as you entered it into Waze. What is the problem you are having with this address? Thank You!", //rickzabel 12/8/14
"Open",

"Incorrect route", //8
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know what went wrong with the route Waze gave you. Please tell us your destination as you entered it into Waze. Thank You!",  //t0cableguy 7/25/16
"Open",

"Missing roundabout", //9
"Volunteer Responding. Please tell us as much as possible about the roundabout that is missing. Thank You!", //t0cableguy 7/25/16
"Open",

"General error", //10
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know what went wrong and tell us your destination as you entered it into Waze. Thank You!", //t0cableguy 7/25/16
"Open",

"Turn not allowed", //11
"Volunteer Responding. Please let us know which turn was or should not be allowed. Please specify the street names at the intersection. Thank You!",//t0cableguy 7/25/16
"Open",

"Incorrect junction", //12
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know what was wrong with the route and tell us your destination as you entered it. Thank You!", //t0cableguy 7/25/16
"Open",

"Missing bridge overpass", //13
"Volunteer Responding. Please let us know what overpass you believe is missing. When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Tell us as much as possible about the missing overpass. Thank You!",  //t0cableguy 7/25/16
"Open",

"Wrong driving direction", //14
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know what was wrong with the route and tell us your destination as you entered it. Thank You!", //rickzabel 12/9/14
"Open",

"Missing Exit", //15
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know as much as possible about the missing exit. Thank You!", //rickzabel 12/9/14
"Open",

"Missing Road", //16
"Volunteer Responding. Please tell us as much as possible about the road you believe is missing. Thank You!", //rickzabel 12/9/14
"Open",

"Missing Landmark", //18
"Volunteer Responding. Please tell us as much as possible about the landmark you believe is missing. Thank You!",
"Open",

/*These comments are inactive

"Blocked Road", //19
"Volunteer Responding. If the road is completely blocked, use the Report > Closure feature for you and others to be rerouted around it. Otherwise please use Report > Traffic. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.",
"Open",

"Missing Street Name", //21
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know which street name you think is wrong and what it should be. Thank You",
"Open",

"Incorrect Street Prefix or Suffix", ///22
"Volunteer Responding. Waze did not send us enough information to fix your request. Please let us know which street name you think is wrong and what it should be. Thank You",
"Open",


*/

"Speed Limit", //23
"Volunteer Responding. Waze did not send us enough information to fix your request. Please tell us as much as possible about the problem with the speed limit. \n\nIf you would like to see speed limits at all times please go to Settings > Speedometer > Show speed limit.  Thank You!",
"Open", //rickzabel

"<br>",
"",
"",
//End of Default URs

"Reminder message (do not use in SE!)", //do not change (rickzabel) t0cableguy 7/25/16
//"Just a reminder: We have not received a response on your report. If we don't hear back from you soon we will infer everything is okay and close the report. Thank You!", //karlcr9911 12/7/14  //this has been getting me the most responses, but it probably is the special link i am including with the UR layer enabled rickzabel 12/7/14 t0cableguy 12/8/14
//"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thank You!",//GizmoGuy, t0cableguy, rickzabel 1/14/2015
"T0 is warning you, D doesn't like reminders! you better turn this off!",
"Open",

];
//end Custom list
//alert(window.UrcommentsUSA_SoutheastArray2[0]);
//alert(window.UrcommentsUSA_SoutheastArray2[201]);
