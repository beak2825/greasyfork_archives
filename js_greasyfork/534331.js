// ==UserScript==
// @name         Bilibili 盲盒统计
// @namespace    Schwi
// @version      1.7.1
// @description  调用 API 来收集自己的 Bilibili 盲盒概率，公示概率和你的概率一致吗？（受API限制，获取的记录大约只有最近2个自然月，本脚本会本地持久化储存记录）
// @author       Schwi
// @match        *://*.bilibili.com/*
// @match        https://gift.shuvi.moe/box
// @match        https://gift.shuvi.moe/box.html
// @connect      api.live.bilibili.com
// @connect      api.bilibili.com
// @connect      shuvi.moe
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @noframes
// @supportURL   https://github.com/cyb233/script
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/534331/Bilibili%20%E7%9B%B2%E7%9B%92%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/534331/Bilibili%20%E7%9B%B2%E7%9B%92%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const api = {
    getBlindBox: (nextId = 0, month = '', pageSize = 100) => `https://api.live.bilibili.com/xlive/fuxi-interface/gift/blindGiftStream?nextId=${nextId}&month=${month}&pageSize=${pageSize}`,
    getBlindBoxByIds: (ids = [], nextId = 0, month = '', size = 100) => `https://api.live.bilibili.com/xlive/fuxi-interface/BlindBoxController/getRecordsByIds?_ts_rpc_args_=[${ids},${nextId},"${month}",${size}]`
  }

  const boxOrder = ['星月盲盒', '心动盲盒', '奇遇盲盒', '闪耀盲盒', '至尊盲盒']

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

  // 获取用户UID
  const getUserData = (() => {
    let userData = null;
    return async () => {
      if (!userData) {
        userData = (await apiRequest('https://api.bilibili.com/x/space/v2/myinfo')).data;
      }
      return userData;
    };
  })();

  // 盲盒信息，percentage为官方公示概率（不包含活动倍率）
  const getGiftInfo = (() => {
    let giftInfo = null;
    return async function () {
      if (giftInfo) {
        return giftInfo;
      }

      try {
        giftInfo = await apiRequest('https://gift.shuvi.moe/box.json');
        console.log('获取盲盒信息成功:', giftInfo);
        return giftInfo;
      } catch (error) {
        console.error('获取盲盒信息失败:', error);
        // 如果获取失败，使用本地存储的最基本的盲盒信息
        return {
          "box": [
            {
              "id": 32251,
              "name": "心动盲盒",
              "price": 150,
              "level": ["初始倍"],
              "gifts": [
                {
                  "id": 32125,
                  "name": "电影票",
                  "price": 20,
                  "percentage": [6],
                  "subGifts": []
                },
                {
                  "id": 32126,
                  "name": "棉花糖",
                  "price": 90,
                  "percentage": [42.56],
                  "subGifts": []
                },
                {
                  "id": 32128,
                  "name": "爱心抱枕",
                  "price": 160,
                  "percentage": [47.5],
                  "subGifts": []
                },
                {
                  "id": 32281,
                  "name": "绮彩权杖",
                  "price": 400,
                  "percentage": [3.7],
                  "subGifts": []
                },
                {
                  "id": 34082,
                  "name": "时空之站",
                  "price": 1000,
                  "percentage": [0.12],
                  "subGifts": []
                },
                {
                  "id": 34894,
                  "name": "蛇形护符",
                  "price": 2000,
                  "percentage": [0.08],
                  "subGifts": []
                },
                {
                  "id": 32132,
                  "name": "浪漫城堡",
                  "price": 22330,
                  "percentage": [0.04],
                  "subGifts": []
                }
              ]
            },
            {
              "id": 35206,
              "name": "幸运盲盒",
              "price": 50,
              "level": ["初始倍"],
              "gifts": [
                {
                  "id": 35207,
                  "name": "幸运泡泡",
                  "price": 15,
                  "percentage": [14.8],
                  "subGifts": []
                },
                {
                  "id": 34704,
                  "name": "幸运草",
                  "price": 25,
                  "percentage": [25],
                  "subGifts": []
                },
                {
                  "id": 35208,
                  "name": "星光铃铛",
                  "price": 52,
                  "percentage": [52.1],
                  "subGifts": []
                },
                {
                  "id": 35209,
                  "name": "梦雾纸签",
                  "price": 100,
                  "percentage": [5],
                  "subGifts": []
                },
                {
                  "id": 35210,
                  "name": "福灵小兽",
                  "price": 200,
                  "percentage": [2.7],
                  "subGifts": []
                },
                {
                  "id": 35211,
                  "name": "星愿花园",
                  "price": 600,
                  "percentage": [0.4],
                  "subGifts": []
                }
              ]
            },
            {
              "id": 35212,
              "name": "幸运盲盒S",
              "price": 500,
              "level": ["初始倍"],
              "gifts": [
                {
                  "id": 35213,
                  "name": "初兆光符",
                  "price": 160,
                  "percentage": [10],
                  "subGifts": []
                },
                {
                  "id": 33593,
                  "name": "幸运之露",
                  "price": 300,
                  "percentage": [33.8],
                  "subGifts": []
                },
                {
                  "id": 35214,
                  "name": "福引转轮",
                  "price": 520,
                  "percentage": [52.55],
                  "subGifts": []
                },
                {
                  "id": 35215,
                  "name": "光羽预言",
                  "price": 1000,
                  "percentage": [3],
                  "subGifts": []
                },
                {
                  "id": 35216,
                  "name": "幽镜之门",
                  "price": 5000,
                  "percentage": [0.55],
                  "subGifts": []
                },
                {
                  "id": 35217,
                  "name": "命契幻境",
                  "price": 30000,
                  "percentage": [0.1],
                  "subGifts": []
                }
              ]
            }]
        }
      }
    };
  })();

  // 去重合并记录并存储
  function saveGiftList(uid, newGifts) {
    // 兼容性迁移：如果存在 allGiftList，则迁移到当前 uid 下，并删除 allGiftList
    const oldKey = 'allGiftList';
    let storedGifts = GM_getValue(uid, []);
    if (GM_getValue(oldKey)) {
      const oldGifts = GM_getValue(oldKey, []);
      storedGifts = [...oldGifts, ...storedGifts];
      GM_setValue(uid, storedGifts);
      GM_deleteValue(oldKey);
    }
    const mergedGifts = [...storedGifts, ...newGifts].reduce((acc, gift) => {
      if (!acc.some(existingGift => existingGift.id === gift.id)) {
        acc.push(gift);
      }
      return acc;
    }, []).sort((a, b) => b.id - a.id);
    GM_setValue(uid, mergedGifts);
    return mergedGifts;
  }

  function getAllGiftList() {
    return GM_listValues().map(key => { return { key, gifts: GM_getValue(key, []) } });
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
    closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#d93637'; }
    closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#ff4d4f'; }
    closeButton.onclick = () => dialog.remove();
    header.appendChild(closeButton);

    dialog.appendChild(header);

    let contentArea = document.createElement('div');
    contentArea.innerHTML = content;
    contentArea.style.padding = '10px';
    contentArea.style.overflowY = 'auto'; // 允许垂直滚动
    contentArea.style.height = 'calc(100% - 40px)'; // 减去 header 的高度
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

  // 盲盒数据分组统计函数
  function groupGiftStats(giftList, giftInfo) {
    // 统计结构
    const groupedGiftStats = {};
    giftList.forEach(gift => {
      const { originalGiftId, originalGiftName, giftId, giftName, giftNum } = gift;
      // 查找主礼物ID（如果giftId是subGift，则归属于主礼物）
      const box = giftInfo.box.find(box => box.id === parseInt(originalGiftId));
      let mainGift = null;
      let mainGiftId = giftId;
      if (box) {
        mainGift = box.gifts.find(g => g.id === giftId);
        if (!mainGift) {
          // 查找subGift
          for (const g of box.gifts) {
            if (g.subGifts && g.subGifts.some(sub => sub.id === giftId)) {
              mainGift = g;
              mainGiftId = g.id;
              break;
            }
          }
        }
      }
      if (!groupedGiftStats[originalGiftId]) {
        groupedGiftStats[originalGiftId] = {
          originalGiftName,
          totalCount: 0,
          gifts: {}
        };
      }
      if (!groupedGiftStats[originalGiftId].gifts[mainGiftId]) {
        groupedGiftStats[originalGiftId].gifts[mainGiftId] = {
          giftName: mainGift?.name || giftName,
          count: 0,
          percentage: 0
        };
      }
      groupedGiftStats[originalGiftId].totalCount += giftNum;
      groupedGiftStats[originalGiftId].gifts[mainGiftId].count += giftNum;
    });
    // 计算每个 giftId 的百分比概率
    Object.values(groupedGiftStats).forEach(group => {
      Object.values(group.gifts).forEach(gift => {
        gift.percentage = group.totalCount > 0 ? ((gift.count / group.totalCount) * 100).toFixed(2) + '%' : '0%';
      });
    });
    return groupedGiftStats;
  }

  // 礼物筛选条件
  const defaultFilters = {
    // 你可以根据需要扩展更多筛选条件
    // '全部': { type: 'checkbox', filter: () => true },
    '正收益礼物': {
      type: 'checkbox', filter: (item, input, giftInfo) => {
        // 以价格大于等于100为例
        const box = giftInfo.box.find(box => box.id === item.originalGiftId);
        const gift = box?.gifts.find(g => g.id === item.giftId);
        return gift ? gift.price >= box.price : false;
      }
    },
    '负收益礼物': {
      type: 'checkbox', filter: (item, input, giftInfo) => {
        const box = giftInfo.box.find(box => box.id === item.originalGiftId);
        const gift = box?.gifts.find(g => g.id === item.giftId);
        return gift ? gift.price < box.price : false;
      }
    },
    '搜索': {
      type: 'text',
      attribute: { placeholder: '输入主播的完整uid或昵称', list: 'box-search-list', autocomplete: 'off' },
      filter: (item, input, giftInfo) => {
        if (!input) return true;
        const searchText = input.trim().toUpperCase().split(' ');
        return (
          (item.ruid && searchText.some(text => item.ruid.toUpperCase() === text)) ||
          (item.rname && searchText.some(text => item.rname.toUpperCase() === text))
        );
      }
    }
  };

  // 循环请求盲盒数据
  async function fetchAllBlindBoxes() {
    let nextId = 0;
    let month = '';
    let isMore = 1;

    const allGiftList = [];

    // 创建进度弹窗
    let { dialog: progressDialog, contentArea: progressContentArea } = createDialog('progressDialog', '盲盒数据收集进度', `<p>已收集盲盒数：<span id='collectedCount'>0</span></p>`);
    progressDialog.style.display = 'block';

    while (isMore) {
      try {
        const response = await apiRequest(api.getBlindBox(nextId, month));
        if (response.code === 0 && response.data) {
          const { list, params } = response.data;
          list.forEach(gift => {
            gift.id = parseInt(gift.id, 10);
            gift.originalGiftId = parseInt(gift.originalGiftId, 10);
            gift.giftId = parseInt(gift.giftId, 10);
            gift.giftNum = parseInt(gift.giftNum, 10);
            delete gift.giftImg;
          })
          allGiftList.push(...list);
          console.log('当前盲盒数据:', list, params);
          nextId = params.nextId;
          month = params.month;
          isMore = params.isMore;

          // 更新进度弹窗
          progressContentArea.querySelector('#collectedCount').textContent = allGiftList.length;

        } else {
          console.error('API 返回错误:', response.message);
          break;
        }
      } catch (error) {
        console.error('请求失败:', error);
        break;
      }
    }

    // 关闭进度弹窗
    progressDialog.remove();

    // 去重并存储
    const mergedGiftList = saveGiftList((await getUserData()).profile.mid, allGiftList);
    console.log('合并后的盲盒数据:', mergedGiftList);

    // 相关主播列表去重输出
    const anchorSet = new Map();
    mergedGiftList.forEach(gift => {
      if (gift.ruid && gift.rname) {
        anchorSet.set(gift.ruid, gift.rname);
      }
    });
    console.log('相关主播列表', Array.from(anchorSet, ([uid, name]) => ({ uid, name })));

    document.getElementById('box-search-list')?.remove();
    const datalist = document.createElement('datalist');
    datalist.id = 'box-search-list';
    for (const [uid, name] of anchorSet.entries()) {
      const option = document.createElement('option');
      option.value = name + ' ' + uid;
      datalist.appendChild(option);
    }
    document.body.appendChild(datalist);

    const giftInfo = await getGiftInfo();

    // 分组统计
    const groupedGiftStats = groupGiftStats(mergedGiftList, giftInfo);

    console.log('按 originalGiftId 分组的盲盒统计:', groupedGiftStats);

    // 显示结果弹窗
    showResultsDialog(mergedGiftList, giftInfo);
  }

  // 显示结果 dialog，支持筛选
  async function showResultsDialog(allGiftList, giftInfo) {
    const { dialog, titleElement, closeButton, contentArea } = createDialog('resultsDialog', '盲盒统计结果', '');

    // 筛选按钮区域
    let filterButtonsContainer = document.createElement('div');
    filterButtonsContainer.style.marginBottom = '10px';
    filterButtonsContainer.style.display = 'flex';
    filterButtonsContainer.style.flexWrap = 'wrap';
    filterButtonsContainer.style.gap = '10px';
    filterButtonsContainer.style.padding = '10px';
    filterButtonsContainer.style.alignItems = 'center';

    // 生成筛选按钮
    function createFilterButtons(filters, giftList, giftInfo) {
      let mainContainer = document.createElement('div');
      mainContainer.style.display = 'flex';
      mainContainer.style.flexWrap = 'wrap';
      mainContainer.style.width = '100%';
      for (let key in filters) {
        let filter = filters[key];
        let input = document.createElement('input');
        input.type = filter.type;
        input.id = key;
        input.style.marginRight = '5px';
        if (filter.type === 'text') {
          input.style.border = '1px solid #ccc';
          input.style.padding = '5px';
          input.style.borderRadius = '5px';
        }
        for (let attr in filter.attribute) {
          input.setAttribute(attr, filter.attribute[attr]);
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
        if (['checkbox', 'radio'].includes(filter.type)) {
          input.addEventListener('change', () => deal());
          container.appendChild(input);
          container.appendChild(label);
        } else {
          let timeout;
          input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => deal(), 500);
          });
          container.appendChild(label);
          container.appendChild(input);
        }
        mainContainer.appendChild(container);
      }
      return mainContainer;
    }

    filterButtonsContainer.appendChild(createFilterButtons(defaultFilters, allGiftList, giftInfo));
    contentArea.appendChild(filterButtonsContainer);

    // 结果区域
    let resultArea = document.createElement('div');
    contentArea.appendChild(resultArea);

    // 筛选和重算逻辑
    function deal() {
      // 获取所有筛选条件
      let checkedFilters = [];
      for (let key in defaultFilters) {
        const f = defaultFilters[key];
        const input = filterButtonsContainer.querySelector(`#${key}`);
        let checkedFilter;
        switch (f.type) {
          case 'checkbox':
            checkedFilter = { ...f, value: input.checked };
            break;
          case 'text':
            checkedFilter = { ...f, value: input.value };
            break;
        }
        checkedFilters.push({ ...checkedFilter, key });
      }
      // 过滤礼物
      let filteredGiftList = allGiftList.filter(item =>
        checkedFilters.every(f => {
          if (f.key === '全部') return true;
          if (f.type === 'checkbox' && !f.value) return true;
          if (f.type === 'checkbox' && f.value) return f.filter(item, f.value, giftInfo);
          if (f.type === 'text') return f.filter(item, f.value, giftInfo);
          return true;
        })
      );
      // 统计
      const groupedGiftStats = groupGiftStats(filteredGiftList, giftInfo);
      renderResult(groupedGiftStats, giftInfo);
    }

    // 渲染统计结果
    function renderResult(groupedGiftStats, giftInfo) {
      resultArea.innerHTML = '';
      // 获取排序后的 originalGiftId 数组
      const sortedOriginalGiftIds = Object.entries(groupedGiftStats)
        .sort(([originalGiftIdA, groupA], [originalGiftIdB, groupB]) => {
          const nameA = groupA.originalGiftName;
          const nameB = groupB.originalGiftName;
          const indexA = boxOrder.indexOf(nameA);
          const indexB = boxOrder.indexOf(nameB);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
        .map(([originalGiftId]) => originalGiftId);

      sortedOriginalGiftIds.forEach(originalGiftId => {
        const group = groupedGiftStats[originalGiftId];
        let title = document.createElement('h2');
        let titleLink = document.createElement('a');
        titleLink.href = `https://gift.shuvi.moe/#${originalGiftId}`;
        titleLink.textContent = `${group.originalGiftName} (总抽数: ${group.totalCount})`;
        titleLink.target = '_blank';
        title.appendChild(titleLink);
        title.style.marginTop = '20px';
        resultArea.appendChild(title);

        let table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '10px 0';

        let thead = table.createTHead();
        let headerRow = thead.insertRow();
        let headers = ['礼物名称', '数量', '你的概率', null];
        headers.forEach((headerText, idx) => {
          let th = document.createElement('th');
          if (idx === 3) {
            let link = document.createElement('a');
            link.href = `https://gift.shuvi.moe/box#${originalGiftId}`;
            link.textContent = '公示概率 (取基础概率，点击查看完整概率)';
            link.target = '_blank';
            th.appendChild(link);
          } else {
            th.textContent = headerText;
          }
          th.style.padding = '8px';
          th.style.border = '1px solid #ddd';
          th.style.textAlign = 'left';
          headerRow.appendChild(th);
        });

        let tbody = table.createTBody();
        const boxInfo = giftInfo.box.find(box => box.id === parseInt(originalGiftId));
        const sortedGifts = Object.entries(group.gifts).sort(([giftIdA, giftA], [giftIdB, giftB]) => {
          const giftInfoA = boxInfo?.gifts.find(g => g.id === parseInt(giftIdA));
          const giftInfoB = boxInfo?.gifts.find(g => g.id === parseInt(giftIdB));
          if (!giftInfoA && !giftInfoB) return 0;
          if (!giftInfoA) return 1;
          if (!giftInfoB) return -1;
          const indexA = boxInfo?.gifts.indexOf(giftInfoA);
          const indexB = boxInfo?.gifts.indexOf(giftInfoB);
          return indexA - indexB;
        });

        sortedGifts.forEach(([giftId, gift]) => {
          let row = tbody.insertRow();
          let cell1 = row.insertCell();
          let cell2 = row.insertCell();
          let cell3 = row.insertCell();
          let cell4 = row.insertCell();

          let giftLink = document.createElement('a');
          giftLink.href = `https://gift.shuvi.moe/#${giftId}`;
          giftLink.textContent = gift.giftName;
          giftLink.target = '_blank';
          cell1.appendChild(giftLink);

          cell2.textContent = gift.count;
          cell3.textContent = gift.percentage;

          const officialPercentageArr = boxInfo?.gifts.find(g => g.id === parseInt(giftId))?.percentage;
          cell4.textContent = officialPercentageArr ? officialPercentageArr[0] + '%' : 'N/A';

          [cell1, cell2, cell3, cell4].forEach(cell => {
            cell.style.padding = '8px';
            cell.style.border = '1px solid #ddd';
            cell.style.textAlign = 'left';
          });
        });

        resultArea.appendChild(table);
      });
    }

    deal();

    dialog.style.display = 'block';
  }

  // 注册菜单项
  if (document.location.host === 'gift.shuvi.moe') {
    unsafeWindow.giftList = getAllGiftList();
  } else {
    GM_registerMenuCommand("检查盲盒数据", fetchAllBlindBoxes);
  }

})();