// ==UserScript==
// @name         Board16 Recovery
// @version      0.0.1
// @description  save board 16
// @icon         https://www.cc98.org/static/98icon.ico

// @author       You
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://www.cc98.org/board/16
// @match        https://www.cc98.org/board/16/*
// @match        https://www.cc98.org/error/404
// @require      https://unpkg.com/dexie@3.2.0/dist/dexie.min.js
// @require      https://unpkg.com/dexie-export-import@1.0.3/dist/dexie-export-import.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441587/Board16%20Recovery.user.js
// @updateURL https://update.greasyfork.org/scripts/441587/Board16%20Recovery.meta.js
// ==/UserScript==

/* global Dexie */

const log = console.log;
const sleep = (ms)=>new Promise(r=>setTimeout(r, ms));

const imported = GM_getValue('imported', false);
if(!imported) {
    importDatabase();
}

main();

// import database from json file
async function importDatabase() {
    await sleep(3000);
    const upload = element(`<input id="upload" type="file"></input>`);
    const message = element(`<p>点击上传json文件</p>`);

    function progressCallback ({totalRows, completedRows}) {
        message.textContent = `Progress: ${completedRows} of ${totalRows} rows`;
    }
    on(upload, 'change', async()=>{
        try {
            // devtools (> Application) > Storage > IndexedDB > cc98-board16-recovery-v1
            const db = await Dexie.import(upload.files[0], {progressCallback});
            message.textContent = "Import complete";
            const infos = await db.infos.toArray();
            log(infos);
            GM_setValue('boardInfo', infos.map(i=>i.info));
            GM_setValue('imported', true);
            await sleep(3000);
            location += '';
        } catch (error) {
            console.error(error);
        }
    });
    const row = document.querySelector('.board-head-bar > div.row');
    row.appendChild(upload);
    row.appendChild(message);
}

function element(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
}

function on(elem, event, func) {
    return elem.addEventListener(event, func, false);
}


async function main() {
    let boardInfo = {
        0: `{"id":16,"name":"","bigPaper":null,"logoUri":null,"parentId":6,"anonymousState":0,"privacyState":0,"viewerFilterState":0,"protectionLevel":1,"isLocked":true,"rootId":6,"description":"","boardMasters":[],"topicCount":5987,"postCount":1280849,"todayCount":0,"lastPostContent":"","allowPostOnly":2,"forbidRvpn":false,"canEntry":true,"internalState":0,"canVote":true,"isUserCustomBoard":false}`,
        1: `{"id":16,"name":"","boardMasters":[],"topicCount":20664,"postCount":1280849,"todayCount":0,"description":"","anonymousState":0}`,
    };
    let info1 = JSON.parse(boardInfo[1]);

    let db;
    if(imported) {
        db = new Dexie("cc98-board16-recovery-v1");
        db.version(2).stores({
            topics: "id",
            posts: "id,topicId",
            infos: "i",
        });

        boardInfo = GM_getValue('boardInfo');
        info1 = JSON.parse(boardInfo[1]);
        log(boardInfo);
    }


    const topicInfoRegExp = new RegExp("api.cc98.org/topic/\\d+$", 'i');
    const isTopicInfoAPI = (url) => topicInfoRegExp.test(url);

    const topicRegExp = new RegExp("/board/16/topic");
    const isTopicAPI = (url) => imported && (topicRegExp.test(url) || isTopicInfoAPI(url));

    const postRegExp = new RegExp("/topic/\\d+/post", 'i');
    const isPostAPI = (url) => imported && postRegExp.test(url);

    const hotPostRegExp = new RegExp("/topic/\\d+/hot-post", 'i');
    const isHotPostAPI = (url) => imported && hotPostRegExp.test(url);

    // get data from local database
    async function get(url) {
        try {
            if(isTopicInfoAPI(url)) {
                const topicId = Number(url.match(/topic\/(\d+)/)[1]);
                const data = await db.topics.where('id').equals(topicId).toArray();
                return data[0];
            } else if(isTopicAPI(url)) {
                const [offset, limit] = url.match(/from=(\d+)&size=(\d+)/).slice(1,3).map(Number);
                const data = await db.topics.reverse().offset(offset).limit(limit).toArray();
                return data;
            } else if(isPostAPI(url)) {
                const [topicId, offset, limit] = url.match(/topic\/(\d+)\/post\?from=(\d+)&size=(\d+)/i).slice(1,4).map(Number);
                // TODO: orderBy(':id')
                const data = await db.posts.where('topicId').equals(topicId).offset(offset).limit(limit).toArray();
                data.forEach(i=>{i.awards = JSON.parse(i.awards)});
                return data.sort((a,b)=>a.floor-b.floor);
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // monkey patching Response.prototype.json
    const resolve = async (url, data) => {
        log(url);
        log('before', data);
        if (url == 'https://api.cc98.org/Board/all') {
            data[0].boards.push(info1);
        } else if(isPostAPI(url) || isTopicAPI(url)) {
            const realData = await get(url);
            data = realData;
        }
        log('after', data);
        return data;
    };
    const origResponseJSON = Response.prototype.json;
    Response.prototype.json = function () {
        return origResponseJSON.call(this).then((data) => resolve(this.url, data));
    };

    // monkey patching window.fetch
    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (...args) => {
        log('fetch', args);
        const url = args[0];
        if(url == 'https://api.cc98.org/board/16') {
            log('/board/16');
            return new Response(boardInfo[0]);
        } else if(url == 'https://api.cc98.org/topic/toptopics?boardid=16' || isHotPostAPI(url)) {
            log('toptopics || isHotPostAPI');
            return new Response(`[]`);
        } else if(isPostAPI(url) || isTopicAPI(url)) {
            log('isPostAPI || isTopicAPI', url);
            const response = new Response(`[]`);
            Object.defineProperty(response, 'url', { value: url });
            return response;
        }
        const response = await origFetch(...args);
        return response;
    };
}
