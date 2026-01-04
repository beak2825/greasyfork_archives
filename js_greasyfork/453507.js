// ==UserScript==
// @name         노벨클립태거
// @version      0.1
// @description  copy and f10
// @author       빨간망토
// @match        https://novelai.net/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @namespace https://greasyfork.org/users/973636
// @downloadURL https://update.greasyfork.org/scripts/453507/%EB%85%B8%EB%B2%A8%ED%81%B4%EB%A6%BD%ED%83%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453507/%EB%85%B8%EB%B2%A8%ED%81%B4%EB%A6%BD%ED%83%9C%EA%B1%B0.meta.js
// ==/UserScript==

/*
Handles the keyDown events
*/
let onKeyDown = (e) => {

    /*
    0 = off
    1 = on
    keyCodeObject outputs the event object of the KeyEvent
    keyCode outputs the keyCode of the key thats been pressed
    */
    let log = {keyCodeObject: 0, keyCode: 0}

    if(log.keyCodeObject){console.log(e);}

    let keyCode = e.which === 0 ? e.charCode : e.keyCode;

    if(log.keyCode){console.log(keyCode);}

    // add cases for keys you want, and hook them up to functions
    switch(keyCode){
        case 121: // match 'F10' key
            yourFunctionHere();
            break;

        default:
            //do nothing
    }
}


function yourFunctionHere(){

navigator.clipboard.readText().then((text) => {

    var pos=text.split('Negative')[0];
    //var neg="";
    var neg="{mutated hands and fingers:1.5}, {long body :1.3}, {mutation, poorly drawn :1.2}, black-white, bad anatomy, liquid body, liquid tongue, disfigured, malformed, mutated, anatomical nonsense, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions,bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, poorly drawn breasts, liquid breasts, bad hands, fused hand, blurry, JPEG artifacts, bad hairs, poorly drawn hairs, fused hairs, ugly, bad face, fused face, poorly drawn face, cloned face, big face, long face, bad eyes, fused eyes poorly drawn eyes, malformed limbs, gross proportions. short arm, {{{missing arms}}}, mutation, duplicate, morbid, mutilated, poorly drawn hands, deformed, {blurry}, disfigured, fused calf, bad knee, dirty face, fused cloth, poorly drawn cloth, thick lips, worst quality, low quality, normal quality, cropped";

    if (text.includes('Negative')) neg=text.split('Negative')[1];
    if (pos.includes('복사')) pos=pos.split('복사')[0];
    if (neg.includes('복사')) neg=neg.split('복사')[0];
    if (pos.includes('Prompt')) pos=pos.split('Prompt')[1];
    if (neg.includes('prompt')) neg=neg.split('prompt')[1];
    pos=pos.trim();
    neg=neg.trim();
    const promp = document.querySelector("#prompt-input-0");
    promp.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand('insertText', false, pos);

    const promn = document.querySelector("[placeholder*='Anythi']");
    promn.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand('insertText', false, neg);

    const butt = document.querySelector(".kYaSaz");
    butt.click();
    promp.focus();
});


}








(function() {
    'use strict';
    document.addEventListener("keydown", onKeyDown);
    console.log("script loaded");
})();