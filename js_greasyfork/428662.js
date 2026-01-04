// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 댓글 이용자 분석
// @description  네이버 블로그의 댓글수 순위 이용자 분석 기능을 확장합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.0
// @author       Won Choi
// @connect      naver.com
// @match        https://blog.stat.naver.com/blog/rank/comment*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/lib/naver-blog.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/lib/naver-blog-content.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/lib/naver-blog-content-comment.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.28/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js
// @downloadURL https://update.greasyfork.org/scripts/428662/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EC%9A%A9%EC%9E%90%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428662/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EC%9A%A9%EC%9E%90%20%EB%B6%84%EC%84%9D.meta.js
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
      <title>네이버 블로그 댓글 이용자 분석</title>
    </head>
    <body>
      <script>
        function form_update(form) {
          const { sdate, edate } = form;
          window.opener.postMessage({ action: 'kr.myso.tampermonkey.com.naver.blog.manage.comments.analysis.update', sdate: sdate.value, edate: edate.value }, '*');
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
              <th>작성자</th>
              <th>댓글수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="https://blog.naver.com/{{{profileUserId}}}" rel="noreferrer" target="_blank">{{{userName}}} ({{profileUserId}})</a></td>
              <td>{{comments.length}}건</td>
            </tr>
          </tbody>
        </table>
        <div class="d-grid gap-2 mb-2">
          <button class="btn btn-sm btn-primary" type="button" onclick="this.nextElementSibling.classList.toggle('d-none')">댓글 펼치기/접기</button>
          <table class="table table-striped d-none">
            <thead>
              <th>게시물</th>
              <th>작성시간</th>
              <th>수정시간</th>
              <th>내용</th>
            </thead>
            <tbody>
              {{#each comments}}
              <tr>
                <td><a href="{{{article.uri}}}" rel="noreferrer" target="_blank">{{article.title}}</a></td>
                <td>{{regTime}}</td>
                <td>{{modTime}}</td>
                <td>{{{contents}}}</td>
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
      if(action != 'kr.myso.tampermonkey.com.naver.blog.manage.comments.analysis.update') return;
      update(edate, sdate);
  });
  async function popup(data) {
      const html = tmpl(data);
      const blob = new Blob([html], { type: 'text/html' });
      const blob_url = URL.createObjectURL(blob);
      window.open(blob_url, 'kr.myso.tampermonkey.com.naver.blog.manage.comments.analysis', 'width=1024, height=960');
  }
  async function update(edate, sdate) {
      sdate = moment(sdate).format('YYYY-MM-DD');
      edate = moment(edate).format('YYYY-MM-DD');
      const user = await NB_blogInfo('', 'BlogUserInfo'); if(!user || !user.userId) return alert('오류: 사용자 정보를 알 수 없습니다.');
      const blog = await NB_blogInfo(user.userId, 'BlogInfo'); if(!blog || !blog.blogId) return alert('오류: 블로그 정보를 알 수 없습니다.');
      const diff = moment(edate).diff(sdate, 'days') || 1;
      const range = _.range(diff).map(i=>moment(edate).subtract(i, 'days').format('YYYY-MM-DD'));
      const stats = await Promise.map(range, async (date)=>({ date, stat: await NB_blogStat['순위']['댓글수'](blog.blogId, date) }), { concurrency: 10 });
      const group = _.orderBy(_.map(_.groupBy(stats.map(item=>item.stat.rankComment).flat(), 'uri'), (stats)=>({ ..._.head(stats), event: _.sumBy(stats, 'event'), stats })), 'event', 'desc');
      const cmnts = await Promise.map(group, async (item)=>(item.comments = await NB_blogPostCommentsAll(blog.blogId, blog.blogNo, _.last(item.uri.split('/'))), item), { concurrency: 10 });
      const items = cmnts.map(item=>(item.comments = item.comments.filter(o=>range.includes(moment(o.regTime).format('YYYY-MM-DD'))), item));
      const users = items.map(item=>item.comments.map((cmnt) => (cmnt.article = item, delete cmnt.article.comments, cmnt))).flat();
      const users_group = _.map(_.groupBy(users, 'profileUserId'), (comments) => ({ ..._.pick(_.head(comments), 'lang', 'maskedUserId', 'maskedUserName', 'profileUserId', 'userName', 'userProfileImage', 'userStatus'), comments }));
      const sorts = _.orderBy(users_group, o=>o.comments.length, 'desc');
      return popup({ sdate, edate, items: sorts });
  }
  await update();
})