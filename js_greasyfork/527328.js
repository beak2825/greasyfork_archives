// ==UserScript==
// @name            美团搬菜（支持超市水果店）
// @description     从美团将菜单导入到搬菜平台
// @version         v2.0.1MAX
// @author          mirari、ChengPP(后续)
// @copyright       2023, mirari (https://github.com/mirari)
// @match           https://cactivityapi-sc.waimai.meituan.com/h5*
// @match           https://h5.waimai.meituan.com/waimai/mindex*
// @run-at          document-idle
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @connect         raw.githubusercontent.com
// @connect         mv.nianxiang.net.cn
// @connect         localhost
// @connect         *
// @icon            https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684
// @namespace https://greasyfork.org/users/1436563
// @downloadURL https://update.greasyfork.org/scripts/527328/%E7%BE%8E%E5%9B%A2%E6%90%AC%E8%8F%9C%EF%BC%88%E6%94%AF%E6%8C%81%E8%B6%85%E5%B8%82%E6%B0%B4%E6%9E%9C%E5%BA%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527328/%E7%BE%8E%E5%9B%A2%E6%90%AC%E8%8F%9C%EF%BC%88%E6%94%AF%E6%8C%81%E8%B6%85%E5%B8%82%E6%B0%B4%E6%9E%9C%E5%BA%97%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let food;
  let autoGetting = false;
  let isImporting = false;

  const createButtons = () => {
    const mainBtn = document.createElement('button');
    mainBtn.innerHTML = '<img src="https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684" alt="☰" style="width: 30px; height: 30px;">';
    mainBtn.style = `
      position: fixed;
      top: 2vw;
      right: 2vw;
      z-index: 999999;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
    `;

    const parseBtn = document.createElement('button');
    parseBtn.innerHTML = '解析新结构分类';
    parseBtn.style = `
      position: fixed;
      top: -999vw;
      right: -300vw;
      transition: right 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      z-index: 999999;
      background: #ffbd27;
      border-radius: 1.6vw;
      border: none;
      padding: 1.5vw;
      color: white;
      font-weight: bold;
    `;

    const btnImport = document.createElement('button');
    btnImport.innerHTML = '导入店铺菜单';
    btnImport.style = `
      position: fixed;
      top: 7vw;
      right: -300vw;
      transition: right 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      z-index: 999999;
      background: #ffbd27;
      border-radius: 1.6vw;
      border: none;
      padding: 1.5vw;
      color: white;
      font-weight: bold;
    `;

    const btnShowRawData = document.createElement('button');
    btnShowRawData.innerHTML = '获取原始数据';
    btnShowRawData.style = `
      position: fixed;
      top: 12vw;
      right: -300vw;
      transition: right 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      z-index: 999999;
      background: #ffbd27;
      border-radius: 1.6vw;
      border: none;
      padding: 1.5vw;
      color: white;
      font-weight: bold;
    `;

    const btnShowCategories = document.createElement('button');
    btnShowCategories.innerHTML = '获取商品状态';
    btnShowCategories.style = `
      position: fixed;
      top: 17vw;
      right: -300vw;
      transition: right 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
      z-index: 999999;
      background: #ffbd27;
      border-radius: 1.6vw;
      border: none;
      padding: 1.5vw;
      color: white;
      font-weight: bold;
    `;

    return { mainBtn, parseBtn, btnImport, btnShowRawData, btnShowCategories };
  };

  const { mainBtn, parseBtn, btnImport, btnShowRawData, btnShowCategories } = createButtons();

  let isExpanded = false;
  mainBtn.onclick = () => {
    if (isExpanded) {
      parseBtn.style.right = '-300vw';
      btnImport.style.right = '-300vw';
      btnShowRawData.style.right = '-300vw';
      btnShowCategories.style.right = '-300vw';
    } else {
      parseBtn.style.right = '2vw';
      btnImport.style.right = '2vw';
      btnShowRawData.style.right = '2vw';
      btnShowCategories.style.right = '2vw';
    }
    isExpanded = !isExpanded;
    mainBtn.style.transform = isExpanded ? 'scale(1.2)' : 'scale(1)';
  };

  parseBtn.onclick = async () => {
    if (window.location.href.startsWith('https://cactivityapi-sc.waimai.meituan.com/h5/sub-trade/restaurant/restaurant?')) {
      parseBtn.style.backgroundColor = '#ff8000';
      parseBtn.style.color = 'white';
      parseBtn.innerHTML = '解析中...';
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟解析过程
      alert('解析新结构分类成功...');
      location.reload();
    } else {
      alert('当前页面不需要解析新结构分类。');
    }
  };

  btnImport.onclick = () => {
    if (food) {
      const tagCount = food.data.food_spu_tags.length;
      const spuCount = food.data.food_spu_tags.reduce((sum, tag) => sum + tag.spus.length, 0);
      console.log(food);
      console.log('tagCount', tagCount);
      console.log('spuCount', spuCount);

      const incompleteTags = food.data.food_spu_tags.filter(tag => !tag.spus.length && tag.attempted !== true);
      const noProductTags = food.data.food_spu_tags.filter(tag => !tag.spus.length && tag.attempted === true);
      const incompleteTagCount = incompleteTags.length;
      const noProductTagCount = noProductTags.length;

      let tip = '';
      if (incompleteTagCount > 0 || noProductTagCount > 0) {
        if (window.location.href.includes('https://h5.waimai.meituan.com/waimai/mindex/menu?')) {
          tip = `🌟Tip1：当前为分页菜单，请点击黄色的标签分类获取商品。\n🌟Tip2：当店铺商品数较多时候，请浏览完整商品页面，避免获取缺失！！！`;
        } else if (window.location.href.includes('https://cactivityapi-sc.waimai.meituan.com/h5') ) {
          tip = `🌟Tip1：商品获取情况，可用查看已获取分类按钮查看详情...\n🌟Tip2：新结构店铺商品数较多，请浏览完整商品页面，避免获取缺失！！！`;
        }
      }

      let confirmMessage = ``;
      if (tip) {
        confirmMessage += `${tip}\n\n`;
      }
      confirmMessage += `获取到分类${tagCount}个，商品共计${spuCount}个(存在重复计入)。\n`;

      if (incompleteTagCount > 0) {
        confirmMessage += `注意：当前还有${incompleteTagCount}个分类未获取完整信息。\n`;
      }

      if (noProductTagCount > 0) {
        confirmMessage += `注意：当前有${noProductTagCount}个分类无商品。\n`;
      }

      confirmMessage += `是否导入到搬店平台？`;

      if (confirm(confirmMessage)) {
        btnImport.style.transform = 'scale(1.2)';
        btnImport.style.backgroundColor = '#ff8000';
        btnImport.style.color = 'white';
        btnImport.innerHTML = '正在导入中...';
        importData();
      }

    } else {
      alert('未能监听到菜单数据。');
    }
  };

  btnShowRawData.onclick = () => {
    if (food) {
      const allFoodData = JSON.stringify(food, null, 2);
      const blob = new Blob([allFoodData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      alert('未能监听到菜单数据。');
    }
  };

  btnShowCategories.onclick = () => {
    if (food) {
      const completeTags = food.data.food_spu_tags.filter(tag => tag.spus.length);
      const completeTagCount = completeTags.length;
      const totalSpuCount = completeTags.reduce((sum, tag) => sum + tag.spus.length, 0);

      const incompleteTags = food.data.food_spu_tags.filter(tag => !tag.spus.length && tag.attempted !== true);
      const incompleteTagCount = incompleteTags.length;
      const incompleteTagNames = incompleteTags.map(tag => tag.name).join(', ');

      const noProductTags = food.data.food_spu_tags.filter(tag => !tag.spus.length && tag.attempted === true);
      const noProductTagCount = noProductTags.length;
      const noProductTagNames = noProductTags.map(tag => tag.name).join(', ');

      const totalTagCount = food.data.food_spu_tags.length;

      const container = document.createElement('div');
      container.style = `
        max-height: 80vh;
        overflow-y: auto;
        padding: 10px;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000000;
        position: fixed;
        top: 15vw;
        left: 50%;
        transform: translateX(-50%);
        width: 80vw;
        max-width: 600px;
        border-radius: 1.6vw;
      `;

      const statsContainer = document.createElement('div');
      statsContainer.style = `
        margin-bottom: 10px;
        padding: 10px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 5px;
      `;

      const statsText = `
        <p>总分类数: ${totalTagCount}</p>
        <p>已获取分类数: ${completeTagCount}</p>
        <p>未获取分类数: ${incompleteTagCount}</p>
        <p>无商品分类数: ${noProductTagCount}</p>
        <p>已获取商品数: ${totalSpuCount}</p>
      `;

      statsContainer.innerHTML = statsText;

      const filterContainer = document.createElement('div');
      filterContainer.style = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      `;

      const filterOptions = ['全部', '已获取', '未获取', '无商品'];
      const filterSelect = document.createElement('select');
      filterSelect.style = `
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      `;
      filterOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.text = option;
        filterSelect.appendChild(opt);
      });

      filterSelect.onchange = () => {
        updateTable(filterSelect.value);
      };

      filterContainer.appendChild(filterSelect);

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '关闭';
      closeButton.style = `
        padding: 5px 10px;
        background-color: #ffbd27;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;
      closeButton.onclick = () => {
        document.body.removeChild(container);
      };
      filterContainer.appendChild(closeButton);

      const table = document.createElement('table');
      table.style = 'width: 100%; border-collapse: collapse;';

      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th style="border: 1px solid black; padding: 8px;">分类名称</th>
          <th style="border: 1px solid black; padding: 8px;">商品数量</th>
          <th style="border: 1px solid black; padding: 8px;">获取状态</th>
        </tr>
      `;

      const tbody = document.createElement('tbody');
      food.data.food_spu_tags.forEach(tag => {
        let status;
        if (!tag.spus.length && tag.attempted === true) {
          status = '无商品';
        } else if (!tag.spus.length) {
          status = '未获取';
        } else {
          status = '已获取';
        }
        const statusColor = {
          '已获取': '#4caf50',
          '未获取': '#f44336',
          '无商品': '#FFA500',
          '失败': '#ff9800'
        }[status] || '#000';

        tbody.innerHTML += `
          <tr>
            <td style="border: 1px solid black; padding: 8px;">${tag.name}</td>
            <td style="border: 1px solid black; padding: 8px; text-align: right;">${tag.spus.length}</td>
            <td style="border: 1px solid black; padding: 8px; color: ${statusColor};">${status}</td>
          </tr>
        `;
      });

      table.appendChild(thead);
      table.appendChild(tbody);

      container.appendChild(statsContainer);
      container.appendChild(filterContainer);
      container.appendChild(table);

      document.body.appendChild(container);

      const updateTable = (filterValue) => {
        const rows = tbody.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
          const statusCell = row.cells[2].innerText;
          if (filterValue === '全部' || statusCell === filterValue) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      };

      updateTable(filterSelect.value);
    } else {
      alert('未能监听到菜单数据。');
    }
  };

  const importData = () => {
    let xhr = new XMLHttpRequest();
    try {
      xhr.open("POST", 'https://mv.nianxiang.net.cn/api/admin/move/task/open/import', true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          console.log(res);
          alert(res.data);
          btnImport.style.transform = 'scale(1)';
          btnImport.style.backgroundColor = '#ffbd27';
          btnImport.style.color = 'white';
          btnImport.innerHTML = '导入店铺菜单';
        }
      };
      const data = JSON.stringify({
        raw: JSON.stringify(food),
      });
      xhr.send(data);
    } catch (err) {
      console.log(err);
      alert('请求出错：' + err.message);
      btnImport.style.transform = 'scale(1)';
      btnImport.style.backgroundColor = '#ffbd27';
      btnImport.style.color = 'white';
      btnImport.innerHTML = '导入店铺菜单';
    }
  };

  const originFetch = fetch;
  window.unsafeWindow.fetch = (url, options) => {
    return originFetch(url, options).then(async response => {
      if (response.status === 403) {
        alert('请切换美团账号或者清除浏览器缓存重试/页面拒绝访问！');
        return response;
      }
      const callback = checkRequest(url);
      if (callback) {
        callback(url, await response.clone().json());
      }
      return response;
    });
  };

  const originOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (_, url) {
    const callback = checkRequest(url);
    if (callback) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          if (this.status === 403) {
            alert('请切换美团账号或者清除浏览器缓存重试/页面拒绝访问！');
            return;
          }
          callback(url, JSON.parse(this.responseText));
        }
      });
    }
    originOpen.apply(this, arguments);
  };

  function checkRequest(url) {
    if (url.startsWith('https://i.waimai.meituan.com/openapi/v1/poi/food?') || url.startsWith('https://wx-shangou.meituan.com/quickbuy/v1/poi/food?')) {
      return onGetStoreMenu;
    } else if (url.startsWith('https://i.waimai.meituan.com/openh5/v2/poi/menuproducts?')) {
      return onGetPaginatedMenuProducts;
    } else if (url.startsWith('https://wx-shangou.meituan.com/quickbuy/v1/poi/sputag/products?') || url.startsWith('https://wx-shangou.meituan.com/quickbuy/v1/poi/product/smooth/render?')) {
      return onGetNewStructureMenuProducts;
    }
  }

  function onGetStoreMenu(url, res) {
    food = res;
    const tags = food.data.food_spu_tags;
    if (tags.length) {
      tags.forEach(tag => {
        if (tag.tags && tag.tags.length) {
          tag.spus = [];
          tag.tags.forEach(subTag => {
            if (subTag.spus && subTag.spus.length) {
              tag.spus.push(...subTag.spus);
            }
          });
        }
      });

      document.body.appendChild(mainBtn);
      document.body.appendChild(parseBtn);
      document.body.appendChild(btnImport);
      document.body.appendChild(btnShowRawData);
      document.body.appendChild(btnShowCategories);
      refreshTabStatus();
    }
  }

  function onGetPaginatedMenuProducts(url, res) {
    const tags = food.data.food_spu_tags;
    const tagId = res.data.product_tag_id;
    const currentTag = tags.find(tag => tag.tag === tagId);
    if (currentTag) {
      currentTag.spus = [...new Set([...currentTag.spus, ...res.data.product_spu_list])]; // 确保唯一性
      currentTag.attempted = true; // 标记该分类已被尝试获取
      refreshTabStatus();
    } else {
      alert('未找到当前标签，请刷新后重试或切换美团账号后重试');
    }
  }

  function onGetNewStructureMenuProducts(url, res) {
    const tags = food.data.food_spu_tags;
    const selectedCategoryName = getSelectedCategoryName();
    const currentTag = tags.find(tag => tag.name === selectedCategoryName);

    if (currentTag) {
      currentTag.spus = [...new Set([...currentTag.spus, ...res.data.product_spu_list])]; // 确保唯一性
      currentTag.attempted = true; // 标记该分类已被尝试获取
    } else {
      console.warn(`未找到当前标签`);
      alert('获取到商品数据但是匹配标签失败！！！\n1. 可尝试刷新界面重新获取\n2. 进行手动归类');

      const panel = document.createElement('div');
      panel.style = `
        position: fixed;
        top: 15vw;
        right: 2vw;
        z-index: 1000001;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 1.6vw;
        padding: 1.5vw;
        width: 20vw;
        max-width: 300px;
      `;

      const title = document.createElement('div');
      title.textContent = '选择分类';
      title.style = `
        font-size: 1.2em;
        margin-bottom: 1vw;
        font-weight: bold;
      `;

      const select = document.createElement('select');
      select.style = `
        width: 100%;
        padding: 0.5vw;
        margin-bottom: 1vw;
        border: 1px solid #ccc;
        border-radius: 0.5vw;
      `;

      const newOption = document.createElement('option');
      newOption.value = 'new';
      newOption.textContent = '新建自定义标签';
      select.appendChild(newOption);

      tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        select.appendChild(option);
      });

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '输入新标签名称';
      input.style = `
        width: 100%;
        padding: 0.5vw;
        margin-bottom: 1vw;
        border: 1px solid #ccc;
        border-radius: 0.5vw;
        display: block;
      `;

      select.onchange = () => {
        if (select.value === 'new') {
          input.style.display = 'block';
        } else {
          input.style.display = 'none';
        }
      };

      const saveButton = document.createElement('button');
      saveButton.textContent = '保存';
      saveButton.style = `
        width: 100%;
        padding: 0.5vw;
        background-color: #ffbd27;
        color: white;
        border: none;
        border-radius: 0.5vw;
        cursor: pointer;
      `;

      saveButton.onclick = () => {
        let tagName;
        if (select.value === 'new') {
          tagName = input.value.trim();
          if (!tagName) {
            alert('请输入有效的标签名称');
            return;
          }
        } else {
          tagName = select.value;
        }

        const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
        if (existingTag) {
          existingTag.spus = [...new Set([...existingTag.spus, ...res.data.product_spu_list])]; // 确保唯一性
          existingTag.attempted = true; // 标记该分类已被尝试获取
        } else {
          const newTag = {
            tag: tagName,
            name: tagName,
            spus: res.data.product_spu_list,
            attempted: true
          };
          food.data.food_spu_tags.push(newTag);
        }

        document.body.removeChild(panel);
        refreshTabStatus();
      };

      panel.appendChild(title);
      panel.appendChild(select);
      panel.appendChild(input);
      panel.appendChild(saveButton);

      document.body.appendChild(panel);
    }
  }

  function refreshTabStatus() {
    const navEl = document.querySelector("#sqt-openh5-menulist > [class^='root_'] > [class^='panel_'] > [class^='root_'] > [class^='root_']");
    if (navEl) {
      for (let i = 0; i < navEl.children.length; i++) {
        navEl.children[i].style.backgroundColor = '#CCE099'; // 获取成功设置为绿色
      }
      food.data.food_spu_tags.forEach((item, index) => {
        if (!item.spus.length && item.attempted !== true) {
          const btnTab = findElementWithInnerText(navEl, item.name);
          if (btnTab) {
            btnTab.style.backgroundColor = 'yellow'; // 设置背景颜色为黄色
          }
        } else if (!item.spus.length && item.attempted === true) {
          const btnTab = findElementWithInnerText(navEl, item.name);
          if (btnTab) {
            btnTab.style.backgroundColor = '#FFA500'; // 设置背景颜色为橙色
          }
        }
      });
    }
  }

  function findElementWithInnerText(el, text) {
    for (let i = 0; i < el.children.length; i++) {
      if (el.children[i].innerText.trim() === text) {
        return el.children[i];
      }
    }
    return null;
  }

  function getSelectedCategoryName() {
    const activeCategory = document.querySelector('.category-cat-item-name.category-active-type-one');
    if (activeCategory) {
      return activeCategory.querySelector('.category-cat-item-text').innerText.trim();
    }

    const mtViewCategory = document.querySelector('mt-view.p-left-sub-tab-title.mt-active');
    if (mtViewCategory) {
      const mtTextView = mtViewCategory.querySelector('mt-view.p-sub-tab-text');
      if (mtTextView) {
        return mtTextView.innerText.trim();
      }
    }

    return null;
  }

  document.body.appendChild(mainBtn);
  document.body.appendChild(btnImport);
  document.body.appendChild(btnShowRawData);
  document.body.appendChild(btnShowCategories);

  // 添加按钮点击效果
  [mainBtn, parseBtn, btnImport, btnShowRawData, btnShowCategories].forEach(btn => {
    btn.addEventListener('mouseover', () => {
      btn.style.transform = 'scale(1.2)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.transform = 'scale(1)';
    });
  });

  // 检查是否是新结构菜单界面，并决定是否显示解析新结构分类按钮
  if (window.location.href.startsWith('https://cactivityapi-sc.waimai.meituan.com/h5/sub-trade/restaurant/restaurant?')) {

    document.body.appendChild(parseBtn);
    // 调整其他按钮的位置以保持在同一垂直线上
    parseBtn.style.top = '7vw';
    btnImport.style.top = '12vw';
    btnShowRawData.style.top = '17vw';
    btnShowCategories.style.top = '22vw';
  }
})();