// ==UserScript==
// @name         novelpia shortcut tool
// @namespace    https://greasyfork.org/ko/users/908583
// @version      1.0.3
// @description  편하게 써용, 왼쪽 화살표 이전화, 오른쪽 화살표 다음화, right ctrl 패널 열기, 엔터 추천, 쉬프트 댓글창 +++이거 쓰면 페이지 방식 못 씀 스크롤 쓰세요
// @match        https://novelpia.com/viewer/*
// @icon         https://www.google.com/s2/favicons?domain=novelpia.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444206/novelpia%20shortcut%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/444206/novelpia%20shortcut%20tool.meta.js
// ==/UserScript==

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
            pageload($('#back_epi_auto_url').val(), 1);
            page_back();
            break;
        case 39: // right
            pageload($('#next_epi_auto_url').val(), 1);
            page_next();
            break;
        case 13: // enter
            episode_vote();
            break;
        case 38: // up
            $('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() - 200 }, animation_100);
            break;
        case 40: // down
            $('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() + 200 }, animation_100);
            break;
        case 25: //ctrl
            btn_comment2();
            break;
        case 16: //shift
            navi_view();
            break;
        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};
