// ==UserScript==
// @name          ВКонтакте: синие лайки без реакций
// @description   Скрипт возвращает дух старых синих лайков. Примеры на скриншотах в описании
// @version       1.1.1
// @author        https://vk.me/id222792011
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @namespace     https://greasyfork.org/users/424058
// @icon          https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://vk.com&size=32
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @match         https://vk.com/*
// @run-at        document-start
// @grant         GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/436708/%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%3A%20%D1%81%D0%B8%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D1%80%D0%B5%D0%B0%D0%BA%D1%86%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436708/%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%3A%20%D1%81%D0%B8%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D1%80%D0%B5%D0%B0%D0%BA%D1%86%D0%B8%D0%B9.meta.js
// ==/UserScript==

// with help of
// https://codepen.io/sosuke/pen/Pjoqqp
// https://mybyways.com/blog/convert-svg-to-png-using-your-browser

/* jshint esversion: 6 */

(function() {
  'use strict';

  GM_addStyle([`
    /* поповер с выбором реакции */
    /* мини иконка лайка в поповере списка людей оценивших пост */
    /* иконка реакции на каждой аватарке в списке оценивших */
    div.ReactionsMenuPopper,
    div.like_tt_reaction[style*=background-image][style*=reactions-0],
    div.fans_fanph_reaction[style*=background-image][style*=reactions] {
      display: none;
    }

    /* текст "Нравится" кнопки лайка */
    div.PostButtonReactions__title {
      top: 0 !important;
    }

    /* овальный фон активной кнопки лайка */
    div.PostButtonReactions--active {
      background-color: #e4e8ff !important;
    }

    /* текст активной кнопки лайка */
    div.PostButtonReactions--active div.PostButtonReactions__title {
      color: #4f6989 !important;
    }

    /* красная часть svg иконки кнопки лайка */
    span._like_button_icon g[clip-path] > g[clip-path][transform][opacity] > g[transform][opacity]:nth-of-type(1) {
      filter: brightness(0) saturate(100%) invert(29%) sepia(63%) saturate(4241%) hue-rotate(203deg) brightness(114%) contrast(102%);
    }

    /* png иконка кнопки лайка */
    /* мини иконка лайка в строке количества лайков (над кнопкой лайка) */
    /* иконка вкладки лайков в модалке списка оценивших */
    span._like_button_icon > div.PostButtonReactions__icon[style*=background-image][style*=reactions-0],
    div.ReactionsPreviewItem[style*=background-image][style*=reactions-0],
    span.fans_box_reaction_icon[style*=background-image][style*=reactions-0] {
      background-image: url('https://i.imgur.com/EGWBPoM.png') !important;
    }
  `].join());

  (function likesApiPoller() {
    const Likes = unsafeWindow.Likes;
    const likeBtn = 'div.PostButtonReactions--post';

    if (Likes) {
      document.arrive(likeBtn, { existing: true }, (btn) => {
        let likesFetchTime = null;

        btn.addEventListener('mouseover', () => {
          if (btn.dataset.reactionTargetObject) {
            if (
              likesFetchTime === null ||
              Date.now() - likesFetchTime > 1000 * 10
            ) {
              if (btn.tt && btn.tt.destroy) btn.tt.destroy();

              likesFetchTime = Date.now();
            }

            Likes.showLikes(btn, btn.dataset.reactionTargetObject);
          }
        });
      });
    } else {
      setTimeout(likesApiPoller, 200);
    }
  })();
})();
