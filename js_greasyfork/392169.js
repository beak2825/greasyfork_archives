// ==UserScript==
// @name          Dark VK Theme
// @description	  Тёмная тема для VK
// @author        DygDyg
// @homepage      http://dygdyg.ddns.net
// @include       https://vk.com/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require       https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @icon          https://vk.com/images/icons/favicons/fav_logo.ico
// @version       0.0.11.82
// @run-at        document-start
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant 		  GM_info
// @grant         GM_unregisterMenuCommand
// @grant         GM_registerMenuCommand
// @grant         GM_openInTab
// @grant         GM_getResourceText
// @grant         GM_notification
// @license       MIT

// @namespace https://greasyfork.org/users/303755
// @downloadURL https://update.greasyfork.org/scripts/392169/Dark%20VK%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/392169/Dark%20VK%20Theme.meta.js
// ==/UserScript==

var $ = window.jQuery

var darkStyle1, darkStyle, darkStyleBacground, combo_hide_style

if (GM_getValue('enable', null) == null) GM_setValue('enable', true)
if (GM_getValue('names', null) == null) GM_setValue('names', JSON.stringify([]))
if (GM_getValue('debug', null) == null) GM_setValue('debug', false)
if (GM_getValue('group', null) == null) GM_setValue('group', 'Группы')
if (GM_getValue('message_name', null) == null) GM_setValue('message_name', 'Сообщения')
if (GM_getValue('ver_info', null) == null) GM_setValue('ver_info', '0')
if (GM_getValue('combo_hide', null) == null) GM_setValue('combo_hide', false)
if (GM_getValue('bc_albom_enable', null) == null) GM_setValue('bc_albom_enable', false)
if (GM_getValue('text_id_group', null) == null) GM_setValue('text_id_group', '-22786271')
if (GM_getValue('text_id_albom', null) == null) GM_setValue('text_id_albom', '229998745')
if (GM_getValue('bc_albom_repit', null) == null) GM_setValue('bc_albom_repit', 0)


var owner_id = GM_getValue('text_id_group')
var album_id = GM_getValue('text_id_albom')
var bc_albom_repit = GM_getValue('bc_albom_repit')

var ver_info = '7'
var col = 0
var _info = 'Добавил поддержку добавления альбома с фонами (ищи в настройках приложения). Если открыть настройки на окне альбома, то он предложит сделать этот альбом фоновым. Кучу фиксов покраски и других исправлений.'

if (GM_getValue('debug', false)) {
	$(document).ready(function () {
		//Start_Settings_Menu();
		alert_frame('⚠️ Дебаг режим включён ⚠️', 'В данный момент включён режим отладки, выключи в меню tampermonkey')
		//setTimeout(analit, 1000);
		//analit();
	})
}

//#region Дебаг режим
function debug_MC(menuCmdId) {
	if (menuCmdId) {
		GM_unregisterMenuCommand(menuCmdId)
	}

	if (GM_getValue('debug') == true) {
		menuCmdId = GM_registerMenuCommand('Дебаг режим: Включён ✅', () => {
			GM_setValue('debug', !GM_getValue('debug'))
			//GM_notification({ title: 'Дебаг режим:', text: '✅ Включён', timeout: 3000 });
			alert_frame('Дебаг режим:', '✅ Включён', 3000)
			debug_MC(menuCmdId)
		})
	} else {
		menuCmdId = GM_registerMenuCommand('Дебаг режим: Выключен', () => {
			GM_setValue('debug', !GM_getValue('debug'))
			//GM_notification({ title: 'Дебаг режим:', text: '⛔ Выключен', timeout: 3000 });
			alert_frame('Дебаг режим:', '⛔ Выключен', 3000)
			debug_MC(menuCmdId)
		})
	}
}
debug_MC()
//#endregion

//#region Тело скина
function theme() {

	console.log($('#test_analit_enable').text())
	if (darkStyleBacground && darkStyleBacground.id) {
		darkStyleBacground.remove()
	}
	if (darkStyle && darkStyle.id) {
		darkStyle.remove()
	}
	if (darkStyle1 && darkStyle1.id) {
		darkStyle1.remove()
	}
	if (combo_hide_style && combo_hide_style.id) {
		combo_hide_style.remove()
	}

	$('#button_spawn').css({ display: 'none' })
	$('#button_delete').css({ display: 'block' })
	//$('body').css({ 'background-image': 'url("' + GM_getValue('background') + '")', 'background-size': '100%', 'background-attachment': 'fixed' });
	$('body').css({ 'background-image': 'url("' + GM_getValue('background') + '")', 'background-color': '#2F2F30', 'background-size': '100%', 'background-attachment': 'fixed' })
	//$("#Link_oboi").attr("href", GM_getValue('background'));
	$('#Link_oboi').attr('href', 'https://vk.com/feed')
	get_albom()
	bc_transparent(GM_getValue('background'), true)

	darkStyle1 = GM_addStyle(`
    
    :root {
        --black: #d7d7d7;
        --background_content: #2f2f2f;
    }
    div#mv_player_box {
        background-color: #2f2f2f;
    }

[dir] .nim-peer.online::after {
    box-shadow: 0 0 3px 1px black !important;
}

div#side_bar {
    top: 0px !important;
    position: fixed !important;
}

ul.ConvoRecommendList {
    display: none !important;
}

a.ui_gallery_item.wall_card.friend_recomm_card {
    background: #272727;
}

section#fastchat-reforged {
    display: none;
}

img.im_gift,
img.sticker_img.emoji_sticker_image,
img.emoji_sticker_image,
svg.svg_sticker_animation
 {
    background-color: #ffffffbf;
    border-radius: 15px 0px 15px 0px;
    border-color: #949494;
    border-style: solid;
    border-width: unset;
    4px 3px 15px 0px black, inset 4px 3px 15px 0px #6b6b6b;

}


#layer_wrap,
div#wk_layer_wrap,
#box_layer_wrap
{
    background-color: #000000a3 !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23383838' stroke-width='2'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23696969'%3E%3Ccircle cx='769' cy='229' r='8'/%3E%3Ccircle cx='539' cy='269' r='8'/%3E%3Ccircle cx='603' cy='493' r='8'/%3E%3Ccircle cx='731' cy='737' r='8'/%3E%3Ccircle cx='520' cy='660' r='8'/%3E%3Ccircle cx='309' cy='538' r='8'/%3E%3Ccircle cx='295' cy='764' r='8'/%3E%3Ccircle cx='40' cy='599' r='8'/%3E%3Ccircle cx='102' cy='382' r='8'/%3E%3Ccircle cx='127' cy='80' r='8'/%3E%3Ccircle cx='370' cy='105' r='8'/%3E%3Ccircle cx='578' cy='42' r='8'/%3E%3Ccircle cx='237' cy='261' r='8'/%3E%3Ccircle cx='390' cy='382' r='8'/%3E%3C/g%3E%3C/svg%3E");
    /*width: 100%;*/
    /*height: 100%;*/
    /*position: fixed;*/
    /*z-index: 99999999;*/
    background-attachment: fixed;
    /*text-align: center;*/
}



.body_im .side_bar
{
    padding-left: 130px !important;
}

[dir] .market_item_content_bottom {

    background-color: transparent !important;
}


.side_bar_inner
{
    width: 160px !important;
}

.dark-theme-box
{
    position: fixed;
    white-space: nowrap;
    z-index: 200;
    height: 42px;
    top: 0;
    left: 0;
    padding: 0 5px 0 10px;
    line-height: 42px;
}

.dark-theme-box a
{
    color: red;
}
`)

	darkStyle = GM_addStyle(`



    .ui_rmenu_item,
.olist_item_name,
.app_widget_list_row,
.flat_button.ui_load_more_btn,
.audio_subscribe_promo__text,
a,
.web_cam_photo,
.ui_rmenu_subitem,
.reply_submit_hint_opts .radiobtn,
.gtop_complex_message .gtop_content .gtop_header,
.deep_active .post_replies_header .post_replies_reorder,
.post_action_btn.on,
.box_controls .flat_button.secondary,
.flat_button.secondary.button_light,
#mv_publish,
.button_gray button, .flat_button.secondary,
.button_blue button,
.button_gray button,
.button_light_gray button,
.ShortVideoStub__title,
.im-page-pinned--media,
.sticker_extra_tt .tt_text .stickers_extra_text>b,
.ui_gallery_wall_cards .wall_card__title_link,
.audio_page__audio_rows .audio_row.audio_has_lyrics .audio_row__title_inner,
.ap_layer__content .audio_row.audio_has_lyrics .audio_row__title_inner,
._playlist_page_content_block .audio_row.audio_has_lyrics .audio_row__title_inner,
._audio_section__search .audio_row.audio_has_lyrics .audio_row__title_inner,
.audio_section_global_search__audios_block .audio_row.audio_has_lyrics .audio_row__title_inner,
.deep_active.wall_module .post_replies_header .post_replies_reorder,
.Settings__button,
.MenuList__itemText,
.PlaylistPanel__title,
.PlaylistPanel__itemText,
.VideoCardMenu__itemLabel 
{
    color: #afc6dc !important;
}

body{
    --page-block-shadow: 0 1px 0 0 transparent, 0 0 0 1px transparent !important;
}



[dir=ltr] body.new_header_design #side_bar ol{
    margin: 0px 0px 6px -9px !important;
    padding-left: 3px !important;
}
[dir=ltr] body.new_header_design #ads_left.ads_left_empty+.left_menu_nav_wrap{
    margin: 0px 0px 6px -9px !important;
    padding: 8px 7px 9px 9px !important;
}

[dir] .left_menu_nav_wrap {
    padding: 10px 9px 9px 11px !important;
    margin: 0px 0px 6px -9px !important;
}

.left_settings_inner {
    /*width: 20px !important;
    height: 21px !important;*/
    left: -16px !important;
    opacity: 1/* !important*/;
    background-size: 161%;
    background-color: #353535b3;
    background-position-x: 3px;
    background-position-y: -57px;
    border-radius: 5px;
    background-image: url(/images/icons/common.png?6);
    filter: initial;
}

.ui_rmenu_item:hover,
.ui_rmenu_subitem:hover,
.ui_rmenu_item_sel,
.ui_rmenu_item_sel:hover,
.olist_item_wrap:hover,
.docs_choose_upload_area:hover,
[dir] body.new_header_design .left_count_wrap,
.box_title_wrap.box_grey
{
    background-color: #4a76a8 !important;
}


    #top_profile_menu,
    .thumbed_link__label,
    textarea,
    .mv_info,
    .media_link__label
    .online.mobile:after,
    .media_link__label,
    .im-mess.im-mess_light,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic,
    div.fc_tab_txt,
    #wk_box,
    .pv_cont .pv_comments_header,
    .Button--mobile:hover,
    .ListItem--active,
    .EditableLabel:hover .EditableLabel__text,
    .ListItem--can-be-hovered.ListItem--selectable:hover,
    .result_list ul li.active,
    .emoji_tab:hover,
    .ui_actions_menu,
    .nim-dialog:not(.nim-dialog_deleted):hover,
    div.wdd,
    .ListItem--active,
    .ListItem--border:before,
    .wddi_over,
    .photos_choose_upload_area:hover,
    .web_cam_photo:hover,
    .mail_box_cont,
    .wddi_no,
    .flist_item_wrap:hover,
    .tt_default,
    .tt_default_right,
    .cal_clear,
    #mv_publish,
    .CatalogBlock__separator,
    .ui_search_new.ui_search_dark .ui_search_input_inner,
    .Settings__loader,
    a.ui_gallery_item.wall_card.wall_card_tiny,
    [dir] #top_ecosystem_navigation_menu,
    .info_msg
    {
        background-color: #2f2f2f !important;
        box-shadow: 2px 7px 3px rgba(0,0,0,.1);
    }


    .deep_active .replies .reply_fakebox,
    .ui_tabs.ui_tabs_box,
    .prefix_input_wrap,
    .audio_row:hover:not(.audio_row__current) .audio_row_content,
    .audio_page__shuffle_all .audio_page__shuffle_all_button:hover,
    .audio_layer_container .audio_friend:hover,
    .ui_search_sugg_list .ui_search_suggestion_selected,
    .top_notify_cont .feedback_row:not(.dld):hover,
    .feedback_row_clickable:not(.feedback_row_touched):hover,
    .audio_row.audio_row__current .audio_row_content,
    .page_actions_item:hover:not(.grey_hoverable),
    .nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,
    .fc_tab,
    .tabbed_box .summary_tab_sel .summary_tab2,
    .feedback_row_wrap.unread:not(.feedback_row_touched),
    .tabbed_box .summary_tab a:hover,
    .blst_last:hover,
    .tabbed_box .summary_tab .summary_tab3:hover,
    .photos_container .photos_row,
    .ms_items_more,
    .sticker_hints_tt,
    .box_msg,
    .box_msg_gray,
    .msg,
    .tabbed_box .summary_tab_sel .summary_tab3:hover,
    .my_current_info:hover,
    .audio_pl_snippet2,
    .im_msg_audiomsg .audio-msg-track:not(.audio-msg-player):hover,
    .article_ed_layer .article_ed_layer__header,
    #admin_tips #gtop_admin_tips.gtop_complex_message,
    #page_block_group_admin_tips .group_edit_admin_tips_item:hover,
    .group_edit.group_edit_admin_tips .group_edit_admin_tips_item:hover,
    .eltt .eltt_fancy_action:hover,
    .cal_table .day,
    .market_item_content,
    .button_gray button,
    .flat_button.secondary,
    .audio_page_layout .audio_page_separator,
    .stats_cont_browse_tile,
    .piechart_col_header th,
    #stat_group_postsreach_table td,
    .group_info_rows_redesign .group_info_row.onboarding_placeholder .line_value.line_edit,
    .group_info_rows_redesign .group_info_row.onboarding_placeholder .line_value:hover,
    .my_current_info:hover,
    .no_current_info:hover,
    .mv_live_gifts_arrow_right:before,
    .mv_live_gifts_supercomment:hover,
    .docs_choose_rows .docs_item:hover,
    .docs_choose_upload_area,
    a.ts_contact.active, a.ts_search_link.active,
    #market_choose_box .market_block_layout,
    .tt_w.top_notify_tt,
    .idd_popup .idd_header_wrap,
    .idd_popup .idd_items_content,
    [dir] .post_top_info_caption,
    .feed_groups_recomm_friends .ui_gallery_wall_cards .wall_card,
    .DonutCatalogPromo,
    .photo_upload_separator,
    [dir] .VideoCard--playlist .VideoCard__info,
    [dir] .VideoTabsSlider .VideoTabs
    {
        background-color: #2f2f2f !important;
        box-shadow: 2px 7px 3px rgba(0,0,0,.1) !important;
    }

    .PostBottomAction
    {
        border-radius: 8px !important;
    }

    .PostBottomAction__count, 
    .PostBottomAction__label 
    {
        color: #2f2f2f !important;
    }

    body::-webkit-scrollbar
    {
    -webkit-appearance: none;
    width: 11px;
    }

body::-webkit-scrollbar-thumb,

.ui_scroll_default_theme>.ui_scroll_bar_container>.ui_scroll_bar_outer>.ui_scroll_bar_inner
{
    border-radius: 3px;
    background-color: #4a76a8;
    transition: background-color 200ms linear, width 150ms linear;
}


a#profile_edit_act:hover, 
a#profile_edit_act:focus {
    opacity: .88;
    text-decoration: none;
}

a#profile_edit_act
{
    background-color: var(--button_primary_background);
    color: var(--button_primary_foreground);
}


    #side_bar ol li .left_row,
    body,
    .ui_rmenu_subitem,
    ._im_to_unread.im-page--dialogs-filter-wrap a,
    .top_notify_cont,
    .wddi_text,
    .module_header .header_top,
    .page_actions_item,
    input,
    textarea,
    .tabbed_box .summary_tab_sel .summary_tab3,
    .ChatSettingsInfo__title,
    .result_list ul li.active,
    .im-aside-notice-promo.group-messages-notify-block .im-aside-notice--title,
    .im-aside-notice,
    .search_filter_main,
    .result_list ul li,
    .search_filter_shut,
    .im-fwd.im-fwd_msg .im-fwd--messages,
    .links-list__title,
    #mv_pl_tt .mv_tt_playlist,
    .wide_column .topics_module .topic_title,
    .topics_module .topic_inner_link,
    .ui_search_fltr,
    .ui_search_fltr_label,
    .post_author_data .post_author_data_title,
    .im-chat-input--editing-head,
    .page_market_item_narrow_price,
    .audio_subscribe_promo__title,
    .box_title_wrap.box_grey .box_title,
    .page_block_sub_header,
    ul.listing li span,
    .notify_sources_tt_content .line_cell .info,
    .article>h1,
    .group_info_rows_redesign .group_info_row.time .address_time_status_cur_time,
    #admin_tips #gtop_admin_tips.gtop_complex_message .gtop_content .gtop_message,
    .wk_address_content .addresses_wrap .address .address_timetable .address_timetable_one_day,
    .eltt .eltt_fancy_action,
    .medadd_h,
    .market_item_title,
    .market_item_price,
    .stats_cont_browse_tile,
    .validation_device_info_name,
    .top_profile_mrow,
    .microdata_price,
    .notify_tt_text,
    .im-mess-stack .im-mess-stack--gift,
    .ShortVideoStub__text,
    body.new_header_design #side_bar .left_label,
    .post_top_info_caption,
    .audio_row .audio_row__lyrics .audio_row__lyrics_inner,
    .audio_pl_snippet2 .audio_pl_snippet__description,
    #market_choose_box .market_block_layout .market_row .market_row_price,
    .ModalHeader__title,
    .SettingsListItem__title
    {
        color: #cacaca !important;
    }

    .SettingsListItem + .SettingsListItem,
    .top_notify_cont .top_notify_header {
        border-top-color: #ffffff26 !important;
    }

    [dir] .ModalHeader
    {
        border-bottom-color: #ffffff26 !important;
    }

    [dir] body.new_header_design .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l1 .top_home_link .top_home_logo,
    [dir] .TopHomeLink--logoWithText
    {
        background-image: url("data:image/svg+xml,%3Csvg fill='none' height='25' width='136' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 11.5c0-5.42 0-8.13 1.68-9.82C3.37 0 6.08 0 11.5 0h1c5.42 0 8.13 0 9.82 1.68C24 3.37 24 6.08 24 11.5v1c0 5.42 0 8.13-1.68 9.82C20.63 24 17.92 24 12.5 24h-1c-5.42 0-8.13 0-9.82-1.68C0 20.63 0 17.92 0 12.5z' fill='%232787f5'/%3E%3Cg clip-rule='evenodd' fill-rule='evenodd'%3E%3Cpath d='M6.5 7.5H4.75c-.5 0-.6.24-.6.5 0 .46.6 2.76 2.76 5.8 1.45 2.07 3.49 3.2 5.34 3.2 1.11 0 1.25-.25 1.25-.68v-1.57c0-.5.1-.6.46-.6.26 0 .7.13 1.74 1.13 1.19 1.19 1.38 1.72 2.05 1.72h1.75c.5 0 .75-.25.6-.74-.15-.5-.72-1.2-1.47-2.05-.4-.49-1.02-1-1.2-1.26-.26-.34-.2-.49 0-.78 0 0 2.13-3 2.35-4.03.11-.37 0-.64-.53-.64H17.5a.76.76 0 00-.76.5s-.9 2.16-2.15 3.57c-.41.41-.6.54-.82.54-.1 0-.27-.13-.27-.5V8.14c0-.44-.13-.64-.5-.64h-2.75c-.28 0-.45.2-.45.4 0 .42.64.52.7 1.7v2.58c0 .57-.1.67-.32.67-.6 0-2.04-2.18-2.9-4.67-.16-.48-.33-.68-.78-.68z' fill='%23fff'/%3E%3Cpath d='M66.86 12.5c0 3.24-2.43 5.5-5.78 5.5s-5.78-2.26-5.78-5.5S57.73 7 61.08 7s5.78 2.26 5.78 5.5zm-8.97 0c0 1.97 1.3 3.3 3.19 3.3s3.19-1.33 3.19-3.3c0-1.98-1.3-3.25-3.19-3.25s-3.19 1.28-3.19 3.25zm-17.14-.21c.95-.44 1.56-1.18 1.56-2.33 0-1.73-1.58-2.96-3.87-2.96h-5.27v11h5.5c2.37 0 4.02-1.29 4.02-3.05 0-1.33-.87-2.32-1.94-2.66zM35.6 9.01h2.83c.85 0 1.44.5 1.44 1.2s-.6 1.2-1.44 1.2h-2.83zM38.67 16h-3.06V13.3h3.06c.96 0 1.59.55 1.59 1.36s-.63 1.33-1.59 1.33zM51.84 18h3.19l-5.06-5.71L54.61 7h-2.9l-3.68 4.27h-.6V7H45v11h2.44v-4.38h.59zM76.47 7v4.34h-4.93V7H69.1v11h2.43v-4.44h4.93V18h2.43V7zM86.9 18h-2.44V9.22h-3.8V7H90.7v2.22h-3.8zm9.5-11c-2.11 0-3.91.89-4.52 2.8l2.24.37c.34-.67 1.05-1.2 2.15-1.2 1.33 0 2.06.84 2.17 2.28h-2.32c-3.23 0-4.79 1.42-4.79 3.45 0 2.05 1.59 3.3 3.78 3.3 1.8 0 3-.72 3.53-1.63l.5 1.63h1.76v-6.18c0-3.19-1.74-4.82-4.5-4.82zm-.72 9c-1.19 0-1.9-.5-1.9-1.4 0-.85.57-1.44 2.43-1.44h2.35c0 1.8-1.19 2.84-2.88 2.84zm17.99 2h-3.2l-3.8-4.38h-.6V18h-2.43V7h2.43v4.27h.6L110.34 7h2.9l-4.63 5.29zm3.88 0h2.43V9.22h3.8V7h-10.04v2.22h3.8zM130.1 7c3.34 0 5.56 2.4 5.56 5.37 0 .3-.02.55-.04.79h-8.54c.23 1.69 1.36 2.69 3.17 2.69 1.29 0 2.15-.4 2.68-1.2l2.29.39c-.88 2.01-2.83 2.96-5.12 2.96a5.28 5.28 0 01-5.51-5.5c0-3.12 2.17-5.5 5.51-5.5zm2.92 4.25c-.4-1.37-1.4-2.15-2.92-2.15-1.48 0-2.47.74-2.87 2.15z' fill='%23cacaca'/%3E%3C/g%3E%3C/svg%3E") !important;
    }

    div[contenteditable=true],
    .audio_page_layout .audio_search_wrapper,
    .im-page_classic.im-page .im-chat-history-resize,
    .wall_module .reply_fakebox_wrap
    {
        background: #ffffff00 !important;
    }

    #side_bar ol li .left_row:hover
    {
        color: #292929 !important;
        background-color: #909090 !important;
        box-shadow: 2px 7px 3px rgba(0,0,0,.1);
    }

    .eltt,
    .pv_author_block,
    .pv_cont .narrow_column,

    .top_notify_show_all,
    .ui_tabs_header,
    .box_body,
    input,
    .pv_cont .narrow_column,

    .mention_tt_actions,
    .group_l_row,
    .group_tokens_row,
    .groups_edit_event_log_page .groups_edit_event_log_controls,
    .ui_search_sugg_list,
    .links-list__item:hover,
    .online.mobile:after,
    .stl_active.over_fast #stl_bg,
    .profile_info_header,
    .profile_info_edit,
    #mv_pl_tt .mv_tt_add_playlist,
    .emoji_tt_wrap,
    .fc_msgs,
    .deep_active .replies .reply_box_inner_wrap.fixed,
    #groups_menu_items .groups_edit_menu_items .group_apps_list_row_drag_wrapper,
    .audio_pl_snippet2 .audio_shuffle_all_button:hover,
    #group_apps_list .group_apps_list_rows.group_apps_list_rows_multi .group_apps_list_row_drag_wrapper,
    #top_notify_wrap,
    .audio_page_player2.audio_page_player_fixed,
    .video_upload_separator_text,
    .cal_table .next_month_day,
    .cal_table .prev_month_day,
    .flat_button.secondary:hover,
    .ui_search_new.ui_search_field_empty .ui_search_button_search,
    .article_ed_layer,
    #stats_cont.stats_cont_browse,
    .paginated_table_header th.paginated_table_cell,
    .mv_live_gifts_item:hover,
    .mv_live_gifts_supercomment:hover,
    .mv_live_gifts_arrow_left:before,
    .mv_live_gifts_arrow_right:hover:before,
    .ts_cont_wrap,
    .search_filters_minimized_text,
    .idd_popup .idd_item.idd_hl,
    [dir] body.new_header_design .top_nav_link.active,
    [dir] .pv_cont .pv_reply_form_wrap,
    [dir] .ModalHeader,
    .box_controls,
    [dir] .audio_layer_container .ui_tabs
        {
            background-color: #272727 !important;
        }

    .wall_module .reply_form {
            background-color: #272727 !important;
            border-radius: 6px !important;
        }

    [dir] .wall_module .reply_box, [dir] .wall_module .reply_fakebox_wrap
        {
            background-color: transparent !important;
        }

    [dir] .deep_active .replies .replies_wrap_deep .reply_media_preview,
    [dir] .deep_active .wl_replies_block_wrap .replies_wrap_deep .reply_media_preview,
    [dir] .deep_active.wall_module .replies .replies_wrap_deep .reply_media_preview,
    [dir] .deep_active.wall_module .wl_replies_block_wrap .replies_wrap_deep .reply_media_preview,
    [dir] #top_ecosystem_navigation_menu
        {
            border-color: transparent !important;
        }


    .wall_module .reply_box
        {
            /*background-color: transparent !important;*/
        }

    .page_block,
    .ui_search,
    .im-page--toolsw,
    .im-chat-input,
    .im-page .im-page--dialogs-footer.ui_grey_block,
    .tt_default,
    .wddi,
    .im-chat-input .im-chat-input--txt-wrap,
    .im-page--chat-header,
    .wpost_post,
    .submit_post,
    .im-mess.im-mess_unread+.im-mess:before,
    .im-page_classic.im-page .im-page--dcontent,
    .im-mess.im-mess_selected+.im-mess:before,
    .page_block_header,
    .settings_block_footer,
    .page_actions_wrap,
    .im-page_classic.im-page .im-page--chat-body-wrap-inner,
    .im-page .im-page--mess-search,
    .ChatSettings__content,
    .gedit_block_footer,
    .selector_container,
    .result_list ul,
    .List,
    .im-dropbox,
    .im-create .im-create--tabs,
    .im-create,
    .emoji_tabs_l_s,
    .emoji_tabs_r_s,
    .im-aside-notice,
    .emoji_tab_sel,
    .emoji_tab_sel:hover,
    .emoji_cat_title,
    .im-page.im-page_classic.im-page_group .im-group-online .im-group-online--inner,
    .im-page.im-page_classic.im-page_group .im-group-online,
    .emoji_tabs,
    .Button--mobile,
    .ChatSettingsMembersWidget,
    .ui_grey_block,
    .ChatSettingsInfo,
    .ui_search_fltr,
    .emoji_sticker_item:hover,
    .photos_choose_upload_area,
    .web_cam_photo,
    .pv_white_bg,
    .im-audio-message-input,
    .wk_address_content .addresses_header,
    [dir] .ShortVideoPost,
    [dir] .ShortVideoPage__container--empty,
    [dir] .im-page .im-page--dialogs-footer,
    [dir] .VideoHeader__title,
    .MessageForward__content
    {
        background-color: #272727d4 !important;
    }

    // {
        // background-color: #272727d4 !important;
        // background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23383838' stroke-width='2'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23696969'%3E%3Ccircle cx='769' cy='229' r='8'/%3E%3Ccircle cx='539' cy='269' r='8'/%3E%3Ccircle cx='603' cy='493' r='8'/%3E%3Ccircle cx='731' cy='737' r='8'/%3E%3Ccircle cx='520' cy='660' r='8'/%3E%3Ccircle cx='309' cy='538' r='8'/%3E%3Ccircle cx='295' cy='764' r='8'/%3E%3Ccircle cx='40' cy='599' r='8'/%3E%3Ccircle cx='102' cy='382' r='8'/%3E%3Ccircle cx='127' cy='80' r='8'/%3E%3Ccircle cx='370' cy='105' r='8'/%3E%3Ccircle cx='578' cy='42' r='8'/%3E%3Ccircle cx='237' cy='261' r='8'/%3E%3Ccircle cx='390' cy='382' r='8'/%3E%3C/g%3E%3C/svg%3E") !imortant;
    // }

    .article_ed_layer__wrap,
    .fakeinput,
    input.big_text,
    input.dark,
    input.search,
    /*input.text,*/
    textarea
    {
        background-color: #272727 !important;
    }


    .im-page .im-page--center-empty
    {
        background: url('https://psv4.userapi.com/c856228/u51863636/docs/d14/41e6a3400829/empty_icon.png') no-repeat top !important;
    }


    .nim-dialog .nim-dialog--name .nim-dialog--name-w,
    .im-page .im-search-results-head,
    .im-popular--name,
    .ui_actions_menu_item,
    .im-page--title-main-inner,
    .feedback_header b,
    .ui_tabs .ui_tab_sel,
    .page_block_header,
    .settings_block_footer,
    h2,
    #groups_menu_promo .apps_group_catalog_promo_header,
    input.dark,
    .nim-dialog.nim-dialog_typing .nim-dialog--typing,
    .im-page .im-page--mess-search,
    .mail_box_group_first_message,
    .page_name, h1.page_name,
    .audio_pl_snippet2 .audio_shuffle_all_button,
    .audio_pl_item2 .audio_pl__subtitle>a,
    .wk_address_content .addresses_wrap .address .address_timetable .address_timetable_one_day.on,
    .wk_address_content .addresses_wrap .address .address_time_status .address_time_status_cur_time,
    .medadd_poll_answer_add,
    [dir] .VideoHeader__title
    {
        color: #ffff !important;
    }

    .nim-dialog .nim-dialog--date,
    div[contenteditable=true],
    .nim-dialog .nim-dialog--who,
    .ms_items_more._more_items a,
    .im-replied--text,
    .im-page .im-page--history-new-bar>span,
    .audio_page_player2 .audio_page_player_title_song,
    .ui_tab_default .ui_tab_plain,
    .mv_title,
    .mv_comments_summary,
    .emoji_cat_title,
    .mv_recom_block_title,
    #stat_group_postsreach_table td,
    .idd_popup .idd_item,
    .idd_popup .idd_header,

    #group_section_menu .module_body .ui_gallery .ui_gallery_item .groups_menu_item .groups_menu_item_title
    {
        color: #e6e6e6 !important;
    }

    .nim-dialog .nim-dialog--preview,
    .top_notify_header,
    .top_notify_cont .feedback_header,
    .feedback_header,
    .Tabs__item--active>*,
    .PlaceholderSmall__title,
    .im-page-pinned--date,
    .audio_page_layout .audio_item__title
    {
        color: #949494 !important;
    }

    .ui_actions_menu_item:hover,
    .media_selector .ms_items_more .ms_item:hover,
    .idd_popup .idd_item.idd_hover, .idd_popup .idd_item.idd_hover_sublist_parent,
    .profile_more_info_link:hover
    {
        background-color: #a3a6a9 !important;
        color: #000000 !important;
    }

    .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered
    {
        background-color: #3d5877 !important;
    }

    .page_counter .count,
    .subheader, h4.subheader,
    .tt_w,
    .Entity__title,
    .PlaceholderSmall__text,
    .sticker_extra_tt .tt_text,
    .subscribe_post_tt .tt_text,
    .audio_page__shuffle_all .audio_page__shuffle_all_button
    {
        color: #eceff3 !important;
    }

    .wall_post_cont._wall_post_cont
    {
        background-color: transparent !important;
    }

    .im-mess.im-mess_unread:not(.im-mess_light),
    .im-mess.im-mess_selected:last-child:before,
    .im-mess.im-mess_unread:last-child:before,
    .page_actions_header,
    .im-mess.im-mess_selected:not(.im-mess_is_editing)
    {
        background-color: #3d5877ab  !important;
    }


    #side_bar .more_div,
    .nim-dialog .nim-dialog--content,
    .im-chat-input,
    .ui_rmenu_sep,

    .wall_module .replies_list,
    #ads_left.ads_left_empty+.left_menu_nav_wrap,
    .pv_comments,
    .deep_active .replies .replies_wrap_deep,
    .deep_active .post_replies_header,
    .wddi,
    .wall_module .reply_box,
    .submit_post,
    .mention_tt_actions,
    .im-page .im-page--dialogs-footer,
    .wide_column .topics_module .topic_row,
    .flat_button.ui_load_more_btn,
    .gedit_block_footer,
    .top_profile_sep,
    .nim-dialog:not(.nim-dialog_deleted):hover+.nim-dialog,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog:hover,
    .page_actions_separator,
    .ui_actions_menu_sep,
    .audio_subscribe_promo,
    .ui_search_sugg_list,
    .top_notify_show_all,
    .feedback_row,
    .wall_module .reply~.reply .reply_wrap,
    .page_actions_inner,
    div.fc_tab_txt,
    .olist_item_wrap:hover,
    .profile_info_block,
    .ui_grey_block,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected+.nim-dialog,
    .im-page .im-page--mess-search,
    .search_sep,
    .search_row,
    .bp_post,
    .friends_user_row,
    .feed_row~.feed_row .feedback_row_clickable:not(.feedback_row_touched):hover,
    .im-audio-message-input,
    .docs_item,
    .feed_groups_recomm__all,
    .counts_module
    {
    border-top-color: #464748 !important;
    }

    [dir] .top_profile_mrow:hover,
    [dir] .top_profile_vkconnect_row:hover
    {
        background-color: #464748 !important;
    }

    .deep_active .replies .reply_field_wrap .reply_field,
    .deep_active .replies .reply_fakebox,
    .wdd_list,
    div.wdd,
    .wpost_post,
    .ui_search_new .ui_search_input_inner,
    .module,
    #top_profile_menu,
    .ms_items_more,
    .ui_actions_menu,
    .eltt,

    .ui_search_sugg_list,
    #top_notify_wrap,
    .page_actions_wrap,
    .fc_msgs,
    .fc_tab,
    div[contenteditable=true],
    .tt_default,
    .ui_search_new .ui_search_button_search,
    .audio_layer_container .audio_page__footer,
    .audio_layer_container .audio_page_player_wrap,
    #mv_publish,
    .tt_w.top_notify_tt,
    .CatalogSection__leftColumn,
    .im-chat-input .im-chat-input--txt-wrap
    {
        border-color:#2f2f2f !important;
    }



    /*.page_block
    {
        box-shadow: 0 0 0 0 #d7d8db, 0 0 0 0px #e3e4e8 !important;
    }*/

    [dir] .ShortVideoPage .page_block_h2,
    [dir] .ShortVideoPage__container--empty
    {
        box-shadow: 0 1px 0 0 #d3d9de00, 0 0 0 1px #e7e8ec00 !important;
    }


    .ui_search,
    .im-page--toolsw,
    input.BlockSearchInput,
    .ui_tabs,
    .wide_column .page_top,
    .group_l_row,
    .group_edit_row_sep,
    .page_block_header,
    .group_tokens_row,
    .group_list_row,
    .pv_author_block,
    .mv_actions_block,
    .im-page .im-page--mess-search,
    .olist_item_wrap,
    .Tabs,
    .im-page_classic.im-page .im-page--chat-input,
    .feed_new_posts,
    .feedback_row_clickable:not(.feedback_row_touched):hover,
    .audio_layer_container .audio_page_player_wrap,
    .bt_header,
    .gifts_box_rows .post,
    .blst_row,
    .paginated_table_header th.paginated_table_cell,
    .mv_live_gifts_block,
    .docs_choose_rows .docs_item,
    .tt_w.top_notify_tt.tt_up:before,
    .tt_w.top_notify_tt.tt_up:after,
    [dir] .VideoHeader__title,
    .mv_comments_summary
    {
        border-bottom-color: #2f2f2f !important;
    }


    .mv_info_narrow_column,
    .mv_recom_block_title,
    .im-page_classic.im-page .im-page--header,
    .mv_live_gifts_supercomment,
    .wall_module .copy_quote
    {
        border-left-color: #272727 !important;
    }

    .audio_page_layout .has_friends_block .audio_page__rows_wrap,
    .im-page_classic.im-page .im-page--header
    {
        border-right-color:#272727 !important;
    }

    .chat_onl_inner
    {   /* убираем «быстрые диалоги» */
        display:none !important;
    }

    .page_photos_module
    {
    padding: 15px 15px 15px !important;
    }

    #page_header_cont .back,
    .page_avatar_img,
    .stl_active.over_fast #stl_bg,
    #profile_message_send,
    .stories_feed_preview_item,
    .post_img,
    .im-page--header-more .ui_actions_menu,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog:hover,
    .im-chat-input .ms_items_more,

    .emoji_tt_wrap,
    .fc_tab,
    .info_msg,
    .im-aside-notice,
    .List--border,
    .page_block,
    .online:after,
    .audio_page_layout .audio_block:before,
    .page_block._audio_page_content_block:before,
    .im-page.im-page_classic.im-page_group .im-group-online .im-group-online--inner
    {
        box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1) !important;
    }

    .nim-dialog.nim-dialog_muted .nim-dialog--mute, .nim-dialog.nim-dialog_unread.nim-dialog_prep-injected.nim-dialog_muted .nim-dialog--mute {

        color: rgb(255 255 255 / 24%) !important;
    }


    [dir] .ShortVideoPost {
    box-shadow: 0 1px 0 0 #d3d9de00, 0 0 0 1px #e7e8ec00 !important;

}

    .online:after {
        border: 0px solid #ffffff !important;
        box-shadow: 1px 3px 2px 2px rgba(0,0,0,.1);
    }

    .module_body {
    padding: 12px 14px 15px !important;
}

    .im-page_classic.im-page .im-page--dialogs-search,
    .im-page_classic .im-page--chat-header-in,
    .im-chat-input.im-chat-input_classic,
    .nim-dialog.nim-dialog_unread .nim-dialog--unread,
    .ChatSettingsInfo,
    .ChatSettingsMembersWidget,
    .List--border,
    .Button--mobile,
    #admin_tips #gtop_admin_tips.gtop_complex_message,
    .CatalogBlock--divided:before, .CatalogSection:before,
    .im-page_classic.im-page .im-page--chat-body-abs
{
        box-shadow: 2px 7px 3px rgba(0,0,0,.1) !important;
    }

    .im-page_classic .im-page--chat-header,
    .im-page_classic.im-page .im-page--chat-input,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_classic.nim-dialog_unread,
    .nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic+.nim-dialog,
    .ui_tabs.ui_tabs_box,
    .ListItem--active,
    .ListItem--can-be-hovered.ListItem--selectable:hover,
    .like_cont,
    .emoji_tt_wrap,
    .photos_container .photos_row,
    .info_msg,
    .ListItem--active,
    .group_friends_image,
    .ui_search_fltr,
    .emoji_tt_wrap.tt_down:after,
    .emoji_tt_wrap.tt_down:before,
    #mv_pl_tt .mv_tt_private_only+.mv_tt_playlists,
    #mv_pl_tt .mv_tt_add_playlist,
    .like_share_ava.wdd_imgs .wdd_img_full,
    .like_share_ava.wdd_imgs .wdd_img_half,
    .like_share_ava.wdd_imgs .wdd_img_tiny,
    .sticker_hints_tt,
    .Avatar--online:after,
    .box_controls,
    .online:after,
    .sticker_hints_arrow,
    .cal_table>tbody,
    .market_item_footer_wrap,
    .wk_address_content .addresses_header,
    .app_widget_list_row,
    .stats_browse_filter,
    .idd_popup,
    #mv_publish,
    .im-page_classic.im-page .im-page--chat-body-wrap-inner,
    .im-page_classic.im-page .im-page--header,
    [dir] body.new_header_design .ts_cont_wrap
    {
        border-top-color: #ffffff00 !important;
        border-color: #ffffff00 !important;
        border-bottom-color: #ffffff00 !important;
        border-left-color: #ffffff00 !important;
        border-right-color: #ffffff00 !important;
    }



    .im-page_classic.im-page .im-page--chat-input
{
    border-bottom: solid 0px #ffffff00 !important;
}

[dir] .search_focused .highlight {
    background-color: #3384e269;
}

[dir] .feedback_row_wrap {
    border-top-color: rgba(220, 225, 230, 0.19) !important;
}

[dir] .selector_container table.selector_table,
[dir] .BaseModal__content {
    background-color: #2f2f2f !important;
    border-color: #2f2f2f !important;
}
.im-page_classic .im-page--chat-header
{
    top: 42px !important;;
}

    /*.page_actions_cont.narrow .page_actions_header,*/
    .page_actions_cont.narrow .page_extra_actions_btn
    {
        background-image: url(/images/icons/profile_dots.png?1) !important;
        background-color: #2f2f2f !important;
    }

    .im-page--back-btn:hover
    {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="rgb(128,141,153)"><path fill="curentCollor" d="M8 15.9c-.2 0-.4-.1-.6-.3l-7-7c-.3-.3-.3-.9 0-1.2l7-7c.3-.3.9-.3 1.2 0 .3.3.3.9 0 1.2l-6.4 6.4 6.4 6.4c.3.3.3.9 0 1.2-.2.2-.4.3-.6.3z" opacity=".7"/></svg>') 15px 16px no-repeat, linear-gradient(90deg, #2f2f2f 50%, #272727) !important;
    }


.olist_checkbox,
.wall_post_source_icon
{
    filter: invert(83%);
}

.bp_post.bp_selected.bp_animated
{
    background-color: transparent !important;
    border-color: transparent !important;
}

.bp_post.bp_selected
{
    background-color: #4872a3 !important;
    transition: background-color 5000ms linear, border-color 5000ms linear !important;
}

.notify_sources_tt_content .content:not(:hover) .line_cell.selected,
.notify_sources_tt_content .line_cell:hover
{
    background-color: #4872a3 !important;
}

.emoji_sprite,
.ui_scroll_default_theme.ui_scroll_emoji_theme>.ui_scroll_overflow>.ui_scroll_shadow_top,
.ui_scroll_default_theme.ui_scroll_emoji_theme>.ui_scroll_overflow>.ui_scroll_shadow_bottom
{
    filter: invert(90%) !important;
}


.sticker_hints_arrow
{
    background: #272727 url(/images/icons/stickers_hints_arrow.png) no-repeat 50% 50% !important;
}

.wddi,
.wddi_over,
.post_actions_btns,
.submit_post
{
    border-top-color: #2f2f2f !important;
}


.nim-peer .nim-peer--photo .im_grid>img,
.nim-peer .nim-peer--photo>img,
.nim-peer .nim-peer--photo-w,
.post_img,
.wall_module .copy_post_img,
.module_body .people_cell_img,
.page_list_module .thumb,
.wall_module .reply_img,
.post_field_user_image,
.top_profile_img,
.ow_ava.ow_ava_comm,
.friends_photo_img,
.right_list_img,
.group_row_photo,
.group_row_img,
.page_square_photo,
.page_avatar_img,
.notify_tt_img,
.notify_tt_thumb,
/*a.page_post_thumb_wrap.image_cover.page_post_thumb_last_column.page_post_thumb_last_row,*/
a.page_post_thumb_wrap.image_cover,
input.text.ts_input,
.video_box_wrap
{
    border-radius: 10px !important;
}


[dir] .im-page-pinned,
[dir] .im-page--chat-header-in,
[dir] body.new_header_design #page_header_cont
{
    border-bottom-color: transparent !important;
}

[dir] .im-page-pinned,
[dir] body.new_header_design #page_header_cont,
[dir] .video_showcase .page_header_wrap,
[dir] .VideoLayout__asideFooter,
[dir] .VideoLayout__aside 
{
    background-color: #383838e6 !important;
}


.left_menu_nav_wrap,
#side_bar ol,
.CatalogBlock--divided,
/*[dir] .im-page-pinned,*/
.CatalogSection
{
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1) !important;
    padding: 9px 9px !important;
    padding-left: 14px !important;
    background-color: #272727de !important;
    border-radius: 5px !important;

}

/*div#layer_wrap,*/
/*div#box_layer_wrap*/
#layer_bg,
#box_layer_bg
{
    /*backdrop-filter: blur(3px);*/
    background: #00000038 !important;
    opacity: 1 !important;
}

.tt_default,
.tt_default_right
{
    border: 1px solid #6b6969 !important;
}

.im-page .im-page--history-new-bar
{
    background: #ffffff00 !important;
}

.im-page .im-page--history-new-bar>span {
    background: #2f2f2f !important;
    border-radius: 17px !important;
    box-shadow: 2px 7px 3px rgba(0,0,0,.1) !important;
}

.im-page .im-page--history-new-bar:after, .im-page .im-page--history-new-bar:before {
    display: block;
    content: '';
    height: 1px;
    width: 50%;
    background: #e4e6e980 !important;
    position: absolute;
    top: 50%;
    margin-left: 43px;
}

.article_ed_layer .article_ed_layer__close
{
    filter: invert(1);
}

.mv_live_gifts_arrow_left:hover:before, .mv_live_gifts_arrow_right:hover:before {
    background-image: linear-gradient(0deg, #fff, #f0f2f5, #fff) !important;
}

#ads_left,
._ads_block_data_w,
.page_block .apps_feedRightAppsBlock .apps_feedRightAppsBlock_single_app,
.fc_tab_wrap,
.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--promo
{
    display: none !important;
}

.tt_w.top_notify_tt.tt_up
{
    box-shadow: 6px 7px 3px rgba(0, 0, 0, 0.55);
}

[dir] .like_cont {
    box-shadow: inset 0 1px #e7e8ec00  !important;
}

[dir] .deep_active .replies .replies_wrap_deep, 
[dir] .deep_active .wl_replies_block_wrap .replies_wrap_deep, 
[dir] .deep_active.wall_module .replies .replies_wrap_deep, 
[dir] .deep_active.wall_module .wl_replies_block_wrap .replies_wrap_deep 
{
    border-top: 1px solid #dce1e64f !important;
}

[dir] .nim-dialog.nim-dialog_pinned+.nim-dialog:not(.nim-dialog_pinned)::before 
{
    background: #ffffff5e !important;
}

[dir=ltr] .audio_page_layout .audio_page_block__playlists_items {
    margin-right: -15px !important;
}

.im-mess.im-mess_gift,
li.im-mess.im_out._im_mess.im-mess_gift.im-mess_out
{
background: #69696966 !important;
}

.audio_page_layout .audio_friends_list,
.PlaceholderSmall__title
{
    background-color: transparent !important;
}

[dir] .im_msg_media_wall .post_top_info_caption
{
    margin: 0 6px 0px 6px !important;
    padding: 3px 6px 3px 6px !important;
    border-radius: 5px;
}

[dir] .nim-dialog.nim-dialog_unread .nim-dialog--unread, [dir] .nim-dialog.nim-dialog_unread.nim-dialog_prep-injected .nim-dialog--unread, [dir] .nim-dialog.nim-dialog_failed .nim-dialog--unread,

[dir] body.new_header_design .left_count_wrap {
    border-radius: 12px 12px 12px 0px !important;
    background-color: #5181b8 !important;
}

[dir] body.new_header_design .top_audio_player:hover {
    background-color: var(--steel_gray_200_alpha12) !important;
}



`)

	function blur_add() {
		blur = GM_addStyle(`
            .left_menu_nav_wrap,
            #side_bar ol,
            .ui_scroll_inner.tt_noappend,
            #layer_bg,
            #alert,
            #box_layer_bg
            {
                backdrop-filter: blur(3px);

            }
        `)
	}
	//buer();
	function blur_remote() {
		if (blur && blur.id) {
			blur.remove()
		}
	}

	darkStyleBacground = GM_addStyle(`
body
{
    background-image: url(${GM_getValue('background')});
    background-color:  #2f2f2f;
    background-attachment: fixed;
    background-size: auto;
}
    `)

	combo_hide(GM_getValue('combo_hide'))
}

//#endregion

function bc_transparent(bc, repeat) {
	if (bc && GM_getValue('enable')) {
		//var bc = localStorage.getItem('background');
		$('#bg2').css({ 'background-image': 'url(' + bc + ')' })
		setTimeout(() => $('#bg2').css({ opacity: '1' }), 1000)
		setTimeout(() => $('body').css({ 'background-image': 'url(' + bc + ')' }), 5000)
		setTimeout(() => $('#bg2').css({ opacity: '0' }), 10000)
		$('#Link_oboi').attr('href', bc)

		if (document.hidden == false) {
			get_albom()
		}

		if (bc_albom_repit && GM_getValue('bc_albom_enable')) {
			if (bc_albom_repit > 0 && repeat) {
				setTimeout(bc_transparent, 60000 * bc_albom_repit, GM_getValue('background'), true)
			}
		}
	}
}

$(document).ready(function () {
	$('body').prepend('<div id="bg2" style="position: fixed;width: 100%;height: 100%; transition: opacity 5s; opacity: 0; z-index: -1; background-size: auto;"></div>')

	if (GM_getValue('enable') == true) $('body').css({ 'background-image': 'url("' + GM_getValue('background') + '")', 'background-color': '#2f2f2f', 'background-size': 'auto', 'background-attachment': 'fixed' })
	favicon_name_edit()

	Link_oboi()
})

function combo_hide(check) {
	if (check) {
		GM_setValue('combo_hide', check)
	}

	if (check == true) {
		combo_hide_style = GM_addStyle(`
            li#l_combo
            {
                display: none !important;
            }
        `)
	} else {
		if (combo_hide_style && combo_hide_style.id) {
			combo_hide_style.remove()
		}
	}
	//console.log("hide: " + check)
	//console.log("combo_hide: " + GM_getValue('combo_hide'))
}

function w123() {
	let bg = document.querySelector('body')
	window.addEventListener('mousemove', function (e) {
		let x = e.clientX / window.innerWidth
		let y = e.clientY / window.innerHeight
		bg.style.backgroundPositionX = x * 10 + 'px'
		bg.style.backgroundPositionY = '-' + y * 10 + 'px'
	})
}

function removeStyle() {
	if (darkStyle && darkStyle.id) {
		darkStyle.remove()
	}

	if (darkStyleBack && darkStyleBack.id) {
		darkStyleBack.remove()
	}

	if (blur && blur.id) {
		blur.remove()
	}

	if (combo_hide_style && combo_hide_style.id) {
		combo_hide_style.remove()
	}
}

//#region переименование группы и сообщения
function rename() {
	$('#l_gr > a > span.left_label.inl_bl').text(GM_getValue('group'))
	$('#l_msg > a > span.left_label.inl_bl').text(GM_getValue('message_name'))
}

document.querySelector('title').addEventListener('DOMSubtreeModified', favicon_name_edit)

function favicon_name_edit() {
	//console.log("ok")
	if (document.querySelector('title').innerHTML == 'Мессенджер') {
		document.querySelector('title').innerHTML = GM_getValue('message_name')
	}

	if (document.querySelector('title').innerHTML.indexOf('Сообщества') != -1) {
		//document.querySelector("title").innerHTML = GM_getValue('group')
		document.querySelector('title').innerHTML = document.querySelector('title').innerHTML.replace('Сообщества', GM_getValue('group'))
	}
}

$(document).ready(function () {
	rename()
})
//#endregion

$(document).ready(function () {
	let names = JSON.parse(GM_getValue('names')).map(v => v.toLowerCase())
	let userName = $('.top_profile_name').text()

	if (names.indexOf(userName.toLowerCase()) > -1) {
		if (darkStyle && darkStyle.id) {
			$(`#${darkStyle.id}`).remove()
		}
	}

	$('#side_bar_inner ol')
		.append($('<div>', { class: 'more_div' }))
		.append(
			$('<li>', { id: 'l_bt' }).append(
				$('<a>', { class: 'left_row' })
					.on('click', () => {
						window.open('https://greasyfork.org/ru/scripts/392169-dark-vk-theme')
					})
					.append(
						$('<span>', {
							class: 'left_fixer1',
							html: [$('<span>', { class: 'left_count_wrap fl_r left_void' }).append($('<span>', { class: 'inl_bl left_count_sign' })), $('<span>', { class: 'left_icon settings' }), $('<span>', { class: 'left_label settings', text: `Версия: ${GM_info.script.version}` })]
						})
					)
			)
		)

	$('#side_bar_inner ol').append(
		$('<li>', { id: 'l_bt' }).append(
			$('<a>', { class: 'left_row' })
				.on('click', () => {
					window.open('https://vk.com/dygdyg')
				})
				.append(
					$('<span>', {
						class: 'left_fixer1',
						html: [$('<span>', { class: 'left_count_wrap fl_r left_void' }).append($('<span>', { class: 'inl_bl left_count_sign' })), $('<span>', { class: 'left_icon settings' }), $('<span>', { class: 'left_label settings', text: `Автор: DygDyg` })]
					})
				)
		)
	)
	$('#side_bar_inner ol').append(
		$('<li>', { id: 'l_bt' }).append(
			$('<a>', { class: 'left_row' })
				.on('click', () => {
					window.open('https://vk.com/topic-109462867_43703182')
				})
				.append(
					$('<span>', {
						class: 'left_fixer1',
						html: [$('<span>', { class: 'left_count_wrap fl_r left_void' }).append($('<span>', { class: 'inl_bl left_count_sign' })), $('<span>', { class: 'left_icon settings' }), $('<span>', { class: 'left_label settings', text: `Нашли баг?` })]
					})
				)
		)
	)

	$('#side_bar_inner ol').append(
		$('<li>', { id: 'l_bt' }).append(
			$('<a>', { class: 'left_row' })
				.on('click', Start_Settings_Menu)
				.append(
					$('<span>', {
						class: 'left_fixer1',
						html: [$('<span>', { class: 'left_count_wrap fl_r left_void' }).append($('<span>', { class: 'inl_bl left_count_sign' })), $('<span>', { class: 'left_icon settings' }), $('<span>', { class: 'left_label settings', text: `Настройки` })]
					})
				)
		)
	)

	GM_addStyle(`
    span.left_fixer1 span.left_icon.settings
    {
            /*margin-top: 5px !important;*/
        margin: 5px 8px 0px 0px;
        background-color: #4a76a8;
        width: 18px;
        height: 18px;
        -webkit-mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ5MC4xIDQ5MC4xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTAuMSA0OTAuMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NjkuNCwxODIuMWgtMzguMmMtMy4xLTcuMi01LjItMTMuNC04LjMtMTkuNmwyNi44LTI2LjhjNy4xLTcuMSw5LjItMTkuNywwLTI4LjlsLTY0LTY0Yy04LjMtOC4zLTIwLjYtOC4zLTI4LjksMA0KCQkJTDMzMCw2OS42Yy02LjItMy4xLTEzLjQtNi4yLTE5LjYtOC4zVjIzLjJjMC0xMS4zLTkuMy0yMC42LTIwLjYtMjAuNmgtODkuN2MtMTEuMywwLTIwLjYsOS4zLTIwLjYsMjAuNnYzMw0KCQkJYy03LjIsMy4xLTEzLjQsNS4yLTE5LjYsOC4zbC0yNi44LTI2LjhjLTguMy04LjMtMjAuNi04LjMtMjguOSwwbC02NCw2NGMtOC4zLDguMy04LjMsMjAuNiwwLDI4LjlMNjcsMTU3LjQNCgkJCWMtMy4xLDYuMi02LjIsMTMuNC04LjMsMTkuNkgyMC42QzkuMywxNzcsMCwxODYuMywwLDE5Ny42djg5LjdjMCwxMS4zLDkuMywyMC42LDIwLjYsMjAuNmgzNi4xYzMuMSw3LjIsNS4yLDEzLjQsOC4zLDE5LjYNCgkJCWwtMjYuOCwyNi44Yy04LjMsOC4zLTguMywyMC42LDAsMjguOWw2NCw2NGMxMS44LDExLjgsMjQuOCw0LjEsMjguOSwwbDI2LjgtMjYuOGM2LjIsMy4xLDEzLjQsNi4yLDE5LjYsOC4zdjM4LjINCgkJCWMwLDExLjMsOS4zLDIwLjYsMjAuNiwyMC42aDg5LjdjMTAuMywwLDE5LjYtOS4zLDIyLjctMTUuNXYtMzguMmM3LjItMy4xLDEzLjQtNS4yLDE5LjYtOC4zbDI2LjgsMjYuOGM4LjMsNy4yLDIxLjcsNy4yLDI4LjksMA0KCQkJbDY0LTY0YzguMy04LjMsOC4zLTIwLjYsMC0yOC45TDQyMywzMzIuNmMzLjEtNi4yLDYuMi0xMy40LDguMy0xOS42aDM4LjJjMTEuMywwLDIwLjYtOS4zLDIwLjYtMjAuNnYtODkuNw0KCQkJQzQ5MCwxOTEuNCw0ODAuNywxODIuMSw0NjkuNCwxODIuMXogTTQ0NC42LDI2OS44aC0zMmMtOS4zLDAtMTcuNSw2LjItMTkuNiwxNS41Yy0zLjEsMTMuNC04LjMsMjUuOC0xNS41LDM4LjINCgkJCWMtNS4yLDguMy0zLjEsMTguNiwzLjEsMjQuOGwyMi43LDIyLjdsLTM1LjEsMzUuMWwtMjIuNy0yMi43Yy03LjItNi4yLTE2LjUtNy4yLTI0LjgtMy4xYy0xMS4zLDYuMi0yNC44LDEyLjQtMzguMiwxNS41DQoJCQljLTkuMywyLjEtMTUuNSwxMC4zLTE1LjUsMTkuNnYzMmgtNDkuNXYtMzJjMC05LjMtNi4yLTE3LjUtMTUuNS0xOS42Yy0xMy40LTMuMS0yNS44LTguMy0zOC4yLTE1LjVjLTguMy01LjItMTguNi0zLjEtMjQuOCwzLjENCgkJCWwtMjIuNywyMi43TDgxLjIsMzcxbDIyLjctMjIuN2M2LjItNy4yLDcuMi0xNi41LDMuMS0yNC44Yy02LjItMTEuMy0xMi40LTI0LjgtMTUuNS0zOC4yYy0yLjEtOS4zLTEwLjMtMTUuNS0xOS42LTE1LjVoLTMydi00OS41DQoJCQloMzJjOS4zLDAsMTcuNS02LjIsMTkuNi0xNS41YzMuMS0xMy40LDguMy0yNS44LDE1LjUtMzguMmM1LjItOC4zLDMuMS0xOC42LTMuMS0yNC44bC0yMi43LTIyLjdMMTE2LjMsODRsMjIuNywyMi43DQoJCQljNy4yLDYuMiwxNi41LDcuMiwyNC44LDMuMWMxMS4zLTYuMiwyNC44LTEyLjQsMzguMi0xNS41YzkuMy0yLjEsMTUuNS0xMC4zLDE1LjUtMTkuNnYtMzJIMjY3djMyYzAsOS4zLDYuMiwxNy41LDE1LjUsMTkuNg0KCQkJYzEzLjQsMy4xLDI1LjgsOC4zLDM4LjIsMTUuNWM4LjMsNS4yLDE4LjYsMy4xLDI0LjgtMy4xTDM2OC4yLDg0bDM1LjEsMzUuMWwtMjIuNywyMi43Yy02LjIsNy4yLTcuMiwxNi41LTMuMSwyNC44DQoJCQljNi4yLDExLjMsMTIuNCwyNC44LDE1LjUsMzguMmMyLjEsOS4zLDEwLjMsMTUuNSwxOS42LDE1LjVoMzJWMjY5Ljh6Ii8+DQoJCTxwYXRoIGQ9Ik0yNDIuNCwxMzIuNkMxODEuNiwxMzIuNiwxMzEsMTgzLjEsMTMxLDI0NWMwLDYwLjksNDkuNSwxMTEuNCwxMTEuNCwxMTEuNFMzNTMuOCwzMDYuOSwzNTMuOCwyNDUNCgkJCVMzMDQuMywxMzIuNiwyNDIuNCwxMzIuNnogTTI0Mi40LDMxNi4yYy0zOS4yLDAtNzEuMi0zMi03MS4yLTcxLjJzMzItNzEuMiw3MS4yLTcxLjJzNzEuMiwzMiw3MS4yLDcxLjJTMjgxLjYsMzE2LjIsMjQyLjQsMzE2LjJ6DQoJCQkiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==")
    }
    span.left_fixer1 {
        display: flex;
    }

    `)
})

//#region Модальное окно //стиль
GM_addStyle(`

#alert
{
    background: #000000a3;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23383838' stroke-width='2'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23696969'%3E%3Ccircle cx='769' cy='229' r='8'/%3E%3Ccircle cx='539' cy='269' r='8'/%3E%3Ccircle cx='603' cy='493' r='8'/%3E%3Ccircle cx='731' cy='737' r='8'/%3E%3Ccircle cx='520' cy='660' r='8'/%3E%3Ccircle cx='309' cy='538' r='8'/%3E%3Ccircle cx='295' cy='764' r='8'/%3E%3Ccircle cx='40' cy='599' r='8'/%3E%3Ccircle cx='102' cy='382' r='8'/%3E%3Ccircle cx='127' cy='80' r='8'/%3E%3Ccircle cx='370' cy='105' r='8'/%3E%3Ccircle cx='578' cy='42' r='8'/%3E%3Ccircle cx='237' cy='261' r='8'/%3E%3Ccircle cx='390' cy='382' r='8'/%3E%3C/g%3E%3C/svg%3E");
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99999999;
    text-align: center;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
}

.window {
    background-color: #272727db !important;
    border-radius: 4px;
    margin: 5px 5px 5px 5px;
    position: revert;
    padding: 10px 10px 10px 10px;
    box-shadow: 7px 7px 3px 3px rgb(0 0 0 / 10%);
    width: 17%;
}

.stop-scrolling {
  height: 100%;
  overflow: hidden;
}

.theme_button {
    padding: 7px 16px 8px;
    margin: 5px;
    font-size: 12.5px;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    font-family: -apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,"Noto Sans Armenian","Noto Sans Bengali","Noto Sans Cherokee","Noto Sans Devanagari","Noto Sans Ethiopic","Noto Sans Georgian","Noto Sans Hebrew","Noto Sans Kannada","Noto Sans Khmer","Noto Sans Lao","Noto Sans Osmanya","Noto Sans Tamil","Noto Sans Telugu","Noto Sans Thai",sans-serif;
    vertical-align: top;
    line-height: 15px;
    text-align: center;
    text-decoration: none;
    background: none;
    background-color: #5181b8;
    color: #fff;
    border: 0;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

.theme_button:hover {
    background-color: #3b597b;
}

.theme_text_name:hover {
    //color: #5181b8;
}

div#test1 {
    text-align: center;
}

div#key {
    text-align: center;
    margin-bottom: 40px;
}

.text_menu {
    overflow: hidden;
    height: 20px;
    margin: 5px;
    resize: none;
    border-radius: 5px !important;
    border-color: rgb(156, 157, 158) !important;
    color: white;
    background-color: #ffffff0f !important;
    box-shadow: 7px 7px 3px 3px rgb(0 0 0 / 10%);
}

div#image {
    
    
    margin: 0 auto;
    margin-bottom: 5px;
    border-radius: 4px;
}


.theme_text_name {
    user-select: none;
    font-size: 19px;
    line-height: 25px;
    font-weight: 400;
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: auto;
    margin: -1px 0 -1px -1px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 1px;

    color: #fff;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

.cont-bottom {
    border-bottom: 1px solid #b5b1b191;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: center;
    padding: 3px 0 3px 0;
    margin: 3px 0 3px 0;
}
img.izo {
    object-fit: cover;
    width: 100%;
    height: 100%;
    background: url(https://sun9-57.userapi.com/c857620/v857620009/18a5fd/uOxmtZm_L2A.jpg);
    background-size: auto;
    box-shadow: 7px 7px 3px 3px rgba(0,0,0,.1);
}

#alert
{
    /*cursor: url('https://psv4.userapi.com/c856236/u51863636/docs/d18/10eb2dcc6647/636329186537635884.png'), auto;*/
}

textarea#text_background,
textarea#text_group,
textarea#text_message

{
    border-color: #666666;
}


`)

//#endregion

//#region Окно с уведомлениями
$(document).ready(function () {
	//alert_frame(null, null, null, 10)
})

function alert_frame(title, message, icon, timer) {
	title = title || 'Заголовок сообщения.'
	title1 = title
	title = title.slice(0, 27)
	if (title.length != title1.length) {
		title += '...'
	}

	message = message || 'Cъешь ещё этих мягких французских булок да выпей же чаю.'
	message1 = message
	message = message.slice(0, 100)

	if (message.length != message1.length) {
		message += '...'
	}

	if (typeof icon == 'number') {
		timer = icon
		icon = null
	}

	icon = icon || 'https://imgcdn.wangyeyixia.com/aHR0cDovL3d3dy5wbmdtYXJ0LmNvbS9maWxlcy84L1dlYnNpdGUtUE5HLVRyYW5zcGFyZW50LnBuZw%3D%3D.png'

	//timer = timer || 0;

	$('body').prepend(
		$('<div>', { id: 'alert_frame' }).prepend(
			$('<div>', {
				id: 'alert1',
				class: 'hidden',
				html: [$('<div>', { id: 'alert1_title', text: title }), $('<div>', { id: 'alert1_icon', style: 'background-image: url(' + icon + ');' }), $('<div>', { id: 'alert1_message', text: message })]
			})
		)
	)
	$('#alert1').click(function () {
		$('#alert1').addClass('hidden')
	})

	if (timer) {
		setTimeout(function () {
			$('#alert1').addClass('hidden')
		}, timer)
	}
	setTimeout(function () {
		$('#alert1').removeClass('hidden')
	}, 500)

	GM_addStyle(`
    #alert1
    {
        display: block;
        width: 300px;
        height: 100px;
        position: fixed;
        background-color: #1f1f1fd6;
        text-align: center;
        bottom: 30px;
        align-items: center;
        right: 30px;
        z-index: 1000000000;
        opacity: 1;
        border-radius: 10px;
        box-shadow: 13px 12px 10px rgb(0 0 0 / 60%);
        transition: opacity 1s, visibility 0s;
    }

    #alert1.hidden
    {
        opacity: 0;
        visibility: hidden;
        transition: opacity 1s, visibility 0s 1s;
    }

    #alert1_title
    {
        color: white;
        font-size: 15px;
        font-weight: bold;
        margin: 4px 8px 4px 8px;
    }

    #alert1_message
    {
        text-align: left;
        font-size: 14px;
        font-weight: normal;
        color: #a0a0a0;
        margin: 8px 8px 8px 8px;
    }

    #alert1_icon
    {
        width: 64px;
        height: 64px;
        float: left;
        margin: 0px 6px 6px 6px;
        /*background-image: url(https://cdn.worldvectorlogo.com/logos/rockstar-games.svg);*/
        background-size: contain;
        background-repeat: no-repeat;
    }

`)
}
//#endregion

//#region Модальное окно //логика

var on = true
var range_11 = 0
function Start_Settings_Menu() {
	var newImage
	$('body')
		.addClass('stop-scrolling')
		.prepend(
			$('<div>', { id: 'alert' }).append(
				$('<div>', { class: 'window', id: 'window1' })
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont1',
							html: [
								$('<div>', { class: 'theme_text_name', text: 'Установка фона' }),
								$('<div>', { id: 'image', style: 'border-radius: 4px;' }).append($('<img>', { class: 'izo', style: 'border-radius: 4px; margin-left: 2px;', src: GM_getValue('background') })),
								$('<textarea>', { class: 'text_menu', id: 'text_background', text: GM_getValue('background'), style: 'height: 100px;' }).on('change keyup blur', function (e) {
									let URLtext = $('#text_background').val()
									$('#image img.izo').attr('src', URLtext)
									newImage = URLtext
								})
							]
						})
					)
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont2',
							html: [
								$('<div>', { class: 'theme_button', id: 'button_delete', style: 'display: none;', text: 'Выключить тему' }).on('click', () => {
									theme_off()
									GM_setValue('enable', false)
									//exit_();
								}),
								$('<div>', { class: 'theme_button', id: 'button_spawn', style: 'display: none;', text: 'Включить тему' }).on('click', () => {
									theme()
									GM_setValue('enable', true)
									//exit_();
								})
							]
						})
					)
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont3',
							html: [
								$('<div>', { class: 'theme_text_name', style: 'margin-top: 10px;', text: 'Текст кнопки группы' }),
								$('<textarea>', { class: 'text_menu', id: 'text_group', text: GM_getValue('group'), style: 'height: 24px; border-radius: 4px; background-color: #ffffff0f!important; margin-top: 4px; margin-bottom: 4px;' }).on('change keyup blur', function (e) {
									_group = $('#text_group').val()
								})
							]
						})
					)
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont4',
							html: [
								$('<div>', { class: 'theme_text_name', style: 'margin-top: 10px;', text: 'Текст кнопки сообщения' }),
								$('<textarea>', {
									class: 'text_menu',
									id: 'text_message',
									text: GM_getValue('message_name'),
									style: 'height: 24px; border-radius: 4px; background-color: #ffffff0f!important; margin-top: 4px; margin-bottom: 4px;'
								}).on('change keyup blur', function (e) {
									_messange_name = $('#text_message').val()
								})
							]
						})
					)
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont5',
							style: 'display: none; text-align: left;',
							html: [
								//$('<div>', { class: 'theme_text_name', style: 'margin-top: 10px;', text: 'Текст кнопки сообщения' }),
								$('<input>', {
									class: 'check45345',
									type: 'checkbox',
									checked: GM_getValue('combo_hide'),
									id: 'text_checkbox',
									style: 'vertical-align: -2px; margin: 10px 5px 5px 10px;'
								}).on('click', a => {
									combo_hide($('#text_checkbox').prop('checked'))
								}),
								$('<label>', { for: 'text_checkbox', style: 'color: #ffffff;', text: 'Скрыть VK Combo' })
							]
						})
					)
					.append(
						$('<div>', { class: 'theme_button', id: 'button_save', style: 'margin-top: 10px;', text: 'Сохранить' }).on('click', () => {
							newImage = $('#text_background').val()
							_group = $('#text_group').val()
							_messange_name = $('#text_message').val()
							GM_setValue('background', newImage)
							GM_setValue('group', _group)
							GM_setValue('message_name', _messange_name)
							GM_setValue('text_id_group', owner_id)
							GM_setValue('text_id_albom', album_id)
							GM_setValue('bc_albom_repit', bc_albom_repit)

							//$("#bc_albom_repit").val()
							rename()
							if (GM_getValue('enable') == true) {
								//bc_transparent(newImage);
								//$('body').css({ 'background': 'url("' + newImage + '") #2F2F30', 'background-size': '100%', 'background-attachment': 'fixed' })
							}
							exit_()
						})
					)
					.append($('<div>', { class: 'theme_button', id: 'button_exit', text: 'Закрыть' }).on('click', exit_))
					.append($('<button>', { class: "jscolor {valueElement:'chosen-value', onFineChange:'setTextColor(this)'}", text: 'ТЕСТ', style: 'display: none;' }))
			)
		)
	$('#alert').append('<div class="window", id="window2">')
	$('#window2').append('<div class="cont-bottom" id="2cont1"">')
	$('#2cont1').append('<div class="theme_text_name">Случайный фон из сообщества</div>')
	$('#2cont1').append('<div class="theme_button" id="button_albom_on"">включить</div>')
	if (GM_getValue('bc_albom_enable')) $('#button_albom_on').text('выключить')
	$('#button_albom_on').click(function () {
		GM_setValue('bc_albom_enable', !GM_getValue('bc_albom_enable'))

		if (GM_getValue('bc_albom_enable')) $('#button_albom_on').text('Выключить')
		if (!GM_getValue('bc_albom_enable')) $('#button_albom_on').text('Включить')
	})

	$('#2cont1').append('<div class="theme_button" id="button_albom_add"">Использовать этот открытый альбом</div>')
	if (!document.location.pathname.includes('album')) $('#button_albom_add').css({ display: 'none' })
	$('#button_albom_add').click(function () {
		add_albom()
	})

	$('#window2').append('<div class="cont-bottom" id="2cont2"">')
	$('#2cont2').append('<div class="theme_text_name">ID автора</div>')
	$('#2cont2').append('<textarea class="text_menu" id="text_id_group" placeholder="ID автора">' + owner_id + '</textarea>')

	$('#text_id_group').on('change keyup paste', function () {
		owner_id = $(this).val()
	})

	$('#window2').append('<div class="cont-bottom" id="2cont3"">')
	$('#2cont3').append('<div class="theme_text_name">ID альбома</div>')
	$('#2cont3').append('<textarea class="text_menu" id="text_id_albom"  placeholder="ID альбома">' + album_id + '</textarea>')

	$('#text_id_albom').on('change keyup paste', function () {
		album_id = $(this).val()
	})

	$('#window2').append('<div class="cont-bottom" id="2cont4"">')
	$('#2cont4').append('<div class="theme_text_name">Обновлять фон</div>')
	$('#2cont4').append('<div class="theme_text_name", style=" font-size: 16px;">Время в минутах</div>')
	$('#2cont4').append('<div class="theme_text_name", style=" font-size: 14px; color: #9c9c9c;">Для отключения установить 0</div>')
	$('#2cont4').append('<input type="number" id="bc_albom_repit" class="text_menu" min="0" value="' + bc_albom_repit + '" step="5">')

	$('#bc_albom_repit').on('change keyup paste', function () {
		bc_albom_repit = $(this).val()
	})

	function add_albom() {
		if (document.location.pathname.includes('album')) {
			href = document.location.pathname.replace('/album', '').split('_')
			$('#text_id_group').val(href[0])
			$('#text_id_albom').val(href[1])
			owner_id = href[0]
			album_id = href[1]
			get_albom()
		}
	}

	//$("#alert").append('<div style="position: absolute; display: flex; flex-direction: row; justify-content: flex-end; width: 100%; height: 100%; align-content: flex-end; flex-wrap: wrap; align-items: flex-end;"><div style ="margin: 20px;" id="img_url_original">DygDyg</div></div>');
	//$("#img_url_original").val("Ссылка на текущий фон");

	function setTextColor(picker) {
		document.getElementsByTagName('body')[0].style.color = '#' + picker.toString()
	}
	var range_coll
	range_col()
	function range_col() {
		if (range_coll && range_coll.id) {
			range_coll.remove()
		}
		//console.log(col);
		range_coll = GM_addStyle(`
        /*.top_audio_player:hover,*/
        .audio_page_player2 .audio_page_player_play:hover .icon,
        .audio_page_player2 .audio_page_player_play .icon,
        .slider .slider_amount,
        .slider .slider_back,
        .theme_button,
        #page_header_cont .back,
        .top_nav_link:hover,
        .nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected,
        .nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,
        .ui_rmenu_item:hover, .ui_rmenu_subitem:hover,
        .ui_rmenu_item_sel,
        .ui_rmenu_item_sel:hover,
        .olist_item_wrap:hover,
        .docs_choose_upload_area:hover,
        .box_title_wrap.box_grey,
        .ui_tab_sel, .ui_tab_sel:hover,
        .ui_tabs .ui_tab_sel, .ui_tabs .ui_tab_sel:hover,
        .ui_tabs_box .ui_tab_sel,
        .ui_tabs_box .ui_tab_sel:hover,
        .ui_rmenu_item:hover,
        .ui_rmenu_subitem:hover,
        .ui_rmenu_item_sel,
        .ui_rmenu_item_sel:hover,
        .olist_item_wrap:hover,
        .docs_choose_upload_area:hover,
        .button_blue button,
        .button_gray button,
        .button_light_gray button,
        .flat_button,
        .box_title_wrap.box_grey
        {
            filter: hue-rotate(${col}deg) saturate(100%);
            /*background: hsl(${col}, 39%, 47%) !important;*/
        }
        `)
	}

	if (GM_getValue('enable') == true) $('#button_delete').css({ display: 'block' })
	if (GM_getValue('enable') == false) $('#button_spawn').css({ display: 'block' })
}

function theme_off() {
	console.log('theme off')
	darkStyleBacground.remove()
	darkStyle.remove()
	darkStyle1.remove()
	$('body').css({ 'background-color': '', 'background-image': '' })
	$('#button_delete').css({ display: 'none' })
	$('#button_spawn').css({ display: 'block' })
	combo_hide(false)
}

//#endregion

var t = ' '

/*$(document).keyup(function (e) {
    t = e.code;
    console.dir(t);
});*/

let pressed = new Set()
/*$(document).on('keyup', function (e) {
    t = e.originalEvent.code;
    pressed.add(t);
    //console.log(pressed);
    pressed.clear();
    console.log(t);
});*/

/*$(document).ready(function () {
    $("body").keydown(function (event) { // задаем функцию при отпускании после нажатия любой клавиши клавиатуры на элементе
        console.log(event.which); // выводим код нажатой клавиши
    });
});*/

function exit_() {
	$('#alert').remove()
	$('body').removeClass('stop-scrolling')
}
///Модальное окно

$(document).ready(function () {
    //VideoTest("YhUPi6-MQNE")
    
	if (GM_getValue('ver_info') != ver_info) {
		// analit()
		info()
		GM_setValue('ver_info', ver_info)
	}

	//analit();
	//info();
	//console.log(vk);
	//console.log(GM_info.script.version)
})

var a = document.location.pathname.includes('/dev')
// console.log(a)
if (!a) {
	// console.log(a)
	//theme_off();
	//setTimeout(theme_off, 1000)
	if (GM_getValue('enable') == true) theme()
}

function info() {
	$('body')
		.addClass('stop-scrolling')
		.prepend(
			$('<div>', { id: 'alert' }).append(
				$('<div>', { class: 'window', id: 'window1' })
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont1',
							html: [$('<div>', { class: 'theme_text_name', text: GM_info.script.name + ' ' + GM_info.script.version }), $('<div>', { class: 'theme_text_name', text: 'Нововведения:' })]
						})
					)
					.append(
						$('<div>', {
							class: 'cont-bottom',
							id: 'cont1',
							html: [$('<div>', { style: 'font-size: 14px; text-align: -webkit-auto;', class: 'theme_text_name', text: _info })]
						})
					)
					.append($('<div>', { class: 'theme_button', id: 'button_exit', text: 'Закрыть' }).on('click', exit_))
			)
		)
}

function get_albom() {
	var req =
		'https://api.vk.com/method/photos.get?' +
		'access_token=' +
		'5068f7995068f7995068f7993e5039a129550685068f79909b64ef038338754cb12e019' +
		'&' +
		'v=' +
		'5.131' +
		'&' +
		'owner_id=' +
		owner_id +
		'&' +
		'album_id=' +
		album_id +
		'&' +
		//"photo_sizes=true&"+
		'count=1000'

	//console.log(req);

	if (GM_getValue('bc_albom_enable') == true) {
		$.get(req, function (data) {
			$('.result').html(data)
			var rand = Math.round(Math.random() * data.response.count)

			//console.log("Выбран фон №"+rand);
			{
				var urlsort = data.response.items[rand].sizes.sort((a, b) => (a.height > b.height ? 1 : b.height > a.height ? -1 : 0))

				if (urlsort.length > 0) {
					// console.log(urlsort);
					// console.log(urlsort[urlsort.length-1].url);
					GM_setValue('background', urlsort[urlsort.length - 1].url)
				}
			}
		})
	}
}

function Link_oboi() {
	$('<a id="Link_oboi">Открыть оригинал обоев.</a>').prependTo('body')
	$('#Link_oboi').attr('href', GM_getValue('background'))

	GM_addStyle(`    
            #Link_oboi {
                position: fixed;
                /* height: 100%; */
                /* width: 100%; */
                display: block;
                color: white;
                right: 15px;
                bottom: 15px;
                z-index: 10000;
                text-shadow: 2px 0 2px #000, 0 2px 2px #000, -2px 0 2px #000, 0 -2px 2px #000;
            }
        `)
}


function VideoTest(id) 
{
    $('body').prepend('<iframe id="videotest" src="https://www.youtube.com/embed/'+id+'?mode=opaque&amp;wmode=transparent&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;modestbranding=1&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;color=white&amp;iv_load_policy=3&amp;theme=light&amp;wmode=transparent&amp;mute=1&amp&playlist='+id+'" frameborder="0" allow="autoplay" style="position: fixed; width: 100%; height: 115%; z-index: -1; background-size: auto; opacity: 0;"></iframe>');

    setTimeout(() => { 
        $("#videotest").css({'transition': 'opacity 10s ease 0s'});
        $("#videotest").css({'opacity': '100'});
    }, 2000);
    setTimeout(() => { $("#videotest").onpause(); }, 4000)
}