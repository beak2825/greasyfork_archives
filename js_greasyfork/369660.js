// ==UserScript==
// @name         Skribbl.io's first add-on
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a handy color wheel on holding down right-click, the option to mute and remove all messages issued by a specific player, a screenshot button with a toggle hotkey (~), as well as a checkbox to automatically save (download) and rename every drawing of a session.
// @author       AllStorm
// @match        https://skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369660/Skribblio%27s%20first%20add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/369660/Skribblio%27s%20first%20add-on.meta.js
// ==/UserScript==

//AllStorm's attempt at a color wheel palette and a save image button.

var canvas = document.createElement('canvas');

var mousePosition = {
  x: 0,
  y: 0
};

var piePosition = {
  x: 0,
  y: 0
};

var pie = false;
var selectedColor = 0;
var lastColor = 0;
var selectedAngle = 0;
var colorCount = document.getElementsByClassName("colorItem").length;
var colorTable = [0, 1, 12, 11, 21, 13, 10, 14, 2, 3, 15, 4, 5, 16, 18, 17, 7, 6, 19, 8, 20, 9];

canvas.id = "PieMenu";
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.backgroundColor = "transparent";

canvas.style.zIndex = 8;
canvas.style.left = 0;
canvas.style.top = 0;
canvas.style.pointerEvents = "none";

pieAngle = 360 / (colorCount);

PieMenu = document.getElementById("PieMenu");

var ctx = canvas.getContext("2d");
var textBox;
var checkbox = document.createElement('input');
var muteArray = {};


function setupImageButton() {
  let btnGetImage = document.createElement('a');
  let buttonText = document.createTextNode("Save image");
  btnGetImage.appendChild(buttonText);
  btnGetImage.style.fontSize = "12px";
  btnGetImage.style.cursor = "pointer";
  btnGetImage.style.display = "block";
  btnGetImage.style.padding = "10px";
  btnGetImage.style.borderRadius = "2px";
  btnGetImage.style.fontWeight = "bold";
  btnGetImage.style.background = "#5cb85c";
  btnGetImage.style.color = "white";
  btnGetImage.style.textAlign = "center";
  btnGetImage.style.textDecoration = "none";
  btnGetImage.style.marginTop = "5px";
  document.getElementsByClassName("tooltip-wrapper")[0].appendChild(btnGetImage);
  textBox = document.createElement("textarea");
  textBox.style.resize = "none";
  textBox.style.height = "30px";
  textBox.style.width = "159px";
  textBox.style.fontWeight = "bold";
  textBox.style.marginTop = "5px";
  textBox.style.marginRight = "9px";
  textBox.style.padding = "5px";
  textBox.placeholder = "skribbl-Drawing";
  textBox.style.textAlign = "center";
  textBox.style.fontSize = "11px";
  document.getElementsByClassName("tooltip-wrapper")[0].appendChild(textBox);

  document.getElementsByClassName("tooltip-wrapper")[0].appendChild(checkbox);
  checkbox.type = "checkbox";


  btnGetImage.addEventListener('click', function() {
    getImageFunction(btnGetImage);
  }, false);
  return btnGetImage;
};

var text = document.getElementById("overlay").getElementsByClassName("content")[0].getElementsByClassName("text")[0];
text.addEventListener('DOMSubtreeModified', function() {
  if (checkbox.checked && text.textContent.includes("The word was: ")) {
    textBox.value = "skribbl-" + text.textContent.substring(text.textContent.indexOf(":") + 2);
    getImageButton.click();
  };
}, false);


PlayerList = document.getElementById("containerGamePlayers");
Messages = document.getElementById("boxMessages");

PlayerList.addEventListener('DOMSubtreeModified', function() {
  muteArray = {};
  for (let i = 0; i < PlayerList.childNodes.length; i++) {
    if (PlayerList.childNodes[i].getElementsByClassName("mute")[0]) {
      if (PlayerList.childNodes[i].getElementsByClassName("mute")[0].checked) {
        muteArray[i] = PlayerList.childNodes[i].getElementsByClassName("info")[0].getElementsByClassName("name")[0].textContent;
      };
    } else {

      let checkbox = document.createElement('input');
      checkbox.className = "mute";
      checkbox.type = "checkbox";
      checkbox.style.width = "30px";
      checkbox.style.height = "30px";
      checkbox.addEventListener('change', function() {
        let name = this.parentElement.getElementsByClassName("info")[0].getElementsByClassName("name")[0];
        flagMessage = this.parentElement.getElementsByClassName("message")[0]
        if (this.checked) {

          for (i = 0; i < Messages.childNodes.length; i++) {
            message = Messages.childNodes[i]
            if (message.getElementsByTagName("b")[0]) {
              if (message.getElementsByTagName("b")[0].textContent.indexOf(name.textContent) !== -1) {
                message.parentElement.removeChild(message);
              };
            };
          };
          name.style.visibility = "hidden";
          flagMessage.style.visibility = "hidden";
        } else {
          name.style.visibility = "visible";
          flagMessage.style.visibility = "visible";
        };
      });
      PlayerList.childNodes[i].insertBefore(checkbox, PlayerList.childNodes[i].getElementsByClassName("message")[0]);
    };
  };
}, false);

Messages.addEventListener('DOMSubtreeModified', function() {
  let message = Messages.childNodes[Messages.childNodes.length - 1]
  for (name in muteArray) {
    if (message.getElementsByTagName("b")[0]) {
      console.log(message.getElementsByTagName("b")[0].textContent + "  " + name);
      if (message.getElementsByTagName("b")[0].textContent.indexOf(muteArray[name]) !== -1) {
        message.parentElement.removeChild(message);
      };
    };
  };
});

function getImageFunction(button) {
  var gameCanvas = document.getElementById("canvasGame")
  button.href = gameCanvas.toDataURL();
  console.log(textBox.value);
  if (textBox.value) {
    button.download = textBox.value + '.png';

  } else {
    button.download = 'skribbl-Drawing.png';
  };
};

function drawPie() {
  selectedAngle = 360 - Math.atan2(piePosition.x - mousePosition.x, piePosition.y - mousePosition.y) * 180 / Math.PI;
  if (selectedAngle >= 360) {
    selectedAngle -= 360
  };
  selectedAngle += 90;
  if (selectedAngle >= 360) {
    selectedAngle -= 360
  };
  lastColor = selectedColor;
  selectedColor = Math.floor(selectedAngle / pieAngle);
  if (selectedColor != lastColor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 50;
    ctx.shadowColor = "black";
    ctx.beginPath();
    ctx.fillStyle = document.getElementsByClassName("colorItem")[colorTable[selectedColor]].style.backgroundColor;
    ctx.arc(mousePosition.x, mousePosition.y, 180, 0, Math.PI * 2);
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.closePath;
    ctx.fill();
    for (var colorNr = 0; colorNr < colorCount; colorNr++) {
      ctx.shadowBlur = 5;
      ctx.shadowColor = "black";
      ctx.beginPath();
      ctx.moveTo(mousePosition.x, mousePosition.y);
      ctx.fillStyle = document.getElementsByClassName("colorItem")[colorTable[colorNr]].style.backgroundColor;
      ctx.arc(mousePosition.x, mousePosition.y, 160, Math.PI / 180 * colorNr * pieAngle, Math.PI / 180 * colorNr * pieAngle + (Math.PI / 180 * pieAngle));
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.closePath;
      ctx.fill();
      ctx.stroke();
    }
    ctx.shadowBlur = 40;
    ctx.shadowColor = "white";
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, mousePosition.y);
    try {
      ctx.fillStyle = document.getElementsByClassName("colorItem")[colorTable[selectedColor]].style.backgroundColor;
    } catch (err) {
      console.log(selectedColor);
    };
    ctx.arc(mousePosition.x, mousePosition.y, 200, Math.PI / 180 * selectedColor * pieAngle, Math.PI / 180 * selectedColor * pieAngle + (Math.PI / 180 * pieAngle));
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.closePath;
    ctx.fill();
    ctx.stroke();
  }
}

document.addEventListener('mousedown', function(mouseDownEvent) {
  if (mouseDownEvent.button === 2) {
    pie = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPie();
  }
}, false);

document.addEventListener('mouseup', function() {
  if (pie) {
    pie = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementsByClassName("colorItem")[colorTable[selectedColor]].click();
  }
}, false);

document.addEventListener('keydown', function(e) {
  switch (e.keyCode || e.which) {
    case 49:
      document.getElementsByClassName("brushSize")[0].click();
      break;
    case 50:
      document.getElementsByClassName("brushSize")[1].click();
      break;
    case 51:
      document.getElementsByClassName("brushSize")[2].click();
      break;
    case 52:
      document.getElementsByClassName("brushSize")[3].click();
      break;
    case 221:
    case 192:
      getImageButton.click();
      break;
    case 13:
      document.getElementById("inputChat").focus();
      break;
    default:
      break;
  }

  if (e.code === "KeyV" && e.altKey) {
    document.getElementById("votekickCurrentplayer").click();
    document.getElementById("inputChat").focus();
  }
  if (e.code === "KeyG" && e.altKey) {
    document.getElementsByClassName("thumbsUp")[0].click();
    document.getElementById("inputChat").focus();
  }
  if (e.code === "KeyN" && e.altKey) {
    document.getElementsByClassName("thumbsDown")[0].click();
    document.getElementById("inputChat").focus();
  }
}, false);

document.addEventListener('mousemove', function(mouseMoveEvent) {
  var rect = mouseMoveEvent.target.getBoundingClientRect();
  if (!pie) {
    mousePosition.x = mouseMoveEvent.pageX;
    mousePosition.y = mouseMoveEvent.pageY;
  } else {
    piePosition.x = mouseMoveEvent.pageX;
    piePosition.y = mouseMoveEvent.pageY;
    drawPie();
  }
}, false);

document.addEventListener('contextmenu', function(contextMenuEvent) {
  contextMenuEvent.preventDefault();
  return false;
}, false);

getImageButton = setupImageButton();

