// ==UserScript==
// @name         AWBW Colourblind support
// @namespace    https://awbw.amarriner.com/
// @version      1.06
// @description  Swap player colours to Orange Star and Blue Moon, or click a player's nation logo to assign a different colour to them.
// @author       Truniht
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450135/AWBW%20Colourblind%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/450135/AWBW%20Colourblind%20support.meta.js
// ==/UserScript==

(function() {
    //Nation to assign to players
    var nationAssign = [
        "os",
        "bm",
        "ge",
        "bh",
        "pl",
        "tg"
    ];

    var nationAssignSwapped = [
        "bm",
        "os",
        "bh",
        "ge",
        "tg",
        "pl"
    ];

    //Nation information
    var nations = {
        "os": {id: "os", name:'Orange Star', building: '/orangestar', moved: '/gs_os', unit: '/os', playerColour: 'linear-gradient(to right, rgb(255, 79, 78), rgb(146, 50, 67))'},
        "bm": {id: "bm", name:'Blue Moon', building: '/bluemoon', moved: '/gs_bm', unit: '/bm', playerColour: 'linear-gradient(to right, rgb(148, 162, 253), rgb(70,110,254))'},
        "ge": {id: "ge", name:'Green Earth', building: '/greenearth', moved: '/gs_ge', unit: '/ge', playerColour: 'linear-gradient(to right, rgb(135, 226, 135), rgb(61, 194, 45))'},
        "yc": {id: "yc", name:'Yellow Comet', building: '/yellowcomet', moved: '/gs_yc', unit: '/yc', playerColour: 'linear-gradient(to right, rgb(240, 210, 4), rgb(201, 189, 2))'},
        "bh": {id: "bh", name:'Black Hole', building: '/blackhole', moved: '/gs_bh', unit: '/bh', playerColour: 'linear-gradient(to right, rgb(187, 180, 165), rgb(116, 89, 138))'},
        "rf": {id: "rf", name:'Red Fire', building: '/redfire', moved: '/gs_rf', unit: '/rf', playerColour: 'linear-gradient(to right, rgb(194, 113, 132), rgb(181, 39, 68))'},
        "gs": {id: "gs", name:'Grey Sky', building: '/greysky', moved: '/gs_gs', unit: '/gs', playerColour: 'linear-gradient(to right, rgb(151, 151, 151), rgb(114, 114, 114))'},
        "bd": {id: "bd", name:'Brown Desert', building: '/browndesert', moved: '/gs_bd', unit: '/bd', playerColour: 'linear-gradient(to right, rgb(173, 126, 95), rgb(152, 83, 51))'},
        "ab": {id: "ab", name:'Amber Blaze', building: '/amberblaze', moved: '/gs_ab', unit: '/ab', playerColour: 'linear-gradient(to right, rgb(254, 192, 120), rgb(252, 163, 57))'},
        "js": {id: "js", name:'Jade Sun', building: '/jadesun', moved: '/gs_js', unit: '/js', playerColour: 'linear-gradient(to right, rgb(196, 215, 180), rgb(166, 182, 153))'},
        "ci": {id: "ci", name:'Cobalt Ice', building: '/cobaltice', moved: '/gs_ci', unit: '/ci', playerColour: 'linear-gradient(to right, rgb(35, 66, 186), rgb(11, 32, 112))'},
        "pc": {id: "pc", name:'Pink Cosmos', building: '/pinkcosmos', moved: '/gs_pc', unit: '/pc', playerColour: 'linear-gradient(to right, rgb(255, 153, 204), rgb(255, 102, 204))'},
        "tg": {id: "tg", name:'Teal Galaxy', building: '/tealgalaxy', moved: '/gs_tg', unit: '/tg', playerColour: 'linear-gradient(to right, rgb(108, 217, 208), rgb(60, 205, 193))'},
        "pl": {id: "pl", name:'Purple Lightning', building: '/purplelightning', moved: '/gs_pl', unit: '/pl', playerColour: 'linear-gradient(to right, rgb(164, 71, 211), rgb(111, 26, 155))'},
        "ar": {id: "ar", name:'Acid Rain', building: '/acidrain', moved: '/gs_ar', unit: '/ar', playerColour: 'linear-gradient(to right, rgb(122, 157, 17), rgb(97, 124, 14))'},
        "wn": {id: "wn", name:'White Nova', building: '/whitenova', moved: '/gs_wn', unit: '/wn', playerColour: 'linear-gradient(to right, rgb(212, 191, 159), rgb(205, 155, 154))'}
    };

    var buildingReplaceMatch = ['building'];
    var unitReplaceMatch = ['moved', 'unit'];

    //Fetch settings
    var gameID = window.location.href.match(/_id=([0-9]+)/)[1];
    var settings = GM_getValue('AWBWcbSettings' + gameID);
    if (!settings) {
        //Load legacy settings
        settings = {
            enabled: GM_getValue('AWBWenableColourBlind' + gameID) || 0,
            swap: GM_getValue('AWBWreverseColours' + gameID) || 0
        };
    }

    var documentImages = document.getElementsByTagName('img');

    //Have to use a function to get the local variable as it can't be accessed directly
    unsafeWindow.AWBWColourBlindReturnPlayers = function () {return playersInfo;}

    var loadedImages = {};
    var loadingImages = {};

    function loadImage(img, imageSource) {
        //Preload the new image and set it on load
        var newImage = loadingImages[imageSource];
        var setSource = !newImage;
        if (!newImage) newImage = loadingImages[imageSource] = new Image();

        newImage.addEventListener('load', function() {
            loadedImages[imageSource] = true;
            if (img.matchedAndChanged === imageSource) applyStyles(img);
        });

        if (setSource) newImage.src = imageSource;
    }

    function applyStyles(img) {
        img.parentNode.style.background = 'top center no-repeat url('+img.matchedAndChanged+')';
        img.parentNode.style.transform = img.style.transform;
        img.style.opacity = '0';
        img.appliedStyle = img.parentNode.style.background;
    }

    function saveSettings() {
        GM_setValue('AWBWcbSettings' + gameID, settings);
    }

    function removeColourSelect() {
        var oldEle = document.getElementById('AWBWColourBlindselectPlayerColour');
        if (oldEle) oldEle.parentNode.removeChild(oldEle);
    }

    function swapPlayerColour(playerID, playerNationID, mouseOver) {
        if (!mouseOver) removeColourSelect();

        if (!settings.players) settings.players = {};
        if (!playerNationID) delete settings.players[playerID];
        else settings.players[playerID] = playerNationID;

        var emptyPlayers = true;
        for(var i in settings.players) {
            emptyPlayers = false;
            break;
        }
        if (emptyPlayers) {
            delete settings.players;
        }
        else {
            settings.enabled = 1;
            checkBoxDiv.children[0].checked = true;
        }

        if (!mouseOver) saveSettings();
        swapColours(true);
    }
    unsafeWindow.AWBWColourBlindswapPlayerColour = swapPlayerColour;

    function selectMouseover() {
        AWBWColourBlindswapPlayerColour(this.dataPlayerID, this.nationID, true);
    }

    function selectPlayerColour() {
        removeColourSelect();

        var mainEle = document.createElement('div');

        var playerC = settings.players || {};

        for(var nationID in nations) {
            var nation = nations[nationID];
            ele = document.createElement('a');
            ele.innerHTML = '<img style="vertical-align: text-top;" src="terrain/aw2/'+nation.id+'logo.gif"> '+nation.name;
            ele.href = "javascript: AWBWColourBlindswapPlayerColour('"+this.dataPlayerID+"', '"+nation.id+"');";
            ele.style = "display: block; font-weight: bold; color: #FFFFFF; text-shadow: 1px 1px 2px black; padding: 6px; background: " + nation.playerColour + ";" +
                (playerC[this.dataPlayerID] === nation.id ? 'border: 3px #FFFFFF solid; padding: 3px;': '');
            ele.onmouseover = selectMouseover;
            ele.dataPlayerID = this.dataPlayerID;
            ele.nationID = nation.id;
            mainEle.appendChild(ele);
        }

        var ele = document.createElement('a');
        ele.innerHTML = '<img style="vertical-align: text-top;" src="'+(this.origSrc || this.src)+'"> Default / cancel';
        ele.href = "javascript: AWBWColourBlindswapPlayerColour('"+this.dataPlayerID+"');";
        ele.style = "display: block; font-weight: bold; color: #000000; background: #BBBBBB; padding: 6px; border: 1px #BBBBBB solid;";
        ele.onmouseover = selectMouseover;
        ele.dataPlayerID = this.dataPlayerID;
        ele.nationID = null;
        mainEle.appendChild(ele);

        var elePos = this.getBoundingClientRect();
        mainEle.style = "white-space: nowrap; position: absolute; border: 1px solid #000000; padding: 0px; display: block;"+
            "left: "+ (elePos.left + window.scrollX) + "px; top: "+(elePos.top + window.scrollY)+"px;";
        mainEle.id = "AWBWColourBlindselectPlayerColour";
        document.body.appendChild(mainEle);
    }

    var swapInProgress = false;
    function swapColours(force) {
        if (swapInProgress) return;
        if (!force && !settings.enabled) return;

        swapInProgress = true;
        try {
            var players = unsafeWindow.AWBWColourBlindReturnPlayers();
            var matchList = [];
            var newTeams = settings.swap ? nationAssignSwapped : nationAssign;
            for(var playerID in players) {
                var player = players[playerID];
                var newTeam = settings.players ? nations[settings.players[playerID]] : nations[newTeams[matchList.length]];

                if (document.getElementById('player'+playerID)) {
                    //Update the header colour
                    var playerHeader = document.getElementById('player'+playerID).querySelector('header');
                    if (playerHeader) {
                        if (!playerHeader.origCol) playerHeader.origCol = playerHeader.style.background;
                        playerHeader.style.background = settings.enabled && newTeam ? newTeam.playerColour : playerHeader.origCol;
                        var teamImg = playerHeader.querySelector('.player-country-logo');
                        if (!teamImg.origSrc) teamImg.origSrc = teamImg.newSrc = teamImg.src;
                        teamImg.style.cursor = 'pointer';
                        teamImg.dataPlayerID = playerID;
                        teamImg.onclick = selectPlayerColour;
                        var newSrc = settings.enabled && newTeam ? 'terrain/aw2/'+newTeam.id+'logo.gif' : teamImg.origSrc;
                        if (teamImg.newSrc != newSrc) teamImg.src = teamImg.newSrc = newSrc;
                    }
                }

                if (newTeam) {
                    matchList.push({
                        newNation: newTeam,
                        building: '/' + player.countries_name.replaceAll(' ', '').toLowerCase(), //Cities
                        moved: '/gs_' + player.countries_code, //Moved units
                        unit: '/' + player.countries_code //Units
                    });
                }
            }

            for(var img of documentImages) {
                if (img.dataLastSource !== img.src || force) {
                    img.dataLastSource = img.src;

                    var building = img.parentNode.classList.contains('game-building') || ( img.parentNode.id && img.parentNode.id.indexOf('building') !== -1);
                    var unit = !building && (img.parentNode.classList.contains('game-unit') || ( img.parentNode.id && img.parentNode.id.indexOf('unit') !== -1));
                    if (!unit && !building) continue;

                    var matched = false;
                    if (settings.enabled) {
                        var matchTypes = building ? buildingReplaceMatch : unitReplaceMatch;
                        for(var type of matchTypes) {
                            for(var i = 0; i < matchList.length; i++) {
                                var nation = matchList[i];
                                if (img.src.indexOf(nation[type]) !== -1) {
                                    var imageSource = img.src.replaceAll(nation[type], nation.newNation[type]);
                                    img.matchedAndChanged = imageSource;
                                    matched = true;

                                    if (loadedImages[imageSource]) {
                                        //Image is already loaded, set it
                                        applyStyles(img);
                                    }
                                    else {
                                        //Image has to be loaded first
                                        loadImage(img, imageSource);
                                    }
                                    break;
                                }
                            }
                            if (matched) break;
                        }
                    }

                    if (!matched && img.matchedAndChanged) {
                        //Reverse style changes to an element no longer matching
                        img.style.opacity = '';
                        img.parentNode.style.background = '';
                        img.parentNode.style.transform = '';
                        img.matchedAndChanged = false;
                        img.appliedStyle = false;
                    }
                }

                //Applied style is different for some unknown reason, reapply
                else if (img.matchedAndChanged && img.appliedStyle && img.appliedStyle !== img.parentNode.style.background) {
                    img.parentNode.style.background = img.appliedStyle;
                    img.parentNode.style.transform = img.style.transform;
                    img.style.opacity = '0';
                }
            }
        } catch (e) {}
        swapInProgress = false;
    }

    var checkBoxDiv = document.createElement('div');
    checkBoxDiv.style = 'position: absolute; top: 10px; left: 10px; z-index: 9999;';
    checkBoxDiv.innerHTML = 'Colourblind mode: '+
        '<input type="checkbox" name="colourBlindMode" '+( settings.enabled ? 'checked' : '') + '/>'+
        ', Swap sides: '+
        '<input type="checkbox" name="reverseColours" '+( settings.swap ? 'checked' : '') + '/>';
    document.body.appendChild(checkBoxDiv);

    checkBoxDiv.children[0].oninput = function() {
        settings.enabled = checkBoxDiv.children[0].checked ? 1 : 0;
        saveSettings();
        swapColours(true);
    }

    checkBoxDiv.children[1].oninput = function() {
        settings.swap = checkBoxDiv.children[1].checked ? 1 : 0;
        saveSettings();
        swapColours(true);
    }

    const observer = new MutationObserver(function() {swapColours();});
    observer.observe(document, { childList: true, subtree: true, attributes: true });

    //Run once on load to make nation icons clickable
    window.addEventListener('load', function() {swapColours(true);});
})();