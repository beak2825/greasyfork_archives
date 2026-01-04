// ==UserScript==
// @name         Skribbl.io image saver
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Saves Skribbl.io images after each turn
// @author       ipwnmice + AllStorm
// @match        https://skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412531/Skribblio%20image%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/412531/Skribblio%20image%20saver.meta.js
// ==/UserScript==

var btnGetImage;
var btnClearImages;
var StoredImages = [];
var imageName = "";

function setupImageButton() {
  btnClearImages = document.createElement('a');
  var buttonText = document.createTextNode("Clear all images");
  btnClearImages.appendChild(buttonText);
  btnClearImages.style.fontSize = "12px";
  btnClearImages.style.cursor = "pointer";
  btnClearImages.style.display = "block";
  btnClearImages.style.padding = "10px";
  btnClearImages.style.borderRadius = "2px";
  btnClearImages.style.fontWeight = "bold";
  btnClearImages.style.background = "#ff4c4c";
  btnClearImages.style.color = "white";
  btnClearImages.style.textAlign = "center";
  btnClearImages.style.textDecoration = "none";
  btnClearImages.style.marginTop = "5px";
  document.getElementsByClassName("tooltip-wrapper")[0].appendChild(btnClearImages);

  btnGetImage = document.createElement('a');
  buttonText = document.createTextNode("Save image");
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

  btnGetImage.addEventListener('click', function() {
    getImageFunction(btnGetImage);
  }, false);

  btnClearImages.addEventListener('click', function() {
    var imgDiv = document.getElementById("image-list");
    while (imgDiv.lastElementChild) {
      imgDiv.removeChild(imgDiv.lastElementChild);
    }
  }, false);
};

var text = document.getElementById("overlay").getElementsByClassName("content")[0].getElementsByClassName("text")[0];
text.addEventListener('DOMSubtreeModified', function() {
  if (text.textContent.includes("The word was: ")) {
    imageName = "skribbl-" + text.textContent.substring(text.textContent.indexOf(":") + 2);
    var gameCanvas = document.getElementById("canvasGame");
    console.log("saving image to session storage...");
    console.log(imageName);
    console.log(gameCanvas.toDataURL());
    addImage(imageName, gameCanvas.toDataURL());
  };
}, false);

function getImageFunction(button) {
  var gameCanvas = document.getElementById("canvasGame")
  button.href = gameCanvas.toDataURL();
  console.log(imageName);
  if (imageName) {
    button.download = imageName + '.png';
  } else {
    button.download = 'skribbl-Drawing.png';
  };
};

function setupImageList() {
  var imgDiv = document.getElementById("image-list");
  if (imgDiv) {
    console.log("2");
    imgDiv.remove();
  }

  imgDiv = document.createElement("div");
  imgDiv.id = "image-list";
  imgDiv.classList.add("container-fluid");
  document.body.insertBefore(imgDiv, null);
};

function addImage(name, dataURI) {
  var imgDiv = document.getElementById("image-list");
  var imgLink = document.createElement("a");
  var img = document.createElement("img");
  imgLink.download = name + ".png";
  imgLink.href = dataURI;
  img.src = dataURI;
  img.classList.add("save-image");
  imgLink.insertBefore(img, imgLink.firstChild);
  imgDiv.insertBefore(imgLink, imgDiv.firstChild);
};

function addStyle() {
  let styles = `
.save-image {
  margin: 5px;
  max-width: 200px;
}
`;
  var style=document.createElement('style');
  style.type='text/css';
  if(style.styleSheet){
    style.styleSheet.cssText = styles;
  }else{
    style.appendChild(document.createTextNode(styles));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
};

setupImageList();
addStyle();
setupImageButton();