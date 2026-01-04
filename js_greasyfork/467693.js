// ==UserScript==
// @name         E-Campus href replacement
// @namespace    hjh
// @version      0.1
// @description  온라인강의 하이퍼링크 대치
// @author       You
// @match        http*://ecampus.changwon.ac.kr/course/view.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467693/E-Campus%20href%20replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/467693/E-Campus%20href%20replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceAndRemoveOnclick() {
        // 모든 <a> 태그 선택
        const aTags = document.querySelectorAll("a");

        // 정규식 패턴
        const pattern = /https:\/\/ecampus.changwon.ac.kr\/mod\/vod\/view\.php\?id=/;

        // <a> 태그를 순회하며 href 속성값 변경 및 onclick 속성 삭제
        aTags.forEach(aTag => {
            let href = aTag.href;

            if (pattern.test(href)) {
                href = href.replace(pattern, "https://ecampus.changwon.ac.kr/mod/vod/viewer.php?id=");
                aTag.href = href;
                aTag.removeAttribute("onclick");
                aTag.setAttribute("target", "_blank");
            }
        });
    }

    // 함수 호출
    replaceAndRemoveOnclick();

})();