// ==UserScript==
// @name         SLICKio by LehGogh
// @namespace    SLICKio
// @version      1.0
// @description  Slither.io mod based off of SLITio with code from kmc's mod
// @author       LehGogh
// @match        http://slither.io/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424811/SLICKio%20by%20LehGogh.user.js
// @updateURL https://update.greasyfork.org/scripts/424811/SLICKio%20by%20LehGogh.meta.js
// ==/UserScript==

// Source: https://raw.githubusercontent.com/lehgogh/SLICKio/master/test.user.js

(function(w) {
    var modVersion = "v1.0",
        renderMode = 2, // 3 - normal, 2 - optimized, 1 - simple (mobile)
        normalMode = false,
        gameFPS = null,
        dataHUD = null,
        styleHUD = "color: #FFF; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 14px; position: fixed; opacity: 1; z-index: 100000000;",
        inpNick = null,
        currentIP = null,
        retry = 0,
        bgImage = null;
    function init() {
        // Append DIVs
        appendDiv("data-hud", "nsi", styleHUD + "right: 30; bottom: 120px;");
        dataHUD = document.getElementById("data-hud");
        // Quick resp (ESC) and zoom (+ and -)
        w.onkeydown = function(e) {
            if (e.keyCode == 27) {
                forceConnect();
            } else if (e.keyCode == 187) {
                w.gsc += 0.25
            } else if (e.keyCode == 189) {
                w.gsc -= 0.25
            }
        };
        // Hijack console log
        /*
        if (w.console) {
            w.console.logOld = console.log;
            w.console.log = getConsoleLog;
        }
        */
        // Set menu
        setMenu();
        // Set leaderboard
        setLeaderboard();
        // Set graphics
        setGraphics();
        // Update loop
        updateLoop();
    }
    // Append DIV
    function appendDiv(id, className, style) {
        var div = document.createElement("div");
        if (id) {
            div.id = id;
        }
        if (className) {
            div.className = className;
        }
        if (style) {
            div.style = style;
        }
        document.body.appendChild(div);
    }
    // Zoom
    function zoom(e) {
        if (!w.gsc) {
            return;
        }
        w.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
    }
    // Get console log
    function getConsoleLog(log) {
        //w.console.logOld(log);
        if (log.indexOf("FPS") != -1) {
            gameFPS = log;
        }
    }
    // Set menu
    function setMenu() {
        var login = document.getElementById("login");
        if (login) {
            // Load settings
            loadSettings();
            // Message
            var div = document.createElement("div");
            if(document.getElementById("nick").value == "" || document.getElementById("nick").value == null){document.getElementById("nick").value = "Visit Slitherio.org";}
            div.style.width = "700px";
            div.style.color = "#85f9ae";
            div.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            div.style.fontSize = "14px";
            div.style.textAlign = "center";
            div.style.opacity = "2";
            div.style.margin = "0 auto";
            div.style.padding = "5px 0";
            div.textContent = "Visit Slitherio.org - Get the best Slither.io Mods & Hacks today.";
            login.appendChild(div);
            // Menu container
            var sltMenu = document.createElement("div");
            sltMenu.style.width = "360px";
            sltMenu.style.color = "#8058D0";
            sltMenu.style.backgroundColor = "#1e262e";
            sltMenu.style.borderRadius = "29px";
            sltMenu.style.fontFamily = "'Lucida Sans Unicode', 'Lucida Grande', sans-serif";
            sltMenu.style.fontSize = "14px";
            sltMenu.style.textAlign = "center";
            sltMenu.style.margin = "0 auto 100px auto";
            sltMenu.style.padding = "10px 14px";
            sltMenu.innerHTML = "MOD on <strong>Slitherio.org</strong> | <strong>" + modVersion + "</strong>";
            login.appendChild(sltMenu);
            // IP input container
            var div = document.createElement("div");
            div.style.color = "#8058D0";
            div.style.backgroundColor = "#4C447C";
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // IP input
            var input = document.createElement("input");
            input.id = "server-ip";
            input.type = "text";
            input.placeholder = "Select or Type Your IP Here";
            input.style.height = "26px";
            input.style.display = "inline-block";
            input.style.background = "none";
            input.style.color = "#ffffff";
            input.style.border = "none";
            input.style.outline = "none";
            div.appendChild(input);
            // Connect (play) button
            var button = document.createElement("input");
            button.id = "connect-btn";
            button.type = "button";
            button.value = "PLAY With Selected IP";
            button.style.height = "24px";
            button.style.display = "inline-block";
            button.style.borderRadius = "12px";
            button.style.color = "#FFF";
            button.style.backgroundColor = "#56ac81";
            button.style.border = "none";
            button.style.outline = "none";
            button.style.cursor = "pointer";
            button.style.padding = "0 20px";
            div.appendChild(button);
            // Select server container
            var div = document.createElement("div");
            div.style.backgroundColor = "#919191";
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // Select server
            var select = document.createElement("select");
            select.id = "select-srv";
            select.style.background = "none";
            select.style.border = "none";
            select.style.outline = "none";
            var option = document.createElement("option");
            option.value = "";
            option.text = "Play With Friends - Select a Server";
            select.appendChild(option);
            div.appendChild(select);
            // Select graph container
            var div = document.createElement("div");
            div.style.backgroundColor = "#A5A5A5";
            div.style.borderRadius = "29px";
            div.style.margin = "10 auto";
            div.style.padding = "8px";
            sltMenu.appendChild(div);
            // Select graph
            var select = document.createElement("select");
            select.id = "select-graph";
            select.style.background = "none";
            select.style.border = "none";
            select.style.outline = "none";
            div.appendChild(select);
            var option = document.createElement("option");
            option.value = "3";
            option.text = "Graphic Quality: Normal";
            select.appendChild(option);
            var option = document.createElement("option");
            option.value = "2";
            option.text = "Graphic Quality: Optimized";
            select.appendChild(option);
            var option = document.createElement("option");
            option.value = "1";
            option.text = "Graphic Quality: Low";
            select.appendChild(option);
            // Get IP input
            inpIP = document.getElementById("server-ip");
            // Get nick
            var nick = document.getElementById("nick");
            nick.addEventListener("input", getNick, false);
            // Force connect
            var connectBtn = document.getElementById("connect-btn");
            connectBtn.onclick = forceConnect;
            // Get servers list
            getServersList();
            // Set graphic mode
            var selectGraph = document.getElementById("select-graph");
            if (renderMode == 1) {
                selectGraph.selectedIndex = 2;
            } else if (renderMode == 2) {
                selectGraph.selectedIndex = 1;
            } else {
                selectGraph.selectedIndex = 0;
                normalMode = true;
            }
            selectGraph.onchange = function() {
                var mode = selectGraph.value;
                if (mode) {
                    renderMode = mode;
                    localStorage.setItem("rendermode", renderMode);
                }
            };
            resizeView();
        } else {
            setTimeout(setMenu, 100);
        }
    }
    // Load settings
    function loadSettings() {
        if (w.localStorage.getItem("nick") != null) {
            var nick = w.localStorage.getItem("nick");
            document.getElementById("nick").value = nick;
        }
        if (w.localStorage.getItem("rendermode") != null) {
            var mode = parseInt(w.localStorage.getItem("rendermode"));
            if (mode >= 1 && mode <= 3) {
                renderMode = mode;
            }
        }
    }
    // Get nick
    function getNick() {
        var nick = document.getElementById("nick").value;
        w.localStorage.setItem("nick", nick);
    }
    // Connection status
    function connectionStatus() {
        if (!w.connecting || retry == 10) {
            w.forcing = false;
            retry = 0;
            return;
        }
        retry++;
        setTimeout(connectionStatus, 1000);
    }
    // Force connect
    function forceConnect() {
        if (inpIP.value.length == 0 || !w.connect) {
            return;
        }
        w.forcing = true;
        if (!w.bso) {
            w.bso = {};
        }
        var srv = inpIP.value.trim().split(":");
        w.bso.ip = srv[0];
        w.bso.po = srv[1];
        w.connect();
        setTimeout(connectionStatus, 1000);
    }
    // Get servers list
    function getServersList() {
        if (w.sos && w.sos.length > 0) {
            var selectSrv = document.getElementById("select-srv");
            for (var i = 0; i < sos.length; i++) {
                var srv = sos[i];
                var option = document.createElement("option");
                option.value = srv.ip + ":" + srv.po;
                option.text = (i + 1) + ". " + option.value;
                selectSrv.appendChild(option);
            }
            selectSrv.onchange = function() {
                var srv = selectSrv.value;
                inpIP.value = srv;
            };
        } else {
            setTimeout(getServersList, 100);
        }
    }
    // Resize view
    function resizeView() {
        if (w.resize) {
            w.lww = 0; // Reset width (force resize)
            w.wsu = 0; // Clear ad space
            w.resize();
            var wh = Math.ceil(w.innerHeight);
            if (wh < 800) {
                var login = document.getElementById("login");
                w.lgbsc = wh / 800;
                login.style.top = - (Math.round(wh * (1 - w.lgbsc) * 1E5) / 1E5) + "px";
                if (w.trf) {
                    w.trf(login, "scale(" + w.lgbsc + "," + w.lgbsc + ")");
                }
            }
        } else {
            setTimeout(resizeView, 100);
        }
    }
    // Set leaderboard
    function setLeaderboard() {
        if (w.lbh) {
            w.lbh.textContent = "Leaderboard";
            w.lbh.style.fontSize = "20px";
        } else {
            setTimeout(setLeaderboard, 100);
        }
    }
    // Set normal mode
    function setNormalMode() {
        normalMode = true;
        w.ggbg = true;
        if (!w.bgp2 && bgImage) {
            w.bgp2 = bgImage;
        }
        w.render_mode = 2;
    }
    // Set graphics
    function setGraphics() {
        if (renderMode == 3) {
            if (!normalMode) {
                setNormalMode();
            }
            return;
        }
        if (normalMode) {
            normalMode = false;
        }
        if (w.want_quality && w.want_quality != 0) {
            w.want_quality = 0;
            w.localStorage.setItem("qual", "0");
            w.grqi.src = "/s/lowquality.png";
        }
        if (w.ggbg && w.gbgmc) {
            w.ggbg = false;
        }
        if (w.bgp2) {
            bgImage = w.bgp2;
            w.bgp2 = null;
        }
        if (w.high_quality) {
            w.high_quality = false;
        }
        if (w.gla && w.gla != 0) {
            w.gla = 0;
        }
        if (w.render_mode && w.render_mode != renderMode) {
            w.render_mode = renderMode;
        }
    }
    // Update loop
    function updateLoop() {
        setGraphics();
        if (w.playing) {
            var html = `
            IP: ` + w.bso.ip + `<br>
            X: ` + Math.round(snake.xx) + `<br>
            Y: ` + Math.round(snake.yy) + `<br>
            `;

            dataHUD.innerHTML = html;
        }
        setTimeout(updateLoop, 1000);
    }
    // Init
    init();
})(window);