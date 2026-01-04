// ==UserScript==
// @name         ms short cf short
// @namespace    http://tampermonkey.net/
// @version      2024-06-17
// @description  bypas shortlink
// @author       gigih
// @match        https://blackwoodacademy.org/the-top-10-loan-mistakes-and-how-to-avoid-them/
// @match        https://*
// @match        https://*/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackwoodacademy.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499125/ms%20short%20cf%20short.user.js
// @updateURL https://update.greasyfork.org/scripts/499125/ms%20short%20cf%20short.meta.js
// ==/UserScript==

    setInterval(function(){
        let msg3=document.querySelector("#swal2-title")
        let n=document.querySelector("#wpsafelinkhuman")
        let n3=document.querySelector("#wpsafe-generate > a > img")
        let next=document.querySelector("#wpsafelinkhuman > img")
        let mshost=document.querySelector("#scrolltocbt > div > div > h1")
        let f=document.querySelector("body > div.container > div > div > div > div > a")
        let btn3=document.querySelector("#image3")
        let msg =document.querySelector("#formButtomMessage")

    let btn =document.querySelector("#cbt")
    if (btn){
        btn.click();
     document.querySelector("#cbt").scrollIntoView({
     behavior: 'smooth'
});
    }
        if(msg3&&msg3.innerText.includes("Success!")){
          window.location.replace}
        if(n){
            n.click();}
        if (n3){
            n3.click()}
        if(mshost){
            mshost.click()}
        if(btn3){
            btn3.click()}
        let bt=document.querySelector("#aaoii2o")
    if (bt){
    bt.click();
    }
        if (f){
            f.click();}
        if(next){
            next.click();}
        if (msg&&msg.innerText.includes("waiting for click")){
            location.reload();}
    if (mshost&& mshost.innerText.includes("Click on the ad to continue")){
        location.reload()
    }
        },3000
   );
clearInterval();
setTimeout(function(){
    window.location.reload();},600000);