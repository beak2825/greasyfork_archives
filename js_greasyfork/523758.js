// ==UserScript==
// @name         Bilibili 收藏集奖励筛查脚本
// @namespace    Schwi
// @version      1.8
// @description  调用 API 来收集自己的 Bilibili 收藏集，并筛选未领取的奖励。注意，一套收藏集中至少存在一张卡牌才能本项目的接口被检测到!
// @author       Schwi
// @match        *://*.bilibili.com/*
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @noframes
// @supportURL   https://github.com/cyb233/script
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/523758/Bilibili%20%E6%94%B6%E8%97%8F%E9%9B%86%E5%A5%96%E5%8A%B1%E7%AD%9B%E6%9F%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523758/Bilibili%20%E6%94%B6%E8%97%8F%E9%9B%86%E5%A5%96%E5%8A%B1%E7%AD%9B%E6%9F%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let collectionCount = 0; // 收藏集数量
    let totalCardNum = 0; // 卡片总数

    const REDEEM_ITEM_TYPE = {
        Card: 1,
        Emoji: 2,
        Pendant: 3,
        Suit: 4,
        MaterialCombination: 5,
        AudioCard: 6,
        Jump: 7,
        Cdk: 8,
        RealGoods: 9,
        LimitMaterialCombination: 10,
        CustomReward: 11,
        DynamicEmoji: 15,
        DiamondAvatar: 1000,
        CollectorMedal: 1001,
    };

    /**
     * 别问我为啥这么写，B站前端JS就是这么判断的
     *
     * @param {object} reward 每条奖励的信息
     * @param {string} scene 不知道是啥，还没研究明白，先这么写着
     * @returns boolean 这个奖励是否能被领取
     */
    function canGetReward(reward, scene = "milestone") {
        const curTime = new Date().getTime();
        const has_redeemed_cnt = reward.has_redeemed_cnt;
        const redeem_item_type = reward.redeem_item_type;
        const total_stock = reward.total_stock;
        const remain_stock = reward.remain_stock;
        const redeem_cond_type = reward.redeem_cond_type;
        const owned_item_amount = reward.owned_item_amount;
        const require_item_amount = reward.require_item_amount;
        const unlock_condition = reward.unlock_condition;
        const redeem_count = reward.redeem_count;
        const end_time = reward.end_time;
        const unlock_condition_1 = unlock_condition || {};
        const unlocked = unlock_condition_1.unlocked;
        const lock_type = unlock_condition_1.lock_type;
        const unlock_threshold = unlock_condition_1.unlock_threshold;
        const expire_at = unlock_condition_1.expire_at;
        let exceedReceiveTime = false;
        if ([REDEEM_ITEM_TYPE.CollectorMedal, REDEEM_ITEM_TYPE.DiamondAvatar].includes(redeem_item_type)) {
            exceedReceiveTime = curTime > end_time;
        } else {
            if (!(curTime > end_time)) {
                exceedReceiveTime = true;
            }
            if (!reward.effective_forever) {
                exceedReceiveTime = true;
            }
        }
        if (unlocked || "milestone" === scene) {
            if (!(has_redeemed_cnt && [REDEEM_ITEM_TYPE.CustomReward].includes(redeem_item_type))) {
                if (!(has_redeemed_cnt && "card_number" !== redeem_cond_type)) {
                    if (!((+total_stock > -1 && +remain_stock <= 0) || exceedReceiveTime)) {
                        if (!("custom" === redeem_cond_type || [REDEEM_ITEM_TYPE.DiamondAvatar].includes(redeem_item_type))) {
                            if (!((owned_item_amount || 0) < require_item_amount)) {
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }

    const defaultFilters = {
        已集齐: { type: "checkbox", filter: (item, input) => item.owned >= item.total },
        未集齐: { type: "checkbox", filter: (item, input) => item.owned < item.total },
        未领奖励: {
            type: "checkbox", filter: (item, input) =>
                item.lottery.collect_list.collect_infos?.some(
                    (lottery) =>
                        canGetReward(lottery)
                )
                ||
                item.lottery.collect_list.collect_chain?.some(
                    (lottery) =>
                        canGetReward(lottery)
                )
        },
        搜索: {
            type: "text",
            filter: (item, input) => {
                const searchText = input.toLocaleUpperCase();
                const title = item.title.toLocaleUpperCase();
                const name = item.name.toLocaleUpperCase();
                const userinfos = item.act.related_user_infos;

                return title.includes(searchText) || name.includes(searchText) ||
                    (userinfos && Object.values(userinfos).some(userinfo => {
                        const userName = userinfo.nickname.toLocaleUpperCase();
                        const userId = userinfo.uid.toString().toLocaleUpperCase();
                        return userName.includes(searchText) || userId.includes(searchText);
                    }))
            }
        },
        排序: {
            type: "select",
            options: [
                { value: "按拥有卡片数量", text: "按拥有卡片数量", sort: (a, b) => b.num - a.num },
                { value: "按名称", text: "按名称", sort: (a, b) => a.title.localeCompare(b.title) },
                { value: "按卡池大小", text: "按卡池大小", sort: (a, b) => b.total - a.total },
                { value: "按集齐卡片数量", text: "按集齐卡片数量", sort: (a, b) => b.owned - a.owned },
                { value: "按销量", text: "按销量", sort: (a, b) => b.sale - a.sale }
            ],
            filter: (item, input) => true
        }
    };

    // 创建进度条容器
    function createProgressBar(totalTasks) {
        const progressContainer = document.createElement("div");
        progressContainer.style.position = "fixed";
        progressContainer.style.top = "50%";
        progressContainer.style.left = "50%";
        progressContainer.style.transform = "translate(-50%, -50%)";
        progressContainer.style.width = "80%";
        progressContainer.style.padding = "10px";
        progressContainer.style.backgroundColor = "#fff";
        progressContainer.style.borderRadius = "10px";
        progressContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        progressContainer.style.zIndex = "10000";
        progressContainer.style.textAlign = "center";

        const progressTitle = document.createElement("h3");
        progressTitle.textContent = "任务进行中...";
        progressContainer.appendChild(progressTitle);

        const progressBar = document.createElement("progress");
        progressBar.style.width = "100%";
        progressBar.max = totalTasks;
        progressBar.value = 0;
        progressContainer.appendChild(progressBar);

        const progressText = document.createElement("p");
        progressText.style.marginTop = "10px";
        progressText.textContent = `0/${totalTasks} 完成`;
        progressContainer.appendChild(progressText);

        document.body.appendChild(progressContainer);

        return {
            update: function (currentTask) {
                progressBar.value = currentTask;
                progressText.textContent = `${currentTask}/${totalTasks} 完成`;
            },
            hide: function () {
                document.body.removeChild(progressContainer);
            }
        };
    }

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
        dialog.style.overflow = 'hidden';

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
        closeButton.style.backgroundColor = '#ff4d4f';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px 10px';
        closeButton.style.transition = 'background-color 0.3s';
        closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#d93637'; };
        closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#ff4d4f'; };
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

    // 发起 API 请求的函数
    function apiRequest(url, callback, retryCount = 0) {
        // 为url添加时间戳参数防范风控
        const ts = Date.now();
        let urlObj = new URL(url, location.origin);
        urlObj.searchParams.set('_ts', ts);
        const finalUrl = urlObj.toString();

        console.debug(`正在请求: ${finalUrl}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: finalUrl,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.debug(`来自 ${finalUrl} 的响应:`, data);
                    callback(data);
                } catch (error) {
                    console.error(`解析来自 ${finalUrl} 的响应时出错:`, error);
                    callback(null);
                }
            },
            onerror: function (error) {
                console.error(`请求 ${finalUrl} 失败:`, error);
                // 失败重试，最多3次，每次等待1秒
                if (retryCount < 3) {
                    setTimeout(() => {
                        apiRequest(url, callback, retryCount + 1);
                    }, 1000);
                } else {
                    callback(null);
                }
            },
        });
    }

    // 显示筛选结果的对话框
    function showResultsDialog(collectList) {
        const { dialog, titleElement } = createDialog('resultsDialog', `收藏集（${collectList.length}/${collectList.length}/${collectionCount}）总卡片张数 ${totalCardNum}`, '');

        let gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill,minmax(200px,1fr))';
        gridContainer.style.gap = '10px';
        gridContainer.style.padding = '10px';
        gridContainer.style.height = 'calc(90% - 50px)';
        gridContainer.style.overflowY = 'auto';
        gridContainer.style.alignContent = 'flex-start';

        const deal = (collectList) => {
            let checkedFilters = [];
            let sortOption = defaultFilters["排序"].options[0]; // 默认排序
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
                    case 'select':
                        checkedFilter = { ...f, value: filter.value };
                        // 记录当前排序选项
                        sortOption = f.options.find(opt => opt.value === filter.value) || f.options[0];
                        break;
                }
                checkedFilters.push(checkedFilter);
            }
            collectList.forEach(item => {
                item.display = checkedFilters.every(f => f.type === "select" ? true : (f.value ? f.filter(item, f.value) : true));
            });

            // 排序
            collectList.sort(sortOption.sort);

            const filteredList = collectList.filter(item => item.display);
            const filteredTotalCards = filteredList.reduce((sum, item) => sum + item.num, 0); // 计算筛选后的总卡片张数
            titleElement.textContent = `收藏集（${filteredList.length}/${collectList.length}/${collectionCount}）总卡片张数 ${totalCardNum}`;

            observer.disconnect();
            renderedCount = 0;
            gridContainer.innerHTML = '';
            renderBatch();
        };

        // 封装生成筛选按钮的函数
        const createFilterButtons = (filters, list) => {
            let mainContainer = document.createElement('div');
            mainContainer.style.display = 'flex';
            mainContainer.style.flexWrap = 'wrap';
            mainContainer.style.width = '100%';

            for (let key in filters) {
                let filter = filters[key];
                let input;
                if (filter.type === 'select') {
                    input = document.createElement('select');
                    input.id = key;
                    input.style.marginRight = '5px';
                    filter.options.forEach(opt => {
                        let option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        input.appendChild(option);
                    });
                } else {
                    input = document.createElement('input');
                    input.type = filter.type;
                    input.id = key;
                    input.style.marginRight = '5px';
                    if (filter.type === 'text') {
                        input.style.border = '1px solid #ccc';
                        input.style.padding = '5px';
                        input.style.borderRadius = '5px';
                    }
                }

                let label = document.createElement('label');
                label.htmlFor = key;
                label.textContent = key;
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.marginRight = '5px';

                let container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.marginRight = '10px';

                if (filter.type === 'checkbox' || filter.type === 'radio') {
                    (function (list, filter, input) {
                        input.addEventListener('change', () => deal(list));
                    })(list, filter, input);
                    container.appendChild(input);
                    container.appendChild(label);
                } else if (filter.type === 'select') {
                    (function (list, filter, input) {
                        input.addEventListener('change', () => deal(list));
                    })(list, filter, input);
                    container.appendChild(label);
                    container.appendChild(input);
                } else {
                    let timeout;
                    (function (list, filter, input) {
                        input.addEventListener('input', () => {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => deal(list), 1000);
                        });
                    })(list, filter, input);
                    container.appendChild(label);
                    container.appendChild(input);
                }

                mainContainer.appendChild(container);
            }

            return mainContainer;
        };

        const filterButtonsContainer = document.createElement('div');
        filterButtonsContainer.style.marginBottom = '10px';
        filterButtonsContainer.style.display = 'flex';
        filterButtonsContainer.style.flexWrap = 'wrap';
        filterButtonsContainer.style.gap = '10px';
        filterButtonsContainer.style.padding = '10px';
        filterButtonsContainer.style.alignItems = 'center';

        filterButtonsContainer.appendChild(createFilterButtons(defaultFilters, collectList));

        const createCardItem = (item) => {
            let card = document.createElement('div');
            card.style.position = "relative";
            card.style.border = "1px solid #ddd";
            card.style.borderRadius = "10px";
            card.style.overflow = "hidden";
            card.style.height = "200px";
            card.style.backgroundImage = `url(${item.act.act_square_img})`;
            card.style.backgroundSize = "cover";
            card.style.backgroundPosition = "center";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.justifyContent = "flex-end";
            card.style.padding = "10px";
            card.style.color = "#fff";

            const numBadge = document.createElement("div");
            numBadge.textContent = item.num;
            numBadge.style.position = "absolute";
            numBadge.style.top = "10px";
            numBadge.style.right = "10px";
            numBadge.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            numBadge.style.color = "#fff";
            numBadge.style.padding = "5px 10px";
            numBadge.style.borderRadius = "10px";
            numBadge.style.fontSize = "14px";
            numBadge.style.fontWeight = "bold";
            card.appendChild(numBadge);

            const ownedTotalBadge = document.createElement("div");
            ownedTotalBadge.textContent = `${item.owned} / ${item.total}${item.owned === item.total ? ' 👑' : ''}`;
            ownedTotalBadge.style.position = "absolute";
            ownedTotalBadge.style.top = "10px";
            ownedTotalBadge.style.left = "10px";
            ownedTotalBadge.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            ownedTotalBadge.style.color = "#fff";
            ownedTotalBadge.style.padding = "5px 10px";
            ownedTotalBadge.style.borderRadius = "10px";
            ownedTotalBadge.style.fontSize = "14px";
            ownedTotalBadge.style.fontWeight = "bold";
            card.appendChild(ownedTotalBadge);

            const titleContainer = document.createElement("div");
            titleContainer.style.background = "rgba(0, 0, 0, 0.5)";
            titleContainer.style.backdropFilter = "blur(5px)";
            titleContainer.style.borderRadius = "5px";
            titleContainer.style.padding = "5px";
            titleContainer.style.marginBottom = "5px";

            const cardTitle = document.createElement("div");
            cardTitle.style.fontWeight = "bold";
            cardTitle.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.8)";
            cardTitle.textContent = item.title;

            const subtitleContainer = document.createElement("div");
            subtitleContainer.style.display = "flex";
            subtitleContainer.style.justifyContent = "space-between";
            subtitleContainer.style.fontSize = "14px";
            subtitleContainer.style.marginTop = "2px";

            const cardSubtitle = document.createElement("span");
            cardSubtitle.textContent = item.name;

            const cardSale = document.createElement("span");
            cardSale.textContent = `销量: ${item.sale}`;

            subtitleContainer.appendChild(cardSubtitle);
            subtitleContainer.appendChild(cardSale);

            titleContainer.appendChild(cardTitle);
            titleContainer.appendChild(subtitleContainer);

            const link = document.createElement("a");
            link.href = item.url;
            link.target = "_blank";
            link.textContent = "查看详情";
            link.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            link.style.color = "#fff";
            link.style.padding = "5px 10px";
            link.style.borderRadius = "5px";
            link.style.textDecoration = "none";
            link.style.textAlign = "center";

            card.appendChild(titleContainer);
            card.appendChild(link);

            return card;
        };

        const batchSize = 50;
        let renderedCount = 0;

        const renderBatch = () => {
            const renderList = collectList.filter(item => item.display);
            for (let i = 0; i < batchSize && renderedCount < renderList.length; i++, renderedCount++) {
                const cardItem = createCardItem(renderList[renderedCount]);
                cardItem.style.display = renderList[renderedCount].display ? 'flex' : 'none';
                gridContainer.appendChild(cardItem);
            }
            if (renderedCount < renderList.length) {
                observer.observe(gridContainer.lastElementChild);
            } else {
                observer.disconnect();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.unobserve(entries[0].target);
                renderBatch();
            }
        });

        collectList.forEach(item => {
            item.display = true;
        });

        renderBatch();

        dialog.appendChild(filterButtonsContainer);
        dialog.appendChild(gridContainer);
        dialog.style.display = 'block';
    }

    // 修改主函数调用筛选结果对话框
    function collectDigitalCards() {
        console.log("开始收集收藏集...");
        const collectionUrl =
            "https://api.bilibili.com/x/vas/smelt/my_decompose/info?scene=1";
        let collectList = [];

        apiRequest(collectionUrl, function (collectionData) {
            if (!collectionData || collectionData.code !== 0) {
                const errorMsg = `获取收藏列表失败: ${collectionData ? collectionData.message : "无响应"}`
                console.error(errorMsg);
                alert(errorMsg)
                return;
            }
            if (!collectionData.data.list) {
                const errorMsg = `获取收藏列表失败: 您没有收藏集`
                console.error(errorMsg);
                alert(errorMsg)
                return;
            }

            totalCardNum = collectionData.data.list.reduce((acc, item) => acc + item.card_num, 0);

            console.log("成功获取收藏列表:", collectionData.data.list);
            console.log("卡片总数:", collectionData.data.list.reduce((acc, item) => acc + item.card_num, 0));
            const collections = collectionData.data.list;
            collectionCount = collections.length;
            let processedCollections = 0;

            const progressBar = createProgressBar(collectionCount);

            collections.forEach((collection, index) => {
                console.debug(`处理收藏: ${collection.act_name}(ID: ${collection.act_id})`);
                const detailUrl = `https://api.bilibili.com/x/vas/dlc_act/act/basic?act_id=${collection.act_id}`;

                apiRequest(detailUrl, function (detailData) {
                    if (!detailData || detailData.code !== 0) {
                        console.error(
                            `获取 ${collection.act_name}(act_id:${collection.act_id}) 的基本信息失败:`,
                            detailData ? detailData.message : "无响应"
                        );
                        processedCollections++;
                        progressBar.update(processedCollections);
                        checkCompletion();
                        return;
                    }

                    console.debug(
                        `成功获取 ${collection.act_name}(act_id:${collection.act_id}) 的基本信息:`,
                        detailData.data
                    );
                    const lotteries = detailData.data.lottery_list;
                    let processedLotteries = 0;

                    lotteries.forEach((lottery) => {
                        console.debug(
                            `处理详情: ${lottery.lottery_name} (ID: ${lottery.lottery_id})`
                        );
                        const item_owned_cnt = lottery.item_owned_cnt;
                        const item_total_cnt = lottery.item_total_cnt;
                        const total_sale_amount = lottery.total_sale_amount;

                        const cardDetailUrl = `https://api.bilibili.com/x/vas/dlc_act/lottery_home_detail?act_id=${collection.act_id}&lottery_id=${lottery.lottery_id}`;

                        apiRequest(cardDetailUrl, function (cardData) {
                            if (!cardData || cardData.code !== 0) {
                                console.error(
                                    `获取 ${collection.act_name}(act_id:${collection.act_id}&lottery_id:${lottery.lottery_id}) 的详情失败:`,
                                    cardData ? cardData.message : "无响应"
                                );
                                processedLotteries++;
                                progressBar.update(processedCollections);
                                checkLotteryCompletion();
                                return;
                            }

                            console.debug(
                                `成功获取 ${collection.act_name}[${cardData.data.name}](act_id:${collection.act_id}&lottery_id:${lottery.lottery_id}) 的详情:`,
                                cardData.data
                            );
                            collectList.push({
                                title: detailData.data.act_title,
                                name: cardData.data.name,
                                num: collection.card_num,
                                owned: item_owned_cnt,
                                total: item_total_cnt,
                                sale: total_sale_amount,
                                url: `https://www.bilibili.com/blackboard/activity-Mz9T5bO5Q3.html?id=${collection.act_id}&type=dlc`,
                                act: detailData.data,
                                lottery: cardData.data
                            });
                            processedLotteries++;
                            progressBar.update(processedCollections);
                            checkLotteryCompletion();
                        });

                        function checkLotteryCompletion() {
                            if (processedLotteries === lotteries.length) {
                                processedCollections++;
                                progressBar.update(processedCollections);
                                checkCompletion();
                            }
                        }
                    });
                });

            });

            function checkCompletion() {
                if (processedCollections === collectionCount) {
                    console.log("所有收藏已处理。");
                    console.log("最终收集列表:", collectList);

                    collectList = collectList.filter((collectItem) => collectItem.owned);

                    progressBar.hide();
                    showResultsDialog(collectList);
                }
            }
        });
    }

    GM_registerMenuCommand("检查收藏集", collectDigitalCards);
})();
