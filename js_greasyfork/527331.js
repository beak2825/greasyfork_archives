// ==UserScript==
// @name           饿了么搬菜
// @description     抓取ele.me页面上的分类及商品信息并统计
// @version         v1.0.1
// @author          ChengPP
// @match           https://h5.ele.me/*
// @run-at          document-idle
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @connect         raw.githubusercontent.com
// @connect         mv.nianxiang.net.cn
// @connect         localhost
// @connect         *
// @icon            https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684
// @require         https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.5/xlsx.full.min.js
// @namespace https://greasyfork.org/users/1436563
// @downloadURL https://update.greasyfork.org/scripts/527331/%E9%A5%BF%E4%BA%86%E4%B9%88%E6%90%AC%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/527331/%E9%A5%BF%E4%BA%86%E4%B9%88%E6%90%AC%E8%8F%9C.meta.js
// ==/UserScript==

(function() {

  'use strict';

  let categories = {};
  const specificationsStorage = {};  // 使用一个对象来代替localStorage存储规格信息
  let nextSpuId = 1;  // 用于生成唯一的SPU ID
  let food = null;  // 存储最终的数据结构
  let shopInfo = {};  // 存储门店信息
  let poiIdStr = 'ZhengJinCheng';  // 默认值

  const createMainButton = () => {
    const mainBtn = document.createElement('button');
    mainBtn.innerHTML = '<img src="https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684" alt="☰" style="width: 15px; height: 15px;">';
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
    return mainBtn;
  };

  const createImportButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '导入到搬点平台';
    btn.style = `
      position: fixed;
      top: 8vw;
      right: -300vw;
      width: 150px;
      height: 40px;
      z-index: 999999;
      background: #4CAF50;
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    `;
    return btn;
  };

  const createParseButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '获取商品状态';
    btn.style = `
      position: fixed;
      top: 14vw;
      right: -300vw;
      width: 150px;
      height: 40px;
      z-index: 999999;
      background: #ffbd27;
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    `;
    return btn;
  };

  const createDataConversionButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '查看数据';
    btn.style = `
      position: fixed;
      top: 20vw;
      right: -300vw;
      width: 150px;
      height: 40px;
      z-index: 999999;
      background: #9E9E9E;
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    `;
    return btn;
  };

  const mainBtn = createMainButton();
  const btnImport = createImportButton();
  const parseBtn = createParseButton();
  const btnDataConversion = createDataConversionButton();

  document.body.appendChild(mainBtn);
  document.body.appendChild(btnImport);
  document.body.appendChild(parseBtn);
  document.body.appendChild(btnDataConversion);

  let isExpanded = false;
  mainBtn.onclick = () => {
    if (isExpanded) {
      btnImport.style.right = '-300vw';
      parseBtn.style.right = '-300vw';
      btnDataConversion.style.right = '-300vw';
    } else {
      btnImport.style.right = '2vw';
      parseBtn.style.right = '2vw';
      btnDataConversion.style.right = '2vw';
      btnImport.style.opacity = '1';
      parseBtn.style.opacity = '1';
      btnDataConversion.style.opacity = '1';
    }
    isExpanded = !isExpanded;
    mainBtn.style.transform = isExpanded ? 'scale(1.2)' : 'scale(1)';
    mainBtn.style.width = isExpanded ? '30px' : '15px';
    mainBtn.style.height = isExpanded ? '30px' : '15px';
  };

  btnImport.onclick = () => {
    if (Object.keys(categories).length > 0) {
      const totalItems = Object.values(categories).reduce((sum, items) => sum + items.length, 0);
      const emptyCategories = Object.entries(categories)
        .filter(([id, items]) => items.length === 0)
        .map(([id]) => categories[id][0]?.name || id)
        .join(', ');
      const message = emptyCategories ? `还有如下分类未获取：${emptyCategories}（共${emptyCategories.split(', ').length}个），${shopInfo.name}目前获取到商品${totalItems}个，是否继续导入？` : `${shopInfo.name}目前获取到商品${totalItems}个，是否确认导入到搬点平台？`;
      if (confirm(message)) {
        btnImport.innerHTML = '正在导入商品中...';
        btnImport.style.backgroundColor = '#FF5722';
        btnImport.style.transform = 'scale(1.2)';

        convertData();  // 调用数据转换函数

        let xhr = new XMLHttpRequest();
        try {
          xhr.open("POST", 'https://mv.nianxiang.net.cn/api/admin/move/task/open/import', true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const res = JSON.parse(xhr.responseText);
              console.log(res);
              alert(res.data);
              btnImport.innerHTML = '导入到搬点平台';
              btnImport.style.backgroundColor = '#4CAF50';
              btnImport.style.transform = 'scale(1)';
            }
          };
          const data = JSON.stringify({
            raw: JSON.stringify(food),
          });
          xhr.send(data);
        } catch (err) {
          console.log(err);
          alert('请求出错：' + err.message);
          btnImport.innerHTML = '导入到搬点平台';
          btnImport.style.backgroundColor = '#4CAF50';
          btnImport.style.transform = 'scale(1)';
        }
      }
    } else {
      alert('尚未获取到分类及商品信息，请先浏览页面加载相关信息。');
    }
  };

  parseBtn.onclick = () => {
    if (Object.keys(categories).length > 0) {
      importSpecifications();
      showStatisticsTable();
    } else {
      getCategoryData();
      getMenuItemData();
      getShopInfo();
      getPoiIdStr();
      parseBtn.innerHTML = '获取商品状态';
      parseBtn.style.backgroundColor = '#ffbd27';
      parseBtn.style.transform = 'scale(1)';
    }
  };

  btnDataConversion.onclick = () => {
    if (Object.keys(categories).length > 0) {
      convertDataAndShow();
    } else {
      alert('尚未获取到分类及商品信息，请先浏览页面加载相关信息。');
    }
  };

  const getCategoryData = () => {
    const categoryElements = document.querySelectorAll('.sideList--item .sideList--item-text');
    categories = {};
    categoryElements.forEach(element => {
      const categoryName = element.textContent.trim();
      categories[categoryName] = [];
    });
    console.log('分类数据获取完成:', categories);
  };

  const getMenuItemData = () => {
    const menuItemElements = document.querySelectorAll('[data-cate-name]');
    menuItemElements.forEach(element => {
      const categoryName = element.getAttribute('data-cate-name');
      const fractionElement = element.querySelector('.menuItem--info-price-text.fraction');
      const fraction = fractionElement ? parseFloat(fractionElement.textContent) : 0;
      const item = {
        id: nextSpuId++,
        name: element.getAttribute('data-food-detail-title'),
        min_price: parseFloat(element.querySelector('.menuItem--info-price-text')?.textContent.replace('¥', '')) + (fraction ? fraction : 0),
        picture: element.getAttribute('data-food-detail-img'),
        attrs: specificationsStorage[element.getAttribute('data-food-detail-title')] || [],
        sku_label: element.querySelector('.menuItem--info-price .menuItem--info-price-text')?.textContent || '规格',
        skus: []
      };

      if (categories[categoryName]) {
        categories[categoryName].push(item);
      }
    });
    console.log('商品数据获取完成:', categories);
  };

  const importSpecifications = () => {
    const popupElements = document.querySelectorAll('.sku__wrapper, .sku-wrapper');
    popupElements.forEach(popupElement => {
      const itemName = popupElement.querySelector('.sku--header-title, .sku-header .sku-header-title')?.textContent?.trim();
      const specGroups = popupElement.querySelectorAll('.sku--group, .sku-group');

      const specifications = [];
      specGroups.forEach(group => {
        const specTitle = group.querySelector('.sku--body_h2, .sku-group-title')?.textContent?.trim();
        const options = Array.from(group.querySelectorAll('.sku-option__root, .sku-group-item')).map(optionElement => {
          const nameSelector = optionElement.querySelector('.ml-ellipsis.lh-32.font-24.color-19, .sku-group-item-title, .lh-30');
          const priceSelector = optionElement.querySelector('.option-price, .sku-group-item-price');
          return {
            name: nameSelector?.textContent?.trim(),
            price: priceSelector?.textContent || '+ ¥0'
          };
        });
        specifications.push({
          name: specTitle,
          values: options.map(option => ({
            id: option.name,  // 这里假设每个选项的名字是唯一的，可以用作ID
            value: option.name
          }))
        });
      });

      specificationsStorage[itemName] = specifications;  // 将规格信息存储在内存中

      let matched = false;
      Object.values(categories).forEach(categoryItems => {
        const item = categoryItems.find(item => item.name === itemName);
        if (item && !item.specsImported) {
          item.attrs = item.attrs.concat(specifications);
          item.specsImported = true;
          matched = true;

          const specInfo = JSON.stringify(specifications, null, 2);
          console.log(`商品 "${itemName}" 的规格信息导入完成:\n${specInfo}`);
        }
      });

      if (!matched) {
        console.log(`未找到与商品 "${itemName}" 匹配的信息`);
      }
    });
  };

  const showStatisticsTable = () =>
{
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

    // 获取店铺名称和logo
  const shopNameElementNew = document.querySelector('.shop-header-info-card__name.mor-comp-view');
  const shopLogoElementNew = document.querySelector('.shop-header-info-card__logo.mor-comp-view');

  const shopNameElementOld = document.getElementById('shic2-shop-name');
  const shopLogoElementOld = document.querySelector('.shic2-shop-logo');

  let shopName = '';
  let shopLogoUrl = '';

  if (shopNameElementNew && shopLogoElementNew) {
    shopName = shopNameElementNew.textContent.trim().replace(/&amp;/g, '&');
    shopLogoUrl = shopLogoElementNew.style.backgroundImage.replace(/url\(|\)|"/g, '') ;
  } else if (shopNameElementOld && shopLogoElementOld) {
    shopName = shopNameElementOld.textContent.trim().replace(/&amp;/g, '&');
    shopLogoUrl = shopLogoElementOld.getAttribute('src') || 'https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684';
  } else {
    shopName = '未知店铺';
    shopLogoUrl = 'https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684';
  }

    const headerContainer = document.createElement('div');
    headerContainer.style = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    `;

    const logoImg = document.createElement('img');
    logoImg.src = shopLogoUrl;
    logoImg.alt = '店铺logo';
    logoImg.style = `
      width: 50px;
      height: 50px;
      object-fit: cover;
      margin-right: 10px;
      border-radius: 5px;
    `;

    const shopNameSpan = document.createElement('span');
    shopNameSpan.innerText = shopName;
    shopNameSpan.style = `
      font-size: 16px;
      font-weight: bold;
    `;

    headerContainer.appendChild(logoImg);
    headerContainer.appendChild(shopNameSpan);

    const buttonContainer = document.createElement('div');
    buttonContainer.style = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;

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

    const exportExcelButton = document.createElement('button');
    exportExcelButton.innerHTML = '导出为Excel';
    exportExcelButton.style = `
      margin-right: 10px;
      padding: 5px 10px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    exportExcelButton.onclick = () => {
    convertData();
      if (!food || !food.data) {
        alert('没有可用的商品数据！');
        return;
      }
      exportToExcel(food);
    };

    const viewOnlineButton = document.createElement('button');
    viewOnlineButton.innerHTML = '查看商品详细';
    viewOnlineButton.style = `
      padding: 5px 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    viewOnlineButton.onclick = () => {
    convertData();
      if (!food || !food.data) {
        alert('没有可用的商品数据！');
        return;
      }
      openViewPage(food);
    };

    buttonContainer.appendChild(viewOnlineButton);
    buttonContainer.appendChild(exportExcelButton);
    buttonContainer.appendChild(closeButton);

    headerContainer.appendChild(buttonContainer);

    container.appendChild(headerContainer);

    const statsContainer = document.createElement('div');
    statsContainer.style = `
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 5px;
    `;

    const totalCategories = Object.keys(categories).length;
    const totalItems = Object.values(categories).reduce((sum, items) => sum + items.length, 0);
    const emptyCategories = Object.entries(categories)
      .filter(([id, items]) => items.length === 0)
      .map(([id]) => categories[id][0]?.name || id)
      .length;

    const statsText = `
      <p style="font-size: 14px;">总分类数: ${totalCategories}</p>
      <p style="font-size: 14px;">已获取分类数: ${totalCategories - emptyCategories}</p>
      <p style="font-size: 14px;">未获取分类数: ${emptyCategories}</p>
      <p style="font-size: 14px;">已获取商品数: ${totalItems}</p>
    `;

    statsContainer.innerHTML = statsText;

    container.appendChild(statsContainer);

    const filterContainer = document.createElement('div');
    filterContainer.style = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    `;

    const filterOptions = ['全部', '已获取', '未获取'];
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

    container.appendChild(filterContainer);

    const table = document.createElement('table');
    table.style = 'width: 100%; border-collapse: collapse;';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="border: 1px solid black; padding: 8px; font-size: 14px;">分类名称</th>
        <th style="border: 1px solid black; padding: 8px; font-size: 14px;">商品数量</th>
        <th style="border: 1px solid black; padding: 8px; font-size: 14px;">获取状态</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');
    Object.entries(categories).forEach(([categoryName, items]) => {
      const status = items.length > 0 ? '已获取' : '未获取';
      const statusColor = {
        '已获取': '#4caf50',
        '未获取': '#f44336',
      }[status] || '#000';

      tbody.innerHTML += `
        <tr>
          <td style="border: 1px solid black; padding: 8px; font-size: 14px;">${categoryName}</td>
          <td style="border: 1px solid black; padding: 8px; text-align: right; font-size: 14px;">${items.length}</td>
          <td style="border: 1px solid black; padding: 8px; color: ${statusColor}; font-size: 14px;">${status}</td>
        </tr>
      `;
    });

    table.appendChild(thead);
    table.appendChild(tbody);

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
  };

  const convertDataAndShow = () => {
    convertData();
    window.open('about:blank').document.write(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>商品信息</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>商品信息</h1>
        <pre>${JSON.stringify(food, null, 2)}</pre>
      </body>
      </html>
    `);
  };

  const convertData = () => {
    food = {
      data: {
        food_spu_tags: [],
        poi_info: {
          id: -100,
          poi_id_str: poiIdStr,
          name: shopInfo.name,
          bulletin: "恭喜发财666",
          pic_url: shopInfo.logo
        }
      }
    };

    // 添加分类信息
    Object.keys(categories).forEach((categoryName, index) => {
      const category = {
        category_code: null,
        tag: `${index + 1}`,
        name: categoryName,
        spus: []
      };

      categories[categoryName].forEach(item => {
        const spu = {
          id: item.id,
          name: item.name,
          min_price: item.min_price,
          picture: item.picture,
          attrs: item.attrs,
          sku_label: item.sku_label,
          skus: item.skus.map(sku => ({
            id: sku.id,
            spec: sku.spec
          }))
        };
        category.spus.push(spu);
      });

      food.data.food_spu_tags.push(category);
    });

    console.log('数据转换完成:', food);
  };

/*---------------------------------------------------------------------------------------------------------------------------------*/
const getShopInfo = () => {
  // 尝试通过新的结构获取店铺名称和logo
  const shopNameElementNew = document.querySelector('.shop-header-info-card__name.mor-comp-view');
  const shopLogoElementNew = document.querySelector('.shop-header-info-card__logo.mor-comp-view');

  // 尝试通过旧的结构获取店铺名称和logo
  const shopNameElementOld = document.getElementById('shic2-shop-name');
  const shopLogoElementOld = document.querySelector('.shic2-shop-logo');

  let shopName = '';
  let shopLogoUrl = '';

  if (shopNameElementNew && shopLogoElementNew) {
    shopName = shopNameElementNew.textContent.trim().replace(/&amp;/g, '&');
    shopLogoUrl = shopLogoElementNew.style.backgroundImage.replace(/url\(|\)|"/g, '') ;
  } else if (shopNameElementOld && shopLogoElementOld) {
    shopName = shopNameElementOld.textContent.trim().replace(/&amp;/g, '&');
    shopLogoUrl = shopLogoElementOld.getAttribute('src') || 'https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684';
  } else {
    shopName = '未知店铺';
    shopLogoUrl = 'https://himg.bdimg.com/sys/portrait/item/pp.1.61637635.q_9U7gFy_biR3yojcvZygw.jpg?tt=1732025929684';
  }

  shopInfo = {
    name: shopName,
    logo: shopLogoUrl
  };
  console.log('门店信息获取完成:', shopInfo);
};

/*---------------------------------------------------------------------------------------------------------------------------------*/


  const getPoiIdStr = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const traceId = urlParams.get('trace_id');
    if (traceId) {
      poiIdStr = traceId;
    }
    console.log('poi_id_str 获取完成:', poiIdStr);
  };

  const observePopup = () => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && (node.classList.contains('sku__wrapper') || node.classList.contains('sku-wrapper'))) {
              const popupElement = node;
              const itemName = popupElement.querySelector('.sku--header-title, .sku-header .sku-header-title')?.textContent?.trim();
              const specGroups = popupElement.querySelectorAll('.sku--group, .sku-group');

              const specifications = [];
              specGroups.forEach(group => {
                const specTitle = group.querySelector('.sku--body_h2, .sku-group-title')?.textContent?.trim();
                const options = Array.from(group.querySelectorAll('.sku-option__root, .sku-group-item')).map(optionElement => {
                  const nameSelector = optionElement.querySelector('.ml-ellipsis.lh-32.font-24.color-19, .sku-group-item-title, .lh-30');
                  const priceSelector = optionElement.querySelector('.option-price, .sku-group-item-price');
                  return {
                    name: nameSelector?.textContent?.trim(),
                    price: priceSelector?.textContent || '+ ¥0'
                  };
                });
                specifications.push({
                  name: specTitle,
                  values: options.map(option => ({
                    id: option.name,  // 这里假设每个选项的名字是唯一的，可以用作ID
                    value: option.name
                  }))
                });
              });

              specificationsStorage[itemName] = specifications;  // 将规格信息存储在内存中
              console.log(`规格信息已保存到内存中，商品名称: ${itemName}, 规格信息:`, specifications);
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const observer = new MutationObserver(() => {
    if (window.location.href.includes('/2021001185671035/pages/ele-takeout-index/ele-takeout-index?')) {
      getCategoryData();
      getMenuItemData();
      getShopInfo();
      getPoiIdStr();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始化获取一次分类数据
  if (window.location.href.includes('/2021001185671035/pages/ele-takeout-index/ele-takeout-index?')) {
    getCategoryData();
    getMenuItemData();
    getShopInfo();
    getPoiIdStr();
  }

  // 开始监听弹出页面
  observePopup();

  const exportToExcel = (foodData) => {
    if (!foodData || !foodData.data) {
      console.error('No valid food data provided to exportToExcel');
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['店名', '店铺logo', '店铺分类', '商品名称', '详细商品规格信息', '商品图片', '价格信息']
    ];

    foodData.data.poi_info.name = foodData.data.poi_info.name.replace(/"/g, '""'); // 处理包含双引号的情况

    foodData.data.food_spu_tags.forEach(tag => {
      tag.spus.forEach(spu => {
        let specsInfo = '';
        spu.attrs.forEach(attr => {
          specsInfo += `${attr.name}: ${attr.values.map(val => val.value).join('/')}\n`;
        });
        specsInfo = specsInfo.trim().replace(/"/g, '""'); // 处理包含双引号的情况

        worksheetData.push([
          `"${foodData.data.poi_info.name}"`,
          foodData.data.poi_info.pic_url,
          tag.name,
          `"${spu.name}"`,
          specsInfo,
          spu.picture,
          spu.min_price
        ]);
      });
    });
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${foodData.data.poi_info.name}_商品信息.xlsx`);
  };

  const openViewPage = (foodData) => {
    if (!foodData || !foodData.data) {
      console.error('No valid food data provided to openViewPage');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>商品信息</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          img { max-width: 100px; height: auto; }
        </style>
      </head>
      <body>
      <div class="store-info">
          <h2>${foodData.data.poi_info.name}</h2>
          <img src="${foodData.data.poi_info.pic_url}" alt="店铺logo" style="max-width: 100px; height: auto;">
        </div>
        <table>
          <thead>
            <tr>
              <th>店名</th>
              <th>店铺分类</th>
              <th>商品名称</th>
              <th>详细商品规格信息</th>
              <th>商品图片</th>
              <th>价格信息</th>
            </tr>
          </thead>
          <tbody>
            ${foodData.data.food_spu_tags.map(tag =>
              tag.spus.map(spu => `
                <tr>
                  <td>${foodData.data.poi_info.name}</td>
                  <td>${tag.name}</td>
                  <td>${spu.name}</td>
                  <td>${spu.attrs.map(attr => `${attr.name}: ${attr.values.map(val => val.value).join('/')}`).join('<br>')}</td>
                  <td><img src="${spu.picture}" alt="${spu.name}"></td>
                  <td>${spu.min_price}</td>
                </tr>
              `).join('')
            ).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank', 'width=800,height=600');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };
})();

