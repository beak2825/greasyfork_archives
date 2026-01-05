// ==UserScript==
// @name           WME URComments Lithuanian List
// @description    This script is for Lithuanian comments, to be used with the main script URComments.
// @namespace      zm0gis.waze@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.3
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/16528/WME%20URComments%20Lithuanian%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/16528/WME%20URComments%20Lithuanian%20List.meta.js
// ==/UserScript==

var UrcommentsLithuanianVersion = GM_info.script.version; 
var UrcommentsLithuanianUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsLithuanianVersionUpdateNotes = "URC Lithuanian List has been updated to " + UrcommentsLithuanianVersion;
UrcommentsLithuanianVersionUpdateNotes = UrcommentsLithuanianVersionUpdateNotes + "\n" + "-corrected background coding";

if (UrcommentsLithuanianUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsLithuanianVersion') !== UrcommentsLithuanianVersion) {
        alert(UrcommentsLithuanianVersionUpdateNotes);
        localStorage.setItem('UrcommentsLithuanianVersion', UrcommentsLithuanianVersion);
    }
}

/*
 * 0.0.3 - corrected background coding 
 * 0.0.2 - corrected coding to show full list
 * 0.0.1 - initial version, contact zm0gis.waze@gmail.com
 */
//I will try not to update this file but please ALWAYS KEEP AN EXTERNAL BACKUP of your comments. The main script might force and update to this file and than you will loose your custom comments. By making this a separate script, we try to limit how often this would happen, but be warned, it will eventually happen!
//if you are using quotes in your titles or comments, they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \r\r. example "Line1\r\rLine2",
//if you wish to have text on the next line with no spaces in your message use \r. example "Line1\rLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "Reminder"
window.UrcommentsLithuanianReminderPosistion = 12;

//this is the note that is added to the the reminder link (option not necessary at this moment)
window.UrcommentsLithuanianReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "Close without response"
window.UrcommentsLithuanianCloseNotIdentifiedPosistion = 18;

//This is the list of Waze's default UR types. edit this list to match the WME titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsLithuaniandef_names = [];
window.UrcommentsLithuaniandef_names[6] = "Neteisingas posukis"; //"Incorrect turn";
window.UrcommentsLithuaniandef_names[7] = "Neteisingas adresas"; //"Incorrect address";
window.UrcommentsLithuaniandef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsLithuaniandef_names[9] = "Trukstamas žiedas"; //"Missing roundabout";
window.UrcommentsLithuaniandef_names[10] = "Bendra klaida"; //"General error";
window.UrcommentsLithuaniandef_names[11] = "Posukis neleistinas"; //"Turn not allowed";
window.UrcommentsLithuaniandef_names[12] = "Neteisinga sankryža"; //"Incorrect junction";
window.UrcommentsLithuaniandef_names[13] = "Truksta tilto, viaduko"; //"Missing bridge overpass";
window.UrcommentsLithuaniandef_names[14] = "Bloga važiavimo kriptis"; //"Wrong driving direction";
window.UrcommentsLithuaniandef_names[15] = "Trukstamas išvažiavimas"; //"Missing Exit";
window.UrcommentsLithuaniandef_names[16] = "Trukstamas kelias"; //"Missing Road";
window.UrcommentsLithuaniandef_names[18] = "Trukstamas orientyras"; //"Missing Landmark";
window.UrcommentsLithuaniandef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsLithuaniandef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsLithuaniandef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsLithuanianURC_Text = [];
window.UrcommentsLithuanianURC_Text_tooltip = [];
window.UrcommentsLithuanianURC_USER_PROMPT = [];
window.UrcommentsLithuanianURC_URL = [];

//zoom out links
window.UrcommentsLithuanianURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsLithuanianURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsLithuanianURC_Text[1] = "Zoom Out 2 & Close UR";		
window.UrcommentsLithuanianURC_Text_tooltip[1] = "Zooms out to level 2 closes the UR window";

window.UrcommentsLithuanianURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsLithuanianURC_Text_tooltip[2] = "Zooms out to level 3 where I found most of the toolbox highlighting works and closes the UR window";

window.UrcommentsLithuanianURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsLithuanianURC_Text_tooltip[4] = "Number of UR Shown";

//tab names
window.UrcommentsLithuanianURC_Text[5] = "Comments";
window.UrcommentsLithuanianURC_Text[6] = "UR Filtering";
window.UrcommentsLithuanianURC_Text[7] = "Settings";

//UR Filtering Tab
window.UrcommentsLithuanianURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsLithuanianURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsLithuanianURC_Text[9] = "Enable URComments UR filtering";
window.UrcommentsLithuanianURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsLithuanianURC_Text[10] = "Enable UR pill counts";
window.UrcommentsLithuanianURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsLithuanianURC_Text[12] = "Hide Waiting";
window.UrcommentsLithuanianURC_Text_tooltip[12] = "Only show UR that need work (hide inbetween states)";

window.UrcommentsLithuanianURC_Text[13] = "Only show my UR";
window.UrcommentsLithuanianURC_Text_tooltip[13] = "Hide UR where there are zero comments from the logged in editor";

window.UrcommentsLithuanianURC_Text[14] = "Show others UR past reminder + close";
window.UrcommentsLithuanianURC_Text_tooltip[14] = "Show UR that have gone past the reminder and close day settings added together";

window.UrcommentsLithuanianURC_Text[15] = "Hide UR Reminders needed";
window.UrcommentsLithuanianURC_Text_tooltip[15] = "Hide UR where reminders are needed";

window.UrcommentsLithuanianURC_Text[16] = "Hide user replies";
window.UrcommentsLithuanianURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsLithuanianURC_Text[17] = "Hide UR close needed";
window.UrcommentsLithuanianURC_Text_tooltip[17] = "Hide UR that need closing";

window.UrcommentsLithuanianURC_Text[18] = "Hide UR no comments";
window.UrcommentsLithuanianURC_Text_tooltip[18] = "Hide UR that have zero comments";

window.UrcommentsLithuanianURC_Text[19] = "hide 0 comments without descriptions";
window.UrcommentsLithuanianURC_Text_tooltip[19] = "Hide UR that do not have descriptions or comments";

window.UrcommentsLithuanianURC_Text[20] = "hide 0 comments with descriptions";
window.UrcommentsLithuanianURC_Text_tooltip[20] = "Hide UR that have descriptions and zero comments";

window.UrcommentsLithuanianURC_Text[21] = "Hide Closed UR";
window.UrcommentsLithuanianURC_Text_tooltip[21] = "Hide closed UR";

window.UrcommentsLithuanianURC_Text[22] = "Hide Tagged UR";
window.UrcommentsLithuanianURC_Text_tooltip[22] = "Hide UR that are tagged with URO stle tags ex. [NOTE]";

window.UrcommentsLithuanianURC_Text[23] = "Reminder days: ";

window.UrcommentsLithuanianURC_Text[24] = "Close days: ";

//settings tab
window.UrcommentsLithuanianURC_Text[25] = "Auto set new UR comment";
window.UrcommentsLithuanianURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsLithuanianURC_Text[26] = "Auto set reminder UR comment";
window.UrcommentsLithuanianURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsLithuanianURC_Text[27] = "Auto zoom in on new UR";
window.UrcommentsLithuanianURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsLithuanianURC_Text[28] = "Auto center on UR";
window.UrcommentsLithuanianURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsLithuanianURC_Text[29] = "Auto click open, solved, not identified";
window.UrcommentsLithuanianURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsLithuanianURC_Text[30] = "Auto save after a solved or not identified comment";
window.UrcommentsLithuanianURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsLithuanianURC_Text[31] = "Auto close comment window";
window.UrcommentsLithuanianURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsLithuanianURC_Text[32] = "Auto reload map after comment";
window.UrcommentsLithuanianURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsLithuanianURC_Text[33] = "Auto zoom out after comment";
window.UrcommentsLithuanianURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsLithuanianURC_Text[34] = "Auto switch to the UrComments tab";
window.UrcommentsLithuanianURC_Text_tooltip[34] = "Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsLithuanianURC_Text[35] = "Close message - double click link (auto send)";
window.UrcommentsLithuanianURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsLithuanianURC_Text[36] = "All comments - double click link (auto send)";
window.UrcommentsLithuanianURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsLithuanianURC_Text[37] = "Comment List";
window.UrcommentsLithuanianURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsLithuanianURC_Text[38] = "Disable done / next buttons";
window.UrcommentsLithuanianURC_Text[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsLithuanianURC_Text[39] = "Unfollow UR after send";
window.UrcommentsLithuanianURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsLithuanianURC_Text[40] = "Auto send reminders";
window.UrcommentsLithuanianURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsLithuanianURC_Text[41] = "Replace tag name with editor names";
window.UrcommentsLithuanianURC_Text_tooltip[41] = "When a UR has the logged in editors name in it replace the tag type with the editors name";

window.UrcommentsLithuanianURC_Text[42] = "(DblClick)";
window.UrcommentsLithuanianURC_Text_tooltip[42] = "Double click here to auto send comment";

window.UrcommentsLithuanianURC_Text[43] = "Don't show tag name on pill";
window.UrcommentsLithuanianURC_Text_tooltip[43] = "Don't show tag name on pill where there is a URO tag";

window.UrcommentsLithuanianURC_USER_PROMPT[0] = "UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: ";

window.UrcommentsLithuanianURC_USER_PROMPT[1] = "UR Comments - you are missing the following items from your custom comment list: ";

window.UrcommentsLithuanianURC_USER_PROMPT[2] = "List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/Scripts/URComments";

window.UrcommentsLithuanianURC_USER_PROMPT[3] = "URComments you can not set close days to zero";

window.UrcommentsLithuanianURC_USER_PROMPT[4] = "URComments to use the double click links you must have the autoset UR status option enabled";

window.UrcommentsLithuanianURC_USER_PROMPT[5] = "Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsLithuanianURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsLithuanianURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsLithuanianURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsLithuanianURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send.";

window.UrcommentsLithuanianURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a user request open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsLithuanianURC_USER_PROMPT[11] = "URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. "; //conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//there is an example just after the "Clear comments" message

//if you are using quotes in your titles or comments, they must be properly escaped. Example "This is \"quoted\" in your comment",
//if you wish to have text in your comment starting on the next line, use \r (backslash r). For example: "Here is the first text\rThis text starts on a new line",
//if you wish to have blank lines in your message, use \r\r. For example: "This will be paragraph 1\r\rAnd here is paragraph 2",


//Lithuanian list

//First list with often used comments

window.UrcommentsLithuanianArray2 = [			    
"Neaiškus UR", // Unclear URs
"Aciu už pranešima! Waze mums nesuteike užtektinai informacijos apie Jusu pranešta klaida. Gal galetumete papasakoti daugiau apie iškilusia problema? Aciu!",
"Open",

"Itraukti pranešimo teksta", //Include Users Description
"Jus pranešete \„$URD\“, bet mes nesupratome problemos. Ka noretumete jog patikrintume?",
"Open",

"Vartot. važiavo Waze maršrutu", //User followed Waze's route
"Aciu už pranešima! Panašu, kad keliavote Waze siulomu maršrutu. Ar galetumete papasakoti kas buvo blogai? Aciu!",
"Open",

"Priminimas", //Reminder please leave this text together with the comment
"Priminimas: Mes negavome jokio atsakymo iš Jusu, del praneštos klaidos. Jeigu negausime atsakymo greitu metu, padarysime išvada, kad viskas yra gerai ir uždarysime pranešima . Aciu!",
"Open", 

"Išspresta", //Solved
"Jusu pranešimas padejo mums išspresti žemelapio klaida. Pakeitimai turetu pasiekti Jusu prietaisa poros dienu begyje (atnaujinimus galite stebeti http://status.waze.com/ arba musu facebook grupeje https://www.facebook.com/waze.lietuva) Aciu Jums!",
"Solved", 

"Uždaryti, nes negauta jokio atsakymo", // Close without response please leave this text 
"Problema buvo mums neaiški ir negavome jokio atsakymo, todel uždarome ši pranešima. Kai keliaujate nepraleiskite progos pranešti apie klaidas su kuriomis susiduriate. Aciu!",
"NotIdentified", 

"Clear comments",
"",
"Open",

"<br>",
"",
"",

//Other comments

"Posukis neleidžiamas (neaiški sankryža)", //
"Aciu už pranešima! Ar galetumete mus informuoti kuris posukis yra negalimas? Kodel posukis yra draudžiamas? Prašome nurodyti gatvemis iš kurios i kuria draudžiama sukti. Aciu!",
"Open",

"Prideti nauja kelia",
"Aciu už pranešima! Jus galite prideti nauja kelia per programele paspausdami Smeigtuko ikona > Žml. klaida > Tiesti kelia. Pradekite važiuoti. Kai baigsite, spauskite ant asfalto volo > Baigti tiesti kelius. Jus galite suteikti informacijos apie nauja kelia - gatves pavadinima, pranešant nauja žemelapio klaida ir nurodant joje. Aciu!",
"Open",

"Prideti kamera",
"Aciu už pranešima! Kameros gali buti pridetos tik per Waze programele. Spauskite pranešti > Radaras, ir pasirinkite Greitis, Šviesaforo kamera ar Netikras. O redaguotojai patvirtins Jusu kamera. Aciu!",
"NotIdentified",
			
"<br>",
"",
"",

//Default URs 6 through 22 are the different types of UR that a user can submit from the app and the Live Map. Do not change them, thanks!
"default UR responses",
"",
"",

"Neteisingas posukis", //6
"Aciu už pranešima! Ar galetumete daugiau papasakoti apie posuki sukelusi problema? Ar posukis laikinai nepravažiuojamas (kelio darbai) ar jis panaikintas? Aciu!", 
"Open",

"Neteisingas adresas", //7
"Aciu už pranešima! Waze neužfiksavo užtektinai informacijos klaidos ištaisymui. Ar galetume nurodyti teisinga adresa, i kuri bandete nuvykti? Kokios problemos iškilo su šiuo adresu? Aciu!", 
"Open",

"Trukstamas žiedas", //9
"Aciu už pranešima! Ar galetumete nurodyti kuo daugiau informacijos apie žiedine sankryža, kurios Jusu manymu truksta? Aciu!",
"Open",

"Bendra klaida", //10
"Aciu už pranešima! Waze neužfiksavo užtektinai informacijos klaidos ištaisymui. Ar galetumete papasakoti daugiau apie iškilusia problema? Aciu!",
"Open",

"Posukis neleistinas", //11
"Aciu už pranešima! Ar galetumete nurodyti kodel posukis draudžiamas? Ar tai laikini pakeitimai (pvz. del kelio darbu) ar tai yra jau nuolatinis pakeitimas? Aciu!",
"Open",

"Neteisinga sankryža", //12
"Aciu už pranešima! Waze neužfiksavo užtektinai informacijos klaidos ištaisymui. Ar galetumete nurodyti kas blogai yra su sankryža? Aciu!", 
"Open",

"Truksta tilto, viaduko", //13
"Aciu už pranešima! Ar galetumete nurodyti kokio Jusu manymu truksta tilto ar viaduko? Kai važiuojate didesniu greiciu, Waze nerodo žemelapio 100% tikslumu, taip supaprastinamas žemelapis ir suvartojama mažiau interneto ryšio ir baterijos. Papasakokite kuo imanoma daugiau apie tilta ar viaduka kurio truksta. Aciu!", 
"Open",

"Bloga važiavimo kriptis", //14
"Aciu už pranešima! Waze neužfiksavo užtektinai informacijos klaidos ištaisymui. Ar galetumete nurodyti kuo blogas Waze pasiulytas maršrutas? Ar galetumete nurodyti koki maršruto tiksla nurodete Waze? Aciu!",
"Open",

"Truksta išvažiavimo", //15
"Aciu už pranešima! Waze neužfiksavo užtektinai informacijos klaidos ištaisymui. Ar galetumete kuo imanoma daugiau papasakoti apie išvažiavima, kurio manote, kad truksta? Aciu!", 
"Open",

"Trukstamas kelias", //16
"Aciu už pranešima! Ar galite papasakoti kuo imanoma daugiau informacijos apie kelia, kurio manote, kad truksta?", 
"Open",

"Trukstamas orientyras", //18
"Aciu už pranešima! Jus bet kada galite prideti norima vieta tiesiai iš Waze programeles paspausdami ant Pranešimu meniu (smeigtuko ikona) > Vieta. Jeigu pridedate nuotrauka, isitikinkite, kad joje nesimato jokios asmenines informacijos (mašinu numeriai, žmoniu veidai ir pan.). Jus taip pat galite prideti vietos pavadinima, adresa ir kita informacija, kuria žinote apie ta vieta ir tada mes pridesime ta vieta i žemelapi. Aciu už pagalba!",
"Open",

//End of Default URs  

];
//end of the Lithuanian list