// ==UserScript==
/* jshint esversion: 8 */
// @name         HKSW SUI
// @version      1.0
// @description  Hacksaw Stealth User Interface. Hides HKSW UI for teaser recording
// @author       Voinea Andrei
// @match        static-dev.hacksawgaming.com/*
// @match        static-local.hacksawgaming.com/*
// @match        static-stg.hacksawgaming.com/*
// @match        http://localhost:9000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hacksawgaming.com
// @require      https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @grant        none
// @namespace https://greasyfork.org/users/1283758
// @downloadURL https://update.greasyfork.org/scripts/491624/HKSW%20SUI.user.js
// @updateURL https://update.greasyfork.org/scripts/491624/HKSW%20SUI.meta.js
// ==/UserScript==

init();

async function init(){
    await createHideBtn();
    await createMobileBtn();
    keypressSubscribe(' ');
}

function keypressSubscribe(key){
    let canvas = document.getElementById("webgl");
    let subscribe = function(event) {
        if(event.key == key){
            console.log('working');
            let btn = document.getElementById("PlaceBetBtn");
            btn.click();
        }
    }

    canvas.addEventListener('keydown', subscribe);
    document.addEventListener('keydown', subscribe);
}


function printScreen(){


        let canvas = document.getElementById("webgl");
        var dataURL = canvas.toDataURL("image/png");

        console.log(dataURL);

    // Create a temporary anchor element
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas.png'; // Optional: give your file a name
    document.body.appendChild(a);

    // Programmatically click the anchor element to trigger the download
    a.click();

    // Clean up
    document.body.removeChild(a);

}


async function createMobileBtn(){
    let mobileBtn = await createBtn();
    mobileBtn.id = "MobileBtn";

    changeIcon(mobileBtn.children[0], "https://www.svgrepo.com/show/533117/mobile-alt-1.svg");
    changeText(mobileBtn.children[1], 'MOBILE');
    mobileBtn.onclick = function() { createWindow(); };
}

async function createHideBtn(){
    let hideBtn = await createBtn();
    hideBtn.id = "HideBtn";

    changeIcon(hideBtn.children[0], "https://www.svgrepo.com/show/511020/hide.svg");
    changeText(hideBtn.children[1], 'HIDE');

    hideBtn.onclick = function() { hideUI(); };
}

async function createBtn(){
    let gameInfoBtn = document.getElementById("GameInfoBtn");

    while(gameInfoBtn == null){
        await resolveAfter(100);
        gameInfoBtn = document.getElementById("GameInfoBtn");
    }

    let btn = gameInfoBtn.cloneNode(true);
    gameInfoBtn.parentElement.appendChild(btn);
    return btn;
}

function resolveAfter(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, time);
  });
}

function changeIcon(element, iconURL){
    element.removeAttribute("class");
     var img = document.createElement("img");
    img.setAttribute("src", iconURL);
    img.style.marginRight = "8px";
    img.style.width = "24px";
    img.style.filter = "invert(100%) sepia(91%) saturate(38%) hue-rotate(321deg) brightness(110%) contrast(110%)";
    img.style.paddingLeft = "8px";
    element.replaceWith(img);
}

function changeText(element, text){
    element.removeAttribute("data-translation");
    element.innerHTML += `${text}`;
}

function hideUI(){
    let topUI = document.getElementById("CoreOverlay");
    let botUI = document.getElementById("UiWrapper");

    topUI.style.opacity = 0;
    botUI.style.opacity = 0;
}

function createWindow(){
    let url = window.location.href;
    if(!url.includes('channel=desktop')){
        url = url + '&channel=desktop';
    }
    let mobileUrl = url.replace('channel=desktop', 'channel=mobile');

    window.open(mobileUrl, "newWin", "width=706, height=1344");
}