// ==UserScript==
// @name        special for faraway
// @namespace   https://forum.arizona-rp.com/
// @match       https://forum.arizona-rp.com/*
// @grant       none
// @version     0.2
// @author      Christopher_Wayne vk.com/chris_wayne
// @description vk.com/chris_wayne
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530369/special%20for%20faraway.user.js
// @updateURL https://update.greasyfork.org/scripts/530369/special%20for%20faraway.meta.js
// ==/UserScript==

var buttonname = "ЖБ НО";
var newButtonName = "ЖБ адм";
var settingsButtonName = "Settings";
var version = "0.2";
const RULES_LIST = [
    "2.1. ДМ (Нанесение урона без причины)ᴾᴿᴵᴹ ¹ - ТСР на 1-4 звезды | > 2 раз за 3 д. GUN BAN 7 д.",
    "2.2. ДМ сотрудника полиции или ФБР - ТСР на 3-5 звезд + GUN BAN 1 день | х2 за 5 суток GUN BAN 10 дней.",
    "2.3. ДМ(нанесение урона) в ЗЗᴾᴿᴵᴹ ² - ТСР на 6 звезд | > 2 раз за 3 д. GUN BAN 10 д.",
    "2.4. Массовый ДМ (нанесение урона 3 и более игрокам) - Бан акк + GUN BAN от 1 до 7 дней",
    "2.5. Массовый ДМ в ЗЗ (нанесение урона 3 и более игрокам) - Бан акк + GUN BAN от 1 до 15 дней",
    "2.6. Оружие в ЗЗ (держать в руке) - Изъятие оружия",
    "2.7. Оружие в ЗЗ (целиться) - 10-20 минут деморгана",
    "2.8. Оружие в ЗЗ (стрелять) - 60-120 минут деморгана",
    "2.9. ДБ (Нанесение урона машиной) - 120-240 минут деморгана",
    "2.10. ДБ в ЗЗ - 300 минут деморгана",
    "2.11. Массовое ДБ (нанесение урона 3 и более игрокам машиной) - Бан от 1 до 7 дней",
    "2.12. Массовое ДБ в ЗЗ (нанесение урона 3 и более игрокам машиной) - Бан от 1 до 15 дней",
    "2.13. СК (Нанесение урона игрокам на спавне)ᴾᴿᴵᴹ ³ - Варн",
    "2.14. ТК (Убийство или нанесение более 20 урона игрокам из своей фракции)ᴾᴿᴵᴹ ⁴ - Варн",
    "2.15. ПГ (Изображение из себя супер-героя)ᴾᴿᴵᴹ ⁵ - Варн",
    "2.16. Хил / Броня в боюᴾᴿᴵᴹ ⁶ - 120-180 минут деморгана",
    "2.17. ОФФ / АФК / Инта / Уход в ЗЗ / Аксессуар Шар / Машинка на Р/У от смерти - Варн",
    "2.18. ОФФ / АФК / Вода / Уход в ЗЗ / Инта / Аксессуар Шар / Машинка на Р/У от ареста - Варн",
    "2.19. Рп в свою сторону / Отказ / ОФФ / АФК от РП - Варн",
    "2.20. Отсутствие ответа от игрока, который не участвовал с вами в РП, на вопрос в /do не является отказом от РП. При отсутствии ответа от игрока необходимо повторить вопрос через 60 секунд. При дальнейшем отсутствии ответа необходимо уточнить у игрока в /b чат почему он не отвечает на вопрос.",
    "2.21. Сбив анимации выстрела любым способом(+ц, отводом, перекатом, сбив темпа стрельбы, и.т.п) в человека(исключение: Дм Арена) - 250-300 минут деморгана / Варн",
    "2.22. НонРП расположение переносной лавки(На дорогах,в стенке, точках спавна и так далее) - 20-30 минут деморгана",
    "2.23. НонРП дубинка на терракте - Варн",
    "2.24. НонРП медик - 120 минут деморгана",
    "2.25. НонРП сотр.тюрьмы - 120-400 минут деморгана / Варн",
    "2.26. НонРП на терракте - 120-300 минут деморгана / Варн",
    "2.27. НонРП поведение - 10-120 минут деморганаᴾᴿᴵᴹ ⁷",
    "2.28. Лёгкий багоюз (нонРП фермер и прочее) - 10-30 минут деморгана",
    "2.29. Багоюзᴾᴿᴵᴹ ⁸ - 120-300 минут деморгана / Бан",
    "2.30. Крыша автоᴾᴿᴵᴹ ⁹: - Слап/Кик при повторении",
    "2.31. Крыша палаткиᴾᴿᴵᴹ ⁹ - Слап/Кик при повторении",
    "2.32. Стол в казиноᴾᴿᴵᴹ ⁹ - Слап/Кик при повторении",
    "2.33. Сбив анимаций - 60-180 минут деморгана",
    "2.34. Сбив анимаций в ТСР - Варн",
    "2.35. Попытка избавиться от звезд путем получения деморгана (за крышу авто, стол казино и т.д.) - ТСР 1-6 звезд",
    "2.37. НонРП выполнение квеста - 60-120 минут деморгана",
    "2.38. НонРП/неадекватное название такси - 30-120 минут деморгана",
    "2.39. Серьезные нарушения в ТСР (например: дм, сбив и т.п) - Варн / Увеличение срока",
    "2.40. Неадекватное описание персонажа - Просьба поменять / Очистка описания (при отказе/неоднократно - бан на 2 дня)",
    "2.41. Бредовое описание персонажа - Просьба поменять / Очистка описания (при отказе/неоднократно - бан на 2 дня)",
    "2.41. Описание персонажа, нарушающее РП режим - Просьба поменять / Очистка описания (при отказе/неоднократно - бан на 2 дня)",
    "2.42. Реклама бизнесов, продажа имущества и т.п. через описание персонажа - Просьба поменять / Очистка описания (при отказе/неоднократно - бан на 2 дня)",
    "2.43. Уход от ареста в запрещенные места для проведения арестовᴾᴿᴵᴹ ¹⁰ - Варн игроку,коп который полез на респу арестовывать так же получит варн.",
    "2.44. Соучастие в ДМе(намеренная езда за игроками с целью их убийства вашей компанией) - Наказание как за ДМ",
    "2.45. Использование бага с бегом CJᴾᴿᴵᴹ ¹¹ - На перый раз - деморган 5 минут, дальше - 120 минут деморгана",
    "2.46. Помогать на облаве посторонним лицам(стрелять, дбшить, мешать) - Варн",
    "2.47. Употребление неадекватных выражений, матов, оскорблений, упоминания/оскорбления родных в содержимом стадии AFK - mute 300 / ban 30-2000 дней",
    "2.48. АФК на ДМ Арене в деморгане с целью сокращения срока - Удвоенное наказание/бан на 3 дня",
    "2.49. Угон авто DFT-30, которые используются для перевозки бочек с нефтевышек(машиной механиков, копов) - 400 минут деморгана / Если игрок уже получал деморган за этот пункт, то он получает бан на 5 дней.",
    "2.50. Использовать любые команды для помехи игрокам(также в бою) (Показывать паспорт, piss, kiss, iznas и т.п.) - 60-150 минут деморгана",
    "2.51. Во время каких-либо ивентов на сервере(будь то обновление хеллоуина, новый год, 8 марта и др) запрещено заезжать/залетать на любых транспортных средствах на главную площадь в честь обновления, дабы не создавать помеху игрокам - Кик / при повторном нарушении 30 минут деморгана",
    "2.52. Использование маскировки для мафий не по назначению(Вне организованных рп ситуаций, например просто так одеться, писать в орг чат бред или прост бегать в маскировке потому что захотелось) - Warn",
    "2.53. Запрещён арест на ивентовых зонах.ᴾᴿᴵᴹ 12 - 300 минут деморгана/Warn",
    "2.54. Запрещено использовать команды /iznas и /piss (в гетто и в мафиях) - Warn"
];  

function showNotification(message, color) {
  const notification = $(`<div style="
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: ${color};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 9999;
    font-family: Comic Sans MS, sans-serif;
    font-size: 14px;
  ">${message}</div>`);

  $("body").append(notification);
  setTimeout(() => {
    notification.fadeOut(500, () => notification.remove());
  }, 5000);
}

if (window.location.pathname === "/") {
  const username = $(".p-navgroup-link").text().trim().split("\n")[0];
  showNotification(
    `Приветствую вас, ${username}.<br>Помощник следящих НО для<br>сервера Faraway готов к работе.<br>Версия: ${version}`,
    "green"
  );
}
/////////////////////////////////////////////////////////////////////
function createbuttons() {
  buttonsh_add("Опра момента");
  buttonsh_add("Фулл опра");
  buttonsh_add("Опра принята");
  buttonsh_add("Опра отказана");
  buttonsh_add("Выдам наказание");
}

function createNewButtonList() {
  buttonsh_add("Чит");
  buttonsh_add("Другое");
}
///////////////////////////////////////////////////////////////////////////////////////////////////
window.button_id = 0;
$(".button--icon--reply").after(
  '<input type="button" class="button shabs" value="' +
    buttonname +
    '" id="shabs" style="margin-left: 3px;">'
);
$(".button--icon--reply").after(
  '<input type="button" class="button shabs" value="' +
    newButtonName +
    '" id="newShabs" style="margin-left: 3px;">'
);
$(".button--icon--reply").after(
  '<input type="button" class="button shabs" value="' +
    settingsButtonName +
    '" id="settingsButton" style="margin-left: 3px;">'
);
$(document).ready(function () {
  $("#shabs").click(function () {
    $("div.overlay-container").remove();
    XF.alert(`<div id="shabscontent"></div>`, buttonname);
    createbuttons();
  });
  $("#newShabs").click(function () {
    $("div.overlay-container").remove();
    XF.alert(`<div id="newShabsContent"></div>`, newButtonName);
    createNewButtonList();
  });
  $("#settingsButton").click(function () {
    $("div.overlay-container").remove();
    XF.alert(`<div id="settingsContent"></div>`, settingsButtonName);
    createSettingsMenu();
  });
});
function createSettingsMenu() {
  const initialText = `
    <div style="font-family: Comic Sans MS;">
      <p>Скрипт "special for faraway".</p>
      <p>Версия скрипта: <span style="color: #90EE90;">${version}</span></p>
      <p>Разработчик скрипта: <a href="https://vk.com/chris_wayne" target="_blank" style="color: #AFEEEE;">Christopher_Wayne</a></p>
      <p>Помощник в разработке: <a href="https://vk.com/grsky" target="_blank" style="color: #AFEEEE;">James_Mustang</a></p>
      <p>Скрытие кнопок (галочка - кнопка активна):</p>
      <label><input type="checkbox" id="toggleNesost"> ЖБ НО</label><br>
      <label><input type="checkbox" id="toggleAdm"> ЖБ адм</label><br><br>
      <button id="saveSettings" class="button">Сохранить</button>
    </div>
  `;

  $("#settingsContent").html(initialText);

  $("#toggleNesost").prop("checked", localStorage.getItem("showNesost") !== "false");
  $("#toggleAdm").prop("checked", localStorage.getItem("showAdm") !== "false");

  $("#saveSettings").click(function () {
    const showNesost = $("#toggleNesost").is(":checked");
    const showAdm = $("#toggleAdm").is(":checked");

    localStorage.setItem("showNesost", showNesost);
    localStorage.setItem("showAdm", showAdm);

    toggleButtonVisibility();
    showNotification("Настройки сохранены!", "green");
    $("#exposeMask").click();
  });
}
function toggleButtonVisibility() {
 if (localStorage.getItem("showNesost") === "false") {
    $("#shabs").hide();
  } else {
    $("#shabs").show();
  }

  if (localStorage.getItem("showAdm") === "false") {
    $("#newShabs").hide();
  } else {
    $("#newShabs").show();
  }
}
$(document).ready(function () {
  toggleButtonVisibility();
});
function buttonsh_add(title) {
  const targetContent = $("#shabscontent, #newShabsContent");
  targetContent.append(
    '<input type="button" class="button js-overlayClose" value="' +
      title +
      '" id="shabs_' +
      window.button_id +
      '" style="margin-top: 3px;margin-left: -5px;">'
  );

  $(document).on("click", "#shabs_" + window.button_id, function () {
    let content = "";

    switch (title) {
        case "Опра момента":
            let ffinalText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Опру момента 24ч[/FONT][/CENTER]`;

            $(".fr-element").html(ffinalText);
            $("#exposeMask").click();
          break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case "Фулл опра":
            let finalTText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Фулл опру 24ч[/FONT][/CENTER]`;

            $(".fr-element").html(finalTText);
            $("#exposeMask").click();
          break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case "Опра принята":
            let fiinalTText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Опра принята[/FONT][/CENTER]`;

            $(".fr-element").html(fiinalTText);
            $("#exposeMask").click();
          break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Опра отказана":
        content = `<div>
          <label>Причина отказа:</label><br>
          <input type="text" id="inputReason" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitReason" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        $(document).on("click", "#submitReason", function () {
          let reason = $("#inputReason").val();

          if (!reason) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлена причина отказа", "red");
            return;
          }

          let finalText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Опра отказана<br>${reason}[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Выдам наказание":
        content = `<div>
          <label>Пункт правил, по которому выдается наказание (список):</label><br>
          <input type="text" id="searchRules" placeholder="Введите ключевые слова для поиска среди списка правил..." style="width: 100%; margin-bottom: 10px;"><br>
          <select id="rulesDropdown" style="width: 100%; margin-bottom: 10px;">
           <option value="">Выбор пункта правил из списка</option>
         </select>
         <label>Пункт правил, по которому выдается наказание (ручной ввод):</label><br>
         <input type="text" id="inputRules" placeholder="Ручной ввод пункта правил..." style="width: 100%; margin-bottom: 10px;"><br>
         <button id="submitManualInput" class="button js-overlayClose">Добавить</button>
       </div>`;

       XF.alert(content, title);

       RULES_LIST.forEach(rule => {
         $("#rulesDropdown").append(new Option(rule, rule));
       });

       $(document).on("input", "#searchRules", function () {
         const searchValue = $(this).val().toLowerCase();
         $("#rulesDropdown").empty().append(new Option("Выбор пункта правил из списка", ""));
    
         RULES_LIST.filter(rule => rule.toLowerCase().includes(searchValue)).forEach(filteredRule => {
           $("#rulesDropdown").append(new Option(filteredRule, filteredRule));
         });
       });

       $(document).on("change", "#rulesDropdown", function () {
         if ($(this).val()) {
           $("#inputRules").val("").prop("disabled", true);
         } else {
        $("#inputRules").prop("disabled", false);
         }
       });

       $(document).on("input", "#inputRules", function () {
         if ($(this).val()) {
           $("#rulesDropdown").val("").prop("disabled", true);
         } else {
           $("#rulesDropdown").prop("disabled", false);
         }
       });

       $(document).on("click", "#submitManualInput", function () {
         let rules = $("#rulesDropdown").val() || $("#inputRules").val();

         if (!rules) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил", "red");
           return;
         }

         let finalText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Накажу игрока за:<br>${rules}[/FONT][/CENTER]`;

         $(".fr-element").html(finalText);
         $("#exposeMask").click();
       });
       break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Чит":
        content = `<div>
          <label>Видео-разбор вашего нарушения:</label><br>
          <input type="text" id="inputEvidence" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Текст под хайдом</label><br>
          <input type="text" id="inputHide" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitEvidence" class="button js-overlayClose">Добавить</button>
        </div>`;
 
        XF.alert(content, title);
 
        $(document).on("click", "#submitEvidence", function () {
          let evidence = $("#inputEvidence").val();
          let hide = $("#inputHide").val();
 
          if (!evidence) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлено доказательство нарушения", "red");
            return;
          }
 
          let finalText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Видео-разбор вашего нарушения:<br>${evidence}<br>[USERS=Kalibr Corrigan, Alexei_Alekseev]${hide}[/USERS][/FONT][/CENTER]`;
 
          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Другое":
        content = `<div>
          <label>Доказательства нарушения (прикрепляем ссылку, строго полный url):</label><br>
          <input type="text" id="inputEvidence" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitEvidence" class="button js-overlayClose">Добавить</button>
        </div>`;
 
        XF.alert(content, title);
 
        $(document).on("click", "#submitEvidence", function () {
          let evidence = $("#inputEvidence").val();
 
          if (!evidence) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлено доказательство нарушения", "red");
            return;
          }
 
          let finalText = `[CENTER][FONT=trebuchet ms]Приветствую<br>Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL][/FONT][/CENTER]`;
 
          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      default:
        showNotification("Ошибка вывода ответа №1.<br>Обратитесь к разработчику скрипта.", "red");
    }
  });

  window.button_id++;
}