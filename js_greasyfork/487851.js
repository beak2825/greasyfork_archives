// ==UserScript==
// @name            qB-WebUI 标记工具箱
// @name:en         qB-WebUI tag toolkit
// @namespace       localhost
// @version         0.1.0
// @author          flashlab
// @description     在 qBittorrent WebUI 中添加按钮，用于筛选特定种子并增加标签或分类
// @description:en  add a button in qBittorrent WebUI to add tag or category to certain condition of torrents
// @license         MIT
// @run-at          document-end
// @match           http://127.0.0.1:8080/
// @downloadURL https://update.greasyfork.org/scripts/487851/qB-WebUI%20%E6%A0%87%E8%AE%B0%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/487851/qB-WebUI%20%E6%A0%87%E8%AE%B0%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
/* globals torrentsTable */
//require qB API v2.8.3 +

const host = window.location.href;
const baseURL = host + 'api/v2/torrents/';
var cmd1_1 = "all";
var cmd1_2 = "#保种";

function getList(scope = "all") {
    if (scope == "all") {
        return getFetch('info')
    } else if (scope == "list") {
        return torrentsTable.getFilteredAndSortedRows().map(item => item.full_data);
    } else if (scope.starsWith("?")) {
        return getFetch('info' + scope);
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

async function addTC(list, isTag = true) {
    const url = baseURL + (isTag ? "addTags" : "setCategory");
    for (const [keys, hashes] of list) {
        let data = new URLSearchParams();
        data.append('hashes', hashes);
        data.append(isTag ? 'tags' : 'category', keys);
        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            })
                .then(response => {
                console.log(response);
                if (response.status>= 400) throw new Error("Bad response from server");
            })
                .catch(error => {
                console.error('Error add tags/category:', keys, hashes, error);
                alert(`写入失败！请检查分类 [${keys}] 是否存在！`)
            });
        } catch (error) {
            console.error('Error:', error.message);
            return null
        }
    }
}

async function delTag(tagname) {
    const url = baseURL + "deleteTags";
    const data = new URLSearchParams();
    data.append('tags', tagname);
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
            if (response.status>= 400) throw new Error("Bad response from server");
        })
            .catch(error => {
            console.error('Error delete tags:', tagname, error);
            alert(`删除标签失败！请检查网络！`)
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}


async function doTrackerErr(scope, ignoreErr) {
    const extraStatus = []; // 需要额外标记的种子状态，包括：未联系（1）/更新中（3）/未工作（4）
    const keywords = ['registered', 'deleted', 'exist', 'banned', 'err']; // 关键词用于匹配未注册种子的服务器消息
    const tagNames = ['trackerErr', 'notContact', 'unregister', 'updating', 'notWork']; //待写入的标签名
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
        for (const tracker of trackers) {
            if (tracker.status === 2 && ignoreErr) { //tracker is working
                newtag = null;
                break;
            } else if (tracker.status === 4) { //tracker is not working
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
        if (newtag && !torrent.tags.split(/,\s?/).includes(newtag)) {
            tagList.set(newtag, tagList.get(newtag) ? `${tagList.get(newtag)}|${torrent.hash}` : torrent.hash)
            torrentCounts++
        }
    }
    console.log(JSON.stringify([...tagList.entries()]));
    if (!window.confirm(`共获取 ${torrentList.length} 项（失败 ${count}项），共 ${torrentCounts} 项需要标记，是否写入标签？`)) return console.log("任务取消！");
    if (torrentCounts == 0) return;
    await addTC(tagList)
    alert("完成!")
}

async function doCmd1(scope, key) {
    const newList = new Map();
    const isTag = key.startsWith("#");
    const paths = scope.split(/\s*,\s*/);
    if (isTag) key = key.substring(1);
    let torrentCounts = 0;
    const torrentList = await getList();
    if (!torrentList || torrentList.length == 0) return;
    if (scope == "all") {
        const pathList = [...new Set(torrentList.map(i => i.save_path))].sort();
        console.log(pathList.join("\n"));
        return alert("按F12查看控制台输出信息！")
    }
    for (const torrent of torrentList) {
        if (!paths.find(p => new RegExp("^" + p.split("*").map((s) => s.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")).join(".*") + "$").test(torrent.save_path))) continue;
        if ((isTag && torrent.tags.includes(key)) || (!isTag && torrent.category == key)) continue;
        newList.set(key, newList.get(key) ? `${newList.get(key)}|${torrent.hash}` : torrent.hash);
        torrentCounts++;
    }
    console.log(JSON.stringify([...newList.entries()]));
    if (!window.confirm(`共 ${torrentCounts} 项需要写入${isTag ? "标签" : "分类"} [${key}]，是否执行？`)) return console.log("任务取消！");
    if (torrentCounts == 0) return;
    await addTC(newList, isTag)
    alert("完成!")
}

async function doCmd2(time) {
    const newList = new Map();
    const hours = time.endsWith('d') ? parseFloat(time.slice(0, -1)) * 24 : parseFloat(time);
    const torrentList = await getList();
    if (!torrentList || torrentList.length == 0) return;
    const list = torrentList.reduce(function (a, b) {
        if (Date.now() / 1000 - b.added_on < hours * 3600) a += (a && "|") + b.hash
        return a
    }, "")
    console.log(list)
    newList.set("recentAdd", list)
     if (!list || !window.confirm(`是否执行？`)) return console.log("任务取消！");
    delTag("recentAdd");
    await addTC(newList);
    alert("完成!");
}

const newBtn = document.createElement("li");
newBtn.innerHTML = '<a class="returnFalse"><b> 标记 </b></a>' +
                   '<ul>' +
                   `    <li><a id="trackerErr" title="为当前页或全部存在tracker异常的种子增加标签"><img class="MyMenuIcon" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 0 25 25'><text y='1em' font-size='21'>1️⃣</text></svg>" width="16" height="16">tracker异常</a></li>` +
                   `    <li class="divider"><a id="cmd1" title="为指定路径增加标签或分类"><img class="MyMenuIcon" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 0 25 25'><text y='1em' font-size='21'>2️⃣</text></svg>" width="16" height="16">保存路径</a></li>` +
                   `    <li><a id="cmd2" title="标记x小时内添加的种子"><img class="MyMenuIcon" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 0 25 25'><text y='1em' font-size='21'>3️⃣</text></svg>" width="16" height="16">近期添加</a></li>` +
                   '</ul>';
document.querySelector("#desktopNavbar > ul").append(newBtn);

document.getElementById("trackerErr").addEventListener("click", async function() {
    const scope = window.prompt("!!!请先手动删除[tagNames]中包含的标签!!!\n检查全部种子请输入 [all]\n仅检查当前表格中显示的种子请输入 [list]", "all");
    if (!scope) return;
    await doTrackerErr(scope, window.confirm("是否忽略至少存在一个工作中tracker的种子"));
});
document.getElementById("cmd1").addEventListener("click", async function() {
    cmd1_1 = window.prompt("请输入需要标记的路径名，多项以英文逗号隔开，支持[*]通配符\n输入[all]在控制台打印全部路径列表", cmd1_1);
    if (!cmd1_1) return;
    cmd1_2 = window.prompt("请指定标签或分类\n标签需要在开头增加[#]字符", cmd1_2);
    if (!cmd1_2) return;
    await doCmd1(cmd1_1, cmd1_2);
});
document.getElementById("cmd2").addEventListener("click", async function() {
    const during = window.prompt("请输入时间差[天(d)]或[小时(h)]", "24h");
    if (!during) return;
    await doCmd2(during);
});
