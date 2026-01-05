// ==UserScript==
// @name           WME URComments Persian List
// @description    This script is for Persian comments to be used with Rick Zabel's script URComments (URC), maintained by saeed911ir
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.8.1
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author         saeed911ir@gmail.com '2017
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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
// @downloadURL https://update.greasyfork.org/scripts/28201/WME%20URComments%20Persian%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/28201/WME%20URComments%20Persian%20List.meta.js
// ==/UserScript==
/* Changelog
 * 5th update to the format
 * 0.0.2 - initial version
 */
//I will try not to update this file but please keep a external backup of your comments as the main script changes this file might have to be updated. When the custom comments file is auto updated you will loose your custom comments. By making this a separate script I can try to limit how often this would happen but be warned it will eventually happen.
//if you are using quotes in your titles or comments they must be properly escaped. example "Comment \"Comment\" Comment",
//if you wish to have blank lines in your messages use \n\n. example "Line1\n\nLine2",
//if you wish to have text on the next line with no spaces in your message use \n. example "Line1\nLine2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "4 day Follow-Up"
window.UrcommentsPersianReminderPosistion = 42;

//this is the note that is added to the the reminder link  option
window.UrcommentsPersianReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsPersianCloseNotIdentifiedPosistion = 0;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area!
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsPersiandef_names = [];
window.UrcommentsPersiandef_names[6] = "Incorrect turn"; //"Incorrect turn";
window.UrcommentsPersiandef_names[7] = "Incorrect address"; //"Incorrect address";
window.UrcommentsPersiandef_names[8] = "Incorrect route"; //"Incorrect route";
window.UrcommentsPersiandef_names[9] = "Missing roundabout"; //"Missing roundabout";
window.UrcommentsPersiandef_names[10] = "General error"; //"General error";
window.UrcommentsPersiandef_names[11] = "Turn not allowed"; //"Turn not allowed";
window.UrcommentsPersiandef_names[12] = "Incorrect junction"; //"Incorrect junction";
window.UrcommentsPersiandef_names[13] = "Missing bridge overpass"; //"Missing bridge overpass";
window.UrcommentsPersiandef_names[14] = "Wrong driving direction"; //"Wrong driving direction";
window.UrcommentsPersiandef_names[15] = "Missing Exit"; //"Missing Exit";
window.UrcommentsPersiandef_names[16] = "Missing Road"; //"Missing Road";
window.UrcommentsPersiandef_names[18] = "Missing Landmark"; //"Missing Landmark";
window.UrcommentsPersiandef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsPersiandef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsPersiandef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";


//below is all of the text that is displayed to the user while using the script
window.UrcommentsPersianURC_Text = [];
window.UrcommentsPersianURC_Text_tooltip = [];
window.UrcommentsPersianURC_USER_PROMPT = [];
window.UrcommentsPersianURC_URL = [];

//zoom out links
window.UrcommentsPersianURC_Text[0] = "زوم آوت 0 و بستن گزارش";
window.UrcommentsPersianURC_Text_tooltip[0] = "Zooms all the way out and closes the UR window";

window.UrcommentsPersianURC_Text[1] = "زوم آوت 2 و بستن گزارش";
window.UrcommentsPersianURC_Text_tooltip[1] = "Zooms out to level 2 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsPersianURC_Text[2] = "زوم آوت 3 و بستن گزارش";
window.UrcommentsPersianURC_Text_tooltip[2] = "Zooms out to level 3 and closes the UR window (this is where I found most of the toolbox highlighting works)";

window.UrcommentsPersianURC_Text_tooltip[3] = "Reload the map";

window.UrcommentsPersianURC_Text_tooltip[4] = "Number of URs Shown";

//tab names
window.UrcommentsPersianURC_Text[5] = "کامنتها";
window.UrcommentsPersianURC_Text[6] = "فیلترها";
window.UrcommentsPersianURC_Text[7] = "تنظیمات";

//UR Filtering Tab
window.UrcommentsPersianURC_Text[8] = "راهنمای استفاده از اسکریپت";
window.UrcommentsPersianURC_Text_tooltip[8] = "Instructions for UR filtering";
window.UrcommentsPersianURC_URL[8] = "https://docs.google.com/presentation/d/1El54Hi7GYEFVtIlu0C_Wo0N3BRIkWTVa84_B-vcS4t8/edit#slide=id.p";


window.UrcommentsPersianURC_Text[9] = "فعال نمودن فیلتر";
window.UrcommentsPersianURC_Text_tooltip[9] = "Enable or disable URComments filtering";

window.UrcommentsPersianURC_Text[10] ="فعال نمودن شمارشگر";
window.UrcommentsPersianURC_Text_tooltip[10] = "Enable or disable the pill with UR counts";

window.UrcommentsPersianURC_Text[12] = "فقط گزارشهای نیازمند بررسی نمایش داده شود";
window.UrcommentsPersianURC_Text_tooltip[12] = "Only show URs that need work (hide in-between states)";

window.UrcommentsPersianURC_Text[13] = "فقط گزارشهای من نمایش داده شود";
window.UrcommentsPersianURC_Text_tooltip[13] = "Hide URs where you have no comments";

window.UrcommentsPersianURC_Text[14] = "گزارشهای دیگران هم نمایش داده شود";
window.UrcommentsPersianURC_Text_tooltip[14] = "Show URs that other commented on that have gone past the reminder and close day settings added together";

window.UrcommentsPersianURC_Text[15] = "گزارشهای نیازمند یادآوری پنهان شود";
window.UrcommentsPersianURC_Text_tooltip[15] = "Hide URs where reminders are needed";

window.UrcommentsPersianURC_Text[16] = "گزارشهای پاسخ داده شده توسط کاربر پنهان شود";
window.UrcommentsPersianURC_Text_tooltip[16] = "Hide UR with user replies";

window.UrcommentsPersianURC_Text[17] = "گزارشهایی که باید بسته شوند پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[17] = "Hide URs that need closing";

window.UrcommentsPersianURC_Text[18] = "گزارشهای بدون کامنت پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[18] = "Hide URs that have zero comments";

window.UrcommentsPersianURC_Text[19] = "گزارشهای بدون توضیح کاربر پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[19] = "Hide URs that do not have descriptions or comments";

window.UrcommentsPersianURC_Text[20] = "گزارشهای دارای توضیح ولی بدون کامنت پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[20] = "Hide URs that have descriptions and zero comments";

window.UrcommentsPersianURC_Text[21] = "گزارشهای بسته شده پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[21] = "Hide closed URs";

window.UrcommentsPersianURC_Text[22] = "گزارشهای تگ دار پنهان شوند";
window.UrcommentsPersianURC_Text_tooltip[22] = "Hide URs that are tagged with URO+ style tags ex. [NOTE]";

window.UrcommentsPersianURC_Text[23] = "زمان یادآوری: ";

window.UrcommentsPersianURC_Text[24] = "زمان بستن گزارش: ";

//settings tab
window.UrcommentsPersianURC_Text[25] = "کامنت گذاری اتوماتیک";
window.UrcommentsPersianURC_Text_tooltip[25] = "Auto set the UR comment on new URs that do not already have comments";

window.UrcommentsPersianURC_Text[26] = "ارسال خودکار کامنت یادآوری";
window.UrcommentsPersianURC_Text_tooltip[26] = "Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment";

window.UrcommentsPersianURC_Text[27] = "زوم خودکار بر روی گزارش جدید";
window.UrcommentsPersianURC_Text_tooltip[27] = "Auto zoom in when opening URs with no comments and when sending UR reminders";

window.UrcommentsPersianURC_Text[28] = "گزارش جدید در مرکز صفحه نمایش";
window.UrcommentsPersianURC_Text_tooltip[28] = "Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3";

window.UrcommentsPersianURC_Text[29] = "انتخاب خودکار وضعیت گزارش";
window.UrcommentsPersianURC_Text_tooltip[29] = "Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified";

window.UrcommentsPersianURC_Text[30] = "ذخیره خودکار گزارشهای حل شده و نامشخص";
window.UrcommentsPersianURC_Text_tooltip[30] = "If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button";

window.UrcommentsPersianURC_Text[31] = "بستن خودکار پنجره کامنت";
window.UrcommentsPersianURC_Text_tooltip[31] = "For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button";

window.UrcommentsPersianURC_Text[32] = "رفرش کردن نقشه بعد از کامنت";
window.UrcommentsPersianURC_Text_tooltip[32] = "Reloads the map after clicking on a UR-Comment and then send button. This does not apply to any messages that needs to be saved, since saving automatically reloads the map. Currently this is not needed but I am leaving it in encase Waze makes changes";

window.UrcommentsPersianURC_Text[33] = "بازگشت خودکار به زوم قبلی بعد از کامنت";
window.UrcommentsPersianURC_Text_tooltip[33] = "After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom";

window.UrcommentsPersianURC_Text[34] = "بازگشت خودکار تب کامنتها";
window.UrcommentsPersianURC_Text_tooltip[34] = "Auto switch to the URComments tab when opening a UR, when the UR window is closed you will be switched to your previous tab";

window.UrcommentsPersianURC_Text[35] = "فعال سازی دبل کلیک برای ارسال و بستن گزارش";
window.UrcommentsPersianURC_Text_tooltip[35] = "Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsPersianURC_Text[36] = "فعال سازی دبل کلیک برای ارسال کامنت";
window.UrcommentsPersianURC_Text_tooltip[36] = "Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled";

window.UrcommentsPersianURC_Text[37] = "انتخاب زبان";
window.UrcommentsPersianURC_Text_tooltip[37] = "This shows the selected comment list. There is support for a custom list. If you would like your comment list built into this script or have suggestions on the Comments team’s list, please contact me at rickzabel @waze or @gmail";

window.UrcommentsPersianURC_Text[38] = "غیر فعال کردن انتخاب دستی بستن پیغام";
window.UrcommentsPersianURC_Text_tooltip[38] = "Disable the done / next buttons at the bottom of the new UR window";

window.UrcommentsPersianURC_Text[39] = "آنفالو کردن گزارش بعد از ارسال";
window.UrcommentsPersianURC_Text_tooltip[39] = "Unfollow UR after sending comment";

window.UrcommentsPersianURC_Text[40] = "ارسال خودکار کامنت یادآوری";
window.UrcommentsPersianURC_Text_tooltip[40] = "Auto send reminders to my UR as they are on screen";

window.UrcommentsPersianURC_Text[41] = "تغییر تگ با نام ادیتور";
window.UrcommentsPersianURC_Text_tooltip[41] = "When a UR has the logged in editors name in the description or any of the comments of the UR (not the name Waze automatically add when commenting) replace the tag type with the editors name";

window.UrcommentsPersianURC_Text[42] = "(Double Click)"; //double click to close links
window.UrcommentsPersianURC_Text_tooltip[42] = "Double click here to auto send - ";

window.UrcommentsPersianURC_Text[43] = "عدم نمایش تگ";
window.UrcommentsPersianURC_Text_tooltip[43] = "Dont show tag name on pill where there is a URO tag";


window.UrcommentsPersianURC_USER_PROMPT[0] = "اسکریپت فارسی ساز شما نیاز به آپدیت مجدد دارد. لطفا آن را بروزآوری نمایید.";

window.UrcommentsPersianURC_USER_PROMPT[1] = "UR Comments - You are missing the following items from your custom comment list: ";

window.UrcommentsPersianURC_USER_PROMPT[2] = "List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsPersianURC_USER_PROMPT[3] = "شما مجاز به تعیین عدد صفر برای روزهای بستن گزارش نیستید";

window.UrcommentsPersianURC_USER_PROMPT[4] = "URComments - To use the double click links you must have the Auto click open, solved, not identified option enabled";

window.UrcommentsPersianURC_USER_PROMPT[5] = "URComments - Aborting FilterURs2 because both filtering, counts, and auto reminders are disabled";

window.UrcommentsPersianURC_USER_PROMPT[6] = "URComments: Loading UR data has timed out, retrying."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPersianURC_USER_PROMPT[7] = "URComments: Adding reminder message to UR: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPersianURC_USER_PROMPT[8] = "URComment's UR Filtering has been disabled because URO+\'s UR filters are active."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPersianURC_USER_PROMPT[9] = "UrComments has detected that you have unsaved edits!\n\nWith the Auto Save option enabled and with unsaved edits you cannot send comments that would require the script to save. Please save your edits and then re-click the comment you wish to send.";

window.UrcommentsPersianURC_USER_PROMPT[10] = "URComments: Can not find the comment box! In order for this script to work you need to have a UR open."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPersianURC_USER_PROMPT[11] = "URComments - This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders."; //conformation message/ question


//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//Custom list
window.UrcommentsPersianArray2 = [
    "بستن گزارش بی جواب", //"No further communication"
    //"No further information was received and the request is being closed. As you travel, please feel welcome to report any map issues you encounter. Thanks!"
    "متاسفانه پاسخی از شما درخصوص مشکل گزارش شده دریافت نکردیم. لذا نسبت به بستن گزارش اقدام میشود. لطفا همچنان ما را از اشکالات موجود آگاه نمایید. ارائه توضیحی مختصر در خصوص مشکل گزارش شده کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "NotIdentified",

    "بستن گزارش حل شده", //Fixed
    //"Thanks to your report we've found and fixed a problem with the map. The fix should reach mobile devices within a few days. On rare occasions it can take closer to a week.",
    "از گزارش شما متشکریم، مشکل برطرف و طی چند روز آینده در سرور اعمال خواهد شد. چنانچه مشکل دیگری مشاهده کردید، اطلاع رسانی کنید. در صورت تمایل میتوانید ار طریق لینک زیربه گروه ادیتورهای ویز ایران بپیوندید\rhttps://t.me/wazeiran\rربات تلگرام @wazeiran_bot\rباتشکر",
    "Solved",

    "درخواست توضیح", //General error
    //"Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!",
    "با سپاس از مشارکت شما در ارسال این گزارش، متاسفانه اطلاعات موجود برای پیدا کردن مشکل مورد نظر شما  کافی نیست. لطفا در صورت امکان راجع به آن توضیح فرمایید\r در صورت تمایل میتوانید ار طریق لینک زیربه گروه ادیتورهای ویز ایران بپیوندید\rhttps://t.me/wazeiran\rربات تلگرام @wazeiran_bot\r",
    "Open",

    "گزارش دوربین", //Camera report
    "با سلام، متاسفانه امکان پیگیری گزارشات دوربین از اینجا مقدور نمی باشد. گزارشهای دوربین بایستی در محل دقیق دوربین و از طریق اپلیکیشن ارسال گردیده و سپس در گروه تلگرامی ویز ایران اطلاع رسانی گردد تا مدیران مناطق نسبت به بررسی و تایید آن اقدام نمایند. با تشکر\rاطلاعات بیشتر در کانال تلگرام ویزایران \rhttps://t.me/wazeiran",
    "NotIdentified",

    "آیا مشکل حل شده است؟", //Problem appears corrected
    //"Just a reminder: The problem appears to be corrected. Please let us know if you are continuing to have the issue. If we do not hear from you in a few days we will close this report. Thanks!",
    "با سلام امیدواریم که مشکل موردنظر حل شده باشد. لطفا چنانچه مشکل همچنان باقی است اطلاع رسانی نمایید. عدم دریافت پاسخ از شما به معنای حل مشکل بوده و این گزارش بسته خواهد شد. \rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Open",

    "تصحیح آدرس", //Address Adjustments
    //"Thanks! The address has been adjusted. This should reach handheld devices within a few days, but on rare occasions it can take closer to a week.",
    "از گزارش شما متشکریم، آدرس تصحیح و طی چند روز آینده به روزرسانی خواهد شد. چنانچه مشکل دیگری مشاهده کردید، اطلاع رسانی کنید. ارائه توضیحی مختصر در خصوص مشکل گزارش شده کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Solved",

    "حذف کامنت و باز گذاشتن گزارش", //Clears comment & sets UR status to Open
    "",
    "Open",

    "آدرس صحیح است", //Address in correct spot
    //"The live map is currently showing your address in the correct spot. Please remove any instance of this address from your history and favorites by tapping the 'i' within the blue circle and then 'remove from history'. Then search for the address. If you don't remove the old results from your navigation or favorites, you will continue to be routed to the old coordinates. Please submit another report if this does not resolve your issue. Thanks!",
    "بررسی انجام شده نشان میدهد که آدرس موردنظر در محل صحیح خود قرار دارد. لطفا در هیستوری و فهرست فیوریت خود آدرس ذخیره شده را حذف و مجددا سرچ نمایید. چنانچه مشکل دیگری مشاهده کردید، اطلاع رسانی کنید\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Solved",

    "مسیردهی نادرست", //Address fishing
    //"Waze does not tell us your starting or ending destinations. Would you tell us your destination as you entered it into Waze? Thanks!",
    "متاسفانه ویز مبدا و مقصد شما را ارسال نکرده است. جهت بررسی مشکل لطفا مبدا و مقصد خود را اعلام فرمایید\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Open",

    "مسیر مسدود گردید", //The road has been closed
    //"Volunteer responding - Thank you for your report, the road has been closed.",
    "از گزارش شما متشکریم، مسیر موردنظر مسدود شد. چنانچه مشکل دیگری مشاهده کردید، اطلاع رسانی کنید\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Solved",

    "گزارشات مبهم", //Errors with no text
    //"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل مورد نظر شما به ما نداده است. لطفا با توضیح در مورد مقصد موردنظر و مسیر پیشنهادی ویز به حل این مشکل کمک فرمایید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Open",

    "محدودیت سرعت", //Fixed Speed Limit
    //"The missing/incorrect speed limit you reported has been updated. Thank you!",
    "از گزارش شما متشکریم، محدودیت سرعت موردنظر اعمال شد. چنانچه مشکل دیگری مشاهده کردید، اطلاع رسانی کنید\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
	"Solved",

    "مسیر درخواستی رسم شد", //Missing Road
    //"Would you tell us as much as possible about the road you believe is missing? Thanks!",
    "با سلام، مسیر اعلام شده شما رسم و طی چند روز آینده در ویز به روزرسانی خواهد شد. لطفا بررسی و در صورت تایید نام آن را هم ' نمایید تا در نقشه وارد گردد. باتشکر\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Solved",

    "مسیر درخواستی نامشخص", //Missing Road
    //"Would you tell us as much as possible about the road you believe is missing? Thanks!",
    "با سلام، مسیرهای اطراف محل گزارش بررسی و مورد رسم نشده ای پیدا نشد. در مواردی ویز برای جلوگیری از شلوغی نقشه آیتمهای کم اهمیت در اطراف مسیر را نشان نمیدهد. لطفا چنانچه مطمئن هستید که آیتمی رسم نشده است با ارائه توضیحاتی ما را در رسم آنها راهنماییفرمایید. لازم به ذکر است که تنها مسیرهای ماشین رو و غیرخصوصی در ویز رسم میشوند.د\rاطلاعات بیشتر در کانال تلگرام ویزایران\r@wazeiran",
    "Open",

    "Reminder message", //do not change (rickzabel)
    //"Just a reminder: We have not received a response on your report. If we don't hear back from you soon, we will infer everything is okay and close the report. Thanks!",
    "جهت یادآوری: متاسفانه هنوز پاسخی از شما درخصوص مشکل گزارش شده دریافت نکرده ایم. لطفا با ارائه توضیحی مختصر در خصوص مشکل گزارش شده ما را در رفع این مشکل یاری فرمایید. اطلاعات بیشتر در کانال تلگرام ویزایران \n@wazeiran",
    "Open",

    "No reply close message", //do not change (rickzabel)
    //"The problem was unclear and volunteers didn't receive a response so we are closing this report. As you travel, please feel welcome to report any map issues you encounter. Thanks!",
    "متاسفانه پاسخی از شما درخصوص مشکل گزارش شده دریافت نکردیم. لذا نسبت به بستن گزارش اقدام میشود. لطفا همچنان ما را از اشکالات موجود آگاه نمایید. ارائه توضیحی مختصر در خصوص مشکل گزارش شده کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "NotIdentified",

//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
    "Incorrect turn", //6
    //"Volunteer responding - Would you please let us know what turn you are having a problem with? Would you tell us your destination as you entered it into Waze? Thanks!",
     "با سپاس از مشارکت شما در ارسال این گزارش،. لطفا بفرمایید درکجا مشکل گردش داشتید. مقصد خودتان را هم بفرمایید\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Incorrect address", //7
    //"Volunteer responding - Waze did not send us enough information to fix your request. Would you tell us your destination as you entered it into Waze? What is the problem you are having with this address? Thanks!",
    "متاسفانه  ویز مبدا و مقصد شما را ارسال نکرده است. جهت بررسی مشکل لطفا مبدا و مقصد خود را اعلام فرمایید\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Incorrect route", //8
    //"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل مورد نظر شما به ما نداده است. لطفا با توضیح در مورد آن به حل این مشکل کمک فرمایید. مشخصا مقصدی را که در ویز وارد کردید بفرمائید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Missing roundabout", //9
    //"Volunteer responding - Would you tell us as much as possible about the roundabout you believe is missing? Thanks!",
    "با سپاس از مشارکت شما در ارسال این گزارش،. لطفا راجع به میدانی که معتقدید رسم نشده است توضیح فرمایید\rآدرس کانال تلگرام ویزایران\r@wazeiran",
    "Open",

    "General error", //10
    //"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong? Would you tell us your destination as you entered it into Waze? Thanks!", //rickzabel 12/9/14
    "با سپاس از مشارکت شما در ارسال این گزارش، متاسفانه اطلاعات موجود برای پیدا کردن مشکل مورد نظر شما  کافی نیست. لطفا در صورت امکان راجع به آن توضیح فرمایید\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Turn not allowed", //11
    //"Volunteer responding - Would you please let us know which turn was or should not be allowed and why? Please specify the street names at the intersection. Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل مورد نظر شما به ما نداده است. لطفا با توضیح در مورد آن به حل این مشکل کمک فرمایید. مشخصا اسم خیابانهایی که مشکل در دورزدن داشتید را بفرمائید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran ",
    "Open",

    "Incorrect junction", //12
    //"Volunteer responding - Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل مورد نظر شما به ما نداده است. لطفا با توضیح در مورد آن به حل این مشکل کمک فرمایید. مشخصا اسم خیابانهایی را که تقاطع آنها مشکل دارد را بفرمائید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Missing bridge overpass", //13
    //"Volunteer responding - Would you please let us know what overpass you believe is missing? When moving at highway speeds, Waze deliberately chooses not to display some nearby features to avoid cluttering the screen. Would you tell us as much as possible about the missing overpass. Thanks!",
    "با سلام، مسیرهای اطراف محل گزارش بررسی و پل  رسم نشده ای پیدا نشد. در مواردی ویز برای جلوگیری از شلوغی نقشه آیتمهای کم اهمیت در اطراف مسیر را نشان نمیدهد. لطفا چنانچه مطمئن هستید که آیتمی رسم نشده است با ارائه توضیحاتی ما را در رسم آنها راهنمایی فرمایید\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Wrong driving direction", //14
    //"Waze did not send us enough information to fix your request. Would you please let us know what went wrong with the route Waze gave you? Would you tell us your destination as you entered it into Waze? Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل مسیریابی موردنظر شما به ما نداده است. لطفا با توضیح در مورد آن به حل این مشکل کمک فرمایید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Missing Exit", //15
    //"Waze did not send us enough information to fix your request. Would you please let us know as much as possible about the missing exit? Thanks!",
    "متاسفانه ویز اطلاعات کافی برای حل مشکل موردنظر شما به ما نداده است. لطفا با توضیح در مورد خروجی که با آن مشکل داشتید، به حل این مشکل کمک فرمایید. روشن بودن وضعیت مسیر یابی ویز در هنگام ارسال گزارش موجب ترسیم مسیر شما و مسیر پیشنهادی ویز در گزارش میگردد که کمک بزرگی در رفع مشکل خواهد بود\rاطلاعات بیشتر در کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Missing Road", //16
    //"Would you tell us as much as possible about the road you believe is missing? Thanks!",
    "با سپاس از مشارکت شما در ارسال این گزارش،. لطفا در مورد مسیری که معتقد هستید رسم نشده است توضیح فرمایید\rآدرس کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Missing Landmark", //18
    //"Volunteer responding - Would you tell us as much as possible about the landmark you believe is missing? Thanks!",
	"با سپاس از مشارکت شما در ارسال این گزارش،. لطفا در مورد مکانی که معتقد هستید در نقشه نیست توضیح فرمایید\rآدرس کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Blocked Road", //19
    "",
    "Open",

    "Missing Street Name", //21
    "با سپاس از مشارکت شما در ارسال این گزارش،. لطفا نام خیابانی را که مشکل دارد اعلام فرمایید\rآدرس کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    "Incorrect Street Prefix or Suffix", //22
    "با سپاس از مشارکت شما در ارسال این گزارش،. لطفا نام خیابانی را که مشکل دارد اعلام فرمایید\rآدرس کانال تلگرام ویزایران\rhttps://t.me/wazeiran",
    "Open",

    //End of Default URs

];
//end Custom list

