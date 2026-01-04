// ==UserScript==
// @name         Baidu++：为百度搜索结果页添加磁力、种子、网盘、软件、头条、哔哩哔哩、知乎、CSDN、Google搜索按钮，为Google添加百度搜索按钮
// @description  给百度搜索引擎的结果页加入头条、哔哩哔哩、软件、网盘搜索按钮，一键跳转到磁力、种子、网盘、软件、头条、哔哩哔哩、Google搜索进行相同关键词的检索；在google搜索结果页添加百度搜索按钮，一键跳转到百度搜索进行相同关键词的检索。支持去除百度结果页面的广告和右边栏。
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/396960
// @license      MIT
// @version      1.9.5
// @author       ddrwin
// @run-at       document-end
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://*.baidu.com/s*
// @match        *://*.baidu.com/baidu*
// @match        *://www.google.com/search*
// @match        *://www.google.com.*/search*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @note         2020.2.22 V1.0 在百度搜索的结果页加入磁力、种子、网盘、Google搜索按钮；
// @note         2020.2.23 V1.1 在google搜索的结果页加入百度搜索按钮；
// @note         2020.2.25 V1.2 增加软件搜索、增加头条搜索、哔哩哔哩搜索；
// @note         2020.2.26 V1.3 重写代码，将种子搜索、磁力搜索集成到网盘搜索中、同时软件搜索增加多个搜索网址；
// @note         2020.2.27 V1.4 今日头条和bilibili集成到头条搜索中，知乎和CSDN集成到问答搜索中；
// @note         2020.5.30 V1.5 网盘搜索增加新的搜索结果，软件搜索增加大眼仔、微当、小众软件，问答搜索增加微信搜索、百度知道并整合哔哩哔哩，头条搜索增加移动端搜索；
// @note         2021.3.4 V1.6 网盘搜索增加新的搜索结果，软件搜索去除失效链接，问答搜索改成破解下载搜索、问答搜索里增加今日头条搜索；
// @note         2022.1.23 V1.7 合并软件搜索和破解搜索，问答搜索增加bilibili和驱动之家，增加行研搜索，去除失效的搜索入口；
// @note         2022.3.3 V1.8 更新网盘搜索，问答搜索增加IT之家，去除失效的搜索入口；
// @note         2024.1.29 V1.9 更新软件搜索，AI问答增加文心一言、讯飞星火、天工，去除失效的搜索入口；
// @note         2025.11.30 V1.9.5 修复关键词获取问题，确保所有搜索按钮都能正确带上搜索词；
// @downloadURL https://update.greasyfork.org/scripts/396960/Baidu%2B%2B%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E3%80%81%E7%A7%8D%E5%AD%90%E3%80%81%E7%BD%91%E7%9B%98%E3%80%81%E8%BD%AF%E4%BB%B6%E3%80%81%E5%A4%B4%E6%9D%A1%E3%80%81%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81CSDN%E3%80%81Google%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%8C%E4%B8%BAGoogle%E6%B7%BB%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/396960/Baidu%2B%2B%EF%BC%9A%E4%B8%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E3%80%81%E7%A7%8D%E5%AD%90%E3%80%81%E7%BD%91%E7%9B%98%E3%80%81%E8%BD%AF%E4%BB%B6%E3%80%81%E5%A4%B4%E6%9D%A1%E3%80%81%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81CSDN%E3%80%81Google%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%EF%BC%8C%E4%B8%BAGoogle%E6%B7%BB%E5%8A%A0%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hostname = window.location.hostname;

    // 通用按钮样式（固定样式，直接改数值即可）
    const buttonStyle = `
        display: inline-block;
        font-size: 14px;
        text-align: center;
        text-decoration: none;
        width: 100px;
        height: 33px;
        line-height: 33px;
        margin: 0 5px; /* 按钮之间的左右间距，可改 */
        -webkit-appearance: none;
        -webkit-border-radius: 4px;
        border: 0;
        color: #fff;
        letter-spacing: 1px;
        outline: medium;
        cursor: pointer;
    `;

    // 按钮容器样式（直接写CSS位移：top控制上下，transform控制左右横移）
    const containerStyle = `
        position: absolute;
        top: 40px; /* 按钮向下平移的距离（改此值调上下） */
        left: 0;
        transform: translateX(0px); /* 按钮左右横移（正数右移/负数左移，可改） */
        padding: 10px 0;
        width: 100%;
        z-index: 999;
    `;

    // 获取搜索关键词的通用函数
    function getSearchKeyword() {
        // 方法1: 从搜索输入框获取
        const searchInput = document.querySelector('#chat-input-main, #kw, input[name="wd"], input[name="word"]');
        if (searchInput && searchInput.value) {
            return searchInput.value;
        }

        // 方法2: 从URL参数获取
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('wd') || urlParams.get('word') || urlParams.get('q');
        if (keyword) {
            return decodeURIComponent(keyword);
        }

        // 方法3: 从页面标题获取（备选方案）
        const title = document.title;
        const match = title.match(/(.+?) - 百度搜索/);
        if (match && match[1]) {
            return match[1];
        }

        return '';
    }

    if (hostname.match(/baidu\.com/)) {
        // 全局样式（直接写死，改数值即可调整位置）
        GM_addStyle(`
            /* 移除广告和右侧栏 */
            #content_right { display: none !important; }
            .c-container:has(.f13>span:contains("广告")) { display: none !important; }

            /* ========== 1. 搜索框容器底部空间（改数值调搜索框下方空白） ========== */
            .s_form.s_form_fresh { padding-bottom: 40px !important; }

            /* ========== 2. 更多搜索工具：margin-top控制上下，padding-bottom控制下方空白 ========== */
            #s_tab_inner {
                margin-top: 40px !important; /* 更多搜索工具向下移的距离 */
            }

            .options_2Vntk {
                margin-top: 11px !important;
            }

            /* ========== 3. 相关搜索词：margin-top控制上下，padding-bottom控制下方空白 ========== */
            .tag-scroll_3EMBO {
                margin-top: 40px !important; /* 相关搜索词向下移的距离 */
                padding-bottom: 0px !important; /* 相关搜索词下方空白 */
            }

            /* ========== 4. 搜索结果区域：margin-top控制向下移的距离 ========== */
            #content_left { margin-top: 30px !important; }

            /* ========== 5. 搜索结果区域：搜索结果护眼色背景 ========== */
            ._content-border_1q9is_4 {
                background-color: #f0f9e8 !important; /* 柔和淡绿色护眼色，可替换成#e6f7ff（淡蓝）等 */
            }
        `);

        // 等待搜索框容器加载完成
        const observer = new MutationObserver((mutations, obs) => {
            const searchContainer = $('#chat-input-main').parent();
            if (searchContainer.length) {
                obs.disconnect();
                searchContainer.css('position', 'relative'); // 作为按钮定位基准
                initBaiduButtons(searchContainer);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 初始化自定义搜索按钮
        function initBaiduButtons(parentContainer) {
            const container = $(`<div style="${containerStyle}"></div>`);
            parentContainer.append(container);

            // 软件搜索按钮
            container.append(`<input type="button" id="soft_pojie" value="软件搜索" style="${buttonStyle} background:#FF9966; border-bottom:1px solid #FF9900;" onmouseover="this.style.background='#FF9933'" onmouseout="this.style.background='#FF9966'">`);
            $('#soft_pojie').click(() => {
                const kw = encodeURIComponent(getSearchKeyword());
                if (kw) {
                    window.open(`https://github.com/search?q=${kw}`);
                    window.open(`https://www.baidu.com/s?wd=${kw}%20site:www.52pojie.cn`);
                    window.open(`https://www.baidu.com/s?wd=${kw}%20site:geekotg.com`);
                    window.open(`https://www.baidu.com/s?wd=${kw}%20site:weidown.com`);
                    window.open(`https://www.ypojie.com/?s=${kw}`);
                    window.open(`http://www.th-sjy.com/?s=${kw}`);
                    window.open(`https://www.sixyin.com/?s=${kw}&type=post`);
                    window.open(`http://www.qiuquan.cc/?s=${kw}`);
                    window.open(`http://www.dayanzai.me/?s=${kw}`);
                    window.open(`https://search.gndown.com/?s=${kw}`);
                    window.open(`https://www.ghpym.com/?s=${kw}`);
                }
            });

            // 网盘搜索按钮
            container.append(`<input type="button" id="magnet_torrent_baidupan" value="网盘搜索" style="${buttonStyle} background:#3385ff; border-bottom:1px solid #2d78f4;" onmouseover="this.style.background='#317ef3'" onmouseout="this.style.background='#3385ff'">`);
            $('#magnet_torrent_baidupan').click(() => {
                const kw = encodeURIComponent(getSearchKeyword());
                if (kw) {
                    window.open(`https://kickass.sx/usearch/${kw}/`);
                    window.open(`https://pirate-bays.net/search?q=${kw}`);
                    window.open(`https://www.nmme.cc/s/1/?wd=${kw}`);
                    window.open(`https://www.wuyasou.com/search?keyword=${kw}`);
                    window.open(`https://www.baidu.com/s?wd=${kw}%20网盘下载`);
                    window.open(`https://www.baidu.com/s?wd=${kw}%20百度网盘`);
                }
            });


            // 行研搜索按钮
            container.append(`<input type="button" id="wendang" value="行研搜索" style="${buttonStyle} background:#6633FF; border-bottom:1px solid #3333FF;" onmouseover="this.style.background='#3333FF'" onmouseout="this.style.background='#6633FF'">`);
            $('#wendang').click(() => {
                const kw = encodeURIComponent(getSearchKeyword());
                if (kw) {
                    window.open(`https://www.opp2.com/?sk=${kw}`);
                    window.open(`http://www.icdo.com.cn/?s=${kw}`);
                    window.open(`https://s.iresearch.cn/search/${kw}/`);
                    window.open(`https://www.iimedia.cn/search.html?kw=${kw}`);
                    window.open(`http://www.aliresearch.com/cn/search?queryName=${kw}`);
                    window.open(`https://baogao.store/?s=${kw}&post_type=post`);
                    window.open(`http://search.199it.com/?q=${kw}`);
                    window.open(`https://www.analysys.cn/es/search?keyword=${kw}`);
                    window.open(`https://wenku.baidu.com/search?word=${kw}`);
                    window.open(`https://36kr.com/search/articles/${kw}`);
                    window.open(`https://www.zhihu.com/search?type=content&q=${kw}`);
                }
            });


            // AI问答按钮
            container.append(`<input type="button" id="AI" value="AI问答" style="${buttonStyle} background:#66CC00; border-bottom:1px solid #00CC00;" onmouseover="this.style.background='#33CC00'" onmouseout="this.style.background='#66CC00'">`);
            $('#AI').click(() => {
                const kw = encodeURIComponent(getSearchKeyword());
                if (kw) {
                    // 对于不需要关键词的直接打开
                    window.open('https://search.tiangong.cn/');
                    window.open('https://xinghuo.xfyun.cn/desk');
                    window.open('https://yiyan.baidu.com/');
                    // 需要关键词的搜索
                    window.open(`https://www.ithome.com/search/${kw}.html`);
                    window.open(`https://search.bilibili.com/all?keyword=${kw}&order=pubdate`);
                    window.open(`https://weixin.sogou.com/weixin?type=2&query=${kw}`);
                    window.open(`https://www.zhihu.com/search?type=content&q=${kw}`);
                    window.open(`https://so.toutiao.com/search?dvpf=pc&source=input&keyword=${kw}`);
                }
            });
			
			
			// Google搜索按钮
            container.append(`<input type="button" id="google" value="Google搜索" style="${buttonStyle} background:#CC3333; border-bottom:1px solid #CC0033;" onmouseover="this.style.background='#CC0033'" onmouseout="this.style.background='#CC3333'">`);
            $('#google').click(() => {
                const kw = encodeURIComponent(getSearchKeyword());
                if (kw) {
                    window.open(`https://www.google.com/search?q=${kw}`);
                }
            });
			

        }
    }
    // Google页面按钮保持原有逻辑
    else if (hostname.match(/google\.com/)) {
        document.addEventListener("DOMContentLoaded", () => {
            const searchInput = $(".gLFyf.gsfi:first");
            if (searchInput.length) {
                $(".RNNXgb:first").append(`<div style="display:inline-block; margin-left:10px;"><button id="google++" type="button" style="height:36px; padding:0 16px; border:none; border-radius:4px; background:#3385ff; color:white; cursor:pointer; font-size:14px;" title="使用百度搜索">百度一下</button></div>`);

                function updateBaiduUrl() {
                    const keyword = searchInput.val() || new URLSearchParams(window.location.search).get('q') || '';
                    const url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
                    $("#google++").attr('onclick', `window.open('${url}')`);
                }

                updateBaiduUrl();
                searchInput.on("input", updateBaiduUrl);
            }
        });
    }

    GM_registerMenuCommand("反馈建议", () => {
        window.open("https://greasyfork.org/zh-CN/scripts/396960/feedback");
    });
})();