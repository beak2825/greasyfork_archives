// ==UserScript==
// @name            OppoYoutubeLiker
// @description     Simple auto liker for russian and other opposition channel :)
// @description:ru  Простой автолайкер для русского и других оппозиционных каналов :)
// @description:de  Einfacher Auto-Liker für russische und andere Oppositionskanäle :)
// @description:fr  Un simple liker automatique pour les chaînes russes et autres chaînes d'opposition. :)
// @description:it  Semplice auto liker per il canale russo e altri canali di opposizione :)
// @version         0.0.2 [Beta]
// @author          https://github.com/OppoYoutubeLiker
// @namespace       https://github.com/OppoYoutubeLiker/OppoYoutubeLiker
// @supportURL      https://github.com/OppoYoutubeLiker/OppoYoutubeLiker/issues
// @license         GNU 3.0 & OWN
// @match           https://www.youtube.com/*
// @match           https://m.youtube.com/*
// @match           https://www.youtube-nocookie.com/*
// @match           https://music.youtube.com/*
// @grant           none
// @run-at          document-start
// @compatible      chrome Chrome + Tampermonkey or Violentmonkey
// @compatible      firefox Firefox + Greasemonkey or Tampermonkey or Violentmonkey
// @compatible      opera Opera + Tampermonkey or Violentmonkey
// @compatible      edge Edge + Tampermonkey or Violentmonkey
// @compatible      safari Safari + Tampermonkey or Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/449113/OppoYoutubeLiker.user.js
// @updateURL https://update.greasyfork.org/scripts/449113/OppoYoutubeLiker.meta.js
// ==/UserScript==

function OppoYoutubeLiker(){

    const Channels = ["ABU-SADDAM SHISHANI", "ABU-SADDAM SHISHANI [LIVE]", "Activatica", "Acute Angle", "Alexander Thorn", "Alexandr Plushev", "Alferov", "Alferov Live", "ARU TV", "BBC News - Русская служба", "Current Time", "DW на русском", "Euronews по-русски", "Europa Live", "Fake News", "kamikadzedead", "Meduza", "MyGap", "New Rush Word", "Om TV", "Politeka Online", "PRO FV", "Proekt_media", "Ramy Zaycman", "RusNews", "Sasha Sotnik", "Sergey Aleksashenko", "sotavision", "SunandreaS", "SVTV", "The Insider", "Think Tank", "TV Rain", "Александр Балу", "Александр Долгополов", "Алексей Навальный", "Андрей Трофимов", "БАРМАЛЕЙКА", "Белая Рысь", "Бондаренко LIVE", "Быть Или", "Вадим Коровин", "Вестник Бури", "Вестник Бури Originals", "Вечный", "Владимир Милов", "Голос Америки", "Дед Архимед", "Дневник Депутата", "Евгений Ройзман", "Екатерина Шульман", "Ёшкин Крот", "Заповедник", "И Грянул Грэм", "Илья Яшин", "Инвалиды Россия Disabled in Russia", "КАНАЛ МОРДОР", "КЛИРИК", "Котрикадзе Дзядко", "Кочегарка FM Presents", "Кстати Новости Нижнего Новгорода", "Леонид Волков", "Любовь Соболь", "Майкл Наки", "Мари Говори", "Медиазона", "Михаил Ходорковский", "Навальный LIVE", "Настоящее Время ", "Нино Росебашвили", "Общество защиты интернета", "Острый Угол", "Открытые Медиа", "Популярная политика", "Проект Гроза", "Радио Свобода", "РАЗГОВОРНЫЙ ЖАНР", "Реальная журналистика", "Роман Цимбалюк", "Свободные", "Сергей Бойко", "Сергей Гуриев", "Сергей Смирнов", "Татьяна Фельгенгауэр", "Телеканал OstWest", "Телеканал Дождь", "Тихий Барин", "Тихий Барин TV - II", "ТЫ ИЛЛЮМИНАТ", "Убежище оппозиции", "Утро Февраля", "Фактор", "Феникс возрождение", "Фонд Ройзмана", "Ходорковский LIVE", "ШЕПЕЛИН", "Alexey Arestovych", "DW Українською", "OmTV UA", "Вечер с Яниной Соколовой", "Алексей Гончаренко", "DW Беларусь", "TrashSmash", "Smash", "Konan Ў!", "NEXTA Live", "NEXTA", "БЕЛСАТ NEWS", "ВОТ ТАК", "БЕЛСАТ NOW", "Реальная Беларусь", "Charter97video", "ЖЭСТАЧАЙШЫЙ МУЛЬТ"];                         //Channel names/titles

  var Buttons = document.querySelectorAll('#menu ytd-toggle-button-renderer button.style-scope.yt-icon-button');        //Get button values
  var LikeState = Buttons[0].attributes["aria-pressed"].nodeValue;                                                      //Get buttons state
  if(LikeState==="true"){return;}                                                                                       //If the status is "true", the script will be stopped. If the status is "false", the script will continue.

    for (var i = 0; i < 10; i++) {                                                                                      //Create a loop between 1 and 10

        if((document.getElementsByClassName('yt-simple-endpoint style-scope yt-formatted-string')[i].href.indexOf('/user/') >= 0 || document.getElementsByClassName('yt-simple-endpoint style-scope yt-formatted-string')[i].href.indexOf('/c/') >= 0 || document.getElementsByClassName('yt-simple-endpoint style-scope yt-formatted-string')[i].href.indexOf('/channel/') >= 0) && Channels.includes(document.getElementsByClassName('yt-simple-endpoint style-scope yt-formatted-string')[i].innerHTML)){            //If href contains "/c/" AND channel name is in array then ...

        document.getElementsByClassName("style-scope ytd-toggle-button-renderer")[1].click();                            //Set like
        i=11;                                                                                                            //Define  max. value to leave FOR loop

        }
    }
}
setInterval(OppoYoutubeLiker, 10000);                                                                                     //Define interval in which a like will be checked. Check every 10 seconds.

