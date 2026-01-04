// ==UserScript==
// @name         Say "Very Nice!" for FA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Say "Very Nice" on a post by clicking the button.
// @author       You
// @match        https://www.furaffinity.net/view/*
// @match        http://www.furaffinity.net/view/*
// @match        www.furaffinity.net/view/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391973/Say%20%22Very%20Nice%21%22%20for%20FA.user.js
// @updateURL https://update.greasyfork.org/scripts/391973/Say%20%22Very%20Nice%21%22%20for%20FA.meta.js
// ==/UserScript==


//This is to comment on the post
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '15%', left:'4%', 'z-index': 3}
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
    addButton('Very Nice!', gfg_Run)
    })
      var el_down = document.getElementById("JSMessage");
        var inputF = document.getElementById("JSMessage");
    var yeet = document.getElementsByClassName('button');
    var inputH = document.getElementsByTagName("a");
     function gfg_Run() {
            inputF.value = "Very Nice!";
            el_down.innerHTML =
                   "Value = " + "'" + inputF.value + "'";
         yeet[0].click();
                inputH.click();
         alert("Created by Legacy2988 on FurAffinity!");
          }
}())
