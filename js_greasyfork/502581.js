// ==UserScript==
// @name         🔍 聚合快搜
// @namespace    https://ez118.github.io/
// @version      0.5.1
// @description  为Via设计的第三方聚合搜索栏
// @author       ZZY_WISU
// @match        *://*/*
// @license      GPLv3
// @icon         data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEyOCAxMjgiPjxjaXJjbGUgY3g9IjY0IiBjeT0iNjQiIHI9IjY0IiBzdHlsZT0iZmlsbDojZjJmN2ZmIi8+PGNpcmNsZSBjeD0iMzUiIGN5PSI2MCIgcj0iMjAiIHN0eWxlPSJmaWxsOiMwMGE1ZjYiLz48Y2lyY2xlIGN4PSI2MCIgY3k9Ijc5IiByPSIyNSIgc3R5bGU9ImZpbGw6I2ZmM2UwMCIvPjxjaXJjbGUgY3g9Ijg4LjQiIGN5PSI1MCIgcj0iMzAuMiIgc3R5bGU9ImZpbGw6I2ZmYjcwMCIvPjwvc3ZnPg==
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        window.onurlchange
// @require      https://unpkg.com/zepto@1.2.0/dist/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/502581/%F0%9F%94%8D%20%E8%81%9A%E5%90%88%E5%BF%AB%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/502581/%F0%9F%94%8D%20%E8%81%9A%E5%90%88%E5%BF%AB%E6%90%9C.meta.js
// ==/UserScript==



/* =====[ 用户自定义 ]===== */

var searchEngine = [
    {
        "id":"google",
        "name":"Google",
        "link":"https://www.google.com/search?q=%s"
    },
    {
        "id":"bing",
        "name":"Bing",
        "link":"https://www.bing.com/search?q=%s"
    },
    {
        "id":"duckduckgo",
        "name":"DuckDuckGo",
        "link":"https://duckduckgo.com/?t=h_&q=%s"
    },
    {
        "id":"github",
        "name":"Github",
        "link":"https://github.com/search?q=%s&type=repositories"
    },
    {
        "id":"cnbing",
        "name":"必应",
        "link":"https://cn.bing.com/search?q=%s"
    },
    {
        "id":"zhihu",
        "name":"知乎",
        "link":"https://www.zhihu.com/search?q=%s&type=content&utm_id=0"
    },
    {
        "id":"baidu",
        "name":"百度",
        "link":"https://www.baidu.com/s?wd=%s"
    }
];



/* =====[ 变量存储 ]===== */

const ICONS = {
    'settings': '<svg viewBox="0 0 24 24" width="20px" height="20px"><path d="m19.44 12.99-.01.02c.04-.33.08-.67.08-1.01 0-.34-.03-.66-.07-.99l.01.02 2.44-1.92-2.43-4.22-2.87 1.16.01.01c-.52-.4-1.09-.74-1.71-1h.01L14.44 2H9.57l-.44 3.07h.01c-.62.26-1.19.6-1.71 1l.01-.01-2.88-1.17-2.44 4.22 2.44 1.92.01-.02c-.04.33-.07.65-.07.99 0 .34.03.68.08 1.01l-.01-.02-2.1 1.65-.33.26 2.43 4.2 2.88-1.15-.02-.04c.53.41 1.1.75 1.73 1.01h-.03L9.58 22h4.85s.03-.18.06-.42l.38-2.65h-.01c.62-.26 1.2-.6 1.73-1.01l-.02.04 2.88 1.15 2.43-4.2s-.14-.12-.33-.26zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5"></path></svg>',
    'up': '<svg viewBox="0 0 24 24" width="20px" height="20px"><path d="m7 14 5-5 5 5z"></path></svg>',
    'del': '<svg viewBox="0 0 24 24" width="20px" height="20px"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'
};

var currentEngine = null; /* 存储当前正在使用的搜索引擎 */
var currentQuery = null; /* 存储当前检索词 */

/* =====[ 计算反色 ]===== */

function invertHex(hex) {
    hex = hex.replace("#", "");

    // 补全短的 hex 颜色代码
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // 确保 hex 长度为 6
    if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
    }

    // 计算反色
    let inverted = (Number(`0x${hex}`) ^ 0xFFFFFF).toString(16).toUpperCase();

    // 补全不足位数的 0
    inverted = ("000000" + inverted).slice(-6);

    return `#${inverted}`;
}

function invertRgb(rgb) {
    // 匹配 rgb(r, g, b) 格式
    const match = rgb.match(/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/);
    if (!match) {
        throw new Error("Invalid RGB color.");
    }

    const r = 255 - parseInt(match[1], 10);
    const g = 255 - parseInt(match[2], 10);
    const b = 255 - parseInt(match[3], 10);

    return `rgb(${r}, ${g}, ${b})`;
}

function invertRgba(rgba) {
    // 匹配 rgba(r, g, b, a) 格式
    const match = rgba.match(/^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (0|0?\.\d+|1(\.0)?)\)$/);
    if (!match) {
        throw new Error("Invalid RGBA color.");
    }

    const r = 255 - parseInt(match[1], 10);
    const g = 255 - parseInt(match[2], 10);
    const b = 255 - parseInt(match[3], 10);

    return `rgba(${r}, ${g}, ${b}, 1)`;
}
function invertColor(color) {
    if (color.startsWith("#")) {
        return invertHex(color);
    } else if (color.startsWith("rgb(")) {
        return invertRgb(color);
    } else if (color.startsWith("rgba(")) {
        return invertRgba(color);
    } else {
        throw new Error("Invalid color format.");
    }
}

/* ================ */




function hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}

function findByKeyValue(array, key, value) {
    /* 在JSON中，以键值匹配项 */
    return array.findIndex(item => item[key] === value);
}

function isSearchEngine() {
    /* 判断是否是被记录的搜索页 */
    const currentUrl = new URL(window.location.href);
    return searchEngine.some(engine => {
        const prefix = engine.link.split('%s')[0];
        const engineUrl = new URL(prefix);
        return currentUrl.hostname === engineUrl.hostname && currentUrl.pathname.startsWith(engineUrl.pathname);
    });
}

function showOption() {
    if($("#userscript-optDlg").length > 0) { return; }

    let newEngineList = searchEngine;
    let origEngineList = searchEngine.slice();

    var $optDlg = $('<div>', {
        class: 'userscript-optDlg',
        id: 'userscript-optDlg',
        style: 'display:none;'
    }).appendTo('body');

    $optDlg.hide();
    $optDlg.show(100);

    var listHtml = '';
    $.each(newEngineList, (index, item) => {
        listHtml += `
            <div class="list-item" seid="${item.id}">
                <p class="item-title">${item.name}</p>
                <p class="item-movebtn" seid="${item.id}" title="上移">${ICONS.up}</p>
                <p class="item-delbtn" seid="${item.id}" title="移除">${ICONS.del}</p>
            </div>`;
    });

    $optDlg.html(`
        <div style="height:fit-content; max-height:calc(80vh - 60px); overflow-x:hidden; overflow-y:auto;">
            <h3>设置</h3>
            <div style="height:fit-content; margin:5px;">
                <p class="subtitle">搜索引擎：</p>
                ` + listHtml + `
            </div>
        </div>
        <div align="right">
            <input type="button" value="取消" class="ctrlbtn" id="userscript-cancelBtn">
            <input type="button" value="添加" class="ctrlbtn" id="userscript-addBtn">
            <input type="button" value="保存" class="ctrlbtn" id="userscript-saveBtn">
        </div>
    `);

    $(document).on('click', '.list-item>.item-movebtn', function(e) {
        let seid = $(e.target).parent().attr("seid");
        const index = findByKeyValue(newEngineList, 'id', seid);
        if (index > 0) {
            [newEngineList[index - 1], newEngineList[index]] = [newEngineList[index], newEngineList[index - 1]];
            // 交换DOM元素位置
            const currentItem = $(`.list-item[seid="${seid}"]`);
            const previousItem = currentItem.prev();
            if (previousItem.length) {
                currentItem.insertBefore(previousItem);
            }
        }
    });

    $(document).on('click', '.list-item>.item-delbtn', function(e) {
        let seid = $(e.target).parent().attr("seid");
        const index = findByKeyValue(newEngineList, 'id', seid);
        if (index !== -1) {
            newEngineList.splice(index, 1);
            $(`.list-item[seid="${seid}"]`).remove();
        }
    });

    $(document).on('click', '#userscript-cancelBtn', function(e) {
        /* 取消按钮 */
        newEngineList = origEngineList;

        $(document).off('click', '#userscript-addBtn');
        $(document).off('click', '#userscript-saveBtn');
        $(document).off('click', '.list-item>.item-movebtn');
        $(document).off('click', '.list-item>.item-delbtn');

        let $optDlg = $("#userscript-optDlg");
        $optDlg.hide(100);
        setTimeout(() => {
            $optDlg.remove();

            $(document).off('click', '#userscript-cancelBtn');

            location.reload();
        }, 110);
    });

    $(document).on('click', '#userscript-addBtn', function(e) {
        let url = prompt("【添加搜索引擎】\n请在此处填写搜索引擎的链接。（用“%s”代替搜索字词）", "https://");
        if(!url){ return; }
        if(!url.includes("%s") || !url.includes("://")) { alert("【未添加】不合法的链接。"); return; }
        let name = prompt("【添加搜索引擎】\n请为该条目命名。", "")
        if(!name){ return; }
        if(name.length > 100) { alert("【未添加】过长的名称。"); return; }

        newEngineList.push({
            "id": hash(url + name).toString(),
            "name": name,
            "link": url
        });

        GM_setValue('search_engine', newEngineList);
        alert("【已添加】页面即将刷新");
        location.reload();
    });

    $(document).on('click', '#userscript-saveBtn', function(e) {
        /* 保存按钮 */
        GM_setValue('search_engine', newEngineList);
        alert("【已保存】请刷新页面以应用更改");

        $(document).off('click', '#userscript-addBtn');
        $(document).off('click', '#userscript-cancelBtn');
        $(document).off('click', '.list-item>.item-movebtn');
        $(document).off('click', '.list-item>.item-delbtn');

        let $optDlg = $("#userscript-optDlg");
        $optDlg.hide(100);
        setTimeout(() => {
            $optDlg.remove();

            $(document).off('click', '#userscript-saveBtn');
        }, 110);
    });
}


function initEle() {
    // 创建搜索栏元素并添加到页面
    var $quickSearchBar = $('<div>', {
        class: 'userscript-quickSearchBar',
        id: 'userscript-quickSearchBar'
    }).appendTo('body');

    let html = '';
    const currentURL = window.location.href;

    $.each(searchEngine, (index, item) => {
        const link = item.link;
        const splitLink = link.split('%s');
        let prefix = null;
        let suffix = null;

        if (splitLink.length === 2) {
            prefix = splitLink[0];
            suffix = splitLink[1];
        } else if (splitLink.length > 2) {
            prefix = splitLink[0];
            suffix = splitLink.slice(1).join('%s');
        }

        if (currentURL.startsWith(prefix) && currentURL.endsWith(suffix)) {
            currentEngine = item;
            currentQuery = currentURL.slice(prefix.length, currentURL.length - suffix.length);
            html += `<div class="item active" seid="${item.id}">${item.name}</div>`;
        } else {
            html += `<div class="item" seid="${item.id}">${item.name}</div>`;
        }
    });

    // 清理 HTML 内容并插入到搜索栏
    $quickSearchBar.append(html + `
        <div id="userscript-optBtn">` + ICONS.settings + `</div>
        <div class="blank"></div>
    `);

    // 添加点击事件监听器
    $(document).on('click', '#userscript-quickSearchBar>.item', function(e) {
        var seid = $(e.target).attr("seid");
        var seIndex = findByKeyValue(searchEngine, "id", seid);
        location.href = searchEngine[seIndex].link.replace("%s", currentQuery);
    });


    $("#userscript-optBtn").click(() => {
        showOption();
    });
}

/* =====[ 菜单注册 ]===== */
var menu_ = GM_registerMenuCommand('⚙️ 脚本设置', function () { showOption(); }, 'o');

(function () {
    'use strict';

    if(GM_getValue('search_engine') == null || GM_getValue('search_engine') == "" || GM_getValue('search_engine') == undefined){ GM_setValue('search_engine', searchEngine); }
    else { searchEngine = GM_getValue('search_engine'); }

    var websiteThemeColor = $('body').css('background-color') || "#FFF";
    var websiteFontColor = invertColor(websiteThemeColor);
    websiteThemeColor = invertColor(websiteFontColor);

    GM_addStyle(`
        :root{--userscript-theme-color:${websiteThemeColor};--userscript-font-color:${websiteFontColor};--userscript-border-color:#99999999;--userscript-accent-color:#6d7fb4;--userscript-font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif}
        body{-webkit-appearance:none !important}
        .userscript-quickSearchBar{background:var(--userscript-theme-color);color:var(--userscript-font-color);padding:6px 10px;line-height:18px;width:100vw;height:30px;border-top:1px solid var(--userscript-border-color);position:fixed;bottom:-1px;left:0;right:0;display:flex;overflow:x auto;box-sizing:initial;z-index:100000;font-family:var(--userscript-font-family);vertical-align:middle}
        .userscript-quickSearchBar *{user-select:none;box-sizing:border-box;font-size:12px}
        .userscript-quickSearchBar > .item{margin:0 5px;border-radius:20px;border:1px solid var(--userscript-font-color);padding:5px 9px;flex:0 0 auto;cursor:pointer;background:transparent;line-height:18px;height:inherit;display:inline-block}
        .userscript-quickSearchBar > .item.active{border:1px solid var(--userscript-accent-color);color:var(--userscript-accent-color)}
        .userscript-quickSearchBar > .blank{flex:0 0 25px}
        #userscript-optBtn{margin:0 5px;flex:0 0 auto;border-radius:20px;border:1px solid var(--userscript-font-color);padding:4px 6px;cursor:pointer;background:transparent}
        #userscript-optBtn svg{fill:var(--userscript-font-color)}
        .userscript-optDlg{background:var(--userscript-theme-color);color:var(--userscript-font-color);border:1px solid var(--userscript-border-color);position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:92vw;max-width:300px;padding:15px;border-radius:15px;box-sizing:initial;z-index:100000;box-shadow:0 1px 10px rgba(0,0,0,0.54);font-family:var(--userscript-font-family)}
        .userscript-optDlg .ctrlbtn{border:none;background:transparent;padding:8px;margin:0;color:var(--userscript-accent-color);cursor:pointer;overflow:hidden}
        .userscript-optDlg h3{margin:5px;margin-bottom:15px;font-size:24px}
        .userscript-optDlg .subtitle{margin:5px 1px;font-size:16px;font-weight:400}
        .userscript-optDlg .list-item{width:calc(100% - 10px);padding:10px 5px;margin:0;display:flex;align-items:center;box-sizing:initial}
        .userscript-optDlg .list-item:hover{background:#55555555}
        .userscript-optDlg .list-item > p{margin:0;font-size:16px}
        .userscript-optDlg .list-item > .item-title{flex:1;margin-left:5px}
        .userscript-optDlg .list-item > .item-movebtn,.userscript-optDlg .list-item > .item-delbtn{cursor:pointer;width:25px}
        .userscript-optDlg .list-item > .item-movebtn svg,.userscript-optDlg .list-item > .item-delbtn svg{fill:var(--userscript-font-color);height:100%;min-height:16px}
    `);

    if(isSearchEngine()){
        /* 存储初始化 */

        console.log("【提示】匹配到已保存的搜素引擎");
        try{
            initEle();
        }catch(e){
            console.log(e)
        }

        setTimeout(() => {
            if($("#userscript-quickSearchBar").length == 0){
                /* 如果在页面加载时未完成初始化 */
                initEle();
            }
        }, 600);

        setTimeout(()=>{
            if($("#userscript-quickSearchBar").length == 0){
                /* 如果在页面加载时未完成初始化 */
                initEle();
            }
        }, 1200)
    }
})();