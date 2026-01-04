// ==UserScript==
// @name         知乎历史记录助手
// @namespace    qujixiang1999@163.com
// @version      1.1
// @description  电脑浏览器访问知乎时，没有历史记录功能，故本脚本模拟实现知乎历史记录功能。
// @author       Qu Jixiang
// @match        https://*.zhihu.com/*
// @exclude      https://video.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/443789/%E7%9F%A5%E4%B9%8E%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443789/%E7%9F%A5%E4%B9%8E%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.parent != window) return; // 仅在顶层窗口执行脚本，内嵌窗口不执行该脚本

    // 全局常量
    const historyRecordTag = '_zhihu_history_record_helper_v1.1_';
    const historyCounterTag = '_zhihu_history_counter_helper_v1.1_';
    const configurations = {
        maxRecordsCount: 500, // 历史记录最大记录数目
        maxBriefContentCharacterCount: 100, // 最大简要内容文字个数
    };

    // 全局变量
    let multiselectCount = 0; // 历史记录复选框被勾选的个数
    const multiselectDialogWrapperElement = document.createElement('div');
    const multiselectCounterElement = document.createElement('p');
    let historyWindow = null;

    function getAncestorElementByClassName(element, className){ //  根据类名找祖先
        for (; element && !element.classList.contains(className); element = element.parentElement) {}
        return element;
    }

    function getHistory() { // 获取历史记录
        if (!getHistory._history) {
          getHistory._history = JSON.parse(window.localStorage.getItem(historyRecordTag) || '[]');
        }
        return getHistory._history;
    }

    function saveHistory(history) { // 保存历史记录
        if (history.length > configurations.maxRecordsCount) history.length = configurations.maxRecordsCount;
        window.localStorage.setItem(historyRecordTag, JSON.stringify(history));
    }

    function Record({type = '', title = '', url = '', authorName = '', content = '', imgURL = '', time=''} = {}) { // 记录
        this.type = type; // 'question'|'answer'|'article'
        this.title = title;
        this.url = url;
        // 以下两项仅在type为answer或article时有效
        this.authorName = authorName;
        this.content = content;
        // 以下项仅在type为answer或article且内容中有图片时有效
        this.imgURL = imgURL;
        this.time = time;
        this.id = parseInt(window.localStorage.getItem(historyCounterTag) || '0') + 1;
        window.localStorage.setItem(historyCounterTag, this.id);
    }

    function addRecord(history, record) { // 添加一条记录到历史记录中
        history.unshift(record);
    }

    function deleteRecord(history, recordId) {
      const index = history.findIndex(e => parseInt(e.id) === recordId);
      if (index !== -1) {
        history.splice(index, 1);
      }
      saveHistory(history);
    }

    function injectHistoryElement() { // 将历史记录按钮插入到HTML文档中
        let element = document.createElement('button');
        element.innerHTML = 'H';
        element.style.setProperty('width', '50px');
        element.style.setProperty('height', '50px');
        element.style.setProperty('color', '#FFF');
        element.style.setProperty('background-color', '#0066FF');
        element.style.setProperty('border-radius', '50%');
        element.style.setProperty('position', 'fixed');
        element.style.setProperty('right', '50px');
        element.style.setProperty('bottom', '50px');
        element.style.setProperty('text-align', 'center');
        element.addEventListener('click', () => openHistoryWindow());
        document.body.append(element);
    }

    function deleteButtonListener(e) {
      const recordWrapper = getAncestorElementByClassName(e.target, 'record-wrapper');
      recordWrapper.style.setProperty('display', 'none');
      const checkbox = recordWrapper.querySelector('input[type="checkbox"]')
      if (checkbox.checked) {
        checkbox.checked = false;
        multiselectCount -= 1;
        if (multiselectCount === 0) {
          closeMultiselectDialog();
        } else {
          updateMultiselectDialog();
        }
      }
      const group = getAncestorElementByClassName(recordWrapper, 'group');
      group.dataset.counter = parseInt(group.dataset.counter) - 1;
      if (parseInt(group.dataset.counter) === 0) {
        group.style.setProperty('display', 'none');
      }
      const id = parseInt(recordWrapper.dataset.recordId);
      deleteRecord(getHistory(), id);
    }

    function multiselectDeleteButtonListener(e) {
      let multiselectCheckboxList = Array.from(historyWindow.document.querySelectorAll('input[type="checkbox"]'));
      let checkedList = multiselectCheckboxList.filter(c => c.checked);
      console.log(checkedList);
      checkedList.forEach(c => {
        const recordWrapper = getAncestorElementByClassName(c, 'record-wrapper');
        recordWrapper.style.setProperty('display', 'none');
        const group = getAncestorElementByClassName(recordWrapper, 'group');
        group.dataset.counter = parseInt(group.dataset.counter) - 1;
        if (parseInt(group.dataset.counter) === 0) {
          group.style.setProperty('display', 'none');
        }
        const id = parseInt(recordWrapper.dataset.recordId);
        deleteRecord(getHistory(), id);
      });
      multiselectCount = 0;
      closeMultiselectDialog();
    }

    function openMultiselectDialog() {
      // const multiselectDialogWrapperElement = document.querySelector('#multiselect-dialog-wrapper');
      multiselectCounterElement.textContent = `已选择${multiselectCount}项`;
      multiselectDialogWrapperElement.style.setProperty('display', 'block');
    }

    function updateMultiselectDialog() {
      // const multiselectCounterElement = document.querySelector('#multiselect-counter');
      multiselectCounterElement.textContent = `已选择${multiselectCount}项`;
    }

    function closeMultiselectDialog() {
      // const multiselectDialogWrapperElement = document.querySelector('#multiselect-dialog-wrapper');
      multiselectDialogWrapperElement.style.setProperty('display', 'none');
    }

    function checkboxListener(e) {
      const checkbox = e.target;
      if (checkbox.checked) {
        multiselectCount += 1;
        if (multiselectCount === 1) {
          openMultiselectDialog();
        } else {
          updateMultiselectDialog();
        }
      } else {
        multiselectCount -= 1;
        if (multiselectCount === 0) {
          closeMultiselectDialog();
        } else {
          updateMultiselectDialog();
        }
      }
    }

    function openHistoryWindow() { // 打开历史记录窗口
        historyWindow = window.open('', '_blank');
        historyWindow.document.open();
        historyWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>知乎历史记录</title>
              <style>
                html {
                  font-size: 16px;
                }

                body {
                  background-color: #f7f7f7;
                }

                div, p {
                  margin: 0;
                  padding: 0;
                }

                #multiselect-dialog-wrapper {
                  position: fixed;
                  top: 1rem;
                  right: 1rem;
                  z-index: 2;
                  border-radius: 4px;
                  background-color: #ffffff;
                  box-shadow: 0px 1.6px 3.6px rgba(0,0,0,0.13), 0px 0px 2.9px rgba(0,0,0,0.11);
                }

                #multiselect-dialog {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.5rem;
                }

                #multiselect-counter {
                  margin: 0 0.5rem;
                }

                #multiselect-delete-button {
                  margin: 0 0.5rem;
                  color: #ffffff;
                  background-color: #0078d4;
                  font-weight: 600;
                  font-size: 0.9rem;
                  line-height: 1.1rem;
                  height: 2rem;
                  border: 2px solid transparent;
                  border-radius: 2px;
                  cursor: pointer;
                }

                #multiselect-delete-button:hover {
                  background-color: #006cbe;
                }

                #multiselect-cancel-button {
                  margin: 0 0.5rem;
                  color: ##2B2B2B;
                  background-color: #EDEDED;
                  font-weight: 600;
                  font-size: 0.9rem;
                  line-height: 1.1rem;
                  height: 2rem;
                  border: 2px solid transparent;
                  border-radius: 2px;
                  cursor: pointer;
                }

                #multiselect-cancel-button:hover {
                  background-color: #e5e5e5;
                }

                .date {
                  width: 70%;
                  margin: .5rem auto;
                  padding: .5rem;
                }

                .record-wrapper {
                  position: relative;
                  width: 70%;
                  display: flex;
                  flex-direction: row;
                  flex-wrap: nowrap;
                  margin: .5rem auto;
                  border-radius: 4px;
                  padding: .5rem;
                  background-color: #ffffff;
                  box-shadow: 0px 1.6px 3.6px rgba(0,0,0,0.13), 0px 0px 2.9px rgba(0,0,0,0.11);
                }

                .record-wrapper:hover {
                  box-shadow: 0px 1.6px 5.4px rgba(0,0,0,0.26), 0px 0px 4.5px rgba(0,0,0,0.22);
                }

                input[type="checkbox"] {
                  flex-grow: 0;
                  flex-shrink: 0;
                  border: 1px solid #929292;
                  border-radius: 2px;
                  width: 20px;
                  height: 20px;
                  box-sizing: border-box;
                  background-color; #ffffff;
                  cursor: pointer;
                }

                .link, .link:hover, .link:visited, .link:active {
                  display: inline-grid;
                  flex-grow: 1;
                  color: #000;
                  text-decoration: none;
                }

                .header {
                  display: inline-grid;
                  grid-template-columns: 1fr auto;
                }

                .title {
                  margin: 0 0.5rem;
                  font-size: 1.2rem;
                  font-weight: 650;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }

                .time {
                  margin: 0 0.5rem;
                  color: #767676;
                }

                .answer {
                  margin: .5rem;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }

                .author {
                  font-weight: 550;
                }

                img {
                  width: 8rem;
                  height: 4rem;
                  object-fit: cover;
                }

                .delete-button {
                  flex-grow: 0;
                  flex-shrink: 0;
                  width: 30px;
                  height: 30px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                }

                .delete-button:hover {
                  background-color: #f7f7f7;
                }
              </style>
            </head>
            <body>
            </body>
          </html>
        `);
        historyWindow.document.close();

        let fragment = new DocumentFragment();
        /**
         *  <div id="multiselect-dialog-wrapper">
         *    <div id="multiselect-dialog">
         *      <p id="multiselect-counter">已选择${count}项</p>
         *      <button id="multiselect-delete-button">删除</button>
         *      <button id="multiselect-cancel-button">取消</button>
         *    </div>
         *  </div>
         */
        // const multiselectDialogWrapperElement = document.createElement('div');
        const multiselectDialogElement = document.createElement('div');
        // const multiselectCounterElement = document.createElement('p');
        const multiselectDeleteButtonElement = document.createElement('button');
        const multiselectCancelButtonElement = document.createElement('button');
        multiselectDialogWrapperElement.setAttribute('id', 'multiselect-dialog-wrapper');
        multiselectDialogWrapperElement.style.setProperty('display', 'none');
        multiselectDialogElement.setAttribute('id', 'multiselect-dialog');
        multiselectCounterElement.setAttribute('id', 'multiselect-counter');
        multiselectCounterElement.textContent = '已选择0项';
        multiselectDeleteButtonElement.setAttribute('id', 'multiselect-delete-button');
        multiselectDeleteButtonElement.textContent = '删除';
        multiselectDeleteButtonElement.addEventListener('click', multiselectDeleteButtonListener);
        multiselectCancelButtonElement.setAttribute('id', 'multiselect-cancel-button');
        multiselectCancelButtonElement.textContent = '取消';
        multiselectDialogElement.append(multiselectCounterElement);
        multiselectDialogElement.append(multiselectDeleteButtonElement);
        multiselectDialogElement.append(multiselectCancelButtonElement);
        multiselectDialogWrapperElement.append(multiselectDialogElement);
        fragment.append(multiselectDialogWrapperElement);

        const history = getHistory();
        let currentGroup = null;
        let previousDate = '';
        history.forEach(h => {
            /**
             *  <div class="grounp">
             *    <div class="date">${date}</div>
             *    <div class="record-wrapper" data-record-id="${recordId}">
             *      <input type="checkbox">
             *      <a href=${url} class="link">
             *        <div class="header">
             *          <p class="title">${title}</p>
             *          <p class="time">${time}</p>
             *        </div>
             *        <p class="answer"><span class="author">${authorName}: </span>${content}</p>
             *      </a>
             *      <img src="${imgURL}">
             *      <button class="delete-button">
             *        <svg width="20" height="20" viewBox="0 0 20 20">
             *          <path d="M4.09 4.22l.06-.07a.5.5 0 01.63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 01.63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 01-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 01-.63.06l-.07-.06a.5.5 0 01-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 01-.06-.63l.06-.07-.06.07z" fill-rule="nonzero">
             *          </path>
             *        </svg>
             *      </button>
             *    </div>
             *  </div>
             */
            const recordWrapper = historyWindow.document.createElement('div');
            const checkbox = historyWindow.document.createElement('input');
            const a = historyWindow.document.createElement('a');
            const header = historyWindow.document.createElement('div');
            const titleParagraph = historyWindow.document.createElement('p');
            const timeParagraph = historyWindow.document.createElement('p');
            const deleteButton = historyWindow.document.createElement('button');
            const currentDate = new Date(h.time).toLocaleDateString();
            if (previousDate !== currentDate) {
              const group = historyWindow.document.createElement('div');
              group.classList.add('group');
              group.dataset.date = h.time.substring(0, 10);
              group.dataset.counter = '0';
              currentGroup = group;
              const date = historyWindow.document.createElement('div');
              date.classList.add('date');
              let d = new Date(h.time);
              date.textContent = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日-星期${['一', '二', '三', '四', '五', '六', '日'][d.getDay()]}`;
              currentGroup.append(date);
              previousDate = currentDate;
              fragment.append(currentGroup);
            }
            recordWrapper.classList.add('record-wrapper');
            recordWrapper.dataset.recordId = h.id;
            checkbox.setAttribute('type', 'checkbox');
            checkbox.addEventListener('change', checkboxListener);
            a.setAttribute('href', h.url);
            a.classList.add('link');
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', deleteButtonListener);
            header.classList.add('header');
            titleParagraph.classList.add('title');
            titleParagraph.innerText = h.title;
            timeParagraph.classList.add('time');
            let d = new Date(h.time);
            timeParagraph.innerText = `${d.toLocaleTimeString().substring(0, 5)}`; // 2022-10-31T10:10:10.000Z
            a.append(header);
            header.append(titleParagraph);
            header.append(timeParagraph);
            if (['answer', 'article'].includes(h.type)) {
                const answerParagraph = historyWindow.document.createElement('p');
                const authorElement = historyWindow.document.createElement('span');
                answerParagraph.classList.add('answer');
                authorElement.classList.add('author');
                authorElement.innerHTML = `${h.authorName}: `;
                answerParagraph.append(authorElement);
                answerParagraph.append(h.content);
                a.append(answerParagraph);
            }
            deleteButton.innerHTML =
`<svg width="20" height="20" viewBox="0 0 20 20">
  <path d="M4.09 4.22l.06-.07a.5.5 0 01.63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 01.63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 01-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 01-.63.06l-.07-.06a.5.5 0 01-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 01-.06-.63l.06-.07-.06.07z" fill-rule="nonzero">
  </path>
</svg>`
            recordWrapper.append(checkbox);
            recordWrapper.append(a);
            if (h.imgURL) {
                    const imageElement = historyWindow.document.createElement('img');
                    imageElement.setAttribute('src', h.imgURL);
                    recordWrapper.append(imageElement);
            }
            recordWrapper.append(deleteButton);
            currentGroup.append(recordWrapper);
            currentGroup.dataset.counter = parseInt(currentGroup.dataset.counter) + 1;
        });
        historyWindow.document.body.append(fragment);
    }

    /**
     * 有两种改变浏览记录的方式：
     *    1. 查看当前页面的URL，URL为以下三种模式改变浏览记录：
     *      1.1 路径为"/question/<number question>"，表示某个问题
     *      1.2 路径为"/question/<number question>/answer/<number answer>"，表示某个问题下的某个回答，主要信息：
     *          <div class="AuthorInfo">
     *            <meta itemprop="name" content="<author name>">
     *            <meta itemprop="image" content="<author image url>">
     *          </div>
     *      1.3 路径为"/p/<number article>"，表示某篇专栏文章
     *    2. 监听用户点击"阅读全文",主要查看以下标签改变浏览记录：
     *          <div class="ContentItem" data-zop="{"authorName":<author name>,"title":<title>,"type":<type="answer"|"article">}">
     *            <meta itemprop="url" content="//www.zhihu.com/p/<number article>">
     *            <div class="RichContent">
     *              <div class="RichContent-inner">
     *              </div>
     *            </div>
     *          </div>
     */

    let history = getHistory();

    const questionPattern = /^\/question\/\d+$/;
    const answerPattern = /^\/question\/\d+\/answer\/\d+$/;
    const articlePattern = /^\/p\/\d+$/;

    const path = window.location.pathname;
    if (questionPattern.test(path)) {
        let record = new Record();
        record.type = 'question';
        record.title = document.querySelector('.QuestionHeader-title')?.textContent ?? '';
        record.url = location.href;
        record.time = new Date().toJSON();
        addRecord(history, record);
        saveHistory(history);
    } else if (answerPattern.test(path)) {
        let record = new Record();
        record.type = 'answer';
        const contentItem = document.querySelector('.ContentItem');
        const info = JSON.parse(contentItem.dataset.zop);
        record.authorName = info.authorName;
        record.title = info.title;
        const text = contentItem.querySelector('.RichContent')?.textContent ?? '';
        record.content = text.length < configurations.maxBriefContentCharacterCount ? text : text.slice(0, configurations.maxBriefContentCharacterCount);
        record.url = location.href;
        const imgURL = contentItem.querySelector('[data-default-watermark-src]')?.getAttribute('data-default-watermark-src') ?? '';
        record.imgURL = imgURL;
        record.time = new Date().toJSON();
        addRecord(history, record);
        saveHistory(history);
    } else if (articlePattern.test(path)) {
        let record = new Record();
        record.type = 'article';
        const postContent = document.querySelector('.Post-content');
        const info = JSON.parse(postContent.dataset.zop);
        record.authorName = info.authorName;
        record.title = info.title;
        const text = document.querySelector('.Post-RichText')?.textContent ?? '';
        record.content = text.length < configurations.maxBriefContentCharacterCount ? text : text.slice(0, configurations.maxBriefContentCharacterCount);
        record.url = location.href;
        record.time = new Date().toJSON();
        addRecord(history, record);
        saveHistory(history);
    }

    // 监听用户点击"阅读原文"
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('ContentItem-more') || // 点击"阅读原文"按钮
            e.target.classList.contains('RichContent-inner')) { // 点击收缩起来的文本
            const contentItem = getAncestorElementByClassName(e.target, 'ContentItem');
            const info = JSON.parse(contentItem.dataset.zop);
            let record = new Record();
            record.type = info.type;
            record.authorName = info.authorName;
            record.title = info.title;
            const meta = contentItem.querySelector(':scope > meta[itemprop="url"]');
            record.url = meta.getAttribute('content');
            let text = contentItem.querySelector('.RichContent-inner')?.textContent ?? '';
            // WEIRD:
            const index = text.indexOf('： ');
            const begin = index === -1 ? 0 : (index + 2);
            record.content = text.length < configurations.maxBriefContentCharacterCount ? text.slice(begin) : text.slice(begin, begin + configurations.maxBriefContentCharacterCount);
            record.time = new Date().toJSON();
            addRecord(history, record);
            saveHistory(history);
        }
    });

    if (location.pathname === '/') {
        injectHistoryElement();
    }
})();