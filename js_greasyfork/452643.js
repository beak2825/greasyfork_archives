// ==UserScript==
// @name         Coord MZ Hockey Alt
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  You can establish by means of coordinates each position of your players in the Hockey tactics.
// @author       jrcl
// @match        https://www.managerzone.com/?p=*tactics*
// @icon         https://image.flaticon.com/icons/png/512/147/147215.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452643/Coord%20MZ%20Hockey%20Alt.user.js
// @updateURL https://update.greasyfork.org/scripts/452643/Coord%20MZ%20Hockey%20Alt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var coordsContainerAux = document.getElementById('formation-container');
    var input = '<input id=\"**id**\" type=\"text\" style=\"width: 20px\" value=\"**val**\">';
    var _x = '--';
    var _y = '--';

    if( hasClass(document.getElementById('tactics_box'), 'hockey')) {
        enableActionsOnTabs();
        enableActionForEachLine();
        addEventsToEachPlayer();
        addCoordinates();
        document.addEventListener("keydown", setByKeys);
        document.addEventListener("click", generalClickEvent);
    }

    function addEventsToEachPlayer() {
        var checkExist = setInterval(function() {
            if (document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable').length) {
                var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable');
                for (var i = 0; i < players.length; ++i) {
                    players[i].addEventListener('click', updateCoordsLabel, false);
                    players[i].addEventListener('keydown', updateCoordsLabel, false);
                }
                clearInterval(checkExist);
            }
        }, 1000);
    }

    function updateCoordsLabel(player) {
        getOffsetPos(player.path[1]);
        addCoordinates();
    }

    function getOffsetPos( el ) {
        _y = -(el.offsetTop)+49;
        _x = el.offsetLeft-19;
    }

    function addCoordinates() {
        let coordDisplay = "none";
        if (hasClass(document.getElementById('tttb'), 'ui-state-active')) coordDisplay = "block";
        let coord = document.getElementById('divCoords');
        if(coord) coord.parentElement.removeChild(coord);
        var coordsContainer = document.getElementById('formation-container');
        var divCoords = "<div id=\"divCoords\"><span style=\"font-weight: 600\; display:"+coordDisplay+"\">Player position: **coords**</span></div>";
        insertCoordinates();
        var node = createElementFromHTML(divCoords.replace('**coords**', _x + _y));
        coordsContainer.appendChild(node);
        addEventToCoordinates();
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    function addEventToCoordinates() {
        var inpX = document.getElementById('inputX');
        var inpY = document.getElementById('inputY');
        inpX.addEventListener('keyup', setPlayerPos, false);
        inpY.addEventListener('keyup', setPlayerPos, false);
    }

    function setPlayerPos(input) {
        // Input define c x or y
        var c = input.currentTarget.id === 'inputX' ? 'x' : 'y';
        // get element by input
        let selectedInput = c === 'x' ? document.getElementById('inputX') : document.getElementById('inputY');
        // get selected player
        var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
        if(players.length) {
            let xVal = c === 'x' ? input.currentTarget.value : document.getElementById('inputX').value;
            let yVal = c === 'y' ? input.currentTarget.value : document.getElementById('inputY').value;

            if(isInsideTheInterval(c == 'x' ? xVal : yVal, c)) {
                removeBorder(selectedInput);
                players[0].style.left = (parseInt(xVal) + 19) + "px";
                players[0].style.top = (-parseInt(yVal) + 49) + "px";
            }
            else {
                addBorder(selectedInput);
            }
        }
    }

    function insertCoordinates() {
        var inpX = input.replace('**id**','inputX').replace('**val**', _x);
        var inpY = input.replace('**id**','inputY').replace('**val**', _y);
        _x = '<span style=\"color: green\"> X: </span>' + inpX;
        _y = '<span style=\"color: blue\"> Y: </span>' + inpY;
    }

    function isInsideTheInterval(number, coordinate) {
        if(!isNaN(number)) {
            var integer = parseInt(number);
            if(coordinate == 'x') {
                return integer <= 29 && integer >= -29;
            }
            else if(coordinate == 'y') {
                return integer <= 59 && integer >= -59;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function setByKeys(key) {
        if((key.keyCode === 37 || key.keyCode === 38 || key.keyCode === 39 || key.keyCode === 40)
           && (key.currentTarget.activeElement.localName != 'input')) {
            var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
            if(players.length) {
                _y = -(players[0].offsetTop) + 49;
                _x = players[0].offsetLeft - 19;
            } else {
                _y = '--';
                _x = '--';
            }
            addCoordinates();
        }
    }

    function generalClickEvent(ev) {
        if(ev.currentTarget.activeElement.localName === 'select')  return false;
        var players = document.getElementsByClassName('fieldpos fieldpos-ok ui-draggable ui-selected');
        if(!players.length) {
            _y = '--';
            _x = '--';
            addCoordinates();
        }
    }

    function enableActionsOnTabs() {
        var tabs = document.getElementsByClassName('ui-state-default ui-corner-top');
        let ttta = document.getElementById('ttta');
        let tttb = document.getElementById('tttb');
        ttta.addEventListener('click',reset);
        tttb.addEventListener('click',reset);

        for (var i = 0; i < tabs.length; ++i) {
            tabs[i].addEventListener("click", function() {
                addEventsToEachPlayer();
                enableActionForEachLine();
            });
        }
    }

    function enableActionForEachLine() {
        var altTactics = document.getElementById('formation_select');
        altTactics.addEventListener('change',reset);
    }

    function reset() {
        _y = '--';
        _x = '--';
        addEventsToEachPlayer();
        addCoordinates();
    }

    function addBorder(input) {
        input.style.border = 'solid 4px red';
    }

    function removeBorder(input) {
        input.style.border = null;
    }

    function hasClass(element, className) {
        return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
    }
})();