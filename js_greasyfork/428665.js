// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 공감수 순위 어드밴스드
// @description  네이버 블로그의 공감수 순위 기능을 확장합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.0
// @author       Won Choi
// @connect      naver.com
// @match        https://blog.stat.naver.com/blog/rank/like*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/lib/naver-blog-content.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/lib/naver-blog-content-like.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.31/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428665/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B3%B5%EA%B0%90%EC%88%98%20%EC%88%9C%EC%9C%84%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428665/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B3%B5%EA%B0%90%EC%88%98%20%EC%88%9C%EC%9C%84%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  moment.tz.setDefault("Asia/Seoul");
  GM_donation('.u_ni_stats_detail_wrap');
  const tmpl = Handlebars.compile(`
  <!DOCTYPE HTML>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.2/css/bootstrap.min.css" integrity="sha512-usVBAd66/NpVNfBge19gws2j6JZinnca12rAe2l+d+QkLU9fiG02O1X8Q6hepIpr/EYKZvKx/I9WsnujJuOmBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <style>.loading { pointer-events: none; opacity: 0.5; }</style>
      <title>네이버 블로그 공감수 순위 어드밴스드</title>
    </head>
    <body>
      <script>
        function form_update(form) {
          const { sdate, edate } = form;
          window.opener.postMessage({ action: 'kr.myso.tampermonkey.com.naver.blog.manage.likes.update', sdate: sdate.value, edate: edate.value }, '*');
        }
      </script>
      <form onsubmit="form_update(this); return false;">
        <div class="input-group mb-3">
          <input type="date" class="form-control" name="sdate" value="{{{sdate}}}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-search">
          <input type="date" class="form-control" name="edate" value="{{{edate}}}" placeholder="" aria-label="Example text with button addon" aria-describedby="button-search">
          <button class="btn btn-outline-secondary" type="submit" id="button-search">검색</button>
        </div>
      </form>
      {{#each items}}
      <div class="border-bottom">
        <table class="table table-striped mb-2">
          <thead>
            <tr>
              <th>게시물 제목</th>
              <th class="text-end">공감수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="{{{uri}}}" rel="noreferrer" target="_blank">{{title}}</a></td>
              <td class="text-end">{{likes.length}}건</td>
            </tr>
          </tbody>
        </table>
        <div class="d-grid gap-2 mb-2">
          <button class="btn btn-sm btn-secondary" type="button" onclick="this.nextElementSibling.classList.toggle('d-none')">공감 펼치기/접기</button>
          <table class="table table-striped d-none">
            <thead>
              <th>사용자</th>
              <th class="text-end">공감날짜</th>
            </thead>
            <tbody>
              {{#each likes}}
              <tr>
                <td><a href="https://blog.naver.com/{{{userId}}}" rel="noreferrer" target="_blank">{{{userNickName}}} ({{userId}})</a></td>
                <td class="text-end">{{addDate}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
        <div class="d-grid gap-2 mb-2">
          <button class="btn btn-sm btn-secondary" type="button" onclick="this.nextElementSibling.classList.toggle('d-none')">통계 펼치기/접기</button>
          <table class="table table-striped d-none">
            <thead>
              <th>날짜</th>
              <th class="text-end">순위</th>
              <th class="text-end">공감수</th>
            </thead>
            <tbody>
              {{#each stats}}
              <tr>
                <td>{{date}}</td>
                <td class="text-end">{{rank}}위</td>
                <td class="text-end">{{{event}}}건</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
      </div>
      {{/each}}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.2/js/bootstrap.bundle.min.js" integrity="sha512-72WD92hLs7T5FAXn3vkNZflWG6pglUDDpm87TeQmfSg8KnrymL2G30R7as4FmTwhgu9H7eSzDCX3mjitSecKnw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    </body>
  </html>
  `);
  window.addEventListener('message', (e)=>{
      if(e.origin !== location.origin) return;
      const { data } = e, { action, sdate, edate } = data;
      if(action != 'kr.myso.tampermonkey.com.naver.blog.manage.likes.update') return;
      update(edate, sdate);
  });
  function deformat(date) {
      if(date.includes('분 전')) return moment().subtract(parseInt(date), 'minutes').format('YYYY-MM-DD');
      if(date.includes('시간 전')) return moment().subtract(parseInt(date), 'hours').format('YYYY-MM-DD');
      return moment(date, 'YYYY.MM.DD').format('YYYY-MM-DD');
  }
  async function popup(data) {
      const html = tmpl(data);
      const blob = new Blob([html], { type: 'text/html' });
      const blob_url = URL.createObjectURL(blob);
      window.open(blob_url, 'kr.myso.tampermonkey.com.naver.blog.manage.likes', 'width=1024, height=960');
  }
  async function update(edate, sdate) {
      sdate = moment(sdate).format('YYYY-MM-DD');
      edate = moment(edate).format('YYYY-MM-DD');
      const user = await NB_blogInfo('', 'BlogUserInfo'); if(!user || !user.userId) return alert('오류: 사용자 정보를 알 수 없습니다.');
      const blog = await NB_blogInfo(user.userId, 'BlogInfo'); if(!blog || !blog.blogId) return alert('오류: 블로그 정보를 알 수 없습니다.');
      const diff = moment(edate).diff(sdate, 'days') || 1;
      const range = _.range(diff).map(i=>moment(edate).subtract(i, 'days').format('YYYY-MM-DD'));
      const stats = await Promise.map(range, async (date)=>({ date, stat: await NB_blogStat['순위']['공감수'](blog.blogId, date) }), { concurrency: 10 });
      const group = _.orderBy(_.map(_.groupBy(stats.map(item=>item.stat.rankLike).flat(), 'uri'), (stats)=>({ ..._.head(stats), event: _.sumBy(stats, 'event'), stats })), 'event', 'desc');
      const likes = await Promise.map(group, async (item)=>(item.likes = await NB_blogPostLikesAll(blog.blogId, _.last(item.uri.split('/'))), item), { concurrency: 10 });
      const items = likes.map(item=>(item.likes = item.likes.map(o=>(o.addDate = deformat(o.addDate), o)).filter(o=>range.includes(moment(o.addDate).format('YYYY-MM-DD'))), item));
      return popup({ sdate, edate, items });
  }
  await update();
})