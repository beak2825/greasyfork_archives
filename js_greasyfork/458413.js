// ==UserScript==
// @name         EE Enhancer
// @namespace    https://greasyfork.org/zh-CN/users/467781
// @version      0.6.2
// @license      WTFPL
// @description  字节圈增强脚本
// @run-at       document-start
// @author       acdzh
// @match        https://ee.bytedance.net/malaita/pc/*
// @icon         https://ee.bytedance.net/malaita/static/img/malaita.png
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/458413/EE%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/458413/EE%20Enhancer.meta.js
// ==/UserScript==

(function() {
    function debugLog(...args) {
      console.log('[EE Enhancer]', ...args);
    }

    function waitForGet(selector, timeout = 500, maxRetry = 20) {
      return new Promise((resolve, reject) => {
        let retryCount = 0;
        const interval = setInterval(() => {
          if (val = selector()) {
            clearInterval(interval);
            resolve(val);
          } else if (retryCount++ > maxRetry) {
            clearInterval(interval);
            reject(new Error(`waitForGet: ${selector} timeout`));
          }
        }, timeout);
      });
    }
    
    (function () {
      const MENU_KEY_TIME_ORDER = 'menu_time_order';
      const MENU_KEY_AUTO_BACKUP = 'menu_auto_backup';
      const MENU_KEY_FILTER_NEW_BYTEDANCER = 'menu_filter_new_bytedancer';
      const MENU_KEY_FILTER_ANONYMOUS = 'menu_key_filter_anonymous';
      const MENU_KEY_POST_BLACK_WORD_LIST = 'menu_key_post_blackword_list';
      const MENU_KEY_DEBUG_MENU = 'menu_key_debug_menu';
    
      const MENU_ALL = [
        [MENU_KEY_TIME_ORDER, '帖子按时间排序', true, () => { switchMenuCommand(MENU_KEY_TIME_ORDER); alert('请手动刷新页面以生效.'); }],
        [MENU_KEY_AUTO_BACKUP, '备份浏览过的帖子', false, () => { switchMenuCommand(MENU_KEY_AUTO_BACKUP); }],
        [MENU_KEY_FILTER_NEW_BYTEDANCER, '过滤新人报道', true, () => { switchMenuCommand(MENU_KEY_FILTER_NEW_BYTEDANCER) }],
        [MENU_KEY_FILTER_ANONYMOUS, '过滤匿名', true, () => { switchMenuCommand(MENU_KEY_FILTER_ANONYMOUS) }],
        [MENU_KEY_POST_BLACK_WORD_LIST, '过滤词列表 (英文逗号分隔)', '', () => { inputMenuCommand(MENU_KEY_POST_BLACK_WORD_LIST) }],
        [MENU_KEY_DEBUG_MENU, 'DEBUG MENU', 0, () => { debugLog(MENU_VALUE, REGISITED_MENU_ID) }]
      ];
    
      const MENU_VALUE = {};
      const REGISITED_MENU_ID = [];
    
      const TTQ_BACKUP_DB_NAME = 'ttq_backup_db';
    
      // region MENU
      function registerMenuCommand() {
        if (REGISITED_MENU_ID.length >= MENU_ALL.length) {
          REGISITED_MENU_ID.forEach(id => GM_unregisterMenuCommand(id));
          REGISITED_MENU_ID.length = 0;
        }
        MENU_ALL.forEach(([key, name, defaultValue, handler]) => {
          let v = MENU_VALUE[key] ?? GM_getValue(key);
          if (v == null){
            GM_setValue(key, defaultValue);
            v = defaultValue;
          };
          MENU_VALUE[key] = v;
          const menuId = GM_registerMenuCommand(`${v === true ? '✅  ' : v === false ? '❌  ': ''}${name}`, handler);
          REGISITED_MENU_ID.push(menuId);
        });
      }
    
      function switchMenuCommand(key) {
        const currentValue = MENU_VALUE[key];
        GM_setValue(key, !currentValue);
        MENU_VALUE[key] = !currentValue;
        registerMenuCommand();
      }
    
      function inputMenuCommand(key) {
        const currentValue = MENU_VALUE[key];
        const newValue = prompt(`请输入${key}`, currentValue);
        GM_setValue(key, newValue);
        MENU_VALUE[key] = newValue;
        registerMenuCommand();
      }
    
      function getMenuValue(key) {
        return MENU_VALUE[key];
      }
      // endregion
    
      // region indexDB
      const TTQDB = (function () {
        function TTQDB() {
          this.db = null;
          this.isReady = false;
          this.dbName = TTQ_BACKUP_DB_NAME;
          this.dbVersion = 1;
          this.dbStoreName = 'ttq_backup_store';
        }
      
        TTQDB.prototype.init = function () {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = reject;
            request.onsuccess = () => {
              this.db = request.result;
              this.isReady = true;
              resolve(this.db);
            };
            request.onupgradeneeded = () => {
              const db = request.result;
              ['posts', 'comments', 'item_comments', 'likes', 'item_likes', 'users'].forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                  const store = db.createObjectStore(storeName, { keyPath: 'id' });
                  store.createIndex('id', 'id', { unique: true });
                }
              });
            };
          });
        }
      
        TTQDB.prototype.getStore = function (storeName, mode = 'readonly') {
          if (!this.db) { throw new Error('db not init'); }
          return this.db.transaction(storeName, mode).objectStore(storeName);
        }
      
        TTQDB.prototype.get = function (storeName, id) {
          return new Promise((resolve, reject) => {
            const store = this.getStore(storeName);
            const request = store.get(id);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result);
          });
        }
      
        TTQDB.prototype.getAll = function (storeName) {
          return new Promise((resolve, reject) => {
            const store = this.getStore(storeName);
            const request = store.getAll();
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result);
          });
        }
      
        TTQDB.prototype.put = function (storeName, data) {
          return new Promise((resolve, reject) => {
            const store = this.getStore(storeName, 'readwrite');
            const request = store.put(data);
            request.onerror = reject;
            request.onsuccess = () => resolve(request.result);
          });
        }
    
        return TTQDB;
      })();
    
      const ttqDB = new TTQDB();
      window.unsafeWindow.ttqDB = ttqDB;
      window.unsafeWindow.ttqMap = {
        posts: {},
        users: {},
        comments: {},
        likes: {},
      };
    
      async function backupRes(res) {
        if (!ttqDB.isReady) await ttqDB.init();
        res.entities && ['posts', 'comments', 'likes', 'users'].forEach(storeName =>
          res.entities[storeName] && Object.values(res.entities[storeName]).forEach(data => {
            ttqDB.put(storeName, data);
            window.unsafeWindow.ttqMap[storeName][data.id] = data;
            storeName === 'posts' && debugLog('put: ', storeName, data.id, data);
          })
        );
        res.relationships && ['item_comments', 'item_likes'].forEach(storeName =>
          res.relationships[storeName]
          && Object.entries(res.relationships[storeName])
            .forEach(
              ([id, data]) => ttqDB.put(storeName, { ...data, id: parseInt(id, 10) })
            )
        );
      }
      // endregion
    
      // region main
      // region main - hack fetch
      const originFetch = fetch;
      window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
          debugLog('hack: ', url, options)
          if (url.includes('/malaita/v2/user/settings/')) {
            // 获取用户设置
            if (getMenuValue(MENU_KEY_TIME_ORDER)) {
              debugLog('hit settings api');
              const responseClone = response.clone();
              let res = await responseClone.json();
              res.feed_type = 1;
              return new Response(JSON.stringify(res), response);
            }
          } else if (
            url.includes('/malaita/feeds/enter/') // 首屏
            || url.includes('/malaita/feeds/time_sequential/') // 下拉刷新 feed
            || /\/malaita\/v2\/1\/items\/\d+\/detail\//.exec(url) // 展开评论
            || /\/malaita\/v2\/1\/items\/\d+\/likes\//.exec(url) // 展开点赞
            || /\/malaita\/v2\/users\/\d+\/\?email_prefix=/.exec(url) // 他人信息
            || /\/malaita\/users\/\d+\/posts\//.exec(url) // 主页 posts
            || /\/malaita\/v2\/1\/search\/posts\//.exec(url) // 搜索 posts
        ) {
            // feed 与 展开点赞 / 评论列表
            const responseClone = response.clone();
            let res = await responseClone.json();
    
            // backup
            if (getMenuValue(MENU_KEY_AUTO_BACKUP)) {
              debugLog('hit backup posts: ', url);
              backupRes(res);
            }

            // 打标
            if (res.entities && res.entities.users) {
              Object.keys(res.entities.users).forEach(userId => {
                const user = res.entities.users[userId];
                user.name = `${user.name}_${userId}`;
              });
            }

            // filter
            if (res.entities && res.entities.posts) {
              const blackWordList = getMenuValue(MENU_KEY_POST_BLACK_WORD_LIST).split(',').filter(a => a !== '');
              const shouldFilterNewBytedancerPost = getMenuValue(MENU_KEY_FILTER_NEW_BYTEDANCER);
              const shouldFilterAnonymousPost = getMenuValue(MENU_KEY_FILTER_ANONYMOUS);
              Object.keys(res.entities.posts).forEach(postId => {
                const post = res.entities.posts[postId];
                let isHit = false;
                let hitBlackWord = '';
                if (blackWordList.some(word => post.content.includes(word) && (hitBlackWord = word))) {
                  debugLog('hit black word: ',hitBlackWord, post);
                  isHit = true;
                  post.content = 'Blocked because black word: ' + hitBlackWord + '.';
                } else if (shouldFilterNewBytedancerPost && post.status === 128) {
                  isHit = true;
                  debugLog('remove new bytedancer post: ', post);
                  post.content = 'Blocked because this post is from new bytedancer.';
                } else if (shouldFilterAnonymousPost && post.is_anonymous) {
                  isHit = true;
                  debugLog('remove anonymous post: ', post);
                  post.content = 'Blocked because this is an anonymous post.';
                }
                if (isHit) {
                  post.images = [];
                  post.vid = post.vid_height = post.vid_width = post.vid_size = post.video_url = null;
                  post.is_anonymous = true;
                  if (relationships = res.relationships) {
                    if (itemComment = relationships.item_comments?.[postId]) {
                      itemComment.ids = [];
                      itemComment.total = 0;
                      itemComment.has_more = false;
                    }
                    if (itemLike = relationships.item_likes?.[postId]) {
                      itemLike.total = 0;
                      itemLike.has_like = false;
                      itemLike.anonymous_count = 114514;
                      itemLike.ids = itemLike.like_ids = [];
                      if (extra = itemLike.extra) {
                        extra.anonymous_count = 114514;
                        extra.has_like = false;
                      }
                    }
                  }
                  debugLog('edited post', postId, res.relationships.item_comments[postId], res.relationships.item_likes[postId]);
                }
              });
            }
            return new Response(JSON.stringify(res), response);
          } else {
            return response;
          }
        });
      };
      // endregion
    
      // region main - hack xhr
      const originXhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (url.includes('snssdk.com/') || url.includes('https://ee.bytedance.net/sentry/api/')) {
          // debugLog('已拦截埋点上报: ', url);
          this.abort();
          return;
        }
        return originXhrOpen.call(this, method, url, ...args);
      };
      // endregion
      // region main - register menu
      registerMenuCommand();
      // endregion
      // endregion
    })();
    
    (async function () {
      const postListElement = await waitForGet(() => document.querySelector('.post-list'), 500, 20);
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.classList && node.classList.contains('post') && node.classList.contains('card')) {
                const postElement = node;
                const mainContainerEle = postElement.querySelector('.main-container');
                const postHeaderEle = postElement.querySelector('.post-header');
                const afterPostHeaderEle = postHeaderEle.nextElementSibling;
                const authorEle = postElement.querySelector('.nickname');
                const [authorName, authorId] = authorEle.innerText.split('_');

                if (authorId) {
                  const author = window.unsafeWindow.ttqMap.users[authorId] || (await (window.unsafeWindow.ttqDB.get('users', authorId)));
                  if (author.department) {
                    const authorDepartmentSpanEle = document.createElement('div');
                    if (author.office) {
                      authorDepartmentSpanEle.innerText = author.office + ' ' + author.department;
                    } else {
                      authorDepartmentSpanEle.innerText = author.department;
                    }
                    authorDepartmentSpanEle.style = "font-size:4px;color:grey;margin-top:6px;";
                    mainContainerEle.insertBefore(authorDepartmentSpanEle, afterPostHeaderEle);
                  }
                  if (author.description) {
                    const authorDescriptionSpanEle = document.createElement('div');
                    authorDescriptionSpanEle.innerText = author.description;
                    authorDescriptionSpanEle.style = "color:grey;font-size:4px;margin-top:6px;";
                    mainContainerEle.insertBefore(authorDescriptionSpanEle, afterPostHeaderEle);
                  }
                }
                // const postId = postElement.getAttribute('data-id');
                // const postContentElement = postElement.querySelector('.post-content');
                // const postContent = postContentElement.innerText;
                // const postContentElementClone = postContentElement.cloneNode(true);
                // postContentElementClone.querySelectorAll('img').forEach(img => img.remove());
                // const postContentText = postContentElementClone.innerText;
                // const postContentTextLength = postContentText.length;
                // const postContentTextLengthElement = document.createElement('span');
                // postContentTextLengthElement.innerText = postContentTextLength;
                // postContentTextLengthElement.style.color = postContentTextLength > 100 ? 'red' : 'green';
                // postContentElement.appendChild(postContentTextLengthElement);
              }
            });
          }
        });
      });
      observer.observe(postListElement, {
        childList: true,
        subtree: false
      });
    })();
})();
