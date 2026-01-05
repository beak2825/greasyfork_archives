// ==UserScript==
// @name         NGU Custom Script
// @version      1.0
// @description  Dark Theme for NGU (Covers most pages)
// @author       Ludicrous Beach
// @match        http://www.nextgenupdate.com/forums/*
// @grant        none
// @namespace    NGUbeach
// @downloadURL https://update.greasyfork.org/scripts/17649/NGU%20Custom%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/17649/NGU%20Custom%20Script.meta.js
// ==/UserScript==

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function isBoolOn(name)
{
    var notify = getCookie(name);
    if (notify == "")
    {
        setCookie(name, "0", 30);
        return false;
    }
    return notify == "1";
}
function toggleBool(name, refresh)
{
    var notify = getCookie(name);
    if (notify == "0")
        setCookie(name, "1", 30);
    else
        setCookie(name, "0", 30);
    
    if (refresh == 1)
        location.reload();
}


//Footer
if (isBoolOn("bFooter"))
{
    addGlobalStyle('.jb_footer_col.scol { height: 460px !important; }');
    addGlobalStyle('.jb_footer_staffuser_avatar { height: 30px !important; width: 30px !important; }');
    addGlobalStyle('#jb_footer_staffonline a.username { font-size: 12pt !important; }');
    addGlobalStyle('.jb_footer_staffuser_box { border-bottom: 1px solid #d6d9dc !important; }');
    addGlobalStyle('.jb_footer_col.lcol { height: 460px !important; }');
}

//DarkTheme
var lightDark = "#2F2F2F";
var darkDark = "#292929";
var lightLight = "#FFFFFF";
var darkLight = "#D6D6D6";
var nguBlue = "#2BA5F3";
var nguBlueDarker = "#009CFF";
var mainShoutboxColor = "#454545";

if (isBoolOn("bDark"))
{
    //Darks
    addGlobalStyle('body { background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('.body_wrapper { background: ' + darkDark + ' none !important; }');
    addGlobalStyle('.forumhome_left { background-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.forumhome_left { background-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.forumhome_forum_block_title { background-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.forumhome_forum_block { border: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.jb_footer_col_header { background-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.jb_footer_col_body { border: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.jb_footer_hot_forum_box { border-bottom: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.forumhome_forum_bit { border-bottom: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.jb_footer_staffuser_box { border-bottom: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('#nguheader .dropdown-menu { background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('#nguheader .dropdown-menu>li>a:hover { background-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.forumhome_subforum_indicator { background-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('.fhsidebar_popular_forums_block { border: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.fhsidebar_popular_forums_block_header { color: ' + nguBlue + ' !important; }');
    addGlobalStyle('#nguheader .thread_listing_separator { border-top: 8px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.pagination span a { border: 1px solid ' + lightDark + ' !important; }');
    addGlobalStyle('.pagination span a:hover { border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.newcontent_textcontrol { box-shadow: 1px 0px 1px ' + mainShoutboxColor + '; border: 1px solid ' + mainShoutboxColor + '; background: ' + lightDark + '; }');
    addGlobalStyle('.newcontent_textcontrol:hover { box-shadow: 1px 0px 1px ' + mainShoutboxColor + '; border: 1px solid ' + mainShoutboxColor + '; background: ' + mainShoutboxColor + '; }');
    addGlobalStyle('.jb_pagination_pagelink_selected { background-color: ' + nguBlue + ' !important; }');
    addGlobalStyle('.jb_pagination_pagelink:hover { background-color: ' + nguBlue + ' !important; color: ' + darkLight + ' !important; }');
    addGlobalStyle('.jb_pagination_prevnext { background-color: ' + lightDark + '; }');
    addGlobalStyle('.jb_pagination_prevnext:hover { background-color: ' + nguBlue + ' !important; }');
    addGlobalStyle('.blockhead { background: url(/forums/images/connect.png) no-repeat scroll 10px center ' + lightDark + '!important; border: 1px solid ' + mainShoutboxColor + ' !important; color: ' + lightLight + ' !important; text-shadow: 0px 0 ' + darkLight + '; }');
    addGlobalStyle('.button { padding: 4px; border-radius: 2px; background: ' + lightDark + ' !important; border: 1px solid ' + mainShoutboxColor + '; color: ' + darkLight + '; }');
    addGlobalStyle('.button:hover { color: ' + nguBlue + '; cursor: pointer; }');
    addGlobalStyle('.primary { color: ' + darkLight + '; background-color: ' + lightDark + '; border-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('.formcontrols .blockrow input.textbox:focus, .formcontrols .blockrow textarea:focus { color: ' + darkLight + '; background-color: ' + darkDark + '; border-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('#sidebar_container.member_summary { box-shadow: -2px 2px 2px ' + mainShoutboxColor + '; color: ' + darkLight + '; background-color: ' + lightDark + '; border-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('#sidebar_container.member_summary .mainblock a.avatar .avatarcontainer img { border-color: ' + mainShoutboxColor + '; outline: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('#rate_btn { background-color: ' + darkDark + '; border-color: ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('#sidebar_container .userprof_content .blockrow { background-color: ' + lightDark + '; border-color: ' + lightDark + ' !important; }');
    addGlobalStyle('.userprof_content_border { border-color: ' + lightDark + ' !important; }');
    addGlobalStyle('li.activitybit { background: ' + lightDark + ' none no-repeat; border: 1px solid ' + mainShoutboxColor + '; color: ' + darkLight + '; }');
    addGlobalStyle('.activitystream_block dd.selected, dd.userprof_module { border-color: ' + nguBlueDarker + '; background-color: ' + nguBlue + '; }');
    addGlobalStyle('.activitystream_block dd, dd.userprof_moduleinactive { border-color: ' + mainShoutboxColor + ' !important; background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('.activitystream_block dd, dd.userprof_moduleinactive:hover { border-color: ' + mainShoutboxColor + ' !important; background-color: ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('#activity_tab_container>div { background-color: ' + lightDark + '; }');
    addGlobalStyle('.memberprofiletabunder { background-color: ' + nguBlue + '; border-top-left-radius: 3px; border-top-right-radius: 3px; }');
    addGlobalStyle('dl.as-tabs dd#asall a { background-color: ' + lightDark + '; }');
    addGlobalStyle('dl.as-tabs dd#asall { border: 0px; }');
    addGlobalStyle('dl.as-tabs dd#asuser a { margin-left: 2px; background-color: ' + lightDark + '; }');
    addGlobalStyle('dl.as-tabs dd#asuser { border: 0px; }');
    addGlobalStyle('dl.as-tabs dd#asfriend a { margin-left: 2px; background-color: ' + lightDark + '; }');
    addGlobalStyle('dl.as-tabs dd#asfriend { border: 0px; }');
    addGlobalStyle('dl.as-tabs dd#assub a { margin-left: 2px; background-color: ' + lightDark + '; }');
    addGlobalStyle('dl.as-tabs dd#assub { border: 0px; }');
    addGlobalStyle('dl.as-tabs dd#asphoto a { margin-left: 2px; background-color: ' + lightDark + '; }');
    addGlobalStyle('dl.as-tabs dd#asphoto { border: 0px; }');
    addGlobalStyle('.userprof_content { background-color: ' + lightDark + '; color: ' + darkLight + '; }');
    addGlobalStyle('.userprof_headers { background-color: ' + nguBlue + '; color: ' + lightDark + '; }');
    addGlobalStyle('.userprof_headers_border { border-color: ' + nguBlueDarker + '; }');
    addGlobalStyle('li.userprof_content { color: ' + darkLight + '; background-color: ' + lightDark + '; border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.profile_content .infractions_block .inflisthead { border-bottom: 1px solid ' + nguBlue + '; }');
    addGlobalStyle('.userprof_editor { background-color: ' + lightDark + '; }');
    addGlobalStyle('.userprof_moduleinactive { border-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('.cke_skin_kama { border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.cke_skin_kama .cke_wrapper.cke_ltr, .cke_skin_kama .cke_wrapper.cke_rtl { background: ' + lightDark + '; }');
    addGlobalStyle('.texteditor.content .cke_skin_kama textarea.cke_source, .texteditor textarea { background: ' + darkDark + '; color: ' + darkLight + '; }');
    addGlobalStyle('.formcontrols .blockrow { border-top: solid 1px ' + mainShoutboxColor + '; }');
    addGlobalStyle('.userprof_button { color: ' + darkLight + '; background-color: ' + darkDark + '; border: 1px solid ' + mainShoutboxColor + '; padding: 4px; border-radius: 4px; }');
    addGlobalStyle('.userprof_button:hover { color: ' + nguBlue + '; }');
    addGlobalStyle('.cke_skin_kama .cke_editor .cke_rcombo a, .cke_skin_kama .cke_editor .cke_toolgroup { background: ' + darkDark + '; }');
    addGlobalStyle('.cke_skin_kama div.cke_bottom_restore_autosave a.restoretext { border: 1px solid ' + mainShoutboxColor + '; background: ' + darkDark + '; color: ' + darkLight + ' !important; opacity: 1.0; }');
    addGlobalStyle('.cke_skin_kama div.cke_bottom_restore_autosave a.restoretext:hover { background: ' + mainShoutboxColor + '; color: ' + nguBlue + ' !important; }');
    addGlobalStyle('.cke_skin_kama .cke_editor .cke_rcombo a:hover, .cke_skin_kama .cke_editor .cke_rcombo a:focus, .cke_skin_kama .cke_editor .cke_rcombo a:active, .cke_skin_kama .cke_editor .cke_button a:hover, .cke_skin_kama .cke_editor .cke_button a:focus, .cke_skin_kama .cke_editor .cke_button a:active { border-color: ' + mainShoutboxColor + '; background-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('.userprof_button:hover { border-bottom: 1px solid ' + mainShoutboxColor + '; border-right: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.postbit .postbody { color: ' + darkLight + '; background: ' + darkDark + '; }');
    addGlobalStyle('.postbit, .postbitlegacy, .eventbit { border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.postbit .posttitle, .postbitlegacy .title { border-bottom: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.formcontrols .blockrow { background: ' + lightDark + '; }');
    addGlobalStyle('.texteditor.forum .cke_skin_kama textarea.cke_source, .texteditor.forum textarea { background: ' + darkDark + '; color: ' + darkLight + ' !important; }');
    addGlobalStyle('.intro_block .text { background: ' + lightDark + '; }');
    addGlobalStyle('.intro_block { -webkit-box-shadow: -2px 2px 2px ' + mainShoutboxColor + '; }');
    addGlobalStyle('.blockbody { background: ' + lightDark + '; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.blocksubhead { background: ' + lightDark + '; border-top: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.groupbit:hover .blockfoot { background: ' + lightDark + '; }');
    addGlobalStyle('.groupbit .avatarlink { border: 2px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('* html .navpopupmenu.popupmenu.nohovermenu a.textcontrol, .navpopupmenu a.textcontrol, .navpopupmenu a.popupctrl, .navpopupmenu.popupmenu.nohovermenu a.textcontrol, .navpopupmenu.popupmenu.nohovermenu a.popupctrl { background: ' + darkDark + ' !important; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.navpopupmenu a.textcontrol:hover, .navpopupmenu a.popupctrl:hover, .navpopupmenu.popupmenu.nohovermenu a.textcontrol:hover, .navpopupmenu.popupmenu.nohovermenu a.popupctrl:hover { background: ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.popupbody { background: ' + darkDark + '; border: 1px solid ' + darkDark + '; }');
    addGlobalStyle('.popupbody li a, .popupbody li label { background: ' + lightDark + '; }');
    addGlobalStyle('.popupbody li { border-top: solid 1px ' + mainShoutboxColor + '; }');
    addGlobalStyle('.popupbody li>a:hover, .popupbody li>label:hover { background: ' + darkDark + '; }');
    addGlobalStyle('.postbitdeleted, .postbitignored { color: ' + darkLight + '; border: solid 1px ' + mainShoutboxColor + '; background: ' + darkDark + '; }');
    addGlobalStyle('.postbitdeleted .posthead, .postbitignored .posthead { border: solid 1px ' + nguBlueDarker + '; background: ' + nguBlue + '; }');
    addGlobalStyle('.postbitdeleted .userinfo, .postbitignored .userinfo { border-bottom: solid 1px ' + mainShoutboxColor + '; }');
    addGlobalStyle('.postbitdeleted .nodecontrols, .postbitignored .nodecontrols { background: ' + darkDark + '; }');
    addGlobalStyle('.postbitdeleted .nodecontrols .textcontrol, .postbitignored .nodecontrols .textcontrol { background: ' + darkDark + '; }');
    addGlobalStyle('.jb_quote_container { background-color: ' + lightDark + '; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.jb_quote_head { border-bottom: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.jb_quote_body { background-color: ' + darkDark + '; }');
    addGlobalStyle('#usercp_nav .blockrow { background-color: ' + lightDark + '; }');
    addGlobalStyle('#usercp_nav .blockrow .active { background-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('#usercp_nav .blockrow a:hover { background-color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('#usercp_nav hr { background: ' + mainShoutboxColor + '; border-color: ' + mainShoutboxColor + '; color: ' + mainShoutboxColor + '; }');
    addGlobalStyle('#usercp_nav .blocksubhead { background: ' + nguBlue + '; color: ' + darkLight + '; }');
    addGlobalStyle('.blockfoot, .blocksubfoot { background: ' + lightDark + '; }');
    addGlobalStyle('.pmlist .blockrow { border-top: solid 1px ' + mainShoutboxColor + '; background: ' + lightDark + '; }');
    addGlobalStyle('.actionbuttons .group .button:hover { color: ' + nguBlue + '; }');
    addGlobalStyle('.actionbuttons .group .button { color: ' + darkLight + '; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.textbox, textarea, select { color: ' + darkLight + '; background: ' + lightDark + '; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.bootstrap .well { background-color: ' + lightDark + ' !important; border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.subhead { border-bottom: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap hr { border-top: 1px solid ' + mainShoutboxColor + ' !important; border-bottom: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .btn { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.bootstrap .modal { background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('.bootstrap .modal-footer { background-color: ' + darkDark + ' !important; border-top: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .modal-header { border-bottom: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .btn { background: ' + nguBlue + ' !important; text-shadow: 0 0px 0px #fff !important; }');
    addGlobalStyle('.bootstrap textarea, .bootstrap input[type="text"], .bootstrap input[type="password"], .bootstrap input[type="datetime"], .bootstrap input[type="datetime-local"], .bootstrap input[type="date"], .bootstrap input[type="month"], .bootstrap input[type="time"], .bootstrap input[type="week"], .bootstrap input[type="number"], .bootstrap input[type="email"], .bootstrap input[type="url"], .bootstrap input[type="search"], .bootstrap input[type="tel"], .bootstrap input[type="color"], .bootstrap .uneditable-input { color: ' + lightLight + ' !important; background: ' + lightDark + ' !important; border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .nav-tabs > .active > a, .bootstrap .nav-tabs > .active > a:hover { background: ' + lightDark + ' !important; border: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .nav-tabs > li > a:hover { border-color: ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.bootstrap .nav > li > a:hover { background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('.bootstrap .nav-tabs { border-bottom: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('ul.userlist_showavatars li { border: solid 2px ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('.cke_skin_kama .cke_dialog_contents a.cke_dialog_ui_button_ok, .cke_skin_kama .cke_dialog_contents a.cke_dialog_ui_button_cancel, .textcontrols a, a.textcontrol { border: solid 1px ' + mainShoutboxColor + '; background: ' + lightDark + '; border-radius: 3px; }');
    addGlobalStyle('.summaryinfo.pos { margin-left: 10px !important; }');
    addGlobalStyle('.reputationbits .summaryinfo, #infractionslist .summaryinfo { margin-left: 10px !important; }');
    addGlobalStyle('#memberlist_table td.alt1 { background: ' + lightDark + '; }');
    addGlobalStyle('#memberlist_table tr td { border-bottom: 0px; }');
    addGlobalStyle('.joindate, .post, .membership { border-left: 0px; }');
    addGlobalStyle('.columnsort a:hover { background-color: ' + darkDark + '; }');
    addGlobalStyle('#charnav { border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('#charnav dd a { border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('#inlinemod_formctrls .popupctrl { background: ' + lightDark + '; border-radius: 3px; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('#inlinemod_formctrls a.popupctrl:hover { background: ' + mainShoutboxColor + '; }');
    addGlobalStyle('h2.searchlisthead { background: ' + nguBlue + '; border: 1px solid ' + mainShoutboxColor + '; box-shadow: -2px 2px 2px ' + mainShoutboxColor + '; }');
    addGlobalStyle('h2.searchlisthead a { color: ' + lightLight + ' !important; }');
    addGlobalStyle('.threadbit { color: ' + darkLight + '; box-shadow: -2px 2px 2px ' + mainShoutboxColor + '; }');
    addGlobalStyle('.threadbit .nonsticky, .threadbit .discussionrow { background: ' + lightDark + '; }');
    addGlobalStyle('.threadbit .sticky { background: ' + lightDark + '; border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.threadbit .alt { background: ' + lightDark + '; }');
    addGlobalStyle('.threadbit .nonsticky, .threadbit .deleted, .threadbit .discussionrow, .threadbit .ignored { border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('.pagination span a { border: 1px solid ' + darkDark + ' !important; background: ' + lightDark + '; }');
    addGlobalStyle('.pagination span a.popupctrl { background: ' + lightDark + '; }');
    addGlobalStyle('.pagination span.selected a { background: ' + nguBlue + '; color: ' + lightLight + ' !important; }');
    addGlobalStyle('.notification-container { background: ' + lightDark + '; }');

    //Lights
    addGlobalStyle('.forumhome_forum_text { color: ' + lightLight + ' !important; }');
    addGlobalStyle('.forumhome_lastpost_thread { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.block1 p { color: ' + darkLight + ' !important; }');
    addGlobalStyle('#vbulletin_copyright_text, #vbulletin_copyright_text a { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.block2 a { color: ' + darkLight + ' !important; }');
    addGlobalStyle('#nguheader a { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.jb_footer_hot_forum_box { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.ngu-content-mgr { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.commalist li { color: ' + darkLight + ' !important; }');
    addGlobalStyle('#nguheader .alert-info { background-color: ' + nguBlue + ' !important; border-color: ' + nguBlueDarker + ' !important; color: ' + lightLight + ' !important; }');
    addGlobalStyle('#nguheader .glyphicon { color: ' + darkLight + ' !important; }');
    addGlobalStyle('#nguheader .dropdown-header { color: ' + nguBlue + ' !important; }');
    addGlobalStyle('.forumhome_subforum_text { color: ' + darkLight + '; }');
    addGlobalStyle('.time { color: ' + darkLight + '; }');
    addGlobalStyle('#nguheader .notif-divider { border-left: 1px solid ' + darkLight + '; }');
    addGlobalStyle('.forumhome_forum_text { color: ' + darkLight + '; }');
    addGlobalStyle('.enzo-bar { border: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('body { color: ' + darkLight + ' !important; }');
    addGlobalStyle('body a { color: ' + nguBlue + ' !important; }');
    addGlobalStyle('.navbit a:hover { border-color: ' + lightDark + ' !important; background-color: ' + lightDark + ' !important; }');
    addGlobalStyle('#nguheader a.forumdisplay_navbar_link { border-right: 2px solid ' + lightDark + ' !important; }');
    addGlobalStyle('#nguheader a>.threadbit_thread_title { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.forumhome_forumbit_left { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.forumhome_forumbit_right { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.forum_info { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.reputation p span { color: ' + darkLight + '; }');
    addGlobalStyle('dl.stats dt, #sidebar_container dl.stats, #sidebar_container .blockbody.userprof_content, #sidebar_container .userprof_content .time, .userprof_content .time { color: ' + darkLight + ' }');
    addGlobalStyle('.member_summary dd.avatar img { border: 1px solid ' + mainShoutboxColor + '; }');
    addGlobalStyle('#sidebar_container .blocksubhead { color: ' + darkLight + '; }');
    addGlobalStyle('#sidebar_container .userprof_content .blockrow { color: ' + darkLight + '; }');
    addGlobalStyle('#profile_tabs a, #profile_tabs a { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.userprof_title { color: ' + darkLight + '; }');
    addGlobalStyle('.userprof_content .shade { color: ' + darkLight + '; }');
    addGlobalStyle('.navpopupbody li.optionlabel { color: ' + darkLight + '; }');
    addGlobalStyle('.folder_count { color: ' + darkLight + ' !important; }');
    addGlobalStyle('legend { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.blocksubhead { color: ' + darkLight + '; }');
    addGlobalStyle('.skinbox_user_bar .popupbody li a, .popupbody li label { color: ' + darkLight + ' !important; }');
    addGlobalStyle('.popupbody li.formsubmit input[type="submit"]:hover, .popupbody li.formsubmit input[type="reset"]:hover, .popupbody li.formsubmit input[type="button"]:hover { color: ' + nguBlue + '; }');
    addGlobalStyle('.notification-title { color: ' + darkLight + '; }');
    addGlobalStyle('.notification-info { color: ' + darkLight + '; }');
    
    //Shoutbox
    addGlobalStyle('#nguheader .container-fluid.shoutbox_head { background: ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('#nguheader .form-control.shoutbox_editor { background-color: ' + lightDark + ' !important; border-color: ' + darkDark + ' !important; }');
    addGlobalStyle('#nguheader .btn-default { color: ' + darkLight + ' !important; background-color: ' + lightDark + ' !important; border-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.shoutbox_body { color: ' + darkLight + ' !important; border: 2px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('#nguheader .nav-tabs { border-bottom: 1px solid ' + mainShoutboxColor + ' !important; }');
    addGlobalStyle('#nguheader .form-control { color: ' + darkLight + ' !important; background-color: ' + lightDark + ' !important; border-color: ' + darkDark + ' !important; }');
    addGlobalStyle('.highlight { background: ' + nguBlue + ' none repeat-x !important; padding: 0px 4px 0px 4px; border-radius: 4px; }');

    //Scroll Bars
    var scrollLight = "#454545";
    var scrollDark = "#292929";

    addGlobalStyle('::-webkit-scrollbar { width: 12px !important; }');
    addGlobalStyle('::-webkit-scrollbar-track { background-color: ' + scrollDark + ' !important; }');
    addGlobalStyle('::-webkit-scrollbar-thumb { background-color: ' + scrollLight + ' !important; border-radius: 50px !important; }');
}

if (isBoolOn("bLargeSB"))
{
    addGlobalStyle('.shoutbox_body { min-height: 410px !important; }');
    addGlobalStyle('#nguheader .container-fluid.shoutbox_body_cont { height: 410px !important; }');
}

if (window.location == "http://www.nextgenupdate.com/forums/")
{
    document.getElementById("fhsidebar_popular_forums_block").children[0].setAttribute("class", "fhsidebar_popular_forums_block_header");
    document.getElementById("fhsidebar_popular_forums_block").setAttribute("class", "fhsidebar_popular_forums_block");
    iboxoshouts.update_shouts = function(shouts)
    {
        iboxoshouts.shoutframe.innerHTML = '';
        iboxoshouts.shoutframe.innerHTML = shouts;

        if (iboxoshouts.newestbottom && iboxoshouts.shoutframe.scrollTop < iboxoshouts.shoutframe.scrollHeight)
        {
            iboxoshouts.shoutframe.scrollTop = iboxoshouts.shoutframe.scrollHeight;
        }
        shoutboxCheck();
    }
}
else if (window.location.href == "http://www.nextgenupdate.com/forums/infernoshout.php?do=detach" && isBoolOn("bDark"))
    document.getElementById("sb_body").setAttribute("style", "border: 0px; height: 100%; background: " + lightDark + ";");
else if (window.location.href.match("^http://www.nextgenupdate.com/forums/members/.*\.html"))
{
    if (isBoolOn("bDark"))
    {
        var elitebanner = document.getElementById("dave");
        if (elitebanner != null)
        {
            document.getElementById("dave").innerHTML = "";
        }
    }
}
else
{
    if (isBoolOn("bDark"))
    {
        var enzobar = document.getElementById("enzobar");
        if (enzobar != null)
        {
            enzobar.setAttribute("class", "enzo-bar");
            enzobar.children[0].children[0].children[0].setAttribute("style", "height: 100%; border-right: 2px solid " + lightDark + ";font-size: 14px;font-family: 'Open Sans', sans-serif;position: relative;text-transform:uppercase;color:" + darkLight + ";padding-top: 12px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;");
        }
        var pagination_top = document.getElementById("pagination_top");
        if (pagination_top != null)
            pagination_top.setAttribute("style", "float: right;right: 0;margin-top: -18px; background: " + darkDark + ";");

        var panels = document.getElementsByClassName("panel-default");
        for (var i = 0; i < panels.length; i++)
        {
            try
            {
                var desktop_postbit = panels[i].children[2];
                if (desktop_postbit != null)
                {
                    desktop_postbit.setAttribute("style", "margin: 0; border-bottom: 2px solid " + mainShoutboxColor + ";background: " + darkDark + ";");
                    desktop_postbit.children[0].setAttribute("style", "height: 80px; border-right: 2px solid " + mainShoutboxColor + "; padding-top: 12px; padding-bottom: 12px; overflow: hidden; font-family: 'Open Sans', sans-serif;");
                    desktop_postbit.children[0].children[1].children[0].children[0].style.color = darkLight;
                    desktop_postbit.children[1].setAttribute("style", "height: 80px; border-right: 2px solid " + mainShoutboxColor + "; text-align: center;");
                    desktop_postbit.children[2].setAttribute("style", "height: 80px; border-right: 2px solid " + mainShoutboxColor + "; text-align: center; padding-left: 2px; padding-right: 2px;");
                    desktop_postbit.children[3].setAttribute("style", "height: 80px; border-right: 2px solid " + mainShoutboxColor + "; text-align: center;");
                    desktop_postbit.children[4].setAttribute("style", "height: 80px; border-right: 2px solid " + mainShoutboxColor + "; padding-left: 5px; padding-right: 5px;");
                    desktop_postbit.children[6].setAttribute("style", "height: 80px; padding-left: 5px; padding-right: 5px; border-left: 2px solid " + mainShoutboxColor + ";");
                }
            }
            catch (err)
            {

            }
        }
    }
}

//Shoutbox
var myUsername = document.getElementsByClassName("userinfo-carat")[0].children[0].innerText;
function shoutboxCheck()
{
    var sb = document.getElementById("shoutbox_frame");
    var sb_msgs = sb.children;
    
    for (var i = 1; i < sb.children.length; i++)
    {
        if (isBoolOn("bDark"))
            sbUpdateLightColours(sb_msgs[i]);
        if (isBoolOn("bAutoEmbed"))
            sbEmbedImage(sb_msgs[i]);
    }
    
    if (isBoolOn("bNotify"))
    {
        var lowerHTML = sb_msgs[1].innerHTML.toLowerCase();
        var username = [ myUsername.toLowerCase() ];
        if (username[0].indexOf(" ") > -1)//Name with space(s)
            username = username[0].split(" ");
        for (var i = 0; i < username.length; i++)
        {
            if (sbMentionCheck(sb_msgs, lowerHTML, username[i]))
                break;
        }
    }
}

function sbMentionCheck(sb_msgs, lowerHTML, username)
{
    
    if (lowerHTML.indexOf(username) > -1)
    {
        var user = sb_msgs[1].children[1].children[0].innerText;
        if (user != myUsername)
        {
            show_notification(user, "Mentioned your name in the shoutbox.", "http://www.nextgenupdate.com/favicon.ico", "");
            alert_audio.play();
            return true;
        }
    }
    return false;
}

function sbUpdateLightColours(msgs) 
{
    try
    {
        msg = msgs.children[2];
        if (msg.tagName == "FONT")
        {
            if (msg.getAttribute("color") == "Black")
                msg.setAttribute("color", "#D6D6D6");
            else if (msg.getAttribute("color") == "Blue")
                msg.setAttribute("color", "#1E90FF");
        }
        else if (msg.tagName == "A")
        {
            msg = msgs.children[3];//Deal with preceding image
            if (msg.getAttribute("color") == "Black")
                msg.setAttribute("color", "#D6D6D6");
            else if (msg.getAttribute("color") == "Blue")
                msg.setAttribute("color", "#1E90FF");
        }
    }
    catch (Exception)
    {

    }
}
function sbEmbedImage(msgs)
{
    try
    {
        msg = msgs.children[2];
        while (msg.children.length > 0)
        {
            msg = msg.children[0];
        }
        if (msg.tagName == "IMG" || msg.tagName == "A")
            msg = msg.parentElement;
        var thtml = msg.innerHTML;
        var resp = thtml.match('(.*)<a href="(.*)\.(jpg|gif|png)" target="_blank">(.*)</a>(.*)');
        if (resp != null)
        {
            var result = resp[1] + '<img src="' + resp[2] + '.' + resp[3] + '" alt="' + resp[4] + '" style="max-height: 250px;">' + resp[5];
            msg.innerHTML = result;
        }
        
        thtml = msg.innerHTML;
        resp = thtml.match('(.*)<a href\="https\://www\.youtube\.com/watch\\?v\=(.*)" target\="_blank">(.*)</a>(.*)');
        if (resp != null)
        {
            result = resp[1] + '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + resp[2] + '" frameborder="0" allowfullscreen></iframe>' + resp[4];
            msg.innerHTML = result;
        }
    }
    catch (Exception)
    {

    }
}

//Settings Dropdown + Modal
var dropDownUL = document.getElementsByClassName("userinfo-carat")[0].children[1];
dropDownUL.children[dropDownUL.children.length - 2].outerHTML += '<li><a data-toggle="modal" href="#my-options">Settings</a></li>';


var modal = `<div class="modal hide" id="my-options" style="width: 580px; display: none;" aria-hidden="true">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">x</button>
<h3>Settings</h3>
</div>
<div class="modal-body">
<form class="form-horizontal">
<fieldset style="font-family: arial; font-size: 20px;">
<div class="control-group">
<label class="control-label">Notify: </label>
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="toggleNotify"`;
if (isBoolOn("bNotify"))
    modal += ' checked';
modal += `>
Enable this to show a notification whenever your name is mentioned in the shoutbox.
</label>
</div>
</div>
<div class="control-group">
<label class="control-label">Footer: </label>
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="toggleFooter"`;
if (isBoolOn("bFooter"))
    modal += ' checked';
modal += `>
This increases the size of the homepage footer, and reduces the size of the Staff Online 
</label>
</div>
</div>
<div class="control-group">
<label class="control-label">Dark Theme: </label>
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="toggleTheme"`;
if (isBoolOn("bDark"))
    modal += ' checked';
modal += `>
Enable this to activate the NGU dark theme.
</label>
</div>
</div>
<div class="control-group">
<label class="control-label">Large Shoutbox: </label>
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="toggleLargeSB"`;
if (isBoolOn("bLargeSB"))
    modal += ' checked';
modal += `>
Enable this make the shoutbox double the length.
</label>
</div>
</div>
<div class="control-group">
<label class="control-label">Auto Embed: </label>
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="toggleAutoEmbed"`;
if (isBoolOn("bAutoEmbed"))
    modal += ' checked';
modal += `>
Enable this to make all shouts with an image/youtube video in show embedded.
</label>
</div>
</div>
</fieldset>
</form>
</div>
<div class="modal-footer">
<a href="#" class="btn" data-dismiss="modal">Close</a>
</div>
</div>`;

var headerr;
if (window.location == "http://www.nextgenupdate.com/forums/")
{
    headerr = document.getElementById("ngusb-options").parentElement;
    headerr.innerHTML = modal + headerr.innerHTML;
}
else
{
    //headerr = document.getElementsByTagName("BODY")[0];
     headerr = document.getElementById("container_ns");
    headerr.innerHTML = '<div class="bootstrap">' + modal + "</div>" + headerr.innerHTML;
}

$("#toggleTheme").click(function(event) {
    toggleBool("bDark", 1);
});
$("#toggleFooter").click(function(event) {
    toggleBool("bFooter", 1);
});
$("#toggleNotify").click(function(event) {
    toggleBool("bNotify", 0);
});
$("#toggleLargeSB").click(function(event) {
    toggleBool("bLargeSB", 1);
});
$("#toggleAutoEmbed").click(function(event) {
    toggleBool("bAutoEmbed", 0);
});
