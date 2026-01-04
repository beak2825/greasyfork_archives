// ==UserScript==
// @name         pt站选种插件
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  在表格第一行插入一个按钮并通过右键弹出下拉框实现全选、取消全选和复制URL的功能，左键直接复制所有选中的URL
// @author       joshua2117
// @match        https://audiences.me/*
// @match        https://hhanclub.top/*
// @match        https://ptchdbits.co/*
// @match        https://*m-team.cc/*
// @match        https://zmpt.cc/*
// @match        https://sewerpt.com/*
// @match        https://springsunday.net/*
// @match        https://www.hddolby.com/*
// @match        https://piggo.me/*
// @match        https://www.momentpt.top/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540827/pt%E7%AB%99%E9%80%89%E7%A7%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540827/pt%E7%AB%99%E9%80%89%E7%A7%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 站点配置
    const siteConfigs = {
        观众: {
            rowSelector: 'table.torrents-table > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('.torrentname table tbody tr:first-child td:nth-child(2) img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://audiences.me/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('torrent_dl_url');
                                if (bTag) {
                                    const dlUrlATag = bTag.querySelector('a');
                                    if (dlUrlATag) {
                                        return dlUrlATag.href;
                                    } else {
                                        console.log('A 标签未找到在 torrent_dl_url b 标签内，ID:', id);
                                    }
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                var free = row.querySelector('.pro_free')
                if(free){
                    if(free.alt==='Free'){
                        return true;
                    }
                }
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        瞬间: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://www.momentpt.top/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.querySelector('a[title="可在BT客户端使用，当天有效。"]')

                                if (bTag) {
                                    const dlUrlATag = bTag;
                                    if (dlUrlATag) {
                                        return dlUrlATag.href;
                                    } else {
                                        console.log('A 标签未找到在 torrent_dl_url b 标签内，ID:', id);
                                    }
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                var free = row.querySelector('.pro_free2up') || row.querySelector('.pro_free')
                if(free){
                    return true;
                }
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        憨憨: {
            rowSelector: '.torrent-table-sub-info',
            urlFetcher: async function(row) {
                const manageDiv = row.querySelector('div.torrent-manage'); // 获取当前行下的 class 为 torrent-manage 的 div 标签
                if (manageDiv) {
                    const downloadLink = manageDiv.querySelectorAll('a')[1];
                    if (downloadLink) {
                        return downloadLink.href;
                    } else {
                        console.log('下载链接未找到，在行:', row);
                    }
                } else {
                    console.log('torrent-manage div 未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                const xpath = '//*[@id="mainContent"]/div/div[2]/div[1]/div';
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                return element;
            },
            skipFirstRowForCheckboxes: false,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        彩虹岛: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('.torrentname > tbody > tr:first-child > td:nth-child(2) > a');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://ptchdbits.co/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('outer');
                                if (bTag) {
                                    const dlUrlATag = bTag.querySelectorAll('.details >tbody >tr > .rowfollow >a')[4]
                                    if (dlUrlATag) {
                                        return dlUrlATag.href;
                                    } else {
                                        console.log('A 标签未找到在 torrent_dl_url b 标签内，ID:', id);
                                    }
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        皇后: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                // const response = await fetch(`https://open.cd/plugin_details.php?id=${id}&hit=1`);
                                // const response = await fetch(`https://open.cd/usercp.php`)
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('outer');
                                if (bTag) {
                                    const dlUrlATag = bTag.querySelectorAll('.details >tbody >tr > .rowfollow >a')[4]
                                    if (dlUrlATag) {
                                        return dlUrlATag.href;
                                    } else {
                                        console.log('A 标签未找到在 torrent_dl_url b 标签内，ID:', id);
                                    }
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        馒头: {
            isDelay: true,
            rowSelector: '.ant-spin-container > div > table > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('td:nth-child(2) > div > div:nth-child(2) > div');
                if (downloadImg) {
                    const aTag = downloadImg.querySelector('td:nth-child(2) > div > div:nth-child(2) > div >a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                var apiUrls = (() => {
                                    let urls = [];
                                    try {
                                        urls = _APIHOSTS.map((u) => new URL(u));
                                    } catch (e) {
                                        console.warn("get _APIHOSTS error:", e);
                                    }
                                    urls.push(new URL(location.origin + "/api"));
                                    return urls;
                                })();
                                const apiUrl = localStorage.getItem("apiHost") || apiUrls[Math.random() * apiUrls.length | 0].href;
                                const f = new FormData();
                                f.set("id", id);
                                const opts ={
                                    method: "POST",
                                    headers: {
                                        authorization: localStorage.getItem("auth"),
                                        visitorId: localStorage.getItem("visitorId"),
                                        did: localStorage.getItem("did"),
                                        ts: Math.floor(Date.now() / 1e3)
                                    }
                                }
                                opts.body = f;
                                const response = await fetch(apiUrl + "/torrent/genDlToken",opts);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.json();
                                console.log('接口返回数据：',text)
                                return text.data
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                }else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return document.querySelector('.ant-spin-container > div > table > thead > tr');
            },
            skipFirstRowForCheckboxes: false,
            checkIsFree: function(row){
                var free = row.querySelector('.uppercase')
                if(free){
                    if(free.textContent==='Free'){
                        return true;
                    }
                }
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        织梦: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('td:nth-child(3) img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://zmpt.cc/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('content');
                                if (bTag) {
                                    console.log(bTag);
                                    return bTag.textContent.trim();
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree: async function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        下水道: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('td:nth-child(3) img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://sewerpt.com/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('content');
                                if (bTag) {
                                    console.log(bTag);
                                    return bTag.textContent.trim();
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree: async function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        高清杜比: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelector('td:nth-child(3) img.download');
                if (downloadImg) {
                    const aTag = downloadImg.closest('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://www.hddolby.com/details.php?id=${id}`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.getElementById('outer');
                                if (bTag) {
                                    console.log(bTag);
                                    const link = Array.from(bTag.querySelectorAll('a'))
                  .find(a => a.textContent.trim() === '右键复制种子链接（请保护好Passkey，谨防泄露）');
                                    return link.href
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        不可说: {
            rowSelector: '.torrents > tbody > tr',
            urlFetcher: async function(row) {
                const manageDiv = row.querySelector('.torrentname >tbody >tr >td:nth-child(2) >div >a');
                if (manageDiv) {

                        return manageDiv.href;

                } else {
                    console.log('torrent-manage div 未找到，在行:', row);
                }
                return null;
            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        },
        猪猪: {
            rowSelector: '.torrents > tbody > tr, #hr-table > tbody > tr',
            urlFetcher: async function(row) {
                const downloadImg = row.querySelectorAll('td')[1];
                if (downloadImg) {
                    const aTag = downloadImg.querySelector('a');
                    if (aTag) {
                        const idMatch = aTag.href.match(/id=(\d+)/);
                        if (idMatch && idMatch[1]) {
                            const id = idMatch[1];
                            try {
                                const response = await fetch(`https://piggo.me/details.php?id=${id}&hit=1`);
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok: ${response.statusText}`);
                                }
                                const text = await response.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const bTag = doc.querySelector('a[title="可在BT客户端使用，当天有效。"]')
                                if (bTag) {
                                    return bTag.href;
                                } else {
                                    console.log('torrent_dl_url b 标签未找到，ID:', id);
                                }
                            } catch (err) {
                                console.error('获取详情页失败，ID:', id, err);
                            }
                        } else {
                            console.log('ID 未找到在 href 中:', aTag.href);
                        }
                    } else {
                        console.log('下载链接 A 标签未找到，在行:', row);
                    }
                } else {
                    console.log('下载图片未找到，在行:', row);
                }
                return null;

            },
            insertCheckbox: function(row) {
                const checkboxCell = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, row.firstElementChild);
            },
            getHeaderRow: function(rows) {
                return rows[0];
            },
            skipFirstRowForCheckboxes: true,
            checkIsFree:  function(row){
                return false;
            },
            excludeHrItem: function(row){
                return false;
            }
        }
    };

    // 获取当前站点配置
    function getCurrentSiteConfig() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('audiences.me')) {
            return siteConfigs['观众'];
        } else if (currentUrl.includes('hhanclub.top')) {
            return siteConfigs['憨憨'];
        } else if (currentUrl.includes('ptchdbits.co')) {
            return siteConfigs['彩虹岛'];
        }else if (currentUrl.includes('next.m-team.cc')) {
            return siteConfigs['馒头'];
        }else if (currentUrl.includes('zmpt.cc')) {
            return siteConfigs['织梦'];
        }else if (currentUrl.includes('sewerpt.com')) {
            return siteConfigs['下水道'];
        }else if (currentUrl.includes('springsunday.net')) {
            return siteConfigs['不可说'];
        }else if (currentUrl.includes('www.hddolby.com')) {
            return siteConfigs['高清杜比'];
        }else if (currentUrl.includes('piggo.me')) {
            return siteConfigs['猪猪'];
        }else if (currentUrl.includes('open.cd')) {
            return siteConfigs['皇后'];
        }else if (currentUrl.includes('momentpt.top')) {
            return siteConfigs['瞬间'];
        }
        return null;
    }

    // 获取表格行
    function getTableRows(config) {
        return document.querySelectorAll(config.rowSelector);
    }

    // 创建自定义弹窗
    function createCustomAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '50%';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translate(-50%, -50%)';
        alertBox.style.backgroundColor = 'white';
        alertBox.style.border = '1px solid #ccc';
        alertBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        alertBox.style.padding = '20px';
        alertBox.style.zIndex = '9999';
        alertBox.style.fontSize = '16px';
        alertBox.style.fontFamily = 'Arial, sans-serif';
        alertBox.style.color = '#333';
        alertBox.style.borderRadius = '5px';

        const messageText = document.createElement('span');
        messageText.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginLeft = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = 'white';
        closeButton.style.transition = 'background-color 0.3s ease';
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#0056b3';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#007bff';
        });
        closeButton.addEventListener('click', () => {
            document.body.removeChild(alertBox);
        });

        alertBox.appendChild(messageText);
        alertBox.appendChild(closeButton);

        document.body.appendChild(alertBox);

        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 3000); // 自动关闭弹窗，3秒后消失
    }

    // 初始化功能
    function initFeatures() {
        const config = getCurrentSiteConfig();
        if (!config) {
            console.log('不支持的站点');
            return;
        }

        const rows = getTableRows(config);

        if (rows.length > 0) {
            // 创建一个按钮
            const headerRow = config.getHeaderRow(rows);
            if (headerRow) {
                const selectCell = document.createElement('th');
                selectCell.style.width = '30px';
                const dropdownButton = document.createElement('button');
                dropdownButton.textContent = '操作';
                dropdownButton.style.padding = '5px 10px';
                dropdownButton.style.border = 'none';
                dropdownButton.style.borderRadius = '3px';
                dropdownButton.style.cursor = 'pointer';
                dropdownButton.style.backgroundColor = '#007bff';
                dropdownButton.style.color = 'white';

                dropdownButton.style.transition = 'background-color 0.3s ease';
                dropdownButton.addEventListener('mouseover', () => {
                    dropdownButton.style.backgroundColor = '#0056b3';
                });
                dropdownButton.addEventListener('mouseout', () => {
                    dropdownButton.style.backgroundColor = '#007bff';
                });

                // 创建下拉菜单
                const dropdownMenu = document.createElement('div');
                dropdownMenu.style.position = 'fixed'; // fixed定位确保跟随鼠标，不随页面滚动偏移
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.backgroundColor = 'white';
                dropdownMenu.style.border = '1px solid #ccc';
                dropdownMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                dropdownMenu.style.zIndex = '9999999';
                dropdownMenu.style.minWidth = '120px'; // 给菜单固定最小宽度，避免内容撑破

                // 菜单选项（保持不变）
                const selectAllItem = document.createElement('div');
                selectAllItem.textContent = '全选';
                selectAllItem.style.color = 'black';
                selectAllItem.style.padding = '5px 10px';
                selectAllItem.style.cursor = 'pointer';
                selectAllItem.addEventListener('click', () => {
                    rows.forEach((row, index) => {
                        if (index !== 0 || !config.skipFirstRowForCheckboxes) {
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            if (checkbox) checkbox.checked = true;
                        }
                    });
                    dropdownMenu.style.display = 'none';
                });

                const deselectAllItem = document.createElement('div');
                deselectAllItem.textContent = '取消全选';
                deselectAllItem.style.padding = '5px 10px';
                deselectAllItem.style.cursor = 'pointer';
                deselectAllItem.style.color = 'black';
                deselectAllItem.addEventListener('click', () => {
                    rows.forEach((row, index) => {
                        if (index !== 0 || !config.skipFirstRowForCheckboxes) {
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            if (checkbox) checkbox.checked = false;
                        }
                    });
                    dropdownMenu.style.display = 'none';
                });

                const selectFreeAllItem = document.createElement('div');
                selectFreeAllItem.textContent = '选中free';
                selectFreeAllItem.style.color = 'black';
                selectFreeAllItem.style.padding = '5px 10px';
                selectFreeAllItem.style.cursor = 'pointer';
                selectFreeAllItem.addEventListener('click', () => {
                    rows.forEach((row, index) => {
                        if (index !== 0 || !config.skipFirstRowForCheckboxes) {
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            if (checkbox && config.checkIsFree(row)) checkbox.checked = true;
                        }
                    });
                    dropdownMenu.style.display = 'none';
                });

                const excludeHrItem = document.createElement('div');
                excludeHrItem.textContent = '排除hr(未实现)';
                excludeHrItem.style.color = 'black';
                excludeHrItem.style.padding = '5px 10px';
                excludeHrItem.style.cursor = 'pointer';
                excludeHrItem.addEventListener('click', () => {
                    rows.forEach((row, index) => {
                        if (index !== 0 || !config.skipFirstRowForCheckboxes) {
                            // 预留逻辑
                        }
                    });
                    dropdownMenu.style.display = 'none';
                });

                const copyButtonItem = document.createElement('div');
                copyButtonItem.textContent = '复制URL';
                copyButtonItem.style.color = 'black';
                copyButtonItem.style.padding = '5px 10px';
                copyButtonItem.style.cursor = 'pointer';
                copyButtonItem.addEventListener('click', async () => {
                    await performCopyUrls();
                    dropdownMenu.style.display = 'none';
                });

                dropdownMenu.appendChild(selectAllItem);
                dropdownMenu.appendChild(deselectAllItem);
                dropdownMenu.appendChild(copyButtonItem);
                dropdownMenu.appendChild(selectFreeAllItem);

                // 将按钮和下拉菜单添加到表头第一列
                selectCell.appendChild(dropdownButton);
                selectCell.appendChild(dropdownMenu);
                headerRow.insertBefore(selectCell, headerRow.firstElementChild);

                // 显示和隐藏下拉菜单（核心修改：右键点击显示在鼠标旁）
                dropdownButton.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // 阻止默认右键菜单
                    showDropdownMenu(e); // 传入事件对象，获取鼠标位置
                });

                // 点击外部隐藏菜单（保持不变）
                document.addEventListener('click', (e) => {
                    if (!dropdownMenu.contains(e.target) && e.target !== dropdownButton) {
                        dropdownMenu.style.display = 'none';
                    }
                });

                // 左键点击按钮直接复制（保持不变）
                dropdownButton.addEventListener('click', async (e) => {
                    if (e.button === 0) {
                        await performCopyUrls();
                    }
                });

                // 复制URL的函数（保持不变）
                async function performCopyUrls() {
                    const checkedRows = Array.from(rows).filter((row, index) => {
                        if (index === 0 && config.skipFirstRowForCheckboxes) return false;
                        const checkbox = row.querySelector('input[type="checkbox"]');
                        return checkbox && checkbox.checked;
                    });
                    let urls = [];
                    let processedCount = 0;

                    dropdownButton.textContent = `正在复制... (${processedCount}/${checkedRows.length})`;
                    dropdownButton.style.backgroundColor = '#cccccc';
                    dropdownButton.style.pointerEvents = 'none';

                    for (const [index, row] of checkedRows.entries()) {
                        const url = await config.urlFetcher(row);
                        if (url) urls.push(url);
                        processedCount++;
                        dropdownButton.textContent = `正在复制... (${processedCount}/${checkedRows.length})`;
                    }

                    if (urls.length > 0) {
                        navigator.clipboard.writeText(urls.join('\n'))
                            .then(() => createCustomAlert('已复制完成'))
                            .catch(err => console.error('复制 URL 失败:', err));
                    } else {
                        console.log('没有选择要复制的 URL。');
                    }

                    dropdownButton.textContent = '操作';
                    dropdownButton.style.backgroundColor = '#007bff';
                    dropdownButton.style.pointerEvents = 'auto';
                }

                // 🔥 核心修改：下拉菜单固定显示在鼠标旁边
                function showDropdownMenu(event) {
                    // event.clientX/Y = 鼠标相对于浏览器可视区的坐标（固定位置，不受滚动影响）
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;

                    // 设置菜单位置：鼠标坐标 + 10px 偏移（避免菜单和鼠标重叠）
                    dropdownMenu.style.left = `${mouseX + 10}px`;
                    dropdownMenu.style.top = `${mouseY + 10}px`;

                    // 可选优化：防止菜单超出浏览器可视区
                    const menuRect = dropdownMenu.getBoundingClientRect();
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    // 如果菜单右侧超出窗口，就贴窗口右侧显示
                    if (menuRect.right > windowWidth) {
                        dropdownMenu.style.left = `${windowWidth - menuRect.width - 10}px`;
                    }

                    // 如果菜单底部超出窗口，就贴窗口底部显示
                    if (menuRect.bottom > windowHeight) {
                        dropdownMenu.style.top = `${windowHeight - menuRect.height - 10}px`;
                    }

                    dropdownMenu.style.display = 'block';
                }
            }

            // 插入复选框（保持不变）
            rows.forEach((row, index) => {
                if (!(index === 0 && config.skipFirstRowForCheckboxes)) {
                    config.insertCheckbox(row);
                }
            });
        } else {
            console.log('表格未找到。');
        }
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    const siteconfig = getCurrentSiteConfig();
    let isInit = false;
    if(siteconfig.isDelay){
        waitForElement(siteconfig.rowSelector, function (el) {
            if(!isInit){
                console.log('表格元素已加载:', el);
                // 初始化功能
                setTimeout(initFeatures, 1000); // 可选延迟
                isInit = true;
            }
        });
    }else{
        // 初始化功能
        initFeatures();
    }

})();



