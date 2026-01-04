// ==UserScript==
// @name         Subito.it Immagini
// @name:en      Subito.it Images
// @version      0.6
// @description  permette di cliccare sulle immagini di un annuncio per visualizzarle a tutto schermo
// @description:en  allows to click on images to view them full screen
// @author       Apicedda
// @match        https://www.subito.it/*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subito.it
// @license      MIT
// @namespace    https://greasyfork.org/users/929559
// @downloadURL https://update.greasyfork.org/scripts/447083/Subitoit%20Immagini.user.js
// @updateURL https://update.greasyfork.org/scripts/447083/Subitoit%20Immagini.meta.js
// ==/UserScript==


//workaround a subito che ricrea le immagini per qualche motivo
//rileva se vengono sostituite e riapplica il listener per rilevare il click sull'immagine
const targetNode = document.getElementsByClassName("slider-container")[0];
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.addedNodes.length>0) {
            addLightbox(mutation.addedNodes[0].querySelector('figure>img'));
        }
    }
    observer.disconnect();
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, {childList: true});


//funzione per attendere il caricamento delle immagini
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//variabili per il funzionamento
let scale = 1;
let rotation = 0;
let posX = 0;
let posY = 0;
let isDragging = false;
let hasDragged = false;
let startX;
let startY;

//attendo la creazione delle immagini
waitForElm('figure>picture>img').then((elm) => {

    var images = document.querySelectorAll('figure > picture > img');
    console.log(images);
    images.forEach(image => {
        if(image !== null){
            addLightbox(image);
        }
    });

});

//aggiunge la funzione di click alle immagini
function addLightbox(imageElement){

    imageElement.style.cursor = 'zoom-in'


    imageElement.addEventListener("click", (event) => {

        event.preventDefault();

        lightboxImg.style.display = "none";


        lightboxImg.src = event.currentTarget.src.replace(/\?rule.*/g,'?rule=gallery-desktop-4x-auto');

        lightbox.style.display = "block";
        lightbox.style.cursor = "wait";
    });

}

//add or edit transform style to element
function transform(element, X, Y, S, R){
    element.style.transform = `translate(${X}px, ${Y}px) scale(${S}) rotate(${R}deg)`;
}

//div della lightbox
const lightbox = document.createElement("div");
lightbox.style.display = "none";
lightbox.style.position = "fixed";
lightbox.style.zIndex = 1000;
lightbox.style.left = 0;
lightbox.style.top = 0;
lightbox.style.width = "100%";
lightbox.style.height = "100%";
lightbox.style.overflow = "auto";
lightbox.style.backgroundColor = "rgba(0,0,0,0.5)";

//immagine da mostrare nella lightbox
const lightboxImg = document.createElement("img");
lightboxImg.style.margin = "auto";
lightboxImg.style.display = "block";

const buttonsdiv = document.createElement("div");
buttonsdiv.style.background = "white";
buttonsdiv.style.position = "fixed";
buttonsdiv.style.left = "50%";
buttonsdiv.style.top = "20px";
buttonsdiv.style.transform = `translateX(-50%);`;
buttonsdiv.style.borderRadius = "10px";
buttonsdiv.style.boxShadow = "0px 10px 15px -5px rgba(0,0,0,0.5)";
buttonsdiv.style.padding = "0px 5px";

const button = document.createElement("button");
button.classList.add("lightbox-button");

const buttonL = button.cloneNode();
buttonL.innerText = "\u21B6";
const buttonR = button.cloneNode();
buttonR.innerText = "\u21B7";

//modifica del cursore
lightboxImg.addEventListener('mouseover', function() {
  this.style.cursor = 'grab';
});
lightboxImg.addEventListener('mouseup', function() {
  this.style.cursor = 'grab';
});
lightboxImg.addEventListener('mousedown', function() {
  this.style.cursor = 'grabbing';
});

lightbox.appendChild(lightboxImg);
lightbox.appendChild(buttonsdiv);
buttonsdiv.appendChild(buttonL);
buttonsdiv.appendChild(buttonR);
document.body.appendChild(lightbox);

// Zoom
lightbox.addEventListener("wheel", (event) => {
    event.preventDefault();

    const zoomFactor = 1 + Math.sign(event.deltaY) * -0.1;

    scale *= zoomFactor;

    scale = Math.min(Math.max(0.1, scale), 10);

    transform(lightboxImg, posX, posY, scale, rotation);
});

// Allineamento dell'immagine al centro
lightboxImg.addEventListener('load', function() {
    posY = window.innerHeight/2-event.currentTarget.height/2;

    // Set the transform style of the lightbox image
    transform(event.currentTarget, 0, posY, 1, 0);

    // Show the lightbox
    event.currentTarget.style.display = "block";
    lightbox.style.removeProperty('cursor');

});

// Inizio dello spostamento
lightboxImg.addEventListener("mousedown", (event) => {
    event.preventDefault();

    isDragging = true;

    startX = event.clientX;
    startY = event.clientY;
});

// Spostamento
window.addEventListener("mousemove", (event) => {
    if (isDragging) {
        posX += event.clientX - startX;
        posY += event.clientY - startY;

        startX = event.clientX;
        startY = event.clientY;

        hasDragged = true;

        transform(lightboxImg, posX, posY, scale, rotation);
    }
});

// Fine spostamento
window.addEventListener("mouseup", () => {
    isDragging = false;
});

// Chiude la lightbox al click
lightbox.addEventListener("click", (event) => {
    if (!hasDragged) {
        lightbox.style.display = "none";

        scale = 1;
        rotation = 0;
        posX = posY = 0;
    }

    hasDragged = false;
});

// Pulsatnti rotazione
buttonL.addEventListener("click", (event) => {
    event.stopPropagation();
    rotation = (rotation-90);
    transform(lightboxImg, posX, posY, scale, rotation);
});
buttonR.addEventListener("click", (event) => {
    event.stopPropagation();
    rotation = (rotation+90);
    transform(lightboxImg, posX, posY, scale, rotation);
});

var sheet = window.document.styleSheets[0];
sheet.insertRule('.lightbox-button {font-size: xx-large; margin: 0px 10px 5px}', 1);