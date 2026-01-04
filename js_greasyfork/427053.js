// ==UserScript==
// @name         </> Kurt Mod
// @namespace    http://tampermonkey.net/
// @version      88.3
// @description  !adminyetki
// @icon         https://cdn.discordapp.com/emojis/823513307712454727.png?v=1
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/427053/%3C%3E%20Kurt%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/427053/%3C%3E%20Kurt%20Mod.meta.js
// ==/UserScript==

 // Linki Buraya Giriyorsunuz (FPS Arttırıcı)
(() => {
    const backgroundImageURL = "https://www.goktepeliler.com/attachments/abstract-backg-2016_960-jpg.89481/";

    const background = {
        ready: false,
        image: new Image()
    };

    background.image.src = backgroundImageURL;
    background.image.onload = function () {
        background.ready = true;
    };

    // Yerel İşlevleri Edinin
    let _fillText = CanvasRenderingContext2D.prototype.fillText;
    let _fillRect = CanvasRenderingContext2D.prototype.fillRect;
    let _alert = window.alert;
    let _toString = Function.prototype.toString;

    // Onlar İçin Ayrı Çengelli Sürümler Oluşturun
    let fillText = function () {
        if (arguments[0] == "Bir Reklam Engelleyici Kullanıyorsunuz, Lütfen Oyunu Desteklemek İçin Onu Devre Dışı Bırakmayı Düşünün") {
            arguments[0] = "";
        }
        return _fillText.apply(this, arguments);
    };
    let fillRect = function () {
        if (arguments[2] > 1000 && arguments[3] > 1000 && background.ready){
            this.fillStyle = "rgba(0,0,0,0)";
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.drawImage(background.image, 0, 0, this.canvas.width, this.canvas.height);
        }
        return _fillRect.apply(this, arguments);
    };
    let alert = function () {
        return _alert.call(this, "Uzantı Tespiti Tetiklendi. Lütfen Yenileyin.");
    };
    let toString = function () {
        if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
        if (this == CanvasRenderingContext2D.prototype.fillRect) return _toString.call(_fillRect);
        if (this == window.alert) return _toString.call(_alert);
        if (this == Function.prototype.toString) return _toString.call(_toString);
        return _toString.call(this);
    };

    // Varsayılan İşlevlerin Prototiplerini Geçersiz Kılın
    fillText.proto = _fillText.prototype;
    fillText.prototype = _fillText.prototype;
    fillRect.proto = _fillRect.prototype;
    fillRect.prototype = _fillRect.prototype;
    toString.proto = _toString.prototype;
    toString.prototype = _toString.prototype;
    // Kancaları Ayarlayın
    CanvasRenderingContext2D.prototype.fillText = fillText;
    CanvasRenderingContext2D.prototype.fillRect = fillRect;
    window.alert = alert;
    Function.prototype.toString = toString;

    document.currentScript && document.currentScript.remove();
})();

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #00011d;
}
.btn-blue:hover .btn-blue:active {
background-color: #00011d;
}
.btn:hover {
cursor: pointer;
}
.btn-red {
background-color: #250000;
}
.btn-red:hover .btn-blue:active {
background-color: #250000;
}
.btn:hover {
cursor: pointer;
}
.btn-gold {
background-color: #7e7700;
}
.btn-gold:hover .btn-blue:active {
background-color: #7e7700;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290021;
}
.btn-purple:hover .btn-blue:active {
background-color: #290021;
}
.btn:hover {
cursor: pointer;
}
.btn-green {
background-color: #011a01;
}
.btn-green:hover .btn-blue:active {
background-color: #011a01;
}
.btn:hover {
cursor: pointer;
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
.hud-menu-zipp3 {
display: none;
position: fixed;
top: 45%;
left: 35%;
width: 1000px;
height: 670px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 15;
}
.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
background-image: url("https://cdn.discordapp.com/emojis/823513307712454727.png?v=1");
}
.hud-menu-zipp3 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp3 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp3 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";

function $(classname) {
    var element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://discordapp.com/widget?id=821773113506267136&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget

var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}

let tyles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<button class="SE" style="width: 20%">• Işınlanma 🎲</button>
<button class="AB" style="width: 20%">• Yapay Zeka 💻</button>
<button class="BS" style="width: 20%">• Üs Kaydedici 📃</button>
<button class="SI" style="width: 20%">• Büyüler 🔮</button>
<button class="SS" style="width: 20%">• Sil & Yükselt 💸</button>
<button class="OK" style="width: 20%">• Otomatik Kurucu 🏠</button>
<button class="YM" style="width: 20%">• Yardım Menü 🔨</button>
<div class="hud-zipp-grid3">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];

document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", function() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
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

document.getElementsByClassName("SE")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SE")[0].innerText = "🎲";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Işınlanma 🎲";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "💻";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Yapay Zeka 💻";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "📃";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Üs Kaydedici 📃";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("SI")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "🔮";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Büyüler 🔮";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("SS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SS")[0].innerText = "💸";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Sil & Yükselt 💸";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("OK")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("OK")[0].innerText = "🏠";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Otomatik Kurucu 🏠";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("YM")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("YM")[0].innerText = "🔨";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Yardım Menü 🔨";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i8")[0]) {
            document.getElementsByClassName(i + "i8")[0].style.display = "";
        }
    }
})

var IntroFooter = '';
IntroFooter += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

var IntroSocial = '';
IntroSocial += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-social')[0].innerHTML = IntroSocial;

var IntroCornerTopLeft = '';
IntroCornerTopLeft += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornerTopLeft;

document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");
document.querySelectorAll('.ad-unit').forEach(function(a) {
    a.remove();
});

function modm() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
    };
};
function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "• Işınlanma 🎲";
    document.getElementsByClassName("AB")[0].innerText = "• Yapay Zeka 💻";
    document.getElementsByClassName("BS")[0].innerText = "• Üs Kaydedici 📃";
    document.getElementsByClassName("SI")[0].innerText = "• Büyüler 🔮";
    document.getElementsByClassName("SS")[0].innerText = "• Sil & Yükselt 💸";
    document.getElementsByClassName("OK")[0].innerText = "• Otomatik Kurucu 🏠";
    document.getElementsByClassName("YM")[0].innerText = "• Yardım Menü 🔨";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "none";
        }
    }


    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "none";
        }
    }

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i8")[0]) {
            document.getElementsByClassName(i + "i8")[0].style.display = "none";
        }
    }
}

(function(t, e) {
    let script = document.createElement("script")
    script.src = t
    document.body.appendChild(script)

    let link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = e
    document.head.appendChild(link)
})("https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js", "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css")

const playerDeath = new CustomEvent("playerDeath", {
    "detail": "..."
})
new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutations[0].target.style.display == "block") {
            document.dispatchEvent(playerDeath)
        }
    })
}).observe(document.querySelector(".hud-respawn"), {
    attributes: true
})
document.addEventListener("playerDeath", function() {
    new Noty({
        text: "Öldün! Tekrardan Gelişmen Gerek Daha Yeni Başlıyoruz.",
        theme: "relax",
        type: "error",
        timeout: 3000
    }).show()
    document.querySelector(".hud-respawn-btn").click()
})

// Menümüz
document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h2 class="etc.Class">• Kurt Mod'a Hoş Geldin</h2>
<hr />
<h4 class="etc.Class">↻ Kurt'un Özel Olarak Yaptığı Bu Kurt Mod Kimsenin Eline Geçmicek Bir Şekil de Şifrelenmiş Bir Sisteme Bağlanmıştır.</h4>

<button class="btn btn-blue 1i6" style="width: 20%;">Hepsini Kaldır</button>

<button class="btn btn-blue 2i6" style="width: 20%;">Duvarları Kaldır</button>

<button class="btn btn-blue 3i6" style="width: 20%;">Kapıları Kaldır</button>

<button class="btn btn-blue 4i6" style="width: 20%;">Tuzakları Kaldır</button>

<button class="btn btn-blue 5i6" style="width: 20%;">Okları Kaldır</button>

<button class="btn btn-blue 6i6" style="width: 20%;">Büyücüleri Kaldır</button>

<button class="btn btn-blue 7i6" style="width: 20%;">Bombacıları Kaldır</button>

<button class="btn btn-blue 8i6" style="width: 20%;">Topçuları Kaldır</button>

<button class="btn btn-blue 9i6" style="width: 20%;">Altınları Kaldır</button>

<button class="btn btn-blue 10i6" style="width: 20%;">İticileri Kaldır</button>

<button class="btn btn-blue 11i6" style="width: 20%;">Kazıcıları Kaldır</button>

<button class="btn btn-purple 12i6" style="width: 20%;">Her Şeyi Yükselt</button>

<button class="btn btn-purple 13i6" style="width: 20%;">Duvarları Yükselt</button>

<button class="btn btn-purple 14i6" style="width: 20%;">Kapıları Yükselt</button>

<button class="btn btn-purple 15i6" style="width: 20%;">Tuzakları Yükselt</button>

<button class="btn btn-purple 16i6" style="width: 20%;">Okları Yükselt</button>

<button class="btn btn-purple 17i6" style="width: 20%;">Büyücüleri Yükselt</button>

<button class="btn btn-purple 18i6" style="width: 20%;">Bombacıları Yükselt</button>

<button class="btn btn-purple 19i6" style="width: 20%;">Topçuları Yükselt</button>

<button class="btn btn-purple 20i6" style="width: 20%;">Altınları Yükselt</button>

<button class="btn btn-purple 21i6" style="width: 20%;">İticileri Yükselt</button>

<button class="btn btn-purple 22i6" style="width: 20%;">Toplayıcıları Yükselt</button>

<br class="23i6"><br class="24i6">

<button id=\"BSB\" class="btn btn-blue 0i7" style="width: 20%;">TC Base</button>
<button class="btn btn-blue 1i7" style="width: 20%;">Skore Base</button>
<button class="btn btn-blue 2i7" style="width: 20%;">Sancak Base</button>
<button class="btn btn-blue 3i7" style="width: 20%;">Tosun Base</button>
<button class="btn btn-blue 4i7" style="width: 20%;">Zeltaus Base</button>
<button class="btn btn-blue 5i7" style="width: 20%;">Orjinal Base</button>

<br class="6i7"><br class="7i7">

<button  id=\"0i8\" class=\"btn btn-blue 0i8\" style=\"width: 20%;\">Klon Gönder</button>

<button  id=\"1i8\" class=\"btn btn-blue 1i8\" style=\"width: 20%;\">Hayvanları Yok Et</button>

<button  id=\"2i8\"  class=\"btn btn-blue 2i8\" style=\"width: 20%;\">Otomatik Kazıcı</button>

<br class="3i8"><br class="4i8">


<button class="btn btn-blue ehack-btn" style="border-radius:25%" onclick="Game.currentGame.network.disconnect()">Bağlantıyı Kes</button>
`;


// Pet Can Doldurucu
Game.currentGame.ui._events.playerPetTickUpdate.push(({ health, maxHealth }) => {
    if(health < maxHealth - Math.sqrt(maxHealth)) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "PetHealthPotion",
            "tier": 1
        })
    }
})
// Can Dondurucu
function healPlayer() {
    if (!game.ui.components.PlacementOverlay.buildingId && !game.ui.components.BuildingOverlay.buildingId) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        })

        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
    }
}

// Sil & Yükselt

document.getElementsByClassName("1i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("2i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("3i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("4i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("5i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("6i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("7i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("8i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("9i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("10i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("11i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("12i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("13i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("14i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Door") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("15i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("16i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("17i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("18i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("19i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("20i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("21i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("22i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("1i6")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("1i8")[0].addEventListener('click', function() {
    for(let uid in game.world.entities) {
        if(game.world.entities[uid].fromTick.model == "PetCARL" || game.world.entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.world.entities[uid].fromTick.uid
            });
        }
    }
})

//Pp ler
var css = '.hud-menu-settings { background: url(\'https://b.europegifts.co/img/products/85165-galaxy-uzay-gezegenler-toprak-fotograf-arka-fonu-yueksek-kaliteli-bilgisayar-bask-duvar-fotograf-stuedyosu-arka-plan.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-shop { background: url(\'https://img-fotki.yandex.ru/get/892397/493212545.696/0_1fddb6_17a8f00a_orig.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-party { background: url(\'https://www.itemyapi.com/wp-content/uploads/2014/01/gergi-tavan-gorsel-uzay-15.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-intro::after { background: url(\'https://downloadwap.com/thumbs2/wallpapers/p2ls/new/37/bYaqbUPf.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-zipp3 { background: url(\'https://images3.alphacoders.com/140/thumb-1920-140189.jpg\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);


// Parti İsim Değiştirme
(function() {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.all.min.js";
    document.getElementsByTagName('head')[0].appendChild(js);
    var css = document.createElement('script');
    css.type = 'text/css';
    css.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.min.css";
    document.getElementsByTagName('head')[0].appendChild(css);
    var intervalId = setInterval(function() {
        if(Game.currentGame.world.inWorld === true) {
            clearInterval(intervalId);
            var my_elem = document.getElementsByClassName('hud-party-actions')[0];
            var div = document.createElement('div');
            var btncustom = "<style type=\"text/css\">.custom_input { width: 100px; height: 35px; font-size: 15px; padding: 5px 10px; color: #555; border-radius: 5px; border: 1px solid #bbb; outline: none;}a.button1{ display:inline-block; padding:0.35em 1.2em; border:0.1em solid #FFFFFF; margin:0 0.3em 0.3em 0; border-radius:0.12em; box-sizing: border-box; text-decoration:none; font-family:'Roboto',sans-serif; font-weight:300; color:#FFFFFF; text-align:center; transition: all 0.2s;}a.button1:hover{ color:#000000; background-color:#FFFFFF;}@media all and (max-width:30em){ a.button1{ display:block; margin:0.4em auto; }}</style>";
            document.body.insertAdjacentHTML("beforeend", btncustom);
            div.innerHTML = "<div style=\"display: inline-block; margin-left: 15px; margin-right: 10px;\"> Parti İsim: </div><a class=\"button1\">Aktif Et</a><a class=\"button1\" style=\"margin-left:10px\">Kapat</a><small style=\"margin-left: 5px; margin-right: 5px;\"> Hız: </small><input class=\"custom_input\" type=\"number\" value=\"100\" min=\"0\" max=\"10000\" />";
            my_elem.parentNode.insertBefore(div, my_elem);
            document.getElementById('hud-menu-party').style.height = "480px";
            let maxlength = setInterval(function() {
                if(document.getElementsByClassName('swal2-input')[0]) {
                    clearInterval(maxlength);
                    var i;
                    for(i = 0; i < document.getElementsByClassName('swal2-input').length; i++) {
                        document.getElementsByClassName('swal2-input')[i].maxLength = 49;
                    }
                }
            }, 100);
            var start = document.getElementsByClassName('button1')[0];
            start.style.marginBottom = "20px";
            var id = null;
            let interval = setInterval(function() {
                if(start) {
                    clearInterval(interval);
                    var speed = document.querySelector('input[class="custom_input"]');
                    start.onclick = function() {
                        swal.mixin({
                            input: 'text',
                            confirmButtonText: 'Devam',
                            showİşlemiSonlandırButton: true,
                            progressSteps: ['1', '2', '3'],
                        }).queue([{
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 1'
                        }, {
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 2'
                        }, {
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 3'
                        }]).then((result) => {
                            if(result.value) {
                                swal({
                                    title: 'Başardın',
                                    html: 'Parti İsimlerin <pre><code>' + JSON.stringify(result.value) + '</code></pre>',
                                    confirmButtonText: 'Güzel',
                                    onClose: () => {
                                        function countInArray(array, what) {
                                            var count = 0;
                                            for(var i = 0; i < array.length; i++) {
                                                if(array[i] === what) {
                                                    count++;
                                                }
                                            }
                                            return count;
                                        }
                                        var i;
                                        for(i = 0; i < result.value.length; i++) {
                                            if(result.value[i] == "") {
                                                var parties = countInArray(result.value, "");
                                                if(parties == 0) {
                                                    result.value.length = 3;
                                                } else if(parties == 1) {
                                                    result.value.length = 2;
                                                } else if(parties == 2) {
                                                    result.value.length = 1;
                                                } else if(parties == 3) {
                                                    result.value.length = 0;
                                                    result.value == undefined;
                                                    swal("Hata!", "Parti İsmin Girilemedi!", "error")
                                                }
                                            }
                                        }
                                        document.getElementsByClassName('hud-menu-icon')[1].click();
                                        var partyTag = document.getElementsByClassName('hud-party-tag')[0];
                                        var space = new Event("keyup");
                                        var delay;
                                        id = setInterval(function() {
                                            partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                            space.keyCode = 32;
                                            partyTag.dispatchEvent(space);
                                        }, delay);
                                        speed.addEventListener("input", function() {
                                            clearInterval(id);
                                            delay = speed.value;
                                            id = setInterval(function() {
                                                partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                                space.keyCode = 32;
                                                partyTag.dispatchEvent(space);
                                            }, delay)
                                        });
                                        var stop = document.getElementsByClassName('button1')[1];
                                        stop.onclick = function() {
                                            result.value = null;
                                            clearInterval(id);
                                            id = null;
                                            var i;
                                            for(i = 0; i < 10000; i++) {
                                                clearInterval(i);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }, 1000)
            }
    }, 250)
    })();

function disconnectPartyMembers(member = 1) {
    // Lider Olduğunuzdan Ve Onları Yönlendirecek Parti Üyelerine Sahip Olduğunuzdan Emin Olun.
    if (game.ui.playerPartyMembers[1] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 15000);
    }
}

game.network.addRpcHandler("ReceiveChatMessage", e => {
   if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!alanyoket") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!kendiniyoket") {
            game.network.socket.send([]);
        }
    }
})

// Yakınlaştırma Ultra
let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (3090 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(2.35, dimension + 0.51);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.11, dimension - 0.51);
        onWindowResize();
    }
}

// Tasarımlar, Dalga Ve X,Y
const lololololol = `Coldness is a f‌a‌g‌g‌o‌t nignogger`

let mapTimeouts = [];

function createCoordinates() {
    let x = document.createElement('div')
    x.innerHTML = `<p id="coords" style="color:blue;">Alan = X: 0, Y: 0</p>
`
    x.style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-left").append(x)
}

let mapMouseX;
let mapMouseY;
let hasBeenInWorld = false;
const uAgent = navigator.userAgent;
const isChromeOS = uAgent.includes('CrOS');
const isMac = uAgent.includes('Macintosh');
const isWindows = uAgent.includes('Windows');

function blurText(path) {
    document.querySelector(path)
        .style.color = "transparent";
    document.querySelector(path)
        .style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
}

function focusText(path, originalColor) {
    document.querySelector(path)
        .style.color = originalColor;
    document.querySelector(path)
        .style.textShadow = "none";
}
setInterval(() => {
    try {
        if (window.isInMenu) {
            blurText('#scorelog')
            blurCanvas()
        } else {
            focusText('#scorelog', 'blue')
            focusCanvas()
        }
    } catch (err) {
         // console.log('Tuvali bulanıklaştıramıyor veya odaklayamıyor. Bunun nedeni büyük olasılıkla puan kaydedicinin henüz yüklenmemiş olmasıdır. Hata: '+ hata);
    }
    _isInChatbox = document.querySelector('.hud-chat')
        .classList.contains('is-focused')
    if (botMode) {
        if (parseInt((getEntitiesByModel('Tree')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Ağaç @ Açı (radyan cinsinden): " + getNearestTreeAngle()
            })
            danceRandom = false;
        } else {
            danceRandom = true;
        }
        if (parseInt((getEntitiesByModel('Stone')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Taş @ Açı (in radians): " + getNearestStoneAngle()
            })
        }
    }
}, 2.5)

function blurCanvas() {
    document.querySelector('canvas')
        .style.filter = "blur(8px)";
}

function focusCanvas() {
    document.querySelector('canvas')
        .style.filter = "none";
}
const version = "2.4.6";

const authors = "Kurt";

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
console.log('%ceHaxx', 'color: green; background: yellow; font-size: 30px');
game.network.addEnterWorldHandler(function () {
    setTimeout(() => {
        game.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "Zᴏᴍʙs ҚЦ尺Ť ௱ØÐ " + version + " (✓) Yapımcım " + authors
        })
    }, 500)


    document.querySelector("#hud > div.hud-bottom-center").style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-center").style.color = "rgba(192, 192, 192, 0.75)"
    document.querySelector("#hud > div.hud-bottom-center").style.fontSize = "30px"
    setInterval(() => {
        document.querySelector("#hud > div.hud-top-right")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud > div.hud-top-right")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-spell-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .childNodes.forEach((item) => (item.innerHTML = ""));
        document.querySelectorAll(".hud-toolbar-building")
            .forEach((item) => {
            (item.style.border = "5px solid rgba(0, 0, 0, 0.30)"), (item.style.babsdsd = "25%");
        });
        document.querySelector("#hud-debug")
            .style.color = "grey";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(7)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.border = "3px solid blue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(7)")
            .style.border = "3px solid blue";
        if (isChromeOS) {
            document.querySelector("#hud-menu-icons")
                .style.marginBottom = "120px";
        }
        document.querySelector("#hud-map")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-map")
            .style.border = "5px solid rgba(0, 0, 0, 0.40)";
    }, 250);
    setTimeout(() => {
        if (!hasBeenInWorld) {
            var scoreLogged = 0;
            if(!hasBeenInWorld) {
                hasBeenInWorld = true
                setInterval(() => {
                    document.querySelector('#scorelog')
                        .innerText = `1 Dalga da Gelen Skor: ${scoreLogged}`
                    document.querySelector("#coords")
                        .innerText = `Alan = X: ${game.world.localPlayer.entity.targetTick.position.x}, Y: ${game.world.localPlayer.entity.targetTick.position.y}`
                }, 100)
                createCoordinates()
            }
            hasBeenInWorld = true;
            document.querySelector("#hud > div.hud-bottom-center").append('Zᴏᴍʙs ҚЦ尺Ť ௱ØÐ ')
            var oldScore = Game.currentGame.ui.playerTick.score,
                newScore = 0;
            Game.currentGame.network.addRpcHandler("DayCycle", () => {
                newScore = Game.currentGame.ui.playerTick.score;
                scoreLogged = ((newScore - oldScore)
                               .toLocaleString("en"));
                oldScore = Game.currentGame.ui.playerTick.score;
            });
            const topCenter = document.querySelector("#hud > div.hud-top-center");
            let logElem;
            logElem = document.createElement('div');
            logElem.innerHTML = `<h1 id="scorelog" style="color:blue;">1 Dalga da Gelen Skor: 0</h1>`;
            topCenter.append(logElem);
        }
    }, 500)

})
var changeChat = true;
var hoverOver;
var mousemove;
addEventListener('mousemove', (e) => {
    mousemove = e;
})

function roundTenThousands(x) {
    if (x > 10000) {
        return x.toString()
            .slice(0, 3) + "00"
    } else {
        return x.toString()
    }
}

function roundMyPosition(e) {
    return {
        x: roundTenThousands(e.getPositionX()),
        y: roundTenThousands(e.getPositionY())
    }
}

// Klon
var button7 = document.getElementById("0i8");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}

// Sihirbaz
(function() {
    'use strict';
let script_1_1 = () => {
    game.ui.components.PlacementOverlay.oldStartPlacing = game.ui.components.PlacementOverlay.startPlacing;
    game.ui.components.PlacementOverlay.startPlacing = function(e) {
        game.ui.components.PlacementOverlay.oldStartPlacing(e);
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = 2;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(180);
        }
    }

    game.ui.components.PlacementOverlay.cycleDirection = function () {
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = (game.ui.components.PlacementOverlay.direction + 1) % 4;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(game.ui.components.PlacementOverlay.direction * 90);
        }
    };

    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }
    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";
    let privateTab = document.createElement("a");
    privateTab.className = "hud-party-tabs-link";
    privateTab.id = "privateTab";
    privateTab.innerHTML = "Kapalı Partiler";
    let privateHud = document.createElement("div");
    privateHud.className = "hud-private hud-party-grid";
    privateHud.id = "privateHud";
    privateHud.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);
    let keyTab = document.createElement("a");
    keyTab.className = "hud-party-tabs-link";
    keyTab.id = "keyTab";
    keyTab.innerHTML = "Anaktarlar";
    getElement("hud-party-tabs")[0].appendChild(keyTab);
    let keyHud = document.createElement("div");
    keyHud.className = "hud-keys hud-party-grid";
    keyHud.id = "keyHud";
    keyHud.style = "display: none;";
    getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);
    getId("privateTab").onclick = e => {
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("privateTab").className = "hud-party-tabs-link is-active";
        getId("privateHud").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud").getAttribute("style") == "display: none;") {
            getId("privateHud").setAttribute("style", "display: block;");
        }
        if (getId("keyHud").getAttribute("style") == "display: block;") {
            getId("keyHud").setAttribute("style", "display: none;");
        }
    }
    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        getId("keyHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
        if (getId("keyTab").className == "hud-party-tabs-link is-active") {
            getId("keyTab").className = "hud-party-tabs-link"
        }
    }
    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        getId("keyHud").setAttribute("style", "display: none;");
        getId
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
        if (getId("keyTab").className == "hud-party-tabs-link is-active") {
            getId("keyTab").className = "hud-party-tabs-link"
        }
    }
    getId("keyTab").onmouseup = e => {
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("keyTab").className = "hud-party-tabs-link is-active";
        getId("keyHud").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud").getAttribute("style") == "display: block;") {
            getId("privateHud").setAttribute("style", "display: none;");
        }
        if (getId("keyHud").getAttribute("style") == "display: none;") {
            getId("keyHud").setAttribute("style", "display: block;");
        }
    }
    let num = 0;
    Game.currentGame.network.addRpcHandler("PartyShareKey", e => {
        let el = document.createElement('div');
        el.innerText = e.partyShareKey;
        el.className = `tag${num++}`;
        document.getElementsByClassName('hud-keys hud-party-grid')[0].appendChild(el);
        document.getElementsByClassName(el.className)[0].addEventListener('click', e => {
            game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: el.innerText});
        })
    });
    let parties = "";
    Game.currentGame.network.addRpcHandler("SetPartyList", e => {
        parties = "";
        for (let i in e) {
            if (e[i].isOpen == 0) {
                parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + e[i].partyName + "</strong><span>" + e[i].memberCount + "/4<span></div>";
            }
        }
        getId("privateHud").innerHTML = parties;
    });
};
script_1_1();
})();

    // Her Hangi Bir Base de 9 lu Duvar Koyabilirsiniz Odununuzun Olması Yeterli
let mousePs = {};
let shouldBuildWalls = true;

function placeWall(x, y) {
    game.network.sendRpc({name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0});
}

document.addEventListener('mousemove', e => {
    mousePs = {x: e.clientX, y: e.clientY};
    if (shouldBuildWalls && game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
        var buildingSchema = game.ui.getBuildingSchema();
        var schemaData = buildingSchema.Wall;
        var mousePosition = game.ui.getMousePosition();
        var world = game.world;
        var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
        var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {width: schemaData.gridWidth, height: schemaData.gridHeight});
        var cellSize = world.entityGrid.getCellSize();
        var cellAverages = { x: 0, y: 0 };
        for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
                return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(cellIndexes[i], cellPos);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x/cellIndexes.length;
        cellAverages.y = cellAverages.y/cellIndexes.length;
        var gridPos = {
            x: cellAverages.x * cellSize + cellSize/2,
            y: cellAverages.y * cellSize + cellSize/2
        };
        placeWall(gridPos.x, gridPos.y);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
    }
})

// Kapasite
const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(request.responseText);
        entirePop.innerHTML = `Şuan Oyundaki İnsanlar: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Kapasite: ${data.regions[servers[i]].players}`);
        }
    }
};
request.open("GET", "http://zombs.io/capacity", true);
request.send();

// Giriş Ekranı Ve Sağ Menü
var IntroGuide = '';
IntroGuide += "<center><h3>Yapımcım</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"Yes!();\">Kurt</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Sunucu Kısayolları</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592411';\">Europe 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v8592406';\">Australia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230649';\">Asia 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230611';\">US East 1</button>";
IntroGuide += "<br><br>"
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v3230560';\">US West 1</button>";
IntroGuide += "<br><br>"
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-server')[0].value = 'v9564836';\">Özel Sunucu Açın</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>İsmin</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'ƬƇ ๖ۣۜƘƲƦƬ✓';\">Kurt'un Nicki</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Semboller</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '[✧]';\">[✧]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✘';\">✘</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '⍻';\">⍻</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '๖ۣۜ';\">๖ۣۜ</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '␥';\">␥</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '✔';\">✔</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>Yaratıcı İsimler</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Anatomy';\">İsim 1</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Ryan Wolf';\">İsim 2</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = 'Salvator';\">İsim 3</button>";
IntroGuide += "<br><br>";
IntroGuide += "<center><h3>İsmin Olmasını İstemiyorsan</h3>";
IntroGuide += "<hr style=\"color: rgba(255, 255, 255);\">";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 100%;\" onclick=\"document.getElementsByClassName('hud-intro-name')[0].value = '​';\">İsimsiz</button>";
IntroGuide += "<br><br>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;
`
.btn-apply {
background-color: #5a6600;
}
.btn-apply:hover .btn-apply:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
`
//Arka Plan Değiştirici
var Introleft = '';
Introleft += "<h3>Giriş Ekranını Değiştir</h3>";
Introleft += "<input class='input' type='text'></input>";
Introleft += "&nbsp;";
Introleft += "<button class=\"btn btn-apply\" style=\"width: 33%;\">Uygula</button>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = Introleft;

let element = document.getElementsByClassName('btn btn-apply')[0];
  element.addEventListener("click", function(e) {
           let value = document.getElementsByClassName('input')[0].value;
           let css = '<style type="text/css">.hud-intro::after { background: url('+ value +'); background-size: cover; }</style>';
   console.log("Yeni Ekran Değiştirici")
           document.body.insertAdjacentHTML("beforeend", css);
});

// Stils
style.appendChild(document.createTextNode(css));

var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // Standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#ffffff";
  Style2[i].style.border = "2px solid #00042e";
  Style2[i].style.backgroundColor = "#080808";
}

// İsim
game.network.sendEnterWorld2 = game.network.sendEnterWorld;
game.network.sendEnterWorld = (data) => {
    data.displayName = `  ƬƇ\n  ƘƲƦƬ`;
    game.network.sendEnterWorld2(data);
}

// Kalkan Ölümsüzlüğü
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);


// Fotoğraf Modu
window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 27:
            var mb = document.getElementsByClassName("hud")[0];
            if (mb.style.display === "none") {
                mb.style.display = "block";
            } else {
                mb.style.display = "none";
            }
            break;
    }
})

// Yapımcı Etiketi
var IntroCornertopleft = '';
IntroCornertopleft += "<legend>Yapımcım; Kurt</legend>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroCornertopleft;

// Kapasite 2
window.startaito = false;
let server = -1;
for (let i in game.options.servers) {
    server += 1;
    document.getElementsByClassName("hud-intro-server")[0][server].innerHTML = game.options.servers[i].name + ", Kapasite: {" + Math.round(game.options.servers[i].population/3.125) + "/32}";
}
window.useSamePI = false
addEventListener('keyup', function(e){
    if(e.key == "`" && !_isInChatbox){
game.inputManager.onKeyRelease({
    keyCode: 117
})
    }
})

// Hayvanın Otomatik Yükselip Otomatik Doğar
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-evolve");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-revive");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

// Otomatik Doğma
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

// Giriş Plan
if (localStorage.loadReminder == undefined) {
    localStorage.loadReminder = true;
} else if (Math.floor(Math.random() * 3) === 2) {
}

setTimeout(() => {

document.querySelector("#hud-intro > div.hud-intro-wrapper > h2")
    .innerHTML = ":)"
document.querySelector("#hud-intro > div.hud-intro-wrapper > h1 > small")
    .remove()
document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
    .innerHTML = "Zᴏᴍʙs ҚЦ尺Ť ௱ØÐ<small>.</small>"
document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
    .style.color = "blue"
css =
    '.hud-intro::after { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }';
style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

document.querySelector("#hud-intro > div.hud-intro-corner-bottom-right > div")
    .remove()
document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > a")
    .remove()
document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > h3")
    .innerText = "by ehScripts"
document.querySelector("#hud-intro > div.hud-intro-corner-top-right > div")
    .style.opacity = "0.55"
document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
    .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
    .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
    .style.border = "2px solid grey"
document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
    .style.border = "2px solid grey"
}, 100)

addEventListener('keydown', function(e){
    if(e.key == "-"){
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1});
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1})
        console.log('invisable')
    }
}) // Hasarsız Ok

addEventListener('keydown', function(e){
    if(e.key == "+"){
        Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
    }
    if(e.key == "+"){
        Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
        console.log('invisable')
    }
})// Otomatik Mesaj

// Sunucu ID
var srvr = -1;
for (let i in game.options.servers) {
    srvr += 1;
    document.getElementsByClassName("hud-intro-server")[0][srvr].innerHTML = game.options.servers[i].name + ", Sunucu ID: " + game.options.servers[i].id + ", Ana Bilgisayar Adı: " + game.options.servers[i].hostname;
}

var isSpamming = 0;

function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e == "") {
            e = lololololol
        }
        window.spammer = setInterval(() => {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: e
            })
        }, 100)
    } else if (isSpamming) {
        clearInterval(window.spammer)
    }
    isSpamming = !isSpamming
}
window.rainbowwww = true

function degreesToYaw(deg) {
    let ans;
    if ((deg - 90) < 90) {
        ans = deg - 90
    } else if (deg == 90) {
        ans = deg + 90
    } else if (deg > 90) {
        ans = deg + 90
    }
    if (ans < 0) {
        ans = Math.abs(ans)
    }
}
if (localStorage.timesEhacked == undefined) {
    localStorage.timesEhacked = 1;
} else {
    localStorage.timesEhacked++;
}
document.title = "Kurt Mod Yapılan Girişler: " + localStorage.timesEhacked
var autoRespawn = false
let hue = 10
var settingsRainbow = document.querySelector("#hud-menu-settings")

function changeHue() {
    if (window.rainbowwww) {
        hue -= 20
    }
}