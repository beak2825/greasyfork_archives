// ==UserScript==
// @name       BetterLZT-lite By LolzNews & Openresty
// @namespace  betterlzt
// @version    3.0.1
// @author     Openresty \w LolzNews
// @license    Apache 2.0
// @description Legendary extension for Lolzteam from LolzNews
// @icon       https://lolz.live/styles/brand/download/avatars/three_avatar.svg
// @match      https://zelenka.guru/*
// @match      https://lzt.market/*
// @match      https://lolz.market/*
// @match      https://lolz.live/*
// @connect    *
// @connect    hasan.ovh
// @connect    hasan.su
// @grant      GM.getValue
// @grant      GM.setValue
// @grant      GM_getValue
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @grant      unsafeWindow
// @run-at     document-body
// @downloadURL https://update.greasyfork.org/scripts/525086/BetterLZT-lite%20By%20LolzNews%20%20Openresty.user.js
// @updateURL https://update.greasyfork.org/scripts/525086/BetterLZT-lite%20By%20LolzNews%20%20Openresty.meta.js
// ==/UserScript==
//
// ЛЮБЫЕ МОДИФИКАЦИИ КОДА, КОТОРЫЕ НАРУШАЮТ ПРАВИЛА ФОРУМА, ПРИВОДЯТ К СБОЯМ И НАРУШАЮТ РАБОТУ
// ФОРУМА/РАСШИРЕНИЯ ПРИВЕДУТ К БЛОКИРОВКАМ (ФОРУМНОЙ УЧЕТНОЙ ЗАПИСИ/УЧЕТНОЙ ЗАПИСИ BETTERLZT LIVE)
//


(async function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function conVar(convar, isGlobal = false) {
    try {
      if (isGlobal) return globalConfig[convar];
      return userConfig[convar];
    } catch (e) {
      return false;
    }
  }
  function set_conVar(convar, value, isGlobal = false) {
    if (isGlobal) {
      globalConfig[convar] = value;
      return saveConfig(true);
    }
    userConfig[convar] = value;
    saveConfig();
  }
  function saveConfig(isGlobal = false) {
    if (isGlobal)
      return _GM_setValue("globalConfig", JSON.stringify(globalConfig));
    _GM_setValue("userConfig", JSON.stringify(userConfig));
  }
  function makeWatermark(text, link = "#") {
    if (!text) return false;
    const waterm = document.createElement("h1");
    waterm.style = "position:fixed;bottom:5px;right:5px;opacity:0.5;z-index:99;color:white;font-size: 25px;";
    waterm.innerHTML = text;
    waterm.href = link;
    return document.body.append(waterm);
  }
  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      console.error("[BetterLZT Tools] JSON parse failed: " + e);
      return false;
    }
    return true;
  }
  function changeUserStatus(status) {
    if (!status) return;
    let statusArea = document.querySelector(".userBlurb.current_text ");
    return statusArea.innerHTML = status;
  }
  function changeUserAvatar(mode = "def") {
    if (conVar("lolznews")) mode = "lolznews";
    try {
      let imageUrl;
      switch (mode) {
        case "lolznews":
          imageUrl = "https://hasan.ovh/better/lolznews.png";
          break;
        default:
          imageUrl = "data:image/png;base64,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";
          break;
      }
      let imageArea = document.querySelector(".avatarScaler img");
      imageArea.src = imageUrl;
      return true;
    } catch {
      return false;
    }
  }
  function inProfile() {
    return !!document.querySelector(".avatarScaler");
  }
  function xfAlert(text) {
    return XenForo.alert(text, 1, 1e4);
  }
  const css = ` <style>
    .main-text {
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        display: inline;
    }
    .btns-l {
        margin-bottom: 10px;
        margin-right: 10px;
        border-radius: 6px;
        display: inline-block;
        padding: 7px 15px;
        background: #363636;
        justify-content: center;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
    }
    details {
        width: 100%;
        background: #272727;
        border: solid 3px #363636;
        box-shadow: 0 0.1rem 1rem -0.5rem rgba(0, 0, 0, .4);
        border-radius: 8px;
        overflow: hidden;
        margin-top: -25px;
        margin-bottom: 35px;
    }
    summary {
        padding: 15px;
        display: block;
        background: #363636;
        position: relative;
        cursor: pointer;
        color: #D6D6D6;
        font-family: Open Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }
    summary span {
        color: #949494;
        font-size: 13px;
    }
    details span {
        color: #949494;
        font-size: 13px;
    }
    summary:after {
        font-family: "Font Awesome 5 Pro";
        color: rgb(148,148,148);
        content: '>';
        position: absolute;
        left: 97%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(90deg);
        transform-origin: 0.2rem 50%;
        transition: 0.25s transform ease;
    }
    details[open] > summary:after {
        transform: translate(-50%, -50%) rotate(270deg);
    }
    details[open] > div {
        padding: 10px 20px;
    }
    details .leftButton {
        margin-right: 10px;
    }
    details button {
        width: 45px;
        height: 45px;
        padding: 5px;
        justify-content: center;
        align-items: center;
        color: rgb(34,142,93);
        border-radius: 6px;
        background: #363636;
        border: none;
        font-size: 25px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    details button.active {
        border: 1.6px solid #07C682;
        background: linear-gradient(180deg, rgba(7, 198, 130, 0.12) 0%, rgba(7, 198, 130, 0.00) 100%), #363636;
    }
    details input.input{
        width: 77%;
        padding: 6px;
        border-radius: 6px;
        height: 20px;
        background: #303030;
        color: white;
        border: 1px solid rgb(54, 54, 54);
    }

    details input[type=checkbox] {
        width: auto;
    }
    details input[type=checkbox]:after {
        border-radius: 4px;
    }
    
    .reportBtn {
        font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer; color: #fff; border: 0;
    }
    </style>`;
  function init() {
    if (conVar("customBackground")) {
      document.querySelector("body").style = `background-size: cover;
                background-position: center;
                background-attachment: fixed;
                background-repeat: no-repeat;
                background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${conVar(
      "customBackground"
    )}')`;
    }
  }
  function saveBackground() {
    let bgUrl = document.querySelector("#custombg").value;
    xfAlert("Сохранено");
    if (bgUrl.length < 1) return set_conVar("customBackground", false);
    return set_conVar("customBackground", bgUrl);
  }
  const render = `
let handling = 0;
           let step = 0;
    window.addEventListener('message', function(event) {
        if (event.data == '20100') {
            handling = 0;
            step = 0
            iframe = document.querySelectorAll('#areaext');  
            iframe.forEach(function (e){
                e.contentWindow.postMessage("10100", "*");
                e.contentWindow.postMessage(betterVersion, "*");
                e.contentWindow.postMessage(XenForo.visitor.user_id, "*");
            })
        }
        if (event.data == '20200') {
            handling = 20200
            step = 0
        }
        if (event.data == '20300') {
            handling = 20300
            step = 0
            set_conVar('userScripts', 0)
            xfAlert('Успешно!')
        }
        else if (handling == 20200 && event.data != '20200') {
            if (step == 0) {
                window.betterAPI.loadScript(event.data, 'Ext'+ event.data, function() {
                    window.betterAPI.runScript(event.data, 0);
                });
                handling = 20200;
                step = 1;
                xfAlert('Успешно!')
            }
            if (step == 1) {
                xfAlert('Попытка установить скрипт (LiveID#' +event.data + ')') 
                handling = 0;
                step = 0;
            }
        }
        
    });
    
    function steam(arg) {
        e.contentWindow.postMessage(arg, "*");
    }
`;
  function exuiOnPage() {
    if (!document.querySelector(".error-container:not(.betterlzt)")) return;
    let htmlall = `
    <details>
        <summary><i class="fas fa-wrench"></i> Основные<br><span>Реклама, секретный вопрос</span></summary>
        <div><br>
            <div class='btns-l' id='adblock'> Блокировщик рекламы</div>
            <div class='btns-l' id='hideLikes'> Скрывать счетчик лайков в профиле</div>
            <div class='btns-l' id='reportBtns'> Показывать кнопки для быстрой подачи жалоб</div>
            <div class='btns-l' id='nickCopy'> Показывать кнопки для копирования ника</div>
            <div class='btns-l' id='no_update'> Игнорировать обновления</div>
            <hr style="border: solid 1px #363636;">
            <p class="main-text" onclick="window.location.href = 'https://telegra.ph/Security-note-for-BetterLZT-feature-06-27'">Автоматический ввод секретной фразы: (Важная заметка! кликабельно)<br></p>
            <br>
            <input id="secretph" class="input" placeholder="Введите вашу секретную фразу"> <a class="button leftButton primary" onclick="saveSecret()" id="secretphBtn">Сохранить</a>

            </div>
    </details>
        <details>
        <summary><i class="fas fa-sparkles"></i> BetterLZT AI<br><span>Исскуственный интелект и фактор доверия</span></summary>
        <div>
            <p>ВАЖНО! Функции ИИ находятся на этапе разработки. Модели ИИ могут допускать ошибки, перепроверяйте!</p>
            <br>
            <span>* - Доступность не гарантируется</span><br>
            <span>ß - Ранний бета-доступ</span><br>
            <div class="btns-l" id="trustFactor">Фактор доверия (ß *)</div>
            <div class='btns-l' id='rai'> ИИ Ассистент по Розыгрышам (ß *)</div>
<!--            <div class='btns-l' id='rai_report'> Поиск нарушение в сообщениях (ß) <span style="color: red">*</span></div>-->
         </div>
    </details>
    <details>
        <summary><i class="fas fa-palette"></i> Внешний вид<br><span>Оформи форум под себя</span></summary>
        <div><br>
            <p>Не работает в LTS</p>
            <p class="main-text">Кастомный фон для всего форума (ссылка на картинку): <br></p>
            <br>
            <input id="custombg" class="input" placeholder="URL"> <a class="button leftButton primary" onclick="saveBackground()">Сохранить</a>
        </div>
    </details>
    <details>
        <summary><i class="fas fa-flag"></i> Кнопки быстрой подачи жалоб<br><span>Редактирование текста на кнопках</span></summary>
        <div><br>
           <p class="main-text">Нажмите на кнопку и введите текст. Учтите, что этот текст будет отправлен в жалобе. Пустой текст скрывает кнопку<br></p>
           <br>
           <input type="text" id="reportBtn-1" class="reportBtn" value="${userConfig["reportBtn-1"]}"> <input type="text" id="reportBtn-2" class="reportBtn" value="${userConfig["reportBtn-2"]}"> <input type="text" id="reportBtn-3" class="reportBtn" value="${userConfig["reportBtn-3"]}">
        </div>
    </details>
    `;
    let script = document.createElement("script");
    script.appendChild(document.createTextNode(render));
    document.head.appendChild(script);
    let html_prem = `
    <div style="background: rgb(54, 54, 54);
        margin: 5px 10px;
        padding: 0 15px 15px 15px; border-radius: 0px; ${localCache.serverNotice ? "" : "display: none"}"><br>
        ${localCache.serverNotice ?? ""}
    </div><br>
    ${htmlall}
    <div style="display: flex;
    width: 598px;
    justify-content: space-between;
    align-items: flex-start;">
    Version ${betterVersion}
    LN Marketplace-client 1.2
    </div>
    <a class="button leftButton primary" target="_blank" href="https://t.me/lolz_news">LolzNews - Подпишитесь)</a>
    <a class="button leftButton primary" target="_blank" href="https://lolz.live/payment/balance-transfer?user_id=2626330&hold=0&comment=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%B6%D0%B5%D1%80%D1%82%D0%B2%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5">Разработчику на доширак</a>
<!--    <a class="button leftButton" href="https://t.me/Betterlzt_bot">Стать бета-тестером</a>-->
    <a class="button leftButton" onclick="resetConfig()">Сброс настроек</a>

   ${css}
    `;
    document.querySelector(".error-container:not(.betterlzt)").innerHTML = html_prem;
    document.querySelector(".error-container:not(.betterlzt)").classList.add("betterlzt");
    return true;
  }
  const adlist_w = [
    "zelenka.guru/threads/3649746",
    "http://proxysoxy.com",
    "zelenka.guru/threads/2770783",
    "https://t.me/talkthenews",
    "https://zelenka.guru/threads/5862277/",
    "zelenka.guru/threads/5802663/",
    "@UniServBot",
    "zelenka.guru/threads/5886612",
    "https://zelenka.guru/threads/5830418/",
    "zelenka.guru/angeldrainer/",
    "zelenka.guru/threads/5883557",
    "zelenka.guru/threads/5720998",
    "https://zelenka.guru/threads/5488501",
    "https://zelenka.guru/threads/4871985/",
    "zelenka.guru/threads/3649746",
    "zelenka.guru/threads/5402454",
    "zelenka.guru/threads/2630352",
    "https://t.me/poseidon_project",
    "https://zelenka.guru/threads/4826265/",
    "zelenka.guru/threads/4939541",
    "zelenka.guru/threads/4073607",
    "zelenka.guru/threads/5071761/",
    "https://zelenka.guru/threads/3695705/",
    "zelenka.guru/members/4177803",
    "@verif_ads",
    "verifteam",
    "SmmPanelUS.com",
    "lteboost.ru"
  ];
  const adlist_white = ["t.me/lolz_news", "https://t.me/lolz_news"];
  await( _GM_getValue("adBlock"));
  function run$4() {
    if (!conVar("adblock")) return false;
    if (document.querySelector(".avatarScaler")) return profile$1();
  }
  function containsLink(str) {
    const urlRegex = /https?:\/\/[^\s|<>"]+(?!(?:(?:[^<]*<){2}))/g;
    const noHtmlStr = str.replace(/<[^>]*>/g, "");
    const matches = noHtmlStr.match(urlRegex);
    return !!matches;
  }
  function profile$1() {
    let userStatus = document.querySelector(".userBlurb.current_text");
    try {
      if (containsLink(userStatus.innerHTML) && !adlist_white.some((o) => userStatus.innerHTML.toLowerCase().includes(o))) {
        changeUserStatus("Реклама скрыта");
        changeUserAvatar();
        return true;
      }
      if (adlist_w.some((o) => userStatus.innerHTML.toLowerCase().includes(o)) && !adlist_white.some((o) => userStatus.innerHTML.toLowerCase().includes(o))) {
        changeUserStatus("Реклама скрыта");
        changeUserAvatar();
        return true;
      }
    } catch (e) {
      if (globalConfig["unlock_dev"])
        console.log("метод обнаружения рекламы не сработал: " + e);
      return false;
    }
    return userStatus.innerHTML === "Реклама скрыта";
  }
  const ui_primary = "#228e5e";
  const ui_error = "#8e2222";
  async function show() {
    let theme2 = await conVar("dashboard", true);
    switch (await theme2) {
      case "exui":
        exuiOnPage();
        break;
      default:
        exuiOnPage();
        break;
    }
    buttonsRender();
    const buttons = document.querySelectorAll(".btns-l");
    const report_buttons = document.querySelectorAll(".reportBtn");
    buttons.forEach((button) => {
      button.addEventListener("click", handleClick);
    });
    report_buttons.forEach((button) => {
      button.addEventListener("change", handleClick);
    });
  }
  function handleClick(e) {
    e = e.target;
    let state;
    switch (e.id) {
      case "adblock":
        state = conVar("adblock");
        set_conVar("adblock", !state);
        e.style.background = state ? "" : ui_primary;
        if (!state) run$4();
        break;
      case "hideLikes":
        state = conVar("hideLikes");
        set_conVar("hideLikes", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "trustFactor":
        state = conVar("trustFactor");
        set_conVar("trustFactor", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "visitorDetector":
        state = conVar("visitorDetector");
        set_conVar("visitorDetector", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "reportBtns":
        state = conVar("reportBtns");
        set_conVar("reportBtns", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "saveCustom":
        window.betterAPI.loadScript(document.querySelector("#loadcustom").value, "Test", function() {
          window.betterAPI.runScript("Test", 0);
        });
        break;
      // Report buttons. TODO: refactor
      case "reportBtn-1":
        set_conVar("reportBtn-1", e.value);
        xfAlert("Сохранено");
        break;
      case "reportBtn-2":
        set_conVar("reportBtn-2", e.value);
        xfAlert("Сохранено");
        break;
      case "reportBtn-3":
        set_conVar("reportBtn-3", e.value);
        xfAlert("Сохранено");
        break;
      case "nickCopy":
        state = conVar("nickCopy");
        set_conVar("nickCopy", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "hide_ftapanel":
        state = conVar("hide_ftapanel");
        set_conVar("hide_ftapanel", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "rai":
        state = conVar("rai");
        set_conVar("rai", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "rai_textgen":
        state = conVar("rai_textgen");
        set_conVar("rai_textgen", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "rai_report":
        state = conVar("rai_report");
        set_conVar("rai_report", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      case "no_update":
        state = conVar("no_update");
        set_conVar("no_update", !state);
        e.style.background = state ? "" : ui_primary;
        break;
      default:
        e.style.background = ui_error;
        xfAlert(
          "Данная функция временно недоступна. Обновите страницу"
        );
        break;
    }
  }
  function settingsButtons() {
    let accountMenu = document.querySelector(
      "#AccountMenu > ul > li:nth-child(12) > a"
    );
    let settingsMenuItem = document.createElement("li");
    settingsMenuItem.innerHTML = '<a href="betterlzt_settings">BetterLZT</a>';
    accountMenu.parentNode.insertBefore(
      settingsMenuItem,
      accountMenu.nextSibling
    );
  }
  function buttonsRender() {
    let buttons = document.querySelectorAll(".btns-l");
    buttons.forEach((e) => {
      if (conVar(e.id)) e.style.background = ui_primary;
    });
  }
  function saveSecret() {
    let phrase = document.querySelector("#secretph").value;
    if (!phrase || conVar("secureTest", false) !== true) {
      set_conVar("secretPhrase", false);
      set_conVar("safeMode", true, true);
      return alert("Обнаружено нарушение безопасности. Секретная фраза удалена из кеша BetterLZT\nФункция автозаполнения секретной фразы отключена");
    }
    if (conVar("safeMode", true) || conVar("secureTest", false) !== true) {
      return alert("Включен безопасный режим\nФункция автозаполнения секретной фразы недоступна\nПереустановите расширение");
    }
    document.querySelector("#secretphBtn").innerHTML = "Сохранено!";
    return set_conVar("secretPhrase", phrase);
  }
  function pasteSecret() {
    let secretArea = document.querySelector("input[name=secret_answer]");
    if (secretArea && conVar("secretPhrase")) {
      secretArea.value = conVar("secretPhrase");
      return true;
    }
    return false;
  }
  async function calculate(user) {
    if (localCache.TrustFactorService.minExtVersion > betterVersion || !localCache.TrustFactorService.status) {
      xfAlert("В работе службы TrustFactor возникла ошибка: Службы LIVE недоступны");
      return "unavailable";
    }
    try {
      const { likes, registrationDate, deposit, trophies, messages, giveaways } = user;
      try {
        const response = await fetch(`https://hasan.ovh:2083/trust?id=${XenForo.visitor.user_id}`, {
          cors: "no-cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              "registration_date": parseDate(registrationDate),
              "messages_count": messages,
              "giveaways_count": giveaways,
              "trophies_count": trophies,
              "likes_count": likes,
              "deposit": deposit,
              "rights_level": 0
            }
          )
        });
        const responseText = await response.text();
        try {
          const jsonData = JSON.parse(responseText);
          if (!response.ok) {
            if (jsonData.error === "429_1") return xfAlert("Слишком часто! Подождите немного");
            if (jsonData.error === "429_2") return xfAlert("Слишком часто! Попробуйте через час");
            if (jsonData.error === "429_3") return xfAlert("Слишком часто! Попробуйте завтра");
            if (jsonData.error === "500" || jsonData.error === "501") return xfAlert("Службы RAI недоступны");
            if (jsonData.error === "403") return 0;
          }
          if (jsonData == null ? void 0 : jsonData.trust_level) {
            return jsonData == null ? void 0 : jsonData.trust_level;
          }
        } catch (error) {
          console.error("[BetterLZT] TrustService.js failed: " + error);
        }
      } catch (error) {
        console.error("Произошла ошибка TrustService:", error);
      }
      return Math.min(Math.max(trustLevel, 0), 100);
    } catch (e) {
      xfAlert("В работе службы TrustFactor возникла проблема. Работа фактора доверия остановлена");
      console.error("[BetterLZT] TrustService.js failed: " + e);
    }
  }
  function parseDate(dateString) {
    const monthMap = {
      "янв": "01",
      "фев": "02",
      "мар": "03",
      "апр": "04",
      "май": "05",
      "июн": "06",
      "июл": "07",
      "авг": "08",
      "сен": "09",
      "окт": "10",
      "ноя": "11",
      "дек": "12",
      "Jan": "01",
      "Feb": "02",
      "Mar": "03",
      "Apr": "04",
      "May": "05",
      "Jun": "06",
      "Jul": "07",
      "Aug": "08",
      "Sep": "09",
      "Oct": "10",
      "Nov": "11",
      "Dec": "12"
    };
    const regexRu = /(\d{1,2})\s([а-яёА-ЯЁ]+)\s(\d{4})/;
    const regexEn = /([A-Za-z]+)\s(\d{1,2}),\s(\d{4})/;
    let day, month, year;
    if (regexRu.test(dateString)) {
      const [, dayStr, monthStr, yearStr] = dateString.match(regexRu);
      day = dayStr.padStart(2, "0");
      month = monthMap[monthStr.toLowerCase().slice(0, 3)];
      year = yearStr;
    } else if (regexEn.test(dateString)) {
      const [, monthStr, dayStr, yearStr] = dateString.match(regexEn);
      day = dayStr.padStart(2, "0");
      month = monthMap[monthStr.slice(0, 3)];
      year = yearStr;
    } else {
      throw new Error("Unknown date format");
    }
    return `${year}-${month}-${day}`;
  }
  async function profile() {
    try {
      if (localCache.TrustFactorService.minExtVersion > betterVersion || !localCache.TrustFactorService.status) {
        xfAlert("В работе службы TrustFactor возникла ошибка: Службы LIVE недоступны");
        return "unavailable";
      }
      let user = {
        likes: parseInt(document.querySelector(".page_counter .count").innerHTML.replace(" ", "")),
        registrationDate: document.querySelector(".labeled .DateTime").innerHTML,
        deposit: parseInt(document.querySelector("p.amount").innerHTML.replaceAll(" ", "").replace("₽", "")),
        trophies: parseInt(document.querySelectorAll(".page_counter .count")[3].innerHTML.replace(" ", "")),
        messages: parseInt(document.querySelectorAll(".page_counter .count")[2].innerHTML.replace(" ", "")),
        giveaways: parseInt(document.querySelectorAll(".page_counter .count")[4].innerHTML.replace(" ", ""))
      };
      let result = await calculate(user);
      let blzt_trust = document.querySelector(".insuranceDeposit");
      let blzt_trust_color = result > 35 ? "green" : "red";
      let blzt_trust_render = `
        <br>
        <div class="section insuranceDeposit">
            <div class="secondaryContent">
                <h3>
                    <a href="https://lolz.live/threads/5821466/" class="username" style="max-width: 200px; word-wrap: break-word;">
                        ✨ Уровень доверия ß
                    </a>
                </h3>
    
                <h3 style="margin-bottom: 0px; font-size: 18px !important; color: ${blzt_trust_color}" class="amount" title="${result}">
                ${result} / 100
                </h3>
            </div>
        </div>`;
      let blzt_trust_block = document.createElement("div");
      blzt_trust_block.innerHTML = blzt_trust_render;
      blzt_trust.append(blzt_trust_block);
    } catch (e) {
      xfAlert("В работе фактора доверия произошла ошибка.");
      console.error("[BetterLZT] Trust.js: " + e + ` (${e.lineNumber})`);
    }
  }
  function run$3() {
    try {
      userID();
      if (conVar("nickCopy")) nickCopy$1();
      if (conVar("hideLikes")) hideLikes();
      if (conVar("trustFactor")) profile();
      if (isOwn()) {
        let likes = document.querySelector(".page_counter .count").innerHTML;
        set_conVar("likes", likes);
      }
    } catch (e) {
      xfAlert(
        "В работе расширения произошла ошибка (Модуль inProfile остановлен)"
      );
      if (conVar("unlock_dev", 1)) {
        console.error(`[BetterLZT] inProfile.js failed: ${e}`);
      }
    }
    return true;
  }
  function isOwn() {
    return document.querySelector(".button.block").href.includes("account/personal-details");
  }
  function userID() {
    const id = /market\/user\/(\d+)\/items/.exec(document.querySelector(
      '.userContentLinks .button[href^="market/"]'
    ).href)[1];
    let idhtml = document.createElement("div");
    idhtml.innerHTML = `
            <div class="label fl_l" onclick="Clipboard.copy('https://lolz.live/members/${id}', this)">ID пользователя: </div><div class="labeled">${id}<span data-phr="ID скопирован в буфер обмена" onclick="Clipboard.copy(${id}, this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать ID" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i>
    </span></div>`;
    document.querySelector(".pairsJustified").prepend(idhtml);
    return true;
  }
  function nickCopy$1() {
    const user_nick = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig, "");
    let nickhtml = document.createElement("span");
    nickhtml.id = "nick_copy";
    nickhtml.innerHTML = `<span data-phr="Ник скопирован в буфер обмена" onclick="Clipboard.copy('${user_nick}', this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать ник" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i></span>`;
    document.querySelector("h1.username span").append(nickhtml);
    return true;
  }
  function hideLikes() {
    return document.querySelectorAll(".page_counter")[1].remove();
  }
  function run$2() {
    window.betterAPI = {
      scripts: {},
      settingsFields: [],
      ApiVer: 1.2,
      // Динамичный запуск
      loadScript: function(url, className, callback) {
        let script = document.createElement("script");
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
        const regex = new RegExp(expression);
        url = url.toString();
        if (!url.match(regex)) {
          url = `https://hasan.ovh/bettermarket/storage/${url}.js`;
        }
        script.src = url;
        script.onload = function() {
          console.log(className + " Загружен.");
          unsafeWindow.betterAPI.saveToCache(className, url);
          if (typeof callback === "function") {
            callback();
          }
          unsafeWindow.betterAPI.runScript(className, 0);
        };
        script.onerror = function() {
          console.error("Error loading script: " + url);
        };
        document.head.appendChild(script);
      },
      // инстанс и запуск
      runScript: function(className, ...args) {
        if (typeof unsafeWindow[className] === "function") {
          this.scripts[className] = new unsafeWindow[className](...args);
          if (typeof this.scripts[className].run === "function") {
            this.scripts[className].run();
          } else {
            console.warn(className + " Не содержит метода загрузки");
            xfAlert(`Внимание! Скрипт ${className} не отвечает требованиям (1). Рекомендуется удаление`);
          }
        } else {
          xfAlert("Скрипт успешно установлен! Перезапустите страницу");
        }
        if (!unsafeWindow[className]) {
          return xfAlert("Перезапустите страницу");
        }
        return true;
      },
      // скриптинстанс
      getScriptInstance: function(className) {
        return this.scripts[className] || null;
      },
      // сохранение в кеш
      saveToCache: function(className, url) {
        let cache = this.getCache();
        cache[className] = url;
        set_conVar("userScripts", JSON.stringify(cache));
      },
      // получение кеша
      getCache: function() {
        let cache = conVar("userScripts");
        return cache ? JSON.parse(cache) : {};
      },
      // запуск всех скриптов
      loadCachedScripts: async function() {
        let cache = this.getCache();
        for (let className in cache) {
          this.loadScript(cache[className], className);
        }
      },
      getData: async function(variable) {
        return conVar(variable);
      },
      inProfile: function() {
        if (document.querySelector(".avatarScaler")) return true;
      },
      getLiveID: function() {
        return 0;
      },
      isAd: function() {
        return run$4();
      },
      changeUserStatus: function(text) {
        return changeUserStatus(text);
      },
      changeUserAvatar: function(mode) {
        return changeUserAvatar(mode);
      },
      // Регистрация полей настройки для скриптов
      addSettingsField: function(className, label, id, type2, defaultValue, onChange) {
        if (!this.settingsFields[className]) {
          this.settingsFields[className] = [];
        }
        this.settingsFields[className].push({
          label,
          id,
          type: type2,
          defaultValue,
          onChange
        });
      },
      showSettingsMenu: async function(activeScript) {
        if (!activeScript || !this.settingsFields[activeScript]) {
          xfAlert("Настройки для этого скрипта не найдены.");
          return;
        }
        let settingsHTML = "";
        let settingsValues = {};
        for (let field of this.settingsFields[activeScript]) {
          settingsValues[field.id] = await GM.getValue(field.id, field.defaultValue);
          settingsHTML += `<label for="${field.id}">${field.label}:</label><br>`;
          if (field.type === "text") {
            settingsHTML += `<input type="text" id="${field.id}" value="${settingsValues[field.id]}"><br><br>`;
          } else if (field.type === "checkbox") {
            const checked = settingsValues[field.id] ? "checked" : "";
            settingsHTML += `<input type="checkbox" id="${field.id}" ${checked}><br><br>`;
          }
        }
        settingsHTML += `<button id="saveSettings">Сохранить</button>`;
        XenForo.alert(settingsHTML);
        document.getElementById("saveSettings").onclick = () => {
          for (let field of this.settingsFields[activeScript]) {
            const newValue = field.type === "checkbox" ? document.getElementById(field.id).checked : document.getElementById(field.id).value;
            GM.setValue(field.id, newValue);
            if (typeof field.onChange === "function") {
              field.onChange(newValue);
            }
          }
          xfAlert("Настройки сохранены!");
        };
      },
      showSettingsMenuAll: async function() {
        let settingsHTML = "";
        let settingsValues = {};
        for (let field of this.settingsFields) {
          settingsValues[field.id] = await GM.getValue(field.id, field.defaultValue);
          settingsHTML += `<label for="${field.id}">${field.label}:</label><br>`;
          if (field.type === "text") {
            settingsHTML += `<input type="text" id="${field.id}" value="${settingsValues[field.id]}"><br><br>`;
          } else if (field.type === "checkbox") {
            const checked = settingsValues[field.id] ? "checked" : "";
            settingsHTML += `<input type="checkbox" id="${field.id}" ${checked}><br><br>`;
          }
        }
        settingsHTML += `<button id="saveSettings">Сохранить</button>`;
        XenForo.alert(settingsHTML);
        document.getElementById("saveSettings").onclick = () => {
          for (let field of this.settingsFields) {
            const newValue = field.type === "checkbox" ? document.getElementById(field.id).checked : document.getElementById(field.id).value;
            GM.setValue(field.id, newValue);
            if (typeof field.onChange === "function") {
              field.onChange(newValue);
            }
          }
          xfAlert("Настройки сохранены!");
        };
      },
      updateInterface: function(buttonText, statusText) {
        this.changeUserStatus(statusText);
      }
    };
  }
  function request(url) {
    return new Promise((resolve, reject) => _GM_xmlhttpRequest({
      method: "GET",
      url,
      mode: "no-cors",
      onload: (response) => resolve(response.responseText),
      onerror: (error) => resolve(error)
    }));
  }
  function isAvailable() {
    if (!conVar("rai")) {
      return false;
    }
    return true;
  }
  async function contestRender() {
    if (document.querySelector(".rai")) {
      return;
    }
    const renderParent = document.querySelector(".forumModerators");
    const renderTextArea = document.createElement("span");
    const renderTextArea2 = document.createElement("span");
    const counter = document.querySelector(".counterText").innerHTML;
    const max = counter.split("/")[1].trim();
    const current = counter.split("/")[0].trim();
    renderTextArea.className = "rai";
    if (!isAvailable() && !document.querySelector(".rai")) {
      if (document.querySelector(".rai")) {
        return;
      }
      renderTextArea.style.color = `red`;
      renderTextArea.innerHTML = `К сожалению, на данный момент функции BetterLZT RAI недоступны для вашего профиля <a href="https://lolz.live/posts/comments/21238887/">Возможное решение проблемы</a><br>`;
      return renderParent.prepend(renderTextArea);
    } else {
      if (document.querySelector(".rai")) {
        return;
      }
      const resultRub = await request(`${serverLive}ai/acRub.php?uid=${conVar("UID")}&likes=${conVar("likes")}&max=${max}&current=${current}`).catch(
        (err) => {
          if (document.querySelector(".rai")) {
            return;
          }
          renderTextArea.style.color = `red`;
          renderTextArea.innerHTML = `К сожалению, на данный момент функции BetterLZT AI недоступны ${err}<br>`;
          return renderParent.prepend(renderTextArea);
        }
      );
      const result = await request(`${serverLive}ai/ac.php?uid=${conVar("UID")}&likes=${conVar("likes")}&max=${max}&current=${current}`).catch(
        (err) => {
          if (document.querySelector(".rai")) {
            return;
          }
          renderTextArea.style.color = `red`;
          renderTextArea.innerHTML = `К сожалению, на данный момент функции BetterLZT AI недоступны ${err}<br>`;
          return renderParent.prepend(renderTextArea);
        }
      );
      const resultLikes = await request(`${serverLive}ai/acLikes.php?uid=${conVar("UID")}&likes=${conVar("likes")}&max=${max}&current=${current}`).catch(
        (err) => {
          if (document.querySelector(".rai")) {
            return;
          }
          renderTextArea.style.color = `red`;
          renderTextArea.innerHTML = `К сожалению, на данный момент функции BetterLZT AI недоступны ${err}<br>`;
          return renderParent.prepend(renderTextArea);
        }
      );
      if (parseInt(await resultRub) > 0 && parseInt(await result) > 0) {
        if (document.querySelector(".rai")) {
          return;
        }
        renderTextArea.style.color = `rgb(34,142,93)`;
        renderTextArea.innerHTML = `✨ Предполагаемый текущий выигрыш ≈ ${resultRub} ₽, примерно в ${result} розыгрышах<br>`;
        renderParent.prepend(renderTextArea);
      } else {
        if (document.querySelector(".rai")) {
          return;
        }
        renderTextArea.style.color = `red`;
        renderTextArea.innerHTML = `✨Предполагается отсутсвие какого-либо выигрыша на данный момент<br>`;
        return renderParent.prepend(renderTextArea);
      }
      if (parseInt(await resultLikes)) {
        if (parseInt(await resultLikes) > 65) {
          renderTextArea2.style.color = `rgb(34,142,93)`;
          renderTextArea2.innerHTML = `✨ Создав сейчас быстрый розыгрыш (на 30-45 минут) вы можете собрать ≈${resultLikes} симпатий<br>`;
        } else {
          renderTextArea2.style.color = `orange`;
          renderTextArea2.innerHTML = `BetterLZT: Возможно, сейчас не время. Создав сейчас быстрый розыгрыш (на 30-45 минут) вы можете собрать ≈${resultLikes} симпатий<br>`;
        }
        return renderParent.prepend(renderTextArea2);
      }
    }
  }
  function threadRender() {
    if (!conVar("rai_textgen")) {
      return false;
    }
    const button = document.createElement("div");
    const showError = (text, type2) => {
      if (type2 === 1) {
        document.querySelector(".RaiButton").style.width = `185px`;
        document.querySelector(".RaiButton").style.background = `red`;
      } else {
        document.querySelector(".RaiButton").style.width = `280px`;
        document.querySelector(".RaiButton").style.background = `#cc3300`;
      }
      setTimeout(() => {
        document.querySelector(".RaiButton").querySelector("span").style.opacity = 1;
        document.querySelector(".RaiButton").querySelector("span").innerHTML = text;
        document.querySelector(".RaiButton").querySelector("span").style.marginRight = `5px`;
      }, 190);
      setTimeout(() => {
        document.querySelector(".RaiButton").querySelector("span").style.opacity = 0;
        setTimeout(() => {
          document.querySelector(".RaiButton").style.width = `13px`;
          document.querySelector(".RaiButton").style.background = `rgb(45, 45, 45)`;
          document.querySelector(".RaiButton").querySelector("span").innerHTML = "";
          document.querySelector(".RaiButton").querySelector("span").style.marginRight = `0px`;
        }, 500);
      }, 3500);
    };
    button.type = "button";
    button.className = "RaiButton";
    button.tabIndex = -1;
    button.setAttribute("style", "transition: 0.5s; font-weight: bold; padding: 3px 10px; background: rgb(45, 45, 45); border-radius: 50px; margin-right: 5px; cursor: pointer; transition: 0.3s ease-in-out;");
    button.title = "BetterLZT AI";
    button.onclick = async () => {
      var _a, _b;
      try {
        document.querySelector(".RaiButton").style.background = `rgb(34,142,93)`;
        const title = (_a = document.querySelector(".titleBar h1")) == null ? void 0 : _a.innerHTML.trim();
        const text = (_b = document.querySelector(".messageText.SelectQuoteContainer")) == null ? void 0 : _b.innerHTML.trim();
        const request2 = `${title}
${text}`;
        const froalaText = document.querySelector(".fr-wrapper");
        try {
          froalaText.classList.remove("show-placeholder");
        } catch {
        }
        const response = await fetch(`https://hasan.ovh:2087/generate?id=${XenForo.visitor.user_id}`, {
          cors: "no-cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "prompt": request2 })
        });
        const responseText = await response.text();
        try {
          setTimeout(() => {
            document.querySelector(".RaiButton").style.background = `rgb(45,45,45)`;
          }, 500);
          const jsonData = JSON.parse(responseText);
          if (!response.ok) {
            if (jsonData.error === "429_1") return showError("Слишком часто! Подождите немного", 2);
            if (jsonData.error === "429_2") return showError("Слишком часто! Попробуйте через час", 2);
            if (jsonData.error === "429_3") return showError("Слишком часто! Попробуйте завтра", 2);
            if (jsonData.error === "500" || jsonData.error === "501") return showError("Генерация не удалась", 1);
            if (jsonData.error === "403") return showError("Доступ запрещен", 1);
            if (jsonData.error === "Prompt is required") return showError("Клиентская ошибка", 1);
          }
          froalaText.querySelector("p").innerHTML = responseText;
        } catch (error) {
          setTimeout(() => {
            document.querySelector(".RaiButton").style.background = `rgb(45,45,45)`;
          }, 500);
          froalaText.querySelector("p").innerHTML = responseText;
        }
      } catch (error) {
        console.error("Произошла ошибка при запросе:", error);
        alert(`Ошибка`);
      }
    };
    button.innerHTML = `<span style="transition: 1s; text-align: center; opacity: 0"></span> <i class="fas fa-sparkles"></i>`;
    if (document.querySelector(".js-lzt-fe-extraButtons") && !document.querySelector(".RaiButton")) document.querySelector(".js-lzt-fe-extraButtons").prepend(button);
  }
  function meesageRender() {
    const blocks = document.querySelectorAll("#messageList > li");
    for (let block of blocks) {
      if (block.querySelector(".rai-button")) continue;
      let span = document.createElement("span");
      span.innerHTML = '<i class="fas fa-sparkles"></i>';
      span.className = "rai-button";
      span.setAttribute("style", "transition: 0.5s; transition: 0.3s ease-in-out; font-weight: bold; padding: 3px 10px; background: rgb(45, 45, 45); border-radius: 50px; margin-right: 5px; cursor: pointer;");
      span.onclick = async function() {
        var _a;
        try {
          const text = (_a = block.querySelector("blockquote")) == null ? void 0 : _a.innerHTML.trim().replace(/<[^>]*>?/gm, "").replace(/\n\t*/gm, "");
          const request2 = `${text}`;
          const froalaText = document.querySelector(".fr-wrapper");
          try {
            froalaText.classList.remove("show-placeholder");
          } catch {
          }
          const response = await fetch(`https://hasan.ovh:2087/report?id=${XenForo.visitor.user_id}`, {
            cors: "no-cors",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "prompt": request2 })
          });
          const responseText = await response.text();
          try {
            const jsonData = JSON.parse(responseText);
            if (!response.ok) {
              if (jsonData.error === "429_1") return xfAlert("Слишком часто! Подождите немного");
              if (jsonData.error === "429_2") return xfAlert("Слишком часто! Попробуйте через час");
              if (jsonData.error === "429_3") return xfAlert("Слишком часто! Попробуйте завтра");
              if (jsonData.error === "500" || jsonData.error === "501") return xfAlert("Ошибка генерации");
              if (jsonData.error === "403") return xfAlert("Доступ запрещен");
              if (jsonData.error === "Prompt is required") return xfAlert("Клиентская ошибка");
            }
            if (responseText == 1) {
              block.querySelector(".rai-button").setAttribute("style", "font-weight: bold; padding: 3px 10px; background: red; border-radius: 50px; margin-right: 5px; cursor: pointer;");
              if (block.querySelector(".publicControls")) block.querySelector(".rai-button").innerHTML = '<i class="fas fa-sparkles"></i> Обнаружено нарушение';
              return;
            } else if (responseText == 2) {
              block.querySelector(".rai-button").setAttribute("style", "font-weight: bold; padding: 3px 10px; background: green; border-radius: 50px; margin-right: 5px; cursor: pointer;");
              if (block.querySelector(".publicControls")) block.querySelector(".rai-button").innerHTML = '<i class="fas fa-sparkles"></i> Нарушений не найдено';
              return;
            }
          } catch (error) {
            if (responseText == 1) {
              block.querySelector(".rai-button").setAttribute("style", "font-weight: bold; padding: 3px 10px; background: red; border-radius: 50px; margin-right: 5px; cursor: pointer;");
              if (block.querySelector(".publicControls")) block.querySelector(".rai-button").innerHTML = '<i class="fas fa-sparkles"></i> Обнаружено нарушение';
              return;
            } else if (responseText == 2) {
              block.querySelector(".rai-button").setAttribute("style", "font-weight: bold; padding: 3px 10px; background: green; border-radius: 50px; margin-right: 5px; cursor: pointer;");
              if (block.querySelector(".publicControls")) block.querySelector(".rai-button").innerHTML = '<i class="fas fa-sparkles"></i> Нарушений не найдено';
              return;
            }
          }
        } catch (error) {
          console.error("Произошла ошибка при запросе:", error);
          alert(`Ошибка`);
        }
      };
      if (block.querySelector(".publicControls")) block.querySelector(".publicControls").prepend(span);
    }
  }
  function run$1() {
    try {
      if (window.location.pathname.includes("forums/contests")) {
        return contestRender();
      }
      if (!window.location.pathname.includes("threads")) {
        return;
      }
      if (conVar("rai_textgen")) threadRender();
      if (conVar("rai_report")) meesageRender();
      if (conVar("visitorDetector")) visitorDetector();
      if (conVar("reportBtns")) reportBtns();
      if (conVar("nickCopy")) nickCopy();
    } catch (e) {
      xfAlert(
        "В работе расширения произошла ошибка (Модуль inThread остановлен)"
      );
      if (conVar("unlock_dev", 1)) {
        console.error(`В модуле inThread произошел критический сбой: ${e}`);
      }
    }
    return true;
  }
  function visitorDetector() {
    let messgaes = document.querySelectorAll("li.message:not(.checked)");
    messgaes.forEach(async (e) => {
      setTimeout(async function() {
        let id = e.id.replace("post-", "");
        let responce = await XenForo.ajax("posts/" + id + "/get-copy-text");
        if (responce.text.includes("[visitor]")) {
          e.classList.add("checked");
          e.querySelector(".privateControls").innerHTML += '<span class="muted item">Внимание: в данном сообщении обнаружен тег [visitor]</span>';
          return;
        }
      }, 1500);
    });
    let comments = document.querySelectorAll("li.comment:not(.checked)");
    comments.forEach(async (e) => {
      let id = e.id.replace("post-comment-", "");
      let responce;
      setTimeout(async () => {
        responce = await XenForo.ajax("posts/comments/" + id + "/get-copy-text");
      }, 1900);
      if (responce.text.includes("[visitor]")) {
        e.classList.add("checked");
        e.querySelector(".commentControls").innerHTML += '<span class="muted item">Внимание: в данном сообщении обнаружен тег [visitor]</span>';
        return;
      }
    });
  }
  async function reportBtns() {
    try {
      let addButtonToPosts = function() {
        try {
          const blocks = document.querySelectorAll("#messageList > li");
          for (let block of blocks) {
            if (block.querySelector(".custom-button")) {
              continue;
            }
            for (let key in buttons) {
              let name = buttons[key].name;
              let message = buttons[key].message;
              let span = document.createElement("span");
              span.innerText = name;
              span.className = "custom-button";
              span.setAttribute("style", "font-weight: bold; padding: 3px 10px; background: rgb(45, 45, 45); border-radius: 50px; margin-right: 5px; cursor: pointer;");
              span.onclick = function() {
                if (!confirm("отправить жалобу?")) return false;
                let formData = new FormData();
                formData.append("message", key);
                formData.append("is_common_reason", 1);
                formData.append("_xfToken", _xfToken);
                formData.append("_xfNoRedirect", 1);
                formData.append("_xfToken", _xfToken);
                formData.append("redirect", window.location.href);
                postData("posts/" + block.id.split("-")[1] + "/report", formData);
                XenForo.alert("Жалоба отправлена", "", 5e3);
              };
              if (block.querySelector(".publicControls")) block.querySelector(".publicControls").prepend(span);
            }
          }
        } catch (error) {
        }
      };
      let btn1 = conVar("reportBtn-1");
      let btn2 = conVar("reportBtn-2");
      let btn3 = conVar("reportBtn-3");
      const buttons = {
        [btn1]: {
          name: btn1
        },
        [btn2]: {
          name: btn2
        },
        [btn3]: {
          name: btn3
        }
      };
      const _xfToken = document.querySelector('input[name="_xfToken"]').value;
      async function postData(url = "", formData) {
        return await fetch(url, { method: "POST", body: formData });
      }
      if (conVar("reportBtns")) {
        addButtonToPosts();
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === "childList") {
              addButtonToPosts();
            }
          });
        });
        observer.observe(document.getElementById("messageList"), { childList: true });
      }
    } catch (error) {
    }
  }
  function nickCopy() {
    const nicknames = document.querySelectorAll(".InlineModForm .username:not(.copy)");
    nicknames.forEach((e) => {
      e.classList.add("copy");
      const user_nick = e.innerHTML.replace(/<[^>]*>?/gm, "");
      let nickhtml = document.createElement("span");
      nickhtml.id = "nick_copy";
      nickhtml.innerHTML = `<span data-phr="Ник скопирован в буфер обмена" onclick="Clipboard.copy('${user_nick}', this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать ник" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i></span>`;
      e.append(nickhtml);
    });
  }
  function run() {
    try {
      if (localCache == null ? void 0 : localCache.meme) console.error("#Массовый_Привет_Для_бро_Uncpfiae_От_Openresty");
      if (!(localCache == null ? void 0 : localCache.StopcollectStats)) {
        fetch("https://hasan.ovh/better/v1/stats.php", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ url: window.location.pathname, id: conVar("UID") })
        });
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  const version = "3.0.0 Lite (LTS)";
  const type = "Lite (LTS)";
  const server = "https://hasan.ovh/better";
  const serverLive$1 = "https://hasan.ovh/better/live/v2/";
  let userConfig$1 = await( _GM_getValue("userConfig"));
  let localCache$1 = await( _GM_getValue("localCache"));
  let globalConfig$1 = await( _GM_getValue("globalConfig"));
  async function newConfig(type2) {
    var _a;
    userConfig$1 = {
      theme: null,
      secret: null,
      password: null,
      adblock: false,
      uniq: false,
      background: false,
      "reportBtn-1": "Флуд",
      "reportBtn-2": "Оформление",
      "reportBtn-3": "Попрошайничество",
      secureTest: true,
      trustFactor: true,
      liveID: 0,
      UID: (_a = XenForo == null ? void 0 : XenForo.visitor) == null ? void 0 : _a.user_id,
      likes: 0,
      rai: true
    };
    await GM_setValue("userConfig", JSON.stringify(userConfig$1));
  }
  async function resetConfig(type2) {
    var _a;
    if (localCache$1 == null ? void 0 : localCache$1.noreset) return xfAlert("Упс! Сброс настроек на данный момент отключен");
    userConfig$1 = {
      theme: null,
      secret: null,
      password: null,
      adblock: false,
      uniq: false,
      background: false,
      "reportBtn-1": "Флуд",
      "reportBtn-2": "Оформление",
      "reportBtn-3": "Попрошайничество",
      secureTest: true,
      trustFactor: true,
      liveID: 0,
      UID: (_a = XenForo == null ? void 0 : XenForo.visitor) == null ? void 0 : _a.user_id,
      likes: 0,
      rai: true
    };
    await GM_setValue("userConfig", JSON.stringify(userConfig$1));
    xfAlert("Настройки сброшены.");
    setTimeout(window.location.reload, 1500);
  }
  if (!userConfig$1) {
    newConfig();
  } else {
    userConfig$1 = JSON.parse(userConfig$1);
  }
  if (!localCache$1) cacheUpdate();
  if (!globalConfig$1) {
    globalConfig$1 = {
      rofl_forum: 1,
      unlock_dev: false,
      ui: "exui",
      activation: false,
      activated: false,
      token: ""
    };
    await( GM_setValue("globalConfig", JSON.stringify(globalConfig$1)));
  } else {
    globalConfig$1 = JSON.parse(globalConfig$1);
  }
  try {
    if (userConfig$1 == null ? void 0 : userConfig$1.secureTest) {
      console.log("[BetterLZT] UserConfig test ok");
    }
  } catch (e) {
    xfAlert("Конфигурация расширения повреждена.");
  }
  async function documentLoaded() {
    run$2();
    if (userConfig$1.theme && type != "Lite (LTS)") {
      const link = document.createElement("link");
      link.href = "https://hasan.ovh/better/css/" + await theme + ".css";
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    if (localCache$1.version > version && !conVar("no_update")) {
      makeWatermark(
        "Доступно новое обновление LN BetterLZT!",
        "https://hasan.ovh/betterlzt/last.php"
      );
    }
  }
  function pageUpdate() {
    run$4();
    pasteSecret();
    run$1();
    if (document.URL.includes("betterlzt_settings")) {
      show();
    }
    return true;
  }
  async function cacheUpdate() {
    if (conVar("offline", true)) {
      return makeWatermark("BetterLZT Offline");
    }
    try {
      const uid = XenForo.visitor.user_id;
      const answer = await request(`${server}/v2/cache.php?uid=${uid}&type=${type}&version=${betterVersion}`).catch(
        (err) => {
        }
      );
      console.log(answer);
      if (answer === "eol") {
        return makeWatermark(
          "Эта версия BetterLZT больше не поддерживается (кликабельно)",
          "https://hasan.ovh/betterlzt/last.php"
        );
      }
      if (isJson(answer)) {
        localCache$1 = JSON.parse(answer);
        await GM_setValue("localCache", localCache$1);
        return console.log("[BetterLZT] Данные в кеше обновлены");
      } else {
        console.error(
          "[BetterLZT] Ошибка обновления данных кеша: сервер вернул недопустимый ответ"
        );
      }
    } catch (error) {
      console.error("[BetterLZT] Ошибка обновления данных кеша: " + error);
    }
  }
  function renderFunctions() {
    console.log("RenderFunctions");
    _unsafeWindow.globalConfig = globalConfig$1;
    _unsafeWindow.userConfig = userConfig$1;
    _unsafeWindow.localCache = localCache$1;
    _unsafeWindow.betterVersion = version;
    _unsafeWindow.serverLive = serverLive$1;
    _unsafeWindow.request = (e) => request(e);
    _unsafeWindow.xfAlert = (e) => xfAlert(e);
    _unsafeWindow.window.betterAPI = window.betterAPI;
    _unsafeWindow.resetConfig = () => resetConfig();
    _unsafeWindow.saveConfig = (e) => saveConfig(e);
    let torender = [conVar, set_conVar, handleClick, saveSecret, saveBackground, xfAlert, makeWatermark, inProfile];
    let funcs = torender.map((e) => e.toString());
    let script = document.createElement("script");
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
    window.betterAPI.loadCachedScripts();
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    console.log("Render");
    documentLoaded();
    renderFunctions();
    cacheUpdate();
    pageUpdate();
    settingsButtons();
    if (inProfile()) run$3();
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      console.log("Render");
      documentLoaded();
      renderFunctions();
      cacheUpdate();
      pageUpdate();
      settingsButtons();
      init();
      run();
      if (inProfile()) run$3();
    });
  }
  window.onload = () => {
    const xfAct = XenForo.activate;
    const xfAjax = XenForo.ajax;
    XenForo.activate = function() {
      pageUpdate();
      const ret = xfAct.apply(this, arguments);
      return ret;
    };
    XenForo.ajax = function() {
      const url = arguments[0];
      if (url === "threads/low-priority") {
        return;
      }
      return xfAjax.apply(this, arguments);
    };
    run();
  };

})();