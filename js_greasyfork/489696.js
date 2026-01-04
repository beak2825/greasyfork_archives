// ==UserScript==
// @name         MZ Axis
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Based on the Murder script, copy and paste options have been added, the coordinate axis has been moved to the center of the field, and now you can see the rival's tactic directly on the field, making it easier to set up a counter-tactic.
// @author       jrcl
// @match        https://www.managerzone.com/?p=tactics*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489696/MZ%20Axis.user.js
// @updateURL https://update.greasyfork.org/scripts/489696/MZ%20Axis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var coordsContainerAux = document.getElementById('formation-container');
    var input = '<input id=\"**id**\" type=\"text\" style=\"width: 20px\" value=\"**val**\">';
    var _x = '--';
    var _y = '--';

    var formation = [];
    var rivalFormation = [];
    var rivalTeam = null;
    const conversionRatesToUSD = {USD: 1,R$: 2.827003,SEK: 7.4234,EUR: 0.80887,GBP: 0.555957,DKK: 6.00978,NOK: 6.921908,CHF: 1.265201,CAD: 1.3003,AUD: 1.309244,ILS: 4.378812,MXN: 10.82507,ARS: 2.807162,BOB: 7.905644,PYG: 5671.047,UYU: 28.88898,RUB: 28.21191,PLN: 3.801452,ISK: 71.15307,BGN: 1.576971,ZAR: 5.999531,THB: 43.46507,SIT: 190.539,SKK: 29.75788,JPY: 123.7233,INR: 43.66706,MZ: 7.4234,MM: 7.4234,点: 7.4234,};

    if(allowed()) {
        var coordsContainer = document.getElementById('formation-container');
        var m = "<div><span style=\"font-weight: 600\">" + allowed() + "</span></div>";
        wrapCoordinates();
        var node = createElementFromHTML(m);
        coordsContainer.appendChild(node);
    }
    else if(isSoccer()) {
        var murder = 'murder';
        var test = window.btoa(murder);
        var test2 = window.atob(test);

        // Add button to paste rival tactic
        var firstSpanOnFContainer = document.getElementById('formation-container').getElementsByTagName("span")[0];
        var toAddRivalBtn = document.createElement('button');
        toAddRivalBtn.innerHTML = "xmlRival";
        toAddRivalBtn.id = "rivalBtn";
        toAddRivalBtn.style.color = "blue";
        firstSpanOnFContainer.appendChild(toAddRivalBtn);
        
        document.getElementById("rivalBtn").onclick = cfgRivalFormation;
        document.getElementById("rivalBtn").onclick = cfgRivalFormation;
        toAddRivalBtn.addEventListener('mouseover', showAdditionalInfoRivalPlayers);


        enableActionsForAllTabs();
        enableActionForAltTactics();
        addEventsToPlayers();
        drawCoordinates();
        document.addEventListener("keydown", setKeys);
        document.addEventListener("click", clickEvent);
    }

    function showAdditionalInfoRivalPlayers() {
        const addInfo = document.getElementsByClassName('additionalInfoRivalPlayer');
        for (var i = addInfo.length - 1; i >= 0; i--) {
            addInfo[i].classList.toggle('hidden');
        }
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
        _y = 101 - (el.offsetTop - 54);
        _x = el.offsetLeft - 97;
    }

    function drawCoordinates() {
        let coord = document.getElementById('divCoords');
        if(coord) {
            coord.parentElement.removeChild(coord);
        }

        var coordsContainer = document.getElementById('formation-container');
        var divCoords = "<div id=\"divCoords\"><span style=\"font-weight: 600\">Player position: **coords**</span>"+
            "&nbsp;<span><button id=\"copyBtn\" onclick=\"copyFormation()\">Copy</button></span>" +
            "&nbsp;<span><button id=\"pasteBtn\" onclick=\"pasteFormation()\">Paste</button></span>" +
            "</div>";
        wrapCoordinates();
        var node = createElementFromHTML(divCoords.replace('**coords**', _x + _y));
        coordsContainer.appendChild(node);
        applyCoordinates();

        document.getElementById("copyBtn").onclick = copyFormation;
        document.getElementById("pasteBtn").onclick = pasteFormation;

    }

    function copyFormation() {
        formation = [];
        var player = document.querySelectorAll('.fieldpos.fieldpos-ok.ui-draggable:not(.substitute):not(.goalkeeper)');
        for (let i = 0; i < player.length; i++) {
            formation.push([Number((player[i].style.left).slice(0,-2)), Number((player[i].style.top).slice(0,-2))]);
        }

        // order by top desc and left asc
        formation = formation.sort(function(a,b) { if (b[1] == a[1]) return a[0] - b[0]; else return b[1] - a[1]; })

        let txtCoord = "";
        for (let coord of formation) {
            txtCoord += (coord[0] - 97) + "," + (155 - coord[1]) + '\n';
        }

        navigator.clipboard.writeText(txtCoord)
            .then(() => {
            console.log('Formation copied to the clipboard');
            alert('Formation copied to the clipboard');
        })
            .catch(err => {
            console.error('Error copying to the clipboard:', err);
        })
        console.log(txtCoord);
    }

    function pasteFormation() {
        navigator.clipboard.readText()
          .then(text => {
            console.log('Clipboard text:', text)
            // is xml content?
            if (text.search("xml") != -1) {
                // parse clipboard to xml file
                console.log('Cartesian coordinate system from XML file');
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(text,"text/xml");
                
                formation = [];
                let pos = xmlDoc.getElementsByTagName("Pos")
                for (var i = 1; i < pos.length; i++) {
                    formation.push([Number(pos[i].getAttribute("x")) - 7, Number(pos[i].getAttribute("y")) - 9]);
                }

                formation = formation.sort(function(a,b) { if (b[1] == a[1]) return a[0] - b[0]; else return b[1] - a[1]; })
                setFormation();
            } else if (text.trim().split('\n').length == 10) { // is there 10 coord?
                console.log('Cartesian coordinate system from Clipboard');
                let coorXY = text.trim().split('\n')

                formation = [];
                for (let pair of coorXY) {
                    let [xAxis,yAxis] = pair.split(',');
                    formation.push([Number(xAxis) + 97, 155 - Number(yAxis)]);
                }

                formation = formation.sort(function(a,b) { if (b[1] == a[1]) return a[0] - b[0]; else return b[1] - a[1]; })
                setFormation();
            } else if (formation.length == 10) {
                console.log('Cartesian coordinate system from internal var');
                setFormation();
            } else {
                console.log("Nothing to do");
            }


          })
          .catch(err => {
            console.error('Error reading from the clipboard:', err)
          })
    }

    function setFormation() {
        let player = document.querySelectorAll('.fieldpos.fieldpos-ok.ui-draggable:not(.substitute):not(.goalkeeper)');

        if (formation.length == player.length) {
            // get an order
            let oldFormation = [];
            for (let i = 0; i < player.length; i++) {
                oldFormation.push([Number((player[i].style.left).slice(0,-2)), Number((player[i].style.top).slice(0,-2)), i]);
            }

            oldFormation = oldFormation.sort(function(a,b) { if (b[1] == a[1]) return a[0] - b[0]; else return b[1] - a[1]; })

            for (let i = 0; i < formation.length; i++) {
                player[oldFormation[i][2]].style.left = formation[i][0] + 'px';
                player[oldFormation[i][2]].style.top = formation[i][1] + 'px';
            }
            alert('Formation successfully copied');
            formation = []; // empty formation
        }
    }

    function cfgRivalFormation() {
        let elBoton = document.getElementById('rivalBtn');

        if(elBoton.innerHTML == "xmlRival") {
            pasteRivalFormation();
        } else {
            elBoton.style.color = "blue";
            elBoton.innerHTML = "xmlRival";

            let rivalPlayers = document.getElementById('rivalPlayers');
            if(rivalPlayers) {
                rivalPlayers.parentElement.removeChild(rivalPlayers);
            }

            navigator.clipboard.writeText('')
            .then(() => {
                console.log('Clipboard Clear');
            })
            .catch(err => {
                console.error('Error clearing the clipboard:', err);
            })
        }
    }

    function pasteRivalFormation(){
        navigator.clipboard.readText()
          .then(text => {
            // is xml content?
            if (text.search("xml") != -1) {
                console.log('Clipboard text:', text)
                // parse clipboard to xml file
                console.log('Cartesian coordinate system from XML file');
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(text,"text/xml");
                
                rivalFormation = [];
                let pos = xmlDoc.getElementsByTagName("Pos")

                // x, y, shirtno, value, height, weight, age, countryShortname
                for (var i = 0; i < pos.length; i++) {
                    rivalFormation.push([Number(pos[i].getAttribute("x")) - 7, Number(pos[i].getAttribute("y")) - 9, '9', '', '', '', '', '' ]);
                }
                
                rivalFormation = rivalFormation.sort(function(a,b) { if (b[1] == a[1]) return a[0] - b[0]; else return b[1] - a[1]; })

                rivalTeam = xmlDoc.querySelector("Team");
                rivalTeam.setAttribute("tactic", rivalTeam.getAttribute('tactics'));
                setRivalFormation();

            } else if (text != null && text != "") {
                // is valid id number
                
                let matchId = prompt("Please enter your Match ID [mid]:", (text.trim().length < 14 && !isNaN(text.trim()))? text.trim():"No IDea");

                if (matchId == null) {
                  console.log("User cancel this");  
                } else if(matchId == "" || matchId == "No IDea" || matchId.length < 5 || matchId.length > 14 || isNaN(matchId.trim()) ) {
                  console.log("User dont have any idea about this or not valid match id");
                } else {
                    matchId = matchId.trim();
                    console.log(`Your matchId is:${matchId}`);
                    getDataFromXML(matchId);
                }
            } else if (rivalFormation.length > 0) {
                console.log('Formation from system on internal var');
                setRivalFormation();
            } else {
                console.log("Nothing to do");
            }

          })
          .catch(err => {
            console.error('Error reading from the clipboard:', err)
          })
    }

    function getDataFromXML(matchId) {
        let statsUrl = `http://download06.managerzone.com/data/soccer/${matchId.slice(-1)}/${matchId.charAt(matchId.length-2)}/stats${matchId}.xml.gz`;
        GM_xmlhttpRequest({
            method: 'GET',
            // url: 'http://download06.managerzone.com/data/soccer/7/1/stats1486585817.xml.gz',
            url: statsUrl,
            responseType: 'arraybuffer',  // We want to handle the binary data (arraybuffer)
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        // Decompress the .gz file using pako
                        const decompressed = pako.ungzip(new Uint8Array(response.response), { to: 'string' });

                        // Parse the XML data
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(decompressed, 'text/xml');

                        let teams = xmlDoc.documentElement.getElementsByTagName("Team");

                        let ishome = 0;
                        if (confirm(`Press [ OK ] if your rival is:\t${teams[0].getAttribute('name')}\nPress [ Cancel ] if your rival is:\t${teams[1].getAttribute('name')}`)) {
                          ishome = 1;
                        } else {
                          ishome = 0;
                        }

                        rivalTeam = ishome ? teams[0] : teams[1];
                        console.log(rivalTeam.getAttribute('name'));

                        rivalFormation = [];
                        // x, y, shirtno, value, height, weight, age, countryShortname
                        let players = xmlDoc.querySelectorAll(`Player[teamId="${rivalTeam.getAttribute('id')}"][origin*=","]`);
                        for (let i = 0; i < players.length; i++) {
                            let origin = players[i].getAttribute('origin');
                            let xy = origin.split(",");
                            rivalFormation.push([StatsToPos_X(xy[0], ishome) - 7, StatsToPos_Y(xy[1], ishome) - 9, players[i].getAttribute('shirtno'), '', '', '', '', '' ]);
                        }

                        // Additional Data
                        let squadTeamUrl = `http://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${rivalTeam.getAttribute('id')}`
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: squadTeamUrl,
                            onload: function(response) {
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                                let teamPlayers = xmlDoc.querySelector('TeamPlayers');
                                for (var i = 0; i < players.length; i++) {
                                    let player = xmlDoc.querySelector(`Player[id="${players[i].getAttribute('id')}"]`);
                                    if (player) {
                                        let value = Number(player.getAttribute('value')) / (conversionRatesToUSD[teamPlayers.getAttribute('teamCurrency')] || 1)
                                        rivalFormation[i][3] = '' + value.toFixed(0);
                                        //player.getAttribute('value').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                                        rivalFormation[i][4] = player.getAttribute('height');
                                        rivalFormation[i][5] = player.getAttribute('weight');
                                        rivalFormation[i][6] = player.getAttribute('age');
                                        rivalFormation[i][7] = player.getAttribute('countryShortname');
                                    }
                                }
                                setRivalFormation();
                            },
                            onerror: function(error) {
                                console.log('Error:', error);
                            }
                        });

                        
                    } catch (error) {
                        console.error('Error decompressing or parsing XML:', error);
                    }
                } else {
                    console.error('Failed to fetch the file:', response.statusText);
                    alert('The match has probably not been viewed in 2D yet, therefore we cannot obtain the statistics, or try again later.');
                }
            },
            onerror: function(error) {
                console.error('Error with GM_xmlhttpRequest:', error);
            }
        });
    }

    function StatsToPos_X (i, isHome) {
        let ret = isHome ? Math.round(-.255800462 * i + 199.8228530689) : Math.round(.2555000556 * i + 8.3741302936);
        return ret;
    }

    function StatsToPos_Y (i, isHome) {
        let ret = isHome ? Math.round(-.3073207154 * i + 315.9278777381) : Math.round(.3070644902 * i + 9.2794889414);
        return ret;
    }


    function setRivalFormation () {
        let rivalPlayers = document.createElement('div');
        rivalPlayers.id = "rivalPlayers";
        let formationText = document.getElementById('formation_text');
        formationText.parentNode.insertBefore(rivalPlayers, formationText.nextSibling);
        console.log('players on the pitch');

        let contentRival = '';
        if (rivalTeam.hasAttribute("name")) {
            contentRival += `<div style="position:absolute; left: 1px; top: 3px; width: 215px;">`+
                            `<div style="display: flex; justify-content: space-between; font-size:0.7em; color:black"><div style="display: flex; flex-direction: column; justify-content: space-around; max-width: 90px; text-align: center;"><span>${rivalTeam.getAttribute('name')}</span><span><img src="https://www.managerzone.com/nocache-910/img/flags/64/${rivalTeam.getAttribute('country').toLowerCase()}.png" width="14" alt=""></span></div>` +
                            `<span><img src="https://www.managerzone.com/dynimg/badge.php?team_id=${rivalTeam.getAttribute('id')}" width="25" alt=""></span></div></div>`;
        }

        contentRival += `<div style="position:absolute; left: 1px; top: 44px; width: 215px">` +
                        `<div style="display: flex; justify-content: space-around; font-size:0.7em;"><span>${rivalTeam.getAttribute('tactic')}</span><span>${rivalTeam.getAttribute('playstyle')}</span><span>${rivalTeam.getAttribute('aggression')}</span></div></div>`;

        for (var i = 0; i < rivalFormation.length; i++) {
            contentRival += "<div style=\"position:absolute; left: " + (194 - rivalFormation[i][0]) + "px; top: " + (310 - rivalFormation[i][1]) + "px;\">" +
                    "<div style=\"border-radius: 50%; width: 18px; height: 18px; border: 2px solid #FFE42B; color: black; display: flex; align-items: center; justify-content: center; font-size:0.9em;  font-weight: bold;\">"+rivalFormation[i][2]+"</div>" +
                    "<div style=\"position:absolute; top: -6px; width:22px; display: flex; justify-content: space-between; font-size:0.45em; color:black\"><span>" + (rivalFormation[i][0] - 97) + "</span><span>" + (155 - rivalFormation[i][1]) + "</span></div>" +
                    `<div class="additionalInfoRivalPlayer hidden"><div style="position: absolute; white-space: nowrap; font-size:0.45em; writing-mode: vertical-rl; text-align: right; color:black; left: 22px; top: -6px; height:37px"><span>${rivalFormation[i][3]?rivalFormation[i][3].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')+" USD":''}</span></div>` +
                    `<div style="display: flex; justify-content: space-between; font-size:0.3em; color:black"><span>${rivalFormation[i][4]?rivalFormation[i][4]+" cm":''}</span><span>${rivalFormation[i][6]?rivalFormation[i][6]+" y":''}</span></div>` +
                    `<div style="display: flex; justify-content: space-between; font-size:0.3em; color:black"><span>${rivalFormation[i][5]?rivalFormation[i][5]+" kg":''}</span><span>${rivalFormation[i][7]?`<img src="https://www.managerzone.com/nocache-910/img/flags/s_${rivalFormation[i][7]}.gif" width="7" alt="">`:''}</span></div></div></div>`;
        }

        rivalPlayers.innerHTML = contentRival;

        let elBoton = document.getElementById('rivalBtn');
        elBoton.style.color = '#FF4500';
        elBoton.innerHTML = "clearRival";
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
                players[0].style.left = (parseInt(xVal) + 97) + "px";
                players[0].style.top = (101 - parseInt(yVal) + 54) + "px";
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
                playerCollision[0].style.left = (parseInt(xVal) + 97) + "px";
                playerCollision[0].style.top = (101 - parseInt(yVal) + 54) + "px";
            }
            else {
                addBorder(selectedInput);
            }
        }
    }

    function wrapCoordinates() {
        var inpX = input.replace('**id**','inputX').replace('**val**', _x);
        var inpY = input.replace('**id**','inputY').replace('**val**', _y);
        _x = '<span style=\"color: green\"> X: </span>' + inpX;
        _y = '<span style=\"color: blue\"> Y: </span>' + inpY;
    }

    function isInRange(number, coordinate) {
        if(!isNaN(number)) {
            var integer = parseInt(number);
            if(coordinate == 'x') {
                return integer <= 96 && integer >= -96;
            }
            else if(coordinate == 'y') {
                return integer <= 101 && integer >= -157;
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
                _y = 101 - (players[0].offsetTop - 54);
                _x = players[0].offsetLeft - 97;
            }
            else if (playerCollision.length) {
                _y = 101 - (playerCollision[0].offsetTop - 54);
                _x = playerCollision[0].offsetLeft - 97;
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
        input.style.border = 'solid 4px red';
    }
    function allowed(){let G=!1,b=[{u:"ZGllZ29jYXBhbm8=",m:"VXN0ZWQgbm8gdGllbmUgcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgZGFkbyBxdWUgcG9zZWUgbeFzIGRlIHVuYSBjdWVudGEu"},{u:"bWF4d2VsbHNtYXJ0ODE=",m:"RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIGRlbWFzaWFkbyB0cmFtcG9zbyBwYXJhIHVzYXIgZXN0YSBoZXJyYW1pZW50YS4="},{u:"bHVra2s0MQ==",m:"VXN0ZWQgZXMgdW4gdHJhbXBvc28geSBubyB0aWVuZSBwZXJtaXRpZG8gdXNhciBsYSBoZXJyYW1pZW50YS4="},{u:"ZGFya2xpbmU=",m:"RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIHVuIHBlbG90dWRvIHkgbm8gdGllbmUgcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEu"},{u:"a2luZXNpbzEw",m:"TG9zIHBlbG90dWRvcyBjb21vIHZvcyBubyB0aWVuZW4gcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgcG9yIGhhYmVyIGFycnVpbmFkbyBlbCBmb3JvLg=="},{u:"bXVyZGVy",m:"TG9zIHBlbG90dWRvcyBjb21vIHZvcyBubyB0aWVuZW4gcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgcG9yIGhhYmVyIGFycnVpbmFkbyBlbCBmb3JvLg=="}],V=document.getElementById("header-username").textContent;for(var g=0;g<b.length;++g)window.atob(b[g].u)===V&&(G=window.atob(b[g].m));return G}
    function removeBorder(input) {
        input.style.border = null;
    }

    function isSoccer() {
        let response = false;
        let sport = document.getElementById('tactics_box');
        for(var i = 0; i < sport.classList.length; ++i) {
            if(sport.classList[i] == 'soccer') {
                response = true;
            }
        }
        return response;
    }

})();
