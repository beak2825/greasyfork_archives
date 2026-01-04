// ==UserScript==
// @name        OOGIRI+ Time left adjustment
// @name:ja     大喜利プラス ズレない残り時間
// @namespace   https://greasyfork.org/users/19523
// @description 残り時間を割り込まれた処理などで遅れないものにします
// @match       http://oogiri.biz/room/*
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30554/OOGIRI%2B%20Time%20left%20adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/30554/OOGIRI%2B%20Time%20left%20adjustment.meta.js
// ==/UserScript==


(function () {
  var url = $('#main > article').next('script').text().match(/http\:\/\/oogiri\.biz\/api\/get_(boke|vote)_limit_second\/\d+/)[0];

  function timer(data) {
    var end = (data * 1000) + Date.now();
    return function ($timer, observer) {
      var limit = end - Date.now();
      if (limit >= 0) {
        var min = Math.floor(limit / (1000 * 60));
        var sec = Math.floor(limit / 1000) % 60;
        $timer.text(`${min}分${sec}秒`);
      } else {
        observer.disconnect();
        $timer.text(`終了`);
        location.replace(location.href.replace(location.hash, ''));
      }
    };
  }

  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json'
  })
  .done(init);

  function init(data) {
    if (data['second'] <= 0)
      return;

    var $oldTime = $('.limitTime .time').eq(0);
    $oldTime.css('display', 'none');
    var $timer = $('<time></time>');
    $oldTime.parent().append($timer);

    var timerON = timer(data['second']);
    var observer = new MutationObserver(function (mutations) {
      timerON($timer, observer);
    });
    observer.observe($oldTime[0], { childList: true });
  }
})();
