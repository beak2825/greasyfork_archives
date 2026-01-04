// ==UserScript==
// @name         [TOPO] Team Mods
// @namespace    [TOPO] Team MOds
// @version      1.1
// @description  Mod : Feito e Editado Pelo NINJA_TOPO
// @author       NINJA_TOPO oxx);;;;;>
// @match        http://slither.io/*
// @noframes
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370294/%5BTOPO%5D%20Team%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/370294/%5BTOPO%5D%20Team%20Mods.meta.js
// ==/UserScript==
/*jshint multistr: true */
(function(w) {
    var modVersion = 'V1.1', //used in menu box
        graphicsMode = '4', //4 - Qualidade Alta Customizada 3 - Qualidade Alta, 2 - simples otimizada, 1 - simples (celular)
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
        retry = 0; //hold the current number of connection retries

    /**
     * Init script
     */
    function init() {
        createCSS();

        stopLogoAnimation();

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

        // Add zoom
        if (/firefox/i.test(navigator.userAgent)) {
            document.addEventListener('DOMMouseScroll', zoom, false);
        } else {
            document.body.onmousewheel = zoom;
        }

        //Setup keyboard shortcuts
        w.onkeydown = function(e) {
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
        };

        addEventListener

        // Set menu
        setupMenu();
        // Set leaderboard
        setLeaderboard();
        // Override play button behavior
        customConnectButton();
        // Setup graphics
        setupGraphics();
        // Update loop
        updateLoop();
        // Show FPS
        showFPS();
    }

    /**
     * Prevent laggy logo animation
     */
    function stopLogoAnimation() {
        if (typeof w.showlogo_iv !== 'undefined') {
            w.ncka = w.lgss = w.lga = 1;
            clearInterval(w.showlogo_iv);
            showLogo(true);
        } else {
            setTimeout(stopLogoAnimation, 25);
        }
    }

    /**
     * Create stylesheet in head
     */
    function createCSS() {
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
                background-color: #000000; \
                border: 1px solid #000000; \
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
        ';

        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssString;
        } else {
            styleElement.appendChild(document.createTextNode(cssString));
        }
    }

    /**
     * Toggle display of stats window
     */
    function toggleStats() {
        if (statsContainer.style.display == 'none') {
            statsContainer.style.display = 'block';
        } else {
            statsContainer.style.display = 'none';
        }
    }

    /**
     * Calculate zoom from mousewheel
     */
    function zoom(e) {
        if (!w.gsc || !w.playing) {
            return;
        }

        w.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);

        zoomContainer.textContent = 'Zoom: ' + w.gsc.toFixed(2);
    }


    /**
     * Reset zoom to default level
     */
    function resetZoom() {
        w.gsc = 0.9;


    }

    // Maintains Zoom
         function maintainsZoom () {
            if (zoomContainer.textContent !== undefined) {
               w.gsc = zoomContainer.textContent;
           }
        }
    /**
     * Setup main menu
     */
    function setupMenu() {
        var login = document.getElementById('login');
        var playButtonContainer = document.getElementById('playh');
        if (playButtonContainer) {
            // Load settings
            loadSettings();

            //Create container
            var menuContainer = document.createElement('div');
            menuContainer.id = 'custom-menu-container';
            menuContainer.innerHTML = '\
                <div class="custom-select-container"> \
                    <select id="server-select"> \
                        <option value="-1">Server: Padrão</option> \
                        <option value="-2">Server: Aleatorio</option> \
                        <option value="-3">Server: Digitar IP Manual</option> \
                    </select> \
                    <input type"text" id="server-manual-input"> \
                </div> \
                <div class="custom-select-container"> \
                    <select id="graphics-select"> \
                        <option value="4">Gráfico: Customizado</option> \
                        <option value="3">Gráfico: Normal</option> \
                        <option value="2">Gráfico: Fundo Preto</option> \
                        <option value="1">Gráfico: Low</option> \
                    </select> \
                </div> \
                <div class="custom-select-container" id="background-select-container"> \
                    <select id="background-select"> \
                        <option value="-2">Background Image: Random</option> \
                        <option value="-1">Background Image: Default</option> \
                        <option value="http://i.imgur.com/YioXLYV.jpg">Especial Do Ninja</option> \
                        <option value="https://i.imgur.com/X446tPd.png">Especial Do Ninja 2</option> \
                    </select> \
                </div> \
                <div class="custom-select-container" id="skin-select-container"> \
                    <select id="skin-select"> \
                        <option value="-1">Skins: Skin Padrão</option> \
                        <option value="1">Skins: Aleatorio Do Jogo</option> \
                    </select> \
                </div> \
                <ul id="hotkey-help"> \
                    <li>[scroll Do Mause] Zoom</li> \
                    <li>[~] Reset Zoom</li> \
                    <li>[ESC] Renascer</li> \
                    <li>[Q]uit Game</li> \
                    <li>[TAB] Tira Status</li> \
                </ul> \
                <strong>[ TOPO ]  </strong> | <strong>' + modVersion + '</strong> \
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
                    w.localStorage.setItem('graphics-mode', graphicsMode);
                    toggleBackgroundSelect();
                    graphicsModeChanged = true;
                    backgroundImageChanged = true;
                    if (graphicsMode != '4') {
                        randomizeBackground = false;
                    } else {
                        if (w.localStorage.getItem('background-image') == '-2') {
                            randomizeBackground = true;
                        }
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
                w.localStorage.setItem('background-image', backgroundImage);
                graphicsModeChanged = true;
                backgroundImageChanged = true;
                randomizeBackground = (backgroundImage == '-2') ? true : false;
            };

            //Set server options
            getServersList();

            var selectServer = document.getElementById('server-select');
            var inputServerManual = document.getElementById('server-manual-input');

            if (selectedServer) {
                selectServer.value = selectedServer;
                inputServerManual.style.display = (selectedServer === '-3') ? 'block' : 'none';
            }

            if (manualServer && manualServer !== 'false') {
                inputServerManual.value = manualServer;
            }

            selectServer.onchange = function() {
                selectedServer = selectServer.value;

                if (selectedServer === '-3') {
                    inputServerManual.style.display = 'block';
                    inputServerManual.focus();
                } else {
                    inputServerManual.style.display = 'none';
                }

                w.localStorage.setItem('server-selected', selectedServer);
            };

            inputServerManual.onchange = function() {
                manualServer = inputServerManual.value;
                w.localStorage.setItem('server-manual', manualServer);
            };

            //Set skin options
            var selectSkin = document.getElementById('skin-select');
            if (selectedSkinOption) {
                selectSkin.value = selectedSkinOption;
            }
            selectSkin.onchange = function() {
                selectedSkinOption = selectSkin.value;
                w.localStorage.setItem('skin-select', selectedSkinOption);
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
    function validIP (ip) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
    }

    /**
     * Toggle availablility of background image selection based on graphics mode
     */
    function toggleBackgroundSelect() {
        if (graphicsMode == '4') {
            document.getElementById('background-select-container').style.display = 'block';
        } else {
            document.getElementById('background-select-container').style.display = 'none';
        }
    }

    /**
     * Select a random background when the game loads
     */
    function randomBackground() {
        var selectBackground = document.getElementById('background-select');
        var backgroundOptions = selectBackground.getElementsByTagName('option');
        var randomSelection = Math.floor(Math.random() * (backgroundOptions.length-1))+1;
        backgroundImage = backgroundOptions[randomSelection].value;
        backgroundImageChanged = true;
    }

    /**
     * Load settings from browser local storage
     */
    function loadSettings() {
        //Enable skins
        localStorage.setItem('edttsg', 1);

        if (w.localStorage.getItem('nick') !== null) {
            var nick = w.localStorage.getItem('nick');
            document.getElementById('nick').value = nick;
        }

        if (w.localStorage.getItem('high-score') !== null) {
             highScore = parseInt(w.localStorage.getItem('high-score'));
             highscoreContainer.textContent = 'Seu Score: ' + highScore;
        }

        if (w.localStorage.getItem('graphics-mode') !== null) {
            var mode = parseInt(w.localStorage.getItem('graphics-mode'));
            if (mode >= 1 && mode <= 4) {
                graphicsMode = mode;
            }
        } else {
            w.localStorage.setItem('graphics-mode', '4');
        }

        if (w.localStorage.getItem('background-image') !== null) {
            backgroundImage = w.localStorage.getItem('background-image');
            randomizeBackground = (backgroundImage == '-2' && graphicsMode == '4') ? true : false;
        } else {
            w.localStorage.setItem('background-image', '-2');
        }

        if (w.localStorage.getItem('server-selected') !== null) {
            selectedServer = w.localStorage.getItem('server-selected');
        } else {
            w.localStorage.setItem('server-selected', selectedServer);
        }

        if (w.localStorage.getItem('server-manual') !== null) {
            manualServer = w.localStorage.getItem('server-manual');
        } else {
            w.localStorage.setItem('server-manual', false);
        }

        if (w.localStorage.getItem('skin-select') !== null) {
            selectedSkinOption = w.localStorage.getItem('skin-select');
        } else {
            w.localStorage.setItem('skin-select', selectedSkinOption);
        }

        if (w.localStorage.getItem('snakercv') !== null) {
            selectedSkin = w.localStorage.getItem('snakercv');
        }
    }

    /**
     * Get and store user's nickname
     */
    function getNick() {
        var nick = document.getElementById('nick').value;
        w.localStorage.setItem('nick', nick);
    }

    /**
     * Generate select list of game servers available
     */
    function getServersList() {
        if (w.sos && w.sos.length > 0) {
            var selectSrv = document.getElementById('server-select');
            for (var i = 0; i < sos.length; i++) {
                var srv = sos[i];
                var option = document.createElement('option');
                var serverLoopString = option.value = srv.ip + ':' + srv.po;
                option.text = (i + 1) + '. ' + option.value;
                selectSrv.appendChild(option);
            }
        } else {
            setTimeout(getServersList, 100);
        }
    }
// Set leaderboard
    function setLeaderboard() {
        if (w.lbh) {
            w.lbh.textContent = " [TOPO] DOMINA ;)";
            w.lbh.style.fontSize = "20px";
        } else {
            setTimeout(setLeaderboard, 100);
             }
    }
    /**
     * Override default connect button behavior to use custom server lists
     */
    function customConnectButton() {
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
    function customConnect() {
        if (!w.connect) {
            return;
        }

        if (!connectBtn.disabled) {
            connectBtn.disabled = true;
        } else {
            return false;
        }

        if (randomizeBackground) {
            randomBackground();
        }

        //Handle skin change options
        skinChange();

        //Need to reset this before trying to reconnect
        w.dead_mtm = -1;

        if (selectedServer != '-1') {
            w.forcing = true;
            if (!w.bso) {
                w.bso = {};
            }
        }

        if (selectedServer == '-3') {
            //double check custom server entry
            manualServer = document.getElementById('server-manual-input').value;
            w.localStorage.setItem('server-manual', manualServer);

            var srv = manualServer.trim().split(':');

            if (validIP(srv[0])) {
                w.bso.ip = srv[0];
                w.bso.po = srv[1];
            } else {
                alert('The custom server you entered does not have a valid IP address format');
                document.getElementById('server-manual-input').focus();
                return false;
            }
        } else if (selectedServer == '-2') {
            var connectToServer = w.sos[Math.floor(Math.random()*w.sos.length)];
            w.bso.ip = connectToServer.ip;
            w.bso.po = connectToServer.po;
            selectedServer = connectToServer.ip + ':' + connectToServer.po;
            var selectSrv = document.getElementById('server-select').value = selectedServer;
        } else if (selectedServer != '-1') {
            var srv = selectedServer.trim().split(':');
            w.bso.ip = srv[0];
            w.bso.po = srv[1];
        }

        w.connect();
        setTimeout(connectionStatus, 1000);
    }

    /**
     * Loop to force retry of connection
     */
    function connectionStatus() {
        if (!w.connecting || retry == 10) {
            w.forcing = false;
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
    function disconnect(resetGame) {
        if (w.playing) {
            w.want_close_socket = true;
            w.dead_mtm = Date.now();

            if (resetGame) {
                w.resetGame();
            }
            /*
            w.ws.close();
            w.ws = null;
            w.playing = false;
            w.connected = false;
            w.play_btn.setEnabled(true);
            */
        }
    }

    /**
     * Handle random or rotating to next skin
     */
    function skinChange() {
        //Default
        if (selectedSkinOption == -1) {
            return true;
        }

        //Check local storage again in case user switch skin via default interface
        selectedSkin = w.localStorage.getItem('snakercv');

        //Random
        if (selectedSkinOption == 1) {
            selectedSkin =  Math.floor(Math.random() * (w.max_skin_cv+1));
        //Rotate
        } else if (selectedSkinOption == 2) {
            selectedSkin = (selectedSkin > w.max_skin_cv) ? 0 : parseInt(selectedSkin)+1;
        }

        w.localStorage.setItem('snakercv', selectedSkin);
    }

    /**
     * Set up graphics mode
     */
    function setupGraphics() {
        //Store original background image
        if ((!originalBackground || !originalBackgroundCanvas) && w.bgp2 && w.ii) {
            originalBackground = w.ii.src;
            originalBackgroundCanvas = w.bgp2;
        }

        //Handle game graphics quality if needed
        if (graphicsModeChanged) {
            if (graphicsMode == '3') {
                w.grqi.style.display = 'block';
                w.grqi.src = '/s/highquality.png';

                w.want_quality = 1;
                w.localStorage.setItem('qual', '1');

                if (typeof w.high_quality !== 'undefined') {
                    w.high_quality = true;
                }

                //Global alpha
                if (w.gla) {
                    w.gla = 1;
                }

                if (typeof w.render_mode !== 'undefined') {
                    w.render_mode = 2;
                }
            } else {
                if (graphicsMode == '4') {
                    w.grqi.style.display = 'none';
                } else {
                    w.grqi.style.display = 'block';
                    w.grqi.src = '/s/lowquality.png';
                }

                w.want_quality = 0;
                w.localStorage.setItem('qual', '0');

                if (typeof w.high_quality !== 'undefined') {
                    w.high_quality = false;
                }

                //Global alpha
                if (w.gla) {
                    w.gla = 0;
                }

                //Snake rendering
                if (typeof w.render_mode !== 'undefined') {
                    if (graphicsMode == '4') {
                        w.render_mode = 2;
                    } else {
                        w.render_mode = parseInt(graphicsMode);
                    }
                }
            }

            graphicsModeChanged = false;
        }

        //Handle game background change if needed
        if (backgroundImageChanged && typeof w.bgp2 !== 'undefined' && typeof w.ii !== 'undefined') {
            //Customized high quality
            if (graphicsMode == '4') {
                clearGlow();

                if (w.bgp2) {
                    w.bgp2 = originalBackgroundCanvas;
                }

                if (w.ii) {
                    if (backgroundImage != '-1') {
                        w.ii.src = backgroundImage;
                    } else {
                        w.ii.src = originalBackground;
                    }
                }
            //Default quality
            } else if (graphicsMode == '3') {
                if (w.ggbg && w.gbgmc) {
                    w.ggbg = true;
                }
                if (w.bgp2) {
                    w.bgp2 = originalBackgroundCanvas;
                }
                if (w.ii) {
                    w.ii.src = originalBackground;
                }
            //Low quality / no background
            } else {
                clearGlow();
                //Background picture
                if (w.bgp2) {
                    w.bgp2 = null;
                }
            }

            backgroundImageChanged = false;
        }
    }

    /**
     * Clear glow from game
     */
    function clearGlow() {
        if (w.ggbg) {
            w.ggbg = false;
        }
        if (clearedGlow) {
            return;
        } else if (w.gbgi && !clearedGlow) {
            w.gbgi.src = '';
            w.gbgi.onload = null;
            w.gbgi = null;
            if (w.gbgmc) {
                w.gbgmc = null;
            }
            clearedGlow = true;
        } else {
            setTimeout(clearGlow, 50);
        }
    }

    /**
     * Resize the view to the current browser window
     */
    function resizeView() {
        if (w.resize) {
            w.lww = 0; // Reset width (force resize)
            w.wsu = 0; // Clear ad space
            w.resize();
            var wh = Math.ceil(w.innerHeight);
            if (wh < 800) {
                var login = document.getElementById('login');
                w.lgbsc = wh / 800;
                login.style.top = - (Math.round(wh * (1 - w.lgbsc) * 1E5) / 1E5) + 'px';
                if (w.trf) {
                    w.trf(login, 'scale(' + w.lgbsc + ',' + w.lgbsc + ')');
                }
            }
        } else {
            setTimeout(resizeView, 100);
        }
    }

    /**
     * Seu FPS
     */
    function showFPS() {
        if (w.playing && w.fps && w.lrd_mtm) {
            if (Date.now() - w.lrd_mtm > 970) {
                fpsContainer.textContent = 'FPS: ' + w.fps;
            }
        }
        setTimeout(showFPS, 250);
    }

    /**
     * Update loop for real-time data
     */
    function updateLoop() {
        setupGraphics();

        //testing this
        //w.testing = true;

        if (w.playing) {
            positionContainer.textContent = 'X: ' + (~~w.view_xx || 0) + ' Y: ' + (~~w.view_yy || 0);

            if (w.bso && currentIP != w.bso.ip + ':' + w.bso.po) {
                currentIP = w.bso.ip + ":" + w.bso.po;
                ipContainer.textContent = 'IP: ' + currentIP;
            }

            if (zoomContainer.innerHTML === '') {
                zoomContainer.textContent = 'Zoom: ' + w.gsc.toFixed(2);
            }

            xferContainer.textContent = 'BPS: ' + w.rdps;

            var currentScore = Math.floor(150 * (w.fpsls[w.snake.sct] + w.snake.fam / w.fmlts[w.snake.sct] - 1) - 50) / 10;
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

        setTimeout(updateLoop, 1000);
    }
    // Init
    init();
})(window);

/*
The MIT License (MIT)
 Copyright (c) 2016 Jesse Miller <jmiller@jmiller.com>
 Copyright (c) 2016 Alexey Korepanov <kaikaikai@yandex.ru>
 Copyright (c) 2016 Ermiya Eskandary & ThÄ?L ophile Cailliau and other contributors
 https://jmiller.mit-license.org/
*/
// ==UserScript==
// @name         NTL custom bot & location - SMT
// @namespace    http://iketech.ro/slither/ntlloc-next-smt.js
// @version      0.0.70
// @description  works on top of other mod
// @author       NTL
// @match        http://slither.io/
// @updateURL    http://iketech.ro/slither/ntlloc-next-smt.js
// @downloadURL  http://iketech.ro/slither/ntlloc-next-smt.js
// @supportURL   http://iketech.ro/slither/ntlloc-next-smt.js
// @grant        none
// ==/UserScript==

AUTH = "";


//if ( confirm("do you need to input new NTL auth key?") ) {
//    if (localStorage && 'NTLAUTHKEY' in localStorage)
//        localStorage.removeItem('NTLAUTHKEY');
//}

if (localStorage && 'NTLAUTHKEY' in localStorage) {
    AUTH = localStorage.NTLAUTHKEY;
} else {
    var AUTH = prompt("Please enter your unique AUTH key provided by @NTL_Slither (it will be autosaved. it is removed by browser cache delete)", "<auth key>");
    localStorage && (localStorage.NTLAUTHKEY = AUTH);
}



// Custom logging function - disabled by default
window.log = function () {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};


 var nickname = "";
 var serverIP = "";

 var sosActive = false;
 var smartBot = true;
 var haveFood = false;
 var tinyDots = false;
 var hidelist = false;
 var tbl = {};
 var oldtbl = {};
 var repeater=4000; //how often to query server Url
 var phptimeout=2000; //timeout for async server query
 var hideOwnDot = true;
 var baseUrl="http://iketech.ro/slither/ntlplay-next-smt.php?auth=" + AUTH;

if ( AUTH == "XXXXXXXXXXXXXXXX" ) alert("NTL location script has been updated. You need to edit AUTH key!");

var canvas = window.canvas = (function (window) {
    return {
        // Spoofs moving the mouse to the provided coordinates.
        setMouseCoordinates: function (point) {
            window.xm = point.x;
            window.ym = point.y;
        },

        // Convert map coordinates to mouse coordinates.
        mapToMouse: function (point) {
            var mouseX = (point.x - window.snake.xx) * window.gsc;
            var mouseY = (point.y - window.snake.yy) * window.gsc;
            return { x: mouseX, y: mouseY };
        },

        // Map cordinates to Canvas cordinate shortcut
        mapToCanvas: function (point) {
            var c = {
                x: window.mww2 + (point.x - window.view_xx) * window.gsc,
                y: window.mhh2 + (point.y - window.view_yy) * window.gsc
            };
            return c;
        },

        // Map to Canvas coordinate conversion for drawing circles.
        // Radius also needs to scale by .gsc
        circleMapToCanvas: function (circle) {
            var newCircle = canvas.mapToCanvas({
                x: circle.x,
                y: circle.y
            });
            return canvas.circle(
                newCircle.x,
                newCircle.y,
                circle.radius * window.gsc
            );
        },

        // Constructor for point type
        point: function (x, y) {
            var p = {
                x: Math.round(x),
                y: Math.round(y)
            };

            return p;
        },

        // Constructor for rect type
        rect: function (x, y, w, h) {
            var r = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h)
            };

            return r;
        },

        // Constructor for circle type
        circle: function (x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },

        // Fast atan2
        fastAtan2: function (y, x) {
            const QPI = Math.PI / 4;
            const TQPI = 3 * Math.PI / 4;
            var r = 0.0;
            var angle = 0.0;
            var abs_y = Math.abs(y) + 1e-10;
            if (x < 0) {
                r = (x + abs_y) / (abs_y - x);
                angle = TQPI;
            } else {
                r = (x - abs_y) / (x + abs_y);
                angle = QPI;
            }
            angle += (0.1963 * r * r - 0.9817) * r;
            if (y < 0) {
                return -angle;
            }

            return angle;
        },

        // Adjusts zoom in response to the mouse wheel.
        setZoom: function (e) {
            // Scaling ratio
            //if (window.gsc) {
//                window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
//                window.desired_gsc = window.gsc;
//            }
        },

        // Restores zoom to the default value.
        resetZoom: function () {
//            window.gsc = 0.9;
//            window.desired_gsc = 0.9;
        },

        // Maintains Zoom
        maintainZoom: function () {
            //if (window.desired_gsc !== undefined) {
//                window.gsc = window.desired_gsc;
//            }
        },

        // Sets background to the given image URL.
        // Defaults to slither.io's own background.
        setBackground: function (url) {
            //url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
            //window.ii.src = url;
        },

        // Draw a rectangle on the canvas.
        drawRect: function (rect, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;

            var context = window.mc.getContext('2d');
            var lc = canvas.mapToCanvas({ x: rect.x, y: rect.y });

            context.save();
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a circle on the canvas.
        drawCircle: function (circle, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;
            if (circle.radius === undefined) circle.radius = 5;

            var context = window.mc.getContext('2d');
            var drawCircle = canvas.circleMapToCanvas(circle);

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw an angle.
        // @param {number} start -- where to start the angle
        // @param {number} angle -- width of the angle
        // @param {bool} danger -- green if false, red if true
        drawAngle: function (start, angle, color, fill, alpha) {
            if (alpha === undefined) alpha = 0.6;

            var context = window.mc.getContext('2d');

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.moveTo(window.mc.width / 2, window.mc.height / 2);
            context.arc(window.mc.width / 2, window.mc.height / 2, window.gsc * 100, start, angle);
            context.lineTo(window.mc.width / 2, window.mc.height / 2);
            context.closePath();
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a line on the canvas.
        drawLine: function (p1, p2, color, width) {
            if (width === undefined) width = 5;

            var context = window.mc.getContext('2d');
            var dp1 = canvas.mapToCanvas(p1);
            var dp2 = canvas.mapToCanvas(p2);

            context.save();
            context.beginPath();
            context.lineWidth = width * window.gsc;
            context.strokeStyle = color;
            context.moveTo(dp1.x, dp1.y);
            context.lineTo(dp2.x, dp2.y);
            context.stroke();
            context.restore();
        },

        // Given the start and end of a line, is point left.
        isLeft: function (start, end, point) {
            return ((end.x - start.x) * (point.y - start.y) -
                (end.y - start.y) * (point.x - start.x)) > 0;

        },

        // Get distance squared
        getDistance2: function (x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },

        getDistance2FromSnake: function (point) {
            point.distance = canvas.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },

        // return unit vector in the direction of the argument
        unitVector: function (v) {
            var l = Math.sqrt(v.x * v.x + v.y * v.y);
            if (l > 0) {
                return {
                    x: v.x / l,
                    y: v.y / l
                };
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
        },

        // Check if point in Rect
        pointInRect: function (point, rect) {
            if (rect.x <= point.x && rect.y <= point.y &&
                rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
                return true;
            }
            return false;
        },

        // check if point is in polygon
        pointInPoly: function (point, poly) {
            if (point.x < poly.minx || point.x > poly.maxx ||
                point.y < poly.miny || point.y > poly.maxy) {
                return false;
            }
            let c = false;
            const l = poly.pts.length;
            for (let i = 0, j = l - 1; i < l; j = i++) {
                if ( ((poly.pts[i].y > point.y) != (poly.pts[j].y > point.y)) &&
                    (point.x < (poly.pts[j].x - poly.pts[i].x) * (point.y - poly.pts[i].y) /
                        (poly.pts[j].y - poly.pts[i].y) + poly.pts[i].x) ) {
                    c = !c;
                }
            }
            return c;
        },

        addPolyBox: function (poly) {
            var minx = poly.pts[0].x;
            var maxx = poly.pts[0].x;
            var miny = poly.pts[0].y;
            var maxy = poly.pts[0].y;
            for (let p = 1, l = poly.pts.length; p < l; p++) {
                if (poly.pts[p].x < minx) {
                    minx = poly.pts[p].x;
                }
                if (poly.pts[p].x > maxx) {
                    maxx = poly.pts[p].x;
                }
                if (poly.pts[p].y < miny) {
                    miny = poly.pts[p].y;
                }
                if (poly.pts[p].y > maxy) {
                    maxy = poly.pts[p].y;
                }
            }
            return {
                pts: poly.pts,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy
            };
        },

        cross: function (o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        },

        convexHullSort: function (a, b) {
            return a.x === b.x ? a.y - b.y : a.x - b.x;
        },

        convexHull: function (points) {
            points.sort(canvas.convexHullSort);

            var lower = [];
            for (let i = 0, l = points.length; i < l; i++) {
                while (lower.length >= 2 && canvas.cross(
                    lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                    lower.pop();
                }
                lower.push(points[i]);
            }

            var upper = [];
            for (let i = points.length - 1; i >= 0; i--) {
                while (upper.length >= 2 && canvas.cross(
                    upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                    upper.pop();
                }
                upper.push(points[i]);
            }

            upper.pop();
            lower.pop();
            return lower.concat(upper);
        },

        // Check if circles intersect
        circleIntersect: function (circle1, circle2) {
            var bothRadii = circle1.radius + circle2.radius;
            var point = {};

            // Pretends the circles are squares for a quick collision check.
            // If it collides, do the more expensive circle check.
            if (circle1.x + bothRadii > circle2.x &&
                circle1.y + bothRadii > circle2.y &&
                circle1.x < circle2.x + bothRadii &&
                circle1.y < circle2.y + bothRadii) {

                var distance2 = canvas.getDistance2(circle1.x, circle1.y, circle2.x, circle2.y);

                if (distance2 < bothRadii * bothRadii) {
                    point = {
                        x: ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) /
                        bothRadii,
                        y: ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) /
                        bothRadii,
                        ang: 0.0
                    };

                    point.ang = canvas.fastAtan2(
                        point.y - window.snake.yy, point.x - window.snake.xx);

                    if (window.visualDebugging) {
                        var collisionPointCircle = canvas.circle(
                            point.x,
                            point.y,
                            5
                        );
                        canvas.drawCircle(circle2, '#ff9900', false);
                        canvas.drawCircle(collisionPointCircle, '#66ff66', true);
                    }
                    return point;
                }
            }
            return false;
        }
    };
})(window);

var bot = window.bot = (function (window) {
    return {
        isBotRunning: false,
        isBotEnabled: false,
        stage: 'grow',
        collisionPoints: [],
        collisionAngles: [],
        foodAngles: [],
        scores: [],
        foodTimeout: undefined,
        sectorBoxSide: 0,
        defaultAccel: 0,
        sectorBox: {},
        currentFood: {},
        opt: {
            // target fps
            targetFps: 85,
            // size of arc for collisionAngles
            arcSize: Math.PI / 8,
            // radius multiple for circle intersects
            radiusMult: 10,
            // food cluster size to trigger acceleration
            foodAccelSz: 200,
            // maximum angle of food to trigger acceleration
            foodAccelDa: Math.PI / 2,
            // how many frames per action
            actionFrames: 5,
            // how many frames to delay action after collision
            collisionDelay: 25,
            // base speed
            speedBase: 5.78,
            // front angle size
            frontAngle: Math.PI / 2,
            // percent of angles covered by same snake to be considered an encircle attempt
            enCircleThreshold: 0.5625,
            // percent of angles covered by all snakes to move to safety
            enCircleAllThreshold: 0.5625,
            // distance multiplier for enCircleAllThreshold
            enCircleDistanceMult: 20,
            // snake score to start circling on self
            followCircleLength: 2000,
            // direction for followCircle: +1 for counter clockwise and -1 for clockwise
            followCircleDirection: +1,
        },
        MID_X: 0,
        MID_Y: 0,
        MAP_R: 0,
        MAXARC: 0,

        getSnakeWidth: function (sc) {
            if (sc === undefined) sc = window.snake.sc;
            return Math.round(sc * 29.0);
        },

        quickRespawn: function () {
            window.dead_mtm = 0;
            window.login_fr = 0;

            bot.isBotRunning = false;
            window.forcing = true;
            bot.connect();
            window.forcing = false;
        },

        connect: function () {
            if (window.force_ip && window.force_port) {
                window.forceServer(window.force_ip, window.force_port);
            }

            window.connect();
        },

        // angleBetween - get the smallest angle between two angles (0-pi)
        angleBetween: function (a1, a2) {
            var r1 = 0.0;
            var r2 = 0.0;

            r1 = (a1 - a2) % Math.PI;
            r2 = (a2 - a1) % Math.PI;

            return r1 < r2 ? -r1 : r2;
        },

        // Change heading to ang
        changeHeadingAbs: function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            window.goalCoordinates = {
                x: Math.round(
                    window.snake.xx + (bot.headCircle.radius) * cos),
                y: Math.round(
                    window.snake.yy + (bot.headCircle.radius) * sin)
            };

            /*if (window.visualDebugging) {
                canvas.drawLine({
                    x: window.snake.xx,
                    y: window.snake.yy},
                    window.goalCoordinates, 'yellow', '8');
            }*/

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading by ang
        // +0-pi turn left
        // -0-pi turn right

        changeHeadingRel: function (angle) {
            var heading = {
                x: window.snake.xx + 500 * bot.cos,
                y: window.snake.yy + 500 * bot.sin
            };

            var cos = Math.cos(-angle);
            var sin = Math.sin(-angle);

            window.goalCoordinates = {
                x: Math.round(
                    cos * (heading.x - window.snake.xx) -
                    sin * (heading.y - window.snake.yy) + window.snake.xx),
                y: Math.round(
                    sin * (heading.x - window.snake.xx) +
                    cos * (heading.y - window.snake.yy) + window.snake.yy)
            };

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Change heading to the best angle for avoidance.
        headingBestAngle: function () {
            var best;
            var distance;
            var openAngles = [];
            var openStart;

            var sIndex = bot.getAngleIndex(window.snake.ehang) + bot.MAXARC / 2;
            if (sIndex > bot.MAXARC) sIndex -= bot.MAXARC;

            for (var i = 0; i < bot.MAXARC; i++) {
                if (bot.collisionAngles[i] === undefined) {
                    distance = 0;
                    if (openStart === undefined) openStart = i;
                } else {
                    distance = bot.collisionAngles[i].distance;
                    if (openStart) {
                        openAngles.push({
                            openStart: openStart,
                            openEnd: i - 1,
                            sz: (i - 1) - openStart
                        });
                        openStart = undefined;
                    }
                }

                if (best === undefined ||
                    (best.distance < distance && best.distance !== 0)) {
                    best = {
                        distance: distance,
                        aIndex: i
                    };
                }
            }

            if (openStart && openAngles[0]) {
                openAngles[0].openStart = openStart;
                openAngles[0].sz = openAngles[0].openEnd - openStart;
                if (openAngles[0].sz < 0) openAngles[0].sz += bot.MAXARC;

            } else if (openStart) {
                openAngles.push({openStart: openStart, openEnd: openStart, sz: 0});
            }

            if (openAngles.length > 0) {
                openAngles.sort(bot.sortSz);
                bot.changeHeadingAbs(
                    (openAngles[0].openEnd - openAngles[0].sz / 2) * bot.opt.arcSize);
            } else {
                bot.changeHeadingAbs(best.aIndex * bot.opt.arcSize);
            }
        },

        // Avoid collision point by ang
        // ang radians <= Math.PI (180deg)
        avoidCollisionPoint: function (point, ang) {
            if (ang === undefined || ang > Math.PI) {
                ang = Math.PI;
            }

            var end = {
                x: window.snake.xx + 2000 * bot.cos,
                y: window.snake.yy + 2000 * bot.sin
            };

            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    end,
                    'orange', 5);
                canvas.drawLine(
                    { x: window.snake.xx, y: window.snake.yy },
                    { x: point.x, y: point.y },
                    'red', 5);
            }

            if (canvas.isLeft(
                { x: window.snake.xx, y: window.snake.yy }, end,
                { x: point.x, y: point.y })) {
                bot.changeHeadingAbs(point.ang - ang);
            } else {
                bot.changeHeadingAbs(point.ang + ang);
            }
        },

        // get collision angle index, expects angle +/i 0 to Math.PI
        getAngleIndex: function (angle) {
            var index;

            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            index = Math.round(angle * (1 / bot.opt.arcSize));

            if (index === bot.MAXARC) {
                return 0;
            }
            return index;
        },

        // Add to collisionAngles if distance is closer
        addCollisionAngle: function (sp) {
            var ang = canvas.fastAtan2(
                Math.round(sp.yy - window.snake.yy),
                Math.round(sp.xx - window.snake.xx));
            var aIndex = bot.getAngleIndex(ang);

            var actualDistance = Math.round(Math.pow(
                Math.sqrt(sp.distance) - sp.radius, 2));

            if (bot.collisionAngles[aIndex] === undefined ||
                 bot.collisionAngles[aIndex].distance > sp.distance) {
                bot.collisionAngles[aIndex] = {
                    x: Math.round(sp.xx),
                    y: Math.round(sp.yy),
                    ang: ang,
                    snake: sp.snake,
                    distance: actualDistance,
                    radius: sp.radius,
                    aIndex: aIndex
                };
            }
        },

        // Add and score foodAngles
        addFoodAngle: function (f) {
            var ang = canvas.fastAtan2(
                Math.round(f.yy - window.snake.yy),
                Math.round(f.xx - window.snake.xx));

            var aIndex = bot.getAngleIndex(ang);

            canvas.getDistance2FromSnake(f);

            if (bot.collisionAngles[aIndex] === undefined ||
                Math.sqrt(bot.collisionAngles[aIndex].distance) >
                Math.sqrt(f.distance) + bot.snakeRadius * bot.opt.radiusMult * bot.speedMult / 2) {
                if (bot.foodAngles[aIndex] === undefined) {
                    bot.foodAngles[aIndex] = {
                        x: Math.round(f.xx),
                        y: Math.round(f.yy),
                        ang: ang,
                        da: Math.abs(bot.angleBetween(ang, window.snake.ehang)),
                        distance: f.distance,
                        sz: f.sz,
                        score: Math.pow(f.sz, 2) / f.distance
                    };
                } else {
                    bot.foodAngles[aIndex].sz += Math.round(f.sz);
                    bot.foodAngles[aIndex].score += Math.pow(f.sz, 2) / f.distance;
                    if (bot.foodAngles[aIndex].distance > f.distance) {
                        bot.foodAngles[aIndex].x = Math.round(f.xx);
                        bot.foodAngles[aIndex].y = Math.round(f.yy);
                        bot.foodAngles[aIndex].distance = f.distance;
                    }
                }
            }
        },

        // Get closest collision point per snake.
        getCollisionPoints: function () {
            var scPoint;

            bot.collisionPoints = [];
            bot.collisionAngles = [];


            for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
                scPoint = undefined;

                if (window.snakes[snake].id !== window.snake.id &&
                    window.snakes[snake].alive_amt === 1) {

                    var s = window.snakes[snake];
                    var sRadius = bot.getSnakeWidth(s.sc) / 2;
                    var sSpMult = Math.min(1, s.sp / 5.78 - 1 );

                    scPoint = {
                        xx: s.xx + Math.cos(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        yy: s.yy + Math.sin(s.ehang) * sRadius * sSpMult * bot.opt.radiusMult / 2,
                        snake: snake,
                        radius: bot.headCircle.radius,
                        head: true
                    };

                    canvas.getDistance2FromSnake(scPoint);
                    bot.addCollisionAngle(scPoint);
                    bot.collisionPoints.push(scPoint);

                    if (window.visualDebugging) {
                        canvas.drawCircle(canvas.circle(
                            scPoint.xx,
                            scPoint.yy,
                            scPoint.radius),
                            'red', false);
                    }

                    scPoint = undefined;

                    for (var pts = 0, lp = s.pts.length; pts < lp; pts++) {
                        if (!s.pts[pts].dying &&
                            canvas.pointInRect(
                                {
                                    x: s.pts[pts].xx,
                                    y: s.pts[pts].yy
                                }, bot.sectorBox)
                        ) {
                            var collisionPoint = {
                                xx: s.pts[pts].xx,
                                yy: s.pts[pts].yy,
                                snake: snake,
                                radius: sRadius
                            };

                            if (window.visualDebugging && true === false) {
                                canvas.drawCircle(canvas.circle(
                                    collisionPoint.xx,
                                    collisionPoint.yy,
                                    collisionPoint.radius),
                                    '#00FF00', false);
                            }

                            canvas.getDistance2FromSnake(collisionPoint);
                            bot.addCollisionAngle(collisionPoint);

                            if (collisionPoint.distance <= Math.pow(
                                (bot.headCircle.radius)
                                + collisionPoint.radius, 2)) {
                                bot.collisionPoints.push(collisionPoint);
                                if (window.visualDebugging) {
                                    canvas.drawCircle(canvas.circle(
                                        collisionPoint.xx,
                                        collisionPoint.yy,
                                        collisionPoint.radius
                                    ), 'red', false);
                                }
                            }
                        }
                    }
                }
            }

            // WALL
            if (canvas.getDistance2(bot.MID_X, bot.MID_Y, window.snake.xx, window.snake.yy) >
                Math.pow(bot.MAP_R - 1000, 2)) {
                var midAng = canvas.fastAtan2(
                    window.snake.yy - bot.MID_X, window.snake.xx - bot.MID_Y);
                scPoint = {
                    xx: bot.MID_X + bot.MAP_R * Math.cos(midAng),
                    yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng),
                    snake: -1,
                    radius: bot.snakeWidth
                };
                canvas.getDistance2FromSnake(scPoint);
                bot.collisionPoints.push(scPoint);
                bot.addCollisionAngle(scPoint);
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        scPoint.xx,
                        scPoint.yy,
                        scPoint.radius
                    ), 'yellow', false);
                }
            }


            bot.collisionPoints.sort(bot.sortDistance);
            if (window.visualDebugging) {
                for (var i = 0; i < bot.collisionAngles.length; i++) {
                    if (bot.collisionAngles[i] !== undefined) {
                        canvas.drawLine(
                            { x: window.snake.xx, y: window.snake.yy },
                            { x: bot.collisionAngles[i].x, y: bot.collisionAngles[i].y },
                            'red', 2);
                    }
                }
            }
        },

        // Is collisionPoint (xx) in frontAngle
        inFrontAngle: function (point) {
            var ang = canvas.fastAtan2(
                Math.round(point.y - window.snake.yy),
                Math.round(point.x - window.snake.xx));

            if (Math.abs(bot.angleBetween(ang, window.snake.ehang)) < bot.opt.frontAngle) {
                return true;
            } else {
                return false;
            }

        },

        // Checks to see if you are going to collide with anything in the collision detection radius
        checkCollision: function () {
            var point;

            bot.getCollisionPoints();
            if (bot.collisionPoints.length === 0) return false;

            for (var i = 0; i < bot.collisionPoints.length; i++) {
                var collisionCircle = canvas.circle(
                    bot.collisionPoints[i].xx,
                    bot.collisionPoints[i].yy,
                    bot.collisionPoints[i].radius
                );

                // -1 snake is special case for non snake object.
                if ((point = canvas.circleIntersect(bot.headCircle, collisionCircle)) &&
                    bot.inFrontAngle(point)) {
                    if (bot.collisionPoints[i].snake !== -1 &&
                        bot.collisionPoints[i].head &&
                        window.snakes[bot.collisionPoints[i].snake].sp > 10) {
                        window.setAcceleration(1);
                    } else {
                        window.setAcceleration(bot.defaultAccel);
                    }
                    bot.avoidCollisionPoint(point);
                    return true;
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        checkEncircle: function () {
            var enSnake = [];
            var high = 0;
            var highSnake;
            var enAll = 0;

            for (var i = 0; i < bot.collisionAngles.length; i++) {
                if (bot.collisionAngles[i] !== undefined) {
                    var s = bot.collisionAngles[i].snake;
                    if (enSnake[s]) {
                        enSnake[s]++;
                    } else {
                        enSnake[s] = 1;
                    }
                    if (enSnake[s] > high) {
                        high = enSnake[s];
                        highSnake = s;
                    }

                    if (bot.collisionAngles[i].distance <
                        Math.pow(bot.snakeRadius * bot.opt.enCircleDistanceMult, 2)) {
                        enAll++;
                    }
                }
            }

            if (high > bot.MAXARC * bot.opt.enCircleThreshold) {
                bot.headingBestAngle();

                if (high !== bot.MAXARC && window.snakes[highSnake].sp > 10) {
                    window.setAcceleration(1);
                } else {
                    window.setAcceleration(bot.defaultAccel);
                }

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.opt.radiusMult * bot.snakeRadius),
                        'red', true, 0.2);
                }
                return true;
            }

            if (enAll > bot.MAXARC * bot.opt.enCircleAllThreshold) {
                bot.headingBestAngle();
                window.setAcceleration(bot.defaultAccel);

                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow', true, 0.2);
                }
                return true;
            } else {
                if (window.visualDebugging) {
                    canvas.drawCircle(canvas.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow');
                }
            }

            window.setAcceleration(bot.defaultAccel);
            return false;
        },

        populatePts: function () {
            let x = window.snake.xx + window.snake.fx;
            let y = window.snake.yy + window.snake.fy;
            let l = 0.0;
            bot.pts = [{
                x: x,
                y: y,
                len: l
            }];
            for (let p = window.snake.pts.length - 1; p >= 0; p--) {
                if (window.snake.pts[p].dying) {
                    continue;
                } else {
                    let xx = window.snake.pts[p].xx + window.snake.pts[p].fx;
                    let yy = window.snake.pts[p].yy + window.snake.pts[p].fy;
                    let ll = l + Math.sqrt(canvas.getDistance2(x, y, xx, yy));
                    bot.pts.push({
                        x: xx,
                        y: yy,
                        len: ll
                    });
                    x = xx;
                    y = yy;
                    l = ll;
                }
            }
            bot.len = l;
        },

        // set the direction of rotation based on the velocity of
        // the head with respect to the center of mass
        determineCircleDirection: function () {
            // find center mass (cx, cy)
            let cx = 0.0;
            let cy = 0.0;
            let pn = bot.pts.length;
            for (let p = 0; p < pn; p++) {
                cx += bot.pts[p].x;
                cy += bot.pts[p].y;
            }
            cx /= pn;
            cy /= pn;

            // vector from (cx, cy) to the head
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            let dx = head.x - cx;
            let dy = head.y - cy;

            // check the sign of dot product of (bot.cos, bot.sin) and (-dy, dx)
						if (smartBot) {
	            if (- dy * bot.cos + dx * bot.sin > 0) {
	                // clockwise
	                bot.opt.followCircleDirection = -1;
	            } else {
	                // couter clockwise
	                bot.opt.followCircleDirection = +1;
	            }
						}
						else
							bot.opt.followCircleDirection = +1;

        },

        // returns a point on snake's body on given length from the head
        // assumes that bot.pts is populated
        smoothPoint: function (t) {
            // range check
            if (t >= bot.len) {
                let tail = bot.pts[bot.pts.length - 1];
                return {
                    x: tail.x,
                    y: tail.y
                };
            } else if (t <= 0 ) {
                return {
                    x: bot.pts[0].x,
                    y: bot.pts[0].y
                };
            }
            // binary search
            let p = 0;
            let q = bot.pts.length - 1;
            while (q - p > 1) {
                let m = Math.round((p + q) / 2);
                if (t > bot.pts[m].len) {
                    p = m;
                } else {
                    q = m;
                }
            }
            // now q = p + 1, and the point is in between;
            // compute approximation
            let wp = bot.pts[q].len - t;
            let wq = t - bot.pts[p].len;
            let w = wp + wq;
            return {
                x: (wp * bot.pts[p].x + wq * bot.pts[q].x) / w,
                y: (wp * bot.pts[p].y + wq * bot.pts[q].y) / w
            };
        },

        // finds a point on snake's body closest to the head;
        // returns length from the head
        // excludes points close to the head
        closestBodyPoint: function () {
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let ptsLength = bot.pts.length;

            // skip head area
            let start_n = 0;
            let start_d2 = 0.0;
            for ( ;; ) {
                let prev_d2 = start_d2;
                start_n ++;
                start_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[start_n].x, bot.pts[start_n].y);
                if (start_d2 < prev_d2 || start_n === ptsLength - 1) {
                    break;
                }
            }

            if (start_n >= ptsLength || start_n <= 1) {
                return bot.len;
            }

            // find closets point in bot.pts
            let min_n = start_n;
            let min_d2 = start_d2;
            for (let n = min_n + 1; n < ptsLength; n++) {
                let d2 = canvas.getDistance2(head.x, head.y, bot.pts[n].x, bot.pts[n].y);
                if (d2 < min_d2) {
                    min_n = n;
                    min_d2 = d2;
                }
            }

            // find second closest point
            let next_n = min_n;
            let next_d2 = min_d2;
            if (min_n === ptsLength - 1) {
                next_n = min_n - 1;
                next_d2 = canvas.getDistance2(head.x, head.y,
                    bot.pts[next_n].x, bot.pts[next_n].y);
            } else {
                let d2m = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n - 1].x, bot.pts[min_n - 1].y);
                let d2p = canvas.getDistance2(head.x, head.y,
                    bot.pts[min_n + 1].x, bot.pts[min_n + 1].y);
                if (d2m < d2p) {
                    next_n = min_n - 1;
                    next_d2 = d2m;
                } else {
                    next_n = min_n + 1;
                    next_d2 = d2p;
                }
            }

            // compute approximation
            let t2 = bot.pts[min_n].len - bot.pts[next_n].len;
            t2 *= t2;

            if (t2 === 0) {
                return bot.pts[min_n].len;
            } else {
                let min_w = t2 - (min_d2 - next_d2);
                let next_w = t2 + (min_d2 - next_d2);
                return (bot.pts[min_n].len * min_w + bot.pts[next_n].len * next_w) / (2 * t2);
            }
        },

        bodyDangerZone: function (
            offset, targetPoint, targetPointNormal, closePointDist, pastTargetPoint, closePoint) {
            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            const o = bot.opt.followCircleDirection;
            var pts = [
                {
                    x: head.x - o * offset * bot.sin,
                    y: head.y + o * offset * bot.cos
                },
                {
                    x: head.x + bot.snakeWidth * bot.cos +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + bot.snakeWidth * bot.sin +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 1.75 * bot.snakeWidth * bot.cos +
                        o * 0.3 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 1.75 * bot.snakeWidth * bot.sin -
                        o * 0.3 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 2.5 * bot.snakeWidth * bot.cos +
                        o * 0.7 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 2.5 * bot.snakeWidth * bot.sin -
                        o * 0.7 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 3 * bot.snakeWidth * bot.cos +
                        o * 1.2 * bot.snakeWidth * bot.sin +
                        offset * bot.cos,
                    y: head.y + 3 * bot.snakeWidth * bot.sin -
                        o * 1.2 * bot.snakeWidth * bot.cos +
                        offset * bot.sin
                },
                {
                    x: targetPoint.x +
                        targetPointNormal.x * (offset + 0.5 * Math.max(closePointDist, 0)),
                    y: targetPoint.y +
                        targetPointNormal.y * (offset + 0.5 * Math.max(closePointDist, 0))
                },
                {
                    x: pastTargetPoint.x + targetPointNormal.x * offset,
                    y: pastTargetPoint.y + targetPointNormal.y * offset
                },
                pastTargetPoint,
                targetPoint,
                closePoint
            ];
            pts = canvas.convexHull(pts);
            var poly = {
                pts: pts
            };
            poly = canvas.addPolyBox(poly);
            return (poly);
        },

        followCircleSelf: function () {

            bot.populatePts();
            bot.determineCircleDirection();
            const o = bot.opt.followCircleDirection;


            // exit if too short
            if (bot.len < 9 * bot.snakeWidth) {
                return;
            }

            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let closePointT = bot.closestBodyPoint();
            let closePoint = bot.smoothPoint(closePointT);

            // approx tangent and normal vectors and closePoint
            var closePointNext = bot.smoothPoint(closePointT - bot.snakeWidth);
            var closePointTangent = canvas.unitVector({
                x: closePointNext.x - closePoint.x,
                y: closePointNext.y - closePoint.y});
            var closePointNormal = {
                x: - o * closePointTangent.y,
                y:   o * closePointTangent.x
            };

            // angle wrt closePointTangent
            var currentCourse = Math.asin(Math.max(
                -1, Math.min(1, bot.cos * closePointNormal.x + bot.sin * closePointNormal.y)));

            // compute (oriented) distance from the body at closePointDist
            var closePointDist = (head.x - closePoint.x) * closePointNormal.x +
                (head.y - closePoint.y) * closePointNormal.y;

            // construct polygon for snake inside
            var insidePolygonStartT = 5 * bot.snakeWidth;
            var insidePolygonEndT = closePointT + 5 * bot.snakeWidth;
            var insidePolygonPts = [
                bot.smoothPoint(insidePolygonEndT),
                bot.smoothPoint(insidePolygonStartT)
            ];
            for (let t = insidePolygonStartT; t < insidePolygonEndT; t += bot.snakeWidth) {
                insidePolygonPts.push(bot.smoothPoint(t));
            }

            var insidePolygon = canvas.addPolyBox({
                pts: insidePolygonPts
            });

            // get target point; this is an estimate where we land if we hurry
            var targetPointT = closePointT;
            var targetPointFar = 0.0;
            let targetPointStep = bot.snakeWidth / 64;
            for (let h = closePointDist, a = currentCourse; h >= 0.125 * bot.snakeWidth; ) {
                targetPointT -= targetPointStep;
                targetPointFar += targetPointStep * Math.cos(a);
                h += targetPointStep * Math.sin(a);
                a = Math.max(-Math.PI / 4, a - targetPointStep / bot.snakeWidth);
            }

            var targetPoint = bot.smoothPoint(targetPointT);

            var pastTargetPointT = targetPointT - 3 * bot.snakeWidth;
            var pastTargetPoint = bot.smoothPoint(pastTargetPointT);

            // look for danger from enemies
            var enemyBodyOffsetDelta = 0.25 * bot.snakeWidth;
            var enemyHeadDist2 = 64 * 64 * bot.snakeWidth * bot.snakeWidth;
            for (let snake = 0, snakesNum = window.snakes.length; snake < snakesNum; snake++) {
                if (window.snakes[snake].id !== window.snake.id
                    && window.snakes[snake].alive_amt === 1) {
                    let enemyHead = {
                        x: window.snakes[snake].xx + window.snakes[snake].fx,
                        y: window.snakes[snake].yy + window.snakes[snake].fy
                    };
                    let enemyAhead = {
                        x: enemyHead.x +
                            Math.cos(window.snakes[snake].ang) * bot.snakeWidth,
                        y: enemyHead.y +
                            Math.sin(window.snakes[snake].ang) * bot.snakeWidth
                    };
                    // heads
                    if (!canvas.pointInPoly(enemyHead, insidePolygon)) {
                        enemyHeadDist2 = Math.min(
                            enemyHeadDist2,
                            canvas.getDistance2(enemyHead.x,  enemyHead.y,
                                targetPoint.x, targetPoint.y),
                            canvas.getDistance2(enemyAhead.x, enemyAhead.y,
                                targetPoint.x, targetPoint.y)
                            );
                    }
                    // bodies
                    let offsetSet = false;
                    let offset = 0.0;
                    let cpolbody = {};
                    for (let pts = 0, ptsNum = window.snakes[snake].pts.length;
                        pts < ptsNum; pts++) {
                        if (!window.snakes[snake].pts[pts].dying) {
                            let point = {
                                x: window.snakes[snake].pts[pts].xx +
                                   window.snakes[snake].pts[pts].fx,
                                y: window.snakes[snake].pts[pts].yy +
                                   window.snakes[snake].pts[pts].fy
                            };
                            while (!offsetSet || (enemyBodyOffsetDelta >= -bot.snakeWidth
                                && canvas.pointInPoly(point, cpolbody))) {
                                if (!offsetSet) {
                                    offsetSet = true;
                                } else {
                                    enemyBodyOffsetDelta -= 0.0625 * bot.snakeWidth;
                                }
                                offset = 0.5 * (bot.snakeWidth +
                                    bot.getSnakeWidth(window.snakes[snake].sc)) +
                                    enemyBodyOffsetDelta;
                                cpolbody = bot.bodyDangerZone(
                                    offset, targetPoint, closePointNormal, closePointDist,
                                    pastTargetPoint, closePoint);

                            }
                        }
                    }
                }
            }
            var enemyHeadDist = Math.sqrt(enemyHeadDist2);

            // plot inside polygon
            if (window.visualDebugging) {
                for (let p = 0, l = insidePolygon.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q === l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: insidePolygon.pts[p].x, y: insidePolygon.pts[p].y},
                        {x: insidePolygon.pts[q].x, y: insidePolygon.pts[q].y},
                        'orange');
                }
            }

            // mark closePoint
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    closePoint.x,
                    closePoint.y,
                    bot.snakeWidth * 0.25
                ), 'white', false);
            }

            // mark safeZone
            if (window.visualDebugging) {
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    bot.snakeWidth + 2 * targetPointFar
                ), 'white', false);
                canvas.drawCircle(canvas.circle(
                    targetPoint.x,
                    targetPoint.y,
                    0.2 * bot.snakeWidth
                ), 'white', false);
            }

            // draw sample cpolbody
            if (window.visualDebugging) {
                let soffset = 0.5 * bot.snakeWidth;
                let scpolbody = bot.bodyDangerZone(
                    soffset, targetPoint, closePointNormal,
                    closePointDist, pastTargetPoint, closePoint);
                for (let p = 0, l = scpolbody.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q === l) {
                        q = 0;
                    }
                    canvas.drawLine(
                        {x: scpolbody.pts[p].x, y: scpolbody.pts[p].y},
                        {x: scpolbody.pts[q].x, y: scpolbody.pts[q].y},
                        'white');
                }
            }

            // TAKE ACTION

            // expand?
            let targetCourse = currentCourse + 0.25;
            // enemy head nearby?
            let headProx = -1.0 - (2 * targetPointFar - enemyHeadDist) / bot.snakeWidth;
            if (headProx > 0) {
                headProx = 0.125 * headProx * headProx;
            } else {
                headProx = - 0.5 * headProx * headProx;
            }
            targetCourse = Math.min(targetCourse, headProx);
            // enemy body nearby?
            targetCourse = Math.min(
                targetCourse, targetCourse + (enemyBodyOffsetDelta - 0.0625 * bot.snakeWidth) /
                bot.snakeWidth);
            // small tail?
            var tailBehind = bot.len - closePointT;
            var targetDir = canvas.unitVector({
                x: bot.opt.followCircleTarget.x - head.x,
                y: bot.opt.followCircleTarget.y - head.y
            });
            var driftQ = targetDir.x * closePointNormal.x + targetDir.y * closePointNormal.y;
            driftQ = 0;
            var allowTail = bot.snakeWidth * (2 - 0.5 * driftQ);
            // a line in the direction of the target point
            if (window.visualDebugging) {
                canvas.drawLine(
                    { x: head.x, y: head.y },
                    { x: head.x + allowTail * targetDir.x, y: head.y + allowTail * targetDir.y },
                    'red');
            }
            targetCourse = Math.min(
                targetCourse,
                (tailBehind - allowTail + (bot.snakeWidth - closePointDist)) /
                bot.snakeWidth);
            // far away?
            targetCourse = Math.min(
                targetCourse, - 0.5 * (closePointDist - 4 * bot.snakeWidth) / bot.snakeWidth);
            // final corrections
            // too fast in?
            targetCourse = Math.max(targetCourse, -0.75 * closePointDist / bot.snakeWidth);
            // too fast out?
            targetCourse = Math.min(targetCourse, 1.0);

            var goalDir = {
                x: closePointTangent.x * Math.cos(targetCourse) -
                    o * closePointTangent.y * Math.sin(targetCourse),
                y: closePointTangent.y * Math.cos(targetCourse) +
                    o * closePointTangent.x * Math.sin(targetCourse)
            };
            var goal = {
                x: head.x + goalDir.x * 4 * bot.snakeWidth,
                y: head.y + goalDir.y * 4 * bot.snakeWidth
            };


            if (window.goalCoordinates
                && Math.abs(goal.x - window.goalCoordinates.x) < 1000
                && Math.abs(goal.y - window.goalCoordinates.y) < 1000) {
                window.goalCoordinates = {
                    x: Math.round(goal.x * 0.25 + window.goalCoordinates.x * 0.75),
                    y: Math.round(goal.y * 0.25 + window.goalCoordinates.y * 0.75)
                };
            } else {
                window.goalCoordinates = {
                    x: Math.round(goal.x),
                    y: Math.round(goal.y)
                };
            }

            canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
        },

        // Sorting by property 'score' descending
        sortScore: function (a, b) {
            return b.score - a.score;
        },

        // Sorting by property 'sz' descending
        sortSz: function (a, b) {
            return b.sz - a.sz;
        },

        // Sorting by property 'distance' ascending
        sortDistance: function (a, b) {
            return a.distance - b.distance;
        },

        computeFoodGoal: function () {
            bot.foodAngles = [];

            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                var f = window.foods[i];

                if (!f.eaten &&
                    !(
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_l) ||
                        canvas.circleIntersect(
                            canvas.circle(f.xx, f.yy, 2),
                            bot.sidecircle_r))) {
                    bot.addFoodAngle(f);
                }
            }

            bot.foodAngles.sort(bot.sortScore);

            if (bot.foodAngles[0] !== undefined && bot.foodAngles[0].sz > 0) {
                bot.currentFood = { x: bot.foodAngles[0].x,
                                    y: bot.foodAngles[0].y,
                                    sz: bot.foodAngles[0].sz,
                                    da: bot.foodAngles[0].da };
            } else {
                bot.currentFood = { x: bot.MID_X, y: bot.MID_Y, sz: 0 };
            }
        },

        foodAccel: function () {
            var aIndex = 0;

            if (bot.currentFood && bot.currentFood.sz > bot.opt.foodAccelSz) {
                aIndex = bot.getAngleIndex(bot.currentFood.ang);

                if (
                    bot.collisionAngles[aIndex] && bot.collisionAngles[aIndex].distance >
                    bot.currentFood.distance + bot.snakeRadius * bot.opt.radiusMult
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }

                if (bot.collisionAngles[aIndex] === undefined
                    && bot.currentFood.da < bot.opt.foodAccelDa) {
                    return 1;
                }
            }

            return bot.defaultAccel;
        },

        toCircle: function () {
            for (var i = 0; i < window.snake.pts.length && window.snake.pts[i].dying; i++);
            const o = bot.opt.followCircleDirection;
            var tailCircle = canvas.circle(
                window.snake.pts[i].xx,
                window.snake.pts[i].yy,
                bot.headCircle.radius
            );

            if (window.visualDebugging) {
                canvas.drawCircle(tailCircle, 'blue', false);
            }

            window.setAcceleration(bot.defaultAccel);
            bot.changeHeadingRel(o * Math.PI / 32);

            if (canvas.circleIntersect(bot.headCircle, tailCircle)) {
                bot.stage = 'circle';
            }
        },

        every: function () {
            bot.MID_X = window.grd;
            bot.MID_Y = window.grd;
            bot.MAP_R = window.grd * 0.98;
            bot.MAXARC = (2 * Math.PI) / bot.opt.arcSize;

            if (bot.opt.followCircleTarget === undefined) {
                bot.opt.followCircleTarget = {
                    x: bot.MID_X,
                    y: bot.MID_Y
                };
            }

            bot.sectorBoxSide = Math.floor(Math.sqrt(window.sectors.length)) * window.sector_size;
            bot.sectorBox = canvas.rect(
                window.snake.xx - (bot.sectorBoxSide / 2),
                window.snake.yy - (bot.sectorBoxSide / 2),
                bot.sectorBoxSide, bot.sectorBoxSide);
            // if (window.visualDebugging) canvas.drawRect(bot.sectorBox, '#c0c0c0', true, 0.1);

            bot.cos = Math.cos(window.snake.ang);
            bot.sin = Math.sin(window.snake.ang);

            bot.speedMult = window.snake.sp / bot.opt.speedBase;
            bot.snakeRadius = bot.getSnakeWidth() / 2;
            bot.snakeWidth = bot.getSnakeWidth();
            bot.snakeLength = Math.floor(15 * (window.fpsls[window.snake.sct] + window.snake.fam /
                window.fmlts[window.snake.sct] - 1) - 5);

            bot.headCircle = canvas.circle(
                window.snake.xx + bot.cos * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                window.snake.yy + bot.sin * Math.min(1, bot.speedMult - 1) *
                bot.opt.radiusMult / 2 * bot.snakeRadius,
                bot.opt.radiusMult / 2 * bot.snakeRadius
            );


            if (window.visualDebugging) {
                canvas.drawCircle(bot.headCircle, 'blue', false);
            }

            bot.sidecircle_r = canvas.circle(
                window.snake.lnp.xx -
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy +
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );

            bot.sidecircle_l = canvas.circle(
                window.snake.lnp.xx +
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy -
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );
        },

        // Main bot
        go: function () {
            bot.every();

            bot.stage = 'circle';

					if (smartBot)
          if (bot.snakeLength < bot.opt.followCircleLength) {
              bot.stage = 'grow';
          }


            if (bot.currentFood && bot.stage !== 'grow') {
                bot.currentFood = undefined;
            }

            if (bot.stage === 'circle') {
                window.setAcceleration(bot.defaultAccel);
                bot.followCircleSelf();
            } else if (bot.checkCollision() || bot.checkEncircle()) {
                if (bot.actionTimeout) {
                    window.clearTimeout(bot.actionTimeout);
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.collisionDelay);
                }
            } else {
                if (bot.snakeLength > bot.opt.followCircleLength) {
                    bot.stage = 'tocircle';
                }
                if (bot.actionTimeout === undefined) {
                    bot.actionTimeout = window.setTimeout(
                        bot.actionTimer, 1000 / bot.opt.targetFps * bot.opt.actionFrames);
                }
                window.setAcceleration(bot.foodAccel());
            }
        },

        // Timer version of food check
        actionTimer: function () {
            if (window.playing && window.snake !== null && window.snake.alive_amt === 1) {
                if (bot.stage === 'grow') {
                    bot.computeFoodGoal();
                    window.goalCoordinates = bot.currentFood;
                    canvas.setMouseCoordinates(canvas.mapToMouse(window.goalCoordinates));
                } else if (bot.stage === 'tocircle') {
                    bot.toCircle();
                }
            }
            bot.actionTimeout = undefined;
        }
    };
})(window);

var userInterface = window.userInterface = (function (window, document) {
    // Save the original slither.io functions so we can modify them, or reenable them later.
    var original_keydown = document.onkeydown;
    var original_onmouseDown = window.onmousedown;
    var original_oef = window.oef;
    var original_redraw = window.redraw;
    var original_onmousemove = window.onmousemove;

    window.oef = function () { };
    window.redraw = function () { };

    return {
        overlays: {},
        gfxEnabled: true,

        initServerIp: function () {
            var parent = document.getElementById('playh');
            var serverDiv = document.createElement('div');
            var serverIn = document.createElement('input');

            serverDiv.style.width = '244px';
            serverDiv.style.margin = '-30px auto';
            serverDiv.style.boxShadow = 'rgb(0, 0, 0) 0px 6px 50px';
            serverDiv.style.opacity = 1;
            serverDiv.style.background = 'rgb(76, 68, 124)';
            serverDiv.className = 'taho';
            serverDiv.style.display = 'block';

            serverIn.className = 'sumsginp';
            serverIn.placeholder = '0.0.0.0:444';
            serverIn.maxLength = 21;
            serverIn.style.width = '220px';
            serverIn.style.height = '24px';

            serverDiv.appendChild(serverIn);
            parent.appendChild(serverDiv);

            userInterface.server = serverIn;

	        },

        initOverlays: function () {
            var botOverlay = document.createElement('div');
            botOverlay.style.position = 'fixed';
            botOverlay.style.right = '5px';
            botOverlay.style.bottom = '112px';
            botOverlay.style.width = '150px';
            botOverlay.style.height = '85px';
            // botOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            botOverlay.style.color = '#C0C0C0';
            botOverlay.style.fontFamily = 'Consolas, Verdana';
            botOverlay.style.zIndex = 999;
            botOverlay.style.fontSize = '14px';
            botOverlay.style.padding = '5px';
            botOverlay.style.borderRadius = '5px';
            botOverlay.className = 'nsi';
            document.body.appendChild(botOverlay);

            var serverOverlay = document.createElement('div');
            serverOverlay.style.position = 'fixed';
            serverOverlay.style.right = '5px';
            serverOverlay.style.bottom = '5px';
            serverOverlay.style.width = '160px';
            serverOverlay.style.height = '14px';
            serverOverlay.style.color = '#C0C0C0';
            serverOverlay.style.fontFamily = 'Consolas, Verdana';
            serverOverlay.style.zIndex = 999;
            serverOverlay.style.fontSize = '14px';
            serverOverlay.className = 'nsi';
            document.body.appendChild(serverOverlay);

            var prefOverlay = document.createElement('div');
            prefOverlay.style.position = 'fixed';
            prefOverlay.style.left = '10px';
            prefOverlay.style.top = '75px';
            prefOverlay.style.width = '260px';
            prefOverlay.style.height = '210px';
            // prefOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            prefOverlay.style.color = '#C0C0C0';
            prefOverlay.style.fontFamily = 'Consolas, Verdana';
            prefOverlay.style.zIndex = 999;
            prefOverlay.style.fontSize = '14px';
            prefOverlay.style.padding = '5px';
            prefOverlay.style.borderRadius = '5px';
            prefOverlay.className = 'nsi';
            document.body.appendChild(prefOverlay);

            var statsOverlay = document.createElement('div');
            statsOverlay.style.position = 'fixed';
            statsOverlay.style.left = '10px';
            statsOverlay.style.top = '390px';
            statsOverlay.style.width = '140px';
            statsOverlay.style.height = '210px';
            // statsOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            statsOverlay.style.color = '#C0C0C0';
            statsOverlay.style.fontFamily = 'Consolas, Verdana';
            statsOverlay.style.zIndex = 998;
            statsOverlay.style.fontSize = '14px';
            statsOverlay.style.padding = '5px';
            statsOverlay.style.borderRadius = '5px';
            statsOverlay.className = 'nsi';
            document.body.appendChild(statsOverlay);

            userInterface.overlays.botOverlay = botOverlay;
            userInterface.overlays.serverOverlay = serverOverlay;
            userInterface.overlays.prefOverlay = prefOverlay;
            userInterface.overlays.statsOverlay = statsOverlay;
            //loadAssets();
        },

        toggleOverlays: function () {
            Object.keys(userInterface.overlays).forEach(function (okey) {
                var oVis = userInterface.overlays[okey].style.visibility !== 'hidden' ?
                    'hidden' : 'visible';
                userInterface.overlays[okey].style.visibility = oVis;
                window.visualDebugging = oVis === 'visible';
            });
        },


        toggleGfx: function () {
          /*  if (userInterface.gfxEnabled) {
                var c = window.mc.getContext('2d');
                c.save();
                c.fillStyle = "#000000",
                c.fillRect(0, 0, window.mww, window.mhh),
                c.restore();

                var d = document.createElement('div');
                d.style.position = 'fixed';
                d.style.top = '50%';
                d.style.left = '50%';
                d.style.width = '200px';
                d.style.height = '60px';
                d.style.color = '#C0C0C0';
                d.style.fontFamily = 'Consolas, Verdana';
                d.style.zIndex = 999;
                d.style.margin = '-30px 0 0 -100px';
                d.style.fontSize = '20px';
                d.style.textAlign = 'center';
                d.className = 'nsi';
                document.body.appendChild(d);
                userInterface.gfxOverlay = d;

                window.lbf.innerHTML = '';
            } else {
                document.body.removeChild(userInterface.gfxOverlay);
                userInterface.gfxOverlay = undefined;
            }

            userInterface.gfxEnabled = !userInterface.gfxEnabled;*/
        },

        // Save variable to local storage
        savePreference: function (item, value) {
            window.localStorage.setItem(item, value);
            userInterface.onPrefChange();
        },

        // Load a variable from local storage
        loadPreference: function (preference, defaultVar) {
            var savedItem = window.localStorage.getItem(preference);
            if (savedItem !== null) {
                if (savedItem === 'true') {
                    window[preference] = true;
                } else if (savedItem === 'false') {
                    window[preference] = false;
                } else {
                    window[preference] = savedItem;
                }
                window.log('Setting found for ' + preference + ': ' + window[preference]);
            } else {
                window[preference] = defaultVar;
                window.log('No setting found for ' + preference +
                    '. Used default: ' + window[preference]);
            }
            userInterface.onPrefChange();
            return window[preference];
        },

        // Saves username when you click on "Play" button
        playButtonClickListener: function () {
            /*userInterface.saveNick();
            userInterface.loadPreference('autoRespawn', false);
            userInterface.onPrefChange();

            if (userInterface.server.value) {
                let s = userInterface.server.value.split(':');
                if (s.length === 2) {
                    window.force_ip = s[0];
                    window.force_port = s[1];
                    bot.connect();
                }
            } else {
                window.force_ip = undefined;
                window.force_port = undefined;
            }*/
        },

        // Preserve nickname
        saveNick: function () {
            /*var nick = document.getElementById('nick').value;
            userInterface.savePreference('savedNick', nick);*/
        },

        // Hide top score
        hideTop: function () {
  /*          var nsidivs = document.querySelectorAll('div.nsi');
            for (var i = 0; i < nsidivs.length; i++) {
                if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
                    nsidivs[i].style.visibility = 'hidden';
                    bot.isTopHidden = true;
                    window.topscore = nsidivs[i];
                }
            }*/
        },

        // Store FPS data
        framesPerSecond: {
            fps: 0,
            fpsTimer: function () {
                if (window.playing && window.fps && window.lrd_mtm) {
                    if (Date.now() - window.lrd_mtm > 970) {
                        userInterface.framesPerSecond.fps = window.fps;
                    }
                }
            }
        },

        onkeydown: function (e) {
            // Original slither.io onkeydown function + whatever is under it
            original_keydown(e);
            if (window.playing) {
                // Letter `T` to toggle bot
                if (e.keyCode === 84) {
                    bot.isBotEnabled = !bot.isBotEnabled;
                }
                if (e.keyCode === 83) { //letter s
                    sosActive = !sosActive;
                }
                if (e.keyCode === 70) { //letter f
                    haveFood = !haveFood;
                }
                if (e.keyCode === 68) { //letter d
                    hideOwnDot = !hideOwnDot;
                }
                if (e.keyCode === 66) { //letter b
                    smartBot = !smartBot;
                }
                if (e.keyCode === 16) { //shift
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }

                }
                if (e.keyCode === 67) { //letter c
                    tinyDots = !tinyDots;
										if (tinyDots) hideOwnDot = true;
                }
								if (e.keyCode === 76) { //letter l
                    hidelist = !hidelist;
                }
                // Letter 'U' to toggle debugging (console)
                //if (e.keyCode === 85) {
//                    window.logDebugging = !window.logDebugging;
//                    console.log('Log debugging set to: ' + window.logDebugging);
//                    userInterface.savePreference('logDebugging', window.logDebugging);
//                }
                // Letter 'Y' to toggle debugging (visual)
//                if (e.keyCode === 89) {
//                    window.visualDebugging = !window.visualDebugging;
//                    console.log('Visual debugging set to: ' + window.visualDebugging);
//                    userInterface.savePreference('visualDebugging', window.visualDebugging);
//                }
                // Letter 'I' to toggle autorespawn
//                if (e.keyCode === 82) {
//                    window.autoRespawn = !window.autoRespawn;
//                    console.log('Automatic Respawning set to: ' + window.autoRespawn);
//                    userInterface.savePreference('autoRespawn', window.autoRespawn);
//                }
                // Letter 'H' to toggle hidden mode
//                if (e.keyCode === 72) {
//                    userInterface.toggleOverlays();
//                }
                // Letter 'G' to toggle graphics
//                if (e.keyCode === 71) {
//                    userInterface.toggleGfx();
//                }
                // Letter 'O' to change rendermode (visual)
                //if (e.keyCode === 79) {
//                    userInterface.toggleMobileRendering(!window.mobileRender);
//                }
                // Letter 'A' to increase collision detection radius
/*                if (e.keyCode === 65) {
                    bot.opt.radiusMult++;
                    console.log(
                        'radiusMult set to: ' + bot.opt.radiusMult);
                }
                // Letter 'S' to decrease collision detection radius
                if (e.keyCode === 68) {
                    if (bot.opt.radiusMult > 1) {
                        bot.opt.radiusMult--;
                        console.log(
                            'radiusMult set to: ' +
                            bot.opt.radiusMult);
                    }
                }
                */
                // Letter 'Z' to reset zoom
                //if (e.keyCode === 90) {
//                    canvas.resetZoom();
//                }
                // Letter 'Q' to quit to main menu
//                if (e.keyCode === 81) {
//                    window.autoRespawn = false;
//                    userInterface.quit();
//                }
                // 'ESC' to quickly respawn
//                if (e.keyCode === 27) {
//                    bot.quickRespawn();
//                }
                userInterface.onPrefChange();
            }
        },

        onmousedown: function (e) {
            if (window.playing) {
                switch (e.which) {
                    // "Left click" to manually speed up the slither
                    case 1:
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }
                        break;
                    case 2:
                        return;
                    // "Right click" to toggle bot in addition to the letter "T"
                    case 3:
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }
//                        bot.isBotEnabled = !bot.isBotEnabled;
                        break;
                }
            } else {
                original_onmouseDown(e);
            }
            userInterface.onPrefChange();
        },

        onmouseup: function (e) {
            bot.defaultAccel = 0;
            switch (e.which) {
                case 2:
                    return;
                case 3:
                    return;
            }
        },

        // Manual mobile rendering
        toggleMobileRendering: function (mobileRendering) {
            window.mobileRender = mobileRendering;
            window.log('Mobile rendering set to: ' + window.mobileRender);
            userInterface.savePreference('mobileRender', window.mobileRender);
            // Set render mode
            if (window.mobileRender) {
                window.render_mode = 1;
                window.want_quality = 0;
                window.high_quality = false;
            } else {
                window.render_mode = 2;
                window.want_quality = 0;
                window.high_quality = false;
            }
        },

        // Update stats overlay.
        updateStats: function () {
            var oContent = [];
            var median;

            if (bot.scores.length === 0) return;

            median = Math.round((bot.scores[Math.floor((bot.scores.length - 1) / 2)] +
                bot.scores[Math.ceil((bot.scores.length - 1) / 2)]) / 2);

            //oContent.push('games played: ' + bot.scores.length);
            //oContent.push('a: ' + Math.round(
//                bot.scores.reduce(function (a, b) { return a + b; }) / (bot.scores.length)) +
//                ' m: ' + median);

            for (var i = 0; i < bot.scores.length && i < 10; i++) {
//                oContent.push(i + 1 + '. ' + bot.scores[i]);
            }

            userInterface.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
        },

        onPrefChange: function () {
            // Set static display options here.
            var oContent = [];
            var ht = userInterface.handleTextColor;

            oContent.push('Mod CLAN TOPO: ' + GM_info.script.version);
            oContent.push('Author:NINJA_TOPO ');
            oContent.push('[T] Bot: ' + ht(bot.isBotEnabled));
            //oContent.push('[O] mobile rendering: ' + ht(window.mobileRender));
//            oContent.push('[A/D] radius multiplier: ' + bot.opt.radiusMult);
//            oContent.push('[S] Friend Help: ' + ht(sosActive));
//           oContent.push('[F] FOOD Active: ' + ht(haveFood));
//            oContent.push('[D] Hide Own Team Dot: ' + ht(hideOwnDot));
//            oContent.push('[R] auto respawn: ' + ht(window.autoRespawn));
            //oContent.push('[Y] visual debugging: ' + ht(window.visualDebugging));
//            oContent.push('[U] log debugging: ' + ht(window.logDebugging));
              oContent.push('[B] Modo Combate: ' + ht(smartBot));
//            oContent.push('[C] tiny dots: ' + ht(tinyDots));
//            oContent.push('[L] hide list: ' + ht(hidelist));
//            oContent.push('[X] reset zoom');
//            oContent.push('[ESC] quick respawn');
            oContent.push('[Q] Voltar Para O Menu');

            userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
        },

        onFrameUpdate: function () {
            // Botstatus overlay
            if (window.playing && window.snake !== null) {
                let oContent = [];

    //            oContent.push('fps: ' + userInterface.framesPerSecond.fps);

                // Display the X and Y of the snake
//                oContent.push('x: ' +
//                    (Math.round(window.snake.xx) || 0) + ' y: ' +
//                    (Math.round(window.snake.yy) || 0));

                if (window.goalCoordinates) {
//                    oContent.push('target');
//                    oContent.push('x: ' + window.goalCoordinates.x + ' y: ' +
//                        window.goalCoordinates.y);
                    if (window.goalCoordinates.sz) {
//                        oContent.push('sz: ' + window.goalCoordinates.sz);
                    }
                }

                userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');

                if (userInterface.gfxOverlay) {
                    let gContent = [];

                    gContent.push('<b>' + window.snake.nk + '</b>');
                    gContent.push(bot.snakeLength);
                    gContent.push('[' + window.rank + '/' + window.snake_count + ']');

                    userInterface.gfxOverlay.innerHTML = gContent.join('<br/>');
                }

                if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
                    window.bso.ip + ':' + window.bso.po) {
                    userInterface.overlays.serverOverlay.innerHTML =
                        window.bso.ip + ':' + window.bso.po;
                }
            }

            if (window.playing && window.visualDebugging) {
                // Only draw the goal when a bot has a goal.
                if (window.goalCoordinates && bot.isBotEnabled) {
                    var headCoord = { x: window.snake.xx, y: window.snake.yy };
                    canvas.drawLine(
                        headCoord,
                        window.goalCoordinates,
                        'green');
                    canvas.drawCircle(window.goalCoordinates, 'red', true);
                }
            }
        },



        oefTimer: function () {
            var start = Date.now();
            canvas.maintainZoom();
            original_oef();
            if (userInterface.gfxEnabled) {
                original_redraw();
            } else {
                window.visualDebugging = false;
            }


            if (window.playing && bot.isBotEnabled && window.snake !== null) {
                window.onmousemove = function () { };
                bot.isBotRunning = true;
                bot.go();
            } else if (bot.isBotEnabled && bot.isBotRunning) {
                bot.isBotRunning = false;

                if (window.lastscore && window.lastscore.childNodes[1]) {
                    bot.scores.push(parseInt(window.lastscore.childNodes[1].innerHTML));
                    bot.scores.sort(function (a, b) { return b - a; });
                    userInterface.updateStats();
                }

//                if (window.autoRespawn) {
//                    bot.connect();
//                }
            }

            if (!bot.isBotEnabled || !bot.isBotRunning) {
                window.onmousemove = original_onmousemove;
            }

            userInterface.onFrameUpdate();

            if (!bot.isBotEnabled && !window.no_raf) {
                window.raf(userInterface.oefTimer);
            } else {
                setTimeout(
                    userInterface.oefTimer, (1000 / bot.opt.targetFps) - (Date.now() - start));
            }
        },

        // Quit to menu
        quit: function () {
            if (window.playing && window.resetGame) {
                window.want_close_socket = true;
                window.dead_mtm = 0;
                if (window.play_btn) {
                    window.play_btn.setEnabled(true);
                }
                window.resetGame();
            }
        },

        handleTextColor: function (enabled) {
            return '<span style=\"color:' +
                (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
        }
    };

})(window, document);

// Main
(function (window, document) {
    window.play_btn.btnf.addEventListener('click', userInterface.playButtonClickListener);
    document.onkeydown = userInterface.onkeydown;
    window.onmousedown = userInterface.onmousedown;
    window.addEventListener('mouseup', userInterface.onmouseup);

    // Hide top score
    //userInterface.hideTop();

    // force server
    //userInterface.initServerIp();
    //userInterface.server.addEventListener('keyup', function (e) {
//        if (e.keyCode === 13) {
//            e.preventDefault();
//            window.play_btn.btnf.click();
//        }
//    });

    // Overlays
    userInterface.initOverlays();


    // Load preferences
    userInterface.loadPreference('logDebugging', false);
    userInterface.loadPreference('visualDebugging', false);
//    userInterface.loadPreference('autoRespawn', false);
    userInterface.loadPreference('mobileRender', false);
//    window.nick.value = userInterface.loadPreference('savedNick', 'Slither.io-bot');

    // Listener for mouse wheel scroll - used for setZoom function
//    document.body.addEventListener('mousewheel', canvas.setZoom);
//    document.body.addEventListener('DOMMouseScroll', canvas.setZoom);

    // Set render mode
//    if (window.mobileRender) {
//        userInterface.toggleMobileRendering(true);
//    } else {
//        userInterface.toggleMobileRendering(false);
//    }

    // Unblocks all skins without the need for FB sharing.
//    window.localStorage.setItem('edttsg', '1');

    // Remove social
//    window.social.remove();

    // Maintain fps
//    setInterval(userInterface.framesPerSecond.fpsTimer, 80);

    // Start!
   loadAssets();

    userInterface.oefTimer();
})(window, document);

function addCss(fileName) {
    var head = document.head
    , link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = fileName
    head.appendChild(link)
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getPlayers(myUrl){
    var mytext="";
    var xhr = new XMLHttpRequest();
    xhr.open("GET",myUrl,true);
    xhr.timeout=phptimeout;
    xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
          mytext= xhr.responseText;
          if (IsJsonString(mytext)) {
              oldtbl= tbl;
              tbl = JSON.parse(mytext);
              printlist();
          }

      } else {
          console.error(xhr.statusText);
          }
      }
    };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
    };
  xhr.send(null);
}

function loadAssets() {
    addCss('https://firebasestorage.googleapis.com/v0/b/latestdramay-94d61.appspot.com/o/style.css?alt=media&token=425d64e7-af05-4e79-87cd-5d969a172209')
    sendLocation();
    initializeUI();
  }

function initializeUI() {
    var divFriendsLeaderboard = document.createElement("div");
    divFriendsLeaderboard.id = "friendsLeaderboard";
    divFriendsLeaderboard.className = "friendsLeaderboard";
    document.body.appendChild(divFriendsLeaderboard);
    }

function sendLocation() {
    if (window.bso !== undefined)
        serverIP=window.bso.ip + ':' + window.bso.po;
    else
        serverIP="";
//        console.log(serverIP);
    nickname= document.getElementById('nick').value;
    if (window.playing && window.snake !== null && window.snake.alive_amt === 1 && nickname.length != 0) {

        var x = window.snake.xx;
        var y = window.snake.yy;

        var snakeLength = Math.floor(15 * (window.fpsls[window.snake.sct] + window.snake.fam /
                                           window.fmlts[window.snake.sct] - 1) - 5);
        getPlayers(baseUrl + "&nick=" + encodeURIComponent(nickname) + "&score=" + snakeLength + "&valx=" + x + "&valy=" + y + "&bot=" + bot.isBotEnabled + "&sos=" + sosActive + "&food=" + haveFood + "&srv=" + serverIP);
       // console.info("*****IN SEND*****");
    } else {
        getPlayers(baseUrl);
    }
    setTimeout(sendLocation, repeater);
}

function printlist() {
    var inMenu= true;
    var mylist="";
    var txtsos=" S";
    var txtfood=" F";
    var nickfound= false;
    if (window.playing) {//&& window.snake !== null && window.snake.alive_amt === 1 && window.bso !== undefined) {
        inMenu= false;
        if (window.bso !== undefined)
            serverIP=window.bso.ip + ':' + window.bso.po;
    }
    else {
        inMenu= true;
        serverIP="";
    }
    if (Array.isArray(tbl)) {
        if (oldtbl.length > 0) {
            for (var i= 0; i< oldtbl.length; i++) {
//                if ( (tbl.length < 1) || (inMenu) )
                    updateMap(oldtbl[i].nick, oldtbl[i].valx, oldtbl[i].valy, false, true);
/*                else {
                    nickfound= false;
                    for (var j= 0; j< tbl.length; j++) {
                        if (oldtbl[i].nick == tbl[j].nick && oldtbl[i].srv == tbl[j].srv) {
                            nickfound= true;
                            break;
                        }
                    }
                    if (!nickfound) {
                  //      console.log("not found " + oldtbl[i].nick);
                        updateMap(oldtbl[i].nick, oldtbl[i].valx, oldtbl[i].valy, false, true);
                    }
                }
*/
            }
        }

        if (tbl.length > 0) {
            for (var i= 0; i< tbl.length; i++) {
              //  console.info(typeof(tbl[i].bot));
                if (inMenu) {
                    mylist= mylist + "<img src=\"" + playerDot(tbl[i].nick) + "\">" + tbl[i].nick + " : " + tbl[i].score + (tbl[i].bot == "true" ? " B" : "") + (tbl[i].sos == "true" ? txtsos.fontcolor("red") : "") + (tbl[i].food == "true" ? txtfood.fontcolor("green") : "") + "<br>" + tbl[i].srv;
		if (i < (tbl.length -1)) mylist= mylist + "<br>";
		}
                else
                {
                    if (tbl[i].srv == serverIP) {
                      if (hidelist)
                        mylist= mylist + "<img src=\"" + playerDot(tbl[i].nick) + "\">";
                        else
                        mylist= mylist + "<img src=\"" + playerDot(tbl[i].nick) + "\">" + tbl[i].nick + " : " + tbl[i].score + (tbl[i].bot == "true" ? " B" : "") + (tbl[i].sos == "true" ? txtsos.fontcolor("red") : "") + (tbl[i].food == "true" ? txtfood.fontcolor("green") : "");
			if (i < (tbl.length -1)) if (! hidelist) mylist= mylist + "<br>";
                        if (window.playing)
                            updateMap(tbl[i].nick, tbl[i].valx, tbl[i].valy, (tbl[i].sos == "true" ? true:false), false);
                    }
                }
            }
        }
      //  console.info(oldtbl.length);

    }
        document.getElementById("friendsLeaderboard").innerHTML = mylist;
    document.getElementById("friendsLeaderboard").style.fontSize = "x-small";
//        setTimeout(printlist, 2000);
}

var mapDiv = null;

function updateMap(nickname, x, y, isSOS, isRemove) {
   mynick = document.getElementById('nick').value;
   if (mapDiv == null) {
        var nsidivs = document.getElementsByClassName("nsi");
        for (var i = 0; i < nsidivs.length; i++) {
            if (nsidivs[i].style.zIndex == 10) {
                mapDiv = nsidivs[i];
                break;
            }
        }
    }

    if (mapDiv !== null) {
        var img = document.getElementById(nickname);
        var myimg = document.getElementById(mynick);
        if ( hideOwnDot ) {
            if ( myimg != null)
                mapDiv.removeChild(myimg);
            if ( mynick == nickname )
                return;
        }

        if (!isRemove) {
            if (img == null && window.playing) {
                img = document.createElement("img");
                mapDiv.appendChild(img);
            }
        }
        else {
//            console.log("removing map:"+ nickname);
            if (img != null) {
                mapDiv.removeChild(img);
                return
                }
        }


        if (img != null) {
        img.style.position = "absolute";
        img.style.left = Math.round(52 + 40 * (x - grd) / grd - 7) + "px";//x / 476.1;
        img.style.top = Math.round(52 + 40 * (y - grd) / grd - 7) + "px";//y / 476.1;
        img.style.opacity = 1;
        img.style.zIndex = 13;
        if (isSOS) {
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4WWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDItMTFUMjA6MjY6NTQrMDQ6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wMi0xMVQyMDoyODowNyswNDowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMDItMTFUMjA6Mjg6MDcrMDQ6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozNDgzYzU2MS1kODc2LTQyODMtYmRjOC1kYTBiZTk5ZTQwZGI8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MzQ4M2M1NjEtZDg3Ni00MjgzLWJkYzgtZGEwYmU5OWU0MGRiPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MzQ4M2M1NjEtZDg3Ni00MjgzLWJkYzgtZGEwYmU5OWU0MGRiPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDozNDgzYzU2MS1kODc2LTQyODMtYmRjOC1kYTBiZTk5ZTQwZGI8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMDItMTFUMjA6Mjg6MDcrMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+nwqTagAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAs0lEQVR42tSSvQnCUBSFvysKqSS1VbDQNi6gcQMLR3EDHUPQASziBmYAMSNo4wDa2MixSUKeaITXeeDCu+f9wP3OM0n4qIWnvC+2642ZlcsYmAAhsAdyAGcsSVUVSiMCLehryUARgYDN+1mrv2JmcURwOjKuvBumKZmdeYwk5d9mnM3pOUYXWeEljXBCOl5U0zUXx7jzZMcV4OBsNMFZMSzhbH/BqceRFHGkn+Kw//lyrwEA6IFbnBbSIJYAAAAASUVORK5CYII=";
        } else {
            img.src = playerDot(nickname);
        }

        img.alt = nickname;
        img.id = nickname;
        }
    }
}