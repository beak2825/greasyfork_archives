// ==UserScript==
// @name         KNU Timetable Preview Script
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  <수업시간표 및 강의계획서 조회> 페이지에 미리보기 버튼을 추가합니다.
// @author       knurecco
// @icon         https://cdn-icons-png.flaticon.com/512/12571/12571964.png
// @license      MIT
// @match        https://knuin.knu.ac.kr/public/stddm/lectPlnInqr.knu
// @grant        none
// @changelog    모바일 페이지 대응 추가
// @downloadURL https://update.greasyfork.org/scripts/499385/KNU%20Timetable%20Preview%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/499385/KNU%20Timetable%20Preview%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addPreviewButton() {
        var searchButton = document.getElementById('btnSearch');
        var searchButtonMobile = document.getElementById('udcBtns_btnSearch');

        if ((searchButton || searchButtonMobile) && !document.getElementById('newSearchParamButton')) {
            var previewButton = document.createElement('button');
            previewButton.id = 'newSearchParamButton';
            previewButton.innerHTML = '미리보기';
            previewButton.className = "btn btn-secondary preview-btn";
            previewButton.style.marginLeft = '10px';
            previewButton.addEventListener('click', function() {
                if (typeof scwin !== 'undefined' && typeof scwin.searchParamInput === 'function') {
                    scwin.searchParamInput();
                } else {
                    console.error('scwin.searchParamInput function not found');
                }
            });

            if(searchButton){
                //console.log("pc");
                searchButton.parentNode.insertBefore(previewButton, searchButton.nextSibling);
            } else if (searchButtonMobile) {
                //console.log("mobile");
                searchButtonMobile.parentNode.insertBefore(previewButton, searchButtonMobile);
            }
        }
    }
    window.addEventListener('load', addPreviewButton);

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                addPreviewButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
