// ==UserScript==
// @name         Classic MC Saver
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @license      GNU GPLv3
// @description  Save and load Minecraft Classic worlds
// @author       River
// @match        *://classic.minecraft.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minecraft.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508794/Classic%20MC%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/508794/Classic%20MC%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (localStorage.getItem('mscSaves') === null){
        localStorage.setItem('mscSaves', '{}');
    }

    var module = document.createElement('div');
    module.innerHTML = '<p style="padding:0px; margin:0px;">MC Saver</p>';
    module.setAttribute('class', 'module');
    module.setAttribute('style', `
     position:fixed;
     top:0;
     right:0;
     margin:5px;

	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAAAPCAAAAACe4j/AAAAEuElEQVRIx1WWS5Ibuw5EtddrdRRJJE4iSKrb4c2/AUuy30iK+jEBHCTwAICMCgAKiGhKVQUwKzJHQo4mQGBy7AIvk1E2AQKhFt6bUGD1gILy0DkD4dmzACkGyzCScgFgQmLZr4LpQpC56QB2wgSYE8i1fd6xd1yPHIAKwAs14Undx2LIHK0X6vdFbzTa6CNBLQE8Y5rapn7oAl3KSDKC6cLfL6sLnIVG7ffnyUgvQ6rwLjUZdIVqWz0iEXXCZ+TJsV8feUdoPHDk+a/IeAbq0ldLT59jtHweHwmKS6gFSUYCqKcVsPami1pEnqolkCMBiAS87FXTICp03geYUr8TV8un3KuyC0BfTUzihOCdwjUya1bkT9VWe+AaFOoJzHdtERXRe/eulyEDhC6pjYwr+JQuIDU9/0wQBnJEAkd+9i6IRTJrV7YWnGfwLA6ESphkBoCu88M0YH1CTTOiRUpDdwpGkkP5yL9phhwn+QVxDarAXq513y9bLKgxBGR/CjDyMl4ECd6lO82CaMLbEHGHp1R8ePDERj392ssaCOigNjJ+dXXl6OLUFfVx6dA1BFJLlHpkUHPam095C3QJLIjn6OLIOB3xe0JS85Zd+govg1/z/UhtG3RdVW98yxNp5I0Vtf/U+6y/dJ/yHtSK4q7G9ARscC3/Df/kXTwiT3d6ovjEISLJIVEvBwWeCXlALZTbpy85xqWuf3sNiBBUmYjI+BqN6aNQqDWpipSYf3W1nOV/WALoykjIiCPreSn97UigsjZdPA5s3AmCDIxaVO0Fa1fV/qkaiijPPz/bEeRyLSBDI8K8j37TO8aH7vmOqUUQ1DboYhvqd+FlFGEo+2T75MbLGnjvPeu7Pl521Ap14dcR3h7p75qv4xieqnNDoyCPLt/yKkf5gOUXl+6S3d9Syq/982fz+fhpsm28C5EhJcxsWWQke6KoPMA7tqm7kKcrn6FLhWcoqCNCxDPyQ8wEKR73nIlEX8GpARSJX7/rzeNtWPD/Dl2IwtOYMwV7osGsHYJanzeU7KqIZVCTcrT0IEbyD4d1e1dkBtW2qLhLXK7a1ogDqsjI1DR4PY7nHEqfF9tn8HUJL+eQ/lGOXdwI1++57CqgmDaReM9CZYLAk4D4ymqti4KZI9Htz9OnrcuOhCQEqJfXaxHPAFG/l/ee1GFJPXmPryYUiUGPutnRGXkagmnjHk5RNpm7xxiclm6CjJEQ4+MD4xPmuT9Ef4b3YT3B51a7d4Np76PF0cavuC+SoaH6PlilipEakoJBJETWT3k7Hf+1REPj2fIx95t5ct6u9S5v3KM2fv2Ve29ax9yC98zT2IZot61MHyYtdPF92nguZ29xfcVxSu9Nj5Gl8G3wcVoW8n1Q/f6BHFEAyy5R2aRIdYH8XfV4453vHKcnqarXPD6mdrD0rlVV5xBPF2xuJM5Oo0SdaaqGMjJva7ii6bYv74IzPMo5pGebpu72ghypwTR+WWDuhQOkFijGyAzF3GXh11lEH0hkPINZivpTqLEtVm2j1hVcn/S0//q0es5dbyxOErxKivQ+bHotvzcT3/XztPf20XqG6fJZMePT2X6ts+nlm9LoSYHMiHuJjGXniB7v2fo/5qT4nuxYg6AAAAAASUVORK5CYII=);
  	border-color: #AAA #565656 #565656 #AAA;
  	text-shadow: 3px 3px #4C4C4C;
  	outline: 3px inset #000;
    padding-left:20px;
    padding-right:20px;
    padding-top:10px;
    padding-bottom:10px;


     z-index: 99999999999;
    `);



    document.body.appendChild(module);


    module.addEventListener('click', function(){

        var worlds = JSON.parse(localStorage.getItem('mscSaves'));
        var userOption = prompt('Enter "SAVE" or "LOAD".').toLowerCase();
        if (userOption == 'save'){

            let saveName = prompt('Enter a name for your save. Using an already taken name will override the save.');
            worlds[saveName] = localStorage.getItem('savedGame');
            localStorage.setItem('mscSaves', JSON.stringify(worlds));

        } else if (userOption == 'load') {

            let saveChoices = Object.keys(worlds);
            let saveChoice = prompt('Choose a save; ' + JSON.stringify(saveChoices));
            let saveData = worlds[saveChoice];
            localStorage.setItem('savedGame', saveData);
            window.location.href = 'https://classic.minecraft.net/';
        }

    });
})();