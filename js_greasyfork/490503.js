// ==UserScript==
// @name         dlsite jump
// @namespace    http://tampermonkey.net/
// @version      1.2.8
// @license      MIT
// @description  dlsite跳转放流资源
// @author       crudBoy
// @match        https://*.dlsite.com/*/product_id/*
// @icon         https://www.dlsite.com/images/web/common/logo/pc/logo-dlsite.png
// @grant        GM_xmlhttpRequest
// @connect      asmr-200.com
// @connect      erovoice.us
// @connect      anime-sharing.com
// @connect      asmrconnecting.xyz
// @connect      nas
// @downloadURL https://update.greasyfork.org/scripts/490503/dlsite%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/490503/dlsite%20jump.meta.js
// ==/UserScript==
((o) => {
    if (typeof GM_addStyle == "function") {
        GM_addStyle(o);
        return;
    }
    const t = document.createElement("style");
    (t.textContent = o), document.head.append(t);
})(
    " .rdl-list{box-sizing:border-box;display:flex;flex-wrap:wrap;justify-content:flex-start;gap:10px;width:100%;height:100%;z-index:1;background-color:#fff;transition:right .2s ease-in-out;font-family:Roboto,Helvetica,Arial,sans-serif;color:#000}.rdl-button,.rdl-button_def{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:3px 10px;border-radius:4px;font-weight:500;font-size:14px;border:1px solid #dcdfe6;color:#606266;cursor:pointer}.rdl-button_def{margin:10px 0;width:100px}.rdl-button:visited{color:#606266}.rdl-button:hover{text-decoration:none;color:#409eff;border:1px solid #c6e2ff;background-color:#ecf5ff}.rdl-button_label{position:absolute;font-size:10px;padding:4px;border-radius:4px;top:-13px;right:-10px;line-height:.75;color:#67c23a;border:1px solid #e1f3d8;background:white}.rdl-button_green{color:#fff!important;background-color:#67c23a}.rdl-button_green:hover{color:#fff!important;background-color:#95d475}.rdl-button_red{color:#fff!important;background-color:#f56c6c}.rdl-button_red:hover{color:#fff!important;background-color:#f89898}.rdl-loading{display:inline-block;width:14px;height:14px;margin-right:10px;border:2px dashed #dcdfe6;border-top-color:transparent;border-radius:100%;animation:btnLoading infinite 1s linear}@keyframes btnLoading{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.rdl-tag{padding:3px 6px;color:#409eff!important;background:#ecf5ff;border:1px solid #d9ecff;border-radius:4px}.rdl-setting-list{display:flex;flex-wrap:wrap;background-color:#fff}.rdl-setting-title{margin:10px 0 5px}.rdl-setting-item{display:flex;height:20px;justify-content:center;align-items:center;margin-right:15px;-webkit-user-select:none;user-select:none;cursor:pointer}.db-panel .movie-panel-info div.panel-block{padding:5.5px 12px}.db-panel .rdl-app{padding:15px 12px}.lib-panel .rdl-app{padding:20px 30px;margin-top:10px}input[type=checkbox],input[type=radio]{margin:0 0 0 5px;cursor:pointer} ",
);

(function () {
    'use strict';

    // 初始化视图和解锁标题复制
    initView();
    unlockTitleCopy();

    function initView() {
        const workOutline = document.getElementById("work_outline");
        const body = workOutline.children[0];
        const isAsmr = detectAsmr(body);

        const tr = createElement('tr');
        const th = createElement('th', "跳转");
        const td = createElement('td');

        const rdlApp = createElement("div", null, "rdl-app");
        const rdlList = createElement("div", null, "rdl-list");

        const siteItems = [
            { "title": "asmrone", "onlyAsmr": true },
            { "title": "eroVoice", "onlyAsmr": true },
            { "title": "animeShare", "onlyAsmr": false },
            { "title": "不妙屋", "onlyAsmr": true },
            { "title": "kikoeru", "onlyAsmr": true },
            { "title": "japaneseasmr", "onlyAsmr": true },
            { "title": "南+", "onlyAsmr": false },
            { "title": "hvdb", "onlyAsmr": true },
            { "title": "exHentai", "onlyAsmr": false },
            { "title": "ai2moe", "onlyAsmr": false },
            { "title": "GGBases", "onlyAsmr": false },
            { "title": "DMM", "onlyAsmr": false }
        ];

        siteItems.forEach(item => {
            if (isAsmr || !item.onlyAsmr) {
                const element = createElement("a", item.title, "rdl-button");
                element.target = "_blank";
                rdlList.appendChild(element);
            }
        });

        rdlApp.appendChild(rdlList);
        td.appendChild(rdlApp);
        tr.appendChild(th);
        tr.appendChild(td);
        body.appendChild(tr);

        checkExits(isAsmr);
    }

    function detectAsmr(body) {
        const icons = ["icon_SOU", "icon_MUS", "icon_AMT", "icon_VCM", "icon_MOV", "icon_ICG"];
        return icons.some(icon => body.innerHTML.includes(icon));
    }

    function createElement(tag, text = null, className = null) {
        const element = document.createElement(tag);
        if (text) element.textContent = text;
        if (className) element.className = className;
        return element;
    }

    function findItem(t) {
        const list = document.getElementsByClassName("rdl-list")[0];
        return Array.from(list.children).find(item => item.textContent === t);
    }

    async function checkExits(isAsmr) {
        const rj = urlToRJNumber(document.querySelector("#work_buy_btn > p.work_favorite > a").href);
        setItemLink("hvdb", `https://hvdb.me/Dashboard/WorkDetails/${rj}`);
        setItemLink("japaneseasmr", `https://japaneseasmr.com/?s=${rj}`);
        setItemLink("南+", `https://bbs.white-plus.net/search.php?step=2&keyword=${rj}+${document.getElementById("work_name").innerText}&method=OR&pwuser=&sch_area=0&f_fid=all&sch_time=all&orderway=postdate&asc=DESC`);
        setItemLink("exHentai", `https://exhentai.org/?f_search=${document.getElementById("work_name").innerText}`);
        setItemLink("GGBases", `https://ggb.dlgal.com/search.so?p=0&title=${rj}+${document.getElementById("work_name").innerText}&advanced=1`);
        setItemLink("ai2moe", `https://www.ai2.moe/search/?&q=${rj}%20${document.getElementById("work_name").innerText}&search_and_or=or`);
        setItemLink("DMM", `https://www.dmm.co.jp/search/=/searchstr=${document.getElementById("work_name").innerText}/`);

        const checks = [
            { site: "asmrone", check: asmrOneCheck, condition: isAsmr },
            { site: "kikoeru", check: kikoeruCheck, condition: isAsmr },
            { site: "eroVoice", check: eroVoiceCheck, condition: isAsmr },
            { site: "不妙屋", check: asmrConnectingCheck, condition: isAsmr },
            { site: "animeShare", check: animeShareCheck, condition: true }
        ];

        for (const { site, check, condition } of checks) {
            if (condition) await checkSite(site, rj, check);
        }

    }

    async function checkSite(siteName, rj, checkFunction) {
        const item = findItem(siteName);
        try {
            await checkFunction(rj, item);
        } catch (error) {
            console.error(error);
            item.className = "rdl-button rdl-button_red";
        }
    }

    async function asmrOneCheck(rj, item) {
        const url = `https://api.asmr-200.com/api/search/${rj}?order=create_date&sort=desc&page=1&subtitle=0&includeTranslationWorks=true`;
        const response = await fetchData(url);
        const works = JSON.parse(response.responseText).works;

        if (works.length > 1) {
            item.className = "rdl-button rdl-button_green";
            item.href = `https://asmr-200.com/works?keyword=${rj}`;
        } else if (works.length === 1) {
            const asmroneItemId = works[0].id;
            const isMatch = ["RJ0", "RJ"].some(prefix => [asmroneItemId + 1, asmroneItemId - 1, asmroneItemId].some(id => `${prefix}${id}` === rj));
            if (isMatch) {
                item.className = "rdl-button rdl-button_green";
                item.href = `https://asmr-200.com/work/${rj}`;
            } else {
                item.className = "rdl-button rdl-button_red";
                item.href = `https://asmr-200.com/works?keyword=${rj}`;
            }
        } else {
            item.className = "rdl-button rdl-button_red";
            item.href = `https://asmr-200.com/works?keyword=${rj}`;
        }
    }

    async function kikoeruCheck(rj, item) {
        const url = `http://nas:8888/api/search?page=1&sort=desc&order=created_at&nsfw=0&lyric=&seed=50&isAdvance=0&keyword=${rj}`;
        const response = await fetchData(url);
        const works = JSON.parse(response.responseText).works;

        if (works.length > 1) {
            item.className = "rdl-button rdl-button_green";
            item.href = `http://nas:8888/works?keyword=${rj}`;
        } else if (works.length === 1) {
            const asmroneItemId = works[0].id;
            const isMatch = ["RJ0", "RJ"].some(prefix => [asmroneItemId + 1, asmroneItemId - 1, asmroneItemId].some(id => `${prefix}${id}` === rj));
            if (isMatch) {
                item.className = "rdl-button rdl-button_green";
                item.href = `http://nas:8888/work/${asmroneItemId}`;
            } else {
                item.className = "rdl-button rdl-button_red";
                item.href = `http://nas:8888/works?keyword=${rj}`;
            }
        } else {
            item.className = "rdl-button rdl-button_red";
            item.href = `http://nas:8888/works?keyword=${rj}`;
        }
    }


    async function eroVoiceCheck(rj, item) {
        const url = `http://e.erovoice.us/search/?q=${rj}`;
        const response = await fetchData(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');
        const dateOuter = doc.getElementsByClassName("date-outer");
        if (dateOuter.length > 1) {
            item.className = "rdl-button rdl-button_green"
            item.href = url
        } else if (dateOuter.length === 1) {
            item.className = "rdl-button rdl-button_green"
            item.href = doc.getElementsByClassName("anes")[0].href
        } else {
            item.className = "rdl-button rdl-button_red"
            item.href = url
        }
    }

    async function asmrConnectingCheck(rj, item) {
        const url = "https://asmrconnecting.xyz/api/fs/search";
        const postData = JSON.stringify({
            "parent": "/",
            "keywords": rj,
            "page": 1,
            "scope": 0,
            "per_page": 100,
            "password": ""
        });
        const response = await fetchDataWithPost(url, postData);
        const data = JSON.parse(response.responseText).data;
        const ref = data.content.reduce((acc, contentKey) => {
            if (contentKey.is_dir && contentKey.size < acc.size) {
                const parent = contentKey.parent.replaceAll("/Guest", "");
                return { size: contentKey.size, href: `https://asmrconnecting.xyz${parent}/${contentKey.name}` };
            }
            return acc;
        }, { size: Number.MAX_SAFE_INTEGER, href: "" }).href;
        handleCheckResult(data.total, item, ref, "https://asmrconnecting.xyz");
    }

    async function animeShareCheck(rj, item) {
        const url = `https://www.anime-sharing.com/search/3528560/?q=${rj}&o=relevance`;
        const response = await fetchData(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');
        const voiceIconNodeLength = doc.getElementsByClassName("label label--primary").length;
        const queryReplacementNodeLength = doc.getElementsByClassName("query-replacement").length
        handleCheckResult(voiceIconNodeLength > 0 && queryReplacementNodeLength <= 0, item, url, url);
    }

    function handleCheckResult(condition, item, successLink, failLink) {
        if (condition > 0) {
            item.className = "rdl-button rdl-button_green";
            item.href = successLink;
        } else {
            item.className = "rdl-button rdl-button_red";
            item.href = failLink;
        }
    }

    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error),
            });
        });
    }

    function fetchDataWithPost(url, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: data,
                headers: {
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Origin": "https://asmrconnecting.xyz",
                    "Referer": "https://asmrconnecting.xyz/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                    "Content-Type": "application/json;charset=UTF-8"
                },
                onload: (response) => resolve(response),
                onerror: (error) => reject(error),
            });
        });
    }

    function urlToRJNumber(url) {
        const regex = /(?:\/product_id\/|translation=)(RJ\d+)(?:\.html)?(?:\?.*|\/)?$/i;
        const match = url.match(regex);
        const rj = match[1].toUpperCase();
        console.log("rj:" + rj);
        return rj;
    }

    function unlockTitleCopy() {
        document.querySelector("#top_wrapper > ul > li:last-child").style = "user-select:auto";
        document.getElementById("work_name").style = "user-select:auto";
    }

    function setItemLink(siteName, link) {
        const item = findItem(siteName);
        if(item){
            item.className = "rdl-button";
            item.href = link;
        }
    }
})();
