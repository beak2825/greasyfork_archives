// ==UserScript==
// @name         Better MooMoo [FINAL UPDATE] [DISCONTINUED]
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  A cool customizer. Key: NEW_BETTERMM
// @author       UNKKK
// @match        *://*.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464512/Better%20MooMoo%20%5BFINAL%20UPDATE%5D%20%5BDISCONTINUED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/464512/Better%20MooMoo%20%5BFINAL%20UPDATE%5D%20%5BDISCONTINUED%5D.meta.js
// ==/UserScript==

if (!GM_getValue('activatedBetterMooMooNewNew') || !GM_getValue('activatedBetterMooMooNewNew', "false")) {

var overlay = document.createElement('div');
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.zIndex = '9999';
document.body.appendChild(overlay);

var message = document.createElement('div');
message.style.color = 'white';
message.style.textAlign = 'center';
message.style.fontSize = '24px';
message.style.marginBottom = '20px';
message.innerHTML = 'Please enter your key. Keys are case sensitive.';
overlay.appendChild(message);

var container = document.createElement('div');
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.style.alignItems = 'center';
container.style.flexDirection = 'column';
overlay.appendChild(container);

var input = document.createElement('input');
input.type = 'text';
input.style.fontSize = '18px';
input.style.padding = '10px';
input.style.width = '500px';
input.style.borderRadius = '50px';
input.style.border = 'none';
input.style.outline = 'none';
input.style.backgroundColor = '#262626';
input.style.color = 'white';
input.style.fontFamily = 'Arial-Bold, sans-serif';
input.style.textAlign = 'center';
container.appendChild(input);

var button = document.createElement('button');
button.style.fontSize = '18px';
button.style.padding = '10px 20px';
button.style.marginTop = '10px';
button.style.borderRadius = '50px';
button.style.border = 'none';
button.style.outline = 'none';
button.style.backgroundColor = '#1c1c1c';
button.style.color = 'white';
button.style.fontFamily = 'Arial-Bold, sans-serif';
button.style.cursor = 'pointer';
button.innerHTML = 'Validate';
container.appendChild(button);

var messageHeight = message.offsetHeight;
var containerHeight = container.offsetHeight;
var totalHeight = messageHeight + containerHeight;
var marginTop = (window.innerHeight - totalHeight) / 2;
message.style.marginTop = marginTop + 'px';
container.style.marginTop = messageHeight + 'px'

button.addEventListener('click', function() {
	var key = input.value;
	if (key === "NEW_BETTERMM") {
	message.innerHTML = "Checking key.."
    setTimeout(function() {
        message.innerHTML = "Correct key!"
    }, 2000)
    setTimeout(function() {
        message.innerHTML = "Welcome to BetterMM v2.0! Reload your page to apply changes! Sadly, this is the final update."
        message.style.color = 'LIME'
    }, 4000)
    GM_setValue('activatedBetterMooMooNewNew', "true")
    setTimeout(function() {
        overlay.remove()
    }, 8000)
    } else if (key == null || key == "") {
        message.innerHTML = "Incorrect Key!"
        message.style.color = 'RED'
        setTimeout(function() {
        message.innerHTML = "Please enter your key. Keys are case sensitive."
        message.style.color = 'white'
        }, 500)
    } else {
        message.innerHTML = "Incorrect Key!"
        message.style.color = 'RED'
        setTimeout(function() {
        message.innerHTML = "Please enter your key. Keys are case sensitive."
        message.style.color = 'white'
        }, 500)
    }
});
} else {
document.getElementById('gameName').innerHTML = 'BetterMM';
document.getElementById('gameName').style.color = "#5A5A5A";
document.getElementById('loadingText').style.color = '#808080'
document.getElementById('loadingText').innerHTML = 'made by UNKKK'
document.getElementById('gameName').style.textShadow = "0 0";
document.getElementById('setupCard').style.backgroundColor = "#808080"
document.getElementById('setupCard').style.boxShadow = "0 0"
document.getElementById('promoImgHolder').remove()
document.getElementById('rightCardHolder').style.display = "inherit"
document.getElementById('guideCard').style.backgroundColor = "#808080"
document.getElementById('guideCard').style.boxShadow = "0 0"
document.getElementById('youtuberOf').remove()
document.getElementById('joinPartyButton').remove()
document.getElementById('partyButton').style.color = ""
document.getElementById('nameInput').style.backgroundColor = "#5A5A5A"
document.getElementById('nameInput').placeholder = "BetterMM Name"
document.getElementById('enterGame').innerHTML = "Deploy"
document.getElementById('enterGame').style.backgroundColor = "#5A5A5A"
document.getElementById('enterGame').style.color = "#808080"
document.getElementById('linksContainer2').style.backgroundColor = "#5A5A5A"
document.getElementById('ot-sdk-btn-floating').remove()
// OUTSIDE \\

// INSIDE THE GAME \\
document.getElementById('ageText').style.color = 'YELLOW'
GM_addStyle(`
  #ageBarBody {
    background-color: red; /* Starting color */
    animation: rainbow-color-change 5s ease-in-out infinite alternate;
  }

  @keyframes rainbow-color-change {
    0% {
      background-color: red; /* Starting color */
    }
    25% {
      background-color: orange; /* Rainbow color */
    }
    50% {
      background-color: yellow; /* Rainbow color */
    }
    75% {
      background-color: lime; /* Rainbow color */
    }
    100% {
      background-color: blue; /* Rainbow color */
    }
  }
`);
document.getElementById('foodDisplay').style.color = '#ff0000'
document.getElementById('woodDisplay').style.color = 'LIMEGREEN'
document.getElementById('stoneDisplay').style.color = 'GRAY'
document.getElementById('scoreDisplay').style.color = 'YELLOW'
document.getElementById('diedText').innerHTML = 'Rest In Peace'
document.getElementById('diedText').style.color = 'GRAY'
document.getElementById('allianceButton').style.color = 'YELLOW'
document.getElementById('chatButton').style.color = 'YELLOW'
document.getElementById('storeButton').style.color = 'YELLOW'
}