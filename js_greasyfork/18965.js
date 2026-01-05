// ==UserScript==
// @name         Slither.io - 607ch00 remix
// @namespace    slitherio.remix.607ch00
// @version      0.6.9.19
// @description  slither.io MOD - 2021 Update! - Zoom, High score, Custom backgrounds, Clock, and more!
// @author       607ch00
// @match        http://slither.io/
// @noframes
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18965/Slitherio%20-%20607ch00%20remix.user.js
// @updateURL https://update.greasyfork.org/scripts/18965/Slitherio%20-%20607ch00%20remix.meta.js
// ==/UserScript==
/*jshint multistr: true */

/**
 * newSnake()
 * newFood()
 * newPrey()
 * ws.onmessage()
 */

var modVersion = 'v0.6.9.19', //used in menu box
    graphicsMode = '4', //4 - customized high quality 3 - high quality, 2 - simple optimized, 1 - simple (mobile)
    graphicsModeChanged = true, //flag to indicate graphics mode has changed
    statsContainer = null, //reference to stats container
    fpsContainer = null, //reference to fps div
    xferContainer = null, //refernce to current transfer rate div
    zoomContainer = null, //reference to zoom div
    positionContainer = null, //reference to coordinates div
    ipContainer = null, //reference to current/last connected server div
    highscoreContainer = null, //reference to high score display
    clockContainer = null, //reference to clock container
    backgroundImage = -1, //store the user selected background image
    randomizeBackground = false, //indicate whether or not to randomize background
    originalBackground = null, //store the game's default background image
    originalBackgroundCanvas = null, //store the game's default background canvas object
    backgroundImageChanged = true, //indicate if background image needs to be set
    clearedGlow = false, //store whether glow was attempted to be cleared
    highScore = 0, //store the user's current high score
    currentIP = null, //store the current connected server ip
    selectedServer = -1, //store the user selected server ip
    selectedSkinOption = -1, //Store skin option
    selectedSkin = null, //Store skin number
    manualServer = false, //store user manual server entry
    connectButtonOverride = false, //store whether the connect button click listener was overridden
    connectButton = null,  //reference to the connect button
    retry = 0 //hold the current number of connection retries
    customZoom = false,
    currentZoom = unsafeWindow.gsc; //hold the zoom level we should be at based on mousewheel

// allow context menu
unsafeWindow.oncontextmenu = function() {
    return true;
}

/**
 * Init script
 */
var init = function() {
    removeIframes();
    createCSS();
    stopLogoAnimation();
    createHTML();
    createListeners();
    setupMenu();
    customConnectButton();
    setupGraphics();
    updateLoop();
    showFPS();
    fixedZoom();
}

var removeIframes = function() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
        iframes[i].parentNode.removeChild(iframes[i]);
    }
}

/**
 * Create stylesheet in head
 */
var createCSS = function() {
    var styleElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.type = 'text/css';

    var cssString = ' \
        body { \
            background-color: #000!important; \
            overflow-x:hidden; \
        } \
        #nbg { \
            display:none; \
            visibility:hidden; \
        } \
        #clq { \
            bottom:0!important; \
            height:auto!important; \
        } \
        #grqh { \
            top: auto!important; \
            right: auto!important; \
            bottom: 20px; \
            left: 150px; \
        } \
        #login { \
            /* margin-top:0!important; */ \
            position:relative!important; \
            width:auto!important; \
            height:auto!important; \
        } \
        #logo { \
            /* margin-top:30px!important; */ \
        } \
        #stats-container { \
            position:fixed; \
            right: 30px; \
            bottom: 120px; \
            opacity: 0.35; \
            z-index: 7; \
            color: #FFF; \
            font: 14px Arial, Helvetica Neue, Helvetica, sans-serif; \
            text-align: right; \
        } \
        #custom-menu-container { \
            width:260px; \
            color:#8058D0; \
            background-color:#1E262E; \
            border-radius:29px; \
            font: 14px Lucida Sans Unicode, Lucida Grande, sans-serif; \
            text-align:center; \
            margin: 20px auto 0; \
            padding:10px 14px; \
        } \
        .custom-select-container { \
            background-color:#A5A5A5; \
            border-radius:10px; \
            margin:5px auto; \
            padding:5px 0; \
        } \
        .custom-select-container select { \
            width:100%; \
            background:none; \
            border:none; \
            outline:none; \
        } \
        #server-manual-input { \
            width: 100%; \
            display:none; \
            margin: 3px auto; \
            width: 98%; \
            background-color: #4C447C; \
            border: 1px solid #1E262E; \
            color: #e0e0ff; \
            border-radius: 3px; \
            padding: 3px 3px; \
        } \
        #hotkey-help { \
            margin:0; \
            padding:0; \
            display:flex; \
            flex-wrap:wrap; \
        } \
        #hotkey-help li { \
            display:inline; \
            white-space:nowrap; \
            flex-grow:1; \
        } \
        #clock-container { \
            font-weight:900; \
            font: 14px Courier New, Courier, monospace; \
        } \
        #ingame-score { \
            left: 50%!important; \
            bottom: auto!important; \
            top: 0px!important; \
            transform: translate(-50%, 0)!important;\
            text-align: center!important; \
            font-size: 18px!important; \
            height: 50px!important; \
            line-height: 120%!important; \
            width:100%!important; \
        } \
        #ingame-score span:first-child { \
            font-size: 24px!important; \
        } \
        .nsi { \
            transition:none!important; \
        } \
    ';

    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssString;
    } else {
        styleElement.appendChild(document.createTextNode(cssString));
    }
}

/**
 * Prevent laggy logo animation
 */
var stopLogoAnimation = function() {
    if (typeof unsafeWindow.showlogo_iv !== 'undefined') {
    // if (unsafeWindow.hasOwnProperty('showlogo_iv')) {
        unsafeWindow.ncka = unsafeWindow.lgss = unsafeWindow.lga = 1;
        clearInterval(unsafeWindow.showlogo_iv);
        unsafeWindow.showLogo(true);
    } else {
        setTimeout(stopLogoAnimation, 25);
    }
}

var createHTML = function() {
    // unsafeWindow.smh.innerHTML = '';

    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    statsContainer.innerHTML = ' \
        <div id="fps-container"></div> \
        <div id="xfer-container"></div> \
        <div id="zoom-container"></div> \
        <div id="position-container"></div> \
        <div id="ip-container"></div> \
        <div id="highscore-container"></div> \
        <div id="clock-container"></div> \
    ';
    document.body.appendChild(statsContainer);

    fpsContainer = document.getElementById('fps-container');
    xferContainer = document.getElementById('xfer-container');
    zoomContainer = document.getElementById('zoom-container');
    positionContainer = document.getElementById('position-container');
    ipContainer = document.getElementById('ip-container');
    highscoreContainer = document.getElementById('highscore-container');
    clockContainer = document.getElementById('clock-container');
}

var createListeners = function() {
    // Add zoom
    if (/firefox/i.test(navigator.userAgent)) {
        document.addEventListener('DOMMouseScroll', zoom, false);
    } else {
        document.body.onmousewheel = zoom;
    }

    //Setup keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            //Toggle stats (tab)
            case 9:
                e.preventDefault();
                toggleStats();
                break;
            //Respawn (escape)
            case 27:
                disconnect(false);
                customConnect();
                break;
            //Disconnect (q)
            case 81:
                disconnect(true);
                break;
            //Reset zoom (~ tilde)
            case 192:
                resetZoom();
                break;
        }
    }, false);
}

/**
 * Toggle display of stats window
 */
var toggleStats = function() {
    if (statsContainer.style.display == 'none') {
        statsContainer.style.display = 'block';
    } else {
        statsContainer.style.display = 'none';
    }
}

/**
 * Calculate zoom from mousewheel
 */
var zoom = function(e) {
    if (!unsafeWindow.gsc || !unsafeWindow.playing) {
        return;
    }

    customZoom = true;
    currentZoom *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
    unsafeWindow.gsc = currentZoom;
    zoomContainer.textContent = 'Zoom: ' + unsafeWindow.gsc.toFixed(2);

    // q.gcv = Math.floor(b.ic * gsc * (.25 + .75 * q.sz / 16.5));
    // console.log(unsafeWindow.foods);
    // for (var food in unsafeWindow.foods) {
        // console.log(unsafeWindow.foods[food]);
        // unsafeWindow.foods[food].cv2 = Math.floor(unsafeWindow.foods[food].id.ic * unsafeWindow.gsc *  unsafeWindow.foods[food].sz / 16.5);
        // unsafeWindow.foods[food].gcv = Math.floor(unsafeWindow.foods[food].id.ic * unsafeWindow.gsc * (.25 + .75 * unsafeWindow.foods[food].sz / 16.5));
        // unsafeWindow.foods[food].g2cv = Math.floor(unsafeWindow.foods[food].id.ic * unsafeWindow.gsc * (.25 + .75 * unsafeWindow.foods[food].sz / 16.5));

        // unsafeWindow.foods[food].cv2 = Math.floor(unsafeWindow.foods[food].id.ic * unsafeWindow.foods[food].sz / 16.5);
        // unsafeWindow.foods[food].gcv = Math.floor(unsafeWindow.foods[food].id.ic * (.25 + .75 * unsafeWindow.foods[food].sz / 16.5));
        // unsafeWindow.foods[food].g2cv = Math.floor(unsafeWindow.foods[food].id.ic * (.25 + .75 * unsafeWindow.foods[food].sz / 16.5));
        // unsafeWindow.foods[food].gfi =
        // unsafeWindow.foods[food].cv = 1;
        // unsafeWindow.foods[food].fh = 25;
        // unsafeWindow.foods[food].cv = unsafeWindow.foods[food].sz;
        // unsafeWindow.foods[food].cv2 = unsafeWindow.foods[food].sz;
        // unsafeWindow.foods[food].fh = unsafeWindow.foods[food].sz;
        // unsafeWindow.foods[food].gcv = unsafeWindow.foods[food].sz;
        // unsafeWindow.foods[food].g2cv = unsafeWindow.foods[food].sz;
        // unsafeWindow.foods[food].gcv = 25;
        // unsafeWindow.foods[food].g2cv = 25;
        // unsafeWindow.foods[food].gfi = 25;
        // unsafeWindow.foods[food].fi = null;
        // unsafeWindow.foods[food].g2fi = null;
        // unsafeWindow.foods[food].ofi = null;
        // console.log(unsafeWindow.foods[food]);
    // }
    // console.log(unsafeWindow.foods);

    // unsafeWindow.resize();
}

/**
 * Reset zoom to default level
 */
function resetZoom() {
    customZoom = true;
    currentZoom = 0.5;
    unsafeWindow.gsc = currentZoom;

    zoomContainer.textContent = 'Zoom: ' + unsafeWindow.gsc.toFixed(2);
}

/**
 * Load settings from browser local storage
 */
 function loadSettings() {
    //Enable skins
    unsafeWindow.localStorage.setItem('edttsg', 1);

    if (unsafeWindow.localStorage.getItem('nick') !== null) {
        var nick = unsafeWindow.localStorage.getItem('nick');
        document.getElementById('nick').value = nick;
    }

    if (unsafeWindow.localStorage.getItem('high-score') !== null) {
        highScore = parseInt(unsafeWindow.localStorage.getItem('high-score'));
        highscoreContainer.textContent = 'Hi Score: ' + highScore;
    }

    if (unsafeWindow.localStorage.getItem('graphics-mode') !== null) {
        var mode = unsafeWindow.localStorage.getItem('graphics-mode');
        if (mode >= 1 && mode <= 4) {
            graphicsMode = mode;
        }
    } else {
        unsafeWindow.localStorage.setItem('graphics-mode', '4');
    }

    if (unsafeWindow.localStorage.getItem('background-image') !== null) {
        backgroundImage = unsafeWindow.localStorage.getItem('background-image');
        randomizeBackground = (backgroundImage == '-2' && graphicsMode == '4') ? true : false;
    } else {
        unsafeWindow.localStorage.setItem('background-image', '-2');
    }

    if (unsafeWindow.localStorage.getItem('server-selected') !== null) {
        selectedServer = unsafeWindow.localStorage.getItem('server-selected');
    } else {
        unsafeWindow.localStorage.setItem('server-selected', selectedServer);
    }

    if (unsafeWindow.localStorage.getItem('server-manual') !== null) {
        manualServer = unsafeWindow.localStorage.getItem('server-manual');
    } else {
        unsafeWindow.localStorage.setItem('server-manual', false);
    }

    if (unsafeWindow.localStorage.getItem('skin-select') !== null) {
        selectedSkinOption = unsafeWindow.localStorage.getItem('skin-select');
    } else {
        unsafeWindow.localStorage.setItem('skin-select', selectedSkinOption);
    }

    if (unsafeWindow.localStorage.getItem('snakercv') !== null) {
        selectedSkin = unsafeWindow.localStorage.getItem('snakercv');
    }
}

/**
 * Setup main menu
 */
var setupMenu = function() {
    var login = document.getElementById('login');
    var playButtonContainer = document.getElementById('playh');
    if (playButtonContainer) {
        // Load settings
        loadSettings();

        //Create container
        var menuContainer = document.createElement('div');
        menuContainer.id = 'custom-menu-container';
        menuContainer.innerHTML = '\
            <!-- <div class="custom-select-container"> \
                <select id="server-select"> \
                    <option value="-1">Server: Default Closest</option> \
                    <option value="-2">Server: Random</option> \
                    <option value="-3">Server: Manual Input</option> \
                </select> \
                <input type"text" id="server-manual-input"> \
            </div> --> \
            <div class="custom-select-container"> \
                <select id="graphics-select"> \
                    <option value="4">Graphics: customized</option> \
                    <option value="3">Graphics: normal</option> \
                    <option value="2">Graphics: no background</option> \
                    <option value="1">Graphics: low</option> \
                </select> \
            </div> \
            <div class="custom-select-container" id="background-select-container"> \
                <select id="background-select"> \
                    <option value="-2">Background Image: Random</option> \
                    <option value="-1">Background Image: Default</option> \
                    <option value="http://i.imgur.com/YioXLYV.jpg">Grid</option> \
                    <option value="http://i.imgur.com/Iffij8a.jpg">Cats</option> \
                    <option value="http://i.imgur.com/jYFIA9J.jpg">Dirt</option> \
                    <option value="http://i.imgur.com/wQIghye.jpg">Grass</option> \
                    <option value="http://i.imgur.com/HVnFfK9.jpg">Magma Storm</option> \
                    <option value="http://i.imgur.com/HaxzRtX.jpg">Wood</option> \
                    <option value="http://i.imgur.com/kQvgICX.jpg">Stonewall</option> \
                    <option value="http://i.imgur.com/bwfU0Qr.jpg">Hungry Like Wolf</option> \
                    <option value="http://i.imgur.com/TyKD6Ie.png">Shaq-fu</option> \
                </select> \
            </div> \
            <div class="custom-select-container" id="skin-select-container"> \
                <select id="skin-select"> \
                    <option value="-1">Skins: Default Single Skin</option> \
                    <option value="1">Skins: Random</option> \
                    <option value="2">Skins: Rotate All</option> \
                </select> \
            </div> \
            <ul id="hotkey-help"> \
                <li>[Mousewheel] Zoom</li> \
                <li>[~] Reset Zoom</li> \
                <li>[ESC] Respawn</li> \
                <li>[Q]uit Game</li> \
                <li>[TAB] Toggle Stats</li> \
            </ul> \
            <strong>607ch00 remix</strong> | <strong>' + modVersion + '</strong> \
        ';

        login.insertBefore(menuContainer, playButtonContainer);

        //Capture and store nickname
        var nick = document.getElementById('nick');
        nick.addEventListener("input", getNick, false);

        //Set graphics mode
        var selectGraphics = document.getElementById('graphics-select');
        selectGraphics.value = graphicsMode;
        toggleBackgroundSelect();

        selectGraphics.onchange = function() {
            var mode = selectGraphics.value;
            if (mode) {
                graphicsMode = mode;
                unsafeWindow.localStorage.setItem('graphics-mode', graphicsMode);
                toggleBackgroundSelect();
                graphicsModeChanged = true;
                backgroundImageChanged = true;
                if (graphicsMode != '4') {
                    randomizeBackground = false;
                } else if (unsafeWindow.localStorage.getItem('background-image') == '-2') {
                    randomizeBackground = true;
                }
            }
        };

        //Set background options
        var selectBackground = document.getElementById('background-select');
        if (selectBackground) {
            selectBackground.value = backgroundImage;
        }
        selectBackground.onchange = function() {
            backgroundImage = selectBackground.value;
            unsafeWindow.localStorage.setItem('background-image', backgroundImage);
            graphicsModeChanged = true;
            backgroundImageChanged = true;
            randomizeBackground = (backgroundImage == '-2') ? true : false;
        };

        //Set server options
        // getServersList();

        // var selectServer = document.getElementById('server-select');
        // var inputServerManual = document.getElementById('server-manual-input');

        // if (selectedServer) {
        //     selectServer.value = selectedServer;
        //     inputServerManual.style.display = (selectedServer === '-3') ? 'block' : 'none';
        // }

        // if (manualServer && manualServer !== 'false') {
        //     inputServerManual.value = manualServer;
        // }

        // selectServer.onchange = function() {
        //     selectedServer = selectServer.value;

        //     if (selectedServer === '-3') {
        //         inputServerManual.style.display = 'block';
        //         inputServerManual.focus();
        //     } else {
        //         inputServerManual.style.display = 'none';
        //     }

        //     unsafeWindow.localStorage.setItem('server-selected', selectedServer);
        // };

        // inputServerManual.onchange = function() {
        //     manualServer = inputServerManual.value;
        //     unsafeWindow.localStorage.setItem('server-manual', manualServer);
        // };

        //Set skin options
        var selectSkin = document.getElementById('skin-select');
        if (selectedSkinOption) {
            selectSkin.value = selectedSkinOption;
        }
        selectSkin.onchange = function() {
            selectedSkinOption = selectSkin.value;
            unsafeWindow.localStorage.setItem('skin-select', selectedSkinOption);
        }

        //Move this out of the way
        document.body.appendChild(document.getElementById('nbg'));

        resizeView();
    } else {
        setTimeout(setupMenu, 100);
    }
}

/**
 * Validate IP address format
 */
var validIP = function(ip) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}

/**
 * Toggle availablility of background image selection based on graphics mode
 */
var toggleBackgroundSelect = function() {
    if (graphicsMode == '4') {
        document.getElementById('background-select-container').style.display = 'block';
    } else {
        document.getElementById('background-select-container').style.display = 'none';
    }
}

/**
 * Select a random background when the game loads
 */
var randomBackground = function() {
    var selectBackground = document.getElementById('background-select');
    var backgroundOptions = selectBackground.getElementsByTagName('option');
    var randomSelection = Math.floor(Math.random() * (backgroundOptions.length-1))+1;
    backgroundImage = backgroundOptions[randomSelection].value;
    backgroundImageChanged = true;
}

/**
 * Get and store user's nickname
 */
var getNick = function() {
    var nick = document.getElementById('nick').value;
    unsafeWindow.localStorage.setItem('nick', nick);
}

/**
 * Generate select list of game servers available
 */
var getServersList = function() {
    if (unsafeWindow.sos && unsafeWindow.sos.length > 0) {
        var selectSrv = document.getElementById('server-select');
        console.log(unsafeWindow.sos);
        for (var i = 0; i < unsafeWindow.sos.length; i++) {
            var srv = unsafeWindow.sos[i];
            var option = document.createElement('option');
            var serverLoopString = option.value = srv.ip + ':' + srv.po;
            option.text = (i + 1) + '. ' + option.value;
            selectSrv.appendChild(option);
        }
    } else {
        setTimeout(getServersList, 100);
    }
}

/**
 * Override default connect button behavior to use custom server lists
 */
var customConnectButton = function() {
    connectBtn = document.getElementById('playh').getElementsByClassName('btnt')[0];
    if (connectBtn && !connectButtonOverride) {
        // Force connect
        connectBtn.onclick = customConnect;
    } else {
        setTimeout(customConnectButton, 50);
    }
}

/**
 * Custom connection function to allow for selection of server ip, random or default behavior
 */
var customConnect = function() {
    if (!unsafeWindow.connect) {
        return;
    }

    if (!connectBtn.disabled) {
        connectBtn.disabled = true;
    } else {
        return false;
    }

    backgroundImageChanged = true;
    if (randomizeBackground) {
        randomBackground();
    }

    //Handle skin change options
    skinChange();

    //Reset zoom on new game
    resetZoom();

    //Need to reset this before trying to reconnect
    unsafeWindow.dead_mtm = -1;

    if (selectedServer != '-1') {
        unsafeWindow.forcing = true;
        if (!unsafeWindow.bso) {
            unsafeWindow.bso = {};
        }
    }

    if (selectedServer == '-3') {
        //double check custom server entry
        manualServer = document.getElementById('server-manual-input').value;
        unsafeWindow.localStorage.setItem('server-manual', manualServer);

        var srv = manualServer.trim().split(':');

        if (validIP(srv[0])) {
            unsafeWindow.bso.ip = srv[0];
            unsafeWindow.bso.po = srv[1];
        } else {
            alert('The custom server you entered does not have a valid IP address format');
            document.getElementById('server-manual-input').focus();
            return false;
        }
    } else if (selectedServer == '-2') {
        var connectToServer = unsafeWindow.sos[Math.floor(Math.random()*unsafeWindow.sos.length)];
        unsafeWindow.bso.ip = connectToServer.ip;
        unsafeWindow.bso.po = connectToServer.po;
        selectedServer = connectToServer.ip + ':' + connectToServer.po;
        var selectSrv = document.getElementById('server-select').value = selectedServer;
    } else if (selectedServer != '-1') {
        var srv = selectedServer.trim().split(':');
        unsafeWindow.bso.ip = srv[0];
        unsafeWindow.bso.po = srv[1];
    }

    unsafeWindow.connect();
    setTimeout(connectionStatus, 1000);
}

/**
 * Loop to force retry of connection
 */
var connectionStatus = function() {
    if (!unsafeWindow.connecting || retry == 10) {
        unsafeWindow.forcing = false;
        retry = 0;
        connectBtn.disabled = false;
        return;
    }
    retry++;
    setTimeout(connectionStatus, 1000);
}

/**
 * Force disconnect from game and return to menu
 */
var disconnect = function(resetGame) {
    if (unsafeWindow.playing) {
        unsafeWindow.want_close_socket = true;
        unsafeWindow.dead_mtm = Date.now();

        if (resetGame) {
            unsafeWindow.resetGame();
        }
    }
}

/**
 * Handle random or rotating to next skin
 */
var skinChange = function() {
    //Default
    if (selectedSkinOption == -1) {
        return true;
    }

    //Check local storage again in case user switch skin via default interface
    selectedSkin = unsafeWindow.localStorage.getItem('snakercv');

    //Random
    if (selectedSkinOption == 1) {
        selectedSkin =  Math.floor(Math.random() * (unsafeWindow.max_skin_cv+1));
    //Rotate
    } else if (selectedSkinOption == 2) {
        selectedSkin = (selectedSkin > unsafeWindow.max_skin_cv) ? 0 : parseInt(selectedSkin)+1;
    }

    unsafeWindow.localStorage.setItem('snakercv', selectedSkin);
}

/**
 * Set up graphics mode
 */
var setupGraphics = function() {
    //Store original background image
    if ((!originalBackground || !originalBackgroundCanvas) && unsafeWindow.bgp2 && unsafeWindow.ii) {
        originalBackground = unsafeWindow.ii.src;
        originalBackgroundCanvas = unsafeWindow.bgp2;
    }

    unsafeWindow.lbf.setAttribute("id", "ingame-score");

    //Handle game graphics quality if needed
    if (graphicsModeChanged) {
        if (graphicsMode == '3') {
            unsafeWindow.grqi.style.display = 'block';
            unsafeWindow.grqi.src = '/s/highquality.png';

            unsafeWindow.want_quality = 1;
            unsafeWindow.localStorage.setItem('qual', '1');

            if (typeof unsafeWindow.high_quality !== 'undefined') {
                unsafeWindow.high_quality = true;
            }

            //Global alpha
            if (unsafeWindow.gla) {
                unsafeWindow.gla = 1;
            }

            if (typeof unsafeWindow.render_mode !== 'undefined') {
                unsafeWindow.render_mode = 2;
            }
        } else {
            if (graphicsMode == '4') {
                unsafeWindow.grqi.style.display = 'none';
            } else {
                unsafeWindow.grqi.style.display = 'block';
                unsafeWindow.grqi.src = '/s/lowquality.png';
            }

            unsafeWindow.want_quality = 0;
            unsafeWindow.localStorage.setItem('qual', '0');
            unsafeWindow.qsm = 0;

            if (typeof unsafeWindow.high_quality !== 'undefined') {
                unsafeWindow.high_quality = false;
                window.high_quality = false;
            }

            //Global alpha
            if (unsafeWindow.gla) {
                unsafeWindow.gla = 0;
            }

            //Snake rendering
            if (typeof unsafeWindow.render_mode !== 'undefined') {
                if (graphicsMode == '4') {
                    unsafeWindow.render_mode = 2;
                } else {
                    unsafeWindow.render_mode = parseInt(graphicsMode);
                }
            }
        }

        graphicsModeChanged = false;
    }

    //Handle game background change if needed
    if (backgroundImageChanged && typeof unsafeWindow.bgp2 !== 'undefined' && typeof unsafeWindow.ii !== 'undefined') {
        //Customized high quality
        if (graphicsMode == '4') {
            clearGlow();

            if (unsafeWindow.bgp2) {
                unsafeWindow.bgp2 = originalBackgroundCanvas;
            }

            if (unsafeWindow.ii) {
                if (backgroundImage != '-1') {
                    unsafeWindow.ii.src = backgroundImage;
                    var bgcanvas = unsafeWindow.bgi2.getContext("2d");
                    bgcanvas.drawImage(unsafeWindow.ii, 0, 0);
                    unsafeWindow.bgp2 = bgcanvas.createPattern(unsafeWindow.bgi2, "repeat");
                } else {
                    unsafeWindow.ii.src = originalBackground;
                }
            }
        //Default high quality
        } else if (graphicsMode == '3') {
            if (unsafeWindow.ggbg && unsafeWindow.gbgmc) {
                unsafeWindow.ggbg = true;
            }
            if (unsafeWindow.bgp2) {
                unsafeWindow.bgp2 = originalBackgroundCanvas;
            }
            if (unsafeWindow.ii) {
                unsafeWindow.ii.src = originalBackground;
            }
        //Low quality / no background
        } else {
            clearGlow();
            //Background picture
            if (unsafeWindow.bgp2) {
                unsafeWindow.bgp2 = null;
            }
        }

        backgroundImageChanged = false;
    }
}

/**
 * Clear glow from game
 */
var clearGlow = function() {
    if (unsafeWindow.ggbg) {
        unsafeWindow.ggbg = false;
    }
    if (clearedGlow) {
        return;
    } else if (unsafeWindow.gbgi && !clearedGlow) {
        unsafeWindow.gbgi.src = '';
        unsafeWindow.gbgi.onload = null;
        unsafeWindow.gbgi = null;
        if (unsafeWindow.gbgmc) {
            unsafeWindow.gbgmc = null;
        }
        clearedGlow = true;
    } else {
        setTimeout(clearGlow, 50);
    }
}

/**
 * Resize the view to the current browser window
 */
var resizeView = function() {
    if (unsafeWindow.resize) {
        unsafeWindow.lww = 0; // Reset width (force resize)
        unsafeWindow.wsu = 0; // Clear ad space
        unsafeWindow.resize();
        var wh = Math.ceil(unsafeWindow.innerHeight);
        if (wh < 800) {
            var login = document.getElementById('login');
            unsafeWindow.lgbsc = wh / 800;
            login.style.top = - (Math.round(wh * (1 - unsafeWindow.lgbsc) * 1E5) / 1E5) + 'px';
            if (unsafeWindow.trf) {
                unsafeWindow.trf(login, 'scale(' + unsafeWindow.lgbsc + ',' + unsafeWindow.lgbsc + ')');
            }
        }
    } else {
        setTimeout(resizeView, 100);
    }
}

/**
 * Show FPS
 */
var showFPS = function() {
    if (unsafeWindow.playing && unsafeWindow.fps && unsafeWindow.lrd_mtm) {
        if (Date.now() - unsafeWindow.lrd_mtm > 970) {
            fpsContainer.textContent = 'FPS: ' + unsafeWindow.fps;
        }
    }
    setTimeout(showFPS, 250);
}

/**
 * Game recalcs zoom every redraw, setup a loop to keep it at our last zoom level
 */
var fixedZoom = function() {
    if (customZoom) {
        unsafeWindow.gsc = currentZoom;
    }
    setTimeout(fixedZoom, 20);
}

/**
 * Update loop for real-time data
 */
var updateLoop = function() {
    setupGraphics();

    //testing this
    //unsafeWindow.testing = true;

    if (unsafeWindow.playing) {
        positionContainer.textContent = 'X: ' + (~~unsafeWindow.view_xx || 0) + ' Y: ' + (~~unsafeWindow.view_yy || 0);

        if (unsafeWindow.bso && currentIP != unsafeWindow.bso.ip + ':' + unsafeWindow.bso.po) {
            currentIP = unsafeWindow.bso.ip + ":" + unsafeWindow.bso.po;
            ipContainer.textContent = 'IP: ' + currentIP;
        }

        zoomContainer.textContent = 'Zoom: ' + unsafeWindow.gsc.toFixed(2);
        xferContainer.textContent = 'BPS: ' + unsafeWindow.rdps;

        var currentScore = Math.floor(150 * (unsafeWindow.fpsls[unsafeWindow.snake.sct] + unsafeWindow.snake.fam / unsafeWindow.fmlts[unsafeWindow.snake.sct] - 1) - 50) / 10;
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem('high-score', highScore);
            highscoreContainer.textContent = 'Hi Score: ' + highScore;
        }
    } else {
        xferContainer.textContent = '';
        fpsContainer.textContent = '';
        zoomContainer.textContent = '';
        positionContainer.textContent = '';
    }

    //Add/update clock
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var timeValue = "" + ((hours > 12) ? hours - 12 : hours);
    timeValue  += ((minutes < 10) ? ':0' : ':') + minutes;
    timeValue  += ((seconds < 10) ? ':0' : ':') + seconds;
    timeValue  += (hours >= 12) ? ' PM' : ' AM';
    clockContainer.textContent = timeValue;

    //Fix this
    if (typeof window.oncontextmenu === 'function') {
        window.oncontextmenu=null;
    }

    setTimeout(updateLoop, 20);
}

// Init
init();
