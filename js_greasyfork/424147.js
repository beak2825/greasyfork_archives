// ==UserScript==
// @name         </> Kurt & Java Otomatik Mesaj Ve Mesaj Engelleyici
// @namespace    http://tampermonkey.net/
// @version      17.8
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424147/%3C%3E%20Kurt%20%20Java%20Otomatik%20Mesaj%20Ve%20Mesaj%20Engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/424147/%3C%3E%20Kurt%20%20Java%20Otomatik%20Mesaj%20Ve%20Mesaj%20Engelleyici.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #010201;
}
.btn-blue:hover .btn-blue:active {
background-color: #010201;
}
.btn:hover {
cursor: pointer;
}
.btn-red {
background-color: #360010;
}
.btn-red:hover .btn-blue:active {
background-color: #360010;
}
.btn:hover {
cursor: pointer;
}
.btn-gold {
background-color: #5a6600;
}
.btn-gold:hover .btn-blue:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-green {
background-color: #001603;
}
.btn-green:hover .btn-blue:active {
background-color: #001603;
}
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp33 {
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp33 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp33 .hud-zipp-grid33 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity33"]::before {
background-image: url("https://cdn.discordapp.com/emojis/821053993995730984.png?v=1");
}
.hud-menu-zipp33 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp33 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp33 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

// Sınıf Değiştirme
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

// Büyü Simgesi
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity33");
spell.classList.add("hud-zipp33-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

// Büyü Simgesi mMnüsü
let modHTML = `
<div class="hud-menu-zipp33">
<br />
<div class="hud-zipp-grid33">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp33")[0];

// Anaktar
document.getElementsByClassName("hud-zipp33-icon")[0].addEventListener("click", function() {
  if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
        _menu[0],
        _menu[1],
        _menu[2],
  _spell[0],
  _spell[1]
];

allIcon.forEach(function(elem) {
        elem.addEventListener("click", function() {
                if(zipz123.style.display == "block") {
                        zipz123.style.display = "none";
                };
        });
});

// Açma Ve Kapama Anahtarı
function modm() {
        if(zipz123.style.display == "none") {
    zipz123.style.display = "block";
    for(var i = 0; i < menus.length; i++) {
      menus[i].style.display = "none";
    }
  } else {
        zipz123.style.display = "none";
  };
};

// Sohbet Sonlandırıcı
const getId = ID => {
    return document.getElementById(ID);
}

const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}

  document.getElementsByClassName("hud-zipp-grid33")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3>• Kurt & Java Otomatik Mesaj</h3>
<hr />
<button class="btn btn-red Mesaj1" style="width: 5%;"></button>
<button class="btn btn-blue Mesaj1" style="width: 50%;">Mesaj Göndermeye Başla</button>
<input style="width: 30%; type="text" class="btn btn-white 187i5" placeholder="Yazılacak Mesaj">
<button class="btn btn-red Mesaj1" style="width: 5%;"></button>
<br>
<button onclick="Mesaj3();">Kullanıcı İsim Kayıt</button>
<button onclick="Mesaj4();">Verilecek Hız Kayıt</button>
<br>
<input type="letter" class="Değer1" placeholder="Kullanıcı İsim">
<input type="number" class="Değer2" placeholder="Verilicek Hız">
<hr />
<h3>• Kurt & Java Mesaj Engelleyici</h3>
<hr />
<button class="btn btn-green" style="width: 15%;"id="chatFilter" filter="all">Hepsi</button>
<br>
<button class="btn btn-blue" id="blockName" style="width: 25%; margin-top: 1%;">Engel</button>
<input type="text" class="btn" id="nameToBlock" style="width: 45%; margin-top: 1%;" maxlength=35 placeholder="Oyuncu Anaktarı"></input>
<button class="btn btn-blue" id="unblockName" style="margin-top: 1%; margin-left: 1%; width: 25%;">Engel Kaldır</button>
<br>
<button class="btn btn-gold" id="showBlocked" style="width:50%; margin-top: 1%;">Engellenen İsimleri Göster</button>
</center>\n<div style="margin-top: 1%;" id="blockNamesList"></div>
<br><br>
  `;

let filterButton = getId("chatFilter");
filterButton.onclick = () => {
    let f = filterButton.getAttribute("filter");
    let newF = "all";
    if (f == "all") {
        newF = "party";
    } else if (f == "party") {
        newF = "none";
    } else if (f == "none") {
        newF = "all";
    }
    filterButton.setAttribute("filter", newF);
    switch (newF) {
        case "all":
            filterButton.setAttribute("class", "btn btn-green");
            filterButton.textContent = "Hepsi";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-gold");
            filterButton.textContent = "Parti";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-red");
            filterButton.textContent = "Yok";
            break;
    }
}

let blockButton = getId("blockName");
blockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToBlock = getId("nameToBlock").value;
    if (blocked.includes(nameToBlock)) return;
    blocked.push(nameToBlock);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let unblockButton = getId("unblockName");
unblockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToUnblock = getId("nameToBlock").value;
    if (blocked.indexOf(nameToUnblock) == -1) return;
    blocked.splice(blocked.indexOf(nameToUnblock), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let showBlockedButton = getId("showBlocked");
showBlockedButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getId("blockNamesList").innerHTML = str;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let filter = filterButton.getAttribute("filter");
    switch (filter) {
        case "party":
            {
                let party = Game.currentGame.ui.playerPartyMembers;
                let uids = [];
                for (let member of party) {
                    uids.push(member.playerUid);
                }
                if (!uids.includes(msg.uid)) return;
            }
            break;
        case "none":
            return;
            break;
    }
    let blockedNames = JSON.parse(localStorage.getItem("blockedNames"));
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, ''),
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong>: ${c}</div>`);
    if (blockedNames.includes(b)) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);



addEventListener('keydown', function(e){
    if(e.key == "+"){
Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
        }
    if(e.key == "+"){
Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
console.log('invisable')
    }
})

// Stil
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#ffffff";
  Style1[i].style.border = "2px solid #080808";
}
// Giriş Ve Seç Stili
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}
