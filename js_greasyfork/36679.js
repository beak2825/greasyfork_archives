// ==UserScript==
// @name       Daily Bonus — Farmskins.com BETA
// @namespace    undefined
// @description      Daily Bonus BETA
// @author        chunhung
// @icon          https://www.google.com/s2/favicons?domain=farmskins.com
// @version       12252017
// @include       http://farmskins.com/dailybonus
// @grant unsafeWindow
// @grant randomizator
// @downloadURL https://update.greasyfork.org/scripts/36679/Daily%20Bonus%20%E2%80%94%20Farmskinscom%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/36679/Daily%20Bonus%20%E2%80%94%20Farmskinscom%20BETA.meta.js
// ==/UserScript==

//Hidden Alert
unsafeWindow.alert = function alert(message) {
    console.log('Hidden Alert ' + message);
};

(function() {
console.log('Opening case check');
  if (openingCase)
    return;
  console.log('Opening case check done');
  var that = $(this);
  var prevHtml = that.html();
  that.text(lang['open_case_btn_opening']).attr('disabled', 'disabled')
  openingCase = true;
  console.log('HTML data done');
  fillCarusel2();
  console.log('Carusel filling done');
  $('#scrollerContainer').addClass('hidden');
  $('.caseContainer').addClass('loading');
  $('#scrollerContainer').fadeIn();

  console.log('Containers updated');
  console.log('Running ajax...');
  $.ajax({
    url: '/ajax/dailybonus/get',
    type: 'POST',
    dataType: "json",
    data: {
      'staticname': currentCase,
      'csrf': 'cc5e54776c95982324d74a272cf291b2',
    },
    success: function(data) {

      console.log('Ajax done');
      if (data.success) {
        $('.caseContainer').addClass('hidden');
        $('#scrollerContainer').removeClass('hidden');
        $('.svg-box').addClass('hidden');
        $('.case-arrow-class').hide();
        console.log('Containers updated (2)');

        console.log('Data - success');
        if (data.msg_id !== undefined) {
          console.log('msg_id found');
          console.log(data);
          if (data.msg_id == 4) {
            $('#modal-set_tradeoffer').modal('show');
            openingCase = false;
            that.text(prevHtml).attr('disabled', null);
            return;
          }
          openingCase = false;
          that.text(prevHtml).attr('disabled', null);
          switch (data.msg_id) {
            default: alert(data.msg);
            $('#scrollerContainer').addClass('hidden');
            $('.caseContainer').removeClass('loading').removeClass('hidden');
            $('.svg-box').removeClass('hidden');
          }

          return;
        };


        console.log('Reaching goal');
        if (typeof yaCounter37343975 != 'undefined') {
          yaCounter37343975.reachGoal('open_case');
        }
        console.log('Pushing');
        //dataLayer.push({'Case': 'open'});
        //dataLayer.push({'event': 'case-popup-open', 'eventCategory': 'one_case', 'eventAction': 'open_js'});
        //goog_report_conversion ('');
        console.log('Reaching goal and pushing done');
        caseOpenAudio.play();
        var weapon = data.weapon;
        last_weapon = weapon;
        //var weaponName = weapon.firstname + ' | ' + weapon.secondname;
        console.log(weapon);

        if (weapon.rarity === 'money') {
          var weaponName = weapon.firstname;
          $('#modal-drop .drop-img-wrap').append('<span class="incase-money-label">' + weaponName.replace(' USD', '') + '</span>');
          $('#casesCarusel > div:nth-child(30) .money-center').text(weaponName.replace(' USD', ''));
        } else {
          var weaponName = weapon.firstname + ' | ' + weapon.secondname;
        }
        //$('#casesCarusel > div:nth-child(30)').css('visibility', 'hidden');
        $('#casesCarusel > div:nth-child(30), #weaponBlock .recweap').removeClass('milspec restricted classified covert rare industrial consumer money').addClass(weapon.rarity);

        $('#casesCarusel > div:nth-child(30) .weaponblockinfo span').html((weapon.stattrak ? 'StatTrak™ ' : '') + weaponName.replace(' | ', '<br/>'))
        $('#casesCarusel > div:nth-child(30)').find('img').attr('src', getImage(weapon.image, 100, 100, true))


        $('#modal-drop .drop-img-wrap').toggleClass('stattrak', !!weapon.stattrak)
        $('#modal-drop .drop-name').text(weaponName)
        $('#modal-drop .drop-img').attr('src', getImage(weapon.image, 384, 384, true));
        $('#modal-drop .modal-drop-case').removeClass('milspec restricted classified covert rare industrial consumer money').addClass(weapon.rarity);

        if (weapon.rarity == 'money') {
          $('#modal-drop .sell-for').parent().remove();
        }

        $('#modal-drop .sell-for').text(weapon.price);
        $('#modal-drop .sell-for').parent().attr('onclick', 'sell_by_win_id(' + data.win_id + ', this); return false;');
        $('#modal-drop .sell-for').parent().attr('data-price', (weapon.price * weapon.percent / 100).toFixed(2));
        $('#modal-drop .sell-for').parent().attr('data-percent', (weapon.percent).toFixed(2));


        var weapon_width = $('#casesCarusel .weaponblock').eq(0)[0].clientWidth;

        carusel_width = $('#scrollerContainer')[0].clientWidth;
        carusel_width_2 = $('#aCanvas')[0].clientWidth;

        if (carusel_width_2 < carusel_width) {
          carusel_width = carusel_width_2;
        }

        full_spin = carusel_width / weapon_width;
        spins_count = 30 / full_spin;


        stop_interval = get_random_int(weapon_width * 0.1, weapon_width * 0.9);
        console.log('Params updated');
        caseScrollAudio.play();

        var a = $('#casesCarusel > div:nth-child(30)')[0].offsetLeft - 312.5 + stop_interval;

        socket.close();
        var indexesSounded = [];

        console.log('Setting up interval');
        var interval = setInterval(function() {

          $('#casesCarusel > div').each(function(index, item) {
            if (indexesSounded[index]) {
              return;
            }
            if ($(item).position().left - 6 <= $('#caruselLine')[0].offsetLeft) {
              //console.log($(item).position().left + ' VS ' + $('#caruselLine')[0].offsetLeft);
              indexesSounded[index] = true;
              caseScrollAudio.pause();
              caseScrollAudio.currentTime = 0;
              caseScrollAudio.play();

            }
          });
        }, 30);
        console.log('Starting transition');

        $('#casesCarusel').transition({
          x: -1 * a
        }, {
          duration: 10000,
          easing: 'swing',
          complete: function() {

            clearInterval(interval);
            console.log('complete');
            openingCase = false;
            caseCloseAudio.play();
            that.text(prevHtml).attr('disabled', null);


            setTimeout(function() {
              websocket_start(window.socket_url);
              console.log('Loading balance');
              load_balance();
              console.log('Load balance done');
              $('.case-arrow-class').show();
              $('#modal-drop').modal('show');
              $('#modal-drop').find('button.next-game').click(function() {
                window.location.reload();
              });
              $('#modal-drop').on('hidden.bs.modal', function() {
                window.location.reload();
              })
              $('#scrollerContainer').addClass('hidden');
              $('.caseContainer').removeClass('loading').removeClass('hidden');

              //window.location.reload();
            }, 100);
          }
        });
      } else {
        openingCase = false;
        that.text(prevHtml).attr('disabled', null);
        alert('You can\'t get daily bonus.');
        window.location.reload();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      openingCase = false;
      that.text(prevHtml).attr('disabled', null);
      alert('Undefined error. Please try again later.');
      console.log("Error: " + textStatus + " errorThrown: " + errorThrown);
      console.log(jqXHR);
    }
  });


console.log('Clicked');
})();