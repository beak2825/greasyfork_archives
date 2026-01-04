// ==UserScript==
// @name           hwm_time_restore
// @namespace      Demin_92571
// @author         Demin
// @description    Таймеры гильдии рабочих, воров, наёмников, рейнджеров, охотников, кузнецов, восстановления здоровья и маны
// @homepage       https://greasyfork.org/en/scripts/35221-hwm-time-restore
// @icon           https://i.imgur.com/LZJFLgt.png
// @version        6.1.6
// @encoding       utf-8
// @include        https://www.heroeswm.ru/*
// @include        https://www.lordswm.com/*
// @include        http://178.248.235.15/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/35221/hwm_time_restore.user.js
// @updateURL https://update.greasyfork.org/scripts/35221/hwm_time_restore.meta.js
// ==/UserScript==

// (c) 2008-2009, xo4yxa
// (c) 2010-2015, demin  ( https://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2017, перф. 10.10.2017 v.5.8: *вместо nick привзяка к id_payler из рекордов охоты; изменение алгоритма получения уровня здоровья.
// (c) 2018, CheckT v.6.0+: Исправления и рефакторинг
// old homepage https://greasyfork.org/users/1602-demin

try{
(function() {

  initGm();

  var url_cur = location.href;
  var url = location.protocol + '//'+location.hostname+'/';
  var gm_prefix = "htr_";

  if ( isLoggedOff() )
    return;

  // в бою
  if ( location.pathname=='/war.php' ) {
    onWarDetected();
    return;
  }

  var pl_id = getPlayerId();

  var img_link = document.querySelector("img[src*='i/top'][src*='/line/t_end']");

  var b = document.querySelector("body");
  var x1 = document.querySelector("img[src*='i/top'][src*='/dragon__left']");
  var x2 = document.querySelector("img[src*='i/top'][src*='/dragon__right']");

  if ( !b || !img_link || !x1 || !pl_id)
    return;

  var army_percent = 0;
  var heart_scale;
  var vh = document.getElementById('heart');
  if (vh){
    if (vh.parentNode.innerHTML.match(/var heart=(\d+);/))
      army_percent = RegExp.$1;
    if (vh.parentNode.innerHTML.match(/var time_heart=([0-9]+(.[0-9]+)?);/))
      heart_scale = RegExp.$1;
  }
  console.log('vh='+vh);

  var _i = /(\S*\/line\/)/.exec(img_link.src)[1];
  var _i_ = '';

  // если новый год
  if ( document.querySelector("img[src*='i/top_ny']") )
    _i_ = '_';

  var time_cur = new Date().getTime();
  var time = { h: 0, w: 0, gn: 0, gv: 0, go: 0, sm: 0 };
  var disable_alarm_delay = 30;     //секунд задержки после предыдущего сигнала

  var options;
  loadOptions();
  quickFixOptions();
  var audio_default;
  var audio_gr;
  var audio_gonv;
  var audio_gk;
  var audio_h;
  initAudios();

  var texts = setTexts();

  alertOnLicMo();
  createTopRow();
  var time_server = loadServerTime();
  loadWorkEndTime();
  checkPremiumTime();
  checkPremiumTimeExpired();
  checkLicMoO();
  checkWar();
  checkJustWork();
  checkWork();
  checkMercenary();
  checkLeaderGuild();
  checkRangerGuild();
  checkModWorkebench();
  checkMap();
  addEvents();
  showTimers();
  gm_set(pl_id+'_options', JSON.stringify(options));


  return; //only functions below

  function onWarDetected(){
    if ( /warlog\|0/.exec(document.querySelector("html").innerHTML) ) {
      //flash & html:
          // warlog|0| -> бой происходит сейчас
          // warlog|1| -> запись боя
          // |player|7146446| -> id текущего игрока
      var pl_id = /\|player\|(\d+)\|/.exec(document.querySelector("html").innerHTML);
      if ( pl_id ){
        gm_set_bool( "unknown_war_unload", true );   //для тех, у кого отключено выпадающее меню
        gm_set_bool( pl_id[1] + "_war_unload", true );
      }
    }
  }

  function loadOptions(){
    var opts = gm_get(pl_id+'_options');
    if ( !opts ) {
      opts = '{'
        +'"time_health_alert":"no", "time_work_alert":"yes", "time_work_end_yes":"yes", "time_work_end":"1300000000000", "time_work_trudogolik":"0", "time_sm_alert":"yes", "time_sm_end_yes":"yes", '
        +'"time_sm_end":"1300000000000", "time_gn_alert":"yes", "time_gn_end_yes":"yes", "time_gn_end":"1300000000000", "time_go_alert":"yes", "time_go_end_yes":"yes", "time_go_end":"1300000000000", "map_hunter":"false", '
        +'"time_gv_alert":"yes", "time_gv_end_yes":"yes", "time_gv_end":"1300000000000", "map_thief_ambush":"false", "time_percent_faster":"1", "time_percent_prem":"1", "time_percent_prem_exp":"1300000000000", '
        +'"time_percent_prem_title":"", "time_percent_lic_mo":"1", "time_percent_lic_mo_exp":"1300000000000", "time_percent_lic_mo_title":"", "gv_or_gre":"0", "gre_check":"0", "time_work_trudogolik_show":"1", '
        +'"time_work_trudogolik_off":"0", "gr_show_check":"1", "gk_show_check":"1", "gn_show_check":"1", "go_show_check":"1", "gv_show_check":"1", "go_timer_hide":"1", "object_id":"", "disable_multiple_alarms":"1", '
        +'"audio_file_gr":"", "audio_file_gonv":"", "audio_file_gk":"", "audio_file_h":"", "gl_attack":"false"'
        +'}';
    }
    options = JSON.parse( opts );
  }
  function updateOption(key, val){
    loadOptions();
    options[key] = val;
    saveOptions();
  }
  function saveOptions(){
    gm_set(pl_id+'_options', JSON.stringify(options));
  }
  function quickFixOptions(){
    //fixes
    if(options.time_audio_file){
      if(!options.audio_file_gr)
        options.audio_file_gr = options.time_audio_file;
      if(!options.audio_file_gonv)
        options.audio_file_gr = options.time_audio_file;
      if(!options.audio_file_gk)
        options.audio_file_gr = options.time_audio_file;
      if(!options.audio_file_h)
        options.audio_file_gr = options.time_audio_file;
      delete options.time_audio_file;
    }
  }

  function initAudios(){
    audio_default = new Audio(
      'data:audio/mp3;base64,' +
      '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'
    );
    audio_default.preload = 'auto';
    audio_gr = initAudio(options.audio_file_gr);
    audio_gonv = initAudio(options.audio_file_gonv);
    audio_gk = initAudio(options.audio_file_gk);
    audio_h = initAudio(options.audio_file_h);
  }
  function initAudio(src){
    if(src && src !== '') {
      var audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
      return audio;
    } else {
      return audio_default;
    }
  }

  function setTexts(){
    var obj;
    if (url.match('lordswm')) {
      obj = {
        health_alert_ty : 'Army restore alarm on',
        health_alert_tn : 'Alarm once at army restore',
        work_alert_ty : 'Workshift alarm on',
        work_alert_tn : 'Alarm off',
        sm_alert_ty : 'Blacksmith alarm on',
        gn_alert_ty : 'Mercenaries Guild alarm on',
        regexp_timegn0 : /Come back in (\d+) minutes\./,
        regexp_timegn1 : /\. Time left: (\d+) minutes\./,
        regexp_timegn2 : /ou have (\d+) minutes left/,
        regexp_timegn3 : /\. Time left: (\d+) minutes\./,
        regexp_timegn4 : /still have (\d+) minutes/,
        regexp_timegn5 : /you still have \d+ attempts and (\d+) minutes/,
        regexp_gn_rep : /Reputation: <b>([\d\.]+)/,
        go_alert_ty : 'Hunters Guild alarm on',
        regexp_go_timer : 'Next hunt available in',
        gv_alert_ty : 'Thieves Guild alarm on',
        gre_alert_ty : 'Rangers Guild alarm on',
        regexp_timegre : /Come in (\d+) min/,
        time_home : /You may enroll again in (\d+) min/,
        time_home2 : / since (\d+):(\d+)<\/td>/,
        alert_health : 'Troops ready: 100%',
        alert_work : 'LG: You may enroll again',
        alert_sm : 'BS: Blacksmith works are finished',
        alert_gn : 'MG: Mercenaries Guild has a quest for you',
        alert_go : 'HG: You notice traces ...',
        alert_gv : 'TG: You may set an ambush',
        alert_gre : 'RG: Rangers Guild has a quest for you',
        audio_file : 'Audio file ',
        alarm_mode : '<b>Timer alarm mode</b>:',
        alarm_mode_sound : 'audio',
        alarm_mode_alert: 'message',
        alarm_mode_both: 'both',
        alarm_mode_none: 'both',
        h_t : 'health',
        gonv_t : 'MHT(R)G',
        gr_t : 'LG',
        gr_title : '',
        gk_t : 'BS',
        gk_title : 'To Blacksmith',
        gn_t : 'MG',
        gn_title : 'To Mercenaries\' Guild',
        go_t : 'HG',
        go_title : 'To Hunters\' Guild',
        gv_t : 'TG',
        gv_title : 'To Thieves\' Guild',
        gre_t : 'RG',
        gre_title : 'To Rangers Guild post',
        mana_title : 'Settings',
        work_obj_do : 'You have successfully enrolled',
        work_unemployed : 'You are currently unemployed',
        regexp_map_go : 'During the journey you have access to the',
        go_title_lic : 'The license expires ',
        alert_go_lic_exp : 'HG: Hunter license has expired',
        alert_prem_exp : 'Abu-Bakir\'s Charm has expired',
        st_start : 'All settings adjustments will apply after page is reloaded',
        st_null_timers : 'Reset all timers',
        st_gv_n_time : 'Set TG/RG timer for once to',
        st_percent_faster : 'Quests HG, MG, TG, RG more often',
        st_gre_check : 'Immediately initiate Rangers\' guild battle on arrival',
        st_show_timers : 'Show timers:',
        st_predupr_pa : '<b>Abu-Bakir\'s Charm</b> is detected automatically',
        st_work_trudogolik_show : 'Notify about workaholic penalty only 2 workshifts away',
        st_work_trudogolik_off : 'Turn off all notifications on workaholic penalty',
        st_predupr_go_lic : '<b>Hunter license</b> is detected automatically in Hunters\' Guild',
        st_go_timer_hide : 'Hide',
        st_disable_multiple_alarms : 'Disable repeat signals for ' + disable_alarm_delay + ' sec',
        workaholic_penalty : 'Workaholic penalty',
        workaholic_penalty_regexp : 'workaholic penalty',
        regexp_sm : /Completion time: (\d+)-(\d+) (\d+):(\d+)/,
        workaholic_text1 : ' approximately through ',
        workaholic_text2 : ' enrollments.',
        workaholic_text3 : '',
        workaholic_text1_replace : ' <font color:"red">enabled</font> approximately ',
        uze_ustroen : 'You are already employed\.',
        uze_ustroen2 : 'Less than one hour passed since last enrollment\. Please wait\.',
        uze_ustroen3 : 'No vacancies\.'
      };
    } else {
      obj = {
        health_alert_ty : 'Будет предупреждение о восстановлении армии',
        health_alert_tn : 'Установить единоразово предупреждение о восстановлении армии',
        work_alert_ty : 'Будет предупреждение о конце рабочего часа',
        work_alert_tn : 'Не будет предупреждения',
        sm_alert_ty : 'Будет предупреждение о завершении работ в Кузнице',
        gn_alert_ty : 'Будет предупреждение Гильдии Наемников',
        regexp_timegn0 : /Приходи через (\d+) мин/,
        regexp_timegn1 : /Осталось времени: (\d+) минут/,
        regexp_timegn2 : /тебя осталось (\d+) минут/,
        regexp_timegn3 : /у тебя еще есть (\d+) минут/,
        regexp_timegn4 : /\. Осталось (\d+) минут\./,
        regexp_timegn5 : /осталось \d+ попыток и (\d+) минут/,
        regexp_gn_rep : /Репутация: <b>([\d\.]+)/,
        go_alert_ty : 'Будет предупреждение Гильдии Охотников',
        regexp_go_timer : 'Следующая охота будет доступна через',
        gv_alert_ty : 'Будет предупреждение Гильдии Воров',
        gre_alert_ty : 'Будет предупреждение Гильдии Рейнджеров',
        regexp_timegre : /приходи через (\d+) мин/,
        time_home : /Вы можете устроиться на работу через (\d+)/,
        time_home2 : / с (\d+):(\d+)<\/td>/,
        alert_health : 'Готовность армии: 100%',
        alert_work : 'ГР: Пора на работу',
        alert_sm : 'ГК: Работа в Кузнице завершена',
        alert_gn : 'ГН: Для Вас есть задание в Гильдии Наемников',
        alert_go : 'ГО: Вы увидели следы ...',
        alert_gv : 'ГВ: Вы можете устроить засаду',
        alert_gre : 'ГРж: Есть задание в Гильдии Рейнджеров',
        audio_file : 'Звук сигнала ',
        alarm_mode : '<b>Режим оповещения</b> окончания таймера:',
        alarm_mode_sound : 'звук',
        alarm_mode_alert: 'сообщение',
        alarm_mode_both: 'звук+сообщ',
        alarm_mode_none: 'отключен',
        h_t : 'здоровья',
        gonv_t : 'ГОНВ(Рж)',
        gr_t : 'ГР',
        gr_title : '',
        gk_t : 'ГК',
        gk_title : 'В Кузницу',
        gn_t : 'ГН',
        gn_title : 'В здание Гильдии Наемников',
        go_t : 'ГО',
        go_title : 'В здание Гильдии Охотников',
        gv_t : 'ГВ',
        gv_title : 'В здание Гильдии Воров',
        gre_t : 'ГРж',
        gre_title : 'В здание Гильдии Рейнджеров',
        mana_title : 'Настройки',
        work_obj_do : 'Вы устроены на работу',
        work_unemployed : 'Вы нигде не работаете',
        regexp_map_go : 'Во время пути Вам доступны',
        go_title_lic : 'Лицензия истекает ',
        alert_go_lic_exp : 'ГО: Лицензия охотника истекла',
        alert_prem_exp : 'Благословение Абу-Бекра истекло',
        workaholic_penalty : 'Штраф трудоголика',
        workaholic_penalty_regexp : 'штраф трудоголика',
        regexp_sm : /Завершение работы: (\d+)-(\d+) (\d+):(\d+)/,
        st_start : 'Все изменения будут видны после перезагрузки страницы',
        st_null_timers : 'Обнулить все таймеры',
        st_gv_n_time : 'Единоразово установить таймер ГВ/ГРж равным',
        st_percent_faster : 'Задания ГО, ГН, ГВ, ГРж чаще на',
        st_gre_check : 'По прибытии вступать в бои Гильдии Рейнджеров',
        st_show_timers : '<b>Отображать:</b>',
        st_predupr_pa : '<b>Благословение Абу-Бекра</b> определяется автоматически',
        st_work_trudogolik_show : '<b>Показывать</b> штраф трудоголика только <b>за 2 часа</b>',
        st_work_trudogolik_off : '<b>Отключить</b> ВСЕ уведомления о штрафе трудоголика',
        st_predupr_go_lic : '<b>Лицензия охотника</b> определяется автоматически (в Гильдии Охотников)',
        st_go_timer_hide : '<b>Скрывать</b>',
        st_disable_multiple_alarms : 'Запретить повторные сигналы в течении '+ disable_alarm_delay + ' секунд',
        workaholic_text1 : ' примерно через ',
        workaholic_text2 : ' устройств',
        workaholic_text3 : ' на работу.',
        workaholic_text1_replace : ' <font color:"red">активен</font> примерно ',
        uze_ustroen : 'Вы уже устроены\.',
        uze_ustroen2 : 'Прошло меньше часа с последнего устройства на работу\. Ждите\.',
        uze_ustroen3 : 'Нет рабочих мест\.'
      };
    }

    obj.regexp_time_server = /(\d+):(\d+), \d+ online/;
    obj.regexp_time_server2 = /(\d+):(\d+):(\d+), \d+ online/;
    obj.regexp_lic_mo = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/;
    obj.regexp_prem = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/;
    obj.sm_alert_tn = obj.work_alert_tn;
    obj.gn_alert_tn = obj.work_alert_tn;
    obj.go_alert_tn = obj.work_alert_tn;
    obj.gv_alert_tn = obj.work_alert_tn;
    obj.gre_alert_tn = obj.work_alert_tn;
    obj.gv_tit = '/thief_guild.php';
    obj.gre_tit = '/ranger_guild.php';

    if (options.gv_or_gre == '1') {
      obj.alert_gv = obj.alert_gre;
      obj.gv_alert_ty = obj.gre_alert_ty;
      obj.gv_alert_tn = obj.gre_alert_tn;
      obj.gv_t = obj.gre_t;
      obj.gv_title = obj.gre_title;
      obj.gv_tit = obj.gre_tit;
    }
    return obj;
  }

  function alertOnLicMo(){
    if (options.time_percent_lic_mo_title) {
      if (Number(options.time_percent_lic_mo_exp) > time_cur) {
        texts.go_title += '\n' + texts.go_title_lic + options.time_percent_lic_mo_title;
      } else {
        // лицензия охотника истекла
        setTimeout(function() { prompt(texts.alert_go_lic_exp); }, 300);
        options.time_percent_lic_mo = '1';
        options.time_percent_lic_mo_exp = '1300000000000';
        options.time_percent_lic_mo_title = '';
      }
    }
  }

  function createTopRow(){
    var d = document.createElement('div');
    d.setAttribute('style', 'position: absolute; margin: -26px 0px 0px -43px; text-align: center;');
    d.innerHTML =
      '<style>' +
      '.hwm_tb * {font-size: 11px; color: #f5c137;}' +
      '.hwm_tb_cell {border-collapse: collapse; background-color: #6b6b69;}' +
      '.hwm_tb_cell TD {padding: 0px;}' +
      '.cell_t {height: 3px; background: url(' + _i + 't_top_bkg' + _i_ + '.jpg);}' +
      '.cell_c {white-space: nowrap; height: 18px; background: url(' + _i + 't_com_bkg' + _i_ + '.jpg); font-weight: bold;}' +
      '.cell_b {height: 5px; background: url(' + _i + 't_bot_bkg' + _i_ + '.jpg); text-align: center;}' +
      '.cell_b IMG {width: 17px; height: 5px;}' +
      '</style>' +
      '<table cellpadding=0 cellspacing=0 align="center" class="hwm_tb" width=' + (x2.getBoundingClientRect().left - x1.getBoundingClientRect().left + 124) + 'px>' +
      '<tr height=26>' +
      '<td>' +
      '<table width="100%" cellpadding=0 cellspacing=0 style="background: url(' + _i + 't_bkg' + _i_ + '.jpg);">' +
      '<tr valign=middle align=center>' +
      '<td width=5 style="overflow: hidden;"><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26 style="margin:0px 0px 0px -4px;"></td>' +
      '<td width=44>' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c" style="cursor:pointer" id="pers_h">00:00</td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td id="gr_show1">' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c"><span style="cursor:pointer" id="a_pers_w">' + texts.gr_t + '</span>: <a href="javascript:void(0);" title="' + texts.gr_title + '" style="text-decoration: none;" id="pers_w">00:00</a></td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td id="gr_show2" width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td id="gk_show1">' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c"><span style="cursor:pointer" id="a_pers_sm">' + texts.gk_t + '</span>: <a href="/mod_workbench.php?type=repair" title="' + texts.gk_title + '" style="text-decoration: none;" id="pers_sm">00:00</a></td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td id="gk_show2" width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td id="gn_show1">' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c"><span style="cursor:pointer" id="a_pers_gn">' + texts.gn_t + '</span>: <a href="/mercenary_guild.php" title="' + texts.gn_title + '" style="text-decoration: none;" id="pers_gn">00:00</a></td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td id="gn_show2" width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td id="go_show1">' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c"><span style="cursor:pointer" id="a_pers_go">' + texts.go_t + '</span>: <a href="/hunter_guild.php" title="' + texts.go_title + '" style="text-decoration: none;" id="pers_go">00:00</a>' +
      '</td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td id="go_show2" width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td id="gv_show1">' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c"><span style="cursor:pointer" id="a_pers_gv">' + texts.gv_t + '</span>: <a href="' + texts.gv_tit + '" title="' + texts.gv_title + '" style="text-decoration: none;" id="pers_gv">00:00</a></td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td id="gv_show2" width=9><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26></td>' +
      '<td width=44>' +
      '<table class="hwm_tb_cell">' +
      '<tr><td class="cell_t"></td></tr>' +
      '<tr>' +
      '<td class="cell_c" style="cursor:pointer" id="pers_m" title="' + texts.mana_title + '">00:00</td>' +
      '</tr>' +
      '<tr><td class="cell_b"><img src="' + _i + 't_center' + _i_ + '.jpg"></td></tr>' +
      '</table>' +
      '</td>' +
      '<td width=5 style="overflow: hidden;"><img src="' + _i + 't_end' + _i_ + '.jpg" alt="" width=9 height=26 style="margin:0px -4px 0px 0px;"></td>' +
      '</tr>' +
      '</table>' +
      '</td>' +
      '</tr>' +
      '</table>';
    if (options.gr_show_check == '0') {
      d.querySelector("#gr_show1").style.display = d.querySelector("#gr_show2").style.display = 'none';
    }
    if (options.gk_show_check == '0') {
      d.querySelector("#gk_show1").style.display = d.querySelector("#gk_show2").style.display = 'none';
    }
    if (options.gn_show_check == '0') {
      d.querySelector("#gn_show1").style.display = d.querySelector("#gn_show2").style.display = 'none';
    }
    if (options.go_show_check == '0') {
      d.querySelector("#go_show1").style.display = d.querySelector("#go_show2").style.display = 'none';
    }
    if (options.gv_show_check == '0') {
      d.querySelector("#gv_show1").style.display = d.querySelector("#gv_show2").style.display = 'none';
    }
    x1.parentNode.appendChild(d);
    addClickEvent("pers_m", settings);
    if (options.object_id) {
      setTimeout(function() {$("pers_w").href = "object-info.php?id=" + options.object_id;}, 300);
    }
    return d;
  }


  function loadServerTime(){
    // вычисление времени сервера (с поддержкой time_seconds)
    var t_server = texts.regexp_time_server2.exec(b.innerHTML);
    if (t_server) {
      return new Date(0, 0, 0, Number(t_server[1]), Number(t_server[2]), Number(t_server[3]));
    }
    t_server = texts.regexp_time_server.exec(b.innerHTML);
    if (t_server) {
      return new Date(0, 0, 0, Number(t_server[1]), Number(t_server[2]), 0);
    }
  }

  function loadWorkEndTime(){
    if (location.pathname == '/home.php' && document.querySelector("img[src*='i/icons/attr_defense.png']")) {
      var t_gr, gr_temp;
      // подхватывание времени окончания работы с home.php и его проверка
      var time_home_time = texts.time_home.exec(b.innerHTML);
      if (time_home_time) {
        t_gr = Number(time_home_time[1]) * 60000; // в миллисекундах
        gr_temp = t_gr - Math.abs(Number(options.time_work_end) - time_cur);
      } else if (time_server) {
        time_home_time = texts.time_home2.exec(b.innerHTML)
        if (time_home_time) {
          t_gr = new Date(0, 0, 0, Number(time_home_time[1]), Number(time_home_time[2]), 0);
          // example: 18:00 - 18:20 = - 20 мин уже работаю; -20 min + 60 min = 40 мин осталось'
          if (time_server < t_gr) {
            t_gr = t_gr - time_server + 60 * 60000 - 24 * 60 * 60000;
          } else { // в миллисекундах
            t_gr = t_gr - time_server + 60 * 60000;
          } // в миллисекундах
          gr_temp = t_gr - Math.abs(Number(options.time_work_end) - time_cur);
        }
      }
      if (gr_temp && Math.abs(gr_temp) > 70000) {
        options.time_work_end = '' + (time_cur + t_gr);
        options.time_work_end_yes = 'no';
      }
      if (b.innerHTML.match(texts.work_unemployed)) {
        options.time_work_end = '1300000000000';
        options.time_work_end_yes = 'yes';
      }
    }
  }

  function checkPremiumTime(){
    if (location.pathname == '/home.php' && document.querySelector("img[src*='i/icons/attr_defense.png']")) {
      if(document.querySelector("a[href*='home.php?skipn=1']")){ //'Ознакомился' или 'Got it!'
        //console.log('"Got it!" detected');
        return;
      }
      // проверка наличия эффекта блага АБУ Бекра (премиум аккаунт)
      var img_star_prem = document.querySelector("img[src$='i/star_extend.gif']");
      if(!img_star_prem)
        img_star_prem = document.querySelector("img[src$='i/star.gif']");
      if (img_star_prem) {
        img_star_prem.align = "absmiddle";
        options.time_percent_prem = '' + (70 / 100);
        var time_zone = 3 + new Date().getTimezoneOffset() / 60;
        if (new Date(2011, 0, 11).getTimezoneOffset() != new Date(2011, 6, 3).getTimezoneOffset())
          time_zone += 1;
        // взять дату
        var time_server_day = new Date(Date.parse(new Date()) + time_zone * 60 * 60 * 1000);
        time_server_day = Date.parse(new Date(time_server_day.getFullYear(), time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds()));
        var time_prem = texts.regexp_prem.exec(img_star_prem.title);
        if (time_prem) {
          if (url.match('lordswm')) {
            // 2013-05-31 23:25
            time_prem = Date.parse(new Date(Number(time_prem[1]), Number(time_prem[2]) - 1, Number(time_prem[3]), Number(time_prem[4]), Number(time_prem[5])));
          } else {
            // 31-05-13 23:25
            time_prem = Date.parse(new Date(Number(time_prem[3]) + 2000, Number(time_prem[2]) - 1, Number(time_prem[1]), Number(time_prem[4]), Number(time_prem[5])));
          }
          options.time_percent_prem_exp = '' + (time_cur + time_prem - time_server_day);
          options.time_percent_prem_title = img_star_prem.title;
        }
      } else {
        options.time_percent_prem = '1';
        options.time_percent_prem_exp = '1300000000000';
        if (options.time_percent_prem_title) {
          // эффекта блага АБУ Бекра (премиум аккаунт) - нет. (закончился)
          setTimeout(function() {prompt(texts.alert_prem_exp);}, 300);
          options.time_percent_prem_title = '';
        }
      }
    }
  }
  function checkPremiumTimeExpired(){
    if (options.time_percent_prem_title) {
      if (Number(options.time_percent_prem_exp) > time_cur) {
        texts.gr_title = options.time_percent_prem_title;
        $('pers_w').title = texts.gr_title;
      } else {
        // эффекта блага АБУ Бекра (премиум аккаунт) - нет. (закончился)
        setTimeout(function() {prompt(texts.alert_prem_exp);}, 300);
        options.time_percent_prem = '1';
        options.time_percent_prem_exp = '1300000000000';
        options.time_percent_prem_title = '';
      }
    }
  }

  function checkLicMoO(){
    var form_f2 = document.querySelector("form[name='f2']");
    if (location.pathname == '/hunter_guild.php' && time_server && form_f2) {
      while (form_f2.tagName != 'TR') {
        form_f2 = form_f2.parentNode;
      }
      if (texts.regexp_lic_mo.exec(form_f2.innerHTML)) {
        if (!form_f2.querySelector("input[type='submit'][onclick*='confirm']")) {
          // лицензия МО
          options.time_percent_lic_mo = '' + (50 / 100);
        } else {
          // лицензия О
          options.time_percent_lic_mo = '' + (75 / 100);
        }
        var time_zone = 3 + new Date().getTimezoneOffset() / 60;
        if (new Date(2011, 0, 11).getTimezoneOffset() != new Date(2011, 6, 3).getTimezoneOffset())
          time_zone += 1;

        // взять дату
        var time_server_day = new Date(Date.parse(new Date()) + time_zone * 60 * 60 * 1000);
        time_server_day = Date.parse(new Date(time_server_day.getFullYear(), time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds()));
        form_f2 = form_f2.querySelectorAll("td");
        var time_lic_mo_max = 0;
        for (var i = form_f2.length; i--;) {
          if (form_f2[i].innerHTML.indexOf("<td") != -1) {
            continue;
          }
          var time_lic_mo = texts.regexp_lic_mo.exec(form_f2[i].innerHTML);
          if (time_lic_mo) {
            var time_lic_exp;
            if (url.match('lordswm')) {
              // дата истечения срока 05-31-13 23:25
              time_lic_exp = Date.parse(new Date(Number(time_lic_mo[3]) + 2000, Number(time_lic_mo[1]) - 1, Number(time_lic_mo[2]), Number(time_lic_mo[4]), Number(time_lic_mo[5])));
            } else {
              // 31-05-13 23:25
              time_lic_exp = Date.parse(new Date(Number(time_lic_mo[3]) + 2000, Number(time_lic_mo[2]) - 1, Number(time_lic_mo[1]), Number(time_lic_mo[4]), Number(time_lic_mo[5])));
            }
            if (time_lic_exp > time_lic_mo_max) {
              time_lic_mo_max = time_lic_exp;
              options.time_percent_lic_mo_exp = '' + (time_cur + time_lic_mo_max - time_server_day);
              options.time_percent_lic_mo_title = time_lic_mo[0];
            }
          }
        }
      } else {
        options.time_percent_lic_mo = '1';
        options.time_percent_lic_mo_exp = '1300000000000';
        options.time_percent_lic_mo_title = '';
      }
    }
  }

  function checkWar(){
    if(gm_get_bool("unknown_war_unload") && pl_id != 'unknown'){
      gm_set_bool(pl_id+"_war_unload", true);
      gm_del("unknown_war_unload");
    }

    if (gm_get_bool(pl_id+"_war_unload")) {
      var bselect_link = document.querySelector("a[href='bselect.php']");
      if (!bselect_link) {
        bselect_link = document.querySelector("a[href='plstats.php']");
      }
      if (bselect_link && bselect_link.parentNode.innerHTML.indexOf("#ff0000") === -1) {
        gm_del(pl_id+"_war_unload");
        if (options.map_thief_ambush == 'true') {
          if (army_percent < 100) {
            options.time_gv_end = '' + (time_cur + 60 * 60000 * options.time_percent_faster * options.time_percent_prem);
            options.time_gv_end_yes = 'no';
          } else {
            options.time_gv_end = '1300000000000';
            options.time_gv_end_yes = 'yes';
          }
        }
        if (options.map_hunter == 'true') {
          options.time_go_end_yes = 'no';
          if (time_server && time_server.getHours() < 8) {
            options.time_go_end = '' + (time_cur + 20 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo);
          } else {
            options.time_go_end = '' + (time_cur + 40 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo);
          }
        }
        if (army_percent == 100 && options.gl_attack != 'true') {
          options.time_work_trudogolik = '0';
        }
        options.gl_attack = 'false';
        options.map_thief_ambush = 'false';
        options.map_hunter = 'false';
      }
    }
  }

  function checkJustWork(){
    if (location.pathname == '/object_do.php') {
      if (b.innerHTML.match(texts.work_obj_do)) {
        options.time_work_end = '' + (time_cur + 60 * 60000);
        options.time_work_end_yes = 'no';
        options.time_work_trudogolik = '' + (Number(options.time_work_trudogolik) + 1);
        var object_id = /id=(\d+)/.exec(url_cur);
        if (object_id) {
          options.object_id = '' + object_id[1];
        }
      }
    }
  }

  function checkWork(){
    if (location.pathname == '/object-info.php') {
      var parent_trud = document.querySelector("a[href*='objectworkers.php']");
      if (parent_trud) {
        var regexp_workaholic = new RegExp('\\*\\&nbsp;0\\.(\\d) ' + texts.workaholic_penalty_regexp);
        // отработано смен
        var workaholic_WORK = Number(options.time_work_trudogolik);
        if (regexp_workaholic.exec(b.innerHTML)) {
          regexp_workaholic = Number(regexp_workaholic.exec(b.innerHTML)[1]);
          if (regexp_workaholic == 8) {
            workaholic_WORK = 11;
          } else if (regexp_workaholic == 6) {
            workaholic_WORK = 12;
          } else if (regexp_workaholic == 4) {
            workaholic_WORK = 13;
          } else if (regexp_workaholic == 2) {
            workaholic_WORK = 14;
          } else if (regexp_workaholic == 1 && workaholic_WORK < 15) {
            workaholic_WORK = 15;
          }
          options.time_work_trudogolik = '' + workaholic_WORK;
        } else if (workaholic_WORK > 10) {
          workaholic_WORK = 10;
          options.time_work_trudogolik = '' + workaholic_WORK;
        }
        var add_trud = document.createElement('span');
        if (workaholic_WORK == 9 || workaholic_WORK == 10) {
          // выделить цветом
          add_trud.setAttribute('style', 'color:red; font-weight:bold;');
        } else if (workaholic_WORK > 10) {
          texts.workaholic_text1 = texts.workaholic_text1_replace;
        }
        // осталось работать
        var workaholic_ENROLL = Math.abs(11 - workaholic_WORK);
        if (workaholic_WORK > 14) {
          workaholic_ENROLL = workaholic_ENROLL + '+';
        }
        // правильные окончания слов
        if (!url.match('lordswm')) {
          if (workaholic_WORK == 9 || workaholic_WORK == 8 || workaholic_WORK == 7) {
            texts.workaholic_text2 += '\u0430';
          } else if (workaholic_WORK == 10) {
            texts.workaholic_text2 += '\u043E';
          }
        }
        if (options.time_work_trudogolik_off == '0') {
          if (options.time_work_trudogolik_show == '1' && workaholic_WORK != 9 && workaholic_WORK != 10) {
          } else {
            add_trud.innerHTML = texts.workaholic_penalty + texts.workaholic_text1 + workaholic_ENROLL + texts.workaholic_text2 + texts.workaholic_text3;
            parent_trud = parent_trud.parentNode.previousSibling.previousSibling;
            parent_trud.parentNode.insertBefore(add_trud, parent_trud);
          }
        }
        // замена "Уже устроен"
        parent_trud = document.querySelector("a[href*='objectworkers.php']").parentNode.parentNode;
        if ((time_cur > Number(options.time_work_end)) && (parent_trud.innerHTML.match(texts.uze_ustroen) || (texts.uze_ustroen = parent_trud.innerHTML.match(texts.uze_ustroen2)) || (texts.uze_ustroen = parent_trud.innerHTML.match(texts.uze_ustroen3)))) {
          parent_trud.innerHTML = parent_trud.innerHTML.replace(texts.uze_ustroen, '<style>@-webkit-keyframes blink {80% {opacity:0.0;}} @-moz-keyframes blink {80% {opacity:0.0;}} @-o-keyframes blink {80% {opacity:0.0;}} @keyframes blink {80% {opacity:0.0;}}</style><font color=blue style="-webkit-animation: blink 1s steps(1,end) 0s infinite; -moz-animation: blink 1s steps(1,end) 0s infinite; -o-animation: blink 1s steps(1,end) 0s infinite; animation: blink 1s steps(1,end) 0s infinite"><b>' + texts.uze_ustroen + '</b></font>');
        }
      }
    }

    workaholic_WORK = options.time_work_trudogolik;
    if (workaholic_WORK) {
      if (texts.gr_title)
        texts.gr_title += '\n';
      texts.gr_title += texts.workaholic_penalty + ": " + (11 - Number(workaholic_WORK));
      var title_gr = $('pers_w');
      title_gr.title = texts.gr_title;
      if (options.time_work_trudogolik_off == '0' && workaholic_WORK > 10)
        title_gr.style.color = '#ff9c00';
    }
  }

  function checkMercenary(){
    if (location.pathname == '/mercenary_guild.php') {
      var time_gn;
      if (document.querySelector("a[href^='/mercenary_guild.php?action=accept']")) {
        options.time_gn_end = '1300000000000';
        options.time_gn_end_yes = 'yes';
      } else if ((time_gn = texts.regexp_timegn0.exec(b.innerHTML)) || (time_gn = texts.regexp_timegn1.exec(b.innerHTML)) || (time_gn = texts.regexp_timegn2.exec(b.innerHTML)) || (time_gn = texts.regexp_timegn3.exec(b.innerHTML)) || (time_gn = texts.regexp_timegn4.exec(b.innerHTML)) || (time_gn = texts.regexp_timegn5.exec(b.innerHTML))) {
        time_gn = Number(time_gn[1]);
        if (texts.regexp_timegn0.exec(b.innerHTML) && (time_gn == 19 || time_gn == 13))
          time_gn++;
        time_gn = time_gn * 60000; // в миллисекундах
        var time_gn_temp = time_gn - Math.abs(Number(options.time_gn_end) - time_cur);
        if (Math.abs(time_gn_temp) > 70000) {
          var reputation_gn = texts.regexp_gn_rep.exec(b.innerHTML);
          reputation_gn = (40 - Number(reputation_gn[1]) * 2) * options.time_percent_faster * options.time_percent_prem * 60000;
          // в миллисекундах
          time_gn_temp = time_gn - reputation_gn;
          if (Math.abs(time_gn_temp) > 70000) {
            options.time_gn_end = '' + (time_cur + time_gn);
            options.time_gn_end_yes = 'no';
          } else {
            options.time_gn_end = '' + (time_cur + reputation_gn);
            options.time_gn_end_yes = 'no';
          }
        }
      }
      // options.grandma = '1';
      if (b.innerHTML.match('¬ы получаете') || b.innerHTML.match('You receive')) {
        var flash_heart = document.querySelector("object > param[value*='mercenary.swf']");
        if (flash_heart) {
          var rand_f;
          if (new Date().getHours() == 23) {
            rand_f = "d8EWAZm.jpg";
          } else if (options.grandma) {
            var img_win = new Array("3xVyD9G.jpg", "rdc2phi.jpg", "4Sz0fZh.jpg", "EeSup0D.jpg", "cfqFars.jpg", "HCuDAHi.jpg", "pYaFMyE.jpg");
            rand_f = Math.floor(Math.random() * img_win.length);
            rand_f = img_win[rand_f];
          }
          if (rand_f) {
            flash_heart.parentNode.style.display = 'none';
            var add_el = document.createElement('img');
            add_el.height = "150";
            add_el.width = "150";
            add_el.src = "https://i.imgur.com/" + rand_f;
            flash_heart.parentNode.parentNode.appendChild(add_el);
          }
        }
      }
    }
  }
  function checkLeaderGuild(){
    if (location.pathname.indexOf('/leader_') == 0 ) {
      var gl_button_action_attack = document.querySelectorAll("form[name='f'] input[type='submit']");
      for (var i = gl_button_action_attack.length; i--;) {
        addEvent(gl_button_action_attack[i], "click", onclick_gl_attack);
      }
    }
  }

  function onclick_gl_attack(){
    updateOption("gl_attack", 'true');
  }

  function checkRangerGuild(){
    if (location.pathname == '/ranger_guild.php') {
      if (document.querySelector("a[href^='ranger_guild.php?action=accept']")) {
        options.map_thief_ambush = 'false';
        options.time_gv_end = '1300000000000';
        options.time_gv_end_yes = 'yes';
        options.gv_or_gre = '1';
      }
      var time_gv = texts.regexp_timegre.exec(b.innerHTML);
      if (time_gv) {
        time_gv = Number(time_gv[1]) * 60000; // в миллисекундах
        var time_gv_temp = time_gv - Math.abs(Number(options.time_gv_end) - time_cur);
        if (Math.abs(time_gv_temp) > 70000) {
          options.map_thief_ambush = 'false';
          options.time_gv_end = '' + (time_cur + time_gv);
          options.time_gv_end_yes = 'no';
          options.gv_or_gre = '1';
        }
      }
    }
    if (location.pathname == '/ranger_list.php') {
      var link_ranger_attack = document.querySelectorAll("a[href^='ranger_attack.php?join']");
      if (link_ranger_attack.length > 0) {
        options.map_thief_ambush = 'false';
        options.time_gv_end = '1300000000000';
        options.time_gv_end_yes = 'yes';
        options.gv_or_gre = '1';
        for (var i = link_ranger_attack.length; i--;) {
          addEvent(link_ranger_attack[i], "click", set_thief_ambush);
        }
      }
    }
  }
  function checkModWorkebench(){
    //???
    if (location.pathname == '/mod_workbench.php' && time_server) {
      if (texts.regexp_sm.exec(b.innerHTML)) {
        var time_zone = 3 + new Date().getTimezoneOffset() / 60;
        if (new Date(2011, 0, 11).getTimezoneOffset() != new Date(2011, 6, 3).getTimezoneOffset()) time_zone += 1;
        // вз¤ть дату
        var time_server_day = new Date(Date.parse(new Date()) + time_zone * 60 * 60 * 1000);
        time_server_day = Date.parse(new Date(0, time_server_day.getMonth(), time_server_day.getDate(), time_server.getHours(), time_server.getMinutes(), time_server.getSeconds()));
        var all_td_mod = document.querySelectorAll("td");
        var t_sm_mass = [];
        for (var i = all_td_mod.length; i--;) {
          if (all_td_mod[i].innerHTML.indexOf("<td") != -1) {
            continue;
          }
          var time_sm = texts.regexp_sm.exec(all_td_mod[i].innerHTML);
          if (time_sm) {
            // 31-06 17:43
            time_sm = Date.parse(new Date(0, Number(time_sm[2]) - 1, Number(time_sm[1]), Number(time_sm[3]), Number(time_sm[4]), 0));
            t_sm_mass.push(time_sm - time_server_day);
          }
        }
        t_sm_mass.sort(function(a, b) {
          return a - b;
        });
        options.time_sm_end = '' + (time_cur + t_sm_mass[0] + 60000);
        options.time_sm_end_yes = 'no';
      } else {
        options.time_sm_end = '1300000000000';
        options.time_sm_end_yes = 'yes';
      }
    }
  }

  function checkMap(){
    if (location.pathname == '/map.php') {
      checkMapThief();
      checkMapRanger();
      checkMapHunter();
    }
  }

  function checkMapThief(){
    var thief_ambush_cancel = document.querySelector("a[href^='thief_ambush_cancel.php']");
    if (thief_ambush_cancel) {
      options.map_thief_ambush = 'true';
      options.time_gv_end = '1300000000000';
      options.time_gv_end_yes = 'yes';
      options.gv_or_gre = '0';
      addEvent(thief_ambush_cancel, "click", function(event) {
        updateOption("map_thief_ambush", 'false');
      });
    }
    if (document.querySelector("a[href='ecostat.php']")) {
      if (options.gv_or_gre == '0' && !thief_ambush_cancel) {
        options.map_thief_ambush = 'false';
      }
      if (options.gv_or_gre == '1' && !document.querySelector("a[href='ranger_guild.php']")) {
        options.map_thief_ambush = 'false';
      }
    }
    var form_thief_ambush = document.querySelector("form[action='thief_ambush.php']");
    if (form_thief_ambush) {
      options.map_thief_ambush = 'false';
      options.time_gv_end = '1300000000000';
      options.time_gv_end_yes = 'yes';
      options.gv_or_gre = '0';
      var input_form_thief_ambush = form_thief_ambush.querySelector("input[type='submit']");
      addEvent(input_form_thief_ambush, "click", set_thief_ambush);
    }
  }

  function checkMapRanger(){
    var form_ranger_attack = document.querySelector("form[action='ranger_attack.php']");
    if (form_ranger_attack) {
      options.map_thief_ambush = 'false';
      options.time_gv_end = '1300000000000';
      options.time_gv_end_yes = 'yes';
      options.gv_or_gre = '1';
      var input_form_ranger_attack = form_ranger_attack.querySelector("input[type='submit']");
      addEvent(input_form_ranger_attack, "click", function(event) {
        updateOption("map_thief_ambush", 'true');
      });
      if (options.gre_check == '1') {
        options.map_thief_ambush = 'true';
        setTimeout(function() {
          form_ranger_attack.submit();
        }, 500);
      }
    }
  }

  function checkMapHunter(){
    var temp_nl = document.querySelectorAll("img[src*='map/nl']");
    if (temp_nl.length > 0 && !document.querySelector("img[src*='css/loading.gif']")) {
      options.map_hunter = 'false';
      options.time_go_end = '1310000000000';
      options.time_go_end_yes = 'yes';
      for (var i = temp_nl.length, temp_parent, temp_child; i--;) {
        temp_parent = temp_nl[i];
        while (temp_parent.tagName != 'TR') {
          temp_parent = temp_parent.parentNode;
        }
        if (temp_parent.parentNode.querySelector("a[href^='map.php?action=skip']")) break;
        temp_parent = temp_parent.nextSibling;
        temp_child = temp_parent.firstChild.innerHTML;
        temp_parent.innerHTML = '<td colspan="2" align="left" width="100%"><table border="0" width="100%"><tbody><tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center">' + temp_child + '</td><td align="right" valign="top"><a href="map.php?action=skip">' + (url.match('lordswm') ? "Pass by " : "пройти мимо") + '</a>&nbsp;</td></tr></tbody></table></td>';
      }
    }
    var delta2 = /Delta2 = (\d+)/.exec(b.innerHTML);
    if (b.innerHTML.match(texts.regexp_go_timer) && delta2) {
      options.map_hunter = 'false';
      options.time_go_end = '' + (time_cur + delta2[1] * 1000);
      options.time_go_end_yes = 'no';
      if (options.go_timer_hide == '1') {
        var elem = document.createElement('script');
        elem.type = "text/javascript";
        elem.innerHTML = inj_314.toString() + "inj_314()";
        document.querySelector("head").appendChild(elem);
      }
    }
    var go_link_action_attack = document.querySelectorAll("a[href^='map.php?action=attack']");
    for (var j = go_link_action_attack.length; j--;) {
      addEvent(go_link_action_attack[j], "click", onclick_hunter_attack);
    }
    var go_link_action_skip = document.querySelectorAll("a[href^='map.php?action=skip']");
    for (var k = go_link_action_skip.length; k--;) {
      addEvent(go_link_action_skip[k], "click", onclick_hunter_skip);
    }
    var go_link_help = document.querySelectorAll("a[onclick^='return print_friends']");
    for (var l = go_link_help.length; l--;) {
      addEvent(go_link_help[l], "click", onclick_hunter_help_delay);
    }
    if (b.innerHTML.match(texts.regexp_map_go) && options.time_go_end == '1310000000000') {
      options.time_go_end_yes = 'no';
      var time_cur_now = new Date().getTime();
      if (time_server && (new Date(time_server.getTime() + time_cur_now - time_cur).getHours()) < 8) {
        options.time_go_end = '' + (time_cur_now + 10 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo + 1000);
      } else {
        options.time_go_end = '' + (time_cur_now + 20 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo + 1000);
      }
    }
  }

  function onclick_hunter_attack(){
    updateOption("map_hunter", 'true');
  }
  function onclick_hunter_skip(){
    loadOptions();
    options.time_go_end_yes = 'no';
    var time_cur_now = new Date().getTime();
    if (time_server && (new Date(time_server.getTime() + time_cur_now - time_cur).getHours()) < 8) {
      options.time_go_end = '' + (time_cur_now + 10 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo + 1000);
    } else {
      options.time_go_end = '' + (time_cur_now + 20 * 60000 * options.time_percent_faster * options.time_percent_prem * options.time_percent_lic_mo + 1000);
    }
    saveOptions();
  }

  function onclick_hunter_help_delay(){
    setTimeout( onclick_hunter_help, 200);
  }

  function onclick_hunter_help() {
    var form_go_link_help = document.querySelectorAll("form[action='/map.php']");
    for (var i = form_go_link_help.length; i--;) {
      var input_form_go_link_help = form_go_link_help[i].querySelector("input[type='submit']");
      addEvent(input_form_go_link_help, 'click', onclick_hunter_attack);
    }
  }
  function set_thief_ambush(){
    updateOption("map_thief_ambush", 'true');
  }

  function inj_314() {
    window.Refresh2 = function() {};
    var temp_314 = document.getElementById('next_ht');
    if(temp_314){
      while (temp_314.tagName != 'TABLE') {
        temp_314 = temp_314.parentNode;
      }
      temp_314.parentNode.removeChild(temp_314.previousSibling);
      temp_314.parentNode.removeChild(temp_314.previousSibling);
      temp_314.parentNode.removeChild(temp_314);
    }
  }

  function addEvents(){
    var title_hl = $('pers_h');
    addEvent(title_hl, "click", function(event) {
      if (options.time_health_alert == 'yes') {
        updateOption("time_health_alert", 'no');
        title_hl.style.color = '#f5c137';
        title_hl.title = texts.health_alert_tn;
      } else {
        updateOption("time_health_alert", 'yes');
        title_hl.style.color = '#ff9c00';
        title_hl.title = texts.health_alert_ty;
      }
    });
    if (options.time_health_alert == 'yes') {
      title_hl.style.color = '#ff9c00';
      title_hl.title = texts.health_alert_ty;
    } else {
      title_hl.title = texts.health_alert_tn;
    }
    var title_gr = $('a_pers_w');
    addEvent(title_gr, "click", function(event) {
      if (options.time_work_alert == 'yes') {
        updateOption("time_work_alert", 'no');
        loadOptions();
        title_gr.style.color = '#f5c137';
        title_gr.title = texts.work_alert_tn;
      } else {
        loadOptions();
        updateOption("time_work_alert", 'yes');
        title_gr.style.color = '#FF0000';
        title_gr.title = texts.work_alert_ty;
      }
    });
    if (options.time_work_alert == 'yes') {
      title_gr.style.color = '#FF0000';
      title_gr.title = texts.work_alert_ty;
    } else {
      title_gr.title = texts.work_alert_tn;
    }
    var title_sm = $('a_pers_sm');
    addEvent(title_sm, "click", function(event) {
      if (options.time_sm_alert == 'yes') {
        updateOption("time_work_alert", 'no');
        title_sm.style.color = '#f5c137';
        title_sm.title = texts.sm_alert_tn;
      } else {
        updateOption("time_work_alert", 'yes');
        title_sm.style.color = '#FF0000';
        title_sm.title = texts.sm_alert_ty;
      }
    });
    if (options.time_sm_alert == 'yes') {
      title_sm.style.color = '#FF0000';
      title_sm.title = texts.sm_alert_ty;
    } else {
      title_sm.title = texts.sm_alert_tn;
    }
    var title_gn = $('a_pers_gn');
    addEvent(title_gn, "click", function(event) {
      if (options.time_gn_alert == 'yes') {
        updateOption("time_gn_alert", 'no');
        title_gn.style.color = '#f5c137';
        title_gn.title = texts.gn_alert_tn;
      } else {
        updateOption("time_gn_alert", 'yes');
        title_gn.style.color = '#FF0000';
        title_gn.title = texts.gn_alert_ty;
      }
    });
    if (options.time_gn_alert == 'yes') {
      title_gn.style.color = '#FF0000';
      title_gn.title = texts.gn_alert_ty;
    } else {
      title_gn.title = texts.gn_alert_tn;
    }
    var title_go = $('a_pers_go');
    addEvent(title_go, "click", function(event) {
      if (options.time_go_alert == 'yes') {
        updateOption("time_go_alert", 'no');
        title_go.style.color = '#f5c137';
        title_go.title = texts.go_alert_tn;
      } else {
        updateOption("time_go_alert", 'yes');
        title_go.style.color = '#FF0000';
        title_go.title = texts.go_alert_ty;
      }
    });
    if (options.time_go_alert == 'yes') {
      title_go.style.color = '#FF0000';
      title_go.title = texts.go_alert_ty;
    } else {
      title_go.title = texts.go_alert_tn;
    }
    var title_gv = $('a_pers_gv');
    addEvent(title_gv, "click", function(event) {
      if (options.time_gv_alert == 'yes') {
        updateOption("time_gv_alert", 'no');
        title_gv.style.color = '#f5c137';
        title_gv.title = texts.gv_alert_tn;
      } else {
        updateOption("time_gv_alert", 'yes');
        title_gv.style.color = '#FF0000';
        title_gv.title = texts.gv_alert_ty;
      }
    });
    if (options.time_gv_alert == 'yes') {
      title_gv.style.color = '#FF0000';
      title_gv.title = texts.gv_alert_ty;
    } else {
      title_gv.title = texts.gv_alert_tn;
    }
  }
  function showTimers(){
    if (heart_scale) {
      var time_l = Math.floor( ( heart_scale * 1000 / 100 ) * ( 100 - army_percent ) );
      time.h = Math.floor( time_l / 1000 );
      if ( army_percent < 100 )
        showtime( 'h' );
    }
    var time_work_end = Number(options.time_work_end);
    if (time_cur < time_work_end) {
      time.w = time_work_end;
      if (Math.floor((time_work_end - time_cur) / 1000) < 3601) {
        showtime('w');
      } else {
        options.time_work_end = '1300000000000';
        options.time_work_end_yes = 'yes';
      }
    } else {
      options.time_work_end = '1300000000000';
      options.time_work_end_yes = 'yes';
    }
    var time_sm_end = Number(options.time_sm_end);
    if (time_cur < time_sm_end) {
      time.sm = Math.floor((time_sm_end - time_cur) / 1000);
      showtime('sm');
    } else {
      options.time_sm_end = '1300000000000';
      options.time_sm_end_yes = 'yes';
    }
    var time_gn_end = Number(options.time_gn_end);
    if (time_cur < time_gn_end) {
      time.gn = Math.floor((time_gn_end - time_cur) / 1000);
      if (time.gn < 54000) {
        showtime('gn');
      } else {
        options.time_gn_end = '1300000000000';
        options.time_gn_end_yes = 'yes';
      }
    } else {
      options.time_gn_end = '1300000000000';
      options.time_gn_end_yes = 'yes';
    }
    var time_go_end = Number(options.time_go_end);
    if (time_cur < time_go_end) {
      time.go = Math.floor((time_go_end - time_cur) / 1000);
      if (time.go < 2401) {
        showtime('go');
      } else {
        options.time_go_end = '1300000000000';
        options.time_go_end_yes = 'yes';
      }
    }
    // else { options.time_go_end = '1300000000000'; options.time_go_end_yes = 'yes'; }
    var time_gv_end = Number(options.time_gv_end);
    if (time_cur < time_gv_end) {
      time.gv = Math.floor((time_gv_end - time_cur) / 1000);
      if (time.gv < 3601) {
        showtime('gv');
      } else {
        options.time_gv_end = '1300000000000';
        options.time_gv_end_yes = 'yes';
      }
    } else {
      options.time_gv_end = '1300000000000';
      options.time_gv_end_yes = 'yes';
    }
  }

  function signal(msg, sound){
    if(options.disable_multiple_alarms == '1'){
      var time_curr = Date.now();
      var time_prev = gm_get_num(pl_id + "_last_notify", 0);
      if( time_prev + disable_alarm_delay*1000 > time_curr )
        return;
      gm_set(pl_id + "_last_notify", time_curr);
    }
    switch(gm_get(pl_id + "_notify", '0')){
      case '0':
        sound.play();
        break;
      case '1':
        alert( msg );
        break;
      case '2':
        sound.play();
        alert( msg );
        break;
      default: //including '3'
    }
  }

  function showtime(t) {
    var el = $('pers_' + t);
    var ct;
    if (t == 'h') {
      ct = --time.h;
    } else if (t == 'm') {
      ct = --time.m;
    } else if (t == 'w') {
      ct = Math.floor((time.w - new Date().getTime()) / 1000);
    } else if (t == 'gn') {
      ct = --time.gn;
    } else if (t == 'go') {
      ct = --time.go;
    } else if (t == 'sm') {
      ct = --time.sm;
    } else if (t == 'gv') {
      ct = --time.gv;
    }
    if(ct < 0)
      ct = 0;
    var dd = Math.floor(ct / 86400);
    var dh = Math.floor((ct - dd * 86400) / 3600);
    var dm = Math.floor((ct - dd * 86400 - dh * 3600) / 60);
    var ds = ct % 60;
    el.innerHTML = (dd === 0 ? '' : ((dd < 10) ? '0' : '') + dd + ':') + (dd === 0 && dh === 0 ? '' : ((dh < 10) ? '0' : '') + dh + ':') + ((dm < 10) ? '0' : '') + dm + ':' + ((ds < 10) ? '0' : '') + ds;
    if (ct === 0) {
      loadOptions();
      if (t == 'h') {
        var title_hl = $('pers_h');
        title_hl.style.color = '#f5c137';
        title_hl.title = texts.health_alert_tn;
        if (options.time_health_alert == 'yes') {
          options.time_health_alert = 'no';
          setTimeout(function() {signal(texts.alert_health, audio_h);}, 100);
        }
      }
      if (t == 'w' && options.time_work_end_yes != 'yes' && options.time_work_alert == 'yes') {
        options.time_work_end_yes = 'yes';
        setTimeout(function() {signal(texts.alert_work, audio_gr);}, 100);
      }
      if (t == 'sm' && options.time_sm_end_yes != 'yes' && options.time_sm_alert == 'yes') {
        options.time_sm_end_yes = 'yes';
        setTimeout(function() {signal(texts.alert_sm, audio_gk);}, 100);
      }
      if (t == 'gn' && options.time_gn_end_yes != 'yes' && options.time_gn_alert == 'yes') {
        options.time_gn_end_yes = 'yes';
        setTimeout(function() {signal(texts.alert_gn, audio_gonv);}, 100);
      }
      if (t == 'go' && options.time_go_end_yes != 'yes' && options.time_go_alert == 'yes') {
        options.time_go_end_yes = 'yes';
        setTimeout(function() {signal(texts.alert_go, audio_gonv);}, 100);
      }
      if (t == 'gv' && options.time_gv_end_yes != 'yes' && options.time_gv_alert == 'yes') {
        options.time_gv_end_yes = 'yes';
        setTimeout(function() {signal(texts.alert_gv, audio_gonv);}, 100);
      }
      saveOptions();
      return;
    }
    if (ct < 0) {
      el.innerHTML = '00:00';
      return;
    }
    setTimeout(function() {
      showtime(t);
    }, 999);
  }


  function settings_close() {
    var bg = $(gm_prefix+'bgOverlay');
    var bgc = $(gm_prefix+'bgCenter');
    bg.parentNode.removeChild(bg);
    bgc.parentNode.removeChild(bgc);
  }

  function settings() {
    var bg = $(gm_prefix+'bgOverlay');
    var bgc = $(gm_prefix+'bgCenter');
    var bg_height = ScrollHeight();
    if (!bg) {
      bg = document.createElement('div');
      document.body.appendChild(bg);
      bgc = document.createElement('div');
      document.body.appendChild(bgc);
    }
    bg.id = gm_prefix+'bgOverlay';
    bg.style.position = 'absolute';
    bg.style.left = '0px';
    bg.style.width = '100%';
    bg.style.background = "#000000";
    bg.style.opacity = "0.5";
    bg.style.zIndex = "1100";
    bgc.id = gm_prefix+'bgCenter';
    bgc.style.position = 'absolute';
    bgc.style.left = ((ClientWidth() - 650) / 2) + 'px';
    bgc.style.width = '680px';
    bgc.style.background = "#F6F3EA";
    bgc.style.zIndex = "1105";
    addEvent(bg, "click", settings_close);

    loadOptions();

    bgc.innerHTML = '<div style="border:3px solid #abc; padding:10px; margin:2px; ">' +
      '<div style="float:right; border:1px solid #abc; width:15px; height:15px; text-align:center; cursor:pointer; " id="'+gm_prefix+'bt_close_tr" title="Close">x</div>' +
      '<table>'+
      '<tr><td align="center"><b><b style="text-decoration: none; color: #1199FF;"> Настройки. ТАЙМЕРЫ ГИЛЬДИЙ. </b>  Автор: <b>Demin</b> (fix CheckT)</td></tr>'+
      '<tr><td align="center"> <b>' + texts.st_start + '</b> </td>' +
      '<tr><td>' + texts.st_show_timers + '&nbsp;&nbsp;' + texts.gr_t + ':<input type=checkbox ' + add_checked(options.gr_show_check) + ' id=gr_show_check_id title="">' +
      '&nbsp;&nbsp;' + texts.gk_t + ':<input type=checkbox ' + add_checked(options.gk_show_check) + ' id=gk_show_check_id title="">' +
      '&nbsp;&nbsp;' + texts.gn_t + ':<input type=checkbox ' + add_checked(options.gn_show_check) + ' id=gn_show_check_id title="">' +
      '&nbsp;&nbsp;' + texts.go_t + ':<input type=checkbox ' + add_checked(options.go_show_check) + ' id=go_show_check_id title="">' +
      '&nbsp;&nbsp;' + texts.gv_t + ' (' + texts.gre_t + ')' + ':<input type=checkbox ' + add_checked(options.gv_show_check) + ' id=gv_show_check_id title=""></td></tr>' +
      '<tr><td>' + texts.st_gre_check + ': <input type=checkbox ' + add_checked(options.gre_check) + ' id=gre_check_id title=""></td></tr>' +
      '<tr><td>' + texts.st_go_timer_hide + ' "<i>' + texts.regexp_go_timer + ' ..</i>": <input type=checkbox ' + add_checked(options.go_timer_hide) + ' id=go_timer_hide_id title=""></td></tr>' +
      '<tr><td>' + texts.st_work_trudogolik_off + ': <input type=checkbox ' + add_checked(options.time_work_trudogolik_off) + ' id=trudogolik_off_id title=""></td></tr>' +
      '<tr><td>' + texts.st_work_trudogolik_show + ': <input type=checkbox ' + add_checked(options.time_work_trudogolik_show) + ' id=trudogolik_show_id title=""></td></tr>' +
      '<tr><td>' + texts.st_disable_multiple_alarms + ': <input type=checkbox ' + add_checked(options.disable_multiple_alarms) + ' id=disable_multiple_alarms_id title=""></td></tr>' +
      '<tr><td>' + texts.st_predupr_pa + '</td></tr>' +
      '<tr><td>' + texts.st_predupr_go_lic + '</td></tr>' +
      '<tr><td>' + texts.st_percent_faster + ' <input id="gv_n_percent" value="' +
      (100 - options.time_percent_faster * 100) +
      '" style="width: 25px;" maxlength="2"> <b>%</b> <input type="submit" id="gv_n_percent_ok" value="ok"></td></tr>' +
      '<tr><td>' + texts.st_gv_n_time + ' <input id="gv_n_time" value="' +
      (60 * options.time_percent_faster * options.time_percent_prem) +
      '" style="width: 25px;" maxlength="2"> <b>min</b> <input type="submit" id="gv_n_time_ok" value="ok"></td></tr>' +
      '<tr><td> <input type="submit" id="null_tr_id" value="' + texts.st_null_timers + '">&nbsp;&nbsp;&nbsp;' +
      '</td></tr>' +
      '<tr><td>'+
        texts.alarm_mode +
          ' <input type="radio" name="r_notify_type" id="r_notify_0">'+texts.alarm_mode_sound +
          '<input type="radio" name="r_notify_type" id="r_notify_1">'+texts.alarm_mode_alert +
          '<input type="radio" name="r_notify_type" id="r_notify_2">'+texts.alarm_mode_both +
          '<input type="radio" name="r_notify_type" id="r_notify_3">'+texts.alarm_mode_none +
      '</td></tr></td></tr>' +
      '<tr><td><table>' +
      '<tr><td>'+texts.audio_file+texts.gr_t+'</td><td><input size=55 type="text" id="audio_file_gr" value="' + add_audio_value(options.audio_file_gr) +
            '"></td><td><input size=55 type="button" id="play_audio_gr" value="Play!">  </td></tr>' +
      '<tr><td>'+texts.audio_file+texts.gonv_t+'</td><td><input size=55 type="text" id="audio_file_gonv" value="' + add_audio_value(options.audio_file_gonv) +
            '"></td><td><input size=55 type="button" id="play_audio_gonv" value="Play!">  </td></tr>' +
      '<tr><td>'+texts.audio_file+texts.gk_t+'</td><td><input size=55 type="text" id="audio_file_gk" value="' + add_audio_value(options.audio_file_gk) +
            '"></td><td><input size=55 type="button" id="play_audio_gk" value="Play!">  </td></tr>' +
      '<tr><td>'+texts.audio_file+texts.h_t+'</td><td><input size=55 type="text" id="audio_file_h" value="' + add_audio_value(options.audio_file_h) +
            '"></td><td><input size=55 type="button" id="play_audio_h" value="Play!">  </td></tr>' +
      '</table></td></tr>' +
      '</table><table width=100%>' +
      '</table></div>';

    addClickEvent(gm_prefix+"bt_close_tr", settings_close);
    addClickEvent("null_tr_id", null_tr);
    addClickEvent("gv_n_time_ok", gv_n_time_f);
    addClickEvent("gv_n_percent_ok", gv_n_percent_f);
    addClickEvent("gre_check_id", check_gre_f);
    addClickEvent("trudogolik_show_id", trudogolik_show_f);
    addClickEvent("trudogolik_off_id", trudogolik_off_f);
    addClickEvent("disable_multiple_alarms_id", disable_multiple_alarms_f);
    addClickEvent("go_timer_hide_id", go_timer_hide_f);
    addClickEvent("gr_show_check_id", gr_show_check_id_f);
    addClickEvent("gk_show_check_id", gk_show_check_id_f);
    addClickEvent("gn_show_check_id", gn_show_check_id_f);
    addClickEvent("go_show_check_id", go_show_check_id_f);
    addClickEvent("gv_show_check_id", gv_show_check_id_f);
    addChangeEvent("audio_file_gr", change_audio_gr);
    addChangeEvent("audio_file_gonv", change_audio_gonv);
    addChangeEvent("audio_file_gk", change_audio_gk);
    addChangeEvent("audio_file_h", change_audio_h);
    addClickEvent("play_audio_gr", play_audio_gr);
    addClickEvent("play_audio_gonv", play_audio_gonv);
    addClickEvent("play_audio_gk", play_audio_gk);
    addClickEvent("play_audio_h", play_audio_h);
    addClickEvent("r_notify_0", set_notify_type);
    addClickEvent("r_notify_1", set_notify_type);
    addClickEvent("r_notify_2", set_notify_type);
    addClickEvent("r_notify_3", set_notify_type);

    bg.style.top = '0px';
    bg.style.height = bg_height + 'px';
    bgc.style.top = (window.pageYOffset + 150) + 'px';
    bg.style.display = '';
    bgc.style.display = '';

    var notify_type = gm_get(pl_id + "_notify", 0);
    var radioNotify = $('r_notify_'+notify_type);
    if(!radioNotify)
      radioNotify = $('r_notify_0');
      radioNotify.checked=true;
  }

  function add_checked(val){
    return val == '1' ? 'checked' : '';
  }
  function add_audio_value(val){
    return (val && val!='') ? val : '';
  }

  function change_audio_gr(){
    updateOption("audio_file_gr", this.value.trim());
    audio_gr = initAudio(options.audio_file_gr);
  }
  function change_audio_gonv(){
    updateOption("audio_file_gonv", this.value.trim());
    audio_gonv = initAudio(options.audio_file_gonv);
  }
  function change_audio_gk(){
    updateOption("audio_file_gk", this.value.trim());
    audio_gk = initAudio(options.audio_file_gk);
  }
  function change_audio_h(){
    updateOption("audio_file_h", this.value.trim());
    audio_h = initAudio(options.audio_file_h);
  }
  function play_audio_gr(){
    play_audio(options.audio_file_gr);
  }
  function play_audio_gonv(){
    play_audio(options.audio_file_gonv);
  }
  function play_audio_gk(){
    play_audio(options.audio_file_gk);
  }
  function play_audio_h(){
    play_audio(options.audio_file_h);
  }
  function play_audio(src){
    if(src && src != ''){
      var paudio = new Audio();
      paudio.preload = 'auto';
      paudio.src = src;
      paudio.play();
    }else{
      audio_default.play();
    }
  }

  function set_notify_type(e) {
    var checked_radio;
    if (e.target.checked) {
      checked_radio = e.target.getAttribute('id');
      var notify_type = checked_radio? checked_radio.split('_')[2] : '';
      if(checked_radio){
        gm_set(pl_id + "_notify", notify_type);
      }
    }
  }

  function gv_n_time_f() {
    if (Number($("gv_n_time").value) >= 0) {
      loadOptions();
      options.time_gv_end = '' + ((new Date()).getTime() + $("gv_n_time").value * 60000);
      options.time_gv_end_yes = 'no';
      saveOptions();
    }
  }

  function gv_n_percent_f() {
    if (Number($("gv_n_percent").value) >= 0) {
      loadOptions();
      options.time_percent_faster = '' + ((100 - $("gv_n_percent").value) / 100);
      $("gv_n_time").value = (60 * options.time_percent_faster * options.time_percent_prem);
      saveOptions();
    }
  }

  function null_tr() { // обнуление всех таймеров
    loadOptions();
    options.time_work_end = 1300000000000;
    options.time_sm_end = 1300000000000;
    options.time_gn_end = 1300000000000;
    options.time_go_end = 1300000000000;
    options.time_gv_end = 1300000000000;
    options.time_thief_end = 1300000000000;
    saveOptions();
  }

  function save_check(field, key){
    updateOption(key, $(field).checked ? '1' : '0');
  }
  function check_gre_f() {
    save_check('gre_check_id', "gre_check");
  }

  function trudogolik_show_f() {
    save_check('trudogolik_show_id', "time_work_trudogolik_show");
  }

  function trudogolik_off_f() {
    save_check('trudogolik_off_id', "time_work_trudogolik_off");
  }

  function disable_multiple_alarms_f() {
    save_check('disable_multiple_alarms_id', "disable_multiple_alarms");
  }

  function go_timer_hide_f() {
    save_check('go_timer_hide_id', "go_timer_hide");
  }

  function gr_show_check_id_f() {
    loadOptions();
    if ($('gr_show_check_id').checked) {
      options.gr_show_check = '1';
      $("gr_show1").style.display = $("gr_show2").style.display = '';
    } else {
      options.gr_show_check = '0';
      var title_gr = $('a_pers_w');
      options.time_work_alert = 'no';
      title_gr.style.color = '#f5c137';
      title_gr.title = texts.work_alert_tn;
      $("gr_show1").style.display = $("gr_show2").style.display = 'none';
    }
    saveOptions();
  }

  function gk_show_check_id_f() {
    loadOptions();
    if ($('gk_show_check_id').checked) {
      options.gk_show_check = '1';
      $("gk_show1").style.display = $("gk_show2").style.display = '';
    } else {
      options.gk_show_check = '0';
      var title_sm = $('a_pers_sm');
      options.time_sm_alert = 'no';
      title_sm.style.color = '#f5c137';
      title_sm.title = texts.sm_alert_tn;
      $("gk_show1").style.display = $("gk_show2").style.display = 'none';
    }
    saveOptions();
  }

  function gn_show_check_id_f() {
    loadOptions();
    if ($('gn_show_check_id').checked) {
      options.gn_show_check = '1';
      $("gn_show1").style.display = $("gn_show2").style.display = '';
    } else {
      options.gn_show_check = '0';
      var title_gn = $('a_pers_gn');
      options.time_gn_alert = 'no';
      title_gn.style.color = '#f5c137';
      title_gn.title = texts.gn_alert_tn;
      $("gn_show1").style.display = $("gn_show2").style.display = 'none';
    }
    saveOptions();
  }

  function go_show_check_id_f() {
    loadOptions();
    if ($('go_show_check_id').checked) {
      options.go_show_check = '1';
      $("go_show1").style.display = $("go_show2").style.display = '';
    } else {
      options.go_show_check = '0';
      var title_go = $('a_pers_go');
      options.time_go_alert = 'no';
      title_go.style.color = '#f5c137';
      title_go.title = texts.go_alert_tn;
      $("go_show1").style.display = $("go_show2").style.display = 'none';
    }
    saveOptions();
  }

  function gv_show_check_id_f() {
    loadOptions();
    if ($('gv_show_check_id').checked) {
      options.gv_show_check = '1';
      $("gv_show1").style.display = $("gv_show2").style.display = '';
    } else {
      options.gv_show_check = '0';
      var title_gv = $('a_pers_gv');
      options.time_gv_alert = 'no';
      title_gv.style.color = '#f5c137';
      title_gv.title = texts.gv_alert_tn;
      $("gv_show1").style.display = $("gv_show2").style.display = 'none';
    }
    saveOptions();
  }

  function getPlayerId(){
    var hunter_ref = getI("//a[contains(@href, 'pl_hunter_stat')]");
      //min 2 для home; min 1 для остальных - если включены выпадающие вкладки
      //min 1 для home; min 0 для остальных - если отключены выпадающие вкладки
    if ( !hunter_ref || hunter_ref.snapshotLength == 0 || (hunter_ref.snapshotLength == 1 && location.pathname == '/home.php') ) {
        //отключены вкладки или разлогин
      var ids=/pl_id=(\d+)/.exec(document.cookie);
      return ids ? ids[1] : 'unknown';
    } else {
      return hunter_ref.snapshotItem(0).href.split('?id=')[1];
    }
  }

  function isLoggedOff(){
    return location.pathname == '/';
  }

  function ClientHeight() {
    return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientHeight:document.body.clientHeight;
  }

  function ClientWidth() {
    return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
  }

  function ScrollHeight() {
    return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  }

  function $(id) {
    return document.querySelector("#" + id);
  }

  function addClickEvent(id, func){
    var elem = $(id);
    if(elem && func)
      addEvent(elem, "click", func);
  }

  function addChangeEvent(id, func){
    var elem = $(id);
    if(elem && func)
      addEvent(elem, "change", func);
  }

  function addEvent(elem, evType, fn) {
    if(elem){
      if (elem.addEventListener)
        elem.addEventListener(evType, fn, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + evType, fn);
      else
        elem["on" + evType] = fn;
    }
  }

  function initGm(){
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
      this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
      };
      this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
      };
      this.GM_deleteValue=function (key) {
        return delete localStorage[key];
      };
    }
    if (!this.GM_listValues || (this.GM_listValues.toString && this.GM_listValues.toString().indexOf("not supported")>-1)) {
      this.GM_listValues=function () {
        var keys=[];
        for (var key in localStorage){
          keys.push(key);
        }
        return keys;
      };
    }
  }

  function GM_get_once(key, def){
    var val = GM_getValue(key, def);
    GM_deleteValue(key);
    return val;
  }

  function GM_load_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? def : val;
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key){
    var val = Number(GM_getValue(key, 0));
    return isNaN(val) ? false : val==1;
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function gm_get(key, def){
    return GM_getValue(gm_prefix+key, def);
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
  }

  function gm_get_num(key, val){
    return GM_load_num(gm_prefix+key, val);
  }

  function gm_set_bool(key, val){
    return GM_save_num_from_bool(gm_prefix+key, val);
  }

  function gm_get_bool(key, val){
    return GM_load_bool_from_num(gm_prefix+key);
  }

  function gm_del(key){
    var val = GM_getValue(gm_prefix+key);
    GM_deleteValue(gm_prefix+key);
    return val;
  }

  function gm_list(){
    var keys = GM_listValues();
    var filtered = [];
    for ( var i = 0, len = keys.length; i < len; i++ ) {
      var key = keys[i];
      if(key.indexOf(gm_prefix) === 0)
        filtered.push(key);
    }
    return filtered;
  }

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

})();
}catch(e){console.log(e); alert('hwm_time_restore: '+e);}