// ==UserScript==
// @name         tradingview screener assistant
// @namespace    http://tampermonkey.net/
// @version      2024-09-20.3
// @description  insert batch copy button, chart copy button ,chart button and blacklist button in tradingview screener
// @author       goodzhuwang
// @match        https://*.tradingview.com/screener/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497885/tradingview%20screener%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/497885/tradingview%20screener%20assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ext_name = "tv_assistant";

  console.debug(`${ext_name} running`);

  let batch_button_id = "__batch_copybtn";

  // 代码黑名单
  let blacklist = [];
  // 最新的中概股名单 ： https://stockanalysis.com/list/chinese-stocks-us/
  let chinese_stocks = [
    "BABA",
    "NTES",
    "JD",
    "BIDU",
    "PUK",
    "LI",
    "BEKE",
    "ZTO",
    "TME",
    "YUMC",
    "NIO",
    "EDU",
    "HTHT",
    "FUTU",
    "XPEV",
    "YMM",
    "VIPS",
    "BILI",
    "BZ",
    "MNSO",
    "TAL",
    "ZK",
    "QFIN",
    "GDS",
    "LOT",
    "ATHM",
    "ATAT",
    "HCM",
    "MLCO",
    "RLX",
    "ZLAB",
    "IQ",
    "LU",
    "WB",
    "SIMO",
    "FINV",
    "DQ",
    "MOMO",
    "MSC",
    "JKS",
    "SDA",
    "HUYA",
    "VNET",
    "TUYA",
    "XCH",
    "EH",
    "GOTU",
    "TIGR",
    "ECX",
    "DDL",
    "NOAH",
    "HSAI",
    "KC",
    "ZKH",
    "SOHU",
    "RERE",
    "ICG",
    "ZJYL",
    "YRD",
    "DOGZ",
    "WDH",
    "PGHL",
    "DAO",
    "QD",
    "DADA",
    "YSG",
    "ZH",
    "TROO",
    "JFIN",
    "UXIN",
    "YXT",
    "LX",
    "DOYU",
    "RITR",
    "GHG",
    "DSY",
    "XYF",
    "LANV",
    "AHG",
    "BSII",
    "HPH",
    "AGBA",
    "CANG",
    "RTC",
    "BZUN",
    "NIU",
    "KNDI",
    "LSB",
    "EM",
    "YIBO",
    "ZBAO",
    "GSIW",
    "SRL",
    "AZI",
    "SFWL",
    "CMCM",
    "CAAS",
    "TOUR",
    "XNET",
    "THCH",
    "ADAG",
    "CASI",
    "QMMM",
    "LGCL",
    "QH",
    "VIOT",
    "GLAC",
    "CBAT",
    "QSG",
    "STG",
    "GLXG",
    "IH",
    "RGC",
    "WIMI",
    "JVSA",
    "SY",
    "NHTC",
    "LICN",
    "DIST",
    "XHG",
    "CNF",
    "FEBO",
    "FANH",
    "WOK",
    "JUNE",
    "CCG",
    "PTHL",
    "YHNA",
    "NCTY",
    "CHSN",
    "BEDU",
    "OCFT",
    "BGM",
    "NISN",
    "TOP",
    "PMAX",
    "MTC",
    "PRE",
    "YI",
    "FVN",
    "BEST",
    "BYU",
    "ZEPP",
    "UCL",
    "EHGO",
    "RCON",
    "NAAS",
    "HKIT",
    "MATH",
    "SWIN",
    "TWG",
    "EBON",
    "CDTG",
    "ABLV",
    "CLPS",
    "AGMH",
    "FENG",
    "SJ",
    "BNR",
    "KUKE",
    "HUIZ",
    "RAY",
    "AIXI",
    "JG",
    "ICLK",
    "MTEN",
    "HUDI",
    "IZM",
    "UTSI",
    "GMM",
    "CGA",
    "MHUA",
    "RETO",
    "HAO",
    "EPOW",
    "CHR",
    "CCM",
    "MI",
    "HLP",
    "UCAR",
    "PSIG",
    "WETH",
    "CCTG",
    "WLGS",
    "NA",
    "FEDU",
    "UBXG",
    "BHAT",
    "ATGL",
    "HOLO",
    "MGIH",
    "ILAG",
    "ABTS",
    "JFU",
    "JYD",
    "JZ",
    "CPOP",
    "NCI",
    "SEED",
    "SUGP",
    "PT",
    "AACG",
    "EDTK",
    "MOGU",
    "MMV",
    "JZXN",
    "ZKIN",
    "XIN",
    "JDZG",
    "GSUN",
    "CLWT",
    "CJET",
    "INTJ",
    "LOBO",
    "GDHG",
    "AIHS",
    "STEC",
    "JL",
    "PETZ",
    "SOS",
    "YJ",
    "YQ",
    "CJJD",
    "GURE",
    "JXJT",
    "WTO",
    "MFI",
    "GRFX",
    "MEGL",
    "NXTT",
    "TCTM",
    "ROMA",
    "HIHO",
    "EJH",
    "UPC",
    "KRKR",
    "WAFU",
    "CLEU",
    "DTSS",
    "RAYA",
    "BON",
    "CREG",
    "PWM",
    "DDC",
    "SNTG",
    "LKCO",
    "CHNR",
    "YGMZ",
    "OST",
    "TCJH",
    "OCG",
    "TIRX",
    "ANTE",
    "IFBD",
    "TAOP",
    "CPHI",
    "CNET",
    "BTCT",
    "EZGO",
    "SISI",
    "BAOS",
    "KXIN",
    "ZCMD",
    "ATXG",
    "JWEL",
    "TC",
    "WNW",
    "LXEH",
    "DUO",
    "ITP",
    "VSME",
    "FAMI",
    "SXTC",
    "BQ",
    "MLGO",
    "TANH",
    "UK",
    "CNEY",
  ];

  const blacklist_icon_svgstr =
    '<svg class="_LC-finviz-blacklist-icon" style="position: absolute; left: 80px; top: 0;" width="80" height="36" viewport="0 0 80 36" xmlns="http://www.w3.org/2000/svg"> <g> <title>Layer 1</title> <text stroke-width="4" font-weight="bold" xml:space="preserve" text-anchor="start" font-family="\'Bitter\'" font-size="24" id="svg_1" y="27" x="4.5" fill="#bf0000">黑名单</text> <rect stroke="#bf0000" rx="5" fill-opacity="0" id="svg_4" height="30" width="76" y="3" x="2" stroke-width="4" fill="#000000"/> </g> </svg>';
  /**
   * Returns an array of elements which are the symbol items in the list.
   * These are the elements which contain the symbol name and code.
   *
   * @return {HTMLCollectionOf<Element>} the symbol items
   */
  function getSymbolItems() {
    // 列表模式下的选择器: 正则比配: tickerName-
    // 图表模式下的选择器，正则比配：symbolNameBox-. @todo 需要优化，图表模式下，tv会自动删除不必要的图表项目，导致全选无法选中所有的图表。暂时没有办法解决
    let list_mode_items = findElementsByClassRegex(/tickerName-/);
    let chart_mode_items = findElementsByClassRegex(/symbolNameBox-/);

    if (checkIsChartMode()) {
      return chart_mode_items;
    } else {
      return list_mode_items;
    }
  }

  function copyToClipboard(text) {
    // 将文本复制到剪贴板
    navigator.clipboard
      .writeText(text)
      .then(function () {
        console.debug("Text copied to clipboard");
      })
      .catch(function (err) {
        console.error("Failed to copy text to clipboard: ", err);
      });
  }

  /**
   * Finds all elements in the document whose class attribute starts with the
   * given regex pattern.
   * @param {RegExp} classNameRegex the regex pattern to match against the
   *     element's class attribute
   * 注意：这个选择器是根据class属性的值匹配的。如果元素有多个class选择器，但是class属性只有一个哦
   * @return {!Array.<!Element>} an array of elements that match the given regex
   *     pattern
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
   * 不知道为什么 class~=name，会找不到
   */
  function findElementsByClassRegex(classNameRegex) {
    const selector = `*[class*="${classNameRegex.source}"]`;
    return document.querySelectorAll(selector);
  }

  function checkIsChartMode() {
    let el = findElementsByClassRegex(/chartsContent/);
    return el && el.length > 0;
  }
  // 显示Toast消息
  function showToast(message) {
    // 创建一个div元素作为Toast消息容器
    var toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "5%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "#fff";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";

    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      document.body.removeChild(toast);
    }, 2000);
  }

  function insertStyleNode() {
    let style_node_id = "_my_button_style";

    // 获取具有ID为myDiv的节点
    var el = document.getElementById(style_node_id);

    // 从body中删除myDiv节点
    if (el) {
      document.body.removeChild(el);
    }

    // 创建一个style元素
    var style = document.createElement("style");

    style.id = style_node_id;
    // 设置style元素的内容为CSS代码
    style.innerHTML = `
      ._LC-button {
        border: none;
        padding: 3px 5px;
        background-color: #007bff4f;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        font-size: 10px;
      }
        ._LC-button:hover {
        background-color: #f0f3fa;
      }

      ._LC-button:active {
        background-color: #0033664f;
      }

      ._LC-batch-copy-button{
        border-radius: 6px;
        font-size: 12px;
        min-width: 34px;
        --ui-lib-light-button-default-color-bg: #0000;
        --ui-lib-light-button-default-color-content: #131722;
        --ui-lib-light-button-default-color-border: #e0e3eb;
        align-items: center;
        background-color: var(--ui-lib-light-button-color-bg, var(--ui-lib-light-button-default-color-bg));
        border-color: var(--ui-lib-light-button-color-border, var(--ui-lib-light-button-default-color-border));
        border-style: solid;
        border-width: 1px;
        box-sizing: border-box;
        color: var(--ui-lib-light-button-color-content, var(--ui-lib-light-button-default-color-content));
        cursor: default;
        display: flex;
        justify-content: center;
        min-width: 36px;
        outline: none;
        padding: 0;
        margin-right: 0;
      }

      ._LC-chart-link,._LC-copy-button,._LC-finviz-add-remove-blacklist-button{
        font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif;
        font-feature-settings: "tnum" on, "lnum" on;
        --ui-lib-typography-line-height: 16px;
        line-height: var(--ui-lib-typography-line-height);
        --ui-lib-typography-font-size: 12px;
        background-color: #f0f3fa;
        border:none;
        border-radius: 6px;
        margin-left:3px;
        box-sizing: border-box;
        color: #131722;
        display: block;
        font-size: var(--ui-lib-typography-font-size);
        font-style: normal;
        font-weight: 600;
        max-width: 96px;
        min-width: 36px;
        overflow: hidden;
        padding: 4px 8px;
        text-align: center;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
        cursor:pointer;
      }
      
    `;

    // 将style元素添加到body中
    document.body.appendChild(style);
  }

  // 插入“复制全部”按钮到页面
  function insertCopyAllButton() {
    let buttonWrapper = document.querySelector(
      ".innerControlContainer-k3vjdDEs"
    );
    if (!buttonWrapper) {
      buttonWrapper = document.getElementById("js-screener-container");
    }
    if (!buttonWrapper) {
      buttonWrapper = document.body;
    }

    // 获取具有ID为myDiv的节点
    var batch_copy_button = document.getElementById(batch_button_id);

    // 从body中删除myDiv节点
    if (batch_copy_button) {
      buttonWrapper.removeChild(batch_copy_button);
    }

    // 创建一个div元素
    batch_copy_button = document.createElement("button");

    // 设置div元素的属性和样式
    batch_copy_button.id = batch_button_id;
    batch_copy_button.classList.add("_LC-button");
    batch_copy_button.classList.add("_LC-batch-copy-button");
    batch_copy_button.innerHTML = `<svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><rect x="11.13" y="17.72" width="33.92" height="36.85" rx="2.5"/><path d="M19.35,14.23V13.09a3.51,3.51,0,0,1,3.33-3.66H49.54a3.51,3.51,0,0,1,3.33,3.66V42.62a3.51,3.51,0,0,1-3.33,3.66H48.39"/></svg>`;
    // 将div元素插入到body中

    batch_copy_button.title = "批量复制股票代码";

    buttonWrapper.appendChild(batch_copy_button);
    batch_copy_button.addEventListener("click", function (event) {
      const elements = getSymbolItems();
      const texts = [];
      elements.forEach((el) => {
        texts.push(el.innerText);
      });

      if (texts.length === 0) {
        showToast("页面中没有找到代码，请检查脚本选择器");
      } else {
        const res = texts.join(", ");
        copyToClipboard(res);
        // 示例用法
        if (checkIsChartMode()) {
          showToast(
            `已复制 ${texts.length} 个代码到剪贴板。图表模式下可能无法全选复制，请切换到列表模式下复制全部。`
          );
        } else {
          showToast(`已复制 ${texts.length} 个代码到剪贴板`);
        }
      }
    });
  }

  function insertItemButtons() {
    let nodes = findElementsByClassRegex(/symbolNameBox-/);

    if (!nodes.length) {
      console.debug(`${ext_name} not found chart items`);
      return;
    }

    nodes.forEach((e) => {
      let target_el = e;
      let item_wrapper = e.parentNode;
      let href = e.getAttribute("href") || "";

      let exchange_symbol = href
        .replaceAll(/^\/symbols\//g, "")
        .replaceAll(/\/$/g, "")
        .replace("-", ":");

      let symbol = exchange_symbol.replace(/^\w+\:/, "");

      // 添加移除黑名单
      let add_remove_blacklist_button = item_wrapper.querySelector(
        "._LC-finviz-add-remove-blacklist-button"
      );
      if (!add_remove_blacklist_button) {
        add_remove_blacklist_button = document.createElement("button");
        add_remove_blacklist_button.classList.add("_LC-button");
        add_remove_blacklist_button.classList.add(
          "_LC-finviz-add-remove-blacklist-button"
        );
        if (blacklist.includes(symbol)) {
          add_remove_blacklist_button.innerText = "-BL";
        } else {
          add_remove_blacklist_button.innerText = "+BL";
        }
        add_remove_blacklist_button.title = "添加/移除黑名单";
        item_wrapper.appendChild(add_remove_blacklist_button);

        add_remove_blacklist_button.addEventListener("click", function (event) {
          if (blacklist.includes(symbol)) {
            let index = blacklist.indexOf(symbol);
            if (index !== -1) {
              blacklist.splice(index, 1);
            }
            add_remove_blacklist_button.innerText = "+BL";
          } else {
            add_remove_blacklist_button.innerText = "-BL";
            blacklist.push(symbol);
          }

          add_or_remove_blacklist_icon(target_el, symbol);
          localStorage.setItem("blacklist", JSON.stringify(blacklist));
        });
      }

      // 复制按钮
      let copybtn = item_wrapper.querySelector("._LC-copy-button");
      if (!copybtn) {
        copybtn = document.createElement("button");
        copybtn.title = "复制股票代码";
        copybtn.innerText = "复制";
        copybtn.classList.add("_LC-button");
        copybtn.classList.add("_LC-copy-button");

        copybtn.addEventListener("click", function (event) {
          copyToClipboard(symbol);
          showToast(`已复制代码：${symbol}`);
        });
        item_wrapper.appendChild(copybtn);
      }

      // 跳转tv图表按钮。
      let tv_link = item_wrapper.querySelector("._LC-tv-chart-link");
      if (!tv_link) {
        let uri_symbol = encodeURIComponent(exchange_symbol);
        tv_link = document.createElement("a");
        tv_link.classList.add("_LC-button");
        tv_link.classList.add("_LC-chart-link");
        tv_link.classList.add("_LC-tv-chart-link");
        tv_link.href = `https://cn.tradingview.com/chart/700qUKjc/?symbol=${uri_symbol}`;
        tv_link.target = "_blank";
        tv_link.innerText = "图表";
        tv_link.title = "查看tradingview图表";
        item_wrapper.appendChild(tv_link);
      }
      // 跳转finviz图表按钮。
      let finviz_link = item_wrapper.querySelector("._LC-finviz-chart-link");
      if (!finviz_link) {
        finviz_link = document.createElement("a");
        finviz_link.classList.add("_LC-button");
        finviz_link.classList.add("_LC-chart-link");
        finviz_link.classList.add("_LC-finviz-chart-link");

        finviz_link.href = `https://finviz.com/quote.ashx?t=${symbol}&p=d`;
        finviz_link.target = "_blank";
        finviz_link.innerText = "finviz";
        finviz_link.title = "查看finviz图表";
        item_wrapper.appendChild(finviz_link);
      }

      // 插入黑名单标志
      add_or_remove_blacklist_icon(target_el, symbol);
    });
  }

  // 添加或移除黑名单标志
  function add_or_remove_blacklist_icon(target_el, symbol) {
    let item_wrapper = target_el.parentNode;
    let blacklist_icon = item_wrapper.querySelector(
      "._LC-finviz-blacklist-icon"
    );
    if (blacklist.includes(symbol)) {
      if (!blacklist_icon) {
        target_el.insertAdjacentHTML("afterend", blacklist_icon_svgstr);
      }
    } else {
      let blacklist_icon = item_wrapper.querySelector(
        "._LC-finviz-blacklist-icon"
      );
      blacklist_icon && blacklist_icon.remove();
    }
  }

  function init_blacklist() {
    let blacklist_str = localStorage.getItem("blacklist");
    console.debug("初始化blacklist", blacklist);
    if (blacklist_str) {
      try {
        let list = JSON.parse(blacklist_str);
        if (Array.isArray(list)) {
          blacklist = [...chinese_stocks, ...list];
        }
      } catch (error) {}
    } else {
      blacklist = [...chinese_stocks];
    }
  }
  // 初始化blacklist

  init_blacklist();

  insertStyleNode();
  insertCopyAllButton();

  let _interval = setInterval(function () {
    console.debug(`${ext_name}定时检测item按钮是否创建`);
    let nodes = document.querySelectorAll("._LC-chart-link");
    // if (nodes && nodes.length > 0) {
    //     console.debug(`${ext_name}item按钮创建完成`)
    //     // if (_interval) {
    //     //     clearInterval(_interval)
    //     //     _interval = null
    //     // }
    // } else {
    // }

    let items = findElementsByClassRegex(/chartContainer/);

    if (items && items.length) {
      insertItemButtons();
    } else {
      console.debug(
        `${ext_name}没有找到需要添加按钮的item，请检查class属性是否正确： .chartContainer `
      );
    }
  }, 5000);
})();
