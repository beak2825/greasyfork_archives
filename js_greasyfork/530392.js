// ==UserScript==
// @name         MWIviewer
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Add [View Price History] Button / 增加[查看历史价格]按钮
// @author       wooodensail
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530392/MWIviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/530392/MWIviewer.meta.js
// ==/UserScript==

const FILTER_STORAGE_KEY = 'MWIviewer_filter'
const POP_FILTER_KEY = 'MWIviewer_popFilter'
const parser = new DOMParser();
(function () {
  'use strict';
  const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
  let isZH = isZHInGameSetting; // MWITools 本身显示的语言默认由游戏内设置语言决定
  const targetNode = document.body;
// 观察器的配置（需要观察什么变动）
  const config = {childList: true};
  // 过滤配置
  let filterConfig = {favList: [], mode: 'default'}
  try {
    if (localStorage.getItem(FILTER_STORAGE_KEY)) {
      filterConfig = JSON.parse(localStorage.getItem(FILTER_STORAGE_KEY))
    }
  } catch (e) {
    console.error(e)
  }


// 当观察到变动时执行的回调函数
  const callback = function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          // 增加查看历史价格按钮
          if (node.classList && node.classList.contains('MuiPopper-root')) {
            node.querySelectorAll('Button').forEach(button => {
              if (button.innerText === '打开物品词典' || button.innerText === 'Open Item Dictionary') {
                const itemName = node.querySelector('[class^=Item_name]').innerText.trim()
                const newButton = button.cloneNode()
                newButton.innerText = isZH ? '查看历史价格' : 'View Price History'
                newButton.onclick = () => {
                  window.open('https://woodensail.github.io/MWIviewer/?item=' + encodeURIComponent(itemName))
                }
                button.parentNode.append(newButton)
                const favButton = button.cloneNode()
                const isFav = filterConfig.favList.includes(itemName)
                favButton.innerText = !isFav ? '加入收藏' : '移除收藏'
                favButton.onclick = () => {
                  if (isFav) {
                    filterConfig.favList = filterConfig.favList.filter(v => v !== itemName)
                    favButton.innerText = '加入收藏'
                  } else {
                    filterConfig.favList.push(itemName)
                    favButton.innerText = '移除收藏'
                  }
                  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterConfig))
                }
                button.parentNode.append(favButton)
              }
            })
          }
        })
      }
    })
  };

// 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
  observer.observe(targetNode, config);

  // 初始化循环1
  const initTimer = setInterval(() => {
    const marketFilterDom = document.querySelector('[class^="MarketplacePanel_itemFilterContainer"] [class^="Input_inputContainer"]')
    if (marketFilterDom) {
      clearInterval(initTimer)
      const dom = document.createElement('div')
      dom.className = 'MWIviewer_switch'
      dom.innerHTML = `
        <div class="MWIviewer_switch_item" data-mode="default" style="background: rgb(67, 87, 175)">默认模式</div>
        <div class="MWIviewer_switch_item" data-mode="filter">过滤模式</div>
      `
      dom.onclick = e => {
        if (e.target.className.includes('MWIviewer_switch_item')) {
          filterConfig.mode = e.target.dataset.mode
          localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterConfig))
          applyMode()
        }

      }

      function applyMode() {
        dom.querySelectorAll('.MWIviewer_switch_item').forEach(v => {
          v.style.backgroundColor = 'transparent'
        })
        dom.querySelector(`.MWIviewer_switch_item[data-mode="${filterConfig.mode || 'default'}"]`).style.backgroundColor = 'rgb(67, 87, 175)'
        if (filterConfig.mode === 'filter') {
          marketFilterDom.parentNode.parentNode.parentNode.classList.add('MWIviewer_hideUnFav')
        } else {
          marketFilterDom.parentNode.parentNode.parentNode.classList.remove('MWIviewer_hideUnFav')
        }
      }

      marketFilterDom.append(dom)
      applyMode()
    }
  }, 500)
  setInterval(() => {
    // 消息提示
    if (document.querySelector('[class*="NavigationBar_badges"]')) {
      document.title = '新通知'
    }
    // 监听物品搜索框
    const inputDoms = document.querySelectorAll('.MuiPopper-root [class*="ItemSelector_menu"] [class*="Input_inputContainer"]')
    inputDoms.forEach(node => {
      if (!node.dataset.hasFilter) {
        node.dataset.hasFilter = '1'
        const dom = document.createElement('div')
        dom.className = 'MWIviewer_switch_inner'
        dom.innerHTML = `
        <div class="MWIviewer_switch_item" data-mode="default" style="background: rgb(67, 87, 175)">默认模式</div>
        <div class="MWIviewer_switch_item" data-mode="filter">过滤模式</div>
      `
        dom.onclick = e => {
          const popFilterMode = e.target.dataset.mode
          if (e.target.className.includes('MWIviewer_switch_item')) {
            e.target.style.backgroundColor = 'rgb(67, 87, 175)'
          }
          localStorage.setItem(POP_FILTER_KEY, popFilterMode)
          applyMode(popFilterMode)
        }

        function applyMode(mode) {
          dom.querySelectorAll('.MWIviewer_switch_item').forEach(v => {
            v.style.backgroundColor = 'transparent'
          })
          dom.querySelector(`.MWIviewer_switch_item[data-mode="${mode}"]`).style.backgroundColor = 'rgb(67, 87, 175)'
          if (mode === 'filter') {
            dom.parentNode.parentNode.classList.add('MWIviewer_hideUnFav')
          } else {
            dom.parentNode.parentNode.classList.remove('MWIviewer_hideUnFav')
          }
        }

        node.append(dom)
        applyMode(localStorage.getItem(POP_FILTER_KEY))
      }
    })
    // 弹窗物品监听
    const popItems = document.querySelectorAll('[class^="ItemSelector_itemContainer"] [class*="Item_clickable"]')
    popItems.forEach(node => {
      if (!node.dataset.hasFavIcon) {
        node.dataset.hasFavIcon = '1'
        const name = node.querySelector('svg').getAttribute('aria-label')
        if (!filterConfig.favList.find(v => v === name)) {
          node.parentNode.parentNode.parentNode.classList.add('MWIviewer_unfav')
        }
      }
    })
    // 监听物品
    const items = document.querySelectorAll('[class^="MarketplacePanel_itemSelectionTabsContainer"] [class*="Item_clickable"]')
    items.forEach(node => {
      if (!node.dataset.hasFavIcon) {
        node.dataset.hasFavIcon = '1'
        const name = node.querySelector('svg').getAttribute('aria-label')
        if (!filterConfig.favList.find(v => v === name)) {
          node.parentNode.parentNode.classList.add('MWIviewer_unfav')
        }
      }
    })
  }, 500)
  // css 初始化
  // 创建一个 style 元素
  const styleElement = document.createElement("style");

// 添加样式内容
  styleElement.textContent = `
.MWIviewer_hideUnFav .MWIviewer_unfav{
  display:none;
}
.MWIviewer_switch_inner{
   border: 1px solid rgb(67, 87, 175);
   border-radius: 4px;
   margin-top:8px;
    width: max-content;
}
.MWIviewer_switch{
   border: 1px solid rgb(67, 87, 175);
   border-radius: 4px;
    position:absolute;
    left:calc(100% + 12px);
    top:0;
    width: max-content;
}
.MWIviewer_switch_item{
    display: inline-block;
    width: max-content;
    padding: 4px 8px;
    line-height: 16px;
    cursor: pointer;
}
`;

// 将 style 元素插入到文档头部
  document.head.appendChild(styleElement);
})();

function calcStoneCost(chance) {
  const stonePrice = 700000000
  const catalystPrice= 80000
  const successRate= 0.65
  const allOutputs = 1/chance
  const allTrys = allOutputs/successRate
  const usage = allTrys - allOutputs+1
  console.log(stonePrice,catalystPrice,successRate,allOutputs,allTrys,usage)
  return  (stonePrice - catalystPrice*allOutputs)/usage
}