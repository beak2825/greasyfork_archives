// ==UserScript==
// @name		d3.sp2
// @namespace	d3patch
// @match		https://d3.ru/*
// @match		https://*.d3.ru/*
// @icon		https://d3.ru/static/i/logo_main_beta.png
// @version		0.7.1
// @description	try to take over the world!
// @author	 	Hitler
// @homepage	https://d3.ru/user/Hitler/
// @grant		unsafeWindow
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require		https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js
// @require		https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js
// @downloadURL https://update.greasyfork.org/scripts/395437/d3sp2.user.js
// @updateURL https://update.greasyfork.org/scripts/395437/d3sp2.meta.js
// ==/UserScript==

var $, jQuery; $ = jQuery = window.jQuery;
this.$ = this.jQuery = jQuery.noConflict(true);
console.clear();

// ADD MY CSS. Дополнения и исправления.
$('head').append(`<style id="spStyle">.b-column_left_column>.b-i-column{padding:11px 20px 20px 0}#icon-wrench{fill:rgba(78,128,189,1)}.ExtMenu{border-radius:6px;padding:11px 20px 20px 32px}ul#TabsNav{list-style:none;margin:0;padding:0;overflow:auto}ul#TabsNav li{float:left;font-weight:700;margin-right:1px;margin-bottom:0;padding:3px 8px;border-radius:4px 4px 0 0;border:1px solid #ccc;border-bottom:none;cursor:pointer;background-color:#f4f4f2}ul#TabsNav li.active,ul#TabsNav li:hover{background-color:#fff;border-bottom:1px solid #fff}#TabsNav li a{text-decoration:none;color:#666}.TabContent{padding:8px;border:1px solid #ccc;background-color:#fff;border-radius:0 4px 4px 4px;margin-top:-1px}.SetTings{padding:4px 0;border-top:1px dotted rgba(66,66,66,1);line-height:2em}.ExtMenu input[type=checkbox],.ExtMenu input[type=radio]{margin:3px!important;vertical-align:middle}.ExtMenu input[type=radio]{-webkit-appearance:radio!important;-moz-appearance:radio!important;appearance:radio!important}.ExtMenu input[type=checkbox]{-webkit-appearance:checkbox!important;-moz-appearance:checkbox!important;appearance:checkbox!important}.TabContent label{color:#888;vertical-align:middle}.TabContent h2{font-size:18px!important;color:#a75353;margin:0}.TabContent h3{margin:0}.TabContent [type=button],.TabContent [type=text]{box-sizing:border-box;border:1px solid #ccc;height:24px;vertical-align:middle}.s-header__o-auth{display:none!important}.b-post-header__sharing{display:none}.b-rating{width:inherit!important}.b-rating_mode_default{width:inherit}.b-comment-toolbar__button-container{margin-right:4px!important}.react .b-search_opened_true{width:390px}.b-post_my_post_controls{margin-left:0;margin-right:0}.b-post_my_post_controls .b-button_icon{top:-1px}.b-post_my_post_controls_button .b-button{margin-right:0!important}.c_footer .where+a{border-bottom:1px dotted}.c_footer .where{padding:0 6px}.c_footer{margin-bottom:-4px!important;margin-top:12px}#myClose{display:none}.b-layout__right:hover>#myClose{display:block;position:absolute;right:0;font-size:24px;color:rgba(161,161,161,.5);line-height:12px;padding:8px;cursor:pointer}.b-footer_wrapper{box-sizing:border-box;max-width:1305px;margin:0 auto}.b-footer_links{padding:15px}.search-RUN{position:absolute!important;left:initial;right:-1px;padding:5px;z-index:1;cursor:pointer;pointer-events:all;z-index:42}.search-RUN:hover{color:green}.b-search_opened_false .search-RUN{display:none!important}@media only screen and (max-width:1024px){.search-RUN{right:32px;padding:10px}}.b-icon.Anchor.DOWN,.b-icon.Anchor.UP{display:inline-block;width:20px;text-align:center}.b-svg-icon.Anchor{vertical-align:middle;text-align:center;fill:grey}.Female,.Female .b-user-login__login{color:#f58ad2!important}.Male,.Male .b-user-login__login{color:#8baace!important}.Restore{background:rgba(255,0,0,.1)}.react .b-comment_deleted_true>.b-comment__body.Restore .b-comment__content_collapsed,.react .b-comment_ignored_true>.b-comment__body.Restore .b-comment__content_collapsed{font-family:inherit!important;font-style:inherit!important;color:inherit!important}[data-hide=""]{display:none!important}.react .b-comment_deleted_true>.b-comment__body .b-comment__content_collapsed,.react .b-comment_ignored_true>.b-comment__body .b-comment__content_collapsed{color:rgba(140,140,140,1)}.Save{cursor:pointer;pointer-events:all}.i-form_text_input_profile_search{padding-left:32px!important}.c_body img[width]{max-height:initial}.b-menu_item.hidden,.b-menu_item.hidden.b-menu_item_active{display:block!important}.react .firefox .b-post__content-cell,.react .msedge .b-post__content-cell,.react .msie .b-post__content-cell{display:inherit!important}.react .firefox .b-post__content-table,.react .msedge .b-post__content-table,.react .msie .b-post__content-table{display:inherit!important}.b-header_nav_button_question{display:none}@media only screen and (max-width:1220px){.b-rating__button_sign_hide{border-left:1px solid rgba(231,231,231,1)}.b-header_nav .b-header_nav_button.b-header_nav_button__create .b-button_caption{display:none}}@media only screen and (min-width:1025px){.react .b-comment_mode_root>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment>.b-comment .b-comment{padding-left:20px!important}}</style>`);
//	Добавляем SVG-иконки
$('#font').append("<svg id='icon-wrench' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z'></path></svg>");
$('#font').append("<svg id='icon-save' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z'></path></svg>");

// Тёмная тема для React (новой части d3-движка).
var darkTheme = `<style id="darkTheme">.react .b-rating-popup__value{color:rgba(220,220,220,1)}.react .b-rating-popup__menu-item:hover{color:rgba(78,128,189,1)}.react .b-rating-popup_section_plus .b-rating-popup__menu-item_section_plus{color:rgba(78,128,189,1)}.react .b-rating-popup_section_minus .b-rating-popup__menu-item_section_minus{color:rgba(78,128,189,1)}.react .x-ugc .moderator,.react .x-ugc font[color="#0000FF"],.react .x-ugc font[color="#0000ff"],.react .x-ugc font[color="#00F"],.react .x-ugc font[color="#00f"],.react .x-ugc font[color=BLUE],.react .x-ugc font[color=blue],.react .x-ugc moderator{color:rgba(42,100,60,1)}.b-rating_vote-sign_minus .b-rating__button_sign_plus{display:none}.b-rating_vote-sign_plus .b-rating__button_sign_minus{display:none}.react .w-app{background:rgba(0,0,0,1);background-image:none}.w-app.w-app_fixed_false{background-image:none!important}.react{color:rgba(220,220,220,1);fill:rgba(220,220,220,1)}.react .b-extensible{color:rgba(161,161,161,1)}.react .b-search_opened_true .b-search__toggle-button{color:rgba(29,29,29,1)}.react .b-comment__editor-cross,.react .b-wysiwyg__button{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .b-scroll-panel{color:rgba(161,161,161,1)}.react .b-link_color_black{color:rgba(220,220,220,1);fill:rgba(220,220,220,1)}.react .b-link_color_black:hover{color:rgba(176,176,176,1)}.react .x-ugc a{color:rgba(78,128,189,1)}.react .x-ugc a:hover{color:rgba(62,102,151,1)}.react .b-link_color_blue{color:rgba(78,128,189,1);fill:rgba(78,128,189,1)}.react .b-link_color_blue:hover{color:rgba(62,102,151,1)}.react .b-action_color_blue{color:rgba(78,128,189,1);fill:rgba(78,128,189,1)}.react .b-action_color_blue:hover{color:rgba(62,102,151,1)}.react .b-action_color_textgrey{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .b-action_color_textgrey:hover{color:rgba(129,129,129,1)}.react .b-comment__footer{color:rgba(161,161,161,1)}.react .b-button.b-button_mode_icon.b-button_color_textgrey{color:rgba(161,161,161,1)}.react .b-comment__fold-icon{color:rgba(161,161,161,1)}.react .b-post-footer{color:rgba(161,161,161,1)}.react .p-post-item__line{background:rgba(66,66,66,1)}.react .p-post-item__sidebar-domain{color:rgba(161,161,161,1)}.react .p-post-item__menu-counter{color:inherit}.react .p-post-item__menu-section .b-radio__label{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .p-post-item__menu-section .b-radio__label:hover{color:rgba(129,129,129,1)}.react .b-rating__button{color:rgba(161,161,161,1)}.react .b-rating__button:hover{color:rgba(129,129,129,1)}.react .p-post-item__layout,.react .p-post-tag__sidebar-info{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-link_color_textgrey{color:rgba(117,117,117,1);fill:rgba(117,117,117,1)}.react .b-link_color_textgrey:hover{color:rgba(94,94,94,1)}.react .b-domain-government__item,.react .b-subscription__counter,.react .b-user-counter{color:rgba(220,220,220,1);color:rgba(161,161,161,1)}.react .b-alert{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-alert,.react .b-domain-popup,.react .b-rating-popup,.react .b-select__menu,.react .b-tooltip,.react .b-user-popup{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1);-webkit-box-shadow:0 2px 2px rgba(36,36,36,.25);box-shadow:0 2px 2px rgba(36,36,36,.25)}.react .b-tooltip{-webkit-box-shadow:0 2px 2px rgba(36,36,36,.25);box-shadow:0 2px 2px rgba(36,36,36,.25);color:rgba(161,161,161,1)}.react .b-tooltip_position_top:before{border-top-color:rgba(66,66,66,1)}.react .b-tooltip_position_top:after{border-top-color:rgba(33,33,33,1)}.react .b-tooltip_position_left:before{border-left-color:rgba(66,66,66,1)}.react .b-tooltip_position_left:after{border-left-color:rgba(33,33,33,1)}.react .b-tooltip_position_bottom:before{border-bottom-color:rgba(66,66,66,1)}.react .b-tooltip_position_bottom:after{border-bottom-color:rgba(33,33,33,1)}.react .b-tooltip_position_right:before{border-right-color:rgba(66,66,66,1)}.react .b-tooltip_position_right:after{border-right-color:rgba(33,33,33,1)}.react .b-random-banner:after{border-left:1px dashed rgba(66,66,66,1)}.react .b-post-header_mode_image-header .b-post-header__container:before,.react .b-post-header_mode_image-title .b-post-header__container:before{background:0 0}.react .b-context-menu_direction_bottom:before{border-bottom-color:rgba(66,66,66,1)}.react .b-context-menu_direction_bottom:after{border-bottom-color:rgba(33,33,33,1)}.react .b-context-menu__container{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-context-menu__container>li:hover,.react .b-context-menu__container>li_focused_true{color:rgba(78,128,189,1);background:rgba(33,33,33,1)}.react .b-rating-popup{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-domain-popup{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .p-post-archive__calendar-container,.react .p-post-archive__sidebar-info{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-calendar__button_for_month,.react .b-calendar__button_for_year{border:1px solid rgba(66,66,66,1)}.react .b-calendar__day:hover,.react .b-calendar__month:hover,.react .b-calendar__year:hover{background-color:rgba(24,24,24,1)}.react .b-calendar__button:hover{background:rgba(24,24,24,1)}.react .b-post-header__gold-icon{color:rgba(233,191,9,1)}.react .b-button{color:rgba(33,33,33,1)}.react .b-button.b-button_mode_default.b-button_color_green{border:1px solid rgba(45,85,65,1);background:rgba(45,85,65,1)}.react .b-button.b-button_mode_default.b-button_color_green:hover:not(.b-button_disabled_true){background-color:rgba(36,68,52,1);border-color:rgba(36,68,52,1)}.react .b-button.b-button_mode_default.b-button_color_blue{border:1px solid rgba(78,128,189,1);background:rgba(78,128,189,1)}.react .b-button.b-button_mode_default.b-button_color_blue:hover:not(.b-button_disabled_true){background-color:rgba(62,102,151,1);border-color:rgba(62,102,151,1)}.react .b-button.b-button_mode_default.b-button_color_white-textgrey{border:1px solid rgba(208,208,208,1);background:rgba(208,208,208,1)}.react .b-button.b-button_mode_default.b-button_color_white-textgrey:hover:not(.b-button_disabled_true){background-color:rgba(166,166,166,1);border-color:rgba(166,166,166,1)}.react .b-button.b-button_mode_default.b-button_color_red{border:1px solid rgba(255,0,0,1);background:rgba(255,0,0,1)}.react .b-button.b-button_mode_default.b-button_color_red:hover:not(.b-button_disabled_true){background-color:rgba(204,0,0,1);border-color:rgba(204,0,0,1)}.react .b-button.b-button_mode_default.b-button_color_yellow{border:1px solid rgba(236,179,50,1);background:rgba(236,179,50,1)}.react .b-button.b-button_mode_default.b-button_color_yellow:hover:not(.b-button_disabled_true){background-color:rgba(189,143,40,1);border-color:rgba(189,143,40,1)}.react .b-button_mode_default.b-button_color_white{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1);color:rgba(220,220,220,1)}.react .b-button_mode_default.b-button_color_white:hover:not(.b-button_disabled_true){border-color:rgba(53,53,53,1)}.react .b-button_mode_default.b-button_color_snowgrey{border:1px solid rgba(22,22,22,1);background:rgba(22,22,22,1);color:rgba(160,160,160,1)}.react .b-button_mode_default.b-button_color_snowgrey:hover:not(.b-button_disabled_true){border-color:rgba(53,53,53,1)}.react .s-footer__app-button{border:1px solid rgba(66,66,66,1)!important}.react .s-footer__app-button:hover{border-color:rgba(53,53,53,1)!important}.react .b-sidebar-footer__arrow-button{border-color:rgba(66,66,66,1)!important}.react .b-search{border:1px solid rgba(66,66,66,1)}.react .b-input__input{border:1px solid rgba(66,66,66,1)}.react .b-search__toggle-button{color:rgba(66,66,66,1)}.react .s-menu__avatar,.react .s-menu__button-user-avatar{background-color:rgba(44,44,44,1)}.react .b-number-counter{background:rgba(255,0,0,1);color:rgba(33,33,33,1)}.react .s-menu__popup{border:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1);-webkit-box-shadow:0 2px 2px rgba(33,33,33,.25);box-shadow:0 2px 2px rgba(33,33,33,.25)}.react .s-menu__button-user-login{color:rgba(78,128,189,1)}.react .s-menu__domain-list{background:rgba(33,33,33,1)}.react .b-checkbox_mode_toggle .b-checkbox__box{background:rgba(0,0,0,1);border-color:rgba(66,66,66,1)}.react .b-checkbox:hover:not(.b-checkbox_checked_true) .b-checkbox__box{background:rgba(33,33,33,1)}.react .b-user-popup{border:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1);box-shadow:0 2px 2px rgba(33,33,33,.25)}.react .b-karma:hover .b-karma__vote-button{color:rgba(208,208,208,1)}.react .b-karma:hover .b-karma__vote-button:hover{color:rgba(78,128,189,1)}.react .b-karma_vote-count_0 .b-karma__value{color:rgba(220,220,220,1)}.react .b-karma_vote-count_1.b-karma_vote-sign_minus .b-karma__vote-button_m1,.react .b-karma_vote-count_1.b-karma_vote-sign_plus .b-karma__vote-button_p1,.react .b-karma_vote-count_2.b-karma_vote-sign_minus .b-karma__vote-button_m1,.react .b-karma_vote-count_2.b-karma_vote-sign_minus .b-karma__vote-button_m2,.react .b-karma_vote-count_2.b-karma_vote-sign_plus .b-karma__vote-button_p1,.react .b-karma_vote-count_2.b-karma_vote-sign_plus .b-karma__vote-button_p2{color:rgba(78,128,189,1)}.react .b-karma__vote-button{color:transparent}.react .b-karma__vote-button:hover{color:rgba(78,128,189,1)}.react .b-karma__vote-button_m1,.react .b-karma__vote-button_p1{color:rgba(208,208,208,1)}.react .b-karma__value{color:rgba(78,128,189,1)}.react .b-rating_vote-sign_zero .b-rating__value{color:rgba(220,220,220,1)}.react .b-rating__value-placeholder{background:rgba(110,140,180,1)}.react .b-rating_vote-sign_minus .b-rating__button_sign_minus,.react .b-rating_vote-sign_plus .b-rating__button_sign_plus{color:rgba(78,128,189,1)}.react .p-post-item__layout{background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-comment_unread_true.b-comment_mode_default.b-comment_folded_false>.b-comment__body{background:rgba(24,24,24,1)}.react .b-comment_unread_true.b-comment_mode_default.b-comment_folded_false>.b-comment__body.Restore{background:rgba(33,0,0,1)}.react .b-wysiwyg__editor{color:rgba(220,220,220,1);background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-wysiwyg__toolbar{border:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1)}.react .b-wysiwyg__button{color:rgba(160,160,160,1);fill:rgba(160,160,160,1);background:rgba(0,0,0,0)}.react .b-wysiwyg__button_action_moderate{color:rgba(78,128,189,1)}.react .b-wysiwyg__button_action_irony,.react .b-wysiwyg__button_action_unlink{color:rgba(255,0,0,1)}.react .s-domain-toolbar{background:rgba(33,33,33,1);-webkit-box-shadow:0 2px 2px rgba(0,0,0,.25);box-shadow:0 2px 2px rgba(0,0,0,.25)}.react .p-post-item__menu-section.b-radio_checked_true .b-radio__label{color:rgba(78,128,189,1)!important}.react .s-domain-toolbar__button{border-bottom:1px solid rgba(123,123,123,1)}.react .b-post__media-content{color:rgba(161,161,161,1)}.react .b-button_mode_default.b-button_color_white.b-button_disabled_true{color:rgba(120,120,120,1)}.react .s-domain-toolbar__button{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .s-domain-toolbar__button_disabled_true{color:rgba(161,161,161,1)}.react .b-wysiwyg__button:hover{color:rgba(129,129,129,1)}.react .b-comment__editor-cross,.react .b-wysiwyg__button{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .b-scroll-panel{color:rgba(161,161,161,1)}.react .s-footer{border-top:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1);color:rgba(22,22,2,1);margin-top:-1px}.react .s-footer__age{border:1px solid rgba(255,0,0,1);background:rgba(255,0,0,1);color:rgba(33,33,33,1)}.react .p-post-item__sidebar{background:initial}.react .p-post-item__post-list{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-sidebar-post_mode_comment:hover .b-sidebar-post__comment-counter .b-comment-counter__link,.react .b-sidebar-post_mode_comment:hover .b-sidebar-post__domain-name .b-link,.react .b-sidebar-post_mode_comment:hover .b-sidebar-post__rating,.react .b-sidebar-post_mode_comment:hover .b-sidebar-post__title,.react .b-sidebar-post_mode_rating:hover .b-sidebar-post__comment-counter .b-comment-counter__link,.react .b-sidebar-post_mode_rating:hover .b-sidebar-post__domain-name .b-link,.react .b-sidebar-post_mode_rating:hover .b-sidebar-post__rating,.react .b-sidebar-post_mode_rating:hover .b-sidebar-post__title{color:rgba(195,160,100,1)}.react .b-sidebar-post_feed_subdomain:not(.b-sidebar-post_mode_related) .b-sidebar-post__title{color:rgba(161,161,161,1)}.react .b-sidebar-post__background:before{background:rgba(0,0,0,.6)}.react .b-post-header__post-title a{color:rgba(195,160,100,1)}.react .b-post-header__post-title a:hover{color:rgba(165,140,100,1)}.react .b-radio_mode_tab{color:rgba(220,220,220,1);fill:rgba(220,220,220,1)}.react .b-radio_mode_tab:hover{color:rgba(176,176,176,1)}.react .b-radio-group_mode_tab .b-radio-group__underline{background:rgba(220,220,220,1)}.react .b-select__menu{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-post-cut{background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-feed-message__container{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .p-ban-list__sidebar-info{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .p-ban-list__table{background:rgba(44,44,44,1);border:1px solid rgba(66,66,66,1)}.react .p-ban-list__table-header{background:rgba(22,22,22,1);color:rgba(200,200,200,1);border:1px solid rgba(66,66,66,1)}.react .p-ban-list__table-row:nth-child(odd) .p-ban-list__table-cell{border:1px solid rgba(66,66,66,1)}.react .p-ban-list__table-row:nth-child(2n) .p-ban-list__table-cell{background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-base-sidebar__post-list{background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-sidebar-post{border-bottom:1px solid rgba(66,66,66,1)}.react .b-sidebar-domain{background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1)}.react .b-tag{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-tag_mode_text{border:none;background:0 0}.react .b-domain-info{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-user-login_color_black{color:rgba(220,220,220,1);fill:rgba(220,220,220,1)}.react .b-post-cut__gallery-image{border:2px solid rgba(33,33,33,1)}.react .b-sidebar-footer__fixed-container{border:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1)}.react .b-sidebar-footer__section_name_personal{background:rgba(22,22,22,1)}.react .b-sidebar-footer__movable-container{background:rgba(0,0,0,1)}.react .b-sidebar-footer__section_name_additional,.react .b-sidebar-footer__section_name_mail,.react .b-sidebar-footer__section_name_personal{border-bottom:1px solid rgba(66,66,66,1)}.react .b-sidebar-footer__age{color:rgba(255,0,0,1)}.react .b-comment-toolbar__menu_for_sharing:after{border-right-color:rgba(224,24,24,1)}.react .b-comment-toolbar__menu_for_sharing .b-context-menu__container{background:rgba(24,24,24,1)}.react .b-context-menu_direction_right:before{border-right-color:rgba(66,66,66,1)}.react .b-context-menu_direction_right:after{border-right-color:rgba(24,24,24,1);left:-8px}.react .b-notification-popup{border:1px solid rgba(66,66,66,1);background:rgba(24,24,24,1)}.react .b-notification-popup__toolbar{background:rgba(0,0,0,1);border-bottom:1px solid rgba(66,66,66,1)}.react .b-notification{background:rgba(33,33,33,1);border-bottom:1px solid rgba(66,66,66,1)}.react .b-notification_unread_true{background:rgba(24,24,24,1)}.react .x-ugc .irony,.react .x-ugc del,.react .x-ugc font[color="#F00"],.react .x-ugc font[color="#FF0000"],.react .x-ugc font[color="#f00"],.react .x-ugc font[color="#ff0000"],.react .x-ugc font[color=RED],.react .x-ugc font[color=red],.react .x-ugc irony,.react .x-ugc s,.react .x-ugc strike{color:red}@media only screen and (max-width:1024px){.react .s-header__line_number_1{background:#000;outline:1px solid rgb(66,66,66,1)}.react .s-header__line_number_2{background:rgba(24,24,24,1);outline:1px solid rgb(66,66,66,1)}.react .p-post-item__container{border-left:1px solid rgba(66,66,66,1);border-right:1px solid rgba(66,66,66,1);border-bottom:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}.react .b-comment_mode_root .b-comment_mode_default>.b-comment__body .b-comment__footer{border-bottom:1px solid rgba(66,66,66,1)}.react .b-comment_mode_root .b-comment_mode_default>.b-comment__body .b-comment__footer-line{border-bottom:1px solid rgba(66,66,66,1)}.react .b-post-footer__line{border-bottom:1px solid rgba(66,66,66,1)}.react .b-rating_mode_default .b-rating__button_sign_plus{border-right:1px solid rgba(66,66,66,1)}.react .b-search{border-top:none;border-bottom:none}.react .b-comment_mode_root .b-comment_mode_default>.b-comment__body:after{height:0;background:rgba(231,231,231,1)}}@media only screen and (max-width:640px){.react .b-comment_mode_root>.b-comment:first-child:before{border-top:1px solid rgba(22,22,22,1)}.react .p-post-item__line{height:10px;border-top:1px solid rgba(66,66,66,1);border-bottom:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1)}.react .b-comment_mode_root>.b-comment:before{border-bottom:1px solid rgba(66,66,66,1);background:rgba(22,22,22,1)}.react .s-menu__popup-header{background:rgba(24,24,24,1)}.react .s-menu__button{background:rgba(24,24,24,1);border-left:1px solid rgba(66,66,66,1)}.react .s-menu__link-list{border-bottom:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}}</style>`;
// Тёмная тема для старой части d3.
var darkThemeOldSite = `<style id="darkThemeOldSite">.b-inbox_controls{background-color:rgba(24,24,24,1)}.b-new_post_domain_found_domains{background-color:rgba(24,24,24,1);border:1px solid rgba(66,66,66,1)}.b-new_post_domain_found_domains li{border-bottom:1px solid rgba(66,66,66,1)}.b-new_post_domain_found_domains a{color:rgba(220,220,220,1)}.b-search_header{background-color:rgba(24,24,24,1)!important;border:1px solid rgba(66,66,66,1)!important}a:hover{color:rgba(176,176,176,1)}.b-voter,.b-voter a{color:rgba(220,220,220,1)}.b-list_item{min-height:inherit}.b-controls_domains .b-list_item{margin:0 0 3px 0;padding:4px;display:inline-block}.b-cloud a{display:inline-block;border:1px solid rgba(66,66,66,1)}.b-cloud a:hover{background:0 0;border-color:rgba(204,204,204,1)}.b-search_form__democracy_domains a{top:0}.b-candidate{color:rgba(78,128,189,1)}body{background:rgba(0,0,0,1);color:rgba(220,220,220,1)}.b-header_nav_button .b-button .b-svg-icon *{fill:#a0a0a0}.l-content{background-color:rgba(33,33,33,1)}.l-header{background-color:rgba(0,0,0,1);box-shadow:inset 0 -2px 0 -1px rgba(66,66,66,1)}.l-footer{border-top:1px solid rgba(66,66,66,1);background-color:rgba(22,22,22,1)}.l-base_domain .b-header_nav_button__active{background-color:rgba(33,33,33,1)}.b-header_nav_button .b-button_caption{color:#acacac}.b-header_nav .b-header_nav_button.b-header_nav_button__create .b-button_caption{color:rgba(220,220,220,1)}.b-header_nav .b-header_nav_button.b-header_nav_button__create.b-header_nav_button__active .b-button_caption{color:rgba(78,128,189,1)}.b-license_form{background-color:rgba(33,33,33,1)}.b-header_expand_top_panel.js-active{background-color:rgba(22,22,22,1)}.b-top_panel-content{background:rgba(22,22,22,1);border:1px solid rgba(66,66,66,1)}.b-panel-menu{border-bottom:1px solid rgba(66,66,66,1);border-top:1px solid rgba(66,66,66,1)}.b-subsites-list a,.b-top_panel_user_info,.b-top_panel_user_menu a.b-fui_icon_button i{color:rgba(160,160,160,1)}.b-header_nav_user_menu{border-bottom:1px solid #d1d0d0;background-color:rgba(33,33,33,1)}.b-header_nav_user_menu a{color:rgba(190,190,190,1)}.b-header_nav_user_menu a:hover{color:rgba(0,0,154,1)}.b-votes_popup,.b-weights_popup{background:rgba(33,33,33,1);border:solid 1px rgba(66,66,66,1);box-shadow:1px 1px 3px rgba(0,0,0,.3)}.b_users_table-cell:first-child{border-right:1px solid rgba(66,66,66,1)}.b_users_table-cell{border-left:none}.b_users_table-subtitle{color:rgba(220,220,220,1)}.b-popup_holder{border:1px solid rgba(66,66,66,1);background-color:rgba(33,33,33,1);box-shadow:1px 1px 3px rgba(0,0,0,.3)}.user-suggest-menu{background-color:rgba(33,33,33,1);border:1px rgba(66,66,66,1) solid}.user-suggest-menu__login{background-color:rgba(33,33,33,1);color:rgba(220,220,220,1)}.user-suggest-menu__login_focus{background:rgba(42,42,42,1);text-decoration:underline}.mine .vote_result{background-color:initial}.b-header_nav_button:hover .b-button .b-svg-icon *,.b-header_nav_button__active .b-button .b-svg-icon *{fill:#acacac}.b-menu_link_text{border-top:1px solid rgba(33,33,33,1)}.b-menu_item_active .b-menu_link{color:rgba(220,220,220,1);border-top:1px solid rgba(66,66,66,1)}.b-menu_link{background-color:rgba(22,22,22,1);border-bottom:1px solid rgba(66,66,66,1)}.l-content .b-settings_highlight_sample .b-form_field label{color:rgba(220,220,220,1)!important}.b-settings_highlight_sample1,.highlight1 .new .comment_inner{background-color:rgba(243,243,243,.1)}.b-settings_highlight_sample2,.highlight2 .new .comment_inner{background-color:rgba(255,214,46,.15)}.b-settings_highlight_sample3,.highlight3 .new .comment_inner{background-color:rgba(255,0,196,.15)}.b-settings_highlight_sample4,.highlight4 .new .comment_inner{border-color:rgba(255,0,0,.5);border-style:dotted;border-width:1px}.comment_inner{padding:5px;outline-offset:-1px;margin-right:1px}.TabContent{border:1px solid rgba(66,66,66,1);background-color:rgba(22,22,22,1)}ul#TabsNav li.active,ul#TabsNav li:hover{background-color:rgba(22,22,22,1);border-bottom:1px solid rgba(66,66,66,1)}ul#TabsNav li.active{border-bottom:1px solid rgba(22,22,22,1)}ul#TabsNav li.active a{color:#acacac}ul#TabsNav li{border:1px solid rgba(66,66,66,1);background-color:rgba(33,33,33,1)}button.b-button__gradient{background:0 0}button.b-button__gradient:before{border-bottom:initial;background:rgba(255,190,0,1)}.b-form_submit{background-color:initial;padding:0;float:left;margin:0 10px 0 0}.b-post_header .l-header-base,.l-adv_page .l-header-base,.space_page .l-header-base{background-color:rgba(0,0,0,1)}.b-new_post{background:rgba(33,33,33,1)}.b-textarea_editor{border:1px solid rgba(66,66,66,1);background-color:rgba(22,22,22,1);border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;border-bottom:initial}.i-form_textarea_pure{color:rgba(220,220,220,1);background:rgba(33,33,33,1);border:1px solid rgba(66,66,66,1);border-radius:0 0 4px 4px;-webkit-border-radius:0 0 4px 4px}.b-textarea_editor a{color:rgba(160,160,160,1)}.b-editor_menu_items_bg{background:0 0}.b-editor_menu_item{background:rgba(120,120,120,1)}.js-file_uploader_item_text{color:rgba(120,120,120,1)}.b-tags_link{color:rgba(120,120,120,1)}.b-post_tags .tag{color:rgba(220,220,220,1);background-color:rgba(66,66,66,1);border-right:1px solid rgba(66,66,66,1);border-bottom:1px solid rgba(66,66,66,1)}.tag{border:1px solid rgba(66,66,66,1);color:rgba(161,161,161,1)}.b-side_menu_item_bg{background:rgba(0,0,0,1)}.b-side_menu_item_arrow{border-left:18px solid rgba(0,0,0,1)}.b-side_menu_item.active a{color:rgba(220,220,220,1)}.b-side_menu_item_plus{color:rgba(220,220,220,1)}.b-draft_time a,.b-drafts_list,.b-new_post_preview_link,.b-post_file_uploader a,.b-profile_stat,.b-side_menu a,.b-user_domains a,.b-user_single_stat,.b-user_vote_weight,.new_subdirty_form .field_desc,.new_subdirty_form .field_url span{color:rgba(161,161,161,1)}.new_subdirty_form label{color:inherit}.b-user_cover-wrap_gray,.b-user_data_wrapper.b-profile_with_user_info{background-color:rgba(24,24,24,1)}.b-space_content_inner,.new_subdirty_content{background:rgba(33,33,33,1)}.new_subdirty_content h1{color:rgba(195,160,100,1);padding:7px 0 12px 0}.b-text_container h3 a{color:rgba(195,160,100,1)}.b-text_container h3 a:hover{color:rgba(165,140,100,1)}.b-bans_list{color:inherit}.b-draft_item h3 a{color:rgba(195,160,100,1)}.b-new_post_footer{background:rgba(22,22,22,1)}.b-new_post_domain{background-color:rgba(22,22,22,1);color:#666}.b-menu__profile .b-menu_link{color:inherit}.b-list_item_url{background-color:inherit;color:rgba(78,128,189,1);padding:0 8px 0 0}.b-item_link,.b-user_name-link{color:rgba(78,128,189,1)}.b-header_expand_top_panel span,.b-header_expand_top_panel:after,.b-header_expand_top_panel:before{background-color:rgba(78,128,189,1)}a{color:rgba(78,128,189,1)}a:hover{color:rgba(62,102,151,1)}.js-subscribe_controls a.b-fui_icon_button_subscribed,a.b-fui_icon_button_subscribe,a.b-fui_icon_button_subscribe:hover{background:rgba(45,85,65,1);color:rgba(33,33,33,1)}.b-popup .b-popup-user_write{height:27px;line-height:27px;border:1px solid rgba(66,66,66,1)}.b-header_blogs a,a.b-link_button{background-color:rgba(78,128,189,1)}.b-header_blogs a:hover{background-color:rgba(62,102,151,1)}.b-menu__profile{margin:10px 0 0 19px}.b-profile_search{padding-left:19px}.b-header_fields_article{color:rgba(24,24,24,1)}.b-menu_item_active .b-menu_link{border-top:1px solid rgba(33,33,33,1)}.post_inbox_page .post h3{color:rgba(220,220,220,1)}.b-comments_controls_new_comment{border:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1);color:rgba(220,220,220,1)}.b-comments_controls_new_comment:hover{border-color:rgba(53,53,53,1);color:rgba(220,220,220,1)}.b-header_nav_user_menu_item a:hover{color:rgba(161,161,161,1)}.b-notification-feed_layout_popup{border:1px solid rgba(66,66,66,1);border-top:none;background:red}.b-notification-item{color:rgba(161,161,161,1);border-bottom:1px solid rgba(66,66,66,1);background:rgba(33,33,33,1)}a.b-notification-item_mention_link{color:rgba(220,220,220,1)!important}a.b-roll__link{color:rgba(161,161,161,1)}.b-notification-feed a,.b-notification-unsubscriptions_popup a{color:rgba(78,128,189,1)}.b-notification-feed_layout_popup .b-notification-item_footer{margin-left:initial}.b-notification-item__unread{background:rgba(24,24,24,1)}.b-notification-feed__footer{background:rgba(0,0,0,1)}.b-notification-feed__footer a{color:rgba(78,128,189,1)!important}.b-notification-feed__footer a:hover{color:rgba(62,102,151,1)!important}.sidebar{border-left:1px dotted rgba(66,66,66,1);background:rgba(33,33,33,1)}.comment.js-highlighted{background-color:rgba(255,0,0,.1)}</style>`;
// Резет-стайл.
var themeDefault = `<style id="themeDefault">.react{color:rgba(36,36,36,1);fill:rgba(36,36,36,1)}.react .w-app{background:rgba(242,242,242,1);background-image:none!important}.react .b-button{color:rgba(255,255,255,1);fill:rgba(255,255,255,1)}.react .b-feed-message__container,.react .p-ban-list__sidebar-info,.react .p-post-archive__calendar-container,.react .p-post-archive__sidebar-info,.react .p-post-tag__sidebar-info{background:rgba(255,255,255,1)}.react .p-ban-list__header{color:rgba(193,192,192,1)}.react .p-ban-list__table{border:1px solid rgba(207,207,207,1);background:rgba(255,255,255,1)}.react .p-ban-list__table-header{background:rgba(193,192,192,1);color:rgba(255,255,255,1);border-left:1px solid rgba(255,255,255,1);border-right:1px solid rgba(255,255,255,1)}.react .p-ban-list__table-row:nth-child(odd) .p-ban-list__table-cell{border-left:1px solid rgba(192,192,192,1);border-right:1px solid rgba(192,192,192,1)}.react .p-ban-list__table-row:nth-child(2n) .p-ban-list__table-cell{background:rgba(192,192,192,1);border-left:1px solid rgba(255,255,255,1);border-right:1px solid rgba(255,255,255,1)}.react .p-ban-list__reason_empty{color:rgba(193,192,192,1)}.react .b-link_color_blue,.react .x-ugc a{color:rgba(78,128,189,1);fill:rgba(78,128,189,1)}.react .b-link_color_blue:hover,.react .x-ugc a:hover{color:rgba(62,102,151,1)}.react .b-action_color_blue{color:rgba(78,128,189,1);fill:rgba(78,128,189,1)}.react .b-action_color_blue:hover{color:rgba(62,102,151,1)}.react .b-action_color_textgrey,.react .b-link_color_textgrey,.react .b-user-login_color_textgrey{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .b-user-login_color_textgrey:hover{color:rgba(129,129,129,1)}.react .b-button.b-button_mode_icon.b-button_color_textgrey,.react .b-comment__fold-icon,.react .b-comment__footer,.react .b-post-footer,.react .b-select__label,.react .p-post-item__sidebar-domain{color:rgba(161,161,161,1)}.react .b-sidebar-footer__section_name_mail{color:rgba(161,161,161,1)}.react .b-sidebar-footer__section_name_additional,.react .b-sidebar-footer__section_name_mail,.react .b-sidebar-footer__section_name_personal{border-bottom:1px solid rgba(231,231,231,1)}.react .b-base-sidebar__post-list,.react .b-domain-info,.react .b-post-cut,.react .p-post-item__layout,.react .p-post-item__post-list{border:1px solid rgba(231,231,231,1);background:rgba(255,255,255,1)}.react .s-menu__button-user-login{color:rgba(78,128,189,1)}.react .b-comment_unread_true.b-comment_mode_default.b-comment_folded_false>.b-comment__body{background:rgba(244,244,242,1)}.react .s-menu__avatar,.react .s-menu__button-user-avatar{background-color:rgba(244,244,242,1)}.react .s-menu__popup{background:rgba(246,246,245,1)}.react .b-tag,.react .s-menu__domain-list{background:rgba(255,255,255,1)}.react .b-post-meta_mode_default .b-post-meta__tag{color:rgba(78,128,189,1);fill:rgba(78,128,189,1)}.react .b-post-meta_mode_default .b-post-meta__tag:hover{color:rgba(62,102,151,1)}.react .b-tag_mode_text{border:none!important}.react .b-link_mode_text{color:inherit}.react .b-link_mode_text:hover{color:inherit}.react .p-post-item__sidebar{background:initial}.react .b-search,.react .b-tag{border:1px solid rgba(231,231,231,1)}.react .b-link_color_black,.react .b-radio_mode_tab,.react .b-user-login_color_black{color:rgba(36,36,36,1);fill:rgba(36,36,36,1)}.react .b-link_color_black:hover,.react .b-radio_mode_tab:hover,.react .b-user-login_color_black{color:rgba(29,29,29,1)}.react .b-rating__value,.react .b-rating_vote-sign_minus .b-rating__button_sign_minus,.react .b-rating_vote-sign_plus .b-rating__button_sign_plus{color:rgba(78,128,189,1)}.react .b-rating__button{color:rgba(208,208,208,1)}.react .b-rating__button:hover{color:rgba(78,128,189,1)}.react .b-rating_vote-sign_zero .b-rating__value,.react .b-search__toggle-button{color:rgba(36,36,36,1)}.react .b-karma:hover .b-karma__vote-button{color:rgba(208,208,208,1)}.react .b-karma:hover .b-karma__vote-button:hover{color:rgba(78,128,189,1)}.react .b-karma_vote-count_0 .b-karma__value{color:rgba(36,36,36,1)}.react .b-karma_vote-count_1.b-karma_vote-sign_minus .b-karma__vote-button_m1,.react .b-karma_vote-count_1.b-karma_vote-sign_plus .b-karma__vote-button_p1,.react .b-karma_vote-count_2.b-karma_vote-sign_minus .b-karma__vote-button_m1,.react .b-karma_vote-count_2.b-karma_vote-sign_minus .b-karma__vote-button_m2,.react .b-karma_vote-count_2.b-karma_vote-sign_plus .b-karma__vote-button_p1,.react .b-karma_vote-count_2.b-karma_vote-sign_plus .b-karma__vote-button_p2{color:rgba(78,128,189,1)}.react .b-karma__vote-button{color:transparent}.react .b-karma__vote-button:hover{color:rgba(78,128,189,1)}.react .b-karma__vote-button_m1,.react .b-karma__vote-button_p1{color:rgba(208,208,208,1)}.react .b-karma__value{color:rgba(78,128,189,1)}.react .b-search_opened_true .b-search__toggle-button{color:rgba(29,29,29,1)}.react .b-input__input:focus{color:rgba(36,36,36,1)}.react .b-input__input{background:rgba(255,255,255,1);color:rgba(161,161,161,1)}.react .b-number-counter{background:rgba(204,51,51,1);color:rgba(255,255,255,1)}.react .b-domain-author-list__rating,.react .b-domain-government__item,.react .b-extensible,.react .b-sidebar-post__rating,.react .b-subscription__counter,.react .b-user-counter{color:rgba(161,161,161,1)}.react .b-sidebar-post__background:before{background:rgba(36,36,36,.5)}.react .b-button_mode_default.b-button_color_white.b-button_disabled_true{color:rgba(146,146,146,1)}.react .s-domain-toolbar{background:rgba(255,255,255,1)}.react .s-domain-toolbar__button_disabled_true{background:rgba(0,0,0,0);color:rgba(161,161,161,1)}.react .p-post-item__menu-section .b-radio__label,.react .s-domain-toolbar__button{color:rgba(161,161,161,1);fill:rgba(161,161,161,1)}.react .b-radio-group_mode_tab .b-radio-group__underline{background:rgba(36,36,36,1)}.react .p-post-item__menu-section.b-radio_checked_true .b-radio__label{color:rgba(78,128,189,1)!important}.react .s-footer{background:rgba(244,244,242,1);color:rgba(161,161,161,1)}.react .b-sidebar-footer__fixed-container,.react .b-sidebar-footer__section_name_personal{background:rgba(246,246,245,1)}.react .b-sidebar-footer__movable-container{background:rgba(255,255,255,1)}.react .b-sidebar-footer__age{color:rgba(204,51,51,1)}.react .b-random-banner:after{border-left:2px dashed rgba(242,241,237,1)}.react .b-button.b-button_mode_default.b-button_color_blue{border:1px solid rgba(78,128,189,1);background:rgba(78,128,189,1)}.react .b-button.b-button_mode_default.b-button_color_blue:hover:not(.b-button_disabled_true){background-color:rgba(62,102,151,1);border-color:rgba(62,102,151,1)}.react .b-button.b-button_mode_default.b-button_color_green{border:1px solid rgba(41,196,132,1);background:rgba(41,196,132,1)}.react .b-button.b-button_mode_default.b-button_color_green:hover:not(.b-button_disabled_true){background-color:rgba(33,157,106,1);border-color:rgba(33,157,106,1)}.react .b-button.b-button_mode_default.b-button_color_white-textgrey{border:1px solid rgba(208,208,208,1);background:rgba(208,208,208,1)}.react .b-button.b-button_mode_default.b-button_color_white-textgrey:hover:not(.b-button_disabled_true){background-color:rgba(166,166,166,1);border-color:rgba(166,166,166,1)}.react .b-button.b-button_mode_default.b-button_color_red{border:1px solid rgba(255,0,0,1);background:rgba(255,0,0,1)}.react .b-button.b-button_mode_default.b-button_color_red:hover:not(.b-button_disabled_true){background-color:rgba(204,0,0,1);border-color:rgba(204,0,0,1)}.react .b-button.b-button_mode_default.b-button_color_yellow{border:1px solid rgba(236,179,50,1);background:rgba(236,179,50,1)}.react .b-button.b-button_mode_default.b-button_color_yellow:hover:not(.b-button_disabled_true){background-color:rgba(189,143,40,1);border-color:rgba(189,143,40,1)}.react .b-button_mode_default.b-button_color_white{background:rgba(255,255,255,1);color:rgba(36,36,36,1)}.react .b-button_mode_default.b-button_color_white:hover:not(.b-button_disabled_true){border-color:rgba(185,185,185,1)}.react .b-button_mode_default.b-button_color_snowgrey{border:1px solid rgba(244,244,242,1);background:rgba(244,244,242,1);color:rgba(161,161,161,1)}.react .b-button_mode_default.b-button_color_snowgrey:hover:not(.b-button_disabled_true){border-color:rgba(195,195,194,1)}.react .s-footer__app-button{border:1px solid rgba(231,231,231,1)!important}.react .s-footer__app-button:hover{border-color:rgba(185,185,185,1)!important}.react .b-post-link_opened_true .b-post-link__icon{background:rgba(78,128,189,1);color:rgba(255,255,255,1)}.react .b-wysiwyg__toolbar{border:1px solid rgba(231,231,231,1);background:rgba(244,244,242,1)}.react .b-wysiwyg__editor{border:1px solid rgba(231,231,231,1);background:rgba(255,255,255,1)}.react .b-select__option:hover,.react .b-select__option_focused_true{color:rgba(78,128,189,1);background:rgba(244,244,242,1)}.react .b-post-cut__gallery-image{border:2px solid #fff}.react .b-post__sharing{display:none}.react .b-rating-popup__value{color:rgba(36,36,36,1)}.react .b-rating-popup__menu-item:hover{color:rgba(78,128,189,1)}.react .b-rating-popup_section_plus .b-rating-popup__menu-item_section_plus{color:rgba(78,128,189,1)}.react .b-rating-popup_section_minus .b-rating-popup__menu-item_section_minus{color:rgba(78,128,189,1)}.react .b-comment-toolbar__menu_for_sharing .b-context-menu__container{background:rgba(246,246,245,1)}.react .b-context-menu_direction_bottom:before{border-bottom-color:rgba(231,231,231,1)}.react .b-context-menu_direction_bottom:after{border-bottom-color:rgba(255,255,255,1)}.react .b-alert,.react .b-context-menu__container,.react .b-domain-popup,.react .b-rating-popup,.react .b-select__menu,.react .b-user-popup,.react .s-domain-toolbar{border:1px solid rgba(231,231,231,1);background:rgba(255,255,255,1);-webkit-box-shadow:0 2px 2px rgba(36,36,36,.25);box-shadow:0 2px 2px rgba(36,36,36,.25)}.react .b-user-popup__location,.react .b-user-popup__note-text{color:rgba(193,192,192,1)}.react .b-tooltip{border:1px solid rgba(255,255,255,1);background:rgba(234,234,234,1);-webkit-box-shadow:0 2px 2px rgba(36,36,36,.25);box-shadow:0 2px 2px rgba(36,36,36,.25);color:rgba(36,36,36,1)}.react .b-tooltip:after,.react .b-tooltip:before{border:10px solid transparent}.react .b-tooltip_position_top:before{border-top-color:rgba(255,255,255,1)}.react .b-tooltip_position_top:after{border-top-color:rgba(234,234,234,1)}.react .b-tooltip_position_left:before{border-left-color:rgba(255,255,255,1)}.react .b-tooltip_position_left:after{border-left-color:rgba(234,234,234,1)}.react .b-tooltip_position_bottom:before{border-bottom-color:rgba(255,255,255,1)}.react .b-tooltip_position_bottom:after{border-bottom-color:rgba(234,234,234,1)}.react .b-tooltip_position_right:before{border-right-color:rgba(255,255,255,1)}.react .b-tooltip_position_right:after{border-right-color:rgba(234,234,234,1)}.react .x-ugc .irony,.react .x-ugc del,.react .x-ugc font[color="#F00"],.react .x-ugc font[color="#FF0000"],.react .x-ugc font[color="#f00"],.react .x-ugc font[color="#ff0000"],.react .x-ugc font[color=RED],.react .x-ugc font[color=red],.react .x-ugc irony,.react .x-ugc s,.react .x-ugc strike{color:red}.react .b-post-header_mode_image-header .b-post-header__container:before,.react .b-post-header_mode_image-title .b-post-header__container:before{background:0 0}</style>`;

// ПЕРЕМЕННЫЕ:
var fullComments = null;

// БАЗОВЫЕ
var hostname = window.location.hostname;
var subdomain = null;
var uri = null;
var path = null;
var post_id = null;

function d3ParseURL() {
	hostname = window.location.hostname;
	var sub = window.location.hostname.split('.');
	subdomain = (sub.length === 3) ? sub[0] : '';
	uri = decodeURI(window.location.pathname);
	path = window.location.pathname.split('/').filter(element => element !== '');
	if(path[0]) {
		var where = path[0].split('-').pop();
		post_id = !isNaN(where) ? +where : null;
	}
}
d3ParseURL();

/* Получение текущего URL */
var currentURL = '';
var startURL = window.location.href;
var timerCheckURI = setTimeout(
	function chk(currentURL) {
		if(currentURL != window.location.href){
			d3ParseURL();
		}
		currentURL = window.location.href;
		timerCheckURI = setTimeout(chk, 500, currentURL);
	}, 500, startURL);

var user = null;
var siteType = null;
// ПРОВЕРКА ФАКТА АВТОРИЗАЦИИ, КАК ТАКОВОГО ... может надёжнее провернуть вместе с парсингом URL? -	var siteType = 'old';
if (typeof unsafeWindow.globals !== 'undefined') {
	user = unsafeWindow.globals.user;
	siteType = 'old';
} else if (typeof unsafeWindow.entryStorages !== 'undefined') {
	user = unsafeWindow.entryStorages.WApp.user;
	siteType = 'new';
}

//** COOKIES. Храним настройки в куках [максимум ? 4096 байт]. // Первоначальные настройки
var set = {expires:365, path:'/', domain:'d3.ru',secure:true}
if ( !Cookies.get('setTings') ) {
	var сookies = {
		hideMinusPost: 'on',
		hideIgnoredComment: 'root', // all
	};
	Cookies.set('setTings', JSON.stringify(сookies), set);
}
// Читаем текущие Cookies
var сookies = JSON.parse(Cookies.get('setTings'));
// Отдельный Cookies для ID инбокса сохранённых комментов
var inboxSaveCommentsID = Cookies.get('saveComments') ? Cookies.get('saveComments') : null;

// Hello, World!
console.log(`\n                 .      .   \n     ***       .  .:::.     \n    (o o)        :(o o):  . \nooO--(_)--Ooo-ooO--(_)--Ooo-\n\n`);
$(document)
	.contents()
	.filter(function(){ return this.nodeType == 8; })
	.replaceWith(`<!--\n                 .      .                    _     _         |"|           !!!      \n     ***       .  .:::.         ()_()      o' \,=./ \`o       _|_|_       \`  _ _  '   \n    (o o)        :(o o):  .     (o o)         (o o)         (o o)      -  (OXO)  -  \nooO--(_)--Ooo-ooO--(_)--Ooo-ooO--\`o'--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-ooO--(_)--Ooo-\n\n-->`);

// ADD MY CSS #darkTheme
waitForKeyElements ('head [id^="loader~//d3.ru/static/cache/PPost"]:last, head [id^="loader~//d3.ru/static/cache/PFavouriteList"]:last, head [id^="loader~//d3.ru/static/cache/PThingList"]:last, head [id^="loader~//d3.ru/static/cache/PBanList"]:last, head [id^="loader~//d3.ru/static/cache/PModerationList"]:last', editHead);
function editHead() {
	if (typeof сookies.killDesigner !== 'undefined' || typeof сookies.darkTheme !== 'undefined') {
		unsafeWindow.entryStorages.WApp.domain.backgroundImage = {url: null, repeat: null, positionX: null, positionY: null};
	}
	if (typeof сookies.killDesigner !== 'undefined') {
		$('head').append(themeDefault);
		//$('#overlay').hide(); // проще и быстрее скрыть, но нужно ли?
	}
	if (typeof сookies.darkTheme !== 'undefined') {
		$('head').append(darkTheme);
	}
}

// ADD MY CSS #darkThemeOldSite
waitForKeyElements ('head [src^="https://d3.ru/static/cache/"]:last', editHeadOld);
function editHeadOld() {
	if (typeof сookies.darkTheme !== 'undefined') {
		$('head').append(darkThemeOldSite);
	}
}

// HEADER. Заголовочная часть и его модификация.
waitForKeyElements ('.w-app__header , .l-header', d3Header);
function d3Header() {
	$('.b-header_nav_button__create .b-button_caption').text('Новый пост');
	var searchRUN = $('<span class="b-icon b-icon_size_20 search-RUN"><svg class="b-icon__svg run" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-arrow"></use></svg></span>');
	$('.b-search__input').after(searchRUN);

	$(document).on('mousedown', '.search-RUN', function() {
		var value = $('.b-input__input').val();
		var query = (value === '') ? 'https://d3.ru/search/' : 'https://d3.ru/search/?query='+value ;
		$(document).one('mouseout', '.search-RUN', function() {
			window.open(query);
		});
	});
	if (!user) {
		$('.s-header__o-auth').after('<a href="//d3.ru/my/settings/" class="b-action b-action_color_blue b-action_underline_true b-action_size_m s-header__auth-action">Настройки</a><span class="s-header__auth-delimeter">|</span>')
	}
}

//** ФОРМИРОВАНИЕ МЕНЮ настроек - ДОДУМАТЬ!
if ( path !== null && path[1] === 'settings' ) {
	var extmenu = $(`
			<div class="ExtMenu">
			<ul id="TabsNav">
				<li><a href="#Tab1">Стандартные</a></li>
				<li><a href="#Tab2"><svg class="b-svg-icon" style="width: 14px; height: 14px; vertical-align: middle;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-wrench"></use></svg> Продвинутые</a></li>
				<li><a href="#Tab3">Дополнения</a></li>
			</ul>
			<div id="TabsContent">
				<div id="Tab1" class="TabContent">
					<h3>&laquo;Восьми настроек должно быть достаточно для каждого&raquo;. Йован</h3>
				</div>
				<div id="Tab2" class="TabContent">
					<h2>Базовые настройки, исправления, дополнения и всякая всячина. Гитлер.)</h2>
					<p>Починяю дороги, восстанавливаю экономику, насаждаю демократию, развязываю войны. СЧАСТЬЕ ДЛЯ ВСЕХ...</p>
				</div>
				<div id="Tab3" class="TabContent"></div>
			</div>
			</div>
		`);
	// добавление меню
	$('.b-menu_item_active > [href="/my/settings/"]').closest('.l-i-content_main').find('.b-menu').after(extmenu);
	// перенос стандартного меню внутрь первого TAB
	$('#Tab1').append( $('form#js-edit_settings_form') );
	/* ... */
	var $HP = $("<div/>", {class:'SetTings'});
	$HP.append( $("<div/>", {class:'description'}).html('Настройка подписей под комментариями и постами') );
	$HP.append( $("<input/>", {type:'checkbox',id:'hide_piss',name:'hidePiss',}) );
	$HP.append( $("<label>", {for:'hide_piss',text:'скрывать оПисавшихся - "Написал/а"',}) );
	$HP.append('<br>');
	$HP.append( $("<input/>", {type:'checkbox',id:'color_gender',name:'colorGender',}) );
	$HP.append( $("<label>", {for:'color_gender',text:'цветовая дифференциация яиц',}) );
	$HP.append('<br>');
	$HP.append( $("<input/>", {type:'checkbox',id:'hide_rank',name:'hideRank',}) );
	$HP.append( $("<label>", {for:'hide_rank',text:'скрыть школолошные разноцветные подписи-ранги',}) );
	$HP.append('<br>');
	extmenu.find('#Tab2').append($HP);
	/* убрать из анонимного меню */
	if (user) {
		var $HIC = $("<div/>", {class:'SetTings'});
		$HIC.append( $("<div/>", {class:'description'}).html('Здесь можно выбрать способ сокрытия комментариев от заигнорированных пользователей') );
		$HIC.append( $("<input/>", {type:'radio',id:'hide_default',name:'hideIgnoredComment',value:'default'}) );
		$HIC.append( $("<label>", {for:'hide_default',text:'Отображать как и прежде — как Йован повелел',}) );
		$HIC.append('<br>');
		$HIC.append( $("<input/>", {type:'radio',id:'hide_root',name:'hideIgnoredComment',value:'root'}) );
		$HIC.append( $("<label>", {for:'hide_root',text:'Скрыть только одиночные, те, что не содержат диалогов'}) );
		$HIC.append('<br>');
		$HIC.append( $("<input/>", {type:'radio',id:'hide_all',name:'hideIgnoredComment',value:'all' }) );
		$HIC.append( $("<label>", {for:'hide_all',text:'Ломай меня полностью. Скрыть все вместе с ветками участников',}) );
		$HIC.append('<br>');
		extmenu.find('#Tab2').append($HIC);
	}
	/* ... https://partners.d3.ru/ advertising ?сделать возможность один разу увидеть	*/
	var $HPM = $("<div/>", {class:'SetTings'});
	$HPM.append( $("<div/>", {class:'description'}).html('Скрывать назойливые партнёрские материалы.') );
	$HPM.append( $("<input/>", {type:'checkbox',id:'hide_partners_forever',name:'hidePartnersAdvertising',}) );
	$HPM.append( $("<label>", {for:'hide_partners_forever',text:'Уберите от меня это злоебучее партнёрское безобразие (отнять мороженку у @Enze и сделать больно Йовану.) ',}) );
	$HPM.append('<br>');
	extmenu.find('#Tab2').append($HPM);
	/* убийство гореДизайнеров killDesigner */
	var $KD = $("<div/>", {class:'SetTings'});
	$KD.append( $("<div/>", {class:'description'}).html('Дефалтный дизайн для всех поддоменов') );
	$KD.append( $("<input/>", {type:'checkbox',id:'kill_designer',name:'killDesigner',}) );
	$KD.append( $("<label>", {for:'kill_designer',text:'Я убью вас: шериф, лодочник, дизайнер,.. Вернуть всё взад: сделать всё стандартно-унылым!',}) );
	$KD.append('<br>');
	extmenu.find('#Tab2').append($KD);
	/* тёмная тема */
	var $HPD = $("<div/>", {class:'SetTings'});
	$HPD.append( $("<div/>", {class:'description'}).html('Дело ясное, что дело тёмное.') );
	$HPD.append( $("<input/>", {type:'checkbox',id:'dark_theme',name:'darkTheme',}) );
	$HPD.append( $("<label>", {for:'dark_theme',text:'Тьма, пришедшая со Средиземного моря, накрыла ненавидимый прокуратором город...',}) );
	$HPD.append('<br>');
	extmenu.find('#Tab2').append($HPD);
	/* якорная навигация */
	var $AN = $("<div/>", {class:'SetTings'});
	$AN.append( $("<div/>", {class:'description'}).html('Якорная навигация для комментариев') );
	$AN.append( $("<input/>", {type:'checkbox',id:'anchor_navigation',name:'anchorNavigation',}) );
	$AN.append( $("<label>", {for:'anchor_navigation',text:'Якорь мне в жопу...',}) );
	$AN.append('<br>');
	extmenu.find('#Tab2').append($AN);
	/* якорная навигация в инбоксах. убрать настройку из анонимного меню */
	if (user) {
		var $ANI = $("<div/>", {class:'SetTings'});
		$ANI.append( $("<div/>", {class:'description'}).html('Хочу такую же красивую якорную навигацию в инбоксах, как и для комментариев, а не ту вот что сейчас') );
		$ANI.append( $("<input/>", {type:'checkbox',id:'anchor_navigation_inbox',name:'anchorNavigationInbox',}) );
		$ANI.append( $("<label>", {for:'anchor_navigation_inbox',text:'Якорь в жопу всем интимно-близким',}) );
		$ANI.append('<br>');
		extmenu.find('#Tab2').append($ANI);
	}
	/* показать только в анонимном меню */
	if (!user) {
		var $CS = $("<div/>", {class:'SetTings'});
		$CS.append( $("<div/>", {class:'description'}).html('Сортировка комментариев по умолчанию по дате для <b>анон</b>истов.') );
		$CS.append( $("<input/>", {type:'checkbox',id:'comments_sorting',name:'commentsSorting',}) );
		$CS.append( $("<label>", {for:'comments_sorting',text:'Вопреки Йованной фантазии',}) );
		$CS.append('<br>');
		extmenu.find('#Tab2').append($CS);
	}
	/* Рейтинг 1488 */
	if (user) {
		var $PR = $("<div/>", {class:'SetTings'});
		$PR.append( $("<div/>", {class:'description'}).html('Своя голова на плечах. Не отображать рейтинг:') );
		$PR.append( $("<input/>", {type:'checkbox',id:'post_rating',name:'myPostRating',}) );
		$PR.append( $("<label>", {for:'post_rating',text:'поста до выставления оценки',}) );
		$PR.append('<br>');
		extmenu.find('#Tab2').append($PR);
	}
	/* ... */
	if (user) {
		var $HMP = $("<div/>", {class:'SetTings'});
		$HMP.append( $("<div/>", {class:'description'}).html('С глаз долой из сердца вон') );
		$HMP.append( $("<input/>", {type:'checkbox',id:'hide_minus_post',name:'hideMinusPost',}) );
		$HMP.append( $("<label>", {for:'hide_minus_post',text:'скрывать заминусованные лично вами посты',}) );
		$HMP.append('<br>');
		extmenu.find('#Tab2').append($HMP);
	}
	/* Это должно быть в качестве аддонов form ? */
	var $SCForm = $('<form class="saveComments" method="post"></form>');
	$SCForm.append( $("<div/>", {class:'description'}).html('<h2>А губа не треснет?</h2><p>Нет почти ничего невозможного, что нельзя было бы... да взять хотя бы сохранение комментариев</p><br>') );
	$SCForm.append( $("<label>", {for:'save_comments',text:'Сохранять в инбокс id: ',}) );
	$SCForm.append( $("<input/>", {type:'text',id:'save_comments',name:'saveComments',autocomplete:'off',}) );
	$SCForm.append( $("<button/>", {type:'button',text:'ОК',}) ); // type:'submit'
	$SCForm.append('<br>');
	$SCForm.append('<br>');
	extmenu.find('#Tab3').append($SCForm);

	// заполняем кукой c ID инбокса
	$('.saveComments input').val(inboxSaveCommentsID);

	$(document).on('click', '.saveComments button', function(e) {
		inboxSaveCommentsID = $('.saveComments input').val();
		Cookies.set('saveComments', inboxSaveCommentsID, set);
		// добавить ? проверку
		$('.Close').click();
	});

	// ПОВТОРЯЮЩИЙСЯ КОД - I работа с кукисами
	$.each( сookies, function( name, value ) {
		if (value === 'on') {
			$(`[name="${name}"]`).attr('checked','');
		} else {
			$(`[name="${name}"][value="${value}"]`).attr('checked','');
		}
	});
	// визуализация меню
	$('#TabsNav li:first-child').addClass('active');
	$('.TabContent').hide();
	$('.TabContent:first').show();
	$('#TabsNav li').click(function(){
		$('#TabsNav li').removeClass('active');
		$(this).addClass('active');
		$('.TabContent').hide();
		var activeTab = $(this).find('a').attr('href');
		$(activeTab).fadeIn();
		return false;
	});
	// Эррогирование - Запись в кукисы
	$('.ExtMenu [type="checkbox"], .ExtMenu [type="radio"]').on('change', function () {
		name = $(this).attr('name');
		value = $(this).val();
		if (!this.checked) {
			delete сookies[name];
		} else {
			сookies[name] = value;
		}
		Cookies.set('setTings', JSON.stringify(сookies), set);
	});
	// ДОБАВЛЯЕМ МЕНЮ НАСТРОЕК В КОНТЕНТ НА СЛУЧАЙ АНОНИЗМА
	waitForKeyElements ('.b-layout__content', newSettings);
	function newSettings() {
		// без этого условия проглючивает? в !анонимном режиме.
		if ( $('.w-app__content .p-error').length === 1 ) {
			$('.p-error__container').remove();
			$('.b-layout__left').append('&nbsp;');
			// добавляем меню
			$('.b-layout__content').append(extmenu);
			// удаляем первую вкладку за ненадобностью
			$('#TabsNav li:first').remove()
			$('#TabsContent #Tab1').remove()
			$('#TabsNav li:last').remove()
			$('#TabsContent #Tab3').remove()
			$('.ExtMenu').css('padding','11px 20px 20px 11px')

			// ПОВТОРЯЮЩИЙСЯ КОД II	работа с кукисами
			$.each( сookies, function( name, value ) {
				if (value === 'on') {
					$(`[name="${name}"]`).attr('checked','');
				} else {
					$(`[name="${name}"][value="${value}"]`).attr('checked','');
				}
			});
			// визуализация меню
			$('#TabsNav li:first-child').addClass('active');
			$('.TabContent').hide();
			$('.TabContent:first').show();
			$('#TabsNav li').click(function(){
				$('#TabsNav li').removeClass('active');
				$(this).addClass('active');
				$('.TabContent').hide();
				var activeTab = $(this).find('a').attr('href');
				$(activeTab).fadeIn();
				return false;
			});
			// Эррогирование -- Запись в кукисы настройки
			$('.ExtMenu [type="checkbox"], .ExtMenu [type="radio"]').on('change', function () {
				name = $(this).attr('name');
				value = $(this).val();
				if (!this.checked) {
					delete сookies[name];
				} else {
					сookies[name] = value;
				}
				Cookies.set('setTings', JSON.stringify(сookies), set);
			});

		}
	}
}

// ******* ЛЕНТА ('.p-post-list__layout') ******* //
//-- ЛЕВЫЙ/ПРАВЫЙ САЙДБАР В ЛЕНТЕ... aside.b-layout__left / aside.b-layout__right не задействован .p-post-list__layout .b-layout__right
waitForKeyElements ('.p-post-list__layout .b-layout__left', asideFeed);
function asideFeed() {
	var gold_ass = [
		'https://cdn.jpg.wtf/futurico/1b/3a/1579429380-1b3a16050f8a1af04d16c86f6b292cca.png',
	];
	var key = Math.floor(Math.random() * (gold_ass.length) );
	gold_ass = gold_ass[key];
	$('.b-base-banner__gold > img').attr('src',gold_ass);
	$('[data-uid="placeholder-margin-top"]').hide();
}

//-- ОТЛОВ ПОСТОВ В ЛЕНТЕ и действия над ними
waitForKeyElements ('.b-post-cut', allPostsFeed);
function allPostsFeed(post) {
	// ПОЛУЧЕНИЕ И ПРОСТАНОВКА РЕАЛЬНЫХ ID в [data-id] из URL. Нужна ли как функция?!
	var href = post.find('.b-post-title__link').attr('href');
	// получить ID
	var id = document.createElement("a");
	id.href = href;
	var name = id.pathname.split('/').filter(element => element !== '');
	var post_id = name[0].split('-').pop();
	post.attr('data-id', post_id);
	// скрывать партнёрки? + показывать лишь один раз.
	if (typeof сookies.hidePartnersAdvertising !== 'undefined' && post.hasClass('b-post-cut_ad_true')) {
		post.hide();
	}
	// сами с усами. скрывать рейтинг поста до того момента пока я его сам не проставлю
	if (typeof сookies.myPostRating !== 'undefined' && post.find('.b-rating_vote-sign_zero').length === 1) {
		post.find('.b-rating_vote-sign_zero .b-rating__value').hide();
		$(document).on('click', '.b-post-footer__rating', function(e) {
			if ( $(this).hasClass('b-rating_vote-sign_zero') ) {
				$(this).find('.b-rating__value').show();
				// и заблокировать ? изменения!
				$(this).find('.b-rating__button_sign_plus, .b-rating__button_sign_minus').hide(500);
			}
		});
	}
	// разукрашиваем сиськи-письки
	if (typeof сookies.colorGender !== 'undefined') {
		var gender = (post.find('.b-post-footer__user-label').text() == 'Написала' ) ? 'Female' : 'Male';
		post.find('.b-post-footer__line').addClass(gender);
	}
	// скрыть Ранги (звания)
	if (typeof сookies.hideRank !== 'undefined') {
		post.find('.b-user-login__rank').hide();
	}
	// скрыть напИсавших
	if (typeof сookies.hidePiss !== 'undefined') {
		post.find('.b-post-footer__user-label').hide();
	}
	// скрыть минусуемое
	if (typeof сookies.hideMinusPost !== 'undefined') {
		post.find('.b-rating_vote-sign_minus').closest('[data-id]').hide();
		$(document).on('click', '.b-rating__button_sign_minus', function(e) {
			if (typeof сookies.hideMinusPost !== 'undefined') {
				$(this).closest('[data-id]').hide(300).attr('data-hide');
			}
		});
	}
	if (typeof сookies.hidePost !== 'undefined') {
		post.find('.b-post-footer__rating').append('<span id="'+post_id+'" class="b-icon b-icon_size_20 b-rating__button b-rating__button_sign_hide"><svg class="b-icon__svg" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-cross"></use></svg></span>');
		$(document).on("click", ".b-rating__button_sign_hide", function(){
			$(this).closest('[data-id]').hide(300);
		});
	}
}

// ******* ТЕКУЩИЙ ПОСТ ('.p-post-item__layout') ******* //
//** ЛЕВЫЙ / ПРАВЫЙ САЙДБАР В ПОСТАХ... aside.b-layout__left / aside.b-layout__right
waitForKeyElements ('aside.b-layout__right > .p-post-item__sidebar', asidePost);
function asidePost() {
	// возможность сокрытия/коллапсирование? правого блока. Можно добавить абсолютное позиционирование.
	$('.p-post-item__layout > aside.b-layout__right').prepend('<span id="myClose">&times;</span>');
	// Сокрытие правого блока по клику в правом верхнем углу.
	$(document).on("click", "#myClose", function(){
		$(this).closest('aside.b-layout__right').hide();
		$('.p-post-item__line').css({'margin-right':'-80px'});
		// исправляем отступ справа в блоке комментариев
		$('.p-post-item__comment-container').css('margin-right', '-60px');
	});
}

//** ТОЛЬКО САМО ТЕЛО ТЕКУЩЕГО ПОСТА
waitForKeyElements ('.p-post-item__post', ItemPost);
function ItemPost(itemPost) {
	// получить все! комментарии к посту
	$('#fullCommentsJson').remove();
	getFullComments( entryStorages.PPostItem.post.id );
	// скрываем видеорекламный блок из комментариев.
	$('.p-post-item__video-ad').hide();
	// скрывать рейтинг до выставления оценки + (скрыть плюс-минус?). +"настройка не для анонистов"
	if (typeof сookies.myPostRating !== 'undefined') {
		itemPost.find('.b-rating_vote-sign_zero .b-rating__value').hide();
	}
	if (typeof сookies.myPostRating !== 'undefined' && itemPost.find('.b-rating_vote-sign_zero').length === 0 ) {
		itemPost.find('.b-rating__button_sign_plus, .b-rating__button_sign_minus').hide();
	}
	// сиськи/письки
	if (typeof сookies.colorGender !== 'undefined') {
		var gender = (itemPost.find('.b-post-footer__user-label').text() == 'Написала' ) ? 'Female' : 'Male';
		itemPost.find('.b-post-footer__line').addClass(gender);
	}
	// + скрыть напИсавших
	if (typeof сookies.hidePiss !== 'undefined') {
		itemPost.find('.b-post-footer__user-label').hide();
	}
	// скрыть Ранги (звания)
	if (typeof сookies.hideRank !== 'undefined') {
		itemPost.find('.b-user-login__rank').hide();
	}
}

//** КОММЕНТАРИИ К ПОСТАМ
waitForKeyElements (".b-comment__comment", showPostAndComments);
function showPostAndComments(comment) {
	// сиськи/письки -- разукрасить яйцЫ.
	if (typeof сookies.colorGender !== 'undefined') {
		var gender = (comment.find('.b-comment__user-label:first:first').text() == 'Написала' ) ? 'Female' : 'Male';
		comment.find('.b-comment__user-label:first').addClass(gender);
		comment.find('.b-comment__footer .b-user-login__login:first').addClass(gender);
	}
	// скрыть напИсавших
	if (typeof сookies.hidePiss !== 'undefined') {
		comment.find('.b-comment__user-label').hide();
	}
	// скрыть Ранг (звания)
	if (typeof сookies.hideRank !== 'undefined') {
		comment.find('.b-comment__footer .b-user-login__rank:first').hide();
	}
	// II. скрывать игнорируемое полностью
	if (сookies.hideIgnoredComment !== 'default' && comment.hasClass('b-comment_ignored_true') === true) {
		comment.hide();
		// вернуть отображение только тем, что в дереве
		if (сookies.hideIgnoredComment === 'root') {
			comment.has('.b-comment__comment').show();
		}
	}

	// I. "ЯКОРЬ МНЕ В ЖОПУ"...
	// Добавление тулбара для анонимного режима!
	if ($('.s-header__auth-container').is(':visible')) {
		comment.find('.b-comment__button-container:first').after( '<ul class="b-comment-toolbar b-comment__comment-toolbar"></ul>' );
	}
	// Добавление якоря
	if (typeof сookies.anchorNavigation !== 'undefined') {
		var AnonID = comment.parent('.b-comment__comment').attr('id')
		if (AnonID) {
			var Anchor = '<li class="b-comment-toolbar__button-container"><a href="#'+AnonID+'" class="b-icon Anchor UP" style="color:grey;"><svg class="b-icon__svg" style="height: 20px; width: 10px;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-direction"></use></svg></a></li>';
			comment.find('.b-comment__comment-toolbar:first').append(Anchor);
		}
	}
	// SAVE. можно сделать скрытой а вызывать иконку Сейва по даблклику на комментарии /* if (разрешить сохранение).	*/
	if ( Cookies.get('saveComments') ) {
		var Save = '<li class="b-comment-toolbar__button-container"><span class="b-icon Save"><svg class="b-icon__svg" style="height: 20px; width: 10px;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-save"></use></svg></span></li>';
		comment.find('.b-comment-toolbar__button-container_for_sharing:first').after( Save );
	}
}

//** ТУЛБАР ДЛЯ КОММЕНТАРИЕВ
waitForKeyElements ('.p-post-item__toolbar_position_top', CurrentPage);
function CurrentPage(comments) {
	//** АВТОСОРТИРОВКА КОММЕНТАРИЕВ ПО ДАТЕ,.. для анонимного режима
	if (typeof сookies.commentsSorting !== 'undefined' && !user ) {
		$('[data-value="datecreated"]').trigger('click'); //console.log( 'auto=click' );
	}
	// [подсчёт] количества скрытых комментариев к посту и отображение иконки в случае, если включён режим скрытия
	var ignored = entryStorages.PPostItem.comments.filter(item => item.ignored === true);
	if (сookies.hideIgnoredComment !== 'default' && ignored.length !== 0) {
		$('.p-post-item__expand-all-button').before('<div class="b-button b-button_size_m b-button_mode_default b-button_color_white b-button_icon_true b-button_empty_true p-post-item__expand-all-button showHideIgnoredComment"><span class="b-icon b-icon_size_20 b-button__icon" title="'+ignored.length+'"><svg class="b-icon__svg" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-eye"></use></svg></span></div>');
	}
}

// Показать то что скрыто-скрыто )) Вернуть скрытые комментарии
$(document).on('click', '.showHideIgnoredComment', function(e) {
	if ( $('.b-comment__comment').is(':hidden') ) {
		$('.showHideIgnoredComment .b-icon__svg').css('color','rgba(195,160,89,1)');
		$('.b-comment__comment').show();
	}
});

// КЛИК СОХРАНЕНИЯ КОММЕНТАРИЯ - .b-icon.Save
$(document).on("click", '.b-icon.Save', function(){
	//проверка на наличие массива [ПЕРВАЯ ЗАГРУЗКА] в переменной +++ проверку наличия самого массива в head
	if (fullComments === null) {
		fullComments = JSON.parse( $('#fullCommentsJson').html() );
	}
	//? добавить проверку на то, что коммент не удалён.
	var saveCommID = $(this).closest('[data-comment-tag]').attr('id').replace(/b-comment-/,''); //console.log('saveCommID:'+saveCommID);
	// получение fullComments ! сделать функцией? в/через Ajax!!
	var comment = fullComments.comments.find(item => item.id == saveCommID);
	// формирование футера
	var gender = (comment.user.gender === 'male') ? 'Написал' : 'Написала';
	var time = timeConverter(comment.created);
	var href_id = window.location.href.replace(/#\d+$/,'')+'#'+comment.id; // может проще взять из самого комментария?
	/* window.entryStorages.PPostItem.post.domain.prefix */
	var sub = window.location.hostname.split('.');
	subdomain = (sub.length === 3) ? sub[0] : '/'; // древние посты ...лучше? брать за '/' 'dirty'?
	// удалённые пользователи? реализация? без ссылки + додекорирование.
	var href_login = (comment.user.deleted === false) ? `https://d3.ru/user/${comment.user.login}/` : 'https://d3.ru/' ;
	var comment_footer = `<sub><b><u>${gender}</u> <a href="${href_login}">${comment.user.login}</a> \
	<a href="${href_id}">${time}</a> \
	на <a href="https://${hostname}">${subdomain.toUpperCase()}</a> </b></sub>`;
	// формирование тела из comment.body +MY comment_footer
	var elem = $('<div/>').html(comment.body+'<br><br>'+comment_footer);
	var src = elem.find('source').attr('src');
	var data = elem.find('video').replaceWith(src).prevObject.prop('outerHTML'); // для mp4 <video>

	saveComments(data, saveCommID);
});
// AJAX для СОХРАНЕНИЯ КОММЕНТАРИЯ - SaveComment
function saveComments(data, saveCommID) {
	var json = {"body" : data};
	var settings = {
		async: true,
		crossDomain: true,
		url: `https://${hostname}/api/inbox/${inboxSaveCommentsID}/comments/`,
		method: "POST",
		headers: {
			"X-Futuware-UID": Cookies.get('uid', {domain:'d3.ru'}),
			"X-Futuware-SID" : Cookies.get('sid', {domain:'d3.ru'}),
			"Content-Type": "application/json",
		},
		processData: false,
		data: JSON.stringify(json)
	}
	$.ajax(settings).done(function (response) {
		$('#b-comment-'+saveCommID+'>.b-comment__body .Save').css('color','red');
	});
}
// ТОТ САМЫЙ ВОЛШЕНБНЫЙ ИНБОКС.
if ( path !== null && path[2] == inboxSaveCommentsID ) {
	$('.post.selected h3').text('АБРАКДАБРА'); // скрыть удаление!?
	$('.post.selected a').remove();
	$('.b-inbox_controls').hide();
	$('.b-comments_controls_bottom').remove();
	$('.b-comments_controls_sort').remove();
	$('#js-comments_navigation').remove();
	$('.c_footer > .b-button_share').hide();

	waitForKeyElements ('.comment', allSaveComments);
	function allSaveComments(comments) {
		// получить псевдофутер из текста
		var data_footer = comments.find('[itemprop="text"] sub:last b');
		// заполняем новыми данными	// пол (можно добавить цвет)
		var gender = data_footer.find('u').text() ; // :nth-child(1)	console.log( gender );
		comments.find('.c_footer > :nth-child(3)').text(gender);
		// логин и ссылка на автора коммента
		var login = data_footer.find(':nth-child(2)').text();
		var login_href = data_footer.find(':nth-child(2)').attr('href');
		comments.find('.c_footer > .c_user').text(login).attr('href', login_href).removeAttr('data-user_id');
		// .commentindent_0.u87303.mine.b-author_comment.selected [data-user_id] подставить реальные, предварительно выдрав
		comments.find('.c_footer > .b-comment_thread__collapse .b-button_caption').text('Комментарий '+login); // Показать комментарий Hitler
		// время и id-ссылка на сам коммент
		var date = data_footer.find(':nth-child(3)').text();
		var href_id = data_footer.find(':nth-child(3)').attr('href');
		comments.find('.c_footer > .js-date__formatted').text(date).attr('href', href_id).removeAttr('onclick');
		// источник (Блог)
		var subdomain = data_footer.find(':nth-child(4)');
		comments.find('.js-date__formatted').after(subdomain).after('<span class="where">на</span>');
		comments.find('.c_answer').text('заметка');
		// удаление 'псевдофутера' или сокрытие ?
		comments.find('[itemprop="text"] sub:last b').remove(); // удалить и <br> - sub:last
		comments.find('[itemprop="text"] br:last').remove();
	}
}

// ЯКОРНАВИГЕЙШН
$(document).on('click','.b-comment-toolbar__button-container a.Anchor', function (event) {
	//отменяем стандартную обработку нажатия по ссылке
	event.preventDefault();
	//забираем идентификатор бока с атрибута href и //узнаем высоту от начала страницы до блока на который ссылается якорь
	var id = $(this).attr('href'), top = $(id).offset().top;
	$('body,html').animate({scrollTop: top}, 'slow');
	// ++ добавлять пространство для нижних комментариев якорей?
	if ($(this).attr('class') == 'b-icon Anchor DOWN') {
		$(this).closest('li.b-comment-toolbar__button-container').remove();
		// возвращаем серый цвет после перехода обратно
		var discolor = $(this).attr('href');
		$(discolor+' a.Anchor').css({'color':'grey'});
	} else {
		// обесцветить зелёные на случай другого перехода
		$('a.Anchor.UP').css({'color':'grey'});
		$('a.Anchor.DOWN').closest('.b-comment-toolbar__button-container').remove();
		var aID = $(this).closest('.b-comment__comment').attr('id');
		var selectID = $(this).attr('href');
		$(this).css({'color':'green'});
		var Anchor = '<li class="b-comment-toolbar__button-container"><a href="#'+aID+'" class="b-icon Anchor DOWN" style="color:red;transform:scale(1,-1);"><svg class="b-icon__svg" style="height: 20px; width: 10px;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-direction"></use></svg></a></li>';
		$(selectID).find('.b-comment__comment-toolbar:first').append( Anchor );
	}
});

// **************************************************************************
// API. получить все комменты к посту по его ID
function getFullComments(post_id) {
	hostname = window.location.hostname;
	$.ajax({
		dataType: 'json', // dataType: 'jsonp',
		url: `https://${hostname}/api/posts/${post_id}/comments/`,
		async: true,
		crossDomain: true,
		success: function(response) {
			$('head').append('<script id="fullCommentsJson" type="application/json">'+JSON.stringify(response)+'</script>');
			console.log('комментарии подгружены');
			fullComments = JSON.parse( $('#fullCommentsJson').html() );
		}
	});
}

// Получить id скрытого коммента и 'восстановить его'
$(document).on("dblclick", ".b-comment_ignored_true .x-ugc", function(){
	if ( $(this).text() == 'Комментарий скрыт, так как вы игнорируете его автора') {
		var idHideComment = $(this).closest('[data-comment-tag]').attr('id').replace(/b-comment-/,'');
		var comment = fullComments.comments.find(item => item.id == idHideComment);
		$(this).closest('.b-comment__body').addClass('Restore');
		$(this).html(comment.body);
	}
});

// UnixTime to d3Time
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['января','февраля','марта','апреля','мая','июня','июля','авгутся','сентября','октября','ноября','декабря'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = (a.getHours()<10?'0':'') + a.getHours();
	var min = (a.getMinutes()<10?'0':'') + a.getMinutes();
	var sec = (a.getSeconds()<10?'0':'') + a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' в ' + hour + ':' + min;
	return time;
}

// лечение dd-футера в списке инбоксов, инбоксах и профиле пользователя .
waitForKeyElements ('.b-index_posts_holder .post, .comments .comment, .b-text_container .post, .b-text_container .comment', listInbox);
function listInbox(post) {
	var gender = (post.find(".dd:contains('Написала')").length == 1 ) ? 'Female' : 'Male';
	var genderTxt = (gender === 'Female') ? 'Написала' : 'Написал';
	/* сиськи/письки в списке инбоксов*/
	var $dd = $(`<div class="dd new"></div>`);
	if (typeof сookies.hidePiss === 'undefined') {
		$dd.append( `<span class="gender">${genderTxt}&nbsp;</span>` );
	}
	$dd.append( post.find('.dd .c_user') );
	if (typeof сookies.colorGender !== 'undefined') {
		$dd.find('.gender').addClass(gender);
		$dd.find('.c_user').addClass(gender);
	}
	$dd.append( ' · ' );
	$dd.append( post.find('.dd .js-date.js-date__formatted') );
	$dd.append( ' · ' );
	$dd.append( post.find('.dd .b-post_comments_links') );
	$dd.append( post.find('.dd .b-post_my_post_controls') );
	post.find('.dd').replaceWith($dd);
	// Внутри инбокса
	if (typeof сookies.hidePiss !== 'undefined') {
		post.find(".c_footer span:contains('Написал')").hide();
	}
	if (typeof сookies.colorGender !== 'undefined') {
		gender = (post.find(".c_footer span:contains('Написала')").length == 1 ) ? 'Female' : 'Male';
		post.find(".c_footer span:contains('Написал')").addClass(`gender ${gender}`);
		post.find(".c_footer .c_user").addClass(gender);
	}
}

// ЕСЛИ ЭТО ИНБОКС!
if ( path !== null && path[1] === 'inbox' ) {

	if (typeof сookies.anchorNavigationInbox !== 'undefined') {
		$('head').append(`<style id="NewStyleInbox">
			.post_body, .nc_body, .c_body { font-family: inherit !important; }
			body {font-size: 14px; line-height: 20px;}
			.c_footer {font-size: 12px !important;}
			.post_comments_page .post {padding-left: 45px;}
			.comments {padding-left: 0;}
			.post .dd {font-size: 12px;}
		</style>`);
	}
	// замена якорноай навигации для инбоксов
	if (typeof сookies.anchorNavigationInbox !== 'undefined') {
		$.each($('.comment'), function (index, value) {
			var anchhref = $(this).find('a.c_parent').attr('replyto');
			if (typeof anchhref !== 'undefined') {
				$(this).find('a.c_parent').remove();
				$(this).find('.c_footer').append('<a href="#'+anchhref+'" class="b-svg-icon Anchor UP"><svg style="height: 14px; width: 12px;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-arrow-up"></use></svg></a>');
			}
			// сиськи/письки
			if (typeof сookies.colorGender !== 'undefined') {
				var gender = ($(this).find(".c_footer:contains('Написала')").length == 1 ) ? 'Female' : 'Male';
				$(this).find('.c_user').addClass(gender);
			}
		});
		$(document).on('click','.Anchor',function() {
			var id_this = $(this).closest('.comment').attr('id');
			var id_down = $(this).attr('href');
			$('html,body').animate({scrollTop: $( $(this).attr("href") ).offset().top},'fast');
			if ($(this).attr('class') === 'b-svg-icon Anchor DOWN') {
				$(this).remove();
				$(id_down).find('.Anchor').css({'fill':'grey'});
			} else {
				$('a.Anchor.UP').css({'fill':'grey'});
				$('a.Anchor.DOWN').remove();
				$(this).css({'fill':'green'});
				$(id_down).find('.c_footer').append('<a href="#'+id_this+'" class="b-svg-icon Anchor DOWN" style="fill:red;transform:scale(1,-1);"><svg style="height: 14px; width: 12px; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-arrow-up"></use></svg></a>');
			}
		});
	}
}

// Hitler, Hitler, Hitler, Hitler
var joke = ['На ремонт провала','На новый «Вальтер»','На новый d3-Рейх','На ремонт Рейхстага','На новые плюшки'];
var jkey = Math.floor(Math.random() * (joke.length) );
var $donate = '<iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets='+encodeURI(joke[jkey])+'&targets-hint=&default-sum=&button-text=14&hint=&successURL=&quickpay=shop&account=410012544175256" width="100%" height="222" frameborder="0" allowtransparency="true" scrolling="no"></iframe>';

if ( $('.b-user_name-link').text() == 'Hitler' ) {
	console.log( 'Хайлюшки, родной. Не вижу вашей ручки. Где моя зигуленька?' );
	$('.b-info_block').append($donate);
	$('.b-menu_link_text').css({'border-top':'none'});
	$('.b-dude_note').text('орёл, крОсавчег и просто замечательный человек, хотя и... [оригинальный отзыв]');
	$('.b-karma_value').text('1488')
	var myImg = $('<img />',{src:'https://cdn.jpg.wtf/futurico/1b/3a/1579429380-1b3a16050f8a1af04d16c86f6b292cca.png'});
	$('.l-content_column').after('<div class="HH" style="padding-left:260px;padding-top:42px;text-align:center;display:none;"></div>');
	$('.HH').append(myImg);
	var cc = $('.js-karma_controls.left').css('left');
	switch (cc) {
		case '0px':
			cc = -2;
			$('.l-content_column').hide();
			$('.HH').show();
			break;
		case '14px':
			cc = -1;
			break;
		case '25px':
			cc = +1;
			break;
		case '28px':
			cc = +2;
			break;
		default:
			cc = 0;
	}
	var attitude = (cc < 0) ? false : (cc > 0) ? true : null;
	$(document).on('click','.js-karma_controls',function(e) {
		if ( $(this).hasClass('left') ) {
			cc = (cc==-2) ? -2 : --cc;
		} else if( $(this).hasClass('right') ) {
			cc = (cc==2) ? 2 : ++cc;
		}
		if (cc==-1) {
			$('.l-content_column').show();
			$('.HH').hide();
			alert('Обидеть художника может каждый...');
		} else if (cc==-2) {
			$('.l-content_column').hide();
			$('.HH').show();
			alert('И кто из нас фашист?');
		}
	});
}