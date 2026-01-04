// ==UserScript==
// @name         CatWar Script
// @version      1.0.1
// @description  Новый мод-скрипт для браузерной игры CatWar. Админы скрипта летом вышли и потрогали траву.
// @author       Krivodushie & Psiii
// @copyright    2024 Запал (https://catwar.su/cat1562064) & Весело (https://catwar.su/cat590698)
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://catwar.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1354145
// @downloadURL https://update.greasyfork.org/scripts/508899/CatWar%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/508899/CatWar%20Script.meta.js
// ==/UserScript==

'use strict';

const version = 'v1.0'
const csDefaults = {
     'textTemplates': true //               ШАБЛОНЫ В ЛС
      ,'toggleTT': false //                  Сворачивать ли шаблоны ЛС по умолчанию
      ,'ttReplaceTheme': true //             Заменять ли тему сообщения названием шаблона?
     ,'ttBlog': true //                     ШАБЛОНЫ В БЛОГАХ И ЛЕНТЕ
      ,'toggleTTBlog': true //               Сворачивать ли шаблоны БЛОГОЛЕНТЫ по умолчанию
      ,'ttReplaceThemeB': true //            Вставлять ли название шаблона как название поста?
     ,'ttChat': true //                     ШАБЛОНЫ В ЧАТЕ
      ,'toggleTTChat': true //               Сворачивать ли шаблоны ЧАТА по умолчанию

     ,'inGameClock': false //               ЧАСЫ В ИГРОВОЙ
      ,'isClockMoscow': true //              Московсике ли часы?
      ,'isDateShow': true //                 Показывать ли дату?
      ,'movableClocks': false //             Перетаскиваемые часы
      ,'clockFontWeight': '17' //            Размер шрифта часов

    ,'customDefects': true //              ОТОБРАЖЕНИЕ ДЕФЕКТОВ В ИГРОВОЙ
     ,'cdSColors': true //                   Выделять ли клетку цветом?
     ,'cdSRamki': true //                    Выделять ли клетку рамкой? (Да/Нет)
     ,'cdOpacity': "0.3" //                  Прозрачность выделения клетки
     ,'cdSIcon': true //                     Показывать ли иконки дефектов в игровой?
     ,'cdCRani': "#4646ff" //                РАНЫ (ЦВЕТ)
      ,'cdSRani1': true //                    1 стадия
      ,'cdSRani2': true //                    2 стадия
      ,'cdSRani3': true //                    3 стадия
      ,'cdSRani3B': true //                   3 стадия (!)
      ,'cdSRani4': true //                    4 стадия
      ,'cdSRani4B': true //                   4 стадия (!!!)
     ,'cdCPoison': "#ff4646" //              ОТРАВЛЕНИЕ (ЦВЕТ)
      ,'cdSPoison1': true //                  1 стадия
      ,'cdSPoison2': true //                  2 стадия
      ,'cdSPoison3': true //                  3 стадия
      ,'cdSPoison3B': true //                 3 стадия (!)
      ,'cdSPoison4': true //                  4 стадия
      ,'cdSPoison4B': true //                 4 стадия (!!!)
     ,'cdCTrauma': "#46ffef" //             УШИБЫ (ЦВЕТ)
      ,'cdSTrauma1': true //                  1 стадия
      ,'cdSTrauma2': true //                  2 стадия
      ,'cdSTrauma3': true //                  3 стадия
      ,'cdSTrauma3B': true //                 3 стадия (!)
      ,'cdSTrauma4': true //                  4 стадия
      ,'cdSTrauma4B': true //                 4 стадия (!!!)
     ,'cdCDrown': "#68ff46" //               ПЕРЕЛОМЫ (ЦВЕТ)
      ,'cdSDrown1': true //                   1 стадия
      ,'cdSDrown2': true //                   2 стадия
      ,'cdSDrown3': true //                   3 стадия
      ,'cdSDrown3B': true //                  3 стадия (!)
      ,'cdSDrown4': true //                   4 стадия
      ,'cdSDrown4B': true //                  4 стадия (!!!)
     ,'cdCGryaz': "#9446ff" //               ГРЯЗЬ (ЦВЕТ)
      ,'cdSGryaz1': true //                   1 стадия
      ,'cdSGryaz2': true //                   2 стадия
      ,'cdSGryaz3': true //                   3 стадия
      ,'cdSGryaz3B': true //                  3 стадия (!)
      ,'cdSGryaz4': true //                   4 стадия
      ,'cdSGryaz4B': true //                  4 стадия (!!!)
     ,'cdSCough': true //                    КАШЕЛЬ
      ,'cdCCough': "#eeff46" //               Цвет кашля
     ,'cdSPodstilki': true //                ПОДСТИЛКИ
      ,'cdCPodstilki': "#79553d" //           Цвет подстилок
     ,'cdSDivers': false //                  НЫРЯЮЩИЕ (Показываются картиночкой)

    ,'customItems': true //                 ОТОБРАЖЕНИЕ ПОЛЕЗНЫХ РЕСУРСОВ В ИГРОВОЙ
     ,'ciSHerb': true //                     Травы
      ,'ciCHerb': '#2bff75' //                Цвет трав
     ,'ciSMoss': false //                    Мох
      ,'ciCMoss': '#2bff75' //                Цвет мха
     ,'ciSWeb': false //                     Паутина
      ,'ciCWeb': '#2bff75' //                 Цвет паутины
     ,'ciSStick': false //                   Ветки
      ,'ciCStick': '#2bff75' //               Цвет веток
     ,'ciSDust': false //                    Пыль
      ,'ciCDust': '#c096e2' //                Цвет пыли
     ,'ciSMusor': false //                   Мусор
      ,'ciCMusor': '#ff2b2b' //               Цвет мусора
     ,'ciOpacity': '0.25' //                 Прозрачность выделения клеток с предметами

 //                                        ЛИЧНЫЕ СООБЩЕНИЯ
    ,'dontReadenLS': false //               Непрочитанные ЛС для себя
    ,'timerForLS': false //                 Таймер до удаления ЛС

 //                                        ИГРОВАЯ - БОЕРЕЖИМ
    ,'phoneFightPanel': false //            Переместить кнопочки боережима для телефонщиков
    ,'friendlyCatWar': false //             Удалить кнопки захода в опасные БР
    ,'deleteFPTitles': false //             Убрать тайтлы у кнопок боережима
    ,'showButterflyBots': false //          Показывать бота-бабочку для прокачки бу
    ,'fightWarning': false //               Уведомление о введении в опасный БР
    ,'fightWarningVol': 1
    ,'fightWarningHref': 'https://github.com/CatWarScript/CatWarScript/raw/main/audios/attackAlarm.mp3'
    ,'shortFightLog': false //              Сокращать лог БР

 //                                         СПИСОК ДРУЗЕЙ И ВРАГОВ
    ,'showEnemy': true //                    Показывать котиков из списка врагов в Игровой?
     ,'enemyList': [] //                     Список врагов (обновляется при обновлении страницы списка врагов)
     ,'enemyColor': '#FFA500' //             Цвет выделения врагов в игровой

 //                                        РАЗНОЕ
    ,'brightGameField': false //            Выключить затемнение поля игровой
    ,'nightLagsWarning': true //            Предупреждение о лагах в 3-4 ночи
    ,'darkCatTooltip': false //             Тёмное окошко информации о котах
    ,'boneCorrectTimer': false //           Таймер ношения костоправов
    ,'toggleBoneTimer': false //            Свернуть таймер ношения костоправов
    ,'hideWoundWarning': true //            Скрыть предупреждение о ранах
    ,'hideFieldButton': false //            Кнопочка "Скрыть поле" для ПК-версии сайта
    ,'newInfoBlock': true //
     ,'ahbHistory': false //                  История
     ,'ahbRelatives': false //                Родственные связи
     ,'ahbParameter': false //                Параметры и навыки
    ,'actionEndTimer': true //             Таймер до окончания действия как на телефоне
    ,'diverSiren': false //                Громкие звуки при большом сне на нырялках
     ,'diverSirenMinutes' : 35 //           На какой минуте начинает срабатывать сирена?
     ,'diverSirenVol': 0.7 //               Громкость звука (Дефолтный звук сирена минус 10 социальный кредит)
     ,'diverSirenHref' : "https://github.com/CatWarScript/CatWarScript/raw/main/audios/soundDiver.mp3"
     ,'dsY': 50
     ,'dsX': 50
    ,'kalinnikFunction': false //          Не включайте это
     ,'kalinnikFunctionVolume': 0.7 //      (Пожалуйста)
    ,'smellTimer': false //                Таймер до следующего нюха
     ,'smellTimerVol': 0.7 //               Громкость таймера нюха
     ,'smellTimerHref': 'https://github.com/CatWarScript/CatWarScript/raw/main/audios/actionEnd.mp3' //             Ссылка на звук таймера нюха
    ,'newLS': false //                     Уведомлять о новых ЛС
     ,'newLSVol': 0.7 //                    Громкость уведомления о новом ЛС
    ,'newChat': false //                   Уведомлять о новых сообщениях в Чате
     ,'newChatVol': 0.7 //                  Громкость уведомления о новом чате
    ,'eatenNote': false //                 Уведомление о поднятии в игровой
    ,'eatenNoteVol': 0.7 //                 Громкость уведомления о поднятии
    ,'messageSound': 'https://catwar.su/new_message.mp3'


    ,'treeMap': true //                    ОКОШКО ЛАЗАЛОК
     ,'tmResetNote': true //                Уведомление при изменении карты
     ,'tmResetVolume': 0.5 //               Громкость уведомления об изменении карты
     ,'tmResetSource': 'https://github.com/CatWarScript/CatWarScript/raw/main/audios/refresh.mp3'
     ,'tmShowVolume': true //               Показывать громкость звуков в чате?
     ,'tmClearConfirm': true //             Запрашивать подтверждение при очистке карты?
     ,'tmFolded': true //                   Окошко изначально свёрнуто?
     ,'tmBTNSShowMap': false //             Показывать карту на игровой
     ,'tmSelectedMap': 5 //                 Выбранная карта
     ,'tmVariant': 1 //                     Вариант визуала окошка ЛУ
     ,'tmTecPosY': 50 //                    Пиксели окошка сверху
     ,'tmTecPosX': 50 //                    Пиксели окошка слева
     ,'tmTecFolNames': ['А', 'Б', 'В', 'Г']
     ,'tmTecFolStatus':[true, true, true, true]
     ,'tmTecLocNames': ['1А', '2А', '3А', '4А', '5А', '6А', '1Б', '2Б', '3Б', '4Б', '5Б', '6Б', '1В', '2В', '3В', '4В', '5В', '6В', '1Г', '2Г', '3Г', '4Г', '5Г', '6Г']
     ,'tmTecLocStatus':[true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]

 //                                        СТИЛИ
    ,'selTheme': 0
    ,'setka': false //                      Сетка (включить её крч)
    ,'cageGrid': true //                    Сетка ячеек локации
    ,'cageGridVar': false
     ,'cgColor': "#ffffff" //                Цвет сетки ячеек
     ,'cgOpacity': "0.25" //                 Прозрачность сетки
    ,'desighnColors': false //    (beta)    Основные моменты в стилях в зависимости от дизайна
     ,'dsghnClr': '#random' //    (beta)     Цвет 1
     ,'dsghnClr2': '#random' //   (beta)     Цвет 2
     ,'dsghnImg': '' //           (beta)     Фоновое изображение
    ,'customGame': true //        (beta)   ПОЛЬЗОВАТЕЛЬСКАЯ КАСТОМНАЯ ИГРОВАЯ (Настройки)
     ,'compactTool': true //      (beta)    Инструмент отладки на страничке настройки кастомной игровой
     ,'ctTecPosX': 50 //          (beta)    Положение инструмента отладки (Слева)
     ,'ctTecPosY': 50 //          (beta)    Положение инструмента отладки (Сверху)
     ,'playerCustom': false //    (beta)    Включить кастомную компактную игровую
     ,'cgpcImport': '' //         (beta)    Окошко импорта кастомной компактной игровой
     ,'cgpcExport': '' //         (beta)    Окошко экспорта кастомной компактной игровой
    ,'compactDefault1': false //  (beta)    Компактная игровая (Вариант 1)
    ,'compactDefault2': false //  (beta)    Компактная игровая (Вариант 2)
    ,'compactDefault3': false //  (beta)    Компактная игровая (Вариант 3)

    ,'cgBorderWid': 3 ,'cgBorderType': 'solid' ,'cgBorderCol': '#000000' ,'cgBorderRad': 6 ,'cgIsBorderRad': true
    ,'cgBodyCol': '#ff0000' ,'cgFieldWid': '' ,'cgFieldHei': '' ,'cgFieldX': 500 ,'cgFieldY': 500 ,'cgIsFieldFix': false
    ,'cgParWid': 500 ,'cgParHei': 500 ,'cgParX': 500 ,'cgParY': 500 ,'cgParCol': '#ffdead', 'cgParFCol': '#000000'
    ,'cgTOSWid': 500 ,'cgTOSHei': 500 ,'cgTOSX': 500 ,'cgTOSY': 500, 'cgTOSCol': '#000000'
    ,'cgSkyWid': 500 ,'cgSkyHei': 500 ,'cgSkyX': 500 ,'cgSkyY': 500
    ,'cgSmallWid': 500 ,'cgSmallHei': 500 ,'cgSmallX': 500 ,'cgSmallY': 500, 'cgSmallCol': '#ffdead', 'cgSmallFCol': '#000000'
    ,'cgOCLWid': 500 ,'cgOCLHei': 500 ,'cgOCLX': 500 ,'cgOCLY': 500, 'cgOCLFCol': '#000000'
    ,'cgChatWid': 500 ,'cgChatHei': 500 ,'cgChatX': 500 ,'cgChatY': 500 ,'cgChatCol': '#f57a00', 'cgChatFCol': '#000000'
    ,'cgClockWid': 500 ,'cgClockHei': 500 ,'cgClockX': 500 ,'cgClockY': 500 ,'cgClockCol': '#ffdead', 'cgClockFCol': '#000000'
    ,'cgTBWid': 500 ,'cgTBHei': 500 ,'cgTBX': 500 ,'cgTBY': 500 ,'cgTBCol': '#ffdead', 'cgTBFCol': '#000000'
    ,'cgHisWid': 500 ,'cgHisHei': 500 ,'cgHisX': 500 ,'cgHisY': 500 ,'cgHisCol': '#ffdead', 'cgHisFCol': '#000000'
    ,'cgDeysWid': 500 ,'cgDeysHei': 500 ,'cgDeysX': 500 ,'cgDeysY': 500 ,'cgDeysCol': '#ffdead', 'cgDeysFCol': '#000000'
    ,'cgRotWid': 500 ,'cgRotHei': 500 ,'cgRotX': 500 ,'cgRotY': 500 ,'cgRotCol': '#ffdead', 'cgRotFCol': '#000000'
    ,'cgLocWid': 500 ,'cgLocHei': 500 ,'cgLocX': 500 ,'cgLocY': 500 ,'cgLocCol': '#ffffff', 'cgLocFCol': '#000000'
    ,'cgRSWid': 500 ,'cgRSHei': 500 ,'cgRSX': 500 ,'cgRSY': 500 ,'cgRSCol': '#ffdead', 'cgRSFCol': '#000000'
    ,'cgParAlertWid': 'h' ,'cgParAlertHei': 'u' ,'cgParAlertCol': 'i' ,'cgParAlertX': 500 ,'cgParAlertY': 500 ,'cgParAlertFCol': '#000000'
    ,'cgInfoH2DelMargins': true
    ,'cgInfoH2FontSize': 22
    ,'cgDelRSH2': false
    ,'cgDelHisH2': false
    ,'cgDelParH2': false
    ,'cgSeparateLocation': true
    ,'cgLocFW': 17 // фонт вейт локации
    ,'cgFontSize': 14 // Фонт вейт всего нахуй
    ,'cgBorders': true
    ,'cgTbBorder': true
    ,'cgSmallFW': 14 // Смалл фонт вейт
    ,'cgYouBG': '' // Фон упомянания
    ,'cgYouFC': '' // Цвет упомянания
    ,'cgInputCol': '#ffffff'
    ,'cgInputFCol': '#000000'
    ,'cgInputBorders': true
    ,'cgIsTBBorderRad': true
    ,'cgIsLocBorderRad': true
    ,'cgDeleteScrolls': true
    ,'cgChatSliderCol': '#fece2f'
    ,'cgChatSliderBorderCol': '#d19405'
    ,'cgChatSliderLineCol': '#ebebeb'
    ,'cgChatSliderLineBorder': '#a5a5a5'

 //                                         БИБЛИОТЕКА КОСТЮМОВ
    ,'costumeLibrary': true //               Включить библиотеку костюмов
     ,'clLakeUniverse': true //              Озёрная Вселенная
     ,'clSeaUniverse': false //              Морская Вселенная
     ,'clCreatorUniverse': false //          Вселенная Творцов
     ,'watermarkCostumes': false //          Наш значок у костюмов из библиотеки
     ,'clMemeCostumes': true //              Показывать ли мемные костюмы
     ,'clRemoveAllTongues': false //        Спрятать все языки.. (К.. Куда?.. 😲)
     ,'clRemoveAllCostumes': false //       Убрать все костюмы
};

const globals = {};
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

function getSettings(key) {
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

function setSettings(key, val) {
  let setting = 'cs_n_' + key;
  window.localStorage.setItem(setting, String(val));
  globals[key] = val; // Записываем новое значение в globals
}

function removeSettings(key) {
  let setting = 'cs_n_' + key;
  window.localStorage.removeItem(setting);
}

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


function hexToRGBA(hexCode, opacity) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hexCode)) {
    console.error("Неверный HEX-код:", hexCode);
    return;
  }
  let r = parseInt(hexCode.substring(1, 3), 16);
  let g = parseInt(hexCode.substring(3, 5), 16);
  let b = parseInt(hexCode.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


function appendToElementOrPrependFallback(primaryElement, secondaryElement, elementToAdd) {
  if ($(primaryElement).length) {
    $(primaryElement).append(elementToAdd);
  }
  else {
    $(secondaryElement).before(elementToAdd);
  }
}
 // Я был сонненький и функции назвал ущербно конечно
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
const isFae = (/^https:\/\/\w?\.?catwar.su\/fae/.test(pageurl));
const isBlogs = (/^https:\/\/\w?\.?catwar.su\/(blogs|sniff)/.test(pageurl));
const isChat = (/^https:\/\/\w?\.?catwar.su\/chat/.test(pageurl));
const isCustom = (/^https:\/\/\w?\.?catwar.su\/scriptcustomcw3/.test(pageurl));

try {
  if (isCW3) cw3();
  if (isDM) dm();
  if (isSite) site();
  if (isSett) sett();
  if (isMyCat) myCat();
  if (isAll) all();
  if (isFae) fae();
  if (isBlogs) blogs();
  if (isChat) chat();
  if (isCustom) custom();
}
catch (error) {
  console.error("An error occurred: ", error);
}

// ...
// ...
// ...

function sett() {
  let cssForSett = `
   <style>

    td#tableContent::-webkit-scrollbar {
    width: 10px; }

    td#tableContent::-webkit-scrollbar-track {
    background: var(--cwsc-scrl-1) !important;
    border-radius: 3px; }

    td#tableContent::-webkit-scrollbar-thumb {
    background: var(--cwsc-scrl-2) !important;
    border-radius: 3px; }

    table#tableCWScSet {
    font-family: Montserrat;
    outline: 5px solid var(--cwsc-brdr-1);
    margin: 10px;
    border-radius: 15px !important;
    color: var(--cwsc-txt-1);
    width: 98%; }

    td#tableHeader {
    vertical-align: top !important;
    background-color: var(--cwsc-bckg-1);
    color: var(--cwsc-txt-2);
    border-radius: 10px 0px 0px 10px !important;
    border: 4px solid var(--cwsc-brdr-2);
    border-top: none;
    border-bottom: none;
    border-left: none;
    width: 30%; }

    td#tableHeader>table {
    width: 100%; }

    tr#cwsSetHeader {
    border: 4px solid var(--cwsc-brdr-2);
    border-top: none;
    border-left: none;
    border-right: none; }

    div#cwsSet>b {
    display: flex !important;
    justify-content: center;
    text-transform: uppercase;
    color: var(--cwsc-txt-2);
    font-size: 28px;
    letter-spacing: 20px;
    padding: 15px 0px;
    margin-left: 20px; }

    div#headerButtons {
    position: relative;
    width: 100%;
    padding: 15px 0px;
    padding-top: 15px; }

    div#headerButtons>a:not([id="info"])::before{
    content: "✦ "; }

    div#headerButtons>a {
    display: inline-block;
    margin: 10px 20px; }

    div#headerButtons>a.active {
    transition: 0.5s;
    text-decoration: none;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--cwsc-txt-3) !important; }

    div#headerButtons>a.active:hover {
    transition: 0.5s;
    text-decoration: none;
    filter: brightness(140%); }

    div#headerButtons>a.passive {
    transition: 0.5s;
    text-decoration: none;
    letter-spacing: 2px;
    color: var(--cwsc-txt-2) !important; }

    div#headerButtons>a.passive:hover {
    transition: 0.5s;
    text-decoration: none;
    filter: brightness(140%); }

    a#info {
    display: flex !important;
    justify-content: center;
    position: relative;
    top: 395px;
    letter-spacing: 10px !important;
    margin-right: 10px !important; }

/* div#headerButtons>a#info::before {
content: "✦ "; }

div#headerButtons>a#info::after {
content: " ✦"; } */

    div.contacts {
    display: flex;
    justify-content: center;
    position: relative;
    top: 395px; }

    div.contacts>div {
    background-color: var(--cwsc-bckg-5);
    border-radius: 10px;
    margin: 15px;
    padding: 2px 3px 0px 3px; }

    div.contacts>div:hover {
    background-color: var(--cwsc-bckg-4); }

    a#vk {
    filter: var(--cwsc-fltr-vk); }

    a#vk:hover {
    filter: none; }

    a#tg {
    filter: var(--cwsc-fltr-tg); }

    a#tg:hover {
    filter: none; }

    a#bs {
    filter: var(--cwsc-fltr-bs); }

    a#bs:hover {
    filter: none; }

    td#tableContent {
    display: block;
    overflow: auto;
    background-color: var(--cwsc-bckg-2);
    border-radius: 0px 10px 10px 0px !important;
    min-height: 700px !important;
    max-height: 700px !important;
    padding-left: 10px;
    padding-bottom: 10px; }

/*     div#search  {
    display: block !important;
    width: 95% !important;
    background-color: var(--cwsc-bckg-4);
    border-radius: 10px;
    font-size: 25px;
    margin: 10px;
    padding: 10px; } */

/* div#cwsSetList input.cs-set[type="checkbox"] {
margin: 0px 3px 0px 4px; } */

div#trSetHead, div#cwmodTrSetHead {
width: 100%;
display: flex;
flex-wrap: wrap; }

div#trOne, div#cwmodTrOne {
width: 100%;
display: flex; }

div#trTwo {
width: 100%;
display: flex;
flex-wrap: wrap; }

div#cwmodTrTwo {
width: 100%;
display: flex; }

div#trThree, div#cwmodTrThree {
width: 100%;
display: flex; }

div#trFour, div#cwmodTrFour {
width: 100%;
display: flex; }

div#trFive, div#cwmodTrFive {
width: 100%;
display: flex; }

div#trSix, div#cwmodTrSix {
width: 100%;
display: flex; }

div#cwsSetListHeader, div#cwmodSetListHeader {
width: 100%;
background-color: var(--cwsc-bckg-4);
display: grid;
align-content: space-between;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div#cwsSetListHeader h2, div#cwmodSetListHeader h2 {
margin: 0px; }

#cwmod-settings h2 {
text-indent: 0px !important; }

div#sbClock, div#sbFight, div#sbCostumes, div#sbTrees {
width: 50%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: stretch;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div#sbBoneCorrect, div#sbLS, div#cmSite, div#cmGame, div#cmImEx {
width: 100%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: space-between;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div#sbTemplates, div#sbOthers {
width: 50%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: stretch;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div#cmObj, div#cmLocation, div#cmChat, div#cmKns, div#cmStyle, div#cmPlayers {
width: 50%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: stretch;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div#sbGame {
width: 100%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: space-between;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

input#ahbRelatives {
margin-bottom: 20px; }

div#sbStyles {
width: 100%;
background-color: var(--cwsc-bckg-3);
display: grid;
align-content: space-between;
margin: 15px 15px 0px 0px;
padding: 8px;
border-radius: 5px; }

div.setHead>p {
margin: 0px;
font-weight: 600;
font-size: 16px;
margin-bottom: 5px; }

div.setHead {
border-bottom: 4px solid var(--cwsc-brdr-4);
width: 100% !important;
height: 24px !important;
margin-bottom: 4px; }

div#cmImEx details {
margin: 15px 0px; }

div#cmImEx>table {
margin: 10px 0px; }

div#cmImEx>table p {
margin: 0px; }

table#defectTable, table#itemTable, table#templateTable, table#replaceTable {
border: 4px solid var(--cwsc-brdr-5); }

table#templateTable, table#replaceTable {
margin: 5px 0px; }

table#defectTable tr td, table#itemTable tr td, table#templateTable tr td, table#replaceTable tr td {
border: 2px dotted var(--cwsc-brdr-1);
width: 100px;
height: 20px;
text-align: center; }

table#defectTable tr td input, table#itemTable tr td input, table#templateTable tr td input, table#replaceTable tr td input {
margin: 4px 7px; }

table#defectTable tr td input[type=color], table#itemTable tr td input[type=color]  {
width: 50px !important;
height: 25px; }

table#defectTable>tbody>tr:first-of-type, table#defectTable>tbody>tr:nth-of-type(2), table#defectTable>tbody>tr:nth-of-type(8), table#defectTable>tbody>tr:nth-of-type(11)>td:nth-of-type(2),
table#itemTable>tbody>tr:first-of-type, table#itemTable>tbody>tr:nth-of-type(2), table#itemTable>tbody>tr:nth-of-type(5), table#itemTable>tbody>tr:nth-of-type(8), table#itemTable>tbody>tr:nth-of-type(11),
table#templateTable>tbody>tr:first-of-type, table#templateTable>tbody>tr:nth-of-type(4), table#replaceTable>tbody>tr:first-of-type {
background-color: var(--cwsc-bckg-4) !important;
font-weight: 600;
font-size: 13px; }

table#defectTable>tbody>tr:first-of-type, table#itemTable>tbody>tr:first-of-type {
font-size: 15px; }

table#defectTable>tbody>tr:not(:first-of-type), table#itemTable>tbody>tr:not(:first-of-type), table#templateTable>tbody>tr:not(:first-of-type), table#replaceTable>tbody>tr:not(:first-of-type) {
background-color: var(--cwsc-bckg-7); }


div#libLastUpd>small>i>p {
margin: 0; }

div#libCustom {
margin: 10px 0px 5px; }

div#cwmodMenuList, div#cwmodCustSet {
margin: 10px 0px 10px; }

div#cwsSetList .ui-slider-horizontal {
background: var(--cwsc-bckg-2) !important;
border: 1px solid var(--cwsc-brdr-4) !important;
border-radius: 5px;
width: 100% !important; }

table.sliderTable {
margin: 3px 0px 20px;
width: 100%; }

td.csSlider {
width: 35% !important; }

td.csLabel label {
margin: 0px 10px !important; }

div#cwsSetList .ui-slider-horizontal .ui-slider-handle {
background: var(--cwsc-bckg-4) !important;
border: 1px solid var(--cwsc-brdr-4) !important;
border-radius: 15px; }

table#lastUpdtTable {
display: grid;
justify-content: end;
margin: 0px; }

table#lastUpdtTable p {
margin: 0px; }

table#tmVarTable {
display: grid;
justify-content: center;
margin: 10px 0px; }

table#tmVarTable label {
display: grid;
justify-content: start;
margin: 0px 15px 0px 0px; }

button#formButton:hover, button#customButton:hover, button#clearDontReadButton:hover, select#tmVariant:hover, select#selTheme:hover, input.cs-set[type="color"]:hover, input.cs-set[type="number"]:hover, input#inputImport:hover, button#inputExport:hover, input#outputExport:hover, select#cwmodTheme:hover, select#cw3Bkg:hover, input#cw3BkgImg:hover, select#cw3BkgSize:hover, select#cw3BkgPos:hover, input.cwmod-settings[type="text"]:hover, input.cwmod-settings[type="number"]:hover, input.cwmod-data-export:hover, input.cwmod-data-import:hover, input.cwmod-data-merge:hover, input#clear-ym-storage:hover, button#resetDefectSettings:hover, button#resetItemSettings:hover {
border: 2px solid var(--cwsc-brdr-2) !important; }

button#formButton {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: fit-content;
padding: 2px 5px;
margin: 10px 0px;
text-decoration: none;
font-size: 13px; }

button#customButton {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: fit-content;
padding: 2px 5px;
margin: 10px 10px 10px 0px;
text-decoration: none;
font-size: 13px; }

button#clearDontReadButton {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: fit-content;
padding: 2px 5px;
margin: 0px 0px;
text-decoration: none;
font-size: 13px; }

select#tmVariant, select#selTheme {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
padding: 1px 5px; }

select#cwmodTheme, div#cwmod-settings input.cwmod-settings[type="text"]:not(input#cw3BkgImg), input.cwmod-data-export, input.cwmod-data-import {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
margin: 5px 0px;
padding: 1px 5px; }

select#cw3Bkg, input#cw3BkgImg, select#cw3BkgSize, select#cw3BkgPos {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
margin: 3px 0px;
padding: 1px 5px;
width: 80% !important; }

div#cwsSetList input.cs-set[type="color"], div#cwsSetList input.cs-set[type="number"], div#cwmod-settings input.cwmod-settings[type="number"] {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 1px solid var(--cwsc-brdr-4);
border-radius: 3px;
text-align: center;
margin: 2px;
height: 22px !important;
width: 55px !important; }

input#inputImport, input#outputExport {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 1px solid var(--cwsc-brdr-4);
border-radius: 3px;
margin: 2px;
height: 22px !important;
width: 50% !important; }

input.cwmod-data-merge {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 1px solid var(--cwsc-brdr-4);
border-radius: 3px;
margin: 2px;
height: 22px !important;
width: 20% !important; }

input#clear-ym-storage {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 1px solid var(--cwsc-brdr-4);
border-radius: 3px;
margin: 2px;
height: 22px !important;
width: 90% !important; }

div#cwsSetList input#cgColor[type="color"] {
margin: 10px 0px; }

table#gridTable, table#defTable, table#customTable {
width: 50%; }

table#impExpTable {
width: 50%;
margin: 15px 0px; }

table#impExpTable td {
padding: 0px 5px 10px; }

button#inputExport {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: fit-content;
padding: 2px 5px;
margin: 0px 0px;
text-decoration: none;
font-size: 13px; }

button#resetDefectSettings, button#resetItemSettings {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: 35%;
padding: 2px 5px;
margin: 0px 0px 10px;
text-decoration: none;
font-size: 13px; }

   </style>`
  $('head').append(cssForSett);

  const html = `<br><br><table id="tableCWScSet"><tbody><tr><td id="tableHeader"><table><tbody><tr id="cwsSetHeader"><td>
    <div id="cwsSet"><b>Настройки</b></div></td></tr><tr id="cwsSetMods"><td>
    <div class="header" div id="headerButtons">
      <a href="#" class="active" data-target="1">CatWar Script</a><br>
      <a href="#" class="passive" data-target="2">Варомод</a><br>
      <a href="#" class="passive" data-target="3">CW:Shed</a><br>
      <!--<a href="#" id="info" class="passive" data-target="4">✦ О нас ✦</a>-->
    </div><br></td></tr></tbody></table>
     <div class="contacts">
       <div><a id="vk" href="https://vk.com/cwscript" target="_blank">
         <svg viewBox="0 0 48 48" width="48px" height="48px" version="1.1" id="svg1" sodipodi:docname="icons8-vk-circled.svg" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs1" /><sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" showgrid="false" inkscape:zoom="15.604167" inkscape:cx="24" inkscape:cy="24" inkscape:window-width="1680" inkscape:window-height="987" inkscape:window-x="1672" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="layer1" /><g inkscape:groupmode="layer" id="layer1" inkscape:label="Layer 1"><path id="circle1" style="display:inline;fill:#1976d2" d="M 24,4 A 20,20 0 0 0 4,24 20,20 0 0 0 24,44 20,20 0 0 0 44,24 20,20 0 0 0 24,4 Z M 12.890625,17 h 2.642578 c 0.660999,0 0.913969,0.29436 1.167969,1.068359 C 17.874171,22.000355 19.627579,25 20.517578,25 20.847578,25 21,24.840937 21,23.960938 V 20.337891 C 20.898,18.468892 20,18.307624 20,17.640625 20,17.319625 20.212141,17 20.619141,17 h 4.648437 C 25.826578,17 26,17.319673 26,18.013672 v 5.185547 C 26,23.786218 26.446047,24 26.623047,24 c 0.33,0 0.64,0.016 1.25,-0.625 1.880998,-2.214998 3.513672,-5.574219 3.513672,-5.574219 C 31.564719,17.399782 31.870251,17 32.53125,17 h 2.617188 c 0.585999,0 0.834609,0.263 0.849609,0.625 0.006,0.125 -0.01455,0.265016 -0.06055,0.416016 -0.33,1.600998 -3.715453,6.351562 -3.689453,6.351562 C 32.104047,24.638578 32.009,24.815 32,25 c -0.009,0.176 0.06105,0.360094 0.248047,0.621094 0.279,0.399999 0.886954,1.135907 1.501953,1.878906 1.109999,1.341999 1.99936,2.750172 2.193359,3.326172 C 35.984359,30.983172 36.003,31.124 36,31.25 35.986,31.745 35.637296,32 35.029297,32 h -2.619141 c -0.991999,0 -1.305158,-0.982002 -3.035156,-3 -1.499999,-1.749998 -2.277204,-2 -2.658203,-2 -0.534,0 -0.71775,0.132595 -0.71875,0.933594 V 30.90625 C 25.998047,31.573249 25.826436,32 24.148438,32 21.37844,32 18.249998,30.124997 15.875,26.875 12.600003,22.393004 12,18.494437 12,17.773438 12,17.373438 12.127626,17 12.890625,17 Z" /></g></svg>
       </a></div>
       <div><a id="tg" href="https://t.me/cwscript" target="_blank">
         <svg viewBox="0 0 48 48" width="48px" height="48px" version="1.1" id="svg3" sodipodi:docname="icons8-telegram-app.svg" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs3" /><sodipodi:namedview id="namedview3" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="15.604167" inkscape:cx="24" inkscape:cy="24" inkscape:window-width="1680" inkscape:window-height="987" inkscape:window-x="1672" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="layer2" /><g inkscape:groupmode="layer" id="layer2" inkscape:label="Layer 1"><path id="circle1" style="fill:#29b6f6" d="M 24 4 A 20 20 0 0 0 4 24 A 20 20 0 0 0 24 44 A 20 20 0 0 0 44 24 A 20 20 0 0 0 24 4 z M 33.375 14 C 33.667 14 34 14.125 34 14.5 C 34 14.75 33.949219 15 33.949219 15 L 30.203125 34.126953 C 30.203125 34.126953 30.042982 35 28.958984 35 C 28.382986 35 28.085937 34.726562 28.085938 34.726562 L 23 30.505859 L 19.574219 33.878906 C 19.574219 33.878906 19.425562 33.993047 19.226562 33.998047 C 19.157564 34.000047 19.083812 33.989078 19.007812 33.955078 L 19.007812 33.957031 C 19.007812 33.957031 18.749734 33.933107 18.427734 32.912109 C 18.106736 31.892111 16 26 16 26 L 16.007812 25.996094 L 16.001953 25.992188 L 10.90625 24.636719 C 10.90625 24.636719 10 24.374998 10 23.625 C 10 23.000002 10.933594 22.701172 10.933594 22.701172 L 32.248047 14.234375 C 32.247047 14.233375 32.9 13.999 33.375 14 z " /></g></svg>
       </a></div>
       <div><a id="bs" href="https://boosty.to/cwscript" target="_blank">
         <svg width="48" height="48" viewBox="0 0 48 47" version="1.1" id="svg4" sodipodi:docname="logoLetterB.4ec8e (1).svg" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview id="namedview4" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="8.9571167" inkscape:cx="19.481716" inkscape:cy="24.059081" inkscape:window-width="1680" inkscape:window-height="987" inkscape:window-x="1672" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="svg4" /><defs id="defs4"><linearGradient id="linear0" gradientUnits="userSpaceOnUse" x1="6.4215002" y1="-6.46875" x2="-34.537899" y2="88.152298" gradientTransform="scale(0.557143,0.546512)"><stop offset="0" style="stop-color:rgb(93.72549%,47.058824%,16.078431%);stop-opacity:1;" id="stop1" /><stop offset="0.28" style="stop-color:rgb(94.117647%,41.176471%,16.470588%);stop-opacity:1;" id="stop2" /><stop offset="0.63" style="stop-color:rgb(94.509804%,36.862745%,17.254902%);stop-opacity:1;" id="stop3" /><stop offset="1" style="stop-color:rgb(94.509804%,35.294118%,17.254902%);stop-opacity:1;" id="stop4" /></linearGradient></defs><g id="surface1" transform="translate(4.5004891,0.0390625)"><path style="fill:url(#linear0);fill-rule:evenodd;stroke:none" d="M 9.34375,0 1.242188,28.027344 0.949219,29.011719 c -2.789063,9.636719 0.398437,17.785156 11.769531,17.910156 1.457031,-3.65625 3.46875,-8.699219 6.042969,-15.132813 H 12.601562 L 19.203125,8.847656 C 19.21875,8.792969 19.242188,8.738281 19.269531,8.6875 L 21.78125,0 Z M 27.753906,25.339844 12.761719,46.921875 h 0.234375 c 11.074218,0 22.453125,-8.191406 25.261718,-17.914063 2.621094,-9.03125 -1.832031,-16.503906 -11.332031,-17.496093 l -5.53125,13.828125 z m 0,0" id="path4" /></g></svg>
       </a></div>
     </div></td><td id="tableContent"><!--<div id="search">CatWar Script</div>--><table><tbody><tr><td>
     <div class="content">
     <div class="active" id="div1">
<div id="cwsSetList">
<div id="trSetHead">
    <div id="cwsSetListHeader"><h2>Настройки CatWar Script ${version} </h2></div>
</div>




<div id="trOne">
    <div id="sbClock"><div class="setHead" id="clockHead"><p>Часы</p></div>
       <div><input class="cs-set" id="inGameClock" type="checkbox"${globals.inGameClock?' checked':''}><label for="inGameClock">Часы в игровой</label></div>
       <div><input class="cs-set" id="showDate" type="checkbox"${globals.isDateShow?' checked':''}><label for="showDate">Показывать дату</label></div>
       <div><input class="cs-set" id="movableClocks" type="checkbox"${globals.movableClocks?' checked':''}><label for="movableClocks">Перетаскиваемый блок часов<br><small><i>!!! Не работает на телефонах</i></small></label></div>
       <table><tr><td><div><input class="cs-set" id="deviceTime" type="radio" name="timeSource"${!globals.isClockMoscow?' checked':''}><label for="deviceTime">Время с устройства</label></div></td><td>
       <div><input class="cs-set" id="moscowTime" type="radio" name="timeSource"${globals.isClockMoscow?' checked':''}><label for="moscowTime">Московское время</label></div></td></tr></table>
       <div><input class="cs-set" id="clockFontWeight" type="number"${globals.clockFontWeight?' checked':''} style="width: 55px;"> <label for="clockFontWeight">Размер шрифта часов</label></div>
    </div>
    <div id="sbFight"><div class="setHead" id="fightHead"><p>Боевой режим</p></div>
       <div><input class="cs-set" id="phoneFightPanel" type="checkbox"${globals.phoneFightPanel?' checked':''}><label for="phoneFightPanel">Удобная панель боережима для телефонщиков</label></div>
       <div><input class="cs-set" id="friendlyCatWar" type="checkbox"${globals.friendlyCatWar?' checked':''}><label for="friendlyCatWar">Убрать кнопки входа в опасные режимы</label></div>
       <div><input class="cs-set" id="shortFightLog" type="checkbox"${globals.shortFightLog?' checked':''}><label for="shortFightLog">Сокращать лог боережима</label></div>

       <div><input class="cs-set" id="fightWarning" type="checkbox"${globals.fightWarning?' checked':''}><label for="fightWarning">Звуковое уведомление при нападении на вас</label></div>
       <table><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="fightWarningVol"></div></td><td class="csLabel"><label for="fightWarningVol"><small><i>Громкость функции</i></small></label></td></tr></table>

       <div><input class="cs-set" id="deleteFPTitles" type="checkbox"${globals.deleteFPTitles?' checked':''}><label for="deleteFPTitles">Убрать подписи к кнопкам<br><small><i>!!! Только для телефонов</i></small></label></div>
    </div>

</div><div id="trTwo">
    <div id="sbBoneCorrect"><div class="setHead" id="boneCorrectHead"><p>Костоправы</p></div>
       <div><input class="cs-set" id="boneCorrectTimer" type="checkbox"${globals.boneCorrectTimer?' checked':''}><label for="boneCorrectTimer">Таймер для снятия костоправов</label></div>
       <div><input class="cs-set" id="toggleBoneTimer" type="checkbox"${globals.toggleBoneTimer?' checked':''}><label for="toggleBoneTimer">Изначально сворачивать блок таймера костоправов</label></div>
    </div>
    <div id="sbLS"><div class="setHead" id="lsHead"><p>Личные сообщения</p></div>
       <div id="dntRnd"><div id="dontRdnLS"><input class="cs-set" id="dontReadenLS" type="checkbox"${globals.dontReadenLS?' checked':''}><label for="dontReadenLS">Непрочитанные сообщения только для себя</label></div><br>
       <button type="button" id="clearDontReadButton">Обнулить счётчик непрочитанных ЛС</button><br><br>
       <div><input class="cs-set" id="timerForLS" type="checkbox"${globals.timerForLS?' checked':''}><label for="timerForLS">Выделение сообщений, которые скоро удалятся<br><small><i>!!! Выделяет непрочитанные сообщения, которые были получены/отправлены от 6 до 14 дней назад</i></small></label></div>
    </div></div>

</div><div id="trThree">
    <div id="sbTrees"><div class="setHead" id="treesHead"><p>Лазательные локации</p></div>
       <div><input class="cs-set" id="treeMap" type="checkbox"${globals.treeMap?' checked':''}><label for="treeMap">Минное поле в игровой</label></div>
       <div><input class="cs-set" id="tmFolded" type="checkbox"${globals.tmFolded?' checked':''}><label for="tmFolded">Изначально сворачивать окошко</label></div>
       <div><input class="cs-set" id="tmShowVolume" type="checkbox"${globals.tmShowVolume?' checked':''}><label for="tmShowVolume">Громкость в чате от ботов</label></div>
       <div><input class="cs-set" id="tmResetNote" type="checkbox"${globals.tmResetNote?' checked':''}><label for="tmResetNote">Звуковое уведомление при смене карты</label></div>

       <table><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="tmResetVolume"></div></td><td class="csLabel"><label for="tmResetVolume"><small><i>Громкость функции</i></small></label></td></tr></table>

       <table><tr><td><input class="cs-set" id="tmTecPosX" type="number"${globals.tmTecPosX?' checked':''} style="width: 55px;" step="5"></td><td>
       <input class="cs-set" id="tmTecPosY" type="number"${globals.tmTecPosY?' checked':''} style="width: 55px;" step="5"></td><td>
       <label for="tmTecPosY"> Расположение окошка по X/Y px</label></td></tr></table>

       <table id="tmVarTable"><tr><td><label for="tmVariant">Внешний вид редактора</label></td><td>
       <select class="cs-set" id="tmVariant">
       <option value="0">Классический</option>
       <option value="1">Компактный</option>
       <option value="2">Горизонтальный</option>
       </select></td></tr></table>
    </div>
    <div id="sbCostumes"><div class="setHead" id="costumesHead"><p>Библиотека костюмов</p></div>

       <!-- Наикраще мiсце для хорошего сексу бiблиотека бiблиотека... -->
       <div><input class="cs-set" id="costumeLibrary" type="checkbox"${globals.costumeLibrary?' checked':''}><label for="costumeLibrary">Библиотека костюмов</label></div>
       <div><input class="cs-set" id="watermarkCostumes" type="checkbox"${globals.watermarkCostumes?' checked':''}><label for="watermarkCostumes">Значок у костюмов, добавленных библиотекой</label></div>
       <div><input class="cs-set" id="clRemoveAllCostumes" type="checkbox"${globals.clRemoveAllCostumes?' checked':''}><label for="clRemoveAllCostumes">Убрать сайтовые костюмы</label></div>
       <div><input class="cs-set" id="clRemoveAllTongues" type="checkbox"${globals.clRemoveAllTongues?' checked':''}><label for="clRemoveAllTongues">Убрать все языки</label></div>

       <div id="libCustom"><div><input class="cs-set" id="clLakeUniverse" type="checkbox"${globals.clLakeUniverse?' checked':''}><label for="clLakeUniverse">Озёрная вселенная</label></div>
       <div><input class="cs-set" id="clSeaUniverse" type="checkbox"${globals.clSeaUniverse?' checked':''}><label for="clSeaUniverse">Морская вселенная</label></div>
       <div><input class="cs-set" id="clCreatorUniverse" type="checkbox"${globals.clCreatorUniverse?' checked':''}><label for="clCreatorUniverse">Вселенная творцов</label></div>
       <div><input class="cs-set" id="clMemeCostumes" type="checkbox"${globals.clMemeCostumes?' checked':''}><label for="clMemeCostumes">Шуточные костюмы</label></div></div>

       <button onclick="window.open('https://docs.google.com/forms/d/e/1FAIpQLSdXz5vKVU1Pk3U1BAAQTjq-LFYw0WX3-kkC_KUcReaNMt5E-Q/viewform', '_blank')" id="formButton">Заполнить форму</button>
       <table id="lastUpdtTable"><tr><td><small><i><p>Последнее обновление: </p></i></small></td><td><small><i><span id="lastUpdateDate"></span></i></small></div></td></tr></table>
    </div>

</div><div id="trFour">
    <div id="sbTemplates"><div class="setHead" id="templatesHead"><p>Шаблоны</p></div>
    <table id="templateTable"><tr><td colspan="3">Отображать шаблоны</td></tr>
    <tr><td><label for="textTemplates">Сообщения</label></td>
    <td><label for="ttChat">Чаты</label></td>
    <td><label for="bloglentTextTemplates">Блоги и лента</label></td></tr>
    <tr><td><input class="cs-set" id="textTemplates" type="checkbox"${globals.textTemplates?' checked':''}></td>
    <td><input class="cs-set" id="ttChat" type="checkbox"${globals.ttChat?' checked':''}></td>
    <td><input class="cs-set" id="bloglentTextTemplates" type="checkbox"${globals.bloglentTextTemplates?' checked':''}></td></tr>

    <tr><td colspan="3">Изначально сворачивать</td></tr>
    <tr><td><label for="textTemplates">Сообщения</label></td>
    <td><label for="ttChat">Чаты</label></td>
    <td><label for="bloglentTextTemplates">Блоги и лента</label></td></tr>
    <tr><td><input class="cs-set" id="toggleTT" type="checkbox"${globals.toggleTT?' checked':''}></td>
    <td><input class="cs-set" id="toggleTTChat" type="checkbox"${globals.toggleTTChat?' checked':''}></td>
    <td><input class="cs-set" id="toggleTTBlog" type="checkbox"${globals.toggleTTBlog?' checked':''}></td></tr></table>


    <table id="replaceTable"><tr><td colspan="2">Вставлять название шаблона в заголовок</td></tr>
    <tr><td>Сообщения</td>
    <td>Блоги и лента</td></tr>
    <tr><td><input class="cs-set" id="ttReplaceTheme" type="checkbox"${globals.ttReplaceTheme?' checked':''}></td>
    <td><input class="cs-set" id="ttReplaceThemeB" type="checkbox"${globals.ttReplaceThemeB?' checked':''}></td></tr></table>
    </div>
    <div id="sbOthers"><div class="setHead" id="othersHead"><p>Прочее</p></div>
         <div><input class="cs-set" id="nightLagsWarning" type="checkbox"${globals.nightLagsWarning?' checked':''}><label for="nightLagsWarning">Предупреждение о соблюдении осторожности на водах и лазательных локациях в период с 03:00 по 04:00 по МСК</label></div>
         <div><input class="cs-set" id="hideWoundWarning" type="checkbox"${globals.hideWoundWarning?' checked':''}><label for="hideWoundWarning">Убрать предупреждение "Вы ранены" со всех страниц сайта</label></div>
         <div><input class="cs-set" id="kalinnikFunction" type="checkbox"${globals.kalinnikFunction?' checked':''}><label for="kalinnikFunction" title="Включает озвучку в Игровой с песнями инстасамки">Функция для Калинника<br><small>!!! Не включайте это</small></label></div>
    <div class="volumeDivs"><table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="kalinnikFunctionVolume"></div></td><td class="csLabel"><label for="kalinnikFunctionVolume"><small><i>Громкость функции</i></small></label></td></tr></table></div>
    </div>

</div><div id="trFive">
    <div id="sbGame"><div class="setHead" id="gameHead"><p>Игровая</p></div>
       <div><input class="cs-set" id="showButterflyBots" type="checkbox"${globals.showButterflyBots?' checked':''}><label for="showButterflyBots">Выделять бота-бабочку в Игровой</label></div>
       <div><input class="cs-set" id="darkCatTooltip" type="checkbox"${globals.darkCatTooltip?' checked':''}><label for="darkCatTooltip">Тёмное окошко при наведении на персонажа в Игровой</label></div>
       <div><input class="cs-set" id="brightGameField" type="checkbox"${globals.brightGameField?' checked':''}><label for="brightGameField">Не затемнять поле Игровой</label></div>
       <div><input class="cs-set" id="setka" type="checkbox"${globals.setka?' checked':''}><label for="setka">Включить сетку</label></div>

       <table id="gridTable"><tr><td><div><input class="cs-set" name="cageGridVar" id="cageGrid" type="radio"${globals.cageGrid?' checked':''}><label for="cageGrid">Стандартная сетка</label></div></td><td>
       <div><input class="cs-set" name="cageGridVar" id="cageGridV" type="radio"${globals.cageGridV?' checked':''}><label for="cageGridV">Сетка как в Варомоде</label></div></td></tr></table>

       <div><input class="cs-set" id="cgColor" type="color"${globals.cgColor?' checked':''} style="width: 35px;"><label for="cgColor"> Цвет сетки ячеек локации</label></div>
       <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="cgOpacity"></div></td><td class="csLabel"><label for="cgOpacity"><small><i>Прозрачность</i></small></label></td></tr></table>

       <div id="sbSiren">
         <div><input class="cs-set" id="cdSDivers" type="checkbox"${globals.cdSDivers?' checked':''}><label for="cdSDivers">Выделять ныряющих в Игровой</label></div>
         <div><input class="cs-set" id="diverSiren" type="checkbox"${globals.diverSiren?' checked':''}><label for="diverSiren">Звуковое уведомление при определённом сне на водах</label></div>
         <div><input class="cs-set" id="diverSirenMinutes" type="number"${globals.diverSirenMinutes?' checked':''} style="width: 40px;" step="5" max="40" min="5"> <label for="diverSirenMinutes">При каком сне начинает срабатывать</label></div>
         <input class="cs-set" id="dsX" type="number"${globals.dsX?' checked':''} style="width: 55px;" step="5"> <input class="cs-set" id="dsY" type="number"${globals.dsY?' checked':''} style="width: 55px;" step="5"><label for="dsY"> Расположение окошка по X/Y px</label>
         <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="diverSirenVol"></div></td><td class="csLabel"><label for="diverSirenVol"><small><i>Громкость функции</i></small></label></td></tr></table>
       </div>
       <div><input class="cs-set" id="ahbHistory" type="checkbox"${globals.ahbHistory?' checked':''}><label for="ahbHistory">Автоматически сворачивать Историю</label></div>
       <div><input class="cs-set" id="ahbParameter" type="checkbox"${globals.ahbParameter?' checked':''}><label for="ahbParameter">Автоматически сворачивать Параметры и навыки</label></div>
       <div><input class="cs-set" id="ahbRelatives" type="checkbox"${globals.ahbRelatives?' checked':''}><label for="ahbRelatives">Автоматически сворачивать Родственные связи</label></div>
       <div><input class="cs-set" id="smellTimer" type="checkbox"${globals.smellTimer?' checked':''}><label for="smellTimer">Таймер нюха</label></div>
       <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="smellTimerVol"></div></td><td class="csLabel"><label for="smellTimerVol"><small><i>Громкость функции</i></small></label></td></tr></table>
       <div><input class="cs-set" id="newLS" type="checkbox"${globals.newLS?' checked':''}><label for="newLS">Уведомлять о новых личных сообщениях</label></div>
       <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="newLSVol"></div></td><td class="csLabel"><label for="newLSVol"><small><i>Громкость функции</i></small></label></td></tr></table>
       <div><input class="cs-set" id="newChat" type="checkbox"${globals.newChat?' checked':''}><label for="newChat">Уведомлять о новых сообщениях в чате</label></div>
       <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="newChatVol"></div></td><td class="csLabel"><label for="newChatVol"><small><i>Громкость функции</i></small></label></td></tr></table>
       <div><input class="cs-set" id="eatenNote" type="checkbox"${globals.eatenNote?' checked':''}><label for="eatenNote">Уведомлять, если тебя подняли в Игровой</label></div>
       <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="eatenNoteVol"></div></td><td class="csLabel"><label for="eatenNoteVol"><small><i>Громкость функции</i></small></label></td></tr></table>
    </div>

</div><div id="trSix">
    <div id="sbStyles"><div class="setHead" id="stylesHead"><p>Кастомизация</p></div>
       <br><div>
         <select class="cs-set" id="selTheme">
           <option value="0">Основная CatWar Script</option>
           <option value="1">Вторая CatWar Script</option>
           <option value="2">Третья CatWar Script</option>
         </select><label for="selTheme"> Палитра блоков CatWar Script</label>
       </div>

       <table id="customTable"><tr><td><button onclick="window.open('https://catwarscript.github.io/cw3edit', '_blank')" id="customButton">Конструктор игровой</button></td>
       <td><div><input class="cs-set" id="playerCustom" type="checkbox"${globals.playerCustom?' checked':''}><label for="playerCustom">Игровая из конструктора игровой</label></div></td></tr></table>






<table id="impExpTable"><tr><td><label for="inputImport">Импорт настроек</label></td><td><input type="text" id="inputImport"></td></tr>
<tr><td><button id="inputExport">Экспорт настроек</button></td><td><input id="outputExport"></td></tr></table>

       <div id="sbDefects">
         <div><input class="cs-set" id="cdSColors" type="checkbox"${globals.cdSColors?' checked':''}><label for="cdSColors">Выделять клетки с больными игроками<br><small><i>!!! Галочки слева отвечают за выделение недуга в целом, справа – за особое выделение для третьей и четвёртой стадии</i></small></label></label></div>
         <table id="defTable"><tr><td><div><input class="cs-set" id="cdSRamkiFalse" type="radio" name="iscdsramki"${!globals.cdSRamki?' checked':''} value="false"><label for="cdSRamkiFalse">Выделять всю клетку</label></div></td>
         <td><div><input class="cs-set" id="cdSRamkiTrue" type="radio" name="iscdsramki"${globals.cdSRamki?' checked':''} value="true"><label for="cdSRamkiTrue">Выделять рамку клетки</label></div></td></tr></table>
         <div><input class="cs-set" id="cdSIcon" type="checkbox"${globals.cdSIcon?' checked':''}><label for="cdSIcon">Показывать иконки дефектов</div><br>
         <table id="defectTable">
           <tr><td colspan="3">Подсветка болезней</td></tr>
           <tr>
             <td>Раны</td>
             <td>Отравление</td>
             <td>Ушибы</td>
           </tr><tr>
             <td><input class="cs-set" id="cdCRani" type="color"${globals.cdCRani?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="cdCPoison" type="color"${globals.cdCPoison?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="cdCTrauma" type="color"${globals.cdCTrauma?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSRani1" type="checkbox"${globals.cdSRani1?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSPoison1" type="checkbox"${globals.cdSPoison1?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSTrauma1" type="checkbox"${globals.cdSTrauma1?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSDrown2" type="checkbox"${globals.cdSDrown2?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSPoison1" type="checkbox"${globals.cdSPoison2?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSGryaz2" type="checkbox"${globals.cdSGryaz2?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSRani3" type="checkbox"${globals.cdSRani3?' checked':''}><input class="cs-set" id="cdSRani3B" type="checkbox"${globals.cdSRani3B?' checked':''}></td>
             <td><input class="cs-set" id="cdSPoison3" type="checkbox"${globals.cdSPoison3?' checked':''}><input class="cs-set" id="cdSPoison3B" type="checkbox"${globals.cdSPoison3B?' checked':''}></td>
             <td><input class="cs-set" id="cdSTrauma3" type="checkbox"${globals.cdSTrauma3?' checked':''}><input class="cs-set" id="cdSTrauma3B" type="checkbox"${globals.cdSTrauma3B?' checked':''}></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSRani4" type="checkbox"${globals.cdSRani4?' checked':''}><input class="cs-set" id="cdSRani4B" type="checkbox"${globals.cdSRani4B?' checked':''}></td>
             <td><input class="cs-set" id="cdSPoison4" type="checkbox"${globals.cdSPoison4?' checked':''}><input class="cs-set" id="cdSPoison4B" type="checkbox"${globals.cdSPoison4B?' checked':''}></td>
             <td><input class="cs-set" id="cdSTrauma4" type="checkbox"${globals.cdSTrauma4?' checked':''}><input class="cs-set" id="cdSTrauma4B" type="checkbox"${globals.cdSTrauma4B?' checked':''}></td>
           </tr><tr>
             <td>Переломы</td>
             <td>Кашель</td>
             <td>Грязь</td>
           </tr><tr>
             <td><input class="cs-set" id="cdCDrown" type="color"${globals.cdCDrown?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="cdCCough" type="color"${globals.cdCCough?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="cdCGryaz" type="color"${globals.cdCGryaz?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSDrown1" type="checkbox"${globals.cdSDrown1?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSCough" type="checkbox"${globals.cdSCough?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td><input class="cs-set" id="cdSGryaz1" type="checkbox"${globals.cdSGryaz1?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSDrown2" type="checkbox"${globals.cdSDrown2?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
             <td>Подстилки</td>
             <td><input class="cs-set" id="cdSGryaz2" type="checkbox"${globals.cdSGryaz2?' checked':''}><input class="cs-set" type="checkbox" disabled checked="true"></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSDrown3" type="checkbox"${globals.cdSDrown3?' checked':''}><input class="cs-set" id="cdSDrown3B" type="checkbox"${globals.cdSDrown3B?' checked':''}></td>
             <td><input class="cs-set" id="cdCPodstilki" type="color"${globals.cdCPodstilki?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="cdSGryaz3" type="checkbox"${globals.cdSGryaz3?' checked':''}><input class="cs-set" id="cdSGryaz3B" type="checkbox"${globals.cdSGryaz3B?' checked':''}></td>
           </tr><tr>
             <td><input class="cs-set" id="cdSDrown4" type="checkbox"${globals.cdSDrown4?' checked':''}><input class="cs-set" id="cdSDrown4B" type="checkbox"${globals.cdSDrown4B?' checked':''}></td>
             <td><input class="cs-set" id="cdSPodstilki" type="checkbox"${globals.cdSPodstilki?' checked':''}></td>
             <td><input class="cs-set" id="cdSGryaz4" type="checkbox"${globals.cdSGryaz4?' checked':''}><input class="cs-set" id="cdSGryaz4B" type="checkbox"${globals.cdSGryaz4B?' checked':''}></td>
           </tr>
         </table><br>
           <button id="resetDefectSettings">Сбросить настройки дефектов</button>
         <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="cdOpacity"></div></td><td class="csLabel"><label for="cdOpacity"><small><i>Прозрачность</i></small></label></td></tr></table>
       </div><br>

       <div id="sbItems">
         <table id="itemTable">
           <tr><td colspan="3">Подсветка ресурсов</td></tr>
           <tr>
             <td>Травы</td>
             <td>Мох</td>
           </tr><tr>
             <td><input class="cs-set" id="ciCHerb" type="color"${globals.ciCHerb?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="ciCMoss" type="color"${globals.ciCMoss?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td><input class="cs-set" id="ciSHerb" type="checkbox"${globals.ciSHerb?' checked':''}>
             <td><input class="cs-set" id="ciSMoss" type="checkbox"${globals.ciSMoss?' checked':''}>
           </tr><tr>
             <td>Паутина</td>
             <td>Пыль</td>
           </tr><tr>
             <td><input class="cs-set" id="ciCWeb" type="color"${globals.ciCWeb?' checked':''} style="width: 35px;"></td>
             <td><input class="cs-set" id="ciCDust" type="color"${globals.ciCDust?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td><input class="cs-set" id="ciSWeb" type="checkbox"${globals.ciSWeb?' checked':''}>
             <td><input class="cs-set" id="ciSDust" type="checkbox"${globals.ciSDust?' checked':''}>
           </tr><tr>
             <td colspan="2">Ветки, вьюнки, костоправы</td>
           </tr><tr>
             <td colspan="2"><input class="cs-set" id="ciCStick" type="color"${globals.ciCStick?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td colspan="2"><input class="cs-set" id="ciSStick" type="checkbox"${globals.ciSStick?' checked':''}>
           </tr><tr>
             <td colspan="2">Травящие предметы</td>
           </tr><tr>
             <td colspan="2"><input class="cs-set" id="ciCMusor" type="color"${globals.ciCMusor?' checked':''} style="width: 35px;"></td>
           </tr><tr>
             <td colspan="2"><input class="cs-set" id="ciSMusor" type="checkbox"${globals.ciSMusor?' checked':''}>
           </tr>
         </table><br>
         <button id="resetItemSettings">Сбросить настройки предметов</button>
         <table class="sliderTable"><tr><td class="csSlider"><div class="cs-set cs-set-sl" id="ciOpacity"></div></td><td class="csLabel"><label for="ciOpacity"><small><i>Прозрачность</i></small></label></td></tr></table>
       </div>
    </div>
</div>
       </div>
     </div>
  <div id="div2"><h2>Варомод</h2><p>
Данный мод добавляет множество полезных функций, среди которых многим известные:<br>
– Калькуляторы активности и лун;<br>
– Заметки об игроках;<br>
– Отображение аватарок в комментариях под постами;<br>
– Снежинки в Игровой, когда идёт снег;<br>
И многое другое! С полным списком функций вы сможете ознакомиться при установке данного скрипта.<br>
<a href="https://openuserjs.org/scripts/CatWarScript/CatWar_Mod" target="_blank">Ссылка на установку</a> | <a href="https://github.com/CatWarScript/CatWarScript/raw/main/CatWarMod/CatWarMod.user.js" target="_blank">Альт. ссылка</a></p>
     </div>
  <div id="div3"><h2>CW: Shed</h2>
    <p>Данный мод добавляет множество полезных функций, среди которых многим известные:<br>
– Отображение ID в личных сообщениях, чате, а также отображение ID котов, находящихся во рту;<br>
– Всевозможные звуковые уведомления: о новых сообщениях в ЛС и чате, при нападении на вас, при поднятии вашего персонажа и т.д;<br>
– Отдельный блок с гибкой настройкой уведомлений для действий, где вы сможете настроить на какие действия будет срабатывать функция;<br>
– Разноцветные параметры и навыки с полной кастомизацией;<br>
– Лог чистильщиков, отображающий поднятия и опускания игроков, а также прочие дополнительные данные о них.<br>
И многое другое! С полным списком функций вы сможете ознакомиться при установке данного скрипта.<br>
<a href="https://abstract-class-shed.github.io/cwshed/CW_Shed.user.js" target="_blank">Ссылка на установку</a></p>
     </div>
    </div>
        </div></div></div>
        </div></div></div>
        </td></tr></tbody></table></td></tr></tbody></table>`

$(document).ready(function() {
  $('#clockFontWeight').val(globals.clockFontWeight);
  $('#cstmDfctWounds').val(globals.cstmDfctWounds);
  $('#diverSirenVol').val(globals.diverSirenVol);
  $('#diverSirenMinutes').val(globals.diverSirenMinutes);
  $('#diverSirenHref').val(globals.diverSirenHref);
  $('#cdCRani').val(globals.cdCRani);
  $('#cdCPoison').val(globals.cdCPoison);
  $('#cdCTrauma').val(globals.cdCTrauma);
  $('#cdCDrown').val(globals.cdCDrown);
  $('#cdCCough').val(globals.cdCCough);
  $('#cdCGryaz').val(globals.cdCGryaz);
  $('#cdOpacity').val(globals.cdOpacity);
  $('#ciCHerb').val(globals.ciCHerb);
  $('#ciCMoss').val(globals.ciCMoss);
  $('#ciCWeb').val(globals.ciCWeb);
  $('#ciCStick').val(globals.ciCStick);
  $('#ciCDust').val(globals.ciCDust);
  $('#ciCMusor').val(globals.ciCMusor);
  $('#ciOpacity').val(globals.ciOpacity);
  $('#cdCPodstilki').val(globals.cdCPodstilki);
  $('#cgOpacity').val(globals.cgOpacity);
  $('#cgColor').val(globals.cgColor);
  $('#dsX').val(globals.dsX);
  $('#dsY').val(globals.dsY);
  $('#kalinnikFunctionVolume').val(globals.kalinnikFunctionVolume);
  $('#smellTimerVol').val(globals.smellTimerVol);
  $('#smellTimerHref').val(globals.smellTimerHref);
  $('#newLSVol').val(globals.newLSVol);
  $('#newChatVol').val(globals.newChatVol);
  $('#eatenNoteVol').val(globals.eatenNoteVol);
  $('#tmTecPosX').val(globals.tmTecPosX);
  $('#tmTecPosY').val(globals.tmTecPosY);
  if (globals.tmVariant !== null) {
    $('#tmVariant').val(globals.tmVariant);
  }
  if (globals.selTheme !== null) {
    $('#selTheme').val(globals.selTheme);
  }
});

function peredvinutBloki(importFrom, exportTo) {
  const sourceDivSelector = importFrom; // Двигаемое
  const targetDivSelector = exportTo; // Куда вставляем
  const sourceDiv = $(sourceDivSelector);
  const targetDiv = $(targetDivSelector);
  if (sourceDiv.length > 0 && targetDiv.length > 0) {
    targetDiv.empty();
    sourceDiv.appendTo(targetDiv);
  }
}

    $(document).ready(function(){
     $('.content > div:not(:first)').hide();
      $('.header a').click(function(e){
      e.preventDefault();
      var target = $(this).data('target');
       $('.content > div').hide();
       $('#div' + target).show();
       $('.header a').removeClass('active').addClass('passive');
       $(this).removeClass('passive').addClass('active');
      });
    });
$(document).ready(function() { let clickCount = 0; $("#clRemoveAllTongues").click(function(e) {clickCount++;if (clickCount >= 3) {clickCount = 0; $("label[for*='clRemoveAllTongues']").after('<img src="https://voz.vn/attachments/1657775494064-png.1264140/" width="99%">'); } }); });
    $(document).ready(function() {
     peredvinutBloki("div#cwmod-settings", "#div2")
     peredvinutBloki("div#cwa_sett", "#div3")
    });

$(document).ready(function() {
  setTimeout(function() {
    const deleteLinks = $('a[href="del"]:contains("Удалить персонажа")');
    $('#cwsSet hr, #cwsSet div hr, #cwsSet div div hr').addClass('legit');

    // Добавляем класс 'legit' к hr с id 'uwu-hr'
    $('#uwu-hr').addClass('legit');
    $('div#uwusettings hr').addClass('legit');
    deleteLinks.each(function() {
      const previousHR = $(this).prevAll('hr');
      previousHR.addClass('legit');
    });

    // Удаляем все hr, кроме тех, которые имеют класс 'legit'
    $('hr:not(.legit)').remove();
  }, 700);
});

  appendToElementOrFallback('#branch', 'a[href="del"]', html);

  function handleSliderChange(event, ui) {
    let key = $(this).attr('id');
    let val = ui.value;
    setSettings(key, val);
    console.log(key, ': ', val, '.');
  }

function clearDontReadMessages() {
  localStorage.setItem('dontReadenCount', 0);
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('message')) {
      localStorage.removeItem(key);
    }
    updateDontReadCounter1();
  }
}

$(document).ready(function() {
  const targetElements = document.querySelectorAll('a[data-target="2"]');
  let clickCount = 0;

  targetElements.forEach(element => {
    element.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 15) {
        if (confirm("Вы уверены, что хотите очистить localStorage? Все настройки всех модов будут сброшены! Сделайте копии ваших настроек и сохранённых ЛС. Карты лазалок восстановлению не подлежат.")) {
          localStorage.clear();
          alert('Все настройки очищены!');
        }
      }
    });
  });
});
$('#clearDontReadButton').on('click', clearDontReadMessages);

  $('.cs-set').not('.cs-set-sl').on('change', function() {
      let key = this.id;
      let val = this.type === 'checkbox' ? this.checked : this.value;
      if (this.tagName === 'SELECT') {
        val = $(this).prop('selectedIndex');
      }
      setSettings(key, val);
      console.log(key, ': ', val, '.');
  });
  $(document).ready(function() {
      $('.cs-set-sl').each(function() {
          let key = $(this).attr('id');
          let initialValue = globals[key];
$(this).slider({
            slide: handleSliderChange,
            value: initialValue,
            min: 0,
            max: 1,
            step: 0.1,
            create: function(event, ui) {
                $(this).width(200);
            }
        });
      });
  });
      $('input[name="timeSource"]').on('change', function() {
      setSettings('isClockMoscow', this.id === 'moscowTime');
    });
        $('input[name="cageGridVar"]').on('change', function() {
      setSettings('cageGridVar', this.id === 'cageGridV');
    });

$('input[name="iscdsramki"]').on('change', function() {
  setSettings('cdSRamki', this.value === 'true');
});

  $(function() {
    let sound = null;

    $(document).on('slidechange', '.ui-slider', function() {
      const sliderId = $(this).attr('id');
      let soundId;

      if (sliderId === 'diverSirenVol') {
        soundId = globals.diverSirenHref;
      } else if (sliderId === 'smellTimerVol') {
        soundId = globals.smellTimerHref;
      } else if (sliderId === 'newLSVol' || sliderId === 'newChatVol') {
        soundId = globals.messageSound;
      } else if (sliderId === 'eatenNoteVol') {
        soundId = globals.smellTimerHref;
      } else if (sliderId === 'fightWarningVol') {
        soundId = globals.fightWarningHref;
      } else if (sliderId === 'tmResetVolume') {
        soundId = globals.tmResetSource;
      }

      if (soundId) {
        if (sound) {
          sound.pause();
          sound = null;
        }
        sound = new Audio(soundId);
        sound.volume = $(`#${sliderId}`).slider('value');
        sound.play();
        sound.onended = () => {
          sound = null;
        };
      }
    });
  });

  let settingsToResetDfct = [ 'customDefects', 'cdSColors', 'cdSRamki', 'cdOpacity', 'cdSIcon', 'cdCRani', 'cdSRani1', 'cdSRani2', 'cdSRani3', 'cdSRani3B', 'cdSRani4', 'cdSRani4B', 'cdCPoison', 'cdSPoison1', 'cdSPoison2', 'cdSPoison3', 'cdSPoison3B', 'cdSPoison4', 'cdSPoison4B', 'cdCTrauma', 'cdSTrauma1', 'cdSTrauma2', 'cdSTrauma3', 'cdSTrauma3B', 'cdSTrauma4', 'cdSTrauma4B', 'cdCDrown', 'cdSDrown1', 'cdSDrown2', 'cdSDrown3', 'cdSDrown3B', 'cdSDrown4', 'cdSDrown4B', 'cdCGryaz', 'cdSGryaz1', 'cdSGryaz2', 'cdSGryaz3', 'cdSGryaz3B', 'cdSGryaz4', 'cdSGryaz4B', 'cdSCough', 'cdCCough', 'cdSPodstilki', 'cdCPodstilki', 'cdSDivers' ];
  let settingsToResetItm = [ 'customItems', 'ciSHerb', 'ciCHerb', 'ciSMoss', 'ciCMoss', 'ciSWeb', 'ciCWeb', 'ciSStick', 'ciCStick', 'ciSDust', 'ciCDust', 'ciSMusor', 'ciCMusor', 'ciOpacity' ];
  $('#resetDefectSettings').on('click', function() { resetSettings(settingsToResetDfct); });
  $('#resetItemSettings').on('click', function() { resetSettings(settingsToResetItm); });

  $(document).ready(function() {
    function toggleCustomDefectDelay() { $('#cstmDfctWounds, #cstmDfctBruise, #cstmDfctShowRamki, #cstmDfctFractures, #cstmDfctPoison, #cstmDfctCough, #cstmDfctDirt, #cstmDfctOpacity, #cstmDfctShowColors, #cstmDfctShowNum, #cstmDfctShowHighDirt, #cstmDfctShowLowDirt, #cstmDfctShow34WoundBetter, #cstmDfctShowAllBetter').prop('disabled', !$('#customDefectDelay').is(':checked')); }
    $('#customDefectDelay').change(toggleCustomDefectDelay);
    toggleCustomDefectDelay();

    function toggleCustomItemsDelay() { $('#cstmItmHerbDelay, #cstmItmHerbClr, #cstmItmMossDelay, #cstmItmMossClr, #cstmItmWebDelay, #cstmItmWebClr, #cstmItmStickDelay, #cstmItmStickClr, #cstmItmDustDelay, #cstmItmDustClr, #cstmItmOpacity, #cstmItmMusorDelay, #cstmItmMusorClr').prop('disabled', !$('#customItemsDelay').is(':checked')); }
    $('#customItemsDelay').change(toggleCustomItemsDelay);
    toggleCustomItemsDelay();

    function toggleTimeBlock() { $('#deviceTime, #moscowTime, #showDate, #movableClocks').prop('disabled', !$('#inGameClock').is(':checked')); }
    $('#inGameClock').change(toggleTimeBlock);
    toggleTimeBlock();

    function toggleCustomDefectColor() { $('#cdSRamkiFalse, #cdSRamkiTrue').prop('disabled', !$('#cdSColors').is(':checked')); }
    $('#cdSColors').change(toggleCustomDefectColor);
    toggleCustomDefectColor();
  });

  $(document).ready(function() {
    function toggleSetka() { $('#cageGrid, #cageGridV, #cgColor, #cgOpacity').prop('disabled', !$('#setka').is(':checked')); }
    $('#setka').change(toggleSetka);
    toggleSetka();
  });


      const inputImport = document.getElementById('inputImport');
      const inputExport = document.getElementById('inputExport');

      function importSettings() {
        try {
          const importedSettings = JSON.parse(inputImport.value);
          Object.keys(importedSettings).forEach(key => {
            const localStorageKey = 'cs_n_' + key;
            if (typeof importedSettings[key] === 'string' && !isNaN(parseFloat(importedSettings[key]))) {
              globals[key] = parseFloat(importedSettings[key]);
              window.localStorage.setItem(localStorageKey, parseFloat(importedSettings[key]));
            } else {
              globals[key] = importedSettings[key];
              window.localStorage.setItem(localStorageKey, importedSettings[key]);
            }
          });

          alert('Настройки импортированы успешно');
        } catch (error) {
          alert('Ошибка при импорте настроек');
        }
      }

      function exportSettings() {
        const settingsToExport = {};
        ['cgBorderWid', 'cgBorderType', 'cgBorderCol', 'cgBorderRad', 'cgIsBorderRad', 'cgBodyCol', 'cgFieldWid', 'cgFieldHei', 'cgFieldX', 'cgFieldY', 'cgIsFieldFix', 'cgParWid', 'cgParHei', 'cgParX', 'cgParY', 'cgParCol', 'cgParFCol', 'cgTOSWid', 'cgTOSHei', 'cgTOSX', 'cgTOSY', 'cgTOSCol', 'cgSkyWid', 'cgSkyHei', 'cgSkyX', 'cgSkyY', 'cgSmallWid', 'cgSmallHei', 'cgSmallX', 'cgSmallY', 'cgSmallCol', 'cgSmallFCol', 'cgOCLWid', 'cgOCLHei', 'cgOCLX', 'cgOCLY', 'cgOCLFCol', 'cgChatWid', 'cgChatHei', 'cgChatX', 'cgChatY', 'cgChatCol', 'cgChatFCol', 'cgClockWid', 'cgClockHei', 'cgClockX', 'cgClockY', 'cgClockCol', 'cgClockFCol', 'cgTBWid', 'cgTBHei', 'cgTBX', 'cgTBY', 'cgTBCol', 'cgTBFCol', 'cgHisWid', 'cgHisHei', 'cgHisX', 'cgHisY', 'cgHisCol', 'cgHisFCol', 'cgDeysWid', 'cgDeysHei', 'cgDeysX', 'cgDeysY', 'cgDeysCol', 'cgDeysFCol', 'cgRotWid', 'cgRotHei', 'cgRotX', 'cgRotY', 'cgRotCol', 'cgRotFCol', 'cgLocWid', 'cgLocHei', 'cgLocX', 'cgLocY', 'cgLocCol', 'cgLocFCol', 'cgRSWid', 'cgRSHei', 'cgRSX', 'cgRSY', 'cgRSCol', 'cgRSFCol', 'cgInfoH2DelMargins', 'cgInfoH2FontSize', 'cgDelRSH2', 'cgDelHisH2', 'cgDelParH2', 'cgSeparateLocation', 'cgLocFW', 'cgFontSize', 'cgBorders', 'cgTbBorder', 'cgSmallFW', 'cgYouBG', 'cgYouFC', 'cgInputCol', 'cgInputFCol', 'cgInputBorders', 'cgIsTBBorderRad', 'cgIsLocBorderRad', 'cgDeleteScrolls', 'cgChatSliderCol', 'cgChatSliderBorderCol', 'cgChatSliderLineCol', 'cgChatSliderLineBorder'].forEach(key => {
          settingsToExport[key] = globals[key];
        });
        inputExport.value = JSON.stringify(settingsToExport, null, 2);
        document.getElementById('outputExport').value = JSON.stringify(settingsToExport, null, 2);

      }
      inputImport.addEventListener('change', importSettings);
      inputExport.addEventListener('click', exportSettings);

  $('#nightLagsWarning').on('change', function() {
    if (!this.checked) {
      let userConfirmation = confirm("Вы уверены, что хотите отключить предупреждение о ночных лагах?");
      if (!userConfirmation) {
        this.checked = true;
      }
    }
  });
      (function() { // ДАТА ОБНОВЛЕНИЯ БИБЛИОТЕКИ КОСТЮМОВ
        const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/DATE/last-update-date.html?raw=true';
        $.ajax({
            url: githubUrl,
            dataType: 'text',
            success: function(data) {
                $('span#lastUpdateDate').empty().append(data);
            }});})();
  $(document).ready(function() { let clickCount = 0; const videoUrls = ['https://www.youtube-nocookie.com/embed/1rd4P7uMvvQ?si=TkZTp3GZbxxvcYqV&controls=0', 'https://www.youtube-nocookie.com/embed/elaSoKe1gFw?si=Q5JWB-t06mRZDLra&controls=0', 'https://www.youtube-nocookie.com/embed/8Jk_5Yry_SE?si=cGZXfc39MZl9W9_I&controls=0' ]; $("a.active[data-target='1']").click(function(e) {e.preventDefault(); clickCount++;if (clickCount >= 5) {clickCount = 0; const randomIndex = Math.floor(Math.random() * videoUrls.length); const randomVideoUrl = videoUrls[randomIndex]; const iframe = document.createElement('iframe'); iframe.width = '99%'; iframe.height = '530px'; iframe.src = randomVideoUrl; iframe.title = 'YouTube video player'; iframe.frameborder = '0'; iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; iframe.allowfullscreen = true; iframe.referrerpolicy = 'strict-origin-when-cross-origin'; $("#tableContent").empty().append(iframe); } }); });
}




// ...
// ...
// ...

function dm() {
  if (globals['dontReadenLS']) {

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
      updateDontReadCounter1();
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

    let dontreadencss = `
     <style>.dontReaden {
     background-color: var(--cwsc-bckg-6); }
     </style>`
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
          let templates = localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : [];

          function renderTemplates() {
            let list = $('.patternlist');
            list.empty();
            templates.forEach(function(template, index) {
              let templateText = '<div class="patternline"><a href="#" class="name" data-index="' + index + '">' + template.name + '</a> <div id="del-edit"><a href="#" class="delete" data-index="' + index + '">[X]</a> <a href="#" class="edit" data-index="' + index + '">[✍]</a></div><hr>';
              list.append(templateText);
            });
          }
          let writeForm = $('form#write_form');
          if (writeForm.length === 0) {
            return;
          }
          writeForm.find('.patternblock').remove();
          writeForm.prepend('<div class="patternblock"><b>Шаблоны</b><div class="patternlist"></div></div>');
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
            $('#templateBtnSaveChanges').show();
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
                $('#templateBtnSaveChanges').hide();
              });
            }
          });
          writeForm.on('click', '.name', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let template = templates[templateIndex];
            if (template) {
              $('#text').val(template.content);
              if (globals['ttReplaceTheme']) {
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
          if (globals['toggleTT']) {
            $('.patternblock').hide();
          }
        }
      }
    }
    let css = `
        <style>
          div.patternlist::-webkit-scrollbar {
          width: 8px; }
          div.patternlist::-webkit-scrollbar-track {
          background: var(--cwsc-scrl-1) !important;
          border-radius: 3px; }
          div.patternlist::-webkit-scrollbar-thumb {
          background: var(--cwsc-scrl-2) !important;
          border-radius: 3px; }
          div.patternblock {
          font-family: Montserrat;
          outline: 5px solid var(--cwsc-brdr-1);
          background-color: var(--cwsc-bckg-1);
          color: var(--cwsc-txt-1);
          border-radius: 10px !important;
          margin: 15px 5px; }
          div.patternblock>b {
          display: flex !important;
          justify-content: center;
          text-transform: uppercase;
          color: var(--cwsc-txt-2);
          font-size: 25px;
          letter-spacing: 25px;
          padding: 10px 0px;
          margin-left: 25px; }
          div.patternlist {
          max-height: 170px;
          overflow: auto;
          background-color: var(--cwsc-bckg-2);
          border-top: 4px solid var(--cwsc-brdr-2);
          border-radius: 0px 0px 10px 10px;
          padding: 6px 0px 0px 0px}
          div.patternline>hr {
          border: 0.5px solid var(--cwsc-brdr-4);
          margin: 6px 0px 0px 0px; }
          div.patternline:hover {
          background: var(--cwsc-brdr-4) !important;
          transition: 0.8s; }
          div.patternline {
          transition: 0.8s;
          padding-top: 6px; }
          div.patternline a {
          color: var(--cwsc-txt-1); }
          div.patternline a:hover {
          color: var(--cwsc-txt-4); }
          .patternline>a.name {
          display: block;
          margin: 0px 0px 0px 10px; }
          div#del-edit {
          display: flex;
          justify-content: flex-end;
          margin: -15px 0px 0px 0px;
          height: 18px; }
          div#del-edit>a {
          margin: 0px 3px; }
          div#del-edit>a.edit {
          position: relative;
          bottom: 1px; }
          input#templateName {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 1px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          width: 200px !important;
          margin: 6px 10px 4px 10px; }
          button#templateBtnOK, button#templateBtnUndo, button#templateBtnSaveChanges {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 2px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          padding: 1px 15px;
          margin: 0px 5px; }
          button#templateBtnOK:hover, button#templateBtnUndo:hover, button#templateBtnSaveChanges:hover {
          border: 1px solid var(--cwsc-brdr-2); }
          a#createButton {
          display: inline-block;
          color: var(--cwsc-txt-4);
          padding: 6px; }
          button#togglePatternBlockButton {
          background-color: var(--cwdf-bckg-1);
          color: var(--cwdf-txt-1);
          border: none;
          margin-right: 5px; }
          button#togglePatternBlockButton:hover {
          outline: 1px solid var(--cwdf-brdr-2); }
        </style>`
    $('head').append(css);
  }

if (globals['timerForLS']) {
  let script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
  document.getElementsByTagName('head')[0].appendChild(script);

  let stylesAdded = false;

  function updateMessageStyles() {
    if (typeof moment !== "undefined") {
      let now = moment();
      $('#messList tr').each(function(index, element) {
        if (index === 0) return;
        if ($(element).attr('class') === 'msg_read') {
          return;
        }
        let dateText = $(element).find('td:nth-child(3)').text();
        let messageDate = moment(dateText, 'YYYY-MM-DD HH:mm:ss');
        let diffDays = now.diff(messageDate, 'days');
        if (diffDays >= 6 && diffDays <= 14) {
          $(element).addClass('old-message');
        } else {
          $(element).removeClass('old-message');
        }
      });
      if (!stylesAdded) {
        let css = `
          <style>
            .old-message {
              background-color: var(--cwsc-bckg-8);
            }
          </style>
        `;
        $('head').append(css);
        stylesAdded = true;
      }
    } else {
      setTimeout(updateMessageStyles, 100);
    }
  }
  updateMessageStyles();
  setInterval(updateMessageStyles, 1000);
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
        </div>`
          $("body").append(htmlClock);
          let cssClock = `<style>
          div#clockContainer {
          position: absolute;
          z-index: 9999;
          cursor: move;
          font-family: Montserrat;
          background-color: var(--cwsc-bckg-5);
          border: 3px solid var(--cwsc-brdr-4);
          border-radius: 5px;
          color: var(--cwsc-txt-5);
          padding: 6px 10px;
          font-weight: bold;
          font-size: ${globals.clockFontWeight}px !important; }
        </style>`
          $('head').append(cssClock);

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
          background-color: var(--cwsc-bckg-5);
          border: 3px solid var(--cwsc-brdr-4);
          color: var(--cwsc-txt-5);
          font-weight: bold;
          font-size: ${globals.clockFontWeight}px !important; }
         </style>`
      if (!globals.playerCustom) {
           let clockHtml1 = `<style>div#clockContainer {padding: 6px 10px;}</style>`
           $('head').append(clockHtml1);
      }
      $('#tr_actions').after(clockHtml);
    }
  }

  // Сухареки

  if (globals.showEnemy) {
    $('head').append('<style id="enemyList"></style>');
    $(document).ready(function() {
      globals.enemyList.forEach(enemyId => {
        const selector = `div.cage_items:has(span span span.cat_tooltip u a[href*="${enemyId}"])`;
        $('#enemyList').append(`
          ${selector} {
            outline: 5px solid ${globals.enemyColor};
            outline-offset: -5px;
            padding-bottom: 16px; }

        `);
      });
    });
  }


    $(document).ready(function() {
    if (globals.ahbHistory) {
      $('div#history_block').hide();
    }
    if (globals.ahbParameter) {
      $('div#parameters_block').hide();
    }
    if (globals.ahbRelatives) {
      $('div#relatives_block').hide();
    }
    });


  if (globals.newLS) {
    let lastLSCount = 0;
    setInterval(() => {
      const newLSCount = parseInt($('#newls').html().replace(/\D/gi, ''), 10) || 0;
      if (newLSCount !== lastLSCount) {
        if (newLSCount > lastLSCount) {
          playAudio(globals.messageSound, globals.newLSVol);
        }
        lastLSCount = newLSCount;
      }
    }, 1000);
  }

  if (globals.newChat) {
    let lastChatCount = 0;
    setInterval(() => {
      const newChatCount = parseInt($('#newchat').html().replace(/\D/gi, ''), 10) || 0;
      if (newChatCount !== lastChatCount) {
        if (newChatCount > lastChatCount) {
          playAudio(globals.messageSound, globals.newChatVol);
        }
        lastChatCount = newChatCount;
      }
    }, 1000);
  }



  if (globals.setka) {
    let variable = "";
    let color = globals.cgColor;
    let opacity = globals.cgOpacity;
    variable = hexToRGBA(color, opacity);
    if (globals.cageGridVar) {
      let css = `<style>.cage {box-shadow: inset 1px 1px 1px rgba(0, 0, 0, ${globals.cgOpacity}), inset -1px -1px 1px ${variable};}</style>`
    $('head').append(css);
    } else {
      let css = `<style>.cage {box-shadow: inset 0px ${globals.cgOpacity}px 0px ${globals.cgOpacity}px ${globals.cgColor};}</style>`
    $('head').append(css);
    }
  }

  if (globals.customDefects) {
    $('head').append(`<style id="customDefectStyle">
            #tr_field [style*='defects'] {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            }

            ol.mouth>li>div>div[style*='defects'] {
            border: none !important;
            background-color: none !important;
            outline: none !important; }

            div#itemList>div>img[style*='defects'] {
            border: none !important;
            background-color: none !important;
            outline: none !important; }
            </style>`); // Добавляем стуле для кастомных дефектов
    // РАНЫ
      if (globals.cdSRani1) { // РАНЫ 1 СТАДИЯ
        if (globals.cdSIcon) { // КОД ИКОНОК
          if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
            let css = `#tr_field [style*='wound/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%201Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
            let css = `#tr_field [style*='wound/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%201.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }

        if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
          let variable = "";
          let color = globals.cdCRani;
          let opacity = globals.cdOpacity;
          variable = hexToRGBA(color, opacity);
          if (globals.cdSRamki) { // КОД РАМОК
            let css = `#tr_field [style*='wound/1'] {
            outline: 5px solid ${variable};
            outline-offset: -5px;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
            let css = `#tr_field [style*='wound/1'] {
            background-color: ${variable} !important;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
        }
      }
      if (globals.cdSRani2) { // РАНЫ 1 СТАДИЯ
        if (globals.cdSIcon) { // КОД ИКОНОК
          if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
            let css = `#tr_field [style*='wound/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%202Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
            let css = `#tr_field [style*='wound/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%202.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }

        if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
          let variable = "";
          let color = globals.cdCRani;
          let opacity = globals.cdOpacity;
          variable = hexToRGBA(color, opacity);
          if (globals.cdSRamki) { // КОД РАМОК
            let css = `#tr_field [style*='wound/2'] {
            outline: 5px solid ${variable};
            outline-offset: -5px;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
            let css = `#tr_field [style*='wound/2'] {
            background-color: ${variable} !important;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
        }
      }
      if (globals.cdSRani3) { // РАНЫ 3 СТАДИЯ
        if (globals.cdSIcon) { // КОД ИКОНОК
          if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
            if (globals.cdSRani3B) {
              let css = `#tr_field [style*='wound/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%203!Р.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            } else {
              let css = `#tr_field [style*='wound/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%203Р.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            }
          }
          if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
            if (globals.cdSRani3B) {
              let css = `#tr_field [style*='wound/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_3_33.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            } else {
              let css = `#tr_field [style*='wound/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%203.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            }
          }
        }

        if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
          let variable = "";
          let color = globals.cdCRani;
          let opacity = globals.cdOpacity;
          variable = hexToRGBA(color, opacity);
          if (globals.cdSRamki) { // КОД РАМОК
            let css = `#tr_field [style*='wound/3'] {
            outline: 5px solid ${variable};
            outline-offset: -5px;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
            let css = `#tr_field [style*='wound/3'] {
            background-color: ${variable} !important;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
        }
      }
      if (globals.cdSRani4) { // РАНЫ 4 СТАДИЯ
        if (globals.cdSIcon) { // КОД ИКОНОК
          if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
            if (globals.cdSRani4B) {
              let css = `#tr_field [style*='wound/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%204!!!Р.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            } else {
              let css = `#tr_field [style*='wound/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Раны%204Р.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            }
          }
          if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
            if (globals.cdSRani4B) {
              let css = `#tr_field [style*='wound/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_4_33__33__33.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            } else {
              let css = `#tr_field [style*='wound/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%204.png) !important;}
              `
              $('style#customDefectStyle').append(css);
            }
          }
        }

        if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
          let variable = "";
          let color = globals.cdCRani;
          let opacity = globals.cdOpacity;
          variable = hexToRGBA(color, opacity);
          if (globals.cdSRamki) { // КОД РАМОК
            let css = `#tr_field [style*='wound/4'] {
            outline: 5px solid ${variable};
            outline-offset: -5px;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
          if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
            let css = `#tr_field [style*='wound/4'] {
            background-color: ${variable} !important;
            padding-top: 16px; }`
            $('style#customDefectStyle').append(css);
          }
        }
      }

    // ОТРАВЛЕНИЕ
    if (globals.cdSPoison1) { // ОТРАВЛЕНИЕ 1 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='poisoning/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%201Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%201.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCPoison;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='poisoning/1'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/1'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSPoison2) { // ОТРАВЛЕНИЕ 2 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='poisoning/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%202Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%202.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCPoison;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='poisoning/2'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/2'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSPoison3) { // ОТРАВЛЕНИЕ 3 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSPoison3B) {
            let css = `#tr_field [style*='poisoning/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%203!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='poisoning/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%203Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSPoison3B) {
            let css = `#tr_field [style*='poisoning/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_3_33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='poisoning/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%203.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCPoison;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='poisoning/3'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/3'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSPoison4) { // ОТРАВЛЕНИЕ 4 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSPoison4B) {
            let css = `#tr_field [style*='poisoning/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%204!!!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='poisoning/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Отравление%204Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSPoison4B) {
            let css = `#tr_field [style*='poisoning/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_4_33__33__33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='poisoning/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%204.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCPoison;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='poisoning/4'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='poisoning/4'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }

    // УШИБЫ
    if (globals.cdSTrauma1) { // УШИБЫ 1 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='trauma/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%201Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%201.png) !important; }
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCTrauma;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='trauma/1'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/1'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSTrauma2) { // УШИБЫ 2 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='trauma/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%202Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%202.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCTrauma;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='trauma/2'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/2'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSTrauma3) { // УШИБЫ 3 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSTrauma3B) {
            let css = `#tr_field [style*='trauma/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%203!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='trauma/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%203Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSTrauma3B) {
            let css = `#tr_field [style*='trauma/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_3_33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='trauma/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%203.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCTrauma;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='trauma/3'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/3'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSTrauma4) { // УШИБЫ 4 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSTrauma4B) {
            let css = `#tr_field [style*='trauma/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%204!!!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='trauma/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Ушибы%204Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSTrauma4B) {
            let css = `#tr_field [style*='trauma/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_4_33__33__33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='trauma/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%204.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCTrauma;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='trauma/4'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='trauma/4'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }

    // ПЕРЕЛОМЫ
    if (globals.cdSDrown1) { // ПЕРЕЛОМЫ 1 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='drown/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%201Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='drown/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%201.png) !important; }
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCDrown;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='drown/1'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='drown/1'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSDrown2) { // ПЕРЕЛОМЫ 2 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='drown/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%202Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='drown/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%202.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCDrown;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='drown/2'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='drown/2'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSDrown3) { // ПЕРЕЛОМЫ 3 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSDrown3B) {
            let css = `#tr_field [style*='drown/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%203!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='drown/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%203Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSDrown3B) {
            let css = `#tr_field [style*='drown/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_3_33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='drown/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%203.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCDrown;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='drown/3'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='drown/3'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSDrown4) { // ПЕРЕЛОМЫ 4 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSDrown4B) {
            let css = `#tr_field [style*='drown/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%204!!!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='drown/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Переломы%204Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSDrown4B) {
            let css = `#tr_field [style*='drown/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_4_33__33__33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='drown/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%204.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCDrown;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='drown/4'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='drown/4'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    // ГРЯЗЬ
    if (globals.cdSGryaz1) { // ГРЯЗЬ 1 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%201Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%201.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCGryaz;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSGryaz2) { // ГРЯЗЬ 2 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          let css = `#tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%202Р.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%202.png) !important;}
          `
          $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCGryaz;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSGryaz3) { // ГРЯЗЬ 3 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSGryaz3B) {
            let css = `#tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%203!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%203Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSGryaz3B) {
            let css = `#tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Gryaz_3_33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%203.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }
      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCGryaz;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='dirt/base/1/3'], #tr_field [style*='dirt/base/2/3'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/3'], #tr_field [style*='dirt/base/2/3'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
    if (globals.cdSGryaz4) { // ГРЯЗЬ 4 СТАДИЯ
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
          if (globals.cdSGryaz4B) {
            let css = `#tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%204!!!Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Грязь%204Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
          if (globals.cdSGryaz4B) {
            let css = `#tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Gryaz_4_33__33__33.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          } else {
            let css = `#tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%204.png) !important;}
            `
            $('style#customDefectStyle').append(css);
          }
        }
      }
      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCGryaz;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='dirt/base/1/4'], #tr_field [style*='dirt/base/2/4'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='dirt/base/1/4'], #tr_field [style*='dirt/base/2/4'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }

    // КАШЕЛЬ
    if (globals.cdSCough) {
      if (globals.cdSIcon) { // КОД ИКОНОК
        if (globals.cdSRamki) { // ИКОНКИ С РАМКАМИ
            let css = `#tr_field [style*='disease/1']{content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/БолезниР/Кашель%201Р.png) !important;}
            `
            $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// ИКОНКИИ БЕЗ РАМОК
            let css = `#tr_field [style*='disease/1']{content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Кашель%201.png) !important;}
            `
            $('style#customDefectStyle').append(css);
        }
      }

      if (globals.cdSColors) { // КОД ЦВЕТНЫХ КЛЕТОК
        let variable = "";
        let color = globals.cdCCough;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) { // КОД РАМОК
          let css = `#tr_field [style*='disease/1']{
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {// КОД БЕЗ РАМОК
          let css = `#tr_field [style*='disease/1']{
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
      }
    }
  }

  if (globals['cdSDivers']) {
    let cstmDfctDivers = `
        <style id="dfctDivers">
        #tr_field [style*='/cw3/cats/0/costume/7.png'], [style*='/cw3/cats/-1/costume/7.png'] {
        content: url(https://i.ibb.co/dG6mhTj/image.png) !important;
        padding-top: 16px !important;
        padding-left: 1.5px !important;}
        </style>`
    $('head').append(cstmDfctDivers);
  }
  if (globals['cdSPodstilki']) {
        let variable = "";
        let color = globals.cdCPodstilki;
        let opacity = globals.cdOpacity;
        variable = hexToRGBA(color, opacity);
        if (globals.cdSRamki) {
          let css = `#tr_field [style*='/cw3/cats/0/costume/295.png'], [style*='/cw3/cats/-1/costume/295.png'], [style*='/cw3/cats/1/costume/295.png'] {
          outline: 5px solid ${variable};
          outline-offset: -5px;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
        if (!globals.cdSRamki) {
          let css = `#tr_field [style*='/cw3/cats/0/costume/295.png'], [style*='/cw3/cats/-1/costume/295.png'], [style*='/cw3/cats/1/costume/295.png'] {
          background-color: ${variable} !important;
          padding-top: 16px; }`
          $('style#customDefectStyle').append(css);
        }
  }

  // Кыр сосичка
  if (globals['customItems']) {
    let cstmItmStyle = `<style id='cstmItmStyle'></style>`
    $('head').append(cstmItmStyle);

    if (globals['ciSHerb']) {
        let variable = "";
        let color = globals.ciCHerb;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmHerbs = `
        .cage_items[style*='things/13.png'],.cage_items[style*='things/15.png'], .cage_items[style*='things/17.png'], .cage_items[style*='things/19.png'], .cage_items[style*='things/21.png'], .cage_items[style*='things/23.png'], .cage_items[style*='things/25.png'], .cage_items[style*='things/26.png'], .cage_items[style*='things/106.png'], .cage_items[style*='things/108.png'], .cage_items[style*='things/109.png'], .cage_items[style*='things/110.png'], .cage_items[style*='things/111.png'], .cage_items[style*='things/112.png'], .cage_items[style*='things/115.png'], .cage_items[style*='things/116.png'], .cage_items[style*='things/119.png'], .cage_items[style*='things/655.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmHerbs);
    }
    if (globals['ciSMoss']) {
        let variable = "";
        let color = globals.ciCMoss;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmMoss = `
        .cage_items[style*='things/75.png'], .cage_items[style*='things/78.png'], .cage_items[style*='things/95.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmMoss);
    }
    if (globals['ciSWeb']) {
        let variable = "";
        let color = globals.ciCWeb;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmWeb = `
        .cage_items[style*='things/20.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmWeb);
    }
    if (globals['ciSStick']) {
        let variable = "";
        let color = globals.ciCStick;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmSticks = `
        .cage_items[style*='things/565.png'], .cage_items[style*='things/566.png'], .cage_items[style*='things/562.png'], .cage_items[style*='things/563.png'], .cage_items[style*='things/3993.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmSticks);
    }
    if (globals['ciSDust']) { // Отображение Звёздной Пыли
        let variable = "";
        let color = globals.ciCDust;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmDust = `
        .cage_items[style*='things/94.png'], .cage_items[style*='things/385.png'], .cage_items[style*='things/386.png'], .cage_items[style*='things/387.png'], .cage_items[style*='things/388.png'], .cage_items[style*='things/389.png'], .cage_items[style*='things/390.png'], .cage_items[style*='things/391.png'], .cage_items[style*='things/392.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmDust);
    }
    if (globals['ciSMusor']) {
        let variable = "";
        let color = globals.ciCMusor;
        let opacity = globals.ciOpacity;
        variable = hexToRGBA(color, opacity);
      let cstmItmMusor = `
        .cage_items[style*='things/985.png'], .cage_items[style*='things/986.png'], .cage_items[style*='things/987.png'], .cage_items[style*='things/988.png'], .cage_items[style*='things/989.png'] {
        background-color: ${variable} !important;}
        .cage_items[style*='things/44.png'], .cage_items[style*='things/180.png'] {
        background-color: ${variable} !important;}
        .cage_items[style*='things/77.png'] {
        background-color: ${variable} !important;}
        .cage_items[style*='things/7801.png'], .cage_items[style*='things/7802.png'], .cage_items[style*='things/7803.png'], .cage_items[style*='things/7804.png'], .cage_items[style*='things/7805.png'], .cage_items[style*='things/7806.png'] {
        background-color: ${variable} !important;}`
      $('#cstmItmStyle').append(cstmItmMusor);
    }
  }

  // Луковые колечьки


  if (globals.playerCustom) {
    let itemlistwid = globals.cgRotWid;
    itemlistwid = itemlistwid - 12;
    let blockmesswid = globals.cgDeysWid
    blockmesswid = blockmesswid - 20;
    let chatmsghei = globals.cgChatHei;
let formHeight = $('form#chat_form').outerHeight(true);
chatmsghei = chatmsghei - formHeight;
chatmsghei = chatmsghei - 22;
      let css = `
        <style>`
        css += `
          body {
  background-color: ${globals.cgBodyCol};
    font-size: ${globals.cgFontSize}px !important;
  }
      #main_table {
        background: 0 !important;
        }
      #parameter {
        position: absolute;
        top: ${globals.cgParY}px;
        left: ${globals.cgParX}px;
        width: ${globals.cgParWid}px;
        height: ${globals.cgParHei}px;
        background: ${globals.cgParCol} !important;
        color: ${globals.cgParFCol} !important;}
      td#history {
        position: absolute;
        top: ${globals.cgHisY}px;
        left: ${globals.cgHisX}px;
        width: ${globals.cgHisWid}px;
        height: ${globals.cgHisHei}px;
        background: ${globals.cgHisCol} !important;
        color: ${globals.cgHisFCol} !important;
        padding: 6px;
        overflow: auto;}
      td#history a {
        color: ${globals.cgHisFCol} !important;}
      .ui-icon-gripsmall-diagonal-se {
        position: absolute;
        bottom: 1px;
        right: 1px; }
      div#clockContainer {
        position: absolute;
        top: ${globals.cgClockY}px;
        left: ${globals.cgClockX}px;
        width: ${globals.cgClockWid}px;
        height: ${globals.cgClockHei}px;
        font-size: ${globals.clockFontWeight}px !important;
        background-color: ${globals.cgClockCol} !important;
        color:${globals.cgClockFCol} !important;
        font-weight: bolder;
        font-family: Montserrat;
        display: grid;
        align-content: center;}
      div#clockContainer div#clock, div#clockContainer div#date {
        margin-left: 4px;}

      #tr_chat {
        position: absolute;
        top: ${globals.cgChatY}px;
        left: ${globals.cgChatX}px;
        width: ${globals.cgChatWid}px;
        height: ${globals.cgChatHei}px;
        background: ${globals.cgChatCol} !important;
        color: ${globals.cgChatFCol} !important;}
      #chat_form {
        margin: 5px;
        padding: 0;
        width: 100%;}
      span.chat_text {
        width: 80% !important;}
      #volume {
        margin: 2px;
        margin-top: 4px;}
      #chat_msg {
        position: relative;
        width: 100%;
        height: ${chatmsghei}px;}
      #cws_chat_msg {
        position: relative;
        width: 100%;
        height: 30%;}
      .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header {
        background: ${globals.cgChatSliderCol} !important;
        border: ${globals.cgChatSliderBorderCol} 1px solid;}
      /* #volume{
        background-color: var(--BBO) !important;
        border: var(--BRDR) solid 2px !important;
        color: var(--TXT) !important;} */
      .ui-slider .ui-slider-handle {
        background: ${globals.cgChatSliderCol} !important;
        border: ${globals.cgChatSliderBorderCol} !important; }
      .ui-slider {
        background: ${globals.cgChatSliderLineCol} !important;
        border: ${globals.cgChatSliderLineBorder} !important; }

        #msg_send, #mit, #mitok, input#text {
        background-color: ${globals.cgInputCol}!important;
        color: ${globals.cgInputFCol}!important;
        }
      #sky {
        position: absolute;
        top: ${globals.cgSkyY}px;
        left: ${globals.cgSkyX}px; /*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        width: ${globals.cgSkyWid}px;
        height: ${globals.cgSkyHei}px;}

      #tr_tos {
        display: block;
        position: absolute;
        top: ${globals.cgTOSY}px;
        left: ${globals.cgTOSX}px;
        width: ${globals.cgTOSWid}px;
        height: ${globals.cgTOSHei}px;
        background: ${globals.cgTOSCol} !important;
        text-align: center;}

      #tr_actions {
        position: absolute;
        top: ${globals.cgDeysY}px;
        left: ${globals.cgDeysX}px;
        width: ${globals.cgDeysWid}px;
        height: ${globals.cgDeysHei}px;
        background: ${globals.cgDeysCol} !important;
        padding: 6px !important;
        overflow: auto;
        color: ${globals.cgDeysFCol} !important;}
      #tr_actions a {
        color: ${globals.cgDeysFCol} !important;}
      #block_mess {
        position: absolute;
        width: ${blockmesswid}px;
        padding: 0px;
        text-align: center !important;}
      #dein {
        width: 100%;
        height: 100%;
        overflow: auto;}
      #akten {
        width: 100%;
        height: 100%;}

      #family {
        position: absolute;
        top: ${globals.cgRSY}px;
        left: ${globals.cgRSX}px;
        width: ${globals.cgRSWid}px;
        height: ${globals.cgRSHei}px;
        background:${globals.cgRSCol} !important;
        padding: 6px;
        color: ${globals.cgRSFCol} !important;}
      #family a {
        color: ${globals.cgRSFCol} !important;}

      .small {
        display: block;
        position: absolute;
        top: ${globals.cgSmallY}px;
        left: ${globals.cgSmallX}px;
        width: ${globals.cgSmallWid}px;
        height: ${globals.cgSmallHei}px;
        background: ${globals.cgSmallCol} !important;
        font-size: ${globals.cgSmallFW}px;
        text-align: center;
        font-weight: bold;
        color: ${globals.cgSmallFCol} !important;}
      .small a {
        color: ${globals.cgSmallFCol} !important;}
      span.small ~ br, span.other_cats_list ~ br {
        display: none;}

      span.other_cats_list {
        position: absolute;
        top: ${globals.cgOCLY}px;
        left: ${globals.cgOCLX}px;
        color: var(--TXT)}

      #tr_mouth {
        position: absolute;
        top: ${globals.cgRotY}px;
        left: ${globals.cgRotX}px;
        width: ${globals.cgRotWid}px;
        height: ${globals.cgRotHei}px;
        background: ${globals.cgRotCol} !important;
        padding: 6px !important;
        overflow: auto;
        color: ${globals.cgRotFCol} !important;}
      #tr_mouth a {
        color: ${globals.cgRotFCol} !important;}

      #itemList {
        width: ${itemlistwid}px;
        }

      #app>p:not([id])::before {
        content: 'Тёмные баллы: ';
        font-weight: bold;
      }

      #app>p:not([id]) {
        display: block;
        position: absolute;
        top: ${globals.cgTBY}px;
        left: ${globals.cgTBX}px;
        width: ${globals.cgTBWid}px;
        height: ${globals.cgTBHei}px;
        background: ${globals.cgTBCol} !important;
        text-align: center;
        color: ${globals.cgTBFCol} !important;}
      #cages_div {
      opacity: 1 !important;
      }
      #app p:not([id])>b {
        display: none;
      }
      a#parameters-alert {
      position: absolute;
      top: ${globals.cgParAlertY}px;
      left: ${globals.cgParAlertX}px;
      color: ${globals.cgParAlertFCol}
      }

      `
      if (globals.cgBorders) {
        css+= `td#parameter, tr#tr_tos, #sky, div#clockContainer, td#history, td#family, span.small, tr#tr_chat, tr#tr_actions, tr#tr_mouth, #location {
       border: ${globals.cgBorderWid}px ${globals.cgBorderType} ${globals.cgBorderCol} !important;}`
      }
      if (globals.cgTbBorder) {
        css+= `#app>p:not([id]) {
        border: ${globals.cgBorderWid}px ${globals.cgBorderType} ${globals.cgBorderCol} !important;}`
      }
      if (globals.cgIsBorderRad) {
        css+= `td#parameter, tr#tr_tos, #sky, div#clockContainer, td#history, td#family, span.small, tr#tr_chat, tr#tr_actions, tr#tr_mouth {
        border-radius: ${globals.cgBorderRad}px;}`
      }
      if (globals.cgIsTBBorderRad) {
        css+= `#app>p:not([id]) {
        border-radius: ${globals.cgBorderRad}px;}`
      }
      if (globals.cgIsLocBorderRad) {
        css+= `#location {
        border-radius: ${globals.cgBorderRad}px;}`
      }
      if (globals.cgInputBorders) {
        css+= `#msg_send, #mit, #mitok, input#text {
        border: ${globals.cgBorderWid}px ${globals.cgBorderType} ${globals.cgBorderCol} !important;}`
      }
      if (globals.cgInfoH2DelMargins) {
        css+= `tr#tr_info td table#info_main tbody tr td h2 {
        margin: 0;
        }`
      }
      if (globals.cgDelRSH2) {
        css+= `table#info_main tbody tr td#family h2 {display: none;}`
      }
      if (globals.cgDelHisH2) {
        css+= `table#info_main tbody tr td#history h2 {display: none;}`
      }
      if (globals.cgDelParH2) {
    css+= `table#info_main tbody tr td#parameter h2 a:first-of-type {display: none;}`
      }
      if (1 == 1) {
        css+= `tr#tr_info td table#info_main tbody tr td h2 {font-size: ${globals.cgInfoH2FontSize}px;}`
      }
      if (globals.cgSeparateLocation) {
        css+= `
      #location {
        display: block;
        position: fixed;
        top: ${globals.cgLocY}px;
        left: ${globals.cgLocX}px;
        width: ${globals.cgLocWid}px;
        height: ${globals.cgLocHei}px;
        background: ${globals.cgLocCol} !important;
        font-size: ${globals.cgLocFW}px;
        text-align: center;
        font-weight: bold;
        color: ${globals.cgLocFCol} !important;}

      #history_block div {
        font-size: 0;
        background-color: transparent !important;}`
      }
  if (globals.cgDeleteScrolls) {
  css+= `  ::-webkit-scrollbar {
    width: 18px;
}

::-webkit-scrollbar-track {
    background: transparent !important;
}

::-webkit-scrollbar-thumb {
    background: transparent !important;
}

::-webkit-scrollbar-corner {
    background: transparent !important;
}`
  }
      if (globals.cgIsFieldFix) {
    css+= `tr#tr_field {
    position: absolute;
    top: ${globals.cgFieldY}px;
    left: ${globals.cgFieldX}px;}
    `
  }

      css+= `</style>`
      $('head').append(css);
  }

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
    let butterflyCss = `
        <style>
        /* ОБЫЧНАЯ */
        img[src*='things/990.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/990.png'] {
        border: none; }

        div#itemList>div>img[src*='things/990.png'] {
        border: none; }

        /* КРАСИВАЯ */
        img[src*='things/991.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/991.png'] {
        border: none; }

        div#itemList>div>img[src*='things/991.png'] {
        border: none; }

        /* РЕДКАЯ */
        img[src*='things/992.png'] {
        border: 15px solid rgba(255, 170, 0, .6); }

        ol.mouth>li>img[src*='things/992.png'] {
        border: none; }

        div#itemList>div>img[src*='things/992.png'] {
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
  const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/COSTUMES/catwarScript_Costumes.css?raw=true';
  $.ajax({
    url: githubUrl,
    dataType: 'text',
    success: function(data) {
      $('head').append('<style>' + data + '</style>');
    }});})();
    if (globals["watermarkCostumes"]) {
        (function() {
  const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/COSTUMES/catwarScript_CostumesW.css?raw=true';
  $.ajax({
    url: githubUrl,
    dataType: 'text',
    success: function(data) {
      $('head').append('<style>' + data + '</style>');
    }});})();}

    if (globals["clLakeUniverse"]) {
        (function() { // ОБЫЧНЫЕ КОСТЮМЫ ОЗЁРКА
            const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/OV/costumes.css?raw=true';
            $.ajax({
                url: githubUrl,
                dataType: 'text',
                success: function(data) {
                    $('head').append('<style>' + data + '</style>');
                }});})();
        if (globals["clMemeCostumes"]) {
            (function() { // МЕМНЫЕ КОСТЮМЫ ОЗЁРКА
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/OV/costumesMEME.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
            if (globals["watermarkCostumes"]) {
                (function() { // ВАТЕРМАРКИ ДЛЯ МЕМНЫХ КОСТЮМОВ ОЗЁРКА
                    const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/OV/watermarkMEME.css?raw=true';
                    $.ajax({
                        url: githubUrl,
                        dataType: 'text',
                        success: function(data) {
                            $('head').append('<style>' + data + '</style>');
                        }});})();
            }
        }
        if (globals["watermarkCostumes"]) {
            (function() { // ВАТЕРМАРКИ ДЛЯ КОСТЮМОВ ОЗЁРКА
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/OV/watermark.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
        }
    }
    if (globals["clSeaUniverse"]) {
        (function() { // ОБЫЧНЫЕ КОСТЮМЫ МОРСКАЯ
            const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/MV/costumes.css?raw=true';
            $.ajax({
                url: githubUrl,
                dataType: 'text',
                success: function(data) {
                    $('head').append('<style>' + data + '</style>');
                }});})();
        if (globals["clMemeCostumes"]) {
            (function() { // МЕМНЫЕ КОСТЮМЫ МОРСКАЯ
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/MV/costumesMEME.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
            if (globals["watermarkCostumes"]) {
                (function() { // ВАТЕРМАРКИ ДЛЯ МЕМНЫХ КОСТЮМОВ МОРСКАЯ
                    const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/MV/watermarkMEME.css?raw=true';
                    $.ajax({
                        url: githubUrl,
                        dataType: 'text',
                        success: function(data) {
                            $('head').append('<style>' + data + '</style>');
                        }});})();
            }
        }
        if (globals["watermarkCostumes"]) {
            (function() { // ВАТЕРМАРКИ ДЛЯ КОСТЮМОВ МОРСКАЯ
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/MV/watermark.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
        }
    }
    if (globals["clCreatorUniverse"]) {
        (function() { // ОБЫЧНЫЕ КОСТЮМЫ ТВОРЦЫ
            const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/VT/costumes.css?raw=true';
            $.ajax({
                url: githubUrl,
                dataType: 'text',
                success: function(data) {
                    $('head').append('<style>' + data + '</style>');
                }});})();
        if (globals["clMemeCostumes"]) {
            (function() { // МЕМНЫЕ КОСТЮМЫ ТВОРЦЫ
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/VT/costumesMEME.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
            if (globals["watermarkCostumes"]) {
                (function() { // ВАТЕРМАРКИ ДЛЯ МЕМНЫХ КОСТЮМОВ ТВОРЦЫ
                    const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/VT/watermarkMEME.css?raw=true';
                    $.ajax({
                        url: githubUrl,
                        dataType: 'text',
                        success: function(data) {
                            $('head').append('<style>' + data + '</style>');
                        }});})();
            }
        }
        if (globals["watermarkCostumes"]) {
            (function() { // ВАТЕРМАРКИ ДЛЯ КОСТЮМОВ ТВОРЦЫ
                const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/VT/watermark.css?raw=true';
                $.ajax({
                    url: githubUrl,
                    dataType: 'text',
                    success: function(data) {
                        $('head').append('<style>' + data + '</style>');
                    }});})();
        }
    }
  }

    (function() {
        const githubUrl = 'https://raw.githubusercontent.com/CatWarScript/costumes/main/MERO/costumes.css?raw=true';
        $.ajax({
            url: githubUrl,
            dataType: 'text',
            success: function(data) {
                $('head').append('<style>' + data + '</style>');
            }});})();

  if (globals.clRemoveAllTongues) {
    $('head').append(`<style>div[style*=tongue]{display: none;}</style>`)
  }
  if (globals.clRemoveAllCostumes) {
    $('head').append(`<style>div[style*=costume]{display: none;}</style>`)
  }

  if (globals.shortFightLog) {
    $(document).ready(function () {
      let prevLog = '';
      let prevClass = '';
      let hitCount = 1;
      const fightLogObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN' && !$(node).hasClass('cws-hit-count')) {
                const thisLog = $(node).html();
                const thisClass = $(node).attr('class');
                if (thisLog === prevLog && thisClass === prevClass) {
                  const $previousSpan = $(node).prev('span:not(.cws-hit-count)');
                  if ($previousSpan.length > 0) {
                    $previousSpan.remove();
                  }
                  $(node).remove();
                  $('#fightLog > br:first-child').remove();
                  const $hitCountSpan = $('.cws-hit-count').first();
                  hitCount++;
                  $hitCountSpan.attr('count', hitCount);
                  $hitCountSpan.html(' (х' + hitCount + ')');
                } else {
                  $('<span class="cws-hit-count ' + thisClass + '" count=1></span>').insertAfter($(node));
                  hitCount = 1;
                }
                prevLog = thisLog;
                prevClass = thisClass;
              }
            });
          }
        });
      });
      fightLogObserver.observe($('#fightLog')[0], { childList: true });
    });
  }

  if (globals.smellTimer) {
    $(document).ready(function () {
      $('.small').first().append(` | Нюх через: <span id="cws_smell_timer" value=0>0 с</span>`);

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
        } else if (globals.smellTimer && !rang) {
          playAudio(globals.smellTimerHref, globals.smellTimerVol);
          rang = true;
        }
      }
      setInterval(smellTimerTick, 1000);

      let firstClick = setInterval(function () {
         if ($('#smell_icon').length) {
           firstNote = $('#error').html();
           $('#smell_icon').click();
           clearInterval(firstClick);
         }
       }, 500);

      const deinElement = $('#dein');
      const smell_timer = {
        "0": 3600,
        "1": 3600,
        "2": 3600,
        "3": 3600,
        "4": 1800,
        "5": 1200,
        "6": 900,
        "7": 720,
        "8": 600,
        "9": 0
      };

       const observer = new MutationObserver(mutations => {
         mutations.forEach(mutation => {
           if (mutation.type === 'childList') {
             if (deinElement.find('a[data-id=14]').length > 0) {
               $('#cws_smell_timer').attr('value', 0);
               $('#cws_smell_timer').html('0 с');
             }
           }
         });
       });

       observer.observe(deinElement[0], { childList: true, subtree: true });

      const errorObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            let html = $('#error').html();
            if (html && html.indexOf('Следующее обнюхивание') !== -1) {
              let text = html.replace('Следующее обнюхивание будет доступно через ', '');
              let smellMin = (text.match(/(\d+) мин/g) == null) ? 0 : parseInt(text.match(/(\d+) мин/g)[0].replace(/\D/g, ''));
              let smellSec = parseInt(text.match(/(\d+) с/g)[0].replace(/\D/g, ''));
              let totalSec = smellMin * 60 + smellSec;
              $('#cws_smell_timer').attr('value', totalSec);
              $('#cws_smell_timer').html(smellMin + ' мин ' + smellSec + ' с');
              if (firstNote !== "") {
                $('#error').html(firstNote);
                firstNote = "";
              }
            } else if (html.indexOf('Время прошло, вы можете обнюхать землю или любого игрока') !== -1) {
              $('#cws_smell_timer').attr('value', 0);
              $('#cws_smell_timer').html('0 с');
              if (firstNote !== "") {
                $('#error').html(firstNote);
                firstNote = "";
              }
            } else if (html.indexOf('Час уже прошёл') !== -1 && firstNote !== "") {
              $('#error').html(firstNote);
              firstNote = "";
            }
          }
        });
      });
      errorObserver.observe($('#error')[0], { childList: true, subtree: true, characterData: true });

      $(document).on('click', 'a[data-id=13], a[data-id=14]', function () {
        let smell_lv = $('#smell b').text();
        let smell_time = smell_timer[smell_lv];
        let str = '';
        let mi = smell_time / 60;
        let se = smell_time - mi * 60;
        str += (mi) ? mi + ' мин ' : '';
        str += se + ' с';
        $('#cws_smell_timer').attr('value', smell_time);
        $('#cws_smell_timer').html(str);
        rang = true;
      });
       let checkInterval = setInterval(function() {
         if ($('a[data-id=14]').length) {
           $('#cws_smell_timer').attr('value', 0);
           $('#cws_smell_timer').html('0 с');
           clearInterval(checkInterval);
         }
       }, 1000);
    });
  }

if (globals.fightWarning) {
  let last_note, noteFirst = true;
  const targetNode = document.getElementById('ist');
  const config = { subtree: true, childList: true };
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        last_note = $(targetNode.innerHTML.split('.')).get(-2);
        if (last_note !== undefined) {
          if (last_note.indexOf("в боевую стойку, поскольку на меня напал") !== -1 && !noteFirst) {
            playAudio(globals.fightWarningHref, globals.fightWarningVol);
          }
          noteFirst = false;
        }
      }
    }
  });
  observer.observe(targetNode, config);
}
  if (globals.eatenNote) {
    const targetNode = document.getElementById('block_mess');
    let soundPlayed = false;
    let intervalId;
    let titleChange = false;

    function checkForNotification() {
      if (targetNode.innerHTML.indexOf("Вы не сможете выбраться") !== -1 ||
          targetNode.innerHTML.indexOf("Вас кто-то поднял!") !== -1) {
        if (!soundPlayed) {
          $('title').text("Во рту / Поднят!");
          let audio1 = audioGlobal;
          audio1.src = globals.smellTimerHref;
          audio1.volume = globals.eatenNoteVol;
          audio1.play();
          soundPlayed = true;
          titleChange = true;
        } else {

        }
      } else {
        if (titleChange) {
          $('title').text('Игровая / CatWar');
          titleChange = false;
        } else {
          // 7
        }
        soundPlayed = false;
        clearInterval(intervalId);
        intervalId = setInterval(checkForNotification, 1000);
      }
    }

    intervalId = setInterval(checkForNotification, 1000);
  }


    if (globals["diverSiren"]) {
      $(document).ready(function() {
        let sirenPlaying = false;
        let sirenSound = null;
        let previousWidth = 0;
        let observer = null;
        let sirenTime = globals.diverSirenMinutes * 3;
        sirenTime = 150 - sirenTime;
        console.log(sirenTime)
        function playSiren() {
          if (sirenPlaying) {
            return;
          }
          sirenSound = new Audio(globals.diverSirenHref);
          sirenSound.volume = globals.diverSirenVol;
          sirenSound.onloadedmetadata = () => {
            sirenSound.play();
            sirenPlaying = true;
            sirenSound.onended = () => {
              sirenPlaying = false;
            };
          };
        }
        function startObserver() {
          const greenBar = $('#dream_table .parameter td:first-child');
          previousWidth = parseFloat(greenBar.css('width'));
          observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const newWidth = parseFloat(greenBar.css('width'));
                if (newWidth <= sirenTime && newWidth < previousWidth && !sirenPlaying) {
                  playSiren();
                }
                if (newWidth > previousWidth) {
                  sirenPlaying = false;
                }
                previousWidth = newWidth;
              }
            });
          });
          observer.observe(greenBar[0], { attributes: true });
        }
        function stopObserver() {
          if (observer) {
            observer.disconnect();
          }
          if (sirenPlaying) {
            sirenSound.pause();
            sirenPlaying = false;
          }
        }
        const sirenHtml = `
        <div id="sblock">
          <span id="sheader">Нырялочки</span>
          <button id="startButton" class="sirenButtons">Я иду нырять!</button><br>
          <button id="stopButton" class="sirenButtons">Я нанырялся</button><br>
        </div>`
          const cssS = `
<style>
button.sirenButtons {
background-color: var(--cwsc-inpt-1);
color: var(--cwsc-txt-4) !important;
border: 2px solid var(--cwsc-brdr-3);
border-radius: 3px !important;
width: 100px;
padding: 2px 5px;
margin: 0px 0px;
text-decoration: none;
font-size: 13px; }

button.sirenButtons:hover {
border: 2px solid var(--cwsc-brdr-2) !important; }

div#sblock {
position: absolute;
top: ${globals.dsY}px;
left: ${globals.dsX}px;
height: 80px;
width: 130px;
background-color: var(--cwsc-bckg-3);
border: 3px solid var(--cwsc-brdr-1) !important;
border-radius: 7px !important;
z-index: 50;
font-family: Montserrat;
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
text-align: center;}

div#sblock button {
margin-top: 4px;}

span#sheader {
background-color: var(--cwsc-bckg-1);
border: 1px solid var(--cwsc-brdr-1);
color: var(--cwsc-txt-4);
height: 23px;
display: grid;
justify-content: center;
align-content: center;}
</style>`
$('head').append(cssS);
$('body').on('click', '#startButton', function() {
console.log('startObserver called');
startObserver();
$('#sblock').animate({ backgroundColor: '#65754b' }, 500);
});

$('body').on('click', '#stopButton', function() {
console.log('stopObserver called');
stopObserver();
$('#sblock').animate({ backgroundColor: '#994e4e' }, 500);
});
        $('body').append(sirenHtml);
    $("#sblock").draggable({
      containment: "document",
      handle: "span#sheader",
      drag: function () {
        let offset = $(this).offset();
        let xPos = offset.left;
        let yPos = offset.top;
        setSettings('dsX', offset.left);
        setSettings('dsY', offset.top);
      }
    });
      });
    }

  if (globals['treeMap']) {
    if (globals.tmResetNote) {
      let lastNote, noteFirst = true;
      const targetNode = document.getElementById('ist');
      const config = { subtree: true, childList: true };
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            lastNote = $(targetNode.innerHTML.split('.')).get(-2); // Последняя запись в истории
            if (lastNote !== undefined) {
              if (/Услышала? оглушительн/.test(lastNote) && !noteFirst) {
                console.log("Обновилась лазательная локация");
                playAudio(globals.tmResetSource, globals.tmResetVolume);
              }
              noteFirst = false; // История была уже прочитана 1 раз, и страница не только что загрузилась
            }
          }
        }
      });
      observer.observe(targetNode, config);
    }

    if (globals.tmShowVolume) {
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

    $('#app').ready(function () {
      let tmSvgMinus = `<svg id="svgPlus" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 8.4666666 8.466668" version="1.1" id="svg1" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" sodipodi:docname="Минус.svg">
      <sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:document-units="mm" inkscape:zoom="20.377441" inkscape:cx="15.998084" inkscape:cy="15.973547" inkscape:window-width="1680" inkscape:window-height="987" inkscape:window-x="1672" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="layer1"/>
      <defs id="defs1">
      <inkscape:path-effect effect="fillet_chamfer" id="path-effect4" is_visible="true" lpeversion="1" nodesatellites_param="F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1" radius="1" unit="px" method="auto" mode="F" chamfer_steps="1" flexible="false" use_knot_distance="true" apply_no_radius="true" apply_with_radius="true" only_selected="false" hide_knots="false"/>
      <inkscape:path-effect effect="fillet_chamfer" id="path-effect2" is_visible="true" lpeversion="1" nodesatellites_param="F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1" radius="1" unit="px" method="auto" mode="F" chamfer_steps="1" flexible="false" use_knot_distance="true" apply_no_radius="true" apply_with_radius="true" only_selected="false" hide_knots="false"/>
      </defs>
      <g inkscape:label="Слой 1" inkscape:groupmode="layer" id="layer1">
      <path d="M 7.7079536,4.7312995 H 4.9921105 A 0.26458333,0.26458333 135 0 0 4.7275272,4.9958828 V 7.8591123 A 0.26458333,0.26458333 135 0 1 4.4629439,8.1236956 H 4.0037225 A 0.26458333,0.26458333 45 0 1 3.7391392,7.8591123 V 4.9958828 A 0.26458333,0.26458333 45 0 0 3.4745559,4.7312995 H 0.75871306 A 0.26458333,0.26458333 45 0 1 0.49412973,4.4667162 V 3.9999504 A 0.26458333,0.26458333 135 0 1 0.75871306,3.7353671 H 3.4745559 A 0.26458333,0.26458333 135 0 0 3.7391392,3.4707838 V 0.60755435 A 0.26458333,0.26458333 135 0 1 4.0037225,0.34297102 H 4.4629439 A 0.26458333,0.26458333 45 0 1 4.7275272,0.60755435 V 3.4707838 A 0.26458333,0.26458333 45 0 0 4.9921105,3.7353671 H 7.7079536 A 0.26458333,0.26458333 45 0 1 7.9725369,3.9999504 V 4.4667162 A 0.26458333,0.26458333 135 0 1 7.7079536,4.7312995 Z" id="text2" style="font-size:3.175px;display:none;fill:#c9bdb0;fill-opacity:1;stroke:#220a00;stroke-width:0;stroke-linecap:round;stroke-linejoin:round" aria-label="+" inkscape:path-effect="#path-effect2" inkscape:original-d="M 7.9725369,4.7312995 H 4.7275272 V 8.1236956 H 3.7391392 V 4.7312995 H 0.49412973 V 3.7353671 H 3.7391392 V 0.34297102 h 0.988388 V 3.7353671 h 3.2450097 z"/>
      <path d="M 7.7079536,4.7312995 H 0.75871306 A 0.26458333,0.26458333 45 0 1 0.49412973,4.4667162 l 0,-0.4667658 A 0.26458333,0.26458333 135 0 1 0.75871306,3.7353671 l 6.94924054,0 A 0.26458333,0.26458333 45 0 1 7.9725369,3.9999504 V 4.4667162 A 0.26458333,0.26458333 135 0 1 7.7079536,4.7312995 Z" id="path2" style="font-size:3.175px;display:inline;fill:#c9bdb0;fill-opacity:1;stroke:#220a00;stroke-width:0;stroke-linecap:round;stroke-linejoin:round" aria-label="+" inkscape:path-effect="#path-effect4" inkscape:original-d="M 7.9725369,4.7312995 H 0.49412973 V 3.7353671 H 7.9725369 Z" sodipodi:nodetypes="ccccc"/>
      </g>
      </svg>`
            let tmSvgPlus = `<svg id="svgMinus" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"; xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"; xmlns="http://www.w3.org/2000/svg"; xmlns:svg="http://www.w3.org/2000/svg"; width="32" height="32" viewBox="0 0 8.4666666 8.466668" version="1.1" id="svg1" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" sodipodi:docname="Плюс.svg">
      <sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:document-units="mm" inkscape:zoom="20.377441" inkscape:cx="15.998084" inkscape:cy="15.973547" inkscape:window-width="1680" inkscape:window-height="987" inkscape:window-x="1672" inkscape:window-y="-8" inkscape:window-maximized="1" inkscape:current-layer="layer1"/>
      <defs id="defs1">
      <inkscape:path-effect effect="fillet_chamfer" id="path-effect4" is_visible="true" lpeversion="1" nodesatellites_param="F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1" radius="1" unit="px" method="auto" mode="F" chamfer_steps="1" flexible="false" use_knot_distance="true" apply_no_radius="true" apply_with_radius="true" only_selected="false" hide_knots="false"/>
      <inkscape:path-effect effect="fillet_chamfer" id="path-effect2" is_visible="true" lpeversion="1" nodesatellites_param="F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1 @ F,0,0,1,0,0.26458333,0,1" radius="1" unit="px" method="auto" mode="F" chamfer_steps="1" flexible="false" use_knot_distance="true" apply_no_radius="true" apply_with_radius="true" only_selected="false" hide_knots="false"/>
      </defs>
      <g inkscape:label="Слой 1" inkscape:groupmode="layer" id="layer1">
      <path d="M 7.7079536,4.7312995 H 4.9921105 A 0.26458333,0.26458333 135 0 0 4.7275272,4.9958828 V 7.8591123 A 0.26458333,0.26458333 135 0 1 4.4629439,8.1236956 H 4.0037225 A 0.26458333,0.26458333 45 0 1 3.7391392,7.8591123 V 4.9958828 A 0.26458333,0.26458333 45 0 0 3.4745559,4.7312995 H 0.75871306 A 0.26458333,0.26458333 45 0 1 0.49412973,4.4667162 V 3.9999504 A 0.26458333,0.26458333 135 0 1 0.75871306,3.7353671 H 3.4745559 A 0.26458333,0.26458333 135 0 0 3.7391392,3.4707838 V 0.60755435 A 0.26458333,0.26458333 135 0 1 4.0037225,0.34297102 H 4.4629439 A 0.26458333,0.26458333 45 0 1 4.7275272,0.60755435 V 3.4707838 A 0.26458333,0.26458333 45 0 0 4.9921105,3.7353671 H 7.7079536 A 0.26458333,0.26458333 45 0 1 7.9725369,3.9999504 V 4.4667162 A 0.26458333,0.26458333 135 0 1 7.7079536,4.7312995 Z" id="text2" style="font-size:3.175px;display:inline;fill:#c9bdb0;fill-opacity:1;stroke:#220a00;stroke-width:0;stroke-linecap:round;stroke-linejoin:round" aria-label="+" inkscape:path-effect="#path-effect2" inkscape:original-d="M 7.9725369,4.7312995 H 4.7275272 V 8.1236956 H 3.7391392 V 4.7312995 H 0.49412973 V 3.7353671 H 3.7391392 V 0.34297102 h 0.988388 V 3.7353671 h 3.2450097 z"/>
      <path d="M 7.7079536,4.7312995 H 0.75871306 A 0.26458333,0.26458333 45 0 1 0.49412973,4.4667162 l 0,-0.4667658 A 0.26458333,0.26458333 135 0 1 0.75871306,3.7353671 l 6.94924054,0 A 0.26458333,0.26458333 45 0 1 7.9725369,3.9999504 V 4.4667162 A 0.26458333,0.26458333 135 0 1 7.7079536,4.7312995 Z" id="path2" style="font-size:3.175px;display:inline;fill:#c9bdb0;fill-opacity:1;stroke:#220a00;stroke-width:0;stroke-linecap:round;stroke-linejoin:round" aria-label="+" inkscape:path-effect="#path-effect4" inkscape:original-d="M 7.9725369,4.7312995 H 0.49412973 V 3.7353671 H 7.9725369 Z" sodipodi:nodetypes="ccccc"/>
      </g>
      </svg>`
      let tmHtml = `
       <div id="tmBlock">
        <div id="tmHeader"><table><tbody><tr><td><p>Минное поле v2</p></td><td><span id="tmHeaderPlusMinus">${tmSvgPlus}${tmSvgMinus}</span></td></tr></tbody></table></div>
       </div>`

      if (1==1) {
       $('body').append(tmHtml);
      }

      if (globals.tmVariant == 0) {
        let tmBlockThings = `
              <div id="blockThings">
        <span class="tmThings"> <!-- КНОПКА 0 -->
          <input type="radio" checked name="tmThing" class="tmThingList" id="tmThing0" value="0" mark="tmThingSafe">
          <label for="tmThing0"><span class="tmThingValues">[0]</span> Без звука</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 1 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing1" value="1" mark="tmThingSafe">
          <label for="tmThing1"><span class="tmThingValues">[1]</span> Едва различимый звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 2 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing2" value="2" mark="tmThingSafe">
          <label for="tmThing2"><span class="tmThingValues">[2]</span> Тихий звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 3 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing3" value="3" mark="tmThingSafe">
          <label for="tmThing3"><span class="tmThingValues">[3]</span> Приглушённый звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 4 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing4" value="4" mark="tmThingSafe">
          <label for="tmThing4"><span class="tmThingValues">[4]</span> Громкий звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 5 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing5" value="5" mark="tmThingSafe">
          <label for="tmThing5"><span class="tmThingValues">[5]</span> Очень громкий звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 6 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing6" value="6" mark="tmThingSafe">
          <label for="tmThing6"><span class="tmThingValues">[6]</span> Очень громкий звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА 7 -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThing7" value="7" mark="tmThingSafe">
          <label for="tmThing7"><span class="tmThingValues">[7]</span> Очень громкий звук</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА ОПАСНАЯ КЛЕТКА -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThingX" value="X" mark="tmThingUnsafe">
          <label for="tmThingX"><span class="tmThingValues">[X]</span> Опасная клетка</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА БЕЗОПАСНАЯ КЛЕТКА -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThingOK" value="" mark="tmThingSafe">
          <label for="tmThingOK"><span class="tmThingValues">[Б]</span> Безопасная клетка</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА ПЕРЕХОДА -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThingP" value="П" mark="tmThingPerehod">
          <label for="tmThingP"><span class="tmThingValues">[П]</span> Клетка перехода</label>
        </span><br>
        <span class="tmThings"> <!-- КНОПКА ОЧИСТКИ -->
          <input type="radio" name="tmThing" class="tmThingList" id="tmThingC" value="" mark="">
          <label for="tmThingC"><span class="tmThingValues">[О]</span> Очистить</label>
        </span><br>
      </div>`

        if (1==1) {
         $('#tmBlock').append(tmBlockThings);
        }

      }
      if (globals.tmVariant != 0) {
        let tmBlockThings = `
        <div id="blockThings">
        <table><tbody><tr><td>
          <span class="tmThings"> <!-- КНОПКА 0 -->
            <input type="radio" checked name="tmThing" class="tmThingList" id="tmThing0" value="0" mark="tmThingSafe">
            <label for="tmThing0"><span class="tmThingValues">[0]</span><small class="tmThingValue"> Без звука</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 1 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing1" value="1" mark="tmThingSafe">
            <label for="tmThing1"><span class="tmThingValues">[1]</span><small class="tmThingValue"> Едва различимый звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 2 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing2" value="2" mark="tmThingSafe">
            <label for="tmThing2"><span class="tmThingValues">[2]</span><small class="tmThingValue"> Тихий звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 3 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing3" value="3" mark="tmThingSafe">
            <label for="tmThing3"><span class="tmThingValues">[3]</span><small class="tmThingValue"> Приглушённый звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 4 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing4" value="4" mark="tmThingSafe">
            <label for="tmThing4"><span class="tmThingValues">[4]</span><small class="tmThingValue"> Громкий звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 5 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing5" value="5" mark="tmThingSafe">
            <label for="tmThing5"><span class="tmThingValues">[5]</span><small class="tmThingValue"> Очень громкий звук</small></label>
          </span><br>

          </td><td>

          <span class="tmThings"> <!-- КНОПКА 6 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing6" value="6" mark="tmThingSafe">
            <label for="tmThing6"><span class="tmThingValues">[6]</span><small class="tmThingValue"> Очень громкий звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА 7 -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThing7" value="7" mark="tmThingSafe">
            <label for="tmThing7"><span class="tmThingValues">[7]</span><small class="tmThingValue"> Очень громкий звук</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА ОПАСНАЯ КЛЕТКА -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThingX" value="X" mark="tmThingUnsafe">
            <label for="tmThingX"><span class="tmThingValues">[X]</span><small class="tmThingValue"> Опасная клетка</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА БЕЗОПАСНАЯ КЛЕТКА -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThingOK" value="" mark="tmThingSafe">
            <label for="tmThingOK"><span class="tmThingValues">[Б]</span><small class="tmThingValue"> Безопасная клетка</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА ПЕРЕХОДА -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThingP" value="П" mark="tmThingPerehod">
            <label for="tmThingP"><span class="tmThingValues">[П]</span><small class="tmThingValue"> Клетка перехода</small></label>
          </span><br>
          <span class="tmThings"> <!-- КНОПКА ОЧИСТКИ -->
            <input type="radio" name="tmThing" class="tmThingList" id="tmThingC" value="" mark="">
            <label for="tmThingC"><span class="tmThingValues">[О]</span><small class="tmThingValue"> Очистить клетку</small></label>
          </span><br>

          <tr></tbody></table>
        </div>`

        if (1==1) {
         $('#tmBlock').append(tmBlockThings);
        }
      }

      // КНОПКА ПОКАЗАТЬ НА ПОЛЕ
      let tmShowMapSpan = `
      <div id="tmShowMap"><input class="tmBTNS" id="tmBTNSShowMap" type="checkbox"${globals.tmBTNSShowMap?' checked':''}><label for="tmBTNSShowMap">Переносить на игровую</label></div>`

      if (1==1) {
       $('#tmBlock').append(tmShowMapSpan);
      }

      // БЛОК ДЛЯ ПАПОК
      let tmFolderBlock = `
      <div id="tmFolderBlock"></div>`

      if (1==1) {
       $('#tmBlock').append(tmFolderBlock);
      }
      // САМИ ПАПКИ
      for (let i = 0; i <= 3; i++) {
        if (globals.tmTecFolStatus[i] || !i) {
          $('#tmFolderBlock').append(`<input type="radio" name="tmFolder" class="tmFolders" value="${i}" id="tmFolder${i}">
          <label class="tmFolderLabel" for="tmFolder${i}">${globals.tmTecFolNames[i]}</label>`);
        }
      }

      let tmLocBlock = `
      <div id="tmLocBlock"></div>`

      if (1==1) {
       $('#tmBlock').append(tmLocBlock);
      }
      for (let i = 0; i <= 5; i++) {
        if (globals.tmTecLocStatus[i] || !i) {
          $('#tmLocBlock').append(`<input type="radio" name="tmLoc" class="tmLocs" value="${i}" id="tmLoc${i}">
          <label class="tmLocLabel" folder="0" for="tmLoc${i}">${globals.tmTecLocNames[i]}</label>`);
        }
      }

      for (let i = 6; i <= 23; i++) {
        let k = parseInt(i / 6.0);
        if (globals.tmTecLocStatus[i] && globals.tmTecFolStatus[k]) {
          $('#tmLocBlock').append(`<input type="radio" name="tmLoc" class="tmLocs" value="${i}" id="tmLoc${i}">
          <label class="tmLocLabel" style="display:none;" folder="${k}" for="tmLoc${i}">${globals.tmTecLocNames[i]}</label>`);
        }
      }

      const tmFieldDef = `<tbody><tr><td class="tmThingSafe"></td><td class="tmThingSafe"></td><td class="tmThingSafe"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody>`;
      let tmMaps = getSettings('tmMaps') === null ? [tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef, tmFieldDef] : JSON.parse(getSettings('tmMaps'));

      let tmFieldBlock = `
      <div id="blockField"></div>`

      if (1==1) {
       $('#tmBlock').append(tmFieldBlock);
      }
      // ЗАГРУЖЕННЫЕ КАРТЫ ЛОКАЦИЙ
      for (let i = 0; i <= 23; i++) {
        if (globals.tmTecLocStatus[i]) {
          if (i !== globals.tmSelectedMap) {
            $('#blockField').append(`<table class="tmTable" style="display:none;" page="${i}">${tmMaps[i]}</table>`);
          } else {
            $('#blockField').append(`<table class="tmTable" page="${globals.tmSelectedMap}">${tmMaps[globals.tmSelectedMap]}</table>`);
          }
        }
      }

      // КНОПКА ОЧИСТКИ ЛОКАЦИИ
      let tmClearButton = `
      <button id="tmClearButton">Очистить всё поле</button>`

      if (1==1) {
       $('#tmBlock').append(tmClearButton);
      }

      let tmAllCSS = `
      <style>
        .tmpmFolded {display: none;}
        div#tmBlock {
      -webkit-touch-callout: none;
        -webkit-user-select: none;
         -khtml-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none; }
      </style>`

      if (1==1) {
       $('head').append(tmAllCSS);
      }

      if (globals['tmVariant'] == 0) { // ВИНТАЖНЫЙ ВАРИАНТ
        let tmCSS = `
        <style>
      div#tmBlock {
      overflow: hidden;
      position: absolute;
      width: 270px;
      top: ${globals.tmTecPosY}px;
      left: ${globals.tmTecPosX}px;
      background-color: var(--cwsc-bckg-3);
      color: var(--cwsc-txt-1);
      border: 3px solid var(--cwsc-brdr-1) !important;
      border-radius: 10px;
      z-index: 500; }

      .tmTable .tmThingSafe { background-color: var(--tm-safe); }
      .tmTable .tmThingUnsafe { background-color: var(--tm-unsafe); }
      .tmTable .tmThingPerehod { background-color: var(--tm-location); }

      .tmLocs, .tmFolders { display:none; }

      #cages .tmThingSafe { background-color: var(--tm-safe-cage); }
      #cages .tmThingUnsafe { background-color: var(--tm-unsafe-cage); }
      #cages .tmThingPerehod { background-color: var(--tm-location-cage); }

      .tmLocLabel, .tmFolderLabel {
      display: inline-block;
      color: black;
      padding: 2px 10px; }

      .tmTable td {
      font-size: 11pt;
      text-align: center;
      vertical-align: middle;
      height: 30px;
      width: 22px;
      border: 1px solid var(--cwsc-brdr-3); }

      .tmThingList:checked + label span.tmThingValues {
      font-weight: bold; }

      small.tmThingValue {
      display: none; }

      .tmLocs:checked + .tmLocLabel, .tmFolders:checked + .tmFolderLabel {
      background-color: var(--cwsc-bckg-2);
      border: 2px solid var(--cwsc-brdr-1); }

      #tmBlock.folded { height: 25px; }

      div#tmHeader {
      display: grid;
      align-content: center;
      font-family: Montserrat;
      background-color: var(--cwsc-bckg-1);
      border: 1px solid var(--cwsc-brdr-1) !important;
      color: var(--cwsc-txt-4);
      border-radius: 0px;
      font-size: 16px;
      font-weight: 500;
      height: 25px; }

      div#tmHeader p {
      display: grid;
      align-content: center;
      border-right: 2px dashed var(--cwsc-brdr-5) !important;
      width: 225px;
      height: 28px;
      padding: 0;
      margin: 0; }

      span#tmHeaderPlusMinus {
      display: grid;
      justify-content: end;
      height: 29px;
      padding: 0;
      margin: 0; }

      svg#svgMinus, svg#svgPlus {
      transform: scale(65%);
      height: 26px;
      padding: 0;
      margin: 0; }

      div#tmHeader>table>tbody>tr>td {
      text-align: center; }

      div#blockThings {
      margin: 5px; }

      div#tmShowMap {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed var(--cwsc-brdr-3);
      border-left: none;
      border-right: none;
      margin: 10px 0px;
      padding: 5px 0px; }

      div#tmFolderBlock {
      display: flex;
      justify-content: space-evenly;
      margin: 5px; }

      div#tmLocBlock {
      display: flex;
      justify-content: space-evenly;
      margin: 5px; }

      label.tmLocLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 36px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      label.tmFolderLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 58px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      div#blockField {
      display: flex;
      justify-content: center;
      margin: 10px; }

      table.tmTable {
      background-color: var(--cwsc-bckg-7) !important; }

      button#tmClearButton {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      width: 252px;
      padding: 3px 10px;
      margin: 0px 10px 10px; }
        </style>`

        if (1==1) {
         $('head').append(tmCSS);
        }
      }

    if (globals['tmVariant'] == 1) { // КОМПАКТНЫЙ ВАРИАНТ
      let tmCSS = `
      <style>
      div#tmBlock {
      overflow: hidden;
      position: absolute;
      width: 270px;
      top: ${globals.tmTecPosY}px;
      left: ${globals.tmTecPosX}px;
      background-color: var(--cwsc-bckg-3);
      color: var(--cwsc-txt-1);
      border: 3px solid var(--cwsc-brdr-1) !important;
      border-radius: 10px;
      z-index: 500; }

      .tmTable .tmThingSafe { background-color: var(--tm-safe); }
      .tmTable .tmThingUnsafe { background-color: var(--tm-unsafe); }
      .tmTable .tmThingPerehod { background-color: var(--tm-location); }

      .tmLocs, .tmFolders { display:none; }

      #cages .tmThingSafe { background-color: var(--tm-safe-cage); }
      #cages .tmThingUnsafe { background-color: var(--tm-unsafe-cage); }
      #cages .tmThingPerehod { background-color: var(--tm-location-cage); }

      .tmLocLabel, .tmFolderLabel {
      display: inline-block;
      color: black;
      padding: 2px 10px; }

      .tmTable td {
      font-size: 11pt;
      text-align: center;
      vertical-align: middle;
      height: 30px;
      width: 22px;
      border: 1px solid var(--cwsc-brdr-3); }

      .tmThingList:checked + label span.tmThingValues {
      font-weight: bold; }

      small.tmThingValue {
      display: none; }

      .tmLocs:checked + .tmLocLabel, .tmFolders:checked + .tmFolderLabel {
      background-color: var(--cwsc-bckg-2);
      border: 2px solid var(--cwsc-brdr-1); }

      #tmBlock.folded { height: 25px; }

      div#tmHeader {
      display: grid;
      align-content: center;
      font-family: Montserrat;
      background-color: var(--cwsc-bckg-1);
      border: 1px solid var(--cwsc-brdr-1) !important;
      color: var(--cwsc-txt-4);
      border-radius: 0px;
      font-size: 16px;
      font-weight: 500;
      height: 25px; }

      div#tmHeader p {
      display: grid;
      align-content: center;
      border-right: 2px dashed var(--cwsc-brdr-5) !important;
      width: 225px;
      height: 28px;
      padding: 0;
      margin: 0; }

      span#tmHeaderPlusMinus {
      display: grid;
      justify-content: end;
      height: 29px;
      padding: 0;
      margin: 0; }

      svg#svgMinus, svg#svgPlus {
      transform: scale(65%);
      height: 26px;
      padding: 0;
      margin: 0; }

      div#tmHeader>table>tbody>tr>td {
      text-align: center; }

      div#blockThings {
      display: grid;
      text-align: center;
      margin: 5px; }

      div#tmShowMap {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed var(--cwsc-brdr-3);
      border-left: none;
      border-right: none;
      margin: 10px 0px;
      padding: 5px 0px; }

      div#tmFolderBlock {
      display: flex;
      justify-content: space-evenly;
      margin: 5px; }

      div#tmLocBlock {
      display: flex;
      justify-content: space-evenly;
      margin: 5px; }

      label.tmLocLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 36px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      label.tmFolderLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 58px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      div#blockField {
      display: flex;
      justify-content: center;
      margin: 10px; }

      table.tmTable {
      background-color: var(--cwsc-bckg-7) !important; }

      button#tmClearButton {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      width: 252px;
      padding: 3px 10px;
      margin: 0px 10px 10px; }
      </style>`

      if (1==1) {
       $('head').append(tmCSS);
      }
    }

      if (globals['tmVariant'] == 2) { // ГОРИЗОНТАЛЬНЫЙ ВАРИАНТ
        let tmCSS = `
        <style>
      div#tmBlock {
      overflow: hidden;
      position: absolute;
      width: 270px;
      top: ${globals.tmTecPosY}px;
      left: ${globals.tmTecPosX}px;
      background-color: var(--cwsc-bckg-3);
      color: var(--cwsc-txt-1);
      border: 3px solid var(--cwsc-brdr-1) !important;
      border-radius: 10px;
      width: 495px;
      z-index: 500; }

      .tmTable .tmThingSafe { background-color: var(--tm-safe); }
      .tmTable .tmThingUnsafe { background-color: var(--tm-unsafe); }
      .tmTable .tmThingPerehod { background-color: var(--tm-location); }

      .tmLocs, .tmFolders { display:none; }

      #cages .tmThingSafe { background-color: var(--tm-safe-cage); }
      #cages .tmThingUnsafe { background-color: var(--tm-unsafe-cage); }
      #cages .tmThingPerehod { background-color: var(--tm-location-cage); }

      .tmLocLabel, .tmFolderLabel {
      display: inline-block;
      color: black;
      padding: 2px 10px; }

      .tmTable td {
      font-size: 11pt;
      text-align: center;
      vertical-align: middle;
      height: 30px;
      width: 22px;
      border: 1px solid var(--cwsc-brdr-3); }

      .tmThingList:checked + label span.tmThingValues {
      font-weight: bold; }

      small.tmThingValue {
      display: none; }

      .tmLocs:checked + .tmLocLabel, .tmFolders:checked + .tmFolderLabel {
      background-color: var(--cwsc-bckg-2);
      border: 2px solid var(--cwsc-brdr-1); }

      #tmBlock.folded { height: 25px; }

      div#tmHeader {
      display: grid;
      align-content: center;
      font-family: Montserrat;
      background-color: var(--cwsc-bckg-1);
      border: 1px solid var(--cwsc-brdr-1) !important;
      color: var(--cwsc-txt-4);
      border-radius: 0px;
      font-size: 16px;
      font-weight: 500;
      height: 25px; }

      div#tmHeader p {
      display: grid;
      align-content: center;
      border-right: 2px dashed var(--cwsc-brdr-5) !important;
      width: 450px;
      height: 28px;
      padding: 0;
      margin: 0; }

      span#tmHeaderPlusMinus {
      display: grid;
      justify-content: end;
      height: 29px;
      padding: 0;
      margin: 0; }

      svg#svgMinus, svg#svgPlus {
      transform: scale(65%);
      height: 26px;
      padding: 0;
      margin: 0; }

      div#tmHeader>table>tbody>tr>td {
      text-align: center; }

      div#blockThings {
      margin: 5px; }

      div#tmShowMap {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed var(--cwsc-brdr-3);
      border-left: none;
      border-right: none;
      width: 195px;
      margin: 10px 5px;
      padding: 5px 0px; }

      div#tmFolderBlock {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 28px;
      left: 135px;
      width: 60px;
      margin: 5px; }

      div#tmLocBlock {
      display: flex;
      justify-content: space-evenly;
      position: absolute;
      top: 28px;
      left: 200px;
      width: 290px;
      margin: 5px; }

      label.tmLocLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 36px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      label.tmFolderLabel {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      padding: 0px;
      width: 58px;
      text-align: center;
      margin: 5px 0px;
      font-size: 13px; }

      div#blockField {
      position: absolute;
      top: 55px;
      left: 213px;
      margin: 10px; }

      table.tmTable {
      background-color: var(--cwsc-bckg-7) !important; }

      button#tmClearButton {
      background-color: var(--cwsc-inpt-1);
      color: var(--cwsc-txt-4);
      border: 2px solid var(--cwsc-brdr-3);
      border-radius: 3px !important;
      width: 185px;
      padding: 3px 10px;
      margin: 0px 10px 63px; }
        </style>`

        if (1==1) {
         $('head').append(tmCSS);
        }
      }

      let proj = globals.tmBTNSShowMap;
      let page = globals.tmSelectedMap;
      let text = '0';
      let mark = 'tmThingSafe';

      $("#tmBlock").draggable({
        containment: "document",
        handle: "#tmHeader",
        drag: function () {
          let offset = $(this).offset();
          let xPos = offset.left;
          let yPos = offset.top;
            setSettings('tmTecPosX', offset.left);
            setSettings('tmTecPosY', offset.top);
        }
      });

      let selFolder = getSettings('tmSelFolder');
      if (selFolder !== null) {
        if (!$('#tmFolder' + selFolder).length) {
          selFolder = '0';
        }
        $('#tmFolder' + selFolder).click();
        $('.tmLocLabel').hide();
        $('.tmLocLabel[folder=' + selFolder + ']').show();
        let selectedLoc = getSettings('tmSelectedMap');
        $('#tmLoc' + selectedLoc).click();
      }

      function tmSetStyle($elem, style) {
        $elem.removeClass('tmThingSafe tmThingUnsafe tmThingPerehod').addClass(style);
        if (proj) {
          let col = $elem.index();
          let row = $elem.parent().index();
          $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('tmThingSafe tmThingUnsafe tmThingPerehod').addClass(style);
        }
      }
      function tmDraw() {
        $('.tmTable[page=' + page + '] td.tmThingSafe, .tmTable[page=' + page + '] td.tmThingUnsafe, .tmTable[page=' + page + '] td.tmThingPerehod').each(function () {
          let col = $(this).index();
          let row = $(this).parent().index();
          $('#cages > tbody > tr').eq(row).children().eq(col).addClass($(this)[0].classList.value);
            if ($(this).hasClass('tmThingSafe') || $(this).hasClass('tmThingSafeDef')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('tmThingSafe');
            }
            else if ($(this).hasClass('tmThingUnsafe')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('tmThingUnsafe');
            }
            else if ($(this).hasClass('tmThingPerehod')) {
              $('#cages > tbody > tr').eq(row).children().eq(col).addClass('tmThingPerehod');
            }
        })
      }

      $('body').on('change', 'input[name="tmFolder"]', function () {
        let folder = $(this).val();
        setSettings('tmSelFolder', folder);
        $('.tmLocLabel').hide();
        $('.tmLocLabel[folder=' + folder + ']').show();
        $('.tmLocLabel[folder=' + folder + ']')[0].click();
      });

      $('body').on('change', 'input[name="tmLoc"]', function () {
        $('.tmTable[page=' + page + ']').hide();
         page = $(this).val();
        $('.tmTable[page=' + page + ']').show();
         setSettings('tmSelectedMap', page)
        if (proj) {
          $('#cages > tbody > tr > td.tmThingSafe').each(function () {
            $(this).removeClass('tmThingSafe')
          });
          $('#cages > tbody > tr > td.tmThingUnsafe').each(function () {
            $(this).removeClass('tmThingUnsafe')
          });
          $('#cages > tbody > tr > td.tmThingPerehod').each(function () {
            $(this).removeClass('tmThingPerehod')
          });
          tmDraw();
        }
      });

      $('body').on('click', '#tmClearButton', function () {
        let ok = true;
        if (globals.tmClearConfirm) {
          ok = confirm('Очистить поле?');
        }
        if (ok) {
          $('.tmTable .tmThingSafeDef').removeClass('tmThingSafeDef');
          $('.tmTable[page=' + page + '] td:not(.tmThingPerehod)').each(function () {
            $(this).html('');
            tmSetStyle($(this), '');
          });
          tmMaps[page] = $('.tmTable[page=' + page + ']').html();
          setSettings('tmMaps', JSON.stringify(tmMaps));
        }
      });

      $('body').on('change', 'input[name="tmThing"]', function () {
        text = $(this).val();
        mark = $(this).attr('mark');
      });

      $('body').on('click', '.tmTable td', function () {
        $(this).html(text).removeClass('tmThingSafe tmThingUnsafe tmThingPerehod').addClass(mark);
        if (proj) {
          let col = $(this).index();
          let row = $(this).parent().index();
          $('#cages > tbody > tr').eq(row).children().eq(col).removeClass('tmThingSafe tmThingUnsafe tmThingPerehod').addClass(mark);
        }
        tmMaps[page] = $('.tmTable[page=' + page + ']').html();
        setSettings('tmMaps', JSON.stringify(tmMaps));
      });

      if (globals['tmFolded']) {
        $('#tmBlock').addClass('folded');
        $('svg#svgPlus').hide();
      }
      if (!globals['tmFolded']) {
        $('svg#svgMinus').hide();
      }

      $('body').on('click', 'svg#svgMinus', function () {
        $('#tmBlock').toggleClass('folded');
        $('svg#svgMinus').hide();
        $('svg#svgPlus').show();
      });
      $('body').on('click', 'svg#svgPlus', function () {
        $('#tmBlock').toggleClass('folded');
        $('svg#svgPlus').hide();
        $('svg#svgMinus').show();
      });

      $(document).ready(function () {
        if ($('#tmBTNSShowMap').prop('checked')) {
          proj = true;
          tmDraw();
        }
      });

      $('body').on('change', '#tmBTNSShowMap', function () {
        if ($(this).prop('checked')) {
          proj = true;
          tmDraw();
        } else {
          proj = false;
          $('#cages > tbody > tr > td.tmThingSafe').removeClass('tmThingSafe');
          $('#cages > tbody > tr > td.tmThingUnsafe').removeClass('tmThingUnsafe');
          $('#cages > tbody > tr > td.tmThingPerehod').removeClass('tmThingPerehod');
        }
      });

      $('.tmBTNS').on('change', function() {
        let key = this.id;
        let val = this.type === 'checkbox' ? this.checked : this.value;
        setSettings(key, val);
      });
    });
  }
let currentSoundIndex = 0;
let soundPlaying = false;
let soundInstance = null;

const sounds = [
  'https://github.com/CatWarScript/myFiles/raw/main/instasamkaLispiha.mp3?raw=true',
  'https://github.com/CatWarScript/myFiles/raw/main/instasamkaPusijusi.mp3?raw=true',
  'https://github.com/CatWarScript/myFiles/raw/main/instasamkaZadengida.mp3?raw=true'
];

function playRandomSound() {
  if (soundPlaying) {
    return;
  }
  const randomIndex = Math.floor(Math.random() * sounds.length);
  soundInstance = new Audio(sounds[randomIndex]);
  soundInstance.volume = globals.kalinnikFunctionVolume;
  soundInstance.onended = () => {
    soundPlaying = false;
    currentSoundIndex = (currentSoundIndex + 1) % sounds.length;
  };

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        soundInstance.play();
        soundPlaying = true;
      })
      .catch(err => {
        console.error("Микрофон выключен:", err);
      });
  } else {
    soundInstance.onloadedmetadata = () => {
      setTimeout(() => {
        soundInstance.play();
        soundPlaying = true;
      }, 1000);
    };
  }
}
window.onload = () => {
  if (globals && globals.kalinnikFunction) {
    playRandomSound();
  }
};
}

// ...
// ...
// ...

function myCat() {
function getBackgroundColorHex() {
    let backgroundColor = $('#site_table').css('background-color');
    let bodyColor = $('body').css('color');
    let bodyBg = $('body').css('background-image');
    let rgb = backgroundColor.match(/rgba?\(([^)]+)\)/)[1].split(',').map(Number);
    let rgb2 = bodyColor.match(/rgba?\(([^)]+)\)/)[1].split(',').map(Number);
    let hex = rgb.reduce((acc, val) => {
        let hexVal = val.toString(16).padStart(2, '0');
        return acc + hexVal;
    }, '#');
    let hex2 = rgb2.reduce((acc, val) => {
        let hexVal = val.toString(16).padStart(2, '0');
        return acc + hexVal;
    }, '#');
    hex = hex.slice(0, 7);
    hex2 = hex2.slice(0, 7);
    let dsghnImg = bodyBg.match(/url\((['"])(.*?)\1\)/)[2];
    globals['dsghnClr'] = hex;
    globals['dsghnClr2'] = hex2;
    globals['dsghnImg'] = dsghnImg;
    setSettings('dsghnClr', hex);
    setSettings('dsghnClr2', hex2);
    setSettings('dsghnImg', dsghnImg);
}

getBackgroundColorHex();
console.log(globals['dsghnClr']);
console.log(globals['dsghnClr2']);
console.log(globals['dsghnImg']);

  if (globals['boneCorrectTimer']) {
    let boneCorrectDiv = `
        <br><br><div id="timer">
        <b>Костоправы</b><div id="timerMain">
        <input type="number" id="days" min="0" value='0' class="templateInputs">
        <label for="days">Введите дни</label><br>
        <input type="number" id="hours" min="0" value='0' max="23" class="templateInputs">
        <label for="hours">Введите часы</label><br>
        <input type="number" id="minutes" min="0" value='0' max="59" class="templateInputs">
        <label for="minutes">Введите минуты</label><br>
        <div id="buttons"><button id="start" class="boneCorrectBtns">Запустить таймер</button> <button id="reset" class="boneCorrectBtns">Отменить таймер</button></div></div>
        <span id="message"></span>
        </div><br>`

    function toggleBoneTimer() {
      $('#timer').slideToggle();
    }
    let toggleButton = $('<br><button id="toggleBoneCorrectButton" type="button">Калькулятор костоправов</button>').click(toggleBoneTimer);
    appendToElementOrPrependFallback('#pr', '#education-show', toggleButton);
    appendToElementOrPrependFallback('#pr', '#education-show', boneCorrectDiv);
    let cssBoneCorrect = `
        <style>
          div#timer {
          font-family: Montserrat;
          outline: 5px solid var(--cwsc-brdr-1);
          background-color: var(--cwsc-bckg-1);
          color: var(--cwsc-txt-1);
          border-radius: 10px !important;
          margin: 5px 5px; }

          div#timerMain {
          background-color: var(--cwsc-bckg-2);
          border-top: 4px solid var(--cwsc-brdr-2);
          border-radius: 0px 0px 10px 10px;
          padding: 7px; }

          div#timerMain label {
          font-weight: bold;
          color: var(--cwsc-txt-1); }

          div#timer>b {
          display: flex !important;
          justify-content: center;
          text-transform: uppercase;
          color: var(--cwsc-txt-2);
          font-size: 25px;
          letter-spacing: 18px;
          padding: 10px 0px;
          margin-left: 18px; }

          input.templateInputs {
          background-color: var(--cwsc-inpt-1);
          color: var(--cwsc-txt-4);
          border: 1px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          width: 65px;
          height: 28px;
          margin: 0px 5px 5px 10px; }

          div#buttons {
          display: flex !important;
          justify-content: center;
          margin: 10px 0px 3px 0px; }

          button.boneCorrectBtns {
          background-color: var(--cwsc-inpt-1);
          color: var(--cwsc-txt-4);
          border: 2px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          padding: 3px 10px;
          margin: 0px 10px; }

          button.boneCorrectBtns:hover {
          border: 2px solid var(--cwsc-brdr-2); }

          span#message {
          display: inline-block;
          text-align: center;
          color: var(--cwsc-txt-4);
          margin: 5px 0px; }


          button#toggleBoneCorrectButton {
          background-color: var(--cwdf-bckg-1);
          color: var(--cwdf-txt-1);
          border: 1px solid var(--cwdf-brdr-1);
          font-family: Verdana;
          font-size: .9em; }

          button#toggleBoneCorrectButton:hover {
          border: 1px solid var(--cwdf-brdr-2); }
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

    if (globals['selTheme'] == 0) {
      let cssDlyaCWScripta = `
       <style id="cssPalette">
      :root {
      --desBckg1: ${(globals['dsghnClr'])};
      --desClr1: ${(globals['dsghnClr2'])};
      --desBckgImg1: url(${(globals['dsghnImg'])});
    }
:root {
--cwsc-scrl-1: #332f3c !important;
--cwsc-scrl-2: #8d5353 !important;
--cwsc-inpt-1: #2e2c31 !important;
--cwsc-inpt-2: #2e2c31 !important;
--cwsc-bttn-1: #2e2c31 !important;

--cwsc-bckg-1: #332f3c !important;
--cwsc-bckg-2: #615b6b !important;
--cwsc-bckg-3: #858093 !important;
--cwsc-bckg-4: #a19ca6 !important;
--cwsc-bckg-5: #1d1b24 !important;
--cwsc-bckg-6: #DBAEFF !important;
--cwsc-bckg-7: #6b627150 !important;
--cwsc-bckg-8: #cd5062 !important;

--cwsc-brdr-1: #332f3c !important;
--cwsc-brdr-2: #8d5353 !important;
--cwsc-brdr-3: #1b1311 !important;
--cwsc-brdr-4: #0c0b0f15 !important;
--cwsc-brdr-5: #c9bdb090 !important;

--cwsc-txt-1: #110d18 !important;
--cwsc-txt-2: #c2bcb8 !important;
--cwsc-txt-3: #bd5e5e !important;
--cwsc-txt-4: #bcb7c2 !important;
--cwsc-txt-5: #a99bbf !important;

--cwsc-fltr-vk: hue-rotate(22deg) contrast(10%) brightness(90%);
--cwsc-fltr-tg: hue-rotate(37deg) contrast(15%) brightness(88%);
--cwsc-fltr-bs: hue-rotate(220deg) contrast(12%) brightness(87%);

--tm-safe: rgba(255,255,255,.5);
--tm-unsafe: rgba(51, 42, 75, .45);
--tm-location: rgba(255,255,255,1);
--tm-safe-cage: rgba(247, 255, 236, .25);
--tm-unsafe-cage: rgba(18, 11, 43, .5);
--tm-location-cage: rgba(247, 255, 236, .5);

--cwdf-bckg-1: #333;
--cwdf-brdr-1: #000;
--cwdf-brdr-2: #ff0;
--cwdf-txt-1: #fff;
--cwdf-txt-2: #000; }
       </style>`
      $('head').append(cssDlyaCWScripta);
    }
    if (globals['selTheme'] == 1) {
      let cssDlyaCWScripta = `
       <style id="cssPalette">
      :root {
      --desBckg1: ${(globals['dsghnClr'])};
      --desClr1: ${(globals['dsghnClr2'])};
      --desBckgImg1: url(${(globals['dsghnImg'])});
    }
      :root {
      --cwsc-scrl-1: #3F2D29;
      --cwsc-scrl-2: #AD7B3C;
      --cwsc-inpt-1: #342521;
      --cwsc-inpt-2: #1d1514;
      --cwsc-bttn-1: #342521;

      --cwsc-bckg-1: #3F2D29;
      --cwsc-bckg-2: #75524C;
      --cwsc-bckg-3: #A47C74;
      --cwsc-bckg-4: #D1BCB7;
      --cwsc-bckg-5: #CAAC88;
      --cwsc-bckg-6: #DBAEFF;
      --cwsc-bckg-7: #75524C50;
      --cwsc-bckg-8: #cd5062;

      --cwsc-brdr-1: #3F2D29;
      --cwsc-brdr-2: #AD7B3C;
      --cwsc-brdr-3: #1b1311;
      --cwsc-brdr-4: #5f494540;
      --cwsc-brdr-5: #c9bdb090;

      --cwsc-txt-1: #180E0D;
      --cwsc-txt-2: #CAAC88;
      --cwsc-txt-3: #AD7B3C;
      --cwsc-txt-4: #c9bdb0;
      --cwsc-txt-5: #372a1e;

      --cwsc-fltr-vk: hue-rotate(152deg) contrast(35%) brightness(40%);
      --cwsc-fltr-tg: hue-rotate(167deg) contrast(40%) brightness(38%);
      --cwsc-fltr-bs: hue-rotate(350deg) contrast(37%) brightness(37%);

      --tm-safe: rgba(255,255,255,.6);
      --tm-unsafe: rgba(204,102,0,.45);
      --tm-location: rgba(255,255,255,1);
      --tm-safe-cage: rgba(247, 255, 236, .2);
      --tm-unsafe-cage: rgba(43, 11, 11, .5);
      --tm-location-cage: rgba(247, 255, 236, .4);

      --cwdf-bckg-1: #333;
      --cwdf-brdr-1: #000;
      --cwdf-brdr-2: #ff0;
      --cwdf-txt-1: #fff;
      --cwdf-txt-2: #000; }
       </style>`
      $('head').append(cssDlyaCWScripta);
    }
    if (globals['selTheme'] == 2) {
      let cssDlyaCWScripta = `
       <style id="cssPalette">

      :root {
      --desBckg1: ${(globals['dsghnClr'])};
      --desClr1: ${(globals['dsghnClr2'])};
      --desBckgImg1: url(${(globals['dsghnImg'])});
    }
:root {
--cwsc-scrl-1: #393E41;
--cwsc-scrl-2: #8d5353;
--cwsc-inpt-1: #2e2c31;
--cwsc-inpt-2: #2e2c31;
--cwsc-bttn-1: #2e2c31;

--cwsc-bckg-1: #393E41;
--cwsc-bckg-2: #777678;
--cwsc-bckg-3: #a19da3;
--cwsc-bckg-4: #96939B;
--cwsc-bckg-5: #807d83;
--cwsc-bckg-6: #DBAEFF;
--cwsc-bckg-7: #92889950;
--cwsc-bckg-8: #cd5062;

--cwsc-brdr-1: #393E41;
--cwsc-brdr-2: #b2883f;
--cwsc-brdr-3: #1b1311;
--cwsc-brdr-4: #514c5440;
--cwsc-brdr-5: #c9bdb090;

--cwsc-txt-1: #110d18;
--cwsc-txt-2: #c5baad;
--cwsc-txt-3: #bd5e5e;
--cwsc-txt-4: #c2bdb7;
--cwsc-txt-5: #121116;

--cwsc-fltr-vk: hue-rotate(22deg) contrast(25%) brightness(40%);
--cwsc-fltr-tg: hue-rotate(37deg) contrast(30%) brightness(38%);
--cwsc-fltr-bs: hue-rotate(220deg) contrast(27%) brightness(37%);

--tm-safe: rgba(255,255,255,.6);
--tm-unsafe: rgba(204,102,0,.45);
--tm-location: rgba(255,255,255,1);
--tm-safe-cage: rgba(247, 255, 236, .2);
--tm-unsafe-cage: rgba(43, 11, 11, .5);
--tm-location-cage: rgba(247, 255, 236, .4);

--cwdf-bckg-1: #333;
--cwdf-brdr-1: #000;
--cwdf-brdr-2: #ff0;
--cwdf-txt-1: #fff;
--cwdf-txt-2: #000; }
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
          border: 1px solid var(--cwdf-brdr-2); }

          .dontReadButton {
          background-color: var(--cwdf-bckg-1);
          color: var(--cwdf-txt-1);
          border: 1px solid var(--cwdf-brdr-1);
          font-family: Verdana;
          font-size: .9em; }

          #dontReadCounter {
          background-color: var(--cwsc-bckg-6);
          font-weight: 700;
          color: var(--cwdf-txt-2);
          text-decoration: none !important; }
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

   /* $(document).ready(function() {
  const $trChat = $('#tr_chat');
  const backgroundColor = $trChat.css('background-color');
  const rgbColor = backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
  const r = parseInt(rgbColor[1]);
  const g = parseInt(rgbColor[2]);
  const b = parseInt(rgbColor[3]);
  const brightnessFactor = 1.2; // Коэффициент яркости
  const newR = Math.round(r * brightnessFactor);
  const newG = Math.round(g * brightnessFactor);
  const newB = Math.round(b * brightnessFactor);
  $trChat.css('background-color', `rgb(${newR}, ${newG}, ${newB})`);
}); */
}

// ...
// ...
// ...

function fae () {
  $('p:has(input#blogs_blacklist)').after(`<input class="cs-set" id="showEnemy" type="checkbox"${globals.showEnemy?' checked':''}><label for="showEnemy"> Отображать котов из списка врагов в Игровой</label>`);
  $(document).ready(function() {
    setTimeout(function() {
      var enemyLinks = $("#enemyList .remove");
      var enemyIds = [];
      enemyLinks.each(function() {
        var id = $(this).data("id");
        enemyIds.push(id);
      });
      console.log("Список ID врагов:", enemyIds);
      setSettings('enemyList', JSON.stringify(enemyIds));
    }, 1500);
  });

  $('.cs-set').on('change', function() {
    let key = this.id;
    let val = this.type === 'checkbox' ? this.checked : this.value;
    if (this.tagName === 'SELECT') {
      val = $(this).prop('selectedIndex');
    }
    setSettings(key, val);
    console.log(key, ': ', val, '.')
  });
}

function site() {
  if (globals['hideWoundWarning']) {
    $('#warningAboutWound').remove();
  };
}


function blogs() {
  if (globals['ttBlog']) {
    function checkForForm() {
      let form = document.querySelector('#creation_form:first-of-type');
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
      if (window.location.href.includes("https://catwar.su/blogs?creation") || window.location.href.includes("https://catwar.su/sniff?creation")) {
        $(document).ready(function() {
          setTimeout(function() {
            initScript();
          }, 70);
        });

        function initScript() {
          let templatesB = localStorage.getItem('templatesB') ? JSON.parse(localStorage.getItem('templatesB')) : [];

          function renderTemplates() {
            let list = $('.patternlist');
            list.empty();
            templatesB.forEach(function(templateB, index) {
              let templateText = '<div class="patternline"><a href="#" class="name" data-index="' + index + '">' + templateB.name + '</a> <div id="del-edit"><a href="#" class="delete" data-index="' + index + '">[X]</a> <a href="#" class="edit" data-index="' + index + '">[✍]</a></div><hr>';
              list.append(templateText);
            });
          }
          let writeForm = $('#creation_form:first-of-type');
          if (writeForm.length === 0) {
            return;
          }
          writeForm.find('.patternblock').remove();
          writeForm.prepend('<div class="patternblock"><b>Шаблоны</b><div class="patternlist"></div></div>');
          let patternBlock = writeForm.find('.patternblock');
          let createButton = $('<a href="#" id="createButton">Создать новый шаблон</a>').click(function(e) {
            e.preventDefault();
            $(this).hide();
            let inputField = $('<input type="text" id="templateName" placeholder="Введите название шаблона"></input>');
            let okButton = $('<button type="button" id="templateBtnOK" class="templateBtns">OK</button>').click(function() {
              let templateName = inputField.val();
              if (templateName) {
                let currentContent = $('#creation-text').val();
                let newTemplate = {
                  name: templateName,
                  content: currentContent
                };
                templatesB.push(newTemplate);
                localStorage.setItem('templatesB', JSON.stringify(templatesB));
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
            let templateName = templatesB[templateIndex].name;
            if (confirm('Точно ли вы хотите удалить шаблон "' + templateName + '"?')) {
              templatesB.splice(templateIndex, 1);
              localStorage.setItem('templatesB', JSON.stringify(templatesB));
              renderTemplates();
            }
          });
          writeForm.off('click', '.edit').on('click', '.edit', function(e) {
            $('#templateBtnSaveChanges').show();
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateB = templatesB[templateIndex];
            if (templateB) {
              let templateContent = templateB.content;
              $('#creation-text').val(templateContent);
              let saveButton = $('#templateBtnSaveChanges');
              if (saveButton.length === 0) {
                saveButton = $('<button id="templateBtnSaveChanges">Сохранить шаблон</button><br><br>');
                writeForm.append(saveButton);

              }
              saveButton.off('click').click(function(e) {
                e.preventDefault();
                let editedContent = $('#creation-text').val();
                templatesB[templateIndex].content = editedContent;
                localStorage.setItem('templatesB', JSON.stringify(templatesB));
                renderTemplates();
                $('#creation-text').val('');
                $('#templateBtnSaveChanges').hide();
              });
            }
          });
          writeForm.on('click', '.name', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateB = templatesB[templateIndex];
            if (templateB) {
              $('#creation-text').val(templateB.content);
              if (globals['ttReplaceThemeB']) {
                $('#creation-title').val(templateB.name);
              }
            }
          });
          renderTemplates();

          function togglePatternBlock() {
            $('.patternblock').slideToggle();
          }
          let toggleButton = $('<button id="togglePatternBlockButton" type="button">Ш</button>').click(togglePatternBlock);
          $('button[data-code="b"]').before(toggleButton);
          if (globals['toggleTTBlog']) {
            $('.patternblock').hide();
          }
        }
      }
    }
    let css = `
        <style>
          div.patternlist::-webkit-scrollbar {
          width: 8px; }

          div.patternlist::-webkit-scrollbar-track {
          background: var(--cwsc-scrl-1) !important;
          border-radius: 3px; }

          div.patternlist::-webkit-scrollbar-thumb {
          background: var(--cwsc-scrl-2) !important;
          border-radius: 3px; }

          div.patternblock {
          font-family: Montserrat;
          outline: 5px solid var(--cwsc-brdr-1);
          background-color: var(--cwsc-bckg-1);
          color: var(--cwsc-txt-1);
          border-radius: 10px !important;
          margin: 15px 5px; }

          div.patternblock>b {
          display: flex !important;
          justify-content: center;
          text-transform: uppercase;
          color: var(--cwsc-txt-2);
          font-size: 25px;
          letter-spacing: 25px;
          padding: 10px 0px;
          margin-left: 25px; }

          div.patternlist {
          max-height: 170px;
          overflow: auto;
          background-color: var(--cwsc-bckg-2);
          border-top: 4px solid var(--cwsc-brdr-2);
          border-radius: 0px 0px 10px 10px;
          padding: 6px 0px 0px 0px}

          div.patternline>hr {
          border: 0.5px solid var(--cwsc-brdr-4);
          margin: 6px 0px 0px 0px; }

          div.patternline:hover {
          background: var(--cwsc-brdr-4) !important;
          transition: 0.8s; }

          div.patternline {
          transition: 0.8s;
          padding-top: 6px; }

          div.patternline a {
          color: var(--cwsc-txt-1); }

          div.patternline a:hover {
          color: var(--cwsc-txt-4); }

          .patternline>a.name {
          display: block;
          margin: 0px 0px 0px 10px; }

          div#del-edit {
          display: flex;
          justify-content: flex-end;
          margin: -15px 0px 0px 0px;
          height: 18px; }

          div#del-edit>a {
          margin: 0px 3px; }

          div#del-edit>a.edit {
          position: relative;
          bottom: 1px; }

          input#templateName {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 1px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          width: 200px !important;
          margin: 6px 10px 4px 10px; }

          button#templateBtnOK, button#templateBtnUndo, button#templateBtnSaveChanges {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 2px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          padding: 1px 15px;
          margin: 0px 5px; }

          button#templateBtnOK:hover, button#templateBtnUndo:hover, button#templateBtnSaveChanges:hover {
          border: 1px solid var(--cwsc-brdr-2); }

          a#createButton {
          display: inline-block;
          color: var(--cwsc-txt-4);
          padding: 6px; }

          button#togglePatternBlockButton {
          background-color: var(--cwdf-bckg-1);
          color: var(--cwdf-txt-1);
          border: none;
          margin-right: 5px; }

          button#togglePatternBlockButton:hover {
          outline: 1px solid var(--cwdf-brdr-2); }
        </style>`
    $('head').append(css);
  }
}

function chat() {
    if (globals['ttChat']) {
    function checkForForm() {
      let form = document.querySelector('#mess_form');
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
      if (window.location.href.includes("https://catwar.su/chat")) {
        $(document).ready(function() {
          setTimeout(function() {
            initScript();
          }, 70);
        });

        function initScript() {
          let templatesC = localStorage.getItem('templatesC') ? JSON.parse(localStorage.getItem('templatesC')) : [];

          function renderTemplates() {
            let list = $('.patternlist');
            list.empty();
            templatesC.forEach(function(template, index) {
              let templateText = '<div class="patternline"><a href="#" class="name" data-index="' + index + '">' + template.name + '</a> <div id="del-edit"><a href="#" class="delete" data-index="' + index + '">[X]</a> <a href="#" class="edit" data-index="' + index + '">[✍]</a></div><hr>';
              list.append(templateText);
            });
          }
          let writeForm = $('form#mess_form');
          if (writeForm.length === 0) {
            return;
          }
          writeForm.find('.patternblock').remove();
          writeForm.prepend('<div class="patternblock"><b>Шаблоны</b><div class="patternlist"></div></div>');
          let patternBlock = writeForm.find('.patternblock');
          let createButton = $('<a href="#" id="createButton">Создать новый шаблон</a>').click(function(e) {
            e.preventDefault();
            $(this).hide();
            let inputField = $('<input type="text" id="templateName" placeholder="Введите название шаблона"></input>');
            let okButton = $('<button type="button" id="templateBtnOK" class="templateBtns">OK</button>').click(function() {
              let templateName = inputField.val();
              if (templateName) {
                let currentContent = $('#mess').html();
                let newTemplate = {
                  name: templateName,
                  content: currentContent
                };
                templatesC.push(newTemplate);
                localStorage.setItem('templatesC', JSON.stringify(templatesC));
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
            let templateName = templatesC[templateIndex].name;
            if (confirm('Точно ли вы хотите удалить шаблон "' + templateName + '"?')) {
              templatesC.splice(templateIndex, 1);
              localStorage.setItem('templatesC', JSON.stringify(templatesC));
              renderTemplates();
            }
          });
          writeForm.off('click', '.edit').on('click', '.edit', function(e) {
            $('#templateBtnSaveChanges').show();
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateC = templatesC[templateIndex];
            if (templateC) {
              let templateContent = templateC.content;
              $('#mess').html(templateContent);
              let saveButton = $('#templateBtnSaveChanges');
              if (saveButton.length === 0) {
                saveButton = $('<button id="templateBtnSaveChanges">Сохранить шаблон</button><br><br>');
                writeForm.append(saveButton);
              }
              saveButton.off('click').click(function(e) {
                e.preventDefault();
                let editedContent = $('#mess').html();
                templatesC[templateIndex].content = editedContent;
                localStorage.setItem('templatesC', JSON.stringify(templatesC));
                renderTemplates();
                $('#mess').html('');
                $('#templateBtnSaveChanges').hide();
              });
            }
          });
          writeForm.on('click', '.name', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateC = templatesC[templateIndex];
            if (templateC) {
              $('#mess').html(templateC.content);
            }
          });
          renderTemplates();

          function togglePatternBlock() {
            $('.patternblock').slideToggle();
          }
          let toggleButton = $('<button id="togglePatternBlockButton" type="button">Ш</button>').click(togglePatternBlock);
          $('button[data-code="b"]').before(toggleButton);
          if (globals['toggleTTChat']) {
            $('.patternblock').hide();
          }
        }
      }
    }
    let css = `
        <style>
          div.patternlist::-webkit-scrollbar {
          width: 8px; }

          div.patternlist::-webkit-scrollbar-track {
          background: var(--cwsc-scrl-1) !important;
          border-radius: 3px; }

          div.patternlist::-webkit-scrollbar-thumb {
          background: var(--cwsc-scrl-2) !important;
          border-radius: 3px; }

          div.patternblock {
          font-family: Montserrat;
          outline: 5px solid var(--cwsc-brdr-1);
          background-color: var(--cwsc-bckg-1);
          color: var(--cwsc-txt-1);
          border-radius: 10px !important;
          width: 98.2%;
          margin: 15px 5px; }

          div.patternblock>b {
          display: flex !important;
          justify-content: center;
          text-transform: uppercase;
          color: var(--cwsc-txt-2);
          font-size: 25px;
          letter-spacing: 25px;
          padding: 10px 0px;
          margin-left: 25px; }

          div.patternlist {
          max-height: 170px;
          overflow: auto;
          background-color: var(--cwsc-bckg-2);
          border-top: 4px solid var(--cwsc-brdr-2);
          border-radius: 0px 0px 10px 10px;
          padding: 6px 0px 0px 0px}

          div.patternline>hr {
          border: 0.5px solid var(--cwsc-brdr-4);
          margin: 6px 0px 0px 0px; }

          div.patternline:hover {
          background: var(--cwsc-brdr-4) !important;
          transition: 0.8s; }

          div.patternline {
          transition: 0.8s;
          padding-top: 6px; }

          div.patternline a {
          color: var(--cwsc-txt-1); }

          div.patternline a:hover {
          color: var(--cwsc-txt-4); }ы

          .patternline>a.name {
          display: block;
          margin: 0px 0px 0px 10px; }

          div#del-edit {
          display: flex;
          justify-content: flex-end;
          margin: -15px 0px 0px 0px;
          height: 18px; }

          div#del-edit>a {
          margin: 0px 3px; }

          div#del-edit>a.edit {
          position: relative;
          bottom: 1px; }

          input#templateName {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 1px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          width: 200px !important;
          margin: 6px 10px 4px 10px; }

          button#templateBtnOK, button#templateBtnUndo, button#templateBtnSaveChanges {
          background-color: var(--cwsc-inpt-2);
          color: var(--cwsc-txt-4);
          border: 2px solid var(--cwsc-brdr-3);
          border-radius: 3px !important;
          padding: 1px 15px;
          margin: 0px 5px; }

          button#templateBtnOK:hover, button#templateBtnUndo:hover, button#templateBtnSaveChanges:hover {
          border: 1px solid var(--cwsc-brdr-2); }

          a#createButton {
          display: inline-block;
          color: var(--cwsc-txt-4);
          padding: 6px; }

          button#togglePatternBlockButton {
          background-color: var(--cwdf-bckg-1);
          color: var(--cwdf-txt-1);
          border: none;
          margin-right: 5px; }

          button#togglePatternBlockButton:hover {
          outline: 1px solid var(--cwdf-brdr-2); }
        </style>`
    $('head').append(css);
  }
}

function custom() {};

    function updateDontReadCounter1() {
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
