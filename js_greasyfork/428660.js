// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 PC 통계 플러스 - 통합검색 노출누락 여부 확인
// @description  네이버 블로그 통계에서 네이버 통합검색 노출 여부 확인이 가능한 버튼을 추가해줍니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.12
// @author       Won Choi
// @connect      naver.com
// @match        https://blog.stat.naver.com/blog/article/*/cv
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @downloadURL https://update.greasyfork.org/scripts/428660/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20PC%20%ED%86%B5%EA%B3%84%20%ED%94%8C%EB%9F%AC%EC%8A%A4%20-%20%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%20%EB%85%B8%EC%B6%9C%EB%88%84%EB%9D%BD%20%EC%97%AC%EB%B6%80%20%ED%99%95%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/428660/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20PC%20%ED%86%B5%EA%B3%84%20%ED%94%8C%EB%9F%AC%EC%8A%A4%20-%20%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%20%EB%85%B8%EC%B6%9C%EB%88%84%EB%9D%BD%20%EC%97%AC%EB%B6%80%20%ED%99%95%EC%9D%B8.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#_root', 0);
    GM_addStyle(`
    .u_ni_btn_group {
        position: absolute;
        top: 0;
        right: 0;
    }
    .u_ni_menu_list {
        text-align: center;
        border: 1px solid #ddd;
        *zoom: 1;
    }
    .u_ni_menu_item {
        float: left;
        position: relative;
        margin-left: -1px;
        border-left: 1px solid #ddd;
        background-color: #fff;
    }
    .u_ni_menu_item.u_ni_is_active:before {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        background-color: #00c73c;
    }
    .u_ni_menu_item a {
        position: relative;
        display: inline-block;
        min-width: 48px;
        padding-right: 10px;
        padding-left: 10px;
        color: #888;
        font-size: 12px;
        line-height: 30px;
        letter-spacing: -0.5px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .u_ni_menu_item.u_ni_is_active a {
        color: #fff;
    }
    `);

    const container = document.querySelector('[class^="u_ni_info_section"] > div');
    const group = document.createElement('div'); group.className = 'u_ni_btn_group'; group.style.left = 0; group.style.right = 'auto'; container.appendChild(group);
    const group_inner = document.createElement('div'); group_inner.className = 'u_ni_menu_component u_ni_ext_group'; group.appendChild(group_inner);
    const group_list = document.createElement('ul'); group_list.className = 'u_ni_menu_list'; group_list.role = 'menu'; group_inner.appendChild(group_list);
    const button_wrap_a = document.createElement('li'); button_wrap_a.className = 'u_ni_menu_item u_ni_is_active'; group_list.appendChild(button_wrap_a);
    const button_wrap_b = document.createElement('li'); button_wrap_b.className = 'u_ni_menu_item u_ni_is_active'; group_list.appendChild(button_wrap_b);
    const button_a = document.createElement('a'); button_a.href = '#'; button_a.innerText = '누락확인'; button_wrap_a.appendChild(button_a);
    const button_b = document.createElement('a'); button_b.href = '#'; button_b.innerText = '유사확인'; button_wrap_b.appendChild(button_b);
    function post_info() {
        const el_title = document.querySelector('h3[class^="u_ni_title"], span[class^="u_ni_title"]');
		const el_write = document.querySelector('[class^="u_ni_date"]');
		const tx_title = el_title && el_title.innerText;
		const tx_write = el_write && el_write.innerText;
		const pt_write = /^([0-9]{4}).([0-9]{2}).([0-9]{2})/.exec(tx_write);
		const qr_write = Array.from(pt_write).slice(1, 4).join('');
        return { tx_title, tx_write, qr_write };
    }
    button_a.onclick = function(e) {
        e.preventDefault();
        const info = post_info();
		const uri = new URL('https://search.naver.com/search.naver');
		uri.searchParams.set('sm', 'tab_opt');
		uri.searchParams.set('where', 'nexearch');
		uri.searchParams.set('query', `"${info.tx_title}"`);
        uri.searchParams.set('nso', `so:dd,p:from${info.qr_write}to${info.qr_write},a:all`);
		window.open(uri.toString(), 'u_ni_search');
    }
    button_b.onclick = function(e) {
        e.preventDefault();
        const info = post_info();
		const uri = new URL('https://search.naver.com/search.naver');
		uri.searchParams.set('sm', 'tab_opt');
		uri.searchParams.set('where', 'nexearch');
		uri.searchParams.set('query', `${info.tx_title}`);
		window.open(uri.toString(), 'u_ni_search');
    }
});