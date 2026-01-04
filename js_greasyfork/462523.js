// ==UserScript==
// @name        music player for arras (beta)
// @namespace   its kinda workin out
// @match       *://arras.io/*
// @match       *://arrax.io/*
// @grant       none
// @version     2
// @author      onion
// @description pls no cringe for music choice. also change stuff as you please.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/462523/music%20player%20for%20arras%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462523/music%20player%20for%20arras%20%28beta%29.meta.js
// ==/UserScript==


//creating audio element
let audio = document.createElement('audio');
let audio1 = document.createElement('audio');
let nextthing = document.createElement('audio');
let uhm = document.createElement('audio');
let tetris = document.createElement('audio');
let rise = document.createElement('audio');
let sour = document.createElement('audio');
let ops = document.createElement('audio');
let efs = document.createElement('audio');
let erika = document.createElement('audio');
let vd = document.createElement('audio');
let reichstag = document.createElement('audio');
let ussr1 = document.createElement('audio');
let ussr2 = document.createElement('audio');
let ussr3 = document.createElement('audio');
var number = 1;
var elementp = document.createElement('style');
var sonata = document.createElement('audio');
var classical = document.createElement('audio');





let ps = document.createElement('button');
ps.style.backgroundColor = "transparent";
ps.style.width = "100%";
ps.style.height = "100%";
ps.style.pointerEvents = "none";
ps.style.position = "absolute";
ps.style.top = "0";
ps.style.left = "0";
ps.style.zIndex = "100000";




document.body.appendChild(ps);

//const canvas = document.querySelector("canvas");


if (!document.getElementById('jwd')) {
  var rect = document.createElement('div');
  rect.id = 'jwd';
  rect.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(0); width: 1000%; height: 50px; background-color: red; transform-origin: center; z-index: 1000000; opacity: 0.15; pointer-events: none;';
  document.body.style.cssText = 'cursor: crosshair !important; '
  // append the rectangle to the body
  //canvas.append(rect);
  document.body.append(rect);

  // calculate the rotation angle based on mouse position
  document.onmousemove = function(e) {
    var angle = Math.atan2(e.pageY - window.innerHeight/2, e.pageX - window.innerWidth/2);
    rect.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'rad)';
  };
};


//document.getElementById("#canvas").backgroundImage = "linear-gradient( 358.4deg, rgba(249,151,119,1) -2.1%, rgba(98,58,162,1) 90% );";

var sadsad = `
#canvas {
    backgroundImage: linear-gradient( 358.4deg, rgba(249,151,119,1) -2.1%, rgba(98,58,162,1) 90% );
}

`;

document.head.append(sadsad);












// Set sources
// classical music 2 hours
classical.src = "https://cdn.glitch.me/b1fc10cc-5b67-4847-88d6-c342a69adfee/videoplayback%20(7).m4a?v=1679525707955";
// moonlight sonata nightmare
sonata.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1088229398152491108/videoplayback_5.m4a";
// ussr anthem 1977 russian
ussr3.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084286826103181312/soviet-anthem.mp3";
// ussr anthem 1944 english
ussr2.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084286889831448626/soviet-anthem_en.mp3";
// ussr anthem 1944 russian
ussr1.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084286842473545799/soviet-anthem1944.mp3";
// national anthem of nazi germany
reichstag.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084285133269508157/de-naz.mp3";
// victory day russian ssr song
vd.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084202798733860986/yt5s.com_-_Eng_CC_Victory_Day___Soviet_Song_128_kbps.mp3";
// erika
erika.src = "https://cdn.discordapp.com/attachments/1068333890596524033/1084201573711888466/yt5s.com_-_German_Soldiers_Song_-__Erika__with_English_Subtitles_128_kbps.mp3";
// live a lie
efs.src = "https://cdn.discordapp.com/attachments/1009208113200631949/1081768386679279616/videoplayback_4.m4a";
// Rest
ops.src = 'https://cdn.discordapp.com/attachments/1009208113200631949/1081654159624900628/videoplayback_3.m4a';
// dont surrender
sour.src = 'https://cdn.discordapp.com/attachments/1009208113200631949/1081014554915504148/videoplayback_2.m4a';
// RISE
rise.src = "https://cdn.discordapp.com/attachments/1009208113200631949/1080989152620851250/videoplayback_1.m4a";
//take over
audio.src = 'https://cdn.discordapp.com/attachments/967213871267971072/1027416621318414406/8mb.video-Vf9-wfenD0dA.m4a';
//egzod royalty
audio1.src = 'https://cdn.discordapp.com/attachments/1068333890596524033/1089017554091126824/videoplayback_8.m4a';
//the fat rat
nextthing.src = 'https://cdn.discordapp.com/attachments/1009208113200631949/1076650551024033872/TheFatRat_-_Unity.mp3';
//tetris theme song
tetris.src = 'https://cdn.discordapp.com/attachments/1009208113200631949/1078813267440439336/Tetris.mp3';
// forgot lolz
uhm.src = 'https://cdn.discordapp.com/attachments/1009208113200631949/1076657096881348628/Rick_Astley_-_Never_Gonna_Give_You_Up_Official_Music_Video.mp3';
// Check if player already exists
let player = document.querySelector('.player');

if (!player) {
    // Create player
    player = document.createElement('div');
    player.className = 'player';

    // Create buttons
    let playButton = document.createElement('button');
    playButton.innerHTML = 'start';
    playButton.className = "btn";
    let pauseButton = document.createElement('button');
    pauseButton.innerHTML = 'pause';
    pauseButton.className = "btn";
    let endButton = document.createElement('button');
    endButton.innerHTML = 'end';
    endButton.className = "btn";
    let choicer = document.createElement('select');
    choicer.innerHTML = 'music';
    choicer.id = 'select';
    let option1 = document.createElement('option');
    option1.innerHTML = 'Take Over';
    option1.value = '1';
    option1.className = "btn";
    choicer.appendChild(option1);
    let option2 = document.createElement('option');
    option2.innerHTML = 'Royalty';
    option2.value = '2';
    option2.className = "btn";
    choicer.appendChild(option2);
    let option3 = document.createElement('option');
    option3.innerHTML = "The Fat Rat";
    option3.value = '3';
    option3.className = "btn";
    choicer.appendChild(option3);
    let option4 = document.createElement('option');
    option4.innerHTML = 'Rickroll';
    option4.value = '4';
    option4.className = "btn";
    choicer.appendChild(option4);
    let option5 = document.createElement('option');
    option5.innerHTML = 'Tetris';
    option5.value = '5';
    option5.className = "btn";
    choicer.appendChild(option5);
    let option6 = document.createElement('option');
    option6.innerHTML = 'RISE';
    option6.value = '6';
    option6.className = "btn";
    choicer.appendChild(option6);
    let option7 = document.createElement('option');
    option7.innerHTML = "Don't surrender.";
    option7.value = '7';
    option7.className = "btn";
    choicer.appendChild(option7);
    let option8 = document.createElement('option');
    option8.innerHTML = "Rest";
    option8.value = '8';
    option8.className = 'btn';
    choicer.appendChild(option8);
    let option9 = document.createElement('option');
    option9.innerHTML = "Live a Lie";
    option9.value = '9';
    option9.className = 'btn';
    choicer.appendChild(option9);
    let option10 = document.createElement('option');
    option10.innerHTML = "Erika";
    option10.value = '10';
    option10.className = 'btn';
    choicer.appendChild(option10);
    let option11 = document.createElement('option');
    option11.innerHTML = "Victory Day!";
    option11.value = '11';
    option11.className = 'btn';
    choicer.appendChild(option11);
    let option12 = document.createElement('option');
    option12.innerHTML = "卍";
    option12.value = '12';
    option12.className = 'btn';
    choicer.appendChild(option12);
    let option13 = document.createElement('option');
    option13.innerHTML = "USSR Anthem 1944 - Russian";
    option13.value = '13';
    option13.className = 'btn';
    choicer.appendChild(option13);
    let option14 = document.createElement('option');
    option14.innerHTML = "USSR Anthem 1944 - English";
    option14.value = '14';
    option14.className = 'btn';
    choicer.appendChild(option14);
    let option15 = document.createElement('option');
    option15.innerHTML = "USSR Anthem 1977 - Russian";
    option15.value = '15';
    option15.className = 'btn';
    choicer.appendChild(option15);
    let option16 = document.createElement('option');
    option16.innerHTML = "Moonlight Sonata Nightmare";
    option16.value = '16';
    option16.className = 'btn';
    choicer.appendChild(option16);
    let option17 = document.createElement('option');
    option17.innerHTML = "Classical Music 2 Hours";
    option17.value = '17';
    option17.className = 'btn';
    choicer.appendChild(option17);
    let credits = document.createElement('button');
    credits.id = 'credits';
    credits.className = "btn";
    credits.innerHTML = 'by onion';

    // Append buttons to player
    player.appendChild(choicer);
    player.appendChild(playButton);
    player.appendChild(pauseButton);
    player.appendChild(endButton);
    player.appendChild(credits);

    // Append player to document
    document.body.appendChild(player);

    // Set player to be on top of everything
    player.style.zIndex = 9999;
    player.style.position = 'fixed';
    player.style.top = 0;
    player.style.left = 0;
    credits.style.fontSize = '10';




    var visible = false;


    document.addEventListener("keydown", function (e) {
        if (e.key == "p") {
            if (visible) {
                playButton.style.display = 'none';
                pauseButton.style.display = 'none';
                endButton.style.display = 'none';
                visible = false;
            } else {
                playButton.style.display = 'unset';
                pauseButton.style.display = 'unset';
                endButton.style.display = 'unset';
                visible = true;
            };
        };
    });


    // Add event listeners
    playButton.addEventListener('click', () => {
        if (number == 1) {
            audio.play();
        } else if (number == 2) {
            audio1.play();
        } else if (number == 3) {
            nextthing.play();
        } else if (number == 4) {
            uhm.play();
        } else if (number == 5) {
            tetris.play();
        } else if (number == 6) {
            rise.play();
        } else if (number == 7) {
            sour.play();
        } else if (number == 8) {
            ops.play();
        } else if (number == 9) {
            efs.play();
        } else if (number == 10) {
            erika.play();
        } else if (number == 11) {
            vd.play();
        } else if (number == 12) {
            reichstag.play();
        } else if (number == 13) {
          ussr1.play();
        } else if (number == 14) {
          ussr2.play();
        } else if (number == 15) {
          ussr3.play();
        } else if (number == 16) {
          sonata.play();
        } else if (number == 17) {
          classical.play();
        }
    });

    pauseButton.addEventListener('click', () => {
        if (number == 1) {
            audio.pause();
        } else if (number == 2) {
            audio1.pause();
        } else if (number == 3) {
            nextthing.pause();
        } else if (number == 4) {
            uhm.pause();
        } else if (number == 5) {
          tetris.pause();
        } else if (number == 6) {
          rise.pause();
        } else if (number == 7) {
          sour.pause();
        } else if (number == 8) {
            ops.pause();
        } else if (number == 9) {
            efs.pause();
        } else if (number == 10) {
            erika.pause();
        } else if (number == 11) {
            vd.pause();
        } else if (number == 12) {
            reichstag.pause();
        } else if (number == 13) {
          ussr1.pause();
        } else if (number == 14) {
          ussr2.pause();
        } else if (number == 15) {
          ussr3.pause();
        } else if (number == 16) {
          sonata.pause();
        } else if (number == 17) {
          classical.pause();
        }
    });

    endButton.addEventListener('click', () => {
        if (number == 1) {
            audio.pause();
            audio.currentTime = 0;
        } else if (number == 2) {
            audio1.pause();
            audio1.currentTime = 0;
        } else if (number == 3) {
            nextthing.pause();
            nextthing.currentTime = 0;
        } else if (number == 4) {
            uhm.pause();
            uhm.currentTime = 0;
        } else if (number == 5) {
            tetris.pause();
            tetris.currentTime = 0;
        } else if (number == 6) {
            rise.pause();
            rise.currentTime = 0;
        } else if (number == 7) {
            sour.pause();
            sour.currentTime = 0;
        } else if (number == 8) {
            ops.pause();
            ops.currentTime = 0;
        } else if (number == 9) {
            efs.pause();
            efs.currentTime = 0;
        } else if (number == 10) {
            erika.pause();
            erika.currentTime = 0;
        } else if (number == 11) {
            vd.pause();
            vd.currentTime = 0;
        } else if (number == 12) {
            reichstag.pause();
            reichstag.currentTime = 0;
        } else if (number == 13) {
            ussr1.pause();
            ussr1.currentTime = 0;
        } else if (number == 14) {
            ussr2.pause();
            ussr2.currentTime = 0;
        } else if (number == 15) {
            ussr3.pause();
            ussr3.currentTime = 0;
        } else if (number == 16) {
            sonata.pause();
            sonata.currentTime = 0;
        } else if (number == 17) {
            classical.pause();
            classical.currentTime = 0;
    }
    });

    let playCount = 0;

    tetris.addEventListener('ended', () => {
      if (playCount < 2) {
        playCount++;
        tetris.currentTime = 0;
        tetris.play();
      }
    });



    var menu = document.getElementById("select");

    var selected_option = menu.options[menu.selectedIndex].value;

    menu.onchange = function () {
        number = parseInt(menu.value);
    }

} else {
    var visible = false;


    document.addEventListener("keydown", function (e) {
        if (e.key == "p") {
            if (visible) {
                playButton.style.display = 'none';
                pauseButton.style.display = 'none';
                endButton.style.display = 'none';
                visible = false;
            } else {
                playButton.style.display = 'unset';
                pauseButton.style.display = 'unset';
                endButton.style.display = 'unset';
                visible = true;
            };
        };
    });


    // Add event listeners



    var menu = document.getElementById("select");

    var selected_option = menu.options[menu.selectedIndex].value;

    menu.onchange = function () {
        number = parseInt(menu.value);
    }
}


const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.width = '50px';
progressBar.style.height = '3px';
progressBar.style.backgroundColor = '#29d';
progressBar.zIndex = 9999;
progressBar.margin = 'auto';

document.body.appendChild(progressBar);

let progress = 0;
let intervalId;
let isAnimating = false;

function startProgressBar() {
  if (!isAnimating) {
    isAnimating = true;
    intervalId = setInterval(() => {
      progress += 1;
      progressBar.style.width = `${progress}%`;
      if (progress === 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          progress = 0;
          progressBar.style.width = '0';
          isAnimating = false;
        }, 800);
      }
    }, 8);
  }
}

function resetProgressBar() {
  clearInterval(intervalId);
  progress = 0;
  progressBar.style.width = '0';
  isAnimating = false;
}

document.addEventListener('mousedown', (event) => {
  if (!isAnimating) {
    startProgressBar();
  }
});

document.addEventListener('mouseup', () => {
  resetProgressBar();
});

document.addEventListener('mouseleave', () => {
  resetProgressBar();
});










var cursor = document.createElement("div");
cursor.id = "custom-cursor";
cursor.style.zIndex = "218039732198";
document.body.appendChild(cursor);

// Add the custom cursor CSS to the page
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".custom-cursor { cursor: url('https://img.favpng.com/25/12/17/portable-network-graphics-clip-art-image-transparency-computer-icons-png-favpng-Cz19qWQrGKt8RD7RE6Yn42Xr5.jpg'), auto; position: fixed; width: 30px; height: 30px; z-index: 9999; }";
document.head.appendChild(css);
// Update the position of the custom cursor on mouse move
document.addEventListener("mousemove", function(e) {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});