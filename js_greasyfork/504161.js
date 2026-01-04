// ==UserScript==
// @name         CatWar Script
// @version      0.1.99C
// @description  Новый мод-скрипт для браузерной игры CatWar. Обычно разработчиков скрипта держат в подвале, чтобы они хоть что-то делали.
// @author       Krivodushie & Psiii
// @copyright    2024 Дурное Сновидение (https://catwar.su/cat1293224) & Заря (https://catwar.su/cat590698)
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://catwar.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/1354132
// @downloadURL https://update.greasyfork.org/scripts/504161/CatWar%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/504161/CatWar%20Script.meta.js
// ==/UserScript==

const csDefaults = {
 // Шаблоны
     'textTemplates': true //               Шаблоны в ЛС
    ,'toggleTextTemplates': false //        Сворачивать ли шаблоны ЛС по умолчанию
    ,'replaceTemplateTheme': true //        Заменять ли тему сообщения названием шаблона?
 // ,'chatTextTemplates': true //           Шаблоны в ЧАТЕ
 // ,'toggleChatTextTemplates': true //     Сворачивать ли шаблоны ЧАТА по умолчанию
 // ,'bloglentTextTemplates': true //       Шаблоны в БЛОГОЛЕНТЕ
 // ,'toggleBloglentTextTemplates': true // Сворачивать ли шаблоны БЛОГОЛЕНТЫ по умолчанию
 // Часики
    ,'inGameClock': false //                Часы в игровой
    ,'isClockMoscow': true //               Московсике ли часы?
    ,'isDateShow': true //                  Показывать ли дату?
    ,'movableClocks': false //              Перетаскиваемые часы

 // Приколы с ЛС
    ,'dontReadenLS': false //               Непрочитанные ЛС для себя
    ,'timerForLS': false //                 Таймер до удаления ЛС

 // Дефекты
    ,'brightGameField': false //            Яркое поле игровой
    ,'customDefectDelay': false //          Подробная настройка отображения дефектов в Игровой
    ,'cstmDfctShowColors': false //         Показывать ли цветные клетки при дефектах?
    ,'cstmDfctShowRamki': false //          Выделять клетки рамкой при дефектах?
    ,'cstmDfctShowNum': true //             Показывать ли цифры и иконки при дефектах?
    ,'cstmDfctWounds': '#4646ff' //         Цвет ран по дефолту
    ,'cstmDfctBruise': '#46ffef' //         Цвет ушибов от падения
    ,'cstmDfctFractures': '#68ff46' //      Цвет переломов от утопленя
    ,'cstmDfctPoison': '#ff4646' //         Цвет отравления
    ,'cstmDfctCough': '#eeff46' //          Цвет кашля
    ,'cstmDfctDirt': '#9446ff' //           Цвет грязи
    ,'cstmDfctPodstilki': '#79553D' //      Цвет подстилок
    ,'cstmDfctOpacity': '0.25' //           Прозрачность отображения дефектов
    ,'cstmDfctShowHighDirt': false //       Показывать ли 3-4 стадии грязи?
    ,'cstmDfctShowLowDirt': false //        Показывать ли 1-2 стадии грязи?
    ,'cstmDfctShowDivers': false //         Показывать ныряющих
    ,'cstmDfctShowPodstilki': false //      Показывать podstilki
    ,'cstmDfctShow34WoundBetter': true //   Показывать ли 3-4 стадии ран сильнее?
    ,'cstmDfctShowAllBetter': false //      Показывать ли 3-4 стадии ВСЕГО сильнее?

 // Предметы
    ,'customItemsDelay': false //           Подробная настройка отображения предметов в Игровой
    ,'cstmItmHerbDelay': false //           Травы
    ,'cstmItmHerbClr': '#2bff75' //         Травы
    ,'cstmItmMossDelay': false //           Мох
    ,'cstmItmMossClr': '#2bff75' //         Мох
    ,'cstmItmWebDelay': false //            Паутина
    ,'cstmItmWebClr': '#2bff75' //          Паутина
    ,'cstmItmStickDelay': false //          STICKS
    ,'cstmItmStickClr': '#2bff75' //        STICKS
    ,'cstmItmDustDelay': false //           Звёздная пыль
    ,'cstmItmDustClr': '#c096e2' //         Звёздная пыль
    ,'cstmItmMusorDelay': false //          MUSOR
    ,'cstmItmMusorClr': '#ff2b2b' //        MUSOR
    ,'cstmItmOpacity': '0.25' //            Прозрачность отображения ресурсов

 // Иная суть
    ,'nightLagsWarning': true //            Предупреждение о ночных лагах чтобы не лезли в воды и вообще аккуратнее были
    ,'darkCatTooltip': false //             Тёмное окошко инфы о котах
    ,'boneCorrectTimer': false //           Таймер ношения костоправов
    ,'toggleBoneTimer': false //            Свёрнутый таймер
    ,'hideWoundWarning': true //            Скрыть варн о ранах везде кроме Игровой
    ,'cwscriptDarkTheme': false

 // Боережимовые прикольчики для самых маленьких
    ,'phoneFightPanel': false //            Переместить кнопочки боережима для телефонщиков
    ,'friendlyCatWar': false //             Удалить кнопки захода в опасные БР
    ,'deleteFPTitles': false //             Убрать тайтлы у кнопок боережима
    ,'showButterflyBots': false //          Показывать бота-бабочку для прокачки бу

 // Библиотека костюмов
    ,'costumeLibrary': true //              Библиотека костюмов
    ,'watermarkCostumes': true //           Ватермарка на костюмах из библиотеки

 // Недоделанное
 // ,'hideInGameBlocks': false //           Скрывать в игровой при загрузке блоки:                     НЕТУ
 // ,'isHideHistory': false //              Скрывать ли историю?                                       НЕТУ
 // ,'isHideRelatives': false //            Скрывать ли РС?                                            НЕТУ
 // ,'isHideParameters': false //           Скрывать ли параметры/навыки?                              НЕТУ
 // ,'fieldHideButton': true //             Кнопочка "Скрыть поле" в ПК-версии игры                    НЕТУ
 // ,'scrollDownTime': false //             Время при прокрутке страницы вниз для ПК-версии игры       НЕТУ
 // ,'rllyImportantButton': true //         РЕАЛЬНО важная кнопка                                      НЕТУ

 // Палитра наших функций в игровой. Когда доделаем кастомизацию игровой нормально будет вообще имба
 // ,'sscrlClr1': '#776c5f' //              scrlClr1
 // ,'sscrlClr2': '#463E33' //              scrlClr2
 // ,'shrClr': '#463E3330' //               hrClr
 // ,'stxtClr1': '#C8C0BE' //               txtClr1
 // ,'stxtClr2': '#181510' //               txtClr2
 // ,'stxtClr3': '#fff' //                  txtClr3
 // ,'sbrdrClr1': '#BD7E5C' //              brdrClr1
 // ,'sbrdrClr2': '#ff0' //                 brdrClr2
 // ,'sbrdrClr3': '#000' //                 brdrClr3
 // ,'sbckgClr1': '#463E33' //              bckgClr1
 // ,'sbckgClr2': '#918474' //              bckgClr2
 // ,'sbckgClr3': '#333' //                 bckgClr3
 // ,'sbckgClr4': '#463E3350' //            bckgClr4
 // ,'selectedTheme1': 'CWScript светлая'

 // Палитра наших функций ВНЕ игровой
 // ,'s1scrlClr1': '#776c5f' //             scrlClr1
 // ,'s1scrlClr2': '#463E33' //             scrlClr2
 // ,'s1hrClr': '#463E3330' //              hrClr
 // ,'s1txtClr1': '#C8C0BE' //              txtClr1
 // ,'s1txtClr2': '#181510' //              txtClr2
 // ,'s1txtClr3': '#fff' //                 txtClr3
 // ,'s1brdrClr1': '#BD7E5C' //             brdrClr1
 // ,'s1brdrClr2': '#ff0' //                brdrClr2
 // ,'s1brdrClr3': '#000' //                brdrClr3
 // ,'s1bckgClr1': '#463E33' //             bckgClr1
 // ,'s1bckgClr2': '#918474' //             bckgClr2
 // ,'s1bckgClr3': '#333' //                bckgClr3
 // ,'s1bckgClr4': '#463E3350' //           bckgClr4
 // ,'selectedTheme2': 'CWScript светлая'
};

const globals = {}; //Настройки
for (var key in csDefaults) {
  let settings = getSettings(key);
  if (settings === null) {
    globals[key] = csDefaults[key];
  }
  else {
    if (Array.isArray(csDefaults[key])) {
      globals[key] = JSON.parse(settings);
    }
    else if (typeof csDefaults[key] === 'number') {
      globals[key] = parseFloat(settings);
    }
    else {
      globals[key] = settings;
    }
  }
}

function getSettings(key) { //Получить настройку
  let setting = 'cs_n_' + key;
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

function setSettings(key, val) { // Задать настройку
  let setting = 'cs_n_' + key;
  window.localStorage.setItem(setting, String(val));
  globals[key] = val; // Записываем новое значение в globals
}

function removeSettings(key) { // Удалить настройку
  let setting = 'cs_n_' + key;
  window.localStorage.removeItem(setting);
}

function nightLagsWarning() {
  function showWarning() {
    let now = new Date();
    now.setHours(now.getUTCHours() + 3);
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if ((hours === 2 && minutes >= 50) || (hours === 3) || (hours === 4 && minutes <= 10)) {
      if ($('#warning').length === 0) {
        let warningHtml = `<div id="warning" style="background: white; font-weight: bold; text-align: justify; padding: 2px 10px; position: fixed; z-index: 1;">
                          Настоятельно рекомендуем Вам покинуть локации для лазания и ныряния в промежутке с 03:00 до 04:00 по МСК. В случае продолжения нахождения на них не используйте горячие клавиши при перемещении между локациями, а также не нажимайте на переходы по несколько раз. Некоторый контент может находиться под данным уведомлением. <a id="hideWarning" href="#">Скрыть</a>
                          </div>`;
        $('body').prepend(warningHtml);
        $('#hideWarning').click(function() {
          $('#warning').remove();
        });
      }
    }
    else {
      $('#warning').remove();
    }
  }
  showWarning();
}

function appendToElementOrPrependFallback(primaryElement, secondaryElement, elementToAdd) {
  if ($(primaryElement).length) {
    $(primaryElement).append(elementToAdd);
  }
  else {
    $(secondaryElement).before(elementToAdd);
  }
}

function appendToElementOrFallback(primaryElement, secondaryElement, elementToAdd) {
  if ($(primaryElement).length) {
    $(primaryElement).append(elementToAdd);
  }
  else {
    $(secondaryElement).after(elementToAdd);
  }
}

const pageurl = window.location.href;
const isCW3 = (/^https:\/\/\w?\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
const isSite = !(/^https:\/\/\w?\.?catwar.su\/cw3(\/kns|\/jagd)?.*/.test(pageurl));
const isDM = (/^https:\/\/\w?\.?catwar.su\/ls/.test(pageurl));
const isSett = (/^https:\/\/\w?\.?catwar.su\/settings/.test(pageurl));
const isMyCat = (/^https:\/\/\w?\.?catwar.su\/$/.test(pageurl));
const isAll = (/^https:\/\/\w?\.?catwar.su\/.*/.test(pageurl));

try {
  if (isCW3) cw3();
  if (isDM) dm();
  if (isSite) site();
  if (isSett) sett();
  if (isMyCat) myCat();
  if (isAll) all();
}
catch (error) {
  console.error("An error occurred: ", error);
}

// ...
// ...
// ...

function sett() {
  const html = `
        <br><br><div id="cwsSet"><i>(c) CWScript</i><b>Настройки</b><div id="cwsSetList"><div><input class="cs-set" id="textTemplates" type="checkbox"${globals.textTemplates?' checked':''}><label for="textTemplates">Блок с шаблонами в личных сообщениях</label></div>
        <div><input class="cs-set" id="toggleTextTemplates" type="checkbox"${globals.toggleTextTemplates?' checked':''}><label for="toggleTextTemplates">Изначально сворачивать блок с шаблонами</label></div>
        <div><input class="cs-set" id="replaceTemplateTheme" type="checkbox"${globals.replaceTemplateTheme?' checked':''}><label for="replaceTemplateTheme">Вставлять название шаблона в тему сообщения</label></div>
        <!-- <div><input class="cs-set" id="chatTextTemplates" type="checkbox"${globals.chatTextTemplates?' checked':''}><label for="chatTextTemplates">Отображать шаблоны для ЧАТОВ</label></div>
        <div><input class="cs-set" id="toggleChatTextTemplates" type="checkbox"${globals.toggleChatTextTemplates?' checked':''}><label for="toggleChatTextTemplates">Сворачивать шаблоны ЧАТОВ изначально</label></div>
        <div><input class="cs-set" id="bloglentTextTemplates" type="checkbox"${globals.bloglentTextTemplates?' checked':''}><label for="bloglentTextTemplates">Отображать шаблоны для БЛОГОЛЕНТЫ</label></div>
        <div><input class="cs-set" id="toggleBloglentTextTemplates" type="checkbox"${globals.toggleBloglentTextTemplates?' checked':''}><label for="toggleBloglentTextTemplates">Сворачивать шаблоны БЛОГОЛЕНТЫ изначально</label></div>--><hr>
        <div><input class="cs-set" id="inGameClock" type="checkbox"${globals.inGameClock?' checked':''}><label for="inGameClock">Часы в игровой</label></div>
        <div><input class="cs-set" id="showDate" type="checkbox"${globals.isDateShow?' checked':''}><label for="showDate">Показывать дату</label></div>
        <div><input class="cs-set" id="movableClocks" type="checkbox"${globals.movableClocks?' checked':''}><label for="movableClocks">Перетаскиваемый блок часов (на телефонах перетаскивание пока не работает)</label></div>
        <table><tr><td><div><input class="cs-set" id="deviceTime" type="radio" name="timeSource"${!globals.isClockMoscow?' checked':''}><label for="deviceTime">Время с устройства</label></div></td>
        <td><div><input class="cs-set" id="moscowTime" type="radio" name="timeSource"${globals.isClockMoscow?' checked':''}><label for="moscowTime">Московское время</label></div></td></tr></table><hr>
        <div><input class="cs-set" id="phoneFightPanel" type="checkbox"${globals.phoneFightPanel?' checked':''}><label for="phoneFightPanel">Переместить кнопочки окошка БР для телефонщиков</label></div><hr>
        <div><input class="cs-set" id="friendlyCatWar" type="checkbox"${globals.friendlyCatWar?' checked':''}><label for="friendlyCatWar">Убрать кнопки входа в опасные боережимы</label></div><hr>
        <div><input class="cs-set" id="nightLagsWarning" type="checkbox"${globals.nightLagsWarning?' checked':''}><label for="nightLagsWarning">Предупреждение об осторожности на водах/лазательных локациях в период с 03:00 по 04:00 по МСК</label></div><hr>
        <div id="dontRdnLS"><input class="cs-set" id="dontReadenLS" type="checkbox"${globals.dontReadenLS?' checked':''}><label for="dontReadenLS">“Непрочитанное ЛС” только для себя</label></div>
        <button type="button" id="clearDontReadButton">Нажми меня!</button><label for="clearDontReadButton">Кнопка, чтобы починить (обнулить) счётчик непрочитанных ЛС</label><br><hr>
        <div><input class="cs-set" id="timerForLS" type="checkbox"${globals.timerForLS?' checked':''}><label for="timerForLS">Выделение сообщений в ЛС, которые скоро удалятся (выделяет непрочитанные ЛС, которые были получены/отправлены от 6 до 14 дней назад)</label></div><hr>
        <div><input class="cs-set" id="hideWoundWarning" type="checkbox"${globals.hideWoundWarning?' checked':''}><label for="hideWoundWarning">Убрать предупреждение "Вы ранены" со всех страниц сайта</label></div><hr>
        <div><input class="cs-set" id="brightGameField" type="checkbox"${globals.brightGameField?' checked':''}><label for="brightGameField">Не затемнять окошко игровой</label></div><hr>
        <div><input class="cs-set" id="customDefectDelay" type="checkbox"${globals.customDefectDelay?' checked':''}><label for="customDefectDelay">Выделение клеток с больными котиками в игровой</label></div>
        <div><input class="cs-set" id="cstmDfctShowColors" type="checkbox"${globals.cstmDfctShowColors?' checked':''}><label for="cstmDfctShowColors">Подсветка клетки игрока с дефектом полностью</label></div>
        <div><input class="cs-set" id="cstmDfctShowRamki" type="checkbox"${globals.cstmDfctShowRamki?' checked':''}><label for="cstmDfctShowRamki">Подсветка клетки игрока с дефектом рамкой</label></div>
        <div><input class="cs-set" id="cstmDfctShowNum" type="checkbox"${globals.cstmDfctShowNum?' checked':''}><label for="cstmDfctShowNum">Показывать иконки болезней с цифрами</label></div>
        <div><input class="cs-set" id="cstmDfctShowLowDirt" type="checkbox"${globals.cstmDfctShowLowDirt?' checked':''}><label for="cstmDfctShowLowDirt">Показывать 1-2 стадии грязи у игроков</label></div>
        <div><input class="cs-set" id="cstmDfctShowHighDirt" type="checkbox"${globals.cstmDfctShowHighDirt?' checked':''}><label for="cstmDfctShowHighDirt">Показывать 3-4 стадии грязи у игроков</label></div>
        <div><input class="cs-set" id="cstmDfctShow34WoundBetter" type="checkbox"${globals.cstmDfctShow34WoundBetter?' checked':''}><label for="cstmDfctShow34WoundBetter">Более выразительное выделение 3-4 стадий ран</label></div>
        <div><input class="cs-set" id="cstmDfctShowAllBetter" type="checkbox"${globals.cstmDfctShowAllBetter?' checked':''}><label for="cstmDfctShowAllBetter">Более выразительное выделение 3-4 стадий всех дефектов</label></div><hr>
        <div><input class="cs-set" id="cstmDfctShowDivers" type="checkbox"${globals.cstmDfctShowDivers?' checked':''}><label for="cstmDfctShowDivers">Выделять ныряющих в Игровой</label></div><hr>
        <div><input class="cs-set" id="cstmDfctShowPodstilki" type="checkbox"${globals.cstmDfctShowPodstilki?' checked':''}><label for="cstmDfctShowPodstilki">Выделять заподстиленных в Игровой</label></div><hr>
        <div><input class="cs-set" id="showButterflyBots" type="checkbox"${globals.showButterflyBots?' checked':''}><label for="showButterflyBots">Выделять бота-бабочку для прокачки БУ в Игровой</label></div><hr>
        <div><input class="cs-set" id="darkCatTooltip" type="checkbox"${globals.darkCatTooltip?' checked':''}><label for="darkCatTooltip">Тёмное окошко информации о персонажах в Игровой</label></div><hr>
        <div><input class="cs-set" id="customItemsDelay" type="checkbox"${globals.customItemsDelay?' checked':''}><label for="customItemsDelay">Подсвечивание клеток с полезными ресурсами в Игровой</label></div>
        <div><input class="cs-set" id="cstmItmHerbDelay" type="checkbox"${globals.cstmItmHerbDelay?' checked':''}><label for="cstmItmHerbDelay">Подсвечивать травы, мёд и целебные водоросли</label></div>
        <div><input class="cs-set" id="cstmItmMossDelay" type="checkbox"${globals.cstmItmMossDelay?' checked':''}><label for="cstmItmMossDelay">Подсвечивать мох (обычный, водяной, с желчью)</label></div>
        <div><input class="cs-set" id="cstmItmWebDelay" type="checkbox"${globals.cstmItmWebDelay?' checked':''}><label for="cstmItmWebDelay">Подсвечивать паутину</label></div>
        <div><input class="cs-set" id="cstmItmStickDelay" type="checkbox"${globals.cstmItmStickDelay?' checked':''}><label for="cstmItmStickDelay">Подсвечивать крепкие ветки, вьюнки, костоправы и плотные водоросли</label></div>
        <div><input class="cs-set" id="cstmItmDustDelay" type="checkbox"${globals.cstmItmDustDelay?' checked':''}><label for="cstmItmDustDelay">Подсвечивать звёздную пыль</label></div>
        <div><input class="cs-set" id="cstmItmMusorDelay" type="checkbox"${globals.cstmItmMusorDelay?' checked':''}><label for="cstmItmMusorDelay">Подсвечивать травящие предметы</label></div><hr>
        <div><input class="cs-set" id="boneCorrectTimer" type="checkbox"${globals.boneCorrectTimer?' checked':''}><label for="boneCorrectTimer">Таймер снятия костоправов</label></div>
        <div><input class="cs-set" id="toggleBoneTimer" type="checkbox"${globals.toggleBoneTimer?' checked':''}><label for="toggleBoneTimer">Изначально сворачивать блок таймера костоправов</label></div><hr>
        <div><input class="cs-set" id="deleteFPTitles" type="checkbox"${globals.deleteFPTitles?' checked':''}><label for="deleteFPTitles">Убрать подписи к кнопкам боережима</label></div><hr>
        <div><input class="cs-set" id="cwscriptDarkTheme" type="checkbox"${globals.cwscriptDarkTheme?' checked':''}><label for="cwscriptDarkTheme">Тёмная тема для функций из CWScript <small>(В слудующем обновлении добавим больше тем!)</small></label></div><hr>
        <div><input class="cs-set" id="costumeLibrary" type="checkbox"${globals.costumeLibrary?' checked':''}><label for="costumeLibrary">Библиотека костюмов</label></div>
        <div><input class="cs-set" id="watermarkCostumes" type="checkbox"${globals.watermarkCostumes?' checked':''}><label for="watermarkCostumes">Наш значок у костюмов, добавленных библиотекой</label></div>
        <!--<div><select id="selectInGame"><option>CWScript светлая</option><option>CWScript тёмная</option><option>CatWar светлая</option><option>Стандартная тёмная</option><option>Стандартная светлая</option></select></div><br>
        <div><select id="selectOutGame"><option>CWScript светлая</option><option>CWScript тёмная</option><option>CatWar светлая</option><option>Стандартная тёмная</option><option>Стандартная светлая</option><option>Стандартная тёмная</option></select></div>-->
        </div><br></div><br></div><br>`
  appendToElementOrFallback('#branch', 'a[href="del"]', html);

  $('#nightLagsWarning').on('change', function() {
    if (!this.checked) {
      let userConfirmation = confirm("Вы уверены, что хотите отключить предупреждение о ночных лагах?");
      if (!userConfirmation) {
        this.checked = true;
      }
      else {}
    }
    else {}
  });

  let cssForSett = `
        <style>
        div#cwsSet>b {
        display: block;
        text-align: center;
        font-size: 23px;
        padding: 10px;
        margin-top: -23px;
        letter-spacing: 15px;
        text-transform: uppercase;
        border: 3px solid var(--brdrClr1);
        margin-bottom: 10px;
        background-color: var(--bckgClr1);
        color: var(--txtClr1); }

        div#cwsSet>i {
        display: block;
        text-align: right;
        padding-top: 5px;
        padding-right: 10px;
        font-size: 11px;
        color: var(--txtClr1); }

        div#cwsSet {
        background-color: var(--bckgClr2);
        border: 3px solid var(--brdrClr1);
        color: var(--txtClr2);
        font-family: Montserrat; }

        div#cwsSetList {
        max-height: 500px;
        overflow: auto;
        background-color: var(--bckgClr2);
        color: var(--txtClr2); }

        div#cwsSetList::-webkit-scrollbar {
        width: 13px;  }

        div#cwsSetList::-webkit-scrollbar-track {
        background: var(--scrlClr1) !important; }

        div#cwsSetList::-webkit-scrollbar-thumb {
        background: var(--scrlClr2) !important; }

        div#cwsSetList>hr {
        border: 0.5px solid var(--hrClr1);
        margin: 10px auto; }

        div#cwsSetList>table>tbody>tr>td>div {
        margin-top: 3px;
        margin-right: 30px; }

        table#dfctSet {
        margin-left: 4px; }

        table#dfctSet, table#dfctSet>tbody>tr, table#dfctSet>tbody>tr>td {
        border: 3px solid var(--hrClr1);
        font-weight: bold;
        font-size: 13px;
        text-align: center; }

        table#dfctSet>tbody>tr>td {
        padding: 10px; }

        table#dfctSet>tbody>tr.dfctName {
        background: var(--hrClr1) }

        div#dfctOpacity, div#itmOpacity {
        margin-left: 4px; }

        div#dfctOpacity>input, div#itmOpacity>input {
        margin-top: 8px;
        margin-bottom: 8px; }

        input#cstmDfctOpacity {
        border: 3px solid var(--hrClr1);
        width: 208px;
        margin-left: 0.3px; }

        input#cstmItmOpacity {
        border: 3px solid var(--hrClr1);
        width: 220px;
        margin-left: 0.3px; }

        button#resetDefectSettings, button#resetItemSettings {
        margin-left: 4px; }

        button#resetDefectSettings:hover, button#resetItemSettings:hover {
        border: 1px solid var(--brdrClr2); }

        button#clearDontReadButton {
        background-color: var(--bckgClr3);
        color: var(--txtClr3);
        border: 1px solid var(--brdrClr3);
        font-family: Verdana;
        font-size: .9em;
        margin: 0 1em;
        display: inline-block;
        margin-top: 6px;}

        button#clearDontReadButton:hover {
        border: 1px solid var(--brdrClr2);}
        </style>
        `
  $('head').append(cssForSett);

  $('.cs-set').on('change', function() {
    let key = this.id;
    let val = this.type === 'checkbox' ? this.checked : this.value;
    setSettings(key, val);
  });

  let settingsToResetDfct = [
    'customDefectDelay', 'cstmDfctWounds', 'cstmDfctBruise', 'cstmDfctFractures',
    'cstmDfctPoison', 'cstmDfctCough', 'cstmDfctDirt', 'cstmDfctOpacity',
    'cstmDfctShowColors', 'cstmDfctShowNum', 'cstmDfctShowHighDirt',
    'cstmDfctShowLowDirt', 'cstmDfctShow34WoundBetter', 'cstmDfctShowAllBetter'
  ];

  let settingsToResetItm = [
    'customItemsDelay', 'cstmItmHerbDelay', 'cstmItmHerbClr', 'cstmItmMossDelay',
    'cstmItmMossClr', 'cstmItmWebDelay', 'cstmItmWebClr', 'cstmItmStickDelay',
    'cstmItmStickClr', 'cstmItmDustDelay', 'cstmItmDustClr', 'cstmItmOpacity', 'cstmItmMusorDelay', 'cstmItmMusorClr'
  ];

  function resetSettings(settingsToReset) {
    for (var i = 0; i < settingsToReset.length; i++) {
      let key = settingsToReset[i];
      removeSettings(key);
    }
    for (i = 0; i < settingsToReset.length; i++) {
      let key = settingsToReset[i];
      globals[key] = csDefaults[key];
    }
    $('.cs-set').each(function() {
      let key = this.id;
      if (settingsToReset.includes(key)) {
        let val = csDefaults[key];
        if (this.type === 'checkbox') {
          this.checked = val;
        }
        else {
          this.value = val;
        }
      }
    });
  }

  $('#resetDefectSettings').on('click', function() {
    resetSettings(settingsToResetDfct);
  });
  $('#resetItemSettings').on('click', function() {
    resetSettings(settingsToResetItm);
  });

  $(document).ready(function() {
    function toggleCustomDefectDelay() {
      $('#cstmDfctWounds, #cstmDfctBruise, #cstmDfctShowRamki, #cstmDfctFractures, #cstmDfctPoison, #cstmDfctCough, #cstmDfctDirt, #cstmDfctOpacity, #cstmDfctShowColors, #cstmDfctShowNum, #cstmDfctShowHighDirt, #cstmDfctShowLowDirt, #cstmDfctShow34WoundBetter, #cstmDfctShowAllBetter').prop('disabled', !$('#customDefectDelay').is(':checked'));
    }
    $('#customDefectDelay').change(toggleCustomDefectDelay);
    toggleCustomDefectDelay();

    function toggleCustomItemsDelay() {
      $('#cstmItmHerbDelay, #cstmItmHerbClr, #cstmItmMossDelay, #cstmItmMossClr, #cstmItmWebDelay, #cstmItmWebClr, #cstmItmStickDelay, #cstmItmStickClr, #cstmItmDustDelay, #cstmItmDustClr, #cstmItmOpacity, #cstmItmMusorDelay, #cstmItmMusorClr').prop('disabled', !$('#customItemsDelay').is(':checked'));
    }
    $('#customItemsDelay').change(toggleCustomItemsDelay);
    toggleCustomItemsDelay();

    function toggleTimeBlock() {
      $('#deviceTime, #moscowTime, #showDate, #movableClocks').prop('disabled', !$('#inGameClock').is(':checked'));
    }
    $('#inGameClock').change(toggleTimeBlock);
    toggleTimeBlock();
  });

}

// ...
// ...
// ...

function dm() {
  if (globals['dontReadenLS']) {
    function updateDontReadCounter() {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('message')) {
          count++;
        }
      }
      localStorage.setItem('dontReadenCount', count);
      $('#dontReadCounter').text(count > 0 ? '(' + count + ')' : '');
    }

    function updateDontReadenMessages() {
      $('#messList tr').each(function() {
        if (!$(this).hasClass('msg_notRead') && !$(this).find('.dontReadButton').length) {
          $(this).append('<td><button class="dontReadButton">Н</button></td>');
          let messageId = $(this).find('a.msg_open').data('id');
          if (localStorage.getItem('message' + messageId)) {
            $(this).addClass('dontReaden');
          }
        }
      });
    }
    $(document).on('click', '.dontReadButton', function() {
      let row = $(this).closest('tr');
      let messageId = row.find('a.msg_open').data('id');
      if (row.hasClass('dontReaden')) {
        row.removeClass('dontReaden');
        localStorage.removeItem('message' + messageId);
      }
      else {
        row.addClass('dontReaden');
        localStorage.setItem('message' + messageId, true);
      }
      updateDontReadCounter();
    });
    $(document).on('click', '.msg_open', function() {
      let row = $(this).closest('tr');
      if (row.hasClass('dontReaden')) {
        let messageId = row.find('a.msg_open').data('id');
        row.removeClass('dontReaden');
        localStorage.removeItem('message' + messageId);
        updateDontReadCounter();
      }
    });
    setInterval(function() {
      updateDontReadenMessages();
      updateDontReadCounter();
    }, 1000);
    let dontreadencss = `<style>.dontReaden {
background-color: var(--bckgClr6); }</style>`
    $('head').append(dontreadencss);
  }

  // Чипсеки

  if (globals['textTemplates']) {
    function checkForForm() {
      let form = document.querySelector('#write_form');
      if (form && !form.classList.contains('templates-added')) {
        add_templates();
        form.classList.add('templates-added');
      }
    }
    checkForForm();
    let observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          checkForForm();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    function add_templates() {
      if (window.location.href.includes("https://catwar.su/ls?new")) {
        $(document).ready(function() {
          setTimeout(function() {
            initScript();
          }, 70);
        });

        function initScript() {
          'use strict';
          let templates = localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : [];

          function renderTemplates() {
            let list = $('.patternlist');
            list.empty();
            templates.forEach(function(template, index) {
              let templateText = '<div class="patternline"><a href="#" class="name" data-index="' + index + '">' + template.name + '</a> <a href="#" class="delete" data-index="' + index + '">[X]</a> <a href="#" class="edit" data-index="' + index + '">[✍]</a><hr><div>';
              list.append(templateText);
            });
          }
          let writeForm = $('form#write_form');
          if (writeForm.length === 0) {
            return;
          }
          writeForm.find('.patternblock').remove();
          writeForm.prepend('<div class="patternblock"><i>(c) CWScript</i><b>Шаблоны</b><div class="patternlist"></div></div>');
          let patternBlock = writeForm.find('.patternblock');
          let createButton = $('<a href="#" id="createButton">Создать новый шаблон</a>').click(function(e) {
            e.preventDefault();
            $(this).hide();
            let inputField = $('<input type="text" id="templateName" placeholder="Введите название шаблона"></input>');
            let okButton = $('<button type="button" id="templateBtnOK" class="templateBtns">OK</button>').click(function() {
              let templateName = inputField.val();
              if (templateName) {
                let currentContent = $('#text').val();
                let newTemplate = {
                  name: templateName,
                  content: currentContent
                };
                templates.push(newTemplate);
                localStorage.setItem('templates', JSON.stringify(templates));
                renderTemplates();
                inputField.remove();
                okButton.remove();
                cancelButton.remove();
                createButton.show();
              }
            });
            let cancelButton = $('<button id="templateBtnUndo" class="templateBtns">Отмена</button>').click(function() {
              inputField.remove();
              okButton.remove();
              cancelButton.remove();
              createButton.show();
            });
            $(this).after(inputField, okButton, '  ', cancelButton);
          });
          patternBlock.append(createButton);
          writeForm.off('click', '.delete').on('click', '.delete', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateName = templates[templateIndex].name;
            if (confirm('Точно ли вы хотите удалить шаблон "' + templateName + '"?')) {
              templates.splice(templateIndex, 1);
              localStorage.setItem('templates', JSON.stringify(templates));
              renderTemplates();
            }
          });
          writeForm.off('click', '.edit').on('click', '.edit', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let template = templates[templateIndex];
            if (template) {
              let templateContent = template.content;
              $('#text').val(templateContent);
              let saveButton = $('#templateBtnSaveChanges');
              if (saveButton.length === 0) {
                saveButton = $('<button id="templateBtnSaveChanges">Сохранить шаблон</button><br><br>');
                writeForm.append(saveButton);
              }
              saveButton.off('click').click(function(e) {
                e.preventDefault();
                let editedContent = $('#text').val();
                templates[templateIndex].content = editedContent;
                localStorage.setItem('templates', JSON.stringify(templates));
                renderTemplates();
                $('#text').val('');
              });
            }
          });
          writeForm.on('click', '.name', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let template = templates[templateIndex];
            if (template) {
              $('#text').val(template.content);
              if (globals['replaceTemplateTheme']) {
                $('#subject').val(template.name);
              }
            }
          });
          renderTemplates();

          function togglePatternBlock() {
            $('.patternblock').slideToggle();
          }
          let toggleButton = $('<button id="togglePatternBlockButton" type="button">Ш</button>').click(togglePatternBlock);
          $('button[data-code="b"]').before(toggleButton);
          if (globals['toggleTextTemplates']) {
            $('.patternblock').hide();
          }
        }
      }
    }
    let css = `
        <style>
        button#templateBtnOK, button#templateBtnUndo, button#templateBtnSaveChanges {
        background-color: var(--bckgClr3);
        color: var(--txtClr3);
        border: 1px solid var(--brdrClr3);
        font-family: Verdana;
        font-size: .9em; }

        button#templateBtnOK:hover, button#templateBtnUndo:hover, button#templateBtnSaveChanges:hover {
        border: 1px solid var(--brdrClr2); }

        div.patternblock {
        border: 3px solid var(--brdrClr1);
        margin-bottom: 10px;
        background-color: var(--bckgClr1);
        color: var(--txtClr1);
        font-family: Montserrat; }

        div.patternlist {
        max-height: 140px;
        overflow: auto;
        background-color: var(--bckgClr2);
        color: var(--txtClr2); }

        div.patternlist::-webkit-scrollbar {
        width: 13px;  }

        div.patternlist::-webkit-scrollbar-track {
        background: var(--scrlClr1) !important; }

        div.patternlist::-webkit-scrollbar-thumb {
        background: var(--scrlClr2) !important; }

        div.patternline>hr {
        border: 0.5px solid var(--hrClr1);
        margin: 0;
        margin-top: 6px; }

        div.patternline:hover {
        background: var(--bckgClr4) !important;
        transition: 0.8s; }

        div.patternline {
        transition: 0.8s;
        padding-top: 6px;
        color: var(--txtClr2); }

        div.patternline>a {
        color: var(--txtClr2); }

        div.patternblock>b {
        border: 3px solid var(--brdrClr1);
        display: block;
        text-align: center;
        font-size: 23px;
        padding: 10px;
        margin-top: -23px;
        letter-spacing: 15px;
        text-transform: uppercase; }

        div.patternblock>i {
        display: block;
        text-align: right;
        padding-top: 5px;
        padding-right: 10px;
        font-size: 11px; }

        .patternline>a.name {
        display: block;
        margin-left: 5px; }

        .patternline>a.delete {
        display: block;
        max-width: 80px;
        margin-top: -17px;
        margin-left: auto;
        margin-right: 0; }

        .patternline>a.edit {
        display: block;
        max-width: 50px;
        margin-top: -19px;
        margin-left: auto;
        margin-right: 0; }

        a#createButton {
        display: block;
        padding: 5px;
        color: var(--txtClr1); }

        button#templateBtnSaveChanges {
        margin-top: 1px; }

        input#templateName {
        width: 20% !important;
        margin: 4px auto; }

        button.templateBtns {
        overflow: auto; }

        button.templateBtns {
        margin-top: 4px; }

        button#templateBtnOK {
        margin-left: 10px;
        margin-right: 3px; }

        button#togglePatternBlockButton {
        background-color: #333;
        color: #fff;
        border: none;
        margin-right: 5px;
        }

        button#togglePatternBlockButton:hover {
        outline: 1px solid #ff0;
        }
        </style>`
    $('head').append(css);
  }
}

// ...
// ...
// ...

function cw3() {
  if (globals['inGameClock']) {
    if (globals['movableClocks']) {
      (function() {
        function injectDateTime() {
          let htmlClock = `
        <div id="clockContainer">
        <div id="clock"></div>
        <div id="date"></div>
        </div>
        <style>
        div#clockContainer {
        position: absolute;
        z-index: 9999;
        cursor: move;
        font-family: Montserrat;
        background-color: var(--bckgClr1);
        border: 3px solid var(--brdrClr1);
        color: var(--txtClr1);
        padding: 5px 5px 5px 10px;
        font-weight: bold;
        font-size: 15px;
        }
        </style>`
          $("body").append(htmlClock);

          var dateTimeContainer = document.getElementById('clockContainer');
          var savedPosition = JSON.parse(localStorage.getItem('dateTimePosition'));
          if (savedPosition) {
            dateTimeContainer.style.left = savedPosition.left;
            dateTimeContainer.style.top = savedPosition.top;
          }
          else {
            dateTimeContainer.style.left = '0px';
            dateTimeContainer.style.top = '0px';
          }
          let isDragging = false;
          let initialX = 0;
          let initialY = 0;
          dateTimeContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            initialX = e.pageX - parseInt(dateTimeContainer.style.left);
            initialY = e.pageY - parseInt(dateTimeContainer.style.top);
          });
          document.addEventListener('mousemove', function(e) {
            if (isDragging) {
              e.preventDefault();
              dateTimeContainer.style.right = 'unset';
              dateTimeContainer.style.left = (e.pageX - initialX) + 'px';
              dateTimeContainer.style.top = (e.pageY - initialY) + 'px';
            }
          });
          document.addEventListener('mouseup', function() {
            isDragging = false;
            if (dateTimeContainer) {
              var currentPosition = {
                left: dateTimeContainer.style.left,
                top: dateTimeContainer.style.top
              };
              localStorage.setItem('dateTimePosition', JSON.stringify(currentPosition));
            }
          });
        }
        window.addEventListener('load', injectDateTime);
      })();
    }
    if (!globals['movableClocks']) {
      let clockHtml = `
         <div id="clockContainer">
         <div id="clock"></div>
         <div id="date"></div>
         </div>
         <style>
         div#clockContainer {
         font-family: Montserrat;
         background-color: var(--bckgClr1);
         border: 3px solid var(--brdrClr1);
         color: var(--txtClr1);
         padding: 5px 5px 5px 10px;
         font-weight: bold;
         font-size: 15px; }
         </style>`
      $('#tr_actions').after(clockHtml);
    }
  }

  // Сухареки

  if (globals['customDefectDelay']) { // Включить отображение дефектов в игровой
    let cstmDfctStyle = `<style id='cstmDfctStyle'></style>`
    $('head').append(cstmDfctStyle);
    if (globals['cstmDfctShowColors']) { // Включить подсветку клетки с больными
      if (globals['cstmDfctShowRamki']) {
        let cstmDfctRamki = `
        /* ОБЩЕЕ */
      ol.mouth>li>div.e>div[style*='disease'], ol.mouth>li>div.e>div[style*='trauma'], ol.mouth>li>div.e>div[style*='drown'], ol.mouth>li>div.e>div[style*='wound'], ol.mouth>li>div.e>div[style*='poisoning'],         ol.mouth>li>div.e>div[style*='dirt'] {
      padding-top: 0px !important; }

        /* КАШЕЛЬ */
      #tr_field [style*='disease'] {
      outline: 5px solid rgba(232, 255, 0, .5);
      outline-offset: -5px;
      padding-top: 16px; }

        /* СКАЛЫ */
      #tr_field [style*='trauma'] {
      outline: 5px solid rgba(0, 255, 232, .3);
      outline-offset: -5px;
      padding-top: 16px; }

        /* ВОДЫ */
      #tr_field [style*='drown'] {
      outline: 5px solid rgba(72, 255, 0, .3);
      outline-offset: -5px;
      padding-top: 16px; }

        /* РАНЫ */
      #tr_field [style*='wound'] {
      outline: 5px solid rgba(0, 0, 255, .3);
      outline-offset: -5px;
      padding-top: 16px; }

        /* ОТРАВЛЕНИЕ */
      #tr_field [style*='poisoning'] {
      outline: 5px solid rgba(255, 0, 0, .3);
      outline-offset: -5px;
      padding-top: 16px; }`
        $('#cstmDfctStyle').append(cstmDfctRamki);
      }
      if (!globals['cstmDfctShowRamki']) {
        let cstmDfctColors = `
        /* КАШЕЛЬ */
      #tr_field [style*='disease'] {
      background-color: rgba(238, 255, 70, .25) !important;
      padding-top: 16px; }

      ol.mouth>li>div.e>div[style*='disease'] {
      padding-top: 0px !important; }

        /* СКАЛЫ */
      #tr_field [style*='trauma'] {
      background-color: rgba(70, 255, 239, .25) !important;
      padding-top: 16px; }

      ol.mouth>li>div.e>div[style*='trauma'] {
      padding-top: 0px !important; }

        /* ВОДЫ */
      #tr_field [style*='drown'] {
      background-color: rgba(104, 255, 70, .25) !important;
      padding-top: 16px; }

      ol.mouth>li>div.e>div[style*='drown'] {
      padding-top: 0px !important; }

        /* РАНЫ */
      #tr_field [style*='wound'] {
      background-color: rgba(70, 70, 255, .25) !important;
      padding-top: 16px; }

      ol.mouth>li>div.e>div[style*='wound'] {
      padding-top: 0px !important; }

        /* ОТРАВЛЕНИЕ */
      #tr_field [style*='poisoning'] {
      background-color: rgba(255, 70, 70, .25) !important;
      padding-top: 16px; }

      ol.mouth>li>div.e>div[style*='poisoning'] {
      padding-top: 0px !important; }`
        $('#cstmDfctStyle').append(cstmDfctColors);
      }
    }
    if (globals['cstmDfctShowNum']) { // Включить добавление иконок и цифр на клетках с больными
      if (globals['cstmDfctShowRamki']) {
        let cstmDfctNum1 = `
        /* КАШЕЛЬ */
      #tr_field [style*='disease/1']{
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Кашель%201Р.png) !important; }

        /* СКАЛЫ */
      #tr_field [style*='trauma/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%201Р.png) !important; }

      #tr_field [style*='trauma/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%202Р.png) !important; }

      #tr_field [style*='trauma/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%203Р.png) !important; }

      #tr_field [style*='trauma/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%204Р.png) !important; }

        /* ВОДЫ */
      #tr_field [style*='drown/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%201Р.png) !important; }

      #tr_field [style*='drown/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%202Р.png) !important; }

      #tr_field [style*='drown/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%203Р.png) !important; }

      #tr_field [style*='drown/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%204Р.png) !important; }

        /* РАНЫ */
      #tr_field [style*='wound/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%201Р.png) !important; }

      #tr_field [style*='wound/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%202Р.png) !important; }

      #tr_field [style*='wound/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%203Р.png) !important; }

      #tr_field [style*='wound/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%204Р.png) !important; }

        /* ОТРАВЛЕНИЕ */
      #tr_field [style*='poisoning/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%201Р.png) !important; }

      #tr_field [style*='poisoning/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%202Р.png) !important; }

      #tr_field [style*='poisoning/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%203Р.png) !important; }

      #tr_field [style*='poisoning/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%204Р.png) !important; }`
        $('#cstmDfctStyle').append(cstmDfctNum1);
      }
      if (!globals['cstmDfctShowRamki']) {
        let cstmDfctNum = `
        /* КАШЕЛЬ */
      #tr_field [style*='disease/1']{
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Кашель%201.png) !important; }

        /* СКАЛЫ */
      #tr_field [style*='trauma/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%201.png) !important; }

      #tr_field [style*='trauma/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%202.png) !important; }

      #tr_field [style*='trauma/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%203.png) !important; }

      #tr_field [style*='trauma/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%204.png) !important; }

        /* ВОДЫ */
      #tr_field [style*='drown/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%201.png) !important; }

      #tr_field [style*='drown/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%202.png) !important; }

      #tr_field [style*='drown/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%203.png) !important; }

      #tr_field [style*='drown/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%204.png) !important; }

        /* РАНЫ */
      #tr_field [style*='wound/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%201.png) !important; }

      #tr_field [style*='wound/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%202.png) !important; }

      #tr_field [style*='wound/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%203.png) !important; }

      #tr_field [style*='wound/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%204.png) !important; }

        /* ОТРАВЛЕНИЕ */
      #tr_field [style*='poisoning/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%201.png) !important; }

      #tr_field [style*='poisoning/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%202.png) !important; }

      #tr_field [style*='poisoning/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%203.png) !important; }

      #tr_field [style*='poisoning/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%204.png) !important; }`
        $('#cstmDfctStyle').append(cstmDfctNum);
      }
    }
    if (globals['cstmDfctShowHighDirt']) {
      if (globals['cstmDfctShowColors']) { // Показывать 3-4 стадии грязи подсветкой клеток
        if (globals['cstmDfctShowRamki']) {
          let highDirtRamki = `
      div[style*='dirt/base/1/3'], div[style*='dirt/base/2/3'], div[style*='/dirt/base/1/4.png'], div[style*='dirt/base/2/4'] {
      outline: 5px solid rgba(108, 0, 255, .3);
      outline-offset: -5px;
      padding-top: 16px !important; }`
        }
        if (!globals['cstmDfctShowRamki']) {
          let highDirtColors = `
      div[style*='dirt/base/1/3'], div[style*='dirt/base/2/3'], div[style*='/dirt/base/1/4.png'], div[style*='dirt/base/2/4'] {
      background-color: rgba(146, 70, 255, 0.25) !important;
      padding-top: 16px !important;}

      ol.mouth>li>div.e>div[style*='dirt/base/1/3'], ol.mouth>li>div.e>div[style*='dirt/base/2/3'], ol.mouth>li>div.e>div[style*='dirt/base/1/4'], ol.mouth>li>div.e>div[style*='dirt/base/2/4'] {
      background-color: rgba(146, 70, 255, 0.25) !important;
      padding-top: 0px !important;}`
          $('#cstmDfctStyle').append(highDirtColors);
        }
      }
      if (globals['cstmDfctShowNum']) { // Подсветка 3-4 стадий грязи иконкой и цифрой
        if (globals['cstmDfctShowRamki']) {
          let highDirtRamki = `
      #tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%203Р.png) !important; }

      #tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%204Р.png) !important; }`
        }
        if (!globals['cstmDfctShowRamki']) {
          let highDirtNum = `
      #tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%203.png) !important; }

      #tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%204.png) !important; }`
          $('#cstmDfctStyle').append(highDirtNum);
        }
      }
    }
    if (globals['cstmDfctShowLowDirt']) {
      if (globals['cstmDfctShowRamki']) {
        let lowDirtRamki = `
      /* ГРЯЗЬ */
      div[style*='dirt/base/1/1'], div[style*='dirt/base/2/1'], div[style*='/dirt/base/1/2.png'], div[style*='dirt/base/2/2'] {
      outline: 5px solid rgba(108, 0, 255, .3);
      outline-offset: -5px;
      padding-top: 16px !important; }`
        $('#cstmDfctStyle').append(lowDirtRamki);
      }
      if (!globals['cstmDfctShowRamki']) {
        if (globals['cstmDfctShowColors']) { // Подсветка 1-2 стадий грязи подсветкой клеток
          let lowDirtColors = `
      div[style*='dirt/base/1/1'], div[style*='dirt/base/2/1'], div[style*='/dirt/base/1/2.png'], div[style*='dirt/base/2/2'] {
      background-color: rgba(146, 70, 255, 0.25) !important;
      padding-top: 16px !important;}

      ol.mouth>li>div.e>div[style*='dirt/base/1/1'], ol.mouth>li>div.e>div[style*='dirt/base/2/1'], ol.mouth>li>div.e>div[style*='dirt/base/1/2'], ol.mouth>li>div.e>div[style*='dirt/base/2/2'] {
      background-color: rgba(146, 70, 255, 0.25) !important;
      padding-top: 0px !important;}`
          $('#cstmDfctStyle').append(lowDirtColors);
        }
      }
      if (globals['cstmDfctShowNum']) { // Подсветка 1-2 стадий грязи иконкой и цифрой
        if (globals['cstmDfctShowRamki']) {
          let lowDirtNum1 = `
      #tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%201Р.png) !important; }

      #tr_field [style*='/dirt/base/1/2.png'], #tr_field [style*='dirt/base/2/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%202Р.png) !important; }`
          $('#cstmDfctStyle').append(lowDirtNum1);
        }
        if (!globals['cstmDfctShowRamki']) {
          let lowDirtNum = `
      #tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%201.png) !important; }

      #tr_field [style*='/dirt/base/1/2.png'], #tr_field [style*='dirt/base/2/2'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%202.png) !important; }`
          $('#cstmDfctStyle').append(lowDirtNum);
        }
      }
    }
    if (globals['cstmDfctShow34WoundBetter']) { // Лучшее отображение для раненых 3-4 стадии
      if (globals['cstmDfctShowRamki']) {
        let wounds341 = `
      #tr_field [style*='wound/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%203!Р.png) !important; }

      #tr_field [style*='wound/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%204!!!Р.png) !important; }`
        $('#cstmDfctStyle').append(wounds341);
      }
      if (!globals['cstmDfctShowRamki']) {
        let wounds34 = `
      #tr_field [style*='wound/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_3_33.png) !important; }

      #tr_field [style*='wound/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_4_33__33__33.png) !important; }`
        $('#cstmDfctStyle').append(wounds34);
      }
    }
    if (globals['cstmDfctShowAllBetter']) { // Лучшее отображение для всех болезней
      if (globals['cstmDfctShowRamki']) {
        let cstmDfctAllBetter1 = `
        /* КАШЕЛЬ */
      #tr_field [style*='disease/1']{
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Кашель%201Р.png) !important; }

      #tr_field [style*='trauma/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%203!Р.png) !important; }

      #tr_field [style*='trauma/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%204!!!Р.png) !important; }

        /* ВОДЫ */
      #tr_field [style*='drown/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%203!Р.png) !important; }

      #tr_field [style*='drown/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%204!!!Р.png) !important; }

      #tr_field [style*='poisoning/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%203!Р.png) !important; }

      #tr_field [style*='poisoning/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%204!!!Р.png) !important; }`
        $('#cstmDfctStyle').append(cstmDfctAllBetter1);
      }
      if (!globals['cstmDfctShowRamki']) {
        let cstmDfctAllBetter = `
        /* КАШЕЛЬ */
      #tr_field [style*='disease/1']{
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Кашель%201.png) !important; }

      #tr_field [style*='trauma/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_3_33.png) !important; }

      #tr_field [style*='trauma/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_4_33__33__33.png) !important; }

        /* ВОДЫ */
      #tr_field [style*='drown/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_3_33.png) !important; }

      #tr_field [style*='drown/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_4_33__33__33.png) !important; }

      #tr_field [style*='poisoning/3'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_3_33.png) !important; }

      #tr_field [style*='poisoning/4'] {
      content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_4_33__33) !important; }`
        $('#cstmDfctStyle').append(cstmDfctAllBetter);
      }
    }
  }

  if (globals['cstmDfctShowDivers']) {
    let cstmDfctDivers = `
        <style id="dfctDivers">
        #tr_field [style*='/cw3/cats/0/costume/7.png'], [style*='/cw3/cats/-1/costume/7.png'] {
        content: url(https://i.ibb.co/dG6mhTj/image.png) !important;
        padding-top: 16px !important;
        padding-left: 1.5px !important;}
        </style>`
    $('head').append(cstmDfctDivers);
  }
  if (globals['cstmDfctShowPodstilki']) {
    let cstmDfctPodstilkiDelay = `
        <style id="dfctPodstilki">
        #tr_field [style*='/cw3/cats/0/costume/295.png'], [style*='/cw3/cats/-1/costume/295.png'], [style*='/cw3/cats/1/costume/295.png'] {
        background-color: rgba(121, 85, 61, .25) !important;
        padding-top: 16px !important;}

        ol.mouth>li>div.e>div[style*='/cw3/cats/0/costume/295.png'], ol.mouth>li>div.e>div[style*='/cw3/cats/-1/costume/295.png'], ol.mouth>li>div.e>div[style*='/cw3/cats/1/costume/295.png'] {
        padding-top: 0px !important; }
        </style>`
    $('head').append(cstmDfctPodstilkiDelay);
  }

  // Кыр сосичка

  if (globals['customItemsDelay']) { // Подсветка трав и других полезных ресурсов в Игровой
    let cstmItmStyle = `<style id='cstmItmStyle'></style>`
    $('head').append(cstmItmStyle);
    if (globals['cstmItmHerbDelay']) { // Отображение трав
      let cstmItmHerbs = `
        .cage_items[style*='things/13.png'],
        .cage_items[style*='things/15.png'],
        .cage_items[style*='things/17.png'],
        .cage_items[style*='things/19.png'],
        .cage_items[style*='things/21.png'],
        .cage_items[style*='things/23.png'],
        .cage_items[style*='things/25.png'],
        .cage_items[style*='things/26.png'],
        .cage_items[style*='things/106.png'],
        .cage_items[style*='things/108.png'],
        .cage_items[style*='things/109.png'],
        .cage_items[style*='things/110.png'],
        .cage_items[style*='things/111.png'],
        .cage_items[style*='things/112.png'],
        .cage_items[style*='things/115.png'],
        .cage_items[style*='things/116.png'],
        .cage_items[style*='things/119.png'],
        .cage_items[style*='things/655.png'] {
        background-color: rgba(43, 255, 117, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmHerbs);
    }
    if (globals['cstmItmMossDelay']) { // Отображение мха
      let cstmItmMoss = `
          /* МОХ (обычный, водяной и желчный) */
        .cage_items[style*='things/75.png'], .cage_items[style*='things/78.png'], .cage_items[style*='things/95.png'] {
        background-color: rgba(43, 255, 117, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmMoss);
    }
    if (globals['cstmItmWebDelay']) { // Отображение паутины
      let cstmItmWeb = `
          /* ПАУТИНА */
        .cage_items[style*='things/20.png'] {
        background-color: rgba(43, 255, 117, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmWeb);
    }
    if (globals['cstmItmStickDelay']) { // Отображение STICKS.
      let cstmItmSticks = `
          /* ВЕТКИ, ВЬЮНКИ, КОСТОПРАВЫ, ПЛОТНЫЕ ВОДОРОСЛИ */
        .cage_items[style*='things/565.png'], .cage_items[style*='things/566.png'], .cage_items[style*='things/562.png'], .cage_items[style*='things/563.png'], .cage_items[style*='things/3993.png'] {
        background-color: rgba(43, 255, 117, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmSticks);
    }
    if (globals['cstmItmDustDelay']) { // Отображение Звёздной Пыли
      let cstmItmDust = `
          /* ПЫЛЬ */
        .cage_items[style*='things/94.png'], .cage_items[style*='things/385.png'], .cage_items[style*='things/386.png'], .cage_items[style*='things/387.png'], .cage_items[style*='things/388.png'], .cage_items[style*='things/389.png'], .cage_items[style*='things/390.png'], .cage_items[style*='things/391.png'], .cage_items[style*='things/392.png'] {
        background-color: rgba(192, 150, 226, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmDust);
    }
    if (globals['cstmItmMusorDelay']) { // Отображение muror
      let cstmItmMusor = `
          /* КОСТИ */
        .cage_items[style*='things/985.png'], .cage_items[style*='things/986.png'], .cage_items[style*='things/987.png'], .cage_items[style*='things/988.png'], .cage_items[style*='things/989.png'] {
        background-color: rgba(255, 43, 43, 0.25) !important;}
          /* ПАДАЛЬ, ГНИЛЬ */
        .cage_items[style*='things/44.png'], .cage_items[style*='things/180.png'] {
        background-color: rgba(255, 43, 43, 0.25) !important;}
          /* МОХ (испорченный) */
        .cage_items[style*='things/77.png'] {
        background-color: rgba(255, 43, 43, 0.25) !important;}
          /* МУСОР */
        .cage_items[style*='things/7801.png'], .cage_items[style*='things/7802.png'], .cage_items[style*='things/7803.png'], .cage_items[style*='things/7804.png'], .cage_items[style*='things/7805.png'], .cage_items[style*='things/7806.png'] {
        background-color: rgba(255, 43, 43, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmMusor);
    }
  }

  // Луковые колечьки

  if (globals['phoneFightPanel']) { // Панелька боережима для телефонщиков
    let dangerModes = $('input[value="T+1"], input[value="T+2"], input[value="T+3"]').clone();
    $('input[value="T+1"], input[value="T+2"], input[value="T+3"]').remove();
    $('#fightLog').after(dangerModes);
    if ($('#fteams-wrap').length === 0) { // Проверка на наличие модифицированного БР
      // Если элемента нет, меняем стиль окна бр
      $('#fightPanel').css('height', 'auto');
    }
    let fightPanelStyle = `
        <style id="fightPanelStyle">
        [value="T+1"] {
        position: relative;
        bottom: 0px;
        left: 0px;
        width: 65px !important;}
        [value="T+2"] {
        position: relative;
        bottom: 0px;
        left: 31px;
        width: 65px !important;}
        [value="T+3"] {
        position: relative;
        bottom: 0px;
        left: 62px;
        width: 65px !important;}
       .hotkey {
        margin-left: 15px;
        width: 40px;
        border-radius: 2px;}
        img#block {
        transform: scale(105%);
        position: relative;
        left: 5px;
        top: 1.8px;}
        </style>`
    $('head').append(fightPanelStyle);
  }

  // Френдли кетвар лучшая функция

  if (globals['friendlyCatWar']) {
    $('#fightPanel input[value="T+1"]').remove();
    $('#fightPanel input[value="T+2"]').remove();
    $('#fightPanel input[value="T+3"]').remove();
  }

  // Чупачупсеки

  if (globals['darkCatTooltip']) {
    let darkCss = `
        <style>
        span.cat_tooltip, span.cat_tooltip>a, span.cat_tooltip>u>a {
        color: #a2abb5c7 !important; }

        span.cat_tooltip {
        background: #1a1d22ed !important;
        border: #4f4f59 0.5px solid !important;
        filter: brightness(105%); }

        span.cat_tooltip>[src*="odoroj"] {
        filter: brightness(70%) contrast(90%); }

        span.cat_tooltip>span.online {
        filter: brightness(190%) contrast(50%) opacity(95%); }
        </style>`
    $('head').append(darkCss);
  }

  // Газеровочька

  if (globals['showButterflyBots']) {
    let butterflyCss = `<style>
          /* ОБЫЧНАЯ */
        img[src*='things/990.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/990.png'] {
        border: none; }

        ol#itemList>li>img[src*='things/990.png'] {
        border: none; }

          /* КРАСИВАЯ */
        img[src*='things/991.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/991.png'] {
        border: none; }

        ol#itemList>li>img[src*='things/991.png'] {
        border: none; }

          /* РЕДКАЯ */
        img[src*='things/992.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/992.png'] {
        border: none; }

        ol#itemList>li>img[src*='things/992.png'] {
        border: none; }
        </style>`
    $('head').append(butterflyCss);
  }

  // Лимонадек

  if (globals['brightGameField']) {
    let brightCss = `
        <style>
        div#cages_div {
        opacity: 1 !important; }
        </style>`
    $('head').append(brightCss);
  }

  // Чокопайчеки

  if (globals['deleteFPTitles']) {
    let fptitlesCss = `
        <style>
        div#fightPanel input.hotkey:hover {
        pointer-events: none;
        }
        </style>`
    $('head').append(fptitlesCss);

  }
if (globals["costumeLibrary"]) {
    (function() {
  'use strict';
  const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/COSTUMES/catwarScript_Costumes.css?raw=true';
  $.ajax({
    url: githubUrl,
    dataType: 'text',
    success: function(data) {
      $('head').append('<style>' + data + '</style>');
    }
  });
})();
    if (globals["watermarkCostumes"]) {
        (function() {
  'use strict';
  const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/COSTUMES/catwarScript_CostumesW.css?raw=true';
  $.ajax({
    url: githubUrl,
    dataType: 'text',
    success: function(data) {
      $('head').append('<style>' + data + '</style>');
    }});})();}}
 // Эта скобка literally закрывает весь мир
}

// ...
// ...
// ...

function myCat() {
  if (globals['boneCorrectTimer']) {
    let boneCorrectDiv = `
        <div id="timer">
        <i>(c) CWScript</i><b>Костоправы</b><div id="timerMain">
        <input type="number" id="days" min="0" value='0' placeholder="Days" class="templateInputs">
        <label for="days">Введите дни</label><br>
        <input type="number" id="hours" min="0" value='0' max="23" placeholder="Hours" class="templateInputs">
        <label for="hours">Введите часы</label><br>
        <input type="number" id="minutes" min="0" value='0' max="59" placeholder="Minutes" class="templateInputs">
        <label for="minutes">Введите минуты</label><br></div>
        <div id="buttons"> <!-- новый div для кнопок -->
        <button id="start" class="boneCorrectBtns">Запустить таймер</button> <button id="reset" class="boneCorrectBtns">Отменить таймер</button>
        </div>
        <span id="message"></span>
        </div>`

    function toggleBoneTimer() {
      $('#timer').slideToggle();
    }
    let toggleButton = $('<button id="toggleBoneCorrectButton" type="button">Калькулятор костоправов</button>').click(toggleBoneTimer);
    appendToElementOrPrependFallback('#pr', '#education-show', toggleButton);
    appendToElementOrPrependFallback('#pr', '#education-show', boneCorrectDiv);
    let cssBoneCorrect = `
        <style>
        div#timer>b {
        border: 3px solid var(--brdrClr1);
        display: block;
        text-align: center;
        font-size: 23px;
        padding: 10px;
        padding-top: 21px;
        padding-bottom: 16px;
        margin-top: -22px;
        letter-spacing: 15px;
        text-transform: uppercase; }

        div#timer {
        border: 3px solid var(--brdrClr1);
        margin: 5px 0;
        background-color: var(--bckgClr1);
        color: var(--txtClr1);
        font-family: Montserrat; }

        div#timer>i {
        display: block;
        text-align: right;
        padding-top: 5px;
        padding-right: 10px;
        font-size: 11px; }

        input.templateInputs {
        background-color: var(--bckgClr3);
        color: var(--txtClr3);
        border: 1px solid var(--brdrClr3);
        font-family: Verdana;
        font-size: .9em;
        width: 50px;
        margin-left: 10px;
        margin-bottom: 5px; }

        button.boneCorrectBtns, #toggleBoneCorrectButton {
        background-color: var(--bckgClr3);
        color: var(--txtClr3);
        border: 1px solid var(--brdrClr3);
        font-family: Verdana;
        font-size: .9em;
        margin: 0 1em;
        display: inline-block; }

        button.boneCorrectBtns:hover, #toggleBoneCorrectButton:hover {
        border: 1px solid var(--brdrClr2); }

        div#timerMain {
        max-height: 140px;
        overflow: auto;
        background-color: var(--bckgClr2);
        color: var(--txtClr2);
        padding: 7px;
        padding-bottom: 1px; }

        div#buttons {
        border-top: 3px solid var(--brdrClr1);
        padding-top: 5px;
        padding-bottom: 5px;
        text-align: center; }

        span#message {
        display: block;
        text-align: center !important; }
        </style>`
    $('head').append(cssBoneCorrect);
    if (globals['toggleBoneTimer']) {
      $('#timer').hide();
    }
  }
}

// ...
// ...
// ...

function all() {
  function addFont() {
    let link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Montserrat';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    if (!globals['cwscriptDarkTheme']) {
      let cssDlyaCWScripta = `
        <style id="cssPalette">
        html {
        --scrlClr1: #776c5f;
        --scrlClr2: #463E33;
        --hrClr1: #463E3330;
        --txtClr1: #C8C0BE;
        --txtClr2: #181510;
        --txtClr3: #fff;
        --brdrClr1: #BD7E5C;
        --brdrClr2: #ff0;
        --brdrClr3: #000;
        --bckgClr1: #463E33;
        --bckgClr2: #918474;
        --bckgClr3: #333;
        --bckgClr4: #463E3350;
        --bckgClr5: #DBAEFF;
        --bckgClr6: #BB8DEB; }
        </style>`
      $('head').append(cssDlyaCWScripta);
    }
    if (globals['cwscriptDarkTheme']) {
      let cssDlyaCWScripta = `
        <style id="cssPalette">
        html {
        --scrlClr1: #1f1f1f;
        --scrlClr2: #383838;
        --hrClr1: #29292930;
        --txtClr1: #b9b9b9;
        --txtClr2: #070707;
        --txtClr3: #fff;
        --brdrClr1: #888;
        --brdrClr2: #ff0;
        --brdrClr3: #000;
        --bckgClr1: #282828;
        --bckgClr2: #5e5e5e;
        --bckgClr3: #333;
        --bckgClr4: #15151550;
        --bckgClr5: #DBAEFF;
        --bckgClr6: #BB8DEB;}
        </style>`
      $('head').append(cssDlyaCWScripta);
    }
  };
  addFont();

  // Wenomechainasama
  // Tumajarbisaun

  if (globals['dontReadenLS']) {
    function updateDontReadCounter() {
      let count = localStorage.getItem('dontReadenCount');
      if (count > 0) {
        if ($('#newls').length) {
          if ($('#dontReadCounter').length) {
            $('#dontReadCounter').text('(' + count + ')');
          }
          else {
            let counter = $('<span id="dontReadCounter">(' + count + ')</span>');
            $('#newls').after(counter);
          }
        }
        else if ($('div.kn6').length) {
          if ($('#dontReadCounter').length) {
            $('#dontReadCounter').text('(' + count + ')');
          }
          else {
            let counter = $('<span id="dontReadCounter">(' + count + ')</span>');
            $('div.kn6').after(counter);
          }
        }
      }
      else {
        $('#dontReadCounter').remove();
      }
      $(document).ready(function() {
        $('#dontReadCounter').click(function(e) {
          e.preventDefault();
        });
        $('#dontReadCounter').click();
      });
    }

    setInterval(updateDontReadCounter, 1000);

    let cssDontReadLS = `
        <style>
        .dontReadButton:hover {
        border: 1px solid var(--brdrClr2);
        }
        .dontReadButton {
        background-color: var(--bckgClr3);
        color: var(--txtClr3);
        border: 1px solid var(--brdrClr3);
        font-family: Verdana;
        font-size: .9em;
        }
        #dontReadCounter {
        background-color: var(--bckgClr5);
        font-weight: 700;
        color: var(--brdrClr3);
        text-decoration: none !important;
        pointer-events: none !important;
        }
        </style>`
    $('head').append(cssDontReadLS);
  }

  // Wifenlooof

  function updateClock() {
    setInterval(() => {
      const now = new Date();

      let time;
      if (globals['isClockMoscow']) {
        time = now.toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour12: false
        });
      }
      else {
        time = now.toLocaleTimeString('ru-RU', {
          hour12: false
        });
      }

      $('#clock').text(time);

      if (globals['isDateShow']) {
        updateDate(now);
      }
      else {
        $('#date').text('');
      }
    }, 1000);
  }

  function updateDate(now) {
    const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const monthsOfYear = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    const date = daysOfWeek[now.getDay()] + ', ' + now.getDate() + ' ' + monthsOfYear[now.getMonth()];

    $('#date').text(date);
  }

  $(document).ready(function() {
    $('#inGameClock').prop('checked', globals['inGameClock']);
    $('#deviceTime').prop('checked', !globals['isClockMoscow']);
    $('#moscowTime').prop('checked', globals['isClockMoscow']);
    $('#showDate').prop('checked', globals['isDateShow']);

    $('#inGameClock').on('change', function() {
      setSettings('inGameClock', this.checked);
      updateClock();
    });

    $('input[name="timeSource"]').on('change', function() {
      setSettings('isClockMoscow', this.id === 'moscowTime');
    });

    $('#showDate').on('change', function() {
      setSettings('isDateShow', this.checked);
    });

    $('.cs-chapter').on('click', function() {
      updateClock();
    });

    updateClock();
  });

  // Eselifterbraun

  if (globals['boneCorrectTimer']) {
    let timerId;

    function updateTimerMessage() {
      let timerStart = localStorage.getItem('timerStart');
      let timerDuration = localStorage.getItem('timerDuration');
      if (timerStart && timerDuration) {
        let timeLeft = timerDuration - (Date.now() - timerStart);
        if (timeLeft > 0) {
          let secondsLeft = Math.floor(timeLeft / 1000);
          let minutesLeft = Math.floor(secondsLeft / 60);
          let hoursLeft = Math.floor(minutesLeft / 60);
          let daysLeft = Math.floor(hoursLeft / 24);
          secondsLeft %= 60;
          minutesLeft %= 60;
          hoursLeft %= 24;
          $('#message').text(`До окончания таймера осталось: ${daysLeft} дней, ${hoursLeft} часов, ${minutesLeft} минут, ${secondsLeft} секунд`);
        }
        else {
          $('#message').text('Таймер истёк, Вы можете снять костоправ!');
          localStorage.removeItem('timerStart');
          localStorage.removeItem('timerDuration');
        }
      }
      else {
        $('#message').text('');
      }
    }
    $('#start').click(function() {
      if (timerId) {
        clearTimeout(timerId);
      }
      let days = parseInt($('#days').val()) || 0;
      let hours = parseInt($('#hours').val()) || 0;
      let minutes = parseInt($('#minutes').val()) || 0;
      let time = ((days * 24 + hours) * 60 + minutes) * 60 * 1000;
      timerId = setTimeout(function() {
        alert('Таймер истёк, Вы можете снять костоправ!');
        localStorage.removeItem('timerStart');
        localStorage.removeItem('timerDuration');
        $('#message').text('Таймер истёк, Вы можете снять костоправ!');
      }, time);
      localStorage.setItem('timerStart', Date.now());
      localStorage.setItem('timerDuration', time);
      updateTimerMessage();
    });
    $('#reset').click(function() {
      clearTimeout(timerId);
      timerId = null;
      $('#days').val('');
      $('#hours').val('');
      $('#minutes').val('');
      localStorage.removeItem('timerStart');
      localStorage.removeItem('timerDuration');
      $('#message').text('');
    });
    setInterval(updateTimerMessage, 1000);
    let timerStart = localStorage.getItem('timerStart');
    let timerDuration = localStorage.getItem('timerDuration');
    if (timerStart && timerDuration) {
      let timeLeft = timerDuration - (Date.now() - timerStart);
      if (timeLeft > 0) {
        timerId = setTimeout(function() {
          alert('Таймер истёк, Вы можете снять костоправ!');
          localStorage.removeItem('timerStart');
          localStorage.removeItem('timerDuration');
          $('#message').text('Таймер истёк, Вы можете снять костоправ!');
        }, timeLeft);
      }
      else {
        alert('Таймер истёк, Вы можете снять костоправ!');
        localStorage.removeItem('timerStart');
        localStorage.removeItem('timerDuration');
      }
    }
    updateTimerMessage();
  }

  // Anweculbetugtbaby

  if (globals['hideWoundWarning']) {
    setTimeout(function() {
      $('#warningAboutWound').remove
    }, 1000);
  };

  // Aslonskysrblu

  if (globals['nightLagsWarning']) {
    nightLagsWarning();
  }

  // Yuaksoinocenow

  $('#clearDontReadButton').on('click', function() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith('message')) {
        localStorage.removeItem(key);
      }
    }
    updateDontReadCounter();
    $('#messList tr').removeClass('dontReaden');
  });
}

// ...
// ...
// ...

function site() {
  if (globals['hideWoundWarning']) {
    $('#warningAboutWound').remove();
  };
}