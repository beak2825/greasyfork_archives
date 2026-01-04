// ==UserScript==
// @name         StickyNotes
// @namespace    StickyNotes
// @version      v2
// @description  Заметки для юзеров Lolzteam
// @author       https://zelenka.guru/lays (openresty)
// @match        https://zelenka.guru/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478013/StickyNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/478013/StickyNotes.meta.js
// ==/UserScript==

let notices;

(async function() {
    notices     = await GM.getValue("notices") ? GM.getValue("notices") : `{"users": {}}`;
    window.addEventListener("DOMContentLoaded",(event) => {
    profileRender();
    });
    renderFunctions();
})();

async function shortcutCall() {
    let returnit = `[exceptids=${await shortcut}]
    
    [/exceptids]`
    document.querySelector(".fr-element.fr-view.fr-element-scroll-visible p").innerHTML = await returnit;
}


function setShortcut(e) {
    GM.setValue("adblock", e)
    adblock = e;
    XenForo.alert('AdBlock настроен', 1, 10000)
}


async function profileRender() {
  if (!document.querySelector(".avatarScaler")) {return false;}
  notices = await JSON.parse(await notices);
  nick_val = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig,'')
  let noticer = document.querySelector(".insuranceDeposit");
  if (!notices.users[nick_val]) {
    notices.users[nick_val] = {
      'text': 'заметка не установлена'
    }
    notice = await notices.users[nick_val]
  }else {
     notice = await notices.users[nick_val]
  }
  let notice_render = `
  <br>
  <div class="section insuranceDeposit">
      <div class="secondaryContent">
          <h3>
                  Заметка для ${nick_val}
          </h3>

          <h3 style="margin-bottom: 0px; font-size: 18px !important;" class="amount">
          ${await notice.text}
          </h3>
          <div style="margin-top: 15px;  display: flex; gap: 5px;">
              <a class="button leftButton primary" onclick="noteSet(nick_val)">Изменить заметку</a>
          </div>
      </div>
  </div>`;
  // <a class="button leftButton primary" onclick="voteTrust(${blzt_trust_val})">Изменить рейтинг👍👎</a>
  let notice_block = document.createElement("div");
  notice_block.innerHTML = notice_render;

  noticer.append(notice_block);
}

function noteSet(trust) {
  nick_val = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig,'')
  let html = `
  <i>Введите комментарий,>
  <input id="commentt" style=" padding: 6px;border-radius: 6px;height: 20px;background: #303030;color: white;border: 1px solid rgb(54, 54, 54); placeholder="Заметка">
  <div style="margin-top: 15px;  display: flex; gap: 5px;">
  <a class="button leftButton primary" onclick="commitNote('${nick_val}')">Сохранить</a>
  `;
  XenForo.alert(html, "Изменить заметку");
}

async function commitNote(nick_val) {
  console.log(await notices)
  notices = await JSON.parse(await notices);
  let comment = document.querySelector("#commentt").value;
  if (!comment)  {
      return XenForo.alert("Укажите комментарий!", 1, 10000)
  }
  if (!notices.users[nick_val]) {
    notices.users[nick_val] = {
      'text': comment
    }
  }else {
      notices.users[nick_val].text = comment;
  }
 
  setCache(JSON.stringify(notices))
  location.reload()
}

async function setCache(e) {
  return await GM.setValue('notices', e);
}

function renderFunctions() {
    unsafeWindow.notices = notices;
    unsafeWindow.setShortcut = e => setShortcut(e);
    let torender = [dialogWin, commitNote, noteSet, profileRender];
    unsafeWindow.setCache = e => setCache(e);
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
}

async function dialogWin() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim().replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(" Premium", "").trim();

    let htmlall = `
    <div id="settings1-content" class="settings-content">
      <h2>FuckMouse</h2>
   
      <label>
        <span>ID Юзеров (через запятую)</span><br>
        <input id="secretph" placeholder="123, 1234, и т.д..." style="margin-top: 4px;">
        <a onclick="setShortcut(document.querySelector('#secretph').value)">Сохранить</a>
      </label>
    </div>



    <style>
    .errorOverlay>.baseHtml {
        padding: 0px;
    }
    .xenOverlay .errorOverlay .errorDetails {
        padding: 0px;
        white-space: normal;
    }
    .errorDetails {
      white-space: normal;
      padding: 0;
      margin: 0;
      font-family: sans-serif;
      background-color: #303030;
      color: white;
    }
    input {
        padding: 4px;
        border-radius: 6px;
        height: 20px;
        background: #303030;
        color: white;
        border: 1px solid rgb(0, 186, 120);
    }
    .settings-content {
      padding: 20px;
      /* border: 1px solid #ccc; */
      transition: 0.5s;
    }
    button {
      color: #fff;
      border: 0;
      background: 0;
      padding: 0 0 5px;
      margin-left: 7px;
      font-size: 15px;
      transition: 0.5s;
    }
    .customicon {
      background-color:#424141;
      padding: 10px;
      transition: .1s;
    }
    .customicon:hover {
      background-color:#242424;
    }
    .available {
      border-top: 1px solid rgb(0, 186, 120);
    }
    .onlyprem {
      border-top: 1px solid rgb(177, 0, 9);
    }
    </style>
    <script>
    var elements = document.querySelectorAll('button');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function(e) {
            for (let index = 1; index < 50; index++) {
                try {
                    document.getElementById('settings' + index + '-content').style.display = 'none';
                    document.getElementById('settings' + index).style.boxShadow = 'none';
                } catch{}
            }

            e.target.style = "box-shadow: inset 0px -2px 0px 0px rgb(0, 186, 120);";
            document.getElementById(e.target.id + '-content').style.display = 'block';
        });
    }
    </script>

    `
    let html_prem = `
    ${htmlall}
    `;
    return  XenForo.alert(
        `${html_prem}`, 'Настройки FuckMouse.'
    )
}