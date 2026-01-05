// ==UserScript==
// @name            掌上书苑自动签到
// @description     早上8点后打开任意网页即可自动当日签到并兑换全部人气为书币
// @include         *
// @version         1.2
// @author          yechenyin
// @namespace	      https://greasyfork.org/users/3586-yechenyin
// @require	        https://code.jquery.com/jquery-1.11.2.min.js
// @grant       	  GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/13318/%E6%8E%8C%E4%B8%8A%E4%B9%A6%E8%8B%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/13318/%E6%8E%8C%E4%B8%8A%E4%B9%A6%E8%8B%91%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function ($) {
  function remove_iframe() {
    $('#cnepub_sign').remove();
  }

  if (location.href.indexOf('http://www.cnepub.com/discuz/') < 0) {
    var date = new Date();
    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
    var china_time = utc + 8 * 3600 * 1000;
    var china_hour = (new Date(china_time)).getHours();
    var china_date = (new Date(china_time)).getDate();
    //console.log('china time:' + china_date + ' ' + china_hour);
    //console.log('signed date:' + localStorage.signed_date);

    if (china_hour >= 8 && china_date != localStorage.signed_date) {
      $('body').append($('<iframe>', {src:'http://www.cnepub.com/discuz/plugin.php?id=dsu_paulsign:sign#auto', id:'cnepub_sign', css:{display:'none'}}));
    }
  }


  if (location.href === 'http://www.cnepub.com/discuz/plugin.php?id=dsu_paulsign:sign#auto') {
      setTimeout(function () {
        console.log($('.tac li').length + $('.tac a').length);
        $('.tac li')[0].click();
        $('input[name="qdmode"]')[1].click();
        $('.tac a')[0].click();

        var date = new Date();
        var utc = date.getTime() + date.getTimezoneOffset() * 60000;
        var china_time = utc + 8 * 3600 * 1000;
        var china_hour = (new Date(china_time)).getHours();
        var china_date = (new Date(china_time)).getDate();
        localStorage.signed_date = china_date;
        console.log('cnepub is signed');
      }, 0);

      location.href = 'http://www.cnepub.com/discuz/home.php?mod=spacecp&ac=credit&op=exchange#auto';
  }


  if (location.href === 'http://www.cnepub.com/discuz/home.php?mod=spacecp&ac=credit&op=exchange#auto') {

        var hot = $('.creditl li').eq(1).text().match(/\d+/)[0];
        console.log(hot);
        if (hot >= 80) {
          $('#exchangeamount').val(hot/80);
          $('input[name="password"]').val(password);
          $('#exchangesubmit_btn').submit();
        }
        window.parent.remove_iframe();
  }

  if (location.href === 'http://www.cnepub.com/discuz/member.php?mod=logging&action=login') {
    if (window.self !== window.top) {
        GM_openInTab('http://www.cnepub.com/discuz/member.php?mod=logging&action=login', false);
      }
  }

})(jQuery);
