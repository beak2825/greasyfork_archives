// ==UserScript==
// @name         OtoMoto otwórz duże zdjęcie z klawiatury
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skrypt otwiera okienko z dużym zdjęciem po naciśnięciu klawiszy escape lub spacja. Ponadto zamyka widok przy naciśnięciu escape, spacji lub s. Umożliwia także nawigowanie po zdjęciach w prawo i lewo poprzez klawisze a oraz d.
// @author       GrabkaMan
// @match        https://www.otomoto.pl/oferta/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376242/OtoMoto%20otw%C3%B3rz%20du%C5%BCe%20zdj%C4%99cie%20z%20klawiatury.user.js
// @updateURL https://update.greasyfork.org/scripts/376242/OtoMoto%20otw%C3%B3rz%20du%C5%BCe%20zdj%C4%99cie%20z%20klawiatury.meta.js
// ==/UserScript==

document.addEventListener("keyup", function (e) {
    var inputFocused = CheckIfInputIsFocused();
    var isEscapeOrSpace = (e.key === "Escape" || e.key === " ");
    if(!inputFocused)
    {
        if(IsBigPictureOpen())
        {
            if(isEscapeOrSpace || e.key ==="s")
            {
                console.log("Escaping galery view.");
                document.getElementById("overgalleryback").click();
            }
            else if(e.key === "d")
            {
                console.log("Going to next photo.");
                document.getElementsByClassName("bigImageNext")[0].click();
            }
            else if(e.key === "a")
            {
                console.log("Going to previous photo.");
                document.getElementsByClassName("bigImagePrev")[0].click();
            }
        } else
        {
            if(isEscapeOrSpace)
            {
                console.log("Opening galery view.");
                document.getElementsByClassName("bigImage")[0].click();
            }
            else if(e.key === "d")
            {
                console.log("Going to next photo.")
                document.getElementsByClassName("slick-next")[0].click();
            }
            else if(e.key === "a")
            {
                console.log("Going to previous photo.")
                document.getElementsByClassName("slick-prev")[0].click();
            }
        }
    }
});

function CheckIfInputIsFocused()
{
    var activeElementType = document.activeElement.type
    if(activeElementType!==null)
    {
        if(activeElementType.indexOf('text') === 0) {
            return true;
        }
    }
    return false;
}

function IsBigPictureOpen(){
    var bigPicture = document.getElementById("bigImageContent");
    if(bigPicture.style.display == "block")
    {
        return true;
    }
    return false;
}