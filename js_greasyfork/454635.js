// ==UserScript==
// @name         FlicksBar AD Remover
// @namespace    https://t.me/flicksbar
// @version      1.52
// @description  Clean page from adv and improve the site
// @author       Devitp001
// @icon         https://www.kinopoisk.ru/favicon.ico
// @icon64       https://www.kinopoisk.ru/favicon.ico
// @match        https://flicksbar.info/*
// @match        https://flicksbar.mom/*
// @match        https://flcksbr.top/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454635/FlicksBar%20AD%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/454635/FlicksBar%20AD%20Remover.meta.js
// ==/UserScript==



//Deleted function of title

var percentOfVideo = 80;
var wrapperHeight ='calc(' + percentOfVideo + '%)';

function videoResize()
{

    document.querySelector("body > div").style.height=wrapperHeight;

}


function ADRemover()
{

    document.querySelector("body > div").style.height='calc(80%)';
    document.querySelector("#tgWrapper").remove();
    document.querySelector("#TopAdMb").remove();
    document.querySelector("body > div > div.brand").remove();
    document.querySelector("body > div > div.topAdPad").remove();
    document.querySelector("body > div > div.mainContainer > div.adDown").remove();
    document.querySelector("body > span").remove();
    document.querySelector("body > script:first-child").remove();

    var cclass = document.querySelector("#tgWrapper");

    cclass = document.getElementsByClassName('kinobox');
    cclass[0].style.minHeight='600px';

}

function initScript(ADR = 1,vR = 1)
{
    if (ADR === 1) ADRemover();
    if (vR === 1) videoResize();
}

window.onload=initScript();







