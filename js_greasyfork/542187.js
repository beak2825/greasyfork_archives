// ==UserScript==
// @name         agoda-supplier
// @namespace    https://www.agoda.com/
// @version      0.2
// @description  拦截Agoda订单详情API
// @author       You
// @match        *://www.agoda.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542187/agoda-supplier.user.js
// @updateURL https://update.greasyfork.org/scripts/542187/agoda-supplier.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let resdata = {};
    const STORAGE_KEY = 'agoda_room_data';
    const POLL_INTERVAL = 3000;
    debugger;
    let interceptor = {
        urls: [],
        originalXHR: window.XMLHttpRequest,
        myXHR: function () {
            let isScriptDispatched = false;
            let req = {};
            const modifyResponse = () => {
                if (!isScriptDispatched) {
                    let detail = {
                        ...req,
                        status: xhr.status,
                        responseUrl: xhr.responseURL,
                        response: xhr.responseText || xhr.response
                    };
                    const baseurl = detail.url.split('?')[0];
                    const selectUrlList = ['https://www.agoda.com/api/cronos/property/BelowFoldParams/GetSecondaryData', 'https://www.agoda.com/api/cronos/property/BelowFoldParams/RoomGridData'];
                    if (selectUrlList.includes(baseurl)) {
                        debugger;
                        detail = JSON.parse(detail.response);
                        processApiData(detail);
                    }
                    window.dispatchEvent(new CustomEvent("injectScript", {detail}));
                    isScriptDispatched = true
                }
            }
            const xhr = new interceptor.originalXHR
            xhr.onreadystatechange = (...args) => {
                if (this.readyState === 4) {
                    modifyResponse()
                }
            }
            for (let attr in xhr) {
                if (attr === 'onreadystatechange') {
                    xhr.onreadystatechange = (...args) => {
                        if (this.readyState === 4) {
                            modifyResponse()
                        }
                        this.onreadystatechange && this.onreadystatechange.apply(this, args)
                    }
                    continue
                } else if (attr === 'onload') {
                    xhr.onload = (...args) => {
                        modifyResponse()
                        this.onload && this.onload.apply(this, args)
                    }
                    continue
                } else if (attr === 'open') {
                    this.open = (...args) => {
                        req.method = args[0];
                        req.url = new URL(args[1], location).href;
                        return xhr.open && xhr.open.apply(xhr, args)
                    }
                    continue
                } else if (attr === 'send') {
                    this.send = (...args) => {
                        req.requestBody = args[0];
                        return xhr.send && xhr.send.apply(xhr, args)
                    }
                    continue
                }

                if (typeof xhr[attr] === 'function') {
                    this[attr] = xhr[attr].bind(xhr);
                } else {
                    if (attr === 'responseText' || attr === 'response') {
                        Object.defineProperty(this, attr, {
                            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                            set: (val) => this[`_${attr}`] = val,
                            enumerable: true
                        });
                    } else {
                        Object.defineProperty(this, attr, {
                            get: () => xhr[attr],
                            set: (val) => xhr[attr] = val,
                            enumerable: true
                        });
                    }
                }
            }
        }
    }
    window.XMLHttpRequest = interceptor.myXHR;

    // 处理API数据
    function processApiData(responseData) {
        let roomList = [];
        debugger;
        // 提取房间数据（兼容不同API结构）
        if (responseData.roomGridData?.masterRooms) {
            responseData.roomGridData.masterRooms.forEach(masterRoom => {
                if (masterRoom.rooms && masterRoom.rooms.length) {
                    roomList.push(...masterRoom.rooms);
                }
            });
        } else if (responseData.masterRooms) {
            responseData.masterRooms.forEach(masterRoom => {
                if (masterRoom.rooms && masterRoom.rooms.length) {
                    roomList.push(...masterRoom.rooms);
                }
            });
        }

        // 处理并存储房间数据
        if (roomList.length) {
            roomList.forEach(room => {
                const priceField = room.price || room.totalPrice;
                const basePrice = priceField ? Number(priceField.display.toFixed(0)) : 0;
                const room_roomIdentifiers = room.roomIdentifiers;

                if (room_roomIdentifiers) {
                    resdata[room_roomIdentifiers] = {
                        basePrice: basePrice,
                        basePriceFormatted: basePrice.toLocaleString(),
                        supplierId: room.supplierId || '未知',
                        channelId: room.channelId || '未知',
                        currency: room.currency || 'HKD',
                        masterId: room.masterId || '未知',
                        roomIdentifiers: room_roomIdentifiers,
                        roomName: room.name || '未知房型'
                    };
                    // console.log('存储房间数据:', room_roomIdentifiers);
                }
            });
            debugger;
            // 保存到localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resdata));
            // console.log('房间数据已保存到localStorage');
            // 开始匹配DOM
            matchRoomDataToDom();
        }
    }

    function addTag(baseparentdom, channelId, supplierId) {
        let newElement = document.createElement("div");
        let tegElement = document.createElement("tag");
        let outElement = document.createElement("div");
        outElement.style.width = "105px";
        tegElement.innerText = 'Supplier: ' + supplierId;
        tegElement.style.color = "rgb(237 237 235)";
        tegElement.style.backgroundColor = "rgb(119 119 119)";
        tegElement.style.padding = "3px ";
        tegElement.style.borderRadius = "3px";
        tegElement.style.borderRadius = "3px";
        tegElement.style.fontSize = "12px";
        let tegElement2 = document.createElement("div");
        tegElement2.style.marginTop = "3px";
        let tegElement3 = document.createElement("tag");
        tegElement3.innerText = 'Channel: ' + channelId;
        tegElement3.style.color = "rgb(237 237 235)";
        tegElement3.style.backgroundColor = "rgb(215 89 83)";
        tegElement3.style.padding = "3px ";
        tegElement3.style.borderRadius = "3px";
        tegElement3.style.borderRadius = "3px";
        tegElement3.style.fontSize = "12px";
        newElement.appendChild(tegElement);
        newElement.className = 'surpplier_agoda2025'
        tegElement2.appendChild(tegElement3);
        //指定dom添加childnode
        outElement.appendChild(newElement);
        outElement.appendChild(tegElement2);
        baseparentdom.appendChild(outElement)
    }

    function matchRoomDataToDom() {
        // 从resdata 中获取数据
        debugger;
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            // console.log('未找到存储的房间数据，将在', POLL_INTERVAL, 'ms后重试');
            setTimeout(matchRoomDataToDom, POLL_INTERVAL);
            return;
        }
        const roomDataMap = JSON.parse(storedData);
        const roomElements = document.querySelectorAll('[data-room-identifier]');

        if (roomElements.length === 0) {
            // console.log('未找到房间元素，将在', POLL_INTERVAL, 'ms后重试');
            setTimeout(matchRoomDataToDom, POLL_INTERVAL);
            return;
        }

        for (let i = 0; i < roomElements.length; i++) {
            const elem = roomElements[i];
            const roomId = elem.getAttribute('data-room-identifier');
            if (roomId && roomDataMap[roomId]) {
                debugger;
                const roomInfo = roomDataMap[roomId];
                // 查找目标层级的div
                // 1. 找到elem下层的第一个div
                const firstLevelDiv = elem.querySelector('div');
                if (!firstLevelDiv) {
                    // console.log(`房间${roomId}未找到第一层div`);
                    continue;
                }

                // 2. 筛选firstLevelDiv的「直接子div节点」（排除非div子节点，避免索引偏移）
                const directDivChildren = Array.from(firstLevelDiv.children).filter(node => node.tagName === 'DIV');
                // 3. 取第三个div子节点（索引2：0=第一个，1=第二个，2=第三个）
                const targetPriceDiv = directDivChildren[2];
                if (!targetPriceDiv) {
                    // console.log(`房间${roomId}的第一层div下，直接子div数量不足3个（当前仅${directDivChildren.length}个）`);
                    continue;
                }

                // 4. 找到第三个div下层的div
                const targetDiv = targetPriceDiv.querySelector('div');
                if (!targetDiv) {
                    console.log(`房间${roomId}未找到目标div`);
                    continue;
                }

                // 避免重复添加
                if (!targetDiv.querySelector('.surpplier_agoda2025')) {
                    // 使用addTag函数添加标签
                    addTag(targetDiv, roomInfo.channelId, roomInfo.supplierId);
                    console.log(`已插入标签信息到房间元素: ${roomId}`);
                }
            } else {
                console.log(`未找到房间数据，房间ID: ${roomId}`);
            }
        }
    }

    function initDynamicRoomListener() {
        // 监听整个页面的DOM变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 只处理新增的节点
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(newNode => {
                        // 节点必须是元素类型（排除文本节点、注释等）
                        if (newNode.nodeType !== 1) return;

                        // 情况1：新增节点本身就是房间元素（直接带有data-room-identifier）
                        if (newNode.hasAttribute('data-room-identifier') &&
                            newNode.classList.contains('ChildRoomsList-room')) {
                            handleNewRoomElement(newNode);
                            return;
                        }

                        // 情况2：新增节点是容器，内部包含房间元素（递归查找）
                        const nestedRooms = newNode.querySelectorAll(
                            '[data-room-identifier].ChildRoomsList-room'
                        );
                        if (nestedRooms.length) {
                            nestedRooms.forEach(room => handleNewRoomElement(room));
                        }
                    });
                }
            });
        });

        // 监听整个页面的DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false, // 关闭属性监听
            characterData: false
        });

        // console.log('已启动精准房间监听（仅响应带有data-room-identifier的元素）');
    }

    // 处理单个新房间元素的逻辑
    function handleNewRoomElement(roomElem) {
        const roomId = roomElem.getAttribute('data-room-identifier');
        if (!roomId) return; // 双重保险：确保有房间ID

        // 延迟100ms
        setTimeout(() => {
            // 检查该房间是否已添加标签
            const priceDiv = roomElem.querySelector('.ChildRoomsList-roomCell-price');
            if (priceDiv && !priceDiv.querySelector('.surpplier_agoda2025')) {
                matchRoomDataToDom(roomElem); // 只处理这个新房间
                console.log(`检测到新房间（ID: ${roomId}），已执行匹配`);
            } else {
                console.log(`房间（ID: ${roomId}）已存在标签，跳过`);
            }
        }, 100);
    }

    // 初始执行
    // matchRoomDataToDom();
    initDynamicRoomListener();

})();
