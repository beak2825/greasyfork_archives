// ==UserScript==
// @name         💡 链接速览
// @namespace    https://ez118.github.io/
// @version      2.0.4
// @description  快速预览网页链接，鼠标移至链接并按下回车键即可预览。
// @author       ZZY_WISU
// @match        *://*/*
// @connect      *
// @license      GPLv3
// @icon         data:image/webp;base64,UklGRlIAAABXRUJQVlA4TEYAAAAvFAAFEA8wdtMxwfMf8GAb2baS8xUiyzWzKl5OB0TEVOFS1i8Oeojof2D5xugMRU2YEaFZafeiuZARmQgL76DPwVJD/k8A
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/zepto@1.2.0/dist/zepto.min.js
// @require      https://unpkg.com/@mozilla/readability@0.6.0/Readability.js
// @downloadURL https://update.greasyfork.org/scripts/462463/%F0%9F%92%A1%20%E9%93%BE%E6%8E%A5%E9%80%9F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462463/%F0%9F%92%A1%20%E9%93%BE%E6%8E%A5%E9%80%9F%E8%A7%88.meta.js
// ==/UserScript==

const contentEleSelList = {
    "blog.csdn.net": "#article_content",
    "zhuanlan.zhihu.com": ".Post-Main",
    "jingyan.baidu.com": "#format-exp",
    "zhidao.baidu.com": "#qb-content",
    "www.cnblogs.com": "#topics",
    "www.sohu.com": "#mp-editor"
}; /* 储存特定网站内容优化数据（文章主体的父元素） */

const mediaPrevSupport = [
    {
        "site": "https://v.youku.com/v_show/*.html",
        "player": "https://player.youku.com/embed/*",
        "type": "video"
    },{
        "site": "https://v.qq.com/x/page/*.html",
        "player": "https://v.qq.com/txp/iframe/player.html?vid=*",
        "type": "video"
    },{
        "site": "https://www.bilibili.com/video/BV*/",
        "player": "https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=*",
        "type": "video"
    },{
        "site": "https://www.bilibili.com/video/av*/",
        "player": "https://www.bilibili.com/blackboard/html5mobileplayer.html?aid=*",
        "type": "video"
    },{
        "site": "https://www.youtube.com/watch?v=*",
        "player": "https://www.youtube.com/embed/*",
        "type": "video"
    },{
        "site": "https://music.163.com/#/song?id=*",
        "player": "https://music.163.com/outchain/player?type=2&id=*&auto=0&height=66",
        "type": "music"
    },{
        "site": "https://music.163.com/song?id=*",
        "player": "https://music.163.com/outchain/player?type=2&id=*&auto=0&height=66",
        "type": "music"
    },{
        "site": "https://open.spotify.com/track/*",
        "player": "https://open.spotify.com/embed/track/*",
        "type": "music"
    },{
        "site": "https://music.apple.com/cn/song/*",
        "player": "https://embed.music.apple.com/cn/album/*",
        "type": "music"
    },{
        "site": "https://music.youtube.com/watch?v=*",
        "player": "https://www.youtube.com/embed/*",
        "type": "music"
    }
]; /* 储存支持预览播放视频/预览试听音乐的网站及其嵌入播放器链接 */


function judgeMediaSupport(url){
    let jflag = null;
    $.each(mediaPrevSupport, (index, item) => {
        if (url.includes(item.site.split("*")[0])) {
            jflag = { "state": true, "data": item };
        }
    })
    return jflag || { "state": false, "data": null };
}

function getWebContents(html, url) {
    /* 去掉影响转换的标签 */
    html = html.replace(/<script.*?>.*?<\/script>/gis, "")
        .replace(/<style.*?>.*?<\/style>/gis, "")
        .replace(/<nav.*?>.*?<\/nav>/gis, "")
        .replace(/<img\s+[^>]*src\s*=\s*["']{2}[^>]*>/gi, '')
        .replace(/<img([^>]*)onerror\s*=\s*(['"]?[^'">]*['"]?)([^>]*)>/gi, '<img$1$3>');

    /* 提取正文 */
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const readability = new Readability(doc);
    const result = readability.parse(doc);

    return result.content;
}

function openReader(url) {
    /* 打开阅读器 */

    /* 阅读器加载提示 */
    let closeBtn = $("#userscript-closeBtn").show();
    let previewReader = $("#userscript-webPreviewReader").show();

    previewReader.html(`<p style='font-size:22px;margin-top:33%;' align='center'>正在载入...<br/><span>${url}</span></p>`);

    /* 判断当前链接是支持预览的视频网站，并作出对应处理 */
    let showMedia = judgeMediaSupport(url);
    if(showMedia.state){
        /* 被支持的视频网站的处理 */
        var origUrl = url;
        var frameUrl = "";
        var mediaType = (showMedia.data.type == "video") ? "视频" : "音乐";

        /* 将链接参数与嵌入式播放器链接拼接 */
        url = url.replace(showMedia.data.site.split("*")[0], "");
		url = url + "?#";
		url = url.split("#")[0].split("?")[0];
		url = url.replace(showMedia.data.site.split("*")[1], "");

        frameUrl = showMedia.data.player.replace("*", url);

        previewReader.html(`
            <div id="FadeInContainer">
                <div style="height:48px;overflow:hidden;">
                    <p style="margin:16px 14px;font-size:medium;user-select:none;">${mediaType}预览</p>
                </div>
	        	<iframe class="FrameShow" src="${frameUrl}"></iframe><br>
	        	<a href="${origUrl}" target="_blank">在原网站中继续 &nbsp; ▶ </a><br/>
                <a href="${frameUrl}" target="_blank">在播放器中继续 &nbsp; ▶ </a>
            </div>`);
    } else {
        /* 普通网站的处理 */
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            onload: (response) => {
                var result = response.responseText;

                if (!result) {
                    previewReader.html(`<p style='font-size:22px;margin-top:33%;' align='center'>请求失败<br/><span>${url}</span></p>`);
                    return;
                }

                /* 对指定网站进行内容过滤，指定元素获取 */
                let orig_result_backup = result;
                const domain = url.split("/")[2];
                if (contentEleSelList[domain]) {
                    try {
                        const selector = contentEleSelList[domain];
                        result = $(result).find(selector).html();
                    } catch (e) { console.log("[WebPrvw] 特殊优化出现问题"); }
                }
                if (!result) { result = orig_result_backup; }

                /* 调用解析网页 */
                let web_content = getWebContents(result, url);

                /* 将所有结果添加进阅读器，并显示 */
                previewReader.html(`
                    <div id="FadeInContainer">
                        <div style="height:48px;overflow:hidden;">
                            <p style="margin:16px 14px;font-size:medium;user-select:none;">正文预览</p>
                        </div>
	            	    <div class="ContentShow">${web_content}</div>
                    </div>`);

            },
            onerror: () => {
                previewReader.html(`<p style='font-size:22px;margin-top:33%;' align='center'>请求失败</p>`);
            }
        });
    }
}

function initQuickView(){
    const domain = window.location.href.split("/")[2];
    if (contentEleSelList[domain]) {
        const quickBtn = $("<button class='userscript-closeBtn' style='z-index:9998;top:unset;bottom:15px;right:20px;'>速览</button>").appendTo('body');
        quickBtn.click(() => openReader(window.location.href));
    }
}

function initEvent() {
    // 创建提示框
    const tooltip = $('<div class="userscript-webPreviewTooltip" style="display:none;"></div>').appendTo('body');

    // 获取所有有效的 a 标签
    const $links = $('a:not(#userscript-webPreviewReader)');

    // 过滤出有效链接（非 javascript: 和 mailto:）
    const $validLinks = $links.filter(function() {
        const href = $(this).attr('href');
        return href && !href.startsWith('javascript:') && !href.startsWith('mailto:');
    });

    // 绑定鼠标悬停事件
    $validLinks.on('mouseover', function(e) {
        const rect = this.getBoundingClientRect();
        tooltip.css({
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY - 30,
            display: 'block'
        });
        tooltip.text('回车以预览');
    }).on('mouseout', () => {
        tooltip.hide();
    });

    // 记录当前鼠标悬停的链接
    let hoveredLink = null;

    $(document).on('mousemove', (e) => {
        let LinkCounter = 0;
        $validLinks.each(function() {
            const rect = this.getBoundingClientRect();
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                hoveredLink = this;
                LinkCounter += 1;
            }
        });
        if(LinkCounter <= 0) {
            hoveredLink = null;
        }
    });

    // 监听 Enter 键
    $(document).on('keydown', (e) => {
        if (e.key.toLowerCase() == 'enter' && hoveredLink) {
            openReader(hoveredLink.href);
        }
    });
}
/* =========================== */


function init(){
    /* 初始化 */

    /* 插入样式 */
    GM_addStyle(`
        :root{--bg-color:#FFFFFFAA;--text-color:#386a1f;--border-color:#285a0f;--hover-bg-color:#edf1e5;--active-bg-color:#d7e1cd;--close-btn-bg:#386a1f;--close-btn-text:#FFF;--reader-bg:#fdfdf6;--reader-text-color:#131f0d;--link-color:#386a1f;--link-hover:#487631;--pre-bg-color:#eeeee8;--pre-border-color:#dee5d8;--code-bg-color:#e2e3dd}
        @media (prefers-color-scheme:dark){:root{--bg-color:#00390a55;--text-color:#7edb7b;--border-color:#7edb7b;--hover-bg-color:#00390aAA;--active-bg-color:#7edb7b;--close-btn-bg:#7edb7b;--close-btn-text:#00390a;--reader-bg:#1a1c19;--reader-text-color:#e2e3dd;--link-color:#7edb7b;--link-hover:#76cd74;--pre-bg-color:#1e201d;--pre-border-color:#424940;--code-bg-color:#42494047}}

        .userscript-webPreviewTooltip{position:absolute;z-index:9999;user-select:none;background:var(--active-bg-color);color:var(--close-btn-text);padding:1px 8px;font-size:12px;font-weight:normal;height:fit-content;border-radius:16px;border:1px solid var(--border-color);}
        .userscript-closeBtn{position:fixed;top:calc(8% + 5px);right:18px;z-index:100000;background:var(--close-btn-bg);color:var(--close-btn-text);padding:8px 20px;margin:6px;border-radius:30px;font-weight:bold;border:0;border-bottom:1px solid var(--border-color);cursor:pointer}
        .userscript-closeBtn:hover{background:var(--link-hover)}
        .userscript-webPreviewReader{font-size:medium;text-align:left;position:fixed;top:8vh;right:10px;bottom:0px;z-index:99999;width:35%;height:calc(100vh - 8%);min-width:340px;background:var(--reader-bg);color:var(--reader-text-color);overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.1),0 2px 4px 1px rgba(0,0,0,.18);border-radius:28px 28px 0px 0px}

        .userscript-webPreviewReader .FrameShow{width:calc(100% - 16px);height:calc(100% - 120px);min-height:300px;background:var(--code-bg-color);border:none;border-radius:30px;margin:8px 8px;box-shadow:0 .5px 1.5px 0 rgba(0,0,0,.19),0 0 1px 0 rgba(0,0,0,.039)}
        .userscript-webPreviewReader #FadeInContainer{overflow-y:scroll;overflow-x:hidden;border-radius:15px 15px 0px 0px;width:100%;height:100%}

        #FadeInContainer .ContentShow{padding:16px;margin:8px;background:var(--code-bg-color);border-radius:30px;overflow:hidden;color:var(--reader-text-color);box-shadow:0 .5px 1.5px 0 rgba(0,0,0,.19),0 0 1px 0 rgba(0,0,0,.039)}
        .ContentShow * { background:none!important; background-color:none!important; }
        #FadeInContainer img{max-width:92% !important;max-height:85vh !important;position:relative !important;top:0 !important;left:0 !important;border-radius:10px}
        #FadeInContainer svg{max-width:40% !important;max-height:60vh !important;position:relative !important;top:0 !important;left:0 !important;border-radius:10px}
        #FadeInContainer a{color:var(--link-color);text-decoration:underline 1px solid var(--link-hover);margin:0px 3px}
        #FadeInContainer code{font-family:Consolas,Courier,Courier New,monospace;user-select:text!important;}
        #FadeInContainer pre{color:var(--reader-text-color);background:var(--pre-bg-color);width:90%;padding:5px;margin:5px 0px;overflow-y:auto;height:fit-content;border:1px solid var(--pre-border-color);border-radius:5px;user-select:text!important;}
        #FadeInContainer code:not(pre code){color:var(--reader-text-color);background:var(--code-bg-color);border-radius:0.25rem;padding:.125rem .375rem;line-height:1.75;word-wrap:break-word;border:1px solid var(--pre-border-color)}
        #FadeInContainer table {width:100%;text-align:left;border-collapse:collapse;border-spacing:0;border:1px solid var(--pre-border-color);border-radius:0.25rem;word-wrap:break-word;}
        #FadeInContainer table tr {border:1px solid var(--pre-border-color);}
        #FadeInContainer table td {border:1px solid var(--pre-border-color);}
    `);

    /* 页面加载时插入DOM */
    /* 阅读器 */
    if($("#userscript-webPreviewReader").length == 0){
        const previewReader = $('<div>', {
            class: 'userscript-webPreviewReader',
            id: 'userscript-webPreviewReader'
        }).appendTo('body');

        const closeBtn = $('<button>', {
            text: '关闭',
            class: 'userscript-closeBtn',
            id: 'userscript-closeBtn',
        }).appendTo('body');

        closeBtn.on('click', () => {
            previewReader.empty();
            previewReader.hide();
            closeBtn.hide();
        });
    }

    /* 隐藏阅读器 */
    $("#userscript-webPreviewReader").hide();
    $("#userscript-closeBtn").hide();

    /* 自动匹配搜索结果并插入按钮 */
    initEvent();
    initQuickView();

    return;
}

(function() {
    'use strict';
    if (window == window.top) { init(); }
})();