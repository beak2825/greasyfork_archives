// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 검색결과 데이터랩 검색어 트렌드
// @description  네이버 검색결과에서 데이터랩의 검색어 트렌드 정보를 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.1
// @author       Won Choi
// @match        *://search.naver.com/search.naver?*
// @match        *://m.search.naver.com/search.naver?*
// @connect      naver.com
// @connect      ryo.co.kr
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/lib/naver-datalab.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/lib/naver-search-ad.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.49/assets/lib/naver-search-nx.js
// @require      https://cdn.jsdelivr.net/npm/chart.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/428688/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%9E%A9%20%EA%B2%80%EC%83%89%EC%96%B4%20%ED%8A%B8%EB%A0%8C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428688/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%9E%A9%20%EA%B2%80%EC%83%89%EC%96%B4%20%ED%8A%B8%EB%A0%8C%EB%93%9C.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    function format_number(number) { return number.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," ); }
    function parsed_number(number) { return /^[\d\.]+$/.test(String(number)) ? parseFloat(number) : 0; }
    GM_donation('#container', 0);
    const range = _.range(32).map(o=>moment().subtract(o + 1, 'days').format('YYYYMMDD')).sort();
    const keyword = (new URL(location.href)).searchParams.get('query'); if(!keyword) return;
    const keyword_search = await Promise.resolve().then(async()=>{
        const stat = await NA_search(keyword);
        const data = await ND_trend(keyword);
        const sums = data.reduce((r, o)=>r+o.value, 0);
        const tick = stat ? (stat.monthlyQcCnt / sums) : 1;
        const items = range.map((period)=>Object.assign({ period, value: 0 }, _.find(data, { period }))).map((item)=>(item.value = (item.value * tick), item));
        return { items, rval: !!stat };
    });
    const keyword_create = await Promise.map(range, async (period)=>{
        const props = await Promise.props({
            blog_count: NX_count(keyword, 'blog', 'normal', { api_type: 1, nso: `so:r,p:from${period}to${period},a:all` }),
            view_count: NX_count(keyword, 'view', 'normal', { api_type: 11, nso: `so:r,p:from${period}to${period},a:all` }),
            cafe_count: NX_count(keyword, 'article', 'normal', { prmore: 1, nso: `so:r,p:from${period}to${period},a:all` }),
        });
        return { period, ...props };
    });
    const pack = document.querySelector('#main_pack, #snb');
    const wrap = pack.querySelector('.section.trend') || document.createElement('section'); wrap.classList.add('section', 'trend'); pack.prepend(wrap);
    const canv = wrap.querySelector('canvas') || document.createElement('canvas'); canv.style.width = '100%'; canv.style.height = '120px'; wrap.append(canv);
    const config = {
        type: 'line',
        data: {
            labels: range,
            datasets: [
                { yAxisID: 'y1', viewtype:'search_cnt', backgroundColor: '#74d2e7', borderColor: '#48a9c5', data: _.map(keyword_search.items, o=>o.value), },
                { yAxisID: 'y2', viewtype:'view_count', backgroundColor: '#52565e', borderColor: '#caccd1', data: _.map(keyword_create, o=>o.view_count), },
                { yAxisID: 'y3', viewtype:'blog_count', backgroundColor: '#279b37', borderColor: '#34bf49', data: _.map(keyword_create, o=>o.blog_count), },
                { yAxisID: 'y3', viewtype:'cafe_count', backgroundColor: '#f48924', borderColor: '#ffc845', data: _.map(keyword_create, o=>o.cafe_count), },
            ],
        },
        options: {
            scales: {
                x: { display: false, },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y2: {
                    type: 'linear',
                    display: false,
                    position: 'left',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                y3: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text(context) {
                        return '검색어 검색/생산/노출 트렌드';
                    }
                },
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label(context) {
                            if(context.dataset.viewtype == 'search_cnt') return (keyword_search.rval) ? `검색량: ${format_number(context.parsed.y.toFixed(0))}회` : `검색율: ${format_number(context.parsed.y.toFixed(2))}%`;
                            if(context.dataset.viewtype == 'view_count') return `노출량: ${format_number(context.parsed.y.toFixed(0))}건 노출 됨`;
                            if(context.dataset.viewtype == 'blog_count') return `블로그: ${format_number(context.parsed.y.toFixed(0))}건 생산 됨`;
                            if(context.dataset.viewtype == 'cafe_count') return `카페: ${format_number(context.parsed.y.toFixed(0))}건 생산 됨`;
                            return '';
                        }
                    }
                }
            },
        }
    };
    const chart = new Chart(canv, config);
})