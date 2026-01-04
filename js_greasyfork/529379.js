// ==UserScript==
// @name         X Pro
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Twitter AD Filter, Bookmark Remover, and Media Downloader. Hides ads, auto-removes bookmarks, and downloads media.
// @description:zh-CN  隐藏推特广告、自动移除书签并一键下载媒体。
// @author       OxqNbloF
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://*.x.com/*
// @icon         https://www.x.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529379/X%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/529379/X%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- AD Filter ---
    const adFilter = (function () {
        function hideAd(node) {
            if (!node || node.nodeName !== "DIV") return;
            const testId = node.getAttribute("data-testid");
            const placement = node.querySelector("div[data-testid='placementTracking'] > article");
            if (testId === "cellInnerDiv" && placement) {
                node.style.display = "none";
            }
        }

        function init() {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        hideAd(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "100px",
                threshold: 0.1
            });

            const initialNodes = document.querySelectorAll("div[data-testid='cellInnerDiv']");
            initialNodes.forEach(node => observer.observe(node));

            const pageObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.getAttribute("data-testid") === "cellInnerDiv") {
                            observer.observe(node);
                        }
                    });
                });
            });

            const mainContent = document.querySelector('main') || document.body;
            pageObserver.observe(mainContent, {
                childList: true,
                subtree: true,
                attributes: false
            });

            const sidebarAd = document.querySelector(
                "[data-testid='sidebarColumn'] aside, " +
                "main > div > div > div > div > div > div > div > div > aside"
            );
            if (sidebarAd) sidebarAd.style.display = "none";
        }

        return { init };
    })();

    // --- Bookmark Remover ---
    const bookmarkRemover = (function () {
        function isBookmarkPage() {
            return window.location.pathname === '/i/bookmarks';
        }
    
        function getSafeBottomOffset(tweetBottom) {
            const potentialObstacles = [
                'nav[role="navigation"]',
                'div[role="navigation"]',
                'footer',
                'div[style*="position: fixed"][style*="bottom"]'
            ].map(selector => document.querySelector(selector)).filter(Boolean);
    
            let minOffset = 20;
            const viewportHeight = window.innerHeight;
            for (const obstacle of potentialObstacles) {
                const rect = obstacle.getBoundingClientRect();
                if (rect.bottom > viewportHeight * 0.8) {
                    minOffset = Math.max(minOffset, rect.height + 10);
                }
            }
            return Math.max(minOffset, viewportHeight - tweetBottom + 20);
        }
    
        function updateButtonPosition(button) {
            if (!isBookmarkPage()) {
                button.style.display = 'none';
                return;
            }
    
            const tweets = document.querySelectorAll('article[data-testid="tweet"]');
            if (!tweets.length) {
                button.style.display = 'flex';
                button.style.bottom = '20px';
                button.style.left = '50%';
                button.style.transform = 'translateX(-50%)';
                return;
            }
    
            button.style.display = 'flex';
            const lastTweet = tweets[tweets.length - 1];
            const lastTweetRect = lastTweet.getBoundingClientRect();
            const tweetBottom = lastTweetRect.bottom + window.scrollY;
    
            button.style.bottom = `${getSafeBottomOffset(tweetBottom)}px`;
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
        }
    
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    
        async function removeSingleBookmark(item) {
            const bookmarkButton = item.querySelector('[data-testid="bookmark"]');
            const removeButton = item.querySelector('[data-testid="removeBookmark"]');
    
            if (removeButton) {
                removeButton.click();
                return true;
            } else if (bookmarkButton) {
                bookmarkButton.click();
                await delay(200);
                const newRemoveButton = document.querySelector('[data-testid="removeBookmark"]');
                if (newRemoveButton) {
                    newRemoveButton.click();
                    return true;
                }
            }
            return false;
        }
    
        function init() {
            const button = document.createElement('button');
            button.innerHTML = '🗑️';
            button.style.cssText = `
                position: fixed;
                z-index: 9999;
                width: 60px;
                height: 60px;
                background-color: #ffffff;
                color: #000000;
                border: 2px solid #000000;
                border-radius: 50%;
                cursor: pointer;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: transform 0.2s ease, background-color 0.3s ease;
            `;
    
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .idle { animation: pulse 2s infinite ease-in-out; }
                .removing { animation: spin 1s linear infinite; }
                .completed { animation: bounce 0.5s ease; }
            `;
            document.head.appendChild(styleSheet);
    
            let isRemoving = false;
    
            if (isBookmarkPage()) {
                document.body.appendChild(button);
                button.classList.add('idle');
                updateButtonPosition(button);
            }
    
            button.addEventListener('click', async () => {
                if (!isBookmarkPage() || isRemoving) return;
                isRemoving = true;
                button.disabled = true;
                button.classList.remove('idle', 'completed');
                button.classList.add('removing');
                button.innerHTML = '⌛';
    
                const removeAllBookmarks = async () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    await delay(500);
                    let bookmarkItems = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
                    if (!bookmarkItems.length || !isBookmarkPage()) return 0;
    
                    let removedCount = 0;
                    for (const item of bookmarkItems) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await delay(300);
                        
                        if (await removeSingleBookmark(item)) {
                            removedCount++;
                            await delay(300);
                        }
                    }
                    return removedCount;
                };
    
                let removed = await removeAllBookmarks();
                while (isBookmarkPage() && removed > 0) {
                    await delay(500);
                    removed = await removeAllBookmarks();
                }
    
                if (isBookmarkPage()) {
                    button.classList.remove('removing');
                    button.classList.add('completed');
                    button.innerHTML = '✔️';
                    button.disabled = false;
                    isRemoving = false;
                    setTimeout(() => {
                        if (isBookmarkPage()) {
                            button.classList.remove('completed');
                            button.classList.add('idle');
                            button.innerHTML = '🗑️';
                        }
                    }, 3000);
                } else {
                    button.classList.remove('removing', 'completed');
                    button.innerHTML = '🗑️';
                    button.disabled = false;
                    isRemoving = false;
                }
                updateButtonPosition(button);
            });
    
            button.addEventListener('mouseover', () => {
                if (!isRemoving) button.style.backgroundColor = '#f0f0f0';
            });
    
            button.addEventListener('mouseout', () => {
                if (!isRemoving) button.style.backgroundColor = '#ffffff';
            });
    
            const observer = new MutationObserver(() => {
                if (isBookmarkPage() && !document.body.contains(button)) {
                    document.body.appendChild(button);
                    button.classList.add('idle');
                    updateButtonPosition(button);
                } else if (!isBookmarkPage() && document.body.contains(button)) {
                    button.remove();
                } else if (isBookmarkPage()) {
                    updateButtonPosition(button);
                }
            });
            
            observer.observe(document.documentElement, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['data-testid']
            });
    
            window.addEventListener('resize', () => {
                if (isBookmarkPage() && document.body.contains(button)) updateButtonPosition(button);
            });
    
            window.addEventListener('scroll', () => {
                if (isBookmarkPage() && document.body.contains(button)) updateButtonPosition(button);
            });
    
            window.addEventListener('popstate', () => {
                if (!isBookmarkPage() && isRemoving) {
                    isRemoving = false;
                    button.classList.remove('removing', 'completed');
                    button.disabled = false;
                    button.innerHTML = '🗑️';
                }
                if (isBookmarkPage()) updateButtonPosition(button);
            });
        }
    
        return { init };
    })();

    // ---Media Downloader ---
    const mediaDownloader = (function () {
        const filename = 'twitter_{user-name}(@{user-id})_{date-time}_{status-id}_{file-type}';
 
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
        let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
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
        let is_exist = history.indexOf(status_id) >= 0;
        this.status(btn_down, 'tmd-down');
        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
        btn_group.insertBefore(btn_down, btn_share.nextSibling);
        btn_down.onclick = () => this.click(btn_down, status_id, is_exist);
        if (show_sensitive) {
          let btn_show = article.querySelector('div[aria-labelledby] div[role="button"][tabindex="0"]:not([data-testid]) > div[dir] > span > span');
          if (btn_show) btn_show.click();
        }
      }
      let imgs = article.querySelectorAll('a[href*="/photo/"]');
      if (imgs.length > 1) {
        let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let btn_group = article.querySelector('div[role="group"]:last-of-type');
        let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div')).pop().parentNode;
        imgs.forEach(img => {
          let index = img.href.split('/status/').pop().split('/').pop();
          let is_exist = history.indexOf(status_id) >= 0;
          let btn_down = document.createElement('div');
          btn_down.innerHTML = '<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">' + this.svg + '</svg></div></div>';
          btn_down.classList.add('tmd-down', 'tmd-img');
          this.status(btn_down, 'download');
          img.parentNode.appendChild(btn_down);
          btn_down.onclick = e => {
            e.preventDefault();
            this.click(btn_down, status_id, is_exist, index);
          }
        });
      }
    },
    addButtonToMedia: function(listitems) {
      listitems.forEach(li => {
        if (li.dataset.detected) return;
        li.dataset.detected = 'true';
        let status_id = li.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
        let is_exist = history.indexOf(status_id) >= 0;
        let btn_down = document.createElement('div');
        btn_down.innerHTML = '<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">' + this.svg + '</svg></div></div>';
        btn_down.classList.add('tmd-down', 'tmd-media');
        this.status(btn_down, is_exist ? 'completed' : 'download', is_exist ? lang.completed : lang.download);
        li.appendChild(btn_down);
        btn_down.onclick = () => this.click(btn_down, status_id, is_exist);
      });
    },
    click: async function (btn, status_id, is_exist, index) {
      if (btn.classList.contains('loading')) return;
      this.status(btn, 'loading');
      let out = (await GM_getValue('filename', filename)).split('\n').join('');
      let save_history = await GM_getValue('save_history', true);
      let json = await this.fetchJson(status_id);
      let tweet = json.legacy;
      let user = json.core.user_results.result.legacy;
      let invalid_chars = {'\\': '＼', '\/': '／', '\|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': ''};
      let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid_chars[v]) : 'YYYYMMDD-hhmmss';
      let info = {};
      info['status-id'] = status_id;
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
          this.downloader.add({
            url: info.url,
            name: info.out,
            onload: () => {
              tasks -= 1;
              tasks_result.push(((medias.length > 1 || index) ? (index ? index : i + 1) + ': ' : '') + lang.completed);
              this.status(btn, null, tasks_result.sort().join('\n'));
              if (tasks === 0) {
                this.status(btn, 'completed', lang.completed);
                if (save_history && !is_exist) {
                  history.push(status_id);
                  this.storage(status_id);
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
<span class="tmd-tag" title="example: 1234567890987654321">{status-id}</span>
<span class="tmd-tag" title="{date-time} : Posted time in UTC.\n{date-time-local} : Your local time zone.\n\nDefault:\nYYYYMMDD-hhmmss => 20201231-235959\n\nExample of custom:\n{date-time:DD-MMM-YY hh.mm} => 31-DEC-21 23.59">{date-time}</span><br>
<span class="tmd-tag" title="Text content in tweet.">{full-text}</span>
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
    fetchJson: async function (status_id) {
      let base_url = `https://${host}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId`;
      let variables = {
       // "focalTweetId":status_id,
        "tweetId":status_id,
        "with_rux_injections":false,
        "includePromotedContent":true,
        "withCommunity":true,
        "withQuickPromoteEligibilityTweetFields":true,
        "withBirdwatchNotes":true,
        "withVoice":true,
        "withV2Timeline":true
      };
      let features = {
"articles_preview_enabled":true,
"c9s_tweet_anatomy_moderator_badge_enabled":true,
"communities_web_enable_tweet_community_results_fetch":false,
"creator_subscriptions_quote_tweet_preview_enabled":false,
"creator_subscriptions_tweet_preview_api_enabled":false,
"freedom_of_speech_not_reach_fetch_enabled":true,
"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,
"longform_notetweets_consumption_enabled":false,
"longform_notetweets_inline_media_enabled":true,
"longform_notetweets_rich_text_read_enabled":false,
"premium_content_api_read_enabled":false,
"profile_label_improvements_pcf_label_in_post_enabled":true,
"responsive_web_edit_tweet_api_enabled":false,
"responsive_web_enhance_cards_enabled":false,
"responsive_web_graphql_exclude_directive_enabled":false,
"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,
"responsive_web_graphql_timeline_navigation_enabled":false,
"responsive_web_grok_analysis_button_from_backend":false,
"responsive_web_grok_analyze_button_fetch_trends_enabled":false,
"responsive_web_grok_analyze_post_followups_enabled":false,
"responsive_web_grok_image_annotation_enabled":false,
"responsive_web_grok_share_attachment_enabled":false,
"responsive_web_grok_show_grok_translated_post":false,
"responsive_web_jetfuel_frame":false,
"responsive_web_media_download_video_enabled":false,
"responsive_web_twitter_article_tweet_consumption_enabled":true,
"rweb_tipjar_consumption_enabled":true,
"rweb_video_screen_enabled":false,
"standardized_nudges_misinfo":true,
"tweet_awards_web_tipping_enabled":false,
"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,
"tweetypie_unmention_optimization_enabled":false,
"verified_phone_label_enabled":false,
"view_counts_everywhere_api_enabled":true,
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
      //let tweet_entrie = tweet_detail.data.threaded_conversation_with_injections_v2.instructions[0].entries.find(n => n.entryId == `tweet-${status_id}`);
//let tweet_result = tweet_entrie.content.itemContent.tweet_results.result;
let tweet_result = tweet_detail.data.tweetResult.result;
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
    downloader: (function () {
      let tasks = [], thread = 0, max_thread = 2, retry = 0, max_retry = 2, failed = 0, notifier, has_failed = false;
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
        start: function (task) {
          this.update();
          return new Promise(resolve => {
            GM_download({
              url: task.url,
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
        update: function() {
          if (!notifier) {
            notifier = document.createElement('div');
            notifier.title = 'Twitter Media Downloader';
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
        }
      };
    })(),
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
    
        return TMD;
    })();

    adFilter.init();
    bookmarkRemover.init();
    mediaDownloader.init();
})();