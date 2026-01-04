// ==UserScript==
// @name            qB-WebUI 标记tracker异常(魔改版)
// @name:en         qB-WebUI tag trackerERR
// @namespace       localhost
// @version         0.2.0
// @author          ColderCoder, avatasia, Schalkiii, flashlab
// @description     在 qBittorrent WebUI 中添加按钮，用于标记tracker状态出错的种子
// @description:en  add a button in qBittorrent WebUI to tag torrents with tracker error
// @license         MIT
// @run-at          document-end
// @match           http://127.0.0.1:8080/
// @downloadURL https://update.greasyfork.org/scripts/485476/qB-WebUI%20%E6%A0%87%E8%AE%B0tracker%E5%BC%82%E5%B8%B8%28%E9%AD%94%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485476/qB-WebUI%20%E6%A0%87%E8%AE%B0tracker%E5%BC%82%E5%B8%B8%28%E9%AD%94%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==
/* globals torrentsTable */
//require qB API v2.3.0 +

const extraStatus = [1]; // 需要额外标记的种子状态，包括：未联系（1）/更新中（3）/未工作（4）
const keywords = ['registered', 'deleted', 'exist', 'banned', 'err']; // 关键词用于匹配未注册种子的服务器消息
const tagNames = ['trackerErr', 'notContact', 'unregister', 'updating', 'notWork']; //待写入的标签名
const host = window.location.href;
const baseURL = host + 'api/v2/torrents/';

function getList(scope) {
    if (scope == "all") {
        return getFetch('info')
    } else if (scope == "list") {
        return torrentsTable.getFilteredAndSortedRows().map(item => item.full_data);
    } else {
        return null
    }
}

async function getFetch(route) {
    try {
        const response = await fetch(baseURL + route);
        if (!response.ok) {
            throw new Error('Error fetching info!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error: ', route, error);
        return null;
    }
}

async function processTorrents(scope = 'all') {
    const tagList = new Map();
    let count = 0;
    let torrentCounts = 0;
    let ignoreDiscontact = false; //累计超过10次网络请求失败是否终止操作
    const torrentList = await getList(scope);
    if (!torrentList || torrentList.length == 0) return;
    for (const torrent of torrentList) {
        const trackers = await getFetch(`trackers?hash=${torrent.hash}`);
        if (!trackers) {
            count++
            if (!ignoreDiscontact && count > 10 && window.confirm("网络请求失败过多，是否终止？")) {
                break;
            } else {
                ignoreDiscontact = true;
                continue
            }
        }
        let newtag = null;
        // console.log(`${count_torrent}`);
        for (const tracker of trackers) {
            if (tracker.status === 4) { //tracker is not working
                newtag = tagNames[0];
                for (const msg of keywords) {
                    if (tracker.msg.includes(msg)) {
                        console.log(`Unregistered: ${torrent.name}: ${tracker.msg}`);
                        newtag = tagNames[2];
                    }
                }
            } else if (extraStatus.includes(tracker.status)) {
                newtag = tagNames[tracker.status]
            }
        }
        if (newtag && !torrent.tags.includes(newtag)) {
            tagList.set(newtag, tagList.get(newtag) ? `${tagList.get(newtag)}|${torrent.hash}` : torrent.hash)
            torrentCounts++
        }
    }
    if (!window.confirm(`共获取 ${torrentList.length} 项（失败 ${count}项），共 ${torrentCounts} 项需要标记，是否写入标签？`)) return;
    if (torrentCounts == 0) return;
    const url = `${baseURL}addTags`;
    for (const [tags, hashes] of tagList) {
        let data = new URLSearchParams();
        data.append('hashes', hashes);
        data.append('tags', tags);
        try {
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
                console.error('Error:', tags, hashes, error);
            });
        } catch (error) {
            console.error('Error:', error.message);
        }

    }
    alert("完成!")
}

const newBtn = document.createElement("li");
newBtn.innerHTML = "<a class='js-modal'><b> 标记tracker异常 </b></a>";
document.querySelector("#desktopNavbar > ul").append(newBtn);

newBtn.addEventListener("click", async function() {
    const scope = window.prompt("!!!请先手动删除[tagNames]中包含的标签!!!\n检查全部种子请输入 [all]\n仅检查当前表格中显示的种子请输入 [list]", "all")
    if (!scope) return;
    await processTorrents(scope);
});