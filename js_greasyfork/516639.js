// ==UserScript==
// @name        bsky Media Downloader
// @name:ja     bsky Media Downloader
// @name:zh-cn  bsky 媒体下载
// @name:zh-tw  bsky 媒體下載
// @description    Save Video/Photo by One-Click.
// @description:ja ワンクリックで動画・画像を保存する。
// @description:zh-cn 一键保存视频/图片
// @description:zh-tw 一鍵保存視頻/圖片
// @version     0.2
// @author      MJ
// @namespace   none
// @match       https://bsky.app/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/516639/bsky%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516639/bsky%20Media%20Downloader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const filename = 'bsky_{user-name}(@{user-id})_{date-time}_{rkey}_{file-type}';

const TMD = (function () {
  let lang, host, history, show_sensitive;
  return {
    init: async function () {
      GM_registerMenuCommand((this.language[navigator.language] || this.language.en).settings, this.settings);
      lang = this.language[document.querySelector('html').lang.substr(0, 2)] || this.language.en;
      host = location.hostname;
      history = this.storage_obsolete();
      if (history.length) {
        this.storage(history);
        this.storage_obsolete(true);
      } else history = await this.storage();
      show_sensitive = GM_getValue('show_sensitive', false);
      document.head.insertAdjacentHTML('beforeend', '<style>' + this.css + (show_sensitive ? this.css_ss : '') + '</style>');
      let observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))));
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
    detect: function (node) {
      if (typeof node.querySelector !== 'function') return;
      let nodediv = '';
      if (window.location.pathname.includes('/post/')) {
        nodediv = node.querySelector('div[data-testid*="postThreadItem"]');
        if (nodediv) nodediv = nodediv.lastChild;
      } else if (window.location.pathname.includes('/hashtag/') || window.location.pathname.includes('/search?')) {
		nodediv = node.querySelector('div[role="link"]>div');
        if (nodediv) {
			let nodechildren = node.lastChild.children;
			for (let i=1;i<nodechildren.length;i++) {
				nodediv = nodechildren[i].querySelector('div[role="link"]');
				if (nodediv) {
					nodediv = nodediv.lastChild.lastChild;
					if (nodediv) this.addButtonTo(nodediv);
				}
			}
		}
		return;
	  } else {
        nodediv = node.querySelector('div[role="link"]>div');
        if (nodediv) nodediv = nodediv.lastChild.lastChild;
      }
      if (nodediv) this.addButtonTo(nodediv);
    },
    extractPostInfo: function (posturl, mediaurl) {
      const res = {
        handle: '',
        did: '',
        rkey: '',
        h_r: '',
      };
      const match_post = posturl.match(/^https:\/\/bsky\.app\/profile\/([^/]+)\/post\/([^/]+)$/);
      if (match_post) {
        res.handle = match_post[1];
        res.rkey = match_post[2];
        res.h_r = res.handle + '_' + res.rkey;
      }
      mediaurl = decodeURIComponent(mediaurl);
      const match_media = mediaurl.match(/did:plc:([^/]+)\//);
      if (match_media) {
        res.did = match_media[1];
      }
      return res;
    },
    addButtonTo: function (nodediv) {
      if (nodediv.dataset.detected) return;
      nodediv.dataset.detected = 'true';
      let _this = this;
      let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            observer.disconnect(); // 停止观察
            mutation.addedNodes.forEach((node) => {
              if (node.tagName === 'DIV' || node.tagName === 'FIGURE') {
                let media = node.querySelector('img, video');
                if (media.tagName === 'VIDEO' || media.tagName === 'IMG') {
                  if (media) {
                    let mediaurl = '';
                    if (media.tagName == 'VIDEO') {
                      mediaurl = media.poster;
                    } else if (media.tagName == 'IMG') {
                      mediaurl = media.src;
                    }
                    let btn_group = nodediv.lastChild;
                    let posturlhrefa = nodediv.querySelector('a[href*="/post/"]');
                    let posturl = '';
                    if (posturlhrefa) {
                      posturl = posturlhrefa.href;
                    } else {
                      btn_group = btn_group.lastChild;
                      posturl = window.location.href;
                    }
                    if (btn_group.dataset.detected) return;
                    btn_group.dataset.detected = 'true';
                    let btn_more = btn_group.lastChild;
                    let btn_down = btn_more.cloneNode(true);

                    let post_info = _this.extractPostInfo(posturl, mediaurl);
                    btn_down.lastChild.querySelector('svg').innerHTML = _this.svg;
                    let is_exist = history.indexOf(post_info.h_r) >= 0;
                    _this.status(btn_down, 'tmd-down');
                    _this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
                    btn_group.appendChild(btn_down);
                    btn_down.onclick = (event) => _this.click(event, btn_down, post_info, is_exist);
                    if (show_sensitive) {
                      let btn_show = nodediv.querySelector('div[aria-labelledby] div[role="button"][tabindex="0"]:not([data-testid]) > div[dir] > span > span');
                      if (btn_show) btn_show.click();
                    }
                  }
                }
              }
            });
          }
        });
      });
      observer.observe(nodediv, {
        childList: true, // 观察子节点的变化
        subtree: true // 观察整个子树
      });
    },
    click: async function (event, btn, post_info, is_exist) {
      event.stopPropagation(); // 阻止事件冒泡
      if (btn.classList.contains('loading')) return;
      this.status(btn, 'loading');
      let out = (await GM_getValue('filename', filename)).split('\n').join('');
      let save_history = await GM_getValue('save_history', true);
      const json = await this.fetchJson(post_info);
      const threadPost = json.thread.post;
      let invalid_chars = {
        '\\': '＼',
        '\/': '／',
        '\|': '｜',
        '<': '＜',
        '>': '＞',
        ':': '：',
        '*': '＊',
        '?': '？',
        '"': '＂',
        '\u200b': '',
        '\u200c': '',
        '\u200d': '',
        '\u2060': '',
        '\ufeff': '',
        '🔞': ''
      };
      const createdAt = threadPost.record?.createdAt || threadPost.indexedAt || new Date().toISOString();
      let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid_chars[v]) : 'YYYYMMDD-hhmmss';
      let info = {};
      info.rkey = post_info.rkey;
      info['user-name'] = threadPost.author.displayName.replace(/([\\/|*?:"]|[\u200b-\u200d\u2060\ufeff]|🔞)/g, v => invalid_chars[v]);
      info['user-id'] = threadPost.author.handle.replace(/[^a-z0-9_\-]/gi, '_');
      info['date-time'] = this.formatDate(createdAt, datetime);
      info['date-time-local'] = this.formatDate(createdAt, datetime, true);
      const embed = threadPost.embed;
      let medias = [];
      if (embed) {
        if (embed.$type === 'app.bsky.embed.video#view') medias.push(embed.playlist); // video
        else if (embed.$type === 'app.bsky.embed.images#view') { // image
          for (let i = 0; i < embed.images.length; i++) {
            let image = embed.images[i];
            medias.push(image.fullsize);
          }
        }
      }
      if (medias.length > 0) {
        let tasks = medias.length;
        let tasks_result = [];
        medias.forEach((media, i) => {
          info.url = media;
          info.file = info.url.split('/').pop();
          info['file-name'] = info.file.split(/[.@]/).shift();
          info['file-ext'] = info.file.split(/[.@]/).pop();
          if (info['file-ext'] === 'jpeg') info['file-ext'] = 'jpg';
          else if (info['file-ext'] === 'm3u8') info['file-ext'] = 'mp4';
          info['file-type'] = info['file-ext'] === 'mp4' ? 'video' : 'photo';
          info.out = (out + (medias.length > 1 && !out.match('{file-name}') ? '-' + i : '') + '.{file-ext}').replace(/{([^{}:]+)(:[^{}]+)?}/g, (match, name) => info[name]);
          this.downloader.add({
            url: info.url,
            name: info.out,
            type: info['file-type'],
            onload: () => {
              tasks -= 1;
              tasks_result.push((medias.length > 1 ? ': ' : '') + lang.completed);
              this.status(btn, null, tasks_result.sort().join('\n'));
              if (tasks === 0) {
                this.status(btn, 'completed', lang.completed);
                if (save_history && !is_exist) {
                  history.push(post_info.h_r);
                  this.storage(post_info);
                }
              }
            },
            onerror: result => {
              tasks = -1;
              tasks_result.push((medias.length > 1 ? i + 1 + ': ' : '') + result.details.current);
              this.status(btn, 'failed', tasks_result.sort().join('\n'));
            }
          });
        });
      } else {
        this.status(btn, 'failed', 'MEDIA_NOT_FOUND');
      }
    },
    status: function (btn, css, title, style) {
      if (css) {
        btn.classList.remove('download', 'completed', 'loading', 'failed');
        btn.classList.add(css);
      }
      if (title) btn.title = title;
      if (style) btn.style.cssText = style;
    },
    settings: async function () {
      const $element = (parent, tag, style, content, css) => {
        let el = document.createElement(tag);
        if (style) el.style.cssText = style;
        if (typeof content !== 'undefined') {
          if (tag == 'input') {
            if (content == 'checkbox') el.type = content;
            else el.value = content;
          } else el.innerHTML = content;
        }
        if (css) css.split(' ').forEach(c => el.classList.add(c));
        parent.appendChild(el);
        return el;
      };
      let wapper = $element(document.body, 'div', 'position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; background-color: #0009; z-index: 10;');
      let wapper_close;
      wapper.onmousedown = e => {
        wapper_close = e.target == wapper;
      };
      wapper.onmouseup = e => {
        if (wapper_close && e.target == wapper) wapper.remove();
      };
      let dialog = $element(wapper, 'div', 'position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); width: fit-content; width: -moz-fit-content; background-color: #f3f3f3; border: 1px solid #ccc; border-radius: 10px; color: black;');
      let title = $element(dialog, 'h3', 'margin: 10px 20px;', lang.dialog.title);
      let options = $element(dialog, 'div', 'margin: 10px; border: 1px solid #ccc; border-radius: 5px;');
      let save_history_label = $element(options, 'label', 'display: block; margin: 10px;', lang.dialog.save_history);
      let save_history_input = $element(save_history_label, 'input', 'float: left;', 'checkbox');
      save_history_input.checked = await GM_getValue('save_history', true);
      save_history_input.onchange = () => {
        GM_setValue('save_history', save_history_input.checked);
      }
      let clear_history = $element(save_history_label, 'label', 'display: inline-block; margin: 0 10px; color: blue;', lang.dialog.clear_history);
      clear_history.onclick = () => {
        if (confirm(lang.dialog.clear_confirm)) {
          history = [];
          GM_setValue('download_history', []);
        }
      };
      let show_sensitive_label = $element(options, 'label', 'display: block; margin: 10px;', lang.dialog.show_sensitive);
      let show_sensitive_input = $element(show_sensitive_label, 'input', 'float: left;', 'checkbox');
      show_sensitive_input.checked = await GM_getValue('show_sensitive', false);
      show_sensitive_input.onchange = () => {
        show_sensitive = show_sensitive_input.checked;
        GM_setValue('show_sensitive', show_sensitive);
      };
      let filename_div = $element(dialog, 'div', 'margin: 10px; border: 1px solid #ccc; border-radius: 5px;');
      let filename_label = $element(filename_div, 'label', 'display: block; margin: 10px 15px;', lang.dialog.pattern);
      let filename_input = $element(filename_label, 'textarea', 'display: block; min-width: 500px; max-width: 500px; min-height: 100px; font-size: inherit; background: white; color: black;', await GM_getValue('filename', filename));
      let filename_tags = $element(filename_div, 'label', 'display: table; margin: 10px;', `
<span class="tmd-tag" title="user name">{user-name}</span>
<span class="tmd-tag" title="The user name after @ sign.">{user-id}</span>
<span class="tmd-tag" title="example: 1234567890987654321">{rkey}</span>
<span class="tmd-tag" title="{date-time} : Posted time in UTC.\n{date-time-local} : Your local time zone.\n\nDefault:\nYYYYMMDD-hhmmss => 20201231-235959\n\nExample of custom:\n{date-time:DD-MMM-YY hh.mm} => 31-DEC-21 23.59">{date-time}</span><br>
<span class="tmd-tag" title="Type of &#34;video&#34; or &#34;photo&#34; or &#34;gif&#34;.">{file-type}</span>
<span class="tmd-tag" title="Original filename from URL.">{file-name}</span>
`);
      filename_input.selectionStart = filename_input.value.length;
      filename_tags.querySelectorAll('.tmd-tag').forEach(tag => {
        tag.onclick = () => {
          let ss = filename_input.selectionStart;
          let se = filename_input.selectionEnd;
          filename_input.value = filename_input.value.substring(0, ss) + tag.innerText + filename_input.value.substring(se);
          filename_input.selectionStart = ss + tag.innerText.length;
          filename_input.selectionEnd = ss + tag.innerText.length;
          filename_input.focus();
        };
      });
      let btn_save = $element(title, 'label', 'float: right;', lang.dialog.save, 'tmd-btn');
      btn_save.onclick = async () => {
        await GM_setValue('filename', filename_input.value);
        wapper.remove();
      };
    },
    fetchJson: async function (post_info) {
      const postUri = `at://did:plc:${post_info.did}/app.bsky.feed.post/${post_info.rkey}`;
      const encodedUri = encodeURIComponent(postUri);
      const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodedUri}&depth=0`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    storage: async function (value) {
      let data = await GM_getValue('download_history', []);
      let data_length = data.length;
      if (value) {
        if (Array.isArray(value)) data = data.concat(value);
        else if (data.indexOf(value) < 0) data.push(value);
      } else return data;
      if (data.length > data_length) GM_setValue('download_history', data);
    },
    storage_obsolete: function (is_remove) {
      let data = JSON.parse(localStorage.getItem('history') || '[]');
      if (is_remove) localStorage.removeItem('history');
      else return data;
    },
    formatDate: function (i, o, tz) {
      let d = new Date(i);
      if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      let m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      let v = {
        YYYY: d.getUTCFullYear().toString(),
        YY: d.getUTCFullYear().toString(),
        MM: d.getUTCMonth() + 1,
        MMM: m[d.getUTCMonth()],
        DD: d.getUTCDate(),
        hh: d.getUTCHours(),
        mm: d.getUTCMinutes(),
        ss: d.getUTCSeconds(),
        h2: d.getUTCHours() % 12,
        ap: d.getUTCHours() < 12 ? 'AM' : 'PM'
      };
      return o.replace(/(YY(YY)?|MMM?|DD|hh|mm|ss|h2|ap)/g, n => ('0' + v[n]).substr(-n.length));
    },
    downloader: (function () {
      let tasks = [],
        thread = 0,
        max_thread = 2,
        retry = 0,
        max_retry = 2,
        failed = 0,
        notifier, has_failed = false;
      return {
        add: function (task) {
          tasks.push(task);
          if (thread < max_thread) {
            thread += 1;
            this.next();
          } else this.update();
        },
        next: async function () {
          let task = tasks.shift();
          await this.start(task);
          if (tasks.length > 0 && thread <= max_thread) this.next();
          else thread -= 1;
          this.update();
        },
        start: async function (task) {
          this.update();
          let mediaurl = task.url;
          if (task.type === 'video') {
            const masterPlaylistResponse = await fetch(task.url);
            const masterPlaylist = await masterPlaylistResponse.text();
            const videoPlaylistUrl = this.parseHighestQualityVideoUrl(masterPlaylist, task.url);
            const videoPlaylistResponse = await fetch(videoPlaylistUrl);
            const videoPlaylist = await videoPlaylistResponse.text();
            const segmentUrls = this.parseSegmentUrls(videoPlaylist, videoPlaylistUrl);
            const chunks = await this.downloadSegments(segmentUrls);
            const videoBlob = new Blob(chunks, {
              type: 'video/mp4'
            });
            mediaurl = URL.createObjectURL(videoBlob);
          }
          return new Promise(resolve => {
            GM_download({
              url: mediaurl,
              name: task.name,
              onload: result => {
                task.onload();
                resolve();
              },
              onerror: result => {
                this.retry(task, result);
                resolve();
              },
              ontimeout: result => {
                this.retry(task, result);
                resolve();
              }
            });
          });
        },
        retry: function (task, result) {
          retry += 1;
          if (retry == 3) max_thread = 1;
          if (task.retry && task.retry >= max_retry ||
            result.details && result.details.current == 'USER_CANCELED') {
            task.onerror(result);
            failed += 1;
          } else {
            if (max_thread == 1) task.retry = (task.retry || 0) + 1;
            this.add(task);
          }
        },
        update: function () {
          if (!notifier) {
            notifier = document.createElement('div');
            notifier.title = 'bsky Media Downloader';
            notifier.classList.add('tmd-notifier');
            notifier.innerHTML = '<label>0</label>|<label>0</label>';
            document.body.appendChild(notifier);
          }
          if (failed > 0 && !has_failed) {
            has_failed = true;
            notifier.innerHTML += '|';
            let clear = document.createElement('label');
            notifier.appendChild(clear);
            clear.onclick = () => {
              notifier.innerHTML = '<label>0</label>|<label>0</label>';
              failed = 0;
              has_failed = false;
              this.update();
            };
          }
          notifier.firstChild.innerText = thread;
          notifier.firstChild.nextElementSibling.innerText = tasks.length;
          if (failed > 0) notifier.lastChild.innerText = failed;
          if (thread > 0 || tasks.length > 0 || failed > 0) notifier.classList.add('running');
          else notifier.classList.remove('running');
        },
        parseHighestQualityVideoUrl: function (masterPlaylist, baseUrl) {
          const lines = masterPlaylist.split('\n');
          let highestBandwidth = 0;
          let highestQualityUrl = '';
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
              const bandwidthMatch = lines[i].match(/BANDWIDTH=(\d+)/);
              if (bandwidthMatch) {
                const bandwidth = parseInt(bandwidthMatch[1]);
                if (bandwidth > highestBandwidth) {
                  highestBandwidth = bandwidth;
                  highestQualityUrl = lines[i + 1];
                }
              }
            }
          }
          return new URL(highestQualityUrl, baseUrl).toString();
        },
        parseSegmentUrls: function (videoPlaylist, baseUrl) {
          return videoPlaylist.split('\n')
            .filter(line => !line.startsWith('#') && line.trim() !== '')
            .map(segment => new URL(segment, baseUrl).toString());
        },
        downloadSegments: async function (segmentUrls, progressCallback = null) {
          const chunks = [];
          const totalSegments = segmentUrls.length;
          for (let i = 0; i < totalSegments; i++) {
            const url = segmentUrls[i];
            const response = await fetch(url);
            const chunk = await response.arrayBuffer();
            chunks.push(chunk);

            if (progressCallback) progressCallback((i + 1) / totalSegments);
          }
          return chunks;
        }
      };
    })(),
    language: {
      en: {
        download: 'Download',
        completed: 'Download Completed',
        settings: 'Settings',
        dialog: {
          title: 'Download Settings',
          save: 'Save',
          save_history: 'Remember download history',
          clear_history: '(Clear)',
          clear_confirm: 'Clear download history?',
          show_sensitive: 'Always show sensitive content',
          pattern: 'File Name Pattern'
        }
      },
      ja: {
        download: 'ダウンロード',
        completed: 'ダウンロード完了',
        settings: '設定',
        dialog: {
          title: 'ダウンロード設定',
          save: '保存',
          save_history: 'ダウンロード履歴を保存する',
          clear_history: '(クリア)',
          clear_confirm: 'ダウンロード履歴を削除する？',
          show_sensitive: 'センシティブな内容を常に表示する',
          pattern: 'ファイル名パターン'
        }
      },
      zh: {
        download: '下载',
        completed: '下载完成',
        settings: '设置',
        dialog: {
          title: '下载设置',
          save: '保存',
          save_history: '保存下载记录',
          clear_history: '(清除)',
          clear_confirm: '确认要清除下载记录？',
          show_sensitive: '自动显示敏感的内容',
          pattern: '文件名格式'
        }
      },
      'zh-Hant': {
        download: '下載',
        completed: '下載完成',
        settings: '設置',
        dialog: {
          title: '下載設置',
          save: '保存',
          save_history: '保存下載記錄',
          clear_history: '(清除)',
          clear_confirm: '確認要清除下載記錄？',
          show_sensitive: '自動顯示敏感的内容',
          pattern: '文件名規則'
        }
      }
    },
    css: `
.tmd-down {margin-left: 12px; order: 99;}
.tmd-down:hover > div > div > div > div {color: rgba(29, 161, 242, 1.0);}
.tmd-down:hover > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.1);}
.tmd-down:active > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.2);}
.tmd-down:hover svg {color: rgba(29, 161, 242, 1.0);}
.tmd-down:hover div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.1);}
.tmd-down:active div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.2);}
.tmd-down.tmd-media {position: absolute; right: 0;}
.tmd-down.tmd-media > div {display: flex; border-radius: 99px; margin: 2px;}
.tmd-down.tmd-media > div > div {display: flex; margin: 6px; color: #fff;}
.tmd-down.tmd-media:hover > div {background-color: rgba(255,255,255, 0.6);}
.tmd-down.tmd-media:hover > div > div {color: rgba(29, 161, 242, 1.0);}
.tmd-down.tmd-media:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
.tmd-down g {display: none;}
.tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.loading g.loading,.tmd-down.failed g.failed {display: unset;}
.tmd-down.loading svg {animation: spin 1s linear infinite;}
@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
.tmd-btn {display: inline-block; background-color: #1DA1F2; color: #FFFFFF; padding: 0 20px; border-radius: 99px;}
.tmd-tag {display: inline-block; background-color: #FFFFFF; color: #1DA1F2; padding: 0 10px; border-radius: 10px; border: 1px solid #1DA1F2;  font-weight: bold; margin: 5px;}
.tmd-btn:hover {background-color: rgba(29, 161, 242, 0.9);}
.tmd-tag:hover {background-color: rgba(29, 161, 242, 0.1);}
.tmd-notifier {display: none; position: fixed; left: 16px; bottom: 16px; color: #000; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 4px;}
.tmd-notifier.running {display: flex; align-items: center;}
.tmd-notifier label {display: inline-flex; align-items: center; margin: 0 8px;}
.tmd-notifier label:before {content: " "; width: 32px; height: 16px; background-position: center; background-repeat: no-repeat;}
.tmd-notifier label:nth-child(1):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 /></svg>");}
.tmd-notifier label:nth-child(2):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,2 a1,1 0 0 1 0,20 a1,1 0 0 1 0,-20 M12,5 v7 h6%22 fill=%22none%22 stroke=%22%23999%22 stroke-width=%222%22 stroke-linejoin=%22round%22 stroke-linecap=%22round%22 /></svg>");}
.tmd-notifier label:nth-child(3):before {background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22><path d=%22M12,0 a2,2 0 0 0 0,24 a2,2 0 0 0 0,-24%22 fill=%22%23f66%22 stroke=%22none%22 /><path d=%22M14.5,5 a1,1 0 0 0 -5,0 l0.5,9 a1,1 0 0 0 4,0 z M12,17 a2,2 0 0 0 0,5 a2,2 0 0 0 0,-5%22 fill=%22%23fff%22 stroke=%22none%22 /></svg>");}
.tmd-down.tmd-img {position: absolute; right: 0; bottom: 0; display: none !important;}
.tmd-down.tmd-img > div {display: flex; border-radius: 99px; margin: 2px; background-color: rgba(255,255,255, 0.6);}
.tmd-down.tmd-img > div > div {display: flex; margin: 6px; color: #fff !important;}
.tmd-down.tmd-img:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
.tmd-down.tmd-img:hover > div > div {color: rgba(29, 161, 242, 1.0);}
:hover > .tmd-down.tmd-img, .tmd-img.loading, .tmd-img.completed, .tmd-img.failed {display: block !important;}
`,
    css_ss: `
/* show sensitive in media tab */
li[role="listitem"]>div>div>div>div:not(:last-child) {filter: none;}
li[role="listitem"]>div>div>div>div+div:last-child {display: none;}
`,
    svg: `
<g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="#788EA5" stroke-width="2" stroke-linecap="round" /></g>
<g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round" /></g>
<g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4" /><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round" /></g>
<g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="#788EA5" stroke-width="2" opacity="0.8" /><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none" /></g>
`
  };
})();

TMD.init();