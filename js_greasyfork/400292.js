// ==UserScript==
// @name         時間調整ボタンを追加 [Typing Tube]
// @namespace    https://greasyfork.org/users/500559
// @version      0.1.1
// @description  Typing Tubeの編集画面にて各行に時間調整ボタンを追加
// @author       ஐ
// @match        https://typing-tube.net/movie/edit*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400292/%E6%99%82%E9%96%93%E8%AA%BF%E6%95%B4%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%20%5BTyping%20Tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/400292/%E6%99%82%E9%96%93%E8%AA%BF%E6%95%B4%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0%20%5BTyping%20Tube%5D.meta.js
// ==/UserScript==

(function userscript() {
  'use strict';
  if (typeof unsafeWindow === 'object') return window.eval(`(${userscript.toString()})();`);


  const shouldPlayOnHoverOrClick = true;


  const $table = $('#subtitles_table');

  let timerID = 0,
      hasPlayed = false,
      isHovered = false;

  function addSpinButtons() {
    $('#subtitles_table td:first-child').append('<span class="time-spin-button"><span>－</span><span>＋</span></span>');
  }

  window.update_subtitles_table = new Proxy(update_subtitles_table, {apply(_update_subtitles_table) {
    _update_subtitles_table();
    addSpinButtons();
  }});

  function scrollByY(distance) {
    if (!distance) return;
    const $scrollElement = $table.parent(),
          marginTop = parseInt($table.css('margin-top')),
          marginBottom = parseInt($table.css('margin-bottom')),
          targetY = $scrollElement.scrollTop() - marginTop + distance,
          maxY = $scrollElement.prop('scrollHeight') - marginTop - marginBottom - $scrollElement.innerHeight();
    $table.css('transition', '');
    $table.css('margin-top', targetY < 0 ? -targetY + 'px' : 0);
    $table.css('margin-bottom', targetY > maxY ? targetY - maxY + 'px' : 0);
    $scrollElement.scrollTop(targetY);
  }

  function onMouseDown(e) {
    if (e.button !== 0 || e.target === this) return;
    e.preventDefault();
    let $button = $(this),
        interval = 300;
    const line = lyrics_array[$('.time-spin-button').index($button)],
          sign = e.target.nextElementSibling ? -1 : 1,
          step = e.ctrlKey ? 10 : e.shiftKey ? 1 : e.altKey ? .01 : .1;
    let time = +line[0];
    (function repeat() {
      const buttonY = $button.offset().top;
      timerID = setTimeout(repeat, interval);
      interval = 100;
      time = time + sign * step;
      line[0] = time > 0 ? time.toFixed(2) : '0';
      update_subtitles_table();
      $button = $('.time-spin-button').eq(lyrics_array.indexOf(line));
      scrollByY($button.offset().top - buttonY);
    })();
  }

  function onMouseUp(e) {
    if (!timerID) return;
    clearTimeout(timerID);
    timerID = 0;
    const button = $(e.target).closest('.time-spin-button')[0];
    if (!button || !shouldPlayOnHoverOrClick) return;
    skip_play(+lyrics_array[$('.time-spin-button').index(button)][0]);
  }

  function onMouseEnter() {
    if (!shouldPlayOnHoverOrClick || timerID) return;
    if (player.getPlayerState() !== 3) hasPlayed = player.getPlayerState() !== 1;
    skip_play(+lyrics_array[$('.time-spin-button').index(this)][0]);
  }

  function onMouseLeave() {
    if (hasPlayed) player.pauseVideo();
    $table.css('transition', 'margin .5s ease');
    $table.css('margin', 0);
  }

  $table.on({mousedown: onMouseDown, mouseenter: onMouseEnter, mouseleave: onMouseLeave}, '.time-spin-button');
  $(document).mouseup(onMouseUp);

  $table.css('margin', 0);

  $(document.head).append(`<style>
.time-spin-button {
  display: inline-flex;
  width: 37px;
  line-height: 18px;
  font-size: 13px;
  text-align: center;
  margin-left: 4px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px currentColor;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}
.time-spin-button > * {
  flex-grow: 1;
}
.time-spin-button > :first-child {
  margin-right: 1px;
  box-shadow: 4px 0 0 -3px #80808080;
}
.time-spin-button > :hover {
  background-color: #fff3;
}
#lyrics div[style*="overflow-y: scroll;"] {
  display: block !important;
  height: 450px;
}
</style>`);

})();