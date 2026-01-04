// ==UserScript==
// @name         moviepilotNameTest
// @namespace    http://tampermonkey.net/
// @version      2.3.6
// @description  moviepilots名称测试
// @author       yubanmeiqin9048 (modify by benz1)
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @match        https://totheglory.im/t/*
// @match        https://bangumi.moe/*
// @match        https://*.acgnx.se/*
// @match        https://*.dmhy.org/*
// @match        https://nyaa.si/*
// @match        https://mikanani.me/*
// @match        https://*.skyey2.com/*
// @match        https://*.m-team.cc/detail/*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486188/moviepilotNameTest.user.js
// @updateURL https://update.greasyfork.org/scripts/486188/moviepilotNameTest.meta.js
// ==/UserScript==
const moviepilotUrl = 'http://localhost:23000';
const moviepilotUser = 'admin';
const moviepilotPassword = 'password';
const isTip = false; //是否划词识别

let type = '';
let torrent_info = { "site": 0, "site_name": "", "site_cookie": "", "site_ua": "", "site_proxy": null, "site_order": null, "title": "", "description": "", "imdbid": null, "enclosure": "", "page_url": "", "size": 0, "seeders": 0, "peers": 0, "grabs": 0, "pubdate": "", "date_elapsed": null, "uploadvolumefactor": 1, "downloadvolumefactor": 0, "hit_and_run": false, "labels": [], "pri_order": 0, "volume_factor": "普通" }

function renderTag(type, string, background_color) {
    if (type == 'common') {
        return `<span style=\"background-color:${background_color};color:#ffffff;border-radius:0;font-size:12px;margin:0 4px 0 0;padding:1px 2px\">${string}</span>`
    } else {
        return `<span class="flex justify-center items-center rounded-md text-[12px] h-[18px] mr-2 px-[5px]  font-bold" style="background-color:${background_color};color:#ffffff;">${string}</span>`
    }
}


function renderMoviepilotTag(type, tag) {
    if (type == "common") {
        if (window.location.href.includes("m-team")){
            return `<th class="ant-descriptions-item-label" colspan="1" style="width: 135px; text-align: right;"><span>MoviePilot</span></th><td class="ant-descriptions-item-content" colspan="1">${tag}</td>`
        }
        return `<td class="rowhead nowrap" valign="top" align="right">MoviePilot</td><td class="rowfollow" valign="top" align="left">${tag}</td>`;
    
    } else {
        return tag
    }
}

function getSize(sizeStr) {
    let match = sizeStr.match(/(\d+\.\d+) (GB|MB|KB)/);
    if (!match) return 0;
    let size = parseFloat(match[1]);
    let unit = match[2].toLowerCase();
    switch (unit) {
        case 'mb':
            return size * 1024 ** 2;
        case 'gb':
            return size * 1024 ** 3;
        case 'tb':
            return size * 1024 ** 4;
        default:
            return 0;
    }
}

function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function login() {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            responseType: 'json',
            url: moviepilotUrl + '/api/v1/login/access-token',
            data: `username=${moviepilotUser}&password=${moviepilotPassword}`,
            headers: {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded"
            },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(res.response.access_token);
                } else if (res.status === 404) {
                    GM_log(`登录失败`)
                    reject(new Error('登录失败'));
                } else {
                    reject(new Error('Unexpected status code: ' + res.status));
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

function recognize(token, title, subtitle) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            url: moviepilotUrl + `/api/v1/media/recognize?title=${title}&subtitle=${subtitle}`,
            method: "GET",
            headers: {
                "user-agent": navigator.userAgent,
                "content-type": "application/json",
                "Authorization": `bearer ${token}`
            },
            responseType: "json",
            onload: (res) => {
                resolve(res.response);
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

function getSite(token) {
    let site_domain = window.location.hostname
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            url: moviepilotUrl + `/api/v1/site/domain/${site_domain}`,
            method: "GET",
            headers: {
                "user-agent": navigator.userAgent,
                "content-type": "application/json",
                "Authorization": `bearer ${token}`
            },
            responseType: "json",
            onload: (res) => {
                if (res.status === 200) {
                    resolve(res.response);
                } else if (res.status === 404) {
                    reject(new Error('站点不存在'));
                } else {
                    reject(new Error('Unexpected status code: ' + res.status));
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}


function downloadTorrent(downloadButton, token, media_info, torrent_name, torrent_description, download_link, torrent_size) {
    downloadButton.disabled = true;
    getSite(token).then(data => {
        torrent_info.title = torrent_name
        torrent_info.description = torrent_description
        torrent_info.page_url = window.location.href
        torrent_info.enclosure = download_link
        torrent_info.size = torrent_size
        torrent_info.site = data.id
        torrent_info.site_name = data.name
        torrent_info.site_cookie = data.cookie
        torrent_info.proxy = data.proxy
        // torrent_info.pri_order=data.pri
        torrent_info.pubdate = getFormattedDate()
        torrent_info.site_ua = navigator.userAgent
        let download_info = {
            media_in: media_info,
            torrent_in: torrent_info
        }
        GM_xmlhttpRequest({
            method: 'POST',
            responseType: 'json',
            url: moviepilotUrl + `/api/v1/download/`,
            data: JSON.stringify(download_info),
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "Authorization": `bearer ${token}`
            },
            onload: (res) => {
                GM_log(res.response.data)
                downloadButton.disabled = false;
                if (res.status == 200) {
                    if (res.response.success) {
                        downloadButton.textContent = "下载完成";
                    } else {
                        downloadButton.textContent = "下载失败";
                    }
                } else {
                    downloadButton.textContent = "下载失败";
                }
            }
        })
    }).catch(error => {
        downloadButton.textContent = `站点不存在`;
    });
}

function creatRecognizeRow(row, type, torrent_name, torrent_description, download_link, torrent_size) {
    row.innerHTML = renderMoviepilotTag(type, "识别中");
    if (window.location.href.includes("m-team")){
        row.setAttribute("class", "ant-descriptions-row")
    }
    login().then(token => {
        recognize(token, torrent_name, torrent_description).then(data => {
            GM_log(data.status)
            if (data.media_info) {
                let html = '';
                html += data.media_info.type ? renderTag(type, data.media_info.type, '#2775b6') : '';
                html += data.media_info.category ? renderTag(type, data.media_info.category, '#2775b6') : '';
                html += data.media_info.title ? renderTag(type, data.media_info.title, '#c54640') : '';
                html += data.meta_info.season_episode ? renderTag(type, data.meta_info.season_episode, '#e6702e') : '';
                html += data.meta_info.year ? renderTag(type, data.meta_info.year, '#e6702e') : '';
                html += data.media_info.tmdb_id ? '<a href="' + data.media_info.detail_link + '" target="_blank">' + renderTag(type, data.media_info.tmdb_id, '#5bb053') + '</a>' : '';
                html += data.meta_info.resource_type ? renderTag(type, data.meta_info.resource_type, '#677489') : '';
                html += data.meta_info.resource_pix ? renderTag(type, data.meta_info.resource_pix, '#677489') : '';
                html += data.meta_info.video_encode ? renderTag(type, data.meta_info.video_encode, '#677489') : '';
                html += data.meta_info.audio_encode ? renderTag(type, data.meta_info.audio_encode, '#677489') : '';
                html += data.meta_info.resource_team ? renderTag(type, data.meta_info.resource_team, '#701eeb') : '';
                if (!window.location.href.includes("m-team")){
                    html += type ? '<button id="download-button">下载种子</button>' : '<button id="download-button" class="flex justify-center items-center rounded-md text-[12px] h-[18px] mr-2 px-[5px]  font-bold" style="background-color:#cdae9c;color:#ffffff;">下载种子</button>';
                }
                row.innerHTML = renderMoviepilotTag(type, html);
                let downloadButton = document.getElementById("download-button");
                downloadButton.addEventListener("click", function () {
                    downloadTorrent(downloadButton, token, data.media_info, torrent_name, torrent_description, download_link, torrent_size)
                })
            } else {
                row.innerHTML = renderMoviepilotTag(type, `识别失败`);
            }
        }).catch(error => {
            row.innerHTML = renderMoviepilotTag(type, `识别失败`);
        });
    }).catch(error => {
        row.innerHTML = renderMoviepilotTag(type, `登录${moviepilotUrl}失败`);
    });
}

function creatRecognizeTip(tip, text) {
    tip.showText(`识别中`);
    login().then(token => {
        GM_log(text);
        recognize(token, encodeURIComponent(text), '').then(data => {
            GM_log(data.status)
            if (data.media_info) {
                let html = '';
                html += data.media_info.type ? `类型：${data.media_info.type}<br>` : '';
                html += data.media_info.category ? `分类：${data.media_info.category}<br>` : '';
                html += data.media_info.title ? `标题：${data.media_info.title}<br>` : '';
                html += data.meta_info.season_episode ? `季集：${data.meta_info.season_episode}<br>` : '';
                html += data.meta_info.year ? `年份：${data.media_info.year}<br>` : '';
                html += data.meta_info.resource_team ? `制作：${data.meta_info.resource_team}<br>` : '';
                html += data.media_info.tmdb_id ? 'tmdb：<a href="' + data.media_info.detail_link + '" target="_blank">' + data.media_info.tmdb_id + '</a>' : 'tmdb：未识别';
                tip.showText(html);
            } else {
                tip.showText(`识别失败`);
            }
        }).catch(error => {
            tip.showText(`识别失败`);
        });
    }).catch(error => {
        tip.showText(`登录${moviepilotUrl}失败`);
    });
}

function mutation_observer(target, className ,func ) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node && node.classList && node.classList.contains(className)) {
                        func();
                        observer.disconnect();
                    }
                });
            }
        });
    });
    
    observer.observe(target, { childList: true, subtree: true });
}

function insertMpRow(){
    let rows = document.querySelectorAll('.rowhead, .ant-descriptions-item-label');
    let divs = document.getElementsByClassName('font-bold leading-6');
    if (rows.length) {
        let type = 'common'
        let torrent_name = ''
        let download_link = ''
        let torrent_description = ''
        let torrent_size = ''
        if (window.location.href.includes('hdsky')) {
            torrent_name = rows[0].nextElementSibling.firstElementChild.firstElementChild.value;
            download_link = rows[1].nextElementSibling.firstElementChild.href;
            torrent_description = rows[2].nextElementSibling.innerText;
            torrent_size = getSize(rows[3].nextElementSibling.innerText);
        } else if (window.location.href.includes('totheglory')) {
            torrent_name = rows[0].nextElementSibling.firstElementChild.nextElementSibling.text;
            let tds = document.getElementsByClassName('heading');
            download_link = tds[0].nextElementSibling.firstElementChild.href
            torrent_size = getSize(tds[5].nextElementSibling.innerText);
        } else if (window.location.href.includes('m-team')) {
            torrent_name = rows[0].nextElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild.text.replace(/\.torrent$/, '');;
            download_link = rows[1].nextElementSibling.firstElementChild.href;
            torrent_description = rows[1].nextElementSibling.innerText;
            torrent_size = getSize(rows[2].nextElementSibling.innerText);
        } 
        else {
            torrent_name = rows[0].nextElementSibling.firstElementChild.text;
            download_link = rows[0].nextElementSibling.firstElementChild.href;
            torrent_description = rows[1].nextElementSibling.innerText;
            torrent_size = getSize(rows[2].nextElementSibling.innerText);
        }
        GM_log(torrent_name);
        GM_log(download_link);
        GM_log(torrent_description);
        GM_log(torrent_size);
        let table = rows[0].parentNode.parentNode.parentNode;
        let row = table.insertRow(2);
        if (torrent_name) {
            creatRecognizeRow(row, type, torrent_name, torrent_description, download_link, torrent_size)
        }
    } else if (divs.length) {
        let torrent_index_div = document.querySelector('a.index');
        let torrent_name = torrent_index_div.textContent;
        let torrent_description = divs[3].innerText;
        let download_link = torrent_index_div.href;
        let torrent_size = getSize(divs[5].nextElementSibling.innerText);
        if (torrent_name) {
            divs[3].insertAdjacentHTML('afterend', '<div class="font-bold leading-6">moviepilot</div><div class="font-light leading-6 flex flex-wrap"><div id="moviepilot" class="font-light leading-6 flex"></div></div>');
            let row = document.getElementById("moviepilot");
            creatRecognizeRow(row, type, torrent_name, torrent_description, download_link, torrent_size)
        }
    }
}

(function () {
    'use strict';
    // 结果面板
    if (isTip) {
        class RecognizeTip {
            constructor() {
                const div = document.createElement('div');
                div.hidden = true;
                div.setAttribute('style',
                    `position:absolute!important;
                font-size:13px!important;
                overflow:auto!important;
                background:#fff!important;
                font-family:sans-serif,Arial!important;
                font-weight:normal!important;
                text-align:left!important;
                color:#000!important;
                padding:0.5em 1em!important;
                line-height:1.5em!important;
                border-radius:5px!important;
                border:1px solid #ccc!important;
                box-shadow:4px 4px 8px #888!important;
                max-width:350px!important;
                max-height:216px!important;
                z-index:2147483647!important;`
                );
                document.documentElement.appendChild(div);
                //点击了内容面板，不再创建图标
                div.addEventListener('mouseup', e => e.stopPropagation());
                this._tip = div;
            }
            showText(text) { //显示测试结果
                this._tip.innerHTML = text;
                this._tip.hidden = !1;
            }
            hide() {
                this._tip.innerHTML = '';
                this._tip.hidden = true;
            }
            pop(ev) {
                this._tip.style.top = ev.pageY + 'px';
                //面板最大宽度为350px
                this._tip.style.left = (ev.pageX + 350 <= document.body.clientWidth ?
                    ev.pageX : document.body.clientWidth - 350) + 'px';
            }
        }
        const tip = new RecognizeTip();

        class Icon {
            constructor() {
                const icon = document.createElement('span');
                icon.hidden = true;
                icon.innerHTML = `<svg style="margin:4px !important;" width="16" height="16" viewBox="0 0 24 24">
                            <path d="M12 2L22 12L12 22L2 12Z" style="fill:none;stroke:#3e84f4;stroke-width:2;"></path></svg>`;
                icon.setAttribute('style',
                    `width:24px!important;
                height:24px!important;
                background:#fff!important;
                border-radius:50%!important;
                box-shadow:4px 4px 8px #888!important;
                position:absolute!important;
                z-index:2147483647!important;`
                );
                document.documentElement.appendChild(icon);
                //拦截二个鼠标事件，以防止选中的文本消失
                icon.addEventListener('mousedown', e => e.preventDefault(), true);
                icon.addEventListener('mouseup', ev => ev.preventDefault(), true);
                icon.addEventListener('click', ev => {
                    if (ev.ctrlKey) navigator.clipboard.readText()
                        .then(text => {
                            this.queryText(text.trim(), ev);
                        })
                        .catch(err => {
                            console.error('Failed to read contents: ', err);
                        });
                    else {
                        const text = window.getSelection().toString().trim().replace(/\s{2,}/g, ' ');
                        this.queryText(text, ev);
                    }
                });
                this._icon = icon;
            }
            pop(ev) {
                const icon = this._icon;
                icon.style.top = ev.pageY + 9 + 'px';
                icon.style.left = ev.pageX + -18 + 'px';
                icon.hidden = !1;
                setTimeout(this.hide.bind(this), 2e3);
            }
            hide() {
                this._icon.hidden = true;
            }
            queryText(text, ev) {
                if (text) {
                    this._icon.hidden = true;
                    tip.pop(ev);
                    creatRecognizeTip(tip, text);
                }
            }
        }

        const icon = new Icon();
        document.addEventListener('mouseup', function (e) {
            var text = window.getSelection().toString().trim();
            GM_log(text);
            if (!text) {
                icon.hide();
                tip.hide();
            }
            else icon.pop(e);
        });
    }
    if (window.location.href.includes('m-team')) {
        mutation_observer(document.body, 'ant-descriptions-row', function() {
            insertMpRow();
        });
    } else{
        insertMpRow();
    }

})();
