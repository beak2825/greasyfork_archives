// ==UserScript==
// @name         pingcode 特性故事点统计
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  计算pingcode特性列表页面中的故事点总数，监听特定API返回的故事点
// @author       LW
// @match        *://*.pingcode.com/*
// @require https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @license MIT
// @grant        none
// @note         0.2 增加图钉功能
// @note         0.3 支持史诗故事点统计
// @downloadURL https://update.greasyfork.org/scripts/535768/pingcode%20%E7%89%B9%E6%80%A7%E6%95%85%E4%BA%8B%E7%82%B9%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/535768/pingcode%20%E7%89%B9%E6%80%A7%E6%95%85%E4%BA%8B%E7%82%B9%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  let container = null;

  // === Storage操作函数 ===
  function setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('无法写入localStorage:', e);
    }
  }

  function getStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('无法读取localStorage:', e);
      return null;
    }
  }

  function removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('无法删除localStorage:', e);
    }
  }

  // === 图钉状态管理 ===
  const PIN_STORAGE_KEY = 'story_points_calculator_pinned';
  
  function isPinned() {
    return getStorage(PIN_STORAGE_KEY) === 'true';
  }

  function setPinned(pinned) {
    if (pinned) {
      setStorage(PIN_STORAGE_KEY, 'true');
    } else {
      removeStorage(PIN_STORAGE_KEY);
    }
  }

  // === 自动销毁相关 ===
  let autoRemoveTimer = null;
  function startAutoRemoveTimer() {
    // 如果已固定，则不启动自动销毁定时器
    if (isPinned()) {
      return;
    }
    
    clearAutoRemoveTimer();
    autoRemoveTimer = setTimeout(() => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
        container = null;
      }
      removeAutoRemoveListeners();
    }, 10000);
  }
  function clearAutoRemoveTimer() {
    if (autoRemoveTimer) {
      clearTimeout(autoRemoveTimer);
      autoRemoveTimer = null;
    }
  }
  function onMouseEnter() {
    clearAutoRemoveTimer();
  }
  function onMouseLeave() {
    startAutoRemoveTimer();
  }
  function removeAutoRemoveListeners() {
    container && container.removeEventListener('mouseenter', onMouseEnter);
    container && container.removeEventListener('mouseleave', onMouseLeave);
  }
  // === 自动销毁相关 END ===

  function getContainer() {
    startAutoRemoveTimer();
    if (container) {
      return container;
    }

    let originalStyles = {}; // 保存原始样式

    if (container) {
      return container;
    } else {
      container = document.createElement('div');
      container.id = 'story-points-container';
      document.body.appendChild(container);
    }

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // 保存原始样式以便展开时恢复
    originalStyles = {
      position: 'fixed',
      top: '80px',
      left: '60px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      borderRadius: '5px',
      zIndex: '9999',
      fontWeight: 'bold',
      padding: '10px',
      width: container.style.width || 'auto', // 初始宽度
      height: container.style.height || 'auto', // 初始高度
      overflow: 'visible', // 初始 overflow
      cursor: 'grab',
    };

    // 应用初始/展开样式
    Object.assign(container.style, originalStyles);
    // 拖动功能
    let offsetX,
      offsetY,
      isDragging = false;

    container.addEventListener('mousedown', (e) => {
      // 只允许在未收缩时，或收缩时点击非内容区域（这里整个球体都可拖动）开始拖动
      // 如果有特定的拖动把手，判断逻辑会不同
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none'; // 防止拖动时选中文本

      // 确保在document上监听move和up，这样鼠标移出元素也能继续拖动
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault(); // 防止默认的拖动行为，如图片或链接
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // 边界检测 (可选)
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      newX = Math.max(0, Math.min(newX, viewportWidth - containerWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - containerHeight));

      container.style.left = `${newX}px`;
      container.style.top = `${newY}px`;
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = originalStyles.cursor || 'grab'; // 恢复光标
      container.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    if (
      document.querySelector('#story-points-container') &&
      document.querySelector('#story-points-container')._alreadyEnhanced
    ) {
      // 如果已经存在并且已经增强过了，直接返回
      return document.querySelector('#story-points-container');
    }

    // 标记为已增强
    container._alreadyEnhanced = true;

    // 添加图钉按钮
    const pinBtn = document.createElement('span');
    pinBtn.innerText = '📌';
    pinBtn.title = isPinned() ? '取消固定' : '固定显示';
    Object.assign(pinBtn.style, {
      position: 'absolute',
      top: '-8px',
      right: '16px',
      fontSize: '16px',
      color: '#fff',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      lineHeight: '24px',
      textAlign: 'center',
      cursor: 'pointer',
      zIndex: '10000',
      transition: 'all 0.2s',
      userSelect: 'none',
      fontSize: '14px',
      lineHeight: '24px',
      background: isPinned() ? 'rgba(0,123,255,0.7)' : 'rgba(0,0,0,0.7)',
    });
    
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentPinned = isPinned();
      const newPinned = !currentPinned;
      
      // 更新图钉状态
      setPinned(newPinned);
      
      // 更新按钮外观
      pinBtn.style.background = newPinned ? 'rgba(0,123,255,0.7)' : 'rgba(0,0,0,0.7)';
      pinBtn.title = newPinned ? '取消固定' : '固定显示';

      if (newPinned) {
        // 固定时清除自动销毁定时器
        clearAutoRemoveTimer();
      } else {
        // 取消固定时重新启动自动销毁定时器
        startAutoRemoveTimer();
      }
    });
    
    container.appendChild(pinBtn);

    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.innerText = '×';
    closeBtn.title = '关闭';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '-8px',
      right: '-10px',
      fontSize: '20px',
      color: '#fff',
      background: 'rgba(0,0,0,0.7)',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      lineHeight: 1,
      textAlign: 'center',
      cursor: 'pointer',
      zIndex: '10000',
      transition: 'background 0.2s',
      userSelect: 'none',
    });
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255,0,0,0.7)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(0,0,0,0.7)';
    });
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
        container = null;
      }
      removeAutoRemoveListeners();
    });
    container.appendChild(closeBtn);

    return container;
  }

  function createTabItem(omsId, item, parentDom) {
    const activeKey = parentDom.dataset.activeKey || 'member';
    const fullOmsId = `OMS-${omsId}`;
    const dom = document.createElement('div');
    dom.setAttribute('data-oms-id', fullOmsId);
    dom.style.marginBottom = '10px';
    dom.style.fontSize = '14px';
    dom.style.color = '#fff';

    const createTabItemDom = (text, key) => {
      const tabItemDom = document.createElement('div');
      tabItemDom.style.padding = '0 16px';
      tabItemDom.style.height = '36px';
      tabItemDom.style.display = 'flex';
      tabItemDom.style.alignItems = 'center';
      tabItemDom.style.cursor = 'pointer';
      tabItemDom.style.fontSize = '13px';
      tabItemDom.style.background = 'transparent';
      tabItemDom.style.border = 'none';
      tabItemDom.style.position = 'relative';
      tabItemDom.style.transition = 'color 0.2s';
      tabItemDom.style.fontWeight = activeKey === key ? 'bold' : 'normal';
      tabItemDom.style.color = activeKey === key ? '#1677ff' : '#ccc';
      tabItemDom.setAttribute('data-key', key);
      tabItemDom.setAttribute('data-active', activeKey === key);
      tabItemDom.className = 'spc-tab-item';
      tabItemDom.appendChild(document.createTextNode(text));
      // 指示条
      const indicator = document.createElement('div');
      indicator.style.position = 'absolute';
      indicator.style.left = '8px';
      indicator.style.right = '8px';
      indicator.style.bottom = '0';
      indicator.style.height = activeKey === key ? '3px' : '0';
      indicator.style.background = activeKey === key ? '#1677ff' : 'transparent';
      indicator.style.borderRadius = '2px';
      indicator.style.transition = 'all 0.2s';
      tabItemDom.appendChild(indicator);
      tabItemDom.addEventListener('mouseenter', () => {
        if (tabItemDom.dataset.active !== 'true') {
          tabItemDom.style.color = '#1677ff';
        }
      });
      tabItemDom.addEventListener('mouseleave', () => {
        if (tabItemDom.dataset.active !== 'true') {
          tabItemDom.style.color = '#ccc';
        }
      });
      
      tabItemDom.addEventListener('click', () => {
        parentDom.dataset.activeKey = key;
        parentDom.querySelectorAll('.tab-content-dom').forEach(item => {
          item.style.display = 'none';
        })
        parentDom.querySelectorAll('.spc-tab-item').forEach(tab => {
          tab.style.color = '#ccc';
          tab.style.fontWeight = 'normal';
          tab.dataset.active = 'false';
          if (tab.lastChild) {
            tab.lastChild.style.height = '0';
            tab.lastChild.style.background = 'transparent';
          }
        });
        tabItemDom.style.color = '#1677ff';
        tabItemDom.style.fontWeight = 'bold';
        indicator.style.height = '2px';
        indicator.style.background = '#1677ff';
        tabItemDom.dataset.active = 'true';
        parentDom.querySelector(`[data-content-key="${key}"]`).style.display = 'block';
      })
      return tabItemDom;
    }

    const createContentDom = (key, map) => {
      const contentDom = document.createElement('div');
      contentDom.setAttribute('data-content-key', key);
      contentDom.classList.add('tab-content-dom');
      contentDom.style.display = key === activeKey ? 'block' : 'none';
      contentDom.style.padding = '5px 5px 5px 10px';
      contentDom.style.marginTop = '-2px';
      contentDom.style.minHeight = '36px';
      let isFirst = true;
      map.forEach((value, key) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.padding = '6px 0';
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.borderTop = isFirst ? 'none' : '1px solid rgba(255,255,255,0.08)';
        itemDiv.textContent = `${key} : ${value.total}`;
        contentDom.appendChild(itemDiv);
        isFirst = false;
      })
      return contentDom;
    }

    const tabItems = [
      {
        text: '负责人',
        key: 'member',
        content: item.calcForMember,
        tabDom: createTabItemDom('负责人', 'member'),
        contentDom: createContentDom('member', item.calcForMember),
      },
      {
        text: '故事类型',
        key: 'storyType',
        content: item.calcForStoryType,
        tabDom: createTabItemDom('故事类型', 'storyType'),
        contentDom: createContentDom('storyType', item.calcForStoryType),
      },
      {
        text: '状态',
        key: 'state',
        content: item.calcForState,
        tabDom: createTabItemDom('状态', 'state'),
        contentDom: createContentDom('state', item.calcForState),
      },
    ]

    const tabsDom = document.createElement('div');
    tabsDom.style.display = 'flex';
    tabsDom.style.alignItems = 'center';
    tabsDom.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    tabsDom.style.marginBottom = '0px';
    tabsDom.style.paddingBottom = '0px';
    tabsDom.style.gap = '0px';
    tabsDom.style.background = 'transparent';
    tabItems.forEach(item => {
      tabsDom.appendChild(item.tabDom);
    })

    dom.appendChild(tabsDom);

    const contentDom = document.createElement('div');
    tabItems.forEach(item => {
      contentDom.appendChild(item.contentDom);
    })

    dom.appendChild(contentDom);

    const activeContentDom = parentDom.querySelector(`[data-content-key="${activeKey}"]`);
    if (activeContentDom) {
      activeContentDom.style.display = 'block';
    }

    return dom;
  }

  function calcStoryPointsArray(data) {
    // 按人计算故事点
    // 按故事类型计算故事点
    // 按状态
  
    const getItemMemberName = (item) => {
      const member = data?.references?.members?.find(m => m.uid === item.assignee);
      return member?.display_name || '-';
    }
  
    const getItemStateName = (item) => {
      const state = data?.references?.states?.find(s => s._id === item.state_id);
      return state?.name || '-';
    }
  
    const getItemStoryTypeName = (item) => {
      const gushileixingType = data?.references?.properties?.find(t => t.key === 'gushileixing');
      const storyType = gushileixingType?.options?.find(s => s._id === item.properties.gushileixing);
      return storyType?.text || '-';
    }
  
    const getValues = data.value.map(item => {
      return {
        source: item.source,
        __story_points: item.properties.story_points,
        __memberName: getItemMemberName(item),
        __stateName: getItemStateName(item),
        __storyTypeName: getItemStoryTypeName(item),
      }
    })
  
    // return getValues;
  
    const calcForKey = (key) => {
      const map = new Map();
      getValues.forEach(item => {
        const value = item[key];
        const next = map.get(value);
  
        map.set(value, {
          total: (next?.total || 0) + item.__story_points,
          source: [...(next?.source || []), item.source],
        });
      });
      return map;
    }
  
    const calcForMember = calcForKey('__memberName');
    const calcForStoryType = calcForKey('__storyTypeName');
    const calcForState = calcForKey('__stateName');
    
    return {
      total: getValues.reduce((acc, item) => acc + (item.__story_points || 0), 0),
      calcForMember,
      calcForStoryType,
      calcForState,
    }
  }

  // 公共方法：为指定父节点和内容节点添加折叠/展开按钮，返回按钮节点
  function addCollapseToggle(headerDom, contentDom) {
    const btn = document.createElement('span');
    btn.style.cursor = 'pointer';
    btn.style.padding = '2px 4px 2px 8px';
    btn.style.userSelect = 'none';
    btn.style.fontSize = '12px';
    btn.style.display = 'inline-block';
    btn.style.transition = 'transform 0.2s';
    btn.style.alignSelf = 'flex-start'; // 可选：居左/居中
    btn.innerText = '\u25B6'; // ▶ ▼
    btn.dataset.collapsed = false;

    const innerHeaderDom = document.createElement('div');
    innerHeaderDom.appendChild(headerDom);
    innerHeaderDom.appendChild(btn);
    innerHeaderDom.style.display = 'flex';
    innerHeaderDom.style.alignItems = 'center';
    innerHeaderDom.style.justifyContent = 'space-between';

    const innerContentDom = document.createElement('div');
    innerContentDom.appendChild(contentDom);
    innerContentDom.style.overflow = 'hidden';
    innerContentDom.style.height = '0';

    btn.addEventListener('click', () => {
      let collapsed = btn.dataset.collapsed === 'true';
      collapsed = !collapsed;
      
      if (!collapsed) {
        innerContentDom.style.height = '0';
        btn.innerText = '\u25B6';
      } else {
        innerContentDom.style.height = 'auto';
        btn.innerText = '\u25BC';
      }

      btn.dataset.collapsed = collapsed;
    });

    const dom = document.createElement('div');
    dom.appendChild(innerHeaderDom);
    dom.appendChild(innerContentDom);
    return dom;
  }

  function createLinkDom(shortId, name, title) {
    const linkDom = document.createElement('a');
    linkDom.href = `${window.location.origin}/pjm/workitems/${shortId}`;
    linkDom.target = '_blank';
    linkDom.textContent = name;
    linkDom.style.color = '#1677ff';
    linkDom.title = title;
    return linkDom;
  }

  // 获取工作项的子项数据
  function getWorkItemChildren(workItemId) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${window.location.origin}/api/agile/work-items/${workItemId}/children?t=${Date.now()}`;
      
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({ data: response });
            } catch (e) {
              reject(new Error('解析响应数据失败: ' + e.message));
            }
          } else {
            reject(new Error(`请求失败，状态码: ${xhr.status}`));
          }
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('网络请求失败'));
      };
      
      xhr.send();
    });
  }

  async function createDialog(omsId, value) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    // 创建弹框容器
    const dialog = document.createElement('div');
    dialog.style.backgroundColor = '#1e1e1e';
    dialog.style.borderRadius = '8px';
    dialog.style.padding = '24px';
    dialog.style.minWidth = '500px';
    dialog.style.maxWidth = '800px';
    dialog.style.maxHeight = '80vh';
    dialog.style.overflow = 'auto';
    dialog.style.position = 'relative';
    dialog.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.5)';

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '故事点统计详情';
    title.style.color = '#fff';
    title.style.margin = '0 0 20px 0';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    dialog.appendChild(title);

    // 创建关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.innerText = '×';
    closeBtn.title = '关闭';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '16px',
      right: '16px',
      fontSize: '28px',
      color: '#fff',
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      textAlign: 'center',
      transition: 'color 0.2s',
      userSelect: 'none',
    });
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.color = '#ff4d4f';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.color = '#fff';
    });
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    dialog.appendChild(closeBtn);

    // 创建加载提示
    const loading = document.createElement('div');
    loading.style.color = '#fff';
    loading.style.textAlign = 'center';
    loading.style.padding = '40px';
    loading.style.fontSize = '16px';
    loading.textContent = '正在加载数据...';
    dialog.appendChild(loading);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 点击遮罩层关闭弹框
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    // 异步加载子项数据
    try {
      const childrenPromises = value.map(item => {
        const id = item._id;
        return getWorkItemChildren(id)
          .then(childData => {
            console.log(`工作项 ${item.short_id} 的子项数据:`, childData);
            return {
              parentItem: item,
              children: childData.data
            };
          })
          .catch(error => {
            console.error(`获取工作项 ${item.short_id} 的子项失败:`, error);
            return null;
          });
      });

      const results = await Promise.all(childrenPromises);
      const successResults = results.filter(r => r !== null);

      // 移除加载提示
      dialog.removeChild(loading);

      // 合并所有子项数据进行统计
      const allChildrenData = {
        value: [],
        references: {
          members: [],
          states: [],
          properties: []
        }
      };
      
      // 收集所有子项数据
      successResults.forEach(result => {
        if (result.children?.data?.value) {
          allChildrenData.value.push(...result.children.data.value);
          
          // 合并references（去重）
          if (result.children.data.references?.members) {
            const existingMemberIds = new Set(allChildrenData.references.members.map(m => m.uid));
            result.children.data.references.members.forEach(member => {
              if (!existingMemberIds.has(member.uid)) {
                allChildrenData.references.members.push(member);
                existingMemberIds.add(member.uid);
              }
            });
          }
          
          if (result.children.data.references?.states) {
            const existingStateIds = new Set(allChildrenData.references.states.map(s => s._id));
            result.children.data.references.states.forEach(state => {
              if (!existingStateIds.has(state._id)) {
                allChildrenData.references.states.push(state);
                existingStateIds.add(state._id);
              }
            });
          }
          
          if (result.children.data.references?.properties) {
            const existingPropKeys = new Set(allChildrenData.references.properties.map(p => p.key));
            result.children.data.references.properties.forEach(prop => {
              if (!existingPropKeys.has(prop.key)) {
                allChildrenData.references.properties.push(prop);
                existingPropKeys.add(prop.key);
              }
            });
          }
        }
      });
      
      // 计算统计数据
      const statsInfo = calcStoryPointsArray(allChildrenData);

      // 创建总计显示
      const totalDiv = document.createElement('div');
      totalDiv.style.backgroundColor = 'rgba(22, 119, 255, 0.1)';
      totalDiv.style.padding = '16px';
      totalDiv.style.borderRadius = '6px';
      totalDiv.style.marginBottom = '20px';
      totalDiv.style.border = '1px solid rgba(22, 119, 255, 0.3)';
      
      const totalText = document.createElement('div');
      totalText.style.fontSize = '16px';
      totalText.style.color = '#fff';
      totalText.innerHTML = `<strong>故事点总计：</strong><span style="color: #1677ff; font-size: 24px; font-weight: bold;">${statsInfo.total}</span>`;
      totalDiv.appendChild(totalText);
      
      const countText = document.createElement('span');
      countText.style.fontSize = '14px';
      countText.style.color = '#ccc';
      countText.style.marginTop = '8px';
      countText.style.paddingLeft = '8px';
      countText.textContent = `共 ${allChildrenData.value.length} 个子项`;
      totalText.appendChild(countText);
      
      dialog.appendChild(totalDiv);

      // 创建内容容器（用于Tab切换）
      const contentContainer = document.createElement('div');
      contentContainer.dataset.activeKey = 'member';
      dialog.appendChild(contentContainer);

      // 创建Tab切换组件
      const createTabSwitch = () => {
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.borderBottom = '2px solid rgba(255,255,255,0.1)';
        tabContainer.style.marginBottom = '16px';
        tabContainer.style.gap = '0';

        const tabs = [
          { key: 'member', label: '负责人', data: statsInfo.calcForMember },
          { key: 'storyType', label: '故事类型', data: statsInfo.calcForStoryType },
          { key: 'state', label: '状态', data: statsInfo.calcForState }
        ];

        tabs.forEach(tab => {
          const tabBtn = document.createElement('div');
          tabBtn.style.padding = '12px 24px';
          tabBtn.style.cursor = 'pointer';
          tabBtn.style.color = contentContainer.dataset.activeKey === tab.key ? '#1677ff' : '#ccc';
          tabBtn.style.fontWeight = contentContainer.dataset.activeKey === tab.key ? 'bold' : 'normal';
          tabBtn.style.borderBottom = contentContainer.dataset.activeKey === tab.key ? '2px solid #1677ff' : '2px solid transparent';
          tabBtn.style.marginBottom = '-2px';
          tabBtn.style.transition = 'all 0.2s';
          tabBtn.style.userSelect = 'none';
          tabBtn.textContent = tab.label;
          tabBtn.dataset.key = tab.key;

          tabBtn.addEventListener('mouseenter', () => {
            if (contentContainer.dataset.activeKey !== tab.key) {
              tabBtn.style.color = '#1677ff';
            }
          });

          tabBtn.addEventListener('mouseleave', () => {
            if (contentContainer.dataset.activeKey !== tab.key) {
              tabBtn.style.color = '#ccc';
            }
          });

          tabBtn.addEventListener('click', () => {
            contentContainer.dataset.activeKey = tab.key;
            // 更新所有tab样式
            tabContainer.querySelectorAll('div').forEach(t => {
              const isActive = t.dataset.key === tab.key;
              t.style.color = isActive ? '#1677ff' : '#ccc';
              t.style.fontWeight = isActive ? 'bold' : 'normal';
              t.style.borderBottom = isActive ? '2px solid #1677ff' : '2px solid transparent';
            });
            // 切换内容显示
            contentContainer.querySelectorAll('[data-content-type]').forEach(content => {
              content.style.display = content.dataset.contentType === tab.key ? 'block' : 'none';
            });
          });

          tabContainer.appendChild(tabBtn);
        });

        return tabContainer;
      };

      contentContainer.appendChild(createTabSwitch());

      // 创建内容区域
      const createContentArea = (key, dataMap) => {
        const contentDiv = document.createElement('div');
        contentDiv.dataset.contentType = key;
        contentDiv.style.display = key === 'member' ? 'block' : 'none';

        if (dataMap.size === 0) {
          contentDiv.style.color = '#999';
          contentDiv.style.textAlign = 'center';
          contentDiv.style.padding = '40px';
          contentDiv.textContent = '暂无数据';
          return contentDiv;
        }

        // 转换为数组并排序
        const sortedData = Array.from(dataMap.entries()).sort((a, b) => b[1].total - a[1].total);

        sortedData.forEach(([name, info], index) => {
          const itemDiv = document.createElement('div');
          itemDiv.style.display = 'flex';
          itemDiv.style.justifyContent = 'space-between';
          itemDiv.style.alignItems = 'center';
          itemDiv.style.padding = '12px 16px';
          itemDiv.style.borderBottom = index < sortedData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none';
          itemDiv.style.transition = 'background 0.2s';

          itemDiv.addEventListener('mouseenter', () => {
            itemDiv.style.backgroundColor = 'rgba(255,255,255,0.05)';
          });

          itemDiv.addEventListener('mouseleave', () => {
            itemDiv.style.backgroundColor = 'transparent';
          });

          const nameSpan = document.createElement('span');
          nameSpan.style.color = '#fff';
          nameSpan.style.fontSize = '14px';
          nameSpan.textContent = name;

          const valueSpan = document.createElement('span');
          valueSpan.style.color = '#1677ff';
          valueSpan.style.fontSize = '16px';
          valueSpan.style.fontWeight = 'bold';
          valueSpan.textContent = info.total;

          itemDiv.appendChild(nameSpan);
          itemDiv.appendChild(valueSpan);
          contentDiv.appendChild(itemDiv);
        });

        return contentDiv;
      };

      contentContainer.appendChild(createContentArea('member', statsInfo.calcForMember));
      contentContainer.appendChild(createContentArea('storyType', statsInfo.calcForStoryType));
      contentContainer.appendChild(createContentArea('state', statsInfo.calcForState));

    } catch (error) {
      console.error('加载数据失败:', error);
      dialog.removeChild(loading);
      
      const errorDiv = document.createElement('div');
      errorDiv.style.color = '#ff4d4f';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.padding = '40px';
      errorDiv.style.fontSize = '16px';
      errorDiv.textContent = '加载数据失败，请重试';
      dialog.appendChild(errorDiv);
    }
  }
  
  const matchUrls = [
    {
      url: '/sprint/views/work-item/content',
      callback: (response) => {
        // const total = calculateStoryPoints(response.data);
        // console.log('故事点总和:', total);
        // const info = {
        //   total,
        //   count: response.data.count,
        //   sprint: response.data.references?.sprints?.[0]?.name,
        // };
        // updateStoryPointsDisplay(info);
      },
    },
    {
      url: '/api/agile/work-items/[^/.]+$',
      callback: (response) => {
        const omsId = response.data.value?.identifier;
        const omsType = response.data.value?.type;
        const id = response.data.value?._id        ;

        if (omsType === 1) {
          id && getWorkItemChildren(id);
        }
        
      },
    },
    {
      url: '/api/agile/work-items/.+/children',
      callback: (response) => {
        const info = calcStoryPointsArray(response.data);
        const total = info.total;
        const parentShortId = response.data.references?.parents?.[0]?.short_id;
        const parentTitle = response.data.references?.parents?.[0]?.title;
        const omsId = response.data.references?.parents?.[0]?.identifier;
        const omsType = response.data.references?.parents?.[0]?.type;

        // 特性
        if (omsType === 1) {
          const createShowAllButton = () => {
            const span = document.createElement('span');
            span.innerText = '计算';
            span.setAttribute('id', 'show-all-btn');
            span.style.cursor = 'pointer';
            span.style.marginRight = '10px';
            span.style.color = '#1677ff';
            span.style.fontWeight = 'bold';
            span.style.transition = 'opacity 0.2s';
            
            // 绑定点击事件
            span.addEventListener('click', async (e) => {
              e.preventDefault();
              e.stopPropagation();

              const value = response.data.value;
              createDialog(omsId, value);
            });
            
            return span;
          };

          // 使用持久化管理器插入按钮
          // 找到样式为 .cursor-pointer 且文本内容为omsId的元素
          
          // 使用自定义检查函数查找包含omsId文本的.cursor-pointer元素
          elmGetter.each('.link-major > .cursor-pointer', document, (element) => {
            // 检查元素的文本内容是否包含omsId
            if (element.textContent?.includes(omsId)) {
              const parent = element.parentElement.parentElement;
              const existingBtn = parent.querySelector('#show-all-btn');
              if (!existingBtn) {
                parent.insertBefore(createShowAllButton(), parent.firstChild);
              }
            }
          });
          return;
        }

        // 只支持特性
        if (omsType !== 2) {
          return;
        }

        const fullOmsId = `OMS-${omsId}`;
        const container = getContainer();

        // 先尝试移除已有的相同ID的子项，避免重复
        const existingChildDom = container.querySelector(
          `div[data-oms-id="${fullOmsId}"]`,
        );
        const dom = document.createElement('div');
        dom.setAttribute('data-oms-id', fullOmsId);
        dom.style.display = 'flex';
        dom.style.flexDirection = 'column';
        dom.style.alignItems = 'stretch';
        // 创建标题和内容分离结构
        const header = document.createElement('div');
        const linkDom = createLinkDom(parentShortId, fullOmsId, parentTitle);
        header.appendChild(linkDom);
        header.appendChild(document.createTextNode(` 故事点总和: ${total}`));
        header.style.flex = '1';
        dom.appendChild(header);
        const tabContent = createTabItem(omsId, info, dom);
        // 创建折叠按钮，插入到 header 下方
        const collapseBtn = addCollapseToggle(header, tabContent);
        dom.appendChild(collapseBtn);

        if (existingChildDom) {
          existingChildDom.replaceWith(dom);
        } else {
          container.insertBefore(dom, container.firstChild);
        }
      },
    },
  ];

  // 拦截XHR请求
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function () {
    this._url = arguments[1];
    return originalXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    const matchUrl = matchUrls.find((item) =>
      new RegExp(item.url).test(this._url),
    );

    if (matchUrl) {
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          try {
            const response = JSON.parse(this.responseText);
            setTimeout(() => {
              matchUrl.callback(response);
            }, 500);
          } catch (e) {
            console.error('解析故事点数据时出错:', e);
          }
        }
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }
    return originalXHRSend.apply(this, arguments);
  };
})();
