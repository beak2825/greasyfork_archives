// ==UserScript==
// @name         Forum Master・Discuz! Revision
// @name:en      Forum Master・Discuz! Revision
// @name:zh-CN   论坛大师・Discuz！修改版
// @name:zh-TW   論壇大師・Discuz！修改版
// @namespace    Forum Master・Discuz!-mxdh
// @version      0.8.2
// @icon         https://www.discuz.net/favicon.ico
// @description  Forum Master - Discuz!　Beautify the interface, Remove ads, Enhance functions.
// @description:en    Forum Master - Discuz!　Beautify the interface, Remove ads, Enhance functions.
// @description:zh-CN 论坛大师（简体中文）・Discuz!　界面美化、移除广告、功能增强……
// @description:zh-TW 論壇大師（繁體中文）・Discuz!　界面美化、移除廣告、功能增強……
// @author       hostname,mxdh
// @match        http://*/thread-*.html
// @match        http://*/forum.php?mod=viewthread&tid=*
// @match        http://*/viewthread-*.html
// @match        http://*/fourm/thread-*.html
// @match        https://*/thread-*.html
// @match        https://*/forum.php?mod=viewthread&tid=*
// @match        https://*/viewthread-*.html
// @match        https://*/forum/thread-*.html
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @supportURL   https://github.com/mxdh/Forum-Master-Discuz-
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/401307/Forum%20Master%E3%83%BBDiscuz%21%20Revision.user.js
// @updateURL https://update.greasyfork.org/scripts/401307/Forum%20Master%E3%83%BBDiscuz%21%20Revision.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //This is the original author's statement:
    /**
     * Forum Master・Discuz! - https://greasyfork.org/scripts/400250
     *
     * == BEGIN LICENSE ==
     *
     * Open name: Forum Master・Discuz!
     * Open home: https://greasyfork.org/scripts/400250
     *
     * Licensed under the terms of any of the following licenses at your
     * choice:
     *
     * 1. GPL - GNU General Public License
     *    https://www.gnu.org/licenses/gpl-3.0.html
     *
     * 2. MPL - Mozilla Public License
     *    https://www.mozilla.org/MPL/2.0/
     *
     * Copyright statement is prohibited from modification and must be retained.
     *
     * == END LICENSE ==
     */

    // Global Settings · Start
    const GLOBAL_CONFIG = {
        // Display the users' online status: 'None', 'Standard', 'Advanced'
        // 显示用户的在线状态: 'None', 'Standard', 'Advanced'
        // 顯示用戶的在線狀態: 'None', 'Standard', 'Advanced'
        detection_mode: 'Advanced',

        // Text Beautification: true/false
        // 文本美化: true/false
        // 文字美化: true/false
        text_beautification: false,

        // Code Beautification: true/false
        // 代码美化：true/false
        // 程式碼美化：true/false
        code_beautification: true,

        // Scene Mode: 'Standard', 'Family', 'Office'
        // 场景模式: 'Standard', 'Family', 'Office'
        // 場景模式: 'Standard', 'Family', 'Office'
        scene_mode: 'Standard',

        // Automatically refresh after modifying settings on webpage: true/false,
        // 在网页上修改设置后自动刷新: true/false,
        // 在網頁上修改設置後自動刷新: true/false,
        auto_reload: true,

        // Display Eomji: true/false
        // 显示Emoji: true/false
        // 顯示Emoji: true/false
        display_emoji: true,
    }
    // Global Settings · End

    // Below is the core code

    // Host Name
    const hn = window.location.hostname;

    function get_site_pos() {
        if (!!~hn.indexOf('.com.cn')) return -3;
        return -2;
    }

    const site_pos = get_site_pos();
    const site = hn.split('.').slice(site_pos, site_pos + 1).join().toUpperCase();

    GM_log("Site name:", site);

    // Scene mode: Standard, Family, Office
    var scene_mode = GM_getValue(site + '_SCENE_MODE') || GLOBAL_CONFIG.scene_mode;

    // Display the users online status
    // GM_deleteValue(site + '_DETECTION_MODE');
    var detection_mode = GM_getValue(site + '_DETECTION_MODE') || GLOBAL_CONFIG.detection_mode;

    // Test code
    const ua = window.navigator.userAgent;
    GM_log('User-Agent:', ua);
    GM_log('');

    GM_log('Scene mode:', scene_mode);
    GM_log(typeof scene_mode);
    GM_log('Detection mode:', detection_mode);
    GM_log(typeof detection_mode);
    GM_log('');

    const detection_mode_dic = {
        None: '关闭',
        Standard: '普通',
        Advanced: '高级'
    }

    const detection_mode_cutover_dic = {
        None: 'Standard',
        Standard: 'Advanced',
        Advanced: 'None'
    }

    const scene_mode_dic = {
        Standard: '标准模式',
        Family: '家庭模式',
        Office: '办公模式'
    }

    const scene_mode_cutover_dic = {
        Standard: 'Family',
        Family: 'Office',
        Office: 'Standard'
    }

    // Cascading Style Sheets・Global
    GM_addStyle(`
        :root {
            --blue: #007bff;
            --indigo: #6610f2;
            --purple: #6f42c1;
            --pink: #e83e8c;
            --red: #dc3545;
            --orange: #fd7e14;
            --yellow: #ffc107;
            --green: #28a745;
            --teal: #20c997;
            --cyan: #17a2b8;
            --white: #fff;
            --gray: #6c757d;
            --gray-dark: #343a40;
            --primary: #007bff;
            --secondary: #6c757d;
            --success: #28a745;
            --info: #17a2b8;
            --warning: #ffc107;
            --danger: #dc3545;
            --light: #f8f9fa;
            --dark: #343a40;
            --breakpoint-xs: 0;
            --breakpoint-sm: 576px;
            --breakpoint-md: 768px;
            --breakpoint-lg: 992px;
            --breakpoint-xl: 1200px;
            --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Noto Sans CJK", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei New", "Microsoft Yahei", "WenQuanYi Micro Hei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            --font-family-monospace: "Fira Code", Hack, "Source Code Pro", "Source Code Variable", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Noto Sans Mono CJK", "Microsoft YaHei Mono", "WenQuanYi Zen Hei Mono", monospace;
        }

        .ads,
        .plc .dnch_eo_pt,
        .plc .dnch_eo_pb,
        #diynavtop,
        #drk_colee_left1,
        #drk_colee_left2,
        #drk_ledtd,
        #hd .wp .a_mu,
        table .a_pr,
        .ad .plc .a_p,
        .a_h,
        .a_t,
        .a_pt,
        .a_pb {
            display: none;
        }

        .pls .avatar {
            padding-top: 1px;
            position: relative;
            text-align: center;
            object-fit: contain;
        }

        .pls .avatar img {
            width: 120px;
            height: 120px;
            object-fit: contain;
            background: none;
            border-radius: 50%;
            padding: 0;
            border: 2px solid #fff;
            box-shadow: 0 0 10px #00BFFF;
        }

        .pls .m img {
            width: 120px;
            height: 120px;
            object-fit: contain;
            border-radius: 50%;
            background: none;
        }

        .pls .m img:hover {
            background: #fff;
            object-fit: contain;
            background: #fff;
            border-radius: 0;
        }

        .avt img,
        #tath img,
        .rate table img,
        .cm .vm img,
        .card_mn .avt img {
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 2px #bbb;
        }

        .avt img:hover,
        #tath img:hover,
        .rate table img:hover,
        .cm .vm img:hover,
        .card_mn .avt img:hover {
            border-radius: 0;
            box-shadow: none;
        }

        .pls .avatar img,
        .avtm img,
        .avt img,
        #tath img,
        .rate table img,
        .cm .vm img,
        .card_mn .avt img,
        .pls .m img {
            -webkit-transition: 0.5s;
            -moz-transition: 0.5s;
            -ms-transition: 0.5s;
            -o-transition: 0.5s;
            transition: 0.5s;
        }

        .pls .avatar img:hover,
        .avt img:hover,
        #tath img:hover,
        .rate table img:hover,
        .cm .vm img:hover,
        .card_mn .avt img:hover {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
        }

        .user-online-status {
            display: block;
            margin: 0;
            border-collapse: collapse;
            text-align: center;
            position: absolute;
            left: 0;
            top: 0;
            width: 10px;
            height: 10px;
            cursor: help;
        }

        .user-status-expression {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            text-align: center;
            border-collapse: collapse;
            cursor: help;
        }

        .user-status-expression-online::after {
            content: '🌝';
        }

        .user-status-expression-offline::after {
            content: '🌚';
        }

        .offline {
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: grayscale(100%);
        }

        #hd .wp,
        #um {
            padding-top: 0;
        }

        .function-buttons {
            padding: 0 0 4px 0;
            text-align: right;
            white-space: nowrap;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .custom-function-button {
            margin: 4px 4px;
            padding: 2px 8px;
            background-color: #FFFFFF;
            text-align: center;
            border:#DCDCDC solid 1px;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            font-weight: bold;
        }

        .custom-function-button:hover {
            box-shadow: 0 1px 2px #bbb;
            border-top: #00BFFF solid 1px;
            background-color: #F0FFFF;
        }

        .button-disabled {
            color: #808080;
            cursor: default;
        }

        .button-disabled:hover {
            box-shadow: none;
        }
    `);

    if (GLOBAL_CONFIG.text_beautification === true) {
        GM_addStyle(`
            body, table, input, button, select, textarea, a {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei New", "Microsoft Yahei", "WenQuanYi Micro Hei", "Noto Sans CJK", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            }
        `)
    }

    if (GLOBAL_CONFIG.code_beautification === true) {
        GM_addStyle(`
            .mono, .md, .code, .pre, .tt, mono, md, code, pre, tt,
            .blockcode ol li {
                font-family: "Fira Code", Hack, "Source Code Pro", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Microsoft YaHei Mono", "WenQuanYi Zen Hei Mono", "Noto Sans Mono CJK", monospace !important;
            }
        `)
    }

    // Login status
    const member = !!document.getElementById('extcreditmenu') || !!document.getElementById('myprompt') || !!document.getElementById('myrepeats');

    GM_log('Login status:', member);
    GM_log('');

    // Default avatar
    function default_avatar() {
        // https://herder.cdn.bcebos.com/uc_server/images/noavatar_big.gif
        // https://herder.cdn.bcebos.com/uc_server/images/noavatar_middle.gif
        // https://herder.cdn.bcebos.com/uc_server/images/noavatar_small.gif
        if (site === '52POJIE') {
            GM_addStyle(`
                .pls .avatar img,
                .avtm img {
                    content: url('//avatar.52pojie.cn/images/noavatar_middle.gif');
                }

                #um .avt img,
                #tath img,
                .rate table img,
                .cm .vm img,
                .card_mn .avt img {
                    content: url('//avatar.52pojie.cn/images/noavatar_small.gif');
                }
            `);
        } else {
            GM_addStyle(`
                .pls .avatar img,
                .avtm img {
                    content: url('//herder.cdn.bcebos.com/uc_server/images/noavatar_middle.gif');
                }

                #um .avt img,
                #tath img,
                .rate table img,
                .cm .vm img,
                .card_mn .avt img {
                    content: url('//herder.cdn.bcebos.com/uc_server/images/noavatar_small.gif');
                }
            `);
        }
    }

    // Default avatar for Family attach
    function default_avatar_for_family_attach() {
        GM_addStyle(`
            .pls .avatar img:hover,
            .avtm img:hover,
            .avt img:hover,
            #tath img:hover,
            .rate table img:hover,
            .cm .vm img:hover,
            .card_mn .avt img:hover,
            .pls .m img {
                content: none;
            }
        `);
    }

    // Simplified avatar
    function simplified_avatar() {
        GM_addStyle(`
            .pls .avatar {
                margin: 10px auto;
                width: 60px;
                height: 60px;
            }

            .pls .avatar img {
                width: 60px;
                height: 60px;
            }

            .pls .avatar img:hover {
                border-radius: 0;
            }

            .md_ctrl,
            p.xg1,
            nav.toc,
            .scbar_hot_td,
            .pls .avatar_p .vm,
            img.authicn.vm,
            fieldset {
                display: none;
            }

            .plhin {
                background: none !important;
            }
        `);
    }

    // Hidden Signature
    function hidden_signature() {
        GM_addStyle(`
            .sign,
            .signature {
                display: none;
            }
        `);
    }


    // Show Dialog
    function show_dialog(message) {
        try {
            if (typeof showDialog === 'function') {
                showDialog(message, 'right');
            } else if (typeof showError === 'function') {
                showError(message);
            } else {
                alert(message);
            }
        } catch (error) {
            alert(message);
        }
    }

    // Scene mode
    switch (scene_mode) {
        case 'Standard':
            break;

        case 'Family':
            // Set as Default avatar
            default_avatar();
            // Set as Default avatar for Family attach
            default_avatar_for_family_attach();
            break;

        case 'Office':
            // Set as Default avatar
            default_avatar();
            // Set as Simplified avatar
            simplified_avatar();
            // Set as Hidden Signature
            hidden_signature();
            break;

        default:
            break;
    }

    // Display the user real online status
    function display_user_real_online_status(avatar, id) {
        let request = new XMLHttpRequest();
        let url = './home.php?mod=spacecp&ac=pm&op=showmsg&touid=' + id + '&inajax=1';
        request.open('GET', url);
        request.send();
        request.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                let status = !!~this.response.indexOf('[在线]');
                let span = document.createElement('span');
                span.className = status ? 'user-status-expression user-status-expression-online' : 'user-status-expression user-status-expression-offline';
                span.title = status ? '当前在线' : '当前离线';
                avatar.appendChild(span);
            }
        }, false);
    }

    // Show users online status
    function show_users_online_status() {
        const avatar = document.getElementsByClassName('avatar');
        const info = document.getElementsByClassName('i');
        const wait = site === 'PCBETA' ? 3000 : 1111;

        switch (detection_mode) {
            case 'None':
                break;

            case 'Standard':
                // Show default users online status
                for (let i = 0; i < info.length; i++) {
                    if (!!~info[i].innerHTML.indexOf('<em>当前在线</em>')) {
                        let div = document.createElement('div');
                        div.className = 'user-online-status online gol';
                        div.title = '当前在线';
                        avatar[i].appendChild(div);
                    } else {
                        let div = document.createElement('div');
                        div.className = 'user-online-status offline gol';
                        div.title = '当前离线';
                        avatar[i].appendChild(div);

                        // avatar[i].classList.add('offline');
                    }
                }
                break;

            case 'Advanced':
                // Show real users online status
                for (let i = 0; i < info.length; i++) {
                    setTimeout(() => {
                        let html = avatar[i].innerHTML;
                        let id = /\d/.test(html) ? html.match(/\d+/)[0] : info[i].innerHTML.match(/\d+/)[0];
                        display_user_real_online_status(avatar[i], id);
                    }, i * wait + 1000);
                }
                break;

            default:
                break;
        }
    }

    // Execution as Show users online status
    if (member) {
        show_users_online_status();
    } else if (site === 'PCBETA' || site === 'DOSPY' || site === '17500') {
        detection_mode = 'Standard';
        show_users_online_status();
    }

    var display_check_in_button = true;

    if (site === 'KAFAN') {
        // Auto Check-in
        if (member) {
            const status_images = document.getElementsByClassName('qq_bind');
            if (!!status_images.length) {
                !!status_images[0].src.slice(-6, -4) === 'dk' && document.getElementById('pper_a').click();
                display_check_in_button = false;
            }
        }
    }

    if (site === 'HUORONG' || site === 'DOSPY') display_check_in_button = false;

    // Create Button Group
    function create_button_group() {
        // Function buttons
        const function_buttons = document.createElement('div');
        function_buttons.id = 'function-buttons';
        function_buttons.className = 'function-buttons';
        let function_buttons_package;
        switch (true) {
            case !!document.getElementsByClassName('xm_header_top_ul').length:
                function_buttons_package = document.getElementsByClassName('xm_header_top_ul')[0];
                break;

            case !!document.getElementById('extcreditmenu'):
                function_buttons_package = document.getElementById('extcreditmenu').parentElement;
                break;

            case site === 'PCBETA' && !!document.getElementsByClassName('hdc').length:
                function_buttons_package = document.getElementsByClassName('hdc')[0];
                break;

            case !!document.getElementsByClassName('menu').length:
                function_buttons_package = document.getElementsByClassName('menu')[0];
                break;

            case !!document.getElementById('pt'):
                function_buttons_package = document.getElementById('pt');
                break;

            default:
                break;
        }

        if (!!function_buttons_package === false) {
            GM_log('No nodes');
            return false;
        }

        // Scene mode button
        function scene_mode_mouseenter() {
            scene_mode = GM_getValue(site + '_SCENE_MODE') || scene_mode;
            this.innerHTML = scene_mode_dic[scene_mode];
        }
        function scene_mode_switch() {
            this.disabled = true;
            this.classList.add('button-disabled');
            scene_mode = scene_mode_cutover_dic[scene_mode];
            this.innerHTML = scene_mode_dic[scene_mode];
            GM_setValue(site + '_SCENE_MODE', scene_mode);
            if (GLOBAL_CONFIG.auto_reload) {
                window.location.reload();
                return;
            }
            let message = '场景模式切换成功，刷新页面即可进入 <span style="color: var(--info);">' + scene_mode_dic[scene_mode] + '</span>。';
            show_dialog(message);
            this.disabled = false;
            this.classList.remove('button-disabled');
        }
        const scene_mode_button = document.createElement('button');
        scene_mode_button.className = 'custom-function-button scene-mode-button';
        scene_mode_button.innerHTML = scene_mode_dic[scene_mode];
        scene_mode_button.addEventListener('mouseenter', scene_mode_mouseenter, false);
        scene_mode_button.addEventListener('click', scene_mode_switch, false);
        function_buttons.appendChild(scene_mode_button);

        // Detection mode button
        function detection_mode_mouseenter() {
            detection_mode = GM_getValue(site + '_DETECTION_MODE') || detection_mode;
            this.innerHTML = '探测模式：' + detection_mode_dic[detection_mode];
        }
        function detection_mode_switch() {
            this.disabled = true;
            this.classList.add('button-disabled');
            detection_mode = detection_mode_cutover_dic[detection_mode];
            this.innerHTML = '探测模式：' + detection_mode_dic[detection_mode];
            GM_setValue(site + '_DETECTION_MODE', detection_mode);
            if (GLOBAL_CONFIG.auto_reload) {
                window.location.reload();
                return;
            }
            let message = '探测模式切换成功，刷新页面即可进入 <span style="color: var(--info);">' + scene_mode_dic[scene_mode] + '</span>。';
            show_dialog(message);
            this.classList.remove('button-disabled');
        }
        if (member) {
            const detection_mode_button = document.createElement('button');
            detection_mode_button.className = 'custom-function-button detection-mode-button';
            detection_mode_button.innerHTML = '探测模式：' + detection_mode_dic[detection_mode];
            detection_mode_button.addEventListener('mouseenter', detection_mode_mouseenter, false);
            detection_mode_button.addEventListener('click', detection_mode_switch, false);
            function_buttons.appendChild(detection_mode_button);
        }

        // Check in
        if (member && display_check_in_button) {
            function check_in() {
                const check_in = document.getElementsByClassName('check-in')[0];
                check_in.innerHTML = '正在签到';
                check_in.disabled = true;
                check_in.classList.add('button-disabled');
                setTimeout(() => {
                    let message = '签到完成';
                    check_in.innerHTML = message;
                    if (site != 'KAFAN') show_dialog(message)
                }, 1234);

                if (site === 'PCBETA') {
                    window.open('//i.pcbeta.com/home.php?mod=task&do=apply&id=149');
                    return false;
                }

                if (site === 'KAFAN') {
                    showWindow('dsu_amupper', 'plugin.php?id=dsu_amupper&ppersubmit=true&formhash=' + document.getElementsByName('formhash')[0].value);
                    return false;
                }

                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        let request = new XMLHttpRequest();
                        let space = './home.php?mod=task&do=apply&id='.concat(i);
                        request.open('get', space);
                        request.send();
                    }, i * 100);
                }

                if (site === 'HOSTLOC') {
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            let request = new XMLHttpRequest();
                            let space = '//www.hostloc.com/space-uid-'.concat(Math.ceil(Math.random() * 47000 + 100), '.html');
                            request.open('get', space);
                            request.send();
                        }, i * 100 + 1000);
                    }
                }
            }
            const check_in_button = document.createElement('button');
            check_in_button.className = 'custom-function-button check-in';
            check_in_button.innerHTML = '每日签到';
            check_in_button.addEventListener('click', check_in, false);
            function_buttons.appendChild(check_in_button);
        }

        function_buttons_package.appendChild(function_buttons);
    }

    // Execution as Create Button Group
    create_button_group();

    // Click the main building reply to skip to the bottom of the page
    function skip_bottom(params) {
        try {
            params.removeAttribute('onclick');
            params.addEventListener('click', function (event) {
                params.href = 'javascript:;';
                window.scrollTo(0, 54321);
                let fastPostMessage = document.getElementById('fastpostmessage');
                !!fastPostMessage && fastPostMessage.focus();
            }, false);
        } catch (error) {
            GM_log('You don\'t have permission to post content.');
        }
    }
    if (document.getElementsByClassName('prev').length === 0) {
        const locked = member && document.getElementsByClassName('locked');
        if (typeof locked === 'object' && !!locked.length) {
            for (let i = 0; i < locked.length; i++) {
                skip_bottom(locked[i].getElementsByTagName('a')[0]);
            }
        }
        const fastre = member && document.getElementsByClassName('fastre')[0];
        !!fastre && skip_bottom(fastre);
    }


    function get_attach_content() {
        switch (site) {
            case 'KAFAN':
                return '';
            case 'HOSTLOC':
                return '󠀠'.repeat(10);
            default:
                return '\n\n[img]' + window.location.protocol + '//herder.cdn.bcebos.com/images/dot.gif[/img]';
        }
    }

    const attachContent = get_attach_content();

    const fastPostMessage = document.getElementById('fastpostmessage');

    function editor_content() {
        let fastPostMessageContent = fastPostMessage.value;
        if (fastPostMessageContent && fastPostMessageContent.length < 20) {
            fastPostMessageContent = fastPostMessageContent.trim();
            fastPostMessage.style.opacity = '0';
            fastPostMessage.value = fastPostMessageContent.concat(attachContent);
            setTimeout(() => {
                fastPostMessage.value = fastPostMessageContent;
                fastPostMessage.style.opacity = '1';
            }, 100);
        }
    }

    !!fastPostMessage && fastPostMessage.removeAttribute('onkeydown');

    !!fastPostMessage && fastPostMessage.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.which === 13) {
            editor_content();
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
        if (event.altKey && event.which === 83) {
            editor_content();
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
    }, false);

    const fastPostSubmit = document.getElementById('fastpostsubmit');
    !!fastPostSubmit && fastPostSubmit.addEventListener('click', editor_content, false);


    // Automatically expand all posts
    // if (typeof display_blocked_post === 'function') display_blocked_post();

    // Display Emoji
    if (GLOBAL_CONFIG.display_emoji) {
        const post = document.getElementsByClassName('t_f');
        for (let i = 0; i < post.length; i++) {
            post[i].innerHTML = post[i].innerHTML.replace(/\&amp;#.*?;/g, function (char) {
                if (char.length === 13) {
                    return String.fromCodePoint(parseInt(char.match(/[0-9]+/)));
                }
                return char;
            }
            );
        }
    }

    // Compatibility settings

    // Cascading Style Sheets・www.hostloc.com
    site === 'HOSTLOC' && GM_addStyle(`
        #hiddenpoststip {
            padding: 0;
        }

        #hiddenpoststip a {
            height: 32px;
            line-height: 32px;
            font-size: 16px;
        }

        #hiddenpoststip a:hover {
            color: #f33;
        }

        #hiddenpoststip a::before {
            padding-right: 8px;
            content: "🌜";
        }

        #hiddenpoststip a::after {
            padding-left: 8px;
            content: "🌛";
        }
    `);

    // Cascading Style Sheets・bbs.pcbeta.com
    if (site === 'PCBETA') {
        GM_addStyle(`
            #wp > div:first-child  {
                display: none !important;
            }

            #wp > div,
            #nv_forum > span,
            .pls .tip,
            ignore_js_op .tip {
                display: none;
            }

            #wp > div.cl,
            #wp > div.wp,
            #nv_forum #scrolltop {
                display: block;
            }

            .pls .avatar {
                overflow: unset;
            }

            .pb_pls .avatar img {
                border-radius: 50%;
                background: none;
                -webkit-transition: 0.5s;
                -moz-transition: 0.5s;
                -ms-transition: 0.5s;
                -o-transition: 0.5s;
                transition: 0.5s;
            }

            .pb_pls .avatar img:hover {
                border-radius: 0;
            }

            .hdc {
                position: relative;
            }

            .function-buttons {
                position: absolute;
                right: 0;
                padding: 0 8px 4px 0;
            }

            .custom-function-button {
                margin: 0 4px;
            }

            .wp .pgs {
                -moz-user-select: none;
                -ms-user-select: none;
                -webkit-user-select: none;
                user-select: none;
            }
        `);
    }

    // Cascading Style Sheets・bbs.fobshanghai.com
    site === 'FOBSHANGHAI' && GM_addStyle(`
        #function-buttons.function-buttons {
            padding-top: 48px !important;
        }

        .maintable > .spaceborder > table:first-child,
        .line div,
        .t_infoline .line {
            display: none;
        }

        #aaaa {
            display: block;
        }

        .mainheader {
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;
            user-select: none;
        }
    `);

    // Cascading Style Sheets・bbs.360.cn
    site === '360' && GM_addStyle(`
        .custom-function-button {
            margin-top: -20px;
            padding: 0 8px;
        }

        .apk-download,
        .apk-download-pannel,
        .pls .tip,
        ignore_js_op .tip {
            display: none;
        }

        .pls .avatar img {
            width: 54px;
            height: 54px;
            border: none;
            border-radius: 50% !important;
            box-shadow: 0 0 2px #bbb !important;
        }

        .pls .avatar img:hover {
            border-radius: 0 !important;
        }
    `);
})();
