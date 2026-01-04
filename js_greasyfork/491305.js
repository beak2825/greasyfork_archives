// ==UserScript==
// @name         copymanga-自动存储浏览记录
// @namespace    http://tampermonkey.net/
// @description  自动存储拷贝漫画的浏览记录，以防拷贝卷记录跑路；书架及漫画详情页显示上次观看章节。
// @version      1.5.7.4
// @author       Y_jun
// @license      MIT
// @icon         https://hi77-overseas.mangafuna.xyz/static/free.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @match        *://*.copy20.com/*
// @match        *://*.2025copy.com/*
// @match        *://copy20.com/*
// @match        *://2025copy.com/*
// @connect      mapi.copy20.com
// @downloadURL https://update.greasyfork.org/scripts/491305/copymanga-%E8%87%AA%E5%8A%A8%E5%AD%98%E5%82%A8%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/491305/copymanga-%E8%87%AA%E5%8A%A8%E5%AD%98%E5%82%A8%E6%B5%8F%E8%A7%88%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

let token;

const API_PREFIX = 'https://mapi.copy20.com';


const STATUS_CODE = [
    ['green', '連載中'],
    ['red', '已完結'],
    ['blue', '短篇']
];


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function completeDate(value) {
    return value < 10 ? "0" + value : value;
}

function getNowFormatTime(type) {
    let nowDate = new Date();
    let colon = ":";
    let char = "-";
    let day = nowDate.getDate();
    let month = nowDate.getMonth() + 1;//注意月份需要+1
    let year = nowDate.getFullYear();
    let h = nowDate.getHours();
    let m = nowDate.getMinutes();
    let s = nowDate.getSeconds();
    //补全0，并拼接
    if (type === 'full') {
        return year + char + completeDate(month) + char + completeDate(day) + " " + completeDate(h) + colon + completeDate(m) + colon + completeDate(s);
    }
    if (type === 'short') {
        return `${year}${completeDate(month)}${completeDate(day)}${completeDate(h)}${completeDate(m)}${completeDate(s)}`;
    }
}

function getDefaultMangaObj() {
    const defaultMangaObj = {
        "name": null,           // name: 漫画名
        "uuid": null,           // uuid: 漫画uuid
        "path": null,           // path: 漫画路径
        "lastRead": null,       // lastRead: 上次阅读章节
        "lastUuid": null,       // lastUuid: 上次阅读章节uuid
        "lastIndex": 999999,    // lastIndex: 上次阅读序号
        "lastTime": null,       // lastTime: 上次阅读时间
        "latestChapter": null,  // latestChapter: 最新章节
        "latestTime": null,     // latestTime: 最新章节时间
        "isSubscribed": false,  // isSubscribed: 是否已订阅
        "tags": [],             // tags: 漫画标签
        "popular": 0,           // popular: 漫画人气
        "authors": []           // authors: 漫画作者
    }
    return defaultMangaObj;
}

function addLiulanNotice() {
    let button = document.createElement('button');
    button.id = 'save-liulan-button';
    button.style.marginLeft = '20px';
    button.textContent = '開始保存瀏覽記錄';
    button.onclick = () => {
        button.className = 'allow-save-liulan';
    }

    const keys = GM_listValues();
    const itemCount = keys.length;
    let notice = document.createElement('span');
    notice.id = 'save-liulan';
    notice.style.marginLeft = '20px';
    notice.textContent = `目前瀏覽記錄存有${itemCount}條`;
    let collectActionArea = document.querySelector('.collectAction');

    collectActionArea.appendChild(button);
    collectActionArea.appendChild(notice);
}

function addShujiaNotice() {
    let button = document.createElement('button');
    button.id = 'save-shujia-button';
    button.style.marginLeft = '20px';
    button.textContent = '開始保存訂閱記錄';
    button.onclick = () => {
        button.className = 'allow-save-shujia';
    }

    const keys = GM_listValues();
    let favCount = 0;
    keys.forEach(key => {
        const manga = GM_getValue(key);
        if (manga.isSubscribed) favCount++;
    })
    let notice = document.createElement('span');
    notice.id = 'save-shujia';
    notice.style.marginLeft = '20px';
    notice.textContent = `目前訂閱記錄存有${favCount}條`;
    let collectActionArea = document.querySelector('.collectAction');

    collectActionArea.appendChild(button);
    collectActionArea.appendChild(notice);
}

function addExportButton() {
    let button = document.createElement('button');
    button.id = 'export-json-button';
    button.textContent = '導出記錄為json';
    button.onclick = "exportJson()";
    button.onclick = () => {
        exportJson();
    }
    let headerArea = document.querySelector('#header div');
    headerArea.appendChild(button);
}

function editNoticeById(text, id) {
    let notice = document.getElementById(id);
    notice.textContent = text;
}

function getPopularNum(popularStr, savedManga) {
    if (popularStr.includes('W')) {
        return Number(popularStr.substring(0, popularStr.length - 1)) * 10000;
    }
    if (popularStr.includes('K')) {
        return Number(popularStr.substring(0, popularStr.length - 1)) * 1000;
    }
    return Math.max(Number(popularStr), savedManga.popular);
}

function exportJson() {
    const keys = GM_listValues();
    let jsonObj = {}
    keys.forEach(key => {
        let json = GM_getValue(key);
        json.tags = json.tags?.toString();
        json.authors = json.authors?.toString();
        jsonObj[key] = json;
    })
    const jsonStr = JSON.stringify(jsonObj);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = 'copymanga-export-' + getNowFormatTime('short') + '.json';
    link.click();

    URL.revokeObjectURL(url);
}

async function saveLiulanList() {
    while (!document.querySelector('.allow-save-liulan')) {
        await sleep(2000);
    }
    // editLiulanNotice('正在删除旧的本地记录……');
    // deleteAllValues();
    let offset = 0;
    let limit = 25;
    let lastIndex = 1;
    let totalStr = document.querySelector('.demonstration').innerText;
    let total = Number(totalStr.substring(3, totalStr.length - 2));
    while (offset < total) {
        editNoticeById('保存瀏覽記錄中，請勿進行其他操作，進度：' + Math.round(offset / total * 10000) / 100 + "%", 'save-liulan');
        GM_xmlhttpRequest({
            method: "get",
            url: `${window.location.origin}/api/kb/web/browses?limit=${limit}&offset=${offset}&free_type=1`,
            data: "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.160 Safari/537.36"
            },
            onload: res => {
                if (res.status === 200) {
                    const response = JSON.parse(res.response);
                    if (response.code === 200) {
                        const mangaList = response.results.list;
                        mangaList.forEach((manga) => {
                            const savedManga = GM_getValue(manga.comic.path_word, null) ?? getDefaultMangaObj();
                            const authors = [];
                            if (Array.isArray(manga.comic.author)) {
                                const authorList = manga.comic.author;
                                authorList.forEach((author) => {
                                    authors.push(author.name);
                                })
                            }
                            let tags = [];
                            if (savedManga.tags && savedManga.tags.length > 0) {
                                tags = savedManga.tags;
                            }
                            const mangaObj = {
                                "name": manga.comic.name,
                                "uuid": manga.comic.uuid,
                                "path": manga.comic.path_word,
                                "lastRead": manga.last_chapter_name,
                                "lastUuid": manga.last_chapter_id,
                                "lastIndex": lastIndex,
                                "lastTime": getNowFormatTime('full'),
                                "latestChapter": manga.comic.last_chapter_name,
                                "latestTime": manga.comic.datetime_updated,
                                "isSubscribed": savedManga.isSubscribed ?? false,
                                "tags": tags,
                                "popular": manga.comic.popular,
                                "authors": authors
                            }
                            lastIndex++;
                            GM_setValue(manga.comic.path_word, mangaObj);
                        });
                    } else {
                        editNoticeById('保存瀏覽記錄出錯，api返回json狀態碼不為200', 'save-liulan');
                        console.log('code不为200：\n' + res);
                        total = -1;
                    }
                } else {
                    editNoticeById('保存瀏覽記錄出錯，網絡請求出錯', 'save-liulan');
                    console.log('status不为200：\n' + res);
                    total = -1;
                }
            },
            onerror: () => {
                editNoticeById('保存瀏覽記錄出錯，發送請求失敗', 'save-liulan');
                console.log('读取浏览记录失败');
                total = -1;
            }
        });
        offset += limit;
        await sleep(2000);
    }
    editNoticeById('保存完畢', 'save-liulan');
}

async function saveShujiaList() {
    while (!document.querySelector('.allow-save-shujia')) {
        await sleep(2000);
    }
    let offset = 0;
    let limit = 25;
    let totalStr = document.querySelector('.demonstration').innerText;
    let total = Number(totalStr.substring(3, totalStr.length - 2));
    while (offset < total) {
        editNoticeById('保存訂閱記錄中，請勿進行其他操作，進度：' + Math.round(offset / total * 10000) / 100 + "%", 'save-shujia');
        GM_xmlhttpRequest({
            method: "get",
            url: `${window.location.origin}/api/v3/member/collect/comics?limit=${limit}&offset=${offset}&free_type=1&ordering=-datetime_modifier`,
            data: "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.160 Safari/537.36"
            },
            onload: res => {
                if (res.status === 200) {
                    const response = JSON.parse(res.response);
                    if (response.code === 200) {
                        const mangaList = response.results.list;
                        mangaList.forEach((manga) => {
                            const savedManga = GM_getValue(manga.comic.path_word, null) ?? getDefaultMangaObj();
                            const authors = [];
                            if (Array.isArray(manga.comic.author)) {
                                const authorList = manga.comic.author;
                                authorList.forEach((author) => {
                                    authors.push(author.name);
                                })
                            }
                            let tags = [];
                            if (savedManga.tags && savedManga.tags.length > 0) {
                                tags = savedManga.tags;
                            }
                            const mangaObj = {
                                "name": manga.comic.name,
                                "uuid": manga.comic.uuid,
                                "path": manga.comic.path_word,
                                "lastRead": savedManga.lastRead,
                                "lastUuid": savedManga.lastUuid,
                                "lastIndex": savedManga.lastIndex,
                                "lastTime": savedManga.lastTime,
                                "latestChapter": manga.comic.last_chapter_name,
                                "latestTime": manga.comic.datetime_updated,
                                "isSubscribed": true,
                                "tags": tags,
                                "popular": manga.comic.popular,
                                "authors": authors
                            }
                            GM_setValue(manga.comic.path_word, mangaObj);
                        });
                    } else {
                        editNoticeById('保存訂閱記錄出錯，api返回json狀態碼不為200', 'save-shujia');
                        console.log('code不为200：\n' + res);
                        total = -1;
                    }
                } else {
                    editNoticeById('保存訂閱記錄出錯，網絡請求出錯', 'save-shujia');
                    console.log('status不为200：\n' + res);
                    total = -1;
                }
            },
            onerror: () => {
                editNoticeById('保存訂閱記錄出錯，發送請求失敗', 'save-shujia');
                console.log('读取订阅记录失败');
                total = -1;
            }
        });
        offset += limit;
        await sleep(2000);
    }
    editNoticeById('保存完畢', 'save-shujia');
}

// 漫画阅读页存储漫画最后阅读的章节
function saveLastRead(path, manga = null) {
    const savedManga = manga ?? GM_getValue(path, null);
    if (!savedManga) return;
    GM_xmlhttpRequest({
        method: "get",
        url: `${API_PREFIX}/api/v3/comic2/${path}/query?platform=3`,
        data: "",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.160 Safari/537.36"
        },
        onload: res => {
            if (res.status === 200) {
                const response = JSON.parse(res.response);
                if (response.code === 200) {
                    const results = response.results;
                    // console.log(results)
                    if (results.browse) {
                        savedManga.uuid = results.browse.comic_uuid;
                        if (savedManga.lastUuid !== results.browse.chapter_uuid) {
                            savedManga.lastRead = results.browse.chapter_name;
                            savedManga.lastUuid = results.browse.chapter_uuid;
                            savedManga.lastIndex = 0;
                            savedManga.lastTime = getNowFormatTime('full');
                        }
                        GM_setValue(path, savedManga);
                    }
                } else {
                    console.log('code不为200：\n' + res);
                }
            } else {
                console.log('status不为200：\n' + res);
            }
        },
        onerror: () => {
            console.log('读取最近阅读失败');
        }
    });
}

// 漫画详情页存储漫画最后阅读的章节+漫画其他信息
function saveLastReadFull(path, count = 1) {
    if (document.querySelector('.table-default') === null) {
        if (count <= 20) {
            const args = Array.from(arguments).slice(0, arguments.length);
            args.push(count + 1);
            setTimeout(saveLastReadFull, 200, ...args);
        } else {
            saveLastRead(path);
        }
        return;
    }
    const savedManga = GM_getValue(path, null) ?? getDefaultMangaObj();
    const name = document.querySelector('h6').textContent;
    const updateArr = document.querySelector('.table-default-right').textContent.split('更新');
    const latestChapter = updateArr[1].substring(3);
    const updateTime = updateArr[2].substring(3);
    const subscribeBtnText = document.querySelector('.collect').innerText;
    const isSubscribed = subscribeBtnText.includes('取消') ? true : false;
    const tags = document.querySelector('.comicParticulars-tag').innerText.match(/#[^ ]+/g) ?? [];
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        tags[i] = tag.replaceAll('#', '');
    }
    const popularStr = document.querySelectorAll('.comicParticulars-right-txt')[2].innerText;
    const popular = getPopularNum(popularStr, savedManga);
    const authors = document.querySelectorAll('.comicParticulars-right-txt')[1].innerHTML.match(/>[^<]+<\/a>/g);
    for (let i = 0; i < authors.length; i++) {
        const author = authors[i];
        authors[i] = author.substring(1, author.length - 4);
    }
    savedManga.name = name;
    savedManga.path = path;
    savedManga.latestChapter = latestChapter;
    savedManga.latestTime = updateTime;
    savedManga.isSubscribed = isSubscribed;
    savedManga.tags = tags;
    savedManga.popular = popular;
    savedManga.authors = authors;
    saveLastRead(path, savedManga);
}

// 漫画详情页显示本地阅读记录
function showSavedLastRead(path, count = 1) {
    if (document.querySelector('ul') === null) {
        if (count <= 50) {
            const args = Array.from(arguments).slice(0, arguments.length);
            args.push(count + 1);
            setTimeout(saveLastRead, 200, ...args);
        }
        return;
    }
    let savedManga = GM_getValue(path, getDefaultMangaObj());
    const lastUuid = savedManga.lastUuid ?? null;

    const ul = document.querySelector('ul');
    let showSpan = document.querySelector('.local-last-read-name') ?? document.createElement('span');
    showSpan.className = 'local-last-read-name';
    showSpan.textContent = '本地記錄：';
    let showLink = document.querySelector('.local-last-read-uuid') ?? document.createElement('a');
    showLink.className = 'local-last-read-uuid';
    showLink.target = '_blank';
    showLink.innerText = '無本地記錄';
    showLink.style.color = '#1790E6';
    if (lastUuid) {
        showLink.href = `/comic/${path}/chapter/${lastUuid}`;
        showLink.innerText = savedManga.lastRead;
    }
    let refreshBtn = document.querySelector('.local-last-read-refresh') ?? document.createElement('span');
    refreshBtn.className = 'local-last-read-refresh';
    refreshBtn.textContent = '(點擊刷新)';
    refreshBtn.style.color = 'green';
    refreshBtn.style.marginLeft = '20px';
    refreshBtn.style.cursor = 'pointer';
    refreshBtn.onclick = () => { showSavedLastRead(path, 1) };
    let li = document.querySelector('.local-last-read') ?? document.createElement('li');
    li.className = 'local-last-read';
    li.appendChild(showSpan);
    li.appendChild(showLink);
    li.appendChild(refreshBtn);
    ul.appendChild(li);
}

// 我的书架展示上次阅读章节
function addLastReadToManga(man) {
    Array.from(man.children).forEach(child => {
        let h3 = child.querySelector('h3');
        h3.title = h3.textContent;
        let h4 = child.querySelector('h4');

        const path = child.firstChild.href.split('/')[4];
        const savedJson = GM_getValue(path, null);
        let lastRead;
        let lastUuid;
        if (savedJson) {
            lastRead = savedJson.lastRead;
            lastUuid = savedJson.lastUuid;
        }
        h4.id = path;
        h4.innerHTML = lastUuid ? `<a href="/comic/${path}/chapter/${lastUuid}" target='_blank' title="${lastRead}" style="margin:0;float:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">本地記錄：${lastRead}</a>` : '無本地記錄';
    });
}

function handlePersonPage() {
    if (window.location.pathname.includes('liulan')) {
        console.log('当前位置：我的浏览');
        addLiulanNotice();
        saveLiulanList();
    } else if (window.location.pathname.includes('shujia')) {
        console.log('当前位置：我的书架');
        addShujiaNotice();
        saveShujiaList();
    }
    if (/liulan|shujia/.test(window.location.pathname)) {
        let interval = setInterval(() => {
            const man = document.querySelector('.man_');
            if (man) {
                clearInterval(interval);
                addLastReadToManga(man);
                const homeObserver = new MutationObserver((mutationsList) => {
                    // console.log(mutationsList);
                    if (mutationsList.length > 0) {
                        addLastReadToManga(man);
                    }
                });
                homeObserver.observe(man, { childList: true });
                let refreshButton = document.querySelector('.el-icon-refresh').parentElement;
                refreshButton.onclick = () => {
                    let refreshInterval = setInterval(() => {
                        const loading = document.querySelector('.el-loading-parent--relative');
                        if (!loading) {
                            clearInterval(refreshInterval);
                            addLastReadToManga(man);
                        }
                    }, 200);
                }
            }
        }, 1000);
    }
}

function handleFaxian() {
    let interval = setInterval(() => {
        let comicBox = document.querySelector('.row.exemptComic-box');
        if (comicBox) {
            clearInterval(interval);
            const comicListObj = eval('(' + comicBox.getAttribute('list') + ')');
            comicListObj.forEach(comicData => {
                let picEle = comicBox.querySelector(`.exemptComic_Item-img [href="/comic/${comicData.path_word}"]`);
                let statusEle = document.createElement('span');
                let statusArr = STATUS_CODE[comicData.status] ?? ['black', '-'];
                statusEle.innerText = statusArr[1]
                statusEle.style.position = 'absolute';
                statusEle.style.backgroundColor = statusArr[0];
                statusEle.style.fontSize = '12px';
                statusEle.style.color = 'white';
                picEle.insertBefore(statusEle, picEle.firstChild);

                let titleEle = comicBox.querySelector(`.exemptComicItem-txt [href="/comic/${comicData.path_word}"]`);
                let authorEle = titleEle.nextSibling;
                authorEle.innerHTML = '作者：';
                comicData.author.forEach(au => {
                    let authorLink = document.createElement('a');
                    authorLink.href = `${window.location.origin}/search?q=${au.name}&q_type=author`;
                    authorLink.target = "_blank";
                    authorLink.innerText = au.name;
                    authorLink.style.marginRight = '6px';
                    authorEle.appendChild(authorLink);
                });
            })
        }
    }, 100);
}


addEventListener("load", () => {
    token = 'Token ' + document.cookie.split('; ').find((cookie) => cookie.startsWith('token='))?.replace('token=', '');
    if (token.length < 8) return;
    const pathArr = window.location.pathname.replace('#', '').split('/');
    if (pathArr.length > 3 && pathArr[2] === 'person') {
        console.log('当前位置：个人中心');
        addExportButton();
        handlePersonPage();

        const container = document.querySelector('.el-main .el-container');
        const homeObserver = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    handlePersonPage();
                }
            }
        });
        homeObserver.observe(container, { childList: true });
    } else if (pathArr.length === 3 && pathArr[1] === 'comic' && pathArr[2]) {
        console.log('当前位置：漫画详情页');
        saveLastReadFull(pathArr[2]);
        showSavedLastRead(pathArr[2]);
        document.addEventListener('visibilitychange', () => {
            saveLastReadFull(pathArr[2]);
            showSavedLastRead(pathArr[2]);
        });
    } else if (pathArr.length === 5 && pathArr[3] === 'chapter' && pathArr[2]) {
        console.log('当前位置：漫画阅读中');
        saveLastRead(pathArr[2]);
    }
    if (pathArr.length === 2 && pathArr[1] === 'comics') {
        console.log('当前位置：发现');
        handleFaxian();
    }
})
