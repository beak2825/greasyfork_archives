// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 글 제목 키워드 추출 분석
// @description  네이버 블로그의 글 제목을 기반으로 모든 키워드를 추출하고 분석결과를 제공합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.8
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostView*
// @match        *://blog.naver.com/PostList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/Object.fromEntries.js
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428674/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B8%80%20%EC%A0%9C%EB%AA%A9%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%B6%94%EC%B6%9C%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428674/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B8%80%20%EC%A0%9C%EB%AA%A9%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%B6%94%EC%B6%9C%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`a._readKeywords .ico_spd { display: block; position: absolute; right: 13px; top: 13px; width: 20px; height: 20px; text-align: center; line-height: 20px; font-size:11px; font-weight: bold; }`);
    GM_addStyle(`body._readKeywordsStatus::after { content: attr(data-keywords-status); position: fixed; z-index: 1000000; margin: auto; left:0;top:0;bottom:0;right:0; background:rgba(0,0,0,0.7); color:#fff; display: flex; justify-content: center; align-items: center; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap; }`);
    async function popup(data) {
        const tmpl = Handlebars.compile(`
          <!DOCTYPE HTML>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1" />
              <title>키워드 추출 분석 결과</title>
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
                .keyword-analysis-rank1 { background-color: #0097dc !important; }
                .keyword-analysis-rank2 { background-color: #005abb !important; }
                .keyword-analysis-rank3 { background-color: #00539f !important; }
                .keyword-analysis-rank4 { background-color: #003b6a !important; }
                .keyword-analysis-rank5 { background-color: #002b46 !important; }
                .keyword-analysis-rank0 { background-color: #343735 !important }
              </style>
            </head>
            <body>
              <div class="keyword-analysis">
                <div class="keyword-analysis-body">
                  <h3 class="keyword-analysis-subhead flex-column">
                    <span>키워드 추출 분석 결과</span>
                    <small>{{keywords.length}}개의 키워드</small>
                  </h3>
                  <ul class="keyword-analysis-listview">
                    {{#each keywords}}
                    <li class="keyword-analysis-listhead keyword-analysis-rank keyword-analysis-rank{{item.rank}}">
                      <h4>{{@index}}. {{query}}</h4>
                      <a href="https://search.naver.com/search.naver?where=view&query={{query}}&mode=normal" target="_blank" rel="noopener noreferrer">
                        <span class="keyword-analysis-value">{{item.rank}}위</span>
                      </a>
                    </li>
                    {{#each rel}}
                    <li class="keyword-analysis-listhead keyword-analysis-listhead-sub">
                      <h4>{{query}}</h4>
                      <a href="https://search.naver.com/search.naver?where=view&query={{query}}&mode=normal" target="_blank" rel="noopener noreferrer">
                        <span class="keyword-analysis-value">검색하기</span>
                      </a>
                    </li>
                    {{#if r_category}}
                    <li class="keyword-analysis-listitem">
                      <h4>생산선호주제</h4>
                      <div>
                        <span class="keyword-analysis-value">{{r_category}}</span>
                      </div>
                    </li>
                    {{/if}}
                    {{#if theme.main}}
                    <li class="keyword-analysis-listitem">
                      <h4>메인소비주제</h4>
                      <div>
                        <span class="keyword-analysis-value">{{theme.main.name}}</span>
                      </div>
                    </li>
                    {{/if}}
                    {{#each theme.sub}}
                    <li class="keyword-analysis-listitem">
                      <h4>서브소비주제</h4>
                      <div>
                        <span class="keyword-analysis-value">{{name}}</span>
                      </div>
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
        return window.open(URL.createObjectURL(blob), '_readKeywords', 'width=600, height=960');
    }
    async function starter(event) {
        if(handler.running) return alert('이미 키워드 추출 분석이 진행 중입니다.');
        document.body.classList.toggle('_readKeywordsStatus', handler.running = true);
        try {
            const uri = new URL(location.href), params = Object.fromEntries(uri.searchParams.entries()), blogId = params.blogId;
            const se = SE_parse(wrapper), se_title = se.sections.find(o=>o.type == 'title');
            if(blogId && se_title) {
                const title = se_title.text.join(' ');
                document.body.dataset.keywordsStatus = `제목을 분석 중입니다... 잠시 기다려 주세요...\n\n${title}`;
                const words = await NX_termsParagraph(title), uniqs = _.uniq(words);
                document.body.dataset.keywordsStatus = `제목을 분석 중입니다...\n${uniqs.length}개의 키워드가 발견되었습니다.`;
                const cases = uniqs.reduce((function loops(index, cases, word, offset, uniqs){
                    if(index >= 2) return cases;
                    const sorts = Array.from(uniqs).sort((curr)=>curr===word?-1:1).slice(1);
                    const trans = Array.from(sorts).map((next)=>`${word} ${next}`);
                    const remap = Array.from(sorts).reduce(loops.bind(null, index+1), []).map((next)=>`${word} ${next}`);
                    cases.push(word, ...trans, ...remap);
                    return cases.sort().filter((v, i, a)=>a.indexOf(v) == i);
                }).bind(null, 0), []);
                document.body.dataset.keywordsStatus = `제목을 분석 중입니다... 잠시 기다려 주세요...\n\n${cases.length}개의 조합 키워드가 발견되었습니다.`;
                const cases_terms = await NR_termsAll(...cases); console.log(cases_terms);
                const cases_items = cases_terms; //.filter(o=>o.r_category || o.theme);
                const cases_query = cases_items.map(o=>o.query);
                document.body.dataset.keywordsStatus = `순위를 분석 중입니다... 잠시 기다려 주세요...\n\n${cases_query.length}개의 키워드 순위를 수집중입니다.`;
                const items = await NX_itemsAll(...cases_query);
                document.body.dataset.keywordsStatus = `순위를 분석 중입니다... 잠시 기다려 주세요...\n\n${items.length}개의 키워드 순위 수집이 완료되었습니다.`;
                const trans = items.map((item)=>(item = item || {}, item.item=item.items && item.items.find(o=>o.blogId==blogId), item));
                const finds = trans.filter(o=>o.item).map(o=>(o.rel=o.query.split(' ').map(k=>cases_terms.find(o=>o.query==k)).filter(v=>!!v), o)).sort((a,b)=>a.item.rank-b.item.rank);
                console.log(finds);
                popup({ keywords: finds });
            }
        }catch(e){
            console.error(e);
            alert('키워드 추출 과정에서 오류가 발생하였습니다.');
        }
        document.body.classList.toggle('_readKeywordsStatus', handler.running = false);
    }
    async function handler(event) {
        if(handler.running && event && event.type == 'keydown' && event.keyCode == 27) stopper(event);
        const wrappers = Array.from(document.querySelectorAll('[data-post-editor-version]'));
        wrappers.map((wrapper) => {
            const menu = wrapper.querySelector('.lyr_overflow_menu'); if(!menu) return;
            const menu_append = (type, rate = 1) => {
                const item = menu.querySelector(`a._readKeywords.${type}`) || document.createElement('a'); if(item.className) return;
                item.classList.add('_readKeywords', type); item.href = '#'; menu.append(item); item.innerHTML = `키워드 추출 분석`;
                item.onclick = async function(event) {
                    event.preventDefault();
                    await starter(event);
                }
            }
            menu_append('normal', 1.0);
        });
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    window.addEventListener('click', handler, false);
    handler();
  });