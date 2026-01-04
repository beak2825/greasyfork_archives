// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 크리에이터 어드바이저 어드밴스드
// @description  네이버 크리에이터 어드바이저에 새로운 기능을 추가합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      2.1.8
// @author       Won Choi
// @connect      naver.com
// @match        *://creator-advisor.naver.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-xmlhttp-request-cors.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/handle-locationchange.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/lib/naver-creator-advisor.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428680/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%96%B4%EB%93%9C%EB%B0%94%EC%9D%B4%EC%A0%80%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428680/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%96%B4%EB%93%9C%EB%B0%94%EC%9D%B4%EC%A0%80%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_donation('#root');
  GM_addStyle(`@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/css/bootstrap-grid.min.css)`);
  GM_addStyle(`@import url(https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/css/bootstrap-utilities.min.css)`);
  GM_addStyle(`.form-control { font-size: 12px; line-height: 24px; background: transparent; border: 1px solid rgba(0,0,0,0.2); } select.form-control { height: 28px; }`);
  Handlebars.registerHelper('select', (selected, options) => options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"'));
  window.addEventListener('locationchange', async function() {
      if(location.pathname != '/') return;
      const uri = new URL(location.href);
      const channels = await CreatorAdvisor.exec('channels');
      await (async function draw() {
          const wrap = document.querySelector('.u_ni_section_wrap');
          const cont = wrap.querySelector('.u_ni_advanced') || document.createElement('div'); cont.classList.add('u_ni_advanced'); wrap.prepend(cont);
          const data = Object.assign({ service: 'naver_blog' }, Object.fromEntries(uri.searchParams));
          data.sdate = data.sdate || moment().subtract(2, 'days').format('YYYY-MM-DD');
          data.edate = data.edate || moment().format('YYYY-MM-DD');
          data.channels = _.uniqBy(channels, 'service');
          data.channel = _.find(data.channels, { service: data.service || 'naver_blog' });
          data.items = data.query && await Promise.map(_.range(moment(data.edate).diff(data.sdate, 'days') + 1).map((o)=>moment(data.edate).subtract(o, 'days').format('YYYY-MM-DD')), async (date) => {
              const params = { service: data.channel.service, channelId: data.channel.channelId, date, keyword: data.query, limit: 20 };
              if(params.service == 'influencer') Object.assign(params, { metric: 'cv', contentType: 'text', interval: 'day' });
              if(params.service == 'naver_blog') Object.assign(params, { metric: 'cv', contentType: 'text', interval: 'day' });
              if(params.service == 'naver_post') Object.assign(params, { metric: 'cv', contentType: 'text', interval: 'day' });
              if(params.service == 'ntv') Object.assign(params, { metric: 'play_count', contentType: 'video', interval: 'day' });
              const contents = await window.CreatorAdvisor.exec('popular-contents', params);
              return { date, data: contents.data }
          });
          data.report = data.items && _.orderBy(_.map(_.groupBy(data.items.map(o=>o.data).flat(), 'channelName'), (items, channelName)=>({ channelName, metricValue: _.sumBy(items, 'metricValue') })), 'metricValue', 'desc').map((o, i)=>Object.assign({ rank: i + 1 }, o));
          cont.innerHTML = Handlebars.compile(`
          <div class="u_ni_ranking_component">
            <form class="u_ni_section_unit u_ni_ranking_component mb-3">
              <div class="u_ni_title_section"><h2 class="u_ni_title">조회수 검색</h2></div>
              <div class="u_ni_desc_section p-3">
                <div class="row mb-3">
                  <div class="col-6"><input class="form-control w-100" type="date" name="sdate" placeholder="시작일" value="{{sdate}}" /></div>
                  <div class="col-6"><input class="form-control w-100" type="date" name="edate" placeholder="종료일" value="{{edate}}" /></div>
                </div>
                <div class="row mb-3">
                  <div class="col-4">
                    <select class="form-control w-100" name="service" style="appearance: auto; -webkit-appearance: auto">
                      {{#each channels}}<option value="{{service}}">{{service}}</option>{{/each}}
                    </select>
                  </div>
                  <div class="col-8"><input class="form-control w-100" type="text" name="query" placeholder="검색할 키워드를 입력해주세요." value="{{query}}" /></div>
                </div>
                <button class="p-2 fs-6 w-100 bg-primary text-white rounded" type="submit">조회하기</button>
              </div>
            </form>
            <div class="u_ni_ranking_main u_ni_section_unit u_ni_ranking_component px-0 mx-1 mb-3">
              <ul class="u_ni_list u_ni_info u_ni_desc_section px-3">
                <li class="u_ni_item"><h3>채널 별 합계</h3></li>
                {{#each report}}
                <li class="u_ni_item">
                  <em class="u_ni_num">{{rank}}</em>
                  <div class="u_ni_info_box">
                    <span class="u_ni_link">
                      <strong class="u_ni_title">{{channelName}}</strong>
                      <p class="u_ni_figure_desc">
                        <span class="u_ni_info_txt u_ni_ico_view">{{metricValue}}</span>
                      </p>
                    </span>
                  </div>
                </li>
                {{else}}
                <li class="u_ni_item">
                  <em class="u_ni_num">?</em>
                  <div class="u_ni_info_box">
                    <span class="u_ni_link">
                      <strong class="u_ni_title">검색결과 찾을 수 없음</strong>
                    </span>
                  </div>
                </li>
                {{/each}}
              </ul>
            </div>
            <div class="u_ni_ranking_main">
              <ul class="u_ni_list u_ni_info">
                {{#each items}}
                <li class="u_ni_item"><h3>{{date}}</h3></li>
                {{#each data}}
                <li class="u_ni_item">
                  <em class="u_ni_num">{{rank}}</em>
                  <div class="u_ni_info_box">
                    <a class="u_ni_link" role="button" tabindex="0" href="{{metaUrl}}" target="_blank" rel="noreferrer">
                      <strong class="u_ni_title">{{title}}</strong>
                      <p class="u_ni_figure_desc">
                        <span class="u_ni_info_txt u_ni_ico_view">{{metricValue}}</span>
                        <span class="u_ni_info_txt">{{channelName}}</span>
                      </p>
                    </a>
                  </div>
                </li>
                {{else}}
                <li class="u_ni_item">
                  <em class="u_ni_num">?</em>
                  <div class="u_ni_info_box">
                    <span class="u_ni_link">
                      <strong class="u_ni_title">검색결과 찾을 수 없음</strong>
                    </span>
                  </div>
                </li>
                {{/each}}
                {{/each}}
              </ul>
            </div>
          </div>
          `)(data);
          Array.from(cont.querySelectorAll('[name="service"] > option')).filter(o=>o.value == data.service).map(o=>o.selected = true);
      })();
  });
})