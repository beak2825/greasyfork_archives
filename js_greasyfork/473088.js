// ==UserScript==
// @name            qB-WebUI 标记tracker异常
// @name:en         qB-WebUI tag trackerERR
// @namespace       localhost
// @version         0.2.1
// @author          ColderCoder
// @description     在 qBittorrent WebUI 中添加按钮，用于标记tracker状态出错的种子
// @description:en  add a button in qBittorrent WebUI to tag torrents with tracker error
// @license         MIT
// @run-at          document-end
// @match           http://127.0.0.1:8080/
// @require         https://lf6-cdn-tos.bytecdntp.com/cdn/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473088/qB-WebUI%20%E6%A0%87%E8%AE%B0tracker%E5%BC%82%E5%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/473088/qB-WebUI%20%E6%A0%87%E8%AE%B0tracker%E5%BC%82%E5%B8%B8.meta.js
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

async function processTorrents() {
    try {
        //clear 'trackerErr' & 'Unregistered' tags first
        const url = `${baseURL}deleteTags`;
        const data = new URLSearchParams();
        data.append('tags', 'trackerErr,Unregistered');
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

        const torrentList = await getFetch('info');
        let count = 0;
        const keywords = ['registered', 'invalid', 'deleted', 'banned', 'not found', 'exist', '删除']; // Keywords to search for

        for (const torrent of torrentList) {
            const trackers = await getFetch(`trackers?hash=${torrent.hash}`);
            let hasWorkingTracker = false;
            let hasUnregisteredTracker = false;
            let needUpdateTags = false;
            let torrentTags = [];

            for (let i = 0; i < trackers.length; i++) {
                const tracker = trackers[i];
                if (tracker.status === 4) { // tracker is in error state, check if unregistered
                    for (const msg of keywords) {
                        if (tracker.msg.toLowerCase().includes(msg)) {
                            hasUnregisteredTracker = true;
                            count++;
                            console.log(`${count}. ${torrent.name}: ${tracker.msg}`);
                            break;
                        }
                    }
                } else if (tracker.status !== 0) { // at least one tracker is not in error state nor disabled
                    hasWorkingTracker = true;
                }
            }

            if (hasUnregisteredTracker && !hasWorkingTracker) {
                torrentTags = ['Unregistered'];
                needUpdateTags = true;
            } else if (!hasWorkingTracker) {
                torrentTags = ['trackerErr'];
                needUpdateTags = true;
            }

            if (needUpdateTags) {
                const tags = torrentTags.join(",");

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
        }
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}


jQuery("#desktopNavbar > ul").append(
    "<li><a class='js-modal'><b> 标记tracker异常 </b></a></li>",
);

jQuery(".js-modal").click(async function () {
    await processTorrents();
});