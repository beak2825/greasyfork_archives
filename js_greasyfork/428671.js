// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 문서 구성 요약
// @description  네이버 블로그로 작성된 문서 구성을 간략하게 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.9
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
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/smart-editor-one.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428671/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AC%B8%EC%84%9C%20%EA%B5%AC%EC%84%B1%20%EC%9A%94%EC%95%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428671/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AC%B8%EC%84%9C%20%EA%B5%AC%EC%84%B1%20%EC%9A%94%EC%95%BD.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
// ---------------------
GM_App(async function main() {
  GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
  GM_addStyle(`
  .cursor-help { cursor: help; }
  .content-analysis-flex-row { flex-direction: row; }
  .content-analysis-flex-column { flex-direction: column; }
  .content-analysis {
    position: fixed; z-index: 100000;
    margin:auto; left: 0; top: 0; right: auto; bottom: 0;
    width:300px; height: 80%; background: #fff; color: #333;
    display: flex; flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  }
  .content-analysis:hover { width: 560px; }
  .content-analysis-body {
    flex-grow: 1; overflow-y: auto;
  }
  .content-analysis-subhead { background: #52565e; color:#fff; font-weight:bold; position: sticky; top: 0; font-size:12px; height: 30px; padding: 5px 15px; display: flex; align-items: center; justify-content: center; }
  .content-analysis-listview {}
  .content-analysis-listview li { display: flex; font-size:12px; height: 30px; padding: 5px 15px; align-items: center; justify-content: center; }
  .content-analysis-listview li > * {  }
  .content-analysis-listview li > *:nth-child(1) { flex-grow:1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
  .content-analysis-listview li > *:nth-child(2) { min-width: 90px; display: flex; flex-direction: column; text-align: right; line-height: auto;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
  .content-analysis-listitem { }
  .content-analysis-listitem:hover { background: #efefef; }
  .content-analysis-listhead { background: #279b37; color:#fff; font-weight:bold; position: sticky; top: 40px;  }
  .content-analysis-listhead-title { background: #74d2e7; color:#fff; }
  .content-analysis-listhead-text  { background: #48a9c5; color:#fff; }
  .content-analysis-listhead-image { background: #0085ad; color:#fff; }
  .content-analysis-listhead-video { background: #8db9ca; color:#fff; }
  .content-analysis-listhead-line { background: #4298b5; color:#fff; }
  .content-analysis-listhead-sticker { background: #005670; color:#fff; }
  .content-analysis-listhead-quotation { background: #00205b; color:#fff; }
  .content-analysis-listhead-places { background: #009f4d; color:#fff; }
  .content-analysis-listhead-link { background: #84bd00; color:#fff; }
  .content-analysis-listhead-file { background: #efdf00; color:#fff; }
  .content-analysis-listhead-schedule { background: #fe5000; color:#fff; }
  .content-analysis-listhead-code { background: #e4002b; color:#fff; }
  .content-analysis-listhead-table { background: #da1884; color:#fff; }
  .content-analysis-listhead-formula { background: #a51890; color:#fff; }
  .content-analysis-listhead-talktalk { background: #0077c8; color:#fff; }
  .content-analysis-listhead-material { background: #008eaa; color:#fff; }

  @keyframes blinker {
    from { opacity: 1.0; outline: 0px solid #f00; }
    to { opacity: 0.3; outline: 1px solid #f00; }
  }
  .content-analysis-highlight {
    animation: blinker 0.3s linear 5;
  }
  `);
  const se = SE_parse(document); if(!se.content) return;
  const wrap = document.querySelector('#content-analaysis') || document.createElement('div'); wrap.id = 'content-analaysis'; document.body.prepend(wrap);
  Handlebars.registerHelper('size', (obj) => _.size(obj));
  Handlebars.registerHelper('length', (section) => SE_componentContent([section]).replace(/[\r\n]+/g, '').length);
  Handlebars.registerHelper('lengthTrim', (section) => SE_componentContent([section]).replace(/[\r\n\s]+/g, '').length);
  GM_addScript(() => {
      function toggle(index, state) {
          let docs = document;
          const clipContent = docs.querySelector('#__clipContent'); if(clipContent) { docs = new DOMParser().parseFromString(clipContent.textContent, 'text/html'); }
          const sectionsV2 = Array.from(docs.querySelectorAll('.post_tit_area + #viewTypeSelector > *, body.se2_inputarea > *'));
          const sectionsV3 = Array.from(docs.querySelectorAll('#viewTypeSelector .se_component, .se_doc_viewer .se_component, .editor-canvas-wrap .se_component, #se_canvas_wrapper .se_component, .se_card_container .se_component'));
          const sectionsV4 = Array.from(docs.querySelectorAll('#viewTypeSelector .se-component, .se-viewer .se-component, .se-main-container .se-component, .se-container .se-component'));
          const sections = [sectionsV2, sectionsV3, sectionsV4].flat();
          const component = sections[index];
          if(component) {
              event.preventDefault();
              component.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
              component.classList.remove('content-analysis-highlight');
              void component.offsetWidth;
              if(state) component.classList.add('content-analysis-highlight');
          }
      }
      window.content_analysis_focus = function content_analysis_focus(index) { toggle(index, true); };
      window.content_analysis_focusout = function content_analysis_focusout(index) { toggle(index, false); }
  });
  const tmpl = Handlebars.compile(`
  <div class="content-analysis">
    <div class="content-analysis-body">
      <h3 class="content-analysis-subhead content-analysis-flex-column">
        <span>총 {{size sections}}개의 구성요소</span>
        <small>글자수: {{contentLength}}자 (공백제외: {{contentLengthTrim}}자)</small>
      </h3>
      <ul class="content-analysis-listview">
        {{#each sections}}
        <li class="content-analysis-listhead content-analysis-listhead-{{type}} cursor-help" onmouseover="content_analysis_focus({{offset}})" onmouseout="content_analysis_focusout({{offset}})">
          <h4>{{type}}</h4>
          <div>
            <span class="content-analysis-value">글자수: {{length this}}자 (공백제외: {{lengthTrim this}}자)</span>
          </div>
        </li>
        {{/each}}
      </ul>
    </div>
  </div>
  `);
  wrap.innerHTML = tmpl(se);
});