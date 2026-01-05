// ==UserScript==
// @name         Whatsapp Web Privacy Mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tools to hide contact names and pictures of Whatsapp Web.
// @author       RHueara
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28406/Whatsapp%20Web%20Privacy%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/28406/Whatsapp%20Web%20Privacy%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hidden = false;
    var defaultbkg = 'lightgrey';
    var prevName = '';
    var sheet = window.document.styleSheets[0];
    sheet.insertRule('@keyframes btnanimate { 0% {background-color: red; left:70px;} 25%{left:55px;} 50%{left:85px;} 75% {left:65px;} 100% {background-color: white;left:70px;} }', sheet.cssRules.length);
    window.addEventListener('load', () => {
     checkScreenLoaded();
     document.addEventListener("keydown", function(e) {
         var keyCode = e.keyCode;
         if(keyCode==118) {
             toggleShowHide();
         }
     }, false);
    });
    function checkScreenLoaded() {
        setTimeout(function(){
            if (document.getElementsByClassName('intro-image')[0] != null) {
                addButton('Hide / F7', toggleShowHide);
            } else {
                checkScreenLoaded();
            }
        }, 1000);
    }
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', top: '15px', left:'70px', 'z-index': 3, 'font-weight':'bold', border:'black solid', 'border-radius':'10px',
                            padding:'4px', 'animation-duration': '200ms', 'background-color': defaultbkg, 'min-width': '75px', 'box-shadow':'grey 3px 3px 0px 0px'};
        let button = document.createElement('button'), btnStyle = button.style;
        document.body.appendChild(button);
        button.innerHTML = text;
        button.onclick = onclick;
        button.classList = ['show-hide-btn unpressed'];
        button.addEventListener('webkitAnimationEnd', function(){
            this.style.webkitAnimationName = '';
        }, false);
        button.onmouseover = function() {
            button.style["background-color"] = 'salmon';
        };
        button.onmouseout = function() {
            button.style["background-color"] = defaultbkg;
        };
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
        return button;
    }

    function toggleShowHide() {
        var btn = document.getElementsByClassName('show-hide-btn')[0];
        btn.style.webkitAnimationName = 'btnanimate';
        var panel = document.getElementsByClassName('chatlist-panel-body')[0];
        if (hidden) {
            panel.setAttribute('style', 'display:block');
            defaultbkg = 'lightgrey';
            btn.innerHTML = 'Hide / F7';
            btn.style["left"] = '70px';
            btn.style["top"] = '15px';
            btn.style["box-shadow"] = 'grey 3px 3px 0px 0px';
            try {
                document.getElementsByTagName('h2')[0].getElementsByTagName('span')[0].innerHTML = prevName;
                document.getElementsByClassName('pane-chat-header')[0].getElementsByTagName('img')[0].setAttribute('style', 'display:block;');
            } catch(e) {
            }
            prevName = '';
        } else {
            panel.setAttribute('style', 'display:none');
            defaultbkg = 'red';
            btn.innerHTML = 'Show / F7';
            btn.style["left"] = '73px';
            btn.style["top"] = '18px';
            btn.style["box-shadow"] = '';
            try {
                prevName = document.getElementsByTagName('h2')[0].getElementsByTagName('span')[0].innerHTML;
                document.getElementsByTagName('h2')[0].getElementsByTagName('span')[0].innerHTML = randomName();
                document.getElementsByClassName('pane-chat-header')[0].getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
            } catch(e) {
            }
        }
        document.getElementsByClassName('show-hide-btn')[0].style["background-color"] = defaultbkg;
        hidden = !hidden;
    }
    function randomName() {
        var names = ['John Cena', 'Nicolas Cage', 'Adele', 'Neymar', 'Katy Perry', 'Ronda Rousey', 'Kanye West', 'Leonardo DiCaprio', 'Tony Stark', 'Hilary Clinton', 
                    'Bill Gates', 'Hope Solo', 'J. K. Rowling', 'Sandy', 'Homer Simpson', 'Barney Stinson', 'Walter White', 'Dexter Morgan', 'Sheldon Cooper'];
        return names[Math.floor(Math.random() * names.length)];
    }
})();