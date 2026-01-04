// ==UserScript==
// @name         Character.ai Custom Fonts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  New fonts for Character.ai!
// @author       Florentinity
// @match        https://old.character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472422/Characterai%20Custom%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/472422/Characterai%20Custom%20Fonts.meta.js
// ==/UserScript==

(function() {
    var SelectedFont = "Noto Sans"

    function Update() {
     document.getElementsByClassName("apppage").item(0).style.fontFamily = SelectedFont
    }

    function ChangeFont() {
        //if(document.body.children.length < 5)
        //{
        var FontChanger = document.createElement("popup");
        FontChanger.style.width = "640px";
        FontChanger.style.height = "480px";
        FontChanger.style.position = "fixed";
        FontChanger.style.top = "25%"
        FontChanger.style.left = "35%"
        document.body.appendChild(FontChanger);

        var popupFrame = document.createElement("img")
        popupFrame.src = "https://i.ibb.co/b303tff/frame.png"
        popupFrame.style.width = "640px";
        popupFrame.style.height = "480px";
        popupFrame.draggable = false
        FontChanger.appendChild(popupFrame)

        var popupExit = document.createElement("img")
        popupExit.src = "https://i.ibb.co/F6rPhsQ/exit.png"
        popupExit.style.width = "64px"
        popupExit.style.height = "64px"
        popupExit.style.position = "fixed"
        popupExit.style.left = "inherit"
        popupExit.draggable = false
        popupExit.addEventListener("click", (event) => {FontChanger.remove(); SelectedFont = popupInput.value} , false);
        FontChanger.appendChild(popupExit)

        var popupInput = document.createElement("input")
        popupInput.style.width = "256px"
        popupInput.style.height = "32px"
        popupInput.style.position = "relative"
        popupInput.style.top = "-25%"
        popupInput.style.left = "30%"
        FontChanger.appendChild(popupInput)

        var popupLabel = document.createElement("label")
        popupLabel.innerText = "Write down your font name here (The fonts will apply after you exit) :"
        popupLabel.style.position = "relative"
        popupLabel.style.top = "-65%"
        popupLabel.style.left = "10%"
        popupLabel.style.maxWidth = "512px"
        document.addEventListener("keyup", (event) => {popupLabel.style.fontFamily = popupInput.value}, false);
        FontChanger.appendChild(popupLabel)
        //}
    }

    function ButtonCheck() {
        var button = document.createElement("button");
        button.className = "btn py-0"
        button.style = "padding-right: 0px; margin-right: 5px;";
        button.type = "button"
        button.title = "Change Fonts"
        var buttonimage = document.createElement("img");
        buttonimage.src = "https://i.ibb.co/F4Nmw1p/abclight.png"
        button.addEventListener ("click", ChangeFont , false);
        if(document.getElementsByClassName("input-group me-3 my-0").item(0).parentElement.children.length < 2 && document.URL.includes("/chat2?char="))
        {
        button.appendChild(buttonimage)
        document.getElementsByClassName("chatbox text-muted d-flex justify-content-start align-items-center bg-white mx-3").item(0).appendChild(button);
        } else if(document.getElementsByClassName("input-group me-3 my-0").item(0).parentElement.children.length < 3 && document.URL.includes("/chat?char=")) {
        button.appendChild(buttonimage)
        document.getElementsByClassName("chatbox text-muted d-flex justify-content-start align-items-center bg-white mx-3").item(0).appendChild(button);
        }
}


setTimeout(() => { setInterval(ButtonCheck, 500) }, 5000);
setTimeout(() => { setInterval(Update, 100) }, 5200);
})();