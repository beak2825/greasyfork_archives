// ==UserScript==
// @name         Forum Master・Discuz! Revision
// @name:en      Forum Master・Discuz! Revision
// @name:zh-CN   论坛大师・Discuz！修改版
// @name:zh-TW   論壇大師・Discuz！修改版
// @namespace    Forum Master・Discuz!-mxdh (Update by wwwab)
// @version      1.5.5
// @icon         https://discuz.dismall.com/favicon.ico
// @description  Forum Master - Discuz!　Beautify the interface, Remove ads, Enhance functions.
// @description:en    Forum Master - Discuz!　Beautify the interface, Remove ads, Enhance functions.
// @description:zh-CN 论坛大师（简体中文）・Discuz!　界面美化、移除广告、功能增强……
// @description:zh-TW 論壇大師（繁體中文）・Discuz!　界面美化、移除廣告、功能增強……
// @author       hostname,mxdh,wwwab
// @match        http://*/forum-*.html
// @match        http://*/thread-*.html
// @match        http://*/viewthread-*.html
// @match        http://*/fourm/thread-*.html
// @match        http://*/space-uid-*.html
// @match        http://*/forum.php?mod=*
// @match        http://*/home.php?mod=*
// @match        http://*/archiver/fid-*.html
// @match        http://*/archiver/?fid-*.html
// @match        http://*/archiver/tid-*.html
// @match        http://*/archiver/?tid-*.html
// @match        http://*/dsu_paulsign-sign.html
// @match        https://*/forum-*.html
// @match        https://*/thread-*.html
// @match        https://*/viewthread-*.html
// @match        https://*/forum/thread-*.html
// @match        https://*/space-uid-*.html
// @match        https://*/forum.php?mod=*
// @match        https://*/home.php?mod=*
// @match        https://*/archiver/fid-*.html
// @match        https://*/archiver/?fid-*.html
// @match        https://*/archiver/tid-*.html
// @match        https://*/archiver/?tid-*.html
// @match        https://*/dsu_paulsign-sign.html
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/511735/Forum%20Master%E3%83%BBDiscuz%21%20Revision.user.js
// @updateURL https://update.greasyfork.org/scripts/511735/Forum%20Master%E3%83%BBDiscuz%21%20Revision.meta.js
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

        // Posts' sortord: 'unlocked', 'lastpost', 'threadcreate'(author dateline)
        // 主题帖排序方式: 'unlocked, 'lastpost', 'threadcreate'(author dateline)
        // 主題帖排序方式: 'unlocked, 'lastpost', 'threadcreate'(author dateline)
        thread_sortord: 'unlocked',

        // Lock the skin style: true/false
        // 固定皮肤样式: true/false
        // 固定皮膚樣式: true/false
        lock_skin: false,

        // Clean posts' format: true/false
        // 清除帖子格式: true/false
        // 清除帖子格式: true/false
        clean_post: false,

        // Display the users' online status: 'None', 'Standard', 'Advanced'
        // 显示用户的在线状态: 'None', 'Standard', 'Advanced'
        // 顯示用戶的在線狀態: 'None', 'Standard', 'Advanced'
        detection_mode: 'Advanced',

        // 小圆点(Small Dot): 'mode1'
        // Emoji or 文本(Text): 'mode2'
        standard_mode_detection_display_style: 'mode1',
        advanced_mode_detection_display_style: 'mode2',

        // Text Beautification: true/false
        // 文本字體美化: true/false
        // 文字字体美化: true/false
        text_beautification: true,

        // Code Beautification: true/false
        // 代码美化：true/false
        // 程式碼美化：true/false
        code_beautification: true,

        // text_size_linespacing_adjust in posts: true/false
        // 帖子文字大小行距优化: true/false
        // 帖子文本大小行距優化: true/false
        textsize_linespacing_adjust: true,
        line_height: '30px',
        font_size: '18px',

        // Block Baidu_tongji code: true/false
        // 屏蔽百度统计: true/false
        // 屏蔽百度統計: true/false
        block_baidu_hm: true,

        // Turn the avatar to high definition (Apply big size avatar): true/false
        // 头像转为高清晰度: true/false
        // 頭像轉為高清晰度: true/false
        big_size_avatar: true,

        // Picture Optimization (Overwrite the thumb picture into big size picture): true/false
        // 图片优化(将预览图覆盖为大图): true/false
        // 圖片優化(將預覽圖覆蓋為大圖): true/false
        picture_optimization: true,

        // Theme beautification: true/false
        // 主题美化: true/false
        // 主題美化: true/false
        theme_beautification: false,

        // Warning record query button: true/false
        // 警告记录查询按钮: true/false
        // 警告記錄查詢按鈕: true/false
        show_warning_record_button: false,

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


    // Message Edit Settings · Start
    const Message_Edit_CONFIG = {

        // Bypass the word limit of reply: true/false
        // 回帖字数限制绕过: true/false
        // 回帖字數限制繞過: true/false
        word_count_limit_bypass: true,

        // Add a tail automatically at the end of the reply: true/false; Tail content: Text
        // 回帖小尾巴: true/false；回帖小尾巴内容: Text
        // 回帖小尾巴: true/false；回帖小尾巴內容: Text
        reply_tail: false,
        reply_tail_content: '  喵～',

        // Add a prefix automatically at the end of the reply: true/false; Prefix content: Text
        // 回帖小前缀: true/false；回帖小前缀内容: Text
        // 回帖小前綴: true/false；回帖小前綴内容: Text
        reply_prefix: false,
        reply_prefix_content: '',

        // Enable in the private messages post: true/false
        // 在私信中启用: true/false
        // 在私信中啟用: true/false
        private_messages_Enable: false,

        // Enable in the comment messages post: true/false
        // 在点评中启用: true/false
        // 在點評中啟用: true/false
        comment_messages_Enable: false,

    }
    // Message Edit Settings · End


    // Below is the core code

    // Host Name
    const hn = window.location.hostname;

    // Path Name ("/<.<")
    const pn = window.location.pathname;
    // Search Name ("?*)
    const sn = window.location.search;

    function get_page_type() {
        const forum_page_regex_pn = /^\/forum-.*\.html$/;
        const forum_page_regex_sn = /^\?.*forumdisplay.*$/;
        const thread_page_regex_pn = /^\/thread-.*\.html$|^\/viewthread-.*\.html$/;
        const thread_page_regex_sn = /^\?.*viewthread.*$/;
        if (forum_page_regex_pn.test(pn) || forum_page_regex_sn.test(sn)) {
            return 'forum page';
        }
        if (thread_page_regex_pn.test(pn) || thread_page_regex_sn.test(sn)) {
            return 'thread page';
        }
    }
    const page_type = get_page_type();

    function get_page_id() {
        const forum_page_id_regex_pn = /forum-(\d+(?![\d]))-/;
        const forum_page_id_regex_sn = /fid=(\d+(?![\d]))/;
        const thread_page_id_regex_pn = /thread-(\d+(?![\d]))-/;
        const thread_page_id_regex_sn = /tid=(\d+(?![\d]))/;
        if (page_type === 'forum page' && forum_page_id_regex_pn.test(pn)) {
            return pn.match(forum_page_id_regex_pn)[1];
        }
        if (page_type === 'forum page' && forum_page_id_regex_sn.test(sn)) {
            return sn.match(forum_page_id_regex_sn)[1];
        }
        if (page_type === 'thread page' && thread_page_id_regex_pn.test(pn)) {
            return pn.match(thread_page_id_regex_pn)[1];
        }
        if (page_type === 'thread page' && thread_page_id_regex_sn.test(sn)) {
            return sn.match(thread_page_id_regex_sn)[1];
        }
    }
    const page_id = get_page_id();

    function get_site_pos() {
        if (!!~hn.indexOf('.com.cn')) return -3;
        if (!!~hn.indexOf('.net.cn')) return -3;
        if (!!~hn.indexOf('.org.cn')) return -3;
        return -2;
    }

    const site_pos = get_site_pos();
    const site = hn.split('.').slice(site_pos, site_pos + 1).join().toUpperCase();

    GM_log(`Site name: ${site}`);

    // Scene mode: Standard, Family, Office
    var scene_mode = GM_getValue(site + '_SCENE_MODE') || GLOBAL_CONFIG.scene_mode;

    // Display the users online status
    // GM_deleteValue(site + '_DETECTION_MODE');
    var detection_mode = GM_getValue(site + '_DETECTION_MODE') || GLOBAL_CONFIG.detection_mode;

    // Clean posts' format
    var clean_post = GM_getValue(site + '_CLEAN_POST') || GLOBAL_CONFIG.clean_post;

    var lock_skin = GM_getValue(site + '_LOCK_SKIN') || GLOBAL_CONFIG.lock_skin;

    var thread_sortord = GM_getValue(site + '_THREAD_SORTORD') || GLOBAL_CONFIG.thread_sortord;

    // Test code
    const ua = window.navigator.userAgent;
    GM_log(`User-Agent: ${ua}`);

    GM_log(`Scene mode: ${scene_mode} (${typeof scene_mode})`);
    GM_log(`Detection mode: ${detection_mode} (${typeof detection_mode})`);

    const thread_sortord_dic = {
        unlocked: '未锁定',
        lastpost: '最后回复时间', 
        threadcreate: '发帖时间'
    }

    const thread_sortord_cutover_dic = {
        unlocked: 'lastpost',
        lastpost: 'threadcreate',
        threadcreate: 'unlocked'
    }

    const lock_skin_dic = {
        false: '关闭',
        true: '开启'
    }

    const lock_skin_cutover_dic = {
        false: true,
        true: false
    }

    const clean_post_dic = {
        false: '关闭',
        true: '开启'
    }

    const clean_post_cutover_dic = {
        false: true,
        true: false
    }

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

    if (GLOBAL_CONFIG.text_beautification) {
        GM_addStyle(`
            body, table, input, button, select, textarea, a {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei New", "Microsoft Yahei", "WenQuanYi Micro Hei", "Noto Sans CJK", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            }
        `)
    }

    if (GLOBAL_CONFIG.code_beautification) {
        GM_addStyle(`
            .mono, .md, .code, .pre, .tt, mono, md, code, pre, tt,
            .blockcode ol li {
                font-family: "Fira Code", Hack, "Source Code Pro", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Microsoft YaHei Mono", "WenQuanYi Zen Hei Mono", "Noto Sans Mono CJK", monospace !important;
            }
        `)
    }

    if (GLOBAL_CONFIG.textsize_linespacing_adjust) {
        let style = `.t_f { line-height: ${GLOBAL_CONFIG.line_height};font-size: ${GLOBAL_CONFIG.font_size};}`
        GM_addStyle(style);
    }

    if (clean_post) {
        GM_addStyle(`
            .t_f font{
                font-size:inherit !important;
                color:inherit !important;
                background-color:inherit !important;
                font-family:inherit !important;
            }
            .t_f u{
                text-decoration:inherit !important;
            }
            .t_f strong{
                font-weight:inherit !important;
            }
            .t_f i{
                font-style:inherit !important;
            }
            .plhin {
                background: none !important;
            }
        `)
    }

    // Login status
    const member = !!document.getElementById('extcreditmenu') || !!document.getElementById('myprompt') || !!document.getElementById('myrepeats') || !!document.querySelector('*[title="访问我的空间"]');

    GM_log(`Login status: ${member}`);

    // Default avatar
    function default_avatar() {
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
                    content: url('//uc.huorong.cn/images/noavatar_middle.gif');
                }

                #um .avt img,
                #tath img,
                .rate table img,
                .cm .vm img,
                .card_mn .avt img {
                    content: url('//uc.huorong.cn/images/noavatar_small.gif');
                }
            `);
        }
    }

    function default_big_size_avatar() {
        if (site === '52POJIE') {
            GM_addStyle(`
                .pls .avatar img,
                .avtm img,
                #um .avt img,
                #tath img,
                .rate table img,
                .cm .vm img,
                .card_mn .avt img {
                    content: url('//avatar.52pojie.cn/images/noavatar_big.gif');
                }
            `);
        } else {
            GM_addStyle(`
                .pls .avatar img,
                .avtm img,
                #um .avt img,
                #tath img,
                .rate table img,
                .cm .vm img,
                .card_mn .avt img {
                    content: url('//uc.huorong.cn/images/noavatar_big.gif');
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
            if (GLOBAL_CONFIG.big_size_avatar) {
                default_big_size_avatar();
            } else {
                default_avatar();
            }
            // Set as Default avatar for Family attach
            default_avatar_for_family_attach();
            break;

        case 'Office':
            // Set as Default avatar
            if (GLOBAL_CONFIG.big_size_avatar) {
                default_big_size_avatar();
            } else {
                default_avatar();
            }
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
                if (GLOBAL_CONFIG.advanced_mode_detection_display_style === 'mode2') {
                    span.className = status ? 'user-status-expression user-status-expression-online' : 'user-status-expression user-status-expression-offline';
                } else {
                    span.className = status ? 'user-online-status online gol' : 'user-online-status offline gol';
                }
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
                        div.title = '当前在线';
                        if (GLOBAL_CONFIG.standard_mode_detection_display_style === 'mode1') {
                            div.className = 'user-online-status online gol';
                        } else {
                            div.className = 'user-status-expression user-status-expression-online'
                        }
                        avatar[i].appendChild(div);
                    } else {
                        let div = document.createElement('div');
                        div.title = '当前离线';
                        if (GLOBAL_CONFIG.standard_mode_detection_display_style === 'mode1') {
                            div.className = 'user-online-status offline gol';
                        } else {
                            div.className = 'user-status-expression user-status-expression-offline'
                        }
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

    function warning_record_button() {
        const pls_favatar = document.getElementsByClassName('pls favatar');
        const avatar = document.getElementsByClassName('avatar');
        const info = document.getElementsByClassName('i');
        for (let i = 0; i < info.length; i++) {
            setTimeout(() => {
                let html = avatar[i].innerHTML;
                let id = /\d/.test(html) ? html.match(/\d+/)[0] : info[i].innerHTML.match(/\d+/)[0];
                let a = document.createElement('a');
                a.title = "viewwarning_main";
                a.href = `forum.php?mod=misc&action=viewwarning&tid=${page_id}&uid=${id}`;
                a.setAttribute("onclick", "showWindow('viewwarning', this.href)");
                avatar[i].appendChild(a);
                a.style.display = 'none';

                let b = document.createElement('b');
                b.textContent = "查看警告记录";
                b.title = "viewwarning_display";
                b.className = "custom-function-button";
                let html2 = pls_favatar[i].innerHTML;
                pls_favatar[i].appendChild(b);
                b.addEventListener('click', () => {
                    a.click();
                });
            }, 1000);
        }
    }
    if (GLOBAL_CONFIG.show_warning_record_button && page_type === 'thread page') {
        warning_record_button();
    }

    // Execution as Show users online status
    if (member && page_type === 'thread page') {
        show_users_online_status();
    } else if ((site === 'PCBETA' || site === 'DOSPY' || site === '17500') && (page_type === 'thread page')) {
        detection_mode = 'Standard';
        show_users_online_status();
    }

    var display_check_in_button = true;
    var display_lock_skin_button = false;

    if (member && (site === 'KAFAN')) {
        let imgElement = document.querySelector('#pper_a .qq_bind');
        if (imgElement) {
            let src = imgElement.src;
            if (src.includes('wb.png')) {
                GM_log('Check-in status: have been checked in.');
            } else if (src.includes('dk.png')) {
                imgElement.click();
                GM_log('Automatic Check-in: Successful Check-in.');
            }
            display_check_in_button = false;
        }
    }

    if (member && (site === '52POJIE')) {
        let link = document.querySelector('a[href*="home.php?mod=task&do=apply&id=2"]');
        if (link) {
            let imgElement = link.querySelector('.qq_bind')
            if (imgElement) {
                let src = imgElement.src;
                if (src.includes('wbs.png')) {
                    GM_log('Check-in status: have been checked in.');
                } else if (src.includes('qds.png')) {
                    imgElement.click();
                    GM_log('Automatic Check-in: Successful Check-in.');
                }
            }
        }
        display_check_in_button = false;
    }

    if (member && (site === 'X64BBS')) {
        let link = document.querySelector('a[href*="plugin.php?id=study_daily_attendance:daily_attendance"]');
        if (link) {
            let fontElement = Array.from(link.querySelectorAll('font')).find(font => 
                font.style.color === 'red' && font.textContent.includes('打卡签到')
            );
            if (fontElement) {
                GM_log('找到了"打卡签到"元素');
                fontElement.click();
                GM_log('Automatic Check-in: Successful Check-in.');
            }
        }
        display_check_in_button = false;
    }

    if (site === 'KAFAN') {
        display_lock_skin_button = true;
    }

    if (lock_skin) {
        if (site === 'KAFAN') {
            let cssLink1 = document.createElement('link');
            cssLink1.rel = 'stylesheet';
            cssLink1.type = 'text/css';
            cssLink1.href = 'https://bbs.kafan.cn/template/comeing_city/style/t13/style.css';
            document.head.appendChild(cssLink1);

            let cssLink2 = document.createElement('link');
            cssLink2.rel = 'stylesheet';
            cssLink2.type = 'text/css';
            cssLink2.href = 'https://a.kafan.cn/static/template/comeing_city/style/t13/style.css?b33';
            document.head.appendChild(cssLink2);
        }
    }

    if (GLOBAL_CONFIG.block_baidu_hm) {
        const scriptsToRemove1 = document.querySelectorAll('script[src*="hm.baidu.com"]');
        if (scriptsToRemove1.length > 0) {
            GM_log("Found baidu_tongji code.");
        }
        scriptsToRemove1.forEach(function(script) {
            script.remove();
            GM_log("Remove baidu_tongji code successfully.")
        });
    }

    switch (thread_sortord) {
        case 'unlocked':
            break;

        case 'lastpost':
            if (page_type === 'forum page') {
                if (!window.location.search.includes("filter=lastpost&orderby=lastpost")) {
                    const lastpost = document.querySelector('a[href*="filter=lastpost&orderby=lastpost"]');
                    window.location.href = lastpost;
                }
            }
            break;

        case 'threadcreate':
            if (page_type === 'forum page') {
                if (!window.location.search.includes("filter=author&orderby=dateline")) {
                    const threadcreate = document.querySelector('a[href*="filter=author&orderby=dateline"]');
                    window.location.href = threadcreate;
                }
            }
            break;

        default:
            break;
    }

    if (site === 'HUORONG' || site === 'DOSPY') display_check_in_button = false;

    function applyInlineStyle(id) {
        const root = document.getElementById(id);
        if (!root) return;
  
        const elements = root.querySelectorAll('*:not(script)');
        elements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.display === 'none') return;
            el.style.setProperty('display', 'inline', 'important');
        });
    }

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
                applyInlineStyle('um');
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
        if (page_type === 'thread page') {
            const scene_mode_button = document.createElement('button');
            scene_mode_button.className = 'custom-function-button scene-mode-button';
            scene_mode_button.innerHTML = scene_mode_dic[scene_mode];
            scene_mode_button.addEventListener('mouseenter', scene_mode_mouseenter, false);
            scene_mode_button.addEventListener('click', scene_mode_switch, false);
            function_buttons.appendChild(scene_mode_button);
        }

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
        if (member && page_type === 'thread page') {
            const detection_mode_button = document.createElement('button');
            detection_mode_button.className = 'custom-function-button detection-mode-button';
            detection_mode_button.innerHTML = '探测模式：' + detection_mode_dic[detection_mode];
            detection_mode_button.addEventListener('mouseenter', detection_mode_mouseenter, false);
            detection_mode_button.addEventListener('click', detection_mode_switch, false);
            function_buttons.appendChild(detection_mode_button);
        }

        // Clean post button
        function clean_post_mouseenter() {
            clean_post = GM_getValue(site + '_CLEAN_POST') || clean_post;
            this.innerHTML = '清除格式：' + clean_post_dic[clean_post];
        }
        function clean_post_switch() {
            this.disabled = true;
            this.classList.add('button-disabled');
            clean_post = clean_post_cutover_dic[clean_post];
            this.innerHTML = '清除格式：' + clean_post_dic[clean_post];
            GM_setValue(site + '_CLEAN_POST', clean_post);
            if (GLOBAL_CONFIG.auto_reload) {
                window.location.reload();
                return;
            }
            let message = '清除格式模式切换成功，刷新页面即可进入 <span style="color: var(--info);">' + clean_post_dic[clean_post] + '</span>。';
            show_dialog(message);
            this.classList.remove('button-disabled');
        }
        if (page_type === 'thread page') {
            const clean_post_button = document.createElement('button');
            clean_post_button.className = 'custom-function-button clean-post-button';
            clean_post_button.innerHTML = '清除格式：' + clean_post_dic[clean_post];
            clean_post_button.addEventListener('mouseenter', clean_post_mouseenter, false);
            clean_post_button.addEventListener('click', clean_post_switch, false);
            function_buttons.appendChild(clean_post_button);
        }

        // Lock skin button
        function lock_skin_mouseenter() {
            lock_skin = GM_getValue(site + '_LOCK_SKIN') || lock_skin;
            this.innerHTML = '锁定样式：' + lock_skin_dic[lock_skin];
        }
        function lock_skin_switch() {
            this.disabled = true;
            this.classList.add('button-disabled');
            lock_skin = lock_skin_cutover_dic[lock_skin];
            this.innerHTML = '锁定样式：' + lock_skin_dic[lock_skin];
            GM_setValue(site + '_LOCK_SKIN', lock_skin);
            if (GLOBAL_CONFIG.auto_reload) {
                window.location.reload();
                return;
            }
            let message = '锁定样式模式切换成功，刷新页面即可进入 <span style="color: var(--info);">' + clean_post_dic[clean_post] + '</span>。';
            show_dialog(message);
            this.classList.remove('button-disabled');
        }
        if (display_lock_skin_button) {
            const lock_skin_button = document.createElement('button');
            lock_skin_button.className = 'custom-function-button lock-skin-button';
            lock_skin_button.innerHTML = '锁定样式：' + lock_skin_dic[lock_skin];
            lock_skin_button.addEventListener('mouseenter', lock_skin_mouseenter, false);
            lock_skin_button.addEventListener('click', lock_skin_switch, false);
            function_buttons.appendChild(lock_skin_button);
        }

        // Thread sortord button
        function thread_sortord_mouseenter() {
            lock_skin = GM_getValue(site + '_THREAD_SORTORD') || thread_sortord;
            this.innerHTML = '主题帖排序方式：' + thread_sortord_dic[thread_sortord];
        }
        function thread_sortord_switch() {
            this.disabled = true;
            this.classList.add('button-disabled');
            thread_sortord = thread_sortord_cutover_dic[thread_sortord];
            this.innerHTML = '主题帖排序方式：' + thread_sortord_dic[thread_sortord];
            GM_setValue(site + '_THREAD_SORTORD', thread_sortord);
            if (GLOBAL_CONFIG.auto_reload) {
                window.location.reload();
                return;
            }
            let message = '主题帖排序方式模式切换成功，刷新页面即可进入 <span style="color: var(--info);">' + clean_post_dic[clean_post] + '</span>。';
            show_dialog(message);
            this.classList.remove('button-disabled');
        }
        if (page_type === 'forum page') {
            const thread_sortord_button = document.createElement('button');
            thread_sortord_button.className = 'custom-function-button thread-sortord-button';
            thread_sortord_button.innerHTML = '主题帖排序方式：' + thread_sortord_dic[thread_sortord];
            thread_sortord_button.addEventListener('mouseenter', thread_sortord_mouseenter, false);
            thread_sortord_button.addEventListener('click', thread_sortord_switch, false);
            function_buttons.appendChild(thread_sortord_button);
        }

        function check_in_plugin_scan() {
            let plugin_id_array = [
                'study_daily_attendance:daily_attendance',
                'dsu_amupper',
                'k_misign:sign',
                'dsu_paulsign:sign',
            ];
            for (let i = 0; i < plugin_id_array.length; i++) {
                let request = new XMLHttpRequest();
                let space = 'plugin.php?id=' + plugin_id_array[i];
                request.open('GET', space, false);
                try {
                    request.send();
                    if (request.status >= 200 && request.status < 300) {
                        const resp = request.responseText || '';
                        if (!resp.includes('插件不存在') && !resp.includes('已关闭')) {
                            GM_log(`Found check-in plugin: ${plugin_id_array[i]}`);
                            return plugin_id_array[i];
                        }
                    }
                } catch (e) {
                    return null;
                }
            }

            let req2 = new XMLHttpRequest();
            req2.open('GET', 'dsu_paulsign-sign.html', false);
            try {
                req2.send();
                if (req2.status >= 200 && req2.status < 300) {
                    GM_log(`Found check-in plugin: dsu_paulsign:sign`);
                    return 'dsu_paulsign:sign';
                }
            } catch (e) {
                return null;
            }

            return null;
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
                    show_dialog(message)
                }, 1234);

                let plugin_id = check_in_plugin_scan();
                switch (plugin_id) {
                    case 'study_daily_attendance:daily_attendance':
                        showWindow('study_daily_attendance', 'plugin.php?id=study_daily_attendance:daily_attendance&fhash=' + document.getElementsByName('formhash')[0].value);
                        return false;
                    case 'dsu_amupper':
                        showWindow('dsu_amupper', 'plugin.php?id=dsu_amupper&ppersubmit=true&formhash=' + document.getElementsByName('formhash')[0].value);
                        return false;
                    case 'k_misign:sign':
                        showWindow('msi_sign', 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + document.getElementsByName('formhash')[0].value + '&format=empty&inajax=1&ajaxtarget=JD_sign');
                        return false;
                    case 'dsu_paulsign:sign':
                        setTimeout(() => {
                            let request = new XMLHttpRequest();
                            let space = 'plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1';
                            let form = new FormData();
                            form.append('formhash', document.getElementsByName('formhash')[0].value);
                            form.append('qdxq', 'kx');
                            form.append('qdmode', '1');
                            form.append('todaysay', '签到咯~~~');
                            form.append('fastreply', '0');
                            request.open('POST', space);
                            request.send(form);
                        }, 1000);
                        return false;
                    default:
                        break;
                }

                if (site === 'PCBETA') {
                    window.open('//i.pcbeta.com/home.php?mod=task&do=apply&id=149');
                    return false;
                }
                if (site === '52POJIE') {
                    window.open('//www.52pojie.cn/home.php?mod=task&do=apply&id=2');
                    return false;
                }
                /* 
                if (site === 'X64BBS') {
                    showWindow('study_daily_attendance', 'plugin.php?id=study_daily_attendance:daily_attendance&fhash=' + document.getElementsByName('formhash')[0].value);
                    return false
                }
                if (site === 'KAFAN') {
                    showWindow('dsu_amupper', 'plugin.php?id=dsu_amupper&ppersubmit=true&formhash=' + document.getElementsByName('formhash')[0].value);
                    return false;
                }
                if (site === 'MSI') {
                    showWindow('msi_sign', 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + document.getElementsByName('formhash')[0].value = '&format=empty&inajax=1&ajaxtarget=JD_sign');
                    return false;
                }
                if (site === 'TAMPERMONKEY') {
                    setTimeout(() => {
                        let request = new XMLHttpRequest();
                        let space = 'plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1';
                        let form = new FormData();
                        form.append('formhash', document.getElementsByName('formhash')[0].value);
                        form.append('qdxq', 'kx');
                        form.append('qdmode', '1');
                        form.append('todaysay', '签到咯~~~');
                        form.append('fastreply', '0');
                        request.open('POST', space);
                        request.send(form);
                    }, 1000);
                    return false;
                }
                */ 

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
        const fastre = member && document.getElementsByClassName('fastre')[0];
        !!fastre && skip_bottom(fastre);
        const replyfast = member && document.getElementsByClassName('replyfast')[0];
        !!replyfast && skip_bottom(replyfast);
    }


    // Message_Edit_Module(1) · Start
    function get_WordCountLimitBypass_Attach_Content() {
        switch (site) {
            case 'KAFAN':
                return '';
            case '52POJIE':
                return '';
            case 'HOSTLOC':
                return '󠀠'.repeat(10);
            default:
                return '\r\n[color=#ffffff][size=1]插入空白字符以填充字数[/size][/color]'; // 默认为纯白色字体的"插入空白字符以填充字数"
        }
    }

    if (Message_Edit_CONFIG.word_count_limit_bypass) {
        var WordCountLimitBypass_AttachContent = get_WordCountLimitBypass_Attach_Content();
    } else {
        var WordCountLimitBypass_AttachContent = '';
    }
    // Message_Edit_Module(1) · End


    // Message_Edit_Module(2) · Start
    function editor_content(Message, ifWordCountLimit) {
        let OriginalMessageContent = Message.value;
        let NewMessageContent = OriginalMessageContent.trim();
        // 先加前缀
        if (Message_Edit_CONFIG.reply_prefix && OriginalMessageContent && Message_Edit_CONFIG.reply_prefix_content) {
            NewMessageContent = Message_Edit_CONFIG.reply_prefix_content.concat(NewMessageContent);
        }
        // 再加尾巴
        if (Message_Edit_CONFIG.reply_tail && OriginalMessageContent && Message_Edit_CONFIG.reply_tail_content) {
            NewMessageContent = NewMessageContent.concat(Message_Edit_CONFIG.reply_tail_content);
        }
        // 最后加字数补丁
        if (Message_Edit_CONFIG.word_count_limit_bypass && OriginalMessageContent && OriginalMessageContent.length < 20 && WordCountLimitBypass_AttachContent && ifWordCountLimit === 1) {
            NewMessageContent = NewMessageContent.concat(WordCountLimitBypass_AttachContent);
        }
        Message.style.opacity = '0';
        Message.value = `${NewMessageContent}`;
        setTimeout(() => {
            Message.value = OriginalMessageContent;
            Message.style.opacity = '1';
        }, 100);
    }
    // Message_Edit_Module(2) · End


    // Message_Edit_Module(3) · Start
    const fastPostMessage = document.getElementById('fastpostmessage');

    !!fastPostMessage && fastPostMessage.removeAttribute('onkeydown');

    !!fastPostMessage && fastPostMessage.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.which === 13) {
            editor_content(fastPostMessage, 1);
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
        if (event.altKey && event.which === 83) {
            editor_content(fastPostMessage, 1);
            seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
        }
    }, false);

    const fastPostSubmit = document.getElementById('fastpostsubmit');
    !!fastPostSubmit && fastPostSubmit.addEventListener('click', () => {
        editor_content(fastPostMessage, 1);
    }, false);


    // private_messages_edit_1
    if (Message_Edit_CONFIG.private_messages_Enable) {
        const replyMessage = document.getElementById('replymessage');
        const pmSubmit = document.getElementById('pmsubmit');
        !!pmSubmit && pmSubmit.addEventListener('click', () => {
            editor_content(replyMessage, 1);
        }, false);
    }
    // Message_Edit_Module(3) · End


    // Message_Edit_Module(4) · Start
    function WindowProcessing(windowId,MessageId,SubmitButtonId,type,ifWordCountLimit) {
        // 使用MutationObserver等待窗口和元素的出现
        const observer = new MutationObserver((mutations, obs) => {
            const window = document.getElementById(windowId);
            const Message = document.getElementById(MessageId);
            const SubmitButton = document.getElementById(SubmitButtonId);
            if (window && Message && SubmitButton && !SubmitButton.__eventBound) {
                SubmitButton.__eventBound = true; // 标记SubmitButton已经绑定了事件监听器
                SubmitButton.addEventListener('click', () => {
                    switch (type) {
                        case 0:
                            GM_log('postsubmit被点击');
                            break;
                        case 1:
                            GM_log('pmsubmit_btn被点击');
                            break;
                        case 2:
                            GM_log('commentsubmit被点击');
                            break;
                        default:
                            break;
                    }
                    editor_content(Message,ifWordCountLimit);
                    ResetState(SubmitButton);
                }, false);
                obs.disconnect(); // 断开观察者
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    function ResetState(SubmitButtonId) {
        // 重置监听状态
        const SubmitButton = document.getElementById(SubmitButtonId);
        if (SubmitButton) {
            delete SubmitButton.__eventBound; // 移除标记以允许再次监听
        }
    }
    function Execute_Message_Edit_Module4() {
        if (page_type === 'thread page') {
            WindowProcessing('fwin_content_reply','postmessage','postsubmit',0,1);
        }

        // private_messages_edit_2
        if (Message_Edit_CONFIG.private_messages_Enable && page_type === 'thread page') {
            WindowProcessing('fwin_content_sendpm','pmmessage','pmsubmit_btn',1,1);
        }

        // comment_message_edit
        if (Message_Edit_CONFIG.comment_messages_Enable && page_type === 'thread page') {
            WindowProcessing('fwin_content_comment','commentmessage','commentsubmit',2,0);
        }
    }
    document.addEventListener('click', function(event) {
        Execute_Message_Edit_Module4();
    });
    document.addEventListener('keydown', function(event) {
        Execute_Message_Edit_Module4();
    });
    document.addEventListener('input', function(event) {
        Execute_Message_Edit_Module4();
    });
    // Message_Edit_Module(4) · End


    // Message_Edit_Module(5) · Start
    // 执行字数检查并判断当前长度是否符合系统限制
    function checkWordCount() {
        const checkButton = document.getElementById('e_chck');
        if (checkButton) {
            const postSubmit = document.getElementById('postsubmit');
            !!postSubmit && postSubmit.addEventListener('click', () => {
                checkButton.click();
                const alertContent = getAlertInfoContent();
                closeDialog();
                const currentLength = Number(getCount(alertContent).currentLength)
                const systemMinLimit = Number(getCount(alertContent).systemMinLimit)
                if (currentLength < systemMinLimit) {
                    show_dialog('检测到您输入的内容可能未达到系统字数限制，您可以增加字数或者复制"\n\n[color=#ffffff]插入空白字符以填充字数[/color]"到尾部以解决该问题');
                    GM_log('检测到您输入的内容可能未达到系统字数限制，您可以增加字数或者复制"\n\n[color=#ffffff]插入空白字符以填充字数[/color]"到尾部以解决该问题');
                }
            }, false);
        }
    }
    // 获取字数检查内容
    function getAlertInfoContent() {
        const alertInfo = document.querySelector('.alert_info p');
        return alertInfo ? alertInfo.textContent : '';
    }
    // 关闭字数检查弹窗
    function closeDialog() {
        const closeButton = document.getElementById('fwin_dialog_close');
        if (closeButton) {
            closeButton.click();
        }
    }
    checkWordCount();

    function getCount(text) {
        const regex1 = /当前长度: (.*?) 字节/;
        const regex2 = /系统限制: (.*?) 到/;
        const regex3 = /到 (.*?) 字节/;
        const match1 = text.match(regex1);
        const match2 = text.match(regex2);
        const match3 = text.match(regex3);
        const currentLength = match1 ? match1[1] : null;
        const systemMinLimit = match2 ? match2[1] : null;
        const systemMaxLimit = match3 ? match3[1] : null;
        return { currentLength:currentLength, systemMinLimit:systemMinLimit, systemMaxLimit: systemMaxLimit}
    }
    // Message_Edit_Module(5) · End


    async function getFileSHA256(fileUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fileUrl,
                responseType: "arraybuffer",
                onload: function(response) {
                    if (response.status === 200) {
                        const fileData = new Uint8Array(response.response);

                        try {
                            crypto.subtle.digest('SHA-256', fileData)
                                .then(hashBuffer => {
                                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                                    resolve(hashHex);
                                })
                                .catch(error => {
                                    reject(new Error('计算SHA256时出错: ' + error.message));
                                });
                        } catch (error) {
                            reject(new Error('计算SHA256时出错: ' + error.message));
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('请求失败: ' + error.error));
                }
            });
        });
    }

    function toBigAvatar() {
        const kafanAvatarRegex = /^https?:\/\/b\.kafan\.cn\/(.*)_avatar_(small|middle)\.jpg$/
        const elements = document.querySelectorAll(['.pls .avatar img', '.avtm img', '.avt img', '#tath img', '.rate table img', '.cm .vm img', '.card_mn .avt img', '.turing_listtxs img', '.t img', '.hm img'])

        let smallGifHash = null;

        if (site == 'KAFAN') {
            getFileSHA256('https://b.kafan.cn/5/small.gif').then((hash) => {
                smallGifHash = hash;
            });
        }

        elements.forEach((img) => {
            if (!kafanAvatarRegex.test(img.src)) {
                let original = img.src
                let parts = original.split('/')
                parts[parts.length - 1] = parts[parts.length - 1].replace("middle", "big")
                parts[parts.length - 1] = parts[parts.length - 1].replace("small", "big")
                img.src = parts.join('/')
                // if (original != elements[i].src) {
                // GM_log(`清晰度替换: From ${original} To ${elements[i].src}`);
                // }
            } else {
                getFileSHA256(img.src).then((hash) => {
                    if (hash === smallGifHash) {
                        img.src = "https://b.kafan.cn/5/big.gif"
                    } else {
                        img.src = img.src.replace(kafanAvatarRegex, "https://b.kafan.cn/$1_avatar_big.jpg")
                    }
                }).catch((error) => {
                    GM_log('Error computing SHA256: ' + error.message);
                });
            }
        })
    }

    function if_tdpre_y_clicked() {
        const tdpre_y = document.getElementsByClassName('tdpre y');
        Array.from(tdpre_y).forEach((elem) => {
            elem.removeEventListener('click', () => {         // 避免重复监听
                fastpreview();
            }, false);
            elem.addEventListener('click', () => {
                fastpreview();
            }, false);
        });
    }
    function fastpreview() {
        // 使用MutationObserver等待t_f和fastpreview的出现
        const observer = new MutationObserver((mutations, obs) => {
            const post = document.getElementsByClassName('t_f');
            const fastpreview = document.getElementsByClassName('fastpreview');
            if (post && fastpreview && page_type === 'forum page') {
                GM_log("fastpreview window was changed.");
                toBigAvatar();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (GLOBAL_CONFIG.big_size_avatar) {
        toBigAvatar();
        if_tdpre_y_clicked();
    }


    function extractImageDetails1() {
        const tds = document.querySelectorAll('td.t_f');
        tds.forEach((td, index1) => {
            let imgElement = td.querySelectorAll('img');
            if (imgElement.length > 0) {
                imgElement.forEach((img, index2) => {
                    var src = img.getAttribute('src');
                    var zoomfile = img.getAttribute('zoomfile');
                    var file = img.getAttribute('file');
                    const uniqueClassName = `unique-img1-${index1}-${index2}`;
                    img.classList.add(uniqueClassName);
                    var style = 
        `
        .${uniqueClassName} {
        content: url('${zoomfile}');
        width: auto !important;
        height: auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
        }
        `
                    if (src && zoomfile && file) {
                        GM_addStyle(style);
                    }
                });
            }
        });
    }
    function extractImageDetails2() {
        const mbn_saves = document.querySelectorAll('div.mbn.savephotop');
        mbn_saves.forEach((mbn_save, index) => {
            let imgElement = mbn_save.querySelector('img');
            if (imgElement) {
                var src = imgElement.getAttribute('src');
                var zoomfile = imgElement.getAttribute('zoomfile');
                var file = imgElement.getAttribute('file');
                const uniqueClassName = `unique-img2-${index}`;
                imgElement.classList.add(uniqueClassName);
                var style = 
        `
        .${uniqueClassName} {
        content: url('${zoomfile}');
        width: auto !important;
        height: auto !important;
        max-width: 100% !important;
        max-height: 100% !important;
        }
        `
                if (src && zoomfile && file) {
                    GM_addStyle(style);
                }
            }
        });
    }
    function removeScrolltop() {
        const scrolltop = document.getElementById('scrolltop');
        if (scrolltop) {
            scrolltop.remove();
        }
    }
    if (GLOBAL_CONFIG.picture_optimization) {
        extractImageDetails1();
        extractImageDetails2();
        removeScrolltop();
    }

    function KafanProfile() {
        const kafan_profile_regex_pn = /^\/space-uid-(\d+(?![\d])).html$/;
        const kafan_profile_regex_sn = /^\?mod=space&uid=(\d+(?![\d])).*$/;
        if (site === 'KAFAN') {
            let uid = null;
            if (kafan_profile_regex_pn.test(pn)) {
                uid = pn.match(kafan_profile_regex_pn)[1];
            } else if (kafan_profile_regex_sn.test(sn)) {
                uid = sn.match(kafan_profile_regex_sn)[1];
            } else {
                return;
            }

            let mtm_mbm = document.getElementsByClassName('mtm mbm');

            let a = document.createElement('a');
            a.textContent = "查看个人日志";
            a.title = "do_blog";
            a.className = "custom-function-button";
            a.href = `home.php?mod=space&uid=${uid}&do=blog&view=me&from=space`;
            mtm_mbm[0].appendChild(a)

            let b = document.createElement('a');
            b.textContent = "查看主题回复";
            b.title = "do_thread";
            b.className = "custom-function-button";
            b.href = `home.php?mod=space&uid=${uid}&do=thread&view=me&from=space`;
            mtm_mbm[0].appendChild(b)

            let c = document.createElement('a');
            c.textContent = "查看个人资料页";
            c.title = "do_blog";
            c.className = "custom-function-button";
            c.href = `home.php?mod=space&uid=${uid}&do=profile`;
            mtm_mbm[0].appendChild(c)
        }
    }
    KafanProfile();

    function a9DM_Remove_AD() {
        if (site === '9DMGAMEMOD') {
            const sliderContainers = ['#slidersteammakxq', '#steammakxq-wrapper']; 
            sliderContainers.forEach(selector => {
                document.querySelector(selector)?.remove();
            });
            if (page_type === 'thread page') {
                document.querySelectorAll('div.forum-slider, div.slide-item, div.slider-indicators, div.slider-caption, div.slider-caption-box, div.slide-btn-container').forEach(child => child.remove());
                document.querySelectorAll('a.slite-btn, a.slite-btn.slitebtn').forEach(child => child.remove());
                document.querySelectorAll('.slide-pic, .slide-title, .slide-desc, .slide-btn, .slider-nav-btn, .slider-nav-btn.prev-btn, .slider-nav-btn.next-btn').forEach(child => child.remove());
            }

            const elements = [
                ...document.getElementsByClassName('a_fl'),
                ...document.getElementsByClassName('a_cn'),
                ...document.getElementsByClassName('a_pt'),
                ...document.getElementsByClassName('wp a_hd')
            ]
            elements.forEach(element => {
                element.remove();
            });
        }
    }
    a9DM_Remove_AD();

    function QQiconToStr() {
        let urlPattern = /wpa\.qq\.com\/msgrd\?v=3&uin=(\d+)(?!\d).*/i;
        let links = document.querySelectorAll('a[href*="wpa.qq.com/msgrd?v=3"]');
        links.forEach(link => {
            let uinMatch = link.href.match(urlPattern)[1];
            if (uinMatch) {
                const newElement = document.createElement('span');
                newElement.textContent = `Ta设置的QQ: ${uinMatch}`;
                newElement.style.display = "block";
                link.parentNode.appendChild(newElement, link);
            }
        });
    }
    QQiconToStr();

    if (GLOBAL_CONFIG.theme_beautification) {
        GM_addStyle (`
        td.pls, div.tns.xg2, a.xi2, p.xg1 {
            color: #66CCFF !important;
        }
        div.authi {
            color: #00BFFF!important;
        }
        a.xw1 {
            color: #FF8C00;
            // color: #FF8C00 !important;
        }
        a.showmenu {
            color: #66CCFF !important;
            font-weight: bold;
        }
        div.avt.y, ul.trp_pop, div.bm.cl {
            font-weight: bold;
        }
        `);
        if (member) {
            GM_addStyle (`
        div.pls.favatar {
            background-image: url('https://img1.baidu.com/it/u=710094272,181047437&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1428') !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-size: cover !important;
        }
        `);
        }
    }


    // Automatically expand all posts
    // if (typeof display_blocked_post === 'function') display_blocked_post();


    // Display Emoji
    if (GLOBAL_CONFIG.display_emoji) {
        const elements = [
            ...document.getElementsByClassName("t_f"),
            ...document.getElementsByClassName("sign"),
            ...document.getElementsByClassName("ptm"),
            ...document.getElementsByClassName("mbm")
        ];
        const xg1 = document.getElementsByClassName("xg1");

        const replaceEmoji = (element, regex, length) => {
            element.innerHTML = element.innerHTML.replace(regex, char => {
                if (char.length === length) {
                    return String.fromCodePoint(parseInt(char.match(/[0-9]+/)))
                }
                return char
            })
        }
        elements.forEach(element => replaceEmoji(element, /\&amp;#.*?;/g, 13))
        Array.from(xg1).forEach(element => replaceEmoji(element, /\&amp;amp;#.*?;/g, 17))
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
    site === 'PCBETA' && page_type === 'thread page' && GM_addStyle(`
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
