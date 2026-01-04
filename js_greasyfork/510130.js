// ==UserScript==
// @name         文本大爆炸
// @namespace    http://tampermonkey.net/
// @author       突徒土兔
// @version      3.1
// @description  仿照锤子的大爆炸，对选中文本进行分词
// @match        *://*/*
// @license      CC-BY-NC-4.0
// @icon         https://s2.loli.net/2024/09/25/6PxlMHA7EZVqwsJ.png
// @require      https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.js
// @downloadURL https://update.greasyfork.org/scripts/510130/%E6%96%87%E6%9C%AC%E5%A4%A7%E7%88%86%E7%82%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/510130/%E6%96%87%E6%9C%AC%E5%A4%A7%E7%88%86%E7%82%B8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 触发分词按钮
  let button = null;
  // 弹出窗口
  let popupContainer = null;
  // 分词器
  const segmentit = Segmentit.useDefault(new Segmentit.Segment());
  // 是否处于拖动
  let isDragging = false;
  // 开始拖动的元素
  let startElement = null;

  /**
   * 创建样式
   */
  function createStyles() {
    const style = document.createElement("style");
    style.textContent = `
              .word-explosion-button {
                  position: absolute;
                  background-color: rgba(255,255,255, 0.4);
                  color: #000;
                  border: none;
                  border-radius: 50%;
                  cursor: pointer;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  font-size: 16px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                  transition: all 0.3s ease;
                  z-index: 9999;
                  width: 30px;
                  height: 30px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
              .word-explosion-button:hover {
                  background-color: rgba(255,255,255, 0.75);
                  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                  transform: scale(1.1);
                  transition: transform 0.3s ease;
              }
              .word-explosion-popup {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background-color: rgba(240, 240, 240, 0.8);
                  backdrop-filter: blur(10px);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                  z-index: 10000;
                  max-width: 80%;
                  max-height: 80%;
                  overflow: auto;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: center;
                  align-items: center;
                  opacity: 0;
                  animation: fadeIn 0.5s ease forwards;
              }

              @keyframes fadeIn {
                  from {
                      opacity: 0;
                      transform: translate(-50%, -50%) scale(0.9);
                  }
                  to {
                      opacity: 1;
                      transform: translate(-50%, -50%) scale(1);
                  }
              }
              .word-explosion-word {
                  margin: 2px;
                  height: 30px; /* 让所有该类所有对象都有一样的高度 */
                  padding: 4px 8px;
                  background-color: rgba(255, 255, 255, 0.5);
                  border: none;
                  border-radius: 10px;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  font-size: 14px;
                  display: inline-flex;
                  align-items: center;
              }
              .word-explosion-word.selected {
                  background-color: #0078D4;
                  color: white;
              }
              .word-explosion-copy {
                  display: block;
                  margin-top: 15px;
                  padding: 10px 20px;
                  background-color: #0078D4;
                  color: white;
                  border: none;
                  border-radius: 20px;
                  cursor: pointer;
                  font-size: 14px;
                  transition: all 0.3s ease;
              }
              .word-explosion-copy:hover {
                  background-color: #106EBE;
              }
          `;
    document.head.appendChild(style);
  }

  /**
   * 创建按钮
   * 该函数用于在页面中创建一个按钮，并将其添加到文档的 body 中。
   * 按钮的初始状态是隐藏的。
   */
  function createButton() {
    // 创建一个新的按钮元素
    button = document.createElement("button");
    // 设置按钮的文本内容
    button.textContent = "🔨";
    // 设置按钮的类名
    button.className = "word-explosion-button";
    // 设置按钮的初始显示状态为隐藏
    button.style.display = "none";
    // 将按钮添加到文档的 body 中
    document.body.appendChild(button);
  }

  /**
   * 显示按钮并将其定位到选中文本旁边
   * 该函数用于在用户选择文本后，显示按钮并将按钮定位到选中文本的旁边。
   */
  function showButtonAtSelection() {
    // 获取当前的文本选择对象
    const selection = window.getSelection();
    // 检查是否有选中的文本
    if (selection.rangeCount > 0) {
      // 获取选中的第一个范围
      const range = selection.getRangeAt(0);
      // 获取选中范围的边界矩形
      const rect = range.getBoundingClientRect();
      // 设置按钮的顶部位置为选中范围的底部加上滚动条的偏移量
      button.style.top = `${rect.bottom + window.scrollY + 5}px`;
      // 设置按钮的左侧位置为选中范围的左侧加上滚动条的偏移量
      button.style.left = `${rect.left + window.scrollX}px`;
      // 显示按钮
      button.style.display = "block";
    }
  }

  /**
   * 隐藏按钮
   * 该函数用于隐藏按钮。
   */
  function hideButton() {
    // 将按钮的显示状态设置为隐藏
    button.style.display = "none";
  }

  /**
   * 创建弹出窗口
   * 该函数用于创建一个弹出窗口，并将其添加到文档的 body 中。
   * 弹出窗口的初始状态是隐藏的。
   */
  function createPopup() {
    // 创建一个新的 div 元素作为弹出窗口的容器
    popupContainer = document.createElement("div");
    // 设置弹出窗口的类名为 "word-explosion-popup"
    popupContainer.className = "word-explosion-popup";
    // 设置弹出窗口的初始显示状态为隐藏
    popupContainer.style.display = "none";
    // 将弹出窗口添加到文档的 body 中
    document.body.appendChild(popupContainer);

    // 添加事件监听器，用于实现拖动选择功能
    popupContainer.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // 添加事件监听器，用于隐藏弹出窗口
    document.addEventListener("click", (event) => {
      // 如果点击事件的目标不在弹出窗口内且不在按钮内，则隐藏弹出窗口
      if (
        !popupContainer.contains(event.target) &&
        !button.contains(event.target)
      ) {
        hidePopup();
      }
    });
  }

  /**
   * 显示弹出窗口
   * 该函数用于显示弹出窗口，并将分词结果显示在弹出窗口中。
   * @param {Array} words - 分词结果数组
   */
  function showPopup(words) {
    // 清空弹出窗口的内容
    popupContainer.innerHTML = "";
    // 遍历分词结果数组
    words.forEach((word) => {
      // 创建一个新的按钮元素
      const wordButton = document.createElement("button");
      // 设置按钮的文本内容为分词结果
      wordButton.textContent = word;
      // 设置按钮的类名为 "word-explosion-word"
      wordButton.className = "word-explosion-word";
      // 为按钮添加点击事件监听器，用于切换 "selected" 类
      wordButton.addEventListener("click", () =>
        wordButton.classList.toggle("selected")
      );
      // 将按钮添加到弹出窗口中
      popupContainer.appendChild(wordButton);
    });

    // 创建一个新的按钮元素，用于复制选中的文本
    const copyButton = document.createElement("button");
    // 设置按钮的文本内容为 "复制选中文本"
    copyButton.textContent = "复制选中文本";
    // 设置按钮的类名为 "word-explosion-copy"
    copyButton.className = "word-explosion-copy";
    // 设置按钮的宽度为 100%
    copyButton.style.width = "100%";
    // 为按钮添加点击事件监听器，用于复制选中的文本
    copyButton.addEventListener("click", copySelectedWords);
    // 将按钮添加到弹出窗口中
    popupContainer.appendChild(copyButton);

    // 显示弹出窗口
    popupContainer.style.display = "flex";
  }

  /**
   * 隐藏弹出窗口
   * 该函数用于隐藏弹出窗口。
   */
  function hidePopup() {
    // 将弹出窗口的显示状态设置为隐藏
    popupContainer.style.display = "none";
  }

  /**
   * 分词函数
   * 该函数用于对输入的文本进行分词，并返回分词结果数组。
   * @param {string} text - 需要分词的文本
   * @returns {Array} - 分词结果数组
   */
  function wordExplosion(text) {
    // 使用 segmentit 库对文本进行分词，并提取分词结果
    let result = segmentit.doSegment(text).map((item) => item.w);
    // 初始化一个空数组来存储带有空格的分词结果
    let newResult = [];
    // 分词过程中丢失了空格
    // 遍历原始文本，插入空格
    let textIndex = 0;
    for (let i = 0; i < result.length; i++) {
      newResult.push(result[i]);
      textIndex += result[i].length;
      while (textIndex < text.length && text[textIndex] === " ") {
        newResult.push(" ");
        textIndex++;
      }
    }
    // 在控制台输出分词结果
    console.log(`分词结果：\n${newResult}`);
    // 返回分词结果数组，如果结果为空则返回空数组
    return newResult || [];
  }

  /**
   * 复制选中的单词
   * 该函数用于将选中的单词复制到剪贴板，并弹出提示。
   */
  function copySelectedWords() {
    // 获取所有选中的单词按钮
    const selectedWords = Array.from(
      popupContainer.querySelectorAll(".word-explosion-word.selected")
    )
      // 提取每个按钮的文本内容
      .map((button) => button.textContent)
      // 将所有选中的单词连接成一个字符串
      .join("");
    // 将选中的单词复制到剪贴板
    navigator.clipboard
      .writeText(selectedWords)
      .then(() => {
        // 复制成功后弹出提示
        alert(`已复制：\n${selectedWords}`);
      })
      .catch((err) => {
        // 复制失败时在控制台输出错误信息
        console.error("复制失败: ", err);
      });
  }

  /**
   * 监听选择事件
   * 该函数用于监听用户的选择事件，并在用户选择文本后显示按钮。
   */
  document.addEventListener("selectionchange", function () {
    // 获取当前的文本选择对象
    const selection = window.getSelection();
    // 检查选中的文本是否不为空
    if (selection.toString().trim() !== "") {
      // 显示按钮并将其定位到选中文本旁边
      showButtonAtSelection();
    } else {
      // 隐藏按钮
      hideButton();
    }
  });

  /**
   * 监听按钮点击事件
   * 该函数用于在用户点击按钮后，对选中的文本进行分词，并显示弹出窗口。
   */
  function onButtonClick() {
    // 获取当前的文本选择对象
    const selection = window.getSelection();
    // 获取选中的文本
    const text = selection.toString();
    // 对选中的文本进行分词
    const words = wordExplosion(text);
    // 显示弹出窗口并将分词结果显示在弹出窗口中
    showPopup(words);
    // 隐藏按钮
    hideButton();
  }

  let longPressTimer = null;
  const longPressThreshold = 200; // 长按阈值，单位为毫秒

  /**
   * 处理鼠标按下事件
   * 该函数用于处理鼠标按下事件，实现长按选择功能。
   * @param {MouseEvent} event - 鼠标按下事件对象
   */
  function onMouseDown(event) {
    // 检查鼠标按下的目标是否为单词按钮
    if (event.target.classList.contains("word-explosion-word")) {
      // 设置一个定时器，用于检测长按操作
      longPressTimer = setTimeout(() => {
        // 如果长按时间超过阈值，则开始拖动选择
        isDragging = true;
        // 记录开始拖动的元素
        startElement = event.target;
        // 为开始拖动的元素添加 "selected" 类
        startElement.classList.add("selected");
      }, longPressThreshold);
    }
  }

  /**
   * 处理鼠标移动事件
   * 该函数用于处理鼠标移动事件，实现拖动选择功能。
   * @param {MouseEvent} event - 鼠标移动事件对象
   */
  function onMouseMove(event) {
    // 检查是否正在进行拖动选择
    if (isDragging && startElement) {
      // 获取当前鼠标位置下的元素
      const currentElement = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      // 检查当前元素是否为单词按钮且不是开始拖动的元素
      if (
        currentElement &&
        currentElement.classList.contains("word-explosion-word") &&
        currentElement !== startElement
      ) {
        // 为当前元素添加 "selected" 类
        currentElement.classList.add("selected");
      }
    }
  }

  /**
   * 处理鼠标松开事件
   * 该函数用于处理鼠标松开事件，结束拖动选择功能。
   * @param {MouseEvent} event - 鼠标松开事件对象
   */
  function onMouseUp(event) {
    // 清除长按定时器
    clearTimeout(longPressTimer);
    // 结束拖动选择
    isDragging = false;
    // 清空开始拖动的元素
    startElement = null;
  }

  /**
   * 初始化脚本
   * 该函数用于初始化脚本，创建样式、按钮和弹出窗口，并添加事件监听器。
   */
  function init() {
    // 创建样式
    createStyles();
    // 创建按钮
    createButton();
    // 创建弹出窗口
    createPopup();
    // 为按钮添加点击事件监听器
    button.addEventListener("click", onButtonClick);
  }

  // 初始化脚本
  init();
})();
