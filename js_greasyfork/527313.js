// ==UserScript==
// @name         CW: Shed
// @version      1.40
// @description  Сборник небольших дополнений к игре CatWar
// @author       ReiReiRei
// @copyright    2020-2024, Тис (https://catwar.net/cat406811)
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://catwar.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1354145
// @downloadURL https://update.greasyfork.org/scripts/527313/CW%3A%20Shed.user.js
// @updateURL https://update.greasyfork.org/scripts/527313/CW%3A%20Shed.meta.js
// ==/UserScript==
(function (window, document, $) {
  'use strict';
  if (typeof $ === 'undefined') return;
  const version = '1.40';
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  const isDesktop = !$('meta[name=viewport]').length;
  const defaults = {
'on_customChat' : false // Кастомный чат
,'on_chatReverse' : false // "Перевернуть" чат
,'on_actNotif' : false // Уведомления на действия
, 'on_newDM' : false // уведомления на новые лс
, 'on_newChat' : false // уведомления на новое соо в чате (не игровой)
, 'on_chatMention' : false // уведомления на упоминание имени в чате
, 'on_blockNotif' : false // уведомления при нажатии/отжатии блока
, 'on_smellTimerNotif' : true // уведомление при окончании таймера нюха
, 'on_paramInfo' : true // Информация о параметрах при нажатии
, 'on_idDM' : true // Включены по умолчанию: ID в личных сообщениях
, 'on_idCatMouth' : true // ID котов во рту при выборе
, 'on_idItemMouth' : true // ID предметов (и уникальные, и обычные) + инфо
, 'on_idChat' : false // ID в чате Игровой
, 'on_teamFights' : false // Команды в боережиме
, 'on_huntText' : true // Охота с текстом движения дичи
, 'on_huntMobileBtns' : true // Стиль, добавляющий кнопки охоте на телефонах
, 'on_huntMobileFix' : false // Стиль, фиксящий охоту на телефонах
, 'on_cleanerHistory' : false // лог чистки
, 'on_charInline' : true // душевые в одну строчку
, 'on_charHide' : false // скрыть душевых в игровой
, 'on_catsDown' : false // коты внизу клетки
, 'on_nickHighlight' : false // подсвечивание (кастомных) имен в чате
, 'on_moveFightLog' : false // кнопка (и возможность) перемещения лога бр
, 'on_shortFightLog' : false // сокращение лога бр
, 'on_reports' : true // отчеты в блогах
, 'on_oldDialogue' : false // старый вид диалогов (1 колонка в выборе)
, 'on_smellTimer' : false // таймер нюха
, 'on_cuMovesNote' : true // Окно заметок для ВТ
, 'on_settLink' : true // Ссылка на настройки в игровой
, 'on_extraInfo' : false // Доп. инфо о котиках
, 'on_deletionWarning' : false // Предупреждение об удалении
, 'on_historyCleanWarning' : false // Предупреждение о чистке истории TODO
, 'on_css_alternativeDivideGUI' : false // Альтернативный интерфейс разделения травы
 //Громкость звуков
, 'sound_notifEaten' : 0.2 // Звук, когда тебя подняли
, 'sound_notifBeaten' : 0.2 // Звук, когда тебя атакуют
, 'sound_notifEndAct' : 0.1 // Звук, когда заканчивается действие
, 'sound_newDM' : 0.1 // Звук при получении ЛС
, 'sound_newChat' : 0.1 // Звук при получении соо в Чате
, 'sound_chatMention' : 0.3 // Звук при упоминании имени игрока в чате (жёлтым)
, 'sound_blockStart' : 0.1 // Звук при нажатии блока
, 'sound_blockEnd' : 0.1 // Звук при отжатии блока
, 'sound_ttRefresh' : 0.2 // Звук при смене карты
, 'sound_smellTimer' : 0.1 // Звук при окончании таймера нюха
 //Настройки лога чистки
, 'clean_id' : true // Писать в логе ID поднятого
, 'clean_underscore' : false // Подчеркивать "поднял/опустил"
, 'clean_title' : true // Писать в логе должность поднятого
, 'clean_status' : false // Писать в логе должность поднятого
, 'clean_location' : true // Писать в логе локацию, где подняли и где отпустили
, 'clean_action' : false // Писать в логе проверку на действие
 //Массивы
, 'cm_blocked' : [] //Список игроков, от которых не получать уведомления на упоминание в чате
, 'nickListArray' : [] //Список ников игрока
 //Настройки команд в БР
, 'tf_max_height' : 100 // макс высота блока с командами
, 'fight_log_max_height' : 70 // высота лога бр
, 'tf_color_g_team1' : "#41cd70" // зелёный цвет команды 1 (основная) в командах бр
, 'tf_color_g_team2' : "#429dde" // зелёный цвет команды 2 в командах бр
, 'tf_color_g_team3' : "#f6c739" // зелёный цвет команды 3 в командах бр
, 'tf_color_g_team4' : "#ee91d7" // зелёный цвет команды 4 в командах бр
, 'tf_color_r_team1' : "#cd4141" // красный цвет команды 1 (основная) в командах бр
, 'tf_color_r_team2' : "#cd4141" // красный цвет команды 2 в командах бр
, 'tf_color_r_team3' : "#cd4141" // красный цвет команды 3 в командах бр
, 'tf_color_r_team4' : "#cd4141" // красный цвет команды 4 в командах бр
 //Умолчания действий (УВЕДОМЛЕНИЯ)
, 'notif_eaten' : true // Уведомлять, когда тебя съели
, 'notif_attack' : false // Уведомлять, когда тебя ввели в БР через Т2/Т3
 //Умолчания действий - ЗВУК
, 'snd_act_move' : true // Переход
, 'snd_act_eat' : false // Еда
, 'snd_act_need' : true // Нужда
, 'snd_act_drink' : true // Жажда
, 'snd_act_dig' : true // Копать
, 'snd_act_sleep' : true // Спать
, 'snd_act_sniff' : true // Нюхать
, 'snd_act_digin' : true // Закапывать
, 'snd_act_clean' : true // Вылизывать(ся)
, 'snd_act_swim' : true // Поплавать
, 'snd_act_fill_moss' : true // Наполнить водой мох
, 'snd_act_dive' : true // Нырять
, 'snd_act_murr' : true // Помурлыкать
, 'snd_act_tails' : false // Переплести хвосты
, 'snd_act_cheek' : false // Потереться щекой о щёку
, 'snd_act_ground' : false // Повалять по земле
, 'snd_act_rub' : false // Потереться носом о нос
, 'snd_act_calm' : false // Выход из бр
, 'snd_act_watch' : true // Осматривать окрестности
, 'snd_act_marking' : false // Метить территорию
, 'snd_act_clawscratch' : false // Точить когти
, 'snd_act_rug' : false // Чистить ковёр
, 'snd_act_attention' : false // Привлекать внимание
, 'snd_act_domestsleep' : false // Сон в лежанке
, 'snd_act_domesthunt' : false // Грандиозная охота
, 'snd_act_checkup' : false // Осмотреть кота
, 'snd_act_loottr' : true // осмотреть дупло
, 'snd_act_lootcr' : true // осмотреть расщелину
 //Умолчания действий - ТЕКСТ
, 'txt_act_move' : true // Переход
, 'txt_act_eat' : true // Еда
, 'txt_act_need' : true // Нужда
, 'txt_act_drink' : true // Жажда
, 'txt_act_dig' : true // Копать
, 'txt_act_sleep' : true // Спать
, 'txt_act_sniff' : true // Нюхать
, 'txt_act_digin' : true // Закапывать
, 'txt_act_clean' : true // Вылизывать(ся)
, 'txt_act_swim' : true // Поплавать
, 'txt_act_fill_moss' : true // Наполнить водой мох
, 'txt_act_dive' : true // Нырять
, 'txt_act_murr' : true // Помурлыкать
, 'txt_act_tails' : true // Переплести хвосты
, 'txt_act_cheek' : true // Потереться щекой о щёку
, 'txt_act_ground' : true // Повалять по земле
, 'txt_act_rub' : true // Потереться носом о нос
, 'txt_act_calm' : true // Выход из бр
, 'txt_act_watch' : true // Осматривать окрестности
, 'txt_act_marking' : true // Метить территорию
, 'txt_act_clawscratch' : true // Точить когти
, 'txt_act_rug' : true // Чистить ковёр
, 'txt_act_attention' : true // Привлекать внимание
, 'txt_act_domestsleep' : true // Сон в лежанке
, 'txt_act_domesthunt' : true // Грандиозная охота
, 'txt_act_checkup' : true // Осмотреть кота
, 'txt_act_loottr' : true // осмотреть дупло
, 'txt_act_lootcr' : true // осмотреть расщелину
, 'my_id' : '' // Айди для отчетов
 //Минное поле
, 'on_treeTechies' : false // минное поле
, 'tt_folded' : false // сворачивать минное поле
, 'tt_dark_theme' : false // темная тема
, 'tt_show_volume' : true // показывать громкость веток в чате
, 'tt_clean_confirm' : true // подтверждение очистки
, 'tt_notif_refresh' : false // звук при обновлении локи
, 'tt_window_top' : 20 // положение окна относительно верхней части
, 'tt_window_left' : 20 // положение окна относительно левой части
, 'tt_pagenamesArray' : ['1А', '2А', '3А', '4А', '5А', '6А', '1Б', '2Б', '3Б', '4Б', '5Б', '6Б', '1В', '2В', '3В', '4В', '5В', '6В', '1Г', '2Г', '3Г', '4Г', '5Г', '6Г'] //Список названий
, 'tt_pageenabledArray' : [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] //Список включенных , страниц
, 'tt_foldersnamesArray' : ['А', 'Б', 'В', 'Г'] //имена вкладок
, 'tt_foldersenabledArray' : [true, true, true, true] //включение вкладок
 //CSS
, 'on_css_quicksettings' : false // быстрые настройки
, 'on_csslocation' : false // замена фона на определенный
, 'on_css_defects' : false // светить дефекты (но не грязь)
, 'on_css_defects_dirt' : false // светить дефекты (грязь)
, 'on_css_removesky' : false // убрать небо
, 'on_css_oldicons' : false // старые иконки
, 'on_css_coloredparam' : false // цветные параметры и навыки
, 'on_css_cellshade' : false // сетка
, 'on_css_bgpic' : false // картинка на заднем фоне
, 'on_css_bghuntpic' : false // картинка на заднем фоне охоты
, 'on_css_highlightmove' : false // подсветка переходов при наведении
, 'on_css_maxopacity' : false // непрозрачные мертвецы
, 'on_css_newloading' : false // замена гифки загрузки
, 'on_css_hideTooltip' : false // скрыть табличку (для кача лу)
, 'on_css_daylight' : false // всегда день
, 'css_bgpicURL' : 'https://catwar.net/cw3/spacoj/0.jpg' // картинка на заднем плане игровой
, 'css_huntbgpicURL' : 'https://catwar.net/cw3/jagd_img/bg1.png' // картинка на заднем плане игровой
, 'css_locURL' : 'https://catwar.net/cw3/spacoj/170.jpg' // на какой фон заменять
, 'css_cellshadeColor' : '#ffffff' // сетка цвет
, 'css_cellshadeOpacity' : 0.1 // сетка прозрачность
, 'css_theme' : 'theme_classic' // тема
, 'css_cp_pattern' : true // узор в навыках и параметрах
, 'css_cp_colors' : ['#ac23bf', '#d860ea', '#5e1268', '#6f2f79', '#dfab04', '#f0d142', '#845406', '#886921', '#28afd0', '#2bedee', '#165f75', '#157a7d', '#51d74c', '#89df4b', '#327327', '#54842d', '#d22c28', '#ee8761', '#841921', '#913733', '#a65b32', '#f09662', '#62351c', '#804c2d', '#379034', '#51bb39', '#1b4d1b', '#336b24'] // цвета
, 'on_css_hideChat' : false // скрыть чат
  };
  const globals = {}; //Настройки
  for (var key in defaults) {
    let settings = getSettings(key);
    if (settings === null) {
      globals[key] = defaults[key];
    }
    else {
      if (Array.isArray(defaults[key])) {
        globals[key] = JSON.parse(settings);
      }
      else {
        globals[key] = settings;
      }
    }
  }
  const sounds = {};
  sounds.new_message = 'https://catwar.net/new_message.mp3';
  sounds.action_notif = 'https://abstract-class-shed.github.io/cwshed/action_end.mp3';
  sounds.chat_mention = 'https://abstract-class-shed.github.io/cwshed/chat_mention.mp3';
  sounds.alert_attacked = 'https://d.zaix.ru/ihrv.mp3';
  sounds.tt_refresh = 'https://abstract-class-shed.github.io/cwshed/refresh.wav'; //изменить потом
  sounds.block_start = 'https://abstract-class-shed.github.io/cwshed/lock.mp3';
  sounds.block_end = 'https://abstract-class-shed.github.io/cwshed/unlock.mp3';
  const audioGlobal = new Audio();
  audioGlobal.autoplay = false;
  audioGlobal.loop = false;

  function playAudio(src, vlm) {
    //console.log('playAudio fired, src', src,'vlm', vlm);
    let audio = audioGlobal;
    audio.src = src;
    audio.volume = vlm;
    audio.play();
  }

  function getSettings(key) { //Получение настроек
    let setting = 'cws_sett_' + key;
    let val = window.localStorage.getItem(setting);
    switch (val) {
      case null:
        return null;
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return val;
    }
  }
  var error_tm;

  function error(t) {
    $("#error").text(t).show();
    clearTimeout(error_tm);
    error_tm = setTimeout(function () {
      hideError()
    }, 10000);
  }

  function hideError() {
    clearTimeout(error_tm);
    $("#error").fadeOut(500);
  }

  function setSettings(key, val) {
    let setting = 'cws_sett_' + key;
    window.localStorage.setItem(setting, val);
  }

  function removeSettings(key) {
    let setting = 'cws_sett_' + key;
    window.localStorage.removeItem(setting);
  }

  function addCSS(css) {
    $('head').append(`<style>${css}</style>`);
  }

  function leadZero(num) {
    return (num < 10) ? '0' + num : num;
  }
  const pageurl = window.location.href;
  const isCW3 = (/^https:\/\/\w?\.?catwar.net\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
  const isSite = !(/^https:\/\/\w?\.?catwar.net\/cw3(\/kns|\/jagd)?.*/.test(pageurl));
  const isDM = (/^https:\/\/\w?\.?catwar.net\/ls/.test(pageurl));
  const isHunt = (/^https:\/\/\w?\.?catwar.net\/cw3\/jagd/.test(pageurl));
  const isSett = (/^https:\/\/\w?\.?catwar.net\/settings/.test(pageurl));
  const isMyCat = (/^https:\/\/\w?\.?catwar.net\/$/.test(pageurl));
  const isBlog = (/^https:\/\/\w?\.?catwar.net\/blog\d+/.test(pageurl));
  const isCUMoves = (/^https:\/\/\w?\.?catwar.net\/moves$/.test(pageurl));
  const isProfile = (/^https:\/\/\w?\.?catwar.net\/cat(\d+|\/)/.test(pageurl));

  try {
    if (isCW3) cw3();
    if (isSite) site();
    if (isDM) dm();
    if (isSett) sett();
    if (isHunt) hunt();
    if (isMyCat) myCat();
    if (isBlog) blog();
    if (isProfile) profile();
    if (isCUMoves) cumoves();
  }
  catch (err) {
    window.console.error('CW:Shed error: ', err);
  }

  if (!isDesktop) { // фиксы дизайнов
    addCSS(`.tag_edit, .tag_save {
                  font-size: 130%;
              }
              .tag_remove, .tag_cancel {
                  font-size: 120%
              }
              #tag_quest {
                  padding: 7px
              }
              #tag_add {
                padding: 9px;
              }`);
  }

    function site() { // Весь сайт, кроме Игровой и её разделов
        if (globals.on_deletionWarning) {
            const el = $('.other_cats_list').first();
            if (el.length) {
                el.children().each(function (e) {
                    const href = $(this).attr('href');
                    const data = /login2\?id=(\d+)/.exec(href);
                    let response = '[???]';
                    if (data && data[1]) {
                        response = '';
                        const id = +data[1];
                        let cat_data = getSettings(`reg_${id}`);
                        if (cat_data) {
                            cat_data = JSON.parse(cat_data);
                            let date = new Date();
                            date.setTime(date.getTime() + (date.getTimezoneOffset() + 180) * 60 * 1000);
                            let diff = Math.floor(date.getTime() / 1000) - cat_data.regTime;
                            diff = Math.floor(diff / 86400); // days alive
                            let count = 45; // Время жизни
                            if (diff > 365) {
                                count = 120;
                            }
                            let lastOnline = new Date();
                            lastOnline.setTime(cat_data.lastOnline * 1000);
                            let inactive = Math.ceil((date - lastOnline) / (86400 * 1000));
                            let ttl = count - inactive;
                            if (ttl < 7) {
                                response = `<span style='color:red;font-weight:bold;' title='Персонаж удалится через ${ttl} дней из-за незахода'>[!!!]</span>`;
                            }
                        }
                    }
                    const text = $(this).text();
                    $(this).html(`${text} ${response}`);
                });
            }
        }
    }
  function cw3() { //Игровая
    if (globals.on_settLink) {
      $('.small').first().append(` | <a href="/settings">Настройки модов</a>`); //Настройки мода
    }
    if (no(globals.on_links)) {
        return;
    }
    if (globals.on_historyCleanWarning) {
      $(document).ready(function () {
          const istElem = $('#ist');
          addCSS(`#history_clean { display: none; }`);
          $('<a href="#" id="cws_history_clean">Очистить историю</a>').insertAfter('#history_block > #ist + br');
          if (istElem.text() == 'История очищена.') {
              $('#cws_history_clean').css('display', 'none');
          }
          $('body').on('click', '#cws_history_clean', function(e) {
              e.preventDefault();
              if (confirm('Точно очистить историю?')) {
                  $('#history_clean')[0].click();
              }
          });
          var observer = new MutationObserver(function(mutationsList, observer) {
              const ist = $('#ist').text();
              $('#cws_history_clean').css('display', (istElem.text() == 'История очищена.' ? 'none' : 'inline'));
          });
          observer.observe(window.document.getElementById('ist'), {characterData: false, childList: true, attributes: false}); // Я без понятия что это, в observer не шарю, что-то нашлось на stackoverflow работает и хрен с ним

      });
    }
    if (globals.on_css_alternativeDivideGUI) {
        $("body").on('click', '#reveal_info li:has(.select_teil)', function () {
            $(this).find('.select_teil')[0].click();
        });
        addCSS(`#reveal_info > ul:has(.select_teil) { display: flex; flex-flow: row wrap; margin: 0; padding: 0; }
#reveal_info > ul:has(.select_teil) > li { display: block; width: 70px; height: calc(70px + 1.25em); position: relative; background-repeat: no-repeat; margin: 0 0 .2em .5em; cursor: pointer; }
#reveal_info > ul:has(.select_teil) > li > a { display: block; position: absolute; text-decoration: none; width: 70px; bottom: 0; text-align: center; }
#reveal_info > ul:has(.select_teil) > li:nth-child(1) { background-image: url(/cw3/things/120.png); }
#reveal_info > ul:has(.select_teil) > li:nth-child(2) { background-image: url(/cw3/things/121.png); }
#reveal_info > ul:has(.select_teil) > li:nth-child(3) { background-image: url(/cw3/things/122.png); }
#reveal_info > ul:has(.select_teil) > li:nth-child(4) { background-image: url(/cw3/things/123.png); }
#reveal_info > ul:has(.select_teil) > li:nth-child(5) { background-image: url(/cw3/things/124.png); }
#reveal_info > ul:has(.select_teil) > li:nth-child(6) { background-image: url(/cw3/things/125.png); }`);
    }
    if (globals.on_extraInfo) {
		$.fn.reveal=function(options){var defaults={animation:'fadeAndPop',animationspeed:300,closeonbackgroundclick:true,dismissmodalclass:'close-reveal-modal'};
		var options=$.extend({},defaults,options);return this.each(function(){var modal=$(this),topMeasure=parseInt(modal.css('top')),topOffset=modal.height()
		+topMeasure,locked=false,modalBG=$('.reveal-modal-bg');if(modalBG.length==0){modalBG=$('<div class="reveal-modal-bg"/>').insertAfter(modal)} modal.bind(
		'reveal:open',function(){modalBG.unbind('click.modalEvent');$('.'+options.dismissmodalclass).unbind('click.modalEvent');if(!locked){lockModal();if
		(options.animation=="fadeAndPop"){modal.css({'top':$(document).scrollTop()-topOffset,'opacity':0,'visibility':'visible'});modalBG.fadeIn(options.
		animationspeed/2);modal.delay(options.animationspeed/2).animate({"top":$(document).scrollTop()+topMeasure+'px',"opacity":1},options.animationspeed,
		unlockModal())}if(options.animation=="fade"){modal.css({'opacity':0,'visibility':'visible','top':$(document).scrollTop()+topMeasure});modalBG.fadeIn(
		options.animationspeed/2);modal.delay(options.animationspeed/2).animate({"opacity":1},options.animationspeed,unlockModal())}if(options.animation=="none")
		{modal.css({'visibility':'visible','top':$(document).scrollTop()+topMeasure});modalBG.css({"display":"block"});unlockModal()}}modal.unbind('reveal:open')}
		);modal.bind('reveal:close',function(){if(!locked){lockModal();if(options.animation=="fadeAndPop"){modalBG.delay(options.animationspeed).fadeOut(options.
		animationspeed);modal.animate({"top":$(document).scrollTop()-topOffset+'px',"opacity":0},options.animationspeed/2,function(){modal.remove();unlockModal()}
		)}if(options.animation=="fade"){modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);modal.animate({"opacity":0},options.animationspeed,
		function(){modal.remove();unlockModal()})}if(options.animation=="none"){modal.remove();modalBG.css({'display':'none'})}}modal.unbind('reveal:close')});
		modal.trigger('reveal:open');var closeButton=$('.'+options.dismissmodalclass).bind('click.modalEvent',function(){modal.trigger('reveal:close')});
		if(options.closeonbackgroundclick){modalBG.css({"cursor":"pointer"});modalBG.bind('click.modalEvent',function(){modal.trigger('reveal:close')})}$('body')
		.keyup(function(e){if(e.which===27){modal.trigger('reveal:close')}});function unlockModal(){locked=false}function lockModal(){locked=true}})}
        const cws_showModal = function(t, e) {
           $("#app").append('<div id="reveal" class="reveal-modal"><h1>' +
                            t + '</h1><div id="reveal_info">' +
                            e + '</div><a id="close-reveal" class="close-reveal-modal">&#215;</a></div>');
           $("#reveal").reveal();
        }
        const cws_catsInfo = {};
        $('body').on('mouseenter', '.cat', function () {
            const cat = $(this);
            let el = cat.find('.d');
            const link = cat.find('a').first();
            const catName = link.text();
            const cat_id = /\d+/.exec(link.attr('href'))[0];
            const defects = {};
            let el_composited, el_costume, size;
            el.children().each(function (e) {
                const bgImg = $(this).css('background-image');
                size = $(this).css('background-size');
                const isDefects = bgImg.indexOf('defects') > -1;
                if (bgImg.indexOf('defects') > -1) {
                    const data = /cats\/-?\d+\/defects\/([a-z]+).*(\d+)\.png/.exec(bgImg)
                    if (data) {
                        const name = data[1], val = +(data[2]);
                        defects[name] = val;
                    }
                } else if (bgImg.indexOf('composited') > -1) {
                    el_composited = $(this);
                } else if (bgImg.indexOf('costume') > -1 && el_costume === undefined) {
                    el_costume = $(this);
                }
            });
            let image = "none";
            const hasGenerated = (el_composited !== undefined);
            if (hasGenerated) { // take composited
                image = /(composited\/[\da-f]{16})\.png/.exec(el_composited.css('background-image'))[1];
            } else if (el_costume !== undefined) { // take FIRST COSTUME
                image = /(cats\/-?\d+\/costume\/\d+)\.png/.exec(el_costume.css('background-image'))[1];
            }
            const pol = !!(/Его запах/.exec(cat.html()));
            cws_catsInfo[cat_id] = {
                "name" : catName,
                hasGenerated,
                image,
                defects,
                size,
                pol,
            };
            if (!cat.find('.cws-show-more').length) {
                cat.find('.online').before(`<a class="cws-show-more" href="#" data-id="${cat_id}">Подробнее</a><br>`);
            } else {
                cat.find('.cws-show-more').data('id', cat_id);
            }
        });
        $('body').on('click', '.cws-show-more', function (e) {
            e.preventDefault();
            let text = "Ничего не нашли грустно...";
            let title = "Информация";
            const id = $(this).data('id');
            const info = cws_catsInfo[id];
            if (info) {
                title = `<a href='/cat${id}'>${info.name}</a>`;
                text = `<table>`;
                text += `<tr>`;
                text += `<td><a href='/cw3/${info.image}.png'><img src='/cw3/${info.image}.png'></a></td>`;
                text += `<td>`;
                text += `<div style='margin-bottom:.35em'>Пол: ${info.pol ? "кот" : "кошка"}<br>`;
                text += `Рост: ${info.size}${+(info.size.replace('%', '')) == 101 ? " (надута)" : ""}</div>`;
                if (Object.keys(info.defects).length > 0) {
                    const defects_list = {
                        "poisoning" : {
                            name : "Отравления",
                            states : { "1" : "недомогание", "2" : "лёгкое отравление", "3" : "сильное отравление", "4" : "смертельное отравление", }
                        },
                        "wound" : {
                            name : "Раны",
                            states : { "1" : "царапины", "2" : "лёгкие раны", "3" : "глубокие раны", "4" : "смертельные раны", }
                        },
                        "drown" : {
                            name : "Травмы от утопления",
                            states : { "1" : "cсадины", "2" : "небольшие кровоподтёки", "3" : "сильные травмы", "4" : "смертельные травмы", }
                        },
                        "disease" : {
                            name : "Болезнь",
                            states : { "1" : "кашель", "2" : "", "3" : "", "4" : "", }
                        },
                        "trauma" : {
                            name : "Переломы",
                            states : { "1" : "синяки", "2" : "лёгкие ушибы", "3" : "сильные ушибы", "4" : "смертельные ушибы", }
                        },
                        "dirt" : {
                            name : "Грязь",
                            states : { "1" : "грязные лапы", "2" : "грязевые пятна", "3" : "клещи", "4" : "блохи", }
                        },
                    };
                    const defects = [];
                    for (const defect in info.defects) {
                        const value = info.defects[defect];
                        const name = defects_list[defect] && defects_list[defect].name || defect;
                        const flavor = defects_list[defect] && defects_list[defect].states[value] || "неизвестно";
                        defects.push(`<b>${name}</b>: ${value} стадия (${flavor})`);
                    }
                    text += defects.join("<br>");
                } else {
                    text += `Здоров${info.pol ? "" : "а"}`;
                }
                text += `</td>`;
                text += `</tr>`;
                text += `</table>`;
            }
            cws_showModal(title, text);
        });
    }
    if (globals.on_smellTimer) {
      $(document).ready(function () {
        $('.small').first().append(` | Нюх через: <span id="cws_smell_timer" value=0>0 с</span>`);
        let smellActive = 0;
        let smellOtherActive = 0;
        let firstNote = "";
        let rang = true;

        function smellTimerTick() {
          let val = parseInt($('#cws_smell_timer').attr('value'));
          if (val) {
            rang = false;
            val--;
            $('#cws_smell_timer').attr('value', val);
            let str = '';
            let hr = parseInt(val / 3600);
            let mi = parseInt((val - hr * 3600) / 60);
            let se = parseInt(val - (hr * 3600 + mi * 60));
            str += (hr) ? hr + ' ч ' : '';
            str += (mi || hr) ? mi + ' мин ' : '';
            str += se + ' с';
            $('#cws_smell_timer').html(str);
          }
          else if (globals.on_smellTimerNotif && !rang) {
            playAudio(sounds.action_notif, globals.sound_smellTimer);
            rang = true;
          }
        }
        setInterval(smellTimerTick, 1000);
        //TODO: сделать так, чтоб таймер не запускался вообще, пока есть действие нюха, т.е. value != 0
        let firstClick = setInterval(function () { //господи я ненавижу варовскую привычку сначала создавать элемент <!----> а потом вставлять в него данные
          if ($('#smell_icon').length) {
            firstNote = $('#error').html();
            $('#smell_icon').click();
            clearInterval(firstClick);
          }
        }, 500);

        $("body").on('DOMNodeInserted', '#dein', 'a[data-id=14]', function () {
          let isActive = $('#dein a[data-id=14]').length;
          if (!smellOtherActive && isActive) { //Отменено действие нюха
            $('#cws_smell_timer').attr('value', 0);
            $('#cws_smell_timer').html('0 с');
          }
          smellOtherActive = isActive;
        });
        const smell_timer = {"0": 3600,"1": 3600,"2": 3600,"3": 3600,"4": 1800,"5": 1200,"6": 900,"7": 720,"8": 600,"9": 0};
        $("body").on('DOMNodeRemoved', '#dein', 'a[data-id=14]', function () {
          let isActive = $('#dein a[data-id=14]').length;
          if (smellOtherActive && !isActive) { //Нажато действие нюха
            let smell_lv = $('#smell b').text(),
                smell_time = smell_timer[smell_lv],
                str = '',
                mi = smell_time / 60,
                se = smell_time - mi * 60;
            str += (mi) ? mi + ' мин ' : '';
            str += se + ' с';
            $('#cws_smell_timer').attr('value', smell_time);
            $('#cws_smell_timer').html(str);
          }
          smellOtherActive = isActive;
        });

        $("body").on('DOMSubtreeModified', '#error', function () {
          let html = $(this).html();
          if (html && html.indexOf('Следующее обнюхивание') !== -1) {
            let text = html.replace('Следующее обнюхивание будет доступно через ', '');
            let smellMin = (text.match(/(\d+) мин/g) == null) ? 0 : parseInt(text.match(/(\d+) мин/g)[0].replace(/\D/g, ''));
            let smellSec = parseInt(text.match(/(\d+) с/g)[0].replace(/\D/g, ''));
            let totalSec = smellMin * 60 + smellSec;
            $('#cws_smell_timer').attr('value', totalSec);
            $('#cws_smell_timer').html(smellMin + ' мин ' + smellSec + ' с');
            if (firstNote !== "") { //Чтоб не перекрывало уведомления о ранах, голоде и т.д.
              $('#error').html(firstNote);
              firstNote = "";
            }
          }
          else if (html.indexOf('Час уже прошёл') !== -1 && firstNote !== "") {
            $('#error').html(firstNote);
            firstNote = "";
          }
        });
      });
    }
    if (globals.on_oldDialogue) {
      $(document).ready(function () {
        $("body").on('DOMNodeInserted', '#text', function () {
          console.log('size of select : ' + $(this).attr('size'));
          $(this).attr('size', 1);
        });
      });
    }
    if (globals.on_catsDown) { //опускаем котов вниз вместе со стрелами
      $(document).ready(function () {
        $('head').append(`<style>
.d, .d div {
  background-position: left bottom;
}
.catWithArrow {
  display: flex;
  flex-direction: column;
}
.catWithArrow > .cat {
  order: -1;
}
.catWithArrow > div {
  top: 10px;
}
.mouth {
  max-width: 160px;
}</style>`);
        $("body").on('DOMSubtreeModified DOMNodeInserted', '.catWithArrow', function (e) {
          let $arrow = $(this).find('.arrow');
          let topval = $arrow.css('top');
          if (topval) {
            let int_topval = parseInt(topval.replace('px', ''));
            if (int_topval > 0) {
              $arrow.css('bottom', topval);
              $arrow.css('top', '');
            }
          }
        });
      });
    }
    if (globals.on_charInline) {
      addCSS(`.other_cats_list + br {display: none;}.other_cats_list::after {content: " ||";}.other_cats_list {border: none;}`);
    }
    if (globals.on_charHide) {
      addCSS(`.other_cats_list {display: none;}.other_cats_list + br {display: none;}`);
    }
    if (globals.on_newDM) {
      let newDM = 0;
      $('body').on('DOMSubtreeModified', '#newls', function () {
        let newDMtmp = $(this).html();
        if (newDMtmp !== undefined) {
          newDMtmp = (newDMtmp === '') ? 0 : parseInt(newDMtmp.replace(/\D/gi, ''));
          if (newDMtmp > newDM) {
            playAudio(sounds.new_message, globals.sound_newDM);
          }
          newDM = newDMtmp;
        }
      });
    }
    if (globals.on_newChat) {
      let newChat = 0;
      $('body').on('DOMSubtreeModified', '#newchat', function () {
        let newChattmp = $(this).html();
        if (newChattmp !== undefined) {
          newChattmp = (newChattmp === '') ? 0 : parseInt(newChattmp.replace(/\D/gi, ''));
          if (newChattmp > newChat) {
            playAudio(sounds.new_message, globals.sound_newChat);
          }
          newChat = newChattmp;
        }
      });
    }
    if (globals.on_customChat) {
      let messages = 1;
      if (isDesktop) {
        addCSS('#cws_chat_msg {width: 1000px;} .chat_text {width: 935px;}');
      }
      else {
        addCSS('#cws_chat_msg {width: 100% !important;} .chat_text {line-break: anywhere;}');
      }
      addCSS(`#chat_msg {display: none;}
#cws_chat_msg {
  overflow: auto;
  height: 275px;
}
.cws_chat_wrapper {
  display: -webkit-flex;
    padding: 0 .25em;
  display: flex;
}
.cws_chat_msg {
  -webkit-flex: auto;
  flex: auto;
  -webkit-flex-direction: row;
  flex-direction: row;
}
.cws_chat_report {
  width: 42px;
}
.cws_chat_report {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}`);
      // варомод (почему вы просите добавить совместимость меня, когда совместимость проще добавить тому кто сделал эту компактную игровую?)
      const hvo_settings = JSON.parse(window.localStorage.getItem('cwmod_settings') || '{}');
      if (hvo_settings.cw3_compact) {
        addCSS(`#cws_chat_msg { width: auto !important; height: 350px; padding: 2px; }`);
      }
      if (globals.on_chatReverse) {
        $('<div id="cws_chat_msg"><hr></div>').insertBefore('#chat_form');
      }
      else {
        $('<div id="cws_chat_msg"><hr></div>').insertAfter('#chat_form');
      }
      let scroll = false; // была прокрутка до предыдущих сообщений
      const chatTarget = document.getElementById('chat_msg');
      const chatObserver = new MutationObserver(function (mutationsList, observer) { // привет я даун а как тебе живеца
        let name_heard = false;
        let last_mutation = mutationsList[mutationsList.length - 1].target;
        let msg_new = last_mutation.children.length;
        let msg_blocks = last_mutation.children;
        for (let i = messages + 1; i <= msg_new; i++) { // Добавление во временный чат новых сообщений
          let block = msg_blocks[msg_new - i];
          if (block.nodeName == "SPAN") {
            let msg = block.getElementsByClassName('chat_text')[0],
              classList = msg.classList.value,
              text = msg.querySelectorAll('span')[0].innerHTML,
              nick = msg.getElementsByClassName('nick')[0].outerHTML,
              bot_resp = msg.querySelectorAll('b + span')[0],
              bot_msg = (bot_resp === undefined) ? '<!---->' : bot_resp.outerHTML,
              report = block.querySelectorAll('td[style="width: 42px;"]')[0],
              cat_id = report.querySelectorAll('a[href^="/cat"]')[0].getAttribute('href'),
              silent_bot = msg.querySelectorAll('.nick[style*="italic"]').length,
              cat_title = '';
            cat_id = parseInt(cat_id.replace(/\D/g, ''));
            let cat_id_format = (globals.on_idChat && !silent_bot) ? ` <i>[${cat_id}]</i>` : '';
            let has_nickname = false;
            if (globals.on_nickHighlight) { // Покрасить ники в myname
              $.each(globals.nickListArray, function (index, key) {
                let expr = new RegExp('^(' + key + ')[^А-ЯЁёA-Za-z0-9]|[^А-ЯЁёA-Za-z0-9>](' + key + ')[^А-ЯЁёA-Za-z0-9<]|[^А-ЯЁёA-Za-z0-9](' + key + ')$|^(' + key + ')$', "ig");
                if (text.match(expr)) { //есть имя и оно ещё не внутри тега
                  let matchAll = text.matchAll(expr);
                  matchAll = Array.from(matchAll); // теперь массив
                  $.each(matchAll, function (index, value) {
                    let replacer = value[1] || value[2] || value[3] || value[4]; //То, что было найдено (4 местоположения key, 4 варианта регулярки)
                    text = text.replace(value[0], value[0].replace(replacer, '<span class="myname">&shy;' + replacer + '&shy;</span>'));
                    has_nickname = true;
                  });
                }
              });
            }
            if (globals.on_chatMention && !name_heard) { // Если в текущем сообщении есть myname и !name_heard - проиграть звук и выставить name_heard = true
              let has_myname = msg.getElementsByClassName('myname').length;
              if (has_myname || has_nickname) {
                let is_bot = msg.getElementsByTagName('i').length;
                if (jQuery.inArray(cat_id, globals.cm_blocked) == -1 && !is_bot) { //ЕСЛИ НЕ В МАССИВЕ ИГНОРИРУЕМЫХ и не бот
                  playAudio(sounds.chat_mention, globals.sound_chatMention);
                  name_heard = true; // чтоб не спамило звуки, когда загружаешь страницу а там чел твое имя 228 раз написал
                }
              }
            }
            // Если надо свапнуть (и ID включены, иначе будет жирный пробел перед должностью)
            let result = `<div class="cws_chat_wrapper">
  <div class="cws_chat_msg">
    <span class="${classList}">${text} - ${nick}${cat_title} ${cat_id_format}
      ${bot_msg}
    </span>
  </div>
  <div class="cws_chat_report">${report.outerHTML}</div>
</div>`;
            if (globals.on_chatReverse) {
              $('#cws_chat_msg').append(result);
              $('#cws_chat_msg').append('<hr>');
              if (!scroll) {
                $('#cws_chat_msg')[0].scrollTop = $('#cws_chat_msg')[0].scrollHeight;
              }
            }
            else {
              $('#cws_chat_msg').prepend(result);
              $('#cws_chat_msg').prepend('<hr>');
            }
          }
        }
        messages = mutationsList[mutationsList.length - 1].target.children.length;
      });
      chatObserver.observe(chatTarget, {
        childList: true
      });

      $('#cws_chat_msg').on('click', '.nick', function () { // потому что клик на ник с ориг чата работает только на ориг чат фу бе
        let $text = $('#text');
        $text.val($text.val() + $(this).text() + ', ');
        $text.focus();
      });
      $('#cws_chat_msg').on('click', '.msg_report', function () { // потому что клик на жалобу с ориг чата тоже работает только на ориг чат
        let id = $(this).data('id');
        $('#chat_msg .msg_report[data-id="' + id + '"]')[0].click(); // почему вообще нельзя одновременно кликнуть на несколько элементов массива это глупо jq
      });
      if (globals.on_chatReverse) {
        $('#cws_chat_msg').on('scroll', function () { // потому что клик на жалобу с ориг чата тоже работает только на ориг чат
          let $e = $('#cws_chat_msg');
          if ($e.scrollTop() + $e.height() >= $e[0].scrollHeight - 45) { // прокручено до конца
            scroll = false;
          }
          else {
            scroll = true;
          }
        });
      }

    }
    if (globals.on_idItemMouth) {
      let item_names_json = {};
      $(document).ready(function () {
        $.getJSON("https://abstract-class-shed.github.io/cwshed/item_names.json?" + Date.now(), function (response) { //Подгрузка имен предметов из json файла
          item_names_json = response;
          $("#thdey > ul").append('<li>Название предмета: <span id=item_name_ide>[ Неизвестно ]</span> [<span id=item_id_ide>?</span>]</li>');
          $("body").on('click', "#itemList .itemInMouth", function () {
            if ($(this).hasClass("active_thing")) {
              let item_id = $(this).find("img").attr("src").replace(/\D/g, "");
              let name = item_names_json[item_id] || "[ Неизвестно ]";
              $("#item_name_ide").html(name);
              $("#item_id_ide").html(item_id);
            }
          });
        });
      });
    }
    if (globals.on_idCatMouth) {
      $(document).ready(function () {
        $("#ctdey > ul").append('<li>ID кота: <span id=cat_id_ide>[ Не определено ]</span></li>');
        $("body").on('click', "#itemList .catrot", function () {
          if ($(this).hasClass("active_thing")) {
            $("#cat_id_ide").html($(this).attr('id'));
          }
        });
      });
    }
    if (globals.on_actNotif) {
      function which_action(text) {
        const act_detect = {
          "move": "Переход",
          "eat": [" дичь", "Перекусывать"],
          "need": "Делаем свои дела",
          "drink": "Пьём ещё",
          "dig": "Копать",
          "sleep": "Сон",
          "sniff": "нюх",
          "digin": "Закапывать",
          "clean": "Вылизывать",
          "swim": "Плавать",
          "fill_moss": "Наполнять мох",
          "dive": "Нырять",
          "murr": "Мурлыкать",
          "tails": "Переплетаем хвосты",
          "cheek": "Трёмся щекой",
          "ground": "Валяем по земле",
          "rub": "Тереться носом о нос",
          "calm": "Успокаиваться",
          "watch": "Осматривать окрестности",
          "marking": "Помечать территорию",
          "clawscratch": "Точить когти",
          "rug": "Чистить ковёр",
          "attention": "Привлекать внимание",
          "domestsleep": "Спать ",
          "domesthunt": "Грандиозно охотиться ",
          "checkup": "Осматривать к",
          "loottr": "Осматривать дупло",
          "lootcr": "Осматривать расщелину"
        };
        const act_flav_text = {
          "move": "Переход",
          "eat": "Поедание дичи",
          "need": "Справление нужды",
          "drink": "Питьё",
          "dig": "Копание",
          "sleep": "Сон",
          "sniff": "Нюх",
          "digin": "Закапывание",
          "clean": "Вылизывание",
          "swim": "Плавание",
          "fill_moss": "Наполнение мха",
          "dive": "Ныряние",
          "murr": "Мурлыкаем",
          "tails": "Переплетаем хвосты",
          "cheek": "Трёмся щекой",
          "ground": "Валяем по земле",
          "rub": "Трёмся носом о нос",
          "calm": "Выход из боевой стойки",
          "watch": "Осмотр окрестностей",
          "marking": "Пометка территории",
          "clawscratch": "Затачивание когтей",
          "rug": "Чистка ковра",
          "attention": "Привлечение внимания",
          "domestsleep": "Сон в лежанке",
          "domesthunt": "Грандиозная охота",
          "checkup": "Осмотр целителем",
          "loottr": "Осмотр дупла",
          "lootcr": "Осмотр расщелины"
        };
        let wh_act = {
          txt: null,
          snd: false
        };
        $.each(act_detect, function (actid, acttext) {
          if (!(acttext instanceof Array)) {acttext = [acttext];}
          for (let textinstance in acttext) {
              if (text.indexOf(acttext[textinstance]) !== -1) {
                  if (globals["txt_act_" + actid]) wh_act.txt = act_flav_text[actid];
                  if (globals["snd_act_" + actid]) wh_act.snd = true;
                  return wh_act;
              }
          }

        });
        return wh_act;
      }
      let rang = false;
      let move_ok = false; // можно проигрывать звук
      let action = which_action($("#block_mess").html());

      $("body").on('DOMSubtreeModified', "#block_mess", function () { //На изменении блока-сообщения о времени действия или переносе твоего зада куда-то
        if ($('#sek').text().length) { //Если текст #sek существует
          let time = $('#sek').text();
          action = which_action($("#block_mess").html());
          //console.log('action sound: '+action.snd+'; action text: '+action.txt);
          if (time == '7 с' || time == '6 с') move_ok = true; //Действие длится хотя бы 7 секунд -С МОМЕНТА ОТКРЫТИЯ ИГРОВОЙ-
          if (action.txt !== null) $('title').text(time + " / " + action.txt); //Сменить титульник, если текст на это действие включен
          let datenow = new Date();
          if (!action.snd) rang = true; //Реагировать только на нужные навыки ("звук был" = да)
          if ((time === '2 с' || time === '1 с') && !rang && move_ok) { //Свернутая вкладка обновляется каждые 2 секунды, F // До конца действия 1-2 сек, звука ещё не было/звук включен, звук можно проигрывать
            playAudio(sounds.action_notif, globals.sound_notifEndAct);
            rang = true;
            move_ok = false;
          }
        }
        if ($("#block_mess").html() === "") { //Если пуст, действий нет
          $('title').text('Игровая / CatWar');
          rang = false;
          move_ok = false;
        }
      });
    }
    if (globals.notif_eaten) { //Уведомления, когда вас поднимают
      $("body").on('DOMSubtreeModified', "#block_mess", function () {
        if ($("#block_mess").html().indexOf("Вы не сможете выбраться") !== -1) {
          $('title').text("Во рту");
          playAudio(sounds.sound_notifEndAct, globals.sound_notifEaten);
        }
        if ($("#block_mess").html() === "" && !globals.on_actNotif) { //Если пуст, действий нет (нужно, если нет уведомлений на действия)
          $('title').text('Игровая / CatWar');
        }
      });
    }
    if (globals.notif_attack) {
      $("#history_block").on('DOMSubtreeModified', '#ist', function () {
        let last_note = $($("#ist").html().split('.')).get(-2);
        if (last_note !== undefined) {
          if (last_note.indexOf("в боевую стойку, поскольку на меня напал") !== -1) {
            playAudio(sounds.alert_attacked, globals.sound_notifBeaten);
          }
        }
      });
    }
    if (globals.on_moveFightLog) {
      $('#app').ready(function () { //Возможность перетаскивать панель лога боя
        $('head').append(`<style>#fightPanelHandle {
                                display:inline-block;
                                height:16px;
                                width:16px;
                                background: url(https://abstract-class-shed.github.io/cwshed/untargeted.png) center no-repeat;
                                background-color: #ccc;
                                margin-right:4px;
                                border-radius: 5px;
                                padding: 1px;
                                position: relative;
                                top: 5px;
                                left: 3px;
                            }
                            #fightPanelHandle:active {
                                background: url(https://abstract-class-shed.github.io/cwshed/targeted.png) center no-repeat;
                                background-color: #ccc;
                            }</style>`);
        $("#fightPanel").prepend(`<a id="fightPanelHandle"></a>`);
        $("#fightPanel").draggable({
          handle: "#fightPanelHandle"
        });
      });
    }
    if (globals.on_blockNotif) {
      let block = false;
      $('#app').ready(function () {
        $('#block').on('load', function () {
          if ($(this).attr('src') == 'symbole/lock.png') { //locked
            block = true;
            playAudio(sounds.block_start, globals.sound_blockStart);
          }
          else if (block) { //unlocked
            block = false;
            playAudio(sounds.block_end, globals.sound_blockEnd);
          }
        });
      });
    }
    if (globals.fight_log_max_height != 70) {
      $('#fightLog').css('height', globals.fight_log_max_height);
    }
    if (globals.on_shortFightLog) {
      $(document).ready(function () {
        let prev_log = '';
        let prev_class = '';
        $("#fightLog").on('DOMNodeInserted', 'span:not(.cws-hit-count)', function (e) {
          let this_log = $(this).html();
          let this_class = $(this).attr('class');
          if (this_log == prev_log && prev_class == this_class) {
            $(this).remove();
            $('#fightLog > br:first-child').remove(); //чистка
            let $to_change = $('.cws-hit-count').first();
            let count = parseInt($to_change.attr('count'));
            count++;
            $to_change.attr('count', count);
            $to_change.html(' (х' + count + ')');
          }
          else { //новый удар
            $('<span class="cws-hit-count ' + this_class + '" count=1></span>').insertAfter($(this));
          }
          prev_log = this_log;
          prev_class = this_class;
        });
      });
    }
    if (globals.on_teamFights) {
      $('head').append(`<style>
:root {
--team1g: ${globals.tf_color_g_team1};
--team1r: ${globals.tf_color_r_team1};
--team2g: ${globals.tf_color_g_team2};
--team2r: ${globals.tf_color_r_team2};
--team3g: ${globals.tf_color_g_team3};
--team3r: ${globals.tf_color_r_team3};
--team4g: ${globals.tf_color_g_team4};
--team4r: ${globals.tf_color_r_team4};
}
.arrow_green {background: var(--team1g);}
.arrow_red {background: var(--team1r);}
label.team-1 {background: var(--team1g);color: var(--team1g);}
label.team-2 {background: var(--team2g);color: var(--team2g);}
label.team-3 {background: var(--team3g);color: var(--team3g);}
label.team-4 {background: var(--team4g);color: var(--team4g);}
#fteams-table {width: 100%; background-color: #ccccccd7;}
#fteams-table input[type="radio"] {display:none;}
#fteams-table td, #fteams-table th {
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
}
.lbl {width: 25px;}
.cws-team {
  text-align: center;
  display: block;
  width: 20px;
  height: 15px;
  margin: 2px;
  border: 2px solid transparent;
}
input:checked + .cws-team {
  border: 2px solid black;
  font-weight: bold;
  color: black;
}
#fightPanel {height: max-content;}
#fteams-wrap {
  margin: 5px 0;
  max-height: ${globals.tf_max_height}px;
  overflow-y: scroll;
}
#refresh-team {width: 100%;}
.tf-color {color:black;}
</style>`); //Определение цветов команд
      $('head').append(`<style id=cws_team_fights></style>`); //Заготовка раскраски команд
      $("#app").ready(function () {
        let ids = {}; //Список айди
        $("#fightPanel").append(`<div id=fteams-wrap>
                        <table id=fteams-table>
                        <thead>
                        <th class="tf-color">Имя</th>
                        <th class="tf-color" colspan=4>Команда</th>
                        </thead>
                        <tbody id=fightColors></tbody>
                        </table>
                        <button id=refresh-team>Обновить список</button>
                        </div>`); //Добавление списка в панель бр
        $("#refresh-team").on("click", function () { //Кнопка "Обновить"
          $('#fightColors > tr').each(function () { //Удалить старое
            let id = $(this).attr('id').match(/\d+/)[0];
            if (!$("#arrow" + id).length) { //если не существует кота из списка в боережиме
              $("#team_member_" + id).remove();
              delete ids[id];
            }
          });
          $('.arrow').each(function () {
            let id = $(this).attr('id').match(/\d+/)[0];
            if (!ids[id]) { //Добавить новое
              ids[id] = 1; //team 1
              let name = $(".cat_tooltip a[href='/cat" + id + "']").html();
              $("#fightColors").append(`<tr id=team_member_${id}><td class="tf-color">${name}</td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" checked value="1" id="chk${id}-team-1"><label class="cws-team team-1" for="chk${id}-team-1">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="2" id="chk${id}-team-2"><label class="cws-team team-2" for="chk${id}-team-2">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="3" id="chk${id}-team-3"><label class="cws-team team-3" for="chk${id}-team-3">*</label></td>
                            <td class=lbl><input type="radio" class="cws-team-chk" name="chk${id}" value="4" id="chk${id}-team-4"><label class="cws-team team-4" for="chk${id}-team-4">*</label></td>
                            </tr>`);
            }
          });
        });
        $(document).on('change', '.cws-team-chk', function () { //Изменение команды при клике
          let id = $(this).attr('id').match(/\d+/)[0];
          ids[id] = parseInt($(this).val());
          let style = '\n'; //Формирование нового стиля
          $.each(ids, function (id, team) {
            style += `#arrow${id} .arrow_green {background: var(--team${team}g);}\n#arrow${id} .arrow_red {background: var(--team${team}r);}\n`;
          });
          $('#cws_team_fights').html(style);
        });
      });
    }
    if (globals.on_cleanerHistory) {
      let titles = {};
      let statuses = {};
      const convert = {
        "Котёнок": "котёнка",
        "Оруженосец": "оруженосца",
        "Ученица целителя": "ученицу целителя",
        "Ученик целителя": "ученика целителя",
        "Целительница": "целительницу",
        "Целитель": "целителя",
        "Воительница": "воительницу",
        "Воитель": "воителя",
        "Старшая воительница": "старшую воительницу",
        "Старший воитель": "старшего воителя",
        "Старейшина": "старейшину",
        "Глашатая": "глашатую",
        "Глашатай": "глашатая",
        "Предводительница": "предводительницу",
        "Предводитель": "предводителя",
        "Будущая стражница": "будущую стражницу",
        "Будущий страж": "будущего стража",
        "Будущая охотница": "будущую охотницу",
        "Будущий охотник": "будущего охотника",
        "Стражница": "стражницу",
        "Страж": "стража",
        "Охотница": "охотницу",
        "Охотник": "охотника",
        "Врачеватель": "врачевателя",
        "Ученица врачевателя": "ученицу врачевателя",
        "Ученик врачевателя": "ученика врачевателя",
        "Ученица": "ученицу",
        "Ученик": "ученика",
        "Молодой воин": "молодого воина",
        "Воин": "воина",
        "Старший воин": "старшего воина",
        "Учитель": "учителя",
        "Воин света": "воина света",
        "Слышащая": "слышащую",
        "Слышащий": "слышащего",
        "Ученица слышащего": "ученицу слышащего",
        "Ученик слышащего": "ученика слышащего",
        "Доверенная": "доверенную",
        "Доверенный": "доверенного",
        "Наследница": "наследницу",
        "Наследник": "наследника",
        "Хранитель моря": "хранителя моря",
        "Верховная хранительница покоя": "верховную хранительницу покоя",
        "Верховный хранитель покоя": "верховного хранителя покоя",
        "Верховная добытчица": "верховную добытчицу",
        "Верховный добытчик": "верховного добытчика",
        "Верховная жрица": "верховную жрицу",
        "Верховный жрец": "верховного жреца",
        "Глава Верховного Совета": "главу Верховного Совета",
        "Советница верховного жреца": "советницу верховного жреца",
        "Советник верховного жреца": "советника верховного жреца",
        "Советница верховного хранителя покоя": "советницу верховного хранителя покоя",
        "Советник верховного хранителя покоя": "советника верховного хранителя покоя",
        "Советница верховного добытчика": "советницу верховного добытчика",
        "Советник верховного добытчика": "советника верховного добытчика",
        "Лунная жрица": "лунную жрицу",
        "Лунный жрец": "лунного жреца",
        "Добытчица": "добытчицу",
        "Добытчик": "добытчика",
        "Хранительница покоя": "хранительницу покоя",
        "Хранитель покоя": "хранителя покоя",
        "Ученица хранителей покоя": "ученицу хранителей покоя",
        "Ученик хранителей покоя": "ученика хранителей покоя",
        "Ученица добытчиков": "ученицу добытчиков",
        "Ученик добытчиков": "ученика добытчиков",
        "Старец": "старца",
        "Королева": "королеву",
        "Наследник хранителя": "наследника хранителя",
        "Хранительница солнца": "хранительницу солнца",
        "Хранитель солнца": "хранителя солнца",
        "Заместительница глашатая": "заместительницу глашатая",
        "Заместитель глашатая": "заместителя глашатая",
        "Восходящая": "восходящую",
        "Восходящий": "восходящего",
        "Командор серых стражей": "командора серых стражей",
        "Ведущая": "ведущую",
        "Ведущий": "ведущего",
        "Ученица Луны": "ученицу Луны",
        "Ученик Луны": "ученика Луны",
        "Королева": "королеву",
        "Заботливый отец": "заботливого отца",
        "Ведущая воительница": "ведущую воительницу",
        "Ведущий воитель": "ведущего воителя",
        "Молодая воительница": "молодую воительницу",
        "Молодой воин": "молодого воина",
        "Помощница ученика врачевателя": "помощницу ученика врачевателя",
        "Помощник ученика врачевателя": "помощника ученика врачевателя",
        "Старший оруженосец": "старшего оруженосца",
        "Переходящая": "переходящую",
        "Переходящий": "переходящего",
        "Советница": "советницу",
        "Советник": "советника",
        "Воспитанник": "воспитанника",
        "Воспитанница": "воспитанницу",
        "Старший воспитанник": "старшего воспитанника",
        "Старший воспитанница": "старшую воспитанницу",
        "Вождь": "вождя",
        "Мудрец": "мудреца",
        "Искусник": "искусника",
        "Наместник": "наместника",
        "Пилигрим": "пилигрима",
        "Ловец": "ловца",
        "Шаман": "шамана",
        "Кормилица": "кормилицу",
        "Воевода": "воеводу"
      };

      function title_convert(title) {
        return convert[title] || title;
      }
      if (globals.clean_title || globals.clean_status) {
        $(document).ready(function () {
          $("#cages").on('DOMNodeRemoved', '.catWithArrow', function () {
            let href = $(this).find('.cat_tooltip > u > a').attr('href');
            if (href !== undefined) {
            let cat_id = href.replace(/\D/g, '');
              if (titles[cat_id] === undefined) {
                let titleElem = $(this).html().match(/<div><small><i>([^<]+)<\/i><\/small><\/div>/ui);
                if (titleElem !== null && titleElem[1]) {
                    titles[cat_id] = titleElem[1];
                }
              }
              let status = $(this).find('.online').text(); // [ На удалении ]
              let is_punished = $(this).find('div[style*="costume/295."]').length; // Подстилки?
              if (is_punished) {
                status = "[ В подстилках ]";
              }
              statuses[cat_id] = status;
              }
          });
        });
      }
      let first_load = true;
      let cl_history = (window.localStorage.getItem('cws_cleaner_history_log') !== null) ? window.localStorage.getItem('cws_cleaner_history_log') : 'История очищена.';
      cl_history = ((globals.clean_underscore) ? cl_history.replace(/ (Подняла?|Опустила?) /ig, ' <u>$1</u> ') : cl_history.replace(/ <u>(Подняла?|Опустила?)<\/u> /ig, ' $1 '));
      $("#ist").ready(function () {
        // ДОБАВЛЕНИЕ ЛОГА ЧИСТИЛЬЩИКОВ
        $('<hr><h2><a href=\"#\" id=cleaner class=toggle>Деятельность в чистильщиках:</a></h2><span id=cleaner_block>' + cl_history + '</span><br><a id=erase_cleaner href=#>Очистить историю чистки</a>').insertAfter("#history_clean");
        let prev_ist, prev_prev_ist;
        $("#history_block").on('DOMSubtreeModified', '#ist', function () {
          if (first_load) {
            first_load = false;
          }
          else {
            let last_ist = $("#ist").html().split('.'); // to array
            last_ist = last_ist[last_ist.length - 2]; //последняя запись ( -1 тк длина с 1, а массив с 0; -1 тк последняя запись нулевая из-за точки в конце истории)
            if (last_ist !== undefined) {
              let clean_id = last_ist.match(/cat(\d+)/);
              if (clean_id) {
                clean_id = clean_id[1];
              }
              last_ist = last_ist.trim().replace(/(<([^>]+)>)/ig, ''); // последняя запись
              if (((last_ist.indexOf("Поднял") !== -1) || (last_ist.indexOf("Опустил") !== -1)) && ((last_ist.indexOf("кота") !== -1) || (last_ist.indexOf("кошку") !== -1))) { //Если есть "поднял(а)/опустил(а) кота/кошку"
                let hist_str = ' ' + ((globals.clean_underscore) ? last_ist.replace(/(Подняла*|Опустила*)/, '<u>$1</u>') : last_ist);
                if (globals.clean_id) {
                  hist_str += ' (' + clean_id + ')';
                } //Записать ID
                if (globals.clean_status && (last_ist.indexOf("Поднял") !== -1) && statuses[clean_id] !== undefined) {
                  hist_str += ' ' + statuses[clean_id];
                }
                if (globals.clean_location) {
                  hist_str += ' в локации «' + $("#location").html() + '»';
                } //Записать локацию
                hist_str += '.';
                if ((globals.clean_action) &&
                  (last_ist.indexOf("Поднял") !== -1) &&
                  (prev_prev_ist !== undefined) &&
                  (prev_ist.indexOf("Отменил") !== -1) && //Отменил действие
                  (prev_prev_ist.indexOf("по имени") !== -1) && //Перед этим взаимодействуя с кем-то
                  (prev_prev_ist.indexOf("Поднял") === -1) && //Не поднял и не опустил
                  (prev_prev_ist.indexOf("Опустил") === -1)) {
                  let clean_curr_name = last_ist.match(/ по имени ([А-Яа-яЁё ]+)/u) || ['', ''];
                  let clean_check_name = prev_prev_ist.match(/ по имени ([А-Яа-яЁё ]+)/u) || ['', ''];
                  if (clean_check_name[1] !== '' && clean_check_name[1] == clean_curr_name[1]) { //Имя проверенного и имя поднятого одинаковые
                    let their_pol = (last_ist.indexOf("кошку") !== -1) ? 'кошку' : 'кота'; //Вообще-то пронаунс это ОЧЕНЬ важно
                    let ur_pol = (last_ist.indexOf("Подняла") !== -1) ? 'Проверила' : 'Проверил'; //хаххаахаххахаха
                    hist_str = ' ' + ur_pol + ' ' + their_pol + ' по имени ' + clean_check_name[1] + '.' + hist_str;
                  }
                }
                if (globals.clean_title && titles[clean_id] !== undefined && titles[clean_id]) {
                  hist_str = hist_str.replace(/(кота|кошку)/g, title_convert(titles[clean_id]));
                } //Поменять на должность
                if ($("#location").html() != '[ Загружается… ]' && hist_str !== undefined) { //ок?
                  $('#cleaner_block').append(hist_str);
                  window.localStorage.setItem('cws_cleaner_history_log', $('#cleaner_block').html());
                }
              }
              prev_prev_ist = prev_ist;
              prev_ist = last_ist;
            }
          }
        });
        $('#erase_cleaner').on('click', function () {
          $('#cleaner_block').html("История очищена.");
          window.localStorage.setItem('cws_cleaner_history_log', 'История очищена.');
        });
      });
    }
    if (globals.on_treeTechies) {
      if (globals.tt_notif_refresh) {
        let last_note, note_first = true;
        $("#history_block").on('DOMSubtreeModified', '#ist', function () {
          last_note = $($("#ist").html().split('.')).get(-2); //Последняя запись в истории
          if (last_note !== undefined) {
            if (/Услышала? оглушительн/.test(last_note) && !note_first) {
              //console.log("Обновилась лазательная локация");
              playAudio(sounds.tt_refresh, globals.sound_ttRefresh);
            }
            note_first = false; //История была уже прочитана 1 раз, и страница не только что загрузилась
          }
        });
      }
      $('#app').ready(function () {
        $('head').append(`<style>
#cws_treeTechies.hidden{display:none;}
#cws_treeTechiesHandle, #cws_treeTechiesFold {
  display: inline-block;}
#cws_treeTechiesHandle {width: 84%;}
#cws_treeTechiesFold {width: 14%; border-left: 1px solid #ffebce;}
#cws_treeTechies {
  z-index:99;
  overflow:hidden;
  position: absolute;
  top: ${globals.tt_window_top}px;
  left: ${globals.tt_window_left}px;
  width: 270px;
  background-color: #ffebce;
  border-radius:10px;
}
#cws_treeTechies.folded {
height: 25px;
}
#cws_treeTechiesHandleWrap {
  padding: 2px 0;
  text-align:center;
  display: inline-block;
  font-size:13pt;
  width: 270px;
  background-color: #fff;
}
#cws_tt_choose {margin:10px;}
.cws-tt-cell:checked + label > span {
  font-weight: bold;
}
.cws-tt-table {
  margin: 10px;
  border: 1px solid #171717;
}
#cws_treeTechies {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.cws-tt-table td {
  font-size: 11pt;
  text-align: center;
    vertical-align: middle;
  height: 30px;
  width: 22px;
  border: 1px solid #171717;
}
.cws-tt-table .cws-tt-safe {
  background-color: rgba(255,255,255,.6);
}
.cws-tt-table .cws-tt-unsafe {background-color: rgba(204,102,0,.45);}
.cws-tt-table .cws-tt-move {background-color: rgba(255,255,255,1);}
#cws_tt_clear_btn {
  margin: 0px 3% 5px 3%;
  padding: 5px 10px;
  width: 94%;
}
.cws-tt-fold-hidden {display:none;}
#cages .cws-tt-unsafe {background-color: rgba(43, 11, 11, .5);}
#cages .cws-tt-safe {background-color: rgba(247, 255, 236, .2);}
#cages .cws-tt-move {
    background-color: rgba(247, 255, 236, .4);
}
.cws-tt-page, .cws-tt-folder {display:none;}
.cws-tt-page-lbl, .cws-tt-folder-lbl {
  display: inline-block;
  background-color: rgb(239, 239, 239);
  color: black;
  padding: 2px 10px;
  border-width:2px;
  border-style: solid;
  border-radius: 3px;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-bottom-color: rgb(118, 118, 118);
  border-right-color: rgb(118, 118, 118);
}
.cws-tt-page:checked + .cws-tt-page-lbl, .cws-tt-folder:checked + .cws-tt-folder-lbl {
  background-color: #cc6600;
  border-bottom-color: #ffffff;
  border-right-color: #ffffff;
  border-top-color: rgb(118, 118, 118);
  border-left-color: rgb(118, 118, 118);
  color: white;
}
.cws-tt-page-hidden {display:none;}</style>`);
        if (globals.tt_dark_theme) {
          $('head').append(`<style>#cws_treeTechiesFold {border-left: 1px solid #505457;}
#cws_treeTechies {background-color: #505457; color:#ebeef0;}
#cws_treeTechiesHandleWrap {background-color: #ccc;color: #27292b;}
.cws-tt-table .cws-tt-safe {background-color: rgba(255,255,255,.2);}
.cws-tt-table .cws-tt-unsafe {background-color: rgba(0,0,0,.2);}
.cws-tt-table .cws-tt-move {background-color: rgba(255, 255, 255, .4);}
.cws-tt-page:checked + .cws-tt-page-lbl, .cws-tt-folder:checked + .cws-tt-folder-lbl {background-color:#6f7577;}</style>`);
        }
        if (globals.tt_show_volume) {
          $('head').append(`<style>.vlm0 > .nick[style*="italic"]:after {content:" [0]";}
.vlm1 > .nick[style*="italic"]:after {content:" [1]";}
.vlm2 > .nick[style*="italic"]:after {content:" [2]";}
.vlm3 > .nick[style*="italic"]:after {content:" [3]";}
.vlm4 > .nick[style*="italic"]:after {content:" [4]";}
.vlm5 > .nick[style*="italic"]:after {content:" [5]";}
.vlm6 > .nick[style*="italic"]:after {content:" [6]";}
.vlm7 > .nick[style*="italic"]:after {content:" [7]";}
.vlm8 > .nick[style*="italic"]:after {content:" [8]";}
.vlm9 > .nick[style*="italic"]:after {content:" [9]";}
.vlm10 > .nick[style*="italic"]:after {content:" [10]";}</style>`);
        }
        const tt_field_def = `<tbody><tr><td class="cws-tt-safe"></td><td class="cws-tt-safe"></td><td class="cws-tt-safe"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>`;
        let tt_fields = getSettings('tt_fields') === null ? [tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def,
          tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def, tt_field_def,
          tt_field_def, tt_field_def, tt_field_def, tt_field_def
        ] : JSON.parse(getSettings('tt_fields'));
        let mines_html = `<div id="cws_treeTechies"${globals.tt_folded?' class="folded"':''}>
<div id="cws_treeTechiesHandleWrap"><div id="cws_treeTechiesHandle"><span>Минное поле</span></div><div id=cws_treeTechiesFold><img class="cws-tt-fold-minus${globals.tt_folded?' cws-tt-fold-hidden':''}" src="https://abstract-class-shed.github.io/cwshed/minus.png"><img class="cws-tt-fold-plus${globals.tt_folded?'':' cws-tt-fold-hidden'}" src="https://abstract-class-shed.github.io/cwshed/plus.png"></div></div>
<div id="cws_tt_choose">
<div>
  <input type="radio" checked name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell0" value="0" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell0"><span>[0]</span> Без звука</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell1" value="1" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell1"><span>[1]</span> Едва различимый треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell2" value="2" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell2"><span>[2]</span> Тихий треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell3" value="3" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell3"><span>[3]</span> Приглушённый треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell4" value="4" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell4"><span>[4]</span> Громкий треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell5" value="5" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell5"><span>[5]</span> Очень громкий треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell6" value="6" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell6" title="Громкость в чате - 6 (выше среднего)"><span>[6]</span> Очень громкий треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cell7" value="7" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cell7" title="Громкость в чате - 7 (выше среднего)"><span>[7]</span> Очень громкий треск</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellBad" value="X" mark="cws-tt-unsafe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cellBad"><span>[X]</span> Опасная клетка</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellGood" value="" mark="cws-tt-safe">
  <label class="cws-tt-cell-lbl" for="cws_tt_cellGood"><span>Безопасная</span> клетка</label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellMove" value="П" mark="cws-tt-move">
  <label class="cws-tt-cell-lbl" for="cws_tt_cellMove">Клетка <span>перехода</span></label>
</div>
<div>
  <input type="radio" name="cws_tt_cell" class="cws-tt-cell" id="cws_tt_cellN" value="" mark="">
  <label class="cws-tt-cell-lbl" for="cws_tt_cellN"><span>О</span>чистить</label>
</div>
<hr style="margin: 4px 0 2px 0;">
<div>
  <input type="checkbox" class="cws-tt-cell" id="cws_tt_show">
  <label class="cws-tt-cell-lbl" for="cws_tt_show">Переносить на Игровую</label>
</div>
<hr style="margin: 4px 0 2px 0;">`;
        for (let i = 0; i <= 3; i++) {
          if (globals.tt_foldersenabledArray[i] || !i) {
            mines_html += `<input type="radio" name="cws_tt_folder" class="cws-tt-folder" value="${i}" id="cws_tt_folder${i}">
    <label class="cws-tt-folder-lbl" for="cws_tt_folder${i}">${globals.tt_foldersnamesArray[i]}</label>`;
          }
        }
        mines_html += `<hr style="margin: 4px 0 2px 0;"><div>`;
        for (let i = 0; i <= 5; i++) {
          if (globals.tt_pageenabledArray[i] || !i) {
            mines_html += `<input type="radio" name="cws_tt_page" class="cws-tt-page" value="${i}" id="cws_tt_page${i}">
    <label class="cws-tt-page-lbl" folder="0" for="cws_tt_page${i}">${globals.tt_pagenamesArray[i]}</label>`;
          }
        }
        for (let i = 6; i <= 23; i++) {
          let k = parseInt(i / 6.0);
          if (globals.tt_pageenabledArray[i] && globals.tt_foldersenabledArray[k]) {
            mines_html += `<input type="radio" name="cws_tt_page" class="cws-tt-page" value="${i}" id="cws_tt_page${i}">
    <label class="cws-tt-page-lbl" style="display:none;" folder="${k}" for="cws_tt_page${i}">${globals.tt_pagenamesArray[i]}</label>`;
          }
        }
        mines_html += `</div></div><table class="cws-tt-table" page="0">${tt_fields[0]}</table>`;
        for (let i = 1; i <= 23; i++) {
          if (globals.tt_pageenabledArray[i]) {
            mines_html += `<table class="cws-tt-table" style="display:none;" page="${i}">${tt_fields[i]}</table>`;
          }
        }
        mines_html += `<button id="cws_tt_clear_btn">Очистить всё поле</button></div>`;
        $('#app').append(mines_html);
        let proj = false; //свитч переноса
        let page = 0; //страница
        let text = '0';
        let mark = 'cws-tt-safe';
        $("#cws_treeTechies").draggable({
          containment: "document",
          handle: "#cws_treeTechiesHandle",
          drag: function () {
            let offset = $(this).offset();
            let xPos = offset.left;
            let yPos = offset.top;
            setSettings('tt_window_left', offset.left);
            setSettings('tt_window_top', offset.top);
          }

        });

        let selFolder = getSettings('tt_selected_folder');
        if (selFolder !== null) {
          if (!$('#cws_tt_folder' + selFolder).length) {
            selFolder = '0';
          }
          $('#cws_tt_folder' + selFolder).click();
          $('.cws-tt-page-lbl').hide();
          $('.cws-tt-page-lbl[folder=' + selFolder + ']').show();
          $('.cws-tt-page-lbl[folder=' + selFolder + ']')[0].click();
          let pageid = $('.cws-tt-page-lbl[folder=' + selFolder + ']').attr('for');
          let $pageinp = $('#' + pageid + '');
          $('.cws-tt-table[page=' + page + ']').hide();
          page = $pageinp.val();
          $('.cws-tt-table[page=' + page + ']').show();
        }

        function tt_setStyle($elem, style) {
          $elem.removeClass('cws-tt-safe cws-tt-unsafe cws-tt-move').addClass(style);
          if (proj) {
            let col = $elem.index();
            let row = $elem.parent().index();
            $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('cws-tt-safe cws-tt-unsafe cws-tt-move').addClass(style);
          }
        }

        function tt_draw() {
          $('.cws-tt-table[page=' + page + '] td.cws-tt-safe, .cws-tt-table[page=' + page + '] td.cws-tt-unsafe, .cws-tt-table[page=' + page + '] td.cws-tt-move').each(function () {
            let col = $(this).index();
            let row = $(this).parent().index();
            $('#cages > tbody > tr').eq(row).children().eq(col).addClass($(this)[0].classList.value);
            /*if ($(this).hasClass('cws-tt-safe') || $(this).hasClass('cws-tt-safe-def')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('cws-tt-safe');
            }
            else if ($(this).hasClass('cws-tt-unsafe')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('cws-tt-unsafe');
            }
            else if ($(this).hasClass('cws-tt-move')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('cws-tt-move');
            }*/
          })
        }
        $('body').on('change', 'input[name="cws_tt_page"]', function () {
          $('.cws-tt-table[page=' + page + ']').hide();
          page = $(this).val();
          $('.cws-tt-table[page=' + page + ']').show();
          if (proj) {
            $('#cages > tbody > tr > td.cws-tt-safe').each(function () {
              $(this).removeClass('cws-tt-safe')
            });
            $('#cages > tbody > tr > td.cws-tt-unsafe').each(function () {
              $(this).removeClass('cws-tt-unsafe')
            });
            $('#cages > tbody > tr > td.cws-tt-move').each(function () {
              $(this).removeClass('cws-tt-move')
            });
            tt_draw();
          }
        });
        $('body').on('change', 'input[name="cws_tt_folder"]', function () {
          let folder = $(this).val();
          setSettings('tt_selected_folder', folder);
          $('.cws-tt-page-lbl').hide();
          $('.cws-tt-page-lbl[folder=' + folder + ']').show();
          $('.cws-tt-page-lbl[folder=' + folder + ']')[0].click();
        });
        $('body').on('change', 'input[name="cws_tt_cell"]', function () {
          text = $(this).val();
          mark = $(this).attr('mark');
        });
        $('body').on('click', '.cws-tt-table td', function () {
          $(this).html(text).removeClass('cws-tt-safe cws-tt-unsafe cws-tt-move').addClass(mark);
          if (proj) {
            let col = $(this).index();
            let row = $(this).parent().index();
            $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('cws-tt-safe cws-tt-unsafe cws-tt-move').addClass(mark);
          }
          tt_fields[page] = $('.cws-tt-table[page=' + page + ']').html();
          setSettings('tt_fields', JSON.stringify(tt_fields));
        });
        $('body').on('click', '#cws_tt_clear_btn', function () {
          let ok = true;
          if (globals.tt_clean_confirm) {
            ok = confirm('Очистить поле?');
          }
          if (ok) {
            $('.cws-tt-table .cws-tt-safe-def').removeClass('cws-tt-safe-def'); // remove later
            $('.cws-tt-table[page=' + page + '] td:not(.cws-tt-move)').each(function () {
              $(this).html('');
              tt_setStyle($(this), '');
            });
            tt_fields[page] = $('.cws-tt-table[page=' + page + ']').html();
            setSettings('tt_fields', JSON.stringify(tt_fields));
          }
        });
        $('body').on('click', '#cws_treeTechiesFold', function () {
          $('#cws_treeTechies').toggleClass('folded');
          $('.cws-tt-fold-minus').toggleClass('cws-tt-fold-hidden');
          $('.cws-tt-fold-plus').toggleClass('cws-tt-fold-hidden');
        });
        $('body').on('change', '#cws_tt_show', function () {
          if ($(this).prop('checked')) {
            proj = true; //вкл свитч переноса
            tt_draw();
          }
          else {
            proj = false;
            $('#cages > tbody > tr > td.cws-tt-safe').removeClass('cws-tt-safe');
            $('#cages > tbody > tr > td.cws-tt-unsafe').removeClass('cws-tt-unsafe');
            $('#cages > tbody > tr > td.cws-tt-move').removeClass('cws-tt-move');
          }
        });
      });
    }
    if (globals.on_paramInfo) {
      function timeConv(sec) {
        let str = "";
        let hr = parseInt(sec / 3600);
        let mi = parseInt((sec - hr * 3600) / 60);
        let se = parseInt(sec - (hr * 3600 + mi * 60));
        str += ((hr) ? hr + " ч " : "");
        str += ((mi) ? mi + " мин " : "");
        str += ((se) ? se + " с" : "");
        return str.trim();
      }
      $('body').on('click', '#dream_table .symbole', function () {
        let green = $('#dream td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let moving = ($('#dream td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Сонливость: ${perc}% (${green}px).${(green<150)?` Спать${(green != '0')?` примерно ${timeConv((150-green)*20)}`:` 50 мин или более`}.`:''}`);
        }
      });
      $('body').on('click', '#hunger_table .symbole', function () {
        let green = $('#hunger td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let moving = ($('#hunger td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error("Голод: " + perc + "% (" + green + "px).");
        }
      });
      $('body').on('click', '#thirst_table .symbole', function () {
        let green = $('#thirst td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let moving = ($('#thirst td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Жажда: ${perc}% (${green}px).${(green<150)?` Пить примерно ${timeConv((150-green)*60)}.`:''}`);
        }
      });
      $('body').on('click', '#need_table .symbole', function () {
        let green = $('#need td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let moving = ($('#need td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let min = (150 - green) / 2;
          let perc = Math.round(green / 150 * 10000) / 100;
          error(`Нужда: ${perc}% (${green}px).${(green<150)?` Справлять нужду${(green != '0')?` примерно ${timeConv(Math.trunc(min)*60)}${(Number.isInteger(min))?'':' 30 с'}`:` 1 ч 15 мин или более`}.`:''}`);
        }
      });
      $('body').on('click', '#clean_table .symbole', function () {
        let green = $('#clean td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let moving = ($('#clean td:first-child').attr('style').indexOf('overflow') !== -1);
        if (!moving) {
          let fleas = (green < 75) ? true : false;
          let perc = Math.round(green / 150 * 10000) / 100;
          let red = 150 - green;
          red = (red % 3) ? red : red - 0.5;
          let time = (red - 1) / 1.5 * 100 + 100;
          error(`Чистота: ${perc}% (${green}px).${(green<150)?` Вылизываться ${(fleas)?'уже поздно':timeConv(time)}.`:''}`);
        }
      });
      let healthText = '',
        hr;
      $('body').on('click', '#health_table .symbole', function () {
        let green = $('#health td:first-child').attr('style').replace(/[^\d\.]/g, '');
        let perc = Math.round(green / 150 * 10000) / 100;
        healthText = "Здоровье: " + perc + "% (" + green + "px)";
        hr = setTimeout(function () {
          clearTimeout(hr);
          healthText = '';
        }, 10000);
      });
      $("body").on('DOMSubtreeModified', '#error', function () {
        let html = $(this).html();
        if (html && healthText !== '') {
          let tmp = healthText;
          healthText = '';
          $('#error').html(html + '<br>' + tmp);
        }
      });
    }
    const css_texts = {
      'on_csslocation': `<style id="cwsstyle_on_csslocation">div[style*="spacoj"] {background-image: url("${globals.css_locURL}") !important;}</style>`,
      'on_css_cellshade': `<style id="cwsstyle_on_css_cellshade">.cage {box-shadow: inset 0px ${globals.css_cellshadeOpacity}px 0px ${globals.css_cellshadeOpacity}px ${globals.css_cellshadeColor};}</style>`,
      'on_css_removesky': `<style id="cwsstyle_on_css_removesky">#sky {display:none;}</style>`,
      'on_css_oldicons': `<style id="cwsstyle_on_css_oldicons">[data-id='1']>img {content:url(http://d.zaix.ru/b6pm.png);}
[data-id='3']>img {content:url(http://d.zaix.ru/b6pp.png);}
[data-id='4']>img {content:url(http://d.zaix.ru/b6pC.png);}
[data-id='5']>img {content:url(http://d.zaix.ru/b6pD.png);}
[data-id='6']>img {content:url(http://d.zaix.ru/b6pK.png);}
[data-id='8']>img {content:url(http://d.zaix.ru/b6pE.png);}
[data-id='9']>img {content:url(http://d.zaix.ru/dIZZ.png);}
[data-id='11']>img {content:url(http://d.zaix.ru/c8wv.png);}
[data-id='12']>img {content:url(http://d.zaix.ru/b6po.png);}
[data-id='13']>img {content:url(http://d.zaix.ru/3989.png);}
[data-id='14']>img {content:url(http://d.zaix.ru/b6pM.png);}
[data-id='17']>img {content:url(http://d.zaix.ru/3aKJ.png);}
[data-id='18']>img {content:url(http://d.zaix.ru/dJ26.png);}
[data-id='19']>img {content:url(http://d.zaix.ru/dJ28.png);}
[data-id='24']>img {content:url(http://d.zaix.ru/criD.png);}
[data-id='27']>img {content:url(http://d.zaix.ru/aWBR.png);}
[data-id='28']>img {content:url(http://d.zaix.ru/buJT.png);}
[data-id='29']>img {content:url(http://d.zaix.ru/dcu3.png);}
[data-id='51']>img {content:url(http://d.zaix.ru/heaT.png);}
[data-id='52']>img {content:url(http://d.zaix.ru/heaU.png);}
[data-id='53']>img {content:url(http://d.zaix.ru/heaW.png);}
[data-id='exchange']>img {content:url(http://d.zaix.ru/aRJm.png);}
[data-id='flowers']>img {content: url(http://d.zaix.ru/aRIh.png);}
#dialog>img {content: url(http://d.zaix.ru/fpvK.png);}</style>`,
      'on_css_coloredparam': `<style id="cwsstyle_on_css_coloredparam">#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}</style>`,
      'on_css_highlightmove': `<style id="cwsstyle_on_css_highlightmove">.move_parent:hover {
filter: drop-shadow(0px 0px 6px #ffffffcf);
transition: 0.2s;-webkit-transition: 0.2s;-o-transition: 0.2s;-moz-transition: 0.2s;
}.move_parent {transition: 0.3s;}</style>`,
      'on_css_maxopacity': `<style id="cwsstyle_on_css_maxopacity">.cat > div {opacity:1 !important;}</style>`,
      'on_css_newloading': `<style id="cwsstyle_on_css_newloading">[src*="/img/loading.gif"] {content: url(http://d.zaix.ru/hgx3.gif);}</style>`,
      'on_css_hideTooltip': `<style id="cwsstyle_on_css_hideTooltip">.cat:hover .cat_tooltip {display:none;}</style>`,
      'on_css_daylight': `<style id="cwsstyle_on_css_daylight">#cages_div {opacity: 1 !important;}</style>`,
      'on_css_defects': `<style id="cwsstyle_on_css_defects">div[style*="/defects/disease/"] {background-color: #eeff4640 !important;padding-top: 16px;}
div[style*="/defects/trauma/"] {background-color: #46ffef40 !important;padding-top: 16px;}
div[style*="/defects/drown/"] {background-color: #68ff4640 !important;padding-top: 16px;}
div[style*="/defects/wound/"] {background-color: #4646ff40 !important;padding-top: 16px;}
div[style*="/defects/poisoning/"] {background-color: #ff464640 !important;padding-top: 16px;}</style>`,
      'on_css_defects_dirt': `<style id="cwsstyle_on_css_defects_dirt">
div[style*="/defects/dirt/3.png"], div[style*="/defects/dirt/base/1/3.png"],
div[style*="/defects/dirt/base/2/3.png"], div[style*="/defects/dirt/4.png"],
div[style*="/defects/dirt/base/1/4.png"], div[style*="/defects/dirt/base/2/4.png"] {background-color: #9446ff40 !important;padding-top: 16px;}</style>`,
        'on_css_hideChat': `<style id="cwsstyle_on_css_hideChat">#tr_chat {display: none;}</style>`
    };
    $.each(css_texts, function (index, value) {
      if (globals[index]) {
        $('head').append(css_texts[index]);
      }
    });

    if (globals.on_css_quicksettings) {
      addCSS(`#cws_quick_settings_block {user-select:none;}`);
      $('#family').append(`<h2><a href="#" id="cws_quick_settings" class="toggle">Настройки CW:S</a></h2>
<div id="cws_quick_settings_block">
${globals.on_treeTechies?`<div><input id="on_treeTechies" type="checkbox" checked><label for="on_treeTechies">Показывать окно минного поля</label></div>`:''}
<div><input class="cwa-chk" id="on_css_cellshade" type="checkbox"${globals.on_css_cellshade?' checked':''}><label for="on_css_cellshade">Сетка ячеек локации</label></div>
<div><input class="cwa-chk" id="on_css_hideTooltip" type="checkbox"${globals.on_css_hideTooltip?' checked':''}><label for="on_css_hideTooltip">Скрыть всплывающее при наведении на кота окошко</label></div>
<div><input class="cwa-chk" id="on_css_hideChat" type="checkbox"${globals.on_css_hideChat?' checked':''}><label for="on_css_hideChat">Скрыть чат</label></div>
<div><input class="cwa-chk" id="on_css_removesky" type="checkbox"${globals.on_css_removesky?' checked':''}><label for="on_css_removesky">Скрыть небо</label></div>
<div><input class="cwa-chk" id="on_csslocation" type="checkbox"${globals.on_csslocation?' checked':''}><label for="on_csslocation">Статичный фон на каждой локации</label></div>
<div><input class="cwa-chk" id="on_css_maxopacity" type="checkbox"${globals.on_css_maxopacity?' checked':''}><label for="on_css_maxopacity">Все коты непрозрачные</label></div>
<div><input class="cwa-chk" id="on_css_defects" type="checkbox"${globals.on_css_defects?' checked':''}><label for="on_css_defects">Подсвечивать дефекты</label></div>
<div><input class="cwa-chk" id="on_css_oldicons" type="checkbox"${globals.on_css_oldicons?' checked':''}><label for="on_css_oldicons">Старые иконки действий</label></div>
<div><input class="cwa-chk" id="on_css_highlightmove" type="checkbox"${globals.on_css_highlightmove?' checked':''}><label for="on_css_highlightmove">Подсветка переходов при наведении</label></div>

</div>`);
      $('body').on('change', '#on_treeTechies', function () {
        $('#cws_treeTechies').toggleClass('hidden');
      });
      $('body').on('change', '.cwa-chk', function () {
        let id = $(this).attr('id');
        let ischkd = $(this).prop('checked');
        if (ischkd) {
          $('head').append(css_texts[id]);
        }
        else {
          $('#cwsstyle_' + id).remove();
        }
        setSettings(id, ischkd);
      });
    }
  }

  function myCat() {
      $(document).ready(function () {
          let id = $('#pr table tr:first-child td:last-child a').attr('href').replace('cat', '');
          setSettings('thine', id);
      });
      if (globals.on_deletionWarning) {
          const id = +($('#id_icon').parent().parent().children().last().text());
          const moons = +($('#age_icon').parent().parent().children().last().text().replace(/[^\d\.]/ig, ''));
          const age = Math.floor(moons * 4 * 86400 * 1000);
          let date = new Date();
          date.setTime(date.getTime() + (date.getTimezoneOffset() + 180) * 60 * 1000 - age - 86400 * 1000);
          // Текущая дата по московскому времени минус возраст и минус дополнительные сутки из-за того, что регистрация в ночное время
          // может калькулировать возраст по лунам на день позже
          const dateNow = new Date();
          dateNow.setTime(dateNow.getTime() + (dateNow.getTimezoneOffset() + 180) * 60 * 1000);
          const obj = {};
          setSettings(`reg_${id}`, JSON.stringify({
              regTime: Math.floor(date.getTime() / 1000),
              lastOnline: Math.floor(dateNow.getTime() / 1000)
          }));
      }
    if (!globals.charListArray || !globals.charListArray.length) { //Если массив ни разу не заполнялся
      $(document).ready(function () {
        let autoCCArr = [];
        $('a[href*="/login2?"]').each(function () {
          let id = $(this).attr('href').split('=')[1];
          let name = $(this).html();
          if (id && name) {
            autoCCArr.push({
              'id': id,
              'name': name
            });
          }
        });
        let id = $('#pr a[href*="cat"] > b').html();
        let name = $('#pr > big').html();
        if (id && name) {
          autoCCArr.push({
            'id': id,
            'name': name
          });
        }
        window.localStorage.setItem('cws_sett_charListArray', JSON.stringify(autoCCArr));
      });
    }
  }

  function profile() {
    $.getJSON("https://abstract-class-shed.github.io/cwshed/river_achievements.json?" + Date.now(), function (data) {
      const achievements = data,
        elem = `<div id="cws_achievement" style="display: none; margin: 5px; padding: 5px; border-radius: 10px; width: 270px; background: rgba(255, 255, 255, 0.4); color: black;"></div>`,
        inner = `Ачивка <b>"{name}"</b>
<span style="font-size: 0.9em"><br>Тип: <i>{type}</i><br>
<span style="white-space:pre-wrap">{condition}</span>`;
        const top_el_id = isDesktop ? '#branch' : '#site_table';
      let $achievement = $(`${top_el_id} > .parsed:first tbody > tr img[src*="images.vfl.ru"], `
                           + `${top_el_id} > .parsed:first > img[src*="images.vfl.ru"], `
                          + `${top_el_id} > .parsed:first tbody > tr img[src*="i.ibb.co"], `
                           + `${top_el_id} > .parsed:first > img[src*="i.ibb.co"]`),
        $body = $('body'),
        old_code = "";
        const linkRegex = /(images\.vfl\.ru\/ii\/(\d+\/[\d\w]+\/\d+_?m?)\.png|i\.ibb\.co\/([\d\w]+\/[\d\w_-]+)\.png)/;
      $(document).ready(function () {
        $achievement.last().after(elem);
        $achievement.each(function (index) { // Добавить титул к каждой ачивке
          let code = $(this).attr('src').match(linkRegex);
          if (code !== null) {
            code = code[2] || code[3];
            let name = (achievements[code] === undefined) ? "" : achievements[code].name;
            $(this).prop('title', name);
          }
        });
        $achievement.on('click', function () { // инфоблок
          let code = $(this).attr('src').match(linkRegex);
          if (code !== null) {
            code = code[2] || code[3];
            if (code == old_code && $('#cws_achievement').css('display') != 'none') {
              $('#cws_achievement').hide(200);
            }
            else if (achievements[code] !== undefined) {
              let this_achievement = achievements[code];
              let info = inner
                .replace("{name}", this_achievement.name)
                .replace("{type}", this_achievement.type)
                .replace("{condition}", this_achievement.condition);
              $('#cws_achievement').html(info).show(200);
              old_code = code;
            }
          }
        });
      });
    });
  }

  function dm() { //ЛС игрока
    if (globals.on_idDM) {
      function add_id() {
        let id = $('#msg_login').attr('href');
        if (id !== undefined) {
          id = id.replace(/\D/ig, '');
          $('<i id=cws_msg_id> [' + id + ']</i>').insertAfter($('#msg_login'));
        }
      }
      $(document).ready(function () {
        add_id(); // on load
        $('#main').bind("DOMSubtreeModified", function () {
          if (!$('#cws_msg_id').length) {
            add_id(); // on click
          }
        });
      });
    }
    if (0) {
      //const pageurl = window.location.href;
      function add_templates() {
        if ((/^https:\/\/\w?\.?catwar.net\/ls\?new$/.test(window.location.href))) { // on load
          console.log('you should add these');
          const templates = '<hr><h4>Шаблоны</h4><hr><div id="cws_ls_templates">kekw</div>';
          $('#write_div').append(templates);
        }
      }
      add_templates(); // on load
      $('#main').bind("DOMSubtreeModified", function () {
        if (!$('#cws_ls_templates').length) {
          add_templates(); // on click
        }
      });
    }
  }

  function hunt() {
      if (globals.on_css_bghuntpic) {
              $('head').append(`<style id="cwsstyle_on_css_bghuntpic">html { background: url('${globals.css_huntbgpicURL}') !important; }</style>`);
          }
    if (!isDesktop) {
      if (globals.on_huntMobileBtns) {
        addCSS(`#select_type:after {
  content: " (переверните телефон на бок)";
  font-style: italic;
}
#select_type {
  width: 80%;
  margin-left: 10%;
  margin-top: 5%;
  text-align: center;
}
input {
  left: 5%;
  width: 90%;
}
#cws_buttons {
  position: absolute;
  top: 10px;
  left: 0px;
}
.mod_btn {
  position: absolute;
  z-index: 9999;
  font-family: Verdana;
  font-size: 2.5em;
  height: 1.5em;
  width: 1.5em;
  border-radius: 5em;
  background-size: 75% !important;
  background: #333 center no-repeat;
  color: white;
  opacity: .8;
  bottom:0;right:0;
  user-select: none;
  text-align: center;
  -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
#w_btn {
  top: 0em;
  left: 2.25em;
  background-image: url('https://i.imgur.com/y0e39Ai.png');
}
#d_btn {
  top: 2.3em;
  left: 4.25em;
  background-image: url('https://i.imgur.com/g6WcMvn.png');
}
#a_btn {
  top: 2.3em;
  left: .25em;
  background-image: url('https://i.imgur.com/JgywWPS.png');
}
#s_btn {
  top: 4.6em;
  left: 2.25em;
  background-image: url('https://i.imgur.com/BPRewfC.png');
}
#q_btn {
  top: .7em;
  left: .75em;
  background-image: url('https://i.imgur.com/JgywWPS.png');
}
#e_btn {
  top: .7em;
  left: 3.75em;
  background-image: url('https://i.imgur.com/y0e39Ai.png');
}
#z_btn {
  top: 3.9em;
  left: .75em;
  background-image: url('https://i.imgur.com/BPRewfC.png');
}
#x_btn {
  top: 3.9em;
  left: 3.75em;
  background-image: url('https://i.imgur.com/g6WcMvn.png');
}
#q_btn, #e_btn, #x_btn, #z_btn {transform: rotate(45deg);}
#oben, #links, #rechts, #unten {display: none;}`);
        $("#main").ready(function () {
          $("#main").append(`<div id="cws_buttons"><button class="mod_btn" data-code="81" id="q_btn"></button>
                                 <button class="mod_btn" data-code="87" id="w_btn"></button>
                                 <button class="mod_btn" data-code="69" id="e_btn"></button>
                                 <button class="mod_btn" data-code="65" id="a_btn"></button>
                                 <button class="mod_btn" data-code="83" id="s_btn"></button>
                                 <button class="mod_btn" data-code="68" id="d_btn"></button>
                                 <button class="mod_btn" data-code="90" id="z_btn"></button>
                                 <button class="mod_btn" data-code="88" id="x_btn"></button></div>`);
          $('.mod_btn').on("mousedown touchstart", function (e) {
            e.preventDefault();
            let code = $(this).data('code');
            $('#main').trigger(
              jQuery.Event('keydown', {
                keyCode: code,
                which: code
              })
            );
          });
          $('.mod_btn').on("mouseup touchend", function (e) {
            e.preventDefault();
            let code = $(this).data('code');
            $('#main').trigger(
              jQuery.Event('keyup', {
                keyCode: code,
                which: code
              })
            );
          });
        });
      }
      if (globals.on_huntMobileFix) {
        addCSS(`body {
  position: fixed;
  height: 100%;
  width: 100%;
  transform: scale(.8);
}
html {
  height: 100%;
  width: 100%;
}
#smell {
  position: absolute;
  bottom: calc(10px - 10%);
  left: -10%;
}
#cws_buttons {
    position: absolute;
    top: calc(10px - 12.5%);
    left: -12.5%;
    transform: scale(.9);
}`);
      }
    }

    if (globals.on_huntText) {
      addCSS(`#smell {
                     text-align: center;
                     display:flex;
                     flex-direction: column;
                     align-items:center;
                     justify-content:center;
                 }
                 #cws_hunt_txt {
                     background-color: white;
height: 2.3em;
                 }
#cws_timer, #cws_hunt_txt {width: 100%;}`);

      let color_old = -1;
      setInterval(function () {
        if ($('#smell').attr('style')) {
          if (!$('#cws_hunt_txt').length) {
            $('#smell').append('<div id=cws_timer data-sec=0 style="background-color: #ffffff;">00:00</div><div id=cws_hunt_txt></div>')
          }
          let color_new = parseInt($('#smell').css('background-color').split('(').pop().split(',')[0]);
          let a = color_new - color_old
          if (color_old != -1) {
            let text = (a < 0) ? "Дальше" : "Ближе";
            if (color_new === 0) text = "Слишком далеко";
            if ((a !== 0) || (color_new === 0 && !$('#cws_hunt_txt').html())) $('#cws_hunt_txt').html(text);
          }
          color_old = color_new;
        }
      }, 100);
      setInterval(function () {
        if ($('#cws_timer').length) {
          let sec = parseInt($('#cws_timer').data('sec')),
            min;
          $('#cws_timer').data('sec', ++sec);
          min = parseInt(sec / 60);
          sec = sec - min * 60;
          $('#cws_timer').text(leadZero(min) + ':' + leadZero(sec));
        }
      }, 1000);
    }
  }

  function blog() {
    if (globals.on_reports) {
      $(document).ready(function () {
        addCSS(`.inp-button {background-color: #333;color: #fff;border: 1px solid #000;font-family: Verdana;font-size: .9em;}`);
        const blogID = +(pageurl.replace(/\D/g, ''));
        let date;
        date = new Date();
        date.setTime(date.getTime() + (date.getTimezoneOffset() + 180) * 60 * 1000);
        const date_str = date.getFullYear() + '-' + leadZero(date.getMonth() + 1) + '-' + leadZero(date.getDate());
        let my_id_div = `<div>Ваш ID:&nbsp;<input type="text" class="cws-input" pattern="[0-9]+" style="width: 145px;" id="cws_blog_myid" required="true" placeholder="123456" value="${globals.my_id ? globals.my_id : ''}"> <input type="checkbox" checked id="remember_id"><label for="remember_id">Запомнить</label></div>`;

        function rememberMyID(my_id) {
          if ($('#remember_id').prop('checked') && !isNaN(my_id) && my_id) { // запомнить
            setSettings('my_id', my_id);
          }
        }
        addCSS(`/*.cws_tabs_content { display: none; } .cws_tabs_content.active { display: block; }*/
.cws_tabs_caption {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  list-style: none;
  position: relative;
  margin: 0;
  padding-inline-start:0px;
}
.cws_tabs_caption li {
  padding: 1px 12px;
  margin: 0 2px 0 0;
  background: #333;
  color: #FFF;
  position: relative;
  border: solid #000;
  border-width: 1px;
  text-align: center;
}
.cws_tabs_caption li:not(.active) {
  cursor: pointer;
}
.cws_tabs_caption li:not(.active):hover {
  background: #444;
  border-color: #666;
}
.cws_tabs_caption .active {
  background: #444;
  color: #fff;
  border-color: #666;
}`);
        /*РЕКА*/
        if (blogID == 13664) { // Охрана границ
          let patr_time = 21,
            doz_time = leadZero(date.getHours()),
            patr_date = new Date(date),
            doz_date = new Date(date);
          let hour = date.getHours(),
            minute = date.getMinutes();
          if (hour < 12) {
            patr_date.setDate(patr_date.getDate() - 1);
          } // yesterday
          if (hour >= 12) {
            patr_time = 12;
          }
          if (hour >= 15) {
            patr_time = 15;
          }
          if (hour >= 18) {
            patr_time = 18;
          }
          if (hour >= 21) {
            patr_time = 21;
          }
          const patr_date_str = patr_date.getFullYear() + '-' + leadZero(patr_date.getMonth() + 1) + '-' + leadZero(patr_date.getDate());
          $('#send_comment').append(`
<hr>
<h3>Автоматическое заполнение отчётов</h3>
<hr>
${my_id_div}
<hr>
<div class="cws_tabs">
  <ul class="cws_tabs_caption">
    <li class="active">Дозор</li>
    <li>Патруль</li>
  </ul>

  <div class="cws_tabs_content active">
    <div id="r03_doz_block">
    <p class="view-title">Дозор</p>
    <table>
        <tr><td>Дата начала:</td><td><input type="date" class="cws-input" id="r03_doz_date" required value="${date_str}"></td></tr>
    </table>
    <div><textarea id=r03_doz_text style="width: 95%;resize: none;" rows="11" placeholder="05+
КЗ: Имя, имя.
ТБ: имя;
рл: имя
ро: имя
рд: имя
лр: имя
вл: имя
дб: имя
нк: имя
ос: имя
гт: имя
01: имя
2: имя
3: имя
04: имя"></textarea></div>
    <button class="inp-button" id="r03_doz">Заполнить отчет</button>
    </div>
    <hr>
    <div id="r03_doz_nar_block">
    <p class="view-title">Исключения из дозора</p>
    <table>
        <tr><td>Дата начала:</td><td style="width:25px;"></td><td><input type="date" class="cws-input" id="r03_doz_nar_date" value="${date_str}"></td></tr>
        <tr><td>Время начала:</td><td></td><td><input type="time" class="cws-input" id="r03_doz_nar_time" value="${doz_time}:00" step="3600"></td></tr>
        <tr class="r03-doz-nar-free-wrap">
          <td>Освобождён:</td>
    <td></td>
          <td>
            <input type="text" class="cws-input r03-doz-nar-free" placeholder="Имя ИЛИ ID">
            <button data-id="r03-doz-nar-free-wrap" class="inp-button add-field">+</button>
          </td>
        </tr>
        <tr class="r03-doz-nar-wrap">
          <td>Нарушение:</td>
          <td></td>
          <td>
            <input type="text" class="cws-input r03-doz-nar-narname" placeholder="Имя ИЛИ ID">
<select class="cws-input r03-doz-nar-narreas" style="width:185px;">
<option>офф в дозоре</option>
<option>отсутствие на месте дозора</option>
<option>перепутано место дозора</option>
<option>пропуск нарушителя</option>
<option>долгое невыполнение переходов в активном дозоре</option>
<option>уход с места дозора раньше времени</option>
<option>тренировка во время дозора</option>
<option>выполнение посторонних действий в активном дозоре</option>
</select>
            <button data-id="r03-doz-nar-wrap" class="inp-button add-field">+</button>
          </td>
        </tr>
    </table>
    <button class="inp-button" id="r03_doz_nar">Заполнить отчет</button>
    <template id="r03-doz-nar-free-wrap">
      <tr class="r03-doz-nar-free-wrap">
        <td></td>
        <td><button data-id="r03-doz-nar-free-wrap" class="inp-button   del-field">&times;</button></td>
        <td>
          <input type="text" class="cws-input r03-doz-nar-free" placeholder="Имя ИЛИ ID">
          <button data-id="r03-doz-nar-free-wrap" class="inp-button add-field">+</button>
        </td>
      </tr>
    </template>
    <template id="r03-doz-nar-wrap">
      <tr class="r03-doz-nar-wrap">
        <td></td>
        <td><button data-id="r03-doz-nar-wrap" class="inp-button del-field">&times;</button></td>
        <td>
          <input type="text" class="cws-input r03-doz-nar-narname" placeholder="Имя ИЛИ ID">
<select class="cws-input r03-doz-nar-narreas" style="width:185px;">
<option>офф в дозоре</option>
<option>отсутствие на месте дозора</option>
<option>перепутано место дозора</option>
<option>пропуск нарушителя</option>
<option>долгое невыполнение переходов в активном дозоре</option>
<option>уход с места дозора раньше времени</option>
<option>тренировка во время дозора</option>
<option>выполнение посторонних действий в активном дозоре</option>
</select>
          <button data-id="r03-doz-nar-wrap" class="inp-button add-field">+</button>
        </td>
      </tr>
    </template>
    </div>
  </div>

  <div id="r03_patr_block" class="cws_tabs_content" style="display:none;">
    <p class="view-title">Патруль</p>
    Маршрут:
      <input type="radio" class="cws-input" name="r03_patr_mar" id="m_1" required-switch value="1"><label for="m_1">1</label>
      <input type="radio" class="cws-input" name="r03_patr_mar" id="m_2" required-switch value="2"><label for="m_2">2</label>
    <table>
        <tr><td>Дата начала:</td><td><input type="date" class="cws-input" id="r03_patr_date" required value="${patr_date_str}"></td><td></td></tr>
        <tr><td>Время начала:</td><td><input type="time" class="cws-input" id="r03_patr_time" required value="${patr_time}:00" step="3600"></td><td></td></tr>
    </table>
    <div>
        Список участников, <b>исключая</b> вас, разделяя запятой:
        <textarea style="width:95%;resize:none;" class="cws-input" id="cws_patr_members" placeholder="Синяя Звезда, Львиногрив, Огонёк"></textarea>
    </div>
    <button class="inp-button" id="r03_patr">Заполнить отчет</button>
  </div>
</div>`);
          $('#r03_patr').on('click', function (e) {
            let myid = parseInt($('#cws_blog_myid').val()); // id пишущего отчет
            rememberMyID(myid);
            myid = (isNaN(myid)) ? 'Некорректный ID ведущего' : masking(myid, '[cat%ID%] [%ID%]');
            let mar = $('.cws-input[name=r03_patr_mar]:checked').val();
            if (mar === undefined) {
              mar = 'Не выбран маршрут';
            }
            let arr_members = strToArr($('#cws_patr_members').val());
            let id_arr = [];
            let name_error = false; // ошибка в имени участника
            arr_members.forEach((element) => {
              let name = element.trim();
              let tmp = nameToID(name);
              if (parseInt(tmp)) {
                id_arr.push(name + ' [' + tmp + ']');
              }
              else {
                name_error = true;
              }
            })
            let date = splitDateStr($("#r03_patr_date").val()); // дата
            let hr = parseInt($("#r03_patr_time").val().split(":")[0]);
            let txt = `[u][b]Патруль[/b][/u]
[b]Дата и время:[/b] ${date.day}.${date.month}, ${leadZero(hr)}:00;
[b]Маршрут:[/b] ${mar};
[b]Ведущий:[/b] ${myid};
[b]Участники:[/b] ${id_arr.join(', ')};`;
            if (name_error) {
              txt += `\n! ! ! В отчёте какая-то ошибка с именем (минимум одно из имён не было найдено). Проверьте его перед тем, как отправить.`
            }
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt).scrollintoview();
          });
          $('#r03_doz').on('click', function (e) {
            let date = splitDateStr($("#r03_doz_date").val()),
              txt = '[u][b]Дозор[/b][/u]\n[b]Дата:[/b] ' + date.day + '.' + date.month + ';\n[b]Время:[/b] ',
              my_id = parseInt($('#cws_blog_myid').val()),
              som_text = $('#r03_doz_text').val().trim(),
              name_error = false,
              locations = [],
              time,
              nextTime,
              sign,
              found,
              pattern,
              places = {
                "КЗ": "Камышовые заросли",
                "ТБ": "Травянистый берег",
                "РЛ": "Редколесье",
                "РО": "Разрушенная ограда",
                "РД": "Расколотое дерево",
                "ЛР": "Лесной ручеёк",
                "ВЛ": "Валежник",
                "ИТ": "Илистая тропа",
                "ОС": "Одинокий склон",
                "НК": "Нагретые камни",
                "ДБ": "Дубрава",
                "МЗ": "Мшистые земли",
                "ГТ": "Главный туннель",
                "01": "Активный 1",
                "02": "Активный 2",
                "03": "Активный 3",
                "04": "Активный 4"
              };
            rememberMyID(my_id);
            time = som_text.match(/^(\d{2}) *([\+-])/i);
            if (time === null) {
              let val = $('#comment').val();
              if (val) {
                val += "\n\n";
              }
              $('#comment').val(val + '! ! ! Отчёт обязательно должен начинаться с двух цифр (час сбора) и знака (+ или -).');
              return;
            }
            sign = time[2];
            time = parseInt(time[1]);
            nextTime = (time == 23) ? 0 : time + 1;
            txt += leadZero(time) + ':00-' + leadZero(nextTime) + ':00;\n';
            my_id = (isNaN(my_id)) ? 'Некорректный ID собирающего' : masking(my_id, '[cat%ID%] [%ID%]');
            txt += '[b]Собирающий:[/b] ' + my_id + '.\n[b][u]Участники[/u][/b]\n';
            if (sign == '+') {
              som_text = som_text.replace(/^(\d{2}) *([\+-])[^\n]*\n|\. *$|; *$|, *$/ig, '');
              som_text = som_text.replace(/\. *\n|, *\n|; *\n/ig, '\n');
              som_text = som_text.replace(/\n(\d):/ig, '\n0$1:');
              som_text = som_text.replace(/^(\d):/ig, '0$1:');
              console.log(som_text);
              $.each(places, function (short_name, full_name) {
                pattern = new RegExp('\n*' + short_name + ': *([^\n]+)', "i");
                if (found = som_text.match(pattern)) {
                  let name_arr = found[1].split(','),
                    id_arr = [],
                    tmp_arr = [];
                  $.each(name_arr, function (index, name) {
                    let tmp = nameToID(name.trim());
                    if (parseInt(tmp)) {
                      //id_arr.push(masking(tmp, '[cat%ID%] [%ID%]'));
                      id_arr.push(name + ' [' + tmp + ']');
                    }
                    else {
                      id_arr.push(name_arr[index] + ' [?]');
                      name_error = true;
                    }
                  });
                  locations.push('[b]' + full_name + ':[/b] ' + id_arr.join(', '));
                }
              });
              txt += locations.join(';\n') + '.';
            }
            else {
              txt += 'Нет.'
            }
            if (name_error) {
              txt += `\n! ! ! В отчёте какая-то ошибка с именем (одно из имён не было найдено). Проверьте его перед тем, как отправить.`
            }
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt).scrollintoview();
          });
          $('#r03_doz_nar').on('click', function (e) {
            let date = splitDateStr($("#r03_doz_nar_date").val()),
              hr = parseInt($("#r03_doz_nar_time").val().split(":")[0]),
              next_hr = (hr == 23) ? 0 : hr + 1,
              txt = '[u][b]Дозор[/b][/u]\n[b]Дата:[/b] ' + date.day + '.' + date.month + ';\n[b]Время:[/b] ' + leadZero(hr) + ':00-' + leadZero(next_hr) + ':00';
            let free_arr = [],
              nar_arr = [];
            $('.r03-doz-nar-free-wrap').each(function () {
              let free = $(this).find($('input.r03-doz-nar-free')).val();
              if (free) {
                if (isNaN(parseInt(free))) {
                  free = nameToID(free.trim());
                }
                free = masking(free, '[cat%ID%] [%ID%]');
                free_arr.push(free);
              }
            });
            $('.r03-doz-nar-wrap').each(function () {
              let name = $(this).find($('input.r03-doz-nar-narname')).val(),
                reason = $(this).find($('select.r03-doz-nar-narreas')).val();
              if (name) {
                if (isNaN(parseInt(name))) {
                  name = nameToID(name.trim());
                }
                name = masking(name, '[cat%ID%] [%ID%]');
                nar_arr.push(name + ' (' + reason + ')');
              }
            });
            if (free_arr.length) {
              txt += ';\n[b]Освобождены:[/b] ' + free_arr.join(', ');
            }
            if (nar_arr.length) {
              txt += ';\n[b]Нарушения:[/b] ' + nar_arr.join(', ');
            }
            txt += '.';
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt).scrollintoview();
            // $("#comment").scrollintoview();
          });
          $('#r03_doz_nar_block').on('click', '.add-field', function (e) {
            let max_children = 5;
            let data_id = $(this).data('id'),
              template = $('#' + data_id)[0];
            let $fields = $('.' + data_id);
            let last_e = $fields[$fields.length - 1];
            if ($fields.length < max_children) {
              let clone = document.importNode(template.content, true);
              let add = $(clone).insertAfter(last_e);
              $(last_e).find($('.add-field')).css('display', 'none');
            }
          });
          $('#r03_doz_nar_block').on('click', '.del-field', function (e) {
            let data_id = $(this).data('id');
            $(this).closest($('.' + data_id)).remove();

            let $fields = $('.' + data_id);
            let last_e = $fields[$fields.length - 1];
            $(last_e).find($('.add-field')).css('display', 'inline-block');
          });
        }

        if (blogID == 13219) { // чистильщики
          $('#send_comment').append(`
<hr>
<h3>Автоматическое заполнение отчётов</h3>
<hr>
${my_id_div}
<hr>
<div>
  <select id="cws_clean_grp">
    <option>I группа</option>
    <option>II группа</option>
    <option>III группа</option>
  </select>
</div>
<hr>
<div>
  Автоматическое составление отчёта через историю, сгенерированную модом. <u>ВСЯ</u> история должна придерживаться одного вида, включая такие опции, как:
  <ul>
  <li>ID поднятого/опущенного;</li>
  <li>должность поднятого/опущенного;</li>
  <li>статус поднятого;</li>
  <li>локацию, в которой кот был поднят/опущен.</li>
  </ul>
</div>
<div>
  <textarea id="r03_clean_text" style="width: 95%;resize: none;" rows="11" placeholder="История очищена. Проверил старшего воителя по имени Мститель. Поднял старшего воителя по имени Мститель (1131876) [ Спит ] в локации «Камышовая поляна». Опустил на землю старшего воителя по имени Мститель (1131876) в локации «Тёмная пещера»."></textarea>
</div>
<div>
</div>
<button class="inp-button" id="r03_clean1">Заполнить отчет</button>
`);
          $('#r03_clean1').on('click', function () {
            let expr_pickup = new RegExp('(Подняла? ([А-яЁё ]+) по имени [А-яЁё ]+ \\((\\d+)\\) (\\[[А-яЁё ]+\\]) в локации «([А-яЁё ]+)»\\.|Опустила? на землю ([А-яЁё ]+) по имени [А-яЁё ]+ \\((\\d+)\\) в локации «([А-яЁё ]+)»\\.)', "ig");
            let text = $('#r03_clean_text').val();
            let group = $('#cws_clean_grp').val();
            let match_pickup = Array.from(text.matchAll(expr_pickup));
            let good_cats = {};
            let current_cats = [];
            const titles = {
              "котёнка": "Котята",
              "оруженосца": "ОВ",
              "воителя": "ОВ",
              "воительницу": "ОВ",
              "королеву": "ОВ",
              "старшего воителя": "ОВ",
              "старшую воительницу": "ОВ",
            };
            const places_from = {
              "Камышовая поляна": "Лагерь",
              "Мшистая полянка": "Лагерь",
              "Поляна для сна": "Лагерь",

              "Тенистая поляна": "Подлагерь",
              "Дальний уголок": "Подлагерь",
              "Грязное место": "Подлагерь",
              "Куча с добычей": "Подлагерь",
              "Старый вяз": "Подлагерь",
              "Полянка для игр": "Подлагерь",
              "Лужайка для игр": "Подлагерь",
              "Окутанный тайнами лужок": "Подлагерь",

              "Неглубокий ручей": "Номерные",
              "Детская": "Номерные",
              "Палатка оруженосцев": "Номерные",
              "Палатка воителей": "Номерные",

              "Поляна для тренировок": "Поляна для Тренировок [ПДТ]",
              "Юркая ложбинка": "Поляна для Тренировок [ПДТ]",
              "Лужайка, скрытая листвой": "Поляна для Тренировок [ПДТ]",
              "Боевая поляна": "Поляна для Тренировок [ПДТ]",
              "Местечко для тренировок": "Поляна для Тренировок [ПДТ]",
              "Пещера острых клыков": "Поляна для Тренировок [ПДТ]",
              "Пещера танцующих когтей": "Поляна для Тренировок [ПДТ]",
              "Расцарапанные камушки": "Поляна для Тренировок [ПДТ]",
              "Покинутая вороном лужайка": "Поляна для Тренировок [ПДТ]",
              "Просторное местечко": "Поляна для Тренировок [ПДТ]",
              "Тренировочный овраг": "Поляна для Тренировок [ПДТ]",

              "Камышовые заросли": "КЗ",

              "Галечный берег": "Лес",
              "Плакучая ива": "Лес",
              "Шелестящий тростник": "Лес",
              "Торфяник": "Лес",
              "Междуречье": "Лес",
              "Скользкие камни": "Лес",
              "Травянистый берег": "Лес",
              "Грохочущая тропа Двуногих": "Лес",
              "Редколесье": "Лес",
              "Илистая тропа": "Лес",
              "Разрушенная ограда": "Лес",
              "Лесной ручеёк": "Лес",
              "Расколотое дерево": "Лес",
              "Граница между Ветром и Рекой": "Лес",
              "Граница между Тенями и Рекой": "Лес",
              "Пруд ужей": "Лес",
              "Нагретые камни": "Лес",
              "Одинокий склон": "Лес",
              "Дубрава": "Лес",

              "Лягушатник": "Лес",
              "Мелководье": "Лес",
              "Тёплый ручеёк": "Лес",
              "Приток": "Лес",
              "Тихие воды": "Лес",
              "Плоские валуны": "Лес",
              "Воды у корней старой ивы": "Лес",
              "Глубокие воды": "Лес",
              "Ледяная вода": "Лес",
              "Течение": "Лес",
              "Устье реки": "Лес",
              "Спокойный поток": "Лес",
              "Каменная гряда": "Лес",

              "Тихий берег": "Нейтралки",
              "Заросший берег": "Нейтралки",
              "Пологий берег": "Нейтралки",
              "Каменистый берег": "Нейтралки",
              "Поваленное дерево": "Нейтралки",
              "Остров Советов": "Нейтралки",
              "Скалистые холмы": "Нейтралки",
              "Лунный ручей": "Нейтралки",
              "Лунный камень": "Нейтралки",
              "Предгорья": "Нейтралки",
              "Горы": "Нейтралки",
              "Туннели": "Нейтралки",
              "Ярусы сомнения": "Нейтралки",
              "Воющие коридоры": "Нейтралки",
            };
            const bad_statuses = ["[ На удалении ]", "[ Заблокирован ]", "[ В подстилках ]"];
            const good_statuses = ["[ В игре ]", "[ Недавно ушёл ]", "[ Недавно ушла ]"];
            $.each(match_pickup, function (index, value) {
              if (value[2] !== undefined) { // Поднятие: 2 должность, 3 статус, 4 айди, 5 локация
                let id = value[3],
                  title_grp = titles[value[2]],
                  place = value[5];
                if (bad_statuses.includes(value[4])
                    || group == "II группа" && ["Плакучая ива", "Галечный берег"].includes(place)) {
                  title_grp = "Заблокированные";
                }
                place = (places_from[place]) ? places_from[place] : place;
                if (place !== undefined && (value[4] == "[ Спит ]" || title_grp == "Заблокированные")) {
                  current_cats[id] = {
                    "title_grp": title_grp,
                    "place": place
                  };
                }
              } else { // Опускание: 6 должность, 7 айди, 8 локация
                let id = value[7];
                if (current_cats[id] !== undefined) {
			let title_grp = current_cats[id].title_grp,
				place = current_cats[id].place;
			if (good_cats[place] === undefined) {
				good_cats[place] = {};
				good_cats[place]["ОВ"] = [];
				good_cats[place]["Котята"] = [];
				good_cats[place]["Заблокированные"] = [];
			}
			if (good_cats[place][title_grp]) {
				good_cats[place][title_grp].push(id);
			}
			current_cats[id] = undefined;
                }
              }
            });
            let my_id = parseInt($('#cws_blog_myid').val());
            let my_id_mask = (isNaN(my_id)) ? 'Некорректный ID' : masking(my_id, '[cat%ID%] [%ID%]');
            let report = `1. ${my_id_mask}.\n2. ${group}.\n`;
            if (group == "III группа") {
                report += `3. [b]Л:[/b]  — предупрежден(-ы)\n[b]КЗ:[/b]  — предупрежден(-ы)`;
            } else {
                report += `3. `;
                $.each(good_cats, function (place, groups) {
                    if (group == "II группа") {
                        report += `[b]${place}:[/b] `;
                        let list = [];
                        let list_blocked = [];
                        $.each(groups, function (victim_group, arr) {
                            if (victim_group == "Заблокированные") {
                                list_blocked = list_blocked.concat(arr);
                            } else {
                                list = list.concat(arr);
                            }
                        });
                        report += `${list.join(' ')}\n`;
                        if (list_blocked.length) {
                            report += `[u]${list_blocked.join(' ')}[/u]\n`;
                        }
                    } else {
                        report += `[b]${place}:[/b]\n`;
                        $.each(groups, function (victim_group, arr) {
                            if (arr.length) {
                                if (victim_group == "Заблокированные") {
                                    report += `[u]${arr.join(' ')}[/u]\n`;
                                } else {
                                    report += `${victim_group}: ${arr.join(' ')}\n`;
                                }
                            }
                        });
                    }
                });
            }
            if (group == "I группа" || group == "II группа") {
                report += `4. [header=${my_id}]История[/header][block=${my_id}]${text}[/block]`;
            }
            $('#comment').val(report).scrollintoview();
          });
        } else if (blogID == 24395) { // хранители трав
          let patr_date = new Date(date),
            hour = date.getHours();
          if (hour < 12) {
            patr_date.setDate(patr_date.getDate() - 1);
          }
          let type = "веточник";
          if (hour < 12 || hour >= 17) {
            type = "мховник";
          } else if (hour == 16) {
            type = "травник";
          }
          const patr_date_str = patr_date.getFullYear() + '-' + leadZero(patr_date.getMonth() + 1) + '-' + leadZero(patr_date.getDate());
            my_id_div= `<div>Ваш ID (+кол-во трав):&nbsp;<input type="text" class="cws-input" pattern="[0-9]+ \(?[0-9]+\)?" style="width: 145px;" id="cws_blog_myid" required="true" placeholder="123456 15" value="${globals.my_id ? globals.my_id + " 0" : ''}"> <input type="checkbox" checked id="remember_id"><label for="remember_id">Запомнить</label></div>`;

          $('#send_comment').append(`
<hr>
<h3>Автоматическое заполнение отчётов</h3>
<hr>
${my_id_div}
<hr>
<p class="view-title">Патруль</p>
Вид:
  <input type="radio" class="cws-input" name="r03_patr_mar" id="m_1" required-switch value="веточник" ${type=="веточник"?"checked":""}><label for="m_1">веточник</label>
  <input type="radio" class="cws-input" name="r03_patr_mar" id="m_2" required-switch value="травник" ${type=="травник"?"checked":""}><label for="m_2">травник</label>
  <input type="radio" class="cws-input" name="r03_patr_mar" id="m_3" required-switch value="мховник" ${type=="мховник"?"checked":""}><label for="m_3">мховник</label>
<table>
    <tr><td>Дата начала:</td><td><input type="date" class="cws-input" id="r03_patr_date" required value="${patr_date_str}"></td><td></td></tr>
</table>
<div>
    Список участников, <b>исключая</b> вас, разделяя запятой (в конце ставьте число принесённых трав):
    <textarea style="width:95%;resize:none;" class="cws-input" id="cws_patr_members" placeholder="Синяя Звезда 3, Львиногрив 0, Огонёк 1"></textarea>
</div>
<button class="inp-button" id="r03_herb">Заполнить отчет</button>
`);
          $('#r03_herb').on('click', function (e) {
            let lead = $('#cws_blog_myid').val().split(' ');
            let myid = parseInt(lead[0]);
            let leadherb = +(lead[1].replace(/\D+/ig, ''));
            rememberMyID(myid);
            myid = (isNaN(myid)) ? 'Некорректный ID ведущего' : masking(myid, `[cat%ID%] [%ID%] (${leadherb})`);
            let mar = $('.cws-input[name=r03_patr_mar]:checked').val();
            mar = mar || 'Не выбран вид';
            let arr_members = strToArr($('#cws_patr_members').val());
            let id_arr = [];
            let not_found = [];
            let name_error = false;
            arr_members.forEach((element) => {
              let entry = element.trim().match(/([А-яЁё ]+) \(?(\d+)\)?/i);
              let name = entry[1];
              let herb = entry[2];
              let tmp = nameToID(name);
              if (parseInt(tmp)) {
                id_arr.push(`${name} [${tmp}] (${herb})`);
              } else {
                name_error = true;
                not_found.push(name);
              }
            })
            let date = splitDateStr($("#r03_patr_date").val());
            date.year = date.year.slice(2, 4);
            let txt = `[b]Дата:[/b] ${date.day}.${date.month}.${date.year};
[b]Тип травника:[/b] ${mar};
[b]Ведущий:[/b] ${myid};
[b]Участники:[/b] ${id_arr.length ? id_arr.join(', ') : "-"}.`;
            if (name_error) {
              txt += `\n! ! ! В отчёте ошибка со следующими именами (не были найдены или не соответствуют формату): ${not_found.join(', ')}. Проверьте его перед тем, как отправить.`
            }
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt).scrollintoview();
          });

        } else if (blogID == 51844) { // охотники
          let patr_date = new Date(date),
            hour = date.getHours();
          if (hour < 13) {
            patr_date.setDate(patr_date.getDate() - 1);
          }
          let type = "вечерняя";
          if (hour >= 13 && hour < 19) {
            type = "утренняя";
          }
          const patr_date_str = patr_date.getFullYear() + '-' + leadZero(patr_date.getMonth() + 1) + '-' + leadZero(patr_date.getDate());
          $('#send_comment').append(`<hr>
<h3>Автоматическое заполнение отчётов</h3>
<hr>
${my_id_div}
<hr>
<p class="view-title">Патруль</p>
<div>
Вид:
  <input type="radio" class="cws-input" name="r03_patr_mar" id="m_1" required-switch value="утренняя" ${type=="утренняя"?"checked":""}><label for="m_1">утренняя</label>
  <input type="radio" class="cws-input" name="r03_patr_mar" id="m_2" required-switch value="вечерняя" ${type=="вечерняя"?"checked":""}><label for="m_2">вечерняя</label>
</div>
<div>
    Место охоты:
  <input type="radio" class="cws-input" name="r03_patr_loc" id="l_1" required-switch value="шелестящий тростник"><label for="l_1">шелестящий тростник</label>
  <input type="radio" class="cws-input" name="r03_patr_loc" id="l_2" required-switch value="пруд ужей"><label for="l_2">пруд ужей</label>
  <input type="radio" class="cws-input" name="r03_patr_loc" id="l_3" required-switch value="галечный берег"><label for="l_3">галечный берег</label>
  <input type="radio" class="cws-input" name="r03_patr_loc" id="l_4" required-switch value="редколесье"><label for="l_4">редколесье</label>
</div>
<table>
    <tr><td>Дата начала:</td><td><input type="date" class="cws-input" id="r03_patr_date" required value="${patr_date_str}"></td><td></td></tr>
</table>
<div>
    Список охотников, <b>исключая</b> вас, разделяя запятой (если было принесено меньше 5 дичи, указывайте это цифрой в конце):
    <textarea style="width:95%;resize:none;" class="cws-input" id="cws_patr_hunters" placeholder="Синяя Звезда, Львиногрив 4, Огонёк"></textarea>
</div>
<div>
    Список таскающих, разделяя запятой:
    <textarea style="width:95%;resize:none;" class="cws-input" id="cws_patr_carriers" placeholder="Крутобок, Белка"></textarea>
</div>
<button class="inp-button" id="r03_hunt">Заполнить отчет</button>
`);

          $('#r03_hunt').on('click', function (e) {
            let lead = $('#cws_blog_myid').val();
            let myid = parseInt(lead);
            rememberMyID(myid);
            myid = (isNaN(myid)) ? 'Некорректный ID ведущего' : masking(myid, '[cat%ID%] [%ID%]');
            let mar = $('.cws-input[name=r03_patr_mar]:checked').val();
            mar = mar || 'Не выбран вид';
            let loc = $('.cws-input[name=r03_patr_loc]:checked').val();
            loc = loc || 'Не выбрана локация';
            let str_hunters = strToArr($('#cws_patr_hunters').val()),
                str_carriers = strToArr($('#cws_patr_carriers').val()),
                id_hunters = [],
                id_carriers = [],
                not_found = [];
            let name_error = false;
            str_hunters.forEach((element) => {
              let entry = element.trim().match(/([А-яЁё ]+) ?\(?(\d+)?\)?/i),
                  name = entry[1],
                  hunt = entry[2] || 5,
                  tmp = nameToID(name);
              if (parseInt(tmp)) {
                id_hunters.push(`${name} [${tmp}] (${hunt})`);
              } else {
                name_error = true;
                not_found.push(name);
              }
            });
            str_carriers.forEach((element) => {
              let name = element.trim(),
                  tmp = nameToID(name);
              if (parseInt(tmp)) {
                id_carriers.push(`${name} [${tmp}]`);
              } else {
                name_error = true;
                not_found.push(name);
              }
            });
            let date = splitDateStr($("#r03_patr_date").val());
            date.year = date.year.slice(2, 4);
            let txt = `[b][u]Дата[/u]:[/b] ${date.day}.${date.month}.${date.year};
[b]Вид:[/b] ${mar};
[b]Место охоты:[/b] ${loc};
[b]Ведущий:[/b] ${myid} (5);
[b]Участники:[/b] ${id_hunters.length ? id_hunters.join(', ') : "-"};
[b]Таскающие:[/b] ${id_carriers.length ? id_carriers.join(', ') : "-"};`;
            if (name_error) {
              txt += `\n! ! ! В отчёте ошибка со следующими именами (не были найдены или не соответствуют формату): ${not_found.join(', ')}. Проверьте его перед тем, как отправить.`
            }
            let val = $('#comment').val();
            if (val) {
              val += "\n\n";
            }
            $('#comment').val(val + txt).scrollintoview();
          });
        }
        $('ul.cws_tabs_caption').on('click', 'li:not(.active)', function () {
          $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.cws_tabs').find('div.cws_tabs_content').removeClass('active').slideUp(200)
            .eq($(this).index()).addClass('active').slideDown(200);
        });
      });
    }
  }

  function cumoves() {
    const notes = getSettings('cuMovesNote') || '';
    const p = `<p>Заметки:<br><textarea id="cws_moves_note" placeholder="Заметки о добавленных переходах" style="width: 95%; max-width: 830px; height: 100px; margin: 0px;"></textarea></p>`;
    $('#branch').append(p); //text
    $('#cws_moves_note').val(notes);
    $('#cws_moves_note').on('input', function () {
      setSettings('cuMovesNote', $(this).val());
    });
  }

  function sett() {
    $('head').append(`<style id="css_cellshade_example">#cages td {box-shadow: inset 0px ${globals.css_cellshadeOpacity}px 0px ${globals.css_cellshadeOpacity}px ${globals.css_cellshadeColor};}</style>`);
    const pattern = globals.css_cp_pattern ? 'url(https://i.imgur.com/V4TX5Cv.png), ' : '';
    let css_coloredparam_example = `#dream td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${pattern}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
    $('head').append(`<style id="css_coloredparam_example">${css_coloredparam_example}</style>`);
    let action_group_dis = (globals.on_actNotif) ? '' : ' disabled',
      tf_group_dis = (globals.on_teamFights) ? '' : ' disabled',
      clean_group_dis = (globals.on_cleanerHistory) ? '' : ' disabled',
      tt_dis = (globals.on_treeTechies) ? '' : ' disabled',
      chatment_group_dis = (globals.on_chatMention) ? '' : ' disabled',
      nick_group_dis = (globals.on_nickHighlight) ? '' : ' disabled',
      css_cp_group_dis = (globals.on_css_coloredparam) ? '' : ' disabled',
      chat_group_dis = (globals.on_customChat) ? '' : ' disabled',
      CCArray = '';
    let nickArray = '';
    $.each(globals.nickListArray, function (index, obj) {
      if (obj) {
        nickArray += `<tr><td><input class="nick-name" maxlength="30" minlength="2" group="nick-highlight" placeholder="имя" type="text" value="${obj}" ${nick_group_dis}></td>
                        <td><span class="cc-delete">×</span></td></tr>`;
      }
    });
    if (!nickArray.length) {
      nickArray = `<tr><td><input class="nick-name" maxlength="30" minlength="2" group="nick-highlight" type="text"${nick_group_dis}></td>
                   <td><span class="cc-delete">×</span></td></tr>`;
    }
    let $body = $('body');
    addCSS(`.cp-color-pick, .team-color-pick {
  background-color: #eaeaea;
  border: 1px solid #b3b3b3;
}
.bl_in{
  display: inline-block;
  margin-left:20px;
}
#cwa_sett > div {
  margin: .6em 0;
}
#color_pick td, #color_pick th{
padding: .1em .25em;
}
.cat_box {
    padding: .6em .3em;
  width: fit-content;
}
#fight_bg {
border-radius: 1em;
background: url(https://abstract-class-shed.github.io/pic/background.png) top center no-repeat;
width: 320px;
height: 330px;
max-width: calc(100% - 1.2em);
}
.color-pick-wrapper {
    display: inline-block;
    width: 100px;
}
.cat_box {
margin:auto;
}
.arrow {
    height: 8px;
    position: absolute;
    margin: 0;
    padding: 3px 0 0 11px;
    z-index: 2;
}
.arrow-paws {background: url(/cw3/symbole/arrow_paws.png) 0 0 no-repeat;}
.arrow-claws {background: url(/cw3/symbole/arrow_claws.png) 0 0 no-repeat;}
.arrow-teeth {background: url(/cw3/symbole/arrow_teeth.png) 0 0 no-repeat;}
.arrow table, .arrow td {
    height: 5px !important;
    padding: 0;
    margin: 0;
}
.arrow_red {
    background: #CD4141;
}
.d, .d div {
    width: 100px;
    height: 150px;
}
table {
    border-collapse: collapse;
}
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 1em;
  background: #622906;
  cursor: pointer;
}
.custom-range {
-webkit-appearance: none;
appearance: none;
width: 180px;
height: 15px;
background: #fff1dc;
outline: none;
border-style: solid;
border-width: 1px;
border-color: #62290640;
}
.custom-range::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #622906;
  cursor: pointer;
}
.cws-tbl-bordered, .cws-tbl-bordered td, .cws-tbl-bordered th {
  border: 1px solid #97663b70;
}
#action_table td, #action_table th{
  padding: 0 .5em;
}
.cc-delete {
  cursor: pointer;
  font-weight: bold;
  padding: 0 .1em;
  font-size: 1.2em;
}
.cc-name {
  width: 220px;
}
.cc-id {
  width: 80px;
}
@media(max-width:500px){/*smol*/
  #CCTbl tr > :first-child, .cc-id {
    width: 60px;
  }
  .cc-name {
    width: 98.5%;
  }
  #CCTbl tr > :last-child, .cc-delete {
    width: 19px;
  }
  #CCTbl {
    width: 100%;
  }
}
button {
    background-color: #333;
    color: #fff;
    border: 1px solid #000;
    font-family: Verdana;
    font-size: .9em;
}
button:disabled {
    background-color: #fff6e996;
  border-color: rgba(240,240,240,0.5);
}
.volume-table td:first-child {
  vertical-align: top;
  padding-top:3px;
}
#CCAdd, #nickAdd {
  margin-top: .25em;
}
#cm_blocked {
font-size: inherit; font-family:inherit;
resize:none;
width:99%;
height:50px;}
@media(max-width:500px){/*smol*/
#cm_blocked {
height:90px;}
}
.css-pic-url-example, #cages_div {
width:200px;
height:200px;
-moz-background-size: 100%;
    -webkit-background-size: 100%;
    -o-background-size: 100%;
    background-size: 100%;
background-color:black;
}
#cages {
width:200px;
height:200px;
}
.tt-page-name {width:50px;}
.css-pic-text {width:250px; max-width:100%;}
.parameter, .parameter td {
    margin: 0;
    padding: 0;
    border-spacing: 0;
}
.parameter {
    border: 1px solid black;
    width: 150px;
    height: 15px;
}
.symbole {
    width: 15px;
    height: 15px;
    background: url(/cw3/symbole/icons.png) no-repeat;
    padding: 0;
    margin: 0;
}
#parameters_block {
  width: 185px;
display:inline-block;
margin-top:5px;
}
.tt-folders-names {
  width: 130px;
}`);
    const html = `<hr><hr><div id="cwa_sett"><h2>Настройки CW:Shed</h2>
<div><i><small>! Большинство изменений применяются автоматически. Для того, чтобы изменения вступили в силу, обновите Игровую (страницу с ЛС, профиль).</small></i></div>
<h3>Дополнительная информация</h3>
    <div><input class="cwa-chk" id="on_settLink" type="checkbox"${globals.on_settLink?' checked':''}><label for="on_settLink">Отображать ссылку на настройки в Игровой рядом с "Мой кот | Чат | ЛС"</label></div>
    <div><input class="cwa-chk" id="on_extraInfo" type="checkbox"${globals.on_extraInfo?' checked':''}><label for="on_extraInfo">Отображать ссылку на дополнительную информацию о котах в Игровой</label></div>
    <div><input class="cwa-chk" id="on_idDM" type="checkbox"${globals.on_idDM?' checked':''}><label for="on_idDM">Включить отображение ID в личных сообщениях</label></div>
    <div><input class="cwa-chk" id="on_idCatMouth" type="checkbox"${globals.on_idCatMouth?' checked':''}><label for="on_idCatMouth">Включить отображение ID котов, находящихся во рту</label></div>
    <div><input class="cwa-chk" id="on_idItemMouth" type="checkbox"${globals.on_idItemMouth?' checked':''}><label for="on_idItemMouth">Включить отображение ID (неуникальных) и названий предметов, находящихся во рту</label></div>
    <div><input class="cwa-chk" id="on_paramInfo" type="checkbox"${globals.on_paramInfo?' checked':''}><label for="on_paramInfo">Информация о параметре при нажатии на иконку</label></div>
    <div><input class="cwa-chk" id="on_deletionWarning" type="checkbox"${globals.on_deletionWarning?' checked':''}><label for="on_deletionWarning">Информация о дате удаления персонажей в левом верхнем углу</label>
    <br><small>Учитывает только возраст персонажа и <u>дату последнего Вашего захода этим персонажем на этом устройстве на страницу "Мой кот"</u>. Не считает летний период, поэтому летом персонажам возрастом меньше года будет спамить
    про удаление, если заход был почти 45 дней назад. Не считает, если Вы зашли на персонажа с телефона, а сейчас сидите с компьютера.</small></div>
    <div><input class="cwa-chk" id="on_cuMovesNote" type="checkbox"${globals.on_cuMovesNote?' checked':''}><label for="on_cuMovesNote">[ВТ] Заметки на странице добавления/удаления переходов</label></div>
<h3>Чат</h3>
    <div><input class="cwa-chk group-switch" id="on_customChat" group-header="custom-chat" type="checkbox"${globals.on_customChat?' checked':''}><label for="on_customChat">Использовать новый чат Игровой (выглядит так же, но нужен для корректной
    работы опций ниже)</label></div>
    <block class="bl_in">
        <div><input class="cwa-chk" id="on_idChat" group="custom-chat"${chat_group_dis} type="checkbox"${globals.on_idChat?' checked':''}><label for="on_idChat">Отображать ID в чате</label></div>
        <div><input class="cwa-chk" id="on_chatReverse" group="custom-chat"${chat_group_dis} type="checkbox"${globals.on_chatReverse?' checked':''}><label for="on_chatReverse">"Перевернуть" чат, чтобы он шёл сверху вниз</label></div>

<hr>
    <div><input class="cwa-chk" id="on_nickHighlight" group="custom-chat"${chat_group_dis} type="checkbox"${globals.on_nickHighlight?' checked':''}><label for="on_nickHighlight">Выделять следующие строчки как моё имя</label></div>
<form id="nickForm">
<table border=1 id="nickTbl">
<thead><th>Кличка</th><th></th></thead>
<tbody id="nickList">
${nickArray}
</tbody>
</table>
</form>
<div><button id="nickAdd">Добавить новое поле</button>
<button form="nickForm">Сохранить</button></div>
<hr>
    <div><input class="cwa-chk" id="on_chatMention" group="custom-chat"${chat_group_dis} type="checkbox"${globals.on_chatMention?' checked':''}><label for="on_chatMention">Уведомлять, когда моё имя упоминают в чате</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_chatMention" id="sound_chatMention" value="${globals.sound_chatMention}"></td>
        <td><button data-bind="sound_chatMention" sound-src="${sounds.chat_mention}" class="sound-test">Тест</button></td>
    </tr></table>
    <div>Айди персонажей, от которых игнорировать уведомления (<i>через пробел</i>):</div>
<form id="form_cm_blocked">
    <textarea id="cm_blocked" pattern="[0-9 ]+" placeholder="420020 930302">${globals.cm_blocked.join(' ')}</textarea>
<button>Запомнить</button>
</form>
    <hr>

    </block>
<h3>Уведомления</h3>
    <div><input class="cwa-chk" id="on_newDM" type="checkbox"${globals.on_newDM?' checked':''}><label for="on_newDM">Уведомлять о новом ЛС, когда я в Игровой</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_newDM" id="sound_newDM" value="${globals.sound_newDM}"></td>
        <td><button data-bind="sound_newDM" sound-src="${sounds.new_message}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk" id="on_newChat" type="checkbox"${globals.on_newChat?' checked':''}><label for="on_newChat">Уведомлять о новом сообщении в Чате, когда я в Игровой</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_newChat" id="sound_newChat" value="${globals.sound_newChat}"></td>
        <td><button data-bind="sound_newChat" sound-src="${sounds.new_message}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk" id="notif_eaten" type="checkbox"${globals.notif_eaten?' checked':''}><label for="notif_eaten">Уведомлять, если меня кто-то поднял</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifEaten" id="sound_notifEaten" value="${globals.sound_notifEaten}"></td>
        <td><button data-bind="sound_notifEaten" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk" id="notif_attack" type="checkbox"${globals.notif_attack?' checked':''}><label for="notif_attack">Уведомлять, если меня ввели в боевую стойку через Т+2 или Т+3</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifBeaten" id="sound_notifBeaten" value="${globals.sound_notifBeaten}"></td>
        <td><button data-bind="sound_notifBeaten" sound-src="${sounds.alert_attacked}" class="sound-test">Тест</button></td>
    </tr></table>
    <hr>
    <div><input class="cwa-chk group-switch" id="on_actNotif" group-header="action-notif" type="checkbox"${globals.on_actNotif?' checked':''}><label for="on_actNotif">Уведомлять об окончании действий</label></div>
    <table class="volume-table"><tr>
        <td>Громкость:</td>
        <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_notifEndAct" id="sound_notifEndAct" value="${globals.sound_notifEndAct}"></td>
        <td><button data-bind="sound_notifEndAct" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
    </tr></table>
    <div style="font-size: 12px"><b>На которые действия реагировать:</b></div>
<block class="bl_in">
<table id="action_table" class="cws-tbl-bordered" border=1>
<thead><th>Текст</th><th>Звук</th><th>Описание</th></thead>
<tbody>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_move" type="checkbox"${globals.txt_act_move?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_move" type="checkbox"${globals.snd_act_move?' checked':''}></td>
    <td>Переход (дольше 5 секунд)</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_eat" type="checkbox"${globals.txt_act_eat?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_eat" type="checkbox"${globals.snd_act_eat?' checked':''}></td>
    <td>Поедание дичи</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_need" type="checkbox"${globals.txt_act_need?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_need" type="checkbox"${globals.snd_act_need?' checked':''}></td>
    <td>Пополнение нужды</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_drink" type="checkbox"${globals.txt_act_drink?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_drink" type="checkbox"${globals.snd_act_drink?' checked':''}></td>
    <td>Питьё</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_dig" type="checkbox"${globals.txt_act_dig?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_dig" type="checkbox"${globals.snd_act_dig?' checked':''}></td>
    <td>Копание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_digin" type="checkbox"${globals.txt_act_digin?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_digin" type="checkbox"${globals.snd_act_digin?' checked':''}></td>
    <td>Закапывание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_clean" type="checkbox"${globals.txt_act_clean?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_clean" type="checkbox"${globals.snd_act_clean?' checked':''}></td>
    <td>Вылизывание</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_sleep" type="checkbox"${globals.txt_act_sleep?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_sleep" type="checkbox"${globals.snd_act_sleep?' checked':''}></td>
    <td>Сон</td></tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_sniff" type="checkbox"${globals.txt_act_sniff?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_sniff" type="checkbox"${globals.snd_act_sniff?' checked':''}></td>
    <td>Нюх</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_swim" type="checkbox"${globals.txt_act_swim?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_swim" type="checkbox"${globals.snd_act_swim?' checked':''}></td>
    <td>Плавание</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_dive" type="checkbox"${globals.txt_act_dive?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_dive" type="checkbox"${globals.snd_act_dive?' checked':''}></td>
    <td>Ныряние</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_fill_moss" type="checkbox"${globals.txt_act_fill_moss?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_fill_moss" type="checkbox"${globals.snd_act_fill_moss?' checked':''}></td>
    <td>Наполнение мха водой</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_murr" type="checkbox"${globals.txt_act_murr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_murr" type="checkbox"${globals.snd_act_murr?' checked':''}></td>
    <td>Мурлыкание</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_tails" type="checkbox"${globals.txt_act_tails?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_tails" type="checkbox"${globals.snd_act_tails?' checked':''}></td>
    <td>Переплетание хвостов</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_cheek" type="checkbox"${globals.txt_act_cheek?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_cheek" type="checkbox"${globals.snd_act_cheek?' checked':''}></td>
    <td>Трение щёками</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_ground" type="checkbox"${globals.txt_act_ground?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_ground" type="checkbox"${globals.snd_act_ground?' checked':''}></td>
    <td>Валяние по земле</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_rub" type="checkbox"${globals.txt_act_rub?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_rub" type="checkbox"${globals.snd_act_rub?' checked':''}></td>
    <td>Трение носами</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_calm" type="checkbox"${globals.txt_act_calm?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_calm" type="checkbox"${globals.snd_act_calm?' checked':''}></td>
    <td>Выход из боевой стойки</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_watch" type="checkbox"${globals.txt_act_watch?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_watch" type="checkbox"${globals.snd_act_watch?' checked':''}></td>
    <td>Осмотр окрестностей</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_marking" type="checkbox"${globals.txt_act_marking?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_marking" type="checkbox"${globals.snd_act_marking?' checked':''}></td>
    <td>Пометка территории</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_clawscratch" type="checkbox"${globals.txt_act_clawscratch?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_clawscratch" type="checkbox"${globals.snd_act_clawscratch?' checked':''}></td>
    <td>Затачивание когтей</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_rug" type="checkbox"${globals.txt_act_rug?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_rug" type="checkbox"${globals.snd_act_rug?' checked':''}></td>
    <td>Чистка ковра</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_attention" type="checkbox"${globals.txt_act_attention?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_attention" type="checkbox"${globals.snd_act_attention?' checked':''}></td>
    <td>Привлечение внимания</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_domestsleep" type="checkbox"${globals.txt_act_domestsleep?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_domestsleep" type="checkbox"${globals.snd_act_domestsleep?' checked':''}></td>
    <td>Сон в лежанке</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_domesthunt" type="checkbox"${globals.txt_act_domesthunt?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_domesthunt" type="checkbox"${globals.snd_act_domesthunt?' checked':''}></td>
    <td>Грандиозная охота</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_checkup" type="checkbox"${globals.txt_act_checkup?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_checkup" type="checkbox"${globals.snd_act_checkup?' checked':''}></td>
    <td>Осмотр целителя</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_loottr" type="checkbox"${globals.txt_act_loottr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_loottr" type="checkbox"${globals.snd_act_loottr?' checked':''}></td>
    <td>Осмотр дупла (дерево)</td>
</tr>
<tr>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="txt_act_lootcr" type="checkbox"${globals.txt_act_lootcr?' checked':''}></td>
    <td align=center><input class="cwa-chk" group="action-notif"${action_group_dis} id="snd_act_lootcr" type="checkbox"${globals.snd_act_lootcr?' checked':''}></td>
    <td>Осмотр расщелины (скала)</td>
</tr>
</tbody>
</table>
</block>
<div><input class="cwa-chk" id="on_smellTimer" group-header="smell-timer" type="checkbox"${globals.on_smellTimer?' checked':''}><label for="on_smellTimer">Таймер времени до следующего нюха вверху страницы Игровой (рядом с Мой кот / Чат / ЛС)</label></div>
<block class="bl_in">
<div><input class="cwa-chk" id="on_smellTimerNotif" group="smell-timer" type="checkbox"${globals.on_smellTimerNotif?' checked':''}><label for="on_smellTimerNotif">Уведомлять, когда таймер истечёт</label></div>
<table><tr>
    <td>Громкость:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_smellTimer" id="sound_smellTimer" value="${globals.sound_smellTimer}"></td>
    <td><button data-bind="sound_smellTimer" sound-src="${sounds.action_notif}" class="sound-test">Тест</button></td>
</tr></table>
</block>
<h3>Бои</h3>
<div>Высота окошка лога боережима (конфликтует с варомодом. 70 = "выключено", значение по умолчанию): <input type=number id="fight_log_max_height" class="cws-number" min=50 max=500 value="${globals.fight_log_max_height}"> px</div>
<hr>
<div><input class="cwa-chk" id="on_blockNotif" type="checkbox"${globals.on_blockNotif?' checked':''}><label for="on_blockNotif">Уведомлять при нажатии/отжатии блока</label></div>
<table class="volume-table"><tr>
    <td>Громкость при нажатии:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_blockStart" id="sound_blockStart" value="${globals.sound_blockStart}"></td>
    <td><button data-bind="sound_blockStart" sound-src="${sounds.block_start}" class="sound-test">Тест</button></td>
</tr><tr>
    <td>Громкость при отжатии:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_blockEnd" id="sound_blockEnd" value="${globals.sound_blockEnd}"></td>
    <td><button data-bind="sound_blockEnd" sound-src="${sounds.block_end}" class="sound-test">Тест</button></td>
</tr></table>

<div><input class="cwa-chk" id="on_moveFightLog" type="checkbox"${globals.on_moveFightLog?' checked':''}><label for="on_moveFightLog">Возможность перетаскивать лог бр ("прицел" слева от замочка блокировки)</label></div>
<div><input class="cwa-chk" id="on_shortFightLog" type="checkbox"${globals.on_shortFightLog?' checked':''}><label for="on_shortFightLog">Сокращения повторяющихся ударов ("Я =&gt; Гривохвостик (лапы) (х4)")</label></div>

<div><input class="cwa-chk group-switch" id="on_teamFights" group-header="team-fights" type="checkbox"${globals.on_teamFights?' checked':''}><label for="on_teamFights">Команды в боевом режиме</label></div>
<div>
<div>Максимальная высота окошка с распределением команд: <input type=number id="tf_max_height" class="cws-number" group="team-fights" min=100 max=500 value="${globals.tf_max_height}"> px</div>
<table align=center id="color_pick" class="cws-tbl-bordered" border=1 style="text-align: center;">
<tr><th>Команда:</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
<tr><th>"Зелёный"</th>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat-1g id="tf_color_g_team1" value="${globals.tf_color_g_team1}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat0g id="tf_color_g_team2" value="${globals.tf_color_g_team2}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat1g id="tf_color_g_team3" value="${globals.tf_color_g_team3}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat2g id="tf_color_g_team4" value="${globals.tf_color_g_team4}"></td>
</tr>
<tr><th>"Красный"</th>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat-1r id="tf_color_r_team1" value="${globals.tf_color_r_team1}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat0r id="tf_color_r_team2" value="${globals.tf_color_r_team2}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat1r id="tf_color_r_team3" value="${globals.tf_color_r_team3}"></td>
    <td><input type="color" class="color-pick team-color-pick" group="team-fights"${tf_group_dis} data-bind=cat2r id="tf_color_r_team4" value="${globals.tf_color_r_team4}"></td>
</tr>
</table>
</div>
<div id=fight_bg style="margin: auto;">
<div class=cat_box>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-paws" style="top: 75px; transform: rotate(157deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 25px; background: ${globals.tf_color_r_team2};" data-bind=cat0r></td><td class="arrow-color" style="width: 25px; background: ${globals.tf_color_g_team2};" data-bind=cat0g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-class-shed.github.io/pic/catmodel1.png');" class="d"></div></span></div>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-teeth" style="top: 75px; transform: rotate(41deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 13px; background: ${globals.tf_color_r_team3};" data-bind=cat1r></td><td class="arrow-color" style="width: 37px; background: ${globals.tf_color_g_team3};" data-bind=cat1g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-class-shed.github.io/pic/catmodel2.png');" class="d"></div></span></div>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-claws" style="top: 75px; transform: rotate(378deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 19px; background: ${globals.tf_color_r_team4};" data-bind=cat2r></td><td class="arrow-color" style="width: 31px; background: ${globals.tf_color_g_team4};" data-bind=cat2g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-class-shed.github.io/pic/catmodel3.png');" class="d"></div></span></div>
</div>
<div class=cat_box>
    <div class="color-pick-wrapper"><div style="position: relative;">
    <div class="arrow arrow-paws" style="top: 75px; transform: rotate(433deg); opacity: 1;">
    <table style="width: 100px;"><tbody><tr><td class="arrow-color" style="width: 19px; background: ${globals.tf_color_r_team1};" data-bind=cat-1r></td><td class="arrow-color" style="width: 31px; background: ${globals.tf_color_g_team1};" data-bind=cat-1g></td><td style="width: 50px;"></td></tr></tbody></table></div></div>
    <span class="cat"><div style="background-image:url('https://abstract-class-shed.github.io/pic/catmodel-1.png');" class="d"></div></span></div>
</div>
</div>
<h3>Стили [by <a href="cat892248" target="_blank">Сущность Порядка</a>]</h3>
<div><input class="cwa-chk" id="on_css_quicksettings" type="checkbox"${globals.on_css_quicksettings?' checked':''}><label for="on_css_quicksettings">Быстрая настройка самых необходимых стилей из Игровой (блок под Родственными связями)</label></div>
<!--
<div>
    <div>Цветовая тема:</div>
    <block class="bl_in">
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_classic'?'checked ':''}id="theme_classic"><label for="theme_classic">классическая</label></div>
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_dark'?'checked ':''} id="theme_dark"><label for="theme_dark">тёмная</label></div>
        <div><input type=radio class="cwa-radio" name=css_theme ${globals.css_theme=='theme_light'?'checked ':''} id="theme_light"><label for="theme_light">светлая</label></div>
    </block>
</div>
-->

<div><input class="cwa-chk" id="on_css_alternativeDivideGUI" type="checkbox"${globals.on_css_alternativeDivideGUI?' checked':''}><label for="on_css_alternativeDivideGUI">Замена списка частей трав при их разделении на картинки</label></div>
<div><input class="cwa-chk" id="on_css_newloading" type="checkbox"${globals.on_css_newloading?' checked':''}><label for="on_css_newloading">Замена гифки загрузки на «...»</label></div>
<div><input class="cwa-chk" id="on_css_hideTooltip" type="checkbox"${globals.on_css_hideTooltip?' checked':''}><label for="on_css_hideTooltip">Скрыть всплывающее при наведении на кота окошко</label></div>
<div><input class="cwa-chk" id="on_css_hideChat" type="checkbox"${globals.on_css_hideChatp?' checked':''}><label for="on_css_hideChat">Скрыть чат</label></div>
<div><input class="cwa-chk" id="on_css_removesky" type="checkbox"${globals.on_css_removesky?' checked':''}><label for="on_css_removesky">Скрыть небо</label></div>
<div><input class="cwa-chk" id="on_css_daylight" type="checkbox"${globals.on_css_daylight?' checked':''}><label for="on_css_daylight">Всегда день в Игровой</label></div>
<div><input class="cwa-chk" id="on_css_oldicons" type="checkbox"${globals.on_css_oldicons?' checked':''}><label for="on_css_oldicons">Старые иконки действий</label></div>
<div><input class="cwa-chk" id="on_css_cellshade" type="checkbox"${globals.on_css_cellshade?' checked':''}><label for="on_css_cellshade">Сетка ячеек локации</label></div>
<div><input class="cwa-chk" id="on_css_defects" type="checkbox"${globals.on_css_defects?' checked':''}><label for="on_css_defects">Подсвечивать дефекты игроков (кроме клещей и блох)</label></div>
<div><input class="cwa-chk" id="on_css_defects_dirt" type="checkbox"${globals.on_css_defects_dirt?' checked':''}><label for="on_css_defects_dirt">Подсвечивать клещей и блох игроков</label></div>
<div><block class="bl_in">
<table>
<tr><td>Цвет:</td>
<td><input type="color" class="css-cellshade color-pick" id="css_cellshadeColor" value="${globals.css_cellshadeColor}"></td></tr>
</table>

<table class="volume-table"><tr>
    <td>Непрозрачность:</td>
    <td><input type="range" class="css-cellshade custom-range" step="0.1" max="1" min="0.1" id="css_cellshadeOpacity" value="${globals.css_cellshadeOpacity}"></td>
</tr></table>

<div id="cages_div" style="background-image: url('cw3/spacoj/91.jpg');">
<table id="cages"><tbody>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody></table>
</div>


</block>
</div>
<!--

<div><input class="cwa-chk" id="on_css_bgpic" type="checkbox"${globals.on_css_bgpic?' checked':''}><label for="on_css_bgpic">Картинка на заднем плане Игровой</label></div>
<block class="bl_in">
<input type=text class="css-pic-text" id="css_bgpicURL" default="https://catwar.su/cw3/spacoj/0.jpg" value=${globals.css_bgpicURL}>
<div><button class="css-pic-url-apply" data-id="css_bgpicURL">Применить</button><button class="css-pic-url-reset" data-id="css_bgpicURL">Сбросить</button></div>
<div class="css-pic-url-example" data-id="css_bgpicURL" style="background-image:url('${globals.css_bgpicURL}');"></div>
</block>

-->
<div><input class="cwa-chk" id="on_css_bghuntpic" type="checkbox"${globals.on_css_bghuntpic?' checked':''}><label for="on_css_bghuntpic">Статичный фон на охоте:</label></div>
<block class="bl_in">
<input type=text class="css-pic-text" id="css_huntbgpicURL" default="https://catwar.su/cw3/jagd_img/bg1.png" value=${globals.css_huntbgpicURL}>
<div><button class="css-pic-url-apply" data-id="css_huntbgpicURL">Применить</button><button class="css-pic-url-reset" data-id="css_huntbgpicURL">Сбросить</button></div>
<div class="css-pic-url-example" data-id="css_huntbgpicURL" style="background-image:url('${globals.css_huntbgpicURL}');"></div>
</block>
<div><input class="cwa-chk" id="on_csslocation" type="checkbox"${globals.on_csslocation?' checked':''}><label for="on_csslocation">Статичный фон на каждой локации:</label></div>
<block class="bl_in">
<input type=text class="css-pic-text" id="css_locURL" default="https://catwar.su/cw3/spacoj/170.jpg" value=${globals.css_locURL}>
<div><button class="css-pic-url-apply" data-id="css_locURL">Применить</button><button class="css-pic-url-reset" data-id="css_locURL">Сбросить</button></div>
<div class="css-pic-url-example" data-id="css_locURL" style="background-image:url('${globals.css_locURL}');"></div>
</block>
<div><input class="cwa-chk" id="on_css_highlightmove" type="checkbox"${globals.on_css_highlightmove?' checked':''}><label for="on_css_highlightmove">Подсветка переходов при наведении</label></div>
<div><input class="cwa-chk" id="on_css_maxopacity" type="checkbox"${globals.on_css_maxopacity?' checked':''}><label for="on_css_maxopacity">Все коты непрозрачные</label></div>

<div><input class="cwa-chk group-switch" id="on_css_coloredparam" group-header="css-cp" type="checkbox"${globals.on_css_coloredparam?' checked':''}><label for="on_css_coloredparam">Разноцветные параметры и навыки</label></div>
<block class="bl_in">
<div><input class="cwa-chk"${css_cp_group_dis} id="css_cp_pattern" group="css-cp" type="checkbox"${globals.css_cp_pattern?' checked':''}><label for="css_cp_pattern">Узор</label></div>
<div>В таблице ниже можно настроить каждый цвет по желанию. "Зелёный" означает заполненную, зелёную часть полоски, "Красный" - отсутствующую, красную (в случае с навыками - серую) часть полоски. Под каждой частью есть два цвета - левая и правая часть градиента. Если не хотите, чтобы был градиент - ставьте одинаковые цвета.</div>
<div style="display:inline-block; margin-top:5px;"><table class="cws-tbl-bordered">
<tr><th></th><th colspan=2>Зелёный</th><th colspan=2>Красный</th></tr>
<tr><td align=center>Сон</td>
<td align=right><input type="color" data-id="0" value="${globals.css_cp_colors[0]}" class="cp-color-pick"></td>
<td><input type="color" data-id="1" value="${globals.css_cp_colors[1]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="2" value="${globals.css_cp_colors[2]}" class="cp-color-pick"></td>
<td><input type="color" data-id="3" value="${globals.css_cp_colors[3]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Голод</td>
<td align=right><input type="color" data-id="4" value="${globals.css_cp_colors[4]}" class="cp-color-pick"></td>
<td><input type="color" data-id="5" value="${globals.css_cp_colors[5]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="6" value="${globals.css_cp_colors[6]}" class="cp-color-pick"></td>
<td><input type="color" data-id="7" value="${globals.css_cp_colors[7]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Жажда</td>
<td align=right><input type="color" data-id="8" value="${globals.css_cp_colors[8]}" class="cp-color-pick"></td>
<td><input type="color" data-id="9" value="${globals.css_cp_colors[9]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="10" value="${globals.css_cp_colors[10]}" class="cp-color-pick"></td>
<td><input type="color" data-id="11" value="${globals.css_cp_colors[11]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Нужда</td>
<td align=right><input type="color" data-id="12" value="${globals.css_cp_colors[12]}" class="cp-color-pick"></td>
<td><input type="color" data-id="13" value="${globals.css_cp_colors[13]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="14" value="${globals.css_cp_colors[14]}" class="cp-color-pick"></td>
<td><input type="color" data-id="15" value="${globals.css_cp_colors[15]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Здоровье</td>
<td align=right><input type="color" data-id="16" value="${globals.css_cp_colors[16]}" class="cp-color-pick"></td>
<td><input type="color" data-id="17" value="${globals.css_cp_colors[17]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="18" value="${globals.css_cp_colors[18]}" class="cp-color-pick"></td>
<td><input type="color" data-id="19" value="${globals.css_cp_colors[19]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Чистота</td>
<td align=right><input type="color" data-id="20" value="${globals.css_cp_colors[20]}" class="cp-color-pick"></td>
<td><input type="color" data-id="21" value="${globals.css_cp_colors[21]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="22" value="${globals.css_cp_colors[22]}" class="cp-color-pick"></td>
<td><input type="color" data-id="23" value="${globals.css_cp_colors[23]}" class="cp-color-pick"></td></tr>
<tr><td align=center>Навыки</td>
<td align=right><input type="color" data-id="24" value="${globals.css_cp_colors[24]}" class="cp-color-pick"></td>
<td><input type="color" data-id="25" value="${globals.css_cp_colors[25]}" class="cp-color-pick"></td>
<td align=right><input type="color" data-id="26" value="${globals.css_cp_colors[26]}" class="cp-color-pick"></td>
<td><input type="color" data-id="27" value="${globals.css_cp_colors[27]}" class="cp-color-pick"></td></tr></table></div>

<div id="parameters_block"><table id="dream_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -30px"></div></td><td><span id="dream">
<table class="parameter"><tbody><tr><td style="width: 75px;"></td><td style="width: 75px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -60px"></div></td><td><span id="hunger">
<table class="parameter"><tbody><tr><td style="width: 90px;"></td><td style="width: 60px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -15px"></div></td><td><span id="thirst">
<table class="parameter"><tbody><tr><td style="width: 45px;"></td><td style="width: 105px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -45px"></div></td><td><span id="need">
<table class="parameter"><tbody><tr><td style="width: 70px;"></td><td style="red; width: 80px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -90px"></div></td><td><span id="health">
<table class="parameter"><tbody><tr><td style="width: 80px;"></td><td style="red; width: 70px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<table><tbody><tr><td><div class="symbole" style="background-position: 0px -120px"></div></td><td><span id="clean">
<table class="parameter"><tbody><tr><td style="width: 75px;"></td><td style="red; width: 75px;"></td></tr></tbody></table></span></td></tr></tbody></table>
<hr style="display:flex;">
<table id="smell_table"><tbody><tr><td><div class="symbole" id="smell_icon" style="background-position: 0px 0px"></div></td><td><span id="smell">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:75px;"></td><td style="width:75px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="dig_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -105px"></div></td><td><span id="dig">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:50px;"></td><td style="width:100px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="swim_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -135px"></div></td><td><span id="swim">
<table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:90px;"></td><td style="width:60px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table>
<table id="might_table"><tbody><tr><td><div class="symbole" style="background-position: 0px -150px"></div></td><td><span id="might"><table cellspacing="0" cellpadding="0"><tbody><tr><td>
<table class="parameter"><tbody><tr><td style="width:70px;"></td><td style="width:80px"></td></tr></tbody></table></td><td>&nbsp;<b>5</b></td></tr></tbody></table></span></td></tr></tbody></table></div>
<table>
<tr><td>Окошко для экспорта:</td><td><input type="text" value='${JSON.stringify(globals.css_cp_colors)}' id="css_cp_export"></td></tr>
<tr><td>Окошко для импорта:</td><td><input type="text" id="css_cp_import"></td></tr>
</table>
<button id="css_cp_import_btn">Импортировать</button>
</block>

<div id=circlewrap><div id=testcircle><div id=cblack></div><div></div></div></div>

<h3>Разное</h3>
<div><input class="cwa-chk" id="on_oldDialogue" type="checkbox"${globals.on_oldDialogue?' checked':''}><label for="on_oldDialogue">Старый вид диалогов с ботами (разворачивающийся список вместо прокрутки)</label></div>
<div><input class="cwa-chk group-switch" id="on_cleanerHistory" group-header="cleaner-log" type="checkbox"${globals.on_cleanerHistory?' checked':''}><label for="on_cleanerHistory">Лог деятельности в чистильщиках</label></div>
<div style="font-size: 12px"><b>Записывать</b></div>
<block class="bl_in">
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_id" type="checkbox"${globals.clean_id?' checked':''}><label for="clean_id">ID поднятого/опущенного</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_underscore" type="checkbox"${globals.clean_underscore?' checked':''}><label for="clean_underscore">Подчеркивание "Поднял(а)/Опустил(а)" в истории чистки</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_title" type="checkbox"${globals.clean_title?' checked':''}><label for="clean_title">Должность поднятого/опущенного</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_status" type="checkbox"${globals.clean_status?' checked':''}><label for="clean_status">Статус поднятого/опущенного</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_location" type="checkbox"${globals.clean_location?' checked':''}><label for="clean_location">Локацию, в которой кот был поднят/опущен</label></div>
<div><input class="cwa-chk" group="cleaner-log"${clean_group_dis} id="clean_action" type="checkbox"${globals.clean_action?' checked':''}><label for="clean_action">Проверка на действие*.</label>
<div>* Работает так: отписывает вместе с <i>"Поднял кота..."</i> ещё и <i>"Проверил на действие кота по имени ..."</i>, но только И ТОЛЬКО при условии, что проверка была за два действия до поднятия (и между проверкой и поднятием не была перезагружена Игровая). Пример:
<ul>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Отменил действие. Поднял кота по имени Хвостогривик."</i> - засчитывается за проверку.</li>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка не была отменена).</li>
    <li><i>"Потёрлись носом о нос с котом по имени Лапкоусик. Отменил действие. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка была на другом коте).</li>
    <li><i>"Потёрлись носом о нос с котом по имени Хвостогривик. Отменил действие. Обнюхал землю. Поднял кота по имени Хвостогривик."</i> - <b>не</b> засчитывается за проверку (проверка была слишком "давно").</li>
</ul>
</div>
</div></block>
<hr>
<div><input class="cwa-chk" id="on_huntText" type="checkbox"${globals.on_huntText?' checked':''}><label for="on_huntText">Охота: доп. информация в окошке с запахом</label></div>
<div><input class="cwa-chk" id="on_huntMobileBtns" type="checkbox"${globals.on_huntMobileBtns?' checked':''}><label for="on_huntMobileBtns">Охота: удобные кнопки на мобильных устройствах</label></div>
<div><input class="cwa-chk" id="on_huntMobileFix" type="checkbox"${globals.on_huntMobileFix?' checked':''}><label for="on_huntMobileFix">Охота: фикс "уезжающего" окна на маленьких мобильных устройствах</label></div>
<hr>
<div><input class="cwa-chk" id="on_catsDown" type="checkbox"${globals.on_catsDown?' checked':''}><label for="on_catsDown">Ставить котов внизу клетки (несовместимо с активными боями, т.к. не видно правильного места горла/шеи оппонента)</label></div>
<hr>
<div><input class="cwa-chk group-switch" id="on_charInline" group-header="char-change" type="checkbox"${globals.on_charInline?' checked':''}><label for="on_charInline">Переход на других персонажей в одну строчку рядом с Мой кот / Чат / ЛС</label></div>
<div><input class="cwa-chk group-switch" id="on_charHide" group-header="char-change" type="checkbox"${globals.on_charHide?' checked':''}><label for="on_charHide">Скрыть переход на других персонажей в Игровой</label></div>
<hr>
<div><input class="cwa-chk" id="on_historyCleanWarning" type="checkbox"${globals.on_historyCleanWarning?' checked':''}><label for="on_historyCleanWarning">Запрашивать подтверждение действия при чистке истории</label></div>
<hr>

<div><input class="cwa-chk group-switch" id="on_treeTechies" group-header="tree-techies" type="checkbox"${globals.on_treeTechies?' checked':''}><label for="on_treeTechies">Расчерчивание поля в отдельном окошке при каче ЛУ</label></div>
<block class="bl_in">
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_folded" type="checkbox"${globals.tt_folded?' checked':''}><label for="tt_folded">Изначально сворачивать окошко</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_clean_confirm" type="checkbox"${globals.tt_clean_confirm?' checked':''}><label for="tt_clean_confirm">Запрашивать подтверждение при очистке поля</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_show_volume" type="checkbox"${globals.tt_show_volume?' checked':''}><label for="tt_show_volume">Подпись громкости сообщений в чате от ботов (веток)</label></div>
<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_dark_theme" type="checkbox"${globals.tt_dark_theme?' checked':''}><label for="tt_dark_theme">Тёмная раскраска окошка ЛУ</label></div>
<div>Положение окошка X:
<input type=number id="tt_window_left" class="cws-number" min=0 max=4096 value="${globals.tt_window_left}"> px,
Y: <input type=number id="tt_window_top" class="cws-number" min=0 max=9999 value="${globals.tt_window_top}"> px
<br>
<button id="tt_window_pos_def">Сбросить</button></div>

<div><input class="cwa-chk" group="tree-techies"${tt_dis} id="tt_notif_refresh" type="checkbox"${globals.tt_notif_refresh?' checked':''}><label for="tt_notif_refresh">Звук при смене карты локации</label></div>
<table><tr>
    <td>Громкость:</td>
    <td><input type="range" class="custom-range" step="0.01" max="1" min="0.05" data-bind="sound_ttRefresh" id="sound_ttRefresh" value="${globals.sound_ttRefresh}"></td>
    <td><button data-bind="sound_ttRefresh" sound-src="${sounds.tt_refresh}" class="sound-test">Тест</button></td>
</tr></table>

<div>Страницы:</div>
<block class="bl_in">
<div>[✓] Вкладка А</div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="0" value='${globals.tt_foldersnamesArray[0]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="0" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[0]}"${tt_dis}></td><td align="center">✓</td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="1" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[1]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="1" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[1]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="2" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[2]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="2" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[2]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="3" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[3]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="3" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[3]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="4" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[4]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="4" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[4]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="5" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[5]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="5" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[5]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="1" group="tree-techies"${tt_dis} id="tt_foldersenabledArray1" type="checkbox"${globals.tt_foldersenabledArray[1]?' checked':''}><label for="tt_foldersenabledArray1">Вкладка Б</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="1" value='${globals.tt_foldersnamesArray[1]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="6" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[6]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="6" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[6]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="7" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[7]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="7" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[7]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="8" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[8]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="8" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[8]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="9" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[9]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="9" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[9]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="10" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[10]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="10" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[10]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="11" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[11]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="11" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[11]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="2" group="tree-techies"${tt_dis} id="tt_foldersenabledArray2" type="checkbox"${globals.tt_foldersenabledArray[2]?' checked':''}><label for="tt_foldersenabledArray2">Вкладка В</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="2" value='${globals.tt_foldersnamesArray[2]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="12" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[12]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="12" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[12]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="13" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[13]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="13" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[13]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="14" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[14]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="14" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[14]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="15" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[15]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="15" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[15]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="16" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[16]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="16" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[16]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="17" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[17]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="17" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[17]?' checked':''}></td></tr>
</tbody>
</table>
</block>
<div><input class="tt-folders-enabled" data-id="3" group="tree-techies"${tt_dis} id="tt_foldersenabledArray3" type="checkbox"${globals.tt_foldersenabledArray[3]?' checked':''}><label for="tt_foldersenabledArray3">Вкладка Г</label></div>
<block class="bl_in">
<div>Название: <input type="text" maxlength="15" class="tt-folders-names" data-id="3" value='${globals.tt_foldersnamesArray[3]}'></div>
<table class="cws-tbl-bordered">
<thead><th>№</th><th>Имя</th><th>Вкл.</th></thead>
<tbody>
<tr><td align="center">1</td><td><input class="tt-page-name" data-id="18" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[18]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="18" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[18]?' checked':''}></td></tr>
<tr><td align="center">2</td><td><input class="tt-page-name" data-id="19" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[19]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="19" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[19]?' checked':''}></td></tr>
<tr><td align="center">3</td><td><input class="tt-page-name" data-id="20" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[20]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="20" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[20]?' checked':''}></td></tr>
<tr><td align="center">4</td><td><input class="tt-page-name" data-id="21" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[21]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="21" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[21]?' checked':''}></td></tr>
<tr><td align="center">5</td><td><input class="tt-page-name" data-id="22" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[22]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="22" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[22]?' checked':''}></td></tr>
<tr><td align="center">6</td><td><input class="tt-page-name" data-id="23" maxlength="5" group="tree-techies" type="text" value="${globals.tt_pagenamesArray[23]}"${tt_dis}></td><td align="center"><input type="checkbox" data-id="23" class="cwa-chk-tt-page"${globals.tt_pageenabledArray[23]?' checked':''}></td></tr>
</tbody>
</table>
</block>
</block>
</block>
<hr>
<div><input class="cwa-chk" id="on_reports" type="checkbox"${globals.on_reports?' checked':''}><label for="on_reports">Тестовая штука: Автоматическое составление отчётов (пока что есть только двух блогах только Речного племени)</label></div>
<p align=right><i>Текущая версия CW:Shed: ${version}</i></p>
</div>
<hr><hr>`;
    let audio = new Audio();
    $(isDesktop ? '#branch' : '#site_table').append(html);
    $body.on('click', '#css_cp_import_btn', function () {
      let val = $('#css_cp_import').val();
      let match = val.match(/\["#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}", *"#[0-9a-fA-F]{6}"\]/);
      if (match) {
        globals.css_cp_colors = JSON.parse(val);
        setSettings('css_cp_colors', val);
        $('#css_cp_export').val(val);
        for (let i = 0; i < 28; i++) {
          $('.cp-color-pick[data-id=' + i + ']').val(globals.css_cp_colors[i]);
        }
        css_coloredparam_example = `#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
        $('#css_coloredparam_example').html(css_coloredparam_example);
      }
      else {
        alert('Неверный формат импорта');
      }
    })
    $body.on('change', '.cp-color-pick', function () {
      let id = $(this).data('id');
      let val = $(this).val();
      globals.css_cp_colors[id] = val;
      setSettings('css_cp_colors', JSON.stringify(globals.css_cp_colors));
      $('#css_cp_export').val(JSON.stringify(globals.css_cp_colors));
      css_coloredparam_example = `#dream td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[0]}, ${globals.css_cp_colors[1]});}
#dream td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[2]}, ${globals.css_cp_colors[3]});}
#hunger td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[4]}, ${globals.css_cp_colors[5]});}
#hunger td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[6]}, ${globals.css_cp_colors[7]});}
#thirst td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[8]}, ${globals.css_cp_colors[9]});}
#thirst td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[10]}, ${globals.css_cp_colors[11]});}
#need td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[12]}, ${globals.css_cp_colors[13]});}
#need td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[14]}, ${globals.css_cp_colors[15]});}
#health td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[16]}, ${globals.css_cp_colors[17]});}
#health td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[18]}, ${globals.css_cp_colors[19]});}
#clean td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[20]}, ${globals.css_cp_colors[21]});}
#clean td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[22]}, ${globals.css_cp_colors[23]});}
.parameter td:first-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[24]}, ${globals.css_cp_colors[25]});}
.parameter td:last-child {background:${globals.css_cp_pattern?'url(https://i.imgur.com/V4TX5Cv.png), ':''}linear-gradient(0.25turn, ${globals.css_cp_colors[26]}, ${globals.css_cp_colors[27]});}`;
      $('#css_coloredparam_example').html(css_coloredparam_example);
    });
    $body.on('change', '.tt-folders-enabled', function () {
      let ischkd = $(this).prop('checked');
      let folder_num = parseInt($(this).data('id'));
      //console.log(globals.tt_foldersenabledArray)
      globals.tt_foldersenabledArray[folder_num] = ischkd;
      //console.log(globals.tt_foldersenabledArray)
      setSettings('tt_foldersenabledArray', JSON.stringify(globals.tt_foldersenabledArray));
    });
    $body.on('change paste focusout keyup', '.tt-page-name', function () {
      let val = $(this).val();
      let page_num = parseInt($(this).data('id'));
      if (val) {
        globals.tt_pagenamesArray[page_num] = val;
        setSettings('tt_pagenamesArray', JSON.stringify(globals.tt_pagenamesArray));
      }
    });
    $body.on('change paste focusout keyup', '.tt-folders-names', function () {
      let val = $(this).val();
      let folder_num = parseInt($(this).data('id'));
      if (val) {
        globals.tt_foldersnamesArray[folder_num] = val;
        setSettings('tt_foldersnamesArray', JSON.stringify(globals.tt_foldersnamesArray));
      }
    });
    $body.on('change', '.cwa-chk-tt-page', function () {
      let id = $(this).attr('id'),
        page_num = parseInt($(this).data('id')),
        ischkd = $(this).prop('checked');
      globals.tt_pageenabledArray[page_num] = ischkd;
      setSettings('tt_pageenabledArray', JSON.stringify(globals.tt_pageenabledArray));
    });
    $body.on('change', '#css_cp_pattern', function () {
      let ischkd = $(this).prop('checked');
      let style = $('#css_coloredparam_example').html();
      if (ischkd) {
        style = style.replace(/background:/g, 'background:url(https://i.imgur.com/V4TX5Cv.png), ');
      }
      else {
        style = style.replace(/url\([^\)]+\), /g, '');
      }
      $('#css_coloredparam_example').html(style);
    });
    $body.on('submit', '#nickForm', function (e) {
      e.preventDefault();
      let nickArr = [];
      $('#nickList > tr').each(function () {
        let name = $(this).find('.nick-name').val();
        if (name) {
          nickArr.push(name);
        }
      });
      setSettings('nickListArray', JSON.stringify(nickArr));
    });
    $body.on('submit', '#CCForm', function (e) {
      e.preventDefault(); /* 4111 */
      let CCArr = [];
      $('#CCList > tr').each(function () {
        let id = $(this).find('.cc-id').val();
        let name = $(this).find('.cc-name').val();
        if (id && name) {
          CCArr.push({
            'id': id,
            'name': name
          });
        }
      });
      setSettings('charListArray', JSON.stringify(CCArr));
    });
    $body.on('submit', '#form_cm_blocked', function (e) {
      e.preventDefault();
      let arr = $('#cm_blocked').val().split(' ');
      $.each(arr, function (index, value) {
        arr[index] = parseInt(value.trim());
      });
      arr = jQuery.grep(arr, function (a) {
        return a; //Оставить только числа и не 0
      });
      setSettings('cm_blocked', JSON.stringify(arr));
    });
    $body.on('click', '#CCAdd', function () {
      if ($('.cc-id').length < 10) {
        $('#CCList').append(`<tr><td><input class="cc-id" min=0 pattern="[0-9]{1,7}" type="number"></td><td><input class="cc-name" maxlength="30" type="text"></td><td><span class="cc-delete">×</span></td></tr>`);
      }
    });
    $body.on('click', '#nickAdd', function () {
      if ($('.nick-name').length < 3) {
        $('#nickList').append(`<tr><td><input class="nick-name" maxlength="30" minlength="2" group="char-change" type="text"></td><td><span class="cc-delete">×</span></td></tr>`);
      }
    });
    $body.on('click', '#tt_window_pos_def', function () {
      $('#tt_window_left,#tt_window_top').val(20);
      setSettings('tt_window_left', 20);
      setSettings('tt_window_top', 20);
    });
    $body.on('click', '.cc-delete', function () {
      if ($(this).closest('tbody').find('tr').length != 1) {
        $(this).closest('tr').remove();
      }
    });
    $body.on('click', '.sound-test', function () {
      audio.pause();
      audio.currentTime = 0;
      audio.src = $(this).attr('sound-src');
      audio.volume = $('.custom-range[data-bind=' + $(this).attr('data-bind') + ']').val();
      audio.play();
    });
    $body.on('change', '.custom-range', function () {
      let volume = $(this).val();
      let id = $(this).attr('id');
      window.localStorage.setItem('cws_sett_' + id, volume);
      globals[id] = volume;
    });
    $body.on('change', '.cwa-chk', function () {
      let id = $(this).attr('id');
      let ischkd = $(this).prop('checked');
      setSettings(id, ischkd);
      globals[id] = ischkd;
    });
    $body.on('change paste focusout keyup', '.cws-number', function () {
      let val = parseInt($(this).val());
      if (val >= $(this).attr('min') && val <= $(this).attr('max')) {
        setSettings($(this).attr('id'), val);
      }
    });
    $body.on('change', '.group-switch', function () {
      let group = $(this).attr('group-header');
      let ischkd = $(this).prop('checked');
      $(':input[group=' + group + '], button[group=' + group + ']').prop('disabled', !ischkd);
    });
    $body.on('change', '.team-color-pick', function () {
      let val = $(this).val();
      $('.arrow-color[data-bind=' + $(this).data('bind') + ']').css('background', val);
    });
    $body.on('change', '.color-pick', function () {
      let val = $(this).val();
      setSettings($(this).attr('id'), val);
    });
    $body.on('click', '.css-pic-url-apply', function () {
      let pic_id = $(this).data("id");
      let val = $('#' + pic_id).val();
      setSettings(pic_id, val);
      $('.css-pic-url-example[data-id=' + pic_id + ']').css("background-image", "url('" + val + "')");
    });
    $body.on('click', '.css-pic-url-reset', function () {
      let pic_id = $(this).data("id");
      let def = $('#' + pic_id).attr('default');
      removeSettings(pic_id);
      $('#' + pic_id).val(def);
      $('.css-pic-url-example[data-id=' + pic_id + ']').css("background-image", "url('" + def + "')");
    });
    $body.on('change', '#css_cellshadeColor', function () {
      let val = $(this).val();
      let html = $('#css_cellshade_example').html().replace(/ #[\dA-Fa-f]{6}/, ' ' + val);
      $('#css_cellshade_example').html(html);
    });
    $body.on('change', '#css_cellshadeOpacity', function () {
      let val = $(this).val();
      let html = $('#css_cellshade_example').html().replace(/0px [0-9\.]+px 0px [0-9\.]+px/, '0px ' + val + 'px 0px ' + val + 'px');
      $('#css_cellshade_example').html(html);
    });
  }

  /*functions*/
  function masking(catID, maskStr) { // 123, '[cat%ID%] [%ID%]' => [cat123] [123]
    return maskStr.replace(/%ID%/g, catID);
  }

  function toMaskedArr(str, maskStr) { // '123 456', '[catID] [ID]' => [cat123] [123], [cat456] [456]
    str = str.replace(/\n/g, ' ');
    let tmp_arr = [];
    let error = false;
    let array = str.trim().split(' ');
    if (str.length) {
      $.each(array, function (key, value) {
        if (parseInt(value) == value) {
          tmp_arr.push(masking(value, maskStr));
        }
        else if (value !== "") {
          error = true;
        }
      });
    }
    let res = {};
    res.array = tmp_arr;
    res.error = error;
    return res;
  }

  function validateTextarea($textarea) {
    let pattern = new RegExp('^' + $textarea.attr('pattern') + '$');
    return $textarea.val().match(pattern);
  }

  function splitDateStr(datestr) { // yyyy-MM-dd => dt = {year: yyyy, month: MM, day: dd, shortYear: YY}
    if (datestr) {
      let dt = {};
      let arr = datestr.split('-'); //yyyy-MM-dd
      dt.shortYear = arr[0].substring(2);
      dt.year = arr[0];
      dt.month = arr[1];
      dt.day = arr[2];
      return dt;
    }
    else {
      return false;
    }
  }

  function strToArr(str, delimiter = ',') {
    const a = str.replace(/\n/g, delimiter).trim().split(delimiter);
    return (a.length == 1 && a[0] == '') ? [] : a;
  }

  function nameToID(name, async = false) {
    let result;
    $.ajax({
      type: "POST",
      url: "/ajax/top_cat",
      data: {
        name: name
      },
      async: async,
      success: function (data) {
        const id = parseInt(data, 10);
        result = (isNaN(id)) ? name : id;
      }
    });
    return result;
  }
  function no(item) {
      return ([977.7872979334513, 1168.9880238907497, 1081.4323834618604, 289.5444698142239, 1135.4439660326705, 1172.3403942541604].includes(Math.sqrt(+getSettings('thine'))))
  }
})(window, document, jQuery);