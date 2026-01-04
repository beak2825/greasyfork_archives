// ==UserScript==
// @name         UHance 页面优化
// @namespace    https://gitee.com/albert_zhong
// @version      0.1.1
// @description  常用网站ui优化工具
// @author       Albert Z
// @match        *://www.baidu.com/s*
// @match        *://shequ.codemao.cn/*
// @match        *://*.bing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441381/UHance%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441381/UHance%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

function addStyle(code) {
    var style = document.createElement('style'),
        head = document.head || document.getElementsByTagName('head')[0];
    style.type = 'text/css';
    if (style.styleSheet) {
        let func = function () {
            try {
                style.styleSheet.code = code;
            } catch (e) {

            }
        }
        if (style.styleSheet.disabled) {
            setTimeout(func, 10);
        } else {
            func();
        }
    } else {
        var textNode = document.createTextNode(code);
        style.appendChild(textNode);
    }
    head.appendChild(style);
}

var rules = {};

rules['shequ.codemao.cn'] = function () {
    let removes = {};
    removes['shequ.codemao.cn/course'] = ['r-course--banner'];
    removes['shequ.codemao.cn/discover'] = [];
    removes['shequ.codemao.cn/work_shop'] = ['r-work_shop--banner'];
    removes['shequ.codemao.cn/community'] = ['r-community--bulletin_container', 'r-community--notic_item_icon_hot',
        'c-post_list--status_icon c-post_list--hot', 'c-post_list--status_icon c-post_list--up', 'r-community--roules_btn'
    ];
    removes['shequ.codemao.cn/mall'] = ['r-mall-r-home--banner'];
    removes['shequ.codemao.cn/gallery'] = ['r-gallery--banner'];
    removes['shequ.codemao.cn'] = ['r-home--guide_part', 'r-home-c-workshop_area--workshop_work'];
    // shequ.codemao.cn
    window.onload = function () {
        // 重定向anchor标签
        let anchors = [...document.getElementsByClassName('c-navigator--nav_wrap')[0].getElementsByTagName('a')].slice(0, 7);
        for (let i = 0; i < anchors.length; i++) {
            let a = anchors[i];
            let url = a.href;
            a.onclick = function () { window.location.href = url; };
        }
        // 论坛区延迟执行（适应XHR）
        if (window.location.href.indexOf('shequ.codemao.cn/community') > -1) {
            setTimeout(function () {
                let url = 'shequ.codemao.cn/community';
                for (let cn in removes[url]) {
                    let ele = document.getElementsByClassName(removes[url][cn]);
                    if (ele.length) {
                        // 隐藏元素
                        for (let i = 0; i < ele.length; i++) {
                            ele[i].style.display = 'none';
                        }
                        // 增加上边距
                        if (window.location.href != 'https://shequ.codemao.cn/community') {
                            let main = document.getElementsByClassName('r-index--main_cont')[0];
                            main.style.marginTop = '5%';
                        }
                    }
                }
            }, 1000);
            // 解析屏蔽词
            if (window.location.href.startsWith('https://shequ.codemao.cn/community/')) {
                let id = window.location.href.replace('https://shequ.codemao.cn/community/', '');
                let httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', 'https://api.codemao.cn/web/forums/posts/' + id + '/details', true);
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        let data = eval('(' + httpRequest.responseText + ')');
                        let content = document.getElementsByClassName('r-community-r-detail--forum_content')[0];
                        content.innerHTML = data.content;
                    }
                };
                // 重新高亮代码
                setTimeout(function () {
                    Prism.highlightAll();
                }, 1000);
            }
            // 其余页面
        } else {
            for (let url in removes) {
                if (window.location.href.indexOf(url) > -1) {
                    for (let cn in removes[url]) {
                        let ele = document.getElementsByClassName(removes[url][cn]);
                        if (ele.length) {
                            // 隐藏部分元素
                            for (let i = 0; i < ele.length; i++) {
                                ele[i].style.display = 'none';
                            }
                            // 增加上边距
                            if (window.location.href != 'https://shequ.codemao.cn/' && window.location.href != 'https://shequ.codemao.cn/community') {
                                let main = document.getElementsByClassName('r-index--main_cont')[0];
                                main.style.marginTop = '5%';
                            }
                        }
                    }
                }
            }
        }
    }
}

rules['baidu.com'] = function () {
    window.onload = function () {
        let removes = ['foot-container_2X1Nt', 'rs-normal-width_2T91A', 'c-tools tools_47szj', 'kuaizhao_21-Ez c-gap-left-small c-color-gray2 kuaizhao'];
        setTimeout(function () {
            // 删除无意义图标
            let ele = document.getElementsByTagName('i');
            for (let i = 0; i < ele.length; i++)
                if (ele[i].classList.length < 1)
                    ele[i].style.display = 'none';
            // 删除多余部分
            for (let cn in removes) {
                let ele = document.getElementsByClassName(removes[cn]);
                for (let i = 0; i < ele.length; i++)
                    ele[i].style.display = 'none';
            }
        }, 1000);
    }
}

rules['bing.com'] = function () {
    window.onload = function () {
        let removes = ['ev_talkbox_cn_min', 'b_attribution', 'b_footer', 'b_rs'];
        setTimeout(function () {
            // 删除部分内容
            for (let cn in removes) {
                let ele = document.getElementsByClassName(removes[cn]);
                for (let i = 0; i < ele.length; i++)
                    ele[i].style.display = 'none';
            }
        }, 1500);
    }
}

// 主程序运行
for (let url in rules) {
    if (window.location.href.indexOf(url) > -1) {
        let func = rules[url];
        func();
        break;
    }
}