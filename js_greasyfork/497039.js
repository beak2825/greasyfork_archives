// ==UserScript==
// @name         豆瓣小组黑名单
// @version      1.0.0
// @description  屏蔽豆瓣小组中黑名单用户的发帖和回帖
// @author       Rex
// @match        https://www.douban.com/group/*
// @match        https://www.douban.com/people/*
// @grant GM_setValue
// @grant GM_getValue
// @connect  www.douban.com
// @namespace https://greasyfork.org/users/177826
// @downloadURL https://update.greasyfork.org/scripts/497039/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/497039/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

var black_list = GM_getValue("blacklist");//GM_getValue('black_list', undefined);



(function () {
    'use strict';

    var ul = document.querySelector(".global-nav-items ul");
    //console.log(ul);
    var li = document.createElement("li");
    li.onclick = function () {
        black_list = new Set();
        get_blacklist()
    };
    var a = document.createElement('a');
    var linkText = document.createTextNode("刷新黑名单用户");
    a.appendChild(linkText);
    a.title = "刷新黑名单用户";
    a.href = "javascript:void(0);";
    li.appendChild(a);
    ul.appendChild(li);

    var apiURL = "https://www.douban.com/contacts/blacklist";

    //console.log(black_list);
    if (black_list === undefined) {
        black_list = new Set();
        get_blacklist();
    }
    else {
        black_list = new Set(JSON.parse(black_list));
        process_Response(black_list)
    }


    var style = document.createElement("style");
    style.innerHTML = ```.blacklist-none {
        content: "黑名单已屏蔽";
        width: 100%;
        display: block;
        position: absolute;
        height: 100%;
        background: #eee;
        color: #7e7e7e; }```;
    document.head.appendChild(style);

    function get_blacklist(next = "") {
        var request = new XMLHttpRequest();
        request.open("GET", apiURL + next);
        //console.log('test');
        request.onload = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                var black_list_doc = new DOMParser().parseFromString(request.response, "text/html");
                var black_list_href = Array.prototype.map.call(black_list_doc.querySelectorAll(".obss.namel dd a"), node => node.href);
                if (black_list_href.length != 0) {
                    black_list_href.forEach(function (href) {
                        black_list.add(href);
                    });
                }

                var nextelem = black_list_doc.querySelector(".next a");
                if (nextelem) {
                    get_blacklist(nextelem.href.match(/\?.*/));
                } else {
                    GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
                    process_Response(black_list)
                };
            };
        }
        request.send();
    };

    function process_Response(blk) {
        var windowUrl = window.location.href;
        var topicre = /https:\/\/www\.douban\.com\/group\/topic\/.*/;
        var groupre = /https:\/\/www\.douban\.com\/group\/.*/;
        if (windowUrl.match(topicre)) {
            document.querySelectorAll('#comments li').forEach(el=>{
                var href=el.getElementsByTagName('a')[0].href;
                    if (href && blk.has(href)) {
                        el.style.display = 'none';
                    }
                }
            )
            document.querySelectorAll(".reply-quote-content").forEach(el => {
                var href = el.getElementsByClassName("pubdate")[0].getElementsByTagName('a')[0].href;
                if (href && blk.has(href)) {
                    el.classList.add("blacklist-none");
                }
            })

        }
        else if (windowUrl.match(groupre)) {
            document.querySelectorAll("tr").forEach(el => {
                Array.from(el.getElementsByTagName("a")).forEach(a=>{
                    if (a.href && blk.has(a.href)) {
                        el.style.display = 'none';
                    }
                })
            })
        }
        else {
            const open = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                if (url == "/j/contact/unban") {
                    black_list.delete(windowUrl)
                    GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
                }
                else if (url == "/j/contact/addtoblacklist") {
                    black_list.add(windowUrl)
                    GM_setValue("blacklist", JSON.stringify(Array.from(black_list)))
                }
                return open.call(this, method, url, ...rest);
            };

        }
    };

})();