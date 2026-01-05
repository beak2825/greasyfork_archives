// ==UserScript==
// @name        KlavoDaily ProgressBar
// @namespace   ru.ilpihp
// @description Прогресс бар для ежедневного задания
// @author Darwinian
// @version     1
// @grant       none
// @include        http://klavogonki.ru*
// @downloadURL https://update.greasyfork.org/scripts/18621/KlavoDaily%20ProgressBar.user.js
// @updateURL https://update.greasyfork.org/scripts/18621/KlavoDaily%20ProgressBar.meta.js
// ==/UserScript==
(function (window, undefined) {  // [2] нормализуем window
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
    // В юзерскрипты можно вставлять практически любые javascript-библиотеки.
    // Код библиотеки копируется прямо в юзерскрипт.
    // При подключении библиотеки нужно передать w в качестве параметра окна window
    // Пример: подключение jquery.min.js
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);

    // [3] не запускаем скрипт во фреймах
    // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
    if (w.self != w.top) {
        return;
    }
    // [4] дополнительная проверка наряду с @include
    if (/http:\/\/klavogonki\.ru/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
      var oldReal;
      
      function readProgress(){
        return $$(".user-dropdown .daily-task")[0].readAttribute('original-title');
      };
      
      function setIconStyle() {
        $$(".user-dropdown .daily-task img.icon")[0].setStyle('width: 30px;height: 30px;margin-left: 6px;');
      };
      
      function displayProgressBar(real, goal) {
        var pb = $('daily-progress-bar');
        if (!pb) {
          var htmlToInsert = "<div id='daily-progress-bar' style='margin-top: 30px;font-size: 10px;text-align: center;position: absolute;width: 100%;'>"+real+"/"+goal+"</div>";
          $$(".user-dropdown .daily-task")[0].insert(htmlToInsert);
        } else {
          pb.innerText = real+"/"+goal;
        }
      };
      
      function showProgressBar(progressString) {
        var numbers = progressString.split(" ")[1];
        var real = numbers.split("/")[0];
        var goal = numbers.split("/")[1];
        
        if (oldReal != real) {
          if (!oldReal) {
            setIconStyle();
          }
          displayProgressBar(real, goal);
          oldReal = real;
        }
        
      };
      
      var progressString;
      function waitProgress() {
        progressString = readProgress();
        
        if (progressString) {
          showProgressBar(progressString);
        }
        setTimeout(waitProgress, 1000);
      };
      
      waitProgress();
      
    }
})(window);