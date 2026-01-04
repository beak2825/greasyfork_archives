// ==UserScript==
// @name         「Feedly」中键标记已读 + 收藏导出为*.url
// @namespace    https://www.wdssmq.com/
// @version      1.0.7
// @author       沉冰浮水
// @description  新标签页打开条目时自动标记为已读，收藏计数
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.com/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://feedly.com/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381793/%E3%80%8CFeedly%E3%80%8D%E4%B8%AD%E9%94%AE%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB%20%2B%20%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA%E4%B8%BA%2Aurl.user.js
// @updateURL https://update.greasyfork.org/scripts/381793/%E3%80%8CFeedly%E3%80%8D%E4%B8%AD%E9%94%AE%E6%A0%87%E8%AE%B0%E5%B7%B2%E8%AF%BB%20%2B%20%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA%E4%B8%BA%2Aurl.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint-disable */

(function () {
  'use strict';

  const gm_name = "feedly";

  const curDate = new Date();
  // ---------------------------------------------------
  const _curUrl = () => window.location.href;
  function _getDateStr(date = curDate) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("zh-CN", options).replace(/\//g, "-");
  }
  // ---------------------------------------------------
  const _log = (...args) => console.log(`[${gm_name}]|`, ...args);
  const _warn = (...args) => console.warn(`[${gm_name}]|`, ...args);
  // ---------------------------------------------------
  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }
  // ---------------------------------------------------
  function fnElChange(el, fn = () => { }) {
    const observer = new MutationObserver((mutationRecord, mutationObserver) => {
      // _log('mutationRecord = ', mutationRecord);
      // _log('mutationObserver === observer', mutationObserver === observer);
      fn(mutationRecord, mutationObserver);
      // mutationObserver.disconnect();
    });
    observer.observe(el, {
      // attributes: false,
      // attributeFilter: ["class"],
      childList: true,
      // characterData: false,
      subtree: true,
    });
  }
  function fnFindDom(el, selector) {
    return el.querySelectorAll(selector);
  }
  // 原生 js 实现 jquery 的 closest 方法
  function fnFindDomUp(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        break;
      }
      el = el.parentElement;
    }
    return el;
  }

  // 自动标记已读
  (() => {
    if (!$n("#root") || $n("#root").dataset.MarkRead === "bind") {
      return;
    }
    // _log("fnAutoMark", "自动标记已读");
    $n("#root").dataset.MarkRead = "bind";

    // 根据事件返回需要的 dom 元素
    const fnEventFilter = (eType, eTgt) => {
      // _log("fnEventFilter", eType, eTgt);

      let pick = false;
      let objRlt = null;
      const objDef = {
        $entry: null,
        $btn: null,
      };
      if (eType === "mouseup") {
        if (
          eTgt.classList.contains("EntryTitle") && eTgt.nodeName === "DIV"
        ) {
          const $entry = fnFindDomUp(eTgt, "article.entry");
          const $btn = $entry.querySelector("button.EntryMarkAsReadButton");
          // _log("fnEventFilter", $entry, $btn);
          objRlt = {
            // 当前条目元素
            $entry,
            // 标记已读的按钮
            $btn,
          };
          pick = true;
        }
      }
      else if (eType === "mouseover") {
        if (eTgt.nodeName === "ARTICLE" && eTgt.className.includes("entry")) {
          objRlt = {
            // 当前内容条目元素
            $entry: eTgt,
            // 标记已读的按钮
            $btn: eTgt.querySelector("button.EntryMarkAsReadButton"),
          };

          // _log("fnEventFilter", "移入");
          // _log("fnEventFilter", eTgt.dataset.leaveCount, typeof eTgt.dataset.leaveCount);

          const intLeaveCount = Number.parseInt(eTgt.dataset.leaveCount);

          // 已经触发过 leave 事件时才通过
          pick = intLeaveCount >= 1;
          if (pick) {
            return objRlt;
          }

          // _log("fnEventFilter", intLeaveCount);

          if (!Number.isNaN(intLeaveCount)) {
            // _log("fnEventFilter", "已绑定移出事件");
            return objDef;
          }

          // 绑定移出事件
          eTgt.addEventListener("mouseleave", () => {
            // _log("fnEventFilter", "移出");
            const intLeaveCount = Number.parseInt(eTgt.dataset.leaveCount);
            if (intLeaveCount === 0) {
              // await _sleep(1000);
              eTgt.dataset.leaveCount = "1";
            }
          }, false);

          // 设置初始值
          eTgt.dataset.leaveCount = 0;
        }
      }
      if (pick) {
        return objRlt;
      }
      return objDef;
    };
    // 事件处理函数
    const fnEventHandler = (event) => {
      // 限制鼠标在元素右侧移入才会触发
      if (event.type === "mouseover") {
        const intDiff = Math.abs(event.offsetX - event.target.offsetWidth);
        if (intDiff > 17) {
          return;
        }
      }
      const { $entry, $btn } = fnEventFilter(event.type, event.target);
      if (!$entry || !$btn) {
        return;
      }
      // 判断是否含有指定类名
      if (!$entry.className.includes("entry--read")) {
        _log("fnMarRead", event.button, "自动标记已读");
        $btn.click();
      }
    };
    // 绑定监听事件
    $n("#root").addEventListener("mouseup", fnEventHandler, false);
    $n("#root").addEventListener("mouseover", fnEventHandler, false);
  })();

  // 拿回订阅源地址
  // 绑定监听事件到 div#box 上
  $n("#root").addEventListener("mouseup", (event) => {
    // 输出触发事件的元素
    // 根据内容判断是否执行相应操作
    const elText = event.target.innerHTML;
    if (
      // elText.indexOf("Feed not found") > -1 ||
      elText.includes("Wrong feed URL")
    ) {
      // 内部再输出一次确定判断条件正确
      _log("elText", elText);

      const curUrl = decodeURIComponent(_curUrl()).replace("https://feedly.com/i/subscription/feed/", "");

      _log("curUrl", curUrl);

      // 拿到解码后的订阅源地址
      // const curUrl = ((url) => {
      //   return url.replace("https://feedly.com/i/subscription/feed/", "");
      // })(decodeURIComponent(curUrl));
      // 输出到页面中
      $n("#feedlyPageFX h2").insertAdjacentHTML(
        "beforeend",
        `<div class="sub">${curUrl}</div>`,
      );
    }
  }, false);

  const curTime = Math.floor(curDate.getTime() / 1000);
  const curHours = Math.floor(curTime / 3600);
  // const cur4Hours = Math.floor(curTime / (60 * 60 * 4));
  const cur4Minutes = Math.floor(curTime / 240);

  // localStorage 封装
  const lsObj = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key, def = "") => {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return def;
    },
  };

  // 数据读写封装
  const gobInfo = {
    // key: [默认值, 是否记录至 ls]
    $$Stars: [null, 0],
    bolUpd: [false, 0],
    bolReset: [false, 1],
    cntStars: [0, 0],
    diffStars: [{ decr: 0, incr: 0 }, 1],
    lstStars: [0, 1],
    // 记录输出过的日志
    logHistory: [[], 0],
  };
  // decrease 减少
  // increase 增加
  const gob = {
    _lsKey: `${gm_name}_data`,
    _bolLoaded: false,
    _time: {
      cycle: 0,
      rem: 0,
    },
    data: {},
    // 初始
    init() {
      // 根据 gobInfo 设置 gob 属性
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          this.data[key] = item[0];
          Object.defineProperty(this, key, {
            // value: item[0],
            // writable: true,
            get() { return this.data[key] },
            set(value) { this.data[key] = value; },
          });
        }
      }
      return this;
    },
    // 读取
    load() {
      if (this._bolLoaded) {
        return;
      }
      const lsData = lsObj.getItem(this._lsKey, this.data);
      _log("[log]gob.load()\n", lsData);
      for (const key in lsData) {
        if (Object.hasOwnProperty.call(lsData, key)) {
          const item = lsData[key];
          this.data[key] = item;
        }
      }
      this._bolLoaded = true;
    },
    // 保存
    save() {
      const lsData = {};
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          if (item[1]) {
            lsData[key] = this.data[key];
          }
        }
      }
      _log("[log]gob.save()", lsData);
      lsObj.setItem(this._lsKey, lsData);
    },
  };

  // 初始化
  gob.init().load();

  // 星标条目获取
  gob.GetStarItems = () => {
    const $listWrap = $n("div.StreamPage");
    // _log("gob.GetStarItems", $listWrap);
    if ($listWrap) {
      gob.$$Stars = $listWrap.querySelectorAll("article a.EntryTitleLink");
      gob.cntStars = gob.$$Stars.length;
      // _log("gob.GetStarItems", gob.$$Stars, gob.cntStars);
    }
  };

  // 获取星标条目 nodeList, 用于交换位置
  gob.GetStarNodes = () => {
    return $na(".StreamPage .entry.titleOnly");
  };

  // 获取条目列表
  gob.GetEntriesList = () => {
    const $$entry = $na("article.entry.magazine, article.entry.titleOnly");
    // _log("gob.GetEntriesList", $$entry);
    return $$entry;
  };

  // 输出日志，只输出一次
  gob.LogOnce = (key, value) => {
    if (gob.logHistory.includes(key)) {
      return;
    }
    gob.logHistory.push(key);
    _log(key, value);
  };

  // nodeList 转换为 Array
  function fnNodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  // 构造 Bash Shell 脚本
  function fnMKShell(arrList, prefix = "") {
    const curDateStr = _getDateStr();
    const _lenTitle = (title) => {
      // 获取长度，中文算两个字符
      const len = title.length;
      const len2 = title.replace(/[\u4E00-\u9FA5]/g, "").length;
      return len2 + (len - len2) * 2;
    };
    let strRlt
      = "if [ ! -d \"prefix-date\" ]; then\n"
        + "mkdir prefix-date\n"
        + "fi\n"
        + "cd prefix-date\n\n";
    strRlt = strRlt.replace(/prefix/g, prefix);
    strRlt = strRlt.replace(/date/g, curDateStr);

    /**
     * e {title:"", href:""}
     */
    arrList.forEach((e, i) => {
      const serial = i + 1;
      // _log(e);

      // 移除不能用于文件名的字符
      let title = e.title || e.textContent;
      title = title.replace(/[\\/:*!<>]|\?\]/g, "");
      title = title.replace(/["'\s]/g, "");
      // _log(title);

      const lenTitle = _lenTitle(title);
      // 判断太长时截取
      if (lenTitle >= 137) {
        title = title.substring(0, 69); // 截取前 69 个字符
      }

      // 获取文章链接
      const href = e.href || e.url;

      // url 文件名
      const urlFileName = `${serial}丨${title}.url`;

      strRlt += `echo [InternetShortcut] > "${urlFileName}"\n`;
      strRlt += `echo "URL=${href}" >> "${urlFileName}"\n`;
      strRlt += "\n";
    });

    {
      strRlt += "exit\n\n";
    }

    return strRlt;
  }

  // 星标文章导出为 *.url 文件
  $n("#root").addEventListener("mouseup", (event) => {
    gob.GetStarItems();
    const $target = event.target;
    // 判断是 h2 标签
    if ($target.tagName !== "H2") {
      return;
    }
    // console.log($target, $target.textContent);
    const curText = $target.textContent.trim().toUpperCase();
    if (curText.includes("END OF FEED")) {
      const listItems = fnNodeListToArray(gob.$$Stars);
      GM_setClipboard(fnMKShell(listItems, "feedly"));
      $target.textContent = "已复制到剪贴板";
    }
  }, false);

  // 判断当前地址是否是收藏页
  function fnCheckUrl() {
    if (_curUrl() === "https://feedly.com/i/saved") {
      return true;
    }
    return false;
  }

  function fnCheckControl(diff) {
    const iTime = curHours;
    const modTime = iTime % 4;
    gob._time.cycle = iTime;
    gob._time.rem = modTime;
    // _log("fnCheckControl", JSON.stringify(diff), iTime, modTime);
    // diff.decr 累计已读
    // diff.incr 累计新增
    if (diff.decr >= 17 && diff.decr - diff.incr >= 4) {
      if (modTime === 0) {
        return "reset";
      }
      else {
        return "lock";
      }
    }
    return "default";
  }

  // 星标变动控制
  function fnControl() {
    const $end = $n(".list-entries > h2");
    if (!$end) {
      gob.LogOnce("fnControl_34", "页面加载中");
      return false;
    }

    // 读取 gob 值备用
    const strReset = gob.bolReset.toString();
    let diffStars = gob.diffStars;

    // 解锁重置判断
    if (gob.bolReset) {
      diffStars = { decr: 0, incr: 0 };
    }
    // decrease 减少
    // increase 增加

    // 星标变化计数
    const diff = gob.cntStars - gob.lstStars;

    // 写入新的星标数
    gob.lstStars = gob.cntStars;

    // 初始化时直接返回
    if (diff === gob.cntStars) {
      gob.save();
      return true;
    }

    // 判断变化状态
    if (diff > 0) {
      // 新增星标计数
      diffStars.incr += Math.abs(diff);
    }
    else {
      // 已读星标计数
      diffStars.decr += Math.abs(diff);
    }

    gob.bolReset = ((diff) => {
      if (fnCheckControl(diff) === "reset") {
        return true;
      }
      return false;
    })(diffStars);

    // 更新 localStorage 存储
    if (diff !== 0 || strReset !== gob.bolReset.toString()) {
      gob.diffStars = diffStars;
      gob.save();
    }

    return true;
  }

  // 收藏数 View
  function fnViewStars() {
    // gob.cntStars = fnGetItems(gob);
    gob.GetStarItems();
    // _log("fnViewStars", gob.cntStars);
    const strText = `Read later（${gob.cntStars} 丨 -${gob.diffStars.decr} 丨 +${gob.diffStars.incr}）（${gob._time.cycle} - ${gob._time.rem}）`;
    $n("h1 #header-title").innerHTML = strText;
    if ($n("header.header h2")) {
      $n("header.header h2").innerHTML = strText;
    }
    $n("#header-title").innerHTML = strText;
  }

  gob.pickRule = {
    forMod: 13,
    minPick: 4,
    maxPick: 7,
    lstPick: 0,
    pickList: [],
    随机次数: 0,
  };

  GM_addStyle(`
  .pick,.pick:hover {
    background-color: #ddd !important;
  }
  .un-mark {
    background-color: #f6f7f8 !important;
  }
  .lock {
    color: transparent !important;
  }
`);

  // 随机交换两个节点的位置
  function fnRndNodeList(nodeList) {
    let lstNode = nodeList[0];
    const parent = nodeList[0].parentNode;
    // console.log("fnRndNodeList", parent);
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      if (Math.random() > 0.5) {
        parent.insertBefore(node, lstNode);
      }
      else {
        parent.insertBefore(lstNode, node);
      }
      lstNode = node;
    }
  }

  // 按规则给星标条目着色
  function fnColorStars(offset = 0) {
    // begin fnColorStars
    const $stars = gob.$$Stars;
    const isLock = fnCheckControl(gob.data.diffStars) === "lock";
    // console.log("fnColorStars", fnCheckControl(gob.data.diffStars), isLock);
    const oConfig = gob.pickRule;
    const $$pick = $na(".pick");
    // ----------------------------
    let pickCount = $$pick.length;
    if (pickCount >= oConfig.minPick) {
      gob.LogOnce("fnColorStars_37", "已经选够了");
      return;
    }
    // ----------------------------
    if ($stars.length <= 39 && oConfig.随机次数 <= 3) {
      // 遍历 dom 节点，随机交换位置
      fnRndNodeList(gob.GetStarNodes());
      gob.pickRule.随机次数 += 1;
      return;
    }
    // ----------------------------
    const fnPick = ($item, i) => {
      if (i > 1 && i - oConfig.lstPick < oConfig.minPick / 2) {
        return;
      }
      oConfig.lstPick = i;
      $item.classList.add("pick");
      pickCount += 1;
    };
    // ----------------------------
    [].forEach.call($stars, ($e, i) => {
      // begin forEach
      const $ago = fnFindDom(fnFindDomUp($e, "div.SelectedEntryScroller"), ".ago");
      const href = $e.href;
      const hash = Number.parseInt((href + $ago.innerHTML).replace(/\D/g, ""));
      // _log("fnColorStars", $ago, href, hash);
      const $item = fnFindDomUp($e, ".entry");
      if ($item.classList.contains("pick")) {
        oConfig.lstPick = i;
        return;
      }
      // ----------------------------
      const $saved = fnFindDom($item, ".EntryReadLaterButton--saved");
      if (!$saved) {
        $item.classList.add("un-mark");
      }
      // ----------------------------
      if (oConfig.pickList.includes(hash)) {
        // fnPick($item);
        return;
      }
      // ----------------------------
      const bolPick = (() => {
        let rlt = true;
        if (i >= 37) {
          rlt = false;
        }
        if (pickCount >= oConfig.maxPick) {
          rlt = false;
        }
        return rlt;
      })();
      // ----------------------------
      const intNum = Number.parseInt(hash + cur4Minutes) + offset;
      if (intNum % oConfig.forMod === 0 && bolPick) {
        oConfig.pickList.push(hash);
        fnPick($item, i);
      }
      else {
        if (isLock || i >= 37) {
          $item.classList.add("lock");
          [].forEach.call(fnFindDom($item, "a, span, div>svg, .summary"), ($ite) => {
            $ite.classList.add("lock");
          });
        }
      }
      // end forEach
    });
    // ----------------------------
    if (pickCount <= oConfig.minPick) {
      if (offset < oConfig.forMod) {
        fnColorStars(offset + 1);
      }
      else {
        _log("fnColorStars", "未能选够");
        _log("fnColorStars", oConfig);
        oConfig.pickList = [];
        oConfig.lstPick = 0;
      }
    }
    // end fnColorStars
  }

  // 滚动条滚动时触发
  function fnOnScroll() {
    fnViewStars();
    fnColorStars();
  }

  // 处理器函数
  function fnHandler(e = null) {
    if (!fnCheckUrl()) {
      return;
    }
    // 判断是否为滚动事件
    if (e && e.type === "scroll") {
      fnOnScroll();
    }
    // 更新 ls 记录
    let bolUpd = false;
    if (!gob.bolUpd) {
      bolUpd = fnControl();
    }
    if (bolUpd) {
      _warn("fnHandler", gob.data);
      gob.bolUpd = true;
    }
  }

  // 星标部分入口函数
  function fnMain(_record, observer) {
    if (!fnCheckUrl()) {
      return;
    }
    // 随机直接返回
    if (Math.random() > 0.6) {
      return;
    }
    gob.GetStarItems();
    if (gob.cntStars === 0) {
      return;
    }
    gob.LogOnce("_laterCtrl fnMain", { cntStars: gob.cntStars });
    // observer.disconnect();
    // 绑定事件
    if ($n("#feedlyFrame") && $n("#feedlyFrame").dataset.addEL !== "done") {
      // 加载后尝试执行一次
      fnHandler();
      $n("#feedlyFrame").addEventListener("scroll", fnHandler);
      $n("#feedlyFrame").dataset.addEL = "done";
      _log("fnMain", "绑定滚动监听");
      observer.disconnect();
    }
  }

  fnElChange($n("#root"), fnMain);

  // 防止误点
  function fnStopSource(e) {
    const $target = e.target;
    if ($target.classList.contains("entry__source")) {
      // 记录触发次数到 dataset
      const intCount = $target.dataset.clickCount || 0;
      if (intCount === 0) {
        $target.dataset.clickCount = intCount + 1;
        e.preventDefault();
        e.stopPropagation();
        // e.stopImmediatePropagation();
        // alert("entry__source");
      }
    }
  }

  $n("#root").addEventListener("click", fnStopSource);

  // 条目标题处理
  function fnItemTitle($e) {
    // _log("fnItemTitle", $e);
    if ($e.dataset.ptDone) {
      return;
    }
    const origTitle = $e.textContent;
    // _log("origTitle", origTitle);
    // 定义一个函数用于获取年度及分辨率
    const fnGetVideoLabel = (videoTitle) => {
      videoTitle = videoTitle.replace("4K.", "2160p.");
      // 定义一个正则数组，用于匹配年度及分辨率
      const arrRegexp = [
        /(?<year>\d{4})\.(?<res>\d+p)\./,
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        /(?<year>\d{4})\.S\d.*?(?<res>\d+p)\./,
        /(?<year>\d{4})\.Complete\.(?<res>\d+p)\./,
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        /(?<year>\d{4})\..+?(?<res>\d+p)\./i,
      ];
      // 遍历正则数组，匹配年度及分辨率
      let objLabel = null;
      for (let i = 0; i < arrRegexp.length; i++) {
        const regexp = arrRegexp[i];
        const match = videoTitle.match(regexp);
        if (match) {
          objLabel = match.groups;
          break;
        }
      }
      return objLabel;
    };
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const arrMatch = origTitle.match(/(?<cate>\[[^\]]+\])[^[]+-(?<group>[^[]+)(?<title>\[.+\])$/);
    if (arrMatch) {
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const strCate = arrMatch.groups.cate.replace(/^\[[^)]+\(([^)]+)\)\]/, "[$1]");
      const strGroup = arrMatch.groups.group;
      const strTitle = arrMatch.groups.title;
      // 提取年度及分辨率
      const objLabel = fnGetVideoLabel(origTitle);
      const strNewTitle = `${strTitle} - ${strCate}[${objLabel?.year}][${objLabel?.res}][${strGroup}]`;
      $e.textContent = strNewTitle;
      $e.dataset.ptDone = "1";
    }
  }

  function fnItemTitleWrap() {
    const $$list = gob.GetEntriesList();
    if (!$$list.length) {
      _log("fnItemTitleWrap: No entries found");
      return;
    }
    // 遍历并查找 .EntryTitleLink
    for (let i = 0; i < $$list.length; i++) {
      const $item = $$list[i];
      const $title = $item.querySelector(".EntryTitleLink");
      if ($title) {
        fnItemTitle($title);
      }
    }
  }

  fnElChange($n("#root"), () => {
    fnItemTitleWrap();
  });

})();
