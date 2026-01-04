// ==UserScript==
// @name         粤语屋 小宝影院 看剧吧 剧集屋 爱看港剧网 优酷去视频内嵌广告
// @name:zh-TW   粤语屋 小宝影院 看剧吧 剧集屋 爱看港剧网 优酷去视频内嵌广告
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      4.0.1
// @description:zh-TW 规则可能因为网站的改变而失效，也有可能是还没收录的规则，失效请留言，我会尽快修复！
// @description 规则可能因为网站的改变而失效，也有可能是还没收录的规则，失效请留言，我会尽快修复！
// @author       hua
// @grant        unsafeWindow
// @license      MIT
// @include      https://m3u8.yueyuwu.cc/player/*
// @include      https://play.yueyuwu.cc/*
// @include      https://xbyy.app/player/*
// @include      https://kandaju.net/js/player/*
// @include      https://ffzyplayer.com/*
// @include      https://api.yktvb.com/dplayer.html*
// @include      https://v.youku.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/496767/%E7%B2%A4%E8%AF%AD%E5%B1%8B%20%E5%B0%8F%E5%AE%9D%E5%BD%B1%E9%99%A2%20%E7%9C%8B%E5%89%A7%E5%90%A7%20%E5%89%A7%E9%9B%86%E5%B1%8B%20%E7%88%B1%E7%9C%8B%E6%B8%AF%E5%89%A7%E7%BD%91%20%E4%BC%98%E9%85%B7%E5%8E%BB%E8%A7%86%E9%A2%91%E5%86%85%E5%B5%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/496767/%E7%B2%A4%E8%AF%AD%E5%B1%8B%20%E5%B0%8F%E5%AE%9D%E5%BD%B1%E9%99%A2%20%E7%9C%8B%E5%89%A7%E5%90%A7%20%E5%89%A7%E9%9B%86%E5%B1%8B%20%E7%88%B1%E7%9C%8B%E6%B8%AF%E5%89%A7%E7%BD%91%20%E4%BC%98%E9%85%B7%E5%8E%BB%E8%A7%86%E9%A2%91%E5%86%85%E5%B5%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

//粤语屋 小宝影院 看剧吧 剧集屋 爱看港剧网 优酷




(function () {
    let href = document.location.href;
    const page_type = get_page_type();
    const origin_console = console;
    const log = origin_console.log;
    if (page_type === 'unknown') {
        log('unknown page type');
        return;
    }
    const process_api = get_m3u8_process_api();
    const config_infos = {
        'yyw': {
            'm3u8_file_flag': /mixed\.m3u8$/,
            'process_method': process_api.common
        },
        'xbyy': {
            'm3u8_file_flag': /\.m3u8$/,
            'process_method': process_api.common
        },
        "kjb": {
            'm3u8_file_flag': /mixed\.m3u8$/,
            'process_method': process_api.common
        },
        "jjw": {
            'm3u8_file_flag': /mixed\.m3u8$/,
            'process_method': process_api.common
        },
        "akgjw": {
            'm3u8_file_flag': /mixed\.m3u8$/,
            'process_method': process_api.common
        },
        "youku": {
            'm3u8_file_flag': /\.m3u8/,
            'process_method': process_api.youku1
        }
    };
    let config_info = config_infos[page_type];
    init_hook();
    log('脚本注入成功！');

    function init_hook() {

        unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
            get xhrResponseValue() {
                const xhr = this;
                if (xhr.readyState === unsafeWindow.XMLHttpRequest.DONE && xhr.status === 200) {
                    const url = xhr.responseURL;
                    if (url.match(config_info.m3u8_file_flag)) {
                        try {
                            return config_info.process_method(super.response);
                        } catch (error) {
                            log('m3u8处理异常！', error);
                        }
                    }
                }
                return super.response;
            }
            get responseText() {
                return this.xhrResponseValue;
            }
            get response() {
                return this.xhrResponseValue;
            }
        };
        async function process_fetch_response(response) {
            try {
                const responseClone = response.clone();
                let result = await responseClone.text();
                const tmp = config_info.process_method(result);
                if (tmp) return new Response(tmp, response);
            } catch (error) {
                log(error);
            }
            log('m3u8处理异常！');
            return response;
        }
        const origin_fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function () {
            const fetch_ = async function (uri, options) {
                async function fetch_request(response) {
                    let url = response.url;
                    if (url.match(config_info.m3u8_file_flag)) {
                        return await process_fetch_response(response);
                    }
                    return response;
                }
                return origin_fetch(uri, options).then(fetch_request);
            };
            return fetch_;
        }();
    }

    function get_page_type() {
        if (href.includes('yueyuwu.cc'))
            return 'yyw';
        else if (href.includes('xbyy.app'))
            return 'xbyy';
        else if (href.includes('kandaju.net'))
            return 'kjb';
        else if (href.includes('ffzyplayer.com'))
            return 'jjw';
        else if (href.includes('api.yktvb.com'))
            return 'akgjw';
        else if (href.includes('v.youku.com'))
            return 'youku';
        else
            return 'unknown';
    }

    function get_m3u8_process_api() {
        return {
            youku: function (file) {
                let lines = file.split('\n');
                let processed_lines = [];
                let is_ad_line = false;
                for (let line of lines) {
                    if (line.startsWith('#EXT-X-MAP')) {
                        is_ad_line = line.includes('/ad/');
                    }
                    is_ad_line && log(`删除${line}`);
                    !is_ad_line && line && processed_lines.push(line);
                }
                const last_index = processed_lines.length - 1;
                if (processed_lines[last_index].startsWith('#EXT-X-DISCONTINUITY'))
                    processed_lines[last_index] = processed_lines[last_index].replace('#EXT-X-DISCONTINUITY', '#EXT-X-ENDLIST');
                return processed_lines.join('\n');
            },
            youku1: function (file) {
                // https://v.youku.com/v_show/id_XNTg3NzczODQ5Mg==.html?spm=a2hja.14919748_WEBTV_JINGXUAN.drawer8.d_zj1_3&s=ccaa921b13aa44fb92d1&scm=20140719.rcmd.20494.show_ccaa921b13aa44fb92d1&s=ccaa921b13aa44fb92d1
                let lines = file.split('\n');
                let processed_lines = [];
                for (let line of lines) {
                    if (line.startsWith('https')) {
                        if (line.includes('/ad/')) {
                            processed_lines.pop();
                            processed_lines.pop();
                            if (processed_lines[processed_lines.length - 1] == '#EXT-X-DISCONTINUITY') {
                                processed_lines.pop();
                            }
                            log('删除', line);
                            continue;
                        }
                    }
                    processed_lines.push(line);
                }
                return processed_lines.join('\n');
            },
            xbyy: function (file) {
                let lines = file.split('\n');
                let processed_lines = [];
                let pre_name;
                for (let line of lines) {
                    if (line.endsWith('.ts')) {
                        pre_name = line.match(/^.*\//)[0];
                        break;
                    }
                }
                for (let line of lines) {
                    if (line.endsWith('.ts')) {
                        if (!line.startsWith(pre_name)) {
                            processed_lines.pop();
                            if (processed_lines[processed_lines.length - 1] == '#EXT-X-DISCONTINUITY') {
                                processed_lines.pop();
                            }
                            log('删除', line);
                            continue;
                        }
                    }
                    processed_lines.push(line);
                }
                return processed_lines.join('\n');
            },
            common: function (file) {
                let lines = file.split('\n');
                let processed_lines = [];
                let index = 0;
                let name_len;
                let pre_name;
                let next_name;
                for (let line of lines) {
                    if (line.endsWith('.ts')) {
                        if (!next_name) {
                            pre_name = line.split('.ts')[0];
                            name_len = pre_name.length;
                            index++;
                            const str_index = String(index);
                            next_name = `${pre_name.substring(0, name_len - str_index.length)}${str_index}.ts`;
                        } else {
                            if (next_name != line) {
                                processed_lines.pop();
                                if (processed_lines[processed_lines.length - 1] == '#EXT-X-DISCONTINUITY') {
                                    processed_lines.pop();
                                }
                                log(`删除${line}`);
                                continue;
                            } else {
                                index++;
                                const str_index = String(index);
                                next_name = `${pre_name.substring(0, name_len - str_index.length)}${str_index}.ts`;
                            }
                        }
                    }
                    processed_lines.push(line);
                }
                let processed_file = processed_lines.join('\n');
                return processed_file;
            }
        };
    }
})();