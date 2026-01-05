// ==UserScript==
// @name           WME URComments Romanian List
// @description    This script provides translated comments for Romania, to be used with URcomments script by RickZabel in Waze Map Editor (WME)
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.1.21
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author         Rick Zabel '2014 (original) SpookyX (Romanian)
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/25024/WME%20URComments%20Romanian%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/25024/WME%20URComments%20Romanian%20List.meta.js
// ==/UserScript==
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
window.UrcommentsRomanianReminderPosistion = 48;

//this is the note that is added to the the reminder link  option
window.UrcommentsRomanianReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsRomanianCloseNotIdentifiedPosistion = 62;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsRomaniandef_names = [];
window.UrcommentsRomaniandef_names[6] = "Viraj incorect"; //"Incorrect turn";
window.UrcommentsRomaniandef_names[7] = "Adresă incorectă"; //"Incorrect address";
window.UrcommentsRomaniandef_names[8] = "Rută incorectă"; //"Incorrect route";
window.UrcommentsRomaniandef_names[9] = "Giratoriu lipsă"; //"Missing roundabout";
window.UrcommentsRomaniandef_names[10] = "Eroare generală"; //"General error";
window.UrcommentsRomaniandef_names[11] = "Viraj nepermis"; //"Turn not allowed";
window.UrcommentsRomaniandef_names[12] = "Intersecție incorectă"; //"Incorrect junction";
window.UrcommentsRomaniandef_names[13] = "Pod/pasaj lipsă"; //"Missing bridge overpass";
window.UrcommentsRomaniandef_names[14] = "Direcții greșite de condus"; //"Wrong driving direction";
window.UrcommentsRomaniandef_names[15] = "Ieșire lipsă"; //"Missing Exit";
window.UrcommentsRomaniandef_names[16] = "Drum lipsă"; //"Missing Road";
window.UrcommentsRomaniandef_names[18] = "Loc lipsă"; //"Missing Landmark";
window.UrcommentsRomaniandef_names[19] = "Drum închis"; //"Blocked Road";
window.UrcommentsRomaniandef_names[21] = "Lipsă nume stradă"; //"Missing Street Name";
window.UrcommentsRomaniandef_names[22] = "Prefix sau sufix incorect al străzii"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsRomaniandef_names[23] = "Limită viteză"; //"Missing or invalid speed limit";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsRomanianURC_Text = [];
window.UrcommentsRomanianURC_Text_tooltip = [];
window.UrcommentsRomanianURC_USER_PROMPT = [];
window.UrcommentsRomanianURC_URL = [];

//zoom out links
window.UrcommentsRomanianURC_Text[0] = "Zoom Out 0 & Închide UR";
window.UrcommentsRomanianURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsRomanianURC_Text[1] = "Zoom Out 2 & Închide UR";		
window.UrcommentsRomanianURC_Text_tooltip[1] = "Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsRomanianURC_Text[2] = "Zoom Out 3 & Închide UR";
window.UrcommentsRomanianURC_Text_tooltip[2] = "Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsRomanianURC_Text_tooltip[3] = "Reîncarcă harta";

window.UrcommentsRomanianURC_Text_tooltip[4] = "Numărul UR-urilor afișate";

//tab names
window.UrcommentsRomanianURC_Text[5] = "Comentarii";
window.UrcommentsRomanianURC_Text[6] = "Filtrare UR-uri";
window.UrcommentsRomanianURC_Text[7] = "Setări";

//UR Filtering Tab
window.UrcommentsRomanianURC_Text[8] = "Apasă aici pentru instrucțiuni";
window.UrcommentsRomanianURC_Text_tooltip[8] = "Instrucțiuni pt filtrarea UR-urilor";
window.UrcommentsRomanianURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU/edit#slide=id.p";

		
window.UrcommentsRomanianURC_Text[9] = "Activează filtrarea UR-urilor din URComments"; //Enable URComments UR filtering
window.UrcommentsRomanianURC_Text_tooltip[9] = "Activează sau dezactivează filtrarea URComments"; //Enable or disable URComments filtering

window.UrcommentsRomanianURC_Text[10] = "Activează ecuson cu contor UR"; //Enable UR pill counts
window.UrcommentsRomanianURC_Text_tooltip[10] = "Activează sau dezactivează ecusonul cu contor sub UR"; //Enable or disable the pill with UR counts

window.UrcommentsRomanianURC_Text[12] = "Ascunde cele în așteptare"; //Hide Waiting
window.UrcommentsRomanianURC_Text_tooltip[12] = "Afișează doar acele UR-uri care necesită intervenție (hide in-between states)"; //Only show URs that need work (hide in-between states)

window.UrcommentsRomanianURC_Text[13] = "Afișează doar UR-urile mele"; //Only show my URs
window.UrcommentsRomanianURC_Text_tooltip[13] = "Ascunde UR-urile unde nu ai comentarii."; //Hide URs where you have no comments

window.UrcommentsRomanianURC_Text[14] = "Afișează UR-urilor celorlalți ce necesită reamintire și închidere."; //Show others URs past reminder + close
window.UrcommentsRomanianURC_Text_tooltip[14] = "Afișează UR-urile la care ceilalți au comentat și a trecut termenul de reamintire și închidere, însumate."; // Show URs that other commented on that have gone past the reminder and close day settings added together

window.UrcommentsRomanianURC_Text[15] = "Ascunde UR-urile care au nevoie de reamintire"; //Hide URs Reminder needed
window.UrcommentsRomanianURC_Text_tooltip[15] = "Ascunde UR-urile ce au nevoie de trimite mesajele reaminitire/resolicitare informații"; //Hide URs where reminders are needed

window.UrcommentsRomanianURC_Text[16] = "Ascunde UR-urile cu răspunsuri de la utilizatori"; //Hide URs user replies
window.UrcommentsRomanianURC_Text_tooltip[16] = "Ascunde UR-urile ce au primit răspunsuri de la utilizatori"; //Hide UR with user replies

window.UrcommentsRomanianURC_Text[17] = "Ascunde UR-urile ce trebuiesc închise"; //Hide URs close needed
window.UrcommentsRomanianURC_Text_tooltip[17] = "AScunde UR-urile ce au depășit termenul și trebuiesc închise."; //Hide URs that need closing

window.UrcommentsRomanianURC_Text[18] = "Ascunde UR-urile fără comentarii"; //Hide URs no comments
window.UrcommentsRomanianURC_Text_tooltip[18] = "Ascunde UR-urile care au ZERO comentarii"; //Hide URs that have zero comments

window.UrcommentsRomanianURC_Text[19] = "Ascunde UR-urile cu 0 comentarii și fără descriere"; //hide 0 comments without descriptions
window.UrcommentsRomanianURC_Text_tooltip[19] = "Ascunde acele UR-uri care nu nimic la descrierea problemei și nici nu au comentarii"; //Hide URs that do not have descriptions or comments

window.UrcommentsRomanianURC_Text[20] = "Ascunde UR-urile cu 0 comentarii, dar cu descriere"; //hide 0 comments with descriptions
window.UrcommentsRomanianURC_Text_tooltip[20] = "AScunde UR-urile care nu au niciun comentariu, dar au o descriere"; //Hide URs that have descriptions and zero comments

window.UrcommentsRomanianURC_Text[21] = "Ascunde UR-urile închise"; //Hide Closed URs
window.UrcommentsRomanianURC_Text_tooltip[21] = "Ascunde UR-urile închise"; //Hide closed URs

window.UrcommentsRomanianURC_Text[22] = "Ascunde UR-urile Etichetate"; //Hide Tagged URs
window.UrcommentsRomanianURC_Text_tooltip[22] = "Ascunde UR-urile care au o etichetă, în formatul etichetelor de la URO+, exemplu [NOTE]"; //Hide URs that are tagged with URO+ style tags ex. [NOTE]

window.UrcommentsRomanianURC_Text[23] = "Zile reaminitire: "; //Reminder days: 

window.UrcommentsRomanianURC_Text[24] = "Zile închidere "; //Close days:

//settings tab
window.UrcommentsRomanianURC_Text[25] = "Pune automat comentariu nou la UR"; //Auto set new UR comment
window.UrcommentsRomanianURC_Text_tooltip[25] = "Pune automat comentariu la UR-rile noi, care nu au deja comentarii"; //Auto set the UR comment on new URs that do not already have comments

window.UrcommentsRomanianURC_Text[26] = "Pune automat reaminitire la UR"; //Auto set reminder UR comment
window.UrcommentsRomanianURC_Text_tooltip[26] = "Pune automat reaminiter la UR pentru acelea a căror termen de reaminitire din setări a fost depășit și care au doar un singur comentariu."; //Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment

window.UrcommentsRomanianURC_Text[27] = "Zoom-in automat pe UR nou"; //Auto zoom in on new UR
window.UrcommentsRomanianURC_Text_tooltip[27] = "Zoom automat la deschiderea unui UR care nu are comentarii și la trimitere reaminitire"; //Auto zoom in when opening URs with no comments and when sending UR reminders

window.UrcommentsRomanianURC_Text[28] = "Centrare automată pe UR"; //Auto center on UR
window.UrcommentsRomanianURC_Text_tooltip[28] = "Centrarea automată pe hartă la zoom-ul actual când un UR are comentarii și zoom-ul este mai mic de 3."; //Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3

window.UrcommentsRomanianURC_Text[29] = "Clic automat deschis, rezolvat, ne-identificat"; //Auto click open, solved, not identified
window.UrcommentsRomanianURC_Text_tooltip[29] = "Suprimă mesajele despre întrebările recente către raportor ce sunt în așteptarea răspunsului și apoi, în funcție de alegerea făcută setează comentariu pentru Deschis, Rezolvat, Ne-identificat. "; //Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified

window.UrcommentsRomanianURC_Text[30] = "Salvează automat după un comentariu de Rezolvat sau Ne-identificat"; //Auto save after a solved or not identified comment
window.UrcommentsRomanianURC_Text_tooltip[30] = "Dacă este bifat **Clic automat deschis, rezolvat, ne-identificat**, această opțiune va face ca butonul de Salvare din editor să se apese automat după ce alegi un comentariu din listă și apeși pe butonul de trimitere."; //If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button

window.UrcommentsRomanianURC_Text[31] = "Închide automat fereastra cu comentarii"; //Auto close comment window
window.UrcommentsRomanianURC_Text_tooltip[31] = "Pentru acele UR-uri care nu necesită să Salvare, această opțiune va face care fereastra cu comentarii a UR-ului să se închidă după ce selectezi un comentariu și ai apăsat butonul de trimitere"; //For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button

window.UrcommentsRomanianURC_Text[32] = "Reîncarcă harta automat după comentariu"; //Auto reload map after comment
window.UrcommentsRomanianURC_Text_tooltip[32] = "Reîncarcă harta după alegerea unui comentariu din listă și apăsarea butonului trimitere. Asta nu se aplică acelor mesaje care necesită salvare, din moment ce salvarea determină o reîncărcare a hărții automat. Această opțiune nu este necesară, dar ea există aici în caz că Waze face modificări"; //Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes

window.UrcommentsRomanianURC_Text[33] = "Zoom-out automat după comentariu "; //Auto zoom out after comment
window.UrcommentsRomanianURC_Text_tooltip[33] = "După ce ai ales un comentariu din listă și ai apăsat pe trimitere la UR, harta va reveni la zoom-ul anterior"; //After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom

window.UrcommentsRomanianURC_Text[34] = "Comutare automată în tabul URComments"; //Auto switch to the UrComments tab
window.UrcommentsRomanianURC_Text_tooltip[34] = "Comuare automat la tabul URComments când se deschide un UR. După închiderea ferestrei cu comentarii a UR-ului, se va comuta înapoi pe tabul anterior."; //Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab

window.UrcommentsRomanianURC_Text[35] = "Comentariu închidere - dublu click pe link (auto-trimitere)"; //Close message - double click link (auto send)
window.UrcommentsRomanianURC_Text_tooltip[35] = "Adaugă un link extra la comentariul de închidere, iar atunci când dai dublu click va trimite automat comentariul de închidere în fereastra UR-ului și va apăsa automat pe trimitere, după care vor rula celelalte opțiuni care sunt activate"; //Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled

window.UrcommentsRomanianURC_Text[36] = "Toate comentariile - dublu click pe link (auto-trimitere)"; //All comments - double click link (auto send)
window.UrcommentsRomanianURC_Text_tooltip[36] = "Adaugău un link extra la fiecare comentariu din listă, iar atunci când dai dublu click pe el va trimite automat comentariul în fereastra UR-ului și va apăsa autoamt pe trimitere, după care vor fi exectuate celelalte opțiuni activate."; //Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled

window.UrcommentsRomanianURC_Text[37] = "Listă comentarii"; //Comment List
window.UrcommentsRomanianURC_Text_tooltip[37] = "Aceasta arată lista de comentarii selectată. Există suport pentru liste de comentarii personalizate. Dacă vrei ca lista ta cu comentarii să fie inclusă în acest script, sau dacă ai sugestii despre lista de comentarii a echipei, te rog să mă contactezi la rickzabel @waze sau @gmail"; //This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail

window.UrcommentsRomanianURC_Text[38] = "Dezactivează butoanele Terminat/Următorul(oarea)"; //Disable done / next buttons
window.UrcommentsRomanianURC_Text_tooltip[38] = "Dezactivează butoanele de Terminat sau Următorul(oare) problemă de la baza ferestrei unui UR."; //Disable the done / next buttons at the bottom of the new UR window

window.UrcommentsRomanianURC_Text[39] = "Nu mai urmări UR-ul după trimitere"; //Unfollow UR after send
window.UrcommentsRomanianURC_Text_tooltip[39] = "După trimiterea unui comentariu, nu mai urmări acest UR."; //Unfollow UR after sending comment

window.UrcommentsRomanianURC_Text[40] = "Trimitere automată reaminitiri"; //Auto send reminders
window.UrcommentsRomanianURC_Text_tooltip[40] = "Trimitere automată de reaminitiri la toata UR-urile mele de pe ecran."; //Auto send reminders to my UR as they are on screen

window.UrcommentsRomanianURC_Text[41] = "Înlocuișete eticheta cu numele de editor"; //Replace tag name with editor name
window.UrcommentsRomanianURC_Text_tooltip[41] = "Când un UR are etichetate nume de editori în descriere sau oricare alte comentarii (și aici nu ne referim la numele pe care îl adaugă Waze automat când comentezi), înlocuiește eticheta cu numele editorilor"; //When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name

window.UrcommentsRomanianURC_Text[42] = "(Dublu Clic)"; //double click to close links
window.UrcommentsRomanianURC_Text_tooltip[42] = "Execută dublu clic aici pentru auto-trimitere - "; //Double click here to auto send - 

window.UrcommentsRomanianURC_Text[43] = "Nu afișa nume etcihetă în ecuson"; //Dont show tag name on pill
window.UrcommentsRomanianURC_Text_tooltip[43] = "Nu afișa eticheta cu nume în ecuson atunci când există o etichetă URO"; //Dont show tag name on pill where there is a URO tag


window.UrcommentsRomanianURC_USER_PROMPT[0] = "URComments - Fie ai o versiune veche a fișierului cu comentarii personalizate sau există o eroare în sintaxă care previne încărcarea listei personalizate din a se încărca. Lipsește: "; //UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: 

window.UrcommentsRomanianURC_USER_PROMPT[1] = "URComments - Lipsesc următoarele elemente din lista ta cu comentarii personalizate: "; //UR Comments - You are missing the following items from your custom comment list: 

window.UrcommentsRomanianURC_USER_PROMPT[2] = "Lista nu poate fi găsită. Poți găsi lista și instrucțiuni la https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //List can not be found you can find the list and instructions at

window.UrcommentsRomanianURC_USER_PROMPT[3] = "URComments - Nu poți seta termenul de închidere la zero"; //URComments - You can not set close days to zero

window.UrcommentsRomanianURC_USER_PROMPT[4] = "URComments - Pentru a utiliza legăturile dublu click trebuie să activezi opțiunea **Clic automat Deschis, Rezolvat, Ne-identificat**"; //URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled

window.UrcommentsRomanianURC_USER_PROMPT[5] = "URComments - Se anulează FilterURs2 deoarce filtrarea, contorizarea și reaminitirle automat sunt dezactivate"; //URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled

window.UrcommentsRomanianURC_USER_PROMPT[6] = "URComments: Încărcarea UR a eșuat, se reîncearcă."; //URComments: Loading UR data has timed out, retrying. - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsRomanianURC_USER_PROMPT[7] = "URComments: Se trimite mesaj reaminitire la UR: "; //URComments: Adding reminder message to UR:  - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsRomanianURC_USER_PROMPT[8] = "Filtrarea URComennets a UR-urilor a fost dezactivată deoarce filtrarea URO+ este activă"; //URComment's UR Filtering has been disabled because URO+\'s UR filters are active. - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsRomanianURC_USER_PROMPT[9] = "URComments a detectat că ai editări nesalvate!\n\nCu opțiunea de Salvare Automată activată și atunci când ai editări nesalvate, nu poți trimite comentarii care solicită scriptului salvare. Te rog să salvezi editările și apoi re-click pe comentariul pe care dorești să-l trimiți."; //UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.

window.UrcommentsRomanianURC_USER_PROMPT[10] = "URComments: Nu se poate găsi caseta de comentariu! Pentru a folosi acest script trebuie să ai un UR deschis."; //URComments: Can not find the comment box! In order for this script to work you need to have a UR open. -this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsRomanianURC_USER_PROMPT[11] = "URComments - Se vor trimite reamintiri conform termenului setat. Asta se întâmplă doar atunci când sunt zona de vizualizare pe ecran. NOTĂ: Când folosești această funcție nu ar trebui să lași vreun UR deschis, numai dacă ai vreo întrebare care așteaptă un răspuns de la un wazer deoarece acest script va trimite aceste reaminitiri"; //URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. - conformation message/ question

window.UrcommentsRomanianURC_CommonText = "\r\rAlătură-te comunității Waze din România: facebook.com/WazeRomania (susține-ne cu un Like te rog), facebook.com/groups/WazeRomania Îți mulțumim pentru contribuția ta la îmbunătățirea Waze.";

window.UrcommentsRomanianURC_Volunteer = "\r\rNotă: Acest mesaj a fost trimis de un voluntar, editor al hărții. Harta Waze a fost creată și este administrată 100% de voluntari.";

window.UrcommentsRomanianURC_CloseText = window.UrcommentsRomanianURC_CommonText+window.UrcommentsRomanianURC_Volunteer;

//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsRomanianArray2 = [	

// UR-URI CU REZOLVARE
"<b><u>Rezolvare cu Închidere UR</u></b>",
"",
"",

"✅Rezolvat",
"Mulțumită raportului tău, problema a fost rezolvată. Modificarea se va reflecta pe hartă în 1-2 zile, dar uneori poate dura și mai mult."+window.UrcommentsRomanianURC_CloseText,
"Solved", 

"☑Deja Rezolvat (neactualizat)",
"Modificarea a fost deja efectuată, dar nu se reflectă încă pe harta live. Modificarea se va reflecta pe hartă în 1-2 zile, dar uneori poate dura și mai mult."+window.UrcommentsRomanianURC_CloseText,
"Solved",

"☑Deja Rezolvat (actualizat)",
"Modificarea a fost deja efectuată și se reflectă pe harta Waze, harta actualizându-se între timp. "+window.UrcommentsRomanianURC_CloseText,
"Solved",

"⛔ Drumul a fost închis",
"Mulțumim pentru sesizare. Drumul a fost închis."+window.UrcommentsRomanianURC_CloseText,
"Solved",

"? Drumul a fost deschis",
"Mulțumim pentru sesizare. Drumul a fost deschis."+window.UrcommentsRomanianURC_CloseText,
"Solved",

"? Limită de viteză modificată",
"Limita de viteză lipsă/incorectă a fost modificată. Modificarea se va reflecta pe hartă în 1-2 zile, dar uneori poate dura și mai mult."+window.UrcommentsRomanianURC_CloseText,
"Solved",

"? Punct Navigație Loc Modificat",
"Am modificat punctul de navigație al acestui loc. Și tu poți modifica punctul de navigație al unui loc dacă consideri că este greșit. Cauți un loc, alegi locul și intri în ecranul de previzualizare unde ai un buton de opțiuni (3 puncte) și apare un meniu de unde selectezi Editare. Acolo poți modifica detaliile locului, precum punctul de destinație, dar și alte detalii."+window.UrcommentsRomanianURC_CloseText,
"Solved",

"? Nr. Imobil Adăugat",
"Am adăugat numărul/numerele de imobil pe hartă. Acestea nu erau pe harta Waze, dar au fost preluate automat din surse externe (Google Maps). Vor trece 1-2 zile până când va apărea la corect la căutare. Nu uita ca la o nouă căutare să nu alegi un rezultat din istoric. Te rog să ne raportezi pe viitor și alte numere de imobile poziționate greșit pentru a le adăuga. "+window.UrcommentsRomanianURC_CloseText,
"Solved",
    
"? Loc adăugat - loc greșit în GM",
"Am adăugat locul pe harta Waze în poziția sugerată. Acestea nu exista pe harta Waze, dar a fost preluat automat din surse externe (Google Maps). Acesta va apărea la căutare și-l va înlocui pe cel din Google Maps. Nu uita ca la o nouă căutare să nu alegi un rezultat din istoric (icon ceas).\r\n\r\nDacă un loc există pe Waze, vei putea să îl raportezi/editezi (inclusiv locația lui) din aplicație: din pagina de vizualizare a locului, ai meniul din dreapta sus cu 3 puncte și acolo dacă apare Raportare și Editare, înseamnă că locul există pe Waze și îl poți modifica. Dacă nu există, înseamnă că el provine din Google Maps și trebuie adăugat pe Waze.\r\n\r\nPentru a adăuga pe Waze un loc nou, din meniul de raportare ai Loc (Place), faci poză locului la exteriorul clădirii astfel încât șoferii să îl recunoască și apoi pui numele, după care poți seta și restul de detalii, precum adresă, nr stradă, oraș, telefon, ore funcționare etc. "+window.UrcommentsRomanianURC_CloseText,
"Solved",
    
"♻ Loc conectat - greșit GM / OK waze",
"Locul căutat de tine se află pe harta Waze în poziția corectă. Totuși, tu ai selectat un rezultat greșit (o dublură) ce provine din sursă externă (Google Maps). Am conectat locul din Waze cu cel greșit din Google Maps astfel încât să se elimine dublura și ca Waze să te ducă în locul corect. Nu uita ca la o nouă căutare să nu alegi un rezultat din istoric (icon ceas).\r\n\r\nDacă un loc există pe Waze, vei putea să îl raportezi/editezi (inclusiv locația lui) din aplicație: din pagina de vizualizare a locului, ai meniul din dreapta sus cu 3 puncte și acolo dacă apare Raportare și Editare, înseamnă că locul există pe Waze și îl poți modifica. Dacă nu există, înseamnă că el provine din Google Maps și trebuie adăugat pe Waze.\r\n\r\nPentru a adăuga pe Waze un loc nou, din meniul de raportare ai Loc (Place), faci poză locului la exteriorul clădirii astfel încât șoferii să îl recunoască și apoi pui numele, după care poți seta și restul de detalii, precum adresă, nr stradă, oraș, telefon, ore funcționare etc. "+window.UrcommentsRomanianURC_CloseText,
"Solved",
"",
"",
"",

// UR-URI NOI - FĂRĂ ÎNCHIDERE UR
"<b><u>❓Acțiuni rapide fără închidere UR</u></b>",
"",
"",

"?❓Solicitare inițială (UR fără descriere)",
"Te rog să îmi furnizezi mai multe informații pentru a putea rezolva problema. Waze nu ne furnizează informații suficiente să ne dăm seama de problema sesizată: nu știm cine ești (raportorii sunt anonimi), nu știm ce destinație ai avut și nici punctul de plecare, vedem doar o mică parte din ruta ta și uneori deloc, iar dacă ruta este în apropiere de origine/destinație, nu vedem ruta pe ultimul km. Astfel, aceste informații pot fi importante să ni le comunici pentru a putea rezolva problema. Îți mulțumim pentru contribuția ta la îmbunătățirea Waze. Te rog să răspunzi din aplicație sau din editorul de hartă. Nu răspunde direct prin email pentru că nimeni nu va primi răspunsul tău. Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"?❓Solicitare inițială (UR cu descriere)",
"Ai raportat \"$URD\" și Waze nu ne furnizează informații suficiente pentru a putea rezolva problema. Te rog să îmi furnizezi mai multe informații pentru a putea rezolva problema. Waze nu ne furnizează informații suficiente să ne dăm seama de problema sesizată: nu știm cine ești (raportorii sunt anonimi), nu știm ce destinație ai avut și nici punctul de plecare, vedem doar o mică parte din ruta ta și uneori deloc, iar dacă ruta este în apropiere de origine/destinație, nu vedem ruta pe ultimul km. Astfel, aceste informații pot fi importante să ni le comunici pentru a putea rezolva problema. Îți mulțumim pentru contribuția ta la îmbunătățirea Waze. Te rog să răspunzi din aplicație sau din editorul de hartă. Nu răspunde direct prin email pentru că nimeni nu va primi răspunsul tău. Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",
    
"?❓ Solicitare adresă",
"Te rog să îmi comunici destinația așa cum ai introdus-o în Waze. Waze nu ne furnizează informații suficiente să ne dăm seama de problema sesizată: nu știm cine ești (raportorii sunt anonimi), nu știm ce destinație ai avut și nici punctul de plecare, vedem doar o mică parte din ruta ta și uneori deloc, iar dacă ruta este în apropiere de origine/destinație, nu vedem ruta pe ultimul km. Astfel, aceste informații pot fi importante să ni le comunici pentru a putea rezolva problema. Îți mulțumim pentru contribuția ta la îmbunătățirea Waze. Te rog să răspunzi din aplicație sau din editorul de hartă. Nu răspunde direct prin email pentru că nimeni nu va primi răspunsul tău. Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"?‍⁉Resolicitare informații / reamintire",
"Memento: Nu am primit încă un răspuns referitor la această problemă și te rog să îmi răspunzi pentru a putea rezolva problema. Dacă nu primim un răspuns curând, vom considera că totul este în regulă și vom închide raportul. Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open", 

"<i>...vezi mai jos alte întrebări tematice..⏬</i>",
"",
"",
    
"",
"",
"",
// UR-URI CU ÎNCHIDERE NEIDENTIFICAT
"<b><u>✔↔⁉Neidentificat + Închidere UR</u></b>",
"",
"",
    
"<b>❎FĂRĂ RĂSPUNS</b>",
"Nu am putut identifica o problemă și nici nu am primit răspuns. Consider că această sesizare a fost abandonată sau trimisă din greșeală și o închid ca neidentificată. Poți oricând revenit cu o nouă sesizare dacă întâlnești vreo problemă cu harta."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"<b>Rutare proastă din cauza Rovinietei</b>",
"Bună ziua. Sunt niște probleme temporare cu rutele date de waze din cauza unor restricții legate de implementarea Rovinietei. Lucrăm cu cei de la Waze pentru remedierea problemei în cel mai scurt timp. Ne cerem scuze pentru disconfortul creat. Poți oricând revenit cu o nouă sesizare dacă întâlnești vreo problemă cu harta."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"❌Închidere simplă",
"Închid acest raport ca neidentificat. Poți oricând reveni cu o nouă sesizare dacă întâlnești vreo problemă cu harta."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 
    
"❌‼Închidere UR dublu",
"Închid acest raport pentru că este o dublură. Revin cu mesaj pe următorul raport.",
"NotIdentified", 

"?SLUR (nativ) - SL corect",
"Pe acest tronson de drum limitele de viteză sunt corecte, au fost introduse și ajustate personal de editorii hărții și membrii comunității.\r\nTotuși, dacă consideri că limita de viteză pe acest segment de drum este greșită, te rog să ne raportezi aceste limite de viteză folosind raportarea de Problemă Hartă din meniul de raportare și alegând Eroare Generală sau prin intermediul forumului (www.waze.com/forum/viewforum.php?f=120 sau waze.ro/forum/) sau prin alte canale de comunicare afișate în continuare."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"?SLUR (nativ) - raportare greșită",
"Ai raportat \"$URD\", o limită de viteză invalidă pentru acest segment de drum. Consider că ai raportat din greșeală.\r\nTotuși, dacă consideri că limita de viteză pe acest segment de drum este greșită, te rog să ne raportezi aceste limite de viteză folosind raportarea de Problemă Hartă alegând Eroare Generală sau prin intermediul forumului (www.waze.com/forum/viewforum.php?f=120 sau waze.ro/forum/) sau prin alte canale de comunicare afișate în continuare: "+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"?BUG cu aplicația", 
"Din păcate problema sesizată de tine nu este una legată de hartă, ci de aplicație și noi nu avem ce face pentru a preveni această problemă în a se mai repeta. Te rugăm să raportezi această problemă direct la Waze din aplicație: apasă pe butonul de deschidere a meniului principal (stânga jos - simbol lupă), apoi apasă pe butonul de a intra în Setări (simbol de rotiță cu zimți) și la sfârșit ai Centrul de ajutor. Intri pe Troubleshoooting - Report a bug. Sau intri direct aici: https://support.google.com/waze/answer/6276841"+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?GPS - decalat",
"Observ că ai avut probleme cu recepția GPS. Waze preia poziția GPS de la telefon. Asigură-te că toate opțiunile de localizare sunt bifate din meniul de localizare al telefonului, inclusiv WiFi-ul, și poziționează telefonul încât să aibă o vizibilitate mai bună la cer astfel pentru a-i crește precizia de localizare. Poți activa modul de RAW GPS care îți va afișa poziția reală dată de GPS printr-o săgeată galbenă: tastezi la căutare ##@rawgps și vei primi un mesaj de confirmare."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?Rută validă",
"Am analizat harta și ea este corectă. Waze ți-a furnizat o rută validă pe care a considerat-o mai rapidă decât alte rute pe baza traficului istoric și cel în timp real. Îți recomand să urmezi de câteva ori ruta sugerată de Waze să vezi dacă este mai rapidă. Dacă nu, Waze va învăța de la tine că această rută este mai lentă și pe viitor va sugera rute mai rapide. Waze înregistrează vitezele de deplasare precum și timpii necesari efectuării fiecărui viraj împarte, în fiecare intersecție, separat pe fiecare interval de 30 de minute, separat pe fiecare zi a săptămânii. Astfel, Waze învață continuu traficul pentru fiecare moment al fiecărei zile și va sugera pe viitor rute mai rapide. Îți recomand să verifici și rutele alternative pentru a vedea diferențele de timp dintre rutele disponibile."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",
    
"⚠Rută evitare drum NEASFALTAT",
"Ruta pe care ți-a dat-o Waze a fost de evitare a unei porțiune de drum marcată ca NEASFALTAT pentru că tu ai la setări EVITAREA drumurilor neasfaltate. Dacă vrei ca pe viitor Waze să te ruteze pe drumurile neasfaltate, alege din setările aplicației - Navigație - Drumuri Neasfaltate - Permite sau Evită pe cele lungi. Dacă alegi opțiunea «Evită pe cele lungi», atunci Waze va oferi rute ce vor utiliza drumurile neasfaltate în limita a 400 de metri. Închid acest raport ca neidentificat. "+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",
    
"?Nu a urmat corect ruta",
"Am analizat sesizarea ta și observ că nu ai respectat instrucțiunile Waze, astfel nu ai mers pe ruta dată de Waze.\nÎncearcă pe viitor să observi mai atent hartă pe care dintre drumuri te duce Waze, în cazul în care instrucțiunile vocale nu sunt suficiente. Poți activa modul de RAW GPS care îți va afișa poziția reală dată de GPS printr-o săgeată galbenă: tastezi la căutare ##@rawgps și vei primi un mesaj de confirmare."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",
    
"↩Viraj stânga lent (rută cu U-turn)",
"Virajul stânga este permis, dar Waze ți-a furnizat o rută validă pe care a considerat-o mai rapidă pe baza traficului istoric și cel în timp real. Waze a considerat că virajul direct la stânga ar fi luat mult timp. Îți recomand să urmezi de câteva ori ruta sugerată de Waze să vezi dacă este mai rapidă. Dacă nu, Waze va învăța de la tine că această rută este mai lentă și pe viitor va sugera direct virajul la stânga. Waze înregistrează vitezele de deplasare precum și timpii necesari efectuării fiecărui viraj împarte, în fiecare intersecție, separat pe fiecare interval de 30 de minute, separat pe fiecare zi a săptămânii. Astfel, Waze învață continuu traficul pentru fiecare moment al fiecărei zile și va sugera pe viitor rute mai rapide. Îți recomand să verifici și rutele alternative pentru a vedea diferențele de timp dintre rutele disponibile."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"⚡Viraj valid, dar dificil",
"Nu putem dezactiva un viraj legal doar pentru că este dificil. Dacă aștepți urmând ruta dată de Waze, s-ar putea ca în final să fie mai rapidă decât alternative. Dacă nu este mai rapidă, Waze va învăța acest lucru de la tine și vei ajuta ca Waze să nu mai sugereze această rută. Oricând poți alege să mergi pe altă rută și Waze va recalcula automat sau poți solicita din timp rute alternative."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"☢Loc lipsă - neadăugat", 
"Mulțumesc pentru sesizarea făcută. Oricând descoperi că un loc lipsește de pe Waze, îl poți adăuga direct din aplicație din meniul de raportare - Loc (Place). După ce ai făcut o poză din exteriorul locului, te rog să adăugi cât mai multe detalii poți despre acest loc."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"㊗Rute ciudate (detururi)",
"Nu avem o explicație pentru ruta sugerată de Waze. Waze sugerează uneori detururi complexe pentru a economisi câteva secunde. Ne pare rău că noi, editorii de hărți, nu avem o rezolvare pentru a preveni această rută. Vom transmite problema dezvoltatorilor în speranța că vor reuși pe viitor să evite astfel de detururi."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?Raportare către municipalitate",
"Noi nu putem rezolva decât probleme cu harta.  Ar trebui să sesizezi autoritățile locale competene (Poliția, Primăria, Administratorii Drumului). Ești bine venit să raportezi alte probleme cu harta pe care le întâlnești."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"??Rută de TAXI (Auto Privat)",
"Ruta furnizată de Waze este una pentru taxi pentru că ai setat cândva tipul de vehicul Taxi. Te rog mergi în setări - Navigație - Tip vehicul și selectează Privat pentru a evita astfel de rute pe viitor."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"??Rută non-TAXI (Auto Taxi)",
"Ruta furnizată de Waze este una pentru autoturismele private. Pentru a beneficia de rute permise taxiurilor, mergi în setări - Navigație - Tip vehicul și selectează Taxi pentru a primit astfel de rute pe viitor."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?Trafic - Ambuteiaj",
"Ai raportat o problemă cu harta pe care doar noi, editorii de hărții, o putem vedea. Pentru a raporta un ambuteiaj în trafic, din meniul de raportare alege Ambuteiaj. Îți recomand să descoperi aplicația vizitând toate meniurile și submeniurile."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"⚠Pericol (groapa etc)",
"Ai raportat o problemă cu harta pe care doar noi, editorii de hărții, o putem vedea. În meniul de raportare ai alertă specifică pentru pericole pe drum sau acostament. Îți recomand să descoperi aplicația vizitând toate meniurile și submeniurile."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?Modificare deja efectuată/activă",
"Modificarea a fost deja efectuată și se reflectă pe hartă. La momentul raportării modificarea hărții nu se reflectase încă în aplicație. Uneori actualizarea hărții poate dura mai multe zile."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",

"?Limită 1600 km",
"Din păcate Waze este limitat la rute de maxim 1600km sau 1 milion segmente. Îți recomandăm să adaugi o destinație intermediară, mai apropiată."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"⛔Drum închis temporar",
"Dacă drumul este blocat (închis) temporar pentru câteva ore sau o zi-două, folosește te rog funcția de raportare Drum închis din meniul de raportare a aplicației. Waze va genera automat rută ocolitoare. Dacă mai mulți utilizatori raportează acel drum ca fiind închis, atunci va deveni vizibilă închiderea pentru toți utilizatorii."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified",
    
"☢Probleme afișare: harta nu se încarcă",
"Ai raportat o problemă cu harta, dar defapt problema ta este cu aplicația. Este o problemă care se manifestă mai rar pe anumite dispozitive. Pentru a rezolva problema cu afișarea hărții, forțează reîncărcarea hărții din Setări - Afișare și Hartă - Transfer date și ar trebui să încarce corespunzător."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 
    
"☣Probleme afișare: harta e coruptă (galben/negru)",
"Ai raportat o problemă cu harta, dar defapt problema ta este cu aplicația. Este o problemă care se manifestă mai rar pe anumite dispozitive. Pentru a rezolva problema cu afișarea hărții, schimbă tema de culori a hărții din Setări - Afișare și Hartă în alta disponibilă, după care revii la tema implicită și ar trebui să apară corespunzător."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 
    
"?Voce navigație incompletă",
"Ai raportat o problemă cu harta, dar defapt problema ta este cu aplicația care apare de cele mai multe ori după actualizarea aplicației. Fișierele de limbă au fost descărcate incomplet (ele nu fac parte din instalarea inițială, ci se descarcă în funcție de vocea aleasă). Pentru a rezolva problema încearcă să schimbi vocea în alta, după care să revii la cea pe care o ai acum. Dacă tot nu merge, cel mai rapid ar fi să dezinstalezi și să reinstalezi aplicația. Poți încerca și ștergerea fișierelor de voce din telefon, dacă te descurci."+window.UrcommentsRomanianURC_CloseText,
"NotIdentified", 

"<br>",
"",
"",

"Eliminare text și status Deschis",
"",
"Open",


"<br>",
"",
"",

// UR-URI CU ÎNCHIDERE NEIDENTIFICAT
"<b><u>Întrebări specifice</u></b>",
"",
"",
//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
"Viraj incorect", //6
"Te rog să îmi precizezi care este virajul cu probleme. Poți să îmi spui care era destinația ta? Mulțumesc."+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Adresă incorectă", //7
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai mai multe informații? Despre ce adresă este vorba? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Rută incorectă", //8
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai mai multe informații? Care era problema cu ruta dată de Waze? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Missing roundabout", //9
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai mai multe informații despre giratoriul care crezi că lipsește? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"General error", //10
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai mai multe informații? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Viraj nepermis", //11
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi spui ce viraj nu este permis? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Intersecție incorectă", //12
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi spui ce este greșit la această intersecție? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Pasaj lipsă", //13
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai cât mai multe detalii despre pasajul care crezi că lipsește? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Wrong driving direction", //14
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai cât mai multe detalii despre ce crezi că e greșit la direcțiile furnizate de Waze? Care era destinația ta așa cum ai introdus-o în Waze? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Ieșire lipsă", //15
"Waze nu ne-a furnizat suficiente informații pentru a rezolva problema. Poți să îmi dai cât mai multe detalii despre ieșirea care crezi că lipsește? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Drum lipsă", //16
"Poți să îmi spui mai multe despre drumul care crezi că lipsește? Ce nume oficial are și care este starea acestuia (asfaltat, pietruit, de pământ/noroi etc.). Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Loc lipsă", //18
"Poți să îmi dai mai multe detalii despre locul care crezi că lipsește? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
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
// UR-URI CU ÎNCHIDERE NEIDENTIFICAT
"<b><u>Alte întrebări...</u></b>",
"",
"",
"Limită viteză", //23
"Poți să îmi dai mai multe detalii despre limita de viteză sesizată? Unde începe mai exact și unde se termină? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open", //rickzabel

"<br>",
"",
"",
//End of Default URs  

"⛔ Drum închis",
"Te rog să îmi dai mai multe detalii: Ce drum este închis; Între care intersecții este închis; Care este cauza închidere; Pentru cât timp crezi că va fi închis drumul? Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Ștergere Locație Salvată",
"Pentru a primi rezultatul actualizat, șterge locația veche din istoricul de navigație sau din favorite dacă l-ai salvat, inclusiv Acasă și Serviciu, și apoi caută-l din nou."+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Address - Incorrect Position",
"Can you tell us the address or if you can revisit visit the location, please show us the correct position by using the Report > Places feature. Before you save move as close as possible to the entrance. Please do not submit pictures containing faces, license plates, or personal details. Thanks!",  //rickzabel t0cableguy 04-04-2015
"Open",

"Address - Missing from Map",
"Volunteer responding - Would you let us know the address that is missing? The available resources do not have the address available for your location. You can use the Report > Places feature in Waze to mark the location. Before you save move close as possible to the entrance. Do not submit pictures containing faces, license plates, or personal details. Thanks!", //rickzabel 4/5/2015 //t0cableguy 4/5/2015
"Open",

"Adresă - Rezultate greșite din Google",
"Waze preia rezultate din mai multe surse. Adresele sunt preluate automat din Google Maps, chiar dacă există și pe Waze. Vom deschide o sesizare pe Google Maps pentru a se corecta adresa."+window.UrcommentsRomanianURC_Volunteer,
"Open",

"House Number Adjustment",
"I've forced Waze to re-register the house number for your destination. I believe this should correct your issue. Please allow up to 48 hours for changes to be reflected in the live map. If you have the location in your saved searches or favorites, please remove them and re-add the destination. Please let me know if you continue to experience this problem by submitting another error report. Thanks!", //rickzabel 12/7/14 //karlcr9911 12/8/14
"Open",

"Missing Bridges or Roads",
"The roads for this area are thoroughly mapped and the volunteer editors cannot find anything missing from the map. When you are moving, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. If you are certain a feature is missing from the map, please reply and tell us as much as possible about it. Thanks!", //rickzabel karlcr9911 4/18/2015
"Open",

"Reîncărcare hartă (manual)",
"Te rog să încerci următoarele opțiuni: (1) mergi în meniul de setări - Hartă și afișare - Transfer date - Reîncărcare hartă. (2) Încearcă să ștergi cache-ul aplicației din managerul de aplicații a telefonului. Atenție: va reseta întreaga aplicație și va trebui să îți reintroduci datele de autentificare. Poți mai ușor să resetezi aplicația tastând la căutare ##@resetapp și aplicația se va restarta."+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Pavare Drum",
"Drumurile care nu există încă pe harta Waze pot fi înregistrate (pavate). Din meniul de raportare, alege Problemă Hartă și apoi pe tab-ul Pavare. O dată activat, aplicația va înregistra drumul pe care mergi, iar pe ecran vei vedea că icoana mașinii tale se transformă într-un buldozer, iar drumul înregistrat va apărea cu albastru. Acesta va apărea în editorul de hartă și va trebui editat. Și tu poți edita harta sau va trebui să aștepți ca un editor să editeze drumul corespunzător. Simultan, poți deschide o sesizare nouă de problemă cu harta prin care să oferi mai multe informații despre drumul pe care tocmai l-ai pavat. Mulțumesc!"+window.UrcommentsRomanianURC_Volunteer,
"Open",

"Solicit deblocarea/editare",
"Pentru că nu am drepturi suficiente de editare a hărții în acest loc, am solicitat editarea/editarea hărții pentru a rezolva problema raportată. Îți mulțumesc pentru sesizare."+window.UrcommentsRomanianURC_Volunteer,
"Open"
];
//end Custom list

//alert(window.UrcommentsRomanianArray2[24]);
//alert(window.UrcommentsRomanianArray2[27]);