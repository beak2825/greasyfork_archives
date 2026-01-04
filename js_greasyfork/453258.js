// ==UserScript==
// @name         「Feedly」Less Items
// @namespace    https://www.wdssmq.com/
// @version      1.0.0
// @author       沉冰浮水
// @description  Feedly 分次标记已读
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.net/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2F*
// @match        https://feedly.com/i/my
// @match        https://feedly.com/i/saved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453258/%E3%80%8CFeedly%E3%80%8DLess%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/453258/%E3%80%8CFeedly%E3%80%8DLess%20Items.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint-disable */

(function () {
  'use strict';

  const gm_name = "LessItems";

  const curDate = new Date();

  // -------------------------------------

  const _curUrl = () => { return window.location.href };
  const _sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}]\n`, ...args);

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }

  // -------------------------------------

  // 添加内容到指定元素后面
  function fnAfter($ne, e) {
    const $e = typeof e === "string" ? $n(e) : e;
    $e.parentNode.insertBefore($ne, $e.nextSibling);
  }

  const objDataSet = {
    getDataSet(el, key, def) {
      return el.dataset[key] || def;
    },
    setDataSet(el, key, val) {
      el.dataset[key] = val;
    },
  };

  const gob = {
    intBlocks: 0,
    maxBlocks: 4,
    intUnread: 0,
    minUnread: 37,
    bolStopScroll: false,
    curTimeMS: curDate.getTime(),
    stopScroll(preCaB = () => { }) {
      if (!gob.bolStopScroll) {
        preCaB();
        gob.bolStopScroll = true;
        gob.setDataSet();
      }
    },
    reset() {
      gob.intBlocks = 0;
      gob.bolStopScroll = false;
    },
    setDataSet() {
      objDataSet.setDataSet($n("#header-title"), "stopScroll", "true");
    },
    getDataSet() {
      return objDataSet.getDataSet($n("#header-title"), "stopScroll", "false");
    },
  };

  function fnGetItems($baseEL = "body") {
    let $items = $na(".list-entries article");
    if ($baseEL !== "body") {
      $items = $baseEL.querySelectorAll("article");
    }
    return $items;
  }

  async function fnAutoScroll($items, $blocks) {
    const $h2End = $n(".list-entries > h2");
    const $endItem = $items[$items.length - 1];

    // // 阻止向下滚动
    // if (gob.intAutoScroll > 4 && !$h2End) {
    //   $blocks[$blocks.length - 1].scrollIntoView();
    // }

    if (!gob.bolStopScroll && $h2End) {
      $h2End.scrollIntoView();
    }
    if (gob.intBlocks > gob.maxBlocks || $h2End || !$endItem) {
      gob.stopScroll(
        () => {
          _log("fnAutoScroll", "自动滚动停止");
          _log("fnAutoScroll", gob);
        },
      );
      return;
    }
    // dateset 不存在时，执行
    if ($endItem.dataset.scrollIntoView !== "done") {
      $endItem.scrollIntoView();
      gob.intBlocks = $blocks.length;
      $endItem.dataset.scrollIntoView = "done";
    }
    await _sleep(1000);

    //   // 隐藏最新的四个区块
    // if (gob.intBlocks <= gob.maxBlocks && !$h2End) {
    //   [].forEach.call($blocks, ($e, i) => {
    //     // 隐藏
    //     // $e.remove();
    //     $e.style.display = "none";
    //     $e.classList.add("hidden");
    //   });
    // }

    fnLessItems();
  }

  // 构建侧边栏
  function fnBuildSideBar($block) {
    let $el = $n(".list.list-feed");
    if (!$el) {
      const $cols = $na(".row > div");
      [].forEach.call($cols, ($e, i) => {
        // 获取 $e 的类名
        $e.className;
        const text = $e.innerText;
        if (text === "") {
          $e.innerHTML = "<div><div class=\"list list-feed\"></div>";
          $el = $n(".list.list-feed");
        }
      });
    }
    // 设置 fixed 定位
    $el.parentNode.style.position = "fixed";
    // 获取 $block 类名
    const strClassBlock = $block.className.replace("EntryList__chunk", "").trim();
    const strClassBtn = "btn-" + strClassBlock;
    // _log(strClassBlock, `.${strClassBtn}`);
    // _log("fnBuildSideBar", $n(`.${strClassBtn}`));
    // 判断是否隐藏
    const isHidden = $block.classList.contains("hidden");
    if (!isHidden && !$n(`.${strClassBtn}`) && $na(".btn-LessItem").length < 4) {
      // 追加元素 a
      const $a = document.createElement("a");
      $a.href = "javascript:void(0);";
      $a.className = strClassBtn;
      $a.classList.add("btn-LessItem");
      $a.innerHTML = strClassBlock;
      $a.style.display = "block";
      // 边框和内边距
      $a.style.border = "1px solid rgba(0,0,0,0.15)";
      $a.style.padding = "3px 10px";
      // 圆角和外边距
      $a.style.borderRadius = "3px";
      $a.style.margin = "3px 0";
      // 点击事件
      $a.addEventListener("click", function () {
        $n("#feedlyPageFX").style.maxWidth = "1024px";
        const $items = fnGetItems($block);
        const intPer = Math.floor($items.length / 4);
        const intClick = parseInt($block.dataset.click) || 0;
        const curOffset = intClick * intPer;
        // _log({
        //   intPer,
        //   intClick,
        //   curOffset,
        // });
        $items[curOffset].scrollIntoView();
        // $items[curOffset].style.borderTop = "4px solid #444";
        const $btnList = [];
        let strAlert = "";
        for (let i = 0; i < intPer; i++) {
          const element = $items[i + curOffset];
          if (!element) {
            continue;
          }
          // 调整样式以减少页面占用
          element.querySelector(".MagazineEntry").style.marginBottom = 0;
          element.querySelector(".MagazineEntry").style.maxWidth = "720px";
          // 获取标记已读按钮
          const $btn = element.querySelector(
            ".EntryMarkAsReadButton",
          );
          $btnList.push($btn);
          const $a = element.querySelector(".MagazineEntry__content > a");
          strAlert += $a.textContent + "\n\n";
        }
        $block.dataset.click = intClick + 1;
        setTimeout(() => {
          // 确认对话框
          // if (confirm(strAlert)) {
          $btnList.forEach(($btn) => {
            $btn.click();
          });
          if (curOffset + intPer >= $items.length) {
            $a.style.display = "none";
            return;
          }
          // }
        }, 1000);
        // alert(strAlert);
        // _log("fnBuildSideBar", $items);
        // _log("fnBuildSideBar", $btnList);
      });
      // 添加到 $el 后边
      fnAfter($a, $el);
    }
  }

  function fnLessItems() {
    // 判断页面地址
    if (_curUrl().indexOf("subscription/") === -1) {
      return;
    }
    // 获取未读数
    gob.intUnread = parseInt($n("span.MarkAsReadButton__unread-count").textContent);
    // _log("fnLessItems", intUnread);
    // 判断未读数
    if (gob.intUnread < gob.minUnread) {
      return;
    }
    if (gob.bolStopScroll) {
      if (gob.getDataSet() == "false") {
        gob.reset();
      } else {
        return;
      }
    }
    const $items = fnGetItems();
    const $blocks = $na(".list-entries .EntryList__chunk");
    fnAutoScroll($items, $blocks);
    [].forEach.call($blocks, function ($e, i) {
      // 设置下边框
      $e.style.borderBottom = "11px solid #444";
      // 设置下边距
      $e.style.marginBottom = "11px";
      // 分配一个不重复的 class
      $e.classList.add("LessItem" + i);
      // $e.classList.add("LessItem");
      fnBuildSideBar($e);
    });
  }

  // 加载完成后执行
  window.onload = function () {
    fnOnLoad();
  };

  async function fnOnLoad() {
    await _sleep(1000);

    // 判断加载完成
    if (!$n("#feedlyFrame")) {
      fnOnLoad();
      _log("fnOnLoad", "页面加载中");
      return;
    }

    // 滚动条滚动时触发
    if ($n("#feedlyFrame") && $n("#feedlyFrame").dataset.LessItem !== "done") {
      $n("#feedlyFrame").dataset.LessItem = "done";
      // $n("#feedlyFrame").addEventListener("mouseover", fnLessItems);
      $n("#feedlyFrame").addEventListener("scroll", fnLessItems);
      _log("fnOnLoad", "列表滚动监听");
    }
  }

})();
