// ==UserScript==
// @name               通用_加载更多
// @name:zh-CN         通用_加载更多
// @name:en-US         Uni_More Message
// @description        通过 Shift 加左右方向键实现快速页面切换，配置为加载更多模式还可全自动操作。
// @version            2.0.4
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @grant              GM_log
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/458510/%E9%80%9A%E7%94%A8_%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/458510/%E9%80%9A%E7%94%A8_%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

/* 参数示范 / Config demo
{
    "remark": "备注信息 || 适配站点_页面描述 || 模板(适配站点)_页面描述",
    ...
    "match": ["元素选取器", "元素文本", "正则匹配路径、参数和段落"],
    "match": ["元素选取器", "正则匹配路径、参数和段落"],
    "match": ["元素选取器", "元素文本"],
    "match": ["正则匹配路径和参数"],
    "match": ["元素选取器"],
    ...
    "ele": {
        "more": "加载更多",
        "prev": "上一页",
        "next": "下一页"
    }
},
{
    "remark": "Remark info || Adapted site_Page description || Template(Adapted site)_Page description",
    ...
    "match": ["Element Selector", "Element Text", "RegExp match path, query and fragment"],
    "match": ["Element Selector", "RegExp match path, query and fragment"],
    "match": ["Element Selector", "Element Text"],
    "match": ["RegExp match domain and path"],
    "match": ["Element Selector"],
    ...
    "ele": {
        "more": "Load More",
        "prev": "Prev page",
        "next": "Next page"
    }
},
*/

'use strict';

// 定义配置(cfg)变量，元素快捷选择($(元素定位符))函数
let cfg = [
    {
        "remark": "Discuz!_全站",
        "match": ["#footer .borders > p:nth-child(2) a:nth-child(1)", "Discuz!", "^/(thread|forum|u|read).php$"],
        "ele": {
            "prev": "#fd_page_bottom .prev, .pgs .prev, .pg .pgb a",
            "next": "#fd_page_bottom .nxt, .pgs .nxt, .pg > a:last-child"
        }
    },
    {
        "remark": "PHPWind_全站",
        "match": ["#footer #windspend + br + a", "Pu!mdHd"],
        "ele": {
            "prev": () => {
                // 定义元素(ele)
                let ele = $(".pages li b");

                // 如果存在且非当前页面，就点击
                try {
                    ele = ele.parentNode.previousSibling.childNodes[0];
                    ele.href !== location.href ? ele.click() : '' ;
                }catch {}
            },
            "next": () => {
                // 定义元素(ele)
                let ele = $(".pages li b");

                // 如果存在且非当前页面，就点击
                try {
                    ele = ele.parentNode.nextSibling.childNodes[0];
                    ele.href !== location.href ? ele.click() : '' ;
                }catch {}
            }
        }
    },
    {
        "remark": "Flarum_帖子列表",
        "match": [".DiscussionList-loadMore button", "^/(t/.{2,})?$"],
        "ele": {
            "more": ".DiscussionList-loadMore button"
        }
    },
    {
        "remark": "WordPress-TwentyEleven 主题_投稿索引",
        "match": ["#page > #branding > hgroup", "^/(wp/)?(.+.html|(author|category|tag)/.+)?(page/[0-9].)?"],
        "ele": {
            "prev": ".wp-pagenavi .previouspostslink, #nav-below .nav-next a",
            "next": ".wp-pagenavi .nextpostslink, #nav-below, .nav-previous a"
        }
    },
    {
        "remark": "WordPress-TwentyFifteen 主题_投稿索引",
        "match": ["#page > #sidebar > #masthead", "^/(archives/(author|category|tag)/.+|search/.+)?(page/[0-9]+)?$"],
        "ele": {
            "prev": () => {
                // 定义元素(ele)
                let ele = $(".wp-pagenavi[role='navigation'] .current");

                // 如果存在且元素节点不是文本，就点击
                try {
                    ele = ele.previousSibling;
                    ele.nodeName !== "#text" ? ele.click() : '' ;
                }catch {}
            },
            "next": ".wp-pagenavi[role='navigation'] .current + a:not(.sfwppa-last)"
        }
    },
    {
        "remark": "WordPress_INN-AO 主题_全站",
        "match": ["#inn-user-menu__container", "^/((bbs|tag)/.+|search/-)$"],
        "ele": {
            "prev": ".poi-pager .poi-pager__item_prev",
            "next": ".poi-pager .poi-pager__item_next"
        }
    },
    {
        "remark": "WordPress_GridMe 主题_全站",
        "match": [".gridme-credit", "Design by ThemesDNA.com", "^/((category|archives/author|tag)/.+)?(page/[0-9].)?"],
        "ele": {
            "prev": ".nav-links .prev",
            "next": ".nav-links .next"
        }
    },
    {
        "remark": "VNDB_索引",
        "match": ["^vndb.org/.+$"],
        "ele": {
            "prev": ".maintabs .browsetabs li:first-child a[rel='prev']",
            "next": ".maintabs .browsetabs li:last-child a[rel='next']"
        }
    },
    {
        "remark": "Nyaa_索引",
        "match": ["^(sukebei.)?nyaa.si/$"],
        "ele": {
            "prev": ".pagination a[rel='prev']",
            "next": ".pagination a[rel='next']"
        }
    },
    {
        "remark": "琉璃神社-社区_用户动态和搜索",
        "match": ["^www.hacg.mom/wp/(bbs|participant/.{2,14}/paged/[0-9]{0,})?$"],
        "ele": {
            "prev": ".wpf-navi .wpf-prev-button",
            "next": ".wpf-navi .wpf-next-button"
        }
    },
    {
        "remark": "琉璃神社-社区_帖子列表",
        "match": ["^www.hacg.mom/wp/bbs$"],
        "ele": {
            "more": ".wpf-more-topics a"
        }
    },
    {
        "remark": "DuckDuckGo, 鸭鸭溜_搜索页",
        "match": ["^duckduckgo.com/$"],
        "ele": {
            "more": "[id^='rld-'] a"
        }
    },
    {
        "remark": "Yandex, 央捷科斯_搜索页",
        "match": ["^yandex.(com|ru)/search/$"],
        "ele": {
            "prev": () => {
                // 定义元素(ele)
                let ele = $("#pager__header_id + [role='list'] span");

                // 如果存在，就点击
                try {
                    ele = ele.previousSibling;
                    ele ? ele.click() : '' ;
                }catch {}
            },
            "next": "#pager__header_id + [role='list'] a:last-child"
        }
    },
    {
        "remark": "Google, 谷歌_搜索页",
        "match": ["^www.google.com/search$"],
        "ele": {
            "prev": "[role='navigation'] tr td:first-child a",
            "next": "[role='navigation'] tr td:last-child a"
        }
    },
    {
        "remark": "Bing, 必应_搜索页",
        "match": ["^(www|cn).bing.com/search$"],
        "ele": {
            "prev": ".b_pag ul li:first-child a:not(.sb_inactP)",
            "next": ".b_pag ul li:last-child a"
        }
    },
    {
        "remark": "哔哩哔哩_搜索",
        "match": ["^search.bilibili.com/"],
        "ele": {
            "prev": ".vui_pagenation button:first-child:not(.vui_button--disabled)",
            "next": ".vui_pagenation button:last-child:not(.vui_button--disabled)"
        }
    },
    {
        "remark": "哔哩哔哩_UP 主视频清单",
        "match": ["^space.bilibili.com/[0-9]+/video$"],
        "ele": {
            "prev": ".be-pager .be-pager-prev",
            "next": ".be-pager .be-pager-next"
        }
    },
    {
        "remark": "極彩花夢_投稿索引",
        "match": ["^kyokusai.com/(moe/)?((category|author)/.+)?(page/[0-9].)?$"],
        "ele": {
            "prev": ".pagination .page-item [aria-label^='Previous']",
            "next": ".pagination .page-item [aria-label^='Next']"
        }
    },
    {
        "remark": "hanime.tv_播放清单",
        "match": ["^hanime.tv/playlists/*"],
        "ele": {
            "more": ".panel__content > .btn"
        }
    },
    {
        "remark": "hanime.tv_搜索",
        "match": ["^hanime.tv/search$"],
        "ele": {
            "prev": ".pagination li:first-child button:not(.pagination__navigation--disabled)",
            "next": ".pagination li:last-child button:not(.pagination__navigation--disabled)"
        }
    },
    {
        "remark": "(Greasy|SleazyFork)Fork_搜索",
        "match": ["#site-name-text a", "Greasy Fork", "^/[a-zA-Z-]{1,5}/scripts(/libraries|/by-site/*)?"],
        "ele": {
            "prev": ".pagination .previous_page",
            "next": ".pagination .next_page"
        }
    },
    {
        "remark": "FreeBuf_投稿索引",
        "match": [".more-view .btn-text", "\n        查看更多内容\n      ", "/"],
        "ele": {
            "more": ".more-view .btn-text"
        }
    },
    {
        "remark": "WinSite_清单",
        "match": ["^www.winsite.com/[a-zA-Z-]+(/[a-zA-Z-]+)?/([0-9]+/)?$"],
        "ele": {
            "prev": "#main div[style='float: left;'] a:first-child",
            //"next": "#main div[style='float: left;'] a:last-of-type"
            "next": () => {
                // 定义元素(ele)变量。
                let ele = $("#main div[style='float: left;'] a:last-of-type");

                // 元素文本是“>”，就点击。
                if(ele.textContent === '>') {
                    ele.click();
                }
            },
        }
    },
],
    $ = ele => document.querySelector(ele);

// 等待 .3 秒
setTimeout(() => {
    // 遍历配置
    cfg.forEach((data) => {
        // 判断是否匹配
        if(data.match.length === 3 && $(data.match[0]) && $(data.match[0]).textContent === data.match[1] && new RegExp(data.match[2]).test(location.href.split(location.host)[1]) ||data.match.length === 2 && data.match[1][0] !== "^" && $(data.match[0]) && $(data.match[0]).textContent === data.match[1] || data.match.length === 2 && data.match[1][0] === "^" && $(data.match[0]) && new RegExp(data.match[1]).test(location.href.split(location.host)[1]) || data.match.length === 1 && data.match[0][0] === "^" && new RegExp(data.match[0]).test(location.host + location.pathname) || data.match.length === 1 && data.match[0][0] !== "^" && $(data.match[0])) {
            // 展示匹配配置
            GM_log(`加载更多 > 已载入配置“${data.remark}”。`)
            // 如果“更多”按钮选择器存在
            if(data.ele.more !== undefined) {
                // 监听页面滚动
                addEventListener('scroll', () => {
                    // 定义页面滚动位置(Pos)变量
                    let Pos = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

                    // 如果页面滚动位置大于 .75 且存在对应元素，点击加载更多元素
                    if(Pos > .75 && $(data.ele.more)) {
                        $(data.ele.more).click();
                    }
                });
            }else {
                // 否则，监听按键按下
                addEventListener('keydown', (e) => {
                    // 定义按下按键(Key)和按下转换键(Shift)变量
                    let Key = e.key,
                        Shift = e.shiftKey;

                    if(Shift && Key === 'ArrowRight') {
                        // 阻止默认事件
                        e.preventDefault();
                        // 如果按下右方向键就，尝试执行自定义函数，失败的话就尝试点击元素
                        try {
                            data.ele.next();
                        } catch {
                            $(data.ele.next) ? $(data.ele.next).click() : '' ;
                        }
                    }else if(Shift && Key === 'ArrowLeft') {
                        // 阻止默认事件
                        e.preventDefault();
                        // 如果按下左方向键就，尝试执行自定义函数，失败的话就尝试点击元素
                        try {
                            data.ele.prev();
                        } catch(e) {
                            $(data.ele.prev) ? $(data.ele.prev).click() : '' ;
                        }
                    };
                });
            }
        }
    })
}, 300);