// ==UserScript==
// @name         Bionic Reading
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  Enanched reading for all webpages, based in https://greasyfork.org/en/scripts/445268-bionic-reading
// @author       ****
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465635/Bionic%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/465635/Bionic%20Reading.meta.js
// ==/UserScript==

// Not the best way but easy and fast
const styleBold = document.createElement('style');
const styleOpacity = document.createElement('style');
styleBold.innerHTML = 'bbb{font-weight:bold;}';
styleOpacity.innerHTML = "ccc { opacity: 70% }";
var isBold = true;
var isOpacity = true;

// Quit 'a' from the list if you want to be applied to links
const excludeTagNames = ['script','style','xmp','input','textarea','pre','code','a'].map(a=>a.toUpperCase());

let textEls = [];
const gather = el=>{
    el.childNodes.forEach(el=>{
        if(el.isEnB) return;
        if(el.nodeType === 3){
            textEls.push(el);
        }else if(el.childNodes){
            if(excludeTagNames.includes(el.tagName)) return;
            gather(el)
        }
    })
};

let body = document.body;

const enCodeHTML = s=> s.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
    return '&#'+i.charCodeAt(0)+';';
 });

const run = _=>{
    textEls = [];
    gather(body);

    textEls.forEach(textEl=>{
        const text = textEl.data;
        if(!/[a-z][a-z0-9]+/i.test(text))return;

        const spanEl = document.createElement('spann');
        spanEl.isEnB = true;
        spanEl.innerHTML = enCodeHTML(text).replace(/[a-z][a-z0-9]+/ig,word=>{
            return '<bbb>'+word.substr(0,Math.ceil(word.length/2))+'</bbb>'+'<ccc>'+word.substr(Math.ceil(word.length/2))+'</ccc>'
        })
        textEl.after(spanEl);
        textEl.remove();
    });
    document.head.appendChild(styleBold);
    document.head.appendChild(styleOpacity);
}

// Menu
var BionicMenu = document.createElement("div");
BionicMenu.style.margin = "0";
BionicMenu.style.padding = "0";
BionicMenu.style.position = "fixed";
BionicMenu.style.width = "20px";
BionicMenu.style.right = "0px";
BionicMenu.style.bottom = "50vh";
BionicMenu.style.color = "black";
BionicMenu.style.background = "white";
BionicMenu.style.opacity = "80%";

// Button for bold
var BoldOption = document.createElement("p");
BoldOption.id = "toggleBold";
BoldOption.textContent = "b"
BoldOption.style.textAlign = "center";
BoldOption.style.padding = "4px 0";
BoldOption.style.margin = "0";
BoldOption.style.fontSize = "16px";
BoldOption.style.userSelect = "none";
BoldOption.style.background = "#646464";

// Copy of the button and changed for opacity
var OpacityOption = BoldOption.cloneNode(true)
OpacityOption.id = "toggleOpacity";
OpacityOption.textContent = "o"

// Add all to the page
BionicMenu.appendChild(BoldOption);
BionicMenu.appendChild(OpacityOption);
body.appendChild(BionicMenu);

// button toggle behaviour
$("#toggleBold").on("click", function () {
    if (isBold)
        styleBold.innerHTML = 'bbb{font-weight:none;}';
    else
        styleBold.innerHTML = 'bbb{font-weight:bold;}';
    isBold = !isBold;
    $(this).css("background", isBold ? "#646464" : "none");
});

$("#toggleOpacity").on("click", function () {
    if (isOpacity)
        styleOpacity.innerHTML = "ccc { opacity: 100% }";
    else
        styleOpacity.innerHTML = "ccc { opacity: 70% }";
    isOpacity = !isOpacity;
    $(this).css("background", isOpacity ? "#646464" : "none");
    run();
});

// Apply all on load
function load() {
    document.head.appendChild(styleBold);
    document.head.appendChild(styleOpacity);
    run();
}

const _run = ms=> _=>setTimeout(load(),ms);
const {open,send} = XMLHttpRequest.prototype;
XMLHttpRequest.prototype.open = function(){
    this.addEventListener('load',_run(200));
    return open.apply(this,arguments);
};

document.addEventListener('click',_run(250));
window.addEventListener('load',_run(200));
document.addEventListener("DOMContentLoaded",_run(200));

setTimeout(function(){
        $(window).trigger('load');
    }, 3500);