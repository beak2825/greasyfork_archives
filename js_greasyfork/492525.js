// ==UserScript==
// @name        Sploop.io-Modifications [ CactusMod ] -
// @namespace    -
// @version     1.0.0
// @description Cactus's are cool
// @author        cactus
// @match        *://sploop.io/*
// @grant        none
// @icon         https://i.imgur.com/1lJkd0L.png
// @downloadURL https://update.greasyfork.org/scripts/492525/Sploopio-Modifications%20%5B%20CactusMod%20%5D%20-.user.js
// @updateURL https://update.greasyfork.org/scripts/492525/Sploopio-Modifications%20%5B%20CactusMod%20%5D%20-.meta.js
// ==/UserScript==


document.title = 'Cactus.io - Cactus Mod';
document.querySelector("link[rel='icon']").href = "https://i.imgur.com/1lJkd0L.png";
document.getElementById("logo").src = "https://svgur.com/i/15Mw.svg";



//
var FPS,cps = 0,Mcps = 0,Hue = 0;
(function() {
    var UPDATE_DELAY = 700;
    var lastUpdate = 0;
    var frames = 0;
    var pingValue = 0;
    function updateCounter() {
        var now = Date.now();
        var elapsed = now - lastUpdate;
        if (elapsed < UPDATE_DELAY) {
            ++frames;
        } else {
            FPS = Math.round(frames / (elapsed / 1000));
            frames = 0;
            lastUpdate = now;
        }
        requestAnimationFrame(updateCounter);
    }
    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
})();
document.addEventListener("mousedown", click, false);
document.addEventListener("mouseup", endclick, false);
function click(e) {
    if (e.button == 0 || 1 || 2) {
        cps++
        setTimeout(() => {
            cps--
        }, 900);
    }
    if (e.button == 0) { document.getElementById("LeftClick").style.backgroundColor = "white";}
    if (e.button == 2) { document.getElementById("RightClick").style.backgroundColor = "white";}
}
function endclick(e) {
    if (e.button == 0) {document.getElementById("LeftClick").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.button == 2) {document.getElementById("RightClick").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
}
document.addEventListener('keydown', (e)=>{
    if (e.keyCode == 32) {document.getElementById("SpaceBar").style.backgroundColor = "white";}
    if (e.keyCode == 87) {document.getElementById("keyW").style.backgroundColor = "white";}
    if (e.keyCode == 65) {document.getElementById("keyA").style.backgroundColor = "white";}
    if (e.keyCode == 83) {document.getElementById("keyS").style.backgroundColor = "white";}
    if (e.keyCode == 68) {document.getElementById("keyD").style.backgroundColor = "white";}
})
document.addEventListener('keyup', (e)=>{
    if (e.keyCode == 32) {document.getElementById("SpaceBar").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 87) {document.getElementById("keyW").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 65) {document.getElementById("keyA").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 83) {document.getElementById("keyS").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 68) {document.getElementById("keyD").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
})

setInterval(() => {
    if (cps > Mcps) Mcps = cps
    Hue += Math.random() * .4
    Show.style.color = `white`
    Panel.style.color = `hsl(${Hue}, 100%, 70%)`
    Creator.style.color = `hsl(${Hue}, 100%, 70%)`
    Show.innerHTML = `${FPS}FPS<br>${cps}CPS<br>${Mcps}MCPS`
}, 0);
let Show = document.createElement("div");
Show.id = "SHOW"
document.body.prepend(Show);
let Panel = document.createElement("div");
let Creator = document.createElement('div');

Creator.innerHTML = `
<div id='Creator'>
<div id='01e'>CactusMod</div>`
document.body.appendChild(Creator)

Panel.innerHTML = `
<div id="Panel">
<div id="keyW">W</div>
<div id="keyA">A</div>
<div id="keyS">S</div>
<div id="keyD">D</div>
<div id="LeftClick">LMB</div>
<div id="RightClick">RMB</div>
<div id="SpaceBar">______</div>
</div>`
document.body.appendChild(Panel)

let popUI = document.querySelector('#pop-ui');
let settings = document.querySelector('#pop-settings');


// === STYLING FOR HAT MENU ===
document.querySelector('#game-content').style.justifyContent = 'center';
document.querySelector('#main-content').style.width = 'auto';
document.getElementById('hat-menu').style.background = "rgba(0,0,0,0)"
document.getElementById('hat-menu').style.opacity = "0.9"
document.getElementById('clan-menu').style.background = "rgba(0,0,0,0)"
document.getElementById('clan-menu').style.opacity = "0.9"
document.getElementById("hat_menu_content").style.background = "rgba(0,0,0,0)"
document.getElementById("clan_menu_content").style.background = "rgba(0,0,0,0)"

var hatMenu = document.getElementById("hat-menu");
if (hatMenu) {
    hatMenu.style.opacity = "0.6";
}

// == style ==
var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`

create_clan *, #pop-ui {
  background-color: transparent;
}
#pop-settings {
  background: rgba(0,0,0,0.5);
  opacity: 0.95;
}

#Creator{
    position: fixed !important;
    width: 10vw;
    height: 5vh;
    top: 96.4vh;
    left: -1.25vw;
    z-index: 100000022;
    display: block;
    text-align: center;
    opacity: 0;
}

#01e{
    position: fixed !important;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
}

#SHOW {
    font-size: 18px;
    position: absolute;
    width: 90px;
    height: 78px;
    top:55px;
    left:10px;
    z-index:1000000;
    display: block;
    text-align: center;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.4);

}

#Panel {
    position: relative;
    width: 150px;
    height: 180px;
    top: 10px;
    left: 130px;
    z-index: 1000000;
    display: block;
    text-align: center;
    opacity: 0.6;
}




#millWarningDiv{
    font-size: 18px;
    position: absolute;
    height: auto;
    top:80vh;
    left:0vh;
    z-index:1000000;
    display: block;
    opacity: 0.9;
    text-align: center;
    border-radius: 20px;
    display: none;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding:10px;
    color: white;
}


#keyW {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 0;
    left: 50px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

#keyA {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
}

#keyS {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 50px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
}

#keyD {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
    border-top-right-radius: 10px;
}

#LeftClick {
    position: absolute;
    width: 75px;
    height: 45px;
    top: 90px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
}

#RightClick {
    position: absolute;
    width: 75px;
    height: 45px;
    top: 90px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
}

#SpaceBar {
    position: absolute;
    width: 150px;
    height: 45px;
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 3px #353535, 0 0 0 3px #3e3e3e, inset 0 0 7px rgba(0, 0, 0, 1), 0 2px 10px rgba(0,0,0,.5), inset 0 0 10px rgba(0,0,0,.2);
}

#top-wrap-left {
    position: fixed;
    top: 50px;
    left: 96%;
    transform: translateX(-50%);
    width: 58px;
    height:58px;
}

#hat-menu {

  height: 348px;
  width: 430px;
}
#hat-menu .green-button, #clan-menu .green-button {
	background-color: rgba(0,0,0,0);
	box-shadow:none;
}
#hat-menu .green-button:hover, #clan-menu .green-button:hover {
  background-color: rgba(0,0,0,0.2);
}
.subcontent-bg {
	border-color: transparent;
	box-shadow: none;
  background: transparent;
}
.menu .content .menu-item .menu-pricing .action {
	border-color: grey;
}
.menu .content .menu-item {
	border-bottom-color: transparent;
}
#hat-menu, #clan-menu {
  box-shadow: none;
  border: 1px solid black
}

#clan_menu_content .subcontent-bg {
  margin: 1px 0px 1px 0px;
}

#create_clan *, #pop-ui {
  background-color: transparent;
}

#pop-settings {
  background: rgba(0,0,0,0.5);
  opacity: 0.95;
}

.scrollbar::-webkit-scrollbar {
  background: rgba(0, 0, 0, 0);
  border-radius: 2px;
  border: 2px solid rgba(0, 0, 0, 0.9);
}
.scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255, 0.7);
  border-radius: 2px;
  border: 2px solid #141414;
  box-shadow: inset 0 1px 0 white, inset 0 -1px 0 #4e5645,
  0 1px 1px rgb(20 20 20 / 50%);
}

`))


// == ping-shower ==
var checkbox = document.getElementById('display-ping-toggle');
checkbox.checked = true;
checkbox.dispatchEvent(new Event('change'));

// == remove ads ==
const idsToDelete = ['game-bottom-content', 'da-left', 'da-right', 'game-left-content-main', "game-right-content-main", "discord", 'alsoTryLink', 'cross-promo']; // Array of IDs to delete
idsToDelete.forEach(id => {
    const elementToRemove = document.getElementById(id);
    if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
    } else {
        console.error(`Element with ID ${id} not found!`);
    }
});
const container = document.getElementById('game-content');
const elementToRealign = document.getElementById('game-middle-main');
const leftOffset = (container.offsetWidth - elementToRealign.offsetWidth) / 2;
elementToRealign.style.left = leftOffset + 'px';


// == Homepage Blur ==
function blur() {
    const homepage = document.getElementById("homepage");
    homepage.style.display = "flex";
    // Set a fixed blur value
    const blurValue = 1.5;
    homepage.style.backdropFilter = `blur(${blurValue}px)`;
}

setTimeout(blur, 2000);

//  == Watermark/Username ==*customizeable - line 86*

let gridToggle = true; // change this value to false if you want to keep grid off

function toggleGrid() {
    const grid = document.querySelector('#grid-toggle');
    grid.click();
}
toggleGrid();
function handlePlayButtonClick() {
    if (gridToggle) {
        toggleGrid();
        gridToggle = false;
    }
}
var xe1 = false;

function toggleCreatorVisibility() {
    var creatorDiv = document.getElementById('Creator');
    if (creatorDiv.style.opacity === '0.5') return;

    if (!creatorDiv.dataset.clicked) {
        creatorDiv.dataset.clicked = true;
        creatorDiv.style.opacity = '0.5';
        return;
    }
    creatorDiv.style.opacity = '1';
}

function playButtonClickHandler() {
    toggleCreatorVisibility();
    handlePlayButtonClick();
    var creatorDiv = document.getElementById('Creator');
    creatorDiv.style.transition = 'opacity 0.5s ease';

    // Print "Worked" to the console
    console.log("Worked");

    // Remove event listener after action happens
    if (xe1) {
        document.getElementById('play').removeEventListener('click', playButtonClickHandler);
    } else {
        xe1 = true;
    }
}

document.getElementById('play').addEventListener('click', playButtonClickHandler);

// == Access Settings ingame ==
document.addEventListener('keydown', e =>{
    if(e.keyCode == 27) {
        if(document.querySelector('#hat-menu').style.display !== "flex" && document.querySelector('#clan-menu').style.display !== "flex" && document.querySelector('#homepage').style.display !== "flex" && document.querySelector('#chat-wrapper').style.display !== "block") {
            if(!popUI.classList.contains('fade-in')) {
                popUI.classList.add('fade-in');
                popUI.style.display = "flex";
                settings.style.display = "flex";
                return;
            }
            popUI.classList.remove('fade-in');
            popUI.style.display = "none";
            settings.style.display = "none";
        }
    }
});

// == Custom Health + Clan Colour ==

const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
  if (this.fillStyle === "#a4cc4f") {
    this.fillStyle = "#13a8ec";
    this.shadowColor = "rgba(0, 0, 0, 0.7)";
    this.shadowBlur = 3;
  }
  originalFillRect.call(this, x, y, width, height);
};

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply: function (target, thisArg, argumentsList) {
        thisArg.lineWidth = 8;
        thisArg.strokeStyle = "black";
        thisArg.strokeText.apply(thisArg, argumentsList);
        return target.apply(thisArg, argumentsList);
    }
});


CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
     apply: function (target, thisArg, argumentsList) {
          if (typeof argumentsList[0] == 'string' && argumentsList[0].includes('[')) {
               thisArg.fillStyle = "#6ee0dc";
               thisArg.shadowColor = "rgba(0, 0, 0, 0.7)";
               thisArg.shadowBlur = 6;
          }
          return target.apply(thisArg, argumentsList);
     }
});




// == Miscellaneous ==

 // Clan custom title
var phrases = [,"/ Clan /", "| Clan |", "- Clan -", "/ Clan /"];
var currentIndex = 0;

setInterval(function() {
  var element = document.getElementById('clan-title');
  if (element) {
    element.textContent = phrases[currentIndex];
    currentIndex = (currentIndex + 1) % phrases.length;
  }
}, 200);



// Instant leave

(function() {
    'use strict';

    document.addEventListener("keydown", function(event) {
        var homepage = document.getElementById("homepage");
        var isPlayerInGame = homepage.style.display === "none";

        if (isPlayerInGame && event.code === "ArrowUp") {
            event.preventDefault();

            var ffaMode = document.getElementById("ffa-mode");
            var sandboxMode = document.getElementById("sandbox-mode");
            var popProgressLoss = document.getElementById("pop-progress-loss");
            var changeServer = document.getElementById("change-server");

            if (isPlayerInGame) {
                var activeButton = ffaMode.classList.contains("dark-blue-button-3-active") ? sandboxMode : ffaMode;
                homepage.style.display = "flex";
                activeButton.click();
            }

            if (popProgressLoss.style.display === "flex") {
                changeServer.click();
            }
        }
    });

})();

// Game-Homepage


(function() {
    'use strict';

    const styleElement = document.head.appendChild(document.createElement('style'));
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(`#cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content { display: none !important; }`));

    const gameContent = document.querySelector('#game-content');
    gameContent.style.justifyContent = 'center';

    const mainContent = document.querySelector('#main-content');
    mainContent.style.width = 'auto';

    const popUi = document.getElementById('pop-ui');
    popUi.style.opacity = '0.7';

    const homepage = document.getElementById('homepage');
    homepage.style.opacity = '0.7';

    const rankingMiddleMain = document.getElementById('ranking-middle-main');
    rankingMiddleMain.style.height = '380px';

    const rankingRanksContainer = document.getElementById('ranking-ranks-container');
    rankingRanksContainer.style.height = '295px';

    const ranking2MiddleMain = document.getElementById('ranking2-middle-main');
    ranking2MiddleMain.style.height = '380px';

    const rankingRankContainer = document.getElementById('ranking-rank-container');
    rankingRankContainer.style.height = '295px';

    const profileLeftMain = document.getElementById('profile-left-main');
    profileLeftMain.style.width = '650px';

    const changeUsername = document.getElementById('change-username');
    changeUsername.style.width = '200px';

    const popBoxes = document.querySelectorAll('.pop-box');
    popBoxes.forEach((box) => {
    box.style.boxShadow = "inset 0 4px 0 #4e564500, inset 0 -4px 0 #38482500, 0px 2px 0 5px rgb(20 20 20 / 0%), 0px 0px 0 15px rgb(20 20 20 / 0%)";
    });

    const popHomepage = document.getElementById('homepage');
    document.addEventListener('keydown', e => {
    if (e.key === 'Alt' && popHomepage) {
    popHomepage.style.display = (popHomepage.style.display === 'flex' || popHomepage.style.display === '') ? 'none' : 'flex';
    e.preventDefault();
    e.stopPropagation();
    }});
})();


const { fillText } = CanvasRenderingContext2D.prototype;
const cursing = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"],
  replace = ["cxxx", "wxxxx", "fxxx", "sxxx", "fxxxxx", "nxxxxx", "nxxxx", "dxxx", "vxxxxx", "mxxxx", "cxxx", "rxxx", "cxx", "sxx", "txxx", "pxxxx", "cxxx", "pxxxx", "jxxx", "pxxxx", "dxxxxx", "wxxxxx", "dxxx", "bxxxx", "dxxx", "fxx", "bxxxxxx"];
CanvasRenderingContext2D.prototype.fillText = function (word) {
  if (typeof word == "string") {
    var tmpString;
    for (var i = 0; i < cursing.length; ++i) {
      if (word.toLowerCase().indexOf(cursing[i]) > -1) {
        tmpString = replace[i];
        var re = new RegExp(cursing[i], "ig");
        word = word.replace(re, tmpString);
      }
    }
  }
  fillText.call(this, ...arguments);
};





// emojies

const emojiMappings = {
    ":skull:": "💀",
    ":heart:": "❤️",
    ":smile:": "😄",
    ":thumbu:": "👍",
    ":thumbd:": "👎",

};

function replaceTextWithEmojis(text) {
    let replacedText = text;
    for (const pattern in emojiMappings) {
        if (emojiMappings.hasOwnProperty(pattern)) {
            replacedText = replacedText.replace(new RegExp(pattern, "g"), emojiMappings[pattern]);
        }
    }
    return replacedText;
}

document.getElementById("chat").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const chatInput = event.target;
        const text = chatInput.value;
        const replacedText = replaceTextWithEmojis(text);
        chatInput.value = replacedText;
    }
});
document.getElementById("chat-wrapper").addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.stopPropagation();
    }
});
document.getElementById("nickname").addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.stopPropagation();
    }
});

// dagger fix

(function() {
    const { drawImage } = CanvasRenderingContext2D.prototype

    CanvasRenderingContext2D.prototype.drawImage = function(image, x, y, width, height) {
        if (/dagger/.test(image?.src) && (y === 5 || y > window.screen.availHeight - 100)) {
            this.save()
            this.strokeStyle = "rgba(45, 49, 49, .5)"
            this.lineWidth = 6

            this.roundRect(x + 3, y + 3, 95, 95, 16)
            this.stroke()
            this.restore()

            arguments[3] = arguments[4] = 80
            arguments[1] += 11
            arguments[2] += 11
        }

        drawImage.apply(this, arguments)
    }
})()

document.head.appendChild(styleItem);
