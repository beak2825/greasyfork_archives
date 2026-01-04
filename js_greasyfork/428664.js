// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 이웃,그룹 관리 어드밴스드
// @description  네이버 블로그의 이웃,그룹 관리 기능을 확장합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.15
// @author       Won Choi
// @connect      naver.com
// @match        *://admin.blog.naver.com/BuddyListManage*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.48/assets/donation.js
// @downloadURL https://update.greasyfork.org/scripts/428664/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EC%9D%B4%EC%9B%83%2C%EA%B7%B8%EB%A3%B9%20%EA%B4%80%EB%A6%AC%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428664/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EC%9D%B4%EC%9B%83%2C%EA%B7%B8%EB%A3%B9%20%EA%B4%80%EB%A6%AC%20%EC%96%B4%EB%93%9C%EB%B0%B4%EC%8A%A4%EB%93%9C.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_donation('.admin_set_buddy');
  GM_addScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js');
  GM_addScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js');
  GM_addScript(() => {
    async function delete_buddy(selfishes) {
      const blogId = new URL(location.href).searchParams.get('blogId') || location.pathname.split('/')[1];
      const uri = new URL('https://admin.blog.naver.com/BuddyDelete.naver');
      const formData = new FormData(); selfishes.map(o=>formData.append('buddyBlogNo', o.blogNo));
      formData.append('blogId', blogId);
      formData.append('on', ''); formData.append('force', 'true');
      await fetch(uri.toString(), { method: 'POST', body: formData });
    }
    window.delete_buddy = delete_buddy;
  })
  GM_addScript(() => {
    async function search_buddy_page(callback, page = 1, results = []) {
      const blogId = new URL(location.href).searchParams.get('blogId') || location.pathname.split('/')[1];
      const res = await fetch(`https://admin.blog.naver.com/BuddyListManage.naver?blogId=${blogId}&currentPage=${page}&searchText=&orderType=adddate`).then(r=>r.text());
      const doc = document.createElement('div'); doc.innerHTML = res;
      const pagination = Array.from(doc.querySelector('div.paginate_re').children), pagenation_last = pagination[pagination.length - 1];
      const has_next = pagenation_last.tagName == 'A' && !!pagenation_last.className, has_next_valid = pagenation_last.tagName != 'STRONG';
      const usernames_rows = Array.from(doc.querySelectorAll('tr a[href*="blog.naver.com"], tr a[href*=".blog.me"]'));
      const usernames = usernames_rows.map(e=>{
        const uri = new URL(e.href);
        const tr = e.closest('tr');
        const group = (() => {
          const el = tr.querySelector('td.groupwrap, td:nth-child(2)');
          return _.trim(el ? el.innerText : '');
        })();
        const type = (() => {
          const el = tr.querySelector('td.type, td:nth-child(3)');
          return _.trim(el ? el.innerText : '');
        })();
        const blogNo = (() => tr.querySelector('td:first-child input').value)();
        const blogId = (() => {
          if(uri.hostname.includes('.blog.me')) return uri.hostname.replace('.blog.me', '');
          if(uri.hostname.includes('blog.naver.com')) return uri.pathname.replace('/', '');
          return uri.hostname;
        })();
        const blogUrl = (() => e.href)();
        const blogName = (() => {
          const el = tr.querySelector('td.buddy a, td:nth-child(4) a');
          return _.trim(el ? el.innerText : blogId);
        })();
        const nickName = (() => {
          const el = tr.querySelector('td.buddy span.nickname, td:nth-child(4) span.nickname');
          return _.trim(el ? el.innerText : blogId);
        })();
        const lastPostAt = (() => {
          const el = tr.querySelector('td:nth-child(6)');
          const date = _.trim(el ? el.innerText : '');
          return /^[\d\.]+$/.test(date) && moment(date, 'YY.MM.DD.').toISOString(true);
        })();
        const createdAt = (() => {
          const el = tr.querySelector('td:nth-child(7)');
          const date = _.trim(el ? el.innerText : '');
          return /^[\d\.]+$/.test(date) && moment(date, 'YY.MM.DD.').toISOString(true);
        })();
        return { blogNo, blogId, blogUrl, blogName, nickName, group, type, lastPostAt, createdAt };
      });
      if(callback) callback(usernames);
      results.push(...usernames);
      return (has_next || has_next_valid) ? search_buddy_page(callback, page+1, results) : results.filter((o,i)=>results.indexOf(o)==i);
    }
    window.search_buddy = search_buddy_page;
  })
  GM_addScript(() => {
    async function search_buddy_me_page(callback, page = 1, results = []) {
      const blogId = new URL(location.href).searchParams.get('blogId') || location.pathname.split('/')[1];
      const res = await fetch(`https://admin.blog.naver.com/BuddyMeManage.naver?relation=all&blogId=${blogId}&currentPage=${page}`).then(r=>r.text());
      const doc = document.createElement('div'); doc.innerHTML = res;
      const pagination = Array.from(doc.querySelector('div.paginate_re').children), pagenation_last = pagination[pagination.length - 1];
      const has_next = pagenation_last.tagName == 'A' && !!pagenation_last.className, has_next_valid = pagenation_last.tagName != 'STRONG';
      const usernames_rows = Array.from(doc.querySelectorAll('tr a[href*="blog.naver.com"], tr a[href*=".blog.me"]'));
      const usernames = usernames_rows.map(e=>{
        const uri = new URL(e.href);
        const tr = e.closest('tr');
        const type = (() => {
          const el = tr.querySelector('td.groupwrap, td:nth-child(3)');
          const followed_type1 = el.querySelector('a > img[alt="서로이웃신청"]') ? '' : '서로이웃'
          const followed_type2 = el.querySelector('a > img[alt="이웃추가"]') ? '' : '이웃'
          return followed_type1 || followed_type2 || '비이웃';
        })();
        const blogNo = (() => tr.querySelector('td:first-child input').value)();
        const blogId = (() => {
          if(uri.hostname.includes('.blog.me')) return uri.hostname.replace('.blog.me', '');
          if(uri.hostname.includes('blog.naver.com')) return uri.pathname.replace('/', '');
          return uri.hostname;
        })();
        const blogUrl = (() => e.href)();
        const blogName = (() => {
          const el = tr.querySelector('td.buddy a, td:nth-child(2) a');
          return _.trim(el ? el.innerText : blogId);
        })();
        const nickName = (() => {
          const el = tr.querySelector('td.buddy span.nickname, td:nth-child(2) span.nickname');
          return _.trim(el ? el.innerText : blogId);
        })();
        const createdAt = (() => {
          const el = tr.querySelector('td.date, td:nth-child(4)');
          const date = _.trim(el ? el.innerText : '');
          return /^[\d\.]+$/.test(date) && moment(date, 'YY.MM.DD.').toISOString(true);
        })();
        return { blogNo, blogId, blogUrl, blogName, nickName, type, createdAt };
      });
      if(callback) callback(usernames);
      results.push(...usernames);
      return (has_next || has_next_valid) ? search_buddy_me_page(callback, page+1, results) : results.filter((o,i)=>results.indexOf(o)==i);
    }
    window.search_buddy_me = search_buddy_me_page;
  })
  GM_addScript(() => {
    const html = `
    <!DOCTYPE html>
    <html ng-app="app">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.0-beta1/css/bootstrap.min.css" integrity="sha512-thoh2veB35ojlAhyYZC0eaztTAUhxLvSZlWrNtlV01njqs/UdY3421Jg7lX0Gq9SRdGVQeL8xeBp9x1IPyL1wQ==" crossorigin="anonymous" />
        <style>.loading { pointer-events: none; opacity: 0.5; }</style>
        <title>네이버 블로그 이웃,그룹 관리 어드밴스드</title>
      </head>
      <body>
        <div ng-controller="main" class="container-fluid">
          <div class="alert alert-info text-center">나를 이웃한 사람 : {{ followers.length }}명 / 내가 이웃한 사람 : {{ following.length }}명</div>
          <div class="p-1">
            <div class="row p-1">
              <div class="col-4">
                <select ng-model="filter.type" class="form-select" aria-label="이웃필터">
                  <option value="전체">전체</option>
                  <option value="서로이웃">서로이웃</option>
                  <option value="나도이웃">나도이웃</option>
                  <option value="나만이웃">나만이웃</option>
                </select>
              </div>
              <div class="col">
                <div class="input-group mb-3">
                  <span class="input-group-text">이웃추가일</span>
                  <input type="date" ng-model="filter.start" class="form-control" aria-label="등록일 시작">
                  <input type="date" ng-model="filter.limit" class="form-control" aria-label="등록일 종료">
                </div>
              </div>
            </div>
            <div class="row p-1">
              <div class="col-4">
                <select ng-model="filter.keywordType" class="form-select" aria-label="키워드 필터 상세">
                  <option value="blogId">아이디</option>
                  <option value="blogName">블로그명</option>
                  <option value="nickName">닉네임</option>
                  <option value="group">그룹명</option>
                </select>
              </div>
              <div class="col">
                <div class="input-group mb-3">
                  <span class="input-group-text">필터링단어</span>
                  <input type="text" ng-model="filter.keyword" placeholder="필터링 할 단어를 검색해주세요." class="form-control" aria-label="키워드 필터">
                </div>
              </div>
            </div>
          </div>
          <div class="p-1">
            <table class="table table-striped" ng-class="{loading: loading}">
              <thead>
                <tr>
                  <th scope="col">그룹명</th>
                  <th scope="col">이웃상태</th>
                  <th scope="col">닉네임 (아이디), 블로그명</th>
                  <th scope="col">최근작성</th>
                  <th scope="col">이웃추가</th>
                  <th scope="col">관리메뉴</th>
                </tr>
              </thead>
              <tbody>
                <tr ng-repeat="user in following | filter_follow:filter:followers">
                  <td>{{ user.group }}</td>
                  <td>{{ user.type }}</td>
                  <td>
                    <div>{{ user.nickName }} ({{user.blogId}})</div>
                    <div><small><a target="_blank" ng-href="{{user.blogUrl}}">{{ user.blogName }}</a></small></div>
                  </td>
                  <td>{{ user.lastPostAt.substr(0, 10) }}</td>
                  <td>{{ user.createdAt.substr(0, 10) }}</td>
                  <td>
                    <button ng-click="remove(user)" class="btn btn-sm btn-warning">삭제</button>
                    <button ng-click="cutout(user)" class="btn btn-sm btn-danger">차단</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js" integrity="sha512-LGXaggshOkD/at6PFNcp2V2unf9LzFq6LE+sChH7ceMTDP0g2kn6Vxwgg7wkPP7AAtX+lmPqPdxB47A0Nz0cMQ==" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/js/bootstrap.bundle.min.js" integrity="sha512-72WD92hLs7T5FAXn3vkNZflWG6pglUDDpm87TeQmfSg8KnrymL2G30R7as4FmTwhgu9H7eSzDCX3mjitSecKnw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.2/angular.min.js" integrity="sha512-7oYXeK0OxTFxndh0erL8FsjGvrl2VMDor6fVqzlLGfwOQQqTbYsGPv4ZZ15QHfSk80doyaM0ZJdvkyDcVO7KFA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>
          const app = angular.module('app', []);
          app.constant('_', window._);
          app.constant('moment', window.moment);
          app.run(($rootScope) => {
            $rootScope._ = window._;
            $rootScope.moment = window.moment;
          })
          app.filter('filter_follow', () => {
            return function(following, filter, followers) {
              return following
              .filter((o) => {
                // filter.start, filter.limit
                const createdAt = new Date(o.createdAt);
                return filter.start <= createdAt && createdAt <= filter.limit;
              })
              .filter((o) => {
                // filter.keywordType && filter.keyword
                const state = o[filter.keywordType];
                return state && state.includes(filter.keyword);
              })
              .filter((o) => {
                // filter.type
                if(filter.type == '전체') return true;
                if(filter.type == '서로이웃') return o.type == '서로이웃';
                if(filter.type == '나도이웃') return o.type == '이웃' && !!followers.find(f=>f.blogId == o.blogId);
                if(filter.type == '나만이웃') return o.type == '이웃' &&  !followers.find(f=>f.blogId == o.blogId);
              });
            }
          });
          app.controller('main', ($scope) => {
            $scope.loading = true;
            $scope.filter = $scope.filter || {}
            $scope.filter.type = '전체';
            $scope.filter.keywordType = 'blogId';
            $scope.filter.keyword = '';
            $scope.filter.start = new Date(1970, 0, 1);
            $scope.filter.limit = new Date();

            $scope.followers = [];
            $scope.following = [];
            document.addEventListener('append.following', (e)=>($scope.following.push(...e.detail.data), $scope.$apply()), false);
            document.addEventListener('append.followers', (e)=>($scope.followers.push(...e.detail.data), $scope.$apply()), false);
            document.addEventListener('append.finish', (e)=>($scope.loading = false, $scope.$apply()), false);

            $scope.remove = async (user) => {
              if(confirm('정말로 이웃을 삭제하시겠습니까. 이 동작은 취소 할 수 없습니다.')) {
                $scope.followers = $scope.followers.filter((o)=>o.blogId != user.blogId);
                $scope.following = $scope.following.filter((o)=>o.blogId != user.blogId);
                await window.opener.delete_buddy([user]);
              }
            };
            $scope.cutout = async (user) => {
              if(confirm('정말로 이웃을 삭제하시겠습니까. 이 동작은 취소 할 수 없습니다.')) {
                $scope.followers = $scope.followers.filter((o)=>o.blogId != user.blogId);
                $scope.following = $scope.following.filter((o)=>o.blogId != user.blogId);
                await window.opener.delete_buddy([user]);
                
                const blogId = new URL(window.opener.location.href).searchParams.get('blogId') || window.opener.location.pathname.split('/')[1];
                const uri = new URL('https://admin.blog.naver.com/BuddyMultiBlockForm.naver?relation=all&currentPage=1');
                uri.searchParams.set('blogId', blogId);
                uri.searchParams.append('targetBlogId', user.blogId);
                
                const html = "<scri"+"pt>window.open('" + uri.toString() + "', 'popupWindow', 'width=330, height=220');</scr"+"ipt>";
                const blob = new Blob([html], { type: 'text/html' });
                const blob_url = URL.createObjectURL(blob);
                window.open(blob_url, 'popupWindow', 'width=330, height=220');
              }
            };
          });
          angular.bootstrap(document, ['app']);
        </script>
      </body>
    </html>
    `;
    const $window = window.open('about:blank', '_buddy_window', 'width=960,height=720');
    setTimeout(async ()=>{
      $window.document.write(html);
      setTimeout(async () => {
        await search_buddy((data) => {
          if($window.closed) throw new Error('closed');
          $window.document.dispatchEvent(new CustomEvent('append.following', { detail: { data } }));
        }).catch(e=>null);
        await search_buddy_me((data) => {
          if($window.closed) throw new Error('closed');
          $window.document.dispatchEvent(new CustomEvent('append.followers', { detail: { data } }))
        }).catch(e=>null);
        $window.document.dispatchEvent(new CustomEvent('append.finish'))
      }, 300);
    }, 300);
  })
});