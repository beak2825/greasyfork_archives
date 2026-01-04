// ==UserScript==
// @name         Waza Mod by Tyulik
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Keys M=pandou ,J=Bear, N=Polar
// @author       Tyulik
// @match        *://moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476034/Waza%20Mod%20by%20Tyulik.user.js
// @updateURL https://update.greasyfork.org/scripts/476034/Waza%20Mod%20by%20Tyulik.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// document.getElementById("gameUI").style.backgroundImage = "url('')";
// document.getElementById("mainMenu").style.backgroundImage = "url('')";
document.getElementById('enterGame').innerHTML = '⚔️👾 PLAY 👾⚔️';
document.getElementById('loadingText').innerHTML = 'Loading...';
document.getElementById('loadingText').style.color = "rgb(128, 128, 128)"
document.getElementById('nameInput').placeholder = "Welcome ☝️";




//nameInput

function cambiarColor() {
    var elemento = document.getElementById("nameInput");
    var colores = ["red", "blue", "green", "orange", "purple"];
    var colorActual = elemento.style.color;
    var nuevoColor;

    do {
        nuevoColor = colores[Math.floor(Math.random() * colores.length)];
    } while (nuevoColor === colorActual);

    elemento.style.color = nuevoColor;
}

setInterval(cambiarColor, 1000); // Cambia el color cada segundo (1000 ms)

//nameInput

document.getElementById('chatBox').placeholder = "🈂️Hi🈂️";
document.getElementById('diedText').innerHTML = '⚠️ You Died! ⚠️';
document.getElementById('diedText').style.color = "Purple";

document.getElementById("storeHolder").style = "height: 200px; width: 400px;"


document.getElementById("enterGame").style.color="blue";



document.getElementById("leaderboard").style.color = "Cyan";





document.getElementById("setupCard").style.color = "P";
document.getElementById("gameName").innerHTML = "👻 WAZA MOD. io 👻"
document.getElementById("gameName").style.color="rgb(128, 128, 128)"
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "Orange";

document.getElementById("enterGame").style.color="Cyan";


let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);

setInterval(() => window.follmoo && follmoo(), 10);


    var ID_PandouHead = 36;
    var ID_BearHead = 37;
    var ID_PolarHead = 44;



    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_PandouHead);
        }
        else if (e.keyCode === 74 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BearHead);
        }
        else if (e.keyCode === 78 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_PolarHead);
        }
       

        });


//BarbarianArmor
document.addEventListener("keydown", function(e) {
  // Verificamos si la tecla presionada es "v" (código 86) y el elemento enfocado no es "chatbox"
  if (e.keyCode === 86 && document.activeElement.id.toLowerCase() !== 'chatbox') {
    // Realizar la acción que deseas aquí
    console.log("La tecla 'v' se presionó y el elemento enfocado no es 'chatbox'.");
    // Puedes llamar a una función o realizar cualquier acción adicional aquí.
  }
});



 //TurretScrool---------------------------------------------------
    document.addEventListener("mousedown", function(e) {
       if (e.button === 1) { // scrool
       if (document.activeElement.id.toLowerCase() !== 'chatbox') {
       storeEquip(ID_TurretGear);
       }
   }
});






// Sound kill -------------------------------------------------------------------------------------------------
(function() {
    'use strict';
     //sound : dosiento a casa malo
  var WazaMod = new Audio("https://dl.dropbox.com/scl/fi/2830z3l7qkkcu6dgvfomw/Dosiento-a-casa-malo.aac?rlkey=tqh1dg7m0bugc4muzxek97ubo&dl=0");

var kills = 0;

setInterval(getkills, 100);

function getkills(){
    var count = parseInt(document.getElementById("killCounter").innerText);
    if(count > kills){
	WazaMod.play();
    }
    kills = count;
}
})();

//---------------------





//Sound n2

// Crea un elemento de audio



//----------------------


// sound >>>  https://dl.dropbox.com/scl/fi/de3hfdsw55ou6ljpq4dqf/Eminem-Venom-Lyrics.m4a?rlkey=3yxrps4msts2gnxbbbpcaixtu&dl=0
//            https://dl.dropbox.com/scl/fi/h4k3rjjcd21f98m3kc5oj/Duro_2_horas_-_Faraon_Love_Shady_Video_Oficial.mp3?rlkey=0j7634yy89a8cb7119kk7f6tc&dl=0
//            https://dl.dropbox.com/scl/fi/9fl583mobutd0fawpogos/ssstik.io_1695104086536.mp3?rlkey=rgvxnk9ydddc6ob930mhmv95h&dl=0

const audioElement = new Audio();
let isPlaying = false;

// Lista de enlaces directos a tus audios para la combinación "P" y "Ñ"
const audioUrlsPÑ = [
  'https://dl.dropbox.com/scl/fi/de3hfdsw55ou6ljpq4dqf/Eminem-Venom-Lyrics.m4a?rlkey=3yxrps4msts2gnxbbbpcaixtu&dl=0',
  'https://dl.dropboxusercontent.com/scl/fi/hwdtn69gkb5ablyilzz99/KORDHELL-MURDER-IN-MY-MIND-256-kbps.mp3?rlkey=jx3m1kzzyv9dlvn8jiyyibws8&dl=0',
  'https://dl.dropboxusercontent.com/scl/fi/sf34vlff3oqvkurdew5iw/ostcountry-naruto-the-raising-fighting-spirit-extended.m4a?rlkey=3ygov3d216nyjjzz15iamjwpb&dl=0',
  'https://dl.dropbox.com/scl/fi/bfemrewp2ue96t6zy2a63/432209531603.m4a?rlkey=g8y96ovr1ijc7gr7sd81csf6x&dl=0',
  // Agrega más enlaces directos a tus audios aquí
];

// Lista de enlaces directos a tus audios para la combinación "L" y "Ñ"
const audioUrlsLÑ = [
  'https://dl.dropbox.com/scl/fi/9fl583mobutd0fawpogos/ssstik.io_1695104086536.mp3?rlkey=rgvxnk9ydddc6ob930mhmv95h&dl=0',
  'https://dl.dropboxusercontent.com/scl/fi/c5m6qza9wvx9z1go4t73s/AUD-20230221-WA0010.mp3?rlkey=8ijrb9ghyefic3s7rbh7p0ncv&dl=0',
  'https://dl.dropbox.com/scl/fi/jmgco2m9bjn8vkdv1l7wx/S3RL-Hentai.mp3?rlkey=qmewg8grpcbig3ia2pcg8trgl&dl=0',
  'https://dl.dropbox.com/scl/fi/9fl583mobutd0fawpogos/ssstik.io_1695104086536.mp3?rlkey=rgvxnk9ydddc6ob930mhmv95h&dl=0',
  'https://dl.dropboxusercontent.com/scl/fi/q5m8zmec03o9d1ulv5gt1/Baka-Hentai-Remix-River-Flows-In-You-Onii-Chan.mp3?rlkey=sxjg7vtlgdkpivsfx78refg2l&dl=0',
  'https://dl.dropbox.com/scl/fi/h4k3rjjcd21f98m3kc5oj/Duro_2_horas_-_Faraon_Love_Shady_Video_Oficial.mp3?rlkey=0j7634yy89a8cb7119kk7f6tc&dl=0',
  // Agrega más enlaces directos a tus audios aquí
];

// Variables para el estado de las teclas "P", "Ñ", "L", "M" y "K"
let pKeyPressed = false;
let nKeyPressed = false;
let lKeyPressed = false;
let mKeyPressed = false;
let kKeyPressed = false;

// Función para reproducir un audio aleatorio con la combinación "P" y "Ñ"
function playAudioPÑ() {
  if (isPlaying) {
    audioElement.pause(); // Pausa la reproducción actual
    isPlaying = false;
  } else {
    const randomIndex = Math.floor(Math.random() * audioUrlsPÑ.length);
    const audioUrl = audioUrlsPÑ[randomIndex];
    audioElement.src = audioUrl; // Establece la fuente del audio
    audioElement.play(); // Reproduce el audio
    isPlaying = true;
  }
}

// Función para reproducir un audio específico con la combinación "L" y "Ñ"
function playAudioLÑ(audioIndex) {
  if (audioIndex >= 0 && audioIndex < audioUrlsLÑ.length) {
    const randomIndex = Math.floor(Math.random() * audioUrlsLÑ.length);
    const audioUrl = audioUrlsLÑ[randomIndex];
    audioElement.src = audioUrl; // Establece la fuente del audio
    audioElement.play(); // Reproduce el audio
    isPlaying = true;
  }
}

// Agrega un event listener para la tecla "P" (código numérico 80)
window.addEventListener('keydown', function(event) {
  if (event.key === 'P' || event.key === 'p') {
    pKeyPressed = true;
    checkPlayCondition();
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'P' || event.key === 'p') {
    pKeyPressed = false;
    checkPlayCondition();
  }
});

// Agrega un event listener para la tecla "Ñ" (código numérico 186)
window.addEventListener('keydown', function(event) {
  if (event.key === 'Ñ' || event.key === 'ñ') {
    nKeyPressed = true;
    checkPlayCondition();
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'Ñ' || event.key === 'ñ') {
    nKeyPressed = false;
    checkPlayCondition();
  }
});

// Función para verificar si las teclas "P" y "Ñ" están presionadas al mismo tiempo y reproducir un audio PÑ
function checkPlayCondition() {
  if (pKeyPressed && nKeyPressed) {
    playAudioPÑ();
  }
}

// Agrega un event listener para la tecla "L" (código numérico 76)
window.addEventListener('keydown', function(event) {
  if (event.key === 'L' || event.key === 'l') {
    lKeyPressed = true;
    checkPlayConditionLÑ();
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'L' || event.key === 'l') {
    lKeyPressed = false;
    checkPlayConditionLÑ();
  }
});

// Función para verificar si las teclas "L" y "Ñ" están presionadas al mismo tiempo y reproducir un audio LÑ
function checkPlayConditionLÑ() {
  if (lKeyPressed && nKeyPressed) {
    // Reproduce un audio específico con la combinación "L" y "Ñ"
    playAudioLÑ(0); // Puedes cambiar el índice para reproducir diferentes audios de la lista
  }
}

// Agrega un event listener para la tecla "M" (código numérico 77)
window.addEventListener('keydown', function(event) {
  if (event.key === 'M' || event.key === 'm') {
    mKeyPressed = true;
    checkStopCondition();
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'M' || event.key === 'm') {
    mKeyPressed = false;
    checkStopCondition();
  }
});

// Agrega un event listener para la tecla "K" (código numérico 75)
window.addEventListener('keydown', function(event) {
  if (event.key === 'K' || event.key === 'k') {
    kKeyPressed = true;
    checkStopCondition();
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'K' || event.key === 'k') {
    kKeyPressed = false;
    checkStopCondition();
  }
});

// Función para verificar si las teclas "M" y "K" están presionadas al mismo tiempo y detener la reproducción
function checkStopCondition() {
  if (mKeyPressed && kKeyPressed) {
    audioElement.pause(); // Pausa la reproducción
    isPlaying = false;
  }
}








$('#leaderboard').append('👻Wazaa...👻');
