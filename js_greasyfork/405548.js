// ==UserScript==
// @name         Nico Excluder
// @namespace    https://i544c.github.io
// @version      1.1.2
// @description  ユーザ拒否リストに引っかかった動画を非表示にする
// @author       i544c
// @match        https://www.nicovideo.jp/ranking/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405548/Nico%20Excluder.user.js
// @updateURL https://update.greasyfork.org/scripts/405548/Nico%20Excluder.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const { version } = GM_info.script;

  const _debug = (...msg) => {
    console.log('[Nico Excluder]', ...msg);
  };

  const _fetch = url => new Promise((resolve, _reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'GET',
      headers: {
        'User-Agent': `nico_excluder/${version}`,
      },
      onload: res => resolve(res.responseText),
    });
  });

  function* _counter() {
    let i = 0;
    while(true) yield ++i;
  }

  const init = () => {
    const userList = GM_getValue('denyUserList', null);
    if (userList === null) {
      _debug('Initialize!');
      GM_setValue('denyUserListUrl', 'https://gist.github.com/i544c/238c78a54fa8d39536fd3ca2f816947a/raw/z_deny_user_list_example.json');
    }
  };
  init();

  class ApiCache {
    constructor() {
      this.badContents = GM_getValue('cacheBadContents', []);
      this.badContentsMax = 100;
    }

    addBadContents(contentId, userId) {
      if (this.findBadContent(contentId)) return;

      this.badContents.push({ contentId, userId });
      this.badContents.splice(0, this.badContents.length - this.badContentsMax);
      GM_setValue('cacheBadContents', this.badContents);
    }

    findBadContent(contentId) {
      return this.badContents.find(item => item.contentId === contentId);
    }
  }

  class NicoApi {
    static endpointGetThumbInfo(contentId) {
      return `https://ext.nicovideo.jp/api/getthumbinfo/${contentId}`;
    }

    static async getMeta(contentId) {
      const url = this.endpointGetThumbInfo(contentId);
      const rawBody = await _fetch(url);
      const domparser = new DOMParser();
      const body = domparser.parseFromString(rawBody, 'text/xml');
      const userId = body.getElementsByTagName('user_id')[0].textContent;
      const tags = body.getElementsByTagName('tags')[0];
      return { userId, tags };
    }

    static removeVideo(contentId) {
      _debug('Goodbye!', this.endpointGetThumbInfo(contentId));
      const badContent = document.querySelector(`div.MediaObject[data-video-id=${contentId}`);
      badContent.remove();
    }
  }

  class Excluder {
    constructor() {
      this.userList = GM_getValue('denyUserList', []);
      this.userListUrl = GM_getValue('denyUserListUrl', null);
      this.tagList = GM_getValue('denyTagList', []);
      this.tagListUrl = GM_getValue('denyTagListUrl', null);
    }

    canUpdate() {
      const now = new Date();
      const lastUpdatedAt = new Date(GM_getValue('updatedAt', 0));
      lastUpdatedAt.setHours(lastUpdatedAt.getHours() + 1);
      return now.getTime() > lastUpdatedAt.getTime();
    }

    async update() {
      if (!this.canUpdate()) return;

      let body, array;
      if (this.userListUrl) {
        body = await _fetch(this.userListUrl);
        array = JSON.parse(body);
        this.userList = array;
        GM_setValue('denyUserList', array);
      }

      if (this.tagListUrl) {
        body = await _fetch(this.tagListUrl);
        array = JSON.parse(body);
        this.tagList = array;
        GM_setValue('denyTagList', array);
      }

      const now = new Date();
      GM_setValue('updatedAt', now.getTime());
      _debug('Updated');
    }

    shouldExclude(userId, tags) {
      const badTags = Array
        .from(tags.children, tag => tag.textContent)
        .filter(tag => this.tagList.includes(tag));
      return this.userList.includes(userId) || badTags.length > 0;
    }
  }

  class Job {
    constructor(excluder, apiCache) {
      this.excluder = excluder;
      this.apiCache = apiCache;
      this.timer = null;
      this.interval = 1000;
      this.queue = [];
    }

    enqueue(contentId) {
      this.queue.push(contentId);
    }

    dequeue() {
      return this.queue.shift();
    }

    start() {
      if (this.timer) {
        console.warn('Already running');
        return;
      }

      this.timer = window.setInterval(() => this.run(), this.interval);
    }

    stop() {
      window.clearInterval(this.timer);
    }

    async run() {
      const contentId = this.dequeue()
      if (!contentId) return;

      const { userId, tags } = await NicoApi.getMeta(contentId);
      _debug(contentId, userId);
      if (!excluder.shouldExclude(userId, tags)) return;

      NicoApi.removeVideo(contentId);
      apiCache.addBadContents(contentId, userId);
    }
  }

  const excluder = new Excluder;
  await excluder.update();

  const apiCache = new ApiCache;
  const job = new Job(excluder, apiCache);
  job.start();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-loaded') {
        const contentId = mutation.target.parentElement.getAttribute('data-watchlater-item-id');
        const userId = apiCache.findBadContent(contentId);
        userId
          ? NicoApi.removeVideo(contentId)
          : job.enqueue(contentId);
      }
    });
  });

  const thumbs = document.querySelectorAll('.RankingVideoListContainer div.Thumbnail-image');
  thumbs.forEach(thumb => {
    observer.observe(thumb, { attributes: true });
  });
})();
