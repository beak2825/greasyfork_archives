// ==UserScript==
// @name         wanwansub.com复制电驴磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://wanwansub.com/info/*
// @match        http://wanwansub.com/detail/*
// @match        https://wanwansub.com/info/*
// @match        https://wanwansub.com/detail/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/416381/wanwansubcom%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416381/wanwansubcom%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://wanwansub.com/info/632
(function() {
    'use strict';

    setTimeout(function () {
        $('.content-box').each(function(i, ul) {
            generateButton($(ul));
        });

        $('div.w-90\\%.flex.flex-wrap.h-150px.mt-20px').each(function(i, ul) {
            generateButtonV2($(ul));
        });
    }, 1000);

    function generateButton($container) {
        const link_arr = [];    // 电驴
        const link_arr2 = [];   // 磁力
        const link_arr3 = [];   // 115网盘
        const link_arr4 = [];   // UC网盘
        const link_arr5 = [];   // 百度网盘
        const link_arr6 = [];   // 阿里网盘
        const link_arr7 = [];   // 迅雷网盘
        const link_arr8 = [];   // 夸克网盘
        let last_filename = '';
        $container.find('p a').each(function(i, el) {
            let url = $(el).prop('href');
            let row_text = $(el).closest('p').text();
            let filename = row_text.split(/\s+|:|：/)[0];
            let link;
            let match_code;
            let code;
            let code_text;
            if (url.startsWith('ed2k')) {
                url = parseEd2k(url);
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 电驴下载' : filename}</a>`;
                link_arr.push(link);
            }
            if (url.startsWith('magnet')) {
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 磁力下载' : filename}</a>`;
                link_arr2.push(link);
            }
            if (url.startsWith('https://115.com') || url.startsWith('http://115.com')) {
                match_code = row_text.match(/115网?盘.+?(?:提取|访问)码[:：]\s*?(\w{4})/);
                code = match_code[1];
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 115盘下载' : filename}</a>，提取码：${code}。`;
                link_arr3.push(link);
            }
            if (url.startsWith('https://www.yun.cn') || url.startsWith('http://www.yun.cn')) {
                match_code = row_text.match(/UC网?盘.+?提取码[:：]\s*?(\w{4})/);
                code = match_code[1];
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 UC盘下载' : filename}</a>，提取码：${code}。`;
                link_arr4.push(link);
            }
            if (url.startsWith('https://pan.baidu.com') || url.startsWith('http://pan.baidu.com')) {
                match_code = row_text.match(/百?度网?盘.+?提取码[:：]\s*?(\w{4})/);
                // console.log('pan.baidu.com', row_text, match_code);
                code = match_code[1];
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>，提取码：${code}。`;
                link_arr5.push(link);
            }
            if (url.startsWith('https://www.aliyundrive.com') || url.startsWith('http://www.aliyundrive.com')) {
                match_code = row_text.match(/\s*阿里云盘.+?提取码[:：]\s*?(\w{4})/);
                if (match_code) {
                    code = match_code[1];
                }
                code_text = code ? `，提取码：${code}。` : '';
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 阿里云盘下载' : filename}</a>${code_text}`;
                link_arr6.push(link);
            }
            if (url.startsWith('https://pan.xunlei.com')) {
                match_code = row_text.match(/\s*迅雷云盘.+?提取码[:：]\s*?(\w{4})/);
                console.log('pan.xunlei.com', row_text, match_code);
                if (match_code) {
                    code = match_code[1];
                }
                code_text = code ? `，提取码：${code}。` : '';
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 迅雷云盘下载' : filename}</a>${code_text}`;
                link_arr7.push(link);
            }
            if (url.startsWith('https://pan.quark.cn')) {
                match_code = row_text.match(/\s*夸克网盘.+?提取码[:：]\s*?(\w{4})/);
                if (match_code) {
                    code = match_code[1];
                }
                code_text = code ? `，提取码：${code}。` : '';
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${isDupan(filename) ? '弯弯字幕 夸克网盘下载' : filename}</a>${code_text}`;
                link_arr8.push(link);
            }
        });

        if (link_arr.length) {
            link_arr.unshift('电驴下载(弯弯字幕)：');
            const $button_copy = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制电驴地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.append($button_copy);
        }
        if (link_arr2.length) {
            link_arr2.unshift('磁力下载(弯弯字幕)：');
            const $button_copy2 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制磁力地址</button>');
            $button_copy2.attr('data-clipboard-text', link_arr2.join("\n"));
            $container.append($button_copy2);
        }
        if (link_arr3.length) {
            link_arr3.unshift('115网盘下载(弯弯字幕)：');
            const $button_copy3 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制115网盘地址</button>');
            $button_copy3.attr('data-clipboard-text', link_arr3.join("\n"));
            $container.append($button_copy3);
        }
        if (link_arr4.length) {
            link_arr4.unshift('UC网盘下载(弯弯字幕)：');
            const $button_copy4 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制UC网盘地址</button>');
            $button_copy4.attr('data-clipboard-text', link_arr4.join("\n"));
            $container.append($button_copy4);
        }
        if (link_arr5.length) {
            link_arr5.unshift('百度网盘下载(弯弯字幕)：');
            const $button_copy5 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制百度网盘地址</button>');
            $button_copy5.attr('data-clipboard-text', link_arr5.join("\n"));
            $container.append($button_copy5);
        }
        if (link_arr6.length) {
            link_arr6.unshift('阿里云盘下载(弯弯字幕)：');
            const $button_copy6 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制阿里网盘地址</button>');
            $button_copy6.attr('data-clipboard-text', link_arr6.join("\n"));
            $container.append($button_copy6);
        }
        if (link_arr7.length) {
            link_arr7.unshift('迅雷云盘下载(弯弯字幕)：');
            const $button_copy7 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制迅雷网盘地址</button>');
            $button_copy7.attr('data-clipboard-text', link_arr7.join("\n"));
            $container.append($button_copy7);
        }
        if (link_arr8.length) {
            link_arr8.unshift('夸克网盘下载(弯弯字幕)：');
            const $button_copy8 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制夸克网盘地址</button>');
            $button_copy8.attr('data-clipboard-text', link_arr8.join("\n"));
            $container.append($button_copy8);
        }

        const all_link = combineArr([link_arr, link_arr2, link_arr5, link_arr4, link_arr3, link_arr6, link_arr7, link_arr8]);
        const $button_copy_all = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制所有地址</button>');
        $button_copy_all.attr('data-clipboard-text', all_link.join("\n"));
        $container.append($button_copy_all);
        new ClipboardJS('.imzhi_wanwansub_copy_url');
    }

    function generateButtonV2($container) {
        let link_arr8 = []; // 夸克
        let link_arr9 = []; // 百度
        let link_arr10 = []; // 迅雷
        let link = '';
        const code = '';
        let code_text = '';

        const url_baidu = getBaiduUrlV2();
        if (url_baidu.startsWith('https://pan.baidu.com')) {
            code_text = code ? `，提取码：${code}。` : '';
            link = `<a href="${url_baidu}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">弯弯字幕 百度网盘下载</a>${code_text}`;
            link_arr9.push(link);
        }

        const url_xunlei = getXunleiUrlV2();
        if (url_xunlei.startsWith('https://pan.xunlei.com')) {
            code_text = code ? `，提取码：${code}。` : '';
            link = `<a href="${url_xunlei}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">弯弯字幕 迅雷网盘下载</a>${code_text}`;
            link_arr10.push(link);
        }

        const url_quark = getQuarkUrlV2();
        if (url_quark.startsWith('https://pan.quark.cn')) {
            code_text = code ? `，提取码：${code}。` : '';
            link = `<a href="${url_quark}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">弯弯字幕 夸克网盘下载</a>${code_text}`;
            link_arr8.push(link);
        }

        if (link_arr9.length) {
            link_arr9.unshift('百度网盘下载(弯弯字幕)：');
            const $button_copy9 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制百度网盘地址</button>');
            $button_copy9.attr('data-clipboard-text', link_arr9.join("\n"));
            $container.after($button_copy9);
        }

        if (link_arr10.length) {
            link_arr10.unshift('迅雷网盘下载(弯弯字幕)：');
            const $button_copy10 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制迅雷网盘地址</button>');
            $button_copy10.attr('data-clipboard-text', link_arr10.join("\n"));
            $container.after($button_copy10);
        }

        if (link_arr8.length) {
            link_arr8.unshift('夸克网盘下载(弯弯字幕)：');
            const $button_copy8 = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制夸克网盘地址</button>');
            $button_copy8.attr('data-clipboard-text', link_arr8.join("\n"));
            $container.after($button_copy8);
        }

        const all_link = combineArr([link_arr9, link_arr10, link_arr8]);
        const $button_copy_all = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b;">复制所有地址</button>');
        $button_copy_all.attr('data-clipboard-text', all_link.join("\n"));
        $container.after($button_copy_all);
        new ClipboardJS('.imzhi_wanwansub_copy_url');
    }

    function getQuarkUrlV2() {
        const keys = Object.keys(unsafeWindow.__NUXT__.data);
        const res = unsafeWindow.__NUXT__.data[keys[0]].data[0].attributes.quark;
        return res ? res : '';
    }

    function getBaiduUrlV2() {
        const keys = Object.keys(unsafeWindow.__NUXT__.data);
        // console.log('unsafeWindow.__NUXT__.data', unsafeWindow.__NUXT__.data, unsafeWindow.__NUXT__.data[keys[0]].data)
        const res = unsafeWindow.__NUXT__.data[keys[0]].data[0].attributes.baidu;
        return res ? res : '';
    }

    function getXunleiUrlV2() {
        const keys = Object.keys(unsafeWindow.__NUXT__.data);
        const res = unsafeWindow.__NUXT__.data[keys[0]].data[0].attributes.thunder;
        return res ? res : '';
    }

    function parseFilename(url) {
        if (url.startsWith('ed2k://')) {
            const match = url.match(/\|file\|(.+?)\|\d+/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return false;
    }

    function parseThunderUrl(url) {
        url = url.replace('thunder://', '');
        url = Base64.decode(url).replace(/^AA/, '').replace(/ZZ$/, '');
        return url;
    }

    function parseEd2k(url) {
        if (url.indexOf('|') < 0) {
            url = decodeURI(url);
        }
        return url;
    }

    function isDupan(filename) {
        return filename === '度盘';
    }

    // 将几个数组合并，并从第二个数组开始增加空行（来自 FIX字幕侠复制链接）
    function combineArr(list_arr) {
        let result = [];
        list_arr.forEach(function(list_item) {
            const the_item = $.extend([], list_item);
            if (the_item.length <= 1) {
                return;
            }
            if (result.length) {
                the_item.unshift('')
            }
            result = result.concat(the_item);
        });
        return result;
    }
})();