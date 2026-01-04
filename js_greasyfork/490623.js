// ==UserScript==
// @name         drxgon's best legit script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  the best legit script in sploop.io
// @author       drxgon
// @match        https://sploop.io/
// @icon         https://sploop.io/img/ui/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490623/drxgon%27s%20best%20legit%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/490623/drxgon%27s%20best%20legit%20script.meta.js
// ==/UserScript==

(function(){
    //in-game menu
    let popUI = document.querySelector('#pop-ui');
    let settings = document.querySelector('#pop-settings');
    //style changes
    document.getElementById("hat_menu_content").style.background = "rgba(0,0,0,0)";
    document.getElementById('hat-menu').style.background = "rgba(0,0,0,0)";
    document.getElementById('hat-menu').style.opacity = '0.5';
    document.getElementById("clan_menu_content").style.background = "rgba(0,0,0,0)";
    document.getElementById('clan-menu').style.background = "rgba(0,0,0,0)";
    document.getElementById('clan-menu').style.opacity = '0.5';
    document.getElementById('ranking-middle-main').style.height = '380px';
    document.getElementById('ranking-ranks-container').style.height = '295px';
    document.getElementById('ranking2-middle-main').style.height = '380px';
    document.getElementById('ranking-rank-container').style.height = '295px';
    document.getElementById('profile-left-main').style.width = '650px';
    document.getElementById('change-username').style.width = '200px';
    //adjustment fixes
    document.querySelector('#game-content').style.justifyContent = 'center';
    document.querySelector('#main-content').style.width = 'auto';
    //ad remove
    var styleItem1 = document.createElement('style');
    styleItem1.type = 'text/css';
    styleItem1.appendChild(document.createTextNode(`#cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content { display: none !important;
}
    create_clan *, #pop-ui {
    background-color: transparent;
}
    #pop-settings {
    background: rgba(0,0,0,0.5);
    opacity: 0.95;
}`));
    document.head.appendChild(styleItem1);
    //auto settings
    const grid = document.querySelector('#grid-toggle');
    const ping = document.querySelector('#display-ping-toggle');
    grid.click();
    ping.click();
    //in-game menu
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
}}});})();

document.getElementById("hat-menu").style.height = "345px";
document.getElementById("hat-menu").style.background = "rgb(40 45 34 / 0%)";
document.getElementById("hat-menu").style.border = "5px solid #14141400";
const popBoxes = document.querySelectorAll('.pop-box');
popBoxes.forEach((box) => {
    box.style.boxShadow = "inset 0 4px 0 #4e564500, inset 0 -4px 0 #38482500, 0px 2px 0 5px rgb(20 20 20 / 0%), 0px 0px 0 15px rgb(20 20 20 / 0%)";
});
const popCloseButtons = document.querySelectorAll('.pop-close-button');
popCloseButtons.forEach((button) => {
    button.remove();
});
setInterval(function() {
  var phrases = ["Data", "QuerySelector", "Audience", "Prosper", "Bobo ex", "bubble", "HAHAHHAHAHAHA", "Zephyr", "Quibble", "Bumblebee", "Jabberwocky", "Skedaddle", "Gobbledygook", "Flummox", "Wobble", "Blubber", "Malarkey", "Hodgepodge", "Quirk", "Juxtapose", "Scrumptious", "Flibbertigibbet", "Whippersnapper", "Brouhaha", "Kerfuffle", "Snickerdoodle", "Gadzooks"];
  var randomIndex = Math.floor(Math.random() * phrases.length);
  var randomPhrase = phrases[randomIndex];

  var elements = document.getElementsByClassName('pop-title text-shadowed-4');
  for (var i = 0; i < elements.length; i++) {
    elements[i].textContent = randomPhrase;
  }
}, 250);


const ItemsMenu = document.querySelectorAll('.column-flex.column-flex-extra');
ItemsMenu.forEach((button, index) => {
    button.id = `Items-${index + 1}`;
});
const Price = document.querySelectorAll('.pricing.hat_price_tag');
Price.forEach((button, index) => {
    button.id = `Price-${index + 1}`;
});
for (let i = 1; i <= 11; i++) {
    const item = document.getElementById(`Items-${i}`);
    if (item) {
        item.style.opacity = "0.2";
    }
}
for (let i = 1; i <= 11; i++) {
    const Nou = document.getElementById(`Price-${i}`);
    if (Nou) {
        Nou.style.opacity = "0.2";
    }
}
const menuItems = document.querySelectorAll('.menu .content .menu-item');
menuItems.forEach(item => {
    item.style.borderBottom = '3px solid #1414146b';
});
const Subcontent = document.querySelectorAll('.subcontent-bg');
Subcontent.forEach(item => {
    item.style.border = '3px solid #1414146b';
    item.style.boxShadow = 'inset 0 5px 0 rgba(20, 20, 20, 0)';
    item.style.background = 'rgb(20 20 20 / 16%)';
});
const menuPricingActions = document.querySelectorAll('.menu .content .menu-item .menu-pricing .action');
menuPricingActions.forEach(item => {
    item.style.border = '4px solid rgba(20, 20, 20, 0.42)';
    item.style.backgroundColor = 'rgb(150 185 67 / 32%)';
    item.style.boxShadow = 'inset 0 -5px 0 #80983600';
    item.style.opacity = '0.2';
});

document.documentElement.style.overflow = 'hidden';


const grids = document.querySelector("#grid-toggle");
setInterval(() => {
    if (grids.checked){grids.click();}
}, 0);

var hatMenuContent = document.getElementById("hat_menu_content");
var images = hatMenuContent.getElementsByTagName("img");
for (var i = 0; i < images.length; i++) {
  images[i].setAttribute("draggable", "false");
}

function blur() {
    const homepage = document.getElementById("homepage");
    homepage.style.display = "flex";

    let blurValue = 0;
    const blurInterval = setInterval(() => {
        blurValue += 0.1;
        homepage.style.backdropFilter = `blur(${blurValue}px)`;

        if (blurValue >= 5) {
            clearInterval(blurInterval);
        }
    }, 200);
}
setTimeout(blur, 2000);

const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
const customFillColor = "#6ee0dc";

CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
  if (this.fillStyle === "#a4cc4f") {
    this.fillStyle = customFillColor;
  }
  originalFillRect.call(this, x, y, width, height);
};

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply: function (target, thisArg, argumentsList) {
        thisArg.lineWidth = 8;
        thisArg.strokeStyle = "#2a2b25";
        thisArg.strokeText.apply(thisArg, argumentsList);
        return target.apply(thisArg, argumentsList);
    }
});


CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
     apply: function (target, thisArg, argumentsList) {
          if (typeof argumentsList[0] == 'string' && argumentsList[0].includes('[')) {
               thisArg.fillStyle = "#6ee0dc";
               thisArg.shadowColor = "rgba(0, 0, 0, 0.7)";
               thisArg.shadowBlur = 5;
          }
          return target.apply(thisArg, argumentsList);
     }
});

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply: function (target, thisArg, argumentsList) {
        thisArg.lineWidth = 8;
        thisArg.strokeStyle = "#2a2b25";
        thisArg.strokeText.apply(thisArg, argumentsList);
        return target.apply(thisArg, argumentsList);
    }
});