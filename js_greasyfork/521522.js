// ==UserScript==
// @name        Администрация сервера Arizona RP Love by C.Wayne
// @namespace   https://forum.arizona-rp.com/
// @match       https://forum.arizona-rp.com/*
// @grant       none
// @version     0.6.2 beta
// @author      Christopher_Wayne vk.com/chris_wayne
// @description vk.com/chris_wayne
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521522/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20Arizona%20RP%20Love%20by%20CWayne.user.js
// @updateURL https://update.greasyfork.org/scripts/521522/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20Arizona%20RP%20Love%20by%20CWayne.meta.js
// ==/UserScript==

var gosButtonname = "ЖБ гос";
var buttonname = "ЖБ несост";
var newButtonName = "ЖБ адм";
var settingsButtonName = "Settings";
var version = "0.6.2 beta";
const RASMOTR_PREFIX = 15; // на рассмотрении
const DORABOTKA_PREFIX = 15; // на рассмотрении
const ACCEPT_PREFIX = 17; // рассмотрено
const DOWN_PREFIX = 18; // отказано
const RULES_LIST = [
  "1.1. Использование Запрещённых Программ: BAN 1-2000 дней / BANIP.",
  "1.2. Использование 'вредительских' читов: BAN 2000 дней / BAN-IP.",
  "1.5. Багоюз: Warn / BAN 15+ дней.",
  "1.6. Багоюз с виртами: BAN 2000 дней.",
  "1.7. Ферма рулеток: BAN 2000 дней.",
  "1.8. Накрутка рефералов: BAN 2000 дней.",
  "1.9. Махинации с виртами: BAN 2000 дней.",
  "1.10. Мультиаккаунт: BAN 30-2000 дней.",
  "1.11. Cleo анимации: BAN 1-5 дней.",
  "1.12. NonRP развод: BAN 30-2000 дней.",
  "1.13. Слив поста лидера: BAN 2000 дней.",
  "1.14. Слив аккаунта: BAN 2000 дней.",
  "1.15. Взлом аккаунтов: BAN 2000 дней.",
  "1.16. Вымогать имущество или деньги у игроков: BAN 30-2000 дней.",
  "1.17. Подставлять / намеренно сливать игроков / администрацию: BAN 30-2000 дней.",
  "1.18. Распространение скриптов, клео и т.д., которые запрещены на нашем сервере (любой ресурс): BAN 2000 дней.",
  "1.19. Использование любых скриптов / модификаций дающих информацию об игроках в зоне стрима: BAN 30 дней.",
  "1.20. Использование бота, ахк, биндера и т.д. для рекламы (автореклама, когда игрок отходит от ПК): BAN 5 дней.",
  "1.22. Запрещено использовать обход лаунчера для ловли авто люкс-класса: BAN 30-2000 дней.",
  "1.23. Эмулятор лаунчера (Вы играете не с лаунчера, но получаете бонусы как за игру с него), разрешен только официальный лаунчер с сайта: BAN 10 дней.",
  "1.24. Использование любых скриптов авто пополнения хп и голода: BAN 10 дней.",
  "1.25. 'Вилка в клавиатуре': KICK если не дает никакого преимущества / BAN 5 дней.",
  "1.26. Запрещена передача предметов через комнату отеля: BAN 2000 дней.",
  "1.27. Обман, ввод в заблуждение игроков: MUTE 150+ минут / BAN 5+ дней.",
  "1.28. Передавать наземную нефтевышку с целью передачи AZ-Coins другому игроку: BAN 30-2000 дней.",
  "1.29. Запрещена попытка нарушения правил сервера равноценная полноценному нарушению: BAN 30-2000 дней.",
  "1.30. Запрещено использования обходных ников: Предупреждение, в случае отказа BAN 10 дней.",
  "1.31. Запрещено проведение и участие в любых неофициальных конкурсах, в том числе рулетках и тому подобного: BAN 30-2000 дней.",
  "1.32. Слив / распространение личной информации игрока, администратора (деанон): BAN 2000 дней.",
  "1.33. Запрещено взаимодействовать с игроками, находящимися в чёрном списке проекта/сервера. BAN 30-2000 дней.",
  "1.34. Неадекватное поведение на форуме: BAN 30+ дней.",
  "1.35. Изменение биндов на клавиши: WARN.",
  "1.37. Прокрутка рулеток для получения выгоды (являться гарантом; брать процент за прокрутку; прокрутка за донат на стриме и т.п.): MUTE 120 минут.",
  "1.38. Использование скинов роллера (Rollerskater) с целью получения преимущества над другими игроками в определенных ситуациях: JAIL 120 минут / WARN.",
  "1.39. Использование скинов с анимацией 'CJ' при нападении на военную базу и на серверных мероприятиях (Зловещий дворец и т.п.): JAIL 60-120 минут.",
  "1.40. Призыв к нарушению правил: Наказание согласно тому правилу которое вы призывали нарушать / BAN 10-2000 дней.",
  "1.41. Массовое нарушение правил сервера (10+ и более деморганов/варнов за последние 15 дней): BAN 5-60 дней (увеличение с каждым наказанием).",
  "1.42. Запрещено перезаписывать опровержения(перефрапс): просьба загрузить оригинальную запись, иначе отказ в жалобе / принятии опры / изъятие имущества: BAN 30-2000 дней.",
  "1.43. Запрещено использовать неофициальный мобильный лаунчер (скачанный не с сайта нашего проекта) при игре на сервере, а также запрещено использовать обход мобильного лаунчера: BAN 10 дней.",
  "1.44. Обход любых игровых систем: JAIL 60+ минут / WARN / BAN 1-2000 дней.",
  "1.45. Стримснайпинг: JAIL 60+ минут / BAN 1-5 дней.",
  "1.46. Запрещено удалять жалобу после ответа администратора, либо запроса опровержения: BAN 15-2000 дней.",
  "1.47. Доказательства, которые вы прикрепляете при написании жалобы, запрещено скрывать в течение 5 ДНЕЙ: BAN 15-2000 дней.",
  "1.49. Слив (внутриигровое распространение) промокодов или спойлеров обновлений с https://boosty.to/arizona_games: MUTE 180+ минут / По решению ГА - BAN 30 дней.",
  "1.50. Запрещено закрывать бизнесы, которые присутствуют в начальной квестовой линии для новичков: Предупреждение / изъятие бизнеса.",
  "1.51. Реклама промо-кода в игре через бизнес в объявлениях: Удаление объявления / BAN 1 день.",
  "1.52. Изменение положения аксессуаров в неадекватной/некорректной форме: Запрет 1-72 PayDay / (При массовых нарушениях: BAN 1-5 дней).",
  "1.53. Запрещено требовать вирты / имущество за вход или добычу ресурсов на Новой Шахте: BAN 1-15 дней.",
  "2.1. Упоминание родных: MUTE 300 минут.",
  "2.2. Оскорбление родных: BAN 1-2000 дней.",
  "2.3. Оскорбление администрации: MUTE 200+ минут / BAN 1-3 дня.",
  "2.4. Оффтоп в /report: RMUTE 60+ минут.",
  "2.5. Ложные жалобы в /report: RMUTE 60+ минут.",
  "2.6. Упоминание родных в /report: RMUTE 180 минут и MUTE 300 минут.",
  "2.7. Оскорбление в /report: RMUTE 180 минут, за повторное BAN 1+ день.",
  "2.8. Оскорбление / мат в OOC чат: MUTE 30+ минут.",
  "2.9. MetaGaming: MUTE 30+ минут.",
  "2.10. Транслит: MUTE 30+ минут.",
  "2.11. 'Не средство связи', Багоюз '1.1.1.1.1 сообщение': MUTE 60-120 минут.",
  "2.12. Капс: MUTE 30+ минут.",
  "2.13. Обман администрации: MUTE 300 минут / BAN 15+ дней.",
  "2.14. Флуд: MUTE 30+ минут.",
  "2.15. Реклама сторонних ресурсов: MUTE 300 минут / BAN 30+ дней / BAN-IP 630 дней.",
  "2.16. Злоупотребление символами: MUTE 30+ минут.",
  "2.17. Оскорбление нации, обсуждение политики, розжиг межнациональной розни: MUTE 120+ минут / BAN 30-2000 дней.",
  "2.18. Казино в /try: BAN 10-14 дней. Игроку, который участвовал в игре в качестве гаранта: BAN 5-7 дней.",
  "2.19. Призыв к игре в 'Казино в /try': MUTE 60+ минут.",
  "2.20. Оскорбление сервера / Проекта: MUTE 200+ минут / BAN 5-2000 дней.",
  "2.21. Неадекватное поведение: MUTE 60+ минут / BAN 1-5 дней.",
  "2.22. Провокация администрации / игрока на конфликт: MUTE 60+ минут.",
  "2.23. Организованный флуд (отправка сообщений от разных лиц, но с одним контекстом): MUTE 60-200 минут всем участникам флуда.",
  "2.24. Провокация на флуд: MUTE 60-120 минут.",
  "2.25. Использование 'лесенки': MUTE 60+ минут.",
  "2.26. Написание ошибочных предложений сервера по типу: Server is Full, You Are Banned From This Server в /vr: MUTE 60 минут.",
  "2.27. Выставление себя в роли администратора: MUTE 60-120 минут.",
  "2.28. Багоюз сообщений при помощи заглушки для семейного чата: перевыдача наказания до х2 ( При достигнутом лимите 300 минут мута, BAN на 1 день).",
  "2.29. Нон РП отыгровки: MUTE 30+ минут.",
  "2.30. ООС оскорбление: MUTE 120+ минут / BAN 1-10 дней.",
  "2.31. Массовое нарушение правил чата: на первый раз MUTE 300 минут, далее BAN 1-5 дней.",
  "3.1. Death Match: JAIL 60+ минут / Неоднократно - Запрет на использование оружия: 1-7 дней.",
  "3.2. Любое нанесение урона в зеленой зоне запрещено (исключение: сотрудники ФБР/Полиции при провокации): JAIL 120+ минут / WARN / Неоднократно - Запрет на использование оружия: 1-14 дней.",
  "3.3. DriveBy: JAIL 60+ минут / WARN.",
  "3.4. Revenge Kill: JAIL 120+ минут / WARN.",
  "3.5. Power Gaming: JAIL 120+ минут / WARN.",
  "3.6. Spawn Kill: JAIL 120+ минут / WARN / Запрет на использование оружия: 1-30 дней.",
  "3.7. Team Kill: JAIL 120+ минут / WARN / Запрет на использование оружия: 1-30 дней.",
  "3.8. Выход из игры от ареста / RP / смерти. Уход в инту, использование воздушного шара от смерти / ареста / RP: JAIL 120+ минут / WARN.",
  "3.9. АФК от смерти / ареста / RP: JAIL 120+ минут / WARN.",
  "3.10. Уход от наказания (смена ника и др.): BAN 30+ дней.",
  "3.11. Оружие в зеленой зоне: Изъятие оружия / JAIL 10+ минут.",
  "3.12. NonRP: JAIL 120+ минут / WARN.",
  "3.13. Сбив анимации выстрела любым способом (+С, отводы, сбив темпа и т.п.) в стену: JAIL 60-120 минут.",
  "3.14. Сбив анимации выстрела любым способом (+С, отводы, сбив темпа и т.п.) в игрока: JAIL 150-300 минут / WARN.",
  "3.15. Сбив анимации: JAIL 60-120+ минут / WARN.",
  "3.16. NonRP расположение переносной лавки (создание помехи на проходе, у пикапов, на дороге и т.д.): KICK / JAIL 30+ минут.",
  "3.17. Ставить трейлеры помехой другим игрокам: JAIL 120 минут / SPAWN трейлера на стандартную парковку.",
  "3.18. На ферме льна и хлопка разрешено ставить трейлеры только в специальном парке: SPAWN трейлера на стандартную парковку.",
  "3.19. Продажа/покупка платформы на СТО: JAIL 60 минут.",
  "3.20. Использование транспорта на шахте или ферме с целью сбора ресурсов либо помехи игрокам: JAIL 30+ минут.",
  "3.21. Передавать вещи, полученные с ивента, с твинков на основу: BAN 2000 дней.",
  "3.22. Запрещено использовать аптечки, бронежилет, наркотики в бою: JAIL 120 минут / WARN.",
  "3.23. DriveBy ковшом от тюнинга: WARN / BAN 3 дня.",
  "3.24. DeathMatch на слёте / аукционе: JAIL 300+ минут / BAN 1-5 дней.",
  "3.25. Использование камней неуязвимости на притоне: WARN.",
  "3.26. Death Match в тюрьме строгого режима: WARN.",
  "3.27. Сбив стадии смерти: JAIL 120+ минут / WARN.",
  "3.28. Помеха работе администрации: JAIL 10+ минут.",
  "3.29. Помеха игрокам: SPAWN / KICK / JAIL 10+ минут.",
  "3.30. Использование Зеленых зон для получения выгоды при перестрелке (Абьюз ЗЗ): WARN.",
  "3.31. ДМ/Соучастие в ДМе на ЦР, СТО и т.п. с целью получения лавки/платформы: BAN 5-7 дней (при повторном нарушении от игрока наказание удваивается).",
  "3.32. Добив в стадии смерти: JAIL 60-120 минут.",
  "3.33. Death Match сотрудников гос.организаций/помеха работе: JAIL 200+ минут / WARN.",
  "3.34. Намеренно/неправильно редактировать объявления в СМИ: MUTE 60+ минут / WARN.",
  "3.35. Использование любых анимаций с целью унижения игрока: WARN.",
  "3.36. Лечить/поднимать со стадии во время перестрелок, на военной базе, наркопритоне и так далее (врачам из частных организаций): JAIL 60-120 минут / WARN.",
  "3.37. Редакторам СМИ запрещается флуд однотипными объявлениями: MUTE 60-120 минут.",
  "3.38. Спиливать деревья игроков, которые находятся вблизи деревьев: JAIL 60-120 минут.",
  "3.39. Массовый ДМ (нанесение урона 3 и более игрокам): BAN 1-7 дней + Запрет на использование оружия: 1-14 дней.",
  "3.40. Массовый ДМ в ЗЗ (нанесение урона 3 и более игрокам): BAN 1-15 дней + Запрет на использование оружия: 1-30 дней.",
  "3.41. Соучастие в ДМе (намеренная езда за игроками с целью их убийства вашей компанией): Наказание как за ДМ."
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
    `Приветствую вас, ${username}.<br>Помощник администрации для<br>сервера Love готов к работе.<br>Версия: ${version}`,
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
  buttonsh_add("На исправление");
  buttonsh_add("Тех. раздел");
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
  buttonsh_add("На исправление ");
  buttonsh_add("Тех. раздел ");
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
      <p>Скрипт "Администрация сервера Arizona RP Love by C.Wayne".</p>
      <p>Версия скрипта: <span style="color: #90EE90;">${version}</span></p>
      <p>Разработчик скрипта: <a href="https://vk.com/chris_wayne" target="_blank" style="color: #AFEEEE;">Christopher_Wayne</a></p>
      <p>Помощник в разработке: <a href="https://vk.com/grsky" target="_blank" style="color: #AFEEEE;">James_Mustang</a></p>
      <p>Скрытие кнопок (галочка - кнопка активна):</p>
      <label><input type="checkbox" id="toggleGos"> ЖБ гос</label><br>
      <label><input type="checkbox" id="toggleNesost"> ЖБ несост</label><br>
      <label><input type="checkbox" id="toggleAdm"> ЖБ адм</label><br><br>
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

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

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

         let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игрок ${nickname} получит ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

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

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба [COLOR=rgb(97, 189, 109)]рассмотрена,[/COLOR] выношу вердикт:<br>Игроки ${nickname} получат ${nakaz} в соответствии с правилом ниже:<br>[QUOTE]${rules}[/QUOTE]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(ACCEPT_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "На рассмотрении ":
          let finalTextt = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Вашей жалобе присвоен статус "[COLOR=rgb(247, 218, 100)]На рассмотрении[/COLOR]".<br>К сожалению, ваша жалоба требует большего времени на вынесение вердикта.<br>Пожалуйста, ожидайте ответа в этой теме.[/FONT][/CENTER]`;

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

          let finalText = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Ваша жалоба может быть [COLOR=rgb(184, 49, 47)]отказана[/COLOR] в рассмотрении.<br>${reason}<br>С правилами оформления жалобы можете ознакомиться – [URL='https://forum.arizona-rp.com/threads/8086181/']Правила подачи жалоб.[/URL]<br>На исправление жалобы вам дается 24 часа. В противном ваша жалоба будет [COLOR=rgb(184, 49, 47)]отказана.[/COLOR]<br>Ожидаю ответа от вас в этой теме после исправления вышеуказанной проблемы.[/FONT][/CENTER]`;

          $(".fr-element").html(finalText);
          applyPrefixAndCloseThread(DORABOTKA_PREFIX);
          $("#exposeMask").click();
        });
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Тех. раздел":
          let texnesost = `[CENTER][IMG width='557px']https://i.imgur.com/ICiDVGX.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Проблемы подобного рода рассматриваются в техническом разделе.<br>Обратиться в технический раздел сервера можно кликнув по надписи - [URL='https://forum.arizona-rp.com/forums/3355/'][COLOR=rgb(247, 218, 100)]Технический раздел[/COLOR][/URL]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(texnesost);
          applyPrefixAndCloseThread(DOWN_PREFIX);
          $("#exposeMask").click();
        break;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      case "Тех. раздел ":
          let texgos = `[CENTER][IMG width='557px']https://i.imgur.com/FzmdYlJ.png[/IMG]<br><br>[FONT=Comic Sans MS]Доброго времени суток, уважаемый игрок.<br>Проблемы подобного рода рассматриваются в техническом разделе.<br>Обратиться в технический раздел сервера можно кликнув по надписи - [URL='https://forum.arizona-rp.com/forums/3355/'][COLOR=rgb(247, 218, 100)]Технический раздел[/COLOR][/URL]<br>Администрация сервера желает Вам приятной игры и хорошего времяпровождения.<br>Тема [COLOR=rgb(184, 49, 47)]закрыта.[/COLOR][/FONT][/CENTER]`;

          $(".fr-element").html(texgos);
          applyPrefixAndCloseThread(DOWN_PREFIX);
          $("#exposeMask").click();
        break;
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

  window.button_id++;
}