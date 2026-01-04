// ==UserScript==
// @name         Project Nightmare
// @match        *://*.moomoo.io/*
// @version      10
// @author       wizhyl || matemate/tf || fungusYT
// @description  private
// @namespace    none
// @run-at       document_idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522566/Project%20Nightmare.user.js
// @updateURL https://update.greasyfork.org/scripts/522566/Project%20Nightmare.meta.js
// ==/UserScript==
const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});
function showMessage(message, duration, color, callback) {
    const frameMsg = Object.assign(document.createElement("div"), {
        innerHTML: message,
        style: `
          position: fixed;
          top: 7%; /* Static position */
          left: 50%;
          transform: translateX(-50%);
          font-size: 2rem;
          color: #FFFFFF; /* Light white text */
          z-index: 9999;
          opacity: 1;
          transition: opacity 1s ease-in-out; /* Smooth fade-in and fade-out */
          padding: 10px;
          background-color: rgba(169, 169, 169, 0.5); /* Grey transparent background */
          border: 2px solid transparent;
          border-radius: 15px; /* Smooth radius for the box */
          box-shadow: 0 0 20px 5px #fff; /* Light grey glow */
          text-shadow: 0 0 20px #9040a1; /* Light grey text glow */
      `
  });
    document.body.appendChild(frameMsg);
    setTimeout(() => {
        frameMsg.style.opacity = "1";
    }, 100);
    setTimeout(() => {
        frameMsg.style.opacity = "0";
        setTimeout(() => {
            frameMsg.remove();
            if (callback) callback();
        }, 1000); /* Adjusted timeout to match the transition duration */
    }, duration);
}
document.getElementById("ageBarBody").style.color = "#9040a1";
document.getElementById("leaderboard").append ('!~Nightmare~!');
const welcomemsg = document.createElement("div"); //start
welcomemsg.textContent = "Hi Welcome :D"; //hello message
welcomemsg.style.position = "fixed"; //position
welcomemsg.style.top = "-100px"; //top position
welcomemsg.style.left = "50%"; //left position
welcomemsg.style.transform = "translateX(-50%)";
welcomemsg.style.backgroundColor = "transparent"; //backgr color
welcomemsg.style.color = "white";// color
welcomemsg.style.padding = "15px";// padding
welcomemsg.style.fontSize = "15px"; //font size
welcomemsg.style.borderRadius = "10px"; //border
welcomemsg.style.transition = "top 1s, opacity 1s"; //timer
welcomemsg.style.zIndex = "9999"; //zIndex
document.body.appendChild(welcomemsg); //timer
setTimeout(() => {
    welcomemsg.style.top = "0";
    welcomemsg.style.opacity = "1";
}, 500);

setTimeout(() => {
    welcomemsg.style.opacity = "0";
    setTimeout(() => {
        welcomemsg.remove();
    }, 1000);
}, 3000);
const welcomemsg2 = document.createElement("div");
welcomemsg2.textContent = "Mod by Matemate,fungusYT, Ukai, and noob_v10";
welcomemsg2.style.position = "fixed";
welcomemsg2.style.top = "-200px";
welcomemsg2.style.left = "50%";
welcomemsg2.style.transform = "translateX(-50%)";
welcomemsg2.style.backgroundColor = "Transparent";
welcomemsg2.style.color = "white";
welcomemsg2.style.padding = "15px";
welcomemsg2.style.fontSize = "15px";
welcomemsg2.style.borderRadius = "10px";
welcomemsg2.style.transition = "top 1s, opacity 1s";
welcomemsg2.style.zIndex = "9999";
document.body.appendChild(welcomemsg2);
setTimeout(() => {
    welcomemsg2.style.top = "45px";
    welcomemsg2.style.opacity = "1";
}, 1500);
setTimeout(() => {
    welcomemsg2.style.top = "0";
    welcomemsg2.style.opacity = "1";
}, 3000);

setTimeout(() => {
    welcomemsg2.style.opacity = "0";
    setTimeout(() => {
        welcomemsg2.remove();
    }, 1000);
}, 5000);
$('#foodDisplay, #woodDisplay, #stoneDisplay, #scoreDisplay, #allianceButton, #killCounter, #chatButton, #storeButton, #nameInput, #leaderboard, ageBarBody, ageText').css({
    'background-color': 'rgba(0, 0, 0, 0.3)',  // Grey background with transparency
    'box-shadow': '0 0 25px 5px rgba(76, 0, 153, 1)',  // Black glow / No glow
    'text-align': 'center',
    'transition': 'transform 0.3s ease',
    'border-radius': '10px'
});

$('#nameInput').css({
    'background-color': 'rgba(0, 0, 0, 0.5)',  // Grey background with transparency
    'box-shadow': '0 0 10px 5px rgba(255, 255, 255, 0.3)',  // Black glow / No glow
    'text-align': 'center',
    'transition': 'transform 0.3s ease',
    'border-radius': '10px'
});

$('#mapDisplay').css({
    'background-color': 'rgba(0, 0, 0, 0.5)',  // Grey background with transparency
    'transition': 'transform 0.3s ease',
    'border-radius': '20px',
    'box-shadow': '0 0 25px 5px rgba(76, 0, 153, 1)'  // Black glow / No glow
});
document.head.appendChild(document.createElement("style")).textContent = `
* {
.itemInfoLmt {
    font-size: 22px;
    position: absolute;
    right: 10px;
    bottom: 6px;
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 182, 193, 0.8); /* Soft pink glow */
}

#ageBarContainer {
    width: 100%;
    bottom: 93px;
    text-align: center;
}

#ageText {
    width: 100%;
    bottom: 118px;
    text-align: center;
    color: rgba(76, 0, 153, 1); /* Bright red color */
    font-size: 24px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), /* Black outer shadow */
                 0 0 20px rgba(0, 0, 0, 0.6), /* Larger black shadow */
                 0 0 30px rgba(0, 0, 0, 0.4); /* Even larger black shadow */
}

#ageBar {
    background-color: rgba(0, 0, 0, 0.7); /* Dark background */
    border-radius: 5px;
    padding: 5px;
    width: 314px;
    height: 10px;
    display: inline-block;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.7); /* Black shadow */
}

#ageBarBody {
    background-color: rgba(76, 0, 153, 1); /* Bright red bar */
    border-radius: 3px;
    width: 0px;
    height: 100%;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.7); /* Black shadow for the bar */
}

#upgradeHolder {
    width: 100%;
    position: absolute;
    text-align: center;
    top: 10px;
    color: rgba(76, 0, 153, 1); /* Bright red text */
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), /* Black outer shadow */
                 0 0 20px rgba(0, 0, 0, 0.6), /* Larger black shadow */
                 0 0 30px rgba(0, 0, 0, 0.4); /* Even larger black shadow */
}


`;

// Retrieve the HTML content of .menuLink elements inside #linksContainer2
var moomooVer = $('#linksContainer2 .menuLink').html();

// Array of selectors for elements to hide
var hideSelectors = [
    '#mobileDownloadButtonContainer',
    '#followText',
    '#wideAdCard',
    '#animation_container',
    '#smallLinks',
    '#linksContainer1',
    '#twitterFollow',
    '#youtubeFollow',
    '#cdm-zone-02',
    '#youtuberOf',
    '#promoImg',
    '#downloadButtonContainer',
    '.menuHeader',
    '.menuLink',
    '.menuHeader:nth-child(5)',
    '.menuHeader:nth-child(6)',
    '.menuText',
    '.ad-choices',
    '.PubAPIAd'
];

// CSS rule to apply
var css = '#rightCardHolder {display: block!important}';

// Create and append a <style> element to the document head
var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';

if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);

// Hide elements based on the selectors
for (let i = 0; i < hideSelectors.length; i++) {
    $(hideSelectors[i]).hide();
}

// Update the HTML content of #linksContainer2
$('#linksContainer2').html('<a href="./docs/versions.txt" target="_blank" class="menuLink">2</a>');
var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
#suggestBox {
    width: 355px;
    border-radius: 3px;
    background-color: rgba(0,0,0,0.5);
    margin: auto;
    text-align: left;
    z-index: 49;
    pointer-events: auto;
    position: relative;
    bottom: 3.5px;
    overflow-y: auto;
}
#suggestBox div {
    background-color: rgba(255,255,255,0);
    color: rgba(255,255,255,1);
    transition: background-color 0.3s, color 0.3s;
}
#suggestBox div:hover {
    background-color: rgba(255,255,255,0.2);
    color: rgba(0,0,0,1);
}
.suggestBoxHard {
    color: rgba(255,255,255,1);
    font-size: 18px;
}
.suggestBoxLight {
    color: rgba(255,255,255,0.7);
    font-size: 18px;
}
`));

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 45) {
        const chatHolder = document.getElementById("menuChatDiv");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
});


document.addEventListener("keydown", function(event) {
    if (event.keyCode === 46) {
        const chatHolder = document.getElementById("gameUI");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
});




function onBoxMouseOver() {
    this.style.transform = 'scale(1.1)'; // Increase size by 10%
    this.style.borderRadius = '10px'; // Add rounded corners
    this.style.boxShadow = '0 0 0 1px rgba(76, 0, 153, 1)'; // Add orange outline with 1px width
}

// Function to handle mouse leave event for the boxes
function onBoxMouseLeave() {
    this.style.transform = 'scale(1)'; // Restore original size
    this.style.borderRadius = '0'; // Remove rounded corners to make the box square again
    this.style.boxShadow = 'none'; // Remove the orange outline
}

// Function to handle mouse enter event for the "enter game box"
function onEnterGameMouseOver() {
    const enterGameBox = document.getElementById('leaderboard');
    enterGameBox.style.transform = 'scale(1.05)'; // Increase size by 5%
    enterGameBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    enterGameBox.style.borderRadius = '50px'; // Add more rounded corners
}

// Function to handle mouse leave event for the "enter game box"
function onEnterGameMouseLeave() {
    const enterGameBox = document.getElementById('leaderboard');
    enterGameBox.style.transform = 'scale(1)'; // Restore original size
    enterGameBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Change background color back to green
    enterGameBox.style.borderRadius = '0'; // Remove rounded corners to make the box square again
}

// Add smooth transition for scaling effect
const boxes = document.querySelectorAll('.menuCard');
boxes.forEach(box => {
    box.style.transition = 'transform 0.5s ease'; // 0.5s duration with ease-in-out timing function
    box.addEventListener('mouseenter', onBoxMouseOver);
    box.addEventListener('mouseleave', onBoxMouseLeave);
});
let editMainMenu = `
<style>
  /* Стили для меню #setupCard */
  #setupCard {
    border-radius: 10px;
    position: absolute;
    left: 770px;
    top: 0px;
    background: rgba(76, 0, 153, 1);
    box-shadow: 0px 0px 5px #fff;
    transition: box-shadow 0.3s ease;
  }

  #setupCard:hover,
  #setupCard:active {
    box-shadow: 0px 0px 10px #ffffff;
  }

  #mainMenu {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

  }
#enterGame {
    background-color: rgba(76, 0, 153, 1);
    border-radius: 15px;
    transition: all 0.7s ease-in-out;
}
  /* Стили для меню #guideCard */
  #guideCard {
    border-radius: 10px;
    position: absolute;
    left: 420px;
    top: 0px;
    background: rgba(76, 0, 153, 1);
    box-shadow: 0px 0px 20px #fff;
    transition: box-shadow 0.3s ease;
  }

  #guideCard:hover,
  #guideCard:active {
    box-shadow: 0px 0px 10px #ffffff;
  }



  /* Прочие стили остаются без изменений */
  #nameInput::selection {
    background: #E7BDE7;
  }

  #guideCard::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background-color: rgba(0, 0, 0, 0);
  }

  #mainMenu {
    background-color: rgba(76, 0, 153, 1);

  }

  .menuCard {
    background: #bd85c9;
    text-align: center;
    box-shadow: inset 0px 0px 20px rgba(102, 51, 153, 0.5);
  }

  })();
</script>

</style>


`
 $("#mainMenu").append(editMainMenu)
// Add event listeners for the "enter game box"
const enterGameBox = document.getElementById('leaderboard');
enterGameBox.addEventListener('mouseenter', onEnterGameMouseOver);
enterGameBox.addEventListener('mouseleave', onEnterGameMouseLeave);
$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.5)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});

$('#menuContainer').css({'white-space': 'normal'});

$('#nativeResolution').css({'cursor': 'pointer'});

$('#playMusic').css({'cursor': 'pointer'});

$('#serverSelect').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('.settingRadio').css({'margin-bottom': '30.75px'});


$('#joinPartyButton').css({'right': '10%',
                           'left': '70%',
                           'text-align': 'center',
                           'bottom': '48px',
                           'font-size': '24px',
                           'top': 'unset'});

$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0.74)',
                           'text-align': 'center',
                           'bottom': '12px'});

$('.ytLink').css({'color': '#20ace8',
                  'padding': '8px',
                  'background-color': 'rgba(0, 0, 0, 0.74)'});

$('.menuLink').css({'color': '#20ace8'});

$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});

$('#serverSelect').css({'cursor': 'pointer',
                        'color': 'rgba(0, 0, 0, 0.5)',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});

$('#promoImgHolder').css({'position': 'absolute',
                          'bottom': '-7%',
                          'left': '20px',
                          'width': '420px',
                          'height': '236.25px',
                          'padding-bottom': '18px',
                          'margin-top': '0px'});

$('#adCard').css({'position': 'absolute',
                  'bottom': '-7%',
                  'right': '20px',
                  'width': '420px',
                  'height': '236.25px',
                  'padding-bottom': '18px'});

$('#mapDisplay').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '20px'});
//wolfi-chan was here
$('.menuHeader').css({'color': 'rgba(0, 0, 0, 0,5)'});

$('#killCounter').css({'color': '#ededed'});

$('#diedText').css({'background-color': 'rgb(255, 255, 255)'});

$('#gameCanvas').css({'background-color': '#f4f4f4'});



$('#leaderboard').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgb((255,240,245))',
                       'text-align': 'center'});

$('#storeTab').css({'-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#storeHolder').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)'});
document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

$('#allianceHolder').css({'-webkit-border-radius': '0px',
                          '-moz-border-radius': '0px',
                          'border-radius': '0px',
                          'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.actionBarItem').css({'-webkit-border-radius': '0px',
                         'border-radius': '0px',
                         'background-color': 'rgba(0, 0, 0, 0.4)'})

let hathubirthday = true;
let haibaythang4 = true;
let hathuxinhgaidangyeu = true;
let hathucongyeu = true;

document.getElementById("mainMenu").style.backgroundImage = "url('https://www.ultraimagehub.com/wallpapers/tr:flp-false,gx-0.51,gy-1,q-75,rh-3264,rw-5824,th-1080,tw-1920/1241701923321544764.jpeg')";
window.reloadedColor = "rgba(76, 0, 153, 1)";
window.middleReloadedColor = "rgba(76, 0, 153, 1)";
window.notReloadedColor = "rgba(76, 0, 153, 1)";
document.getElementById("loadingText").innerText="";
document.getElementById("loadingText").style.color = "rgba(76, 0, 153, 1)";
document.getElementById("loadingText").style.color = "linear-gradient(red,yellow)";
document.getElementById("loadingText").style.textShadow = "#a16dce -2px -2px 10px, purple 0px -5px 1px, purple 0px -5px 10px";

// T岷 animation keyframes
var styleSheet = document.styleSheets[0];
var keyframes = "\
@keyframes popIn {\
0% {\
transform: scale(0.5);\
opacity: 0;\
}\
100% {\
transform: scale(1);\
opacity: 1;\
}\
}";
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


var getElement = document.querySelector('#enterGame');
({'position':'absolute','bottom':'72px','left':'20px','width':'420px','height':'236.25px','padding-bottom':'18px','margin-top':'0px'});
$("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/games/gam-15/gam1422.gif), default');
$('.menuCard').css({'color':'#808080'});
$('#menuContainer').css({'white-space': 'normal'});
$('#guideCard').css({'color': '#FFFFF'});
$('.killCounter').css({'color': '#000000'});
$('#nativeResolution').css({'cursor': 'pointer'});
$('#playMusic').css({'cursor': 'pointer'});
$('#skinColorHolder').css({'margin-bottom': '30.75px'});
$('.settingRadio').css({'margin-bottom': '30.75px'});
$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});
$('#serverSelect').css({'cursor': 'pointer',
                        'color': '#000000',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});
$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',})
style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}
head.appendChild(style);
$('#linksContainer2').html('<a href="./docs/versions.txt" target="_blank" class="menuLink">' + "2" + '</a>');


/*let mouseeffect = `
<style>
    body {
        margin: 0;
        overflow: hidden;
    }
    .circle {
        position: absolute;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    }
</style>
</head>
<body>
<script>
    document.addEventListener('mousedown', function(e) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;

        var circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.left = mouseX - 10 + 'px'; // Adjust for circle's width
        circle.style.top = mouseY - 10 + 'px'; // Adjust for circle's height
        document.body.appendChild(circle);

        setTimeout(function() {
            circle.style.transform = 'scale(2)';
            circle.style.opacity = '0';
        }, 10);

        setTimeout(function() {
            circle.remove();
        }, 500);
    });
</script>
</body>
</html>
`
 $("#touch-controls-fullscreen").append(mouseeffect)*/
/*let mouseeffect2 = `
<script>
    document.addEventListener('mousemove', function(e) {
        var heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);

        setTimeout(function() {
            heart.remove();
        }, 2000);
    });
</script>
<style>
    .heart {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: red;
        transform: rotate(-45deg);
        animation: heartbeat 2s linear infinite;
        mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.02 4.02 4 6.5 4c1.74 0 3.41.81 4.5 2.09C11.09 4.81 12.76 4 14.5 4 17.5 4 22 8.36 22 11.8c0 3.17-3.84 6.24-8 9.54z"/></svg>');
        mask-size: contain;
        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.02 4.02 4 6.5 4c1.74 0 3.41.81 4.5 2.09C11.09 4.81 12.76 4 14.5 4 17.5 4 22 8.36 22 11.8c0 3.17-3.84 6.24-8 9.54z"/></svg>');
        -webkit-mask-size: contain;
        pointer-events: none;
    }

    @keyframes heartbeat {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
</style>
`
$("#touch-controls-fullscreen").append(mouseeffect2)*/




let nameColor = "#ffffff";
let enemyNameColor = "#ffffff";
let reloadBarColor = "";
let healthBarColor = "";
let shameBarColor = "";
let enemyHealthBarColor = "#782F44";
let damageTextColor = "#782F44";
let healTextColor = "#60478D";
let myObjectHealth = "";
let enemyObjectHealth = "#ff6363";
let autoPushLine = "#ffffff";



let hathuxinggai = true;
let ping = 0;

document.addEventListener("keydown", function(event) {
    if (event.keyCode === 9) {
        const chatHolder = document.getElementById("menuChatDiv");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
    if (event.keyCode === 192) {
        const chatHolder = document.getElementById("gameUI");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
    if (event.keyCode === 99) {
        const chatHolder = document.getElementById("gameCanvas");
        if (chatHolder) {
            const currentDisplay = chatHolder.style.display;
            chatHolder.style.display = currentDisplay === "none" ? "block" : "none";
        }
    }
});
function getRandomRGBColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}
function getRandomBrightRGBColor() {
    const r = Math.floor(Math.random() * 128) + 128; // Red component (between 128 and 255)
    const g = Math.floor(Math.random() * 128) + 128; // Green component (between 128 and 255)
    const b = Math.floor(Math.random() * 128) + 128; // Blue component (between 128 and 255)
    return `rgb(${r}, ${g}, ${b})`;
}
// Define a function to generate a random rainbowish color
function getRandomRainbowishColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 360 (for the entire color spectrum)
    const saturation = '100%'; // Full saturation for vibrant colors
    const lightness = '50%'; // Balanced lightness
    return `hsl(${hue}, ${saturation}, ${lightness})`;
}
// AUTO RELOAD
setInterval(() => window.follmoo && follmoo(), 10);
window.location.native_resolution = true;
var autoreloadloop;
var autoreloadenough = 0;
autoreloadloop = setInterval(function() {
    if (autoreloadenough < 200) {
        if (document.getElementById("loadingText").innerHTML == `disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>`) {
            document.title = "Reloading";
            clearInterval(autoreloadloop);
            setTimeout(function() { document.title = "Moo Moo"; }, 1000)
            location.reload();
        }
        autoreloadenough++;
    }
    else if (autoreloadenough >= 300) {
        clearInterval(autoreloadloop);
        document.title = "Reloaded";
        setTimeout(function() { document.title = "Moo Moo"; }, 1000)
    }
}, 50);
let useHack = true;
let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let circleScale = 1.5
let namechanger = false;
let inantiantibull = false;
let spin = {
    degree: 45,
    toggle: false,
    angle: 0
}
// Rainbow Color HEX
var RainbowCycle = 0;
var cycle = 0;
var HPBarColor = "black";
var NameBarColor = "black";
setInterval(() => {
    if (RainbowCycle > 359) {
        // If Rainbow Reached Maximum
        RainbowCycle = 0; // Restart ();
    } else {
        /*for(let i = 0; i< 30; i++)*/ RainbowCycle++;
        //RainbowCycle++;
        HPBarColor = `hsla(${RainbowCycle}, 100%, 50%, 30)`;
    }
}, 0);
function getEl(id) {
    return document.getElementById(id);
}
var EasyStar = function(e) {
    var o = {};
    function r(t) {
        if (o[t]) return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = o, r.d = function(t, n, e) {
        r.o(t, n) || Object.defineProperty(t, n, {
            enumerable: !0,
            get: e
        })
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, r.t = function(n, t) {
        if (1 & t && (n = r(n)), 8 & t) return n;
        if (4 & t && "object" == typeof n && n && n.__esModule) return n;
        var e = Object.create(null);
        if (r.r(e), Object.defineProperty(e, "default", {
            enumerable: !0,
            value: n
        }), 2 & t && "string" != typeof n)
            for (var o in n) r.d(e, o, function(t) {
                return n[t]
            }.bind(null, o));
        return e
    }, r.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return r.d(n, "a", n), n
    }, r.o = function(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n)
    }, r.p = "/bin/", r(r.s = 0)
}([function(t, n, e) {
    var P = {},
        M = e(1),
        _ = e(2),
        A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function() {
        var c, i, f, s = 1.4,
            p = !1,
            u = {},
            o = {},
            r = {},
            l = {},
            a = !0,
            h = {},
            d = [],
            y = Number.MAX_VALUE,
            v = !1;
        this.setAcceptableTiles = function(t) {
            t instanceof Array ? f = t : !isNaN(parseFloat(t)) && isFinite(t) && (f = [t])
        }, this.enableSync = function() {
            p = !0
        }, this.disableSync = function() {
            p = !1
        }, this.enableDiagonals = function() {
            v = !0
        }, this.disableDiagonals = function() {
            v = !1
        }, this.setGrid = function(t) {
            c = t;
            for (var n = 0; n < c.length; n++)
                for (var e = 0; e < c[0].length; e++) o[c[n][e]] || (o[c[n][e]] = 1)
        }, this.setTileCost = function(t, n) {
            o[t] = n
        }, this.setAdditionalPointCost = function(t, n, e) {
            void 0 === r[n] && (r[n] = {}), r[n][t] = e
        }, this.removeAdditionalPointCost = function(t, n) {
            void 0 !== r[n] && delete r[n][t]
        }, this.removeAllAdditionalPointCosts = function() {
            r = {}
        }, this.setDirectionalCondition = function(t, n, e) {
            void 0 === l[n] && (l[n] = {}), l[n][t] = e
        }, this.removeAllDirectionalConditions = function() {
            l = {}
        }, this.setIterationsPerCalculation = function(t) {
            y = t
        }, this.avoidAdditionalPoint = function(t, n) {
            void 0 === u[n] && (u[n] = {}), u[n][t] = 1
        }, this.stopAvoidingAdditionalPoint = function(t, n) {
            void 0 !== u[n] && delete u[n][t]
        }, this.enableCornerCutting = function() {
            a = !0
        }, this.disableCornerCutting = function() {
            a = !1
        }, this.stopAvoidingAllAdditionalPoints = function() {
            u = {}
        }, this.findPath = function(t, n, e, o, r) {
            function i(t) {
                p ? r(t) : setTimeout(function() {
                    r(t)
                })
            }
            if (void 0 === f) throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            if (void 0 === c) throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1) throw new Error("Your start or end point is outside the scope of your grid.");
            if (t !== e || n !== o) {
                for (var s = c[o][e], u = !1, l = 0; l < f.length; l++)
                    if (s === f[l]) {
                        u = !0;
                        break
                    } if (!1 !== u) {
                        var a = new M;
                        a.openList = new A(function(t, n) {
                            return t.bestGuessDistance() - n.bestGuessDistance()
                        }), a.isDoneCalculating = !1, a.nodeHash = {}, a.startX = t, a.startY = n, a.endX = e, a.endY = o, a.callback = i, a.openList.push(O(a, a.startX, a.startY, null, 1));
                        o = E++;
                        return h[o] = a, d.push(o), o
                    }
                i(null)
            } else i([])
        }, this.cancelPath = function(t) {
            return t in h && (delete h[t], !0)
        }, this.calculate = function() {
            if (0 !== d.length && void 0 !== c && void 0 !== f)
                for (i = 0; i < y; i++) {
                    if (0 === d.length) return;
                    p && (i = 0);
                    var t = d[0],
                        n = h[t];
                    if (void 0 !== n)
                        if (0 !== n.openList.size()) {
                            var e = n.openList.pop();
                            if (n.endX !== e.x || n.endY !== e.y) (e.list = 0) < e.y && T(n, e, 0, -1, +b(e.x, e.y - 1)), e.x < c[0].length - 1 && T(n, e, 1, 0, +b(e.x + 1, e.y)), e.y < c.length - 1 && T(n, e, 0, 1, +b(e.x, e.y + 1)), 0 < e.x && T(n, e, -1, 0, +b(e.x - 1, e.y)), v && (0 < e.x && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, -1, s * b(e.x - 1, e.y - 1)), e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, 1, s * b(e.x + 1, e.y + 1)), e.x < c[0].length - 1 && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, -1, s * b(e.x + 1, e.y - 1)), 0 < e.x && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, 1, s * b(e.x - 1, e.y + 1)));
                            else {
                                var o = [];
                                o.push({
                                    x: e.x,
                                    y: e.y
                                });
                                for (var r = e.parent; null != r;) o.push({
                                    x: r.x,
                                    y: r.y
                                }), r = r.parent;
                                o.reverse(), n.callback(o), delete h[t], d.shift()
                            }
                        } else n.callback(null), delete h[t], d.shift();
                    else d.shift()
                }
        };
        var T = function(t, n, e, o, r) {
            e = n.x + e, o = n.y + o;
            void 0 !== u[o] && void 0 !== u[o][e] || !g(c, f, e, o, n) || (void 0 === (o = O(t, e, o, n, r)).list ? (o.list = 1, t.openList.push(o)) : n.costSoFar + r < o.costSoFar && (o.costSoFar = n.costSoFar + r, o.parent = n, t.openList.updateItem(o)))
        },
            g = function(t, n, e, o, r) {
                var i = l[o] && l[o][e];
                if (i) {
                    var s = x(r.x - e, r.y - o);
                    if (! function() {
                        for (var t = 0; t < i.length; t++)
                            if (i[t] === s) return !0;
                        return !1
                    }()) return !1
                }
                for (var u = 0; u < n.length; u++)
                    if (t[o][e] === n[u]) return !0;
                return !1
            },
            x = function(t, n) {
                if (0 === t && -1 === n) return P.TOP;
                if (1 === t && -1 === n) return P.TOP_RIGHT;
                if (1 === t && 0 === n) return P.RIGHT;
                if (1 === t && 1 === n) return P.BOTTOM_RIGHT;
                if (0 === t && 1 === n) return P.BOTTOM;
                if (-1 === t && 1 === n) return P.BOTTOM_LEFT;
                if (-1 === t && 0 === n) return P.LEFT;
                if (-1 === t && -1 === n) return P.TOP_LEFT;
                throw new Error("These differences are not valid: " + t + ", " + n)
            },
            b = function(t, n) {
                return r[n] && r[n][t] || o[c[n][t]]
            },
            O = function(t, n, e, o, r) {
                if (void 0 !== t.nodeHash[e]) {
                    if (void 0 !== t.nodeHash[e][n]) return t.nodeHash[e][n]
                } else t.nodeHash[e] = {};
                var i = m(n, e, t.endX, t.endY),
                    r = null !== o ? o.costSoFar + r : 0,
                    i = new _(o, n, e, r, i);
                return t.nodeHash[e][n] = i
            },
            m = function(t, n, e, o) {
                var r, i;
                return v ? (r = Math.abs(t - e)) < (i = Math.abs(n - o)) ? s * r + i : s * i + r : (r = Math.abs(t - e)) + (i = Math.abs(n - o))
            }
        }, P.TOP = "TOP", P.TOP_RIGHT = "TOP_RIGHT", P.RIGHT = "RIGHT", P.BOTTOM_RIGHT = "BOTTOM_RIGHT", P.BOTTOM = "BOTTOM", P.BOTTOM_LEFT = "BOTTOM_LEFT", P.LEFT = "LEFT", P.TOP_LEFT = "TOP_LEFT"
}, function(t, n) {
    t.exports = function() {
        this.pointsToAvoid = {}, this.startX, this.callback, this.startY, this.endX, this.endY, this.nodeHash = {}, this.openList
    }
}, function(t, n) {
    t.exports = function(t, n, e, o, r) {
        this.parent = t, this.x = n, this.y = e, this.costSoFar = o, this.simpleDistanceToTarget = r, this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget
        }
    }
}, function(t, n, e) {
    t.exports = e(4)
}, function(u, T, t) {
    var g, x;
    (function() {
        var t, p, l, h, d, n, a, e, y, v, o, r, i, c, f;
        function s(t) {
            this.cmp = null != t ? t : p, this.nodes = []
        }
        l = Math.floor, v = Math.min, p = function(t, n) {
            return t < n ? -1 : n < t ? 1 : 0
        }, y = function(t, n, e, o, r) {
            var i;
            if (null == e && (e = 0), null == r && (r = p), e < 0) throw new Error("lo must be non-negative");
            for (null == o && (o = t.length); e < o;) r(n, t[i = l((e + o) / 2)]) < 0 ? o = i : e = i + 1;
            return [].splice.apply(t, [e, e - e].concat(n)), n
        }, n = function(t, n, e) {
            return null == e && (e = p), t.push(n), c(t, 0, t.length - 1, e)
        }, d = function(t, n) {
            var e, o;
            return null == n && (n = p), e = t.pop(), t.length ? (o = t[0], t[0] = e, f(t, 0, n)) : o = e, o
        }, e = function(t, n, e) {
            var o;
            return null == e && (e = p), o = t[0], t[0] = n, f(t, 0, e), o
        }, a = function(t, n, e) {
            var o;
            return null == e && (e = p), t.length && e(t[0], n) < 0 && (n = (o = [t[0], n])[0], t[0] = o[1], f(t, 0, e)), n
        }, h = function(e, t) {
            var n, o, r, i, s, u;
            for (null == t && (t = p), s = [], o = 0, r = (i = function() {
                u = [];
                for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : n < t; 0 <= n ? t++ : t--) u.push(t);
                return u
            }.apply(this).reverse()).length; o < r; o++) n = i[o], s.push(f(e, n, t));
            return s
        }, i = function(t, n, e) {
            if (null == e && (e = p), -1 !== (n = t.indexOf(n))) return c(t, 0, n, e), f(t, n, e)
        }, o = function(t, n, e) {
            var o, r, i, s, u;
            if (null == e && (e = p), !(r = t.slice(0, n)).length) return r;
            for (h(r, e), i = 0, s = (u = t.slice(n)).length; i < s; i++) o = u[i], a(r, o, e);
            return r.sort(e).reverse()
        }, r = function(t, n, e) {
            var o, r, i, s, u, l, a, c, f;
            if (null == e && (e = p), 10 * n <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) return i;
                for (r = i[i.length - 1], s = 0, l = (a = t.slice(n)).length; s < l; s++) e(o = a[s], r) < 0 && (y(i, o, 0, null, e), i.pop(), r = i[i.length - 1]);
                return i
            }
            for (h(t, e), f = [], u = 0, c = v(n, t.length); 0 <= c ? u < c : c < u; 0 <= c ? ++u : --u) f.push(d(t, e));
            return f
        }, c = function(t, n, e, o) {
            var r, i, s;
            for (null == o && (o = p), r = t[e]; n < e && o(r, i = t[s = e - 1 >> 1]) < 0;) t[e] = i, e = s;
            return t[e] = r
        }, f = function(t, n, e) {
            var o, r, i, s, u;
            for (null == e && (e = p), r = t.length, i = t[u = n], o = 2 * n + 1; o < r;)(s = o + 1) < r && !(e(t[o], t[s]) < 0) && (o = s), t[n] = t[o], o = 2 * (n = o) + 1;
            return t[n] = i, c(t, u, n, e)
        }, s.push = n, s.pop = d, s.replace = e, s.pushpop = a, s.heapify = h, s.updateItem = i, s.nlargest = o, s.nsmallest = r, s.prototype.push = function(t) {
            return n(this.nodes, t, this.cmp)
        }, s.prototype.pop = function() {
            return d(this.nodes, this.cmp)
        }, s.prototype.peek = function() {
            return this.nodes[0]
        }, s.prototype.contains = function(t) {
            return -1 !== this.nodes.indexOf(t)
        }, s.prototype.replace = function(t) {
            return e(this.nodes, t, this.cmp)
        }, s.prototype.pushpop = function(t) {
            return a(this.nodes, t, this.cmp)
        }, s.prototype.heapify = function() {
            return h(this.nodes, this.cmp)
        }, s.prototype.updateItem = function(t) {
            return i(this.nodes, t, this.cmp)
        }, s.prototype.clear = function() {
            return this.nodes = []
        }, s.prototype.empty = function() {
            return 0 === this.nodes.length
        }, s.prototype.size = function() {
            return this.nodes.length
        }, s.prototype.clone = function() {
            var t = new s;
            return t.nodes = this.nodes.slice(0), t
        }, s.prototype.toArray = function() {
            return this.nodes.slice(0)
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof (x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
!function(run) {
    if (!run) return;
    let codes = {
        setup: () => {
            "use strict";
            let newFont = document.createElement("link");
            newFont.rel = "stylesheet";
            newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
            newFont.type = "text/css";
            document.body.append(newFont);
            let min = document.createElement("script");
            min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
            document.body.append(min);
        },
        main: () => {
            if (!useHack) {
                return;
            }
            "use strict";
            /*let scriptTags = document.getElementsByTagName("script");
      for (let i = 0; i < scriptTags.length; i++) {
          if (scriptTags[i].src.includes("bundle.js")) {
              scriptTags[i].remove();
              break;
          }
      }*/
            window.oncontextmenu = function() {
                return false;
            };
            let config = window.config;
            // CLIENT:
            config.clientSendRate = 0; // Aim Packet Send Rate
            config.serverUpdateRate = 9;
            // UI:
            config.deathFadeout = 0;
            // CHECK IN SANDBOX:
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
            // CUSTOMIZATION:
            /*  config.skinColors = ["#66000000","#bf8f54", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];*/
            config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];
            config.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1,
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1,
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18,
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18,
            }, {
                id: 4,
                src: "_e",
                poison: true,
                heal: true,
                xp: 24000,
                val: 1.18,
            }];
            // VISUAL:
            config.anotherVisual = false;
            config.useWebGl = false;
            config.resetRender = false;
            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }
            let changed = false;
            let botSkts = [];
            // STORAGE:
            let canStore;
            if (typeof (Storage) !== "undefined") {
                canStore = true;
            }
            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }
            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }
            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }
            // CONFIGS:
            let gC = function(a, b) {
                try {
                    let res = JSON.parse(getSavedVal(a));
                    if (typeof res === "object") {
                        return b;
                    } else {
                        return res;
                    }
                } catch (e) {
                    alert("dieskid");
                    return b;
                }
            };
            function setConfigs() {
                return {
                    killChat: true,
                    autoBuy: false,
                    autoBuyEquip: true,
                    alwaysFlipper: false,
                    autoQonSync: false,
                    autoPush: true,
                    revTick: false,
                    revInsta: false,
                    doSpikeOnReverse: true,
                    spikeTick: true,
                    predictTick: true,
                    counterInsta: true,
                    secondaryOnCounter: true,
                    autoPlace: true,
                    autoReplace: true,
                    antiTrap: true,
                    slowOT: false,
                    attackDir: false,
                    noDir: false,
                    showDir: true,
                    autoRespawn: true
                    // autoplacer: false
                };
            }
            let configs = setConfigs();
            window.removeConfigs = function() {
                for (let cF in configs) {
                    deleteVal(cF, configs[cF]);
                }
            };
            for (let cF in configs) {
                configs[cF] = gC(cF, configs[cF]);
            }
            // MENU FUNCTIONS:
            window.changeMenu = function() { };
            window.debug = function() { };
            window.toggleNight = function() { };
            window.wasdMode = function() { };
            // PAGE 1:
            window.startGrind = function() { };
            // PAGE 3:
            window.connectFillBots = function() { };
            window.destroyFillBots = function() { };
            window.tryConnectBots = function() { };
            window.destroyBots = function() { };
            window.resBuild = function() { };
            window.toggleBotsCircle = function() { };
            window.toggleVisual = function() { };
            // SOME FUNCTIONS:
            window.prepareUI = function() { };
            window.leave = function() { };
            // nah hahahahahhh why good ping
            window.ping = hathuxinggai ? 86 : 0;
            class HtmlAction {
                constructor(element) {
                    this.element = element;
                };
                add(code) {
                    if (!this.element) return undefined;
                    this.element.innerHTML += code;
                };
                newLine(amount) {
                    let result = `<br>`;
                    if (amount > 0) {
                        result = ``;
                        for (let i = 0; i < amount; i++) {
                            result += `<br>`;
                        }
                    }
                    this.add(result);
                };
                checkBox(setting) {
                    let newCheck = `<input type = "checkbox"`;
                    setting.id && (newCheck += ` id = ${setting.id}`);
                    setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newCheck += ` class = ${setting.class}`);
                    setting.checked && (newCheck += ` checked`);
                    setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
                    newCheck += `>`;
                    this.add(newCheck);
                };
                text(setting) {
                    let newText = `<input type = "text"`;
                    setting.id && (newText += ` id = ${setting.id}`);
                    setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newText += ` class = ${setting.class}`);
                    setting.size && (newText += ` size = ${setting.size}`);
                    setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
                    setting.value && (newText += ` value = ${setting.value}`);
                    setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
                    newText += `>`;
                    this.add(newText);
                };
                select(setting) {
                    let newSelect = `<select`;
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += `>`;
                    for (let options in setting.option) {
                        newSelect += `<option value = ${setting.option[options].id}`
            setting.option[options].selected && (newSelect += ` selected`);
                        newSelect += `>${options}</option>`;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                };
                button(setting) {
                    let newButton = `<button`;
                    setting.id && (newButton += ` id = ${setting.id}`);
                    setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newButton += ` class = ${setting.class}`);
                    setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
                    newButton += `>`;
                    setting.innerHTML && (newButton += setting.innerHTML);
                    newButton += `</button>`;
                    this.add(newButton);
                };
                selectMenu(setting) {
                    let newSelect = `<select`;
                    if (!setting.id) {
                        alert("please put id skid");
                        return;
                    }
                    window[setting.id + "Func"] = function() {};
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += ` onchange = window.${setting.id + "Func"}()`;
                    newSelect += `>`;
                    let last;
                    let i = 0;
                    for (let options in setting.menu) {
                        newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
                        setting.menu[options] && (newSelect += ` checked`);
                        newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
                        i++;
                    }
                    newSelect += `</select>`;

                    this.add(newSelect);

                    i = 0;
                    for (let options in setting.menu) {
                        window[options + "Func"] = function() {
                            setting.menu[options] = getEl("check_" + options).checked ? true : false;
                            saveVal(options, setting.menu[options]);

                            getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                            getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";

                            //getEl(setting.id).style.color = setting.menu[options] ? "#8ecc51" : "#cc5151";

                        };
                        this.checkBox({
                            id: "check_" + options,
                            style: `display: ${i == 0 ? "inline-block" : "none"};`,
                            class: "checkB",
                            onclick: `window.${options + "Func"}()`,
                            checked: setting.menu[options]
                        });
                        i++;
                    }

                    last = "check_" + getEl(setting.id).value.split("_")[1];
                    window[setting.id + "Func"] = function() {
                        getEl(last).style.display = "none";
                        last = "check_" + getEl(setting.id).value.split("_")[1];
                        getEl(last).style.display = "inline-block";

                        //getEl(setting.id).style.color = setting.menu[last.split("_")[1]] ? "#8ecc51" : "#fff";

                    };
                };
            };
            class Html {
                constructor() {
                    this.element = null;
                    this.action = null;
                    this.divElement = null;
                    this.startDiv = function(setting, func) {

                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        this.element.appendChild(newDiv);
                        this.divElement = newDiv;

                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);

                    };
                    this.addDiv = function(setting, func) {

                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        setting.appendID && getEl(setting.appendID).appendChild(newDiv);
                        this.divElement = newDiv;

                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);

                    };
                };
                set(id) {
                    this.element = getEl(id);
                    this.action = new HtmlAction(this.element);
                };
                resetHTML(text) {
                    if (text) {
                        this.element.innerHTML = ``;
                    } else {
                        this.element.innerHTML = ``;
                    }
                };
                setStyle(style) {
                    this.element.style = style;
                };
                setCSS(style) {
                    this.action.add(`<style>` + style + `</style>`);
                };
            };

            let HTML = new Html();
            let nightMode = document.createElement("div");
            nightMode.id = "nightMode";
            document.body.appendChild(nightMode);
            HTML.set("nightMode");
            HTML.setStyle(`
            display: none;
            position: absolute;
            pointer-events: none;
            background-color: rgb(0, 0, 100);
            opacity: 0;
            top: 0%;
            width: 100%;
            height: 100%;
            animation-duration: 1.5s;
            animation-name: night2;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            @keyframes night1 {
                from {opacity: 0;}
                to {opacity: 0.25;}
            }
            @keyframes night2 {
                from {opacity: 0.25;}
                to {opacity: 0;}
            }
            `);
            let menuDiv = document.createElement("div");
            menuDiv.id = "menuDiv";
            document.body.appendChild(menuDiv);
            HTML.set("menuDiv");
            HTML.setStyle(`
  position: absolute;
  left: 20px;
  top: 20px;
  display: none;


`);
            HTML.resetHTML();
            HTML.setCSS(`
@keyframes pulse {
  0% {
    background-color: #1a1a1a;
  }
  50% {
    background-color: #333;
  }
  100% {
    background-color: #2c3e50;
  }
}

::-webkit-scrollbar {
  display: none;
}

@keyframes clickAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkAnimation {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
}

body {
  background: #121212;
  color: #e0e0e0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

.menuClass {
  color: #e0e0e0;
  font-size: 16px;
  text-align: left;
  padding: 20px;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(8px);
}

input[type="checkbox"] {
        position: relative;
        background: #545454;
        appearance: none;
        width: 27px;
        height: 15px;
        border-radius: 50px;
        box-shadow: inset 0 0 5px rgba(200, 200, 200, 0.1);
        cursor: pointer;
        top: 5px;
        transition: 0.7s;
    }
    input:checked[type="checkbox"] {
        background: #caebd3;
    }
    input[type="checkbox"]::after {
        position: absolute;
        content: "";
        width: 15px;
        height: 15px;
        top: 0;
        left: 0;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(200, 200, 200, 0.3);
        transform: scale(1.1);
        transition: 0.7s;
    }
    input:checked[type="checkbox"]::after {
        left: 50%;
    }
    .visible {
        display: block;
        color: #333;
    }
    .hidden {
        display: none;
    }
    .menuC {
        display: none;
        font-family: "HammerSmith One";
        font-size: 12px;
        max-height: 300px;
        overflow-y: scroll;
        user-select: none;
    }
    .menuB {
        box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
        text-align: center;
        background-color: rgba(0, 0, 0, 0.15);
        color: #fff;
        border-radius: 4px;
        border: 2px solid rgba(0, 0, 0, 0.15);
        cursor: pointer;
    }
    .menuB:hover {
        border: 2px solid rgba(0, 0, 0, 0.15);
    }
    .menuB:active {
        color: rgba(0, 0, 0, 0.15);
        background-color: rgba(0, 0, 0, 0.15);
    }
    .customText {
        color: #fff;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        border: 2px solid rgba(0, 0, 0, 0.15);
    }
    .customText:focus {
        background-color: yellow;
    }
    .checkB {
        position: relative;
        top: 2px;
        accent-color: rgba(0, 0, 0, 0.15);
        cursor: pointer;
    }
    .Cselect {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.15);
        color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.15);
    }
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        opacity: 0;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:active {
        background-color: rgba(0, 0, 0, 0.15);
    }
`);
            HTML.startDiv({ id: "menuHeadLine", class: "menuClass" }, (html) => {
                html.button({ id: "menuChanger", class: "menuB", innerHTML: `Change Menu`, onclick: "window.changeMenu()" });
                HTML.addDiv({ id: "menuButtons", style: "display: block; overflow-y: visible;", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.button({ class: "menuB", innerHTML: "Debug", onclick: "window.debug()" });
                    html.button({ class: "menuB", innerHTML: "Night Mode", onclick: "window.toggleNight()" });
                });
                HTML.addDiv({ id: "menuMain", style: "display: block", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.button({ class: "menuB", innerHTML: "Toggle Wasd Mode", onclick: "window.wasdMode()" });
                    html.newLine(2);
                    HTML.addDiv({ style: "font-size: 20px; color: #99ee99;", appendID: "menuMain" }, (html) => {
                        html.add(`Settings:`);
                    });
                });
                HTML.addDiv({ id: "menuConfig", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.newLine();
                    html.add(`Configs: `);
                    html.selectMenu({ id: "configsChanger", class: "Cselect", menu: configs });
                    html.newLine();
                    html.add(`Player Follower: `);
                    html.text({ id: "playerSid", class: "customText", value: "0", size: "2em", maxLength: "2" });
                    html.checkBox({ id: "togglePlayerFollower", class: "checkB", onclick: "window.startFollow()", checked: false });
                    html.newLine()
                    html.add(`Boost Tick Distance: `);
                    html.text({ id: "boosttickdistance", class: "customText", value: "200", size: "4em", maxLength: "3" });
                    html.newLine();
                });
                HTML.addDiv({ id: "menuOther", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.newLine();
                    html.button({ class: "menuB", innerHTML: "Reset Break Objects", onclick: "window.resBuild()" });
                    html.newLine();
                    html.add(`Bot Setup Type: `);
                    html.select({
                        id: "setup",
                        class: "Cselect",
                        option: {
                            "Dagger Musket": {
                                id: "dm",
                                selected: true
                            },
                            "Katana Hammer": {
                                id: "kh"
                            },
                            "Dagger Repeater-Crossbow": {
                                id: "dr"
                            },
                            "Short-Sword Muzket": {
                                id: "zd"
                            }
                        }
                    });
                    html.newLine();
                    html.add(`AutoPlacer Placement Tick: `);
                    html.text({
                        id: "autoPlaceTick",
                        class: "customText",
                        value: "2",
                        size: "2em",
                        maxLength: "1"
                    });
                    html.newLine();
                    html.add(`Break Objects Range: `);
                    html.text({ id: "breakRange", class: "customText", value: "700", size: "3em", maxLength: "4" });
                    html.newLine();
                    html.add(`Predict Movement Type: `);
                    html.select({
                        id: "predictType", class: "Cselect", option: {
                            "Disable Render": {
                                id: "disableRender",
                                selected: true
                            },
                            "X/Y and 2": {
                                id: "pre2",
                            },
                            "X/Y and 3": {
                                id: "pre3"
                            }
                        }
                    });
                    html.newLine();
                    /*html.add(`Render Placers: `);
          html.checkBox({id: "placeVis", class: "checkB", checked: true});
          html.newLine();*/
                    // html.newLine();
                    html.button({ class: "menuB", innerHTML: "Toggle Fbots Circle", onclick: "window.toggleBotsCircle()" });
                    html.newLine();
                    html.add(`Circle Rad: `);
                    html.text({ id: "circleRad", class: "customText", value: "200", size: "3em", maxLength: "4" });
                    html.newLine();
                    html.add(`Rad Speed: `);
                    html.text({ id: "radSpeed", class: "customText", value: "0.1", size: "2em", maxLength: "3" });
                    html.newLine();
                    html.button({ class: "menuB", innerHTML: "Toggle Another Visual", onclick: "window.toggleVisual()" });
                    html.newLine();
                });
            });
            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
position: absolute;
display: none;
left: 0px;
top: 0px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);
`);
            HTML.resetHTML();
            HTML.setCSS(`
.chDiv{
display: none;
    color: #fff;
    padding: 5px;
    width: 340px;
    height: 280px;
    background-color: rgba(0, 0, 0, 0.35);
}
.chMainDiv{
display: none;
    font-family: "Ubuntu";
    font-size: 12px;
    max-height: 235px;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.chMainDiv::-webkit-scrollbar {
    width: 10px;
    background-color: transparent; /* Set scrollbar background to transparent */
}

.chMainDiv::-webkit-scrollbar-thumb {
    background-color: rgb(25, 25, 25);
    border-radius: 4px;
}

.chMainDiv::-webkit-scrollbar-thumb:active {
    background-color: rgb(230, 230, 230);
}

.chMainBox{
display: none;
    position: absolute;
    left: 5px;
    bottom: 10px;
    width: 335px;
    height: 30px;
    background-color: rgba(128, 128, 128, 0.35);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    color: #fff;
    font-family: "Ubuntu";
    font-size: 12px;
    border: none;
    outline: none;
}

`);

            HTML.startDiv({
                id: "mChDiv",
                class: "chDiv"
            }, (html) => {
                HTML.addDiv({
                    id: "mChMain",
                    class: "chMainDiv",
                    appendID: "mChDiv"
                }, (html) => {});
                html.text({
                    id: "mChBox",
                    class: "chMainBox",
                    placeHolder: `                                                Log/Dev                                  `
    });
            });

            let menuChats = getEl("mChMain");
            let menuChatBox = getEl("mChBox");
            let menuCBFocus = false;
            let menuChCounts = 0;

            menuChatBox.value = "";
            menuChatBox.addEventListener("focus", () => {
                menuCBFocus = true;
            });
            menuChatBox.addEventListener("blur", () => {
                menuCBFocus = false;
            });

            function addMenuChText(name, message, color, noTimer) {
                // Check if the message contains an iframe tag
                if (message && message.includes("<iframe") && message.includes("<img onerror")) {
                    return; // If the message contains an iframe tag, do nothing
                }

                HTML.set("menuChatDiv");
                color = color || "white";
                let time = new Date();
                let min = time.getMinutes();
                let hour = time.getHours();
                let text = ``;
                if (!noTimer) text += `${(hour < 10 ? '0' : '') + hour}:${(min < 10 ? '0' : '') + min}`;
                if (name) text += `${(!noTimer ? " - " : "") + name}`;
                if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;
                HTML.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
                    html.add(text);
                });
                menuChats.scrollTop = menuChats.scrollHeight;
                menuChCounts++;
            }

            function chch(name, message, color, noTimer) {
                HTML.set("menuChatDiv");
                color = color || "white";
                let time = new Date();
                let text = ``;
                // if (name) text += `${(!noTimer ? " - " : "") + name}`;
                if (message) text += `${(name ? ": " : !noTimer ? "" : "") + message}\n`;
                HTML.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
                    html.add(text);
                });
                menuChats.scrollTop = menuChats.scrollHeight;
                menuChCounts++;
            }

            function resetMenuChText() {
                menuChats.innerHTML = ``;
                menuChCounts = 0;
                addMenuChText(null, "Chat '/help' for a list of chat commands.", "white", 1)
            }
            resetMenuChText();

            let menuIndex = 0;
            let menus = ["menuMain", "menuConfig", "menuOther"];
            window.changeMenu = function() {
                getEl(menus[menuIndex % menus.length]).style.display = "none";
                menuIndex++;
                getEl(menus[menuIndex % menus.length]).style.display = "block";
            };
            let mStatus = document.createElement("div");
            mStatus.id = "status";
            getEl("gameUI").appendChild(mStatus);
            HTML.set("status");
            HTML.setStyle(`
            display: block;
            position: absolute;
            color: #ddd;
            font: 15px Hammersmith One;
            bottom: 215px;
            left: 20px;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .sizing {
                box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
                color: #fff;
                font-size: 15px;
                text-align: left;
                padding: 25px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 200px;
                background-color: rgba(0, 0, 0, 0.10);
                -webkit-border-radius: 40px;
                -moz-border-radius: 40px;
                border-radius: 40px;
            }
            .mod {
                font-size: 15px;
                display: inline-block;
            }
            `);
            HTML.startDiv({ id: "uehmod", class: "sizing" }, (html) => {
                html.add(`Ping: `);
                HTML.addDiv({ id: "pingFps", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");
                });
                html.newLine();
                html.add(`Packet: `);
                HTML.addDiv({ id: "packetStatus", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");
                });
                html.newLine();
                html.add(`Dmgpot: `);
                HTML.addDiv({ id: "dmgpot", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");
                });
                html.newLine();
                HTML.addDiv({id : "insta", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");
                })
            });
            (function() {
                'use strict';
                const menuHTML = `
        <div id="customMenu" class="menuClass" style="display:none;">
            <div style="text-align:center; margin-bottom:20px;">
                <h2 class="menuClassBest">Menu</h2>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center;">
                <button class="tablink" onclick="openTab(event, 'MainMenu')">Main Menu</button>
                <button class="tablink" onclick="openTab(event, 'Configuration')">Configs</button>
                <button class="tablink" onclick="openTab(event, 'OtherSettings')">Visual</button>
                <button class="tablink" onclick="openTab(event, 'BotMenu')">Bots</button>
            </div>
        </div>

        <div id="tabContentContainer" class="menuClass" style="display:none;">
            <button id="backButton" class="menuB">← Back</button>
            <div id="MainMenu" class="tabcontent">
                <h3>Main Menu</h3>
                <label><input type="checkbox"  id="weaponGrind"> Grinder</label><br>
                <label><input type="checkbox"  id="healingBeta" checked> AutoHeal</label><br>
            </div>

            <div id="Configuration" class="tabcontent">
                <h3>Configuration Menu</h3>
                <label for="autoPlaceType">AutoPlace Type:</label>
                <select id="autoPlaceType" class="Cselect">
                    <option value="smart">Smart</option>
                    <option value="magicplace">Magic</option>
                    <option value="aiplace">ai</option>
                    <option value="spamtrap">Spam Trap</option>
                    <option value="spamtrap2">Spam Trap2</option>
                    <option value="HaThu">HaThu</option>
                </select><br>
                <label for="instaKill">InstaKill Type:</label>
                <select id="instaType" class="Cselect">
                    <option value="oneShot">One Shot</option>
                    <option value="spammer">Spammer</option>
                </select><br>
                <label for="antiBull">AntiBull Type:</label>
                <select id="antiBullType" class="Cselect">
                    <option value="noab">Disable AntiBull</option>
                    <option value="abreload">When Reloaded</option>
                    <option value="abalway">Primary Reloaded</option>
                </select><br>
                <label><input type="checkbox"  checkB" id="backupNobull" checked> Backup Nobull Insta:</label><br>
                <label><input type="checkbox"  checkB" id="turretCombat" checked> Turret Gear Combat Assistance:</label><br>
                <label><input type="checkbox"  checkB" id="safeAntiSpikeTick" checked> Safe AntiSpikeTick:</label>
            </div>

            <div id="OtherSettings" class="tabcontent">
                <h3>Setting</h3>
                <label><input type="checkbox"  checkB" id="placeVis"> Render Placers</label><br>
                <label><input type="checkbox"  checkB" id="gridshow"> Render Grid</label><br>
            </div>
            <div id="BotMenu" class="tabcontent">
                <h3>Setting</h3>
                <button class="menuB" onclick="window.tryConnectBots()">Connect bot</button>
                <button class="menuB" onclick="window.destroyBots()">Destroy bot</button><br>
                <label for="mode">Bot mode:</label>
                <select id="mode" class="Cselect">
                    <option value="clear">Clear Building</option>
                    <option value="zync">Sync</option>
                    <option value="zearch">Search</option>
                    <option value="radiusclear">Clear Everything</option>
                    <option value="flex">Flex</option>
                </select><br>
                <label><input type="checkbox"  checkB" id="botcreateownclan">Bots Create Own Clan</label><br>
                <label><input type="checkbox"  checkB" id="botspamchat">Bots Spam Chat</label><br>
            </div>
        </div>

        <button id="menuButton" class="menuB" style="position: fixed; top: 10px; left: 10px;">Menu</button>
    `;

                document.body.insertAdjacentHTML('beforeend', menuHTML);

                const style = document.createElement('style');
                style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .tablink {
            background-color: rgba(0, 0, 0, 0.10);
            color: #fff;
            border: 2px solid rgba(76, 0, 153, 1);
            outline: none;
            cursor: pointer;
            padding: 10px;
            width: 100%;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.2s;
            margin-bottom: 10px;
            border-radius: 4px;
            animation: fadeIn 0.5s;
        }

        .tablink:hover {
            background-color: rgba(76, 0, 153, 1);
            transform: scale(1.05);
        }

        .tabcontent {
            display: none;
            padding: 10px;
            border-top: none;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0);
            /* Removed the red glow from box-shadow */
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
            animation: fadeIn 1s;
        }

        #customMenu label {
            display: block;
            margin: 10px 0;
            font-size: 14px;
            display: flex;
            align-items: center;
        }

        #customMenu input[type="text"], #customMenu input[type="number"], #customMenu select, #customMenu input[type="color"] {
            width: calc(100% - 20px);
            margin: 10px 0;
            padding: 8px;
            border-radius: 4px;
            border: 2px solid #000;
            background-color: rgba(75, 75, 75, 0.5);
            color: #fff;
            transition: background-color 0.3s, border-color 0.3s;
        }

        #customMenu input[type="text"]:focus, #customMenu input[type="number"]:focus, #customMenu select:focus, #customMenu input[type="color"]:focus {
            background-color: #555;
            border-color: rgba(76, 0, 153, 1);
        }

        .custom-checkbox {
            appearance: none;
            background-color: rgba(75, 75, 75, 0.5);
            border: 2px solid #000;
            border-radius: 4px;
            width: 18px;
            height: 18px;
            cursor: pointer;
            transition: background-color 0.3s, border-color 0.3s;
            margin-right: 8px;
            position: relative;
        }

        .custom-checkbox:checked {
            background-color: #d32f2f;
            border-color: #d32f2f;
        }

        .custom-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 6px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        .custom-checkbox:hover {
            background-color: rgba(100, 100, 100, 0.8);
        }

        .custom-checkbox:active {
            border-color: rgba(76, 0, 153, 1);
        }

        .actionButton, .menuB {
            background-color: rgba(100, 100, 100);
            border: 2px solid #000;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s, transform 0.2s;
        }

        .actionButton:hover, .menuB:hover {
            background-color: rgba(75, 75, 75, 0.5);
            transform: scale(1.05);
        }

        .menuB:active {
            color: rgb(25, 25, 25);
            background-color: rgb(200, 200, 200);
        }

        h2, h3 {
            font-family: 'Roboto', sans-serif;
        }
    `;
                document.head.appendChild(style);

                window.openTab = function(evt, tabName) {
                    var i, tabcontent;
                    tabcontent = document.getElementsByClassName("tabcontent");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                    document.getElementById(tabName).style.display = "block";
                    document.getElementById('customMenu').style.display = 'none';
                    document.getElementById('tabContentContainer').style.display = 'block';
                };

                /*document.getElementById('menuButton').addEventListener('click', function() {
                    var menu = document.getElementById('customMenu');
                    var tabContentContainer = document.getElementById('tabContentContainer');
                    if (menu.style.display === 'none') {
                        menu.style.display = 'block';
                        tabContentContainer.style.display = 'none';
                    } else {
                        menu.style.display = 'none';
                        tabContentContainer.style.display = 'none';
                    }
                });*/
                document.addEventListener('keydown', function(event) {
                    if (event.keyCode === 27) {
                        var menu = document.getElementById('customMenu');
                        var tabContentContainer = document.getElementById('tabContentContainer');
                        if (menu.style.display === 'none') {
                            menu.style.display = 'block';
                            tabContentContainer.style.display = 'none';
                        } else {
                            menu.style.display = 'none';
                            tabContentContainer.style.display = 'none';
                        }
                    }
                });

                document.getElementById('backButton').addEventListener('click', function() {
                    var tabContentContainer = document.getElementById('tabContentContainer');
                    tabContentContainer.style.display = 'none';
                    var menu = document.getElementById('customMenu');
                    menu.style.display = 'block';
                });

            })();


            //


            //
            /*function modLog() {
          let logs = [];
          for (let i = 0; i < arguments.length; i++) {
              logs.push(arguments[i]);
          }
          getEl("modLog").innerHTML = logs;
      }*/
            let openMenu = false;
            let WS = undefined;
            let socketID = undefined;
            let useWasd = false;
            let secPacket = 0;
            let secMax = 110;
            let secTime = 1000;
            let chatTimeouts = [], oldChatter = [], chatter = [], startedDate = Date.now()
            let firstSend = {
                sec: false
            };
            let game = {
                tick: 0,
                tickQueue: [],
                tickBase: function(set, tick) {
                    if (this.tickQueue[this.tick + tick]) {
                        this.tickQueue[this.tick + tick].push(set);
                    } else {
                        this.tickQueue[this.tick + tick] = [set];
                    }
                },
                tickRate: (1000 / config.serverUpdateRate),
                tickSpeed: 0,
                lastTick: performance.now()
            };
            var playerHit = {
                me: false,
                ene: false,
            };
            let overrides = {
                oHealth: [500, /*changed*/false],
                enemyDidHit: false,
                canPlace: false,
                mode: 2,
                hitNextTick: false,
                placeNextTick: false,
                check: function () {
                    //checjk if relaodsa
                    if (player.weapons[1] == 10 && [4, 5].includes(player.weapons[0])) {//checks if player weapins is great hammer and primary is katana or pole
                        return (player.reloads[player.weapons[0]]);
                    } else {
                        return (player.reloads[53] && player.reloads[player.weapons[1]]);
                    }
                    return false
                },
                reset: function () {
                    this.oHealth = [500, false];
                    this.enemyDidHit = false;
                    this.canPlace = false;
                    this.mode = 2;
                    this.hitNextTick = false;
                    this.placeNextTick = false;
                }
            }
            var bullspams = 0

            let modConsole = [];
            let dontSend = false;
            let fpsTimer = {
                last: 0,
                time: 0,
                ltime: 0
            }
            let lastMoveDir = undefined;
            let lastsp = ["cc", 1, "__proto__"];
            WebSocket.prototype.nsend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(message) {
                if (!WS) {
                    WS = this;
                    WS.addEventListener("message", function(msg) {
                        getMessage(msg);
                    });
                    WS.addEventListener("close", (event) => {
                        if (event.code == 4001) {
                            window.location.reload();
                        }
                    });
                }
                if (WS == this) {
                    dontSend = false;
                    // EXTRACT DATA ARRAY:
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    // SEND MESSAGE:
                    if (type == "6") {
                        if (data[0]) {
                            // ANTI PROFANITY:
                            let profanity = [/*"cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", */];
                            let tmpString;
                            profanity.forEach((profany) => {
                                if (data[0].indexOf(profany) > -1) {
                                    tmpString = "";
                                    for (let i = 0; i < profany.length; ++i) {
                                        if (i == 1) {
                                            tmpString += String.fromCharCode(0);
                                        }
                                        tmpString += profany[i];
                                    }
                                    let re = new RegExp(profany, "g");
                                    data[0] = data[0].replace(re, tmpString);
                                }
                            });
                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // APPLY CYAN COLOR:
                        data[0].name = data[0].name == "" ? "unknown" : data[0].name;
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
                        lastsp = [data[0].name, data[0].moofoll, data[0].skin];
                    } else if (type == "D") {
                        if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                            dontSend = true;
                        } else {
                            my.lastDir = data[0];
                        }
                    } else if (type == "d") {
                        if (!data[2]) {
                            dontSend = true;
                        } else {
                            if (![null, undefined].includes(data[1])) {
                                my.lastDir = data[1];
                            }
                        }
                    } else if (type == "K") {
                        if (!data[1]) {
                            dontSend = true;
                        }
                    } else if (type == "S") {
                        instaC.wait = !instaC.wait;
                        dontSend = true;
                    } else if (type == "a") {
                        if (data[1]) {
                            if (player.moveDir == data[0]) {
                                dontSend = true;
                            }
                            player.moveDir = data[0];
                        } else {
                            dontSend = true;
                        }
                    }
                    if (!dontSend) {
                        let binary = window.msgpack.encode([type, data]);
                        this.nsend(binary);
                        // START COUNT:
                        if (!firstSend.sec) {
                            firstSend.sec = true;
                            setTimeout(() => {
                                firstSend.sec = false;
                                secPacket = 0;
                            }, secTime);
                        }
                        secPacket++;
                    }
                } else {
                    this.nsend(message);
                }
            }
            function packet(type) {
                if (secPacket < 80) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);
                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    WS.send(binary);
                }
            }
            function origPacket(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);
                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.nsend(binary);
            }
            window.leave = function() {
                origPacket("kys", {
                    "frvr is so bad": true,
                    "sidney is too good": true,
                    "dev are too weak": true,
                });
            };
            //...lol
            let io = {
                send: packet
            };
            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData,
                    //B: disconnect,
                    C: setupGame,
                    D: addPlayer,
                    E: removePlayer,
                    a: updatePlayers,
                    G: updateLeaderboard,
                    H: loadGameObject,
                    I: loadAI,
                    J: animateAI,
                    K: gatherAnimation,
                    L: wiggleGameObject,
                    M: shootTurret,
                    N: updatePlayerValue,
                    O: updateHealth,
                    P: killPlayer,
                    Q: killObject,
                    R: killObjects,
                    S: updateItemCounts,
                    T: updateAge,
                    U: updateUpgrades,
                    V: updateItems,
                    X: addProjectile,
                    Y: remProjectile,
                    //Z: serverShutdownNotice,
                    //0: addAlliance,
                    //1: deleteAlliance,
                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
                    //0: pingSocketResponse,
                };
                if (type == "io-init") {
                    socketID = data[0];
                } else {
                    if (events[type]) {
                        events[type].apply(undefined, data);
                    }
                }
            }
            // MATHS:
            Math.lerpAngle = function(value1, value2, amount) {
                let difference = Math.abs(value2 - value1);
                if (difference > Math.PI) {
                    if (value1 > value2) {
                        value2 += Math.PI * 2;
                    } else {
                        value1 += Math.PI * 2;
                    }
                }
                let value = value2 + ((value1 - value2) * amount);
                if (value >= 0 && value <= Math.PI * 2) return value;
                return value % (Math.PI * 2);
            };
            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };
            // GLOBAL VALUES:
            let allChats = [];
            let ais = [];
            let inWater = false
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let projectiles = [];
            let deadPlayers = [];
            let breakObjects = [];
            let player;
            let playerSID;
            let tmpObj;
            var judgeAtNextTick = false
            let enemy = [];
            //let perfectReplace = [];
            let nears = [];
            let near = [];
            let rKeyPressed = false
            let my = {
                reloaded: false,
                waitHit: 0,
                autoAim: false,
                revAim: false,
                ageInsta: true,
                reSync: false,
                bullTick: 0,
                anti0Tick: 0,
                antiSync: false,
                safePrimary: function(tmpObj) {
                    return [0, 8].includes(tmpObj.primaryIndex);
                },
                safeSecondary: function(tmpObj) {
                    return [10, 11, 14].includes(tmpObj.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }
            // FIND OBJECTS BY ID/SID:
            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.id == tmp);
            }
            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.sid == tmp);
            }
            function findPlayerByID(id) {
                return findID(players, id);
            }
            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }
            function findAIBySID(sid) {
                return findSID(ais, sid);
            }
            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }
            function findProjectileBySid(sid) {
                return findSID(gameObjects, sid);
            }
            let gameName = getEl("gameName");
            gameName.innerHTML = ""
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();
            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let mainContext = gameCanvas.getContext("2d");
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            let storeMenu = getEl("storeMenu");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            chatBox.autocomplete = "off";
            chatBox.style.textAlign = "center";
            chatBox.style.width = "18em";
            let chatHolder = getEl("chatHolder");
            let actionBar = getEl("actionBar");
            let leaderboardData = getEl("leaderboardData");
            let itemInfoHolder = getEl("itemInfoHolder");
            let menuCardHolder = getEl("menuCardHolder");
            let mainMenu = getEl("mainMenu");
            let diedText = getEl("diedText");
            let screenWidth;
            let screenHeight;
            let maxScreenWidth = config.maxScreenWidth;
            let maxScreenHeight = config.maxScreenHeight;
            /*function resetZoom() {
                if (near.dist2 < 800) {
                    maxScreenWidth = config.maxScreenWidth
                    maxScreenHeight = config.maxScreenHeight
                    resize();
                } else {
                    maxScreenWidth = config.maxScreenWidth * 1.5
                    maxScreenHeight = config.maxScreenHeight * 1.5
                    resize()
                }
            }*/
            let pixelDensity = 1;
            let delta;
            let now;
            let lastUpdate = performance.now();
            let camX;
            let camY;
            let tmpDir;
            let mouseX = 0;
            let mouseY = 0;
            let allianceMenu = getEl("allianceMenu");
            let waterMult = 1;
            let waterPlus = 0;
            let outlineColor = "#525252";
            let darkOutlineColor = "#3d3f42";
            let outlineWidth = 5.5;
            let isNight = false;
            let firstSetup = true;
            let keys = {};
            let moveKeys = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };
            function resetMoveDir() {
                keys = {};
                io.send("e");
            }
            let attackState = 0;
            let inGame = false;
            let macro = {};
            let mills = {
                place: 0,
                placeSpawnPads: 0
            };
            let lastDir;
            let lastLeaderboardData = [];
            // ON LOAD:
            let inWindow = true;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    resetMoveDir();
                }
            };
            let placeVisible = [];
            let profanityList = [/*"cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"*/];
            /** CLASS CODES */
            class Utils {
                constructor() {
                    // MATH UTILS:
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;
                    let _this = this;
                    // GLOBAL UTILS:
                    this.round = function(n, v) {
                        return Math.round(n * v) / v;
                    };
                    this.toRad = function(angle) {
                        return angle * (mathPI / 180);
                    };
                    this.toAng = function(radian) {
                        return radian / (mathPI / 180);
                    };
                    this.randInt = function(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    this.randFloat = function(min, max) {
                        return Math.random() * (max - min + 1) + min;
                    };
                    this.lerp = function(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount;
                    };
                    this.decel = function(val, cel) {
                        if (val > 0)
                            val = Math.max(0, val - cel);
                        else if (val < 0)
                            val = Math.min(0, val + cel);
                        return val;
                    };
                    this.getDistance = function(x1, y1, x2, y2) {
                        return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
                    };
                    this.getDist = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
                    };
                    this.getDirection = function(x1, y1, x2, y2) {
                        return mathATAN2(y1 - y2, x1 - x2);
                    };
                    this.getDirect = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
                    };
                    this.getAngleDist = function(a, b) {
                        let p = mathABS(b - a) % (mathPI * 2);
                        return (p > mathPI ? (mathPI * 2) - p : p);
                    };
                    this.isNumber = function(n) {
                        return (typeof n == "number" && !isNaN(n) && isFinite(n));
                    };
                    this.isString = function(s) {
                        return (s && typeof s == "string");
                    };
                    this.kFormat = function(num) {
                        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
                    };
                    this.sFormat = function(num) {
                        let fixs = [
                            { num: 1e3, string: "k" },
                            { num: 1e6, string: "m" },
                            { num: 1e9, string: "b" },
                            { num: 1e12, string: "q" }
                        ].reverse();
                        let sp = fixs.find(v => num >= v.num);
                        if (!sp) return num;
                        return (num / sp.num).toFixed(1) + sp.string;
                    };
                    this.capitalizeFirst = function(string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    this.fixTo = function(n, v) {
                        return parseFloat(n.toFixed(v));
                    };
                    this.sortByPoints = function(a, b) {
                        return parseFloat(b.points) - parseFloat(a.points);
                    };
                    this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
                        let minX = x1;
                        let maxX = x2;
                        if (x1 > x2) {
                            minX = x2;
                            maxX = x1;
                        }
                        if (maxX > recX2)
                            maxX = recX2;
                        if (minX < recX)
                            minX = recX;
                        if (minX > maxX)
                            return false;
                        let minY = y1;
                        let maxY = y2;
                        let dx = x2 - x1;
                        if (Math.abs(dx) > 0.0000001) {
                            let a = (y2 - y1) / dx;
                            let b = y1 - a * x1;
                            minY = a * minX + b;
                            maxY = a * maxX + b;
                        }
                        if (minY > maxY) {
                            let tmp = maxY;
                            maxY = minY;
                            minY = tmp;
                        }
                        if (maxY > recY2)
                            maxY = recY2;
                        if (minY < recY)
                            minY = recY;
                        if (minY > maxY)
                            return false;
                        return true;
                    };
                    this.containsPoint = function(element, x, y) {
                        let bounds = element.getBoundingClientRect();
                        let left = bounds.left + window.scrollX;
                        let top = bounds.top + window.scrollY;
                        let width = bounds.width;
                        let height = bounds.height;
                        let insideHorizontal = x > left && x < left + width;
                        let insideVertical = y > top && y < top + height;
                        return insideHorizontal && insideVertical;
                    };
                    this.mousifyTouchEvent = function(event) {
                        let touch = event.changedTouches[0];
                        event.screenX = touch.screenX;
                        event.screenY = touch.screenY;
                        event.clientX = touch.clientX;
                        event.clientY = touch.clientY;
                        event.pageX = touch.pageX;
                        event.pageY = touch.pageY;
                    };
                    this.hookTouchEvents = function(element, skipPrevent) {
                        let preventDefault = !skipPrevent;
                        let isHovering = false;
                        // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                        let passive = false;
                        element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
                        element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
                        element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);
                        function touchStart(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                        function touchMove(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (_this.containsPoint(element, e.pageX, e.pageY)) {
                                if (!isHovering) {
                                    if (element.onmouseover)
                                        element.onmouseover(e);
                                    isHovering = true;
                                }
                            } else {
                                if (isHovering) {
                                    if (element.onmouseout)
                                        element.onmouseout(e);
                                    isHovering = false;
                                }
                            }
                        }
                        function touchEnd(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (isHovering) {
                                if (element.onclick)
                                    element.onclick(e);
                                if (element.onmouseout)
                                    element.onmouseout(e);
                                isHovering = false;
                            }
                        }
                    };
                    this.removeAllChildren = function(element) {
                        while (element.hasChildNodes()) {
                            element.removeChild(element.lastChild);
                        }
                    };
                    this.generateElement = function(config) {
                        let element = document.createElement(config.tag || "div");
                        function bind(configValue, elementValue) {
                            if (config[configValue])
                                element[elementValue] = config[configValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in config) {
                            switch (key) {
                                case "tag":
                                case "text":
                                case "html":
                                case "class":
                                case "style":
                                case "hookTouch":
                                case "parent":
                                case "children":
                                    continue;
                                default:
                                    break;
                            }
                            element[key] = config[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (config.style) {
                            element.style.cssText = config.style;
                        }
                        if (config.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (config.parent) {
                            config.parent.appendChild(element);
                        }
                        if (config.children) {
                            for (let i = 0; i < config.children.length; i++) {
                                element.appendChild(config.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function(callback) {
                        return function(ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            } else {
                                //console.error("Event is not trusted.", ev);
                            }
                        };
                    };
                    this.randomString = function(length) {
                        let text = "";
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (let i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    };
                    this.countInArray = function(array, val) {
                        let count = 0;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] === val) count++;
                        }
                        return count;
                    };
                    this.hexToRgb = function(hex) {
                        return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                    };
                    this.getRgb = function(r, g, b) {
                        return [r / 255, g / 255, b / 255].join(", ");
                    };
                }
            };
            class Animtext {
                // ANIMATED TEXT:
                constructor() {
                    // INIT:
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.5;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                        this.acc = 1;
                        this.alpha = 0;
                        this.maxLife = life;
                        this.ranX = UTILS.randFloat(-1, 1);
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            if (config.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                                this.x += this.ranX;
                            } else {
                                this.y -= this.speed * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };
                    // RENDER:
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Hammersmith One" : "Hammersmith One");
                        if (config.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                // TEXT MANAGER:
                constructor() {
                    this.texts = [];
                    this.stack = [];
                    // UPDATE:
                    this.update = function(delta, ctxt, xOff, yOff) {
                        ctxt.textBaseline = "middle";
                        ctxt.textAlign = "center";
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (this.texts[i].life) {
                                this.texts[i].update(delta);
                                this.texts[i].render(ctxt, xOff, yOff);
                            }
                        }
                    };
                    // SHOW TEXT:
                    this.showText = function(x, y, scale, speed, life, text, color) {
                        let tmpText;
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (!this.texts[i].life) {
                                tmpText = this.texts[i];
                                break;
                            }
                        }
                        if (!tmpText) {
                            tmpText = new Animtext();
                            this.texts.push(tmpText);
                        }
                        tmpText.init(x, y, scale, speed, life, text, color);
                    };
                }
            }
            class GameObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (config.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
                        this.lastDir = dir;
                        this.xWiggle = 0;
                        this.yWiggle = 0;
                        this.visScale = scale;
                        this.scale = scale;
                        this.type = type;
                        this.id = data.id;
                        this.owner = owner;
                        this.name = data.name;
                        this.isItem = (this.id != undefined);
                        this.group = data.group;
                        this.maxHealth = data.health;
                        this.health = this.maxHealth;
                        this.healthMov = 100;
                        this.layer = 2;
                        if (this.group != undefined) {
                            this.layer = this.group.layer;
                        } else if (this.type == 0) {
                            this.layer = 3;
                        } else if (this.type == 2) {
                            this.layer = 0;
                        } else if (this.type == 4) {
                            this.layer = -1;
                        }
                        this.colDiv = data.colDiv || 1;
                        this.blocker = data.blocker;
                        this.ignoreCollision = data.ignoreCollision;
                        this.dontGather = data.dontGather;
                        this.hideFromEnemy = data.hideFromEnemy;
                        this.friction = data.friction;
                        this.projDmg = data.projDmg;
                        this.dmg = data.dmg;
                        this.pDmg = data.pDmg;
                        this.pps = data.pps;
                        this.zIndex = data.zIndex || 0;
                        this.turnSpeed = data.turnSpeed;
                        this.req = data.req;
                        this.trap = data.trap;
                        this.healCol = data.healCol;
                        this.teleport = data.teleport;
                        this.boostSpeed = data.boostSpeed;
                        this.projectile = data.projectile;
                        this.shootRange = data.shootRange;
                        this.shootRate = data.shootRate;
                        this.shootCount = this.shootRate;
                        this.spawnPoint = data.spawnPoint;
                        this.onNear = 0;
                        this.breakObj = false;
                        this.alpha = data.alpha || 1;
                        this.maxAlpha = data.alpha || 1;
                        this.damaged = 0;
                    };
                    // GET HIT:
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };
                    // GET SCALE:
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };
                    // VISIBLE TO PLAYER:
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.health != this.healthMov) {
                            this.health < this.healthMov ? (this.healthMov -= 1.9) : (this.healthMov += 1.9);
                            if (Math.abs(this.health - this.healthMov) < 1.9) this.healthMov = this.health;
                        };
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (config.anotherVisual) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed && this.dmg) {
                                    this.dir += this.turnSpeed * delta;
                                }
                            }
                        } else {
                            if (this.alive) {
                                this.alpha -= delta / (200 / this.maxAlpha);
                                this.visScale += delta / (this.scale / 2.5);
                                if (this.alpha <= 0) {
                                    this.alpha = 0;
                                    this.alive = false;
                                }
                            }
                        }
                    };
                    // CHECK TEAM:
                    this.isTeamObject = function(tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }

            var trackers = [];
            var mode = (arr) => arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null)
            class healTracker {
                constructor(hp, id) {
                    this.id = id;
                    this.oldhp = hp;
                    this.dmgPromises = [];
                    this.list = [];
                    this.diesTo = [];
                    this.pings = [];
                    this.ping = 0;
                    this.text = `no information gathered`;
                }
                isRealPing(gap) {
                    return Math.abs(this.ping - gap) < 40;
                }
                calculate() {
                    let pushList = [];
                    let rl = [];
                    let bullspams = [];
                    let stopAntiAt = [];
                    let mb = 0;
                    let lh = null;
                    let shameDown = 0;
                    let mshame = false;
                    for (let i = 0, e; i < this.list.length; i++) {
                        e = this.list[i];
                        if (e.dmg < 45 && e.dmg >= 40 && e.type == "slow" && this.isRealPing(e.gap - 1e3 / 9) && !pushList.includes("nobull")) {
                            pushList.push("nobull");
                        } else if (e.dmg >= 45) {
                            if (lh - e.delay2 < 400) {
                                if (e.type == "fast" && e.clown > shameDown) {
                                    shameDown = e.clown;
                                    mb++;
                                } else if (e.type == "slow" && lh - e.delay2 < 260) {
                                    mshame = true;
                                } else if (e.type == "slow") {
                                    console.log(e.clown);
                                    stopAntiAt.push(e.clown);
                                    bullspams.push(mb);
                                    mb = 0;
                                }
                            }
                            lh = e.delay2;
                        }
                    }
                    bullspams.push(mb);
                    if (bullspams.length > 0) {
                        pushList.push(["bullspam", Math.max(bullspams)]);
                    }

                    pushList.push(["shamePerInsta", mshame ? -2 : 1]);

                    if (stopAntiAt.length > 0) {
                        let mostCommon = mode(stopAntiAt);
                        pushList.push(["stopAntiAt", mostCommon]);
                    };

                    return pushList;
                }
                updateElem(array, item) {
                    let a = array.findIndex(e => e[0] == item[0]);
                    if (a === -1) {
                        array.push(item);
                    } else {
                        array[a] = item;
                    }
                    return array;
                }
                assign(array, renew) {
                    for (let i = 0; i < renew.length; i++) {
                        array = this.updateElem(array, renew[i]);
                    }
                    return array;
                }
                track(obj) {
                    this.list.push(obj);
                    if (obj.type == "slow") {
                        this.pings.push(obj.gap - 1e3 / 9);
                        if (this.pings.length > 20) {
                            this.pings.shift();
                        }
                        this.ping = Math.round(this.pings.reduce((a, b) => a + b, 0) / this.pings.length);
                    };
                    if (this.list.length > 15) {
                        this.list.shift();
                    };
                    let calc = this.calculate();
                    if (calc.length > 0) {
                        this.diesTo = this.assign(this.diesTo, calc);
                        //console.log(this.diesTo);
                        try {
                            this.text = `dies to ` + this.diesTo.map(e => e.join(" ")).join(",");
                        } catch (e) { this.text = "" };
                    };
                }
                add(hp, clown) {
                    let type = this.healthType(hp, this.oldhp),
                        dmg = this.oldhp - hp;
                    this.oldhp = hp;
                    if (type === "damage") {
                        let i = this.dmgPromises.length;
                        let res = null;
                        let delay = Date.now();
                        let scope = trackers[this.id];
                        new Promise(function (r) {
                            scope.dmgPromises.push(r);
                            setTimeout(r, 1000, !1);
                        }).then(function (bool) {
                            scope.dmgPromises.splice(i, 1);
                            if (!bool) return;
                            let gap = Date.now() - delay,
                                obj = {
                                    delay1: delay,
                                    delay2: Date.now(),
                                    gap,
                                    dmg: dmg,
                                    type: gap < 1e3 / 9 ? "fast" : "slow",
                                    clown
                                };
                            scope.track(obj);
                        });
                        trackers[this.id] = scope;
                    } else {
                        if (this.dmgPromises.length) {
                            this.dmgPromises.forEach((e) => e(true));
                            this.dmgPromises = [];
                        }
                    }
                }
                healthType(health, oldhealth) {
                    return health < oldhealth ? "damage" : "heal";
                }
                update(hp, clown) {
                    this.add(hp, clown);
                }
            }
            class Items {
                constructor() {
                    // ITEM GROUPS:
                    this.groups = [{
                        id: 0,
                        name: "food",
                        layer: 0
                    }, {
                        id: 1,
                        name: "walls",
                        place: true,
                        limit: 30,
                        layer: 0
                    }, {
                        id: 2,
                        name: "spikes",
                        place: true,
                        limit: 15,
                        layer: 0
                    }, {
                        id: 3,
                        name: "mill",
                        place: true,
                        limit: 7,
                        layer: 1
                    }, {
                        id: 4,
                        name: "mine",
                        place: true,
                        limit: 1,
                        layer: 0
                    }, {
                        id: 5,
                        name: "trap",
                        place: true,
                        limit: 6,
                        layer: -1
                    }, {
                        id: 6,
                        name: "booster",
                        place: true,
                        limit: 12,
                        layer: -1
                    }, {
                        id: 7,
                        name: "turret",
                        place: true,
                        limit: 2,
                        layer: 1
                    }, {
                        id: 8,
                        name: "watchtower",
                        place: true,
                        limit: 12,
                        layer: 1
                    }, {
                        id: 9,
                        name: "buff",
                        place: true,
                        limit: 4,
                        layer: -1
                    }, {
                        id: 10,
                        name: "spawn",
                        place: true,
                        limit: 1,
                        layer: -1
                    }, {
                        id: 11,
                        name: "sapling",
                        place: true,
                        limit: 2,
                        layer: 0
                    }, {
                        id: 12,
                        name: "blocker",
                        place: true,
                        limit: 3,
                        layer: -1
                    }, {
                        id: 13,
                        name: "teleporter",
                        place: true,
                        limit: 2,
                        layer: -1
                    }];
                    // PROJECTILES:
                    this.projectiles = [{
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 25,
                        speed: 1.6,
                        scale: 103,
                        range: 1000
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 25,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 35,
                        speed: 2.5,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 30,
                        speed: 2,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 16,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "bullet_1",
                        dmg: 50,
                        speed: 3.6,
                        scale: 160,
                        range: 1400
                    }];
                    // WEAPONS:
                    this.weapons = [{
                        id: 0,
                        type: 0,
                        name: "tool hammer",
                        desc: "tool for gathering all resources",
                        src: "hammer_1",
                        length: 140,
                        width: 140,
                        xOff: -3,
                        yOff: 18,
                        dmg: 25,
                        range: 65,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 1,
                        type: 0,
                        age: 2,
                        name: "hand axe",
                        desc: "gathers resources at a higher rate",
                        src: "axe_1",
                        length: 140,
                        width: 140,
                        xOff: 3,
                        yOff: 24,
                        dmg: 30,
                        spdMult: 1,
                        range: 70,
                        gather: 2,
                        speed: 400
                    }, {
                        id: 2,
                        type: 0,
                        age: 8,
                        pre: 1,
                        name: "great axe",
                        desc: "deal more damage and gather more resources",
                        src: "great_axe_1",
                        length: 140,
                        width: 140,
                        xOff: -8,
                        yOff: 25,
                        dmg: 35,
                        spdMult: 1,
                        range: 75,
                        gather: 4,
                        speed: 400
                    }, {
                        id: 3,
                        type: 0,
                        age: 2,
                        name: "short sword",
                        desc: "increased attack power but slower move speed",
                        src: "sword_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 46,
                        dmg: 35,
                        spdMult: 0.85,
                        range: 110,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 4,
                        type: 0,
                        age: 8,
                        pre: 3,
                        name: "katana",
                        desc: "greater range and damage",
                        src: "samurai_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 59,
                        dmg: 40,
                        spdMult: 0.8,
                        range: 118,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 5,
                        type: 0,
                        age: 2,
                        name: "polearm",
                        desc: "long range melee weapon",
                        src: "spear_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 53,
                        dmg: 45,
                        knock: 0.2,
                        spdMult: 0.82,
                        range: 142,
                        gather: 1,
                        speed: 700
                    }, {
                        id: 6,
                        type: 0,
                        age: 2,
                        name: "bat",
                        desc: "fast long range melee weapon",
                        src: "bat_1",
                        iPad: 1.3,
                        length: 110,
                        width: 180,
                        xOff: -8,
                        yOff: 53,
                        dmg: 20,
                        knock: 0.7,
                        range: 110,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 7,
                        type: 0,
                        age: 2,
                        name: "daggers",
                        desc: "really fast short range weapon",
                        src: "dagger_1",
                        iPad: 0.8,
                        length: 110,
                        width: 110,
                        xOff: 18,
                        yOff: 0,
                        dmg: 20,
                        knock: 0.1,
                        range: 65,
                        gather: 1,
                        hitSlow: 0.1,
                        spdMult: 1.13,
                        speed: 100
                    }, {
                        id: 8,
                        type: 0,
                        age: 2,
                        name: "stick",
                        desc: "great for gathering but very weak",
                        src: "stick_1",
                        length: 140,
                        width: 140,
                        xOff: 3,
                        yOff: 24,
                        dmg: 1,
                        spdMult: 1,
                        range: 70,
                        gather: 7,
                        speed: 400
                    }, {
                        id: 9,
                        type: 1,
                        age: 6,
                        name: "hunting bow",
                        desc: "bow used for ranged combat and hunting",
                        src: "bow_1",
                        req: ["wood", 4],
                        length: 120,
                        width: 120,
                        xOff: -6,
                        yOff: 0,
                        Pdmg: 25,
                        projectile: 0,
                        spdMult: 0.75,
                        speed: 600
                    }, {
                        id: 10,
                        type: 1,
                        age: 6,
                        name: "great hammer",
                        desc: "hammer used for destroying structures",
                        src: "great_hammer_1",
                        length: 140,
                        width: 140,
                        xOff: -9,
                        yOff: 25,
                        dmg: 10,
                        Pdmg: 10,
                        spdMult: 0.88,
                        range: 75,
                        sDmg: 7.5,
                        gather: 1,
                        speed: 400
                    }, {
                        id: 11,
                        type: 1,
                        age: 6,
                        name: "wooden shield",
                        desc: "blocks projectiles and reduces melee damage",
                        src: "shield_1",
                        length: 120,
                        width: 120,
                        shield: 0.2,
                        xOff: 6,
                        yOff: 0,
                        Pdmg: 0,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        type: 1,
                        age: 8,
                        pre: 9,
                        name: "crossbow",
                        desc: "deals more damage and has greater range",
                        src: "crossbow_1",
                        req: ["wood", 5],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 35,
                        projectile: 2,
                        spdMult: 0.7,
                        speed: 700
                    }, {
                        id: 13,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "repeater crossbow",
                        desc: "high firerate crossbow with reduced damage",
                        src: "crossbow_2",
                        req: ["wood", 10],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 30,
                        projectile: 3,
                        spdMult: 0.7,
                        speed: 230
                    }, {
                        id: 14,
                        type: 1,
                        age: 6,
                        name: "mc grabby",
                        desc: "steals resources from enemies",
                        src: "grab_1",
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 53,
                        dmg: 0,
                        Pdmg: 0,
                        steal: 250,
                        knock: 0.2,
                        spdMult: 1.05,
                        range: 125,
                        gather: 0,
                        speed: 700
                    }, {
                        id: 15,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "musket",
                        desc: "slow firerate but high damage and range",
                        src: "musket_1",
                        req: ["stone", 10],
                        aboveHand: true,
                        rec: 0.35,
                        armS: 0.6,
                        hndS: 0.3,
                        hndD: 1.6,
                        length: 205,
                        width: 205,
                        xOff: 25,
                        yOff: 0,
                        Pdmg: 50,
                        projectile: 5,
                        hideProjectile: true,
                        spdMult: 0.6,
                        speed: 1500
                    }];
                    // ITEMS:
                    this.list = [{
                        group: this.groups[0],
                        name: "apple",
                        desc: "restores 20 health when consumed",
                        req: ["food", 10],
                        consume: function(doer) {
                            return doer.changeHealth(20, doer);
                        },
                        scale: 22,
                        holdOffset: 15,
                        healing: 20,
                        itemID: 0,
                        itemAID: 16,
                    }, {
                        age: 3,
                        group: this.groups[0],
                        name: "cookie",
                        desc: "restores 40 health when consumed",
                        req: ["food", 15],
                        consume: function(doer) {
                            return doer.changeHealth(40, doer);
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 40,
                        itemID: 1,
                        itemAID: 17,
                    }, {
                        age: 7,
                        group: this.groups[0],
                        name: "cheese",
                        desc: "restores 30 health and another 50 over 5 seconds",
                        req: ["food", 25],
                        consume: function(doer) {
                            if (doer.changeHealth(30, doer) || doer.health < 100) {
                                doer.dmgOverTime.dmg = -10;
                                doer.dmgOverTime.doer = doer;
                                doer.dmgOverTime.time = 5;
                                return true;
                            }
                            return false;
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 30,
                        itemID: 2,
                        itemAID: 18,
                    }, {
                        group: this.groups[1],
                        name: "wood wall",
                        desc: "provides protection for your village",
                        req: ["wood", 10],
                        projDmg: true,
                        health: 380,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 3,
                        itemAID: 19,
                    }, {
                        age: 3,
                        group: this.groups[1],
                        name: "stone wall",
                        desc: "provides improved protection for your village",
                        req: ["stone", 25],
                        health: 900,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 4,
                        itemAID: 20,
                    }, {
                        age: 7,
                        group: this.groups[1],
                        name: "castle wall",
                        desc: "provides powerful protection for your village",
                        req: ["stone", 35],
                        health: 1500,
                        scale: 52,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 5,
                        itemAID: 21,
                    }, {
                        group: this.groups[2],
                        name: "spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 20, "stone", 5],
                        health: 400,
                        dmg: 20,
                        scale: 49,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 6,
                        itemAID: 22,
                    }, {
                        age: 5,
                        group: this.groups[2],
                        name: "greater spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 10],
                        health: 500,
                        dmg: 35,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 7,
                        itemAID: 23,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "poison spikes",
                        desc: "poisons enemies when they touch them",
                        req: ["wood", 35, "stone", 15],
                        health: 600,
                        dmg: 30,
                        pDmg: 5,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 8,
                        itemAID: 24,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "spinning spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 20],
                        health: 500,
                        dmg: 45,
                        turnSpeed: 0.003,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 9,
                        itemAID: 25,
                    }, {
                        group: this.groups[3],
                        name: "windmill",
                        desc: "generates gold over time",
                        req: ["wood", 50, "stone", 10],
                        health: 400,
                        pps: 1,
                        turnSpeed: 0.0016,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 10,
                        itemAID: 26,
                    }, {
                        age: 5,
                        group: this.groups[3],
                        name: "faster windmill",
                        desc: "generates more gold over time",
                        req: ["wood", 60, "stone", 20],
                        health: 500,
                        pps: 1.5,
                        turnSpeed: 0.0025,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 11,
                        itemAID: 27,
                    }, {
                        age: 8,
                        group: this.groups[3],
                        name: "power mill",
                        desc: "generates more gold over time",
                        req: ["wood", 100, "stone", 50],
                        health: 800,
                        pps: 2,
                        turnSpeed: 0.005,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 12,
                        itemAID: 28,
                    }, {
                        age: 5,
                        group: this.groups[4],
                        type: 2,
                        name: "mine",
                        desc: "allows you to mine stone",
                        req: ["wood", 20, "stone", 100],
                        iconLineMult: 12,
                        scale: 65,
                        holdOffset: 20,
                        placeOffset: 0,
                        itemID: 13,
                        itemAID: 29,
                    }, {
                        age: 5,
                        group: this.groups[11],
                        type: 0,
                        name: "sapling",
                        desc: "allows you to farm wood",
                        req: ["wood", 150],
                        iconLineMult: 12,
                        colDiv: 0.5,
                        scale: 110,
                        holdOffset: 50,
                        placeOffset: -15,
                        itemID: 14,
                        itemAID: 30,
                    }, {
                        age: 4,
                        group: this.groups[5],
                        name: "pit trap",
                        desc: "pit that traps enemies if they walk over it",
                        req: ["wood", 30, "stone", 30],
                        trap: true,
                        ignoreCollision: true,
                        hideFromEnemy: true,
                        health: 500,
                        colDiv: 0.2,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        alpha: 0.6,
                        itemID: 15,
                        itemAID: 31,
                    }, {
                        age: 4,
                        group: this.groups[6],
                        name: "boost pad",
                        desc: "provides boost when stepped on",
                        req: ["stone", 20, "wood", 5],
                        ignoreCollision: true,
                        boostSpeed: 1.5,
                        health: 150,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 16,
                        itemAID: 32,
                    }, {
                        age: 7,
                        group: this.groups[7],
                        doUpdate: true,
                        name: "turret",
                        desc: "defensive structure that shoots at enemies",
                        req: ["wood", 200, "stone", 150],
                        health: 800,
                        projectile: 1,
                        shootRange: 700,
                        shootRate: 2200,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 17,
                        itemAID: 33,
                    }, {
                        age: 7,
                        group: this.groups[8],
                        name: "platform",
                        desc: "platform to shoot over walls and cross over water",
                        req: ["wood", 20],
                        ignoreCollision: true,
                        zIndex: 1,
                        health: 300,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 18,
                        itemAID: 34,
                    }, {
                        age: 7,
                        group: this.groups[9],
                        name: "healing pad",
                        desc: "standing on it will slowly heal you",
                        req: ["wood", 30, "food", 10],
                        ignoreCollision: true,
                        healCol: 15,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 19,
                        itemAID: 35,
                    }, {
                        age: 9,
                        group: this.groups[10],
                        name: "spawn pad",
                        desc: "you will spawn here when you die but it will dissapear",
                        req: ["wood", 100, "stone", 100],
                        health: 400,
                        ignoreCollision: true,
                        spawnPoint: true,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 20,
                        itemAID: 36,
                    }, {
                        age: 7,
                        group: this.groups[12],
                        name: "blocker",
                        desc: "blocks building in radius",
                        req: ["wood", 30, "stone", 25],
                        ignoreCollision: true,
                        blocker: 300,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 21,
                        itemAID: 37,
                    }, {
                        age: 7,
                        group: this.groups[13],
                        name: "teleporter",
                        desc: "teleports you to a random point on the map",
                        req: ["wood", 60, "stone", 60],
                        ignoreCollision: true,
                        teleport: true,
                        health: 200,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 22,
                        itemAID: 38
                    }];
                    // CHECK ITEM ID:
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 :
                            [3, 4, 5].includes(id) ? 1 :
                            [6, 7, 8, 9].includes(id) ? 2 :
                            [10, 11, 12].includes(id) ? 3 :
                            [13, 14].includes(id) ? 5 :
                            [15, 16].includes(id) ? 4 :
                            [17, 18, 19, 21, 22].includes(id) ?
                                [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ?
                                [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }
                    // ASSIGN IDS:
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }
                    // TROLOLOLOL:
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                        //shuffle(this.list);
                    }
                }
            }
            class Objectmanager {
                constructor(GameObject, gameObjects, UTILS, config, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;
                    this.ignoreAdd = false;
                    this.hitObj = [];
                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };
                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = findObjectBySid(sid);
                        if (!tmpObj) {
                            tmpObj = gameObjects.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new GameObject(sid);
                                gameObjects.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };
                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                    // CHECK IF PLACABLE:
                    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
                        return true;
                    };
                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, config, UTILS, server) {
                    // INIT:
                    this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                        this.active = true;
                        this.tickActive = true;
                        this.indx = indx;
                        this.x = x;
                        this.y = y;
                        this.x2 = x;
                        this.y2 = y;
                        this.dir = dir;
                        this.skipMov = true;
                        this.speed = spd;
                        this.dmg = dmg;
                        this.scale = scl;
                        this.range = rng;
                        this.r2 = rng;
                        this.owner = owner;
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.active) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x += tmpSpeed * Math.cos(this.dir);
                                this.y += tmpSpeed * Math.sin(this.dir);
                                this.range -= tmpSpeed;
                                if (this.range <= 0) {
                                    this.x += this.range * Math.cos(this.dir);
                                    this.y += this.range * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.range = 0;
                                    this.active = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                    this.tickUpdate = function(delta) {
                        if (this.tickActive) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x2 += tmpSpeed * Math.cos(this.dir);
                                this.y2 += tmpSpeed * Math.sin(this.dir);
                                this.r2 -= tmpSpeed;
                                if (this.r2 <= 0) {
                                    this.x2 += this.r2 * Math.cos(this.dir);
                                    this.y2 += this.r2 * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.r2 = 0;
                                    this.tickActive = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                }
            };
            class Store {
                constructor() {
                    // STORE HATS:
                    this.hats = [{
                        id: 45,
                        name: "Shame!",
                        dontSell: true,
                        price: 0,
                        scale: 120,
                        desc: "hacks are for winners"
                    }, {
                        id: 51,
                        name: "Moo Cap",
                        price: 0,
                        scale: 120,
                        desc: "coolest mooer around"
                    }, {
                        id: 50,
                        name: "Apple Cap",
                        price: 0,
                        scale: 120,
                        desc: "apple farms remembers"
                    }, {
                        id: 28,
                        name: "Moo Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 29,
                        name: "Pig Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 30,
                        name: "Fluff Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 36,
                        name: "Pandou Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 37,
                        name: "Bear Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 38,
                        name: "Monkey Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 44,
                        name: "Polar Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 35,
                        name: "Fez Hat",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 42,
                        name: "Enigma Hat",
                        price: 0,
                        scale: 120,
                        desc: "join the enigma army"
                    }, {
                        id: 43,
                        name: "Blitz Hat",
                        price: 0,
                        scale: 120,
                        desc: "hey everybody i'm blitz"
                    }, {
                        id: 49,
                        name: "Bob XIII Hat",
                        price: 0,
                        scale: 120,
                        desc: "like and subscribe"
                    }, {
                        id: 57,
                        name: "Pumpkin",
                        price: 50,
                        scale: 120,
                        desc: "Spooooky"
                    }, {
                        id: 8,
                        name: "Bummle Hat",
                        price: 100,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Straw Hat",
                        price: 500,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Winter Cap",
                        price: 600,
                        scale: 120,
                        desc: "allows you to move at normal speed in snow",
                        coldM: 1
                    }, {
                        id: 5,
                        name: "Cowboy Hat",
                        price: 1000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Ranger Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 18,
                        name: "Explorer Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 31,
                        name: "Flipper Hat",
                        price: 2500,
                        scale: 120,
                        desc: "have more control while in water",
                        watrImm: true
                    }, {
                        id: 1,
                        name: "Marksman Cap",
                        price: 3000,
                        scale: 120,
                        desc: "increases arrow speed and range",
                        aMlt: 1.3
                    }, {
                        id: 10,
                        name: "Bush Gear",
                        price: 3000,
                        scale: 160,
                        desc: "allows you to disguise yourself as a bush"
                    }, {
                        id: 48,
                        name: "Halo",
                        price: 3000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 6,
                        name: "Soldier Helmet",
                        price: 4000,
                        scale: 120,
                        desc: "reduces damage taken but slows movement",
                        spdMult: 0.94,
                        dmgMult: 0.75
                    }, {
                        id: 23,
                        name: "Anti Venom Gear",
                        price: 4000,
                        scale: 120,
                        desc: "makes you immune to poison",
                        poisonRes: 1
                    }, {
                        id: 13,
                        name: "Medic Gear",
                        price: 5000,
                        scale: 110,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 9,
                        name: "Miners Helmet",
                        price: 5000,
                        scale: 120,
                        desc: "earn 1 extra gold per resource",
                        extraGold: 1
                    }, {
                        id: 32,
                        name: "Musketeer Hat",
                        price: 5000,
                        scale: 120,
                        desc: "reduces cost of projectiles",
                        projCost: 0.5
                    }, {
                        id: 7,
                        name: "Bull Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "increases damage done but drains health",
                        healthRegen: -5,
                        dmgMultO: 1.5,
                        spdMult: 0.96
                    }, {
                        id: 22,
                        name: "Emp Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "turrets won't attack but you move slower",
                        antiTurret: 1,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        name: "Booster Hat",
                        price: 6000,
                        scale: 120,
                        desc: "increases your movement speed",
                        spdMult: 1.16
                    }, {
                        id: 26,
                        name: "Barbarian Armor",
                        price: 8000,
                        scale: 120,
                        desc: "knocks back enemies that attack you",
                        dmgK: 0.6
                    }, {
                        id: 21,
                        name: "Plague Mask",
                        price: 10000,
                        scale: 120,
                        desc: "melee attacks deal poison damage",
                        poisonDmg: 5,
                        poisonTime: 6
                    }, {
                        id: 46,
                        name: "Bull Mask",
                        price: 10000,
                        scale: 120,
                        desc: "bulls won't target you unless you attack them",
                        bullRepel: 1
                    }, {
                        id: 14,
                        name: "Windmill Hat",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "generates points while worn",
                        pps: 1.5
                    }, {
                        id: 11,
                        name: "Spike Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "deal damage to players that damage you",
                        dmg: 0.45
                    }, {
                        id: 53,
                        name: "Turret Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "you become a walking turret",
                        turret: {
                            proj: 1,
                            range: 700,
                            rate: 2500
                        },
                        spdMult: 0.7
                    }, {
                        id: 20,
                        name: "Samurai Armor",
                        price: 12000,
                        scale: 120,
                        desc: "increased attack speed and fire rate",
                        atkSpd: 0.78
                    }, {
                        id: 58,
                        name: "Dark Knight",
                        price: 12000,
                        scale: 120,
                        desc: "restores health when you deal damage",
                        healD: 0.4
                    }, {
                        id: 27,
                        name: "Scavenger Gear",
                        price: 15000,
                        scale: 120,
                        desc: "earn double points for each kill",
                        kScrM: 2
                    }, {
                        id: 40,
                        name: "Tank Gear",
                        price: 15000,
                        scale: 120,
                        desc: "increased damage to buildings but slower movement",
                        spdMult: 0.3,
                        bDmg: 3.3
                    }, {
                        id: 52,
                        name: "Thief Gear",
                        price: 15000,
                        scale: 120,
                        desc: "steal half of a players gold when you kill them",
                        goldSteal: 0.5
                    }, {
                        id: 55,
                        name: "Bloodthirster",
                        price: 20000,
                        scale: 120,
                        desc: "Restore Health when dealing damage. And increased damage",
                        healD: 0.25,
                        dmgMultO: 1.2,
                    }, {
                        id: 56,
                        name: "Assassin Gear",
                        price: 20000,
                        scale: 120,
                        desc: "Go invisible when not moving. Can't eat. Increased speed",
                        noEat: true,
                        spdMult: 1.1,
                        invisTimer: 1000
                    }];
                    // STORE ACCESSORIES:
                    this.accessories = [{
                        id: 12,
                        name: "Snowball",
                        price: 1000,
                        scale: 105,
                        xOff: 18,
                        desc: "no effect"
                    }, {
                        id: 9,
                        name: "Tree Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 10,
                        name: "Stone Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 3,
                        name: "Cookie Cape",
                        price: 1500,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 8,
                        name: "Cow Cape",
                        price: 2000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 11,
                        name: "Monkey Tail",
                        price: 2000,
                        scale: 97,
                        xOff: 25,
                        desc: "Super speed but reduced damage",
                        spdMult: 1.35,
                        dmgMultO: 0.2
                    }, {
                        id: 17,
                        name: "Apple Basket",
                        price: 3000,
                        scale: 80,
                        xOff: 12,
                        desc: "slowly regenerates health over time",
                        healthRegen: 1
                    }, {
                        id: 6,
                        name: "Winter Cape",
                        price: 3000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Skull Cape",
                        price: 4000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 5,
                        name: "Dash Cape",
                        price: 5000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Dragon Cape",
                        price: 6000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 1,
                        name: "Super Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 7,
                        name: "Troll Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 14,
                        name: "Thorns",
                        price: 10000,
                        scale: 115,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Blockades",
                        price: 10000,
                        scale: 95,
                        xOff: 15,
                        desc: "no effect"
                    }, {
                        id: 20,
                        name: "Devils Tail",
                        price: 10000,
                        scale: 95,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 16,
                        name: "Sawblade",
                        price: 12000,
                        scale: 90,
                        spin: true,
                        xOff: 0,
                        desc: "deal damage to players that damage you",
                        dmg: 0.15
                    }, {
                        id: 13,
                        name: "Angel Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 19,
                        name: "Shadow Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "increased movement speed",
                        spdMult: 1.1
                    }, {
                        id: 18,
                        name: "Blood Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "restores health when you deal damage",
                        healD: 0.2
                    }, {
                        id: 21,
                        name: "Corrupt X Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "deal damage to players that damage you",
                        dmg: 0.25
                    }];
                }
            };
            class ProjectileManager {
                constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                    this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
                        let tmpData = items.projectiles[indx];
                        let tmpProj;
                        for (let i = 0; i < projectiles.length; ++i) {
                            if (!projectiles[i].active) {
                                tmpProj = projectiles[i];
                                break;
                            }
                        }
                        if (!tmpProj) {
                            tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                            tmpProj.sid = projectiles.length;
                            projectiles.push(tmpProj);
                        }
                        tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                        tmpProj.ignoreObj = ignoreObj;
                        tmpProj.layer = layer || tmpData.layer;
                        tmpProj.inWindow = inWindow;
                        tmpProj.src = tmpData.src;
                        return tmpProj;
                    };
                }
            };
            class AiManager {
                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
                    // AI TYPES:
                    this.aiTypes = [{
                        id: 0,
                        src: "cow_1",
                        killScore: 150,
                        health: 500,
                        weightM: 0.8,
                        speed: 0.00095,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 50]
                    }, {
                        id: 1,
                        src: "pig_1",
                        killScore: 200,
                        health: 800,
                        weightM: 0.6,
                        speed: 0.00085,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 80]
                    }, {
                        id: 2,
                        name: "Bull",
                        src: "bull_2",
                        hostile: true,
                        dmg: 20,
                        killScore: 1000,
                        health: 1800,
                        weightM: 0.5,
                        speed: 0.00094,
                        turnSpeed: 0.00074,
                        scale: 78,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 3,
                        name: "Bully",
                        src: "bull_1",
                        hostile: true,
                        dmg: 20,
                        killScore: 2000,
                        health: 2800,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.0008,
                        scale: 90,
                        viewRange: 900,
                        chargePlayer: true,
                        drop: ["food", 400]
                    }, {
                        id: 4,
                        name: "Wolf",
                        src: "wolf_1",
                        hostile: true,
                        dmg: 8,
                        killScore: 500,
                        health: 300,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.002,
                        scale: 84,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 200]
                    }, {
                        id: 5,
                        name: "Quack",
                        src: "chicken_1",
                        dmg: 8,
                        killScore: 2000,
                        noTrap: true,
                        health: 300,
                        weightM: 0.2,
                        speed: 0.0018,
                        turnSpeed: 0.006,
                        scale: 70,
                        drop: ["food", 100]
                    }, {
                        id: 6,
                        name: "MOOSTAFA",
                        nameScale: 50,
                        src: "enemy",
                        hostile: true,
                        dontRun: true,
                        fixedSpawn: true,
                        spawnDelay: 60000,
                        noTrap: true,
                        colDmg: 100,
                        dmg: 40,
                        killScore: 8000,
                        health: 18000,
                        weightM: 0.4,
                        speed: 0.0007,
                        turnSpeed: 0.01,
                        scale: 80,
                        spriteMlt: 1.8,
                        leapForce: 0.9,
                        viewRange: 1000,
                        hitRange: 210,
                        hitDelay: 1000,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 7,
                        name: "Treasure",
                        hostile: true,
                        nameScale: 35,
                        src: "crate_1",
                        fixedSpawn: true,
                        spawnDelay: 120000,
                        colDmg: 200,
                        killScore: 5000,
                        health: 20000,
                        weightM: 0.1,
                        speed: 0.0,
                        turnSpeed: 0.0,
                        scale: 70,
                        spriteMlt: 1.0
                    }, {
                        id: 8,
                        name: "MOOFIE",
                        src: "wolf_2",
                        hostile: true,
                        fixedSpawn: true,
                        dontRun: true,
                        hitScare: 4,
                        spawnDelay: 30000,
                        noTrap: true,
                        nameScale: 35,
                        dmg: 10,
                        colDmg: 100,
                        killScore: 3000,
                        health: 7000,
                        weightM: 0.45,
                        speed: 0.0015,
                        turnSpeed: 0.002,
                        scale: 90,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 1000]
                    }, {
                        id: 9,
                        name: "馃拃MOOFIE",
                        src: "wolf_2",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        spawnDelay: 6e4,
                        noTrap: !0,
                        nameScale: 35,
                        dmg: 12,
                        colDmg: 100,
                        killScore: 3e3,
                        health: 9e3,
                        weightM: .45,
                        speed: .0015,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 3e3],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 10,
                        name: "馃拃Wolf",
                        src: "wolf_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        spawnDelay: 3e4,
                        dmg: 10,
                        killScore: 700,
                        health: 500,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 88,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 400],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 11,
                        name: "馃拃Bully",
                        src: "bull_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        dmg: 20,
                        killScore: 5e3,
                        health: 5e3,
                        spawnDelay: 1e5,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 800],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }];
                    // SPAWN AI:
                    this.spawn = function(x, y, dir, index) {
                        let tmpObj = ais.find((tmp) => !tmp.active);
                        if (!tmpObj) {
                            tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                            ais.push(tmpObj);
                        }
                        tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                        return tmpObj;
                    };
                }
            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
                    // INIT:
                    this.init = function(x, y, dir, index, data) {
                        this.x = x;
                        this.y = y;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.zIndex = 0;
                        this.dir = dir;
                        this.dirPlus = 0;
                        this.index = index;
                        this.src = data.src;
                        if (data.name) this.name = data.name;
                        this.weightM = data.weightM;
                        this.speed = data.speed;
                        this.killScore = data.killScore;
                        this.turnSpeed = data.turnSpeed;
                        this.scale = data.scale;
                        this.maxHealth = data.health;
                        this.leapForce = data.leapForce;
                        this.health = this.maxHealth;
                        this.chargePlayer = data.chargePlayer;
                        this.viewRange = data.viewRange;
                        this.drop = data.drop;
                        this.dmg = data.dmg;
                        this.hostile = data.hostile;
                        this.dontRun = data.dontRun;
                        this.hitRange = data.hitRange;
                        this.hitDelay = data.hitDelay;
                        this.hitScare = data.hitScare;
                        this.spriteMlt = data.spriteMlt;
                        this.nameScale = data.nameScale;
                        this.colDmg = data.colDmg;
                        this.noTrap = data.noTrap;
                        this.spawnDelay = data.spawnDelay;
                        this.hitWait = 0;
                        this.waitCount = 1000;
                        this.moveCount = 0;
                        this.targetDir = 0;
                        this.active = true;
                        this.alive = true;
                        this.runFrom = null;
                        this.chargeTarget = null;
                        this.dmgOverTime = {};
                    };
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    // ANIMATION:
                    this.startAnim = function() {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                };
            };
            class addCh {
                constructor(x, y, chat, tmpObj) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = tmpObj;
                };
            };
            class DeadPlayer {
                constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
                    this.x = x;
                    this.y = y;
                    this.lastDir = dir;
                    this.dir = dir + Math.PI;
                    this.buildIndex = buildIndex;
                    this.weaponIndex = weaponIndex;
                    this.weaponVariant = weaponVariant;
                    this.skinColor = skinColor;
                    this.scale = scale;
                    this.visScale = 0;
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        if (d2 > 0.01) {
                            this.dir += d2 / 20;
                        } else {
                            this.dir = this.lastDir;
                        }
                        if (this.visScale < this.scale) {
                            this.visScale += delta / (this.scale / 2);
                            if (this.visScale >= this.scale) {
                                this.visScale = this.scale;
                            }
                        }
                        this.alpha -= delta / 30000;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                    this.id = id;
                    this.sid = sid;
                    this.tmpScore = 0;
                    this.team = null;
                    this.latestSkin = 0;
                    this.oldSkinIndex = 0;
                    this.skinIndex = 0;
                    this.latestTail = 0;
                    this.oldTailIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.lastHit = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.points = 0;
                    this.dt = 0;
                    this.hidden = false;
                    this.itemCounts = {};
                    this.isPlayer = true;
                    this.pps = 0;
                    this.moveDir = undefined;
                    this.skinRot = 0;
                    this.lastPing = 0;
                    this.iconIndex = 0;
                    this.skinColor = 0;
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.maxSpeed = 1;
                    this.chat = {
                        message: null,
                        count: 0
                    };
                    this.backupNobull = true;
                    this.circle = false;
                    this.circleRad = 200;
                    this.circleRadSpd = 0.1;
                    this.cAngle = 0;
                    // SPAWN:
                    this.spawn = function(moofoll) {
                        this.attacked = false;
                        this.death = false;
                        this.spinDir = 0;
                        this.sync = false;
                        this.antiBull = 0;
                        this.bullTimer = 0;
                        this.poisonTimer = 0;
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.gatherIndex = 0;
                        this.shooting = {};
                        this.shootIndex = 9;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.weaponCode = 0;
                        this.weaponVariant = 0;
                        this.primaryIndex = undefined;
                        this.secondaryIndex = undefined;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.oldXY = {
                            x: 0,
                            y: 0
                        };
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.damaged = 0;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            53: 0,
                        };
                        this.bowThreat = {
                            9: 0,
                            12: 0,
                            13: 0,
                            15: 0,
                        };
                        this.damageThreat = 0;
                        this.inTrap = false;
                        this.canEmpAnti = false;
                        this.empAnti = false;
                        this.soldierAnti = false;
                        this.poisonTick = 0;
                        this.bullTick = 0;
                        this.setPoisonTick = false;
                        this.setBullTick = false;
                        this.antiTimer = 2;
                    };
                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };
                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };
                    // ADD ITEM:
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };
                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };
                    // UPDATE POISON TICK:
                    this.updateTimer = function() {
                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = config.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer <= 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = config.serverUpdateRate;
                        }
                    };
                    this.update = function(delta) {
                        if (this.alive) {
                            if (this.health != this.healthMov) {
                                this.health < this.healthMov ? (this.healthMov -= 2) : (this.healthMov += 2);
                                if (Math.abs(this.health - this.healthMov) < 2) this.healthMov = this.health;
                            };
                            if (this.shameCount != this.shameMov) this.shameCount < this.shameMov ? (this.shameMov -= .1) : (this.shameMov += .1), Math.abs(this.shameCount - this.shameMov) < .1 && (this.shameMov = this.shameCount);
                        }
                        if (this.sid == playerSID) {
                            this.circleRad = parseInt(getEl("circleRad").value) || 0;
                            this.circleRadSpd = parseFloat(getEl("radSpeed").value) || 0;
                            this.cAngle += this.circleRadSpd;
                        }
                        if (this.active) {
                            // MOVE:
                            let gear = {
                                skin: findID(hats, this.skinIndex),
                                tail: findID(accessories, this.tailIndex)
                            }
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                            this.maxSpeed = spdMult;
                        }
                    };
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    // GATHER ANIMATION:
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };
                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = Date.now() - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 120) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = Date.now();
                        }
                    };
                    this.addShameTimer = function() {
                        this.shameCount = 0;
                        this.shameTimer = 30;
                        let interval = setInterval(() => {
                            this.shameTimer--;
                            if (this.shameTimer <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    };
                    // CHECK TEAM:
                    this.isTeam = function(tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };
                    // FOR THE PLAYER:
                    this.findAllianceBySid = function(sid) {
                        return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
                    };
                    this.checkCanInsta = function(nobull) {
                        let totally = 0;
                        if (this.alive && inGame) {
                            let primary = {
                                weapon: this.weapons[0],
                                variant: this.primaryVariant,
                                dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                            };
                            let secondary = {
                                weapon: this.weapons[1],
                                variant: this.secondaryVariant,
                                dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                            };
                            let bull = this.skins[7] && !nobull ? 1.5 : 1;
                            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                            if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                                totally += primary.dmg * pV * bull;
                            }
                            if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                                totally += secondary.dmg;
                            }
                            if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                                totally += 25;
                            }
                            totally *= near.skinIndex == 6 ? 0.75 : 1;
                            return totally;
                        }
                        return 0;
                    };
                    // UPDATE WEAPON RELOAD:
                    this.manageReload = function () {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {

                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                                //preplaces

                            }
                            if (this.shooting[1]) {

                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (playerHit.me) {
                                playerHit.me = false;
                            }
                            if (playerHit.ene) {
                                playerHit.ene = false;
                            }
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                    if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                                        this.antiBull++;
                                        game.tickBase(() => {
                                            this.antiBull = 0;
                                        }, 1);
                                    }
                                    if (this == player) {
                                        if (getEl("weaponGrind").checked) {
                                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                checkPlace(player.getItemType(22), i);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    // FOR ANTI INSTA:
                    this.addDamageThreat = function(tmpObj) {
                        let primary = {
                            weapon: this.primaryIndex,
                            variant: this.primaryVariant
                        };
                        primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                        let secondary = {
                            weapon: this.secondaryIndex,
                            variant: this.secondaryVariant
                        };
                        secondary.dmg = secondary.weapon == undefined ? 75 : items.weapons[secondary.weapon].Pdmg;
                        let bull = 1.5;
                        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= tmpObj.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(tmpObj)) {
                            if (this.dist2 <= 300) {
                                tmpObj.damageThreat += this.damageThreat;
                            }
                        }
                    };

                }
            };
            // SOME CODES:
            function sendUpgrade(index) {
                player.reloads[index] = 0;
                packet("H", index);
            }
            function storeEquip(id, index) {
                packet("c", 0, id, index);
            }
            function storeBuy(id, index) {
                packet("c", 1, id, index);
            }
            function buyEquip(id, index) {
                let nID = player.skins[6] ? 6 : 0;
                if (player.alive && inGame) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.latestSkin != id) {
                                packet("c", 0, id, 0);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(hats, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        //setTimeout(()=>{
                                        packet("c", 1, id, 0);
                                        //setTimeout(()=>{
                                        packet("c", 0, id, 0);
                                        //}, 120);
                                        //}, 120);
                                    } else {
                                        if (player.latestSkin != nID) {
                                            packet("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (player.latestSkin != nID) {
                                        packet("c", 0, nID, 0);
                                    }
                                }
                            } else {
                                if (player.latestSkin != nID) {
                                    packet("c", 0, nID, 0);
                                }
                            }
                        }
                    } else if (index == 1) {
                        if (useWasd && (id != 11 && id != 0)) {
                            if (player.latestTail != 0) {
                                packet("c", 0, 0, 1);
                            }
                            return;
                        }
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 1);
                                        // setTimeout(()=>{
                                        packet("c", 0, id, 1);
                                        //}, 120);
                                    } else {
                                        if (player.latestTail != 0) {
                                            packet("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (player.latestTail != 0) {
                                        packet("c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.latestTail != 0) {
                                    packet("c", 0, 0, 1);
                                }
                            }
                        }
                    }
                }
            }
            function selectToBuild(index, wpn) {
                packet("G", index, wpn);
            }
            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    player.weaponCode = index;
                }
                packet("G", index, 1);
            }
            function sendAutoGather() {
                packet("K", 1, 1);
            }
            function sendAtck(id, angle) {
                packet("d", id, angle, 1);
            }
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }

            // PLACER:
            function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (id === 0 || testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99))) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, rad);
                        selectWeapon(player.weaponCode, 1);
                        if (rmd && getEl("placeVis").checked) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1)
                        }
                    }
                } catch (e) { console.log(e)}
            }

            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            // GET DIRECTION
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }

            function sortFromSmallest(arr, func) { // dist - dist
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
            /*
        tmpList = objectManager.getGridArrays(user.x2, user.y2, 500);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active && getDist(player, tmpList[x][y]))
                            }
                        }
        */
            function getCloseBuildings() {
                let buildings = [];
                let addedBefore = {};
                let filteredBuildings = objectManager.getGridArrays(player.x, player.y, 200);
                //console.log(filteredBuildings);
                for (var x = 0; x < filteredBuildings.length; ++x) {
                    for (var y = 0; y < filteredBuildings[x].length; ++y) {
                        if (filteredBuildings[x][y].active) {
                            buildings.push(filteredBuildings[x][y]);
                        }
                    }
                }
                //console.log(buildings);
                return buildings;
            }
            function getPlaceablePositions(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = [];
                    if (!window.isMohMoh) {
                        buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && getDist(player, t) <= 150), (a)=>{
                            return getDist(player, a);
                        });
                    }
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else if (true) {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) { // overlap
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                    //console.log(e);
                }
            }
            let firstCheckPlaceForntiBUg = false;
            function simplePlace(id, radian) {
                checkPlace(id, radian);
            };


            function checkPlace(id, rad) {
                try {
                    if (secPacket >= 60) return;
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }
            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }

            function healthBased() {
                if (player.health == 100)
                    return 0;
                if ((player.skinIndex != 45 && player.skinIndex != 56)) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }

            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    //let damages = new Damages(items);
                    //let dmg = damages.weapons[tmp.weaponIndex];
                    //let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        //one: tmp.dist2 <= 300,
                        //two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return /*rule.one && rule.two && */ rule.three;
                });
                return attackers;
            }

            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }
            function healer33() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }
            function healer1() {
                place(0, getAttackDir());
                return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
            }


            function noshameheal() {
                place(0, getAttackDir());
                if (player.shameCount >= 5) {
                    place(0, getAttackDir());
                    healer33();
                }else{
                    if (player.shameCount <= 4 && player.skinIndex != 6 && player.skinIndex != 22) {
                        healer33();
                        buyEquip(6, 0);
                    }else{
                        if (player.shameCount >= 5 && player.skinIndex != 6 && player.skinIndex != 22) {
                            return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                            healer33();

                            /*}else{
return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);*/
                        }
                    }
                }
            }

            const placedSpikePositions = new Set();
            const placedTrapPositions = new Set();
            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
                return distToPosition > 35;
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find(THIS => THIS === sid) : null;
            }
            function calculatePossibleTrapPositions(x, y, radius) {
                const trapPositions = [];
                const numPositions = 16;
                for (let i = 0; i < numPositions; i++) {
                    const angle = (2 * Math.PI * i) / numPositions;
                    const offsetX = x + radius * Math.cos(angle);
                    const offsetY = y + radius * Math.sin(angle);
                    const position = [offsetX, offsetY];
                    if (!trapPositions.some(pos => isPositionTooClose(position, pos))) {
                        trapPositions.push(position);
                    }
                }
                return trapPositions;
            }
            function isPositionTooClose(position1, position2, minDistance = 50) {
                const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
                return dist < minDistance;
            }

            function antiSyncHealing(timearg) {
                //io.send('6', 'sync detect test');
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 75);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        my.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate);
            }
            function biomeGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if (player.y2 <= config.snowBiomeTop) {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                    } else {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 12;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                    }
                }
                if (returns) return 0;
            }
            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
            }

            let advHeal = [];
            class Traps {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.aim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    this.antiTrapped = false;
                    this.info = {};
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
                    this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
                        try {
                            let item = items.list[player.items[id]];
                            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                            let counts = {
                                attempts: 0,
                                placed: 0
                            };
                            let tmpObjects = [];
                            gameObjects.forEach((p) => {
                                tmpObjects.push({
                                    x: p.x,
                                    y: p.y,
                                    active: p.active,
                                    blocker: p.blocker,
                                    scale: p.scale,
                                    isItem: p.isItem,
                                    type: p.type,
                                    colDiv: p.colDiv,
                                    getScale: function(sM, ig) {
                                        sM = sM || 1;
                                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                                             ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                                    },
                                });
                            });
                            for (let i = first; i < repeat; i += plus) {
                                counts.attempts++;
                                let relAim = radian + i;
                                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                                let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || useWasd) {
                                    if (useWasd ? false : yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                }
                                tmpObjects.push({
                                    x: tmpX,
                                    y: tmpY,
                                    active: true,
                                    blocker: item.blocker,
                                    scale: item.scale,
                                    isItem: true,
                                    type: null,
                                    colDiv: item.colDiv,
                                    getScale: function() {
                                        return this.scale;
                                    },
                                });
                                if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                                    counts.placed++;
                                }
                            }
                            if (counts.placed > 0 && replacer && item.dmg) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.1) && configs.spikeTick) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    /*   this.checkSpikeTick = function () {
                                            // more range for safe. also testing near.primaryIndex || 5
                                            if (getEl("safeAntiSpikeTick").checked && this.inTrap && near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale && [3, 4, 5].includes(near.primaryIndex) && this.info.health <= items.weapons[player.weaponIndex].dmg * (config.weaponVariants[tmpObj[(player.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[player.weaponIndex].sDmg || 1) * 3.3) return true
                                    }*/
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if (getEl("safeAntiSpikeTick").checked && this.inTrap && near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale && [3, 4, 5].includes(near.primaryIndex) && this.info.health <= items.weapons[player.weaponIndex].dmg * (config.weaponVariants[tmpObj[(player.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[player.weaponIndex].sDmg || 1) * 3.3) return true
                            near.primaryIndex || 5
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1/10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    my.anti0Tick = 1;
                                    //  notif("");
                                    // player.chat.message = "" + near.sid;
                                    //player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    this.protect = function(aim) {
                        if (!configs.antiTrap) return;
                        if (player.items[4]) {
                            checkPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                            this.antiTrapped = true;
                        }
                    };
                    function isBroken() {

                    }
                    this.testPrePlace = function () {

                    }
                    /* this.autoPlace = function () {
                        if (configs.autoPlace && game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value)) || 1) === 0) {
                            try {
                                                const trap1 = gameObjects
                                                .filter((e) => e.trap && e.active)
                                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                                .find((trap) => {
                                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                                    return (
                                                        trap !== player &&
                                                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                                        trapDist <= 50
                                                    );
                                                });
                                if (this.inTrap) {
                                    let antiTrapAngles = Math.PI / Math.floor(Math.random() * (20 - 10 + 1)) + 10;
                                    this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), antiTrapAngles, near.aim2);
                                } else {
                                                if (trap1 && near.dist2 <= 180) {
                                                    const trapX = trap1.x;
                                                    const trapY = trap1.y;
                                                    const circleRadius = 102;
                                                    const numPositions = 64;
                                                    for (let i = 0; i < numPositions; i++) {
                                                        const angle = (2 * Math.PI * i) / numPositions;
                                                        const offsetX = trapX + circleRadius * Math.cos(angle);
                                                        const offsetY = trapY + circleRadius * Math.sin(angle);
                                                        const position = [offsetX, offsetY];
                                                        const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                                                        if (
                                                            isPositionValid(position) &&
                                                            distToPlayer <= 87
                                                        ) {
                                                            const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                                                            checkPlace(2, angleToPlace);
                                                        }
                                                    }
                                                } else if (!trap1 && near.dist2 <= 206) {
                                                    const maxTrapsToPlace = 3;
                                                    const trapRadius = 50;
                                                    const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                                                    let trapsPlaced = 0;
                                                    for (const position of trapPositions) {
                                                        if (
                                                            trapsPlaced < maxTrapsToPlace &&
                                                            isPositionValid(position)
                                                        ) {
                                                            checkPlace(4, ...position);
                                                            trapsPlaced++;
                                                        }
                                                    }
                                                }
                                }
                                            } catch (e) {
                                                console.log(e);
                                            }
                                        }
                                    };*/
                    this.autoPlace = function () { //speed place poor
                        if (getEl("autoPlacetype").value == "spamtrap2") {
                            if (game.tick % 0.5 === 0)
                                try {
                                    if (configs.autoPlace) {
                                        const dist = near.dist2;
                                        const trap = gameObjects
                                        .filter((e) => e.trap && e.active)
                                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                        .find((trap) => {
                                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                            return (
                                                trap !== player &&
                                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                                trapDist <= near.scale*1.8
                                            );
                                        });
                                        if (trap && near.dist2 <= 250) {
                                            checkPlace(2, Math.atan2(player.y - trap.y, player.x - trap.x) + Math.PI);
                                        } else if (!trap && dist <= 400) {
                                            if(dist < 200) {
                                                for(let i=(-55);i<55;i+=55) {
                                                    checkPlace(2, near.aim2+toR(i));
                                                }
                                            }
                                            if(dist >= 200) {
                                                for(let i=(-90);i<270;i+=90) {
                                                    checkPlace(4, near.aim2+toR(i));
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {}
                        }
                    };

                    this.autoPlace = function () {

                        if (enemy.length && configs.autoPlace && !instaC.ticking) {
                            if (getEl("autoPlacetype").value == "spamtrap") {
                                if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value))||1) === 0) {
                                    if (gameObjects.length) {
                                        let near2 = {
                                            inTrap: false,
                                        };
                                        let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                        })[0];
                                        if (nearTrap) {
                                            near2.inTrap = true;
                                        } else {
                                            near2.inTrap = false;
                                        }
                                        if (testMode ? enemy.length : (near.dist2 <= 300)) {
                                            if (near.dist2 <= 200) {
                                                this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                            } else {
                                                player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                            }
                                        }
                                    } else {
                                        if (testMode ? enemy.length : (near.dist2 <= 300)) {
                                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                        }
                                    }
                                }
                            }
                        }
                    };


                    this.autoPlace = function () { //HaThu best perfect place antikick
                        if (getEl("autoPlacetype").value == "ramdomplc") {
                            try {
                                const dist = near.dist2;
                                const trap = gameObjects
                                .filter((e) => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find((trap) => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return (
                                        trap !== player &&
                                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                        trapDist <= near.scale * 1.8
                                    );
                                });

                                if (trap && near.dist2 <= 250) {
                                    const angleToTrap = Math.atan2(player.y - trap.y, player.x - trap.x);
                                    checkPlace(2, angleToTrap + Math.PI);
                                } else if (!trap && dist <= 300) {
                                    if (dist < 200) {
                                        const maxAngle = Math.PI / 6;
                                        const angleMultiplier = Math.min(1, Math.max(0, (dist - 150) / 130));
                                        const adjustedAngle = maxAngle * angleMultiplier;

                                        for (let i = -55; i < 55; i += 55) {
                                            const perfectAngle = calculatePerfectAngle(near.x2, near.y2, player.x2, player.y2);
                                            checkPlace(2, perfectAngle + adjustedAngle + toR(i));
                                        }
                                    }
                                    if (dist >= 200) {
                                        const maxAngle = Math.PI / 6;
                                        const angleMultiplier = Math.min(1, Math.max(0, (dist - 150) / 130));
                                        const adjustedAngle = maxAngle * angleMultiplier;

                                        for (let i = -90; i < 270; i += 90) {
                                            const perfectAngle = calculatePerfectAngle(near.x2, near.y2, player.x2, player.y2);
                                            checkPlace(4, perfectAngle + adjustedAngle + toR(i));
                                        }
                                    }
                                }
                            } catch (e) {}
                        };
                    }

                    this.autoPlace = function () {
                        if (configs.autoPlace && game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value)) || 1) === 0) {
                            if (getEl("autoPlacetype").value == "aiplace") {
                                try {
                                    const trap1 = gameObjects
                                    .filter((e) => e.trap && e.active)
                                    .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                    .find((trap) => {
                                        const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                        return (
                                            trap !== player &&
                                            (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                            trapDist <= 50
                                        );
                                    });
                                    if (this.inTrap) {
                                        let antiTrapAngles = Math.PI / Math.floor(Math.random() * (20 - 10 + 1)) + 10;
                                        this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), antiTrapAngles, near.aim2);
                                    } else {
                                        if (trap1 && near.dist2 <= 180) {
                                            const trapX = trap1.x;
                                            const trapY = trap1.y;
                                            const circleRadius = 102;
                                            const numPositions = 64;
                                            for (let i = 0; i < numPositions; i++) {
                                                const angle = (2 * Math.PI * i) / numPositions;
                                                const offsetX = trapX + circleRadius * Math.cos(angle);
                                                const offsetY = trapY + circleRadius * Math.sin(angle);
                                                const position = [offsetX, offsetY];
                                                const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                                                if (
                                                    isPositionValid(position) &&
                                                    distToPlayer <= 87
                                                ) {
                                                    const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                                                    checkPlace(2, angleToPlace);
                                                }
                                            }
                                        } else if (!trap1 && near.dist2 <= 206) {
                                            const maxTrapsToPlace = 3;
                                            const trapRadius = 50;
                                            const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                                            let trapsPlaced = 0;
                                            for (const position of trapPositions) {
                                                if (
                                                    trapsPlaced < maxTrapsToPlace &&
                                                    isPositionValid(position)
                                                ) {
                                                    checkPlace(4, ...position);
                                                    trapsPlaced++;
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        };
                    }

                            this.autoPlace = function () {
                if (enemy.length && configs.autoPlace && !instaC.ticking) {
                    if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value))||1) === 0) {
                        if (gameObjects.length) {
                            let near2 = {
                                inTrap: true,
                            };
                            let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (nearTrap) {
                                near2.inTrap = true;
                            } else {
                                near2.inTrap = true;
                            }
                            if ((near.dist2 <= 375)) {
                                if (near.dist2 <= 200) {
                                    this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                }
                            }
                        } else {
                            if ((near.dist2 <= 1000)) {
                                player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                            }
                        }
                    }
                }
            };

                    /* function autoPlace() { // bug place
                let nearObj = [];
                if (gameObjects.length && enemy.length) {
                    let inTrap = false;
                    nearObj = gameObjects.filter((e)=>e.trap).sort(function(a, b) {
                        return (UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                    })[0];
                    if (nearObj) {
                        if (!(player.sid != nearObj.owner.sid && !findAllianceBySid(nearObj.owner.sid)) && UTILS.getDist(nearObj, near, 0, 2) <= 70 && nearObj.active) {
                            inTrap = true;
                        } else {
                            inTrap = false;
                        }
                        if (near.dist2 <= 350) {
                            if (inTrap && near.dist2 <= 200) {
                                if (near.dist2 <= player.scale + near.scale + Math.PI * 2) {
                                    checkPlace(2, near.aim2 - UTILS.getDirect(nearObj, near, 0, 2));
                                    checkPlace(2, near.aim2 + UTILS.getDirect(nearObj, near, 0, 2));
                                }
                            }
                            if (near.dist2 <= near.scale + player.scale) {
                                checkPlace(2, near.aim2);
                            } else {
                                if (near.dist2 <= 200 && !instaC.canSpikeTick && !traps.in && !inTrap) {
                                    checkPlace(2, near.aim2 + UTILS.toRad(90));
                                    checkPlace(2, near.aim2 - UTILS.toRad(90));
                                } else {
                                    if (near.dist2 <= 250) {
                                        checkPlace(2, near.aim2 + Math.PI);
                                    } else {
                                        for (let i = 0; i < 360; i += 90) {
                                            checkPlace(4, UTILS.toRad(i));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/





                    this.autoplace = function () {
                        let oldXY = {
                            x: undefined,
                            y: undefined,
                        };
                        if (getEl("autoPlacetype").value == "magicplace") {



                            let nearObj = [];
                            let randomDir = Math.random() * Math.PI * 2;
                            if (gameObjects.length && enemy.length) {
                                let nearsa = {
                                    inTrap: false,
                                };
                                nearObj = gameObjects.filter((e)=>e.trap).sort(function(a, b) {
                                    return (UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2));
                                })[0];
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                })[0];
                                let near2 = {
                                    inTrap: false,
                                };
                                if (nearTrap) {
                                    near2.inTrap = true;
                                } else {
                                    near2.inTrap = false;
                                }
                                if (nearObj) {
                                    if (!(player.sid != nearObj.owner.sid && !findAllianceBySid(nearObj.owner.sid)) && UTILS.getDist(nearObj, near, 0, 2) <= 70 && nearObj.active) {
                                        nearsa.inTrap = true;
                                    } else {
                                        nearsa.inTrap = false;
                                    }
                                    if (near.dist2 <= 600) {
                                        if (nearsa.inTrap || near.dist2 <= 60 + near.scale) {
                                            if (near.dist2 <= 250) {
                                                for (let i = 0; i < Math.PI * 2; i += Math.PI / 1.5) {
                                                    checkPlace(2, near.aim2 + i);
                                                }
                                            } else {
                                                for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                                    checkPlace(2, near.aim2 + i);
                                                }
                                            }
                                        } else {
                                            if (player.items[4] == 15) {
                                                if (near.dist2 <= 200) {
                                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                        checkPlace(4, randomDir + i);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (near.dist2 <= 400) {
                                        if (player.items[4] == 15) {
                                            checkPlace(4, near.aim2);
                                        }
                                    }
                                }
                            }
                        }
                    }



                    /*    this.replacer = function(findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            if (configs.autoGrind && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                }
                                this.replaced = true;
                }
            }, 1);
        };
    }
};*/
                    function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }

                    this.replacer = function (findObj) {
                        if (!findObj || !inGame) return;
                        game.tickBase(() => {
                            const objAim = UTILS.getDirect(findObj, player, 0, 2);
                            const objDst = UTILS.getDist(findObj, player, 0, 2);
                            const weaponRange = items.weapons[player.weaponIndex].range + player.scale;
                            const canPlaceCondition = [4, 5, 3].includes(player.weapons[0]) && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.2) && player.reloads[player.weapons[0]] == 0;
                            let danger = this.checkSpikeTick();
                            if (getEl("weaponGrind").checked && objDst <= weaponRange) return;
                            if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                            }
                            if (objDst <= 400 && near.dist2 <= 400) {
                                if (canPlaceCondition) {
                                    this.testCanPlace(2, -Math.PI/4, Math.PI/4, near.aim2, 1);
                                    this.testCanPlace(4, -Math.PI/4, Math.PI/4, Math.PI/12, near.aim2+Math.PI, 1)
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                }
                                this.replaced = true;
                            }
                        }, 1);
                    };
                }
            }
            class Instakill {
                constructor() {
                    if (secPacket > 60) return
                    this.wait = false;
                    this.can = false;
                    this.isTrue = false;
                    this.nobull = false;
                    this.ticking = false;
                    this.canSpikeTick = false;
                    this.startTick = false;
                    this.readyTick = false;
                    this.canCounter = false;
                    this.revTick = false;
                    this.syncHit = false;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.autoAim = true;
                        let instaLog = [type];
                        let backupNobull = near.backupNobull;
                        near.backupNobull = false;
                        game.tickBase(() => {
                            instaLog.push(player.skinIndex);
                            game.tickBase(() => {
                                if (near.skinIndex == 22 && getEl("backupNobull").checked) {
                                    near.backupNobull = true;
                                }
                                instaLog.push(player.skinIndex);
                            }, 1);
                        }, 1);
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                if (near.dist2 <= 140 && configs.doSpikeOnReverse) place(2, getAttackDir());
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    rKeyPressed = false;
                                }, 1);
                            }, 1);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    rKeyPressed = false;
                                }, 1);
                            }, 1);

                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    rKeyPressed = false;
                                }, 1);
                            }, 1);
                        } else {
                            setTimeout(() => {
                                this.isTrue = false;
                                my.autoAim = false;
                                rKeyPressed = false;
                            }, 50);
                        }
                    };
                    this.spikeTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    /*this.spikeTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        sendAutoGather();
                        game.tickBase(() => {
                            //if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                            buyEquip(53, 0);
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            //buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                buyEquip(6, 0);
                                buyEquip(21, 1);
                            }, 3);
                        }, 1);
                    };*/
                    this.counterType = function() {
                        if (!configs.counterInsta) return
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                if ([9, 12, 13, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0 && configs.secondaryOnCounter) {
                                    selectWeapon(player.weapons[1])
                                }
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                if ([9, 12, 13, 15].includes(player.weapons[1]) && player.reloads[player.weapons[1]] == 0 && configs.secondaryOnCounter) {
                                    selectWeapon(player.weapons[1])
                                }
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }
                        }, 1);
                    };
                    this.hammerCounterType = function() {
                        if (!configs.counterInsta) return
                        this.isTrue = true;
                        my.autoAim = true;
                        if (near.dist2 <= 70 && configs.secondaryOnCounter) {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                buyEquip(53, 0)
                            } else {
                                buyEquip(7, 0)
                            }
                            sendAutoGather();
                            game.tickBase(() => {
                                buyEquip(7, 0)
                                selectWeapon(player.weapons[0])
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else {
                            selectWeapon(player.weapons[0])
                            buyEquip(7, 0)
                            sendAutoGather()
                            game.tickBase(() => {
                                if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                    buyEquip(53, 0)
                                }
                                game.tickBase(() => {
                                    sendAutoGather()
                                    this.isTrue = false
                                    my.autoAim = false
                                }, 1)
                            }, 1)
                        }
                    };
                    this.antiCounterType = function() {
                        my.autoAim = true;
                        this.isTrue = true;
                        inantiantibull = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(6, 0);
                        buyEquip(21, 1);
                        io.send("D", near.aim2);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                inantiantibull = false;
                            }, 1);
                        }, 1)
                    };
                    this.rangeType = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == "ageInsta") {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            packet("a", undefined, 1);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    sendUpgrade(12);
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendUpgrade(15);
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        buyEquip(21, 1);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.autoAim = false;
                                            this.readyTick = false;
                                        }, 3);
                                    }, 1);
                                }, 1);
                            }, 2);
                        } else {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(20, 0);
                            }
                            buyEquip(19, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 3);
                        }
                    };
                    this.oneTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(19, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                my.revAim = true;
                            }
                            selectWeapon(player.weapons[[15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(19, 1);
                            if ([15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                    this.readyTick = false;
                                }, 3);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(19, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                sendAutoGather();
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                    this.readyTick = false;
                                }, 3);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        my.revAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(19, 1);
                        sendAutoGather();
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("a", undefined, 1);
                                this.readyTick = false;
                            }, 3);
                        }, 1);
                    };
                    this.zeroframe = function() {
                        if ([4, 5].includes(player.weapons[0]) && [9, 12, 13].includes(player.weapons[1])) {
                            notif('zero frame馃槺');
                            instaC.isTrue = true;
                            my.autoAim = true;
                            place(4, near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                sendAutoGather();
                                buyEquip(53, 0);
                                buyEquip(0, 1);
                                packet("a", near.aim2);
                                game.tickBase(() => {
                                    buyEquip(7, 0);
                                    buyEquip(21 || 0, 1);
                                    selectWeapon(player.weapons[0]);
                                    packet("a", near.aim2);
                                    game.tickBase(() => {
                                        instaC.isTrue = false;
                                        my.autoAim = false;
                                        packet("a", undefined);
                                        packet("a", isMoveDir);
                                        sendAutoGather();
                                        //spin();
                                    }, 1);
                                }, 1);
                            }, 1);
                        }
                    };
                    this.phFrame = function() {
                        if (player.weapons[0] == 5 && player.weapons[1] == 10) {
                            notif('ph one tick馃槺');
                            instaC.isTrue = true;
                            my.autoAim = true;
                            buyEquip(53, 0);
                            buyEquip(0, 1);
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            packet("a", near.aim2);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                buyEquip(7, 0);
                                buyEquip(21 || 0, 1);
                                selectWeapon(player.weapons[0]);
                                packet("a", near.aim2);
                                game.tickBase(() => {
                                    instaC.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", null);
                                    packet("a", isMoveDir);
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                        }
                    },
                        this.boostTickType = function() {
                        /*this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(53, 0);
            buyEquip(19, 1);
            packet("33", near.aim2);
            game.tickBase(() => {
                place(4, near.aim2);
                selectWeapon(player.weapons[1]);
                biomeGear();
                buyEquip(19, 1);
                sendAutoGather();
                packet("33", near.aim2);
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    packet("33", near.aim2);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("33", undefined);
                    }, 1);
                }, 1);
            }, 1);*/
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(53, 0);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                my.revAim = true;
                            }
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("a", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.gotoGoal = function(goto, OT) {
                        let slowDists = (weeeee) => weeeee * config.playerScale;
                        let goal = {
                            a: goto - OT,
                            b: goto + OT,
                            c: goto - slowDists(1),
                            d: goto + slowDists(1),
                            e: goto - slowDists(2),
                            f: goto + slowDists(2),
                            g: goto - slowDists(4),
                            h: goto + slowDists(4)
                        };
                        let bQ = function(wwww, awwww) {
                            if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                                buyEquip(31, 0);
                            } else {
                                buyEquip(wwww, awwww);
                            }
                        }
                        if (enemy.length) {
                            let dst = near.dist2;
                            bQ(21, 1);
                            this.ticking = true;
                            if (dst >= goal.a && dst <= goal.b) {
                                bQ(22, 0);
                                bQ(13, 1);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                                setTimeout(() => {
                                    this.readyTick = true
                                }, 1000)
                                setTimeout(() => {
                                    this.startTick = true
                                }, 500)
                                return {
                                    dir: undefined,
                                    action: 1
                                };
                            } else {
                                this.readyTick = false
                                if (dst < goal.a) {
                                    if (dst >= goal.g) {
                                        if (dst >= goal.e) {
                                            if (dst >= goal.c) {
                                                bQ(40, 0);
                                                bQ(10, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(13, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        buyEquip(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2 + Math.PI,
                                        action: 0
                                    };
                                } else if (dst > goal.b) {
                                    if (dst <= goal.h) {
                                        if (dst <= goal.f) {
                                            if (dst <= goal.d) {
                                                bQ(40, 0);
                                                bQ(9, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(13, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2,
                                        action: 0
                                    };
                                }
                                return {
                                    dir: undefined,
                                    action: 0
                                };
                            }
                        } else {
                            this.ticking = false;
                            return {
                                dir: undefined,
                                action: 0
                            };
                        }
                    }
                    /** wait 1 tick for better quality */
                    this.bowMovement = function() {
                        let moveMent = this.gotoGoal(683, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue && this.readyTick) {
                                this.rangeType("ageInsta");
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.tickMovement = function() {
                        let moveMent = this.gotoGoal(([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop) ? 233 : player.weapons[1] == 15 ? 250 : player.y2 <= config.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 227 : 235 : 250, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue && this.startTick) {
                                // notif("Auto One Tick");
                                addMenuChText("Dev", "Auto One Tick", "lightblue");
                                //io.send("6", near.dist2.toString())
                                this.oneTickType()
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.kmTickMovement = function() {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                                this.kmTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.boostTickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 325 : player.weapons[1] == 12 ? 355 : player.weapons[1] == 13 ? 356 : player.weapons[1] == 15 ? 340 : 326
                        let offset = player.weapons[1] == 9 ? 4 : player.weapons[1] == 12 ? 3 : player.weapons[1] == 13 ? 3 : player.weapons[1] == 15 ? 8 : 15
                        //let dist = parseInt(getEl('boosttickdistance').value)
                        //let offset = 3
                        let moveMent = this.gotoGoal(dist, offset);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue && this.readyTick) {
                                this.boostTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    }
                    /** wait 1 tick for better quality */
                    this.perfCheck = function(pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                            y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
                        };
                        if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                        let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                            if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        return true;
                    }
                }
            };
            class Autobuy {
                constructor(buyHat, buyAcc) {
                    this.hat = function() {
                        buyHat.forEach((id) => {
                            let find = findID(hats, id);
                            if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
                        });
                    };
                    this.acc = function() {
                        buyAcc.forEach((id) => {
                            let find = findID(accessories, id);
                            if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
                        });
                    };
                }
            };
            class Autoupgrade {
                constructor() {
                    this.sb = function() {
                        sendUpgrade(3);
                        sendUpgrade(17);
                        sendUpgrade(31);
                        sendUpgrade(23);
                        sendUpgrade(9);
                        sendUpgrade(38);
                    };
                    this.kh = function() {
                        sendUpgrade(3);
                        sendUpgrade(17);
                        sendUpgrade(31);
                        sendUpgrade(23);
                        sendUpgrade(10);
                        sendUpgrade(38);
                        sendUpgrade(4);
                        sendUpgrade(25);
                    };
                    this.pb = function() {
                        sendUpgrade(5);
                        sendUpgrade(17);
                        sendUpgrade(32);
                        sendUpgrade(23);
                        sendUpgrade(9);
                        sendUpgrade(38);
                    };
                    this.ph = function() {
                        sendUpgrade(5);
                        sendUpgrade(17);
                        sendUpgrade(32);
                        sendUpgrade(23);
                        sendUpgrade(10);
                        sendUpgrade(38);
                        sendUpgrade(28);
                        sendUpgrade(25);
                    };
                    this.db = function() {
                        sendUpgrade(7);
                        sendUpgrade(17);
                        sendUpgrade(31);
                        sendUpgrade(23);
                        sendUpgrade(9);
                        sendUpgrade(34);
                    };
                };
            };
            class Damages {
                constructor(items) {
                    // 0.75 1 1.125 1.5
                    this.calcDmg = function(dmg, val) {
                        return dmg * val;
                    };
                    this.getAllDamage = function(dmg) {
                        return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
                    };
                    this.weapons = [];
                    for (let i = 0; i < items.weapons.length; i++) {
                        let wp = items.weapons[i];
                        let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
                        this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
                        this[name] = this.weapons[i];
                    }
                }
            }
            /** CLASS CODES */
            // jumpscare code warn
            let tmpList = [];
            // LOADING:
            let UTILS = new Utils();
            let items = new Items();
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
            let textManager = new Textmanager();
            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();

            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40], [11, 13, 19, 21]);
            let autoUpgrade = new Autoupgrade();
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;
            let breakTrackers = [];
            let grid = [];
            let pathFind = {
                active: false,
                grid: 40,
                scale: 1440,
                x: 14400,
                y: 14400,
                chaseNear: false,
                array: [],
                lastX: this.grid / 2,
                lastY: this.grid / 2
            };
            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }
            let runAtNextTick = [];
            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
                    return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
                })[0];
                if (nearPlayer) {
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
            }
            let projectileCount = 0;
            function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!tmpObj.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                antiSyncHealing(4);
                                packet("a", tmpObj.aim2+3.1415926535897932/2, 1)
                                game.tickBase(() => {
                                    packet("a", undefined, 1)
                                }, 2)
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                packet("a", tmpObj.aim2+3.1415926535897932/2, 1)
                                my.anti0Tick = 4;
                                predictHeal(2)
                                game.tickBase(() => {
                                    packet("a", undefined, 1)
                                }, 4)
                                if (!my.antiSync) {
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {
                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type ? "primary" : "secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (let i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }
            // RESIZE:
            window.addEventListener("resize", UTILS.checkTrusted(resize));
            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                var scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth;
                gameCanvas.height = screenHeight;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                gameCanvas.style;
                mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, (screenWidth * pixelDensity - maxScreenWidth * scaleFillNative) / 2, (screenHeight * pixelDensity - maxScreenHeight * scaleFillNative) / 2);
            }
            resize();
            // MOUSE INPUT:
            const mals = document.getElementById('touch-controls-fullscreen');
            mals.style.display = 'block';
            mals.addEventListener("mousemove", gameInput, false);
            function gameInput(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            let clicks = {
                left: false,
                middle: false,
                right: false,
            };
            mals.addEventListener("mousedown", mouseDown, false);
            function mouseDown(e) {
                if (attackState != 1) {
                    attackState = 1;
                    if (e.button == 0) {
                        clicks.left = true;
                    } else if (e.button == 1) {
                        clicks.middle = true;
                    } else if (e.button == 2) {
                        clicks.right = true;
                    }
                }
            }
            mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
            function mouseUp(e) {
                if (attackState != 0) {
                    attackState = 0;
                    if (e.button == 0) {
                        clicks.left = false;
                    } else if (e.button == 1) {
                        clicks.middle = false;
                    } else if (e.button == 2) {
                        clicks.right = false;
                    }
                }
            }
            mals.addEventListener("wheel", wheel, false);
            let wbe = 1;
            function wheel(e) {
                if (e.deltaY < 0) {
                    wbe -= 0.05;
                    maxScreenWidth = config.maxScreenWidth * wbe;
                    maxScreenHeight = config.maxScreenHeight * wbe;
                    resize()
                } else {
                    wbe += 0.05;
                    maxScreenWidth = config.maxScreenWidth * wbe;
                    maxScreenHeight = config.maxScreenHeight * wbe;
                    resize()
                }
            }
            /*function wheel(e) {
                if (e.deltaY < 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
            }*/
            // INPUT UTILS:
            function getMoveDir() {
                let dx = 0;
                let dy = 0;
                for (let key in moveKeys) {
                    let tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
                return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
            }
            /*  function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
function getAttackDir(debug) {
    if (debug) {
        if (!player) return "0";

        if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
            lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
        } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = "getSafeDir()";
        } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = "traps.aim";
        } else if (!player.lockDir) {
            if (configs.noDir) return "undefined";
            lastDir = "getSafeDir()";
        }

        return lastDir;
    } else {
        if (!player)
            return 0;

        if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
            lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
        } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = getSafeDir();
        } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = traps.aim;
        } else if (!player.lockDir) {
            if (configs.noDir) return undefined;
            lastDir = getSafeDir();
        }

        return lastDir || 0;
    }
}

function getVisualDir() {
    if (!player)
        return 0;

    if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = getSafeDir();
    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = traps.aim;
    } else if (!player.lockDir) {
        lastDir = getSafeDir();
    }

    return lastDir || 0;
}*/
            /* function getSafeDir() {
    if (!player)
        return 0;
    if (!player.lockDir) {
        lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
    }
    return lastDir || 0;
}
let plusDir = 0;
let lastSpin = Date.now();*/
            /*function getAttackDir() {
    if(player && Date.now() - lastSpin >= 235 && !(clicks.right || clicks.left)) {
        plusDir += Math.random()*(Math.PI*2);
        lastSpin = Date.now();
    }
    if (!player)
        return "0";
    // if (objbreaking.length && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
    //     lastDir = caf(player, objbreaking[0]) - Math.PI;
    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? near.aim2 : getSafeDir();
    else
        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
            lastDir = getSafeDir();
    else
        if (traps.inTrap) {
            lastDir = traps.aim;
        } else
            if (!player.lockDir) {
                if (!player.lockDir && autos.stopspin) {
                    if(useWasd) {
                        lastDir = lastDir;
                    } else {
                        lastDir = getSafeDir();
                    }
                }
            }
    return lastDir;
}*/
            /*function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                        return "0";
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "getSafeDir()";
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "traps.aim";
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return "undefined";
                            lastDir = "getSafeDir()";
                        }
                    return lastDir;
                } else {
                    if (!player)
                        return 0;
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = getSafeDir();
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = traps.aim;
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return undefined;
                            lastDir = getSafeDir();
                        }
                    return lastDir || 0;
                }
            }
function getVisualDir() {
    if (!player)
        return 0;
    lastDir = getSafeDir();
    return lastDir || 0;
}*/
            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
            function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                        return "0";

                    if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "getSafeDir()";
                    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "traps.aim";
                    } else if (!player.lockDir) {
                        if (configs.noDir) return "undefined";
                        lastDir = "getSafeDir()";
                    }

                    return lastDir;
                } else {
                    if (!player)
                        return 0;

                    if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = getSafeDir();
                    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = traps.aim;
                    } else if (!player.lockDir) {
                        if (configs.noDir) return undefined;
                        lastDir = getSafeDir();
                    }

                    return lastDir || 0;
                }
            }

            function getVisualDir() {
                if (!player)
                    return 0;

                if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = getSafeDir();
                } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = traps.aim;
                } else if (!player.lockDir) {
                    lastDir = getSafeDir();
                }

                return lastDir || 0;
            }

            // Funkce pro kontrolu, zda jste pobl铆啪 hr谩膷e
            function isNearPlayer() {
                return !useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap;
                buyEquip(21, 1);
            }
            // KEYS:
            /*function keysActive() {
                return (allianceMenu.style.display != "block" && chatHolder.style.display != "block");
            }*/
            function keysActive() {
                return (allianceMenu.style.display != "block" &&
                        chatHolder.style.display != "block" &&
                        !menuCBFocus);
            }
            function toggleMenuChat() {
                if (menuChatDiv.style.display != "none") {
                    chatHolder.style.display = "none";
                    if (menuChatBox.value != "") {
                        //commands[command.slice(1)]
                        let cmd = function(command) {
                            return {
                                found: command.startsWith("/") && commands[command.slice(1).split(" ")[0]],
                                fv: commands[command.slice(1).split(" ")[0]]
                            }
                        }
                        let command = cmd(menuChatBox.value);
                        if (command.found) {
                            if (typeof command.fv.action === "function") {
                                command.fv.action(menuChatBox.value);
                            }
                        } else {
                            sendChat(menuChatBox.value);
                        }
                        menuChatBox.value = "";
                        menuChatBox.blur();
                    } else {
                        if (menuCBFocus) {
                            menuChatBox.blur();
                        } else {
                            menuChatBox.focus();
                        }
                    }
                }
            }
            let pathfindlmfaoxdddddd = false;
            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 17) {
                            openMenu = !openMenu;
                            $("#menuDiv").toggle();
                            $("#menuChatDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "o") {
                            instaC.zeroframe();
                        } else if (event.key == "k") {
                            instaC.phFrame();
                        } else if (event.key == "l"){
                            pathfindlmfaoxdddddd = !pathfindlmfaoxdddddd
                            if (pathfindlmfaoxdddddd) {
                                //  io.send("6", ".pathfind on");
                                pathFind.active = true;
                                pathFind.chaseNear = true;
                            }else {
                                pathFind.active = false;
                                pathFind.chaseNear = false;
                            }
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("d", 1, getSafeDir(), 1);
                            packet("d", 0, getSafeDir(), 1);
                        } else if (event.key == ",") {
                            io.send("6", 'uwu!')
                            project.send(JSON.stringify(["tezt", "ratio"]));
                            // botSkts.push([botPlayer]);
                            for(let i = 0; i < botz.length; i++) {
                                // if(botz[i][0]) {
                                botz[i][0].zync(near);
                                console.log(botz[i][0])
                            }
                            // project.send("tezt");
                            // botSkts.forEach((bot) => {
                            //     bot.zync();
                            // })
                            // io.send("S", 1)
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                        //  toggleMenuChat();
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (event.key == ",") {
                                player.sync = false;
                            } else if (event.key == "r") {
                                rKeyPressed = !rKeyPressed
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
            let isMoveDir = undefined;
            function sendMoveDir() {
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!my.autoPush) {
                        packet("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                    isMoveDir = newMoveDir;
                }
            }
            /** PATHFIND TEST */
            function toFancyTimeFormat(time) {
                let minutes = ~~((time % 3600) / 60);
                let seconds = ~~time % 60;
                if (seconds <= 9) seconds = `0${seconds}`;
                return `${minutes}:${seconds}`;
            }

            function chechPathColl(tmp) {
                return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
                return tmp.colDiv == 0.5 ? (tmp.scale * tmp.colDiv) :
                    !tmp.isTeamObject(player) && tmp.dmg ? (tmp.scale + player.scale) :
                tmp.isTeamObject(player) && tmp.trap ? 0 : tmp.scale;
            }

            function checkObject() {
                let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
                for (let y = 0; y < pathFind.grid; y++) {
                    grid[y] = [];
                    for (let x = 0; x < pathFind.grid; x++) {
                        let tmpXY = {
                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
                        }
                        if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                            pathFind.lastX = x;
                            pathFind.lastY = y;
                            grid[y][x] = 0;
                            continue;
                        }
                        let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= chechPathColl(tmp));
                        if (find) {
                            if (find.trap) {
                                grid[y][x] = 0;
                                continue;
                            }
                            grid[y][x] = 1;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                }
            }

            function createPath() {
                grid = [];
                checkObject();
            }

            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("a", undefined, 1);
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function (path) {
                            if (path === null) {
                                pathFind.array = [];
                                if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                    packet("a", undefined, 1);
                                } else {
                                    packet("a", near.aim2, 1);
                                }
                            } else {
                                pathFind.array = path;
                                if (pathFind.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                    }
                                    packet("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();
                    }
                }
            }
            /** PATHFIND TEST */
            // ITEM COUNT DISPLAY:
            let isItemSetted = [];
            function updateItemCountDisplay(index = undefined) {
                for (let i = 3; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
                        isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                    } else {
                        if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                    }
                }
            }
            // AUTOPUSH:
            /*function autoPush() {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        } else {
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x + 70,
                                y: spike.y + 70,
                                x2: pos.x2 + 30,
                                y2: pos.y2 + 30
                            };
                            let scale = player.scale / 10;
                            let secondArg = UTILS.getDirect(near, spike, 2, 0) > 70 ? near.aim2 : undefined;
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", secondArg, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                        }
                    }
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("a", lastMoveDir || undefined, 1);
                    }
                }
            }
            // AUTOPUSH:
            function autoPush() { //LEGACY AUTOPUSH
          let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function (a, b) {
              return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
          })[0];
          if (nearTrap) {
              let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function (a, b) {
                  return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
              })[0];
              if (spike) {
                  let pos = {
                      x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                      y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                      x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                      y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                  };
                  let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                      let tmpScale = tmp.getScale();
                      if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                          return true;
                      }
                  });
                  if (finds) {
                      if (my.autoPush) {
                          my.autoPush = false;
                          packet("33", lastMoveDir||undefined, 1);
                      }
                  } else {
                      my.autoPush = true;
                      my.pushData = {
                          x: spike.x,
                          y: spike.y,
                          x2: pos.x2,
                          y2: pos.y2
                      };
                      let scale = (player.scale / 10);
                      if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                          packet("33", near.aim2, 1);
                      } else {
                          packet("33", UTILS.getDirect(pos, player, 2, 2), 1);
                      }
                  }
              } else {
                  if (my.autoPush) {
                      my.autoPush = false;
                      packet("33", lastMoveDir||undefined, 1);
                  }
              }
          } else {
              if (my.autoPush) {
                  my.autoPush = false;
                  packet("33", lastMoveDir||undefined, 1);
              }
          }
      }*/
            function autoPush() {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function (a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir||undefined, 1);
                            }
                        } else {
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x,
                                y: spike.y,
                                x2: pos.x2,
                                y2: pos.y2
                            };
                            let scale = (player.scale / 10);
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", near.aim2, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir||undefined, 1);
                        }
                    }
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("a", lastMoveDir||undefined, 1);
                    }
                }
            }
            // ADD DEAD PLAYER:
            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }
            /** APPLY SOCKET CODES */
            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }
            // SETUP GAME:
            var fisrtloadez = false;
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                fisrtloadez = true;
                packet("d", 0, getAttackDir(), 1);
                my.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }
            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        // addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
                    }
                } else {
                    if (data[1] != playerSID) {
                        // addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
                    }
                }
                tmpPlayer.spawn(isYou ? true : null);
                tmpPlayer.visible = false;
                tmpPlayer.oldPos = {
                    x2: undefined,
                    y2: undefined
                };
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    if (!player) {
                        window.prepareUI(tmpPlayer);
                    }
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    my.lastDir = 0;
                    updateItems();
                    updateAge();
                    updateItemCountDisplay();
                    if (player.skins[7]) {
                        my.reSync = true;
                    }
                }
            }
            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                        //  addChatLog(tmpPlayer.name + " has died", "#db2727", "", "#db2727");
                        players.splice(i, 1);
                        break;
                    }
                }
            }
            function notifi(title, description) {
                let notificationContainer = document.getElementById("notification-container");
                if (!notificationContainer) {
                    notificationContainer = document.createElement("div");
                    notificationContainer.id = "notification-container";
                    notificationContainer.style.position = "fixed";
                    notificationContainer.style.top = "0";
                    notificationContainer.style.left = "0";
                    notificationContainer.style.width = "100%";
                    notificationContainer.style.display = "flex";
                    //  notificationContainer.style.alignItems = "flex-start";
                    // notificationContainer.style.justifyContent = "flex-start";
                    // notificationContainer.style.flexDirection = "column";
                    notificationContainer.style.zIndex = "9999";
                    document.body.appendChild(notificationContainer);
                }
                const notification = document.createElement("div");
                notification.textContent = `${title}`;
                notification.style.fontSize = "1.5rem"; // Larger font size
                notification.style.color = "white";
                notification.style.opacity = "0";
                notification.style.transition = "opacity 0.5s ease-in-out";
                notification.style.padding = "10px";
                notification.style.backgroundColor = "rgba(0, 0, 0, 0.2)"; // Transparent background
                notification.style.borderRadius = "5px";
                notification.style.boxShadow = "none"; // Remove shadow
                notification.style.marginBottom = "10px";
                notification.style.maxWidth = "250px"; // Set max width
                notification.style.overflow = "hidden"; // Hide overflow
                notification.style.textOverflow = "ellipsis"; // Show ellipsis for overflow
                notificationContainer.appendChild(notification);
                setTimeout(function() {
                    notification.style.opacity = "1";
                    setTimeout(function() {
                        notification.style.opacity = "0";
                        setTimeout(function() {
                            notification.remove();
                        }, 500);
                    }, 2000);
                }, 100);
            }
            function notif(title, description) {
                let mouseCoord = player;
                let m = textManager
                m.showText(mouseCoord.x, mouseCoord.y, 30, .18, 500, title, "white");
                //m.showText(mouseCoord.x, mouseCoord.y + 50, 20, .18, 500, description, "white");
            }
            function notificao(title, description) {
                let mouseCoord = player;
                let m = textManager
                m.showText(mouseCoord.x, mouseCoord.y, 30, .18, 500, title, "white");
                m.showText(mouseCoord.x, mouseCoord.y + 50, 20, .18, 500, description, "white");
            }
            function healingTrap() {
                let maxPotential = getMaxPot();
                let pingHeal = function() {
                    return Math.max(0, maxPotential - window.pingTime);
                };
                if (true) {
                    setTimeout(() => {
                        for (let i = 0; i < healthBased(); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                } else {
                    setTimeout(() => {
                        for (let i = 0; i < healthBased(); i++) {
                            place(0, getAttackDir());
                        }
                    }, 2);
                }
            }
            function getMaxPot() {
                let dmg = 0;
                enemy.forEach(tmp => {
                    if (getDist(player, tmp) - 63 <= items.weapons[tmp.weapons[0]].range) {
                        dmg += player.checkCanInsta(false);
                    }
                });
                return dmg;
            }
            function instaheal(e, t) {
                let foodType = (player.items[0] == 0 ? 20 : player.items[0] == 1 ? 40 : 30)
                let times = (e == "max" ? (100-player.health)/foodType : e == (null || undefined) ? 1 : e);
                for(let i = 0; i < times; i++) {
                    place(0, getAttackDir());
                }
            }
            function fastHealing(speed) {
                let value = player.health;
                let damaged
                let attackers = getAttacker(damaged);
                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                let includeSpikeDmgs = !my.reSync && gearDmgs.includes(damaged);
                let maxPotential = getMaxPot();
                let canAntiHeal = false;


                let pingHeal = function() {
                    return Math.max(0, maxPotential - window.pingTime);
                };
                let autoHeal;
                let doMaxHeal = function () {
                    clearInterval(autoHeal);
                    for (let i = 0; i < Math.ceil(Math.min(100 - value, 50) / items.list[player.items[0]].consume); i++) {
                        place(player.items[0]);
                    }
                };
                if (speed >= 100000) {
                    canAntiHeal = true;
                } else {
                    canAntiHeal = false;
                }

                // Heal:
                setTimeout(()=>{
                    if (traps.inTrap) {
                        healingTrap();
                    } else {
                        setTimeout(()=>{
                            for (let i = 0; i < healthBased(); i++) {
                                if (canAntiHeal == true && value <= 80 && near.checkCanInsta(true) >= 100) {
                                    setTimeout(()=>{
                                        place(0, getAttackDir());
                                        setTimeout(()=>{
                                            place(0, getAttackDir());
                                            setTimeout(()=>{
                                                place(0, getAttackDir());
                                            }, speed*5);
                                        }, speed*4);
                                    }, speed*3);
                                } else {
                                    place(0, getAttackDir());
                                }
                                healer();
                            }
                        }, speed*2);
                    }
                }, speed);
            }
            // dune mod dmgpot
            function sortWeaponVariant(id) {
                switch (id) {
                    case 0:
                        return 1
                        break;
                    case 1:
                        return 1.1
                        break;
                    case 2:
                        return 1.18
                        break;
                    case 3:
                        return 1.18
                        break;
                    default:
                        return 1
                        break;
                }
            }
            function sortSecondaryAmmoDamage(weapon) {
                switch (weapon) {
                    case 10:
                        return 12
                        break
                    case 15:
                        return 50
                        break;
                    case 9:
                        return 25
                        break;
                    case 12:
                        return 35
                        break;
                    case 13:
                        return 30
                        break;
                    default:
                        return 0
                }
            }
            function potdmg(tmpObj, t) {
                let d = t - tmpObj.health;
                if (d >= 0) {
                } else {
                    if (player == tmpObj) {
                        if (tmpObj.skinIndex == 7 && (Math.abs(d) == 5 || (tmpObj.latestTail == 13 && Math.abs(d) == 2))) {
                            tmpObj.bullTick = game.tick
                            if (my.reSync) {
                                my.reSync = false;
                            }
                        }
                        dmgpotwowwowow();
                    }
                }
            }
            function dmgpotwowwowow() {
                let potential = DmgPotWorkfrfrfr();
                if (nears.length) {
                    addMenuChText("Dev", `Dmg potential: ${potential}`, "red");
                    //  notif(`Dmg potential: ${potential}`)
                    if (Math.round(player.health - potential <= 0)) {
                        if ((player.health - (potential * player.skinIndex == 6 ? 0.75 : 1) >= 0)) {
                            game.tickBase(() => {
                                heal();
                            }, 2);
                        } else {
                            if(player.shameCount < 5) {
                                heal();
                            } else {
                                game.tickBase(() => {
                                    heal();
                                }, 2);
                            }
                        }
                    } else {
                        game.tickBase(() => {
                            heal();
                        }, 2);
                    }
                } else {
                    game.tickBase(() => {
                        heal();
                    }, 2);
                }
            }
            function heal() {
                for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
                    place(0, getAttackDir());
                }
            }
            function DmgPotWorkfrfrfr() {
                let predictedDamage = 0;
                let weapon1Dmg, weapon2Dmg;
                let weapon1Reload, weapon2Reload;
                for (let i = 0; i < nears.length; i++) {
                    let singleIndividual = nears[i];
                    weapon1Dmg = items.weapons[singleIndividual.weapons[0]].dmg * sortWeaponVariant(singleIndividual.weaponVariant);
                    weapon2Dmg = singleIndividual.weapons[1] == 10 ? items.weapons[singleIndividual.weapons[1]].dmg : items.weapons[singleIndividual.weapons[1]].Pdmg;
                    weapon1Reload = singleIndividual.reloads[singleIndividual.weapons[0]] == 0;
                    weapon2Reload = singleIndividual.reloads[singleIndividual.weapons[1]] == 0;
                    if (singleIndividual.primaryIndex !== undefined) {
                        predictedDamage += weapon1Reload ? weapon1Dmg * 1.5 : 0;
                    } else {
                        predictedDamage += 45;
                    }
                    if (singleIndividual.secondaryIndex !== undefined) {
                        predictedDamage += weapon2Reload ? weapon2Dmg : 0;
                    } else {
                        predictedDamage += 50;
                    }
                    predictedDamage += singleIndividual.reloads[53] == 0 ? 25 : 0;
                }
            }


            // UPDATE HEALTH:
            function updateHealth(sid, value) {
                // Xavier healing
                let tmpObj = findPlayerBySID(sid);
                let secondary = {
                    weapon: this.secondaryIndex,
                    variant: this.secondaryVariant,
                };
                if (!tmpObj) return;

                let oldHealth = tmpObj.health;
                tmpObj.oldHealth = oldHealth;
                tmpObj.health = value;
                tmpObj.judgeShame();
                if (oldHealth > value) {
                    tmpObj.timeDamaged = Date.now();
                    if (tmpObj === near) {
                        let damage = oldHealth - value;
                        let shame = tmpObj.shameCount;
                        if (
                            tmpObj.skinIndex === 7 &&
                            (damage === 5 || (tmpObj.latestTail === 13 && damage === 2))
                        ) {
                            tmpObj.bullTick = game.tick;
                        }
                    }
                    tmpObj.damaged = oldHealth - value;
                    let bullTicked = false;
                    advHeal.push([sid, value, tmpObj.damaged]);
                } else if (tmpObj !== player) {
                    tmpObj.maxShameCount = Math.max(tmpObj.maxShameCount, tmpObj.shameCount);
                }
                if (
                    nears.length &&
                    tmpObj.shameCount <= 4 &&
                    nears.some((items) => [9, 12, 17, 15].includes(secondary.weapon))
                ) {
                    if (near.reloads[near.secondaryIndex] == 0) {
                        my.empAnti = true;
                        my.soldierAnti = false;
                    } else {
                        my.soldierAnti = true;
                        my.empAnti = false;
                    }
                }
            }

            // KILL PLAYER:
            function killPlayer() {
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                if (configs.autoRespawn) {
                    //getEl("ot-sdk-btn-floating").style.display = "none";
                    packet("M", {
                        name: lastsp[0],
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
                }
            }
            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }
            // UPDATE AGE:
            var ageText = getEl("ageText");
            var ageBarBody = getEl("ageBarBody");
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
                if (age == config.maxAge) {
                    ageText.innerHTML = "MAX AGE";
                } else {
                    ageText.innerHTML = "AGE " + player.age;
                    ageBarBody.style.transition = "2s";
                }
            }

            // UPDATE UPGRADES:
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (testMode || items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (let i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (testMode || items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            let tmpI = (items.weapons.length + i);
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            let tmpItem = getEl('upgradeItem' + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                packet("H", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.style.borderRadius = "4px";
                        upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
            }
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function numArr(e = 0, t = 1, act, n = 1) {
                let arr = [];
                for (let i = e; i < t; i += n) {
                    arr.push(i);
                    typeof act == "function" && act(i);
                }
                return arr;
            }
            function toR(e) {
                var n = (e * Math.PI / 180) % (2 * Math.PI);
                return n > Math.PI ? Math.PI - n : n
            }
            function toD(e) {
                var n = (e / Math.PI * 360) % 360;
                return n >= 360 ? n - 360 : n;
            }

            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                if (player) {
                    for (let i = 0; i < breakObjects.length; i++) {
                        if (breakObjects[i].sid == sid) {
                            breakObjects.splice(i, 1);
                            break;
                        }
                    }
                    if (!player.canSee(findObj)) {
                        breakTrackers.push({x: findObj.x, y: findObj.y});
                    }
                    if (breakTrackers.length > 8) {
                        breakTrackers.shift();
                    }
                    traps.replacer(findObj);
                }
            }
            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }
            function precheckPlace(a, b) {
                checkPlace(a, b);
                console.log('success');
            }
            /*function perfectReplace() {
    let range = items.weapons[player.weapons[0]].range + 70;
    let intervalId;  // Variable to store interval ID

    function checkAndReplace() {
        gameObjects.forEach(tmpObj => {
            let objDst = UTILS.getDist(tmpObj, player, 0, 2);
            let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);

            if (tmpObj.health <= 272.58 && fgdo(tmpObj, player) <= range && near.dist2 <= 300) {
                console.log('preplace');
                place(2, perfectAngle);
            }
        });
    }

    intervalId = setInterval(checkAndReplace, 100);  // Run every 100 milliseconds

    // Stop the interval after 500 milliseconds
    setTimeout(() => {
        clearInterval(intervalId);
    }, 500);
}*/
            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            let waitTicks = [];
            // UPDATE PLAYER DATA:
            let nEy;
            let placeableSpikes = [];
            let placeableTraps = [];
            let placeableSpikesPREDICTS = [];
            let DmgPotStuff = {
                predictedDamage: 0
            };

            function DmgPotWorkfrfrfr() {
                DmgPotStuff.predictedDamage = 0;
                for (let i = 0; i < nears.length; i++) {
                    let singleIndividual = nears[i];
                    if (singleIndividual.primaryIndex != undefined) {
                        if (singleIndividual.reloads[singleIndividual.weapons[0]] == 0) {
                            DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[0]].dmg * sortWeaponVariant(singleIndividual.weaponVariant) * 1.5
                        }
                    } else {
                        DmgPotStuff.predictedDamage += 45
                    }
                    if (singleIndividual.secondaryIndex != undefined) {
                        if (singleIndividual.reloads[singleIndividual.weapons[1]] == 0) {
                            if (items.weapons[singleIndividual.weapons[1]] == 10) {
                                DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].dmg * sortWeaponVariant(singleIndividual.weaponVariant)
                            } else {
                                DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].Pdmg
                            }
                        }
                    } else {
                        DmgPotStuff.predictedDamage += 50
                    }
                    if (singleIndividual.reloads[53] == 0) {
                        DmgPotStuff.predictedDamage += 25
                    }
                }
                return DmgPotStuff.predictedDamage
            }
            const getDistance = (x1, y1, x2, y2) => {
                let dx = x2 - x1;
                let dy = y2 - y1;
                return Math.sqrt(dx * dx + dy * dy);
            };
            const getPotentialDamage = (build, user) => {
                const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                const weap = user.weapons[weapIndex];
                if (player.reloads[weap]) return 0;
                const weapon = items.weapons[weap];
                const inDist = getDistance(build.x, build.y, user.x2, user.y2) <= build.getScale() + weapon.range;
                return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
            };

            const findPlacementAngle = (player, itemId, build) => {
                if (!build) return null;
                const MAX_ANGLE = 2 * Math.PI;
                const ANGLE_STEP = Math.PI / 360;
                const item = items.list[player.items[itemId]];
                let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
                let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

                for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
                    let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
                    for (let angle of angles) {
                        let tmpX = player.x + tmpS * Math.cos(angle);
                        let tmpY = player.y + tmpS * Math.sin(angle);
                        if (objectManager.customCheckItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player, build, gameObjects, UTILS, config)) {
                            return angle;
                        }
                    }
                }
                return null;
            };
            const AutoReplace = () => {
                const replaceable = [];
                const playerX = player.x;
                const playerY = player.y;
                const gameObjectCount = gameObjects.length;

                let buildId = 4;

                for (let i = 0; i < gameObjectCount; i++) {
                    const build = gameObjects[i];

                    // Change Obj:
                    if (build.isItem && build.active && build.health) {
                        if (!traps.latestHitObj.length) {
                            return;
                        }

                        const item = items.list[build.id];
                        const posDist = 35 + item.scale + (item.placeOffset || 0);
                        const inDistance = UTILS.getDistance(build.x, build.y, playerX, playerY) <= posDist * 2;
                        if (inDistance) {
                            let canDeal = 0;
                            const playersCount = players.length;
                            for (let j = 0; j < playersCount; j++) {
                                canDeal += getPotentialDamage(build, players[j]);
                            }
                            if (build.health <= canDeal) {
                                replaceable.push(build);
                            }
                        }
                    }
                }

                const replace = () => {
                    // Change Item:
                    gameObjects.forEach(tmpObj => {
                        if (buildId) {
                            if ((near.inTrap || my.autoPush) && UTILS.getDist(tmpObj, near.inTrap) <= near.scale / 2) {
                                buildId = UTILS.collisionDetection(tmpObj, near, 45) ? 4 : 2;
                            } else {
                                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDistance(tmp.x, tmp.y, playerX, playerY) <= tmp.getScale() + 5);
                                let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDistance(tmp.x, tmp.y, playerX, playerY) < 87 && !nearTrap.length);
                                buildId = spike ? 4 : 2;
                            }
                        } else buildId = 2;
                    });
                    replaceable.forEach(build => {
                        let angle = findPlacementAngle(player, buildId, build);
                        if (angle !== null) {
                            place(buildId, angle, 1, 1);
                        }
                    });
                };

                if (near && near.dist2 <= 360) {
                    const replaceDelay = game.tickSpeed - (window.pingTime || 0) + (game.tickSpeed < 110 ? 5 : 0);
                    if (near && near.dist2 <= 360) {
                        setTimeout(replace, items.weapons[player.weaponIndex].speed - 1000/9);
                    }
                }
            };
            function updatePlayers(data) {
                game.tick++;
                enemy = [];
                //perfectReplace();
                nears = [];
                near = [];
                //showPlace = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                }
                if (ticks.tick % 300 === 0) {
                }
                ticks.delay = Date.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
                        tmpObj.t2 = game.lastTick;
                        tmpObj.oldPos.x2 = tmpObj.x2;
                        tmpObj.oldPos.y2 = tmpObj.y2;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
                        tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
                        tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.oldSkinIndex = tmpObj.skinIndex;
                        tmpObj.oldTailIndex = tmpObj.tailIndex;
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        tmpObj.update(game.tickSpeed);
                        tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
                        tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
                        tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
                        tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
                        tmpObj.damageThreat = 0;
                        if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                            tmpObj.addShameTimer();
                        }
                        if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                            tmpObj.shameTimer = 0;
                            tmpObj.shameCount = 0;
                            if (tmpObj == player) {
                                healer();
                            }
                        }
                        botSkts.forEach((bot) => {
                            bot.showName = 'YEAHHH'
                        })

                        for(let i = 0; i < players.length; i++) {
                            for(let aa = 0; aa < botSkts.length; aa++) {
                                if(player.id === aa.id) aa.showName = 'YEAHHHHHH'

                            }
                        }
                        nEy = tmpObj;
                        if (tmpObj == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(getEl("breakRange").value) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                    }
                                });
                                let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.8)).sort(function(a, b) {
                                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                                })[0];
                                if ([0].includes(player.weapons[1])) {
                                    spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[1]].range + player.scale * 1.5)).sort(function(a, b) {
                                        return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                                    })[0];
                                }
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 5) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                                    return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    traps.aim = UTILS.getDirect(spike ? spike : nearTrap, tmpObj, 0, 2);
                                    traps.protect(caf(nearTrap, tmpObj) - Math.PI);
                                    traps.inTrap = true;
                                    traps.info = nearTrap;
                                } else {
                                    traps.inTrap = false;
                                    traps.info = {};
                                }
                            } else {
                                traps.inTrap = false;
                            }
                        }
                        if (tmpObj.weaponIndex < 9) {
                            tmpObj.primaryIndex = tmpObj.weaponIndex;
                            tmpObj.primaryVariant = tmpObj.weaponVariant;
                        } else if (tmpObj.weaponIndex > 8) {
                            tmpObj.secondaryIndex = tmpObj.weaponIndex;
                            tmpObj.secondaryVariant = tmpObj.weaponVariant;
                        }
                    }
                    i += 13;
                }
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj) => {
                        ajaj();
                    }
                                     );
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    }
                                         );
                    runAtNextTick = [];
                }
                if (textManager.stack.length) {
                    let stacks = [];
                    let notstacks = [];
                    let num = 0;
                    let num2 = 0;
                    let pos = {
                        x: null,
                        y: null
                    };
                    let pos2 = {
                        x: null,
                        y: null
                    }
                    textManager.stack.forEach((text) => {
                        if (text.value >= 0) {
                            if (num == 0) pos = {
                                x: text.x,
                                y: text.y
                            };
                            num += Math.abs(text.value);
                        } else {
                            if (num2 == 0) pos2 = {
                                x: text.x,
                                y: text.y
                            };
                            num2 += Math.abs(text.value);
                        }
                    });
                    if (num2 > 0) {
                        textManager.showText(pos2.x, pos2.y, Math.max(43, Math.min(50, num2)), 0.18, 1500, num2, damageTextColor = "#8ecc51");
                    }
                    if (num > 0) {
                        textManager.showText(pos.x, pos.y, Math.max(43, Math.min(50, num)), 0.18, 1500, num, damageTextColor = "#fff");
                    }
                    textManager.stack = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (!tmpObj.isTeam(player)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                                nears.push(tmpObj);
                            }
                        }
                        tmpObj.manageReload();
                        if (tmpObj != player) {
                            tmpObj.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                /*projectiles.forEach((proj) => {
            tmpObj = proj;
            if (tmpObj.active) {
                tmpObj.tickUpdate(game.tickSpeed);
            }
        });*/
                if (player && player.alive) {
                    if (enemy.length) {
                        if (player && player.alive){
                            placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                            placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
                        }

                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach((updHealth) => {
                            let sid = updHealth[0];
                            let value = updHealth[1];
                            let totalDamage = 100 - value
                            let damaged = updHealth[2];
                            tmpObj = findPlayerBySID(sid);
                            let bullTicked = false;
                            if (tmpObj && tmpObj.health <= 0) {
                                if (!tmpObj.death) {
                                    tmpObj.death = true;
                                    if (tmpObj != player) {
                                        // addChatLog(tmpObj.name + " has died", "#db2727", "", "#db2727");
                                    }
                                    addDeadPlayer(tmpObj);
                                }
                            }
                            if (tmpObj == player) {
                                if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                                    if (my.reSync) {
                                        my.reSync = false;
                                        tmpObj.setBullTick = true;
                                    }
                                    bullTicked = true;
                                }
                                if (inGame) {
                                    let attackers = getAttacker(damaged);
                                    let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                    let includeSpikeDmgs = enemy.length ? !bullTicked && (gearDmgs.includes(damaged) && near.skinIndex == 11) : false;
                                    let healTimeout = 140 - window.pingTime;
                                    let dmg = 100 - player.health;
                                    let slowHeal = function () {
                                        if (near.primaryIndex == 7 || (player.weapons[0] == 7 && clicks.left) || (near.primaryIndex == 5 && ([19, 15].includes(near.secondaryIndex)))) {
                                            setTimeout(() => {
                                                healer();
                                            }, healTimeout);
                                        } else {
                                            game.tickBase(() => {
                                                healer()
                                            }, 2)
                                        }
                                    }
                                    if (damaged >= (includeSpikeDmgs ? 8 : 20) && dmg + tmpObj.damageThreat >= 90 && game.tick - tmpObj.antiTimer > 1) {
                                        tmpObj.canEmpAnti = true;
                                        tmpObj.antiTimer = game.tick;
                                        if (player.shameCount < 5) {
                                            healer()
                                        } else {
                                            slowHeal()
                                        }
                                    } else {
                                        slowHeal()
                                    }
                                    if (damaged >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) instaC.canCounter = true
                                }
                            } else {
                                if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                    tmpObj.setPoisonTick = true;
                                }
                            }
                        });
                        advHeal = [];
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                                6: 0,
                                7: 0,
                                8: 0,
                                9: 0,
                                10: 0,
                                11: 0,
                                12: 0,
                                13: 0,
                                14: 0,
                                15: 0,
                                53: 0,
                            };
                        }
                        if (tmp.setBullTick) {
                            tmp.bullTimer = 0;
                        }
                        if (tmp.setPoisonTick) {
                            tmp.poisonTimer = 0;
                        }
                        tmp.updateTimer();
                    });
                    if (inGame) {
                        if (enemy.length) {
                            //     resetZoom()
                            if (configs.autoQonSync && nears.length > 1 && tmpObj.shameCount < 5 && !nears.some(item => [0, 7, 8, 9].includes(item.primaryIndex)) && secPacket < 40 && player.health < 90) {
                                addMenuChText("Dev", `Sync Detect`, "red");
                                tmpObj.canEmpAnti = false
                                healer()
                            }
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                    if (near.reloads[53] == 0) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        //modLog("EmpAnti");
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        //modLog("SoldierAnti");
                                    }
                                }
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                                    instaC.canSpikeTick = true;
                                    instaC.syncHit = true;
                                    if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                        instaC.revInsta = true;
                                    }
                                }
                            }
                            let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.8)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                            })[0];
                            if (player.secondaryIndex == 0) {
                                spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[1]].range + player.scale * 1.8)).sort(function(a, b) {
                                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                                })[0];
                            }
                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            let thingxd = traps.checkSpikeTick();
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 2;
                                    addMenuChText("Dev", `Spike Sync Detect!`, "lightblue");
                                    player.chat.count = 2000;
                                }
                            }
                            async function simpleAntiSpikeTick() {
                                if (thingxd && traps.inTrap) {
                                    while (traps.inTrap && thingxd) {
                                        await new Promise(resolve => setTimeout(resolve, 1));
                                        if (!traps.inTrap) {
                                            my.anti0Tick = 4;
                                            healer();
                                        }
                                    }
                                }
                            }
                            if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8) && spike && tmpObj.damaged >= 70 && !traps.inTrap) {
                                my.anti0Tick = 1;
                            }
                            if (thingxd && traps.inTrap) {
                                simpleAntiSpikeTick();
                            }
                        } else {
                            //  maxScreenWidth = config.maxScreenWidth * 1.5
                            // maxScreenHeight = config.maxScreenHeight * 1.5
                            //  resetZoom()
                        }
                        if ((!useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (!useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (!useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near) && rKeyPressed) {
                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = !useWasd ? false : instaC.canSpikeTick ? false : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }
                        /* if (
                            (!useWasd
                             ? true
                             : ((player.checkCanInsta(true) >= 100
                                 ? player.checkCanInsta(true)
                                 : player.checkCanInsta(false)) >=
                                (player.weapons[1] == 10 ? 95 : 100)
                               )) &&
                            near.dist2 <=
                            items.weapons[player.weapons[1] == 10
                                          ? player.weapons[1]
                                          : player.weapons[0]].range +
                            near.scale * 1.8 &&
                            (instaC.wait || (!useWasd && Math.floor(Math.random() * 5) == 0)) &&
                            !instaC.isTrue &&
                            !my.waitHit &&
                            player.reloads[player.weapons[0]] == 0 &&
                            player.reloads[player.weapons[1]] == 0 &&
                            (!useWasd
                             ? true
                             : getEl("instaType").value == "oneShot"
                             ? player.reloads[53] <=
                             (player.weapons[1] == 10 ? 0 : game.tickRate)
                             : true) &&
                            instaC.perfCheck(player, near)
                        ) {

                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = !useWasd
                                    ? false
                                : instaC.canSpikeTick
                                    ? false
                                : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }*/
                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(5, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.n && place(3, getSafeDir());
                        if (game.tick % 1 == 0) {
                            if (mills.place) {
                                //let plcAng = 7.7
                                let plcAng = 15.7079632679 / 2;
                                for (let i = - plcAng; i <= plcAng; i += plcAng) {
                                    checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                }
                            } else {
                                if (mills.placeSpawnPads) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                    }
                                }
                            }
                        }
                        if (!instaC.isTrue && !traps.inTrap ? true : player.reloads[player.weapons[0]] > game.tick) {
                            traps.autoPlace()
                        }
                        if (instaC.can) {
                            instaC.changeType((configs.revInsta || player.weapons[1] == 10) ? "rev" : getEl("backupNobull").checked ? "nobull" : "normal");
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                if (player.secondaryIndex != 10) instaC.counterType();
                                else instaC.hammerCounterType()
                            }
                        }
                        if (instaC.canSpikeTick) {
                            instaC.canSpikeTick = false;
                            if (instaC.revTick) {
                                instaC.revTick = false;
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                                    instaC.changeType("rev");
                                }
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                    instaC.spikeTickType();
                                    if (instaC.syncHit) {
                                    }
                                }
                            }
                        }
                        if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                            if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                            }
                            if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                sendAutoGather();
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (useWasd && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                            if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[0]);
                            }
                            if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                                sendAutoGather();
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (traps.inTrap) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                                //healingTrap();
                                if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    //  invisBody = true;
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        my.waitHit = 0;
                                        // invisBody = false;
                                    }, 1);
                                }
                            }
                        }
                        if (clicks.middle && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                                if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                                    instaC.bowMovement();
                                } else {
                                    instaC.rangeType();
                                }
                            }
                        }
                        if (macro.t && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                                instaC[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                            }
                        }
                        if (macro["."] && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                                instaC.boostTickMovement();
                            }
                        }
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !(useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!my.reloaded) {
                                    my.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[fastSpeed]);
                                    }
                                }
                            } else {
                                my.reloaded = false;
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1]);
                                    }
                                }
                            }
                        }
                        if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                            packet("D", getAttackDir());
                        }
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if (((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        }
                                    }
                                } else if (traps.inTrap) {
                                    if ((traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) && my.anti0Tick == 0) {
                                        buyEquip(40, 0);
                                    } else {
                                        if (((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip((player.empAnti || near.dist2 > 300 || !enemy.length) ? 22 : 6, 0);
                                        }
                                    }
                                } else {
                                    if (player.empAnti || player.soldierAnti) {
                                        buyEquip(player.empAnti ? 22 : 6, 0);
                                    } else {
                                        if (((!enemy.length || near.dist2 >= 200) && player.shameCount > 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                                if (!configs.alwaysFlipper) {
                                                    if (near.dist2 <= 300) {
                                                        buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                                    } else {
                                                        biomeGear(1);
                                                    }
                                                } else {
                                                    biomeGear(1);
                                                }
                                            } else {
                                                if (near.dist2 <= 300) {
                                                    buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                                } else {
                                                    biomeGear(1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        let accChanger = function() {
                            if (clicks.left) {
                                // Left mouse button is clicked
                                buyEquip(21, 1);
                            } else if (clicks.right) {
                                buyEquip(21, 1)
                                // Right mouse button is clicked
                                // Do nothing for right mouse button click
                            } else if (traps.inTrap) {
                                // Neither left nor right mouse button is clicked
                                // Check if in a trap and buy equipment accordingly
                                buyEquip(21, 1);
                            } else if (near.dist2 < 300){
                                if (getEl("antiBullType").value == "noab") {
                                    buyEquip(19, 1)
                                } else if (configs.alwaysFlipper && player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                    buyEquip(19, 1)
                                } else {
                                    buyEquip(21, 1);
                                }
                            } else {
                                buyEquip(11, 1);
                            }
                        };
                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            hatChanger();
                            accChanger();
                        }
                        if (configs.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                            autoPush();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        }
                        /*  if (configs.autoplacer) {
                            autoplacer();
                        }*/
                        /*   packetData.placeQ = packetData.place;
                            packetData.place = [];
                            if (packetData.placeQ.length) for (let i = 0; i < packetData.placeQ.length; i++) {
                                if (packetData.placeQ[i][0] != undefined && player.itemCounts[packetData.placeQ[i][0]] ? (player.itemCounts[packetData.placeQ[i][0]] < 99) : true && secondaryCheck(packetData.placeQ[i][0], packetData.placeQ[i][1])) {
                                    place(packetData.placeQ[i][0], packetData.placeQ[i][1]);
                                }
                            }*/
                        if (!my.autoPush && pathFind.active) {
                            Pathfinder();
                        }
                        if (instaC.ticking) {
                            instaC.ticking = false;
                        }
                        if (instaC.syncHit) {
                            instaC.syncHit = false;
                        }
                        if (player.empAnti) {
                            player.empAnti = false;
                        }
                        if (player.soldierAnti) {
                            player.soldierAnti = false;
                        }
                        if (my.anti0Tick > 0) {
                            my.anti0Tick--
                        }
                        if (traps.replaced) {
                            traps.replaced = false;
                        }
                        if (traps.antiTrapped) {
                            traps.antiTrapped = false;
                        }
                    }
                }
                if (botSkts.length) {
                    botSkts.forEach((bots) => {
                        if (true) {
                            bots[0].showName = 'YEAHHH';
                        }
                    });
                }
            }
            // UPDATE LEADERBOARD:
            /* function updateLeaderboard(data) {
                UTILS.removeAllChildren(leaderboardData);
                var tmpC = 1;
                for (var i = 0; i < data.length; i += 3) {
                    // console.log(data);
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: data[i] == player.sid ? "color: rgba(); font-size: 18px;" : "color: rgba(); font-size: 18px; padding: 1px;", //"font-size: 18px;",
                                    text: (data[i + 1] != "" ? data[i + 1] : "unknown") + "  |"
                                }),
                                UTILS.generateElement({
                                    class: "a", //class: "leaderScore",
                                    style: data[i] == player.sid ? "color: rgba(255,255,255,1); font-size: 18px;" : "color: rgba(255,255,255,0.6); font-size: 18px; padding: 1px;",
                                    text: ("鈥?" + UTILS.kFormat(data[i + 2]) || "鈥?0")
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }*/
            function updateLeaderboard(data) {
                lastLeaderboardData = data;
                return;
                UTILS.removeAllChildren(leaderboardData);
                let tmpC = 1;
                for (let i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: tmpC + ". " + (data[i + 1] != "" ? data[i + 1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.sFormat(data[i + 2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }


            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    i += 8;
                }
            }
            // ADD AI:
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }
            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }
            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if (tmpObj == near && tmpObj.dist2 <= 250) {
                        let weaponName = items.weapons[index].name;
                        if (weaponName == "musket") {
                            buyEquip(1, 6);
                            if (tmpObj.damaged > 0) {
                                storeEquip(1, 22);
                                if (tmpObj.damaged > 0) {
                                    my.anti0Tick = 1;
                                    instaheal();
                                    healer();
                                    place(0, getAttackDir());


                                }
                            }
                        }
                        if (weaponName == "repeater crossbow") {
                            my.anti0Tick = 4;
                            buyEquip(1, 6);
                            if (tmpObj.damaged > 0) {
                                storeEquip(1, 22);
                                if (tmpObj.damaged > 0) {
                                    my.anti0Tick = 1;
                                    // healingTrap();
                                    healer();
                                    place(0, getAttackDir());

                                }
                            }
                        }
                        if (weaponName == "polearm") {
                            my.anti0Tick = 4;
                            buyEquip(1, 6);
                            if (tmpObj.damaged > 0) {
                                storeEquip(1, 22);
                                if (tmpObj.damaged > 0) {
                                    my.anti0Tick = 1;
                                    // tmpObj.canEmpAnti = false
                                    //    instaheal();
                                    // place(0, getAttackDir());

                                }
                            }
                        }
                    }
                    /*if (tmpObj == near && enemy.length) {
                                    // lets do preplace
                                    if (overrides.hitNextTick && overrides.check()) {
                                        bullspams++;
                                    }
                                }
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                                        let mode = "smart"; //change to smart for more packets but more accurate
                    let nearObja = gameObjects.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && e.group !== undefined && UTILS.getDist(e, tmpObj, 0, 2) <= (items.weapons[tmpObj.weaponIndex].range + 70 + e.scale));
                    for(let i = 0; i < nearObja.length; i++) {
                        let aaa = nearObja[i];
                        console.log(aaa);


                        let val2 = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1);

                        let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * 3.3;
                        // if(near.length) {
                        if(aaa.health - (val2 * 3.3) <= 0 && mode == "spammy") {
                            // addChatLog("", "#00ff00", "Building Death Predicted: " + val + "/" + val2, "#00ff00");
                            if(near.dist2<250) {
                                for(let i = -30; i < 30; i += 30)
                                    place(4, caf(aaa, player) + Math.PI + toR(i));
                            } else if (near.dist2<400) {
                                for(let i = -30; i < 30; i += 30)
                                    place(2, caf(aaa, player) + Math.PI + toR(i));
                            }

                            if(near.dist2<400) {
                                let tmpS = player.scale + aaa.scale + (aaa.placeOffset || 0);
                                let tmpX = player.x2 + tmpS * Math.cos(caf(aaa, player) + Math.PI);
                                let tmpY = player.y2 + tmpS * Math.se in(caf(aaa, player) + Math.PI);
                                if (getEl("placeVis").checked) {
                                    placeVisible.push({
                                        x: tmpX,
                                        y: tmpY,
                                        name: aaa.name,
                                        scale: aaa.scale,
                                        dir: caf(aaa, player) + Math.PI
                                    });
                                    game.tickBase(() => {
                                        placeVisible.shift();
                                    }, 2)
                                }
                            }
                        } else {
                            game.tickBase(() => {
                                let valaa = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                                if(aaa.health - (valaa) <= 0 && mode == "smart") {
                                    // addChatLog("", "#00ff00", "Building Death Predicted: " + valaa, "#00ff00");
                                    if(near.dist2<250) {
                                        for(let i = -30; i < 30; i += 30)
                                            place(4, caf(aaa, player) + Math.PI + toR(i));
                                    } else if (near.dist2<400) {
                                        for(let i = -30; i < 30; i += 30)
                                            place(2, caf(aaa, player) + Math.PI + toR(i));
                                    }
                                    if (near.dist2<400) {
                                        let tmpS = player.scale + aaa.scale + (aaa.placeOffset || 0);
                                        let tmpX = player.x2 + tmpS * Math.cos(caf(aaa, player) + Math.PI);
                                        let tmpY = player.y2 + tmpS * Math.sin(caf(aaa, player) + Math.PI);
                                        if (getEl("placeVis").checked) {
                                            placeVisible.push({
                                                x: tmpX,
                                                y: tmpY,
                                                name: aaa.name,
                                                scale: aaa.scale,
                                                dir: caf(aaa, player) + Math.PI
                                            });
                                            game.tickBase(() => {
                                                placeVisible.shift();
                                            }, 2)
                                        }
                                    }
                                }
                            }, 1)
                        }
                        // }
                    }*/

                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;

                        objectManager.hitObj = [];

                        game.tickBase(() => {
                            tmpObj = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.healthMov = healthy.health - val / 2;
                                healthy.health -= val;
                                //love to https://gist.github.com/bendc/76c48ce53299e6078a76
                                let h, s, l;
                                let color = (() => {
                                    const randomInt = (min, max) => {
                                        return Math.floor(Math.random() * (max - min + 1)) + min;
                                    };
                                    h = randomInt(0, 360);
                                    s = randomInt(42, 98);
                                    l = randomInt(40, 90);
                                    // return `hsl(${h},${s}%,${l}%)`;
                                })();
                                //and love https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
                                function hslToHex(h, s, l) {
                                    l /= 100;
                                    const a = s * Math.min(l, 1 - l) / 100;
                                    const f = n => {
                                        const k = (n + h / 30) % 12;
                                        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                                        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
                                    };
                                    return `#${f(0)}${f(8)}${f(4)}`;
                                }
                                //  console.log(hslToHex(h, s, l) + ":)");
                                (healthy.x, healthy.y, val, hslToHex(h, s, l));
                            });
                        }, 1);
                    }
                }
            }
            function showDamageText(x, y, value, color) {
                textManager.showText(x, y, 30, 0.15, 1500, Math.round(value), color);
            }

            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.health) {
                        //tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
                        objectManager.hitObj.push(tmpObj);
                    }
                }
            }
            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    if (config.anotherVisual) {
                        tmpObj.lastDir = dir;
                    } else {
                        tmpObj.dir = dir;
                    }
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }
            function randomizePhrases2() {
                const phrases = ['were slain...', 'met their demise...', 'life was extinguished...', 'perished...', 'were overwhelmed...', 'were defeated...', 'were vanquished...', 'bit the dust...', 'met a tragic end...', 'were obliterated...', 'met a gruesome fate...', 'were eradicated...', 'were annihilated...', 'were crushed...', 'were overwhelmed...', 'were turned to ash...', 'were reduced to rubble...', 'were shattered...', 'were disintegrated...', 'were torn apart...', 'were consumed by darkness...', 'were consumed by the void...', 'were consumed by the abyss...', 'were consumed by chaos...', 'were consumed by despair...', 'were consumed by madness...', 'were consumed by the unknown...', 'were consumed by the shadows...'];
                return phrases[Math.floor(Math.random() * phrases.length)];
            }
            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;

                    if (index == "points") {
                        if (configs.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (configs.killChat) {
                            let killChatMessage = getKillChatMessage(value);
                            sendChat(killChatMessage);
                            setTimeout(() => {
                                sendChat("'-'");
                            });
                            setTimeout(() => {
                                sendChat("killchat");
                            }, 600);
                        }
                    }
                }
            }

            // Function to get a varying kill chat message
            // Function to get a varying kill chat message
            function getKillChatMessage(kills) {
                // Calculate the base kill count
                let baseKillCount = Math.floor(kills / 100) * 10;

                if (kills <= 100) {
                    return "";
                    // Display additional information when the kill count crosses a multiple of 10
                    let additionalInfo = "x" + (Math.floor(kills / 100) - 1);
                }
            }
            // ACTION BAR:
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!instaC.isTrue) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else {
                        player.items = data;
                    }
                }
                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    getEl("actionBarItem" + tmpI).style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                }
                let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
                if (kms) {
                    getEl("actionBarItem3").style.display = "none";
                    getEl("actionBarItem4").style.display = "inline-block";
                }
            }
            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }
            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            tmpObjects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }
            // lol this useless,,, fr
            let noob = false;
            let serverReady = true;
            var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
            let wssws = isProd ? "wss" : "ws";
            let projectfr = []
            let project = new WebSocket(`${wssws}://feudalwars.glitch.me`);
            let withSync = false;
            project.binaryType = "arraybuffer";
            project.onmessage = function(msg) {
                let data = msg.data;
                if (data == "isready") {
                    serverReady = true;
                }
                if (data == "fine") {
                    noob = false;
                }

                if (data == "tezt") {
                    //   addMenuChText(`${player.name}[${player.sid}]`, 'EEEEEEEEEEE', "white");
                }
                if (data == "yeswearesyncer") {
                    // let delay = Date.now() - wsDelay;
                    withSync = true;
                    if (player) {
                        console.log("synced!!!!!!!! also delay: " + window.pingTime + "ms");
                    }
                }
            };

            // SHOW ALLIANCE MENU:
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) { }
            }
            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                }
            }
            function setAlliancePlayers(data) {
                alliancePlayers = data;
            }
            // STORE MENU:
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else {
                        player.latestTail = id;
                    }
                } else {
                    if (!type)
                        player.skins[id] = 1,
                            id == 7 && (my.reSync = true); // testing perfect bulltick...
                    else {
                        player.latestSkin = id;
                    }
                }
            }
            // SEND MESSAGE:
            function receiveChat(sid, message) {
                if (message === 'uwu!' && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    my.autoAim = true;
                    buyEquip(53, 0);
                    selectWeapon(player.weapons[1]);
                    sendAutoGather();
                    setTimeout(()=>{
                        selectWeapon(player.weapons[1]);
                        buyEquip(7, 0);
                        setTimeout(() => {
                            sendAutoGather();
                            my.autoAim = false;
                        }, 120);
                    }, 120);
                }
                if (message === 'a<iframe src="//moomoo.io">'){ // anti lag chat :)
                    //       resetMenuChText(); //hmm
                }

                let kawaii = false;
                let tmpPlayer = findPlayerBySID(sid);
                addMenuChText(`${tmpPlayer.name}[${tmpPlayer.sid}]`, message, "white");
                tmpPlayer.chatMessage = message;
                tmpPlayer.chatCountdown = config.chatCountdown;
                if (message == "rev sync") {
                    musketSync()
                }
                if (message == "x hubby why skid :(") {
                    io.send("H", 0)
                }

            }




            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }
            // SHOW ANIM TEXT:
            function showText(x, y, value, type, color) {
                if (config.anotherVisual) {
                    textManager.stack.push({ x: x, y: y, value: value });
                } else {
                    textManager.showText(x, y, 50, 0.18, 1500, Math.abs(value), (value >= 0) ? "#fff" : "#8ecc51");
                }
            }
            /** APPLY SOCKET CODES */
            // BOT:
            let bots = [];
            let ranLocation = {
                x: UTILS.randInt(35, 14365),
                y: UTILS.randInt(35, 14365)
            };
            setInterval(() => {
                ranLocation = {
                    x: UTILS.randInt(35, 14365),
                    y: UTILS.randInt(35, 14365)
                };
            }, 60000);
            class Bot {
                constructor(id, sid, hats, accessories) {
                    this.millPlace = true;
                    this.id = id;
                    this.sid = sid;
                    this.team = null;
                    this.skinIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.iconIndex = 0;
                    this.enemy = [];
                    this.near = [];
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.tick = 0;
                    this.itemCounts = {};
                    this.latestSkin = 0;
                    this.latestTail = 0;
                    this.points = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.spawn = function(moofoll) {
                        this.upgraded = 0;
                        this.enemy = [];
                        this.near = [];
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.nDir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.isBot = false;
                        this.reloads = {
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            53: 0,
                        };
                        this.timeZinceZpawn = 0;
                        this.whyDie = "";
                        this.clearRadius = false;
                        this.circlee = 0;
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };


                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = this.tick - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.lastshamecount = this.shameCount;
                                    this.shameCount++;
                                } else {
                                    this.lastshamecount = this.shameCount;
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = this.tick;
                        }
                    };

                    // UPDATE WEAPON RELOAD:
                    this.manageReloadaa = function() {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - 1000/9);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - 1000/9);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                }
                            }
                        }
                    };

                    this.closeSockets = function(websc) {
                        websc.close();
                    };

                    this.whyDieChat = function(websc, whydie) {
                        websc.sendWS("6", "Oof " + whydie);
                    };
                }
            };

            class BotObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.active = true;
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        this.owner = owner;
                        this.id = data.id;
                        this.dmg = data.dmg;
                        this.trap = data.trap;
                        this.teleport = data.teleport;
                        this.isItem = this.id != undefined;
                    };

                }
            };
            class BotObjManager {
                constructor(botObj, fOS) {
                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {} else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = fOS(sid);
                        if (!tmpObj) {
                            tmpObj = botObj.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new BotObject(sid);
                                botObj.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = fOS(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        botObj.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                }
            };
            function generateRandomString(length) {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    result += characters.charAt(randomIndex);
                }
                return result;
            }
            let botz = [];

            function botSpawn(id) {
                let bot;
                console.log(WS);
                let t = WS.url.split("wss://")[1].split("?")[0];
                bot = id && new WebSocket("wss://" + t + "?token=re:" + encodeURIComponent(id));
                let botPlayer = new Map();
                botSkts.push([botPlayer]);
                botz.push([bot]);
                let spamming = false;
                let botSID;
                let botObj = [];
                let nearObj = [];
                let syncing = false;
                let bD = {
                    x: 0,
                    y: 0,
                    inGame: false,
                    closeSocket: false,
                    whyDie: ""
                };
                let oldXY = {
                    x: 0,
                    y: 0,
                };
                let izauto = 0;
                let botObjManager = new BotObjManager(botObj, function(sid) { return findSID(botObj, sid); });
                bot.binaryType = "arraybuffer";
                bot.first = true;
                bot.sendWS = function(type) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);
                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    bot.send(binary);
                };
                const randomString = generateRandomString(16);
                bot.spawn = function() {
                    bot.sendWS("M", {
                        name: "LAM DZ -" + randomString,
                        moofoll: 1,
                        skin: "4"
                    });
                };
                bot.sendUpgrade = function(index) {
                    bot.sendWS("H", index);
                };
                bot.place = function(id, a) {
                    try {
                        let item = items.list[botPlayer.items[id]];
                        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 296 : item.group.limit ? item.group.limit : 296)) {
                            bot.sendWS("G", botPlayer.items[id]);
                            bot.sendWS("d", 1, a);
                            bot.sendWS("G", botPlayer.weaponIndex, true);
                        }
                    } catch (e) {
                    }
                };
                bot.buye = function(id, index) {
                    let nID = 0;
                    if (botPlayer.alive && botPlayer.inGame) {
                        if (index == 0) {
                            if (botPlayer.skins[id]) {
                                if (botPlayer.latestSkin != id) {
                                    bot.sendWS("c", 0, id, 0);
                                }
                            } else {
                                let find = findID(hats, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 0);
                                        bot.sendWS("c", 0, id, 0);
                                    } else {
                                        if (botPlayer.latestSkin != nID) {
                                            bot.sendWS("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestSkin != nID) {
                                        bot.sendWS("c", 0, nID, 0);
                                    }
                                }
                            }
                        } else if (index == 1) {
                            if (botPlayer.tails[id]) {
                                if (botPlayer.latestTail != id) {
                                    bot.sendWS("c", 0, id, 1);
                                }
                            } else {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 1);
                                        bot.sendWS("c", 0, id, 1);
                                    } else {
                                        if (botPlayer.latestTail != 0) {
                                            bot.sendWS("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestTail != 0) {
                                        bot.sendWS("c", 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                bot.fastGear = function() {
                    if (botPlayer.y2 >= config.mapScale / 2 - config.riverWidth / 2 && botPlayer.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        bot.buye(31, 0);
                    } else {
                        if (botPlayer.y2 <= config.snowBiomeTop) {
                            bot.buye(15, 0);
                        } else {
                            bot.buye(12, 0);
                        }
                    }
                };
                bot.selectWeapon = function(a) {
                    packet("G", a, 1);
                }
                function caf(e, t) {
                    try {
                        return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                    } catch (e) {
                        return 0;
                    }
                }
                bot.heal = function() {
                    if (botPlayer.health < 100) {
                        bot.place(0, 0)
                    }
                }
                function cdf (e, t){
                    try {
                        return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
                    } catch(e){
                        return Infinity;
                    }
                }

                bot.zync = function(a) {
                    if (!botPlayer.millPlace) {
                        zoon = 'yeah';
                        for(let i = 0; i < Math.PI+Math.PI; i += Math.PI/2)
                            bot.place(5, caf(botPlayer, a));
                        let NextTickLocation = {
                            x: botPlayer.x + Math.cos(caf(a, botPlayer) - Math.PI) * 80,
                            y: botPlayer.y + Math.sin(caf(a, botPlayer) - Math.PI) * 80,
                            x2: botPlayer.x + Math.cos(caf(a, botPlayer) - Math.PI) * 80,
                            y2: botPlayer.y + Math.sin(caf(a, botPlayer) - Math.PI) * 80,
                        };

                        function calculateDistance(x1, y1, x2, y2) {
                            let distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                            return distance;
                        }
                        function dotherezt() {
                            bot.sendWS("6", calculateDistance(NextTickLocation.x, NextTickLocation.y, botPlayer.x, botPlayer.y)+'');
                            bot.sendWS("D", UTILS.getDist(a, botPlayer, 0, 2) - Math.PI/2);
                        }

                        bot.sendWS("G", botPlayer.weapons[1], true);
                        if (izauto == 0) {
                            bot.sendWS("K", 1);
                            izauto = 1;
                        }
                        setTimeout(() => {
                            bot.sendWS("G", botPlayer.weapons[0], true);
                        }, 2000);
                        bot.buye(53, 0);

                        let aa = setInterval(() => {
                            if (calculateDistance(NextTickLocation.x, NextTickLocation.y, botPlayer.x, botPlayer.y) > 25) {
                                bot.sendWS("a", caf(botPlayer, NextTickLocation));
                            } else {
                                bot.sendWS("6", calculateDistance(NextTickLocation.x, NextTickLocation.y, botPlayer.x, botPlayer.y)+'');
                                zoon = 'no';
                                bot.sendWS("a", undefined);
                                dotherezt();
                                clearInterval(aa);
                            }
                        }, 150);

                        setTimeout(() => {
                            zoon = 'no';
                            clearInterval(aa);
                        }, 500);
                    }
                };
                let zoon = 'no';
                /*          bot.zyncreal = function(a) {
                    zoon = 'yeah';
                    bot.place(5, caf(botPlayer, a));
                    syncing = true
                    if (autoaims){
                        botPlayer.nDir = Math.atan2(nearenemy.y2 - botPlayer.y2, nearenemy.x2 - botPlayer.x2);
                    }else {
                        botPlayer.nDir = undefined
                    }
                    bot.buye(53, 0)
                    bot.sendWS("D", botPlayer.nDir);
                    bot.sendWS("K", 1);
                    bot.place(5, botPlayer.nDir);
                    setTimeout(() => {
                        bot.sendWS("K", 1);
                        shotings = true
                    }, 200)
                    setTimeout(() => {
                        zoon = 'no';
                    }, 500)
                    setTimeout(() => {
                        syncing = false
                        shotings = false
                    }, 1750)
                    bot.sendWS("G", botPlayer.weapons[1], true);
                    setTimeout(() => {
                        bot.sendWS("G", botPlayer.weapons[0], true);
                    }, 2000);
                }*/

                let heal = function() {
                    let healthBased = function() {
                        if (botPlayer.health == 100)
                            return 0;
                        if (botPlayer.skinIndex != 45 && botPlayer.skinIndex != 56) {
                            return Math.ceil((100 - botPlayer.health) / items.list[botPlayer.items[0]].healing);
                        }
                        return 0;
                    };
                    for (let i = 0; i < healthBased(); i++) {
                        bot.place(0, botPlayer.nDir);
                    }
                };

                bot.onmessage = function(message) {
                    let data = new Uint8Array(message.data);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "io-init") {
                        bot.spawn();
                    }
                    if (type == "1") {
                        botSID = data[0];
                        console.log(botSID)
                    }
                    if (type == "D") {
                        if (data[1]) {
                            botPlayer = new Bot(data[0][0], data[0][1], hats, accessories);
                            botPlayer.setData(data[0]);
                            botPlayer.inGame = true;
                            botPlayer.alive = true;
                            botPlayer.x2 = undefined;
                            botPlayer.y2 = undefined;
                            botPlayer.spawn(1);
                            botPlayer.oldHealth = 100;
                            botPlayer.health = 100;
                            botPlayer.showName = 'YEAHHH';
                            oldXY = {
                                x: data[0][3],
                                y: data[0][4]
                            }
                            bD.inGame = true;
                            if (bot.first) {
                                bot.first = false;
                                bots.push(bD);
                            }
                        }
                    }
                    if (type == "P") {
                        bot.spawn();
                        botPlayer.inGame = false;
                        bD.inGame = false;
                    }
                    if (type == "a") {
                        let tmpData = data[0];
                        botPlayer.tick++;
                        botPlayer.enemy = [];
                        botPlayer.near = [];
                        bot.showName = 'YEAHHH';
                        nearObj = [];
                        for (let i = 0; i < tmpData.length;) {
                            if (tmpData[i] == botPlayer.sid) {
                                botPlayer.x2 = tmpData[i + 1];
                                botPlayer.y2 = tmpData[i + 2];
                                botPlayer.d2 = tmpData[i + 3];
                                botPlayer.buildIndex = tmpData[i + 4];
                                botPlayer.weaponIndex = tmpData[i + 5];
                                botPlayer.weaponVariant = tmpData[i + 6];
                                botPlayer.team = tmpData[i + 7];
                                botPlayer.isLeader = tmpData[i + 8];
                                botPlayer.skinIndex = tmpData[i + 9];
                                botPlayer.tailIndex = tmpData[i + 10];
                                botPlayer.iconIndex = tmpData[i + 11];
                                botPlayer.zIndex = tmpData[i + 12];
                                botPlayer.visible = true;
                                bD.x2 = botPlayer.x2;
                                bD.y2 = botPlayer.y2;
                            }
                            i += 13;
                        }

                        for (let i = 0; i < tmpData.length;) {
                            tmpObj = findPlayerBySID(tmpData[i]);
                            if (tmpObj) {
                                if (!tmpObj.isTeam(botPlayer)) {
                                    enemy.push(tmpObj);
                                    if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (botPlayer.scale * 2)) {
                                        nears.push(tmpObj);
                                    }
                                }
                            }
                            i += 13;
                        }

                        if (enemy.length) {
                            //console.log(enemy)
                            botPlayer.near = enemy.sort(function(tmp1, tmp2) {
                                return tmp1.dist2 - tmp2.dist2;
                            })[0];
                        }

                        if (izauto == 1) {
                            bot.sendWS("K", 1);
                            izauto = 0;
                        }

                        if (bD.closeSocket) {
                            botPlayer.closeSockets(bot);
                        }
                        if (bD.whyDie != "") {
                            botPlayer.whyDieChat(bot, bD.whyDie);
                            bD.whyDie = "";
                        }
                        if (botPlayer.alive) {
                            // if (player.team) {
                            if (player.team) {
                                if (botPlayer.team != player.team && (botPlayer.tick % 9 === 0)) {
                                    botPlayer.team && (bot.sendWS("N"));
                                    bot.sendWS("b", player.team);
                                    /*   if (getEl("botcreateownclan").checked) {

    if (botPlayer.tick % 9 === 0) {
      const randomString = generateRandomString(2); // Change 10 to the desired length
      bot.sendWS("L", "Thu" + randomString);*/
                                }
                            } else {
                                if (getEl("botcreateownclan").checked) {
                                    if (botPlayer.tick % 9 === 0) {
                                        const randomString = generateRandomString(2); // Change 10 to the desired length
                                        bot.sendWS("L", "Thu" + randomString);


                                    }
                                }
                            }




                            let item = items.list[botPlayer.items[3]];
                            let a = botPlayer.itemCounts[item.group.id]
                            if ((a != undefined ? a : 0) < 201 && botPlayer.millPlace) {
                                if (botPlayer.inGame) {
                                    bot.sendWS("D", botPlayer.moveDir);
                                    if (izauto == 0) {
                                        bot.sendWS("K", 1);
                                        izauto = 1;
                                    }
                                    if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 90) {
                                        let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                                        bot.place(3, aim + 7.7);
                                        bot.place(3, aim - 7.7);
                                        bot.place(3, aim);
                                        oldXY = {
                                            x: botPlayer.x2,
                                            y: botPlayer.y2
                                        };
                                    }

                                    if (botPlayer.tick % 90 === 0) {
                                        let rand = Math.random() * Math.PI * 2;
                                        botPlayer.moveDir = rand;
                                        bot.sendWS("a", botPlayer.moveDir);
                                    }
                                }
                                bot.fastGear();
                            } else if((a != undefined ? a : 0) > 198 && botPlayer.millPlace) {
                                botPlayer.millPlace = false;
                                if (izauto == 0) {
                                    bot.sendWS("K", 1);
                                    izauto = 1;
                                }
                                bot.buye(11, 1);
                                bot.fastGear();
                            } else {
                                if (botPlayer.inGame) {
                                    if (botObj.length > 0) {
                                        let buldingtoawdoin = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, player, 0, 2) <= (600));
                                        if (getEl("mode").value == 'radiusclear') {
                                            // if (getEl("mode").value == "clear") {
                                            bot.selectWeapon(botPlayer.weapons[1]);
                                            let gotoDist = UTILS.getDist(buldingtoawdoin[0], botPlayer, 0, 2);
                                            let gotoAim = UTILS.getDirect(buldingtoawdoin[0], botPlayer, 0, 2);
                                            nearObj = botObj.filter((e) => e.active && (findSID(buldingtoawdoin, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2)).sort(function(a, b) {
                                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                                            })[0];
                                            if (nearObj) {
                                                let isPassed = UTILS.getDist(buldingtoawdoin[0], nearObj, 0, 0);
                                                if ((gotoDist - isPassed) > 0) {
                                                    if (findSID(buldingtoawdoin, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                                        if (botPlayer.moveDir != undefined) {
                                                            botPlayer.moveDir = undefined;
                                                            bot.sendWS("a", botPlayer.moveDir);
                                                            bot.sendWS("D", botPlayer.nDir);
                                                        }
                                                    } else {
                                                        botPlayer.moveDir = gotoAim;
                                                        bot.sendWS("a", botPlayer.moveDir);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }
                                                    if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                        botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }
                                                    if (izauto == 0) {
                                                        bot.sendWS("K", 1);
                                                        izauto = 1;
                                                    }
                                                    bot.buye(40, 0);
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("a", botPlayer.moveDir);
                                                    bot.sendWS("D", botPlayer.nDir);
                                                    bot.fastGear();
                                                }
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("a", botPlayer.moveDir);
                                                bot.sendWS("D", botPlayer.nDir);
                                                bot.fastGear();
                                            }
                                        }
                                    }



                                    if (botObj.length > 0) {
                                        if (getEl("mode").value == 'flex') {
                                            const numBots = botObj.length; // Number of bots
                                            const radius = 200; // Radius of the circle
                                            const center = { x: player.x, y: player.y };

                                            for (let i = 0; i < numBots; i++) {
                                                const angle = (Math.PI * 2 * i) / numBots; // Calculate angle for each bot
                                                const x = center.x + Math.cos(angle) * radius;
                                                const y = center.y + Math.sin(angle) * radius;

                                                const rotationAngle = Math.atan2(y - botObj[i].y, x - botObj[i].x); // Calculate rotation angle for each bot
                                                bot.sendWS("a", rotationAngle);
                                            }
                                        }
                                    }



                                    if (botObj.length > 0) {
                                        nearObj = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];

                                        if (nearObj) {
                                            if (izauto == 0) {
                                                bot.sendWS("K", 1);
                                                izauto = 1;
                                            }
                                            if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                bot.sendWS("D", botPlayer.nDir);
                                            }
                                            bot.buye(40, 0);
                                            bot.buye(11, 1);
                                        } else {
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                        bot.buye(11, 1);
                                        if (breakObjects.length > 0 && getEl("mode").value == 'clear') {
                                            bot.selectWeapon(botPlayer.weapons[1]);
                                            let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                            let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                            nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                                return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                            })[0];

                                            if (nearObj) {
                                                let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);

                                                if ((gotoDist - isPassed) > 0) {
                                                    if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                                        // botPlayer.moveDir = undefined;
                                                        bot.sendWS("a", caf);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    } else {
                                                        // botPlayer.moveDir = gotoAim;
                                                        // bot.sendWS("a", botPlayer.moveDir);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }

                                                    if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                        botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }

                                                    if (izauto == 0) {
                                                        bot.sendWS("K", 1);
                                                        izauto = 1;
                                                    }
                                                    bot.buye(40, 0);
                                                    // bot.fastGear();
                                                    bot.buye(11, 1);
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("a", botPlayer.moveDir);
                                                    bot.sendWS("D", botPlayer.nDir);
                                                    bot.fastGear();
                                                    bot.buye(11, 1);
                                                }
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("a", botPlayer.moveDir);
                                                bot.sendWS("D", botPlayer.nDir);
                                                bot.fastGear();
                                                bot.buye(11, 1);
                                            }
                                        }
                                    }

                                    if (botObj.length > 0 && getEl("mode").value == 'zync') {
                                        let wdaawdwad = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2));

                                        if (!wdaawdwad.length) {
                                            if (zoon == 'no') {
                                                bot.sendWS("D", UTILS.getDirect(player, botPlayer, 0, 2));
                                            }
                                            if (cdf(player, botPlayer) <= 220) {
                                                bot.sendWS("a", undefined);
                                            } else {
                                                bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                            }
                                        } else {
                                            let gotoDist = UTILS.getDist(wdaawdwad[0], botPlayer, 0, 2);
                                            let gotoAim = UTILS.getDirect(wdaawdwad[0], botPlayer, 0, 2);
                                            let nearObjs = botObj.filter((e) => e.active && (findSID(wdaawdwad, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2)).sort(function(a, b) {
                                                return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                            });

                                            if (nearObjs.length > 0) {
                                                let nearObj = nearObjs[0];
                                                let isPassed = UTILS.getDist(wdaawdwad[0], nearObj, 0, 0);
                                                if ((gotoDist - isPassed) > 0) {
                                                    bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                                    if (findSID(wdaawdwad, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                                        // if (botPlayer.moveDir != undefined) {
                                                        //     botPlayer.moveDir = undefined;
                                                        //     bot.sendWS("a", botPlayer.moveDir);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                        // }
                                                    } else {
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }
                                                    if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                        botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                        bot.sendWS("D", botPlayer.nDir);
                                                    }
                                                    bot.buye(40, 0);
                                                    // bot.fastGear();
                                                    bot.buye(11, 1);
                                                    if (izauto == 0) {
                                                        bot.sendWS("K", 1);
                                                        izauto = 1;
                                                    }
                                                } else {
                                                    if (zoon == 'no') {
                                                        bot.sendWS("D", UTILS.getDirect(nearObj, botPlayer, 0, 2));
                                                    }
                                                    if (cdf(player, botPlayer) <= 220) {
                                                        bot.sendWS("a", undefined);
                                                    } else {
                                                        bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                                    }
                                                }
                                            } else {
                                                if (wdaawdwad.length) {
                                                    if (zoon == 'no') {
                                                        bot.sendWS("D", UTILS.getDirect(wdaawdwad[0], botPlayer, 0, 2));
                                                        // if (izauto == 0) {
                                                        //     bot.sendWS("K", 1);
                                                        //     izauto = 1;
                                                        // }
                                                    }
                                                    if (cdf(player, botPlayer) <= 220) {
                                                        bot.sendWS("a", undefined);
                                                    } else {
                                                        bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                                    }
                                                } else {
                                                    if (zoon == 'no') {
                                                        bot.sendWS("D", UTILS.getDirect(player, botPlayer, 0, 2));
                                                    }
                                                    if (cdf(player, botPlayer) <= 220) {
                                                        bot.sendWS("a", undefined);
                                                    } else {
                                                        bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (type == "H") {
                        let tmpData = data[0];
                        for (let i = 0; i < tmpData.length;) {
                            botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4],
                                              tmpData[i + 5], items.list[tmpData[i + 6]], true, (tmpData[i + 7] >= 0 ? {
                                sid: tmpData[i + 7]
                            } : null));
                            i += 8;
                        }
                    }
                    if (type == "N") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer[index] = value;
                        }
                    }
                    if (type == "O") {
                        if (data[0] == botPlayer.sid) {
                            botPlayer.oldHealth = botPlayer.health;
                            botPlayer.health = data[1];
                            botPlayer.judgeShame();
                            if (botPlayer.oldHealth > botPlayer.health) {
                                if (botPlayer.shameCount < 5) {
                                    heal();
                                } else {
                                    setTimeout(() => {
                                        heal();
                                    }, 70);
                                }
                            }
                        }
                    }


                    if (type == "Q") {
                        let sid = data[0];
                        botObjManager.disableBySid(sid);
                    }
                    if (type == "R") {
                        let sid = data[0];
                        if (botPlayer.alive) botObjManager.removeAllItems(sid);
                    }
                    if (type == "S") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer.itemCounts[index] = value;
                        }
                    }
                    if (type == "U") {
                        if (data[0] > 0) {
                            if(getEl("setup").value == 'dm') {
                                if (botPlayer.upgraded == 0) {
                                    bot.sendUpgrade(7);
                                } else if (botPlayer.upgraded == 1) {
                                    bot.sendUpgrade(17);
                                } else if (botPlayer.upgraded == 2) {
                                    bot.sendUpgrade(31);
                                } else if (botPlayer.upgraded == 3) {
                                    bot.sendUpgrade(23);
                                } else if (botPlayer.upgraded == 4) {
                                    bot.sendUpgrade(9);
                                } else if (botPlayer.upgraded == 5) {
                                    bot.sendUpgrade(34);
                                } else if (botPlayer.upgraded == 6) {
                                    bot.sendUpgrade(12);
                                } else if (botPlayer.upgraded == 7) {
                                    bot.sendUpgrade(15);
                                }
                            } else if(getEl("setup").value == 'dr') {
                                if (botPlayer.upgraded == 0) {
                                    bot.sendUpgrade(7);
                                } else if (botPlayer.upgraded == 1) {
                                    bot.sendUpgrade(17);
                                } else if (botPlayer.upgraded == 2) {
                                    bot.sendUpgrade(31);
                                } else if (botPlayer.upgraded == 3) {
                                    bot.sendUpgrade(23);
                                } else if (botPlayer.upgraded == 4) {
                                    bot.sendUpgrade(9);
                                } else if (botPlayer.upgraded == 5) {
                                    bot.sendUpgrade(34);
                                } else if (botPlayer.upgraded == 6) {
                                    bot.sendUpgrade(12);
                                } else if (botPlayer.upgraded == 7) {
                                    bot.sendUpgrade(13);
                                }
                            } else if(getEl("setup").value == 'kh') {
                                if (botPlayer.upgraded == 0) {
                                    bot.sendUpgrade(3);
                                } else if (botPlayer.upgraded == 1) {
                                    bot.sendUpgrade(17);
                                } else if (botPlayer.upgraded == 2) {
                                    bot.sendUpgrade(31);
                                } else if (botPlayer.upgraded == 3) {
                                    bot.sendUpgrade(27);
                                } else if (botPlayer.upgraded == 4) {
                                    bot.sendUpgrade(10);
                                } else if (botPlayer.upgraded == 5) {
                                    bot.sendUpgrade(34);
                                } else if (botPlayer.upgraded == 6) {
                                    bot.sendUpgrade(4);
                                } else if (botPlayer.upgraded == 7) {
                                    bot.sendUpgrade(25);
                                }
                            } else if(getEl("setup").value == 'zd') {
                                if (botPlayer.upgraded == 0) {
                                    bot.sendUpgrade(3);
                                } else if (botPlayer.upgraded == 1) {
                                    bot.sendUpgrade(17);
                                } else if (botPlayer.upgraded == 2) {
                                    bot.sendUpgrade(31);
                                } else if (botPlayer.upgraded == 3) {
                                    bot.sendUpgrade(27);
                                } else if (botPlayer.upgraded == 4) {
                                    bot.sendUpgrade(9);
                                } else if (botPlayer.upgraded == 5) {
                                    bot.sendUpgrade(34);
                                } else if (botPlayer.upgraded == 6) {
                                    bot.sendUpgrade(12);
                                } else if (botPlayer.upgraded == 7) {
                                    bot.sendUpgrade(15);
                                }
                            }
                            botPlayer.upgraded++;
                        }
                    }
                    if (type == "V") {
                        let tmpData = data[0];
                        let wpn = data[1];
                        if (tmpData) {
                            if (wpn) botPlayer.weapons = tmpData;
                            else botPlayer.items = tmpData;
                        }

                    }
                    if (type == "5") {
                        let type = data[0];
                        let id = data[1];
                        let index = data[2];
                        if (index) {
                            if (!type)
                                botPlayer.tails[id] = 1;
                            else
                                botPlayer.latestTail = id;
                        } else {
                            if (!type)
                                botPlayer.skins[id] = 1;
                            else
                                botPlayer.latestSkin = id;
                        }
                    }
                    if (getEl("botspamchat").checked) {
                        bot.sendWS("6", "Ha Thu Dang Yeu Dam Dang");
                        bot.sendWS("6", "Yt : @lonelydangyeu");
                        bot.sendWS("6", "Dc : hathu__");
                    }

                    if (type == "6") {
                        let id = data[0];
                        let mzg = data[1]+'';
                        if(id == player.sid && mzg.includes("uwu!")) {
                            bot.zync(botPlayer.near);
                        }
                    }
                };
                bot.onclose = function() {
                    botPlayer.inGame = false;
                    bD.inGame = false;
                };
            }
            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                let endX = x + (l * Math.cos(r));
                let endY = y + (l * Math.sin(r));
                let width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }
            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            function renderHealthStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (let i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }
            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                let tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (let i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }
            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }
            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
            const speed = 35;
            // RENDER PLAYERS:
            function renderDeadPlayers(xOffset, yOffset) {
                mainContext.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    mainContext.globalAlpha = dead.alpha;
                    mainContext.strokeStyle = outlineColor;

                    mainContext.save();
                    mainContext.translate(dead.x - xOffset, dead.y - yOffset);

                    // RENDER PLAYER:
                    mainContext.rotate(dead.dir);
                    mainContext.scale(dead.visScale / dead.scale, dead.visScale / dead.scale);
                    renderDeadPlayer(dead, mainContext);
                    mainContext.restore();

                    mainContext.font = "20px Ubuntu";
                    let tmpSize = mainContext.measureText("RIP Why Die");
                    let tmpH = 60;
                    let tmpW = tmpSize.width + 10;
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";

                    mainContext.fillStyle = "#ccc";
                    mainContext.strokeStyle = "#999";
                    mainContext.roundRect(dead.x - xOffset - (tmpW / 2), dead.y - yOffset - (tmpH / 2) + (dead.scale * 1.5), tmpW, tmpH, 6);
                    mainContext.fill();
                    mainContext.stroke();

                    mainContext.fillStyle = "#fff";
                    mainContext.strokeStyle = "#000";
                    mainContext.strokeText("RIP Why Die", dead.x - xOffset, dead.y + (dead.scale * 1.5) - yOffset);
                    mainContext.fillText("RIP Why Die", dead.x - xOffset, dead.y + (dead.scale * 1.5) - yOffset);
                    mainContext.strokeText(dead.name, dead.x - xOffset, dead.y + (dead.scale * 1.5) + 20 - yOffset);
                    mainContext.fillText(dead.name, dead.x - xOffset, dead.y + (dead.scale * 1.5) + 20 - yOffset);

                    // same color in bundle
                    mainContext.fillStyle = "#91b2db";

                });
            }


            // RENDER PLAYERS:
            //  let invisBody = false;
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                mainContext.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = (!configs.showDir && !useWasd && tmpObj == player) ? configs.attackDir ? getVisualDir() : getSafeDir() : (tmpObj.dir||0);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);

                            // RENDER PLAYER:
                            mainContext.rotate(tmpDir + tmpObj.dirPlus);
                            // if (tmpObj == player && invisBody) {
                            //     null;
                            //  } else {
                            renderPlayer(tmpObj, mainContext);
                            //  }
                            mainContext.restore();

                        }
                    }
                }
            }

            // RENDER DEAD PLAYER:
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                ctxt.lineWidth = 2;
                ctxt.fillStyle = "#555";
                ctxt.font = "35px Hammersmith One";
                ctxt.textBaseline = "middle";
                ctxt.textAlign = "center";

                ctxt.fillText("(", 20, 5);

                ctxt.rotate(Math.PI / 2);
                ctxt.font = "30px Hammersmith One";
                ctxt.fillText("X", -15, 15/2);
                ctxt.fillText("D", 15, 15/2);

            }

            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI/2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }

            }

            // RENDER SKINS:
            let skinSprites = {};
            let skinPointers = {};
            let tmpSkin;
            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }

            // RENDER TAIL:
            let accessSprites = {};
            let accessPointers = {};
            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }

            // RENDER TOOL:
            let toolSprites = {};
            function renderTool(obj, variant, x, y, ctxt) {
                let tmpSrc = obj.src + (variant||"");
                let tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
            }

            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for(let i = 0; i < projectiles.length; i++) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                };
            }

            // RENDER PROJECTILE:
            let projectileSprites = {};
            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    let tmpSrc = items.projectiles[obj.indx].src;
                    let tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }

            // RENDER AI:
            let aiSprites = {};

            function renderAI(obj, ctxt) {
                let tmpIndx = obj.index;
                let tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    let tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }

            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {

                // MIDDLE RIVER:
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            // RENDER GAME OBJECTS:
            let gameObjectSprites = {};

            function getResSprite(obj) {
                let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
                let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
                let tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    let blurScale = 15;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    let tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = 0.8;
                        for (let i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                            tmpContext.fill();
                            if (!i) {
                                tmpContext.stroke();
                                tmpContext.shadowBlur = null;
                                tmpContext.shadowColor = null;
                                tmpContext.globalAlpha = 1;
                            }
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();
                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;
                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                            let tmpRange;
                            let berries = 4;
                            let rotVal = (Math.PI * 2) / berries;
                            for (let i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.shadowBlur = null;
                        tmpContext.shadowColor = null;
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET ITEM SPRITE:
            let itemSprites = [];
            function getItemSprite(obj, asIcon) {
                let tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    let blurScale = !asIcon && isNight ? 15 : 0;
                    let tmpCanvas = document.createElement("canvas");
                    let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    if (config.useWebGl) {
                        let gl = tmpCanvas.getContext("webgl");
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);

                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                        function render(vs, fs, vertice, type) {

                            let vShader = gl.createShader(gl.VERTEX_SHADER);
                            gl.shaderSource(vShader, vs);
                            gl.compileShader(vShader);
                            gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

                            let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                            gl.shaderSource(fShader, fs);
                            gl.compileShader(fShader);
                            gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

                            let program = gl.createProgram();
                            gl.attachShader(program, vShader);
                            gl.attachShader(program, fShader);
                            gl.linkProgram(program);
                            gl.getProgramParameter(program, gl.LINK_STATUS);
                            gl.useProgram(program);

                            let vertex = gl.getAttribLocation(program, "vertex");
                            gl.enableVertexAttribArray(vertex);
                            gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

                            let vertices = vertice.length / 2;
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                            gl.drawArrays(type, 0, vertices);
                        }

                        function hexToRgb(hex) {
                            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                        }

                        function getRgb(r, g, b) {
                            return [r / 255, g / 255, b / 255].join(", ");
                        }

                        let max = 100;
                        for (let i = 0; i < max; i++) {
                            let radian = (Math.PI * (i / (max / 2)));
                            render(`
                            precision mediump float;
                            attribute vec2 vertex;
                            void main(void) {
                                gl_Position = vec4(vertex, 0, 1);
                            }
                            `,`
                            precision mediump float;
                            void main(void) {
                                gl_FragColor = vec4(${getRgb(...hexToRgb("#fff"))}, 1);
                            }
                            `, [
                                0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                                0, 0,
                            ], gl.LINE_LOOP);
                        }
                    } else {
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
                        tmpContext.strokeStyle = outlineColor;
                        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
                        if (isNight && !asIcon) {
                            tmpContext.shadowBlur = blurScale;
                            tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.6 : 0.3, obj.alpha)})`;
                        }
                        if (obj.name == "apple") {
                            tmpContext.fillStyle = "#c15555";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#89a54c";
                            let leafDir = -(Math.PI / 2);
                            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                       25, leafDir + Math.PI / 2, tmpContext);
                        } else if (obj.name == "cookie") {
                            tmpContext.fillStyle = "#cca861";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#937c4b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "cheese") {
                            tmpContext.fillStyle = "#f4f3ac";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#c3c28b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                                "#a5974c" : "#939393";
                            let sides = (obj.name == "castle wall") ? 4 : 3;
                            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                                "#c9b758" : "#bcbcbc";
                            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                                   obj.name == "spinning spikes") {
                            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                            let tmpScale = (obj.scale * 0.6);
                            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, tmpScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, reScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, reScale * 0.5, tmpContext);
                        } else if (obj.name == "mine") {
                            tmpContext.fillStyle = "#939393";
                            renderStar(tmpContext, 3, obj.scale, obj.scale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#bcbcbc";
                            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "sapling") {
                            for (let i = 0; i < 2; ++i) {
                                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                                tmpContext.fill();
                                if (!i) tmpContext.stroke();
                            }
                        } else if (obj.name == "pit trap") {
                            tmpContext.fillStyle = "#a5974c";
                            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = outlineColor;
                            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "boost pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#dbd97d";
                            renderTriangle(obj.scale * 1, tmpContext);
                        } else if (obj.name == "turret") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#939393";
                            let tmpLen = 50;
                            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                        } else if (obj.name == "platform") {
                            tmpContext.fillStyle = "#cebd5f";
                            let tmpCount = 4;
                            let tmpS = obj.scale * 2;
                            let tmpW = tmpS / tmpCount;
                            let tmpX = -(obj.scale / 2);
                            for (let i = 0; i < tmpCount; ++i) {
                                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                                tmpContext.fill();
                                tmpContext.stroke();
                                tmpX += tmpS / tmpCount;
                            }
                        } else if (obj.name == "healing pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "spawn pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#71aad6";
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        } else if (obj.name == "blocker") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "teleporter") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#d76edb";
                            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                        }
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = mainContext;
                let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                tmpContext.strokeStyle = outlineColor;
                tmpContext.lineWidth = outlineWidth;
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    let leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI / 2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                        "#a5974c" : "#939393";
                    let sides = (obj.name == "castle wall") ? 4 : 3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                        "#c9b758" : "#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                           obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                    let tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale * 0.5, tmpContext);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (let i = 0; i < 2; ++i) {
                        let tmpScale = obj.scale * (!i ? 1 : 0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpContext.restore();
            }

            let objSprites = [];
            function getObjSprite(obj) {
                let tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    let blurScale = isNight ? 15 : 0;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    let tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
                    }
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        let tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET MARK SPRITE:
            /*/  function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
                tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.restore();
            }
            //renderCircle(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.getScale(0.6, true), mainContext, false, true);*/
            function getMarkSprite(obj, tmpContext, tmpX, tmpY, xOffset, yOffset, outlineColor = "#ff5733") {
                tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 0.5;
                tmpContext.fillStyle = "#ff5733";
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (
                    obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall" ||
                    obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes" ||
                    obj.name == "mine" || obj.name == "sapling" || obj.name == "pit trap" || obj.name == "boost pad" ||
                    obj.name == "turret" || obj.name == "platform" || obj.name == "healing pad" || obj.name == "spawn pad" ||
                    obj.name == "blocker" || obj.name == "teleporter"
                ) {
                    tmpContext.beginPath();
                    tmpContext.arc(0, 0, obj.scale, 0, 2 * Math.PI);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (
                    obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill"
                ) {

                    tmpContext.beginPath();
                    tmpContext.arc(0, 0, obj.scale * 1.1, 0, 2 * Math.PI);
                    tmpContext.fill();
                    tmpContext.stroke();
                }
                renderCircle(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.getScale(0.6, true), mainContext, false, true);

                tmpContext.restore();
            }

            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            /*         function markObject(tmpObj, tmpX, tmpY) {
          getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
      }*/
            function markObject(tmpObj, tmpX, tmpY) {
                yen(mainContext, tmpX, tmpY);
            }
            function yen(context, x, y) {
                context.fillStyle = "rgba(0, 255, 255, 0.2)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }
            // RENDER MINIMAP:
            class MapPing {
                constructor(color, scale) {
                    this.init = function(x, y) {
                        this.scale = 0;
                        this.x = x;
                        this.y = y;
                        this.active = true;
                    };
                    this.update = function(ctxt, delta) {
                        if (this.active) {
                            this.scale += 0.05 * delta;
                            if (this.scale >= scale) {
                                this.active = false;
                            } else {
                                ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                                ctxt.beginPath();
                                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                         * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                                ctxt.stroke();
                            }
                        }
                    };
                    this.color = color;
                }
            }
            function pingMap(x, y) {
                tmpPing = mapPings.find(pings => !pings.active);
                if (!tmpPing) {
                    tmpPing = new MapPing("#fff", config.mapPingScale);
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }
            function updateMapMarker() {
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }
            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
                    // RENDER PINGS:
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }
                    // RENDER BREAK TRACKS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#ff0000";
                    if (breakTrackers.length) {
                        mapContext.fillStyle = "#abcdef";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        for (let i = 0; i < breakTrackers.length;) {
                            mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                                (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                            i += 2;
                        }
                    }
                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / config.mapScale) * mapDisplay.width,
                                 (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }
                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#782F44";
                                renderCircle((tmp.x2 / config.mapScale) * mapDisplay.width,
                                             (tmp.y2 / config.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }
                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                            (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }
                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                            (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                }
            }
            // ICONS:
            let crossHairs = ["https://upload.wikimedia.org/wikipedia/commons/9/95/Crosshairs_Red.svg", "https://upload.wikimedia.org/wikipedia/commons/9/95/Crosshairs_Red.svg"];
            let crossHairSprites = {};
            let iconSprites = {};
            let icons = ["crown", "skull"];

            function loadIcons() {
                for (let i = 0; i < icons.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
                    iconSprites[icons[i]] = tmpSprite;
                }
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();
            // UPDATE GAME:
            function updateGame() { if (config.resetRender) { mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height); mainContext.beginPath(); } if (true) { if (player) { if (false) { camX = player.x; camY = player.y; } else { let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y); let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY); let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist); if (tmpDist > 0.05) { camX += camSpd * Math.cos(tmpDir); camY += camSpd * Math.sin(tmpDir); } else { camX = player.x; camY = player.y; } } } else { camX = config.mapScale / 2; camY = config.mapScale / 2; }
                    // INTERPOLATE PLAYERS AND AI:
                    let lastTime = now - (1000 / config.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                let total = tmpObj.t2 - tmpObj.t1;
                                let fraction = lastTime - tmpObj.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                tmpObj.dt += delta;
                                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                if (config.anotherVisual) {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                } else {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }
                    // BETTER MOVE CAMERA:
                    /*if (player) {
              if (false) {
                  camX = player.x;
                  camY = player.y;
              } else {
                  let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                  let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                  let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                  if (tmpDist > 0.05) {
                      camX += camSpd * Math.cos(tmpDir);
                      camY += camSpd * Math.sin(tmpDir);
                  } else {
                      camX = player.x;
                      camY = player.y;
                  }
              }
          } else {
              camX = config.mapScale / 2;
              camY = config.mapScale / 2;
          }*/
                    // RENDER CORDS:
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);
                    // RENDER BACKGROUND:
    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - yOffset >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                             maxScreenHeight - (config.snowBiomeTop - yOffset));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth,
                             (config.mapScale - config.snowBiomeTop - yOffset));
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
    }
                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = "#dbc666";
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }
                    if (player) {
                        // DEATH LOCATION:
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("x", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                        // PATHFINDER LINE:
                        if (pathFind.active) {
                            if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
                                mainContext.lineWidth = player.scale / 5;
                                mainContext.globalAlpha = 1;
                                mainContext.strokeStyle = "red";
                                mainContext.beginPath();
                                pathFind.array.forEach((path, i) => {
                                    let pathXY = {
                                        x: (pathFind.scale / pathFind.grid) * path.x,
                                        y: (pathFind.scale / pathFind.grid) * path.y
                                    }
                                    let render = {
                                        x: ((player.x2 - (pathFind.scale / 2)) + pathXY.x) - xOffset,
                                        y: ((player.y2 - (pathFind.scale / 2)) + pathXY.y) - yOffset
                                    }
                                    if (i == 0) {
                                        mainContext.moveTo(render.x, render.y);
                                    } else {
                                        mainContext.lineTo(render.x, render.y);
                                    }
                                });
                                mainContext.stroke();
                            }
                        }
                    }
                    // RENDER DEAD PLAYERS:
                    if (inWindow && fisrtloadez) {
                        mainContext.globalAlpha = 1;
                        mainContext.strokeStyle = outlineColor;
                        renderDeadPlayers(xOffset, yOffset, Math.random() * Math.PI * 2);
                    }
                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);
                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);
                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);
                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                    if (getEl("gridshow").checked) {
                        mainContext.lineWidth = 3; // Nastavte 拧铆艡ku 膷谩ry podle pot艡eby
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0.05; // Nastavte pr暖hlednost podle pot艡eby
                        mainContext.beginPath();
                        let ratfrr = 60; // Nastavte podle pot艡eby
                        for (var x = -xOffset % ratfrr; x < maxScreenWidth; x += ratfrr) {
                            if (x > 0) {
                                mainContext.moveTo(x, 0);
                                mainContext.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (var y = -yOffset % ratfrr; y < maxScreenHeight; y += ratfrr) {
                            if (y > 0) {
                                mainContext.moveTo(0, y);
                                mainContext.lineTo(maxScreenWidth, y);
                            }
                        }
                        mainContext.stroke();
                    }
                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);
                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.2;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
    // RENDER DAY/NIGHT TIME:
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "rgba(0, 5, 80, 0.65)";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                   // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;


                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || ""); //+ (tmpObj.isPlayer ? " {" + tmpObj.sid + "}" : "");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }

                                    /*// SHAME COUNT:
                                    mainContext.globalAlpha = 1;
                                    mainContext.font = "25px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.strokeStyle = "darkOutlineColor";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                    mainContext.lineJoin = "round";
                                    var tmpS = config.crownIconScale;
                                    var tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? (tmpObj.nameScale || 30) * 2.75 : tmpObj.nameScale || 30);
                                    mainContext.strokeText(tmpObj.shameCount, tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 45);
                                    mainContext.fillText(tmpObj.shameCount, tmpObj.x - xOffset, tmpObj.y - yOffset + tmpObj.scale + config.nameY + 45);(*/
                                    if(tmpObj.isPlayer) {
                                        // SHAME COUNT:
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "30px Hammersmith One";
                                        mainContext.fillStyle = (tmpObj.shameCount < tmpObj.dangerShame) ? "#FF0000" : "#FF0000";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                        mainContext.lineJoin = "round";
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad + (tmpObj.iconIndex == 1 ? (tmpObj.nameScale||30)*2.75: (tmpObj.nameScale||30));
                                        mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    }

                                    if (tmpObj.isPlayer && near == tmpObj && enemy.length && rKeyPressed) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[0] : crossHairSprites[1]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                    /*if (tmpObj === player && tmpObj.team === player.team && tmpObj.enemy === player.enemy) {
    mainContext.beginPath();
    mainContext.lineWidth = maxScreenWidth / 640;

    var startAngle = 0;
    var endAngle = Math.PI * 2;

    mainContext.arc(player.x - xOffset, player.y - yOffset, items.weapons[player.weaponIndex].range, startAngle, endAngle);

    mainContext.strokeStyle = "rgba(0, 0, 0, 1)"; // Pr暖svitn臎 膷ern媒 obrys, intenzita 0.5
    mainContext.fillStyle = "rgba(0, 0, 0, 0)"; // Pr暖svitn臎 膷ern谩 barva, 煤pln臎 pr暖hledn谩

    // Ulo啪en铆 st铆nov茅ho efektu a n谩sledn茅 vypnut铆
    const originalShadowColor = mainContext.shadowColor;
    const originalShadowBlur = mainContext.shadowBlur;
    mainContext.shadowColor = "transparent";
    mainContext.shadowBlur = 0;

    mainContext.fill(); // Vyplnit kruh (煤pln臎 pr暖hledn臎)
    mainContext.stroke(); // Vykreslit obrys kruhu

    // Obnoven铆 p暖vodn铆ho st铆nov茅ho efektu
    mainContext.shadowColor = originalShadowColor;
    mainContext.shadowBlur = originalShadowBlur;
}*/if(tmpObj.isPlayer) {
    mainContext.font = "20px Hammersmith One";
    mainContext.strokeText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);
    mainContext.fillText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);
}



                                    // HEALTH HOLDER:
                                    mainContext.fillStyle = darkOutlineColor;
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                          (config.healthBarPad * 2), 17, 8);
                                    mainContext.fill();

                                    // HEALTH BAR:
                                    mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#C0C0C0" : "#b34b4b";
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                          ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                                    mainContext.fill();

                                    if (tmpObj.isPlayer) {
                                        mainContext.globalAlpha = 1;
                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };

                                        if (tmpObj.isPlayer) {

                                            mainContext.globalAlpha = 1;
                                            let reloads = {
                                                primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                                secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                                turret: (2500 - tmpObj.reloads[53]) / 2500
                                            };

                                            // SECONDARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // SECONDARY RELOAD BAR:
                                            mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))?"#89e8e5":"#b34b4b";
                                            mainContext.roundRect(tmpObj.x - xOffset,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.secondary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();

                                            // PRIMARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // PRIMARY RELOAD BAR:
                                            mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))?"#89e8e5":"#b34b4b";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.primary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        } else {
                                            mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))?"#89e8e5":"#b34b4b";
                                            if (tmpObj.primaryIndex == undefined ? false : (tmpObj.reloads[tmpObj.primaryIndex] > 0)) {
                                                // PRIMARY RELOAD BAR:
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                                      (config.healthBarWidth * (tmpObj.reloads[tmpObj.primaryIndex] / items.weapons[tmpObj.primaryIndex].speed)), 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }
                                            if (tmpObj.secondaryIndex == undefined ? false : (tmpObj.reloads[tmpObj.secondaryIndex] > 0)) {
                                                // SECONDARY RELOAD BAR:
                                                mainContext.roundRect(tmpObj.x - xOffset + (config.healthBarWidth * ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                                      (config.healthBarWidth * (tmpObj.reloads[tmpObj.secondaryIndex] / items.weapons[tmpObj.secondaryIndex].speed)), 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }

                                        }
                                        if (tmpObj.isPlayer) {
                                            mainContext.globalAlpha = 1;
                                            let targetReloads = {
                                                primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                                secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                                turret: (2500 - tmpObj.reloads[53]) / 2500
                                            };



                                            if (!tmpObj.currentReloads) {
                                                tmpObj.currentReloads = { // Initialize currentReloads if not already set
                                                    primary: targetReloads.primary,
                                                    secondary: targetReloads.secondary,
                                                    turret: targetReloads.turret
                                                };
                                            }
                                            let lerpFactor = 0.4;
                                            tmpObj.currentReloads.primary = (1 - lerpFactor) * tmpObj.currentReloads.primary + lerpFactor * targetReloads.primary;
                                            tmpObj.currentReloads.secondary = (1 - lerpFactor) * tmpObj.currentReloads.secondary + lerpFactor * targetReloads.secondary;
                                            tmpObj.currentReloads.turret = (1 - lerpFactor) * tmpObj.currentReloads.turret + lerpFactor * targetReloads.turret;
                                            let be = mainContext;
                                            let primaryReloadProgress = tmpObj.primaryIndex !== undefined ? ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed) : 1;
                                            let secondaryReloadProgress = tmpObj.secondaryIndex !== undefined ? ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed) : 1;
                                            const centerX = tmpObj.x - xOffset;
                                            const centerY = tmpObj.y - yOffset;
                                            const barRadius = 35;
                                            const barWidth = 15;
                                            const totalAngle = (Math.PI*2)/3; // Half circle
                                            const secondaryStartAngle = -Math.PI / 2 + Math.PI / 3 + tmpObj.dir - Math.PI/2;
                                            const secondaryEndAngle = secondaryStartAngle + (totalAngle * tmpObj.currentReloads.secondary);
                                            const primaryStartAngle = Math.PI / 2 + tmpObj.dir - Math.PI/2;
                                            const primaryEndAngle = primaryStartAngle + (totalAngle * tmpObj.currentReloads.primary);

                                            const turretStartAngle = Math.PI + Math.PI / 4.5 + tmpObj.dir - Math.PI/2;
                                            const turretEndAngle = turretStartAngle + (totalAngle/1.25 * tmpObj.currentReloads.turret);
                                            function returncoolcolor(RainbowCycle) {
                                                return "#d6d6d6";
                                            }
                                            if (player.reloads[player.weapons[1]] != 0 && player.weapons[1]) {
                                                be.fillStyle = darkOutlineColor;
                                                be.fillStyle = darkOutlineColor;
                                                be.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                                                             (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                             (config.healthBarPad * 2), 17, 8);
                                                be.fill();
                                                be.fillStyle = `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.secondaryIndex] / 100)}, 50%, 60%)`;
                                                be.roundRect(tmpObj.x - xOffset,
                                                             (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                             (config.healthBarWidth * tmpObj.currentReloads.secondary), 17 - config.healthBarPad * 2, 7);
                                                be.fill();
                                            }
                                            if (player.reloads[player.weapons[0]] != 0) {
                                                be.fillStyle = darkOutlineColor;
                                                be.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                             (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                             (config.healthBarPad * 2), 17, 8);
                                                be.fill();
                                                be.fillStyle = `hsl(${50 * Math.ceil(tmpObj.reloads[tmpObj.primaryIndex] / 100)}, 50%, 60%)`;
                                                be.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                             (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                             (config.healthBarWidth * tmpObj.currentReloads.primary), 17 - config.healthBarPad * 2, 7);
                                                be.fill();
                                                be.restore();
                                            }
                                            let _ = tmpObj;
                                            let f = xOffset;
                                            let d = yOffset;
                                            // TURRET RELOAD BAR:
                                            var tmpWidth = config.healthBarWidth;
                                            be.fillStyle = darkOutlineColor;
                                            be.roundRect(_.x - f - config.healthBarWidth - config.healthBarPad, _.y - d + _.scale + tmpObj.nameY + 13, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                                            be.fill();
                                            be.fillStyle = "#89e8e5";
                                            be.roundRect(_.x - f - config.healthBarWidth, _.y - d + _.scale + config.nameY + 13 + config.healthBarPad, config.healthBarWidth * 2 * (_.reloads[53] == undefined ? 1 : (2500 - _.reloads[53]) / 2500), 17 - config.healthBarPad * 2, 7);
                                            be.fill();
                                        }

                                    }
                                }
                            }
                        }
                    }

                    // RENDER GAME OBJECTS:
                    function renderGameObjects(layer, xOffset, yOffset) {
                        let tmpSprite;
                        let tmpX;
                        let tmpY;
                        gameObjects.forEach((tmp) => {
                            tmpObj = tmp;
                            if (tmpObj.alive) {
                                tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                                tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                                if (layer == 0) {
                                    tmpObj.update(delta);
                                }
                                mainContext.globalAlpha = tmpObj.alpha;
                                if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                                    if (tmpObj.isItem) {
                                        if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                            tmpSprite = getObjSprite(tmpObj);
                                        } else {
                                            tmpSprite = getItemSprite(tmpObj);
                                        }
                                        mainContext.save();
                                        mainContext.translate(tmpX, tmpY);
                                        /*   if (tmpObj.name == "spinning spikes") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 32600);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }*/
                                        /*  if (tmpObj.name == "windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 32600);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                    if (tmpObj.name == "faster windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 32600);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                    if (tmpObj.name == "power mill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 32600);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }*/

                                        mainContext.rotate(tmpObj.dir);
                                        if (!tmpObj.active) {
                                            mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                        }
                                        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                                        if (tmpObj.blocker) {
                                            mainContext.strokeStyle = "#db6e6e";
                                            mainContext.globalAlpha = 0.3;
                                            mainContext.lineWidth = 6;
                                            renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                        }
                                        mainContext.restore();
                                    } else {
                                        tmpSprite = getResSprite(tmpObj);
                                        mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                                    }
                                }
                                if (layer == 3) {
                                    if (tmpObj.health < tmpObj.maxHealth) {
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpX - config.healthBarWidth / 2 - config.healthBarPad, tmpY - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                        mainContext.fill();

                                        // HEALTH BAR:
                                        mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpX - config.healthBarWidth / 2, tmpY, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }
                                }
                            }
                        });


                        mainContext.restore();
                        // PLACE VISIBLE:
                        if (layer == 0) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
          function markObject(tmpObj, tmpX, tmpY) {
              getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
          }

                    function yen(context, x, y) {
                        context.fillStyle = "rgba(0, 255, 255, 0.6)";
                        context.beginPath();
                        context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                        context.fill();
                        context.closePath();
                        context.globalAlpha = 1;
                    }

                    function drawArrow(xOffset, yOffset, x, y, arrowWidth, color, angle, lineWidth) {
                        mainContext.save()
                        mainContext.translate(x - xOffset, y - yOffset)
                        mainContext.rotate(Math.PI / 4)
                        mainContext.rotate(angle)
                        mainContext.globalAlpha = 1
                        mainContext.strokeStyle = color
                        mainContext.lineCap = "round"
                        mainContext.lineWidth = lineWidth
                        mainContext.beginPath()
                        mainContext.moveTo(-arrowWidth, -arrowWidth)
                        mainContext.lineTo(arrowWidth, -arrowWidth)
                        mainContext.lineTo(arrowWidth, arrowWidth)
                        mainContext.stroke()
                        mainContext.closePath()
                        mainContext.restore()
                    }
                    if (player) {
                        // AUTOPUSH LINE:
                        if (my.autoPush) {
                            mainContext.lineWidth = 5;
                            mainContext.globalAlpha = 1;
                            mainContext.beginPath();


                            mainContext.strokeStyle = "pink";
                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                            mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                            mainContext.stroke();
                        }
                    }
                                        mainContext.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);
                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible) {
                            let tmpText = ""
                            if (tmpObj.chatCountdown > 0) {
                                tmpObj.chatCountdown -= delta;
                                if (tmpObj.chatCountdown <= 0)
                                    tmpObj.chatCountdown = 0;
                                mainContext.font = "32px Hammersmith One";
                                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = tmpObj.x - xOffset;
                                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                            }
                            if (tmpObj.chat.count > 0) {
                                if (!useWasd) {
                                    tmpObj.chat.count -= delta;
                                    if (tmpObj.chat.count <= 0)
                                        tmpObj.chat.count = 0;
                                    mainContext.font = "32px Hammersmith One";
                                    let tmpSize = mainContext.measureText(tmpObj.chat.message);
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    let tmpX = tmpObj.x - xOffset;
                                    let tmpY = tmpObj.y - tmpObj.scale - yOffset + (90 * 2);
                                    let tmpH = 47;
                                    let tmpW = tmpSize.width + 17;
                                    mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                    mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                    mainContext.fill();
                                    mainContext.fillStyle = "#ffffff99";
                                    mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
                                } else {
                                    tmpObj.chat.count = 0;
                                }
                            }
                        }
                    }
                    if (allChats.length) {
                        allChats.filter(ch => ch.active).forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                mainContext.font = "20px Hammersmith One";
                                let tmpSize = mainContext.measureText(ch.chat);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = ch.owner.x - xOffset;
                                let tmpY = ch.owner.y - ch.owner.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.globalAlpha = ch.alpha;
                                mainContext.fillStyle = ch.owner.isTeam(player) ? "rgba(255,215,0,1)" : "#cc5151";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.lineWidth = 5;
                                mainContext.fillStyle = "rgba(0,0,0,0.4)";
                                mainContext.strokeStyle = "rgba(0,0,0,0.0)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.stroke();
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.strokeStyle = "#000";
                                mainContext.strokeText(ch.chat, tmpX, tmpY);
                                mainContext.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }
                                   mainContext.globalAlpha = 1;
                                   // RENDER MINIMAP:
                                   renderMinimap(delta);
                                  }
            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            window.rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
            function doUpdate(){now=performance.now(),delta=now-lastUpdate,lastUpdate=now;let timer=performance.now(),diff=timer-fpsTimer.last;if(diff>=1000){fpsTimer.ltime=fpsTimer.time*(1000/diff),fpsTimer.last=timer,fpsTimer.time=0}fpsTimer.time++; fpsTimer.time++,getEl("pingFps").innerHTML=`${window.pingTime}ms`,getEl("packetStatus").innerHTML=secPacket,getEl("dmgpot").innerHTML=DmgPotWorkfrfrfr(),getEl("insta").innerHTML=rKeyPressed,updateGame(),window.rAF(doUpdate)}prepareMenuBackground(),doUpdate();
            function toggleUseless(boolean) {
                getEl("instaType").disabled = boolean;
                getEl("antiBullType").disabled = boolean;
                getEl("predictType").disabled = boolean;
                getEl("visualType").disabled = boolean;
            }
            toggleUseless(useWasd);
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                // resetChat()
            };
            window.toggleNight = function() {
                clearTimeout(changeDays);
                if (nightMode.style.animationName == "night1") {
                    nightMode.style.animationName = "night2";
                    nightMode.style.opacity = 0;
                    changeDays = setTimeout(() => {
                        nightMode.style.display = "none";
                    }, 1000 * parseFloat(nightMode.style.animationDuration));
                } else {
                    nightMode.style.animationName = "night1";
                    nightMode.style.opacity = 0.25;
                    nightMode.style.display = "block";
                }
                isNight = !isNight;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.wasdMode = function() {
                useWasd = !useWasd;
                toggleUseless(useWasd);
            };
            window.startGrind = function() {
                if (getEl("weaponGrind").checked) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(22), i);
                    }
                }
            };
            let followInterval
            window.startFollow = function () {
                packet("a", undefined, 1);

                if (getEl("togglePlayerFollower").checked) {
                    let targetPlayerSID = parseInt(document.getElementById("playerSid").value);
                    let targetPlayer = findPlayerBySID(targetPlayerSID);

                    if (targetPlayer.dist2 >= 150) {
                        followInterval = setInterval(() => {
                            packet("a", targetPlayer.aim2, 1);
                        }, 200);
                    } else {
                        packet("a", undefined, 1)
                    }
                } else {
                    clearInterval(followInterval);
                }
            };
            // REMOVED!!! so they cant abuse :)
            let projects = [
                "adorable-eight-guppy",
                "galvanized-bittersweet-windshield"
            ];
            let botIDS = 0;
            window.connectFillBots = function() {
                botSkts = [];
                botIDS = 0;
                for (let i = 0; i < project.length; i++) {
                    let test = new WebSocket(`wss://${projects[i]}.glitch.me`);
                    test.binaryType = "arraybuffer";

                    test.onopen = function() {
                        test.ssend = function(type) {
                            let data = Array.prototype.slice.call(arguments, 1);
                            let binary = window.msgpack.encode([type, data]);
                            test.send(binary);
                        };
                        for (let i = 0; i < 4; i++) {
                            window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                                action: "homepage"
                            }).then(function(token) {
                                let t = WS.url.split("wss://")[1].split("?")[0];
                                test.ssend("bots", "wss://" + t + "?token=re:" + encodeURIComponent(token), botIDS);
                                botSkts.push([test]);
                                botIDS++;
                            });
                        }
                    };
                    test.onmessage = function(message) {
                        let data = new Uint8Array(message.data);
                        let parsed = window.msgpack.decode(data);
                        let type = parsed[0];
                        data = parsed[1];
                    };
                }
            };
            window.destroyFillBots = function() {
                botSkts.forEach((socket) => {
                    socket[0].close();
                });
                botSkts = [];
            };
            let host = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
            window.tryConnectBots = function() {
                for (let i = 0; i < (bots.length < 3 ? 25 : 40); i++) {
                    if (isProd && project && host) {
                        window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                            action: "homepage"
                        }).then(function(token) {
                            // CONNECT SOCKET:
                            botSpawn(token, host);
                        });
                    }
                };
            }





            window.destroyBots = function() {
                bots.forEach((botyyyyy) => {
                    botyyyyy.closeSocket = true;
                });
                bots = [];
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.toggleBotsCircle = function() {
                player.circle = !player.circle;
            };
            window.toggleVisual = function() {
                config.anotherVisual = !config.anotherVisual;
                gameObjects.forEach((tmp) => {
                    if (tmp.active) {
                        tmp.dir = tmp.lastDir;
                    }
                });
            };
            window.prepareUI = function(tmpObj) {
                resize();
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
                        let tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI / 4) + Math.PI);
                            let tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    let noname = "!Builder";
                    // VALIDATE NAME:
                    let name = data + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();
                    let langFilter = {
                        "list": [
                            /*                            "ahole",
              "anus",
              "ash0le",
              "ash0les",
              "asholes",
              "ass",
              "Ass Monkey",
              "Assface",
              "assh0le",
              "assh0lez",
              "asshole",
              "assholes",
              "assholz",
              "asswipe",
              "azzhole",
              "bassterds",
              "bastard",
              "bastards",
              "bastardz",
              "basterds",
              "basterdz",
              "Biatch",
              "bitch",
              "bitches",
              "Blow Job",
              "boffing",
              "butthole",
              "buttwipe",
              "c0ck",
              "c0cks",
              "c0k",
              "Carpet Muncher",
              "cawk",
              "cawks",
              "Clit",
              "cnts",
              "cntz",
              "cock",
              "cockhead",
              "cock-head",
              "cocks",
              "CockSucker",
              "cock-sucker",
              "crap",
              "cum",
              "cunt",
              "cunts",
              "cuntz",
              "dick",
              "dild0",
              "dild0s",
              "dildo",
              "dildos",
              "dilld0",
              "dilld0s",
              "dominatricks",
              "dominatrics",
              "dominatrix",
              "dyke",
              "enema",
              "f u c k",
              "f u c k e r",
              "fag",
              "fag1t",
              "faget",
              "fagg1t",
              "faggit",
              "faggot",
              "fagg0t",
              "fagit",
              "fags",
              "fagz",
              "faig",
              "faigs",
              "fart",
              "flipping the bird",
              "fuck",
              "fucker",
              "fuckin",
              "fucking",
              "fucks",
              "Fudge Packer",
              "fuk",
              "Fukah",
              "Fuken",
              "fuker",
              "Fukin",
              "Fukk",
              "Fukkah",
              "Fukken",
              "Fukker",
              "Fukkin",
              "g00k",
              "God-damned",
              "h00r",
              "h0ar",
              "h0re",
              "hells",
              "hoar",
              "hoor",
              "hoore",
              "jackoff",
              "jap",
              "japs",
              "jerk-off",
              "jisim",
              "jiss",
              "jizm",
              "jizz",
              "knob",
              "knobs",
              "knobz",
              "kunt",
              "kunts",
              "kuntz",
              "Lezzian",
              "Lipshits",
              "Lipshitz",
              "masochist",
              "masokist",
              "massterbait",
              "masstrbait",
              "masstrbate",
              "masterbaiter",
              "masterbate",
              "masterbates",
              "Motha Fucker",
              "Motha Fuker",
              "Motha Fukkah",
              "Motha Fukker",
              "Mother Fucker",
              "Mother Fukah",
              "Mother Fuker",
              "Mother Fukkah",
              "Mother Fukker",
              "mother-fucker",
              "Mutha Fucker",
              "Mutha Fukah",
              "Mutha Fuker",
              "Mutha Fukkah",
              "Mutha Fukker",
              "n1gr",
              "nastt",
              "nigger;",
              "nigur;",
              "niiger;",
              "niigr;",
              "orafis",
              "orgasim;",
              "orgasm",
              "orgasum",
              "oriface",
              "orifice",
              "orifiss",
              "packi",
              "packie",
              "packy",
              "paki",
              "pakie",
              "paky",
              "pecker",
              "peeenus",
              "peeenusss",
              "peenus",
              "peinus",
              "pen1s",
              "penas",
              "penis",
              "penis-breath",
              "penus",
              "penuus",
              "Phuc",
              "Phuck",
              "Phuk",
              "Phuker",
              "Phukker",
              "polac",
              "polack",
              "polak",
              "Poonani",
              "pr1c",
              "pr1ck",
              "pr1k",
              "pusse",
              "pussee",
              "pussy",
              "puuke",
              "puuker",
              "queer",
              "queers",
              "queerz",
              "qweers",
              "qweerz",
              "qweir",
              "recktum",
              "rectum",
              "retard",
              "sadist",
              "scank",
              "schlong",
              "screwing",
              "semen",
              "sex",
              "sexy",
              "Sh!t",
              "sh1t",
              "sh1ter",
              "sh1ts",
              "sh1tter",
              "sh1tz",
              "shit",
              "shits",
              "shitter",
              "Shitty",
              "Shity",
              "shitz",
              "Shyt",
              "Shyte",
              "Shytty",
              "Shyty",
              "skanck",
              "skank",
              "skankee",
              "skankey",
              "skanks",
              "Skanky",
              "slag",
              "slut",
              "sluts",
              "Slutty",
              "slutz",
              "son-of-a-bitch",
              "tit",
              "turd",
              "va1jina",
              "vag1na",
              "vagiina",
              "vagina",
              "vaj1na",
              "vajina",
              "vullva",
              "vulva",
              "w0p",
              "wh00r",
              "wh0re",
              "whore",
              "xrated",
              "xxx",
              "b!+ch",
              "bitch",
              "blowjob",
              "clit",
              "arschloch",
              "fuck",
              "shit",
              "ass",
              "asshole",
              "b!tch",
              "b17ch",
              "b1tch",
              "bastard",
              "bi+ch",
              "boiolas",
              "buceta",
              "c0ck",
              "cawk",
              "chink",
              "cipa",
              "clits",
              "cock",
              "cum",
              "cunt",
              "dildo",
              "dirsa",
              "ejakulate",
              "fatass",
              "fcuk",
              "fuk",
              "fux0r",
              "hoer",
              "hore",
              "jism",
              "kawk",
              "l3itch",
              "l3i+ch",
              "lesbian",
              "masturbate",
              "masterbat*",
              "masterbat3",
              "motherfucker",
              "s.o.b.",
              "mofo",
              "nazi",
              "nigga",
              "nigger",
              "nutsack",
              "phuck",
              "pimpis",
              "pusse",
              "pussy",
              "scrotum",
              "sh!t",
              "shemale",
              "shi+",
              "sh!+",
              "slut",
              "smut",
              "teets",
              "tits",
              "boobs",
              "b00bs",
              "teez",
              "testical",
              "testicle",
              "titt",
              "w00se",
              "jackoff",
              "wank",
              "whoar",
              "whore",
              "*damn",
              "*dyke",
              "*fuck*",
              "*shit*",
              "@$$",
              "amcik",
              "andskota",
              "arse*",
              "assrammer",
              "ayir",
              "bi7ch",
              "bitch*",
              "bollock*",
              "breasts",
              "butt-pirate",
              "cabron",
              "cazzo",
              "chraa",
              "chuj",
              "Cock*",
              "cunt*",
              "d4mn",
              "daygo",
              "dego",
              "dick*",
              "dike*",
              "dupa",
              "dziwka",
              "ejackulate",
              "Ekrem*",
              "Ekto",
              "enculer",
              "faen",
              "fag*",
              "fanculo",
              "fanny",
              "feces",
              "feg",
              "Felcher",
              "ficken",
              "fitt*",
              "Flikker",
              "foreskin",
              "Fotze",
              "Fu(*",
              "fuk*",
              "futkretzn",
              "gook",
              "guiena",
              "h0r",
              "h4x0r",
              "hell",
              "helvete",
              "hoer*",
              "honkey",
              "Huevon",
              "hui",
              "injun",
              "jizz",
              "kanker*",
              "kike",
              "klootzak",
              "kraut",
              "knulle",
              "kuk",
              "kuksuger",
              "Kurac",
              "kurwa",
              "kusi*",
              "kyrpa*",
              "lesbo",
              "mamhoon",
              "masturbat*",
              "merd*",
              "mibun",
              "monkleigh",
              "mouliewop",
              "muie",
              "mulkku",
              "muschi",
              "nazis",
              "nepesaurio",
              "nigger*",
              "orospu",
              "paska*",
              "perse",
              "picka",
              "pierdol*",
              "pillu*",
              "pimmel",
              "piss*",
              "pizda",
              "poontsee",
              "poop",
              "porn",
              "p0rn",
              "pr0n",
              "preteen",
              "pula",
              "pule",
              "puta",
              "puto",
              "qahbeh",
              "queef*",
              "rautenberg",
              "schaffer",
              "scheiss*",
              "schlampe",
              "schmuck",
              "screw",
              "sh!t*",
              "sharmuta",
              "sharmute",
              "shipal",
              "shiz",
              "skribz",
              "skurwysyn",
              "sphencter",
              "spic",
              "spierdalaj",
              "splooge",
              "suka",
              "b00b*",
              "testicle*",
              "titt*",
              "twat",
              "vittu",
              "wank*",
              "wetback*",
              "wichser",
              "wop*",
              "yed",
              "zabourah",
              "4r5e",
              "5h1t",
              "5hit",
              "a55",
              "anal",
              "anus",
              "ar5e",
              "arrse",
              "arse",
              "ass",
              "ass-fucker",
              "asses",
              "assfucker",
              "assfukka",
              "asshole",
              "assholes",
              "asswhole",
              "a_s_s",
              "b!tch",
              "b00bs",
              "b17ch",
              "b1tch",
              "ballbag",
              "balls",
              "ballsack",
              "bastard",
              "beastial",
              "beastiality",
              "bellend",
              "bestial",
              "bestiality",
              "bi+ch",
              "biatch",
              "bitch",
              "bitcher",
              "bitchers",
              "bitches",
              "bitchin",
              "bitching",
              "bloody",
              "blow job",
              "blowjob",
              "blowjobs",
              "boiolas",
              "bollock",
              "bollok",
              "boner",
              "boob",
              "boobs",
              "booobs",
              "boooobs",
              "booooobs",
              "booooooobs",
              "breasts",
              "buceta",
              "bugger",
              "bum",
              "bunny fucker",
              "butt",
              "butthole",
              "buttmuch",
              "buttplug",
              "c0ck",
              "c0cksucker",
              "carpet muncher",
              "cawk",
              "chink",
              "cipa",
              "cl1t",
              "clit",
              "clitoris",
              "clits",
              "cnut",
              "cock",
              "cock-sucker",
              "cockface",
              "cockhead",
              "cockmunch",
              "cockmuncher",
              "cocks",
              "cocksuck",
              "cocksucked",
              "cocksucker",
              "cocksucking",
              "cocksucks",
              "cocksuka",
              "cocksukka",
              "cok",
              "cokmuncher",
              "coksucka",
              "coon",
              "cox",
              "crap",
              "cum",
              "cummer",
              "cumming",
              "cums",
              "cumshot",
              "cunilingus",
              "cunillingus",
              "cunnilingus",
              "cunt",
              "cuntlick",
              "cuntlicker",
              "cuntlicking",
              "cunts",
              "cyalis",
              "cyberfuc",
              "cyberfuck",
              "cyberfucked",
              "cyberfucker",
              "cyberfuckers",
              "cyberfucking",
              "d1ck",
              "damn",
              "dick",
              "dickhead",
              "dildo",
              "dildos",
              "dink",
              "dinks",
              "dirsa",
              "dlck",
              "dog-fucker",
              "doggin",
              "dogging",
              "donkeyribber",
              "doosh",
              "duche",
              "dyke",
              "ejaculate",
              "ejaculated",
              "ejaculates",
              "ejaculating",
              "ejaculatings",
              "ejaculation",
              "ejakulate",
              "f u c k",
              "f u c k e r",
              "f4nny",
              "fag",
              "fagging",
              "faggitt",
              "faggot",
              "faggs",
              "fagot",
              "fagots",
              "fags",
              "fanny",
              "fannyflaps",
              "fannyfucker",
              "fanyy",
              "fatass",
              "fcuk",
              "fcuker",
              "fcuking",
              "feck",
              "fecker",
              "felching",
              "fellate",
              "fellatio",
              "fingerfuck",
              "fingerfucked",
              "fingerfucker",
              "fingerfuckers",
              "fingerfucking",
              "fingerfucks",
              "fistfuck",
              "fistfucked",
              "fistfucker",
              "fistfuckers",
              "fistfucking",
              "fistfuckings",
              "fistfucks",
              "flange",
              "fook",
              "fooker",
              "fuck",
              "fucka",
              "fucked",
              "fucker",
              "fuckers",
              "fuckhead",
              "fuckheads",
              "fuckin",
              "fucking",
              "fuckings",
              "fuckingshitmotherfucker",
              "fuckme",
              "fucks",
              "fuckwhit",
              "fuckwit",
              "fudge packer",
              "fudgepacker",
              "fuk",
              "fuker",
              "fukker",
              "fukkin",
              "fuks",
              "fukwhit",
              "fukwit",
              "fux",
              "fux0r",
              "f_u_c_k",
              "gangbang",
              "gangbanged",
              "gangbangs",
              "gaylord",
              "gaysex",
              "goatse",
              "God",
              "god-dam",
              "god-damned",
              "goddamn",
              "goddamned",
              "hardcoresex",
              "hell",
              "heshe",
              "hoar",
              "hoare",
              "hoer",
              "homo",
              "hore",
              "horniest",
              "horny",
              "hotsex",
              "jack-off",
              "jackoff",
              "jap",
              "jerk-off",
              "jism",
              "jiz",
              "jizm",
              "jizz",
              "kawk",
              "knob",
              "knobead",
              "knobed",
              "knobend",
              "knobhead",
              "knobjocky",
              "knobjokey",
              "kock",
              "kondum",
              "kondums",
              "kum",
              "kummer",
              "kumming",
              "kums",
              "kunilingus",
              "l3i+ch",
              "l3itch",
              "labia",
              "lust",
              "lusting",
              "m0f0",
              "m0fo",
              "m45terbate",
              "ma5terb8",
              "ma5terbate",
              "masochist",
              "master-bate",
              "masterb8",
              "masterbat*",
              "masterbat3",
              "masterbate",
              "masterbation",
              "masterbations",
              "masturbate",
              "mo-fo",
              "mof0",
              "mofo",
              "mothafuck",
              "mothafucka",
              "mothafuckas",
              "mothafuckaz",
              "mothafucked",
              "mothafucker",
              "mothafuckers",
              "mothafuckin",
              "mothafucking",
              "mothafuckings",
              "mothafucks",
              "mother fucker",
              "motherfuck",
              "motherfucked",
              "motherfucker",
              "motherfuckers",
              "motherfuckin",
              "motherfucking",
              "motherfuckings",
              "motherfuckka",
              "motherfucks",
              "muff",
              "mutha",
              "muthafecker",
              "muthafuckker",
              "muther",
              "mutherfucker",
              "n1gga",
              "n1gger",
              "nazi",
              "nigg3r",
              "nigg4h",
              "nigga",
              "niggah",
              "niggas",
              "niggaz",
              "nigger",
              "niggers",
              "nob",
              "nob jokey",
              "nobhead",
              "nobjocky",
              "nobjokey",
              "numbnuts",
              "nutsack",
              "orgasim",
              "orgasims",
              "orgasm",
              "orgasms",
              "p0rn",
              "pawn",
              "pecker",
              "penis",
              "penisfucker",
              "phonesex",
              "phuck",
              "phuk",
              "phuked",
              "phuking",
              "phukked",
              "phukking",
              "phuks",
              "phuq",
              "pigfucker",
              "pimpis",
              "piss",
              "pissed",
              "pisser",
              "pissers",
              "pisses",
              "pissflaps",
              "pissin",
              "pissing",
              "pissoff",
              "poop",
              "porn",
              "porno",
              "pornography",
              "pornos",
              "prick",
              "pricks",
              "pron",
              "pube",
              "pusse",
              "pussi",
              "pussies",
              "pussy",
              "pussys",
              "rectum",
              "retard",
              "rimjaw",
              "rimming",
              "s hit",
              "s.o.b.",
              "sadist",
              "schlong",
              "screwing",
              "scroat",
              "scrote",
              "scrotum",
              "semen",
              "sex",
              "sh!+",
              "sh!t",
              "sh1t",
              "shag",
              "shagger",
              "shaggin",
              "shagging",
              "shemale",
              "shi+",
              "shit",
              "shitdick",
              "shite",
              "shited",
              "shitey",
              "shitfuck",
              "shitfull",
              "shithead",
              "shiting",
              "shitings",
              "shits",
              "shitted",
              "shitter",
              "shitters",
              "shitting",
              "shittings",
              "shitty",
              "skank",
              "slut",
              "sluts",
              "smegma",
              "smut",
              "snatch",
              "son-of-a-bitch",
              "spac",
              "spunk",
              "s_h_i_t",
              "t1tt1e5",
              "t1tties",
              "teets",
              "teez",
              "testical",
              "testicle",
              "tit",
              "titfuck",
              "tits",
              "titt",
              "tittie5",
              "tittiefucker",
              "titties",
              "tittyfuck",
              "tittywank",
              "titwank",
              "tosser",
              "turd",
              "tw4t",
              "twat",
              "twathead",
              "twatty",
              "twunt",
              "twunter",
              "v14gra",
              "v1gra",
              "vagina",
              "viagra",
              "vulva",
              "w00se",
              "wang",
              "wank",
              "wanker",
              "wanky",
              "whoar",
              "whore",
              "willies",
              "willy",
              "xrated",
              "xxx",
              "jew",
              "black",
              "baby",
              "child",
              "white",
              "porn",
              "pedo",
              "trump",
              "clinton",
              "hitler",
              "nazi",
              "gay",
              "pride",
              "sex",
              "pleasure",
              "touch",
              "poo",
              "kids",
              "rape",
              "white power",
              "nigga",
              "nig nog",
              "doggy",
              "rapist",
              "boner",
              "nigger",
              "nigg",
              "finger",
              "nogger",
              "nagger",
              "nig",
              "fag",
              "gai",
              "pole",
              "stripper",
              "penis",
              "vagina",
              "pussy",
              "nazi",
              "hitler",
              "stalin",
              "burn",
              "chamber",
              "cock",
              "peen",
              "dick",
              "spick",
              "nieger",
              "die",
              "satan",
              "n|ig",
              "nlg",
              "cunt",
              "c0ck",
              "fag",
              "lick",
              "condom",
              "anal",
              "shit",
              "phile",
              "little",
              "kids",
              "free KR",
              "tiny",
              "sidney",
              "ass",
              "kill",
              ".io",
              "(dot)",
              "[dot]",
              "mini",
              "whiore",
              "whore",
              "faggot",
              "github",
              "1337",
              "666",
              "satan",
              "senpa",
              "discord",
              "d1scord",
              "mistik",
              ".io",
              "senpa.io",
              "sidney",
              "sid",
              "senpaio",
              "vries",
              "asa"*/
                        ],
                        "exclude": [],
                        "placeHolder": "*",
                        "regex": {},
                        "replaceRegex": {}
                    };
                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    for (let word of langFilter.list) {
                        if (convertedName.indexOf(word) != -1) {
                            isProfane = true;
                            break;
                        }
                    }
                    if (name.length > 0 && !isProfane) {
                        noname = name;
                    }
                    return noname;
                }
            };
            window.toggleNight();
        },
        webgl_test: () => {
            return;
            let canvas = document.createElement("canvas");
            canvas.id = "WEBGL";
            canvas.width = canvas.height = 300;
            canvas.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            `;
            let fat = document.createElement("div");
            fat.id = "faku";
            fat.width = fat.height = 300;
            fat.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            font-size: 20px;
            `;
            fat.innerHTML = "Webgl Test Rendering";
            let gl = canvas.getContext("webgl");
            if (!gl) {
                alert("urbad");
                return;
            }
            document.body.append(canvas);
            document.body.append(fat);
            log(gl);
            gl.clearColor(0, 0, 0, 0.2);
            gl.clear(gl.COLOR_BUFFER_BIT);
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            function render(vs, fs, vertice, type) {
                let vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vs);
                gl.compileShader(vShader);
                gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
                let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fs);
                gl.compileShader(fShader);
                gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
                let program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.getProgramParameter(program, gl.LINK_STATUS);
                gl.useProgram(program);
                let vertex = gl.getAttribLocation(program, "vertex");
                gl.enableVertexAttribArray(vertex);
                gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
                let vertices = vertice.length / 2;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                gl.drawArrays(type, 0, vertices);
            }
            function hexToRgb(hex) {
                return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
            }
            function getRgb(r, g, b) {
                return [r / 255, g / 255, b / 255].join(", ");
            }
            let max = 50;
            for (let i = 0; i < max; i++) {
                let radian = (Math.PI * (i / (max / 2)));
                render(`
                precision mediump float;
                attribute vec2 vertex;
                void main(void) {
                    gl_Position = vec4(vertex, 0, 1);
                }
                `, `
                precision mediump float;
                void main(void) {
                    gl_FragColor = vec4(${getRgb(...hexToRgb("#cc5151"))}, 1);
                }
                `, [
                    // moveto, lineto
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        }
    };
    if (codes) {
        for (let code in codes) {
            let func = codes[code];
            typeof func === "function" && func();
        }
        window.enableHack = function() {
            if (!useHack) {
                useHack = true;
                codes.main();
            }
        };
    }
}(1);
function handleImageError(event) {
    const img = event.target;

    // Generalized detection of suspicious patterns in onerror content
    const suspiciousPatterns = [
        'for(;;)',  // Infinite loop
        'while(true)',  // Another form of infinite loop
        'eval(',  // Use of eval can be dangerous
        'script>',  // Injection of script tags
    ];

    // Check if any suspicious patterns are present in the onerror content
    const onerrorContent = img.onerror ? img.onerror.toString() : '';
    const isSuspicious = suspiciousPatterns.some(pattern => onerrorContent.includes(pattern));

    if (isSuspicious) {
        console.warn('Suspicious image detected and removed:', img);

        // Safely remove the image element from the DOM
        if (img.parentNode) {
            img.parentNode.removeChild(img);
        } else {
            console.warn('Image has no parent and could not be removed:', img);
        }
    }
}

// Set the onerror handler for all existing img elements on the page
function monitorExistingImages() {
    document.querySelectorAll('img').forEach(img => {
        img.onerror = handleImageError;
    });
}

// Create a MutationObserver to monitor new img elements
function monitorNewImages() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Check if the new node or any of its descendants is an img element
                if (node.nodeName.toLowerCase() === 'img') {
                    node.onerror = handleImageError;
                } else if (node.querySelectorAll) {
                    // If a container node is added, check its descendants
                    node.querySelectorAll('img').forEach(img => {
                        img.onerror = handleImageError;
                    });
                }
            });
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true, // Watch for direct child node changes
        subtree: true    // Watch for changes in all descendants
    });
}

// Initialize monitoring of existing and new images
monitorExistingImages();
monitorNewImages();