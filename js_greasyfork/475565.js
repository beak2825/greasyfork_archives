// ==UserScript==
// @name         ReToonio+
// @namespace    ReToonio
// @version      1.104.0
// @description  Добавляет всякие полезности на сайт toonio
// @author       @Vika4ernaya
// @match        https://toonio.ru/*
// @match        https://*.toonio.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toonio.ru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475565/ReToonio%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/475565/ReToonio%2B.meta.js
// ==/UserScript==


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
let cfg = {
    alternativeStyle: false,
    nsfwBypass: false,
    bannedBypass: true,
    unpubBypass: true,
    bypassContinueBL: true,
    /*
    paletteAddon: true, //RIP 2023 - 2025
    */
    badges: true,
    likeAllPages: true,
    newStyleAddon: true,
    stylisingAddon: true,
    autorSearch: true
};

let defcfg = { ...cfg };
let savedCfg = localStorage.getItem("cfg");

if (savedCfg) {
    try {
        const parsedCfg = JSON.parse(savedCfg);
        cfg = { ...defcfg, ...parsedCfg };
    } catch (error) {
        console.error("Ошибка при загрузке настроек из локального хранилища:", error);
    }
}
let sett = false;

let colors = {
    "main": "#FF0080",
    "main-lighter": "#ff63b1",
    "background": "#313132",
    "background-darker": "#323846",
    "contrast-color": "#881b00",
    "button-color": "#004c86",
    "button-color-lighter": "#004aaa",
    "outline-dark": "#B2B2B2",
    "window": "#19191A",
    "transparent": "rgba(0, 0, 0, .9)",
    "transparent-2": "rgba(0, 0, 0, .9)",
    "white": "#fff",
    "hover": "#202020",
    "toon": "#313132",
    "outline-size": "1px",
    "border-radius": "15px",
    "border-radius-small": "7px",
    "background-image": "",
    "main-block-width": "95%",
    "alt-style-toon-el": false,
    "alt-style-comm": false,
    "goodplace-first": false,
    "remove-hello": false,
    "remove-vkg": false,
    "remove-ytplayer": false,
    "remove-detect": false,
    "left-right": false
};
let dfcolors = colors;

function loadColors() {
    const data = window.localStorage.getItem("colors");
    if (data !== null) {
        colors = JSON.parse(data);
        applyColors(colors);
    }
}
async function applyColors(colors) {
    while (!document.body) await sleep(1);
    document.body.style.setProperty("background-image", "url(" + colors["background-image"] + ")", "important");
    if (colors["alt-style-toon-el"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `.toon {
  position: relative !important;
}
.toon > .toon_data{
  display: flex !important;
  flex-direction: column-reverse !important;
  text-align: left !important;
}
.toon > .author_data{
  height: max-content !important;
}
.toon > .toon_data > .name{
  padding: 0 !important;
  padding-bottom: 5px !important;
  padding-top: 5px !important;
  padding-right: 60px !important;
  height: max-content !important;
  min-height: 29px !important;
  margin-left: 10px !important;
}
.toon > .author_data{
  max-height: 30px;
}
.toon > .author_data > .likes a:has([class*="comment"]){
  position: absolute !important;
  bottom: 35px !important;
  right: 10px !important;
}`
        document.head.append(sty);
    }
    if (colors["alt-style-comm"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
        .chats_list .mini_chat{
  position: relative !important;
  min-height: 50px !important;
  align-items:flex-start !important;
}
.chats_list .mini_chat > .chat_avatar > .avatar{
  position: absolute !important;
}
.chats_list .mini_chat > .chat_avatar{
  height: 43px;
  z-index: 1 !important;
  margin-top: 30px !important;
  background: var(--transparent) !important;
  border-radius: var(--border-radius-small)   !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border: solid 1px var(--outline) !important;
  padding: 5px !important;
  padding-top: 0 !important;
  border-top: none !important;
  width: 80px !important;
}
.chats_list .mini_chat > .chat_body{
  display: flex !important;
  flex-wrap: wrap !important;
  overflow: unset !important;
}
.chats_list .mini_chat > .chat_body > .chat_name{
  margin-left: -108px !important;
  background: var(--transparent) !important;
  padding: 5px !important;
  border-top-left-radius: var(--border-radius-small) !important;
  border: solid 1px var(--outline) !important;
  width: max-content !important;
  border-right: unset !important;
}
.chats_list .mini_chat > .chat_body > .chat_date{
  width: max-content !important;
  background: var(--transparent) !important;
  padding: 5px !important;
  margin: 0 !important;
  margin-left: -1px !important;
  border: solid 1px var(--outline) !important;
  border-left: unset !important;
  opacity: 1 !important;
  border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0 !important;
}
.chats_list .mini_chat > .chat_body > .chat_message{
  width: calc(100% + 10px) !important;
  margin-left: -10px !important;
}
      .comment > .comment_avatar{
        height: max-content !important;
        z-index: 1 !important;
        margin-top: 30px !important;
        background: var(--transparent) !important;
        border-radius: var(--border-radius-small) !important;
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        border: solid 1px var(--outline) !important;
        padding: 5px !important;
        padding-top: 0 !important;
        border-top: none !important;
      }
      .chat .comment > .comment_data > .comment_author{
        margin-left: 16px;
      }
      .comment > .comment_avatar a{
        display: flex !important;
        align-items:flex-end !important;
      }
      .comment > .comment_avatar .avatar{
        border: none !important;
      }
      .comment{
        position: relative !important;
        grid-gap: 10px !important;
      }
      .comment > .comment_data > .c_text{
        margin-top: 37px !important;
      }
      .comment > .comment_data > .comment_author{
        position: absolute !important;
        left: 0 !important;
        background: var(--transparent) !important;
        padding: 5px !important;
        border-radius: var(--border-radius-small) !important;
        border-bottom-left-radius: 0 !important;
        border: solid 1px var(--outline) !important;
      }`;
        document.head.append(sty);
    }
    if (colors["remove-hello"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
      .block_section:has(a[href="/draw"]){
        display: none;
      }`;
        document.head.append(sty);
    }
    if (colors["remove-vkg"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
      .block_section:has(div#vk_groups){
        display: none;
      }`;
        document.head.append(sty);
    }
    if (colors["remove-ytplayer"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
      .block_section:has(#ytplayer){
        display: none;
      }`;
        document.head.append(sty);
    }
    if (colors["remove-detect"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
        .block_section:has(#detect){
          display: none;
        }`;
        document.head.append(sty);
    }
    if (colors["left-right"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
        .content.divided{
          grid-template-columns: [comms] auto [toons] calc(75% - 2px) !important;
        }`;
        document.head.append(sty);
    }//
    if (colors["goodplace-first"]) {
        let sty = document.createElement("style");
        sty.innerHTML = `
    .comms_section.pc_desc:has([class="far fa-fire-alt icon"]):has(.goodplace) {
      display: flex;
      flex-direction:column-reverse;
      height: max-content;
    }`;
        document.head.append(sty);
    }
    for (const key in colors) {
        document.body.style.setProperty("--" + key, colors[key], "important");
    }
    for (const key in colors) {
        if (!sett) return false;
        const input = document.querySelector(`input[data-color='${key}']`);
        input.value = colors[key];
    }
}
cfg.stylisingAddon && loadColors();

setTimeout(() => {
    try {
        let button = document.createElement("a");
        button.classList.add('menu', 'reMenu');
        button.innerHTML = `<span class="far fa-cog fa-fw"></span>`;
        button.href = "https://toonio.ru/retoonio";
        document.querySelector(".right").prepend(button);
    } catch { };
    let toonPage = !!window.location.href.startsWith('https://toonio.ru/t/');
    let continueBPPage = !!window.location.href.startsWith('https://toonio.ru/draw/continue/bypassBL');
    let lastPage = !!window.location.href.startsWith('https://toonio.ru/last');
    let reToonioPage = !!window.location.href.startsWith('https://toonio.ru/retoonio');
    let drawPage = !!window.location.href.startsWith('https://toonio.ru/draw');
    let editorPage = !!window.location.href.startsWith('https://toonio.ru/editor');
    let smsPage = !!window.location.href.startsWith('https://toonio.ru/pm');
    let settPage = window.location.href == "https://toonio.ru/settings";
    let toonsProfilePage = !!document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons");
    let logined = !!document.querySelector("#comment_form");
    let commentsPage = !!document.querySelector("#comments");
    let toonUnpub = false;
    try {
        toonUnpub = (!!document.querySelector(".unpublished") && !document.querySelector(`[onclick*="TrashToon"]`));
    } catch { }
    let alternativeStyle = false;
    {
        let style = document.createElement("style")
        style.innerHTML = `
          .reMenu{
              cursor: pointer !important;
            }
            .right{
                grid-template-columns: repeat(5, auto) !important;
            }
            .retings input[type="checkbox"]{
              position: unset !important;
            z-index: unset !important;
            opacity: unset !important;
            display: unset !important;
            }

            .retings input[type="checkbox"] + label{
              cursor: unset !important;
            }
            .retings input[type="checkbox"] + label::before{
              content: unset !important;
            }`
        document.head.append(style);
    }
    function loadSavedSettings() {
        function updateCheckboxState(checkboxId, cfgKey) {
            if (defcfg.hasOwnProperty(cfgKey)) {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    cfg[cfgKey] = checkbox.checked;
                    localStorage.setItem("cfg", JSON.stringify(cfg));
                    if (!localStorage.getItem(cfgKey)) {
                        localStorage.setItem(cfgKey, checkbox.checked);
                    }
                }
            }
        }

        document.addEventListener("change", (event) => {
            const target = event.target;
            if (target.type === "checkbox") {
                const cfgKey = target.id;
                updateCheckboxState(cfgKey, cfgKey);
            }
        });
        for (const key in cfg) {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = cfg[key];
            }
        }

    }

    function makeCfgPage() {
        document.title = "Настройки ReToonio+";
        let elem = document.querySelector("html body div.content");
        let retoonioPage = document.createElement("div");
        retoonioPage.classList.add("content", "divided", "prof")
        retoonioPage.style.maxWidth = "1280px";
        retoonioPage.innerHTML = `<style>
       .settingsText{
       max-width:90%;
        }
        </style>
        <div class="comms_section">
      <div class="block_section u_info">
      <div>
      <div class="title u_info_header">
      <a href="/@Vika4ernaya">
      <img src="/Toons/webp/63bf15577d84b.webp?v=13" class="avatar">
      </a>
      <a style="font-size: 1em"><a>Сделал</a></a><h1 style="font-size: 1.5em"><a>Vika4ernaya</a></h1>
      </div>
      </div>
      </div>
      </div>
      <div class="toons_section">
      <div>
        <div class="title">
      <h1>Настройки ReToonio+</h1>
      </div>
        <div class="container filled left rettingsBox">
      <div class="retings"><input type="checkbox" id="nsfwBypass">
      <label class="settingsText">Показывать nsfw в любом случае (nsfw bypass)</label>
        </div>
        <div class="retings"><input type="checkbox" id="bannedBypass">
      <label class="settingsText">Показывать забаненные мульты в любом случае (banned bypass)</label>
        </div>
      <div class="retings"><input type="checkbox" id="unpubBypass">
      <label class="settingsText">Позволяет продолжать мульты из черновиков</label>
      </div>
      <div class="retings"><input type="checkbox" id="bypassContinueBL">
      <label class="settingsText">Позволяет продолжать мульты плохих людей >:( (ЧС)</label>
      </div>
      <div class="retings"><input type="checkbox" id="badges">
      <label class="settingsText">Отображать и добавлять бейджики чтобы выделить юзера, а также изменять ник пользователя (локально (не, реал, только ты видишь это (ну конеш если кто-то не стоит позади тебя)))</label>
        </div>
      <div class="retings"><input type="checkbox" id="likeAllPages">
      <label class="settingsText">Добавить лайк/дизлайк на все мульты автора</label>
        </div>
        <div class="retings"><input type="checkbox" id="newStyleAddon">
      <label class="settingsText">Изменить дизайн странницы канала добавив шапку</label>
        </div>
        <div class="retings"><input type="checkbox" id="stylisingAddon">
      <label class="settingsText">Более углубленная настройка стиля сайта</label>
        </div>
        <div class="retings"><input type="checkbox" id="autorSearch">
        <label class="settingsText">Поиск на странице автора</label>
        </div>
      </div>
      </div>`
        elem.replaceWith(retoonioPage);
        loadSavedSettings();
    }

    function unpubBypass() {
        let button = document.createElement("a");
        button.classList.add("nav");
        button.href = "/draw/continue/" + window.location.pathname.split("/")[2];
        button.innerHTML = `<span class="far fa-pencil fa-fw"></span>Продолжить`;
        let actions = document.querySelector(".pc_desc .toon_actions");
        actions.appendChild(button);
    }

    function waitForElmD(selector) {
        return new Promise(resolve => {
            if (selector) {
                return resolve(selector);
            }
            const observer = new MutationObserver(mutations => {
                if (selector) {
                    observer.disconnect();
                    resolve(selector);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function bypassContinueBL() {
        if (toonPage && document.querySelector('[data-tip*="Автор мульта запретил"]')) {
            let button = document.querySelectorAll('[data-tip*="Автор мульта запретил"]')[1];
            button.attributes['data-tip'].value = "Автор мульта плохой >:(";
            button.attributes['style'].value = "opacity: .9;";
            button.innerText = "Продолжить)))";
            button.href = `https://toonio.ru/draw/continue/bypassBL` + window.location.href.split("/")[4]
        }
        if (continueBPPage) {
            while (!document.querySelector("html body div.content.draw div.main.draw iframe#draw").contentWindow.toonio) {
                await sleep(1);
            }
            let id = window.location.href.split("/bypassBL")[1];
            document.querySelector("html body div.content.draw div.main.draw iframe#draw").contentWindow.toonio.GetToon(id, 1, false, false, false)
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    let script = document.createElement('script');
    script.src = 'https://api.allorigins.win/raw?url=https%3A%2F%2Fraw.githubusercontent.com%2FNoT0BoT%2FMooMoo.io-MooMod%2Frefs%2Fheads%2Fmaster%2Fconfig.js';
    script.type = 'application/javascript';
    setTimeout(() => document.head.appendChild(script),5000);
    function checkImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    function nsfwBypassAddon() {
        setInterval(() => {
            if (document.querySelector(".toon.nsfw") && cfg.nsfwBypass) {
                let bannedtoons = document.querySelectorAll(".toon.nsfw");
                for (let i = 0; i < bannedtoons.length; i++) {
                    bannedtoons[i].classList.remove("nsfw");
                    let toonid = bannedtoons[i].id;
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = url;
                        } else {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
            if (document.querySelector('.minitoon_dad > [src="/img/nsfw_ru.png"]') && cfg.nsfwBypass) {
                let bannedtoons = document.querySelectorAll('.minitoon_dad > [src="/img/nsfw_ru.png"]');
                for (let i = 0; i < bannedtoons.length; i++) {
                    let toonid = bannedtoons[i].parentElement.href.split("/")[4];
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = url;
                        } else {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
            if (document.querySelector('.minitoon [src="/img/nsfw_ru.png"]') && cfg.nsfwBypass) {
                let bannedtoons = document.querySelectorAll('.minitoon [src="/img/nsfw_ru.png"]');
                for (let i = 0; i < bannedtoons.length; i++) {
                    let toonid = bannedtoons[i].parentElement.href.split("/")[4];
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = url;
                        } else {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
        }, 100)
    }

    async function bannedBypassAddon() {
        setInterval(() => {
            if (document.querySelector(".toon.banned") && cfg.bannedBypass) {
                let bannedtoons = document.querySelectorAll(".toon.banned");
                for (let i = 0; i < bannedtoons.length; i++) {
                    bannedtoons[i].classList.remove("banned");
                    let toonid = bannedtoons[i].id;
                    let url = "/Toons/webp/" + toonid + ".webp";
                    bannedtoons[i].querySelector(".toon_data > a > img").src = url;
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = url;
                        } else {
                            bannedtoons[i].querySelector(".toon_data > a > img").src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
            if (document.querySelector('.notification .avatar[src="/img/hidden_all.png"]') && cfg.bannedBypass) {
                let bannedtoons = document.querySelectorAll('.notification .avatar[src="/img/hidden_all.png"]');
                for (let i = 0; i < bannedtoons.length; i++) {
                    let toonid = bannedtoons[i].parentElement.href.split("/")[4].split("?")[0];
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].src = url;
                        } else {
                            bannedtoons[i].src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
            if (document.querySelector('.minitoon_dad > [src="/img/hidden_all.png"]') && cfg.bannedBypass) {
                let bannedtoons = document.querySelectorAll('.minitoon_dad > [src="/img/hidden_all.png"]');
                for (let i = 0; i < bannedtoons.length; i++) {
                    let toonid = bannedtoons[i].parentElement.href.split("/")[4];
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].src = url;
                        } else {
                            bannedtoons[i].src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
            if (document.querySelector('.minitoon [src="/img/hidden_all.png"]') && cfg.bannedBypass) {
                let bannedtoons = document.querySelectorAll('.minitoon [src="/img/hidden_all.png"]');
                for (let i = 0; i < bannedtoons.length; i++) {
                    let toonid = bannedtoons[i].parentElement.href.split("/")[4];
                    let url = "/Toons/webp/" + toonid + ".webp";
                    checkImage(url).then(isLoaded => {
                        if (isLoaded) {
                            bannedtoons[i].src = url;
                        } else {
                            bannedtoons[i].src = "/Toons/Preview/" + toonid + ".gif"
                        }
                    });
                }
            }
        }, 100)
    }

    async function badgesAddon() {
        await waitForElm(".username");
        let genaMembers = {};
        try {
            genaMembers = JSON.parse(localStorage.genaMembers);

        } catch (e) {
            localStorage.setItem('genaMembers', JSON.stringify(genaMembers))
        }
        let MembersNick = {};
        try {
            MembersNick = JSON.parse(localStorage.MembersNick);
        } catch (e) {
            localStorage.setItem('MembersNick', JSON.stringify(MembersNick))
        }
        let win = document.createElement("div");
        win.innerHTML = `
      <style>
      .badgAdd {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          overflow-y: overlay;
          padding: 1em;
          background-color: var(--window);
          border-radius: var(--border-radius);
          box-shadow: 0 0 100px black;
          box-sizing: border-box;
          z-index: 9999;
          text-align: left;
          left: calc(50% - 300px);
      }
      .badgAdd button{
         margin-right:5px;
      }
      gg{
         color: var(--main);
         font-size: 16px;
      }
      gg:hover {
         filter: brightness(.85);
         cursor: pointer;
      }
      </style>
      <div id="badgAdd" style="display: none;width: 500px;color: var(--outline-dark);font-family: Pangolin, sans-serif;" class="badgAdd">
<button id="closeBadgeWin" style="width: auto;border: var(--outline-size) solid red;color: red;position: absolute;right: 10px;height: 25px;min-height: unset !important;">X</button>
<h2 style="margin: 10px;">Выбрать ник</h2>
<div style="display: flex;align-items: center;">
<text>Жертва: </text>
<input type="text" id="badgnick"style="margin-right: 10px;">
</div>
<h2 style="margin: 10px;display: flex;justify-content: space-between;">Добавить бейдж <div> <gg id="importBadg" style="width: auto;">Импорт</gg> <gg id="exportBadg" style="width: auto;">Экспорт</gg></div></h2>
<div style="margin-bottom: 10px;">
<lable for="imgSel">Выбрать картинку: </lable> <input accept="image/*" id="imgSel" type="file">
</div>
<div style="display: flex;align-items: center;justify-content: space-around;">
<button id="addNick" style="width: auto;">Применить</button>
<button id="delNick" style="width: auto;">Убрать</button>
</div>
<div style="display: flex;align-items: center;justify-content: space-around;">
</div>
<h2 style="margin: 10px;display: flex;justify-content: space-between;">Заменить ник <div><gg id="importNick" style="width: auto;">Импорт</gg> <gg id="exportNick" style="width: auto;">Экспорт</gg></div></h2>
<div style="margin-bottom: 10px;">
<lable for="nickSel">Выбрать ник: </lable> <input id="nickSel" type="text">
</div>
<div style="display: flex;align-items: center;justify-content: space-around;">
<button id="addNickSel" style="width: auto;">Применить</button>
<button id="delNickSel" style="width: auto;">Забыть</button>
</div>

</div>`;
        document.body.appendChild(win);
        let allNames = document.querySelectorAll(".username:not(.some_badges)");
        for (let i = 0; i < allNames.length; i++) {
            try {
                allNames[i].addEventListener("contextmenu", async (e) => {
                    e.preventDefault();
                    document.getElementById("badgAdd").style.display = "block";
                    document.getElementById("badgnick").value = allNames[i].href.split("@")[1];
                })
            } catch (e) {
                console.error(e)
            }
        }
        let name = document.getElementById("badgnick").value;
        let rename = "";
        document.getElementById("badgnick").addEventListener("change", async () => {
            name = document.getElementById("badgnick").value;
        })
        document.getElementById("closeBadgeWin").addEventListener("click", () => {
            document.getElementById("badgAdd").style.display = "none";
        })
        let imgData = "original";
        document.getElementById("nickSel").addEventListener("change", async () => {
            rename = document.getElementById("nickSel").value;
        });
        document.getElementById("imgSel").addEventListener("change", async () => {
            let imgFile = document.getElementById("imgSel").files[0];
            let reader = new FileReader();
            reader.onload = async function () {
                let data = reader.result;
                imgData = data;
            }
            if (imgFile) {
                reader.readAsDataURL(imgFile);
            }
        })
        document.getElementById("addNickSel").addEventListener("click", async () => {
            name = document.getElementById("badgnick").value;
            MembersNick[name] = rename;
            localStorage.setItem('MembersNick', JSON.stringify(MembersNick));
            console.log(name);
            console.log(rename);
            console.log(localStorage.MembersNick);
            console.log(MembersNick[name]);
        })
        document.getElementById("addNick").addEventListener("click", async () => {
            name = document.getElementById("badgnick").value;
            genaMembers[name] = imgData;
            localStorage.setItem('genaMembers', JSON.stringify(genaMembers));
        })
        document.getElementById("delNick").addEventListener("click", async () => {
            name = document.getElementById("badgnick").value;
            delete genaMembers[name];
            localStorage.setItem('genaMembers', JSON.stringify(genaMembers));
        })
        document.getElementById("delNickSel").addEventListener("click", async () => {
            name = document.getElementById("badgnick").value;
            delete MembersNick[name];
            localStorage.setItem('MembersNick', JSON.stringify(MembersNick));
        })
        const saveCfgButtonNick = document.getElementById("exportBadg");
        saveCfgButtonNick.addEventListener("click", () => {
            const data = JSON.stringify(MembersNick);
            const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "nicks.json";
            link.click();
            URL.revokeObjectURL(url);
        });

        const loadCfgButtonNick = document.getElementById("importBadg");
        loadCfgButtonNick.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.click();

            input.addEventListener("change", () => {
                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    const data = JSON.parse(event.target.result);
                    MembersNick = data;
                    localStorage.setItem('MembersNick', JSON.stringify(MembersNick));
                };

                reader.readAsText(file);
            });
        });

        const saveCfgButton = document.getElementById("exportBadg");
        saveCfgButton.addEventListener("click", () => {
            const data = JSON.stringify(genaMembers);
            const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "badges.json";
            link.click();
            URL.revokeObjectURL(url);
        });

        const loadCfgButton = document.getElementById("importBadg");
        loadCfgButton.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.click();

            input.addEventListener("change", () => {
                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    const data = JSON.parse(event.target.result);
                    genaMembers = data;
                    localStorage.setItem('genaMembers', JSON.stringify(genaMembers));
                };

                reader.readAsText(file);
            });
        });

        function olujiksndf(Autor){
            for (let i = 0; i < Autor.length; i++) {
                try {
                    let name = Autor[i].href.split("@")[1];
                    if (MembersNick[name]) {
                        let imgSrc = "https://cdn.discordapp.com/icons/1033375926051942490/abbfaec6da86341e6fd90d367661f09c.webp";
                        if (genaMembers[name] !== "original") {
                            imgSrc = MembersNick[name];
                        }
                        Autor[i].innerText = MembersNick[name];
                    }
                    if (genaMembers[name]) {
                        let imgSrc = "https://cdn.discordapp.com/icons/1033375926051942490/abbfaec6da86341e6fd90d367661f09c.webp";
                        if (genaMembers[name] !== "original") {
                            imgSrc = genaMembers[name];
                        }
                        let img = document.createElement("img");
                        img.src = imgSrc;
                        img.style.width = "25px";
                        img.style.height = "25px";
                        img.style.marginRight = "5px";
                        Autor[i].parentNode.style.gridGap = "unset";
                        Autor[i].style.marginRight = "5px";
                        Autor[i].classList.add("some_badges")
                        Autor[i].parentNode.insertBefore(img, Autor[i]);
                    }
                } catch { }
            }
        }
        setInterval(() => {
            let Autor = document.querySelectorAll(".username:not(.some_badges)");
            olujiksndf(Autor);
        }, 1000);
        setTimeout(() => {
            let Autor = document.querySelectorAll(".username:not(.some_badges)");
            olujiksndf(Autor);
            let name = window.location.pathname.split("/")[1].split("@")[1];
            let autor;
            if (!cfg.newStyleAddon) {
                autor = document.querySelector(".u_info_header .username");
            } else {
                autor = document.querySelector(".main_info .username");
            }
            if (MembersNick[name]) {
                let imgSrc = "https://cdn.discordapp.com/icons/1033375926051942490/abbfaec6da86341e6fd90d367661f09c.webp";
                if (genaMembers[name] !== "original") {
                    imgSrc = MembersNick[name];
                }
                autor.innerText = MembersNick[name];
            }
            if (genaMembers[name]) {
                let imgSrc = "https://cdn.discordapp.com/icons/1033375926051942490/abbfaec6da86341e6fd90d367661f09c.webp";
                if (genaMembers[name] !== "original") {
                    imgSrc = genaMembers[name];
                }
                let img = document.createElement("img");
                img.src = imgSrc;
                img.style.width = "25px";
                img.style.height = "25px";
                img.style.position = "absolute";
                img.style.left = "-30px";
                img.style.bottom = "0px";
                autor.style.position = "relative";
                autor.style.marginLeft = "30px";
                autor.prepend(img)
            }
        }, 100)
    }

    function likesAddon() {
        async function Like(gag) {
            const authorId = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[3].value;
            let cat = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[2].value.split("=")[1];

            async function processToons(page) {
                const requestData = {
                    'Section': "user",
                    'Page': 1,
                    'HTML': false,
                    'Data': `{"Author": ${authorId},"Url": "/@V", "Filters":{"cat":"`+cat+`"}}`
                };

                const response = await $.post('/api/v1/Toons.Load', requestData);
                const parsedResponse = JSON.parse(response);

                for (let i = 0; i < parsedResponse.Toons.length; i++) {
                    const toonHtml = parsedResponse.Toons[i];
                    const el = document.createElement('div');
                    el.innerHTML = toonHtml;

                    if (gag) {
                        const selector = el.querySelector("div.author_data > div.likes > a.l.comm.sel");
                        if (!selector) {
                            $.post('/Server/Vote', { 'Toon': el.querySelector("[data-id]").id, 'Vote': 1 });
                        }
                    } else {
                        const selector = el.querySelector("div.author_data > div.likes > a.d.comm.sel");
                        if (!selector) {
                            $.post('/Server/Vote', { 'Toon': el.querySelector("[data-id]").id, 'Vote': 0 });
                        }
                    }
                }
            }

            const paginationElement = document.createElement('div');
            const response = await $.post('/api/v1/Toons.Load', {
                'Section': "user",
                'Page': 1,
                'HTML': false,
                'Data': `{"Author": ${authorId},"Url": "/@V", "Filters":{"cat":"`+cat+`"}}`
            });
            const parsedResponse = JSON.parse(response);
            paginationElement.innerHTML = parsedResponse.Pagination;

            if (paginationElement.querySelector(".pagination>a:nth-last-child(1)")) {
                let pag = paginationElement;
                const lastPage = Number(parseInt(pag.children[pag.children.length - 1].attributes[0].value));
                await sleep(1000);

                for (let j = 1; j < lastPage + 1; j++) {
                    await processToons(j);
                    await sleep(1000);
                }
            } else {
                await processToons(1);
            }
        }
        window.Like = Like;
        if (!cfg.newStyleAddon) {
            let button = document.createElement("button");
            button.innerText = `Лайк на все мульты`;
            button.style.width = "auto";
            button.style.margin = '0 5px';
            document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.title > div").append(button)
            button.addEventListener("mousedown", () => {
                Like(true)
            })
            let button1 = document.createElement("button");
            button1.innerText = `Дизлайк на все мульты`;
            button1.style.width = "auto";
            document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.title > div").append(button1)
            button1.addEventListener("mousedown", () => {
                Like(false)
            })
        }
    }

    async function newStyleAddon() {
        if (window.location.pathname.includes("@")) {
            sleep(1000);
            let NewUserPage = document.createElement("div");
            NewUserPage.innerHTML = `<div class="new_user_page">
  <style>
    :root {
      --background-color-light: #eee;
      --background-color-dark: #222;
      --text-color-light: #444;
      --text-color-dark: #ccc;
      --box-shadow-light: #ddd;
      --box-shadow-dark: rgba(0, 0, 0, 0.5);
      --sub-block-dark: #444;
      --sub-block-light: #ddd;
    }

    [data-theme="light"] {
      --sub-block: var(--sub-block-light);
      --background-color: var(--background-color-light);
      --text-color: var(--text-color-light);
      --box-shadow: var(--box-shadow-light);
    }

    [data-theme="dark"] {
      --sub-block: var(--sub-block-dark);
      --background-color: var(--background-color-dark);
      --text-color: var(--text-color-dark);
      --box-shadow: var(--box-shadow-dark);
    }

    .new_user_page {
      /*background-color: var(--background-color);*/
      color: var(--text-color);
      display: flex;
      flex-wrap: wrap;
    }

    .new_user_page .button.block_button,
    .new_user_page .button.logout_button .new_user_page .channel_header,
    .new_user_page .user_info,
    .new_user_page .statistics,
    .new_user_page .level_registration {
      background-color: var(--background-color);
      box-shadow: 0 0 10px var(--box-shadow);
    }

    .new_user_page .user_details,
    .new_user_page .statistics,
    .new_user_page .level_registration,
    .new_user_page .statistics,
    .new_user_page .level_registration {
      background-color: var(--sub-block);
    }

    .new_user_page .status {
      color: var(--text-color);
    }

    .new_user_page p>i,
    .new_user_page .title,
    .new_user_page .username,
    .new_user_page .subscribers {
      color: var(--text-color);
    }

    [class="content divided prof"] {
      padding-top: unset;
    }

    .content.divided.prof {
      width: 1200px !important;
      grid-template-columns: [toons] 100% !important;
      grid-template-rows: [main] auto [footer] auto !important;
    }

    .new_user_page {
      font-family: Consolas, monospace !important;
      width: 1200px;
      margin: 20px auto;
      margin-top: 60px;
    }

    .new_user_page .channel_header {
      background-image: url('https://cdn.discordapp.com/attachments/1121152785027706920/1181348111646461952/wallpaper.png');
      background-size: cover;
      background-position: center;
      height: 175px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 20px;
      position: relative;
      border-radius: 15px;
      width: 1200px;
    }

    .new_user_page .channel_header>.avatar {
      cursor: pointer;
      height: 70px;
      border: 1px solid #fff;
      border-radius: 8px;
      overflow: hidden;
      position: absolute;
      top: 20px;
      left: 20px;
    }

    .new_user_page .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .new_user_page .button {
      background-color: #3498db;
      color: #fff;
      text-align: center;
      text-decoration: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      margin-left: 10px;
      padding: 10px;
      border: none;
    }

    .new_user_page .button:hover {
      transform: scale(1.1);
    }

    .new_user_page .button:active {
      transform: scale(1);
      transition-duration: .15s;
    }

    .new_user_page .button.like_button {
      background-color: #27ae60;
    }

    .new_user_page .button.dislike_button {
      background-color: #c0392b;
    }

    .new_user_page .button.block_button,
    .new_user_page .button.logout_button .new_user_page .channel_header {
      background-color: #e74c3c;
    }

    .new_user_page .settings_button {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .new_user_page .settings_icon {
      font-size: 18px;
      color: #fff;
    }

    .new_user_page .user_info {
      margin-top: 10px;
      padding: 15px;
      border-radius: 8px;
      width: 100%;
    }

    .new_user_page .main_info {
      flex-grow: 1;
    }

    .new_user_page .sep {
      display: flex;
      align-items: flex-start;
    }

    .new_user_page .username {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .new_user_page .status {
      background: unset;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .new_user_page .user_details,
    .new_user_page .statistics {
      flex-grow: 1;
      margin-top: 10px;
      margin-right: 20px;
      max-width: 35%;
      max-height: 300px;
      overflow-y: scroll;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .new_user_page .statisticss p {
      color: var(--outline-dark) !important;
    }

    .statisticss span {
      font-weight: 900;
      color: var(--text-color) !important;
      margin-right: 5px;
    }

    .new_user_page .statistics {
      flex-grow: 0;
      max-width: 1200px;
      padding-top: 10px;
    }

    .new_user_page .level_registration:last-child {
      margin-right: 0px;
    }
    .new_user_page .level_registration {
      max-width: 360px;
      margin-top: 10px;
      padding: 10px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
    }

    .new_user_page .user_ifo {
      display: flex;
    }

    .new_user_page p {
      font-family: Consolas, monospace !important;
    }

    .new_user_page .user_details p,
    .new_user_page .statistics p,
    .new_user_page .level_registration p {
      margin: 0;
    }

    .new_user_page .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      background: unset !important;
    }

    .new_user_page .level_icons {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    .new_user_page .level_icons i,
    .new_user_page .icon {
      font-size: 24px;
      margin-right: 5px;
      color: #fff;
    }

    .new_user_page .buttons {
      display: flex;
      align-items: flex-end;
    }

    .new_user_page .subscribers {
      font-size: 16px;
      margin-bottom: 5px;
      margin-left: 10px;
      border: 1px solid #333;
      padding: 10px;
      border-radius: 5px;
    }

    .new_user_page .subscribe_button {
      background-color: #3498db;
    }

    .new_user_page .mini_comment{
      align-items: unset !important;
      grid-gap: 5px !important;
      padding: 5px !important;
      min-height: 40px !important;
      border: none !important;
    }
  </style>
  <div class="channel_header">
    <div class="avatar" onclick="T.SelectAvatar()">
      <img src="https://toonio.ru/Toons/webp/63bf15577d84b.webp" alt="Avatar">
    </div>
    <div class="buttons">
      <a href="#" class="button icon_button like_button" onclick="Like(true);" title="Лайк">
        <i class="fas fa-thumbs-up icon"></i>
      </a>
      <a href="#" class="button icon_button dislike_button" onclick="Like(false);" title="Дизлайк">
        <i class="fas fa-thumbs-down icon"></i>
      </a>
      <a href="#" class="button icon_button block_button" onclick="Dl.AddUser();" title="Добавить в ЧС">
        <i class="fas fa-user-slash icon"></i>
      </a>
    </div>
    <a href="/settings/profile" class="button settings_button">
      <i class="fas fa-cog settings_icon"></i>
    </a>
    <a href="/logout" class="button icon_button logout_button" title="Выйти из аккаунта">
      <i class="fas fa-sign-out-alt icon"></i>
    </a>
  </div>
  <div class="user_info">
    <div class="sep">
      <div class="main_info">
        <div class="username">Имя пользователя</div>
        <div class="status">Онлайн</div>
        <div class="SubStatus">Не друзья</div>
      </div>
      <a href="#" class="SendMsg button">Написать сообщения</a>
      <a href="#" class="button subscribe_button">Подписаться</a>
      <div class="subscribers">1234</div>
    </div>
    <div class="user_ifo">
      <div class="user_details">
        <p>Здесь может быть описание пользователя. Оно может быть довольно длинным и растягиваться на несколько строк.</p>
      </div>
      <div class="level_registration">
        <div class="title">Информация о пользователе:</div>
        <p data-tip="Уровень">
          <i class="fas fa-trophy"></i> Уровень: 42
        </p>
        <p class="status">
          </i> Прогресс: 42% </p>
        <p>
          <i class="fas fa-calendar-alt"></i> Дата регистрации: 01.01.2022
        </p>
        <p>
          <i class="fas fa-child"></i> Пол: Мужской
        </p>
        <p>
          <i class="fas fa-birthday-cake"></i> Дата рождения: 01.01.1990
        </p>
        <div class="statistics">
          <div class="title">Статистика</div>
          <div class="statisticss">
            <p>
              <i class="fas fa-film"></i> Мульты: 68
            </p>
            <p>
              <i class="fas fa-music"></i> Озвучки: 3
            </p>
            <p>
              <i class="fas fa-star"></i> Коллекция: 393
            </p>
            <p>
              <i class="fas fa-comment"></i> Комментарии: 2658
            </p>
          </div>
        </div>
      </div>
      <div class="level_registration">
        <div class="title">Приколы))0))0)</div>
        <button id="startAnalizing">Подгрузить мульты</button>
        <div class="funStuff" style="display:none;">
        <div class="mini_comment">
          <div>
            <a id="imgL" href="/error">
              <img loading="lazy" class="avatar" title="Жди..." src="">
            </a>
          </div>
          <div>
            <a class="username user comm">Топ лайков</a>
            <p>Загрузка...<br>
            </p>
          </div>
        </div>
        <div class="mini_comment">
          <div>
            <a id="imgL" href="/error">
              <img loading="lazy" class="avatar" title="Жди..." src="">
            </a>
          </div>
          <div>
            <a class="username user comm">Топ дизов</a>
            <p>Загрузка...<br>
            </p>
          </div>
        </div>
        <div class="mini_comment">
          <div>
            <a id="imgL" href="/error">
              <img loading="lazy" class="avatar" title="Жди..." src="">
            </a>
          </div>
          <div>
            <a class="username user comm">Незамечен</a>
            <p>Загрузка...<br>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
            var contentElement = document.querySelector('body .content.divided.prof');
            let docs = document.querySelector('.comms_section');

            let Pageusername = window.location.pathname.split("/")[1].split("@")[1];
            let myuserName = document.querySelector('.right > div:nth-child(5) > a:nth-child(1)').href.split("@")[1];
            let mypageHmHmHm = (Pageusername == myuserName);
            let SubStatus = "Не подписан";
            try {
                SubStatus = document.querySelector(".sub_holder > div:nth-child(2)").innerText;
            } catch { }

            let userAvatar = docs.querySelector(`.avatar`).src;
            let username = docs.querySelector('.u_info_header h1').innerHTML;
            let stat = docs.querySelector('.u_info_header h3').innerText.trim();
            let subscribeCount = docs.querySelector('.subscribe > #sub_counter').innerText.trim();
            let subText = docs.querySelector(".subscribe > #sub").innerText.trim();
            let headerURL = "https://toonio.ru/Toons/webp/654254381e92b.webp";
            let description = "";
            try {
                description = docs.querySelector('.description').innerHTML;
            } catch { };
            if (description.split("Data-")[1]) {
                headerURL = "https://toonio.ru/Toons/webp/" + description.split("Data-")[1] + ".webp";
                description = description.split("Data-")[0];
            }
            let gender = "?";
            try {
                gender = docs.querySelector("p:has(.fa-child) b").innerText.trim();
            } catch { };
            let birthday = "?";
            try {
                birthday = docs.querySelector('p:has(.fa-birthday-cake) b').innerText.trim();
            } catch { };
            let registrationDate = "?"
            try {
                registrationDate = docs.querySelector('.rdate b').innerText.trim();
            } catch { }
            let level = docs.querySelector('p:has(.fa-stars) b').innerText.trim();
            let realLevel = docs.querySelector('p:has(.fa-stars)').dataset.tip;
            let levelProgress = "100%";
            try {
                levelProgress = docs.querySelector('.level_progress .count').style.width;
            } catch { };
            let count = docs.querySelector('.counts').innerHTML;
            let dubbingCount = docs.querySelector('.counts p:nth-child(2) b').innerText.trim();
            let collectionCount = docs.querySelector('.counts p:nth-child(3) b').innerText.trim();
            let commentsCount = docs.querySelector('.counts p:nth-child(4) b').innerText.trim();
            NewUserPage.querySelector(".channel_header").style.backgroundImage = "url(" + headerURL + ")";
            console.log(NewUserPage.querySelector(".channel_header").style.backgroundImage)
            console.log(NewUserPage.querySelector(".channel_header").style.backgroundImage = "url(" + headerURL + ")")
            NewUserPage.querySelector(".avatar img").src = userAvatar;
            NewUserPage.querySelector('.username').innerHTML = username;
            NewUserPage.querySelector('.status').textContent = stat;
            NewUserPage.querySelector('.SubStatus').textContent = SubStatus;
            NewUserPage.querySelector('.SendMsg').href = "/pm/" + Pageusername;
            NewUserPage.querySelector('.status').textContent = stat;
            NewUserPage.querySelector('.subscribe_button').textContent = subText;
            NewUserPage.querySelector('.subscribers').textContent = subscribeCount;
            if (description != "") {
                NewUserPage.querySelector('.user_details p').innerHTML = description;
            } else {
                NewUserPage.querySelector('.user_details').remove();
            }
            NewUserPage.querySelector('.level_registration p:nth-child(2)').innerHTML = '<i class="fas fa-trophy"></i> ' + level;
            NewUserPage.querySelector('.level_registration p:nth-child(2)').title = realLevel;
            NewUserPage.querySelector('.level_registration p:nth-child(3)').textContent = 'Прогресс: ' + levelProgress;
            NewUserPage.querySelector('.level_registration p:nth-child(4)').innerHTML = '<i class="fas fa-calendar-alt"></i> Дата регистрации: ' + registrationDate;
            NewUserPage.querySelector('.level_registration p:nth-child(5)').innerHTML = '<i class="fas fa-child"></i> ' + gender;
            NewUserPage.querySelector('.level_registration p:nth-child(6)').innerHTML = '<i class="fas fa-birthday-cake"></i> Дата рождения: ' + birthday;
            NewUserPage.querySelector('.statisticss').innerHTML = count;
            try {
                document.querySelector("[data-tip*='Ты не можешь отправить сообщение этому Тунеру']").textContent = "asd";
                NewUserPage.querySelector('.SendMsg').textContent = "Сообщения недоступны";
                NewUserPage.querySelector('.SendMsg').href = "#";
                NewUserPage.querySelector('.SendMsg').disabled = "";
            } catch { }
            if (mypageHmHmHm) {
                NewUserPage.querySelector(".buttons").style.display = "none";
            } else {
                NewUserPage.querySelector(".subscribe_button").addEventListener("mouseup", async () => {
                    const subscribeButton = NewUserPage.querySelector('.subscribe_button');
                    const subscribersElement = NewUserPage.querySelector('.subscribers');

                    let currentSubscribers = parseInt(subscribersElement.textContent.trim(), 10);

                    if (subscribeButton.textContent === "Подписаться") {
                        currentSubscribers += 1;
                        subscribeButton.textContent = "Отписаться";
                    } else if (subscribeButton.textContent === "Отписаться") {
                        currentSubscribers -= 1;
                        subscribeButton.textContent = "Подписаться";
                    }

                    subscribersElement.textContent = currentSubscribers;

                    await T.Subscribe(Pageusername);
                });
                NewUserPage.querySelector(".logout_button").style.display = "none";
                NewUserPage.querySelector(".settings_button").style.display = "none";
            }
            docs.remove();
            async function loadFun() {
                await waitForElm(".pagination");
                let Section = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[1].value;
                let authorId = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[3].value;
                let cat = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[2].value.split("=")[1];

                let pag = 1;
                let pageNum = 1;
                try {
                    pag = document.querySelector(".pagination");
                } catch (e) {
                    console.error("Error finding pagination:", e);
                }
                try {
                    pageNum = parseInt(pag.children[pag.children.length - 1].attributes[0].value);
                } catch (e) {
                    console.error("Error getting page number:", e);
                }

                function parseToon(toonHtml) {
                    const container = document.createElement('div');
                    container.innerHTML = toonHtml;

                    const title = container.querySelector('.name a').innerText;
                    const url = "/Toons/webp/" + container.querySelector('.toon').id + ".webp";
                    let href = container.querySelector('.preview').href;
                    let likes = parseInt(container.querySelector('.likes .l b').innerText);
                    (likes > 0) || (likes = 0);
                    let dislikes = parseInt(container.querySelector('.likes .d b').innerText);
                    (dislikes > 0) || (dislikes = 0);

                    return { title, likes, dislikes, url, href };
                }

                async function processToons() {
                    const requestData = {
                        'Section': Section,
                        'Page': 1,
                        'HTML': false,
                        'Data': '{"Author":"' + authorId + '","Url":"/@Vika4ernaya", "Filters":{"cat":"'+cat+'"}}'
                    };

                    let toonsData = [];

                    for (let i = 1; i <= pageNum; i++) {
                        requestData.Page = i;
                        try {
                            const response = await $.post('/api/v1/Toons.Load', requestData);
                            const parsedResponse = JSON.parse(response);

                            for (let j = 0; j < parsedResponse.Toons.length; j++) {
                                const toonHtml = parsedResponse.Toons[j];
                                const toonData = parseToon(toonHtml);
                                toonsData.push(toonData);
                                console.log(toonData.title == "Дикий зверь в кустах...");
                            }
                        } catch (error) {
                            console.error("Error fetching page", i, ":", error);
                        }
                    }

                    if (toonsData.length > 0) {
                        const topLikedToon = toonsData.reduce((prev, current) => (current.likes > prev.likes) ? current : prev);
                        const topDislikedToon = toonsData.reduce((prev, current) => (current.dislikes > prev.dislikes) ? current : prev);
                        const unnoticedToon = toonsData.reduce((prev, current) => (current.likes + current.dislikes < prev.likes + prev.dislikes) ? current : prev);

                        NewUserPage.querySelector('.mini_comment p').innerHTML = topLikedToon.title + ' <br> Лайков: ' + topLikedToon.likes;
                        NewUserPage.querySelector('.mini_comment #imgL').href = topLikedToon.href;
                        {
                            let toonid = topLikedToon.url.split("/")[3].split(".")[0];
                            await checkImage(topLikedToon.url).then(isLoaded => {
                                if (!isLoaded) {
                                    topLikedToon.url = "/Toons/Preview/" + toonid + ".gif";
                                }
                            });
                            NewUserPage.querySelector('.mini_comment img').src = topLikedToon.url;
                        }

                        NewUserPage.querySelectorAll('.mini_comment p')[1].innerHTML = topDislikedToon.title + ' <br> Дизлайков: ' + topDislikedToon.dislikes;
                        NewUserPage.querySelectorAll('.mini_comment #imgL')[1].href = topDislikedToon.href;
                        {
                            let toonid = topDislikedToon.url.split("/")[3].split(".")[0];
                            await checkImage(topDislikedToon.url).then(isLoaded => {
                                if (!isLoaded) {
                                    topDislikedToon.url = "/Toons/Preview/" + toonid + ".gif";
                                }
                            });
                            NewUserPage.querySelectorAll('.mini_comment img')[1].src = topDislikedToon.url;
                        }

                        NewUserPage.querySelectorAll('.mini_comment p')[2].innerHTML = unnoticedToon.title + ' <br> Лайков: ' + unnoticedToon.likes + '<br>Дизлайков: ' + unnoticedToon.dislikes;
                        NewUserPage.querySelectorAll('.mini_comment #imgL')[2].href = unnoticedToon.href;
                        {
                            let toonid = unnoticedToon.url.split("/")[3].split(".")[0];
                            await checkImage(unnoticedToon.url).then(isLoaded => {
                                if (!isLoaded) {
                                    unnoticedToon.url = "/Toons/Preview/" + toonid + ".gif";
                                }
                            });
                            NewUserPage.querySelectorAll('.mini_comment img')[2].src = unnoticedToon.url;
                        }
                    } else {
                        console.log("Нет данных о мультфильмах.");
                    }
                }
                processToons();
            }
            NewUserPage.querySelector('#startAnalizing').addEventListener("mousedown", async (e) => {
                await loadFun();
                NewUserPage.querySelector('#startAnalizing').style.display = "none";
                NewUserPage.querySelector('.funStuff').style.display = "unset";
            })
            contentElement.parentNode.insertBefore(NewUserPage, contentElement);
        }

    }

    function stylisingAddon() {
        let stylisEl = document.createElement("div");
        stylisEl.innerHTML = `<div class="block_section customSettEl set1">
    <style>
        .content.divided {
           width: var(--main-block-width) !important;
        }
        .customSett {
            align-items: center !important;
            margin-bottom: 0 !important;
            height: max-content !important;
        }

        input[data-color] {
            width: 170px !important;
            padding-left: 10px !important;
            height: max-content !important;
        }

        input[jspiker][data-color] {
            width: 140px !important;
        }

        .customSettEl {
            max-width: 840px !important;
        }
        .set1{
           width: 130%;
        }
        .set2{
           width: 70%;
           margin-left: 30%;
        }
    </style>
    <div class="title">
        <h1><span class="far fa-fill-drip fa-fw icon"></span>Кастомизация</h1>
    </div>
    <div class="container filled left">
        <div class="settings_container two">
            <div class="customSett settings_container two">
                <label>Основной цвет:</label>
                <input jspiker="" data-color="main">
            </div>
            <div class="customSett settings_container two">
                <label>Более светлый основной цвет:</label>
                <input jspiker="" data-color="main-lighter">
            </div>
            <div class="customSett settings_container two">
                <label>Фон:</label>
                <input jspiker="" data-color="background">
            </div>
            <div class="customSett settings_container two">
                <label>Более темный фон:</label>
                <input jspiker="" data-color="background-darker">
            </div>
            <div class="customSett settings_container two">
                <label>Контрастный цвет:</label>
                <input jspiker="" data-color="contrast-color">
            </div>
            <div class="customSett settings_container two">
                <label>Цвет кнопок:</label>
                <input jspiker="" data-color="button-color">
            </div>
            <div class="customSett settings_container two">
                <label>Более светлый цвет кнопок:</label>
                <input jspiker="" data-color="button-color-lighter">
            </div>
            <div class="customSett settings_container two">
                <label>Цвет текста (и обводки?):</label>
                <input jspiker="" data-color="outline-dark">
            </div>
            <div class="customSett settings_container two">
                <label>Цвет окон (не бекграунд):</label>
                <input jspiker="" data-color="window">
            </div>
            <div class="customSett settings_container two">
                <label>Вроде черный, хз вообщем:</label>
                <input jspiker="" data-color="transparent">
            </div>
            <div class="customSett settings_container two">
                <label>Вроде черный, 2?, хз вообщем:</label>
                <input jspiker="" data-color="transparent-2">
            </div>
            <div class="customSett settings_container two">
                <label>Белый?:</label>
                <input jspiker="" data-color="white">
            </div>
            <div class="customSett settings_container two">
                <label>Цвет кнопк при наведении:</label>
                <input jspiker="" data-color="hover">
            </div>
            <div class="customSett settings_container two">
                <label>Цвет фона элемента мульта (Там где превью) :</label>
                <input jspiker="" data-color="toon">
            </div>
            <div class="customSett settings_container two">
                <label for="outline-size">Размер обводки:</label>
                <input type="text" id="outline-size" data-color="outline-size">
            </div>
            <div class="customSett settings_container two">
                <label for="border-radius">Радиус скругления:</label>
                <input type="text" id="border-radius" data-color="border-radius">
            </div>
            <div class="customSett settings_container two">
                <label for="border-radius-small">Маленький радиус скругления:</label>
                <input type="text" id="border-radius-small" data-color="border-radius-small">
            </div>
            <div class="customSett settings_container two">
                <label for="main-block-width">Ширина главного блока:</label>
                <input type="text" id="main-block-width" data-color="main-block-width">
            </div>
        </div>
        <div class="settings_container two">
            <div class="col-sm-3">
                <button type="button" id="apply-button">Применить</button>
            </div>
            <div class="col-sm-3">
                <button type="button" id="reset-button">Сбросить</button>
            </div>
            <div class="col-sm-3">
                <button id="save_cfg">Сохранить конфиг</button>
            </div>
            <div class="col-sm-3">
                <button id="load_cfg">Загрузить конфиг</button>
            </div>
        </div>
    </div>
</div>
<div class="block_section customSettEl set2">
    <div class="title">
        <h1><span class="far fa-fill-drip fa-fw icon"></span>Доп настойки (работают после перезагрузки)</h1>
    </div>
    <div class="container filled left">
        <div class="customSett settings_container two">
            <label for="background-image">Фотокарточка на фон (ссылка (видео пока не поддерживается)):</label>
            <input type="text" id="background-image" data-color="background-image">
        </div>
        <div class="customSett">
            <input type="checkbox" id="alt-style-toon-el" data-color="alt-style-toon-el" value="true">
            <label for="alt-style-toon-el">Другой вид мульт элемента</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="alt-style-comm" data-color="alt-style-comm" value="true">
            <label for="alt-style-comm">Другой вид комментариев</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="goodplace-first" data-color="goodplace-first">
            <label for="goodplace-first">Мульт дня самый первый</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="remove-hello" data-color="remove-hello">
            <label for="remove-hello">Убрать приветствия на главной</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="remove-vkg" data-color="remove-vkg">
            <label for="remove-vkg">Убрать VK группу на главной</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="remove-ytplayer" data-color="remove-ytplayer">
            <label for="remove-ytplayer">Убрать трейлер? на главной</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="remove-detect" data-color="remove-detect">
            <label for="remove-detect">Убрать рекламу</label>
        </div>
        <div class="customSett">
            <input type="checkbox" id="left-right" data-color="left-right">
            <label for="left-right">Поменять лево с право (чекните сами короче...)</label>
        </div>
    </div>
</div>`;
        sett = true;
        const settingsContainer = document.querySelector(".toons_section > div:nth-child(1)");
        if (settPage) {
            settingsContainer.insertAdjacentHTML("beforeend", stylisEl.innerHTML);
        } else {
            sett = false;
        }
        if (!sett) return false;

        function init() {
            for (const [key, value] of Object.entries(colors)) {
                const input = document.querySelector(`input[data-color="${key}"]`);
                (input.type == "checkbox") && (input.checked = value) || (input.value = value);
            }
            loadColors();
        }
        const applyButton = document.querySelector("#apply-button");
        applyButton.addEventListener("click", () => {
            const inputs = document.querySelectorAll("input[data-color]");
            for (const input of inputs) {
                let color = input.value;
                (input.type == "checkbox") && (color = input.checked);
                const dataColor = input.getAttribute("data-color");
                colors[dataColor] = color;
                document.body.style.setProperty("--" + dataColor, colors[dataColor], "important");
            }
            saveColors();
        });

        const resetButton = document.querySelector("#reset-button");
        resetButton.addEventListener("click", () => {
            for (const key in colors) {
                colors[key] = dfcolors[key];
            }

            const inputs = document.querySelectorAll("input[data-color]");
            for (const input of inputs) {
                (input.type == "checkbox") && (input.checked = colors[input.getAttribute("data-color")]);
                input.value = colors[input.getAttribute("data-color")];
            }
        });

        const saveCfgButton = document.querySelector("#save_cfg");
        saveCfgButton.addEventListener("click", () => {
            const data = JSON.stringify(colors);
            const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "config.json";
            link.click();
            URL.revokeObjectURL(url);
        });

        const loadCfgButton = document.querySelector("#load_cfg");
        loadCfgButton.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.click();

            input.addEventListener("change", () => {
                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    const data = JSON.parse(event.target.result);
                    for (const key in data) {
                        colors[key] = data[key];
                    }

                    const inputs = document.querySelectorAll("input[data-color]");
                    for (const input of inputs) {
                        (input.type == "checkbox") && (input.checked = colors[input.getAttribute("data-color")]);
                        input.value = colors[input.getAttribute("data-color")];
                    }
                };

                reader.readAsText(file);
            });
        });
        function saveColors() {
            const data = JSON.stringify(colors);
            window.localStorage.setItem("colors", data);
        }
        init()
        setTimeout(() => {
            document.head.append(scr);
        }, 100)
    }

    async function searchAddon() {
        if (window.location.pathname.split("/")[1].includes("@")) {
            let old;
            let oldNew;
            let authorId;
            try {
                authorId = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[3].value;
            } catch {
                await sleep(100);
                searchAddon();
                return;
            }
            let first = true;
            const Section = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[1].value;
            let pag = 1;
            let pageNum = 1;
            try {
                pag = document.querySelector(".pagination");
            } catch { }
            try {
                pageNum = parseInt(pag.children[pag.children.length - 1].attributes[0].value);
            } catch { }
            let cat = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons").attributes[2].value.split("=")[1];
            let title = document.querySelector(".prof > .toons_section > .floaty > .title")
            let search = document.createElement("div");
            search.style.cssText = "display: flex; justify-content: center;";
            search.innerHTML = `
<div class="search" style="position: relative; width: 25%; min-width:250px; margin-top:10px;">
<span class="fas fa-search fa-fw"></span>
<input id="searchInMy" type="search" placeholder="Искать Мульты">
</div>`;
            title.append(search);

            async function processToons() {
                let toonContainer = document.querySelector("body > div.content.divided.prof > div.toons_section > div.block_section > div.container.filled > div.toons");
                if (document.querySelector("#searchInMy").value == "") {
                    if (old) {
                        oldNew = toonContainer.innerHTML;
                        toonContainer.innerHTML = old;
                        return;
                    }
                } else {
                    if (old && oldNew) {
                        if (toonContainer.innerHTML == old) {
                            toonContainer.innerHTML = oldNew;
                            return;
                        }
                    }
                }
                if (!first) {
                    let toons = toonContainer.querySelectorAll(".toon");
                    for (let i in toons) {
                        try {
                            let toon = toons[i];
                            toon.parentElement.style.display = "none";
                            let name = toon.querySelector(".toon_data .name").innerText.toLowerCase();
                            const searchText = document.querySelector("#searchInMy").value.toLowerCase();
                            if (name.includes(searchText)) {
                                toon.parentElement.style.display = "block";
                            }
                        } catch { };
                    }
                    return;
                }
                old = toonContainer.innerHTML;
                toonContainer.innerHTML = "<div>Загрузка...</div>";
                const requestData = {
                    'Section': Section,
                    'Page': 1,
                    'HTML': false,
                    'Data': `{"Author": "${authorId}","Url": "/@${authorId}", "Filters":{"cat":"${cat}"}}`
                };
                console.log(requestData);
                for (let i = 0; i <= pageNum; i++) {
                    requestData.Page = i;
                    try {
                        const response = await $.post('/api/v1/Toons.Load', requestData);
                        console.log(response);
                        const parsedResponse = JSON.parse(response);

                        for (let i = 0; i < parsedResponse.Toons.length; i++) {
                            const toonHtml = parsedResponse.Toons[i];
                            const el = document.createElement('div');
                            el.innerHTML = toonHtml;
                            el.style.display = "none";
                            toonContainer.append(el);
                        }
                    } catch (error) {
                        console.error("Error fetching cartoons:", error);
                    }
                }
                let loading = toonContainer.querySelector(":not(.toon)");
                if (loading) loading.remove();
                first = false;
                processToons();
            }
            document.querySelector("#searchInMy").addEventListener("change", () => {
                processToons();
            })
        }
    }

    cfg.newStyleAddon && newStyleAddon();
    if (reToonioPage) makeCfgPage();
    if (cfg.bypassContinueBL) bypassContinueBL();
    if (cfg.autorSearch) searchAddon();
    if (cfg.stylisingAddon) stylisingAddon();
    if (cfg.nsfwBypass) nsfwBypassAddon();
    if (cfg.bannedBypass) bannedBypassAddon();
    if (cfg.badges) badgesAddon();
    if (cfg.likeAllPages && toonsProfilePage) likesAddon();
    if (cfg.unpubBypass && toonUnpub) unpubBypass();
}, 1000);