// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 모먼트 다운로더
// @description  네이버 블로그 모먼트 영상을 다운로드 합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.8
// @author       Won Choi
// @connect      naver.com
// @match        *://m.blog.naver.com/*/moment/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-cors.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-hook.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js
// @downloadURL https://update.greasyfork.org/scripts/428666/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AA%A8%EB%A8%BC%ED%8A%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/428666/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AA%A8%EB%A8%BC%ED%8A%B8%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
(function() {
  const cache = {};
  GM_donation('#root', 0);
  GM_addStyle(`
[class^="Footer_wrap__"] { bottom: calc(env(safe-area-inset-bottom) + 112px); }
[class^="MoreInfoLayer_fold__"] { bottom: calc(env(safe-area-inset-bottom) + 108px); }
[class^="SeekingBar_wrap__"] { bottom: calc(env(safe-area-inset-bottom) + 50px); }

.moment-download { position: fixed; z-index: 100000000; left: 0; right: 0; top: auto; bottom: 0; margin: auto; width: 100%; padding: 15px; background: #000; color: #fff; }
  `)
  GM_xmlhttpRequestHook((data, origin) => {
      const { type, target, detail } = data; if(!type || !target || !detail) { return origin; }
      const is_xhrload = type == 'xhrload';
      const is_moment_detail = target.startsWith('https://api-moment.blog.naver.com/blogs/') && target.includes('/momentPlayInfo/');
      if(is_xhrload && is_moment_detail) { cache.data = detail.responseJson; }
      return origin;
  });
  const button = document.querySelector('.moment-download') || document.createElement('button');
  button.classList.add('moment-download');
  button.textContent = '다운로드';
  button.onclick = async (e) => {
      if(!cache.data) return alert('통신 오류가 발생하였습니다. 새로고침 후 다시 시도해주세요.');
      const items = _.get(cache.data, 'result.playInfo', []);
      await Promise.map(items, async (item, offset) => {
          const videos = _.get(item, 'videos.list', []);
          const video = _.maxBy(videos, 'size');
          if(!video) return alert('통신 오류가 발생하였습니다. 새로고침 후 다시 시도해주세요.');
          const { encodingOption, source } = video;
          const prefix_a = _.get(item, 'meta.user.id', 'unknown');
          const prefix_b = _.get(item, 'tId', 'unknown');
          const filename = `moment-${prefix_a}-${prefix_b}-${encodingOption.name}-${offset}.mp4`;
          download(source, filename, 'video/mp4');
      });
  }
  document.querySelector('#root').appendChild(button);
})();