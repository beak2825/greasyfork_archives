// ==UserScript==
// @name        SmartNicorepo
// @namespace   https://github.com/segabito/
// @description ニコレポの「投稿」以外をデフォルトで折りたたむ
// @include     *://www.nicovideo.jp/my*
// @include     *://www.nicovideo.jp/my/*
// @include     *://www.nicovideo.jp/user/*
// @include     *://www.nicovideo.jp/my/fav/user
// @include     *://www.nicovideo.jp/mylist/*
// @version     3.1.11
// @grant       none
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js
// @downloadURL https://update.greasyfork.org/scripts/434/SmartNicorepo.user.js
// @updateURL https://update.greasyfork.org/scripts/434/SmartNicorepo.meta.js
// ==/UserScript==

(function(window) {
  const document = window.document;
  const monkey =
  (function() {
    var $ = window.jQuery;

    function addStyle(styles, id) {
      let elm = document.createElement('style');
      elm.type = 'text/css';
      if (id) { elm.id = id; }

      let text = styles.toString();
      text = document.createTextNode(text);
      elm.appendChild(text);
      document.head.append(elm);
      return elm;
    }

    const COMMON_CSS = `
      [data-follow-container] {
        display: none;
      }
    `;
    addStyle(COMMON_CSS);

    const __nicorepocss__ = (`
      .nicorepo .log.log-upload {
        background: #ffe;
      }

      #nicorepo  .timeline > .log .log-target-thumbnail {
        width: auto; height: auto; margin-left: -30px;
      }

      #nicorepo .log .log-target-thumbnail img,
      #nicorepo .log.log-live   .live_program,
      #nicorepo .log.log-kiriban .video,
      #nicorepo .log.log-ranking .video,
      #nicorepo .log.log-uad     .video,
      #nicorepo .log.log-mylist  .video,
      #nicorepo .log.log-mylist .seiga_illust,
      #nicorepo .log.log-mylist .manga_episode,
      #nicorepo .log.log-upload .video,
      #nicorepo .log.log-upload .seiga_illust,
      #nicorepo .log.log-upload .seiga_image,
      #nicorepo .log.log-upload .manga_episode,
      #nicorepo .log.log-upload .chblog
      {
        height: auto !important;
        width: 130px !important;
        margin-top: 0px;
        margin-bottom: 0 !important;
        margin-left: 0 !important;
      }
      #nicorepo .timeline > .log {
        max-height: 500px;
        transition: max-height 0.2s ease-in-out 0.4s;
        overflow: auto;
      }

      #nicorepo .timeline > .log {
        max-height: 22px;
        overflow: hidden;
      }

      #nicorepo.show-upload  .timeline > .log.log-upload,
      #nicorepo.show-mylist  .timeline > .log.log-mylist,
      #nicorepo.show-live    .timeline > .log.log-live,
      #nicorepo.show-uad     .timeline > .log.log-uad,
      #nicorepo.show-kiriban .timeline > .log.log-kiriban,
      #nicorepo.show-ranking .timeline > .log.log-ranking,
      #nicorepo.show-other   .timeline > .log.log-other,
      #nicorepo .timeline > .log:hover {
        max-height: 500px !important;
        overflow: hidden;
        transition: max-height 0.4s ease-in-out 0.4s;
      }

      #nicorepo.hiderepo:not(.show-upload)  .timeline > .log.log-upload,
      #nicorepo.hiderepo:not(.show-mylist)  .timeline > .log.log-mylist,
      #nicorepo.hiderepo:not(.show-live)    .timeline > .log.log-live,
      #nicorepo.hiderepo:not(.show-uad)     .timeline > .log.log-uad,
      #nicorepo.hiderepo:not(.show-kiriban) .timeline > .log.log-kiriban,
      #nicorepo.hiderepo:not(.show-ranking) .timeline > .log.log-ranking,
      #nicorepo.hiderepo:not(.show-other)   .timeline > .log.log-other {
        display: none !important;
      }


      .smartNicorepoToolbar {
        display: inline-block;
        position: fixed;
        padding: 0 4px;
        border-radius: 4px 4px 0 0;
        bottom: 0;
        z-index: 1000;
        background: rgba(128, 128, 128, 0.9);
        box-shadow: 0 0 4px #000;
        user-select: none;
        /*transform: translate(28px, 0);*/
        width: 722px;
        text-align: center;
      }
      .smartNicorepoToolbar .categoryCheckLabel {
        display: inline-block;
        min-width: 64px;
        margin: 4px;
        padding: 2px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #888;
        text-align: center;
      }
      .smartNicorepoToolbar .categoryCheckLabel.active {
        background: #ccf;
      }

      .smartNicorepoToolbar .toggle-hiderepo {
        border: none;
        background: #ccc;
        color: black;
      }
      .smartNicorepoToolbar .toggle-hiderepo.active {
        background: #ccc;
      }
      .smartNicorepoToolbar .toggle-hiderepo:before {
        content: '${'\\002610'}';
        display: inline-block;
        margin-right: 4px;
        margin-left: 4px;
        transform: scale(1.8);
      }
      .smartNicorepoToolbar .toggle-hiderepo.active:before {
        content: '${'\\002611'}';
      }

      .toggleUpload {
        position: absolute;
        top: 0px;
        right: 16px;
        font-weight: bolder;
        cursor: pointer;
        color: #888;
        padding: 6px 8px;
        z-index: 1000;
      }
      .toggleUpload.bottom {
        top: auto; right: 32px; bottom: 32px;
      }
      .show-upload .toggleUpload {
        color: red;
      }
      .toggleUpload:after {
        content: ': OFF';
      }
      .show-upload .toggleUpload:after {
        content: ': ON';
      }

      .togglePagerize {
        position: fixed;
        bottom: 0;
        right: 0;
        color: #888;
        font-weight: bolder;
        cursor: pointer;
        border: 2px solid #666;
      }
      .togglePagerize.enable {
        color: red;
      }
      .togglePagerize:after {
        content: ': OFF';
      }
      .togglePagerize.enable:after {
        content: ': ON';
      }
     `).trim();


    const __favusercss__ = (`

      #favUser .outer.updating {
      }
      #favUser .outer.updating * {
        cursor: wait;
      }
      #favUser .outer.done .showNicorepo {
        display: none;
      }

      #favUser .nicorepo {
        color: #800;
        clear: both;
        margin-bottom: 24px;
      }
      #favUser .uploadVideoList, #favUser .seigaUserPage {
        font-size: 80%;
        margin-left: 16px;
      }

      #favUser .nicorepo.fail {
        color: #800;
        clear: both;
        margin-left: 64px;
      }


      #favUser .nicorepo.success {
        padding: 8px;
        overflow: auto;
        border: 1px inset;
        max-height: 300px;
      }

      .nicorepo .log-target-thumbnail,
      .nicorepo .log-target-info {
        display: inline-block;
        vertical-align: middle;
      }
      .nicorepo .log-target-thumbnail .imageContainer {
        width: 64px;
        height: 48px;
        background-color: #fff;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transition: 0.2s width ease 0.4s, 0.2s height ease 0.4s;
      }
      .nicorepo .log-target-thumbnail .imageContainer:hover {
        width: 128px;
        height: 96px;
      }
      .nicorepo .log-target-info .time {
        display: block;
        font-size: 80%;
        color: black;
      }
      .nicorepo .log-target-info .logComment {
        display: block;
        font-size: 80%;
        color: black;
      }
      .nicorepo .log-target-info .logComment:before {
        content: '「';
      }
      .nicorepo .log-target-info .logComment:after {
        content: '」';
      }
      .nicorepo .log-target-info a {
        display: inline-block;
        min-width: 100px;
      }
      .nicorepo .log-target-info a:hover {
        background: #ccf;
      }


      .nicorepo .log.log-user-video-round-number-of-view-counter {
        display: none;
      }

      .nicorepo .log-content {
        margin: 4px 8px;
        position: relative;
      }
      .nicorepo .log-footer {
        position: absolute;
        top: 0;
        left: 138px;
      }
      .nicorepo .log-footer a {
        font-size: 80%;
        color: black;
      }

      .nicorepo .log .time:after {
        background: #888;
        color: #fff;
        border-radius: 4px;
        display: inline-block;
        padding: 2px 4px;
      }
      .nicorepo .log.log-user-register-chblog    .time:after,
      .nicorepo .log.log-upload       .time:after,
      .nicorepo .log.log-user-seiga-image-upload .time:after {
        content: '投稿';
        background: #866;
      }

      .nicorepo .log.log-user-mylist-add-blomaga .time:after,
      .nicorepo .log.log-user-mylist-add         .time:after  {
        content: 'マイリスト';
      }
      .nicorepo .log.log-user-live-broadcast     .time:after  {
        content: '放送';
      }
      .nicorepo .log.log-user-seiga-image-clip   .time:after  {
        content: 'クリップ';
      }
      .nicorepo .log.log-user-video-review       .time:after  {
        content: 'レビュー';
      }
      .nicorepo .log.log-user-uad-advertise      .time:after  {
        content: '広告';
      }

      .nicorepo .log.log-upload {
        background: #ffe;
      }

      .nicorepo .log.log-upload .log-target-thumbnail,
      .nicorepo .log.log-user-seiga-image-upload .log-target-thumbnail {
      }
      .nicorepo .log.log-upload .video,
      .nicorepo .log.log-user-seiga-image-upload .seiga_image {
      }


      .nicorepo .log-author,
      .nicorepo .log-body,
      .nicorepo .log-res,
      .nicorepo .log-comment,
      .nicorepo .log-footer {
        display: none !important;
      }
    `).trim();

    const __large_thumbnail_css__ = (`

       .largeThumbnailLink {
         display: inline-block;
       }

       .largeThumbnailLink::after {
         content: "";
         position: fixed;
         bottom: -280px;
         width: 360px;
         height: 270px;
         left: 24px;
         opacity: 0;
         background-color: #000;
         background-size: contain;
         background-repeat: no-repeat;
         background-position: center center;
         background-image: var(--thumbnail-image);
         transition:
           bottom     0.5s ease 0.5s,
           z-index    0.5s ease,
           box-shadow 0.5s ease 0.5s,
           opacity    0.5s ease 0.5s;
         z-index: 100000;
         pointer-events: none;
       }

       #PAGEBODY .largeThumbnailLink::after {
         left: auto;
         right: 24px;
       }

       .largeThumbnailLink:hover::after {
         position: fixed;
         bottom: 32px;
         opacity: 1;
         box-shadow: 4px 4px 4px #333;
         transition:
           bottom     0.2s ease,
           z-index    0.2s ease,
           box-shadow 0.2s ease,
           opacity    0.2s ease;
         z-index: 100100;
       }

       #mylist .articleBody .myContList li.SYS_box_item .thumbContainer img,
       #SYS_page_items .thumbContainer img.video,
       #video .articleBody .outer .thumbContainer img.video {
         max-width: unset;
         max-height: unset;
         object-fit: cover;
         width: 160px;
         height: 90px;
       }
    `).trim();

    const __tagrepocss__ = (`
      .newVideoChannel .post-item,
      .newVideoUser .post-item {
        {* background: #ffe;*}
      }

      .newLiveChannel .post-item,
      .newLiveUser .post-item {
        background: #eee;
      }

      .newVideoUser     .contents-thumbnail img.largeThumbnail,
      .newVideoOfficial .contents-thumbnail img.largeThumbnail,
      .newVideoChannel  .contents-thumbnail img.largeThumbnail {
        margin-top: -21px;
      }

    `).trim();

    const failedUrl = {};
    const initializeLargeThumbnail = function(type, container, selector) {
      console.log('%cinitializeLargeThumbnail: type=%s', 'background: lightgreen;', type);
      addStyle(__large_thumbnail_css__);

      // 大サムネが存在する最初の動画ID。 ソースはちゆ12歳
      // ※この数字以降でもごく稀に例外はある。
      const threthold = 16371888;
      const hasLargeThumbnail = videoId => {
        let cid = videoId.substr(0, 2);
        let fid = videoId.substr(2) * 1;
        if (cid !== 'sm' && fid < 35000000) { return false; }

        if (fid < threthold) { return false; }

        return true;
      };

      const onLoadImageError = e =>  {
        let target = e.target;
        let src =  target.src.replace('.L', '');
        target.classList.add('large-thumbnail-fail');

        failedUrl[src] = true;
        if (target.src !== src) {
          target.src = src;
        }
      };

      const each = v => {
        let href = (v.href || '').toString();
        if (!href ||
            v.hostname !== 'www.nicovideo.jp' ||
            href.indexOf('/watch/') < 0) {
          return;
        }

        let videoId;
        if (/^.+(s[mo]\d+).*$/.test(href)) {
          videoId = href.replace(/^.+(s[mo]\d+).*$/, '$1');
        } else {
          let img = v.querySelector('img');
          if (!img || !img.src) { return; }
          if (!/smile\?i=(\d+)/.test(img.src)) { return; }
          videoId = 'sm' + RegExp.$1;
        }

        if (!hasLargeThumbnail(videoId)) {
          return;
        }

        let thumbnail = v.querySelector('img');
        // console.log('thumbnail', v.querySelector('img'));
        if (!thumbnail || thumbnail.classList.contains('large-thumbnail-fail')) { return; }
        let src = thumbnail.getAttribute('src') || '';
        let org = thumbnail.dataset.original || '';
        let attrName = org ? 'data-original' : 'src';
        src = org ? org : src;
        let url = src.replace(/\.[LM]$/, '') + '.L';

        if (failedUrl[src] || failedUrl[url]) { return; }

        if (!src || !(src.match(/\/smile\?i=/) || src.match(/\/thumbnails\/[\d]+\/[\d]+\.[\d]+/))) {
          return;
        }
        // console.log('each', videoId, src, v, !src || src.match(/\.M/) || !src.match('/smile?i='));

        thumbnail.addEventListener('error', onLoadImageError, {once: true, passive: true});
        thumbnail.addEventListener('load', () => {
          if (!thumbnail.src.match(/\.L$/)) { return; }
          v.classList.add('largeThumbnailLink');
          v.style.setProperty('--thumbnail-image', `url(${url})`);
          thumbnail.classList.add('largeThumbnail', videoId);
          thumbnail.removeEventListener('error', onLoadImageError);
        }, {once: true});
        v.dataset.loadingThumbnail = JSON.stringify({id: videoId, url});
        thumbnail.setAttribute(attrName, url);
        return {id: videoId, url};
      };

      const update = _.debounce(() => {
        Array.from(document.querySelectorAll(selector)).map(each);
      }, 500);

      update();

      const mutationObserver = new window.MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.addedNodes.length)) {
          update(mutations.target);
        }
      });
      mutationObserver.observe(
        document.querySelector(container),
        {childList: true, characterData: false, attributes: false, subtree: true}
      );
    };

    const initializeSeigaThumbnail = function(type, container, selector) {
      console.log('%cinitializeSeigaThumbnail: type=%s', 'background: lightgreen;', type, container, selector);

      const onLoadImageError = e => {
        console.warn('%c large thumbnail load error!', '', e);

        let target = e.target;
        target.classList.add('large-thumbnail-fail');
        target.src = target.src.replace(/i$/, 'z');
      };

      const each = v => {
        let href = v.href || '';
        if (!href || href.indexOf('/seiga/im') < 0) {
          return;
        }

        let seigaId = href.replace(/^.+(im\d+).*$/, '$1');

        let thumbnail = v.querySelector('img');
        if (!thumbnail || thumbnail.classList.contains('large-thumbnail-fail')) { return; }
        let src = thumbnail.getAttribute('src') || '';
        let org = thumbnail.dataset.original || '';
        let attrName = org ? 'data-original' : 'src';
        src = org ? org : src;
        let url = src.replace(/z$/, 'i');

        if (!src || !src.match(/thumb\/\d+z$/)) { return; }

        thumbnail.addEventListener('error', onLoadImageError, {once: true, passive: true});
        thumbnail.addEventListener('load', () => {
          if (!thumbnail.src.match(/i$/)) { return; }
          v.classList.add('largeThumbnailLink');
          v.style.setProperty('--thumbnail-image', `url(${url})`);
          thumbnail.classList.add('largeThumbnail', seigaId);
          thumbnail.removeEventListener('error', onLoadImageError);
        }, {once: true});
        thumbnail.setAttribute(attrName, url);

        return {id: seigaId, url};
      };

      let update = _.debounce(() => {
        Array.from(document.querySelectorAll(selector)).map(each)
      }, 500);

      update();

      const mutationObserver = new window.MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.addedNodes.length)) {
          update();
        }
      });
      mutationObserver.observe(
        document.querySelector(container),
        {childList: true, characterData: false, attributes: false, subtree: true}
      );
    };

    const updateTimelineItemClass = () => {
      // 「投稿」のクラスをつける
      let query = '.NicorepoTimelineItem:not(.is-named) .log-body strong';
      Array.from(document.querySelectorAll(query)).forEach(elm => {
        const log = elm.closest('.NicorepoTimelineItem');
        if (!log) { return; }
          log.classList.add('log-upload');
          log.classList.add('is-named');
      });

      // TODO: 多言語対応
      const uploadReg = /(^チャンネル.*に(動画|記事)が追加されました。$|コミュニティ.*?に動画を追加しました。$|投稿しました。$)/;
      const mylistReg = /(に(動画|ブロマガ)を登録しました。$|イラストをクリップしました。$|^.*?さんが .*? にマンガ .*? を登録しました。$|マンガをお気に入りしました。$)/;

      const liveReg = /(生放送を(開始|予約)しました。$|生放送が開始されました。$|生放送が予約されました。$)/;

      const uadReg = /ニコニ広告(で宣伝)?しました。 >広告履歴を確認$/;

      const kiribanReg = /(再生を達成しました。$)/;

      const rankingReg = /(位を達成しました。$)/;


      // それ以外のカテゴリ。 文言から判別するしかない
      query = '.NicorepoTimelineItem:not(.is-named) .log-body';
      Array.from(document.querySelectorAll(query)).forEach(elm => {
        const text = (elm.textContent || '').trim();
        const item = elm.closest('.NicorepoTimelineItem');

        if (uploadReg.test(text)) {
          item.classList.add('log-upload');
        } else if (mylistReg.test(text)) {
          item.classList.add('log-mylist');
        } else if (liveReg.test(text)) {
          item.classList.add('log-live');
        } else if (uadReg.test(text)) {
          item.classList.add('log-uad');
        } else if (kiribanReg.test(text)) {
          item.classList.add('log-kiriban');
        } else if (rankingReg.test(text)) {
          item.classList.add('log-ranking');
        } else {
          item.classList.add('log-other');
        }
        item.classList.add('is-named');
      });

      Array.from(document.querySelectorAll('.nicorepo a[href*="_topic="]')).forEach((a) => {
        a.href = a.href.replace(/\?.*?$/, '');
      });
    };

    const initializeToolbar = (config, parentNodeSelector) => {
      const nicorepo = document.querySelector('#nicorepo');
      const container = document.createElement('div');
      container.className = 'smartNicorepoToolbar';

      const createToggle = function(elm, confName, className) {
        return function(isChecked) {
          if (typeof isChecked === 'boolean') {
            nicorepo.classList.toggle(className, isChecked);
          } else {
            nicorepo.classList.toggle(className);
          }

          const v = nicorepo.classList.contains(className);
          elm.classList.toggle('active', v);
          config.set(confName, v);
        };
      };

      const createItem = function(text, titleText) {
        const label = document.createElement('label');
        label.className = 'categoryCheckLabel';
        if (titleText) { label.title = titleText; }

        const span = document.createElement('span');
        span.textContent = text;
        label.appendChild(span);
        return label;
      };

      const upload = createItem('投稿', '動画・静画・ブログなど');
      const toggleUpload = createToggle(upload, 'showUpload', 'show-upload');
      upload.addEventListener('click', toggleUpload);
      toggleUpload(!!config.get('showUpload'));
      container.appendChild(upload);

      const mylist = createItem('マイリスト', 'マイリスト・クリップなど');
      const toggleMylist = createToggle(mylist, 'showMylist', 'show-mylist');
      mylist.addEventListener('click', toggleMylist);
      toggleMylist(!!config.get('showMylist'));
      container.appendChild(mylist);

      const live = createItem('生放送', '開始・予約など');
      const toggleLive = createToggle(live, 'showLive', 'show-live');
      live.addEventListener('click', toggleLive);
      toggleLive(!!config.get('showLive'));
      container.appendChild(live);

      const uad = createItem('宣伝', 'ニコニ広告');
      const toggleUad = createToggle(uad, 'showUad', 'show-uad');
      uad.addEventListener('click', toggleUad);
      toggleUad(!!config.get('showUad'));
      container.appendChild(uad);

      const kiriban = createItem('再生', '2525再生など');
      const toggleKiriban = createToggle(kiriban, 'showKiriban', 'show-kiriban');
      kiriban.addEventListener('click', toggleKiriban);
      toggleKiriban(!!config.get('showKiriban'));
      container.appendChild(kiriban);

      const ranking = createItem('ランキング', '');
      const toggleRanking = createToggle(ranking, 'showRanking', 'show-ranking');
      ranking.addEventListener('click', toggleRanking);
      toggleRanking(!!config.get('showRanking'));
      container.appendChild(ranking);

      const other = createItem('その他', '');
      const toggleOther = createToggle(other, 'showOther', 'show-other');
      other.addEventListener('click', toggleOther);
      toggleOther(!!config.get('showOther'));
      container.appendChild(other);

      const hiderepo = createItem('閉じてるのを消す', '');
      hiderepo.classList.add('toggle-hiderepo');
      const toggleHiderepo = createToggle(hiderepo, 'hiderepo', 'hiderepo');
      hiderepo.addEventListener('click', toggleHiderepo);
      toggleHiderepo(!!config.get('hiderepo'));
      container.appendChild(hiderepo);


      setTimeout(() => {
        const parentNode = document.querySelector(parentNodeSelector);
        if (!parentNode) { return; }
        parentNode.appendChild(container);
      }, 3000);
    };


    window.SmartNicorepo = {
      model: {},
      util: {},
      initialize: function() {
        this.initializeUserConfig();
        if (location.pathname === '/my/fav/user') {
          this.initializeFavUser();
        } else
        if (location.pathname.indexOf('/my/tagrepo/') === 0) {
          this.initializeTagrepo();
        } else {
          this.initializeNicorepo();
          this.initializeAutoPageRize();
        }

        this.initializeOther();
       // jQuery._data(jQuery(window).get(0), 'events')
      },
      initializeUserConfig: function() {
        var prefix = 'SmartNicorepo_';
        var conf = {
          showUpload:  true,
          showMylist:  false,
          showLive:    false,
          showUad:     false,
          showKiriban: false,
          showRanking: false,
          showOther:   false,
          autoPagerize: true,
          hiderepo:    false
        };

        this.config = {
          get: function(key) {
            try {
              if (window.localStorage.hasOwnProperty(prefix + key) || localStorage[prefix + key] !== undefined) {
                return JSON.parse(window.localStorage.getItem(prefix + key));
              }
              return conf[key];
            } catch (e) {
              return conf[key];
            }
          },
          set: function(key, value) {
            //console.log('%cupdate config {"%s": "%s"}', 'background: cyan', key, value);
            window.localStorage.setItem(prefix + key, JSON.stringify(value));
          }
        };
      },
      initializeNicorepo: function() {
        addStyle(__nicorepocss__, 'nicorepoCss');

        let config = this.config;

        let app = document.querySelector('#MyPageNicorepoApp, #UserPageNicorepoApp');
        if (!app) { return; }

        const mutationObserver = new window.MutationObserver((mutations) => {
          let isAdded = false;
          mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
              isAdded = true;
            }
          });
          if (isAdded) { updateTimelineItemClass(); }
        });

        updateTimelineItemClass();

        mutationObserver.observe(
          app,
          {childList: true, characterData: false, attributes: false, subtree: true}
        );

        initializeToolbar(config, '#MyPageNicorepoApp, #UserPageNicorepoApp');
      },
      initializeTagrepo: function() {
        console.log('%cinitializeTagrepo', 'background: lightgreen;');
        addStyle(__tagrepocss__, 'tagrepoCss');
      },
      initializeFavUser: function() {
        addStyle(__favusercss__, 'favUserCss');

          $('.posRight .arrow').each(function(i, elm) {
            var $elm = $(elm), $lnk = $elm.clone();
            $lnk
              .html('<span></span> ニコレポを表示&nbsp;')
              .addClass('showNicorepo');
            $elm.before($lnk);
          });

          $('.outer .section a').each(function(i, elm) {
            var $elm = $(elm), href = $elm.attr('href');
            if (href.match(/\/(\d+)$/)) {
              var userId = RegExp.$1;
              var $video = $('<a class="uploadVideoList">動画一覧</a>')
                .attr('href', '/user/' + userId + '/video');
              var $seiga = $('<a class="seigaUserPage">静画一覧</a>')
                .attr('href', '//seiga.nicovideo.jp/user/illust/' + userId);
              $elm.after($seiga).after($video);
            }
          });

          var getClearBusy = function($elm) {
            return function() {
              $elm.removeClass('updating').addClass('done');
            };
          };

          $('#favUser .showNicorepo').off().on('click', $.proxy(function(e) {
            if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            var $elm = $(e.target);
            var userId = $elm.attr('data-nico-nicorepolistid');
            if (!userId) { return; }
            var $outer = $elm.closest('.outer');
            if ($outer.hasClass('updating')) {
              return;
            }

            var clearBusy = getClearBusy($outer);
            $outer.addClass('updating');
            window.setTimeout(clearBusy, 3000);

            this.loadNicorepo(userId, $outer).then(clearBusy, clearBusy);

          }, this));
      },
      initializeAutoPageRize: function() {
        let config = this.config;
        let $button = $('<button class="togglePagerize">自動読込</button>');
        let timer = null;

        var onButtonClick = () => {
          toggle();
          updateView();
        };
        var toggle = () => {
          this._isAutoPagerizeEnable = !this._isAutoPagerizeEnable;
          config.set('autoPagerize', this._isAutoPagerizeEnable);
          if (this._isAutoPagerizeEnable) {
            bind();
          } else {
            unbind();
          }
        };
        let updateView = () => {
          $button.toggleClass('enable', this._isAutoPagerizeEnable);
        };
        let onWindowScroll = _.debounce(this._onWindowScroll.bind(this), 100);
        let bind = () => {
          window.addEventListener('scroll', onWindowScroll, {passive: true});
          timer = window.setInterval(this._autoPagerize.bind(this), 5000);
        };
        let unbind = () => {
          window.removeEventListener('scroll', onWindowScroll);
          window.clearInterval(timer);
        };


        $button.click(onButtonClick);
        $('body').append($button);

        this._isAutoPagerizeEnable = config.get('autoPagerize');
        if (this._isAutoPagerizeEnable) { bind(); }

        updateView();
      },
      initializeOther: function() {
        window.resizeSidebarHeight = () => {};
        if (window.Nico && window.Nico.FollowManager) {
          window.Nico.FollowManager.resizeAdjust =
            window.Nico.FollowManager.scrollAdjust = () => {};
        }
      },
      _onWindowScroll: function() {
        this._autoPagerize();
      },
      _autoPagerize: function() {
        if (!this._isAutoPagerizeEnable) { return; }
        //let ver = document.querySelector('#MyPageNicorepoApp') ? 'new' : 'old';

        // TODO: IntersectionObserverつかえ
        let nextPage = //this._nextPage ||
           document.querySelector('#MyPageNicorepoApp .next-page, #nicorepo .next-page');
        if (!nextPage) { return; }
        //this._nextPage = nextPage;

        let rect = nextPage.getBoundingClientRect();
        let isLoading = nextPage.classList.contains('loading');
        let isScrollIn = window.innerHeight - rect.top > 0;
        //console.info('?', isLoading, isScrollIn, window.innerHeight - rect.top);
        if (isScrollIn && !isLoading) {
          (document.querySelector('#nicorepo .next-page-link') || {click: _.noop}).click();
        }
      },
      loadNicorepo: function(userId, $container) {
         // http://www.nicovideo.jp/user/[userId]/top?innerPage=1
         var url = '//www.nicovideo.jp/user/' + userId + '/top?innerPage=1';

         var fail = function(msg) {
           var $fail = $('<div class="nicorepo fail">' + msg + '</div>');
           $container.append($fail);
           autoScrollIfNeed($fail);
         };

         // ニコレポが画面の一番下よりはみ出していたら見える位置までスクロール
         var autoScrollIfNeed = function($target) {
            var
              scrollTop = $('html').scrollTop(),
              targetOffset = $target.offset(),
              clientHeight = $(window).innerHeight(),
              clientBottom = scrollTop + clientHeight,
              targetBottom = targetOffset.top + $target.outerHeight();

            if (targetBottom > clientBottom) {
              $('html').animate({
                scrollTop: scrollTop + $target.outerHeight()
              }, 500);
            }
         };

         var success = function($dom, $logBody) {
            var $result = $('<div class="nicorepo success" />');
            var $img = $logBody.find('img'), $log = $logBody.find('.log');
            $img.each(function() {
              var $this = $(this), $parent = $this.parent();
              var lazyImg = $this.attr('data-original');
              if (lazyImg) {
                var $imageContainer = $('<div class="imageContainer"/>');
                $imageContainer.css('background-image', 'url(' + lazyImg + ')');
                $this.before($imageContainer);
                $this.remove();
              }
              if (window.WatchItLater) {
                var href = $parent.attr('href');
                if (href) {
                  $parent.attr('href', href.replace('//www.nicovideo.jp/watch/', '//nico.ms/'));
                }
              }
            });
            $logBody.each(function() {
              var $this = $(this), time = $this.find('time:first').text(), logComment = $this.find('.log-comment').text();

              $this.find('.log-target-info>*:first')
                .before($('<span class="time">' + time + '</span>'));
              if (logComment) {
                $this.find('.log-target-info')
                  .append($('<span class="logComment">' + logComment + '</span>'));
              }
            });

            $result.append($logBody);
            $container.append($result);
            $result.scrollTop(0);

            autoScrollIfNeed($result);
        };

        return $.ajax({
          url: url,
          timeout: 30000
        }).then(
          function(resp) {
            var
              $dom = $(resp),
              // 欲しいのはそのユーザーの「行動」なので、
              // xx再生やスタンプみたいなのはいらない
              $logBody = $dom.find('.log:not(.log-user-video-round-number-of-view-counter):not(.log-user-action-stamp):not(.log-user-live-video-introduced)');
            if ($logBody.length < 1) {
              fail('ニコレポが存在しないか、取得に失敗しました');
            } else {
              success($dom, $logBody);
            }
          },
          function() {
            fail('ニコレポの取得に失敗しました');
          });
      },
      loadFavUserList: function() {
        var def = new $.Deferred();
        // このAPIのupdate_timeが期待していた物と違ったのでボツ
        // create_timeとupdate_timeはどちらも同じ値が入ってるだけだった。(なんのためにあるんだ?)
        //
        $.ajax({
          url: '//www.nicovideo.jp/api/watchitem/list',
          timeout: 30000,
          complete: function(resp) {
            var json;
              try {
               json = JSON.parse(resp.responseText);
              } catch (e) {
                console.log('%c parse error: ', 'background: #f88', e);
                return def.reject('json parse error');
              }

            if (json.status !== 'ok') {
              console.log('%c status error: ', 'background: #f88', json.status);
              return def.reject('status error', json.status);
            }
            return def.resolve(json.watchitem);
          },
          error: function(req, status, thrown) {
             if (status === 'parsererror') {
               return;
            }
             console.log('%c ajax error: ' + status, 'background: #f88', thrown);
             return def.reject(status);
          }
        });
         return def.promise();
      }

    };


     window.SmartNicorepo.model.WatchItem = function() { this.initialize.apply(this, arguments); };
     window.SmartNicorepo.model.WatchItem.prototype = {
       initialize: function(seed) {
         this._seed = seed;
         this.itemType = seed.item_type || '1';
         this.itemId   = seed.item_id || '';
         if (typeof seed.item_data === 'object') {
           var data = seed.item_data;
           this.userId       = data.id;
           this.nickname     = data.nickname;
           this.thumbnailUrl = data.thumbnail_url;
         }
         var now = (new Date()).getTime();
         this.createTime = new Date(seed.create_time ? seed.create_time * 1000 : now);
         this.updateTime = new Date(seed.update_time ? seed.update_time * 1000 : now);
       }
     };

     window.SmartNicorepo.model.WatchItemList = function() { this.initialize.apply(this, arguments); };
     window.SmartNicorepo.model.WatchItemList.prototype = {
       initialize: function(watchItems) {
         this._seed = watchItems;
         this._items = {};
         this._itemArray = [];
         for (var i = 0, len = watchItems.length; i < len; i++) {
           var item = new window.SmartNicorepo.model.WatchItem(watchItems[i]);
           this._items[item.userId] = item;
           this._itemArray.push(item);
         }
       },
       getItem: function(userId) {
         return this._items[userId];
       },
       getSortedItems: function() {
         var result = this._itemArray.concat();
         result.sort(function(a, b) {
           return (a.updateTime < b.updateTime) ? 1 : -1;
         });
         return result;
       }
     };

     var removeQuery = function(container) {
        const reg = /(^\?nicorepo|ref=)/;
        $(container + ' a').each((i, a) => {
          const search = a.search || '';
          if (reg.test(search)) {
            a.search = '';
          }
        });
     };


     window.Nico.onReady(function() {
      console.log('%cNico.onReady', 'background: lightgreen;');
      if (location.pathname.indexOf('/my/top') === 0 || document.querySelector('#nicorepo')) {
        initializeLargeThumbnail('nicorepo', '#nicorepo',
          '.log-target-thumbnail a[href*="/watch/"]:not(.largeThumbnailLink)');
        initializeSeigaThumbnail('nicorepo', '#nicorepo',
          '.log-target-thumbnail a:not(.largeThumbnailLink)');
        //initializeSeigaThumbnail('nicorepo', '.nicorepo', '.log-target-thumbnail a[href*=/seiga/im]:not(.largeThumbnailLink)');

       } else
       if (location.pathname.indexOf('/my/mylist') === 0) {
         initializeLargeThumbnail('mylist', '#mylist', '.thumbContainer a:not(.largeThumbnailLink)');
       } else
       if (location.pathname.indexOf('/my/video') === 0) {
         initializeLargeThumbnail('video', '#video', '.thumbContainer a:not(.largeThumbnailLink)');
       } else
       if (location.pathname.indexOf('/mylist') === 0) {
         initializeLargeThumbnail('openMylist', '#PAGEBODY', '.SYS_box_item a:not(.watch):not(.largeThumbnailLink)');
       } else
       if (location.pathname.match(/\/user\/\d+\/video/)) {
         initializeLargeThumbnail('video', '#video', '.thumbContainer a:not(.largeThumbnailLink)');
       } else
       if (location.pathname.match(/\/user\/\d+(\/top|)$/)) {
         initializeLargeThumbnail('nicorepo', '.nicorepo', '.log-target-thumbnail a[href*="/watch/"]:not(.largeThumbnailLink)');
        initializeSeigaThumbnail('nicorepo', '.nicorepo',
          '.log-target-thumbnail a:not(.largeThumbnailLink)');
       } else
       if (location.pathname.match(/\/my\/tagrepo\//)) {
         initializeLargeThumbnail('tagrepo', '#tagrepo', '.newVideoUser .contents-thumbnail a[href*="nicovideo.jp/watch/sm"]:not(.largeThumbnailLink)');
       }
     });

     if (location.pathname.indexOf('/mylist') < 0) {
       window.SmartNicorepo.initialize();
     }

   }); // end of monkey

    let gm = document.createElement('script');
    gm.id = 'smartNicorepoScript';
    gm.setAttribute("type", "text/javascript");
    gm.setAttribute("charset", "UTF-8");
    gm.appendChild(document.createTextNode("(" + monkey + ")(window)"));
    document.body.appendChild(gm);

})(window.unsafeWindow || window);
