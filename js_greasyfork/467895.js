// ==UserScript==
// @name         Image Upload Tool for Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds an interactive menu for uploading or dragging-and-dropping images to Drawaria
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467895/Image%20Upload%20Tool%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/467895/Image%20Upload%20Tool%20for%20Drawaria.meta.js
// ==/UserScript==

'use strict';

// Crear el menú desplegable
var menu = createElement("div", "");
menu.style.position = "fixed";
menu.style.top = "100px";
menu.style.right = "10px";
menu.style.background = "rgb(134,58,180)";
menu.style.background = "linear-gradient(90deg, rgba(134,58,180,1) 0%, rgba(253,29,244,1) 50%, rgba(252,69,69,1) 100%)";
menu.style.borderRadius = "25px";
menu.style.padding = "10px";
menu.style.width = "220px";
menu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
menu.style.zIndex = "99999999";
menu.style.display = "none"; // Ocultar el menú inicialmente

// Contenedor de imagen
var imageContainerLabel = createElement("label", "Insert/Upload Picture");
imageContainerLabel.style.display = "block";
imageContainerLabel.style.marginBottom = "5px";
imageContainerLabel.style.color = "#fff";
imageContainerLabel.style.fontWeight = "bold";

var imageContainer = createElement("div", "");
imageContainer.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png?20160706115716')";
imageContainer.style.backgroundSize = "cover";
imageContainer.style.backgroundPosition = "center";
imageContainer.style.width = "150px";
imageContainer.style.height = "150px";
imageContainer.style.borderRadius = "10px";
imageContainer.style.border = "2px dashed #fff";
imageContainer.style.cursor = "pointer";
imageContainer.style.marginBottom = "10px";

imageContainer.addEventListener("click", function() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    input.addEventListener("change", function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                imageContainer.style.backgroundImage = "url('" + e.target.result + "')";
                var canvas = document.getElementById("canvas");
                if (canvas) {
                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function() {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
                }
            };
            reader.readAsDataURL(file);
        }
    });
    input.click();
});

imageContainer.addEventListener("dragover", function(event) {
    event.preventDefault();
    imageContainer.style.border = "2px dashed #00f";
});

imageContainer.addEventListener("dragleave", function(event) {
    imageContainer.style.border = "2px dashed #fff";
});

imageContainer.addEventListener("drop", function(event) {
    event.preventDefault();
    imageContainer.style.border = "2px dashed #fff";
    var file = event.dataTransfer.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            imageContainer.style.backgroundImage = "url('" + e.target.result + "')";
            var canvas = document.getElementById("canvas");
            if (canvas) {
                var img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
            }
        };
        reader.readAsDataURL(file);
    }
});

menu.appendChild(imageContainerLabel);
menu.appendChild(imageContainer);

// Campo de entrada para el prompt de la imagen
var ImagePrompt = createElement("input", "");
ImagePrompt.id = "ImagePrompt";
ImagePrompt.placeholder = "Describe the image";
ImagePrompt.style.width = "calc(100% - 20px)";
ImagePrompt.style.margin = "10px";
ImagePrompt.style.padding = "10px";
ImagePrompt.style.borderRadius = "10px";
ImagePrompt.style.border = "1px solid #ccc";
ImagePrompt.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

menu.appendChild(ImagePrompt);

// Campo de los detalles de la imagen
var IntervalInput = createElement("input", "");
IntervalInput.id = "IntervalInput";
IntervalInput.placeholder = "Prompts";
IntervalInput.style.width = "calc(51% - 20px)";
IntervalInput.style.margin = "9px";
IntervalInput.style.padding = "9px";
IntervalInput.style.borderRadius = "10px";
IntervalInput.style.border = "1px solid #ccc";
IntervalInput.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

menu.appendChild(IntervalInput);

// Selector de estilo
var styleSelectorLabel = createElement("label", "Choose Style");
styleSelectorLabel.style.display = "block";
styleSelectorLabel.style.marginBottom = "5px";
styleSelectorLabel.style.color = "#fff";
styleSelectorLabel.style.fontWeight = "bold";

var styleSelector = createElement("select", "");
styleSelector.style.width = "calc(100% - 20px)";
styleSelector.style.margin = "10px";
styleSelector.style.padding = "10px";
styleSelector.style.borderRadius = "10px";
styleSelector.style.border = "1px solid #ccc";
styleSelector.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
styleSelector.style.backgroundColor = "#fff";
styleSelector.style.color = "#333";

var styles = ["Choose Style", "Anime", "Realistic", "Modern", "Futuristic", "Detailed"];
styles.forEach(function(style) {
    var option = createElement("option", style);
    option.value = style;
    if (style === "Choose Style") {
        option.disabled = true;
        option.selected = true;
    }
    styleSelector.appendChild(option);
});

styleSelector.addEventListener("change", function() {
    var selectedStyle = styleSelector.value;
    console.log("Selected style: ", selectedStyle);
    // Aquí puedes agregar la lógica para manejar el estilo seleccionado
});

menu.appendChild(styleSelectorLabel);
menu.appendChild(styleSelector);

var ImageCreator;
function ImageGeneration(ImageSelected) {
    var imagePrompter = document.getElementsByClassName("form-control");
    for (var i = 0; i < imagePrompter.length; i++) {
        imagePrompter[i].value = ImageSelected;
    }

    var CanvasUploader = document.getElementsByClassName("chatattop-button");
    for (var j = 0; j < CanvasUploader.length; j++) {
        CanvasUploader[j].click();
    }
}

// Botón para comenzar a dibujar
var CreateImage = createElement("button", "Begin Drawing");
CreateImage.addEventListener("click", function() {
    var ImageSelected = document.getElementById("ImagePrompt").value;
    var interval = Number(document.getElementById("IntervalInput").value);

    if (ImageCreator) {
        clearInterval(ImageCreator);
    }

    ImageCreator = setInterval(function() {
        ImageGeneration(ImageSelected);
    }, interval);
});

CreateImage.style.width = "calc(50% - 20px)";
CreateImage.style.margin = "10px";
CreateImage.style.padding = "10px";
CreateImage.style.borderRadius = "10px";
CreateImage.style.border = "none";
CreateImage.style.background = "rgb(255,171,0)";
CreateImage.style.background = "linear-gradient(0deg, rgba(255,171,0,1) 0%, rgba(238,253,45,1) 100%)";
CreateImage.style.color = "#fff";
CreateImage.style.cursor = "pointer";
CreateImage.style.transition = "transform 0.2s";

CreateImage.addEventListener("mousedown", function() {
    CreateImage.style.transform = "scale(0.95)";
});

CreateImage.addEventListener("mouseup", function() {
    CreateImage.style.transform = "scale(1)";
});

menu.appendChild(CreateImage);

function createElement(type, content, onClick) {
    var element = document.createElement(type);
    element.innerHTML = content;
    if (onClick) {
        element.onclick = onClick;
    }
    return element;
}

// Botón para detener
var WaitFinish = createElement("button", "Wait");
WaitFinish.addEventListener("click", function() {
    clearInterval(ImageCreator);
    ImageCreator = null;
});

WaitFinish.style.width = "calc(126% - 70px)";
WaitFinish.style.margin = "10px";
WaitFinish.style.padding = "10px";
WaitFinish.style.borderRadius = "10px";
WaitFinish.style.border = "none";
WaitFinish.style.background = "rgb(255,171,0)";
WaitFinish.style.background = "linear-gradient(0deg, rgba(255,171,0,1) 0%, rgba(238,253,45,1) 100%)";
WaitFinish.style.color = "#fff";
WaitFinish.style.cursor = "pointer";
WaitFinish.style.transition = "transform 0.2s";

WaitFinish.addEventListener("mousedown", function() {
    WaitFinish.style.transform = "scale(0.95)";
});

WaitFinish.addEventListener("mouseup", function() {
    WaitFinish.style.transform = "scale(1)";
});

menu.appendChild(WaitFinish);

// Botón para abrir/cerrar el menú
var menuButton = createElement("button", "Old Image Script NOT WOKRING");
menuButton.style.position = "fixed";
menuButton.style.top = "715px";
menuButton.style.right = "10px";
menuButton.style.background = "rgb(134,58,180)";
menuButton.style.background = "linear-gradient(90deg, rgba(134,58,180,1) 0%, rgba(253,29,244,1) 50%, rgba(252,69,69,1) 100%)";
menuButton.style.borderRadius = "25px";
menuButton.style.padding = "10px 20px";
menuButton.style.border = "none";
menuButton.style.color = "#fff";
menuButton.style.cursor = "pointer";
menuButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
menuButton.style.zIndex = "99999999";

menuButton.addEventListener("click", function() {
    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
});

document.body.appendChild(menuButton);
document.body.appendChild(menu);
