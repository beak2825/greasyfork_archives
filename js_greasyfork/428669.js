// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 키워드 노출순위 모니터링
// @description  네이버 블로그의 최근 유입 키워드의 노출순위를 모니터링 할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.29
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/prologue/PrologueList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/Object.fromEntries.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/String.prototype.matchAll.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428669/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%85%B8%EC%B6%9C%EC%88%9C%EC%9C%84%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428669/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%85%B8%EC%B6%9C%EC%88%9C%EC%9C%84%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
let keyword_analysis_toast;
moment.tz.setDefault("Asia/Seoul");

async function request(url, options = { method: 'GET' }) { return new Promise((resolve, reject) => { GM_xmlhttpRequest(Object.assign({ method: 'GET', url: url.toString(), onerror: reject, onload: resolve, }, options)); }); }
// 블로그분석
async function request_blog(blogId, action, params = {}) {
    const referer = `https://m.blog.naver.com/${blogId}`;
    const uri = new URL(`https://m.blog.naver.com/rego/${action}.naver?blogId=${blogId}`); _.map(params, (v, k) => uri.searchParams.set(k, v));
    const res = await request(uri.toString(), { headers: { referer } });
    const data = eval(`('${res.responseText})`);
    return data && data.result;
}
// 스탯분석
async function request_stat(blogId, date = Date.now()) {
    const referer = `https://m.blog.naver.com/${blogId}`;
    const uri = new URL(`https://blog.stat.naver.com/api/blog/user/referer/search?timeDimension=DATE&startDate=${moment(date).format('YYYY-MM-DD')}&exclude=&_=${Date.now()}`);
    const res = await request(uri.toString(), { headers: { referer } });
    const data = eval(`(${res.responseText})`);
    return data && data.result;
}
async function remap_statdata(statDataList) {
    return _.reduce(statDataList, (maps, item) => {
        if(item.data.columnInfo) {
            const keys = item.data.columnInfo;
            const cols = item.data.rows ? item.data.rows['date'].length : 0;
            const rows = _.reduce(_.range(cols), (rows, idx) => {
                const row = _.reduce(keys, (data, key) => (data[key] = item.data.rows[key][idx], data), {});
                return (rows.push(row), rows);
            }, []);
            return (maps[item.dataId] = rows, maps);
        } else {
            return (maps[item.dataId] = item.data.value, maps);
        }
    }, {});
}
// 키워드 분석
async function nx_request_xhr(keyword, where = 'view', mode = 'normal') {
    const uri = new URL(`https://search.naver.com/search.naver?where=view&query=%EA%B0%9C%EB%B0%9C%EC%9E%90&nso=`);
    uri.searchParams.set('where', where);
    uri.searchParams.set('query', keyword);
    uri.searchParams.set('main_q', keyword);
    uri.searchParams.set('mode', mode);
    uri.searchParams.delete('api_type');
    uri.searchParams.delete('mobile_more');
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({ method: 'GET', url: uri.toString(), onerror: reject, onload: resolve, });
    });
}
async function nx_request(keyword, type = 'review', mode = 'normal') {
    const res = await nx_request_xhr(keyword, type, mode);
    const doc = new DOMParser().parseFromString(res.responseText, 'text/html')
    const map = Array.from(doc.body.childNodes).filter(el=>el.nodeType == 8).map((nx) => Array.from(nx.nodeValue.matchAll(/^(?<k>[^\s\:]+)([\s\:]+)?(?<v>.*)$/igm)).map(o=>Object.assign({}, o.groups))).flat();
    const ret = map.reduce((r, { k, v }) => {
        if(typeof v === 'string' && v.includes(',')) v = v.split(',').map(r=>r.split(',').map(v=>decodeURIComponent(v).split(':').map(v=>decodeURIComponent(v))));
        if(typeof v === 'string' && v.includes('|')) v = v.split('|').map(r=>r.split(':').map(v=>decodeURIComponent(v)));
        if(typeof v === 'string' && v.includes(':')) v = v.split(':').map(v=>decodeURIComponent(v));
        if(typeof v === 'string') v = decodeURIComponent(v);
        return (r[k] = v, r);
    }, {});
    return ret;
}
async function nx_items(keyword, type = 'review', mode = 'normal') {
    const res = await nx_request_xhr(keyword, type, mode);
    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
    const listview = doc.querySelectorAll('.lst_total > li, .timeline_list > li, .media_list > li');
    return _.map(listview, (listitem, offset) => {
        const el_t = listitem.querySelector('.total_tit');
        const el_d = listitem.querySelector('.dsc_txt');
        if(!el_t || !el_d) return;
        try {
            const uri = new URL(el_t.href), params = Object.fromEntries(uri.searchParams.entries());
            if(!uri.hostname.includes('blog.naver.com')) return;
            return {
                ...params,
                keyword, type, mode,
                rank: offset + 1,
                blogId: uri.pathname.split('/')[1],
                briefContents: el_t.textContent,
                titleWithInspectMessage: el_t.textContent,
            }
        } catch(e) {}
    }).filter(v=>!!v);
}
// 데이터 파싱
function map_changes(curr, prev) {
    if(curr < prev) return 'dn';
    if(curr > prev) return 'up';
    return 'eq';
}
async function stat(blogId, step = 3) {
    const range = _.range(step);
    const dateNowISO = moment().toISOString(true);
    const dates = _.map(range, (offset)=>moment().subtract(offset, 'days').format('YYYY-MM-DD'));
    const stats = await Promise.map(dates, async (date) => {
        if(keyword_analysis_toast) keyword_analysis_toast.textContent = `${date} 키워드 유입 통계 가져오는 중...`;
        const data = await request_stat(blogId, date);
        const maps = await remap_statdata(data && data.statDataList);
        return maps;
    }, { concurrency: 3 });
    const keywords_stat = _.reduce(stats, (keywords, stat) => {
        const stats = _.reduce(stat.refererSearch, (stats, item) => {
            const key = item.searchQuery.toLowerCase().replace(/[\s]+/g, '');
            const rows = stats[key] = stats[key] || [];
            return (rows.push(item), stats);
        }, keywords);
        return stats;
    }, {});
    const keywords_map = await Promise.map(_.keys(keywords_stat), async (keygroup) => {
        const stats = _.get(keywords_stat, keygroup, []);
        const stats_group = _.map(_.groupBy(stats, 'searchQuery'), (stats, keyword)=>{
            const cv = _.sumBy(stats, 'cv');
            const stats_changes = _.map(stats, (stat, idx, stats) => {
                const curr = stat, prev = (stats[idx + 1] || stat);
                stat.d_cv = map_changes(curr.cv, prev.cv);
                stat.d_cv_p = map_changes(curr.cv_p, prev.cv_p);
                return stat;
            });
            return { keyword, cv, stats: stats_changes };
        });
        const items = _.uniq(_.map(stats, o=>o.searchQuery));
        const ranks_group = await Promise.map(items, async (keyword) => {
            if(keyword_analysis_toast) keyword_analysis_toast.textContent = `"${keyword}" 키워드 종합 순위 가져오는 중...`;
            const items_search_n = await nx_items(keyword, 'review', 'normal');
            const items_search_t = await nx_items(keyword, 'review', 'timeline');
            const items_search_i = await nx_items(keyword, 'review', 'image');
            const items_search_w = await nx_items(keyword, 'web', 'image');
            const items_search = _.concat([], items_search_n, items_search_t, items_search_w);
            const items = _.filter(items_search, { blogId });
            const item = _.minBy(items.filter(o=>o.rank), 'rank');
            const data = _.assign({ rank: 0, type: 'review', mode: 'normal' }, _.pick(item, 'rank', 'type', 'mode'));
            const date = dateNowISO;
            return { date, keyword, item, ...data };
        });
        const rank_null = _.minBy(ranks_group, 'rank');
        const rank_item = _.minBy(ranks_group.filter(o=>o.rank), 'rank');
        const rank_data = _.assign({ keyword: (rank_null ? rank_null.keyword : ''), rank: 0, type: 'review', mode: 'normal' }, _.pick(rank_item, 'keyword', 'rank', 'type', 'mode'));
        const cv = _.mapValues(_.groupBy(stats, 'date'), (items)=>_.sumBy(items, 'cv'));
        const cv_total = _.reduce(cv, (r, v)=>r+v, 0);
        return { keygroup, cv, cv_total, rank_item, ranks_group, stats_group, ...rank_data }
    }, { concurrency: 3 });
    const cv = _.reduce(dates, (cv, date)=>(cv[date] = _.sumBy(keywords_map, (item)=>_.get(item.cv, date, 0)), cv), {});
    const cv_total = _.sumBy(keywords_map, 'cv_total');
    const keywords = _.orderBy(keywords_map, ['cv_total', 'rank'], ['desc', 'asc']);
    const data = { cv, cv_total, keywords };
    if(keyword_analysis_toast) keyword_analysis_toast.textContent = `${keywords_map.length}개의 키워드 그룹 순위 가져오기 완료`;
    return data;
}
async function stat_data(blogId, step) {
    const date = moment().format('YYYY-MM-DD');
    const data = await stat(blogId, step);
    const curr = { date, data };
    const prev = (await localforage.getItem('last')) || curr;
    if(moment().diff(prev.date, 'days') || _.eq(curr, prev)) await localforage.setItem('last', curr);
    const resp = curr.data;
    resp.date_curr = curr.date;
    resp.date_prev = prev.date;
    resp.keywords = _.map(resp.keywords, (item)=>{
        const item_prev = _.mapKeys(_.find(prev.data.keywords, { keygroup: item.keygroup }) || item, (v, k)=>`${k}_prev`);
        const resp = _.assign({}, item_prev, item);
        resp.d_cv_total = map_changes(resp.cv_total, resp.cv_total_prev);
        resp.d_rank = map_changes(resp.rank_prev, resp.rank);
        resp.stats_group = _.map(resp.stats_group, (o)=>({ ..._.find(resp.ranks_group, _.pick(o, 'keyword')), ...o }));
        return resp;
    });
    return resp;
}
async function draw(blogId) {
    const wrap = document.querySelector('#keyword-analysis') || document.createElement('div'); wrap.id = 'keyword-analysis'; document.body.prepend(wrap);
    const msgs = keyword_analysis_toast = wrap.querySelector('.keyword-analysis-toast') || document.createElement('div'); msgs.classList.add('keyword-analysis-toast'); wrap.append(msgs);
    const step = 30; // 범위 고정
    const data = await stat_data(blogId, step); data.step = step;
    const tmpl = Handlebars.compile(`
    <div class="keyword-analysis">
      <div class="keyword-analysis-body">
        <h3 class="keyword-analysis-subhead flex-column">
          <span>검색유입 상위키워드 ({{step}}일)</span>
          <small>{{date_prev}} vs {{date_curr}}</small>
        </h3>
        <ul class="keyword-analysis-listview">
          {{#each keywords}}
          <li class="keyword-analysis-listhead keyword-analysis-rank keyword-analysis-rank{{rank}}">
            <h4>그룹:{{keygroup}}</h4>
            <a href="https://search.naver.com/search.naver?where=view&sm=tab_viw.blog&query={{keyword}}&mode={{mode}}" target="_blank" rel="noopener noreferrer">
              <span class="keyword-analysis-value {{d_rank}}">{{mode}} {{rank}}위</span>
              <small class="keyword-analysis-value {{d_cv_total}}">누적 {{cv_total}}</small>
            </a>
          </li>
            {{#each stats_group}}
            <li class="keyword-analysis-listhead keyword-analysis-listhead-sub">
              <h4>{{keyword}}</h4>
              <a href="https://search.naver.com/search.naver?where=view&sm=tab_viw.blog&query={{keyword}}&mode={{mode}}" target="_blank" rel="noopener noreferrer">
                <span class="keyword-analysis-value">{{mode}} {{rank}}위</span>
                <small class="keyword-analysis-value">누적 {{cv}}</small>
              </a>
            </li>
              {{#each stats}}
              <li class="keyword-analysis-listitem">
                <h4>{{date}}</h4>
                <div>
                  <span class="keyword-analysis-value {{d_cv}}">{{cv}}</span>
                  <small class="keyword-analysis-value {{d_cv_p}}">{{toFixed_2 cv_p}}%</small>
                </div>
              </li>
              {{/each}}
            {{/each}}
          {{/each}}
        </ul>
      </div>
    </div>
    `);
    wrap.innerHTML = tmpl(data);
    keyword_analysis_toast.remove();
}
GM_App(async function main() {
    GM_donation('#post-area', 0);
    GM_addStyle(`@import url(https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.css)`);
    GM_addStyle(`
    .flex-row { flex-direction: row; }
    .flex-column { flex-direction: column; }
    .keyword-analysis {
      position: fixed; z-index: 100000;
      margin:auto; left: 0; top: 0; right: auto; bottom: 0;
      width:220px; height: 80%; background: #fff; color: #333;
      display: flex; flex-direction: column;
      border: 1px solid rgba(0, 0, 0, 0.4);
      box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }
    .keyword-analysis:hover { width: 480px; }
    .keyword-analysis-body {
      flex-grow: 1; overflow-y: auto;
    }
    .keyword-analysis-toast {
      position: fixed; z-index: 100001;
      margin:auto; left: 0; top: 5rem; right: 0; bottom: auto;
      width:50%; height: 1.5rem; font-size: 1rem; background: #fff; color: #333;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(0, 0, 0, 0.4);
      box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
    }
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
    .keyword-analysis-value.up { color: #f00; }
    .keyword-analysis-value.dn { color: #00f; }
    .keyword-analysis-value.eq { color: #333; }
    .keyword-analysis-value.up::after { display: inline-block; content: '▲'; }
    .keyword-analysis-value.dn::after { display: inline-block; content: '▼'; }
    .keyword-analysis-value.eq::after { display: inline-block; content: '－'; }
    .keyword-analysis-rank > *:nth-child(2) { background: #f3f4f7; padding: 0.3rem; }
    .keyword-analysis-rank { background-color: #021e2f !important; font-weight: bold; }
    .keyword-analysis-rank1 { background-color: #0097dc !important; }
    .keyword-analysis-rank2 { background-color: #005abb !important; }
    .keyword-analysis-rank3 { background-color: #00539f !important; }
    .keyword-analysis-rank4 { background-color: #003b6a !important; }
    .keyword-analysis-rank5 { background-color: #002b46 !important; }
    .keyword-analysis-rank0 { background-color: #343735; !important }
    `);

    Handlebars.registerHelper('toFixed_2', (v) => v.toFixed(2));

    const uri = new URL(location.href), params = Object.fromEntries(uri.searchParams.entries());
    const blogId = params.blogId; if(!blogId) return;
    const blog = await request_blog(blogId, 'BlogInfo'); if(!blog || !blog.blogOwner) return;
    await draw(blogId);
    setInterval(() => draw(blogId), 1000 * 60 * 30);
});