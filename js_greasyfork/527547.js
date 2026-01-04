// ==UserScript==
// @name         Bilibili 庆会广场
// @namespace    Schwi
// @version      0.8
// @description  Bilibili 庆会广场查询
// @author       Schwi
// @match        *://*.bilibili.com/*
// @connect      api.live.bilibili.com
// @connect      api.vc.bilibili.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @noframes
// @supportURL   https://github.com/cyb233/script
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/527547/Bilibili%20%E5%BA%86%E4%BC%9A%E5%B9%BF%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/527547/Bilibili%20%E5%BA%86%E4%BC%9A%E5%B9%BF%E5%9C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加全局变量
    let partyList = [];
    let collectedCount = 0;

    // 筛选按钮数据结构
    const defaultFilters = {
        // 全部: {type: "checkbox", filter: (item, input) => true },
        有奖预约: { type: "checkbox", filter: (item, input) => Object.keys(item.reserveInfo).length > 0 },
        普通预约: { type: "checkbox", filter: (item, input) => Object.keys(item.reserveInfo).length === 0 },
        已开奖: { type: "checkbox", filter: (item, input) => item.reserveInfo?.lottery_result },
        未开奖: { type: "checkbox", filter: (item, input) => item.reserveInfo && !item.reserveInfo.lottery_result },
        已预约: { type: "checkbox", filter: (item, input) => item.is_subscribed === 1 },
        未预约: { type: "checkbox", filter: (item, input) => item.is_subscribed === 0 },
        直播中: { type: "checkbox", filter: (item, input) => item.room_info.live_status === 1 },
        未开播: { type: "checkbox", filter: (item, input) => item.room_info.live_status === 0 },
        搜索: {
            type: "text",
            filter: (item, input) => {
                const searchText = input.toLocaleUpperCase();
                const authorName = item.room_info.name.toLocaleUpperCase();
                const authorMid = item.room_info.uid.toString().toLocaleUpperCase();
                const titleText = item.party_title.toLocaleUpperCase();
                const descText = (item.party_text || '').toLocaleUpperCase();

                return authorName.includes(searchText) || authorMid.includes(searchText) || titleText.includes(searchText) || descText.includes(searchText);
            }
        },
    };

    // 工具函数：创建 dialog
    function createDialog(id, title, content) {
        let dialog = document.createElement('div');
        dialog.id = id;
        dialog.style.position = 'fixed';
        dialog.style.top = '5%';
        dialog.style.left = '5%';
        dialog.style.width = '90%';
        dialog.style.height = '90%';
        dialog.style.backgroundColor = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        dialog.style.zIndex = '9999';
        dialog.style.display = 'none';
        dialog.style.overflow = 'hidden'; // 添加 overflow: hidden

        let header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #ccc';
        header.style.backgroundColor = '#f9f9f9';

        let titleElement = document.createElement('span');
        titleElement.textContent = title;
        header.appendChild(titleElement);

        let closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.backgroundColor = '#ff4d4f'; // 修改背景颜色为红色
        closeButton.style.color = '#fff'; // 修改文字颜色为白色
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px 10px';
        closeButton.style.transition = 'background-color 0.3s'; // 添加过渡效果
        closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#d93637'; } // 添加悬停效果
        closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#ff4d4f'; } // 恢复背景颜色
        closeButton.onclick = () => dialog.remove();
        header.appendChild(closeButton);

        dialog.appendChild(header);

        let contentArea = document.createElement('div');
        contentArea.innerHTML = content;
        contentArea.style.padding = '10px';
        dialog.appendChild(contentArea);

        document.body.appendChild(dialog);

        return {
            dialog: dialog,
            header: header,
            titleElement: titleElement,
            closeButton: closeButton,
            contentArea: contentArea
        };
    }

    // API 请求函数
    async function apiRequest(url, retry = 3) {
        function appendTimestamp(u) {
            const ts = `_ts=${Date.now()}`;
            return u.includes('?') ? `${u}&${ts}` : `${u}?${ts}`;
        }
        for (let attempt = 1; attempt <= retry; attempt++) {
            try {
                const response = await GM.xmlHttpRequest({
                    method: 'GET',
                    url: appendTimestamp(url),
                });
                const data = JSON.parse(response.responseText);
                return data;
            } catch (e) {
                console.error(`API ${url} 请求失败，正在重试...`, e);
                if (attempt === retry) {
                    throw e;
                }
                await new Promise(res => setTimeout(res, 1000));
            }
        }
    }

    // 显示结果 dialog
    function showResultsDialog() {
        const { dialog, titleElement, closeButton } = createDialog('resultsDialog', `庆会结果（${partyList.length}/${partyList.length}）`, '');

        let gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill,minmax(200px,1fr))';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '10px';
        gridContainer.style.height = 'calc(90% - 50px)'; // 设置高度以启用滚动
        gridContainer.style.overflowY = 'auto'; // 启用垂直滚动
        gridContainer.style.alignContent = 'flex-start';

        // 添加全局切换按钮
        const toggleVisibilityButton = document.createElement('button');
        toggleVisibilityButton.textContent = "是否只看图片";
        toggleVisibilityButton.style.backgroundColor = "#00a1d6";
        toggleVisibilityButton.style.color = "#fff";
        toggleVisibilityButton.style.border = 'none';
        toggleVisibilityButton.style.borderRadius = '5px';
        toggleVisibilityButton.style.cursor = 'pointer';
        toggleVisibilityButton.style.padding = '5px 10px';
        toggleVisibilityButton.style.transition = 'background-color 0.3s'; // 添加过渡效果
        toggleVisibilityButton.style.marginLeft = "auto"; // 右对齐
        toggleVisibilityButton.style.marginRight = "10px";
        toggleVisibilityButton.onmouseover = () => { toggleVisibilityButton.style.backgroundColor = "#008ecf"; };
        toggleVisibilityButton.onmouseout = () => { toggleVisibilityButton.style.backgroundColor = "#00a1d6"; };

        let isContentVisible = true; // 全局状态

        toggleVisibilityButton.onclick = () => {
            isContentVisible = !isContentVisible;
            const contentContainers = document.querySelectorAll(".party-content-container");
            contentContainers.forEach(container => {
                container.style.display = isContentVisible ? "flex" : "none";
            });
        };
        // 添加到倒数第二个
        closeButton.before(toggleVisibilityButton);

        const deal = (partyList) => {
            let checkedFilters = [];
            for (let key in defaultFilters) {
                const f = defaultFilters[key];
                const filter = filterButtonsContainer.querySelector(`#${key}`);
                let checkedFilter;
                switch (f.type) {
                    case 'checkbox':
                        checkedFilter = { ...f, value: filter.checked };
                        break;
                    case 'text':
                        checkedFilter = { ...f, value: filter.value };
                        break;
                }
                checkedFilters.push(checkedFilter);
            }
            partyList.forEach(item => {
                item.display = checkedFilters.every(f => f.value ? f.filter(item, f.value) : true);
            });
            console.log(checkedFilters, partyList.filter(item => item.display));

            // 更新标题显示筛选后的条数和总条数
            titleElement.textContent = `庆会结果（${partyList.filter(item => item.display).length}/${partyList.length}）`;

            // 重新初始化 IntersectionObserver
            observer.disconnect();
            renderedCount = 0;
            gridContainer.innerHTML = ''; // 清空 gridContainer 的内容
            renderBatch();
        };

        // 封装生成筛选按钮的函数
        const createFilterButtons = (filters, partyList) => {
            let mainContainer = document.createElement('div');
            mainContainer.style.display = 'flex';
            mainContainer.style.flexWrap = 'wrap'; // 修改为换行布局
            mainContainer.style.width = '100%';

            for (let key in filters) {
                let filter = filters[key];
                let input = document.createElement('input');
                input.type = filter.type;
                input.id = key;
                input.style.marginRight = '5px';
                // 添加边框样式
                if (filter.type === 'text') {
                    input.style.border = '1px solid #ccc';
                    input.style.padding = '5px';
                    input.style.borderRadius = '5px';
                }

                let label = document.createElement('label');
                label.htmlFor = key;
                label.textContent = key;
                label.style.display = 'flex'; // 确保 label 和 input 在同一行
                label.style.alignItems = 'center'; // 垂直居中对齐
                label.style.marginRight = '5px';

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.marginRight = '10px';

                if (['checkbox', 'radio'].includes(filter.type)) {
                    (function (partyList, filter, input) {
                        input.addEventListener('change', () => deal(partyList));
                    })(partyList, filter, input);
                    container.appendChild(input);
                    container.appendChild(label);
                } else {
                    let timeout;
                    (function (partyList, filter, input) {
                        input.addEventListener('input', () => {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => deal(partyList), 1000); // 增加延迟处理
                        });
                    })(partyList, filter, input);
                    container.appendChild(label);
                    container.appendChild(input);
                }

                mainContainer.appendChild(container);
            }

            return mainContainer;
        };

        // 生成筛选按钮
        let filterButtonsContainer = document.createElement('div');
        filterButtonsContainer.style.marginBottom = '10px';
        filterButtonsContainer.style.display = 'flex'; // 添加 flex 布局
        filterButtonsContainer.style.flexWrap = 'wrap'; // 添加换行
        filterButtonsContainer.style.gap = '10px'; // 添加间距
        filterButtonsContainer.style.padding = '10px';
        filterButtonsContainer.style.alignItems = 'center'; // 添加垂直居中对齐

        filterButtonsContainer.appendChild(createFilterButtons(defaultFilters, partyList));

        const createPartyItem = (party) => {
            const authorName = party.room_info.name;
            const mid = party.room_info.uid;
            const roomId = party.room_info.room_id;
            const liveUrl = `https://live.bilibili.com/${roomId}`;
            const spaceUrl = `https://space.bilibili.com/${mid}`;
            const lotteryUrl = party.reserveInfo.lottery_detail_url;
            const isLive = party.room_info.live_status === 1;

            const hasLottery = defaultFilters['有奖预约'].filter(party);

            const backgroundImage = party.party_poster;

            let partyItem = document.createElement('div');
            partyItem.style.position = "relative";
            partyItem.style.border = "1px solid #ddd";
            partyItem.style.borderRadius = "10px";
            partyItem.style.overflow = "hidden";
            partyItem.style.height = "300px";
            partyItem.style.display = "flex";
            partyItem.style.flexDirection = "column";
            partyItem.style.justifyContent = "flex-start"; // 修改为 flex-start 以使内容从顶部开始
            partyItem.style.padding = "10px";
            partyItem.style.color = "#fff";
            partyItem.style.transition = "transform 0.3s, background-color 0.3s"; // 添加过渡效果

            partyItem.onmouseover = () => {
                partyItem.style.transform = "scale(1.05)"; // 略微放大
                cardTitle.style.background = "rgba(0, 0, 0, 0.3)";
                publishTime.style.background = "rgba(0, 0, 0, 0.3)";
                typeComment.style.background = "rgba(0, 0, 0, 0.3)";
                describe.style.background = "rgba(0, 0, 0, 0.3)";
                viewDetailsButton.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
            };

            partyItem.onmouseout = () => {
                partyItem.style.transform = "scale(1)"; // 恢复原始大小
                cardTitle.style.background = "rgba(0, 0, 0, 0.5)";
                publishTime.style.background = "rgba(0, 0, 0, 0.5)";
                typeComment.style.background = "rgba(0, 0, 0, 0.5)";
                describe.style.background = "rgba(0, 0, 0, 0.5)";
                viewDetailsButton.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            };

            // 背景图片
            if (backgroundImage) {
                const img = document.createElement('img');
                img.src = backgroundImage;
                img.loading = "lazy";
                img.style.position = "absolute";
                img.style.top = "0";
                img.style.left = "0";
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.zIndex = "-1";
                partyItem.appendChild(img);
            }

            // 创建内容容器
            const contentContainer = document.createElement('div');
            contentContainer.className = "party-content-container";
            contentContainer.style.position = "relative";
            contentContainer.style.zIndex = "1"; // 确保内容在背景图之上
            contentContainer.style.width = "100%"; // 撑满 partyItem 的宽度
            contentContainer.style.height = "100%"; // 撑满 partyItem 的高度
            contentContainer.style.display = "flex";
            contentContainer.style.flexDirection = "column";

            // 标题
            const cardTitle = document.createElement("div");
            cardTitle.style.fontWeight = "bold";
            cardTitle.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.8)";
            cardTitle.style.background = "rgba(0, 0, 0, 0.5)";
            cardTitle.style.backdropFilter = "blur(5px)";
            cardTitle.style.borderRadius = "5px";
            cardTitle.style.padding = "5px";
            cardTitle.style.marginBottom = "5px";
            cardTitle.style.textAlign = "center";

            // 设置 cardTitle 的内容
            cardTitle.innerHTML = party.party_title;

            // 创建 authorName 的 a 标签
            const authorLink = document.createElement('a');
            authorLink.href = spaceUrl;
            authorLink.target = "_blank";
            authorLink.textContent = authorName;

            const typeComment = document.createElement("div");
            typeComment.style.fontSize = "12px";
            typeComment.style.marginTop = "2px";
            typeComment.style.background = "rgba(0, 0, 0, 0.5)";
            typeComment.style.backdropFilter = "blur(5px)";
            typeComment.style.borderRadius = "5px";
            typeComment.style.padding = "5px";
            typeComment.style.marginBottom = "5px";
            typeComment.style.textAlign = "center";
            typeComment.innerHTML = `${authorLink.outerHTML} 的 ${party.party_name}${hasLottery ? ' 🎁' : ''}${isLive ? ' 🎥' : ''}`;

            // 显示预约时间
            const publishTime = document.createElement("div");
            publishTime.style.fontSize = "12px";
            publishTime.style.marginTop = "2px";
            publishTime.style.background = "rgba(0, 0, 0, 0.5)";
            publishTime.style.backdropFilter = "blur(5px)";
            publishTime.style.borderRadius = "5px";
            publishTime.style.padding = "5px";
            publishTime.style.marginBottom = "5px";
            publishTime.style.textAlign = "center";
            publishTime.textContent = `预约时间: ${new Date(party.party_date * 1000).toLocaleString()}`;

            // 正文
            const describe = document.createElement("div");
            describe.style.fontSize = "14px";
            describe.style.marginTop = "2px";
            describe.style.background = "rgba(0, 0, 0, 0.5)";
            describe.style.backdropFilter = "blur(5px)";
            describe.style.borderRadius = "5px";
            describe.style.padding = "5px";
            describe.style.marginBottom = "5px";
            describe.style.textAlign = "center";
            describe.style.flexGrow = "1"; // 添加 flexGrow 以使描述占据剩余空间
            describe.style.overflowY = "auto";
            describe.style.textOverflow = "ellipsis";
            describe.textContent = party.party_text;

            const lotteryDetailsButton = document.createElement("a");
            lotteryDetailsButton.href = lotteryUrl;
            lotteryDetailsButton.target = "_blank";
            lotteryDetailsButton.textContent = "预约";
            lotteryDetailsButton.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            lotteryDetailsButton.style.color = "#fff";
            lotteryDetailsButton.style.padding = "5px 10px";
            lotteryDetailsButton.style.marginTop = "2px";
            lotteryDetailsButton.style.marginBottom = "5px";
            lotteryDetailsButton.style.borderRadius = "5px";
            lotteryDetailsButton.style.textDecoration = "none";
            lotteryDetailsButton.style.textAlign = "center";

            const viewDetailsButton = document.createElement("a");
            viewDetailsButton.href = liveUrl;
            viewDetailsButton.target = "_blank";
            viewDetailsButton.textContent = "直播间";
            viewDetailsButton.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            viewDetailsButton.style.color = "#fff";
            viewDetailsButton.style.padding = "5px 10px";
            viewDetailsButton.style.marginTop = "2px";
            viewDetailsButton.style.marginBottom = "5px";
            viewDetailsButton.style.borderRadius = "5px";
            viewDetailsButton.style.textDecoration = "none";
            viewDetailsButton.style.textAlign = "center";

            contentContainer.appendChild(cardTitle);
            contentContainer.appendChild(typeComment);
            contentContainer.appendChild(describe);
            contentContainer.appendChild(publishTime); // 添加发布时间
            if (hasLottery) {
                contentContainer.appendChild(lotteryDetailsButton);
            }
            contentContainer.appendChild(viewDetailsButton);

            // 将内容容器添加到 partyItem
            partyItem.appendChild(contentContainer);

            return partyItem;
        };

        // 分批渲染
        const batchSize = 50; // 每次渲染的庆会数量
        let renderedCount = 0;

        const renderBatch = () => {
            const renderList = partyList.filter(item => item.display);
            for (let i = 0; i < batchSize && renderedCount < renderList.length; i++, renderedCount++) {
                const partyItem = createPartyItem(renderList[renderedCount]);
                partyItem.style.display = renderList[renderedCount].display ? 'flex' : 'none'; // 根据 display 属性显示或隐藏
                const contentContainer = partyItem.querySelector(".party-content-container");
                contentContainer.style.display = isContentVisible ? "flex" : "none"; // 根据全局状态设置可见性
                gridContainer.appendChild(partyItem);
            }
            // 检查是否还需要继续渲染
            if (renderedCount < renderList.length) {
                observer.observe(gridContainer.lastElementChild); // 观察最后一个 partyItem
            } else {
                observer.disconnect(); // 如果所有庆会都已渲染，停止观察
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.unobserve(entries[0].target); // 取消对当前目标的观察
                renderBatch();
            }
        });

        renderBatch(); // 初始渲染一批

        dialog.appendChild(filterButtonsContainer);
        dialog.appendChild(gridContainer);
        dialog.style.display = 'block';
    }

    // 主任务函数
    async function collectparty() {
        partyList = [];
        collectedCount = 0;
        const collectedPartyIds = new Set(); // 新增：用于去重

        let { dialog, contentArea } = createDialog('progressDialog', '任务进度', `<p>已收集庆会数：<span id='collectedCount'>0</span>/<span id='totalCount'>0</span></p><p>已获取最后庆会时间：<span id='earliestTime'>N/A</span></p>`);
        dialog.style.display = 'block';

        // 添加样式优化
        dialog.querySelector('p').style.textAlign = 'center';
        dialog.querySelector('p').style.fontSize = '18px';
        dialog.querySelector('p').style.fontWeight = 'bold';
        dialog.querySelector('p').style.marginTop = '20px';

        let shouldContinue = true; // 引入标志位
        let page = 1;
        let errorCount = 0;
        const maxErrorCount = 5;
        while (shouldContinue) { // 使用标志位控制循环
            const api = `https://api.live.bilibili.com/xlive/general-interface/v2/party/square?page=${page++}&page_size=100`;

            try {
                const data = await apiRequest(api);
                const items = data?.data?.list;

                if (!items) {
                    errorCount++;
                    if (errorCount >= maxErrorCount) {
                        console.error(`获取数据失败，已重试 ${maxErrorCount} 次，停止任务。`);
                        break;
                    }
                    continue;
                }
                errorCount = 0;

                for (let item of items) {
                    // 新增：根据 party_id 去重
                    if (collectedPartyIds.has(item.party_id)) {
                        continue;
                    }
                    collectedPartyIds.add(item.party_id);

                    item.display = true;

                    // 获取预约信息
                    item.reserveInfo = (await apiRequest(`https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_id=${item.sid}&business_type=10`)).data;

                    partyList.push(item);
                    collectedCount++;
                    contentArea.querySelector('#collectedCount').textContent = partyList.length;
                    contentArea.querySelector('#totalCount').textContent = data.data.total;
                    contentArea.querySelector('#earliestTime').textContent = new Date(partyList[partyList.length - 1].party_date * 1000).toLocaleString();
                }

                if (shouldContinue) { // 检查标志位
                    if (partyList.length >= data.data.total || items.length === 0) shouldContinue = false; // 没有更多数据时结束循环
                }
            } catch (e) {
                console.error(`Error fetching data: ${e.message}`);
                continue; // 出错时继续
            }
        }
        console.log(`${partyList.length}/${collectedCount}`);
        console.log(partyList);

        dialog.style.display = 'none';
        showResultsDialog();
    }

    // 注册菜单项
    GM_registerMenuCommand("检查庆会广场", collectparty);
})();
