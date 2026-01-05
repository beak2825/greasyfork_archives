// jscs:disable
// ==UserScript==
// @name         Notifications
// @namespace    https://*.waysofhistory.com/
// @version      0.5
// @description  show desktop notifications
// @author       menya
// @match        https://*.waysofhistory.com/*
// @exclude      https://ruforum.waysofhistory.com/
// @exclude      https://ru.waysofhistory.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22524/Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/22524/Notifications.meta.js
// ==/UserScript==

(function () {

  var REPORT_TYPE = {
    0: 'Научный отчет',
    1: 'Основание нового города',

    2: 'Финансы',
    6: 'Финансы',
    7: 'Финансы',
    17: 'Финансы',
    18: 'Финансы',
    31: 'Финансы',

    3: 'Военный отчет',
    4: 'Дипломатия',
    5: 'Остановка мира',

    8: 'Торговый отчет',
    16: 'Торговый отчет',
    25: 'Торговый отчет',
    26: 'Торговый отчет',
    30: 'Торговый отчет',

    9: 'Платеж',
    10: 'Ветер Удачи',
    11: 'Перечисление Монет Удачи',
    12: 'Торговое предложение',
    13: 'Заселение',
    14: 'Поздравление',
    15: 'Бонус-код',
    19: 'Военный отчет',
    20: 'Военный отчет',
    21: 'Военный отчет',
    22: 'Отчет о подкреплении',
    23: 'Отчет казначейства',
    24: 'Отчет о транспортировке',
    27: 'Голод',
    28: 'Дипломатия',
    29: 'Разведка',
    32: 'Управление городом'
  };

  // Сделаем себе царь-аккаунт
  Account.prototype.isPremium = function () {
    return true;
  };

  // вырубим "Ты не одинок"
  Appl.prototype.initRefNotif = function () {
    return true;
  };

  // Запросим разрешение на выдачу уведомлений
  Notification.requestPermission();

  // функция для показа оповещения
  function notif(title, body) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + " " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds() + ' ';
    var newNotif = new Notification(datetime + title, {
      icon: 'https://lh6.googleusercontent.com/V0Va2fD54HtOr1N7z6Mv_XSZQBBQdxA-7susY75wwd5NbbRxEsI4obfUO71IyMoMMjH85DvH=s50-h50-e365-rw',
      requireInteraction: true,
      body: body
    });
    // скрываем по клику
    newNotif.addEventListener('click', function () {
      newNotif.close();
    });
  }

  var initCheck = setInterval(function () {
    if (webSocketMgr.dataInited) {
      clearTimeout(initCheck);
      for (var town in wofh.towns) {
        localStorage.setItem(town, JSON.stringify(wofh.towns[town].build));
      }
    }
  }, 400);

  function wsdecorator(func) {
    return function () {
      try {

        var message = JSON.parse(arguments[0].data);

        switch (message.type) {
          case 10:

            if (message.data.writer[0] !== servodata.account.id) {
              notif('Новое сообщение от ' + message.data.writer[1], message.data.text);
            }

            break;
          case 3:
            if ([8, 16, 25, 26, 30, 24].indexOf(message.data.type) == -1) {
              notif('Новый отчет: "' + REPORT_TYPE[message.data.type] + ' "');
            }
            break;
          case 8:
            if (message.data.quests) {
              notif('Выполнили или появился новый квест!');
            }
            break;
          case 14:

            if (message.data.clickers && message.data.clickers.add) {
              notif(wofh.towns[message.data.id].name + ' Новые таблички!', JSON.stringify(message.data.clickers));
            }

            if (message.data.army) {
              notif(wofh.towns[message.data.id].name + ' Завершили тренировку войск!');
            }

            if (message.data.build) {
              var saved = JSON.parse(localStorage.getItem(message.data.id));

              for (var itown in message.data.build.state) {
                if ((saved.state[itown] && (message.data.build.state[itown][1] != saved.state[itown][1])) || !saved.state[itown]) {
                  localStorage.setItem(message.data.id, JSON.stringify(message.data.build));
                  notif(wofh.towns[message.data.id].name + ' Достроили здание:',
                      '"' + Build.lib[message.data.build.state[itown][0]].name + ' - ' +
                      message.data.build.state[itown][1] + ' уровень. ' + itown + ' квартал"');
                }
              }

            }

            break;
        }

      } catch (e) {
        notif('Возникла ошибка:', e);
      } finally {
        func.apply(this, arguments);
      }

    };
  }

  try {
    webSocketMgr.ws.onmessage = wsdecorator(webSocketMgr.ws.onmessage);
  } catch (e) {
    notif('Возникла ошибка:', e);
  }

})();