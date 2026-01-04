// ==UserScript==
// @name        Twitter Media Downloader (beta)
// @name:ja     Twitter Media Downloader (beta)
// @name:zh-cn  Twitter 媒体下载 (beta)
// @name:zh-tw  Twitter 媒體下載 (beta)
// @description    Save Video/Photo by One-Click.
// @description:ja ワンクリックで動画・画像を保存する。
// @description:zh-cn 一键保存视频/图片
// @description:zh-tw 一鍵保存視頻/圖片
// @version     1.27
// @author      AMANE
// @namespace   none
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @connect     pbs.twimg.com
// @connect     video.twimg.com
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @compatible  Chrome
// @compatible  Firefox
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482057/Twitter%20Media%20Downloader%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482057/Twitter%20Media%20Downloader%20%28beta%29.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const filename = 'twitter_{user-name}(@{user-id})_{date-time}_{tweet-id}_{file-type}';

const TMD = (function () {
  let lang, host, history, show_sensitive, is_tweetdeck;
  return {
    init: async function () {
      GM_registerMenuCommand((this.language[navigator.language] || this.language.en).settings, this.settings);
      lang = this.language[document.querySelector('html').lang] || this.language.en;
      host = location.hostname;
      is_tweetdeck = host.indexOf('tweetdeck') >= 0;
      history = this.storage_obsolete();
      if (history.length) {
        this.storage(history);
        this.storage_obsolete(true);
      } else history = await this.storage();
      show_sensitive = GM_getValue('show_sensitive', false);
      document.head.insertAdjacentHTML('beforeend', '<style>' + this.css + (show_sensitive ? this.css_ss : '') + '</style>');
      let observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => this.detect(node))));
      observer.observe(document.body, {childList: true, subtree: true});
    },
    detect: function(node) {
      let article = node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'));
      if (article) this.addButtonTo(article);
      let listitems = node.tagName == 'LI' && node.getAttribute('role') == 'listitem' && [node] || node.tagName == 'DIV' && node.querySelectorAll('li[role="listitem"]');
      if (listitems) this.addButtonToMedia(listitems);
    },
    addButtonTo: function (article) {
      if (article.dataset.detected) return;
      article.dataset.detected = 'true';
      let media_selector = [
        'a[href*="/photo/1"]',
        'div[role="progressbar"]',
        'div[data-testid="playButton"]',
        'a[href="/settings/content_you_see"]', //hidden content
        'div.media-image-container', // for tweetdeck
        'div.media-preview-container', // for tweetdeck
        'div[aria-labelledby]>div:first-child>div[role="button"][tabindex="0"]' //for audio (experimental)
      ];
      let media = article.querySelector(media_selector.join(','));
      if (media) {
        let tweet_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let btn_group = article.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');
        let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div, li.tweet-action-item>a, li.tweet-detail-action-item>a')).pop().parentNode;
        let btn_down = btn_share.cloneNode(true);
        if (is_tweetdeck) {
          btn_down.firstElementChild.innerHTML = '<svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">' + this.svg + '</svg>';
          btn_down.firstElementChild.removeAttribute('rel');
          btn_down.classList.replace("pull-left", "pull-right");
        } else {
          btn_down.querySelector('svg').innerHTML = this.svg;
        }
        let is_exist = history.indexOf(tweet_id) >= 0;
        this.status(btn_down, 'tmd-down');
        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
        btn_group.insertBefore(btn_down, btn_share.nextSibling);
        btn_down.onclick = () => this.click(btn_down, tweet_id, is_exist);
        if (show_sensitive) {
          let btn_show = article.querySelector('div[aria-labelledby] div[role="button"][tabindex="0"]:not([data-testid]) > div[dir] > span > span');
          if (btn_show) btn_show.click();
        }
      }
      let imgs = article.querySelectorAll('a[href*="/photo/"]');
      if (imgs.length > 1) {
        let tweet_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let is_exist = history.indexOf(tweet_id) >= 0;
        imgs.forEach(img => {
          let index = img.href.split('/status/').pop().split('/').pop();
          let btn_down = document.createElement('div');
          btn_down.innerHTML = '<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">' + this.svg + '</svg></div></div>';
          btn_down.classList.add('tmd-down', 'tmd-img');
          this.status(btn_down, 'download');
          img.parentNode.appendChild(btn_down);
          btn_down.onclick = e => {
            e.preventDefault();
            this.click(btn_down, tweet_id, is_exist, index);
          }
        });
      }
    },
    addButtonToMedia: function(listitems) {
      listitems.forEach(li => {
        if (li.dataset.detected) return;
        li.dataset.detected = 'true';
        let tweet_id = li.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let is_exist = history.indexOf(tweet_id) >= 0;
        let btn_down = document.createElement('div');
        btn_down.innerHTML = '<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">' + this.svg + '</svg></div></div>';
        btn_down.classList.add('tmd-down', 'tmd-media');
        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
        li.appendChild(btn_down);
        btn_down.onclick = () => this.click(btn_down, tweet_id, is_exist);
      });
    },
    click: async function (btn, tweet_id, is_exist, index) {
      if (btn.classList.contains('loading')) return;
      this.status(btn, 'loading');
      let out = (await GM_getValue('filename', filename)).split('\n').join('');
      let save_history = await GM_getValue('save_history', true);
      let json = await this.fetchJson(tweet_id);
      let tweet = json.legacy;
      let user = json.core.user_results.result.legacy;
      let invalid_chars = {'\\': '＼', '\/': '／', '\|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': ''};
      let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid_chars[v]) : 'YYYYMMDD-hhmmss';
      let info = {};
      info['tweet-id'] = tweet_id;
      info['status-id'] = tweet_id;
      info['user-name'] = user.name.replace(/([\\/|*?:"]|[\u200b-\u200d\u2060\ufeff]|🔞)/g, v => invalid_chars[v]);
      info['user-id'] = user.screen_name;
      info['date-time'] = this.formatDate(tweet.created_at, datetime);
      info['date-time-local'] = this.formatDate(tweet.created_at, datetime, true);
      info['full-text'] = tweet.full_text.split('\n').join(' ').replace(/\s*https:\/\/t\.co\/\w+/g, '').replace(/[\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]/g, v => invalid_chars[v]);
      let medias = tweet.extended_entities && tweet.extended_entities.media;
      if (index) medias = [medias[index - 1]];
      if (medias.length > 0) {
        let tasks = medias.length;
        let tasks_result = [];
        medias.forEach((media, i) => {
          info.url = media.type == 'photo' ? media.media_url_https + ':orig' : media.video_info.variants.filter(n => n.content_type == 'video/mp4').sort((a, b) => b.bitrate - a.bitrate)[0].url;
          info.file = info.url.split('/').pop().split(/[:?]/).shift();
          info['file-name'] = info.file.split('.').shift();
          info['file-ext'] = info.file.split('.').pop();
          info['file-type'] = media.type.replace('animated_', '');
          info.out = (out.replace(/\.?{file-ext}/, '') + ((medias.length > 1 || index) && !out.match('{file-name}') ? '-' + (index ? index - 1 : i) : '') + '.{file-ext}').replace(/{([^{}:]+)(:[^{}]+)?}/g, (match, name) => info[name]);
          TMDownloader.add({
            url: info.url,
            name: info.out,
            onload: () => {
              tasks -= 1;
              tasks_result.push(((medias.length > 1 || index) ? (index ? index : i + 1) + ': ' : '') + lang.completed);
              this.status(btn, null, tasks_result.sort().join('\n'));
              if (tasks === 0) {
                this.status(btn, 'completed', lang.completed);
                if (save_history && !is_exist) {
                  history.push(tweet_id);
                  this.storage(tweet_id);
                }
              }
            },
            onerror: result => {
              tasks = -1;
              tasks_result.push((medias.length > 1 ? i + 1 + ': ' : '') + result);
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
      };
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
      let filename_input = $element(filename_label, 'textarea', 'display: block; min-width: 360px; max-width: 360px; min-height: 100px; font-size: inherit; background: white; color: black;', await GM_getValue('filename', filename));
      let filename_tags = $element(filename_div, 'label', 'display: table; margin: 10px;', `
<span class="tmd-tag" title="user name">{user-name}</span>
<span class="tmd-tag" title="The user name after @ sign.">{user-id}</span>
<span class="tmd-tag" title="example: 1234567890987654321">{tweet-id}</span>
<br>
<span class="tmd-tag" title="{date-time} : Posted time in UTC.\n{date-time-local} : Your local time zone.\n\nDefault:\nYYYYMMDD-hhmmss => 20201231-235959\n\nExample of custom:\n{date-time:DD-MMM-YY hh.mm} => 31-DEC-21 23.59">{date-time}</span>
<span class="tmd-tag" title="Type of &#34;video&#34; or &#34;photo&#34; or &#34;gif&#34;.">{file-type}</span>
<span class="tmd-tag" title="Original filename from URL.">{file-name}</span>
<br>
<span class="tmd-tag" title="Text content in tweet.">{full-text}</span>
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
    fetchJson: async function (tweet_id) {
      let base_url = `https://${host}/i/api/graphql/SGwBp0zRvv5uBLnCMJG75w/TweetDetail`;
      let variables = {
        "focalTweetId":tweet_id,
        "with_rux_injections":false,
        "includePromotedContent":true,
        "withCommunity":true,
        "withQuickPromoteEligibilityTweetFields":true,
        "withBirdwatchNotes":true,
        "withVoice":true,
        "withV2Timeline":true
      };
      let features = {
        "responsive_web_graphql_exclude_directive_enabled":true,
        "verified_phone_label_enabled":false,
        "creator_subscriptions_tweet_preview_api_enabled":true,
        "responsive_web_graphql_timeline_navigation_enabled":true,
        "responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,
        "c9s_tweet_anatomy_moderator_badge_enabled":true,
        "tweetypie_unmention_optimization_enabled":true,
        "responsive_web_edit_tweet_api_enabled":true,
        "graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,
        "view_counts_everywhere_api_enabled":true,
        "longform_notetweets_consumption_enabled":true,
        "responsive_web_twitter_article_tweet_consumption_enabled":false,
        "tweet_awards_web_tipping_enabled":false,
        "freedom_of_speech_not_reach_fetch_enabled":true,
        "standardized_nudges_misinfo":true,
        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,
        "longform_notetweets_rich_text_read_enabled":true,
        "longform_notetweets_inline_media_enabled":true,
        "responsive_web_media_download_video_enabled":false,
        "responsive_web_enhance_cards_enabled":false
      };
      let url = encodeURI(`${base_url}?variables=${JSON.stringify(variables)}&features=${JSON.stringify(features)}`);
      let cookies = this.getCookie();
      let headers = {
        'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'x-twitter-active-user': 'yes',
        'x-twitter-client-language': cookies.lang,
        'x-csrf-token': cookies.ct0
      };
      if (cookies.ct0.length == 32) headers['x-guest-token'] = cookies.gt;
      let tweet_detail = await fetch(url, {headers: headers}).then(result => result.json());
      let tweet_entrie = tweet_detail.data.threaded_conversation_with_injections_v2.instructions[0].entries.find(n => n.entryId == `tweet-${tweet_id}`);
      let tweet_result = tweet_entrie.content.itemContent.tweet_results.result;
      return tweet_result.tweet || tweet_result;
    },
    getCookie: function (name) {
      let cookies = {};
      document.cookie.split(';').filter(n => n.indexOf('=') > 0).forEach(n => {
        n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
          cookies[name.trim()] = value.trim();
        });
      });
      return name ? cookies[name] : cookies;
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
      let m = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
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
    language: {
      en: {download: 'Download', completed: 'Download Completed', settings: 'Settings', dialog: {title: 'Download Settings', save: 'Save', save_history: 'Remember download history', clear_history: '(Clear)', clear_confirm: 'Clear download history?', show_sensitive: 'Always show sensitive content', pattern: 'File Name Pattern'}},
      ja: {download: 'ダウンロード', completed: 'ダウンロード完了', settings: '設定', dialog: {title: 'ダウンロード設定', save: '保存', save_history: 'ダウンロード履歴を保存する', clear_history: '(クリア)', clear_confirm: 'ダウンロード履歴を削除する？', show_sensitive: 'センシティブな内容を常に表示する', pattern: 'ファイル名パターン'}},
      zh: {download: '下载', completed: '下载完成', settings: '设置', dialog: {title: '下载设置', save: '保存', save_history: '保存下载记录', clear_history: '(清除)', clear_confirm: '确认要清除下载记录？', show_sensitive: '自动显示敏感的内容', pattern: '文件名格式'}},
      'zh-Hant': {download: '下載', completed: '下載完成', settings: '設置', dialog: {title: '下載設置', save: '保存', save_history: '保存下載記錄', clear_history: '(清除)', clear_confirm: '確認要清除下載記錄？', show_sensitive: '自動顯示敏感的内容', pattern: '文件名規則'}}
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

.tmd-down.tmd-img {position: absolute; right: 0; bottom: 0; display: none !important;}
.tmd-down.tmd-img > div {display: flex; border-radius: 99px; margin: 2px; background-color: rgba(255,255,255, 0.6);}
.tmd-down.tmd-img > div > div {display: flex; margin: 6px; color: #fff !important;}
.tmd-down.tmd-img:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
.tmd-down.tmd-img:hover > div > div {color: rgba(29, 161, 242, 1.0);}
:hover > .tmd-down.tmd-img, .tmd-img.loading, .tmd-img.completed, .tmd-img.failed {display: block !important;}
.tweet-detail-action-item {width: 20% !important;}
`,
    css_ss: `
/* show sensitive in media tab */
li[role="listitem"]>div>div>div>div:not(:last-child) {filter: none;}
li[role="listitem"]>div>div>div>div+div:last-child {display: none;}
`,
    svg: `
<g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></g>
<g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round" /></g>
<g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4" /><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round" /></g>
<g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8" /><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none" /></g>
`
  };
})();

const TMDownloader = (function() {
  let active = {}, queue = [], retry_queue = [];
  let max_thread = 2, active_thread = 0, failed_thread = 0;
  let traffic = 0, traffic_buffer = [], traffic_update;
  return {
    init: function() {
      this.notifier.init();
    },
    add: function(task, is_retry) {
      task.finish = false;
      task.failed = false;
      if (is_retry) {
        retry_queue.unshift(task);
      } else {
        task.retry = 0;
        queue.push(task);
      }
      if (active_thread < max_thread) {
        this.next();
      } else {
        this.notifier.update();
      }
    },
    next: async function() {
      active_thread++;
      let task = retry_queue.shift() || queue.shift();
      this.notifier.update();
      await this.start(task);
      active_thread--;
      if (retry_queue.length > 0 || queue.length > 0) {
        this.next();
      } else {
        this.notifier.update();
      }
    },
    start: async function(task) {
      active[task.id] = task;
      let result = await this.get_blob(task);
      if (result.status == 200) {
        let blob_url = URL.createObjectURL(result.response);
        let link = document.createElement('a');
        link.href = blob_url;
        link.download = task.name;
        link.dispatchEvent(new MouseEvent('click'));
        task.onload();
        setTimeout(() => URL.revokeObjectURL(blob_url), 100);
      } else {
        failed_thread++;
        task.onerror(result.statusText);
      }
    },
    get_blob: function(task) {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          url: task.url, method: "GET", responseType: "blob",
          onload: response => resolve(response),
          onerror: response => resolve(response),
          ontimeout: response => resolve(response),
          onprogress: response => {
            traffic += response.loaded - (task.loaded || 0);
            task.loaded = response.loaded;
          }
        });
      });
    },
    notifier: (function() {
      let tmd_notifier, tmd_status, tmd_tasks;
      return {
        init: function() {
          document.head.insertAdjacentHTML('beforeend', '<style id="css_tmd">' + this.css + '</style>');
          document.body.insertAdjacentHTML('beforeend', `
<div class="tmd-notifier">
  <div class="tmd-status" hidden>
    <label class="active"><span class="icon">${this.svg.download}</span><span class="text">0</span></label>
    <label class="queue"><span class="icon">${this.svg.waiting}</span><span class="text">0</span></label>
    <label class="failed" hidden><span class="icon">${this.svg.failed}</span><span class="text">0</span></label>
    <label class="speed"><span class="icon">${this.svg.speed}</span><span class="text">0 <small>KB/s</small></span></label>
  </div>
</div>
`);
          [tmd_notifier, tmd_status, tmd_tasks] = document.querySelectorAll('.tmd-notifier, .tmd-status, .tmd-tasks');
        },
        update: function() {
          tmd_status.hidden = (active_thread == 0 && failed_thread == 0 && queue.length == 0);
          tmd_status.querySelector('.active .text').innerText = active_thread;
          tmd_status.querySelector('.queue .text').innerText = queue.length;
          tmd_status.querySelector('.failed .text').innerText = failed_thread;
          tmd_status.querySelector('.failed').hidden = failed_thread == 0;
          if (active_thread > 0) {
            if (!traffic_update) {
              traffic_update = setInterval(() => {
                traffic_buffer.push(traffic);
                let speed = traffic_buffer.reduce((a, b) => a + b, 0) / traffic_buffer.length / 1024;
                tmd_status.querySelector('.speed .text').innerHTML = speed < 1000 ? Math.round(speed) + ' <small>KB/s</small>' : (speed / 1024).toFixed(2) + ' <small>MB/s</small>';
                if (traffic_buffer.length >= 5) traffic_buffer.shift();
                traffic = 0;
              }, 1000);
            }
          } else {
            clearInterval(traffic_update);
            traffic_update = null;
            traffic_buffer = [];
            tmd_status.querySelector('.speed .text').innerHTML = '0 <small>KB/s</small>';
          }
        },
        css: `
/* position */
.tmd-notifier {position: fixed; left: 1em; bottom: 2.5em;}

/* common style */
.tmd-notifier {font-size: 12pt; color: initial;}
.tmd-notifier label {display: flex; align-items: center; line-height: 1;}
.tmd-notifier label .icon {width: 1em; height: 1em;}

/* ststus bar */
.tmd-status {display: flex; background: linear-gradient(#fff, #eee); border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 0 5px #ccc;}

/* ststus bar style */
.tmd-status label {margin: .25em 0;}
.tmd-status label:not(:first-child) {border-left: 1px solid #ccc;}
.tmd-status label .icon {margin: 0 .75em;}
.tmd-status label .text {margin-right: 1em; font-size: .75em;}

/* fade-in and fade-out */
.tmd-status {transition: opacity .25s ease;}
.tmd-status[hidden] {opacity: 0; display: none;}
.tmd-status[hidden]:hover {opacity: 1;}
.tmd-status .failed[hidden] {display: none;}
`,
        svg: {
          download: '<svg viewBox="0,0,24,24" ><path d="M2,16 a1,1,0,0,1,2,0 v3 a1,1,0,0,0,1,1 h14 a1,1,0,0,0,1,-1 v-4 a1,1,0,0,1,2,0 v5 a2,2,0,0,1,-2,2 h-16 a2,2,0,0,1,-2,-2 z M5.5,12 l5,5 a2,2,0,0,0,3,0 l5,-5 a1,1,0,0,0,-1.5,-1.5 l-4,4 v-12 a1,1,0,0,0,-2,0 v12 l-4,-4 a1,1,0,0,0,-1.5,1.5" fill="#39c" stroke="none" /></svg>',
          waiting: '<svg viewBox="0,0,24,24" ><path d="M12,1 a1,1 0 0 1 0,22 a1,1 0 0 1 0,-22 m0,2 a1,1 0 0 0 0,18 a1,1 0 0 0 0,-18 m0,1 a1,1 0 0 1 1,1 v6 h5 a1,1 0 0 1 0 2 h-5 a1,1 0 0 1 -2-2 v-6 a1,1 0 0 1 1,-1" fill="#993" stroke="none" /></svg>',
          failed: '<svg viewBox="0,0,24,24" ><path d="M12,1 a1,1 0 0 1 0,22 a1,1 0 0 1 0,-22 m0,2 a1,1 0 0 0 0,18 a1,1 0 0 0 0,-18 m0,1 a2,2 0 0 1 2,2 l-1,8 a1,1 0 0 1 -2,0 l-1-8 a2 2 0 0 1 2,-2 m0,12 a1,1 0 0 0 0 4 a1,1 0 0 0 0 -4" fill="#f66" stroke="none" /></svg>',
          speed: '<svg viewBox="0,0,24,24" ><path d="M3,18 l3.5,3.5 a1,1 0 0 0 1 0 l3.5,-3.5 a1.5,1 -30 0 0 0,-1.5 h-2.5 v-10 a0.5,0.5 0 0 0 -0.5 -0.5 h-2 a0.5,0.5 0 0 0 -0.5 0.5 v10 h-2.5 a1.5,1 30 0 0 0 1.5 M21,6 l-3.5 -3.5 a1 1 0 0 0 -1 0 l-3.5 3.5 a1.5 1 -30 0 0 0 1.5 h2.5 v10 a0.5 0.5 0 0 0 0.5 0.5 h2 a0.5 0.5 0 0 0 0.5 -0.5 v-10 h2.5 a1.5 1 30 0 0 0 -1.5" fill="#393" stroke="none" /></svg>',
          reload: '<svg viewBox="0,0,24,24" ><path d="M3,11 v2 a5 5 0 0 0 5 5 h10 m-3 -2 l3 2 m-3 2 l3-2 M21 13 v-2 a5 5 0 0 0 -5 -5 h-10 m3 2 l-3 -2 m3 -2 -3 2" fill="none" stroke="#1DA1F2" stroke-width="3" stroke-linecap="round" /></svg>',
          remove: '<svg viewBox="0,0,24,24" ><path d="M5,6 h14 M9 6 v-3 h6 v3 M6 9 v10 a2,2 0 0 0 2 2 h8 a2 2 0 0 0 2 -2 v-10 M10 11 v6 M14 11 v6" fill="none" stroke="#f66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>'
        }
      };
    })()
  };
})();

TMD.init();
TMDownloader.init();
