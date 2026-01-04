// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 보유키워드 분석
// @description  네이버 블로그 프로필에서 보유키워드를 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.10
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/profile/intro*
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428668/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%B3%B4%EC%9C%A0%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428668/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%B3%B4%EC%9C%A0%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#post-area', 0);
    GM_addStyle(`@import url(https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.css)`);
    GM_addStyle(`
    .blog-keywords-total-loading { position: relative; }
    .blog-keywords-total-loading::after { content: attr(data-message); color: #fff; font-family:  Lato,"Helvetica Neue" ; font-weight: 200; font-size: 16px; position: absolute; width: 100%; height: 20px; line-height: 20px; left: 0; top: 0; background-color: #e74c3c; z-index: 1; }
    .blog-keywords-total-loading::before { content: ""; position: absolute; background-color: #fbb034; top: -5px; left: 0px; height: 30px; width: 0px; z-index: 0; opacity: 1; transform-origin: 100% 0%; animation: loader3 10s ease-in-out infinite; }
    @keyframes loader3{ 0%{width: 0px;} 70%{width: 100%; opacity: 1;} 90%{opacity: 0; width: 100%;} 100%{opacity: 0;width: 0px;} }
    #profile h2.keyword_info { padding: 5px 0; font-family: 돋움; font-size: 12px; margin-top: 30px; }
    #profile h2.keyword_info img.arw01 { margin: 0 7px 1px 5px; }
    #profile ul.keyword_info { list-style: none; clear: both; border-bottom: 1px solid #ccc; }
    #profile ul.keyword_info li.item { font-size: 12px; display: inline-block; padding: 0.2rem 0.5rem; margin-right: 0.5rem; margin-top: 0.25rem; margin-bottom: 0.25rem; background-color: #0abf53; border-radius: 50rem; color: #fff; }
    #profile ul.keyword_info li.line { dispaly:block; width: 100%; height:1px; overflow:hidden; padding: 0; margin-right: 0; background: #ccc; }
    #profile ul.keyword_info li.head { dispaly:block; width: 100%; padding: 5px 0; font-family: 돋움; font-size: 12px; font-weight: bold; }
    `);
    const uri = new URL(location.href), { blogId } = Object.fromEntries(uri.searchParams.entries()); if(!blogId) return;
    const wrp = document.querySelector('#profile'); if(!wrp) return;
    const cnv = wrp.querySelector('.blog-keywords-total') || document.createElement('div'); cnv.classList.add('blog-keywords-total'); wrp.append(cnv);
    (async function redraw(categoryNo, pages = Number.MAX_SAFE_INTEGER) {
        redraw.count = 0;
        const blog = {};
        blog.BlogInfo = await NB_blogInfo(blogId, 'BlogInfo');
        blog.BlogUserInfo = await NB_blogInfo(blogId, 'BlogUserInfo');
        blog.CategoryList = await NB_blogInfo(blogId, 'CategoryList');
        blog.PopularPostBlockInfo = await NB_blogInfo(blogId, 'PopularPostBlockInfo');
        blog.TalkTalkAndReservationInfo = await NB_blogInfo(blogId, 'TalkTalkAndReservationInfo');
        const postsSizes = _.get(blog, 'CategoryList.mylogPostCount', 1);
        const categories = _.get(blog, 'CategoryList.mylogCategoryList', []).filter(o=>o.openYN && o.postCnt > 0);
        const posts = ((cnv.dataset.message = `콘텐츠 가져오는 중... 모든 작업을 중단하고 완료가 될 때까지 가만히 기다려 주세요...`) && categoryNo !== undefined) ? await NB_blogPostList(blogId, pages, { categoryNo }) : [];
        const posts_with_terms = await Promise.mapSeries(posts, async (post)=>(cnv.dataset.message = `콘텐츠 분석 중... (${++redraw.count}/${posts.length})`, post.terms = await NX_termsParagraph(post.titleWithInspectMessage), post));
        const terms = posts_with_terms.map((post)=>post.terms).flat();
        const uniqs = terms.filter((word, index, keywords)=>keywords.indexOf(word) == index);
        const group = uniqs.reduce((group, query, index)=>(group[index] = Object.assign({ query, count: terms.filter(item=>item==query).length }), group), []).sort((a, b)=>b.count - a.count);
        const data = { blog, group, posts_with_terms, postsSizes, categories };
        const tmpl = Handlebars.compile(`
          <h2 class="keyword_info"><img src="https://blogimgs.pstatic.net/nblog/spc.gif" width="1" height="1" class="arw01" alt="">보유 키워드 조회</h2>
          <div>
            <select id="categoryNo" name="categoryNo">
              <option value="0">전체 ({{postsSizes}})</option>
              {{#each categories}}<option value="{{categoryNo}}">{{categoryName}} ({{postCnt}})</option>{{/each}}
            </select>
            <button id="submitInfo">조회</button>
          </div>
          <h2 class="keyword_info"><img src="https://blogimgs.pstatic.net/nblog/spc.gif" width="1" height="1" class="arw01" alt="">검색허용 생산 키워드 (총 {{group.length}}건)</h2>
          <div>
            <ul class="keyword_info">
              <li class="line"></li>
              {{#each group}}<li class="item">({{count}}) {{query}}</li>{{/each}}
            </ul>
          </div>
          <h2 class="keyword_info"><img src="https://blogimgs.pstatic.net/nblog/spc.gif" width="1" height="1" class="arw01" alt="">검색허용 생산 콘텐츠 (총 {{posts_with_terms.length}}건)</h2>
          <div>
            <ul class="keyword_info">
            {{#each posts_with_terms}}
              <li class="line"></li>
              <li class="head"><a href="https://blog.naver.com/{{blogId}}/{{logNo}}" target="_blank">{{titleWithInspectMessage}}</a></li>
              {{#each terms}}<li class="item">{{@this}}</li>{{/each}}
            {{/each}}
            </ul>
          </div>
        `);
        cnv.innerHTML = tmpl(data);
        const formCategoryNo = cnv.querySelector('#categoryNo'); if(!formCategoryNo);
        const formSubmitInfo = cnv.querySelector('#submitInfo'); if(!formSubmitInfo);
        formSubmitInfo.onclick = async function() {
            event.preventDefault();
            cnv.classList.toggle('blog-keywords-total-loading', formSubmitInfo.disabled = true);
            await redraw(formCategoryNo.value, pages);
            cnv.classList.toggle('blog-keywords-total-loading', formSubmitInfo.disabled = false);
        }
    })();
});