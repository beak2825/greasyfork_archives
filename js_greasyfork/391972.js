// ==UserScript==
// @name         Favourite the post! For FA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Favourite the post! X3
// @author       You
// @match        https://www.furaffinity.net/view/*
// @match        http://www.furaffinity.net/view/*
// @match        www.furaffinity.net/view/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391972/Favourite%20the%20post%21%20For%20FA.user.js
// @updateURL https://update.greasyfork.org/scripts/391972/Favourite%20the%20post%21%20For%20FA.meta.js
// ==/UserScript==


//This is to favourite the post
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '20%', left:'4%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

(function(){
    'use strict'

  window.addEventListener('load', () => {
    addButton('Favourite this ', gfg_Run)
    })

var inputH = document.querySelector('a[href*="/fav/"]');
     function gfg_Run() {
         inputH.click();
         alert("Created by Legacy2988 on FurAffinity!");
          }
}())
