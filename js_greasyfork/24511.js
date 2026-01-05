// ==UserScript==
// @name        ニコニコ動画 コメント非表示
// @namespace   ncode
// @match       https://www.nicovideo.jp/watch/*
// @version     14
// @description ニコニコ動画のコメントをデフォルトで非表示にするスクリプトです
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24511/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/24511/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
let comment_close_timer;
let check_comment_close = function(){
    let comment_close_count = 0;
    comment_close_timer = setInterval(function(){
        comment_close_count++;
        if (comment_close_count > 6) {
            clearInterval(comment_close_timer);
        }
        try {
            let buttons = document.getElementsByClassName('cursor_pointer');
            for(let i = 0;buttons.length;i++) {
                if (buttons[i].getAttribute('aria-label') == 'コメントを非表示にする') {
                    buttons[i].click();
                    break;
                } else if (buttons[i].getAttribute('aria-label') == 'コメントを表示する') {
                    break;
                }
            }
        } catch(e) {
        }
    }, 500);
}
check_comment_close();
let comment_close_href = location.href;
let comment_close_observer = new MutationObserver(function(mutations) {
  if(comment_close_href !== location.href) {
      comment_close_href = location.href;
      if (comment_close_timer) {
          clearInterval(comment_close_timer);
      }
      check_comment_close();
  }
});
comment_close_observer.observe(document, { childList: true, subtree: true });