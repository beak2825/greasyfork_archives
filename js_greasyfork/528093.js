// ==UserScript==
// @name         星流专用提示词
// @namespace    none
// @version      0.0.3
// @description  星流专用提示词，快捷方便，无缝插入提示词对话框
// @grant        GM_setValue
// @grant        GM_getValue
// @author       mehaotian
// @match        *://*.xingliu.art/*
// @downloadURL https://update.greasyfork.org/scripts/528093/%E6%98%9F%E6%B5%81%E4%B8%93%E7%94%A8%E6%8F%90%E7%A4%BA%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/528093/%E6%98%9F%E6%B5%81%E4%B8%93%E7%94%A8%E6%8F%90%E7%A4%BA%E8%AF%8D.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let defaultData = [
    {
      title: "质量",
      content: [
        {
          name: "Quality",
          key: "quality",
          data: [
            {
              prompt: "UHD",
              title: "超高清",
              url: "",
            },
            {
              prompt: "anatomically correct",
              title: "解剖学正确",
              url: "",
            },
            {
              prompt: "ccurate",
              title: "准确",
              url: "",
            },
            {
              prompt: "textured skin",
              title: "质感皮肤",
              url: "",
            },
            {
              prompt: "super detail",
              title: "非常详细",
              url: "",
            },
            {
              prompt: "high details",
              title: "高细节",
              url: "",
            },
            {
              prompt: "award winning",
              title: "屡获殊荣",
              url: "",
            },
            {
              prompt: "best quality",
              title: "最佳质量",
              url: "",
            },
            {
              prompt: "high quality",
              title: "高质量",
              url: "",
            },
          ],
        },
        {
          name: "画质",
          key: "quality",
          data: [
            {
              prompt: "1080P",
              title: "1080P",
              url: "",
            },
            {
              prompt: "retina",
              title: "视网膜屏",
              url: "",
            },
            {
              prompt: "HD",
              title: "HD",
              url: "",
            },
            {
              prompt: "16k",
              title: "16k",
              url: "",
            },
            {
              prompt: "8k",
              title: "8k",
              url: "",
            },
            {
              prompt: "4K",
              title: "4K",
              url: "",
            },
          ],
        },
      ],
    },
    {
      title: "画面效果",
      content: [
        {
          name: "Style",
          key: "style",
          data: [
            {
              prompt: "chiaroscuro",
              title: "明暗对比",
              url: "",
            },
            {
              prompt: "depth of field",
              title: "背景虚化",
              url: "",
            },
            {
              prompt: "cinematic lighting",
              title: "电影光效",
              url: "",
            },
            {
              prompt: "chromatic aberration",
              title: "色差",
              url: "",
            },
            {
              prompt: "motion blur",
              title: "动态模糊",
              url: "",
            },
            {
              prompt: "sparkle",
              title: "闪耀效果",
              url: "",
            },
            {
              prompt: "jpeg artifacts",
              title: "JPEG 压缩失真",
              url: "",
            },
            {
              prompt: "blurry",
              title: "模糊的",
              url: "",
            },
            {
              prompt: "glowing light",
              title: "荧光",
              url: "",
            },
            {
              prompt: "god rays",
              title: "神圣感顶光",
              url: "",
            },
            {
              prompt: "ray tracing",
              title: "光线追踪",
              url: "",
            },
            {
              prompt: "reflection light",
              title: "反射光",
              url: "",
            },
            {
              prompt: "backlighting",
              title: "逆光",
              url: "",
            },
            {
              prompt: "blending",
              title: "混合",
              url: "",
            },
            {
              prompt: "bloom",
              title: "盛开",
              url: "",
            },
            {
              prompt: "chromatic aberration abuse",
              title: "色差滥用",
              url: "",
            },
            {
              prompt: "dithering",
              title: "抖动",
              url: "",
            },
            {
              prompt: "drop shadow",
              title: "立绘阴影",
              url: "",
            },
            {
              prompt: "film grain",
              title: "胶片颗粒感/老电影滤镜",
              url: "",
            },
            {
              prompt: "halftone",
              title: "半调风格",
              url: "",
            },
            {
              prompt: "image fill",
              title: "图像填充",
              url: "",
            },
            {
              prompt: "motion lines",
              title: "体现运动的线",
              url: "",
            },
            {
              prompt: "multiple monochrome",
              title: "多重单色",
              url: "",
            },
            {
              prompt: "optical illusion",
              title: "视错觉",
              url: "",
            },
            {
              prompt: "anaglyph",
              title: "互补色",
              url: "",
            },
            {
              prompt: "stereogram",
              title: "立体画",
              url: "",
            },
            {
              prompt: "scanlines",
              title: "扫描线",
              url: "",
            },
            {
              prompt: "silhouette",
              title: "剪影",
              url: "",
            },
            {
              prompt: "speed lines",
              title: "速度线",
              url: "",
            },
            {
              prompt: "vignetting",
              title: "晕影",
              url: "",
            },
            {
              prompt: "Fujicolor",
              title: "富士色彩",
              url: "",
            },
          ],
        },
      ],
    },
    {
      title: "构图",
      content: [
        {
          name: "镜头",
          key: "style",
          data: [
            {
              prompt: "lens flare",
              title: "镜头光晕",
              url: "",
            },
            {
              prompt: "overexposure",
              title: "过曝",
              url: "",
            },
            {
              prompt: "bokeh",
              title: "背景散焦",
              url: "",
            },
            {
              prompt: "caustics",
              title: "焦散",
              url: "",
            },
            {
              prompt: "diffraction spikes",
              title: "衍射十字星",
              url: "",
            },
            {
              prompt: "emphasis lines",
              title: "集中线",
              url: "",
            },
            {
              prompt: "foreshortening",
              title: "正前缩距透视法",
              url: "",
            },
            {
              prompt: "satellite image",
              title: "卫星鸟瞰",
              url: "",
            },
            {
              prompt: "macro photo",
              title: "微距照片",
              url: "",
            },
            {
              prompt: "360 view",
              title: "360 度视角",
              url: "",
            },
            {
              prompt: "Wide-Angle",
              title: "广角",
              url: "",
            },
            {
              prompt: "Ultra-Wide Angle",
              title: "超广角",
              url: "",
            },
            {
              prompt: "Eye-Level Shot",
              title: "人眼视角拍摄",
              url: "",
            },
            {
              prompt: "f/1.2",
              title: "光圈 F1.2",
              url: "",
            },
            {
              prompt: "f/1.8",
              title: "光圈 F1.8",
              url: "",
            },
            {
              prompt: "f/2.8",
              title: "光圈 F2.8",
              url: "",
            },
            {
              prompt: "f/4.0",
              title: "光圈 F4.0",
              url: "",
            },
            {
              prompt: "f/16",
              title: "光圈 F16",
              url: "",
            },
            {
              prompt: "35mm",
              title: "焦距 35mm",
              url: "",
            },
            {
              prompt: "85mm",
              title: "焦距 85mm",
              url: "",
            },
            {
              prompt: "135mm",
              title: "焦距 135mm",
              url: "",
            },
            {
              prompt: "Nikon",
              title: "尼康",
              url: "",
            },
            {
              prompt: "Canon",
              title: "佳能",
              url: "",
            },
            {
              prompt: "Fujifilm",
              title: "富士",
              url: "",
            },
            {
              prompt: "Hasselblad",
              title: "哈数",
              url: "",
            },
            {
              prompt: "Sony FE",
              title: "索尼镜头",
              url: "",
            },
            {
              prompt: "Sony FE GM",
              title: "索尼大师镜头",
              url: "",
            },
          ],
        },
        {
          name: "视角",
          key: "style",
          data: [
            {
              prompt: "first-person view",
              title: "第一人称视角",
              url: "",
            },
            {
              prompt: "pov",
              title: "主观视角",
              url: "",
            },
            {
              prompt: "three sided view",
              title: "三视图",
              url: "",
            },
            {
              prompt: "multiple views",
              title: "多视图",
              url: "",
            },
            {
              prompt: "cut-in",
              title: "插入画面",
              url: "",
            },
            {
              prompt: "blurry foreground",
              title: "前景模糊",
              url: "",
            },
            {
              prompt: "close-up",
              title: "特写镜头",
              url: "",
            },
            {
              prompt: "cowboy shot",
              title: "七分身镜头",
              url: "",
            },
            {
              prompt: "vanishing point",
              title: "远景透视画法",
              url: "",
            },
            {
              prompt: "wide shot",
              title: "广角镜头",
              url: "",
            },
            {
              prompt: "from above",
              title: "俯视镜头",
              url: "",
            },
            {
              prompt: "from below",
              title: "仰视镜头",
              url: "",
            },
            {
              prompt: "from side",
              title: "角色的侧面",
              url: "",
            },
            {
              prompt: "panorama",
              title: "全景",
              url: "",
            },
            {
              prompt: "perspective",
              title: "透视画法",
              url: "",
            },
            {
              prompt: "rotated",
              title: "经过旋转的",
              url: "",
            },
          ],
        },
      ],
    },
  ];

  class DraggableResizableCard extends HTMLElement {
    constructor() {
      super();
      // 创建 Shadow DOM
      const shadow = this.attachShadow({ mode: "open" });
      // 设置默认样式
      const style = document.createElement("style");
      style.textContent = `
      :host {
          position: fixed;
          top:100px;
          left:325px;
          display: none;
          width: 300px;
          height: 500px;
          background-color: #fff;
          border-radius: 8px;
          z-index: 9999;
          user-select: none;
          overflow: hidden;
          box-shadow: 0 2px 14px #00000026;
      }
      #fileInput {
        display: none;
      }
      .custom-file-button {
        cursor: pointer;
        color: #007bff;
        font-size: 12px;
        padding: 0 5px;
        border: 1px solid #007bff;
        border-radius: 3px;
        margin-left: 5px;
      }
      .dz-card {
        display: flex;
        flex-direction: column;
        height:100%;
        overflow: hidden;
      }
      .card-header {
          display: flex;
          justify-content: space-between;
          height: 30px;
          flex-shrink: 0;
          background-image: linear-gradient(90deg,#fcfcfc 0%,#fbfbfb 100%);
          color: white;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          cursor: move;
          font-size: 14px;
          font-weight: bold;
          color: rgb(45, 45, 45);
          height:2.75rem;
          border-bottom:1px rgb(242, 243, 245) solid;
      }
      .dz-close-icon {
        cursor: pointer;
      }
      .dz-close-icon-text {
        width:20px;
        height:20px;
      }
      .tabs {
          flex-shrink: 0;
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          border-bottom: 1px rgb(242, 243, 245) solid;
          scrollbar-width: none; /* Firefox 隐藏滚动条 */
          -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
      }
      .tab {
          padding: 8px;
          cursor: pointer;
          border: none;
          background: none;
          color: #777;
          font-size: 12px;
          flex-shrink: 0;
      }
      .tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
      }
      .card-content {
          position: relative;
          flex:1;
          overflow-y: auto;
          font-size:12px;
          color:#2f3640;
      }

      /* 滚动条整体部分 */
      .card-content::-webkit-scrollbar {
          width: 5px; /* 设置滚动条宽度 */
          right: 5px; /* 设置滚动条距离右边的距离 */
      }

      /* 滚动条轨道 */
      .card-content::-webkit-scrollbar-track {
          background: none; /* 轨道背景颜色 */
          border-radius: 5px; /* 圆角效果 */
      }

      /* 滚动条滑块 */
      .card-content::-webkit-scrollbar-thumb {
          background: #f5f5f5; /* 滑块颜色 */
          border-radius: 4px; /* 圆角效果 */
      }

      /* 滑块悬停时的样式 */
      .card-content::-webkit-scrollbar-thumb:hover {
          background: #333; /* 悬停时的颜色 */
      }

      .sub-category {
          margin-top: 10px;
      }
      .sub-category-title {
          padding-left:10px;
          font-weight: bold;
          margin-bottom: 5px;
      }
      .data-item {
        padding:5px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 5px;
      }
     
      .data-item-content {
        color:#fff;
        felx-shrink:0;
        display: flex;
        flex-direction: row;
        background-image:linear-gradient(#45507a, #69728b);
        margin-right:5px;
        margin-bottom:5px;
        border-radius:5px;
        overflow:hidden;
        cursor:pointer;

      }
      .data-item-content:hover {
        transform: translateY(-1px);
        transition: all .2s ease-in-out;
        box-shadow: 0 3px 2px rgba(51, 54, 67, .25);
      }
      .data-item-inner {
        position:relative;
        width:100%;
        box-sizing:border-box;
        overflow:hidden;
        cursor:pointer;
      }

      .inner-img-box {
        border-radius:5px;
        height:110px;
        border:1px #f5f5f5 solid;
      }

      .inner-img {
        width:100%;
      }
      .inner-text {
        display:flex;
        justify-content:center;
        align-items:center;
        padding:5px;
        font-size:12px;
      }
      .inner-subtext {
        display:flex;
        justify-content:center;
        align-items:center;
        padding:5px;
        font-size:12px;
        background:linear-gradient(#6f80b2, #5475f6);
      }

      .resize-handle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          background-color: #007bff;
          cursor: se-resize;
      }
  `;
      // 创建卡片结构
      const card = document.createElement("div");
      card.className = "dz-card";
      let cardName = this.getAttribute("name") || "提示词";
      card.innerHTML = `
      <div class="card-header">
        <div>
          <span>${cardName}</span>
          <label for="fileInput" class="custom-file-button">导入提示词</label>
          <input type="file" id="fileInput" accept=".json" />
        </div>
        <div class="dz-close-icon">
          <svg t="1740388789766" class="dz-close-icon-text" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2621" width="48" height="48"><path d="M512 466.944l233.472-233.472a31.744 31.744 0 0 1 45.056 45.056L557.056 512l233.472 233.472a31.744 31.744 0 0 1-45.056 45.056L512 557.056l-233.472 233.472a31.744 31.744 0 0 1-45.056-45.056L466.944 512 233.472 278.528a31.744 31.744 0 0 1 45.056-45.056z" fill="#5A5A68" p-id="2622"></path></svg>
        </div>
      </div>
      <div class="tabs"></div>
      <div class="card-content"></div>
      <div class="resize-handle"></div>
  `;
      // 将样式和内容添加到 Shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(card);
      // 初始化状态
      this.isDragging = false;
      this.isResizing = false;
      this.startX = 0;
      this.startY = 0;
      this.startWidth = 0;
      this.startHeight = 0;
      // 获取 DOM 元素
      this.cardHeader = shadow.querySelector(".card-header");
      this.resizeHandle = shadow.querySelector(".resize-handle");
      this.tabsContainer = shadow.querySelector(".tabs");
      this.tabContentContainer = shadow.querySelector(".card-content");
      // 绑定事件
      this.initEvents();

      // 绑定关闭按钮事件
      const closeButton = shadow.querySelector(".dz-close-icon");
      closeButton.addEventListener("click", () => {
        this.hide(); // 调用隐藏方法
      });

      // 绑定导入提示词事件
      const fileInput = shadow.querySelector("#fileInput");
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result);

              console.log(data);
              GM_setValue("xl_promptData", data);

              this.initTabs(data);
            } catch (error) {
              console.log(error);
              alert("文件格式或文件内容错误，请检查后重试");
            }
          };
          reader.readAsText(file);
        }
      });
    }

    initEvents() {
      // 拖拽功能
      this.cardHeader.addEventListener("mousedown", (e) => {
        this.isDragging = true;
        this.startX = e.clientX - this.offsetLeft;
        this.startY = e.clientY - this.offsetTop;
      });

      // 调整大小功能
      this.resizeHandle.addEventListener("mousedown", (e) => {
        this.isResizing = true;
        this.startWidth = this.offsetWidth;
        this.startHeight = this.offsetHeight;
        this.startX = e.clientX;
        this.startY = e.clientY;
      });

      // 全局鼠标移动事件
      document.addEventListener("mousemove", (e) => {
        if (this.isDragging) {
          const x = e.clientX - this.startX;
          const y = e.clientY - this.startY;
          this.style.left = `${x}px`;
          this.style.top = `${y}px`;
        }
        if (this.isResizing) {
          const width = this.startWidth + (e.clientX - this.startX);
          const height = this.startHeight + (e.clientY - this.startY);
          this.style.width = `${Math.max(width, 300)}px`; // 最小宽度为 300px
          this.style.height = `${Math.max(height, 500)}px`; // 最小高度为 500px
        }
      });

      // 全局鼠标松开事件
      document.addEventListener("mouseup", () => {
        this.isDragging = false;
        this.isResizing = false;
      });
    }

    connectedCallback() {
      const xl_promptData = GM_getValue("xl_promptData");
      if (xl_promptData) {
        this.initTabs(xl_promptData);
      } else {
        // 动态生成选项卡
        this.initTabs(defaultData);
      }
    }

    initTabs(tabsData) {
      this.tabContentContainer.innerHTML = ""; // 清空内容
      this.tabsContainer.innerHTML = ""; // 清空选项卡
      // 动态生成选项卡标题
      tabsData.forEach((tab, tabIndex) => {
        const tabButton = document.createElement("button");
        tabButton.className = "tab";
        tabButton.textContent = tab.title;
        tabButton.addEventListener("click", () =>
          this.switchTab(tabIndex, tabsData)
        );
        this.tabsContainer.appendChild(tabButton);

        // 默认显示第一个选项卡内容
        if (tabIndex === 0) {
          this.renderTabContent(tab);
          tabButton.classList.add("active");
        }
      });
    }

    // 切换选项卡
    switchTab(index, tabsData) {
      // 移除所有选项卡的 active 类
      const tabs = this.shadowRoot.querySelectorAll(".tab");
      tabs.forEach((tab) => tab.classList.remove("active"));

      // 添加当前选项卡的 active 类
      tabs[index].classList.add("active");

      // 渲染当前选项卡内容
      this.renderTabContent(tabsData[index]);
    }

    // 渲染选项卡内容
    renderTabContent(tab) {
      this.tabContentContainer.innerHTML = ""; // 清空内容
      tab.content.forEach((subCategory) => {
        const subCategoryDiv = document.createElement("div");
        subCategoryDiv.className = "sub-category";

        // 子分类标题
        const subCategoryTitle = document.createElement("div");
        subCategoryTitle.className = "sub-category-title";
        subCategoryTitle.textContent = subCategory.name;
        subCategoryDiv.appendChild(subCategoryTitle);

        const dataItem = document.createElement("div");
        dataItem.className = "data-item";
        // 数据项
        subCategory.data.forEach((item) => {
          const dataItemContent = document.createElement("div");
          dataItemContent.className = "data-item-content";
          dataItemContent.setAttribute("prompt", item.prompt);

          const name_key = document.createElement("div");
          name_key.className = "inner-text";
          name_key.textContent = item.prompt;

          dataItemContent.appendChild(name_key);
          if (item.prompt !== item.title) {
            const name_subname = document.createElement("div");
            name_subname.className = "inner-subtext";
            name_subname.textContent = item.title;
            dataItemContent.appendChild(name_subname);
          }

          // 绑定点击事件
          dataItemContent.addEventListener("click", () => {
            const textarea = document.querySelector(
              "#primaryPromptWrapper textarea"
            );
            if (textarea.value.trim() !== "") {
              textarea.value += ", "; // 如果有内容，先加逗号分隔
            }
            textarea.value += item.prompt; // 追加 prompt
          });

          dataItem.appendChild(dataItemContent);
        });
        subCategoryDiv.appendChild(dataItem);

        this.tabContentContainer.appendChild(subCategoryDiv);
      });
    }

    // 显示组件
    show() {
      this.style.display = "block";
    }

    // 隐藏组件
    hide() {
      this.style.display = "none";
    }
  }

  // 注册自定义元素
  customElements.define("draggable-resizable-card", DraggableResizableCard);

  // 创建自定义组件实例
  const card = document.createElement("draggable-resizable-card");
  card.setAttribute("name", "快捷提示词"); // 设置标题

  // 插入到 body 最后
  document.body.appendChild(card);
  // 添加开关
  addNewDiv();
  // 绑定显示按钮事件
  const showCardButton = document.getElementById("showCardButton");
  if (showCardButton) {
    showCardButton.addEventListener("click", () => {
      card.show(); // 调用显示方法
    });
  }

  // 动态添加一个新的 div
  function addNewDiv() {
    // 选择 id 为 generator-prompt-container 的元素
    const container = document.getElementById("generator-prompt-container");

    // 创建新的子元素
    const toolsBox = document.createElement("div");
    toolsBox.setAttribute("id", "showCardButton");
    toolsBox.style.cursor = "pointer";
    //toolsBox.textContent = 'tool box';
    toolsBox.style.borderBottom = "1px #eee solid";
    toolsBox.style.marginBottom = "5px";
    toolsBox.style.padding = "5px";
    toolsBox.style.fontSize = "12px";
    toolsBox.style.color = "#333";
    toolsBox.style.display = "flex";
    toolsBox.style.alignItems = "center";
    const icon = document.createElement("div");
    const icon_text =
      '<svg t="1740481646961" id="dz-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2037" width="48" height="48"><path d="M274.090667 107.861333l43.235555 116.792889 116.792889 43.235556-116.792889 43.235555-43.235555 116.736-43.235556-116.792889-116.736-43.235555 116.736-43.235556 43.235556-116.736zM717.937778 532.138667l51.825778 140.117333 140.117333 51.882667-140.117333 51.882666-51.882667 140.117334-51.825778-140.117334-140.174222-51.882666 140.174222-51.882667 51.825778-140.117333zM699.278222 190.350222a36.977778 36.977778 0 1 0-64.056889-36.977778L219.192889 873.927111a36.977778 36.977778 0 1 0 64.056889 36.977778l416.028444-720.554667z" p-id="2038"></path></svg>';
    icon.innerHTML = icon_text;
    toolsBox.appendChild(icon);

    const prompt = document.createElement("div");
    prompt.textContent = "提示词工具";
    prompt.style.fontSize = "12px";
    prompt.style.marginLeft = "5px";

    toolsBox.appendChild(prompt);

    // 在目标父元素的最上面插入新元素
    if (container.firstChild) {
      container.insertBefore(toolsBox, container.firstChild);
    } else {
      // 如果目标元素没有子元素，直接追加
      container.appendChild(toolsBox);
    }
    const iconBox = document.getElementById("dz-icon");
    iconBox.style.width = "14px";
    iconBox.style.height = "14px";

    // 可移动左侧栏
    let aside = document.querySelector('#left-panels-wrapper')
   // 检查元素是否存在
    if (aside) {
        aside.classList.remove('left-4');
        aside.classList.add('right-4');
    }
  }
})();
