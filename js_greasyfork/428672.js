// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 문단 단위 키워드 분석
// @description  네이버 블로그로 작성된 문서를 문단 단위로 키워드를 분석하고 문장의 주요 주제를 간략하게 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.11
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostView*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-search-nx.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-search-rx.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/smart-editor-one.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/428672/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AC%B8%EB%8B%A8%20%EB%8B%A8%EC%9C%84%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428672/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AC%B8%EB%8B%A8%20%EB%8B%A8%EC%9C%84%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
  GM_addStyle(`
  .se-text-paragraph[data-nx-status-loading="true"] { position: relative; }
  .se-text-paragraph[data-nx-status-loading="true"]::after { position: absolute; z-index: 1; display: block; padding: 0.2em; background: rgba(0,0,0,0.3); color: #fff; font-size: 11px; line-height: 1.3em; border-radius: 0.2em; content: '문장 내 키워드 분석 중...'; right: 0; bottom: 0; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap; }
  .se-text-paragraph[data-nx-status-keywords] { position: relative; }
  .se-text-paragraph[data-nx-status-keywords]::after { position: absolute; z-index: 1; display: block; padding: 0.2em; background: rgba(0,0,0,0.3); color: #fff; font-size: 10px; line-height: 1.3em; border-radius: 0.2em; content: '분석 완료'; right: 0; bottom: 0; opacity: 0.5; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap; }
  .se-text-paragraph[data-nx-status-keywords]:hover { outline: 1px solid rgba(255, 0, 0, 0.3);  }
  .se-text-paragraph[data-nx-status-keywords]:hover::after { z-index: 10000; background: #b4a996; color: #fff; font-size: 11px; content: attr(data-nx-status-keywords); overflow-y: auto; max-height: 240px; opacity: 1; }
  `);
  const se = SE_parse(document); if(!se.content) return;
  const sections = SE_parseNodes(document);
  const sentences = se.sections.filter((section)=>['text'].includes(section.type));
  await Promise.map(sentences, async (sentence, index) => {
      const section = sections[sentence.offset]; if(!section) return;
      const lines = Array.from(section.querySelectorAll('.se-text-paragraph'));
      await Promise.map(sentence.text || [], async (text, offset)=>{
          const line = lines[offset]; if(!line) return;
          line.onmouseover = async function() {
              event.preventDefault();
              if(line.dataset.nxStatusKeywords || line.dataset.nxStatusLoading) return;
              line.dataset.nxStatusLoading = true;
              const terms = await NX_termsParagraph(text);
              const uniqs = terms.filter((word, index, terms)=>terms.indexOf(word) == index);
              const title = await NR_termsAll(...uniqs);
              const group = uniqs.reduce((group, query, index)=>(group[index] = Object.assign({ query, count: terms.filter(item=>item==query).length }, title.find(o=>o.query == query)), group), []).sort((a, b)=>b.count - a.count);
              line.dataset.nxStatusKeywords = group.map((item)=>{
                  const info = [`${_.padEnd(`(${item.count})`, 8)}${_.padEnd(item.query, 10)}`];
                  if(item.r_category) info.push(`생산선호주제: ${item.r_category}`)
                  if(item.theme && item.theme.main) info.push(`메인소비주제: ${item.theme.main.name}`);
                  if(item.theme && item.theme.sub)  info.push(`서브소비주제: ${item.theme.sub.map(o=>o.name).join(', ')}`);
                  return info.join('\n');
              }).join('\n\n');
              line.dataset.nxStatusLoading = false;
          };
      });
  });
});