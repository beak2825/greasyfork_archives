// ==UserScript==
// @name            qB-WebUI 精简tracker
// @namespace       http://tampermonkey.net/
// @version         2024-01-22
// @description     qB-WebUI 精简tracker地址,需要自定义缩略词
// @author          avatasia
// @license         MIT
// @run-at          document-end
// @match           http://127.0.0.1:8080/
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/485346/qB-WebUI%20%E7%B2%BE%E7%AE%80tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/485346/qB-WebUI%20%E7%B2%BE%E7%AE%80tracker.meta.js
// ==/UserScript==

//require qB API v2.3.0 +

const host = window.location.href;
const baseURL = host + 'api/v2/torrents/';

async function getFetch(route) {
    try {
        const response = await fetch(baseURL + route);
        if (!response.ok) {
            throw new Error('Error fetching info!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function extractDomain(url) {
    // 使用正则表达式匹配域名
    var match = url.match(/^(?:https?:\/\/)?([^\/]+)/);

    // 如果匹配成功，返回匹配的域名部分
    return match ? match[1] : null;
  }



const  tracker_dic = [
    {tracker: "52pt.site", abbr:"52pt"},
    {tracker: "hdfun.me", abbr:"hdfun"},
]

function getAbbr(tracker) {
    for (const entry of tracker_dic) {
        if (entry.tracker === tracker) {
            return entry.abbr;
        }
    }
    // 如果没有找到匹配的tracker，则返回null或其他适当的值
    return 'unmatched';
}

async function processTorrents() {
    try {
        const torrentList = await getFetch('info');
        let count = 0;
        const keywords = ['registered', 'deleted']; // Keywords to search for

        for (const torrent of torrentList) {
            let tracker = torrent.tracker;
            let trackers_count = torrent.trackers_count;
            
            const tags = "tracker_" + getAbbr(extractDomain(tracker));

            //const response = await fetch(`${baseURL}addTags?hashes=${torrent.hash}&tags=${tags}`); //GET method. only for qb version under v4.5.0
            const url = `${baseURL}addTags`;
            const data = new URLSearchParams();
            data.append('hashes', torrent.hash);
            data.append('tags', tags);
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            })
                .then(response => {
                console.log(response);
            })
                .catch(error => {
                console.error('Error:', error);
            });
        }
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}


jQuery("#desktopNavbar > ul").append(
    "<li><a class='js-modal-485346'><b> 精简tracker异常 </b></a></li>",
);

jQuery(".js-modal-485346").click(async function () {
    await processTorrents();
});