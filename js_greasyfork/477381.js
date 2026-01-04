// ==UserScript==
// @name         FuckMouse
// @namespace    FuckMouse
// @version      v4
// @description  Автоматический хайд
// @author       https://zelenka.guru/lays (openresty)
// @match        https://zelenka.guru/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477381/FuckMouse.user.js
// @updateURL https://update.greasyfork.org/scripts/477381/FuckMouse.meta.js
// ==/UserScript==
 
let shortcut;
 
(async function() {
    shortcut   = await GM.getValue("shortcut") ? GM.getValue("shortcut") : 'null';
    setInterval(async () => {
        daemon();
    }, 0);
    window.addEventListener("DOMContentLoaded",(event) => {
        $('#AccountMenu ul.secondaryContent.blockLinksList li:nth-child(12)').after('<li><a onclick="dialogWin()">Настройка FuckMouse</a></li>');
    });
    renderFunctions()
})();
 
async function shortcutCall() {
    let returnit = `[exceptids=${await shortcut}]
 
    [/exceptids]`
    document.querySelector(".fr-element.fr-view.fr-element-scroll-visible p").innerHTML += await returnit;
}
 
async function daemon() {
    //шорткаты
    if (shortcut != 'null' && !document.querySelector("#lzt-better-shortcut") && window.location.pathname.includes("threads")) {
        let cutbtn = document.createElement("div")
        cutbtn.id = "lzt-better-shortcut";
        cutbtn.classList.add("lzt-fe-se-extraButton")
        cutbtn.onclick = async function() {
            await shortcutCall();
        };
        cutbtn.title = "Быстрая вставка";
        cutbtn.innerHTML = `<i class="fas fa-clone"></i>`;
        document.querySelector(".lzt-fe-se-extraButtonsContainer.js-lzt-fe-extraButtons").append(cutbtn);
    }
    return;
}
 
function setShortcut(e) {
    GM.setValue("shortcut", e)
    shortcut = e;
    XenForo.alert('FuckMouse настроен', 1, 10000)
}
 
 
function renderFunctions() {
    unsafeWindow.setShortcut = e => setShortcut(e);
    unsafeWindow.shortcut = shortcut;
    let torender = [dialogWin, shortcutCall];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
}
 
async function dialogWin() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim().replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(" Premium", "").trim();
    shortcut = await shortcut;
    if (shortcut == null) {
      shortcut == 'null'
    }
    let htmlall = `
    <div id="settings1-content" class="settings-content">
      <h2>FuckMouse</h2>
 
      <label>
        <span>ID Юзеров (через запятую)</span><br>
        <input id="secretph" placeholder="123, 1234, и т.д..." style="margin-top: 4px;" ${shortcut != 'null' ? 'value="'+shortcut+'"' : ''}>
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