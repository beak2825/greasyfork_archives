// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 통계 지표 다운로드 플러스
// @description  네이버 블로그 통계의 지표 다운로드 기능을 개선하여 줍니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.13
// @author       Won Choi
// @connect      naver.com
// @match        *://admin.blog.naver.com/*/stat/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/428659/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%ED%86%B5%EA%B3%84%20%EC%A7%80%ED%91%9C%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%ED%94%8C%EB%9F%AC%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/428659/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%ED%86%B5%EA%B3%84%20%EC%A7%80%ED%91%9C%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%ED%94%8C%EB%9F%AC%EC%8A%A4.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('.l__container');
    GM_addStyle("@import url('https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.css')");
    moment.tz.setDefault("Asia/Seoul");
    async function download() {
        const edate = moment().day(-6).toDate();
        const range = _.range(15).map(o=>moment(edate).subtract(o, 'weeks').toISOString(true));
        const range_date = _.range(7 * 15).map(o=>moment(edate).subtract(o - 6, 'days').toISOString(true));
        const sdate = _.minBy(range, o=>moment(o).toDate());
        const xlsx = XLSX.utils.book_new();
        const xlsx_name = `블로그통계분석_${user.nickname}_${user.userId}_${moment(sdate).format('YYYY-MM-DD')}~${moment(edate).format('YYYY-MM-DD')}.xlsx`
        // 방문분석
        {
            Toastify({ text: `방문 통계 데이터 가져오는 중...`, }).showToast();
            const data_view = await NB_blogStat['방문분석'](user.userId, edate, 'WEEK');
            const xlsx_sheet_name = `방문`;
            const xlsx_sheet_data = [];
            {
                xlsx_sheet_data.push(['■ 방문통계 요약']);
                const cv_sum = _.sumBy(data_view['조회수']['cv'], 'total').toFixed(0);
                const cv_avg = _.meanBy(data_view['조회수']['cv'], 'total').toFixed(0);
                const uv_sum = _.sumBy(data_view['순방문자수']['uv'], 'total').toFixed(0);
                const uv_avg = _.meanBy(data_view['순방문자수']['uv'], 'total').toFixed(0);
                const rv_sum = _.sumBy(data_view['재방문율']['revisit'], 'total').toFixed(0);
                const rv_avg = _.meanBy(data_view['재방문율']['revisit'], 'total').toFixed(0);
                const rvp_avg = _.meanBy(data_view['재방문율']['revisit'], 'total_p').toFixed(2);
                const visit_sum = _.sumBy(data_view['방문횟수']['visit'], 'visit').toFixed(0);
                const visit_avg = _.meanBy(data_view['방문횟수']['visit'], 'visit').toFixed(0);
                const av_avg = _.meanBy(data_view['평균방문횟수']['averageVisit'], 'total').toFixed(2);
                const ad_avg = _.meanBy(data_view['평균사용시간']['averageDuration'], 'total').toFixed(2);
                xlsx_sheet_data.push(['', '조회수', '순방문자수', '재방문수', '재방문율 (%)', '방문횟수', '평균방문횟수', '평균사용시간 (초)']);
                xlsx_sheet_data.push(['평균', cv_avg, uv_avg, rv_avg, rvp_avg, visit_avg, av_avg, ad_avg]);
                xlsx_sheet_data.push(['합계', cv_sum, uv_sum, rv_sum, '-', visit_sum, '-', '-']);
            }
            xlsx_sheet_data.push([]);
            // 표
            {
                xlsx_sheet_data.push(['■ 방문통계 주차별 통계']);
                xlsx_sheet_data.push(['날짜', '조회수', '순방문자수', '재방문수', '재방문율 (%)', '방문횟수', '평균방문횟수', '평균사용시간 (초)']);
                xlsx_sheet_data.push(...Array.from(range).map((item) => {
                    const data = [];
                    const date = moment(item).format('YYYY-MM-DD');
                    data.push(date);
                    data.push(_.get(_.find(data_view['조회수']['cv'], { date }), 'total', 0).toFixed(0));
                    data.push(_.get(_.find(data_view['순방문자수']['uv'], { date }), 'total', 0).toFixed(0));
                    data.push(_.get(_.find(data_view['재방문율']['revisit'], { date }), 'total', 0).toFixed(0));
                    data.push(_.get(_.find(data_view['재방문율']['revisit'], { date }), 'total_p', 0).toFixed(2));
                    data.push(_.get(_.find(data_view['방문횟수']['visit'], { date }), 'visit', 0).toFixed(0));
                    data.push(_.get(_.find(data_view['평균방문횟수']['averageVisit'], { date }), 'total', 0).toFixed(2));
                    data.push(_.get(_.find(data_view['평균사용시간']['averageDuration'], { date }), 'total', 0).toFixed(2));
                    return data;
                }));
            }
            const xlsx_sheet =  XLSX.utils.aoa_to_sheet(xlsx_sheet_data);
            XLSX.utils.book_append_sheet(xlsx, xlsx_sheet, xlsx_sheet_name);
        }
        // 사용자분석
        {
            Toastify({ text: `이웃 통계 데이터 가져오는 중...`, }).showToast();
            const data_user = await NB_blogStat['사용자분석'](user.userId, edate, 'WEEK');
            const xlsx_sheet_name = `이웃`;
            const xlsx_sheet_data = [];
            {
                xlsx_sheet_data.push(['■ 이웃 증감 현황']);
                xlsx_sheet_data.push(['날짜', '서로이웃', '이웃추가', '이웃삭제']);
                xlsx_sheet_data.push(...Array.from(range).map((item) => {
                    const data = [];
                    const date = moment(item).format('YYYY-MM-DD');
                    data.push(date);
                    data.push(_.get(_.find(data_user['이웃증감수']['relationDelta'], { date }), 'friend', '-'));
                    data.push(_.get(_.find(data_user['이웃증감수']['relationDelta'], { date }), 'add', '-'));
                    data.push(_.get(_.find(data_user['이웃증감수']['relationDelta'], { date }), 'delete', '-'));
                    return data;
                }));
            }
            xlsx_sheet_data.push([]);
            {
                xlsx_sheet_data.push(['■ 이웃 방문 현황']);
                xlsx_sheet_data.push(['날짜', '조회수:전체', '순방문자수:전체', '조회수:서로이웃', '순방문자수:서로이웃', '조회수:이웃', '순방문자수:이웃', '조회수:기타', '순방문자수:기타']);
                xlsx_sheet_data.push(...Array.from(range).map((item) => {
                    const data = [];
                    const date = moment(item).format('YYYY-MM-DD');
                    data.push(date);
                    data.push(_.get(_.find(data_user['이웃방문현황']['조회수']['relationVisit'], { date }), 'total', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['순방문자수']['relationVisit'], { date }), 'total', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['조회수']['relationVisit'], { date }), 'friend', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['순방문자수']['relationVisit'], { date }), 'friend', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['조회수']['relationVisit'], { date }), 'follow', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['순방문자수']['relationVisit'], { date }), 'follow', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['조회수']['relationVisit'], { date }), 'etc', '-'));
                    data.push(_.get(_.find(data_user['이웃방문현황']['순방문자수']['relationVisit'], { date }), 'etc', '-'));
                    return data;
                }));
            }
            const xlsx_sheet =  XLSX.utils.aoa_to_sheet(xlsx_sheet_data);
            XLSX.utils.book_append_sheet(xlsx, xlsx_sheet, xlsx_sheet_name);
        }
        // 유입분석
        {
            function get_search_query(url) {
                try {
                    const uri = new URL(url);
                    if(uri.searchParams.has('topReferer')) { return get_search_query(uri.searchParams.get('topReferer')) };
                    if(uri.searchParams.has('proxyReferer')) { return get_search_query(uri.searchParams.get('proxyReferer')) };
                    return uri.searchParams.get('query') || uri.searchParams.get('q');
                } catch(e) {}
            }
            Toastify({ text: `유입 통계 데이터 가져오는 중...`, }).showToast();
            const xlsx_sheet_name = `유입`;
            const xlsx_sheet_data = [];
            {
                xlsx_sheet_data.push(['날짜', '도메인', '키워드', '경로', '유입수', '유입률 (%)']);
                const data_init = await Promise.map(range_date, async (date) => await NB_blogStat['사용자분석']['유입분석']['전체'](user.userId, date, 'DATE'));
                const data_view = await Promise.map(data_init, async (item) => {
                    const data = await Promise.map(item['refererTotal'], async (item) => {
                        const resp = await NB_blogStat['사용자분석']['유입분석']['전체']['상세'](user.userId, item.date, 'DATE', { searchEngine: item.referrerSearchEngine, refererDomain: item.referrerDomain }).catch(e=>null);
                        const data = (resp && resp['refererDetail']) || [];
                        return data.map((o)=>Object.assign({}, item, o)).flat();
                    });
                    return data.flat();
                });
                data_view.flat().map((item)=>{
                    if(!item.searchQuery) item.searchQuery = get_search_query(item.referrerUrl);
                    xlsx_sheet_data.push([item.date, item.referrerDomain, item.searchQuery, item.referrerUrl, item.cv, item.cv_p])
                });
            }
            const xlsx_sheet =  XLSX.utils.aoa_to_sheet(xlsx_sheet_data);
            XLSX.utils.book_append_sheet(xlsx, xlsx_sheet, xlsx_sheet_name);
        }
        // 순위분석
        {
            Toastify({ text: `게시물 통계 데이터 가져오는 중...`, }).showToast();
            const xlsx_sheet_name = `게시물`;
            const xlsx_sheet_data = [];
            const data_rank = await Promise.map(range, async (date) => { const resp = await NB_blogStat['순위']['조회수']['게시물'](user.userId, date, 'WEEK'); return resp.rankCv; });
            const data_rank_articles_kv = _.mapValues(_.groupBy(data_rank.filter(v=>!!v).flat(), 'uri'), (items) => {
                const stats = Array.from(range).map((item) => {
                    const date = moment(item).format('YYYY-MM-DD');
                    const defs = _.assign({}, items[0], { cv: 0, rank: 0, date });
                    const data = _.find(items, { date });
                    return data || defs;
                });
                stats.cv_avg = _.meanBy(stats, 'cv');
                stats.cv_sum = _.sumBy(stats, 'cv');
                stats.rank_avg = _.meanBy(stats, 'rank');
                return stats;
            });
            const data_rank_articles = _.orderBy(_.map(data_rank_articles_kv, (items, uri)=>(items.uri = uri, items.title = _.get(items, '[0].title', '-'), items)), ['cv_sum', 'rank_avg'], ['desc', 'asc']);
            data_rank_articles.cv_avg = _.meanBy(data_rank_articles, 'cv_avg').toFixed(2);
            data_rank_articles.cv_sum = _.sumBy(data_rank_articles, 'cv_sum').toFixed(0);

            xlsx_sheet_data.push(['날짜', '주소', '제목', '순위', '전체 누적 조회수', '주간 평균 조회수', '주간 누적 조회수']);
            data_rank_articles.map((item) => {
                item.map((data) => xlsx_sheet_data.push([data.date, item.uri, item.title, data.rank, item.cv_sum, item.cv_avg, data.cv]));
            });
            const xlsx_sheet =  XLSX.utils.aoa_to_sheet(xlsx_sheet_data);
            XLSX.utils.book_append_sheet(xlsx, xlsx_sheet, xlsx_sheet_name);
        };
        //XLSX 저장
        const xlsx_opts = { bookType:'xlsx', bookSST:false, type:'array' };
        const xlsx_blob = XLSX.write(xlsx, xlsx_opts);
        saveAs(new Blob([xlsx_blob],{type:"application/octet-stream"}), xlsx_name);
        Toastify({ text: `저장 완료`, }).showToast();
    }
    const user = await NB_blogInfo('', 'BlogUserInfo'); if(!user) return;
    const wrap = document.querySelector('#nav.lnb__local-menu'); if(!wrap) return;
    const cont = wrap.querySelector('.lnb__download') || document.createElement('div'); cont.classList.add('lnb__depth1', 'lnb__download'); wrap.append(cont);
    const link = cont.querySelector('.lnb__title') || document.createElement('a'); link.classList.add('lnb__title'); link.textContent = '지표 다운로드 플러스'; cont.append(link);
    cont.addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        download();
    });
});