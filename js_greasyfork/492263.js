// ==UserScript==
// @name         Bangumi.tv Friend Ratings Leaderboard
// @namespace    https://github.com/Adachi-Git
// @version      0.4
// @description  Friend Ratings Leaderboard
// @author       Adachi
// @match        https://bangumi.tv/user/*/friends
// @match        https://bgm.tv/user/*/friends
// @match        https://chii.in/user/*/friends
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492263/Bangumitv%20Friend%20Ratings%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/492263/Bangumitv%20Friend%20Ratings%20Leaderboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首次运行时创建 IndexedDB 数据库和对象存储区
    function initializeIndexedDB() {
        // 删除旧版本的数据库（如果存在）
        indexedDB.deleteDatabase('friendRatingsDB');

        // 打开或创建名为 'FriendRatingsDB' 的新版本数据库
        const dbPromise = indexedDB.open('FriendRatingsDB', 1);

        // 在数据库版本变化时创建或更新对象存储区
        dbPromise.onupgradeneeded = function(event) {
            const db = event.target.result;
            // 如果不存在名为 'friendRatingsStore' 的对象存储区，则创建它
            if (!db.objectStoreNames.contains('friendRatingsStore')) {
                db.createObjectStore('friendRatingsStore', { keyPath: 'subject_id' });
            }
        };

        // 处理数据库打开成功的情况
        dbPromise.onsuccess = function(event) {
            console.log('IndexedDB opened successfully.');
        };

        // 处理数据库打开失败的情况
        dbPromise.onerror = function(event) {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    }

    // 首次运行时初始化 IndexedDB
    initializeIndexedDB();

    const batchSize = 500; // 每次存入的批量大小
    const concurrentLimit = 5; // 并发请求数量限制

    // 提取好友 ID 的函数
    function extractFriendIDsFromHTML() {
        const userElements = document.querySelectorAll('.user'); // 获取所有包含好友信息的元素
        const friendIDs = [];
        userElements.forEach((element, index) => {
            const link = element.querySelector('a[href^="/user/"]'); // 找到包含用户 ID 的链接
            if (link) {
                const userID = link.getAttribute('href').match(/\/user\/([^\/]+)/)[1]; // 从链接中提取用户 ID
                friendIDs.push(userID);
            }
        });

        console.log(`获取到了 ${friendIDs.length} 位好友，ID 分别为:`, friendIDs.join(', '));

        return friendIDs;
    }

    // 发送请求获取好友的收藏数据
    async function bangumiAPIFetch(userID, limit, offset) {
        const base_url = "https://api.bgm.tv/v0/users";
        const collections_endpoint = `${base_url}/${userID}/collections`;

        const headers = {
            'accept': 'application/json',
            'User-Agent': 'Adachi/BangumiMigrate(https://github.com/Adachi-Git)',
        };

        const params = {
            'subject_type': 2,// Anime
            'limit': limit,
            'offset': offset
        };

        try {
            const url = new URL(collections_endpoint);
            url.search = new URLSearchParams(params).toString();

            const response = await fetch(url, { headers });
            if (!response.ok) {
                if (response.status === 400) {
                    console.log(`Request for user ${userID} collections returned status 400, assuming data retrieval complete.`);
                    return []; // 返回空数组表示数据获取完毕
                } else {
                    throw new Error(`Failed to fetch collections for user ${userID}. Status code: ${response.status}`);
                }
            }
            const data = await response.json();

            // 保存收藏数据到 IndexedDB
            data.data.forEach(item => {
                saveData(item.subject_id, item.subject.name, userID, item.rate);
            });

            return data.data || [];
        } catch (error) {
            throw new Error(`Failed to fetch collections for user ${userID}: ${error.message}`);
        }
    }


    let totalSaved = 0; // 已保存的收藏总数
    let totalFetched = 0; // 已获取的收藏总数
    let buffer = []; // 缓冲区，暂存收藏数据
    let queue = []; // 用于存储等待写入数据库的数据队列
    let isWritingToDB = false; // 用于跟踪当前是否正在将数据写入数据库

    // 将数据存入 IndexedDB
    async function saveData(subjectId, subjectName, friendId, rate) {
        // 将收藏数据添加到缓冲区
        buffer.push({ subject_id: subjectId, subject_name: subjectName, friend_id: friendId, rate: rate });

        // 如果缓冲区已满并且没有正在写入数据库，则触发写入数据库的操作
        if (buffer.length >= batchSize && !isWritingToDB) {
            await writeToDB();
        }
    }

    // 一次性将缓冲区中的数据写入数据库
    async function writeToDB() {
        // 使用异步锁，确保同时只有一个写入操作在进行
        if (isWritingToDB) {
            // 如果有其他写入操作正在进行，则将当前操作添加到队列中
            return new Promise(resolve => {
                queue.push(resolve);
            });
        }

        isWritingToDB = true; // 设置正在写入数据库的标志为 true

        const dbPromise = indexedDB.open('FriendRatingsDB', 1);

        dbPromise.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['friendRatingsStore'], 'readwrite');
            const store = transaction.objectStore('friendRatingsStore');

            const currentBatch = buffer.splice(0, batchSize); // 取出当前批次的数据

            const writeNextBatch = () => {
                if (currentBatch.length === 0) {
                    // 当前批次的数据已全部写入完成

                    transaction.oncomplete = function() {
                        isWritingToDB = false; // 数据库写入完成后将标志重置为 false

                        // 处理队列中等待写入数据库的数据
                        if (queue.length > 0) {
                            const nextResolve = queue.shift(); // 从队列中取出下一个写入操作的 resolve 函数
                            nextResolve(); // 执行下一个写入操作
                        }
                    };

                    return;
                }

                const item = currentBatch.shift(); // 取出当前批次的第一个数据

                const request = store.get(item.subject_id);
                request.onsuccess = function(event) {
                    const existingData = event.target.result;
                    if (existingData) {
                        // 如果数据库中已经存在评分数据，则检查是否该用户已经对该条目评分过
                        const existingRating = existingData.ratings.find(rating => rating.friend_id === item.friend_id);
                        if (!existingRating) {
                            // 如果该用户没有对该条目评分，则将新的评分数据添加到现有数据中
                            existingData.ratings.push({ friend_id: item.friend_id, rate: item.rate });
                            store.put(existingData);
                        }
                    } else {
                        // 如果数据库中不存在评分数据，则直接将新的评分数据存入数据库
                        store.put({ subject_id: item.subject_id, subject_name: item.subject_name, ratings: [{ friend_id: item.friend_id, rate: item.rate }] });
                    }

                    // 递归调用写入下一个数据
                    writeNextBatch();
                };
            };

            // 开始写入当前批次的数据
            writeNextBatch();
        };

        dbPromise.onerror = function(event) {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    }



    async function fetchFriendCollections() {
        // 弹出二次确认窗口
        const confirmed = confirm('您确定要获取友评排行榜吗？');
        if (!confirmed) {
            return; // 用户取消操作，直接返回
        }

        // 获取好友 ID
        const friendIDs = extractFriendIDsFromHTML();
        const limit = 100; // 每页条目数量

        try {
            const allData = []; // 存储所有好友的收藏数据
            const fetchPromises = [];
            let runningFetches = 0;

            const runNextFetch = async () => {
                if (runningFetches < concurrentLimit && friendIDs.length > 0) {
                    const friendID = friendIDs.shift();
                    runningFetches++;
                    console.log(`Sending request to fetch collections for friend ${friendID}`);
                    let offset = 0;
                    let userData = [];
                    while (true) {
                        try {
                            const collections = await bangumiAPIFetch(friendID, limit, offset);
                            if (collections.length === 0) {
                                break; // 如果获取到的数据为空，则说明已经没有更多数据了
                            }
                            userData.push(...collections);
                            offset += limit; // 更新 offset 的值，准备获取下一页数据
                        } catch (error) {
                            console.error(`Failed to fetch collections for friend ${friendID}:`, error);
                            break; // 如果请求出错，则跳出循环
                        }
                    }
                    console.log(`Received collections for friend ${friendID}`);
                    runningFetches--;
                    allData.push(userData); // 将每个好友的收藏数据添加到allData数组中
                    await runNextFetch();
                }
            };

            for (let i = 0; i < concurrentLimit; i++) {
                fetchPromises.push(runNextFetch());
            }

            // 等待所有请求完成
            await Promise.all(fetchPromises);

            // 将所有好友的数据合并到allData数组中
            const allCollections = allData.reduce((acc, data) => acc.concat(data), []);

            // 处理所有数据
            allCollections.forEach(item => {
                totalFetched++;
                if (item.rating && typeof item.rating.score !== 'undefined') {
                    saveData(item.subject_id, item.subject.name, item.user_id, item.rating.score);
                }
            });

            // 如果缓冲区中还有剩余的数据，也要将它们写入数据库
            if (buffer.length > 0) {
                await writeToDB();
            }

            // 弹出提示窗口
            alert('所有好友的收藏数据已成功获取！');

            // 数据获取完毕后重新渲染右侧列表
            displaySortedEntries();
        } catch (error) {
            console.error('Failed to fetch collections for some friends:', error);
        }
    }



    // 检查IndexedDB中的数据并排序显示
    function displaySortedEntries() {
        const dbPromise = indexedDB.open('FriendRatingsDB', 1);

        dbPromise.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['friendRatingsStore'], 'readonly');
            const store = transaction.objectStore('friendRatingsStore');

            const request = store.getAll();

            request.onsuccess = function(event) {
                const data = event.target.result;
                const sortedEntries = sortEntries(data);
                renderSortedEntries(sortedEntries);
            };

            request.onerror = function(event) {
                console.error('Error getting all friend collections:', event.target.error);
            };
        };

        dbPromise.onerror = function(event) {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    }

    // 对数据进行排序
    function sortEntries(data) {
        const sortedEntries = [];
        for (const entry of data) {
            const subjectId = entry.subject_id;
            const subjectName = entry.subject_name;
            let totalRate = 0;
            let numRates = 0;
            entry.ratings.forEach(rating => {
                if (typeof rating.rate !== 'undefined' && rating.rate !== 0) {
                    totalRate += rating.rate; // 将每个用户的评分值累加到总评分中
                    numRates++; // 统计给出评分的用户数量
                }
            });
            const averageRate = numRates > 0 ? totalRate / numRates : 0;
            sortedEntries.push({ subjectId, subjectName, averageRate, numRates });
        }
        sortedEntries.sort((a, b) => b.averageRate - a.averageRate);
        return sortedEntries;
    }

    // 渲染排序后的条目并自动填充评分人数输入框
    function renderSortedEntries(sortedEntries) {
        const container = document.getElementById('sortedEntries');
        container.innerHTML = '';
        const currentDomain = window.location.hostname; // 获取当前页面的域名

        let maxNumRates = 0; // 最高评分人数

        sortedEntries.forEach((entry, index) => {
            const div = document.createElement('div');

            // 设置文字颜色为黑色
            div.style.color = '#F09199';
            const subjectLink = document.createElement('a');
            subjectLink.href = `https://${currentDomain}/subject/${entry.subjectId}`; // 使用当前域名构造链接
            subjectLink.textContent = entry.subjectName;
            subjectLink.target = '_blank'; // 在新标签页打开链接
            // 设置超链接字体颜色为浅蓝色
            subjectLink.style.color = '#1e90ff'; // 道奇蓝
            div.appendChild(document.createTextNode(`${index + 1} - `));
            div.appendChild(subjectLink);
            div.appendChild(document.createTextNode(` - 平均评分: ${entry.averageRate.toFixed(2)} - 评分人数: ${entry.numRates}`));

            // 设置字体大小为14px
            div.style.fontSize = '14px';

            container.appendChild(div);

            // 更新最高评分人数
            if (entry.numRates > maxNumRates) {
                maxNumRates = entry.numRates;
            }
        });

        // 在渲染完成后延迟一段时间再自动填充评分人数输入框为最高评分人数的2/3
        setTimeout(() => {
            autoFillFilterInput(maxNumRates);
            filterEntries(); // 手动调用一次筛选函数
        }, 1000); // 延迟1秒钟
    }

    // 自动填充评分人数输入框为最高评分人数的2/3
    function autoFillFilterInput(maxNumRates) {
        const autoValue = Math.ceil(maxNumRates * 2 / 3); // 计算出最高评分人数的2/3
        const input = document.querySelector('input[type="number"]');
        if (input) {
            input.value = autoValue; // 填充到输入框中
        }
    }


    // 创建按钮元素
    const button = document.createElement('a');

    // 设置按钮的类名、链接和标题
    button.className = 'chiiBtn';
    button.href = 'javascript:void(0)';
    button.textContent = '获取友评排行榜';

    // 按钮点击事件
    button.onclick = fetchFriendCollections;

    // 找到要添加按钮的元素
    const nameElement = document.querySelector('.name');

    // 将按钮添加到该元素的右侧
    nameElement.parentNode.insertBefore(button, nameElement.nextSibling);

    // 创建用于显示排序后条目的容器
    const container = document.createElement('div');
    container.id = 'sortedEntries';
    container.style.cssText = 'position: fixed; top: 50%; right: 10px; transform: translateY(-50%); width: 300px; height: 300px; background-color: #f0f0f0; padding: 10px; overflow-y: auto;';
    document.body.appendChild(container);

    // 创建用于显示筛选人数输入框的容器
    const filterContainer = document.createElement('div');
    filterContainer.style.cssText = 'position: fixed; top: 10%; right: 10px;';

    // 创建筛选人数输入框
    const filterInput = document.createElement('input');
    filterInput.type = 'number';
    filterInput.placeholder = '全部获取完毕后输入评分人数';
    filterInput.addEventListener('input', filterEntries);

    // 将输入框添加到筛选容器中
    filterContainer.appendChild(filterInput);

    // 将筛选容器添加到页面中
    document.body.appendChild(filterContainer);

    // 筛选函数
    function filterEntries() {
        const filterValue = parseInt(filterInput.value); // 获取输入的评分人数
        const sortedEntries = document.querySelectorAll('#sortedEntries > div'); // 获取所有条目
        let index = 0; // 初始化新的序号

        // 遍历所有条目，根据评分人数筛选显示
        sortedEntries.forEach(entry => {
            const numRates = parseInt(entry.textContent.match(/评分人数: (\d+)/)[1]); // 从文本中提取评分人数
            if (isNaN(filterValue) || numRates >= filterValue) { // 如果评分人数大于等于筛选值，则显示条目
                entry.style.display = 'block';
                // 更新条目的序号
                entry.firstChild.textContent = `${++index} - `;
            } else { // 否则隐藏条目
                entry.style.display = 'none';
            }
        });
    }


    // 页面加载时检查IndexedDB中的数据并排序显示
    displaySortedEntries();
})();