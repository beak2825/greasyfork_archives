// ==UserScript==
// @name         Humoruniv Reply Reposition
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Reposition the comm_write form.
// @author       십갈
// @match        https://m.humoruniv.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498474/Humoruniv%20Reply%20Reposition.user.js
// @updateURL https://update.greasyfork.org/scripts/498474/Humoruniv%20Reply%20Reposition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf('read.html') === -1) {
        return
    }

    var originalPosition; // 원래 위치를 저장할 변수
    // 초기 위치를 저장하는 함수
    function saveInitialPosition() {
        originalPosition = $('#comm_write').prev();
        // console.log('Initial position and HTML saved');
    }


    // 답글 버튼 클릭 이벤트 핸들러 설정
    $(document).on('click', 'span.comment_body.comm_pd_1 > div > a:nth-child(4)', function() {
        var commentLi = $(this).closest('li[id^="comment_li_"]');
        var num1 = commentLi.attr('id').split('_').pop();
        // console.log('commentLi:', commentLi);

        if (commentLi.length) {
            // name이 sub_comm_block인 요소들을 건너뛰고 위치 조정
            var elements = commentLi.nextAll();
            var lastSkippedElement = null;
            var insertionPoint = null;

            elements.each(function() {
                if ($(this).attr('name') === 'sub_comm_block') {
                    lastSkippedElement = $(this);
                } else {
                    insertionPoint = $(this);
                    return false; // 반복 종료
                }
            });

            // console.log('insertionPoint:', insertionPoint, 'lastSkippedElement:', lastSkippedElement);

            if (insertionPoint) {
                $('#comm_write').insertBefore(insertionPoint);
                // console.log('#comm_write moved before insertionPoint:', insertionPoint);
            } else if (lastSkippedElement) {
                $('#comm_write').insertAfter(lastSkippedElement);
                // console.log('#comm_write moved after lastSkippedElement:', lastSkippedElement);
            } else {
                $('#comm_write').insertAfter(commentLi);
                // console.log('#comm_write moved after commentLi:', commentLi);
            }

            // 특정 행 숨기기
            hideSpecificRows();
        } else {
            // console.error('commentLi not found for num1:', num1);
        }

    });

    // 원래의 scrollIntoView를 저장
    var originalScrollIntoView = Element.prototype.scrollIntoView;

    // scrollIntoView를 비활성화하는 함수
    function disableScrollIntoView() {
        Element.prototype.scrollIntoView = function() {
            // console.log('scrollIntoView disabled');
        };
    }

    // scrollIntoView를 다시 활성화하는 함수
    function enableScrollIntoView() {
        Element.prototype.scrollIntoView = originalScrollIntoView;
        // console.log('scrollIntoView enabled');
    }

    // view_sub_comm_write 함수 대체
    var original_view_sub_comm_write = window.view_sub_comm_write;
    window.view_sub_comm_write = function(num1, num2) {
        disableScrollIntoView();
        try {
            original_view_sub_comm_write.call(this, num1, num2);
        } finally {
            enableScrollIntoView();
        }
    };

    // view_comm_write 함수 대체
    var original_view_comm_write = window.view_comm_write;
    window.view_comm_write = function(string) {
        disableScrollIntoView();
        try {
            if (originalPosition) {
                $('#comm_write').insertAfter(originalPosition);
                // console.log('#comm_write returned to original position');
            }
            original_view_comm_write.call(this, string);
        } finally {
            enableScrollIntoView();
            showSpecificRows();
            document.getElementById('comm_write').scrollIntoView();
        }
    };

    // 초기 위치 저장 호출
    saveInitialPosition();

})();