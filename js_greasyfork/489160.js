// ==UserScript==
// @name         Asobi Official-Comment Collector
// @version      0.1.1
// @description  Copy offical comment to copied chat board in Asobistage
// @author       Backspe
// @match        https://asobistage.asobistore.jp/event/*
// @grant        none
// @namespace https://greasyfork.org/users/1271019
// @downloadURL https://update.greasyfork.org/scripts/489160/Asobi%20Official-Comment%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/489160/Asobi%20Official-Comment%20Collector.meta.js
// ==/UserScript==

(function () {
  var SCRIPTNAME = 'AsobiOfficialCommentCollector';

  var site = {
    getViewer: () => document.querySelector('[class^=style_commentViewer__]') || document.querySelector('[class^=CommentViewer_commentViewer__]') ,
    getNewViewer: () => document.querySelector('[id^=newViewer]'),
    getBoard: (viewer) => viewer.querySelector('[class^=CommentViewer_commentList__] > div:nth-child(1) > div > div') || viewer.querySelector("div[class^='style_commentList__'] > div:nth-child(1) > div > div"), /*live || archive*/
    getScroller: (viewer) => viewer.querySelector('[class^=CommentViewer_commentList__] > div:nth-child(1)') || viewer.querySelector("div[class^='style_commentList__'] > div:nth-child(1)"), /*live || archive*/
    getCommentIndex: (node) => node.getAttribute("data-index") || getComputedStyle(node).top.slice(0,-2), /*archive || live*/
    getCommentIsOfficial: (node) => (node.querySelector('[class^=CommentViewer_item__]') || node.querySelector('[class^=style_item__]')).getAttribute("data-official"),
    getComment: (node) => node.querySelector('[class^=CommentViewer_item_comment__]') || node.querySelector('[class^=style_item_comment__]'), /*live || archive*/
  };
  /* getViewer: 코멘트 구역 전체
   * getBoard : 실제로 갱신되는 코멘트의 바로 상위 구역
   * getScroller : 신규 공식 코멘트가 나올때 스크롤을 맨 아래로 내리기 위한 스크롤구역
   * getCommentIndex: 코멘트의 인덱스
   * getCommentIsOfficial: 코멘트가 공식코멘트인지 여부('true' or 'false')
   * getComment: 코멘트 노드
   */
  var screen, board, context, lines = [], fontsize, scrollCommentsTimer,commentObserver;
  var originalViewer, newViewer, newBoard, scroller;
  var viewedIndex = -1; /* 이전 코멘트 번호를 기록 */
  var core = {
    /* DOM 초기화 기다리기 & 변화 감지 */
    waitStart() {
      window.setInterval(function () {
        var viewer_ = site.getViewer();
        var board_ = site.getBoard(viewer_);
        if (board_ && viewer_ && (viewer_ != originalViewer || board_ != board)) {
          originalViewer = viewer_
          board = board_;
          core.initialize();
        }
      }, 3000);
    },
    initialize() {
      /* 코멘트창을 복사해서 생성하고 같이 복사된 비공식 코멘트를 삭제 */
      console.debug('init중');
      console.debug(originalViewer);
      newViewer = site.getNewViewer();
      console.debug(newViewer);
      if (newViewer == null) {
          newViewer = originalViewer.cloneNode(true);
          viewedIndex = -1;
          newViewer.id = 'newViewer';
          originalViewer.after(newViewer);
          scroller = site.getScroller(newViewer);
          newBoard = site.getBoard(newViewer);
          for (let i = newBoard.childNodes.length - 1; i >= 0; i--) {
              let child = newBoard.childNodes[i];
              let isOfficial = site.getCommentIsOfficial(child);
              if (isOfficial == 'false') {
                  newBoard.removeChild(child);
              }
          }
      }
      console.log(board);
      console.log(newBoard);
      core.listenComments();
    },
    /* 코멘트 추가를 감지 */
    listenComments() {
      if (commentObserver) {
        commentObserver.disconnect()
      }
      commentObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(function (node) {
              const currentIndex = Number(site.getCommentIndex(node));
              const isOfficial = site.getCommentIsOfficial(node);
              if (currentIndex > viewedIndex && isOfficial == 'true') {
                // 코멘트를 아래 보드로 복사
                console.log(node);
                core.copyComment(node);
                if (currentIndex == 999 && viewedIndex == -1) {
                  // 첫번째 코멘트의 인덱스가 999가 되는 경우가 있다고 함
                  viewedIndex = 0;
                } else {
                  viewedIndex = currentIndex;
                }
              }
            });
          }
        });
      })
      commentObserver.observe(board, { childList: true });
    },
    copyComment(node) {
        // 코멘트 노드를 그대로 복사해서 신규 채팅창에 추가
        const newComment = node.cloneNode(true);
        newBoard.appendChild(newComment)
        newBoard.style.visibility='visible'
        // 새 코멘트가 올라올 때마다 스크롤을 자동으로 맨 아래로
        // TODO 옵션으로 빼거나 스크롤 버튼 사용해야 함
        scroller.scrollTop = scroller.scrollHeight;
    },
  };
  core.waitStart();
})();
