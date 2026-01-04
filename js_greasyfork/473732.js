// ==UserScript==
// @name         微信读书移动端笔记列表增强
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  添加打开/隐藏笔记面板按钮、笔记列表自动匹配当前章节进度、双击笔记跳转下一个笔记
// @author       XQH
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473732/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%AC%94%E8%AE%B0%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/473732/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%AC%94%E8%AE%B0%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // variable
  // 上一个点击的笔记列表项
  let lastNote = null;
  let doubleClickThreshold = 700;
  const DEBUG = false;

  console.log("[微信读书移动端笔记列表增强]　js加载成功");

  // 注入一个pre显示日志
  if (DEBUG) {
    let pre = document.createElement("pre");
    pre.style.position = "fixed";
    pre.style.top = "0";
    pre.style.left = "0";
    pre.style.zIndex = "10000";
    pre.style.background = "rgba(255,255,255,0.9)";
    pre.style.padding = "10px";
    pre.style.border = "1px solid #ccc";
    pre.style.maxHeight = "200px";
    pre.style.width = "200px";
    pre.style.color = "#000";
    pre.style.height = "100px";
    pre.style.overflow = "auto";
    document.body.appendChild(pre);
    window.log = function (msg) {
      pre.innerText = msg + "\n" + pre.innerText;
    };
    window.console.log = function (msg) {
      pre.innerText = msg + "\n" + pre.innerText;
    };
    // 拦截报错log
    window.console.error = function (msg) {
      pre.innerText = msg + "\n" + pre.innerText;
    };
  }
  console.log("脚本启动v5");

  initStyle();
  setTimeout(async() => {
    await waitPageLoaded();
    injectNoteButton();
    // 为页面高亮文本添加点击事件监听
    observeDOMChanges();
  }, 700);

  // 主循环，检查是否跨页笔记，跨页笔记体现为可视范围内存在上一页按钮，
  // 且当前页面未出现文本与 lastNote 相同的高亮文本
  // lastNote (最后操作的笔记项，即当前笔记项) 赋值来源
  // 1. 点击笔记列表项
  // 2. 双击高亮文本
  // setInterval(() => {
  //   // checkNeedBackPage
  //   if (lastNote) {
  //     lastNote
  //   }
  // }, 1000);

  console.log("脚本注入组件完毕");

  // side effect method
  function initStyle() {
    addStyle(`
      .wr_reader_note_panel_footer_button,
      .wr_btn.wr_btn_Big.rbb_addShelf,
      .readerFooter_button.blue,
      .reader_toolbar_color_container,
      .toolbarItem.underlineHandWrite,
      .toolbarItem.underlineStraight,
      .toolbarItem.review,
      .toolbarItem.query,
      .wr_reader_note_panel_header_wrapper,
      .toast.toast_Show {
          display: none !important;
      }
      .readerNotePanel {
          overflow-y: auto;
          position: fixed;
          bottom: 0;
          left: 25%;
          width: 80%;
          margin-left: 0;
          display: none;
          z-index: 10000;
          background: white;
      }
      .readerBottomBar {
          z-index: 9999;
      }
      `);
  }

  // 在底部栏注入笔记按钮
  function injectNoteButton() {
    let note_btn = `
      <button title="笔记" class="rbb_item wr_note">
          <span class="icon"></span>
          <span class="txt">笔记</span>
      </button>`;
    try {
      let note_btn_container = document.querySelector(
        ".readerBottomBar_content"
      );
      if (note_btn_container) {
        if (note_btn_container.querySelector(".rbb_item.wr_note")) {
          return;
        }
        note_btn_container.insertAdjacentHTML("afterbegin", note_btn);
        document
          .querySelector(".rbb_item.wr_note")
          .addEventListener("click", function (event) {
            event.stopPropagation(); // 防止点击事件冒泡到外部
            let reader_note_panel = document.querySelector(".readerNotePanel");
            if (
              reader_note_panel.style.display === "none" ||
              reader_note_panel.style.display === ""
            ) {
              reader_note_panel.style.display = "block";
              scrollNotePanelToProgress();
              setTimeout(() => {
                document.addEventListener("click", outsideClickListener);
              }, 0);
              // 为笔记面板中的笔记项添加点击事件监听，点击跳转后关闭笔记面板
              let noteItems = document.querySelectorAll(
                ".wr_reader_note_panel_item_cell_wrapper.clickable"
              );
              for (let i = 0; i < noteItems.length; i++) {
                noteItems[i].addEventListener("click", function () {
                  reader_note_panel.style.display = "none";
                  lastNote = noteItems[i];
                  checkNeedSwitchPage();
                });
              }
            } else {
              reader_note_panel.style.display = "none";
              document.removeEventListener("click", outsideClickListener);
            }
          });
      }
    } catch (error) {
      console.log("注入笔记按钮失败", error);
    }
  }

  function outsideClickListener(event) {
    let reader_note_panel = document.querySelector(".readerNotePanel");
    let btn = document.querySelector(".rbb_item.wr_note");

    if (
      !reader_note_panel.contains(event.target) &&
      !btn.contains(event.target)
    ) {
      reader_note_panel.style.display = "none";
      document.removeEventListener("click", outsideClickListener);
    }
  }

  function scrollNotePanelToProgress() {
    let inViewUnderlines = getInViewUnderline();
    if (inViewUnderlines.length > 0) {
      let jumpText = inViewUnderlines[0];
      scrollNotePanelToText(jumpText);
    } else if (lastNote) {
      lastNote.scrollIntoView({ block: "center" });
    } else {
      scrollNotePanelToText(getChapterTitle());
    }
  }

  function scrollNotePanelToText(text) {
    // 在笔记面板中查找匹配的章节
    let noteChapters = document.querySelectorAll(
      ".wr_reader_note_panel_chapter_title"
    );
    for (let i = 0; i < noteChapters.length; i++) {
      if (noteChapters[i].innerText.trim() === text) {
        console.log("Found chapter in notes: " + text);
        // 滚动到笔记面板中的该章节
        noteChapters[i].scrollIntoView({ block: "center" });
        // 如果之前有选中的笔记，滚动到该笔记
        break;
      }
    }
  }

  function getInViewUnderline(targetText) {
    let underlines = document.getElementsByClassName("wr_underline_wrapper");
    let viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    let viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    let visibleUnderlines = [];
    for (let i = 0; i < underlines.length; i++) {
      let rect = underlines[i].getBoundingClientRect();
      if (
        rect.bottom >= 0 &&
        rect.top <= viewportHeight &&
        rect.right >= 0 &&
        rect.left <= viewportWidth
      ) {
        visibleUnderlines.push(underlines[i]);
      }
    }
    console.log("visibleUnderlines", visibleUnderlines);
    let textArr = [];
    for (let i = 0; i < visibleUnderlines.length; i++) {
      visibleUnderlines[i].click();
      setTimeout(() => {
        let copyButton = document.querySelector(".toolbarItem.wr_copy");
        if (copyButton) {
          window.isCustomCopy = true;
          function onCopy(e) {
            if (window.isCustomCopy) {
              let selectionText = e.target.value;
              e.preventDefault();
              e.stopPropagation();
              window.isCustomCopy = false;
              document.removeEventListener("copy", onCopy, true);
              textArr.push(selectionText);
              if (targetText && selectionText === targetText) {
                return textArr;
              }
            }
          }
          document.addEventListener("copy", onCopy, true);
          copyButton.click();
          // 拦截可能出现的复制提示框
          let toast = document.querySelector(".toast.toast_Show");
          if (toast) {
            toast.style.display = "none";
          }
        }
      }, 100);
    }
    return textArr;
  }

  async function lastPageInView() {
    let readerHeaderButton = await whenElementExist(".readerHeaderButton");
    if (readerHeaderButton && readerHeaderButton.innerText === "上一页") {
      // 判断是否在可见范围
      let rect = readerHeaderButton.getBoundingClientRect();
      let viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top >= 0 && rect.bottom <= viewportHeight) {
        return true;
      }
    }
    return false;
  }

  async function checkNeedSwitchPage() {
    // 如果为上一页
    await waitPageLoaded();
    console.log("[检查是否需要切换页面]");
    setTimeout(async () => {
      let inViewUnderlines = getInViewUnderline();
      // 如果当前页面没有找到与上一个笔记相同的高亮文本，则跳转到上一页

      if (lastNote && !inViewUnderlines.includes(lastNote.innerText)) {
        console.log("当前页面没有与上一个笔记相同的高亮文本, 细分判断");
        // 如果存在上一页
        let isLastPageInView = await lastPageInView();
        if (isLastPageInView) {
          console.log("当前页面存在上一页按钮, 点击上一页按钮");
          elClick(document.querySelector(".readerHeaderButton"));
          // 等待页面加载完成
          await waitPageLoaded();
          setTimeout(() => {
            if (lastNote) {
              elClick(lastNote);
              checkNeedSwitchPage();
            }
          }, 500);
        } else {
          console.log("当前页面不存在上一页按钮, 尝试切换章节实现定位");
          // 再检查一遍高亮文本
          let checkInViewUnderlines = getInViewUnderline();
          if (!checkInViewUnderlines.includes(lastNote.innerText)) {
            console.log(
              "当前页面没有与上一个笔记相同的高亮文本, 尝试切换章节实现定位"
            );
            let contentList = getContentList();
            let chapterTitle = getChapterTitle();
            contentList.forEach((content, index) => {
              // chapterTitle include content
              if (chapterTitle.includes(content)) {
                // 边界判断加载下一章节再跳转笔记
                let idx = index + 1;
                if (idx >= contentList.length) {
                  idx = 0;
                }
                // 加载
                let nextChapter = document.querySelectorAll(
                  ".readerCatalog_list_item"
                )[idx];
                elClick(nextChapter);
                setTimeout(() => {
                  console.log("已加载下一章节, 尝试回到目标笔记进度");

                  elClick(lastNote);
                  // checkNeedSwitchPage();
                }, 500);
              }
            });
          }
        }
      } else {
        console.log("当前页面有与上一个笔记相同的高亮文本, 释放 lastNote");
        lastNote = null;
      }
    }, 200);
  }

  function getContentList() {
    let contentList = document.querySelectorAll(".readerCatalog_list_item");
    let contentArr = [];
    for (let i = 0; i < contentList.length; i++) {
      let content = contentList[i].innerText;
      contentArr.push(content);
    }
    return contentArr;
  }

  // 获取当前章节标题
  function getChapterTitle() {
    let chapter_title = document.querySelector(".readerTopBar_title_chapter");
    if (chapter_title) {
      return chapter_title.innerText.trim();
    }
    return "";
  }

  async function findAndClickNextNoteItem(jumpText) {
    console.log("[跳转下一个划线笔记]", "当前笔记文本 " + jumpText);

    let noteItems = document.querySelectorAll(
      ".wr_reader_note_panel_item_cell_wrapper.clickable"
    );
    let foundIndex = -1;
    for (let j = 0; j < noteItems.length; j++) {
      let noteText = noteItems[j].innerText.replace(/\s/g, "");
      console.log("[笔记文本]", noteText);

      // 移除空格和换行符
      noteText = noteText.replace(/\s/g, "");
      if (noteText === jumpText) {
        foundIndex = j;
        break;
      }
    }

    if (foundIndex >= 0) {
      let nextIndex = foundIndex + 1;
      if (nextIndex >= noteItems.length) {
        nextIndex = 0;
      }
      elClick(noteItems[nextIndex]);
      lastNote = noteItems[nextIndex];
      console.log("[下一个笔记]", lastNote.innerText);
      checkNeedSwitchPage();
    } else {
      console.log("查找下一个划线笔记文本失败: " + noteText);
    }
  }

  // 通过高亮文本的点击后的工具栏来获取高亮文本
  async function getHighlightText(element) {
    element.click();
    let copyBtn = await whenElementExist(".toolbarItem.wr_copy");
    return new Promise((resolve) => {
      function onCopy(e) {
        if (window.isCustomCopy) {
          let copyText = e.target.value;
          e.preventDefault();
          e.stopPropagation();
          window.isCustomCopy = false;
          document.removeEventListener("copy", onCopy, true);
          resolve(copyText);
        }
      }
      document.addEventListener("copy", onCopy, true);
      window.isCustomCopy = true;
      copyBtn.click();
    });
  }

  function elClick(el) {
    el.dispatchEvent(
      new MouseEvent("click", {
        clientX: 1,
        clientY: 1,
      })
    );
  }

  // 为高亮文本添加点击事件监听
  function addUnderlineClickListeners(dbClickThreshold) {
    let underlines = document.getElementsByClassName("wr_underline_wrapper");
    for (let i = 0; i < underlines.length; i++) {
      if (underlines[i].getAttribute("data-listener-added")) {
        continue;
      }
      underlines[i].setAttribute("data-listener-added", "true");

      let clickCount = 0;
      let lastClickTime = 0;
      underlines[i].addEventListener("click", function (e) {
        const currentTime = new Date().getTime();
        clickCount++;
        if (clickCount === 1) {
          setTimeout(async function () {
            if (clickCount === 1) {
              // 单击：可添加显示工具栏的逻辑
            } else if (clickCount === 2) {
              const copyText = await getHighlightText(underlines[i]);
              findAndClickNextNoteItem(copyText);
            }
            clickCount = 0;
          }, dbClickThreshold);
        }
        lastClickTime = currentTime;
      });
    }
  }

  function observeDOMChanges() {
    let targetNode = document.querySelector(".readerContent");
    if (!targetNode) {
      console.log("Reader content not found for observing DOM changes.");
      return;
    }
    let config = { childList: true, subtree: true };

    let callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          addUnderlineClickListeners(doubleClickThreshold);
        }
      }
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
  // base method
  async function waitPageLoaded() {
    await whenElementExist(".readerCatalog_list_item");
  }
  function addStyle(cssRules) {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = cssRules;
    document.head.appendChild(styleElement);
  }
  function whenElementExist(selector) {
    return new Promise((resolve) => {
      const checkForElement = () => {
        let element = null;
        if (typeof selector === "function") {
          element = selector();
        } else {
          element = document.querySelector(selector);
        }
        if (element) {
          resolve(element);
        } else {
          requestAnimationFrame(checkForElement);
        }
      };
      checkForElement();
    });
  }
})();
