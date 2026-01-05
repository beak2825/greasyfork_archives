// ==UserScript==
// @name         Wantedly OEN
// @namespace    https://greasyfork.org/ja/users/61980-kuma
// @version      2.0.7
// @description  try to take over the world!
// @author       kuma
// @match        https://www.wantedly.com/projects*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/22571/Wantedly%20OEN.user.js
// @updateURL https://update.greasyfork.org/scripts/22571/Wantedly%20OEN.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(function() {
    var num = $(".wt-support-button .project-support-link").length;
    var count = +localStorage.getItem('wantedlyOEN') || 0;
    var total = +localStorage.getItem('wantedlyOENTotal') || 0;
    var date = (new Date()).getDate();
    var oldDate = +localStorage.getItem('wantedlyOENDate');
    $('body').append('<div id="wantedlyOEN" style="font-size:50px;color:black;position:absolute;top:100px;left:100px;z-index:9999999;">' + 
                     num + ':' + total + '</div>');
    $(".wt-support-button .project-support-link").click();
    console.log(total);

    function setItem(value) {
      localStorage.setItem('wantedlyOEN', value);
      localStorage.setItem('wantedlyOENDate', date);
    }

    function start() {
      var target = $(".dialog-actions-wrapper .connect-with-facebook + .wt-ui-button:visible");
      if (target.length >= num) {
        setItem(0);
        localStorage.setItem('wantedlyOENTotal', total+num);
        $.Deferred()
          .resolve()
          .then(function() {
          $(".dialog-actions-wrapper .sns-checkbox-wrapper [type=checkbox]:visible:checked").click();
        })
          .then(function() {
          target.click();
        });
      } else {
        setTimeout(start, 300);
      }
    }
    
    if (Math.abs(date - oldDate) > 0) {
      localStorage.setItem('wantedlyOENTotal', 0);
    }

    if (count > 12) {
      $('#wantedlyOEN').text('Not working');
      console.log('15回以上リトライしたため停止しています');
      if (Math.abs(date - oldDate) > 0) {
        start();
        setItem(0);
        $('#wantedlyOEN').text('Restart');
        console.log('前回の実行から1日以上経過しているので再開します');
      } else if(num) {
        start();
        $('#wantedlyOEN').text('Restart');
        console.log('応援できる募集があるため再開します');
      }
    } else {
      if (!num) {
        setItem(count+1);
        location.href = $('[rel="next"]').attr('href');
      } else {
        start();
      }
    }
  });
})();