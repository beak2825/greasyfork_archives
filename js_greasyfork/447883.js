// ==UserScript==
// @name VK Pinky
// @namespace http://tampermonkey.net/
// @version 1
// @description VKontakte redesign (vk.com/*)
// @author PinkyWeb (vk.com/codemirror)
// @match vk.com/*
// @match vk.me/*
// @match vkontakte.ru/*
// @connect vkontakte.ru/*
// @connect vk.com/*
// @connect userapi.com/*
// @connect vk.me/*
// @icon https://www.google.com/s2/favicons?domain=vk.com
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/447883/VK%20Pinky.user.js
// @updateURL https://update.greasyfork.org/scripts/447883/VK%20Pinky.meta.js
// ==/UserScript==


//меняем цвет иконок в хедере

let kvad = document.getElementsByTagName('path');
kvad[1].style.fill = "white";
let kvadd = document.getElementsByTagName('path');
kvadd[2].style.fill = "#423e3e";

//меняем цвет хедера
document.querySelectorAll(".LeftMenu__icon").forEach(el => el.style.setProperty("color", "#e98b9b"));
document.getElementsByClassName('page_header_cont')[0].style.background = "#e7788b";
document.querySelectorAll("div.page_block > a").forEach(el => el.style.setProperty("color", "#df7688"));

//полный редизайн вк (соболезную тем, кто будет здесь рыться)
var styleNode;
function addStyle() {
styleNode = document.createElement("style");
styleNode.innerText = ".ui_rmenu_slider { left : 3px !important;} [dir] .audio-msg-track--btn{background : url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2211%22%20viewBox%3D%220%200%2010%2011%22%20width%3D%2210%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m2.5.5v9l7-4.5z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E) #e98b9b no-repeat center;} .audio_page_player2 .audio_page_player_icon--pause, .audio_page_player2 .audio_page_player_icon--play,.audio_page_player2 .audio_page_player_prev, .audio_page_player2 .audio_page_player_next,.ChatSettingsMembersWidget__addIcon,.wddi_text,.audio_page_player2 .audio_page_player_status.audio_page_player_btn_enabled .audio_page_player_btn_status_inner,.search_filters_icon { color : #dd2f57 !important;} div.info,div.topic_title,div.topic_info,span.topic_inner_link,a.bp_author,a.blst_title,div.blst_mem,div.idd_header,div.idd_item_name,div.settings_labeled_text>div.settings_row_text>a,div.settings_labeled_text>a,div.wide_column>div>div>div>div>div>span>button,div.wide_column>div>div>div>div>div>span>a,div.wide_column>div>div>div>div>span>a,div.settings_block_footer>a,div.app_settings_name>a,span.PageActionCell__label,div.settings_link_row>a,div.settings_menu_link>a,.audio_row .audio_row__play_btn .audio_row__play_btn_icon--play,.NarrativeNarrowItem__title,span.NarrativeNarrowItem__title{color:#cd465d !important} [dir] .audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_amount, [dir] .audio_page_player2 .audio_page_player_volume_slider.slider.slider_size_1 .slider_amountaudio_page_player_track_slider,.audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_handler, [dir] .audio_page_player2 .audio_page_player_volume_slider.slider.slider_size_1 .slider_handler,[dir] .audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_amount, [dir] .audio_page_player2 .audio_page_player_volume_slider.slider.slider_size_1 .slider_amount,.ChatSettingsRoundedIcon--blue,[dir] .im-navigation--label-in,[dir] .nim-dialog .nim-dialog--unread-badge { background-color : #dd2f57 !important; color:} .TopNavBtn__icon,.EcosystemServicesNavigationDropdown_button__99Wn9 { color : white !important;} .top_audio_player_btn svg,.top_audio_player,.top_audio_player_title,.TopNavBtn__profileArrow { color : white !important;} .top_audio_player_btn svg,.top_audio_player_title{background-color : #e98b9b !important;border-radius:3px} .top_audio_player_title{padding-left:8px;padding-right:8px;border-radius:3px} .nim-dialog_typing{color: #585454 !important;} .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--preview, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--who, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--name, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--name-w, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--text-preview, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--date, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--preview, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--who, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--name, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--name-w, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--text-preview, .nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--date{color: #585454 !important;} .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected+.nim-dialog {border-top: none !important;} .nim-dialog.nim-dialog_muted.nim-dialog_selected .nim-dialog--mute,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--name{color: #c8c9cb !important;} .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--preview { color : #626d7a !important;} .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--who { color : #99a2ad !important;}  .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected,.dialog_selected,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected,.nim-dialog_selected {background: #edeef0 !important;border-left: 2px solid #e7788b !important; color: #626d7a !important; border-top: none !important; } .ui_rmenu_sliding {left : 3px !important; } .ui_rmenu_item_sel{border : none !important;} .VideoActions__item,.ui_rmenu_slider,.FlatButton--positive,.Button--primary, #index_login_button,#login_button,.FacebookLogin__button,.flat_button{background-color: #d7566c !important;} .im-right-menu--count,.PageBlockShowMore__text,.EcosystemAccountMenu_link__sDStv,.EcosystemAccountMenu_buttonBalanceLink__f-Q1a,.redesign,.docs_item_name,div.EcosystemAccountMenu_buttonBalanceLink__f-Q1a > span>span,.EcosystemAccountMenu_col__RUs5p,.ui_load_more_btn,.FlatButton--tertiary,.nim-dialog--typing,._im_dialog_typing,.im-fwd--title-name,.ChatSettingsMembersWidget__add,.Link,.Select__placeholder,.Reply__authorLink,.pedit_labeled_l,.Select__control, .ChatSettingsMenu__copy,a.Link,a.ui_load_more,.index_forgot,.index_user_name,div.feedback_header>b>a,.top_notify_show_all,.bnav_a,.footer_lang_link,._im_mess_restore,div.Entity__title>span,.footer_copy,.login_forgot,div.login_compact_mobile_promo_text > a,div.footer_copy > a,.ui_load_more,.wall_reply_greeting,div.wall_post_text > a,.share_link,.mention_tt_name,div.right_list_info > a,.mem_link,notifier_baloon_wrap,.author,.page_module_upload,.people_cell_name,.people_row,.settings_right_control,.post_replies_reorder,.feed_groups_recomm__hide,div.PageActionCell__icon > svg,.post_video_title,div.im-mess--text > a,div.audio_row__performers > a,div.info > a,.copy_author,.reply_link,.PageActionItem--are-friends-blue,.mail_link__title,.page_doc_title,.PageActionsClosedProfile__action,.friends_possible_link,.ConvoTitle__title,.wall_signed_by,.wall_signed,b,.ads_ad_nested_link ,.PeerTitle__title,span.replies_short_text_deep,.wall_post_more,.thumbed_link__title,.ui_search_fltr_control ,.ui_ownblock_label,div.friends_field > a,div.friends_field_toggle_friend__add > a,div.friends_user_info_actions > a,.js-replies_next_label,.share_link,div > a.PageActionItem--call-blue,div.right_list_row > a,.ui_rmenu_item,.friends_import_header,.ui_header_ext_search,.friends_find_user_name,div.friends_user_info_actions_menu > a,a.feedback_post_link,div.ui_actions_menu_wrap>a,a.GroupsRecommendationsBlock__subscribeLink,.group_row_title,button.audio_page__shuffle_all_button,.idd_selected_value,.VideoCard__ownerLink,.ownerButton__title,div.feed_asc_user_field >a,a.login_all_products_button,a.login_link{color: #bf2640 !important;} .flat_button{color: white !important;} .nim-dialog--unread,[dir] .nim-dialog .nim-dialog--unread-badge,.wall_card__button,.FlatButton--primary,.pretty-card__button,.im-dialog--unread_ct{background: #d7566c !important;} .nim-dialog--typing,.nim-dialog_typing{color: #a57373 !important;} .nim-dialog--name-w,.im-mess-stack--lnk,.im-page--title-main-inner,.im-replied--author-link,.im-page-pinned--name,.nim-dialog_name,.profile_can_view_as_btn,._im_start_new,.top_ecosystem_navigation_bottom_services_icon,.top_ecosystem_navigation_button,#top_profile_menu.top_profile_menu_new .top_profile_mrow .menu_item_icon,.EcosystemServicesNavigationBaseItem_accent__vRZd1,.top_ecosystem_navigation_bottom_text,.page_list_module .people_name a,.AppsCatalogCard__name{color: #cd465d !important;} .nim-dialog--preview-attach{color: #626d7a !important;} .TopHomeLink,.VideoActions__item--secondary{color: #ffffff !important} .im-page-pinned--media{color: #000000 !important;} ._im_right_menu {border : 2px solid #d7566c !important} div>.people_cell_name>a,.current_audio,div.group_name>a,.count,.profile_label_more,.profile_label_less,.no_posts_cover,div.page_block >a,._im_dialog_link  {color : #cd465d !important} .ui_tab_sel,.Tabs__item--active{border-bottom : 2px solid #bf2640 !important;} svg.audio-msg-track--wave > path {stroke : #ffc8d2 !important} div.labeled > a{color : #000000 !important} .right_list_title{color : #626d7a !important} .right_list_header,a._ui_load_more_btn{color:#362b2b !important} .ads_left{display:none !important} #ads_left{display:none !important}  li.nim-dialog_muted > div.nim-dialog--content > div.nim-dialog--cw > div.nim-dialog--unread_container > div.nim-dialog--unread{background:#d7566c !important}";
document.body.appendChild(styleNode);
}
addStyle()

//выводим знак зодиака на странице человека (спизжено)
var born = new Date();

function zodiac(day, month) {
var sign;

if (day >= 21 && month == 3 || day <= 19 && month == 4) sign = "Овен ♈";
else if (day >= 20 && month == 4 || day <= 20 && month == 5) sign = "Телец ♉";
else if (day >= 21 && month == 5 || day <= 20 && month == 6) sign = "Близнецы ♊";
else if (day >= 21 && month == 6 || day <= 22 && month == 7) sign = "Рак ♋";
else if (day >= 23 && month == 7 || day <= 22 && month == 8) sign = "Лев ♌";
else if (day >= 23 && month == 8 || day <= 22 && month == 9) sign = "Дева ♍";
else if (day >= 23 && month == 9 || day <= 22 && month == 10) sign = "Весы ♎";
else if (day >= 23 && month == 10 || day <= 21 && month == 11) sign = "Скорпион ♏";
else if (day >= 22 && month == 11 || day <= 21 && month == 12) sign = "Стрелец ♐";
else if (day >= 22 && month == 12 || day <= 19 && month == 1) sign = "Козерог ♑";
else if (day >= 20 && month == 1 || day <= 18 && month == 2) sign = "Водолей ♒";
else if (day >= 19 && month == 2 || day <= 20 && month == 3) sign = "Рыбы ♓";

return sign;
}

function addSign() {

var links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// loop over all dates
var link = links.snapshotItem(0);

// create a containers
var addon1 = document.createElement("span");
addon1.style.color = "#808080";
addon1.setAttribute("id", "zodiac");

var addon2 = document.createElement("span");
addon2.setAttribute("id", "zodiac");

// determination colors of signs
var $ = zodiac(born.getDate(), born.getMonth() + 1);
if ($ == "Овен ♈" || $ == "Лев ♌" || $ == "Стрелец ♐")
addon2.style.color = "#FF6347";
else if ($ == "Телец ♉" || $ == "Дева ♍" || $ == "Козерог ♑")
addon2.style.color = "#1D1D1D";
else if ($ == "Близнецы ♊" || $ == "Весы ♎" || $ == "Водолей ♒")
addon2.style.color = "#9D9396";
else addon2.style.color = "#6495ED";

// fill a containers
addon1.innerHTML = "&nbsp;&nbsp;|&nbsp;&nbsp;";
addon2.innerHTML = $;

// attach them
link.parentNode.insertBefore(addon1, link.previousSibling);
link.parentNode.insertBefore(addon2, link.previousSibling);
}

/*
add age of person to page
input: date person is born
*/
function addAge() {

// find the difference between two times
var age = new Date() - born.getTime();

// convert difference into years
age = age / (1000 * 60 * 60 * 24 * 365.242199);

// get nice values
var years = Math.floor(age);
var months = Math.floor((age - years) * 10);

// try to determine 'word'
var word;
var dozens = Math.floor(years / 10);
var delta = years - 10 * dozens;
if ((years < 1) || ((years > 1) && (years < 5))) word = " года";
else if (((years > 21) && ((delta > 1) && (delta < 5))) || ((delta == 1) && (months != 0))) word = " года";
else if (((delta == 1) && (months == 0)) && ((years != 11) && (years != 111))) word = " год";
else word = " лет";

// don't show 0 month
if (months > 0) months = "," + months;
else months = "";

// loop over the tag involving dates
var links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// loop over all dates
var link = links.snapshotItem(0);

// create a container
var addon3 = document.createElement("span");
addon3.setAttribute("style", "margin-left: 4px;");
addon3.setAttribute("id", "zodiac");

// fill a container
addon3.innerHTML = " " + years + months + word;

// attach it
link.parentNode.insertBefore(addon3, link.previousSibling);
}

// get year from profile page
function getYear() {

// loop over the tag involving dates
var y_links = document.evaluate("//a[contains(@href,'[byear]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// loop over all dates
for (var i = 0; i < y_links.snapshotLength; i++) {
var y_link = y_links.snapshotItem(i);
var y_href = y_link.getAttribute("href");

// extract a year
if (y_href.indexOf('[byear]') != -1) {

// extract actual data
born.setFullYear(y_href.match(/\d{1,4}/g));
addAge();
}
}
}

// get dates from profile page
function getDates() {

// loop over the tag involving dates
var d_links = document.evaluate("//a[contains(@href,'[bday]')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// loop over all dates
for (var i = 0; i < d_links.snapshotLength; i++) {
var d_link = d_links.snapshotItem(i);
var d_href = d_link.getAttribute("href");

// extract date and month
if (d_href.indexOf('[bday]') != -1) {

// extract actual data
born.setMonth(parseFloat((d_href.match(/\d{1,2}/g)[1]) - 1));
born.setDate(d_href.match(/\d{1,2}/g)[0]);
addSign();
}
}
getYear();
}

getDates();

// checking for the existence
function checkExist() {
var z = document.getElementById("zodiac");
if (!z) getDates();
}

// AJAX rebuilding function
function rebuild() {
var watch = document.getElementById("page_layout");
if (watch !== null) {
watch.addEventListener("DOMNodeInserted", function(e) {
if (e.target.className == "profile_info" || e.target.id == "wrap2") checkExist();}, false);
}
}

rebuild();

//вывод id человека и прочей дряни

'use strict';
function addLeadingZeroToDate (date) {
return ('0' + date).slice(-2);
}
function convert24HoursTo12Hours (hours) {
hours = hours % 12;
return hours ? hours : 12;
}
function convert24HoursToAmPmLc (hours) {
return hours >= 12 ? 'pm' : 'am';
}
(function () {
new MutationObserver(function () {
var vkProfilePage = document.body.querySelector('#profile_short:not(.display_additional_information_in_vk_profile)');
if (!vkProfilePage) return;
var vkScripts = document.body.querySelectorAll('script');
if (!vkScripts) return;
var vkProfileId = (vkScripts[vkScripts.length - 1].textContent.match(/("|')user_id("|'):( *)(|"|')(\d+)/i) || [])[5];
if (!vkProfileId) return;
vkProfilePage.className += ' display_additional_information_in_vk_profile';
var vkPageLang = document.body.querySelector('a.ui_actions_menu_item[onclick*="lang_dialog"]');
var vkCurrentLang;
if (vkPageLang) {
vkCurrentLang = vkPageLang.textContent;
} else {
vkCurrentLang = navigator.language.substring(0, 2);
}
var vkLang, vkMonthName;
if (vkCurrentLang === 'Language: english' || vkCurrentLang === 'en') {
vkLang = 'en';
vkMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
} else if (vkCurrentLang === 'Язык: русский' || vkCurrentLang === 'ru') {
vkLang = 'ru';
vkMonthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
} else if (vkCurrentLang === 'Мова: українська' || vkCurrentLang === 'uk') {
vkLang = 'uk';
vkMonthName = ['сiчня', 'лютого', 'березня', 'квiтня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
}
var i = 0;
while (i < 4) {
var vkProfilePageElement = document.createElement('div');
vkProfilePageElement.style.display = 'none';
vkProfilePage.insertBefore(vkProfilePageElement, vkProfilePage.firstChild);
i++;
}
var vkProfileIdElement = document.createElement('div');
vkProfileIdElement.className = 'clear_fix profile_info_row';
if (vkLang === 'en') {
vkProfileIdElement.innerHTML =
'<div class="label fl_l">Profile ID:</div><div class="labeled">' + vkProfileId + '</div>';
} else if (vkLang === 'ru') {
vkProfileIdElement.innerHTML = '<div class="label fl_l">Номер страницы:</div><div class="labeled">' + vkProfileId + '</div>';
} else if (vkLang === 'uk') {
vkProfileIdElement.innerHTML = '<div class="label fl_l">Номер сторінки:</div><div class="labeled">' + vkProfileId + '</div>';
} else {
vkProfileIdElement.innerHTML = '<div class="label fl_l">Profile ID:</div><div class="labeled">' + vkProfileId + '</div>';
}
vkProfilePage.replaceChild(vkProfileIdElement, vkProfilePage.childNodes[0]);
var requestVkFoaf = new XMLHttpRequest();
requestVkFoaf.onreadystatechange = function () {
if (this.readyState === 4 && this.status === 200) {
var vkFoafRegDate = (this.responseText.match(/ya:created dc:date="(.+)"/i) || [])[1];
var vkFoafLastProfileEditDate = (this.responseText.match(/ya:modified dc:date="(.+)"/i) || [])[1];
var vkFoafLastSeenDate = (this.responseText.match(/ya:lastLoggedIn dc:date="(.+)"/i) || [])[1];
if (vkFoafRegDate) {
var vkRegDate = new Date(vkFoafRegDate);
var vkRegDateElement = document.createElement('div');
vkRegDateElement.className = 'clear_fix profile_info_row';
if (vkLang === 'en') {
vkRegDateElement.innerHTML = '<div class="label fl_l">Registration date:</div><div class="labeled">' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getDate() + ', ' + vkRegDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkRegDate.getHours()) + '</div>';
} else if (vkLang === 'ru') {
vkRegDateElement.innerHTML = '<div class="label fl_l">Дата регистрации:</div><div class="labeled">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' в ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
} else if (vkLang === 'uk') {
vkRegDateElement.innerHTML = '<div class="label fl_l">Дата реєстрації:</div><div class="labeled">' + vkRegDate.getDate() + ' ' + vkMonthName[vkRegDate.getMonth()] + ' ' + vkRegDate.getFullYear() + ' о ' + vkRegDate.getHours() + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
} else {
vkRegDateElement.innerHTML = '<div class="label fl_l">Registration date:</div><div class="labeled">' + addLeadingZeroToDate(vkRegDate.getDate()) + '.' + addLeadingZeroToDate(vkRegDate.getMonth() + 1) + '.' + vkRegDate.getFullYear() + ' ' + addLeadingZeroToDate(vkRegDate.getHours()) + ':' + addLeadingZeroToDate(vkRegDate.getMinutes()) + ':' + addLeadingZeroToDate(vkRegDate.getSeconds()) + '</div>';
}
vkProfilePage.replaceChild(vkRegDateElement, vkProfilePage.childNodes[1]);
} else {
console.info('Registration date on VK FOAF profile is empty or unavailable');
}
if (vkFoafLastProfileEditDate) {
var vkLastProfileEditDate = new Date(vkFoafLastProfileEditDate);
var vkLastProfileEditDateElement = document.createElement('div');
vkLastProfileEditDateElement.className = 'clear_fix profile_info_row';
if (vkLang === 'en') {
vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Last profile edit:</div><div class="labeled">' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getDate() + ', ' + vkLastProfileEditDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastProfileEditDate.getHours()) + '</div>';
} else if (vkLang === 'ru') {
vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Посл. ред. страницы:</div><div class="labeled">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' +
vkLastProfileEditDate.getFullYear() + ' в ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
} else if (vkLang === 'uk') {
vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Останнє ред. стор.:</div><div class="labeled">' + vkLastProfileEditDate.getDate() + ' ' + vkMonthName[vkLastProfileEditDate.getMonth()] + ' ' + vkLastProfileEditDate.getFullYear() + ' о ' + vkLastProfileEditDate.getHours() + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
} else {
vkLastProfileEditDateElement.innerHTML = '<div class="label fl_l">Last profile edit:</div><div class="labeled">' + addLeadingZeroToDate(vkLastProfileEditDate.getDate()) + '.' + addLeadingZeroToDate(vkLastProfileEditDate.getMonth() + 1) + '.' + vkLastProfileEditDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastProfileEditDate.getHours()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastProfileEditDate.getSeconds()) + '</div>';
}
vkProfilePage.replaceChild(vkLastProfileEditDateElement, vkProfilePage.childNodes[2]);
} else {
console.info('Last profile editing date on VK FOAF profile is empty or unavailable');
}
if (vkFoafLastSeenDate) {
var vkLastSeenDate = new Date(vkFoafLastSeenDate);
var vkLastSeenDateElement = document.createElement('div');
vkLastSeenDateElement.className = 'clear_fix profile_info_row';
if (vkLang === 'en') {
vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Last seen:</div><div class="labeled">' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getDate() + ', ' + vkLastSeenDate.getFullYear() + ' at ' + convert24HoursTo12Hours(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + ' ' + convert24HoursToAmPmLc(vkLastSeenDate.getHours()) + '</div>';
} else if (vkLang === 'ru') {
vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Последний заход:</div><div class="labeled">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' в ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
} else if (vkLang === 'uk') {
vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Останній візит:</div><div class="labeled">' + vkLastSeenDate.getDate() + ' ' + vkMonthName[vkLastSeenDate.getMonth()] + ' ' + vkLastSeenDate.getFullYear() + ' о ' + vkLastSeenDate.getHours() + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
} else {
vkLastSeenDateElement.innerHTML = '<div class="label fl_l">Last seen:</div><div class="labeled">' + addLeadingZeroToDate(vkLastSeenDate.getDate()) + '.' + addLeadingZeroToDate(vkLastSeenDate.getMonth() + 1) + '.' + vkLastSeenDate.getFullYear() + ' ' + addLeadingZeroToDate(vkLastSeenDate.getHours()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getMinutes()) + ':' + addLeadingZeroToDate(vkLastSeenDate.getSeconds()) + '</div>';
}
vkProfilePage.replaceChild(vkLastSeenDateElement, vkProfilePage.childNodes[3]);
} else {
console.info('Last seen date on VK FOAF profile is empty or unavailable');
}
} else if (this.readyState === 4 && this.status !== 200) {
console.error('Failed to get VK FOAF profile (registration date, last profile edit date and last seen date): ' + this.status + ' ' + this.statusText);
}
};
requestVkFoaf.open('GET', '/foaf.php?id=' + vkProfileId, true);
requestVkFoaf.send();
}).observe(document.body, { childList: true, subtree: true });
})();
