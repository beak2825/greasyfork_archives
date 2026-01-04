
// ==UserScript==
// @name        Bingosync Treasure Hunt
// @namespace   Violentmonkey Scripts
// @description Adds Treasure Hunt scoring, and a right click mode that uses all 4 corners of each square.
// @match       https://bingosync.com/room/*
// @version     0.0.2
// @author      bmn
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439002/Bingosync%20Treasure%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/439002/Bingosync%20Treasure%20Hunt.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "#bingo .square .star{font-size:150%;position:absolute;transition:.2s ease-out 0s;width:30px}#bingo .square:hover .star{transform:scale(1.3)}#bingo .square .star.tr{right:0;top:0}#bingo .square .star.bl{bottom:0;left:0}#bingo .square .star.bl.txtoutline{text-shadow:1px 1px #000,-1px 1px #000,1px -1px #000,-1px -1px #000}#bingo .square .star.br{bottom:0;right:0}";

function activateRightClicks() {
  const blVariants = ['', '✔️', '❌', '0', '1', '2', '3', '4', '5', '6', '7', '8'];
  const elements = '<div class="star tl starred hidden"></div><div class="star tr hidden">💰</div><div class="star bl" data-variant="0"></div><div class="star br hidden">💥</div>';
  const squares = $('#bingo .square');
  squares.append(elements);
  squares.off('contextmenu').on('contextmenu', e => {
    const el = $(e.currentTarget);
    const off = el.offset();
    const offY = e.pageY - off.top;
    const offX = e.pageX - off.left;
    const classY = offY / el.height() < 0.5 ? 't' : 'b';
    const classX = offX / el.width() < 0.5 ? 'l' : 'r';
    const className = `.star.${classY}${classX}`;
    const starEl = $(el).children(className);

    if (className !== '.star.bl') {
      starEl.toggleClass('hidden');
    } else {
      let variant = parseInt(starEl.attr('data-variant'), 10);
      variant = (variant + 1) % 12;
      let hue = 180;

      if (variant > 2) {
        if (variant > 3) {
          const invVariant = 11 - variant; // 7 - (variant - 4)

          hue = 2.4 * invVariant ** 2;
        }

        starEl.addClass('txtoutline');
      } else {
        starEl.removeClass('txtoutline');
      }

      starEl.attr('data-variant', variant);
      starEl.css('color', `hsl(${hue}, 100%, 50%)`);
      starEl.html(blVariants[variant]);
    }

    updateGoalCounters();
    e.preventDefault();
    return false;
  });

  function updateGoalCounters() {
    $('#players-panel').find('.goalcounter').each(function () {
      const colorClass = $(this).attr('class').split(' ')[1];
      $(this).find('.rowcounter').html(`(${getTreasureHuntScore(colorClass)})`);
    });
  }

  PlayersPanel.prototype.updateGoalCounters = function (protoUpdateGoalCounters) {
    return function (...args) {
      const result = protoUpdateGoalCounters.apply(this, args);
      updateGoalCounters();
      return result;
    };
  }(PlayersPanel.prototype.updateGoalCounters);

  function getTreasureHuntScore(colorClass) {
    let myColor = $('#color-chooser').find('.chosen-color').attr('squareColor');
    let completedSquares;
    let positive;
    let negative;
    myColor += 'square';

    if (myColor === colorClass) {
      completedSquares = $('#bingo').find(`.${myColor}`).parent();
      positive = completedSquares.children('.star.bl[data-variant=1]').size();
      negative = completedSquares.children('.star.bl[data-variant=2]').size();
    } else {
      completedSquares = $('#bingo').find(`.${colorClass}`).parent();
      positive = completedSquares.children('.star.tr:not(.hidden)').size();
      negative = completedSquares.children('.star.br:not(.hidden)').size();
    }

    return positive * 2 - negative;
  }
}
function applyCss() {
  document.head.append(VM.m(VM.h("style", null, css_248z)));
}

console.log('Loading Detailed Right Click for BingoSync');
VM.observe(document.body, () => {
  const check = document.querySelector('#slot1 .starred');

  if (check) {
    $('#new-card').after(VM.m(VM.h(VM.Fragment, null, VM.h("div", {
      id: "rightclick-activate",
      class: "btn btn-default"
    }, "Treasure Hunt"))));
    $('#rightclick-activate').click(e => {
      applyCss();
      activateRightClicks();
      $(e.target).hide('slow');
    });
    return true;
  }
});

})();
