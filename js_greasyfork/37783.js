// ==UserScript==
// @name         BiliPlus UI
// @namespace    https://www.biliplus.com/
// @version      1.19
// @description  修改BiliPlus界面
// @author       SettingDust
// @include      http*://www.biliplus.com/*

// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdn.bootcss.com/Ripple.js/1.2.1/ripple.min.js
// @require      https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37783/BiliPlus%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/37783/BiliPlus%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
        if ($('.sidebar').length > 0) {
            var css = "";
            //基础css
            css += `
            html {
              -webkit-font-smoothing: antialiased;
            }
            .biliplus-ui-font {
              font-family: Verdana, 'Roboto', 'Helvetica', 'Arial', sans-serif;
              font-size: 1.3125rem;
              line-height: 1.16667em;
              font-weight: 500;
            }
            .biliplus-ui-avatar {
              border-radius: 50%;
            }
            .biliplus-ui-center {
                left: 50%;
                position: relative;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
            .biliplus-ui-circle-loading {
                color: #2196f3;
                margin: 0 16px;
                display: inline-block;
                width: 50px;
                height: 50px;
            }
            @-webkit-keyframes progress-circular-rotate {
              100% {
                transform: rotate(360deg);
              }
            }
            @-webkit-keyframes progress-circular-dash {
              0% {
                stroke-dasharray: 1px, 200px;
                stroke-dashoffset: 0px;
              }
              50% {
                stroke-dasharray: 100px, 200px;
                stroke-dashoffset: -15px;
              }
              100% {
                stroke-dasharray: 100px, 200px;
                stroke-dashoffset: -120px;
              }
            }
            .biliplus-ui-circle-loading-svg {
                animation: progress-circular-rotate 1.4s linear infinite;
            }
            .biliplus-ui-circle-loading-svg-circle {
                animation: progress-circular-dash 1.4s ease-in-out infinite;
                stroke-dasharray: 80px, 200px;
                stroke-dashoffset: 0px;
                stroke: currentColor;
                stroke-linecap: round;
            }
            *, *::before, *::after {
              box-sizing: inherit;
            }`;
            //顶部css
            css += `
            .biliplus-ui-header {
              width: 100%;
              transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              color: rgba(255, 255, 255, 1);
              background-color: #0092f8;
              top: 0;
              left: auto;
              right: 0;
              position: fixed;
              display: flex;
              z-index: 1100;
              box-sizing: border-box;
              flex-shrink: 0;
              flex-direction: column;
              box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
            }
            @media (min-width: 1280px) {
              .biliplus-ui-header {
                width: calc(100% - 250px);
              }
            }
            .biliplus-ui-bar {
              padding: 0 24px;
              height: 64px;
              display: flex;
              position: relative;
              align-items: center;
            }
            .biliplus-ui-title {
              flex: 0 1 auto;
              margin: 0;
              margin-left: 24px;
            }
            .biliplus-ui-whitespace {
              flex: 1 1 auto;
            }
            .biliplus-ui-bar-item {
              display: inline;
              flex-direction: inherit;
              margin: 0 4px;
            }
            .biliplus-ui-button,.biliplus-ui-button:hover,.biliplus-ui-button:link,.biliplus-ui-button:active,.biliplus-ui-button:focus{
              color: inherit;
              flex: 0 0 auto;
              width: 48px;
              height: 48px;
              font-size: 1.5rem;
              text-align: center;
              border-radius: 50%;
              cursor: pointer;
              border: 0;
              display: inline-flex;
              outline: none;
              position: relative;
              user-select: none;
              align-items: center;
              vertical-align: middle;
              text-decoration: none;
              justify-content: center;
              background-color: transparent;
              -webkit-appearance: none;
              -webkit-tap-highlight-color: transparent;
              padding: 0;
            }
            .biliplus-ui-button-icon {
              width: 100%;
              display: flex;
              align-items: inherit;
              justify-content: inherit;
            }
            .biliplus-ui-element {
              width: 1.5em;
              height: 1.5em;
            }
            .biliplus-ui-svg {
              fill: currentColor;
              width: 24px;
              height: 24px;
              display: inline-block;
              transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              user-select: none;
              flex-shrink: 0;
            }`;

            //搜索css
            css += `
            .biliplus-ui-search-input {
              width: 0;
              position: relative;
              border: 0;
              margin: 0;
              display: block;
              background: none;
              white-space: normal;
              vertical-align: top;
              border-bottom: solid #fff 1.5px;
              color: #fff;
              transition: 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              font-size: 1em;
              padding: 4px 0;
              outline: none;
            }
            .biliplus-ui-search-input:focus {
              width: 250px;
              padding: 4px;
            }`;

            //侧边栏css
            css += `
            .biliplus-ui-sidebar {
              width: 250px;
              background-color: #fff;
              height: 100%;
              z-index: 62;
              position: fixed;
              pointer-events: all;
            }
            .biliplus-ui-sidebar-bar {
              display: flex;
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 62;
              pointer-events: none;
            }
            .biliplus-ui-sidebar-ul {
              padding: 0;
              padding-top: 8px;
              padding-bottom: 8px;
              flex: 1 1 auto;
              margin: 0;
              position: relative;
              list-style: none;
            }
            .biliplus-ui-sidebar-li {
              color: rgba(0, 0, 0, 0.87);
              display: block;
              font-size: 0.875rem;
              font-weight: 500;
              font-family: Verdana, 'Roboto', 'Helvetica', 'Arial', sans-serif;
              line-height: 1.71429em;
              padding-top: 0;
              padding-bottom: 0;
              position: relative;
              align-items: center;
              justify-content: flex-start;
              text-decoration: none;
            }
            .biliplus-ui-sidebar-li-a {
              padding-left: 24px;
              padding-right: 24px;
              border-radius: 0;
              text-transform: none;
              justify-content: flex-start;
              width: 100%;
              transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              color: rgba(0, 0, 0, 0.87) !important;
              padding: 8px 16px;
              min-width: 88px;
              font-size: 1rem;
              box-sizing: border-box;
              min-height: 36px;
              line-height: 1.4em;
              font-family: Verdana, 'Roboto', 'Helvetica', 'Arial', sans-serif;
              font-weight: 500;
              cursor: pointer;
              border: 0;
              display: inline-flex;
              outline: none;
              position: relative;
              user-select: none;
              align-items: center;
              vertical-align: middle;
              text-decoration: none;
              background-color: transparent;
              -webkit-appearance: none;
              -webkit-tap-highlight-color: transparent;
            }
            .biliplus-ui-sidebarli-a:hover {
              background-color: rgba(0, 0, 0, 0.12);
            }`;
            //个人信息栏
            css += `
            .biliplus-ui-sidebar-user {
              right: -250px;
              border-left: 1px solid rgba(0, 0, 0, 0.12);
              transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .biliplus-ui-sidebar-user-content {
              margin-top: 14.68em;
            }
            .biliplus-ui-sidebar-user-name {
              text-align: center;
              padding-bottom: 16px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              margin-bottom: 0;
              font-size: 700;
            }
            .biliplus-ui-sidebar-user-on {
              right: 0;
              box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
            }
            .biliplus-ui-avatar-button-big {
              cursor: default;
              box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
            }
            .biliplus-ui-avatar-big {
              cursor: pointer;
            }`;
            //菜单css
            css += `
            .biliplus-ui-sidebar-menu {
              left: -250px;
              border-right: 1px solid rgba(0, 0, 0, 0.12);
              transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .biliplus-ui-sidebar-bar-menu {
              z-index: 1200;
            }
            .biliplus-ui-sidebar-menu-on {
              left: 0;
              box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);
            }
            .biliplus-ui-sidebar-menu-title-content {
              flex-grow: 1;
              align-items: flex-start;
              flex-direction: column;
              justify-content: center;
              padding-left: 24px;
              padding-right: 24px;
              min-height: 64px;
            }
            @media (min-width: 1280px){
              .biliplus-ui-sidebar-menu {
                left: 0;
              }
            }
            .biliplus-ui-sidebar-menu-title {
              display: flex;
              border-bottom: 1px solid rgba(0, 0, 0, 0.12);
              color: #0092f8 !important;
            }
            .biliplus-ui-sidebar-menu-title-main {
              font-size: 2.3em;
              font-weight: 700;
              line-height: 54px;
              padding: 5px 0;
              user-select: none;
            }
            .biliplus-ui-sidebar-menu-foot {
                bottom: 24px;
                position: absolute;
                height: 40px;
                overflow: hidden;
                transition: .1s;
            }
            .biliplus-ui-sidebar-menu-foot:hover {
                height: 164px;
            }
            .sidebar-about {
              color: #000;
              margin: 0 50px !important;
            }
            .sidebar-about>a {
              color: #cdcdcd;
            }
            .sidebar-about>a:hover {
              color: #000;
            }
            .biliplus-ui-about {
              padding: 0px;
              white-space: pre;
              font-size: 9px;
              line-height: 20px;
              color: #cdcdcd;
            }`;

            //主体内容
            css += `
            .biliplus-ui-content {
              margin-bottom: 100px;
              max-width: 100%;
              margin: 0 auto;
              flex: 1 1 100%;
              position: relative;
              z-index: 1;
              padding: 100px 24px;
            }
            @media (min-width: 948px) {
                #content {
                  max-width: 900px;
                  margin: auto;
                }
            }
            @media (min-width: 1280px) {
                .biliplus-ui-content {
                  margin: 0;
                  margin-left: 250px;
                }
            }
            #bgBlur {
              pointer-events: none;
            }`;

            //提示修改
            css += `
            .Biliplus-Notice {
              z-index: 1111 !important;
            }`;

            //背景LOGO
            css += `
            .logo {
              font-family: Verdana;
              font-size: 16em;
              opacity: 0.01;
              position: fixed;
              bottom: 0;
              right: 0;
              font-weight: 700;
              user-select: none;
              pointer-events: none;
              z-index: 0;
            }`;

            //播放器css
            css += `
            #player_container {
              top: 0;
              z-index: 1200;
            }`;

            //进度条css
            css += `
            #nprogress .bar {
                background: #d04d74;
                z-index: 1200;
            }
            #nprogress .peg {
                box-shadow: 0 0 10px #d04d74,0 0 5px #d04d74;
            }`;

            //旧有右边
            css += `
                    .right_slide {
             height: calc(100% - 64px);
             margin-top: 64px;
                    }`;
            //header菜单按钮
            css += `
                    @media (min-width: 1280px) {
            .biliplus-ui-bar-menu {
                display: none;
            }
                    }
                `;

            //侧边菜单遮罩
            css += `
            .biliplus-ui-mask {
              opacity: 0;
              transition: 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
              position: fixed;
              will-change: opacity;
              background-color: rgba(0, 0, 0, 0.5);
              -webkit-tap-highlight-color: transparent;
              pointer-events: none;
            }
            .biliplus-ui-mask-on {
              pointer-events: all;
              opacity: 1;
            }`;

            //创建header
            var body = $('body');
            var header = $('<header/>');
            header.addClass('biliplus-ui-header');
            header.prependTo(body);

            var header_bar = $('<div/>');
            header_bar.addClass('biliplus-ui-bar');
            header_bar.appendTo(header);

            var header_button_menu = $('<div/>');
            header_button_menu.addClass('biliplus-ui-bar-item');
            header_button_menu.addClass('biliplus-ui-bar-menu');
            header_button_menu.appendTo(header_bar);

            var header_button_menu_button = $('<a\>');
            header_button_menu_button.addClass('biliplus-ui-button');
            header_button_menu_button.attr('tabindex', '0');
            header_button_menu_button.appendTo(header_button_menu);

            var header_button_menu_button_icon = $('<span\>');
            header_button_menu_button_icon.addClass('biliplus-ui-button-icon');
            header_button_menu_button_icon.appendTo(header_button_menu_button);

            header_button_menu_button_icon.append('<svg class="biliplus-ui-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>');

            var header_bar_white = $('<div/>');
            header_bar_white.addClass('biliplus-ui-whitespace');
            header_bar_white.appendTo(header_bar);

            var header_title = $('<h2\>');
            header_title.addClass('biliplus-ui-font');
            header_title.addClass('biliplus-ui-title');
            header_bar_white.before(header_title);

            $('#userbar').removeClass('userbar');


            $('.userbarcontent').hide();

            var header_bar_avatar = $('<div/>');
            header_bar_avatar.addClass('biliplus-ui-bar-item');
            header_bar_avatar.appendTo(header_bar);

            var header_bar_avatar_button = $('<a\>');
            header_bar_avatar_button.addClass('biliplus-ui-button');
            header_bar_avatar_button.attr('tabindex', '0');
            header_bar_avatar_button.appendTo(header_bar_avatar);

            var header_bar_avatar_button_icon = $('<span\>');
            header_bar_avatar_button_icon.addClass('biliplus-ui-button-icon');
            header_bar_avatar_button_icon.appendTo(header_bar_avatar_button);

            var old_userbar_content = $('.userbarcontent');
            var avatar = old_userbar_content.find('span img').attr('src');
            var name = old_userbar_content.find('span b').text();

            if (avatar === 'https://static.hdslb.com/images/member/noface.gif') name = '点击头像登陆';

            var header_bar_avatar_button_icon_img = $('<img>');
            header_bar_avatar_button_icon_img.addClass('biliplus-ui-avatar');
            header_bar_avatar_button_icon_img.addClass('biliplus-ui-element');
            header_bar_avatar_button_icon_img.attr('src', avatar);
            header_bar_avatar_button_icon_img.appendTo(header_bar_avatar_button_icon);

            //个人信息侧边栏
            var sidebar = $('<div\>');
            sidebar.addClass('biliplus-ui-sidebar-bar');
            header.after(sidebar);

            var sidebar_user = $('<div\>');
            sidebar_user.addClass('biliplus-ui-sidebar');
            sidebar_user.addClass('biliplus-ui-sidebar-user');
            sidebar_user.appendTo(sidebar);

            var sidebar_user_content = $('<div\>');
            sidebar_user_content.addClass('biliplus-ui-sidebar-user-content');
            sidebar_user_content.appendTo(sidebar_user);

            var sidebar_user_name = $('<h2\>');
            sidebar_user_name.addClass('biliplus-ui-font');
            sidebar_user_name.addClass('biliplus-ui-sidebar-user-name');
            sidebar_user_name.text(name);
            sidebar_user_name.appendTo(sidebar_user_content);

            var old_user_sidebar = $('.usersidebar');
            var space = old_user_sidebar.find('a:eq(0)').attr('href');
            var dynamic = old_user_sidebar.find('a:eq(1)').attr('href').replace('dynamic', 'dynamic_new');
            var bangumi = old_user_sidebar.find('a:eq(2)').attr('href');
            var favouite = old_user_sidebar.find('a:eq(3)').attr('href');
            var history = old_user_sidebar.find('a:eq(4)').attr('href');
            var attention = old_user_sidebar.find('a:eq(5)').attr('href');

            var sidebar_user_ul = $('<ul\>');
            sidebar_user_ul.addClass('biliplus-ui-sidebar-ul');
            sidebar_user_ul.appendTo(sidebar_user_content);

            var sidebar_user_ul_li = $('<li\>');
            sidebar_user_ul_li.addClass('biliplus-ui-sidebar-li');

            var sidebar_user_ul_li_a = $('<a\>');
            sidebar_user_ul_li_a.addClass('biliplus-ui-sidebar-li-a');
            sidebar_user_ul_li_a.appendTo(sidebar_user_ul_li);

            sidebar_user_ul.append(sidebar_user_ul_li.clone().find('a').attr('href', dynamic).text('动态').parent('li'));
            sidebar_user_ul.append(sidebar_user_ul_li.clone().find('a').attr('href', bangumi).text('追番').parent('li'));
            sidebar_user_ul.append(sidebar_user_ul_li.clone().find('a').attr('href', favouite).text('收藏夹').parent('li'));
            sidebar_user_ul.append(sidebar_user_ul_li.clone().find('a').attr('href', history).text('历史记录').parent('li'));
            sidebar_user_ul.append(sidebar_user_ul_li.clone().find('a').attr('href', attention).text('我的关注').parent('li'));

            var mask = $('<div/>');
            mask.addClass('biliplus-ui-mask');
            mask.appendTo(sidebar);

            //侧边栏
            var sidebar_bar_menu = sidebar.clone();
            sidebar_bar_menu.addClass('biliplus-ui-sidebar-bar-menu');
            sidebar.after(sidebar_bar_menu);

            var sidebar_menu = $('<div\>');
            sidebar_menu.addClass('biliplus-ui-sidebar-menu');
            sidebar_menu.addClass('biliplus-ui-sidebar');
            sidebar_menu.appendTo(sidebar_bar_menu);

            $('.sidebar').hide();

            var sidebar_menu_title = $('<a\>');
            sidebar_menu_title.addClass('biliplus-ui-sidebar-menu-title');
            sidebar_menu_title.attr('href', 'https://www.biliplus.com/');
            sidebar_menu_title.appendTo(sidebar_menu);

            var sidebar_menu_title_content = $('<div\>');
            sidebar_menu_title_content.addClass('biliplus-ui-sidebar-menu-title-content');
            sidebar_menu_title_content.addClass('biliplus-ui-font');
            sidebar_menu_title_content.appendTo(sidebar_menu_title);

            var sidebar_menu_title_div = $('<div\>');
            sidebar_menu_title_div.css('padding', '5px 0');
            sidebar_menu_title_div.appendTo(sidebar_menu_title_content);

            var sidebar_menu_title_div_span = $('<span\>');
            sidebar_menu_title_div_span.addClass('biliplus-ui-sidebar-menu-title-main');
            sidebar_menu_title_div_span.text('BiliPlus');
            sidebar_menu_title_div_span.appendTo(sidebar_menu_title_div);

            var sidebar_menu_ul = $('<ul\>');
            sidebar_menu_ul.addClass('biliplus-ui-sidebar-ul');
            sidebar_menu_ul.appendTo(sidebar_menu);

            var old_sidebar = $('#sidebar');
            var bangumilist = old_sidebar.find('a:eq(1)').attr('href');
            var about = old_sidebar.find('a:eq(2)').attr('href');
            var lyb = old_sidebar.find('a:eq(3)').attr('href');
            var tuocao = old_sidebar.find('a:eq(4)').attr('href');

            var sidebar_menu_ul_li = $('<li\>');
            sidebar_menu_ul_li.addClass('biliplus-ui-sidebar-li');

            var sidebar_menu_ul_li_a = $('<a\>');
            sidebar_menu_ul_li_a.addClass('biliplus-ui-sidebar-li-a');
            sidebar_menu_ul_li_a.appendTo(sidebar_menu_ul_li);

            sidebar_menu_ul.append(sidebar_menu_ul_li.clone().find('a').attr('href', bangumilist).text('番剧更新').parent('li'));
            sidebar_menu_ul.append(sidebar_menu_ul_li.clone().find('a').attr('href', lyb).text('留言板').parent('li'));
            sidebar_menu_ul.append(sidebar_menu_ul_li.clone().find('a').attr('href', tuocao).text('TuCaoHelper').parent('li'));
            sidebar_menu_ul.append(sidebar_menu_ul_li.clone().find('a').attr('href', about).text('关于').parent('li'));

            let mask_menu = mask.clone();
            mask_menu.appendTo(sidebar_bar_menu);

            //版权信息
            var sidebar_menu_foot = $('<div\>');
            sidebar_menu_foot.addClass('biliplus-ui-sidebar-menu-foot');
            sidebar_menu_foot.appendTo(sidebar_menu);

            $('.sidebar-about').each(function () {
                sidebar_menu_foot.append($(this));
            });

            var sidebar_menu_foot_material = $('<div\>');
            sidebar_menu_foot_material.addClass('sidebar-about');
            sidebar_menu_foot_material.addClass('biliplus-ui-about');
            sidebar_menu_foot_material.appendTo(sidebar_menu_foot);

            var sidebar_menu_foot_material_a = $('<a\>');
            sidebar_menu_foot_material_a.attr('target', '_blank');
            sidebar_menu_foot_material_a.attr('href', 'https://material-ui-next.com/');
            sidebar_menu_foot_material_a.text('Material-UI');
            sidebar_menu_foot_material_a.appendTo(sidebar_menu_foot_material);

            //主体
            var content = $('<div\>');
            content.addClass('biliplus-ui-content');
            sidebar_bar_menu.after(content);
            $('.biliplus-ui-content').append($('#content'));
            $('#content').removeClass('content');


            //搜索
            var header_bar_search = $('<div\>');
            header_bar_search.addClass('biliplus-ui-bar-item');
            header_bar_avatar.before(header_bar_search);

            var header_bar_search_button = $('<a\>');
            header_bar_search_button.attr('tabindex', '0');
            header_bar_search_button.addClass('biliplus-ui-button');
            header_bar_search_button.appendTo(header_bar_search);

            var header_bar_search_button_span = $('<span\>');
            header_bar_search_button_span.addClass('biliplus-ui-button-icon');
            header_bar_search_button_span.appendTo(header_bar_search_button);

            header_bar_search_button_span.append('<svg class="biliplus-ui-svg" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>');

            var header_bar_search_input = $('<input\>');
            header_bar_search_input.addClass('biliplus-ui-search-input');
            header_bar_search_input.addClass('biliplus-ui-font');
            header_bar_avatar.before(header_bar_search_input);

            //头像动画
            $('.biliplus-ui-button').click(function () {
                if ($(this).find('.biliplus-ui-button-icon .biliplus-ui-avatar').length > 0
                    & !$(this).hasClass('.biliplus-ui-avatar-button-big')) {
                    header_bar_avatar_button_icon_img.animate({
                        top: '3.8em',
                        width: '8em',
                        height: '8em'
                    }, 300);
                    $(this).animate({
                        top: '3.8em',
                        width: '8em',
                        height: '8em'
                    }, 300, function () {
                        $(this).addClass('biliplus-ui-avatar-button-big');
                    });
                    header_bar_avatar_button_icon_img.addClass('biliplus-ui-avatar-big');
                    sidebar_user.addClass('biliplus-ui-sidebar-user-on');
                    mask.addClass('biliplus-ui-mask-on');
                }
            });

            //水波效果
            window.rippler = $.ripple('.biliplus-ui-button:not(.biliplus-ui-avatar-button-big)', {
                multi: false
            });
            window.rippler = $.ripple('.biliplus-ui-sidebar-li', {
                multi: true
            });

            //侧边缩回
            body.on('click', '.biliplus-ui-mask-on', function () {
                avatarToSmall();
                $(this).removeClass('biliplus-ui-mask-on');
                $('.biliplus-ui-sidebar-menu-on').removeClass('biliplus-ui-sidebar-menu-on');
            });

            //LOGO
            body.append('<div class="logo">Bili<sup>+</sup></div>');

            //ajax

            $('.biliplus-ui-sidebar-li-a').click(function () {
                var href = $(this).attr('href');
                NProgress.start();
                event.preventDefault();
                $.get(href, function (data) {
                    var html = $("<code></code>").append(data);
                    var result = html.find('#content').removeClass('content');
                    if (href.indexOf('tucao') !== -1)
                        window.open(href);
                    else {
                        content.html(result);
                        location.href = href;
                    }
                    avatarToSmall();
                    NProgress.done();
                });
            });

            $('.biliplus-ui-sidebar-menu-title').click(function () {
                var href = $(this).attr('href');
                NProgress.start();
                event.preventDefault();
                $.get(href, function (data) {
                    let html = $("<code></code>").append(data);
                    let result = html.find('#content').removeClass('content');
                    content.html(result);
                    let state = {
                        title: document.title,
                        url: window.location.href
                    };
                    window.history.pushState(state, document.title, window.location.href);
                    state = {
                        title: document.title,
                        url: href
                    };
                    window.history.replaceState(state, document.title, href);
                    reloadIndex();
                    NProgress.done();
                });
            });


            body.on('click', '.biliplus-ui-avatar-button-big', function () {
                NProgress.start();
                header_bar_avatar_button_icon_img.animate({
                    top: '0',
                    width: '1.5em',
                    height: '1.5em',
                }, 300);
                header_bar_avatar_button.animate({
                    top: '0',
                    width: '48px',
                    height: '48px',
                }, {
                    duration: 300,
                    done: function () {
                        NProgress.done();
                        header_bar_avatar_button.removeClass('biliplus-ui-avatar-button-big');
                        window.location.href = space;
                    },
                    start: function () {
                        sidebar_user.removeClass('biliplus-ui-sidebar-user-on');
                        header_bar_avatar_button_icon_img.removeClass('biliplus-ui-avatar-big');
                    }
                });
                event.preventDefault();
                $.get(space, function (data) {
                    var html = $("<code></code>").append(data);
                    var result = html.find('#content').removeClass('content');
                    content.html(result);
                });
            });

            //搜索
            header_bar_search.click(function () {
                header_bar_search_input.focus();
            });
            header_bar_search_input.blur(function () {
                header_bar_search_input.val('');
            });
            header_bar_search_input.keypress(function (e) {
                var ev = document.all ? window.event : e;
                if (ev.keyCode === 13) {
                    search();
                }
            });
            //菜单按钮
            header_button_menu.click(function () {
                    sidebar_menu.addClass('biliplus-ui-sidebar-menu-on');
                    mask_menu.addClass('biliplus-ui-mask-on');
                }
            );

            //单独处理页面
            body.ajaxComplete(function () {

            });

            if (window.location.href !== 'https://www.biliplus.com/')
                if ($('#header').length > 0) {
                    header_title.text($('#header:first').text());
                    $('#header:first').remove();
                } else if ($('.title').length > 0) {
                    header_title.text($('.title:first').text());
                    $('.title:first').remove();
                } else if ($('.frametitle').length > 0) {
                    header_title.text($('.frametitle:first').text());
                    $('.frametitle:first').remove();
                }

            //卡片
            css += `
            .biliplus-ui-card {
                border-radius: 2px;
                min-width: 275px;
                width: 100%;
                box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
                background-color: #fff;
                display: flex;
                margin: 16px;
            }
            .biliplus-ui-card a {
                transition: 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                color: rgba(0, 0, 0, 0.87);
                width: max-content;
                overflow: hidden;
                max-width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .biliplus-ui-card a:hover {
                color: #0092f8;
            }
            .biliplus-ui-card-foot {
                height: 52px;
                display: flex;
                padding: 16px 24px;
                box-sizing: border-box;
                align-items: center;
                border-top: 1px solid rgba(160,160,160,0.2);
            }
            .biliplus-ui-card-foot a {
                color: #0092f8;
                padding: 7px 8px;
                min-width: 64px;
                font-size: 0.8125rem;
                min-height: 32px;
                transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                font-weight: 500;
                border-radius: 2px;
                text-transform: uppercase;
                cursor: pointer;
            }
            .biliplus-ui-card-foot a:hover {
                background-color: rgba(0, 146, 248, 0.12);
            }
            .biliplus-ui-card-loading {
                position: absolute;
                width: 100%;
                height: 180px;
                min-width: 275px;
            }`;
            //视频卡片
            css += `
            .biliplus-ui-card-video {
                max-height: 193px;
            }
            .biliplus-ui-card-video-img {
                width: 344px;
                height: 193px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
            }
            .biliplus-ui-card-video-content {
                display: flex;
                flex-direction: column;
                width: calc(100% - 344px);
            }
            .biliplus-ui-card-video-content-text {
                flex: 1 0 auto;
                padding: 24px;
            }
            .biliplus-ui-card-video-content-title {
                font-size: 1.5rem;
                line-height: 1.35417em;
                margin-bottom: 16px;
            }
            .biliplus-ui-card-video-content-context {
                font-size: 1rem;
                line-height: 1.5em;
            }
            .biliplus-ui-card-video-content-description {
                color: rgba(0, 0, 0, 0.54) !important;
                font-size: 0.875rem;
            }
            .biliplus-ui-card-video-content-margin {
                display: block;
            }`;

            //搜索卡片
            css += `
                .biliplus-ui-card-search {
                    display: block;
                }
                .biliplus-ui-card-search-content {
                    padding: 16px;
                }`;

            //主页
            if (window.location.href === 'https://www.biliplus.com/'
                || window.location.href === 'https://www.biliplus.com/index.php') {
                reloadIndex();
            }
            //Paper
            css += `
               .biliplus-ui-paper {
                  margin-top: 24px;
                  padding-top: 16px;
                  padding-left: 16px;
                  padding-right: 16px;
                  padding-bottom: 16px;
                  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
                  border-radius: 2px;
                  background-color: #fff;
                }
                @media (min-width:600px) {
                  .biliplus-ui-paper {
                    padding-left: 24px;
                    padding-right: 24px;
                  }
                }
                `;
            if (window.location.href === 'https://www.biliplus.com/?bangumi') {
            }
            if (window.location.href.indexOf('https://www.biliplus.com/lyb/') !== -1) {
                css += `
                .biliplus-ui-comment {
                  word-break: break-word;
                  font-size: 1rem;
                }
                .hoveritem {
                  height: 24px;
                  color: rgba(0, 0, 0, 0.54);
                  font-size: 0.875rem;
                  margin-top: 4px;
                  line-height: 24px;
                }
                .biliplus-ui-comment-reply {
                  padding: 8px 0 0 8px;
                  border-top: 1px solid rgba(0, 0, 0, 0.12);
                }`;

                $('br').remove();
                let comment = $('<div>');
                comment.addClass('biliplus-ui-paper');
                comment.addClass('biliplus-ui-font');
                comment.addClass('biliplus-ui-comment');

                $('#content>.ly').each(function () {
                    let comment_clone = comment.clone();

                    $('.footer_video').before(comment_clone.append($(this).html()));
                    $('.hoveritem').removeAttr('style');
                    let i = 0;
                    comment_clone.children('div').each(function () {
                        if (i > 0)
                            $(this).addClass('biliplus-ui-comment-reply');
                        i++;
                    });

                    $(this).remove();
                });
            }
            if (window.location.href === 'https://www.biliplus.com/?about') {
            }
            if (window.location.href === 'https://www.biliplus.com/me/dynamic_new/') {
                header_title.text("动态");
            }
            if (window.location.href === 'https://www.biliplus.com/me/bangumi/') {

            }
            if (window.location.href === 'https://www.biliplus.com/me/favourite/') {

            }
            if (window.location.href === 'https://www.biliplus.com/me/history/') {

            }
            if (window.location.href === 'https://www.biliplus.com/me/attention/') {

            }
            $(window).load(function () {
                if (window.location.href.indexOf('video/av') !== -1) {
                    header_title.append($('.videotitle').html());
                }
            });
            $("head").append('<link href="https://cdn.bootcss.com/Ripple.js/1.2.1/ripple.min.css" rel="stylesheet">');
            $("head").append('<link href="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css" rel="stylesheet">');

            var style=$("<style/>");
            style.text(css).appendTo($("head"));
        }

        function reloadIndex() {
            header_title.text('BiliPlus，( ゜- ゜)つロ 乾杯~');
            $('.indextitle').remove();

            var random_video_card = $('<div\>');
            random_video_card.addClass('biliplus-ui-card');
            random_video_card.addClass('biliplus-ui-card-video');
            random_video_card.prependTo($('#content'));
            $('.borderbox').remove();

            var random_video_card_img = $('<div\>');
            random_video_card_img.addClass('biliplus-ui-card-video-img');
            random_video_card_img.appendTo(random_video_card);

            let random_video_card_content = $('<div\>');
            random_video_card_content.addClass('biliplus-ui-card-video-content');
            random_video_card_content.appendTo(random_video_card);

            let random_video_card_content_text = $('<div\>');
            random_video_card_content_text.addClass('biliplus-ui-card-video-content-text');
            random_video_card_content_text.appendTo(random_video_card_content);

            var random_video_card_content_text_title = $('<a\>');
            random_video_card_content_text_title.attr('target', '_blank');
            random_video_card_content_text_title.addClass('biliplus-ui-card-video-content-title');
            random_video_card_content_text_title.addClass('biliplus-ui-card-video-content-margin');
            random_video_card_content_text_title.addClass('biliplus-ui-font');
            random_video_card_content_text_title.appendTo(random_video_card_content_text);

            var random_video_card_content_text_up = $('<a\>');
            random_video_card_content_text_up.attr('target', '_blank');
            random_video_card_content_text_up.addClass('biliplus-ui-card-video-content-context');
            random_video_card_content_text_up.addClass('biliplus-ui-card-video-content-margin');
            random_video_card_content_text_up.addClass('biliplus-ui-font');
            random_video_card_content_text_up.appendTo(random_video_card_content_text);

            var random_video_card_content_text_av = $('<a\>');
            random_video_card_content_text_av.attr('target', '_blank');
            random_video_card_content_text_av.addClass('biliplus-ui-card-video-content-context');
            random_video_card_content_text_av.addClass('biliplus-ui-card-video-content-description');
            random_video_card_content_text_av.addClass('biliplus-ui-font');
            random_video_card_content_text_av.addClass('biliplus-ui-card-video-content-margin');
            random_video_card_content_text_av.appendTo(random_video_card_content_text);

            var random_video_card_foot = $('<div\>');
            random_video_card_foot.addClass('biliplus-ui-card-foot');
            random_video_card_foot.appendTo(random_video_card_content);


            var random_video_card_loading = $('<div\>');
            random_video_card_loading.addClass('biliplus-ui-circle-loading');
            random_video_card_loading.addClass('biliplus-ui-center');
            random_video_card_loading.append('<svg class="biliplus-ui-circle-loading-svg" viewBox="0 0 50 50"><circle class="biliplus-ui-circle-loading-svg-circle" cx="25" cy="25" r="20" fill="none" stroke-width="3.6"></circle></svg>');

            //var random_video_card_loading_clone = random_video_card_loading.clone();
            //random_video_card_loading_clone.appendTo(random_video_card);

            let random_video_card_foot_reload = $('<a\>');
            random_video_card_foot_reload.text('Reload');
            random_video_card_foot_reload.appendTo(random_video_card_foot);
            random_video_card_foot.hide();

            window.rippler = $.ripple('.biliplus-ui-card-foot a', {
                multi: false
            });

            random_video_card_foot_reload.click(function () {
                NProgress.start();
                //random_video_card_loading_clone = random_video_card_loading.clone();
                //random_video_card_loading_clone.appendTo(random_video_card);
                //random_video_card_foot.hide();
                getjson('/api/random?ajax', randomVideo);

            });
            NProgress.start();
            getjson('/api/random?ajax', randomVideo);
            random_video_card_img.click(function () {
                window.open(random_video_card_img.attr('href'));
            });

            let card_search = $('<div\>');
            card_search.addClass('biliplus-ui-card');
            card_search.addClass('biliplus-ui-card-search');
            random_video_card.after(card_search);

            let card_search_content = $('<div\>');
            card_search_content.addClass('biliplus-ui-card-search-content');
            card_search_content.appendTo(card_search);

            $('#normal_container').appendTo(card_search_content);
            $('#advance_container').appendTo(card_search_content);

            function randomVideo(json) {
                random_video_card_content_text_av.attr('href', '/video/av' + json.aid + '/');
                random_video_card_content_text_av.text('AV' + json.aid);
                random_video_card_content_text_title.attr('href', '/video/av' + json.aid + '/');
                random_video_card_content_text_title.text(json.title);
                random_video_card_content_text_up.attr('href', '/space/' + json.mid + '/');
                random_video_card_content_text_up.text('UP: ' + json.up);
                random_video_card_foot.css('display', 'flex');
                random_video_card_img.attr('href', '/video/av' + json.aid + '/');
                random_video_card_img.attr('style', 'background-image: url("' + json.pic.replace(/https?:/, 'https:') + '")');
                //random_video_card_loading_clone.remove();
                NProgress.done();
            }
        }

        function avatarToSmall() {
            if ($('.biliplus-ui-avatar-button-big').length > 0) {
                header_bar_avatar_button_icon_img.animate({
                    top: '0',
                    width: '1.5em',
                    height: '1.5em',
                }, 300);
                header_bar_avatar_button.animate({
                    top: '0',
                    width: '48px',
                    height: '48px',
                }, {
                    duration: 300,
                    done: function () {
                        header_bar_avatar_button.removeClass('biliplus-ui-avatar-button-big');
                    },
                    start: function () {
                        sidebar_user.removeClass('biliplus-ui-sidebar-user-on');
                        header_bar_avatar_button_icon_img.removeClass('biliplus-ui-avatar-big');
                    }
                });
                header_bar_avatar_button_icon_img.removeClass('biliplus-ui-avatar-big');
                sidebar_user.removeClass('biliplus-ui-sidebar-user-on');
                mask.removeClass('biliplus-ui-mask-on');
            }
        }

        function search() {
            var input = header_bar_search_input.val();
            if (input === "") {
                return false;
            } else {
                if (input.replace(/\d+/, "") === "") {
                    //jumptext('检测到您输入了一段数字：“'+input+'”，请问这个数字是什么呢？<br><a href="/video/av'+input+'/" title="查看该AV号详情"><div class="url_go">这是一个AV号</div></a>　<a href="/space/'+input+'/" title="查看该ID的UP主的投稿"><div class="url_go">这是一个UP主的ID</div></a>　<a href="/api/do.php?act=search&o=default&n=20&p=1&word='+input+'" title="前往搜索"><div class="url_go">我只是想搜索这个数字而已</div></a>');
                    var con = confirm("前往投稿 av" + input + " ？");
                    if (con) {
                        location.href = '/video/av' + input + '/';
                        return;
                    }
                    con = confirm('前往MID ' + input + ' 的UP空间？');
                    if (con) {
                        location.href = "/space/" + input + '/';
                    } else {
                        location.href = "/api/do.php?source=bilibili&act=search&o=default&n=20&p=1&word=" + encodeURIComponent(input);
                    }
                } else if (input.search(/av\d+/i) !== -1) {
                    var av = input.match(/av(\d+)/i)[1];
                    location.href = "/video/av" + av + "/";
                } else if (input.search(/space\.bilibili\.com\/\d+/i) !== -1) {
                    var mid = input.match(/space\.bilibili\.com\/(\d+)/i)[1];
                    location.href = "/space/" + mid + '/';
                } else {
                    location.href = "/api/do.php?source=bilibili&act=search&o=default&n=20&p=1&word=" + encodeURIComponent(input);
                }
            }
        }
    });
})();