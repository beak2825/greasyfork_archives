// ==UserScript==
// @name         豆瓣电影资源 多平台磁链搜索 + 云播放【即点即播】 直接看！
// @name:zh-CN   豆瓣电影资源 多平台磁链搜索 + 云播放【即点即播】 直接看！
// @name:zh-TW   豆瓣電影資源 多平臺磁鏈搜索 + 雲播放【即點即播】 直接看！
// @namespace    dbzjk@healthylife
// @version      0.0.1
// @description  自动在多个平台搜索豆瓣电影（电视剧）磁链，点击即可直接跳转播放，不用下直接播，搜索播放一键完成，干净如新的流畅体验！
// @description:zh-CN  自动在多个平台搜索豆瓣电影（电视剧）磁链，点击即可直接跳转播放，不用下直接播，搜索播放一键完成，干净如新的流畅体验！
// @description:zh-TW  自動在多個平臺搜索豆瓣電影（電視劇）磁鏈，點擊即可直接跳轉播放，不用下直接播，搜索播放一鍵完成，幹凈如新的流暢體驗！
// @author       healthylife
// @match        *://movie.douban.com/subject/*
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      clm00.biz
// @connect      5cltt.vip
// @connect      www.btmovi.hair
// @downloadURL https://update.greasyfork.org/scripts/454807/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90%20%E5%A4%9A%E5%B9%B3%E5%8F%B0%E7%A3%81%E9%93%BE%E6%90%9C%E7%B4%A2%20%2B%20%E4%BA%91%E6%92%AD%E6%94%BE%E3%80%90%E5%8D%B3%E7%82%B9%E5%8D%B3%E6%92%AD%E3%80%91%20%E7%9B%B4%E6%8E%A5%E7%9C%8B%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/454807/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90%20%E5%A4%9A%E5%B9%B3%E5%8F%B0%E7%A3%81%E9%93%BE%E6%90%9C%E7%B4%A2%20%2B%20%E4%BA%91%E6%92%AD%E6%94%BE%E3%80%90%E5%8D%B3%E7%82%B9%E5%8D%B3%E6%92%AD%E3%80%91%20%E7%9B%B4%E6%8E%A5%E7%9C%8B%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const engines = [
        {
            results: [],
            icon: 'https://s1.ax1x.com/2022/11/14/zAU2eU.png',
            name: "磁力猫",
            async search(keyword) {
                let dom = await getDOM(`http://clm00.biz/search?word=${encodeURIComponent(keyword)}`);
                return $$(dom, '#Search_list_wrapper>li').map(li => {
                    return {
                        title: $(li, 'a.SearchListTitle_result_title').textContent.trim(),
                        tags: Array.from($(li, '.Search_list_info').childNodes).filter(n => n.nodeType == 3).map(n => n.nodeValue),
                        subUrl: new URL($(li, 'a.SearchListTitle_result_title').getAttribute('href'), 'http://clm00.biz/search').href
                    };
                }).filter(n => titleMatch(n.title, keyword));
            },
            async magurl(para) {
                return await getMag(para.subUrl);
            },
            showAll: false,
            done: false
        }, {
            results: [],
            icon: 'https://5cltt.vip/favicon.ico',
            name: "磁力天堂",
            async search(keyword) {
                let dom = await getDOM(`https://5cltt.vip/s.php?q=${encodeURIComponent(keyword)}`);
                return $$(dom, '.file-list>tbody>tr').filter(li => $(li, 'a')).map(li => {
                    return {
                        title: $(li, 'a').textContent.trim(),
                        tags: $$(li, '.td-size,.td-date').map(n => n.textContent.trim()),
                        subUrl: new URL($(li, 'a').getAttribute('href'), 'https://5cltt.vip/s.php').href
                    };
                }).filter(n => titleMatch(n.title, keyword));
            },
            async magurl(para) {
                return await getMag(para.subUrl);
            },
            showAll: false,
            done: false
        }, {
            results: [],
            icon: 'https://s1.ax1x.com/2022/11/14/zA0yh4.png',
            name: "磁力搜索",
            async search(keyword) {
                let dom = await getDOM(`http://www.btmovi.hair/so/${encodeURIComponent(keyword)}.html`);
                return $$(dom, '.search-list>.search-item').filter(li => $(li, '.item-title a')).map(li => {
                    return {
                        title: $(li, '.item-title a').textContent.trim(),
                        tags: $$(li, '.item-bar>*').map(n => {
                            if (!$(n, 'b')) return n.textContent.trim();
                            if (n.textContent.match(/热度/)) return n.textContent.trim();
                            return $(n, 'b').textContent.trim();
                        }),
                        subUrl: new URL($(li, '.item-title a').getAttribute('href'), 'http://www.btmovi.hair/so/123.html').href
                    };
                }).filter(n => titleMatch(n.title, keyword));
            },
            async magurl(para) {
                return await getMag(para.subUrl);
            },
            showAll: false,
            done: false
        }
    ]

    const magreg = /magnet:\?xt=urn:btih:\w{10,}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    const title = document.body.innerText.match(/\n\s*([^\n]+)的(剧情简介|演职员|短评|影评)/)[1];

    addStyle(`
        .dbzjk-flex-row{
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .dbzjk-inline-flex{
            display: inline-flex;
        }


        #dbzjk-box{
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
            gap: .6em;
        }

        .dbzjk-engine{
            display: flex;
            flex-direction: column;
            gap: .6em;
        }

        .dbzjk-engine-title{
            font-weight: bold;
            color: #999;
        }
        .dbzjk-engine-icon{
            width: 1.5em;
            height: 1em;
            display: inline-block;
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            margin-right: .5em;
        }

        .dbzjk-title{
            gap: 0.4em;
            max-width: 100%;
        }
        .dbzjk-title svg{
            height: 1em;
            fill: currentColor;
        }

        .dbzjk-directly-play-tag{
            padding: 0px 5px;
            font-size: small;
            height: 1.3em;
            border-radius: 2px;
            background:#ff9900;
            color: white;
            flex-shrink: 0;
            gap: 0.3em;
        }
        .dbzjk-title:hover .dbzjk-directly-play-tag,.dbzjk-title:active .dbzjk-directly-play-tag{
            color: inherit;
            background:none;
        }

        .dbzjk-tag-line{
            display: flex;
            flex-direction: row;
            gap: .5em;
            font-size: .8em;

        }
    `);

    const root = document.createElement('div');
    document.querySelector(`#content .aside`).insertBefore(root, document.querySelector(`#content .aside>*:first-child`));
    root.id = 'dbzjk-box';
    root.innerHTML = html`
        <div v-if="!engines.filter(en=>en.results.length).length">
            {{engines.filter(en=>!en.done).length?"磁链搜索中……":"抱歉，没有搜到磁链。"}}
        </div>
        <div v-for="engi in engines.filter(en=>en.results.length)" class="dbzjk-engine">
            <div class='dbzjk-engine-title dbzjk-flex-row '><span v-if="engi.icon" class="dbzjk-engine-icon"
                    :style="{backgroundImage:'url('+engi.icon+')'}"></span><span>{{engi.name}}</span></div>
            <div v-for="r in engi.showAll?engi.results:engi.results.slice(0,3)">
                <a class='dbzjk-title dbzjk-flex-row dbzjk-inline-flex' :title="r.title" href @click.prevent="open(engi, r)">
                    <span class='dbzjk-directly-play-tag dbzjk-flex-row dbzjk-inline-flex'>
                        <span>直接播</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                            <path
                                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                        </svg>
                    </span>
                    <span
                        style='white-space: nowrap;overflow: hidden;flex-grow: 0;text-overflow: ellipsis;'>{{r.loading?"获取磁链中……":r.title}}</span>
                </a>
                <div class='dbzjk-tag-line'>
                    <span class='dbzjk-tag' v-for="tag in r.tags">{{tag}}</span>
                </div>
            </div>
            <div v-if="(!engi.showAll) && engi.results.length>3">
                <a @click.prevent="engi.showAll=true" style='color: #999;'>更多 ({{engi.results.length-3}}个)</a>
            </div>
        </div>
    `;

    new Vue({
        el: '#dbzjk-box',
        data: {
            engines
        },
        mounted() {
            parallel(engines.map(engi => {
                return async () => {
                    try {
                        engi.results = (await engi.search(title)).map(n => {
                            n.loading = false;
                            return n;
                        });
                    } finally {
                        engi.done = true;
                    }
                }
            }), 3).start();
        },
        methods: {
            async open(engi, r) {
                r.loading = true;
                let url = await engi.magurl(r);
                r.loading = false;
                if (url) {
                    let a = document.createElement('a');
                    a.href = 'https://www.diancigaoshou.com/#' + new URLSearchParams({ url });
                    a.target = "_blank";
                    a.click();
                } else {
                    r.title = "获取失败";
                }
            }
        }
    })


    function parallel(tasks, max = 2) {
        let i = 0;
        let ing = 0;
        function run() {
            if (ing >= max) return;
            if (i >= tasks.length) return;
            let task = tasks[i++];
            ing++;
            (async () => {
                await task();
                ing--;
                run();
            })();
            run();
        }
        return {
            start() {
                run();
            }
        }
    }

    function titleMatch(string, word) {
        if (!word) return false;
        if (!string.includes(word)) return false;

        let index = string.indexOf(word);

        let charLeft = string[index - 1];
        if (charLeft) {
            if (word[0].match(/[\u4E00-\u9FFF]/) && charLeft.match(/[\u4E00-\u9FFF]/)) return false;
            if (word[0].match(/[A-Za-z]/) && charLeft.match(/[A-Za-z]/)) return false;
        }

        let rightChar = string[index + word.length];
        if (rightChar) {
            let c = word[word.length - 1];
            if (c.match(/[\u4E00-\u9FFF]/) && rightChar.match(/[\u4E00-\u9FFF]/)) return false;
            if (c.match(/[A-Za-z]/) && rightChar.match(/[A-Za-z]/)) return false;
        }
        return true;
    }

    function addStyle(s) {
        let style = document.createElement("style");
        style.innerHTML = s;
        document.documentElement.appendChild(style);
    }


    function html(n, ...args) {
        let re = [];
        for (let i = 0; i < n.length; i++) {
            re.push(n[i]);
            args[i] && re.push(args[i]);
        }
        return re.join("");
    }

    function $(ele, selector) {
        return ele.querySelector(selector);
    }
    function $$(ele, selector) {
        return Array.from(ele.querySelectorAll(selector));
    }

    async function getMag(...args) {
        let dom = await getDOM(...args);
        let m = dom.documentElement.textContent.match(magreg);
        if (!m) m = dom.documentElement.innerHTML.match(magreg);
        return m && m[0];
    }


    function getDOM(url, headers = {}) {
        const request = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : GM.xmlHttpRequest;
        return new Promise(r => {
            request({
                url,
                headers,
                onload({ responseText }) {
                    let parser = new DOMParser();
                    r(parser.parseFromString(responseText, "text/html"));
                }
            })
        })
    }

})();