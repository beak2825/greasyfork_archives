// ==UserScript==
// @name             AliExpress: hide useless reviews
// @description      Hides user reviews based on likes to dislikes ratio
// 
// @name:ru          AliExpress: скрыть бесполезные отзывы
// @description:ru   Скрывает пользовательские отзывы по соотношению лайков к дизлайкам
// 
// @author           Konf
// @version          1.0.1
// @namespace        https://greasyfork.org/users/424058
// @icon             https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://aliexpress.com&size=32
// @include          /^https:\/\/aliexpress\.ru\/item\/.+/
// @include          /^https:\/\/feedback\.aliexpress\.com\/display\/productEvaluation\.htm.*/
// @require          https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @compatible       Chrome
// @compatible       Opera
// @compatible       Firefox
// @run-at           document-body
// @downloadURL https://update.greasyfork.org/scripts/435876/AliExpress%3A%20hide%20useless%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/435876/AliExpress%3A%20hide%20useless%20reviews.meta.js
// ==/UserScript==

/**
 * Hi! Don't change (or even resave) anything here because
 * by doing this in Tampermonkey you will turn off updates
 * of the script (idk about other script managers). 
 * This could be restored in settings but it might be hard to find,
 * so better to reinstall the script if you're not sure
 */

/* jshint esversion: 6 */
/* global Arrive */

(function() {
  'use strict';

  /**
   * 0 - disabled
   * 1+ - console.warns
   * 2+ - visual stuff
   * 3 - alerts
   */
  const DEBUG_LVL = GM_info.script.version === 'debug' ? 2 : 1;

  // for now most filters are not enabled (see true|false)
  // maybe I will make a settings popup later
  const settings = {
    hide: {
      conditions: {
        likes: {
          lessThan: [1, false], // [value, is enabled by default]
        },
        dislikes: {
          ratioAtLeast: [1.5, true], // i.e. 2👍 3👎 would be removed
        },
      },
    },

    blur: {
      visibility: 0.5,
      conditions: {
        likes: {
          lessThan: [2, false], // 0👍 or 1👍 would be blured
        },
        dislikes: {
          ratioAtLeast: [0.8, true], // 5👍 4👎 would be blured
          amountAtLeast: [12, false], // 150👍 12👎 would be blured
        },
      },
    },
  };

  let scriptSeemsBroken = false;

  if (location.hostname === 'feedback.aliexpress.com') {
    const queries = {
      reviewContainer: 'div.feedback-item',
      num: 'span.thf-digg-num', // like or dislike number inside btn
    };

    const arriveCfg = { existing: true, onceOnly: true };

    document.arrive(queries.num, arriveCfg, (someNumNode) => {
      const observer = new MutationObserver((mutations) => {
        observer.disconnect();

        const reviews = document.body.querySelectorAll(queries.reviewContainer);

        for (const review of reviews) {
          const nums = review.querySelectorAll(queries.num);

          if (nums.length !== 2) {
            debugWarn('Error', 'Seems like html layout was changed');
            continue;
          }

          const [likeNum, dislikeNum] = nums;
          const [likesAmount, dislikesAmount] = [
            Number(likeNum.innerText),
            Number(dislikeNum.innerText),
          ];

          if (isNaN(likesAmount) || isNaN(dislikesAmount)) {
            debugWarn('Warning', 'Got NaN from some number-node');
            continue;
          }

          filterReview(review, likesAmount, dislikesAmount);
        }
      });

      observer.observe(someNumNode, { childList: true });
    });
  } else { // aliexpress.ru
    const queries = {
      reviewContainer: 'div.Reviews_ReviewItem__wrapper__ootd9',
      btnsContainer: 'div.Reviews_HelpfulRatePanel__wrapper__n6sle',
      btn: 'button.ali-kit_Button__outlined__ngexmt',
    };

    const arriveCfg = { existing: true };

    document.arrive(queries.btnsContainer, arriveCfg, (btnsContainer) => {
      if (scriptSeemsBroken) return;

      const buttons = btnsContainer.querySelectorAll(queries.btn);
      const review = btnsContainer.closest(queries.reviewContainer);

      if (buttons.length !== 2 || review === null) {
        return debugWarn('Error', 'Html layout was changed');
      }

      const numRegex = /\d+/;
      const [likeBtn, dislikeBtn] = buttons;
      const [likesAmount, dislikesAmount] = [
        (likeBtn.innerText.match(numRegex) || [])[0],
        (dislikeBtn.innerText.match(numRegex) || [])[0],
      ];

      if (isNaN(likesAmount) || isNaN(dislikesAmount)) {
        return debugWarn('Warning', 'Got NaN from some number-node');
      }

      filterReview(review, likesAmount, dislikesAmount);
    });
  }


  // utils ----------------------------------------------------------

  function cancelScript(debugMsgTitle, text) {
    scriptSeemsBroken = true;
    Arrive.unbindAllArrive();
    debugWarn(debugMsgTitle, text);
  }

  // https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/
  function Pipeline(...middlewares) {
    const stack = middlewares;

    const execute = (context = {}) => {
      let prevIndex = -1;

      const runner = (index) => {
        if (index === prevIndex) {
          throw new Error('next() called multiple times');
        }

        prevIndex = index;

        const middleware = stack[index];

        if (middleware) middleware(context, () => runner(index + 1));
      }

      runner(0);
    }

    return { execute };
  }

  function filterReview(review, likesAmount, dislikesAmount) {
    const pipeline = Pipeline(
      (_, next) => {
        const [
          value, isEnabled
        ] = settings.hide.conditions.likes.lessThan;

        if (isEnabled && likesAmount < value) {
          hideReview(review);
        } else {
          next();
        }
      },

      (_, next) => {
        const [
          value, isEnabled
        ] = settings.hide.conditions.dislikes.ratioAtLeast;
        const dislikesRatio = dislikesAmount / (likesAmount || 1);

        if (isEnabled && dislikesRatio >= value) {
          hideReview(review);
        } else {
          next();
        }
      },


      (_, next) => {
        const [
          value, isEnabled
        ] = settings.blur.conditions.likes.lessThan;
        const blurLvl = settings.blur.visibility;

        if (isEnabled && likesAmount < value) {
          blurReview(review, blurLvl);
        } else {
          next();
        }
      },

      (_, next) => {
        const [
          value, isEnabled
        ] = settings.blur.conditions.dislikes.ratioAtLeast;
        const dislikesRatio = dislikesAmount / (likesAmount || 1);
        const blurLvl = settings.blur.visibility;

        if (isEnabled && dislikesRatio >= value) {
          blurReview(review, blurLvl);
        } else {
          next();
        }
      },

      (_, next) => {
        const [
          value, isEnabled
        ] = settings.blur.conditions.dislikes.amountAtLeast;
        const blurLvl = settings.blur.visibility;

        if (isEnabled && dislikesAmount >= value) {
          blurReview(review, blurLvl);
        } else {
          next();
        }
      },
    );

    pipeline.execute();
  }

  function hideReview(node) {
    if (DEBUG_LVL > 1) {
      node.style.backgroundColor = '#c3c3c3';
    } else {
      node.style.display = 'none';
    }
  }

  function blurReview(node, lvl) {
    node.style.opacity = lvl;
  }

  function debugWarn(title, text) {
    const msg = `${GM_info.script.name}: ${title}.\n\n${text}`;

    if (DEBUG_LVL >= 1) console.warn(msg);
    if (DEBUG_LVL >= 3) alert(msg);
  }

})();
