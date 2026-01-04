// ==UserScript==
// @name         steam workshop 创意工坊集合下载器
// @namespace    owwk
// @license      GNU AGPLv3
// @version      1.5
// @description  下载集合里的物品到 aria2
// @author       Owwk
// @match        *://steamcommunity.com/workshop/filedetails/*
// @match        *://steamcommunity.com/sharedfiles/filedetails/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      api.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/486149/steam%20workshop%20%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E9%9B%86%E5%90%88%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/486149/steam%20workshop%20%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E9%9B%86%E5%90%88%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // #09 创建常量：【rpc端口:16800、保存路径:D:\download】
    const rpcPort = 16800;
    const savePath = 'D:\\download';
    const aria2RpcUrl = `http://localhost:${rpcPort}/jsonrpc`; // Aria2 RPC接口地址
    const aria2RpcToken = `None`

    // #01 获取url里的id，可以用正则
    const urlRegex = /id=(\d+)/;
    const matches = window.location.href.match(urlRegex);
    if (!matches) {
        console.error('URL中找不到ID。');
        return;
    }
    const collectionID = matches[1];

    const getCollectionDetails = (id) => {
        return new Promise((resolve, reject) => {
            const requestUrl = 'https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/';
            const data = `collectioncount=1&publishedfileids[0]=${id}`;
            GM_xmlhttpRequest({
                method: "POST",
                url: requestUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data,
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result);  // 解析 Promise
                    } catch (e) {
                        reject(e);  // 如果解析 JSON 失败，拒绝 Promise
                    }
                },
                onerror: function (error) {
                    reject(error);  // 如果请求失败，拒绝 Promise
                }
            });
        });
    };

    let result;
    try {
        // 调用函数获取集合详情
        result = await getCollectionDetails(collectionID);
        // #03 处理响应
        if (result.response.resultcount === 0) {
            console.error('集合中没有物品。');
            return;
        }
    }
    catch (error) {
        console.error('获取集合详情失败。', error);
        return;
    }

    // #03.1 在页面上每个集合内物品的前面增加一个多选框，并且增加一个全选框在在项目的（订阅全部）等等按钮的最前面
    const itemsContainer = document.querySelector('.collectionChildren');
    const allItems = itemsContainer.querySelectorAll('.collectionItem');

    // 创建全选框并添加到页面
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'selectAllCheckbox';
    selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.itemCheckbox');
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    });

    const targetElement = document.querySelector('#profileBlock > div:nth-child(2) > div.workshopItemDescriptionTitle');

    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = 'selectAllCheckbox';
    selectAllLabel.innerText = '全选';

    const fetchButton = document.createElement('span');
    fetchButton.innerText = '正在获取物品ID...';
    fetchButton.classList = 'general_btn subscribe';


    // 插入按钮
    targetElement.insertAdjacentElement('afterend', fetchButton);
    
    // 插入全选框和标签
    targetElement.insertAdjacentElement('afterend', selectAllCheckbox);
    targetElement.insertAdjacentElement('afterend', selectAllLabel);

    // #04 获取result.response.collectiondetails.children数组，用一个数组存储children数组里的元素的publishedfileid。该过程需要异步执行保证效率。
    const children = result.response.collectiondetails[0].children;
    const publishedFileIDs = children.map(child => child.publishedfileid);

    const getPublishedFileDetailsAndRemoveInvalidItems = (ids) => {
        return new Promise((resolve, reject) => {
            const requestUrl = `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`;
            const formData = new FormData();
            formData.append('itemcount', ids.length);
            ids.forEach((id, index) => {
                formData.append(`publishedfileids[${index}]`, id);
            });

            GM_xmlhttpRequest({
                method: "POST",
                url: requestUrl,
                data: formData,
                onload: function (response) {
                    try {
                        const res = JSON.parse(response.responseText);
                        if (res.response.resultcount !== 0) {
                            const validItems = res.response.publishedfiledetails.filter(
                                fileDetails => fileDetails.title && fileDetails.file_url
                            ).map(fileDetails => ({
                                // id: fileDetails.publishedfileid,
                                title: fileDetails.title,
                                file_url: fileDetails.file_url
                            }));
                            resolve(validItems);
                        }
                    }
                    catch (error) {
                        console.error('获取下载地址失败。', error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error('获取下载地址失败。', error);
                    reject(error);
                }
            });
        });
    };

    const validItems = await getPublishedFileDetailsAndRemoveInvalidItems(publishedFileIDs);

    allItems.forEach((item, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('itemCheckbox');
        checkbox.setAttribute('data-title', validItems[index].title?.replace(/[<>:"/\\|?*]+/g, '_')); // 设置对应的title
        checkbox.setAttribute('data-file_url', validItems[index].file_url); // 设置对应的file_url
        item.insertBefore(checkbox, item.firstChild);
    });

    // 获取所有的复选框
    const checkboxes = document.querySelectorAll('.itemCheckbox');

    // 为每个复选框添加一个事件监听器
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // 检查所有复选框的状态
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });

    // #05 所有ID获取完成后，按钮文本改为【下载勾选物品】
    fetchButton.innerText = '下载勾选物品';

    // 获取下载按钮并添加点击事件
    const downloadButton = fetchButton; // 假设 fetchButton 就是我们要用的下载按钮

    downloadButton.addEventListener('click', function () {
        // #06 用户点击按钮后，按钮文本为【获取下载地址...】
        this.innerText = '正在开始下载...';

        // 获取勾选的物品的title和file_url
        let selectedItems = [];
        const checkboxes = document.querySelectorAll('.itemCheckbox:checked');
        checkboxes.forEach(checkbox => {
            const title = checkbox.getAttribute('data-title');
            const file_url = checkbox.getAttribute('data-file_url');
            if (title && file_url) {
                selectedItems.push({ title: title, file_url: file_url });
            }
        });

        if (selectedItems.length === 0) {
            alert('请至少选择一个物品。');
            return;
        }

        // 调用aria2下载
        aria2download(selectedItems);

    });



    // 假设我们已经获取到了下载信息数组 downloadInfo
    // #10 调用aria2下载，文件名为数组里保存的title，下载地址为file_url

    const aria2download = (downloadInfo) => {
        const downloadPromises = downloadInfo.map(info => {
            return new Promise((resolve, reject) => {
                // 构造aria2下载请求参数
                const params = [
                    `token:${aria2RpcToken}`, // 替换为你的Aria2 RPC密钥
                    [info.file_url],
                    {
                        out: info.title + '.vpk',
                        dir: savePath,
                    }
                ];
                // 发送请求到Aria2 RPC
                GM_xmlhttpRequest({
                    method: "POST",
                    url: aria2RpcUrl,
                    data: JSON.stringify({
                        jsonrpc: "2.0",
                        id: new Date().getTime(),
                        method: "aria2.addUri",
                        params: params,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function (response) {
                        const res = JSON.parse(response.responseText);
                        if (res.result) {
                            // 打印文件信息
                            console.log(`下载开始成功：${info.title}，保存在${savePath}。`);
                            resolve(res.result); // 下载成功
                        } else {
                            reject(res.error); // 下载失败
                        }
                    },
                    onerror: function (error) {
                        reject(error); // 请求失败
                    }
                });
            });
        });

        // 等待所有下载完成
        Promise.allSettled(downloadPromises).then(results => {
            let allSuccess = true;
            results.forEach(result => {
                if (result.status !== 'fulfilled') {
                    allSuccess = false;
                    console.error('下载失败：', result.reason);
                }
            });

            // #11 如果调用成功，按钮文本改为【已成功】，背景绿色
            // 如果没成功，控制台输入异常，按钮文本改为【失败】，背景红色
            if (allSuccess) {
                downloadButton.innerText = '成功';
                downloadButton.style.color = 'green';
            } else {
                downloadButton.innerText = '失败';
                downloadButton.style.color = 'red';
            }
        });
    };

    // #13 假设的后续步骤，可能包括清理、向用户提供反馈或其他任务
    // 例如，我们可以在下载完成后清除所有选中的复选框
    const clearSelection = () => {
        const checkboxes = document.querySelectorAll('.itemCheckbox');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        document.getElementById('selectAllCheckbox').checked = false; // 取消全选框的选中状态
    };



})();
