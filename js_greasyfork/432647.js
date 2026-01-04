// ==UserScript==
// @name          네이버 카페 베스트 게시판 단축키
// @namespace     네이버 카페 베스트 게시판 단축키
// @include       *cafe.naver.com/*
// @version       0.3
// @description   Ctrl + B를 누르면 베스트 게시판으로 이동합니다.
// @icon          data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABWCAIAAADaNPagAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZmY5OTI1NS1hNTU3LTRjY2MtOWNjMi1kN2Q4MWY1OTNkNzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjdCQkZBQUFGNDg5MTFFNTg3NDg4RDAwRUJEQThCNzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjdCQkZBQTlGNDg5MTFFNTg3NDg4RDAwRUJEQThCNzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMkU4REM1MEUzNUExMUU1OTNFQ0Y0NjJCNDJGREZBRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMkU4REM1MUUzNUExMUU1OTNFQ0Y0NjJCNDJGREZBRSIvPiA8L3Jk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
// @author        mickey90427 <mickey90427@naver.com>
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432647/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%B2%A0%EC%8A%A4%ED%8A%B8%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%8B%A8%EC%B6%95%ED%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/432647/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B9%B4%ED%8E%98%20%EB%B2%A0%EC%8A%A4%ED%8A%B8%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%8B%A8%EC%B6%95%ED%82%A4.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function appendIframeUrl() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('?iframe_url=/BestArticleList.nhn')) {
            return;
        }
        const targetUrl = currentUrl + '?iframe_url=/BestArticleList.nhn';
        window.location.href = targetUrl;
    }
 
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            appendIframeUrl();
        }
    });
})();