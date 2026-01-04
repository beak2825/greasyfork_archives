// ==UserScript==
// @name               GoodbyeGame
// @name:en            GoodbyeGame
// @name:zh-CN         GoodbyeGame
// @namespace          https://github.com/Ocyss/GoodbyeGame
// @version            0.0.1
// @author             Ocyss
// @description        在Steam家庭监护中添加按钮, 允许使用(drand分布式随机信标技术)时间锁来锁定游戏. 并且支持禁用恢复邮箱. 让你能更快乐的学习!
// @description:en     [Unfinished i18n] Add a button in Steam Family Settings to lock games using (drand distributed random beacon technology) time lock. And support disabling recovery email. Let you learn more happily!
// @description:zh-CN  在Steam家庭监护中添加按钮, 允许使用(drand分布式随机信标技术)时间锁来锁定游戏. 并且支持禁用恢复邮箱. 让你能更快乐的学习!
// @icon               https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @homepage           https://github.com/Ocyss/GoodbyeGame
// @homepageURL        https://github.com/Ocyss/GoodbyeGame
// @match              https://store.steampowered.com/parental/setpin
// @require            https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.prod.js
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520334/GoodbyeGame.user.js
// @updateURL https://update.greasyfork.org/scripts/520334/GoodbyeGame.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const o=document.createElement("style");o.textContent=r,document.head.append(o)})(' .dp__input_wrap{position:relative;width:100%;box-sizing:unset}.dp__input_wrap:focus{border-color:var(--dp-border-color-hover);outline:none}.dp__input_valid{box-shadow:0 0 var(--dp-border-radius) var(--dp-success-color);border-color:var(--dp-success-color)}.dp__input_valid:hover{border-color:var(--dp-success-color)}.dp__input_invalid{box-shadow:0 0 var(--dp-border-radius) var(--dp-danger-color);border-color:var(--dp-danger-color)}.dp__input_invalid:hover{border-color:var(--dp-danger-color)}.dp__input{background-color:var(--dp-background-color);border-radius:var(--dp-border-radius);font-family:var(--dp-font-family);border:1px solid var(--dp-border-color);outline:none;transition:border-color .2s cubic-bezier(.645,.045,.355,1);width:100%;font-size:var(--dp-font-size);line-height:calc(var(--dp-font-size)*1.5);padding:var(--dp-input-padding);color:var(--dp-text-color);box-sizing:border-box}.dp__input::-moz-placeholder{opacity:.7}.dp__input::placeholder{opacity:.7}.dp__input:hover:not(.dp__input_focus){border-color:var(--dp-border-color-hover)}.dp__input_reg{caret-color:#0000}.dp__input_focus{border-color:var(--dp-border-color-focus)}.dp__disabled{background:var(--dp-disabled-color)}.dp__disabled::-moz-placeholder{color:var(--dp-disabled-color-text)}.dp__disabled::placeholder{color:var(--dp-disabled-color-text)}.dp__input_icons{display:inline-block;width:var(--dp-font-size);height:var(--dp-font-size);stroke-width:0;font-size:var(--dp-font-size);line-height:calc(var(--dp-font-size)*1.5);padding:6px 12px;color:var(--dp-icon-color);box-sizing:content-box}.dp__input_icon{cursor:pointer;position:absolute;top:50%;inset-inline-start:0;transform:translateY(-50%);color:var(--dp-icon-color)}.dp--clear-btn{position:absolute;top:50%;inset-inline-end:0;transform:translateY(-50%);cursor:pointer;color:var(--dp-icon-color);background:#0000;border:none;display:inline-flex;align-items:center;padding:0;margin:0}.dp__input_icon_pad{padding-inline-start:var(--dp-input-icon-padding)}.dp__menu{background:var(--dp-background-color);border-radius:var(--dp-border-radius);min-width:var(--dp-menu-min-width);font-family:var(--dp-font-family);font-size:var(--dp-font-size);-webkit-user-select:none;-moz-user-select:none;user-select:none;border:1px solid var(--dp-menu-border-color);box-sizing:border-box}.dp__menu:after{box-sizing:border-box}.dp__menu:before{box-sizing:border-box}.dp__menu:focus{border:1px solid var(--dp-menu-border-color);outline:none}.dp--menu-wrapper{position:absolute;z-index:99999}.dp__menu_inner{padding:var(--dp-menu-padding)}.dp--menu--inner-stretched{padding:6px 0}.dp__menu_index{z-index:99999}.dp-menu-loading,.dp__menu_readonly,.dp__menu_disabled{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999999}.dp__menu_disabled{background:#ffffff80;cursor:not-allowed}.dp__menu_readonly{background:#0000;cursor:default}.dp-menu-loading{background:#ffffff80;cursor:default}.dp--menu-load-container{display:flex;height:100%;width:100%;justify-content:center;align-items:center}.dp--menu-loader{width:48px;height:48px;border:var(--dp-loader);border-bottom-color:#0000;border-radius:50%;display:inline-block;box-sizing:border-box;animation:dp-load-rotation 1s linear infinite;position:absolute}@keyframes dp-load-rotation{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dp__arrow_top{left:var(--dp-arrow-left);top:0;height:12px;width:12px;background-color:var(--dp-background-color);position:absolute;border-inline-end:1px solid var(--dp-menu-border-color);border-top:1px solid var(--dp-menu-border-color);transform:translate(-50%,-50%) rotate(-45deg)}.dp__arrow_bottom{left:var(--dp-arrow-left);bottom:0;height:12px;width:12px;background-color:var(--dp-background-color);position:absolute;border-inline-end:1px solid var(--dp-menu-border-color);border-bottom:1px solid var(--dp-menu-border-color);transform:translate(-50%,50%) rotate(45deg)}.dp__action_extra{text-align:center;padding:2px 0}.dp--preset-dates{padding:5px;border-inline-end:1px solid var(--dp-border-color)}.dp--preset-dates[data-dp-mobile],.dp--preset-dates-collapsed{display:flex;align-self:center;border:none;overflow-x:auto;max-width:calc(var(--dp-menu-width) - var(--dp-action-row-padding)*2)}.dp__sidebar_left{padding:5px;border-inline-end:1px solid var(--dp-border-color)}.dp__sidebar_right{padding:5px;margin-inline-end:1px solid var(--dp-border-color)}.dp--preset-range{display:block;width:100%;padding:5px;text-align:left;white-space:nowrap;color:var(--dp-text-color);border-radius:var(--dp-border-radius);transition:var(--dp-common-transition)}.dp--preset-range:hover{background-color:var(--dp-hover-color);color:var(--dp-hover-text-color);cursor:pointer}.dp--preset-range[data-dp-mobile]{border:1px solid var(--dp-border-color);margin:0 3px}.dp--preset-range[data-dp-mobile]:first-child{margin-left:0}.dp--preset-range[data-dp-mobile]:last-child{margin-right:0}.dp--preset-range-collapsed{border:1px solid var(--dp-border-color);margin:0 3px}.dp--preset-range-collapsed:first-child{margin-left:0}.dp--preset-range-collapsed:last-child{margin-right:0}.dp__menu_content_wrapper{display:flex}.dp__menu_content_wrapper[data-dp-mobile],.dp--menu-content-wrapper-collapsed{flex-direction:column-reverse}.dp__calendar_header{position:relative;display:flex;justify-content:center;align-items:center;color:var(--dp-text-color);white-space:nowrap;font-weight:700}.dp__calendar_header_item{text-align:center;flex-grow:1;height:var(--dp-cell-size);padding:var(--dp-cell-padding);width:var(--dp-cell-size);box-sizing:border-box}.dp__calendar_row{display:flex;justify-content:center;align-items:center;margin:var(--dp-row-margin)}.dp__calendar_item{text-align:center;flex-grow:1;box-sizing:border-box;color:var(--dp-text-color)}.dp__calendar{position:relative}.dp__calendar_header_cell{border-bottom:thin solid var(--dp-border-color);padding:var(--dp-calendar-header-cell-padding)}.dp__cell_inner{display:flex;align-items:center;text-align:center;justify-content:center;border-radius:var(--dp-cell-border-radius);height:var(--dp-cell-size);padding:var(--dp-cell-padding);width:var(--dp-cell-size);border:1px solid rgba(0,0,0,0);box-sizing:border-box;position:relative}.dp__cell_inner:hover{transition:all .2s}.dp__cell_auto_range_start,.dp__date_hover_start:hover,.dp__range_start{border-end-end-radius:0;border-start-end-radius:0}.dp__cell_auto_range_end,.dp__date_hover_end:hover,.dp__range_end{border-end-start-radius:0;border-start-start-radius:0}.dp__range_end,.dp__range_start,.dp__active_date{background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp__date_hover_end:hover,.dp__date_hover_start:hover,.dp__date_hover:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp__cell_offset{color:var(--dp-secondary-color)}.dp__cell_disabled{color:var(--dp-secondary-color);cursor:not-allowed}.dp__range_between{background:var(--dp-range-between-dates-background-color);color:var(--dp-range-between-dates-text-color);border-radius:0;border:1px solid var(--dp-range-between-border-color)}.dp__range_between_week{background:var(--dp-primary-color);color:var(--dp-primary-text-color);border-radius:0;border-top:1px solid var(--dp-primary-color);border-bottom:1px solid var(--dp-primary-color)}.dp__today{border:1px solid var(--dp-primary-color)}.dp__week_num{color:var(--dp-secondary-color);text-align:center}.dp__cell_auto_range{border-radius:0;border-top:1px dashed var(--dp-primary-color);border-bottom:1px dashed var(--dp-primary-color)}.dp__cell_auto_range_start{border-start-start-radius:var(--dp-cell-border-radius);border-end-start-radius:var(--dp-cell-border-radius);border-inline-start:1px dashed var(--dp-primary-color);border-top:1px dashed var(--dp-primary-color);border-bottom:1px dashed var(--dp-primary-color)}.dp__cell_auto_range_end{border-start-end-radius:var(--dp-cell-border-radius);border-end-end-radius:var(--dp-cell-border-radius);border-top:1px dashed var(--dp-primary-color);border-bottom:1px dashed var(--dp-primary-color);border-inline-end:1px dashed var(--dp-primary-color)}.dp__calendar_header_separator{width:100%;height:1px;background:var(--dp-border-color)}.dp__calendar_next{margin-inline-start:var(--dp-multi-calendars-spacing)}.dp__marker_line,.dp__marker_dot{height:5px;background-color:var(--dp-marker-color);position:absolute;bottom:0}.dp__marker_dot{width:5px;border-radius:50%;left:50%;transform:translate(-50%)}.dp__marker_line{width:100%;left:0}.dp__marker_tooltip{position:absolute;border-radius:var(--dp-border-radius);background-color:var(--dp-tooltip-color);padding:5px;border:1px solid var(--dp-border-color);z-index:99999;box-sizing:border-box;cursor:default}.dp__tooltip_content{white-space:nowrap}.dp__tooltip_text{display:flex;align-items:center;flex-flow:row nowrap;color:var(--dp-text-color)}.dp__tooltip_mark{height:5px;width:5px;border-radius:50%;background-color:var(--dp-text-color);color:var(--dp-text-color);margin-inline-end:5px}.dp__arrow_bottom_tp{bottom:0;height:8px;width:8px;background-color:var(--dp-tooltip-color);position:absolute;border-inline-end:1px solid var(--dp-border-color);border-bottom:1px solid var(--dp-border-color);transform:translate(-50%,50%) rotate(45deg)}.dp__instance_calendar{position:relative;width:100%}.dp__flex_display[data-dp-mobile],.dp--flex-display-collapsed{flex-direction:column}.dp__cell_highlight{background-color:var(--dp-highlight-color)}.dp__month_year_row{display:flex;align-items:center;height:var(--dp-month-year-row-height);color:var(--dp-text-color);box-sizing:border-box}.dp__inner_nav{display:flex;align-items:center;justify-content:center;cursor:pointer;height:var(--dp-month-year-row-button-size);width:var(--dp-month-year-row-button-size);color:var(--dp-icon-color);text-align:center;border-radius:50%}.dp__inner_nav svg{height:var(--dp-button-icon-height);width:var(--dp-button-icon-height)}.dp__inner_nav:hover{background:var(--dp-hover-color);color:var(--dp-hover-icon-color)}[dir=rtl] .dp__inner_nav{transform:rotate(180deg)}.dp__inner_nav_disabled:hover,.dp__inner_nav_disabled{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp--year-select,.dp__month_year_select{text-align:center;cursor:pointer;height:var(--dp-month-year-row-height);display:flex;align-items:center;justify-content:center;border-radius:var(--dp-border-radius);box-sizing:border-box;color:var(--dp-text-color)}.dp--year-select:hover,.dp__month_year_select:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp__month_year_select{width:50%}.dp--year-select{width:100%}.dp__month_year_wrap{display:flex;flex-direction:row;width:100%}.dp__year_disable_select{justify-content:space-around}.dp--header-wrap{display:flex;width:100%;flex-direction:column}.dp__overlay{width:100%;background:var(--dp-background-color);transition:opacity 1s ease-out;z-index:99999;font-family:var(--dp-font-family);color:var(--dp-text-color);box-sizing:border-box}.dp--overlay-absolute{position:absolute;height:100%;top:0;left:0}.dp--overlay-relative{position:relative}.dp__overlay_container::-webkit-scrollbar-track{box-shadow:var(--dp-scroll-bar-background);background-color:var(--dp-scroll-bar-background)}.dp__overlay_container::-webkit-scrollbar{width:5px;background-color:var(--dp-scroll-bar-background)}.dp__overlay_container::-webkit-scrollbar-thumb{background-color:var(--dp-scroll-bar-color);border-radius:10px}.dp__overlay:focus{border:none;outline:none}.dp__container_flex{display:flex}.dp__container_block{display:block}.dp__overlay_container{flex-direction:column;overflow-y:auto;height:var(--dp-overlay-height)}.dp__time_picker_overlay_container{height:100%}.dp__overlay_row{padding:0;box-sizing:border-box;display:flex;margin-inline:auto;flex-wrap:wrap;max-width:100%;width:100%;align-items:center}.dp__flex_row{flex:1}.dp__overlay_col{box-sizing:border-box;width:33%;padding:var(--dp-overlay-col-padding);white-space:nowrap}.dp__overlay_cell_pad{padding:var(--dp-common-padding) 0}.dp__overlay_cell_active{cursor:pointer;border-radius:var(--dp-border-radius);text-align:center;background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp__overlay_cell{cursor:pointer;border-radius:var(--dp-border-radius);text-align:center}.dp__overlay_cell:hover{background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp__cell_in_between{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp__over_action_scroll{right:5px;box-sizing:border-box}.dp__overlay_cell_disabled{cursor:not-allowed;background:var(--dp-disabled-color)}.dp__overlay_cell_disabled:hover{background:var(--dp-disabled-color)}.dp__overlay_cell_active_disabled{cursor:not-allowed;background:var(--dp-primary-disabled-color)}.dp__overlay_cell_active_disabled:hover{background:var(--dp-primary-disabled-color)}.dp__btn,.dp--qr-btn,.dp--time-overlay-btn,.dp--time-invalid{border:none;font:inherit;transition:var(--dp-common-transition);line-height:normal}.dp--year-mode-picker{display:flex;width:100%;align-items:center;justify-content:space-between;height:var(--dp-cell-size)}.dp--tp-wrap{max-width:var(--dp-menu-min-width)}.dp--tp-wrap[data-dp-mobile]{max-width:100%}.dp__time_input{width:100%;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;font-family:var(--dp-font-family);color:var(--dp-text-color)}.dp__time_col_reg_block{padding:0 20px}.dp__time_col_reg_inline{padding:0 10px}.dp__time_col_reg_with_button{padding:0 15px}.dp__time_col_reg_with_button[data-compact~=true]{padding:0 5px}.dp__time_col_sec{padding:0 10px}.dp__time_col_sec_with_button{padding:0 5px}.dp__time_col_sec_with_button[data-collapsed~=true]{padding:0}.dp__time_col{text-align:center;display:flex;align-items:center;justify-content:center;flex-direction:column}.dp__time_col_block{font-size:var(--dp-time-font-size)}.dp__time_display_block{padding:0 3px}.dp__time_display_inline{padding:5px}.dp__time_picker_inline_container{display:flex;width:100%;justify-content:center}.dp__inc_dec_button{padding:5px;margin:0;height:var(--dp-time-inc-dec-button-size);width:var(--dp-time-inc-dec-button-size);display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%;color:var(--dp-icon-color);box-sizing:border-box}.dp__inc_dec_button svg{height:var(--dp-time-inc-dec-button-size);width:var(--dp-time-inc-dec-button-size)}.dp__inc_dec_button:hover{background:var(--dp-hover-color);color:var(--dp-primary-color)}.dp__time_display{cursor:pointer;color:var(--dp-text-color);border-radius:var(--dp-border-radius);display:flex;align-items:center;justify-content:center}.dp__time_display:hover:enabled{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}.dp__inc_dec_button_inline{width:100%;padding:0;height:8px;cursor:pointer;display:flex;align-items:center}.dp__inc_dec_button_disabled,.dp__inc_dec_button_disabled:hover{background:var(--dp-disabled-color);color:var(--dp-disabled-color-text);cursor:not-allowed}.dp__pm_am_button{background:var(--dp-primary-color);color:var(--dp-primary-text-color);border:none;padding:var(--dp-common-padding);border-radius:var(--dp-border-radius);cursor:pointer}.dp__pm_am_button[data-compact~=true]{padding:7px}.dp__tp_inline_btn_bar{width:100%;height:4px;background-color:var(--dp-secondary-color);transition:var(--dp-common-transition);border-collapse:collapse}.dp__tp_inline_btn_top:hover .dp__tp_btn_in_r{background-color:var(--dp-primary-color);transform:rotate(12deg) scale(1.15) translateY(-2px)}.dp__tp_inline_btn_top:hover .dp__tp_btn_in_l,.dp__tp_inline_btn_bottom:hover .dp__tp_btn_in_r{background-color:var(--dp-primary-color);transform:rotate(-12deg) scale(1.15) translateY(-2px)}.dp__tp_inline_btn_bottom:hover .dp__tp_btn_in_l{background-color:var(--dp-primary-color);transform:rotate(12deg) scale(1.15) translateY(-2px)}.dp--time-overlay-btn{background:none}.dp--time-invalid{background-color:var(--dp-disabled-color)}.dp__action_row{display:flex;align-items:center;width:100%;padding:var(--dp-action-row-padding);box-sizing:border-box;color:var(--dp-text-color);flex-flow:row nowrap}.dp__action_row svg{height:var(--dp-button-icon-height);width:auto}.dp__selection_preview{display:block;color:var(--dp-text-color);font-size:var(--dp-preview-font-size);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dp__action_buttons{display:flex;flex:0;white-space:nowrap;align-items:center;justify-content:flex-end;margin-inline-start:auto}.dp__action_button{display:inline-flex;align-items:center;background:#0000;border:1px solid rgba(0,0,0,0);padding:var(--dp-action-buttons-padding);line-height:var(--dp-action-button-height);margin-inline-start:3px;height:var(--dp-action-button-height);cursor:pointer;border-radius:var(--dp-border-radius);font-size:var(--dp-preview-font-size);font-family:var(--dp-font-family)}.dp__action_cancel{color:var(--dp-text-color);border:1px solid var(--dp-border-color)}.dp__action_cancel:hover{border-color:var(--dp-primary-color);transition:var(--dp-action-row-transtion)}.dp__action_buttons .dp__action_select{background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp__action_buttons .dp__action_select:hover{background:var(--dp-primary-color);transition:var(--dp-action-row-transtion)}.dp__action_buttons .dp__action_select:disabled{background:var(--dp-primary-disabled-color);cursor:not-allowed}.dp-quarter-picker-wrap{display:flex;flex-direction:column;height:100%;min-width:var(--dp-menu-min-width)}.dp--qr-btn-disabled{cursor:not-allowed;background:var(--dp-disabled-color)}.dp--qr-btn-disabled:hover{background:var(--dp-disabled-color)}.dp--qr-btn{width:100%;padding:var(--dp-common-padding)}.dp--qr-btn:not(.dp--highlighted,.dp--qr-btn-active,.dp--qr-btn-disabled,.dp--qr-btn-between){background:none}.dp--qr-btn:hover:not(.dp--qr-btn-active,.dp--qr-btn-disabled){background:var(--dp-hover-color);color:var(--dp-hover-text-color);transition:var(--dp-common-transition)}.dp--quarter-items{display:flex;flex-direction:column;flex:1;width:100%;height:100%;justify-content:space-evenly}.dp--qr-btn-active{background:var(--dp-primary-color);color:var(--dp-primary-text-color)}.dp--qr-btn-between{background:var(--dp-hover-color);color:var(--dp-hover-text-color)}:root{--dp-common-transition: all .1s ease-in;--dp-menu-padding: 6px 8px;--dp-animation-duration: .1s;--dp-menu-appear-transition-timing: cubic-bezier(.4, 0, 1, 1);--dp-transition-timing: ease-out;--dp-action-row-transtion: all .2s ease-in;--dp-font-family: -apple-system, blinkmacsystemfont, "Segoe UI", roboto, oxygen, ubuntu, cantarell, "Open Sans", "Helvetica Neue", sans-serif;--dp-border-radius: 4px;--dp-cell-border-radius: 4px;--dp-transition-length: 22px;--dp-transition-timing-general: .1s;--dp-button-height: 35px;--dp-month-year-row-height: 35px;--dp-month-year-row-button-size: 25px;--dp-button-icon-height: 20px;--dp-calendar-wrap-padding: 0 5px;--dp-cell-size: 35px;--dp-cell-padding: 5px;--dp-common-padding: 10px;--dp-input-icon-padding: 35px;--dp-input-padding: 6px 30px 6px 12px;--dp-menu-min-width: 260px;--dp-action-buttons-padding: 1px 6px;--dp-row-margin: 5px 0;--dp-calendar-header-cell-padding: .5rem;--dp-multi-calendars-spacing: 10px;--dp-overlay-col-padding: 3px;--dp-time-inc-dec-button-size: 32px;--dp-font-size: 1rem;--dp-preview-font-size: .8rem;--dp-time-font-size: 2rem;--dp-action-button-height: 22px;--dp-action-row-padding: 8px;--dp-direction: ltr}.dp__theme_dark{--dp-background-color: #212121;--dp-text-color: #fff;--dp-hover-color: #484848;--dp-hover-text-color: #fff;--dp-hover-icon-color: #959595;--dp-primary-color: #005cb2;--dp-primary-disabled-color: #61a8ea;--dp-primary-text-color: #fff;--dp-secondary-color: #a9a9a9;--dp-border-color: #2d2d2d;--dp-menu-border-color: #2d2d2d;--dp-border-color-hover: #aaaeb7;--dp-border-color-focus: #aaaeb7;--dp-disabled-color: #737373;--dp-disabled-color-text: #d0d0d0;--dp-scroll-bar-background: #212121;--dp-scroll-bar-color: #484848;--dp-success-color: #00701a;--dp-success-color-disabled: #428f59;--dp-icon-color: #959595;--dp-danger-color: #e53935;--dp-marker-color: #e53935;--dp-tooltip-color: #3e3e3e;--dp-highlight-color: rgb(0 92 178 / 20%);--dp-range-between-dates-background-color: var(--dp-hover-color, #484848);--dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);--dp-range-between-border-color: var(--dp-hover-color, #fff);--dp-loader: 5px solid #005cb2}.dp__theme_light{--dp-background-color: #fff;--dp-text-color: #212121;--dp-hover-color: #f3f3f3;--dp-hover-text-color: #212121;--dp-hover-icon-color: #959595;--dp-primary-color: #1976d2;--dp-primary-disabled-color: #6bacea;--dp-primary-text-color: #fff;--dp-secondary-color: #c0c4cc;--dp-border-color: #ddd;--dp-menu-border-color: #ddd;--dp-border-color-hover: #aaaeb7;--dp-border-color-focus: #aaaeb7;--dp-disabled-color: #f6f6f6;--dp-scroll-bar-background: #f3f3f3;--dp-scroll-bar-color: #959595;--dp-success-color: #76d275;--dp-success-color-disabled: #a3d9b1;--dp-icon-color: #959595;--dp-danger-color: #ff6f60;--dp-marker-color: #ff6f60;--dp-tooltip-color: #fafafa;--dp-disabled-color-text: #8e8e8e;--dp-highlight-color: rgb(25 118 210 / 10%);--dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);--dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);--dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);--dp-loader: 5px solid #1976d2}.dp__flex{display:flex;align-items:center}.dp__btn{background:none}.dp__main{font-family:var(--dp-font-family);-webkit-user-select:none;-moz-user-select:none;user-select:none;box-sizing:border-box;position:relative;width:100%}.dp__main *{direction:var(--dp-direction, ltr)}.dp__pointer{cursor:pointer}.dp__icon{stroke:currentcolor;fill:currentcolor}.dp__button{width:100%;text-align:center;color:var(--dp-icon-color);cursor:pointer;display:flex;align-items:center;place-content:center center;padding:var(--dp-common-padding);box-sizing:border-box;height:var(--dp-button-height)}.dp__button.dp__overlay_action{position:absolute;bottom:0}.dp__button:hover{background:var(--dp-hover-color);color:var(--dp-hover-icon-color)}.dp__button svg{height:var(--dp-button-icon-height);width:auto}.dp__button_bottom{border-bottom-left-radius:var(--dp-border-radius);border-bottom-right-radius:var(--dp-border-radius)}.dp__flex_display{display:flex}.dp__flex_display_with_input{flex-direction:column;align-items:flex-start}.dp__relative{position:relative}.calendar-next-enter-active,.calendar-next-leave-active,.calendar-prev-enter-active,.calendar-prev-leave-active{transition:all var(--dp-transition-timing-general) ease-out}.calendar-next-enter-from{opacity:0;transform:translate(var(--dp-transition-length))}.calendar-next-leave-to,.calendar-prev-enter-from{opacity:0;transform:translate(calc(var(--dp-transition-length) * -1))}.calendar-prev-leave-to{opacity:0;transform:translate(var(--dp-transition-length))}.dp-menu-appear-bottom-enter-active,.dp-menu-appear-bottom-leave-active,.dp-menu-appear-top-enter-active,.dp-menu-appear-top-leave-active,.dp-slide-up-enter-active,.dp-slide-up-leave-active,.dp-slide-down-enter-active,.dp-slide-down-leave-active{transition:all var(--dp-animation-duration) var(--dp-transition-timing)}.dp-menu-appear-top-enter-from,.dp-menu-appear-top-leave-to,.dp-slide-down-leave-to,.dp-slide-up-enter-from{opacity:0;transform:translateY(var(--dp-transition-length))}.dp-menu-appear-bottom-enter-from,.dp-menu-appear-bottom-leave-to,.dp-slide-down-enter-from,.dp-slide-up-leave-to{opacity:0;transform:translateY(calc(var(--dp-transition-length) * -1))}.dp--arrow-btn-nav{transition:var(--dp-common-transition)}.dp--highlighted{background-color:var(--dp-highlight-color)}.dp--hidden-el{visibility:hidden}.steps[data-v-360fe089]{display:flex;counter-reset:step;padding:1rem 0}.step[data-v-360fe089]{flex:1;position:relative;text-align:center;font-size:.875rem}.step[data-v-360fe089]:before{counter-increment:step;content:counter(step);display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:9999px;background:#475569;margin:0 auto .5rem;color:#fff}.step[data-v-360fe089]:not(:last-child):after{content:"";position:absolute;left:50%;top:1rem;width:100%;height:2px;background:#475569;transform:translateY(-50%);z-index:-1}.step-primary[data-v-360fe089]:before{background:#3b82f6}.step-primary[data-v-360fe089]:not(:last-child):after{background:#3b82f6}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0;right:0;bottom:0;left:0}.right-2{right:.5rem}.top-2{top:.5rem}.col-start-1{grid-column-start:1}.row-start-1{grid-row-start:1}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.ml-1{margin-left:.25rem}.flex{display:flex}.size-10{width:2.5rem;height:2.5rem}.h-48{height:12rem}.h-5{height:1.25rem}.h-fit{height:-moz-fit-content;height:fit-content}.h-full{height:100%}.max-h-none{max-height:none}.w-5{width:1.25rem}.w-full{width:100%}.min-w-\\[500px\\]{min-width:500px}.max-w-lg{max-width:32rem}.max-w-none{max-width:none}.flex-1{flex:1 1 0%}.scale-90{--tw-scale-x: .9;--tw-scale-y: .9;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.select-auto{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.gap-2{gap:.5rem}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.rounded{border-radius:.25rem}.rounded-\\[14px\\]{border-radius:14px}.rounded-\\[16px\\]{border-radius:16px}.rounded-full{border-radius:9999px}.rounded-md{border-radius:.375rem}.bg-\\[\\#B931FC\\]{--tw-bg-opacity: 1;background-color:rgb(185 49 252 / var(--tw-bg-opacity))}.bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity))}.bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity))}.bg-blue-700{--tw-bg-opacity: 1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))}.bg-slate-500{--tw-bg-opacity: 1;background-color:rgb(100 116 139 / var(--tw-bg-opacity))}.bg-slate-700{--tw-bg-opacity: 1;background-color:rgb(51 65 85 / var(--tw-bg-opacity))}.bg-slate-800{--tw-bg-opacity: 1;background-color:rgb(30 41 59 / var(--tw-bg-opacity))}.bg-slate-800\\/30{background-color:#1e293b4d}.bg-gradient-to-t{background-image:linear-gradient(to top,var(--tw-gradient-stops))}.from-\\[\\#8122b0\\]{--tw-gradient-from: #8122b0 var(--tw-gradient-from-position);--tw-gradient-to: rgb(129 34 176 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-\\[\\#a62ce2\\]{--tw-gradient-from: #a62ce2 var(--tw-gradient-from-position);--tw-gradient-to: rgb(166 44 226 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.to-\\[\\#c045fc\\]{--tw-gradient-to: #c045fc var(--tw-gradient-to-position)}.to-\\[\\#dc98fd\\]{--tw-gradient-to: #dc98fd var(--tw-gradient-to-position)}.p-6{padding:1.5rem}.p-\\[2px\\]{padding:2px}.px-4{padding-left:1rem;padding-right:1rem}.px-8{padding-left:2rem;padding-right:2rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.text-2xl{font-size:1.5rem;line-height:2rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.opacity-90{opacity:.9}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200{transition-duration:.2s}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}.hover\\:opacity-100:hover{opacity:1}.active\\:scale-95:active{--tw-scale-x: .95;--tw-scale-y: .95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:bg-blue-700:disabled{--tw-bg-opacity: 1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))} ');

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var tlockJs = {};
  var drandClient = {};
  var httpCachingChain = {};
  var util = {};
  var version$1 = {};
  Object.defineProperty(version$1, "__esModule", { value: true });
  version$1.LIB_VERSION = void 0;
  version$1.LIB_VERSION = "1.2.5";
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.retryOnError = exports.jsonOrError = exports.defaultHttpOptions = exports.roundTime = exports.roundAt = exports.sleep = void 0;
    const version_1 = version$1;
    function sleep(timeMs) {
      return new Promise((resolve) => {
        if (timeMs <= 0) {
          resolve();
        }
        setTimeout(resolve, timeMs);
      });
    }
    exports.sleep = sleep;
    function roundAt(time, chain) {
      if (!Number.isFinite(time)) {
        throw new Error("Cannot use Infinity or NaN as a beacon time");
      }
      if (time < chain.genesis_time * 1e3) {
        throw Error("Cannot request a round before the genesis time");
      }
      return Math.floor((time - chain.genesis_time * 1e3) / (chain.period * 1e3)) + 1;
    }
    exports.roundAt = roundAt;
    function roundTime(chain, round) {
      if (!Number.isFinite(round)) {
        throw new Error("Cannot use Infinity or NaN as a round number");
      }
      round = round < 0 ? 0 : round;
      return (chain.genesis_time + (round - 1) * chain.period) * 1e3;
    }
    exports.roundTime = roundTime;
    exports.defaultHttpOptions = {
      userAgent: `drand-client-${version_1.LIB_VERSION}`
    };
    async function jsonOrError(url, options = exports.defaultHttpOptions) {
      const headers = { ...options.headers };
      if (options.userAgent) {
        headers["User-Agent"] = options.userAgent;
      }
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw Error(`Error response fetching ${url} - got ${response.status}`);
      }
      return await response.json();
    }
    exports.jsonOrError = jsonOrError;
    async function retryOnError(fn2, times) {
      try {
        return await fn2();
      } catch (err) {
        if (times === 0) {
          throw err;
        }
        return retryOnError(fn2, times - 1);
      }
    }
    exports.retryOnError = retryOnError;
  })(util);
  var hasRequiredHttpCachingChain;
  function requireHttpCachingChain() {
    if (hasRequiredHttpCachingChain) return httpCachingChain;
    hasRequiredHttpCachingChain = 1;
    Object.defineProperty(httpCachingChain, "__esModule", { value: true });
    httpCachingChain.HttpChain = void 0;
    const index_1 = requireDrandClient();
    const util_1 = util;
    class HttpChain {
      constructor(baseUrl, options = index_1.defaultChainOptions, httpOptions = {}) {
        __publicField(this, "baseUrl");
        __publicField(this, "options");
        __publicField(this, "httpOptions");
        this.baseUrl = baseUrl;
        this.options = options;
        this.httpOptions = httpOptions;
      }
      async info() {
        const chainInfo = await (0, util_1.jsonOrError)(`${this.baseUrl}/info`, this.httpOptions);
        if (!!this.options.chainVerificationParams && !isValidInfo(chainInfo, this.options.chainVerificationParams)) {
          throw Error(`The chain info retrieved from ${this.baseUrl} did not match the verification params!`);
        }
        return chainInfo;
      }
    }
    httpCachingChain.HttpChain = HttpChain;
    function isValidInfo(chainInfo, validParams) {
      return chainInfo.hash === validParams.chainHash && chainInfo.public_key === validParams.publicKey;
    }
    class HttpCachingChain {
      constructor(baseUrl, options = index_1.defaultChainOptions) {
        __publicField(this, "baseUrl");
        __publicField(this, "options");
        __publicField(this, "chain");
        __publicField(this, "cachedInfo");
        this.baseUrl = baseUrl;
        this.options = options;
        this.chain = new HttpChain(baseUrl, options);
      }
      async info() {
        if (!this.cachedInfo) {
          this.cachedInfo = await this.chain.info();
        }
        return this.cachedInfo;
      }
    }
    httpCachingChain.default = HttpCachingChain;
    return httpCachingChain;
  }
  var httpChainClient = {};
  var hasRequiredHttpChainClient;
  function requireHttpChainClient() {
    if (hasRequiredHttpChainClient) return httpChainClient;
    hasRequiredHttpChainClient = 1;
    Object.defineProperty(httpChainClient, "__esModule", { value: true });
    const index_1 = requireDrandClient();
    const util_1 = util;
    class HttpChainClient {
      constructor(someChain, options = index_1.defaultChainOptions, httpOptions = util_1.defaultHttpOptions) {
        __publicField(this, "someChain");
        __publicField(this, "options");
        __publicField(this, "httpOptions");
        this.someChain = someChain;
        this.options = options;
        this.httpOptions = httpOptions;
      }
      async get(roundNumber) {
        const url = withCachingParams(`${this.someChain.baseUrl}/public/${roundNumber}`, this.options);
        return await (0, util_1.jsonOrError)(url, this.httpOptions);
      }
      async latest() {
        const url = withCachingParams(`${this.someChain.baseUrl}/public/latest`, this.options);
        return await (0, util_1.jsonOrError)(url, this.httpOptions);
      }
      chain() {
        return this.someChain;
      }
    }
    function withCachingParams(url, config) {
      if (config.noCache) {
        return `${url}?${Date.now()}`;
      }
      return url;
    }
    httpChainClient.default = HttpChainClient;
    return httpChainClient;
  }
  var fastestNodeClient = {};
  var speedtest = {};
  Object.defineProperty(speedtest, "__esModule", { value: true });
  speedtest.createSpeedTest = void 0;
  function createSpeedTest(test, frequencyMs, samples = 5) {
    let queue = new DroppingQueue(samples);
    let intervalId = null;
    const executeSpeedTest = async () => {
      const startTime = Date.now();
      try {
        await test();
        queue.add(Date.now() - startTime);
      } catch (err) {
        queue.add(Number.MAX_SAFE_INTEGER);
      }
    };
    return {
      start: () => {
        if (intervalId != null) {
          console.warn("Attempted to start a speed test, but it had already been started!");
          return;
        }
        intervalId = setInterval(executeSpeedTest, frequencyMs);
      },
      stop: () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
          queue = new DroppingQueue(samples);
        }
      },
      average: () => {
        const values = queue.get();
        if (values.length === 0) {
          return Number.MAX_SAFE_INTEGER;
        }
        const total = values.reduce((acc, next) => acc + next, 0);
        return total / values.length;
      }
    };
  }
  speedtest.createSpeedTest = createSpeedTest;
  class DroppingQueue {
    constructor(capacity) {
      __publicField(this, "capacity");
      __publicField(this, "values", []);
      this.capacity = capacity;
    }
    add(value) {
      this.values.push(value);
      if (this.values.length > this.capacity) {
        this.values.pop();
      }
    }
    get() {
      return this.values;
    }
  }
  var hasRequiredFastestNodeClient;
  function requireFastestNodeClient() {
    if (hasRequiredFastestNodeClient) return fastestNodeClient;
    hasRequiredFastestNodeClient = 1;
    var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule) return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding2(result, mod2, k);
      }
      __setModuleDefault2(result, mod2);
      return result;
    };
    var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(fastestNodeClient, "__esModule", { value: true });
    const index_1 = requireDrandClient();
    const http_caching_chain_1 = __importStar2(requireHttpCachingChain());
    const speedtest_1 = speedtest;
    const http_chain_client_1 = __importDefault(requireHttpChainClient());
    const defaultSpeedTestInterval = 1e3 * 60 * 5;
    class FastestNodeClient {
      constructor(baseUrls, options = index_1.defaultChainOptions, speedTestIntervalMs = defaultSpeedTestInterval) {
        __publicField(this, "baseUrls");
        __publicField(this, "options");
        __publicField(this, "speedTestIntervalMs");
        __publicField(this, "speedTests", []);
        __publicField(this, "speedTestHttpOptions", { userAgent: "drand-web-client-speedtest" });
        this.baseUrls = baseUrls;
        this.options = options;
        this.speedTestIntervalMs = speedTestIntervalMs;
        if (baseUrls.length === 0) {
          throw Error("Can't optimise an empty `baseUrls` array!");
        }
      }
      async latest() {
        return new http_chain_client_1.default(this.current(), this.options).latest();
      }
      async get(roundNumber) {
        return new http_chain_client_1.default(this.current(), this.options).get(roundNumber);
      }
      chain() {
        return this.current();
      }
      start() {
        if (this.baseUrls.length === 1) {
          console.warn("There was only a single base URL in the `FastestNodeClient` - not running speed testing");
          return;
        }
        this.speedTests = this.baseUrls.map((url) => {
          const testFn = async () => {
            await new http_caching_chain_1.HttpChain(url, this.options, this.speedTestHttpOptions).info();
            return;
          };
          const test = (0, speedtest_1.createSpeedTest)(testFn, this.speedTestIntervalMs);
          test.start();
          return { test, url };
        });
      }
      current() {
        if (this.speedTests.length === 0) {
          console.warn("You are not currently running speed tests to choose the fastest client. Run `.start()` to speed test");
        }
        const fastestEntry = this.speedTests.slice().sort((entry1, entry2) => entry1.test.average() - entry2.test.average()).shift();
        if (!fastestEntry) {
          throw Error("Somehow there were no entries to optimise! This should be impossible by now");
        }
        return new http_caching_chain_1.default(fastestEntry.url, this.options);
      }
      stop() {
        this.speedTests.forEach((entry) => entry.test.stop());
        this.speedTests = [];
      }
    }
    fastestNodeClient.default = FastestNodeClient;
    return fastestNodeClient;
  }
  var multiBeaconNode = {};
  var hasRequiredMultiBeaconNode;
  function requireMultiBeaconNode() {
    if (hasRequiredMultiBeaconNode) return multiBeaconNode;
    hasRequiredMultiBeaconNode = 1;
    var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(multiBeaconNode, "__esModule", { value: true });
    const index_1 = requireDrandClient();
    const http_caching_chain_1 = __importDefault(requireHttpCachingChain());
    const util_1 = util;
    class MultiBeaconNode {
      constructor(baseUrl, options = index_1.defaultChainOptions) {
        __publicField(this, "baseUrl");
        __publicField(this, "options");
        this.baseUrl = baseUrl;
        this.options = options;
      }
      async chains() {
        const chains = await (0, util_1.jsonOrError)(`${this.baseUrl}/chains`);
        if (!Array.isArray(chains)) {
          throw Error(`Expected an array from the chains endpoint but got: ${chains}`);
        }
        return chains.map((chainHash) => new http_caching_chain_1.default(`${this.baseUrl}/${chainHash}`), this.options);
      }
      async health() {
        const response = await fetch(`${this.baseUrl}/health`);
        if (!response.ok) {
          return {
            status: response.status,
            current: -1,
            expected: -1
          };
        }
        const json = await response.json();
        return {
          status: response.status,
          current: json.current ?? -1,
          expected: json.expected ?? -1
        };
      }
    }
    multiBeaconNode.default = MultiBeaconNode;
    return multiBeaconNode;
  }
  var beaconVerification = {};
  var bls12381 = {};
  var sha256 = {};
  var _md = {};
  var _assert = {};
  Object.defineProperty(_assert, "__esModule", { value: true });
  _assert.isBytes = isBytes$1;
  _assert.number = number;
  _assert.bool = bool;
  _assert.bytes = bytes;
  _assert.hash = hash;
  _assert.exists = exists;
  _assert.output = output;
  function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error(`positive integer expected, not ${n}`);
  }
  function bool(b) {
    if (typeof b !== "boolean")
      throw new Error(`boolean expected, not ${b}`);
  }
  function isBytes$1(a) {
    return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
  }
  function bytes(b, ...lengths) {
    if (!isBytes$1(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
  }
  function hash(h2) {
    if (typeof h2 !== "function" || typeof h2.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(h2.outputLen);
    number(h2.blockLen);
  }
  function exists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  }
  const assert = { number, bool, bytes, hash, exists, output };
  _assert.default = assert;
  var utils$3 = {};
  var crypto = {};
  Object.defineProperty(crypto, "__esModule", { value: true });
  crypto.crypto = void 0;
  crypto.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
  (function(exports) {
    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
    exports.isBytes = isBytes2;
    exports.byteSwap32 = byteSwap32;
    exports.bytesToHex = bytesToHex2;
    exports.hexToBytes = hexToBytes2;
    exports.asyncLoop = asyncLoop;
    exports.utf8ToBytes = utf8ToBytes2;
    exports.toBytes = toBytes;
    exports.concatBytes = concatBytes2;
    exports.checkOpts = checkOpts;
    exports.wrapConstructor = wrapConstructor;
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
    exports.randomBytes = randomBytes;
    const crypto_1 = crypto;
    const _assert_js_12 = _assert;
    function isBytes2(a) {
      return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
    }
    const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u32;
    const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    const rotr = (word, shift) => word << 32 - shift | word >>> shift;
    exports.rotr = rotr;
    const rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
    exports.rotl = rotl;
    exports.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
    const byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
    exports.byteSwap = byteSwap;
    exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
    function byteSwap32(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (0, exports.byteSwap)(arr[i]);
      }
    }
    const hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    function bytesToHex2(bytes2) {
      (0, _assert_js_12.bytes)(bytes2);
      let hex = "";
      for (let i = 0; i < bytes2.length; i++) {
        hex += hexes2[bytes2[i]];
      }
      return hex;
    }
    const asciis2 = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
    function asciiToBase162(char) {
      if (char >= asciis2._0 && char <= asciis2._9)
        return char - asciis2._0;
      if (char >= asciis2._A && char <= asciis2._F)
        return char - (asciis2._A - 10);
      if (char >= asciis2._a && char <= asciis2._f)
        return char - (asciis2._a - 10);
      return;
    }
    function hexToBytes2(hex) {
      if (typeof hex !== "string")
        throw new Error("hex string expected, got " + typeof hex);
      const hl2 = hex.length;
      const al = hl2 / 2;
      if (hl2 % 2)
        throw new Error("padded hex string expected, got unpadded hex of length " + hl2);
      const array = new Uint8Array(al);
      for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase162(hex.charCodeAt(hi));
        const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
        if (n1 === void 0 || n2 === void 0) {
          const char = hex[hi] + hex[hi + 1];
          throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2;
      }
      return array;
    }
    const nextTick2 = async () => {
    };
    exports.nextTick = nextTick2;
    async function asyncLoop(iters, tick, cb) {
      let ts = Date.now();
      for (let i = 0; i < iters; i++) {
        cb(i);
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
          continue;
        await (0, exports.nextTick)();
        ts += diff;
      }
    }
    function utf8ToBytes2(str) {
      if (typeof str !== "string")
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
      return new Uint8Array(new TextEncoder().encode(str));
    }
    function toBytes(data) {
      if (typeof data === "string")
        data = utf8ToBytes2(data);
      (0, _assert_js_12.bytes)(data);
      return data;
    }
    function concatBytes2(...arrays) {
      let sum = 0;
      for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        (0, _assert_js_12.bytes)(a);
        sum += a.length;
      }
      const res = new Uint8Array(sum);
      for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
      }
      return res;
    }
    class Hash {
      // Safe version that clones internal state
      clone() {
        return this._cloneInto();
      }
    }
    exports.Hash = Hash;
    const toStr = {}.toString;
    function checkOpts(defaults2, opts) {
      if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
        throw new Error("Options should be object or undefined");
      const merged = Object.assign(defaults2, opts);
      return merged;
    }
    function wrapConstructor(hashCons) {
      const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
      const tmp = hashCons();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashCons();
      return hashC;
    }
    function wrapConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function wrapXOFConstructorWithOpts(hashCons) {
      const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      const tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = (opts) => hashCons(opts);
      return hashC;
    }
    function randomBytes(bytesLength = 32) {
      if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
        return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
      }
      if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
        return crypto_1.crypto.randomBytes(bytesLength);
      }
      throw new Error("crypto.getRandomValues must be defined");
    }
  })(utils$3);
  Object.defineProperty(_md, "__esModule", { value: true });
  _md.HashMD = _md.Maj = _md.Chi = void 0;
  const _assert_js_1$1 = _assert;
  const utils_js_1$7 = utils$3;
  function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl2 = Number(value & _u32_max);
    const h2 = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h2, wh, isLE);
    view.setUint32(byteOffset + l, wl2, isLE);
  }
  const Chi = (a, b, c) => a & b ^ ~a & c;
  _md.Chi = Chi;
  const Maj = (a, b, c) => a & b ^ a & c ^ b & c;
  _md.Maj = Maj;
  class HashMD extends utils_js_1$7.Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = (0, utils_js_1$7.createView)(this.buffer);
    }
    update(data) {
      (0, _assert_js_1$1.exists)(this);
      const { view, buffer: buffer2, blockLen } = this;
      data = (0, utils_js_1$7.toBytes)(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = (0, utils_js_1$7.createView)(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer2.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      (0, _assert_js_1$1.exists)(this);
      (0, _assert_js_1$1.output)(out, this);
      this.finished = true;
      const { buffer: buffer2, view, blockLen, isLE } = this;
      let { pos } = this;
      buffer2[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer2[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
      this.process(view, 0);
      const oview = (0, utils_js_1$7.createView)(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
      const { buffer: buffer2, outputLen } = this;
      this.digestInto(buffer2);
      const res = buffer2.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to2) {
      to2 || (to2 = new this.constructor());
      to2.set(...this.get());
      const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
      to2.length = length;
      to2.pos = pos;
      to2.finished = finished;
      to2.destroyed = destroyed;
      if (length % blockLen)
        to2.buffer.set(buffer2);
      return to2;
    }
  }
  _md.HashMD = HashMD;
  Object.defineProperty(sha256, "__esModule", { value: true });
  sha256.sha224 = sha256.sha256 = sha256.SHA256 = void 0;
  const _md_js_1 = _md;
  const utils_js_1$6 = utils$3;
  const SHA256_K = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  const SHA256_IV = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  class SHA256 extends _md_js_1.HashMD {
    constructor() {
      super(64, 32, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = (0, utils_js_1$6.rotr)(W15, 7) ^ (0, utils_js_1$6.rotr)(W15, 18) ^ W15 >>> 3;
        const s1 = (0, utils_js_1$6.rotr)(W2, 17) ^ (0, utils_js_1$6.rotr)(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = (0, utils_js_1$6.rotr)(E, 6) ^ (0, utils_js_1$6.rotr)(E, 11) ^ (0, utils_js_1$6.rotr)(E, 25);
        const T1 = H + sigma1 + (0, _md_js_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = (0, utils_js_1$6.rotr)(A, 2) ^ (0, utils_js_1$6.rotr)(A, 13) ^ (0, utils_js_1$6.rotr)(A, 22);
        const T2 = sigma0 + (0, _md_js_1.Maj)(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  }
  sha256.SHA256 = SHA256;
  class SHA224 extends SHA256 {
    constructor() {
      super();
      this.A = 3238371032 | 0;
      this.B = 914150663 | 0;
      this.C = 812702999 | 0;
      this.D = 4144912697 | 0;
      this.E = 4290775857 | 0;
      this.F = 1750603025 | 0;
      this.G = 1694076839 | 0;
      this.H = 3204075428 | 0;
      this.outputLen = 28;
    }
  }
  sha256.sha256 = (0, utils_js_1$6.wrapConstructor)(() => new SHA256());
  sha256.sha224 = (0, utils_js_1$6.wrapConstructor)(() => new SHA224());
  var bls$1 = {};
  var modular = {};
  var utils$2 = {};
  Object.defineProperty(utils$2, "__esModule", { value: true });
  utils$2.notImplemented = utils$2.bitMask = void 0;
  utils$2.isBytes = isBytes;
  utils$2.abytes = abytes;
  utils$2.abool = abool;
  utils$2.bytesToHex = bytesToHex$1;
  utils$2.numberToHexUnpadded = numberToHexUnpadded;
  utils$2.hexToNumber = hexToNumber;
  utils$2.hexToBytes = hexToBytes;
  utils$2.bytesToNumberBE = bytesToNumberBE$1;
  utils$2.bytesToNumberLE = bytesToNumberLE;
  utils$2.numberToBytesBE = numberToBytesBE;
  utils$2.numberToBytesLE = numberToBytesLE;
  utils$2.numberToVarBytesBE = numberToVarBytesBE;
  utils$2.ensureBytes = ensureBytes;
  utils$2.concatBytes = concatBytes;
  utils$2.equalBytes = equalBytes;
  utils$2.utf8ToBytes = utf8ToBytes;
  utils$2.inRange = inRange;
  utils$2.aInRange = aInRange;
  utils$2.bitLen = bitLen;
  utils$2.bitGet = bitGet;
  utils$2.bitSet = bitSet;
  utils$2.createHmacDrbg = createHmacDrbg;
  utils$2.validateObject = validateObject;
  utils$2.memoized = memoized;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const _0n$4 = /* @__PURE__ */ BigInt(0);
  const _1n$4 = /* @__PURE__ */ BigInt(1);
  const _2n$3 = /* @__PURE__ */ BigInt(2);
  function isBytes(a) {
    return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
  }
  function abytes(item) {
    if (!isBytes(item))
      throw new Error("Uint8Array expected");
  }
  function abool(title, value) {
    if (typeof value !== "boolean")
      throw new Error(`${title} must be valid boolean, got "${value}".`);
  }
  const hexes$1 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex$1(bytes2) {
    abytes(bytes2);
    let hex = "";
    for (let i = 0; i < bytes2.length; i++) {
      hex += hexes$1[bytes2[i]];
    }
    return hex;
  }
  function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return BigInt(hex === "" ? "0" : `0x${hex}`);
  }
  const asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
  function asciiToBase16(char) {
    if (char >= asciis._0 && char <= asciis._9)
      return char - asciis._0;
    if (char >= asciis._A && char <= asciis._F)
      return char - (asciis._A - 10);
    if (char >= asciis._a && char <= asciis._f)
      return char - (asciis._a - 10);
    return;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    const hl2 = hex.length;
    const al = hl2 / 2;
    if (hl2 % 2)
      throw new Error("padded hex string expected, got unpadded hex of length " + hl2);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function bytesToNumberBE$1(bytes2) {
    return hexToNumber(bytesToHex$1(bytes2));
  }
  function bytesToNumberLE(bytes2) {
    abytes(bytes2);
    return hexToNumber(bytesToHex$1(Uint8Array.from(bytes2).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
  }
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes(hex);
      } catch (e) {
        throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
      }
    } else if (isBytes(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(`${title} must be hex string or Uint8Array`);
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
    return res;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  const isPosBig = (n) => typeof n === "bigint" && _0n$4 <= n;
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error(`expected valid ${title}: ${min} <= n < ${max}, got ${typeof n} ${n}`);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n$4; n >>= _1n$4, len += 1)
      ;
    return len;
  }
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n$4;
  }
  function bitSet(n, pos, value) {
    return n | (value ? _1n$4 : _0n$4) << BigInt(pos);
  }
  const bitMask = (n) => (_2n$3 << BigInt(n - 1)) - _1n$4;
  utils$2.bitMask = bitMask;
  const u8n = (data) => new Uint8Array(data);
  const u8fr = (arr) => Uint8Array.from(arr);
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h2 = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n()) => {
      k = h2(u8fr([0]), seed);
      v = h2();
      if (seed.length === 0)
        return;
      k = h2(u8fr([1]), seed);
      v = h2();
    };
    const gen = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h2();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  const validatorFns = {
    bigint: (val) => typeof val === "bigint",
    function: (val) => typeof val === "function",
    boolean: (val) => typeof val === "boolean",
    string: (val) => typeof val === "string",
    stringOrUint8Array: (val) => typeof val === "string" || isBytes(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
  };
  function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error(`Invalid validator "${type}", expected function`);
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
      }
    };
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  const notImplemented = () => {
    throw new Error("not implemented");
  };
  utils$2.notImplemented = notImplemented;
  function memoized(fn2) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed2 = fn2(arg, ...args);
      map.set(arg, computed2);
      return computed2;
    };
  }
  Object.defineProperty(modular, "__esModule", { value: true });
  modular.isNegativeLE = void 0;
  modular.mod = mod$1;
  modular.pow = pow;
  modular.pow2 = pow2;
  modular.invert = invert;
  modular.tonelliShanks = tonelliShanks;
  modular.FpSqrt = FpSqrt;
  modular.validateField = validateField;
  modular.FpPow = FpPow;
  modular.FpInvertBatch = FpInvertBatch;
  modular.FpDiv = FpDiv;
  modular.FpLegendre = FpLegendre;
  modular.FpIsSquare = FpIsSquare;
  modular.nLength = nLength;
  modular.Field = Field;
  modular.FpSqrtOdd = FpSqrtOdd;
  modular.FpSqrtEven = FpSqrtEven;
  modular.hashToPrivateScalar = hashToPrivateScalar;
  modular.getFieldBytesLength = getFieldBytesLength;
  modular.getMinHashLength = getMinHashLength;
  modular.mapHashToField = mapHashToField;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const utils_js_1$5 = utils$2;
  const _0n$3 = BigInt(0), _1n$3 = BigInt(1), _2n$2 = BigInt(2), _3n$2 = BigInt(3);
  const _4n = BigInt(4), _5n = BigInt(5), _8n = BigInt(8);
  BigInt(9);
  BigInt(16);
  function mod$1(a, b) {
    const result = a % b;
    return result >= _0n$3 ? result : b + result;
  }
  function pow(num, power, modulo) {
    if (modulo <= _0n$3 || power < _0n$3)
      throw new Error("Expected power/modulo > 0");
    if (modulo === _1n$3)
      return _0n$3;
    let res = _1n$3;
    while (power > _0n$3) {
      if (power & _1n$3)
        res = res * num % modulo;
      num = num * num % modulo;
      power >>= _1n$3;
    }
    return res;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n$3) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number2, modulo) {
    if (number2 === _0n$3 || modulo <= _0n$3) {
      throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
    }
    let a = mod$1(number2, modulo);
    let b = modulo;
    let x = _0n$3, u = _1n$3;
    while (a !== _0n$3) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n$3)
      throw new Error("invert: does not exist");
    return mod$1(x, modulo);
  }
  function tonelliShanks(P) {
    const legendreC = (P - _1n$3) / _2n$2;
    let Q, S, Z;
    for (Q = P - _1n$3, S = 0; Q % _2n$2 === _0n$3; Q /= _2n$2, S++)
      ;
    for (Z = _2n$2; Z < P && pow(Z, legendreC, P) !== P - _1n$3; Z++)
      ;
    if (S === 1) {
      const p1div4 = (P + _1n$3) / _4n;
      return function tonelliFast(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    const Q1div2 = (Q + _1n$3) / _2n$2;
    return function tonelliSlow(Fp, n) {
      if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
        throw new Error("Cannot find square root");
      let r = S;
      let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
      let x = Fp.pow(n, Q1div2);
      let b = Fp.pow(n, Q);
      while (!Fp.eql(b, Fp.ONE)) {
        if (Fp.eql(b, Fp.ZERO))
          return Fp.ZERO;
        let m = 1;
        for (let t2 = Fp.sqr(b); m < r; m++) {
          if (Fp.eql(t2, Fp.ONE))
            break;
          t2 = Fp.sqr(t2);
        }
        const ge = Fp.pow(g, _1n$3 << BigInt(r - m - 1));
        g = Fp.sqr(ge);
        x = Fp.mul(x, ge);
        b = Fp.mul(b, g);
        r = m;
      }
      return x;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n$2) {
      const p1div4 = (P + _1n$3) / _4n;
      return function sqrt3mod4(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    if (P % _8n === _5n) {
      const c1 = (P - _5n) / _8n;
      return function sqrt5mod8(Fp, n) {
        const n2 = Fp.mul(n, _2n$2);
        const v = Fp.pow(n2, c1);
        const nv = Fp.mul(n, v);
        const i = Fp.mul(Fp.mul(nv, _2n$2), v);
        const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      };
    }
    return tonelliShanks(P);
  }
  const isNegativeLE = (num, modulo) => (mod$1(num, modulo) & _1n$3) === _1n$3;
  modular.isNegativeLE = isNegativeLE;
  const FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    return (0, utils_js_1$5.validateObject)(field, opts);
  }
  function FpPow(f, num, power) {
    if (power < _0n$3)
      throw new Error("Expected power > 0");
    if (power === _0n$3)
      return f.ONE;
    if (power === _1n$3)
      return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n$3) {
      if (power & _1n$3)
        p = f.mul(p, d);
      d = f.sqr(d);
      power >>= _1n$3;
    }
    return p;
  }
  function FpInvertBatch(f, nums) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = acc;
      return f.mul(acc, num);
    }, f.ONE);
    const inverted = f.inv(lastMultiplied);
    nums.reduceRight((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = f.mul(acc, tmp[i]);
      return f.mul(acc, num);
    }, inverted);
    return tmp;
  }
  function FpDiv(f, lhs, rhs) {
    return f.mul(lhs, typeof rhs === "bigint" ? invert(rhs, f.ORDER) : f.inv(rhs));
  }
  function FpLegendre(order) {
    const legendreConst = (order - _1n$3) / _2n$2;
    return (f, x) => f.pow(x, legendreConst);
  }
  function FpIsSquare(f) {
    const legendre = FpLegendre(f.ORDER);
    return (x) => {
      const p = legendre(f, x);
      return f.eql(p, f.ZERO) || f.eql(p, f.ONE);
    };
  }
  function nLength(n, nBitLength) {
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLen2, isLE = false, redef = {}) {
    if (ORDER <= _0n$3)
      throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
    if (BYTES > 2048)
      throw new Error("Field lengths over 2048 bytes are not supported");
    const sqrtP = FpSqrt(ORDER);
    const f = Object.freeze({
      ORDER,
      BITS,
      BYTES,
      MASK: (0, utils_js_1$5.bitMask)(BITS),
      ZERO: _0n$3,
      ONE: _1n$3,
      create: (num) => mod$1(num, ORDER),
      isValid: (num) => {
        if (typeof num !== "bigint")
          throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
        return _0n$3 <= num && num < ORDER;
      },
      is0: (num) => num === _0n$3,
      isOdd: (num) => (num & _1n$3) === _1n$3,
      neg: (num) => mod$1(-num, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num) => mod$1(num * num, ORDER),
      add: (lhs, rhs) => mod$1(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod$1(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod$1(lhs * rhs, ORDER),
      pow: (num, power) => FpPow(f, num, power),
      div: (lhs, rhs) => mod$1(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num) => num * num,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num) => invert(num, ORDER),
      sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // TODO: do we really need constant cmov?
      // We don't have const-time bigints anyway, so probably will be not very useful
      cmov: (a, b, c) => c ? b : a,
      toBytes: (num) => isLE ? (0, utils_js_1$5.numberToBytesLE)(num, BYTES) : (0, utils_js_1$5.numberToBytesBE)(num, BYTES),
      fromBytes: (bytes2) => {
        if (bytes2.length !== BYTES)
          throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
        return isLE ? (0, utils_js_1$5.bytesToNumberLE)(bytes2) : (0, utils_js_1$5.bytesToNumberBE)(bytes2);
      }
    });
    return Object.freeze(f);
  }
  function FpSqrtOdd(Fp, elm) {
    if (!Fp.isOdd)
      throw new Error(`Field doesn't have isOdd`);
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? root : Fp.neg(root);
  }
  function FpSqrtEven(Fp, elm) {
    if (!Fp.isOdd)
      throw new Error(`Field doesn't have isOdd`);
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? Fp.neg(root) : root;
  }
  function hashToPrivateScalar(hash2, groupOrder, isLE = false) {
    hash2 = (0, utils_js_1$5.ensureBytes)("privateHash", hash2);
    const hashLen = hash2.length;
    const minLen = nLength(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024)
      throw new Error(`hashToPrivateScalar: expected ${minLen}-1024 bytes of input, got ${hashLen}`);
    const num = isLE ? (0, utils_js_1$5.bytesToNumberLE)(hash2) : (0, utils_js_1$5.bytesToNumberBE)(hash2);
    return mod$1(num, groupOrder - _1n$3) + _1n$3;
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
    const num = isLE ? (0, utils_js_1$5.bytesToNumberBE)(key) : (0, utils_js_1$5.bytesToNumberLE)(key);
    const reduced = mod$1(num, fieldOrder - _1n$3) + _1n$3;
    return isLE ? (0, utils_js_1$5.numberToBytesLE)(reduced, fieldLen) : (0, utils_js_1$5.numberToBytesBE)(reduced, fieldLen);
  }
  var hashToCurve = {};
  Object.defineProperty(hashToCurve, "__esModule", { value: true });
  hashToCurve.expand_message_xmd = expand_message_xmd;
  hashToCurve.expand_message_xof = expand_message_xof;
  hashToCurve.hash_to_field = hash_to_field;
  hashToCurve.isogenyMap = isogenyMap;
  hashToCurve.createHasher = createHasher;
  const modular_js_1$2 = modular;
  const utils_js_1$4 = utils$2;
  const os2ip = utils_js_1$4.bytesToNumberBE;
  function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length) {
      throw new Error(`bad I2OSP call: value=${value} length=${length}`);
    }
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function anum(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    (0, utils_js_1$4.abytes)(msg);
    (0, utils_js_1$4.abytes)(DST);
    anum(lenInBytes);
    if (DST.length > 255)
      DST = H((0, utils_js_1$4.concatBytes)((0, utils_js_1$4.utf8ToBytes)("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = (0, utils_js_1$4.concatBytes)(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H((0, utils_js_1$4.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H((0, utils_js_1$4.concatBytes)(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H((0, utils_js_1$4.concatBytes)(...args));
    }
    const pseudo_random_bytes = (0, utils_js_1$4.concatBytes)(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    (0, utils_js_1$4.abytes)(msg);
    (0, utils_js_1$4.abytes)(DST);
    anum(lenInBytes);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update((0, utils_js_1$4.utf8ToBytes)("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    (0, utils_js_1$4.validateObject)(options, {
      DST: "stringOrUint8Array",
      p: "bigint",
      m: "isSafeInteger",
      k: "isSafeInteger",
      hash: "hash"
    });
    const { p, k, m, hash: hash2, expand: expand2, DST: _DST } = options;
    (0, utils_js_1$4.abytes)(msg);
    anum(count);
    const DST = typeof _DST === "string" ? (0, utils_js_1$4.utf8ToBytes)(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand2 === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
    } else if (expand2 === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
    } else if (expand2 === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = (0, modular_js_1$2.mod)(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    const COEFF = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xNum, xDen, yNum, yDen] = COEFF.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      x = field.div(xNum, xDen);
      y = field.mul(y, field.div(yNum, yDen));
      return { x, y };
    };
  }
  function createHasher(Point, mapToCurve, def) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    return {
      // Encodes byte string to elliptic curve.
      // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      hashToCurve(msg, options) {
        const u = hash_to_field(msg, 2, { ...def, DST: def.DST, ...options });
        const u0 = Point.fromAffine(mapToCurve(u[0]));
        const u1 = Point.fromAffine(mapToCurve(u[1]));
        const P = u0.add(u1).clearCofactor();
        P.assertValidity();
        return P;
      },
      // Encodes byte string to elliptic curve.
      // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      encodeToCurve(msg, options) {
        const u = hash_to_field(msg, 1, { ...def, DST: def.encodeDST, ...options });
        const P = Point.fromAffine(mapToCurve(u[0])).clearCofactor();
        P.assertValidity();
        return P;
      },
      // Same as encodeToCurve, but without hash
      mapToCurve(scalars) {
        if (!Array.isArray(scalars))
          throw new Error("mapToCurve: expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error(`mapToCurve: expected array of bigints, got ${i} in array`);
        const P = Point.fromAffine(mapToCurve(scalars)).clearCofactor();
        P.assertValidity();
        return P;
      }
    };
  }
  var weierstrass = {};
  var curve = {};
  Object.defineProperty(curve, "__esModule", { value: true });
  curve.wNAF = wNAF;
  curve.pippenger = pippenger;
  curve.validateBasic = validateBasic;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const modular_js_1$1 = modular;
  const utils_js_1$3 = utils$2;
  const _0n$2 = BigInt(0);
  const _1n$2 = BigInt(1);
  const pointPrecomputes = /* @__PURE__ */ new WeakMap();
  const pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function wNAF(c, bits) {
    const constTimeNegate = (condition, item) => {
      const neg = item.negate();
      return condition ? neg : item;
    };
    const validateW = (W2) => {
      if (!Number.isSafeInteger(W2) || W2 <= 0 || W2 > bits)
        throw new Error(`Wrong window size=${W2}, should be [1..${bits}]`);
    };
    const opts = (W2) => {
      validateW(W2);
      const windows = Math.ceil(bits / W2) + 1;
      const windowSize = 2 ** (W2 - 1);
      return { windows, windowSize };
    };
    return {
      constTimeNegate,
      // non-const time multiplication ladder
      unsafeLadder(elm, n) {
        let p = c.ZERO;
        let d = elm;
        while (n > _0n$2) {
          if (n & _1n$2)
            p = p.add(d);
          d = d.double();
          n >>= _1n$2;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W2) {
        const { windows, windowSize } = opts(W2);
        const points = [];
        let p = elm;
        let base = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W2, precomputes, n) {
        const { windows, windowSize } = opts(W2);
        let p = c.ZERO;
        let f = c.BASE;
        const mask = BigInt(2 ** W2 - 1);
        const maxNumber = 2 ** W2;
        const shiftBy = BigInt(W2);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n$2;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f = f.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p = p.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return { p, f };
      },
      wNAFCached(P, n, transform) {
        const W2 = pointWindowSizes.get(P) || 1;
        let comp = pointPrecomputes.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W2);
          if (W2 !== 1)
            pointPrecomputes.set(P, transform(comp));
        }
        return this.wNAF(W2, comp, n);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W2) {
        validateW(W2);
        pointWindowSizes.set(P, W2);
        pointPrecomputes.delete(P);
      }
    };
  }
  function pippenger(c, field, points, scalars) {
    if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length)
      throw new Error("arrays of points and scalars must have equal length");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error(`wrong scalar at index ${i}`);
    });
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error(`wrong point at index ${i}`);
    });
    const wbits = (0, utils_js_1$3.bitLen)(BigInt(points.length));
    const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
    const MASK = (1 << windowSize) - 1;
    const buckets = new Array(MASK + 1).fill(c.ZERO);
    const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
    let sum = c.ZERO;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(c.ZERO);
      for (let j = 0; j < scalars.length; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = c.ZERO;
      for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function validateBasic(curve2) {
    (0, modular_js_1$1.validateField)(curve2.Fp);
    (0, utils_js_1$3.validateObject)(curve2, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...(0, modular_js_1$1.nLength)(curve2.n, curve2.nBitLength),
      ...curve2,
      ...{ p: curve2.Fp.ORDER }
    });
  }
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DER = void 0;
    exports.weierstrassPoints = weierstrassPoints;
    exports.weierstrass = weierstrass2;
    exports.SWUFpSqrtRatio = SWUFpSqrtRatio;
    exports.mapToCurveSimpleSWU = mapToCurveSimpleSWU;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const curve_js_1 = curve;
    const mod2 = modular;
    const ut2 = utils$2;
    const utils_js_12 = utils$2;
    function validateSigVerOpts(opts) {
      if (opts.lowS !== void 0)
        (0, utils_js_12.abool)("lowS", opts.lowS);
      if (opts.prehash !== void 0)
        (0, utils_js_12.abool)("prehash", opts.prehash);
    }
    function validatePointOpts(curve2) {
      const opts = (0, curve_js_1.validateBasic)(curve2);
      ut2.validateObject(opts, {
        a: "field",
        b: "field"
      }, {
        allowedPrivateKeyLengths: "array",
        wrapPrivateKey: "boolean",
        isTorsionFree: "function",
        clearCofactor: "function",
        allowInfinityPoint: "boolean",
        fromBytes: "function",
        toBytes: "function"
      });
      const { endo, Fp, a } = opts;
      if (endo) {
        if (!Fp.eql(a, Fp.ZERO)) {
          throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
        }
        if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
          throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
        }
      }
      return Object.freeze({ ...opts });
    }
    const { bytesToNumberBE: b2n, hexToBytes: h2b } = ut2;
    exports.DER = {
      // asn.1 DER encoding utils
      Err: class DERErr extends Error {
        constructor(m = "") {
          super(m);
        }
      },
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = exports.DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = ut2.numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? ut2.numberToHexUnpadded(len.length / 2 | 128) : "";
          return `${ut2.numberToHexUnpadded(tag)}${lenLen}${len}${data}`;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = exports.DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = exports.DER;
          if (num < _0n2)
            throw new E("integer: negative integers are not allowed");
          let hex = ut2.numberToHexUnpadded(num);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E("unexpected assertion");
          return hex;
        },
        decode(data) {
          const { Err: E } = exports.DER;
          if (data[0] & 128)
            throw new E("Invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("Invalid signature integer: unnecessary leading zero");
          return b2n(data);
        }
      },
      toSig(hex) {
        const { Err: E, _int: int2, _tlv: tlv } = exports.DER;
        const data = typeof hex === "string" ? h2b(hex) : hex;
        ut2.abytes(data);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("Invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("Invalid signature: left bytes after parsing");
        return { r: int2.decode(rBytes), s: int2.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int2 } = exports.DER;
        const seq = `${tlv.encode(2, int2.encode(sig.r))}${tlv.encode(2, int2.encode(sig.s))}`;
        return tlv.encode(48, seq);
      }
    };
    const _0n2 = BigInt(0), _1n2 = BigInt(1), _2n2 = BigInt(2), _3n2 = BigInt(3), _4n2 = BigInt(4);
    function weierstrassPoints(opts) {
      const CURVE = validatePointOpts(opts);
      const { Fp } = CURVE;
      const Fn2 = mod2.Field(CURVE.n, CURVE.nBitLength);
      const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
        const a = point.toAffine();
        return ut2.concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
      });
      const fromBytes = CURVE.fromBytes || ((bytes2) => {
        const tail = bytes2.subarray(1);
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      });
      function weierstrassEquation(x) {
        const { a, b } = CURVE;
        const x2 = Fp.sqr(x);
        const x3 = Fp.mul(x2, x);
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
      }
      if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
        throw new Error("bad generator point: equation left != right");
      function isWithinCurveOrder(num) {
        return ut2.inRange(num, _1n2, CURVE.n);
      }
      function normPrivateKeyToScalar(key) {
        const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
        if (lengths && typeof key !== "bigint") {
          if (ut2.isBytes(key))
            key = ut2.bytesToHex(key);
          if (typeof key !== "string" || !lengths.includes(key.length))
            throw new Error("Invalid key");
          key = key.padStart(nByteLength * 2, "0");
        }
        let num;
        try {
          num = typeof key === "bigint" ? key : ut2.bytesToNumberBE((0, utils_js_12.ensureBytes)("private key", key, nByteLength));
        } catch (error) {
          throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
        }
        if (wrapPrivateKey)
          num = mod2.mod(num, N);
        ut2.aInRange("private key", num, _1n2, N);
        return num;
      }
      function assertPrjPoint(other) {
        if (!(other instanceof Point))
          throw new Error("ProjectivePoint expected");
      }
      const toAffineMemo = (0, utils_js_12.memoized)((p, iz) => {
        const { px: x, py: y, pz: z } = p;
        if (Fp.eql(z, Fp.ONE))
          return { x, y };
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0)
          return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
          throw new Error("invZ was invalid");
        return { x: ax, y: ay };
      });
      const assertValidMemo = (0, utils_js_12.memoized)((p) => {
        if (p.is0()) {
          if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
            return;
          throw new Error("bad point: ZERO");
        }
        const { x, y } = p.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("bad point: x or y not FE");
        const left = Fp.sqr(y);
        const right = weierstrassEquation(x);
        if (!Fp.eql(left, right))
          throw new Error("bad point: equation left != right");
        if (!p.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        return true;
      });
      class Point {
        constructor(px, py, pz) {
          this.px = px;
          this.py = py;
          this.pz = pz;
          if (px == null || !Fp.isValid(px))
            throw new Error("x required");
          if (py == null || !Fp.isValid(py))
            throw new Error("y required");
          if (pz == null || !Fp.isValid(pz))
            throw new Error("z required");
          Object.freeze(this);
        }
        // Does not validate if the point is on-curve.
        // Use fromHex instead, or call assertValidity() later.
        static fromAffine(p) {
          const { x, y } = p || {};
          if (!p || !Fp.isValid(x) || !Fp.isValid(y))
            throw new Error("invalid affine point");
          if (p instanceof Point)
            throw new Error("projective point not allowed");
          const is0 = (i) => Fp.eql(i, Fp.ZERO);
          if (is0(x) && is0(y))
            return Point.ZERO;
          return new Point(x, y, Fp.ONE);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        /**
         * Takes a bunch of Projective Points but executes only one
         * inversion on all of them. Inversion is very slow operation,
         * so this improves performance massively.
         * Optimization: converts a list of projective points to a list of identical points with Z=1.
         */
        static normalizeZ(points) {
          const toInv = Fp.invertBatch(points.map((p) => p.pz));
          return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
        }
        /**
         * Converts hash string or Uint8Array to Point.
         * @param hex short/long ECDSA hex
         */
        static fromHex(hex) {
          const P = Point.fromAffine(fromBytes((0, utils_js_12.ensureBytes)("pointHex", hex)));
          P.assertValidity();
          return P;
        }
        // Multiplies generator point by privateKey.
        static fromPrivateKey(privateKey) {
          return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
          return (0, curve_js_1.pippenger)(Point, Fn2, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
          wnaf.setWindowSize(this, windowSize);
        }
        // A point on curve is valid if it conforms to equation.
        assertValidity() {
          assertValidMemo(this);
        }
        hasEvenY() {
          const { y } = this.toAffine();
          if (Fp.isOdd)
            return !Fp.isOdd(y);
          throw new Error("Field doesn't support isOdd");
        }
        /**
         * Compare one point to another.
         */
        equals(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
          const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
          return U1 && U2;
        }
        /**
         * Flips point to one corresponding to (x, -y) in Affine coordinates.
         */
        negate() {
          return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
          const { a, b } = CURVE;
          const b3 = Fp.mul(b, _3n2);
          const { px: X1, py: Y1, pz: Z1 } = this;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          let t0 = Fp.mul(X1, X1);
          let t1 = Fp.mul(Y1, Y1);
          let t2 = Fp.mul(Z1, Z1);
          let t3 = Fp.mul(X1, Y1);
          t3 = Fp.add(t3, t3);
          Z3 = Fp.mul(X1, Z1);
          Z3 = Fp.add(Z3, Z3);
          X3 = Fp.mul(a, Z3);
          Y3 = Fp.mul(b3, t2);
          Y3 = Fp.add(X3, Y3);
          X3 = Fp.sub(t1, Y3);
          Y3 = Fp.add(t1, Y3);
          Y3 = Fp.mul(X3, Y3);
          X3 = Fp.mul(t3, X3);
          Z3 = Fp.mul(b3, Z3);
          t2 = Fp.mul(a, t2);
          t3 = Fp.sub(t0, t2);
          t3 = Fp.mul(a, t3);
          t3 = Fp.add(t3, Z3);
          Z3 = Fp.add(t0, t0);
          t0 = Fp.add(Z3, t0);
          t0 = Fp.add(t0, t2);
          t0 = Fp.mul(t0, t3);
          Y3 = Fp.add(Y3, t0);
          t2 = Fp.mul(Y1, Z1);
          t2 = Fp.add(t2, t2);
          t0 = Fp.mul(t2, t3);
          X3 = Fp.sub(X3, t0);
          Z3 = Fp.mul(t2, t1);
          Z3 = Fp.add(Z3, Z3);
          Z3 = Fp.add(Z3, Z3);
          return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
          assertPrjPoint(other);
          const { px: X1, py: Y1, pz: Z1 } = this;
          const { px: X2, py: Y2, pz: Z2 } = other;
          let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
          const a = CURVE.a;
          const b3 = Fp.mul(CURVE.b, _3n2);
          let t0 = Fp.mul(X1, X2);
          let t1 = Fp.mul(Y1, Y2);
          let t2 = Fp.mul(Z1, Z2);
          let t3 = Fp.add(X1, Y1);
          let t4 = Fp.add(X2, Y2);
          t3 = Fp.mul(t3, t4);
          t4 = Fp.add(t0, t1);
          t3 = Fp.sub(t3, t4);
          t4 = Fp.add(X1, Z1);
          let t5 = Fp.add(X2, Z2);
          t4 = Fp.mul(t4, t5);
          t5 = Fp.add(t0, t2);
          t4 = Fp.sub(t4, t5);
          t5 = Fp.add(Y1, Z1);
          X3 = Fp.add(Y2, Z2);
          t5 = Fp.mul(t5, X3);
          X3 = Fp.add(t1, t2);
          t5 = Fp.sub(t5, X3);
          Z3 = Fp.mul(a, t4);
          X3 = Fp.mul(b3, t2);
          Z3 = Fp.add(X3, Z3);
          X3 = Fp.sub(t1, Z3);
          Z3 = Fp.add(t1, Z3);
          Y3 = Fp.mul(X3, Z3);
          t1 = Fp.add(t0, t0);
          t1 = Fp.add(t1, t0);
          t2 = Fp.mul(a, t2);
          t4 = Fp.mul(b3, t4);
          t1 = Fp.add(t1, t2);
          t2 = Fp.sub(t0, t2);
          t2 = Fp.mul(a, t2);
          t4 = Fp.add(t4, t2);
          t0 = Fp.mul(t1, t4);
          Y3 = Fp.add(Y3, t0);
          t0 = Fp.mul(t5, t4);
          X3 = Fp.mul(t3, X3);
          X3 = Fp.sub(X3, t0);
          t0 = Fp.mul(t3, t1);
          Z3 = Fp.mul(t5, Z3);
          Z3 = Fp.add(Z3, t0);
          return new Point(X3, Y3, Z3);
        }
        subtract(other) {
          return this.add(other.negate());
        }
        is0() {
          return this.equals(Point.ZERO);
        }
        wNAF(n) {
          return wnaf.wNAFCached(this, n, Point.normalizeZ);
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(sc) {
          ut2.aInRange("scalar", sc, _0n2, CURVE.n);
          const I = Point.ZERO;
          if (sc === _0n2)
            return I;
          if (sc === _1n2)
            return this;
          const { endo } = CURVE;
          if (!endo)
            return wnaf.unsafeLadder(this, sc);
          let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
          let k1p = I;
          let k2p = I;
          let d = this;
          while (k1 > _0n2 || k2 > _0n2) {
            if (k1 & _1n2)
              k1p = k1p.add(d);
            if (k2 & _1n2)
              k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n2;
            k2 >>= _1n2;
          }
          if (k1neg)
            k1p = k1p.negate();
          if (k2neg)
            k2p = k2p.negate();
          k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          return k1p.add(k2p);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
          const { endo, n: N } = CURVE;
          ut2.aInRange("scalar", scalar, _1n2, N);
          let point, fake;
          if (endo) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
            let { p: k1p, f: f1p } = this.wNAF(k1);
            let { p: k2p, f: f2p } = this.wNAF(k2);
            k1p = wnaf.constTimeNegate(k1neg, k1p);
            k2p = wnaf.constTimeNegate(k2neg, k2p);
            k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
          } else {
            const { p, f } = this.wNAF(scalar);
            point = p;
            fake = f;
          }
          return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
         * Not using Strauss-Shamir trick: precomputation tables are faster.
         * The trick could be useful if both P and Q are not G (not in our case).
         * @returns non-zero affine point
         */
        multiplyAndAddUnsafe(Q, a, b) {
          const G = Point.BASE;
          const mul = (P, a2) => a2 === _0n2 || a2 === _1n2 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
          const sum = mul(this, a).add(mul(Q, b));
          return sum.is0() ? void 0 : sum;
        }
        // Converts Projective point to affine (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        // (x, y, z) ∋ (x=x/z, y=y/z)
        toAffine(iz) {
          return toAffineMemo(this, iz);
        }
        isTorsionFree() {
          const { h: cofactor, isTorsionFree } = CURVE;
          if (cofactor === _1n2)
            return true;
          if (isTorsionFree)
            return isTorsionFree(Point, this);
          throw new Error("isTorsionFree() has not been declared for the elliptic curve");
        }
        clearCofactor() {
          const { h: cofactor, clearCofactor } = CURVE;
          if (cofactor === _1n2)
            return this;
          if (clearCofactor)
            return clearCofactor(Point, this);
          return this.multiplyUnsafe(CURVE.h);
        }
        toRawBytes(isCompressed = true) {
          (0, utils_js_12.abool)("isCompressed", isCompressed);
          this.assertValidity();
          return toBytes(Point, this, isCompressed);
        }
        toHex(isCompressed = true) {
          (0, utils_js_12.abool)("isCompressed", isCompressed);
          return ut2.bytesToHex(this.toRawBytes(isCompressed));
        }
      }
      Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
      Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
      const _bits = CURVE.nBitLength;
      const wnaf = (0, curve_js_1.wNAF)(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
      return {
        CURVE,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder
      };
    }
    function validateOpts(curve2) {
      const opts = (0, curve_js_1.validateBasic)(curve2);
      ut2.validateObject(opts, {
        hash: "hash",
        hmac: "function",
        randomBytes: "function"
      }, {
        bits2int: "function",
        bits2int_modN: "function",
        lowS: "boolean"
      });
      return Object.freeze({ lowS: true, ...opts });
    }
    function weierstrass2(curveDef) {
      const CURVE = validateOpts(curveDef);
      const { Fp, n: CURVE_ORDER } = CURVE;
      const compressedLen = Fp.BYTES + 1;
      const uncompressedLen = 2 * Fp.BYTES + 1;
      function modN(a) {
        return mod2.mod(a, CURVE_ORDER);
      }
      function invN(a) {
        return mod2.invert(a, CURVE_ORDER);
      }
      const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
        ...CURVE,
        toBytes(_c, point, isCompressed) {
          const a = point.toAffine();
          const x = Fp.toBytes(a.x);
          const cat = ut2.concatBytes;
          (0, utils_js_12.abool)("isCompressed", isCompressed);
          if (isCompressed) {
            return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
          } else {
            return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
          }
        },
        fromBytes(bytes2) {
          const len = bytes2.length;
          const head = bytes2[0];
          const tail = bytes2.subarray(1);
          if (len === compressedLen && (head === 2 || head === 3)) {
            const x = ut2.bytesToNumberBE(tail);
            if (!ut2.inRange(x, _1n2, Fp.ORDER))
              throw new Error("Point is not on curve");
            const y2 = weierstrassEquation(x);
            let y;
            try {
              y = Fp.sqrt(y2);
            } catch (sqrtError) {
              const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
              throw new Error("Point is not on curve" + suffix);
            }
            const isYOdd = (y & _1n2) === _1n2;
            const isHeadOdd = (head & 1) === 1;
            if (isHeadOdd !== isYOdd)
              y = Fp.neg(y);
            return { x, y };
          } else if (len === uncompressedLen && head === 4) {
            const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
            const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
            return { x, y };
          } else {
            throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
          }
        }
      });
      const numToNByteStr = (num) => ut2.bytesToHex(ut2.numberToBytesBE(num, CURVE.nByteLength));
      function isBiggerThanHalfOrder(number2) {
        const HALF = CURVE_ORDER >> _1n2;
        return number2 > HALF;
      }
      function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? modN(-s) : s;
      }
      const slcNum = (b, from, to2) => ut2.bytesToNumberBE(b.slice(from, to2));
      class Signature {
        constructor(r, s, recovery) {
          this.r = r;
          this.s = s;
          this.recovery = recovery;
          this.assertValidity();
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
          const l = CURVE.nByteLength;
          hex = (0, utils_js_12.ensureBytes)("compactSignature", hex, l * 2);
          return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
          const { r, s } = exports.DER.toSig((0, utils_js_12.ensureBytes)("DER", hex));
          return new Signature(r, s);
        }
        assertValidity() {
          ut2.aInRange("r", this.r, _1n2, CURVE_ORDER);
          ut2.aInRange("s", this.s, _1n2, CURVE_ORDER);
        }
        addRecoveryBit(recovery) {
          return new Signature(this.r, this.s, recovery);
        }
        recoverPublicKey(msgHash) {
          const { r, s, recovery: rec } = this;
          const h2 = bits2int_modN((0, utils_js_12.ensureBytes)("msgHash", msgHash));
          if (rec == null || ![0, 1, 2, 3].includes(rec))
            throw new Error("recovery id invalid");
          const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
          if (radj >= Fp.ORDER)
            throw new Error("recovery id 2 or 3 invalid");
          const prefix = (rec & 1) === 0 ? "02" : "03";
          const R = Point.fromHex(prefix + numToNByteStr(radj));
          const ir2 = invN(radj);
          const u1 = modN(-h2 * ir2);
          const u2 = modN(s * ir2);
          const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
          if (!Q)
            throw new Error("point at infinify");
          Q.assertValidity();
          return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
          return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
          return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
        }
        // DER-encoded
        toDERRawBytes() {
          return ut2.hexToBytes(this.toDERHex());
        }
        toDERHex() {
          return exports.DER.hexFromSig({ r: this.r, s: this.s });
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
          return ut2.hexToBytes(this.toCompactHex());
        }
        toCompactHex() {
          return numToNByteStr(this.r) + numToNByteStr(this.s);
        }
      }
      const utils2 = {
        isValidPrivateKey(privateKey) {
          try {
            normPrivateKeyToScalar(privateKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
          const length = mod2.getMinHashLength(CURVE.n);
          return mod2.mapHashToField(CURVE.randomBytes(length), CURVE.n);
        },
        /**
         * Creates precompute table for an arbitrary EC point. Makes point "cached".
         * Allows to massively speed-up `point.multiply(scalar)`.
         * @returns cached point
         * @example
         * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
         * fast.multiply(privKey); // much faster ECDH now
         */
        precompute(windowSize = 8, point = Point.BASE) {
          point._setWindowSize(windowSize);
          point.multiply(BigInt(3));
          return point;
        }
      };
      function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
      }
      function isProbPub(item) {
        const arr = ut2.isBytes(item);
        const str = typeof item === "string";
        const len = (arr || str) && item.length;
        if (arr)
          return len === compressedLen || len === uncompressedLen;
        if (str)
          return len === 2 * compressedLen || len === 2 * uncompressedLen;
        if (item instanceof Point)
          return true;
        return false;
      }
      function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA))
          throw new Error("first arg must be private key");
        if (!isProbPub(publicB))
          throw new Error("second arg must be public key");
        const b = Point.fromHex(publicB);
        return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
      }
      const bits2int = CURVE.bits2int || function(bytes2) {
        const num = ut2.bytesToNumberBE(bytes2);
        const delta = bytes2.length * 8 - CURVE.nBitLength;
        return delta > 0 ? num >> BigInt(delta) : num;
      };
      const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
        return modN(bits2int(bytes2));
      };
      const ORDER_MASK = ut2.bitMask(CURVE.nBitLength);
      function int2octets(num) {
        ut2.aInRange(`num < 2^${CURVE.nBitLength}`, num, _0n2, ORDER_MASK);
        return ut2.numberToBytesBE(num, CURVE.nByteLength);
      }
      function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (["recovered", "canonical"].some((k) => k in opts))
          throw new Error("sign() legacy options not supported");
        const { hash: hash2, randomBytes } = CURVE;
        let { lowS, prehash, extraEntropy: ent } = opts;
        if (lowS == null)
          lowS = true;
        msgHash = (0, utils_js_12.ensureBytes)("msgHash", msgHash);
        validateSigVerOpts(opts);
        if (prehash)
          msgHash = (0, utils_js_12.ensureBytes)("prehashed msgHash", hash2(msgHash));
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey);
        const seedArgs = [int2octets(d), int2octets(h1int)];
        if (ent != null && ent !== false) {
          const e = ent === true ? randomBytes(Fp.BYTES) : ent;
          seedArgs.push((0, utils_js_12.ensureBytes)("extraEntropy", e));
        }
        const seed = ut2.concatBytes(...seedArgs);
        const m = h1int;
        function k2sig(kBytes) {
          const k = bits2int(kBytes);
          if (!isWithinCurveOrder(k))
            return;
          const ik = invN(k);
          const q = Point.BASE.multiply(k).toAffine();
          const r = modN(q.x);
          if (r === _0n2)
            return;
          const s = modN(ik * modN(m + r * d));
          if (s === _0n2)
            return;
          let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n2);
          let normS = s;
          if (lowS && isBiggerThanHalfOrder(s)) {
            normS = normalizeS(s);
            recovery ^= 1;
          }
          return new Signature(r, normS, recovery);
        }
        return { seed, k2sig };
      }
      const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
      const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
      function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts);
        const C = CURVE;
        const drbg = ut2.createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
        return drbg(seed, k2sig);
      }
      Point.BASE._setWindowSize(8);
      function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        var _a2;
        const sg = signature;
        msgHash = (0, utils_js_12.ensureBytes)("msgHash", msgHash);
        publicKey = (0, utils_js_12.ensureBytes)("publicKey", publicKey);
        if ("strict" in opts)
          throw new Error("options.strict was renamed to lowS");
        validateSigVerOpts(opts);
        const { lowS, prehash } = opts;
        let _sig = void 0;
        let P;
        try {
          if (typeof sg === "string" || ut2.isBytes(sg)) {
            try {
              _sig = Signature.fromDER(sg);
            } catch (derError) {
              if (!(derError instanceof exports.DER.Err))
                throw derError;
              _sig = Signature.fromCompact(sg);
            }
          } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
            const { r: r2, s: s2 } = sg;
            _sig = new Signature(r2, s2);
          } else {
            throw new Error("PARSE");
          }
          P = Point.fromHex(publicKey);
        } catch (error) {
          if (error.message === "PARSE")
            throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
          return false;
        }
        if (lowS && _sig.hasHighS())
          return false;
        if (prehash)
          msgHash = CURVE.hash(msgHash);
        const { r, s } = _sig;
        const h2 = bits2int_modN(msgHash);
        const is = invN(s);
        const u1 = modN(h2 * is);
        const u2 = modN(r * is);
        const R = (_a2 = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)) == null ? void 0 : _a2.toAffine();
        if (!R)
          return false;
        const v = modN(R.x);
        return v === r;
      }
      return {
        CURVE,
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        ProjectivePoint: Point,
        Signature,
        utils: utils2
      };
    }
    function SWUFpSqrtRatio(Fp, Z) {
      const q = Fp.ORDER;
      let l = _0n2;
      for (let o = q - _1n2; o % _2n2 === _0n2; o /= _2n2)
        l += _1n2;
      const c1 = l;
      const _2n_pow_c1_1 = _2n2 << c1 - _1n2 - _1n2;
      const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
      const c2 = (q - _1n2) / _2n_pow_c1;
      const c3 = (c2 - _1n2) / _2n2;
      const c4 = _2n_pow_c1 - _1n2;
      const c5 = _2n_pow_c1_1;
      const c6 = Fp.pow(Z, c2);
      const c7 = Fp.pow(Z, (c2 + _1n2) / _2n2);
      let sqrtRatio = (u, v) => {
        let tv1 = c6;
        let tv2 = Fp.pow(v, c4);
        let tv3 = Fp.sqr(tv2);
        tv3 = Fp.mul(tv3, v);
        let tv5 = Fp.mul(u, tv3);
        tv5 = Fp.pow(tv5, c3);
        tv5 = Fp.mul(tv5, tv2);
        tv2 = Fp.mul(tv5, v);
        tv3 = Fp.mul(tv5, u);
        let tv4 = Fp.mul(tv3, tv2);
        tv5 = Fp.pow(tv4, c5);
        let isQR = Fp.eql(tv5, Fp.ONE);
        tv2 = Fp.mul(tv3, c7);
        tv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, isQR);
        tv4 = Fp.cmov(tv5, tv4, isQR);
        for (let i = c1; i > _1n2; i--) {
          let tv52 = i - _2n2;
          tv52 = _2n2 << tv52 - _1n2;
          let tvv5 = Fp.pow(tv4, tv52);
          const e1 = Fp.eql(tvv5, Fp.ONE);
          tv2 = Fp.mul(tv3, tv1);
          tv1 = Fp.mul(tv1, tv1);
          tvv5 = Fp.mul(tv4, tv1);
          tv3 = Fp.cmov(tv2, tv3, e1);
          tv4 = Fp.cmov(tvv5, tv4, e1);
        }
        return { isValid: isQR, value: tv3 };
      };
      if (Fp.ORDER % _4n2 === _3n2) {
        const c12 = (Fp.ORDER - _3n2) / _4n2;
        const c22 = Fp.sqrt(Fp.neg(Z));
        sqrtRatio = (u, v) => {
          let tv1 = Fp.sqr(v);
          const tv2 = Fp.mul(u, v);
          tv1 = Fp.mul(tv1, tv2);
          let y1 = Fp.pow(tv1, c12);
          y1 = Fp.mul(y1, tv2);
          const y2 = Fp.mul(y1, c22);
          const tv3 = Fp.mul(Fp.sqr(y1), v);
          const isQR = Fp.eql(tv3, u);
          let y = Fp.cmov(y2, y1, isQR);
          return { isValid: isQR, value: y };
        };
      }
      return sqrtRatio;
    }
    function mapToCurveSimpleSWU(Fp, opts) {
      mod2.validateField(Fp);
      if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
        throw new Error("mapToCurveSimpleSWU: invalid opts");
      const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
      if (!Fp.isOdd)
        throw new Error("Fp.isOdd is not implemented!");
      return (u) => {
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u);
        tv1 = Fp.mul(tv1, opts.Z);
        tv2 = Fp.sqr(tv1);
        tv2 = Fp.add(tv2, tv1);
        tv3 = Fp.add(tv2, Fp.ONE);
        tv3 = Fp.mul(tv3, opts.B);
        tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
        tv4 = Fp.mul(tv4, opts.A);
        tv2 = Fp.sqr(tv3);
        tv6 = Fp.sqr(tv4);
        tv5 = Fp.mul(tv6, opts.A);
        tv2 = Fp.add(tv2, tv5);
        tv2 = Fp.mul(tv2, tv3);
        tv6 = Fp.mul(tv6, tv4);
        tv5 = Fp.mul(tv6, opts.B);
        tv2 = Fp.add(tv2, tv5);
        x = Fp.mul(tv1, tv3);
        const { isValid: isValid2, value } = sqrtRatio(tv2, tv6);
        y = Fp.mul(tv1, u);
        y = Fp.mul(y, value);
        x = Fp.cmov(x, tv3, isValid2);
        y = Fp.cmov(y, value, isValid2);
        const e1 = Fp.isOdd(u) === Fp.isOdd(y);
        y = Fp.cmov(Fp.neg(y), y, e1);
        x = Fp.div(x, tv4);
        return { x, y };
      };
    }
  })(weierstrass);
  Object.defineProperty(bls$1, "__esModule", { value: true });
  bls$1.bls = bls;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const modular_js_1 = modular;
  const utils_js_1$2 = utils$2;
  const hash_to_curve_js_1 = hashToCurve;
  const weierstrass_js_1 = weierstrass;
  const _0n$1 = BigInt(0), _1n$1 = BigInt(1), _2n$1 = BigInt(2), _3n$1 = BigInt(3);
  function NAfDecomposition(a) {
    const res = [];
    for (; a > _1n$1; a >>= _1n$1) {
      if ((a & _1n$1) === _0n$1)
        res.unshift(0);
      else if ((a & _3n$1) === _3n$1) {
        res.unshift(-1);
        a += _1n$1;
      } else
        res.unshift(1);
    }
    return res;
  }
  function bls(CURVE) {
    const { Fp, Fr: Fr2, Fp2, Fp6, Fp12 } = CURVE.fields;
    const BLS_X_IS_NEGATIVE = CURVE.params.xNegative;
    const TWIST = CURVE.params.twistType;
    const G1_ = (0, weierstrass_js_1.weierstrassPoints)({ n: Fr2.ORDER, ...CURVE.G1 });
    const G1 = Object.assign(G1_, (0, hash_to_curve_js_1.createHasher)(G1_.ProjectivePoint, CURVE.G1.mapToCurve, {
      ...CURVE.htfDefaults,
      ...CURVE.G1.htfDefaults
    }));
    const G2_ = (0, weierstrass_js_1.weierstrassPoints)({ n: Fr2.ORDER, ...CURVE.G2 });
    const G2 = Object.assign(G2_, (0, hash_to_curve_js_1.createHasher)(G2_.ProjectivePoint, CURVE.G2.mapToCurve, {
      ...CURVE.htfDefaults,
      ...CURVE.G2.htfDefaults
    }));
    let lineFunction;
    if (TWIST === "multiplicative") {
      lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul014(f, c0, Fp2.mul(c1, Px), Fp2.mul(c2, Py));
    } else if (TWIST === "divisive") {
      lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul034(f, Fp2.mul(c2, Py), Fp2.mul(c1, Px), c0);
    } else
      throw new Error("bls: unknown twist type");
    const Fp2div2 = Fp2.div(Fp2.ONE, Fp2.mul(Fp2.ONE, _2n$1));
    function pointDouble(ell, Rx, Ry, Rz) {
      const t0 = Fp2.sqr(Ry);
      const t1 = Fp2.sqr(Rz);
      const t2 = Fp2.mulByB(Fp2.mul(t1, _3n$1));
      const t3 = Fp2.mul(t2, _3n$1);
      const t4 = Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(Ry, Rz)), t1), t0);
      const c0 = Fp2.sub(t2, t0);
      const c1 = Fp2.mul(Fp2.sqr(Rx), _3n$1);
      const c2 = Fp2.neg(t4);
      ell.push([c0, c1, c2]);
      Rx = Fp2.mul(Fp2.mul(Fp2.mul(Fp2.sub(t0, t3), Rx), Ry), Fp2div2);
      Ry = Fp2.sub(Fp2.sqr(Fp2.mul(Fp2.add(t0, t3), Fp2div2)), Fp2.mul(Fp2.sqr(t2), _3n$1));
      Rz = Fp2.mul(t0, t4);
      return { Rx, Ry, Rz };
    }
    function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
      const t0 = Fp2.sub(Ry, Fp2.mul(Qy, Rz));
      const t1 = Fp2.sub(Rx, Fp2.mul(Qx, Rz));
      const c0 = Fp2.sub(Fp2.mul(t0, Qx), Fp2.mul(t1, Qy));
      const c1 = Fp2.neg(t0);
      const c2 = t1;
      ell.push([c0, c1, c2]);
      const t2 = Fp2.sqr(t1);
      const t3 = Fp2.mul(t2, t1);
      const t4 = Fp2.mul(t2, Rx);
      const t5 = Fp2.add(Fp2.sub(t3, Fp2.mul(t4, _2n$1)), Fp2.mul(Fp2.sqr(t0), Rz));
      Rx = Fp2.mul(t1, t5);
      Ry = Fp2.sub(Fp2.mul(Fp2.sub(t4, t5), t0), Fp2.mul(t3, Ry));
      Rz = Fp2.mul(Rz, t3);
      return { Rx, Ry, Rz };
    }
    const ATE_NAF = NAfDecomposition(CURVE.params.ateLoopSize);
    const calcPairingPrecomputes = (0, utils_js_1$2.memoized)((point) => {
      const p = point;
      const { x, y } = p.toAffine();
      const Qx = x, Qy = y, negQy = Fp2.neg(y);
      let Rx = Qx, Ry = Qy, Rz = Fp2.ONE;
      const ell = [];
      for (const bit of ATE_NAF) {
        const cur = [];
        ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
        if (bit)
          ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
        ell.push(cur);
      }
      if (CURVE.postPrecompute) {
        const last = ell[ell.length - 1];
        CURVE.postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
      }
      return ell;
    });
    function millerLoopBatch(pairs, withFinalExponent = false) {
      let f12 = Fp12.ONE;
      if (pairs.length) {
        const ellLen = pairs[0][0].length;
        for (let i = 0; i < ellLen; i++) {
          f12 = Fp12.sqr(f12);
          for (const [ell, Px, Py] of pairs) {
            for (const [c0, c1, c2] of ell[i])
              f12 = lineFunction(c0, c1, c2, f12, Px, Py);
          }
        }
      }
      if (BLS_X_IS_NEGATIVE)
        f12 = Fp12.conjugate(f12);
      return withFinalExponent ? Fp12.finalExponentiate(f12) : f12;
    }
    function pairingBatch(pairs, withFinalExponent = true) {
      const res = [];
      G1.ProjectivePoint.normalizeZ(pairs.map(({ g1 }) => g1));
      G2.ProjectivePoint.normalizeZ(pairs.map(({ g2 }) => g2));
      for (const { g1, g2 } of pairs) {
        if (g1.equals(G1.ProjectivePoint.ZERO) || g2.equals(G2.ProjectivePoint.ZERO))
          throw new Error("pairing is not available for ZERO point");
        g1.assertValidity();
        g2.assertValidity();
        const Qa2 = g1.toAffine();
        res.push([calcPairingPrecomputes(g2), Qa2.x, Qa2.y]);
      }
      return millerLoopBatch(res, withFinalExponent);
    }
    function pairing(Q, P, withFinalExponent = true) {
      return pairingBatch([{ g1: Q, g2: P }], withFinalExponent);
    }
    const utils2 = {
      randomPrivateKey: () => {
        const length = (0, modular_js_1.getMinHashLength)(Fr2.ORDER);
        return (0, modular_js_1.mapHashToField)(CURVE.randomBytes(length), Fr2.ORDER);
      },
      calcPairingPrecomputes
    };
    const { ShortSignature } = CURVE.G1;
    const { Signature } = CURVE.G2;
    function normP1(point) {
      return point instanceof G1.ProjectivePoint ? point : G1.ProjectivePoint.fromHex(point);
    }
    function normP1Hash(point, htfOpts) {
      return point instanceof G1.ProjectivePoint ? point : G1.hashToCurve((0, utils_js_1$2.ensureBytes)("point", point), htfOpts);
    }
    function normP2(point) {
      return point instanceof G2.ProjectivePoint ? point : Signature.fromHex(point);
    }
    function normP2Hash(point, htfOpts) {
      return point instanceof G2.ProjectivePoint ? point : G2.hashToCurve((0, utils_js_1$2.ensureBytes)("point", point), htfOpts);
    }
    function getPublicKey(privateKey) {
      return G1.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
    }
    function getPublicKeyForShortSignatures(privateKey) {
      return G2.ProjectivePoint.fromPrivateKey(privateKey).toRawBytes(true);
    }
    function sign(message2, privateKey, htfOpts) {
      const msgPoint = normP2Hash(message2, htfOpts);
      msgPoint.assertValidity();
      const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
      if (message2 instanceof G2.ProjectivePoint)
        return sigPoint;
      return Signature.toRawBytes(sigPoint);
    }
    function signShortSignature(message2, privateKey, htfOpts) {
      const msgPoint = normP1Hash(message2, htfOpts);
      msgPoint.assertValidity();
      const sigPoint = msgPoint.multiply(G1.normPrivateKeyToScalar(privateKey));
      if (message2 instanceof G1.ProjectivePoint)
        return sigPoint;
      return ShortSignature.toRawBytes(sigPoint);
    }
    function verify(signature, message2, publicKey, htfOpts) {
      const P = normP1(publicKey);
      const Hm = normP2Hash(message2, htfOpts);
      const G = G1.ProjectivePoint.BASE;
      const S = normP2(signature);
      const exp = pairingBatch([
        { g1: P.negate(), g2: Hm },
        // ePHM = pairing(P.negate(), Hm, false);
        { g1: G, g2: S }
        // eGS = pairing(G, S, false);
      ]);
      return Fp12.eql(exp, Fp12.ONE);
    }
    function verifyShortSignature(signature, message2, publicKey, htfOpts) {
      const P = normP2(publicKey);
      const Hm = normP1Hash(message2, htfOpts);
      const G = G2.ProjectivePoint.BASE;
      const S = normP1(signature);
      const exp = pairingBatch([
        { g1: Hm, g2: P },
        // eHmP = pairing(Hm, P, false);
        { g1: S, g2: G.negate() }
        // eSG = pairing(S, G.negate(), false);
      ]);
      return Fp12.eql(exp, Fp12.ONE);
    }
    function aggregatePublicKeys(publicKeys) {
      if (!publicKeys.length)
        throw new Error("Expected non-empty array");
      const agg = publicKeys.map(normP1).reduce((sum, p) => sum.add(p), G1.ProjectivePoint.ZERO);
      const aggAffine = agg;
      if (publicKeys[0] instanceof G1.ProjectivePoint) {
        aggAffine.assertValidity();
        return aggAffine;
      }
      return aggAffine.toRawBytes(true);
    }
    function aggregateSignatures(signatures) {
      if (!signatures.length)
        throw new Error("Expected non-empty array");
      const agg = signatures.map(normP2).reduce((sum, s) => sum.add(s), G2.ProjectivePoint.ZERO);
      const aggAffine = agg;
      if (signatures[0] instanceof G2.ProjectivePoint) {
        aggAffine.assertValidity();
        return aggAffine;
      }
      return Signature.toRawBytes(aggAffine);
    }
    function aggregateShortSignatures(signatures) {
      if (!signatures.length)
        throw new Error("Expected non-empty array");
      const agg = signatures.map(normP1).reduce((sum, s) => sum.add(s), G1.ProjectivePoint.ZERO);
      const aggAffine = agg;
      if (signatures[0] instanceof G1.ProjectivePoint) {
        aggAffine.assertValidity();
        return aggAffine;
      }
      return ShortSignature.toRawBytes(aggAffine);
    }
    function verifyBatch(signature, messages, publicKeys, htfOpts) {
      if (!messages.length)
        throw new Error("Expected non-empty messages array");
      if (publicKeys.length !== messages.length)
        throw new Error("Pubkey count should equal msg count");
      const sig = normP2(signature);
      const nMessages = messages.map((i) => normP2Hash(i, htfOpts));
      const nPublicKeys = publicKeys.map(normP1);
      const messagePubKeyMap = /* @__PURE__ */ new Map();
      for (let i = 0; i < nPublicKeys.length; i++) {
        const pub = nPublicKeys[i];
        const msg = nMessages[i];
        let keys = messagePubKeyMap.get(msg);
        if (keys === void 0) {
          keys = [];
          messagePubKeyMap.set(msg, keys);
        }
        keys.push(pub);
      }
      const paired = [];
      try {
        for (const [msg, keys] of messagePubKeyMap) {
          const groupPublicKey = keys.reduce((acc, msg2) => acc.add(msg2));
          paired.push({ g1: groupPublicKey, g2: msg });
        }
        paired.push({ g1: G1.ProjectivePoint.BASE.negate(), g2: sig });
        return Fp12.eql(pairingBatch(paired), Fp12.ONE);
      } catch {
        return false;
      }
    }
    G1.ProjectivePoint.BASE._setWindowSize(4);
    return {
      getPublicKey,
      getPublicKeyForShortSignatures,
      sign,
      signShortSignature,
      verify,
      verifyBatch,
      verifyShortSignature,
      aggregatePublicKeys,
      aggregateSignatures,
      aggregateShortSignatures,
      millerLoopBatch,
      pairing,
      pairingBatch,
      G1,
      G2,
      Signature,
      ShortSignature,
      fields: {
        Fr: Fr2,
        Fp,
        Fp2,
        Fp6,
        Fp12
      },
      params: {
        ateLoopSize: CURVE.params.ateLoopSize,
        r: CURVE.params.r,
        G1b: CURVE.G1.b,
        G2b: CURVE.G2.b
      },
      utils: utils2
    };
  }
  var tower = {};
  Object.defineProperty(tower, "__esModule", { value: true });
  tower.psiFrobenius = psiFrobenius;
  tower.tower12 = tower12;
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  const mod = modular;
  const utils_js_1$1 = utils$2;
  const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
  function calcFrobeniusCoefficients(Fp, nonResidue, modulus, degree, num = 1, divisor) {
    const _divisor = BigInt(divisor === void 0 ? degree : divisor);
    const towerModulus = modulus ** BigInt(degree);
    const res = [];
    for (let i = 0; i < num; i++) {
      const a = BigInt(i + 1);
      const powers = [];
      for (let j = 0, qPower = _1n; j < degree; j++) {
        const power = (a * qPower - a) / _divisor % towerModulus;
        powers.push(Fp.pow(nonResidue, power));
        qPower *= modulus;
      }
      res.push(powers);
    }
    return res;
  }
  function psiFrobenius(Fp, Fp2, base) {
    const PSI_X = Fp2.pow(base, (Fp.ORDER - _1n) / _3n);
    const PSI_Y = Fp2.pow(base, (Fp.ORDER - _1n) / _2n);
    function psi(x, y) {
      const x2 = Fp2.mul(Fp2.frobeniusMap(x, 1), PSI_X);
      const y2 = Fp2.mul(Fp2.frobeniusMap(y, 1), PSI_Y);
      return [x2, y2];
    }
    const PSI2_X = Fp2.pow(base, (Fp.ORDER ** _2n - _1n) / _3n);
    const PSI2_Y = Fp2.pow(base, (Fp.ORDER ** _2n - _1n) / _2n);
    if (!Fp2.eql(PSI2_Y, Fp2.neg(Fp2.ONE)))
      throw new Error("psiFrobenius: PSI2_Y!==-1");
    function psi2(x, y) {
      return [Fp2.mul(x, PSI2_X), Fp2.neg(y)];
    }
    const mapAffine = (fn2) => (c, P) => {
      const affine = P.toAffine();
      const p = fn2(affine.x, affine.y);
      return c.fromAffine({ x: p[0], y: p[1] });
    };
    const G2psi = mapAffine(psi);
    const G2psi2 = mapAffine(psi2);
    return { psi, psi2, G2psi, G2psi2, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
  }
  function tower12(opts) {
    const { ORDER } = opts;
    const Fp = mod.Field(ORDER);
    const FpNONRESIDUE = Fp.create(opts.NONRESIDUE || BigInt(-1));
    const FpLegendre2 = mod.FpLegendre(ORDER);
    const Fpdiv2 = Fp.div(Fp.ONE, _2n);
    const FP2_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp, FpNONRESIDUE, Fp.ORDER, 2)[0];
    const Fp2Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
      c0: Fp.add(c0, r0),
      c1: Fp.add(c1, r1)
    });
    const Fp2Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
      c0: Fp.sub(c0, r0),
      c1: Fp.sub(c1, r1)
    });
    const Fp2Multiply = ({ c0, c1 }, rhs) => {
      if (typeof rhs === "bigint")
        return { c0: Fp.mul(c0, rhs), c1: Fp.mul(c1, rhs) };
      const { c0: r0, c1: r1 } = rhs;
      let t1 = Fp.mul(c0, r0);
      let t2 = Fp.mul(c1, r1);
      const o0 = Fp.sub(t1, t2);
      const o1 = Fp.sub(Fp.mul(Fp.add(c0, c1), Fp.add(r0, r1)), Fp.add(t1, t2));
      return { c0: o0, c1: o1 };
    };
    const Fp2Square = ({ c0, c1 }) => {
      const a = Fp.add(c0, c1);
      const b = Fp.sub(c0, c1);
      const c = Fp.add(c0, c0);
      return { c0: Fp.mul(a, b), c1: Fp.mul(c, c1) };
    };
    const Fp2fromBigTuple = (tuple) => {
      if (tuple.length !== 2)
        throw new Error("Invalid tuple");
      const fps = tuple.map((n) => Fp.create(n));
      return { c0: fps[0], c1: fps[1] };
    };
    const FP2_ORDER = ORDER * ORDER;
    const Fp2Nonresidue = Fp2fromBigTuple(opts.FP2_NONRESIDUE);
    const Fp2 = {
      ORDER: FP2_ORDER,
      NONRESIDUE: Fp2Nonresidue,
      BITS: (0, utils_js_1$1.bitLen)(FP2_ORDER),
      BYTES: Math.ceil((0, utils_js_1$1.bitLen)(FP2_ORDER) / 8),
      MASK: (0, utils_js_1$1.bitMask)((0, utils_js_1$1.bitLen)(FP2_ORDER)),
      ZERO: { c0: Fp.ZERO, c1: Fp.ZERO },
      ONE: { c0: Fp.ONE, c1: Fp.ZERO },
      create: (num) => num,
      isValid: ({ c0, c1 }) => typeof c0 === "bigint" && typeof c1 === "bigint",
      is0: ({ c0, c1 }) => Fp.is0(c0) && Fp.is0(c1),
      eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp.eql(c0, r0) && Fp.eql(c1, r1),
      neg: ({ c0, c1 }) => ({ c0: Fp.neg(c0), c1: Fp.neg(c1) }),
      pow: (num, power) => mod.FpPow(Fp2, num, power),
      invertBatch: (nums) => mod.FpInvertBatch(Fp2, nums),
      // Normalized
      add: Fp2Add,
      sub: Fp2Subtract,
      mul: Fp2Multiply,
      sqr: Fp2Square,
      // NonNormalized stuff
      addN: Fp2Add,
      subN: Fp2Subtract,
      mulN: Fp2Multiply,
      sqrN: Fp2Square,
      // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
      div: (lhs, rhs) => Fp2.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : Fp2.inv(rhs)),
      inv: ({ c0: a, c1: b }) => {
        const factor = Fp.inv(Fp.create(a * a + b * b));
        return { c0: Fp.mul(factor, Fp.create(a)), c1: Fp.mul(factor, Fp.create(-b)) };
      },
      sqrt: (num) => {
        if (opts.Fp2sqrt)
          return opts.Fp2sqrt(num);
        const { c0, c1 } = num;
        if (Fp.is0(c1)) {
          if (Fp.eql(FpLegendre2(Fp, c0), Fp.ONE))
            return Fp2.create({ c0: Fp.sqrt(c0), c1: Fp.ZERO });
          else
            return Fp2.create({ c0: Fp.ZERO, c1: Fp.sqrt(Fp.div(c0, FpNONRESIDUE)) });
        }
        const a = Fp.sqrt(Fp.sub(Fp.sqr(c0), Fp.mul(Fp.sqr(c1), FpNONRESIDUE)));
        let d = Fp.mul(Fp.add(a, c0), Fpdiv2);
        const legendre = FpLegendre2(Fp, d);
        if (!Fp.is0(legendre) && !Fp.eql(legendre, Fp.ONE))
          d = Fp.sub(d, a);
        const a0 = Fp.sqrt(d);
        const candidateSqrt = Fp2.create({ c0: a0, c1: Fp.div(Fp.mul(c1, Fpdiv2), a0) });
        if (!Fp2.eql(Fp2.sqr(candidateSqrt), num))
          throw new Error("Cannot find square root");
        const x1 = candidateSqrt;
        const x2 = Fp2.neg(x1);
        const { re: re1, im: im1 } = Fp2.reim(x1);
        const { re: re2, im: im2 } = Fp2.reim(x2);
        if (im1 > im2 || im1 === im2 && re1 > re2)
          return x1;
        return x2;
      },
      // Same as sgn0_m_eq_2 in RFC 9380
      isOdd: (x) => {
        const { re: x0, im: x1 } = Fp2.reim(x);
        const sign_0 = x0 % _2n;
        const zero_0 = x0 === _0n;
        const sign_1 = x1 % _2n;
        return BigInt(sign_0 || zero_0 && sign_1) == _1n;
      },
      // Bytes util
      fromBytes(b) {
        if (b.length !== Fp2.BYTES)
          throw new Error(`fromBytes wrong length=${b.length}`);
        return { c0: Fp.fromBytes(b.subarray(0, Fp.BYTES)), c1: Fp.fromBytes(b.subarray(Fp.BYTES)) };
      },
      toBytes: ({ c0, c1 }) => (0, utils_js_1$1.concatBytes)(Fp.toBytes(c0), Fp.toBytes(c1)),
      cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
        c0: Fp.cmov(c0, r0, c),
        c1: Fp.cmov(c1, r1, c)
      }),
      reim: ({ c0, c1 }) => ({ re: c0, im: c1 }),
      // multiply by u + 1
      mulByNonresidue: ({ c0, c1 }) => Fp2.mul({ c0, c1 }, Fp2Nonresidue),
      mulByB: opts.Fp2mulByB,
      fromBigTuple: Fp2fromBigTuple,
      frobeniusMap: ({ c0, c1 }, power) => ({
        c0,
        c1: Fp.mul(c1, FP2_FROBENIUS_COEFFICIENTS[power % 2])
      })
    };
    const Fp6Add = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
      c0: Fp2.add(c0, r0),
      c1: Fp2.add(c1, r1),
      c2: Fp2.add(c2, r2)
    });
    const Fp6Subtract = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
      c0: Fp2.sub(c0, r0),
      c1: Fp2.sub(c1, r1),
      c2: Fp2.sub(c2, r2)
    });
    const Fp6Multiply = ({ c0, c1, c2 }, rhs) => {
      if (typeof rhs === "bigint") {
        return {
          c0: Fp2.mul(c0, rhs),
          c1: Fp2.mul(c1, rhs),
          c2: Fp2.mul(c2, rhs)
        };
      }
      const { c0: r0, c1: r1, c2: r2 } = rhs;
      const t0 = Fp2.mul(c0, r0);
      const t1 = Fp2.mul(c1, r1);
      const t2 = Fp2.mul(c2, r2);
      return {
        // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
        c0: Fp2.add(t0, Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), Fp2.add(r1, r2)), Fp2.add(t1, t2)))),
        // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
        c1: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c1), Fp2.add(r0, r1)), Fp2.add(t0, t1)), Fp2.mulByNonresidue(t2)),
        // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
        c2: Fp2.sub(Fp2.add(t1, Fp2.mul(Fp2.add(c0, c2), Fp2.add(r0, r2))), Fp2.add(t0, t2))
      };
    };
    const Fp6Square = ({ c0, c1, c2 }) => {
      let t0 = Fp2.sqr(c0);
      let t1 = Fp2.mul(Fp2.mul(c0, c1), _2n);
      let t3 = Fp2.mul(Fp2.mul(c1, c2), _2n);
      let t4 = Fp2.sqr(c2);
      return {
        c0: Fp2.add(Fp2.mulByNonresidue(t3), t0),
        // T3 * (u + 1) + T0
        c1: Fp2.add(Fp2.mulByNonresidue(t4), t1),
        // T4 * (u + 1) + T1
        // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
        c2: Fp2.sub(Fp2.sub(Fp2.add(Fp2.add(t1, Fp2.sqr(Fp2.add(Fp2.sub(c0, c1), c2))), t3), t0), t4)
      };
    };
    const [FP6_FROBENIUS_COEFFICIENTS_1, FP6_FROBENIUS_COEFFICIENTS_2] = calcFrobeniusCoefficients(Fp2, Fp2Nonresidue, Fp.ORDER, 6, 2, 3);
    const Fp6 = {
      ORDER: Fp2.ORDER,
      // TODO: unused, but need to verify
      BITS: 3 * Fp2.BITS,
      BYTES: 3 * Fp2.BYTES,
      MASK: (0, utils_js_1$1.bitMask)(3 * Fp2.BITS),
      ZERO: { c0: Fp2.ZERO, c1: Fp2.ZERO, c2: Fp2.ZERO },
      ONE: { c0: Fp2.ONE, c1: Fp2.ZERO, c2: Fp2.ZERO },
      create: (num) => num,
      isValid: ({ c0, c1, c2 }) => Fp2.isValid(c0) && Fp2.isValid(c1) && Fp2.isValid(c2),
      is0: ({ c0, c1, c2 }) => Fp2.is0(c0) && Fp2.is0(c1) && Fp2.is0(c2),
      neg: ({ c0, c1, c2 }) => ({ c0: Fp2.neg(c0), c1: Fp2.neg(c1), c2: Fp2.neg(c2) }),
      eql: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => Fp2.eql(c0, r0) && Fp2.eql(c1, r1) && Fp2.eql(c2, r2),
      sqrt: utils_js_1$1.notImplemented,
      // Do we need division by bigint at all? Should be done via order:
      div: (lhs, rhs) => Fp6.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : Fp6.inv(rhs)),
      pow: (num, power) => mod.FpPow(Fp6, num, power),
      invertBatch: (nums) => mod.FpInvertBatch(Fp6, nums),
      // Normalized
      add: Fp6Add,
      sub: Fp6Subtract,
      mul: Fp6Multiply,
      sqr: Fp6Square,
      // NonNormalized stuff
      addN: Fp6Add,
      subN: Fp6Subtract,
      mulN: Fp6Multiply,
      sqrN: Fp6Square,
      inv: ({ c0, c1, c2 }) => {
        let t0 = Fp2.sub(Fp2.sqr(c0), Fp2.mulByNonresidue(Fp2.mul(c2, c1)));
        let t1 = Fp2.sub(Fp2.mulByNonresidue(Fp2.sqr(c2)), Fp2.mul(c0, c1));
        let t2 = Fp2.sub(Fp2.sqr(c1), Fp2.mul(c0, c2));
        let t4 = Fp2.inv(Fp2.add(Fp2.mulByNonresidue(Fp2.add(Fp2.mul(c2, t1), Fp2.mul(c1, t2))), Fp2.mul(c0, t0)));
        return { c0: Fp2.mul(t4, t0), c1: Fp2.mul(t4, t1), c2: Fp2.mul(t4, t2) };
      },
      // Bytes utils
      fromBytes: (b) => {
        if (b.length !== Fp6.BYTES)
          throw new Error(`fromBytes wrong length=${b.length}`);
        return {
          c0: Fp2.fromBytes(b.subarray(0, Fp2.BYTES)),
          c1: Fp2.fromBytes(b.subarray(Fp2.BYTES, 2 * Fp2.BYTES)),
          c2: Fp2.fromBytes(b.subarray(2 * Fp2.BYTES))
        };
      },
      toBytes: ({ c0, c1, c2 }) => (0, utils_js_1$1.concatBytes)(Fp2.toBytes(c0), Fp2.toBytes(c1), Fp2.toBytes(c2)),
      cmov: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c) => ({
        c0: Fp2.cmov(c0, r0, c),
        c1: Fp2.cmov(c1, r1, c),
        c2: Fp2.cmov(c2, r2, c)
      }),
      fromBigSix: (t2) => {
        if (!Array.isArray(t2) || t2.length !== 6)
          throw new Error("Invalid Fp6 usage");
        return {
          c0: Fp2.fromBigTuple(t2.slice(0, 2)),
          c1: Fp2.fromBigTuple(t2.slice(2, 4)),
          c2: Fp2.fromBigTuple(t2.slice(4, 6))
        };
      },
      frobeniusMap: ({ c0, c1, c2 }, power) => ({
        c0: Fp2.frobeniusMap(c0, power),
        c1: Fp2.mul(Fp2.frobeniusMap(c1, power), FP6_FROBENIUS_COEFFICIENTS_1[power % 6]),
        c2: Fp2.mul(Fp2.frobeniusMap(c2, power), FP6_FROBENIUS_COEFFICIENTS_2[power % 6])
      }),
      mulByFp2: ({ c0, c1, c2 }, rhs) => ({
        c0: Fp2.mul(c0, rhs),
        c1: Fp2.mul(c1, rhs),
        c2: Fp2.mul(c2, rhs)
      }),
      mulByNonresidue: ({ c0, c1, c2 }) => ({ c0: Fp2.mulByNonresidue(c2), c1: c0, c2: c1 }),
      // Sparse multiplication
      mul1: ({ c0, c1, c2 }, b1) => ({
        c0: Fp2.mulByNonresidue(Fp2.mul(c2, b1)),
        c1: Fp2.mul(c0, b1),
        c2: Fp2.mul(c1, b1)
      }),
      // Sparse multiplication
      mul01({ c0, c1, c2 }, b0, b1) {
        let t0 = Fp2.mul(c0, b0);
        let t1 = Fp2.mul(c1, b1);
        return {
          // ((c1 + c2) * b1 - T1) * (u + 1) + T0
          c0: Fp2.add(Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), b1), t1)), t0),
          // (b0 + b1) * (c0 + c1) - T0 - T1
          c1: Fp2.sub(Fp2.sub(Fp2.mul(Fp2.add(b0, b1), Fp2.add(c0, c1)), t0), t1),
          // (c0 + c2) * b0 - T0 + T1
          c2: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c2), b0), t0), t1)
        };
      }
    };
    const FP12_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp2, Fp2Nonresidue, Fp.ORDER, 12, 1, 6)[0];
    const Fp12Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
      c0: Fp6.add(c0, r0),
      c1: Fp6.add(c1, r1)
    });
    const Fp12Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
      c0: Fp6.sub(c0, r0),
      c1: Fp6.sub(c1, r1)
    });
    const Fp12Multiply = ({ c0, c1 }, rhs) => {
      if (typeof rhs === "bigint")
        return { c0: Fp6.mul(c0, rhs), c1: Fp6.mul(c1, rhs) };
      let { c0: r0, c1: r1 } = rhs;
      let t1 = Fp6.mul(c0, r0);
      let t2 = Fp6.mul(c1, r1);
      return {
        c0: Fp6.add(t1, Fp6.mulByNonresidue(t2)),
        // T1 + T2 * v
        // (c0 + c1) * (r0 + r1) - (T1 + T2)
        c1: Fp6.sub(Fp6.mul(Fp6.add(c0, c1), Fp6.add(r0, r1)), Fp6.add(t1, t2))
      };
    };
    const Fp12Square = ({ c0, c1 }) => {
      let ab = Fp6.mul(c0, c1);
      return {
        // (c1 * v + c0) * (c0 + c1) - AB - AB * v
        c0: Fp6.sub(Fp6.sub(Fp6.mul(Fp6.add(Fp6.mulByNonresidue(c1), c0), Fp6.add(c0, c1)), ab), Fp6.mulByNonresidue(ab)),
        c1: Fp6.add(ab, ab)
      };
    };
    function Fp4Square(a, b) {
      const a2 = Fp2.sqr(a);
      const b2 = Fp2.sqr(b);
      return {
        first: Fp2.add(Fp2.mulByNonresidue(b2), a2),
        // b² * Nonresidue + a²
        second: Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(a, b)), a2), b2)
        // (a + b)² - a² - b²
      };
    }
    const Fp12 = {
      ORDER: Fp2.ORDER,
      // TODO: unused, but need to verify
      BITS: 2 * Fp2.BITS,
      BYTES: 2 * Fp2.BYTES,
      MASK: (0, utils_js_1$1.bitMask)(2 * Fp2.BITS),
      ZERO: { c0: Fp6.ZERO, c1: Fp6.ZERO },
      ONE: { c0: Fp6.ONE, c1: Fp6.ZERO },
      create: (num) => num,
      isValid: ({ c0, c1 }) => Fp6.isValid(c0) && Fp6.isValid(c1),
      is0: ({ c0, c1 }) => Fp6.is0(c0) && Fp6.is0(c1),
      neg: ({ c0, c1 }) => ({ c0: Fp6.neg(c0), c1: Fp6.neg(c1) }),
      eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp6.eql(c0, r0) && Fp6.eql(c1, r1),
      sqrt: utils_js_1$1.notImplemented,
      inv: ({ c0, c1 }) => {
        let t2 = Fp6.inv(Fp6.sub(Fp6.sqr(c0), Fp6.mulByNonresidue(Fp6.sqr(c1))));
        return { c0: Fp6.mul(c0, t2), c1: Fp6.neg(Fp6.mul(c1, t2)) };
      },
      div: (lhs, rhs) => Fp12.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : Fp12.inv(rhs)),
      pow: (num, power) => mod.FpPow(Fp12, num, power),
      invertBatch: (nums) => mod.FpInvertBatch(Fp12, nums),
      // Normalized
      add: Fp12Add,
      sub: Fp12Subtract,
      mul: Fp12Multiply,
      sqr: Fp12Square,
      // NonNormalized stuff
      addN: Fp12Add,
      subN: Fp12Subtract,
      mulN: Fp12Multiply,
      sqrN: Fp12Square,
      // Bytes utils
      fromBytes: (b) => {
        if (b.length !== Fp12.BYTES)
          throw new Error(`fromBytes wrong length=${b.length}`);
        return {
          c0: Fp6.fromBytes(b.subarray(0, Fp6.BYTES)),
          c1: Fp6.fromBytes(b.subarray(Fp6.BYTES))
        };
      },
      toBytes: ({ c0, c1 }) => (0, utils_js_1$1.concatBytes)(Fp6.toBytes(c0), Fp6.toBytes(c1)),
      cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
        c0: Fp6.cmov(c0, r0, c),
        c1: Fp6.cmov(c1, r1, c)
      }),
      // Utils
      // toString() {
      //   return `Fp12(${this.c0} + ${this.c1} * w)`;
      // },
      // fromTuple(c: [Fp6, Fp6]) {
      //   return new Fp12(...c);
      // }
      fromBigTwelve: (t2) => ({
        c0: Fp6.fromBigSix(t2.slice(0, 6)),
        c1: Fp6.fromBigSix(t2.slice(6, 12))
      }),
      // Raises to q**i -th power
      frobeniusMap(lhs, power) {
        const { c0, c1, c2 } = Fp6.frobeniusMap(lhs.c1, power);
        const coeff = FP12_FROBENIUS_COEFFICIENTS[power % 12];
        return {
          c0: Fp6.frobeniusMap(lhs.c0, power),
          c1: Fp6.create({
            c0: Fp2.mul(c0, coeff),
            c1: Fp2.mul(c1, coeff),
            c2: Fp2.mul(c2, coeff)
          })
        };
      },
      mulByFp2: ({ c0, c1 }, rhs) => ({
        c0: Fp6.mulByFp2(c0, rhs),
        c1: Fp6.mulByFp2(c1, rhs)
      }),
      conjugate: ({ c0, c1 }) => ({ c0, c1: Fp6.neg(c1) }),
      // Sparse multiplication
      mul014: ({ c0, c1 }, o0, o1, o4) => {
        let t0 = Fp6.mul01(c0, o0, o1);
        let t1 = Fp6.mul1(c1, o4);
        return {
          c0: Fp6.add(Fp6.mulByNonresidue(t1), t0),
          // T1 * v + T0
          // (c1 + c0) * [o0, o1+o4] - T0 - T1
          c1: Fp6.sub(Fp6.sub(Fp6.mul01(Fp6.add(c1, c0), o0, Fp2.add(o1, o4)), t0), t1)
        };
      },
      mul034: ({ c0, c1 }, o0, o3, o4) => {
        const a = Fp6.create({
          c0: Fp2.mul(c0.c0, o0),
          c1: Fp2.mul(c0.c1, o0),
          c2: Fp2.mul(c0.c2, o0)
        });
        const b = Fp6.mul01(c1, o3, o4);
        const e = Fp6.mul01(Fp6.add(c0, c1), Fp2.add(o0, o3), o4);
        return {
          c0: Fp6.add(Fp6.mulByNonresidue(b), a),
          c1: Fp6.sub(e, Fp6.add(a, b))
        };
      },
      // A cyclotomic group is a subgroup of Fp^n defined by
      //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
      // The result of any pairing is in a cyclotomic subgroup
      // https://eprint.iacr.org/2009/565.pdf
      _cyclotomicSquare: opts.Fp12cyclotomicSquare,
      _cyclotomicExp: opts.Fp12cyclotomicExp,
      // https://eprint.iacr.org/2010/354.pdf
      // https://eprint.iacr.org/2009/565.pdf
      finalExponentiate: opts.Fp12finalExponentiate
    };
    return { Fp, Fp2, Fp6, Fp4Square, Fp12 };
  }
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bls12_381 = void 0;
    /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    const sha256_12 = sha256;
    const utils_12 = utils$3;
    const bls_js_1 = bls$1;
    const mod2 = modular;
    const utils_js_12 = utils$2;
    const hash_to_curve_js_12 = hashToCurve;
    const weierstrass_js_12 = weierstrass;
    const tower_js_1 = tower;
    const _0n2 = BigInt(0), _1n2 = BigInt(1), _2n2 = BigInt(2), _3n2 = BigInt(3), _4n2 = BigInt(4);
    const BLS_X = BigInt("0xd201000000010000");
    const BLS_X_LEN = (0, utils_js_12.bitLen)(BLS_X);
    const { Fp, Fp2, Fp6, Fp4Square, Fp12 } = (0, tower_js_1.tower12)({
      // Order of Fp
      ORDER: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
      // Finite extension field over irreducible polynominal.
      // Fp(u) / (u² - β) where β = -1
      FP2_NONRESIDUE: [_1n2, _1n2],
      Fp2mulByB: ({ c0, c1 }) => {
        const t0 = Fp.mul(c0, _4n2);
        const t1 = Fp.mul(c1, _4n2);
        return { c0: Fp.sub(t0, t1), c1: Fp.add(t0, t1) };
      },
      // Fp12
      // A cyclotomic group is a subgroup of Fp^n defined by
      //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
      // The result of any pairing is in a cyclotomic subgroup
      // https://eprint.iacr.org/2009/565.pdf
      Fp12cyclotomicSquare: ({ c0, c1 }) => {
        const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
        const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
        const { first: t3, second: t4 } = Fp4Square(c0c0, c1c1);
        const { first: t5, second: t6 } = Fp4Square(c1c0, c0c2);
        const { first: t7, second: t8 } = Fp4Square(c0c1, c1c2);
        const t9 = Fp2.mulByNonresidue(t8);
        return {
          c0: Fp6.create({
            c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n2), t3),
            // 2 * (T3 - c0c0)  + T3
            c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n2), t5),
            // 2 * (T5 - c0c1)  + T5
            c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n2), t7)
          }),
          // 2 * (T7 - c0c2)  + T7
          c1: Fp6.create({
            c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n2), t9),
            // 2 * (T9 + c1c0) + T9
            c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n2), t4),
            // 2 * (T4 + c1c1) + T4
            c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n2), t6)
          })
        };
      },
      Fp12cyclotomicExp(num, n) {
        let z = Fp12.ONE;
        for (let i = BLS_X_LEN - 1; i >= 0; i--) {
          z = Fp12._cyclotomicSquare(z);
          if ((0, utils_js_12.bitGet)(n, i))
            z = Fp12.mul(z, num);
        }
        return z;
      },
      // https://eprint.iacr.org/2010/354.pdf
      // https://eprint.iacr.org/2009/565.pdf
      Fp12finalExponentiate: (num) => {
        const x = BLS_X;
        const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
        const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
        const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
        const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
        const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
        const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
        const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
        const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
        const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
        const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
        const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
        const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
        return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
      }
    });
    const Fr2 = mod2.Field(BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"));
    const isogenyMapG2 = (0, hash_to_curve_js_12.isogenyMap)(Fp2, [
      // xNum
      [
        [
          "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6",
          "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"
        ],
        [
          "0x0",
          "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"
        ],
        [
          "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e",
          "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"
        ],
        [
          "0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1",
          "0x0"
        ]
      ],
      // xDen
      [
        [
          "0x0",
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"
        ],
        [
          "0xc",
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"
        ],
        ["0x1", "0x0"]
        // LAST 1
      ],
      // yNum
      [
        [
          "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706",
          "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"
        ],
        [
          "0x0",
          "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"
        ],
        [
          "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c",
          "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"
        ],
        [
          "0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10",
          "0x0"
        ]
      ],
      // yDen
      [
        [
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb",
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"
        ],
        [
          "0x0",
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"
        ],
        [
          "0x12",
          "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"
        ],
        ["0x1", "0x0"]
        // LAST 1
      ]
    ].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
    const isogenyMapG1 = (0, hash_to_curve_js_12.isogenyMap)(Fp, [
      // xNum
      [
        "0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
        "0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
        "0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
        "0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
        "0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
        "0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
        "0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
        "0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
        "0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
        "0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
        "0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
        "0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
      ],
      // xDen
      [
        "0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
        "0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
        "0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
        "0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
        "0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
        "0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
        "0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
        "0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
        "0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
        "0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
        "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ],
      // yNum
      [
        "0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
        "0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
        "0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
        "0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
        "0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
        "0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
        "0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
        "0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
        "0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
        "0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
        "0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
        "0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
        "0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
        "0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
        "0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
        "0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
      ],
      // yDen
      [
        "0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
        "0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
        "0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
        "0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
        "0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
        "0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
        "0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
        "0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
        "0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
        "0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
        "0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
        "0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
        "0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
        "0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
        "0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
        "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
        // LAST 1
      ]
    ].map((i) => i.map((j) => BigInt(j))));
    const G2_SWU = (0, weierstrass_js_12.mapToCurveSimpleSWU)(Fp2, {
      A: Fp2.create({ c0: Fp.create(_0n2), c1: Fp.create(BigInt(240)) }),
      // A' = 240 * I
      B: Fp2.create({ c0: Fp.create(BigInt(1012)), c1: Fp.create(BigInt(1012)) }),
      // B' = 1012 * (1 + I)
      Z: Fp2.create({ c0: Fp.create(BigInt(-2)), c1: Fp.create(BigInt(-1)) })
      // Z: -(2 + I)
    });
    const G1_SWU = (0, weierstrass_js_12.mapToCurveSimpleSWU)(Fp, {
      A: Fp.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
      B: Fp.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
      Z: Fp.create(BigInt(11))
    });
    const { G2psi, G2psi2 } = (0, tower_js_1.psiFrobenius)(Fp, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
    const htfDefaults = Object.freeze({
      // DST: a domain separation tag
      // defined in section 2.2.5
      // Use utils.getDSTLabel(), utils.setDSTLabel(value)
      DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
      encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
      // p: the characteristic of F
      //    where F is a finite field of characteristic p and order q = p^m
      p: Fp.ORDER,
      // m: the extension degree of F, m >= 1
      //     where F is a finite field of characteristic p and order q = p^m
      m: 2,
      // k: the target security level for the suite in bits
      // defined in section 5.1
      k: 128,
      // option to use a message that has already been processed by
      // expand_message_xmd
      expand: "xmd",
      // Hash functions for: expand_message_xmd is appropriate for use with a
      // wide range of hash functions, including SHA-2, SHA-3, BLAKE2, and others.
      // BBS+ uses blake2: https://github.com/hyperledger/aries-framework-go/issues/2247
      hash: sha256_12.sha256
    });
    const COMPRESSED_ZERO = setMask(Fp.toBytes(_0n2), { infinity: true, compressed: true });
    function parseMask(bytes2) {
      bytes2 = bytes2.slice();
      const mask = bytes2[0] & 224;
      const compressed = !!(mask >> 7 & 1);
      const infinity = !!(mask >> 6 & 1);
      const sort = !!(mask >> 5 & 1);
      bytes2[0] &= 31;
      return { compressed, infinity, sort, value: bytes2 };
    }
    function setMask(bytes2, mask) {
      if (bytes2[0] & 224)
        throw new Error("setMask: non-empty mask");
      if (mask.compressed)
        bytes2[0] |= 128;
      if (mask.infinity)
        bytes2[0] |= 64;
      if (mask.sort)
        bytes2[0] |= 32;
      return bytes2;
    }
    function signatureG1ToRawBytes(point) {
      point.assertValidity();
      const isZero = point.equals(exports.bls12_381.G1.ProjectivePoint.ZERO);
      const { x, y } = point.toAffine();
      if (isZero)
        return COMPRESSED_ZERO.slice();
      const P = Fp.ORDER;
      const sort = Boolean(y * _2n2 / P);
      return setMask((0, utils_js_12.numberToBytesBE)(x, Fp.BYTES), { compressed: true, sort });
    }
    function signatureG2ToRawBytes(point) {
      point.assertValidity();
      const len = Fp.BYTES;
      if (point.equals(exports.bls12_381.G2.ProjectivePoint.ZERO))
        return (0, utils_js_12.concatBytes)(COMPRESSED_ZERO, (0, utils_js_12.numberToBytesBE)(_0n2, len));
      const { x, y } = point.toAffine();
      const { re: x0, im: x1 } = Fp2.reim(x);
      const { re: y0, im: y1 } = Fp2.reim(y);
      const tmp = y1 > _0n2 ? y1 * _2n2 : y0 * _2n2;
      const sort = Boolean(tmp / Fp.ORDER & _1n2);
      const z2 = x0;
      return (0, utils_js_12.concatBytes)(setMask((0, utils_js_12.numberToBytesBE)(x1, len), { sort, compressed: true }), (0, utils_js_12.numberToBytesBE)(z2, len));
    }
    exports.bls12_381 = (0, bls_js_1.bls)({
      // Fields
      fields: {
        Fp,
        Fp2,
        Fp6,
        Fp12,
        Fr: Fr2
      },
      // G1 is the order-q subgroup of E1(Fp) : y² = x³ + 4, #E1(Fp) = h1q, where
      // characteristic; z + (z⁴ - z² + 1)(z - 1)²/3
      G1: {
        Fp,
        // cofactor; (z - 1)²/3
        h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
        // generator's coordinates
        // x = 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507
        // y = 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569
        Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
        Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1"),
        a: Fp.ZERO,
        b: _4n2,
        htfDefaults: { ...htfDefaults, m: 1, DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_" },
        wrapPrivateKey: true,
        allowInfinityPoint: true,
        // Checks is the point resides in prime-order subgroup.
        // point.isTorsionFree() should return true for valid points
        // It returns false for shitty points.
        // https://eprint.iacr.org/2021/1130.pdf
        isTorsionFree: (c, point) => {
          const cubicRootOfUnityModP = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
          const phi = new c(Fp.mul(point.px, cubicRootOfUnityModP), point.py, point.pz);
          const xP = point.multiplyUnsafe(BLS_X).negate();
          const u2P = xP.multiplyUnsafe(BLS_X);
          return u2P.equals(phi);
        },
        // Clear cofactor of G1
        // https://eprint.iacr.org/2019/403
        clearCofactor: (_c, point) => {
          return point.multiplyUnsafe(BLS_X).add(point);
        },
        mapToCurve: (scalars) => {
          const { x, y } = G1_SWU(Fp.create(scalars[0]));
          return isogenyMapG1(x, y);
        },
        fromBytes: (bytes2) => {
          const { compressed, infinity, sort, value } = parseMask(bytes2);
          if (value.length === 48 && compressed) {
            const P = Fp.ORDER;
            const compressedValue = (0, utils_js_12.bytesToNumberBE)(value);
            const x = Fp.create(compressedValue & Fp.MASK);
            if (infinity) {
              if (x !== _0n2)
                throw new Error("G1: non-empty compressed point at infinity");
              return { x: _0n2, y: _0n2 };
            }
            const right = Fp.add(Fp.pow(x, _3n2), Fp.create(exports.bls12_381.params.G1b));
            let y = Fp.sqrt(right);
            if (!y)
              throw new Error("Invalid compressed G1 point");
            if (y * _2n2 / P !== BigInt(sort))
              y = Fp.neg(y);
            return { x: Fp.create(x), y: Fp.create(y) };
          } else if (value.length === 96 && !compressed) {
            const x = (0, utils_js_12.bytesToNumberBE)(value.subarray(0, Fp.BYTES));
            const y = (0, utils_js_12.bytesToNumberBE)(value.subarray(Fp.BYTES));
            if (infinity) {
              if (x !== _0n2 || y !== _0n2)
                throw new Error("G1: non-empty point at infinity");
              return exports.bls12_381.G1.ProjectivePoint.ZERO.toAffine();
            }
            return { x: Fp.create(x), y: Fp.create(y) };
          } else {
            throw new Error("Invalid point G1, expected 48/96 bytes");
          }
        },
        toBytes: (c, point, isCompressed) => {
          const isZero = point.equals(c.ZERO);
          const { x, y } = point.toAffine();
          if (isCompressed) {
            if (isZero)
              return COMPRESSED_ZERO.slice();
            const P = Fp.ORDER;
            const sort = Boolean(y * _2n2 / P);
            return setMask((0, utils_js_12.numberToBytesBE)(x, Fp.BYTES), { compressed: true, sort });
          } else {
            if (isZero) {
              const x2 = (0, utils_js_12.concatBytes)(new Uint8Array([64]), new Uint8Array(2 * Fp.BYTES - 1));
              return x2;
            } else {
              return (0, utils_js_12.concatBytes)((0, utils_js_12.numberToBytesBE)(x, Fp.BYTES), (0, utils_js_12.numberToBytesBE)(y, Fp.BYTES));
            }
          }
        },
        ShortSignature: {
          fromHex(hex) {
            const { infinity, sort, value } = parseMask((0, utils_js_12.ensureBytes)("signatureHex", hex, 48));
            const P = Fp.ORDER;
            const compressedValue = (0, utils_js_12.bytesToNumberBE)(value);
            if (infinity)
              return exports.bls12_381.G1.ProjectivePoint.ZERO;
            const x = Fp.create(compressedValue & Fp.MASK);
            const right = Fp.add(Fp.pow(x, _3n2), Fp.create(exports.bls12_381.params.G1b));
            let y = Fp.sqrt(right);
            if (!y)
              throw new Error("Invalid compressed G1 point");
            const aflag = BigInt(sort);
            if (y * _2n2 / P !== aflag)
              y = Fp.neg(y);
            const point = exports.bls12_381.G1.ProjectivePoint.fromAffine({ x, y });
            point.assertValidity();
            return point;
          },
          toRawBytes(point) {
            return signatureG1ToRawBytes(point);
          },
          toHex(point) {
            return (0, utils_js_12.bytesToHex)(signatureG1ToRawBytes(point));
          }
        }
      },
      // G2 is the order-q subgroup of E2(Fp²) : y² = x³+4(1+√−1),
      // where Fp2 is Fp[√−1]/(x2+1). #E2(Fp2 ) = h2q, where
      // G² - 1
      // h2q
      G2: {
        Fp: Fp2,
        // cofactor
        h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
        Gx: Fp2.fromBigTuple([
          BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
          BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")
        ]),
        // y =
        // 927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582,
        // 1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905
        Gy: Fp2.fromBigTuple([
          BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
          BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")
        ]),
        a: Fp2.ZERO,
        b: Fp2.fromBigTuple([_4n2, _4n2]),
        hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
        htfDefaults: { ...htfDefaults },
        wrapPrivateKey: true,
        allowInfinityPoint: true,
        mapToCurve: (scalars) => {
          const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
          return isogenyMapG2(x, y);
        },
        // Checks is the point resides in prime-order subgroup.
        // point.isTorsionFree() should return true for valid points
        // It returns false for shitty points.
        // https://eprint.iacr.org/2021/1130.pdf
        isTorsionFree: (c, P) => {
          return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c, P));
        },
        // Maps the point into the prime-order subgroup G2.
        // clear_cofactor_bls12381_g2 from cfrg-hash-to-curve-11
        // https://eprint.iacr.org/2017/419.pdf
        // prettier-ignore
        clearCofactor: (c, P) => {
          const x = BLS_X;
          let t1 = P.multiplyUnsafe(x).negate();
          let t2 = G2psi(c, P);
          let t3 = P.double();
          t3 = G2psi2(c, t3);
          t3 = t3.subtract(t2);
          t2 = t1.add(t2);
          t2 = t2.multiplyUnsafe(x).negate();
          t3 = t3.add(t2);
          t3 = t3.subtract(t1);
          const Q = t3.subtract(P);
          return Q;
        },
        fromBytes: (bytes2) => {
          const { compressed, infinity, sort, value } = parseMask(bytes2);
          if (!compressed && !infinity && sort || // 00100000
          !compressed && infinity && sort || // 01100000
          sort && infinity && compressed) {
            throw new Error("Invalid encoding flag: " + (bytes2[0] & 224));
          }
          const L = Fp.BYTES;
          const slc = (b, from, to2) => (0, utils_js_12.bytesToNumberBE)(b.slice(from, to2));
          if (value.length === 96 && compressed) {
            const b = exports.bls12_381.params.G2b;
            const P = Fp.ORDER;
            if (infinity) {
              if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) {
                throw new Error("Invalid compressed G2 point");
              }
              return { x: Fp2.ZERO, y: Fp2.ZERO };
            }
            const x_1 = slc(value, 0, L);
            const x_0 = slc(value, L, 2 * L);
            const x = Fp2.create({ c0: Fp.create(x_0), c1: Fp.create(x_1) });
            const right = Fp2.add(Fp2.pow(x, _3n2), b);
            let y = Fp2.sqrt(right);
            const Y_bit = y.c1 === _0n2 ? y.c0 * _2n2 / P : y.c1 * _2n2 / P ? _1n2 : _0n2;
            y = sort && Y_bit > 0 ? y : Fp2.neg(y);
            return { x, y };
          } else if (value.length === 192 && !compressed) {
            if (infinity) {
              if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) {
                throw new Error("Invalid uncompressed G2 point");
              }
              return { x: Fp2.ZERO, y: Fp2.ZERO };
            }
            const x1 = slc(value, 0, L);
            const x0 = slc(value, L, 2 * L);
            const y1 = slc(value, 2 * L, 3 * L);
            const y0 = slc(value, 3 * L, 4 * L);
            return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
          } else {
            throw new Error("Invalid point G2, expected 96/192 bytes");
          }
        },
        toBytes: (c, point, isCompressed) => {
          const { BYTES: len, ORDER: P } = Fp;
          const isZero = point.equals(c.ZERO);
          const { x, y } = point.toAffine();
          if (isCompressed) {
            if (isZero)
              return (0, utils_js_12.concatBytes)(COMPRESSED_ZERO, (0, utils_js_12.numberToBytesBE)(_0n2, len));
            const flag = Boolean(y.c1 === _0n2 ? y.c0 * _2n2 / P : y.c1 * _2n2 / P);
            return (0, utils_js_12.concatBytes)(setMask((0, utils_js_12.numberToBytesBE)(x.c1, len), { compressed: true, sort: flag }), (0, utils_js_12.numberToBytesBE)(x.c0, len));
          } else {
            if (isZero)
              return (0, utils_js_12.concatBytes)(new Uint8Array([64]), new Uint8Array(4 * len - 1));
            const { re: x0, im: x1 } = Fp2.reim(x);
            const { re: y0, im: y1 } = Fp2.reim(y);
            return (0, utils_js_12.concatBytes)((0, utils_js_12.numberToBytesBE)(x1, len), (0, utils_js_12.numberToBytesBE)(x0, len), (0, utils_js_12.numberToBytesBE)(y1, len), (0, utils_js_12.numberToBytesBE)(y0, len));
          }
        },
        Signature: {
          // TODO: Optimize, it's very slow because of sqrt.
          fromHex(hex) {
            const { infinity, sort, value } = parseMask((0, utils_js_12.ensureBytes)("signatureHex", hex));
            const P = Fp.ORDER;
            const half = value.length / 2;
            if (half !== 48 && half !== 96)
              throw new Error("Invalid compressed signature length, must be 96 or 192");
            const z1 = (0, utils_js_12.bytesToNumberBE)(value.slice(0, half));
            const z2 = (0, utils_js_12.bytesToNumberBE)(value.slice(half));
            if (infinity)
              return exports.bls12_381.G2.ProjectivePoint.ZERO;
            const x1 = Fp.create(z1 & Fp.MASK);
            const x2 = Fp.create(z2);
            const x = Fp2.create({ c0: x2, c1: x1 });
            const y2 = Fp2.add(Fp2.pow(x, _3n2), exports.bls12_381.params.G2b);
            let y = Fp2.sqrt(y2);
            if (!y)
              throw new Error("Failed to find a square root");
            const { re: y0, im: y1 } = Fp2.reim(y);
            const aflag1 = BigInt(sort);
            const isGreater = y1 > _0n2 && y1 * _2n2 / P !== aflag1;
            const isZero = y1 === _0n2 && y0 * _2n2 / P !== aflag1;
            if (isGreater || isZero)
              y = Fp2.neg(y);
            const point = exports.bls12_381.G2.ProjectivePoint.fromAffine({ x, y });
            point.assertValidity();
            return point;
          },
          toRawBytes(point) {
            return signatureG2ToRawBytes(point);
          },
          toHex(point) {
            return (0, utils_js_12.bytesToHex)(signatureG2ToRawBytes(point));
          }
        }
      },
      params: {
        ateLoopSize: BLS_X,
        // The BLS parameter x for BLS12-381
        r: Fr2.ORDER,
        // order; z⁴ − z² + 1; CURVE.n from other curves
        xNegative: true,
        twistType: "multiplicative"
      },
      htfDefaults,
      hash: sha256_12.sha256,
      randomBytes: utils_12.randomBytes
    });
  })(bls12381);
  var buffer = {};
  var base64Js = {};
  base64Js.byteLength = byteLength;
  base64Js.toByteArray = toByteArray;
  base64Js.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for (i = 0; i < len; i += 4) {
      tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output2 = [];
    for (var i = start; i < end; i += 3) {
      tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
      output2.push(tripletToBase64(tmp));
    }
    return output2.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(
        lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
      );
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(
        lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
      );
    }
    return parts.join("");
  }
  var ieee754 = {};
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  ieee754.read = function(buffer2, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer2[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  ieee754.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer2[offset + i - d] |= s * 128;
  };
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  (function(exports) {
    const base64 = base64Js;
    const ieee754$1 = ieee754;
    const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer2;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    const K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer2.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer2.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer2.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function Buffer2(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer2.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer2, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer2.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength2(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer2.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer2.alloc(+length);
    }
    Buffer2.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype;
    };
    Buffer2.compare = function compare2(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer2 = Buffer2.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer2.length) {
            if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
            buf.copy(buffer2, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer2,
              buf,
              pos
            );
          }
        } else if (!Buffer2.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer2, pos);
        }
        pos += buf.length;
      }
      return buffer2;
    };
    function byteLength2(string, encoding) {
      if (Buffer2.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes2(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes2(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.byteLength = byteLength2;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer2.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer2.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
    Buffer2.prototype.equals = function equals(b) {
      if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
    }
    Buffer2.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength);
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
      if (byteOffset >= buffer2.length) {
        if (dir) return -1;
        else byteOffset = buffer2.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer2.from(val, encoding);
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes2(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer2.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    const MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes2 = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes2.length - 1; i += 2) {
        res += String.fromCharCode(bytes2[i] + bytes2[i + 1] * 256);
      }
      return res;
    }
    Buffer2.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer2.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength3, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength3 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength3, this.length);
      }
      let val = this[offset + --byteLength3];
      let mul = 1;
      while (byteLength3 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength3] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo2 = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo2) + (BigInt(hi) << BigInt(32));
    });
    Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo2 = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo2);
    });
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength3, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength3 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength3, this.length);
      let i = byteLength3;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE2(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE2(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE2(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE2(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
        checkInt(this, value, offset, byteLength3, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength3 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength3;
    };
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
        checkInt(this, value, offset, byteLength3, maxBytes, 0);
      }
      let i = byteLength3 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength3;
    };
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo2 = Number(value & BigInt(4294967295));
      buf[offset++] = lo2;
      lo2 = lo2 >> 8;
      buf[offset++] = lo2;
      lo2 = lo2 >> 8;
      buf[offset++] = lo2;
      lo2 = lo2 >> 8;
      buf[offset++] = lo2;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo2 = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo2;
      lo2 = lo2 >> 8;
      buf[offset + 6] = lo2;
      lo2 = lo2 >> 8;
      buf[offset + 5] = lo2;
      lo2 = lo2 >> 8;
      buf[offset + 4] = lo2;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength3 - 1);
        checkInt(this, value, offset, byteLength3, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub2 = 0;
      this[offset] = value & 255;
      while (++i < byteLength3 && (mul *= 256)) {
        if (value < 0 && sub2 === 0 && this[offset + i - 1] !== 0) {
          sub2 = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub2 & 255;
      }
      return offset + byteLength3;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength3 - 1);
        checkInt(this, value, offset, byteLength3, limit - 1, -limit);
      }
      let i = byteLength3 - 1;
      let mul = 1;
      let sub2 = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub2 === 0 && this[offset + i + 1] !== 0) {
          sub2 = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub2 & 255;
      }
      return offset + byteLength3;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code2 = val.charCodeAt(0);
          if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
            val = code2;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes2 = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
        const len = bytes2.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes2[i % len];
        }
      }
      return this;
    };
    const errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength3) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
        boundsError(offset, buf.length - (byteLength3 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength3) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
          }
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength3);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE("offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        "offset",
        `>= ${0} and <= ${length}`,
        value
      );
    }
    const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes2(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes2 = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes2.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes2.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes2.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes2.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes2.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes2.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes2.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes2.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes2;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo2;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo2 = c % 256;
        byteArray.push(lo2);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    const hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn2) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn2;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  })(buffer);
  var hasRequiredBeaconVerification;
  function requireBeaconVerification() {
    if (hasRequiredBeaconVerification) return beaconVerification;
    hasRequiredBeaconVerification = 1;
    Object.defineProperty(beaconVerification, "__esModule", { value: true });
    beaconVerification.roundBuffer = beaconVerification.verifyBeacon = beaconVerification.verifySigOnG1 = void 0;
    const bls12_381_12 = bls12381;
    const sha256_12 = sha256;
    const utils_12 = utils$2;
    const buffer_12 = buffer;
    const index_1 = requireDrandClient();
    async function verifyBeacon(chainInfo, beacon, expectedRound) {
      const publicKey = chainInfo.public_key;
      if (beacon.round !== expectedRound) {
        console.error("round was not the expected round");
        return false;
      }
      if (!await randomnessIsValid(beacon)) {
        console.error("randomness did not match the signature");
        return false;
      }
      if ((0, index_1.isChainedBeacon)(beacon, chainInfo)) {
        return bls12_381_12.bls12_381.verify(beacon.signature, await chainedBeaconMessage(beacon), publicKey);
      }
      if ((0, index_1.isUnchainedBeacon)(beacon, chainInfo)) {
        return bls12_381_12.bls12_381.verify(beacon.signature, await unchainedBeaconMessage(beacon), publicKey);
      }
      if ((0, index_1.isG1G2SwappedBeacon)(beacon, chainInfo)) {
        return verifySigOnG1(beacon.signature, await unchainedBeaconMessage(beacon), publicKey);
      }
      if ((0, index_1.isG1Rfc9380)(beacon, chainInfo)) {
        return verifySigOnG1(beacon.signature, await unchainedBeaconMessage(beacon), publicKey, "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_");
      }
      console.error(`Beacon type ${chainInfo.schemeID} was not supported or the beacon was not of the purported type`);
      return false;
    }
    beaconVerification.verifyBeacon = verifyBeacon;
    function normP1(point) {
      return point instanceof bls12_381_12.bls12_381.G1.ProjectivePoint ? point : bls12_381_12.bls12_381.G1.ProjectivePoint.fromHex(point);
    }
    function normP2(point) {
      return point instanceof bls12_381_12.bls12_381.G2.ProjectivePoint ? point : bls12_381_12.bls12_381.G2.ProjectivePoint.fromHex(point);
    }
    function normP1Hash(point, domainSeparationTag) {
      return point instanceof bls12_381_12.bls12_381.G1.ProjectivePoint ? point : bls12_381_12.bls12_381.G1.hashToCurve((0, utils_12.ensureBytes)("point", point), { DST: domainSeparationTag });
    }
    async function verifySigOnG1(signature, message2, publicKey, domainSeparationTag = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_") {
      const P = normP2(publicKey);
      const Hm = normP1Hash(message2, domainSeparationTag);
      const G = bls12_381_12.bls12_381.G2.ProjectivePoint.BASE;
      const S = normP1(signature);
      const ePHm = bls12_381_12.bls12_381.pairing(Hm, P.negate(), true);
      const eGS = bls12_381_12.bls12_381.pairing(S, G, true);
      const exp = bls12_381_12.bls12_381.fields.Fp12.mul(eGS, ePHm);
      return bls12_381_12.bls12_381.fields.Fp12.eql(exp, bls12_381_12.bls12_381.fields.Fp12.ONE);
    }
    beaconVerification.verifySigOnG1 = verifySigOnG1;
    async function chainedBeaconMessage(beacon) {
      const message2 = buffer_12.Buffer.concat([
        signatureBuffer(beacon.previous_signature),
        roundBuffer(beacon.round)
      ]);
      return (0, sha256_12.sha256)(message2);
    }
    async function unchainedBeaconMessage(beacon) {
      return (0, sha256_12.sha256)(roundBuffer(beacon.round));
    }
    function signatureBuffer(sig) {
      return buffer_12.Buffer.from(sig, "hex");
    }
    function roundBuffer(round) {
      const buffer2 = buffer_12.Buffer.alloc(8);
      buffer2.writeBigUInt64BE(BigInt(round));
      return buffer2;
    }
    beaconVerification.roundBuffer = roundBuffer;
    async function randomnessIsValid(beacon) {
      const expectedRandomness = (0, sha256_12.sha256)(buffer_12.Buffer.from(beacon.signature, "hex"));
      return buffer_12.Buffer.from(beacon.randomness, "hex").compare(expectedRandomness) == 0;
    }
    return beaconVerification;
  }
  var hasRequiredDrandClient;
  function requireDrandClient() {
    if (hasRequiredDrandClient) return drandClient;
    hasRequiredDrandClient = 1;
    (function(exports) {
      var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod2) {
        return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.roundTime = exports.roundAt = exports.FastestNodeClient = exports.MultiBeaconNode = exports.HttpCachingChain = exports.HttpChainClient = exports.HttpChain = exports.isG1Rfc9380 = exports.isG1G2SwappedBeacon = exports.isUnchainedBeacon = exports.isChainedBeacon = exports.watch = exports.fetchBeaconByTime = exports.fetchBeacon = exports.defaultChainOptions = void 0;
      const http_caching_chain_1 = __importDefault(requireHttpCachingChain());
      exports.HttpCachingChain = http_caching_chain_1.default;
      const http_caching_chain_2 = requireHttpCachingChain();
      Object.defineProperty(exports, "HttpChain", { enumerable: true, get: function() {
        return http_caching_chain_2.HttpChain;
      } });
      const http_chain_client_1 = __importDefault(requireHttpChainClient());
      exports.HttpChainClient = http_chain_client_1.default;
      const fastest_node_client_1 = __importDefault(requireFastestNodeClient());
      exports.FastestNodeClient = fastest_node_client_1.default;
      const multi_beacon_node_1 = __importDefault(requireMultiBeaconNode());
      exports.MultiBeaconNode = multi_beacon_node_1.default;
      const util_1 = util;
      Object.defineProperty(exports, "roundAt", { enumerable: true, get: function() {
        return util_1.roundAt;
      } });
      Object.defineProperty(exports, "roundTime", { enumerable: true, get: function() {
        return util_1.roundTime;
      } });
      const beacon_verification_1 = requireBeaconVerification();
      exports.defaultChainOptions = {
        disableBeaconVerification: false,
        noCache: false
      };
      async function fetchBeacon(client2, roundNumber) {
        if (!roundNumber) {
          roundNumber = (0, util_1.roundAt)(Date.now(), await client2.chain().info());
        }
        if (roundNumber < 1) {
          throw Error("Cannot request lower than round number 1");
        }
        const beacon = await client2.get(roundNumber);
        return validatedBeacon(client2, beacon, roundNumber);
      }
      exports.fetchBeacon = fetchBeacon;
      async function fetchBeaconByTime(client2, time) {
        const info = await client2.chain().info();
        const roundNumber = (0, util_1.roundAt)(time, info);
        return fetchBeacon(client2, roundNumber);
      }
      exports.fetchBeaconByTime = fetchBeaconByTime;
      async function* watch2(client2, abortController, options = defaultWatchOptions) {
        const info = await client2.chain().info();
        let currentRound = (0, util_1.roundAt)(Date.now(), info);
        while (!abortController.signal.aborted) {
          const now = Date.now();
          await (0, util_1.sleep)((0, util_1.roundTime)(info, currentRound) - now);
          const beacon = await (0, util_1.retryOnError)(async () => client2.get(currentRound), options.retriesOnFailure);
          yield validatedBeacon(client2, beacon, currentRound);
          currentRound = currentRound + 1;
        }
      }
      exports.watch = watch2;
      const defaultWatchOptions = {
        retriesOnFailure: 3
      };
      async function validatedBeacon(client2, beacon, expectedRound) {
        if (client2.options.disableBeaconVerification) {
          return beacon;
        }
        const info = await client2.chain().info();
        if (!await (0, beacon_verification_1.verifyBeacon)(info, beacon, expectedRound)) {
          throw Error("The beacon retrieved was not valid!");
        }
        return beacon;
      }
      function isChainedBeacon(value, info) {
        return info.schemeID === "pedersen-bls-chained" && !!value.previous_signature && !!value.randomness && !!value.signature && value.round > 0;
      }
      exports.isChainedBeacon = isChainedBeacon;
      function isUnchainedBeacon(value, info) {
        return info.schemeID === "pedersen-bls-unchained" && !!value.randomness && !!value.signature && value.previous_signature === void 0 && value.round > 0;
      }
      exports.isUnchainedBeacon = isUnchainedBeacon;
      function isG1G2SwappedBeacon(value, info) {
        return info.schemeID === "bls-unchained-on-g1" && !!value.randomness && !!value.signature && value.previous_signature === void 0 && value.round > 0;
      }
      exports.isG1G2SwappedBeacon = isG1G2SwappedBeacon;
      function isG1Rfc9380(value, info) {
        return info.schemeID === "bls-unchained-g1-rfc9380" && !!value.randomness && !!value.signature && value.previous_signature === void 0 && value.round > 0;
      }
      exports.isG1Rfc9380 = isG1Rfc9380;
    })(drandClient);
    return drandClient;
  }
  var timelockEncrypter = {};
  var ibe$2 = {};
  var utils$1 = {};
  Object.defineProperty(utils$1, "__esModule", { value: true });
  utils$1.fp12ToBytes = utils$1.fp6ToBytes = utils$1.fp2ToBytes = utils$1.fpToBytes = utils$1.bytesToHex = utils$1.bytesToNumberBE = utils$1.xor = void 0;
  const buffer_1$8 = buffer;
  function xor(a, b) {
    if (a.length != b.length) {
      throw new Error("Error: incompatible sizes");
    }
    const ret = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      ret[i] = a[i] ^ b[i];
    }
    return ret;
  }
  utils$1.xor = xor;
  function bytesToNumberBE(uint8a) {
    return BigInt("0x" + bytesToHex(Uint8Array.from(uint8a)));
  }
  utils$1.bytesToNumberBE = bytesToNumberBE;
  const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(uint8a) {
    let hex = "";
    for (let i = 0; i < uint8a.length; i++) {
      hex += hexes[uint8a[i]];
    }
    return hex;
  }
  utils$1.bytesToHex = bytesToHex;
  function fpToBytes(fp) {
    const hex = fp.toString(16).padStart(96, "0");
    const buf = buffer_1$8.Buffer.alloc(hex.length / 2);
    buf.write(hex, "hex");
    return buf;
  }
  utils$1.fpToBytes = fpToBytes;
  function fp2ToBytes(fp2) {
    return buffer_1$8.Buffer.concat([fp2.c1, fp2.c0].map(fpToBytes));
  }
  utils$1.fp2ToBytes = fp2ToBytes;
  function fp6ToBytes(fp6) {
    return buffer_1$8.Buffer.concat([fp6.c2, fp6.c1, fp6.c0].map(fp2ToBytes));
  }
  utils$1.fp6ToBytes = fp6ToBytes;
  function fp12ToBytes(fp12) {
    return buffer_1$8.Buffer.concat([fp12.c1, fp12.c0].map(fp6ToBytes));
  }
  utils$1.fp12ToBytes = fp12ToBytes;
  Object.defineProperty(ibe$2, "__esModule", { value: true });
  ibe$2.gtToHash = ibe$2.decryptOnG2 = ibe$2.decryptOnG1 = ibe$2.encryptOnG2RFC9380 = ibe$2.encryptOnG2 = ibe$2.encryptOnG1 = void 0;
  const sha256_1$3 = sha256;
  const utils_1$3 = utils$3;
  const bls12_381_1$1 = bls12381;
  const buffer_1$7 = buffer;
  const utils_2 = utils$1;
  const PointG1 = bls12_381_1$1.bls12_381.G1;
  const PointG2 = bls12_381_1$1.bls12_381.G2;
  async function encryptOnG1(master, ID, msg) {
    if (msg.length >> 8 > 1) {
      throw new Error("cannot encrypt messages larger than our hash output: 256 bits.");
    }
    const Qid = PointG2.hashToCurve(ID, { DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_" });
    const m = PointG1.ProjectivePoint.fromHex(master);
    const Gid = bls12_381_1$1.bls12_381.pairing(m, Qid);
    const sigma = (0, utils_1$3.randomBytes)(msg.length);
    const r = h3(sigma, msg);
    const U = PointG1.ProjectivePoint.BASE.multiply(r);
    const rGid = bls12_381_1$1.bls12_381.fields.Fp12.pow(Gid, r);
    const hrGid = gtToHash(rGid, msg.length);
    const V = (0, utils_2.xor)(sigma, hrGid);
    const hsigma = h4(sigma, msg.length);
    const W2 = (0, utils_2.xor)(msg, hsigma);
    return {
      U: U.toRawBytes(),
      V,
      W: W2
    };
  }
  ibe$2.encryptOnG1 = encryptOnG1;
  async function encryptOnG2(master, ID, msg) {
    return encOnG2(master, ID, msg, "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_");
  }
  ibe$2.encryptOnG2 = encryptOnG2;
  async function encryptOnG2RFC9380(master, ID, msg) {
    return encOnG2(master, ID, msg, "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_");
  }
  ibe$2.encryptOnG2RFC9380 = encryptOnG2RFC9380;
  async function encOnG2(master, ID, msg, dst) {
    if (msg.length >> 8 > 1) {
      throw new Error("cannot encrypt messages larger than our hash output: 256 bits.");
    }
    const Qid = PointG1.hashToCurve(ID, { DST: dst });
    const m = PointG2.ProjectivePoint.fromHex(master);
    const Gid = bls12_381_1$1.bls12_381.pairing(Qid, m);
    const sigma = (0, utils_1$3.randomBytes)(msg.length);
    const r = h3(sigma, msg);
    const U = PointG2.ProjectivePoint.BASE.multiply(r);
    const rGid = bls12_381_1$1.bls12_381.fields.Fp12.pow(Gid, r);
    const hrGid = gtToHash(rGid, msg.length);
    const V = (0, utils_2.xor)(sigma, hrGid);
    const hsigma = h4(sigma, msg.length);
    const W2 = (0, utils_2.xor)(msg, hsigma);
    return {
      U: U.toRawBytes(),
      V,
      W: W2
    };
  }
  async function decryptOnG1(key, ciphertext) {
    const Qid = PointG1.ProjectivePoint.fromHex(ciphertext.U);
    const m = PointG2.ProjectivePoint.fromHex(key);
    const gidt = bls12_381_1$1.bls12_381.pairing(Qid, m);
    const hgidt = gtToHash(gidt, ciphertext.W.length);
    if (hgidt.length != ciphertext.V.length) {
      throw new Error("XorSigma is of invalid length");
    }
    const sigma = (0, utils_2.xor)(hgidt, ciphertext.V);
    const hsigma = h4(sigma, ciphertext.W.length);
    const msg = (0, utils_2.xor)(hsigma, ciphertext.W);
    const r = h3(sigma, msg);
    const rP = PointG1.ProjectivePoint.BASE.multiply(r);
    if (!rP.equals(Qid)) {
      throw new Error("invalid proof: rP check failed");
    }
    return msg;
  }
  ibe$2.decryptOnG1 = decryptOnG1;
  async function decryptOnG2(key, ciphertext) {
    const Qid = PointG1.ProjectivePoint.fromHex(key);
    const m = PointG2.ProjectivePoint.fromHex(ciphertext.U);
    const gidt = bls12_381_1$1.bls12_381.pairing(Qid, m);
    const hgidt = gtToHash(gidt, ciphertext.W.length);
    if (hgidt.length != ciphertext.V.length) {
      throw new Error("XorSigma is of invalid length");
    }
    const sigma = (0, utils_2.xor)(hgidt, ciphertext.V);
    const hsigma = h4(sigma, ciphertext.W.length);
    const msg = (0, utils_2.xor)(hsigma, ciphertext.W);
    const r = h3(sigma, msg);
    const rP = PointG2.ProjectivePoint.BASE.multiply(r);
    if (!rP.equals(m)) {
      throw new Error("invalid proof: rP check failed");
    }
    return msg;
  }
  ibe$2.decryptOnG2 = decryptOnG2;
  function gtToHash(gt, len) {
    return sha256_1$3.sha256.create().update("IBE-H2").update((0, utils_2.fp12ToBytes)(gt)).digest().slice(0, len);
  }
  ibe$2.gtToHash = gtToHash;
  const BitsToMaskForBLS12381 = 1;
  function h3(sigma, msg) {
    const h3ret = sha256_1$3.sha256.create().update("IBE-H3").update(sigma).update(msg).digest();
    for (let i = 1; i < 65535; i++) {
      let data = h3ret;
      data = sha256_1$3.sha256.create().update(create16BitUintBuffer(i)).update(data).digest();
      data[0] = data[0] >> BitsToMaskForBLS12381;
      const n = (0, utils_2.bytesToNumberBE)(data);
      if (n < bls12_381_1$1.bls12_381.fields.Fr.ORDER) {
        return n;
      }
    }
    throw new Error("invalid proof: rP check failed");
  }
  function h4(sigma, len) {
    const h4sigma = sha256_1$3.sha256.create().update("IBE-H4").update(sigma).digest();
    return h4sigma.slice(0, len);
  }
  function create16BitUintBuffer(input) {
    if (input < 0) {
      throw Error("cannot write a negative value as uint!");
    }
    if (input > 2 ** 16) {
      throw Error("input value too large to fit in a uint16!");
    }
    const buf = buffer_1$7.Buffer.alloc(2);
    buf.writeUint16LE(input);
    return buf;
  }
  var __createBinding$1 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault$1 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar$1 = commonjsGlobal && commonjsGlobal.__importStar || function(mod2) {
    if (mod2 && mod2.__esModule) return mod2;
    var result = {};
    if (mod2 != null) {
      for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding$1(result, mod2, k);
    }
    __setModuleDefault$1(result, mod2);
    return result;
  };
  Object.defineProperty(timelockEncrypter, "__esModule", { value: true });
  timelockEncrypter.hashedRoundNumber = timelockEncrypter.createTimelockEncrypter = void 0;
  const sha256_1$2 = sha256;
  const buffer_1$6 = buffer;
  const ibe$1 = __importStar$1(ibe$2);
  function createTimelockEncrypter(client2, roundNumber) {
    if (roundNumber < 1) {
      throw Error("You cannot encrypt for a roundNumber less than 1 (genesis = 0)");
    }
    return async (fileKey) => {
      const chainInfo = await client2.chain().info();
      const pk = buffer_1$6.Buffer.from(chainInfo.public_key, "hex");
      const id = hashedRoundNumber(roundNumber);
      let ciphertext;
      switch (chainInfo.schemeID) {
        case "pedersen-bls-unchained":
          {
            ciphertext = await ibe$1.encryptOnG1(pk, id, fileKey);
          }
          break;
        case "bls-unchained-on-g1":
          {
            ciphertext = await ibe$1.encryptOnG2(pk, id, fileKey);
          }
          break;
        case "bls-unchained-g1-rfc9380":
          {
            ciphertext = await ibe$1.encryptOnG2RFC9380(pk, id, fileKey);
          }
          break;
        default:
          throw Error(`Unsupported scheme: ${chainInfo.schemeID} - you must use a drand network with an unchained scheme for timelock encryption!`);
      }
      return [{
        type: "tlock",
        args: [`${roundNumber}`, chainInfo.hash],
        body: serialisedCiphertext(ciphertext)
      }];
    };
  }
  timelockEncrypter.createTimelockEncrypter = createTimelockEncrypter;
  function hashedRoundNumber(round) {
    const roundNumberBuffer = buffer_1$6.Buffer.alloc(64 / 8);
    roundNumberBuffer.writeBigUInt64BE(BigInt(round));
    return (0, sha256_1$2.sha256)(roundNumberBuffer);
  }
  timelockEncrypter.hashedRoundNumber = hashedRoundNumber;
  function serialisedCiphertext(ciphertext) {
    return buffer_1$6.Buffer.concat([ciphertext.U, ciphertext.V, ciphertext.W]);
  }
  var ageEncryptDecrypt = {};
  var hkdf$1 = {};
  var hmac = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hmac = exports.HMAC = void 0;
    const _assert_js_12 = _assert;
    const utils_js_12 = utils$3;
    class HMAC extends utils_js_12.Hash {
      constructor(hash2, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0, _assert_js_12.hash)(hash2);
        const key = (0, utils_js_12.toBytes)(_key);
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54;
        this.iHash.update(pad);
        this.oHash = hash2.create();
        for (let i = 0; i < pad.length; i++)
          pad[i] ^= 54 ^ 92;
        this.oHash.update(pad);
        pad.fill(0);
      }
      update(buf) {
        (0, _assert_js_12.exists)(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        (0, _assert_js_12.exists)(this);
        (0, _assert_js_12.bytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to2) {
        to2 || (to2 = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to2 = to2;
        to2.finished = finished;
        to2.destroyed = destroyed;
        to2.blockLen = blockLen;
        to2.outputLen = outputLen;
        to2.oHash = oHash._cloneInto(to2.oHash);
        to2.iHash = iHash._cloneInto(to2.iHash);
        return to2;
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    }
    exports.HMAC = HMAC;
    const hmac2 = (hash2, key, message2) => new HMAC(hash2, key).update(message2).digest();
    exports.hmac = hmac2;
    exports.hmac.create = (hash2, key) => new HMAC(hash2, key);
  })(hmac);
  Object.defineProperty(hkdf$1, "__esModule", { value: true });
  hkdf$1.hkdf = void 0;
  hkdf$1.extract = extract;
  hkdf$1.expand = expand;
  const _assert_js_1 = _assert;
  const utils_js_1 = utils$3;
  const hmac_js_1 = hmac;
  function extract(hash2, ikm, salt) {
    (0, _assert_js_1.hash)(hash2);
    if (salt === void 0)
      salt = new Uint8Array(hash2.outputLen);
    return (0, hmac_js_1.hmac)(hash2, (0, utils_js_1.toBytes)(salt), (0, utils_js_1.toBytes)(ikm));
  }
  const HKDF_COUNTER = /* @__PURE__ */ new Uint8Array([0]);
  const EMPTY_BUFFER = /* @__PURE__ */ new Uint8Array();
  function expand(hash2, prk, info, length = 32) {
    (0, _assert_js_1.hash)(hash2);
    (0, _assert_js_1.number)(length);
    if (length > 255 * hash2.outputLen)
      throw new Error("Length should be <= 255*HashLen");
    const blocks = Math.ceil(length / hash2.outputLen);
    if (info === void 0)
      info = EMPTY_BUFFER;
    const okm = new Uint8Array(blocks * hash2.outputLen);
    const HMAC = hmac_js_1.hmac.create(hash2, prk);
    const HMACTmp = HMAC._cloneInto();
    const T = new Uint8Array(HMAC.outputLen);
    for (let counter = 0; counter < blocks; counter++) {
      HKDF_COUNTER[0] = counter + 1;
      HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
      okm.set(T, hash2.outputLen * counter);
      HMAC._cloneInto(HMACTmp);
    }
    HMAC.destroy();
    HMACTmp.destroy();
    T.fill(0);
    HKDF_COUNTER.fill(0);
    return okm.slice(0, length);
  }
  const hkdf = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);
  hkdf$1.hkdf = hkdf;
  var streamCipher = {};
  var chacha20poly1305 = {};
  var chacha = {};
  var binary = {};
  var int = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function imulShim(a, b) {
      var ah = a >>> 16 & 65535, al = a & 65535;
      var bh = b >>> 16 & 65535, bl2 = b & 65535;
      return al * bl2 + (ah * bl2 + al * bh << 16 >>> 0) | 0;
    }
    exports.mul = Math.imul || imulShim;
    function add2(a, b) {
      return a + b | 0;
    }
    exports.add = add2;
    function sub2(a, b) {
      return a - b | 0;
    }
    exports.sub = sub2;
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    exports.rotl = rotl;
    function rotr(x, n) {
      return x << 32 - n | x >>> n;
    }
    exports.rotr = rotr;
    function isIntegerShim(n) {
      return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
    }
    exports.isInteger = Number.isInteger || isIntegerShim;
    exports.MAX_SAFE_INTEGER = 9007199254740991;
    exports.isSafeInteger = function(n) {
      return exports.isInteger(n) && (n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER);
    };
  })(int);
  Object.defineProperty(binary, "__esModule", { value: true });
  var int_1 = int;
  function readInt16BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
  }
  binary.readInt16BE = readInt16BE;
  function readUint16BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
  }
  binary.readUint16BE = readUint16BE;
  function readInt16LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
  }
  binary.readInt16LE = readInt16LE;
  function readUint16LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset + 1] << 8 | array[offset]) >>> 0;
  }
  binary.readUint16LE = readUint16LE;
  function writeUint16BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(2);
    }
    if (offset === void 0) {
      offset = 0;
    }
    out[offset + 0] = value >>> 8;
    out[offset + 1] = value >>> 0;
    return out;
  }
  binary.writeUint16BE = writeUint16BE;
  binary.writeInt16BE = writeUint16BE;
  function writeUint16LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(2);
    }
    if (offset === void 0) {
      offset = 0;
    }
    out[offset + 0] = value >>> 0;
    out[offset + 1] = value >>> 8;
    return out;
  }
  binary.writeUint16LE = writeUint16LE;
  binary.writeInt16LE = writeUint16LE;
  function readInt32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
  }
  binary.readInt32BE = readInt32BE;
  function readUint32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
  }
  binary.readUint32BE = readUint32BE;
  function readInt32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
  }
  binary.readInt32LE = readInt32LE;
  function readUint32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
  }
  binary.readUint32LE = readUint32LE;
  function writeUint32BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }
    if (offset === void 0) {
      offset = 0;
    }
    out[offset + 0] = value >>> 24;
    out[offset + 1] = value >>> 16;
    out[offset + 2] = value >>> 8;
    out[offset + 3] = value >>> 0;
    return out;
  }
  binary.writeUint32BE = writeUint32BE;
  binary.writeInt32BE = writeUint32BE;
  function writeUint32LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }
    if (offset === void 0) {
      offset = 0;
    }
    out[offset + 0] = value >>> 0;
    out[offset + 1] = value >>> 8;
    out[offset + 2] = value >>> 16;
    out[offset + 3] = value >>> 24;
    return out;
  }
  binary.writeUint32LE = writeUint32LE;
  binary.writeInt32LE = writeUint32LE;
  function readInt64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var hi = readInt32BE(array, offset);
    var lo2 = readInt32BE(array, offset + 4);
    return hi * 4294967296 + lo2 - (lo2 >> 31) * 4294967296;
  }
  binary.readInt64BE = readInt64BE;
  function readUint64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var hi = readUint32BE(array, offset);
    var lo2 = readUint32BE(array, offset + 4);
    return hi * 4294967296 + lo2;
  }
  binary.readUint64BE = readUint64BE;
  function readInt64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var lo2 = readInt32LE(array, offset);
    var hi = readInt32LE(array, offset + 4);
    return hi * 4294967296 + lo2 - (lo2 >> 31) * 4294967296;
  }
  binary.readInt64LE = readInt64LE;
  function readUint64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var lo2 = readUint32LE(array, offset);
    var hi = readUint32LE(array, offset + 4);
    return hi * 4294967296 + lo2;
  }
  binary.readUint64LE = readUint64LE;
  function writeUint64BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    writeUint32BE(value / 4294967296 >>> 0, out, offset);
    writeUint32BE(value >>> 0, out, offset + 4);
    return out;
  }
  binary.writeUint64BE = writeUint64BE;
  binary.writeInt64BE = writeUint64BE;
  function writeUint64LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    writeUint32LE(value >>> 0, out, offset);
    writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
    return out;
  }
  binary.writeUint64LE = writeUint64LE;
  binary.writeInt64LE = writeUint64LE;
  function readUintBE(bitLength, array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    if (bitLength % 8 !== 0) {
      throw new Error("readUintBE supports only bitLengths divisible by 8");
    }
    if (bitLength / 8 > array.length - offset) {
      throw new Error("readUintBE: array is too short for the given bitLength");
    }
    var result = 0;
    var mul = 1;
    for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
      result += array[i] * mul;
      mul *= 256;
    }
    return result;
  }
  binary.readUintBE = readUintBE;
  function readUintLE(bitLength, array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    if (bitLength % 8 !== 0) {
      throw new Error("readUintLE supports only bitLengths divisible by 8");
    }
    if (bitLength / 8 > array.length - offset) {
      throw new Error("readUintLE: array is too short for the given bitLength");
    }
    var result = 0;
    var mul = 1;
    for (var i = offset; i < offset + bitLength / 8; i++) {
      result += array[i] * mul;
      mul *= 256;
    }
    return result;
  }
  binary.readUintLE = readUintLE;
  function writeUintBE(bitLength, value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(bitLength / 8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    if (bitLength % 8 !== 0) {
      throw new Error("writeUintBE supports only bitLengths divisible by 8");
    }
    if (!int_1.isSafeInteger(value)) {
      throw new Error("writeUintBE value must be an integer");
    }
    var div = 1;
    for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
      out[i] = value / div & 255;
      div *= 256;
    }
    return out;
  }
  binary.writeUintBE = writeUintBE;
  function writeUintLE(bitLength, value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(bitLength / 8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    if (bitLength % 8 !== 0) {
      throw new Error("writeUintLE supports only bitLengths divisible by 8");
    }
    if (!int_1.isSafeInteger(value)) {
      throw new Error("writeUintLE value must be an integer");
    }
    var div = 1;
    for (var i = offset; i < offset + bitLength / 8; i++) {
      out[i] = value / div & 255;
      div *= 256;
    }
    return out;
  }
  binary.writeUintLE = writeUintLE;
  function readFloat32BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat32(offset);
  }
  binary.readFloat32BE = readFloat32BE;
  function readFloat32LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat32(offset, true);
  }
  binary.readFloat32LE = readFloat32LE;
  function readFloat64BE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat64(offset);
  }
  binary.readFloat64BE = readFloat64BE;
  function readFloat64LE(array, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
    return view.getFloat64(offset, true);
  }
  binary.readFloat64LE = readFloat64LE;
  function writeFloat32BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat32(offset, value);
    return out;
  }
  binary.writeFloat32BE = writeFloat32BE;
  function writeFloat32LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(4);
    }
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat32(offset, value, true);
    return out;
  }
  binary.writeFloat32LE = writeFloat32LE;
  function writeFloat64BE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat64(offset, value);
    return out;
  }
  binary.writeFloat64BE = writeFloat64BE;
  function writeFloat64LE(value, out, offset) {
    if (out === void 0) {
      out = new Uint8Array(8);
    }
    if (offset === void 0) {
      offset = 0;
    }
    var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    view.setFloat64(offset, value, true);
    return out;
  }
  binary.writeFloat64LE = writeFloat64LE;
  var wipe$1 = {};
  Object.defineProperty(wipe$1, "__esModule", { value: true });
  function wipe(array) {
    for (var i = 0; i < array.length; i++) {
      array[i] = 0;
    }
    return array;
  }
  wipe$1.wipe = wipe;
  Object.defineProperty(chacha, "__esModule", { value: true });
  var binary_1 = binary;
  var wipe_1 = wipe$1;
  var ROUNDS = 20;
  function core(out, input, key) {
    var j0 = 1634760805;
    var j1 = 857760878;
    var j2 = 2036477234;
    var j3 = 1797285236;
    var j4 = key[3] << 24 | key[2] << 16 | key[1] << 8 | key[0];
    var j5 = key[7] << 24 | key[6] << 16 | key[5] << 8 | key[4];
    var j6 = key[11] << 24 | key[10] << 16 | key[9] << 8 | key[8];
    var j7 = key[15] << 24 | key[14] << 16 | key[13] << 8 | key[12];
    var j8 = key[19] << 24 | key[18] << 16 | key[17] << 8 | key[16];
    var j9 = key[23] << 24 | key[22] << 16 | key[21] << 8 | key[20];
    var j10 = key[27] << 24 | key[26] << 16 | key[25] << 8 | key[24];
    var j11 = key[31] << 24 | key[30] << 16 | key[29] << 8 | key[28];
    var j12 = input[3] << 24 | input[2] << 16 | input[1] << 8 | input[0];
    var j13 = input[7] << 24 | input[6] << 16 | input[5] << 8 | input[4];
    var j14 = input[11] << 24 | input[10] << 16 | input[9] << 8 | input[8];
    var j15 = input[15] << 24 | input[14] << 16 | input[13] << 8 | input[12];
    var x0 = j0;
    var x1 = j1;
    var x2 = j2;
    var x3 = j3;
    var x4 = j4;
    var x5 = j5;
    var x6 = j6;
    var x7 = j7;
    var x8 = j8;
    var x9 = j9;
    var x10 = j10;
    var x11 = j11;
    var x12 = j12;
    var x13 = j13;
    var x14 = j14;
    var x15 = j15;
    for (var i = 0; i < ROUNDS; i += 2) {
      x0 = x0 + x4 | 0;
      x12 ^= x0;
      x12 = x12 >>> 32 - 16 | x12 << 16;
      x8 = x8 + x12 | 0;
      x4 ^= x8;
      x4 = x4 >>> 32 - 12 | x4 << 12;
      x1 = x1 + x5 | 0;
      x13 ^= x1;
      x13 = x13 >>> 32 - 16 | x13 << 16;
      x9 = x9 + x13 | 0;
      x5 ^= x9;
      x5 = x5 >>> 32 - 12 | x5 << 12;
      x2 = x2 + x6 | 0;
      x14 ^= x2;
      x14 = x14 >>> 32 - 16 | x14 << 16;
      x10 = x10 + x14 | 0;
      x6 ^= x10;
      x6 = x6 >>> 32 - 12 | x6 << 12;
      x3 = x3 + x7 | 0;
      x15 ^= x3;
      x15 = x15 >>> 32 - 16 | x15 << 16;
      x11 = x11 + x15 | 0;
      x7 ^= x11;
      x7 = x7 >>> 32 - 12 | x7 << 12;
      x2 = x2 + x6 | 0;
      x14 ^= x2;
      x14 = x14 >>> 32 - 8 | x14 << 8;
      x10 = x10 + x14 | 0;
      x6 ^= x10;
      x6 = x6 >>> 32 - 7 | x6 << 7;
      x3 = x3 + x7 | 0;
      x15 ^= x3;
      x15 = x15 >>> 32 - 8 | x15 << 8;
      x11 = x11 + x15 | 0;
      x7 ^= x11;
      x7 = x7 >>> 32 - 7 | x7 << 7;
      x1 = x1 + x5 | 0;
      x13 ^= x1;
      x13 = x13 >>> 32 - 8 | x13 << 8;
      x9 = x9 + x13 | 0;
      x5 ^= x9;
      x5 = x5 >>> 32 - 7 | x5 << 7;
      x0 = x0 + x4 | 0;
      x12 ^= x0;
      x12 = x12 >>> 32 - 8 | x12 << 8;
      x8 = x8 + x12 | 0;
      x4 ^= x8;
      x4 = x4 >>> 32 - 7 | x4 << 7;
      x0 = x0 + x5 | 0;
      x15 ^= x0;
      x15 = x15 >>> 32 - 16 | x15 << 16;
      x10 = x10 + x15 | 0;
      x5 ^= x10;
      x5 = x5 >>> 32 - 12 | x5 << 12;
      x1 = x1 + x6 | 0;
      x12 ^= x1;
      x12 = x12 >>> 32 - 16 | x12 << 16;
      x11 = x11 + x12 | 0;
      x6 ^= x11;
      x6 = x6 >>> 32 - 12 | x6 << 12;
      x2 = x2 + x7 | 0;
      x13 ^= x2;
      x13 = x13 >>> 32 - 16 | x13 << 16;
      x8 = x8 + x13 | 0;
      x7 ^= x8;
      x7 = x7 >>> 32 - 12 | x7 << 12;
      x3 = x3 + x4 | 0;
      x14 ^= x3;
      x14 = x14 >>> 32 - 16 | x14 << 16;
      x9 = x9 + x14 | 0;
      x4 ^= x9;
      x4 = x4 >>> 32 - 12 | x4 << 12;
      x2 = x2 + x7 | 0;
      x13 ^= x2;
      x13 = x13 >>> 32 - 8 | x13 << 8;
      x8 = x8 + x13 | 0;
      x7 ^= x8;
      x7 = x7 >>> 32 - 7 | x7 << 7;
      x3 = x3 + x4 | 0;
      x14 ^= x3;
      x14 = x14 >>> 32 - 8 | x14 << 8;
      x9 = x9 + x14 | 0;
      x4 ^= x9;
      x4 = x4 >>> 32 - 7 | x4 << 7;
      x1 = x1 + x6 | 0;
      x12 ^= x1;
      x12 = x12 >>> 32 - 8 | x12 << 8;
      x11 = x11 + x12 | 0;
      x6 ^= x11;
      x6 = x6 >>> 32 - 7 | x6 << 7;
      x0 = x0 + x5 | 0;
      x15 ^= x0;
      x15 = x15 >>> 32 - 8 | x15 << 8;
      x10 = x10 + x15 | 0;
      x5 ^= x10;
      x5 = x5 >>> 32 - 7 | x5 << 7;
    }
    binary_1.writeUint32LE(x0 + j0 | 0, out, 0);
    binary_1.writeUint32LE(x1 + j1 | 0, out, 4);
    binary_1.writeUint32LE(x2 + j2 | 0, out, 8);
    binary_1.writeUint32LE(x3 + j3 | 0, out, 12);
    binary_1.writeUint32LE(x4 + j4 | 0, out, 16);
    binary_1.writeUint32LE(x5 + j5 | 0, out, 20);
    binary_1.writeUint32LE(x6 + j6 | 0, out, 24);
    binary_1.writeUint32LE(x7 + j7 | 0, out, 28);
    binary_1.writeUint32LE(x8 + j8 | 0, out, 32);
    binary_1.writeUint32LE(x9 + j9 | 0, out, 36);
    binary_1.writeUint32LE(x10 + j10 | 0, out, 40);
    binary_1.writeUint32LE(x11 + j11 | 0, out, 44);
    binary_1.writeUint32LE(x12 + j12 | 0, out, 48);
    binary_1.writeUint32LE(x13 + j13 | 0, out, 52);
    binary_1.writeUint32LE(x14 + j14 | 0, out, 56);
    binary_1.writeUint32LE(x15 + j15 | 0, out, 60);
  }
  function streamXOR(key, nonce, src, dst, nonceInplaceCounterLength) {
    if (nonceInplaceCounterLength === void 0) {
      nonceInplaceCounterLength = 0;
    }
    if (key.length !== 32) {
      throw new Error("ChaCha: key size must be 32 bytes");
    }
    if (dst.length < src.length) {
      throw new Error("ChaCha: destination is shorter than source");
    }
    var nc;
    var counterLength;
    if (nonceInplaceCounterLength === 0) {
      if (nonce.length !== 8 && nonce.length !== 12) {
        throw new Error("ChaCha nonce must be 8 or 12 bytes");
      }
      nc = new Uint8Array(16);
      counterLength = nc.length - nonce.length;
      nc.set(nonce, counterLength);
    } else {
      if (nonce.length !== 16) {
        throw new Error("ChaCha nonce with counter must be 16 bytes");
      }
      nc = nonce;
      counterLength = nonceInplaceCounterLength;
    }
    var block = new Uint8Array(64);
    for (var i = 0; i < src.length; i += 64) {
      core(block, nc, key);
      for (var j = i; j < i + 64 && j < src.length; j++) {
        dst[j] = src[j] ^ block[j - i];
      }
      incrementCounter(nc, 0, counterLength);
    }
    wipe_1.wipe(block);
    if (nonceInplaceCounterLength === 0) {
      wipe_1.wipe(nc);
    }
    return dst;
  }
  chacha.streamXOR = streamXOR;
  function stream(key, nonce, dst, nonceInplaceCounterLength) {
    if (nonceInplaceCounterLength === void 0) {
      nonceInplaceCounterLength = 0;
    }
    wipe_1.wipe(dst);
    return streamXOR(key, nonce, dst, dst, nonceInplaceCounterLength);
  }
  chacha.stream = stream;
  function incrementCounter(counter, pos, len) {
    var carry = 1;
    while (len--) {
      carry = carry + (counter[pos] & 255) | 0;
      counter[pos] = carry & 255;
      carry >>>= 8;
      pos++;
    }
    if (carry > 0) {
      throw new Error("ChaCha: counter overflow");
    }
  }
  var poly1305 = {};
  var constantTime = {};
  Object.defineProperty(constantTime, "__esModule", { value: true });
  function select(subject, resultIfOne, resultIfZero) {
    return ~(subject - 1) & resultIfOne | subject - 1 & resultIfZero;
  }
  constantTime.select = select;
  function lessOrEqual(a, b) {
    return (a | 0) - (b | 0) - 1 >>> 31 & 1;
  }
  constantTime.lessOrEqual = lessOrEqual;
  function compare(a, b) {
    if (a.length !== b.length) {
      return 0;
    }
    var result = 0;
    for (var i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return 1 & result - 1 >>> 8;
  }
  constantTime.compare = compare;
  function equal(a, b) {
    if (a.length === 0 || b.length === 0) {
      return false;
    }
    return compare(a, b) !== 0;
  }
  constantTime.equal = equal;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var constant_time_1 = constantTime;
    var wipe_12 = wipe$1;
    exports.DIGEST_LENGTH = 16;
    var Poly1305 = (
      /** @class */
      function() {
        function Poly13052(key) {
          this.digestLength = exports.DIGEST_LENGTH;
          this._buffer = new Uint8Array(16);
          this._r = new Uint16Array(10);
          this._h = new Uint16Array(10);
          this._pad = new Uint16Array(8);
          this._leftover = 0;
          this._fin = 0;
          this._finished = false;
          var t0 = key[0] | key[1] << 8;
          this._r[0] = t0 & 8191;
          var t1 = key[2] | key[3] << 8;
          this._r[1] = (t0 >>> 13 | t1 << 3) & 8191;
          var t2 = key[4] | key[5] << 8;
          this._r[2] = (t1 >>> 10 | t2 << 6) & 7939;
          var t3 = key[6] | key[7] << 8;
          this._r[3] = (t2 >>> 7 | t3 << 9) & 8191;
          var t4 = key[8] | key[9] << 8;
          this._r[4] = (t3 >>> 4 | t4 << 12) & 255;
          this._r[5] = t4 >>> 1 & 8190;
          var t5 = key[10] | key[11] << 8;
          this._r[6] = (t4 >>> 14 | t5 << 2) & 8191;
          var t6 = key[12] | key[13] << 8;
          this._r[7] = (t5 >>> 11 | t6 << 5) & 8065;
          var t7 = key[14] | key[15] << 8;
          this._r[8] = (t6 >>> 8 | t7 << 8) & 8191;
          this._r[9] = t7 >>> 5 & 127;
          this._pad[0] = key[16] | key[17] << 8;
          this._pad[1] = key[18] | key[19] << 8;
          this._pad[2] = key[20] | key[21] << 8;
          this._pad[3] = key[22] | key[23] << 8;
          this._pad[4] = key[24] | key[25] << 8;
          this._pad[5] = key[26] | key[27] << 8;
          this._pad[6] = key[28] | key[29] << 8;
          this._pad[7] = key[30] | key[31] << 8;
        }
        Poly13052.prototype._blocks = function(m, mpos, bytes2) {
          var hibit = this._fin ? 0 : 1 << 11;
          var h0 = this._h[0], h1 = this._h[1], h2 = this._h[2], h32 = this._h[3], h42 = this._h[4], h5 = this._h[5], h6 = this._h[6], h7 = this._h[7], h8 = this._h[8], h9 = this._h[9];
          var r0 = this._r[0], r1 = this._r[1], r2 = this._r[2], r3 = this._r[3], r4 = this._r[4], r5 = this._r[5], r6 = this._r[6], r7 = this._r[7], r8 = this._r[8], r9 = this._r[9];
          while (bytes2 >= 16) {
            var t0 = m[mpos + 0] | m[mpos + 1] << 8;
            h0 += t0 & 8191;
            var t1 = m[mpos + 2] | m[mpos + 3] << 8;
            h1 += (t0 >>> 13 | t1 << 3) & 8191;
            var t2 = m[mpos + 4] | m[mpos + 5] << 8;
            h2 += (t1 >>> 10 | t2 << 6) & 8191;
            var t3 = m[mpos + 6] | m[mpos + 7] << 8;
            h32 += (t2 >>> 7 | t3 << 9) & 8191;
            var t4 = m[mpos + 8] | m[mpos + 9] << 8;
            h42 += (t3 >>> 4 | t4 << 12) & 8191;
            h5 += t4 >>> 1 & 8191;
            var t5 = m[mpos + 10] | m[mpos + 11] << 8;
            h6 += (t4 >>> 14 | t5 << 2) & 8191;
            var t6 = m[mpos + 12] | m[mpos + 13] << 8;
            h7 += (t5 >>> 11 | t6 << 5) & 8191;
            var t7 = m[mpos + 14] | m[mpos + 15] << 8;
            h8 += (t6 >>> 8 | t7 << 8) & 8191;
            h9 += t7 >>> 5 | hibit;
            var c = 0;
            var d0 = c;
            d0 += h0 * r0;
            d0 += h1 * (5 * r9);
            d0 += h2 * (5 * r8);
            d0 += h32 * (5 * r7);
            d0 += h42 * (5 * r6);
            c = d0 >>> 13;
            d0 &= 8191;
            d0 += h5 * (5 * r5);
            d0 += h6 * (5 * r4);
            d0 += h7 * (5 * r3);
            d0 += h8 * (5 * r2);
            d0 += h9 * (5 * r1);
            c += d0 >>> 13;
            d0 &= 8191;
            var d1 = c;
            d1 += h0 * r1;
            d1 += h1 * r0;
            d1 += h2 * (5 * r9);
            d1 += h32 * (5 * r8);
            d1 += h42 * (5 * r7);
            c = d1 >>> 13;
            d1 &= 8191;
            d1 += h5 * (5 * r6);
            d1 += h6 * (5 * r5);
            d1 += h7 * (5 * r4);
            d1 += h8 * (5 * r3);
            d1 += h9 * (5 * r2);
            c += d1 >>> 13;
            d1 &= 8191;
            var d2 = c;
            d2 += h0 * r2;
            d2 += h1 * r1;
            d2 += h2 * r0;
            d2 += h32 * (5 * r9);
            d2 += h42 * (5 * r8);
            c = d2 >>> 13;
            d2 &= 8191;
            d2 += h5 * (5 * r7);
            d2 += h6 * (5 * r6);
            d2 += h7 * (5 * r5);
            d2 += h8 * (5 * r4);
            d2 += h9 * (5 * r3);
            c += d2 >>> 13;
            d2 &= 8191;
            var d3 = c;
            d3 += h0 * r3;
            d3 += h1 * r2;
            d3 += h2 * r1;
            d3 += h32 * r0;
            d3 += h42 * (5 * r9);
            c = d3 >>> 13;
            d3 &= 8191;
            d3 += h5 * (5 * r8);
            d3 += h6 * (5 * r7);
            d3 += h7 * (5 * r6);
            d3 += h8 * (5 * r5);
            d3 += h9 * (5 * r4);
            c += d3 >>> 13;
            d3 &= 8191;
            var d4 = c;
            d4 += h0 * r4;
            d4 += h1 * r3;
            d4 += h2 * r2;
            d4 += h32 * r1;
            d4 += h42 * r0;
            c = d4 >>> 13;
            d4 &= 8191;
            d4 += h5 * (5 * r9);
            d4 += h6 * (5 * r8);
            d4 += h7 * (5 * r7);
            d4 += h8 * (5 * r6);
            d4 += h9 * (5 * r5);
            c += d4 >>> 13;
            d4 &= 8191;
            var d5 = c;
            d5 += h0 * r5;
            d5 += h1 * r4;
            d5 += h2 * r3;
            d5 += h32 * r2;
            d5 += h42 * r1;
            c = d5 >>> 13;
            d5 &= 8191;
            d5 += h5 * r0;
            d5 += h6 * (5 * r9);
            d5 += h7 * (5 * r8);
            d5 += h8 * (5 * r7);
            d5 += h9 * (5 * r6);
            c += d5 >>> 13;
            d5 &= 8191;
            var d6 = c;
            d6 += h0 * r6;
            d6 += h1 * r5;
            d6 += h2 * r4;
            d6 += h32 * r3;
            d6 += h42 * r2;
            c = d6 >>> 13;
            d6 &= 8191;
            d6 += h5 * r1;
            d6 += h6 * r0;
            d6 += h7 * (5 * r9);
            d6 += h8 * (5 * r8);
            d6 += h9 * (5 * r7);
            c += d6 >>> 13;
            d6 &= 8191;
            var d7 = c;
            d7 += h0 * r7;
            d7 += h1 * r6;
            d7 += h2 * r5;
            d7 += h32 * r4;
            d7 += h42 * r3;
            c = d7 >>> 13;
            d7 &= 8191;
            d7 += h5 * r2;
            d7 += h6 * r1;
            d7 += h7 * r0;
            d7 += h8 * (5 * r9);
            d7 += h9 * (5 * r8);
            c += d7 >>> 13;
            d7 &= 8191;
            var d8 = c;
            d8 += h0 * r8;
            d8 += h1 * r7;
            d8 += h2 * r6;
            d8 += h32 * r5;
            d8 += h42 * r4;
            c = d8 >>> 13;
            d8 &= 8191;
            d8 += h5 * r3;
            d8 += h6 * r2;
            d8 += h7 * r1;
            d8 += h8 * r0;
            d8 += h9 * (5 * r9);
            c += d8 >>> 13;
            d8 &= 8191;
            var d9 = c;
            d9 += h0 * r9;
            d9 += h1 * r8;
            d9 += h2 * r7;
            d9 += h32 * r6;
            d9 += h42 * r5;
            c = d9 >>> 13;
            d9 &= 8191;
            d9 += h5 * r4;
            d9 += h6 * r3;
            d9 += h7 * r2;
            d9 += h8 * r1;
            d9 += h9 * r0;
            c += d9 >>> 13;
            d9 &= 8191;
            c = (c << 2) + c | 0;
            c = c + d0 | 0;
            d0 = c & 8191;
            c = c >>> 13;
            d1 += c;
            h0 = d0;
            h1 = d1;
            h2 = d2;
            h32 = d3;
            h42 = d4;
            h5 = d5;
            h6 = d6;
            h7 = d7;
            h8 = d8;
            h9 = d9;
            mpos += 16;
            bytes2 -= 16;
          }
          this._h[0] = h0;
          this._h[1] = h1;
          this._h[2] = h2;
          this._h[3] = h32;
          this._h[4] = h42;
          this._h[5] = h5;
          this._h[6] = h6;
          this._h[7] = h7;
          this._h[8] = h8;
          this._h[9] = h9;
        };
        Poly13052.prototype.finish = function(mac2, macpos) {
          if (macpos === void 0) {
            macpos = 0;
          }
          var g = new Uint16Array(10);
          var c;
          var mask;
          var f;
          var i;
          if (this._leftover) {
            i = this._leftover;
            this._buffer[i++] = 1;
            for (; i < 16; i++) {
              this._buffer[i] = 0;
            }
            this._fin = 1;
            this._blocks(this._buffer, 0, 16);
          }
          c = this._h[1] >>> 13;
          this._h[1] &= 8191;
          for (i = 2; i < 10; i++) {
            this._h[i] += c;
            c = this._h[i] >>> 13;
            this._h[i] &= 8191;
          }
          this._h[0] += c * 5;
          c = this._h[0] >>> 13;
          this._h[0] &= 8191;
          this._h[1] += c;
          c = this._h[1] >>> 13;
          this._h[1] &= 8191;
          this._h[2] += c;
          g[0] = this._h[0] + 5;
          c = g[0] >>> 13;
          g[0] &= 8191;
          for (i = 1; i < 10; i++) {
            g[i] = this._h[i] + c;
            c = g[i] >>> 13;
            g[i] &= 8191;
          }
          g[9] -= 1 << 13;
          mask = (c ^ 1) - 1;
          for (i = 0; i < 10; i++) {
            g[i] &= mask;
          }
          mask = ~mask;
          for (i = 0; i < 10; i++) {
            this._h[i] = this._h[i] & mask | g[i];
          }
          this._h[0] = (this._h[0] | this._h[1] << 13) & 65535;
          this._h[1] = (this._h[1] >>> 3 | this._h[2] << 10) & 65535;
          this._h[2] = (this._h[2] >>> 6 | this._h[3] << 7) & 65535;
          this._h[3] = (this._h[3] >>> 9 | this._h[4] << 4) & 65535;
          this._h[4] = (this._h[4] >>> 12 | this._h[5] << 1 | this._h[6] << 14) & 65535;
          this._h[5] = (this._h[6] >>> 2 | this._h[7] << 11) & 65535;
          this._h[6] = (this._h[7] >>> 5 | this._h[8] << 8) & 65535;
          this._h[7] = (this._h[8] >>> 8 | this._h[9] << 5) & 65535;
          f = this._h[0] + this._pad[0];
          this._h[0] = f & 65535;
          for (i = 1; i < 8; i++) {
            f = (this._h[i] + this._pad[i] | 0) + (f >>> 16) | 0;
            this._h[i] = f & 65535;
          }
          mac2[macpos + 0] = this._h[0] >>> 0;
          mac2[macpos + 1] = this._h[0] >>> 8;
          mac2[macpos + 2] = this._h[1] >>> 0;
          mac2[macpos + 3] = this._h[1] >>> 8;
          mac2[macpos + 4] = this._h[2] >>> 0;
          mac2[macpos + 5] = this._h[2] >>> 8;
          mac2[macpos + 6] = this._h[3] >>> 0;
          mac2[macpos + 7] = this._h[3] >>> 8;
          mac2[macpos + 8] = this._h[4] >>> 0;
          mac2[macpos + 9] = this._h[4] >>> 8;
          mac2[macpos + 10] = this._h[5] >>> 0;
          mac2[macpos + 11] = this._h[5] >>> 8;
          mac2[macpos + 12] = this._h[6] >>> 0;
          mac2[macpos + 13] = this._h[6] >>> 8;
          mac2[macpos + 14] = this._h[7] >>> 0;
          mac2[macpos + 15] = this._h[7] >>> 8;
          this._finished = true;
          return this;
        };
        Poly13052.prototype.update = function(m) {
          var mpos = 0;
          var bytes2 = m.length;
          var want;
          if (this._leftover) {
            want = 16 - this._leftover;
            if (want > bytes2) {
              want = bytes2;
            }
            for (var i = 0; i < want; i++) {
              this._buffer[this._leftover + i] = m[mpos + i];
            }
            bytes2 -= want;
            mpos += want;
            this._leftover += want;
            if (this._leftover < 16) {
              return this;
            }
            this._blocks(this._buffer, 0, 16);
            this._leftover = 0;
          }
          if (bytes2 >= 16) {
            want = bytes2 - bytes2 % 16;
            this._blocks(m, mpos, want);
            mpos += want;
            bytes2 -= want;
          }
          if (bytes2) {
            for (var i = 0; i < bytes2; i++) {
              this._buffer[this._leftover + i] = m[mpos + i];
            }
            this._leftover += bytes2;
          }
          return this;
        };
        Poly13052.prototype.digest = function() {
          if (this._finished) {
            throw new Error("Poly1305 was finished");
          }
          var mac2 = new Uint8Array(16);
          this.finish(mac2);
          return mac2;
        };
        Poly13052.prototype.clean = function() {
          wipe_12.wipe(this._buffer);
          wipe_12.wipe(this._r);
          wipe_12.wipe(this._h);
          wipe_12.wipe(this._pad);
          this._leftover = 0;
          this._fin = 0;
          this._finished = true;
          return this;
        };
        return Poly13052;
      }()
    );
    exports.Poly1305 = Poly1305;
    function oneTimeAuth(key, data) {
      var h2 = new Poly1305(key);
      h2.update(data);
      var digest = h2.digest();
      h2.clean();
      return digest;
    }
    exports.oneTimeAuth = oneTimeAuth;
    function equal2(a, b) {
      if (a.length !== exports.DIGEST_LENGTH || b.length !== exports.DIGEST_LENGTH) {
        return false;
      }
      return constant_time_1.equal(a, b);
    }
    exports.equal = equal2;
  })(poly1305);
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var chacha_1 = chacha;
    var poly1305_1 = poly1305;
    var wipe_12 = wipe$1;
    var binary_12 = binary;
    var constant_time_1 = constantTime;
    exports.KEY_LENGTH = 32;
    exports.NONCE_LENGTH = 12;
    exports.TAG_LENGTH = 16;
    var ZEROS = new Uint8Array(16);
    var ChaCha20Poly1305 = (
      /** @class */
      function() {
        function ChaCha20Poly13052(key) {
          this.nonceLength = exports.NONCE_LENGTH;
          this.tagLength = exports.TAG_LENGTH;
          if (key.length !== exports.KEY_LENGTH) {
            throw new Error("ChaCha20Poly1305 needs 32-byte key");
          }
          this._key = new Uint8Array(key);
        }
        ChaCha20Poly13052.prototype.seal = function(nonce, plaintext, associatedData, dst) {
          if (nonce.length > 16) {
            throw new Error("ChaCha20Poly1305: incorrect nonce length");
          }
          var counter = new Uint8Array(16);
          counter.set(nonce, counter.length - nonce.length);
          var authKey = new Uint8Array(32);
          chacha_1.stream(this._key, counter, authKey, 4);
          var resultLength = plaintext.length + this.tagLength;
          var result;
          if (dst) {
            if (dst.length !== resultLength) {
              throw new Error("ChaCha20Poly1305: incorrect destination length");
            }
            result = dst;
          } else {
            result = new Uint8Array(resultLength);
          }
          chacha_1.streamXOR(this._key, counter, plaintext, result, 4);
          this._authenticate(result.subarray(result.length - this.tagLength, result.length), authKey, result.subarray(0, result.length - this.tagLength), associatedData);
          wipe_12.wipe(counter);
          return result;
        };
        ChaCha20Poly13052.prototype.open = function(nonce, sealed, associatedData, dst) {
          if (nonce.length > 16) {
            throw new Error("ChaCha20Poly1305: incorrect nonce length");
          }
          if (sealed.length < this.tagLength) {
            return null;
          }
          var counter = new Uint8Array(16);
          counter.set(nonce, counter.length - nonce.length);
          var authKey = new Uint8Array(32);
          chacha_1.stream(this._key, counter, authKey, 4);
          var calculatedTag = new Uint8Array(this.tagLength);
          this._authenticate(calculatedTag, authKey, sealed.subarray(0, sealed.length - this.tagLength), associatedData);
          if (!constant_time_1.equal(calculatedTag, sealed.subarray(sealed.length - this.tagLength, sealed.length))) {
            return null;
          }
          var resultLength = sealed.length - this.tagLength;
          var result;
          if (dst) {
            if (dst.length !== resultLength) {
              throw new Error("ChaCha20Poly1305: incorrect destination length");
            }
            result = dst;
          } else {
            result = new Uint8Array(resultLength);
          }
          chacha_1.streamXOR(this._key, counter, sealed.subarray(0, sealed.length - this.tagLength), result, 4);
          wipe_12.wipe(counter);
          return result;
        };
        ChaCha20Poly13052.prototype.clean = function() {
          wipe_12.wipe(this._key);
          return this;
        };
        ChaCha20Poly13052.prototype._authenticate = function(tagOut, authKey, ciphertext, associatedData) {
          var h2 = new poly1305_1.Poly1305(authKey);
          if (associatedData) {
            h2.update(associatedData);
            if (associatedData.length % 16 > 0) {
              h2.update(ZEROS.subarray(associatedData.length % 16));
            }
          }
          h2.update(ciphertext);
          if (ciphertext.length % 16 > 0) {
            h2.update(ZEROS.subarray(ciphertext.length % 16));
          }
          var length = new Uint8Array(8);
          if (associatedData) {
            binary_12.writeUint64LE(associatedData.length, length);
          }
          h2.update(length);
          binary_12.writeUint64LE(ciphertext.length, length);
          h2.update(length);
          var tag = h2.digest();
          for (var i = 0; i < tag.length; i++) {
            tagOut[i] = tag[i];
          }
          h2.clean();
          wipe_12.wipe(tag);
          wipe_12.wipe(length);
        };
        return ChaCha20Poly13052;
      }()
    );
    exports.ChaCha20Poly1305 = ChaCha20Poly1305;
  })(chacha20poly1305);
  Object.defineProperty(streamCipher, "__esModule", { value: true });
  streamCipher.STREAM = void 0;
  const chacha20poly1305_1 = chacha20poly1305;
  const CHUNK_SIZE = 64 * 1024;
  const TAG_SIZE = 16;
  const ENCRYPTED_CHUNK_SIZE = CHUNK_SIZE + TAG_SIZE;
  const NONCE_SIZE = 12;
  const COUNTER_MAX = Math.pow(2, 32) - 1;
  class STREAM {
    static seal(plaintext, privateKey) {
      const stream2 = new STREAM(privateKey);
      const chunks = Math.ceil(plaintext.length / CHUNK_SIZE);
      const ciphertext = new Uint8Array(plaintext.length + chunks * TAG_SIZE);
      for (let chunk64kb = 1; chunk64kb <= chunks; chunk64kb++) {
        const start = chunk64kb - 1;
        const end = chunk64kb;
        const isLast = chunk64kb === chunks;
        const input = plaintext.slice(start * CHUNK_SIZE, end * CHUNK_SIZE);
        const output2 = ciphertext.subarray(start * ENCRYPTED_CHUNK_SIZE, end * ENCRYPTED_CHUNK_SIZE);
        stream2.encryptChunk(input, isLast, output2);
      }
      stream2.clear();
      return ciphertext;
    }
    static open(ciphertext, privateKey) {
      const stream2 = new STREAM(privateKey);
      const chunks = Math.ceil(ciphertext.length / ENCRYPTED_CHUNK_SIZE);
      const plaintext = new Uint8Array(ciphertext.length - chunks * TAG_SIZE);
      for (let chunk64kb = 1; chunk64kb <= chunks; chunk64kb++) {
        const start = chunk64kb - 1;
        const end = chunk64kb;
        const isLast = chunk64kb === chunks;
        const input = ciphertext.slice(start * ENCRYPTED_CHUNK_SIZE, end * ENCRYPTED_CHUNK_SIZE);
        const output2 = plaintext.subarray(start * CHUNK_SIZE, end * CHUNK_SIZE);
        stream2.decryptChunk(input, isLast, output2);
      }
      stream2.clear();
      return plaintext;
    }
    constructor(key) {
      this.key = key.slice();
      this.nonce = new Uint8Array(NONCE_SIZE);
      this.nonceView = new DataView(this.nonce.buffer);
      this.counter = 0;
    }
    encryptChunk(chunk, isLast, output2) {
      if (chunk.length > CHUNK_SIZE)
        throw new Error("Chunk is too big");
      if (this.nonce[11] === 1)
        throw new Error("Last chunk has been processed");
      if (isLast)
        this.nonce[11] = 1;
      const ciphertext = new chacha20poly1305_1.ChaCha20Poly1305(this.key).seal(this.nonce, chunk);
      output2.set(ciphertext);
      this.incrementCounter();
    }
    decryptChunk(chunk, isLast, output2) {
      if (chunk.length > ENCRYPTED_CHUNK_SIZE)
        throw new Error("Chunk is too big");
      if (this.nonce[11] === 1)
        throw new Error("Last chunk has been processed");
      if (isLast)
        this.nonce[11] = 1;
      const plaintext = new chacha20poly1305_1.ChaCha20Poly1305(this.key).open(this.nonce, chunk);
      if (plaintext == null) {
        throw Error("Error during decryption!");
      }
      output2.set(plaintext);
      this.incrementCounter();
    }
    // Increments Big Endian Uint8Array-based counter.
    // [0, 0, 0] => [0, 0, 1] ... => [0, 0, 255] => [0, 1, 0]
    incrementCounter() {
      if (this.counter == COUNTER_MAX) {
        throw new Error("Stream cipher counter has already hit max value! Aborting to avoid nonce reuse - tlock only supports payloads up to 256TB");
      }
      this.counter += 1;
      this.nonceView.setUint32(7, this.counter, false);
    }
    clear() {
      function clear(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = 0;
        }
      }
      clear(this.key);
      clear(this.nonce);
      this.counter = 0;
    }
  }
  streamCipher.STREAM = STREAM;
  var noOpEncdec = {};
  Object.defineProperty(noOpEncdec, "__esModule", { value: true });
  noOpEncdec.NoOpEncDec = void 0;
  const noOpType = "no-op";
  class NoOpEncDec {
    static async wrap(filekey) {
      return [{
        type: noOpType,
        args: [],
        body: filekey
      }];
    }
    static async unwrap(recipients2) {
      if (recipients2.length !== 1) {
        throw Error("NoOpEncDec only expects a single stanza!");
      }
      if (recipients2[0].type !== noOpType) {
        throw Error(`NoOpEncDec expects the type of the stanza to be ${noOpType}`);
      }
      return recipients2[0].body;
    }
  }
  noOpEncdec.NoOpEncDec = NoOpEncDec;
  var ageReaderWriter = {};
  var utils = {};
  Object.defineProperty(utils, "__esModule", { value: true });
  utils.sliceUntil = utils.chunked = utils.unpaddedBase64Buffer = utils.unpaddedBase64 = void 0;
  const buffer_1$5 = buffer;
  function unpaddedBase64(buf) {
    const encodedBuf = buffer_1$5.Buffer.from(buf).toString("base64");
    let lastIndex = encodedBuf.length - 1;
    while (encodedBuf[lastIndex] === "=") {
      lastIndex--;
    }
    return encodedBuf.slice(0, lastIndex + 1);
  }
  utils.unpaddedBase64 = unpaddedBase64;
  function unpaddedBase64Buffer(buf) {
    return buffer_1$5.Buffer.from(unpaddedBase64(buf), "base64");
  }
  utils.unpaddedBase64Buffer = unpaddedBase64Buffer;
  function chunked(input, chunkSize, suffix = "") {
    const output2 = [];
    let currentChunk = "";
    for (let i = 0, chunks = 0; i < input.length; i++) {
      currentChunk += input[i];
      const posInChunk = i - chunks * chunkSize;
      if (posInChunk === chunkSize - 1) {
        output2.push(currentChunk + suffix);
        currentChunk = "";
        chunks++;
      } else if (i === input.length - 1) {
        output2.push(currentChunk + suffix);
      }
    }
    return output2;
  }
  utils.chunked = chunked;
  function sliceUntil(input, searchTerm) {
    let lettersMatched = 0;
    let inputPointer = 0;
    while (inputPointer < input.length && lettersMatched < searchTerm.length) {
      if (input[inputPointer] === searchTerm[lettersMatched]) {
        ++lettersMatched;
      } else if (input[inputPointer] === searchTerm[0]) {
        lettersMatched = 1;
      } else {
        lettersMatched = 0;
      }
      ++inputPointer;
    }
    return input.slice(0, inputPointer);
  }
  utils.sliceUntil = sliceUntil;
  function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var utilsCrypto = {};
  Object.defineProperty(utilsCrypto, "__esModule", { value: true });
  utilsCrypto.random = utilsCrypto.createMacKey = void 0;
  const hkdf_1$1 = hkdf$1;
  const sha256_1$1 = sha256;
  const hmac_1 = hmac;
  const buffer_1$4 = buffer;
  function createMacKey(fileKey, macMessage, headerText) {
    const hmacKey = (0, hkdf_1$1.hkdf)(sha256_1$1.sha256, fileKey, "", buffer_1$4.Buffer.from(macMessage, "utf8"), 32);
    return buffer_1$4.Buffer.from((0, hmac_1.hmac)(sha256_1$1.sha256, hmacKey, buffer_1$4.Buffer.from(headerText, "utf8")));
  }
  utilsCrypto.createMacKey = createMacKey;
  async function random(n) {
    if (typeof window === "object" && "crypto" in window) {
      return window.crypto.getRandomValues(new Uint8Array(n));
    }
    const x = "crypto";
    const bytes2 = commonjsRequire(x).randomBytes(n);
    return new Uint8Array(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
  }
  utilsCrypto.random = random;
  Object.defineProperty(ageReaderWriter, "__esModule", { value: true });
  ageReaderWriter.readAge = ageReaderWriter.header = ageReaderWriter.writeAge = void 0;
  const buffer_1$3 = buffer;
  const utils_1$2 = utils;
  const utils_crypto_1$1 = utilsCrypto;
  function writeAge(input) {
    const headerStr = header$1(input);
    const macKey = mac((0, utils_crypto_1$1.createMacKey)(input.fileKey, input.headerMacMessage, headerStr));
    const payload = buffer_1$3.Buffer.from(input.body).toString("binary");
    return `${headerStr} ${macKey}
${payload}`;
  }
  ageReaderWriter.writeAge = writeAge;
  function header$1(input) {
    return `${input.version}
${recipients(input.recipients)}---`;
  }
  ageReaderWriter.header = header$1;
  const recipients = (stanzas) => stanzas.map((it2) => recipient(it2) + "\n");
  const recipient = (stanza) => {
    const type = stanza.type;
    const aggregatedArgs = stanza.args.join(" ");
    const encodedBody = (0, utils_1$2.unpaddedBase64)(stanza.body);
    const chunkedEncodedBody = (0, utils_1$2.chunked)(encodedBody, 64).join("\n");
    return `-> ${type} ${aggregatedArgs}
` + chunkedEncodedBody;
  };
  const mac = (macStr) => (0, utils_1$2.unpaddedBase64)(macStr);
  function readAge(input) {
    const [version2, ...lines] = input.split("\n");
    const recipients2 = parseRecipients(lines);
    const macStartingTag = "--- ";
    const macLine = lines.shift();
    if (!macLine || !macLine.startsWith(macStartingTag)) {
      throw Error("Expected mac, but there were no more lines left!");
    }
    const mac2 = buffer_1$3.Buffer.from(macLine.slice(macStartingTag.length, macLine.length), "base64");
    const ciphertext = buffer_1$3.Buffer.from(lines.join("\n") ?? "", "binary");
    return {
      header: { version: version2, recipients: recipients2, mac: mac2 },
      body: ciphertext
    };
  }
  ageReaderWriter.readAge = readAge;
  function validateArguments(args) {
    args.forEach((arg) => {
      for (let i = 0; i < arg.length; i++) {
        const charCode = arg.charCodeAt(i);
        if (charCode < 33 || charCode > 126) {
          throw Error(`Invalid character ${arg[i]} in argument ${arg}`);
        }
      }
    });
  }
  function parseRecipients(lines) {
    const recipients2 = [];
    for (let current = peek(lines); current != null && current.startsWith("->"); current = peek(lines)) {
      const [type, ...args] = current.slice(3, current.length).split(" ");
      lines.shift();
      validateArguments(args);
      const body = parseRecipientBody(lines);
      if (!body) {
        throw Error(`expected stanza '${type} to have a body, but it didn't`);
      }
      recipients2.push({ type, args, body: buffer_1$3.Buffer.from(body, "base64") });
    }
    if (recipients2.length === 0) {
      throw Error("Expected at least one stanza! (beginning with -->)");
    }
    return recipients2;
  }
  function parseRecipientBody(lines) {
    let body = "";
    for (let next = peek(lines); next != null; next = peek(lines)) {
      body += lines.shift();
      if (next.length < 64) {
        break;
      }
    }
    return body;
  }
  function peek(arr) {
    return arr[0];
  }
  Object.defineProperty(ageEncryptDecrypt, "__esModule", { value: true });
  ageEncryptDecrypt.decryptAge = ageEncryptDecrypt.encryptAge = void 0;
  const hkdf_1 = hkdf$1;
  const sha256_1 = sha256;
  const stream_cipher_1 = streamCipher;
  const no_op_encdec_1 = noOpEncdec;
  const age_reader_writer_1 = ageReaderWriter;
  const utils_1$1 = utils;
  const utils_crypto_1 = utilsCrypto;
  const buffer_1$2 = buffer;
  const ageVersion = "age-encryption.org/v1";
  const headerMacMessage = "header";
  const hkdfBodyMessage = "payload";
  const fileKeyLengthBytes = 16;
  const bodyHkdfNonceLengthBytes = 16;
  const hkdfKeyLengthBytes = 32;
  async function encryptAge(plaintext, wrapFileKey = no_op_encdec_1.NoOpEncDec.wrap) {
    const fileKey = await (0, utils_crypto_1.random)(fileKeyLengthBytes);
    const recipients2 = await wrapFileKey(fileKey);
    const body = await encryptedPayload(fileKey, plaintext);
    return (0, age_reader_writer_1.writeAge)({
      fileKey,
      version: ageVersion,
      recipients: recipients2,
      headerMacMessage,
      body
    });
  }
  ageEncryptDecrypt.encryptAge = encryptAge;
  async function encryptedPayload(fileKey, payload) {
    const nonce = await (0, utils_crypto_1.random)(bodyHkdfNonceLengthBytes);
    const hkdfKey = (0, hkdf_1.hkdf)(sha256_1.sha256, fileKey, nonce, buffer_1$2.Buffer.from(hkdfBodyMessage, "utf8"), hkdfKeyLengthBytes);
    const ciphertext = stream_cipher_1.STREAM.seal(payload, hkdfKey);
    return buffer_1$2.Buffer.concat([nonce, ciphertext]);
  }
  async function decryptAge(payload, unwrapFileKey = no_op_encdec_1.NoOpEncDec.unwrap) {
    const encryptedPayload2 = (0, age_reader_writer_1.readAge)(payload);
    const version2 = encryptedPayload2.header.version;
    if (version2 !== ageVersion) {
      throw Error(`The payload version ${version2} is not supported, only ${ageVersion}`);
    }
    const fileKey = await unwrapFileKey(encryptedPayload2.header.recipients);
    const header2 = (0, utils_1$1.sliceUntil)(payload, "---");
    const expectedMac = (0, utils_1$1.unpaddedBase64Buffer)((0, utils_crypto_1.createMacKey)(fileKey, headerMacMessage, header2));
    const actualMac = encryptedPayload2.header.mac;
    if (buffer_1$2.Buffer.compare(actualMac, expectedMac) !== 0) {
      throw Error("The MAC did not validate for the fileKey and payload!");
    }
    const nonce = buffer_1$2.Buffer.from(encryptedPayload2.body.slice(0, bodyHkdfNonceLengthBytes));
    const cipherText = encryptedPayload2.body.slice(bodyHkdfNonceLengthBytes);
    const hkdfKey = (0, hkdf_1.hkdf)(sha256_1.sha256, fileKey, nonce, buffer_1$2.Buffer.from(hkdfBodyMessage, "utf8"), hkdfKeyLengthBytes);
    const plaintext = stream_cipher_1.STREAM.open(cipherText, hkdfKey);
    return buffer_1$2.Buffer.from(plaintext);
  }
  ageEncryptDecrypt.decryptAge = decryptAge;
  var armor = {};
  Object.defineProperty(armor, "__esModule", { value: true });
  armor.isProbablyArmored = armor.decodeArmor = armor.encodeArmor = void 0;
  const buffer_1$1 = buffer;
  const utils_1 = utils;
  const header = "-----BEGIN AGE ENCRYPTED FILE-----";
  const footer = "-----END AGE ENCRYPTED FILE-----";
  function encodeArmor(input, chunkSize = 64) {
    const base64Input = buffer_1$1.Buffer.from(input, "binary").toString("base64");
    const columnisedInput = (0, utils_1.chunked)(base64Input, chunkSize).join("\n");
    let paddedFooter = footer;
    if (columnisedInput.length > 0 && columnisedInput[columnisedInput.length - 1].length === 64) {
      paddedFooter = "\n" + footer;
    }
    return `${header}
${columnisedInput}
${paddedFooter}
`;
  }
  armor.encodeArmor = encodeArmor;
  function decodeArmor(armor2, chunkSize = 64) {
    armor2 = armor2.trimStart();
    const lengthBeforeEndTrim = armor2.length;
    armor2 = armor2.trimEnd();
    const lengthAfterTrim = armor2.length;
    const trimmedWhitespace = lengthBeforeEndTrim - lengthAfterTrim;
    if (trimmedWhitespace > 1024) {
      throw Error("too much whitespace at the end of the armor payload");
    }
    if (!armor2.startsWith(header)) {
      throw Error(`Armor cannot be decoded if it does not start with a header! i.e. ${header}`);
    }
    if (!armor2.endsWith(footer)) {
      throw Error(`Armor cannot be decoded if it does not end with a footer! i.e. ${footer}`);
    }
    const base64Payload = armor2.slice(header.length, armor2.length - footer.length);
    const lines = base64Payload.split("\n");
    if (lines.some((line) => line.length > chunkSize)) {
      throw Error(`Armor to decode cannot have lines longer than ${chunkSize} (configurable) in order to stop padding attacks`);
    }
    if (lines[lines.length - 1].length >= chunkSize) {
      throw Error(`The last line of an armored payload must be less than ${chunkSize} (configurable) to stop padding attacks`);
    }
    return buffer_1$1.Buffer.from(base64Payload, "base64").toString("binary");
  }
  armor.decodeArmor = decodeArmor;
  function isProbablyArmored(input) {
    return input.startsWith(header);
  }
  armor.isProbablyArmored = isProbablyArmored;
  var timelockDecrypter = {};
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod2) {
    if (mod2 && mod2.__esModule) return mod2;
    var result = {};
    if (mod2 != null) {
      for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
    }
    __setModuleDefault(result, mod2);
    return result;
  };
  Object.defineProperty(timelockDecrypter, "__esModule", { value: true });
  timelockDecrypter.createTimelockDecrypter = void 0;
  const buffer_1 = buffer;
  const drand_client_1 = requireDrandClient();
  const ibe = __importStar(ibe$2);
  const bls12_381_1 = bls12381;
  function createTimelockDecrypter(network) {
    return async (recipients2) => {
      const tlockStanza = recipients2.find((it2) => it2.type === "tlock");
      if (!tlockStanza) {
        throw Error("You must pass a timelock stanza!");
      }
      const { type, args, body } = tlockStanza;
      if (type !== "tlock") {
        throw Error(`Timelock expects the type of the stanza to be "tlock`);
      }
      if (args.length !== 2) {
        throw Error(`Timelock stanza expected 2 args: roundNumber and chainHash. Only received ${args.length}`);
      }
      const chainInfo = await network.chain().info();
      const roundNumber = parseRoundNumber(args);
      if ((0, drand_client_1.roundTime)(chainInfo, roundNumber) > Date.now()) {
        throw Error(`It's too early to decrypt the ciphertext - decryptable at round ${roundNumber}`);
      }
      const beacon = await (0, drand_client_1.fetchBeacon)(network, roundNumber);
      console.log(`beacon received: ${JSON.stringify(beacon)}`);
      switch (chainInfo.schemeID) {
        case "pedersen-bls-unchained": {
          const ciphertext = parseCiphertext(body, bls12_381_1.bls12_381.G1.ProjectivePoint.BASE);
          return await ibe.decryptOnG1(buffer_1.Buffer.from(beacon.signature, "hex"), ciphertext);
        }
        case "bls-unchained-on-g1": {
          const ciphertext = parseCiphertext(body, bls12_381_1.bls12_381.G2.ProjectivePoint.BASE);
          return await ibe.decryptOnG2(buffer_1.Buffer.from(beacon.signature, "hex"), ciphertext);
        }
        case "bls-unchained-g1-rfc9380": {
          const ciphertext = parseCiphertext(body, bls12_381_1.bls12_381.G2.ProjectivePoint.BASE);
          return await ibe.decryptOnG2(buffer_1.Buffer.from(beacon.signature, "hex"), ciphertext);
        }
        default:
          throw Error(`Unsupported scheme: ${chainInfo.schemeID} - you must use a drand network with an unchained scheme for timelock decryption!`);
      }
    };
    function parseRoundNumber(args) {
      const [roundNumber] = args;
      const roundNumberParsed = Number.parseInt(roundNumber);
      if (roundNumberParsed !== roundNumberParsed) {
        throw Error(`Expected the roundNumber arg to be a number, but it was ${roundNumber}!`);
      }
      return roundNumberParsed;
    }
    function parseCiphertext(body, base) {
      const pointLength = base.toRawBytes(true).byteLength;
      const pointBytes = body.subarray(0, pointLength);
      const theRest = body.subarray(pointLength);
      const eachHalf = theRest.length / 2;
      const U = pointBytes;
      const V = theRest.subarray(0, eachHalf);
      const W2 = theRest.subarray(eachHalf);
      return { U, V, W: W2 };
    }
  }
  timelockDecrypter.createTimelockDecrypter = createTimelockDecrypter;
  var defaults = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TESTNET_CHAIN_INFO = exports.TESTNET_CHAIN_URL = exports.defaultChainInfo = exports.defaultChainUrl = exports.MAINNET_CHAIN_INFO_NON_RFC = exports.MAINNET_CHAIN_URL_NON_RFC = exports.MAINNET_CHAIN_INFO = exports.MAINNET_CHAIN_URL = void 0;
    exports.MAINNET_CHAIN_URL = "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971";
    exports.MAINNET_CHAIN_INFO = {
      public_key: "83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a",
      period: 3,
      genesis_time: 1692803367,
      hash: "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
      groupHash: "f477d5c89f21a17c863a7f937c6a6d15859414d2be09cd448d4279af331c5d3e",
      schemeID: "bls-unchained-g1-rfc9380",
      metadata: {
        beaconID: "quicknet"
      }
    };
    exports.MAINNET_CHAIN_URL_NON_RFC = "https://api.drand.sh/dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493";
    exports.MAINNET_CHAIN_INFO_NON_RFC = {
      hash: "dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493",
      public_key: "a0b862a7527fee3a731bcb59280ab6abd62d5c0b6ea03dc4ddf6612fdfc9d01f01c31542541771903475eb1ec6615f8d0df0b8b6dce385811d6dcf8cbefb8759e5e616a3dfd054c928940766d9a5b9db91e3b697e5d70a975181e007f87fca5e",
      period: 3,
      genesis_time: 1677685200,
      groupHash: "a81e9d63f614ccdb144b8ff79fbd4d5a2d22055c0bfe4ee9a8092003dab1c6c0",
      schemeID: "bls-unchained-on-g1",
      metadata: {
        beaconID: "fastnet"
      }
    };
    exports.defaultChainUrl = exports.MAINNET_CHAIN_URL;
    exports.defaultChainInfo = exports.MAINNET_CHAIN_INFO;
    exports.TESTNET_CHAIN_URL = "https://pl-us.testnet.drand.sh/7672797f548f3f4748ac4bf3352fc6c6b6468c9ad40ad456a397545c6e2df5bf";
    exports.TESTNET_CHAIN_INFO = {
      hash: "7672797f548f3f4748ac4bf3352fc6c6b6468c9ad40ad456a397545c6e2df5bf",
      public_key: "8200fc249deb0148eb918d6e213980c5d01acd7fc251900d9260136da3b54836ce125172399ddc69c4e3e11429b62c11",
      genesis_time: 1651677099,
      period: 3,
      schemeID: "pedersen-bls-unchained",
      groupHash: "65083634d852ae169e21b6ce5f0410be9ed4cc679b9970236f7875cff667e13d",
      metadata: {
        beaconID: "testnet-unchained-3s"
      }
    };
  })(defaults);
  var version = {};
  Object.defineProperty(version, "__esModule", { value: true });
  version.LIB_VERSION = void 0;
  version.LIB_VERSION = "0.9.0";
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buffer = exports.roundAt = exports.roundTime = exports.defaultChainUrl = exports.defaultChainInfo = exports.HttpCachingChain = exports.HttpChainClient = exports.nonRFCMainnetClient = exports.mainnetClient = exports.testnetClient = exports.timelockDecrypt = exports.timelockEncrypt = void 0;
    const drand_client_12 = requireDrandClient();
    Object.defineProperty(exports, "HttpChainClient", { enumerable: true, get: function() {
      return drand_client_12.HttpChainClient;
    } });
    Object.defineProperty(exports, "HttpCachingChain", { enumerable: true, get: function() {
      return drand_client_12.HttpCachingChain;
    } });
    Object.defineProperty(exports, "roundTime", { enumerable: true, get: function() {
      return drand_client_12.roundTime;
    } });
    Object.defineProperty(exports, "roundAt", { enumerable: true, get: function() {
      return drand_client_12.roundAt;
    } });
    const buffer_12 = buffer;
    Object.defineProperty(exports, "Buffer", { enumerable: true, get: function() {
      return buffer_12.Buffer;
    } });
    const timelock_encrypter_1 = timelockEncrypter;
    const age_encrypt_decrypt_1 = ageEncryptDecrypt;
    const armor_1 = armor;
    const timelock_decrypter_1 = timelockDecrypter;
    const defaults_1 = defaults;
    Object.defineProperty(exports, "defaultChainInfo", { enumerable: true, get: function() {
      return defaults_1.defaultChainInfo;
    } });
    Object.defineProperty(exports, "defaultChainUrl", { enumerable: true, get: function() {
      return defaults_1.defaultChainUrl;
    } });
    const version_1 = version;
    async function timelockEncrypt(roundNumber, payload, chainClient) {
      const timelockEncrypter2 = (0, timelock_encrypter_1.createTimelockEncrypter)(chainClient, roundNumber);
      const agePayload = await (0, age_encrypt_decrypt_1.encryptAge)(payload, timelockEncrypter2);
      return (0, armor_1.encodeArmor)(agePayload);
    }
    exports.timelockEncrypt = timelockEncrypt;
    async function timelockDecrypt(ciphertext, chainClient) {
      const timelockDecrypter2 = (0, timelock_decrypter_1.createTimelockDecrypter)(chainClient);
      let cipher = ciphertext;
      if ((0, armor_1.isProbablyArmored)(ciphertext)) {
        cipher = (0, armor_1.decodeArmor)(cipher);
      }
      return await (0, age_encrypt_decrypt_1.decryptAge)(cipher, timelockDecrypter2);
    }
    exports.timelockDecrypt = timelockDecrypt;
    const userAgentOpts = {
      userAgent: `tlock-js-${version_1.LIB_VERSION}`
    };
    function testnetClient() {
      const opts = {
        ...drand_client_12.defaultChainOptions,
        chainVerificationParams: {
          chainHash: defaults_1.TESTNET_CHAIN_INFO.hash,
          publicKey: defaults_1.TESTNET_CHAIN_INFO.public_key
        }
      };
      const chain = new drand_client_12.HttpCachingChain(defaults_1.TESTNET_CHAIN_URL, opts);
      return new drand_client_12.HttpChainClient(chain, opts, userAgentOpts);
    }
    exports.testnetClient = testnetClient;
    function mainnetClient() {
      const opts = {
        ...drand_client_12.defaultChainOptions,
        chainVerificationParams: {
          chainHash: "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
          publicKey: "83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a"
        }
      };
      const chain = new drand_client_12.HttpCachingChain(defaults_1.MAINNET_CHAIN_URL, opts);
      return new drand_client_12.HttpChainClient(chain, opts, userAgentOpts);
    }
    exports.mainnetClient = mainnetClient;
    function nonRFCMainnetClient() {
      const opts = {
        ...drand_client_12.defaultChainOptions,
        chainVerificationParams: {
          chainHash: "dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493",
          publicKey: "a0b862a7527fee3a731bcb59280ab6abd62d5c0b6ea03dc4ddf6612fdfc9d01f01c31542541771903475eb1ec6615f8d0df0b8b6dce385811d6dcf8cbefb8759e5e616a3dfd054c928940766d9a5b9db91e3b697e5d70a975181e007f87fca5e"
        }
      };
      const chain = new drand_client_12.HttpCachingChain(defaults_1.MAINNET_CHAIN_URL_NON_RFC, opts);
      return new drand_client_12.HttpChainClient(chain, opts, userAgentOpts);
    }
    exports.nonRFCMainnetClient = nonRFCMainnetClient;
  })(tlockJs);
  const client = tlockJs.mainnetClient();
  async function encrypt(message2, targetTime) {
    const chainInfo = await client.chain().info();
    const roundId = tlockJs.roundAt(targetTime, chainInfo);
    const ciphertext = await tlockJs.timelockEncrypt(roundId, Buffer.from(message2), client);
    return btoa(ciphertext);
  }
  async function decrypt(ciphertext) {
    try {
      const message2 = await tlockJs.timelockDecrypt(atob(ciphertext), client);
      return message2.toString();
    } catch (e) {
      const chainInfo = await client.chain().info();
      return localisedDecryptionMessageOrDefault(e, chainInfo);
    }
  }
  function errorMessage(err) {
    if (err instanceof Error) {
      return err.message;
    }
    if (typeof err === "string") {
      return err;
    }
    return "Unknown error";
  }
  function localisedDecryptionMessageOrDefault(err, chainInfo) {
    const message2 = errorMessage(err);
    const tooEarlyToDecryptErrorMessage = "It's too early to decrypt the ciphertext - decryptable at round ";
    if (!message2.startsWith(tooEarlyToDecryptErrorMessage)) {
      throw new Error("There was an error during decryption! Is your ciphertext valid?");
    }
    const roundNumber = Number.parseInt(message2.split(tooEarlyToDecryptErrorMessage)[1]);
    const timeToDecryption = new Date(tlockJs.roundTime(chainInfo, roundNumber));
    return timeToDecryption;
  }
  const millisecondsInWeek = 6048e5;
  const millisecondsInDay = 864e5;
  const millisecondsInMinute = 6e4;
  const millisecondsInHour = 36e5;
  const millisecondsInSecond = 1e3;
  const constructFromSymbol = Symbol.for("constructDateFrom");
  function constructFrom(date, value) {
    if (typeof date === "function") return date(value);
    if (date && typeof date === "object" && constructFromSymbol in date)
      return date[constructFromSymbol](value);
    if (date instanceof Date) return new date.constructor(value);
    return new Date(value);
  }
  function toDate(argument, context) {
    return constructFrom(context || argument, argument);
  }
  function addDays(date, amount, options) {
    const _date = toDate(date, options == null ? void 0 : options.in);
    if (isNaN(amount)) return constructFrom((options == null ? void 0 : options.in) || date, NaN);
    if (!amount) return _date;
    _date.setDate(_date.getDate() + amount);
    return _date;
  }
  function addMonths(date, amount, options) {
    const _date = toDate(date, void 0 );
    if (isNaN(amount)) return constructFrom(date, NaN);
    if (!amount) {
      return _date;
    }
    const dayOfMonth = _date.getDate();
    const endOfDesiredMonth = constructFrom(date, _date.getTime());
    endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
    const daysInMonth = endOfDesiredMonth.getDate();
    if (dayOfMonth >= daysInMonth) {
      return endOfDesiredMonth;
    } else {
      _date.setFullYear(
        endOfDesiredMonth.getFullYear(),
        endOfDesiredMonth.getMonth(),
        dayOfMonth
      );
      return _date;
    }
  }
  function add(date, duration, options) {
    const {
      years = 0,
      months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0
    } = duration;
    const _date = toDate(date, void 0 );
    const dateWithMonths = months || years ? addMonths(_date, months + years * 12) : _date;
    const dateWithDays = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths;
    const minutesToAdd = minutes + hours * 60;
    const secondsToAdd = seconds + minutesToAdd * 60;
    const msToAdd = secondsToAdd * 1e3;
    return constructFrom(date, +dateWithDays + msToAdd);
  }
  function addMilliseconds(date, amount, options) {
    return constructFrom(date, +toDate(date) + amount);
  }
  function addHours(date, amount, options) {
    return addMilliseconds(date, amount * millisecondsInHour);
  }
  let defaultOptions = {};
  function getDefaultOptions$1() {
    return defaultOptions;
  }
  function startOfWeek(date, options) {
    var _a2, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions$1();
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
    const _date = toDate(date, options == null ? void 0 : options.in);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    _date.setDate(_date.getDate() - diff);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function startOfISOWeek(date, options) {
    return startOfWeek(date, { ...options, weekStartsOn: 1 });
  }
  function getISOWeekYear(date, options) {
    const _date = toDate(date, void 0 );
    const year = _date.getFullYear();
    const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
    const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
    if (_date.getTime() >= startOfNextYear.getTime()) {
      return year + 1;
    } else if (_date.getTime() >= startOfThisYear.getTime()) {
      return year;
    } else {
      return year - 1;
    }
  }
  function getTimezoneOffsetInMilliseconds(date) {
    const _date = toDate(date);
    const utcDate = new Date(
      Date.UTC(
        _date.getFullYear(),
        _date.getMonth(),
        _date.getDate(),
        _date.getHours(),
        _date.getMinutes(),
        _date.getSeconds(),
        _date.getMilliseconds()
      )
    );
    utcDate.setUTCFullYear(_date.getFullYear());
    return +date - +utcDate;
  }
  function normalizeDates(context, ...dates) {
    const normalize = constructFrom.bind(
      null,
      dates.find((date) => typeof date === "object")
    );
    return dates.map(normalize);
  }
  function startOfDay(date, options) {
    const _date = toDate(date, void 0 );
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function differenceInCalendarDays(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      void 0 ,
      laterDate,
      earlierDate
    );
    const laterStartOfDay = startOfDay(laterDate_);
    const earlierStartOfDay = startOfDay(earlierDate_);
    const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
    const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
    return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
  }
  function startOfISOWeekYear(date, options) {
    const year = getISOWeekYear(date);
    const fourthOfJanuary = constructFrom(date, 0);
    fourthOfJanuary.setFullYear(year, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    return startOfISOWeek(fourthOfJanuary);
  }
  function addQuarters(date, amount, options) {
    return addMonths(date, amount * 3);
  }
  function addYears(date, amount, options) {
    return addMonths(date, amount * 12);
  }
  function compareAsc(dateLeft, dateRight) {
    const diff = +toDate(dateLeft) - +toDate(dateRight);
    if (diff < 0) return -1;
    else if (diff > 0) return 1;
    return diff;
  }
  function isDate(value) {
    return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
  }
  function isValid(date) {
    return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
  }
  function getQuarter(date, options) {
    const _date = toDate(date, void 0 );
    const quarter = Math.trunc(_date.getMonth() / 3) + 1;
    return quarter;
  }
  function differenceInCalendarYears(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      void 0 ,
      laterDate,
      earlierDate
    );
    return laterDate_.getFullYear() - earlierDate_.getFullYear();
  }
  function differenceInYears(laterDate, earlierDate, options) {
    const [laterDate_, earlierDate_] = normalizeDates(
      void 0 ,
      laterDate,
      earlierDate
    );
    const sign = compareAsc(laterDate_, earlierDate_);
    const diff = Math.abs(differenceInCalendarYears(laterDate_, earlierDate_));
    laterDate_.setFullYear(1584);
    earlierDate_.setFullYear(1584);
    const partial = compareAsc(laterDate_, earlierDate_) === -sign;
    const result = sign * (diff - +partial);
    return result === 0 ? 0 : result;
  }
  function normalizeInterval(context, interval) {
    const [start, end] = normalizeDates(context, interval.start, interval.end);
    return { start, end };
  }
  function eachDayOfInterval(interval, options) {
    const { start, end } = normalizeInterval(void 0 , interval);
    let reversed = +start > +end;
    const endTime = reversed ? +start : +end;
    const date = reversed ? end : start;
    date.setHours(0, 0, 0, 0);
    let step = 1;
    const dates = [];
    while (+date <= endTime) {
      dates.push(constructFrom(start, date));
      date.setDate(date.getDate() + step);
      date.setHours(0, 0, 0, 0);
    }
    return reversed ? dates.reverse() : dates;
  }
  function startOfQuarter(date, options) {
    const _date = toDate(date, void 0 );
    const currentMonth = _date.getMonth();
    const month = currentMonth - currentMonth % 3;
    _date.setMonth(month, 1);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function eachQuarterOfInterval(interval, options) {
    const { start, end } = normalizeInterval(void 0 , interval);
    let reversed = +start > +end;
    const endTime = reversed ? +startOfQuarter(start) : +startOfQuarter(end);
    let date = reversed ? startOfQuarter(end) : startOfQuarter(start);
    let step = 1;
    const dates = [];
    while (+date <= endTime) {
      dates.push(constructFrom(start, date));
      date = addQuarters(date, step);
    }
    return reversed ? dates.reverse() : dates;
  }
  function startOfMonth(date, options) {
    const _date = toDate(date, void 0 );
    _date.setDate(1);
    _date.setHours(0, 0, 0, 0);
    return _date;
  }
  function endOfYear(date, options) {
    const _date = toDate(date, void 0 );
    const year = _date.getFullYear();
    _date.setFullYear(year + 1, 0, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  function startOfYear(date, options) {
    const date_ = toDate(date, void 0 );
    date_.setFullYear(date_.getFullYear(), 0, 1);
    date_.setHours(0, 0, 0, 0);
    return date_;
  }
  function endOfWeek(date, options) {
    var _a2, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions$1();
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
    const _date = toDate(date, options == null ? void 0 : options.in);
    const day = _date.getDay();
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
    _date.setDate(_date.getDate() + diff);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  function endOfQuarter(date, options) {
    const _date = toDate(date, void 0 );
    const currentMonth = _date.getMonth();
    const month = currentMonth - currentMonth % 3 + 3;
    _date.setMonth(month, 0);
    _date.setHours(23, 59, 59, 999);
    return _date;
  }
  const formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
  const formatDistance = (token, count, options) => {
    let result;
    const tokenValue = formatDistanceLocale[token];
    if (typeof tokenValue === "string") {
      result = tokenValue;
    } else if (count === 1) {
      result = tokenValue.one;
    } else {
      result = tokenValue.other.replace("{{count}}", count.toString());
    }
    if (options == null ? void 0 : options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }
    return result;
  };
  function buildFormatLongFn(args) {
    return (options = {}) => {
      const width = options.width ? String(options.width) : args.defaultWidth;
      const format2 = args.formats[width] || args.formats[args.defaultWidth];
      return format2;
    };
  }
  const dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  const timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  const dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  const formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
  const formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
  const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
  function buildLocalizeFn(args) {
    return (value, options) => {
      const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
      let valuesArray;
      if (context === "formatting" && args.formattingValues) {
        const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
        const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
        valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
      } else {
        const defaultWidth = args.defaultWidth;
        const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
        valuesArray = args.values[width] || args.values[defaultWidth];
      }
      const index = args.argumentCallback ? args.argumentCallback(value) : value;
      return valuesArray[index];
    };
  }
  const eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  };
  const quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  };
  const monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  };
  const dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  };
  const dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  const formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  const ordinalNumber = (dirtyNumber, _options) => {
    const number2 = Number(dirtyNumber);
    const rem100 = number2 % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number2 + "st";
        case 2:
          return number2 + "nd";
        case 3:
          return number2 + "rd";
      }
    }
    return number2 + "th";
  };
  const localize = {
    ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: (quarter) => quarter - 1
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
  function buildMatchFn(args) {
    return (string, options = {}) => {
      const width = options.width;
      const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      const matchResult = string.match(matchPattern);
      if (!matchResult) {
        return null;
      }
      const matchedString = matchResult[0];
      const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
      const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
        // [TODO] -- I challenge you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString))
      );
      let value;
      value = args.valueCallback ? args.valueCallback(key) : key;
      value = options.valueCallback ? (
        // [TODO] -- I challenge you to fix the type
        options.valueCallback(value)
      ) : value;
      const rest = string.slice(matchedString.length);
      return { value, rest };
    };
  }
  function findKey(object, predicate) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
        return key;
      }
    }
    return void 0;
  }
  function findIndex(array, predicate) {
    for (let key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key;
      }
    }
    return void 0;
  }
  function buildMatchPatternFn(args) {
    return (string, options = {}) => {
      const matchResult = string.match(args.matchPattern);
      if (!matchResult) return null;
      const matchedString = matchResult[0];
      const parseResult = string.match(args.parsePattern);
      if (!parseResult) return null;
      let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      const rest = string.slice(matchedString.length);
      return { value, rest };
    };
  }
  const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  const parseOrdinalNumberPattern = /\d+/i;
  const matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  const parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  const matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  const parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  const matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  const parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ]
  };
  const matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  const parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  const matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  const parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  const match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (value) => parseInt(value, 10)
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: (index) => index + 1
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
  const enUS = {
    code: "en-US",
    formatDistance,
    formatLong,
    formatRelative,
    localize,
    match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
  function getDayOfYear(date, options) {
    const _date = toDate(date, void 0 );
    const diff = differenceInCalendarDays(_date, startOfYear(_date));
    const dayOfYear = diff + 1;
    return dayOfYear;
  }
  function getISOWeek(date, options) {
    const _date = toDate(date, void 0 );
    const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function getWeekYear(date, options) {
    var _a2, _b, _c, _d;
    const _date = toDate(date, options == null ? void 0 : options.in);
    const year = _date.getFullYear();
    const defaultOptions2 = getDefaultOptions$1();
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const firstWeekOfNextYear = constructFrom((options == null ? void 0 : options.in) || date, 0);
    firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setHours(0, 0, 0, 0);
    const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
    const firstWeekOfThisYear = constructFrom((options == null ? void 0 : options.in) || date, 0);
    firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setHours(0, 0, 0, 0);
    const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
    if (+_date >= +startOfNextYear) {
      return year + 1;
    } else if (+_date >= +startOfThisYear) {
      return year;
    } else {
      return year - 1;
    }
  }
  function startOfWeekYear(date, options) {
    var _a2, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions$1();
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const year = getWeekYear(date, options);
    const firstWeek = constructFrom((options == null ? void 0 : options.in) || date, 0);
    firstWeek.setFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setHours(0, 0, 0, 0);
    const _date = startOfWeek(firstWeek, options);
    return _date;
  }
  function getWeek(date, options) {
    const _date = toDate(date, options == null ? void 0 : options.in);
    const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
    return Math.round(diff / millisecondsInWeek) + 1;
  }
  function addLeadingZeros(number2, targetLength) {
    const sign = number2 < 0 ? "-" : "";
    const output2 = Math.abs(number2).toString().padStart(targetLength, "0");
    return sign + output2;
  }
  const lightFormatters = {
    // Year
    y(date, token) {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
    },
    // Month
    M(date, token) {
      const month = date.getMonth();
      return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    // Day of the month
    d(date, token) {
      return addLeadingZeros(date.getDate(), token.length);
    },
    // AM or PM
    a(date, token) {
      const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return dayPeriodEnumValue.toUpperCase();
        case "aaa":
          return dayPeriodEnumValue;
        case "aaaaa":
          return dayPeriodEnumValue[0];
        case "aaaa":
        default:
          return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
      }
    },
    // Hour [1-12]
    h(date, token) {
      return addLeadingZeros(date.getHours() % 12 || 12, token.length);
    },
    // Hour [0-23]
    H(date, token) {
      return addLeadingZeros(date.getHours(), token.length);
    },
    // Minute
    m(date, token) {
      return addLeadingZeros(date.getMinutes(), token.length);
    },
    // Second
    s(date, token) {
      return addLeadingZeros(date.getSeconds(), token.length);
    },
    // Fraction of second
    S(date, token) {
      const numberOfDigits = token.length;
      const milliseconds = date.getMilliseconds();
      const fractionalSeconds = Math.trunc(
        milliseconds * Math.pow(10, numberOfDigits - 3)
      );
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };
  const dayPeriodEnum = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  };
  const formatters = {
    // Era
    G: function(date, token, localize2) {
      const era = date.getFullYear() > 0 ? 1 : 0;
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return localize2.era(era, { width: "abbreviated" });
        case "GGGGG":
          return localize2.era(era, { width: "narrow" });
        case "GGGG":
        default:
          return localize2.era(era, { width: "wide" });
      }
    },
    // Year
    y: function(date, token, localize2) {
      if (token === "yo") {
        const signedYear = date.getFullYear();
        const year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize2.ordinalNumber(year, { unit: "year" });
      }
      return lightFormatters.y(date, token);
    },
    // Local week-numbering year
    Y: function(date, token, localize2, options) {
      const signedWeekYear = getWeekYear(date, options);
      const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
      if (token === "YY") {
        const twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }
      if (token === "Yo") {
        return localize2.ordinalNumber(weekYear, { unit: "year" });
      }
      return addLeadingZeros(weekYear, token.length);
    },
    // ISO week-numbering year
    R: function(date, token) {
      const isoWeekYear = getISOWeekYear(date);
      return addLeadingZeros(isoWeekYear, token.length);
    },
    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function(date, token) {
      const year = date.getFullYear();
      return addLeadingZeros(year, token.length);
    },
    // Quarter
    Q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "Q":
          return String(quarter);
        case "QQ":
          return addLeadingZeros(quarter, 2);
        case "Qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "QQQ":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Stand-alone quarter
    q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "q":
          return String(quarter);
        case "qq":
          return addLeadingZeros(quarter, 2);
        case "qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "qqq":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    // Month
    M: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "M":
        case "MM":
          return lightFormatters.M(date, token);
        case "Mo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "MMM":
          return localize2.month(month, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return localize2.month(month, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return localize2.month(month, { width: "wide", context: "formatting" });
      }
    },
    // Stand-alone month
    L: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "L":
          return String(month + 1);
        case "LL":
          return addLeadingZeros(month + 1, 2);
        case "Lo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "LLL":
          return localize2.month(month, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return localize2.month(month, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return localize2.month(month, { width: "wide", context: "standalone" });
      }
    },
    // Local week of year
    w: function(date, token, localize2, options) {
      const week = getWeek(date, options);
      if (token === "wo") {
        return localize2.ordinalNumber(week, { unit: "week" });
      }
      return addLeadingZeros(week, token.length);
    },
    // ISO week of year
    I: function(date, token, localize2) {
      const isoWeek = getISOWeek(date);
      if (token === "Io") {
        return localize2.ordinalNumber(isoWeek, { unit: "week" });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    // Day of the month
    d: function(date, token, localize2) {
      if (token === "do") {
        return localize2.ordinalNumber(date.getDate(), { unit: "date" });
      }
      return lightFormatters.d(date, token);
    },
    // Day of year
    D: function(date, token, localize2) {
      const dayOfYear = getDayOfYear(date);
      if (token === "Do") {
        return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    // Day of week
    E: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Local day of week
    e: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "e":
          return String(localDayOfWeek);
        case "ee":
          return addLeadingZeros(localDayOfWeek, 2);
        case "eo":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "eee":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Stand-alone local day of week
    c: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "c":
          return String(localDayOfWeek);
        case "cc":
          return addLeadingZeros(localDayOfWeek, token.length);
        case "co":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "ccc":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    // ISO day of week
    i: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        case "i":
          return String(isoDayOfWeek);
        case "ii":
          return addLeadingZeros(isoDayOfWeek, token.length);
        case "io":
          return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
        case "iii":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // AM or PM
    a: function(date, token, localize2) {
      const hours = date.getHours();
      const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // AM, PM, midnight, noon
    b: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      }
      switch (token) {
        case "b":
        case "bb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // in the morning, in the afternoon, in the evening, at night
    B: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    // Hour [1-12]
    h: function(date, token, localize2) {
      if (token === "ho") {
        let hours = date.getHours() % 12;
        if (hours === 0) hours = 12;
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return lightFormatters.h(date, token);
    },
    // Hour [0-23]
    H: function(date, token, localize2) {
      if (token === "Ho") {
        return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
      }
      return lightFormatters.H(date, token);
    },
    // Hour [0-11]
    K: function(date, token, localize2) {
      const hours = date.getHours() % 12;
      if (token === "Ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Hour [1-24]
    k: function(date, token, localize2) {
      let hours = date.getHours();
      if (hours === 0) hours = 24;
      if (token === "ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    // Minute
    m: function(date, token, localize2) {
      if (token === "mo") {
        return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
      }
      return lightFormatters.m(date, token);
    },
    // Second
    s: function(date, token, localize2) {
      if (token === "so") {
        return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
      }
      return lightFormatters.s(date, token);
    },
    // Fraction of second
    S: function(date, token) {
      return lightFormatters.S(date, token);
    },
    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return "Z";
      }
      switch (token) {
        case "X":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "XXXX":
        case "XX":
          return formatTimezone(timezoneOffset);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "x":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "xxxx":
        case "xx":
          return formatTimezone(timezoneOffset);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (GMT)
    O: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    // Timezone (specific non-location)
    z: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    // Seconds timestamp
    t: function(date, token, _localize) {
      const timestamp = Math.trunc(+date / 1e3);
      return addLeadingZeros(timestamp, token.length);
    },
    // Milliseconds timestamp
    T: function(date, token, _localize) {
      return addLeadingZeros(+date, token.length);
    }
  };
  function formatTimezoneShort(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = Math.trunc(absOffset / 60);
    const minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours);
    }
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
  }
  function formatTimezoneWithOptionalMinutes(offset, delimiter) {
    if (offset % 60 === 0) {
      const sign = offset > 0 ? "-" : "+";
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
    }
    return formatTimezone(offset, delimiter);
  }
  function formatTimezone(offset, delimiter = "") {
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
    const minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes;
  }
  const dateLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case "P":
        return formatLong2.date({ width: "short" });
      case "PP":
        return formatLong2.date({ width: "medium" });
      case "PPP":
        return formatLong2.date({ width: "long" });
      case "PPPP":
      default:
        return formatLong2.date({ width: "full" });
    }
  };
  const timeLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case "p":
        return formatLong2.time({ width: "short" });
      case "pp":
        return formatLong2.time({ width: "medium" });
      case "ppp":
        return formatLong2.time({ width: "long" });
      case "pppp":
      default:
        return formatLong2.time({ width: "full" });
    }
  };
  const dateTimeLongFormatter = (pattern, formatLong2) => {
    const matchResult = pattern.match(/(P+)(p+)?/) || [];
    const datePattern = matchResult[1];
    const timePattern = matchResult[2];
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong2);
    }
    let dateTimeFormat;
    switch (datePattern) {
      case "P":
        dateTimeFormat = formatLong2.dateTime({ width: "short" });
        break;
      case "PP":
        dateTimeFormat = formatLong2.dateTime({ width: "medium" });
        break;
      case "PPP":
        dateTimeFormat = formatLong2.dateTime({ width: "long" });
        break;
      case "PPPP":
      default:
        dateTimeFormat = formatLong2.dateTime({ width: "full" });
        break;
    }
    return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
  };
  const longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };
  const dayOfYearTokenRE = /^D+$/;
  const weekYearTokenRE = /^Y+$/;
  const throwTokens = ["D", "DD", "YY", "YYYY"];
  function isProtectedDayOfYearToken(token) {
    return dayOfYearTokenRE.test(token);
  }
  function isProtectedWeekYearToken(token) {
    return weekYearTokenRE.test(token);
  }
  function warnOrThrowProtectedError(token, format2, input) {
    const _message = message(token, format2, input);
    console.warn(_message);
    if (throwTokens.includes(token)) throw new RangeError(_message);
  }
  function message(token, format2, input) {
    const subject = token[0] === "Y" ? "years" : "days of the month";
    return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format2}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
  }
  const formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  const longFormattingTokensRegExp$1 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const escapedStringRegExp$1 = /^'([^]*?)'?$/;
  const doubleQuoteRegExp$1 = /''/g;
  const unescapedLatinCharacterRegExp$1 = /[a-zA-Z]/;
  function format(date, formatStr, options) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const defaultOptions2 = getDefaultOptions$1();
    const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_f = (_e2 = options == null ? void 0 : options.locale) == null ? void 0 : _e2.options) == null ? void 0 : _f.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_h = (_g = defaultOptions2.locale) == null ? void 0 : _g.options) == null ? void 0 : _h.weekStartsOn) ?? 0;
    const originalDate = toDate(date, options == null ? void 0 : options.in);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    let parts = formatStr.match(longFormattingTokensRegExp$1).map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter === "p" || firstCharacter === "P") {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp$1).map((substring) => {
      if (substring === "''") {
        return { isToken: false, value: "'" };
      }
      const firstCharacter = substring[0];
      if (firstCharacter === "'") {
        return { isToken: false, value: cleanEscapedString$1(substring) };
      }
      if (formatters[firstCharacter]) {
        return { isToken: true, value: substring };
      }
      if (firstCharacter.match(unescapedLatinCharacterRegExp$1)) {
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
        );
      }
      return { isToken: false, value: substring };
    });
    if (locale.localize.preprocessor) {
      parts = locale.localize.preprocessor(originalDate, parts);
    }
    const formatterOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale
    };
    return parts.map((part) => {
      if (!part.isToken) return part.value;
      const token = part.value;
      if (!(options == null ? void 0 : options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token) || !(options == null ? void 0 : options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, String(date));
      }
      const formatter = formatters[token[0]];
      return formatter(originalDate, token, locale.localize, formatterOptions);
    }).join("");
  }
  function cleanEscapedString$1(input) {
    const matched = input.match(escapedStringRegExp$1);
    if (!matched) {
      return input;
    }
    return matched[1].replace(doubleQuoteRegExp$1, "'");
  }
  function getDay(date, options) {
    return toDate(date, void 0 ).getDay();
  }
  function getDaysInMonth(date, options) {
    const _date = toDate(date, void 0 );
    const year = _date.getFullYear();
    const monthIndex = _date.getMonth();
    const lastDayOfMonth = constructFrom(_date, 0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }
  function getDefaultOptions() {
    return Object.assign({}, getDefaultOptions$1());
  }
  function getHours(date, options) {
    return toDate(date, options == null ? void 0 : options.in).getHours();
  }
  function getISODay(date, options) {
    const day = toDate(date, void 0 ).getDay();
    return day === 0 ? 7 : day;
  }
  function getMinutes(date, options) {
    return toDate(date, options == null ? void 0 : options.in).getMinutes();
  }
  function getMonth(date, options) {
    return toDate(date, void 0 ).getMonth();
  }
  function getSeconds(date) {
    return toDate(date).getSeconds();
  }
  function getYear(date, options) {
    return toDate(date, options == null ? void 0 : options.in).getFullYear();
  }
  function isAfter(date, dateToCompare) {
    return +toDate(date) > +toDate(dateToCompare);
  }
  function isBefore(date, dateToCompare) {
    return +toDate(date) < +toDate(dateToCompare);
  }
  function isEqual(leftDate, rightDate) {
    return +toDate(leftDate) === +toDate(rightDate);
  }
  function transpose(date, constructor) {
    const date_ = isConstructor(constructor) ? new constructor(0) : constructFrom(constructor, 0);
    date_.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    date_.setHours(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    return date_;
  }
  function isConstructor(constructor) {
    var _a2;
    return typeof constructor === "function" && ((_a2 = constructor.prototype) == null ? void 0 : _a2.constructor) === constructor;
  }
  const TIMEZONE_UNIT_PRIORITY = 10;
  class Setter {
    constructor() {
      __publicField(this, "subPriority", 0);
    }
    validate(_utcDate, _options) {
      return true;
    }
  }
  class ValueSetter extends Setter {
    constructor(value, validateValue, setValue, priority, subPriority) {
      super();
      this.value = value;
      this.validateValue = validateValue;
      this.setValue = setValue;
      this.priority = priority;
      if (subPriority) {
        this.subPriority = subPriority;
      }
    }
    validate(date, options) {
      return this.validateValue(date, this.value, options);
    }
    set(date, flags, options) {
      return this.setValue(date, flags, this.value, options);
    }
  }
  class DateTimezoneSetter extends Setter {
    constructor(context, reference) {
      super();
      __publicField(this, "priority", TIMEZONE_UNIT_PRIORITY);
      __publicField(this, "subPriority", -1);
      this.context = context || ((date) => constructFrom(reference, date));
    }
    set(date, flags) {
      if (flags.timestampIsSet) return date;
      return constructFrom(date, transpose(date, this.context));
    }
  }
  class Parser {
    run(dateString, token, match2, options) {
      const result = this.parse(dateString, token, match2, options);
      if (!result) {
        return null;
      }
      return {
        setter: new ValueSetter(
          result.value,
          this.validate,
          this.set,
          this.priority,
          this.subPriority
        ),
        rest: result.rest
      };
    }
    validate(_utcDate, _value, _options) {
      return true;
    }
  }
  class EraParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 140);
      __publicField(this, "incompatibleTokens", ["R", "u", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
        case "GGGGG":
          return match2.era(dateString, { width: "narrow" });
        case "GGGG":
        default:
          return match2.era(dateString, { width: "wide" }) || match2.era(dateString, { width: "abbreviated" }) || match2.era(dateString, { width: "narrow" });
      }
    }
    set(date, flags, value) {
      flags.era = value;
      date.setFullYear(value, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  const numericPatterns = {
    month: /^(1[0-2]|0?\d)/,
    // 0 to 12
    date: /^(3[0-1]|[0-2]?\d)/,
    // 0 to 31
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    // 0 to 366
    week: /^(5[0-3]|[0-4]?\d)/,
    // 0 to 53
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    // 0 to 23
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    // 0 to 24
    hour11h: /^(1[0-1]|0?\d)/,
    // 0 to 11
    hour12h: /^(1[0-2]|0?\d)/,
    // 0 to 12
    minute: /^[0-5]?\d/,
    // 0 to 59
    second: /^[0-5]?\d/,
    // 0 to 59
    singleDigit: /^\d/,
    // 0 to 9
    twoDigits: /^\d{1,2}/,
    // 0 to 99
    threeDigits: /^\d{1,3}/,
    // 0 to 999
    fourDigits: /^\d{1,4}/,
    // 0 to 9999
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    // 0 to 9, -0 to -9
    twoDigitsSigned: /^-?\d{1,2}/,
    // 0 to 99, -0 to -99
    threeDigitsSigned: /^-?\d{1,3}/,
    // 0 to 999, -0 to -999
    fourDigitsSigned: /^-?\d{1,4}/
    // 0 to 9999, -0 to -9999
  };
  const timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
  };
  function mapValue(parseFnResult, mapFn) {
    if (!parseFnResult) {
      return parseFnResult;
    }
    return {
      value: mapFn(parseFnResult.value),
      rest: parseFnResult.rest
    };
  }
  function parseNumericPattern(pattern, dateString) {
    const matchResult = dateString.match(pattern);
    if (!matchResult) {
      return null;
    }
    return {
      value: parseInt(matchResult[0], 10),
      rest: dateString.slice(matchResult[0].length)
    };
  }
  function parseTimezonePattern(pattern, dateString) {
    const matchResult = dateString.match(pattern);
    if (!matchResult) {
      return null;
    }
    if (matchResult[0] === "Z") {
      return {
        value: 0,
        rest: dateString.slice(1)
      };
    }
    const sign = matchResult[1] === "+" ? 1 : -1;
    const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
    const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
    const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
    return {
      value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
      rest: dateString.slice(matchResult[0].length)
    };
  }
  function parseAnyDigitsSigned(dateString) {
    return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
  }
  function parseNDigits(n, dateString) {
    switch (n) {
      case 1:
        return parseNumericPattern(numericPatterns.singleDigit, dateString);
      case 2:
        return parseNumericPattern(numericPatterns.twoDigits, dateString);
      case 3:
        return parseNumericPattern(numericPatterns.threeDigits, dateString);
      case 4:
        return parseNumericPattern(numericPatterns.fourDigits, dateString);
      default:
        return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
    }
  }
  function parseNDigitsSigned(n, dateString) {
    switch (n) {
      case 1:
        return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
      case 2:
        return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
      case 3:
        return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
      case 4:
        return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
      default:
        return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
    }
  }
  function dayPeriodEnumToHours(dayPeriod) {
    switch (dayPeriod) {
      case "morning":
        return 4;
      case "evening":
        return 17;
      case "pm":
      case "noon":
      case "afternoon":
        return 12;
      case "am":
      case "midnight":
      case "night":
      default:
        return 0;
    }
  }
  function normalizeTwoDigitYear(twoDigitYear, currentYear) {
    const isCommonEra = currentYear > 0;
    const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
    let result;
    if (absCurrentYear <= 50) {
      result = twoDigitYear || 100;
    } else {
      const rangeEnd = absCurrentYear + 50;
      const rangeEndCentury = Math.trunc(rangeEnd / 100) * 100;
      const isPreviousCentury = twoDigitYear >= rangeEnd % 100;
      result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
    }
    return isCommonEra ? result : 1 - result;
  }
  function isLeapYearIndex(year) {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
  }
  class YearParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 130);
      __publicField(this, "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
    }
    parse(dateString, token, match2) {
      const valueCallback = (year) => ({
        year,
        isTwoDigitYear: token === "yy"
      });
      switch (token) {
        case "y":
          return mapValue(parseNDigits(4, dateString), valueCallback);
        case "yo":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "year"
            }),
            valueCallback
          );
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback);
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
    set(date, flags, value) {
      const currentYear = date.getFullYear();
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(
          value.year,
          currentYear
        );
        date.setFullYear(normalizedTwoDigitYear, 0, 1);
        date.setHours(0, 0, 0, 0);
        return date;
      }
      const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setFullYear(year, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class LocalWeekYearParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 130);
      __publicField(this, "incompatibleTokens", [
        "y",
        "R",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      const valueCallback = (year) => ({
        year,
        isTwoDigitYear: token === "YY"
      });
      switch (token) {
        case "Y":
          return mapValue(parseNDigits(4, dateString), valueCallback);
        case "Yo":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "year"
            }),
            valueCallback
          );
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback);
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
    set(date, flags, value, options) {
      const currentYear = getWeekYear(date, options);
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(
          value.year,
          currentYear
        );
        date.setFullYear(
          normalizedTwoDigitYear,
          0,
          options.firstWeekContainsDate
        );
        date.setHours(0, 0, 0, 0);
        return startOfWeek(date, options);
      }
      const year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setFullYear(year, 0, options.firstWeekContainsDate);
      date.setHours(0, 0, 0, 0);
      return startOfWeek(date, options);
    }
  }
  class ISOWeekYearParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 130);
      __publicField(this, "incompatibleTokens", [
        "G",
        "y",
        "Y",
        "u",
        "Q",
        "q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token) {
      if (token === "R") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
    set(date, _flags, value) {
      const firstWeekOfYear = constructFrom(date, 0);
      firstWeekOfYear.setFullYear(value, 0, 4);
      firstWeekOfYear.setHours(0, 0, 0, 0);
      return startOfISOWeek(firstWeekOfYear);
    }
  }
  class ExtendedYearParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 130);
      __publicField(this, "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
    }
    parse(dateString, token) {
      if (token === "u") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
    set(date, _flags, value) {
      date.setFullYear(value, 0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class QuarterParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 120);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "Q":
        case "QQ":
          return parseNDigits(token.length, dateString);
        case "Qo":
          return match2.ordinalNumber(dateString, { unit: "quarter" });
        case "QQQ":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQQ":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4;
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class StandAloneQuarterParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 120);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "q":
        case "qq":
          return parseNDigits(token.length, dateString);
        case "qo":
          return match2.ordinalNumber(dateString, { unit: "quarter" });
        case "qqq":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqqq":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4;
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class MonthParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "q",
        "Q",
        "L",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
      __publicField(this, "priority", 110);
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => value - 1;
      switch (token) {
        case "M":
          return mapValue(
            parseNumericPattern(numericPatterns.month, dateString),
            valueCallback
          );
        case "MM":
          return mapValue(parseNDigits(2, dateString), valueCallback);
        case "Mo":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "month"
            }),
            valueCallback
          );
        case "MMM":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, { width: "narrow", context: "formatting" });
        case "MMMMM":
          return match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return match2.month(dateString, { width: "wide", context: "formatting" }) || match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, { width: "narrow", context: "formatting" });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      date.setMonth(value, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class StandAloneMonthParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 110);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => value - 1;
      switch (token) {
        case "L":
          return mapValue(
            parseNumericPattern(numericPatterns.month, dateString),
            valueCallback
          );
        case "LL":
          return mapValue(parseNDigits(2, dateString), valueCallback);
        case "Lo":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "month"
            }),
            valueCallback
          );
        case "LLL":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, { width: "narrow", context: "standalone" });
        case "LLLLL":
          return match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return match2.month(dateString, { width: "wide", context: "standalone" }) || match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, { width: "narrow", context: "standalone" });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      date.setMonth(value, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  function setWeek(date, week, options) {
    const date_ = toDate(date, options == null ? void 0 : options.in);
    const diff = getWeek(date_, options) - week;
    date_.setDate(date_.getDate() - diff * 7);
    return toDate(date_, options == null ? void 0 : options.in);
  }
  class LocalWeekParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 100);
      __publicField(this, "incompatibleTokens", [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "i",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "w":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "wo":
          return match2.ordinalNumber(dateString, { unit: "week" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53;
    }
    set(date, _flags, value, options) {
      return startOfWeek(setWeek(date, value, options), options);
    }
  }
  function setISOWeek(date, week, options) {
    const _date = toDate(date, void 0 );
    const diff = getISOWeek(_date) - week;
    _date.setDate(_date.getDate() - diff * 7);
    return _date;
  }
  class ISOWeekParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 100);
      __publicField(this, "incompatibleTokens", [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "I":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "Io":
          return match2.ordinalNumber(dateString, { unit: "week" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53;
    }
    set(date, _flags, value) {
      return startOfISOWeek(setISOWeek(date, value));
    }
  }
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_IN_MONTH_LEAP_YEAR = [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  class DateParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "subPriority", 1);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "q",
        "Q",
        "w",
        "I",
        "D",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "d":
          return parseNumericPattern(numericPatterns.date, dateString);
        case "do":
          return match2.ordinalNumber(dateString, { unit: "date" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(date, value) {
      const year = date.getFullYear();
      const isLeapYear = isLeapYearIndex(year);
      const month = date.getMonth();
      if (isLeapYear) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    }
    set(date, _flags, value) {
      date.setDate(value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class DayOfYearParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "subpriority", 1);
      __publicField(this, "incompatibleTokens", [
        "Y",
        "R",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "I",
        "d",
        "E",
        "i",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "D":
        case "DD":
          return parseNumericPattern(numericPatterns.dayOfYear, dateString);
        case "Do":
          return match2.ordinalNumber(dateString, { unit: "date" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(date, value) {
      const year = date.getFullYear();
      const isLeapYear = isLeapYearIndex(year);
      if (isLeapYear) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    }
    set(date, _flags, value) {
      date.setMonth(0, value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  function setDay(date, day, options) {
    var _a2, _b, _c, _d;
    const defaultOptions2 = getDefaultOptions$1();
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.weekStartsOn) ?? 0;
    const date_ = toDate(date, options == null ? void 0 : options.in);
    const currentDay = date_.getDay();
    const remainder = day % 7;
    const dayIndex = (remainder + 7) % 7;
    const delta = 7 - weekStartsOn;
    const diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
    return addDays(date_, diff, options);
  }
  class DayParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        case "EEEEE":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        case "EEEE":
        default:
          return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class LocalDayParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "incompatibleTokens", [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2, options) {
      const valueCallback = (value) => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "e":
        case "ee":
          return mapValue(parseNDigits(token.length, dateString), valueCallback);
        case "eo":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "day"
            }),
            valueCallback
          );
        case "eee":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        case "eeeee":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
        case "eeee":
        default:
          return match2.day(dateString, { width: "wide", context: "formatting" }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, { width: "short", context: "formatting" }) || match2.day(dateString, { width: "narrow", context: "formatting" });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class StandAloneLocalDayParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "incompatibleTokens", [
        "y",
        "R",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "I",
        "d",
        "D",
        "E",
        "i",
        "e",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2, options) {
      const valueCallback = (value) => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "c":
        case "cc":
          return mapValue(parseNDigits(token.length, dateString), valueCallback);
        case "co":
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: "day"
            }),
            valueCallback
          );
        case "ccc":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
        case "ccccc":
          return match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
        case "cccc":
        default:
          return match2.day(dateString, { width: "wide", context: "standalone" }) || match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, { width: "short", context: "standalone" }) || match2.day(dateString, { width: "narrow", context: "standalone" });
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6;
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  function setISODay(date, day, options) {
    const date_ = toDate(date, void 0 );
    const currentDay = getISODay(date_);
    const diff = day - currentDay;
    return addDays(date_, diff, options);
  }
  class ISODayParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 90);
      __publicField(this, "incompatibleTokens", [
        "y",
        "Y",
        "u",
        "q",
        "Q",
        "M",
        "L",
        "w",
        "d",
        "D",
        "E",
        "e",
        "c",
        "t",
        "T"
      ]);
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
        case "i":
        case "ii":
          return parseNDigits(token.length, dateString);
        case "io":
          return match2.ordinalNumber(dateString, { unit: "day" });
        case "iii":
          return mapValue(
            match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "short",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            }),
            valueCallback
          );
        case "iiiii":
          return mapValue(
            match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            }),
            valueCallback
          );
        case "iiiiii":
          return mapValue(
            match2.day(dateString, {
              width: "short",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            }),
            valueCallback
          );
        case "iiii":
        default:
          return mapValue(
            match2.day(dateString, {
              width: "wide",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "abbreviated",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "short",
              context: "formatting"
            }) || match2.day(dateString, {
              width: "narrow",
              context: "formatting"
            }),
            valueCallback
          );
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 7;
    }
    set(date, _flags, value) {
      date = setISODay(date, value);
      date.setHours(0, 0, 0, 0);
      return date;
    }
  }
  class AMPMParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 80);
      __publicField(this, "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "a":
        case "aa":
        case "aaa":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaaa":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }
  class AMPMMidnightParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 80);
      __publicField(this, "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "b":
        case "bb":
        case "bbb":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbbb":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }
  class DayPeriodParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 80);
      __publicField(this, "incompatibleTokens", ["a", "b", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBBB":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }
  class Hour1to12Parser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 70);
      __publicField(this, "incompatibleTokens", ["H", "K", "k", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "h":
          return parseNumericPattern(numericPatterns.hour12h, dateString);
        case "ho":
          return match2.ordinalNumber(dateString, { unit: "hour" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 12;
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12;
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setHours(0, 0, 0, 0);
      } else {
        date.setHours(value, 0, 0, 0);
      }
      return date;
    }
  }
  class Hour0to23Parser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 70);
      __publicField(this, "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "H":
          return parseNumericPattern(numericPatterns.hour23h, dateString);
        case "Ho":
          return match2.ordinalNumber(dateString, { unit: "hour" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 23;
    }
    set(date, _flags, value) {
      date.setHours(value, 0, 0, 0);
      return date;
    }
  }
  class Hour0To11Parser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 70);
      __publicField(this, "incompatibleTokens", ["h", "H", "k", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "K":
          return parseNumericPattern(numericPatterns.hour11h, dateString);
        case "Ko":
          return match2.ordinalNumber(dateString, { unit: "hour" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11;
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12;
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0);
      } else {
        date.setHours(value, 0, 0, 0);
      }
      return date;
    }
  }
  class Hour1To24Parser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 70);
      __publicField(this, "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "k":
          return parseNumericPattern(numericPatterns.hour24h, dateString);
        case "ko":
          return match2.ordinalNumber(dateString, { unit: "hour" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 24;
    }
    set(date, _flags, value) {
      const hours = value <= 24 ? value % 24 : value;
      date.setHours(hours, 0, 0, 0);
      return date;
    }
  }
  class MinuteParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 60);
      __publicField(this, "incompatibleTokens", ["t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "m":
          return parseNumericPattern(numericPatterns.minute, dateString);
        case "mo":
          return match2.ordinalNumber(dateString, { unit: "minute" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59;
    }
    set(date, _flags, value) {
      date.setMinutes(value, 0, 0);
      return date;
    }
  }
  class SecondParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 50);
      __publicField(this, "incompatibleTokens", ["t", "T"]);
    }
    parse(dateString, token, match2) {
      switch (token) {
        case "s":
          return parseNumericPattern(numericPatterns.second, dateString);
        case "so":
          return match2.ordinalNumber(dateString, { unit: "second" });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59;
    }
    set(date, _flags, value) {
      date.setSeconds(value, 0);
      return date;
    }
  }
  class FractionOfSecondParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 30);
      __publicField(this, "incompatibleTokens", ["t", "T"]);
    }
    parse(dateString, token) {
      const valueCallback = (value) => Math.trunc(value * Math.pow(10, -token.length + 3));
      return mapValue(parseNDigits(token.length, dateString), valueCallback);
    }
    set(date, _flags, value) {
      date.setMilliseconds(value);
      return date;
    }
  }
  class ISOTimezoneWithZParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 10);
      __publicField(this, "incompatibleTokens", ["t", "T", "x"]);
    }
    parse(dateString, token) {
      switch (token) {
        case "X":
          return parseTimezonePattern(
            timezonePatterns.basicOptionalMinutes,
            dateString
          );
        case "XX":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "XXXX":
          return parseTimezonePattern(
            timezonePatterns.basicOptionalSeconds,
            dateString
          );
        case "XXXXX":
          return parseTimezonePattern(
            timezonePatterns.extendedOptionalSeconds,
            dateString
          );
        case "XXX":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date;
      return constructFrom(
        date,
        date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
      );
    }
  }
  class ISOTimezoneParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 10);
      __publicField(this, "incompatibleTokens", ["t", "T", "X"]);
    }
    parse(dateString, token) {
      switch (token) {
        case "x":
          return parseTimezonePattern(
            timezonePatterns.basicOptionalMinutes,
            dateString
          );
        case "xx":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "xxxx":
          return parseTimezonePattern(
            timezonePatterns.basicOptionalSeconds,
            dateString
          );
        case "xxxxx":
          return parseTimezonePattern(
            timezonePatterns.extendedOptionalSeconds,
            dateString
          );
        case "xxx":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date;
      return constructFrom(
        date,
        date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
      );
    }
  }
  class TimestampSecondsParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 40);
      __publicField(this, "incompatibleTokens", "*");
    }
    parse(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
    set(date, _flags, value) {
      return [constructFrom(date, value * 1e3), { timestampIsSet: true }];
    }
  }
  class TimestampMillisecondsParser extends Parser {
    constructor() {
      super(...arguments);
      __publicField(this, "priority", 20);
      __publicField(this, "incompatibleTokens", "*");
    }
    parse(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
    set(date, _flags, value) {
      return [constructFrom(date, value), { timestampIsSet: true }];
    }
  }
  const parsers = {
    G: new EraParser(),
    y: new YearParser(),
    Y: new LocalWeekYearParser(),
    R: new ISOWeekYearParser(),
    u: new ExtendedYearParser(),
    Q: new QuarterParser(),
    q: new StandAloneQuarterParser(),
    M: new MonthParser(),
    L: new StandAloneMonthParser(),
    w: new LocalWeekParser(),
    I: new ISOWeekParser(),
    d: new DateParser(),
    D: new DayOfYearParser(),
    E: new DayParser(),
    e: new LocalDayParser(),
    c: new StandAloneLocalDayParser(),
    i: new ISODayParser(),
    a: new AMPMParser(),
    b: new AMPMMidnightParser(),
    B: new DayPeriodParser(),
    h: new Hour1to12Parser(),
    H: new Hour0to23Parser(),
    K: new Hour0To11Parser(),
    k: new Hour1To24Parser(),
    m: new MinuteParser(),
    s: new SecondParser(),
    S: new FractionOfSecondParser(),
    X: new ISOTimezoneWithZParser(),
    x: new ISOTimezoneParser(),
    t: new TimestampSecondsParser(),
    T: new TimestampMillisecondsParser()
  };
  const formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  const escapedStringRegExp = /^'([^]*?)'?$/;
  const doubleQuoteRegExp = /''/g;
  const notWhitespaceRegExp = /\S/;
  const unescapedLatinCharacterRegExp = /[a-zA-Z]/;
  function parse(dateStr, formatStr, referenceDate, options) {
    var _a2, _b, _c, _d, _e2, _f, _g, _h;
    const invalidDate = () => constructFrom((options == null ? void 0 : options.in) || referenceDate, NaN);
    const defaultOptions2 = getDefaultOptions();
    const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
    const firstWeekContainsDate = (options == null ? void 0 : options.firstWeekContainsDate) ?? ((_b = (_a2 = options == null ? void 0 : options.locale) == null ? void 0 : _a2.options) == null ? void 0 : _b.firstWeekContainsDate) ?? defaultOptions2.firstWeekContainsDate ?? ((_d = (_c = defaultOptions2.locale) == null ? void 0 : _c.options) == null ? void 0 : _d.firstWeekContainsDate) ?? 1;
    const weekStartsOn = (options == null ? void 0 : options.weekStartsOn) ?? ((_f = (_e2 = options == null ? void 0 : options.locale) == null ? void 0 : _e2.options) == null ? void 0 : _f.weekStartsOn) ?? defaultOptions2.weekStartsOn ?? ((_h = (_g = defaultOptions2.locale) == null ? void 0 : _g.options) == null ? void 0 : _h.weekStartsOn) ?? 0;
    if (!formatStr)
      return dateStr ? invalidDate() : toDate(referenceDate, options == null ? void 0 : options.in);
    const subFnOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale
    };
    const setters = [new DateTimezoneSetter(options == null ? void 0 : options.in, referenceDate)];
    const tokens = formatStr.match(longFormattingTokensRegExp).map((substring) => {
      const firstCharacter = substring[0];
      if (firstCharacter in longFormatters) {
        const longFormatter = longFormatters[firstCharacter];
        return longFormatter(substring, locale.formatLong);
      }
      return substring;
    }).join("").match(formattingTokensRegExp);
    const usedTokens = [];
    for (let token of tokens) {
      if (!(options == null ? void 0 : options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, dateStr);
      }
      if (!(options == null ? void 0 : options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
        warnOrThrowProtectedError(token, formatStr, dateStr);
      }
      const firstCharacter = token[0];
      const parser = parsers[firstCharacter];
      if (parser) {
        const { incompatibleTokens } = parser;
        if (Array.isArray(incompatibleTokens)) {
          const incompatibleToken = usedTokens.find(
            (usedToken) => incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter
          );
          if (incompatibleToken) {
            throw new RangeError(
              `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`
            );
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
          throw new RangeError(
            `The format string mustn't contain \`${token}\` and any other token at the same time`
          );
        }
        usedTokens.push({ token: firstCharacter, fullToken: token });
        const parseResult = parser.run(
          dateStr,
          token,
          locale.match,
          subFnOptions
        );
        if (!parseResult) {
          return invalidDate();
        }
        setters.push(parseResult.setter);
        dateStr = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError(
            "Format string contains an unescaped latin alphabet character `" + firstCharacter + "`"
          );
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString(token);
        }
        if (dateStr.indexOf(token) === 0) {
          dateStr = dateStr.slice(token.length);
        } else {
          return invalidDate();
        }
      }
    }
    if (dateStr.length > 0 && notWhitespaceRegExp.test(dateStr)) {
      return invalidDate();
    }
    const uniquePrioritySetters = setters.map((setter) => setter.priority).sort((a, b) => b - a).filter((priority, index, array) => array.indexOf(priority) === index).map(
      (priority) => setters.filter((setter) => setter.priority === priority).sort((a, b) => b.subPriority - a.subPriority)
    ).map((setterArray) => setterArray[0]);
    let date = toDate(referenceDate, options == null ? void 0 : options.in);
    if (isNaN(+date)) return invalidDate();
    const flags = {};
    for (const setter of uniquePrioritySetters) {
      if (!setter.validate(date, subFnOptions)) {
        return invalidDate();
      }
      const result = setter.set(date, flags, subFnOptions);
      if (Array.isArray(result)) {
        date = result[0];
        Object.assign(flags, result[1]);
      } else {
        date = result;
      }
    }
    return date;
  }
  function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
  }
  function isSameQuarter(laterDate, earlierDate, options) {
    const [dateLeft_, dateRight_] = normalizeDates(
      void 0 ,
      laterDate,
      earlierDate
    );
    return +startOfQuarter(dateLeft_) === +startOfQuarter(dateRight_);
  }
  function subDays(date, amount, options) {
    return addDays(date, -amount, options);
  }
  function setMonth(date, month, options) {
    const _date = toDate(date, void 0 );
    const year = _date.getFullYear();
    const day = _date.getDate();
    const midMonth = constructFrom(date, 0);
    midMonth.setFullYear(year, month, 15);
    midMonth.setHours(0, 0, 0, 0);
    const daysInMonth = getDaysInMonth(midMonth);
    _date.setMonth(month, Math.min(day, daysInMonth));
    return _date;
  }
  function set(date, values, options) {
    let _date = toDate(date, void 0 );
    if (isNaN(+_date)) return constructFrom(date, NaN);
    if (values.year != null) _date.setFullYear(values.year);
    if (values.month != null) _date = setMonth(_date, values.month);
    if (values.date != null) _date.setDate(values.date);
    if (values.hours != null) _date.setHours(values.hours);
    if (values.minutes != null) _date.setMinutes(values.minutes);
    if (values.seconds != null) _date.setSeconds(values.seconds);
    if (values.milliseconds != null) _date.setMilliseconds(values.milliseconds);
    return _date;
  }
  function setHours(date, hours, options) {
    const _date = toDate(date, void 0 );
    _date.setHours(hours);
    return _date;
  }
  function setMilliseconds(date, milliseconds, options) {
    const _date = toDate(date, void 0 );
    _date.setMilliseconds(milliseconds);
    return _date;
  }
  function setMinutes(date, minutes, options) {
    const date_ = toDate(date, void 0 );
    date_.setMinutes(minutes);
    return date_;
  }
  function setSeconds(date, seconds, options) {
    const _date = toDate(date, void 0 );
    _date.setSeconds(seconds);
    return _date;
  }
  function setYear(date, year, options) {
    const date_ = toDate(date, void 0 );
    if (isNaN(+date_)) return constructFrom(date, NaN);
    date_.setFullYear(year);
    return date_;
  }
  function subMonths(date, amount, options) {
    return addMonths(date, -amount);
  }
  function sub(date, duration, options) {
    const {
      years = 0,
      months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0
    } = duration;
    const withoutMonths = subMonths(date, months + years * 12);
    const withoutDays = subDays(withoutMonths, days + weeks * 7, options);
    const minutesToSub = minutes + hours * 60;
    const secondsToSub = seconds + minutesToSub * 60;
    const msToSub = secondsToSub * 1e3;
    return constructFrom(date, +withoutDays - msToSub);
  }
  function subYears(date, amount, options) {
    return addYears(date, -amount);
  }
  function zt() {
    const e = vue.useAttrs();
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img",
        ...e
      },
      [
        vue.createElementVNode("path", {
          d: "M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"
        }),
        vue.createElementVNode("path", {
          d: "M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
        }),
        vue.createElementVNode("path", {
          d: "M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
        }),
        vue.createElementVNode("path", {
          d: "M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"
        })
      ]
    );
  }
  zt.compatConfig = {
    MODE: 3
  };
  function Mn() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M23.057 7.057l-16 16c-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0l16-16c0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0z"
        }),
        vue.createElementVNode("path", {
          d: "M7.057 8.943l16 16c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885l-16-16c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885z"
        })
      ]
    );
  }
  Mn.compatConfig = {
    MODE: 3
  };
  function za() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
        })
      ]
    );
  }
  za.compatConfig = {
    MODE: 3
  };
  function Ha() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
        })
      ]
    );
  }
  Ha.compatConfig = {
    MODE: 3
  };
  function Ua() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M16 1.333c-8.095 0-14.667 6.572-14.667 14.667s6.572 14.667 14.667 14.667c8.095 0 14.667-6.572 14.667-14.667s-6.572-14.667-14.667-14.667zM16 4c6.623 0 12 5.377 12 12s-5.377 12-12 12c-6.623 0-12-5.377-12-12s5.377-12 12-12z"
        }),
        vue.createElementVNode("path", {
          d: "M14.667 8v8c0 0.505 0.285 0.967 0.737 1.193l5.333 2.667c0.658 0.329 1.46 0.062 1.789-0.596s0.062-1.46-0.596-1.789l-4.596-2.298c0 0 0-7.176 0-7.176 0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
        })
      ]
    );
  }
  Ua.compatConfig = {
    MODE: 3
  };
  function Wa() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M24.943 19.057l-8-8c-0.521-0.521-1.365-0.521-1.885 0l-8 8c-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0l7.057-7.057c0 0 7.057 7.057 7.057 7.057 0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
        })
      ]
    );
  }
  Wa.compatConfig = {
    MODE: 3
  };
  function Va() {
    return vue.openBlock(), vue.createElementBlock(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32",
        fill: "currentColor",
        "aria-hidden": "true",
        class: "dp__icon",
        role: "img"
      },
      [
        vue.createElementVNode("path", {
          d: "M7.057 12.943l8 8c0.521 0.521 1.365 0.521 1.885 0l8-8c0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-7.057 7.057c0 0-7.057-7.057-7.057-7.057-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885z"
        })
      ]
    );
  }
  Va.compatConfig = {
    MODE: 3
  };
  const xe = (e, t2) => t2 ? new Date(e.toLocaleString("en-US", { timeZone: t2 })) : new Date(e), ja = (e, t2, l) => {
    const a = Na(e, t2, l);
    return a || W();
  }, vl = (e, t2, l) => {
    const a = t2.dateInTz ? xe(new Date(e), t2.dateInTz) : W(e);
    return l ? Je(a, true) : a;
  }, Na = (e, t2, l) => {
    if (!e) return null;
    const a = l ? Je(W(e), true) : W(e);
    return t2 ? t2.exactMatch ? vl(e, t2, l) : xe(a, t2.timezone) : a;
  }, ml = (e, t2) => {
    if (!e) return 0;
    const l = /* @__PURE__ */ new Date(), a = new Date(l.toLocaleString("en-US", { timeZone: "UTC" })), n = new Date(l.toLocaleString("en-US", { timeZone: e })), i = (t2 ?? n).getTimezoneOffset() / 60;
    return (+a - +n) / (1e3 * 60 * 60) - i;
  };
  var ot = /* @__PURE__ */ ((e) => (e.month = "month", e.year = "year", e))(ot || {}), st = /* @__PURE__ */ ((e) => (e.top = "top", e.bottom = "bottom", e))(st || {}), Pt = /* @__PURE__ */ ((e) => (e.header = "header", e.calendar = "calendar", e.timePicker = "timePicker", e))(Pt || {}), je = /* @__PURE__ */ ((e) => (e.month = "month", e.year = "year", e.calendar = "calendar", e.time = "time", e.minutes = "minutes", e.hours = "hours", e.seconds = "seconds", e))(je || {});
  const pl = ["timestamp", "date", "iso"];
  var qe = /* @__PURE__ */ ((e) => (e.up = "up", e.down = "down", e.left = "left", e.right = "right", e))(qe || {}), Ce = /* @__PURE__ */ ((e) => (e.arrowUp = "ArrowUp", e.arrowDown = "ArrowDown", e.arrowLeft = "ArrowLeft", e.arrowRight = "ArrowRight", e.enter = "Enter", e.space = " ", e.esc = "Escape", e.tab = "Tab", e.home = "Home", e.end = "End", e.pageUp = "PageUp", e.pageDown = "PageDown", e))(Ce || {});
  function ln(e) {
    return (t2) => new Intl.DateTimeFormat(e, { weekday: "short", timeZone: "UTC" }).format(/* @__PURE__ */ new Date(`2017-01-0${t2}T00:00:00+00:00`)).slice(0, 2);
  }
  function yl(e) {
    return (t2) => format(xe(/* @__PURE__ */ new Date(`2017-01-0${t2}T00:00:00+00:00`), "UTC"), "EEEEEE", { locale: e });
  }
  const gl = (e, t2, l) => {
    const a = [1, 2, 3, 4, 5, 6, 7];
    let n;
    if (e !== null)
      try {
        n = a.map(yl(e));
      } catch {
        n = a.map(ln(t2));
      }
    else
      n = a.map(ln(t2));
    const i = n.slice(0, l), c = n.slice(l + 1, n.length);
    return [n[l]].concat(...c).concat(...i);
  }, Ka = (e, t2, l) => {
    const a = [];
    for (let n = +e[0]; n <= +e[1]; n++)
      a.push({ value: +n, text: Sn(n, t2) });
    return l ? a.reverse() : a;
  }, $n = (e, t2, l) => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
      const c = i < 10 ? `0${i}` : i;
      return /* @__PURE__ */ new Date(`2017-${c}-01T00:00:00+00:00`);
    });
    if (e !== null)
      try {
        const i = l === "long" ? "LLLL" : "LLL";
        return a.map((c, h2) => {
          const f = format(xe(c, "UTC"), i, { locale: e });
          return {
            text: f.charAt(0).toUpperCase() + f.substring(1),
            value: h2
          };
        });
      } catch {
      }
    const n = new Intl.DateTimeFormat(t2, { month: l, timeZone: "UTC" });
    return a.map((i, c) => {
      const h2 = n.format(i);
      return {
        text: h2.charAt(0).toUpperCase() + h2.substring(1),
        value: c
      };
    });
  }, hl = (e) => [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][e], Le = (e) => {
    const t2 = vue.unref(e);
    return t2 != null && t2.$el ? t2 == null ? void 0 : t2.$el : t2;
  }, bl = (e) => ({ type: "dot", ...e ?? {} }), An = (e) => Array.isArray(e) ? !!e[0] && !!e[1] : false, Ga = {
    prop: (e) => `"${e}" prop must be enabled!`,
    dateArr: (e) => `You need to use array as "model-value" binding in order to support "${e}"`
  }, Ee = (e) => e, rn = (e) => e === 0 ? e : !e || isNaN(+e) ? null : +e, on = (e) => e === null, Tn = (e) => {
    if (e)
      return [...e.querySelectorAll("input, button, select, textarea, a[href]")][0];
  }, kl = (e) => {
    const t2 = [], l = (a) => a.filter((n) => n);
    for (let a = 0; a < e.length; a += 3) {
      const n = [e[a], e[a + 1], e[a + 2]];
      t2.push(l(n));
    }
    return t2;
  }, Qt = (e, t2, l) => {
    const a = l != null, n = t2 != null;
    if (!a && !n) return false;
    const i = +l, c = +t2;
    return a && n ? +e > i || +e < c : a ? +e > i : n ? +e < c : false;
  }, Et = (e, t2) => kl(e).map((l) => l.map((a) => {
    const { active: n, disabled: i, isBetween: c, highlighted: h2 } = t2(a);
    return {
      ...a,
      active: n,
      disabled: i,
      className: {
        dp__overlay_cell_active: n,
        dp__overlay_cell: !n,
        dp__overlay_cell_disabled: i,
        dp__overlay_cell_pad: true,
        dp__overlay_cell_active_disabled: i && n,
        dp__cell_in_between: c,
        "dp--highlighted": h2
      }
    };
  })), kt = (e, t2, l = false) => {
    e && t2.allowStopPropagation && (l && e.stopImmediatePropagation(), e.stopPropagation());
  }, wl = () => [
    "a[href]",
    "area[href]",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[data-datepicker-instance]"
  ].join(", ");
  function Dl(e, t2) {
    let l = [...document.querySelectorAll(wl())];
    l = l.filter((n) => !e.contains(n) || n.hasAttribute("data-datepicker-instance"));
    const a = l.indexOf(e);
    if (a >= 0 && (t2 ? a - 1 >= 0 : a + 1 <= l.length))
      return l[a + (t2 ? -1 : 1)];
  }
  const Ea = (e, t2) => e == null ? void 0 : e.querySelector(`[data-dp-element="${t2}"]`), Sn = (e, t2) => new Intl.NumberFormat(t2, { useGrouping: false, style: "decimal" }).format(e), Qa = (e) => format(e, "dd-MM-yyyy"), $a = (e) => Array.isArray(e), ua = (e, t2) => t2.get(Qa(e)), Ml = (e, t2) => e ? t2 ? t2 instanceof Map ? !!ua(e, t2) : t2(W(e)) : false : true, Xe = (e, t2, l = false, a) => {
    if (e.key === Ce.enter || e.key === Ce.space)
      return l && e.preventDefault(), t2();
    if (a) return a(e);
  }, sn = () => ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].some(
    (e) => navigator.userAgent.includes(e)
  ) || navigator.userAgent.includes("Mac") && "ontouchend" in document, un = (e, t2, l, a, n, i) => {
    const c = parse(e, t2.slice(0, e.length), /* @__PURE__ */ new Date(), { locale: i });
    return isValid(c) && isDate(c) ? a || n ? c : set(c, {
      hours: +l.hours,
      minutes: +(l == null ? void 0 : l.minutes),
      seconds: +(l == null ? void 0 : l.seconds),
      milliseconds: 0
    }) : null;
  }, $l = (e, t2, l, a, n, i) => {
    const c = Array.isArray(l) ? l[0] : l;
    if (typeof t2 == "string")
      return un(e, t2, c, a, n, i);
    if (Array.isArray(t2)) {
      let h2 = null;
      for (const f of t2)
        if (h2 = un(e, f, c, a, n, i), h2)
          break;
      return h2;
    }
    return typeof t2 == "function" ? t2(e) : null;
  }, W = (e) => e ? new Date(e) : /* @__PURE__ */ new Date(), Al = (e, t2, l) => {
    if (t2) {
      const n = (e.getMonth() + 1).toString().padStart(2, "0"), i = e.getDate().toString().padStart(2, "0"), c = e.getHours().toString().padStart(2, "0"), h2 = e.getMinutes().toString().padStart(2, "0"), f = l ? e.getSeconds().toString().padStart(2, "0") : "00";
      return `${e.getFullYear()}-${n}-${i}T${c}:${h2}:${f}.000Z`;
    }
    const a = Date.UTC(
      e.getUTCFullYear(),
      e.getUTCMonth(),
      e.getUTCDate(),
      e.getUTCHours(),
      e.getUTCMinutes(),
      e.getUTCSeconds()
    );
    return new Date(a).toISOString();
  }, Je = (e, t2) => {
    const l = W(JSON.parse(JSON.stringify(e))), a = set(l, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return t2 ? startOfMonth(a) : a;
  }, wt = (e, t2, l, a) => {
    let n = e ? W(e) : W();
    return (t2 || t2 === 0) && (n = setHours(n, +t2)), (l || l === 0) && (n = setMinutes(n, +l)), (a || a === 0) && (n = setSeconds(n, +a)), setMilliseconds(n, 0);
  }, Be = (e, t2) => !e || !t2 ? false : isBefore(Je(e), Je(t2)), Ae = (e, t2) => !e || !t2 ? false : isEqual(Je(e), Je(t2)), Ne = (e, t2) => !e || !t2 ? false : isAfter(Je(e), Je(t2)), da = (e, t2, l) => e != null && e[0] && (e != null && e[1]) ? Ne(l, e[0]) && Be(l, e[1]) : e != null && e[0] && t2 ? Ne(l, e[0]) && Be(l, t2) || Be(l, e[0]) && Ne(l, t2) : false, ut = (e) => {
    const t2 = set(new Date(e), { date: 1 });
    return Je(t2);
  }, Aa = (e, t2, l) => t2 && (l || l === 0) ? Object.fromEntries(
    ["hours", "minutes", "seconds"].map((a) => a === t2 ? [a, l] : [a, isNaN(+e[a]) ? void 0 : +e[a]])
  ) : {
    hours: isNaN(+e.hours) ? void 0 : +e.hours,
    minutes: isNaN(+e.minutes) ? void 0 : +e.minutes,
    seconds: isNaN(+e.seconds) ? void 0 : +e.seconds
  }, Rt = (e) => ({
    hours: getHours(e),
    minutes: getMinutes(e),
    seconds: getSeconds(e)
  }), Pn = (e, t2) => {
    if (t2) {
      const l = getYear(W(t2));
      if (l > e) return 12;
      if (l === e) return getMonth(W(t2));
    }
  }, Rn = (e, t2) => {
    if (t2) {
      const l = getYear(W(t2));
      return l < e ? -1 : l === e ? getMonth(W(t2)) : void 0;
    }
  }, Ft = (e) => {
    if (e) return getYear(W(e));
  }, Cn = (e, t2) => {
    const l = Ne(e, t2) ? t2 : e, a = Ne(t2, e) ? t2 : e;
    return eachDayOfInterval({ start: l, end: a });
  }, Tl = (e) => {
    const t2 = addMonths(e, 1);
    return { month: getMonth(t2), year: getYear(t2) };
  }, mt = (e, t2) => {
    const l = startOfWeek(e, { weekStartsOn: +t2 }), a = endOfWeek(e, { weekStartsOn: +t2 });
    return [l, a];
  }, On = (e, t2) => {
    const l = {
      hours: getHours(W()),
      minutes: getMinutes(W()),
      seconds: t2 ? getSeconds(W()) : 0
    };
    return Object.assign(l, e);
  }, bt = (e, t2, l) => [set(W(e), { date: 1 }), set(W(), { month: t2, year: l, date: 1 })], pt = (e, t2, l) => {
    let a = e ? W(e) : W();
    return (t2 || t2 === 0) && (a = setMonth(a, t2)), l && (a = setYear(a, l)), a;
  }, _n = (e, t2, l, a, n) => {
    if (!a || n && !t2 || !n && !l) return false;
    const i = n ? addMonths(e, 1) : subMonths(e, 1), c = [getMonth(i), getYear(i)];
    return n ? !Pl(...c, t2) : !Sl(...c, l);
  }, Sl = (e, t2, l) => Be(...bt(l, e, t2)) || Ae(...bt(l, e, t2)), Pl = (e, t2, l) => Ne(...bt(l, e, t2)) || Ae(...bt(l, e, t2)), Bn = (e, t2, l, a, n, i, c) => {
    if (typeof t2 == "function" && !c) return t2(e);
    const h2 = l ? { locale: l } : void 0;
    return Array.isArray(e) ? `${format(e[0], i, h2)}${n && !e[1] ? "" : a}${e[1] ? format(e[1], i, h2) : ""}` : format(e, i, h2);
  }, _t = (e) => {
    if (e) return null;
    throw new Error(Ga.prop("partial-range"));
  }, aa = (e, t2) => {
    if (t2) return e();
    throw new Error(Ga.prop("range"));
  }, Fa = (e) => Array.isArray(e) ? isValid(e[0]) && (e[1] ? isValid(e[1]) : true) : e ? isValid(e) : false, Rl = (e, t2) => set(t2 ?? W(), {
    hours: +e.hours || 0,
    minutes: +e.minutes || 0,
    seconds: +e.seconds || 0
  }), Ta = (e, t2, l, a) => {
    if (!e) return true;
    if (a) {
      const n = l === "max" ? isBefore(e, t2) : isAfter(e, t2), i = { seconds: 0, milliseconds: 0 };
      return n || isEqual(set(e, i), set(t2, i));
    }
    return l === "max" ? e.getTime() <= t2.getTime() : e.getTime() >= t2.getTime();
  }, Sa = (e, t2, l) => e ? Rl(e, t2) : W(l ?? t2), dn = (e, t2, l, a, n) => {
    if (Array.isArray(a)) {
      const c = Sa(e, a[0], t2), h2 = Sa(e, a[1], t2);
      return Ta(a[0], c, l, !!t2) && Ta(a[1], h2, l, !!t2) && n;
    }
    const i = Sa(e, a, t2);
    return Ta(a, i, l, !!t2) && n;
  }, Pa = (e) => set(W(), Rt(e)), Cl = (e, t2) => e instanceof Map ? Array.from(e.values()).filter((l) => getYear(W(l)) === t2).map((l) => getMonth(l)) : [], Ol = (e, t2, l) => {
    if (e instanceof Map) {
      const a = Array.from(e.values()).filter((n) => getYear(W(n)) === t2).map((n) => getMonth(n));
      return a.length ? a.includes(l) : true;
    }
    return true;
  }, Yn = (e, t2, l) => typeof e == "function" ? e({ month: t2, year: l }) : !!e.months.find((a) => a.month === t2 && a.year === l), qa = (e, t2) => typeof e == "function" ? e(t2) : e.years.includes(t2), In = (e) => format(e, "yyyy-MM-dd"), Ut = vue.reactive({
    menuFocused: false,
    shiftKeyInMenu: false
  }), Nn = () => {
    const e = (a) => {
      Ut.menuFocused = a;
    }, t2 = (a) => {
      Ut.shiftKeyInMenu !== a && (Ut.shiftKeyInMenu = a);
    };
    return {
      control: vue.computed(() => ({ shiftKeyInMenu: Ut.shiftKeyInMenu, menuFocused: Ut.menuFocused })),
      setMenuFocused: e,
      setShiftKey: t2
    };
  }, Re = vue.reactive({
    monthYear: [],
    calendar: [],
    time: [],
    actionRow: [],
    selectionGrid: [],
    timePicker: {
      0: [],
      1: []
    },
    monthPicker: []
  }), Ra = vue.ref(null), na = vue.ref(false), Ca = vue.ref(false), Oa = vue.ref(false), _a = vue.ref(false), Ve = vue.ref(0), Ie = vue.ref(0), Mt = () => {
    const e = vue.computed(() => na.value ? [...Re.selectionGrid, Re.actionRow].filter((d) => d.length) : Ca.value ? [
      ...Re.timePicker[0],
      ...Re.timePicker[1],
      _a.value ? [] : [Ra.value],
      Re.actionRow
    ].filter((d) => d.length) : Oa.value ? [...Re.monthPicker, Re.actionRow] : [Re.monthYear, ...Re.calendar, Re.time, Re.actionRow].filter((d) => d.length)), t2 = (d) => {
      Ve.value = d ? Ve.value + 1 : Ve.value - 1;
      let R = null;
      e.value[Ie.value] && (R = e.value[Ie.value][Ve.value]), !R && e.value[Ie.value + (d ? 1 : -1)] ? (Ie.value = Ie.value + (d ? 1 : -1), Ve.value = d ? 0 : e.value[Ie.value].length - 1) : R || (Ve.value = d ? Ve.value - 1 : Ve.value + 1);
    }, l = (d) => {
      if (Ie.value === 0 && !d || Ie.value === e.value.length && d) return;
      Ie.value = d ? Ie.value + 1 : Ie.value - 1, e.value[Ie.value] ? e.value[Ie.value] && !e.value[Ie.value][Ve.value] && Ve.value !== 0 && (Ve.value = e.value[Ie.value].length - 1) : Ie.value = d ? Ie.value - 1 : Ie.value + 1;
    }, a = (d) => {
      let R = null;
      e.value[Ie.value] && (R = e.value[Ie.value][Ve.value]), R ? R.focus({ preventScroll: !na.value }) : Ve.value = d ? Ve.value - 1 : Ve.value + 1;
    }, n = () => {
      t2(true), a(true);
    }, i = () => {
      t2(false), a(false);
    }, c = () => {
      l(false), a(true);
    }, h2 = () => {
      l(true), a(true);
    }, f = (d, R) => {
      Re[R] = d;
    }, I = (d, R) => {
      Re[R] = d;
    }, v = () => {
      Ve.value = 0, Ie.value = 0;
    };
    return {
      buildMatrix: f,
      buildMultiLevelMatrix: I,
      setTimePickerBackRef: (d) => {
        Ra.value = d;
      },
      setSelectionGrid: (d) => {
        na.value = d, v(), d || (Re.selectionGrid = []);
      },
      setTimePicker: (d, R = false) => {
        Ca.value = d, _a.value = R, v(), d || (Re.timePicker[0] = [], Re.timePicker[1] = []);
      },
      setTimePickerElements: (d, R = 0) => {
        Re.timePicker[R] = d;
      },
      arrowRight: n,
      arrowLeft: i,
      arrowUp: c,
      arrowDown: h2,
      clearArrowNav: () => {
        Re.monthYear = [], Re.calendar = [], Re.time = [], Re.actionRow = [], Re.selectionGrid = [], Re.timePicker[0] = [], Re.timePicker[1] = [], na.value = false, Ca.value = false, _a.value = false, Oa.value = false, v(), Ra.value = null;
      },
      setMonthPicker: (d) => {
        Oa.value = d, v();
      },
      refSets: Re
      // exposed for testing
    };
  }, cn = (e) => ({
    menuAppearTop: "dp-menu-appear-top",
    menuAppearBottom: "dp-menu-appear-bottom",
    open: "dp-slide-down",
    close: "dp-slide-up",
    next: "calendar-next",
    previous: "calendar-prev",
    vNext: "dp-slide-up",
    vPrevious: "dp-slide-down",
    ...e ?? {}
  }), _l = (e) => ({
    toggleOverlay: "Toggle overlay",
    menu: "Datepicker menu",
    input: "Datepicker input",
    openTimePicker: "Open time picker",
    closeTimePicker: "Close time Picker",
    incrementValue: (t2) => `Increment ${t2}`,
    decrementValue: (t2) => `Decrement ${t2}`,
    openTpOverlay: (t2) => `Open ${t2} overlay`,
    amPmButton: "Switch AM/PM mode",
    openYearsOverlay: "Open years overlay",
    openMonthsOverlay: "Open months overlay",
    nextMonth: "Next month",
    prevMonth: "Previous month",
    nextYear: "Next year",
    prevYear: "Previous year",
    day: void 0,
    weekDay: void 0,
    clearInput: "Clear value",
    calendarIcon: "Calendar icon",
    timePicker: "Time picker",
    monthPicker: (t2) => `Month picker${t2 ? " overlay" : ""}`,
    yearPicker: (t2) => `Year picker${t2 ? " overlay" : ""}`,
    timeOverlay: (t2) => `${t2} overlay`,
    ...e ?? {}
  }), fn = (e) => e ? typeof e == "boolean" ? e ? 2 : 0 : +e >= 2 ? +e : 2 : 0, Bl = (e) => {
    const t2 = typeof e == "object" && e, l = {
      static: true,
      solo: false
    };
    if (!e) return { ...l, count: fn(false) };
    const a = t2 ? e : {}, n = t2 ? a.count ?? true : e, i = fn(n);
    return Object.assign(l, a, { count: i });
  }, Yl = (e, t2, l) => e || (typeof l == "string" ? l : t2), Il = (e) => typeof e == "boolean" ? e ? cn({}) : false : cn(e), Nl = (e) => {
    const t2 = {
      enterSubmit: true,
      tabSubmit: true,
      openMenu: "open",
      selectOnFocus: false,
      rangeSeparator: " - "
    };
    return typeof e == "object" ? { ...t2, ...e ?? {}, enabled: true } : { ...t2, enabled: e };
  }, El = (e) => ({
    months: [],
    years: [],
    times: { hours: [], minutes: [], seconds: [] },
    ...e ?? {}
  }), Fl = (e) => ({
    showSelect: true,
    showCancel: true,
    showNow: false,
    showPreview: true,
    ...e ?? {}
  }), Ll = (e) => {
    const t2 = { input: false };
    return typeof e == "object" ? { ...t2, ...e ?? {}, enabled: true } : {
      enabled: e,
      ...t2
    };
  }, zl = (e) => ({ ...{
    allowStopPropagation: true,
    closeOnScroll: false,
    modeHeight: 255,
    allowPreventDefault: false,
    closeOnClearValue: true,
    closeOnAutoApply: true,
    noSwipe: false,
    keepActionRow: false,
    onClickOutside: void 0,
    tabOutClosesMenu: true,
    arrowLeft: void 0,
    keepViewOnOffsetClick: false,
    timeArrowHoldThreshold: 0,
    shadowDom: false,
    mobileBreakpoint: 600,
    setDateOnMenuClose: false
  }, ...e ?? {} }), Hl = (e) => {
    const t2 = {
      dates: Array.isArray(e) ? e.map((l) => W(l)) : [],
      years: [],
      months: [],
      quarters: [],
      weeks: [],
      weekdays: [],
      options: { highlightDisabled: false }
    };
    return typeof e == "function" ? e : { ...t2, ...e ?? {} };
  }, Ul = (e) => typeof e == "object" ? {
    type: (e == null ? void 0 : e.type) ?? "local",
    hideOnOffsetDates: (e == null ? void 0 : e.hideOnOffsetDates) ?? false
  } : {
    type: e,
    hideOnOffsetDates: false
  }, Wl = (e) => {
    const t2 = {
      noDisabledRange: false,
      showLastInRange: true,
      minMaxRawRange: false,
      partialRange: true,
      disableTimeRangeValidation: false,
      maxRange: void 0,
      minRange: void 0,
      autoRange: void 0,
      fixedStart: false,
      fixedEnd: false
    };
    return typeof e == "object" ? { enabled: true, ...t2, ...e } : {
      enabled: e,
      ...t2
    };
  }, Vl = (e) => e ? typeof e == "string" ? {
    timezone: e,
    exactMatch: false,
    dateInTz: void 0,
    emitTimezone: void 0,
    convertModel: true
  } : {
    timezone: e.timezone,
    exactMatch: e.exactMatch ?? false,
    dateInTz: e.dateInTz ?? void 0,
    emitTimezone: e.emitTimezone ?? void 0,
    convertModel: e.convertModel ?? true
  } : { timezone: void 0, exactMatch: false, emitTimezone: void 0 }, Ba = (e, t2, l) => new Map(
    e.map((a) => {
      const n = ja(a, t2, l);
      return [Qa(n), n];
    })
  ), jl = (e, t2) => e.length ? new Map(
    e.map((l) => {
      const a = ja(l.date, t2);
      return [Qa(a), l];
    })
  ) : null, Kl = (e) => {
    var t2;
    return {
      minDate: Na(e.minDate, e.timezone, e.isSpecific),
      maxDate: Na(e.maxDate, e.timezone, e.isSpecific),
      disabledDates: $a(e.disabledDates) ? Ba(e.disabledDates, e.timezone, e.isSpecific) : e.disabledDates,
      allowedDates: $a(e.allowedDates) ? Ba(e.allowedDates, e.timezone, e.isSpecific) : null,
      highlight: typeof e.highlight == "object" && $a((t2 = e.highlight) == null ? void 0 : t2.dates) ? Ba(e.highlight.dates, e.timezone) : e.highlight,
      markers: jl(e.markers, e.timezone)
    };
  }, Gl = (e) => typeof e == "boolean" ? { enabled: e, dragSelect: true, limit: null } : {
    enabled: !!e,
    limit: e.limit ? +e.limit : null,
    dragSelect: e.dragSelect ?? true
  }, Ql = (e) => ({
    ...Object.fromEntries(
      Object.keys(e).map((l) => {
        const a = l, n = e[a], i = typeof e[a] == "string" ? { [n]: true } : Object.fromEntries(n.map((c) => [c, true]));
        return [l, i];
      })
    )
  }), _e = (e) => {
    const t2 = () => {
      const ne = e.enableSeconds ? ":ss" : "", x = e.enableMinutes ? ":mm" : "";
      return e.is24 ? `HH${x}${ne}` : `hh${x}${ne} aa`;
    }, l = () => {
      var ne;
      return e.format ? e.format : e.monthPicker ? "MM/yyyy" : e.timePicker ? t2() : e.weekPicker ? `${((ne = U.value) == null ? void 0 : ne.type) === "iso" ? "RR" : "ww"}-yyyy` : e.yearPicker ? "yyyy" : e.quarterPicker ? "QQQ/yyyy" : e.enableTimePicker ? `MM/dd/yyyy, ${t2()}` : "MM/dd/yyyy";
    }, a = (ne) => On(ne, e.enableSeconds), n = () => F.value.enabled ? e.startTime && Array.isArray(e.startTime) ? [a(e.startTime[0]), a(e.startTime[1])] : null : e.startTime && !Array.isArray(e.startTime) ? a(e.startTime) : null, i = vue.computed(() => Bl(e.multiCalendars)), c = vue.computed(() => n()), h2 = vue.computed(() => _l(e.ariaLabels)), f = vue.computed(() => El(e.filters)), I = vue.computed(() => Il(e.transitions)), v = vue.computed(() => Fl(e.actionRow)), C = vue.computed(
      () => Yl(e.previewFormat, e.format, l())
    ), m = vue.computed(() => Nl(e.textInput)), P = vue.computed(() => Ll(e.inline)), H = vue.computed(() => zl(e.config)), Y = vue.computed(() => Hl(e.highlight)), U = vue.computed(() => Ul(e.weekNumbers)), d = vue.computed(() => Vl(e.timezone)), R = vue.computed(() => Gl(e.multiDates)), _ = vue.computed(
      () => Kl({
        minDate: e.minDate,
        maxDate: e.maxDate,
        disabledDates: e.disabledDates,
        allowedDates: e.allowedDates,
        highlight: Y.value,
        markers: e.markers,
        timezone: d.value,
        isSpecific: e.monthPicker || e.yearPicker || e.quarterPicker
      })
    ), F = vue.computed(() => Wl(e.range)), Q = vue.computed(() => Ql(e.ui));
    return {
      defaultedTransitions: I,
      defaultedMultiCalendars: i,
      defaultedStartTime: c,
      defaultedAriaLabels: h2,
      defaultedFilters: f,
      defaultedActionRow: v,
      defaultedPreviewFormat: C,
      defaultedTextInput: m,
      defaultedInline: P,
      defaultedConfig: H,
      defaultedHighlight: Y,
      defaultedWeekNumbers: U,
      defaultedRange: F,
      propDates: _,
      defaultedTz: d,
      defaultedMultiDates: R,
      defaultedUI: Q,
      getDefaultPattern: l,
      getDefaultStartTime: n
    };
  }, ql = (e, t2, l) => {
    const a = vue.ref(), { defaultedTextInput: n, defaultedRange: i, defaultedTz: c, defaultedMultiDates: h2, getDefaultPattern: f } = _e(t2), I = vue.ref(""), v = vue.toRef(t2, "format"), C = vue.toRef(t2, "formatLocale");
    vue.watch(
      a,
      () => {
        typeof t2.onInternalModelChange == "function" && e("internal-model-change", a.value, k(true));
      },
      { deep: true }
    ), vue.watch(i, (u, te) => {
      u.enabled !== te.enabled && (a.value = null);
    }), vue.watch(v, () => {
      j();
    });
    const m = (u) => c.value.timezone && c.value.convertModel ? xe(u, c.value.timezone) : u, P = (u) => {
      if (c.value.timezone && c.value.convertModel) {
        const te = ml(c.value.timezone, u);
        return addHours(u, te);
      }
      return u;
    }, H = (u, te, ye = false) => Bn(
      u,
      t2.format,
      t2.formatLocale,
      n.value.rangeSeparator,
      t2.modelAuto,
      te ?? f(),
      ye
    ), Y = (u) => u ? t2.modelType ? g(u) : {
      hours: getHours(u),
      minutes: getMinutes(u),
      seconds: t2.enableSeconds ? getSeconds(u) : 0
    } : null, U = (u) => t2.modelType ? g(u) : { month: getMonth(u), year: getYear(u) }, d = (u) => Array.isArray(u) ? h2.value.enabled ? u.map((te) => R(te, setYear(W(), te))) : aa(
      () => [
        setYear(W(), u[0]),
        u[1] ? setYear(W(), u[1]) : _t(i.value.partialRange)
      ],
      i.value.enabled
    ) : setYear(W(), +u), R = (u, te) => (typeof u == "string" || typeof u == "number") && t2.modelType ? $(u) : te, _ = (u) => Array.isArray(u) ? [
      R(
        u[0],
        wt(null, +u[0].hours, +u[0].minutes, u[0].seconds)
      ),
      R(
        u[1],
        wt(null, +u[1].hours, +u[1].minutes, u[1].seconds)
      )
    ] : R(u, wt(null, u.hours, u.minutes, u.seconds)), F = (u) => {
      const te = set(W(), { date: 1 });
      return Array.isArray(u) ? h2.value.enabled ? u.map((ye) => R(ye, pt(te, +ye.month, +ye.year))) : aa(
        () => [
          R(u[0], pt(te, +u[0].month, +u[0].year)),
          R(
            u[1],
            u[1] ? pt(te, +u[1].month, +u[1].year) : _t(i.value.partialRange)
          )
        ],
        i.value.enabled
      ) : R(u, pt(te, +u.month, +u.year));
    }, Q = (u) => {
      if (Array.isArray(u))
        return u.map((te) => $(te));
      throw new Error(Ga.dateArr("multi-dates"));
    }, ne = (u) => {
      if (Array.isArray(u) && i.value.enabled) {
        const te = u[0], ye = u[1];
        return [
          W(Array.isArray(te) ? te[0] : null),
          Array.isArray(ye) && ye.length ? W(ye[0]) : null
        ];
      }
      return W(u[0]);
    }, x = (u) => t2.modelAuto ? Array.isArray(u) ? [$(u[0]), $(u[1])] : t2.autoApply ? [$(u)] : [$(u), null] : Array.isArray(u) ? aa(
      () => u[1] ? [
        $(u[0]),
        u[1] ? $(u[1]) : _t(i.value.partialRange)
      ] : [$(u[0])],
      i.value.enabled
    ) : $(u), A = () => {
      Array.isArray(a.value) && i.value.enabled && a.value.length === 1 && a.value.push(_t(i.value.partialRange));
    }, X = () => {
      const u = a.value;
      return [
        g(u[0]),
        u[1] ? g(u[1]) : _t(i.value.partialRange)
      ];
    }, O = () => a.value[1] ? X() : g(Ee(a.value[0])), K = () => (a.value || []).map((u) => g(u)), fe = (u = false) => (u || A(), t2.modelAuto ? O() : h2.value.enabled ? K() : Array.isArray(a.value) ? aa(() => X(), i.value.enabled) : g(Ee(a.value))), ve = (u) => !u || Array.isArray(u) && !u.length ? null : t2.timePicker ? _(Ee(u)) : t2.monthPicker ? F(Ee(u)) : t2.yearPicker ? d(Ee(u)) : h2.value.enabled ? Q(Ee(u)) : t2.weekPicker ? ne(Ee(u)) : x(Ee(u)), p = (u) => {
      const te = ve(u);
      Fa(Ee(te)) ? (a.value = Ee(te), j()) : (a.value = null, I.value = "");
    }, N = () => {
      const u = (te) => format(te, n.value.format);
      return `${u(a.value[0])} ${n.value.rangeSeparator} ${a.value[1] ? u(a.value[1]) : ""}`;
    }, ae = () => l.value && a.value ? Array.isArray(a.value) ? N() : format(a.value, n.value.format) : H(a.value), y = () => a.value ? h2.value.enabled ? a.value.map((u) => H(u)).join("; ") : n.value.enabled && typeof n.value.format == "string" ? ae() : H(a.value) : "", j = () => {
      !t2.format || typeof t2.format == "string" || n.value.enabled && typeof n.value.format == "string" ? I.value = y() : I.value = t2.format(a.value);
    }, $ = (u) => {
      if (t2.utc) {
        const te = new Date(u);
        return t2.utc === "preserve" ? new Date(te.getTime() + te.getTimezoneOffset() * 6e4) : te;
      }
      return t2.modelType ? pl.includes(t2.modelType) ? m(new Date(u)) : t2.modelType === "format" && (typeof t2.format == "string" || !t2.format) ? m(
        parse(u, f(), /* @__PURE__ */ new Date(), { locale: C.value })
      ) : m(
        parse(u, t2.modelType, /* @__PURE__ */ new Date(), { locale: C.value })
      ) : m(new Date(u));
    }, g = (u) => u ? t2.utc ? Al(u, t2.utc === "preserve", t2.enableSeconds) : t2.modelType ? t2.modelType === "timestamp" ? +P(u) : t2.modelType === "iso" ? P(u).toISOString() : t2.modelType === "format" && (typeof t2.format == "string" || !t2.format) ? H(P(u)) : H(P(u), t2.modelType, true) : P(u) : "", ue = (u, te = false, ye = false) => {
      if (ye) return u;
      if (e("update:model-value", u), c.value.emitTimezone && te) {
        const S = Array.isArray(u) ? u.map((be) => xe(Ee(be), c.value.emitTimezone)) : xe(Ee(u), c.value.emitTimezone);
        e("update:model-timezone-value", S);
      }
    }, B = (u) => Array.isArray(a.value) ? h2.value.enabled ? a.value.map((te) => u(te)) : [
      u(a.value[0]),
      a.value[1] ? u(a.value[1]) : _t(i.value.partialRange)
    ] : u(Ee(a.value)), D = () => {
      if (Array.isArray(a.value)) {
        const u = mt(a.value[0], t2.weekStart), te = a.value[1] ? mt(a.value[1], t2.weekStart) : [];
        return [u.map((ye) => W(ye)), te.map((ye) => W(ye))];
      }
      return mt(a.value, t2.weekStart).map((u) => W(u));
    }, J = (u, te) => ue(Ee(B(u)), false, te), s = (u) => {
      const te = D();
      return u ? te : e("update:model-value", D());
    }, k = (u = false) => (u || j(), t2.monthPicker ? J(U, u) : t2.timePicker ? J(Y, u) : t2.yearPicker ? J(getYear, u) : t2.weekPicker ? s(u) : ue(fe(u), true, u));
    return {
      inputValue: I,
      internalModelValue: a,
      checkBeforeEmit: () => a.value ? i.value.enabled ? i.value.partialRange ? a.value.length >= 1 : a.value.length === 2 : !!a.value : false,
      parseExternalModelValue: p,
      formatInputValue: j,
      emitModelValue: k
    };
  }, Xl = (e, t2) => {
    const { defaultedFilters: l, propDates: a } = _e(e), { validateMonthYearInRange: n } = $t(e), i = (v, C) => {
      let m = v;
      return l.value.months.includes(getMonth(m)) ? (m = C ? addMonths(v, 1) : subMonths(v, 1), i(m, C)) : m;
    }, c = (v, C) => {
      let m = v;
      return l.value.years.includes(getYear(m)) ? (m = C ? addYears(v, 1) : subYears(v, 1), c(m, C)) : m;
    }, h2 = (v, C = false) => {
      const m = set(W(), { month: e.month, year: e.year });
      let P = v ? addMonths(m, 1) : subMonths(m, 1);
      e.disableYearSelect && (P = setYear(P, e.year));
      let H = getMonth(P), Y = getYear(P);
      l.value.months.includes(H) && (P = i(P, v), H = getMonth(P), Y = getYear(P)), l.value.years.includes(Y) && (P = c(P, v), Y = getYear(P)), n(H, Y, v, e.preventMinMaxNavigation) && f(H, Y, C);
    }, f = (v, C, m) => {
      t2("update-month-year", { month: v, year: C, fromNav: m });
    }, I = vue.computed(() => (v) => _n(
      set(W(), { month: e.month, year: e.year }),
      a.value.maxDate,
      a.value.minDate,
      e.preventMinMaxNavigation,
      v
    ));
    return { handleMonthYearChange: h2, isDisabled: I, updateMonthYear: f };
  }, ca = {
    multiCalendars: { type: [Boolean, Number, String, Object], default: void 0 },
    modelValue: { type: [String, Date, Array, Object, Number], default: null },
    modelType: { type: String, default: null },
    position: { type: String, default: "center" },
    dark: { type: Boolean, default: false },
    format: {
      type: [String, Function],
      default: () => null
    },
    autoPosition: { type: [Boolean, String], default: true },
    altPosition: { type: Function, default: null },
    transitions: { type: [Boolean, Object], default: true },
    formatLocale: { type: Object, default: null },
    utc: { type: [Boolean, String], default: false },
    ariaLabels: { type: Object, default: () => ({}) },
    offset: { type: [Number, String], default: 10 },
    hideNavigation: { type: Array, default: () => [] },
    timezone: { type: [String, Object], default: null },
    vertical: { type: Boolean, default: false },
    disableMonthYearSelect: { type: Boolean, default: false },
    disableYearSelect: { type: Boolean, default: false },
    dayClass: {
      type: Function,
      default: null
    },
    yearRange: { type: Array, default: () => [1900, 2100] },
    enableTimePicker: { type: Boolean, default: true },
    autoApply: { type: Boolean, default: false },
    disabledDates: { type: [Array, Function], default: () => [] },
    monthNameFormat: { type: String, default: "short" },
    startDate: { type: [Date, String], default: null },
    startTime: { type: [Object, Array], default: null },
    hideOffsetDates: { type: Boolean, default: false },
    noToday: { type: Boolean, default: false },
    disabledWeekDays: { type: Array, default: () => [] },
    allowedDates: { type: Array, default: null },
    nowButtonLabel: { type: String, default: "Now" },
    markers: { type: Array, default: () => [] },
    escClose: { type: Boolean, default: true },
    spaceConfirm: { type: Boolean, default: true },
    monthChangeOnArrows: { type: Boolean, default: true },
    presetDates: { type: Array, default: () => [] },
    flow: { type: Array, default: () => [] },
    partialFlow: { type: Boolean, default: false },
    preventMinMaxNavigation: { type: Boolean, default: false },
    reverseYears: { type: Boolean, default: false },
    weekPicker: { type: Boolean, default: false },
    filters: { type: Object, default: () => ({}) },
    arrowNavigation: { type: Boolean, default: false },
    highlight: {
      type: [Function, Object],
      default: null
    },
    teleport: { type: [Boolean, String, Object], default: null },
    teleportCenter: { type: Boolean, default: false },
    locale: { type: String, default: "en-Us" },
    weekNumName: { type: String, default: "W" },
    weekStart: { type: [Number, String], default: 1 },
    weekNumbers: {
      type: [String, Function, Object],
      default: null
    },
    monthChangeOnScroll: { type: [Boolean, String], default: true },
    dayNames: {
      type: [Function, Array],
      default: null
    },
    monthPicker: { type: Boolean, default: false },
    customProps: { type: Object, default: null },
    yearPicker: { type: Boolean, default: false },
    modelAuto: { type: Boolean, default: false },
    selectText: { type: String, default: "Select" },
    cancelText: { type: String, default: "Cancel" },
    previewFormat: {
      type: [String, Function],
      default: () => ""
    },
    multiDates: { type: [Object, Boolean], default: false },
    ignoreTimeValidation: { type: Boolean, default: false },
    minDate: { type: [Date, String], default: null },
    maxDate: { type: [Date, String], default: null },
    minTime: { type: Object, default: null },
    maxTime: { type: Object, default: null },
    name: { type: String, default: null },
    placeholder: { type: String, default: "" },
    hideInputIcon: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    state: { type: Boolean, default: null },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: "off" },
    timePicker: { type: Boolean, default: false },
    enableSeconds: { type: Boolean, default: false },
    is24: { type: Boolean, default: true },
    noHoursOverlay: { type: Boolean, default: false },
    noMinutesOverlay: { type: Boolean, default: false },
    noSecondsOverlay: { type: Boolean, default: false },
    hoursGridIncrement: { type: [String, Number], default: 1 },
    minutesGridIncrement: { type: [String, Number], default: 5 },
    secondsGridIncrement: { type: [String, Number], default: 5 },
    hoursIncrement: { type: [Number, String], default: 1 },
    minutesIncrement: { type: [Number, String], default: 1 },
    secondsIncrement: { type: [Number, String], default: 1 },
    range: { type: [Boolean, Object], default: false },
    uid: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    inline: { type: [Boolean, Object], default: false },
    textInput: { type: [Boolean, Object], default: false },
    sixWeeks: { type: [Boolean, String], default: false },
    actionRow: { type: Object, default: () => ({}) },
    focusStartDate: { type: Boolean, default: false },
    disabledTimes: { type: [Function, Array], default: void 0 },
    timePickerInline: { type: Boolean, default: false },
    calendar: { type: Function, default: null },
    config: { type: Object, default: void 0 },
    quarterPicker: { type: Boolean, default: false },
    yearFirst: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    onInternalModelChange: { type: [Function, Object], default: null },
    enableMinutes: { type: Boolean, default: true },
    ui: { type: Object, default: () => ({}) }
  }, it = {
    ...ca,
    shadow: { type: Boolean, default: false },
    flowStep: { type: Number, default: 0 },
    internalModelValue: { type: [Date, Array], default: null },
    noOverlayFocus: { type: Boolean, default: false },
    collapse: { type: Boolean, default: false },
    menuWrapRef: { type: Object, default: null },
    getInputRect: { type: Function, default: () => ({}) },
    isTextInputDate: { type: Boolean, default: false },
    isMobile: { type: Boolean, default: void 0 }
  }, Jl = ["title"], Zl = ["disabled"], xl = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "ActionRow",
    props: {
      menuMount: { type: Boolean, default: false },
      calendarWidth: { type: Number, default: 0 },
      ...it
    },
    emits: ["close-picker", "select-date", "select-now", "invalid-select"],
    setup(e, { emit: t2 }) {
      const l = t2, a = e, {
        defaultedActionRow: n,
        defaultedPreviewFormat: i,
        defaultedMultiCalendars: c,
        defaultedTextInput: h2,
        defaultedInline: f,
        defaultedRange: I,
        defaultedMultiDates: v
      } = _e(a), { isTimeValid: C, isMonthValid: m } = $t(a), { buildMatrix: P } = Mt(), H = vue.ref(null), Y = vue.ref(null), U = vue.ref(false), d = vue.ref({}), R = vue.ref(null), _ = vue.ref(null);
      vue.onMounted(() => {
        a.arrowNavigation && P([Le(H), Le(Y)], "actionRow"), F(), window.addEventListener("resize", F);
      }), vue.onUnmounted(() => {
        window.removeEventListener("resize", F);
      });
      const F = () => {
        U.value = false, setTimeout(() => {
          var ae, y;
          const p = (ae = R.value) == null ? void 0 : ae.getBoundingClientRect(), N = (y = _.value) == null ? void 0 : y.getBoundingClientRect();
          p && N && (d.value.maxWidth = `${N.width - p.width - 20}px`), U.value = true;
        }, 0);
      }, Q = vue.computed(() => I.value.enabled && !I.value.partialRange && a.internalModelValue ? a.internalModelValue.length === 2 : true), ne = vue.computed(
        () => !C.value(a.internalModelValue) || !m.value(a.internalModelValue) || !Q.value
      ), x = () => {
        const p = i.value;
        return a.timePicker || a.monthPicker, p(Ee(a.internalModelValue));
      }, A = () => {
        const p = a.internalModelValue;
        return c.value.count > 0 ? `${X(p[0])} - ${X(p[1])}` : [X(p[0]), X(p[1])];
      }, X = (p) => Bn(
        p,
        i.value,
        a.formatLocale,
        h2.value.rangeSeparator,
        a.modelAuto,
        i.value
      ), O = vue.computed(() => !a.internalModelValue || !a.menuMount ? "" : typeof i.value == "string" ? Array.isArray(a.internalModelValue) ? a.internalModelValue.length === 2 && a.internalModelValue[1] ? A() : v.value.enabled ? a.internalModelValue.map((p) => `${X(p)}`) : a.modelAuto ? `${X(a.internalModelValue[0])}` : `${X(a.internalModelValue[0])} -` : X(a.internalModelValue) : x()), K = () => v.value.enabled ? "; " : " - ", fe = vue.computed(
        () => Array.isArray(O.value) ? O.value.join(K()) : O.value
      ), ve = () => {
        C.value(a.internalModelValue) && m.value(a.internalModelValue) && Q.value ? l("select-date") : l("invalid-select");
      };
      return (p, N) => (vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "actionRowRef",
        ref: _,
        class: "dp__action_row"
      }, [
        p.$slots["action-row"] ? vue.renderSlot(p.$slots, "action-row", vue.normalizeProps(vue.mergeProps({ key: 0 }, {
          internalModelValue: p.internalModelValue,
          disabled: ne.value,
          selectDate: () => p.$emit("select-date"),
          closePicker: () => p.$emit("close-picker")
        }))) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
          vue.unref(n).showPreview ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "dp__selection_preview",
            title: fe.value,
            style: vue.normalizeStyle(d.value)
          }, [
            p.$slots["action-preview"] && U.value ? vue.renderSlot(p.$slots, "action-preview", {
              key: 0,
              value: p.internalModelValue
            }) : vue.createCommentVNode("", true),
            !p.$slots["action-preview"] && U.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              vue.createTextVNode(vue.toDisplayString(fe.value), 1)
            ], 64)) : vue.createCommentVNode("", true)
          ], 12, Jl)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            ref_key: "actionBtnContainer",
            ref: R,
            class: "dp__action_buttons",
            "data-dp-element": "action-row"
          }, [
            p.$slots["action-buttons"] ? vue.renderSlot(p.$slots, "action-buttons", {
              key: 0,
              value: p.internalModelValue
            }) : vue.createCommentVNode("", true),
            p.$slots["action-buttons"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              !vue.unref(f).enabled && vue.unref(n).showCancel ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                ref_key: "cancelButtonRef",
                ref: H,
                type: "button",
                class: "dp__action_button dp__action_cancel",
                onClick: N[0] || (N[0] = (ae) => p.$emit("close-picker")),
                onKeydown: N[1] || (N[1] = (ae) => vue.unref(Xe)(ae, () => p.$emit("close-picker")))
              }, vue.toDisplayString(p.cancelText), 545)) : vue.createCommentVNode("", true),
              vue.unref(n).showNow ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                type: "button",
                class: "dp__action_button dp__action_cancel",
                onClick: N[2] || (N[2] = (ae) => p.$emit("select-now")),
                onKeydown: N[3] || (N[3] = (ae) => vue.unref(Xe)(ae, () => p.$emit("select-now")))
              }, vue.toDisplayString(p.nowButtonLabel), 33)) : vue.createCommentVNode("", true),
              vue.unref(n).showSelect ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 2,
                ref_key: "selectButtonRef",
                ref: Y,
                type: "button",
                class: "dp__action_button dp__action_select",
                disabled: ne.value,
                "data-test-id": "select-button",
                onKeydown: N[4] || (N[4] = (ae) => vue.unref(Xe)(ae, () => ve())),
                onClick: ve
              }, vue.toDisplayString(p.selectText), 41, Zl)) : vue.createCommentVNode("", true)
            ], 64))
          ], 512)
        ], 64))
      ], 512));
    }
  }), er = ["role", "aria-label", "tabindex"], tr = { class: "dp__selection_grid_header" }, ar = ["aria-selected", "aria-disabled", "data-test-id", "onClick", "onKeydown", "onMouseover"], nr = ["aria-label"], Jt = /* @__PURE__ */ vue.defineComponent({
    __name: "SelectionOverlay",
    props: {
      items: {},
      type: {},
      isLast: { type: Boolean },
      arrowNavigation: { type: Boolean },
      skipButtonRef: { type: Boolean },
      headerRefs: {},
      hideNavigation: {},
      escClose: { type: Boolean },
      useRelative: { type: Boolean },
      height: {},
      textInput: { type: [Boolean, Object] },
      config: {},
      noOverlayFocus: { type: Boolean },
      focusValue: {},
      menuWrapRef: {},
      ariaLabels: {},
      overlayLabel: {}
    },
    emits: ["selected", "toggle", "reset-flow", "hover-value"],
    setup(e, { expose: t2, emit: l }) {
      const { setSelectionGrid: a, buildMultiLevelMatrix: n, setMonthPicker: i } = Mt(), c = l, h2 = e, { defaultedAriaLabels: f, defaultedTextInput: I, defaultedConfig: v } = _e(
        h2
      ), { hideNavigationButtons: C } = ma(), m = vue.ref(false), P = vue.ref(null), H = vue.ref(null), Y = vue.ref([]), U = vue.ref(), d = vue.ref(null), R = vue.ref(0), _ = vue.ref(null);
      vue.onBeforeUpdate(() => {
        P.value = null;
      }), vue.onMounted(() => {
        vue.nextTick().then(() => K()), h2.noOverlayFocus || Q(), F(true);
      }), vue.onUnmounted(() => F(false));
      const F = (B) => {
        var D;
        h2.arrowNavigation && ((D = h2.headerRefs) != null && D.length ? i(B) : a(B));
      }, Q = () => {
        var D;
        const B = Le(H);
        B && (I.value.enabled || (P.value ? (D = P.value) == null || D.focus({ preventScroll: true }) : B.focus({ preventScroll: true })), m.value = B.clientHeight < B.scrollHeight);
      }, ne = vue.computed(
        () => ({
          dp__overlay: true,
          "dp--overlay-absolute": !h2.useRelative,
          "dp--overlay-relative": h2.useRelative
        })
      ), x = vue.computed(
        () => h2.useRelative ? { height: `${h2.height}px`, width: "var(--dp-menu-min-width)" } : void 0
      ), A = vue.computed(() => ({
        dp__overlay_col: true
      })), X = vue.computed(
        () => ({
          dp__btn: true,
          dp__button: true,
          dp__overlay_action: true,
          dp__over_action_scroll: m.value,
          dp__button_bottom: h2.isLast
        })
      ), O = vue.computed(() => {
        var B, D;
        return {
          dp__overlay_container: true,
          dp__container_flex: ((B = h2.items) == null ? void 0 : B.length) <= 6,
          dp__container_block: ((D = h2.items) == null ? void 0 : D.length) > 6
        };
      });
      vue.watch(
        () => h2.items,
        () => K(false),
        { deep: true }
      );
      const K = (B = true) => {
        vue.nextTick().then(() => {
          const D = Le(P), J = Le(H), s = Le(d), k = Le(_), E = s ? s.getBoundingClientRect().height : 0;
          J && (J.getBoundingClientRect().height ? R.value = J.getBoundingClientRect().height - E : R.value = v.value.modeHeight - E), D && k && B && (k.scrollTop = D.offsetTop - k.offsetTop - (R.value / 2 - D.getBoundingClientRect().height) - E);
        });
      }, fe = (B) => {
        B.disabled || c("selected", B.value);
      }, ve = () => {
        c("toggle"), c("reset-flow");
      }, p = () => {
        h2.escClose && ve();
      }, N = (B, D, J, s) => {
        B && ((D.active || D.value === h2.focusValue) && (P.value = B), h2.arrowNavigation && (Array.isArray(Y.value[J]) ? Y.value[J][s] = B : Y.value[J] = [B], ae()));
      }, ae = () => {
        var D, J;
        const B = (D = h2.headerRefs) != null && D.length ? [h2.headerRefs].concat(Y.value) : Y.value.concat([h2.skipButtonRef ? [] : [d.value]]);
        n(Ee(B), (J = h2.headerRefs) != null && J.length ? "monthPicker" : "selectionGrid");
      }, y = (B) => {
        h2.arrowNavigation || kt(B, v.value, true);
      }, j = (B) => {
        U.value = B, c("hover-value", B);
      }, $ = () => {
        if (ve(), !h2.isLast) {
          const B = Ea(h2.menuWrapRef ?? null, "action-row");
          if (B) {
            const D = Tn(B);
            D == null || D.focus();
          }
        }
      }, g = (B) => {
        switch (B.key) {
          case Ce.esc:
            return p();
          case Ce.arrowLeft:
            return y(B);
          case Ce.arrowRight:
            return y(B);
          case Ce.arrowUp:
            return y(B);
          case Ce.arrowDown:
            return y(B);
          default:
            return;
        }
      }, ue = (B) => {
        if (B.key === Ce.enter) return ve();
        if (B.key === Ce.tab) return $();
      };
      return t2({ focusGrid: Q }), (B, D) => {
        var J;
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "gridWrapRef",
          ref: H,
          class: vue.normalizeClass(ne.value),
          style: vue.normalizeStyle(x.value),
          role: B.useRelative ? void 0 : "dialog",
          "aria-label": B.overlayLabel,
          tabindex: B.useRelative ? void 0 : "0",
          onKeydown: g,
          onClick: D[0] || (D[0] = vue.withModifiers(() => {
          }, ["prevent"]))
        }, [
          vue.createElementVNode("div", {
            ref_key: "containerRef",
            ref: _,
            class: vue.normalizeClass(O.value),
            style: vue.normalizeStyle({ "--dp-overlay-height": `${R.value}px` }),
            role: "grid"
          }, [
            vue.createElementVNode("div", tr, [
              vue.renderSlot(B.$slots, "header")
            ]),
            B.$slots.overlay ? vue.renderSlot(B.$slots, "overlay", { key: 0 }) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(B.items, (s, k) => (vue.openBlock(), vue.createElementBlock("div", {
              key: k,
              class: vue.normalizeClass(["dp__overlay_row", { dp__flex_row: B.items.length >= 3 }]),
              role: "row"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(s, (E, u) => (vue.openBlock(), vue.createElementBlock("div", {
                key: E.value,
                ref_for: true,
                ref: (te) => N(te, E, k, u),
                role: "gridcell",
                class: vue.normalizeClass(A.value),
                "aria-selected": E.active || void 0,
                "aria-disabled": E.disabled || void 0,
                tabindex: "0",
                "data-test-id": E.text,
                onClick: vue.withModifiers((te) => fe(E), ["prevent"]),
                onKeydown: (te) => vue.unref(Xe)(te, () => fe(E), true),
                onMouseover: (te) => j(E.value)
              }, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(E.className)
                }, [
                  B.$slots.item ? vue.renderSlot(B.$slots, "item", {
                    key: 0,
                    item: E
                  }) : vue.createCommentVNode("", true),
                  B.$slots.item ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    vue.createTextVNode(vue.toDisplayString(E.text), 1)
                  ], 64))
                ], 2)
              ], 42, ar))), 128))
            ], 2))), 128))
          ], 6),
          B.$slots["button-icon"] ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            ref_key: "toggleButton",
            ref: d,
            type: "button",
            "aria-label": (J = vue.unref(f)) == null ? void 0 : J.toggleOverlay,
            class: vue.normalizeClass(X.value),
            tabindex: "0",
            onClick: ve,
            onKeydown: ue
          }, [
            vue.renderSlot(B.$slots, "button-icon")
          ], 42, nr)), [
            [vue.vShow, !vue.unref(C)(B.hideNavigation, B.type)]
          ]) : vue.createCommentVNode("", true)
        ], 46, er);
      };
    }
  }), lr = ["data-dp-mobile"], fa = /* @__PURE__ */ vue.defineComponent({
    __name: "InstanceWrap",
    props: {
      multiCalendars: {},
      stretch: { type: Boolean },
      collapse: { type: Boolean },
      isMobile: { type: Boolean }
    },
    setup(e) {
      const t2 = e, l = vue.computed(
        () => t2.multiCalendars > 0 ? [...Array(t2.multiCalendars).keys()] : [0]
      ), a = vue.computed(() => ({
        dp__instance_calendar: t2.multiCalendars > 0
      }));
      return (n, i) => (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass({
          dp__menu_inner: !n.stretch,
          "dp--menu--inner-stretched": n.stretch,
          dp__flex_display: n.multiCalendars > 0,
          "dp--flex-display-collapsed": n.collapse
        }),
        "data-dp-mobile": n.isMobile
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(l.value, (c, h2) => (vue.openBlock(), vue.createElementBlock("div", {
          key: c,
          class: vue.normalizeClass(a.value)
        }, [
          vue.renderSlot(n.$slots, "default", {
            instance: c,
            index: h2
          })
        ], 2))), 128))
      ], 10, lr));
    }
  }), rr = ["data-dp-element", "aria-label", "aria-disabled"], Wt = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "ArrowBtn",
    props: {
      ariaLabel: {},
      elName: {},
      disabled: { type: Boolean }
    },
    emits: ["activate", "set-ref"],
    setup(e, { emit: t2 }) {
      const l = t2, a = vue.ref(null);
      return vue.onMounted(() => l("set-ref", a)), (n, i) => (vue.openBlock(), vue.createElementBlock("button", {
        ref_key: "elRef",
        ref: a,
        type: "button",
        "data-dp-element": n.elName,
        class: "dp__btn dp--arrow-btn-nav",
        tabindex: "0",
        "aria-label": n.ariaLabel,
        "aria-disabled": n.disabled || void 0,
        onClick: i[0] || (i[0] = (c) => n.$emit("activate")),
        onKeydown: i[1] || (i[1] = (c) => vue.unref(Xe)(c, () => n.$emit("activate"), true))
      }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(["dp__inner_nav", { dp__inner_nav_disabled: n.disabled }])
        }, [
          vue.renderSlot(n.$slots, "default")
        ], 2)
      ], 40, rr));
    }
  }), or = ["aria-label", "data-test-id"], En = /* @__PURE__ */ vue.defineComponent({
    __name: "YearModePicker",
    props: {
      ...it,
      showYearPicker: { type: Boolean, default: false },
      items: { type: Array, default: () => [] },
      instance: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      isDisabled: { type: Function, default: () => false }
    },
    emits: ["toggle-year-picker", "year-select", "handle-year"],
    setup(e, { emit: t2 }) {
      const l = t2, a = e, { showRightIcon: n, showLeftIcon: i } = ma(), { defaultedConfig: c, defaultedMultiCalendars: h2, defaultedAriaLabels: f, defaultedTransitions: I, defaultedUI: v } = _e(a), { showTransition: C, transitionName: m } = Zt(I), P = vue.ref(false), H = (d = false, R) => {
        P.value = !P.value, l("toggle-year-picker", { flow: d, show: R });
      }, Y = (d) => {
        P.value = false, l("year-select", d);
      }, U = (d = false) => {
        l("handle-year", d);
      };
      return (d, R) => {
        var _, F, Q, ne, x;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["dp--year-mode-picker", { "dp--hidden-el": P.value }])
          }, [
            vue.unref(i)(vue.unref(h2), e.instance) ? (vue.openBlock(), vue.createBlock(Wt, {
              key: 0,
              ref: "mpPrevIconRef",
              "aria-label": (_ = vue.unref(f)) == null ? void 0 : _.prevYear,
              disabled: e.isDisabled(false),
              class: vue.normalizeClass((F = vue.unref(v)) == null ? void 0 : F.navBtnPrev),
              onActivate: R[0] || (R[0] = (A) => U(false))
            }, {
              default: vue.withCtx(() => [
                d.$slots["arrow-left"] ? vue.renderSlot(d.$slots, "arrow-left", { key: 0 }) : vue.createCommentVNode("", true),
                d.$slots["arrow-left"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(za), { key: 1 }))
              ]),
              _: 3
            }, 8, ["aria-label", "disabled", "class"])) : vue.createCommentVNode("", true),
            vue.createElementVNode("button", {
              ref: "mpYearButtonRef",
              class: "dp__btn dp--year-select",
              type: "button",
              "aria-label": `${e.year}-${(Q = vue.unref(f)) == null ? void 0 : Q.openYearsOverlay}`,
              "data-test-id": `year-mode-btn-${e.instance}`,
              onClick: R[1] || (R[1] = () => H(false)),
              onKeydown: R[2] || (R[2] = vue.withKeys(() => H(false), ["enter"]))
            }, [
              d.$slots.year ? vue.renderSlot(d.$slots, "year", {
                key: 0,
                year: e.year
              }) : vue.createCommentVNode("", true),
              d.$slots.year ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                vue.createTextVNode(vue.toDisplayString(e.year), 1)
              ], 64))
            ], 40, or),
            vue.unref(n)(vue.unref(h2), e.instance) ? (vue.openBlock(), vue.createBlock(Wt, {
              key: 1,
              ref: "mpNextIconRef",
              "aria-label": (ne = vue.unref(f)) == null ? void 0 : ne.nextYear,
              disabled: e.isDisabled(true),
              class: vue.normalizeClass((x = vue.unref(v)) == null ? void 0 : x.navBtnNext),
              onActivate: R[3] || (R[3] = (A) => U(true))
            }, {
              default: vue.withCtx(() => [
                d.$slots["arrow-right"] ? vue.renderSlot(d.$slots, "arrow-right", { key: 0 }) : vue.createCommentVNode("", true),
                d.$slots["arrow-right"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(Ha), { key: 1 }))
              ]),
              _: 3
            }, 8, ["aria-label", "disabled", "class"])) : vue.createCommentVNode("", true)
          ], 2),
          vue.createVNode(vue.Transition, {
            name: vue.unref(m)(e.showYearPicker),
            css: vue.unref(C)
          }, {
            default: vue.withCtx(() => {
              var A, X;
              return [
                e.showYearPicker ? (vue.openBlock(), vue.createBlock(Jt, {
                  key: 0,
                  items: e.items,
                  "text-input": d.textInput,
                  "esc-close": d.escClose,
                  config: d.config,
                  "is-last": d.autoApply && !vue.unref(c).keepActionRow,
                  "hide-navigation": d.hideNavigation,
                  "aria-labels": d.ariaLabels,
                  "overlay-label": (X = (A = vue.unref(f)) == null ? void 0 : A.yearPicker) == null ? void 0 : X.call(A, true),
                  type: "year",
                  onToggle: H,
                  onSelected: R[4] || (R[4] = (O) => Y(O))
                }, vue.createSlots({
                  "button-icon": vue.withCtx(() => [
                    d.$slots["calendar-icon"] ? vue.renderSlot(d.$slots, "calendar-icon", { key: 0 }) : vue.createCommentVNode("", true),
                    d.$slots["calendar-icon"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(zt), { key: 1 }))
                  ]),
                  _: 2
                }, [
                  d.$slots["year-overlay-value"] ? {
                    name: "item",
                    fn: vue.withCtx(({ item: O }) => [
                      vue.renderSlot(d.$slots, "year-overlay-value", {
                        text: O.text,
                        value: O.value
                      })
                    ]),
                    key: "0"
                  } : void 0
                ]), 1032, ["items", "text-input", "esc-close", "config", "is-last", "hide-navigation", "aria-labels", "overlay-label"])) : vue.createCommentVNode("", true)
              ];
            }),
            _: 3
          }, 8, ["name", "css"])
        ], 64);
      };
    }
  }), Xa = (e, t2, l) => {
    if (t2.value && Array.isArray(t2.value))
      if (t2.value.some((a) => Ae(e, a))) {
        const a = t2.value.filter((n) => !Ae(n, e));
        t2.value = a.length ? a : null;
      } else (l && +l > t2.value.length || !l) && t2.value.push(e);
    else
      t2.value = [e];
  }, Ja = (e, t2, l) => {
    let a = e.value ? e.value.slice() : [];
    return a.length === 2 && a[1] !== null && (a = []), a.length ? (Be(t2, a[0]) ? a.unshift(t2) : a[1] = t2, l("range-end", t2)) : (a = [t2], l("range-start", t2)), a;
  }, va = (e, t2, l, a) => {
    e && (e[0] && e[1] && l && t2("auto-apply"), e[0] && !e[1] && a && l && t2("auto-apply"));
  }, Fn = (e) => {
    Array.isArray(e.value) && e.value.length <= 2 && e.range ? e.modelValue.value = e.value.map((t2) => xe(W(t2), e.timezone)) : Array.isArray(e.value) || (e.modelValue.value = xe(W(e.value), e.timezone));
  }, Ln = (e, t2, l, a) => Array.isArray(t2.value) && (t2.value.length === 2 || t2.value.length === 1 && a.value.partialRange) ? a.value.fixedStart && (Ne(e, t2.value[0]) || Ae(e, t2.value[0])) ? [t2.value[0], e] : a.value.fixedEnd && (Be(e, t2.value[1]) || Ae(e, t2.value[1])) ? [e, t2.value[1]] : (l("invalid-fixed-range", e), t2.value) : [], zn = ({
    multiCalendars: e,
    range: t2,
    highlight: l,
    propDates: a,
    calendars: n,
    modelValue: i,
    props: c,
    filters: h2,
    year: f,
    month: I,
    emit: v
  }) => {
    const C = vue.computed(() => Ka(c.yearRange, c.locale, c.reverseYears)), m = vue.ref([false]), P = vue.computed(() => (O, K) => {
      const fe = set(ut(/* @__PURE__ */ new Date()), {
        month: I.value(O),
        year: f.value(O)
      }), ve = K ? endOfYear(fe) : startOfYear(fe);
      return _n(
        ve,
        a.value.maxDate,
        a.value.minDate,
        c.preventMinMaxNavigation,
        K
      );
    }), H = () => Array.isArray(i.value) && e.value.solo && i.value[1], Y = () => {
      for (let O = 0; O < e.value.count; O++)
        if (O === 0)
          n.value[O] = n.value[0];
        else if (O === e.value.count - 1 && H())
          n.value[O] = {
            month: getMonth(i.value[1]),
            year: getYear(i.value[1])
          };
        else {
          const K = set(W(), n.value[O - 1]);
          n.value[O] = { month: getMonth(K), year: getYear(addYears(K, 1)) };
        }
    }, U = (O) => {
      if (!O) return Y();
      const K = set(W(), n.value[O]);
      return n.value[0].year = getYear(subYears(K, e.value.count - 1)), Y();
    }, d = (O, K) => {
      const fe = differenceInYears(K, O);
      return t2.value.showLastInRange && fe > 1 ? K : O;
    }, R = (O) => c.focusStartDate || e.value.solo ? O[0] : O[1] ? d(O[0], O[1]) : O[0], _ = () => {
      if (i.value) {
        const O = Array.isArray(i.value) ? R(i.value) : i.value;
        n.value[0] = { month: getMonth(O), year: getYear(O) };
      }
    }, F = () => {
      _(), e.value.count && Y();
    };
    vue.watch(i, (O, K) => {
      c.isTextInputDate && JSON.stringify(O ?? {}) !== JSON.stringify(K ?? {}) && F();
    }), vue.onMounted(() => {
      F();
    });
    const Q = (O, K) => {
      n.value[K].year = O, v("update-month-year", { instance: K, year: O, month: n.value[K].month }), e.value.count && !e.value.solo && U(K);
    }, ne = vue.computed(() => (O) => Et(C.value, (K) => {
      var N;
      const fe = f.value(O) === K.value, ve = Qt(
        K.value,
        Ft(a.value.minDate),
        Ft(a.value.maxDate)
      ) || ((N = h2.value.years) == null ? void 0 : N.includes(f.value(O))), p = qa(l.value, K.value);
      return { active: fe, disabled: ve, highlighted: p };
    })), x = (O, K) => {
      Q(O, K), X(K);
    }, A = (O, K = false) => {
      if (!P.value(O, K)) {
        const fe = K ? f.value(O) + 1 : f.value(O) - 1;
        Q(fe, O);
      }
    }, X = (O, K = false, fe) => {
      K || v("reset-flow"), fe !== void 0 ? m.value[O] = fe : m.value[O] = !m.value[O], m.value[O] ? v("overlay-toggle", { open: true, overlay: je.year }) : (v("overlay-closed"), v("overlay-toggle", { open: false, overlay: je.year }));
    };
    return {
      isDisabled: P,
      groupedYears: ne,
      showYearPicker: m,
      selectYear: Q,
      toggleYearPicker: X,
      handleYearSelect: x,
      handleYear: A
    };
  }, sr = (e, t2) => {
    const {
      defaultedMultiCalendars: l,
      defaultedAriaLabels: a,
      defaultedTransitions: n,
      defaultedConfig: i,
      defaultedRange: c,
      defaultedHighlight: h2,
      propDates: f,
      defaultedTz: I,
      defaultedFilters: v,
      defaultedMultiDates: C
    } = _e(e), m = () => {
      e.isTextInputDate && F(getYear(W(e.startDate)), 0);
    }, { modelValue: P, year: H, month: Y, calendars: U } = xt(e, t2, m), d = vue.computed(() => $n(e.formatLocale, e.locale, e.monthNameFormat)), R = vue.ref(null), { checkMinMaxRange: _ } = $t(e), {
      selectYear: F,
      groupedYears: Q,
      showYearPicker: ne,
      toggleYearPicker: x,
      handleYearSelect: A,
      handleYear: X,
      isDisabled: O
    } = zn({
      modelValue: P,
      multiCalendars: l,
      range: c,
      highlight: h2,
      calendars: U,
      year: H,
      propDates: f,
      month: Y,
      filters: v,
      props: e,
      emit: t2
    });
    vue.onMounted(() => {
      e.startDate && (P.value && e.focusStartDate || !P.value) && F(getYear(W(e.startDate)), 0);
    });
    const K = (k) => k ? { month: getMonth(k), year: getYear(k) } : { month: null, year: null }, fe = () => P.value ? Array.isArray(P.value) ? P.value.map((k) => K(k)) : K(P.value) : K(), ve = (k, E) => {
      const u = U.value[k], te = fe();
      return Array.isArray(te) ? te.some((ye) => ye.year === (u == null ? void 0 : u.year) && ye.month === E) : (u == null ? void 0 : u.year) === te.year && E === te.month;
    }, p = (k, E, u) => {
      var ye, S;
      const te = fe();
      return Array.isArray(te) ? H.value(E) === ((ye = te[u]) == null ? void 0 : ye.year) && k === ((S = te[u]) == null ? void 0 : S.month) : false;
    }, N = (k, E) => {
      if (c.value.enabled) {
        const u = fe();
        if (Array.isArray(P.value) && Array.isArray(u)) {
          const te = p(k, E, 0) || p(k, E, 1), ye = pt(ut(W()), k, H.value(E));
          return da(P.value, R.value, ye) && !te;
        }
        return false;
      }
      return false;
    }, ae = vue.computed(() => (k) => Et(d.value, (E) => {
      var be;
      const u = ve(k, E.value), te = Qt(
        E.value,
        Pn(H.value(k), f.value.minDate),
        Rn(H.value(k), f.value.maxDate)
      ) || Cl(f.value.disabledDates, H.value(k)).includes(E.value) || ((be = v.value.months) == null ? void 0 : be.includes(E.value)) || !Ol(f.value.allowedDates, H.value(k), E.value), ye = N(E.value, k), S = Yn(h2.value, E.value, H.value(k));
      return { active: u, disabled: te, isBetween: ye, highlighted: S };
    })), y = (k, E) => pt(ut(W()), k, H.value(E)), j = (k, E) => {
      const u = P.value ? P.value : ut(/* @__PURE__ */ new Date());
      P.value = pt(u, k, H.value(E)), t2("auto-apply"), t2("update-flow-step");
    }, $ = (k, E) => {
      const u = y(k, E);
      c.value.fixedEnd || c.value.fixedStart ? P.value = Ln(u, P, t2, c) : P.value ? _(u, P.value) && (P.value = Ja(P, y(k, E), t2)) : P.value = [y(k, E)], vue.nextTick().then(() => {
        va(P.value, t2, e.autoApply, e.modelAuto);
      });
    }, g = (k, E) => {
      Xa(y(k, E), P, C.value.limit), t2("auto-apply", true);
    }, ue = (k, E) => (U.value[E].month = k, D(E, U.value[E].year, k), C.value.enabled ? g(k, E) : c.value.enabled ? $(k, E) : j(k, E)), B = (k, E) => {
      F(k, E), D(E, k, null);
    }, D = (k, E, u) => {
      let te = u;
      if (!te && te !== 0) {
        const ye = fe();
        te = Array.isArray(ye) ? ye[k].month : ye.month;
      }
      t2("update-month-year", { instance: k, year: E, month: te });
    };
    return {
      groupedMonths: ae,
      groupedYears: Q,
      year: H,
      isDisabled: O,
      defaultedMultiCalendars: l,
      defaultedAriaLabels: a,
      defaultedTransitions: n,
      defaultedConfig: i,
      showYearPicker: ne,
      modelValue: P,
      presetDate: (k, E) => {
        Fn({
          value: k,
          modelValue: P,
          range: c.value.enabled,
          timezone: E ? void 0 : I.value.timezone
        }), t2("auto-apply");
      },
      setHoverDate: (k, E) => {
        R.value = y(k, E);
      },
      selectMonth: ue,
      selectYear: B,
      toggleYearPicker: x,
      handleYearSelect: A,
      handleYear: X,
      getModelMonthYear: fe
    };
  }, ur = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "MonthPicker",
    props: {
      ...it
    },
    emits: [
      "update:internal-model-value",
      "overlay-closed",
      "reset-flow",
      "range-start",
      "range-end",
      "auto-apply",
      "update-month-year",
      "update-flow-step",
      "mount",
      "invalid-fixed-range",
      "overlay-toggle"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = vue.useSlots(), i = et(n, "yearMode"), c = e;
      vue.onMounted(() => {
        c.shadow || a("mount", null);
      });
      const {
        groupedMonths: h2,
        groupedYears: f,
        year: I,
        isDisabled: v,
        defaultedMultiCalendars: C,
        defaultedConfig: m,
        showYearPicker: P,
        modelValue: H,
        presetDate: Y,
        setHoverDate: U,
        selectMonth: d,
        selectYear: R,
        toggleYearPicker: _,
        handleYearSelect: F,
        handleYear: Q,
        getModelMonthYear: ne
      } = sr(c, a);
      return t2({ getSidebarProps: () => ({
        modelValue: H,
        year: I,
        getModelMonthYear: ne,
        selectMonth: d,
        selectYear: R,
        handleYear: Q
      }), presetDate: Y, toggleYearPicker: (A) => _(0, A) }), (A, X) => (vue.openBlock(), vue.createBlock(fa, {
        "multi-calendars": vue.unref(C).count,
        collapse: A.collapse,
        stretch: "",
        "is-mobile": A.isMobile
      }, {
        default: vue.withCtx(({ instance: O }) => [
          A.$slots["top-extra"] ? vue.renderSlot(A.$slots, "top-extra", {
            key: 0,
            value: A.internalModelValue
          }) : vue.createCommentVNode("", true),
          A.$slots["month-year"] ? vue.renderSlot(A.$slots, "month-year", vue.normalizeProps(vue.mergeProps({ key: 1 }, {
            year: vue.unref(I),
            months: vue.unref(h2)(O),
            years: vue.unref(f)(O),
            selectMonth: vue.unref(d),
            selectYear: vue.unref(R),
            instance: O
          }))) : (vue.openBlock(), vue.createBlock(Jt, {
            key: 2,
            items: vue.unref(h2)(O),
            "arrow-navigation": A.arrowNavigation,
            "is-last": A.autoApply && !vue.unref(m).keepActionRow,
            "esc-close": A.escClose,
            height: vue.unref(m).modeHeight,
            config: A.config,
            "no-overlay-focus": !!(A.noOverlayFocus || A.textInput),
            "use-relative": "",
            type: "month",
            onSelected: (K) => vue.unref(d)(K, O),
            onHoverValue: (K) => vue.unref(U)(K, O)
          }, vue.createSlots({
            header: vue.withCtx(() => [
              vue.createVNode(En, vue.mergeProps(A.$props, {
                items: vue.unref(f)(O),
                instance: O,
                "show-year-picker": vue.unref(P)[O],
                year: vue.unref(I)(O),
                "is-disabled": (K) => vue.unref(v)(O, K),
                onHandleYear: (K) => vue.unref(Q)(O, K),
                onYearSelect: (K) => vue.unref(F)(K, O),
                onToggleYearPicker: (K) => vue.unref(_)(O, K == null ? void 0 : K.flow, K == null ? void 0 : K.show)
              }), vue.createSlots({ _: 2 }, [
                vue.renderList(vue.unref(i), (K, fe) => ({
                  name: K,
                  fn: vue.withCtx((ve) => [
                    vue.renderSlot(A.$slots, K, vue.normalizeProps(vue.guardReactiveProps(ve)))
                  ])
                }))
              ]), 1040, ["items", "instance", "show-year-picker", "year", "is-disabled", "onHandleYear", "onYearSelect", "onToggleYearPicker"])
            ]),
            _: 2
          }, [
            A.$slots["month-overlay-value"] ? {
              name: "item",
              fn: vue.withCtx(({ item: K }) => [
                vue.renderSlot(A.$slots, "month-overlay-value", {
                  text: K.text,
                  value: K.value
                })
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["items", "arrow-navigation", "is-last", "esc-close", "height", "config", "no-overlay-focus", "onSelected", "onHoverValue"]))
        ]),
        _: 3
      }, 8, ["multi-calendars", "collapse", "is-mobile"]));
    }
  }), ir = (e, t2) => {
    const l = () => {
      e.isTextInputDate && (v.value = getYear(W(e.startDate)));
    }, { modelValue: a } = xt(e, t2, l), n = vue.ref(null), { defaultedHighlight: i, defaultedMultiDates: c, defaultedFilters: h2, defaultedRange: f, propDates: I } = _e(e), v = vue.ref();
    vue.onMounted(() => {
      e.startDate && (a.value && e.focusStartDate || !a.value) && (v.value = getYear(W(e.startDate)));
    });
    const C = (d) => Array.isArray(a.value) ? a.value.some((R) => getYear(R) === d) : a.value ? getYear(a.value) === d : false, m = (d) => f.value.enabled && Array.isArray(a.value) ? da(a.value, n.value, H(d)) : false, P = vue.computed(() => Et(Ka(e.yearRange, e.locale, e.reverseYears), (d) => {
      const R = C(d.value), _ = Qt(
        d.value,
        Ft(I.value.minDate),
        Ft(I.value.maxDate)
      ) || h2.value.years.includes(d.value), F = m(d.value) && !R, Q = qa(i.value, d.value);
      return { active: R, disabled: _, isBetween: F, highlighted: Q };
    })), H = (d) => setYear(ut(startOfYear(/* @__PURE__ */ new Date())), d);
    return {
      groupedYears: P,
      modelValue: a,
      focusYear: v,
      setHoverValue: (d) => {
        n.value = setYear(ut(/* @__PURE__ */ new Date()), d);
      },
      selectYear: (d) => {
        var R;
        if (t2("update-month-year", { instance: 0, year: d }), c.value.enabled)
          return a.value ? Array.isArray(a.value) && (((R = a.value) == null ? void 0 : R.map((F) => getYear(F))).includes(d) ? a.value = a.value.filter((F) => getYear(F) !== d) : a.value.push(setYear(Je(W()), d))) : a.value = [setYear(Je(startOfYear(W())), d)], t2("auto-apply", true);
        f.value.enabled ? (a.value = Ja(a, H(d), t2), vue.nextTick().then(() => {
          va(a.value, t2, e.autoApply, e.modelAuto);
        })) : (a.value = H(d), t2("auto-apply"));
      }
    };
  }, dr = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "YearPicker",
    props: {
      ...it
    },
    emits: [
      "update:internal-model-value",
      "reset-flow",
      "range-start",
      "range-end",
      "auto-apply",
      "update-month-year"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, { groupedYears: i, modelValue: c, focusYear: h2, selectYear: f, setHoverValue: I } = ir(n, a), { defaultedConfig: v } = _e(n);
      return t2({ getSidebarProps: () => ({
        modelValue: c,
        selectYear: f
      }) }), (m, P) => (vue.openBlock(), vue.createElementBlock("div", null, [
        m.$slots["top-extra"] ? vue.renderSlot(m.$slots, "top-extra", {
          key: 0,
          value: m.internalModelValue
        }) : vue.createCommentVNode("", true),
        m.$slots["month-year"] ? vue.renderSlot(m.$slots, "month-year", vue.normalizeProps(vue.mergeProps({ key: 1 }, {
          years: vue.unref(i),
          selectYear: vue.unref(f)
        }))) : (vue.openBlock(), vue.createBlock(Jt, {
          key: 2,
          items: vue.unref(i),
          "is-last": m.autoApply && !vue.unref(v).keepActionRow,
          height: vue.unref(v).modeHeight,
          config: m.config,
          "no-overlay-focus": !!(m.noOverlayFocus || m.textInput),
          "focus-value": vue.unref(h2),
          type: "year",
          "use-relative": "",
          onSelected: vue.unref(f),
          onHoverValue: vue.unref(I)
        }, vue.createSlots({ _: 2 }, [
          m.$slots["year-overlay-value"] ? {
            name: "item",
            fn: vue.withCtx(({ item: H }) => [
              vue.renderSlot(m.$slots, "year-overlay-value", {
                text: H.text,
                value: H.value
              })
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["items", "is-last", "height", "config", "no-overlay-focus", "focus-value", "onSelected", "onHoverValue"]))
      ]));
    }
  }), cr = {
    key: 0,
    class: "dp__time_input"
  }, fr = ["data-compact", "data-collapsed"], vr = ["data-test-id", "aria-label", "onKeydown", "onClick", "onMousedown"], mr = ["aria-label", "disabled", "data-test-id", "onKeydown", "onClick"], pr = ["data-test-id", "aria-label", "onKeydown", "onClick", "onMousedown"], yr = { key: 0 }, gr = ["aria-label", "data-compact"], hr = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "TimeInput",
    props: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
      seconds: { type: Number, default: 0 },
      closeTimePickerBtn: { type: Object, default: null },
      order: { type: Number, default: 0 },
      disabledTimesConfig: { type: Function, default: null },
      validateTime: { type: Function, default: () => false },
      ...it
    },
    emits: [
      "set-hours",
      "set-minutes",
      "update:hours",
      "update:minutes",
      "update:seconds",
      "reset-flow",
      "mounted",
      "overlay-closed",
      "overlay-opened",
      "am-pm-change"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, { setTimePickerElements: i, setTimePickerBackRef: c } = Mt(), {
        defaultedAriaLabels: h2,
        defaultedTransitions: f,
        defaultedFilters: I,
        defaultedConfig: v,
        defaultedRange: C,
        defaultedMultiCalendars: m
      } = _e(n), { transitionName: P, showTransition: H } = Zt(f), Y = vue.reactive({
        hours: false,
        minutes: false,
        seconds: false
      }), U = vue.ref("AM"), d = vue.ref(null), R = vue.ref([]), _ = vue.ref(), F = vue.ref(false);
      vue.onMounted(() => {
        a("mounted");
      });
      const Q = (r) => set(/* @__PURE__ */ new Date(), {
        hours: r.hours,
        minutes: r.minutes,
        seconds: n.enableSeconds ? r.seconds : 0,
        milliseconds: 0
      }), ne = vue.computed(
        () => (r) => $(r, n[r]) || A(r, n[r])
      ), x = vue.computed(() => ({ hours: n.hours, minutes: n.minutes, seconds: n.seconds })), A = (r, le) => C.value.enabled && !C.value.disableTimeRangeValidation ? !n.validateTime(r, le) : false, X = (r, le) => {
        if (C.value.enabled && !C.value.disableTimeRangeValidation) {
          const ie = le ? +n[`${r}Increment`] : -+n[`${r}Increment`], re = n[r] + ie;
          return !n.validateTime(r, re);
        }
        return false;
      }, O = vue.computed(() => (r) => !J(+n[r] + +n[`${r}Increment`], r) || X(r, true)), K = vue.computed(() => (r) => !J(+n[r] - +n[`${r}Increment`], r) || X(r, false)), fe = (r, le) => add(set(W(), r), le), ve = (r, le) => sub(set(W(), r), le), p = vue.computed(
        () => ({
          dp__time_col: true,
          dp__time_col_block: !n.timePickerInline,
          dp__time_col_reg_block: !n.enableSeconds && n.is24 && !n.timePickerInline,
          dp__time_col_reg_inline: !n.enableSeconds && n.is24 && n.timePickerInline,
          dp__time_col_reg_with_button: !n.enableSeconds && !n.is24,
          dp__time_col_sec: n.enableSeconds && n.is24,
          dp__time_col_sec_with_button: n.enableSeconds && !n.is24
        })
      ), N = vue.computed(
        () => n.timePickerInline && C.value.enabled && !m.value.count
      ), ae = vue.computed(() => {
        const r = [{ type: "hours" }];
        return n.enableMinutes && r.push({ type: "", separator: true }, {
          type: "minutes"
        }), n.enableSeconds && r.push({ type: "", separator: true }, {
          type: "seconds"
        }), r;
      }), y = vue.computed(() => ae.value.filter((r) => !r.separator)), j = vue.computed(() => (r) => {
        if (r === "hours") {
          const le = ye(+n.hours);
          return { text: le < 10 ? `0${le}` : `${le}`, value: le };
        }
        return { text: n[r] < 10 ? `0${n[r]}` : `${n[r]}`, value: n[r] };
      }), $ = (r, le) => {
        var re;
        if (!n.disabledTimesConfig) return false;
        const ie = n.disabledTimesConfig(n.order, r === "hours" ? le : void 0);
        return ie[r] ? !!((re = ie[r]) != null && re.includes(le)) : true;
      }, g = (r, le) => le !== "hours" || U.value === "AM" ? r : r + 12, ue = (r) => {
        const le = n.is24 ? 24 : 12, ie = r === "hours" ? le : 60, re = +n[`${r}GridIncrement`], Te = r === "hours" && !n.is24 ? re : 0, ke = [];
        for (let w = Te; w < ie; w += re)
          ke.push({ value: n.is24 ? w : g(w, r), text: w < 10 ? `0${w}` : `${w}` });
        return r === "hours" && !n.is24 && ke.unshift({ value: U.value === "PM" ? 12 : 0, text: "12" }), Et(ke, (w) => ({ active: false, disabled: I.value.times[r].includes(w.value) || !J(w.value, r) || $(r, w.value) || A(r, w.value) }));
      }, B = (r) => r >= 0 ? r : 59, D = (r) => r >= 0 ? r : 23, J = (r, le) => {
        const ie = n.minTime ? Q(Aa(n.minTime)) : null, re = n.maxTime ? Q(Aa(n.maxTime)) : null, Te = Q(
          Aa(
            x.value,
            le,
            le === "minutes" || le === "seconds" ? B(r) : D(r)
          )
        );
        return ie && re ? (isBefore(Te, re) || isEqual(Te, re)) && (isAfter(Te, ie) || isEqual(Te, ie)) : ie ? isAfter(Te, ie) || isEqual(Te, ie) : re ? isBefore(Te, re) || isEqual(Te, re) : true;
      }, s = (r) => n[`no${r[0].toUpperCase() + r.slice(1)}Overlay`], k = (r) => {
        s(r) || (Y[r] = !Y[r], Y[r] ? (F.value = true, a("overlay-opened", r)) : (F.value = false, a("overlay-closed", r)));
      }, E = (r) => r === "hours" ? getHours : r === "minutes" ? getMinutes : getSeconds, u = () => {
        _.value && clearTimeout(_.value);
      }, te = (r, le = true, ie) => {
        const re = le ? fe : ve, Te = le ? +n[`${r}Increment`] : -+n[`${r}Increment`];
        J(+n[r] + Te, r) && a(
          `update:${r}`,
          E(r)(re({ [r]: +n[r] }, { [r]: +n[`${r}Increment`] }))
        ), !(ie != null && ie.keyboard) && v.value.timeArrowHoldThreshold && (_.value = setTimeout(() => {
          te(r, le);
        }, v.value.timeArrowHoldThreshold));
      }, ye = (r) => n.is24 ? r : (r >= 12 ? U.value = "PM" : U.value = "AM", hl(r)), S = () => {
        U.value === "PM" ? (U.value = "AM", a("update:hours", n.hours - 12)) : (U.value = "PM", a("update:hours", n.hours + 12)), a("am-pm-change", U.value);
      }, be = (r) => {
        Y[r] = true;
      }, L = (r, le, ie) => {
        if (r && n.arrowNavigation) {
          Array.isArray(R.value[le]) ? R.value[le][ie] = r : R.value[le] = [r];
          const re = R.value.reduce(
            (Te, ke) => ke.map((w, z) => [...Te[z] || [], ke[z]]),
            []
          );
          c(n.closeTimePickerBtn), d.value && (re[1] = re[1].concat(d.value)), i(re, n.order);
        }
      }, se = (r, le) => (k(r), a(`update:${r}`, le));
      return t2({ openChildCmp: be }), (r, le) => {
        var ie;
        return r.disabled ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock("div", cr, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(ae.value, (re, Te) => {
            var ke, w, z;
            return vue.openBlock(), vue.createElementBlock("div", {
              key: Te,
              class: vue.normalizeClass(p.value),
              "data-compact": N.value && !r.enableSeconds,
              "data-collapsed": N.value && r.enableSeconds
            }, [
              re.separator ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                F.value ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                  vue.createTextVNode(":")
                ], 64))
              ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                vue.createElementVNode("button", {
                  ref_for: true,
                  ref: (ge) => L(ge, Te, 0),
                  type: "button",
                  class: vue.normalizeClass({
                    dp__btn: true,
                    dp__inc_dec_button: !r.timePickerInline,
                    dp__inc_dec_button_inline: r.timePickerInline,
                    dp__tp_inline_btn_top: r.timePickerInline,
                    dp__inc_dec_button_disabled: O.value(re.type),
                    "dp--hidden-el": F.value
                  }),
                  "data-test-id": `${re.type}-time-inc-btn-${n.order}`,
                  "aria-label": (ke = vue.unref(h2)) == null ? void 0 : ke.incrementValue(re.type),
                  tabindex: "0",
                  onKeydown: (ge) => vue.unref(Xe)(ge, () => te(re.type, true, { keyboard: true }), true),
                  onClick: (ge) => vue.unref(v).timeArrowHoldThreshold ? void 0 : te(re.type, true),
                  onMousedown: (ge) => vue.unref(v).timeArrowHoldThreshold ? te(re.type, true) : void 0,
                  onMouseup: u
                }, [
                  n.timePickerInline ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    r.$slots["tp-inline-arrow-up"] ? vue.renderSlot(r.$slots, "tp-inline-arrow-up", { key: 0 }) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      le[2] || (le[2] = vue.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_l" }, null, -1)),
                      le[3] || (le[3] = vue.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_r" }, null, -1))
                    ], 64))
                  ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    r.$slots["arrow-up"] ? vue.renderSlot(r.$slots, "arrow-up", { key: 0 }) : vue.createCommentVNode("", true),
                    r.$slots["arrow-up"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(Wa), { key: 1 }))
                  ], 64))
                ], 42, vr),
                vue.createElementVNode("button", {
                  ref_for: true,
                  ref: (ge) => L(ge, Te, 1),
                  type: "button",
                  "aria-label": `${j.value(re.type).text}-${(w = vue.unref(h2)) == null ? void 0 : w.openTpOverlay(re.type)}`,
                  class: vue.normalizeClass({
                    dp__time_display: true,
                    dp__time_display_block: !r.timePickerInline,
                    dp__time_display_inline: r.timePickerInline,
                    "dp--time-invalid": ne.value(re.type),
                    "dp--time-overlay-btn": !ne.value(re.type),
                    "dp--hidden-el": F.value
                  }),
                  disabled: s(re.type),
                  tabindex: "0",
                  "data-test-id": `${re.type}-toggle-overlay-btn-${n.order}`,
                  onKeydown: (ge) => vue.unref(Xe)(ge, () => k(re.type), true),
                  onClick: (ge) => k(re.type)
                }, [
                  r.$slots[re.type] ? vue.renderSlot(r.$slots, re.type, {
                    key: 0,
                    text: j.value(re.type).text,
                    value: j.value(re.type).value
                  }) : vue.createCommentVNode("", true),
                  r.$slots[re.type] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    vue.createTextVNode(vue.toDisplayString(j.value(re.type).text), 1)
                  ], 64))
                ], 42, mr),
                vue.createElementVNode("button", {
                  ref_for: true,
                  ref: (ge) => L(ge, Te, 2),
                  type: "button",
                  class: vue.normalizeClass({
                    dp__btn: true,
                    dp__inc_dec_button: !r.timePickerInline,
                    dp__inc_dec_button_inline: r.timePickerInline,
                    dp__tp_inline_btn_bottom: r.timePickerInline,
                    dp__inc_dec_button_disabled: K.value(re.type),
                    "dp--hidden-el": F.value
                  }),
                  "data-test-id": `${re.type}-time-dec-btn-${n.order}`,
                  "aria-label": (z = vue.unref(h2)) == null ? void 0 : z.decrementValue(re.type),
                  tabindex: "0",
                  onKeydown: (ge) => vue.unref(Xe)(ge, () => te(re.type, false, { keyboard: true }), true),
                  onClick: (ge) => vue.unref(v).timeArrowHoldThreshold ? void 0 : te(re.type, false),
                  onMousedown: (ge) => vue.unref(v).timeArrowHoldThreshold ? te(re.type, false) : void 0,
                  onMouseup: u
                }, [
                  n.timePickerInline ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    r.$slots["tp-inline-arrow-down"] ? vue.renderSlot(r.$slots, "tp-inline-arrow-down", { key: 0 }) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      le[4] || (le[4] = vue.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_l" }, null, -1)),
                      le[5] || (le[5] = vue.createElementVNode("span", { class: "dp__tp_inline_btn_bar dp__tp_btn_in_r" }, null, -1))
                    ], 64))
                  ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    r.$slots["arrow-down"] ? vue.renderSlot(r.$slots, "arrow-down", { key: 0 }) : vue.createCommentVNode("", true),
                    r.$slots["arrow-down"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(Va), { key: 1 }))
                  ], 64))
                ], 42, pr)
              ], 64))
            ], 10, fr);
          }), 128)),
          r.is24 ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock("div", yr, [
            r.$slots["am-pm-button"] ? vue.renderSlot(r.$slots, "am-pm-button", {
              key: 0,
              toggle: S,
              value: U.value
            }) : vue.createCommentVNode("", true),
            r.$slots["am-pm-button"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock("button", {
              key: 1,
              ref_key: "amPmButton",
              ref: d,
              type: "button",
              class: "dp__pm_am_button",
              role: "button",
              "aria-label": (ie = vue.unref(h2)) == null ? void 0 : ie.amPmButton,
              tabindex: "0",
              "data-compact": N.value,
              onClick: S,
              onKeydown: le[0] || (le[0] = (re) => vue.unref(Xe)(re, () => S(), true))
            }, vue.toDisplayString(U.value), 41, gr))
          ])),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(y.value, (re, Te) => (vue.openBlock(), vue.createBlock(vue.Transition, {
            key: Te,
            name: vue.unref(P)(Y[re.type]),
            css: vue.unref(H)
          }, {
            default: vue.withCtx(() => {
              var ke, w;
              return [
                Y[re.type] ? (vue.openBlock(), vue.createBlock(Jt, {
                  key: 0,
                  items: ue(re.type),
                  "is-last": r.autoApply && !vue.unref(v).keepActionRow,
                  "esc-close": r.escClose,
                  type: re.type,
                  "text-input": r.textInput,
                  config: r.config,
                  "arrow-navigation": r.arrowNavigation,
                  "aria-labels": r.ariaLabels,
                  "overlay-label": (w = (ke = vue.unref(h2)).timeOverlay) == null ? void 0 : w.call(ke, re.type),
                  onSelected: (z) => se(re.type, z),
                  onToggle: (z) => k(re.type),
                  onResetFlow: le[1] || (le[1] = (z) => r.$emit("reset-flow"))
                }, vue.createSlots({
                  "button-icon": vue.withCtx(() => [
                    r.$slots["clock-icon"] ? vue.renderSlot(r.$slots, "clock-icon", { key: 0 }) : vue.createCommentVNode("", true),
                    r.$slots["clock-icon"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(r.timePickerInline ? vue.unref(zt) : vue.unref(Ua)), { key: 1 }))
                  ]),
                  _: 2
                }, [
                  r.$slots[`${re.type}-overlay-value`] ? {
                    name: "item",
                    fn: vue.withCtx(({ item: z }) => [
                      vue.renderSlot(r.$slots, `${re.type}-overlay-value`, {
                        text: z.text,
                        value: z.value
                      })
                    ]),
                    key: "0"
                  } : void 0,
                  r.$slots[`${re.type}-overlay-header`] ? {
                    name: "header",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(r.$slots, `${re.type}-overlay-header`, {
                        toggle: () => k(re.type)
                      })
                    ]),
                    key: "1"
                  } : void 0
                ]), 1032, ["items", "is-last", "esc-close", "type", "text-input", "config", "arrow-navigation", "aria-labels", "overlay-label", "onSelected", "onToggle"])) : vue.createCommentVNode("", true)
              ];
            }),
            _: 2
          }, 1032, ["name", "css"]))), 128))
        ]));
      };
    }
  }), br = ["data-dp-mobile"], kr = ["aria-label", "tabindex"], wr = ["role", "aria-label", "tabindex"], Dr = ["aria-label"], Hn = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "TimePicker",
    props: {
      hours: { type: [Number, Array], default: 0 },
      minutes: { type: [Number, Array], default: 0 },
      seconds: { type: [Number, Array], default: 0 },
      disabledTimesConfig: { type: Function, default: null },
      validateTime: {
        type: Function,
        default: () => false
      },
      ...it
    },
    emits: [
      "update:hours",
      "update:minutes",
      "update:seconds",
      "mount",
      "reset-flow",
      "overlay-opened",
      "overlay-closed",
      "am-pm-change"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, { buildMatrix: i, setTimePicker: c } = Mt(), h2 = vue.useSlots(), { defaultedTransitions: f, defaultedAriaLabels: I, defaultedTextInput: v, defaultedConfig: C, defaultedRange: m } = _e(n), { transitionName: P, showTransition: H } = Zt(f), { hideNavigationButtons: Y } = ma(), U = vue.ref(null), d = vue.ref(null), R = vue.ref([]), _ = vue.ref(null), F = vue.ref(false);
      vue.onMounted(() => {
        a("mount"), !n.timePicker && n.arrowNavigation ? i([Le(U.value)], "time") : c(true, n.timePicker);
      });
      const Q = vue.computed(() => m.value.enabled && n.modelAuto ? An(n.internalModelValue) : true), ne = vue.ref(false), x = ($) => ({
        hours: Array.isArray(n.hours) ? n.hours[$] : n.hours,
        minutes: Array.isArray(n.minutes) ? n.minutes[$] : n.minutes,
        seconds: Array.isArray(n.seconds) ? n.seconds[$] : n.seconds
      }), A = vue.computed(() => {
        const $ = [];
        if (m.value.enabled)
          for (let g = 0; g < 2; g++)
            $.push(x(g));
        else
          $.push(x(0));
        return $;
      }), X = ($, g = false, ue = "") => {
        g || a("reset-flow"), ne.value = $, a($ ? "overlay-opened" : "overlay-closed", je.time), n.arrowNavigation && c($), vue.nextTick(() => {
          ue !== "" && R.value[0] && R.value[0].openChildCmp(ue);
        });
      }, O = vue.computed(() => ({
        dp__btn: true,
        dp__button: true,
        dp__button_bottom: n.autoApply && !C.value.keepActionRow
      })), K = et(h2, "timePicker"), fe = ($, g, ue) => m.value.enabled ? g === 0 ? [$, A.value[1][ue]] : [A.value[0][ue], $] : $, ve = ($) => {
        a("update:hours", $);
      }, p = ($) => {
        a("update:minutes", $);
      }, N = ($) => {
        a("update:seconds", $);
      }, ae = () => {
        if (_.value && !v.value.enabled && !n.noOverlayFocus) {
          const $ = Tn(_.value);
          $ && $.focus({ preventScroll: true });
        }
      }, y = ($) => {
        F.value = false, a("overlay-closed", $);
      }, j = ($) => {
        F.value = true, a("overlay-opened", $);
      };
      return t2({ toggleTimePicker: X }), ($, g) => {
        var ue;
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "dp--tp-wrap",
          "data-dp-mobile": $.isMobile
        }, [
          !$.timePicker && !$.timePickerInline ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            ref_key: "openTimePickerBtn",
            ref: U,
            type: "button",
            class: vue.normalizeClass({ ...O.value, "dp--hidden-el": ne.value }),
            "aria-label": (ue = vue.unref(I)) == null ? void 0 : ue.openTimePicker,
            tabindex: $.noOverlayFocus ? void 0 : 0,
            "data-test-id": "open-time-picker-btn",
            onKeydown: g[0] || (g[0] = (B) => vue.unref(Xe)(B, () => X(true))),
            onClick: g[1] || (g[1] = (B) => X(true))
          }, [
            $.$slots["clock-icon"] ? vue.renderSlot($.$slots, "clock-icon", { key: 0 }) : vue.createCommentVNode("", true),
            $.$slots["clock-icon"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(Ua), { key: 1 }))
          ], 42, kr)), [
            [vue.vShow, !vue.unref(Y)($.hideNavigation, "time")]
          ]) : vue.createCommentVNode("", true),
          vue.createVNode(vue.Transition, {
            name: vue.unref(P)(ne.value),
            css: vue.unref(H) && !$.timePickerInline
          }, {
            default: vue.withCtx(() => {
              var B, D;
              return [
                ne.value || $.timePicker || $.timePickerInline ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  ref_key: "overlayRef",
                  ref: _,
                  role: $.timePickerInline ? void 0 : "dialog",
                  class: vue.normalizeClass({
                    dp__overlay: !$.timePickerInline,
                    "dp--overlay-absolute": !n.timePicker && !$.timePickerInline,
                    "dp--overlay-relative": n.timePicker
                  }),
                  style: vue.normalizeStyle($.timePicker ? { height: `${vue.unref(C).modeHeight}px` } : void 0),
                  "aria-label": (B = vue.unref(I)) == null ? void 0 : B.timePicker,
                  tabindex: $.timePickerInline ? void 0 : 0
                }, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(
                      $.timePickerInline ? "dp__time_picker_inline_container" : "dp__overlay_container dp__container_flex dp__time_picker_overlay_container"
                    ),
                    style: { display: "flex" }
                  }, [
                    $.$slots["time-picker-overlay"] ? vue.renderSlot($.$slots, "time-picker-overlay", {
                      key: 0,
                      hours: e.hours,
                      minutes: e.minutes,
                      seconds: e.seconds,
                      setHours: ve,
                      setMinutes: p,
                      setSeconds: N
                    }) : vue.createCommentVNode("", true),
                    $.$slots["time-picker-overlay"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock("div", {
                      key: 1,
                      class: vue.normalizeClass($.timePickerInline ? "dp__flex" : "dp__overlay_row dp__flex_row")
                    }, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(A.value, (J, s) => vue.withDirectives((vue.openBlock(), vue.createBlock(hr, vue.mergeProps({
                        key: s,
                        ref_for: true
                      }, {
                        ...$.$props,
                        order: s,
                        hours: J.hours,
                        minutes: J.minutes,
                        seconds: J.seconds,
                        closeTimePickerBtn: d.value,
                        disabledTimesConfig: e.disabledTimesConfig,
                        disabled: s === 0 ? vue.unref(m).fixedStart : vue.unref(m).fixedEnd
                      }, {
                        ref_for: true,
                        ref_key: "timeInputRefs",
                        ref: R,
                        "validate-time": (k, E) => e.validateTime(k, fe(E, s, k)),
                        "onUpdate:hours": (k) => ve(fe(k, s, "hours")),
                        "onUpdate:minutes": (k) => p(fe(k, s, "minutes")),
                        "onUpdate:seconds": (k) => N(fe(k, s, "seconds")),
                        onMounted: ae,
                        onOverlayClosed: y,
                        onOverlayOpened: j,
                        onAmPmChange: g[2] || (g[2] = (k) => $.$emit("am-pm-change", k))
                      }), vue.createSlots({ _: 2 }, [
                        vue.renderList(vue.unref(K), (k, E) => ({
                          name: k,
                          fn: vue.withCtx((u) => [
                            vue.renderSlot($.$slots, k, vue.mergeProps({ ref_for: true }, u))
                          ])
                        }))
                      ]), 1040, ["validate-time", "onUpdate:hours", "onUpdate:minutes", "onUpdate:seconds"])), [
                        [vue.vShow, s === 0 ? true : Q.value]
                      ])), 128))
                    ], 2)),
                    !$.timePicker && !$.timePickerInline ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("button", {
                      key: 2,
                      ref_key: "closeTimePickerBtn",
                      ref: d,
                      type: "button",
                      class: vue.normalizeClass({ ...O.value, "dp--hidden-el": F.value }),
                      "aria-label": (D = vue.unref(I)) == null ? void 0 : D.closeTimePicker,
                      tabindex: "0",
                      onKeydown: g[3] || (g[3] = (J) => vue.unref(Xe)(J, () => X(false))),
                      onClick: g[4] || (g[4] = (J) => X(false))
                    }, [
                      $.$slots["calendar-icon"] ? vue.renderSlot($.$slots, "calendar-icon", { key: 0 }) : vue.createCommentVNode("", true),
                      $.$slots["calendar-icon"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(zt), { key: 1 }))
                    ], 42, Dr)), [
                      [vue.vShow, !vue.unref(Y)($.hideNavigation, "time")]
                    ]) : vue.createCommentVNode("", true)
                  ], 2)
                ], 14, wr)) : vue.createCommentVNode("", true)
              ];
            }),
            _: 3
          }, 8, ["name", "css"])
        ], 8, br);
      };
    }
  }), Un = (e, t2, l, a) => {
    const { defaultedRange: n } = _e(e), i = (_, F) => Array.isArray(t2[_]) ? t2[_][F] : t2[_], c = (_) => e.enableSeconds ? Array.isArray(t2.seconds) ? t2.seconds[_] : t2.seconds : 0, h2 = (_, F) => _ ? F !== void 0 ? wt(_, i("hours", F), i("minutes", F), c(F)) : wt(_, t2.hours, t2.minutes, c()) : setSeconds(W(), c(F)), f = (_, F) => {
      t2[_] = F;
    }, I = vue.computed(() => e.modelAuto && n.value.enabled ? Array.isArray(l.value) ? l.value.length > 1 : false : n.value.enabled), v = (_, F) => {
      const Q = Object.fromEntries(
        Object.keys(t2).map((ne) => ne === _ ? [ne, F] : [ne, t2[ne]].slice())
      );
      if (I.value && !n.value.disableTimeRangeValidation) {
        const ne = (A) => l.value ? wt(
          l.value[A],
          Q.hours[A],
          Q.minutes[A],
          Q.seconds[A]
        ) : null, x = (A) => setMilliseconds(l.value[A], 0);
        return !(Ae(ne(0), ne(1)) && (isAfter(ne(0), x(1)) || isBefore(ne(1), x(0))));
      }
      return true;
    }, C = (_, F) => {
      v(_, F) && (f(_, F), a && a());
    }, m = (_) => {
      C("hours", _);
    }, P = (_) => {
      C("minutes", _);
    }, H = (_) => {
      C("seconds", _);
    }, Y = (_, F, Q, ne) => {
      F && m(_), !F && !Q && P(_), Q && H(_), l.value && ne(l.value);
    }, U = (_) => {
      if (_) {
        const F = Array.isArray(_), Q = F ? [+_[0].hours, +_[1].hours] : +_.hours, ne = F ? [+_[0].minutes, +_[1].minutes] : +_.minutes, x = F ? [+_[0].seconds, +_[1].seconds] : +_.seconds;
        f("hours", Q), f("minutes", ne), e.enableSeconds && f("seconds", x);
      }
    }, d = (_, F) => {
      const Q = {
        hours: Array.isArray(t2.hours) ? t2.hours[_] : t2.hours,
        disabledArr: []
      };
      return (F || F === 0) && (Q.hours = F), Array.isArray(e.disabledTimes) && (Q.disabledArr = n.value.enabled && Array.isArray(e.disabledTimes[_]) ? e.disabledTimes[_] : e.disabledTimes), Q;
    }, R = vue.computed(() => (_, F) => {
      var Q;
      if (Array.isArray(e.disabledTimes)) {
        const { disabledArr: ne, hours: x } = d(_, F), A = ne.filter((X) => +X.hours === x);
        return ((Q = A[0]) == null ? void 0 : Q.minutes) === "*" ? { hours: [x], minutes: void 0, seconds: void 0 } : {
          hours: [],
          minutes: (A == null ? void 0 : A.map((X) => +X.minutes)) ?? [],
          seconds: (A == null ? void 0 : A.map((X) => X.seconds ? +X.seconds : void 0)) ?? []
        };
      }
      return { hours: [], minutes: [], seconds: [] };
    });
    return {
      setTime: f,
      updateHours: m,
      updateMinutes: P,
      updateSeconds: H,
      getSetDateTime: h2,
      updateTimeValues: Y,
      getSecondsValue: c,
      assignStartTime: U,
      validateTime: v,
      disabledTimesConfig: R
    };
  }, Mr = (e, t2) => {
    const l = () => {
      e.isTextInputDate && F();
    }, { modelValue: a, time: n } = xt(e, t2, l), { defaultedStartTime: i, defaultedRange: c, defaultedTz: h2 } = _e(e), { updateTimeValues: f, getSetDateTime: I, setTime: v, assignStartTime: C, disabledTimesConfig: m, validateTime: P } = Un(e, n, a, H);
    function H() {
      t2("update-flow-step");
    }
    const Y = (x) => {
      const { hours: A, minutes: X, seconds: O } = x;
      return { hours: +A, minutes: +X, seconds: O ? +O : 0 };
    }, U = () => {
      if (e.startTime) {
        if (Array.isArray(e.startTime)) {
          const A = Y(e.startTime[0]), X = Y(e.startTime[1]);
          return [set(W(), A), set(W(), X)];
        }
        const x = Y(e.startTime);
        return set(W(), x);
      }
      return c.value.enabled ? [null, null] : null;
    }, d = () => {
      if (c.value.enabled) {
        const [x, A] = U();
        a.value = [
          xe(I(x, 0), h2.value.timezone),
          xe(I(A, 1), h2.value.timezone)
        ];
      } else
        a.value = xe(I(U()), h2.value.timezone);
    }, R = (x) => Array.isArray(x) ? [Rt(W(x[0])), Rt(W(x[1]))] : [Rt(x ?? W())], _ = (x, A, X) => {
      v("hours", x), v("minutes", A), v("seconds", e.enableSeconds ? X : 0);
    }, F = () => {
      const [x, A] = R(a.value);
      return c.value.enabled ? _(
        [x.hours, A.hours],
        [x.minutes, A.minutes],
        [x.seconds, A.seconds]
      ) : _(x.hours, x.minutes, x.seconds);
    };
    vue.onMounted(() => {
      if (!e.shadow)
        return C(i.value), a.value ? F() : d();
    });
    const Q = () => {
      Array.isArray(a.value) ? a.value = a.value.map((x, A) => x && I(x, A)) : a.value = I(a.value), t2("time-update");
    };
    return {
      modelValue: a,
      time: n,
      disabledTimesConfig: m,
      updateTime: (x, A = true, X = false) => {
        f(x, A, X, Q);
      },
      validateTime: P
    };
  }, $r = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "TimePickerSolo",
    props: {
      ...it
    },
    emits: [
      "update:internal-model-value",
      "time-update",
      "am-pm-change",
      "mount",
      "reset-flow",
      "update-flow-step",
      "overlay-toggle"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, i = vue.useSlots(), c = et(i, "timePicker"), h2 = vue.ref(null), { time: f, modelValue: I, disabledTimesConfig: v, updateTime: C, validateTime: m } = Mr(n, a);
      return vue.onMounted(() => {
        n.shadow || a("mount", null);
      }), t2({ getSidebarProps: () => ({
        modelValue: I,
        time: f,
        updateTime: C
      }), toggleTimePicker: (Y, U = false, d = "") => {
        var R;
        (R = h2.value) == null || R.toggleTimePicker(Y, U, d);
      } }), (Y, U) => (vue.openBlock(), vue.createBlock(fa, {
        "multi-calendars": 0,
        stretch: "",
        "is-mobile": Y.isMobile
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(Hn, vue.mergeProps({
            ref_key: "tpRef",
            ref: h2
          }, Y.$props, {
            hours: vue.unref(f).hours,
            minutes: vue.unref(f).minutes,
            seconds: vue.unref(f).seconds,
            "internal-model-value": Y.internalModelValue,
            "disabled-times-config": vue.unref(v),
            "validate-time": vue.unref(m),
            "onUpdate:hours": U[0] || (U[0] = (d) => vue.unref(C)(d)),
            "onUpdate:minutes": U[1] || (U[1] = (d) => vue.unref(C)(d, false)),
            "onUpdate:seconds": U[2] || (U[2] = (d) => vue.unref(C)(d, false, true)),
            onAmPmChange: U[3] || (U[3] = (d) => Y.$emit("am-pm-change", d)),
            onResetFlow: U[4] || (U[4] = (d) => Y.$emit("reset-flow")),
            onOverlayClosed: U[5] || (U[5] = (d) => Y.$emit("overlay-toggle", { open: false, overlay: d })),
            onOverlayOpened: U[6] || (U[6] = (d) => Y.$emit("overlay-toggle", { open: true, overlay: d }))
          }), vue.createSlots({ _: 2 }, [
            vue.renderList(vue.unref(c), (d, R) => ({
              name: d,
              fn: vue.withCtx((_) => [
                vue.renderSlot(Y.$slots, d, vue.normalizeProps(vue.guardReactiveProps(_)))
              ])
            }))
          ]), 1040, ["hours", "minutes", "seconds", "internal-model-value", "disabled-times-config", "validate-time"])
        ]),
        _: 3
      }, 8, ["is-mobile"]));
    }
  }), Ar = { class: "dp--header-wrap" }, Tr = {
    key: 0,
    class: "dp__month_year_wrap"
  }, Sr = { key: 0 }, Pr = { class: "dp__month_year_wrap" }, Rr = ["data-dp-element", "aria-label", "data-test-id", "onClick", "onKeydown"], Cr = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "DpHeader",
    props: {
      month: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      instance: { type: Number, default: 0 },
      years: { type: Array, default: () => [] },
      months: { type: Array, default: () => [] },
      ...it
    },
    emits: ["update-month-year", "mount", "reset-flow", "overlay-closed", "overlay-opened"],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, {
        defaultedTransitions: i,
        defaultedAriaLabels: c,
        defaultedMultiCalendars: h2,
        defaultedFilters: f,
        defaultedConfig: I,
        defaultedHighlight: v,
        propDates: C,
        defaultedUI: m
      } = _e(n), { transitionName: P, showTransition: H } = Zt(i), { buildMatrix: Y } = Mt(), { handleMonthYearChange: U, isDisabled: d, updateMonthYear: R } = Xl(n, a), { showLeftIcon: _, showRightIcon: F } = ma(), Q = vue.ref(false), ne = vue.ref(false), x = vue.ref(false), A = vue.ref([null, null, null, null]);
      vue.onMounted(() => {
        a("mount");
      });
      const X = (D) => ({
        get: () => n[D],
        set: (J) => {
          const s = D === ot.month ? ot.year : ot.month;
          a("update-month-year", { [D]: J, [s]: n[s] }), D === ot.month ? y(true) : j(true);
        }
      }), O = vue.computed(X(ot.month)), K = vue.computed(X(ot.year)), fe = vue.computed(() => (D) => ({
        month: n.month,
        year: n.year,
        items: D === ot.month ? n.months : n.years,
        instance: n.instance,
        updateMonthYear: R,
        toggle: D === ot.month ? y : j
      })), ve = vue.computed(() => {
        const D = n.months.find((J) => J.value === n.month);
        return D || { text: "", value: 0 };
      }), p = vue.computed(() => Et(n.months, (D) => {
        const J = n.month === D.value, s = Qt(
          D.value,
          Pn(n.year, C.value.minDate),
          Rn(n.year, C.value.maxDate)
        ) || f.value.months.includes(D.value), k = Yn(v.value, D.value, n.year);
        return { active: J, disabled: s, highlighted: k };
      })), N = vue.computed(() => Et(n.years, (D) => {
        const J = n.year === D.value, s = Qt(
          D.value,
          Ft(C.value.minDate),
          Ft(C.value.maxDate)
        ) || f.value.years.includes(D.value), k = qa(v.value, D.value);
        return { active: J, disabled: s, highlighted: k };
      })), ae = (D, J, s) => {
        s !== void 0 ? D.value = s : D.value = !D.value, D.value ? (x.value = true, a("overlay-opened", J)) : (x.value = false, a("overlay-closed", J));
      }, y = (D = false, J) => {
        $(D), ae(Q, je.month, J);
      }, j = (D = false, J) => {
        $(D), ae(ne, je.year, J);
      }, $ = (D) => {
        D || a("reset-flow");
      }, g = (D, J) => {
        n.arrowNavigation && (A.value[J] = Le(D), Y(A.value, "monthYear"));
      }, ue = vue.computed(() => {
        var D, J, s, k, E, u;
        return [
          {
            type: ot.month,
            index: 1,
            toggle: y,
            modelValue: O.value,
            updateModelValue: (te) => O.value = te,
            text: ve.value.text,
            showSelectionGrid: Q.value,
            items: p.value,
            ariaLabel: (D = c.value) == null ? void 0 : D.openMonthsOverlay,
            overlayLabel: ((s = (J = c.value).monthPicker) == null ? void 0 : s.call(J, true)) ?? void 0
          },
          {
            type: ot.year,
            index: 2,
            toggle: j,
            modelValue: K.value,
            updateModelValue: (te) => K.value = te,
            text: Sn(n.year, n.locale),
            showSelectionGrid: ne.value,
            items: N.value,
            ariaLabel: (k = c.value) == null ? void 0 : k.openYearsOverlay,
            overlayLabel: ((u = (E = c.value).yearPicker) == null ? void 0 : u.call(E, true)) ?? void 0
          }
        ];
      }), B = vue.computed(() => n.disableYearSelect ? [ue.value[0]] : n.yearFirst ? [...ue.value].reverse() : ue.value);
      return t2({
        toggleMonthPicker: y,
        toggleYearPicker: j,
        handleMonthYearChange: U
      }), (D, J) => {
        var s, k, E, u, te, ye;
        return vue.openBlock(), vue.createElementBlock("div", Ar, [
          D.$slots["month-year"] ? (vue.openBlock(), vue.createElementBlock("div", Tr, [
            vue.renderSlot(D.$slots, "month-year", vue.normalizeProps(vue.guardReactiveProps({ month: e.month, year: e.year, months: e.months, years: e.years, updateMonthYear: vue.unref(R), handleMonthYearChange: vue.unref(U), instance: e.instance })))
          ])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            D.$slots["top-extra"] ? (vue.openBlock(), vue.createElementBlock("div", Sr, [
              vue.renderSlot(D.$slots, "top-extra", { value: D.internalModelValue })
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", Pr, [
              vue.unref(_)(vue.unref(h2), e.instance) && !D.vertical ? (vue.openBlock(), vue.createBlock(Wt, {
                key: 0,
                "aria-label": (s = vue.unref(c)) == null ? void 0 : s.prevMonth,
                disabled: vue.unref(d)(false),
                class: vue.normalizeClass((k = vue.unref(m)) == null ? void 0 : k.navBtnPrev),
                "el-name": "action-prev",
                onActivate: J[0] || (J[0] = (S) => vue.unref(U)(false, true)),
                onSetRef: J[1] || (J[1] = (S) => g(S, 0))
              }, {
                default: vue.withCtx(() => [
                  D.$slots["arrow-left"] ? vue.renderSlot(D.$slots, "arrow-left", { key: 0 }) : vue.createCommentVNode("", true),
                  D.$slots["arrow-left"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(za), { key: 1 }))
                ]),
                _: 3
              }, 8, ["aria-label", "disabled", "class"])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["dp__month_year_wrap", {
                  dp__year_disable_select: D.disableYearSelect
                }])
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(B.value, (S, be) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                  key: S.type
                }, [
                  vue.createElementVNode("button", {
                    ref_for: true,
                    ref: (L) => g(L, be + 1),
                    type: "button",
                    "data-dp-element": `overlay-${S.type}`,
                    class: vue.normalizeClass(["dp__btn dp__month_year_select", { "dp--hidden-el": x.value }]),
                    "aria-label": `${S.text}-${S.ariaLabel}`,
                    "data-test-id": `${S.type}-toggle-overlay-${e.instance}`,
                    onClick: S.toggle,
                    onKeydown: (L) => vue.unref(Xe)(L, () => S.toggle(), true)
                  }, [
                    D.$slots[S.type] ? vue.renderSlot(D.$slots, S.type, {
                      key: 0,
                      text: S.text,
                      value: n[S.type]
                    }) : vue.createCommentVNode("", true),
                    D.$slots[S.type] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      vue.createTextVNode(vue.toDisplayString(S.text), 1)
                    ], 64))
                  ], 42, Rr),
                  vue.createVNode(vue.Transition, {
                    name: vue.unref(P)(S.showSelectionGrid),
                    css: vue.unref(H)
                  }, {
                    default: vue.withCtx(() => [
                      S.showSelectionGrid ? (vue.openBlock(), vue.createBlock(Jt, {
                        key: 0,
                        items: S.items,
                        "arrow-navigation": D.arrowNavigation,
                        "hide-navigation": D.hideNavigation,
                        "is-last": D.autoApply && !vue.unref(I).keepActionRow,
                        "skip-button-ref": false,
                        config: D.config,
                        type: S.type,
                        "header-refs": [],
                        "esc-close": D.escClose,
                        "menu-wrap-ref": D.menuWrapRef,
                        "text-input": D.textInput,
                        "aria-labels": D.ariaLabels,
                        "overlay-label": S.overlayLabel,
                        onSelected: S.updateModelValue,
                        onToggle: S.toggle
                      }, vue.createSlots({
                        "button-icon": vue.withCtx(() => [
                          D.$slots["calendar-icon"] ? vue.renderSlot(D.$slots, "calendar-icon", { key: 0 }) : vue.createCommentVNode("", true),
                          D.$slots["calendar-icon"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(zt), { key: 1 }))
                        ]),
                        _: 2
                      }, [
                        D.$slots[`${S.type}-overlay-value`] ? {
                          name: "item",
                          fn: vue.withCtx(({ item: L }) => [
                            vue.renderSlot(D.$slots, `${S.type}-overlay-value`, {
                              text: L.text,
                              value: L.value
                            })
                          ]),
                          key: "0"
                        } : void 0,
                        D.$slots[`${S.type}-overlay`] ? {
                          name: "overlay",
                          fn: vue.withCtx(() => [
                            vue.renderSlot(D.$slots, `${S.type}-overlay`, vue.mergeProps({ ref_for: true }, fe.value(S.type)))
                          ]),
                          key: "1"
                        } : void 0,
                        D.$slots[`${S.type}-overlay-header`] ? {
                          name: "header",
                          fn: vue.withCtx(() => [
                            vue.renderSlot(D.$slots, `${S.type}-overlay-header`, {
                              toggle: S.toggle
                            })
                          ]),
                          key: "2"
                        } : void 0
                      ]), 1032, ["items", "arrow-navigation", "hide-navigation", "is-last", "config", "type", "esc-close", "menu-wrap-ref", "text-input", "aria-labels", "overlay-label", "onSelected", "onToggle"])) : vue.createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["name", "css"])
                ], 64))), 128))
              ], 2),
              vue.unref(_)(vue.unref(h2), e.instance) && D.vertical ? (vue.openBlock(), vue.createBlock(Wt, {
                key: 1,
                "aria-label": (E = vue.unref(c)) == null ? void 0 : E.prevMonth,
                "el-name": "action-prev",
                disabled: vue.unref(d)(false),
                class: vue.normalizeClass((u = vue.unref(m)) == null ? void 0 : u.navBtnPrev),
                onActivate: J[2] || (J[2] = (S) => vue.unref(U)(false, true))
              }, {
                default: vue.withCtx(() => [
                  D.$slots["arrow-up"] ? vue.renderSlot(D.$slots, "arrow-up", { key: 0 }) : vue.createCommentVNode("", true),
                  D.$slots["arrow-up"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.unref(Wa), { key: 1 }))
                ]),
                _: 3
              }, 8, ["aria-label", "disabled", "class"])) : vue.createCommentVNode("", true),
              vue.unref(F)(vue.unref(h2), e.instance) ? (vue.openBlock(), vue.createBlock(Wt, {
                key: 2,
                ref: "rightIcon",
                "el-name": "action-next",
                disabled: vue.unref(d)(true),
                "aria-label": (te = vue.unref(c)) == null ? void 0 : te.nextMonth,
                class: vue.normalizeClass((ye = vue.unref(m)) == null ? void 0 : ye.navBtnNext),
                onActivate: J[3] || (J[3] = (S) => vue.unref(U)(true, true)),
                onSetRef: J[4] || (J[4] = (S) => g(S, D.disableYearSelect ? 2 : 3))
              }, {
                default: vue.withCtx(() => [
                  D.$slots[D.vertical ? "arrow-down" : "arrow-right"] ? vue.renderSlot(D.$slots, D.vertical ? "arrow-down" : "arrow-right", { key: 0 }) : vue.createCommentVNode("", true),
                  D.$slots[D.vertical ? "arrow-down" : "arrow-right"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(D.vertical ? vue.unref(Va) : vue.unref(Ha)), { key: 1 }))
                ]),
                _: 3
              }, 8, ["disabled", "aria-label", "class"])) : vue.createCommentVNode("", true)
            ])
          ], 64))
        ]);
      };
    }
  }), Or = {
    class: "dp__calendar_header",
    role: "row"
  }, _r = {
    key: 0,
    class: "dp__calendar_header_item",
    role: "gridcell"
  }, Br = ["aria-label"], Yr = {
    key: 0,
    class: "dp__calendar_item dp__week_num",
    role: "gridcell"
  }, Ir = { class: "dp__cell_inner" }, Nr = ["id", "aria-pressed", "aria-disabled", "aria-label", "tabindex", "data-test-id", "onClick", "onTouchend", "onKeydown", "onMouseenter", "onMouseleave", "onMousedown"], Er = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "DpCalendar",
    props: {
      mappedDates: { type: Array, default: () => [] },
      instance: { type: Number, default: 0 },
      month: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      ...it
    },
    emits: [
      "select-date",
      "set-hover-date",
      "handle-scroll",
      "mount",
      "handle-swipe",
      "handle-space",
      "tooltip-open",
      "tooltip-close"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, { buildMultiLevelMatrix: i } = Mt(), {
        defaultedTransitions: c,
        defaultedConfig: h2,
        defaultedAriaLabels: f,
        defaultedMultiCalendars: I,
        defaultedWeekNumbers: v,
        defaultedMultiDates: C,
        defaultedUI: m
      } = _e(n), P = vue.ref(null), H = vue.ref({
        bottom: "",
        left: "",
        transform: ""
      }), Y = vue.ref([]), U = vue.ref(null), d = vue.ref(true), R = vue.ref(""), _ = vue.ref({ startX: 0, endX: 0, startY: 0, endY: 0 }), F = vue.ref([]), Q = vue.ref({ left: "50%" }), ne = vue.ref(false), x = vue.computed(() => n.calendar ? n.calendar(n.mappedDates) : n.mappedDates), A = vue.computed(() => n.dayNames ? Array.isArray(n.dayNames) ? n.dayNames : n.dayNames(n.locale, +n.weekStart) : gl(n.formatLocale, n.locale, +n.weekStart));
      vue.onMounted(() => {
        a("mount", { cmp: "calendar", refs: Y }), h2.value.noSwipe || U.value && (U.value.addEventListener("touchstart", g, { passive: false }), U.value.addEventListener("touchend", ue, { passive: false }), U.value.addEventListener("touchmove", B, { passive: false })), n.monthChangeOnScroll && U.value && U.value.addEventListener("wheel", s, { passive: false });
      });
      const X = (S) => S ? n.vertical ? "vNext" : "next" : n.vertical ? "vPrevious" : "previous", O = (S, be) => {
        if (n.transitions) {
          const L = Je(pt(W(), n.month, n.year));
          R.value = Ne(Je(pt(W(), S, be)), L) ? c.value[X(true)] : c.value[X(false)], d.value = false, vue.nextTick(() => {
            d.value = true;
          });
        }
      }, K = vue.computed(
        () => ({
          ...m.value.calendar ?? {}
        })
      ), fe = vue.computed(() => (S) => {
        const be = bl(S);
        return {
          dp__marker_dot: be.type === "dot",
          dp__marker_line: be.type === "line"
        };
      }), ve = vue.computed(() => (S) => Ae(S, P.value)), p = vue.computed(() => ({
        dp__calendar: true,
        dp__calendar_next: I.value.count > 0 && n.instance !== 0
      })), N = vue.computed(() => (S) => n.hideOffsetDates ? S.current : true), ae = async (S, be) => {
        const { width: L, height: se } = S.getBoundingClientRect();
        P.value = be.value;
        let r = { left: `${L / 2}px` }, le = -50;
        if (await vue.nextTick(), F.value[0]) {
          const { left: ie, width: re } = F.value[0].getBoundingClientRect();
          ie < 0 && (r = { left: "0" }, le = 0, Q.value.left = `${L / 2}px`), window.innerWidth < ie + re && (r = { right: "0" }, le = 0, Q.value.left = `${re - L / 2}px`);
        }
        H.value = {
          bottom: `${se}px`,
          ...r,
          transform: `translateX(${le}%)`
        };
      }, y = async (S, be, L) => {
        var r, le, ie;
        const se = Le(Y.value[be][L]);
        se && ((r = S.marker) != null && r.customPosition && ((ie = (le = S.marker) == null ? void 0 : le.tooltip) != null && ie.length) ? H.value = S.marker.customPosition(se) : await ae(se, S), a("tooltip-open", S.marker));
      }, j = async (S, be, L) => {
        var se, r;
        if (ne.value && C.value.enabled && C.value.dragSelect)
          return a("select-date", S);
        if (a("set-hover-date", S), (r = (se = S.marker) == null ? void 0 : se.tooltip) != null && r.length) {
          if (n.hideOffsetDates && !S.current) return;
          await y(S, be, L);
        }
      }, $ = (S) => {
        P.value && (P.value = null, H.value = JSON.parse(JSON.stringify({ bottom: "", left: "", transform: "" })), a("tooltip-close", S.marker));
      }, g = (S) => {
        _.value.startX = S.changedTouches[0].screenX, _.value.startY = S.changedTouches[0].screenY;
      }, ue = (S) => {
        _.value.endX = S.changedTouches[0].screenX, _.value.endY = S.changedTouches[0].screenY, D();
      }, B = (S) => {
        n.vertical && !n.inline && S.preventDefault();
      }, D = () => {
        const S = n.vertical ? "Y" : "X";
        Math.abs(_.value[`start${S}`] - _.value[`end${S}`]) > 10 && a("handle-swipe", _.value[`start${S}`] > _.value[`end${S}`] ? "right" : "left");
      }, J = (S, be, L) => {
        S && (Array.isArray(Y.value[be]) ? Y.value[be][L] = S : Y.value[be] = [S]), n.arrowNavigation && i(Y.value, "calendar");
      }, s = (S) => {
        n.monthChangeOnScroll && (S.preventDefault(), a("handle-scroll", S));
      }, k = (S) => v.value.type === "local" ? getWeek(S.value, { weekStartsOn: +n.weekStart }) : v.value.type === "iso" ? getISOWeek(S.value) : typeof v.value.type == "function" ? v.value.type(S.value) : "", E = (S) => {
        const be = S[0];
        return v.value.hideOnOffsetDates ? S.some((L) => L.current) ? k(be) : "" : k(be);
      }, u = (S, be, L = true) => {
        L && sn() || !L && !sn() || (!C.value.enabled || h2.value.allowPreventDefault) && (kt(S, h2.value), a("select-date", be));
      }, te = (S) => {
        kt(S, h2.value);
      }, ye = (S) => {
        C.value.enabled && C.value.dragSelect ? (ne.value = true, a("select-date", S)) : C.value.enabled && a("select-date", S);
      };
      return t2({ triggerTransition: O }), (S, be) => (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(p.value)
      }, [
        vue.createElementVNode("div", {
          ref_key: "calendarWrapRef",
          ref: U,
          class: vue.normalizeClass(K.value),
          role: "grid"
        }, [
          vue.createElementVNode("div", Or, [
            S.weekNumbers ? (vue.openBlock(), vue.createElementBlock("div", _r, vue.toDisplayString(S.weekNumName), 1)) : vue.createCommentVNode("", true),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(A.value, (L, se) => {
              var r, le;
              return vue.openBlock(), vue.createElementBlock("div", {
                key: se,
                class: "dp__calendar_header_item",
                role: "gridcell",
                "data-test-id": "calendar-header",
                "aria-label": (le = (r = vue.unref(f)) == null ? void 0 : r.weekDay) == null ? void 0 : le.call(r, se)
              }, [
                S.$slots["calendar-header"] ? vue.renderSlot(S.$slots, "calendar-header", {
                  key: 0,
                  day: L,
                  index: se
                }) : vue.createCommentVNode("", true),
                S.$slots["calendar-header"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  vue.createTextVNode(vue.toDisplayString(L), 1)
                ], 64))
              ], 8, Br);
            }), 128))
          ]),
          be[2] || (be[2] = vue.createElementVNode("div", { class: "dp__calendar_header_separator" }, null, -1)),
          vue.createVNode(vue.Transition, {
            name: R.value,
            css: !!S.transitions
          }, {
            default: vue.withCtx(() => [
              d.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "dp__calendar",
                role: "rowgroup",
                onMouseleave: be[1] || (be[1] = (L) => ne.value = false)
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(x.value, (L, se) => (vue.openBlock(), vue.createElementBlock("div", {
                  key: se,
                  class: "dp__calendar_row",
                  role: "row"
                }, [
                  S.weekNumbers ? (vue.openBlock(), vue.createElementBlock("div", Yr, [
                    vue.createElementVNode("div", Ir, vue.toDisplayString(E(L.days)), 1)
                  ])) : vue.createCommentVNode("", true),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(L.days, (r, le) => {
                    var ie, re, Te;
                    return vue.openBlock(), vue.createElementBlock("div", {
                      id: vue.unref(In)(r.value),
                      ref_for: true,
                      ref: (ke) => J(ke, se, le),
                      key: le + se,
                      role: "gridcell",
                      class: "dp__calendar_item",
                      "aria-pressed": (r.classData.dp__active_date || r.classData.dp__range_start || r.classData.dp__range_start) ?? void 0,
                      "aria-disabled": r.classData.dp__cell_disabled || void 0,
                      "aria-label": (re = (ie = vue.unref(f)) == null ? void 0 : ie.day) == null ? void 0 : re.call(ie, r),
                      tabindex: !r.current && S.hideOffsetDates ? void 0 : 0,
                      "data-test-id": r.value,
                      onClick: vue.withModifiers((ke) => u(ke, r), ["prevent"]),
                      onTouchend: (ke) => u(ke, r, false),
                      onKeydown: (ke) => vue.unref(Xe)(ke, () => S.$emit("select-date", r)),
                      onMouseenter: (ke) => j(r, se, le),
                      onMouseleave: (ke) => $(r),
                      onMousedown: (ke) => ye(r),
                      onMouseup: be[0] || (be[0] = (ke) => ne.value = false)
                    }, [
                      vue.createElementVNode("div", {
                        class: vue.normalizeClass(["dp__cell_inner", r.classData])
                      }, [
                        S.$slots.day && N.value(r) ? vue.renderSlot(S.$slots, "day", {
                          key: 0,
                          day: +r.text,
                          date: r.value
                        }) : vue.createCommentVNode("", true),
                        S.$slots.day ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                          vue.createTextVNode(vue.toDisplayString(r.text), 1)
                        ], 64)),
                        r.marker && N.value(r) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
                          S.$slots.marker ? vue.renderSlot(S.$slots, "marker", {
                            key: 0,
                            marker: r.marker,
                            day: +r.text,
                            date: r.value
                          }) : (vue.openBlock(), vue.createElementBlock("div", {
                            key: 1,
                            class: vue.normalizeClass(fe.value(r.marker)),
                            style: vue.normalizeStyle(r.marker.color ? { backgroundColor: r.marker.color } : {})
                          }, null, 6))
                        ], 64)) : vue.createCommentVNode("", true),
                        ve.value(r.value) ? (vue.openBlock(), vue.createElementBlock("div", {
                          key: 3,
                          ref_for: true,
                          ref_key: "activeTooltip",
                          ref: F,
                          class: "dp__marker_tooltip",
                          style: vue.normalizeStyle(H.value)
                        }, [
                          (Te = r.marker) != null && Te.tooltip ? (vue.openBlock(), vue.createElementBlock("div", {
                            key: 0,
                            class: "dp__tooltip_content",
                            onClick: te
                          }, [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(r.marker.tooltip, (ke, w) => (vue.openBlock(), vue.createElementBlock("div", {
                              key: w,
                              class: "dp__tooltip_text"
                            }, [
                              S.$slots["marker-tooltip"] ? vue.renderSlot(S.$slots, "marker-tooltip", {
                                key: 0,
                                tooltip: ke,
                                day: r.value
                              }) : vue.createCommentVNode("", true),
                              S.$slots["marker-tooltip"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                                vue.createElementVNode("div", {
                                  class: "dp__tooltip_mark",
                                  style: vue.normalizeStyle(ke.color ? { backgroundColor: ke.color } : {})
                                }, null, 4),
                                vue.createElementVNode("div", null, vue.toDisplayString(ke.text), 1)
                              ], 64))
                            ]))), 128)),
                            vue.createElementVNode("div", {
                              class: "dp__arrow_bottom_tp",
                              style: vue.normalizeStyle(Q.value)
                            }, null, 4)
                          ])) : vue.createCommentVNode("", true)
                        ], 4)) : vue.createCommentVNode("", true)
                      ], 2)
                    ], 40, Nr);
                  }), 128))
                ]))), 128))
              ], 32)) : vue.createCommentVNode("", true)
            ]),
            _: 3
          }, 8, ["name", "css"])
        ], 2)
      ], 2));
    }
  }), vn = (e) => Array.isArray(e), Fr = (e, t2, l, a) => {
    const n = vue.ref([]), i = vue.ref(/* @__PURE__ */ new Date()), c = vue.ref(), h2 = () => g(e.isTextInputDate), { modelValue: f, calendars: I, time: v, today: C } = xt(e, t2, h2), {
      defaultedMultiCalendars: m,
      defaultedStartTime: P,
      defaultedRange: H,
      defaultedConfig: Y,
      defaultedTz: U,
      propDates: d,
      defaultedMultiDates: R
    } = _e(e), { validateMonthYearInRange: _, isDisabled: F, isDateRangeAllowed: Q, checkMinMaxRange: ne } = $t(e), { updateTimeValues: x, getSetDateTime: A, setTime: X, assignStartTime: O, validateTime: K, disabledTimesConfig: fe } = Un(e, v, f, a), ve = vue.computed(
      () => (b) => I.value[b] ? I.value[b].month : 0
    ), p = vue.computed(
      () => (b) => I.value[b] ? I.value[b].year : 0
    ), N = (b) => !Y.value.keepViewOnOffsetClick || b ? true : !c.value, ae = (b, oe, M, Z = false) => {
      var de, Qe;
      N(Z) && (I.value[b] || (I.value[b] = { month: 0, year: 0 }), I.value[b].month = on(oe) ? (de = I.value[b]) == null ? void 0 : de.month : oe, I.value[b].year = on(M) ? (Qe = I.value[b]) == null ? void 0 : Qe.year : M);
    }, y = () => {
      e.autoApply && t2("select-date");
    };
    vue.onMounted(() => {
      e.shadow || (f.value || (S(), P.value && O(P.value)), g(true), e.focusStartDate && e.startDate && S());
    });
    const j = vue.computed(() => {
      var b;
      return (b = e.flow) != null && b.length && !e.partialFlow ? e.flowStep === e.flow.length : true;
    }), $ = () => {
      e.autoApply && j.value && t2("auto-apply", e.partialFlow ? e.flowStep !== e.flow.length : false);
    }, g = (b = false) => {
      if (f.value)
        return Array.isArray(f.value) ? (n.value = f.value, E(b)) : D(f.value, b);
      if (m.value.count && b && !e.startDate)
        return B(W(), b);
    }, ue = () => Array.isArray(f.value) && H.value.enabled ? getMonth(f.value[0]) === getMonth(f.value[1] ?? f.value[0]) : false, B = (b = /* @__PURE__ */ new Date(), oe = false) => {
      if ((!m.value.count || !m.value.static || oe) && ae(0, getMonth(b), getYear(b)), m.value.count && (!f.value || ue() || !m.value.solo) && (!m.value.solo || oe))
        for (let M = 1; M < m.value.count; M++) {
          const Z = set(W(), { month: ve.value(M - 1), year: p.value(M - 1) }), de = add(Z, { months: 1 });
          I.value[M] = { month: getMonth(de), year: getYear(de) };
        }
    }, D = (b, oe) => {
      B(b), X("hours", getHours(b)), X("minutes", getMinutes(b)), X("seconds", getSeconds(b)), m.value.count && oe && ye();
    }, J = (b) => {
      if (m.value.count) {
        if (m.value.solo) return 0;
        const oe = getMonth(b[0]), M = getMonth(b[1]);
        return Math.abs(M - oe) < m.value.count ? 0 : 1;
      }
      return 1;
    }, s = (b, oe) => {
      b[1] && H.value.showLastInRange ? B(b[J(b)], oe) : B(b[0], oe);
      const M = (Z, de) => [
        Z(b[0]),
        b[1] ? Z(b[1]) : v[de][1]
      ];
      X("hours", M(getHours, "hours")), X("minutes", M(getMinutes, "minutes")), X("seconds", M(getSeconds, "seconds"));
    }, k = (b, oe) => {
      if ((H.value.enabled || e.weekPicker) && !R.value.enabled)
        return s(b, oe);
      if (R.value.enabled && oe) {
        const M = b[b.length - 1];
        return D(M, oe);
      }
    }, E = (b) => {
      const oe = f.value;
      k(oe, b), m.value.count && m.value.solo && ye();
    }, u = (b, oe) => {
      const M = set(W(), { month: ve.value(oe), year: p.value(oe) }), Z = b < 0 ? addMonths(M, 1) : subMonths(M, 1);
      _(getMonth(Z), getYear(Z), b < 0, e.preventMinMaxNavigation) && (ae(oe, getMonth(Z), getYear(Z)), t2("update-month-year", { instance: oe, month: getMonth(Z), year: getYear(Z) }), m.value.count && !m.value.solo && te(oe), l());
    }, te = (b) => {
      for (let oe = b - 1; oe >= 0; oe--) {
        const M = subMonths(set(W(), { month: ve.value(oe + 1), year: p.value(oe + 1) }), 1);
        ae(oe, getMonth(M), getYear(M));
      }
      for (let oe = b + 1; oe <= m.value.count - 1; oe++) {
        const M = addMonths(set(W(), { month: ve.value(oe - 1), year: p.value(oe - 1) }), 1);
        ae(oe, getMonth(M), getYear(M));
      }
    }, ye = () => {
      if (Array.isArray(f.value) && f.value.length === 2) {
        const b = W(
          W(f.value[1] ? f.value[1] : addMonths(f.value[0], 1))
        ), [oe, M] = [getMonth(f.value[0]), getYear(f.value[0])], [Z, de] = [getMonth(f.value[1]), getYear(f.value[1])];
        (oe !== Z || oe === Z && M !== de) && m.value.solo && ae(1, getMonth(b), getYear(b));
      } else f.value && !Array.isArray(f.value) && (ae(0, getMonth(f.value), getYear(f.value)), B(W()));
    }, S = () => {
      e.startDate && (ae(0, getMonth(W(e.startDate)), getYear(W(e.startDate))), m.value.count && te(0));
    }, be = (b, oe) => {
      if (e.monthChangeOnScroll) {
        const M = (/* @__PURE__ */ new Date()).getTime() - i.value.getTime(), Z = Math.abs(b.deltaY);
        let de = 500;
        Z > 1 && (de = 100), Z > 100 && (de = 0), M > de && (i.value = /* @__PURE__ */ new Date(), u(e.monthChangeOnScroll !== "inverse" ? -b.deltaY : b.deltaY, oe));
      }
    }, L = (b, oe, M = false) => {
      e.monthChangeOnArrows && e.vertical === M && se(b, oe);
    }, se = (b, oe) => {
      u(b === "right" ? -1 : 1, oe);
    }, r = (b) => {
      if (d.value.markers)
        return ua(b.value, d.value.markers);
    }, le = (b, oe) => {
      switch (e.sixWeeks === true ? "append" : e.sixWeeks) {
        case "prepend":
          return [true, false];
        case "center":
          return [b == 0, true];
        case "fair":
          return [b == 0 || oe > b, true];
        case "append":
          return [false, false];
        default:
          return [false, false];
      }
    }, ie = (b, oe, M, Z) => {
      if (e.sixWeeks && b.length < 6) {
        const de = 6 - b.length, Qe = (oe.getDay() + 7 - Z) % 7, Ot = 6 - (M.getDay() + 7 - Z) % 7, [Ht, Da] = le(Qe, Ot);
        for (let At = 1; At <= de; At++)
          if (Da ? !!(At % 2) == Ht : Ht) {
            const ta = b[0].days[0], Ma = re(addDays(ta.value, -7), getMonth(oe));
            b.unshift({ days: Ma });
          } else {
            const ta = b[b.length - 1], Ma = ta.days[ta.days.length - 1], jn = re(addDays(Ma.value, 1), getMonth(oe));
            b.push({ days: jn });
          }
      }
      return b;
    }, re = (b, oe) => {
      const M = W(b), Z = [];
      for (let de = 0; de < 7; de++) {
        const Qe = addDays(M, de), rt = getMonth(Qe) !== oe;
        Z.push({
          text: e.hideOffsetDates && rt ? "" : Qe.getDate(),
          value: Qe,
          current: !rt,
          classData: {}
        });
      }
      return Z;
    }, Te = (b, oe) => {
      const M = [], Z = new Date(oe, b), de = new Date(oe, b + 1, 0), Qe = e.weekStart, rt = startOfWeek(Z, { weekStartsOn: Qe }), Ot = (Ht) => {
        const Da = re(Ht, b);
        if (M.push({ days: Da }), !M[M.length - 1].days.some(
          (At) => Ae(Je(At.value), Je(de))
        )) {
          const At = addDays(Ht, 7);
          Ot(At);
        }
      };
      return Ot(rt), ie(M, Z, de, Qe);
    }, ke = (b) => {
      const oe = wt(W(b.value), v.hours, v.minutes, ct());
      t2("date-update", oe), R.value.enabled ? Xa(oe, f, R.value.limit) : f.value = oe, a(), vue.nextTick().then(() => {
        $();
      });
    }, w = (b) => H.value.noDisabledRange ? Cn(n.value[0], b).some((M) => F(M)) : false, z = () => {
      n.value = f.value ? f.value.slice() : [], n.value.length === 2 && !(H.value.fixedStart || H.value.fixedEnd) && (n.value = []);
    }, ge = (b, oe) => {
      const M = [
        W(b.value),
        addDays(W(b.value), +H.value.autoRange)
      ];
      Q(M) ? (oe && Fe(b.value), n.value = M) : t2("invalid-date", b.value);
    }, Fe = (b) => {
      const oe = getMonth(W(b)), M = getYear(W(b));
      if (ae(0, oe, M), m.value.count > 0)
        for (let Z = 1; Z < m.value.count; Z++) {
          const de = Tl(
            set(W(b), { year: p.value(Z - 1), month: ve.value(Z - 1) })
          );
          ae(Z, de.month, de.year);
        }
    }, dt = (b) => {
      if (w(b.value) || !ne(b.value, f.value, H.value.fixedStart ? 0 : 1))
        return t2("invalid-date", b.value);
      n.value = Ln(W(b.value), f, t2, H);
    }, me = (b, oe) => {
      if (z(), H.value.autoRange) return ge(b, oe);
      if (H.value.fixedStart || H.value.fixedEnd) return dt(b);
      n.value[0] ? ne(W(b.value), f.value) && !w(b.value) ? Be(W(b.value), W(n.value[0])) ? (n.value.unshift(W(b.value)), t2("range-end", n.value[0])) : (n.value[1] = W(b.value), t2("range-end", n.value[1])) : (e.autoApply && t2("auto-apply-invalid", b.value), t2("invalid-date", b.value)) : (n.value[0] = W(b.value), t2("range-start", n.value[0]));
    }, ct = (b = true) => e.enableSeconds ? Array.isArray(v.seconds) ? b ? v.seconds[0] : v.seconds[1] : v.seconds : 0, Ye = (b) => {
      n.value[b] = wt(
        n.value[b],
        v.hours[b],
        v.minutes[b],
        ct(b !== 1)
      );
    }, pa = () => {
      var b, oe;
      n.value[0] && n.value[1] && +((b = n.value) == null ? void 0 : b[0]) > +((oe = n.value) == null ? void 0 : oe[1]) && (n.value.reverse(), t2("range-start", n.value[0]), t2("range-end", n.value[1]));
    }, ya = () => {
      n.value.length && (n.value[0] && !n.value[1] ? Ye(0) : (Ye(0), Ye(1), a()), pa(), f.value = n.value.slice(), va(n.value, t2, e.autoApply, e.modelAuto));
    }, ea = (b, oe = false) => {
      if (F(b.value) || !b.current && e.hideOffsetDates) return t2("invalid-date", b.value);
      if (c.value = JSON.parse(JSON.stringify(b)), !H.value.enabled) return ke(b);
      vn(v.hours) && vn(v.minutes) && !R.value.enabled && (me(b, oe), ya());
    }, ga = (b, oe) => {
      var Z;
      ae(b, oe.month, oe.year, true), m.value.count && !m.value.solo && te(b), t2("update-month-year", { instance: b, month: oe.month, year: oe.year }), l(m.value.solo ? b : void 0);
      const M = (Z = e.flow) != null && Z.length ? e.flow[e.flowStep] : void 0;
      !oe.fromNav && (M === je.month || M === je.year) && a();
    }, ha = (b, oe) => {
      Fn({
        value: b,
        modelValue: f,
        range: H.value.enabled,
        timezone: oe ? void 0 : U.value.timezone
      }), y(), e.multiCalendars && vue.nextTick().then(() => g(true));
    }, ba = () => {
      const b = ja(W(), U.value);
      !H.value.enabled && !R.value.enabled ? f.value = b : f.value && Array.isArray(f.value) && f.value[0] ? R.value.enabled ? f.value = [...f.value, b] : f.value = Be(b, f.value[0]) ? [b, f.value[0]] : [f.value[0], b] : f.value = [b], y();
    }, ka = () => {
      if (Array.isArray(f.value))
        if (R.value.enabled) {
          const b = wa();
          f.value[f.value.length - 1] = A(b);
        } else
          f.value = f.value.map((b, oe) => b && A(b, oe));
      else
        f.value = A(f.value);
      t2("time-update");
    }, wa = () => Array.isArray(f.value) && f.value.length ? f.value[f.value.length - 1] : null;
    return {
      calendars: I,
      modelValue: f,
      month: ve,
      year: p,
      time: v,
      disabledTimesConfig: fe,
      today: C,
      validateTime: K,
      getCalendarDays: Te,
      getMarker: r,
      handleScroll: be,
      handleSwipe: se,
      handleArrow: L,
      selectDate: ea,
      updateMonthYear: ga,
      presetDate: ha,
      selectCurrentDate: ba,
      updateTime: (b, oe = true, M = false) => {
        x(b, oe, M, ka);
      },
      assignMonthAndYear: B
    };
  }, Lr = { key: 0 }, zr = /* @__PURE__ */ vue.defineComponent({
    __name: "DatePicker",
    props: {
      ...it
    },
    emits: [
      "tooltip-open",
      "tooltip-close",
      "mount",
      "update:internal-model-value",
      "update-flow-step",
      "reset-flow",
      "auto-apply",
      "focus-menu",
      "select-date",
      "range-start",
      "range-end",
      "invalid-fixed-range",
      "time-update",
      "am-pm-change",
      "time-picker-open",
      "time-picker-close",
      "recalculate-position",
      "update-month-year",
      "auto-apply-invalid",
      "date-update",
      "invalid-date",
      "overlay-toggle"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, {
        calendars: i,
        month: c,
        year: h2,
        modelValue: f,
        time: I,
        disabledTimesConfig: v,
        today: C,
        validateTime: m,
        getCalendarDays: P,
        getMarker: H,
        handleArrow: Y,
        handleScroll: U,
        handleSwipe: d,
        selectDate: R,
        updateMonthYear: _,
        presetDate: F,
        selectCurrentDate: Q,
        updateTime: ne,
        assignMonthAndYear: x
      } = Fr(n, a, ue, B), A = vue.useSlots(), { setHoverDate: X, getDayClassData: O, clearHoverDate: K } = no(f, n), { defaultedMultiCalendars: fe } = _e(n), ve = vue.ref([]), p = vue.ref([]), N = vue.ref(null), ae = et(A, "calendar"), y = et(A, "monthYear"), j = et(A, "timePicker"), $ = (L) => {
        n.shadow || a("mount", L);
      };
      vue.watch(
        i,
        () => {
          n.shadow || setTimeout(() => {
            a("recalculate-position");
          }, 0);
        },
        { deep: true }
      ), vue.watch(
        fe,
        (L, se) => {
          L.count - se.count > 0 && x();
        },
        { deep: true }
      );
      const g = vue.computed(() => (L) => P(c.value(L), h2.value(L)).map((se) => ({
        ...se,
        days: se.days.map((r) => (r.marker = H(r), r.classData = O(r), r))
      })));
      function ue(L) {
        var se;
        L || L === 0 ? (se = p.value[L]) == null || se.triggerTransition(c.value(L), h2.value(L)) : p.value.forEach((r, le) => r.triggerTransition(c.value(le), h2.value(le)));
      }
      function B() {
        a("update-flow-step");
      }
      const D = (L, se = false) => {
        R(L, se), n.spaceConfirm && a("select-date");
      }, J = (L, se, r = 0) => {
        var le;
        (le = ve.value[r]) == null || le.toggleMonthPicker(L, se);
      }, s = (L, se, r = 0) => {
        var le;
        (le = ve.value[r]) == null || le.toggleYearPicker(L, se);
      }, k = (L, se, r) => {
        var le;
        (le = N.value) == null || le.toggleTimePicker(L, se, r);
      }, E = (L, se) => {
        var r;
        if (!n.range) {
          const le = f.value ? f.value : C, ie = se ? new Date(se) : le, re = L ? startOfWeek(ie, { weekStartsOn: 1 }) : endOfWeek(ie, { weekStartsOn: 1 });
          R({
            value: re,
            current: getMonth(ie) === c.value(0),
            text: "",
            classData: {}
          }), (r = document.getElementById(In(re))) == null || r.focus();
        }
      }, u = (L) => {
        var se;
        (se = ve.value[0]) == null || se.handleMonthYearChange(L, true);
      }, te = (L) => {
        _(0, { month: c.value(0), year: h2.value(0) + (L ? 1 : -1), fromNav: true });
      }, ye = (L, se) => {
        L === je.time && a(`time-picker-${se ? "open" : "close"}`), a("overlay-toggle", { open: se, overlay: L });
      }, S = (L) => {
        a("overlay-toggle", { open: false, overlay: L }), a("focus-menu");
      };
      return t2({
        clearHoverDate: K,
        presetDate: F,
        selectCurrentDate: Q,
        toggleMonthPicker: J,
        toggleYearPicker: s,
        toggleTimePicker: k,
        handleArrow: Y,
        updateMonthYear: _,
        getSidebarProps: () => ({
          modelValue: f,
          month: c,
          year: h2,
          time: I,
          updateTime: ne,
          updateMonthYear: _,
          selectDate: R,
          presetDate: F
        }),
        changeMonth: u,
        changeYear: te,
        selectWeekDate: E
      }), (L, se) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
        vue.createVNode(fa, {
          "multi-calendars": vue.unref(fe).count,
          collapse: L.collapse,
          "is-mobile": L.isMobile
        }, {
          default: vue.withCtx(({ instance: r, index: le }) => [
            L.disableMonthYearSelect ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(Cr, vue.mergeProps({
              key: 0,
              ref: (ie) => {
                ie && (ve.value[le] = ie);
              },
              months: vue.unref($n)(L.formatLocale, L.locale, L.monthNameFormat),
              years: vue.unref(Ka)(L.yearRange, L.locale, L.reverseYears),
              month: vue.unref(c)(r),
              year: vue.unref(h2)(r),
              instance: r
            }, L.$props, {
              onMount: se[0] || (se[0] = (ie) => $(vue.unref(Pt).header)),
              onResetFlow: se[1] || (se[1] = (ie) => L.$emit("reset-flow")),
              onUpdateMonthYear: (ie) => vue.unref(_)(r, ie),
              onOverlayClosed: S,
              onOverlayOpened: se[2] || (se[2] = (ie) => L.$emit("overlay-toggle", { open: true, overlay: ie }))
            }), vue.createSlots({ _: 2 }, [
              vue.renderList(vue.unref(y), (ie, re) => ({
                name: ie,
                fn: vue.withCtx((Te) => [
                  vue.renderSlot(L.$slots, ie, vue.normalizeProps(vue.guardReactiveProps(Te)))
                ])
              }))
            ]), 1040, ["months", "years", "month", "year", "instance", "onUpdateMonthYear"])),
            vue.createVNode(Er, vue.mergeProps({
              ref: (ie) => {
                ie && (p.value[le] = ie);
              },
              "mapped-dates": g.value(r),
              month: vue.unref(c)(r),
              year: vue.unref(h2)(r),
              instance: r
            }, L.$props, {
              onSelectDate: (ie) => vue.unref(R)(ie, r !== 1),
              onHandleSpace: (ie) => D(ie, r !== 1),
              onSetHoverDate: se[3] || (se[3] = (ie) => vue.unref(X)(ie)),
              onHandleScroll: (ie) => vue.unref(U)(ie, r),
              onHandleSwipe: (ie) => vue.unref(d)(ie, r),
              onMount: se[4] || (se[4] = (ie) => $(vue.unref(Pt).calendar)),
              onResetFlow: se[5] || (se[5] = (ie) => L.$emit("reset-flow")),
              onTooltipOpen: se[6] || (se[6] = (ie) => L.$emit("tooltip-open", ie)),
              onTooltipClose: se[7] || (se[7] = (ie) => L.$emit("tooltip-close", ie))
            }), vue.createSlots({ _: 2 }, [
              vue.renderList(vue.unref(ae), (ie, re) => ({
                name: ie,
                fn: vue.withCtx((Te) => [
                  vue.renderSlot(L.$slots, ie, vue.normalizeProps(vue.guardReactiveProps({ ...Te })))
                ])
              }))
            ]), 1040, ["mapped-dates", "month", "year", "instance", "onSelectDate", "onHandleSpace", "onHandleScroll", "onHandleSwipe"])
          ]),
          _: 3
        }, 8, ["multi-calendars", "collapse", "is-mobile"]),
        L.enableTimePicker ? (vue.openBlock(), vue.createElementBlock("div", Lr, [
          L.$slots["time-picker"] ? vue.renderSlot(L.$slots, "time-picker", vue.normalizeProps(vue.mergeProps({ key: 0 }, { time: vue.unref(I), updateTime: vue.unref(ne) }))) : (vue.openBlock(), vue.createBlock(Hn, vue.mergeProps({
            key: 1,
            ref_key: "timePickerRef",
            ref: N
          }, L.$props, {
            hours: vue.unref(I).hours,
            minutes: vue.unref(I).minutes,
            seconds: vue.unref(I).seconds,
            "internal-model-value": L.internalModelValue,
            "disabled-times-config": vue.unref(v),
            "validate-time": vue.unref(m),
            onMount: se[8] || (se[8] = (r) => $(vue.unref(Pt).timePicker)),
            "onUpdate:hours": se[9] || (se[9] = (r) => vue.unref(ne)(r)),
            "onUpdate:minutes": se[10] || (se[10] = (r) => vue.unref(ne)(r, false)),
            "onUpdate:seconds": se[11] || (se[11] = (r) => vue.unref(ne)(r, false, true)),
            onResetFlow: se[12] || (se[12] = (r) => L.$emit("reset-flow")),
            onOverlayClosed: se[13] || (se[13] = (r) => ye(r, false)),
            onOverlayOpened: se[14] || (se[14] = (r) => ye(r, true)),
            onAmPmChange: se[15] || (se[15] = (r) => L.$emit("am-pm-change", r))
          }), vue.createSlots({ _: 2 }, [
            vue.renderList(vue.unref(j), (r, le) => ({
              name: r,
              fn: vue.withCtx((ie) => [
                vue.renderSlot(L.$slots, r, vue.normalizeProps(vue.guardReactiveProps(ie)))
              ])
            }))
          ]), 1040, ["hours", "minutes", "seconds", "internal-model-value", "disabled-times-config", "validate-time"]))
        ])) : vue.createCommentVNode("", true)
      ], 64));
    }
  }), Hr = (e, t2) => {
    const l = vue.ref(), {
      defaultedMultiCalendars: a,
      defaultedConfig: n,
      defaultedHighlight: i,
      defaultedRange: c,
      propDates: h2,
      defaultedFilters: f,
      defaultedMultiDates: I
    } = _e(e), { modelValue: v, year: C, month: m, calendars: P } = xt(e, t2), { isDisabled: H } = $t(e), { selectYear: Y, groupedYears: U, showYearPicker: d, isDisabled: R, toggleYearPicker: _, handleYearSelect: F, handleYear: Q } = zn({
      modelValue: v,
      multiCalendars: a,
      range: c,
      highlight: i,
      calendars: P,
      propDates: h2,
      month: m,
      year: C,
      filters: f,
      props: e,
      emit: t2
    }), ne = (y, j) => [y, j].map(($) => format($, "MMMM", { locale: e.formatLocale })).join("-"), x = vue.computed(() => (y) => v.value ? Array.isArray(v.value) ? v.value.some((j) => isSameQuarter(y, j)) : isSameQuarter(v.value, y) : false), A = (y) => {
      if (c.value.enabled) {
        if (Array.isArray(v.value)) {
          const j = Ae(y, v.value[0]) || Ae(y, v.value[1]);
          return da(v.value, l.value, y) && !j;
        }
        return false;
      }
      return false;
    }, X = (y, j) => y.quarter === getQuarter(j) && y.year === getYear(j), O = (y) => typeof i.value == "function" ? i.value({ quarter: getQuarter(y), year: getYear(y) }) : !!i.value.quarters.find((j) => X(j, y)), K = vue.computed(() => (y) => {
      const j = set(/* @__PURE__ */ new Date(), { year: C.value(y) });
      return eachQuarterOfInterval({
        start: startOfYear(j),
        end: endOfYear(j)
      }).map(($) => {
        const g = startOfQuarter($), ue = endOfQuarter($), B = H($), D = A(g), J = O(g);
        return {
          text: ne(g, ue),
          value: g,
          active: x.value(g),
          highlighted: J,
          disabled: B,
          isBetween: D
        };
      });
    }), fe = (y) => {
      Xa(y, v, I.value.limit), t2("auto-apply", true);
    }, ve = (y) => {
      v.value = Ja(v, y, t2), va(v.value, t2, e.autoApply, e.modelAuto);
    }, p = (y) => {
      v.value = y, t2("auto-apply");
    };
    return {
      defaultedConfig: n,
      defaultedMultiCalendars: a,
      groupedYears: U,
      year: C,
      isDisabled: R,
      quarters: K,
      showYearPicker: d,
      modelValue: v,
      setHoverDate: (y) => {
        l.value = y;
      },
      selectYear: Y,
      selectQuarter: (y, j, $) => {
        if (!$)
          return P.value[j].month = getMonth(endOfQuarter(y)), I.value.enabled ? fe(y) : c.value.enabled ? ve(y) : p(y);
      },
      toggleYearPicker: _,
      handleYearSelect: F,
      handleYear: Q
    };
  }, Ur = { class: "dp--quarter-items" }, Wr = ["data-test-id", "disabled", "onClick", "onMouseover"], Vr = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "QuarterPicker",
    props: {
      ...it
    },
    emits: [
      "update:internal-model-value",
      "reset-flow",
      "overlay-closed",
      "auto-apply",
      "range-start",
      "range-end",
      "overlay-toggle",
      "update-month-year"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, i = vue.useSlots(), c = et(i, "yearMode"), {
        defaultedMultiCalendars: h2,
        defaultedConfig: f,
        groupedYears: I,
        year: v,
        isDisabled: C,
        quarters: m,
        modelValue: P,
        showYearPicker: H,
        setHoverDate: Y,
        selectQuarter: U,
        toggleYearPicker: d,
        handleYearSelect: R,
        handleYear: _
      } = Hr(n, a);
      return t2({ getSidebarProps: () => ({
        modelValue: P,
        year: v,
        selectQuarter: U,
        handleYearSelect: R,
        handleYear: _
      }) }), (Q, ne) => (vue.openBlock(), vue.createBlock(fa, {
        "multi-calendars": vue.unref(h2).count,
        collapse: Q.collapse,
        stretch: "",
        "is-mobile": Q.isMobile
      }, {
        default: vue.withCtx(({ instance: x }) => [
          vue.createElementVNode("div", {
            class: "dp-quarter-picker-wrap",
            style: vue.normalizeStyle({ minHeight: `${vue.unref(f).modeHeight}px` })
          }, [
            Q.$slots["top-extra"] ? vue.renderSlot(Q.$slots, "top-extra", {
              key: 0,
              value: Q.internalModelValue
            }) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", null, [
              vue.createVNode(En, vue.mergeProps(Q.$props, {
                items: vue.unref(I)(x),
                instance: x,
                "show-year-picker": vue.unref(H)[x],
                year: vue.unref(v)(x),
                "is-disabled": (A) => vue.unref(C)(x, A),
                onHandleYear: (A) => vue.unref(_)(x, A),
                onYearSelect: (A) => vue.unref(R)(A, x),
                onToggleYearPicker: (A) => vue.unref(d)(x, A == null ? void 0 : A.flow, A == null ? void 0 : A.show)
              }), vue.createSlots({ _: 2 }, [
                vue.renderList(vue.unref(c), (A, X) => ({
                  name: A,
                  fn: vue.withCtx((O) => [
                    vue.renderSlot(Q.$slots, A, vue.normalizeProps(vue.guardReactiveProps(O)))
                  ])
                }))
              ]), 1040, ["items", "instance", "show-year-picker", "year", "is-disabled", "onHandleYear", "onYearSelect", "onToggleYearPicker"])
            ]),
            vue.createElementVNode("div", Ur, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(m)(x), (A, X) => (vue.openBlock(), vue.createElementBlock("div", { key: X }, [
                vue.createElementVNode("button", {
                  type: "button",
                  class: vue.normalizeClass(["dp--qr-btn", {
                    "dp--qr-btn-active": A.active,
                    "dp--qr-btn-between": A.isBetween,
                    "dp--qr-btn-disabled": A.disabled,
                    "dp--highlighted": A.highlighted
                  }]),
                  "data-test-id": A.value,
                  disabled: A.disabled,
                  onClick: (O) => vue.unref(U)(A.value, x, A.disabled),
                  onMouseover: (O) => vue.unref(Y)(A.value)
                }, [
                  Q.$slots.quarter ? vue.renderSlot(Q.$slots, "quarter", {
                    key: 0,
                    value: A.value,
                    text: A.text
                  }) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    vue.createTextVNode(vue.toDisplayString(A.text), 1)
                  ], 64))
                ], 42, Wr)
              ]))), 128))
            ])
          ], 4)
        ]),
        _: 3
      }, 8, ["multi-calendars", "collapse", "is-mobile"]));
    }
  }), Wn = (e, t2) => {
    const l = vue.ref(0);
    vue.onMounted(() => {
      a(), window.addEventListener("resize", a, { passive: true });
    }), vue.onUnmounted(() => {
      window.removeEventListener("resize", a);
    });
    const a = () => {
      l.value = window.document.documentElement.clientWidth;
    };
    return {
      isMobile: vue.computed(
        () => l.value <= e.value.mobileBreakpoint && !t2 ? true : void 0
      )
    };
  }, jr = ["id", "tabindex", "role", "aria-label"], Kr = {
    key: 0,
    class: "dp--menu-load-container"
  }, Gr = {
    key: 1,
    class: "dp--menu-header"
  }, Qr = ["data-dp-mobile"], qr = {
    key: 0,
    class: "dp__sidebar_left"
  }, Xr = ["data-dp-mobile"], Jr = ["data-test-id", "data-dp-mobile", "onClick", "onKeydown"], Zr = {
    key: 2,
    class: "dp__sidebar_right"
  }, xr = {
    key: 3,
    class: "dp__action_extra"
  }, mn = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "DatepickerMenu",
    props: {
      ...ca,
      shadow: { type: Boolean, default: false },
      openOnTop: { type: Boolean, default: false },
      internalModelValue: { type: [Date, Array], default: null },
      noOverlayFocus: { type: Boolean, default: false },
      collapse: { type: Boolean, default: false },
      getInputRect: { type: Function, default: () => ({}) },
      isTextInputDate: { type: Boolean, default: false }
    },
    emits: [
      "close-picker",
      "select-date",
      "auto-apply",
      "time-update",
      "flow-step",
      "update-month-year",
      "invalid-select",
      "update:internal-model-value",
      "recalculate-position",
      "invalid-fixed-range",
      "tooltip-open",
      "tooltip-close",
      "time-picker-open",
      "time-picker-close",
      "am-pm-change",
      "range-start",
      "range-end",
      "auto-apply-invalid",
      "date-update",
      "invalid-date",
      "overlay-toggle",
      "menu-blur"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, i = vue.ref(null), c = vue.computed(() => {
        const { openOnTop: w, ...z } = n;
        return {
          ...z,
          isMobile: Y.value,
          flowStep: K.value,
          menuWrapRef: i.value
        };
      }), { setMenuFocused: h2, setShiftKey: f, control: I } = Nn(), v = vue.useSlots(), { defaultedTextInput: C, defaultedInline: m, defaultedConfig: P, defaultedUI: H } = _e(n), { isMobile: Y } = Wn(P, n.shadow), U = vue.ref(null), d = vue.ref(0), R = vue.ref(null), _ = vue.ref(false), F = vue.ref(null), Q = vue.ref(false);
      vue.onMounted(() => {
        if (!n.shadow) {
          _.value = true, ne(), window.addEventListener("resize", ne);
          const w = Le(i);
          if (w && !C.value.enabled && !m.value.enabled && (h2(true), j()), w) {
            const z = (ge) => {
              Q.value = true, P.value.allowPreventDefault && ge.preventDefault(), kt(ge, P.value, true);
            };
            w.addEventListener("pointerdown", z), w.addEventListener("mousedown", z);
          }
        }
        document.addEventListener("mousedown", ke);
      }), vue.onUnmounted(() => {
        window.removeEventListener("resize", ne), document.addEventListener("mousedown", ke);
      });
      const ne = () => {
        const w = Le(R);
        w && (d.value = w.getBoundingClientRect().width);
      }, { arrowRight: x, arrowLeft: A, arrowDown: X, arrowUp: O } = Mt(), { flowStep: K, updateFlowStep: fe, childMount: ve, resetFlow: p, handleFlow: N } = lo(n, a, F), ae = vue.computed(() => n.monthPicker ? ur : n.yearPicker ? dr : n.timePicker ? $r : n.quarterPicker ? Vr : zr), y = vue.computed(() => {
        var ge;
        if (P.value.arrowLeft) return P.value.arrowLeft;
        const w = (ge = i.value) == null ? void 0 : ge.getBoundingClientRect(), z = n.getInputRect();
        return (z == null ? void 0 : z.width) < (d == null ? void 0 : d.value) && (z == null ? void 0 : z.left) <= ((w == null ? void 0 : w.left) ?? 0) ? `${(z == null ? void 0 : z.width) / 2}px` : (z == null ? void 0 : z.right) >= ((w == null ? void 0 : w.right) ?? 0) && (z == null ? void 0 : z.width) < (d == null ? void 0 : d.value) ? `${(d == null ? void 0 : d.value) - (z == null ? void 0 : z.width) / 2}px` : "50%";
      }), j = () => {
        const w = Le(i);
        w && w.focus({ preventScroll: true });
      }, $ = vue.computed(() => {
        var w;
        return ((w = F.value) == null ? void 0 : w.getSidebarProps()) || {};
      }), g = () => {
        n.openOnTop && a("recalculate-position");
      }, ue = et(v, "action"), B = vue.computed(() => n.monthPicker || n.yearPicker ? et(v, "monthYear") : n.timePicker ? et(v, "timePicker") : et(v, "shared")), D = vue.computed(() => n.openOnTop ? "dp__arrow_bottom" : "dp__arrow_top"), J = vue.computed(() => ({
        dp__menu_disabled: n.disabled,
        dp__menu_readonly: n.readonly,
        "dp-menu-loading": n.loading
      })), s = vue.computed(
        () => ({
          dp__menu: true,
          dp__menu_index: !m.value.enabled,
          dp__relative: m.value.enabled,
          ...H.value.menu ?? {}
        })
      ), k = (w) => {
        kt(w, P.value, true);
      }, E = () => {
        n.escClose && a("close-picker");
      }, u = (w) => {
        if (n.arrowNavigation) {
          if (w === qe.up) return O();
          if (w === qe.down) return X();
          if (w === qe.left) return A();
          if (w === qe.right) return x();
        } else w === qe.left || w === qe.up ? L("handleArrow", qe.left, 0, w === qe.up) : L("handleArrow", qe.right, 0, w === qe.down);
      }, te = (w) => {
        f(w.shiftKey), !n.disableMonthYearSelect && w.code === Ce.tab && w.target.classList.contains("dp__menu") && I.value.shiftKeyInMenu && (w.preventDefault(), kt(w, P.value, true), a("close-picker"));
      }, ye = () => {
        j(), a("time-picker-close");
      }, S = (w) => {
        var z, ge, Fe;
        (z = F.value) == null || z.toggleTimePicker(false, false), (ge = F.value) == null || ge.toggleMonthPicker(false, false, w), (Fe = F.value) == null || Fe.toggleYearPicker(false, false, w);
      }, be = (w, z = 0) => {
        var ge, Fe, dt;
        return w === "month" ? (ge = F.value) == null ? void 0 : ge.toggleMonthPicker(false, true, z) : w === "year" ? (Fe = F.value) == null ? void 0 : Fe.toggleYearPicker(false, true, z) : w === "time" ? (dt = F.value) == null ? void 0 : dt.toggleTimePicker(true, false) : S(z);
      }, L = (w, ...z) => {
        var ge, Fe;
        (ge = F.value) != null && ge[w] && ((Fe = F.value) == null || Fe[w](...z));
      }, se = () => {
        L("selectCurrentDate");
      }, r = (w, z) => {
        L("presetDate", w, z);
      }, le = () => {
        L("clearHoverDate");
      }, ie = (w, z) => {
        L("updateMonthYear", w, z);
      }, re = (w, z) => {
        w.preventDefault(), u(z);
      }, Te = (w) => {
        var z, ge, Fe;
        if (te(w), w.key === Ce.home || w.key === Ce.end)
          return L(
            "selectWeekDate",
            w.key === Ce.home,
            w.target.getAttribute("id")
          );
        switch ((w.key === Ce.pageUp || w.key === Ce.pageDown) && (w.shiftKey ? (L("changeYear", w.key === Ce.pageUp), (z = Ea(i.value, "overlay-year")) == null || z.focus()) : (L("changeMonth", w.key === Ce.pageUp), (ge = Ea(i.value, w.key === Ce.pageUp ? "action-prev" : "action-next")) == null || ge.focus()), w.target.getAttribute("id") && ((Fe = i.value) == null || Fe.focus({ preventScroll: true }))), w.key) {
          case Ce.esc:
            return E();
          case Ce.arrowLeft:
            return re(w, qe.left);
          case Ce.arrowRight:
            return re(w, qe.right);
          case Ce.arrowUp:
            return re(w, qe.up);
          case Ce.arrowDown:
            return re(w, qe.down);
          default:
            return;
        }
      }, ke = (w) => {
        var z;
        m.value.enabled && !m.value.input && !((z = i.value) != null && z.contains(w.target)) && Q.value && (Q.value = false, a("menu-blur"));
      };
      return t2({
        updateMonthYear: ie,
        switchView: be,
        handleFlow: N
      }), (w, z) => {
        var ge, Fe, dt;
        return vue.openBlock(), vue.createElementBlock("div", {
          id: w.uid ? `dp-menu-${w.uid}` : void 0,
          ref_key: "dpMenuRef",
          ref: i,
          tabindex: vue.unref(m).enabled ? void 0 : "0",
          role: vue.unref(m).enabled ? void 0 : "dialog",
          "aria-label": (ge = w.ariaLabels) == null ? void 0 : ge.menu,
          class: vue.normalizeClass(s.value),
          style: vue.normalizeStyle({ "--dp-arrow-left": y.value }),
          onMouseleave: le,
          onClick: k,
          onKeydown: Te
        }, [
          (w.disabled || w.readonly) && vue.unref(m).enabled || w.loading ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(J.value)
          }, [
            w.loading ? (vue.openBlock(), vue.createElementBlock("div", Kr, z[19] || (z[19] = [
              vue.createElementVNode("span", { class: "dp--menu-loader" }, null, -1)
            ]))) : vue.createCommentVNode("", true)
          ], 2)) : vue.createCommentVNode("", true),
          w.$slots["menu-header"] ? (vue.openBlock(), vue.createElementBlock("div", Gr, [
            vue.renderSlot(w.$slots, "menu-header")
          ])) : vue.createCommentVNode("", true),
          !vue.unref(m).enabled && !w.teleportCenter ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: vue.normalizeClass(D.value)
          }, null, 2)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            ref_key: "innerMenuRef",
            ref: R,
            class: vue.normalizeClass({
              dp__menu_content_wrapper: ((Fe = w.presetDates) == null ? void 0 : Fe.length) || !!w.$slots["left-sidebar"] || !!w.$slots["right-sidebar"],
              "dp--menu-content-wrapper-collapsed": e.collapse && (((dt = w.presetDates) == null ? void 0 : dt.length) || !!w.$slots["left-sidebar"] || !!w.$slots["right-sidebar"])
            }),
            "data-dp-mobile": vue.unref(Y),
            style: vue.normalizeStyle({ "--dp-menu-width": `${d.value}px` })
          }, [
            w.$slots["left-sidebar"] ? (vue.openBlock(), vue.createElementBlock("div", qr, [
              vue.renderSlot(w.$slots, "left-sidebar", vue.normalizeProps(vue.guardReactiveProps($.value)))
            ])) : vue.createCommentVNode("", true),
            w.presetDates.length ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: vue.normalizeClass({ "dp--preset-dates-collapsed": e.collapse, "dp--preset-dates": true }),
              "data-dp-mobile": vue.unref(Y)
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(w.presetDates, (me, ct) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: ct }, [
                me.slot ? vue.renderSlot(w.$slots, me.slot, {
                  key: 0,
                  presetDate: r,
                  label: me.label,
                  value: me.value
                }) : (vue.openBlock(), vue.createElementBlock("button", {
                  key: 1,
                  type: "button",
                  style: vue.normalizeStyle(me.style || {}),
                  class: vue.normalizeClass(["dp__btn dp--preset-range", { "dp--preset-range-collapsed": e.collapse }]),
                  "data-test-id": me.testId ?? void 0,
                  "data-dp-mobile": vue.unref(Y),
                  onClick: vue.withModifiers((Ye) => r(me.value, me.noTz), ["prevent"]),
                  onKeydown: (Ye) => vue.unref(Xe)(Ye, () => r(me.value, me.noTz), true)
                }, vue.toDisplayString(me.label), 47, Jr))
              ], 64))), 128))
            ], 10, Xr)) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", {
              ref_key: "calendarWrapperRef",
              ref: U,
              class: "dp__instance_calendar",
              role: "document"
            }, [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(ae.value), vue.mergeProps({
                ref_key: "dynCmpRef",
                ref: F
              }, c.value, {
                "flow-step": vue.unref(K),
                onMount: vue.unref(ve),
                onUpdateFlowStep: vue.unref(fe),
                onResetFlow: vue.unref(p),
                onFocusMenu: j,
                onSelectDate: z[0] || (z[0] = (me) => w.$emit("select-date")),
                onDateUpdate: z[1] || (z[1] = (me) => w.$emit("date-update", me)),
                onTooltipOpen: z[2] || (z[2] = (me) => w.$emit("tooltip-open", me)),
                onTooltipClose: z[3] || (z[3] = (me) => w.$emit("tooltip-close", me)),
                onAutoApply: z[4] || (z[4] = (me) => w.$emit("auto-apply", me)),
                onRangeStart: z[5] || (z[5] = (me) => w.$emit("range-start", me)),
                onRangeEnd: z[6] || (z[6] = (me) => w.$emit("range-end", me)),
                onInvalidFixedRange: z[7] || (z[7] = (me) => w.$emit("invalid-fixed-range", me)),
                onTimeUpdate: z[8] || (z[8] = (me) => w.$emit("time-update")),
                onAmPmChange: z[9] || (z[9] = (me) => w.$emit("am-pm-change", me)),
                onTimePickerOpen: z[10] || (z[10] = (me) => w.$emit("time-picker-open", me)),
                onTimePickerClose: ye,
                onRecalculatePosition: g,
                onUpdateMonthYear: z[11] || (z[11] = (me) => w.$emit("update-month-year", me)),
                onAutoApplyInvalid: z[12] || (z[12] = (me) => w.$emit("auto-apply-invalid", me)),
                onInvalidDate: z[13] || (z[13] = (me) => w.$emit("invalid-date", me)),
                onOverlayToggle: z[14] || (z[14] = (me) => w.$emit("overlay-toggle", me)),
                "onUpdate:internalModelValue": z[15] || (z[15] = (me) => w.$emit("update:internal-model-value", me))
              }), vue.createSlots({ _: 2 }, [
                vue.renderList(B.value, (me, ct) => ({
                  name: me,
                  fn: vue.withCtx((Ye) => [
                    vue.renderSlot(w.$slots, me, vue.normalizeProps(vue.guardReactiveProps({ ...Ye })))
                  ])
                }))
              ]), 1040, ["flow-step", "onMount", "onUpdateFlowStep", "onResetFlow"]))
            ], 512),
            w.$slots["right-sidebar"] ? (vue.openBlock(), vue.createElementBlock("div", Zr, [
              vue.renderSlot(w.$slots, "right-sidebar", vue.normalizeProps(vue.guardReactiveProps($.value)))
            ])) : vue.createCommentVNode("", true),
            w.$slots["action-extra"] ? (vue.openBlock(), vue.createElementBlock("div", xr, [
              w.$slots["action-extra"] ? vue.renderSlot(w.$slots, "action-extra", {
                key: 0,
                selectCurrentDate: se
              }) : vue.createCommentVNode("", true)
            ])) : vue.createCommentVNode("", true)
          ], 14, Qr),
          !w.autoApply || vue.unref(P).keepActionRow ? (vue.openBlock(), vue.createBlock(xl, vue.mergeProps({
            key: 3,
            "menu-mount": _.value
          }, c.value, {
            "calendar-width": d.value,
            onClosePicker: z[16] || (z[16] = (me) => w.$emit("close-picker")),
            onSelectDate: z[17] || (z[17] = (me) => w.$emit("select-date")),
            onInvalidSelect: z[18] || (z[18] = (me) => w.$emit("invalid-select")),
            onSelectNow: se
          }), vue.createSlots({ _: 2 }, [
            vue.renderList(vue.unref(ue), (me, ct) => ({
              name: me,
              fn: vue.withCtx((Ye) => [
                vue.renderSlot(w.$slots, me, vue.normalizeProps(vue.guardReactiveProps({ ...Ye })))
              ])
            }))
          ]), 1040, ["menu-mount", "calendar-width"])) : vue.createCommentVNode("", true)
        ], 46, jr);
      };
    }
  });
  var Bt = /* @__PURE__ */ ((e) => (e.center = "center", e.left = "left", e.right = "right", e))(Bt || {});
  const eo = ({
    menuRef: e,
    menuRefInner: t2,
    inputRef: l,
    pickerWrapperRef: a,
    inline: n,
    emit: i,
    props: c,
    slots: h$1
  }) => {
    const { defaultedConfig: f } = _e(c), I = vue.ref({}), v = vue.ref(false), C = vue.ref({
      top: "0",
      left: "0"
    }), m = vue.ref(false), P = vue.toRef(c, "teleportCenter");
    vue.watch(P, () => {
      C.value = JSON.parse(JSON.stringify({})), Q();
    });
    const H = (y) => {
      if (c.teleport) {
        const j = y.getBoundingClientRect();
        return {
          left: j.left + window.scrollX,
          top: j.top + window.scrollY
        };
      }
      return { top: 0, left: 0 };
    }, Y = (y, j) => {
      C.value.left = `${y + j - I.value.width}px`;
    }, U = (y) => {
      C.value.left = `${y}px`;
    }, d = (y, j) => {
      c.position === Bt.left && U(y), c.position === Bt.right && Y(y, j), c.position === Bt.center && (C.value.left = `${y + j / 2 - I.value.width / 2}px`);
    }, R = (y) => {
      const { width: j, height: $ } = y.getBoundingClientRect(), { top: g, left: ue } = H(y);
      return { top: +g, left: +ue, width: j, height: $ };
    }, _ = () => {
      C.value.left = "50%", C.value.top = "50%", C.value.transform = "translate(-50%, -50%)", C.value.position = "fixed", delete C.value.opacity;
    }, F = () => {
      const y = Le(l);
      C.value = c.altPosition(y);
    }, Q = (y = true) => {
      var j;
      if (!n.value.enabled) {
        if (P.value) return _();
        if (c.altPosition !== null) return F();
        if (y) {
          const $ = c.teleport ? (j = t2.value) == null ? void 0 : j.$el : e.value;
          $ && (I.value = $.getBoundingClientRect()), i("recalculate-position");
        }
        return fe();
      }
    }, ne = ({ inputEl: y, left: j, width: $ }) => {
      window.screen.width > 768 && !v.value && d(j, $), X(y);
    }, x = (y) => {
      const { top: j, left: $, height: g, width: ue } = R(y);
      C.value.top = `${g + j + +c.offset}px`, m.value = false, v.value || (C.value.left = `${$ + ue / 2 - I.value.width / 2}px`), ne({ inputEl: y, left: $, width: ue });
    }, A = (y) => {
      const { top: j, left: $, width: g } = R(y);
      C.value.top = `${j - +c.offset - I.value.height}px`, m.value = true, ne({ inputEl: y, left: $, width: g });
    }, X = (y) => {
      if (c.autoPosition) {
        const { left: j, width: $ } = R(y), { left: g, right: ue } = I.value;
        if (!v.value) {
          if (Math.abs(g) !== Math.abs(ue)) {
            if (g <= 0)
              return v.value = true, U(j);
            if (ue >= document.documentElement.clientWidth)
              return v.value = true, Y(j, $);
          }
          return d(j, $);
        }
      }
    }, O = () => {
      const y = Le(l);
      if (y) {
        if (c.autoPosition === st.top) return st.top;
        if (c.autoPosition === st.bottom) return st.bottom;
        const { height: j } = I.value, { top: $, height: g } = y.getBoundingClientRect(), B = window.innerHeight - $ - g, D = $;
        return j <= B ? st.bottom : j > B && j <= D ? st.top : B >= D ? st.bottom : st.top;
      }
      return st.bottom;
    }, K = (y) => O() === st.bottom ? x(y) : A(y), fe = () => {
      const y = Le(l);
      if (y)
        return c.autoPosition ? K(y) : x(y);
    }, ve = function(y) {
      if (y) {
        const j = y.scrollHeight > y.clientHeight, g = window.getComputedStyle(y).overflowY.indexOf("hidden") !== -1;
        return j && !g;
      }
      return true;
    }, p = function(y) {
      return !y || y === document.body || y.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? window : ve(y) ? y : p(
        y.assignedSlot && f.value.shadowDom ? y.assignedSlot.parentNode : y.parentNode
      );
    }, N = (y) => {
      if (y)
        switch (c.position) {
          case Bt.left:
            return { left: 0, transform: "translateX(0)" };
          case Bt.right:
            return { left: `${y.width}px`, transform: "translateX(-100%)" };
          default:
            return { left: `${y.width / 2}px`, transform: "translateX(-50%)" };
        }
      return {};
    };
    return {
      openOnTop: m,
      menuStyle: C,
      xCorrect: v,
      setMenuPosition: Q,
      getScrollableParent: p,
      shadowRender: (y, j) => {
        var s, k, E;
        const $ = document.createElement("div"), g = (s = Le(l)) == null ? void 0 : s.getBoundingClientRect();
        $.setAttribute("id", "dp--temp-container");
        const ue = (k = a.value) != null && k.clientWidth ? a.value : document.body;
        ue.append($);
        const B = N(g), D = f.value.shadowDom ? Object.keys(h$1).filter(
          (u) => ["right-sidebar", "left-sidebar", "top-extra", "action-extra"].includes(u)
        ) : Object.keys(h$1), J = vue.h(
          y,
          {
            ...j,
            shadow: true,
            style: { opacity: 0, position: "absolute", ...B }
          },
          Object.fromEntries(D.map((u) => [u, h$1[u]]))
        );
        vue.render(J, $), I.value = (E = J.el) == null ? void 0 : E.getBoundingClientRect(), vue.render(null, $), ue.removeChild($);
      }
    };
  }, ht = [
    { name: "clock-icon", use: ["time", "calendar", "shared"] },
    { name: "arrow-left", use: ["month-year", "calendar", "shared", "year-mode"] },
    { name: "arrow-right", use: ["month-year", "calendar", "shared", "year-mode"] },
    { name: "arrow-up", use: ["time", "calendar", "month-year", "shared"] },
    { name: "arrow-down", use: ["time", "calendar", "month-year", "shared"] },
    { name: "calendar-icon", use: ["month-year", "time", "calendar", "shared", "year-mode"] },
    { name: "day", use: ["calendar", "shared"] },
    { name: "month-overlay-value", use: ["calendar", "month-year", "shared"] },
    { name: "year-overlay-value", use: ["calendar", "month-year", "shared", "year-mode"] },
    { name: "year-overlay", use: ["month-year", "shared"] },
    { name: "month-overlay", use: ["month-year", "shared"] },
    { name: "month-overlay-header", use: ["month-year", "shared"] },
    { name: "year-overlay-header", use: ["month-year", "shared"] },
    { name: "hours-overlay-value", use: ["calendar", "time", "shared"] },
    { name: "hours-overlay-header", use: ["calendar", "time", "shared"] },
    { name: "minutes-overlay-value", use: ["calendar", "time", "shared"] },
    { name: "minutes-overlay-header", use: ["calendar", "time", "shared"] },
    { name: "seconds-overlay-value", use: ["calendar", "time", "shared"] },
    { name: "seconds-overlay-header", use: ["calendar", "time", "shared"] },
    { name: "hours", use: ["calendar", "time", "shared"] },
    { name: "minutes", use: ["calendar", "time", "shared"] },
    { name: "month", use: ["calendar", "month-year", "shared"] },
    { name: "year", use: ["calendar", "month-year", "shared", "year-mode"] },
    { name: "action-buttons", use: ["action"] },
    { name: "action-preview", use: ["action"] },
    { name: "calendar-header", use: ["calendar", "shared"] },
    { name: "marker-tooltip", use: ["calendar", "shared"] },
    { name: "action-extra", use: ["menu"] },
    { name: "time-picker-overlay", use: ["calendar", "time", "shared"] },
    { name: "am-pm-button", use: ["calendar", "time", "shared"] },
    { name: "left-sidebar", use: ["menu"] },
    { name: "right-sidebar", use: ["menu"] },
    { name: "month-year", use: ["month-year", "shared"] },
    { name: "time-picker", use: ["menu", "shared"] },
    { name: "action-row", use: ["action"] },
    { name: "marker", use: ["calendar", "shared"] },
    { name: "quarter", use: ["shared"] },
    { name: "top-extra", use: ["shared", "month-year"] },
    { name: "tp-inline-arrow-up", use: ["shared", "time"] },
    { name: "tp-inline-arrow-down", use: ["shared", "time"] },
    { name: "menu-header", use: ["menu"] }
  ], to = [{ name: "trigger" }, { name: "input-icon" }, { name: "clear-icon" }, { name: "dp-input" }], ao = {
    all: () => ht,
    monthYear: () => ht.filter((e) => e.use.includes("month-year")),
    input: () => to,
    timePicker: () => ht.filter((e) => e.use.includes("time")),
    action: () => ht.filter((e) => e.use.includes("action")),
    calendar: () => ht.filter((e) => e.use.includes("calendar")),
    menu: () => ht.filter((e) => e.use.includes("menu")),
    shared: () => ht.filter((e) => e.use.includes("shared")),
    yearMode: () => ht.filter((e) => e.use.includes("year-mode"))
  }, et = (e, t2, l) => {
    const a = [];
    return ao[t2]().forEach((n) => {
      e[n.name] && a.push(n.name);
    }), l != null && l.length && l.forEach((n) => {
      n.slot && a.push(n.slot);
    }), a;
  }, Zt = (e) => {
    const t2 = vue.computed(() => (a) => e.value ? a ? e.value.open : e.value.close : ""), l = vue.computed(() => (a) => e.value ? a ? e.value.menuAppearTop : e.value.menuAppearBottom : "");
    return { transitionName: t2, showTransition: !!e.value, menuTransition: l };
  }, xt = (e, t2, l) => {
    const { defaultedRange: a, defaultedTz: n } = _e(e), i = W(xe(W(), n.value.timezone)), c = vue.ref([{ month: getMonth(i), year: getYear(i) }]), h2 = (m) => {
      const P = {
        hours: getHours(i),
        minutes: getMinutes(i),
        seconds: 0
      };
      return a.value.enabled ? [P[m], P[m]] : P[m];
    }, f = vue.reactive({
      hours: h2("hours"),
      minutes: h2("minutes"),
      seconds: h2("seconds")
    });
    vue.watch(
      a,
      (m, P) => {
        m.enabled !== P.enabled && (f.hours = h2("hours"), f.minutes = h2("minutes"), f.seconds = h2("seconds"));
      },
      { deep: true }
    );
    const I = vue.computed({
      get: () => e.internalModelValue,
      set: (m) => {
        !e.readonly && !e.disabled && t2("update:internal-model-value", m);
      }
    }), v = vue.computed(
      () => (m) => c.value[m] ? c.value[m].month : 0
    ), C = vue.computed(
      () => (m) => c.value[m] ? c.value[m].year : 0
    );
    return vue.watch(
      I,
      (m, P) => {
        l && JSON.stringify(m ?? {}) !== JSON.stringify(P ?? {}) && l();
      },
      { deep: true }
    ), {
      calendars: c,
      time: f,
      modelValue: I,
      month: v,
      year: C,
      today: i
    };
  }, no = (e, t2) => {
    const {
      defaultedMultiCalendars: l,
      defaultedMultiDates: a,
      defaultedUI: n,
      defaultedHighlight: i,
      defaultedTz: c,
      propDates: h2,
      defaultedRange: f
    } = _e(t2), { isDisabled: I } = $t(t2), v = vue.ref(null), C = vue.ref(xe(/* @__PURE__ */ new Date(), c.value.timezone)), m = (s) => {
      !s.current && t2.hideOffsetDates || (v.value = s.value);
    }, P = () => {
      v.value = null;
    }, H = (s) => Array.isArray(e.value) && f.value.enabled && e.value[0] && v.value ? s ? Ne(v.value, e.value[0]) : Be(v.value, e.value[0]) : true, Y = (s, k) => {
      const E = () => e.value ? k ? e.value[0] || null : e.value[1] : null, u = e.value && Array.isArray(e.value) ? E() : null;
      return Ae(W(s.value), u);
    }, U = (s) => {
      const k = Array.isArray(e.value) ? e.value[0] : null;
      return s ? !Be(v.value ?? null, k) : true;
    }, d = (s, k = true) => (f.value.enabled || t2.weekPicker) && Array.isArray(e.value) && e.value.length === 2 ? t2.hideOffsetDates && !s.current ? false : Ae(W(s.value), e.value[k ? 0 : 1]) : f.value.enabled ? Y(s, k) && U(k) || Ae(s.value, Array.isArray(e.value) ? e.value[0] : null) && H(k) : false, R = (s, k) => {
      if (Array.isArray(e.value) && e.value[0] && e.value.length === 1) {
        const E = Ae(s.value, v.value);
        return k ? Ne(e.value[0], s.value) && E : Be(e.value[0], s.value) && E;
      }
      return false;
    }, _ = (s) => !e.value || t2.hideOffsetDates && !s.current ? false : f.value.enabled ? t2.modelAuto && Array.isArray(e.value) ? Ae(s.value, e.value[0] ? e.value[0] : C.value) : false : a.value.enabled && Array.isArray(e.value) ? e.value.some((k) => Ae(k, s.value)) : Ae(s.value, e.value ? e.value : C.value), F = (s) => {
      if (f.value.autoRange || t2.weekPicker) {
        if (v.value) {
          if (t2.hideOffsetDates && !s.current) return false;
          const k = addDays(v.value, +f.value.autoRange), E = mt(W(v.value), t2.weekStart);
          return t2.weekPicker ? Ae(E[1], W(s.value)) : Ae(k, W(s.value));
        }
        return false;
      }
      return false;
    }, Q = (s) => {
      if (f.value.autoRange || t2.weekPicker) {
        if (v.value) {
          const k = addDays(v.value, +f.value.autoRange);
          if (t2.hideOffsetDates && !s.current) return false;
          const E = mt(W(v.value), t2.weekStart);
          return t2.weekPicker ? Ne(s.value, E[0]) && Be(s.value, E[1]) : Ne(s.value, v.value) && Be(s.value, k);
        }
        return false;
      }
      return false;
    }, ne = (s) => {
      if (f.value.autoRange || t2.weekPicker) {
        if (v.value) {
          if (t2.hideOffsetDates && !s.current) return false;
          const k = mt(W(v.value), t2.weekStart);
          return t2.weekPicker ? Ae(k[0], s.value) : Ae(v.value, s.value);
        }
        return false;
      }
      return false;
    }, x = (s) => da(e.value, v.value, s.value), A = () => t2.modelAuto && Array.isArray(t2.internalModelValue) ? !!t2.internalModelValue[0] : false, X = () => t2.modelAuto ? An(t2.internalModelValue) : true, O = (s) => {
      if (t2.weekPicker) return false;
      const k = f.value.enabled ? !d(s) && !d(s, false) : true;
      return !I(s.value) && !_(s) && !(!s.current && t2.hideOffsetDates) && k;
    }, K = (s) => f.value.enabled ? t2.modelAuto ? A() && _(s) : false : _(s), fe = (s) => i.value ? Ml(s.value, h2.value.highlight) : false, ve = (s) => {
      const k = I(s.value);
      return k && (typeof i.value == "function" ? !i.value(s.value, k) : !i.value.options.highlightDisabled);
    }, p = (s) => {
      var k;
      return typeof i.value == "function" ? i.value(s.value) : (k = i.value.weekdays) == null ? void 0 : k.includes(s.value.getDay());
    }, N = (s) => (f.value.enabled || t2.weekPicker) && (!(l.value.count > 0) || s.current) && X() && !(!s.current && t2.hideOffsetDates) && !_(s) ? x(s) : false, ae = (s) => {
      const { isRangeStart: k, isRangeEnd: E } = g(s), u = f.value.enabled ? k || E : false;
      return {
        dp__cell_offset: !s.current,
        dp__pointer: !t2.disabled && !(!s.current && t2.hideOffsetDates) && !I(s.value),
        dp__cell_disabled: I(s.value),
        dp__cell_highlight: !ve(s) && (fe(s) || p(s)) && !K(s) && !u && !ne(s) && !(N(s) && t2.weekPicker) && !E,
        dp__cell_highlight_active: !ve(s) && (fe(s) || p(s)) && K(s),
        dp__today: !t2.noToday && Ae(s.value, C.value) && s.current,
        "dp--past": Be(s.value, C.value),
        "dp--future": Ne(s.value, C.value)
      };
    }, y = (s) => ({
      dp__active_date: K(s),
      dp__date_hover: O(s)
    }), j = (s) => {
      if (e.value && !Array.isArray(e.value)) {
        const k = mt(e.value, t2.weekStart);
        return {
          ...B(s),
          dp__range_start: Ae(k[0], s.value),
          dp__range_end: Ae(k[1], s.value),
          dp__range_between_week: Ne(s.value, k[0]) && Be(s.value, k[1])
        };
      }
      return {
        ...B(s)
      };
    }, $ = (s) => {
      if (e.value && Array.isArray(e.value)) {
        const k = mt(e.value[0], t2.weekStart), E = e.value[1] ? mt(e.value[1], t2.weekStart) : [];
        return {
          ...B(s),
          dp__range_start: Ae(k[0], s.value) || Ae(E[0], s.value),
          dp__range_end: Ae(k[1], s.value) || Ae(E[1], s.value),
          dp__range_between_week: Ne(s.value, k[0]) && Be(s.value, k[1]) || Ne(s.value, E[0]) && Be(s.value, E[1]),
          dp__range_between: Ne(s.value, k[1]) && Be(s.value, E[0])
        };
      }
      return {
        ...B(s)
      };
    }, g = (s) => {
      const k = l.value.count > 0 ? s.current && d(s) && X() : d(s) && X(), E = l.value.count > 0 ? s.current && d(s, false) && X() : d(s, false) && X();
      return { isRangeStart: k, isRangeEnd: E };
    }, ue = (s) => {
      const { isRangeStart: k, isRangeEnd: E } = g(s);
      return {
        dp__range_start: k,
        dp__range_end: E,
        dp__range_between: N(s),
        dp__date_hover: Ae(s.value, v.value) && !k && !E && !t2.weekPicker,
        dp__date_hover_start: R(s, true),
        dp__date_hover_end: R(s, false)
      };
    }, B = (s) => ({
      ...ue(s),
      dp__cell_auto_range: Q(s),
      dp__cell_auto_range_start: ne(s),
      dp__cell_auto_range_end: F(s)
    }), D = (s) => f.value.enabled ? f.value.autoRange ? B(s) : t2.modelAuto ? { ...y(s), ...ue(s) } : t2.weekPicker ? $(s) : ue(s) : t2.weekPicker ? j(s) : y(s);
    return {
      setHoverDate: m,
      clearHoverDate: P,
      getDayClassData: (s) => t2.hideOffsetDates && !s.current ? {} : {
        ...ae(s),
        ...D(s),
        [t2.dayClass ? t2.dayClass(s.value, t2.internalModelValue) : ""]: true,
        ...n.value.calendarCell ?? {}
      }
    };
  }, $t = (e) => {
    const { defaultedFilters: t2, defaultedRange: l, propDates: a, defaultedMultiDates: n } = _e(e), i = (p) => a.value.disabledDates ? typeof a.value.disabledDates == "function" ? a.value.disabledDates(W(p)) : !!ua(p, a.value.disabledDates) : false, c = (p) => a.value.maxDate ? e.yearPicker ? getYear(p) > getYear(a.value.maxDate) : Ne(p, a.value.maxDate) : false, h2 = (p) => a.value.minDate ? e.yearPicker ? getYear(p) < getYear(a.value.minDate) : Be(p, a.value.minDate) : false, f = (p) => {
      const N = c(p), ae = h2(p), y = i(p), $ = t2.value.months.map((J) => +J).includes(getMonth(p)), g = e.disabledWeekDays.length ? e.disabledWeekDays.some((J) => +J === getDay(p)) : false, ue = P(p), B = getYear(p), D = B < +e.yearRange[0] || B > +e.yearRange[1];
      return !(N || ae || y || $ || D || g || ue);
    }, I = (p, N) => Be(...bt(a.value.minDate, p, N)) || Ae(...bt(a.value.minDate, p, N)), v = (p, N) => Ne(...bt(a.value.maxDate, p, N)) || Ae(...bt(a.value.maxDate, p, N)), C = (p, N, ae) => {
      let y = false;
      return a.value.maxDate && ae && v(p, N) && (y = true), a.value.minDate && !ae && I(p, N) && (y = true), y;
    }, m = (p, N, ae, y) => {
      let j = false;
      return y && (a.value.minDate || a.value.maxDate) ? a.value.minDate && a.value.maxDate ? j = C(p, N, ae) : (a.value.minDate && I(p, N) || a.value.maxDate && v(p, N)) && (j = true) : j = true, j;
    }, P = (p) => Array.isArray(a.value.allowedDates) && !a.value.allowedDates.length ? true : a.value.allowedDates ? !ua(p, a.value.allowedDates) : false, H = (p) => !f(p), Y = (p) => l.value.noDisabledRange ? !eachDayOfInterval({ start: p[0], end: p[1] }).some((ae) => H(ae)) : true, U = (p) => {
      if (p) {
        const N = getYear(p);
        return N >= +e.yearRange[0] && N <= e.yearRange[1];
      }
      return true;
    }, d = (p, N) => !!(Array.isArray(p) && p[N] && (l.value.maxRange || l.value.minRange) && U(p[N])), R = (p, N, ae = 0) => {
      if (d(N, ae) && U(p)) {
        const y = differenceInCalendarDays(p, N[ae]), j = Cn(N[ae], p), $ = j.length === 1 ? 0 : j.filter((ue) => H(ue)).length, g = Math.abs(y) - (l.value.minMaxRawRange ? 0 : $);
        if (l.value.minRange && l.value.maxRange)
          return g >= +l.value.minRange && g <= +l.value.maxRange;
        if (l.value.minRange) return g >= +l.value.minRange;
        if (l.value.maxRange) return g <= +l.value.maxRange;
      }
      return true;
    }, _ = () => !e.enableTimePicker || e.monthPicker || e.yearPicker || e.ignoreTimeValidation, F = (p) => Array.isArray(p) ? [p[0] ? Pa(p[0]) : null, p[1] ? Pa(p[1]) : null] : Pa(p), Q = (p, N, ae) => p.find(
      (y) => +y.hours === getHours(N) && y.minutes === "*" ? true : +y.minutes === getMinutes(N) && +y.hours === getHours(N)
    ) && ae, ne = (p, N, ae) => {
      const [y, j] = p, [$, g] = N;
      return !Q(y, $, ae) && !Q(j, g, ae) && ae;
    }, x = (p, N) => {
      const ae = Array.isArray(N) ? N : [N];
      return Array.isArray(e.disabledTimes) ? Array.isArray(e.disabledTimes[0]) ? ne(e.disabledTimes, ae, p) : !ae.some((y) => Q(e.disabledTimes, y, p)) : p;
    }, A = (p, N) => {
      const ae = Array.isArray(N) ? [Rt(N[0]), N[1] ? Rt(N[1]) : void 0] : Rt(N), y = !e.disabledTimes(ae);
      return p && y;
    }, X = (p, N) => e.disabledTimes ? Array.isArray(e.disabledTimes) ? x(N, p) : A(N, p) : N, O = (p) => {
      let N = true;
      if (!p || _()) return true;
      const ae = !a.value.minDate && !a.value.maxDate ? F(p) : p;
      return (e.maxTime || a.value.maxDate) && (N = dn(
        e.maxTime,
        a.value.maxDate,
        "max",
        Ee(ae),
        N
      )), (e.minTime || a.value.minDate) && (N = dn(
        e.minTime,
        a.value.minDate,
        "min",
        Ee(ae),
        N
      )), X(p, N);
    }, K = (p) => {
      if (!e.monthPicker) return true;
      let N = true;
      const ae = W(ut(p));
      if (a.value.minDate && a.value.maxDate) {
        const y = W(ut(a.value.minDate)), j = W(ut(a.value.maxDate));
        return Ne(ae, y) && Be(ae, j) || Ae(ae, y) || Ae(ae, j);
      }
      if (a.value.minDate) {
        const y = W(ut(a.value.minDate));
        N = Ne(ae, y) || Ae(ae, y);
      }
      if (a.value.maxDate) {
        const y = W(ut(a.value.maxDate));
        N = Be(ae, y) || Ae(ae, y);
      }
      return N;
    }, fe = vue.computed(() => (p) => !e.enableTimePicker || e.ignoreTimeValidation ? true : O(p)), ve = vue.computed(() => (p) => e.monthPicker ? Array.isArray(p) && (l.value.enabled || n.value.enabled) ? !p.filter((ae) => !K(ae)).length : K(p) : true);
    return {
      isDisabled: H,
      validateDate: f,
      validateMonthYearInRange: m,
      isDateRangeAllowed: Y,
      checkMinMaxRange: R,
      isValidTime: O,
      isTimeValid: fe,
      isMonthValid: ve
    };
  }, ma = () => {
    const e = vue.computed(() => (a, n) => a == null ? void 0 : a.includes(n)), t2 = vue.computed(() => (a, n) => a.count ? a.solo ? true : n === 0 : true), l = vue.computed(() => (a, n) => a.count ? a.solo ? true : n === a.count - 1 : true);
    return { hideNavigationButtons: e, showLeftIcon: t2, showRightIcon: l };
  }, lo = (e, t2, l) => {
    const a = vue.ref(0), n = vue.reactive({
      [Pt.timePicker]: !e.enableTimePicker || e.timePicker || e.monthPicker,
      [Pt.calendar]: false,
      [Pt.header]: false
    }), i = vue.computed(() => e.monthPicker || e.timePicker), c = (C) => {
      var m;
      if ((m = e.flow) != null && m.length) {
        if (!C && i.value) return v();
        n[C] = true, Object.keys(n).filter((P) => !n[P]).length || v();
      }
    }, h2 = () => {
      var C, m;
      (C = e.flow) != null && C.length && a.value !== -1 && (a.value += 1, t2("flow-step", a.value), v()), ((m = e.flow) == null ? void 0 : m.length) === a.value && vue.nextTick().then(() => f());
    }, f = () => {
      a.value = -1;
    }, I = (C, m, ...P) => {
      var H, Y;
      e.flow[a.value] === C && l.value && ((Y = (H = l.value)[m]) == null || Y.call(H, ...P));
    }, v = (C = 0) => {
      C && (a.value += C), I(je.month, "toggleMonthPicker", true), I(je.year, "toggleYearPicker", true), I(je.calendar, "toggleTimePicker", false, true), I(je.time, "toggleTimePicker", true, true);
      const m = e.flow[a.value];
      (m === je.hours || m === je.minutes || m === je.seconds) && I(m, "toggleTimePicker", true, true, m);
    };
    return { childMount: c, updateFlowStep: h2, resetFlow: f, handleFlow: v, flowStep: a };
  }, ro = {
    key: 1,
    class: "dp__input_wrap"
  }, oo = ["id", "name", "inputmode", "placeholder", "disabled", "readonly", "required", "value", "autocomplete", "aria-label", "aria-disabled", "aria-invalid"], so = {
    key: 2,
    class: "dp--clear-btn"
  }, uo = ["aria-label"], io = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "DatepickerInput",
    props: {
      isMenuOpen: { type: Boolean, default: false },
      inputValue: { type: String, default: "" },
      ...ca
    },
    emits: [
      "clear",
      "open",
      "update:input-value",
      "set-input-date",
      "close",
      "select-date",
      "set-empty-date",
      "toggle",
      "focus-prev",
      "focus",
      "blur",
      "real-blur",
      "text-input"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, {
        defaultedTextInput: i,
        defaultedAriaLabels: c,
        defaultedInline: h2,
        defaultedConfig: f,
        defaultedRange: I,
        defaultedMultiDates: v,
        defaultedUI: C,
        getDefaultPattern: m,
        getDefaultStartTime: P
      } = _e(n), { checkMinMaxRange: H } = $t(n), Y = vue.ref(), U = vue.ref(null), d = vue.ref(false), R = vue.ref(false), _ = vue.computed(
        () => ({
          dp__pointer: !n.disabled && !n.readonly && !i.value.enabled,
          dp__disabled: n.disabled,
          dp__input_readonly: !i.value.enabled,
          dp__input: true,
          dp__input_icon_pad: !n.hideInputIcon,
          dp__input_valid: typeof n.state == "boolean" ? n.state : false,
          dp__input_invalid: typeof n.state == "boolean" ? !n.state : false,
          dp__input_focus: d.value || n.isMenuOpen,
          dp__input_reg: !i.value.enabled,
          ...C.value.input ?? {}
        })
      ), F = () => {
        a("set-input-date", null), n.clearable && n.autoApply && (a("set-empty-date"), Y.value = null);
      }, Q = (g) => {
        const ue = P();
        return $l(
          g,
          i.value.format ?? m(),
          ue ?? On({}, n.enableSeconds),
          n.inputValue,
          R.value,
          n.formatLocale
        );
      }, ne = (g) => {
        const { rangeSeparator: ue } = i.value, [B, D] = g.split(`${ue}`);
        if (B) {
          const J = Q(B.trim()), s = D ? Q(D.trim()) : null;
          if (isAfter(J, s)) return;
          const k = J && s ? [J, s] : [J];
          H(s, k, 0) && (Y.value = J ? k : null);
        }
      }, x = () => {
        R.value = true;
      }, A = (g) => {
        if (I.value.enabled)
          ne(g);
        else if (v.value.enabled) {
          const ue = g.split(";");
          Y.value = ue.map((B) => Q(B.trim())).filter((B) => B);
        } else
          Y.value = Q(g);
      }, X = (g) => {
        var B;
        const ue = typeof g == "string" ? g : (B = g.target) == null ? void 0 : B.value;
        ue !== "" ? (i.value.openMenu && !n.isMenuOpen && a("open"), A(ue), a("set-input-date", Y.value)) : F(), R.value = false, a("update:input-value", ue), a("text-input", g, Y.value);
      }, O = (g) => {
        i.value.enabled ? (A(g.target.value), i.value.enterSubmit && Fa(Y.value) && n.inputValue !== "" ? (a("set-input-date", Y.value, true), Y.value = null) : i.value.enterSubmit && n.inputValue === "" && (Y.value = null, a("clear"))) : ve(g);
      }, K = (g, ue) => {
        i.value.enabled && i.value.tabSubmit && !ue && A(g.target.value), i.value.tabSubmit && Fa(Y.value) && n.inputValue !== "" ? (a("set-input-date", Y.value, true, true), Y.value = null) : i.value.tabSubmit && n.inputValue === "" && (Y.value = null, a("clear", true));
      }, fe = () => {
        d.value = true, a("focus"), vue.nextTick().then(() => {
          var g;
          i.value.enabled && i.value.selectOnFocus && ((g = U.value) == null || g.select());
        });
      }, ve = (g) => {
        if (kt(g, f.value, true), i.value.enabled && i.value.openMenu && !h2.value.input) {
          if (i.value.openMenu === "open" && !n.isMenuOpen) return a("open");
          if (i.value.openMenu === "toggle") return a("toggle");
        } else i.value.enabled || a("toggle");
      }, p = () => {
        a("real-blur"), d.value = false, (!n.isMenuOpen || h2.value.enabled && h2.value.input) && a("blur"), n.autoApply && i.value.enabled && Y.value && !n.isMenuOpen && (a("set-input-date", Y.value), a("select-date"), Y.value = null);
      }, N = (g) => {
        kt(g, f.value, true), a("clear");
      }, ae = (g) => {
        if (g.key === "Tab" && K(g), g.key === "Enter" && O(g), !i.value.enabled) {
          if (g.code === "Tab") return;
          g.preventDefault();
        }
      }, y = () => {
        var g;
        (g = U.value) == null || g.focus({ preventScroll: true });
      }, j = (g) => {
        Y.value = g;
      }, $ = (g) => {
        g.key === Ce.tab && K(g, true);
      };
      return t2({
        focusInput: y,
        setParsedDate: j
      }), (g, ue) => {
        var B, D, J;
        return vue.openBlock(), vue.createElementBlock("div", { onClick: ve }, [
          g.$slots.trigger && !g.$slots["dp-input"] && !vue.unref(h2).enabled ? vue.renderSlot(g.$slots, "trigger", { key: 0 }) : vue.createCommentVNode("", true),
          !g.$slots.trigger && (!vue.unref(h2).enabled || vue.unref(h2).input) ? (vue.openBlock(), vue.createElementBlock("div", ro, [
            g.$slots["dp-input"] && !g.$slots.trigger && (!vue.unref(h2).enabled || vue.unref(h2).enabled && vue.unref(h2).input) ? vue.renderSlot(g.$slots, "dp-input", {
              key: 0,
              value: e.inputValue,
              isMenuOpen: e.isMenuOpen,
              onInput: X,
              onEnter: O,
              onTab: K,
              onClear: N,
              onBlur: p,
              onKeypress: ae,
              onPaste: x,
              onFocus: fe,
              openMenu: () => g.$emit("open"),
              closeMenu: () => g.$emit("close"),
              toggleMenu: () => g.$emit("toggle")
            }) : vue.createCommentVNode("", true),
            g.$slots["dp-input"] ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createElementBlock("input", {
              key: 1,
              id: g.uid ? `dp-input-${g.uid}` : void 0,
              ref_key: "inputRef",
              ref: U,
              "data-test-id": "dp-input",
              name: g.name,
              class: vue.normalizeClass(_.value),
              inputmode: vue.unref(i).enabled ? "text" : "none",
              placeholder: g.placeholder,
              disabled: g.disabled,
              readonly: g.readonly,
              required: g.required,
              value: e.inputValue,
              autocomplete: g.autocomplete,
              "aria-label": (B = vue.unref(c)) == null ? void 0 : B.input,
              "aria-disabled": g.disabled || void 0,
              "aria-invalid": g.state === false ? true : void 0,
              onInput: X,
              onBlur: p,
              onFocus: fe,
              onKeypress: ae,
              onKeydown: ue[0] || (ue[0] = (s) => ae(s)),
              onPaste: x
            }, null, 42, oo)),
            vue.createElementVNode("div", {
              onClick: ue[3] || (ue[3] = (s) => a("toggle"))
            }, [
              g.$slots["input-icon"] && !g.hideInputIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: "dp__input_icon",
                onClick: ue[1] || (ue[1] = (s) => a("toggle"))
              }, [
                vue.renderSlot(g.$slots, "input-icon")
              ])) : vue.createCommentVNode("", true),
              !g.$slots["input-icon"] && !g.hideInputIcon && !g.$slots["dp-input"] ? (vue.openBlock(), vue.createBlock(vue.unref(zt), {
                key: 1,
                "aria-label": (D = vue.unref(c)) == null ? void 0 : D.calendarIcon,
                class: "dp__input_icon dp__input_icons",
                onClick: ue[2] || (ue[2] = (s) => a("toggle"))
              }, null, 8, ["aria-label"])) : vue.createCommentVNode("", true)
            ]),
            g.$slots["clear-icon"] && e.inputValue && g.clearable && !g.disabled && !g.readonly ? (vue.openBlock(), vue.createElementBlock("span", so, [
              vue.renderSlot(g.$slots, "clear-icon", { clear: N })
            ])) : vue.createCommentVNode("", true),
            g.clearable && !g.$slots["clear-icon"] && e.inputValue && !g.disabled && !g.readonly ? (vue.openBlock(), vue.createElementBlock("button", {
              key: 3,
              "aria-label": (J = vue.unref(c)) == null ? void 0 : J.clearInput,
              class: "dp--clear-btn",
              type: "button",
              onKeydown: ue[4] || (ue[4] = (s) => vue.unref(Xe)(s, () => N(s), true, $)),
              onClick: ue[5] || (ue[5] = vue.withModifiers((s) => N(s), ["prevent"]))
            }, [
              vue.createVNode(vue.unref(Mn), {
                class: "dp__input_icons",
                "data-test-id": "clear-icon"
              })
            ], 40, uo)) : vue.createCommentVNode("", true)
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  }), co = typeof window < "u" ? window : void 0, Ya = () => {
  }, fo = (e) => vue.getCurrentScope() ? (vue.onScopeDispose(e), true) : false, vo = (e, t2, l, a) => {
    if (!e) return Ya;
    let n = Ya;
    const i = vue.watch(
      () => vue.unref(e),
      (h2) => {
        n(), h2 && (h2.addEventListener(t2, l, a), n = () => {
          h2.removeEventListener(t2, l, a), n = Ya;
        });
      },
      { immediate: true, flush: "post" }
    ), c = () => {
      i(), n();
    };
    return fo(c), c;
  }, mo = (e, t2, l, a = {}) => {
    const { window: n = co, event: i = "pointerdown" } = a;
    return n ? vo(n, i, (h2) => {
      const f = Le(e), I = Le(t2);
      !f || !I || f === h2.target || h2.composedPath().includes(f) || h2.composedPath().includes(I) || l(h2);
    }, { passive: true }) : void 0;
  }, po = ["data-dp-mobile"], yo = /* @__PURE__ */ vue.defineComponent({
    compatConfig: {
      MODE: 3
    },
    __name: "VueDatePicker",
    props: {
      ...ca
    },
    emits: [
      "update:model-value",
      "update:model-timezone-value",
      "text-submit",
      "closed",
      "cleared",
      "open",
      "focus",
      "blur",
      "internal-model-change",
      "recalculate-position",
      "flow-step",
      "update-month-year",
      "invalid-select",
      "invalid-fixed-range",
      "tooltip-open",
      "tooltip-close",
      "time-picker-open",
      "time-picker-close",
      "am-pm-change",
      "range-start",
      "range-end",
      "date-update",
      "invalid-date",
      "overlay-toggle",
      "text-input"
    ],
    setup(e, { expose: t2, emit: l }) {
      const a = l, n = e, i = vue.useSlots(), c = vue.ref(false), h2 = vue.toRef(n, "modelValue"), f = vue.toRef(n, "timezone"), I = vue.ref(null), v = vue.ref(null), C = vue.ref(null), m = vue.ref(false), P = vue.ref(null), H = vue.ref(false), Y = vue.ref(false), U = vue.ref(false), d = vue.ref(false), { setMenuFocused: R, setShiftKey: _ } = Nn(), { clearArrowNav: F } = Mt(), { validateDate: Q, isValidTime: ne } = $t(n), {
        defaultedTransitions: x,
        defaultedTextInput: A,
        defaultedInline: X,
        defaultedConfig: O,
        defaultedRange: K,
        defaultedMultiDates: fe
      } = _e(n), { menuTransition: ve, showTransition: p } = Zt(x), { isMobile: N } = Wn(O);
      vue.onMounted(() => {
        k(n.modelValue), vue.nextTick().then(() => {
          if (!X.value.enabled) {
            const M = B(P.value);
            M == null || M.addEventListener("scroll", le), window == null || window.addEventListener("resize", ie);
          }
        }), X.value.enabled && (c.value = true), window == null || window.addEventListener("keyup", re), window == null || window.addEventListener("keydown", Te);
      }), vue.onUnmounted(() => {
        if (!X.value.enabled) {
          const M = B(P.value);
          M == null || M.removeEventListener("scroll", le), window == null || window.removeEventListener("resize", ie);
        }
        window == null || window.removeEventListener("keyup", re), window == null || window.removeEventListener("keydown", Te);
      });
      const ae = et(i, "all", n.presetDates), y = et(i, "input");
      vue.watch(
        [h2, f],
        () => {
          k(h2.value);
        },
        { deep: true }
      );
      const { openOnTop: j, menuStyle: $, xCorrect: g, setMenuPosition: ue, getScrollableParent: B, shadowRender: D } = eo({
        menuRef: I,
        menuRefInner: v,
        inputRef: C,
        pickerWrapperRef: P,
        inline: X,
        emit: a,
        props: n,
        slots: i
      }), {
        inputValue: J,
        internalModelValue: s,
        parseExternalModelValue: k,
        emitModelValue: E,
        formatInputValue: u,
        checkBeforeEmit: te
      } = ql(a, n, m), ye = vue.computed(
        () => ({
          dp__main: true,
          dp__theme_dark: n.dark,
          dp__theme_light: !n.dark,
          dp__flex_display: X.value.enabled,
          "dp--flex-display-collapsed": U.value,
          dp__flex_display_with_input: X.value.input
        })
      ), S = vue.computed(() => n.dark ? "dp__theme_dark" : "dp__theme_light"), be = vue.computed(() => n.teleport ? {
        to: typeof n.teleport == "boolean" ? "body" : n.teleport,
        disabled: !n.teleport || X.value.enabled
      } : {}), L = vue.computed(() => ({ class: "dp__outer_menu_wrap" })), se = vue.computed(() => X.value.enabled && (n.timePicker || n.monthPicker || n.yearPicker || n.quarterPicker)), r = () => {
        var M, Z;
        return ((Z = (M = C.value) == null ? void 0 : M.$el) == null ? void 0 : Z.getBoundingClientRect()) ?? { width: 0, left: 0, right: 0 };
      }, le = () => {
        c.value && (O.value.closeOnScroll ? Ye() : ue());
      }, ie = () => {
        var Z;
        c.value && ue();
        const M = ((Z = v.value) == null ? void 0 : Z.$el.getBoundingClientRect().width) ?? 0;
        U.value = document.body.offsetWidth <= M;
      }, re = (M) => {
        M.key === "Tab" && !X.value.enabled && !n.teleport && O.value.tabOutClosesMenu && (P.value.contains(document.activeElement) || Ye()), Y.value = M.shiftKey;
      }, Te = (M) => {
        Y.value = M.shiftKey;
      }, ke = () => {
        !n.disabled && !n.readonly && (D(mn, n), ue(false), c.value = true, c.value && a("open"), c.value || ct(), k(n.modelValue));
      }, w = () => {
        var M;
        J.value = "", ct(), (M = C.value) == null || M.setParsedDate(null), a("update:model-value", null), a("update:model-timezone-value", null), a("cleared"), O.value.closeOnClearValue && Ye();
      }, z = () => {
        const M = s.value;
        return !M || !Array.isArray(M) && Q(M) ? true : Array.isArray(M) ? fe.value.enabled || M.length === 2 && Q(M[0]) && Q(M[1]) ? true : K.value.partialRange && !n.timePicker ? Q(M[0]) : false : false;
      }, ge = () => {
        te() && z() ? (E(), Ye()) : a("invalid-select", s.value);
      }, Fe = (M) => {
        dt(), E(), O.value.closeOnAutoApply && !M && Ye();
      }, dt = () => {
        C.value && A.value.enabled && C.value.setParsedDate(s.value);
      }, me = (M = false) => {
        n.autoApply && ne(s.value) && z() && (K.value.enabled && Array.isArray(s.value) ? (K.value.partialRange || s.value.length === 2) && Fe(M) : Fe(M));
      }, ct = () => {
        A.value.enabled || (s.value = null);
      }, Ye = (M = false) => {
        M && s.value && O.value.setDateOnMenuClose && ge(), X.value.enabled || (c.value && (c.value = false, g.value = false, R(false), _(false), F(), a("closed"), J.value && k(h2.value)), ct(), a("blur"));
      }, pa = (M, Z, de = false) => {
        if (!M) {
          s.value = null;
          return;
        }
        const Qe = Array.isArray(M) ? !M.some((Ot) => !Q(Ot)) : Q(M), rt = ne(M);
        Qe && rt ? (d.value = true, s.value = M, Z && (H.value = de, ge(), a("text-submit")), vue.nextTick().then(() => {
          d.value = false;
        })) : a("invalid-date", M);
      }, ya = () => {
        n.autoApply && ne(s.value) && E(), dt();
      }, ea = () => c.value ? Ye() : ke(), ga = (M) => {
        s.value = M;
      }, ha = () => {
        A.value.enabled && (m.value = true, u()), a("focus");
      }, ba = () => {
        if (A.value.enabled && (m.value = false, k(n.modelValue), H.value)) {
          const M = Dl(P.value, Y.value);
          M == null || M.focus();
        }
        a("blur");
      }, ka = (M) => {
        v.value && v.value.updateMonthYear(0, {
          month: rn(M.month),
          year: rn(M.year)
        });
      }, wa = (M) => {
        k(M ?? n.modelValue);
      }, Za = (M, Z) => {
        var de;
        (de = v.value) == null || de.switchView(M, Z);
      }, b = (M) => O.value.onClickOutside ? O.value.onClickOutside(M) : Ye(true), oe = (M = 0) => {
        var Z;
        (Z = v.value) == null || Z.handleFlow(M);
      };
      return mo(I, C, () => b(z)), t2({
        closeMenu: Ye,
        selectDate: ge,
        clearValue: w,
        openMenu: ke,
        onScroll: le,
        formatInputValue: u,
        // exposed for testing purposes
        updateInternalModelValue: ga,
        // modify internal modelValue
        setMonthYear: ka,
        parseModel: wa,
        switchView: Za,
        toggleMenu: ea,
        handleFlow: oe,
        dpWrapMenuRef: I
      }), (M, Z) => (vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "pickerWrapperRef",
        ref: P,
        class: vue.normalizeClass(ye.value),
        "data-datepicker-instance": "",
        "data-dp-mobile": vue.unref(N)
      }, [
        vue.createVNode(io, vue.mergeProps({
          ref_key: "inputRef",
          ref: C,
          "input-value": vue.unref(J),
          "onUpdate:inputValue": Z[0] || (Z[0] = (de) => vue.isRef(J) ? J.value = de : null),
          "is-menu-open": c.value
        }, M.$props, {
          onClear: w,
          onOpen: ke,
          onSetInputDate: pa,
          onSetEmptyDate: vue.unref(E),
          onSelectDate: ge,
          onToggle: ea,
          onClose: Ye,
          onFocus: ha,
          onBlur: ba,
          onRealBlur: Z[1] || (Z[1] = (de) => m.value = false),
          onTextInput: Z[2] || (Z[2] = (de) => M.$emit("text-input", de))
        }), vue.createSlots({ _: 2 }, [
          vue.renderList(vue.unref(y), (de, Qe) => ({
            name: de,
            fn: vue.withCtx((rt) => [
              vue.renderSlot(M.$slots, de, vue.normalizeProps(vue.guardReactiveProps(rt)))
            ])
          }))
        ]), 1040, ["input-value", "is-menu-open", "onSetEmptyDate"]),
        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(M.teleport ? vue.Teleport : "div"), vue.normalizeProps(vue.guardReactiveProps(be.value)), {
          default: vue.withCtx(() => [
            vue.createVNode(vue.Transition, {
              name: vue.unref(ve)(vue.unref(j)),
              css: vue.unref(p) && !vue.unref(X).enabled
            }, {
              default: vue.withCtx(() => [
                c.value ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
                  key: 0,
                  ref_key: "dpWrapMenuRef",
                  ref: I
                }, L.value, {
                  class: { "dp--menu-wrapper": !vue.unref(X).enabled },
                  style: vue.unref(X).enabled ? void 0 : vue.unref($)
                }), [
                  vue.createVNode(mn, vue.mergeProps({
                    ref_key: "dpMenuRef",
                    ref: v
                  }, M.$props, {
                    "internal-model-value": vue.unref(s),
                    "onUpdate:internalModelValue": Z[3] || (Z[3] = (de) => vue.isRef(s) ? s.value = de : null),
                    class: { [S.value]: true, "dp--menu-wrapper": M.teleport },
                    "open-on-top": vue.unref(j),
                    "no-overlay-focus": se.value,
                    collapse: U.value,
                    "get-input-rect": r,
                    "is-text-input-date": d.value,
                    onClosePicker: Ye,
                    onSelectDate: ge,
                    onAutoApply: me,
                    onTimeUpdate: ya,
                    onFlowStep: Z[4] || (Z[4] = (de) => M.$emit("flow-step", de)),
                    onUpdateMonthYear: Z[5] || (Z[5] = (de) => M.$emit("update-month-year", de)),
                    onInvalidSelect: Z[6] || (Z[6] = (de) => M.$emit("invalid-select", vue.unref(s))),
                    onAutoApplyInvalid: Z[7] || (Z[7] = (de) => M.$emit("invalid-select", de)),
                    onInvalidFixedRange: Z[8] || (Z[8] = (de) => M.$emit("invalid-fixed-range", de)),
                    onRecalculatePosition: vue.unref(ue),
                    onTooltipOpen: Z[9] || (Z[9] = (de) => M.$emit("tooltip-open", de)),
                    onTooltipClose: Z[10] || (Z[10] = (de) => M.$emit("tooltip-close", de)),
                    onTimePickerOpen: Z[11] || (Z[11] = (de) => M.$emit("time-picker-open", de)),
                    onTimePickerClose: Z[12] || (Z[12] = (de) => M.$emit("time-picker-close", de)),
                    onAmPmChange: Z[13] || (Z[13] = (de) => M.$emit("am-pm-change", de)),
                    onRangeStart: Z[14] || (Z[14] = (de) => M.$emit("range-start", de)),
                    onRangeEnd: Z[15] || (Z[15] = (de) => M.$emit("range-end", de)),
                    onDateUpdate: Z[16] || (Z[16] = (de) => M.$emit("date-update", de)),
                    onInvalidDate: Z[17] || (Z[17] = (de) => M.$emit("invalid-date", de)),
                    onOverlayToggle: Z[18] || (Z[18] = (de) => M.$emit("overlay-toggle", de)),
                    onMenuBlur: Z[19] || (Z[19] = (de) => M.$emit("blur"))
                  }), vue.createSlots({ _: 2 }, [
                    vue.renderList(vue.unref(ae), (de, Qe) => ({
                      name: de,
                      fn: vue.withCtx((rt) => [
                        vue.renderSlot(M.$slots, de, vue.normalizeProps(vue.guardReactiveProps({ ...rt })))
                      ])
                    }))
                  ]), 1040, ["internal-model-value", "class", "open-on-top", "no-overlay-focus", "collapse", "is-text-input-date", "onRecalculatePosition"])
                ], 16)) : vue.createCommentVNode("", true)
              ]),
              _: 3
            }, 8, ["name", "css"])
          ]),
          _: 3
        }, 16))
      ], 10, po));
    }
  }), Vn = /* @__PURE__ */ (() => {
    const e = yo;
    return e.install = (t2) => {
      t2.component("Vue3DatePicker", e);
    }, e;
  })(), go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Vn
  }, Symbol.toStringTag, { value: "Module" }));
  Object.entries(go).forEach(([e, t2]) => {
    e !== "default" && (Vn[e] = t2);
  });
  function tryOnScopeDispose(fn2) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  function useIntervalFn(cb, interval = 1e3, options = {}) {
    const {
      immediate = true,
      immediateCallback = false
    } = options;
    let timer = null;
    const isActive = vue.ref(false);
    function clean() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function pause() {
      isActive.value = false;
      clean();
    }
    function resume() {
      const intervalValue = toValue(interval);
      if (intervalValue <= 0)
        return;
      isActive.value = true;
      if (immediateCallback)
        cb();
      clean();
      if (isActive.value)
        timer = setInterval(cb, intervalValue);
    }
    if (immediate && isClient)
      resume();
    if (vue.isRef(interval) || typeof interval === "function") {
      const stopWatch = vue.watch(interval, () => {
        if (isActive.value && isClient)
          resume();
      });
      tryOnScopeDispose(stopWatch);
    }
    tryOnScopeDispose(pause);
    return {
      isActive,
      pause,
      resume
    };
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, toValue(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
  }
  const _hoisted_1 = { class: "bg-slate-800/30 fixed inset-0 h-full flex justify-center items-center max-h-none w-full max-w-none select-none" };
  const _hoisted_2 = { class: "bg-slate-800 col-start-1 row-start-1 max-w-lg min-w-[500px] h-fit scale-90 transform p-6 transition duration-200 ease-out select-auto" };
  const _hoisted_3 = { key: 0 };
  const _hoisted_4 = { class: "flex-1 h-full mb-4" };
  const _hoisted_5 = { class: "steps" };
  const _hoisted_6 = {
    key: 0,
    class: "py-4 text-xl"
  };
  const _hoisted_7 = {
    key: 1,
    class: "space-y-4"
  };
  const _hoisted_8 = { class: "flex items-center space-x-2" };
  const _hoisted_9 = { class: "space-y-2" };
  const _hoisted_10 = { class: "flex items-center space-x-2" };
  const _hoisted_11 = {
    key: 2,
    class: "space-y-4"
  };
  const _hoisted_12 = { class: "flex flex-wrap gap-2" };
  const _hoisted_13 = ["onClick"];
  const _hoisted_14 = { class: "py-4" };
  const _hoisted_15 = { class: "flex justify-end space-x-2" };
  const _hoisted_16 = ["disabled"];
  const _hoisted_17 = { key: 1 };
  const _hoisted_18 = { class: "flex-1 h-full mb-4" };
  const _hoisted_19 = {
    key: 0,
    class: "py-4 text-red-500 text-xl"
  };
  const _hoisted_20 = {
    key: 1,
    class: "py-4 text-xl"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Model",
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      const step = vue.ref(0);
      const emailType = vue.ref("disable");
      function getPresetDates() {
        const now2 = /* @__PURE__ */ new Date();
        const currentYear = now2.getFullYear();
        const getNextYearDate = (month, date) => {
          const targetDate = new Date(currentYear, month, date);
          return now2 > targetDate ? new Date(currentYear + 1, month, date) : targetDate;
        };
        return [
          ["一个月", new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)],
          ["三个月", new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3)],
          ["半年", new Date(Date.now() + 180 * 24 * 60 * 60 * 1e3)],
          ["一年", new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)],
          ["元旦节", getNextYearDate(0, 1)],
          ["劳动节", getNextYearDate(4, 1)],
          ["618年中节", getNextYearDate(5, 18)],
          ["国庆节", getNextYearDate(9, 1)],
          ["圣诞节", getNextYearDate(11, 25)]
        ].sort((a, b) => a[1].getTime() - b[1].getTime());
      }
      const presetDates = getPresetDates();
      const now = /* @__PURE__ */ new Date();
      const selectedDate = vue.ref(/* @__PURE__ */ new Date());
      const selectedMinDate = vue.ref(new Date(now.getTime() + 3 * 60 * 60 * 1e3));
      const ciphertext = vue.ref("");
      const decryptKey = vue.ref("");
      function copyCiphertext() {
        navigator.clipboard.writeText(ciphertext.value);
      }
      const countdownTime = vue.ref(5);
      const isNextStepDisabled = vue.computed(() => {
        if (step.value === 2)
          return !selectedDate.value || selectedDate.value.getTime() < selectedMinDate.value.getTime();
        if (step.value === 3)
          return countdownTime.value > 0;
        return false;
      });
      const stepButtonText = vue.computed(() => {
        const texts = {
          0: "同意",
          1: "下一步",
          2: "下一步",
          3: `我已保存, ${countdownTime.value ? ` ${countdownTime.value}s` : ""}`,
          4: "完成"
        };
        return texts[step.value];
      });
      async function handleNextStep() {
        console.log("下一步", step.value);
        if (step.value === 2) {
          countdownTime.value = 5;
          const encryptKey = Math.random().toString().slice(2, 6);
          if (!selectedDate.value) {
            return;
          }
          const encryptedText = await encrypt(
            encryptKey,
            selectedDate.value.getTime()
          );
          ciphertext.value = encryptedText;
          console.log("加密成功", (/* @__PURE__ */ new Date()).toLocaleString(), encryptKey, encryptedText);
          const { pause } = useIntervalFn(() => {
            countdownTime.value--;
          }, 1e3);
          useTimeoutFn(() => {
            countdownTime.value = 0;
            pause();
          }, 5e3);
          const box = window.document.querySelector("#parental_setpin_box form");
          if (!box) {
            window.alert("无法找到form元素, 请重试或联系开发者");
            return;
          }
          if (emailType.value === "disable") {
            const currentSettings = box.querySelector('input[name="current_settings"]');
            if (!currentSettings) {
              window.alert("无法找到email元素, 请重试或联系开发者");
              return;
            }
            const data = JSON.parse(currentSettings.value);
            data.recovery_email = "123@gmail.com";
            currentSettings.value = JSON.stringify(data);
          }
          const pinentry = box.querySelector('input[name="pinentry"]');
          const pinreentry = box.querySelector('input[name="pinreentry"]');
          if (!pinentry || !pinreentry) {
            window.alert("无法找到pin元素, 请重试或联系开发者");
            return;
          }
          pinentry.value = encryptKey;
          pinreentry.value = encryptKey;
          const btn = box.querySelector("#submit_btn");
          if (btn) {
            btn.disabled = false;
          }
        } else if (step.value === 3) {
          emit("close");
          return;
        }
        step.value++;
      }
      const decryptedError = vue.ref(null);
      const decryptedContent = vue.ref(null);
      async function decryptHandle() {
        try {
          const decrypted = await decrypt(decryptKey.value);
          console.log("解密成功", decrypted);
          if (decrypted instanceof Date) {
            decryptedError.value = `解密失败, 时间未到: ${decrypted.toLocaleString()}, 还差${Math.floor((decrypted.getTime() - Date.now()) / 1e3 / 60 / 60 / 24)}天`;
          } else {
            decryptedContent.value = decrypted;
          }
        } catch (e) {
          decryptedError.value = `解密失败, ${e}`;
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("button", {
              class: "bg-slate-700 rounded-full size-10 text-2xl absolute right-2 top-2",
              onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
            }, " ✕ "),
            vue.unref(step) >= 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, [
                vue.createElementVNode("ul", _hoisted_5, [
                  vue.createElementVNode("li", {
                    class: vue.normalizeClass(["step", { "step-primary": vue.unref(step) >= 1 }])
                  }, " 确认协议 ", 2),
                  vue.createElementVNode("li", {
                    class: vue.normalizeClass(["step", { "step-primary": vue.unref(step) >= 2 }])
                  }, " 安全邮箱 ", 2),
                  vue.createElementVNode("li", {
                    class: vue.normalizeClass(["step", { "step-primary": vue.unref(step) >= 3 }])
                  }, " 选择时间 ", 2),
                  vue.createElementVNode("li", {
                    class: vue.normalizeClass(["step", { "step-primary": vue.unref(step) >= 4 }])
                  }, " 大功告成 ", 2)
                ]),
                vue.unref(step) === 0 ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_6, _cache[7] || (_cache[7] = [
                  vue.createTextVNode(" 使用时间锁可能会导致无法解密,请谨慎使用。一旦启用,所有风险需自行承担。 "),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 脚本仅填充pin码, 并不会自动点击下一步请你放心 "),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 当禁用恢复邮箱, 你就只能等待时间胶囊解锁, 无法提前解密 ")
                ]))) : vue.unref(step) === 1 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                  vue.createElementVNode("div", null, [
                    vue.createElementVNode("label", _hoisted_8, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(emailType) ? emailType.value = $event : null),
                        type: "radio",
                        value: "disable",
                        class: "radio radio-primary"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(emailType)]
                      ]),
                      _cache[8] || (_cache[8] = vue.createElementVNode("span", { class: "flex items-center" }, [
                        vue.createTextVNode(" 禁用恢复邮箱 "),
                        vue.createElementVNode("span", { class: "text-red-500 ml-1" }, "!! 将无法提前恢复 !!")
                      ], -1))
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_9, [
                    vue.createElementVNode("label", _hoisted_10, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.isRef(emailType) ? emailType.value = $event : null),
                        type: "radio",
                        value: "enable",
                        class: "radio radio-primary"
                      }, null, 512), [
                        [vue.vModelRadio, vue.unref(emailType)]
                      ]),
                      _cache[9] || (_cache[9] = vue.createElementVNode("span", null, "不禁用恢复邮箱", -1))
                    ])
                  ])
                ])) : vue.unref(step) === 2 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
                  vue.createVNode(vue.unref(Vn), {
                    modelValue: vue.unref(selectedDate),
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.isRef(selectedDate) ? selectedDate.value = $event : null),
                    locale: "zh-CN",
                    timezone: "Asia/Shanghai",
                    "min-date": vue.unref(selectedMinDate),
                    "text-input": "",
                    "auto-apply": "",
                    "year-first": "",
                    "minutes-increment": "10",
                    "minutes-grid-increment": "10",
                    format: "yyyy-MM-dd HH:mm",
                    clearable: false,
                    "day-names": ["一", "二", "三", "四", "五", "六", "日"]
                  }, null, 8, ["modelValue", "min-date"]),
                  vue.createElementVNode("div", _hoisted_12, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(presetDates), (presetDate) => {
                      return vue.openBlock(), vue.createElementBlock("button", {
                        key: presetDate[0],
                        class: "bg-blue-700 rounded-md px-4 py-2",
                        onClick: ($event) => selectedDate.value = presetDate[1]
                      }, vue.toDisplayString(presetDate[0]), 9, _hoisted_13);
                    }), 128))
                  ])
                ])) : vue.unref(step) === 3 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
                  _cache[10] || (_cache[10] = vue.createElementVNode("h3", { class: "text-lg font-bold" }, " 请复制并保存以下内容 ", -1)),
                  vue.createElementVNode("p", _hoisted_14, [
                    vue.withDirectives(vue.createElementVNode("textarea", {
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.isRef(ciphertext) ? ciphertext.value = $event : null),
                      readonly: "",
                      class: "w-full h-48 bg-slate-700 rounded px-4 py-2 mb-3"
                    }, null, 512), [
                      [vue.vModelText, vue.unref(ciphertext)]
                    ]),
                    vue.createElementVNode("button", {
                      class: "bg-slate-500 rounded-md px-4 py-2",
                      onClick: copyCiphertext
                    }, " 复制 ")
                  ])
                ], 64)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("div", _hoisted_15, [
                vue.createElementVNode("button", {
                  class: "bg-slate-500 rounded-md px-4 py-2",
                  onClick: _cache[5] || (_cache[5] = ($event) => step.value--)
                }, vue.toDisplayString(vue.unref(step) === 0 ? "解密" : "上一步"), 1),
                vue.createElementVNode("button", {
                  disabled: vue.unref(isNextStepDisabled),
                  class: "bg-blue-500 disabled:bg-blue-700 disabled:cursor-not-allowed rounded-md px-4 py-2",
                  onClick: handleNextStep
                }, vue.toDisplayString(vue.unref(stepButtonText)), 9, _hoisted_16)
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_17, [
              vue.createElementVNode("div", _hoisted_18, [
                _cache[11] || (_cache[11] = vue.createElementVNode("h3", { class: "text-lg font-bold" }, " 解密 ", -1)),
                _cache[12] || (_cache[12] = vue.createElementVNode("p", { class: "py-4 text-xs" }, " 请输入您的密钥 ", -1)),
                vue.withDirectives(vue.createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.isRef(decryptKey) ? decryptKey.value = $event : null),
                  type: "text",
                  class: "w-full bg-slate-700 rounded px-4 py-2",
                  placeholder: "输入您的密钥",
                  rows: "5"
                }, null, 512), [
                  [vue.vModelText, vue.unref(decryptKey)]
                ]),
                vue.unref(decryptedError) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_19, vue.toDisplayString(vue.unref(decryptedError)), 1)) : vue.unref(decryptedContent) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_20, vue.toDisplayString(vue.unref(decryptedContent)), 1)) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("div", { class: "flex justify-end space-x-2" }, [
                vue.createElementVNode("button", {
                  class: "bg-blue-500 rounded-md px-4 py-2",
                  onClick: decryptHandle
                }, " 开始解密 ")
              ])
            ]))
          ])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-360fe089"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const show = vue.ref(false);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("button", {
            class: "relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95",
            onClick: _cache[0] || (_cache[0] = ($event) => show.value = !vue.unref(show))
          }, _cache[2] || (_cache[2] = [
            vue.createElementVNode("span", { class: "w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]" }, [
              vue.createElementVNode("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2"
              }, [
                vue.createElementVNode("path", { d: "M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z" })
              ]),
              vue.createTextVNode("GoodbyeGame")
            ], -1)
          ])),
          vue.unref(show) ? (vue.openBlock(), vue.createBlock(Model, {
            key: 0,
            onClose: _cache[1] || (_cache[1] = ($event) => show.value = false)
          })) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const t = setInterval(() => {
    const box = window.document.querySelector("#parental_setpin_box");
    if (!box)
      return;
    clearInterval(t);
    vue.createApp(_sfc_main).mount(
      (() => {
        const app = document.createElement("div");
        app.id = "vite-app";
        box.appendChild(app);
        return app;
      })()
    );
  }, 500);

})(Vue);