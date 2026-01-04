// ==UserScript==
// @name         Display tags on Pixiv List
// @namespace    https://www.hisaruki.ml/
// @version      1
// @description  Displays a list of tags attached to links when displaying the list of new posts and search results.
// @author       hisaruki
// @match        https://www.pixiv.net/*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439513/Display%20tags%20on%20Pixiv%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/439513/Display%20tags%20on%20Pixiv%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';
    fetch("https://www.pixiv.net/ajax/search/suggestion?mode=all")
        .then(resp => resp.json())
        .then(suggestion => {
            let done = {};
            const Build = function (illusts) {
                if(document.querySelector("[data-pixivmod]")){
                    return false;
                }
                illusts.forEach(illust => {
                    console.log(illust);
                    let gtm = document.querySelector('[data-gtm-value="' + illust.id + '"]')
                    if(gtm){
                        let root = gtm.closest("li");
                        let ul = document.createElement("ul");
                        ul.setAttribute("data-pixivmod", illust.id);
                        root.appendChild(ul);
                        illust.tags.forEach(tag => {
                            let li = document.createElement("li");
                            li.textContent = tag;
                            if (suggestion.body.myFavoriteTags.includes(tag)) {
                                li.style.color = "red";
                                li.style.fontWeight = "bold";
                            }
                            ul.appendChild(li);
                        });
                    }
                });
            }


            const Check = function (url) {
                fetch(url)
                    .then(resp => resp.json())
                    .then(j => {
                        try{
                            done[url] = j.body.illustManga.data;
                        }catch{}
                        try{
                            done[url] = j.body.thumbnails.illust;
                        }catch{}
                        Build(done[url]);
                    });
            }
            setInterval(function () {
                let u = new URL(document.URL);
                if (u.pathname == "/bookmark_new_illust.php") {
                    let p = new URL(document.URL).searchParams.get("p") || 1;
                    let url = "https://www.pixiv.net/ajax/follow_latest/illust?mode=all&lang=ja&p=" + p;
                    if (!Object.keys(done).includes(url)) {
                        done[url] = null;
                        setTimeout(function () {
                            console.log(url);
                            Check(url);
                        }, 1000);
                    } else {
                        Build(done[url]);
                    }
                }
                //https://www.pixiv.net/ajax/search/artworks/%E8%89%A6%E3%81%93%E3%82%8C?order=date_d&mode=all&p=1&s_mode=s_tag&type=all&lang=ja
                if (u.pathname.search(new RegExp('/tags/.*/artworks')) == 0) {
                    let tags = new URL(document.URL).pathname.match(new RegExp('/tags/(.*)/'))[1];
                    let url = new URL("https://www.pixiv.net/ajax/search/artworks/" + tags);
                    let defaultParams = {
                        order: "date_d",
                        mode: "all",
                        p: "1",
                        s_mode: "s_tag",
                        type: "all",
                        lang: "ja",
                        limit: "60"
                    };
                    Object.entries(defaultParams).forEach(x => {
                        let k = x[0];
                        let v = u.searchParams.get(k) || x[1];
                        url.searchParams.set(k, v);
                    });
                    url = url.toString();
                    if (!Object.keys(done).includes(url)) {
                        done[url] = null;
                        setTimeout(function () {
                            console.log(url);
                            Check(url);
                        }, 1000);
                    } else {
                        Build(done[url]);
                    }
                }
            }, 1000);
        });

})();