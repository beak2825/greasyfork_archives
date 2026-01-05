// ==UserScript==
// @name           WME URComments Indonesian Bahasa
// @description    This script is for Indonesian Bahasa comments to be used with Rick Zabel's script URComments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.12
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://www.waze.com/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/13197/WME%20URComments%20Indonesian%20Bahasa.user.js
// @updateURL https://update.greasyfork.org/scripts/13197/WME%20URComments%20Indonesian%20Bahasa.meta.js
// ==/UserScript==

var UrcommentsIndonesianBahasaVersion = GM_info.script.version; 
//var UrcommentsIndonesianBahasaVersion = "0.0.12"; //manually change this version number to match the script's version 
var UrcommentsIndonesianBahasaUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsIndonesianBahasaVersionUpdateNotes = "URC Indonesian Bahasa sudah di update ke versi " + UrcommentsIndonesianBahasaVersion;
UrcommentsIndonesianBahasaVersionUpdateNotes = UrcommentsIndonesianBahasaVersionUpdateNotes + "\n" + "2016.03.19 Fix UR Title position and rearrange UR list";

if (UrcommentsIndonesianBahasaUpdateMessage === "yes") {
	if (localStorage.getItem('UrcommentsIndonesianBahasaVersion') !== UrcommentsIndonesianBahasaVersion) {
		alert(UrcommentsIndonesianBahasaVersionUpdateNotes);
		localStorage.setItem('UrcommentsIndonesianBahasaVersion', UrcommentsIndonesianBahasaVersion);
	}
}
/* Changelog
 * 0.0.1 - initial version of Indonesian Bahasa by Waze Indonesian Community
 * 0.0.2 - Typo fix and translation on setting tab
 * 0.0.3 - 2015.12.28 Adding URL Filtering Instruction 
 * 0.0.4 - 2016.01.04 Add Update notification
 * 0.0.5 - 2016.02.28 Add more message
 * 0.0.6 - 2016.02.28 Local error fix
 * 0.0.7 - 2016.02.28 Local error fix
 * 0.0.8 - 2016.03.18 paragraph fix
 * 0.0.9 - 2016.03.18 Fix missing road UR title
 * 0.0.10 - 2016.03.19 Fix UR Title position and rearrange UR list
 * 0.0.11 - 2016.03.19 Fix UR Title position and rearrange UR list
 * 0.0.12 - 2016.03.19 Fix UR Title position and rearrange UR list
 */
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsIndonesianBahasaReminderPosistion = 0;

//this is the note that is added to the the reminder link  option
window.UrcommentsIndonesianBahasaReplyInstructions = 'Untuk membalas, gunakan aplikasi Waze atau link berikut'; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsIndonesianBahasaCloseNotIdentifiedPosistion = 3;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsIndonesianBahasadef_names = [];
window.UrcommentsIndonesianBahasadef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsIndonesianBahasadef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsIndonesianBahasadef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsIndonesianBahasadef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsIndonesianBahasadef_names[10] = "General error"; //"General error";
window.UrcommentsIndonesianBahasadef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsIndonesianBahasadef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsIndonesianBahasadef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsIndonesianBahasadef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsIndonesianBahasadef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsIndonesianBahasadef_names[16] = "Missing road"; //"Missing Road";
window.UrcommentsIndonesianBahasadef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsIndonesianBahasadef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsIndonesianBahasadef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsIndonesianBahasadef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsIndonesianBahasaURC_Text = [];
window.UrcommentsIndonesianBahasaURC_Text_tooltip = [];
window.UrcommentsIndonesianBahasaURC_USER_PROMPT = [];
window.UrcommentsIndonesianBahasaURC_URL = [];
//zoom out links
window.UrcommentsIndonesianBahasaURC_Text[0] = "Zoom Out 0 & Close UR";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[0] = "Zooms Out maksimal dan menutup UR window";

window.UrcommentsIndonesianBahasaURC_Text[1] = "Zoom Out 2 & Close UR";		
window.UrcommentsIndonesianBahasaURC_Text_tooltip[1] = "Zooms out ke level 2 dan menutup UR window";

window.UrcommentsIndonesianBahasaURC_Text[2] = "Zoom Out 3 & Close UR";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[2] = "Zooms out to level 3 dan menutup UR window";

window.UrcommentsIndonesianBahasaURC_Text_tooltip[3] = "Refresh peta";

window.UrcommentsIndonesianBahasaURC_Text_tooltip[4] = "Jumlah UR ditampilkan";

//tab names
window.UrcommentsIndonesianBahasaURC_Text[5] = "Komentar"; //Comments
window.UrcommentsIndonesianBahasaURC_Text[6] = "Filter"; //filter
window.UrcommentsIndonesianBahasaURC_Text[7] = "Pengaturan"; //settings

//UR Filtering Tab
window.UrcommentsIndonesianBahasaURC_Text[8] = "Klik disni untuk instruksi Filter UR";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[8] = "Instruksi untuk Instruksi UR Filter";
window.UrcommentsIndonesianBahasaURC_URL[8] = "http://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";
		
window.UrcommentsIndonesianBahasaURC_Text[9] = "Aktifkan Filter URComments";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[9] = "Aktifkan / non Aktif Filter URComments";

window.UrcommentsIndonesianBahasaURC_Text[10] = "Aktifkan jumlah 'pill' UR"; //Enable UR pill counts
window.UrcommentsIndonesianBahasaURC_Text_tooltip[10] = "Aktif/non aktif kan 'pill' dengan jumlah UR (Perlu script URO+)"; //Enable or disable the pill with UR counts

window.UrcommentsIndonesianBahasaURC_Text[12] = "Sembunyikan UR dengan status 'masa tunggu'"; //Hide Waiting
window.UrcommentsIndonesianBahasaURC_Text_tooltip[12] = "Hanya tampilkan UR yang perlu penanganan"; //Only show URs that need work (hide in-between states)

window.UrcommentsIndonesianBahasaURC_Text[13] = "Hanya tampilkan UR saya";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[13] = "Menyembunyikan UR tanpa komentar anda";

window.UrcommentsIndonesianBahasaURC_Text[14] = "Tampilkan Pengingat UR oleh editor lain + Tutup"; //Show others URs past reminder + close
window.UrcommentsIndonesianBahasaURC_Text_tooltip[14] = "Menampilkan UR yang dikomentari oleh editor lain dan telah melewati batas waktu Pengingat"; //Show URs that other commented on that have gone past the reminder and close day settings added together

window.UrcommentsIndonesianBahasaURC_Text[15] = "Sembunyikan UR yang memerlukan Pengingat";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[15] = "Sembunyikan UR yang memerlukan Pengingat";

window.UrcommentsIndonesianBahasaURC_Text[16] = "Sembunyikan UR dengan balasan user";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[16] = "Sembunyikan UR dengan balasan user";

window.UrcommentsIndonesianBahasaURC_Text[17] = "Sembunyikan UR yang memerlukan Penutupan";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[17] = "Sembunyikan UR yang memerlukan Penutupan";

window.UrcommentsIndonesianBahasaURC_Text[18] = "Sembunyikan URs tanpa komentar";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[18] = "Sembunyikan URs tanpa komentar";

window.UrcommentsIndonesianBahasaURC_Text[19] = "Sembunyikan UR tanpa komentar dan tanpa deskripsi";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[19] = "Sembunyikan UR tanpa komentar dan tanpa deskripsi";

window.UrcommentsIndonesianBahasaURC_Text[20] = "Sembunyikan UR tanpa komentar DENGAN deskripsi";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[20] = "Sembunyikan UR tanpa komentar tapi memiliki deskripsi";

window.UrcommentsIndonesianBahasaURC_Text[21] = "Sembunyikan UR yang sudah ditutup";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[21] = "Sembunyikan UR yang sudah ditutup";

window.UrcommentsIndonesianBahasaURC_Text[22] = "Sembunyikan UR dengan Penanda"; //Hide Tagged URs
window.UrcommentsIndonesianBahasaURC_Text_tooltip[22] = "Sembunyikan UR yang memiliki penanda (Tag) URO+ misalnya: [NOTE] / [EVENT] dll.";

window.UrcommentsIndonesianBahasaURC_Text[23] = "Jumlah hari Pengingat: "; //Reminder days

window.UrcommentsIndonesianBahasaURC_Text[24] = "Jumlah hari ditutup: "; //Close days

//settings tab
window.UrcommentsIndonesianBahasaURC_Text[25] = "Auto set komentar UR baru";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[25] = "Auto set komentar pada UR baru yang belum memiliki komentar";

window.UrcommentsIndonesianBahasaURC_Text[26] = "Auto set komentar Pengingat";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[26] = "Auto set komentar Pengingat untuk UR yang melebihi pengaturan batas waktu dan hanya memiliki 1 komentar";

window.UrcommentsIndonesianBahasaURC_Text[27] = "Auto zoom in pada UR baru";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[27] = "Auto zoom in saat membuka UR tanpa  komentar dan ketika mengirim komentar Pengingat";

window.UrcommentsIndonesianBahasaURC_Text[28] = "Auto center pada UR";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[28] = "Auto Center peta ketika UR memiliki konetar dan zoom kurang dari 3";

window.UrcommentsIndonesianBahasaURC_Text[29] = "Auto click open, solved, not identified"; //Auto click open, solved, not identified
window.UrcommentsIndonesianBahasaURC_Text_tooltip[29] = "Langsung kirimkan komentar ke reporter dengan tindakan sesuai yang ada dalam komentar"; //Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified

window.UrcommentsIndonesianBahasaURC_Text[30] = "Auto save setelah komentar solved or not identified comment";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[30] = "Jika Auto Click Open, Solved, Not Identified dipilih, maka opsi ini akan men-'save' setelah memberi komentar dan menekan tombol 'Send'";

window.UrcommentsIndonesianBahasaURC_Text[31] = "Auto close window komentar";//Auto close comment window
window.UrcommentsIndonesianBahasaURC_Text_tooltip[31] = "Untuk permintaan user yang tidak memerlukan penge-save-an, maka akan langsung menutup permintaan user setelah mengklik pada UR-Comment dan send button";//For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button

window.UrcommentsIndonesianBahasaURC_Text[32] = "Auto reload peta setelah berkomentar";//Auto reload map after comment
window.UrcommentsIndonesianBahasaURC_Text_tooltip[32] = "Reload peta setelah mengirimkan komentar. Tidak berlaku pada komentar yang perlu penge-save-an";//Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes

window.UrcommentsIndonesianBahasaURC_Text[33] = "Auto zoom out setelah berkomentar";//Auto zoom out after comment
window.UrcommentsIndonesianBahasaURC_Text_tooltip[33] = "Setelah memilih komentar pada daftar UR-comment dan mengkilk Send pada UR, maka level zoom akan dikembalikan ke level zoom sebelumnya";//After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom

window.UrcommentsIndonesianBahasaURC_Text[34] = "Auto switch ke tab UrComments";//Auto switch to the UrComments tab
window.UrcommentsIndonesianBahasaURC_Text_tooltip[34] = "Auto switch ke tab UrComments setelah halam ter-load dan ketika membuka sebuah UR, ketika UR window tertutup, anda akan dipindahkan ke tab sebelumnya";//Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab

window.UrcommentsIndonesianBahasaURC_Text[35] = "Tutup pesan - double click link (auto send)";//Close message - double click link (auto send)
window.UrcommentsIndonesianBahasaURC_Text_tooltip[35] = "Menambahkan extra link pada saat menutup UR dan ketika di double klik akan akan otomatis mengirimkan pesan dan menekan tombol send, termasuk opsi-opsi yang diaktifkan";//Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled

window.UrcommentsIndonesianBahasaURC_Text[36] = "Semua Komentar - double click link (auto send)";//All comments - double click link (auto send)
window.UrcommentsIndonesianBahasaURC_Text_tooltip[36] = "menambahkan extra link pada setiap komentar pada daftar sehingga ketika di double klik akan akan otomatis mengirimkan pesan dan menekan tombol send, termasuk opsi-opsi yang diaktifkan";//Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled

window.UrcommentsIndonesianBahasaURC_Text[37] = "Daftar Komentar";//Comment List
window.UrcommentsIndonesianBahasaURC_Text_tooltip[37] = "Ini menunjukan daftar komentar yang dipilih. Anda dapat membuat sendiri komentar dengan memilih pilihan custom. Jika anda ingin komentar 'custom' anda masuk kedalam script ini atau anda memiliki saran dan masukan terhadap script utama silahkan hubungi (dalam bahasa inggris) ke rickzabel @waze atau @gmail. untuk saran mengenai terjemahan bahasa Indonesia silahkan hubungi @projectronic di forum waze atau di telegram";//This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail

window.UrcommentsIndonesianBahasaURC_Text[38] = "Tombol 'done' dinon-aktifkan";
window.UrcommentsIndonesianBahasaURC_Text_tooltip[38] = "Non-aktifkan tombol done / next pada bagian bawah UR window yang baru";

window.UrcommentsIndonesianBahasaURC_Text[39] = "Unfollow UR setelah send";//Unfollow UR after send
window.UrcommentsIndonesianBahasaURC_Text_tooltip[39] = "Unfollow UR setelah mengirimkan komentar";//Unfollow UR after sending comment

window.UrcommentsIndonesianBahasaURC_Text[40] = "Auto send Pengingat";//Auto send reminders
window.UrcommentsIndonesianBahasaURC_Text_tooltip[40] = "Kirim otomatis pesan pengingat ke UR yang saya follow pada saat UR tersebut tampil/terlihat di monitor";//Auto send reminders to my UR as they are on screen

window.UrcommentsIndonesianBahasaURC_Text[41] = "Mengganti nama tag dengan nama editor";//Replace tag name with editor name
window.UrcommentsIndonesianBahasaURC_Text_tooltip[41] = "Ketika pada deskripsi UR terdapat nama editor, maka otomatis merubah jenis tag menjadi nama editor tersebut";//When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name

window.UrcommentsIndonesianBahasaURC_Text[42] = "(2x klik)"; //double click to close links
window.UrcommentsIndonesianBahasaURC_Text_tooltip[42] = "2x klik disini untuk mengirim secara otomatis - ";

window.UrcommentsIndonesianBahasaURC_Text[43] = "Sembunyikan nama tag pada Pill"; //Dont show tag name on pill
window.UrcommentsIndonesianBahasaURC_Text_tooltip[43] = "Sembunyikan nama tag pada Pill ketika ada URO tag"; //Dont show tag name on pill where there is a URO tag

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[0] = "UR Comments - Anda memiliki versi lama custom comment file atau ada syntax error yang membuat custom list gagal loading. Missing: ";

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[1] = "UR Comments - Anda kekurangan item-item berikut pada custom comment list: ";

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[2] = "List tidak dapat ditemukan. Anda dapat melihat daftar dan instruksi pada https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[3] = "URComments - Jumlah hari ditutup tidak dapat di set ke 0 ";

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[4] = "URComments - untuk menggunakan 2x Klik, maka opsi Auto click open, solved, not identified, harus diaktifkan";

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";//URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled // perlu terjemahan

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[6] = "URComments: waktu loading data UR habis, mencoba lagi."; //URComments: Loading UR data has timed out, retrying. //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[7] = "URComments: Tambah pesan pengingat pada UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[8] = "URComment's UR Filtering dinon-aktifkan karena URO+\'s UR filter sudah aktif."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[9] = "UrComments mendeteksi bahwa ada edit yang belum di save!\n\nDengan opsi Auto Save diaktifkan maka anda harus melakukan save dahulu terhadap hasil edit anda sebelumnya. Silahkan save editan anda sebelumnya dan ulangi mengirim komentar."; 

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[10] = "URComments: Tidak dapat menemukan comment box! Agar script ini bekerja maka anda harus membuka salah satu UR."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsIndonesianBahasaURC_USER_PROMPT[11] = "URComments - Ini akan mengirimkan pesan pengingat sesuai dengan settingan batas waktu pengingat. Hanya akan mengirimkan pada UR yang terlihat di monitor. NOTE: Saat menggunakan fitur ini anda jangan membuka UR kecuali pada UR yang anda memiliki pertanyaan sendiri"; //conformation message/ question //URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders.


//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsIndonesianBahasaArray2 = [	
"Reminder message", //do not change (rickzabel)//0
"Halo,\nSekedar mengingatkan.\nKami belum menerima tanggapan dari anda.\nBila anda tidak segera memberikan respon, kami akan menganggap report anda telah selesai dan menutupnya.\nTerimakasih.",//2016.02.28
"Open", 

"UR Lama", //menangani UR yang sudah terlalu lama //1
"Halo,\nMohon Maaf.. \nLaporan anda baru dapat kami tanggapi.\nBila masih ingat bisa anda jelaskan error yang anda alami di lokasi saat itu ?\nTerimakasih atas partisipasi anda..\nSalam,\rKomunitas Waze Indonesia",//2016.02.28
"Open",

"Minta keterangan",//3
"Halo,\nMohon informasi lebih lanjut mengenai laporan \"$URD\" yang anda berikan agar dapat kami perbaiki.\r\rSalam", //2016.02.28
"Open",

"Informasi tujuan",//2
"Halo,\nAplikasi Waze tidak memberi informasi mengenai posisi awal dan tujuan akhir dari rute anda.\rMohon beri informasi mengenai tujuan anda agar kami dapat memperbaiki laporan anda.\r\rSalam", //Projectronic 19/8/15
"Open",

"<br>",//10
"",
"",

"Batalkan Isian Otomatis", //untuk membatalkan isian otomatis dan mengganti dengan isian manual //11
"",
"Open",

"<br>",//10
"",
"",

"Fixed",//6
"Halo,\nTerima kasih atas laporan/respon yang diberikan.\nKami telah melakukan perbaikan peta terhadap laporan anda.\nPerubahan akan berfungsi setelah beberapa hari.\nBila masih menemukan masalah mohon buat laporan baru.\nTerimakasih atas kontribusi anda dalam perbaikan peta Waze.,\nSalam hangat, \nKomunitas Waze Indonesia, like fanpage waze ID : www.facebook.com/wazeindonesia ", //2016.02.28
"Solved", 

"Sedang Diproses",//31
"Halo,\nMohon maaf..\nKami memerlukan waktu untuk menyelesaikan report anda.\nTerimakasih atas partisipasi anda dalam perbaikan Waze.",//2016.02.28
"Open",

"Tidak Ditanggapi / Tidak jelas", //pernah direpon namun masalah belum jelas //4
"Halo,\nLaporan tidak ada tanggapan lebih lanjut.\nMasalah tidak teridentifikasi.\nReport anda kami anggap telah selesai dan kami tutup.\nBila menemukan 'map issue' silakan membuat report yang baru.\nTerimakasih.",//2016.02.28
"NotIdentified",

"Tidak Ditanggapi / Selesai", //sudah ada respon tapi tidak berlanjut dan masalah bisa diselesaikan //5
"Halo,\nKarena tidak ada tanggapan lebih lanjut.\nMaka report anda kami anggap telah selesai dan kami tutup.\nBila menemukan 'map issue' silakan membuat report yang baru.\nTerimakasih.", //2016.02.28
"Solved", //t0cableguy 12/8/14 //rickzabel 12/8/14 , karlcr9911 12/8/14

"Alamat telah diperbaiki",//7
"Halo,\nTerima kasih atas laporan/respon yang diberikan.\nKami telah melakukan perbaikan peta terhadap laporan anda.\nPerubahan akan berfungsi setelah beberapa hari.\nBila masih menemukan masalah jangan sungkan untuk membuat laporan baru.\nTerimakasih atas kontribusi anda dalam perbaikan peta Waze.,\nSalam hangat, \nKomunitas Waze Indonesia, like fanpage waze ID : www.facebook.com/wazeindonesia ",//2016.02.28
"Solved",

"Alamat pada titik yang tepat",//8
"Halo\rSaat ini live map menunjukan alamat anda pada lokasi yang tepat.\rMohon hapus History alamat ini pada aplikasi Waze dengan cara menyentuh tombol 'i' dalam titik biru lalu 'remove from history'.\rJika history tidak dihapus maka hasil pencarian akan tetap pada koordinat yang lama.\r\rSilahkan buat laporan baru jika masalah masih dialami.\r\rTerima kasih",//Projectronic 19/8/15
"Solved", //karlcr9911 rickzabel 4/3/2015

"Jalan sudah ditutup",//9
"Halo,\rJalan ini telah ditutup. Terima kasih atas kontribusinya.",//Projectronic 19/8/15
"Solved", //requested by SkiDooGuy //changed to NotIdentified by karlcr9911 4/3/2015 //7/22/2015 changed to Solved by karlcr9911

"7+ hari",//42
"Halo,\nSampai saat ini kami tidak menerima tanggapan dari anda.\nLaporan anda kami anggap telah selesai dan kami tutup.\nBila menemukan 'map issue' silakan membuat report yang baru.\nTerimakasih.",//2016.02.28
"NotIdentified",


"<br>",//10
"",
"",


//selected segments requires the use of https://greasyfork.org/en/scripts/9232-wme-panel-swap
"Masukan nama segmen (perlu script wme panel swap)",//13
"Hallo,\nMohon informasi lebih lanjut mengenai Laporan anda pada area $SELSEGS, \rTerima kasih",
"Open",

"Peta tidak tampil",//32
"Halo,\nUntuk masalah peta yang tidak tampil di layar.\nsilakan coba refresh dengan cara pilih ikon Waze di sebelah kiri bawah > Settings > Advanced > Data transfer > Refresh Map Of My Area.\nAtau dengan membersihkan cache pada app manager gadget anda. Terakhir dengan reset app yaitu ketik ##@resetapp pada navigasi lalu search. Semoga membantu.", //2016.02.28
"Open",

"Paving",//33
"Halo,\nAnda dapat membantu kami dengan melakukan paving yaitu \ndengan cara pilih ikon Pin Report di sebelah kanan bawah > Map Issue > Pave Road.\nKemudian melaporkan nama jalan dengan klik ikon Pin > Map Issue > Missing Road, isi dengan nama jalan.\nTerimakasih atas partisipasi anda dalam perbaikan peta waze",//2016.02.28
"Open",

"Navigasi",//34
"Halo,\nSepertinya anda akan navigasi menuju \$URD\".\nUntuk navigasi silakan pilih ikon waze di sebelah kiri bawah > Navigasi lalu ketik tujuan anda dan Go.\nBila tidak setuju dengan rute yg diberikan, klik ikon waze > route dan pilih alternatif rute yg ada.\nSemoga membantu.",//2016.02.28
"Open",

"Menambahkan Places Sendiri",//35
"Halo,\nTerimakasih atas laporan anda.\nAnda dapat menambahkan \'places'\ sendiri melalui aplikasi.\nDengan cara pilih ikon Pin Report di sebelah kanan bawah dan pilih \place\".\nLakukan capture dan tambahakn informasi lalu send.\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",
 
"Sinyal GPS",//36
"Halo,\nUntuk masalah sinyal,\nPada dasarnya sinyal tidak dapat menembus gedung atau badan kendaraan.\nKondisikan perangkat anda agar tidak terhalang dan dapat menghadap langsung ke angkasa.\nSemoga membantu.\nTerimakasih atas partisipasi anda.",//2016.02.28
"NotIdentified",

"Tidak ada perintah putar balik",//37
"Halo,\nTerimakasih atas laporan anda.\nDi beberapa lokasi perintah 'putar balik' masih berupa rangkaian perintah 'belok kanan'.\nSaat ini kami sedang memperbaiki bunyi perintah tersebut secara bertahap.\nSemoga dapat dipahami.",//2016.02.28
"NotIdentified",

"Report Aneh-aneh",//38
"Halo,\nMaaf..\nKami hanya dapat membantu masalah yg terkait peta waze.\nBila menemukan 'map issue' silakan membuat report yang baru.\nTerimakasih atas partisipasi anda.",//2016.02.28
"NotIdentified",

"Kemacetan",//39
"Halo,\nUntuk melaporkan kemacetan, \nSilahkan pilih ikon Pin Report di sebelah kanan bawah dan pilih \"Traffic Jam\".\nLaporan kemacetan akan sangat membantu user lain secara realtime.\nTerimakasih atas partisipasi anda.",//2016.02.28
"NotIdentified",

"Hazard",//40
"Halo,\nUntuk report gangguan di jalan, silakan pilih ikon Pin Report di sebelah kanan bawah dan pilih \"Hazard\". Laporan ini akan sangat membantu user lain secara realtime. Terimakasih atas partisipasi anda.",//2016.02.28
"NotIdentified",

"Tanpa Perbaikan",//41
"Halo,\nTerimakasih atas respon yg diberikan.\nBila menemukan 'map issue' silakan membuat report yang baru.\nTerimakasih.",//2016.02.28
"NotIdentified",

"<br>",//14
"",
"",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
"Incorrect turn", //15
"Halo,\nAnda melaporkan adanya 'Salah arah belok'.\nBisa anda jelaskan tidak boleh belok dari mana ke arah mana ?\nApakah karena ditutup, portal atau bagaimana ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Incorrect address", //16
"Halo,\nAnda melaporkan adanya 'Tujuan Keliru'.\nBisa anda jelaskan anda akan menuju ke mana ?\nBagaimana kekeliruan yang terjadi?\nBagaimana seharusnya ?\nTerimakasih atas partisipasi anda\n\nSalam.",//2016.02.28
"Open",

"Incorrect route", //17
"Halo,\nAnda melaporkan adanya 'Salah Rute'.\nBisa anda jelaskan anda darimana menuju kemana ?\nBagaimana kesalahan rute yang diberikan Waze ?\nBagaimana seharusnya ?\nTerimakasih atas partisipasi anda.\n\nSalam.",
"Open",

"Missing roundabout", //18
"Halo,\nAnda melaporkan 'Missing Roundabout'.\nBisa anda jelaskan kondisi bundaran yang anda maksudkan ?\nBerapa lebarnya? / Apakah setiap kendaraan harus memutari bundaran tersebut bila akan berbelok ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"General error", //19
"Halo,\nKami memerlukan informasi atas laporan \"$URD\" anda.\nMohon beri penjelasan lebih lanjut mengenai laporan anda, agar dapat kami tindaklanjuti perbaikannya.\nTerima kasih.",//2016.02.28
"Open",

"Turn not allowed", //20
"Halo,\nAnda melaporkan 'Tidak Boleh Belok'.\nBisa dijelaskan tidak boleh belok dari jalan mana menuju ke arah mana ?\nApakah karena ditutup, ada rambu atau bagaimana ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Incorrect junction", //21
"Halo,\nAnda melaporkan adanya 'Persimpangan Keliru'.\nBisa dijelaskan persimpangan mana yg tidak benar ?\nBagaimana seharusnya ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Missing bridge overpass", //22
"Halo\nAnda melaporkan 'Jembatan Belum Ada'.\nBisa anda jelaskan jembatan tersebut menghubungkan jalan apa ?\nJalan atau Sungai apa yang dilintasi ?\nAdakah nama jembatan ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Wrong driving direction", //23
"Halo,\nAnda melaporkan Waze memberi salah arah mengemudi.\nBisa dijelaskan anda dari mana menuju ke arah mana ?\nBagaimana kesalahan rute yang diberikan Waze ?\nBagaimana seharusnya ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Missing Exit", //24
"Halo'\nAnda melaporkan adanya 'Missing Exit' \nBisa anda jelaskan jalan tersebut keluar dari mana menuju ke mana ?\nApa nama jalan-nya ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Missing road", //25
"Halo,\nAnda melaporkan adanya 'Missing Road'.\nBisa anda jelaskan apakah jalan itu belum dipetakan ?/nAtaukah seharusnya tidak ada jalan ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Missing Landmark", //26
"Halo,\nAnda melaporkan adanya Petanda yang belum dibuat./nBisa anda jelaskan lokasi dan nama petanda yang anda maksudkan ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Blocked Road", //27
"Halo,\nAnda melaporkan adanya penutupan jalan./nBisa anda jelaskan dari mana ke arah mana ?\nApakah jalan ditutup permanen ?Terimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Missing Street Name", //28
"Halo,\nAnda melaporkan jalan belum ada nama.?nBisa anda jelaskan lokasi dan nama jalan yang anda maksudkan ?\nTerimakasih atas partisipasi anda.",//2016.02.28
"Open",

"Incorrect Street Prefix or Suffix",//29
"Halo,\nMohon dijelaskan penamaan yang tepatnya bagaimana? Apakah sesuai dengan papan nama?\nTerima kasih",//2016.02.28
"Open",

//End of Default URs


/*
////////// list #3 tidak/belum diterjemahkan //////////////////////
//"User Followed Waze's route",
//"Alley Interference",
//"Road Closed",
//"Area Entrances",
//"48 Hour Reply",
//"Clear Saved Locations",
//"Address - Incorrect Position",
//"Address - Missing from Map",
//"Address - Bad Results",
//"House Number Adjustment",
//"Missing Bridges or Roads",
//"Manual Refresh",
//"Pave Road",
//"Blank Screen.",
//"Unlock request",
//////////// akhir dari list #3
*/
];
//end Custom list