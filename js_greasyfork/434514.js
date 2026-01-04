// ==UserScript==
// @name         VK By RAM
// @namespace    https://greasyfork.org/ru/scripts/434514-vk-old-style-2-0
// @version      3.5.2
// @description  Вернём старый дизайн вместе
// @author       RAM
// @match        *://*.vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @license MIT
// @encoding     utf-8
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/434514/VK%20By%20RAM.user.js
// @updateURL https://update.greasyfork.org/scripts/434514/VK%20By%20RAM.meta.js
// ==/UserScript==
var i,i2,vd
var styleNode = document.createElement("style");
styleNode.id = 'Style'



document.addEventListener('DOMContentLoaded', function() {
      var l = document.querySelector('button.FCPanel__add')
    l.addEventListener("click", chat, false);
}, false);

// СТИЛЬ
styleNode.innerText = `
:root {
        --icon_source: url("https://dl.dropbox.com/s/3blfzz3t2kr5mrt/spr.svgraw=1");
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, Roboto, "Open Sans", "Helvetica Neue", "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
        font-weight: 400;
        -webkit-font-smoothing: subpixel-antialiased;
        line-height: 1.154;
        font-size: 13px;
    }

    [dir] body.new_header_design #page_header_cont {
        background-color: var(--blue_420);
        border-bottom: 1px solid var(--blue_420);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px 0px;
    }

    [dir=ltr] #page_header_wrap {
        background-color: rgb(74, 118, 168);
        border-bottom: 1px solid rgb(72, 114, 163);
    }

    [dir] body.new_header_design .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l1 .top_home_link .top_home_logo {
        background-image: url(http://svgur.com/i/QQF.svg);
        background-size: 32px;
        margin-top: 7px
    }

    [dir] body.new_header_design.ny_2020_logo .p_head_l0 .top_home_link .top_home_logo::before,
    [dir] body.new_header_design.ny_2020_logo .p_head_l97 .top_home_link .top_home_logo::before,
    [dir] body.new_header_design.ny_2020_logo .p_head_l114 .top_home_link .top_home_logo::before,
    [dir] body.new_header_design.ny_2020_logo .p_head_l1 .top_home_link .top_home_logo::before {
        background-image: none;
        background-repeat: no-repeat;
        background-position-y: -1px
    }

    [dir] body.new_header_design .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l1 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l1 .top_home_link .top_home_logo {
        background-image: url(https://i.imgur.com/vtj9udl.png);
        background-size: 46px 23px;
        width: 156px;
        background-position-y: 9px;
        height: 50px
    }

    [dir] body.new_header_design .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design .p_head_l1 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l0 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l97 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l114 .top_home_link .top_home_logo,
    [dir] body.new_header_design.ny_2020_logo .p_head_l1 .top_home_link .top_home_logo:active {
        background-position-y: 10px
    }

    [dir] .TopHomeLink--logoWithText {
        background-size: 32px;
        margin-top: 2px;
        background-size: 46px 23px;
        width: 156px;
        background-position-y: 12px;
        height: 50px
    }

    [dir] .TopHomeLink--logoWithText:active {
        margin-top: 3px
    }

    [dir] .TopHomeLink--ny2021logo:not(.TopHomeLink--logoWithText),
    [dir] body.WideScreenAppPage .TopHomeLink--ny2021logo {
        background-image: url(https://i.imgur.com/vtj9udl.png);
        background-size: 32px;
        margin-top: 2px;
        background-size: 46px 23px;
        width: 156px;
        background-position-y: 12px;
        height: 50px
    }

    [dir] a.TopHomeLink svg {
        /*background: url(https://dl.dropbox.com/s/4j7xoilsqlqpjnm/ic_head_logo.svgraw=1) no-repeat center/contain;*/
        background-image: url('https://archive.fo/HaSgx/5f91644d7587d43caefbf5e3915e65fc61ece117.svg');
        background-repeat:no-repeat;
        background-position:center;
        /* width: 34px;
        height: 19px*/
        height: 23px;
        width: 46px;
        background-size: auto;
        background-origin: padding-box;
    }

    .TopHomeLink {
        width: 40px
    }

    [dir] .HeaderNav__item:first-child {
        padding: 0 125px 2px 0
    }

    [dir=ltr] .ts_cont_wrap {
        left: 179px;
    }

    [dir] .TopHomeLink--ny2021logo:not(.TopHomeLink--logoWithText),
    [dir] body.WideScreenAppPage .TopHomeLink--ny2021logo:active {
        margin-top: 3px
    }

    body.new_header_design #page_header .lamp {
        display: none
    }

    [dir] .HeaderNav__item.HeaderNav__item--logo path,
    .TopNavBtn.TopNavBtn__audio .TopNavBtn__icon path,
    .TopNavBtn.TopNavBtn__notify .TopNavBtn__icon path,
    .top_audio_player_btn svg path {
        display: none
    }

    [dir] body.new_header_design.ny_2020_logo .top_home_link .top_home_logo,
    [dir] body.new_header_design.WideScreenAppPage.ny_2020_logo .top_home_link .top_home_logo {
        background-image: url(https://i.imgur.com/vtj9udl.png);
        background-size: 46px 23px;
        width: 156px;
        background-position-y: 13px;
        height: 50px
    }

    body.new_header_design .top_home_link .top_home_logo,
    body.new_header_design.WideScreenAppPage .top_home_link .top_home_logo {
        width: 34px;
        height: 19px
    }

    body.new_header_design {
        --header-height: 42px;
        --left-menu-row-height: 32px
    }

[dir] body.new_header_design .TopSearch__input {
        background-color: rgb(34, 75, 122);
        border-radius: 20px;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48cGF0aCBmaWxsPSIjODZBMUJGIiBkPSJNOS45NTg1NjA4OCw4LjcyMTEyNDAxIEwxMy42MTg3MTg0LDEyLjM4MTI4MTYgQzEzLjk2MDQyNzIsMTIuNzIyOTkwMyAxMy45NjA0MjcyLDEzLjI3NzAwOTcgMTMuNjE4NzE4NCwxMy42MTg3MTg0IEMxMy4yNzcwMDk3LDEzLjk2MDQyNzIgMTIuNzIyOTkwMywxMy45NjA0MjcyIDEyLjM4MTI4MTYsMTMuNjE4NzE4NCBMOC43MjExMjQwMSw5Ljk1ODU2MDg4IEM3LjgxNTc3OTY0LDEwLjYxMzc3NTYgNi43MDI5OTM1OSwxMSA1LjUsMTEgQzIuNDYyNDMzODgsMTEgMCw4LjUzNzU2NjEyIDAsNS41IEMwLDIuNDYyNDMzODggMi40NjI0MzM4OCwwIDUuNSwwIEM4LjUzNzU2NjEyLDAgMTEsMi40NjI0MzM4OCAxMSw1LjUgQzExLDYuNzAyOTkzNTkgMTAuNjEzNzc1Niw3LjgxNTc3OTY0IDkuOTU4NTYwODgsOC43MjExMjQwMSBaIE01LjUsOS4yNSBDNy41NzEwNjc4MSw5LjI1IDkuMjUsNy41NzEwNjc4MSA5LjI1LDUuNSBDOS4yNSwzLjQyODkzMjE5IDcuNTcxMDY3ODEsMS43NSA1LjUsMS43NSBDMy40Mjg5MzIxOSwxLjc1IDEuNzUsMy40Mjg5MzIxOSAxLjc1LDUuNSBDMS43NSw3LjU3MTA2NzgxIDMuNDI4OTMyMTksOS4yNSA1LjUsOS4yNSBaIi8+PC9zdmc+Cg==');
        height: 28px;
        width: 230px;
        padding: 6px 6px 6px 33px;
        font-size: 13px;
        color: #8dabc7!important;
        border-image-width: 1;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        font-family: -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
    }

    body.new_header_design .TopSearch__input::placeholder,
    body.new_header_design .TopSearch .input_back_content {
        color: #8dabc7!important;
    }

    [dir] body.new_header_design .TopSearch__input #text {
        font-size: 13px;
        color: #000!important
    }

    .top_notify_btn.TopNavBtn.TopNavBtn__notify.has_notify {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LDE4IEM2LjY0NTgzMzMzLDE4IDUuNSwxNy4zIDUuNSwxNiBMMTAuNSwxNiBDMTAuNSwxNy4zIDkuMzU0MTY2NjcsMTggOCwxOCBaIE0xMy45OTU2OTMzLDExIEMxMy45OTU2OTMzLDEyLjUgMTYsMTIuNSAxNiwxMy41IEMxNiwxNCAxNiwxNSAxMy44OTU1OTg0LDE1IEwxLjk4NDMwOTg1LDE1IEMtNi4xOTA2MDM1OWUtMTMsMTUgLTEuNjI1MzY2NTFlLTEzLDE0IC0xLjYzNDI0ODI5ZS0xMywxMy41IEMtMS42MzM2OTMxOGUtMTMsMTIuNSAxLjk4NDMwOTg1LDEyLjUgMiwxMSBMMiw4IEMyLDQgNC4wOTcyNDkwMSwxLjUgNywxLjEgTDcsMSBDNywwLjQgNy41LDUuNzQwNTMxODdlLTE3IDgsMCBDOC41LDAgOSwwLjQgOSwxIEw5LDEuMSBDMTEuOTAyNzUxLDEuNSAxMy45OTU2OTMzLDQgMTMuOTk1NjkzMyw4IEwxMy45OTU2OTMzLDExIFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIgMSkiLz48L3N2Zz4=')!important;
        width: 40px;
        height: 45px;
        background-repeat: no-repeat;
        background-position: center
    }

    .top_notify_btn.TopNavBtn.TopNavBtn__notify {
        background-image: url(https://get-styles.ru/i/w/22d2e11b060c.png)!important;
        color: #1e3c5f;
        width: 40px;
        height: 45px;
        top: 0;
        bottom: 0;
        background-repeat: no-repeat;
        background-position: center
    }

    [dir] .TopNavBtn__notifyCount {
        background-color: var(--orange_prominent);
        height: 10px
    }

    [dir] .TopNavBtn .TopNavBtn__notifyCount {
        border: 2px solid #507299;
        padding: 2px 4px;
        font-size: 9px;
        margin-left: -3px;
        margin-top: 0
    }

    [dir] .TopNavBtn.TopNavBtn__audio .TopNavBtn__icon {
        background: url(https://svgshare.com/i/YeH.svg) no-repeat;
        position: absolute;
        margin-left: -10px;
        margin-top: 0px!important
    }

    [dir] button.top_audio_player_btn.top_audio_player_next {
        background-image: url(https://dl.dropbox.com/s/m6nyau4f4w8rj3p/4.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] button.top_audio_player_btn.top_audio_player_prev {
        background-image: url(https://dl.dropbox.com/s/rm8dqjnx43s272o/3.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] button.top_audio_player_btn.top_audio_player_play {
        background-image: url(https://dl.dropbox.com/s/mo8wk28oa3arpv1/5.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] .top_audio_player_playing button.top_audio_player_btn.top_audio_player_play {
        background-image: url(https://dl.dropbox.com/s/mln4ibrmvauv73c/2.pngraw=1);
        height: 15%;
        opacity: .66;
        background-repeat: no-repeat;
        background-position: center
    }

    [dir] button.top_audio_player_btn.top_audio_player_play {
        background-image: url(http://svgur.com/i/QYS.svg);
        height: 15%;
        opacity: .66
    }

    [dir] body.new_header_design .top_nav_btn#top_notify_btn .top_nav_btn_icon svg {
        color: #1e3c5f
    }

    [dir] body.new_header_design .top_nav_btn#top_notify_btn:hover {
        background-color: var(--blue_980_alpha12)
    }

    [dir] body.new_header_design .top_nav_btn#top_notify_btn.active {
        background-color: var(--blue_600)
    }

    [dir] body.new_header_design .top_nav_btn .top_notify_count {
        border: #4a76a8
    }

    [dir] body.new_header_design .top_nav_btn .top_notify_count:hover {
        border: #4a76a8
    }

    body.new_header_design .top_nav_btn {
        width: 46px
    }

    [dir] body.new_header_design .top_nav_btn#top_audio .top_nav_btn_icon {
        background-image: url(https://dl.dropbox.com/s/tpu0rnab8f6s4rn/SEo2.svgraw=1);
        width: 20px
    }

    [dir] .TopNavBtn.TopNavBtn__audio .TopNavBtn__icon {
        background: url(https://dl.dropbox.com/s/tpu0rnab8f6s4rn/SEo2.svgraw=1) no-repeat;
        width: 20px;
        margin-top: 3px
    }

    body.new_header_design .top_audio_player_title {
        color: var(--light_blue_100);
        line-height: 24px;
        font-size: 13px;
        position: initial;
        padding-top: 1px
    }

    body.new_header_design .top_audio_player_title:hover {
        color: var(--light_blue_100)
    }

    body.new_header_design .top_audio_player:hover .top_audio_player_title {
        color: var(--light_blue_100)
    }

    [dir] body.new_header_design .top_audio_player:hover {
        background-color: var(--blue_980_alpha12)
    }

    [dir] body.new_header_design .top_audio_player {
        width: 300px
    }

    [dir] body.new_header_design .top_audio_player_play .top_audio_player_btn_icon {
        background-image: url(http://svgur.com/i/QYS.svg)
    }

    [dir] body.new_header_design .top_audio_player_next .top_audio_player_btn_icon {
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20opacity%3D%22.2%22%2F%3E%3Cpath%20d%3D%22m13%2012.625v3.8653505c0%20.2819967.2259549.5096495.5046844.5096495h.9906312c.2906494%200%20.5046844-.2281779.5046844-.5096495v-8.98070098c0-.28199673-.2259549-.50964952-.5046844-.50964952h-.9906312c-.2906494%200-.5046844.22817786-.5046844.50964952v3.86535048l-6.56988525-4.10617828c-.23754582-.14846614-.43011475-.04116893-.43011475.2408278v8.98070098c0%20.2814716.19775391.3860533.43011475.2408278z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)
    }

    [dir] body.new_header_design .top_audio_player_prev .top_audio_player_btn_icon {
        background-image: url(http://svgur.com/i/QQy.svg)
    }

    [dir] body.new_header_design .top_audio_player_playing .top_audio_player_play .top_audio_player_btn_icon {
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20opacity%3D%22.2%22%2F%3E%3Cpath%20d%3D%22m7%204.7081449c0-.39109763.31387329-.7081449.69674683-.7081449h2.60650637c.3848026%200%20.6967468.30533409.6967468.7081449v14.5837102c0%20.3910976-.3138733.7081449-.6967468.7081449h-2.60650637c-.38480265%200-.69674683-.3053341-.69674683-.7081449zm6%200c0-.39109763.3138733-.7081449.6967468-.7081449h2.6065064c.3848026%200%20.6967468.30533409.6967468.7081449v14.5837102c0%20.3910976-.3138733.7081449-.6967468.7081449h-2.6065064c-.3848026%200-.6967468-.3053341-.6967468-.7081449z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)
    }

    [dir=ltr] body.new_header_design .top_audio_player > button:not(:last-child),
    [dir=ltr] body.new_header_design .top_audio_player > div:not(:last-child) {
        margin: 0
    }

    body.new_header_design .top_audio_player {
        gap: 0
    }

    body.new_header_design .top_nav_link {
        color: #fff;
        padding-top: 1px;
        font-size: 13px
    }

    body.new_header_design .top_profile_img {
        height: 28px;
        width: 28px
    }

    body.new_header_design .top_nav_link.top_profile_link.active {
        background-color: var(--blue_600)
    }

    body.new_header_design .top_nav_link.top_profile_link:hover {
        background-color: var(--blue_980_alpha12)
    }

    [dir=ltr] .TopNavBtn__profileName {
        margin-right: 10px;
        color: #fff
    }

    [dir] .top_profile_mrow {
        padding: 0 15px;
        color: #2a5885
    }

    [dir=ltr] .left_settings_inner {
        left: 0;
        right: 0;
        margin-top: 12px
    }

    [dir] body.new_header_design #side_bar #l_pr .left_icon {
        background: url(https://i.imgur.com/VmF1YJT.png) no-repeat;
        background-position: center;
        margin-left: 1px
    }

    [dir] body.new_header_design #side_bar li#l_pr .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        2px;
        margin-left: 1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_pr .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_pr {
        margin-left: -1px
    }

    [dir] body.new_header_design #side_bar #l_nwsf .left_icon {
        background-image: url(https://i.imgur.com/6RYj9MG.png);
        height: 14px;
        background-position: center;
        margin-left: -1px
    }

    [dir] body.new_header_design #side_bar li#l_nwsf .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -923px;
        height: 14px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_nwsf .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_msg .left_icon {
        background-image: url(https://i.imgur.com/tT2HtaX.png);
        height: 12px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_msg .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -29px;
        height: 12px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_msg .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_fr .left_icon {
        background-image: url(https://i.imgur.com/y0r0w4T.png);
        height: 13px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_fr .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -83px;
        height: 15px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_fr .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_gr .left_icon,
    [dir] body.new_header_design #side_bar .l_comm .left_icon {
        background-image: url(https://i.imgur.com/dmDyd5n.png);
        height: 11px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_gr .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -112px;
        height: 13px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_gr .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_ph .left_icon {
        background-image: url(https://i.imgur.com/kYwQCgi.png);
        height: 13px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_ph .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -140px;
        height: 14px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_ph .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_aud .left_icon {
        background-image: url(https://i.imgur.com/qSyj9ND.png);
        height: 16px;
        background-position: center;
        margin-left: -1px
    }

    [dir] body.new_header_design #side_bar li#l_aud .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -167px;
        height: 17px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_aud .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_vid .left_icon {
        background-image: url(https://i.imgur.com/P0Fy0pR.png);
        height: 14px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_vid .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -196px;
        height: 15px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_vid .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar .genre10 .left_icon,
    [dir] body.new_header_design #side_bar #l_ap .left_icon {
        background-image: url(https://i.imgur.com/JvkCkCR.png);
        height: 11px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_svd .left_row .LeftMenu__icon > svg {
        background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%237c9cb8%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22M6.697%205.29c.077.305.513.301.584-.006l.98-4.25a1.333%201.333%200%20012.629.401L10.5%206.5h.129a3.371%203.371%200%20013.368%203.563l-1.243-.723C11.08%208.367%209%209.584%209%2011.504v3.492c0%20.31.054.602.153.87A6.151%206.151%200%20017.87%2016H7c-3.705%200-5.5-3-5.5-5v-.188A3.062%203.062%200%20014.562%207.75h.424a1.037%201.037%200%2001.328%202.021l-.051.017a.75.75%200%2010.474%201.423l.051-.017a2.537%202.537%200%2000-.802-4.944h-.424c-.382%200-.754.047-1.11.136l-.34-4.44a1.344%201.344%200%20012.642-.428zm7.042%206.358a6.145%206.145%200%2001-3.167%203.726%201.007%201.007%200%2001-.072-.378v-3.492a.999.999%200%20011.5-.867z%22%20fill-rule%3D%22evenodd%22%2F%3E%3Cpath%20d%3D%22M15.002%2012.383a1.004%201.004%200%20010%201.734L12%2015.863a.999.999%200%2001-1.5-.867v-3.492a.999.999%200%20011.5-.867z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
        height: 16px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_svd .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_ap .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -224px;
        height: 14px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_ap .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_stickers .left_row .LeftMenu__icon > svg {
        background: url(https://i.imgur.com/ax51pGV.png) no-repeat;
        height: 17px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_stickers .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_mini_apps .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/qvf5yk8fmzccovn/m3Cdwz8.pngraw=1) no-repeat;
        height: 15px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_mini_apps .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_mk .left_icon {
        background-image: url(https://i.imgur.com/Gf5CdtQ.png);
        height: 15px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_mk .left_row .LeftMenu__icon > svg {
        background: var(--icon_source) no-repeat;
        background-position: /*x=*/
        1px/*y=*/
        -949px;
        height: 16px;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_mk .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_fav .left_icon {
        background-image: url(https://i.imgur.com/qX7Lpa7.png);
        height: 13px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_fav .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/y8mq04ozsh38aii/qX7Lpa7.pngraw=1) no-repeat;
        height: 13px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_fav .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_doc .left_icon {
        background-image: url(https://i.imgur.com/rOV0bpk.png);
        height: 14px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_doc .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/7lanelbfkqzize6/rOV0bpk.pngraw=1) no-repeat;
        height: 14px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_doc .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar .left_icon,
    [dir] body.new_header_design #l_frb_rgstr .left_icon {
        background-image: url(https://i.imgur.com/o1RNyfP.png);
        height: 15px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar #l_svd .left_icon {
        background-image: url(http://svgur.com/i/QS3.svg);
        height: 16px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar #l_vkp .left_icon {
        background-image: url(https://i.imgur.com/QLrIKPG.png);
        height: 16px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_vkp .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/r122wtnfbsrkjjd/QLrIKPG.pngraw=1) no-repeat;
        height: 16px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_vkp .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_job .left_icon {
        background-image: url(https://i.imgur.com/qtCqxnX.png);
        height: 13px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_job .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/22pv4akdo8fq10n/qtCqxnX.pngraw=1) no-repeat;
        height: 13px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_job .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_fortune .left_icon {
        background: url(https://i.imgur.com/wYVUJsS.png) no-repeat center
    }

    [dir] body.new_header_design #side_bar #l_fortune .left_icon:hover {
        background: url(https://i.imgur.com/9MHXrnL.png) no-repeat center
    }

    [dir] body.new_header_design #side_bar #l_ads .left_icon {
        background-image: url(https://i.imgur.com/keVvCFe.png);
        height: 13px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar li#l_ads .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/j4owcba63ishmcn/keVvCFe.pngraw=1) no-repeat;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar li#l_ads .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar .l_comm .left_row .LeftMenu__icon > svg {
        background: url(https://dl.dropbox.com/s/h3gtdmfacvxut6n/dmDyd5n.pngraw=1) no-repeat;
        height: 11px;
        background-position: center;
        margin-left: -1px;
        fill: #0000
    }

    [dir] body.new_header_design #side_bar .l_comm .left_row .LeftMenu__icon > svg path {
        fill: #0000
    }

    [dir] body.new_header_design #side_bar #l_covid19 .left_icon {
        background-image: url(http://svgur.com/i/QSD.svg);
        height: 16px;
        background-position: center
    }

    [dir] body.new_header_design #side_bar ol li .left_row {
        border-radius: 2px;
        padding: 0 6px;
        height: 28px;
        width: 145px
    }

    [dir] body.new_header_design #side_bar .genre10 .left_icon,
    [dir] body.new_header_design #side_bar .genre11 .left_icon,
    [dir] body.new_header_design #side_bar .genre12 .left_icon,
    [dir] body.new_header_design #side_bar .genre14 .left_icon,
    [dir] body.new_header_design #side_bar .genre15 .left_icon,
    [dir] body.new_header_design #side_bar .genre16 .left_icon,
    [dir] body.new_header_design #side_bar .genre17 .left_icon,
    [dir] body.new_header_design #side_bar .genre18 .left_icon,
    [dir] body.new_header_design #side_bar .genre19 .left_icon,
    [dir] body.new_header_design #side_bar .genre20 .left_icon,
    [dir] body.new_header_design #side_bar .genre21 .left_icon,
    [dir] body.new_header_design #side_bar .genre22 .left_icon,
    [dir] body.new_header_design #side_bar .genre23 .left_icon,
    [dir] body.new_header_design #side_bar #l_ap .left_icon {
        background-image: url(https://i.imgur.com/JvkCkCR.png);
        height: 11px
    }

    [dir] body.new_header_design #side_bar #l_apm .left_icon,
    [dir] body.new_header_design #side_bar #l_mini_apps .left_icon {
        background-image: url(https://i.imgur.com/mEmRJy7.png);
        height: 15px
    }

    body.new_header_design #side_bar .left_label {
        color: #2a5885;
        font-size: 12.5px;
        margin-left: -1px
    }

    [dir] body.new_header_design #side_bar .left_icon {
        margin-bottom: 2px
    }

    body.new_header_design .side_bar_inner {
        width: 164px;
        margin-top: 41px;
        margin-left: -2px
    }

    [dir] body.new_header_design #side_bar .left_count_wrap .left_count {
        color: #2a5885!important;
        padding: 3px 6px
    }

    .left_row .left_count_wrap,
    body.new_header_design #side_bar_inner .left_row:hover .left_count_wrap,
    #side_bar_inner .left_row .left_count_wrap {
        background: #d3d9de!important;
        height: 24px;
        border-radius: 3px!important
    }

    [dir=ltr] body.new_header_design #side_bar .more_div {
        margin: 9px 0 0 9px
    }

    [dir] body.new_header_design .left_count_wrap {
        border-radius: 2px;
        background-color: #d3d9de;
        padding: 0
    }

    [dir] .post_settings .checkbox_pic {
        background: url(https://i.imgur.com/tgJ01hb.png) center no-repeat
    }

    [dir] .media_selector .ms_item.ms_item_photo:before {
        background-image: url(https://i.imgur.com/kYwQCgi.png)
    }

    [dir] .media_selector .ms_item.ms_item_video:before {
        background-image: url(https://i.imgur.com/P0Fy0pR.png)
    }

    [dir] .media_selector .ms_item.ms_item_audio:before {
        background-image: url(https://i.imgur.com/qSyj9ND.png)
    }

    [dir] .media_selector .ms_item.ms_item_doc:before {
        background-image: url(https://i.imgur.com/rOV0bpk.png)
    }

    [dir] .media_selector .ms_item.ms_item_map:before {
        background-image: url(https://i.imgur.com/WAJgFXh.png)
    }

    [dir] .media_selector .ms_item.ms_item_poll:before {
        background-image: url(https://i.imgur.com/dZT8eRJ.png)
    }

    [dir] .media_selector .ms_item.ms_item_market:before {
        background-image: url(https://i.imgur.com/Gf5CdtQ.png)
    }

    [dir] .media_selector .ms_item.ms_item_graffiti:before {
        background-image: url(https://i.imgur.com/1y3QEiY.png)
    }

    [dir] .media_selector .ms_item.ms_item_money:before {
        background-image: url(https://i.imgur.com/QLrIKPG.png)
    }

    [dir] .emoji_smile_icon_vector {
        background: url(https://i.imgur.com/pQoR0K2.png) no-repeat 4px 4px
    }

    [dir] .emoji_smile_icon {
        background: url(https://i.imgur.com/pQoR0K2.png) no-repeat 4px 4px
    }

    [dir] .media_selector .ms_item.ms_item_postpone:before {
        background-image: url(https://i.imgur.com/wRR3FXK.png)
    }

    [dir] .media_selector .ms_item.ms_item_gift:before {
        background-image: url(https://i.imgur.com/FacOAVf.png)
    }

    [dir] .wall_module .reply_box_photo {
        background: url(https://i.imgur.com/kYwQCgi.png) center no-repeat;
        background-size: 16px;
        cursor: pointer;
        border: 0;
        box-shadow: none
    }

    [dir] .wall_module .emoji_smile_icon_vector {
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: 2px 4px
    }

    .im-chat-input .im-chat-input--smile-wrap .emoji_smile_icon_vector {
        opacity: .7;
        background: url(http://svgur.com/i/SRX.svg)
    }

    body.new_header_design .audio_page_player2.audio_page_player_fixed {
        top: 0
    }

    [dir] .im-action_invite::before {
        background-image: url(https://i.imgur.com/QLYQoTo.png)
    }

    [dir] .im-action_media::before {
        background-image: url(https://i.imgur.com/p3GfsxI.png)
    }

    [dir] .im-action_search::before {
        background-image: url(https://i.imgur.com/dtyKhKw.png)
    }

    [dir] .im-action_unread::before {
        background-image: url(https://i.imgur.com/cwAqY7Q.png)
    }

    [dir] .im-action_mute::before {
        background-image: url(https://i.imgur.com/QN9t1H6.png)
    }

    [dir] .im-action_unmute::before {
        background-image: url(https://i.imgur.com/PETqC6t.png)
    }

    [dir] .im-action_pin_hide::before {
        background-image: url(https://i.imgur.com/SWb7yau.png)
    }

    [dir] .im-action_clear::before {
        background-image: url(https://i.imgur.com/GLLI58H.png)
    }

    [dir] .im-action_leave::before {
        background-image: url(https://i.imgur.com/kuGUGq1.png)
    }

    [dir] .im-page--redesigned-menu .ui_actions_menu_sep {
        margin: 4px
    }

    [dir] .friends_only_pic {
        background: url(https://i.imgur.com/qXz9cQ5.png) center no-repeat
    }

    [dir] .friends_only_pic.on {
        background-image: url(https://i.imgur.com/aqib4Ep.png)
    }

    [dir] .feed_lists_icon .ui_actions_menu_icons {
        cursor: pointer;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAcCAYAAAC6YTVCAAAAVUlEQVR4AWPABoomb/sPwgw4wLDUBJIkBZOtaTTIhzMomri1gZQUAVIP10iSBkwbCWvA0EhIA2GNCA2EAXpWGNGaCidte1U0eUsoKZpW5U5aJYpLHgC7ISIaBswTHQAAAABJRU5ErkJggg==);
        background-color: transparent;
        opacity: .75;
        background-position: 4px 3.9px;
        background-repeat: no-repeat;
        background-size: auto
    }

    [dir] .ui_toggler_wrap.hot {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAABA0lEQVR4AWNAB7c9Vdg/xDjvehbpIMJACLyPdgr8EOPy/32089VXoQ48OBW+DHdSfh/t8gykGKqhEbuJkY72H6KdX4MUwXG0y3WoNCNc4YcoFxegO3/BFMFNjnH5ApF3Knkbbc7HAHSXCtDqjyBJLIofvox0FgfKP30X7ZzFAHTXAogkJgYpAuJHUCftZAASb1EVOH/GphHkHwaQu5AU3n8f4+iH3RbnbyBn7EOyNgkUGUD2X0z3O19keB/uqA9kvAcJvItxtoVEjPNmDMVRLjXgoHsT4WgO8vmHaKdUaFAqgdyIZOq5q6HabPCwfuZrzPU20tkDHklRTvIgJwLxYli0AwDQPva9BmGXugAAAABJRU5ErkJggg==);
        background-repeat: no-repeat
    }

    [dir] .im-page-action_spam {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m4.6%2012.9c.9.7%202.1%201.1%203.4%201.1%203.3%200%206-2.7%206-6%200-1.3-.4-2.5-1.1-3.4zm-1.5-1.5%208.4-8.4c-1-.6-2.2-1-3.5-1-3.3%200-6%202.7-6%206%200%201.3.4%202.5%201.1%203.4zm4.9%204.6c-4.4%200-8-3.6-8-8s3.6-8%208-8%208%203.6%208%208-3.6%208-8%208z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E) 10px 5px no-repeat
    }

    [dir] .im-page-action_delete {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2217%22%20viewBox%3D%220%200%2016%2017%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m2%2015c0%201.1.9%202%202%202h8c1.1%200%202-.9%202-2v-10h-12zm8-7c0-.6.4-1%201-1s1%20.4%201%201v6c0%20.6-.4%201-1%201s-1-.4-1-1zm-3%200c0-.6.4-1%201-1s1%20.4%201%201v6c0%20.6-.4%201-1%201s-1-.4-1-1zm-3%200c0-.6.4-1%201-1s1%20.4%201%201v6c0%20.6-.4%201-1%201s-1-.4-1-1zm11-6h-5v-1c0-.6-.4-1-1-1h-2c-.6%200-1%20.4-1%201v1h-5c-.6%200-1%20.4-1%201s.4%201%201%201h14c.6%200%201-.4%201-1s-.4-1-1-1z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E) center no-repeat
    }

    [dir] .im-page-action_star {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2217%22%20viewBox%3D%220%200%2016%2017%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m15.3%206.4-4.7-.5-2.1-4.9c-.3-.7-.8-.7-1%200l-2.1%204.9-4.7.5c-.7.1-.9.5-.3%201l3.8%203.2-1.4%205.2c-.2.7.1.9.7.5l4.5-3.3%204.5%203.3c.6.4.9.2.7-.5l-1.4-5.2%203.8-3.2c.6-.5.5-.9-.3-1z%22%20fill%3D%22%23818C99%22%2F%3E%3C%2Fsvg%3E) center no-repeat
    }

    [dir] .im-page--mess-actions_important .im-page-action_star {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2217%22%20viewBox%3D%220%200%2016%2017%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m15.3%206.4-4.7-.5-2.1-4.9c-.3-.7-.8-.7-1%200l-2.1%204.9-4.7.5c-.7.1-.9.5-.3%201l3.8%203.2-1.4%205.2c-.2.7.1.9.7.5l4.5-3.3%204.5%203.3c.6.4.9.2.7-.5l-1.4-5.2%203.8-3.2c.6-.5.5-.9-.3-1z%22%20fill%3D%22%23678dc8%22%2F%3E%3C%2Fsvg%3E) center no-repeat
    }

    [dir=ltr] .SitpostingEntrypoint {
        float: left;
        padding-right: 14px;
        margin-right: 14px
    }

    [dir=ltr] .media_selector > .ms_item > .ms_item_photo > ._type_photo {
        background-image: url(https://i.imgur.com/kYwQCgi.png)
    }

    .ReactionsMenu,
    .ReactionsMenu--extraHoverArea,
    .ReactionsMenu--extraHoverAreaToTop,
    div.ReactionsPreview__items {
        display: none
    }

    .PostBottomAction {
        --post-bottom-action-background-color: transparent!important
    }

    [dir=ltr] .PostButtonReactions--post .PostButtonReactions__title--textual {
        display: none
    }

    [dir=ltr] .like_tt_reacted-count {
        display: none
    }

    div.ReactionsPreview.ReactionsPreview--active .ReactionsPreview__count._counter_anim_container {
        color: #e64646!important
    }

    [dir] .ReactionsPreview {
        position: absolute!important;
        margin-top: 34px;
        margin-left: 17px;
        width: 50px;
        z-index: 100;
    }

    .PostBottomAction__count,
    .PostBottomAction__label,
    [dir=ltr] .ReactionsPreview__count {
        font-weight: 500!important;
        font-size: 14px!important;
        color: #5e6c77
    }

    .fans_fanph_reaction {
        display: none!important
    }

    li#likes_tab_reactions_0,
    li#likes_tab_reactions_1,
    li#likes_tab_reactions_2,
    li#likes_tab_reactions_3,
    li#likes_tab_reactions_4,
    li#likes_tab_reactions_5,
    .ui_tab.ui_tab_group {
        display: none
    }

    .like_tt_reaction {
        display: none!important
    }

    [dir] .PostActionStatusBar--inPost {
        padding-top: 0!important;
        padding-bottom: 0!important
    }

    div.like_cont.PostBottomActionLikeBtns {
        border-top: 1px solid #e7e8ec!important
    }

    [dir=ltr] .post--withPostBottomAction .PostBottomActionLikeBtns .like_btns {
        margin-top: 5px!important
    }

    [dir] .PostBottomAction::before {
        background-image: none!important
    }

    div.tt_w.like_tt.likes_tt_share.tt_down {
        display: none!important
    }

    [dir] .like_cont {
        padding: 0!important
    }

    [dir] .PostBottomActionLikeBtns.like_cont {
        padding: 12px 0 0!important
    }

    [dir=ltr] .post--withPostBottomAction .PostBottomActionLikeBtns .like_btns {
        margin-top: 5px!important
    }

    .like_btns {
        margin-top: 15px!important
    }

    [dir] .like_wrap {
        padding: 0 20px 8px!important
    }

    .like_views {
        margin-top: 4px!important;
        margin-right: 22px;
    }

    [dir=ltr] .wall_module .reply .like_wrap {
        margin-top: -15px!important
    }

    [dir] .wl_post_body_wrap .Post__copyright:last-child {
        margin-bottom: 0!important
    }

    [dir] .wl_post_body_wrap {
        padding: 15px 25px 0!important
    }

    [dir] .wl_post_body_wrap .page_post_sized_full_thumb_first {
        margin-top: 0
    }

    [dir] .page_post_sized_full_thumb {
        margin: 0
    }

    .wl_replies_block_wrap {
        border-top: 1px solid #e7e8ec!important
    }

    [dir] .deep_active.wall_module .post_replies_header {
        border-top: 0 solid #e7e8ec!important
    }

    .submit_post_box.reply_box.clear_fix._submit_post_box {
        margin-top: -1px!important
    }

    [dir] .wall_module .reply .like_btn,
    [dir] .wcomments_post_content .like_btn {
        padding: 10px!important
    }

    [dir] .wall_module .reply .reply_wrap {
        padding: 8px 0 5px!important
    }

    #l_msg .left_label {
        visibility: hidden
    }

    #l_msg .left_label:before {
        content: 'Сообщения'!important;
        visibility: visible
    }

    #l_gr .left_label {
        visibility: hidden
    }

    #l_gr .left_label:before {
        content: 'Группы'!important;
        visibility: visible
    }

    [dir] .ui_rmenu_item._ui_item_likes.feed_section_likes span {
        visibility: hidden
    }

    [dir] .ui_rmenu_item._ui_item_likes.feed_section_likes:before {
        content: 'Понравилось';
        visibility: visible
    }

    [dir] .post--withPostBottomAction.post--withActionStatusBar .wall_post_cont .wall_signed:last-child {
        box-shadow: none!important
    }

    [dir] .post--withPostBottomAction.post--withActionStatusBar .wall_post_cont .Post__copyright:last-child {
        box-shadow: none!important
    }

    [dir] .post--withPostBottomAction.post--withActionStatusBar .wall_post_cont .media_desc__doc.PostMediaRowWithActionStatusBarSeparator:last-child {
        box-shadow: none!important
    }

    [dir] .post--withPostBottomAction.post--withActionStatusBar .wall_post_cont .media_desc--link.PostMediaRowWithActionStatusBarSeparator:last-child {
        box-shadow: none!important;
        padding-bottom: 0!important
    }

    [dir] .cal_table .day.sel:hover {
        background-color: var(--button_primary_background);
        color: var(--button_primary_foreground)
    }

    [dir] .cal_table > thead {
        background-color: var(--button_primary_background);
        border-bottom: 1px solid var(--separator_common);
        color: var(--button_primary_foreground)
    }

    .cal_month_sel {
        color: var(--button_primary_foreground)
    }

    .cal_table .month .year {
        color: var(--button_primary_foreground)
    }

    .cal_table .month_arr .arr {
        color: var(--button_primary_foreground);
        opacity: .7
    }

    [dir] .CatalogSection--header_section {
        display: none
    }

    a#ui_rmenu_business_notify {
        display: none
    }

    [dir] .TopNavBtn__profileArrow {
        color: #93b3dc
    }

    [dir] .apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app .right_list,
    .page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--promo {
        display: none!important
    }

    [dir] .box_title_wrap,
    [dir] .box_title_wrap.box_grey,
    [dir] .PopupHeader,
    [dir] .ui_tabs.ui_tabs_box,
    ul.ui_tabs.clear_fix.ui_tabs_box,
    ul.ui_tabs.clear_fix.ui_tabs_box:not(ul.ui_tabs.clear_fix.ui_tabs_box) {
        background: #5181b8!important
    }

    ul.ui_tabs.clear_fix.ui_tabs_box {
        background-color: #f3f4f8
    }

    .ui_tab.ui_tab_sel {
        color: #000!important
    }

    .ui_tabs_box .ui_tab_sel .ui_tab_count,
    .ui_tabs_box .ui_tab_count {
        color: #fff
    }

    [dir=ltr] .box_title,
    .box_title_wrap.box_grey .box_title,
    [dir] .PopupHeader__title,
    .ui_tab.ui_tab_sel {
        color: #fff
    }

    .box_x_button {
        color: var(--text_primary)
    }

    [dir=ltr] .box_x_button {
        float: right;
        padding: 15px 20px 15px 15px;
        background: url(https://dl.dropbox.com/s/q2hlgp2329957n8/test.svgraw=1);
        background-repeat: no-repeat;
        background-position: center
    }

    [dir] .PopupHeader__closeBtn {
        border: 0;
        padding: 0;
        cursor: pointer;
        background: url(https://dl.dropbox.com/s/q2hlgp2329957n8/test.svgraw=1);
        background-repeat: no-repeat;
        background-position: center
    }

    [dir] .ui_box_search {
        padding: 20px 12px;
        background: url(https://dl.dropbox.com/s/1mb72ndvryznzf9/search.svgraw=1);
        cursor: pointer;
        background-repeat: no-repeat;
        background-position: center
    }

    .box_x_button svg {
        display: none
    }

    [dir] .ui_box_search svg {
        display: none
    }

    .ui_tabs_box .ui_tab {
        color: #cacaca
    }

    .Icon.Icon--24.Icon--w-24.Icon--h-24.Icon--cancel_24 svg {
        display: none!important
    }

    [dir] .top_notify_btn.TopNavBtn.TopNavBtn__notify.TopNavBtn--active {
        background-color: var(--background_hover)!important
    }

    .im-mess .im-mess--post .post_author .image_status__status .image_status__statusImage,
    ._im_page_peer_name .image_status__status .image_status__statusImage,
    .im-right-menu--text .image_status__status .image_status__statusImage,
    .im-mess-stack--lnk .image_status__status .image_status__statusImage,
    ._im_dialog_link .image_status__status .image_status__statusImage,
    .image_status__status .image_status__statusImage {
        display: none
    }

    .mail_box_header_link,
    .StoriesArchiveTitleControls {
        color: #bcd9fb
    }

    [dir] .wall_module .wall_text,
    [dir] .wall_module.wl_postreach_wall_module .post_poster .wall_text {
        padding: 8px 20px 20px
    }

    [dir] .top_notify_cont .feedback_header a and b:not(.feedback_header .author,
    .feedback_header .mem_link,
    .feedback_header .group_link) {
        color: #000!important
    }

    a.ui_tab.ui_tab_sel {
        color: #000
    }

    [dir] .like_wrap {
        padding: 12px 0
    }

    [dir] .deep_active .post_replies_header,
    [dir] .deep_active.wall_module .post_replies_header {
        border-top: 0!important
    }

    .ui_tabs_box .ui_tab_count:not(span.ui_tab_count) {
        color: #cacaca!important
    }

    #l_aud .left_label {
        visibility: hidden
    }

    #l_aud .left_label:before {
        content: 'Музыка'!important;
        visibility: visible
    }

    #l_vid .left_label {
        visibility: hidden
    }

    #l_vid .left_label:before {
        content: 'Видео'!important;
        visibility: visible
    }

    #l_doc .left_label {
        visibility: hidden
    }

    #l_doc .left_label:before {
        content: 'Документы'!important;
        visibility: visible
    }

    button#docs_add_doc.FlatButton.FlatButton--primary.FlatButton--size-s .FlatButton__in span {
        display: none
    }

    button#docs_add_doc.FlatButton.FlatButton--primary.FlatButton--size-s .FlatButton__in:before {
        content: 'Добавить документ'!important;
        visibility: visible
    }

    a#ui_rmenu_all.ui_rmenu_item._ui_item_all._docs_section_all.ui_rmenu_item_sel span,
    a#ui_rmenu_all.ui_rmenu_item._ui_item_all._docs_section_all span {
        visibility: hidden
    }

    a#ui_rmenu_all.ui_rmenu_item._ui_item_all._docs_section_all.ui_rmenu_item_sel:before,
    a#ui_rmenu_all.ui_rmenu_item._ui_item_all._docs_section_all:before {
        visibility: visible;
        content: 'Все документы'!important
    }

    a.olist_item_wrap.olist_item_menu.olist_item_mail.olist_item_wrap_on span.olist_item_name.fl_l::before {
        content: 'Сообщения';
        visibility: visible
    }

    a.olist_item_wrap.olist_item_menu.olist_item_groups.olist_item_wrap_on span.olist_item_name.fl_l::before {
        content: 'Группы';
        visibility: visible
    }

    a.olist_item_wrap.olist_item_menu.olist_item_groups.olist_item_wrap_on span.olist_item_name.fl_l,
    a.olist_item_wrap.olist_item_menu.olist_item_mail.olist_item_wrap_on span.olist_item_name.fl_l {
        visibility: hidden;
        margin: 0 0 0 -45px
    }

    li#l_pr a::after {
        content: 'Моя Cтраница';
        color: #2a5885;
        font-size: 12.5px;
        margin-left: -1px
    }

    li#l_pr span {
        display: none
    }

    .ms_item.ms_item_money._type_money span.MediaSelector__mediaIcon {
        background: url(https://i.imgur.com/QLrIKPG.png);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .7
    }

    .ms_item.ms_item_gift._type_gift span.MediaSelector__mediaIcon {
        background: url(https://i.imgur.com/FacOAVf.png);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .7
    }

    .ms_item.ms_item_map._type_map span.MediaSelector__mediaIcon {
        background: url(https://i.imgur.com/WAJgFXh.png);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .7
    }

    .ms_item.ms_item_doc._type_doc span.MediaSelector__mediaIcon {
        background: url(https://i.imgur.com/rOV0bpk.png);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .7
    }

    .ms_item.ms_item_audio._type_audio span.MediaSelector__mediaIcon {
        background-image: url('data:image/png;base64,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');
        background-repeat: no-repeat;
        background-position: 0% -109px;
        opacity: .7;
    }

    .ms_item.ms_item_video._type_video span.MediaSelector__mediaIcon {
        background: url('data:image/png;base64,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');
        background-repeat: no-repeat;
        background-position: /*x=*/
        left/*y=*/
        -87px;
        opacity: .7
    }

    a.ms_item.ms_item_photo._type_photo span.MediaSelector__mediaIcon {
        background: url('data:image/png;base64,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');
        background-repeat: no-repeat;
        background-position: /*x=*/
        left/*y=*/
        -65px;
        opacity: .7
    }

    span.SitpostingEntrypoint__icon,
    span.BestFriendsSettingsEntrypoint__icon,
    a.ms_item.ms_item_article._type_article .MediaSelector__mediaIcon {
        color: #4e84a6!important;
        opacity: 1
    }

    a.ms_item.ms_item_photo._type_photo span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_audio._type_audio span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_video._type_video span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_doc._type_doc span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_map._type_map span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_gift._type_gift span.MediaSelector__mediaIcon svg,
    .ms_item.ms_item_money._type_money span.MediaSelector__mediaIcon svg {
        display: none
    }

    .media_selector .ms_items_more .ms_item {
        color: #2a5885
    }

    [dir] .post--withPostBottomAction.post--withActionStatusBar .wall_post_cont .wall_audio_rows.PostMediaRowWithActionStatusBarSeparator:last-child::after {
        margin-bottom: -1px;
        box-shadow: none
    }

    [dir] body.new_header_design .TopSearch__input {
        background-color: rgb(34, 75, 122);
        border-radius: 20px;
        background-image: url(https://vk.com/images/svg_icons/ic_head_loupe.svg);
        height: 28px;
        width: 230px;
        padding: 6px 6px 6px 33px;
        font-size: 13px;
        color: #8dabc7!important;
    }

    [dir] body.new_header_design .TopSearch__input #text {
        font-size: 13px;
        color: #000;
    }

    [dir] body.new_header_design .TopSearch__input:focus {
        background-color: #fff;
        padding: 6px 6px 6px 33px;
        color: #86a1bf!important
    }

    body.new_header_design .TopSearch__input::focus-within {
        color: #8dabc7
    }

    body.new_header_design .TopSearch__input::placeholder,
    body.new_header_design .TopSearch .input_back_content {
        color: #8dabc7
    }

    body.new_header_design .TopSearch__input:focus::placeholder,
    body.new_header_design .TopSearch .input_back_content {
        color: transparent
    }

    [dir] .im-action_unpin_convo::before {
        background-image: url(https://i.imgur.com/SWb7yau.png)
    }

    [dir] .im-action_pin_convo::before {
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20width%3D%2212%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m11.8%204.3-4-4c-.1-.1-.2-.1-.3%200%200%200%200%20.1-.1.1l-.4%201.6-.2.2c-1.2%201.2-2.7%201.8-4.3%201.8h-2c-.1%200-.2.1-.2.2s0%20.1.1.1l3%203-2.9%202.9c-.4.4-.4%201%200%201.4s1%20.4%201.4%200l2.9-2.9%202.9%202.9c.1.1.2.1.3%200l.1-.1v-2c0-1.6.6-3.1%201.8-4.3l.1-.2%201.7-.4c.1%200%20.1-.1.1-.3z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E)
    }

    [dir] .im-action_unpin::before {
        background-image: url(https://i.imgur.com/SWb7yau.png)
    }

    span.PostHeaderActionsButtonMoreIcon svg {
        opacity: 0
    }

    span.PostHeaderActionsButtonMoreIcon {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cpath%20d%3D%22m6.5%2010%205.5%204.5%205.5-4.5%22%20stroke%3D%22%23c1c5cc%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.875%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)
    }

    [dir=ltr] .PostHeaderActionsButtonMoreIcon--inFlatButton {
        background-position-x: -3px;
        background-position-y: -3px
    }

    [dir] .top_notify_btn.TopNavBtn.TopNavBtn__notify.TopNavBtn--active {
        background-image: url(https://dl.dropbox.com/s/fydj2lkzwjai3nz/1.pngraw=1)!important;
        background-repeat: no-repeat;
        background-position: center
    }

.TopNavBtn__audio .TopNavBtn__icon {
    /* background: aliceblue; */
    background: url("https://dl.dropbox.com/s/tpu0rnab8f6s4rn/SEo2.svgraw=1") no-repeat;
    margin-top: 0px!important;
}

.TopNavBtn.TopNavBtn__audio.TopNavBtn--active {
    background-image: url(https://svgshare.com/i/YeH.svg)!important;
    background-repeat: no-repeat;
    background-position: center;
}
    .TopNavBtn.TopNavBtn__audio.TopNavBtn--active span.TopNavBtn__icon {
        opacity: 0
    }

    [dir=ltr] .PostBottomActionLikeBtns .like_btns > .PostBottomAction:not(:first-child),
    [dir=ltr] .PostBottomActionLikeBtns .like_btns > .PostBottomActionContainer:not(:first-child) {
        margin-left: 0
    }

    .EmptyDialogStub.EmptyDialogStub--classic {
        display: none
    }

    .EmptyDialogStickers {
        display: none
    }

    .TopNavBtn.TopNavBtn__profileLink:hover,
    .TopNavBtn.TopNavBtn__profileLink.TopNavBtn.active {
        background-color: #416a9a
    }

    a.ms_item.ms_item_poll._type_poll span.MediaSelector__mediaIcon {
        background: url(https://i.imgur.com/dZT8eRJ.png);
        background-repeat: no-repeat;
        background-position: center;
        opacity: .7
    }

    a.ms_item.ms_item_poll._type_poll span.MediaSelector__mediaIcon svg {
        opacity: 0
    }

    [dir=ltr] .post_author .page_verified,
    [dir=ltr] .reply_author .page_verified,
    [dir=ltr] .feed_notifications .page_verified,
    [dir=ltr] .top_tt_important .page_verified,
    [dir=ltr] .top_notify_cont .page_verified,
    [dir=ltr] .ts_cont_wrap .page_verified,
    span.nim-dialog--verfifed._im_dialog_verified,
    [dir] .im-page--chat-header_verified .im-page--title-main-verified {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%2374A2D6%22%20d%3D%22M5.82331983%2C14.8223666%20L4.54259486%2C15.0281417%20C4.15718795%2C15.0900653%203.78122933%2C14.8730055%203.64215331%2C14.5082715%20L3.17999726%2C13.2962436%20C3.09635683%2C13.0768923%202.92310766%2C12.9036432%202.70375635%2C12.8200027%20L1.49172846%2C12.3578467%20C1.12699447%2C12.2187707%200.909934662%2C11.842812%200.971858288%2C11.4574051%20L1.17763336%2C10.1766802%20C1.21487428%2C9.94489615%201.15146068%2C9.70823338%201.00331709%2C9.52612299%20L0.184748166%2C8.51987017%20C-0.0615827221%2C8.21705981%20-0.0615827221%2C7.78294019%200.184748166%2C7.48012983%20L1.00331709%2C6.47387701%20C1.15146068%2C6.29176662%201.21487428%2C6.05510385%201.17763336%2C5.82331983%20L0.971858288%2C4.54259486%20C0.909934662%2C4.15718795%201.12699447%2C3.78122933%201.49172846%2C3.64215331%20L2.70375635%2C3.17999726%20C2.92310766%2C3.09635683%203.09635683%2C2.92310766%203.17999726%2C2.70375635%20L3.64215331%2C1.49172846%20C3.78122933%2C1.12699447%204.15718795%2C0.909934662%204.54259486%2C0.971858288%20L5.82331983%2C1.17763336%20C6.05510385%2C1.21487428%206.29176662%2C1.15146068%206.47387701%2C1.00331709%20L7.48012983%2C0.184748166%20C7.78294019%2C-0.0615827221%208.21705981%2C-0.0615827221%208.51987017%2C0.184748166%20L9.52612299%2C1.00331709%20C9.70823338%2C1.15146068%209.94489615%2C1.21487428%2010.1766802%2C1.17763336%20L11.4574051%2C0.971858288%20C11.842812%2C0.909934662%2012.2187707%2C1.12699447%2012.3578467%2C1.49172846%20L12.8200027%2C2.70375635%20C12.9036432%2C2.92310766%2013.0768923%2C3.09635683%2013.2962436%2C3.17999726%20L14.5082715%2C3.64215331%20C14.8730055%2C3.78122933%2015.0900653%2C4.15718795%2015.0281417%2C4.54259486%20L14.8223666%2C5.82331983%20C14.7851257%2C6.05510385%2014.8485393%2C6.29176662%2014.9966829%2C6.47387701%20L15.8152518%2C7.48012983%20C16.0615827%2C7.78294019%2016.0615827%2C8.21705981%2015.8152518%2C8.51987017%20L14.9966829%2C9.52612299%20C14.8485393%2C9.70823338%2014.7851257%2C9.94489615%2014.8223666%2C10.1766802%20L15.0281417%2C11.4574051%20C15.0900653%2C11.842812%2014.8730055%2C12.2187707%2014.5082715%2C12.3578467%20L13.2962436%2C12.8200027%20C13.0768923%2C12.9036432%2012.9036432%2C13.0768923%2012.8200027%2C13.2962436%20L12.3578467%2C14.5082715%20C12.2187707%2C14.8730055%2011.842812%2C15.0900653%2011.4574051%2C15.0281417%20L10.1766802%2C14.8223666%20C9.94489615%2C14.7851257%209.70823338%2C14.8485393%209.52612299%2C14.9966829%20L8.51987017%2C15.8152518%20C8.21705981%2C16.0615827%207.78294019%2C16.0615827%207.48012983%2C15.8152518%20L6.47387701%2C14.9966829%20C6.29176662%2C14.8485393%206.05510385%2C14.7851257%205.82331983%2C14.8223666%20L5.82331983%2C14.8223666%20Z%22%2F%3E%0A%20%20%20%20%3Cpolyline%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%221.6%22%20points%3D%224.755%208.252%207%2010.5%2011.495%206.005%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E) no-repeat 0!important
    }

    [dir=ltr] .page_verified {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%2374A2D6%22%20d%3D%22M5.82331983%2C14.8223666%20L4.54259486%2C15.0281417%20C4.15718795%2C15.0900653%203.78122933%2C14.8730055%203.64215331%2C14.5082715%20L3.17999726%2C13.2962436%20C3.09635683%2C13.0768923%202.92310766%2C12.9036432%202.70375635%2C12.8200027%20L1.49172846%2C12.3578467%20C1.12699447%2C12.2187707%200.909934662%2C11.842812%200.971858288%2C11.4574051%20L1.17763336%2C10.1766802%20C1.21487428%2C9.94489615%201.15146068%2C9.70823338%201.00331709%2C9.52612299%20L0.184748166%2C8.51987017%20C-0.0615827221%2C8.21705981%20-0.0615827221%2C7.78294019%200.184748166%2C7.48012983%20L1.00331709%2C6.47387701%20C1.15146068%2C6.29176662%201.21487428%2C6.05510385%201.17763336%2C5.82331983%20L0.971858288%2C4.54259486%20C0.909934662%2C4.15718795%201.12699447%2C3.78122933%201.49172846%2C3.64215331%20L2.70375635%2C3.17999726%20C2.92310766%2C3.09635683%203.09635683%2C2.92310766%203.17999726%2C2.70375635%20L3.64215331%2C1.49172846%20C3.78122933%2C1.12699447%204.15718795%2C0.909934662%204.54259486%2C0.971858288%20L5.82331983%2C1.17763336%20C6.05510385%2C1.21487428%206.29176662%2C1.15146068%206.47387701%2C1.00331709%20L7.48012983%2C0.184748166%20C7.78294019%2C-0.0615827221%208.21705981%2C-0.0615827221%208.51987017%2C0.184748166%20L9.52612299%2C1.00331709%20C9.70823338%2C1.15146068%209.94489615%2C1.21487428%2010.1766802%2C1.17763336%20L11.4574051%2C0.971858288%20C11.842812%2C0.909934662%2012.2187707%2C1.12699447%2012.3578467%2C1.49172846%20L12.8200027%2C2.70375635%20C12.9036432%2C2.92310766%2013.0768923%2C3.09635683%2013.2962436%2C3.17999726%20L14.5082715%2C3.64215331%20C14.8730055%2C3.78122933%2015.0900653%2C4.15718795%2015.0281417%2C4.54259486%20L14.8223666%2C5.82331983%20C14.7851257%2C6.05510385%2014.8485393%2C6.29176662%2014.9966829%2C6.47387701%20L15.8152518%2C7.48012983%20C16.0615827%2C7.78294019%2016.0615827%2C8.21705981%2015.8152518%2C8.51987017%20L14.9966829%2C9.52612299%20C14.8485393%2C9.70823338%2014.7851257%2C9.94489615%2014.8223666%2C10.1766802%20L15.0281417%2C11.4574051%20C15.0900653%2C11.842812%2014.8730055%2C12.2187707%2014.5082715%2C12.3578467%20L13.2962436%2C12.8200027%20C13.0768923%2C12.9036432%2012.9036432%2C13.0768923%2012.8200027%2C13.2962436%20L12.3578467%2C14.5082715%20C12.2187707%2C14.8730055%2011.842812%2C15.0900653%2011.4574051%2C15.0281417%20L10.1766802%2C14.8223666%20C9.94489615%2C14.7851257%209.70823338%2C14.8485393%209.52612299%2C14.9966829%20L8.51987017%2C15.8152518%20C8.21705981%2C16.0615827%207.78294019%2C16.0615827%207.48012983%2C15.8152518%20L6.47387701%2C14.9966829%20C6.29176662%2C14.8485393%206.05510385%2C14.7851257%205.82331983%2C14.8223666%20L5.82331983%2C14.8223666%20Z%22%2F%3E%0A%20%20%20%20%3Cpolyline%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%221.6%22%20points%3D%224.755%208.252%207%2010.5%2011.495%206.005%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E) no-repeat 0!important
    }

    span.nim-dialog--verfifed._im_dialog_verified svg {
        opacity: 0
    }

    .nim-dialog.nim-dialog_verified .nim-dialog--verfifed {
        width: auto;
        height: auto
    }

    .im-page--chat-header_verified .im-page--title-main-verified {
        width: 16px;
        height: 16px
    }

    .reply_author .page_verified {
        padding: 10px 6px 8px 3px !important;
        margin-top: -3px;
        margin-bottom: -6px!important;
        margin-left: -2px!important
    }

    .post_author .page_verified {
        padding: 2px 14px 3px 3px !important
    }

    [dir=ltr] .page_verified,
    [dir=ltr] .page_top_author {
        padding: 10px
    }

    [dir] .im-page--chat-header_verified .im-page--title-main-verified,
    span.nim-dialog--verfifed._im_dialog_verified {
        margin-top: 2px
    }

    [dir=ltr] .post_author .page_verified,
    [dir=ltr] .feed_notifications .page_verified,
    [dir=ltr] .top_tt_important .page_verified,
    [dir=ltr] .top_notify_cont .page_verified,
    [dir=ltr] .reply_author .page_verified,
    [dir=ltr] .ts_cont_wrap .page_verified,
    [dir=ltr] .post_author .page_top_author,
    [dir=ltr] .feed_notifications .page_top_author,
    [dir=ltr] .top_tt_important .page_top_author,
    [dir=ltr] .top_notify_cont .page_top_author,
    [dir=ltr] .reply_author .page_top_author,
    [dir=ltr] .ts_cont_wrap .page_top_author {
        margin-left: 3px;
        padding: 7px 12px 7px 0
    }

    [dir=ltr] .feed_notifications .page_verified,
    [dir=ltr] .top_tt_important .page_verified,
    [dir=ltr] .top_notify_cont .page_verified,
    [dir=ltr] .reply_author .page_verified,
    [dir=ltr] .ts_cont_wrap .page_verified,
    [dir=ltr] .post_author .page_top_author,
    [dir=ltr] .feed_notifications .page_top_author,
    [dir=ltr] .top_tt_important .page_top_author,
    [dir=ltr] .top_notify_cont .page_top_author,
    [dir=ltr] .reply_author .page_top_author,
    [dir=ltr] .ts_cont_wrap .page_top_author {
        margin-left: 4px!important;
        padding: 8px;
        width: 7px;
        margin-bottom: -5px;
        height: 3px
    }

    [dir] .nim-dialog.nim-dialog_classic .nim-dialog--verfifed {
        margin-top: -2px
    }

    .wl_post_actions_wrap .ReactionsPreview__count {
        margin-left: 9px
    }

    [dir=ltr] .ReactionsPreview__count {
        margin-left: 16px
    }

    [dir] .im-activity .im-activity--icon .pr_bt {
        background: #adadad;
    }

    [dir=ltr] .ReactionsPreview::after {
        left: 10px;
        right: -6px
    }

    div.im-search--calendar._im_search_date {
        background: url(https://st4-10.vk.com/images/icons/calendar.png?2) no-repeat
    }

    div.im-search--calendar._im_search_date svg {
        visibility: hidden
    }

    [dir] .wl_post_actions_wrap .like_wrap .PostButtonReactionsContainer,
    .PostButtonReactionsContainer {
        padding: 0 30px 0 0
    }

    .FCPanel--collapsed .FCPanel__list {
        transform: none;
        transition-timing-function: none
    }

    .FCWindow__header {
        background: #4a76a8
    }

    .FCThumb,
    button.FCPanel__add {
        background: #dae2ea
    }

    .FCWindow__title.FCWindow__title,
    .ConvoTitle__title,
    .FCIconButton {
        color: #fff
    }

    a.ui_tab.ui_tab_sel {
        color: #000!important
    }

    .ConvoTitle .ConvoTitle__title,
    a.ui_tab.ui_tab_sel {
        color: var(--text_primary)
    }

    .Icon.Icon--24.Icon--w-24.Icon--h-24.Icon--cancel_24 {
        background: url(https://dl.dropbox.com/s/q2hlgp2329957n8/test.svg);
        cursor: pointer;
        background-repeat: no-repeat;
        background-position: center
    }

    .FCThumb:first-child {
        border-radius: 4px 4px 0 0
    }

    .FCPanel--collapsed:not(:hover) .FCPanel__add {
        border-radius: 0
    }

    .FCThumb--collapsed .FCThumb__close {
        width: 14px;
        height: 14px
    }

    article.FCThumb.FCThumb--collapsed:hover,
    .FCPanel__add:hover {
        background: var(--steel_gray_140)!important
    }

    .FCThumb--wide .FCThumb__close {
        box-shadow: none;
        background: #dae2ea
    }

    .FCConvo__title .ConvoTitle__title {
        color: #fff
    }

    section.FCWindow.FCWindow--active:not(section.FCWindow.FCConvo.FCWindow--active) header.FCWindow__header::before {
        content: 'Друзей онлайн';
        color: #fff;
        padding: 0 0 0 20px
    }

    h1.FCWindow__title:not(section.FCWindow.FCConvo.FCWindow--active h1.FCWindow__title) {
        visibility: hidden
    }

    figure.MEAvatar.MEAvatar--size-24 {
        display: none
    }

    .PostButtonReactions__icon.PostButtonReactions__icon--custom.PostButtonReactions__icon--animationActive,
    .PostButtonReactions__icon.PostButtonReactions__icon--custom {
        background-size: 24px
    }

    .ui_actions_menu_item_panel {
        position: fixed;
        background: #fff;
        width: 550px;
        bottom: 0
    }

    a#fixset {
        padding: 0;
        width: 32px;
        left: 498px;
        margin: 8px
    }

    [dir] .TopNavBtn:hover {
        background-color: #43648c
    }

    .ui_actions_menu._ui_menu.ui_actions_menu--actionSheet {
        box-shadow: 0 1px 3px var(--black_alpha8);
        border-radius: 4px;
        border: 1px solid var(--steel_gray_140)
    }

    .ui_actions_menu._ui_menu.ui_actions_menu--actionSheet a {
        color: var(--blue_600)
    }

    [dir] .ui_actions_menu--actionSheet .ui_actions_menu_item:hover {
        background-color: var(--light_blue_40)
    }

    [dir] .top_nav_link:hover {
        background-color: var(--blue_980_alpha12)
    }

    a.FlatButton.FlatButton--secondary.FlatButton--size-m.FlatButton--wide.dotbtn {
        margin-left: 0
    }

    .hidden-block {
        display: none;
        transition: 1s ease-in-out;
        opacity: 0
    }

    [dir] .owner_photo_wrap:hover .owner_photo_bubble {
        margin-top: 23px
    }

    [dir] .page_photo.ProfileActions {
        padding: 15px
    }

    a.FlatButton.FlatButton--secondary.FlatButton--size-m.FlatButton--wide.dotbtn {
        width: 30px
    }

    a.FlatButton.FlatButton--secondary.FlatButton--size-m.FlatButton--wide.dotbtn span.FlatButton__content {
        font-size: 25px;
        margin-bottom: 16px;
        color: #93a3bc
    }

    a#profile_edit_act {
        width: 164px;
        background: #4a76a8;
        color: #e5ebf1
    }

    [dir] .eltt.eltt_fancy {
        box-shadow: 0 1px 3px var(--black_alpha8)!important;
        border-radius: 4px!important;
        border: 1px solid var(--steel_gray_140)!important
    }

    .im-action:hover::before {
        filter: brightness(0.8)
    }

    [dir=ltr] .im-page_classic.im-page.ui_search_field.im-page--dialogs-search_fill .ui_actions_menu_item_panel {
        display: none
    }

    .uihidden {
        display: none
    }

    .Icon.Icon--16.Icon--w-16.Icon--h-16.Icon--verified_16 svg {
        display: none!important
    }

    .FCWindow {
        box-shadow: none
    }

    a.olist_item_wrap.olist_item_menu.olist_item_profile.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_news.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_mail.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_friends.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_groups.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_photos.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_audio.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_video.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_apps.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_clips.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_market path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_mini_apps.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_vkpay.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_worki_app.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_faves.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_docs.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_ads_link.olist_item_wrap_on path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_apps_manage.olist_item_wrap_on path,
    div#like_share_friends_only svg,
    span.PostOption.PostSettings__gear svg {
        opacity: 0
    }

    a.olist_item_wrap.olist_item_menu.olist_item_profile.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/VmF1YJT.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_news.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/6RYj9MG.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_mail.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/tT2HtaX.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_friends.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/y0r0w4T.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_groups.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/dmDyd5n.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_photos.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/kYwQCgi.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_audio.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/qSyj9ND.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_video.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/P0Fy0pR.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_apps.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/JvkCkCR.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_clips.olist_item_wrap_on svg {
        background: url(http://svgur.com/i/UB4.svg) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_market svg {
        background: url(https://i.imgur.com/Gf5CdtQ.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_mini_apps.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/m3Cdwz8.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_vkpay.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/QLrIKPG.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_worki_app.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/qtCqxnX.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_faves.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/qX7Lpa7.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_docs.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/rOV0bpk.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_ads_link.olist_item_wrap_on svg {
        background: url(https://i.imgur.com/keVvCFe.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_apps_manage svg {
        background: url(https://i.imgur.com/JvkCkCR.png) no-repeat center
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_apps_manage span.olist_item_name.fl_l::after {
        content: ' играми'
    }

    li#l_apm svg {
        background: url(https://dl.dropbox.com/s/p79hsbqczew93cp/JvkCkCR.pngraw=1) no-repeat center
    }

    li#l_apm path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_apps_manage path {
        opacity: 0
    }

    [dir] .top_notify_btn.TopNavBtn.TopNavBtn__notify.TopNavBtn--active {
        background-image: url(https://dl.dropbox.com/s/7ztou4disdr1dml/1.pngraw=1)!important;
        background-repeat: no-repeat;
        background-position: center
    }

    [dir] button.top_audio_player_btn.top_audio_player_next {
        background-image: url(https://dl.dropbox.com/s/6x74a18r493hg33/next.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] button.top_audio_player_btn.top_audio_player_prev {
        background-image: url(https://dl.dropbox.com/s/ora9njriv7306ug/prev.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] button.top_audio_player_btn.top_audio_player_play {
        background-image: url(https://dl.dropbox.com/s/t39zu4p2y6y8y5k/play.pngraw=1);
        background-repeat: no-repeat;
        background-position: center;
        height: 15%;
        opacity: .7
    }

    [dir] .top_audio_player_playing button.top_audio_player_btn.top_audio_player_play {
        background-image: url(https://dl.dropbox.com/s/gmfoj8zzjjle8f5/pause.pngraw=1);
        height: 15%;
        opacity: .66;
        background-repeat: no-repeat;
        background-position: center
    }

    div#narrow_column a.profile_warning_row.clear_fix {
        display: none!important
    }

    .top_profile_vkconnect_card_wrapper {
        display: none
    }

    [dir] #top_profile_menu.top_profile_menu_new {
        box-shadow: rgba(0, 0, 0, 0.0976562) 0 1px 3px;
        padding: 4px 0;
        border-radius: 3px!important;
        border-color: #c5d0db!important
    }

    [dir] #top_profile_menu.top_profile_menu_new .top_profile_mrow {
        padding: 0 15px;
        width: 130px!important
    }

    #top_profile_menu.top_profile_menu_new {
        min-width: 160px
    }

    div#top_profile_menu {
        color: #2a5885
    }

    #top_profile_menu.top_profile_menu_new .top_profile_mrow {
        line-height: 30px;
        height: 30px
    }

    a#top_home_link span {
        padding: 0 8px
    }

    [dir=ltr] body.new_header_design #top_profile_menu.top_profile_menu_new {
        top: 50px;
    }

    div#top_profile_menu {
        overflow: visible!important
    }

    .PostBottomActionLikeIcon.PostBottomActionLikeIcon--active {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22m17%202.9a6.43%206.43%200%200%201%206.4%206.43c0%203.57-1.43%205.36-7.45%2010l-2.78%202.16a1.9%201.9%200%200%201%20-2.33%200l-2.79-2.12c-6.05-4.68-7.45-6.47-7.45-10.04a6.43%206.43%200%200%201%206.4-6.43%205.7%205.7%200%200%201%205%203.1%205.7%205.7%200%200%201%205-3.1z%22%20fill%3D%22%23ff3347%22%2F%3E%3C%2Fsvg%3E)
    }

    .PostBottomActionLikeIcon.PostBottomActionLikeIcon--inactive {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ctitle%3Elike_outline_24%3C%2Ftitle%3E%3Cpath%20d%3D%22M0%2C0H24V24H0Z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M17%2C2.9A6.43%2C6.43%2C0%2C0%2C1%2C23.4%2C9.33c0%2C3.57-1.43%2C5.36-7.45%2C10l-2.78%2C2.16a1.9%2C1.9%2C0%2C0%2C1-2.33%2C0L8.05%2C19.37C2%2C14.69.6%2C12.9.6%2C9.33A6.43%2C6.43%2C0%2C0%2C1%2C7%2C2.9a6.46%2C6.46%2C0%2C0%2C1%2C5%2C2.54A6.46%2C6.46%2C0%2C0%2C1%2C17%2C2.9ZM7%2C4.7A4.63%2C4.63%2C0%2C0%2C0%2C2.4%2C9.33c0%2C2.82%2C1.15%2C4.26%2C6.76%2C8.63l2.78%2C2.16a.1.1%2C0%2C0%2C0%2C.12%2C0L14.84%2C18c5.61-4.36%2C6.76-5.8%2C6.76-8.63A4.63%2C4.63%2C0%2C0%2C0%2C17%2C4.7c-1.56%2C0-3%2C.88-4.23%2C2.73L12%2C8.5l-.74-1.07C10%2C5.58%2C8.58%2C4.7%2C7%2C4.7Z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E);
        opacity: .6
    }

    a.FlatButton.FlatButton--secondary.FlatButton--size-m.FlatButton--wide.dotbtn {
        width: 30px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAAVUlEQVQ4y2OYtmSv5+Qlex+DMIjNgARIkgNzFu/5D8ZANrJikuSoZhDVvDYKRsEoGAUUgsaeuZ713XMfgzCITbYciFHXPfc/CIPYyIpJkqOaQdTyGgB1UvaF+JG3AgAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: -6px
    }

    [dir] .ui_actions_menu_item:hover {
        background-color: #22222200
    }

    [dir] .im-action_messenger_settings::before {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAWlBMVEUAAACSormTo7yRobqAn5+ToruTo7ySoruSkraRoLqSo7yRortVVapmmZmTo7uTorySoruToruSoryTorySo7uSorwAAACSoruToruAgICSoryTobySo7ySorvlwXDZAAAAHnRSTlMATf5RCHH/fAdD9o4DBZ6qg/XJ5+a9Ad6ZBJ996I/QAalFAAAAj0lEQVR4AXWQhQGEMAwAgx3uDu3+a37adzuoxRO5EYRhJE9iXQmkemTiyYuyqhtoa+n6XJSsh2FEmWboY1E6XijFsaiSddtWYKi8aJ/g0LjxAWPtsicNrCpR2QpNEkiIsolnQwl/iaKzvTtmK7Spa6K+hc8OMLV4vot4K9X+aygv7K3tRdt+G855G86PEV4AnswInNZD9fcAAAAASUVORK5CYII=);
        background-size: 17.99px
    }

    [dir] .feed_filter_icon {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAcCAYAAAC6YTVCAAAAVUlEQVR4AWPABoomb/sPwgw4wLDUBJIkBZOtaTTIhzMomri1gZQUAVIP10iSBkwbCWvA0EhIA2GNCA2EAXpWGNGaCidte1U0eUsoKZpW5U5aJYpLHgC7ISIaBswTHQAAAABJRU5ErkJggg==);
        opacity: .75;
        background-repeat: no-repeat;
        background-position: 3px -12px
    }

    .post_author .page_verified,
    .feed_notifications .page_verified,
    .top_tt_important .page_verified,
    .top_notify_cont .page_verified,
    .reply_author .page_verified,
    .ts_cont_wrap .page_verified,
    .post_author .page_top_author,
    .feed_notifications .page_top_author,
    .top_tt_important .page_top_author,
    .top_notify_cont .page_top_author,
    .reply_author .page_top_author,
    .ts_cont_wrap .page_top_author {
        display: inline-block
    }

    .PostHeaderInfo.PostHeaderInfo--inHeader.PostHeaderInfo--legacy a.page_verified {
        height: 10px
    }

    .ui_actions_menu_item_panel {
        border-style: solid none none;
        border-width: 1px medium medium;
        border-top-color: #e4e6e9;
        height: 45px
    }

    section.ChatSettings .Icon.Icon--24.Icon--w-24.Icon--h-24.Icon--cancel_24 {
        background: none
    }

    button.im-page--dialogs-header-control.im-page--dialogs-header-control_convo._im_create_convo svg {
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij48cGF0aCBmaWxsPSIjOTFBOEM0IiBkPSJNOCA2di02aC0ydjZoLTZ2Mmg2djZoMnYtNmg2di0yaC02eiIvPjwvc3ZnPg==) no-repeat center
    }

    button.im-page--dialogs-header-control.im-page--dialogs-header-control_convo._im_create_convo path {
        opacity: 0
    }

    #top_profile_menu.top_profile_menu--has-vkconnect {
        min-width: 162px;
        max-width: 162px;
        width: 162px
    }

    body.new_header_design #top_profile_menu {
        top: 52px
    }

    [dir] .olist_item_name {
        margin: 0 10px!important
    }

    a.on_f::before {
        visibility: visible;
        content: 'Включить звуковые уведомления'
    }

    a.on_f {
        visibility: hidden
    }

    [dir=ltr] .deep_active .post_replies_header .post_replies_reorder--withLegacyIcon,
    [dir=ltr] .deep_active.wall_module .post_replies_header .post_replies_reorder--withLegacyIcon {
        background-position-y: center
    }

    a.ms_item.ms_item_graffiti._type_graffiti svg {
        background: url(https://dl.dropbox.com/s/xou3otrvz2mtg5p/d1191d35d10bfe23fe27dcec6a981f76e0a8f893.pngraw=1) no-repeat center;
        background-size: 16px
    }

    a.ms_item.ms_item_market._type_market svg {
        background: url(https://i.imgur.com/Gf5CdtQ.png) no-repeat center
    }

    a.ms_item.ms_item_graffiti._type_graffiti path,
    a.ms_item.ms_item_market._type_market path {
        opacity: 0
    }

    .reply_field_wrap._emoji_field_wrap .reply_box_more_attaches::before,
    span.reply_fake_more_attaches {
        background: url(https://archive.md/wyfux/1ee14179fbe0b671e4d10d901e96feca8dc3226b.svg)!important;
        background-size: auto 18px!important;
        background-repeat: no-repeat!important;
        background-position: 2px 50%!important
    }

    .reply_field_wrap._emoji_field_wrap .emoji_smile_icon_vector.emoji_smile_icon,
    [dir] .emoji_smile_icon_vector {
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIG9wYWNpdHk9Ii40IiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZmlsbD0iIzgyOEE5OSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMiAxMkMyIDYuNDc3IDYuNDc3IDIgMTIgMnMxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMFMyIDE3LjUyMyAyIDEyem0xOC4zIDBhOC4zIDguMyAwIDEgMC0xNi42IDAgOC4zIDguMyAwIDAgMCAxNi42IDB6bS0xMS4wNS0uNWExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDAgMi41em01LjUgMGExLjI1IDEuMjUgMCAxIDEgMC0yLjUgMS4yNSAxLjI1IDAgMCAxIDAgMi41eiIvPjxwYXRoIHN0cm9rZT0iIzgyOEE5OSIgc3Ryb2tlLXdpZHRoPSIxLjciIGQ9Ik05IDE0Ljg1Yy44MzMuNzY3IDEuODMzIDEuMTUgMyAxLjE1czIuMTY3LS4zODMgMy0xLjE1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PC9zdmc+);
        background-size: auto 20px;
        background-position: 2px 2px
    }

    .reply_field_wrap._emoji_field_wrap button.reply_box_photo,
    [dir] .wall_module .reply_box_photo {
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM4MjhBOTkiIHN0cm9rZS13aWR0aD0iMS43Ij48cGF0aCBkPSJNMTQuMTM0IDMuNjVjLjg1MyAwIDEuNDYuMjc4IDEuOTg4Ljg5OS4wMTcuMDE5LjQ5NC42MS42Ni44MTUuMjI4LjI4MS42NzQuNTM2Ljk0NS41MzZoLjQxQzIwLjU1NiA1LjkgMjIgNy40NjMgMjIgOS45NXY1Ljg1YzAgMi4yNDEtMiA0LjItNC4yNzMgNC4ySDYuMjczYy0yLjI2NyAwLTQuMjIzLTEuOTUzLTQuMjIzLTQuMlY5Ljk1YzAtMi40OTYgMS40LTQuMDUgMy44MTQtNC4wNWguNDA5Yy4yNzEgMCAuNzE3LS4yNTUuOTQ1LS41MzYuMTY2LS4yMDQuNjQzLS43OTYuNjYtLjgxNS41MjgtLjYyMSAxLjEzNS0uODk5IDEuOTg4LS44OTloNC4yNjh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMy44NSIvPjwvZz48L3N2Zz4=)!important;
        background-size: auto 20px;
        background-position: 50% 60%
    }

    .TopNavBtn.TopNavBtn__profileLink:hover,
    .TopNavBtn.TopNavBtn__profileLink.TopNavBtn.active {
        background-color: #43648c
    }

    [dir] .TopNavBtn.TopNavBtn--active,
    [dir] .TopNavBtn.active,
    [dir] .top_notify_btn.TopNavBtn.TopNavBtn__notify.TopNavBtn--active {
        background-color: #43648c!important
    }

    a#top_notify_btn {
        height: 43px
    }

    span.PostOption.PostSettings__gear {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAWlBMVEUAAACSormTo7yRobqAn5+ToruTo7ySoruSkraRoLqSo7yRortVVapmmZmTo7uTorySoruToruSoryTorySo7uSorwAAACSoruToruAgICSoryTobySo7ySorvlwXDZAAAAHnRSTlMATf5RCHH/fAdD9o4DBZ6qg/XJ5+a9Ad6ZBJ996I/QAalFAAAAj0lEQVR4AXWQhQGEMAwAgx3uDu3+a37adzuoxRO5EYRhJE9iXQmkemTiyYuyqhtoa+n6XJSsh2FEmWboY1E6XijFsaiSddtWYKi8aJ/g0LjxAWPtsicNrCpR2QpNEkiIsolnQwl/iaKzvTtmK7Spa6K+hc8OMLV4vot4K9X+aygv7K3tRdt+G855G86PEV4AnswInNZD9fcAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: center
    }

    .im_stickers_store_wrap .ui_tab.ui_tab_sel {
        color: #000!important
    }

    .video_showcase .TopHomeLink {
        display: flex
    }

    a.VKVideoLogo,
    [dir=ltr] .video_showcase .PortalNavigation,
    .VideoLayout__scrollTop.VideoLayout__scrollTop--active,
    .VideoLayout__aside,
    .ui_search_new.ui_search.ui_search_field_empty.video_search_input.VideoSearchInput.ui_search_custom.ui_search_with_custom_controls._wrap.VideoSearchInput--sticky,
    .VideoInfoPanel {
        display: none!important
    }

    .VideoLayout__aside {
        flex: 0
    }

    [dir] .VideoLayout__mainContent {
        border-radius: 4px
    }

    [dir] .VideoLayout__mainContent.page_block {
        margin-top: -10px;
        width: 796px
    }

    div#video_search_header {
        display: none!important
    }

    div#video_block_header {
        display: block!important
    }

    .ui_search_new.ui_search.video_search_input.ui_search_btn_large._wrap {
        min-width: 604px!important;
        width: auto!important
    }

    button.ui_search_reset_button.ui_search_button_control svg,
    button.ui_search_params_button._ui_search_params_button.ui_search_button_control svg {
        opacity: 0
    }

    [dir=ltr] .box_title .back,
    .box_grey .box_title .toggle,
    .box_title .divider::before,
    [dir=ltr] .ui_crumb_count,
    [dir] .ui_tabs_box .ui_tab,
    .box_title_wrap.box_white .box_title,
    a.ui_box_header_link {
        color: #fff;
    }

    div#im_form_emoji {
        display: none
    }

    [dir] .ui_tabs_box .ui_tab_sel,
    [dir] .ui_tabs_box .ui_tab_sel:hover {
        border-bottom: 3px solid #f2f3f4!important
    }

    [dir] .ui_tabs_box .ui_tabs_slider {
        background-color: #f2f3f4!important
    }

    .im-dialog-select.im-dialog-select_classic._im_search_cancel.im-dialog-select_rotated svg {
        opacity: 1
    }

    [dir] .OwnerChooser__dropdown {
        background-color: var(--background_content);
        box-shadow: 0 1px 3px var(--black_alpha8);
        border: 1px solid var(--steel_gray_140);
        border-radius: 4px
    }

    [dir] .OwnerChooser__dropdownItem {
        color: #000!important
    }

    .VideoCard__thumb.js-video-item-thumb,
    .VideoCard__thumbWrapper.video_item_thumb_wrap {
        border-radius: 2px!important
    }

    div[data-task-click="VideoShowcase/menu_bookmark_video"] svg {
        background: url(https://i.imgur.com/qX7Lpa7.png) no-repeat center
    }

    div[data-task-click="VideoShowcase/menu_bookmark_video"] path {
        opacity: 0
    }

    [href="/classifieds"] span.left_label.inl_bl::before {
        content: 'Маркет';
        visibility: visible;
    }

    [href="/classifieds"] span.left_label.inl_bl {
        visibility: hidden;
    }

    a.ms_item.ms_item_article._type_article svg {
        background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cpath%20d%3D%22m8%206v7c0%20.5522847-.44771525%201-1%201s-1-.4477153-1-1v-7h-2c-.55228475%200-1-.44771525-1-1%200-.55228475.44771525-1%201-1h6c.5522847%200%201%20.44771525%201%201%200%20.55228475-.4477153%201-1%201zm4%206h8c.5522847%200%201%20.4477153%201%201s-.4477153%201-1%201h-8c-.5522847%200-1-.4477153-1-1s.4477153-1%201-1zm2-5h6c.5522847%200%201%20.44771525%201%201s-.4477153%201-1%201h-6c-.5522847%200-1-.44771525-1-1s.4477153-1%201-1zm-8%2010h14c.5522847%200%201%20.4477153%201%201s-.4477153%201-1%201h-14c-.55228475%200-1-.4477153-1-1s.44771525-1%201-1z%22%20fill%3D%22%23728fb5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
        background-position: center;
        opacity: .7;
    }

    a.ms_item.ms_item_article._type_article path {
        opacity: 0;
    }

    .videoplayer_ads {
        display: none!Important;
    }

    .videoplayer_media {
        visibility: visible!important;
    }

    ul.ConvoRecommendList {
        display: none;
    }

    [dir] .wl_post_actions_wrap .like_wrap .PostButtonReactionsContainer,
    .PostButtonReactionsContainer {
        padding: 0 20px 0 0;
    }

    .PostBottomAction.PostBottomAction--withBg.comment._comment._reply_wrap {
        margin-right: 14px;
    }

    .PostButtonReactions__title._counter_anim_container {
        margin-left: 2px;
        margin-bottom: 0px;
    }

    span.PostBottomAction__count._like_button_count._counter_anim_container.PostBottomAction__count--withBg {
        margin-bottom: -1px;
    }

    ul.ui_tabs.clear_fix.ui_tabs_box[data-inited="1"] .ui_tab.ui_tab_sel {
        color: white!Important;
    }

    [dir] .like_wrap {
        padding: 12px 0;
        margin: 10px -8px 0!important;
    }

    .PostButtonReactions__icon.PostButtonReactions__icon--custom.PostButtonReactions__icon--animationActive svg,
    .PostButtonReactions__icon svg {
        display: none;
    }

    .PostButtonReactions__icon {
        background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ctitle%3Elike_outline_24%3C%2Ftitle%3E%3Cpath%20d%3D%22M0%2C0H24V24H0Z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M17%2C2.9A6.43%2C6.43%2C0%2C0%2C1%2C23.4%2C9.33c0%2C3.57-1.43%2C5.36-7.45%2C10l-2.78%2C2.16a1.9%2C1.9%2C0%2C0%2C1-2.33%2C0L8.05%2C19.37C2%2C14.69.6%2C12.9.6%2C9.33A6.43%2C6.43%2C0%2C0%2C1%2C7%2C2.9a6.46%2C6.46%2C0%2C0%2C1%2C5%2C2.54A6.46%2C6.46%2C0%2C0%2C1%2C17%2C2.9ZM7%2C4.7A4.63%2C4.63%2C0%2C0%2C0%2C2.4%2C9.33c0%2C2.82%2C1.15%2C4.26%2C6.76%2C8.63l2.78%2C2.16a.1.1%2C0%2C0%2C0%2C.12%2C0L14.84%2C18c5.61-4.36%2C6.76-5.8%2C6.76-8.63A4.63%2C4.63%2C0%2C0%2C0%2C17%2C4.7c-1.56%2C0-3%2C.88-4.23%2C2.73L12%2C8.5l-.74-1.07C10%2C5.58%2C8.58%2C4.7%2C7%2C4.7Z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fsvg%3E);
    }

    [dir] .owner_photo_wrap:hover .owner_photo_bubble {
        margin-top: 0!important;
    }

    [aria-label="Отправить подарок"] span.FlatButton__before svg {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAkElEQVR4Ab3MAQYCQRjF8VndKCIR6ThBB4hFBwgQQZ1pbRupAwQaUoDm6z+85bPCBj1+hjfPF3LMbIgad6zULRDRYBzaaLhEiZwRHthhg5MfR0wx0PU9bigwQ/TjEglXPHHGS+8b6+BDMcEWDSIuOGDuR0frRH03tcpeY/ttrI/C+94pfS7/Z1whtdQlp8rdBxVxpx3ekLiVAAAAAElFTkSuQmCC');
        background-repeat: no-repeat;
    }

    [aria-label="Отправить подарок"] span.FlatButton__before path {
        opacity: 0;
    }

    .audio_row__cover > svg > g {
        opacity: 0;
    }

    button.audio_page__main_tabs_btn.audio_page__add_audio_btn > svg > g {
        opacity: 0;
    }

    button.audio_page__main_tabs_btn.audio_page__add_playlist_btn > svg > g {
        opacity: 0;
    }

    .audio_row__cover > svg {
        opacity: 1;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAKlBMVEXn7vbf6fPJ2eu1y+OhvNuNrtOJrNN1nstvmcja5PCZt9h7oc14n8t7os1SyURbAAAAQElEQVR4AWMYzkDIJAxTsKKjA1OwA7tgOxZBZ0UsgkA8mAQ5V+/CFJyDzZMrsAnuICyI0N6LzaKT2Jw0YRgnNQD3vBu6V0sXEQAAAABJRU5ErkJggg==');
        background-position: center;
    }

    button.audio_page__main_tabs_btn.audio_page__add_audio_btn > svg {
        background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2219%22%20viewBox%3D%220%200%2026%2019%22%20width%3D%2226%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20transform%3D%22translate(1%20-3)%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cg%20stroke%3D%22%23828a99%22%20stroke-linecap%3D%22round%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m7%2019h-3.5c-1.93299662%200-3.5-1.5670034-3.5-3.5s1.56700338-3.5%203.5-3.5c.17635542%200%20.34966443.0130432.51901498.0382177-.01260511-.1777657-.01901498-.3572432-.01901498-.5382177%200-4.14213562%203.35786438-7.5%207.5-7.5%203.6444251%200%206.6817285%202.59939677%207.3590229%206.0453029.2093602-.0298564.4233648-.0453029.6409771-.0453029%202.4852814%200%204.5%202.0147186%204.5%204.5s-2.0147186%204.5-4.5%204.5h-2.5%22%2F%3E%3Cpath%20d%3D%22m9%2014%203-3%203%203%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22m12%2012v9%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.7;
    }

    button.audio_page__main_tabs_btn.audio_page__add_playlist_btn > svg {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjcxMSAxNSAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik03MTEgMTVoMjR2MjRoLTI0eiIvPjxwYXRoIGQ9Ik03MTIgMzFoN003MTIgMjZoMTJNNzEyIDIxaDE3TTcyNCAzMWgxME03MjkgMjZ2MTAiIHN0cm9rZT0iIzgyOEE5OSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9zdmc+');
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.7;
    }

    [dir] .audio_w_covers .audio_row .audio_row__cover_icon {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjNTE4MUI4Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTkuODQ2IDE2Ljg2Yy0uNDY3LjMwMy0uODQ2LjA5Ny0uODQ2LS40NVY3LjU4OGMwLS41NTEuMzgtLjc1Mi44NDYtLjQ1bDYuOTEgNC40OGMuMzI0LjIxLjMyNy41NDkgMCAuNzYxbC02LjkxIDQuNDh6Ii8+PC9nPjwvc3ZnPg==');
        background-repeat: no-repeat;
        background-position: center;
    }

    [dir] .audio_w_covers .audio_row.audio_row__playing .audio_row__cover_icon {
        background-image: url("data:image/svg+xml,%3Csvg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='12' cy='12' fill='%235181B8' r='12'/%3E%3Cpath d='m8 7.59559822c0-.32893981.27685547-.59559822.60709476-.59559822h1.78581044c.3352892 0 .6070948.26747584.6070948.59559822v8.80880358c0 .3289398-.2768555.5955982-.6070948.5955982h-1.78581044c-.33528918 0-.60709476-.2674758-.60709476-.5955982zm5 0c0-.32893981.2768555-.59559822.6070948-.59559822h1.7858104c.3352892 0 .6070948.26747584.6070948.59559822v8.80880358c0 .3289398-.2768555.5955982-.6070948.5955982h-1.7858104c-.3352892 0-.6070948-.2674758-.6070948-.5955982z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E");
    }

    a#profile_send_gift_btn > span > span > svg > path {
        opacity: 0;
    }

    a#profile_send_gift_btn > span > span > Svg {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAkElEQVR4Ab3MAQYCQRjF8VndKCIR6ThBB4hFBwgQQZ1pbRupAwQaUoDm6z+85bPCBj1+hjfPF3LMbIgad6zULRDRYBzaaLhEiZwRHthhg5MfR0wx0PU9bigwQ/TjEglXPHHGS+8b6+BDMcEWDSIuOGDuR0frRH03tcpeY/ttrI/C+94pfS7/Z1whtdQlp8rdBxVxpx3ekLiVAAAAAElFTkSuQmCC');
        background-repeat: no-repeat;
        background-position: center;
    }

    .ui_actions_menu._ui_menu.ui_actions_menu--actionSheet {
        box-shadow: 0 1px 3px var(--black_alpha8);
        border-radius: 4px;
        border: 1px solid var(--steel_gray_140);
    }

    div#page_actions_wrap {
        box-shadow: 0 1px 3px var(--black_alpha8);
        border-radius: 4px;
        border: 1px solid var(--steel_gray_140);
    }

    .ui_actions_menu_wrap._ui_menu_wrap.im-page--dialogs-call-wrap,
    .im-page--header-call.im-page--header-menu-button._im_dialog_call_action_wrapper {
        display: none;
    }

    button.im-page--dialogs-header-control.im-page--dialogs-header-control_convo._im_create_convo {
        padding-right: 20px;
    }

    .profile_aside,
    .profile_aside_div,
    .profile_aside_div_div,
    .profile_aside_div_div_div {
        display: block
    }

    .profile_aside_div_div_div {
        float: left;
        position: relative;
        width: 157px
    }

    .profile_aside_div_div_div2 {
        display: block;
        float: right;
        position: relative;
    }

    .profile_aside_div_div_div2_div {
        background-position: right 13px;
        background-repeat: no-repeat;
        -webkit-background-clip: border-box;
        color: #55677d;
        font-family: -apple-system, BlinkMacSystemFont, Roboto, &quot;
        font-size: 12.5px;
        -moz-transform: scale(1);
        -moz-transform-origin: left center;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: #e5ebf1;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAAVUlEQVQ4y2OYtmSv5+Qlex+DMIjNgARIkgNzFu/5D8ZANrJikuSoZhDVvDYKRsEoGAUUgsaeuZ713XMfgzCITbYciFHXPfc/CIPYyIpJkqOaQdTyGgB1UvaF+JG3AgAAAABJRU5ErkJggg==);
        background-origin: padding-box;
        background-size: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-image-outset: 0;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        line-height: 15px;
        outline-color: #55677d;
        outline-style: none;
        outline-width: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        text-align: center;
        text-decoration-color: #55677d;
        text-decoration-line: none;
        text-decoration-style: solid;
        vertical-align: top;
        white-space: nowrap;
        width: 36px;
        border-color: #55677d rgba(0, 0, 0, 0) #55677d #55677d;
        border-style: none solid none none;
        border-width: 0 9px 0 0;
        margin: 10px 0 0;
        padding: 7px 7px 8px 16px
    }

    .profile_aside_div_div_div2_div_span {
        background-position: right 7px;
        background-repeat: no-repeat no-repeat;
        -webkit-background-clip: border-box;
        color: #55677d;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: rgba(0, 0, 0, 0);
        background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQiIHZpZXdCb3g9Ijk0NCAxMTUyIDggNCIgd2lkdGg9IjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTk0NS4yIDExNTIuMmMtLjMtLjItLjctLjItLjkuMXMtLjIuNy4xLjlsMy4yIDIuNmMuMi4yLjYuMi44IDBsMy4yLTIuNmMuMy0uMi4zLS42LjEtLjlzLS42LS4zLS45LS4xbC0yLjggMi4zeiIgZmlsbD0iIzkyYTBiMSIvPjwvc3ZnPg==);
        background-origin: padding-box;
        background-size: auto;
        display: none;
        padding-right: 13px
    }

    .profile_aside_one {
        z-index: 20;
        background-position: initial;
        background-repeat: initial;
        -webkit-background-clip: border-box;
        font-size: 12.5px;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: #fff;
        background-image: none;
        background-origin: padding-box;
        background-size: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-image-outset: 0;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
        margin-top: 10px;
        position: absolute;
        right: 0;
        top: 0;
        width: 198px;
        border-color: #c5d0db;
        border-style: solid;
        border-width: 1px;
        visibility: hidden;
        opacity: 0;
        -webkit-transition: opacity 0.3s, margin-top 0.3s, visibility 0s linear 0.3s;
        -moz-transition: opacity 0.3s, margin-top 0.3s, visibility 0s linear 0.3s;
        -o-transition: opacity 0.3s, margin-top 0.3s, visibility 0s linear 0.3s;
        transition: opacity 0.3s, margin-top 0.3s, visibility 0s linear 0.3s;
    }

    .profile_aside_div_div_div2.atv .profile_aside_one {
        opacity: 1;
        visibility: visible;
        -webkit-transition-delay: 0s;
        -moz-transition-delay: 0s;
        -o-transition-delay: 0s;
        transition-delay: 0s;
    }

    .profile_aside_one_two {
        background-position: right -7px;
        background-repeat: no-repeat;
        -webkit-background-clip: border-box;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: #dce1e6;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAAVUlEQVQ4y2OYtmSv5+Qlex+DMIjNgARIkgNzFu/5D8ZANrJikuSoZhDVvDYKRsEoGAUUgsaeuZ713XMfgzCITbYciFHXPfc/CIPYyIpJkqOaQdTyGgB1UvaF+JG3AgAAAABJRU5ErkJggg==);
        background-origin: padding-box;
        background-size: auto;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-right-color: rgba(0, 0, 0, 0);
        border-right-style: solid;
        border-right-width: 8px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        cursor: pointer;
        display: block;
        line-height: 15px;
        text-align: left;
        padding: 6px 8px 7px 0
    }

    .profile_aside_one_two_three {
        background-position: initial;
        background-repeat: initial;
        -webkit-background-clip: border-box;
        color: #5d6d80;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: rgba(0, 0, 0, 0);
        background-image: none;
        background-origin: padding-box;
        background-size: auto;
        padding: 0 13px
    }

    .profile_aside_four {
        border-top-color: #c5d0db;
        border-top-style: solid;
        border-top-width: 1px;
        display: block;
        line-height: 17.5px;
        padding: 4px 0
    }

    .profile_aside_four_a {
        color: #2a5885;
        cursor: pointer;
        display: block;
        height: 28px;
        line-height: 28px;
        outline-color: #2a5885;
        outline-style: none;
        outline-width: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        position: relative;
        text-decoration: none;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 13px
    }

    .profile_aside_four_a2 {
        color: #2a5885;
        cursor: pointer;
        display: block;
        height: 28px;
        line-height: 28px;
        outline-color: #2a5885;
        outline-style: none;
        outline-width: 0;
        overflow-x: hidden;
        overflow-y: hidden;
        position: relative;
        text-decoration-color: #2a5885;
        text-decoration-line: none;
        text-decoration-style: solid;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 13px
    }

    .profile_aside_div_div_div_a {
        background-position: initial;
        background-repeat: initial;
        -webkit-background-clip: border-box;
        color: #55677d;
        font-family: -apple-system, BlinkMacSystemFont, Roboto, &quot;
        font-size: 12.5px;
        -moz-transform: scale(1);
        -moz-transform-origin: left center;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: #e5ebf1;
        background-image: none;
        background-origin: padding-box;
        background-size: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-image-outset: 0;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        display: block;
        line-height: 15px;
        outline-color: #55677d;
        outline-style: none;
        outline-width: 0;
        text-align: center;
        text-decoration: none;
        vertical-align: top;
        white-space: nowrap;
        width: 100%;
        border-color: #55677d;
        border-style: none;
        border-width: 0;
        margin: 10px 0 0;
        padding: 7px 3px 8px
    }

    .profile_aside a {
        text-decoration: none!important;
    }

    div#side_bar {
        display: block!important;
    }

    [dir=ltr] .video_showcase #page_header {
        padding: 0!important;
        margin: 0 auto;
    }

    .video_showcase {
        --layout-width: 960px!important;
        --layout-min-width: unset!important;
        --layout-max-width: unset!important;
    }

    [dir=ltr] .video_showcase .ts_cont_wrap {
        left: 164px!important;
    }

    [dir] .wall_module .reply_action.reply_edit_button,
    [dir] .wall_module .reply_action.post_edit_button {
        background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cpath%20d%3D%22m7.00723148%2015.0072315%201.98547057%201.9854705-.51090487.5109219-2.19710349.4394354c-.15126149.0302534-.25920135-.0705252-.22775495-.2277624l.4394207-2.1971764zm.99998341-1.0000166%207.70239431-7.70264988c.3948871-.39490016%201.0298385-.39805257%201.4195204-.00835778l.5742749.57429394c.3953567.3953699.38594%201.02525678-.0083575%201.41956744l-7.70236153%207.70261688z%22%20fill%3D%22%23828a99%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") center center no-repeat;
    }

    [dir] .like_wrap.lite .like_btn.like .like_button_icon {
        background-size: 11px;
        background-position: center;
        background-image: url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCAxMSA5IiB3aWR0aD0iMTEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcuOSAwQzkuNjEyIDAgMTEgMS4zNiAxMSAzLjAzOWMwIDEuNjg4LS42OSAyLjUzNC0zLjU5NyA0Ljc1TDYuMDYzIDguODFhLjkzMS45MzEgMCAwIDEtMS4xMjYgMGwtMS4zNC0xLjAyMkMuNjkgNS41NzMgMCA0LjcyNyAwIDMuMDM5IDAgMS4zNiAxLjM4OCAwIDMuMSAwYy45MDQgMCAyLjQuOSAyLjQgMi4yNUM1LjUuOSA2Ljk5NiAwIDcuOSAweiIgZmlsbD0iIzgyOGE5OSIvPjwvc3ZnPg==');
    }

    .audio_row__icon.audio_row__icon_stars_20 g,
    .audio_row__icon.audio_row__icon_write_outline_20 path {
        opacity: 0;
    }

    .audio_row__icon.audio_row__icon_stars_20 svg {
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsLXJ1bGU9Im5vbnplcm8iPjxwYXRoIGZpbGw9IiM4MjhBOTkiIGQ9Ik00LjA2IDE5LjU4MWExIDEgMCAwIDEgMC0xLjQxNGw5LjE5My05LjE5MmExIDEgMCAwIDEgMS40MTQgMS40MTRMNS40NzUgMTkuNThhMSAxIDAgMCAxLTEuNDE1IDB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTExLjcwNyAxMy4zNDhsLTEuNDE0LTEuNDE0LjcwNy0uNzA3IDEuNDE0IDEuNDE0eiIvPjwvZz48cGF0aCBmaWxsPSIjODI4QTk5IiBzdHJva2U9IiM4MjhBOTkiIGQ9Ik03IDdsLjc5My0xLjVMNyA0bDEuNS43OTNMMTAgNGwtLjc5MyAxLjVMMTAgN2wtMS41LS43OTN6bTEwIDBsLjc5My0xLjVMMTcgNGwxLjUuNzkzTDIwIDRsLS43OTMgMS41TDIwIDdsLTEuNS0uNzkzem0wIDlsLjc5My0xLjVMMTcgMTNsMS41Ljc5M0wyMCAxM2wtLjc5MyAxLjVMMjAgMTZsLTEuNS0uNzkzeiIvPjwvZz48L3N2Zz4=') center;
    }

    .audio_row__icon.audio_row__icon_write_outline_20 {
        background-image: url("https://dl.dropbox.com/s/mial8fnnmo1z334/%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%BE.pngraw=1");
        background-size: 30px;
    }

    [dir] .wall_module .post--withActionStatusBar .wall_text,
    [dir] .wall_module .post--withPostBottomAction .wall_text {
        padding: 8px 20px 10px!important;
    }

    [dir] .flat_button,
    [dir] .button_gray button,
    [dir] .button_blue button {
        border-radius: 2px;
    }

    .top_ecosystem_navigation_row:last-child {
        display: none;
    }

    div#top_ecosystem_navigation_menu {
        box-shadow: none!important;
    }

    .feed_filter_icon > svg {
        opacity: 0;
    }

    ._audio_page_layout.audio_page_layout.audio_page_layout2 > * {
        display: block;
    }

    a.TopHomeLink > svg > rect {
        display: none;
    }

    li#l_ca g {
        opacity: 0;
    }

    li#l_ca svg {
        background: url(https://dl.dropbox.com/s/jykgnekcddv9b7j/test-_1_.svgraw=1) no-repeat;
        background-size: 17px;
        opacity: 0.7;
        background-position: 1px 1px;
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_calls.olist_item_wrap_on svg {
        background: url(https://dl.dropbox.com/s/jykgnekcddv9b7j/test-_1_.svgraw=1) no-repeat;
        background-size: 17px;
        opacity: 0.7;
        background-position: 1px 1px;
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_ads_link svg {
        background: url(https://i.imgur.com/keVvCFe.png) no-repeat center;
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_ads_link path,
    a.olist_item_wrap.olist_item_menu.olist_item_no_calls.olist_item_wrap_on g f {
        opacity: 0;
    }

    a.olist_item_wrap.olist_item_menu.olist_item_no_calls.olist_item_wrap_on g {
        opacity: 0;
    }

    aside.profile_aside {
        user-select: none;
    }

    .ui_gallery__arrow.ui_gallery__arrow_right,
    [dir=ltr] .ui_gallery .ui_gallery__arrow.ui_gallery__arrow_left {
        height: 54px;
        top: inherit;
        bottom: 0;
    }

    [dir] .page_block {
        box-shadow: rgb(215, 216, 219) 0px 1px 0px 0px, rgb(227, 228, 232) 0px 0px 0px 1px;
        border-radius: 2px;
    }

    .BestFriendsSettingsEntrypoint,
    [dir=ltr] #submit_post_box:not(.shown):not(.own_field) .BestFriendsSettingsEntrypoint + .SitpostingEntrypoint {
        display: none!Important;
    }

    [dir=ltr] #submit_post_box:not(.shown):not(.own_field) .page_add_media {
        right: 11px!important;
    }
    /* Отключение сервисов */
    .TopNavBtn.TopNavBtn__ecosystemMenuLink {
        display: none !important;
    }

    [dir=ltr] #submit_post_box:not(.shown):not(.own_field) .poster__open-btn-wrapper {
        display: none;
    }

    [dir] .page_photo.page_action_menu_groups .page_actions_item.page_menu_group_more:before {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20opacity%3D%22.1%22%2F%3E%3Cpath%20d%3D%22m12%2016c1.1%200%202%20.9%202%202s-.9%202-2%202-2-.9-2-2%20.9-2%202-2zm0-2c-1.1%200-2-.9-2-2s.9-2%202-2%202%20.9%202%202-.9%202-2%202zm0-6c-1.1%200-2-.9-2-2s.9-2%202-2%202%20.9%202%202-.9%202-2%202z%22%20fill%3D%22%23828a99%22%20transform%3D%22matrix(0%201%20-1%200%2024%200)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")!important;
    }

    .TopNavBtn__profileArrow > svg {
        background-color: rgba(0, 0, 0, 0);
        background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%228%22%20height%3D%224%22%20viewBox%3D%220%200%208%204%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23FFF%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M.8.7L4%203.3%207.2.7%22%2F%3E%3C%2Fsvg%3E') no-repeat center;
        opacity: 0.45;
    }

    .TopNavBtn__profileArrow > svg > path {
        opacity: 0;
    }

    div#side_bar.side_bar.fl_l.sticky_top_force {
        display: none !important;
    }

    .profile_aside_four_a:hover,
    .profile_aside_four_a2:hover {
        background: var(--steel_gray_40);
    }

    [dir=ltr] .box_title .back,
    .box_grey .box_title .toggle,
    .box_title .divider::before,
    [dir=ltr] .ui_crumb_count,
    [dir] .ui_tabs_box .ui_tab,
    .box_title_wrap.box_white .box_title,
    a.ui_box_header_link,
    [dir=ltr] .box_title,
    .box_title_wrap.box_grey .box_title,
    [dir] .PopupHeader__title,
    .ui_tabs_box .ui_tab_sel .ui_tab_count,
    .ui_tabs_box .ui_tab_count,
    .toggle,
    .StoriesArchiveTitleControls,
    h1.ModalHeader__title {
        color: #f2f3f4 !important;
    }
    div#group_section_menu_gallery .ui_gallery__arrow,
    div#group_section_menu_gallery .ui_gallery__arrow {
        top: 25px!important;
    }
    /* ФИКСЫ 2022 */
    div.ui_gallery.VideoTabsSlider {
        overflow: visible;
        z-index: 100
    }
    div.PostButtonReactions__icon.PostButtonReactions__icon--custom.PostButtonReactions__icon--animationActive,
    .PostButtonReactions__icon.PostButtonReactions__icon--custom {
        background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22m17%202.9a6.43%206.43%200%200%201%206.4%206.43c0%203.57-1.43%205.36-7.45%2010l-2.78%202.16a1.9%201.9%200%200%201%20-2.33%200l-2.79-2.12c-6.05-4.68-7.45-6.47-7.45-10.04a6.43%206.43%200%200%201%206.4-6.43%205.7%205.7%200%200%201%205%203.1%205.7%205.7%200%200%201%205-3.1z%22%20fill%3D%22%23ff3347%22%2F%3E%3C%2Fsvg%3E)!important;
    }
    .ui_gallery__arrow.ui_gallery__arrow_left.ui_gallery__arrow_visible,.ui_gallery__arrow.ui_gallery__arrow_right.ui_gallery__arrow_visible {
visibility: visible;
}
.ui_gallery__arrow.ui_gallery__arrow_left,.ui_gallery__arrow.ui_gallery__arrow_right {
visibility: hidden;
}
.video_showcase .stl_active{
display:block!important;
}
.StoryBottom__sendFormWrapper.StoryBottomControl,.StoryButtonLike.StoryButton.StoryBottomControl.StoryButton--round,.StoryButton.StoryBottomControl.StoryButtonMessage.StoryButton--round{
display:none;
}
[dir] .ui_actions_menu {
    box-shadow: rgba(0, 0, 0, 0.0976562) 0px 1px 3px;
    border-color: rgb(197, 208, 219);
}
.ui_actions_menu_wrap._ui_menu_wrap.friends_actions_menu._actions_menu a.ui_actions_menu_item {
    color: rgb(42, 88, 133);
}
a.page_verified {
    height: 10px;
}
.page_block.RecentGroups__main .ui_gallery__arrow.ui_gallery__arrow_right.ui_gallery__arrow_visible {
top: 0;
}
.page_block.RecentGroups__main .ui_gallery__arrow.ui_gallery__arrow_left.ui_gallery__arrow_visible {
top: 0;
}
.js-FeedAnimatedBlock {
    display: none;
}
a.ui_actions_menu_item {
    color: #2a5885;
}
[dir] .ui_actions_menu_item:hover {
    background-color: var(--background_hover);
}
a.ui_actions_menu_item {
    color: #2a5885;
    display: block;
    height: 30px;
}
[dir=ltr] .ui_actions_menu {
    right: -17px;
}
button.audio_page__main_tabs_btn.audio_page__add_playlist_btn path {
    opacity: 0;
}
button.audio_page_player_btn.audio_page_player_recoms g {
    opacity: 0;
}
.audio_page_player_icon.audio_page_player_icon--add_outline_24 g,.audio_page_player_icon.audio_page_player_icon--done_outline_24 g {
    opacity: 0;
}
button.audio_page_player_btn.audio_page_player_share g {
    opacity: 0;
}
button.audio_page_player_btn.audio_page_player_shuffle._audio_page_player_shuffle g {
    opacity: 0;
}
button.audio_page_player_btn.audio_page_player_recoms svg {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill-rule%3D%22nonzero%22%3E%3Cpath%20fill%3D%22%23828A99%22%20d%3D%22M4.06%2019.581a1%201%200%200%201%200-1.414l9.193-9.192a1%201%200%200%201%201.414%201.414L5.475%2019.58a1%201%200%200%201-1.415%200z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M11.707%2013.348l-1.414-1.414.707-.707%201.414%201.414z%22%2F%3E%3C%2Fg%3E%3Cpath%20fill%3D%22%23828A99%22%20stroke%3D%22%23828A99%22%20d%3D%22M7%207l.793-1.5L7%204l1.5.793L10%204l-.793%201.5L10%207l-1.5-.793zm10%200l.793-1.5L17%204l1.5.793L20%204l-.793%201.5L20%207l-1.5-.793zm0%209l.793-1.5L17%2013l1.5.793L20%2013l-.793%201.5L20%2016l-1.5-.793z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    opacity: 0.8;
}
.audio_page_player_icon.audio_page_player_icon--add_outline_24 svg {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2216%22%20height%3D%2237%22%20viewBox%3D%220%200%2016%2037%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-4%2018h24v24H-4z%22%2F%3E%3Cpath%20d%3D%22M7%2029H2c-.552%200-1%20.448-1%201s.448%201%201%201h5v5c0%20.552.448%201%201%201s1-.448%201-1v-5h5c.552%200%201-.448%201-1s-.448-1-1-1H9v-5c0-.552-.448-1-1-1s-1%20.448-1%201v5z%22%20fill%3D%22%23828A99%22%20fill-rule%3D%22nonzero%22%2F%3E%3Cg%20transform%3D%22translate(-4%20-6)%22%3E%3Crect%20opacity%3D%22.5%22%20width%3D%2224%22%20height%3D%2224%22%20rx%3D%222%22%2F%3E%3Cpath%20stroke%3D%22%23356CA9%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M5%2013l4%204L19%207%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-position: /*x=*/50% /*y=*/-18px;
    background-repeat: no-repeat;
    opacity: 0.8;
}
.audio_page_player_icon.audio_page_player_icon--done_outline_24 svg {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2216%22%20height%3D%2237%22%20viewBox%3D%220%200%2016%2037%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M-4%2018h24v24H-4z%22%2F%3E%3Cpath%20d%3D%22M7%2029H2c-.552%200-1%20.448-1%201s.448%201%201%201h5v5c0%20.552.448%201%201%201s1-.448%201-1v-5h5c.552%200%201-.448%201-1s-.448-1-1-1H9v-5c0-.552-.448-1-1-1s-1%20.448-1%201v5z%22%20fill%3D%22%23828A99%22%20fill-rule%3D%22nonzero%22%2F%3E%3Cg%20transform%3D%22translate(-4%20-6)%22%3E%3Crect%20opacity%3D%22.5%22%20width%3D%2224%22%20height%3D%2224%22%20rx%3D%222%22%2F%3E%3Cpath%20stroke%3D%22%23356CA9%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M5%2013l4%204L19%207%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-position-x: 5px;
    background-position-y: 5px;
    background-repeat: no-repeat;
}
button.audio_page_player_btn.audio_page_player_share svg {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%200h24v24H0z%22%2F%3E%3Cpath%20d%3D%22M13%208.75V5.39a.417.417%200%200%201%20.684-.32l7.931%206.61a.417.417%200%200%201%200%20.64l-7.93%206.61a.417.417%200%200%201-.685-.32V14.9c-5.301%200-8.804.841-10.509%202.523a.23.23%200%200%201-.389-.2C2.987%2011.576%206.62%208.75%2013%208.75z%22%20stroke%3D%22%23828A99%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    opacity: 0.8;
}
button.audio_page_player_btn.audio_page_player_shuffle._audio_page_player_shuffle svg {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cpath%20d%3D%22M18%208.9h-3.5c-1.014%200-1.896.9-3.758%203.61C8.479%2015.8%207.402%2016.9%205.5%2016.9H3a.9.9%200%200%201%200-1.8h2.5c1.014%200%201.896-.9%203.758-3.61C11.521%208.2%2012.598%207.1%2014.5%207.1H18V5.511a.502.502%200%200%201%20.824-.386l2.996%202.491a.503.503%200%200%201%200%20.773l-2.996%202.492a.503.503%200%200%201-.824-.387V8.9zm-5.966%204.377c1.046%201.336%201.72%201.823%202.466%201.823H18v-1.589a.502.502%200%200%201%20.824-.386l2.996%202.491a.503.503%200%200%201%200%20.773l-2.996%202.492a.503.503%200%200%201-.824-.387V16.9h-3.5c-1.36%200-2.299-.562-3.55-2.086a58.818%2058.818%200%200%200%201.084-1.537zM9.05%209.186a58.818%2058.818%200%200%200-1.084%201.537C6.92%209.387%206.246%208.9%205.5%208.9H3a.9.9%200%201%201%200-1.8h2.5c1.36%200%202.299.562%203.55%202.086z%22%20fill%3D%22%23828A99%22%2F%3E%0A%3C%2Fsvg%3E');
    opacity: 0.8;
}
.CatalogBlock__content.CatalogBlock__recent_audios.CatalogBlock__layout--triple_stacked_slider .ui_gallery__arrow.ui_gallery__arrow_right.ui_gallery__arrow_visible {
    top: 50px!important;
}
.ui_gallery.CatalogBlock__itemsContainer._audio_pl.audio_recoms_audios_block.audio_w_covers .ui_gallery__arrow.ui_gallery__arrow_left,.CatalogBlock__content.CatalogBlock__recoms_new_audios.CatalogBlock__layout--triple_stacked_slider .ui_gallery__arrow.ui_gallery__arrow_right.ui_gallery__arrow_visible {
    top: 50px!important;
}
.CatalogBlock__content.CatalogBlock__recommended_playlists_ugc.CatalogBlock__layout--large_slider .ui_gallery__arrow.ui_gallery__arrow_right.ui_gallery__arrow_visible {
    top: 50px!important;
}
.CatalogBlock__content.CatalogBlock__recommended_playlists_ugc.CatalogBlock__layout--large_slider .ui_gallery__arrow.ui_gallery__arrow_left.ui_gallery__arrow_visible {
    top: 50px!important;
}
[dir] .audio_page_block__playlists_items.ui_gallery .ui_gallery__arrow {
    padding-bottom: 20px;
}
.VideoCard__menuToggle {
    display: none;
}
button.im-page-action._im_page_action.im-page-action_spam svg {
    opacity: 0;
}
button.im-page-action._im_page_action.im-page-action_star svg {
    opacity: 0;
}
button.im-page-action._im_page_action.im-page-action_delete svg {
    opacity: 0;
}
.VkIdForm__icon {
    display: none;
}
[dir=ltr] .VkIdForm__form>.FlatButton+.FlatButton {
    background-position: initial;
    background-repeat: initial;
    -webkit-background-clip: border-box;
    color: rgb(255, 255, 255);
    font-family: -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
    font-size: 14px;
    font-stretch: 100%;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-east-asian: normal;
    font-variant-ligatures: normal;
    font-variant-numeric: normal;
    font-weight: 400;
    text-rendering: auto;
    -webkit-writing-mode: horizontal-tb;
    -moz-transform: scale(1);
    -moz-transform-origin: left center;
    align-items: flex-start;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: rgb(95, 176, 83);
    background-image: none;
    background-origin: padding-box;
    background-size: auto;
    border-bottom-color: rgb(255, 255, 255);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-bottom-style: none;
    border-bottom-width: 0px;
    border-image-outset: 0px;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 1;
    border-left-color: rgb(255, 255, 255);
    border-left-style: none;
    border-left-width: 0px;
    border-right-color: rgb(255, 255, 255);
    border-right-style: none;
    border-right-width: 0px;
    border-top-color: rgb(255, 255, 255);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-top-style: none;
    border-top-width: 0px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    letter-spacing: normal;
    line-height: 20px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 15px;
    margin-top: 5px;
    outline-color: rgb(255, 255, 255);
    outline-style: none;
    outline-width: 0px;
    padding-bottom: 0px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 0px;
    text-align: center;
    text-decoration-color: rgb(255, 255, 255);
    text-decoration-line: none;
    text-decoration-style: solid;
    text-indent: 0px;
    text-shadow: none;
    text-transform: none;
    vertical-align: top;
    -webkit-appearance: none;
    white-space: nowrap;
    width: 100%;
    word-spacing: 0px;
}
button.FlatButton.FlatButton--primary.FlatButton--size-l.FlatButton--round.FlatButton--wide.VkIdForm__button.VkIdForm__signInButton{
    background-position: initial;
    background-repeat: initial;
    -webkit-background-clip: border-box;
    color: rgb(255, 255, 255);
    font-family: -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
    font-size: 14px;
    font-stretch: 100%;
    font-style: normal;
    font-variant-caps: normal;
    font-variant-east-asian: normal;
    font-variant-ligatures: normal;
    font-variant-numeric: normal;
    font-weight: 400;
    text-rendering: auto;
    -webkit-writing-mode: horizontal-tb;
    -moz-transform: scale(1);
    -moz-transform-origin: left center;
    align-items: flex-start;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: rgb(81, 129, 184);
    background-image: none;
    background-origin: padding-box;
    background-size: auto;
    border-bottom-color: rgb(255, 255, 255);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-bottom-style: none;
    border-bottom-width: 0px;
    border-image-outset: 0px;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 1;
    border-left-color: rgb(255, 255, 255);
    border-left-style: none;
    border-left-width: 0px;
    border-right-color: rgb(255, 255, 255);
    border-right-style: none;
    border-right-width: 0px;
    border-top-color: rgb(255, 255, 255);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-top-style: none;
    border-top-width: 0px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    letter-spacing: normal;
    line-height: 20px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 15px;
    margin-top: 5px;
    outline-color: rgb(255, 255, 255);
    outline-style: none;
    outline-width: 0px;
    padding-bottom: 0px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 0px;
    text-align: center;
    text-decoration-color: rgb(255, 255, 255);
    text-decoration-line: none;
    text-decoration-style: solid;
    text-indent: 0px;
    text-shadow: none;
    text-transform: none;
    vertical-align: top;
    -webkit-appearance: none;
    white-space: nowrap;
    width: 100%;
    word-spacing: 0px;
}
#page_header, #page_layout {width: 990px !important;}
button.post_header_subscribe_button.post_header_subscribe_button_icons_only {
    display: none;
}
`;

i=0
i2=0
vd=0
document.addEventListener('DOMContentLoaded', function() {
   chat();
}, false);

window.onload = function() {
    initial();
    class_add();
    styleNode = null;
};

window.onblur = function () {
    var a = setInterval(title,2000);
    var b = setInterval(ads,2000);
    var c = setInterval(check,1000);
    clearInterval(a);
    clearInterval(b);
    clearInterval(c);
}

window.onfocus = function () {
    var ad_n = parseInt(localStorage.getItem("ad"));

    setInterval(title,2000);
    if (ad_n==1){
    setInterval(ads,2000);
    }
    setInterval(check,1000);
    //fix_name();
}

function initial(){
    var ad_n = parseInt(localStorage.getItem("ad"));
    var settings_n = parseInt(localStorage.getItem("settings"));

    console.log('Скрипт запущен');
    setInterval(title,2000);
    if (ad_n==1){
    setInterval(ads,2000);
    }
    setInterval(check,1000);
    if (settings_n==1){
    fix_name();
    }
}

// Проверка
function check(){
check_vid();
dot_check();
feed_check();
icon_check();
}

function feed_check(){
if ((window.location.href.includes('feed'))){
_class();
_class2();
menu_add();
}
var k = document.querySelector('.like_cont.PostBottomActionLikeBtns.PostBottomActionLikeBtns--withBgButtons')
if (k){
_class();
_class2();
}
}

function icon_check(){
if (!window.location.href.includes('im')){
var list = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
list.forEach(function(element) {
	element.setAttribute('href', 'https://dl.dropbox.com/s/srxnp2eunc3q3fa/fav_logo.icoraw=1');
});
}}

function _class2(){
var g
var k = document.querySelectorAll('.ui_actions_menu._ui_menu.ui_actions_menu--actionSheet');
    for (g = 0; g < k.length; g++) {
    k[g].className= 'ui_actions_menu _ui_menu ';
    }
}



function _class(){


    KPP.add('.PostButtonReactions', function (reactions) {
        var count = reactions.dataset.reactionCounts;
        if (count && !(reactions.dataset.reactionButtonTextIsCounter)) {
            count = JSON.parse(count);
            if (!Array.isArray(count)) {
                count = Object.values(count)
            }
            var likes = count.reduce(function(previous, current) {
                return previous + current
            })
            reactions.getElementsByClassName('PostButtonReactions__title')[0].textContent = likes;
        }
        reactions.dataset.reactionButtonTextIsCounter = '1';

        var target = reactions.dataset.reactionTargetObject;
        if (target) {
            reactions.setAttribute('onmouseover','Likes.showLikes(this,\'' + target + '\')')
        }
    });

var u,k
var old1 = document.querySelectorAll('.like_cont.PostBottomActionLikeBtns.PostBottomActionLikeBtns--withBgButtons')
for (u = 0; u < old1.length; u++) {
    old1[u].classList= 'like_cont';
}
var old2 = document.querySelectorAll('.PostButtonReactions__icon.PostButtonReactions__icon--custom.PostButtonReactions__icon--animationActive')
for (k = 0;k<old2.length;k++){
old2[k].style.background=`background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22m17%202.9a6.43%206.43%200%200%201%206.4%206.43c0%203.57-1.43%205.36-7.45%2010l-2.78%202.16a1.9%201.9%200%200%201%20-2.33%200l-2.79-2.12c-6.05-4.68-7.45-6.47-7.45-10.04a6.43%206.43%200%200%201%206.4-6.43%205.7%205.7%200%200%201%205%203.1%205.7%205.7%200%200%201%205-3.1z%22%20fill%3D%22%23ff3347%22%2F%3E%3C%2Fsvg%3E);`
}
}

function chat(){
var a = document.querySelectorAll('.MEAvatar__online')
console.log(a.length)
//var b,c
//for (b = 0; b < a.length; b++) {
 //   c = a[b].previousElementSibling.firstElementChild
  //  console.log(c.alt)
//}
}



// Название
function title(){
        if (document.title=='Мессенджер'){
           document.title = 'Сообщения'
        }
    if (document.title=='Реакции'){
           document.title = 'Понравилось'
        }
}

// Реклама
function ads(){
    var ad_blocks,a
    ad_blocks = document.querySelectorAll('.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--,div#ads_left,[data-ad-view],div#games_catalog_header_content,.videoplayer_ads._overlay_hidden,.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--,.CatalogBlock__content.CatalogBlock__header_promo_banners.CatalogBlock__layout--large_list,.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_continue_mini_apps,div#friends_possible_block,.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_new_apps,.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_mini_app,div[data-ad-disabled-stat-impression]');
    for (a = 0; a < ad_blocks.length; a++) {
    ad_blocks[a].outerHTML= '';
}}

// Три точки проверка
function dot_check(){
var prof
prof = document.querySelector('a#profile_edit_act[href="edit"]');
if (prof!==null){
dot_prof();
}
}

// Три точки установка
function dot_prof(){
var aside,button,stats,stats_hash,stats_elem,stats_elem_parent,temp_a,regular_a,story_href,story
aside = document.querySelector('.page_block.page_photo.ProfileActions>aside');
stats = document.querySelector('[href*="/stats?"]')
if (stats){
stats_hash = stats.href
}


aside.style.display = 'none';
aside.outerHTML='<aside aria-label="Действия со страницей" class="profile_aside"><div class="profile_aside_div">  <div class="profile_aside_div_div">      <div class="profile_aside_div_div_div">        <a href="edit" class="profile_aside_div_div_div_a">Редактировать</a>      </div>      <div class="profile_aside_div_div_div2">        <div aria-label="Действия" role="button" tabindex="0" class="profile_aside_div_div_div2_div">          <span class="profile_aside_div_div_div2_div_span">Действия</span>          <span style="display:block;">&nbsp;</span>        </div>        <div class="profile_aside_one">          <div class="profile_aside_one_two">            <span class="profile_aside_one_two_three">Действия</span>          </div>          <div class="profile_aside_four">            <a href="memories" role="link" tabindex="0" class="profile_aside_four_a">Воспоминания</a><a href="" id="aside_story_archive" role="link" class="profile_aside_four_a2" tabindex="0">Архив историй</a><a role="link" tabindex="0" class="profile_aside_four_a2" data-task-click="ProfileAction/money_transfer_box" data-from="own_profile">Денежные переводы</a>          </div>        </div>      </div>      <span style="font-size:0px;clear:both;display:block;height: 0px;line-height:0;visibility:hidden;/">.</span></div>    </div>  </aside>'
story = document.querySelector('a#aside_story_archive')
story.href = window.location.pathname + '?w=stories'
// Если есть статистика добавляем элемент
if (stats){
stats_elem_parent = document.querySelector('.profile_aside_four')
stats_elem = document.createElement('a')
stats_elem.classList = 'temp_a'
stats_elem_parent.prepend(stats_elem)
temp_a = document.querySelector('a.temp_a')
temp_a.outerHTML = '<a href="" id="aside_stats" role="link" class="profile_aside_four_a2" tabindex="0">Статистика страницы</a>'
regular_a = document.querySelector('a#aside_stats')
regular_a.href = stats_hash
}

button = document.querySelector('.profile_aside_div_div_div2')
button.onclick = function() {
    var b
    b = document.querySelector('.profile_aside_div_div_div2')
    b.classList.toggle('atv')
  };
}

// Меню и Имя возле иконки
function fix_name(){
//console.log('Фикс имени пошёл')
var parentlnk = document.querySelector('div#top_profile_menu')
var lnk = document.querySelector('li#l_pr a')
var setlnk = document.querySelector('a#top_settings_link');
var suplnk = document.querySelector('a#top_support_link');
var loglnk = document.querySelector('a#top_logout_link');
var name = document.querySelector('img.TopNavBtn__profileImg');
var name2 = document.querySelector('a[href*="connect.vk.com"] div[style="color: var(--text_primary);"]')
var name3 = document.querySelector('[style="background-color: var(--content_tint_background); border-radius: 8px; width: 254px; font-family: inherit;"]')
var remove = document.querySelector('a[href*="connect.vk.com"] ')
var remove2 = document.querySelectorAll('div#top_profile_menu span')
if (name){
var namealt = name.alt
}
var s = document.querySelector('a#top_profile_link[aria-label="Настройки страницы"]');
var q = document.createElement('div');
var w = document.createElement('a');
var n = document.createElement('a');
var u = document.createElement('div');
var k = document.createElement('div');
var k2 = document.createElement('span');
var b1

q.innerHTML = `<div style="padding-right:10px;display:inline-block;vertical-align:top;color:white;font-weight: 500;-webkit-font-smoothing: subpixel-antialiased;">`+namealt+`</div>`;
w.className = 'top_profile_mrow'
w.id = 'top_home_link'
if (lnk){
w.href = lnk.href
}
n.className = 'top_profile_mrow'
n.id = 'top_edit_link'
n.href = '/edit'
k2.style = 'position:absolute;pointer-events:none;height:0px;width:0px;bottom:100%;right:42px;border-width: 6px; border-style: solid; margin: 0px -6px; border-color: transparent transparent white; " class=""'
u.innerHTML = '<div style="border-top-color:rgb(219, 228, 236);border-width: 1px medium medium; border-style: solid none none; margin: 4px 13px; "></div>'
k.innerHTML = '<div style="border-top-color:rgb(219, 228, 236);border-width: 1px medium medium; border-style: solid none none; margin: 4px 13px; "></div>'
w.innerHTML ='Моя страница'
n.innerHTML = 'Редактировать'
setlnk.innerHTML ='Настройки'
suplnk.innerHTML ='Помощь'
suplnk.innerHTML ='Помощь'
loglnk.innerHTML ='Выйти'


if (namealt!=null){

s.insertBefore(q,s.firstChild)
setlnk.insertAdjacentElement('beforeBegin', w);
var home = document.querySelector('a#top_home_link')
parentlnk.insertBefore(u,setlnk)
parentlnk.insertBefore(k,loglnk)
parentlnk.insertBefore(n,setlnk)
parentlnk.insertBefore(k2,home)

for (b1 = 0; b1 < remove2.length; b1++) {
    remove2[b1].remove();
}}
//console.log('Фикс прошёл успешно')
}

// Фикс в видео
function check_vid(){
var h2
var myvd = document.querySelector('li#l_pr a.left_row')
if (myvd){
var h = myvd.href
}
if (h){
h2 = h.split('vk.com/')[1];
}
//console.log(h2)
if (!window.location.href.includes(h2)&&(!window.location.href.includes('/video/@'))){
seacrh2();
pop_vid();

}
if (window.location.href.includes(h2)){
my_vid();
seacrh();
}
if (window.location.href.includes('/video?z=')&&(vd=0)){
check_vid_ads();
}
if (window.location.href.includes('https://vk.com/video/@')&&!window.location.href.includes(h2)){
seacrh3();
}
}

function seacrh(){
// Установка старого поиска
var search = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.VideoSearchInput.ui_search_custom.ui_search_with_custom_controls._wrap')
if (search){
search.classList= 'ui_search_new ui_search ui_search_field_empty video_search_input ui_search_btn_large _wrap'

// Передвижение поиска
var parent = document.querySelector('div#video_main_block h2.page_block_h2')
var child = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.ui_search_btn_large._wrap')
parent.appendChild(child)
}}

function seacrh3(){
var search = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.VideoSearchInput.ui_search_custom.ui_search_with_custom_controls._wrap')
var header = document.querySelector('div#video_block_header')
if (search){
search.classList= 'ui_search_new ui_search ui_search_field_empty video_search_input ui_search_btn_large _wrap'
header.after(search)
}
}


function my_vid(){
var head = document.querySelectorAll('.page_block_header.clear_fix')
if (head[1]){
head[1].outerHTML = `<ul class="ui_tabs clear_fix ui_tabs_header ui_tabs_with_progress ui_my_vid" onmouseover="uiTabs.tryInit(this)" id="video_main_tabs" data-inited="1">
    <li id="videocat_tab_all">
  <a href="#" class="ui_tab ui_tab_sel" onclick="document.querySelector('a.MenuList__item.MenuList__item--expandable').click();">
    Мои видео
  </a>
</li><li id="videocat_tab_catalog">
  <a href="/video" class="ui_tab" onclick="return uiTabs.goTab(this, event, 1);">
    Видеокаталог
  </a>
</li><li>
  <div class="ui_tab_plain ui_tabs_progress" role="link">


  </div>
</li>  <button style="margin-left: 0" class="flat_button">Добавить видео</button><button class="flat_button secondary" id="video_create_live_btn">Создать трансляцию</button>  <button class="flat_button secondary" id="video_add_album_btn" onclick="return Video.createAlbum(event);" style="">Создать альбом</button>
    <div class="ui_tabs_slider _ui_tabs_slider" style="width: 83.6875px; margin-left: 14px;"></div>
  </ul>`
var t = document.querySelector('button.flat_button[style="margin-left: 0"]')
var t2 = document.querySelector('button#video_create_live_btn')

var vid = document.querySelector('ul.ui_tabs.clear_fix.ui_tabs_header.ui_tabs_with_progress.ui_pop_vid')
if (vid){
vid.remove();
seacrh4();
}
t.addEventListener("click", add, false);
t2.addEventListener("click", add1, false);
}}

function seacrh2(){
// Установка старого поиска
var search = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.VideoSearchInput.ui_search_custom.ui_search_with_custom_controls._wrap')
if (search){
search.classList= 'ui_search_new ui_search ui_search_field_empty video_search_input ui_search_btn_large _wrap'

// Передвижение поиска
var parent = document.querySelector('.ui_gallery__arrow.ui_gallery__arrow_left')
var child = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.ui_search_btn_large._wrap')
if (parent){
parent.before(child)
}}}

function seacrh4(){
// Передвижение поиска
var parent = document.querySelector('ul.ui_tabs.clear_fix.ui_tabs_header.ui_tabs_with_progress.ui_my_vid')
var child = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.ui_search_btn_large._wrap')
if (parent){
parent.after(child)
}}



function check_vid_ads(){
var main_vid = document.querySelector('.videoplayer_media video')
var ads_vid = document.querySelector('video.videoplayer_ads_media_el')
if (ads_vid){
ads_vid.pause();
main_vid.play();
//console.log('text')
vd=1
}else{
vd=0
}
}


function pop_vid(){
var head2 = document.querySelector('ul#video_main_tabs')
var head = document.createElement('ul')
head.classList='gg'

//console.log(head2)

var slider = document.querySelector('.ui_gallery.VideoTabsSlider.js-video-slider')
if (slider){
slider.classList='ui_gallery VideoTabsSlider'
}
var search = document.querySelector('.ui_search_new.ui_search.ui_search_field_empty.video_search_input.ui_search_btn_large._wrap')
if (head2==null){
if (search){
search.before(head)

head2 = document.querySelector('ul.gg')
head2.outerHTML=`<ul class="ui_tabs clear_fix ui_tabs_header ui_tabs_with_progress ui_pop_vid" onmouseover="uiTabs.tryInit(this)" id="video_main_tabs" data-inited="1">
    <li id="videocat_tab_all">
  <a href="#" class="ui_tab" onclick="document.querySelector('a.MenuList__item.MenuList__item--expandable').click();">
    Мои видео
  </a>
</li><li id="videocat_tab_catalog">
  <a href="/video" class="ui_tab ui_tab_sel" onclick="return uiTabs.goTab(this, event, 1);">
    Видеокаталог
  </a>
</li><li>
  <div class="ui_tab_plain ui_tabs_progress" role="link">
  </div>
</li>  <button style="margin-left: 0" class="flat_button" onclick="document.querySelectorAll('.VideoActions__item')[0].click();">Добавить видео</button><button class="flat_button secondary" id="video_create_live_btn" onclick="document.querySelector('.VideoActions__item.VideoActions__item--secondary').click();">Создать трансляцию</button>  <button class="flat_button secondary" id="video_add_album_btn" onclick="return Video.createAlbum(event);" style="display: none;">Создать альбом</button>
    <div class="ui_tabs_slider _ui_tabs_slider" style="width: 103.906px; margin-left: 14px; transform: translateX(92px);"></div>
  </ul>`
head2 = document.querySelector('ul#video_main_tabs')

var vid = document.querySelector('ul.ui_tabs.clear_fix.ui_tabs_header.ui_tabs_with_progress.ui_my_vid')
if (vid){
vid.remove();
}
}}}


function add(){
var h = document.querySelector('.VideoActions__item[aria-label="Добавить видео"]')
h.click();
}
function add1(){
var h = document.querySelector('.VideoActions__item.VideoActions__item--secondary')
h.click();
}



var KPP
 KPP = {
    _list: [],
    _actions: [],
    _addedTag: function (observer, mutations, tag, callback, once) {
        for (var i = 0, l = mutations.length; i < l; i++) {
            for (var j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                if (mutations[i].addedNodes[j].tagName === tag) {
                    callback();
                    if (once) observer.disconnect();
                }
            }
        }
    },
    _police: new MutationObserver(function (mutations) {
        for (var i = 0, l = mutations.length; i < l; i++) {
            for (var j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                if (mutations[i].addedNodes[j].nodeType === 1) {
                    for (var k = KPP._list.length; k--;) {
                        if (mutations[i].addedNodes[j].matches(KPP._list[k])) { // Обрабатывает только существующие элементы до DOMContentLoaded
                            if (!mutations[i].addedNodes[j].KPPPassed) {
                                KPP._actions[k](mutations[i].addedNodes[j]);
                                mutations[i].addedNodes[j].KPPPassed = true;
                            }
                        } else {
                            var n = mutations[i].addedNodes[j].querySelectorAll(KPP._list[k]);
                            for (var o = 0, p = n.length; o < p; o++) {
                                if (!n[o].KPPPassed) {
                                    KPP._actions[k](n[o]);
                                    n[o].KPPPassed = true;
                                }
                            }
                        }
                        //if (n.length > 0) break
                    }
                }
            }
        }
    }),
    head: function (callback) {
        if (!document.head) {
            var observer = new MutationObserver(function (mutations, observer) {
                KPP._addedTag(observer, mutations, 'HEAD', callback, true)
            });
            observer.observe(document.documentElement, {childList: true});
        } else callback();
    },
    body: function (callback) {
        if (!document.body) {
            var observer = new MutationObserver(function (mutations, observer) {
                KPP._addedTag(observer, mutations, 'BODY', callback, true)
            });
            observer.observe(document.documentElement, {childList: true});
        } else callback();
    },
    add: function (selector, callback) {
        var q = document.querySelectorAll(selector);
        if (q.length > 0) {
            for (var i = q.length; i--;) {
                callback(q[i]);
            }
        }
        KPP._list.push(selector);
        KPP._actions.push(callback);
        KPP._police.observe(document.documentElement, {childList: true, subtree: true})
    },
    remove: function (selector) {
        var s = KPP._list.indexOf(selector);
        if (s !== -1) {
            KPP._list.splice(s, 1);
            KPP._actions.splice(s, 1);
            if (KPP._list.length < 1)
                KPP._police.disconnect();
            return true
        }
        return false
    },
    stop: function (full) {
        KPP._police.disconnect();
        if (full) {
            KPP._list = [];
            KPP._actions = [];
        }
    }
};









function class_add(){
  document.body.appendChild(styleNode);
}

function menu_add(){
var j,k
k = document.querySelector('.temp_elem')
if (!k){
var h = document.createElement('div')
var l = document.querySelector('div#narrow_column')

h.className='temp_elem'
if (l){
l.append(h)
j = document.querySelector('.temp_elem')
j.innerHTML = `
<style>
#bar_m{
  margin-top:20px;
  font-family: -apple-system, BlinkMacSystemFont, Roboto, "Open Sans", "Helvetica Neue", "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee", "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao", "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: subpixel-antialiased;
  padding-bottom:10px;
  padding-top:10px;
  width:230px;
  background:#fff;
  box-shadow: rgb(215, 216, 219) 0px 1px 0px 0px, rgb(227, 228, 232) 0px 0px 0px 1px;
  border-radius: 2px;
}
#bar_t {
    text-align: center;
    color: #2a5885;
    font-size: 18px;
    padding-left: 15px;
    font-weight: 500;
}
#bar_c {
    margin: 0 auto;
    width: fit-content;
    font-size:14px;
}
sub {
    padding-left: 5px;
    font-size: 13px;
}
#bar_vk{
  font-size:15px;
  padding-top:20px;
  text-align:center;
}





.form-switch {
    text-align:center;
    padding-top:20px;
    padding-bottom:4px;
}

.checkbox-google {
	display: inline-block;
	height: 28px;
	line-height: 28px;
	margin-right: 10px;
	position: relative;
	vertical-align: middle;
	font-size: 14px;
	user-select: none;
}
.checkbox-google .checkbox-google-switch {
	display: inline-block;
	width: 36px;
	height: 14px;
	border-radius: 20px;
	position: relative;
	top: 6px;
	vertical-align: top;
	background: #9f9f9f;
	transition: .2s;
}
.checkbox-google .checkbox-google-switch:before {
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	position: absolute;
	top: -3px;
	left: -1px;
	background: #fff;
	border-radius: 50%;
	box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12);
	transition: .15s;
}
.checkbox-google input[type=checkbox] {
	display: block;
	width: 0;
	height: 0;
	position: absolute;
	z-index: -1;
	opacity: 0;
}
.checkbox-google input[type=checkbox]:checked + .checkbox-google-switch {
	background: #9ABEF7;
}
.checkbox-google input[type=checkbox]:checked + .checkbox-google-switch:before {
	background: #1a73e8;
	transform:translateX(18px);
}

/* Hover */
.checkbox-google input[type="checkbox"]:not(:disabled) + .checkbox-google-switch {
	cursor: pointer;
	border-color: rgba(0, 0, 0, .3);
}

/* Active/Focus */
.checkbox-google input[type="checkbox"]:not(:disabled):active + .checkbox-google-switch:before,
.checkbox-google input[type="checkbox"]:not(:disabled):focus + .checkbox-google-switch:before {
	animation: checkbox-active-on 0.5s forwards linear;
}
@keyframes checkbox-active-on {
	0% {
		box-shadow: 0 0 0 0 rgba(212,212,212, 0);
	}
	99% {
		box-shadow: 0 0 0 10px rgba(212,212,212, 0.5);
	}
}

.checkbox-google input[type="checkbox"]:not(:disabled):checked:active + .checkbox-google-switch:before,
.checkbox-google input[type="checkbox"]:not(:disabled):checked:focus + .checkbox-google-switch:before {
	animation: checkbox-active-off 0.5s forwards linear;
}
@keyframes checkbox-active-off {
	0% {
		box-shadow: 0 0 0 0 rgba(154,190,247, 0);
	}
	99% {
		box-shadow: 0 0 0 10px rgba(154,190,247, 0.5);
	}
}

/* Disabled */
.checkbox-google input[type=checkbox]:disabled + .checkbox-google-switch {
	filter: grayscale(60%);
	border-color: rgba(0, 0, 0, .1);
}
.checkbox-google input[type=checkbox]:disabled + .checkbox-google-switch:before {
	background: #eee;
}
</style>
<link href="https://itchief.ru/examples/vendors/bootstrap-3.3.7/css/bootstrap.min.css" rel="stylesheet">

<div id="bar_m">
  <div id="bar_t">VK by RAM<sub>v.04.02</sub></div>
  <div id="bar_c">
    <div class="form-check form-switch">
      <input class="form-check-input ads" type="checkbox" id="flexSwitchCheckDefault">
    <label class="form-check-label" for="flexSwitchCheckDefault" value="0">Вкл/Выкл Adblock</label>
  </div>
  <div class="form-check form-switch">
      <input class="form-check-input settings" type="checkbox" id="flexSwitchCheckDefault">
    <label class="form-check-label" for="flexSwitchCheckDefault">Вкл/Выкл Настройки</label>
  </div>
  </div>
  <div id="bar_vk">
  <button class="FlatButton FlatButton--primary FlatButton--size-s" type="button" id="photos_upload_area" onclick="location.reload(true);">
  <span class="FlatButton__in">
    <span class="FlatButton__content">
      Очистить кэш
    </span>
  </span>
</button>
</div>
</div>

</div>

  </div>
</div>

`}}
//console.log(h)
menu_check();


var ad = document.querySelector('input.form-check-input.ads')
var settings = document.querySelector('input.form-check-input.settings')

var ad_n = parseInt(localStorage.getItem("ad"));
var settings_n = parseInt(localStorage.getItem("settings"));
if (ad){
if (ad_n==1){
    ad.checked=1
    }else{
    ad.checked=0
    }
}

if (settings){
if (settings_n==1){
    settings.checked=1
    }else{
    settings.checked=0
    }
}}

function menu_check(){
var ad = document.querySelector('input.form-check-input.ads')
var settings = document.querySelector('input.form-check-input.settings')

var ad_n = parseInt(localStorage.getItem("ad"));
var settings_n = parseInt(localStorage.getItem("settings"));

if (ad){
ad.addEventListener('change', () => {
  if (ad.checked){
  localStorage.setItem("ad",1);
  ad_n = parseInt(localStorage.getItem("ad"));
  }else{
  localStorage.setItem("ad",0);
  ad_n = parseInt(localStorage.getItem("ad"));
  }
})}

if (settings){
settings.addEventListener('change', () => {
  if (settings.checked){
  localStorage.setItem("settings",1);
  settings_n = parseInt(localStorage.getItem("settings"));
  }else{
  localStorage.setItem("settings",0);
  settings_n = parseInt(localStorage.getItem("settings"));
  }
})}
}