// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 게시물 유입 통계 어드밴스드
// @description  네이버 블로그 게시물 최근 유입 통계를 확인합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.5
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostView*
// @match        *://blog.naver.com/PostList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog-content.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.min.js
// @downloadURL https://update.greasyfork.org/scripts/428764/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%20%EC%9C%A0%EC%9E%85%20%ED%86%B5%EA%B3%84%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428764/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B2%8C%EC%8B%9C%EB%AC%BC%20%EC%9C%A0%EC%9E%85%20%ED%86%B5%EA%B3%84%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  moment.tz.setDefault("Asia/Seoul");
  GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
  GM_addStyle(`a._readReferrer .ico_spd { display: block; position: absolute; right: 13px; top: 13px; width: 20px; height: 20px; text-align: center; line-height: 20px; font-size:11px; font-weight: bold; }`);
  async function popup(data) {
      const tmpl = Handlebars.compile(`
        <!DOCTYPE HTML>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1" />
            <title>콘텐츠 유입 분석 결과</title>
            <style>
              html, body { height:100%; margin: 0; padding: 0; }
              h1, h2, h3, h4, h5, h6, p, ul, li { margin: 0; padding: 0; list-style: none; }
              .flex-row { flex-direction: row; }
              .flex-column { flex-direction: column; }
              .keyword-analysis,body { display: flex; flex-direction: column; height: 100%; overflow: hideen; }
              .keyword-analysis-body { flex-grow: 1; overflow-y: auto; }
              .keyword-analysis-toast { position: fixed; z-index: 100001; margin:auto; left: 0; top: 5rem; right: 0; bottom: auto; width:50%; height: 1.5rem; font-size: 1rem; background: #fff; color: #333; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0, 0, 0, 0.4); box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); }
              .keyword-analysis-subhead { background: #52565e; color:#fff; font-weight:bold; position: sticky; top: 0; font-size:12px; height: 30px; padding: 5px 15px; display: flex; align-items: center; justify-content: center; }
              .keyword-analysis-listview {}
              .keyword-analysis-listview li { display: flex; font-size:12px; height: 30px; padding: 5px 15px; align-items: center; justify-content: center; }
              .keyword-analysis-listview li > * {  }
              .keyword-analysis-listview li > *:nth-child(1) { flex-grow:1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
              .keyword-analysis-listview li > *:nth-child(2) { min-width: 90px; display: flex; flex-direction: column; text-align: right; line-height: auto;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
              .keyword-analysis-listitem { }
              .keyword-analysis-listitem:hover { background: #efefef; }
              .keyword-analysis-listhead { background: #279b37; color:#fff; font-weight:bold; position: sticky; top: 40px;  }
              .keyword-analysis-listhead-sub { background: #0abf53; color:#fff; font-weight:bold; position: sticky; top: 80px; }
              .keyword-analysis-listhead-sub a { color: #fff; }
              .keyword-analysis-icon-image::before { display: none; content: '\\1F5BC\\FE0F'; margin-right: 0.5rem; }
              .keyword-analysis-icon-normal::before { display: none; content: '\\1F4DD'; margin-right: 0.5rem; }
              .keyword-analysis-icon-timeline::before { display: none; content: '\\1F551'; margin-right: 0.5rem; }
              .keyword-analysis-rank > *:nth-child(2) { background: #f3f4f7; padding: 0.3rem; }
              .keyword-analysis-rank { background-color: #021e2f !important; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="keyword-analysis">
              <div class="keyword-analysis-body">
                <h3 class="keyword-analysis-subhead flex-column">
                  <span>콘텐츠 유입 분석 결과</span>
                  <small>{{tail.date}} ~ {{head.date}}</small>
                </h3>
                <ul class="keyword-analysis-listview">
                  {{#each items}}
                  <li class="keyword-analysis-listhead keyword-analysis-rank">
                    <h4>{{date}}</h4>
                  </li>
                  {{#each stats}}
                  <li class="keyword-analysis-listhead keyword-analysis-listhead-sub">
                    <h4>{{referrerDomain}}</h4>
                    <div><span class="keyword-analysis-value">총 {{cv}}건의 유입</span></div>
                  </li>
                  {{#each detail.refererDetail}}
                  <li class="keyword-analysis-listitem">
                    <h4>{{#if searchQuery}}[{{searchQuery}}] {{/if}}{{referrerUrl}}</h4>
                    <a href="{{referrerUrl}}" target="_blank" rel="noopener noreferrer">
                      <span class="keyword-analysis-value">{{cv}}건의 유입</span>
                    </a>
                  </li>
                  {{/each}}
                  {{/each}}
                  {{/each}}
                </ul>
              </div>
            </div>
          </body>
        </html>
      `);
      const html = tmpl(data);
      const blob = new Blob([html], {type : 'text/html'});
      return window.open(URL.createObjectURL(blob), '_readReferrer', 'width=600, height=960');
  }
  async function start(event, contentId, range) {
      const dates = _.range(range).map(o=>moment().subtract(o, 'days').toISOString(true));
      const items = await Promise.map(dates, async (date) => {
          const total = await NB_blogPostStat(contentId, 'referer/total', date, 'DATE');
          const stats = await Promise.map(total.refererTotal, async (item) => {
              const detail = await NB_blogPostStat(contentId, 'referer/total/detail', date, 'DATE', { searchEngine: item.referrerSearchEngine, refererDomain: item.referrerDomain })
              if(detail && detail.refererDetail){
                  detail.refererDetail = detail.refererDetail.map((item)=>{
                      const uri = ((url)=>{ try { return new URL(url); } catch(e) {} })(item.referrerUrl);
                      const qry = item.searchQuery = ['query', 'q', 'keyword', 'searchKeyword'].reduce((r, k)=>r||(uri && uri.searchParams.get('query')), '') || item.searchQuery || '';
                      return item;
                  });
              }
              return Object.assign({}, item, { detail });
          });
          return Object.assign({ date: moment(date).format('YYYY-MM-DD'), stats });
      });
      const head = _.head(items);
      const tail = _.last(items);
      popup({ head, tail, items });
  }
  async function handler(event) {
      const wrappers = Array.from(document.querySelectorAll('[data-post-editor-version]'));
      wrappers.map((wrapper) => {
          const menu = wrapper.querySelector('.lyr_overflow_menu'); if(!menu) return;
          const stat = wrapper.querySelector('.btn_stat'); if(!stat) return;
          const param = /_param\(([^\(\)]+)\)/.exec(stat.className), value = param && param[1]; if(!value) return;
          const contentId = value.replace(/^(.*?)([\d]{12})(.*?)$/, '$2'); if(!contentId) return;
          const menu_append = (title, range = 7) => {
              const item = menu.querySelector(`a._readReferrer._readReferrer${range}`) || document.createElement('a'); if(item.className) return;
              item.classList.add('_readReferrer', `_readReferrer${range}`); item.href = '#'; menu.append(item); item.innerHTML = `${title} <span class="ico_spd">${range}일</span>`;
              item.onclick = async function(event) { event.preventDefault(); await start(event, contentId, range); }
          }
          menu_append('유입통계', 7);
          menu_append('유입통계', 30);
      });
  }
  window.addEventListener('keyup', handler, false);
  window.addEventListener('keydown', handler, false);
  window.addEventListener('keypress', handler, false);
  window.addEventListener('click', handler, false);
  handler();
});