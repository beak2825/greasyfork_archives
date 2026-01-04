// ==UserScript==
// @name         xhamster-photo-button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the xhamster!
// @author       You
// @icon         https://svgshare.com/i/VDM.svg
// @match        https://unlockxh1.com/photos/gallery/*/*
// @match        https://unlockxh2.com/photos/gallery/*/*
// @match        https://unlockxh3.com/photos/gallery/*/*
// @match        https://unlockxh4.com/photos/gallery/*/*
// @match        https://xhamster.com/photos/gallery/*/*
// @match        https://xhamster1.com/photos/gallery/*/*
// @match        https://xhamster2.com/photos/gallery/*/*
// @match        https://xhamster3.com/photos/gallery/*/*
// @match        https://*.xhcdn.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426069/xhamster-photo-button.user.js
// @updateURL https://update.greasyfork.org/scripts/426069/xhamster-photo-button.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));

const yourFunctionb = async () => {
    //await delay(1000);

    let b=0;
    let a= document.URL;
    console.log(a);
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    //window.open(document.querySelector(".fotorama__img").src); // code below doesn't work uncomment this
    var ua = document.createElement("a");
    ua.href = document.querySelector(".fotorama__img").src;
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                       true, false, false, false, 0, null);
    ua.dispatchEvent(evt);
    console.log(a);
    console.log(a.length);
}

const yourFunction2b = async () => {
    let n=document.title;
    while(n.charAt(n.length-1)!='g'){
        n = n.slice(0, -1);}
    let a = document.createElement('a');
    await delay(10);
    a.href = document.querySelector("body > img").src;
    a.setAttribute('download', n);
    document.body.appendChild(a);
    a.click();
    await delay(1500);
    window.open('','_self').close();
}
function mainb() {
    'use strict';
    var k=0;
    var s1 = document.URL;
    while(s1[0]!='x'){
        s1 = s1.substring(1);}
    if(s1.substring(0,5)=="xhcdn"){k=1;}
    if(k==1){yourFunction2b();}
    if(k==0){
        var button = document.createElement("a");
        button.innerHTML = "Download";
        button.href="#";
        button.onclick=yourFunctionb;
        button.style = "top:180px;left:10px;opacity: 8;font-size: 20px;padding-top:15px;padding-left:8px;background-color: #434957;border-radius: 10%;color:white;display:inline-block;width: 105px;height: 50px;OnClick='https://www.gg.com';position:absolute;z-index: 9999";
        document.body.appendChild(button);
        console.log("Download Button Added");

        //yourFunction();
    }
}
const yourFunctiona = async () => {
    //await delay(1000);

    let b=0;
    let a= document.URL;
    console.log(a);
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    window.location.replace(document.querySelector(".fotorama__img").src);
    console.log(a);
    console.log(a.length);
}


const yourFunction2a = async () => {
    let n=document.title;
    while(n.charAt(n.length-1)!='g'){
        n = n.slice(0, -1);}
    let a = document.createElement('a');
    await delay(100);
    a.href = document.querySelector("body > img").src;
    a.setAttribute('download', n);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    await delay(100);
    window.open('','_self').close();
}


function maina() {
    'use strict';
    var k=0;
    var s1 = document.URL;
    while(s1[0]!='x'){
        s1 = s1.substring(1);}
    if(s1.substring(0,5)=="xhcdn"){k=1;}
    if(k==1){yourFunction2a();}
    if(k==0){
        yourFunctiona();}
    // Your code here...
}
(function () {
    var decide=1;
    if(decide==1){
    mainb();}
    else if(decide==2){
    maina();}


})();
/*

const delay = ms => new Promise(res => setTimeout(res, ms));
const yourFunction = async () => {
    //await delay(1000);

    let b=0;
    let a= document.URL;
    console.log(a);
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    while(document.querySelector(".fotorama__img")==null){
        await delay(1000);
    }
    //window.open(document.querySelector(".fotorama__img").src); // code below doesn't work uncomment this
    var ua = document.createElement("a");
    ua.href = document.querySelector(".fotorama__img").src;
    var evt = document.createEvent("MouseEvents");
    //the tenth parameter of initMouseEvent sets ctrl key
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                       true, false, false, false, 0, null);
    ua.dispatchEvent(evt);
    console.log(a);
    console.log(a.length);
}


const yourFunction2 = async () => {
    let n=document.title;
    while(n.charAt(n.length-1)!='g'){
        n = n.slice(0, -1);}
    let a = document.createElement('a');
    await delay(10);
    a.href = document.querySelector("body > img").src;
    a.setAttribute('download', n);
    document.body.appendChild(a);
    a.click();
    await delay(500);
    window.open('','_self').close();
}


(function() {
    'use strict';
    var k=0;
    var s1 = document.URL;
    while(s1[0]!='x'){
        s1 = s1.substring(1);}
    if(s1.substring(0,5)=="xhcdn"){k=1;}
    if(k==1){yourFunction2();}
    if(k==0){
        var button = document.createElement("a");
        button.innerHTML = "Download";
        button.href="#";
        button.onclick=yourFunction;
        button.style = "top:180px;left:10px;opacity: 8;font-size: 20px;padding-top:15px;padding-left:8px;background-color: #434957;border-radius: 10%;color:white;display:inline-block;width: 105px;height: 50px;OnClick='https://www.gg.com';position:absolute;z-index: 9999";
        document.body.appendChild(button);
        console.log("Download Button Added");

        //yourFunction();
    }
})();

*/