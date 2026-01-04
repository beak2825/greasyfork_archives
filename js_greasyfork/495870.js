// ==UserScript==
// @name        Source Copier Plus
// @namespace   http://tampermonkey.net/
// @version     4.1
// @description 在Bing和Google搜索结果页面添加多个按钮，点击后复制特定div中的内容，并根据选择的区域打开相关链接。
// @author      Your Name
// @match       https://www.google.com/search?q=*
// @match       https://www.google.com.hk/search?q=*
// @match       https://www.google.*/*search?q=*
// @match       https://www.bing.com/search?q=*
// @match       https://www.google.co.jp/search?q=*
// @match       https://www.bing.com/news/event?*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/495870/Source%20Copier%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/495870/Source%20Copier%20Plus.meta.js
// ==/UserScript==

'use strict';

class CopySource {
  constructor() {
    this.debugLogs = [];
    this.cachedTitles = null;
    this.sourceButton = null;
    this.SOURCES = {
      "Bing Serp": "https://www.bing.com/search?q=",
      "Bing Verp": "https://www.bing.com/news/search?q=",
      "Google Serp": "https://www.google.com/search?q=",
      "Google Verp": "https://www.google.com/search?tbm=nws&q=",
      "Google News": "https://news.google.com/search?q="
    };
    this.REGION_SETTINGS = {
      "en-US": {"bing": "&setlang=en&cc=us", "google": "&hl=en-US&gl=US&ceid=US:en"},
      "de": {"bing": "&setlang=de&cc=de", "google": "&hl=de&gl=DE&ceid=DE:de"},
      "en-CA": {"bing": "&setlang=en&cc=ca", "google": "&hl=en-CA&gl=CA&ceid=CA:en"},
      "en-GB": {"bing": "&setlang=en&cc=gb", "google": "&hl=en-GB&gl=GB&ceid=GB:en"},
      "en-IN": {"bing": "&setlang=en&cc=in", "google": "&hl=en-IN&gl=IN&ceid=IN:en"},
      "es": {"bing": "&setlang=es&cc=es", "google": "&hl=es&gl=ES&ceid=ES:es"},
      "fr": {"bing": "&setlang=fr&cc=fr", "google": "&hl=fr&gl=FR&ceid=FR:fr"},
      "ja": {"bing": "&setlang=ja&cc=jp", "google": "&hl=ja&gl=JP&ceid=JP:ja"},
      "ko": {"bing": "&setlang=ko&cc=kr", "google": "&hl=ko&gl=KR&ceid=KR:ko"},
      "pt-BR": {"bing": "&setlang=pt-br&cc=br", "google": "&hl=pt-BR&gl=BR&ceid=BR:pt-419"},
      "zh-HANS": {"bing": "&setlang=zh-Hans&cc=CN", "google": "&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"}
    };
    this.copyTargets = [
      {
        name: "Source Name",
        getTitles: this.getTitles.bind(this),
        copyTitles: this.copyContent.bind(this),
        button: null,
        cachedTitles: null,
      },
      {
        name: "TOB Title",
        getTitles: this.getTobTitles.bind(this),
        copyTitles: this.copyTobTitles.bind(this),
        button: null,
        cachedTitles: null,
        condition: this.isOnBingSerp.bind(this), // 添加条件函数
      },
    ];
  }

  init() {
    this.log("脚本初始化开始");
    window.addEventListener('load', () => {
      this.createToolbar();
      this.updateCopyButtons(); // 初始化时更新所有按钮
    });
    this.log("脚本初始化完成");
  }

  createToolbar() {
    const toolbar = this.createElement('div', {
      style: {
        position: "static", top: "0", left: "0", width: "100%", zIndex: "9999",
        backgroundColor: "#f0f0f0", padding: "10px", display: "flex", alignItems: "center",
        borderBottom: "1px solid #ccc", boxSizing: "border-box"
      }
    });

    const copyContainer = this.createCopyContainer();
    const switchContainer = this.createSwitchContainer();
    const debugButton = this.createButton("Debug", "#FF0000", this.copyDebugInfo.bind(this));
    debugButton.style.marginLeft = "auto";

    toolbar.appendChild(copyContainer);
    toolbar.appendChild(switchContainer);
    toolbar.appendChild(debugButton);

    // 将工具栏插入到 head 元素之前
    const head = document.querySelector('head');
    head.parentNode.insertBefore(toolbar, head);

    // 调整 body 的 padding-top，以避免工具栏遮挡内容
    const toolbarHeight = toolbar.offsetHeight;
    // document.body.style.paddingTop = `${toolbarHeight}px`;
  }


  createCopyContainer() {
    const container = this.createElement('div', { style: { display: "flex", marginRight: "10px" } });
    this.copyTargets.forEach(target => {
      target.button = this.createButton(`检测 ${target.name} 中...`, "#4CAF50", target.copyTitles);
      container.appendChild(target.button);
    });
    return container;
  }

    createSwitchContainer() {
        const container = this.createElement('div', { style: { display: "flex", marginRight: "10px" } });
        const select = this.createRegionSelect();
        container.appendChild(select);

        for (const source in this.SOURCES) {
            const button = this.createLinkButton(source);
            container.appendChild(button);
        }
        return container;
    }

  updateCopyButtons() {
    this.copyTargets.forEach(target => {
      if (target.condition && !target.condition()) {
        target.button.style.display = "none"; // 如果不满足条件，隐藏按钮
        return;
      }
      this.updateButtonTitle(target.button, target.getTitles, target.name);
    });
  }

  createButton(text, bgColor, onClick) {
    const button = this.createElement('button', { innerHTML: text });
    Object.assign(button.style, {
      backgroundColor: bgColor, color: "white", border: "none", padding: "10px 20px",
      cursor: "pointer", fontSize: "16px", borderRadius: "5px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginRight: "5px", transition: "transform 0.1s ease" // 添加过渡效果
    });

    button.addEventListener("click", () => {
      onClick(); // 先执行点击事件的逻辑

      // 添加点击动画效果
      button.style.transform = "scale(0.95)";
      button.addEventListener("transitionend", () => { // 监听过渡结束事件
        button.style.transform = ""; // 清除 transform，以便下次点击时能再次触发过渡
      }, { once: true }); // 只监听一次过渡结束事件
    });

    return button;
  }


  createLinkButton(source) {
    const button = this.createButton(source, "#4CAF50", () => window.open(this.createLinkUrl(source), '_blank'));
    button.dataset.source = source; // 使用 dataset
    return button;
  }

  isOnBingSerp() {
    return window.location.href.includes("bing.com/search");
  }

  getTobTitles() {
    if (this.cachedTobItemTitles) return this.cachedTobItemTitles;
    if (!this.isOnBingSerp()) return []; // 不在 Bing SERP 下返回空数组

    this.cachedTobItemTitles = Array.from(document.querySelectorAll('div.tobitem_title'))
      .map(div => div.dataset.title) // 获取 data-title 属性的值
      .filter(title => title); // 过滤掉空值

    this.log(`检测到 ${this.cachedTobItemTitles.length} 个 TOB Title`);
    return this.cachedTobItemTitles;
  }

  copyTobTitles() {
    this.log("开始复制 TOB Title");
    const titles = this.getTobTitles();
    GM_setClipboard(titles.join('\n'));
    this.showFloatingMessage(`已复制 ${titles.length} 个 TOB Title`);
  }

    createRegionSelect() {
        const select = this.createElement('select', { style: { marginRight: "5px" } });
        for (const region in this.REGION_SETTINGS) {
            select.appendChild(this.createElement('option', { value: region, text: region }));
        }
        select.addEventListener("change", this.updateLinkButtons.bind(this));
        return select;
    }

    updateLinkButtons() {
        const newRegion = document.querySelector("select").value;
        document.querySelectorAll("button[data-source]").forEach(button => {
            const source = button.dataset.source;
            const url = this.createLinkUrl(source, newRegion);
            button.onclick = () => window.open(url, "_blank");
        });
    }

    createLinkUrl(source, region = null) {
        const query = this.getQueryFromUrl();
        const engine = source.startsWith("Bing") ? "bing" : "google";
        const currentRegion = region || document.querySelector("select").value;
        const regionSetting = this.REGION_SETTINGS[currentRegion][engine] || "";
        return this.SOURCES[source] + encodeURIComponent(query) + regionSetting;
    }

  log(message) {
    this.debugLogs.push(message);
    console.log(message);
  }

  getQueryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get('q');
    if (query) {
      query = query.replace(/\+/g, ' ');
    }
    return query;
  }

  copyContent() {
    this.log("开始复制内容");
    const titles = this.getTitles();
    GM_setClipboard(titles.join('\n'));
    this.showFloatingMessage(`已复制 ${titles.length} 个Source`);
  }

  copyDebugInfo() {
    GM_setClipboard(this.debugLogs.join('\n'));
    this.showFloatingMessage("调试信息已复制");
  }

  showFloatingMessage(message) {
    const floatingMessage = this.createElement('div', { innerHTML: message, style: {
      position: "fixed", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: "9999",
      backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", padding: "10px 20px",
      borderRadius: "5px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", fontSize: "16px"
    }});
    document.body.appendChild(floatingMessage);
    setTimeout(() => document.body.removeChild(floatingMessage), 2000);
  }

  updateButtonTitle(button, getDataFunc, buttonText) {
    const data = getDataFunc();
    const dataCount = data.length;
    button.innerHTML = dataCount > 0 ? `检测到 ${dataCount} 个 ${buttonText}` : "";
    button.style.display = dataCount > 0 ? "block" : "none";
    this.log(`更新按钮标题: ${button.innerHTML}`);
  }

  getTitles() {
    if (this.cachedTitles) return this.cachedTitles;
    const url = window.location.href;
    this.log(`当前页面URL: ${url}`);

    if (url.includes("bing.com")) {
      this.cachedTitles = this.getNewsTitles(url.includes("news/event?")
        ? 'div.news-card.newsitem.cardcommon.nosnip'
        : 'div.ans_nws.na_card_all_effect cite');
    } else if (url.includes("google")) {
      const isFullCoverage = [...document.querySelectorAll('span')].some(span => span.textContent === "Full Coverage");
      this.cachedTitles = this.getGoogleTitlesByType(isFullCoverage ? "Top news" : "Top stories");
    } else {
      this.log("未匹配到已知页面");
      this.cachedTitles = [];
    }
    return this.cachedTitles;
  }

  getNewsTitles(selector) {
    const titles = [];
    const elements = document.querySelectorAll(selector);
    this.log(`检测到 ${elements.length} 个元素`);

    elements.forEach((element, index) => {
      const title = element.title || element.getAttribute('data-author');
      if (title) {
        titles.push(title.replace(" on MSN", ""));
        this.log(`找到标题: ${title}`);
      } else {
        this.log(`第 ${index + 1} 个元素没有标题`);
      }
    });
    return titles;
  }

  isGoogleFullCoveragePage() {
    const result = Array.from(document.querySelectorAll('span')).some(span => span.textContent === "Full Coverage");
    this.log("是否为Google Full Coverage页面: " + result);
    return result;
  }

  getGoogleTitlesByType(titleType) {
    const titles = [];
    this.log(`开始检测Google页面的标题，标题类型: ${titleType}`);

    const sections = document.querySelectorAll('g-section-with-header');
    this.log(`检测到 ${sections.length} 个g-section-with-header元素`);
    const sectionPositions = this.getSectionPositions(sections);

    let targetFound = this.searchInSections(sections, titleType, titles);
    if (!targetFound) {
      const headings = document.querySelectorAll('div[role="heading"]');
      this.log(`在整个页面中检测到 ${headings.length} 个具有 role="heading" 的div元素`);
      this.searchInHeadings(headings, titleType, sectionPositions, titles);
    }

    this.log(`共找到 ${titles.length} 个标题`);
    return titles;
  }

  getSectionPositions(sections) {
    const sectionPositions = [];
    sections.forEach(section => {
      const position = section.getBoundingClientRect().top;
      sectionPositions.push({ element: section, position });
      this.log(`section位置: ${position}`);
    });
    return sectionPositions;
  }

  searchInSections(sections, titleType, titles) {
    let targetFound = false;
    sections.forEach((section, sectionIndex) => {
      if (targetFound) return; // 如果找到目标，跳出循环
      this.log(`检查第 ${sectionIndex + 1} 个g-section-with-header元素`);
      const spans = section.querySelectorAll('span');
      this.log(`在该section中检测到 ${spans.length} 个span元素`);
      spans.forEach((span, spanIndex) => {
        if (targetFound) return; // 如果找到目标，跳出循环
        this.log(`检查第 ${spanIndex + 1} 个span元素: ${span.textContent}`);
        if (span.textContent === titleType) {
          targetFound = true;
          this.log(`检测到${titleType}`);
          this.extractTitlesFromSection(section, titles);
        }
      });
    });
    return targetFound;
  }

  searchInHeadings(headings, titleType, sectionPositions, titles) {
    headings.forEach((heading, headingIndex) => {
      this.log(`检查第 ${headingIndex + 1} 个div元素: ${heading.textContent}`);
      if (heading.textContent.includes(titleType)) {
        this.log(`检测到具有 ${titleType} 的div`);
        const closestSection = this.findClosestSection(heading, sectionPositions);
        if (closestSection) {
          this.extractTitlesFromSection(closestSection, titles);
        }
      }
    });
  }

  findClosestSection(heading, sectionPositions) {
    const headingPosition = heading.getBoundingClientRect().top;
    this.log(`heading位置: ${headingPosition}`);
    let closestSection = null;
    let minDistance = Infinity;
    sectionPositions.forEach((sectionPosition, sectionPositionIndex) => {
      const distance = Math.abs(sectionPosition.position - headingPosition);
      this.log(`检查第 ${sectionPositionIndex + 1} 个section位置，距离: ${distance}`);
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = sectionPosition.element;
        this.log(`目前最近的section位置 ${sectionPositionIndex + 1}: ${sectionPosition.position}`);
      }
    });
    return closestSection;
  }

  extractTitlesFromSection(section, titles) {
    const divs = section.querySelectorAll('div.MgUUmf.NUnG9d');
    this.log(`检测到 ${divs.length} 个符合条件的div元素`);
    divs.forEach((div, divIndex) => {
      this.log(`检查第 ${divIndex + 1} 个div元素`);
      const innerSpans = div.querySelectorAll('span');
      this.log(`在该div中检测到 ${innerSpans.length} 个span元素`);
      innerSpans.forEach((innerSpan, innerSpanIndex) => {
        this.log(`检查第 ${innerSpanIndex + 1} 个span元素`);
        if (innerSpan.textContent) {
          titles.push(innerSpan.textContent);
          this.log(`找到新闻标题: ${innerSpan.textContent}`);
        } else {
          this.log(`第 ${innerSpanIndex + 1} 个span元素没有textContent`);
        }
      });
    });
  }

  createElement(tag, attributes) {
    const element = document.createElement(tag);
    for (const attr in attributes) {
      if (attr === 'style') {
        Object.assign(element.style, attributes[attr]);
      } else {
        element[attr] = attributes[attr];
      }
    }
    return element;
  }
}

// 创建实例并初始化
const copySourceInstance = new CopySource();
copySourceInstance.init();
