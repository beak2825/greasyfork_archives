// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그&포스트 키워드 분석
// @description  네이버 블로그&포스트 작성 중 포함된 키워드를 분석합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.8
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/*Redirect=Write*
// @match        *://blog.naver.com/*Redirect=Update*
// @match        *://blog.naver.com/*/postwrite*
// @match        *://blog.naver.com/PostWriteForm*
// @match        *://blog.naver.com/PostUpdateForm*
// @match        *://blog.editor.naver.com/editor*
// @match        *://post.editor.naver.com/editor*
// @match        *://m.post.editor.naver.com/editor*
// @match        *://blog.naver.com/lib/smarteditor2/*/smart_editor2_inputarea.html
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @downloadURL https://update.greasyfork.org/scripts/428677/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428677/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`
    @keyframes spin1 { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
    .se-util-button-device-desktop { margin-top: 14px; }
    .se-util-button-keywords::before {
      display: inline-block; width: 37px; height: 37px;
      line-height: 40px; text-align: center; font-size: 18px; color: #666;
      content: '\\2049\\FE0F' !important;
    }
    .se-utils-item-keywords-loading .se-util-button-keywords::before { animation: spin1 2s infinite linear; }
    .se-utils-item-keywords[data-process-keyword-info]::after {
      display: none; position: absolute; z-index: -1; margin:auto; right: 20px; top: -240px; bottom: 0px; margin-bottom: 10px;
      padding: 15px; width: 300px; height: auto; overflow-y: auto; white-space: pre-line;
      border: 1px solid #ddd; border-radius: 8px; background-color: #fff;
      content: attr(data-process-keyword-info); line-height: 1.5rem;
      word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;
    }
    .se-utils-item-keywords.se-utils-item-keywords-show[data-process-keyword-info]::after { display: block; }
    `);
    async function handler(e) {
        const mnu = document.querySelector('.se-ultils-list'); if(!mnu) return;
        const wrp = mnu.querySelector('.se-utils-item.se-utils-item-keywords') || document.createElement('li'); wrp.classList.add('se-utils-item', 'se-utils-item-keywords'); mnu.prepend(wrp);
        const btn = wrp.querySelector('button') || document.createElement('button'); btn.classList.add('se-util-button', 'se-util-button-keywords'); btn.innerHTML = '<span class="se-utils-text">키워드 분석</span>'; wrp.append(btn);
        wrp.onclick = function () { wrp.classList.remove('se-utils-item-keywords-show'); }
        btn.onclick = async function() {
            if(window.__processing_content) return;
            wrp.classList.toggle('se-utils-item-keywords-loading', window.__processing_content = true);
            wrp.dataset.processKeywordInfo = '[분석진행중]\n키워드 추출 및 분석 작업이 진행중입니다...\n아이콘의 회전이 멈출때까지 잠시 기다려 주세요.';
            const se = SE_parse(document);
            const sentences = se.sections.filter((section)=>['text', ''].includes(section.type));
            if(se.content) {
                const terms = await NX_termsParagraph(se.content).catch(e=>[]);
                const title = await NR_termsAll(...terms).catch(e=>[]);
                const uniqs = terms.filter((word, index, terms)=>terms.indexOf(word) == index);
                const group = uniqs.reduce((group, query, index)=>(group[index] = Object.assign({ query, count: terms.filter(item=>item==query).length }, title.find(o=>o.query == query)), group), []).sort((a, b)=>b.count - a.count);
                wrp.dataset.processKeywordInfo = group.map((item, offset)=>{
                    const info = [`${_.padEnd(`(${item.count})`, 8)}${_.padEnd(item.query, 10)}`];
                    if(item.r_category) info.push(`생산선호주제: ${item.r_category}`)
                    if(item.theme && item.theme.main) info.push(`메인소비주제: ${item.theme.main.name}`);
                    if(item.theme && item.theme.sub)  info.push(`서브소비주제: ${item.theme.sub.map(o=>o.name).join(', ')}`);
                    return info.join('\n');
                }).join('\n\n') || '[오류]\n키워드 본문이 너무 짧거나, 분석 결과를 산출 할 수 없습니다.';
            } else {
                wrp.dataset.processKeywordInfo = '[오류]\n키워드 분석 결과를 산출 할 수 없습니다.';
            }
            wrp.classList.add('se-utils-item-keywords-show');
            wrp.classList.toggle('se-utils-item-keywords-loading', window.__processing_content = false);
        };
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    handler();
})