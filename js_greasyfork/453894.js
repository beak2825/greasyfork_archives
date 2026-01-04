// ==UserScript==
// @name        Panasonic配線器具見積支援ツール明細表表示調整
// @namespace   s.w.
// @match       https://www14.arrow.mew.co.jp/vafn/a2A/.G*
// @match       https://www14.arrow.mew.co.jp/vafnf/a2A/.G*
// @grant       none
// @version     1.5.2
// @author      s.w.
// @description Panasonic配線器具見積支援ツール明細表の表示範囲をページのサイズに自動的に合わせる。入力欄の内容に応じて色を調整する。
// @icon        https://www2.panasonic.biz/ideacontout/TOL/TOL91000000/TOL9100000050_THUMBNAIL_icon144haisen.png
// @downloadURL https://update.greasyfork.org/scripts/453894/Panasonic%E9%85%8D%E7%B7%9A%E5%99%A8%E5%85%B7%E8%A6%8B%E7%A9%8D%E6%94%AF%E6%8F%B4%E3%83%84%E3%83%BC%E3%83%AB%E6%98%8E%E7%B4%B0%E8%A1%A8%E8%A1%A8%E7%A4%BA%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/453894/Panasonic%E9%85%8D%E7%B7%9A%E5%99%A8%E5%85%B7%E8%A6%8B%E7%A9%8D%E6%94%AF%E6%8F%B4%E3%83%84%E3%83%BC%E3%83%AB%E6%98%8E%E7%B4%B0%E8%A1%A8%E8%A1%A8%E7%A4%BA%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 常量定义
  const INPUT_HIGHLIGHT_STYLE = {
    color: 'red',
    backgroundColor: 'yellow'
  };

  // 产品链接和图片的基础URL
  const PRODUCT_LINK_BASE = 'https://www2.panasonic.biz/jp/content/download/cad/const/dxf/';
  const PRODUCT_IMAGE_BASE = 'http://www2.panasonic.biz/jp/content/download/cad/const/gif/';

  // 初始化函数
  function initialize() {
    setupInputStyles();
    adjustPageLayout();
    setupProductLinks();

    // 添加窗口大小变化监听器
    window.addEventListener('resize', adjustPageLayout);

    // 添加悬浮图片的样式
    addHoverImageStyles();
  }

  // 设置输入框样式和事件监听
  function setupInputStyles() {
    // 数量输入框样式设置
    setupQuantityInputs();

    // 表示順输入框设置
    setupDisplayOrderInputs();

    // 住戸タイプ输入框设置
    setupResidenceTypeInputs();

    // ネームカード名称输入框设置
    setupNameCardInputs();

    // ネームカード数量输入框设置
    setupNameCardQuantityInputs();
  }

  // 数量输入框样式设置
  function setupQuantityInputs() {
    const quantityInputs = document.getElementsByClassName("suu_edit_right");

    Array.from(quantityInputs).forEach(input => {
      // 根据值设置初始样式
      if (input.value == 0) {
        input.style.borderColor = "#EEEEEE";
        input.style.color = "#EEEEEE";
      } else {
        input.style.borderColor = "#7F9DB9";
        input.style.color = "black";
      }

      // 添加变更事件监听
      input.addEventListener("change", highlightChangedInput);
    });
  }

  // 表示順输入框设置
  function setupDisplayOrderInputs() {
    const orderInputs = document.getElementsByClassName("han_edit_center");

    Array.from(orderInputs).forEach(input => {
      input.maxLength = 3;
      input.addEventListener("change", highlightChangedInput);
    });
  }

  // 住戸タイプ输入框设置
  function setupResidenceTypeInputs() {
    for (let i = 0; i < 30; i++) {
      const input = document.getElementById("jyukoType" + i);
      if (input) {
        input.addEventListener("change", highlightChangedInput);
      }
    }
  }

  // ネームカード名称输入框设置
  function setupNameCardInputs() {
    const nameCardInputs = document.getElementsByClassName("cardNm");

    Array.from(nameCardInputs).forEach(input => {
      input.addEventListener("change", highlightChangedInput);
    });
  }

  // ネームカード数量输入框设置
  function setupNameCardQuantityInputs() {
    const nameCardQuantityInputs = document.getElementsByClassName("nameCnt");

    Array.from(nameCardQuantityInputs).forEach(input => {
      input.addEventListener("change", highlightChangedInput);
    });
  }

  // 高亮显示已更改的输入框
  function highlightChangedInput() {
    this.style.color = INPUT_HIGHLIGHT_STYLE.color;
    this.style.backgroundColor = INPUT_HIGHLIGHT_STYLE.backgroundColor;
  }

  // 调整页面布局以适应窗口大小
  function adjustPageLayout() {
    adjustHeight();
    adjustWidth();
  }

  // 调整高度
  function adjustHeight() {
    let heightplus = window.innerHeight - 710;
    if (heightplus < 0) {
      heightplus = 0;
    }

    const meisaiTblDataDiv = document.getElementById("meisaiTblDataDiv");
    if (meisaiTblDataDiv) {
      meisaiTblDataDiv.style.height = (302 + heightplus) + "px";
    }
  }

  // 调整宽度
  function adjustWidth() {
    let widthplus = window.innerWidth - 1000;
    if (widthplus < 0) {
      widthplus = 0;
    }

    // 调整输入区域宽度
    adjustInputAreaWidth(widthplus);

    // 调整明细表宽度
    adjustDetailTableWidth(widthplus);

    // 调整住戸タイプ区域宽度
    adjustResidenceTypeWidth(widthplus);
  }

  // 调整输入区域宽度
  function adjustInputAreaWidth(widthplus) {
    const div1 = document.getElementById("input_area1");
    if (!div1) return;

    div1.style.width = (940 + widthplus) + "px";

    const table1 = div1.getElementsByTagName("table")[0];
    if (table1) {
      table1.width = (935 + widthplus) + "px";

      const td1 = table1.children[0]?.children[1]?.children[2];
      if (td1) {
        td1.width = (371 + widthplus) + "px";
        if (td1.children[0]) {
          td1.children[0].width = (371 + widthplus) + "px";
        }
      }
    }

    const jyukoTypeHdr = document.getElementById("jyuko_type_hdr");
    if (jyukoTypeHdr) {
      jyukoTypeHdr.style.width = (255 + widthplus) + "px";
    }
  }

  // 调整明细表宽度
  function adjustDetailTableWidth(widthplus) {
    const resultDataElements = document.getElementsByClassName("result_data");
    if (resultDataElements.length > 0) {
      resultDataElements[0].width = (965 + widthplus) + "px";
    }

    const meisaiTblTitle = document.getElementById("meisaiTblTitle");
    if (meisaiTblTitle?.children[0]?.children[0]?.children[11]) {
      meisaiTblTitle.children[0].children[0].children[11].style.width = (260 + widthplus) + "px";
    }

    const meisaiTblDataDiv = document.getElementById("meisaiTblDataDiv");
    if (meisaiTblDataDiv) {
      meisaiTblDataDiv.style.width = (952 + widthplus) + "px";
    }

    const meisaiTblData = document.getElementById("meisaiTblData");
    if (meisaiTblData) {
      if (meisaiTblData.children[0]?.children[0]?.children[11]) {
        meisaiTblData.children[0].children[0].children[11].style.width = (260 + widthplus) + "px";
      }
      meisaiTblData.style.width = (935 + widthplus) + "px";
    }
  }

  // 调整住戸タイプ区域宽度
  function adjustResidenceTypeWidth(widthplus) {
    for (let i = 101; i < 121; i++) {
      const divId = "jyuko_type_m" + i.toString().slice(-2);
      const div = document.getElementById(divId);
      if (div) {
        div.style.width = (260 + widthplus) + "px";
      }
    }
  }

  // 检测浏览器缩放比例
  function detectZoom() {
    let ratio = 0;
    const screen = window.screen;
    const ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
    } else if (ua.indexOf('msie') !== -1) {
      if (screen.deviceXDPI && screen.logicalXDPI) {
        ratio = screen.deviceXDPI / screen.logicalXDPI;
      }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
      ratio = window.outerWidth / window.innerWidth;
    }

    if (ratio) {
      ratio = Math.round(ratio * 100);
    }

    return ratio;
  }

  // 添加悬浮图片的CSS样式
  function addHoverImageStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .product-link {
        position: relative;
        color: #0066cc;
        text-decoration: none;
        cursor: pointer;
        font-family: MS Gothic;
        font-size: 9pt;
      }

      .product-link:hover {
        color: #ff6600;
      }

      .hover-image-container {
        display: none;
        position: fixed;
        z-index: 1000;
        background-color: white;
        border: 1px solid #ccc;
        padding: 5px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        right: 20px;
        top: 50px;
        width: 200px;
      }

      .product-link:hover .hover-image-container {
        display: block;
      }

      .hover-image {
        max-width: 100%;
        height: auto;
      }

      .hover-image-title {
        text-align: center;
        margin-top: 5px;
        font-size: 12px;
        color: #333;
      }

      .image-error-message {
        padding: 10px;
        text-align: center;
        color: #ff0000;
      }
    `;
    document.head.appendChild(styleElement);
  }

  // 设置产品链接和悬浮图片
  function setupProductLinks() {
    // 使用requestAnimationFrame确保DOM已完全加载
    requestAnimationFrame(() => {
      const hinbDivs = document.getElementsByClassName('hinb');

      // 使用DocumentFragment优化DOM操作
      const fragment = document.createDocumentFragment();

      Array.from(hinbDivs).forEach(div => {
        const fontElements = div.getElementsByTagName('font');

        Array.from(fontElements).forEach(font => {
          const productCode = font.textContent.trim();
          if (!productCode) return;

          // 检查是否以"x "开头，如果是则不添加链接
          if (productCode.startsWith('x')) {
            return; // 跳过此元素
          }

          // 创建链接元素
          const link = document.createElement('a');
          // 确保链接地址末尾添加.dxf后缀
          link.href = PRODUCT_LINK_BASE + productCode + '.DXF';
          link.className = 'product-link table_value';
          link.target = '_blank';

          // 创建悬浮图片容器
          const imageContainer = document.createElement('div');
          imageContainer.className = 'hover-image-container';

          // 创建图片元素
          const image = document.createElement('img');
          image.src = PRODUCT_IMAGE_BASE + productCode + '.gif';
          image.className = 'hover-image';
          image.alt = productCode;

          // 添加图片加载错误处理
          image.onerror = function() {
            // 移除图片元素
            this.parentNode.removeChild(this);

            // 添加错误信息
            const errorMessage = document.createElement('div');
            errorMessage.className = 'image-error-message';
            errorMessage.textContent = '图片加载失败';
            imageContainer.appendChild(errorMessage);
          };

          // 创建图片标题
          const imageTitle = document.createElement('div');
          imageTitle.className = 'hover-image-title';
          imageTitle.textContent = productCode;

          // 组装DOM结构
          imageContainer.appendChild(image);
          imageContainer.appendChild(imageTitle);
          link.appendChild(document.createTextNode(productCode));

          // 将图片容器添加到body而不是链接内部
          document.body.appendChild(imageContainer);

          // 添加鼠标事件处理
          link.addEventListener('mouseenter', function() {
            imageContainer.style.display = 'block';
          });

          link.addEventListener('mouseleave', function() {
            imageContainer.style.display = 'none';
          });

          // 替换原始font元素
          font.parentNode.replaceChild(link, font);
        });
      });

      // 一次性将所有更改应用到DOM
      document.body.appendChild(fragment);
    });
  }

  // 启动脚本
  initialize();
})();