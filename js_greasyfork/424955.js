// ==UserScript==
// @name Block video from Youtube
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Удаляем видео из просмотра в Youtube по ключевым словам.
// @author ELForcer
// @match https://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/424955/Block%20video%20from%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/424955/Block%20video%20from%20Youtube.meta.js
// ==/UserScript==

//Блокировать видео по следующим ключевым словам
let List = ["МАЙНКРАФТ", "AMONG US", "WAR ROBOTS", "ПЕППА", "MINECRAFT", "SPORE", "SUBNAUTICA", "СУБНАУТИКА"]

function CheckYouTube(CheckString)
{
  //console.log('Проверяем: ' + CheckString);
  //Если видео уже запущено
    if (document.getElementsByClassName('style-scope ytd-video-primary-info-renderer').legth>0)
    {
        if (document.getElementsByClassName('style-scope ytd-video-primary-info-renderer')[0].innerText.toUpperCase().indexOf(CheckString) >= 0)
        {
            window.location.replace('about:blank'); //Что делать в случае блокировки, например перейти сюда
        }
    }

  //Удалить из главной страницы
  var D = document.getElementsByTagName('ytd-rich-item-renderer').length;
   if (D>0)
   {
       for (let A = 0; D > A; A++)
       {
           if (document.getElementsByTagName('ytd-rich-item-renderer')[A].innerText.toUpperCase().indexOf(CheckString) >= 0)
           {
               console.log('Удалили элемент с главной страницы, содержащий: ' + CheckString)
               document.getElementsByTagName('ytd-rich-item-renderer')[A].outerHTML = "";
           }
       }
   }

  //Удалить из поисковой выдачи
  D = document.getElementsByTagName('ytd-item-section-renderer').length;
  for (let A = 0; D > A; A++)
  {
    if (document.getElementsByTagName('ytd-item-section-renderer')[A].innerText.toUpperCase().indexOf(CheckString) >= 0)
    {
      console.log('Удалили элемент из поиска, содержащий: ' + CheckString)
      document.getElementsByTagName('ytd-item-section-renderer')[A].outerHTML = "";
    }
  }

  //Тут будет удалить из рекомендации (блок справа)..
  D = document.getElementsByTagName('ytd-compact-video-renderer').length;
  for (let A = 0; D > A; A++)
  {
    if (document.getElementsByTagName('ytd-compact-video-renderer')[A].innerText.toUpperCase().indexOf(CheckString) >= 0)
    {
      console.log('Удалили элемент справа, содержащий: ' + CheckString)
      document.getElementsByTagName('ytd-compact-video-renderer')[A].outerHTML = "";
    }
  }
}

//Прогоняем массив ключевым словам
function StartCheck()
{
  for (let A = 0; List.length > A; A++)
  {
    CheckYouTube(List[A]);
  }
}
//Проверять каждые 3 секунды. Например, если ищут нужное видео через поиск и нужно удалить видео из выдачи или из рекомендаций.
setInterval(() => StartCheck(), 3000);