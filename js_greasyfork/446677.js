// ==UserScript==
// @name         Back btn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  back history
// @author       You
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/446677/Back%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/446677/Back%20btn.meta.js
// ==/UserScript==

(function() {

let css=`
.buttonForBack{
    position: fixed;
    bottom: 100px;
    right: 50px;
    border: none;
    border-radius: 50px;
    height: 40px;
    width: 40px;
    opacity: 0.75;
    background-color: rgba(18, 17, 17, 1);
}

.circleForBack{
    background-color: rgb(93, 85, 85,0.5);
    border: 2px solid #7B8471;
    height: 50px;
    width: 50px;
    bottom: 93px;
    right: 43px;
}

.newIn{
    border: 2.5px solid #3CB3E4;
    transform: scale(0.95);
}

.newOut{
    background-color: #3c4143;
    transform: scale(0.95);
}
`

let html=`<div class="container"></div>
<div class="buttonForBack circleForBack "></div>
<button class="buttonForBack newOut"></button>
`

let Inject=document.createElement('div')
Inject.innerHTML=html
document.body.appendChild(Inject)


let Putcss=document.createElement('style')
Putcss.innerHTML=css
document.head.appendChild(Putcss)

const inner=document.querySelector('button.buttonForBack')
const outside=document.querySelector('.circleForBack')

inner.addEventListener('click',() => {
    outside.classList.add('newOut')
    inner.classList.add('newIn')

    setTimeout(() => {
        inner.classList.remove('newIn')
        outside.classList.remove('newOut')
},95)

    history.back();
})


})();