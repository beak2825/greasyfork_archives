// ==UserScript==
// @name            qB-WebUI 根据辅种数添加标签
// @name:en         qB-WebUI Add Tags Based on Reseed Count
// @namespace       localhost
// @version         0.5.0
// @author          Schalkiii
// @description     在 qBittorrent WebUI 中根据辅种数为种子添加标签，支持all和list两种模式，并输出调试信息
// @description:en  Add tags to torrents in qBittorrent WebUI based on reseed count, supporting all and list modes with debug info
// @license         MIT
// @run-at          document-end
// @match           http://192.168.10.72:9091/*
// @match           http://127.0.0.1:9091/*
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523274/qB-WebUI%20%E6%A0%B9%E6%8D%AE%E8%BE%85%E7%A7%8D%E6%95%B0%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523274/qB-WebUI%20%E6%A0%B9%E6%8D%AE%E8%BE%85%E7%A7%8D%E6%95%B0%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

/* globals torrentsTable */

const baseURL = window.location.origin + '/api/v2/torrents/';
const reseedAPI = 'http://api.iyuu.cn/index.php?s=App.Api.GetSubject&info_hash='; // 替换为实际的辅种查询API
const tagPrefix = 'Reseed-'; // 标签前缀，例如 Reseed-0, Reseed-1, ..., Reseed-6, Reseed-7+

// 获取种子列表（支持all和list模式）
function getTorrentList(scope) {
    if (scope === 'all') {
        return getFetch('info'); // 获取所有种子
    } else if (scope === 'list') {
        return torrentsTable.getFilteredAndSortedRows().map(row => row.full_data); // 获取当前显示的种子
    } else {
        return null;
    }
}

// 发起 fetch 请求
async function getFetch(route) {
    try {
        const response = await fetch(baseURL + route);
        if (!response.ok) {
            throw new Error('Error fetching data!');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// 检查种子是否已有Reseed-开头的标签
function hasReseedTag(tags) {
    if (!tags) return false;
    const tagArray = tags.split(', ');
    return tagArray.some(tag => tag.startsWith(tagPrefix));
}

// 根据哈希值查询辅种数
function queryReseedCount(hash) {
    return new Promise((resolve) => {
        console.log(`查询辅种数：正在查询哈希值 ${hash}...`);
        GM_xmlhttpRequest({
            url: `${reseedAPI}${hash}`,
            method: 'GET',
            responseType: 'json',
            onload: function (response) {
                console.log(`查询辅种数：请求成功，状态码：${response.status}`);
                if (response.status === 200) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.ret === 200) {
                            const reseedCount = Math.max(json.data.pid_total, json.data.tid_total);
                            console.log(`查询辅种数：哈希值 ${hash} 的辅种数为 ${reseedCount}`);
                            resolve({ hash, reseedCount });
                        } else {
                            console.warn(`查询辅种数：API返回的ret不是200，实际返回: ${json.ret}，默认辅种数为 0`);
                            resolve({ hash, reseedCount: -1 }); // 返回辅种数为 0
                        }
                    } catch (e) {
                        console.error(`查询辅种数：JSON解析失败: ${e}，默认辅种数为 0`);
                        resolve({ hash, reseedCount: -1 }); // 返回辅种数为 0
                    }
                } else {
                    console.warn(`查询辅种数：请求失败，状态码: ${response.status}，默认辅种数为 0`);
                    resolve({ hash, reseedCount: -1 }); // 返回辅种数为 0
                }
            },
            onerror: function (error) {
                console.error(`查询辅种数：请求发生错误: ${error}，默认辅种数为 0`);
                resolve({ hash, reseedCount: 0 }); // 返回辅种数为 0
            },
        });
    });
}

// 为种子添加标签
async function addTagToTorrent(hash, tag) {
    const url = `${baseURL}addTags`;
    const data = new URLSearchParams();
    data.append('hashes', hash);
    data.append('tags', tag);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });
        if (!response.ok) {
            throw new Error('Error adding tag!');
        }
        console.log(`标签添加成功：哈希值 ${hash} 已添加标签 "${tag}"`);
    } catch (error) {
        console.error(`标签添加失败：哈希值 ${hash} 添加标签 "${tag}" 时出错:`, error);
    }
}

// 根据辅种数生成标签
function getReseedTag(reseedCount) {
    if (reseedCount >= 7) {
        return `${tagPrefix}7+`; // 大于等于7的合并为一个标签
    } else {
        return `${tagPrefix}${reseedCount}`; // 0, 1, 2, ..., 6
    }
}

// 主函数：处理种子并添加标签
async function processTorrents(scope) {
    const torrentList = await getTorrentList(scope);
    if (!torrentList || torrentList.length === 0) {
        console.log('未找到种子。');
        return;
    }

    console.log(`在模式 "${scope}" 下找到 ${torrentList.length} 个种子。`);
    console.log('获取到的种子哈希值列表：', torrentList.map(torrent => torrent.hash));

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const torrent of torrentList) {
        try {
            // 检查是否已有Reseed-开头的标签
            if (hasReseedTag(torrent.tags)) {
                console.log(`跳过种子：名称 "${torrent.name}" 已有Reseed标签 "${torrent.tags}"`);
                skippedCount++;
                continue;
            }

            const { hash, reseedCount } = await queryReseedCount(torrent.hash);
            console.log(`处理种子：名称 "${torrent.name}", 哈希值 ${hash}, 辅种数 ${reseedCount}`);

            // 根据辅种数生成标签并添加
            const tag = getReseedTag(reseedCount);
            await addTagToTorrent(hash, tag);
            successCount++;
        } catch (error) {
            console.error(`处理种子失败：名称 "${torrent.name}", 哈希值 ${torrent.hash}:`, error);
            errorCount++;
        }
    }

    alert(`处理完成！\n成功：${successCount} 个，失败：${errorCount} 个，跳过已有标签：${skippedCount} 个`);
}

// 添加按钮到页面
function addButton() {
    const newBtn = document.createElement("li");
    newBtn.innerHTML = "<a class='js-modal'><b> 打可辅种数标签 </b></a>";
    document.querySelector("#desktopNavbar > ul").append(newBtn);

    newBtn.addEventListener("click", async function() {
        const scope = window.prompt("!!!请先手动删除[tagNames]中包含的标签!!!\n检查全部种子请输入 [all]\n仅检查当前表格中显示的种子请输入 [list]", "all")
        if (!scope) return;
        await processTorrents(scope);
    });
}

// 初始化
(function () {
    addButton();
})();