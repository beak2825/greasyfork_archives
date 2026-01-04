// ==UserScript==
// @name         Wanikani Lesson and Review Button Scaler
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Resizes the lessons and reviews buttons on the dashboard to scale with the number of lessons and reviews in the queues respectively.
// @author       Wantitled
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442320/Wanikani%20Lesson%20and%20Review%20Button%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/442320/Wanikani%20Lesson%20and%20Review%20Button%20Scaler.meta.js
// ==/UserScript==

// Special thanks to @Naphthalene's "Display lesson/review numbers as categories instead of numbers" script.
// I had no idea how to make scripts before this and their code was doing something similar so I studied it extensively.
// No code has been reused.


// base defines the number of lessons/reviews where the buttons will be their normal size
// Everything is scaled to the base size, so small numbers will give massive buttons
// The default value is 42.

// fromTop is a setting that determines where the buttons 'expand from'
// 'true' means the text, numbers, and pictures will remain at the top of the buttons. 'false' means the text, numbers, and pictures will be at the bottom of the buttons
const base = 42;
const fromTop = true;


var buttonsContainer = document.getElementsByClassName("lessons-and-reviews")[0];
var boxes = jQuery(buttonsContainer).find("a");
boxes.each(function(index,elem){replaceStyle(elem)});
buttonsContainer.style.marginBottom = "0px";

function replaceStyle(elem){
    setGrid();
    let span = elem.children[0];
    let lrCount = parseInt(span.innerHTML, 10);
    if (lrCount < base){
        elem.style.padding = `${setMargin(lrCount)}px 16px 16px`;
        elem.style.backgroundSize = `auto ${setImage(lrCount)}px`;
        elem.style.backgroundPosition = "center";
    } else{
        if (fromTop){
            elem.style.padding = `116px 16px ${setMargin(lrCount)}px`;
            elem.style.backgroundPosition = "top";
            span.style.top = "114px";
            span.style.bottom = `${setMargin(lrCount) - 4}px`;
        } else{
            elem.style.padding = `${setMargin(lrCount)}px 16px 16px`;
            elem.style.backgroundPosition = "bottom";
        }
    }
}

// setGrid removes the maximum size for the area the buttons can occupy. Without this, the buttons will expand over the page content below.
// If you think that's kinda funny then feel free to remove the 'setGrid()' line above.
function setGrid(){
    let gridContainer = document.querySelectorAll('.progress-and-forecast.progress-and-forecast--with-extra-study');
    gridContainer.forEach(gridElem => {
        gridElem.style.gridTemplateRows = "auto auto";
    });
}

// setMargin(lrCount) sets the size for the buttons. Normally, the size is defined by the margins, where all sides are 16px aside from the top, which is 116px.
// When the lessons/reviews number is equal to the base, setMargin gives 116px. When it's 0, it gives 16px.
function setMargin(lrCount){
    if (base == 0){
        let marginSize = Math.round(((lrCount + 1) * 100) + 16);
        if (fromTop && lrCount >= base){
            marginSize -= 100;
        }
        return marginSize;
    } else {
        let marginSize = Math.round((lrCount * (100 / base)) + 16);
        if (fromTop && lrCount >= base){
            marginSize -= 100;
        }
        return marginSize;
    };
}

// setImage(lrCount) sets the size of the background image on the buttons. If the lessons/reviews number is equal to the base or larger, the size is not changed.
// If the number is lower, then the image will be scaled to fit within the button.
function setImage(lrCount){
    let imageSize = Math.round((lrCount * (100 / base)) + 50);
    return imageSize;
}