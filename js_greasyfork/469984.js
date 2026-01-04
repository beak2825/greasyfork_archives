// ==UserScript==
// @name         HELPER MOBILE
// @namespace    forum.matrp.ru
// @version      1.6
// @description  Скрипт, который автоматизирует вашу работу на форуме.
// @author       Suslov
// @match        https://forum.matrp.ru/index.php*
// @icon         https://sun9-74.userapi.com/impg/5bCIl6SS_JNzHQTvYVbCif9o7swsyT_SoVue-Q/wzryYvgC264.jpg?size=243x245&quality=96&sign=060a030f6888217975c74292c2fa68d9&type=album
// @copyright 2023, Suslov
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469984/HELPER%20MOBILE.user.js
// @updateURL https://update.greasyfork.org/scripts/469984/HELPER%20MOBILE.meta.js
// ==/UserScript==

    (function() {
      'use strict';

      function changeBackground() {
        var savedBackground = localStorage.getItem('background');
        if (savedBackground) {
          document.body.style.backgroundImage = 'url(' + savedBackground + ')';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.backgroundSize = 'cover';
        }
        console.log('Фон изменен');
      }

      function setBackground() {
        var background = prompt('Введите ссылку на фон, если вы хотите вернуть стандартную тему, просто оставьте поле пустым и нажмите ОК:');
        localStorage.setItem('background', background);
        changeBackground();
      }

      var buttonfon = document.createElement('button');
      buttonfon.textContent = 'Изменить фон';
      buttonfon.style.position = 'fixed';
      buttonfon.style.left = '10px'; // Изменено положение кнопки для мобильных устройств
      buttonfon.style.bottom = '10px';
      buttonfon.style.transform = 'scale(0.7) translateY(30%)';
      buttonfon.style.zIndex = '9999';
      buttonfon.style.opacity = '0.1';
      buttonfon.style.color = 'black';
      buttonfon.style.padding = '5px 10px';
      buttonfon.style.fontSize = '14px';
      document.body.appendChild(buttonfon);

      changeBackground();

      buttonfon.addEventListener('click', setBackground);
     var approveButtonText, pendingButtonText, notInFormButtonText;

        // Проверяем, был ли скрипт запущен ранее
        var isFirstRun = localStorage.getItem('helperScriptFirstRun') === null;

        var scriptId = '469264';
    var currentVersion = GM_info.script.version; // Текущая версия скрипта

    function checkForUpdates() {
      var apiURL = `https://greasyfork.org/en/scripts/469984.json`;

      fetch(apiURL)
        .then(response => response.json())
        .then(scriptInfo => {
          var latestVersion = scriptInfo.version;

          if (latestVersion > currentVersion) {
            var confirmUpdate = confirm('Вышло новое обновление скрипта! Хотите обновить его прямо сейчас?');

            if (confirmUpdate) {
              redirectToGreasyFork();
            }
          }
        })
        .catch(error => {
          console.error('Ошибка при проверке обновлений:', error);
        });
    }

    function redirectToGreasyFork() {
      window.location.href = `https://greasyfork.org/ru/scripts/469984-helper-mobile`;
    }

    // Проверяем наличие новых обновлений
    checkForUpdates();

        // Если это первый запуск, отображаем окошко приветствия
        if (isFirstRun) {
            alert('Добро пожаловать! Этот скрипт поможет автоматизировать вашу работу на форуме! Но сначала, вам нужно ввести базовые ответы, который будут использоваться при нажатии на кнопки. Вы сможете сбросить их позже, через кнопку "Сброс"');

            let punishAdminButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку "Накажем админа":');
    let punishPlayerButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Накажем игрока":');
    let requestOpruButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Запрошу опру":');
    let passOnButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Передам":');
    let notInFormButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Не по форме":');
    let approvedFormButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Выдано по форме":');
    let approvedCorrectButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Выдано верно":');
    let answerAboveButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Ответ выше":');
    let copyPasteButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Копипаст":');
    let solvedButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку  "Решено":');
    let appealApprovedButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку "Обжалование одобрено":');
    let appealRejectedButtonText = prompt('Введите текст, который будет вставляться при нажатии на кнопку "Обжалование отказано":');

    // Заменяем символы "\n" на переносы на новую строку
    punishAdminButtonText = punishAdminButtonText.replace(/\\n/g, "\n");
    punishPlayerButtonText = punishPlayerButtonText.replace(/\\n/g, "\n");
    requestOpruButtonText = requestOpruButtonText.replace(/\\n/g, "\n");
    passOnButtonText = passOnButtonText.replace(/\\n/g, "\n");
    notInFormButtonText = notInFormButtonText.replace(/\\n/g, "\n");
    approvedFormButtonText = approvedFormButtonText.replace(/\\n/g, "\n");
    approvedCorrectButtonText = approvedCorrectButtonText.replace(/\\n/g, "\n");
    answerAboveButtonText = answerAboveButtonText.replace(/\\n/g, "\n");
    copyPasteButtonText = copyPasteButtonText.replace(/\\n/g, "\n");
    solvedButtonText = solvedButtonText.replace(/\\n/g, "\n");
    appealApprovedButtonText = appealApprovedButtonText.replace(/\\n/g, "\n");
    appealRejectedButtonText = appealRejectedButtonText.replace(/\\n/g, "\n");



            localStorage.setItem('helperScriptFirstRun', 'false');
            localStorage.setItem('punishAdminButtonText', punishAdminButtonText);
            localStorage.setItem('pendingButtonText', pendingButtonText);
            localStorage.setItem('notInFormButtonText', notInFormButtonText);
            localStorage.setItem('punishPlayerButtonText', punishPlayerButtonText);
            localStorage.setItem('passOnButtonText', passOnButtonText);
            localStorage.setItem('requestOpruButtonText', requestOpruButtonText);
            localStorage.setItem('approvedFormButtonText', approvedFormButtonText);
            localStorage.setItem('approvedCorrectButtonText', approvedCorrectButtonText);
            localStorage.setItem('answerAboveButtonText', answerAboveButtonText);
            localStorage.setItem('copyPasteButtonText', copyPasteButtonText);
            localStorage.setItem('solvedButtonText', solvedButtonText);
            localStorage.setItem('appealApprovedButtonText', appealApprovedButtonText);
            localStorage.setItem('appealRejectedButtonText', appealRejectedButtonText);
        } else {
            // Получаем сохраненные значения текста кнопок из локального хранилища
    let approveButtonText = localStorage.getItem('approveButtonText');
    let pendingButtonText = localStorage.getItem('pendingButtonText');
    let notInFormButtonText = localStorage.getItem('notInFormButtonText');
    let passOnButtonText = localStorage.getItem('passOnButtonText');
    let requestOpruButtonText = localStorage.getItem('requestOpruButtonText');
    let punishAdminButtonText = localStorage.getItem('punishAdminButtonText');
    let punishPlayerButtonText = localStorage.getItem('punishPlayerButtonText');
    let approvedFormButtonText = localStorage.getItem('approvedFormButtonText');
    let approvedCorrectButtonText = localStorage.getItem('approvedCorrectButtonText');
    let answerAboveButtonText = localStorage.getItem('answerAboveButtonText');
    let copyPasteButtonText = localStorage.getItem('copyPasteButtonText');
    let solvedButtonText = localStorage.getItem('solvedButtonText');
    let appealApprovedButtonText = localStorage.getItem('appealApprovedButtonText');
    let appealRejectedButtonText = localStorage.getItem('appealRejectedButtonText');
        }
        // Получаем элемент на странице
        var formButtonGroup = document.querySelector('.formButtonGroup');

        // Проверяем, что элемент найден
        if (formButtonGroup) {
            // Создаем контейнер для кнопок
            var buttonsContainer = document.createElement('div');
            buttonsContainer.style.display = 'inline-block';


            // Создаем кнопки
            var punishAdminButton = createButton('Накажем админа', 'punish-admin');
    var punishPlayerButton = createButton('Накажем игрока', 'punish-player');
    punishAdminButton.style.display = 'none'; // Начально скрываем кнопку "Накажем админа"
    punishPlayerButton.style.display = 'none'; // Начально скрываем кнопку "Накажем игрока"
            var requestOpruButton = createButton('Запрошу опру', 'request-opru');
            var passOnButton = createButton('Передам', 'pass-on');
            requestOpruButton.style.display = 'none'; // Начально скрываем кнопку "Запрошу опру"
            passOnButton.style.display = 'none'; // Начально скрываем кнопку "Передам"
            var approveButton = createButton('Одобрено', 'approve');
            var solvedButton = createButton('Решено', 'solved');
            buttonsContainer.appendChild(solvedButton);
            var pendingButton = createButton('На рассмотрении', 'pending');
            var rejectButton = createButton('Отказано', 'reject');
            var notInFormButton = createButton('Не по форме', 'not-in-form');
            notInFormButton.style.display = 'none'; // Добавляем эту строку для скрытия кнопки "Не по форме" по умолчанию
            var approvedFormButton = createButton('Выдано по форме', 'approved-form');
            var approvedCorrectButton = createButton('Выдано верно', 'approved-correct');
            var answerAboveButton = createButton('Ответ выше', 'answer-above');
            var copyPasteButton = createButton('Копипаст', 'copy-paste');
            var appealButton = createButton('Обжалование', 'appeal');
            var appealApprovedButton = createButton('Обжалование одобрено', 'appeal-approved');
            var appealRejectedButton = createButton('Обжалование отказано', 'appeal-rejected');
            appealApprovedButton.style.display = 'none'; // Изначально скрываем кнопку "Обжалование одобрено"
            appealRejectedButton.style.display = 'none'; // Изначально скрываем кнопку "Обжалование отказано"
            var rpBiographyButton = createButton('РП биографии', 'rp-biography');
            var copyButton = createButton('Копипаст', 'copy-paste');
            var briefButton = createButton('Кратко', 'brief');
            var incorrectAgeButton = createButton('Возраст неправильный', 'incorrect-age');
            var age18PlusButton = createButton('18+', 'age-18-plus');
            copyButton.style.display = 'none';
            briefButton.style.display = 'none';
            incorrectAgeButton.style.display = 'none';
            age18PlusButton.style.display = 'none';




            buttonsContainer.appendChild(approveButton);
            buttonsContainer.appendChild(pendingButton);
            buttonsContainer.appendChild(rejectButton);
            buttonsContainer.appendChild(notInFormButton);
            buttonsContainer.appendChild(punishAdminButton);
            buttonsContainer.appendChild(punishPlayerButton);
            buttonsContainer.appendChild(requestOpruButton);
            buttonsContainer.appendChild(passOnButton);
            buttonsContainer.appendChild(approvedFormButton);
            buttonsContainer.appendChild(approvedCorrectButton);
            buttonsContainer.appendChild(answerAboveButton);
            buttonsContainer.appendChild(copyPasteButton);
            buttonsContainer.appendChild(appealButton);
            buttonsContainer.appendChild(appealApprovedButton);
            buttonsContainer.appendChild(appealRejectedButton);
            buttonsContainer.appendChild(rpBiographyButton);
            buttonsContainer.appendChild(copyButton);
            buttonsContainer.appendChild(briefButton);
            buttonsContainer.appendChild(incorrectAgeButton);
            buttonsContainer.appendChild(age18PlusButton);


            // Создаем контейнер для кнопок префиксов
    var buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.marginTop = "10px";

    // Создаем кнопки с новыми названиями
    var button1 = createButton("Префикс Одобрено",'button1')
    var button2 = createButton("Префикс На рассмотрении",'button2')
    var button3 = createButton("Префикс Отказано",'button3')
    var button4 = createButton("Префикс Решено",'button4')
    var button5 = createButton("Убрать префикс",'button5')

    // Добавляем кнопки в контейнер
    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
    buttonContainer.appendChild(button3);
    buttonContainer.appendChild(button4);
    buttonContainer.appendChild(button5);

    // Добавляем стили для мобильных экранов
    var mediaQuery = window.matchMedia("(max-width: 480px)");
    if (mediaQuery.matches) {
      buttonContainer.style.flexDirection = "column";
      buttonContainer.style.alignItems = "flex-start";
      // Уменьшаем размер шрифта кнопок
      var buttons = buttonContainer.querySelectorAll("button");
      buttons.forEach(function(button) {
        button.style.fontSize = "14px";
        button.style.padding = "5px 10px";
      });
    }



    // Находим элемент, к которому нужно добавить контейнер с кнопками
    var targetElement = document.querySelector("#top > div.p-body > div > div.uix_contentWrapper > div > div > div > div.block.block--messages > div:nth-child(2)");

    // Добавляем контейнер с кнопками после указанного элемента
    targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
            // Вставляем контейнер с кнопками рядом с элементом
            formButtonGroup.appendChild(buttonsContainer);

            // Добавляем обработчики событий для кнопок
            var isPunishButtonsVisible = false; // Флаг для отслеживания видимости кнопок "Накажем админа" и "Накажем игрока"

     // Флаг для отслеживания видимости дочерних кнопок "РП биографии"
    var isRPBiographyButtonsVisible = false;

    // Функция для отображения или скрытия дочерних кнопок "РП биографии"
    function toggleRPBiographyButtons() {
        event.preventDefault(); // Отменяем действие по умолчанию (вставку текста и отправку)
      if (isRPBiographyButtonsVisible) {
        copyButton.style.display = 'none';
        briefButton.style.display = 'none';
        incorrectAgeButton.style.display = 'none';
        age18PlusButton.style.display = 'none';
        isRPBiographyButtonsVisible = false;
      } else {
        copyButton.style.display = 'inline-block';
        briefButton.style.display = 'inline-block';
        incorrectAgeButton.style.display = 'inline-block';
        age18PlusButton.style.display = 'inline-block';
        isRPBiographyButtonsVisible = true;
      }
    }

    // Назначаем функцию toggleRPBiographyButtons на событие "click" для кнопки "РП биографии"
    rpBiographyButton.addEventListener('click', toggleRPBiographyButtons);
            // Обработчик нажатия на кнопку "Обжалование"
    var isAppealButtonsVisible = false; // Флаг для отслеживания видимости кнопок "Обжалование одобрено" и "Обжалование отказано"
    appealButton.addEventListener('click', function() {
        event.preventDefault(); // Отменяем действие по умолчанию (вставку текста и отправку)
      if (isAppealButtonsVisible) {
        appealApprovedButton.style.display = 'none';
        appealRejectedButton.style.display = 'none';
        isAppealButtonsVisible = false;
      } else {
        appealApprovedButton.style.display = 'inline-block';
        appealRejectedButton.style.display = 'inline-block';
        isAppealButtonsVisible = true;
      }
    });
    approveButton.addEventListener('click', function() {
        event.preventDefault(); // Отменяем действие по умолчанию (вставку текста и отправку)
        if (isPunishButtonsVisible) {
            punishAdminButton.style.display = 'none'; // Скрываем кнопку "Накажем админа"
            punishPlayerButton.style.display = 'none'; // Скрываем кнопку "Накажем игрока"
            isPunishButtonsVisible = false; // Устанавливаем флаг видимости в false
        } else {
            punishAdminButton.style.display = 'inline-block'; // Показываем кнопку "Накажем админа"
            punishPlayerButton.style.display = 'inline-block'; // Показываем кнопку "Накажем игрока"
            isPunishButtonsVisible = true; // Устанавливаем флаг видимости в true
        }
    });
       let solvedButtonText = localStorage.getItem('solvedButtonText');
             solvedButton.addEventListener('click', function() {
     var prefix = localStorage.getItem('prefix1'); // Получаем значение префикса "Решено"

      // Если префикс не установлен, используем базовый префикс "4"
      if (!prefix) {
        prefix = "4";
      }
                 insertText(solvedButtonText);
      applyPrefix(prefix);
    });
           pendingButton.addEventListener('click', function() {
            event.preventDefault(); // Отменяем действие по умолчанию (вставку текста и отправку)
            if (isAdditionalButtonsVisible) {
           requestOpruButton.style.display = 'none'; // Скрываем кнопку "Запрошу опру"
        passOnButton.style.display = 'none'; // Скрываем кнопку "Передам"
        isAdditionalButtonsVisible = false; // Устанавливаем флаг видимости в false
      } else {
        requestOpruButton.style.display = 'inline-block'; // Показываем кнопку "Запрошу опру"
        passOnButton.style.display = 'inline-block'; // Показываем кнопку "Передам"
        isAdditionalButtonsVisible = true; // Устанавливаем флаг видимости в true
      }
    });

    var isAdditionalButtonsVisible = false; // Флаг для отслеживания видимости кнопок "Запрошу опру" и "Передам"


            let punishAdminButtonText = localStorage.getItem('punishAdminButtonText');
            let punishPlayerButtonText = localStorage.getItem('punishPlayerButtonText');

            punishAdminButton.addEventListener('click', function() {
         var prefix = localStorage.getItem('prefix2'); // Получаем значение префикса "Накажем админа"

      // Если префикс не установлен, используем базовый префикс "9"
      if (!prefix) {
        prefix = "9";
      }
                 insertText(punishAdminButtonText);
      applyPrefix(prefix);
    });
            let passOnButtonText = localStorage.getItem('passOnButtonText');
            let requestOpruButtonText = localStorage.getItem('requestOpruButtonText');
        passOnButton.addEventListener('click', function() {
        var prefix = localStorage.getItem('prefix3'); // Получаем значение префикса "Передам"

      // Если префикс не установлен, используем базовый префикс "6"
      if (!prefix) {
        prefix = "6";
      }
                 insertText(passOnButtonText);
      applyPrefix(prefix);
    });
            requestOpruButton.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix4'); // Получаем значение префикса "Запрошу опру"

      // Если префикс не установлен, используем базовый префикс "6"
      if (!prefix) {
        prefix = "6";
      }
                 insertText(requestOpruButtonText);
      applyPrefix(prefix);
    });
            punishPlayerButton.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix5'); // Получаем значение префикса "Накажу игрока"

      // Если префикс не установлен, используем базовый префикс "9"
      if (!prefix) {
        prefix = "9";
      }
                 insertText(punishPlayerButtonText);
      applyPrefix(prefix);
    });
            let approvedFormButtonText = localStorage.getItem('approvedFormButtonText');
            let approvedCorrectButtonText = localStorage.getItem('approvedCorrectButtonText');
            let answerAboveButtonText = localStorage.getItem('answerAboveButtonText');
            let copyPasteButtonText = localStorage.getItem('copyPasteButtonText');
            approvedFormButton.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix6'); // Получаем значение префикса "Выдано по форме"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(approvedFormButtonText);
      applyPrefix(prefix);
    });

    approvedCorrectButton.addEventListener('click', function() {
             var prefix = localStorage.getItem('prefix7'); // Получаем значение префикса "Выдано верно"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(approvedCorrectButtonText);
      applyPrefix(prefix);
    });

    answerAboveButton.addEventListener('click', function() {
       var prefix = localStorage.getItem('prefix8'); // Получаем значение префикса "Ответ выше"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(answerAboveButtonText);
      applyPrefix(prefix);
    });

    copyPasteButton.addEventListener('click', function() {
        var prefix = localStorage.getItem('prefix9'); // Получаем значение префикса "Копипаст"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(copyPasteButtonText);
      applyPrefix(prefix);
    });
       let notInFormButtonText = localStorage.getItem('notInFormButtonText');
    notInFormButton.addEventListener('click', function() {
         var prefix = localStorage.getItem('prefix10'); // Получаем значение префикса "Не по форме"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(notInFormButtonText);
      applyPrefix(prefix);
    });

      let appealApprovedButtonText = localStorage.getItem('appealApprovedButtonText');
      let appealRejectedButtonText = localStorage.getItem('appealRejectedButtonText');
    appealApprovedButton.addEventListener('click', function() {
        var prefix = localStorage.getItem('prefix11'); // Получаем значение префикса "Обжалование одобрено"

      // Если префикс не установлен, используем базовый префикс "9"
      if (!prefix) {
        prefix = "9";
      }
                 insertText(appealApprovedButtonText);
      applyPrefix(prefix);
    });

    appealRejectedButton.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix12'); // Получаем значение префикса "Обжалование отказано"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
                 insertText(appealRejectedButtonText);
      applyPrefix(prefix);
    });

          var areAdditionalButtonsVisible = false; // Флаг для отслеживания видимости дополнительных кнопок
    button1.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix13'); // Получаем значение префикса "Установить префикс одобрено"

      // Если префикс не установлен, используем базовый префикс "9"
      if (!prefix) {
        prefix = "9";
      }
      applyPrefix(prefix);
    });
            button2.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix14'); // Получаем значение префикса "Установить префикс на рассмотрении"

      // Если префикс не установлен, используем базовый префикс "6"
      if (!prefix) {
        prefix = "6";
      }
      applyPrefix(prefix);
    });
           button3.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix15'); // Получаем значение префикса "Установить префикс отказано"

      // Если префикс не установлен, используем базовый префикс "5"
      if (!prefix) {
        prefix = "5";
      }
      applyPrefix(prefix);
    });
    button4.addEventListener('click', function() {
          var prefix = localStorage.getItem('prefix16'); // Получаем значение префикса "Установить префикс решено"

      // Если префикс не установлен, используем базовый префикс "4"
      if (!prefix) {
        prefix = "4";
      }
      applyPrefix(prefix);
    });
    button5.addEventListener('click', function() {
      applyPrefix('0');
    });

    rejectButton.addEventListener('click', function() {
        event.preventDefault();
        if (areAdditionalButtonsVisible) {
            notInFormButton.style.display = 'none';
            approvedFormButton.style.display = 'none';
            approvedCorrectButton.style.display = 'none';
            answerAboveButton.style.display = 'none';
            copyPasteButton.style.display = 'none';
            areAdditionalButtonsVisible = false;
        } else {
            notInFormButton.style.display = 'inline-block';
            approvedFormButton.style.display = 'inline-block';
            approvedCorrectButton.style.display = 'inline-block';
            answerAboveButton.style.display = 'inline-block';
            copyPasteButton.style.display = 'inline-block';
            areAdditionalButtonsVisible = true;
        }
    });

    notInFormButton.style.display = 'none';
    approvedFormButton.style.display = 'none';
    approvedCorrectButton.style.display = 'none';
    answerAboveButton.style.display = 'none';
    copyPasteButton.style.display = 'none';

            // Создаем кнопку "Настройки"
    var settingsprefixButton = document.createElement("button");
    settingsprefixButton.innerHTML = "Настройки";
    settingsprefixButton.classList.add("settings-button");

    // Обработчик события для открытия настроек
    function openSettingsDialog() {
      // Переменные для хранения id префиксов
      var prefix1, prefix2, prefix3, prefix4, prefix5, prefix6, prefix7, prefix8, prefix9, prefix10, prefix11, prefix12, prefix13, prefix14, prefix15, prefix16;

      // Создаем промпты для каждого id префикса и сохраняем значения в переменные
      prefix1 = prompt('Введите id префикса для кнопки "РЕШЕНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено :');
      prefix2 = prompt('Введите id префикса для кнопки "НАКАЖЕМ АДМИНА" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix3 = prompt('Введите id префикса для кнопки "ПЕРЕДАМ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix4 = prompt('Введите id префикса для кнопки "ЗАПРОШУ ОПРУ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix5 = prompt('Введите id префикса для кнопки "НАКАЖУ ИГРОКА" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix6 = prompt('Введите id префикса для кнопки "НЕ ПО ФОРМЕ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix7 = prompt('Введите id префикса для кнопки "ВЫДАНО ПО ФОРМЕ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix8 = prompt('Введите id префикса для кнопки "ВЫДАНО ВЕРНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix9 = prompt('Введите id префикса для кнопки "ОТВЕТ ВЫШЕ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix10 = prompt('Введите id префикса для кнопки "КОПИПАСТ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix11 = prompt('Введите id префикса для кнопки "ОБЖАЛОВАНИЕ ОДОБРЕНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено');
      prefix12 = prompt('Введите id префикса для кнопки "ОБЖАЛОВАНИЕ ОТКАЗАНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено');
      prefix13 = prompt('Введите id префикса для кнопки "УСТАНОВИТЬ ПРЕФИКС ОДОБРЕНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix14 = prompt('Введите id префикса для кнопки "УСТАНОВИТЬ ПРЕФИКС НА РАССМОТРЕНИИ" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix15 = prompt('Введите id префикса для кнопки "УСТАНОВИТЬ ПРЕФИКС ОТКАЗАНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');
      prefix16 = prompt('Введите id префикса для кнопки "УСТАНОВИТЬ ПРЕФИКС РЕШЕНО" Для справки: ID 4 префикс Решено, ID 5 Префикс Отказано, ID 6 префикс На рассмотрении, ID 10 Префикс На рассмотрении(для 5-к), ID 9 префикс Одобрено:');

      // Сохраняем значения id префиксов в памяти браузера
      localStorage.setItem('prefix1', prefix1);
      localStorage.setItem('prefix2', prefix2);
      localStorage.setItem('prefix3', prefix3);
      localStorage.setItem('prefix4', prefix4);
      localStorage.setItem('prefix5', prefix5);
      localStorage.setItem('prefix6', prefix6);
      localStorage.setItem('prefix7', prefix7);
      localStorage.setItem('prefix8', prefix8);
      localStorage.setItem('prefix9', prefix9);
      localStorage.setItem('prefix10', prefix10);
      localStorage.setItem('prefix11', prefix11);
      localStorage.setItem('prefix12', prefix12);
      localStorage.setItem('prefix13', prefix13);
      localStorage.setItem('prefix14', prefix14);
      localStorage.setItem('prefix15', prefix15);
      localStorage.setItem('prefix16', prefix16);
      // Выводим значения id префиксов в консоль
      console.log('Первый префикс:', prefix1);
      console.log('Второй префикс:', prefix2);
      console.log('Третий префикс:', prefix3);
      console.log('Четвертый префикс:', prefix4);
      console.log('Пятый префикс:', prefix5);
      console.log('Шестой префикс:', prefix6);
      console.log('Седьмой префикс:', prefix7);
      console.log('Восьмой префикс:', prefix8);
      console.log('Девятый префикс:', prefix9);
      console.log('Десятый префикс:', prefix10);
      console.log('Одиннадцатый префикс:', prefix11);
      console.log('Двенадцатый префикс:', prefix12);
      console.log('Тринадцатый префикс:', prefix13);
      console.log('Четырнадцатый префикс:', prefix14);
      console.log('15 префикс:', prefix15);
      console.log('16 префикс:', prefix16);
    }

    // Остальной код остается без изменений
       var settingsButton = document.createElement("button");
    settingsButton.innerHTML = "Настройки префиксов";
    settingsButton.classList.add("settings-button");

    settingsButton.style.position = "fixed";
    settingsButton.style.bottom = "40px"; // Увеличим высоту от нижнего края экрана
    settingsButton.style.right = "8px"; // Увеличим отступ от правого края экрана
    settingsButton.style.padding = "5px 8px"; // Уменьшим внутренние отступы
    settingsButton.style.fontSize = "10px"; // Уменьшим размер шрифта
    settingsButton.style.backgroundColor = "steelblue";
    settingsButton.style.color = "white";

    settingsButton.addEventListener("click", openSettingsDialog);

    document.body.appendChild(settingsButton);

            // Создаем кнопку "Сброс настроек"
    var resetButton = document.createElement("button");
    resetButton.innerHTML = "Сброс";
    resetButton.classList.add("reset-button");

    // Стилизуем кнопку
    resetButton.style.position = "fixed";
    resetButton.style.bottom = "40px";
    resetButton.style.left = "10px";
    resetButton.style.padding = "5px 8px";
    resetButton.style.fontSize = "10px";
    resetButton.style.backgroundColor = 'steelblue';
    settingsButton.style.color = "white";

    // Добавляем обработчик события на кнопку
    resetButton.addEventListener("click", resetSettings);

    // Функция сброса настроек
    function resetSettings() {
    // Сброс всех значений в localStorage
      localStorage.clear();
    }

    // Добавляем кнопку на страницу
    document.body.appendChild(resetButton);

              // Функция для создания кнопки
            function createButton(text, className) {
                var button = document.createElement('button');
                button.textContent = text;
                button.className = 'fr-command ' + className;
                button.style.marginRight = '5px';

                // Применяем стили для цвета кнопок
       if (className === 'approve') {
        button.style.backgroundColor = 'lightgreen';
    } else if (className === 'pending') {
        button.style.backgroundColor = 'gold';
    } else if (className === 'reject') {
        button.style.backgroundColor = 'salmon';
    } else if (className === 'not-in-form') {
        button.style.backgroundColor = 'darkred';
    } else if (className === 'punish-admin') {
        button.style.backgroundColor = 'plum';
    } else if (className === 'punish-player') {
        button.style.backgroundColor = 'skyblue';
    } else if (className === 'request-opru') {
        button.style.backgroundColor = 'pink';
    } else if (className === 'pass-on') {
        button.style.backgroundColor = 'lime';
    } else if (className === 'approved-form') {
        button.style.backgroundColor = 'turquoise';
    } else if (className === 'approved-correct') {
        button.style.backgroundColor = 'lightblue';
    } else if (className === 'answer-above') {
        button.style.backgroundColor = 'lavender';
    } else if (className === 'copy-paste') {
        button.style.backgroundColor = 'lightyellow';
    } else if (className === 'solved') {
        button.style.backgroundColor = 'darkgreen';
    } else if (className === 'reset-button') {
        button.style.backgroundColor = 'steelblue';
    } else if (className === 'appeal') {
        button.style.backgroundColor = 'lightcoral';
    } else if (className === 'appeal-approved') {
        button.style.backgroundColor = 'limegreen';
    } else if (className === 'appeal-rejected') {
        button.style.backgroundColor = 'darkorange';
    } else if (className === 'button1') {
        button.style.backgroundColor = 'violet';
    } else if (className === 'button2') {
        button.style.backgroundColor = 'teal';
    } else if (className === 'button3') {
        button.style.backgroundColor = 'rosybrown';
    } else if (className === 'button4') {
        button.style.backgroundColor = 'lightpink';
    } else if (className === 'button5') {
        button.style.backgroundColor = 'lightseagreen';
    }

                return button;
            }

            window.addEventListener('load', function() {
      var message = document.createElement('div');
      message.textContent = 'hELPER успешно запущен.';
      message.style.position = 'fixed';
      message.style.top = '20px';
      message.style.left = '0px';
      message.style.background = 'rgba(0, 0, 0, 0.8)';
      message.style.color = '#fff';
      message.style.padding = '10px';
      message.style.borderRadius = '5px';
      message.style.transition = 'opacity 1s ease-in-out';

      var targetElement = document.querySelector('#top > div.uix_headerContainer > div.p-navSticky.p-navSticky--primary.uix_stickyBar.is-sticky > nav');
      if (targetElement) {
        targetElement.appendChild(message);

        setTimeout(function() {
          message.style.opacity = '0';
          setTimeout(function() {
            targetElement.removeChild(message);
          }, 1000);
        }, 1000);
      }
    });
            // Функция для вставки текста в указанное окно для ввода
           function insertText(text) {
        var inputElement = document.querySelector('.fr-element');
        if (inputElement) {
            inputElement.focus();
            var range = document.createRange();
            range.selectNodeContents(inputElement);
            range.collapse(false);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('insertText', false, text);

            var buttonElement = document.querySelector('#xfBbCode-1 > i');
            if (buttonElement) {
                buttonElement.click();
                buttonElement.click();
            }
        }
    }



    // Функция для применения префикса
    function applyPrefix(prefix) {
        // Получаем все ссылки на странице
        var links = document.querySelectorAll('a');

        // Перебираем ссылки и ищем ссылку с текстом "Редактировать тему"
        var editLink;
        for (var i = 0; i < links.length; i++) {
            if (links[i].textContent.includes('Редактировать тему')) {
                editLink = links[i];
                break;
            }
        }

        // Проверяем, найдена ли ссылка "Редактировать тему"
        if (editLink) {
            // Симулируем клик на ссылке "Редактировать тему"
            editLink.click();
            console.log('Кнопка "Редактировать тему" была нажата.');

            // Добавляем задержку для загрузки меню выбора префикса
            setTimeout(function() {
                var menuTriggers = document.querySelectorAll('.menuTrigger--prefix');
    // Проверяем, найдены ли элементы
    if (menuTriggers.length > 0) {
        // Выбираем нужный элемент, например, первый элемент
        var menuTrigger = menuTriggers[0];
        // Симулируем клик на кнопке "Меню выбора префикса"
        menuTrigger.click();
        console.log('Кнопка "Меню выбора префикса" была нажата.');


                    // Получаем элемент меню выбора префикса
                    var prefixElement = findPrefixElementById(prefix);

                    // Проверяем, найден ли элемент
                    if (prefixElement) {
                        // Симулируем клик на элементе для установки префикса
                        prefixElement.click();
                        console.log('Префикс был установлен.');

                         // Если значение префикса равно 6 или 10, симулируем клик на чекбоксе "sticky"
              if (prefix === '6' || prefix === '10') {
                // Находим чекбокс "sticky"
                var stickyCheckbox = document.querySelector('input[name="sticky"]');
                // Проверяем, найден ли чекбокс "sticky"
                if (stickyCheckbox) {
                  // Симулируем клик на чекбоксе "sticky"
                  stickyCheckbox.click();
                  console.log('Чекбокс "sticky" был нажат.');
                } else {
                  console.error('Не удалось найти чекбокс "sticky".');
                }
              }

                        // Ждем некоторое время для загрузки кнопки закрытия темы
                        setTimeout(function() {
                            // Ищем кнопку для закрытия темы
                            var closeTopicButton = document.querySelector('input[name="discussion_open"]');

                            // Проверяем, найдена ли кнопка
                            if (closeTopicButton) {
                                // Симулируем клик на кнопке для закрытия темы
                                closeTopicButton.click();
                                console.log('Кнопка для закрытия темы была нажата.');

                                // Ждем некоторое время для загрузки кнопки "Сохранить"
                                setTimeout(function() {
                                    // Ищем кнопку "Сохранить"
                                    var saveButton = document.querySelector('.button--primary.button.button--icon.button--icon--save');

                                    // Проверяем, найдена ли кнопка
                                    if (saveButton) {
                                        // Симулируем клик на кнопке "Сохранить"
                                        saveButton.click();
                                        console.log('Кнопка "Сохранить" была нажата.');

                                        // Завершаем работу скрипта
                                        console.log('Скрипт выполнен успешно.');
                                    } else {
                                        console.error('Не удалось найти кнопку "Сохранить".');
                                    }
                                }, 500);
                            } else {
                                console.error('Не удалось найти кнопку для закрытия темы.');
                            }
                        }, 500);
                    } else {
                        console.error('Не удалось найти элемент префикса с id "' + prefix + '".');
                    }
                } else {
                    console.error('Не удалось найти кнопку "Меню выбора префикса".');
                }
            }, 500);
        } else {
            console.error('Не удалось найти ссылку "Редактировать тему".');
        }
    }


            // Функция для поиска элемента выбора префикса по ID префикса */
            function findPrefixElementById(prefix) {
      // Получаем все элементы выбора префикса
      var prefixElements = document.querySelectorAll('.menuPrefix');
        console.log("%cSuslov", "color:transparent; font-size:0; padding:0; margin:0; line-height:0;");

      // Перебираем элементы и ищем элемент с указанным id префикса
      for (var i = 0; i < prefixElements.length; i++) {
        if (prefixElements[i].getAttribute('data-prefix-id') === prefix) {
          return prefixElements[i];
        }
      }

      return null; // Возвращаем null, если элемент не найден
    }

        } else {
            console.error('Не удалось найти элемент .formButtonGroup.');
        }
    })();