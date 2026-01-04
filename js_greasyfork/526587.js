// ==UserScript==
// @name        Fast Court by C.Wayne
// @namespace   https://forum.arizona-rp.com/
// @match       https://forum.arizona-rp.com/*
// @grant       none
// @version     1.0 fixed
// @author      Christopher_Wayne vk.com/chris_wayne
// @description vk.com/chris_wayne
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526587/Fast%20Court%20by%20CWayne.user.js
// @updateURL https://update.greasyfork.org/scripts/526587/Fast%20Court%20by%20CWayne.meta.js
// ==/UserScript==

var buttonname = "Court";
var settingsButtonName = "Settings";
var version = "1.0 fixed";

function showNotification(message, color) {
  const notification = document.createElement('div');
  notification.innerHTML = message;
  notification.style.cssText = `
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
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.transition = 'opacity 0.5s';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

if (window.location.pathname === "/") {
  const usernameElement = document.querySelector(".p-navgroup-link");
  if (usernameElement) {
    const username = usernameElement.textContent.trim().split("\n")[0];
    showNotification(
      `Приветствую вас, ${username}.<br>Помощник судьи готов к работе.<br>Версия: ${version}`,
      "green"
    );
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const savedNickname = localStorage.getItem('judgeNickname');
  if (savedNickname) {
    console.log("Загружен сохраненный никнейм:", savedNickname);
  }
});

function createbuttons() {
  buttonsh_add("Некорректное заявление");
  buttonsh_add("Ответ на иск");
  buttonsh_add("Истребование доказательств");
  buttonsh_add("Уголовное дело");
}

window.button_id = 0;

function addButtons() {
  const replyButton = document.querySelector(".button--icon--reply");
  if (replyButton && !document.getElementById("shabs")) {
    const courtButton = document.createElement('input');
    courtButton.type = "button";
    courtButton.className = "button shabs";
    courtButton.value = buttonname;
    courtButton.id = "shabs";
    courtButton.style.marginLeft = "3px";

    const settingsButton = document.createElement('input');
    settingsButton.type = "button";
    settingsButton.className = "button shabs";
    settingsButton.value = settingsButtonName;
    settingsButton.id = "settingsButton";
    settingsButton.style.marginLeft = "3px";

    replyButton.parentNode.insertBefore(settingsButton, replyButton.nextSibling);
    replyButton.parentNode.insertBefore(courtButton, replyButton.nextSibling);

    courtButton.addEventListener('click', function() {
      const overlay = document.querySelector("div.overlay-container");
      if (overlay) overlay.remove();
      XF.alert(`<div id="shabscontent"></div>`, buttonname);
      createbuttons();
    });

    settingsButton.addEventListener('click', function() {
      const overlay = document.querySelector("div.overlay-container");
      if (overlay) overlay.remove();
      XF.alert(`<div id="settingsContent"></div>`, settingsButtonName);
      createSettingsMenu();
    });
  }
}

document.addEventListener('DOMContentLoaded', addButtons);
setTimeout(addButtons, 1000);
setTimeout(addButtons, 2000);

const observer = new MutationObserver(function(mutations) {
  addButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

function createSettingsMenu() {
  const initialText = `
    <div style="font-family: Comic Sans MS;">
      <p>Скрипт "Fast Court by C.Wayne".</p>
      <p>Версия скрипта: <span style="color: #90EE90;">${version}</span></p>
      <p>Разработчик скрипта: <a href="https://vk.com/chris_wayne" target="_blank" style="color: #AFEEEE;">Christopher_Wayne</a></p>
      <p>Помощник в разработке: <a href="https://vk.com/grsky" target="_blank" style="color: #AFEEEE;">James_Mustang</a></p>
      <p><span style="color:rgb(41, 227, 202);">Подсказка:</span> если вам необходимо перенести строку в тексте - используйте &lt;br&gt;</p>
      <p><span style="color:rgb(41, 227, 106);">Пример:</span> Я сегодня хочу вам рассказать&lt;br&gt;об интересной истории...</p>
      <label for="nicknameInput">Ваш никнейм (он будет вставляться в ваши ответы):</label>
      <input type="text" id="nicknameInput" style="width: 100%; margin-bottom: 10px;">
      <button id="saveSettings" class="button">Сохранить</button>
    </div>
  `;

  const settingsContent = document.getElementById("settingsContent");
  if (settingsContent) {
    settingsContent.innerHTML = initialText;

    const savedNickname = localStorage.getItem('judgeNickname');
    const nicknameInput = document.getElementById('nicknameInput');
    if (savedNickname && nicknameInput) {
      nicknameInput.value = savedNickname;
    }

    document.addEventListener("click", function saveSettingsHandler(e) {
      if (e.target.id === "saveSettings") {
        const nickname = document.getElementById("nicknameInput").value;
        if (nickname) {
          localStorage.setItem('judgeNickname', nickname);
          showNotification("Сохранение успешно:<br>Никнейм сохранен", "green");
        } else {
          showNotification("Сохранение не удалось:<br>Никнейм не может быть пустым", "red");
        }
        document.removeEventListener("click", saveSettingsHandler);
      }
    });
  }
}

function buttonsh_add(title) {
  const targetContent = document.getElementById("shabscontent");
  if (!targetContent) return;

  const button = document.createElement('input');
  button.type = "button";
  button.className = "button js-overlayClose";
  button.value = title;
  button.id = "shabs_" + window.button_id;
  button.style.marginTop = "3px";
  button.style.marginLeft = "-5px";

  targetContent.appendChild(button);

  button.addEventListener("click", function() {
    let content = "";
    switch (title) {
      case "Некорректное заявление":
        content = `<div>
          <label>Номер искового заявления:</label><br>
          <input type="text" id="inputNumber" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Укажите, что необходимо исправить в жалобе:</label><br>
          <input type="text" id="inputWhat" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitAll" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        document.addEventListener("click", function submitHandler(e) {
          if (e.target.id === "submitAll") {
            let what = document.getElementById("inputWhat").value;
            let number = document.getElementById("inputNumber").value;

            if (!what) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена информация в строку", "red");
              return;
            }
            if (!number) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен номер заявления", "red");
              return;
            }
            const judgeNickname = localStorage.getItem('judgeNickname');

            let finalText = `[TABLE]<br>[TR]<br>[TD][CENTER][IMG width="155px" alt="hoI52mB.png"]https://i.imgur.com/b4La5OS.png[/IMG]<br><br><br>[FONT=times new roman]ВЕРХОВНЫЙ СУД ШТАТА LOVE<br>В лице члена судейской коллегии ${judgeNickname}<br>ПОСТАНОВЛЕНИЕ ВЕРХОВНОГО СУДА О ИСКОВОМ ЗАЯВЛЕНИЕ №${number}[/FONT][/CENTER][/TD]<br>[/TR]<br>[/TABLE]<br>[HR][/HR]<br>[TABLE]<br>[TR]<br>[TD][CENTER][FONT=times new roman]Суд уведомляет истца о несоответствии искового заявления изложенному формуляру, и обязует истца переоформить исковое заявление,[/FONT]<br>[SPOILER="OOC"]${what}[/SPOILER][/CENTER]<br>[HR][/HR]<br>[CENTER][FONT=times new roman]На переоформление искового заявления выделяется ровно 24 часа с момента опубликования постановления суда.[/FONT][/CENTER]<br>[RIGHT][FONT=times new roman][IMG width="200px"]https://forum.arizona-v.com/data/attachments/55/55123-cc58b1d2641e4fe6f517ac4ddde379da.jpg[/IMG][/FONT][/RIGHT][/TD]<br>[/TR]<br>[/TABLE]`;

            const editor = document.querySelector(".fr-element");
            if (editor) {
              editor.innerHTML = finalText;
              const exposeMask = document.getElementById("exposeMask");
              if (exposeMask) exposeMask.click();
            }
            document.removeEventListener("click", submitHandler);
          }
        });
        break;

      case "Ответ на иск":
        content = `<div>
          <label>Номер искового заявления:</label><br>
          <input type="text" id="inputNumber" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата подачи иска:</label><br>
          <input type="date" id="inputDate" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата рассмотрения иска:</label><br>
          <input type="date" id="inputFDate" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Никнейм истца:</label><br>
          <input type="text" id="inputNickk" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Никнейм ответчика:</label><br>
          <input type="text" id="inputNNick" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Рассмотреть/отклонить исковое заявление:</label><br>
          <input type="text" id="inputLaw" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Удовлетворить/отклонить исковое заявление (с указанием причины):</label><br>
          <input type="text" id="inputLaws" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Возложить обязательства на ответчика:</label><br>
          <input type="text" id="inputLawss" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата до которого необходимо выполнить решение:</label><br>
          <input type="date" id="inputDatee" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitAll" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        document.addEventListener("click", function submitHandler(e) {
          if (e.target.id === "submitAll") {
            let number = document.getElementById("inputNumber").value;
            let date = document.getElementById("inputDate").value;
            let fdate = document.getElementById("inputFDate").value;
            let nickk = document.getElementById("inputNickk").value;
            let nnick = document.getElementById("inputNNick").value;
            let law = document.getElementById("inputLaw").value;
            let laws = document.getElementById("inputLaws").value;
            let lawss = document.getElementById("inputLawss").value;
            let datee = document.getElementById("inputDatee").value;

            if (!number) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен номер заявления", "red");
              return;
            }
            if (!date) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата подачи иска", "red");
              return;
            }
            if (!fdate) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата рассмотрения иска", "red");
              return;
            }
            if (!nickk) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм истца", "red");
              return;
            }
            if (!nnick) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм ответчика", "red");
              return;
            }
            if (!law) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлено решение суда", "red");
              return;
            }
            if (!laws) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлено решение суда (второе)", "red");
              return;
            }
            if (!lawss) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлены обязательства", "red");
              return;
            }
            if (!datee) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата выполнения решения", "red");
              return;
            }

            const judgeNickname = localStorage.getItem('judgeNickname');

            let finalText = `[TABLE]<br>[TR]<br>[TD][CENTER][IMG width="155px" alt="hoI52mB.png"]https://i.imgur.com/b4La5OS.png[/IMG]<br>[FONT=times new roman]ВЕРХОВНЫЙ СУД ШТАТА LOVE В лице члена судейской коллегии суда ${judgeNickname}<br>ПОСТАНОВЛЕНИЕ ВЕРХОВНОГО СУДА О ИСКОВОМ ЗАЯВЛЕНИЕ №${number}[/FONT][/CENTER][/TD]<br>[/TR]<br>[/TABLE]<br>[HR][/HR]<br>[TABLE]<br>[TR]<br>[TD][CENTER][FONT=times new roman]<br>По делу №${number}<br>В соответствии с рассмотрением искового заявления ${nickk} к ${nnick}, поступившего в Суд ${date}, и на основании представленных материалов, документов, а также устных и письменных доводов сторон, Суд установил следующее:<br><br>ОПРЕДЕЛЕНИЕ[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]<br>Суд в составе судей верховного суда ${judgeNickname}, рассмотрев иск под номером №${number}, гражданина ${nickk} к ${nnick} о неправомерных действиях со стороны ответчика.​[/CENTER][/FONT]<br>[CENTER]<br>[FONT=times new roman]УСТАНОВИЛ[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]${law}[/CENTER][/FONT]<br>[CENTER]<br>[FONT=times new roman]ПОСТАНОВЛЕНИЕ СУДА:<br>На основании вышеизложенного, и учитывая все обстоятельства дела, Верховный Суд постановляет:[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]${laws}<br>${lawss}<br>Выполнить обязательства до: ${datee}[/CENTER][/FONT]<br>[CENTER][FONT=times new roman]<br>Постановление принято ${fdate} и подлежит немедленному исполнению.<br>[IMG align="right" width="135px" alt="NYqIBf3.png"]https://i.imgur.com/e5LItyb.png[/IMG][/FONT][/CENTER][/TD]<br>[/TR]<br>[/TABLE]`;

            const editor = document.querySelector(".fr-element");
            if (editor) {
              editor.innerHTML = finalText;
              const exposeMask = document.getElementById("exposeMask");
              if (exposeMask) exposeMask.click();
            }
            document.removeEventListener("click", submitHandler);
          }
        });
        break;

      case "Истребование доказательств":
        content = `<div>
          <label>Никнейм истца:</label><br>
          <input type="text" id="inputNickk" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Никнейм ответчика:</label><br>
          <input type="text" id="inputNNick" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата до которого необходимо выполнить решение:</label><br>
          <input type="date" id="inputDatee" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitAll" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        document.addEventListener("click", function submitHandler(e) {
          if (e.target.id === "submitAll") {
            let nickk = document.getElementById("inputNickk").value;
            let nnick = document.getElementById("inputNNick").value;
            let datee = document.getElementById("inputDatee").value;

            if (!nickk) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм истца", "red");
              return;
            }
            if (!nnick) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм ответчика", "red");
              return;
            }
            if (!datee) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата выполнения решения", "red");
              return;
            }

            const judgeNickname = localStorage.getItem('judgeNickname');

            let finalText = `[TABLE]<br>[TR]<br>[TD][CENTER][IMG width="134px"]https://i.imgur.com/b4La5OS.png[/IMG]<br><br>[FONT=times new roman]ВЕРХОВНЫЙ СУД ШТАТА LOVE В лице члена судейской коллегии суда, ${judgeNickname}<br>ПОСТАНОВЛЕНИЕ ВЕРХОВНОГО СУДА О [FONT=times new roman]ИСТРЕБОВАНИИ ДОКАЗАТЕЛЬСТВ[/FONT][/FONT][/CENTER][/TD]<br>[/TR]<br>[/TABLE]<br>[HR][/HR]<br>[TABLE]<br>[TR]<br>[TD][CENTER][FONT=times new roman]В соответствии с рассмотрением запроса о предоставлении доказательств, поступившего в суд от ${nickk} и на основании представленных материалов, установленных в заявлении о необходимости истребования доказательств, Верховный Суд установил следующее:<br><br>В связи с вышеизложенным, Верховный Суд постановляет:[/FONT][/CENTER]<br>[LIST=1]<br>[*][FONT=times new roman][LEFT]Истребовать от ${nnick} следующие доказательства: запись с бодикамеры. [/LEFT][/FONT]<br>[*][FONT=times new roman][LEFT]Назначить срок предоставления доказательств до ${datee}.[/LEFT][/FONT]<br>[*][FONT=times new roman][LEFT]В случае несоответствия, запросить дополнительные разъяснения от стороны, предоставляющей доказательства.[/LEFT][/FONT]<br>[/LIST]<br>[CENTER][FONT=times new roman] Данное решение вступает в законную силу немедленно.[/FONT][/CENTER]<br>[RIGHT][FONT=times new roman][IMG width="136px"]https://forum.arizona-v.com/data/attachments/55/55126-cb49342200068c5f71eca6fed6ad85c6.jpg[/IMG][/FONT][/RIGHT][/TD]<br>[/TR]<br>[/TABLE]<br>[CENTER][/CENTER]`;

            const editor = document.querySelector(".fr-element");
            if (editor) {
              editor.innerHTML = finalText;
              const exposeMask = document.getElementById("exposeMask");
              if (exposeMask) exposeMask.click();
            }
            document.removeEventListener("click", submitHandler);
          }
        });
        break;

      case "Уголовное дело":
        content = `<div>
          <label>Номер искового заявления:</label><br>
          <input type="text" id="inputNumber" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата подачи уд:</label><br>
          <input type="date" id="inputDate" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата рассмотрения иска:</label><br>
          <input type="date" id="inputFDate" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Никнейм следователя:</label><br>
          <input type="text" id="inputNickk" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Никнейм обвиняемого:</label><br>
          <input type="text" id="inputNNick" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Рассмотреть/отклонить исковое заявление:</label><br>
          <input type="text" id="inputLaw" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Удовлетворить/отклонить исковое заявление (с указанием причины):</label><br>
          <input type="text" id="inputLaws" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Возложить обязательства на ответчика:</label><br>
          <input type="text" id="inputLawss" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Дата до которого необходимо выполнить решение:</label><br>
          <input type="date" id="inputDatee" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitAll" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        document.addEventListener("click", function submitHandler(e) {
          if (e.target.id === "submitAll") {
            let number = document.getElementById("inputNumber").value;
            let date = document.getElementById("inputDate").value;
            let fdate = document.getElementById("inputFDate").value;
            let nickk = document.getElementById("inputNickk").value;
            let nnick = document.getElementById("inputNNick").value;
            let law = document.getElementById("inputLaw").value;
            let laws = document.getElementById("inputLaws").value;
            let lawss = document.getElementById("inputLawss").value;
            let datee = document.getElementById("inputDatee").value;

            if (!number) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен номер заявления", "red");
              return;
            }
            if (!date) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата подачи иска", "red");
              return;
            }
            if (!fdate) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата рассмотрения иска", "red");
              return;
            }
            if (!nickk) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм следователя", "red");
              return;
            }
            if (!nnick) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм обвиняемого", "red");
              return;
            }
            if (!law) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлено решение суда", "red");
              return;
            }
            if (!laws) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлено решение суда (второе)", "red");
              return;
            }
            if (!lawss) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлены обязательства", "red");
              return;
            }
            if (!datee) {
              showNotification("При создании ответа произошла ошибка:<br>Не добавлена дата выполнения решения", "red");
              return;
            }

            const judgeNickname = localStorage.getItem('judgeNickname');

            let finalText = `[TABLE]<br>[TR]<br>[TD][CENTER]<br>[IMG]https://i.imgur.com/e5LItyb.png[/IMG][/CENTER]<br><br>[FONT=times new roman][CENTER]ВЕРХОВНЫЙ СУД ШТАТА LOVE<br>В лице члена судейской коллегии суда ${judgeNickname}<br>ПОСТАНОВЛЕНИЕ ВЕРХОВНОГО СУДА О УГОЛОВНОМ ДЕЛЕ №${number}[/CENTER][/FONT][/TD]<br>[/TR]<br>[/TABLE]<br>[HR][/HR]<br>[TABLE]<br>[TR]<br>[TD][CENTER][FONT=times new roman]<br>По Уголовному делу №${number}<br>В соответствии с рассмотрением уголовного дела присланным в суд от Агента Федерального Бюро Расследования,<br>${nickk} к ${nnick}, поступившего в Суд ${date},<br>и на основании представленных материалов установленных в уголовном деле, Суд установил следующее:<br><br>ОПРЕДЕЛЕНИЕ[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]<br>Суд в составе судей верховного суда ${judgeNickname}, рассмотрев иск под номером №001, гражданина ${nickk} к ${nnick} о неправомерных действиях со стороны ответчика.[/CENTER][/FONT]<br>[CENTER]<br>[FONT=times new roman]УСТАНОВИЛ[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]${law}[/CENTER][/FONT]<br>[CENTER]<br>[FONT=times new roman]ПОСТАНОВЛЕНИЕ СУДА:<br>На основании вышеизложенного, и учитывая все обстоятельства дела, Верховный Суд постановляет:[/FONT][/CENTER]<br>[FONT=times new roman][CENTER]${laws}<br>${lawss}<br>${datee}[/CENTER][/FONT]<br>[CENTER][FONT=times new roman]<br>Постановление принято ${fdate} и подлежит немедленному исполнению.<br>[IMG align="right" width="135px" alt="NYqIBf3.png"]https://forum.arizona-v.com/data/attachments/55/55126-cb49342200068c5f71eca6fed6ad85c6.jpg[/IMG][/FONT][/CENTER][/TD]<br>[/TR]<br>[/TABLE]`;

            const editor = document.querySelector(".fr-element");
            if (editor) {
              editor.innerHTML = finalText;
              const exposeMask = document.getElementById("exposeMask");
              if (exposeMask) exposeMask.click();
            }
            document.removeEventListener("click", submitHandler);
          }
        });
        break;

      default:
        showNotification("Ошибка вывода ответа №1.<br>Обратитесь к разработчику скрипта.", "red");
    }
  });

  window.button_id++;
}