// ==UserScript==
// @name         wiki References remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ru.wikipedia.org References remover
// @author       Anastasia Mukhlynina
// @match        https://ru.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395788/wiki%20References%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/395788/wiki%20References%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

document.addEventListener('DOMContentLoaded', RemoveRef);

 let btnForRef = document.createElement('button');
  document.querySelector('#p-personal').prepend(btnForRef);
   btnForRef.setAttribute('id', 'buttonRef');
    btnForRef.innerText ="Убрать сноски";
    btnForRef.style.borderRadius = "10%";
    btnForRef.style.backgroundColor = "skyblue";
    let buttonRef = document.querySelector('#buttonRef');

    buttonRef.addEventListener('click', RemoveRef);

function RemoveRef(){

        let refs = document.querySelectorAll('.reference');
                for (let ref of refs){
     ref.remove()
      }};

    let countRefResult = document.createElement('div');

    let result = document.createElement('p');
    result.setAttribute('id', 'result');
    countRefResult.innerText ='Количество ссылок на источники:';
    countRefResult.style.backgroundColor ='yellow';
    countRefResult.setAttribute('id', 'divResult');
    result.innerText ='...';
    countRefResult.appendChild(result);
    document.querySelector('#siteSub.noprint').appendChild(countRefResult);

    let refs = document.querySelectorAll('.reference');
    result.innerText = refs.length;

})();