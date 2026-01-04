// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 포스트 맞구독 검증기
// @description  네이버 포스트에서 맞구독 상태를 검증합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.8
// @author       Won Choi
// @connect      naver.com
// @match        *://post.naver.com/my/followingList*
// @match        *://m.post.naver.com/my/followingList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @downloadURL https://update.greasyfork.org/scripts/428684/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%EB%A7%9E%EA%B5%AC%EB%8F%85%20%EA%B2%80%EC%A6%9D%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428684/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%EB%A7%9E%EA%B5%AC%EB%8F%85%20%EA%B2%80%EC%A6%9D%EA%B8%B0.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
async function search_followers(fromNo = 1, totalCount = 100000000, result = {}) {
    const list = document.getElementById('el_list_container'), ul = list.children[0];
    const loc = new URL(location.href);
    const uri = new URL('https://post.naver.com/my/followerListMore.nhn');
    uri.hostname = location.hostname;
    uri.searchParams.set('lastRowDateTime', Date.now());
    uri.searchParams.set('totalCount', totalCount);
    uri.searchParams.set('followNo', loc.searchParams.get('memberNo'));
    uri.searchParams.set('fromNo', fromNo);
    const resp = await fetch(uri.toString(), { mode: 'cors', credentials: 'include' }).then(resp=>resp.text());
    const json = eval(`(${resp})`), body = document.createElement('div'); body.innerHTML = json.html;
    const data = Array.from(body.querySelectorAll('li.user_info_item')).map((o) => {
        const uri = new URL(o.querySelector('a.user_lnk').href);
        return {
            id: uri.searchParams.get('memberNo'),
            name: o.querySelector('strong.post_tit').innerText,
        };
    });
    result = Object.assign({}, result, json); delete result.html; result.data = result.data || [];
    result.data.push(...data);
    ul.dataset.total = result.data.length;
    return (!json.listCount || !result.nextFromNo) ? result : search_followers(result.nextFromNo, totalCount, result);
}
async function draw(json) {
    draw.timer = clearTimeout(draw.timer);
    draw.timer = setTimeout(() => {
        Array.from(document.body.querySelectorAll('li.user_info_item')).map((o) => {
            const uri = new URL(o.querySelector('a.user_lnk').href);
            const memberNo = uri.searchParams.get('memberNo');
            const nickName = o.querySelector('strong.post_tit').innerText;
            console.log(memberNo, nickName, json.data.find(v => v.id == memberNo || v.name == nickName));
            o.classList.remove('selfishes');
            if(!json.data.find(v=>v.id==memberNo)) o.classList.add('selfishes');
        });
    }, 300);
}
async function main() {
    GM_donation('#el_list_container');
    GM_addStyle(`
    .selfishes { background: #ffd900; }
    .disabled ul { pointer-events: none; position: relative; }
    .disabled ul li { opacity: 0.3; }
    .disabled ul::before { content: '팔로워 목록을 불러오는 중... (총 ' attr(data-total) '명)'; display: block; background: rgba(0,0,0,0.9); color:#ff0; text-align:center; line-height:3rem; }
    `);
    const list = document.getElementById('el_list_container'); list.classList.add('disabled');
    const json = await search_followers(); draw(json); list.classList.remove('disabled');
    document.__createElement = document.__createElement || document.createElement;
    document.createElement = (tagName) => {
        setTimeout(()=>draw(json));
        return document.__createElement(tagName);
    };
    setTimeout(()=>draw(json));
}
function _requestIdleCallback(callback) {
  if(typeof requestIdleCallback == 'undefined') return setTimeout(callback, 1000);
  return requestIdleCallback(callback);
}
function checkForDOM() { return (document.body) ? main() : _requestIdleCallback(checkForDOM); }
_requestIdleCallback(checkForDOM);
