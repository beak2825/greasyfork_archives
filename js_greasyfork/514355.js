// ==UserScript==
// @name         Rust 翻译文档 公共部分
// @namespace    fireloong
// @version      0.0.4
// @description  Rust 翻译文档
// @author       Itsky71
// @match        https://doc.rust-lang.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rust-lang.org
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514355/Rust%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20%E5%85%AC%E5%85%B1%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/514355/Rust%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20%E5%85%AC%E5%85%B1%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $('#help-button').click(function(){
        setTimeout(function(){
            const translates = {
                'You can find more information in the rustdoc book.': '你可以在<a href="https://doc.rust-lang.org/1.82.0/rustdoc/">这本 rustdoc 书</a>中找到更多信息。',
                'Keyboard Shortcuts': '键盘快捷键',
                'Search Tricks': '搜索技巧',
                'Show this help dialog': '显示此帮助对话框',
                'Focus the search field': '聚焦搜索字段',
                'Move up in search results': '在搜索结果中向上移动',
                'Move down in search results': '在搜索结果中向下移动',
                'Switch result tab (when results focused)': '切换结果标签（当结果处于聚焦状态时）',
                'Go to active search result': '前往活动的搜索结果',
                'Expand all sections': '展开所有章节',
                'Collapse all sections': '折叠所有章节',
                'For a full list of all search features, take a look here.': '要查看所有搜索功能的完整列表，请点击<a href="https://doc.rust-lang.org/1.82.0/rustdoc/read-documentation/search.html" target="_blank">这里</a>。',
                'Prefix searches with a type followed by a colon (e.g., fn:) to              restrict the search to a given item kind.': '在搜索前加上一个类型后跟冒号（例如，<code>fn:</code>）来将搜索限制于特定类型的项目。',
                'Accepted kinds are: fn, mod, struct,              enum, trait, type, macro,              and const.': '接受的类型有：<code>fn</code>、<code>mod</code>、<code>struct</code>、<code>enum</code>、<code>trait</code>、<code>type</code>、<code>macro</code> 和 <code>const</code>。',
                'Search functions by type signature (e.g., vec -> usize or              -> vec or String, enum:Cow -> bool)': '按类型签名搜索函数（例如：<code>vec -&gt; usize</code> 或 <code>-&gt; vec</code> 或 <code>String, enum:Cow -&gt; bool</code>）',
                'You can look for items with an exact name by putting double quotes around              your request: "string"': '你可以通过在查询内容周围加上双引号来查找具有确切名称的项：<code>"string"</code>',
                'Look for functions that accept or return               slices and               arrays by writing               square brackets (e.g., -> [u8] or [] -> Option)': '通过书写方括号来查找接受或返回 <a href="https://doc.rust-lang.org/std/primitive.slice.html" target="_blank">slices</a> 和 <a href="https://doc.rust-lang.org/std/primitive.array.html" target="_blank">arrays</a> 的函数（例如：<code>-&gt; [u8]</code> 或 <code>[] -&gt; Option</code>）',
                'Look for items inside another one by searching for a path: vec::Vec': '通过搜索路径来查找某个项内部的项：<code>vec::Vec</code>',
            };
            fanyi(translates, '#help .top, #help h2, .shortcuts dd, .infos p', true);
        }, 500);
    });
})($);
