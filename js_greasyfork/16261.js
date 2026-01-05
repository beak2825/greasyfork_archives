// ==UserScript==
// @name           WME URComments Malaysian List
// @description    This script is for custom comments in Malaysia with 3 major languages
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.1.8
// @match          https://beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor/*
// @match          https://www.waze.com/*/editor*
// @match          https://www.waze.com/*editor*
// @author         Rick Zabel '2014(origin) Rising_Sun '2015(M'sian)
// @license        MIT/BSD/X11
// @icon
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/16261/WME%20URComments%20Malaysian%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/16261/WME%20URComments%20Malaysian%20List.meta.js
// ==/UserScript==

var UrcommentsMalaysianVersion = GM_info.script.version;
var UrcommentsMalaysianUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsMalaysianVersionUpdateNotes = "URC Malaysian List has been updated to " + UrcommentsMalaysianVersion;
UrcommentsMalaysianVersionUpdateNotes = UrcommentsMalaysianVersionUpdateNotes + "\n" + "\n" + "Thank you for using the WME URComments Malaysian List (URCM)." + "\n" + "Both WME URComments (Stable) & URCM are now moved to WME URComments-Enhanced (URC-E), to continue using the URCM please install the URC-E at here :-" + "\n" + "\n" + "https://greasyfork.org/en/scripts/375430-wme-urcomments-enhanced";

if (UrcommentsMalaysianUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsMalaysianVersion') !== UrcommentsMalaysianVersion) {
        alert(UrcommentsMalaysianVersionUpdateNotes);
        localStorage.setItem('UrcommentsMalaysianVersion', UrcommentsMalaysianVersion);
    }
}
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\r\rLine2",
//if you wish to have text on the next line with no spaces in your message use \r. example "Line1\rLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up" (in Malaysianlist is "Reminder message")
window.UrcommentsMalaysianReminderPosistion = 21;

//this is the note that is added to the the reminder link (option currently not in use)
window.UrcommentsMalaysianReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response" (in Malaysian list is "No reply close message")
window.UrcommentsMalaysianCloseNotIdentifiedPosistion = 33;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area!
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsMalaysiandef_names = [];
window.UrcommentsMalaysiandef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsMalaysiandef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsMalaysiandef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsMalaysiandef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsMalaysiandef_names[10] = "General error"; //"General error";
window.UrcommentsMalaysiandef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsMalaysiandef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsMalaysiandef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsMalaysiandef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsMalaysiandef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsMalaysiandef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsMalaysiandef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsMalaysiandef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsMalaysiandef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsMalaysiandef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsMalaysiandef_names[23] = "Speed Limit"; //"Missing or invalid speed limit";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsMalaysianURC_Text = [];
window.UrcommentsMalaysianURC_Text_tooltip = [];
window.UrcommentsMalaysianURC_USER_PROMPT = [];
window.UrcommentsMalaysianURC_URL = [];

//zoom out links
window.UrcommentsMalaysianURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsMalaysianURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsMalaysianURC_Text[1] = "Zoom Out 2 & Close UR";
window.UrcommentsMalaysianURC_Text_tooltip[1] = "Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsMalaysianURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsMalaysianURC_Text_tooltip[2] = "Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsMalaysianURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsMalaysianURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsMalaysianURC_Text[5] = "Comments";
window.UrcommentsMalaysianURC_Text[6] = "UR Filtering";
window.UrcommentsMalaysianURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsMalaysianURC_Text[8] = "Click here for Instructions";
window.UrcommentsMalaysianURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsMalaysianURC_URL[8] = "http://tiny.cc/TutorialURC";


window.UrcommentsMalaysianURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsMalaysianURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsMalaysianURC_Text[10] = "Enable UR pill counts";
window.UrcommentsMalaysianURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsMalaysianURC_Text[12] = "Hide Waiting";
window.UrcommentsMalaysianURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsMalaysianURC_Text[13] = "Only show my URs";
window.UrcommentsMalaysianURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsMalaysianURC_Text[14] = "Show others URs past reminder + close";
window.UrcommentsMalaysianURC_Text_tooltip[14] = "Show URs that other commented on that have gone past the reminder and close day settings added together";

window.UrcommentsMalaysianURC_Text[15] = "Hide URs Reminder needed";
window.UrcommentsMalaysianURC_Text_tooltip[15] = "Hide URs where reminders are needed";

window.UrcommentsMalaysianURC_Text[16] = "Hide URs user replies";
window.UrcommentsMalaysianURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsMalaysianURC_Text[17] = "Hide URs close needed";
window.UrcommentsMalaysianURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsMalaysianURC_Text[18] = "Hide URs no comments";
window.UrcommentsMalaysianURC_Text_tooltip[18] = "Hide URs that have zero comments";

window.UrcommentsMalaysianURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsMalaysianURC_Text_tooltip[19] = "Hide URs that do not have descriptions or comments";

window.UrcommentsMalaysianURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsMalaysianURC_Text_tooltip[20] = "Hide URs that have descriptions and zero comments";

window.UrcommentsMalaysianURC_Text[21] = "Hide Closed URs";
window.UrcommentsMalaysianURC_Text_tooltip[21] = "Hide closed URs";

window.UrcommentsMalaysianURC_Text[22] = "Hide Tagged URs";
window.UrcommentsMalaysianURC_Text_tooltip[22] = "Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsMalaysianURC_Text[23] = "Reminder days: ";

window.UrcommentsMalaysianURC_Text[24] = "Close days: ";

//settings tab
window.UrcommentsMalaysianURC_Text[25] = "Auto set new UR comment";
window.UrcommentsMalaysianURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsMalaysianURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsMalaysianURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsMalaysianURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsMalaysianURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsMalaysianURC_Text[28] = "Auto center on UR";
window.UrcommentsMalaysianURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsMalaysianURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsMalaysianURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsMalaysianURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsMalaysianURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsMalaysianURC_Text[31] = "Auto close comment window";
window.UrcommentsMalaysianURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsMalaysianURC_Text[32] = "Auto reload map after comment";
window.UrcommentsMalaysianURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsMalaysianURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsMalaysianURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsMalaysianURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsMalaysianURC_Text_tooltip[34] = "Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsMalaysianURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsMalaysianURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsMalaysianURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsMalaysianURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsMalaysianURC_Text[37] = "Comment List";
window.UrcommentsMalaysianURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsMalaysianURC_Text[38] = "Disable done / next button";
window.UrcommentsMalaysianURC_Text_tooltip[38] = "Disable the done / next button at the bottom of the new UR window";

window.UrcommentsMalaysianURC_Text[39] = "Unfollow UR after send";
window.UrcommentsMalaysianURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsMalaysianURC_Text[40] = "Auto send reminders";
window.UrcommentsMalaysianURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsMalaysianURC_Text[41] = "Replace tag name with editor name";
window.UrcommentsMalaysianURC_Text_tooltip[41] = "When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name";

window.UrcommentsMalaysianURC_Text[42] = "(Double Click)"; //double click to close links
window.UrcommentsMalaysianURC_Text_tooltip[42] = "Double click here to auto send - ";

window.UrcommentsMalaysianURC_Text[43] = "Dont show tag name on pill";
window.UrcommentsMalaysianURC_Text_tooltip[43] = "Dont show tag name on pill where there is a URO tag";


window.UrcommentsMalaysianURC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsMalaysianURC_USER_PROMPT[1] = "UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsMalaysianURC_USER_PROMPT[2] = "List can not be found you can find the list and instructions at http://tiny.cc/URCScript";

window.UrcommentsMalaysianURC_USER_PROMPT[3] = "URComments - You can not set close days to zero";

window.UrcommentsMalaysianURC_USER_PROMPT[4] = "URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled";

window.UrcommentsMalaysianURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsMalaysianURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsMalaysianURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsMalaysianURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsMalaysianURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsMalaysianURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsMalaysianURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question


//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Malaysian list
window.UrcommentsMalaysianArray2 = [


"<br>",
"",
"",

"No further communication",
"No further information was received and this request is being closed. If you still want to provide information, please join our Facebook group: Waze Malaysia. Thanks!\r没有进一步的讯息，这请求已截止了。如果你仍然想提供信息，请加入我们的面子书组：Waze Malaysia。谢谢！\rTiada maklumat lanjut diterima, permintaan ini sudah ditutup. Jika saudara/saudari masih ingin memberi maklumat, sila sertai kumpulan Facebook: Waze Malaysia. Terima kasih!\r\rtiny.cc/FbWazeMY",
"Solved",

"Fixed",
"Thanks for the report we've fixed a problem with the map. The fix should reach handheld devices within a few days (Please check the 'INTL Map Tile' at Waze Status).\r感谢您的呈报，我们已经修复了有关的地图问题。此修复程序应该会在几天内到达您的手持设备，(请参阅Waze Status里的“INTL Map Tile”)。\rTerima kasih atas laporan saudara/saudari, kami telah menyelesaikan masalah peta di sini. Penyelesaian ini akan sampai ke peranti pegangan saudara/saudari dalam beberapa hari (Sila semak 'INTL Map Tile' di Waze Status).\r\rtiny.cc/MTUstatus\r\rVolunteer Waze Map Editor",
"Solved",

"Address Adjustments",
"Thanks! The address has been adjusted. This should reach mobile devices within a few days. (Please check the 'INTL Map Tile' at Waze Status)\r谢谢！地址已调整了。这应该会在几天内到达您的手持设备。(请参阅Waze Status里的“INTL Map Tile”)\rTerima kasih！ Alamat sudah dibetulkan. Ini akan sampai ke peranti pegangan saudara/saudari dalam beberapa hari. (Sila semak 'INTL Map Tile' di Waze Status)\r\rtiny.cc/MTUstatus",
"Solved",

"Address in correct spot",
"The live map is currently showing the place in the correct spot. Please remove any instance of this place from the history and favorites. Then search for the place. If you don't remove the old results from your navigation or favorites, you will continue to be routed to the old coordinates.\rHappy Wazing.\r这地方呈现在实况地图的位置是正确。请把这个地方从搜寻的历史记录及收藏夹删除。然后再搜索这个地方。如果没有删除导航里的历史记录或在收藏夹里旧的结果，你会被导航至老的坐标。\r“智途”愉快。\rPeta Nyata menunjukkan tempat ini di lokasi yang betul. Sila padamkan tempat ini daripada sejarah carian dan direktori kegemaran. Kemudian mencari tempat tersebut sekali lagi. Jika tempat tersebut tidak dipadamkan daripada sejarah carian atau direktori kegemaran, saudara/saudari akan terus dinavigasikan ke kedudukan yang lama.\rSelamat mengembara bersama Waze.",
"Solved",

"The road has been closed",
"Thank you for information. The road has been closed.\r感谢您的资讯。该路段已被关闭了。\rTerima kasih atas maklumat saudara/saudari. Jalan tersebut telah ditutup.\r\rVolunteer Waze Map Editor",
"Solved",

"Fixed Speed Limit",
"The missing/incorrect speed limit you reported has been updated. Thank you! The updated speed limit should reach handheld devices within a few days (Please check the 'INTL Map Tile' at Waze Status).\r您所呈报的时速限制已更新了。谢谢！已更新的时速限制应该会在几天内到达您的手持设备，(请参阅Waze Status里的“INTL Map Tile”)。\rHad laju yang saudara/saudari laporkan sudah dikemaskinikan. Terima kasih! Had laju tersebut akan sampai ke peranti pegangan saudara/saudari dalam beberapa hari (Sila semak 'INTL Map Tile' di Waze Status).\r\rtiny.cc/MTUstatus\r\rVolunteer Waze Map Editor",
"Solved", //karlcr9911 rickzabel

"Address fishing",
"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!\r由于位智没有提供您的起点与终点，您能告诉我们您键入位智导航系统的目的地吗？谢谢！\rWaze tidak membekalkan titik permulaan dan destinasi saudara/saudari. Bolehkah saudara/saudari beritahu kita apakah destinasi yang saudara/saudari masukkan ke dalam Waze? Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Errors with no text",
"Waze did not send us enough information to fix your request. Would you please let us know what is the error here? Would you tell us your destination as you entered it into Waze? Thanks!\r位智没有提供我们足够的信息来解决您的请求。请您让我们知道这里有什么错误？您能告诉我们您键入位智导航系统的目的地吗？谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami apakah kesilapan di sini? Apakah destinasi yang saudara/saudari masukkan ke dalam Waze? Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"Reminder message", //do not change (rickzabel)
"Just a reminder :\rWe volunteer have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!\r提醒：\r我们志愿人士还没有收到您的回应。如果这几天内还没有收到您的回应，我们将假设一切正常及截止报告。 谢谢！\rPeringatan : \rKami sukarelawan tidak menerima maklumbalas daripada saudara/saudari. Jika kami tidak menerima maklumbalas daripada saudara/saudari dalam beberapa hari ini, kami akan membuat kesimpulan semuanya ok dan menutup laporan itu. Terima kasih! ",
"Open",

"Temporary Road Closure",
"Do you know how long the road is going to be closed? For closures that last only a few days, the volunteer map editors cannot be of much help. It takes at least that long for our edits to make it to the live map! When you encounter short-term road closures in the future, please use the Report →Closure feature built into the Waze app. If this is a long-term closure, please respond and let us know as much as you can. Thanks!\r请问这道路将会关闭多久？对于只关闭几天的道路，地图志愿编辑人士不能给于太大的帮忙。我们的编辑也需要几天的时间才能到达实况地图！在未来，当您遇到短暂的道路关闭时，请使用位智应用程序的报告→道路关闭功能。如果这是一个长期的封路，请回复，并尽你所能提供我们更是详细的资料。谢谢！\rAdakah saudara/saudari tahu berapa lama jalan ini akan ditutup? Bagi penutupan jalan yang hanya berlanjutan beberapa hari sahaja, Penyunting Peta Sukarelawan tidak boleh banyak membantu. Suntingan kita juga mengambil masa beberapa hari untuk sampai ke peta nyata! Apabila saudara/saudari menghadapi penutupan jalan jangka masa pendek, sila gunakan ciri Laporan → Penutupan yang ada pada aplikasi Waze. Jika ini adalah penutupan jalan jangka masa panjang sila balas dan beritahu kami sebanyak yang mungkin. Terima kasih!",
"Open",

"Old URs (>30 days)",
"We are trying to catch up on some old map requests. We understand that it has been a very long time; but if you remember, please provide more details about the error you were reporting. Please note, if you do not respond within 3 days, this request will be closed. Thanks!\r我们正试图解决一些旧的地图请求。我们知道这已经是一个很长的时间；但是，如果你还记得，请您提供您报告的错误的详细信息。备注：如果您没有在3日内回复，这请求将被关闭。谢谢！\rKami sedang cuba untuk menyelesaikan beberapa permintaan peta yang lama. Kami memahami bahawa permintaan ini sudah ketinggalan sangat lama; tetapi jika saudara/saudari masih ingat, sila berikan butiran lanjut mengenai kesilapan yang saudara/saudari telah melaporkan. Sila ambil perhatian, jika tiada maklum balas daripada saudara/saudari dalam masa 3 hari, permintaan ini akan ditutup. Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Stale URs With Previous Contact Attempted",
"Hello, I’m another volunteer Map Editor. We're trying to catch up on some old map requests. We understand that it has been a very long time; but if you remember, please provide more details about the error or advise if it was already fixed? Please note, if you didn't respond within 3 days, this request will be closed. Thanks!\r你好，我是另一位地图志愿编辑人士。我们正试图解决一些旧的地图请求。我们知道这已经是一个很长的时间了；但是，如果你还记得，请您提供您详细信息，还是这里的错误已经修复了。备注：如果您没有在3日内回复，这请求将被关闭。谢谢！\rSalam sejahtera, saya adalah salah seorang penyunting peta sukarelawan. Kami sedang cuba untuk menyelesaikan beberapa permintaan peta yang lama. Kami memahami bahawa permintaan ini sudah ketinggalan sangat lama; tetapi jika saudara/saudari masih ingat, sila berikan butiran lanjut mengenai kesilapan yang saudara/saudari laporkan atau isu peta di sini sudah diperbaiki. Sila ambil perhatian, jika tiada maklum balas daripada saudara/saudari dalam masa 3 hari, permintaan ini akan ditutup. Terima kasih!",
"Open",

"No reply close message",
"The problem was unclear and volunteers didn't receive a response over 3 days, so we are closing this report. If you still want to provide information, please join our Facebook group: Waze Malaysia. Thanks!\r志愿人士无法确认这里的错误而且已超过了3天没有回应，这报告已截止了。如果你仍然想提供信息，请加入我们的面子书组：Waze Malaysia。谢谢！\rKesilapan di sini tidak dapat dikenalpasti dan sudah melebihi 3 hari sukarelawan tidak menerima maklumbalas, laporan ini sudah ditutup. Jika saudara/saudari masih ingin memberi maklumat, sila sertai kumpulan Facebook: Waze Malaysia. Terima kasih!\r\rtiny.cc/FbWazeMY",
"NotIdentified",

"App Bug",
"Unfortunately, In this situation, there is nothing wrong with the map that we can adjust to prevent issues with the app. Please report this to Waze Support\r很抱歉!在这种情况下，由于不是地图上的问题，我们无法做出任何调整来避免位智用户端应用程序上的问题。请把这状况呈报至位智支援\rMalangnya, dalam keadaan ini, tiada kesilapan pada peta yang kami dapat membetulkan untuk mengelakkan isu-isu yang berkaitan dengan aplikasi. Sila laporkan ini kepada Waze Support\r\rtiny.cc/WazeDebugLog",
"NotIdentified",

"Bad GPS",
"Base on your driving record, this is caused by the GPS Signal miss-alignment issue.\r根据您的驾驶报告，这是全球定位系统的误差所导致。\rBerdasarkan kepada rekod perjalan saudara/saudari, keadan ini adalah disebabkan oleh keralatan isyarat GPS.",
"NotIdentified",

"Valid Route",
"We didn't find any error on the map. It looks like Waze provided you with a valid route. Try the Waze suggested route a few times, it may turn out to actually be faster, if not you'll be teaching Waze that that route is slower, and the faster route will become preferred.\r在地图上我们没有发现任何错误 。看起来位智所提供的的路线是有效的。请多尝试位智所建议的路线几次，这可能是是最快的路线，如果不是，你会让位智知道这路线是比较慢的，那么更快的路线将会成为首选。\rKami tidak menjumpai apa-apa kesilapan pada peta. Kelihatan Waze mencadangkan laluan yang sah. Cubalah laluan cadangan Waze beberapa kali, laluan ini mungkin adalah laluan yang lebih cepat, jika bukan, saudara/saudari akan mengajar Waze bahawa laluan ini adalah lebih perlahan, dan laluan yang lebih cepat akan menjadi pilihan.\r\rVolunteer Waze Map Editor",
"NotIdentified",

"Detours / Odd-Routing",
"We can't find anything on the map to explain the route Waze gave you. Waze will route complex detours to save a few seconds. We are very sorry to say that map editors cannot be helpful in this situation. Thanks!\rFor your information Waze program is to avoid slow road. When Waze detect the road traffic is slow it will suggest an alternate road which are faster but may have long distance. The waiting time at the traffic light also can cause the detour.\r在地图上我们没有找到任何因素导致位智所提供给您的路线。位智的导航有时会为了节省几秒钟而提议复杂的绕道。很抱歉，地图编辑者无法在这种情况下有所帮助。谢谢！\r资讯：位智的程序是避开交通缓慢的道路。当位智检测到道路交通缓慢，它将提出一个更快到达目的地的替代道路，但可能距离会比较远。红绿灯前的等待时间也有可能造成绕道。\rDi peta, kami tidak dapat mengesan punca yang menyebabkan laluan cadangan Waze. Adakala Waze akan mencadangkan lencongan yang rumit untuk menjimatkan beberapa saat. Maaf untuk menyatakan bahawa peta editor tidak dapat membantu dalam situasi ini. Terima kasih! \rUntuk pengetahuan saudara/saudari, Waze diprogramkan untuk mengelakkan jalan yang perlahan. Apabila Waze mengesan lalulintas jalan raya lambat ia akan mencadangkan jalan alternatif yang lebih cepat tetapi mungkin mempunyai jarak lebih jauh. Masa menunggu di hadapan lampu isyarat juga bole menyebabkan lencongan.\r\rWaze Volunteer Map Editor",
"NotIdentified",

"Detours - No Traffic (Long)",
"We has checked the map and there are no errors which would cause this detour. The detour could be due to one or more of a few reasons.\r1) Waze thinks there is traffic or an incident up ahead and is trying to take you around it to save time. This traffic/incident may have already cleared up, but Waze will only know once wazer start driving through that segment at average speed.\r2) Based on historical traffic data for that time of day, Waze thinks that the other route will be faster. The only way to fix this is by wazer driving both routes and teaching Waze what the correct average speeds on those roads are. If this is always happening at the same place, try and take the suggested route a few times, to show Waze that it really is slower. (We know it's a detour, but it will help every Wazer in your area.)\r3) A Temporary Road Closure was reported along your route. Once enough wazers drive through the closure at highway speed, the closure will be cancelled.\r4) It may actually be a faster route. If you follow it once or twice (step 2) you can see for yourself.\rIf you followed these steps and the detour is still happening, please send us the report at our Facebook Group : Waze Malaysia. Thanks for your time, and Happy Wazing.\r\
我们已检测了地图，并且没有发现有任何错误会导致此绕道。这绕道可能是由以下因素所造成的。\r1）位智认为前方的道路有交通事故或塞车，并试图带您绕道以节省时间。此交通事故/塞车可能已不存在了，但是只有当智友以正常的车速通过此道路时，位智才会知道。\r2）根据那一整天的交通历史数据， 位智认为使用另一条道路会更快到达目的地。 解决这个问题的唯一方法是通过智友们使用这两条道路来让位智知道这些道路的正确平均速度。如果这绕道总是发生在同一个地方，尽量尝试建议的路线了几次，以让位智知道这绕道的路线确实是比较慢的路线。 （我们知道这是一个绕道，但这会帮助到在您区域的所有智友。）\r3）有智友在您的行驶道路上呈报了临时封路。当有足够的智友以高速的车速通过此道路时，临时封路将被取消。\r4）这绕道实际上可能是更快的路线。如果您尝试按照此路线行驶几次（步骤2）。\r如果尝试了以上的步骤后，还会发生绕道，请呈报至我们的面子书：Waze Malaysia。感谢您的时间及“智途”愉快。\r\
Kami sudah memeriksa peta dan tidak mengesan kesilapan yang boleh menyebabkan lencongan ini. Lencongan ini mungkin disebabkan oleh satu atau lebih daripada sebab-sebab di bawah. \r1) Waze sangka terdapat kesesakan atau kejadian di depan laluan saudara/saudari dan cuba membawa saudara/saudari mengekelilingnya untuk menjimatkan masa. Kesesakan / kejadian ini mungkin sudah tiada, tetapi Waze hanya akan tahu apabila pengguna Waze mula memandu melalui jalan tersebut dengan kelajuan yang biasa.\r2) Berdasarkan kepada sejarah data trafik untuk masa sehari tersebut, Waze berpendapat bahawa lencongan tersebut akan lebih cepat sampai ke destinasi. Satu-satunya penyelesaian adalah dengan pengguna Waze menggunakan kedua-dua laluan tersebut dan mengajar Waze kelajuan purata yang betul pada kedua-due jalan tersebut. Jika lencongan ini selalu berlaku di tempat yang sama, cuba  mengambil laluan yang dicadangkan beberapa kali, untuk menunjukkan Waze bahawa laluan tersebut memang lebih lambat untuk sampai ke destinasi. (Kami tahu ini adalah satu lencongan, tetapi ia akan membantu semua pengguna di kawasan saudara/saudari.)\r3) Terdapat pengguna Waze melaporkan penutupan jalan sementara sepanjang laluan saudara/saudari. Penutupan jalan ini akan dibatalkan setelah terdapat pengguna Waze yang cukup melaluinya dengan kelajuan biasa.\r4) Lencongan ini sebenarnya adalah laluan yang lebih cepat. Jika saudara/saudari mencuba laluan ini beberapa kali (langkah 2).\rJika saudara/saudari sudah mengikuti langkah-langkah diatas dan lencongan masih berlaku, sila hantar laporan kepada kumpulan Facebook kami : Waze Malaysia. Terima kasih atas masa saudara/saudari dan selamat mengembara bersama Waze.\r\rtiny.cc/FbWazeMY\r\rVolunteer Waze Map Editor",
"NotIdentified",

"Detours - Cause By Traffic Light",
"Thanks for the feedback! The weird detour is cause by the traffic light at the junction, when Waze detected the waiting time  infront of the traffic light is long enough, Waze routing server will avoid the traffic light.\r感谢您的回应！这个奇怪的绕道是由路口处的交通灯所导致的，当位智检测到在交通灯前的等待时间足够长时，位智导航服务器将会避开那交通灯。\rTerima kasih atas maklumbalas saudara/saudari! Lencongan yang pelik ini adalah disebabkan oleh lampu isyarat yang ada di persimpangan, apabila Waze mengesan masa menunggu di depan lampu isyarat cukup lama, Waze akan cuba mengelakkan lampu isyarat tersebut.",
"NotIdentified",

"Overall Waze complaint",
"You can help make Waze better by reporting problems as you find them. Please include as many details as possible. Thanks!\r您也可以为位智的地图出一份力。当您在地图上发现问题而呈报时，请提供详细的资料。谢谢！\rSaudara/saudari juga boleh membantu menjadikan Waze lebih baik dengan melaporkan masalah yang dijumpai pada peta. Sila sertakan maklumat sebanyak yang mungkin. Terima kasih!",
"NotIdentified",

"Traffic - Stale Information",
"Volunteer Map Editors are unable to remove the traffic jam report. You can help clear traffic reports by tapping 'not there' when prompted or by traveling through the intersection at normal speed. Happy Wazing.\r地图志愿编辑人士无法移除交通拥挤报告。您可以通过点击系统提示上的“不存在”按键，或以正常的速度通过那交叉路口帮助移除交通报告。“智途”愉快。\rPenyunting Peta Sukarelawan tidak dapat memadamkan laporan kesesakan lalu lintas. Saudara/saudari boleh membantu memadamkan laporan trafik tersebut dengan menekan 'tidak ada' apabila diminta atau melalui persimpangan tersebut dengan kelajuan yang biasa. Selamat mengembara bersama Waze.",
"NotIdentified",

"Traffic - Jams",
"To report a traffic jams please use the Waze app by clicking the pin in the lower right and then clicking Traffic Jam. Traffic Jam reports can help route you and other Wazers around traffic problems in real-time. “MAP ISSUE” button is to report map issue for Volunteer Map Editor to improve the Waze Map only, “MAP ISSUE” button unable to alert other Wazers about the traffic on the road.\r要呈报交通拥堵，请点击右下方的按键，然后单击交通拥堵。交通拥堵报告可以帮助您和其他智友避开交通拥堵的道路。 “地图问题”按键只是报告地图上的问题，以便地图志愿编辑人士可以改善位智的地图。“地图问题”按键是无法提示其他智友关于路上的交通拥挤。\rUntuk melaporkan kesesakan lalu lintas sila klik pin di sebelah kanan bahagian bawah aplikasi Waze dan kemudian klik Kesesakan Trafik. Laporan kesesakan Trafik boleh membantu saudara/saudari dan Wazers lain untuk mengelakkan lalu lintas yang sesak. Butang “ISU PETA” adalah untuk melaporkan isu di atas peta untuk Penyunting Peta Sukarelawan memperbaiki Peta Waze sahaja, butang “ISU PETA” ini tidak dapat memberi petunjuk kepada Wazer yang lain tentang kesesakan jalan.",
"NotIdentified",

"Navigation Button",
"The navigation button is on the bottom left of the Waze Map (The magnifier icon). \rThis “MAP ISSUE” button is to report map issue for Volunteer Map Editor to improve the Waze Map.\r导航按键位于位智地图的左下方（放大镜图标 ）。这个“地图问题”按键是报告地图上的问题，以便地图自愿编辑者可以改善位智的地图。\rButang navigasi berada di sebelah kiri bahagian bawah Peta Waze (Ikon kanta pembesar).\rButang “MASALAH PETA” ini adalah untuk melaporkan isu peta untuk Penyuntung Peta Waze memperbaiki Peta Waze.",
"NotIdentified",

"Traffic Light",
"Traffic light and stop signs didn't provide in Waze Map is because Waze does take traffic lights and stop signs into account by noting the effect they have on traffic speed. Consider a traffic light with long waiting times. The road segment leading to that traffic light will have a low average speed. If the average speed (based on the average waiting time) becomes low enough, a longer route that avoids the traffic light becomes the preferred route. This has been observed in practice and is an example of emergent behaviour. Waze isn't programmed to avoid traffic lights but it does avoid slow roads; if the traffic lights make the road slow then Waze avoids them.\rHappy Wazing.\r位智地图是没有标记交通灯和停车标志，因为考虑到交通灯和停车标志对交通速度的影响,位智会因路面的交通速度缓慢而避开交通速度缓慢的道路。（位智的程序不是避开交通灯而是避开交通速度缓慢的道路。）\r“智途”愉快。\rLampu isyarat dan papan tanda berhenti tidak ada dalam peta Waze adalah kerana lampu isyarat dan papan tanda berhenti boleh menyebabkan pergerakan kenderaan di atas jalan tersebut menjadi lambat. Waze akan mengelakkan jalan yang mempunyai pergerakan kenderaan perlahan. Waze tidak diprogramkan untuk mengelakkan lampu isyarat tetapi ia mengelakkan jalan perlahan; jika lampu isyarat membuat jalan itu bergerak perlahan, Waze akan mengelakkan penggunaan jalan tersebut.\rSelamat mengembara bersama Waze\r\rWaze Volunteer Map Editor",
"NotIdentified",

"Illegal U-turns",
//"Only legal U-Turn will be enable in Waze. \rAs state in Section 79(2) of the Road Transport Act 1987 (act 333) and the Road Traffic Rules 1959, a U-Turn is only allowed based on the displayed road sign. However, this rule is not enforced by the enforcement officers while carrying out their duty. Hence, you are reminded that making a U-Turn at places which do not display a U-Turn signage is an offence and can be liable to a fine of not more than RM500.\r在位智，我们只启动合法的U形转弯。\r在1987年陆路运输法案（法令333）第79（2）条文和1959年陆路交通条例，U型转弯只有在有U型转弯告示牌下才会被允许。然而，这条例不会实行在正在执法的执法人员。因此，请注意，在没有U型转弯告示牌的路口做U型转弯即属违规，可以罚款不超过500令吉。\rDi Waze, kita cuma akan menghidupkan pusingan U yang sah.\rSeperti yang dinyatakan dalam Akta Pengangkutan Jalan 1987 (Akta 333) Seksyen 79 (2)  dan Peraturan Lalu Lintas Jalan 1959, Pusingan U hanya dibenarkan jika terdapat papan tanda pusingan U dipaparkan. Walau bagaimanapun, peraturan ini tidak dikuatkuasakan ke atas pegawai penguatkuasa yang sedang menjalankan tugas mereka. Oleh itu, saudara/saudari diingatkan bahawa membuat Pusingan U di tempat-tempat yang tidak ada papan tanda Pusingan U adalah satu kesalahan dan boleh didenda tidak melebihi RM500.",
"Only legal U-Turn will be enable in Waze. \rAs state in Section 79(2) of the Road Transport Act 1987 (act 333) and the Road Traffic Rules 1959, an U-Turn is only allowed based on the displayed road sign.  Hence, you are reminded that making a U-Turn at places which do not display an U-Turn signage is an offence and can be liable to a fine of not more than RM500.\r在位智，我们只启动合法的U形转弯。\r在1987年陆路运输法案（法令333）第79（2）条文和1959年陆路交通条例，U型转弯只有在有U型转弯告示牌下才会被允许。因此，请注意，在没有U型转弯告示牌的路口做U型转弯即属违规，可以罚款不超过500令吉。\rDi Waze, kita cuma akan menghidupkan pusingan U yang sah.\rSeperti yang dinyatakan dalam Akta Pengangkutan Jalan 1987 (Akta 333) Seksyen 79 (2)  dan Peraturan Lalu Lintas Jalan 1959, Pusingan U hanya dibenarkan jika terdapat papan tanda pusingan U dipaparkan. Oleh itu, saudara/saudari diingatkan bahawa membuat Pusingan U di tempat-tempat yang tidak ada papan tanda Pusingan U adalah satu kesalahan dan boleh didenda tidak melebihi RM500.",
"NotIdentified",

"Temporary road blockage",
"If the road is completely blocked, use the Report → Closure feature for you and others to be rerouted around it. Otherwise please use Report → Traffic. At a minimum Waze is learning that the route is slower, and a faster route will become preferred.\r如果道路被完全阻断，请使用报告→道路关闭功能，为您和其他智友重新规划路线以避开这段路。否则，请使用报告→交通堵塞。至少位智会知道，这路线是比较慢的，并且会以更快的路线作为首选。\rJika jalan disekat sepenuhnya, sila gunakan fungsi Laporan → Penutupan untuk saudara/saudari dan Wazer lain mengubah laluan bagi mengelakkan jalan tersebut. Kalau bukan, sila gunakan fungsi Laporan → Kesesakan. Sekurang-kurangnya Waze dapat belajar bahawa laluan tersebut adalah lebih perlahan, dan laluan yang lebih cepat akan menjadi pilihan.",
"NotIdentified",

"Temporary Road Closure",
"For closures that last only a few days, the volunteer map editors cannot be of much help. It takes at least that long for our edits to make it to the live map! When you encounter road closures in the future, please use the Report → Closure feature built into the Waze app. Thanks!\r对于只关闭几天的道路，地图志愿编辑人士不能给于太大的帮忙。我们的编辑也需要几天的时间才能到达实况地图！在未来，当您遇到短暂的道路关闭，请使用位智应用程序的报告→道路关闭功能。谢谢！\rBagi penutupan jalan yang hanya berlanjutan beberapa hari sahaja, Penyunting Peta Sukarelawan tidak boleh banyak membantu. Suntingan kita juga mengambil masa beberapa hari untuk sampai ke peta nyata! Apabila saudara/saudari menghadapi penutupan jalan pada masa akan datang, sila gunakan ciri Laporan → Penutupan yang ada pada aplikasi Waze. Terima kasih!",
"NotIdentified",

"Ride-Sharing Service Provider Issue",
"For the Ride-Sharing Service Provider, their wasn't using Waze Database for their search engine.  We not sure which database/resource the Ride-Sharing Service Provider are using. The Ride-Sharing Service Provider Driver App. will assign the destination in their search to Waze using Waze Deep Links API when their driver choose Waze as their navigation app. In the near future, to avoid the wrongly pinned coordinate/destination been assign to Waze App., you may need to inform the driver manually search for your destination in Waze.\r共车服务提供商的搜索引擎并不是使用位智的数据库。我们不确定共车服务提供商是使用哪个数据库/资源。当他们的司机选择位智作为他们的导航工具时，共车服务提供商的司机客户端应用程序将会把他们所搜索到的目的地通过位智深层链接应用程序接口分配至位智。在未来，为了避免错误的坐标/目的地被分配至位智，您可要求共车服务提供商的司机以手动的方式在位智中搜索您的目的地。\rEnjin carian yang digunakan oleh Pembekal Perkhidmatan Ride-Sharing bukan daripada Pangkalan Data Waze. Kami tidak pasti pangkalan data / sumber yang digunakan oleh Pembekal Perkhidmatan Ride-Sharing dalam carian dari mana.  Aplikasi Pemandu Pembekal Perkhidmatan Ride-Sharing akan memindahkan destinasi daripada carian mereka ke Waze melalui Waze Deep Links API apabila pemandu mereka memilih Waze sebagai aplikasi navigasi mereka. Di masa yang akan datang, untuk mengelakkan koordinat/destinasi yang salah disisipkan ke Aplikasi Waze,  saudara/saudari boleh memaklumkan kepada pemandu Pembekal Perkhidmatan Ride-Sharing  untuk mencari destinasi saudara/saudari secara manual di Waze.",
"NotIdentified",

"SLUR (Spam)", //Speed Limit Update Request
"Thanks for the report !\rDue to the spamming of Speed Limit Update Request (SLUR), WazeMY community no longer handle the SLUR in Waze Map Editor.\rFor speed limit update, please do request at our Facebook Group : Waze Malaysia. Thanks!\r\rtiny.cc/FbWazeMY\r\rVolunteer Waze Map Editor\r\r\r感谢你的呈报！\r由于时速限制更新请求常被滥发，马来西亚位智社群已不再处理位智地图编辑器中的时速限制更新请求。\r如需更新速度限制，请在我们的面子书群组：Waze Malaysia提出请求。 谢谢！\r\rtiny.cc/FbWazeMY\r\r位智地图志愿编辑员\r\r\rTerima kasih atas laporan saudara/saudari!\rDisebabkan berlakunya Permintaan Kemaskini Had Kelajuan (SLUR) remeh, komuniti WazeMY tidak lagi mengendalikan SLUR dalam Penyunting Peta Waze.\rUntuk kemaskini had laju, sila hantar permintaan di Kumpulan Facebook kami: Waze Malaysia. Terima kasih!\r\rtiny.cc/FbWazeMY\r\rPenyunting Sukarelawan Peta Waze",
"NotIdentified",

"Thanks for the reply",
"Thank you for the reply! This request will be closed. As you travel, please feel welcome to report any map issues you encounter. We invite you to join us at our Facebook Group : Waze Malaysia as a volunteer and together edit the map correctly.\rHappy Wazing.\r感谢您的回复！这个请求将被关闭。如您在旅途上有发现任何地图的问题，欢迎您呈报。我们在此邀请您参加我们的面子书：Waze Malaysia 成为一个志愿编辑人士，一起正确地编辑地图。\r“智途”愉快。\rTerima kasih atas maklumbalas saudara/saudari! Permintaan ini akan ditutup. Jika saudara/saudari menjumpai sebarang isu-isu peta semasa dalam perjalanan, sila laporkannya.Kami menjemput saudara/saudari untuk menyertai kami di Kumpulan Facebook kami: Waze Malaysia sebagai sukarelawan dan bersama-sama menyunting peta dengan betul.\rSelamat mengembara bersama Waze.\r\rtiny.cc/FbWazeMY",
"NotIdentified",

"No further communication",
"No further information was received and this request is being closed. If you still wanted to provide information, please join our Facebook Group: Waze Malaysia. Thanks!\r没有进一步的讯息，这请求已截止了。如果你仍然想提供信息，请加入我们的面子书组：Waze Malaysia。谢谢！\rTiada maklumat lanjut diterima, permintaan ini sudah ditutup. Jika saudara/saudari masih ingin memberi maklumat, sila sertai kumpulan Facebook: Waze Malaysia. Terima kasih!\r\rtiny.cc/FbWazeMY",
"NotIdentified", // same comment different action based off UR status

"U-turns",
"May I know what type of U-Turns signage is here ? Thanks!\r请问这里有那一类型的U形转弯告标示？谢谢！\rBolehkah saudara/saudari beritahu apakah jenis tanda Pusingan U yang ada di sini? Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Include Users Description",
"You reported \"$URD\", but we unable to identify the error. What can we improve?\r您呈报 \"$URD\"，但我们无法确认地图上的错误。请问有什么地方我们可以改进的吗？\rSaudara/saudari melaporkan \"$URD\", tetapi kami tidak dapat mengenal pasti kesilapan tersebut. Apakah yang kita boleh memperbaiki? \r\rVolunteer Waze Map Editor",
"Open",

//selected segments requires the use of https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Include Selected Segments Names",
"You reported a problem near $SELSEGS, but Waze did not send us enough information to fix your request. Could you give us more details? Thanks!\r您呈报在$SELSEGS附近有地图问题。但是位智没有提供我们足够的信息来解决您的请求。请您提供我们更详细的资料？谢谢！\rSaudara/saudari melaporkan terdapat kesilapan berdekatan $SELSEGS. Tetapi Waze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami maklumat yang lebih terperinci? Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"Wrong Street Name",
"Waze did not send us enough information to fix your request. Would you please let us know which street name you think is wrong and what it should be? Thanks\r位智没有提供我们足够的信息来解决您的请求。请您告诉我们哪条街道的名字错了和那街道的真正名称？\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Minta saudara/saudari beritahu kami jalan mana yang namanya salah dan nama sebenar jalan tersebut./r/rVolunteer Waze Map Editor",
"Open",

"Speed Limit", //23
"Please confirmed validity of the speed limit that has been reported. Thanks!\r请确认已呈报的时速限制有效性。谢谢！ \rSila sahkan kesahihan had laju yang telah dilaporkan. Terima kasih !\r\rVolunteer Waze Map Editor",
"Open", //rickzabel

"User Followed Waze's Route",
"Thanks for your report! It appears that you followed the route Waze suggested. Would you please tell us what went wrong? Thanks!\r感谢您的呈报！似乎你的路线与位智所建议的路线是一致的。请问这里出了什么问题？ 谢谢！\rTerima kasih atas laporan saudara/saudari! Nampaknya saudara/saudari mengikut jalan yang dicadangkan oleh Waze. Tolong beritahu kami apakah kesilapan di sini? Terima kasih! \r\rWaze Volunteer Map Editor",
"Open",

"Road Closed",
"Would you please let us know the following; What road is closed?; between which intersections is this road closed; Do you know how long this road is scheduled to be closed? Thanks!\r请您提供我们以下的资料;那里的道路被关闭？;这条道路的哪一个交叉点被关闭。你知道这条路预计关闭多长时间吗？谢谢！\rTolong beritahu kami maklumat berikut; Jalan mana yang ditutup ?; Antara persimpangan mana bagi jalan ini ditutup; Adakah saudara/saudari tahu berapa lama jalan ini dijadual tutup? Terima kasih!\r\rVolunteer Waze Map Editor !", //rickzabel 12/9/14
"Open",

"48 Hour Reply",
"We made some changes to the map, please allow up to 48 hours for the changes to be reflected on the live map.\r我们已在地图上作了一些修正，请等待48小时让已修订的部分到达实况地图。\rKami membuat beberapa perubahan pada peta, sila berikan masa selama 48 jam untuk perubahan tersebut sampai ke peta nyata.",
"Open",

"Clear Saved Locations",
"To get an updated result, remove the location from your navigation history and then search for the location again.\r要获得更新后的资讯,请把现有的位置从导航历史中删除,然后再从新搜索\rUntuk mendapatkan keputusan yang sudah dikemaskini, padamkan lokasi tersebut daripada sejarah navigasi saudara/saudari dan kemudian mencari lokasi tersebut sekali lagi.",
"Open",

"Address - Incorrect Position",
"Can you tell us the coordinate of the location? Or, if you can revisit, please show us the correct position by using the Report → Places feature. Before you save move as close as possible to the entrance. Please do not submit pictures containing faces, license plates, or personal details. Thanks!\r你能告诉我们坐标吗，或者你如果能重游那地点，请使用报告→的地方特色来告诉我们正确的位置。在保存之前将尽可能接近的入口。请不要提交含有脸，车牌，或个人资料照片。 谢谢！\rBolehkah saudara/saudari memberitahu kami koordinat atau jika saudara/saudari boleh melawat semula lokasi tersebut, sila tunjukkan kami kedudukan yang betul dengan menggunakan ciri Laporan→ Tempat. Sebelum saudara/saudari menyimpan bergerak sehampir mungkin ke pintu masuk. Sila jangan menghantar gambar yang mengandungi muka, plat lesen, atau butiran peribadi. Terima kasih!",
"Open",

"Address - Bad Results",
"Thanks for the information.\rSearch results in Waze are retrieved from numerous sources. After tapping search, scroll to the bottom and you will see options for other search engines. Please try a different option as another search engine might have the address you are looking for.\rIf the in-correct search result is from the Waze database, please help us correct it by using the “Suggest An Edit” button located at the sub-menu (...) of the Place Result Page.\rPlease refer the Youtube to identify the searched location is come from Waze or 3rd party database.\r\
感谢您的资讯。\r位智的搜索结果是从多个来源获取。轻敲搜索按键后，滚动至底部，您将看到其他搜索引擎的选项。请尝试不同的选择，其他的搜索引擎可能有您要寻找的地址。\r如错误的地点/地标是来自位智数据库，请用在地点页面里的子菜单(...)“建议修改”按键来帮助我们更正地点的讯息。谢谢！\r请参阅以下的Youtube来确认位智搜索结果是来自位智的数据库或第三方的数据库。\r\
Terima kasih atas maklumat saudara/saudari.\rHasil carian dalam Waze adalah daripada pelbagai sumber. Selepas menekan carian, Tatal ke bawah dan saudara/saudari akan menjumpai pilihan untuk enjin carian yang lain. Sila cuba pilihan yang lain, kerana enjin carian yang lain mungkin mempunyai alamat yang saudara/saudari cari. \rJika keputusan carian adalah daripada Pangkalan Data Waze, minta pertolongan saudara/saudari untuk membetulkannya dengan menggunakan butang “Sunting” yang berada di dalam sub-menu (…) mukasurat keputusan tempat tersebut.\rSila rujuk kepada Youtube di bawah untuk mengenal pasti lokasi carian tersebut adalah datang dari pangkalan data Waze atau dari pangkalan data pihak ke-3. \r\r\
youtu.be/BD2RhRoQW1E",
"Open",

"Missing Bridges or Roads",
"The roads for this area are thoroughly mapped and the volunteer editors cannot find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!\r这区域的道路已全都铺好了，志愿编辑人士无法在地图上找到任何缺失的东西。当在高速移动时，位智会刻意选择不显示附近的一些功能，以避免画面混乱。如果地图上真的缺失了某些功能，请回复并提供我们更详细的质料。 谢谢！\rKesemua jalan di kawasan ini sudah dipetakan dan penyunting peta sukarelawan tidak dapat mencari apa-apa yang hilang di peta. Apabila bergerak pada kelajuan lebuh raya, Waze akan memilih untuk tidak memaparkan beberapa ciri berdekatan untuk mengelakkan kesesakan skrin. Jika saudara/saudari pasti terdapat ciri-ciri yang hilang di peta, sila balas dan beritahu kami sebanyak mungkin mengenainya. Terima kasih!",
"Open",

"Turn Not Allow (Know Junction)",
"Thanks for the report! Would you please let us know why the turn is not allowed? Is this a temporary situation (e.g.: due to road works) or a permanent change? Thanks!\r感谢您的呈报! 请问为什么位智所提供的路口不允许转弯？这是暂时性的（例如：道路工程所导致）或是永久性的改变？谢谢！\rTerima kasih atas laporan saudara/saudari! Tolong beritahu kami mengapa pusingan di persimpangan yang dicadangakan oleh Waze tidak dibenarkan? Adakah keadaan ini sementara (contohnya: disebabkan kerja pembaikan jalan) atau perubahan ini adalah kekal? Terima kasih! \r\rVolunteer Waze Map Editor",
"Open",

"Pave Road",
"You can pave the road from the app by tapping the “Pin” icon → “Map Issue” → “Pave Road” tab. After leaving the paved road tap start paving. Once done tap the “steamroller” → “stop paving”. You can provide information about the new road such as it's name by tapping on the “Pin” icon → “Map Issue” → “Missing Road”. Thanks!\r您可以使用应用程序中的铺路功能来铺路，通过点击“图标”钉→“地图问题”→“铺路”标签。 在离开柏油路时点击开始铺路。一旦完成点击“挖掘压路机”→“停止铺路”。你可以点击“图标”钉→“地图问题”→“缺失道路”来提供新的道路信息，如道路的名称。谢谢！\rSaudara/saudari boleh menurap jalan dari app dengan memilih ikon “Pin” → “Isu Peta” → tab “Menurap Jalan”. Selepas melepasi jalan berturap klip mula pernurapan jalan. Setelah selesai klip “kenderaan berturap” → “berhenti berturap”. saudara/saudari boleh memberikan maklumat tentang jalan yang baru seperti nama jalan dengan memilih ikon “Pin” → “Isu Peta” → “Jalan Hilang”",
"Open",

"Map Not Shown",
"You may need to renew the map.\rSetting → General → Refresh map of my area\r请刷新您的地图。\r设置→通用→刷新我所在区的地图\rsaudara/saudari kena memperbaharui peta.\rSetelan → Umum → Segarkan peta area saya\r\rVolunteer Waze Map Editor",
"Open",

"Map Not Shown (Data Reconnection Issue)",
"Thanks for the report.\rWe're escalating this issue to Waze Infrastructure Team, but we need to collect more info from you first.\r1)Please enable Debug Mode on your Waze app (type 2##2 in Search).\r2)Send logs (please note the date and time of sending the logs).\r3)Please complete this form https://goo.gl/7Co88U. In the Permalink field, type none.\rFor more information, your may refer to here :-\rhttps://www.facebook.com/groups/WazeMY/permalink/1556111267777879/\r感谢您的呈报。\r我们正在与位智基础设施团队解决此问题，但我们需要从您那里收集更多的资讯。\r1）请在您的位智客户端应用程序上启用调试模式（在搜索中输入2 ## 2）。\r2）发送日志（请记住发送日志的日期和时间）。\r3）请填写此表格https://goo.gl/7Co88U。 在永久链接字段中，输入'none'。\r欲了解更多信息，你可以参考这里： -\rhttps://www.facebook.com/groups/WazeMY/permalink/1556111267777879/\rTerima kasih atas laporan saudara/saudari.\rKami sedang menyelesaikan masalah ini dengan Pasukan Infrastruktur Waze, tetapi kami perlu mengumpulkan lebih banyak maklumat daripada saudara/saudari terlebih dahulu.\r1)Sila aktifkan Mod Debug pada aplikasi Waze saudara/saudari (jenis 2 ## 2 dalam Carian).\r2)Hantar log (sila ambil perhatian tarikh dan masa penghantaran log).\r3)Sila lengkapkan borang ini https://goo.gl/7Co88U. Dalam medan Permalink, taipkan 'none'.\rUntuk maklumat lanjut, saudara/saudari boleh rujuk di sini: -\rhttps://www.facebook.com/groups/WazeMY/permalink/1556111267777879/\r\rVolunteer Waze Map Editor",
"Open",

"New Road Name Request",
"Thanks for the report. The missing road has just been paved. Are you able to provide us the road name?\r感谢您的呈报！缺失的道路已铺好了。请问能提供这道路的名称吗？\rTerima kasih atas laporan saudara/saudari. Jalan yang hilang sudah diturap. Adakah saudara/saudari dapat memberitahu nama jalan ini ?\r\rVolunteer Waze Map Editor",
"Open",

"No Foul Language",
"We volunteer map editor understand that it's fretful when Waze didn't route us correctly to our destination, but instead of release your dissatisfaction though the Map Update Request, it better to provide us the useful information for us to solve the error at your area. (Try to avoid foul language, cause we are helping you for free. ;) )\rFor your information, the Waze Map are fully maintain by volunteer which are also a Wazer like you, but we decide to spend our free time to maintain the Waze Map for the benefit of Malaysia Community.\r我们志愿地图编辑人士了解当位智无法正确的导航至我们所选的目的地时是多么懊恼的心情，与其在地图更新请求里释放您的不满，不如提供我们有用的资讯以解决您所在地区的错误。（尽量避免粗俗的字眼，因为我们给与您的服务是免费的。;)）\r顺便告知，位智地图是完全由志愿人士在维修的，我们也和您一样都是智友，但我们决定用我们的休闲时间来维修位智地图以便马来西亚社群能受益。\r Kami peta editor sukarelawan memahami kekecewaan saudara/saudari apabila Waze tidak dapat memberi laluan yang betul ke destinasi kita, tetapi adalah lebih baik saudara/saudari memberi maklumat yang berguna untuk kita menyelesaikan kesilapan di kawasan saudara/saudari daripada melepaskan kekecewaan saudara/saudari di Permintaan Memperbaharui Peta . (Cuba elakkan bahasa yang tidak sopan, sebab kami membantu saudara/saudari secara percuma. ;) ) \rUntuk maklumat saudara/saudari, penyelenggaraan Peta Waze adalah dilakukan sepenuhnya oleh sukarelawan yang juga  pengguna Waze seperti saudara/saudari, tetapi kami memilih untuk menggunakan masa lapang kami untuk penyelenggaraan Peta Waze bagi manfaat Komuniti Malaysia.",
"Open",

"Unlock request",
"Thanks for the report! The process of fixing this issue has begun.\r感谢您的呈报！这个问题正在修复中。\rTerima kasih atas laporan saudara/saudari! Proses memperbaiki isu ini sudah mula.\r\rVolunteer Waze Map Editor",
"Open",

"<br>",
"",
"",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks

"Incorrect turn", //6
"Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!\r请问您在那一个转弯遇到了问题? 您能告诉我们您键入位智导航系统的目的地吗？谢谢！\rTolong saudara/saudari beritahu kami pusingan mana yang saudara/saudari hadapi masalah? Apakah destinasi yang saudara/saudari memasukkan ke dalam Waze? Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Incorrect address", //7
"Waze didn't send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!\r位智没有提供我们足够的信息来解决您的请求。您能告诉我们您键入位智导航系统的目的地吗？请问您在这个地址遇到了什么问题？谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Apakah destinasi yang saudara/saudari memasukkan ke dalam Waze? Apakah masalah yang saudara/saudari hadapi di alamat ini ? Terima Kasih.\r\rVolunteer Waze Map Editor",
"Open",

"Incorrect route", //8
"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!\r位智没有提供我们足够的信息来解决您的请求。请您让我们知道位智所提供的路线有有什么错误？您能告诉我们您键入位智导航系统的目的地吗？谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami apakah kesilapan pada jalan yang dicadangkan oleh Waze? Apakah destinasi yang saudara/saudari memasukkan ke dalam Waze? Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"General error", //10
"Waze did not send us enough information to fix your request. Would you please let us know what is the error here?  Thanks!\r位智没有提供我们足够的信息来解决您的请求。请您让我们知道这里有什么错误？谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami apakah kesilapan di sini?  Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"Turn not allowed", //11
"Would you please let us know what turn was not, or should not be, allowed and the street names at the intersection? Thanks!\r请您让我们知道哪里不允许，或不应该有转弯，并提供我们那个路口的街道名称？谢谢！\rTolong beritahu kami simpang mana yang tidak dibenarkan atau tidak boleh buat pusingan, sila sertakan nama jalan yang berada di simpang tersebut? Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Incorrect junction", //12
"Thanks for the report! Waze did not send us enough information to fix your request. Would you please let us know what was wrong with the junction? Thanks!\r感谢您的呈报!  位智没有提供我们足够的信息来解决您的请求。请问位智所提供的路口有什么错误？谢谢！\rTerima kasih atas laporan saudara/saudari! Waze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami apakah kesilapan pada persimpangan yang dicadangkan oleh Waze? Terima kasih!\r\rVolunteer Waze Map Editor",
"Open",

"Missing bridge overpass", //13
"Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!\r请您让我们知道那一个立交桥缺失了？当在高速移动时，位智会刻意选择不显示附近的一些功能，以避免画面混乱。希望您能提供我们更详细的质料关于缺失的立交桥。谢谢！\rTolong beritahu kami jambatan mana yang saudara/saudari percaya hilang? Apabila bergerak pada kelajuan lebuh raya, Waze akan memilih untuk tidak memaparkan beberapa ciri berdekatan untuk mengelakkan kesesakan skrin. Saudara/saudari boleh memberitahu kita sebanyak mungkin mengenai jambatan yang hilang. Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"Wrong driving direction", //14
"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!\r位智没有提供我们足够的信息来解决您的请求。请您让我们知道位智所提供的路线有有什么错误？您能告诉我们您键入位智导航系统的目的地吗？谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari. Tolong beritahu kami apakah kesilapan pada jalan yang dicadangkan oleh Waze? Apakah destinasi yang saudara/saudari memasukkan ke dalam Waze? Terima kasih!\r\rWaze Volunteer Map Editor",
"Open",

"Missing Exit", //15
"Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!\r位智没有提供我们足够的信息来解决您的请求。请您尽可能提供出口缺失的详情。谢谢！\rWaze tidak membekalkan kami maklumat yang mencukupi untuk menyelesaikan permintaan saudara/saudari.Tolong beritahu kami sebanyak mungkin tentang jalan keluar yang hilang?\r\rVolunteer Waze Map Editor",
"Open",

"Missing Road", //16
"Would you tell us as much as possible about the road you believe is missing? Thanks!\r请您尽可能告诉我们更多关于道路缺失的详情。谢谢！\rSila beri keterangan yang lebih terperinci mengenai jalan yang saudara/saudari percaya hilang. Terima kasih.\r\rVolunteer Waze Map Editor",
"Open",

//End of Default URs

"<br>",
"",
"",

"Clears comment & sets UR status to Open",
"",
"Open"

];

//end Malaysian list



/* Changelog
  * 0.1.8   - URCM no longer maintained.
  * 0.1.7.1 - Spelling Correction : "Ride-Sharing Service Provider Issue"
  * 0.1.7   - Update Response : "Map Not Shown" ; New Response : "Speed Limit Update Request (Spam)"
  * 0.1.6.1 - Update Response : "Navigation Button" , "Ride-Sharing Service Provider Issue" , "Map Not Shown" ; Spelling Correction
  * 0.1.6   - New Response : "New Road Name Request" & Update Response : "Illegal U-Turn
  * 0.1.5.1 - New response : "Map Not Shown (Data Reconnection Issue)"
  * 0.1.5   - Update Response : "Address - Bad Results" ; minor text improvements ; New response : "Detours - Cause By Traffic Light" , "Uber & Grab Issue"
  * 0.1.4   - Update Response : "Address - Bad Results" , Update 'Waze In Malaysia' → 'Waze Malaysia' for all related response
  * 0.1.3.2 - Removed KVMR Response
  * 0.1.3.1 - New response : "KVMR Closing Comment - No reply close message" , "KVMR Closing Comment - Very Old URs"
  * 0.1.3   - Menggunakan panggilan yg lebih mesra & Updated to allow for new Waze URL
  * 0.1.2   - Improve "Speed Limit" & "Fixed Speed Limit" Response , Update Response "Address - Bad Results"
  * 0.1.1   - Minor code correction, Improve "Address Adjusments" Response, New Response "Fixed Speed Limit"; "Speed Limit"
  * 0.1.0   - Update new URL for WMEB
  * 0.0.9   - Improve "Illegal U-Turn" & "Fixed" Response
  * 0.0.8   - Spelling correction, New response : "Illegal U-Turn" , "Address - Bad Result" & "No Foul Language"
  * 0.0.7   - Shorten comment list & url; New response : "traffic light" & "detour - no traffic"; Added MTU status url
  * 0.0.6   - Helptext improvements, Improve & added new comment list, Added disabled next button
  * 0.0.5   - Technical improvement, Title change
  * 0.0.4   - Technical and lay-out improvements, minor text improvements
  * 0.0.3   - Technical  Improvements included GM_info.script.version
  * 0.0.2   - Technical Improvement
  * 0.0.1  - Initial version
 */