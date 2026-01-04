// ==UserScript==
// @name         VK Dark
// @namespace    https://github.com/
// @version      0.2.38
// @description  Изменяет внешний вид Вконтакте на темный
// @author       Dmitriy1921
// @supportURL   https://vk.com/dmitriy1921
// @homepage     https://github.com/Dmitiry1921/VK-Dark/blob/master/README.md
// @include      http://vk.com/*
// @include      https://vk.com/*
// @include      https://static.vk.com/*
// @include      https://vkpay.io/*
// @include      https://connect.vk.com/*
// @include      https://*.vkforms.ru/*
// @exclude      https://vk.com/notifier.php?*
// @icon         https://github.com/Dmitiry1921/VK-Dark/raw/master/src/icon.svg
// @icon64       https://github.com/Dmitiry1921/VK-Dark/raw/master/src/icon.svg
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402651/VK%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/402651/VK%20Dark.meta.js
// ==/UserScript==
// Пункт меню, добавляется после старта браузера
// ShortVideoFeedBlock
const styles = {
    'vkdark-main': `:root {
  --steel_gray_10: #626568 !important;
  --steel_gray_20: #3b3f41 !important;
  --steel_gray_80: #242424 !important;
  --gray_900: #e1e3e6 !important;
  --separator_common: #242424 !important;
  --text_primary: #e1e3e6 !important;
  --background_content: #3b3f41 !important;
  --placeholder_icon_background_opaque: #242424 !important;
  --button_secondary_background: #242424 !important;
  --text_link: #b0ccda !important;
  --input_border: #1a1a1a !important;
  --content_tint_background: #2d2f30 !important;
  --background_light: #3b3f41 !important;
  --content_negative_background: #7c3d3d;
}
.ui_search_new.ui_search_btn_large .ui_search_button_search,
.ui_search_new.ui_search_dark .ui_search_button_search,
.ui_search_new.ui_search_field_empty .ui_search_button_search {
  margin-left: 1px;
}
.page_photos_module {
  padding: 5px;
}
.page_square_photo {
  height: 127px;
}
.audio_page_player .audio_page_player_title {
  color: inherit;
}
.audio_layer_container .audio_page_layout .audio_search {
  margin: -1px 20px 10px;
}
.im-mess.im-mess_selected:last-child:before,
.im-mess.im-mess_unread:last-child:before {
  content: none !important;
}
.page_block._audio_page_content_block:before,
.audio_page_layout .audio_block:before,
.im-aside-notice,
.im-page.im-page_classic.im-page_group .im-group-online .im-group-online--inner,
.media_voting,
.im-page_classic .im-page--chat-header-in,
.im-audio-message-track,
.im-audio-message_recording,
.im-audio-message_recorded {
  box-shadow: 0 0 0 1px #242424 !important;
}
.im-page_classic.im-page .im-page--dialogs-search,
.CatalogBlock--divided:before {
  box-shadow: 0 0 0 1px #1a1a1a !important;
}
.im-page_classic.im-page .im-page--chat-body-abs,
.im-page_classic.im-page .im-page--chat-input .im-chat-input,
.im-page_classic.im-page .im-page--dialogs-footer,
.Button--mobile,
._playlist_page_content_block {
  box-shadow: 0 1px 0 0 #1a1a1a, 0 0 0 1px #1a1a1a !important;
}
.im-mess.im-mess_selected + .im-mess:before,
.im-mess.im-mess_unread + .im-mess:before {
  height: 0 !important;
}
.CatalogBlock--divided:before,
.Mailings_desktop .GroupPage__footer,
.top_notify_cont ._notify_unread .feed_row:first-child .feedback_row_wrap,
.page_block,
.mv_info,
.CatalogBlock--divided:first-child:before,
.CatalogSection:first-child:before,
.post_top_info_wall_like,
.post_top_info_wall_event,
.post_top_info_wall_group,
.post_top_info_wall_guide,
.post_top_info_wall_mention,
.post_top_info_wall_podcast,
.post_top_info_wall_poll_vote,
.post_top_info_wall_reply,
.post_top_info_wall_vkgo,
.ShortVideoPost,
.ShortVideoPage .page_block_h2,
[dir] .MarketCatalogLocationTooltip,
.FCPanel__list,
.FCWindow,
.FCThumb--wide .FCThumb__close,
[dir] .PortalNavigationDropdown,
[dir] .Header,
[dir] .landing_transparencyFooter {
  box-shadow: none !important;
}
.post_top_info_wall_guide,
.post_top_info_wall_mention,
.post_top_info_wall_reply,
.im-create.im-create_classic .im-create--table,
.Panel_block_2RPF-,
.Page_contentPanel_3WDOJ,
.dev_page_block,
#dev_left_nav,
.dev_section_methods_wrap {
  box-shadow: 0 1px 0 0 #242424, 0 0 0 1px #242424 !important;
}
.page_square_photo {
  margin: 0;
}
.im-chat-input--scroll,
.im-replied {
  border-radius: 5px;
}
.im-chat-input--scroll .im-fwd.im-fwd_msg {
  padding: 5px 7px;
}
.chat_cont_sh_bottom,
.chat_cont_sh_top {
  background: linear-gradient(180deg, rgba(216, 223, 230, 0), #3b3f41 80%) !important;
}
.audio_page_player2.audio_page_player_fixed,
.audio_layer_container .audio_page_player_wrap {
  box-shadow: 0 5px 10px #242424 !important;
}
.audio-msg-track .slider .slider_amount {
  background: transparent !important;
}
.ChatSettingsInfo {
  box-shadow: 0 1px 0 #242424 !important;
}
.List--border,
.ChatSettingsMembersWidget {
  box-shadow: 0 1px 0 #242424, 0 -1px 0 #242424 !important;
}
.page_list_module .line_cell .desc_info,
.page_list_module .line_cell .extra_info,
.page_list_module .line_cell .info {
  padding: 4px 0 0 7px;
}
.poster__slider-arrow._right {
  box-shadow: -5px 0 5px 0 #3b3f41 !important;
}
.poster__slider-arrow._left {
  box-shadow: 5px 0 5px 0 #3b3f41 !important;
}
.chats_sp.fc_clist_search_icon {
  margin: 10px 7px 0 0 !important;
}
.post_top_info_ads_group_members {
  box-shadow: 0 0 0 1px #242424, 0 1px 0 0 #242424 !important;
}
.ui_rmenu_count {
  padding: 1px 0;
}
.ui_rmenu_count {
  float: left;
}
.im-create.im-create_material {
  position: absolute;
}
.wall_module .post {
  padding-top: 3px;
}
.im-chat-input--text {
  caret-color: #e1e3e6 !important;
}
.nim-dialog.nim-dialog_pinned + .nim-dialog:not(.nim-dialog_pinned)::before {
  height: 2px !important;
}
[dir] .post_top_info_caption {
  padding: 3px 0 6px 10px !important;
}
.im-page .im-page--history {
  width: calc(100% - 317px);
}
[dir=ltr] .SideOfficeMenu__nav::after {
  background: linear-gradient(rgba(255, 255, 255, 0), #3b3f41 70%), 0 100% !important;
}
.fakeinput,
div[contenteditable=true],
input.big_text,
input.search,
input.text,
textarea,
.page_media_poll_wrap,
.ui_tabs.ui_tabs_box,
.im-page--chat-header,
.tabbed_box .summary_tab .summary_tab3:hover,
.tabbed_box .summary_tab_sel .summary_tab3:hover,
.tabbed_box .summary_tab_sel a:hover,
.tabbed_box .summary_tab a:hover,
.friends_import_row:hover,
.audio_pl_snippet,
div.fc_tab_txt,
.ui_tabs_header,
.wdd_text,
.wall_module .reply_form,
.im-mess.im-mess_gift,
.PageSection--gradient:before,
[dir] .ui_gallery_wall_cards .wall_card,
.FCThumb--wide .FCThumb__close,
[dir] .selector_container table.selector_table,
[dir] .flist_search_cont input.ui_search_field,
[dir] .datepicker_control {
  background: none !important;
}
html,
body,
.im-page_classic.im-page .im-chat-history-resize,
.im-create,
#profile_groups_link:hover,
.gift_tt_show_all,
#page_wrap,
.MassMentionWarning,
[dir] .ui_rmenu_count.grey,
.wdd_add2,
.CallParticipantList__list,
[dir] .CallSnippet,
[dir] .nim-dialog.nim-dialog_pinned + .nim-dialog:not(.nim-dialog_pinned)::before,
[dir] .FlatButton--secondary,
[dir] .FlatButton--secondary:not(.disable):hover,
[dir] .vkuiActionSheet--desktop,
[dir] .landing_transparencyFooter,
[dir] .im-mess.im-mess_gift,
[dir] .stats_cont_browse_tile {
  background-color: #1a1a1a !important;
}
.article_ed_layer,
.article_layer,
.article,
.photos_container_edit_grid .photos_photo_edit_row,
.pe_filter_thumb.pe_filter_selected,
.pe_actions,
.page_actions_wrap,
#top_profile_menu,
.piechart_col_header th,
.ui_scroll_default_theme > .ui_scroll_bar_container > .ui_scroll_bar_outer > .ui_scroll_bar_inner,
.audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_slide,
.photos_choose_upload_area,
.web_cam_photo,
.photos_choose_bottom,
.deep_active .replies .reply_field_wrap .reply_field,
.deep_active .replies .wl_reply_form_wrap .reply_field_wrap .reply_field,
.deep_active.wall_module .replies .reply_field_wrap .reply_field,
.deep_active.wall_module .replies .wl_reply_form_wrap .reply_field_wrap .reply_field,
.deep_active.wall_module .wl_replies_block_wrap .reply_field_wrap .reply_field,
.deep_active.wall_module .wl_replies_block_wrap .wl_reply_form_wrap .reply_field_wrap .reply_field,
.deep_active .wl_replies_block_wrap .reply_field_wrap .reply_field,
.deep_active .wl_replies_block_wrap .wl_reply_form_wrap .reply_field_wrap .reply_field,
#mv_comments_header,
.gifts_box_header,
.gifts_constr_preview,
.wk_voting_option_bar,
.result_list ul li.active,
.selector_container,
.result_list ul,
.summary_tab2:hover,
input.dark,
.sticker_hints_tt,
.deep_active .replies .reply_fakebox,
.like_share_emoji_wrap div[contenteditable=true],
.tt_default,
.tt_default_right,
.AudioPlaylistSnippet,
.ActionsMenu__inner,
.ui_actions_menu,
.ms_items_more,
.media_link__label,
.feed_friends_recomm .ui_gallery_item:first-child,
.privacy_dropdown .header,
.privacy_dropdown .body,
.privacy_dropdown .l_item,
.privacy_dropdown .l_item_sel,
.Dropdown__in,
.emoji_tabs,
.emoji_bg,
.video_choose_upload_area,
.video_add_external,
.video_choosebox_bottom,
.im-to-end:focus .im-to-end__button,
.im-to-end:hover .im-to-end__button,
.im-to-end__button,
.links-list__item:hover,
.PopupHeader,
.ChatSettingsMembersWidget__add:before,
.im_stickers_my_tip,
.medadd_c_linkcon,
.scrollbar_inner,
.scrollbar_hovered,
.scrollbar_inner:hover,
.friends_cur_filters .token,
.idd_popup .idd_items_content,
.idd_popup .idd_header_wrap,
.audio_pl_edit_box .ape_cover,
#audio_status_tt .audio_status_sep,
.audio_row__more_actions .audio_row__more_action:hover,
#groups_menu_items .groups_edit_menu_items .groups_edit_menu_item .groups_edit_menu_item_line,
.market_item_photo_container,
.market_comments_header:hover,
.market_comments_header,
.wke_b:hover,
.mv_desc .can_edit:hover,
.EditableLabel:hover .EditableLabel__text,
.MainActions_action_3owFz:after,
.MainStatus_button_1p4_4,
.Button_block_2bjH0.Button_secondary_3vjw8,
.Card__hr,
.wddi_over,
.im-page.im-page_classic.im-page_group .im-group-online,
.media_voting_option,
.sticker_hints_arrow.sticker_left,
.sticker_hints_arrow.sticker_right,
.mv_info .ui_rmenu,
.bd_arrow,
.bd_day_head,
.msg,
input.text.ts_input,
.poster__change-bkg-btn,
input.text.ts_input:focus,
.audio_pl_edit_box .ape_add_audios_btn:hover,
.audio_pl_edit_box .ape_add_pl_audios_btn:hover,
.docs_choose_rows .docs_item:hover,
.docs_choose_upload_area,
.docs_choose_upload_area:hover,
.button_gray button.hover,
.button_gray button:hover,
.flat_button.secondary.hover,
.flat_button.secondary:hover,
textarea,
.pv_cont .pv_can_edit:hover,
em.ts_clist_hl,
.audio_w_covers .audio_row.ui_gridsorter_moveable .audio_row_content,
.ui_search_sugg_list,
.im-page .im-page--history-new-bar:after,
.im-page .im-page--history-new-bar:before,
.ListItem--border:before,
.replies_open,
.wr_header,
.wall_module .page_media_thumbed_link,
.button_gray button,
.flat_button.secondary,
.im_stickers_bl_wrap,
.ap_layer_wrap .ap_layer__content,
div.wdd,
div.wdd.wdd_focused,
.ui_search_new .ui_search_input_inner,
.ui_search_new.ui_search_dark .ui_search_input_inner,
.payments_money_transfer_comment,
.payments_money_transfer_amount,
.im_stickers_buy_header,
.im-page .im-page--top-date-bar,
#mail_box_editable,
.im-mess .im-mess--post,
.feedback_row_answer,
.payments_money_transfer_amount_wrap,
.top_notify_show_all,
.im-mess.im-mess_light,
.bd_day_cell.holiday,
.settings_separated_row + .settings_separated_row:after,
.ui_search_new.ui_search_btn_large .ui_search_button_search,
.ui_search_new.ui_search_dark .ui_search_button_search,
.stories_link,
.CatalogBlock__separator,
.Button--tertiary:not(.Button--disabled):focus,
.Button--tertiary:not(.Button--disabled):hover,
.Select__option--selected,
.Select__option:hover,
.ui_search_new.ui_search_field_empty .ui_search_button_search,
.disabled.selector_container,
body.author_page_body,
.author_page_layer,
.gift_tt_show_all,
.article_layer .article_layer__content_footer,
.audio_pl_edit_box .ape_add_audios_btn,
.audio_pl_edit_box .ape_add_pl_audios_btn,
.verification_alert.default,
.wdd_hl,
.payments_box_wide .payments_getvotes_method_opt:hover,
.payments_box_wide .payments_box_menu .payments_getvotes_active_row,
.payments_box_wide .payments_box_menu .payments_getvotes_active_row:hover,
.im-audio-message_recording,
.im-audio-message_recorded,
.im-dropbox,
.im-dropbox--visible,
.im-dropbox--rect,
.im-dropbox--rect .dropbox_over,
.bt_tag_label,
[dir] .BannerItem,
.page_actions_item:hover:not(.grey_hoverable),
[dir] #group_section_menu .module_body .ui_gallery .ui_gallery_item .groups_menu_item .groups_menu_item_image .groups_menu_item_image_content.groups_menu_item_placeholder,
[dir] .ui_search_new .ui_search_button_search,
.article_snippet_mini_info_block,
.bt_report_footer,
.bt_comment_form_actions,
.PeerProfile__container,
.pv_comments_header,
#dev_top_input,
[dir] .ModalHeader--blue,
[dir] .ModalFooter,
.ChatSettingsPresetPanel__preset--selected,
[dir] .post_top_info_caption,
[dir] .im-mess.im-mess_selected:not(.im-mess_is_editing) .post_top_info_caption,
[dir] .im-mess.im-mess_light .post_top_info_caption,
.im-mess--text .wall_post_cont,
.im-mess--text ._wall_post_cont,
[dir] .ReactionsMenu,
[dir] .PostBottomAction,
[dir] .lead_forms_app_error,
[dir] .lead_forms_buttons_wrap,
[dir] .FlatButton--tertiary:not(.disable):hover,
[dir] .FlatButton--tertiary:not(.disable):focus,
[dir] .FlatButton--tertiary:active,
[dir] .pretty-card,
[dir] .Header,
[dir] .author_page_up_hover .author_page_up,
[dir] .im_stickers_my_row.sort_taken,
[dir] .im_stickers_my_row.sort_taken:last-child,
[dir] .prefix_input_wrap,
[dir] .SitesExamplesGalleryCard,
[dir] .Table__Cell--hasSort {
  background-color: #242424 !important;
}
.im-create .im-create--tabs,
.ui_rmenu_item:hover,
.ui_rmenu_subitem:hover,
.ui_rmenu_item_sel,
.ui_rmenu_item_sel:hover,
.poster__toolbar,
.poster__slider-arrow,
.apps_i_wrap,
.apps_i_policy,
.apps_options_bar,
.apps_footer,
.audio_pl_snippet2,
#fc_contacts,
.fc_content,
.chat_onl_inner,
.fc_tab,
.fc_tab_notify,
#wk_box,
.pv_author_block,
.faq_tabs.ui_tabs,
.tickets_post_field,
.owner_photo_additional,
.MessageForward__content,
.article_ed_layer .article_ed_layer__header,
.pe_tabs_panel,
.photo_upload_separator,
.wall_module .reply_fakebox,
.tickets_header,
.box_msg,
.box_msg_gray,
.result_list ul li.active,
.selector_container td.selector .token_inner,
.selector_container td.selector .token_prefix,
.emoji_sticker_item.over,
.emoji_sticker_item:hover,
.im-page--toolsw,
.AudioPlaylistSnippet .ActionButton--shuffle:hover,
.im-chat-input,
.ActionsMenu__item--hover,
.ActionsMenu__item:hover,
.ui_actions_menu_item:hover,
.media_selector .ms_items_more .ms_item:hover,
.notify_sources_tt_content .content:not(:hover) .line_cell.selected,
.notify_sources_tt_content .line_cell:hover,
.wall_module:not(.search_results) .post--with-likes:not(.post_copy):not(.post_btl):not(.post_wf):not(.post_fr_likes) .wall_text .media_link:last-child,
.privacy_dropdown .item_sel,
.privacy_dropdown .item_sel_plus,
.privacy_dropdown .l_header,
.privacy_dropdown .l_header .l_header_label,
.privacy_dropdown .l_item:hover,
.privacy_dropdown .l_item_sel:hover,
.Dropdown__item:hover,
.mention_tt_actions,
.emoji_tt_wrap,
.emoji_tab_sel,
.emoji_tab_sel:hover,
.emoji_tab:hover,
.emoji_tabs_l_s:hover,
.emoji_tabs_r_s:hover,
.emoji_tabs_l_s,
.emoji_tabs_r_s,
.emoji_shop:hover,
.emoji_cat_title,
.im_sticker_bl,
.ui_search_fltr,
.idd_popup .idd_item.idd_hl,
#apps_layer .apps_header_wrapper,
#groups_menu_items .groups_edit_menu_items .group_apps_list_row_drag_wrapper,
.ui_ownblock:hover,
.market_item_content,
.bookmark_footer,
.wl_post_reply_form_forbidden,
.wpost_post,
.wke_controls,
.wke_page_title_cont,
.pages_header_info,
.pages_history_header_wrap,
#mv_pl_tt .mv_tt_add_playlist:hover,
#mv_pl_tt .mv_tt_add_playlist,
.Panel_block_2RPF-,
.TopMenu_block_1KqlS,
.Panel_footer_epjyB,
.Panel_header_2eRoj,
.Page_contentPanel_3WDOJ,
.Mailings_desktop .GroupPage__footer,
.Button--secondary__29JKy,
.DesktopRoot,
.Card,
.wddi,
.im-aside-notice,
.im-page.im-page_classic.im-page_group .im-group-online .im-group-online--inner,
.media_voting,
.audio_row__more_actions .audio_row__more_action,
.im-page_classic.im-page .im-page--dcontent,
.submit_post,
.im_stickers_store_wrap .ui_tabs,
.page_block_header,
div.fc_clist_filter_wrap,
.flat_button.ui_load_more_btn,
.settings_block_footer,
.mv_info,
.top_profile_mrow:hover,
.photos_period_delimiter_fixed,
.tabbed_box .summary_tab_sel .summary_tab2,
.audio_pl_edit_box .ape_header,
.group_l_row,
.audio_layer_container .audio_page_player,
.box_body,
.fc_msgs_unread,
.pv_cont .narrow_column,
.box_body .im_stickers_store_wrap .ui_tabs,
.ap_layer .audio_pl_snippet .audio_pl_snippet__header_inner,
.audio_pl_snippet .audio_pl_snippet__header,
.photos_container .photos_row,
.box_controls,
.ts_cont_wrap,
.feedback_row_wrap.unread:not(.feedback_row_touched),
.pv_white_bg,
.pva_period_fixed,
.wk_history_tabs,
.ChatSettings__content,
.ChatSettingsInfo,
.List,
.ChatSettingsMembersWidget,
.Button--mobile,
.ChatSettingsInvitationLink,
.ChatSettingsResetInvitationLink__text,
.SubmitArea,
.audio_pl_snippet2 .audio_shuffle_all_button:hover,
.audio_page_layout .audio_page_separator,
input.BlockSearchInput,
.photos_container_edit_grid .photos_photo_edit_row_desc_placeholder,
.online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--photo .online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--photo .online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--photo .online.mobile:after,
.stl_active.over_fast #stl_bg,
.wall_module .post_like:hover,
.wall_module .post_reply:hover,
.wall_module .post_share:hover,
.audio_row:hover:not(.audio_row__current) .audio_row_content,
.left_count_wrap,
.mail_box_cont,
#group_apps_list .group_apps_list_rows .group_apps_list_row .group_apps_edit,
.apps_i_panel,
.page_status_editor .editor,
.im-page-pinned,
.box_title_wrap.box_grey,
.eltt,
.bd_day_cell,
.im-chat-input--scroll,
#top_notify_wrap,
.im-mess.im-mess_selected + .im-mess:before,
.im-mess.im-mess_unread + .im-mess:before,
.im-chat-input .im-chat-input--txt-wrap,
#side_bar ol li .left_row:hover,
.info_msg,
.audio_pl_edit_box .ape_add_pl_audios_btn,
#mv_publish,
.audio_pl_edit_box .ape_list_header,
.thumbed_link__thumb,
.thumbed_link--chat-invitation,
.thumbed_link__label,
.im-page_classic.im-page .im-create,
.deep_active .replies .reply_box_inner_wrap.fixed,
.deep_active.wall_module .replies .reply_box_inner_wrap.fixed,
.deep_active.wall_module .wl_replies_block_wrap .reply_box_inner_wrap.fixed,
.deep_active .wl_replies_block_wrap .reply_box_inner_wrap.fixed,
.Select--opened .Select__control,
.Select__menu,
.medadd_inline_editable:hover,
.settings_line.unfolded,
.PeerProfile,
.wddi_over .wdd_hl,
.Modal__header--blue,
.MultiSelect__search,
.BaseModal__content,
.TokenInput__input,
.Modal__footer,
.EditorTabs__header,
.StickersPanel__header,
.StickersPanel__tab--recent,
.settings_alert .header,
.im-audio-message-track,
.docs_choose_dropbox_wrap,
.notifications_new_events,
.group_api_url_desc,
.groups_edit_event_log_controls,
.ProfileEditorVkconnect__notice,
.audio_page_player__cover,
.poster__cta-btn [dir] .DownloadedGameItem:hover,
.addresses_header,
.tt_w.top_notify_tt,
.post_upload_dropbox,
.post_upload_dropbox_inner,
.ShortVideoPage .page_block_h2,
[dir] .mv_live_gifts_arrow_left,
[dir] .mv_live_gifts_arrow_right,
.mv_live_gifts_supercomment,
.docs_panel,
.Button--secondary,
.nav_selected,
.wk_text blockquote,
[dir] .dev_top_link.sel,
[dir] .TopSearch__input,
[dir] .PhotoTagCard,
[dir] .im_stickers_promo_banner,
[dir] .im_stickers_bl_wrap,
[dir] .StickerPackPreview__items,
[dir] .StickerPackPreview__copyrights,
[dir] .StickerPackPreview__styles,
[dir] .StickerPackSettings__styles,
[dir] .StickerPackSettings__stylePreview,
.emoji_sticker_image,
[dir] .DonutSubscribePopup__donatorAdvantages,
[dir] .thumbed_link,
[dir] .Select__control,
[dir] .mv_playlist,
[dir=ltr] .VideoRecomsItem,
[dir] .im-page .im-page--dialogs-footer,
[dir] .ModalHeader,
.FCPanel__add,
.FCPanel__list,
.FCThumb,
.FCWindow,
.im-top-banner,
[dir] .Input,
.HeaderSectionSwitcherDropdown__item > a,
[dir] .SideOfficeMenu__link:focus,
[dir] .SideOfficeMenu__link:hover,
[dir] .StoriesArchive__selectFooter,
[dir] .AppsCatalogSelectMenu,
[dir] .ListItem--selectable,
[dir] .flist_sel,
[dir] .PhotoViewTopPanel,
.settings_alert .text,
.settings_alert .footer .cancel_btn:hover,
[dir] .HeaderNotifier:hover,
[dir] .HeaderNotifier.active {
  background-color: #3b3f41 !important;
}
.page_photo.page_action_menu_groups .group_notification_settings .group_notification_setting:hover,
.page_actions_header,
.tu_last:hover,
.im-page .im-page--mess-search,
.gifts_constr_option:hover,
.audio_pl_edit_box .ape_pl_item:hover,
.im-mess.im-mess_selected:last-child:before,
.im-mess.im-mess_unread:last-child:before,
.audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_back,
.audio_page_player2 .audio_page_player_track_slider.slider.slider_size_1 .slider_slide,
.audio_page_player2 .audio_page_player_volume_slider.slider.slider_size_1 .slider_slide,
[dir] .JobsForm--apply #jobs_apply_upload_cont button:hover,
.ListItem--can-be-hovered.ListItem--selectable:hover {
  background-color: #626568 !important;
}
#page_header_cont .back,
.fc_tab_head,
.box_title_wrap,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected,
.page_block,
.im-page_classic .im-page--chat-header .im-page--toolsw,
.audio_page_player2 .audio_page_player_status.audio_page_player_btn_enabled .btn_icon,
.audio_page_layout .audio_search_wrapper,
.audio_page_layout .has_friends_block .audio_page__rows_wrap,
.audio_page_layout .audio_friends_list,
.audio_page_player.audio_page_player_fixed,
.audio_page_player2.audio_page_player_fixed,
.flat_button.secondary_dark,
.ui_search,
.ui_grey_block,
.im-page .im-page--history-new-bar,
.im-page .im-page--history-new-bar > span,
.im-page_classic.im-page .im-page--chat-body-wrap-inner,
.im-page_classic.im-page .im-page--chat-input .im-chat-input,
.CatalogBlock--divided,
.profile_info_header,
.profile_info_edit,
.im-create .im-create--table > div,
.Input[readonly],
.help_table_question_visible,
.wall_module .reply_fakebox_wrap,
.wall_module .reply_box,
.language_box_row:hover,
.tickets_thank_you_form,
.CatalogSection,
.im-navigation--to-end .im-navigation__button,
.search_filters_minimized_text,
.friends_search_filters,
.friends_search_import,
.photos_edit_selection_header,
.audio_pl_attach_preview,
.fc_msgs,
.PageNavigation_wrap,
#payments_box_right_col,
.wall_reply_text,
.wall_post_cont,
._wall_post_cont,
.reply,
.reply_dived,
.reply_replieable,
._post,
.group_tokens_row,
.group_page_block_footer,
.group_l_row,
.ShortVideoPost,
#stats_cont.stats_cont_browse,
.submit_post,
.dev_page_block,
#dev_left_nav,
.dev_section_methods_wrap,
.dev_page_narrow,
#dev_top_nav_wrap,
#page_header_cont,
#payments_box .payments_about_votes,
.payments_about_votes,
.payments_getvotes_method_opt:hover,
.payments_getvotes_method_opt.payments_getvotes_active_row,
.CallManagementModal__content,
.CallManagementModal__section,
.CallSettings__cameraStub,
.InputStub,
.ChatSettings__content,
.ChatSettingsPresetPanel,
.post_top_info_caption,
[dir] .ReplyBoxDonut,
[dir] #pv_box,
[dir] .PostShowMore,
[dir] .MarketCatalogHeader,
[dir] .MarketCatalogLocationTooltip,
[dir] .MarketCatalogHeader--fixed,
[dir] .MarketCatalogTabs,
[dir] .MarketCatalogBlockBanner,
[dir] .MarketCatalogBlockList,
.FCPanel__add:hover::before,
.FCPanel__add:focus::before,
.FCConvoListItem:hover,
.FCConvoListItem[aria-selected='true'],
.ConvoMessage,
.ConvoMessage--out,
[dir] .audio_layer_container .ui_tabs,
[dir] .video_showcase .page_header_wrap,
[dir] .VideoLayout__aside,
[dir] .mv_minimized #mv_layer.mv_layer--vertical #mv_box,
[dir] .Breadcrumbs,
[dir=ltr] .SideOfficeMenu,
[dir] .SideOfficeMenu__link--active,
[dir] .SideOfficeMenu__navList::after,
[dir] .help_table_question__ans_text .wk_hider_box_opened,
.Logo__colors,
.Logo__colors_exception,
.Colors .Brand__block,
.Logo__right,
.Logo__left .Brand__block,
.Products__left,
.Products__right,
.Partners .Brand__block,
.Header,
[dir] .JobsForm--apply .JobsApplyUploadContent button,
[dir] .FeedbackTitle,
[dir] .FeedbackTooltip__wrapper,
[dir] .cal_table,
.BestFriendsSettingsBox__inner,
[dir] .BestFriendsSettingsBox__header,
[dir] .ColorPanelEnabledBox,
[dir] .vkuiModalCardBase__container,
[dir] .wk_wall_archive__tabs,
[dir] .ImageStatusPopup,
.ui_search.ui_search_old,
[dir] .choose_search_cont input,
[dir] .PrivacyModal__box,
[dir] .datepicker_text,
.settings_alert .header,
.settings_alert .footer,
[dir] .BudgetBalance,
[dir] .BudgetStats {
  background-color: #2d2f30 !important;
}
.top_audio_play__button,
.top_audio_play__button:hover,
.top_audio_play__button:hover:before,
.top_audio_play__button:before,
.article > cite:before,
.article > cite:after {
  background-color: #ffffff !important;
}
a.fc_contact_over,
.chat_tab_wrap:hover,
.ui_search_sugg_list .ui_search_suggestion_selected,
.nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_hovered.nim-dialog_unread-out .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_hovered.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted):hover.nim-dialog_unread-out .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted):hover.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,
.audio_layer_container .audio_friend:hover,
.audio_page__shuffle_all .audio_page__shuffle_all_button:hover,
.im-mess.im-mess_selected:not(.im-mess_is_editing),
.im-mess.im-mess_selected:not(.im-mess_is_editing):hover,
.my_current_info:hover,
.no_current_info:hover,
.profile_more_info_link:hover,
.audio_row.audio_row__current .audio_row_content,
.tabbed_box .summary_tab_sel a:hover,
.tabbed_box .summary_tab a:hover,
.top_notify_cont .feedback_row:not(.dld).hover,
.top_notify_cont .feedback_row:not(.dld):hover,
a.ts_contact.active,
a.ts_search_link.active,
.article_ed_layer .article_ed_layer__list_item:not(.article_ed_layer__list_item_current):hover,
.media_voting_can_vote.media_voting_clickable_option .media_voting_option_wrap:not(.media_voting_option_selected):hover .media_voting_option,
.im-mess.im-mess_unread:not(.im-mess_light),
.feed_new_posts:hover,
.pv_like:hover,
.im-replied,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic,
.nim-dialog:not(.nim-dialog_deleted):hover,
.im_msg_audiomsg .audio-msg-track:not(.audio-msg-player):hover,
.flat_button.ui_load_more_btn:hover,
.im-mess.im-mess_search:hover,
.olist_item_wrap:hover,
.feedback_row_clickable:not(.feedback_row_touched):hover,
.feed_row ~ .feed_row .feedback_row_clickable:not(.feedback_row_touched):hover,
.top_notify_show_all:hover,
body .im-page--back-btn:hover,
.AuthorPageHeader__create:hover,
.eltt .eltt_fancy_action:hover,
.groups_edit_event_log_item_main:hover,
.bt_reporter_row:hover,
.line_value:hover,
.top_profile_vkconnect_row:hover,
.VideoLayerInfo__description .can_edit:hover,
[dir] .dev_nav .nav:hover,
[dir] .dev_top_link.sel:hover,
.dev_methods_list_row:hover,
[dir=ltr] .ModalHeader--blue .ModalHeader__back:hover,
[dir=ltr] .ModalHeader--blue .ModalHeader__back:focus {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
.slider .slider_amount,
.slider .slider_handler,
.audio_page_player2 .audio_page_player_play .icon,
.audio-msg-track .audio-msg-track--btn,
._audio_page_content_block .ui_tabs.ui_tabs_sliding .ui_tabs_slider,
.recoms_special_block_inner > .round_button,
.PlaceholderSmall__actions > .flat_button {
  background-color: #e82f94 !important;
}
.audio-msg-track .audio-msg-track--wave-wrapper .audio-msg-track--wave path {
  stroke: #e82f94 !important;
}
.slider .slider_back {
  background-color: #A9B7C5 !important;
}
.top_nav_btn.active,
.top_nav_btn:hover,
.top_audio_player:hover,
.top_nav_link:hover,
.top_nav_link.active {
  background-color: rgba(36, 36, 36, 0.5) !important;
}
.top_nav_btn#top_notify_btn .top_nav_btn_icon,
.top_nav_btn#top_notify_btn:hover .top_nav_btn_icon {
  background-image: url('data:image/svg+xml;charset=utf-8,<svg%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20width%3D"20"%20height%3D"20"%20viewBox%3D"0%200%2020%2020"><path%20fill%3D"%23fff"%20fill-rule%3D"evenodd"%20d%3D"M8%2C18%20C6.64583333%2C18%205.5%2C17.3%205.5%2C16%20L10.5%2C16%20C10.5%2C17.3%209.35416667%2C18%208%2C18%20Z%20M13.9956933%2C11%20C13.9956933%2C12.5%2016%2C12.5%2016%2C13.5%20C16%2C14%2016%2C15%2013.8955984%2C15%20L1.98430985%2C15%20C-6.19060359e-13%2C15%20-1.62536651e-13%2C14%20-1.63424829e-13%2C13.5%20C-1.63369318e-13%2C12.5%201.98430985%2C12.5%202%2C11%20L2%2C8%20C2%2C4%204.09724901%2C1.5%207%2C1.1%20L7%2C1%20C7%2C0.4%207.5%2C5.74053187e-17%208%2C0%20C8.5%2C0%209%2C0.4%209%2C1%20L9%2C1.1%20C11.902751%2C1.5%2013.9956933%2C4%2013.9956933%2C8%20L13.9956933%2C11%20Z"%20transform%3D"translate(2%201)"%2F><%2Fsvg>') !important;
}
.top_nav_btn#top_audio .top_nav_btn_icon,
.top_nav_btn#top_audio:hover .top_nav_btn_icon {
  background-image: url('data:image/svg+xml;charset=utf-8,<svg%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20width%3D"20"%20height%3D"20"%20viewBox%3D"0%200%2020%2020"><path%20fill%3D"%23fff"%20fill-rule%3D"evenodd"%20d%3D"M14%2C11.1552322%20L14%2C5.5%20L7%2C7.5%20L7%2C15.2999878%20C7%2C15.2999878%206.99923979%2C15.2998738%206.99774901%2C15.2996427%20C6.99305423%2C16.449672%205.98201611%2C17.5525634%204.53840209%2C17.8858479%20C2.90786903%2C18.2622862%201.34293783%2C17.5143682%201.04303041%2C16.2153265%20C0.743122996%2C14.9162848%201.82180821%2C13.5580399%203.45234127%2C13.1816017%20C3.98965862%2C13.0575522%204.51985206%2C13.0556001%205%2C13.1552322%20L5%2C3.9955775%20C5%2C3.44483697%205.42843442%2C2.88315425%205.95693506%2C2.73901771%20L15.0430649%2C0.26098229%20C15.568787%2C0.117603555%2016%2C0.447563354%2016%2C0.999660731%20L16%2C13.2999878%20C15.999253%2C13.2998718%2015.9985027%2C13.2997528%2015.9977491%2C13.2996309%20C15.9930612%2C14.4496644%2014.9820211%2C15.5525622%2013.5384021%2C15.8858479%20C11.907869%2C16.2622862%2010.3429378%2C15.5143682%2010.0430304%2C14.2153265%20C9.743123%2C12.9162848%2010.8218082%2C11.5580399%2012.4523413%2C11.1816017%20C12.9896586%2C11.0575522%2013.5198521%2C11.0556001%2014%2C11.1552322%20Z"%20transform%3D"translate(1%201)"%2F><%2Fsvg>') !important;
}
.im-page--back-btn {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2216%22%20viewBox%3D%220%200%209%2016%22%20width%3D%229%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m8%2015.9c-.2%200-.4-.1-.6-.3l-7-7c-.3-.3-.3-.9%200-1.2l7-7c.3-.3.9-.3%201.2%200s.3.9%200%201.2l-6.4%206.4%206.4%206.4c.3.3.3.9%200%201.2-.2.2-.4.3-.6.3z%22%20fill%3D%22%23828a99%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E") !important;
}
.ui_scroll_default_theme.ui_scroll_emoji_theme > .ui_scroll_overflow > .ui_scroll_shadow_bottom,
.ui_scroll_default_theme.ui_scroll_emoji_theme > .ui_scroll_overflow > .ui_scroll_shadow_top,
.emoji_tabs_l_sc,
.emoji_tabs_r_sc,
.emoji_cats_title_helper:after {
  background-image: none !important;
}
[dir] .TopHomeLink--logoWithText {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' height='25' width='136' style=''%3E%3Crect id='backgroundrect' width='100%25' height='100%25' x='0' y='0' fill='none' stroke='none'/%3E%3Cg class='currentLayer' style=''%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='M0 11.5c0-5.42 0-8.13 1.68-9.82C3.37 0 6.08 0 11.5 0h1c5.42 0 8.13 0 9.82 1.68C24 3.37 24 6.08 24 11.5v1c0 5.42 0 8.13-1.68 9.82C20.63 24 17.92 24 12.5 24h-1c-5.42 0-8.13 0-9.82-1.68C0 20.63 0 17.92 0 12.5z' fill='%232787f5' id='svg_1'/%3E%3Cpath d='M6.5 7.5H4.75c-.5 0-.6.24-.6.5 0 .46.6 2.76 2.76 5.8 1.45 2.07 3.49 3.2 5.34 3.2 1.11 0 1.25-.25 1.25-.68v-1.57c0-.5.1-.6.46-.6.26 0 .7.13 1.74 1.13 1.19 1.19 1.38 1.72 2.05 1.72h1.75c.5 0 .75-.25.6-.74-.15-.5-.72-1.2-1.47-2.05-.4-.49-1.02-1-1.2-1.26-.26-.34-.2-.49 0-.78 0 0 2.13-3 2.35-4.03.11-.37 0-.64-.53-.64H17.5a.76.76 0 00-.76.5s-.9 2.16-2.15 3.57c-.41.41-.6.54-.82.54-.1 0-.27-.13-.27-.5V8.14c0-.44-.13-.64-.5-.64h-2.75c-.28 0-.45.2-.45.4 0 .42.64.52.7 1.7v2.58c0 .57-.1.67-.32.67-.6 0-2.04-2.18-2.9-4.67-.16-.48-.33-.68-.78-.68z' fill='%23fff' id='svg_3' class=''/%3E%3Cpath d='M66.86 12.5c0 3.24-2.43 5.5-5.78 5.5s-5.78-2.26-5.78-5.5S57.73 7 61.08 7s5.78 2.26 5.78 5.5zm-8.97 0c0 1.97 1.3 3.3 3.19 3.3s3.19-1.33 3.19-3.3c0-1.98-1.3-3.25-3.19-3.25s-3.19 1.28-3.19 3.25zm-17.14-.21c.95-.44 1.56-1.18 1.56-2.33 0-1.73-1.58-2.96-3.87-2.96h-5.27v11h5.5c2.37 0 4.02-1.29 4.02-3.05 0-1.33-.87-2.32-1.94-2.66zM35.6 9.01h2.83c.85 0 1.44.5 1.44 1.2s-.6 1.2-1.44 1.2h-2.83zM38.67 16h-3.06V13.3h3.06c.96 0 1.59.55 1.59 1.36s-.63 1.33-1.59 1.33zM51.84 18h3.19l-5.06-5.71L54.61 7h-2.9l-3.68 4.27h-.6V7H45v11h2.44v-4.38h.59zM76.47 7v4.34h-4.93V7H69.1v11h2.43v-4.44h4.93V18h2.43V7zM86.9 18h-2.44V9.22h-3.8V7H90.7v2.22h-3.8zm9.5-11c-2.11 0-3.91.89-4.52 2.8l2.24.37c.34-.67 1.05-1.2 2.15-1.2 1.33 0 2.06.84 2.17 2.28h-2.32c-3.23 0-4.79 1.42-4.79 3.45 0 2.05 1.59 3.3 3.78 3.3 1.8 0 3-.72 3.53-1.63l.5 1.63h1.76v-6.18c0-3.19-1.74-4.82-4.5-4.82zm-.72 9c-1.19 0-1.9-.5-1.9-1.4 0-.85.57-1.44 2.43-1.44h2.35c0 1.8-1.19 2.84-2.88 2.84zm17.99 2h-3.2l-3.8-4.38h-.6V18h-2.43V7h2.43v4.27h.6L110.34 7h2.9l-4.63 5.29zm3.88 0h2.43V9.22h3.8V7h-10.04v2.22h3.8zM130.1 7c3.34 0 5.56 2.4 5.56 5.37 0 .3-.02.55-.04.79h-8.54c.23 1.69 1.36 2.69 3.17 2.69 1.29 0 2.15-.4 2.68-1.2l2.29.39c-.88 2.01-2.83 2.96-5.12 2.96a5.28 5.28 0 01-5.51-5.5c0-3.12 2.17-5.5 5.51-5.5zm2.92 4.25c-.4-1.37-1.4-2.15-2.92-2.15-1.48 0-2.47.74-2.87 2.15z' fill='%23ffffff' id='svg_4' class='' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E");
}
.media_selector .ms_item.ms_item_article:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24'%3E%3Crect id='backgroundrect' width='100%25' height='100%25' x='0' y='0' fill='none' stroke='none'/%3E%3Cg class='currentLayer' style=''%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m0 0h24v24h-24z' id='svg_2' class='' opacity='0'/%3E%3Cpath d='m8 6v7c0 .5522847-.44771525 1-1 1s-1-.4477153-1-1v-7h-2c-.55228475 0-1-.44771525-1-1 0-.55228475.44771525-1 1-1h6c.5522847 0 1 .44771525 1 1 0 .55228475-.4477153 1-1 1zm4 6h8c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-8c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1zm2-5h6c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-6c-.5522847 0-1-.44771525-1-1s.4477153-1 1-1zm-8 10h14c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-14c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1z' fill='%23b0ccda' id='svg_3' class='selected' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_status.audio_page_player_btn_enabled .btn_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' style=''%3E%3Crect id='backgroundrect' width='100%25' height='100%25' x='0' y='0' fill='none' stroke='none'/%3E%3Cg class='currentLayer' style=''%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill='%23e82f94' fill-rule='nonzero' d='M8.557 16.819a.9.9 0 1 0 1.084-1.438c-1.176-.886-1.841-2.099-1.841-3.38 0-1.283.665-2.496 1.841-3.382A.9.9 0 0 0 8.558 7.18C6.95 8.393 6 10.125 6 12.001c0 1.874.949 3.606 2.557 4.818zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3.443 2.819C17.05 15.607 18 13.875 18 12s-.95-3.607-2.559-4.819a.9.9 0 1 0-1.083 1.438c1.177.886 1.842 2.1 1.842 3.381 0 1.282-.665 2.495-1.84 3.381a.9.9 0 1 0 1.083 1.438zm4.183 1.87C21.137 16.943 22 14.554 22 12.009c0-2.53-.853-4.907-2.349-6.65l-.017-.021-.024-.028a.9.9 0 1 0-1.36 1.18l.022.025.013.015c1.211 1.413 1.915 3.373 1.915 5.48 0 2.117-.712 4.087-1.935 5.501a.9.9 0 0 0 1.361 1.178zm-15.252 0a.9.9 0 0 0 1.36-1.178C4.513 16.097 3.8 14.127 3.8 12.01c0-2.106.704-4.066 1.915-5.479l.013-.015.022-.025a.9.9 0 0 0-1.36-1.18l-.024.028-.017.02C2.853 7.102 2 9.478 2 12.01c0 2.545.863 4.934 2.374 6.68z' id='svg_1' class='selected' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_next .icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='10'%3E%3Crect id='backgroundrect' width='100%25' height='100%25' x='0' y='0' fill='none' stroke='none'/%3E%3Cg class='currentLayer' style=''%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill='%23e82f94' fill-rule='evenodd' d='M7 4.709V.596C7 .266 7.278 0 7.6 0h.8c.331 0 .6.267.6.596v8.808a.604.604 0 0 1-.6.596h-.8a.598.598 0 0 1-.6-.596V5.291a.653.653 0 0 1-.123.114L.81 9.803c-.447.324-.81.138-.81-.408V.604c0-.55.359-.735.81-.408l6.067 4.398A.65.65 0 0 1 7 4.71z' id='svg_1' class='selected' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_prev .icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='10'%3E%3Crect id='backgroundrect' width='100%25' height='100%25' x='0' y='0' fill='none' stroke='none'/%3E%3Cg class='currentLayer' style=''%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill='%23e82f94' fill-rule='evenodd' d='M2 4.709V.596A.604.604 0 0 0 1.4 0H.6C.27 0 0 .267 0 .596v8.808c0 .33.278.596.6.596h.8c.331 0 .6-.267.6-.596V5.291c.033.04.074.079.123.114L8.19 9.803c.447.324.81.138.81-.408V.604c0-.55-.359-.735-.81-.408L2.123 4.594A.65.65 0 0 0 2 4.71z' id='svg_1' class='' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page__shuffle_all .audio_page__shuffle_all_button:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24' style=''%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m16,7c-2.94,0 -4.4,2.3 -5.87,4.25c-1.3,1.7 -2.38,3.7 -4.13,3.75l-3,0l0,2l3,0c2.93,0 4.24,-2.6 5.7,-4.53c1.3,-1.74 2.46,-3.47 4.3,-3.47l1,0l0,-2l-1,0zm-6.06,1.84c-0.52,-0.46 -1.38,-1.1 -2.04,-1.38c-0.64,-0.3 -1.4,-0.46 -2.23,-0.46l-2.67,0l0,2l3,0c0.44,0 0.8,0.08 1.14,0.22c0.45,0.2 1.14,0.7 1.58,1.1l1.23,-1.48l-0.01,0zm6.06,6.16l1,0l0,2l-1,0c-1.77,0 -3.24,-1.08 -4.32,-2.15l1.23,-1.5c0.8,0.83 1.98,1.65 3.1,1.65l-0.01,0zm1,4l0,-6l4,3l-4,3zm0,-8l0,-6l4,3l-4,3z' fill='%23e82f94' fill-rule='evenodd' id='svg_1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_shuffle.audio_page_player_btn_enabled .btn_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m18,8.9l-3.5,0c-1.014,0 -1.896,0.9 -3.758,3.61c-2.263,3.29 -3.34,4.39 -5.242,4.39l-2.5,0a0.9,0.9 0 0 1 0,-1.8l2.5,0c1.014,0 1.896,-0.9 3.758,-3.61c2.263,-3.29 3.34,-4.39 5.242,-4.39l3.5,0l0,-1.589a0.502,0.502 0 0 1 0.824,-0.386l2.996,2.491a0.503,0.503 0 0 1 0,0.773l-2.996,2.492a0.503,0.503 0 0 1 -0.824,-0.387l0,-1.594zm-5.966,4.377c1.046,1.336 1.72,1.823 2.466,1.823l3.5,0l0,-1.589a0.502,0.502 0 0 1 0.824,-0.386l2.996,2.491a0.503,0.503 0 0 1 0,0.773l-2.996,2.492a0.503,0.503 0 0 1 -0.824,-0.387l0,-1.594l-3.5,0c-1.36,0 -2.299,-0.562 -3.55,-2.086a58.818,58.818 0 0 0 1.084,-1.537zm-2.984,-4.091a58.818,58.818 0 0 0 -1.084,1.537c-1.046,-1.336 -1.72,-1.823 -2.466,-1.823l-2.5,0a0.9,0.9 0 1 1 0,-1.8l2.5,0c1.36,0 2.299,0.562 3.55,2.086z' fill='%23e82f94' id='svg_1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_numeric .audio_row .audio_row__cover_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m8.3,17.65c-0.4,0.3 -0.8,0.1 -0.8,-0.5l0,-10.8c0,-0.6 0.4,-0.8 0.8,-0.4l8,5.4c0.3,0.2 0.3,0.6 0,0.8l-8,5.5z' fill='%23e82f94' id='svg_3'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_pl_snippet2 .audio_shuffle_all_button:before,
.ActionButton--shuffle:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m16.25,6.5c-2.94,0 -4.4,2.3 -5.87,4.25c-1.3,1.7 -2.38,3.7 -4.13,3.75l-3,0l0,2l3,0c2.93,0 4.24,-2.6 5.7,-4.53c1.3,-1.74 2.46,-3.47 4.3,-3.47l1,0l0,-2l-1,0zm-6.06,1.84c-0.52,-0.46 -1.38,-1.1 -2.04,-1.38c-0.64,-0.3 -1.4,-0.46 -2.23,-0.46l-2.67,0l0,2l3,0c0.44,0 0.8,0.08 1.14,0.22c0.45,0.2 1.14,0.7 1.58,1.1l1.23,-1.48l-0.01,0zm6.06,6.16l1,0l0,2l-1,0c-1.77,0 -3.24,-1.08 -4.32,-2.15l1.23,-1.5c0.8,0.83 1.98,1.65 3.1,1.65l-0.01,0zm1,4l0,-6l4,3l-4,3zm0,-8l0,-6l4,3l-4,3z' fill='%23e82f94' fill-rule='evenodd' id='svg_1'/%3E%3C/g%3E%3C/svg%3E") !important;
}
[dir] .audio_row .audio_row__play_btn,
[dir] .audio_pl_snippet2 .audio_pl_snippet__action_btn_listen:hover:before,
[dir] .audio_pl_snippet2 .audio_pl_snippet__action_btn_listen:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Ccircle cx='12' cy='12' fill='%23e82f94' id='svg_2' r='12'/%3E%3Cpath d='m9.846,16.86c-0.467,0.303 -0.846,0.097 -0.846,-0.45l0,-8.822c0,-0.551 0.38,-0.752 0.846,-0.45l6.91,4.48c0.324,0.21 0.327,0.549 0,0.761l-6.91,4.48l0,0.001z' fill='%23FFF' id='svg_3'/%3E%3C/g%3E%3C/svg%3E") !important;
}
[dir] .audio_row.audio_row__playing .audio_row__play_btn {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cg id='svg_4'%3E%3Ccircle cx='12' cy='12' fill='%23e82f94' fill-opacity='0.91' id='svg_2' r='12'/%3E%3Cpath d='m8,7.596c0,-0.33 0.277,-0.596 0.607,-0.596l1.786,0c0.335,0 0.607,0.267 0.607,0.596l0,8.808a0.605,0.605 0 0 1 -0.607,0.596l-1.786,0a0.602,0.602 0 0 1 -0.607,-0.596l0,-8.808zm5,0c0,-0.33 0.277,-0.596 0.607,-0.596l1.786,0c0.335,0 0.607,0.267 0.607,0.596l0,8.808a0.605,0.605 0 0 1 -0.607,0.596l-1.786,0a0.602,0.602 0 0 1 -0.607,-0.596l0,-8.808z' fill='%23fff' id='svg_3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_repeat.audio_page_player_btn_enabled .btn_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Слой_1' x='0px' y='0px' viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23E82F94;%7D .st1%7Bfill:none;stroke:%23E82F94;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;%7D%0A%3C/style%3E%3Cpath class='st0' d='M15.8,4.1l3,2.5C19,6.8,19,7.1,18.9,7.3c0,0,0,0-0.1,0.1l-3,2.5c-0.2,0.2-0.5,0.1-0.7-0.1C15,9.7,15,9.6,15,9.5 v-5C15,4.2,15.2,4,15.5,4C15.6,4,15.7,4,15.8,4.1z M8.2,14.1l-3,2.5C5,16.8,5,17.1,5.1,17.3c0,0,0,0,0.1,0.1l3,2.5 c0.2,0.2,0.5,0.1,0.7-0.1C9,19.7,9,19.6,9,19.5v-5C9,14.2,8.8,14,8.5,14C8.4,14,8.3,14,8.2,14.1z'/%3E%3Cpath class='st1' d='M4,11c0-2.5,1.5-4,4-4h7.5 M21,13c0,2.5-1.5,4-4,4H8.5'/%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_add .btn_icon,
.audio_page_player2 .audio_player_btn_added .btn_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' width='16' height='37'%3E%3Cg class='layer'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath d='m7,29l-5,0c-0.552,0 -1,0.448 -1,1s0.448,1 1,1l5,0l0,5c0,0.552 0.448,1 1,1s1,-0.448 1,-1l0,-5l5,0c0.552,0 1,-0.448 1,-1s-0.448,-1 -1,-1l-5,0l0,-5c0,-0.552 -0.448,-1 -1,-1s-1,0.448 -1,1l0,5z' fill='%23828A99' fill-rule='nonzero' id='svg_3'/%3E%3Cpath d='m1,7l4,4l10,-10' fill='%23000000' fill-opacity='0' id='svg_6' stroke='%23e82f94' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E") !important;
}
.audio_page_player2 .audio_page_player_repeat.audio_page_player_btn_repeat_one .btn_icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Слой_1' x='0px' y='0px' viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;%7D .st1%7Bfill:%23E82F94;%7D .st2%7Bfill:none;stroke:%23E82F94;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;%7D%0A%3C/style%3E%3Cpath class='st0' d='M0,0h24v24H0V0z'/%3E%3Cpath class='st1' d='M15.8,4.1l3,2.5C19,6.8,19,7.1,18.9,7.3c0,0,0,0-0.1,0.1l-3,2.5c-0.2,0.2-0.5,0.1-0.7-0.1C15,9.7,15,9.6,15,9.5 v-5C15,4.2,15.2,4,15.5,4C15.6,4,15.7,4,15.8,4.1z M8.2,14.1l-3,2.5C5,16.8,5,17.1,5.1,17.3c0,0,0,0,0.1,0.1l3,2.5 c0.2,0.2,0.5,0.1,0.7-0.1C9,19.7,9,19.6,9,19.5v-5C9,14.2,8.8,14,8.5,14C8.4,14,8.3,14,8.2,14.1z'/%3E%3Cpath class='st2' d='M4,11c0-2.5,1.5-4,4-4h7.5'/%3E%3Cpath class='st2' d='M21,13c0,2.5-1.5,4-4,4H8.5'/%3E%3Cpath class='st1' d='M13,9h-1l-2,1v1h1.5v4H12h1V9z'/%3E%3C/svg%3E") !important;
}
.checkbox.on:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Слой_1' x='0px' y='0px' viewBox='0 0 15 15' style='enable-background:new 0 0 15 15;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FF2B98;%7D .st1%7Bfill:none;stroke:%23FFFFFF;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;%7D%0A%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M3,0h9c1.7,0,3,1.3,3,3v9c0,1.7-1.3,3-3,3H3c-1.7,0-3-1.3-3-3V3C0,1.3,1.3,0,3,0z'/%3E%3Cpath class='st1' d='M4,7.5L6.5,10L11,4.5'/%3E%3C/g%3E%3C/svg%3E") !important;
}
#page_header_cont .back,
.fc_tab_head,
.box_title_wrap,
.im-page_classic.im-page .im-page--header,
.im-page_classic .im-page--chat-header,
.im-page_classic.im-page .im-page--chat-body-wrap-inner,
.Input[readonly],
.post_suggest,
.search_row,
.search_sep,
.gift_tt_show_all,
.MassMentionWarning,
[dir] .ModalHeader--blue,
[dir] .ModalFooter {
  border-color: #1a1a1a !important;
}
.audio_page_player.audio_page_player_fixed,
.audio_page_layout .audio_friends_list,
.audio_layer_container .audio_page_player,
.im-page .im-page--history-new-bar,
.box_body,
.fc_msgs_unread,
.pv_cont .narrow_column,
.box_body .im_stickers_store_wrap .ui_tabs,
.ap_layer .audio_pl_snippet .audio_pl_snippet__header_inner,
.audio_pl_snippet .audio_pl_snippet__header,
.photos_container .photos_row,
.box_controls,
.ts_cont_wrap,
.feedback_row_wrap.unread:not(.feedback_row_touched),
.pv_white_bg,
.pva_period_fixed,
.wk_history_tabs,
.ChatSettings__content,
.ChatSettingsInfo,
.List,
.ChatSettingsMembersWidget,
.Button--mobile,
.ChatSettingsInvitationLink,
.ChatSettingsResetInvitationLink__text,
.SubmitArea,
.audio_pl_snippet2 .audio_shuffle_all_button:hover,
.online:after,
.online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--photo .online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--photo .online.mobile:after,
.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--photo .online.mobile:after,
.ActionsMenu__inner,
.ui_actions_menu,
.privacy_dropdown .header,
.privacy_dropdown,
.apps_footer,
#top_notify_wrap,
.bd_day_cell.holiday,
.bd_day_head,
.top_notify_count,
.top_nav_btn:hover .top_notify_count,
.settings_blb_row {
  border-color: #3b3f41 !important;
}
.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_classic.nim-dialog_unread,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_hovered,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog:hover,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered + .im-search-results-head,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered + .nim-dialog,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected + .im-search-results-head,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected + .nim-dialog,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic + .im-search-results-head,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic + .nim-dialog,
.nim-dialog:not(.nim-dialog_deleted):hover + .im-search-results-head,
.nim-dialog:not(.nim-dialog_deleted):hover + .nim-dialog,
.nim-dialog .nim-dialog--content,
#side_bar .more_div,
.post_full_like_wrap,
#ads_left.ads_left_empty + .left_menu_nav_wrap,
.counts_module,
.wide_column .page_top,
.module,
.wall_module .reply ~ .reply .dld,
.wall_module .reply ~ .reply .reply_wrap,
.im-page .im-page--dialogs-footer,
.ui_tabs,
.pv_author_block,
.pv_comments,
.feed_new_posts,
.group_l_row,
.group_l_row:last-child,
.group_edit_row_sep,
.media_preview_has_medias,
.like_cont,
.page_status_editor .editor,
div.page_status_input,
.top_notify_header,
.friends_list_bl,
.article_ed_layer .article_ed_layer__publish_settings .article_ed_layer__publish_settings_header,
.settings_line,
.settings_privacy_row,
.settings_bl_row,
.settings_apps .apps_settings_row_wrap,
.settings_block_msg,
.settings_table_row,
.audio_pl_edit_box .ape_add_audios_btn,
.audio_pl_edit_box .ape_add_pl_audios_btn,
.audio_pl_edit_box .ape_header,
.fakeinput:focus,
div[contenteditable=true]:focus,
input.big_text:focus,
input.dark:focus,
input.search:focus,
input.text:focus,
textarea:focus,
.box_title_wrap.box_grey,
.docs_choose_rows .docs_item,
.audio_layer_container .audio_page__footer,
.eltt,
input.dark,
.pedit_separator,
.olist_botsh .box_controls,
.info_msg,
.feed_row ~ .feed_row .feedback_row,
.feed_row ~ .feed_row .feedback_sticky_row,
.feed_row ~ .feed_row_fb_hidden .feed_row:first-child .feedback_row,
.feedback_sticky_rows:not(:empty) + .feed_row .feedback_row,
.feedback_sticky_rows:not(:empty) + .feed_row .feedback_sticky_row,
.ts_search_sep,
.im-page-pinned,
.top_notify_cont .top_notify_header,
.tickets_post_field,
.tu_row,
.help_table_question,
.help_tile_alert,
.settings_history_table tr td,
.media_selector .ms_item.ms_item_article,
.audio_pl_snippet2 .audio_pl_snippet__header,
.owner_photo_additional,
.profile_info_block,
#submit_post_box:not(.shown):not(.own_field) .poster__open-btn-wrapper,
.poster__toolbar,
.apps_i_panel,
.apps_i_policy,
.article_layer .article_layer__content_footer,
.photos_edit_selection_header,
.page_actions_wrap,
.page_actions_inner,
.tickets_header,
.tickets_reply_row,
.tickets_post_form__panel,
.top_profile_sep,
#top_profile_menu,
#stats_cont h4,
.stats_head,
.piechart_table tr td,
.stats_time_info,
.feed_updates .wall_module .feed_row .post,
.photos_choose_bottom,
.deep_active.wl_post .replies .wl_replies_empty,
.deep_active.wl_post.wall_module .replies .wl_replies_empty,
.deep_active.wl_post.wall_module .wl_replies_block_wrap .wl_replies_empty,
.deep_active.wl_post .wl_replies_block_wrap .wl_replies_empty,
.deep_active .replies .reply_fakebox,
.deep_active.wall_module .replies .reply_fakebox,
.deep_active.wall_module .wl_replies_block_wrap .reply_fakebox,
.deep_active .wl_replies_block_wrap .reply_fakebox,
.deep_active .replies .replies_wrap_deep,
.deep_active.wall_module .replies .replies_wrap_deep,
.deep_active.wall_module .wl_replies_block_wrap .replies_wrap_deep,
.deep_active .wl_replies_block_wrap .replies_wrap_deep,
.im-page .im-page--mess-search,
.mv_actions_block,
.wall_module .reply_box,
.wall_module .reply_fakebox_wrap,
.mv_info_narrow_column,
.gifts_section_row,
.gifts_constr_steps_wrap,
.box_msg,
.box_msg_gray,
.disabled.selector_container table.selector_table,
.selector_container table.selector_table,
.result_list,
.poster__open-btn-wrapper,
.sticker_hints_tt,
.tt_default,
.tt_default_right,
.im-page--toolsw,
.im-page--chat-header-in,
.ms_items_more,
.Dropdown__in,
.audio_subscribe_promo,
.emoji_tt_wrap,
.video_choosebox_bottom,
.audio_feed_post,
.im-to-end:focus .im-to-end__button,
.im-to-end:hover .im-to-end__button,
.im-to-end__button,
.ChatSettingsMembersWidget__add:before,
.im_stickers_my_row ~ .im_stickers_my_row,
.ui_search_fltr,
.friends_cur_filters,
.idd_popup,
.audio_pl_edit_box .ape_cover,
.audio_pl_edit_box .ape_pl_item:hover,
.audio_pl_edit_box .ape_pl_item .ape_pl_item_inner,
.post_publish,
.page_actions_separator,
.market_item_footer_wrap,
.market_item_footer_info,
.market_comments_summary,
.app_widget_list_row,
.bookmark_footer,
.wke_controls,
.pages_header_info,
.pages_history_header_wrap,
#mv_pl_tt .mv_tt_add_playlist,
.TopMenu_block_1KqlS,
.Panel_block_2RPF-,
.MainStatus_button_1p4_4,
.Panel_footer_epjyB,
.Panel_header_2eRoj,
.CardListItem_card_1rJmF,
.NumbersInput_item_2-aQb,
.ListItem_block_27maC,
.Mailings_desktop .GroupPage__footer,
#apps_layer .apps_header_wrapper,
.post_actions_btns,
.wddi,
.wddi_over,
.wdd_list,
div.fc_clist_filter_wrap,
.flat_button.ui_load_more_btn,
.settings_block_footer,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic,
.nim-dialog:not(.nim-dialog_deleted):hover,
.im_msg_audiomsg .audio-msg-track:not(.audio-msg-player):hover,
.flat_button.ui_load_more_btn:hover,
.im-mess.im-mess_search:hover,
.olist_item_wrap:hover,
.feedback_row_clickable:not(.feedback_row_touched):hover,
.feed_row ~ .feed_row .feedback_row_clickable:not(.feedback_row_touched):hover,
.top_notify_show_all:hover,
#side_bar ol li .left_row:hover,
.fakeinput,
div[contenteditable=true],
input.big_text,
input.search,
input.text,
textarea,
.page_media_poll_wrap,
.ui_tabs.ui_tabs_box,
.im-mess .im-mess--post,
.feedback_row_answer,
.payments_money_transfer_amount_wrap,
.top_notify_show_all,
.im-mess.im-mess_light,
.audio_page_layout .audio_page_separator,
.audio_page_layout .has_friends_block .audio_page__rows_wrap,
input.BlockSearchInput,
#mail_box_editable,
.audio_pl_edit_box .ape_add_audios_btn:hover,
.audio_pl_edit_box .ape_add_pl_audios_btn:hover,
.docs_choose_rows .docs_item:hover,
.docs_choose_upload_area,
.docs_choose_upload_area:hover,
.button_gray button.hover,
.button_gray button:hover,
.flat_button.secondary.hover,
.flat_button.secondary:hover,
.pv_cont .pv_can_edit:hover,
em.ts_clist_hl,
.audio_w_covers .audio_row.ui_gridsorter_moveable .audio_row_content,
.bd_day_cell,
.bd_day_cell.left,
.bd_day_cell.today,
.msg,
.ListItem--active,
.ListItem--can-be-hovered.ListItem--selectable:hover,
.Tabs,
.ui_search_sugg_list,
.im-page .im-page--history-new-bar:after,
.im-page .im-page--history-new-bar:before,
.ListItem--border:before,
.replies_open,
.wr_header,
.wall_module .page_media_thumbed_link,
.button_gray button,
.flat_button.secondary,
.im_stickers_bl_wrap,
.ap_layer_wrap .ap_layer__content,
div.wdd,
div.wdd.wdd_focused,
.ui_search_new .ui_search_input_inner,
.ui_search_new.ui_search_dark .ui_search_input_inner,
.payments_money_transfer_comment,
.payments_money_transfer_amount,
.im_stickers_buy_header,
.im-page .im-page--top-date-bar,
.im-page_classic.im-page .im-page--dcontent,
.ui_grey_block,
.submit_post,
.im_stickers_store_wrap .ui_tabs,
.page_block_header,
.audio_page_player2.audio_page_player_fixed,
.audio_pl_snippet,
.ui_search,
#mv_publish,
.help_table_questions,
.docs_item,
.tickets_thank_you_form,
.CatalogSection__leftColumn,
.Select--opened .Select__control,
.Select__menu,
.im-navigation__button,
.wpost_post,
.poster__btns-wrapper,
.poster__toolbar-wrapper,
.AuthorPageHeader__create,
.article_layer .article_layer__content:before,
.audio_pl_attach_preview,
.bp_post,
.docs_choose_dropbox_wrap,
[dir] .ui_search_new .ui_search_button_search,
[dir] #payments_box .payments_about_votes,
[dir] .payments_about_votes,
[dir] .CallSnippet,
[dir] .InputStub,
[dir] .MarketCatalogHeader--fixed,
.FCWindow,
[dir] .Input {
  border-color: #242424 !important;
}
.tt_default.tt_down:after,
.tt_default.tt_down:before,
.im-chat-input,
.ms_items_more_wrap.to_up .ms_items_more:before,
.ms_items_more_wrap.to_up .ms_items_more:after,
div.fc_tab_txt,
.feedback_row_wrap,
.feedback_row,
.feedback_sticky_row,
.deep_active .post_replies_header,
.deep_active.wall_module .post_replies_header,
.mention_tt_actions,
.emoji_tt_wrap.tt_down:before,
.emoji_tt_wrap.tt_down:after,
.ui_actions_menu_top .ui_actions_menu:after,
.eltt.eltt_top.eltt_arrow_size_normal > .eltt_arrow_back,
.eltt.eltt_top.eltt_arrow_size_normal > .eltt_arrow_back .eltt_arrow,
.friends_user_row,
.post_full_like_wrap,
.wl_replies_header,
.wall_module.wl_post .reply .reply_wrap,
.wall_module .wl_reply_form_fixed .reply_box,
.wall_module .wl_reply_form_fixed .reply_fakebox_wrap,
.wall_module .replies_list,
.Modal__footer,
.PhotoEditor__actions,
.PageFooterWrap,
.wide_column .topics_module .topic_row,
[dir] .page_block #all_shown,
[dir] .notifications_new_events,
.bt_comment_form_actions,
.bt_report_one_author,
.bt_report_footer,
.bt_report_one_info,
[dir] .feed_groups_recomm__all,
.FCWindow__footer,
[dir] .SideOfficeMenu__toggleButton {
  border-top-color: #242424 !important;
}
.wall_module .published_by_quote,
.wall_module .published_sec_quote,
.im_fwd_log_wrap,
.im_wall_log_wrap,
.copy_quote {
  border-left-color: #242424 !important;
}
.border_1_right,
.tt_default.tt_left:after,
.tt_default.tt_left:before,
[dir=ltr] .SideOfficeMenu {
  border-right-color: #242424 !important;
}
.im-chat-input,
.ui_actions_menu:before,
.ui_actions_menu:after,
.tt_default.tt_up:before,
.notify_sources.tt_up:after,
.notify_sources.tt_up:before,
.Dropdown--b .Dropdown__in:after,
.Dropdown--b .Dropdown__in:before,
.eltt.eltt_bottom.eltt_arrow_size_normal > .eltt_arrow_back,
.eltt.eltt_bottom.eltt_arrow_size_normal > .eltt_arrow_back .eltt_arrow,
.border_1_right,
.ui_search_fltr:before,
.ui_search_fltr:after,
.ms_items_more_wrap.to_down .ms_items_more:before,
.ms_items_more_wrap.to_down .ms_items_more:after,
.emoji_tt_wrap.tt_up:before,
.emoji_tt_wrap.tt_up:after,
.tt_default.tt_up:after,
.im-page--dialogs-search .ui_search_input_block,
.olist_item_wrap,
.group_list_row,
.feedback_row_answer:after,
.feedback_row_answer:before,
#top_profile_menu:before,
#top_profile_menu:after,
.gifts_box_rows .post,
#top_notify_wrap:after,
#top_notify_wrap:before,
.post_suggest:after,
.post_suggest:before,
.Modal__header--blue,
.MultiSelect__search,
.fc_tab_notify,
.bt_header,
#apps_user_warning_cont,
.apps_options_bar,
.EditorTabs__header,
body.scrolled .PageNavigation_wrap,
.pay-card-layout_type_vk .secure-information,
[dir] .page_block_header,
[dir] .DownloadedGameItem,
.addresses_header,
.bt_report_one_author,
[dir] #page_header_cont,
[dir] .deep_active .replies .replies_wrap_deep .reply_media_preview,
[dir] .deep_active .wl_replies_block_wrap .replies_wrap_deep .reply_media_preview,
[dir] .deep_active.wall_module .replies .replies_wrap_deep .reply_media_preview,
[dir] .deep_active.wall_module .wl_replies_block_wrap .replies_wrap_deep .reply_media_preview,
.FCWindow__header,
[dir] .Breadcrumbs__list {
  border-bottom-color: #242424 !important;
}
.ui_actions_menu_sep,
.emoji_tt_wrap.emoji_shop_over.tt_down:after,
.ui_actions_menu_top .ui_actions_menu:before,
.ui_rmenu_sep {
  border-top-color: #3b3f41 !important;
}
.ActionsMenu__inner:before,
.ActionsMenu__inner:after {
  border-bottom-color: #3b3f41 !important;
}
.fc_tab_pointer:before,
.fc_tab_pointer:after {
  border-left-color: #3b3f41 !important;
}
.anyClassName {
  border-right-color: #3b3f41 !important;
}
.story_feed_new_item.stories_feed_preview_item .stories_feed_preview_author .stories_feed_preview_authors_wrapper:after {
  border-color: #b0ccda !important;
}
#fc_ctabs_cont,
.fc_tab,
.Card,
.sticker_hints_arrow,
.im-page-pinned,
.footer_wrap,
.im-chat-input .im-chat-input--txt-wrap,
.module,
.wall_module .reply_fakebox,
.tabbed_box .summary_tabs,
#mv_pl_tt .mv_tt_private_only + .mv_tt_playlists,
.im-page--dialogs-search,
.im-page_classic.im-page .im-page--chat-input,
.ui_search_new.ui_search_btn_large .ui_search_button_search,
._audio_page_player_wrap.audio_page_player_wrap.page_block,
.ui_search_new.ui_search_field_empty .ui_search_button_search,
.photos_container_edit_grid .photos_photo_edit_row_desc_placeholder,
[dir] .pretty-card__content,
[dir] .im_stickers_my_row.sort_taken,
[dir] .im_stickers_my_row.sort_taken:last-child,
[dir] .prefix_input_border,
[dir] .datepicker_control,
.settings_alert .footer,
[dir] .BudgetBalance,
[dir] .BudgetStats {
  border: none !important;
}
._audio_page_content_block .ui_tab_sel,
._audio_page_content_block .ui_tab_sel:hover,
._audio_page_content_block .ui_tabs .ui_tab_sel,
._audio_page_content_block .ui_tabs .ui_tab_sel:hover,
._audio_page_content_block .ui_tabs_box .ui_tab_sel,
._audio_page_content_block .ui_tabs_box .ui_tab_sel:hover {
  border-color: #e82f94 !important;
}
.fc_msgs {
  border-color: #2d2f30 !important;
}
.bt_report_row,
.group_tokens_row:last-child,
.groups_api_divider,
.groups_edit_event_log_controls {
  border-bottom: 1px solid #3b3f41 !important;
}
.group_apps_edit,
.group_page_block_footer {
  border-top: 1px solid #3b3f41 !important;
}
.bt_tag_label,
.page_load_photo,
.post_top_info_caption {
  color: #828282 !important;
}
body,
h2,
.ui_search_field,
.module_header .header_top,
.ui_tab_sel,
.ui_tabs .ui_tab_sel,
.ui_tabs_box .ui_tab_sel,
.nim-dialog .nim-dialog--preview,
.nim-dialog .nim-dialog--text-preview,
.im-mess-stack .im-mess-stack--content .im-mess-stack--pname > a,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--preview,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--text-preview,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--preview,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--text-preview,
.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--preview,
.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--text-preview,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--preview > b,
.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--preview > b,
.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--preview > b,
.im-page .im-search-results-head,
.audio_page__shuffle_all .audio_page__shuffle_all_button,
.subheader,
h4.subheader,
.right_list_header,
a.wall_reply_greeting,
.im-fwd.im-fwd_msg .im-fwd--messages,
.mv_title,
.mv_recom_block_title,
.page_block_header,
.tabbed_box .summary_tab_sel .summary_tab3,
.box_title_wrap.box_grey .box_title,
.feedback_header,
.feedback_header b,
#payments_box,
ul.listing li span,
.audio_row .audio_row__lyrics .audio_row__lyrics_inner,
.top_notify_cont .feedback_header,
.feedback_content .feedback_text .wall_post_text,
.feedback_content .feedback_text .wall_reply_text,
.top_notify_header,
.friends_field,
.right_list_field,
.ui_tab,
.ui_tabs .ui_tab,
.audio_page_player .audio_page_player_title_performer,
.im_stickerpack_name,
.bd_header_info,
.bd_header_month,
.selector_container td.selector input.focused,
.selector_container td.selector input.selected,
.selector_input.selected,
.profile_warning_label,
.first > #stats_cont h4,
.first > .stats_head,
.tu_row_comment,
.tickets_reply_text,
.tickets_header,
.help_tile__title_a,
.settings_votes_income .settings_history_amount,
.audio_page_player2 .audio_page_player_title_song,
.im-replied--text,
.ChatSettingsInfo__title,
.wall_module.wl_post .page_media_caption,
.wall_module.wl_post .wall_post_text,
.wl_replies_header,
#payments_money_transfer_summary,
.audio_pl_snippet2 .audio_shuffle_all_button,
.owner_photo_additional,
.apps_access_item_info b,
.apps_options_bar .apps_options_bar_left .app_summary_name,
.flat_button,
.article,
.photos_edit_selection_header,
.help_table_questions__title,
.page_actions_item,
.page_actions_dd_label,
.page_actions_header_inner,
.top_profile_mrow,
#stats_cont h4,
.stats_head,
.graph_menu_item.graph_menu_item_sel,
.graph_menu_item.graph_menu_item_sel:hover,
.feed_updates .explain,
.feed_update_row .post_author,
.ui_gallery_wall_cards .wall_card__title_link,
.im-page .im-page--mess-search,
.result_list ul li.active,
.result_list ul li,
.summary_tab3,
input.dark,
.pedit_label,
.pedit_label_box,
.selector_container td.selector .token_inner,
.selector_container td.selector .token_prefix,
#pedit_result .msg_text,
.pedit_row_notice,
.AudioPlaylistSnippet .ActionButton--shuffle__text,
.ActionsMenu__item,
.ui_actions_menu_item,
.notify_sources_tt_content .line_cell .info,
.notify_sources_tt_content .line_cell,
.privacy_dropdown .item_sel,
.privacy_dropdown .item_sel_plus,
.privacy_dropdown .item,
.privacy_dropdown .header,
.privacy_dropdown .l_header .l_header_label,
.privacy_dropdown .l_item,
.privacy_dropdown .l_item_sel,
.page_media_event .page_media_event_name,
.Dropdown__in,
.audio_subscribe_promo__title,
.audio_subscribe_promo__text,
.page_name,
h1.page_name,
.top_notify_cont,
.audio_pl_snippet2 .audio_pl_snippet__description,
.audio_page_layout .audio_recoms_blocks .recoms_special_block_title,
.audio_page_layout .audio_section__recoms .recoms_special_block_title,
._audio_pl.audio_pl_top_audios .audio_row .audio_row__inner:before,
.Tabs__item--active > *,
.im_sticker_bl_name,
.im_stickers_my_tip,
.im_stickers_my_name,
.reply_submit_hint_opts .radiobtn,
.ui_search_fltr_label,
.ui_search_fltr,
.friends_cur_filters .token,
.ui_search_fltr b,
.idd_popup .idd_item,
.idd_popup .idd_header,
.idd_wrap .idd_selected_value,
.audio_pl_edit_box .ape_cover_title,
.gtop_complex_message .gtop_content .gtop_header,
.gtop_complex_message .gtop_content .gtop_message,
#apps_layer .apps_header .apps_name,
#group_section_menu .module_body .ui_gallery .ui_gallery_item .groups_menu_item .groups_menu_item_title,
#groups_menu_promo .apps_group_catalog_promo_header,
.app_widget_list_row,
.market_item_title,
.market_item_price,
.market_comments_summary,
.page_block_sub_header,
.microdata_price,
#mv_pl_tt .mv_tt_playlist,
.MainActions_itemText_1gXiE,
.MainServices_text_2jbbb,
.MainPromos_item_3RzR1,
.MainHead_block_2hP2d .MainHead_balanceTitle_dHcnD,
.MainServices_icon_black_1bdck,
.MainStatus_button_1p4_4,
.HistoryListItem_amount_rPK5B,
.Mailings_desktop .GroupPage__description,
.Button--secondary__29JKy,
.Card h1,
.Card__header,
.Input__label,
.im-aside-notice-promo.group-messages-notify-block .im-aside-notice--title,
.media_voting_question,
.media_voting_option_text,
.mott_text,
.verified_tt_text,
.tt_w .tt_text,
.ui_search_sugg_list,
.im-page .im-page--history-new-bar:after,
.im-page .im-page--history-new-bar:before,
.ListItem--border:before,
.replies_open,
.wr_header,
.wall_module .page_media_thumbed_link,
.button_gray button,
.flat_button.secondary,
.im_stickers_bl_wrap,
.ap_layer_wrap .ap_layer__content,
div.wdd,
div.wdd.wdd_focused,
.ui_search_new .ui_search_input_inner,
.ui_search_new.ui_search_dark .ui_search_input_inner,
.payments_money_transfer_comment,
.payments_money_transfer_amount,
.im_stickers_buy_header,
.im-page .im-page--top-date-bar,
.article > h1,
.wdd_text,
.profile_info_header,
.im-page .im-page--history-new-bar > span,
.photos_period_delimiter_fixed,
.tabbed_box .summary_tab_sel .summary_tab2,
.audio_pl_edit_box .ape_header,
.group_l_row,
.page_block,
.mv_info,
.fakeinput,
div[contenteditable=true],
input.big_text,
input.search,
input.text,
textarea,
.page_media_poll_wrap,
.ui_tabs.ui_tabs_box,
.profile_info_edit,
.box_title_wrap.box_grey,
.eltt,
input.text.ts_input:focus,
.im-page--back-btn:hover,
#mail_box_editable,
.audio_pl_snippet .audio_pl_snippet__info_title,
.im-page--title-main-inner,
.nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,
.nim-dialog.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,
.mention_tt_row,
.msg_text,
.audio_pl_edit_box .ape_add_pl_audios_btn,
.tt_default,
.tt_default_right,
.Input[readonly],
.PlaceholderSmall__title,
.PlaceholderSmall__text,
.Button--tertiary:not(.Button--disabled):focus,
.Button--tertiary:not(.Button--disabled):hover,
.im-chat-input--editing-head,
.feed_blog_reminder_large .feed_blog_reminder_text,
.im-page-pinned--media,
.top_profile_name,
.ts_wrap .input_back_content,
.events_card__title,
.groups_nearest_event__title,
.search_filter_main,
.search_filter_open,
.search_filter_shut,
.photos_container_edit_grid .photos_photo_edit_row_desc_placeholder,
.photos_album_intro h1,
.author_page_article_title,
.gift_tt_header,
.medadd_c_linkhead:not(.medadd_inline_editing) .medadd_inline_edit_target,
.AudioPlaylistSnippet h1.AudioPlaylistSnippet__title--main,
.verification_box .verification_title,
.audio_pl_edit_box .ape_add_audios_btn,
.audio_row .audio_row__position,
.mail_box_group_first_message,
.PeerProfile__content,
.app_widget_donation_data,
.medadd_h,
.audio_pl_attach_preview .audio_pl_attach_preview__title,
.eltt .eltt_fancy_action,
.TokenInput__input,
.fc_msg.wrapped,
.JobsPageHeader__subtitle,
.JobThumb__title,
.JobThumb__description,
.MassMentionWarning__title,
.payments_summary_header,
.secure-information__column_position_left,
.pay-card-layout__notification_type_vk .info-block_type_notification .info-block__column_type_right,
.pay-card-layout_type_vk .credit-card-form__label-group_type_add-card .credit-card-form__label,
.pay-card-layout_type_vk .credit-card-form__label-group_type_card-number .credit-card-form__input,
.pay-card-layout__notification_type_vk .info-block_type_sum .info-block__column_type_right,
.pay-card-layout__notification_type_vk .info-block_type_title .title,
.post_author_data_title,
.im-page--chat-input ._im_chat_input_w,
.im-audio-message_recording,
.verification_set_item_title,
.bt_product_row_subtitle,
.apps_group_catalog_promo_header,
.group_edit_label,
.wall_reasons_list,
.Input,
.Input--left,
.BlockSearchInput,
.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app .apps_feedRightAppsBlock__desc,
.group_send_msg_status_block_status:hover,
.settings_labeled_notice,
.box_title_wrap.box_white .box_title,
.BannerItem__title,
[dir] .DownloadedGameItem__header,
.DownloadedGameItem__description,
.address_time_status_cur_time,
.validation_device_info_name,
.post_upload_dropbox,
.post_upload_dropbox_inner,
.article_snippet_mini_title,
.BugtrackerDevice__nameIn,
.group_l_position,
.ShortVideoStub__text,
.ShortVideoStub__title,
.box_msg,
.dev_page_block,
.wk_header,
.dev_methods_list_desc,
[dir] .TopSearch__input,
#side_bar .left_label,
.links-list__title,
.ListHeader__text,
.CallBanner__title,
.CallSnippet__title,
.ChatSettingsPresetPanel,
.ui_rmenu_subitem,
.ui_rmenu_unread > span,
.post_top_info_caption,
.audio_restriction_box__title,
.StickerPackPreview__title,
.StickerStylesMenuItem__title,
h1,
.im-chat-input .im-chat-input--text > span,
[dir] .PostShowMore__text,
.MarketCatalogLocationTooltip__title,
.Button--link,
.MarketCatalogProduct__price,
.market_item_owner_name--no-href,
.FlatButton--tertiary,
.box_title,
[dir] .ReportForm__categorySelectionHeader:not(:first-child),
[dir] .ReportForm__categoryHeader:not(:first-child),
.ReportForm__singleReasonText,
.ReportForm__singleReasonTextWithComment,
.SettingsListItem__title,
.vkuiActionSheetItem--compact .vkuiActionSheetItem__container,
.Settings__button,
.ConvoTitle,
.MessageText,
.AttachWall__message,
[dir] input[type=text],
[dir] input[type=submit],
[dir] input[type=button],
[dir] input[type=search],
[dir] input[type=password],
[dir] input[type~=text],
[dir] input[type~=search],
[dir] input[type~=password],
[dir] input[type~=email],
[dir] input.text,
[dir] input.search,
[dir] .fakeinput,
[dir] textarea,
[dir] input.big_text,
[dir] input.file,
[dir] div[contenteditable=true],
.login_about_mobile,
.login_mobile_info,
[dir=ltr] .HeaderSectionSwitcher__buttonText,
.Breadcrumb--bold,
[dir] .SideOfficeMenu__link,
.Preview__title,
.BreadCrumb,
.JobFullText,
.ScrollElement__title,
.BlogPageSideMenu__sectionHeader,
.BlogPostThumb__text,
.BlogPostThumb__title,
.BlogPageSideMenu__text,
.VideoLayerInfo__recommendedTitle,
.VideoLiveCoderSettings__warning,
.BestFriendsSettingsBox__sectionTitle,
.ColorPanel__name,
.AdsEasyPromoteModal + .vkui__portal-root .AdsEasyPromoteModal__AdBlockTitle,
.ImageStatusPopup__description,
.article_ed_layer .article_ed_layer__list_item .article_ed_layer__list_item_title,
.settings_alert .text {
  color: #e1e3e6 !important;
}
.rb_box_wrap,
.poster__view #poster-field-msg,
.article_snippet .article_snippet__read_btn,
.article_snippet .article_snippet__action_btn_text,
.profile_info_header .im-mess-stack--lnk,
.popup_box_container .im-mess-stack--lnk,
.audio_pl_edit_box .ape_audio_item_wrap .audio_row em,
.im-chat-input .im-chat-input--text * {
  color: #000000 !important;
}
.audio_page_player_title_performer a,
.audio_pl_snippet2 .audio_pl_snippet__info_title,
.audio_row .audio_row__performers a,
.audio_pl_snippet_info_maintitle,
.audio_pl_snippet2 .audio_pl_snippet__action_btn_listen,
.audio_row .audio_row__play_btn .audio_row__play_btn_icon--pause,
.audio_row .audio_row__play_btn .audio_row__play_btn_icon--play,
.audio_pl_snippet2 .audio_shuffle_all_button .audio_pl_snippet__shuffle_all_icon,
.audio_page_player2 .audio_page_player_icon--pause,
.audio_page_player2 .audio_page_player_icon--play,
.audio_page_player2 .audio_page_player_prev,
.audio_page_player2 .audio_page_player_next {
  color: #e82f94 !important;
}
.nim-dialog .nim-dialog--name .nim-dialog--name-w,
.audio_row .audio_row__performer,
.im-popular--name,
.im-page .nim-conversation-search-row .nim-dialog--name .nim-dialog--name-w,
.audio_page_layout .audio_item__title,
.audio_page_layout .audio_item__title > a,
.page_counter .count,
.profile_more_info_link,
.wall_module .media_desc .a,
.ui_tab_plain,
.fc_contact_name,
a,
.ui_rmenu_item,
.post_like,
.post_reply,
.post_share,
.fc_tab_notify,
.page_media_poll .page_poll_row_percent,
#side_bar ol li .left_row,
.stl_active.over_fast #stl_bg,
.wall_module .post_like:hover,
.wall_module .post_reply:hover,
.wall_module .post_share:hover,
.audio_row:hover:not(.audio_row__current) .audio_row_content,
.left_count_wrap,
.mail_box_cont,
#group_apps_list .group_apps_list_rows .group_apps_list_row .group_apps_edit,
.apps_i_panel,
.page_status_editor .editor,
.im-page-pinned,
.im-page .im-page--clear-recent,
.deep_active .post_replies_header .post_replies_reorder,
.deep_active.wall_module .post_replies_header .post_replies_reorder,
.ts_contact_name,
.ChatSettingsMembersWidget__add,
.im-fwd .im-fwd--title,
.Select__control,
.audio_pl_edit_box .ape_audio_item_wrap .ape_attach,
.page_counter:hover .label,
.im-page--title-reconnect,
.audio_row__more_actions .audio_row__more_action,
.im-replied--author-link,
.nim-dialog.nim-dialog_typing .nim-dialog--typing,
.tu_mem,
.language_box_row .language_box_row_label,
.Entity__title,
.Link,
.Button--tertiary,
.Select__menu .Select__group > .Select__title,
.Select__option,
.feed_blog_reminder_large .feed_blog_reminder_title,
.feed_blog_reminder_link,
#stl_text,
.mem_pseudolink,
.im-mess .im-mess--btn,
.post_suggest .post_suggest__action_text,
.wddi_text,
.friends_import_header,
.AuthorPageHeader__create,
.olist_item_name,
.ui_ownblock_label,
.page_photo.page_action_menu_groups .page_actions_item.group_send_msg_status_block .group_send_msg_status_block_title,
.audio_w_covers .audio_podcast .audio_row__title_inner,
a b,
b a,
.mail_link__title,
.sticker_extra_tt .tt_text .stickers_extra_text > b,
#app_widget_header_btn,
#qr_code_btn,
.app_actions_menu_wrap,
.wide_column .topics_module .topic_title,
.topics_module .topic_inner_link,
.payments_getvotes_method_title,
.profile_info_edit,
.button_action_light,
.notifications_new_events,
.wdd_add2,
.like_button_label,
.like_button_count,
.like_button_icon,
.Button--secondary,
.wk_sub_header,
.links-list__domain,
.ListAddControl,
.StickerStylesMenuItem__price,
.help_table_question__ans_text .wk_hider_title,
.settings_alert .footer .licenses_btn,
.settings_alert .footer .cancel_btn {
  color: #b0ccda !important;
}
`,
    'settings': `*::-webkit-scrollbar-track-piece {
  background: none !important;
}
*::-webkit-scrollbar {
  background-color: #242424 !important;
}
*::-webkit-scrollbar-thumb:hover {
  background-color: #e7e8ec !important;
}
*::-webkit-scrollbar-thumb {
  background-color: #626568 !important;
}
*::-webkit-scrollbar-thumb {
  border-radius: 50px;
}
*::-webkit-scrollbar {
  width: 5px;
  max-height: 5px;
}
html,
body {
  transition-duration: 500ms !important;
  -o-transition-duration: 500ms !important;
  -moz-transition-duration: 500ms !important;
  -webkit-transition-duration: 500ms !important;
  transition-delay: 0ms !important;
  -o-transition-delay: 0ms !important;
  -moz-transition-delay: 0ms !important;
  -webkit-transition-delay: 0ms !important;
  transition-timing-function: ease-in-out !important;
  -o-transition-timing-function: ease-in-out !important;
  -moz-transition-timing-function: ease-in-out !important;
  -webkit-transition-timing-function: ease-in-out !important;
  transition-property: background-color, border-bottom-color, border-left-color, border-right-color, border-top-color !important;
  -o-transition-property: background-color, border-bottom-color, border-left-color, border-right-color, border-top-color !important;
  -moz-transition-property: background-color, border-bottom-color, border-left-color, border-right-color, border-top-color !important;
  -webkit-transition-property: background-color, border-bottom-color, border-left-color, border-right-color, border-top-color !important;
}
.vk-dark {
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Open Sans, Helvetica Neue, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
  z-index: 99999999;
  color: #e1e3e6 !important;
}
.vk-dark-main-container {
  max-height: 270px;
  overflow-y: auto;
}
.vk-dark-sittings-main-position {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: auto;
}
.vk-dark-settings-container {
  width: 550px;
  height: 380px;
  top: 50%;
  left: 50%;
  margin-top: -140px;
  margin-left: -275px;
  border-radius: 4px;
  overflow: hidden;
}
.vk-dark-main-header,
.vk-dark-settings-support {
  padding: 0 20px;
  height: 54px;
  line-height: 54px;
}
.vk-dark-main-header {
  font-size: 16px;
}
.vk-dark-row,
.vk-dark-main-header {
  border-bottom: 1px solid;
}
.vk-dark-settings-support {
  border-top: 1px solid;
  text-align: center;
}
.vk-dark-settings-support > a {
  text-decoration: none;
}
.vk-dark-settings-support > a:hover {
  text-decoration: underline;
}
.vk-dark-settings-group {
  margin: 0 20px;
}
.vk-dark-row {
  padding: 15px 0 14px;
}
.vk-dark-settings-group:last-child > .vk-dark-row {
  border: none;
}
.vk-dark-cell-left {
  width: 145px;
  padding: 6px 10px 6px 0;
  line-height: 16px;
}
.vk-dark-settings-narrow-row {
  margin-bottom: 10px;
}
.vk-dark-hidden-checkbox {
  width: 1px;
  height: 1px;
  opacity: 0;
}
.vk-dark-settings-narrow-row input[type=checkbox] + label.vk-dark-settings-label:before {
  display: block;
  content: "";
  background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%20width%3D%2215%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20fill%3D%22%23fff%22%20height%3D%2215%22%20rx%3D%223%22%20width%3D%2215%22%2F%3E%3Crect%20height%3D%2214%22%20rx%3D%223%22%20stroke%3D%22%23c1c9d1%22%20width%3D%2214%22%20x%3D%22.5%22%20y%3D%22.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat 0 !important;
  margin: 0 7px 0 0;
  width: 15px;
  height: 15px;
}
.vk-dark-settings-narrow-row input[type=checkbox]:checked + label:before {
  background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20width%3D%2215%22%20height%3D%2215%22%20fill%3D%22%235181B8%22%20rx%3D%223%22%2F%3E%3Cpath%20stroke%3D%22%23FFF%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M4%207.5L6.5%2010%2011%204.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) !important;
}
.vk-dark-close-settings {
  float: right;
  width: 24px;
  height: 24px;
  background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2210%22%20viewBox%3D%220%200%2010%2010%22%20width%3D%2210%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m6.4%205%203.3-3.3c.4-.4.4-1%200-1.4s-1-.4-1.4%200l-3.3%203.3-3.3-3.3c-.4-.4-1-.4-1.4%200s-.4%201%200%201.4l3.3%203.3-3.3%203.3c-.4.4-.4%201%200%201.4.2.2.4.3.7.3s.5-.1.7-.3l3.3-3.3%203.3%203.3c.2.2.4.3.7.3s.5-.1.7-.3c.4-.4.4-1%200-1.4z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E) 50% no-repeat !important;
  border: 0;
  margin: 6px;
  cursor: pointer;
  opacity: 0.7;
  right: 4px;
  top: 8px;
}
.vk-dark-close-settings:hover {
  opacity: 1;
}
.vk-dark-main-header,
.vk-dark-settings-support,
.payments_box_wide {
  background-color: #3b3f41 !important;
}
.vk-dark-settings-container {
  background-color: #2d2f30 !important;
}
.vk-dark-sittings-main-position {
  background-color: rgba(0, 0, 0, 0.8) !important;
}
.vk-dark-row,
.vk-dark-main-header,
.vk-dark-settings-support {
  border-color: #1a1a1a !important;
}
.vk-dark-cell-left {
  color: #656565 !important;
}
.vk-dark-settings-support > a,
.im-right-menu .im-right-menu--count {
  color: #b0ccda !important;
}
.vk-dark-cell-left,
.vk-dark-settings-narrow-row input[type=checkbox] + label.vk-dark-settings-label:before {
  float: left;
}
.vk-dark-sittings-main-position,
.vk-dark-settings-container,
.vk-dark-close-settings {
  position: fixed;
}
`,
    'dialog-float': `/*
Изменяет расположение чата в новом дизайне
*/
.im-page_classic.im-page .im-page--chat-input,
.im-page .im-page--history {
  margin-left: 0 !important;
}
.im-page .im-page--history {
  margin-right: 317px;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.im-create.im-create_material {
  right: 0;
}
.im-page .im-page--dialogs {
  float: right !important;
}
`,
    'menu-promo': `/*
  Скрывает рекламу под меню и в новостях
*/
#ads_left,
.ads_ad_box {
  display: none !important;
}
`,
    'audio-promo': `.audio_promo {
  display: none !important;
}
`,
    'audio-subscribe': `.CatalogBlock__subscription {
  display: none !important;
}
`,
    'dialog-friend_online': `/*
Убираем блок друзей онлайн права с низу
*/
.chat_onl_wrap {
  display: none !important;
}
`,
    'right-apps-block': `/*
    Скрывает блок с рекламой игр
*/
.apps_feedRightAppsBlock__row,
.apps_feedRightAppsBlock__hide {
  display: none !important;
}
`,
    'popular-clips': `/*
    Скрывает блок с "Популярными клипами"
*/
.ShortVideoFeedBlock {
  display: none !important;
}
`,
};
const styleStorage = {};
const storageName = `vk_dark`;
const defaultStorage = `{
    "vkdark-main": true,
    "menu-promo": true,
    "dialog-float": false,
    "dialog-friend_online": true,
    "audio-subscribe": true,
    "audio-promo": true,
    "right-apps-block": false,
    "popular-clips": false,
    "disable-all_promo": false
}`;

// Работа с локальным хранилищем.
function getStorage(){
    return JSON.parse(localStorage.getItem(storageName));
}

function mutationStorageAfterSave(key, value, storage){
    switch (key) {
        case 'disable-all_promo':
            if(value) {
                storage['audio-subscribe'] = true;
                storage['audio-promo'] = true;
                storage['menu-promo'] = true;
            }
            break;
        case 'audio-subscribe':
        case 'audio-promo':
        case 'menu-promo':
            if(!value) {
                storage['disable-all_promo'] = false;
            }
            break;
    }
    return storage;
}

function setStorage(key, value) {
    let storage = getStorage();
    if(storage === null) {
        storage = JSON.parse(defaultStorage);
    }
    storage = mutationStorageAfterSave(key, value, storage);
    storage[key] = value;
    localStorage.setItem(storageName, JSON.stringify(storage));
    setStyles();
    setCheckbox();
}

if(getStorage() === null) {
    localStorage.setItem(storageName, defaultStorage);
}
function deleteAllStyles() {
    Object.keys(styleStorage).forEach(key => styleStorage[key].remove());
}

function setStyles() {
    //сначала удаляем стили.
    deleteAllStyles();
    const storage = getStorage();
    Object.keys(storage).forEach(key => {
        if(!!storage[key]) {
            styleStorage[key] = GM_addStyle(styles[key]);
        }
    });
}
//Получаем состояние чекбоксов из сторейжа и проставляешь их значения
function setCheckbox(){
    const storage = getStorage();
    Object.keys(storage).forEach(key => document.getElementById(key).checked = storage[key]);
}

GM_addStyle(styles['settings']);
setStyles();

GM_registerMenuCommand('Github.com', () => {
    GM_openInTab('https://github.com/Dmitiry1921/VK-Dark/blob/master/README.md', {active: true, insert: true});
});
GM_registerMenuCommand('Check Update', () => {
    GM_openInTab('https://github.com/Dmitiry1921/VK-Dark/raw/master/vkdark.user.js', {active: true, insert: true});
});
GM_registerMenuCommand('Настройки', () => {
    const elMain = '.vk-dark.vk-dark-sittings-main-position';
    if(document.querySelector(elMain) !== null) return;
    //Добавляем блок на страницу
    document.body.insertAdjacentHTML('beforeEnd', `<div class="vk-dark vk-dark-sittings-main-position"> <div class="vk-dark vk-dark-settings-container"> <h2 class="vk-dark vk-dark-main-header"> <div class="vk-dark-title">Настройки</div> <div class="vk-dark-close-settings"></div> </h2> <div class="vk-dark vk-dark-main-container"> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Основные</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="vkdark-main" class="vk-dark vk-dark-hidden-checkbox" checked/> <label for="vkdark-main" class="vk-dark vk-dark-settings-label"> Включить VK-Dark </label> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Меню</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="menu-promo" class="vk-dark vk-dark-hidden-checkbox" checked/> <label for="menu-promo" class="vk-dark vk-dark-settings-label"> Скрыть блок "Реклама" </label> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Общее</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="right-apps-block" class="vk-dark vk-dark-hidden-checkbox" /> <label for="right-apps-block" class="vk-dark vk-dark-settings-label"> Скрыть блок "Игры" </label> </div> </div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="popular-clips" class="vk-dark vk-dark-hidden-checkbox" /> <label for="popular-clips" class="vk-dark vk-dark-settings-label"> Скрыть блок "Популярные клипы" </label> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Диалоги</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="dialog-float" class="vk-dark vk-dark-hidden-checkbox" /> <label for="dialog-float" class="vk-dark vk-dark-settings-label"> Расположить переписки справа </label> </div> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="dialog-friend_online" class="vk-dark vk-dark-hidden-checkbox" checked/> <label for="dialog-friend_online" class="vk-dark vk-dark-settings-label"> Скрыть блок чата с друзьями </label> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Аудиозаписи</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="audio-subscribe" class="vk-dark vk-dark-hidden-checkbox" checked/> <label for="audio-subscribe" class="vk-dark vk-dark-settings-label"> Скрыть блок "Подписка на музыку" </label> </div> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="audio-promo" class="vk-dark vk-dark-hidden-checkbox" checked/> <label for="audio-promo" class="vk-dark vk-dark-settings-label"> Скрыть блок "Промо" </label> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-group"> <div class="vk-dark vk-dark-row"> <div class="vk-dark vk-dark-cell-left">Реклама</div> <div class="vk-dark vk-dark-cell-right"> <div class="vk-dark vk-dark-settings-narrow-row"> <input type="checkbox" id="disable-all_promo" class="vk-dark vk-dark-hidden-checkbox" /> <label for="disable-all_promo" class="vk-dark vk-dark-settings-label"> Отключить всю рекламу на сайте </label> </div> </div> </div> </div> </div> <div class="vk-dark vk-dark-settings-support"> Вы можете <a href="https://vk.me/join/AJQ1d7U5CANH4MRXOBNPuzB4">связаться с нами</a> </div> </div></div>`);
    const main = document.querySelector(elMain);
    //Закрытие настроек
    function close() {
        document.body.removeChild(main);
    }
    document.querySelector('.vk-dark-close-settings').onclick = close;
    //Клик вне поля закрывает окно.
    main.onclick = (e) => {if(main === e.target) close()}
    //Вешаем события onchange на пункты настроек
    document.querySelectorAll('.vk-dark-hidden-checkbox').forEach(element => element.onchange = (e) => setStorage(e.target.id, e.target.checked));
    setCheckbox();
});
GM_registerMenuCommand('Сообщить об ошибке', () => {
    GM_openInTab('https://vk.me/join/AJQ1d7U5CANH4MRXOBNPuzB4', {active: true, insert: true});
});

console.info('VK Dark version: ', '0.2.38');
