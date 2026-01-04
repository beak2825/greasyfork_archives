// ==UserScript==
// @name         HoulzMP
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Mope.io Extension!
// @author       Houlz
// @icon https://cdn.discordapp.com/attachments/743063977780838451/757994733749534880/rabbit.png
// @match        *://mope.io/*
// @match        *://beta.mope.io/*
// @match        *://m0pe.io/*
// @match        *://learninganimals.club/
// @match        *://tailbite.me/
// @grant          GM_setValue
// @grant          GM_getValue
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js?version=843639
// ==/UserScript==
/*
MIT License

Você não está autorizado a editar esta extensão!
*/

document.title = 'HoulzMP - mope.io'; // Título da página

document.getElementById("logo").src = "https://media.discordapp.net/attachments/759451393630142508/759453090688270349/Novo_Projeto_3.png?width=350&height=99";

// Adblock
var div = document.getElementById("preroll");
div.parentNode.removeChild(div);
var div = document.getElementById("appAdIOS");
div.parentNode.removeChild(div);
var div = document.getElementById("appAdAndroid");
div.parentNode.removeChild(div);

var div1 = document.getElementById("moneyRectBottomWrap");
div1.style.visibility = "hidden";
var div = document.getElementById("moneyRectWrap");
div.style.visibility = "hidden";
// Adblock

// Nicks Padrões
var nicksp = document.getElementById("moneyRectBottomWrap");
nicksp.innerHTML = `<div id="HZ_Tip" style="display: none; margin-left: -175px; margin-bottom: 300px; max-width: 350px; background: #00000030; color: #fec842; font-size: 18px; text-align: center; text-shadow: 1px 1px 4px #000; text-align-last: center;"><span>Nicks padrões: 
<span onclick="document.getElementById(\'nickInput\').value = \'ᴴᵒᵘˡᶻ\'" style="color: #ffff1e; text-decoration: underline; cursor: pointer;">ᴴᵒᵘˡᶻ</span></span>,  
<span onclick="document.getElementById(\'nickInput\').value = \'𝙷 𝙾 𝚄 𝙻 𝚉\'" style="color: #ffff1e; text-decoration: underline; cursor: pointer;">𝙷 𝙾 𝚄 𝙻 𝚉</span>, 
<span onclick="document.getElementById(\'nickInput\').value = \'𝐻𝑜𝓊𝓁𝓏\'" style="color: #ffff1e; text-decoration: underline; cursor: pointer;">𝐻𝑜𝓊𝓁𝓏</span></br>
<span onclick="document.getElementById(\'nickInput\').value = \'☷␚₩₳₹≝ʟᴀʀɪɴʜᴀᴀ\'" style="color: white; text-decoration: underline; cursor: pointer;">☷␚₩₳₹≝ʟᴀʀɪɴʜᴀᴀ</span>,
<span onclick="document.getElementById(\'nickInput\').value = \'☷␚₩₳₹≝ᗰᗩƬƬʳᵉᵃˡ\'" style="color: white; text-decoration: underline; cursor: pointer;">☷␚₩₳₹≝ᗰᗩƬƬʳᵉᵃˡ</span></br>
<span onclick="document.getElementById(\'nickInput\').value = \'☷␚₩₳₹≝ᙖᖇᗩⅤᕮᶠᵈˢ\'" style="color: white; text-decoration: underline; cursor: pointer;">☷␚₩₳₹≝ᙖᖇᗩⅤᕮᶠᵈˢ</span>,
<span onclick="document.getElementById(\'nickInput\').value = \'☷␚₩₳₹≝ | Ҝเllєק\'" style="color: white; text-decoration: underline; cursor: pointer;">☷␚₩₳₹≝ | Ҝเllєק</span>
<span onclick="document.getElementById(\'nickInput\').value = \'☷␚₩₳₹≝~ℓυαηα...\'" style="color: white; text-decoration: underline; cursor: pointer;">☷␚₩₳₹≝~ℓυαηα...</span>,
<span onclick="document.getElementById(\'nickInput\').value = \'๖̶ζ̱̄͡ᎢᎥᏵᎯᏒ༻👑\'" style="color: white; text-decoration: underline; cursor: pointer;">๖̶ζ̱̄͡ᎢᎥᏵᎯᏒ༻👑</span>`;
// 橱ͥͨͧ̊́ͧ̒̔ͯ̄ͬ͛̌ͧ
// ๖̶ζ̱̄͡ᎢᎯᏵᎥᏒ༻👑֛

window.addEventListener('keydown', (event) => {
    if(event.key === 'F8') {
        event.preventDefault()
        nicknames();
    }
});

function nicknames() {
	div1.style.visibility = "visible";
    var togglemenu = document.getElementById("HZ_Tip")
    if(togglemenu.style.display == "none") {
        togglemenu.style.display = "block";
    } else {
   	if(togglemenu.style.display == "block") {
        togglemenu.style.display = "none";
    }
}
};
// Nicks Padrões

// Cursor Padrão
var cursor = document.getElementById("startMenuWrapper");
var cursor_GameArea = document.getElementById("gameAreaWrapper");
cursor.style.cursor = "url(https://tobiasahlin.com/static/cursors/default.png), pointer";
cursor_GameArea.style.cursor = "url(https://tobiasahlin.com/static/cursors/default.png), pointer";
// Cursor Padrão

// Evento Teste
window.addEventListener('keydown', (event) => {
    if(event.key === 'F1') {
        event.preventDefault()
        evento1();
    }
});
        
function evento1() {
	console.log(lbData)
	alert("Aperte F12 para ir ao console e copiar os nicknames do top!")
};
// Evento Teste


// Cursores
function cursor_default() {
    var cursor = document.getElementById("startMenuWrapper");
    var cursor_GameArea = document.getElementById("gameAreaWrapper");
    cursor.style.cursor = "url(https://tobiasahlin.com/static/cursors/default.png), pointer";
    cursor_GameArea.style.cursor = "url(https://tobiasahlin.com/static/cursors/default.png), pointer";
    customtxt("#fec842","Cursor Nº 1 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad1') {
        event.preventDefault()
        cursor_default();
    }
});

function cursor_2() {
    var cursor2 = document.getElementById("startMenuWrapper");
    var cursor2_GameArea = document.getElementById("gameAreaWrapper");
    cursor2.style.cursor = "url(https://flyordie.io/images/cursor.png), pointer";
    cursor2_GameArea.style.cursor = "url(https://flyordie.io/images/cursor.png), pointer";
    customtxt("#fec842","Cursor Nº 2 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad2') {
        event.preventDefault()
        cursor_2();
    }
});

function cursor_3() {
    var cursor3 = document.getElementById("startMenuWrapper");
    var cursor3_GameArea = document.getElementById("gameAreaWrapper");
    cursor3.style.cursor = "url(https://cdn.discordapp.com/attachments/736975202843361300/741715542456401990/Arrow9.png), pointer";
    cursor3_GameArea.style.cursor = "url(https://cdn.discordapp.com/attachments/736975202843361300/741715542456401990/Arrow9.png), pointer";
    customtxt("#fec842","Cursor Nº 3 foi definido!",'630px')
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'Numpad3') {
          event.preventDefault()
          cursor_3();
      }
  });

function cursor_4() {
    var cursor4 = document.getElementById("startMenuWrapper");
    var cursor4_GameArea = document.getElementById("gameAreaWrapper");
    cursor4.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/761353495738712064/Sniper-Aim.png), pointer";
    cursor4_GameArea.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/761353495738712064/Sniper-Aim.png), pointer";
    customtxt("#fec842","Cursor Nº 4 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad4') {
        event.preventDefault()
        cursor_4();
    }
});

function cursor_5() {
    var cursor5 = document.getElementById("startMenuWrapper");
    var cursor5_GameArea = document.getElementById("gameAreaWrapper");
    cursor5.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/768080634224443412/Yellow-Normal.png), pointer";
    cursor5_GameArea.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/768080634224443412/Yellow-Normal.png), pointer";
    customtxt("#fec842","Cursor Nº 5 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad5') {
        event.preventDefault()
        cursor_5();
    }
});

function cursor_6() {
    var cursor6 = document.getElementById("startMenuWrapper");
    var cursor6_GameArea = document.getElementById("gameAreaWrapper");
    cursor6.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770662588924952576/normal-select.png), pointer";
    cursor6_GameArea.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770662588924952576/normal-select.png), pointer";
    customtxt("#fec842","Cursor Nº 6 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad6') {
        event.preventDefault()
        cursor_6();
    }
});

function cursor_7() {
    var cursor7 = document.getElementById("startMenuWrapper");
    var cursor7_GameArea = document.getElementById("gameAreaWrapper");
    cursor7.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770663413796962314/RPG-Style-Arrow.png), pointer";
    cursor7_GameArea.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770663413796962314/RPG-Style-Arrow.png), pointer";
    customtxt("#fec842","Cursor Nº 7 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad7') {
        event.preventDefault()
        cursor_7();
    }
});

function cursor_8() {
    var cursor8 = document.getElementById("startMenuWrapper");
    var cursor8_GameArea = document.getElementById("gameAreaWrapper");
    cursor8.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770662429486088192/DDScurserlinkselect.png), pointer";
    cursor8_GameArea.style.cursor = "url(https://media.discordapp.net/attachments/759451393630142508/770662429486088192/DDScurserlinkselect.png), pointer";
    customtxt("#fec842","Cursor Nº 8 foi definido!",'630px')
}

window.addEventListener('keydown', (event) => {
    if(event.code === 'Numpad8') {
        event.preventDefault()
        cursor_8();
    }
});
// Cursores

// Fechar Updates
var fecharupdates = document.getElementById("appsDiv");
fecharupdates.innerHTML = `<a> 
    <button id="fecharupdates" 
        style="visibility:visible">Fechar Updates</button> </a>`

document.getElementById("fecharupdates").style.width = "100px";
document.getElementById("fecharupdates").style.height = "30px";

document.getElementById("fecharupdates").onclick = function() {
    var abc = document.getElementById("updates");
    var def = document.getElementById("ytDiv");
    abc.style.visibility = "hidden";
    def.remove();
}
// Fechar Updates

// Abrir Updates
var botton1 = `
    <button id="botao1" 
        style="visibility:visible">Abrir Updates</button> </a>`
$("#appsDiv").append(botton1);

document.getElementById("botao1").style.width = "100px";
document.getElementById("botao1").style.height = "30px";

document.getElementById("botao1").onclick = function() {
    var abc = document.getElementById("updates");
    abc.style.visibility = "visible";
}
// Abrir Updates

// Alerta no jogo
var displayElement = document.createElement("CustomTXT");

function customtxt(color,TXT,ismiddle) {

  displayElement.style.padding = "5px";
  displayElement.style.font = "25px Arial";
  displayElement.style.display = "block";
  displayElement.style.position = "fixed";
  displayElement.style.top = "100px";
  displayElement.style.left = ismiddle;
  displayElement.style.color = color
  displayElement.style.outline.width = "5px";
  displayElement.style.outline = "black";
	displayElement.style.textShadow = "1px 1px #000";
  displayElement.textContent = TXT


  setTimeout(function(){displayElement.textContent = ""}, 3000);

 document.body.appendChild(displayElement);
}
// Alerta no jogo

// Zoom
var zoom = 5; // 2.064
var zoomenabled = false;

camzoom = 26
function zoomout(zoom) {
  if (!zoomenabled) return;
  a0_0x3293e6 = zoom;
  camzoom_n = zoom;
  // a0_0x3293e6 = camzoom_n * 1.2;
  // a0_0x3293e6 = (1.2 * a0_0x3293e6 + camzoom_n) / camzoom;
}

window.addEventListener("wheel", function(event) {
  if (event.deltaY < 0) { //скорось зума
    zoom = zoom + 0.1; // 0.1 //скорость зума

    //зум
  } else if (event.deltaY > 0) { //скорось зума
    zoom = zoom - 0.1; // 0.1 //скорось зума
    //зум
  }
});

document.addEventListener("keydown", function(e) {
  var key = e.keyCode || e.which;
  switch (key) {
    case 226:
      zoom = 2.7; //2.064

      if (zoomenabled == false) {
        zoomenabled = true;

    customtxt("#fec842","Zoom Ativado!",'680px')
      } else {
        zoomenabled = false;
    customtxt("#fec842","Zoom Desativado!",'680px')
      }
      break;
  }
});

setInterval(function() {
  if (!zoomenabled) return;
  zoomout(zoom);
  if (zoom < 0.1) {
    zoom = 0.11;
  }
}, 1);

camzoom = 26
// Zoom

// Bloquear Movimento
setTimeout(function() { // esc key
a0_0x3366db = true; // esc key
}, 5000); // esc key

setTimeout(function() { // esc key
a0_0x2e97fb() = true; // esc key
}, 5000); // esc key
// Bloquear Movimento

// Montanhas Transparentes
function updatetransparent() {
    a0_0x72fc96 = "#09992F69";
    a0_0x344b70 = "#8c968865";
    a0_0x344b70 = "#8c968865";
    a0_0x51c389 = "#c6701965";
    a0_0x2b5b37 = "#007ec065";
    a0_0x1f138d = "#8c968865";
    a0_0x4baed9 = "#09992f65";
    a0_0x5a1444 = "#a5921565";
    a0_0x4cfb77 = "#8ccef465";
    a0_0x3695b7 = "#cf625965";
    a0_0x51c389 = "#C6701965";
    a0_0x11e326 = "#87805365",
  Chat_Hotkeys = !0,
  a0_0x12fc5e = true;
}

function updateall() {
  updatetransparent();
}

setTimeout(function() {
  updateall();
}, 5000);
// Montanhas Transparentes

function showfullscreen() {
  document.fullscreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.documentElement.webkitRequestFullScreen;

  function requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }
  if (document.fullscreenEnabled) {
    requestFullscreen(document.documentElement);
  }
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  function read(url) {
    return new Promise(resolve => {
      fetch(url)
        .then(res => res.text())
        .then(res => {
          return resolve(res);
        });
    });
  }
  //хз чо написать
}

/*
// Auto-Chat

// Primeiro
function chat1() {
  newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("gg")["length"]),
  newMsg.writeUInt8(19),
  newMsg.writeString("gg"),
  a0_0x45d323(newMsg);
  newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("lol")["length"]),
  newMsg.writeUInt8(19),
  newMsg.writeString("lol"),
  a0_0x45d323(newMsg);
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'F2') {
          event.preventDefault()
          chat1();
      }
  });
// Primeiro

// Segundo
function chat2() {
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅"),
                a0_0x45d323(newMsg);
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'F10') {
          event.preventDefault()
          chat2();
      }
  });
// Segundo

// Terceiro
function chat3() {
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝ᙖᖇᗩⅤᕮᶠᵈˢ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝ᙖᖇᗩⅤᕮᶠᵈˢ"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝ʟᴀʀɪɴʜᴀᴀ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝ʟᴀʀɪɴʜᴀᴀ"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝ | Ҝเllєק")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝ | Ҝเllєק"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝  ℱβƗ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝  ℱβƗ"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝𝒯ℋℰ𝒰𝒳")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝𝒯ℋℰ𝒰𝒳"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝ᗰᗩƬƬʳᵉᵃˡ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝ᗰᗩƬƬʳᵉᵃˡ"),
                a0_0x45d323(newMsg);
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'Minus') {
          event.preventDefault()
          chat3();
      }
  });
// Terceiro

// Quarto
function chat4() {
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("☷␚₩₳₹≝σσƒ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("☷␚₩₳₹≝σσƒ"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("ŞƤƗ₣₣¥ᵃᵐ☭")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("ŞƤƗ₣₣¥ᵃᵐ☭"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("ˢᴬᴰ        ᴿʸᴬᴺ")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("ˢᴬᴰ        ᴿʸᴬᴺ"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("🍁Ł-𝕯яαgσ🐉")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("🍁Ł-𝕯яαgσ🐉"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("๖̶ζ̱̄͡ᎢᎥᏵᎯᏒ༻👑")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("๖̶ζ̱̄͡ᎢᎥᏵᎯᏒ༻👑"),
                a0_0x45d323(newMsg);
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'Equal') {
          event.preventDefault()
          chat4();
      }
  });
// Quarto

// Lag
function lag() {
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("a")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("a"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("lag")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("lag"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("freeze")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("freeze"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("freeze")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("freeze"),
                a0_0x45d323(newMsg);
                newMsg = new a0_0x2c0987(3 + a0_0x4cbbe0("wtf")["length"]),
                newMsg.writeUInt8(19),
                newMsg.writeString("wtf"),
                a0_0x45d323(newMsg);
}

  window.addEventListener('keydown', (event) => {
      if(event.code === 'NumpadDivide') {
          event.preventDefault()
          lag();
      }
  });
// Lag

// Auto-Chat
*/