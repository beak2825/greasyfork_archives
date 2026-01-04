// ==UserScript==
// @name         0800-DESCONOCIDO-XXX
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       Desconocido
// @match        https://ryuten.io/play/
// @icon         https://i.imgur.com/cqwlI3w.jpeg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459438/0800-DESCONOCIDO-XXX.user.js
// @updateURL https://update.greasyfork.org/scripts/459438/0800-DESCONOCIDO-XXX.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Redirect Script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A script to redirect to a specific URL
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

function createAnimatedText() {
    const textContainer = document.createElement("div");
    const texts = ["Ama", "Sonríe", "O", "Muere bastardo"];
    let i = 0;

    function showText() {
        textContainer.innerHTML = texts[i];
        textContainer.style.backgroundColor = "";
        textContainer.style.color = Math.random() > 0.5 ? "white" : "";
        textContainer.style.padding = "10px 20px";
        textContainer.style.margin = "10px";
        textContainer.style.borderRadius = "5px";
        textContainer.style.fontSize = "20px";
        textContainer.style.fontFamily = "cursive";
        textContainer.style.textShadow = "2px 2px 4px black";
        textContainer.style.position = "fixed";
        textContainer.style.top = "4px";
        textContainer.style.left = "50%";
        textContainer.style.transform = "translate(-50%, 0%)";
        textContainer.style.zIndex = "999999999";
        document.body.appendChild(textContainer);

        i = (i + 1) % texts.length;
    }

    setInterval(showText, 1000);
}

createAnimatedText();
    function createYouTubePlayer() {
const youtubePlayerContainer = document.createElement("div");
const youtubePlayer = document.createElement("iframe");
const youtubeButton = document.createElement("button");
const videoId = "https://youtube.com/playlist?list=PL8lAjAeb5oAdcO2EluzJQcPK80j0h3PES";
youtubeButton.style.cursor = "pointer";
youtubeButton.innerHTML = "Reproduceme";
youtubeButton.style.backgroundColor = "red";
youtubeButton.style.color = "white";
youtubeButton.style.padding = "5px 5px";
youtubeButton.style.borderRadius = "7px";
youtubeButton.style.fontSize = "14px";
youtubeButton.style.position = "fixed";
youtubeButton.style.bottom = "10px";
youtubeButton.style.right = "200px";
youtubeButton.style.zIndex = "99";
youtubeButton.style.transition = "opacity 0s ease-in-out";
youtubeButton.addEventListener("click", function() {
youtubePlayer.src = "https://www.youtube.com/embed/" + videoId + "&listType=playlist&autoplay=1";
youtubePlayer.width = "560";
youtubePlayer.height = "315";
youtubePlayer.frameBorder = "0";
youtubePlayer.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in- picture";
youtubePlayer.allowFullScreen = true;
youtubePlayerContainer.style.backgroundColor = "transparent";
youtubePlayerContainer.style.display = "none";
youtubePlayerContainer.appendChild(youtubePlayer);
document.body.appendChild(youtubePlayerContainer);
});
        let isKeyDown = false;

document.addEventListener("keydown", function(event) {
  if (event.code === "F2") {
    if (!isKeyDown) {
      if (youtubeButton.style.display === "none") {
        youtubeButton.style.display = "block";
      } else {
        youtubeButton.style.display = "none";
      }
      isKeyDown = true;
    }
  }
});

document.addEventListener("keyup", function(event) {
  if (event.code === "F2") {
    isKeyDown = false;
  }
});


document.body.appendChild(youtubeButton);
}
const button = document.createElement("button");
const url = "https://github.com/Desquised";
button.style.cursor = "pointer";
button.innerHTML = "Desarrollador";
button.style.backgroundColor = "red";
button.style.color = "white";
button.style.padding = "6px 20px";
button.style.margin = "1px";
button.style.borderRadius = "6px";
button.style.fontSize = "14px";
button.style.position = "fixed";
button.style.bottom = "4px";
button.style.right = "70%";
button.style.transform = "translate(-50%, 0%)";
button.style.zIndex = "99";
button.style.transition = "opacity 0s ease-in-out";
button.style.opacity = "1";
button.addEventListener("click", function() {
    window.open(url, "_blank");
});
    let isEscDown = false;
document.addEventListener("keydown", function(event) {
if (event.code === "F2" && !isEscDown) {
isEscDown = true;
if (button.style.opacity === "1") {
button.style.opacity = "0";
} else {
button.style.opacity = "1";
}
}
});

document.addEventListener("keyup", function(event) {
if (event.code === "F2") {
isEscDown = false;
}
});

document.body.appendChild(button);

createYouTubePlayer();

function createMiddleButton() {
    let isVisible = true;
    let flag = false;

    const middleButton = document.createElement("button");
middleButton.style.cursor = "pointer";
middleButton.innerHTML = "Ver Playlist";
middleButton.style.backgroundColor = "red";
middleButton.style.color = "white";
middleButton.style.padding = "5px 9px";
middleButton.style.borderRadius = "7px";
middleButton.style.fontSize = "14px";
middleButton.style.position = "fixed";
middleButton.style.bottom = "10px";
middleButton.style.right = "320px";
middleButton.style.zIndex = "99";
middleButton.style.transition = "opacity 0s ease-in-out";
middleButton.onclick = function() {
window.open("https://www.youtube.com/playlist?list=PL8lAjAeb5oAdcO2EluzJQcPK80j0h3PES", "_blank");
};
document.body.appendChild(middleButton);

let f2Pressed = false;
document.addEventListener("keydown", (event) => {
    if (event.code === "F2") {
        if (!f2Pressed) {
            f2Pressed = true;
            if (isVisible) {
                middleButton.style.opacity = "0";
                isVisible = false;
            } else {
                middleButton.style.opacity = "1";
                isVisible = true;
            }
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "F2") {
        f2Pressed = false;
    }
});

}
let isBlack = false;

document.addEventListener("keydown", (event) => {
if (event.code === "F4") {
if (isBlack) {
document.body.style.backgroundColor = "white";
document.body.style.opacity = "1";
isBlack = false;
} else {
document.body.style.backgroundColor = "black";
document.body.style.opacity = "0";
isBlack = true;
}
}
});

createMiddleButton();
    var container = document.createElement("div");
container.classList.add("keyboard-container");
container.innerHTML = `
    <div class="keyboard">
        <div class="key-row">
            <div class="key" id="key-esc">Esc</div>
            <div class="key" id="key-shift">Shift</div>
            <div class="key" id="key-2">2</div>
        </div>
        <div class="key-row">
            <div class="key" id="key-q">Q</div>
            <div class="key" id="key-space">Space</div>
            <div class="key" id="key-e">E</div>
        </div>
    </div>
`;
document.body.appendChild(container);
    var keyboardVisible = false;
var f2Pressed = false;
document.addEventListener("keydown", function(e) {
    if (e.key === "F8") {
        if (f2Pressed) return;
        f2Pressed = true;
        if (keyboardVisible) {
            keyboardVisible = false;
            container.style.display = "none";
        } else {
            keyboardVisible = true;
            container.style.display = "block";
        }
    }
});

document.addEventListener("keyup", function(e) {
    if (e.key === "F8") {
        f2Pressed = false;
    }
});


// Escucha los eventos de pulsación de teclas
document.addEventListener("keydown", function(e) {
    var key = document.querySelector("#key-" + e.key.toLowerCase());
    if (!key) {
        // Maneja especialmente la tecla de espacio y esc
        if (e.key === " ") {
            key = document.querySelector("#key-space");
        } else if (e.key === "Escape") {
            key = document.querySelector("#key-esc");
        }
    }
    if (key) {
        key.classList.add("active");
    }
});
document.addEventListener("keyup", function(e) {
    var key = document.querySelector("#key-" + e.key.toLowerCase());
    if (!key) {
        // Maneja especialmente la tecla de espacio y esc
        if (e.key === " ") {
            key = document.querySelector("#key-space");
        } else if (e.key === "Escape") {
            key = document.querySelector("#key-esc");
        }
    }
    if (key) {
        key.classList.remove("active");
    }
});

// Agrega estilo al teclado virtual
var style = document.createElement("style");
style.innerHTML = `
    .keyboard-container {
        position: fixed;
        top: 1%;
        left: 1%;
    }
    .keyboard {
        display: flex;
        flex-wrap: wrap;
    }
    .key {
        width: 35px;
        height: 35px;
        color: red;
        background: black;
        border: 1px solid black;
        margin-right: 10px;
        text-align: center;
        line-height: 50px;
        font-size: 13px;
    }
    .key#key-esc.active {
      background: white;
      color: black;
    }
    .key#key-space.active {
      background: pink;
      color: black;
    }
    .key#key-shift.active {
      background: #fc4b08;
      color: black;
    }
    .key#key-e.active {
      background: purple;
      color: black;
    }
    .key#key-q.active {
      background: red;
      color: black;
    }
    .key#key-2.active {
      background: #3e3e3e;
      color: white;
    }
    .keyboard {
      display: flex;
      flex-direction: column;
    }

    .key-row {
        display: flex;
        margin-bottom: 10px;
    }

`;
document.head.appendChild(style);
var emojiContainer = document.createElement("div");
emojiContainer.classList.add("emoji-container");
emojiContainer.style.display = "flex";
emojiContainer.style.justifyContent = "center";
emojiContainer.style.alignItems = "center";
emojiContainer.style.position = "fixed";
emojiContainer.style.bottom = "0";
emojiContainer.style.width = "100%";
emojiContainer.style.visibility = "hidden";

var emojis = [
    "🖤",
    "❤",
    "🐱‍👤",
    "😾",
    "🐢",
    "😂",
    "😘",
    "👀",
    "👻",
    "🤷‍♂️"
];

for (var i = 0; i < emojis.length; i++) {
    var emoji = document.createElement("div");
    emoji.classList.add("emojis");
    emoji.innerHTML = emojis[i];
    emoji.style.margin = "0 10px";
    emoji.style.fontSize = "15px";
    emoji.style.cursor = "pointer";
    emoji.addEventListener("click", function(e) {
        navigator.clipboard.writeText(e.target.innerHTML);
    });
    emojiContainer.appendChild(emoji);
}

document.body.appendChild(emojiContainer);

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        if (emojiContainer.style.visibility === "hidden") {
            emojiContainer.style.visibility = "visible";
        } else {
            emojiContainer.style.visibility = "hidden";
        }
        e.preventDefault();
    }
});

var element = document.querySelector("#orb-display");

// Modificamos el estilo CSS del elemento
element.style.opacity = "0.2";

var elemento = document.querySelector("#main-menu > div.mame-top-right-bar");

// Modificamos el estilo CSS del elemento
elemento.style.opacity = "0.5";

    // Seleccionamos el elemento con el selector "#main-menu > div.mame-bottom-left-bar"
var elemento2 = document.querySelector("#main-menu > div.mame-bottom-left-bar");

// Modificamos el estilo CSS del elemento
elemento2.style.opacity = "0.5";

// Agrega el contenedor de emojis a la página
document.body.appendChild(emojiContainer);
    const leaderboard = document.getElementById("leaderboard");
    if (!leaderboard) {
        return;
    }

    const copyButton = document.createElement("button");
copyButton.innerHTML = "Copy Leaderboard";
copyButton.style.backgroundColor = "#8B0000";
copyButton.style.color = "white";
copyButton.style.padding = "4px 4px";
copyButton.style.border = "none";
copyButton.style.borderRadius = "5px";
copyButton.style.cursor = "pointer";
copyButton.style.margin = "2px 0px";
copyButton.style.display = "block";

copyButton.addEventListener("click", function() {
  const leaderboardNicksHTML = document.querySelectorAll(".leaderboard-nick");
  const leaderboardNicksText = Array.from(leaderboardNicksHTML).map(el => el.innerHTML).join('\n \n');
  navigator.clipboard.writeText(leaderboardNicksText).then(function() {
    console.log("Copied leaderboard nicks information to clipboard");
    const message = document.createElement("div");
    message.innerHTML = "¡Bien! Ya Copié Los Nicks En Tu Portapapeles :)";
    message.style.backgroundColor = "red";
    message.style.color = "white";
    message.style.padding = "3px 3px";
    message.style.borderRadius = "5px";
    message.style.transition = "opacity 3s ease-out";
    message.style.opacity = "1";
    message.style.position = "fixed";
    message.style.bottom = "5px";
    message.style.left = "0px";
    message.style.right = "0px";
    message.style.margin = "auto";
    message.style.width = "fit-content";
    message.style.zIndex = "999";
    message.style.fontFamily = "cursive";
    message.style.textShadow = "1px 1px 2px black";
    document.body.appendChild(message);
    setTimeout(function() {
      message.style.opacity = "0";
    }, 1000);
    setTimeout(function() {
      document.body.removeChild(message);
    }, 4000);
  }, function(err) {
    console.error("Failed to copy leaderboard nicks information to clipboard", err);
  });
});

leaderboard.insertAdjacentElement("beforebegin", copyButton);

    var elementt = document.querySelector("#main-menu");

elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/3492868.gif')";
elementt.style.backgroundSize = "cover";
elementt.style.backgroundRepeat = "no-repeat";

    document.querySelector('#notifications').style.display = 'none';

    var buildInfo = document.querySelector("#build-info");
      if (buildInfo) {
    buildInfo.style.opacity = 0;
    }

    document.querySelector('#main-menu > img').src = 'https://i.imgur.com/tmbUf0S.png';

    var css = '.leaderboard-entry { background-color: rgb(0, 0, 0); color: #f00; display: flex; flex-direction: row; font-size: calc(8px + .5vh); margin-bottom: 3px; padding: 0 0 0 0.6vh; white-space: nowrap; }',
        head = document.head || document.getElementsByTagName('head')[0],
        customStyles = document.createElement('style');

    customStyles.type = 'text/css';
    if (customStyles.styleSheet){
        customStyles.styleSheet.cssText = css;
    } else {
        customStyles.appendChild(document.createTextNode(css));
    }

    head.appendChild(customStyles);

    var customCss = '.ls-background { height: 100%; object-fit: cover; content: url(https://i.kym-cdn.com/photos/images/original/002/304/278/d80.gif); transition: opacity .5s; width: 100%; }',
        miCabezal = document.head || document.getElementsByTagName('head')[0],
    miEstiloPersonalizado = document.createElement('style');

    miEstiloPersonalizado.type = 'text/css';
      if (miEstiloPersonalizado.styleSheet){
    miEstiloPersonalizado.styleSheet.cssText = customCss;
    } else {
    miEstiloPersonalizado.appendChild(document.createTextNode(customCss));
    }

    miCabezal.appendChild(miEstiloPersonalizado);

    var modificacionesCss = 'body { background-color: #000; color: #fff; font-family: Titillium Web,sans-serif; margin: 0; overflow: hidden; user-select: none; cursor: url(https://cdn.custom-cursor.com/db/cursor/32/Argentina_Flag_Cursor.png), url(https://cdn.custom-cursor.com/db/pointer/32/Argentina_Flag_Pointer.png), auto; }',
        cabecera = document.head || document.getElementsByTagName('head')[0],
        estilosModificados = document.createElement('style');

        estilosModificados.type = 'text/css';
    if (estilosModificados.styleSheet){
        estilosModificados.styleSheet.cssText = modificacionesCss;
    } else {
        estilosModificados.appendChild(document.createTextNode(modificacionesCss));
    }

cabecera.appendChild(estilosModificados);

var banner = document.createElement("div");
banner.style.width = "500px";
banner.style.height = "300px";
banner.style.background = "#686868";
banner.style.background = "url(https://thumbs.gfycat.com/ActiveElectricBuzzard-size_restricted.gif)";
banner.style.backgroundSize = "cover";
banner.style.position = "fixed";
banner.style.bottom = "387px";
banner.style.left = "50px";
banner.style.display = "none";
banner.style.opacity = "0.8";
banner.style.zIndex = "9999";

    var cmds = document.createElement("p");
cmds.style.color = "white";
cmds.style.textAlign = "left";
cmds.style.padding = "5px";
cmds.innerHTML = "Comandos disponibles: " +
    "<span style='color: red; text-shadow: 2px 2px 2px black; font-style: cursive; font-size: 15px; font-weight: bold'>" +
                 "play, super, ultra, war1, war2, inventory, shop, replay, config, na, eu, as, espect, developer, playlist, music, changeimage, rankings</span> " +
    "<br><br><span style='color: green; font-style: italic; font-size: 10px; font-weight: bold'> >Reproducir (En Beta)</span> " +
    "<br><br><span style='color: green; font-style: italic; font-size: 10px; font-weight: bold'> >ChangeSkin (En Desarrollo)</span> " +
    "<br><br><span style='color: green; font-style: italic; font-size: 10px; font-weight: bold'> >ChangeSkin2 (En Desarrollo)</span> " +
    "<br><br><span style='color: green; font-style: italic; font-size: 10px; font-weight: bold'> >ChangeNick (En Desarrollo)</span>"
    banner.appendChild(cmds);

// Crea un input de texto y le da un estilo CSS
var input = document.createElement("input");
input.type = "text";
input.style.width = "491px";
input.style.height = "19px";
input.style.background = "black";
input.style.color = "white";
input.style.position = "absolute";
input.style.bottom = "0";
input.style.left = "0";

// Agrega un controlador de eventos para evitar la propagación de eventos fuera del input
input.addEventListener("keydown", function(event) {
  event.stopPropagation();
});

var inputRex = document.createElement("input");
inputRex.type = "button";
inputRex.value = "rankings";
inputRex.style.width = "491px";
inputRex.style.height = "19px";
inputRex.style.background = "black";
inputRex.style.color = "white";
inputRex.style.position = "absolute";
inputRex.style.bottom = "0";
inputRex.style.left = "0";

document.addEventListener("keyup", function(event) {
if (event.keyCode === 45 && input.value.startsWith("rankings")) {
window.open("https://ryuten.io/season/beta5/rankings/", "_blank");
}
});

    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "ChangeSkin") {
    window.alert("Error: ChangeSkin No Funciona Por El Momento, En Desarrollo...");
    banner.style.display = "none";
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "ChangeSkin2") {
    window.alert("Error: ChangeSkin2 No Funciona Por El Momento, En Desarrollo...");
    banner.style.display = "none";
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "ChangeNick") {
    window.alert("Error: SkinNick No Funciona Por El Momento, En Desarrollo...");
    banner.style.display = "none";
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "play") {
    document.querySelector("#mame-play-btn").click();
    banner.style.display = "none";
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "eu") {
    document.querySelector("#mame-ssb-region-selector > div:nth-child(2)").click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "as") {
    document.querySelector("#mame-ssb-region-selector > div:nth-child(3)").click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "na") {
    document.querySelector("#mame-ssb-region-selector > div:nth-child(1)").click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "ultra") {
    document.querySelector("#mame-ssb-ms-list > div:nth-child(3) > div.mame-ssb-ms-item-mode-name").click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    input.addEventListener("keyup", function(event) {
  if (event.keyCode === 45 && event.target.value === "super") {
    document.querySelector("#mame-ssb-ms-list > div:nth-child(4) > div.mame-ssb-ms-item-mode-name").click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'espect') {
document.querySelector('#mame-spectate-btn').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
  if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'war1') {
    document.querySelector('#mame-ssb-ms-list > div:nth-child(1) > div.mame-ssb-ms-item-mode-name').click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    document.addEventListener('keyup', function(event) {
  if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'war2') {
    document.querySelector('#mame-ssb-ms-list > div:nth-child(2) > div.mame-ssb-ms-item-mode-name').click();
    setTimeout(function() {
      document.querySelector("#mame-spectate-btn").click();
        banner.style.display = "block";
    }, 0);
  }
});
    document.addEventListener('keyup', function(event) {
  if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeskin1') {
   document.querySelector('#change-skin-0').click();
   document.querySelector('#csm-skin-add').click();
  if (banner.style.display === "block") {
       banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
  if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeskin2') {
   document.querySelector('#change-skin-1').click();
   document.querySelector('#csm-skin-add').click();
  if (banner.style.display === "block") {
       banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'replay') {
document.querySelector('#mame-trb-replays-btn').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'config') {
document.querySelector('#mame-trb-settings-btn').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'inventory') {
document.querySelector('#mame-trb-inventory-btn').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'shop') {
document.querySelector('#mame-trb-shop-btn').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'menu') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'playlist') {
document.querySelector('body > button:nth-child(12)').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'developer') {
document.querySelector('body > button:nth-child(10)').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'music') {
document.querySelector('body > button:nth-child(11)').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'copyloaderboard') {
document.querySelector('#huds > div.huds-top-right > button').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage1') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/869910.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage2') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://images.hdqwalls.com/wallpapers/anime-girl-petting-dog-zh.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage3') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://cdn.wallpapersafari.com/51/58/rqpYKT.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage4') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpapercave.com/wp/wp2757949.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage5') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://cdn.wallpapersafari.com/18/78/4zeAP1.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage6') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpapercave.com/wp/wp6630058.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage7') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.pinimg.com/originals/99/bf/92/99bf926eab67f3b6b085d21ebd403965.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage8') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://cdn.wallpapersafari.com/76/28/HqzPwk.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage9') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7270381.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage10') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.pinimg.com/originals/c9/4c/e7/c94ce78d80c07480d25f7acafddc15d8.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage11') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/2641105.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage12') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://cdna.artstation.com/p/assets/images/images/049/456/834/original/moises-dimas-night-of-falling-stars-hd-2-wallpaper.gif?1652540104')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage13') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.redd.it/uwwte8wps4h91.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage14') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8351171.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage15') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.pinimg.com/originals/05/51/7e/05517ebd2de835de4f408e686a2206c8.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage16') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/1212254.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage17') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://images.hdqwalls.com/download/colorful-mountains-night-minimal-8k-w5-5120x2880.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage18') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/792.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage19') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://fondosmil.com/fondo/66135.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
     document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage20') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://marketplace.canva.com/EAFGjDKxWGQ/1/0/1600w/canva-green-%26-blue-illustrated-aesthetic-desktop-wallpaper-aw2KOhupUGI.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage21') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i0.wp.com/insider-gaming.com/wp-content/uploads/2022/11/ghost-mw2-game.jpg?fit=1920%2C1080&ssl=1')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage22') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/628807.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage23') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.pinimg.com/originals/19/5c/cf/195ccf1c6f16b4353f259502271aad39.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage24') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://rare-gallery.com/uploads/posts/4598606-minimalism-computer-hacking-quote-black-background-simple-background-text.jpg')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage25') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://media.tenor.com/GQFYjuX8S_8AAAAd/person-of-interest-reboot-admin-artificial-intelligence.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage26') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://i.imgur.com/9HWgsmp.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage27') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/3492868.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage28') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7270362.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage29') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088658.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage30') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/869923.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage31') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088669.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage32') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088672.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage33') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088678.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage34') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088679.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage35') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7270386.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage36') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088685.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage37') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088686.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage38') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088687.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage39') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7787798.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage40') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7951219.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage41') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/7270403.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage42') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088706.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage43') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8088703.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage44') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/2471356.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage45') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/5823110.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage46') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/8406766.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage47') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpaperaccess.com/full/2825810.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage48') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpapercave.com/wp/wp2757877.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage49') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpapercave.com/wp/wp2757950.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});
    document.addEventListener('keyup', function(event) {
if (event.keyCode === 45 && event.target.tagName === 'INPUT' && event.target.value === 'changeimage50') {
document.querySelector('#main-menu').click();
if (banner.style.display === "block") {
banner.style.display = "block";
    }
    elementt.style.backgroundImage = "url('https://wallpapercave.com/wp/wp2757967.gif')";
    elementt.style.backgroundSize = "cover";
    elementt.style.backgroundRepeat = "no-repeat";
   }
});

document.addEventListener("keyup", function(event) {
  if (event.code === "F9") {
    if (banner.style.display === "none") {
      banner.style.display = "block";
      input.value = "";
    } else {
      banner.style.display = "none";
    }
    input.focus();
  }
});
    (function() {
var elem = document.getElementById("mame-sib-settings-btn");
if (elem !== null) {
elem.style.display = "none";
}
})();

    var pinInput = document.getElementById("pin-input");
  pinInput.style.backgroundColor = "#222";
  pinInput.style.color = "green";
  pinInput.style.fontSize = "calc(4px + 1vh)";
  pinInput.style.padding = "0.15vh 0";
  pinInput.style.position = "absolute";
  pinInput.style.top = "100%";
  pinInput.style.width = "calc(40px + 4vw)";
  pinInput.style.visibility = "visible";
  pinInput.style.opacity = "1";

    var teaminput = document.getElementById("team-input");
  teaminput.style.backgroundColor = "rgb(255 0 146 / 23%)";
  teaminput.style.color = "#ffffff";

    var customCSS = `#main-menu > div.mame-top-right-bar > div.mame-trb-user-data-row-container, #main-menu > div.mame-top-right-bar > div.mame-trb-main-btns-container { opacity: 0.5; } `;

var customStyle = document.createElement('style');
customStyle.innerHTML = customCSS;
document.head.appendChild(customStyle);

    var custommCSS = `#main-menu > div.mame-top-right-bar > div.mame-trb-user-data-row-container, #main-menu > div.mame-top-right-bar > div.mame-trb-main-btns-container, #main-menu > div.mame-bottom-right-bar { opacity: 0.5; } `;

var custommStyle = document.createElement('style');
custommStyle.innerHTML = custommCSS;
document.head.appendChild(custommStyle);

banner.appendChild(input);
document.body.appendChild(banner)
        })();