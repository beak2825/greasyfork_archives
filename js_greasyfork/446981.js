    // ==UserScript==
    // @name         MZ Coordenadas Hockey ARG
    // @namespace    http://tampermonkey.net/
    // @version      1.2
    // @description  Permite ubicar jugadores en coordenadas exactas X e Y en las tácticas de Hockey MZ.
    // @author       Juancho Caminante
    // @match        https://www.managerzone.com/?p=tactics*
    // @icon         none
    // @grant        none
    // @license      none
// @downloadURL https://update.greasyfork.org/scripts/446981/MZ%20Coordenadas%20Hockey%20ARG.user.js
// @updateURL https://update.greasyfork.org/scripts/446981/MZ%20Coordenadas%20Hockey%20ARG.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
        
        var coordsContainerAux = document.getElementById('formation-container');
        var input = '<input id=\"**id**\" type=\"text\" style=\"width: 20px\" value=\"**val**\">';
        var _x = '--';
        var _y = '--';
     
        if(allowed()) {
            var coordsContainer = document.getElementById('formation-container');
            var m = "<div><span style=\"font-weight: 600\">" + allowed() + "</span></div>";
            wrapCoordinates();
            var node = createElementFromHTML(m);
            coordsContainer.appendChild(node);
        }
        else if(ishockey()) {
            var juancho = 'juancho';
            var test = window.btoa(juancho);
            var test2 = window.atob(test);
            enableActionsForAllTabs();
            enableActionForAltTactics();
            addEventsToPlayers();
            drawCoordinates();
            document.addEventListener("keydown", setKeys);
            document.addEventListener("click", clickEvent);
        }
     
        function addEventsToPlayers() {
            var checkExist = setInterval(function() {
                if (document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable').length) {
                    var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable');
                    for (var i = 0; i < players.length; ++i) {
                        players[i].addEventListener('click', setCoordsLabel, false);
                        players[i].addEventListener('keydown', setCoordsLabel, false);
                    }
                    clearInterval(checkExist);
                }
            }, 1000);
     
        }
     
        function setCoordsLabel(player) {
            getOffset(player.path[1]);
            drawCoordinates();
        }
     
        function getOffset( el ) {
            _y = el.offsetTop - 1;
            _x = el.offsetLeft - 1;
        }
     
        function drawCoordinates() {
            let coord = document.getElementById('divCoords');
            if(coord) {
                coord.parentElement.removeChild(coord);
            }
     
            var coordsContainer = document.getElementById('formation-container');
            var divCoords = "<div id=\"divCoords\"><span style=\"font-weight: 600\">Posición del Jugador: **coords**</span></div>";
            wrapCoordinates();
            var node = createElementFromHTML(divCoords.replace('**coords**', _x + _y));
            coordsContainer.appendChild(node);
            applyCoordinates();
        }
     
        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
     
            // Change this to div.childNodes to support multiple top-level nodes
            return div.firstChild;
        }
     
        function applyCoordinates() {
            var inpX = document.getElementById('inputX');
            var inpY = document.getElementById('inputY');
     
            inpX.addEventListener('keyup', setPlayerPosition, false);
            inpY.addEventListener('keyup', setPlayerPosition, false);
        }
     
        function setPlayerPosition(input) {
            var c = input.currentTarget.id === 'inputX' ? 'x' : 'y';
            let selectedInput = c === 'x' ? document.getElementById('inputX') : document.getElementById('inputY');
            //get selected player
            var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
            var playerCollision = document.getElementsByClassName('fieldpos ui-selected fieldpos-collision');
            if(players.length) {
                let xVal = c === 'x' ? input.currentTarget.value : document.getElementById('inputX').value;
                let yVal = c === 'y' ? input.currentTarget.value : document.getElementById('inputY').value;
     
                if(isInRange(c == 'x' ? xVal : yVal, c)) {
                    removeBorder(selectedInput);
                    players[0].style.left = xVal + "px";
                    players[0].style.top = (parseInt(yVal) + 49) + "px";
                }
                else {
                    addBorder(selectedInput);
                }
            }
            else if(playerCollision.length) {
                let xVal = c === 'x' ? input.currentTarget.value : document.getElementById('inputX').value;
                let yVal = c === 'y' ? input.currentTarget.value : document.getElementById('inputY').value;
     
                if(isInRange(c == 'x' ? xVal : yVal, c)) {
                    removeBorder(selectedInput);
                    playerCollision[0].style.left = xVal + "px";
                    playerCollision[0].style.top = (parseInt(yVal) + 49) + "px";
                }
                else {
                    addBorder(selectedInput);
                }
            }
        }
     
        function wrapCoordinates() {
            var inpX = input.replace('**id**','inputX').replace('**val**', _x);
            var inpY = input.replace('**id**','inputY').replace('**val**', _y);
            _x = '<span style=\"color: blue\"> X (Horizontal): </span>' + inpX;
            _y = '<span style=\"color: green\"> Y (Vertical): </span>' + inpY;
        }
     
        function isInRange(number, coordinate) {
            if(!isNaN(number)) {
                var integer = parseInt(number);
                if(coordinate == 'x') {
                    return integer <= 100 && integer >= -100;
                }
                else if(coordinate == 'y') {
                    return integer <= 100 && integer >= -100;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
     
        function setKeys(key) {
            if((key.keyCode === 37 || key.keyCode === 38 || key.keyCode === 39 || key.keyCode === 40)
               && (key.currentTarget.activeElement.localName != 'input')) {
     
                var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
                var playerCollision = document.getElementsByClassName('fieldpos ui-selected fieldpos-collision');
                //player selected with or without collision
                if(players.length) {
                    _y = players[0].offsetTop - 49;
                    _x = players[0].offsetLeft - 19;
                }
                else if (playerCollision.length) {
                    _y = playerCollision[0].offsetTop - 49;
                    _x = playerCollision[0].offsetLeft - 19;
                }
                else {
                    _y = '--';
                    _x = '--';
                }
     
                drawCoordinates();
            }
        }
     
        function clickEvent(ev) {
            if(ev.currentTarget.activeElement.localName === 'select') {
                return false;
            }
            var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
            var playerCollision = document.getElementsByClassName('fieldpos ui-selected fieldpos-collision');
            if(!players.length && !playerCollision.length) {
                _y = '--';
                _x = '--';
                drawCoordinates();
            }
        }
     
        function enableActionsForAllTabs() {
            var tabs = document.getElementsByClassName('ui-state-default ui-corner-top');
            let ttta = document.getElementById('ttta');
            let tttb = document.getElementById('tttb');
            ttta.addEventListener('click',restart);
            tttb.addEventListener('click',restart);
     
            for (var i = 0; i < tabs.length; ++i) {
                tabs[i].addEventListener("click", function() {
                    addEventsToPlayers();
                    enableActionForAltTactics();
                });
            }
        }
     
        function enableActionForAltTactics() {
            var altTactics = document.getElementById('formation_select');
            altTactics.addEventListener('change',tacticChange);
        }
     
        function tacticChange() {
            let resetBtn = document.getElementById('reset_formation');
            let copyBtn = document.getElementById('replace_starting_formation');
     
            resetBtn.addEventListener('click',restart);
            copyBtn.addEventListener('click',restart);
     
            restart();
        }
     
        function restart() {
            _y = '--';
            _x = '--';
            addEventsToPlayers();
            drawCoordinates();
        }
     
        function addBorder(input) {
            input.style.border = 'solid 2px fuchsia';
        }
        function allowed(){let G=!1,b=[{u:"ZGllZ29jYXBhbm8=",m:"VXN0ZWQgbm8gdGllbmUgcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgZGFkbyBxdWUgcG9zZWUgbeFzIGRlIHVuYSBjdWVudGEu"},{u:"bWF4d2VsbHNtYXJ0ODE=",m:"RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIGRlbWFzaWFkbyB0cmFtcG9zbyBwYXJhIHVzYXIgZXN0YSBoZXJyYW1pZW50YS4="},{u:"bHVra2s0MQ==",m:"VXN0ZWQgZXMgdW4gdHJhbXBvc28geSBubyB0aWVuZSBwZXJtaXRpZG8gdXNhciBsYSBoZXJyYW1pZW50YS4="},{u:"ZGFya2xpbmU=",m:"RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIHVuIHBlbG90dWRvIHkgbm8gdGllbmUgcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEu"},{u:"a2luZXNpbzEw",m:"TG9zIHBlbG90dWRvcyBjb21vIHZvcyBubyB0aWVuZW4gcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgcG9yIGhhYmVyIGFycnVpbmFkbyBlbCBmb3JvLg=="},{u:"bXVyZGVy",m:"TG9zIHBlbG90dWRvcyBjb21vIHZvcyBubyB0aWVuZW4gcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgcG9yIGhhYmVyIGFycnVpbmFkbyBlbCBmb3JvLg=="}],V=document.getElementById("header-username").textContent;for(var g=0;g<b.length;++g)window.atob(b[g].u)===V&&(G=window.atob(b[g].m));return G}
        function removeBorder(input) {
            input.style.border = null;
        }
     
        function ishockey() {
            let response = false;
            let sport = document.getElementById('tactics_box');
            for(var i = 0; i < sport.classList.length; ++i) {
                if(sport.classList[i] == 'hockey') {
                    response = true;
                }
            }
            return response;
        }
     
    })();

