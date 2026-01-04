// ==UserScript==
// @name         mooket补充（商品价格基数修改）
// @namespace    自用mooket补充
// @version      20251114
// @description  基于mooket插件补充的商品价格基数修改功能！
// @author       lzl
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545666/mooket%E8%A1%A5%E5%85%85%EF%BC%88%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%E5%9F%BA%E6%95%B0%E4%BF%AE%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545666/mooket%E8%A1%A5%E5%85%85%EF%BC%88%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%E5%9F%BA%E6%95%B0%E4%BF%AE%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

/*
  基于mooket插件补充的商品价格基数修改功能。
  目前在不修改原mooket插件源码的前提下，暂未完善修改基数后刷新mooket列表中的涨跌值的功能，需要手动刷新一下页面。
*/

(function() {
    'use strict';

    if (!localStorage.getItem("mooket_config")) {
      var conf = confirm('请先安装mooket插件，点击确认跳转安装');
      if(conf == true){
        window.open("https://greasyfork.org/zh-CN/scripts/530316-mooket");
      }
      return false;
    }


    function getLocalConfig() {
      return JSON.parse(localStorage.getItem("mooket_accessories_config")) || {
        viewType: "visible", // 视窗收起或打开状态 visible || hidden
        dialogPosition: {
          top: "20px",
          left: "20px"
        }
      }
    }
    function setLocalConfig(config) {
      localStorage.setItem("mooket_accessories_config", JSON.stringify(config))
    }

    let localConfig = getLocalConfig();
    let pConfig = new Proxy(localConfig, {
        set(target, property, value) {
            target[property] = value;
            setLocalConfig(target)
            return true;
        }
    });

    // 监听
    const lzlobserver = new MutationObserver(mutations => {
        updatemooektlist();
    });

    let captureDomTimer = setInterval(() => {
      if (document.querySelector('[title="📈🖱❌"]')) {
          clearInterval(captureDomTimer)
          if (mwi.character?.gameMode !== "standard") { // 标准模式才放行加载
            return false;
          }
          updatemooektlist();
          lzlobserver.observe(document.querySelector('[title="📈🖱❌"]'), {
              childList: true,
              subtree: false,
              attributeOldValue: true,
          });
      }
    }, 200)


    // 插入自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
      .lzl-mooket-list-container {
          position: fixed;
          top: ${pConfig.dialogPosition.top};
          left: ${pConfig.dialogPosition.left};
          width: ${{visible: '560px', hidden: '36px'}[pConfig.viewType]};
          background: rgb(40, 40, 68);
          border-radius: 14px;
          border: 1px solid rgb(144, 166, 235);
          overflow: hidden;
          z-index: 1000;
      }
      .mooket_item{
        padding: 4px 0;
        display: flex;
        justify-content: space-between;
      }
      .mooket_item:hover{
        background: #4a4c7fff;
      }
      .mooket_item ~ .mooket_item{
        border-top: 1px solid #ccc
      }
    `;
    document.head.appendChild(style);

    let taskBox = document.createElement('div');
    taskBox.className = 'lzl-mooket-list-container';
    taskBox.id = 'lzlMooketDraggableWindow';
    taskBox.innerHTML = `
      <div id="lzlMooketDragHandle" style="background-color: #4357af; color: white; padding: 5px; cursor: move;" title="mooket列表价格基数修改"><input type="button" value="👁" title="切换显示模式" style="cursor: pointer; padding: 0px 3px; font-size: 12px; display: inline-block;border-radius: 50%;"></div>
      <div id="lzlMooketListBox" style="padding: 10px;display: ${{visible: 'block', hidden: 'none'}[pConfig.viewType]};max-height: 460px;overflow: auto;color: #ccc;">-暂无收藏商品-</div>
      `;
    document.body.appendChild(taskBox);

    const draggableWindow = document.getElementById('lzlMooketDraggableWindow');
    const dragHandle = document.getElementById('lzlMooketDragHandle');
    const lzlMooketListBox = document.getElementById('lzlMooketListBox');

    dragHandle.children[0].addEventListener('click', (e) => {
      if (pConfig.viewType === 'visible') {
        pConfig.viewType = 'hidden'
        lzlMooketListBox.style.display = 'none';
        draggableWindow.style.width = '36px'
      } else {
        pConfig.viewType = 'visible'
        lzlMooketListBox.style.display = 'block';
        draggableWindow.style.width = '560px'
      }
    })
    
    // ---拖拽事件---
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - draggableWindow.offsetLeft;
      offsetY = e.clientY - draggableWindow.offsetTop;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      draggableWindow.style.left = (e.clientX - offsetX) + 'px';
      draggableWindow.style.top = (e.clientY - offsetY) + 'px';
      pConfig.dialogPosition = {
        left: draggableWindow.style.left,
        top: draggableWindow.style.top,
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    document.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    // ------
    
    window.lzlmooketInputChange = (name, type, event) => {
      let configObj = JSON.parse(localStorage.getItem("mooket_config"));
      let listData = configObj.favo || {};
      configObj.favo[name][type] = Number(event.target.value || 0);
      configObj.favo[name]['time'] = parseInt(Date.now() / 1000);
      localStorage.setItem("mooket_config", JSON.stringify(configObj));
      // TODO 自动刷新计算,看到的大佬可以帮忙补充一下，不修改mooket插件的前提下暂未找到合适的方法来刷新mooket列表
      // updateFavo()
      // sendFavo()
    }
    let listbox = document.getElementById('lzlMooketListBox');
    function updatemooektlist() {
      let configStr = localStorage.getItem("mooket_config");
      let configObj = JSON.parse(configStr)
      let listData = configObj.favo || {};
      let htmlstr = Object.entries(listData).reduce((pre, cur) => {
        let [itemHrid, level] = cur[0].split(":");
        let iconName = itemHrid.split("/")[2];
        let itemName = window.mwi.isZh ? window.mwi.lang.zh.translation.itemNames[itemHrid] : window.mwi.lang.en.translation.itemNames[itemHrid];
        return pre + `<div style="color: #ccc" class="mooket_item">
            <div>
              <svg width="15px" height="15px" style="display:inline-block"><use href="/static/media/items_sprite.6d12eb9d.svg#${iconName}"></use></svg>
              <span>${itemName}${level > 0 ? `(+${level})` : ""}</span>
            </div>
            <div>
              <span style="color: #59d0b9">购</span>
              <input style="width: 140px" type="number" name="${cur[0]}ask" value="${cur[1].ask}" oninput="lzlmooketInputChange('${cur[0]}', 'ask', event)"/>
              <span style="color: #e38289">售</span>
              <input style="width: 140px" type="number" name="${cur[0]}bid" value="${cur[1].bid}" oninput="lzlmooketInputChange('${cur[0]}', 'bid', event)"/>
            </div>
          </div>
        `
      }, "")
      listbox.innerHTML = htmlstr;
    }
})();