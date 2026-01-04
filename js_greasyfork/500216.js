// ==UserScript==
// @name         RisuAI Custom Theme
// @version      2024-07-12
// @description  Custom theme for RIsuAI
// @author       ㅇㅇ
// @match        https://risuai.xyz/
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1331477
// @downloadURL https://update.greasyfork.org/scripts/500216/RisuAI%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/500216/RisuAI%20Custom%20Theme.meta.js
// ==/UserScript==

GM_addStyle(`
#app > main > div.flex-grow.h-full.min-w-0.relative.justify-center.flex > div > div > div > div > div {
  max-width: 800px;
  margin: 0 auto;
}
#app > main > div.flex-grow.h-full.min-w-0.relative.justify-center.flex > div > div > div > div > div > div:first-child {
    position: absolute;
    width: 8rem !important;
    height: 8rem !important;
    transform: translate(-9rem, 0);
}

#app > main > div.flex-grow.h-full.min-w-0.relative.justify-center.flex > div > div > div > div > div > span {
    margin-right: 8rem;
    background-color: var(--risu-theme-darkbg);
    padding: 24px;
    border-radius: 8px;
}
#app > main > div.flex-grow.h-full.min-w-0.relative.justify-center.flex > div > div > div {
    gap: 2rem 0;
}
`);


(function() {
    'use strict';

    // 페이지가 로드된 후 실행될 함수
    function modifyApp() {
        // 애플리케이션에서 필요한 엘리먼트를 찾아서 수정
        const userNameDiv = document.getElementById('theme-user'); // 페르소나 이름 가져오기
        const chatscreenDiv = document.querySelector('#app > main > div.flex-grow.h-full.min-w-0.relative.justify-center.flex > div:nth-child(3) > div');

        if (!userNameDiv || chatscreenDiv.style.backdropFilter != '') {
            return;
        }

        var elements = document.querySelectorAll('.risu-chat'); // 클래스 이름이 risu-chat인 엘리먼트들을 모두 선택

        elements.forEach(function(element) {
            // 엘리먼트에 원하는 변경 작업 수행

            const chatNameDiv = element.querySelector('.chat.text-xl.unmargin');
            if (chatNameDiv && chatNameDiv.innerText == userNameDiv.innerText) { // 페르소나 채팅 박스
                const profileImageDiv = element.querySelector('.shadow-lg.bg-textcolor2.mt-2.rounded-md');
                profileImageDiv.style.cssText = profileImageDiv.style.cssText + 'transform: translate(800px, 0) !important;'

                element.querySelector('.flexium.items-center.chat').style.flexDirection = 'row-reverse';
                element.querySelector('.flex-grow.flex.items-center.justify-end.text-textcolor2').style.justifyContent = 'flex-start';

                element.querySelector('.flex.flex-col.ml-4.w-full.max-w-full.min-w-0').style.marginRight = '0';
                element.querySelector('.flex.flex-col.ml-4.w-full.max-w-full.min-w-0').style.marginLeft = '8rem';
            }

        });
    }

    // 페이지가 로드된 후 실행
    window.onload = function() {
        // 컴포넌트가 마운트된 후 실행되는 함수
        var app = document.getElementById('app');

        if (app) {
            var observer = new MutationObserver(function(mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 애플리케이션에서 엘리먼트를 수정할 수 있는 변화가 있을 때
                        modifyApp();
                    }
                }
            });

            observer.observe(app, { childList: true, subtree: true });

            // 페이지가 로드된 후에도 한 번 실행
            modifyApp();
        }
    };
})();