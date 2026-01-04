// ==UserScript==
// @name         NasTools_NameTest
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  NasTools名称测试
// @author       nibbin
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457393/NasTools_NameTest.user.js
// @updateURL https://update.greasyfork.org/scripts/457393/NasTools_NameTest.meta.js
// ==/UserScript==

const nastoolUrl = 'http://localhost:3000';
const nastoolUser = 'admin';
const nastoolPassword = 'password';

function render_tag(string, background_color) {
    return `<span style=\"background-color:${background_color};color:#ffffff;border-radius:0;font-size:12px;margin:0 4px 0 0;padding:1px 2px\">${string}</span>`
}

function render_nas_tools_tag(tag) {
    return `<td class="rowhead nowrap" valign="top" align="right">NasTools</td><td class="rowfollow" valign="top" align="left">${tag}</td>`;
}


(function() {
    'use strict';
    let rows = document.getElementsByClassName('rowhead');
    let first_row = rows[0];
    let torrent_name = first_row.nextElementSibling.firstElementChild.text;
    let download_link = first_row.nextElementSibling.firstElementChild.href;
    GM_log(download_link);
    GM_log(torrent_name);
    let table = first_row.parentNode.parentNode.parentNode;
    let row = table.insertRow(2);
    if (torrent_name) {
        row.innerHTML = render_nas_tools_tag("识别中");
        GM_xmlhttpRequest({
            url: nastoolUrl + "/do?random=" + Math.random(),
            method: "POST",
            data: `{"cmd":"name_test","data":{"name":"${torrent_name}"}}`,
            headers: {
                "user-agent": navigator.userAgent,
                "content-type": "application/json"
            },
            responseType: "json",
            onload(response) {
                if (response.status === 200) {
                    const data = response.response;
                    GM_log(data);
                    if (data.code == 0) {
                        var html = '';
                        html += data.data.type ? render_tag(data.data.type, '#2775b6') : '';
                        html += data.data.category ? render_tag(data.data.category, '#2775b6') : '';
                        html += data.data.name ? render_tag(data.data.name, '#c54640') : '';
                        html += data.data.title ? render_tag(data.data.title, '#c54640') : '';
                        html += data.data.season_episode ? render_tag(data.data.season_episode, '#e6702e') : '';
                        html += data.data.year ? render_tag(data.data.year, '#e6702e') : '';
                        html += data.data.tmdbid ? '<a href="'+data.data.tmdblink + '" target="_blank">' + render_tag(data.data.tmdbid, '#5bb053') + '</a>': '';
                        html += data.data.restype ? render_tag(data.data.restype, '#677489') : '';
                        html += data.data.pix ? render_tag(data.data.pix, '#677489') : '';
                        html += data.data.video_codec ? render_tag(data.data.video_codec, '#677489') : '';
                        html += data.data.audio_codec ? render_tag(data.data.audio_codec, '#677489') : '';
                        html += '<button id="download-button">下载种子</button>';
                        row.innerHTML = render_nas_tools_tag(html);
                        let downloadButton = document.getElementById("download-button");
                        downloadButton.addEventListener("click", function(){
                            new Promise(function(resolve,reject,){
                                downloadButton.disabled = true;
                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    responseType: 'json',
                                    url: nastoolUrl + '/api/v1/user/login',
                                    data: `username=${nastoolUser}&password=${nastoolPassword}`,
                                    headers: {
                                        "accept": "application/json",
                                        "content-type": "application/x-www-form-urlencoded"
                                    },
                                    onload: (res) => {
                                        resolve(res.response.data.token);
                                    }
                                });
                            }).then( (result) => {
                                GM_xmlhttpRequest({
                                    method: 'POST',
                                    responseType: 'json',
                                    url: nastoolUrl + '/api/v1/download/item',
                                    data : `enclosure=${download_link}&title=${data.data.name}&uploadvolumefactor=1&downloadvolumefactor=1`,
                                    headers: {
                                        "accept": "application/json",
                                        "content-type": "application/x-www-form-urlencoded",
                                        "Authorization": `${result}`
                                    },
                                    onload: (res) => {
                                        GM_log(res.response.data)
                                        downloadButton.disabled = false;
                                        if (res.response.code == 0) {
                                            downloadButton.textContent = "下载完成";
                                        } else {
                                            downloadButton.textContent = "下载失败";
                                        }
                                    }
                                })
                            })
                        });
                    }
                    else {
                        row.innerHTML = render_nas_tools_tag("识别失败");
                    }
                }
                else {
                    row.innerHTML = render_nas_tools_tag("识别失败");
                }
            },
        });
    }
})();