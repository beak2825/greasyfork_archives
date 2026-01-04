// ==UserScript==
// @name         moviepilotNameTest
// @namespace    http://tampermonkey.net/
// @version      2.3.7
// @description  moviepilots名称测试
// @author       yubanmeiqin9048
// @match        https://*/detail/*
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @match        https://bangumi.moe/*
// @match        https://*.acgnx.se/*
// @match        https://*.dmhy.org/*
// @match        https://nyaa.si/*
// @match        https://mikanani.me/*
// @match        https://*.skyey2.com/*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473246/moviepilotNameTest.user.js
// @updateURL https://update.greasyfork.org/scripts/473246/moviepilotNameTest.meta.js
// ==/UserScript==
const windowPopup = true;
const moviepilotUrl = 'http://localhost:3000';
const moviepilotUser = 'admin';
const moviepilotPassword = 'password';
const apiKey = "apikey"
let ptype = '';
let btype = '';
let site_domain = window.location.hostname;
let torrent_info = { "site": 0, "site_name": "", "site_cookie": "", "site_ua": "", "site_proxy": null, "site_order": null, "title": "", "description": "", "imdbid": null, "enclosure": "", "page_url": "", "size": 0, "seeders": 0, "peers": 0, "grabs": 0, "pubdate": "", "date_elapsed": null, "uploadvolumefactor": 1, "downloadvolumefactor": 0, "hit_and_run": false, "labels": [], "pri_order": 0, "volume_factor": "普通" }

function waitForElements(selectors, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const interval = 100; // check every 100ms
        const maxTries = timeout / interval;
        let tries = 0;

        const checkExist = setInterval(() => {
            let allFound = true;
            const elements = selectors.map(selector => {
                const foundElements = document.getElementsByClassName(selector);
                if (foundElements.length === 0) {
                    allFound = false;
                }
                return foundElements;
            });

            if (allFound) {
                clearInterval(checkExist);
                resolve(elements);
            } else if (tries >= maxTries) {
                clearInterval(checkExist);
                reject(new Error(`Elements ${selectors.join(', ')} not found within ${timeout}ms`));
            }
            tries++;
        }, interval);
    });
}

function renderTag(ptype, string, background_color) {
    if (ptype == 'hhanclub') {
        return `<span class="flex justify-center items-center rounded-md text-[12px] h-[18px] mr-2 px-[5px]  font-bold" style="background-color:${background_color};color:#ffffff;">${string}</span>`;
    } else {
        return `<span style=\"background-color:${background_color};color:#ffffff;border-radius:0;font-size:12px;margin:0 4px 0 0;padding:1px 2px\">${string}</span>`;
    }
}

function renderMoviepilotTag(ptype, tag) {
    if (ptype == "common") {
        return `<td class="rowhead nowrap" valign="top" align="right">MoviePilot</td><td class="rowfollow" valign="top" align="left">${tag}</td>`;
    } else if (ptype == 'm-team') {
        return `<th class="ant-descriptions-item-label" style="width: 135px; text-align: right;" colspan="1"><span>MoviePilot</span></th><td class="ant-descriptions-item-content" colspan="1"><span>${tag}</span></td>`;
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
                    reject(new Error('登录失败'));
                } else {
                    reject(new Error('Unexpected status code: ' + res.status));
                }
            },
            onerror: (err) => {
                GM_log(err)
                reject(new Error('未知错误'));
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
                if (res.status === 200) {
                    resolve(res.response);
                } else if (res.status === 404) {
                    reject(new Error('识别失败'));
                } else {
                    reject(new Error('Unexpected status code: ' + res.status));
                }
            },
            onerror: (err) => {
                GM_log(err)
                reject(new Error('未知错误'));
            }
        });
    });
}

function getSite(token) {
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
                GM_log(err)
                reject(new Error('未知错误'));
            }
        });
    });
}

function downloadTorrentPublic(downloadButton, token, download_link) {
    downloadButton.textContent = "下载中";
    downloadButton.disabled = true;
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'json',
            url: moviepilotUrl + `/api/v1/plugin/DownloaderApi/download_torrent_notest?apikey=${apiKey}&torrent_url=${download_link}`,
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "Authorization": `bearer ${token}`
            },
            onload: (res) => {
                let status = JSON.parse(res.responseText)
                GM_log(status)
                if (status.success) {
                    resolve();
                } else {
                    reject(new Error(status.message));
                }
            }
        })
    })
}

function downloadTorrent(downloadButton, token, media_info, torrent_name, torrent_description, download_link, torrent_size) {
    downloadButton.textContent = "下载中";
    downloadButton.disabled = true;
    return new Promise(function (resolve, reject) {
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
                    if (res.status === 200) {
                        resolve();
                    } else {
                        reject(new Error('Unexpected status code: ' + res.status));
                    }
                }
            })
        }).catch(err => {
            reject(err);
        });
    })
}

function creatRecognizeRow(row, ptype, torrent_name, torrent_description, download_link, torrent_size) {
    row.innerHTML = renderMoviepilotTag(ptype, "识别中");
    login().then(token => {
        recognize(token, torrent_name, torrent_description).then(data => {
            GM_log(data.status)
            if (data.media_info) {
                let html = '';
                html += data.media_info.ptype ? renderTag(ptype, data.media_info.ptype, '#2775b6') : '';
                html += data.media_info.category ? renderTag(ptype, data.media_info.category, '#2775b6') : '';
                html += data.media_info.title ? renderTag(ptype, data.media_info.title, '#c54640') : '';
                html += data.meta_info.season_episode ? renderTag(ptype, data.meta_info.season_episode, '#e6702e') : '';
                html += data.meta_info.year ? renderTag(ptype, data.meta_info.year, '#e6702e') : '';
                html += data.media_info.tmdb_id ? '<a href="' + data.media_info.detail_link + '" target="_blank">' + renderTag(ptype, data.media_info.tmdb_id, '#5bb053') + '</a>' : '';
                html += data.meta_info.resource_type ? renderTag(ptype, data.meta_info.resource_type, '#677489') : '';
                html += data.meta_info.resource_pix ? renderTag(ptype, data.meta_info.resource_pix, '#677489') : '';
                html += data.meta_info.video_encode ? renderTag(ptype, data.meta_info.video_encode, '#677489') : '';
                html += data.meta_info.audio_encode ? renderTag(ptype, data.meta_info.audio_encode, '#677489') : '';
                html += data.meta_info.resource_team ? renderTag(ptype, data.meta_info.resource_team, '#701eeb') : '';
                html += (ptype === 'common') ?
                    '<button id="download-button">下载种子</button>' :
                    (ptype === 'hhanclub') ?
                        '<button id="download-button" class="flex justify-center items-center rounded-md text-[12px] h-[18px] mr-2 px-[5px] font-bold" style="background-color:#cdae9c;color:#ffffff;">下载种子</button>' :
                        ''
                row.innerHTML = renderMoviepilotTag(ptype, html);
                let downloadButton = document.getElementById("download-button");
                if (downloadButton) {
                    downloadButton.addEventListener("click", function () {
                        downloadTorrent(downloadButton, token, data.media_info, torrent_name, torrent_description, download_link, torrent_size).then(data => { downloadButton.textContent = "下载成功" }).catch(err => {
                            downloadButton.disabled = false;
                            downloadButton.textContent = err;
                        });
                    })
                }
            } else {
                row.innerHTML = renderMoviepilotTag(ptype, `识别失败`);
            }
        }).catch(error => {
            GM_log(error)
            row.innerHTML = renderMoviepilotTag(ptype, `识别失败`);
        });
    }).catch(error => {
        row.innerHTML = renderMoviepilotTag(ptype, `${error}`);
    });
}

function creatPushButton(btype, element, download_link) {
    login().then(token => {
        let html = ""
        if (btype == "dmhy") {
            html = '<p><strong>MoviePilot:</strong>&nbsp;<a id="download-button">推送到MP</a></p>';
        } else if (btype == "bangumi") {
            html = '<button id="download-button" class="md-primary md-button md-default-theme" ng-transclude="" style="float: right; touch-action: pan-y; user-select: none;" tabindex="0"><i class="fa fa-file ng-scope"></i> 推送到MP</button>';
        } else if (btype == "skyey") {
            html = '<b>[<a id="download-button">推送到MP</a>]</b>'
        } else {
            html = '<a class="btn episode-btn" id="download-button">推送到MP</a>'
        }
        element.insertAdjacentHTML('afterbegin', html);
        let downloadButton = document.getElementById("download-button");
        downloadButton.addEventListener("click", function () {
            downloadTorrentPublic(downloadButton, token, download_link).then(data => { downloadButton.textContent = "下载成功" }).catch(err => {
                downloadButton.disabled = false;
                downloadButton.textContent = err;
            });
        })
    })
}

function creatRecognizeTip(tip, text) {
    tip.showText(`识别中`);
    login().then(token => {
        GM_log(text);
        recognize(token, encodeURIComponent(text), '').then(data => {
            GM_log(data.status)
            let html = '';
            html += data.media_info.ptype ? `类型：${data.media_info.ptype}<br>` : '';
            html += data.media_info.category ? `分类：${data.media_info.category}<br>` : '';
            html += data.media_info.title ? `标题：${data.media_info.title}<br>` : '';
            html += data.meta_info.season_episode ? `季集：${data.meta_info.season_episode}<br>` : '';
            html += data.meta_info.year ? `年份：${data.media_info.year}<br>` : '';
            html += data.meta_info.resource_team ? `制作：${data.meta_info.resource_team}<br>` : '';
            html += data.media_info.tmdb_id ? 'tmdb：<a href="' + data.media_info.detail_link + '" target="_blank">' + data.media_info.tmdb_id + '</a>' : 'tmdb：未识别';
            tip.showText(html);
        }).catch(error => {
            GM_log(error)
            tip.showText(`识别失败`);
        });
    }).catch(error => {
        tip.showText(`${error}`);
    });
}


(function () {
    'use strict';
    // 结果面板
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
        else if (windowPopup) {icon.pop(e)};
    });

    if (site_domain.includes('m-team')) {
        waitForElements(['ant-descriptions-row']).then((elementsArray) => {
            ptype = 'm-team'
            console.log(elementsArray);
            let rows = elementsArray[0]
            let torrent_name = (rows[0].firstElementChild.nextElementSibling.outerText.split('\n')[0]);
            let torrent_description = rows[1].textContent;
            let download_link = ''
            let torrent_size = '';
            let table = rows[0].parentNode;
            let row = table.insertRow(2);
            row.className = 'ant-descriptions-row';
            if (torrent_name) {
                creatRecognizeRow(row, ptype, torrent_name, torrent_description, download_link, torrent_size)
            }
        }).catch((error) => {
            console.error(error);
        });
    } else if (site_domain.includes('hhanclub')) {
        waitForElements(['font-bold leading-6']).then((elementsArray) => {
            ptype = 'hhanclub'
            let divs = elementsArray[0];
            console.log(elementsArray)
            let torrent_index_div = document.querySelector('a.index');
            let torrent_name = divs[3].innerText;
            let torrent_description = divs[5].innerText;
            let download_link = torrent_index_div.href;
            let torrent_size = getSize(divs[7].nextElementSibling.innerText);
            if (torrent_name) {
                divs[3].insertAdjacentHTML('afterend', '<div class="font-bold leading-6">moviepilot</div><div class="font-light leading-6 flex flex-wrap"><div id="moviepilot" class="font-light leading-6 flex"></div></div>');
                let row = document.getElementById("moviepilot");
                creatRecognizeRow(row, ptype, torrent_name, torrent_description, download_link, torrent_size)
            }
        }).catch((error) => {
            console.error(error);
        });
    } else if (site_domain.includes('bangumi')) {
        waitForElements(['md-actions','torrent-info']).then((elementsArray) => {
            btype = "bangumi";
            let buttonElement = elementsArray[0];
            let titleElement = elementsArray[1];
            console.log(elementsArray);
            let download_base_link = buttonElement[0].firstElementChild.formAction.replace(site_domain, site_domain + '/download')
            let title = titleElement[0].outerText;
            let download_link = download_base_link + "/" + title.replaceAll("/","_") + '.torrent'
            console.log(download_link);
            creatPushButton(btype, buttonElement[0], download_link)
        }).catch((error) => {
            console.error(error);
        });
    } else if (site_domain.includes('mikanani')) {
        waitForElements(['leftbar-nav']).then((elementsArray) => {
            btype = "mikan";
            let buttonElement = elementsArray[0];
            console.log(elementsArray);
            let download_link = buttonElement[0].firstElementChild.href
            console.log(download_link);
            creatPushButton(btype, buttonElement[0], download_link)
        }).catch((error) => {
            console.error(error);
        });
    } else if (site_domain.includes('dmhy')) {
        waitForElements(['dis ui-tabs-panel ui-widget-content ui-corner-bottom']).then((elementsArray) => {
            btype = "dmhy";
            let buttonElement = elementsArray[0];
            console.log(elementsArray);
            let download_link = buttonElement[0].firstElementChild.lastElementChild.href
            console.log(download_link);
            creatPushButton(btype, buttonElement[0], download_link)
        }).catch((error) => {
            console.error(error);
        });
    } else if (site_domain.includes('skyey2')) {
        waitForElements(['pi']).then((elementsArray) => {
            btype = "skyey";
            let buttonElement = elementsArray[0][4];
            console.log(elementsArray);
            let download_link = encodeURIComponent(buttonElement.childNodes[13].firstElementChild.href)
            console.log(download_link);
            creatPushButton(btype, buttonElement, download_link)
        }).catch((error) => {
            console.error(error);
        });
    } else {
        waitForElements(['rowhead']).then((elementsArray) => {
            ptype = 'common'
            console.log(elementsArray);
            let rows = elementsArray[0]
            let torrent_name = (rows[0].nextElementSibling.firstElementChild.text).replace(/^\[(.*?)\]\./, '');
            let torrent_description = rows[1].nextElementSibling.innerText;
            let download_link = rows[0].nextElementSibling.firstElementChild.href;
            let torrent_size = getSize(rows[2].nextElementSibling.innerText);
            GM_log(download_link);
            let table = rows[1].parentNode.parentNode.parentNode;
            let row = table.insertRow(2);
            if (torrent_name) {
                creatRecognizeRow(row, ptype, torrent_name, torrent_description, download_link, torrent_size)
            }
        }).catch((error) => {
            console.error(error);
        });
    }
})();