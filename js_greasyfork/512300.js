// ==UserScript==
// @name              M3U8 Filter Ad Script
// @namespace         http://tampermonkey.net/
// @version           2.0.1
// @description       自用，拦截和过滤 m3u8（解析/采集资源） 的切片（插播）广告，同时在console打印过滤的行信息，不会误删。
// @author            ltxlong
// @match             *://*/*
// @exclude           *://challenges.cloudflare.com/*
// @exclude           *://*.hcaptcha.com/*
// @exclude           *://*/*recaptcha*
// @exclude           *://api.geetest.com/*
// @exclude           *://static.geetest.com/*
// @run-at            document-start
// @grant             unsafeWindow
// @grant             GM_getResourceText
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM_setValue
// @grant             GM_getValue
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal     https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @resource SwalDark https://unpkg.com/@sweetalert2/theme-dark@5/dark.min.css
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/512300/M3U8%20Filter%20Ad%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/512300/M3U8%20Filter%20Ad%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 判断是否为验证页面 ---
    function is_verification_page() {
        const current_url = unsafeWindow.location.href;
        const page_title = unsafeWindow.document.title;

        const verification_keywords = [
            // URL 路径特征
            'challenges.cloudflare.com',
            'geetest.com',
            'captcha',
            'challenge-platform',
            // 页面标题关键词
            'just a moment',
            'checking your browser',
            'checking browser security',
            'security check',
            'verify you are human',
            'please verify',
            'human verification',
            'security challenge',
            'are you a human',
            'are you a robot',
            'not a robot',
            'bot detection',
            '验证',
            '安全防护',
            '安全检测',
            '安全检查',
            '正在检查您的浏览器',
            '请稍候',
            '我不是机器人'
        ];

        for (const the_keyword of verification_keywords) {
            if (current_url.toLowerCase().includes(the_keyword) || (page_title && page_title.toLowerCase().includes(the_keyword))) {
                return true;
            }
        }

        return false;
    }

    // ======== 脚本执行入口 ========
    // 如果是人机校验页面，则立即停止后续所有操作
    if (is_verification_page()) {
        return;
    }
    // ======== 检查结束 ========

    let ts_name_len = 0; // ts前缀长度

    let ts_name_len_extend = 1; // 容错

    let first_extinf_row = '';

    let the_extinf_judge_row_n = 0;

    let the_same_extinf_name_n = 0;

    let the_extinf_benchmark_n = 5; // 基准

    let prev_ts_name_index = -1; // 上个ts序列号

    let first_ts_name_index = -1; // 首个ts序列号

    let ts_type = 0; // 0：xxxx000数字递增.ts模式0 ；1：xxxxxxxxxx.ts模式1 ；2：***.ts模式2-暴力拆解

    let the_ext_x_mode = 0; // 0：ext_x_discontinuity判断模式0 ；1：ext_x_discontinuity判断模式1

    let the_current_host = unsafeWindow.location.hostname;

    let script_whitelist_mode_flag = false; // 是否启用白名单模式，默认否，默认是匹配所有的网站

    let the_current_host_in_whitelist_flag = false; // 当前域名是否在白名单，默认否

    let show_toast_tip_flag = false; // 是否启用弹窗提示，默认否

    let violent_filter_mode_flag = false; // 是否启用暴力拆解模式，默认否-自动判断模式

    let filter_log_html = '';

    let filter_done_flag = false;

    function filter_log(...msg) {

        const log_content = msg.join('</p><p>');

        console.log('%c[m3u8_filter_ad]', 'font-weight: bold; color: white; background-color: #70b566b0; padding: 2px; border-radius: 2px;', ...msg);

        filter_log_html += `
            <p>
                <span style="font-weight: bold; color: white; background-color: #70b566b0; padding: 2px; border-radius: 2px;">[m3u8_filter_ad]</span>
                ${log_content}
            </p>
       `;

    }

    let the_swalcss_color = "#ff679a";

    let swalcss = `
			.swal2-styled{transition: all 0.2s ease;}
			.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:${the_swalcss_color} transparent }
			.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:${the_swalcss_color};color:#fff;font-size:1em}
			.swal2-styled.swal2-confirm:hover,.swal2-styled.swal2-deny:hover{opacity:0.8;background-image:none!important}
			.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px ${the_swalcss_color}80}
			.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px #dc374180}
			.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}
			.swal2-timer-progress-bar{width:100%;height:.25em;background:${the_swalcss_color}33 }
			.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:${the_swalcss_color};color:#fff;line-height:2em;text-align:center}
			.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:${the_swalcss_color} }
			.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:${the_swalcss_color}}
			.swal2-popup {padding:1.25em 0 1.25em;flex-direction:column}
			.swal2-close {position:absolute;top:1px;right:1px;transition: all 0.2s ease;}
			div:where(.swal2-container) .swal2-html-container{padding: 1.3em 1.3em 0.3em;}
			div:where(.swal2-container) button:where(.swal2-close):hover {color:${the_swalcss_color}!important;font-size:60px!important}
			div:where(.swal2-icon) .swal2-icon-content {font-family: sans-serif;}
			.swal2-container {z-index: 1145141919810;}
			`;

    // 动态添加样式
    function add_style(id, css) {

        let try_add_style_n = 0;

        let try_to_add_style = function() {
            let the_style_dom = unsafeWindow.document.getElementById(id);
            if (the_style_dom) the_style_dom.remove();

            let the_style = unsafeWindow.document.createElement('style');
            the_style.rel = 'stylesheet';
            the_style.id = id;
            the_style.innerHTML = css;

            let the_target_element = unsafeWindow.document.body;
            if (the_target_element) {
                the_target_element.insertBefore(the_style, the_target_element.firstChild);
            } else {
                try_add_style_n++;
                if (try_add_style_n < 50) {
                    setTimeout(try_to_add_style, 100);
                }
            }
        };

        try_to_add_style();
    }

    // 先监听颜色方案变化
    unsafeWindow.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
        if (e.matches) {
            // 切换到暗色主题
            add_style('swal-pub-style', GM_getResourceText('SwalDark'));
        } else {
            // 切换到浅色主题
            add_style('swal-pub-style', GM_getResourceText('Swal'));
        }

        add_style('Panlinker-SweetAlert2-User', swalcss);
    });

    // 再修改主题
    if (unsafeWindow.matchMedia && unsafeWindow.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 切换到暗色主题
        add_style('swal-pub-style', GM_getResourceText('SwalDark'));
    } else {
        // 切换到浅色主题
        add_style('swal-pub-style', GM_getResourceText('Swal'));
    }

    add_style('Panlinker-SweetAlert2-User', swalcss);

    // Toast 提示配置
    let toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        didOpen: function (toast) {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // Toast 简易调用
    let message = {
        success: function (text) {
            toast.fire({ title: text, icon: 'success' });
        },
        error: function (text) {
            toast.fire({ title: text, icon: 'error' });
        },
        warning: function (text) {
            toast.fire({ title: text, icon: 'warning' });
        },
        info: function (text) {
            toast.fire({ title: text, icon: 'info' });
        },
        question: function (text) {
            toast.fire({ title: text, icon: 'question' });
        }
    };

    function is_m3u8_file(url) {
        return /\.m3u8($|\?)/.test(url);
    }

    function extract_number_before_ts(str) {
        // 匹配 .ts 前面的数字
        const match = str.match(/(\d+)\.ts/);

        if (match) {
            // 使用 parseInt 去掉前导 0
            return parseInt(match[1], 10);
        }

        return null; // 如果不匹配，返回 null
    }

    function filter_lines(lines) {
        let result = [];

        if (violent_filter_mode_flag) {
            filter_log('----------------------------暴力拆解模式--------------------------');

            ts_type = 2; // ts命名模式
        } else {
            filter_log('----------------------------自动判断模式--------------------------');

            let the_normal_int_ts_n = 0;
            let the_diff_int_ts_n = 0;

            let last_ts_name_len = 0;

            // 初始化参数
            for (let i = 0; i < lines.length; i++) {

                const line = lines[i];

                // 初始化first_extinf_row
                if (the_extinf_judge_row_n === 0 && line.startsWith('#EXTINF')) {
                    first_extinf_row = line;

                    the_extinf_judge_row_n++;
                } else if (the_extinf_judge_row_n === 1 && line.startsWith('#EXTINF')) {
                    if (line !== first_extinf_row) {
                        first_extinf_row = '';
                    }

                    the_extinf_judge_row_n++;
                }

                // 判断ts模式
                let the_ts_name_len = line.indexOf('.ts'); // ts前缀长度

                if (the_ts_name_len > 0) {

                    if (the_extinf_judge_row_n === 1) {
                        ts_name_len = the_ts_name_len;
                    }

                    last_ts_name_len = the_ts_name_len;

                    let ts_name_index = extract_number_before_ts(line);
                    if (ts_name_index === null) {
                        if (the_extinf_judge_row_n === 1) {
                            ts_type = 1; // ts命名模式
                        } else if (the_extinf_judge_row_n === 2 && (ts_type === 1 || the_ts_name_len === ts_name_len)) {
                            ts_type = 1; // ts命名模式

                            filter_log('----------------------------识别ts模式1---------------------------');

                            break;
                        } else {
                            the_diff_int_ts_n++;
                        }
                    } else {

                        // 如果序号相隔等于1: 模式0
                        // 如果序号相隔大于1，或其他：模式2（暴力拆解）

                        if (the_normal_int_ts_n === 0) {
                            // 初始化ts序列号
                            prev_ts_name_index = ts_name_index;
                            first_ts_name_index = ts_name_index;
                            prev_ts_name_index = first_ts_name_index - 1;
                        }

                        if (the_ts_name_len !== ts_name_len) {

                            if (the_ts_name_len === last_ts_name_len + 1 && ts_name_index === prev_ts_name_index + 1) {

                                if (the_diff_int_ts_n) {

                                    if (ts_name_index === prev_ts_name_index + 1) {
                                        ts_type = 0; // ts命名模式
                                        prev_ts_name_index = first_ts_name_index - 1;

                                        filter_log('----------------------------识别ts模式0---------------------------')

                                        break;
                                    } else {
                                        ts_type = 2; // ts命名模式

                                        filter_log('----------------------------识别ts模式2---------------------------')

                                        break;
                                    }
                                }

                                the_normal_int_ts_n++;
                                prev_ts_name_index = ts_name_index;

                            } else {
                                the_diff_int_ts_n++;
                            }
                        } else {

                            if (the_diff_int_ts_n) {

                                if (ts_name_index === prev_ts_name_index + 1) {
                                    ts_type = 0; // ts命名模式
                                    prev_ts_name_index = first_ts_name_index - 1;

                                    filter_log('----------------------------识别ts模式0---------------------------')

                                    break;
                                } else {
                                    ts_type = 2; // ts命名模式

                                    filter_log('----------------------------识别ts模式2---------------------------')

                                    break;
                                }
                            }

                            the_normal_int_ts_n++;
                            prev_ts_name_index = ts_name_index;
                        }
                    }
                }

                if (i === lines.length - 1) {
                    // 后缀不是ts，而是jpeg等等，或者以上规则判断不了的，或者没有广告切片的：直接暴力拆解过滤

                    ts_type = 2; // ts命名模式

                    filter_log('----------------------------进入暴力拆解模式---------------------------')
                }
            }
        }

        // 开始遍历过滤
        for (let i = 0; i < lines.length; i++) {

            let ts_index_check = false;

            const line = lines[i];

            if (ts_type === 0) {

                if (line.startsWith('#EXT-X-DISCONTINUITY') && lines[i + 1] && lines[i + 2]) {

                    // 检查当前行是否跟 #EXT-X-相关
                    if (i > 0 && lines[i - 1].startsWith('#EXT-X-')) {
                        result.push(line);

                        continue;
                    } else {
                        let the_ts_name_len = lines[i + 2].indexOf('.ts'); // ts前缀长度

                        if (the_ts_name_len > 0) {

                            // 根据ts名字长度过滤
                            if (the_ts_name_len - ts_name_len > ts_name_len_extend) {
                                // 广告过滤
                                if (lines[i + 3] && lines[i + 3].startsWith('#EXT-X-DISCONTINUITY')) {
                                    // 打印即将过滤的行
                                    filter_log('过滤规则: #EXT-X-DISCONTINUITY-ts文件名长度-');
                                    filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2], "\n", lines[i + 3]);
                                    filter_log('------------------------------------------------------------------');

                                    i += 3;
                                } else {
                                    // 打印即将过滤的行
                                    filter_log('过滤规则: #EXT-X-DISCONTINUITY-ts文件名长度');
                                    filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2]);
                                    filter_log('------------------------------------------------------------------');

                                    i += 2;
                                }

                                continue;
                            } else {
                                ts_name_len = the_ts_name_len;
                            }

                            // 根据ts序列号过滤
                            let the_ts_name_index = extract_number_before_ts(lines[i + 2]);

                            if (the_ts_name_index !== prev_ts_name_index + 1) {

                                // 广告过滤
                                if (lines[i + 3] && lines[i + 3].startsWith('#EXT-X-DISCONTINUITY')) {
                                    // 打印即将过滤的行
                                    filter_log('过滤规则: #EXT-X-DISCONTINUITY-ts序列号-');
                                    filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2], "\n", lines[i + 3]);
                                    filter_log('------------------------------------------------------------------');

                                    i += 3;
                                } else {
                                    // 打印即将过滤的行
                                    filter_log('过滤规则: #EXT-X-DISCONTINUITY-ts序列号');
                                    filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2]);
                                    filter_log('------------------------------------------------------------------');

                                    i += 2;
                                }

                                continue;
                            }
                        }
                    }
                }

                if (line.startsWith('#EXTINF') && lines[i + 1]) {

                    let the_ts_name_len = lines[i + 1].indexOf('.ts'); // ts前缀长度

                    if (the_ts_name_len > 0) {

                        // 根据ts名字长度过滤
                        if (the_ts_name_len - ts_name_len > ts_name_len_extend) {
                            // 广告过滤
                            if (lines[i + 2] && lines[i + 2].startsWith('#EXT-X-DISCONTINUITY')) {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXTINF-ts文件名长度-');
                                filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2]);
                                filter_log('------------------------------------------------------------------');

                                i += 2;
                            } else {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXTINF-ts文件名长度');
                                filter_log('过滤的行:', "\n", line, "\n", lines[i + 1]);
                                filter_log('------------------------------------------------------------------');

                                i += 1;
                            }

                            continue;
                        } else {
                            ts_name_len = the_ts_name_len;
                        }

                        // 根据ts序列号过滤
                        let the_ts_name_index = extract_number_before_ts(lines[i + 1]);

                        if (the_ts_name_index === prev_ts_name_index + 1) {

                            prev_ts_name_index++;

                        } else {
                            // 广告过滤
                            if (lines[i + 2].startsWith('#EXT-X-DISCONTINUITY')) {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXTINF-ts序列号-');
                                filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2]);
                                filter_log('------------------------------------------------------------------');

                                i += 2;
                            } else {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXTINF-ts序列号');
                                filter_log('过滤的行:', "\n", line, "\n", lines[i + 1]);
                                filter_log('------------------------------------------------------------------');

                                i += 1;
                            }

                            continue;
                        }
                    }
                }
            } else if (ts_type === 1) {

                if (line.startsWith('#EXTINF')) {
                    if (line === first_extinf_row && the_same_extinf_name_n <= the_extinf_benchmark_n && the_ext_x_mode === 0) {
                        the_same_extinf_name_n++;
                    } else {
                        the_ext_x_mode = 1;
                    }

                    if (the_same_extinf_name_n > the_extinf_benchmark_n) {
                        the_ext_x_mode = 1;
                    }
                }

                if (line.startsWith('#EXT-X-DISCONTINUITY')) {
                    // 检查当前行是否跟 #EXT-X-PLAYLIST-TYPE相关
                    if (i > 0 && lines[i - 1].startsWith('#EXT-X-PLAYLIST-TYPE')) {
                        result.push(line);

                        continue;
                    } else {

                        // 如果第 i+2 行是 .ts 文件，跳过当前行和接下来的两行
                        if (lines[i + 1] && lines[i + 1].startsWith('#EXTINF') && lines[i + 2] && lines[i + 2].indexOf('.ts') > 0) {

                            let the_ext_x_discontinuity_condition_flag = false;

                            if (the_ext_x_mode === 1) {
                                the_ext_x_discontinuity_condition_flag = lines[i + 1] !== first_extinf_row && the_same_extinf_name_n > the_extinf_benchmark_n;
                            }

                            // 进一步检测第 i+3 行是否也是 #EXT-X-DISCONTINUITY
                            if (lines[i + 3] && lines[i + 3].startsWith('#EXT-X-DISCONTINUITY') && the_ext_x_discontinuity_condition_flag) {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXT-X-DISCONTINUITY-广告-#EXT-X-DISCONTINUITY过滤');
                                filter_log('过滤的行:', "\n", line, "\n", lines[i + 1], "\n", lines[i + 2], "\n", lines[i + 3]);
                                filter_log('------------------------------------------------------------------');

                                i += 3; // 跳过当前行和接下来的三行
                            } else {
                                // 打印即将过滤的行
                                filter_log('过滤规则: #EXT-X-DISCONTINUITY-单个标识过滤');
                                filter_log('过滤的行:', "\n", line);
                                filter_log('------------------------------------------------------------------');
                            }

                            continue;
                        }
                    }
                }
            } else {

                // 暴力拆解
                if (line.startsWith('#EXT-X-DISCONTINUITY')) {
                    // 检查当前行是否跟 #EXT-X-PLAYLIST-TYPE相关
                    if (i > 0 && lines[i - 1].startsWith('#EXT-X-PLAYLIST-TYPE')) {
                        result.push(line);

                        continue;
                    } else {

                        // 打印即将过滤的行
                        filter_log('过滤规则: #EXT-X-DISCONTINUITY-单个标识过滤');
                        filter_log('过滤的行:', "\n", line);
                        filter_log('------------------------------------------------------------------');

                        continue;
                    }
                }
            }

            // 保留不需要过滤的行
            result.push(line);
        }

        return result;
    }

    async function safely_process_m3u8(url, content) {
        try {
            const lines = content.split('\n');
            const new_ines = filter_lines(lines);

            return new_ines.join('\n');
        } catch (e) {
            filter_log(`处理 m3u8 文件时出错: ${url}`, e);

            return content;
        }
    }

    // 脚本菜单变量
    let menu_item_violent = null;
    let menu_item_mode = null;
    let menu_item_host_join = null;
    let menu_item_toast = null;
    let menu_item_filter_tip = null;

    function hookXHR() {
        const OriginalXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = class extends OriginalXHR {
            constructor() {
                super();

                this.addEventListener('readystatechange', async function () {

                    if (this.readyState === 4 && this.status === 200 && is_m3u8_file(this.responseURL)) {

                        filter_log('----------------------------hookXHR成功---------------------------');

                        const modifiedResponse = await safely_process_m3u8(this.responseURL, this.responseText);
                        Object.defineProperty(this, 'responseText', { value: modifiedResponse });
                        Object.defineProperty(this, 'response', { value: modifiedResponse });

                        if (show_toast_tip_flag) {
                            message.success('已成功过滤切片广告');
                        }

                        filter_done_flag = true;
                        GM_unregisterMenuCommand(menu_item_filter_tip);
                        check_menu_item_filter_tip();
                    }
                }, false);
            }
        };
    }

    function initHook() {
        hookXHR();
    }

    // 初始化菜单判断变量
    violent_filter_mode_flag = GM_getValue('violent_filter_mode_flag', false);
    script_whitelist_mode_flag = GM_getValue('script_whitelist_mode_flag', false);
    the_current_host_in_whitelist_flag = GM_getValue(the_current_host, false);
    show_toast_tip_flag = GM_getValue('show_toast_tip_flag', false);

    function check_menu_item_violent() {
        if (violent_filter_mode_flag) {
            menu_item_violent = GM_registerMenuCommand('暴力拆解模式（可点击切换到自动判断过滤模式）', function() {

                GM_setValue('violent_filter_mode_flag', false);

                violent_filter_mode_flag = false;

                message.success('已设置：<br><br>自动判断过滤模式！');

                unsafeWindow.location.reload();
            });
        } else {
            menu_item_violent = GM_registerMenuCommand('自动判断过滤模式（可点击切换到暴力拆解模式）', function() {

                GM_setValue('violent_filter_mode_flag', true);

                violent_filter_mode_flag = true;

                message.success('已设置：<br><br>暴力拆解模式！');

                unsafeWindow.location.reload();
            });
        }
    }

    function check_menu_item_mode() {
        if (script_whitelist_mode_flag) {
            menu_item_mode = GM_registerMenuCommand('现在是白名单模式（可点击切换到全匹配模式）', function() {

                GM_setValue('script_whitelist_mode_flag', false);

                script_whitelist_mode_flag = false;

                message.success('已设置：<br><br>全匹配模式，即匹配所有网站！');

                unsafeWindow.location.reload();
            });
        } else {
            menu_item_mode = GM_registerMenuCommand('现在是全匹配模式（可点击切换到白名单模式）', function() {

                GM_setValue('script_whitelist_mode_flag', true);

                script_whitelist_mode_flag = true;

                message.success('已设置：<br><br>白名单模式，即需要单个网站设置加入过滤名单！');

                unsafeWindow.location.reload();
            });
        }
    }

    function check_menu_item_host_join() {
        if (script_whitelist_mode_flag) {

            if (the_current_host_in_whitelist_flag) {

                initHook();

                if (unsafeWindow.self === unsafeWindow.top) {

                    if (menu_item_host_join === null) {
                        filter_log('----------------------------脚本加载完成---------------------------');
                        filter_log('----------------------------还没 hookXHR---------------------------');
                    }

                    menu_item_host_join = GM_registerMenuCommand('本网站已开启过滤（可点击关闭广告过滤）', function() {

                        GM_setValue(the_current_host, false);

                        the_current_host_in_whitelist_flag = false;

                        message.success('已设置：<br><br>关闭本网站的广告过滤！');

                        unsafeWindow.location.reload();
                    });

                }
            } else {
                if (unsafeWindow.self === unsafeWindow.top) {

                    if (menu_item_host_join === null) {
                        filter_log('----------------------------还没开启过滤---------------------------');
                    }

                    menu_item_host_join = GM_registerMenuCommand('本网站已关闭过滤（可点击开启广告过滤）', function() {

                        GM_setValue(the_current_host, true);

                        the_current_host_in_whitelist_flag = true;

                        message.success('已设置：<br><br>开启本网站的广告过滤！');

                        unsafeWindow.location.reload();
                    });

                }
            }
        } else {
            if (menu_item_host_join === null) {
                filter_log('----------------------------脚本加载完成---------------------------');
                filter_log('----------------------------还没 hookXHR---------------------------');

                initHook();
            }
        }
    }

    function check_menu_item_toast() {
        if (show_toast_tip_flag) {
            if (unsafeWindow.self === unsafeWindow.top) {
                menu_item_toast = GM_registerMenuCommand('已开启弹窗提示（可点击设置关闭）', function() {

                    GM_setValue('show_toast_tip_flag', false);

                    show_toast_tip_flag = false;

                    message.success('已设置：<br><br>关闭弹窗提示！');

                    add_menu_item_all();
                });
            }
        } else {
            if (unsafeWindow.self === unsafeWindow.top) {
                menu_item_toast = GM_registerMenuCommand('已关闭弹窗提示（可点击设置开启）', function() {

                    GM_setValue('show_toast_tip_flag', true);

                    show_toast_tip_flag = true;

                    message.success('已设置：<br><br>开启弹窗提示！');

                    add_menu_item_all();
                });
            }
        }
    }

    function register_menu_filter_done_tip() {
        menu_item_filter_tip = GM_registerMenuCommand('提示：已成功过滤视频切片广告', function() {
            Swal.fire({
                title: '过滤日志',
                type: 'info',
                icon: 'info',
                html: filter_log_html,
                width: '50%',
                showClass: {
                    popup: ''
                },
                hideClass: {
                    popup: ''
                },
                confirmButtonText: 'OK',
                showCloseButton: true
            });
        });
    }

    function register_menu_filter_undone_tip() {
        menu_item_filter_tip = GM_registerMenuCommand('提示：还没有过滤视频切片广告', function() {
            Swal.fire({
                type: 'info',
                icon: 'info',
                html: '过滤视频切片广告失败！ <br><br> ctrl + F5 刷新试试 <br><br> 如果还不行，那说明：<br><br> 视频格式不是m3u8，无法过滤！',
                showClass: {
                    popup: ''
                },
                hideClass: {
                    popup: ''
                },
                confirmButtonText: 'OK',
                showCloseButton: true
            });
        });
    }

    function check_menu_item_filter_tip() {
        if (filter_done_flag) {
            register_menu_filter_done_tip();
        } else {
            if ((script_whitelist_mode_flag && the_current_host_in_whitelist_flag) || !script_whitelist_mode_flag) {
                register_menu_filter_undone_tip();
            }
        }
    }

    function remove_menu_item_all() {
        GM_unregisterMenuCommand(menu_item_violent);
        GM_unregisterMenuCommand(menu_item_mode);
        GM_unregisterMenuCommand(menu_item_host_join);
        GM_unregisterMenuCommand(menu_item_toast);
    }

    function add_menu_item_all() {
        remove_menu_item_all();

        check_menu_item_violent();
        check_menu_item_mode();
        check_menu_item_host_join();
        check_menu_item_toast();
    }

    add_menu_item_all();

    function listen_video_load_meta() {
        if ((script_whitelist_mode_flag && the_current_host_in_whitelist_flag) || !script_whitelist_mode_flag) {

            let try_listen_video_meta_n = 0;

            let try_to_add_listen_video_meta = function () {
                let the_video_dom = unsafeWindow.document.querySelector('video');
                if (the_video_dom) {
                    the_video_dom.addEventListener('loadedmetadata', () => {
                        setTimeout(function() {
                            if (!filter_done_flag) {

                                if (show_toast_tip_flag) {

                                    if (the_video_dom.src.indexOf('.mp4') > 0) {
                                        message.error('过滤失败！<br><br>播放视频格式是mp4 <br><br>不是m3u8，无法过滤！');
                                    } else {
                                        message.warning('过滤失败！ctrl+F5 刷新试试，<br><br> 若还不行，说明播放视频格式<br>不是m3u8，无法过滤！');
                                    }

                                }

                                GM_unregisterMenuCommand(menu_item_filter_tip);
                                check_menu_item_filter_tip();
                            }
                        }, 1000);
                    });
                } else {
                    try_listen_video_meta_n++;
                    if (try_listen_video_meta_n < 50) {
                        setTimeout(try_to_add_listen_video_meta, 100);
                    }
                }
            }

            try_to_add_listen_video_meta();
        }
    }

    listen_video_load_meta();

})();