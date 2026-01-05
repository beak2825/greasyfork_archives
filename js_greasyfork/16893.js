// ==UserScript==
// @name           WME URComments MatthewStarbuck's List
// @description    This script is the Matthew Starbuck version of the WME URComments Script by Rick Zabel
// @namespace      mstarbuck13@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.6
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Matt Starbuck 2016
// @license        MIT/BSD/X11
// @icon           data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/16893/WME%20URComments%20MatthewStarbuck%27s%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/16893/WME%20URComments%20MatthewStarbuck%27s%20List.meta.js
// ==/UserScript==


var URCommentCustomVersion = GM_info.script.version;
var URCommentCustomUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentCustomVersionUpdateNotes = "The URC Custom comment file needed new @match URLs. Dont forget to copy your comments back into the script! v" + URCommentCustomVersion;

if (URCommentCustomUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentCustomVersion') !== URCommentCustomVersion) {
		alert(URCommentCustomVersionUpdateNotes);
		localStorage.setItem('URCommentCustomVersion', URCommentCustomVersion);
	}
}

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
window.UrcommentsCustomReminderPosistion = 24;

//this is the note that is added to the the reminder link  option
window.UrcommentsCustomReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsCustomCloseNotIdentifiedPosistion = 27;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area!
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsCustomdef_names = [];
window.UrcommentsCustomdef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsCustomdef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsCustomdef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsCustomdef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsCustomdef_names[10] = "General error"; //"General error";
window.UrcommentsCustomdef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsCustomdef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsCustomdef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsCustomdef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsCustomdef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsCustomdef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsCustomdef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsCustomdef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsCustomdef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsCustomdef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsCustomdef_names[23] = "Speed Limit"; //"Missing or invalid speed limit";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsCustomURC_Text = [];
window.UrcommentsCustomURC_Text_tooltip = [];
window.UrcommentsCustomURC_USER_PROMPT = [];
window.UrcommentsCustomURC_URL = [];

//zoom out links
window.UrcommentsCustomURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsCustomURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsCustomURC_Text[1] = "Zoom Out 2 & Close UR";
window.UrcommentsCustomURC_Text_tooltip[1] = "Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsCustomURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsCustomURC_Text_tooltip[2] = "Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsCustomURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsCustomURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsCustomURC_Text[5] = "Comments";
window.UrcommentsCustomURC_Text[6] = "UR Filtering";
window.UrcommentsCustomURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsCustomURC_Text[8] = "Click here for Instructions";
window.UrcommentsCustomURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsCustomURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide=id.p";


window.UrcommentsCustomURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsCustomURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsCustomURC_Text[10] = "Enable UR pill counts";
window.UrcommentsCustomURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsCustomURC_Text[12] = "Hide Waiting";
window.UrcommentsCustomURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsCustomURC_Text[13] = "Only show my URs";
window.UrcommentsCustomURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsCustomURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsCustomURC_Text_tooltip[14] = "Show URs that other commented on that have gone past the reminder and close day settings added together";

window.UrcommentsCustomURC_Text[15] = "Hide URs Reminder needed";
window.UrcommentsCustomURC_Text_tooltip[15] = "Hide URs where reminders are needed";

window.UrcommentsCustomURC_Text[16] = "Hide URs user replies";
window.UrcommentsCustomURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsCustomURC_Text[17] = "Hide URs close needed";
window.UrcommentsCustomURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsCustomURC_Text[18] = "Hide URs no comments";
window.UrcommentsCustomURC_Text_tooltip[18] = "Hide URs that have zero comments";

window.UrcommentsCustomURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsCustomURC_Text_tooltip[19] = "Hide URs that do not have descriptions or comments";

window.UrcommentsCustomURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsCustomURC_Text_tooltip[20] = "Hide URs that have descriptions and zero comments";

window.UrcommentsCustomURC_Text[21] = "Hide Closed URs";
window.UrcommentsCustomURC_Text_tooltip[21] = "Hide closed URs";

window.UrcommentsCustomURC_Text[22] = "Hide Tagged URs";
window.UrcommentsCustomURC_Text_tooltip[22] = "Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsCustomURC_Text[23] = "Reminder days: ";

window.UrcommentsCustomURC_Text[24] = "Close days: ";

//settings tab
window.UrcommentsCustomURC_Text[25] = "Auto set new UR comment";
window.UrcommentsCustomURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsCustomURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsCustomURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsCustomURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsCustomURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsCustomURC_Text[28] = "Auto center on UR";
window.UrcommentsCustomURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsCustomURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsCustomURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsCustomURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsCustomURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsCustomURC_Text[31] = "Auto close comment window";
window.UrcommentsCustomURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsCustomURC_Text[32] = "Auto reload map after comment";
window.UrcommentsCustomURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsCustomURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsCustomURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsCustomURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsCustomURC_Text_tooltip[34] = "Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsCustomURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsCustomURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsCustomURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsCustomURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsCustomURC_Text[37] = "Comment List";
window.UrcommentsCustomURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsCustomURC_Text[38] = "Disable done / next buttons";
window.UrcommentsCustomURC_Text_tooltip[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsCustomURC_Text[39] = "Unfollow UR after send";
window.UrcommentsCustomURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsCustomURC_Text[40] = "Auto send reminders";
window.UrcommentsCustomURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsCustomURC_Text[41] = "Replace tag name with editor name";
window.UrcommentsCustomURC_Text_tooltip[41] = "When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name";

window.UrcommentsCustomURC_Text[42] = "(Double Click)"; //double click to close links
window.UrcommentsCustomURC_Text_tooltip[42] = "Double click here to auto send - ";

window.UrcommentsCustomURC_Text[43] = "Dont show tag name on pill";
window.UrcommentsCustomURC_Text_tooltip[43] = "Dont show tag name on pill where there is a URO tag";


window.UrcommentsCustomURC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsCustomURC_USER_PROMPT[1] = "UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsCustomURC_USER_PROMPT[2] = "List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsCustomURC_USER_PROMPT[3] = "URComments - You can not set close days to zero";

window.UrcommentsCustomURC_USER_PROMPT[4] = "URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled";

window.UrcommentsCustomURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsCustomURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsCustomURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsCustomURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsCustomURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsCustomURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsCustomURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question


//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsCustomArray2 = [
//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
"Incorrect turn", //6
"Hi. I am trying to review this report. Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Incorrect address", //7
"Hi. I am reviewing the report and Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!",
"Open",

"Incorrect route", //8
"Hi. I am reviewing the report and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Missing roundabout", //9
"Hi. I am reviewing the report and need some more information. Would you tell us as much as possible about the roundabout you believe is missing? Thanks!",
"Open",

"General error", //10
"Hi. I am trying to process this report and need some more information. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Turn not allowed", //11
"Hi. I am reviewing this report and do not have enough information. Would you please let us know which turn was or should not be allowed and why? Please specify the street names at the intersection. Thanks!",
"Open",

"Incorrect junction", //12
"Hi. I am trying to process your report and need some information. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Missing bridge overpass", //13
"Hi. I am trying to review the report you filed, and need some information. Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!",
"Open",

"Wrong driving direction", //14
"Hi. I am trying to review this report and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",


"Missing Exit", //15
"Hi. I am trying to review this report and Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!",
"Open",

"Missing Road", //16
"Hi. I do not have enough information to process this report. Would you tell us as much as possible about the road you believe is missing? Thanks!",
"Open",


"Missing Landmark", //18
"Hi. I am reviewing this report and need some information to review this report. Would you tell us as much as possible about the landmark you believe is missing? Thanks!",
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

"<br>",
"",
"",
//End of Default URs

"Reminder Message",
"Hi. We have not received any information about this report and will have to close it if we do not hear back soon. Thanks.",
"Open",

"Solved",
"Hi. Thank you for the report. We have corrected the issue and this change should be reflected to mobile devices within a few days, but could be up to a week. Thanks!",
"Solved",

"No Further Communication",
"Hi. We have not received any more information about this report and will now have to close it. Feel free to report any issues you encounter as you travel. Thanks!",
"NotIdentified",

"Close Report-Acknowledged",
"Hi. Thank you for the report. As you indicated, this request will be closed. As you travel, please feel welcome to report any map issues you encounter.",
"NotIdentified",

"Valid Left Turns-Slower/Right and Uturn",
"Hi! I have left a [NOTE] for Waze staff to address this the left turn avoidance in this situation. Thank you for the report!",
"Open",

"<br>",
"",
"",

"Place Address Adjustments",
"Hi. Thanks for the report. We have adjusted the appropriate addresses. This change should be reflected in the app within 48 hours, but can take up to a week. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Thanks!.",
"Solved",

"House Number Adjustment",
"Hi. I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow up to 48 hours for changes to be reflected in the app. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Thanks!",
"Solved",

"Road Closure-Added",
"Hi. Thank you for the report. We have added the road closure and will close the report. Feel free to report any other issues you encouner as you travel. Thanks!",
"Solved",

"Missing Place-Added",
"Hi. Thank you for reporting a missing place. I have added the location to the map and it should appear as a seach result within mobile devices shortly. Thanks!",
"Solved",

"Camera Report-Added",
"Hi. I have added the camera to the map. This should reflect within 48 hours, but at times can take up to a week. Thanks!",
"Solved",

"<br>",
"",
"",

"Address Fishing",
"Hi. I was trying to review this report but need to know the starting or ending locations so I can correct this. Can you please tell me your starting and ending destination names were so I can assess this? Thanks!",
"Open",

"Errors-No Description",
"Hi. I am trying to review this report and Waze did not send us enough information to identify your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Camera Report-Location Fishing",
"Hi. I am trying to process this report. Can you tell me the intersection and direction in which the camera is located and is facing so I can add it? Thanks!",
"Open",

"<br>",
"",
"",

"Possible Solved Matter-Confirmation Reminder",
"Hi. I see that the problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks!",
"Open",

"Comment to Include Users Description",
"Hi. I am reviewing this report and see that you reported \"$URD\" and Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

//selected segments requires the use of https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Comment to Include Selected Segments",
"Hi. I am reviewing the report and see that you reported a problem near $SELSEGS, Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Wrong Street Name",
"Hi. I am reviewing this report and Waze did not send us enough information to review your request. Would you please let us know which street name you think is wrong and what it should be? Thanks",
"Open",

"User Followed Waze's route",
"Hi. In reviewing the report, it appears that you followed the route Waze suggested. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
"Open",

"Road Closed",
"Hi. I am working to get this closure added. Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!",
"Open",

"Area Entrances",
"Hi. Thank you for the report. We have had problems with Google pins being placed in the center of large landmarks. Delete your previous search and do a new search for the location. Go to the bottom of the auto fill list to see more results and make sure you pick the Waze search engine.",
"Open",

"48 Hour Reply",
"Hi. The change should be reflected in the mobile app within 48 hours. Thanks!",
"Open",

"Clear Saved Locations",
"Hi. It seems you need to clear your history to get an updated result. Try remove the location from your navigation history and then search for the location again.",
"Open",

"Address - Incorrect Position",
"Hi. I need some more information to update the location. Can you tell us the address or if you can revisit visit the location, please show us the correct position by using the Report > Places feature. Before you save move the pin as close as possible to the entrance. Please do not submit pictures containing faces, license plates, or personal details. Thanks!",
"Open",

"Address - Missing",
"Volunteer responding - Would you let us know the address that is missing? The available resources do not have the address available for your location. You can also use the Report > Places feature in Waze to mark the location. Before you save move close as possible to the entrance. Do not submit pictures containing faces, license plates, or personal details. Thanks!",
"Open",

"Address - Bad Results",
"Hi. This is caused by Waze pulling a bad Google search pin. Can you tell me your destination as you entered it so I can investigate? Thanks!",
"Open",

"Missing Bridges or Roads",
"Hi. In reviewing this report, the roads for this area are thoroughly mapped and the volunteer editors cannot find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!",
"Open",

"Map Refresh",
"Please try doing these options. Go to Settings -> Advanced -> Refresh Map Of My Area. Secondly, you can try clearing Waze's app cache in your phone’s app manager. The final option is to reset the app by going to the navigation screen and type ##@resetapp in search field and hit search.",
"Open",

"Pave Road",
"Hi. You can pave the road from the app by tapping the Pin icon > Map Issue > Pave Road tab. After leaving the paved road, tap Start paving. Once done, tap the Steamroller > Stop paving. You can provide information about the new road such as its name by tapping on the Pin icon > Map Issue > Missing Road. Thanks!",
"Open",

"Report Reviewed/In Process/Unlock Required",
"Hi. I have started the process to get this issue fixed. Thanks for your report!",
"Open",

"Undo and Open",
"",
"Open",

"<br>",
"",
"",

"Address in Correct Location",
"Hi. The live map is showing that this location is in the correct location. Please delete all instances of this location from your search and history or you might be routed to the old coordinates. Thanks!",
"NotIdentified",

"App Bug",
"Hi. Thank you for the report. Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to https://support.google.com/waze/answer/6276841",
"NotIdentified",

"Bad GPS",
"Hi. In reviewing this report, I noticed that your device was having GPS trouble. GPS signals do not travel through vehicles or tall buildings. Please make sure your device is somewhere with a clear view of the sky.",
"NotIdentified",

"Valid Route",
"Hi. I have reviewed the issue and did not find any map errors. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, as it may turn out to actually be faster. If not you'll be teaching Waze that that route is slower, and the faster route will become preferred.",
"NotIdentified",

"Valid Left turns-Difficult",
"Hi. Sadly, We cannot disable legal turns only because they are difficult. If you wait and complete the left turn, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting left turns at that intersection. We also suggest if you do not feel comfortable making such left turns, you can always go another route and let Waze recalculate.",
"NotIdentified",

"Valid Route-Difficult",
"Hi. Thank you for the report; however, we cannot disable legal routes only because they are difficult. If you wait and complete the route, it may actually be faster than the alternative. If it’s not faster, your wait time will contribute to Waze’s database, thus helping to discourage the routing server from suggesting the route. We also suggest if you do not feel comfortable, you can always go another route and let Waze recalculate.",
"NotIdentified",

"Missing Place-In App",
"Hi. Thank you for reporting a missing place.  Anytime you find a a place that is missing from the waze app you can add it from the app by tapping the Pin icon > Place. After taking a picture of the place please add as many details as you can. Thanks!",
"NotIdentified",

"Detours / Odd-Routing",
"Hi. I have reviewed this report and sadly we can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors cannot be helpful in this situation. Thanks!",
"NotIdentified",

"Overall Waze complaint",
"Hi. I am sorry for the bad experience. You can help make Waze better by reporting problems as you find them. Please include as many details as possible? Thanks!",
"NotIdentified",

"U-turns",
"Hi. Thank your for the report. As of yet, Waze will not tell you to make a \"U-turn\". It will route you in several left turns to effectively create a U-turn. This is a programming issue that cannot be changed by the volunteer map editors. We understand that Waze is working on a fix. Thanks!",
"NotIdentified",

"Traffic - Stale User Reported Jams",
"Hi. Thank you for the report. We cannot remove traffic jams as those are determined real time. Those will eventually be cleared as traffic begins to move at normal pace. Thanks!.",
"NotIdentified",

"Traffic - Adding User Reported Jams",
"Hi. Thanks for the report. We cannot add traffic james. To report a traffic jam please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. Thanks!",
"NotIdentified",

"Restriction-Existing",
"Hi. I noticed that this restriction is already included in the map, so Waze should not route through this illegal turn. If Waze ever gives you a route through a restricted turn, please send another Map Issue report at that time. Thanks!",
"NotIdentified",

"1000 mile limit",
"Hi. Sadly, the current search and navigation capabilities of Waze are limited to 1000 miles. When driving further than that distance you will need to select a destination less than 1000 miles as your temporary destination.",
"NotIdentified",

"Clear TTS Cache",
"Hi. This appears to be an issue with your TTS. Please clear your Text-to-Speech cache. In the navigate search box type cc@tts in the search field and press search. You will get a message that the TTS file has been cleared. Your TTS cache we be re-populated as you use routing.. Thanks!",
"NotIdentified",

"<br>",
"",
"",

"Report to Local Authority/DOT/Police",
"Hi. This is not a map issue, so us editors cannot be of much assistance. This should be reported to the local transportation authority or your local municipality. Thanks!",
"NotIdentified",

"Express Lanes-Timing/Complaint",
"Hi. Thank you for the report. However, we only set closures for what the agency issues for gate times. Sometimes these vary from when they actually open. (Sometimes by a minute or two) This is not an issue that we can resolve, and needs to be referred to the Express Lanes. They may be reached at: 1-855-495-9777. Thanks!",
"NotIdentified",

"Express Lanes Not Mapped",
"Hi.The Express Lanes are mapped correctly. Sometimes the speed data is corrupted by users ignoring a route to the Express Lanes and sitting in slower standard traffic. This is usually corrected by the second entrance. Thanks!",
"NotIdentified",

"No EZPass-General",
"Hi. Thank you for your report. While Waze attempts to route you to your destination efficiently, it does not know if you have an E-Z Pass Toll Transponder.  We are very sorry to say that the volunteer map editors cannot be much help here. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
"NotIdentified",

"No EZPass-Avoid Tolls",
"Hi. Thanks for the report. While Waze attempts to route you to your destination efficiently, it does not know if you have an E-Z Pass Toll Transponder. To avoid tolls, there is an option under Settings > Navigation or after clicking GO tap Routes and select one without gold coins (iphone) or toll (android). Thanks!",
"NotIdentified",

"Not Using HOV",
"Hi. Thanks for your report. I see that you were expecting to be routed to an HOV lane. Waze does not have the ability to know you meet the HOV criteria. Driving into the HOV lane should force Waze to recalculate your route. Afterwards you should be allowed to stay in the HOV lane. Thanks!",
"NotIdentified",

"<br>",
"",
"",


"Temporary Road Closure-Blockage/MVA",
"Hi. Sadly, we cannot add live reports. If this is caused by an accident. please report Traffic and Accident. If the road is completely blocked, use the Report > Closure feature for you and others to be rerouted around it. At a minimum Waze is learning that that route is slower, and a faster route will become preferred.",
"NotIdentified",

"Temporary Road Closure-Added",
"Hi. We have added the appropriate closure. Thank you for the report. Feel free to report any other problems you encounter as you travel. Thanks. ",
"Solved",

"Temporary Road Closure-Fishing",
"Hi. I have opened the process to get this closure added. Do you know how long the road is going to be closed? Thanks!",
"Open",

"Temporary Road Closure-Train Crossing",
"Hi. Waze does not know if a train is passing. The best option is to either stay and wait for the train to pass so Waze can gather the data from the delay, or to drive in another direction or allow Waze to recalculate. Sorry for the trouble this may have caused. Please feel free to report any other issues you encounter on your drives. Thank you.",
"NotIdentified",

"Closure-Clearance",
"Hi. I have cleared this closure. Thank you for the report, and feel free to report any other issues you encounter as you travel. Thanks!",
"Solved",

"<br>",
"",
"",


"<br>",
"",
"",

"Idaho-Day 0",
"Hi. My name is Matthew and I am a volunteer map editor. I am working to resolve the error report you submitted recently. Can you please give me some more information so I can resolve this? I'll need a response back within 7 days and please use the app inbox instead of the email as we will not be able to see a reply to the unmonitored email.\n\nThanks!\n\nMatthewStarbuck\n\n~Area Manager\n\nNorthern Idaho",
"Open",

"Idaho Reminder",
"Hi. Sorry to bother you again, but we have not received a response from you as to the error you encountered. Please reply via the app inbox within 24 hours or we will have to close the report. \n\nThanks!\n\nMatthewStarbuck\n\n~Area Manager\n\nNorthern Idaho",
"Open",

"Idaho Closure-No Response",
"Hi. Unfortunately, we have not received any information as to this report and I will have to close it now. Please feel free to report any other errors you encounter as you travel. \n\nThanks!\n\nMatthewStarbuck\n\n~Area Manager\n\nNorthern Idaho",
"NotIdentified",

];
//end Custom list