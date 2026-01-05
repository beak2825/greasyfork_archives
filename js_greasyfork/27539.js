// ==UserScript==
// @name        Nokakin
// @namespace   https://github.com/segabito/
// @description チャンネル動画の検索結果から有料動画を消すやつ
// @include     *://ch.nicovideo.jp/search/*
// @version     2.3.9
// @grant       none
// @license     Public Domain
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/27539/Nokakin.user.js
// @updateURL https://update.greasyfork.org/scripts/27539/Nokakin.meta.js
// ==/UserScript==

(function() {
  var monkey =
  (function() {
    var addStyle = function(styles, id) {
      var elm = document.createElement('style');
      elm.type = 'text/css';
      if (id) { elm.id = id; }

      var text = styles.toString();
      text = document.createTextNode(text);
      elm.appendChild(text);
      var head = document.getElementsByTagName('head');
      head = head[0];
      head.appendChild(elm);
      return elm;
    };

    addStyle(`
      .popular {
        background: #ffc !important;
      }

      .popular2 {
        outline: 2px solid gold !important;
        outline-offset: -4px;
      }

      .popular3 {
        font-weight: bolder !important;
        color: red;
      }

      .contents_list.video.detail .items {
      }
    `.trim(), 'Nokakin');



    var update = function() {
      Array.apply(null, document.querySelectorAll('.ads')).forEach(function(elm) {
        elm.remove();
      });

      //Array.apply(null, document.querySelectorAll('.ppv:not(.member_unlimited_access)')).forEach(function(ppv) {
      Array.apply(null, document.querySelectorAll('.ppv:not(.member_unlimited_access)')).forEach(function(ppv) {
        ppv.closest('.item').remove();
      });

      //Array.apply(null, document.querySelectorAll('.item_right .title')).forEach(function(title) {
      //  var item = title.closest('.item');
      //  var text = title.textContent;
      //  //window.console.log('title:', text, item);
      //  //if (maybeNg.test(text)) {
      //  //  item.style.opacity = 0.5;
      //  //}
      //  //if (ng.test(text)) {
      //  //  item.style.display = 'none';
      //  //}
      //});


      Array.apply(null, document.querySelectorAll('.item .comment var')).forEach(function(elm) {
        var item = elm.closest('.item');
        var numRes = parseInt((elm.textContent || '0').replace(/,/g, ''), 10);
        //window.console.log('numRes:', numRes, item);
        if (numRes < 5) {
          //item.style.display = 'none';
        }
        if (numRes > 1000) {
          item.classList.add('popular');

        }
        if (numRes > 5000) {
          item.classList.add('popular2');
        }
        if (numRes > 10000) {
          item.classList.add('popular2');
          item.classList.add('popular3');
        }
      });
    };

    window.setTimeout(update, 0);

    document.body.addEventListener('AutoPagerize_DOMNodeInserted', update, false);
  }); // end of monkey

  window.setTimeout(monkey, 0);
})();
