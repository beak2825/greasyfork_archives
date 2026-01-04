// ==UserScript==
// @name         Backup Douban Items
// @namespace    ylf8fzzd
// @version      0.1.0
// @description  Backup douban items (currently book items only), download as a JSON file.
// @author       ylf8fzzd
// @match        https://book.douban.com/people/*/do
// @match        https://book.douban.com/people/*/wish
// @match        https://book.douban.com/people/*/collect
// @match        https://book.douban.com/people/*/all
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433364/Backup%20Douban%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/433364/Backup%20Douban%20Items.meta.js
// ==/UserScript==

(() => {
  'use strict';
  class BackupWrapper {
    doubanItems;
    pageSum = 0;
    itemSum = 0;
    finished = false;
    stopped = false;
    wrapperLocationSelector;
    wrapperId = 'db-backup-wrapper';
    optionClass = 'backup-option';
    inputId = 'backup-pages';
    errorClass = 'backup-error';
    buttonName = 'backup-button';
    buttonStartClass = 'backup-start';
    buttonStopClass = 'backup-stop';
    buttonResumeClass = 'backup-resume';
    progressBarClass = 'backup-progress';
    downloadLinkClass = 'backup-download';

    defaultPageNumber = 0;

    constructor(){
      this.doubanItems = new DoubanBookItems();
      this.wrapperLocationSelector = '#db-usr-profile';
      this.initWrapper();
    }

    initWrapper() {
      // create wrapper
      let wrapper = this.wrapper;
      if (wrapper) {
        wrapper.remove();
      }
      wrapper = document.createElement('div');
      wrapper.id = this.wrapperId;
      document.querySelector(this.wrapperLocationSelector).after(wrapper);

      this.initStyle();
      this.initOptions();
      this.initErrorMsg();
      this.initProgressBar();
      this.initDownloadLink();
    }

    get wrapper() {
      return document.querySelector(`#${this.wrapperId}`);
    }

    initStyle() {
      const style = document.createElement('style');
      style.innerHTML = `
        #db-backup-wrapper {
          font-size: 1.3em;
          margin-bottom: 26px;
        }
        #db-backup-wrapper input {
          font-size: 1em;
        }
        #db-backup-wrapper label {
          padding: 0 10px 0 0;
        }
        #db-backup-wrapper .backup-error {
          color: red;
        }
        .backup-progress .page-num, .backup-progress .item-num{
          font-size: 1.5em;
        }
      `;
      this.wrapper.append(style);
    }

    initOptions() {
      const options = document.createElement('div');
      options.className = this.optionClass;

      // label
      const label = document.createElement('label');
      label.htmlFor = this.inputId;
      label.title = '1: backup _only current page.\n' +
                    '2: backup current and next 1 page and so _on.\n' +
                    '0: backup current and all remaining pages.';
      label.innerText = 'How many pages to backup?';

      // input
      const input = document.createElement('input');
      input.id = this.inputId;
      input.name = this.inputId;
      input.type = 'number';
      input.min = 0;
      input.size = 8;
      input.value = this.defaultPageNumber;
      input.required = true;

      // button
      const button = document.createElement('button');
      button.name = this.buttonName;
      button.className = this.buttonStartClass;
      button.title = 'Click to start preparing backup data.';
      button.innerText = 'Start';
      button.addEventListener('click', this.buttonEventHandler);

      options.append(label);
      options.append(input);
      options.append(button);
      this.wrapper.append(options);
    }

    get option() {
      return this.wrapper.querySelector(`.${this.optionClass}`);
    }

    get optionPageNum() {
      let pageNum = this.option.querySelector(`#${this.inputId}`).value;
      return parseInt(pageNum); // NaN when pageNum is not a number.
    }

    get optionButton() {
      return this.option.querySelector(`[name=${this.buttonName}]`);
    }

    // when Start button clicked.
    _onStart() {
      this.doubanItems.clearItems();
      this.pageSum = 0;
      this.itemSum = 0;
      this.optionButton.innerText = 'Stop';
      this.optionButton.className = this.buttonStopClass;
      console.log('Start.');
    }

    // when Stop button clicked.
    _onStop() {
      this.stopped = true;
      this.optionButton.innerText = 'Resume';
      this.optionButton.className = this.buttonResumeClass;
      console.log('Stop begin.');
    }

    // when loading pages stopped
    _onStopEnd() {
      this.updateDownloadLink();
      console.log('Stop End.');
    }

    // when Resume button clicked.
    _onResume() {
      this.stopped = false;
      this.optionButton.innerText = 'Stop';
      this.optionButton.className = this.buttonStopClass;
      console.log('Resume.');
    }

    _onPageLoaded() {
      this.updateProgressBar();
      console.log(`${this.pageSum} pages, ${this.itemSum} items loaded.`);
    }

    _onError(error) {
      this.updateErrorMsg(error.message);
      this._onStop();
      this._onStopEnd();
      console.log(error);
    }

    _onFinised(){
      this.optionButton.className = this.buttonStartClass;
      this.optionButton.innerText = 'Start';
      this.finished = true;
      this.stopped = false;
      this.updateProgressBar();
      this.updateDownloadLink();
      // return to first status.
      this.finished = false;
      console.log('Finished.');
    }

    buttonEventHandler = async (event) => {
      this.clearErrorMsg();
      const button = event.target;

      // check page number option.
      const pagesToLoad = this.optionPageNum;
      if (isNaN(pagesToLoad)) {
        const error = TypeError('Invalid page number.');
        this._onError(error);
        return Promise.resolve(error);
      }

      if (button.className === this.buttonStartClass) {
        this._onStart();
      } else if (button.className === this.buttonResumeClass) {
        this._onResume();
      } else {
        this._onStop();
        return Promise.resolve('Stop begin.');
      }

      if (this.finished) {
        return Promise.resolve('Already finished.');
      }

      while (true) {
				// This should be checked before checking stopped or not,
        // in case all pages have been loaded between start and end
        // timing of stop.
        if (pagesToLoad !== 0 && this.pageSum >= pagesToLoad) {
          this._onFinised();
          return Promise.resolve('Done.');
        }

        // if stopped by user.
        if (this.stopped) {
          this._onStopEnd();
          return Promise.resolve('Stopped.');
        }

        let itemNum;
        try {
          itemNum = await this.doubanItems.loadPage(this.pageSum + 1);
        } catch (error) {
          this._onError(error);
          return Promise.resolve(error);
        }
        if (itemNum === 0) {
          this._onFinised();
          return Promise.resolve('Done.')
        }
        this.pageSum += 1;
        this.itemSum += itemNum;
        this._onPageLoaded();
      }
    }

    initErrorMsg() {
      const error = document.createElement('div');
      error.className = this.errorClass;
      this.wrapper.append(error);
      this.clearErrorMsg();
    }

    get errorMsg() {
      return this.wrapper.querySelector(`.${this.errorClass}`);
    }

    updateErrorMsg(msg) {
      const error = this.errorMsg;
      error.style = 'display: block;';
      error.innerText = msg;
    }

    clearErrorMsg() {
      const error = this.errorMsg;
      error.style = 'display: none;';
      error.innerText = '';
    }

    initProgressBar() {
      // init progress bar
      const progressBar = document.createElement('div');
      progressBar.className = this.progressBarClass;
      progressBar.innerHTML = `
        <span class="page-num">0</span> pages,
        <span class="item-num">0</span> items loaded.
        <span class="status">Loading more pages.</span>
      `;
      progressBar.style = 'display: none;';
      this.wrapper.append(progressBar);
    }

    get progressBar() {
      return this.wrapper.querySelector(`.${this.progressBarClass}`);
    }

    // update progress bar with specified page number.
    // if finished, update the whole message.
    updateProgressBar(){
      const progressBar = this.progressBar;
      progressBar.style = 'dispaly: block;';
      progressBar.querySelector('.page-num').innerText = this.pageSum;
      progressBar.querySelector('.item-num').innerText = this.itemSum;
      if (this.stopped) {
        progressBar.querySelector('.status').innerText = 'Stopped.';
      } else if (!this.finished) {
        progressBar.querySelector('.status').innerText = 'Loading more pages...';
      } else {
        progressBar.querySelector('.status').innerText = 'Finished.';
      }
    }

    initDownloadLink() {
      // init download link
      const a = document.createElement('a');
      a.href = '#';
      a.className = this.downloadLinkClass;
      a.textContent = 'Download Backup';
      a.style = 'display: none;';
      this.wrapper.append(a);
    }

    get downloadLink(){
      return this.wrapper.querySelector(`.${this.downloadLinkClass}`);
    }

    updateDownloadLink(){
      const output = this.doubanItems.getItemsData();
      const contentType = 'application/json';
      const filename = 'backup.json';
      const blob = new Blob([output], {type: contentType});
      const url = URL.createObjectURL(blob);

      const a = this.downloadLink;
      a.style = 'display: inline;';
      a.href = url;
      a.setAttribute('download', filename);

      console.log('Download link updated.');
    }
  }

  class DoubanItems {
    allItemsSelector;
    itemCountPerPage;
    getItemData;
    items = [];

    getItemsData() {
      const data = [];
      const getItemData = this.getItemData;
      for (const item of this.items) {
        data.push(getItemData(item));
      }
      return JSON.stringify(data, null, 2);
    }

    clearItems() {
      this.items = [];
    }

    // return value: promise that resovle to item number of fetched page.
    async loadPage(page) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      let currentStart = urlSearchParams.get('start');
      if (!currentStart) {
        currentStart = 0;
      } else {
        currentStart = parseInt(currentStart);
      }

      const newStart = currentStart + this.itemCountPerPage * (page - 1);
      const baseUrl = window.location.origin + window.location.pathname + '?';
      let url = baseUrl + 'start=' + newStart;
      let response;

      try{
        response = await fetch(url);
      } catch (error){
        console.log(`Failed to fetch ${url}. ${error}`);
        return Promise.reject(error);
      }
      if (response.status !== 200){
        return Promise.reject(Error('Response status is not 200.'));
        console.log(`Failed to fetch ${url}. Status code: ${response.status}.`);
      }

      console.log(`${url} fetched.`);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const items = doc.querySelectorAll(this.allItemsSelector);
      this.items.push(...items);

      return Promise.resolve(items.length);
    }
  }

  class DoubanBookItems extends DoubanItems {
    allItemsSelector = '.interest-list .subject-item';
    itemCountPerPage = 15;

    getItemData = (item) => {
      const titleNode = item.querySelector('h2 a')
      let title = titleNode ? titleNode.innerText.trim(): '';
      // remove redundant newline and spaces.
      title = title.replace(/[\n\r]/g, '').replace(/ +/, ' ');
      const pubNode = item.querySelector('.pub');
      const pub = pubNode ? pubNode.innerText.trim() : '';
      const linkNode = item.querySelector('h2 a')
      const link = linkNode ? linkNode.getAttribute('href') : '';
      // <span class="rating4-t"></span>
      const ratingNode = item.querySelector('[class^=rating]');
      const rating = ratingNode ? ratingNode.getAttribute('class').
                     replace('rating', '').replace('-t', ''): '';
      // <span class="date">2019-02-24 读过</span>
      const dateAndStatusNode = item.querySelector('.date');
      let date;
      let status;
      if (dateAndStatusNode) {
        const dateAndStatus = dateAndStatusNode.innerText.replace(/[\n\r]/g, '');
        date = dateAndStatus.split(/ +/)[0];
        status = dateAndStatus.split(/ +/)[1];
      } else {
        // 未知图书: book that have been deleted by website
        date = '';
        status = '';
      }
      const commentNode = item.querySelector('.comment');
      const comment = commentNode ? commentNode.innerText.trim() : "";
      // <span class="tags">标签: XX ZZ</span>
      const tagsNode = item.querySelector('.tags');
      const tags = tagsNode ? tagsNode.innerText.replace(/[\n\r]/g, '').
                   replace('标签: ','').split(/ +/) : [];

      return { title, pub, link, rating, date, status, tags, comment }
    }
  }

  new BackupWrapper();
})();