// ==UserScript==
// @name         Jable.tv+ 助手 v3.00
// @namespace    https://www.facebook.com/airlife917339
// @version      3.00
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license       None
// @match        https://jable.tv/*
// @icon         https://assets-cdn.jable.tv/assets/icon/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472244/Jabletv%2B%20%E5%8A%A9%E6%89%8B%20v300.user.js
// @updateURL https://update.greasyfork.org/scripts/472244/Jabletv%2B%20%E5%8A%A9%E6%89%8B%20v300.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 創建按鈕元素
  function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', 'btn-action');
    button.addEventListener('click', clickHandler);
    return button;
  }

  // 取得影片封面圖片的 URL
  function getImageURL() {
    const backgroundImageURL = getComputedStyle(document.querySelector('.plyr__poster')).backgroundImage;
    const urlStartIndex = backgroundImageURL.indexOf('url("') + 5;
    const urlEndIndex = backgroundImageURL.lastIndexOf('")');
    return backgroundImageURL.substring(urlStartIndex, urlEndIndex);
  }

  // 取得標籤字串
  function getTagTexts() {
    const tagLinks = document.querySelectorAll(".tags a");
    let tagTexts = "";
    tagLinks.forEach((tagLink, index) => {
      tagTexts += tagLink.textContent;
      if (index < tagLinks.length - 1) {
        tagTexts += ", ";
      }
    });
    return tagTexts;
  }

  // 複製文字到剪貼簿
  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  // 在影片頁面新增按鈕
  function addButtonToViewImage() {
    const targetButton = document.querySelector('button.btn:nth-child(3)');

    // 找到原來的區塊 <span class="separator">•</span> 並刪除
    const separatorElement = document.querySelector('.tags .separator');
    if (separatorElement) {
      separatorElement.remove();
    }

    if (targetButton) {
      // 新增 "查看圖片" 按鈕
      const viewImageButton = createButton('查看圖片', () => {
        const imageURL = getImageURL();
        window.open(imageURL, '_blank');
      });
      targetButton.parentNode.insertBefore(viewImageButton, targetButton.nextSibling);

      // 新增 "複製標籤" 按鈕
      const copyTagsButton = createButton('複製標籤', () => {
        const tagTexts = getTagTexts();
        copyToClipboard(tagTexts);
      });
      targetButton.parentNode.insertBefore(copyTagsButton, viewImageButton.nextSibling);
    } else {
      console.log('找不到目標按鈕');
    }
  }

  // 將以下載的影片標題 highlight
  function highlightElementsWithPredefinedList(predefinedList) {
    // 获取所有需要处理的 <h6> 元素
    const h6Elements = document.querySelectorAll('section.pb-3.pb-e-lg-40 div.row div.col-6.col-sm-4.col-lg-3 div.detail h6.title');

    // 创建一个新的 <style> 元素
    const styleElement = document.createElement('style');

    // 定义 .highlighted 类的样式
    const cssText = `
      .highlighted {
        background-color: red;
      }
    `;

    // 将样式添加到 <style> 元素中
    styleElement.textContent = cssText;

    // 将 <style> 元素添加到文档的 <head> 元素中
    document.head.appendChild(styleElement);

    // 遍历每个 <h6> 元素，检查其文本内容是否与预设列表中的项匹配
    h6Elements.forEach((h6Element) => {
      const text = h6Element.textContent.trim();

      // 使用正则表达式匹配带有后缀的标识符，例如 "NHDTB-740B"
      const matches = text.match(/[A-Z]+-\d+[A-Z]?/);
      if (matches && matches.length > 0 && predefinedList.includes(matches[0])) {
        // 添加自定义的 class，改变背景颜色
        h6Element.classList.add('highlighted'); // 将 'highlighted' 替换为你自定义的 class 名称
      }
    });
  }

    // 定義複製文本的函數
    function copyTextAfterSpace(element) {
        const textContent = element.textContent; // 獲取標題的完整文字內容
        const firstSpaceIndex = textContent.indexOf(' '); // 找到第一個空格的位置
        if (firstSpaceIndex !== -1) {
            // 取得空格後面的文字內容
            const textToCopy = textContent.substring(firstSpaceIndex + 1).trim();

            // 建立一個臨時的textarea元素來複製文字
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
        } else {
        }
    }

  // 从 CSV URL 获取数据并将其转换为预定义列表
  async function getDataAndConvertToPredefinedList(csvUrl) {
    try {
      // 使用 fetch 函数获取 CSV 数据
      const response = await fetch(csvUrl);

      // 将 CSV 数据转换为文本格式
      const csvData = await response.text();

      // 将 CSV 数据解析为数组
      predefinedList = csvData.split(/\r?\n/);

      // 调用函数，传入预设的列表
      highlightElementsWithPredefinedList(predefinedList);
    } catch (error) {
      console.error('Error fetching and converting data:', error);
    }
  }

  // 获取当前网页的 URL
  const currentUrl = window.location.href;

  // 使用 CSV URL 获取数据并将其转换为预定义列表
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXUmxIo4wPfrrN0xDI4B-h_pe3k4EIZ-J-eE8LfUJoQzZpgkRyz_sOvsY5rvHo66fwoEndEREJOr9s/pub?gid=1410841251&single=true&output=csv';

  // 预设的列表
  let predefinedList = []; // 添加你的预设项

  // 判断当前 URL 是否包含特定字符串来执行不同的代码段
  if (currentUrl.includes('https://jable.tv/videos/')) {
    // 在 影片 页面执行的代码段
    addButtonToViewImage();
    // 找到 .header-left > h4 元素
      const header = document.querySelector('div.header-left > h4');

      if (header) {
          // 定義複製文本的函數
          header.addEventListener('click', function() {
              copyTextAfterSpace(header);
          });
      }
  } else {
    // 根据不同的子网址设置不同的 ulElement
    let ulElement;

    if (currentUrl.includes('https://jable.tv/search/')) {
      ulElement = document.querySelector('#list_videos_videos_list_search_result_sort_list');
    } else {
      ulElement = document.querySelector('#list_videos_common_videos_list_sort_list');
    }

    // 在指定的 <ul> 元素中的最后一个 <li> 后面插入一个新的 <li>
    const liElement = document.createElement('li');

    // 在新的 <li> 下面添加一个 <a> 元素
    const aElement = document.createElement('a');
    aElement.textContent = '查詢是否已下載';
    aElement.addEventListener('click', function () {
      // 触发函数 highlightElementsWithPredefinedList(predefinedList)
      highlightElementsWithPredefinedList(predefinedList);
    });
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);

    // 获取数据并将其转换为预定义列表
    getDataAndConvertToPredefinedList(csvUrl);
  }
})();