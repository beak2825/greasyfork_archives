// ==UserScript==
// @name         为 Gitee 页面生成菜单
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为 Gitee 页面生成菜单，默认隐藏，需要时点击开启
// @author       百分之千
// @license      MIT
// @match        https://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513028/%E4%B8%BA%20Gitee%20%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/513028/%E4%B8%BA%20Gitee%20%E9%A1%B5%E9%9D%A2%E7%94%9F%E6%88%90%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const e = ["article","section","main","content","#article",".article","#main",".main","#content",".content","#post",".post","body"];
    const n = "h1, h2, h3, h4, h5, h6";
    let _;

    const l = () => {
        const o = [];
        let _ = 0;
        for (const t of e) {
            if (document.querySelectorAll(t).length) {
                document.querySelectorAll(t).forEach(t => {
                    t.querySelectorAll(n).forEach(t => {
                        var e;
                        o.push(t);
                        if (!t.id) {
                            e = "toc_index_" + _++;
                            t.dataset.headerMark = e;
                            t.id = e;
                        } else {
                            t.dataset.headerMark = t.id;
                        }
                    });
                });
                break;
            }
        }

        let l = '<li class="toc_menu_item_title">Table of contents:</li>';
        if (o.length) {
            let _ = +o[0].tagName.replace(/H/g, ""), n = 0;
            o.forEach(t => {
                var e = +t.tagName.replace(/H/g, "");
                n = n + e - _, n = n < 0 ? 0 : n, _ = e;
                const o = document.createElement("span");
                o.innerText = t.innerText;
                l += `<li class="toc_menu_item toc_header_level_` + n + `"><a href="#` + t.id + `">` + o.innerHTML + `</a></li>`;
            });
        } else {
            l += '<li class="toc_menu_item">[Here is empty.]</li>';
        }
        return l += '<li class="toc_menu_item_footer">百分之千&DMS</li>', l;
    };

    (() => {
        const t = document.createElement("div");
        _ = t.attachShadow({mode: "open"});
        t.id = "toc_menu_root";
        _.innerHTML = `
            <style>
                #toc_menu_root { position: fixed; left: 0; top: 0; max-width: 360px; height: 100%; z-index: 2147483647; backdrop-filter: blur(8px); }
                #toc_menu_root.toc_hidden { width: 18px; height: 18px; }
                #toc_menu_root.toc_hidden > ul#toc_menu_list { display: none; }
                #toc_menu_root > #toc_toggle_button { position: absolute; width: 36px; height: 36px; left: -18px; top: -18px; background: rgba(233, 33, 33, .1); border-radius: 18px; }
                #toc_menu_root > #toc_toggle_button:hover { background: rgba(233, 33, 33, .6); }
                #toc_menu_root > ul#toc_menu_list { box-sizing: border-box !important; margin: 0; padding: 24px 18px 18px; height: 100%; overflow: scroll; background: rgba(255, 255, 255, .9); box-shadow: 0 6px 18px rgba(0, 0, 0, .3); }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item, #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_title, #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_footer { list-style: none !important; margin: 0; padding: 0; font-size: 16px; border-left: 3px solid rgba(255, 255, 255, 0); }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_title { font-size: 22px; font-weight: 700; border-bottom: 1px solid #CCCCCF; margin-bottom: 5px; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item:hover { background: #F3F3F3; border-left: 3px solid #AAAAAC; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item > a, #toc_menu_root > ul#toc_menu_list > li.toc_menu_item > a:visited { display: block; padding: 2px .5em; font-size: 16px; font-weight: 400; line-height: 1.6; color: #222226; text-decoration: none; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item > a:hover, #toc_menu_root > ul#toc_menu_list > li.toc_menu_item > a:active { color: #FF88AA; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_0 > a, #toc_menu_root > ul#toc_menu_list > li.toc_header_level_0 > a:visited { font-weight: 700; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_1 { padding-left: 2em; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_2 { padding-left: 3.5em; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_3 { padding-left: 5em; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_4 { padding-left: 6.5em; }
                #toc_menu_root > ul#toc_menu_list > li.toc_header_level_5 { padding-left: 8em; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_footer { font-size: 14px; color: #99999C; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_footer > a { color: #AAAAAE; text-decoration: none; }
                #toc_menu_root > ul#toc_menu_list > li.toc_menu_item_footer > a:hover { color: #FF88AA; }
                #toc_toggle_button { position: fixed; left: 0; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: rgba(233, 33, 33, .1); border-radius: 18px; z-index: 2147483648; }
                #toc_toggle_button:hover { background: rgba(233, 33, 33, .6); }
            </style>
            <div id="toc_menu_root" class="toc_hidden">
                <ul id="toc_menu_list"></ul>
            </div>
            <div id="toc_toggle_button"></div>
        `;

        document.querySelector("html").appendChild(t);

        const e = _.querySelector("#toc_menu_root");
        const o = _.querySelector("#toc_menu_list");
        _.querySelector("#toc_toggle_button").addEventListener("click", () => {
            e.classList.toggle("toc_hidden");
            if (e.classList.contains("toc_hidden")) {
                o.innerHTML = "";
            } else {
                o.innerHTML = l();
            }
        });
    })();
})();
