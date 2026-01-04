// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 검색결과 키워드 선호 주제 분석
// @description  네이버 검색결과에서 키워드에 대한 생산/소비 선호 주제를 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.10
// @author       Won Choi
// @connect      naver.com
// @match        *://search.naver.com/search.naver?*
// @match        *://m.search.naver.com/search.naver?*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-search-rx.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @downloadURL https://update.greasyfork.org/scripts/428685/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%84%A0%ED%98%B8%20%EC%A3%BC%EC%A0%9C%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428685/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%84%A0%ED%98%B8%20%EC%A3%BC%EC%A0%9C%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_donation('#container', 0);
  GM_addStyle(`
  [data-nx-status-keywords]::after {
    position: absolute; left: auto; right: 0; top: 100%;; margin: auto; clear: both; z-index: 100000;
    font-size: 12px; line-height: 1.3em; padding: 0.5em;
    background-color: rgba(255, 255, 0, 0.9); border: 1px solid rgba(0, 0, 0, 0.6);
    pointer-events: none; content: attr(data-nx-status-keywords);
    word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;
  }
  .greenbox { position: relative; }
  .greenbox::after { left: auto; right: 0px; }
  .search_wrap { overflow: visible !important; }
  `);
  const wrp = document.querySelector('.greenbox, .search_input_inner'); if(!wrp) return;
  const uri = new URL(location.href), query = uri.searchParams.get('query'); if(!query) return;
  const terms = await NR_terms(query);
  const info = [];
  if(terms.r_category) info.push(`생산선호주제: ${terms.r_category}`)
  if(terms.theme && terms.theme.main) info.push(`메인소비주제: ${terms.theme.main.name}`);
  if(terms.theme && terms.theme.sub)  info.push(`서브소비주제: ${terms.theme.sub.map(o=>o.name).join(', ')}`);
  wrp.dataset.nxStatusKeywords = info.join('\n');
})