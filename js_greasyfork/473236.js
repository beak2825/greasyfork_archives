// ==UserScript==
// @name         MoviePliot_Recognize
// @namespace    http://www.baidu.com/
// @version      0.2
// @description  MoviePliot名称测试 需要自行修改url、username、password为自己MoviePilot配置，注意url后不要带/
// @author       thsrite
// @match        https://*/details.php?id=*
// @match        https://*/details_movie.php?id=*
// @match        https://*/details_tv.php?id=*
// @match        https://*/details_animate.php?id=*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473236/MoviePliot_Recognize.user.js
// @updateURL https://update.greasyfork.org/scripts/473236/MoviePliot_Recognize.meta.js
// ==/UserScript==

const moviepilotUrl = 'http://192.168.31.103:3003';
const moviepilotUser = 'admin';
const moviepilotPassword = 'password';

function render_tag(string, background_color) {
    return `<span style=\"background-color:${background_color};color:#ffffff;border-radius:0;font-size:12px;margin:0 4px 0 0;padding:1px 2px\">${string}</span>`
}

function render_moviepilot_tag(tag) {
    return `<td class="rowhead nowrap" valign="top" align="right">MoviePilot</td><td class="rowfollow" valign="top" align="left">${tag}</td>`;
}

function parse_season_episode(item){
    if (item > 9){
       return item;
    }
    else {
       return "0" + item;
    }
}

(function() {
    'use strict';
    let rows = document.getElementsByClassName('rowhead');
    let first_row = rows[0];
    let torrent_name = first_row.nextElementSibling.firstElementChild.text;
    let download_link = first_row.nextElementSibling.firstElementChild.href;
    GM_log("download_link", download_link);
    GM_log("torrent_name", torrent_name);
    let subtitle_row = rows[1];
    let subtitle = subtitle_row.nextElementSibling.innerHTML;
    GM_log("subtitle", subtitle);
    let table = first_row.parentNode.parentNode.parentNode;
    let row = table.insertRow(2);
    if (torrent_name) {
        new Promise(function(resolve,reject,){
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
                    resolve("Bearer " + res.response.access_token);
                }
            });
        }).then( (result) => {
            row.innerHTML = render_moviepilot_tag("识别中");
            GM_xmlhttpRequest({
                url: moviepilotUrl + "/api/v1/media/recognize?title=" + torrent_name + "&subtitle=" + subtitle,
                method: "GET",
                headers: {
                    "user-agent": navigator.userAgent,
                    "content-type": "application/json",
                    "Authorization": `${result}`
                },
                responseType: "json",
                onload(response) {
                    if (response.status === 200) {
                        const data = response.response;
                        if (data.media_info) {
                            var html = '';
                            html += data.media_info.type ? render_tag(data.media_info.type, '#2775b6') : '';
                            html += data.media_info.category ? render_tag(data.media_info.category, '#2775b6') : '';
                            html += data.media_info.title ? render_tag(data.media_info.title, '#c54640') : '';
                            html += (data.media_info.number_of_seasons ? render_tag("S"+parse_season_episode(data.media_info.number_of_seasons), '#e6702e') : '') + (data.media_info.number_of_episodes ? render_tag("E"+parse_season_episode(data.media_info.number_of_episodes), '#e6702e') : '');
                            html += data.media_info.year ? render_tag(data.media_info.year, '#e6702e') : '';
                            html += data.media_info.tmdb_id ? '<a href="'+data.media_info.detail_link + '" target="_blank">' + render_tag(data.media_info.tmdb_id, '#5bb053') + '</a>': '';
                            if (data.meta_info) {
                                html += data.meta_info.resource_type ? render_tag(data.meta_info.resource_type, '#677489') : '';
                                html += data.meta_info.resource_pix ? render_tag(data.meta_info.resource_pix, '#677489') : '';
                                html += data.meta_info.video_encode ? render_tag(data.meta_info.video_encode, '#677489') : '';
                                html += data.meta_info.audio_encode ? render_tag(data.meta_info.audio_encode, '#677489') : '';
                                html += data.meta_info.resource_team ? render_tag(data.meta_info.resource_team, '#701eeb') : '';
                            }
                            row.innerHTML = render_moviepilot_tag(html);
                        }
                        else {
                            row.innerHTML = render_moviepilot_tag("识别失败");
                        }
                    }
                    else {
                        row.innerHTML = render_moviepilot_tag("识别失败");
                    }
                },
            });
		})
	}
})();