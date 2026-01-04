// ==UserScript==
// @name         GitHub发布平台筛选器
// @name:en      GitHub Release Platform Filter
// @namespace    https://github.com/eecopilot
// @version      0.3.3
// @description  筛选GitHub发布资源的平台，优化发布说明显示
// @description:en  Filter GitHub release assets by platform and optimize release notes display
// @author       EEP
// @match        https://github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepage     https://github.com/eecopilot/github-release-platform-filter
// @supportURL   https://github.com/eecopilot/github-release-platform-filter/issues
// @downloadURL https://update.greasyfork.org/scripts/526966/GitHub%E5%8F%91%E5%B8%83%E5%B9%B3%E5%8F%B0%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526966/GitHub%E5%8F%91%E5%B8%83%E5%B9%B3%E5%8F%B0%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener('click', (e) => {
    const summary = e.target.closest(
      '[data-target="details-toggle.summaryTarget"]'
    );
    if (summary) {
      // 当aria-label="Expand"，表示assets没有加载资源
      // 点击后，assets加载资源
      if (summary.getAttribute('aria-label') !== 'Expand') {
        // 监听assets列表的变化
        const assetsContainer = summary.nextElementSibling;
        if (
          assetsContainer &&
          assetsContainer.getAttribute('data-view-component') === 'true'
        ) {
          const observer = new MutationObserver((mutations) => {
            // 当assets列表加载完成后进行过滤
            filterAssets(assetsContainer);
          });

          observer.observe(assetsContainer, {
            childList: true,
            subtree: true,
          });
        }
      }
    }
  });
  // 样式定义
  const styles = `
        .markdown-body.my-3 {
            position: relative;
            max-height: 300px;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
            padding-bottom: 40px;
        }
        .markdown-body.my-3.expanded {
            max-height: none;
            padding-bottom: 40px;
        }
        .toggle-button {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            padding: 10px;
            cursor: pointer;
            color: #0366d6;
            font-weight: 600;
            width: 100%;
            margin: 0;
            height: 40px;
            box-sizing: border-box;
            background: none;
        }
        .markdown-body.my-3:not(.expanded) .toggle-button {
            background: linear-gradient(rgba(255, 255, 255, 0), rgb(202 202 202));
        }
        .markdown-body.my-3.expanded .toggle-button {
            border-top: 1px solid #e1e4e8;
        }
        .toggle-button:hover {
            text-decoration: underline;
        }
        .platform-filter {
            position: fixed;
            top: 60px;
            right: -1px;
            z-index: 1000;
            background: white;
            border-radius: 6px 0 0 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            transition: all 0.2s ease;
            overflow: visible;
        }
        .platform-filter:hover {
            right: 0;
        }
        .platform-filter-button {
            padding: 8px;
            border: 1px solid #d1d5da;
            border-right: 0;
            border-radius: 6px 0 0 6px;
            background-color: #f6f8fa;
            color: #24292e;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s ease;
            min-width: 36px;
            margin-right: -1px;
        }
        .platform-filter-button span {
            width: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.2s ease;
        }
        .platform-filter:hover .platform-filter-button {
            padding: 8px 12px;
        }
        .platform-filter:hover .platform-filter-button span {
            width: auto;
            opacity: 1;
            margin-left: 4px;
        }
        .platform-filter-button:hover {
            background-color: #f3f4f6;
            border-color: #bbb;
        }
        .platform-filter-button svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }
        .platform-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(149,157,165,0.2);
            display: none;
            min-width: 120px;
            z-index: 100;
        }
        .platform-dropdown.show {
            display: block;
        }
        .platform-option {
            padding: 8px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        .platform-option:hover {
            background-color: #f6f8fa;
        }
        .platform-option.selected {
            background-color: #f1f8ff;
            color: #0366d6;
        }
        .platform-option:first-child {
            border-radius: 6px 6px 0 0;
        }
        .platform-option:last-child {
            border-radius: 0 0 6px 6px;
        }
        .platform-option svg {
            width: 16px;
            height: 16px;
        }
        .hidden-asset {
            display: none !important;
        }
        .Box-row.d-flex.flex-column.flex-md-row.hidden-asset {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 0 !important;
        }
    `;

  // 添加SVG图标
  const ICONS = {
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>`,
  };

  function initFeaturesPanels() {
    const panels = document.querySelectorAll('.markdown-body.my-3');

    panels.forEach((panel) => {
      // 检查内容高度是否需要添加展开/收起功能
      if (panel.scrollHeight > 300) {
        // 检查是否已经存在按钮
        let toggleButton = panel.querySelector('.toggle-button');

        if (!toggleButton) {
          // 如果不存在按钮，则创建新按钮
          toggleButton = document.createElement('div');
          toggleButton.className = 'toggle-button';
          panel.appendChild(toggleButton);
        }

        // 根据当前状态设置按钮文本
        const isExpanded = panel.classList.contains('expanded');
        toggleButton.textContent = isExpanded ? '收起' : '展开更多';

        // 更新或添加点击事件
        toggleButton.onclick = () => {
          const isExpanded = panel.classList.contains('expanded');
          panel.classList.toggle('expanded');
          toggleButton.textContent = !isExpanded ? '收起' : '展开更多';
          if (!isExpanded) {
            panel.scrollIntoView({ behavior: 'smooth' });
          }
        };
      }
    });
  }

  // 监听页面变化，确保在动态加载的内容上也能生效
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const hasMarkdownBody = Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === 1 &&
            (node.classList?.contains('markdown-body') ||
              node.querySelector?.('.markdown-body'))
        );
        if (hasMarkdownBody) {
          initFeaturesPanels();
          break;
        }
      }
    }
  });

  // 获取当前系统平台
  function getCurrentPlatform() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    if (platform.includes('win')) return 'windows';
    if (platform.includes('mac')) return 'macos';
    if (platform.includes('linux')) return 'linux';
    if (userAgent.includes('android')) return 'android';
    return 'unknown';
  }

  // 获取当前系统平台
  const currentPlatform = getCurrentPlatform();
  // 获取保存的平台选择，如果没有保存过，则只选中当前平台
  let selectedPlatforms = GM_getValue('selectedPlatforms', null);
  if (selectedPlatforms === null) {
    selectedPlatforms = [currentPlatform];
    GM_setValue('selectedPlatforms', selectedPlatforms);
  }

  // 筛选资源
  function filterAssets(assetsContainer) {
    if (!assetsContainer) {
      return;
    }

    const containerAssets = assetsContainer.querySelectorAll(
      '.Box-row.d-flex.flex-column.flex-md-row'
    );

    // 重置所有资源的显示状态
    containerAssets.forEach((asset) => {
      asset.style.cssText = 'display: flex !important';
      asset.classList.remove('hidden-asset');
    });

    if (selectedPlatforms.length === 0) {
      return;
    }

    containerAssets.forEach((asset) => {
      const assetText = asset.textContent.toLowerCase();
      // 检查是否是特定平台的文件
      const platformMatches = {
        windows: [
          '.exe',
          '.msi',
          'windows',
          'win32',
          'win64',
          '-win.',
          '.win.',
          'windows',
        ],

        macos: [
          '.dmg',
          '.pkg',
          'darwin',
          'macos',
          'osx',
          '-mac.',
          '.mac.',
          'mac-universal',
          'mac-os',
        ],

        linux: [
          '.deb',
          '.rpm',
          '.appimage',
          'linux',
          '-linux.',
          '.linux.',
          'ubuntu',
          'debian',
          'fedora',
          'freebsd',
        ],

        android: ['.apk', '.aab', 'android', '-android.', '.android.'],
      };

      // 检查文件是否属于任何平台
      const matchPlatform = (text, identifiers) => {
        return identifiers.some((id) => text.includes(id.toLowerCase()));
      };

      const matches = Object.entries(platformMatches).reduce(
        (acc, [platform, identifiers]) => {
          acc[platform] = matchPlatform(assetText, identifiers);
          return acc;
        },
        {}
      );

      // 检查文件是否属于任何平台
      const isPlatformSpecific = Object.values(matches).some((match) => match);

      // 检查文件是否匹配任何选中的平台
      const matchesSelectedPlatform = selectedPlatforms.some(
        (platform) => matches[platform]
      );

      // 检查文件是否属于未选中的平台
      const matchesUnselectedPlatform = Object.entries(matches).some(
        ([platform, match]) => match && !selectedPlatforms.includes(platform)
      );

      // 显示条件：
      // 1. 如果是通用文件（不属于任何特定平台），则显示
      // 2. 如果是特定平台文件，则必须匹配选中的平台且不能匹配未选中的平台
      const shouldShow =
        !isPlatformSpecific ||
        (matchesSelectedPlatform && !matchesUnselectedPlatform);

      if (!shouldShow) {
        asset.classList.add('hidden-asset');
        asset.style.cssText = 'display: none !important';
      }
    });

    // 强制重新计算布局
    assetsContainer.style.display = 'none';
    void assetsContainer.offsetHeight;
    assetsContainer.style.display = '';
  }

  // 初始化资源列表筛选
  function initAssetsFilter() {
    const assetsContainer = document.querySelector('.Box--condensed');
    if (!assetsContainer) {
      setTimeout(initAssetsFilter, 100);
      return;
    }

    // 检查是否已经存在筛选器
    if (document.querySelector('.platform-filter')) {
      filterAssets(assetsContainer);
      return;
    }

    // 检查是否有资源列表
    const assetsList = assetsContainer.querySelectorAll(
      '.Box-row.d-flex.flex-column.flex-md-row'
    );
    if (assetsList.length === 0) {
      setTimeout(initAssetsFilter, 100);
      return;
    }

    // 创建一个 MutationObserver 来监听资源列表的变化
    const assetsObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const hasAssets = Array.from(mutation.addedNodes).some(
            (node) => node.nodeType === 1 && node.classList?.contains('Box-row')
          );
          if (hasAssets) {
            filterAssets(assetsContainer);
          }
        }
      }
    });

    // 开始观察资源列表容器
    assetsObserver.observe(assetsContainer, {
      childList: true,
      subtree: true,
    });

    // 创建筛选器容器
    const filterContainer = document.createElement('div');
    filterContainer.className = 'platform-filter';

    // 创建筛选按钮
    const filterButton = document.createElement('button');
    filterButton.className = 'platform-filter-button';
    filterButton.innerHTML = `${ICONS.settings} <span>平台筛选</span>`;

    // 创建下拉菜单
    const dropdown = document.createElement('div');
    dropdown.className = 'platform-dropdown';

    // 添加平台选项
    const platforms = [
      { id: 'windows', name: 'Windows' },
      { id: 'macos', name: 'macOS' },
      { id: 'linux', name: 'Linux' },
      { id: 'android', name: 'Android' },
    ];

    platforms.forEach((platform) => {
      const option = document.createElement('div');
      option.className = `platform-option ${
        selectedPlatforms.includes(platform.id) ? 'selected' : ''
      }`;
      option.textContent = platform.name;
      option.onclick = (e) => {
        e.stopPropagation();
        const index = selectedPlatforms.indexOf(platform.id);
        if (index === -1) {
          selectedPlatforms.push(platform.id);
        } else {
          selectedPlatforms.splice(index, 1);
        }
        option.classList.toggle('selected');

        GM_setValue('selectedPlatforms', selectedPlatforms);
        // 筛选所有资源容器
        const allAssetsContainers =
          document.querySelectorAll('.Box--condensed');
        allAssetsContainers.forEach((container) => {
          filterAssets(container);
        });
      };
      dropdown.appendChild(option);
    });

    // 添加按钮点击事件
    filterButton.onclick = () => {
      dropdown.classList.toggle('show');
    };

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!filterContainer.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    // 组装并添加到页面
    filterContainer.appendChild(filterButton);
    filterContainer.appendChild(dropdown);
    const mainContent = document.querySelector('main');
    const releaseHeader = document.querySelector('.release-header');
    if (releaseHeader) {
      releaseHeader.style.position = 'relative';
      releaseHeader.appendChild(filterContainer);
    } else if (mainContent) {
      mainContent.appendChild(filterContainer);
    } else {
      document.body.appendChild(filterContainer);
    }

    // 初始筛选
    filterAssets(assetsContainer);
  }

  // 添加样式到页面
  function addStyles() {
    if (!document.querySelector('style[data-github-release-filter]')) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-github-release-filter', 'true');
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }

  // 检查是否在releases页面
  function isReleasesPage() {
    return window.location.href.toLowerCase().includes('releases');
  }

  // 等待页面加载完成后再初始化
  function initializeFeatures() {
    if (!isReleasesPage()) {
      return;
    }
    // 确保样式已添加
    if (!document.querySelector('style[data-github-release-filter]')) {
      addStyles();
    }

    // 找到所有的资源容器
    const assetsContainers = document.querySelectorAll('.Box--condensed');

    // 先初始化发布说明功能
    initFeaturesPanels();
    startObserver();

    // 对每个资源容器初始化筛选功能
    assetsContainers.forEach((container) => {
      // 检查容器内是否有资源
      const hasAssets =
        container.querySelectorAll('.Box-row.d-flex.flex-column.flex-md-row')
          .length > 0;
      if (hasAssets) {
        filterAssets(container);
      }
    });

    // 然后初始化资源列表筛选功能
    initAssetsFilter();
  }

  // 检查并初始化功能
  function checkAndInitialize() {
    if (!isReleasesPage()) {
      return;
    }
    // 确保样式已添加
    addStyles();
    // 确保页面已经完全加载
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      // 先初始化发布说明功能
      const markdownContent = document.querySelector('.markdown-body.my-3');
      if (markdownContent) {
        addStyles();
        initFeaturesPanels();
        startObserver();
      }

      // 检查资源列表是否存在
      const releaseContent = document.querySelector('.Box--condensed');
      if (releaseContent) {
        // 确保所有动态内容都已加载
        setTimeout(() => {
          initAssetsFilter();
          // 持续监听可能的动态内容加载
          const contentObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0
              ) {
                const hasMarkdownBody = Array.from(mutation.addedNodes).some(
                  (node) =>
                    node.nodeType === 1 &&
                    (node.classList?.contains('markdown-body') ||
                      node.querySelector?.('.markdown-body'))
                );
                if (hasMarkdownBody) {
                  initFeaturesPanels();
                }
                const hasAssets = Array.from(mutation.addedNodes).some(
                  (node) =>
                    node.nodeType === 1 && node.classList?.contains('Box-row')
                );
                if (hasAssets) {
                  initAssetsFilter();
                }
              }
            }
          });
          contentObserver.observe(releaseContent, {
            childList: true,
            subtree: true,
          });
        }, 500);
      } else {
        setTimeout(checkAndInitialize, 100);
      }
    } else {
      window.addEventListener('load', checkAndInitialize);
    }
  }

  // 初始检查
  checkAndInitialize();

  // 监听Turbo Drive页面切换事件
  document.addEventListener('turbo:load', () => {
    checkAndInitialize();
  });

  // 监听导航事件
  window.addEventListener('popstate', () => {
    checkAndInitialize();
  });

  function startObserver() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
