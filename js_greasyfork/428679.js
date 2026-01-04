// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 스마트에디터 ONE 뷰포트
// @description  네이버 스마트에디터 ONE에서 다양한 단말기 해상도에 맞게 글을 작성하게 도와줍니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.10
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostWriteForm*
// @match        *://blog.naver.com/PostUpdateForm*
// @match        *://blog.naver.com/*/postwrite*
// @match        *://blog.editor.naver.com/editor*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @downloadURL https://update.greasyfork.org/scripts/428679/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0%20ONE%20%EB%B7%B0%ED%8F%AC%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/428679/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0%20ONE%20%EB%B7%B0%ED%8F%AC%ED%8A%B8.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`
#root { position: relative !important; }
.device_group { position: absolute; left:0; right:0; top:5px; bottom: auto; margin: auto; width: 200px; z-index: 1000000; display: block; }
.device_group > a { display:inline-block; float: left; text-align: center; width: 52px; height: 34px; background-image: url(https://ssl.pstatic.net/static.editor/static/dist/editor/1608280975560/img/sp_editor.png); background-repeat: no-repeat; }
.device_group > a.device_mobile { background-position: -653px -731px; margin-right: 7px; }
.device_group > a.device_mobile.is-active { background-position: -963px -731px; }
.device_group > a.device_tablet { background-position: -777px -731px; margin-right: 7px; }
.device_group > a.device_tablet.is-active { background-position: -715px -731px; }
.device_group > a.device_desktop { background-position: -901px -731px; }
.device_group > a.device_desktop.is-active { background-position: -839px -731px; }
.se-cover-attach-button-container { padding: 0 15px !important; }
.viewport-mobile .se-title-text span { font-size: 26px !important; }
.viewport-mobile .se-canvas > * { min-width: 425px !important; max-width: 425px !important; width: 425px !important; margin: auto !important; }
.viewport-tablet .se-canvas > * { min-width: 750px !important; max-width: 750px !important; width: 750px !important; margin: auto !important; }

    `);
    function handler(e) {
        const container = document.querySelector('#root');
        const group = document.querySelector('.device_group') || document.createElement('div'); group.classList.add('device_group');
        const mobile = document.querySelector('.device_mobile') || document.createElement('a'); mobile.classList.add('device_mobile');
        const tablet = document.querySelector('.device_tablet') || document.createElement('a'); tablet.classList.add('device_tablet');
        const desktop = document.querySelector('.device_desktop') || document.createElement('a'); desktop.classList.add('device_desktop', 'is-active');

        mobile.onclick = () => {
            mobile.classList.add('is-active');
            tablet.classList.remove('is-active');
            desktop.classList.remove('is-active');
            container.classList.remove('viewport-tablet', 'viewport-desktop');
            container.classList.add('viewport-mobile');
        };
        tablet.onclick = () => {
            mobile.classList.remove('is-active');
            tablet.classList.add('is-active');
            desktop.classList.remove('is-active');
            container.classList.remove('viewport-mobile', 'viewport-desktop');
            container.classList.add('viewport-tablet');
        };
        desktop.onclick = () => {
            mobile.classList.remove('is-active');
            tablet.classList.remove('is-active');
            desktop.classList.add('is-active');
            container.classList.remove('viewport-mobile', 'viewport-tablet');
            container.classList.add('viewport-desktop');
        };

        group.appendChild(mobile);
        group.appendChild(tablet);
        group.appendChild(desktop);
        container.appendChild(group);
    }
    handler();
});