// ==UserScript==
// @name        От вашего Диего иманалиева :D
// @namespace   https://forum.liverussia.online/
// @match      https://forum.liverussia.online/*
// @grant       none
// @version     0.6.3 beta
// @author     https://vk.com/diegoimanaliev
// @description https://vk.com/diegoimanaliev
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526665/%D0%9E%D1%82%20%D0%B2%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%94%D0%B8%D0%B5%D0%B3%D0%BE%20%D0%B8%D0%BC%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0%20%3AD.user.js
// @updateURL https://update.greasyfork.org/scripts/526665/%D0%9E%D1%82%20%D0%B2%D0%B0%D1%88%D0%B5%D0%B3%D0%BE%20%D0%94%D0%B8%D0%B5%D0%B3%D0%BE%20%D0%B8%D0%BC%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0%20%3AD.meta.js
// ==/UserScript==

var gosButtonname = "ЖБ игроки";
var buttonname = "ЖБ дароботка";
var newButtonName = "ЖБ даработка";
var settingsButtonName = "Settings";
var version = "0.6.2 beta";
const RASMOTR_PREFIX = 1; // на рассмотрении
const DORABOTKA_PREFIX = 2; // на рассмотрении
const ACCEPT_PREFIX = 0; // рассмотрено
const DOWN_PREFIX = 8; // отказано
const RULES_LIST = [
  "2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут",
  "2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn",
  "2.03. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan",
  "2.04. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 21 / PermBan",
  "2.05. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут",
  "2.06. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут",
  "2.07. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.",
  "2.08. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 30 минут",
  "2.09. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban до 7 дней",
  "2.10. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Jail 30 минут / Ban до 30 дней / PermBan",
  "2.11. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan",
  "2.12. Запрещено намеренно наносить вред ресурсам проекта (форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта",
  "2.13. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта",
  "2.14. Запрещено рекламировать на сервере любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Mute 120 / Ban 7 дней / PermBan",
  "2.15. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 14 дней",
  "2.16. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности (политики) и / или религии совершенно в любом формате | Mute 120 минут",
  "2.17. Передача своего личного игрового аккаунта третьим лицам | PermBan",
  "2.18. Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan",
  "2.19. Команде проекта, а также главной администрации разрешено выдавать наказание на своё усмотрение, но каждое подобное наказание согласовывается со специальным администратором.",
  "2.20. Запрещены nonRP задержания, аресты | Warn", 
  "2.21. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | Ban 7-14 дней / обнуление имущества.",
  "2.22. Запрещены nonRP похищения | Warn",
  "2.23. Запрещены любые лаги на семейных контейнерах, войнах за территорию, бизваров, дуэлях. | Jail 30 минут",
  "2.24. Запрещено использовать сторонний клиент/изменять файлы игры для получения преимущества над игроками (изменение скорости стрельбы/повышение количества патрон в обойме, изменение хендлинга и т д.) - приравнивается к читерству | Ban от 21 дней / Permban",
  "2.26. Запрещено создавать рассинхрон, путем сбива анимации из /anim. | Jail 30 минут",
  "2.27. Запрещено вредить игровому процессу, сливать фракции, продавать ранги | Ban 14-21 день / Permban",
  "2.28. Запрещено создавать помеху работе администрации, который выполняет свои обязанности | Jail 60 минут",
  "2.29. Запрещено продавать или обменивать имущество между серверами проекта | PermBan с обнулением аккаунта",
  "2.30. Запрещено использовать летный транспорт для помехи / нанесения урона игроку | Jail 60 минут / Ban от 7 дней / Изъятие воздушного транспорта",
  "2.31. Запрещено оказывать внутриигровые услуги за реальные деньги | PermBan с возможным обнулением",
  "2.32. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan + ЧС проекта",
  "3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут",
  "3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут",
  "3.03. Запрещены любые формы оскорблений, издевательств, расизма, дискриминации, сексизма в чате, неадекватное поведение, неуважительного обращения и угрозы в любом их проявлении | 60 - 180 минут",
  "3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 180 - 500 минут",
  "3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут",
  "3.06. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 60 минут",
  "3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | Ban 21 / PermBan",
  "3.09. Запрещена выдача себя за администратора, если таковым не являетесь | Mute 120 Ban 7 - 15 / ЧС администраци",
  "3.10. Запрещено введение игроков проекта в заблуждение, злоупотребляя командами сервера | Mute 180 / Ban 10 - 30 дней / PermBan",
  "3.11. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | Report Mute 30 минут",
  "3.12. Запрещено подавать репорт с использованием нецензурной брани | Report Mute 60 - 120 минут",
  "3.13. Запрещается реклама промокодов в игре | Mute 180 минут / Ban 15 дней",
  "3.14. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут",
  "3.15. Запрещено включать музыку в Voice Chat, порнографические звуки (стоны и тд) | Mute 30 - 120 минут",
  "3.16. Запрещено оскорблять игроков или родных в Voice Chat | Mute войса 60 - 180 минут",
  "3.17. Запрещена реклама сторонних ресурсов | Mute 180 / Ban 7 дней / PermBan",
  "3.18. Запрещено вести себя неадекватно в VIP чате (/v), провоцировать игроков на оскорбление, оскорблять игроков, администрацию и т д. | Mute 180 минут",
  "3.19. Запрещено злоупотреблять знаками | Mute 60 минут",
  "3.20. Запрещен спам в любом его проявлении | Mute 60 минут",
  "4.03. Запрещена любая передача игровых аккаунтов третьим лицам | PermBan",
  "4.04. Создавать мульти-аккаунты с целью получения любой выгоды | Ban/Permban (Основа/Твинки на усмотрение администрации)",
  "4.05. Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям | Запрет на нахождение в организации",
  "4.06. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | смена игрового никнейма / PermBan",
  "4.07. Запрещено использовать никнеймы, содержащие нецензурные или оскорбительные слова ники | PermBan",
  "4.08. Владеть бизнесами разрешается с одного основного аккаунта | Изъятие бизнеса(ов)",
  "4.09. Запрещены денежные махинации, РП рулетки (казино), обманывать игроков на деньги, имущество, аксессуары | PermBan",
  "4.10. Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка | PermBan или обнуление имущества",
  "4.11. Запрещено строить финансовые пирамиды | PermBan",
  "4.12. Запрещено проводить несогласованные с командой проекта конкурсы на игровое имущество и игровую валюту проекта на сторонних ресурсах / на неофициальных источниках.",
  "4.13. Запрещено проводить сделки на обмен/покупку/продажу игрового имущества и игровой валюты без согласования с командой проекта, не предусмотренные функционалом игрового мода. | Обнуление аккаунта / PermBan",
  "5.01. Сбивать все виды анимаций в /anim | Prison 60 минут",
  "5.02. Использовать баг с ускоренным бегом (в слайде) | Prison 60 минут",
  "5.03. Использовать уязвимости, дающие преимущество над другими игроками (отключать интернет, баг хп, прятаться в текстурах, находиться в зз) | Prison 60 минут / Ban до 14 дней",
  "5.04. Использовать машину с целью избежать смерть (пополнить хп, броню) в бою | Prison 60 минут",
  "5.05. Запрещено SK игроков у домов, которые не находятся в зоне проведения семейных захватов. | Prison 60 минут",
  "6.01. Вмешиваться в войну двух ОПГ в зоне проведения стрелы | Warn 14 дней",
  "6.02. Создавать помеху лётным транспортом | Jail 60 минут / Warn 14 дней.",
  "6.03. Использовать баг с ускоренным бегом (в слайде) | Prison 60 минут",
  "6.04. Сбивать все виды анимаций | Jail 60 минут",
  "6.05. Участвовать в стреле не во фракционной одежде | Jail 60 минут / предупреждение лидеру"



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
    `Приветствую вас, ${username}.<br>Помощник администрации для<br>сервера LIVE RUSSIA готов к работе.<br>Версия: ${version}`,
    "green"
  );
}
if (window.location.pathname === "/forums/3298/") {
  const username = $(".p-navgroup-link").text().trim().split("\n")[0];
  const shortUsername = shortenUsername(username);
  const searchButton = document.createElement("button");
  const searchButton2 = document.createElement("button");

  searchButton.className = "button";
  searchButton.textContent = "Поиск жалоб (1)";
  searchButton2.className = "button";
  searchButton2.textContent = "Поиск жалоб (2)";

  const buttonGroup = document.querySelector(".buttonGroup");
  if (buttonGroup) {
    buttonGroup.appendChild(searchButton);
    buttonGroup.appendChild(searchButton2);
  }

  searchButton.addEventListener("click", function () {
    localStorage.setItem("showComplaintNotification", "true");
    window.location.href = `https://forum.arizona-rp.com/search/2/?q=${username}&t=post&c[child_nodes]=1&c[nodes][0]=3298&o=date&g=1`;
  });

  searchButton2.addEventListener("click", function () {
    localStorage.setItem("showComplaintNotification", "true");
    window.location.href = `https://forum.arizona-rp.com/search/2/?q=${shortUsername}&t=post&c[child_nodes]=1&c[nodes][0]=3298&o=date&g=1`;
  });
}

if (
  window.location.pathname === "/search/" &&
  localStorage.getItem("showComplaintNotification") === "true"
) {
  showNotification(
    "<span style='color: black;'>Внимание! Поиск жалоб может быть неточным!<br>Рекомендую дополнительно сделать ручной просмотр.</span>",
    "yellow"
  );
  localStorage.removeItem("showComplaintNotification");
}
function shortenUsername(username) {
  const [firstName, lastName] = username.split("_");
  if (!firstName || !lastName) return username;
  return `${firstName[0]}.${lastName}`;
}
/////////////////////////////////////////////////////////////////////
function createbuttons() {
  buttonsh_add("Отказано");
  buttonsh_add("Рассмотрено");
  buttonsh_add("Рассмотрено (пару игроков)");
  buttonsh_add("На рассмотрении");
 
}

function createNewButtonList() {
  buttonsh_add("Читы");
  buttonsh_add("Багоюз");
  buttonsh_add("НРП развод");
  buttonsh_add("Слив игрока/адм");
  buttonsh_add("Ввод в заблуждение");
  buttonsh_add("Деанон");
  buttonsh_add("Взаимодействие с ЧСником");
  buttonsh_add("Упом род");
  buttonsh_add("Оск род");
  buttonsh_add("Оск адм");
  buttonsh_add("Оффтоп");
  buttonsh_add("Оск/мат");
  buttonsh_add("МегаГейминг");
  buttonsh_add("Транслит");
  buttonsh_add("Капс");
  buttonsh_add("Обман адм");
  buttonsh_add("Флуд");
  buttonsh_add("Злоуп. символ");
  buttonsh_add("Неадекват");
  buttonsh_add("DeathMatch");
  buttonsh_add("Урон в ЗЗ");
  buttonsh_add("DriveBy");
  buttonsh_add("RevengeKill");
  buttonsh_add("PowerGaming");
  buttonsh_add("SpawnKill");
  buttonsh_add("TeamKill");
  buttonsh_add("Уход арест/РП/смерть");
  buttonsh_add("АФК арест/РП/смерть");
  buttonsh_add("Оружие в ЗЗ");
  buttonsh_add("NonRP");
  buttonsh_add("+C в стену");
  buttonsh_add("+С в игрока");
  buttonsh_add("Хилл в бою");
  buttonsh_add("ДБ ковш");
  buttonsh_add("ДМ в ТСР");
  buttonsh_add("Помеха");
  buttonsh_add("Добив стадии");
  buttonsh_add("Масс ДМ");
  buttonsh_add("Масс ДМ ЗЗ");
  buttonsh_add("Ручной ввод");
  buttonsh_add("Пример кнопки");
}
function creategosButtonList() {
  buttonsh_add("Отказано ");
  buttonsh_add("Рассмотрено ");
  buttonsh_add("Рассмотрено (пару игроков) ");
  buttonsh_add("На рассмотрении ");
 
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////
window.button_id = 0;
$(".button--icon--reply").after(
  '<input type="button" class="button shabs" value="' +
    gosButtonname +
    '" id="gosShabs" style="margin-left: 3px;">'
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
  $("#gosShabs").click(function () {
    $("div.overlay-container").remove();
    XF.alert(`<div id="gosShabsContent"></div>`, gosButtonname);
    creategosButtonList();
  });
  $("#settingsButton").click(function () {
    $("div.overlay-container").remove();
    XF.alert(`<div id="settingsContent"></div>`, settingsButtonName);
    createSettingsMenu();
  });
});
function getFormData(params) {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }
  return formData;
}
function applyPrefixAndCloseThread(prefix) {
  const threadTitle = $(".p-title-value")[0]?.lastChild?.textContent;

  if (!threadTitle) {
    showNotification(
      "Ошибка: не удалось получить заголовок темы.<br>Попробуйте обновить страницу.",
      "red"
    );
    return;
  }

  if (prefix === RASMOTR_PREFIX) {
    discussionOpen = 0;
    sticky = 1;
  } else if (prefix === ACCEPT_PREFIX || prefix === DOWN_PREFIX) {
    discussionOpen = 0;
    sticky = 0;
  } else if (prefix === DORABOTKA_PREFIX) {
    discussionOpen = 1;
    sticky = 1;
  }
  fetch(`${document.URL}edit`, {
    method: "POST",
    body: getFormData({
      prefix_id: prefix,
      title: threadTitle,
      discussion_open: discussionOpen,
      sticky: sticky,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: "json",
    }),
  })
  .then((response) => {
    if (!response.ok) {
      showNotification(
        "Ошибка: сервер вернул некорректный ответ.<br>Возможно, у вас недостаточно прав.",
        "red"
      );
    }
    return response.json();
  })
  .then((data) => {
    if (data.errors || !data.success) {
      showNotification(
        "Префикс и статус темы был изменен в соответствии<br>с нажатой вами кнопкой.",
        "green"
      );
    }
  })
  
}
function createSettingsMenu() {
  const initialText = `
    <div style="font-family: Comic Sans MS;">
      <p>Скрипт От вашего Диего иманалиева :D.</p>
      <p>Версия скрипта: <span style="color: #90EE90;">${version}</span></p>
      <p>Разработчик скрипта: <a href="https://vk.com/diegoimanaliev" target="_blank" style="color: #AFEEEE;">Diego_Imanaliev</a></p>
      <p>Скрытие кнопок (галочка - кнопка активна):</p>
      <label><input type="checkbox" id="toggleGos"> ЖБ игроки</label><br>
      <button id="saveSettings" class="button">Сохранить</button>
    </div>
  `;

  $("#settingsContent").html(initialText);

  $("#toggleGos").prop("checked", localStorage.getItem("showGos") !== "false");
  $("#toggleNesost").prop("checked", localStorage.getItem("showNesost") !== "false");
  $("#toggleAdm").prop("checked", localStorage.getItem("showAdm") !== "false");

  $("#saveSettings").click(function () {
    const showGos = $("#toggleGos").is(":checked");
    const showNesost = $("#toggleNesost").is(":checked");
    const showAdm = $("#toggleAdm").is(":checked");

    localStorage.setItem("showGos", showGos);
    localStorage.setItem("showNesost", showNesost);
    localStorage.setItem("showAdm", showAdm);

    toggleButtonVisibility();
    showNotification("Настройки сохранены!", "green");
    $("#exposeMask").click();
  });
}
function toggleButtonVisibility() {
  if (localStorage.getItem("showGos") === "false") {
    $("#gosShabs").hide();
  } else {
    $("#gosShabs").show();
  }

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
  const targetContent = $("#shabscontent, #newShabsContent, #gosShabsContent");
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
      case "Читы":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.1. Использование Запрещённых Программ: BAN 1-2000 дней / BANIP.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Багоюз":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.5. Багоюз: Warn / BAN 15+ дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "НРП развод":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.12. NonRP развод: BAN 30-2000 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Слив игрока/адм":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.17. Подставлять / намеренно сливать игроков / администрацию: BAN 30-2000 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Ввод в заблуждение":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.27. Обман, ввод в заблуждение игроков: MUTE 150+ минут / BAN 5+ дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Деанон":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.32. Слив / распространение личной информации игрока, администратора (деанон): BAN 2000 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Взаимодействие с ЧСником":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]1.33. Запрещено взаимодействовать с игроками, находящимися в чёрном списке проекта/сервера.: BAN 30-2000 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Упом род":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.1. Упоминание родных: MUTE 300 минут[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Оск род":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.2. Оскорбление родных: BAN 1-2000 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Оск адм":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.3. Оскорбление администрации: MUTE 200+ минут / BAN 1-3 дня.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Оффтоп":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.4. Оффтоп в /report: RMUTE 60+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Оск/мат":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.8. Оскорбление / мат в OOC чат: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "МегаГейминг":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.9. MetaGaming: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Транслит":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.10. Транслит: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Капс":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.12. Капс: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Обман адм":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.13. Обман администрации: MUTE 300 минут / BAN 15+ дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Флуд":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.14. Флуд: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Злоуп. символ":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.16. Злоупотребление символами: MUTE 30+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Неадекват":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]2.21. Неадекватное поведение: MUTE 60+ минут / BAN 1-5 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "DeathMatch":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.1. Death Match: JAIL 60+ минут / Неоднократно - Запрет на использование оружия: 1-7 дней.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Урон в ЗЗ":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.2. Любое нанесение урона в зеленой зоне запрещено (исключение: сотрудники ФБР/Полиции при провокации): JAIL 120+ минут / WARN / Неоднократно - Запрет на использование оружия: 1-14 дней[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "DriveBy":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.3. DriveBy: JAIL 60+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "RevengeKill":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.4. Revenge Kill: JAIL 120+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "PowerGaming":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.5. Power Gaming: JAIL 120+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "SpawnKill":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.6. Spawn Kill: JAIL 120+ минут / WARN / Запрет на использование оружия: 1-30 дней[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "TeamKill":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.7. Team Kill: JAIL 120+ минут / WARN / Запрет на использование оружия: 1-30 дней[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Уход арест/РП/смерть":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.8. Выход из игры от ареста / RP / смерти. Уход в инту, использование воздушного шара от смерти / ареста / RP: JAIL 120+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "АФК арест/РП/смерть":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.9. АФК от смерти / ареста / RP: JAIL 120+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Оружие в ЗЗ":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.11. Оружие в зеленой зоне: Изъятие оружия / JAIL 10+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "NonRP":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.12. NonRP: JAIL 120+ минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "+C в стену":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.13. Сбив анимации выстрела любым способом(+С, отводы, сбив темпа и т.п.) в стену: JAIL 60-120 минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "+С в игрока":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.14. Сбив анимации выстрела любым способом(+С, отводы, сбив темпа и т.п.) в игрока: JAIL 150-300 минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Хилл в бою":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.22. Запрещено использовать аптечки, бронежилет, наркотики в бою: JAIL 120 минут / WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "ДБ ковш":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.23. DriveBy ковшом от тюнинга: WARN / BAN 3 дня.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "ДМ в ТСР":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.26. Death Match в тюрьме строгого режима: WARN.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Помеха":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.29. Помеха игрокам: SPAWN / KICK / JAIL 10+ минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Добив стадии":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.32. Добив в стадии смерти: JAIL 60-120 минут.[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Масс ДМ":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.39 Массовый ДМ (нанесение урона 3 и более игрокам): BAN 1-7 дней + Запрет на использование оружия: 1-14 дней[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Масс ДМ ЗЗ":
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

          let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]3.40 Массовый ДМ в ЗЗ (нанесение урона 3 и более игрокам): BAN 1-15 дней + Запрет на использование оружия: 1-30 дней[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Отказано":
        content = `<div>
          <label>Причина отказа жалобы:</label><br>
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

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(DOWN_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Рассмотрено":
        content = `<div>
          <label>Никнейм игрока, который получит наказание:</label><br>
          <input type="text" id="inputNickname" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Наказание, которое получит игрок (например: JAIL на 120 минут):</label><br>
          <input type="text" id="inputNakaz" style="width: 100%; margin-bottom: 10px;"><br>
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
         let nickname = $("#inputNickname").val();
         let nakaz = $("#inputNakaz").val();
         let rules = $("#rulesDropdown").val() || $("#inputRules").val();

         if (!nickname) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм игрока", "red");
           return;
         }
         if (!nakaz) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлено наказание", "red");
           return;
         }
         if (!rules) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил", "red");
           return;
         }

         let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игрок ${nickname} получит ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

         $(".fr-element").html(finalText);
         applyPrefixAndCloseThread(ACCEPT_PREFIX);
         $("#exposeMask").click();
       });
       break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "На рассмотрении":
          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Вашей жалобе присвоен статус "[COLOR=rgb(247, 218, 100)]На рассмотрении[/COLOR]".<br>К сожалению, ваша жалоба требует большего времени на вынесение вердикта.<br>Пожалуйста, ожидайте ответа в этой теме.[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(RASMOTR_PREFIX);
          $("#exposeMask").click();
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "На исправление":
        content = `<div>
          <label>Что необходимо исправить в жалобе?:</label><br>
          <input type="text" id="inputReason" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitReason" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        $(document).on("click", "#submitReason", function () {
          let reason = $("#inputReason").val();

          if (!reason) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлена информация", "red");
            return;
          }

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба может быть [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>С правилами оформления жалобы можете ознакомиться – [URL='https://forum.arizona-rp.com/threads/8086203/']Правила подачи жалоб.[/URL]<br>На исправление жалобы вам дается 24 часа. В противном ваша жалоба будет [COLOR=rgb(184, 49, 47)]отказана.[/COLOR]<br>Ожидаю ответа от вас в этой теме после исправления вышеуказанной проблемы.[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(DORABOTKA_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Отказано ":
        content = `<div>
          <label>Причина отказа жалобы:</label><br>
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

          let finalText = `[CENTER] <br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(DOWN_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Рассмотрено ":
        content = `<div>
          <label>Никнейм игрока, который получит наказание:</label><br>
          <input type="text" id="inputNickname" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Наказание, которое получит игрок (например: JAIL на 120 минут):</label><br>
          <input type="text" id="inputNakaz" style="width: 100%; margin-bottom: 10px;"><br>
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
         let nickname = $("#inputNickname").val();
         let nakaz = $("#inputNakaz").val();
         let rules = $("#rulesDropdown").val() || $("#inputRules").val();

         if (!nickname) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлен никнейм игрока", "red");
           return;
         }
         if (!nakaz) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлено наказание", "red");
           return;
         }
         if (!rules) {
           showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил", "red");
           return;
         }

         let finalText = `[CENTER] <br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игрок ${nickname} получит ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

         $(".fr-element").html(finalText);
         applyPrefixAndCloseThread(ACCEPT_PREFIX);
         $("#exposeMask").click();
       });
       break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Рассмотрено (пару игроков)":
        content = `<div>
          <label>Никнеймы игроков, которые получат наказание (пишите через запятую):</label><br>
          <input type="text" id="inputNickname" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Наказание, которое получат игроки (например: JAIL на 120 минут):</label><br>
          <input type="text" id="inputNakaz" style="width: 100%; margin-bottom: 10px;"><br>
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
          let nickname = $("#inputNickname").val();
          let nakaz = $("#inputNakaz").val();
          let rules = $("#rulesDropdown").val() || $("#inputRules").val();

          if (!nickname) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлены никнеймы игроков", "red");
            return;
          }
          if (!nakaz) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлено наказание", "red");
            return;
          }
          if (!rules) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил", "red");
            return;
          }

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игроки ${nickname} получат ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(ACCEPT_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Рассмотрено (пару игроков) ":
        content = `<div>
          <label>Никнеймы игроков, которые получат наказание (пишите через запятую):</label><br>
          <input type="text" id="inputNickname" style="width: 100%; margin-bottom: 10px;"><br>
          <label>Наказание, которое получат игроки (например: JAIL на 120 минут):</label><br>
          <input type="text" id="inputNakaz" style="width: 100%; margin-bottom: 10px;"><br>
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
          let nickname = $("#inputNickname").val();
          let nakaz = $("#inputNakaz").val();
          let rules = $("#rulesDropdown").val() || $("#inputRules").val();

          if (!nickname) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлены никнеймы игроков", "red");
            return;
          }
          if (!nakaz) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлено наказание", "red");
            return;
          }
          if (!rules) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил", "red");
            return;
          }

          let finalText = `[CENTER] <br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игроки ${nickname} получат ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(ACCEPT_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "На рассмотрении ":
          let finalTextt = `[CENTER] <br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Вашей жалобе присвоен статус "[COLOR=rgb(247, 218, 100)]На рассмотрении[/COLOR]".<br>К сожалению, ваша жалоба требует большего времени на вынесение вердикта.<br>Пожалуйста, ожидайте ответа в этой теме.[/FONT][/CENTER]`;

          $(".fr-element").html(finalTextt);
          applyPrefixAndCloseThread(RASMOTR_PREFIX);
          $("#exposeMask").click();
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "На исправление ":
        content = `<div>
          <label>Что необходимо исправить в жалобе?:</label><br>
          <input type="text" id="inputReason" style="width: 100%; margin-bottom: 10px;"><br>
          <button id="submitReason" class="button js-overlayClose">Добавить</button>
        </div>`;

        XF.alert(content, title);

        $(document).on("click", "#submitReason", function () {
          let reason = $("#inputReason").val();

          if (!reason) {
            showNotification("При создании ответа произошла ошибка:<br>Не добавлена информация", "red");
            return;
          }

          let finalText = `[CENTER] <br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба может быть [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>С правилами оформления жалобы можете ознакомиться – [URL='https://forum.arizona-rp.com/threads/8086181/']Правила подачи жалоб.[/URL]<br>На исправление жалобы вам дается 24 часа. В противном ваша жалоба будет [COLOR=rgb(184, 49, 47)]отказана.[/COLOR]<br>Ожидаю ответа от вас в этой теме после исправления вышеуказанной проблемы.[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(DORABOTKA_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Ручной ввод":
      content = `<div>
        <label>Доказательства нарушения (прикрепляем ссылку, строго полный url):</label><br>
        <input type="text" id="inputEvidence" style="width: 100%; margin-bottom: 10px;"><br>
        <label>Пункт правил, по которому выдано наказание (список):</label><br>
        <input type="text" id="searchRules" placeholder="Введите ключевые слова для поиска среди списка правил..." style="width: 100%; margin-bottom: 10px;"><br>
        <select id="rulesDropdown" style="width: 100%; margin-bottom: 10px;">
          <option value="">Выбор пункта правил из списка</option>
        </select>
        <label>Пункт правил, по которому выдано наказание (ручной ввод):</label><br>
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
        let reason = $("#rulesDropdown").val() || $("#inputRules").val();
        let evidence = $("#inputEvidence").val();
    
        if (!reason) {
          showNotification("При создании ответа произошла ошибка:<br>Не добавлен пункт правил, который нарушил игрок", "red");
          return;
        }
    
        if (!evidence) {
          showNotification("При создании ответа произошла ошибка:<br>Не добавлено доказательство нарушения", "red");
          return;
        }
    
        let finalText = `[CENTER][FONT=Comic Sans MS][IMG width='557px']https://psv4.userapi.com/s/v1/d/hzItZCj26o_PD2eXK1jBoVxU-w1iW6Bw6ILpNUGVEhS1zwPiuJZEsf6EOVSi4pHhJGc0ee49PM81tM9z0lcEVPnjLHxkElLG_aFbW4sM8AP2rElQ0vAVpg/j0PzQ9P.gif[/IMG]<br><br>Доброго времени суток, уважаемый игрок!<br>Вы были наказаны мною за нарушение [URL='https://forum.arizona-rp.com/threads/8086300/']правил сервера:[/URL]</FONT><br>[/CENTER] [QUOTE] [CENTER]${reason}[/CENTER] [/QUOTE]<br><br>[CENTER][FONT=Comic Sans MS]Доказательства вашего нарушения: [URL='${evidence}']*тык*[/URL]<br>Попрошу вас не оффтопить в данной теме и ожидать ответа от главной администрации (среднее время ответа - 12 часов).[/FONT][/CENTER]`;
    
        $(".fr-element").html(finalText);
        $("#exposeMask").click();
      });
      break;

      default:
        showNotification("Ошибка вывода ответа №1.<br>Обратитесь к разработчику скрипта.", "red");
    }
  });


  let currentInput = '',
  operator = '',
  previousInput = '',
  calculatorVisible = false,
  calculator, toggleButton;

  
    function createCalculator() {
      const savedState = localStorage.getItem('calculatorVisible');
      calculatorVisible = savedState === null ? false : JSON.parse(savedState);
      toggleButton = document.createElement('button');
      toggleButton.textContent = calculatorVisible ? 'Скрыть калькулятор' : 'Показать калькулятор';
      toggleButton.id = 'toggleButton';
      toggleButton.style.position = 'fixed';
      toggleButton.style.top = '20px';
      toggleButton.style.right = '20px';
      toggleButton.style.width = '160px';
      toggleButton.style.height = '45px';
      toggleButton.style.fontSize = '16px';
      toggleButton.style.cursor = 'pointer';
      toggleButton.style.borderRadius = '5px';
      toggleButton.style.zIndex = '10001';
      toggleButton.addEventListener('click', toggleCalculator);
      document.body.appendChild(toggleButton);

      calculator = document.createElement('div');
      calculator.style.position = 'absolute';
      calculator.style.right = '20px';
      calculator.style.top = '80px';
      calculator.style.padding = '20px';
      calculator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      calculator.style.color = '#fff';
      calculator.style.borderRadius = '8px';
      calculator.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
      calculator.style.fontFamily = 'Arial, sans-serif';
      calculator.style.zIndex = '10000';
      calculator.style.display = calculatorVisible ? 'block' : 'none';

      const display = document.createElement('input');
      display.type = 'text';
      display.id = 'display';
      display.disabled = true;
      display.style.width = '160px';
      display.style.height = '40px';
      display.style.fontSize = '20px';
      display.style.textAlign = 'right';
      display.style.marginBottom = '10px';
      display.value = currentInput || '0';
      calculator.appendChild(display);

      const buttons = [
          ['7', '8', '9', '/'],
          ['4', '5', '6', '*'],
          ['1', '2', '3', '-'],
          ['0', '.', '+', '=']
      ];

      buttons.forEach((row) => {
          const rowDiv = document.createElement('div');
          rowDiv.style.marginBottom = '10px';
          row.forEach((button) => {
              const buttonElement = document.createElement('button');
              buttonElement.textContent = button;
              buttonElement.style.width = '40px';
              buttonElement.style.height = '40px';
              buttonElement.style.margin = '5px';
              buttonElement.style.fontSize = '16px';
              buttonElement.style.cursor = 'pointer';
              buttonElement.style.borderRadius = '5px';
              buttonElement.addEventListener('click', () => {
                  if (button === '=') {
                      calculateResult();
                  } else if ('0123456789'.includes(button)) {
                      appendNumber(button);
                  } else if ('+-/*'.includes(button)) {
                      appendOperator(button);
                  } else if (button === 'C') {
                      clearDisplay();
                  }
              });
              rowDiv.appendChild(buttonElement);
          });
          calculator.appendChild(rowDiv);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '?';
      deleteButton.style.width = '40px';
      deleteButton.style.height = '40px';
      deleteButton.style.margin = '5px';
      deleteButton.style.fontSize = '16px';
      deleteButton.style.cursor = 'pointer';
      deleteButton.style.borderRadius = '5px';
      deleteButton.addEventListener('click', deleteLastDigit);
      calculator.appendChild(deleteButton);

      document.body.appendChild(calculator);

      document.addEventListener('keydown', handleKeyPress);
      window.addEventListener('scroll', updateCalculatorPosition);
  }

  function handleKeyPress(event) {
      if ('0123456789'.includes(event.key)) {
          appendNumber(event.key);
      } else if ('+-/*'.includes(event.key)) {
          appendOperator(event.key);
      } else if (event.key === 'Enter') {
          calculateResult();
      } else if (event.key === 'Backspace') {
          deleteLastDigit();
      } else if (event.key === 'Escape') {
          clearDisplay();
      }
  }

  function appendNumber(number) {
      currentInput += number;
      updateDisplay();
  }

  function appendOperator(op) {
      if (currentInput === '') return;
      previousInput = currentInput;
      operator = op;
      currentInput = '';
      updateDisplay();
  }

  function calculateResult() {
      let result;
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);
      if (isNaN(prev) || isNaN(current)) return;
      switch (operator) {
          case '+':
              result = prev + current;
              break;
          case '-':
              result = prev - current;
              break;
          case '*':
              result = prev * current;
              break;
          case '/':
              result = current === 0 ? 'Ошибка' : prev / current;
              break;
          default:
              return;
      }
      currentInput = result.toString();
      operator = '';
      previousInput = '';
      updateDisplay();
  }

  function updateDisplay() {
      const display = document.getElementById('display');
      display.value = currentInput || '0';
  }

  function toggleCalculator() {
      if (calculator && toggleButton) {
          calculatorVisible = !calculatorVisible;
          calculator.style.display = calculatorVisible ? 'block' : 'none';
          toggleButton.textContent = calculatorVisible ? 'Скрыть калькулятор' : 'Показать калькулятор';
          localStorage.setItem('calculatorVisible', JSON.stringify(calculatorVisible));
      }
  }

  function deleteLastDigit() {
      currentInput = currentInput.slice(0, -1) || '0';
      updateDisplay();
  }

  function clearDisplay() {
      currentInput = '';
      previousInput = '';
      operator = '';
      updateDisplay();
  }

  function updateCalculatorPosition() {
      const scrollPosition = window.scrollY;
      if (calculator) {
          calculator.style.top = 80 + scrollPosition + 'px';
      }
  }






  window.button_id++;
}