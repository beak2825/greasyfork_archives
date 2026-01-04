// ==UserScript==
// @name         </> Kurt Mod - Majesty
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  !majesty Z Tuşu 3x3, X Tuşu 5x5, C Tuşu 7x7
// @icon         https://cdn.discordapp.com/emojis/853002908924510240.gif?v=1
// @author       Kurt
// @match        *://zombs.io/*
// @match        http://tc-mod-js.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/429366/%3C%3E%20Kurt%20Mod%20-%20Majesty.user.js
// @updateURL https://update.greasyfork.org/scripts/429366/%3C%3E%20Kurt%20Mod%20-%20Majesty.meta.js
// ==/UserScript==

document.querySelector(".hud-chat-messages").style.width ="900px";
let CAMenucss = `
.hud-CAMenu-grid3::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px blue;
	border-radius: 10px;
  border: blue solid 1px;
  background-color: rgba(0,0,0,0.8);
}
.hud-CAMenu-grid3::-webkit-scrollbar {
   background-color: blue;
    border-radius: 10px;
	width: 10px;
  }

.hud-CAMenu-grid3::-webkit-scrollbar-thumb {
   background: rgba(217, 217, 217, 1);
  border-radius: 10px;
  width: 3px;}

.hud-CAMenu-grid3::-webkit-scrollbar-thumb:hover {
    background: rgba(177, 177, 177, 1);
  border-radius: 10px;
   }
.hud-menu-CAMenu {
/*scroll bar*/
/**/
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

.hud-menu-CAMenu .hud-CAMenu-grid3 {
display: block;
height: 360px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.3);
overflow: auto;
}

.hud-spell-icons .hud-spell-icon[data-type="CAMenu"]::before {
background-image: url("https://cdn.discordapp.com/emojis/853004676889968720.png?v=1");
}

.hud-spell-icon[data-type="CAMenu"]:hover{
}

/* BTN */

.CAbtn:hover {
cursor: pointer;
}
.CAbtn1 {
background-color: rgba(0, 0, 0, 0);
border: 2px solid white;
color: blue;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1:hover{
opacity: 0.6;
cursor: pointor;
}
.CAbtn1-activated {
background-color: rgba(0, 0, 0, 0);
border: 2px solid white;
color: red;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1-activated:hover{
opacity: 0.6;
cursor: pointor
}

.CAbtnR {
background-color: #FF5964;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnR:hover{
opacity: 0.6;
cursor: pointor;
}

.CAbtnY {
background-color: #FFE74C;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnY:hover{
opacity: 0.6;
cursor: pointor;
}

.CAbtnG {
background-color: #6BF178;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnG:hover{
opacity: 0.6;
cursor: pointor;
}

.CAbtnB {
background-color: #35A7FF;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnB:hover{
opacity: 0.6;
cursor: pointor;
}


.hud-CAMenuClose-icon{
position: relative;
transform: scale(2);
bottom: 460px;
float: right;
z-index:100;

opacity: 0.2;
}

.hud-CAMenuClose-icon:hover{
opacity: 0.5;
cursor: pointer;
}

.hud-CAMenuTitle{
position: relative;
bottom: 480px;
font-size: 30px;
color: white;
text-align: center;
left:10px;
font-weight: bold;
font-family: "Hammersmith One", sans-serif;
}

/*emm*/

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

.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
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
styles.appendChild(document.createTextNode(CAMenucss));
document.head.appendChild(styles);
styles.type = "text/css";

// Büyüler
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "CAMenu");
spell.classList.add("hud-CAMenu-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

// Hareket
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseover", onMenuicon);
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseout", offMenuicon);

function onMenuicon() {
    var caMenuTooltip = document.createElement('div');
    caMenuTooltip.classList.add("hud-tooltip");
    caMenuTooltip.classList.add("hud-tooltip-right");
    caMenuTooltip.classList.add("CaTooltip");
    caMenuTooltip.style = "left: 76px; top: 325px; font-size:15px;font-weight:bold; font-family:Hammersmith One;";
    caMenuTooltip.innerHTML = "Majesty";
    document.body.appendChild(caMenuTooltip);
}

function offMenuicon() {
    document.getElementsByClassName("CaTooltip")[0].remove();
}
// Menü Alt Yapı
let modHTML = `
<div class="hud-menu-CAMenu">
<br />
<style>
.mt{
width: 25%;
background-color:rgba(0, 0, 0, 0);
border: 2px solid #fff;
border-radius: 10px;
margin: 5px;
color: blue;
}

.SI{
width: 15%;
background-color:rgba(0, 0, 0, 0);
border: 2px solid #fff;
border-radius: 5px;
margin: 5px;
color: blue;
padding: 1px;
}

.SI:hover
{
opacity: 0.6;
cursor: pointer;
}
.mt:hover{
opacity: 0.6;
cursor: pointer;
}
</style>
<div style="text-align:center">
<button class="SE mt">Detaylı Kaldır</button>
<button class="AB mt">Otomatik Kurucu</button>
<button class="PA mt">Giriş & Çıkış</button>
<button class="BS mt">Otomatik Yazıcı</button>
<button class="DY mt">Detaylı Yükselt</button>
<button class="MN mt">Pençetay</button>
<div class="hud-CAMenu-grid3">
</div>
<p class="hud-CAMenuClose-icon">&#x2715</p>
<p class="hud-CAMenuTitle"></P>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let CaMenu = document.getElementsByClassName("hud-menu-CAMenu")[0];

let grabLb = document.createElement("BUTTON");
grabLb.className = "btn btn-blue";
grabLb.id = "grabLb";
grabLb.style = "width: 100%; height: 25px; margin-top: 3%;";
grabLb.innerHTML = "Liderler Panosu";
grabLb.className = "btn btn-blue";
grabLb.id = "grabLb";
grabLb.style = "width: 100%; height: 25px; margin-top: 3%;";
grabLb.innerHTML = "Liderler Panosu";

// Tıklama
// Ikon Tıklama
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("click", function() {
    if (CaMenu.style.display == "none" || CaMenu.style.display == "") {
        document.getElementById("hud-menu-shop").style.display = "none";
        document.getElementById("hud-menu-party").style.display = "none";
        document.getElementById("hud-menu-settings").style.display = "none";
        CaMenu.style.display = "block";
    } else {
        CaMenu.style.display = "none";
    };
});
// Ikon Silme
document.getElementsByClassName("hud-CAMenuClose-icon")[0].addEventListener("click", function() {
    if (CaMenu.style.display == "none" || CaMenu.style.display == "") {
        document.getElementById("hud-menu-shop").style.display = "none";
        document.getElementById("hud-menu-party").style.display = "none";
        document.getElementById("hud-menu-settings").style.display = "none";
        CaMenu.style.display = "block";
    } else {
        CaMenu.style.display = "none";
    };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
    _menu[0], _menu[1], _menu[2], _spell[0], _spell[1]
];

// Düşman
allIcon.forEach(function(elem) {
    elem.addEventListener("click", function() {
        if (CaMenu.style.display == "block") {
            CaMenu.style.display = "none";
        };
    });
});

document.getElementsByClassName("SE")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SE")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Detaylı Kaldır";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i8")[0]) {
            document.getElementsByClassName(i + "i8")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Otomatik Kurucu";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("PA")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("PA")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Giriş & Çıkış";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i10")[0]) {
            document.getElementsByClassName(i + "i10")[0].style.display = "";
        }
    }
})
document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Otomatik Yazıcı";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i9")[0]) {
            document.getElementsByClassName(i + "i9")[0].style.display = "";
        }
    }
})




document.getElementsByClassName("DY")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("DY")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Detaylı Yükselt";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("MN")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("MN")[0].innerText = "</>";
    document.getElementsByClassName("etc.Class")[0].innerText = "Pençetay";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "";
        }
    }
})

function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "Detaylı Kaldır";
    document.getElementsByClassName("AB")[0].innerText = "Otomatik Kurucu";
    document.getElementsByClassName("BS")[0].innerText = "Otomatik Yazıcı";
    document.getElementsByClassName("PA")[0].innerText = "Giriş & Çıkış";
    document.getElementsByClassName("DY")[0].innerText = "Detaylı Yükselt";
    document.getElementsByClassName("MN")[0].innerText = "Pençetay";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i8")[0]) {
            document.getElementsByClassName(i + "i8")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i10")[0]) {
            document.getElementsByClassName(i + "i10")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i9")[0]) {
            document.getElementsByClassName(i + "i9")[0].style.display = "none";
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
}
document.getElementsByClassName("hud-CAMenu-grid3")[0].innerHTML = `
<div style="text-align:center">
<!----------------------------başlangıç--------------------------->
<div class="etc.Class">
<hr />
<h3>• Kurt & Java Majesty</h3>
</div>
<hr />

<!----------------------------detaylı kaldırma--------------------------->

<button class="CAbtn1 1i8"id = "SellAll">Her Şeyi Kaldır</button>
<button class="CAbtn1 2i8"id = "SellWalls">Duvarları Kaldır</button>
<button class="CAbtn1 3i8"id = "SellDoors">Kapıları Kaldır</button>
<button class="CAbtn1 4i8"id = "SellSlowtraps">Tuzakları Kaldır</button>
<button class="CAbtn1 5i8"id = "SellArrows">Okçuları Kaldır</button>
<button class="CAbtn1 6i8"id = "SellCanons">Topçuları Kaldır</button>
<button class="CAbtn1 7i8"id = "SellMelees">İttiricileri Kaldır</button>
<button class="CAbtn1 8i8"id = "SellBombs">Bombaları Kaldır</button>
<button class="CAbtn1 9i8"id = "SellMages">Büyücüleri Kaldır</button>
<button class="CAbtn1 10i8"id = "SellGoldmines">Altın Toplayıcıları Kaldır</button>
<button class="CAbtn1 11i8"id = "SellHarvesters">Kazıcıları Kaldır</button>
<hr class="12i8">

<!----------------------------otomatik kurucu--------------------------->

<button class="CAbtn1 1i7"id ="auto3x3">3x3 Duvar Etkinleştir</button>
<button class="CAbtn1 2i7"id ="autoHarvesterTrap">Kapan Tuzağı Etkinleştir</button>
<br class="3i7">
<button class="CAbtn1 4i7"id ="BuildMyBase">TC Üssü I</button>
<button class="CAbtn1 5i7"id ="autoHarvesterTrap">TC Üssü II</button>
<button class="CAbtn1 6i7"id ="autoHarvesterTrap">Kenar Üssü I</button>
<button class="CAbtn1 7i7"id ="autoHarvesterTrap">Kenar Üssü II</button>
<button class="CAbtn1 8i7"id ="autoHarvesterTrap">Tombul Üs</button>
<hr class="9i7">

<!----------------------------sohbet--------------------------->

<input type="text" id="spamtext" name="spamtext" required maxlength="60" size="40" placeholder="Yazılıcak Şey"class="1i9" style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid blue;">
<button class="CAbtn1 2i9"id="spambtn" style="width: 200px;">Otomatik Yazıcı Etkinleştir</button>
<button class="CAbtn1 3i9"id="clearchatbtn">Sohbet Sil</button>

<!--------------------------------parti------------------------------>
<label for="zombs.ioPartyKey" class="1i10">Parti Kodu</label>
<input type="text" id="partycodeinput" name="zombs.ioPartyKey" required maxlength="20" size="22" class="2i10" placeholder = "Anaktar"style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid blue;">
<input type="text" id="partycodeinput" name="zombs.ioPartyKey" required maxlength="20" size="22" class="8i10" placeholder = "Yedek Anaktar"style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid blue;">
<button class="CAbtn1 3i10"id="joinparty" style="width: 200px">Partiye Otomatik Katılmayı Etkinleştir</button>
<br class="4i10">
<button class="CAbtn1 5i10"id="leaveparty">Partiden Çık</button>
<button class="CAbtn1 6i10"id="opt">Sekme Aç</button>
<hr class="7i10">
<!----------------------------detaylı yükseltme--------------------------->
<button class="CAbtn1 5i5"id = "UpgradeAll">Her Şeyi Yükselt</button>
<button class="CAbtn1 6i5"id = "UpgradeWalls">Duvarları Yükselt</button>
<button class="CAbtn1 7i5"id = "UpgradeDoors">Kapıları Yükselt</button>
<button class="CAbtn1 8i5"id = "UpgradeSlowtraps">Tuzakları Yükselt</button>
<button class="CAbtn1 9i5"id = "UpgradeArrows">Okçuları Yükselt</button>
<button class="CAbtn1 10i5"id = "UpgradeCanons">Topçuları Yükselt</button>
<button class="CAbtn1 11i5"id = "UpgradeMelees">İttiricileri Yükselt</button>
<button class="CAbtn1 12i5"id = "UpgradeBombs">Bombaları Yükselt</button>
<button class="CAbtn1 13i5"id = "UpgradeMages">Büyücüleri Yükselt</button>
<button class="CAbtn1 14i5"id = "UpgradeGoldmines">Altın Toplayıcıları Yükselt</button>
<button class="CAbtn1 15i5"id = "UpgradeHarvesters">Kazıcıları Yükselt</button>
<hr class="16i5">

<!----------------------------pençetay--------------------------->
<button class="CAbtn1 1i6"id="AHRC">Otomatik Kazıcı Etkinleştir</button>
<button class="CAbtn1-activated 2i6"id="daynight">Karanlık Mod Etkinleştir</button>
<button class="CAbtn1-activated 3i6"id="SellPet">Hayvanları Kaldır</button>
<button class="CAbtn1-activated 4i6"id="Game.currentGame.network.disconnect()">Bağlantıyı kes</button>
<hr class="5i6">
</div>
`;
displayAllToNone();
// Menü Sonu
// Değişkenler
var auto3x3 = false;
var CAshouldBuild3x3Walls = false;
var CAshouldBuild5x5Walls = false;
var CAshouldBuild7x7Walls = false;
var AHRC = false;
var nightdark = true;
var JoinParty = false;
var spamchat = false;
var joinedserver = false;
var v_autoharvestertrap = false;
var mapmousex;
var mapmousey;
var mapmovetox;
var mapmovetoy;

// Klon
var button7 = document.getElementById("opt");
button7.addEventListener("click", partytab);

function partytab() {
  var url = document.getElementsByClassName('hud-party-share')[0].value;
  window.open(url);
}

function CAchat(msg) {
    Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: msg
    })
}

function placeWall(x, y) {
    game.network.sendRpc({
        name: 'MakeBuilding',
        x: x,
        y: y,
        type: "Wall",
        yaw: 0
    });
}

function placeHarvester(x, y) {
    game.network.sendRpc({
        name: 'MakeBuilding',
        x: x,
        y: y,
        type: "Harvester",
        yaw: 0
    });
}

function CAThree(gridPos) {
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

function CAFive(gridPos) {
    // 1
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
    // 2
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x, gridPos.y + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
    // 3
    placeWall(gridPos.x - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48, gridPos.y);
    // 4
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
    // 5
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
}

function CASeven(gridPos) {
    // 1
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48)
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
    // 2
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
    // 3
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
    // 4
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
    // 5
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
    // 6
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
    // 7
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
    // Bilmiyorum Neden x4, y5 (5 katman 4) Çalışmıyor, Bu Yüzden Tekrar 3x3 Yapıyorum
    CAThree(gridPos);
}
/*---------------------------------------------------başlangıç--------------------------------------------------------*/
function joinserver()
{
    joinedserver = true;
}

// Otomatik Kazıcı Tuzağı
function autoharvestertrap()
{
    v_autoharvestertrap = !v_autoharvestertrap;
     document.getElementById("autoHarvesterTrap").innerHTML = v_autoharvestertrap ? "Otomatik Kapan Tuzağını Devre Dışı Bırak" : "Otomatik Kapan Tuzağını Etkinleştir";
    document.getElementById("autoHarvesterTrap").classList.replace(v_autoharvestertrap ? "CAbtn1" : "CAbtn1-activated", v_autoharvestertrap ? "CAbtn1-activated" : "CAbtn1");
    if (v_autoharvestertrap) {

        game.ui.getComponent('PopupOverlay').showHint("[Kapan] Etkinleştirildi, İnsanları Tuzağa Düşürmek İstiyorsanız, Tüm Biçerdöverleri Sattığınızdan Emin Olun!", 1e4);
        CAchat("Otomatik Kapan Tuzağı Açıldı 🐺");
    } else {
        CAchat("Otomatik Kapan Tuzağı Kapatıldı 🐺");
    }
}

document.addEventListener('mousedown', e => {
    let CAmousePs = {
        x: e.clientX,
        y: e.clientY
    };
    if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Harvester") {
        var CAbuildingSchema = game.ui.getBuildingSchema();
        var CAschemaData = CAbuildingSchema.Wall;
        var CAmousePosition = game.ui.getMousePosition();
        var CAworld = game.world;
        var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
        var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
            width: CAschemaData.gridWidth,
            height: CAschemaData.gridHeight
        });
        var CAcellSize = CAworld.entityGrid.getCellSize();
        var CAcellAverages = {
            x: 0,
            y: 0
        };
        for (var i in CAcellIndexes) {
            if (!CAcellIndexes[i]) {
                return false;
            }
            var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
            var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
            CAcellAverages.x += CAcellPos.x;
            CAcellAverages.y += CAcellPos.y;
        }
        CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
        CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
        var gridPos = {
            x: CAcellAverages.x * CAcellSize + CAcellSize / 2,
            y: CAcellAverages.y * CAcellSize + CAcellSize / 2
        };
        console.log("place harvester1");
        if (v_autoharvestertrap) {
            console.log("place harvester");
            placeHarvester(gridPos.x - 144, gridPos.y + 48);
            placeHarvester(gridPos.x - 144, gridPos.y - 48);
            //
            placeHarvester(gridPos.x - 48, gridPos.y + 144);
            placeHarvester(gridPos.x - 48, gridPos.y - 144);
            //
            placeHarvester(gridPos.x + 48, gridPos.y + 144);
            placeHarvester(gridPos.x + 48, gridPos.y - 144);
            //
            placeHarvester(gridPos.x + 144, gridPos.y - 48);
            placeHarvester(gridPos.x + 144, gridPos.y - 48);
        }
    }
})


// 3x3 Duvar

function F_auto3x3() {
    auto3x3 = !auto3x3;
    document.getElementById("auto3x3").innerHTML = auto3x3 ? "3x3 Duvar Devre Dışı Bırak" : "3x3 Duvar Etkinleştir";
    document.getElementById("auto3x3").classList.replace(auto3x3 ? "CAbtn1" : "CAbtn1-activated", auto3x3 ? "CAbtn1-activated" : "CAbtn1");
    if (auto3x3) {

        game.ui.getComponent('PopupOverlay').showHint("", 1e4);
        CAchat("3x3 Duvar Açıldı 🐺");
    } else {
        CAchat("3x3 Duvar Kapatıldı 🐺");
    }
}
document.addEventListener('mousemove', e => {
    let mousePs = {
        x: e.clientX,
        y: e.clientY
    };
    if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
        var buildingSchema = game.ui.getBuildingSchema();
        var schemaData = buildingSchema.Wall;
        var mousePosition = game.ui.getMousePosition();
        var world = game.world;
        var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
        var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
            width: schemaData.gridWidth,
            height: schemaData.gridHeight
        });
        var cellSize = world.entityGrid.getCellSize();
        var cellAverages = {
            x: 0,
            y: 0
        };
        for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
                return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(cellIndexes[i], cellPos);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x / cellIndexes.length;
        cellAverages.y = cellAverages.y / cellIndexes.length;
        var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
        };
        if (auto3x3) {
            CAThree(gridPos);
        }

    }
})

addEventListener('keydown', function(e) {
    if (e.key == "z") {
        CAshouldBuild3x3Walls = true;
        CAshouldBuild5x5Walls = false;
        CAshouldBuild7x7Walls = false;
    } else if (e.key == "x") {
        CAshouldBuild5x5Walls = true;
        CAshouldBuild3x3Walls = false;
        CAshouldBuild7x7Walls = false;
    } else if (e.key == "c") {
        CAshouldBuild7x7Walls = true;
        CAshouldBuild3x3Walls = false;
        CAshouldBuild5x5Walls = false;
    }
})

addEventListener('keyup', function(e) {
    if (e.key == "z") {
        CAshouldBuild3x3Walls = false;
    } else if (e.key == "x") {
        CAshouldBuild5x5Walls = false;
    } else if (e.key == "c") {
        CAshouldBuild7x7Walls = false;
    }
})

document.addEventListener('mousedown', e => {
    let CAmousePs = {
        x: e.clientX,
        y: e.clientY
    };
    if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
        var CAbuildingSchema = game.ui.getBuildingSchema();
        var CAschemaData = CAbuildingSchema.Wall;
        var CAmousePosition = game.ui.getMousePosition();
        var CAworld = game.world;
        var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
        var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
            width: CAschemaData.gridWidth,
            height: CAschemaData.gridHeight
        });
        var CAcellSize = CAworld.entityGrid.getCellSize();
        var CAcellAverages = {
            x: 0,
            y: 0
        };
        for (var i in CAcellIndexes) {
            if (!CAcellIndexes[i]) {
                return false;
            }
            var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
            var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
            CAcellAverages.x += CAcellPos.x;
            CAcellAverages.y += CAcellPos.y;
        }
        CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
        CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
        var gridPos = {
            x: CAcellAverages.x * CAcellSize + CAcellSize / 2,
            y: CAcellAverages.y * CAcellSize + CAcellSize / 2
        };
        if (CAshouldBuild3x3Walls && !auto3x3) {
            CAThree(gridPos);
        } else if (CAshouldBuild5x5Walls && !auto3x3) {
            CAFive(gridPos);
        } else if (CAshouldBuild7x7Walls && !auto3x3) {
            CASeven(gridPos);
        }
    }
})

document.addEventListener('mousemove', e => {
        let CAmousePs = {
            x: e.clientX,
            y: e.clientY
        };
        if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
            var CAbuildingSchema = game.ui.getBuildingSchema();
            var CAschemaData = CAbuildingSchema.Wall;
            var CAmousePosition = game.ui.getMousePosition();
            var CAworld = game.world;
            var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
            var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
                width: CAschemaData.gridWidth,
                height: CAschemaData.gridHeight
            });
            var CAcellSize = CAworld.entityGrid.getCellSize();
            var CAcellAverages = {
                x: 0,
                y: 0
            };
            for (var i in CAcellIndexes) {
                if (!CAcellIndexes[i]) {
                    return false;
                }
                var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
                var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
                CAcellAverages.x += CAcellPos.x;
                CAcellAverages.y += CAcellPos.y;
            }
            CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
            CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
            var gridPos = {
                x: CAcellAverages.x * CAcellSize + CAcellSize / 2,
                y: CAcellAverages.y * CAcellSize + CAcellSize / 2
            };
            if (CAshouldBuild3x3Walls && !auto3x3) {
                CAThree(gridPos);
            } else if (CAshouldBuild5x5Walls && !auto3x3) {
                CAFive(gridPos);
            } else if (CAshouldBuild7x7Walls && !auto3x3) {
                CASeven(gridPos);
            }
        }
    })
    // Silme Bölümü
function SellAll() {
game.ui.getComponent('PopupOverlay').showConfirmation('Varsayılan hakaretleri değiştirmek istediğinizden emin misiniz? Bu, tüm özel hakaretleri sıfırlayacaktır', 1e4, function(){

        var entities = Game.currentGame.world.entities;
        for (var uid in entities) {
            if (!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if (obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
        CAchat("Her Şey Başarıyla Kaldırıldı 🐺");

}, function(){
    game.ui.getComponent('PopupOverlay').showHint('Fine...', 1e4)
})
}

function SellWalls() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Duvarlar Başarıyla Kaldırıldı 🐺');
}

function SellDoors() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Kapılar Başarıyla Kaldırıldı 🐺');
}

function SellSlowtraps() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Tuzaklar Başarıyla Kaldırıldı 🐺');
}

function SellArrows() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Okçular Başarıyla Kaldırıldı 🐺');
}

function SellCanons() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Topçular Başarıyla Kaldırıldı 🐺');
}

function SellMelees() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('İticiler Başarıyla Kaldırıldı 🐺');
}

function SellBombs() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Bombalar Başarıyla Kaldırıldı 🐺');
}

function SellMages() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MageTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Büyücüler Başarıyla Kaldırıldı 🐺');
}

function SellGoldmines() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Altın Oluşturucular Başarıyla Kaldırıldı 🐺');
}

function SellHarvesters() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Kaynak Toplayıcılar Başarıyla Kaldırıldı 🐺');
}

function UpgradeAll() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Ana Merkez Başarıyla Yükseltildi 🐺');
}

function UpgradeWalls() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Duvarlar Başarıyla Yükseltildi 🐺');
}

function UpgradeDoors() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Kapılar Başarıyla Yükseltildi 🐺');
}

function UpgradeSlowtraps() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Tuzaklar Başarıyla Yükseltildi 🐺');
}

function UpgradeArrows() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Okçular Başarıyla Yükseltildi 🐺');
}

function UpgradeCanons() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Topçular Başarıyla Yükseltildi 🐺');
}

function UpgradeMelees() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('İticiler Başarıyla Yükseltildi 🐺');
}

function UpgradeBombs() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Bombacılar Başarıyla Yükseltildi 🐺');
}

function UpgradeMages() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Büyücüler Başarıyla Yükseltildi 🐺');
}

function UpgradeGoldmines() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Altın Toplayıcılar Başarıyla Yükseltildi 🐺');
}

function UpgradeHarvesters() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Kazıcılar Başarıyla Yükseltildi 🐺');
}

function SellPet() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (entities[uid].fromTick.model == "PetCARL" || entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({
                name: "UpgradeBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    CAchat('Hayvanlar Başarıyla Kaldırıldı 🐺');
}


function F_AHRC() {
    AHRC = !AHRC;
    document.getElementById("AHRC").innerHTML = AHRC ? "Otomatik Kazıcı Devre Dışı Bırak" : "Otomatik Kazıcı Etkinleştir";
    document.getElementById("AHRC").classList.replace(AHRC ? "CAbtn1" : "CAbtn1-activated", AHRC ? "CAbtn1-activated" : "CAbtn1");
    if (AHRC) {
        CAchat('Otomatik Kazıcı Açıldı 🐺');
    } else {
        CAchat('Otomatik Kazıcı Kapatıldı 🐺');
    }
}
    // Kalkan
function FixShield() {
    if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
        Game.currentGame.network.sendRpc({
            name: "EquipItem",
            itemName: "ZombieShield",
            tier: Game.currentGame.ui.inventory.ZombieShield.tier
        });
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
// Parti den Ayrıl
function leaveparty() {
    Game.currentGame.network.sendRpc({
        name: "LeaveParty"
    })
}
// Partiye Katıl
function joinparty() {
    JoinParty = !JoinParty;
    document.getElementById("joinparty").innerHTML = JoinParty ? "Partiye Otomatik Katılmayı Devre Dışı Bırak" : "Partiye Otomatik Katılmayı Etkinleştir";
    document.getElementById("joinparty").classList.replace(JoinParty ? "CAbtn1" : "CAbtn1-activated", JoinParty ? "CAbtn1-activated" : "CAbtn1");
}
// Gün Işığı
function daynight() {
    nightdark = !nightdark;
    document.getElementById("daynight").innerHTML = nightdark ? "Karanlık Mod Etkinleştir" : "Karanlık Mod Devre Dışı Bırak";
    document.getElementById("daynight").classList.replace(nightdark ? "CAbtn1" : "CAbtn1-activated", nightdark ? "CAbtn1-activated" : "CAbtn1");
    if (nightdark) {
        document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "block";
        CAchat("Karanlık Mod Kapatıldı 🐺");

    } else {
        document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "none";
        CAchat("Karanlık Mod Açıldı 🐺");
    }
}

function F_spamchat()
{
    spamchat = !spamchat;
    document.getElementById("spambtn").innerHTML = spamchat ? "Otomatik Yazıcıyı Devre Dışı Bırak" : "Otomatik Yazıcıyı Etkinleştir";
    document.getElementById("spambtn").classList.replace(spamchat ? "CAbtn1" : "CAbtn1-activated", spamchat ? "CAbtn1-activated" : "CAbtn1");
    if(spamchat)
    {
        CAchat("Otomatik Yazıcı Başlatılıyor 🐺");
    }
    else
    {
        setTimeout(() => { CAchat("Otomatik Yazıcı Son Buldu 🐺"); }, 900);
    }
}

function clearchat()
{
    document.querySelector('.hud-chat-messages')
        .innerHTML = ""
}
// Yapım
function mapmove(e)
{
    mapmousex = e.pageX - 3;
    mapmousey = e.pageY - (document.getElementsByTagName('body')[0].clientHeight - 36 - 140);
    mapmovetox = Math.round(mapmousex / document.querySelector("#hud-mapcontainer").clientWidth * 23973);
    mapmovetoy = Math.round(mapmousey / document.querySelector("#hud-mapcontainer").clientHeight * 23973);

    game.ui.getComponent('PopupOverlay').showConfirmation(`Taşınmak istediğinden emin misin X: ${mapmovetox}?, Y: ${mapmovetoy}`, 1e4, function(){

            CAchat("yes");
    }, function(){
        CAchat("no");
    });

}
// Toplayıcı
setInterval(function() {

    if (AHRC) {
        var entities = Game.currentGame.world.entities
        for (let uid in entities) {
            if (!entities.hasOwnProperty(uid)) continue;
            let obj = entities[uid];
            Game.currentGame.network.sendRpc({
                name: "CollectHarvester",
                uid: obj.fromTick.uid
            });
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.07
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.11
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.17
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.22
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.25
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.28
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.42
                });
            }
            if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: 0.65
                });
            }
        }
    }
    // Klana Katıl
    if (JoinParty) {
        Game.currentGame.network.sendRpc({
            name: "JoinPartyByShareKey",
            partyShareKey: document.querySelector('#partycodeinput').value
        });
    }



    // Sohbet Spam
    if(spamchat)
    {
        CAchat(document.querySelector('#spamtext').value);
    }
}, 100);

// Etkinlikler
document.querySelector('#auto3x3')
    .addEventListener('click', F_auto3x3);
document.querySelector('#SellAll')
    .addEventListener('click', SellAll);
document.querySelector('#SellWalls')
    .addEventListener('click', SellWalls);
document.querySelector('#SellDoors')
    .addEventListener('click', SellDoors);
document.querySelector('#SellSlowtraps')
    .addEventListener('click', SellSlowtraps);
document.querySelector('#SellArrows')
    .addEventListener('click', SellArrows);
document.querySelector('#SellCanons')
    .addEventListener('click', SellCanons);
document.querySelector('#SellMelees')
    .addEventListener('click', SellMelees);
document.querySelector('#SellBombs')
    .addEventListener('click', SellBombs);
document.querySelector('#SellMages')
    .addEventListener('click', SellMages);
document.querySelector('#SellGoldmines')
    .addEventListener('click', SellGoldmines);
document.querySelector('#SellHarvesters')
    .addEventListener('click', SellHarvesters);
document.querySelector('#UpgradeAll')
    .addEventListener('click', UpgradeAll);
document.querySelector('#UpgradeWalls')
    .addEventListener('click', UpgradeWalls);
document.querySelector('#UpgradeDoors')
    .addEventListener('click', UpgradeDoors);
document.querySelector('#UpgradeSlowtraps')
    .addEventListener('click', UpgradeSlowtraps);
document.querySelector('#UpgradeArrows')
    .addEventListener('click', UpgradeArrows);
document.querySelector('#UpgradeCanons')
    .addEventListener('click', UpgradeCanons);
document.querySelector('#UpgradeMelees')
    .addEventListener('click', UpgradeMelees);
document.querySelector('#UpgradeBombs')
    .addEventListener('click', UpgradeBombs);
document.querySelector('#UpgradeMages')
    .addEventListener('click', UpgradeMages);
document.querySelector('#UpgradeGoldmines')
    .addEventListener('click', UpgradeGoldmines);
document.querySelector('#UpgradeHarvesters')
    .addEventListener('click', UpgradeHarvesters);
document.querySelector('#AHRC')
    .addEventListener('click', F_AHRC);
document.querySelector('#leaveparty')
    .addEventListener('click', leaveparty);
document.querySelector('#joinparty')
    .addEventListener('click', joinparty);
document.querySelector('#daynight')
    .addEventListener('click', daynight);
document.querySelector('#spambtn')
    .addEventListener('click', F_spamchat);
document.querySelector('#clearchatbtn')
    .addEventListener('click', clearchat);
document.querySelector('.hud-intro-play')
    .addEventListener('click', joinserver);
document.querySelector('#autoHarvesterTrap')
    .addEventListener('click', autoharvestertrap);
document.querySelector('#SellPet')
    .addEventListener('click', SellPet);
// Harita
document.querySelector('#hud-mapcontainer')
    .addEventListener('click', function(e){mapmove(e)});